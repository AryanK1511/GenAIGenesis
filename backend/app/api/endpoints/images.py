# backend/app/api/endpoints/images.py

from fastapi import APIRouter, HTTPException
from fastapi.responses import RedirectResponse

from app.config import settings
from app.services.GCPBucketService import GCPBucketService

router = APIRouter()
bucket_service = GCPBucketService(settings.GCP_BUCKET_NAME)


@router.get("/images/{filename}")
async def get_image(filename: str):
    try:
        blob = bucket_service.bucket.blob(f"captures/{filename}")
        url = blob.generate_signed_url(
            version="v4",
            expiration=3600,
            method="GET",
        )

        if not url:
            raise HTTPException(status_code=404, detail="Image not found")

        return RedirectResponse(url=url)
    except Exception:
        raise HTTPException(status_code=404, detail="Image not found")
