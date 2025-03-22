# backend/app/websocket/router.py

from fastapi import APIRouter

from app.websocket.endpoints import frontend, camera    

websocket_router = APIRouter()

websocket_router.include_router(frontend.router, tags=["frontend"])
websocket_router.include_router(camera.router, tags=["camera"])