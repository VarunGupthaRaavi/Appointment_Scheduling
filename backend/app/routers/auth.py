from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, status
from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., description="User password")

class RegisterRequest(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., description="User password")
    full_name: str = Field(..., description="Full name")
    role: str = Field("patient", description="User role: patient, doctor, admin")

@router.post("/login")
async def login(payload: LoginRequest):
    role = "patient"
    if "admin" in payload.email.lower():
        role = "admin"
    elif "doctor" in payload.email.lower() or "dr." in payload.email.lower():
        role = "doctor"

    token = create_access_token({"sub": payload.email, "role": role, "email": payload.email})
    return {
        "success": True,
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": f"user-{abs(hash(payload.email)) % 10000}",
            "email": payload.email,
            "full_name": payload.email.split("@")[0].capitalize(),
            "role": role
        }
    }

@router.post("/register")
async def register(payload: RegisterRequest):
    token = create_access_token({"sub": payload.email, "role": payload.role, "email": payload.email})
    return {
        "success": True,
        "message": "User registered successfully",
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": f"user-{abs(hash(payload.email)) % 10000}",
            "email": payload.email,
            "full_name": payload.full_name,
            "role": payload.role
        }
    }

@router.get("/me")
async def get_current_user_profile():
    return {
        "success": True,
        "user": {
            "id": "user-demo-101",
            "email": "patient@careflow.ai",
            "full_name": "Demo Patient",
            "role": "patient"
        }
    }
