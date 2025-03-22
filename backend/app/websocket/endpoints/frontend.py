# backend/app/websocket/endpoints/frontend.py

import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.WebSocketService import WebSocketService
from app.utils.logger import CustomLogger

router = APIRouter()


@router.websocket("/frontend")
async def frontend_websocket_endpoint(websocket: WebSocket):
    frontend_id = None
    try:
        frontend_id = await WebSocketService.connect_frontend(websocket)
        if not frontend_id:
            return

        CustomLogger.create_log(
            "info", f"Frontend client connected with ID: {frontend_id}"
        )

        await websocket.send_text(
            json.dumps(
                {
                    "status": "connected",
                    "message": "Frontend WebSocket connected successfully",
                    "client_id": frontend_id,
                }
            )
        )
        CustomLogger.create_log(
            "info", f"Sent initial connection success message to frontend {frontend_id}"
        )

        while True:
            try:
                data = await websocket.receive_text()
                message = json.loads(data)
                CustomLogger.create_log(
                    "info", f"Frontend {frontend_id} received message: {message}"
                )

                response = {
                    "status": "received",
                    "message": "Message received by frontend",
                    "client_id": frontend_id,
                }
                await websocket.send_text(json.dumps(response))
                CustomLogger.create_log(
                    "info", f"Sent acknowledgment message to frontend {frontend_id}"
                )

            except WebSocketDisconnect:
                CustomLogger.create_log(
                    "info",
                    f"WebSocket disconnected for frontend {frontend_id}, raising exception",
                )
                raise
            except json.JSONDecodeError as e:
                CustomLogger.create_log(
                    "error",
                    f"Invalid JSON received from frontend {frontend_id}: {str(e)}",
                )
                continue
            except Exception as e:
                CustomLogger.create_log(
                    "error", f"Error in frontend {frontend_id} websocket: {str(e)}"
                )
                continue

    except WebSocketDisconnect:
        CustomLogger.create_log("info", f"Frontend client {frontend_id} disconnected")
    except Exception as e:
        CustomLogger.create_log(
            "error", f"Error in frontend {frontend_id} websocket connection: {str(e)}"
        )
    finally:
        if frontend_id:
            CustomLogger.create_log(
                "info", f"Cleaning up frontend connection {frontend_id}"
            )
            WebSocketService.disconnect_frontend(frontend_id)
            try:
                await websocket.close()
            except:
                pass
