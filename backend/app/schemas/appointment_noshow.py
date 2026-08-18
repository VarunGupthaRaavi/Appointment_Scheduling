from pydantic import BaseModel, Field

class AppointmentNoShowInput(BaseModel):
    Gender: str = Field("F", description="Gender (F, M)")
    Age: int = Field(42, ge=0, le=120, description="Patient age")
    Neighbourhood: str = Field("JARDIM DA PENHA", description="Clinic location neighbourhood")
    Scholarship: int = Field(0, description="Welfare scholarship flag (0 or 1)")
    Hipertension: int = Field(1, description="Hypertension flag (0 or 1)")
    Diabetes: int = Field(0, description="Diabetes flag (0 or 1)")
    Alcoholism: int = Field(0, description="Alcoholism flag (0 or 1)")
    Handcap: int = Field(0, description="Handicap flag (0 or 1)")
    SMS_received: int = Field(1, description="SMS reminder received (0 or 1)")
    lead_time_days: int = Field(12, ge=0, description="Lead time days between booking and appointment")
    scheduled_dow: int = Field(1, ge=0, le=6, description="Scheduled day of week (0=Mon, 6=Sun)")
    scheduled_hour: int = Field(10, ge=0, le=23, description="Scheduled hour of day")
    appointment_dow: int = Field(3, ge=0, le=6, description="Appointment day of week (0=Mon, 6=Sun)")
    appointment_month: int = Field(5, ge=1, le=12, description="Appointment month (1-12)")

    class Config:
        json_schema_extra = {
            "example": {
                "Gender": "F",
                "Age": 42,
                "Neighbourhood": "JARDIM DA PENHA",
                "Scholarship": 0,
                "Hipertension": 1,
                "Diabetes": 0,
                "Alcoholism": 0,
                "Handcap": 0,
                "SMS_received": 1,
                "lead_time_days": 12,
                "scheduled_dow": 1,
                "scheduled_hour": 10,
                "appointment_dow": 3,
                "appointment_month": 5
            }
        }
