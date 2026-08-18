from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class DiabetesPredictionInput(BaseModel):
    year: int = Field(2019, description="Observation year")
    gender: str = Field("Female", description="Gender (Female, Male, Other)")
    age: float = Field(54.0, ge=0, le=120, description="Age in years")
    location: str = Field("Texas", description="Geographic location")
    race_AfricanAmerican: int = Field(0, alias="race:AfricanAmerican", description="One-hot AfricanAmerican flag")
    race_Asian: int = Field(0, alias="race:Asian", description="One-hot Asian flag")
    race_Caucasian: int = Field(1, alias="race:Caucasian", description="One-hot Caucasian flag")
    race_Hispanic: int = Field(0, alias="race:Hispanic", description="One-hot Hispanic flag")
    race_Other: int = Field(0, alias="race:Other", description="One-hot Other flag")
    hypertension: int = Field(1, description="Hypertension flag (0 or 1)")
    heart_disease: int = Field(0, description="Heart disease flag (0 or 1)")
    smoking_history: str = Field("former", description="Smoking history (never, former, current, No Info, etc.)")
    bmi: float = Field(28.4, ge=10, le=100, description="Body Mass Index")
    hbA1c_level: float = Field(6.8, ge=3, le=15, description="HbA1c biomarker level")
    blood_glucose_level: int = Field(160, ge=50, le=500, description="Fasting blood glucose level mg/dL")

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "year": 2019,
                "gender": "Female",
                "age": 54.0,
                "location": "Texas",
                "race:AfricanAmerican": 0,
                "race:Asian": 0,
                "race:Caucasian": 1,
                "race:Hispanic": 0,
                "race:Other": 0,
                "hypertension": 1,
                "heart_disease": 0,
                "smoking_history": "former",
                "bmi": 28.4,
                "hbA1c_level": 6.8,
                "blood_glucose_level": 160
            }
        }
