# backend/app/services/OCRService/__init__.py

import os
import tempfile
from urllib.parse import urlparse

from google.cloud import storage, vision

from app.config import settings
from app.utils.logger import CustomLogger


class OCRService:
    def __init__(self):
        self.client = vision.ImageAnnotatorClient.from_service_account_file(
            settings.GOOGLE_APPLICATION_CREDENTIALS
        )
        self.storage_client = storage.Client()

    def _download_from_gcs(self, image_url: str) -> str:
        try:
            # Parse URL
            parsed_url = urlparse(image_url)
            if parsed_url.netloc != "storage.googleapis.com":
                return image_url

            # Extract bucket and blob path from URL
            path_parts = parsed_url.path.strip("/").split("/")
            bucket_name = path_parts[0]
            blob_path = "/".join(path_parts[1:])

            # Create a temporary file
            temp_dir = tempfile.gettempdir()
            temp_path = os.path.join(temp_dir, os.path.basename(blob_path))

            # Download the file
            bucket = self.storage_client.bucket(bucket_name)
            blob = bucket.blob(blob_path)
            blob.download_to_filename(temp_path)

            return temp_path
        except Exception as e:
            CustomLogger.create_log("error", f"Error downloading from GCS: {str(e)}")
            raise

    def ocr_image(self, image_path: str) -> str:
        try:
            # Download from GCS if needed
            local_path = self._download_from_gcs(image_path)

            with open(local_path, "rb") as image_file:
                content = image_file.read()

            image = vision.Image(content=content)
            response = self.client.document_text_detection(image=image)

            if response.error.message:
                raise Exception(f"Error detecting text: {response.error.message}")

            extracted_text = ""
            for page in response.full_text_annotation.pages:
                for block in page.blocks:
                    for paragraph in block.paragraphs:
                        for word in paragraph.words:
                            word_text = "".join(
                                [symbol.text for symbol in word.symbols]
                            )
                            extracted_text += word_text + " "

            # Clean up temporary file if it was downloaded from GCS
            if local_path != image_path:
                os.remove(local_path)

            return extracted_text.strip()

        except Exception as e:
            CustomLogger.create_log("error", f"Error in OCR processing: {str(e)}")
            raise

    def process_documents(self, base_path: str) -> str:
        try:
            all_text = []

            # Handle GCS public URL
            if base_path.startswith("https://storage.googleapis.com/"):
                # List files in GCS bucket
                parsed_url = urlparse(base_path)
                path_parts = parsed_url.path.strip("/").split("/")
                bucket_name = path_parts[0]
                prefix = "/".join(path_parts[1:])

                bucket = self.storage_client.bucket(bucket_name)
                blobs = bucket.list_blobs(prefix=prefix)
                image_files = [
                    blob.name
                    for blob in blobs
                    if blob.name.lower().endswith((".jpg", ".jpeg"))
                ]
                image_files.sort()

                for image_file in image_files:
                    image_url = (
                        f"https://storage.googleapis.com/{bucket_name}/{image_file}"
                    )
                    CustomLogger.create_log(
                        "info", f"Processing file {image_file} from GCS"
                    )
                    page_text = self.ocr_image(image_url)
                    all_text.append(page_text)
            else:
                # Handle local path
                image_files = [
                    f for f in os.listdir(base_path) if f.endswith((".jpg", ".JPG"))
                ]
                image_files.sort()

                for image_file in image_files:
                    image_path = os.path.join(base_path, image_file)
                    CustomLogger.create_log(
                        "info", f"Processing file {image_file} at {image_path}"
                    )
                    page_text = self.ocr_image(image_path)
                    all_text.append(page_text)

            return "\n\n".join(all_text)

        except Exception as e:
            CustomLogger.create_log("error", f"Error processing document: {str(e)}")
            raise
