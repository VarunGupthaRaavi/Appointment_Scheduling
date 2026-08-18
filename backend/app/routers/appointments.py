import uuid
import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, status, Query
from app.db.supabase_service import (
    fetch_all_appointments_from_supabase,
    insert_appointment_into_supabase,
    update_appointment_in_supabase
)

router = APIRouter(prefix="/appointments", tags=["Appointments"])

class AppointmentCreate(BaseModel):
    patient_id: str = "p-1001"
    patient_name: str
    patient_age: Optional[int] = 54
    patient_gender: Optional[str] = "Female"
    patient_phone: Optional[str] = "+1 (555) 234-5678"
    patient_height: Optional[float] = 168.0
    patient_weight: Optional[float] = 80.0
    patient_bmi: Optional[float] = 28.3
    hba1c_level: Optional[float] = 7.2
    blood_glucose_level: Optional[int] = 175
    smoking_history: Optional[str] = "former"
    doctor_id: str = "doc-202"
    doctor_name: str = "Dr. Michael Chen"
    department: str = "Endocrinology & Internal Medicine"
    appointment_date: str
    appointment_time: str
    symptoms: Optional[str] = None
    health_conditions: Optional[List[str]] = []
    ai_risk_score: Optional[float] = 0.68
    ai_risk_category: Optional[str] = "Moderate Risk"
    ai_clinical_report: Optional[str] = "Patient presents elevated blood glucose (175 mg/dL) and HbA1c (7.2%). AI Triage indicates moderate risk of glycemic imbalance. Recommend HbA1c lab review and outpatient consultation."
    notes: Optional[str] = None

class AppointmentStatusUpdate(BaseModel):
    status: str = Field(..., description="Scheduled, Confirmed, Completed, Rescheduled, Cancelled, No Show")

class AppointmentReschedule(BaseModel):
    new_date: str
    new_time: str

# Master Timeslots
ALL_TIME_SLOTS = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
]

# Local fallback cache
APPOINTMENTS_DB = [
    {
        "id": "appt-101",
        "patient_id": "p-1001",
        "patient_name": "Jane Doe",
        "patient_age": 54,
        "patient_gender": "Female",
        "patient_phone": "+1 (555) 234-5678",
        "patient_height": 168.0,
        "patient_weight": 80.0,
        "patient_bmi": 28.3,
        "hba1c_level": 7.2,
        "blood_glucose_level": 175,
        "smoking_history": "former",
        "doctor_id": "doc-202",
        "doctor_name": "Dr. Michael Chen",
        "department": "Endocrinology & Internal Medicine",
        "appointment_date": "2026-08-20",
        "appointment_time": "10:00 AM",
        "status": "Confirmed",
        "symptoms": "Experiencing increased thirst, occasional dizziness after meals, and persistent fatigue over the past 2 weeks. (Frequent Urination, Fatigue, High Blood Sugar)",
        "health_conditions": ["Diabetes Type 2", "Hypertension"],
        "ai_risk_score": 0.68,
        "ai_risk_category": "Moderate Risk",
        "ai_clinical_report": "Patient presents elevated fasting blood glucose (175 mg/dL) and HbA1c (7.2%). AI Triage indicates moderate risk of glycemic imbalance. Recommend HbA1c lab review and outpatient consultation.",
        "sync_status": "Synced across Patient, Doctor & Admin Portals",
        "created_at": "2026-08-10T09:00:00Z"
    },
    {
        "id": "appt-102",
        "patient_id": "p-1002",
        "patient_name": "Robert Smith",
        "patient_age": 62,
        "patient_gender": "Male",
        "patient_phone": "+1 (555) 876-5432",
        "patient_height": 175.0,
        "patient_weight": 92.0,
        "patient_bmi": 30.0,
        "hba1c_level": 8.5,
        "blood_glucose_level": 210,
        "smoking_history": "current",
        "doctor_id": "doc-201",
        "doctor_name": "Dr. Sarah Jenkins",
        "department": "Cardiology",
        "appointment_date": "2026-08-20",
        "appointment_time": "02:00 PM",
        "status": "Scheduled",
        "symptoms": "Chest tightness on mild exertion, short of breath when climbing stairs.",
        "health_conditions": ["Hypertension", "Heart Disease"],
        "ai_risk_score": 0.85,
        "ai_risk_category": "High Risk",
        "ai_clinical_report": "High risk classification (85% severity). Hypertension and active chest tightness. Immediate cardiology consultation and ECG evaluation advised.",
        "sync_status": "Synced across Patient, Doctor & Admin Portals",
        "created_at": "2026-08-11T11:15:00Z"
    }
]

def get_current_appointments():
    supabase_appts = fetch_all_appointments_from_supabase()
    if supabase_appts is not None and len(supabase_appts) > 0:
        return supabase_appts
    return APPOINTMENTS_DB

@router.get("")
async def get_appointments():
    appts = get_current_appointments()
    return {"success": True, "count": len(appts), "appointments": appts}

