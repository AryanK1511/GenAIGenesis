# backend/app/api/router.py

from fastapi import APIRouter

from app.api.endpoints import chat

api_router = APIRouter()
api_router.include_router(chat.router, tags=["chat"])
