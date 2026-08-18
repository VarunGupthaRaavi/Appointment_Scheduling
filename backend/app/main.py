import os
import sys

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import logger
from app.ml.model_loader import model_loader
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.error_handler import global_exception_handler

# Routers
from app.routers import (
    health, auth, diabetes, appointment_noshow,
    appointment_reservation, readmission, patient_analyze,
    appointments, admin
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load all 4 production ML pipelines ONCE
    logger.info("Initializing CAREflow AI Backend Application...")
    model_loader.load_all_models()
    logger.info("All Production ML Models Ready!")
    yield
    # Shutdown
    logger.info("Shutting down CAREflow AI Backend Application...")

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="CAREflow AI — Production Healthcare ML API Engine & Triage System",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Middleware
app.add_middleware(RequestIDMiddleware)
app.add_exception_handler(Exception, global_exception_handler)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers under /api/v1
api_prefix = settings.API_V1_STR
app.include_router(health.router, prefix=api_prefix)
app.include_router(auth.router, prefix=api_prefix)
app.include_router(diabetes.router, prefix=api_prefix)
app.include_router(appointment_noshow.router, prefix=api_prefix)
app.include_router(appointment_reservation.router, prefix=api_prefix)
app.include_router(readmission.router, prefix=api_prefix)
app.include_router(patient_analyze.router, prefix=api_prefix)
app.include_router(appointments.router, prefix=api_prefix)
app.include_router(admin.router, prefix=api_prefix)

@app.api_route("/", methods=["GET", "HEAD"])
async def root():
    return {
        "service": settings.APP_NAME,
        "status": "online",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health",
        "models_health": f"{settings.API_V1_STR}/health/models"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