@router.get("/check-availability")
async def check_slot_availability(date: str, time: str):
    appts = get_current_appointments()
    booked_slots = [
        appt["appointment_time"] for appt in appts
        if appt["appointment_date"] == date and appt["status"] in ["Scheduled", "Confirmed", "Rescheduled"]
    ]
    
    is_available = time not in booked_slots
    suggested_slots = [slot for slot in ALL_TIME_SLOTS if slot not in booked_slots and slot != time]
    
    return {
        "requested_date": date,
        "requested_time": time,
        "is_available": is_available,
        "suggested_available_slots": suggested_slots if not is_available else [],
        "all_available_slots": [slot for slot in ALL_TIME_SLOTS if slot not in booked_slots]
    }

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_appointment(payload: AppointmentCreate):
    appts = get_current_appointments()
    
    # Check slot conflict
    booked = any(
        appt["appointment_date"] == payload.appointment_date and
        appt["appointment_time"] == payload.appointment_time and
        appt["status"] in ["Scheduled", "Confirmed", "Rescheduled"]
        for appt in appts
    )
    
    if booked:
        booked_slots = [
            appt["appointment_time"] for appt in appts
            if appt["appointment_date"] == payload.appointment_date and appt["status"] in ["Scheduled", "Confirmed", "Rescheduled"]
        ]
        suggested = [slot for slot in ALL_TIME_SLOTS if slot not in booked_slots]
        
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "message": f"The slot {payload.appointment_time} on {payload.appointment_date} is already booked.",
                "is_available": False,
                "suggested_available_slots": suggested
            }
        )

    new_appt = {
        "id": f"appt-{uuid.uuid4().hex[:6]}",
        "patient_id": payload.patient_id,
        "patient_name": payload.patient_name,
        "patient_age": payload.patient_age,
        "patient_gender": payload.patient_gender,
        "patient_phone": payload.patient_phone,
        "patient_height": payload.patient_height,
        "patient_weight": payload.patient_weight,
        "patient_bmi": payload.patient_bmi,
        "hba1c_level": payload.hba1c_level,
        "blood_glucose_level": payload.blood_glucose_level,
        "smoking_history": payload.smoking_history,
        "doctor_id": payload.doctor_id,
        "doctor_name": payload.doctor_name,
        "department": payload.department,
        "appointment_date": payload.appointment_date,
        "appointment_time": payload.appointment_time,
        "status": "Scheduled",
        "symptoms": payload.symptoms or "",
        "health_conditions": payload.health_conditions or [],
        "ai_risk_score": payload.ai_risk_score or 0.65,
        "ai_risk_category": payload.ai_risk_category or "Moderate Risk",
        "ai_clinical_report": payload.ai_clinical_report or f"AI Report: Patient {payload.patient_name} submitted symptoms: '{payload.symptoms}'. AI recommends routine clinical review.",
        "sync_status": "Synced across Patient, Doctor & Admin Portals",
        "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }
    
    # Store in local memory array AND insert into Supabase PostgreSQL
    APPOINTMENTS_DB.append(new_appt)
    insert_appointment_into_supabase(new_appt)

    return {
        "success": True,
        "message": "Appointment booked successfully & stored in Supabase PostgreSQL!",
        "appointment": new_appt
    }

@router.patch("/{appointment_id}/reschedule")
async def reschedule_appointment(appointment_id: str, payload: AppointmentReschedule):
    appts = get_current_appointments()
    
    for appt in appts:
        if appt["id"] == appointment_id:
            conflict = any(
                a["id"] != appointment_id and
                a["appointment_date"] == payload.new_date and
                a["appointment_time"] == payload.new_time and
                a["status"] in ["Scheduled", "Confirmed", "Rescheduled"]
                for a in appts
            )
            if conflict:
                raise HTTPException(
                    status_code=400,
                    detail=f"Slot {payload.new_time} on {payload.new_date} is already occupied by another patient."
                )

            appt["appointment_date"] = payload.new_date
            appt["appointment_time"] = payload.new_time
            appt["status"] = "Rescheduled"
            appt["sync_status"] = f"Rescheduled to {payload.new_date} at {payload.new_time} (Synced to Patient & Admin)"
            
            # Persist update to Supabase PostgreSQL
            update_appointment_in_supabase(appointment_id, {
                "appointment_date": payload.new_date,
                "appointment_time": payload.new_time,
                "status": "Rescheduled",
                "sync_status": appt["sync_status"]
            })

            return {
                "success": True,
                "message": f"Appointment slot successfully updated to {payload.new_date} at {payload.new_time}",
                "appointment": appt
            }
            
    raise HTTPException(status_code=404, detail="Appointment record not found")

@router.patch("/{appointment_id}")
async def update_appointment_status(appointment_id: str, payload: AppointmentStatusUpdate):
    appts = get_current_appointments()
    for appt in appts:
        if appt["id"] == appointment_id:
            appt["status"] = payload.status
            
            # Persist update to Supabase PostgreSQL
            update_appointment_in_supabase(appointment_id, {
                "status": payload.status
            })

            return {"success": True, "message": f"Appointment status updated to {payload.status}", "appointment": appt}
    raise HTTPException(status_code=404, detail="Appointment not found")
