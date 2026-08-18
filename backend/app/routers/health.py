import datetime
from fastapi import APIRouter
from app.core.config import settings
from app.ml.model_loader import model_loader

router = APIRouter(tags=["Health Check"])

@router.get("/health")
async def health_check():
    return {
        "status": "online",
        "service": settings.APP_NAME,
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

@router.get("/health/models")
async def models_health_check():
    return {
        "status": "online",
        "models": model_loader.get_all_status(),
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }
