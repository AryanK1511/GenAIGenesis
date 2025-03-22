# backend/app/services/WebSocketService/__init__.py

import json
import uuid
from typing import Dict

from fastapi import WebSocket

from app.utils.logger import CustomLogger


class WebSocketService:
    _camera_connections: Dict[str, WebSocket] = {}
    _frontend_connections: Dict[str, WebSocket] = {}
    _lock = False

    @classmethod
    async def connect_camera(cls, websocket: WebSocket) -> str:
        try:
            if not cls._lock:
                cls._lock = True
                camera_id = str(uuid.uuid4())
                await websocket.accept()
                cls._camera_connections[camera_id] = websocket
                CustomLogger.create_log("info", f"Camera connected: {camera_id}")
                return camera_id
            else:
                CustomLogger.create_log(
                    "warning",
                    "Camera connection rejected - another camera connection is active",
                )
                await websocket.close(
                    code=1008, reason="Another camera connection is active"
                )
                return None
        except Exception as e:
            CustomLogger.create_log("error", f"Error in camera connection: {str(e)}")
            await websocket.close(code=1011, reason=str(e))
            return None
        finally:
            cls._lock = False

    @classmethod
    async def connect_frontend(cls, websocket: WebSocket) -> str:
        try:
            frontend_id = str(uuid.uuid4())
            await websocket.accept()
            cls._frontend_connections[frontend_id] = websocket
            CustomLogger.create_log("info", f"Frontend connected: {frontend_id}")
            return frontend_id
        except Exception as e:
            CustomLogger.create_log("error", f"Error in frontend connection: {str(e)}")
            await websocket.close(code=1011, reason=str(e))
            return None

    @classmethod
    def disconnect_camera(cls, camera_id: str):
        try:
            if camera_id in cls._camera_connections:
                del cls._camera_connections[camera_id]
                CustomLogger.create_log("info", f"Camera disconnected: {camera_id}")
        except Exception as e:
            CustomLogger.create_log("error", f"Error disconnecting camera: {str(e)}")

    @classmethod
    def disconnect_frontend(cls, frontend_id: str):
        try:
            if frontend_id in cls._frontend_connections:
                del cls._frontend_connections[frontend_id]
                CustomLogger.create_log("info", f"Frontend disconnected: {frontend_id}")
        except Exception as e:
            CustomLogger.create_log("error", f"Error disconnecting frontend: {str(e)}")

    @classmethod
    async def broadcast_to_frontend(cls, message: dict):
        if not cls._frontend_connections:
            return

        disconnected = []
        for frontend_id, connection in cls._frontend_connections.items():
            try:
                await connection.send_text(json.dumps(message))
            except Exception as e:
                CustomLogger.create_log(
                    "error", f"Error broadcasting to frontend {frontend_id}: {str(e)}"
                )
                disconnected.append(frontend_id)

        for frontend_id in disconnected:
            cls.disconnect_frontend(frontend_id)
