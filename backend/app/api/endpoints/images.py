# backend/app/api/endpoints/images.py

import os

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

router = APIRouter()


@router.get("/images/{filename}")
async def get_image(filename: str):
    image_path = os.path.join("captures", filename)
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(image_path)
