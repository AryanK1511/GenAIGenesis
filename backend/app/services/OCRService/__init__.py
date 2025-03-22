# backend/app/services/OCRService/__init__.py

import os

from google.cloud import vision

from app.config import settings
from app.utils.logger import CustomLogger


class OCRService:
    def __init__(self):
        self.client = vision.ImageAnnotatorClient.from_service_account_file(
            settings.GOOGLE_APPLICATION_CREDENTIALS
        )

    def ocr_image(self, image_path: str) -> str:
        try:
            with open(image_path, "rb") as image_file:
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

            return extracted_text.strip()

        except Exception as e:
            CustomLogger.create_log("error", f"Error in OCR processing: {str(e)}")
            raise

    def process_documents(self, base_path: str) -> str:
        try:
            all_text = []

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
