import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings

# OS-Agnostic Path Resolution
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
DEFAULT_MODEL_DIR = BASE_DIR / "trained_models"
if not DEFAULT_MODEL_DIR.exists():
    DEFAULT_MODEL_DIR = Path(__file__).resolve().parent.parent.parent / "trained_models"

class Settings(BaseSettings):
    APP_NAME: str = "CAREflow AI"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "production"
    DEBUG: bool = False
    
    # Model Directory (Relative / Dynamic)
    MODEL_DIRECTORY: str = os.getenv("MODEL_DIRECTORY", str(DEFAULT_MODEL_DIR))

    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

    # Database URL
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./careflow.db")

    # Security & JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-key-change-in-production-12345")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "*"
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
