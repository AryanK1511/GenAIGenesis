# backend/app/services/ClickPictureService/__init__.py

import os

import cv2


class ClickPictureService:
    def __init__(self):
        self.camera = None

    def initialize_camera(self):
        try:
            if self.camera is not None and self.camera.isOpened():
                return True

            self.camera = cv2.VideoCapture(1)
            if not self.camera.isOpened():
                self.camera = cv2.VideoCapture(0)
                if not self.camera.isOpened():
                    raise Exception("Could not open camera")
            return True
        except Exception as e:
            print(f"Error initializing camera: {str(e)}")
            return False

    def delete_captures(self):
        try:
            for file in os.listdir("captures"):
                if file.startswith("capture_") and file.endswith(".jpg"):
                    os.remove(os.path.join("captures", file))
            return {"success": True}
        except Exception as e:
            return {"success": False, "error": str(e)}

    def capture_picture(self):
        try:
            if self.camera is None or not self.camera.isOpened():
                raise Exception("Camera is not initialized")

            os.makedirs("captures", exist_ok=True)

            ret, frame = self.camera.read()
            if not ret:
                raise Exception("Failed to capture frame")

            existing_captures = [
                f
                for f in os.listdir("captures")
                if f.startswith("capture_") and f.endswith(".jpg")
            ]
            next_number = 1
            if existing_captures:
                numbers = [
                    int(f.split("_")[1].split(".")[0]) for f in existing_captures
                ]
                next_number = max(numbers) + 1

            filename = f"capture_{next_number}.jpg"
            file_path = os.path.join("captures", filename)

            cv2.imwrite(file_path, frame)
            return {"success": True, "file_path": file_path}

        except Exception as e:
            return {"success": False, "error": str(e)}

    def release_camera(self):
        if self.camera is not None:
            self.camera.release()
            self.camera = None
