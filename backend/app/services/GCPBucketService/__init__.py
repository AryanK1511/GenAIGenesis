# backend/app/services/GCPBucketService/__init__.py

import os
from typing import Any, Dict, Optional

from google.cloud import storage

from app.utils.logger import CustomLogger


class GCPBucketService:
    def __init__(self, bucket_name: str):
        self.bucket_name = bucket_name
        self.storage_client = storage.Client()
        self.bucket = self.storage_client.bucket(bucket_name)

    def get_public_url(self, blob_name: str) -> str:
        """Generate a signed URL for the blob that expires in 1 hour."""
        try:
            blob = self.bucket.blob(blob_name)
            url = blob.generate_signed_url(
                version="v4",
                expiration=3600,
                method="GET",
            )
            return url
        except Exception as e:
            CustomLogger.log("ERROR", f"Error generating signed URL: {str(e)}")
            # Fallback to public URL if signed URL generation fails
            return f"https://storage.googleapis.com/{self.bucket_name}/{blob_name}"

    def upload_file(
        self, file_path: str, destination_blob_name: Optional[str] = None
    ) -> Dict[str, Any]:
        try:
            if not os.path.exists(file_path):
                return {"success": False, "error": f"File {file_path} does not exist"}

            if destination_blob_name is None:
                destination_blob_name = os.path.basename(file_path)

            blob = self.bucket.blob(destination_blob_name)
            blob.upload_from_filename(file_path)

            # Return the public URL instead of GCS URL
            return {
                "success": True,
                "file_path": self.get_public_url(destination_blob_name),
            }
        except Exception as e:
            CustomLogger.log("ERROR", f"Error uploading file to GCS: {str(e)}")
            return {"success": False, "error": str(e)}

    def delete_file(self, blob_name: str) -> Dict[str, Any]:
        try:
            blob = self.bucket.blob(blob_name)
            blob.delete()
            return {"success": True}
        except Exception as e:
            CustomLogger.log("ERROR", f"Error deleting file from GCS: {str(e)}")
            return {"success": False, "error": str(e)}

    def list_files(self, prefix: str = "") -> Dict[str, Any]:
        try:
            blobs = self.bucket.list_blobs(prefix=prefix)
            files = [blob.name for blob in blobs]
            return {"success": True, "files": files}
        except Exception as e:
            CustomLogger.log("ERROR", f"Error listing files from GCS: {str(e)}")
            return {"success": False, "error": str(e)}

    def download_file(
        self, blob_name: str, destination_file_path: str
    ) -> Dict[str, Any]:
        try:
            blob = self.bucket.blob(blob_name)
            blob.download_to_filename(destination_file_path)
            return {"success": True}
        except Exception as e:
            CustomLogger.log("ERROR", f"Error downloading file from GCS: {str(e)}")
            return {"success": False, "error": str(e)}
