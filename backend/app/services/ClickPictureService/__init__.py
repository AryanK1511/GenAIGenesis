# backend/app/services/ClickPictureService/__init__.py

import os

import cv2

from app.services.GCPBucketService import GCPBucketService
from app.utils.logger import CustomLogger


class ClickPictureService:
    def __init__(self, bucket_name: str):
        self.camera = None
        self.bucket_service = GCPBucketService(bucket_name)
        self.temp_dir = "temp_captures"
        os.makedirs(self.temp_dir, exist_ok=True)

    def initialize_camera(self):
        try:
            if self.camera is not None and self.camera.isOpened():
                return True

            self.camera = cv2.VideoCapture(1)
            if not self.camera.isOpened():
                self.camera = cv2.VideoCapture(0)
                CustomLogger.log(
                    "INFO",
                    "Could not open camera on index 1, trying index 0",
                )
                if not self.camera.isOpened():
                    raise Exception("Could not open camera")
            return True
        except Exception as e:
            print(f"Error initializing camera: {str(e)}")
            return False

    def delete_captures(self):
        try:
            # List all captures in the bucket
            result = self.bucket_service.list_files(prefix="captures/")
            if not result["success"]:
                return result

            # Delete each capture
            for file_name in result["files"]:
                delete_result = self.bucket_service.delete_file(file_name)
                if not delete_result["success"]:
                    return delete_result

            return {"success": True}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def capture_picture(self):
        try:
            if self.camera is None or not self.camera.isOpened():
                raise Exception("Camera is not initialized")

            ret, frame = self.camera.read()
            if not ret:
                raise Exception("Failed to capture frame")

            # List existing captures to determine next number
            result = self.bucket_service.list_files(prefix="captures/capture_")
            if not result["success"]:
                return result

            existing_captures = [
                f
                for f in result["files"]
                if f.startswith("captures/capture_") and f.endswith(".jpg")
            ]
            next_number = 1
            if existing_captures:
                numbers = [
                    int(f.split("_")[1].split(".")[0]) for f in existing_captures
                ]
                next_number = max(numbers) + 1

            # Save temporarily to local file
            temp_filename = f"capture_{next_number}.jpg"
            temp_file_path = os.path.join(self.temp_dir, temp_filename)
            cv2.imwrite(temp_file_path, frame)

            # Upload to GCS
            gcs_filename = f"captures/{temp_filename}"
            upload_result = self.bucket_service.upload_file(
                temp_file_path, gcs_filename
            )

            # Clean up temporary file
            os.remove(temp_file_path)

            return upload_result

        except Exception as e:
            return {"success": False, "error": str(e)}

    def release_camera(self):
        if self.camera is not None:
            self.camera.release()
            self.camera = None
