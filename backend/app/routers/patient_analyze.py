import uuid
import datetime
import pandas as pd
from typing import Dict, Any, List
from fastapi import APIRouter, Request, HTTPException, status
from app.schemas.prediction import UnifiedAnalysisRequest, UnifiedAnalysisResponse
from app.schemas.diabetes import DiabetesPredictionInput
from app.schemas.appointment_noshow import AppointmentNoShowInput
from app.schemas.appointment_reservation import AppointmentReservationInput
from app.schemas.readmission import HospitalReadmissionInput
from app.ml.model_loader import model_loader
from app.ml.model_registry import MODEL_REGISTRY
from app.ml.prediction_utils import (
    derive_diabetes_risk_category, derive_noshow_risk_category,
    derive_reservation_category, derive_readmission_category
)

router = APIRouter(prefix="/patient", tags=["Patient Triage & Analysis"])

@router.post("/analyze", response_model=UnifiedAnalysisResponse)
async def analyze_patient(payload: UnifiedAnalysisRequest, request: Request):
    analysis_id = str(uuid.uuid4())
    executed_models: List[str] = []
    results: Dict[str, Any] = {}
    warnings: List[str] = []

    # 1. Diabetes Risk Analysis
    if payload.diabetes_data:
        try:
            diab_input = DiabetesPredictionInput(**payload.diabetes_data)
            pipeline = model_loader.get_model("diabetes_risk")
            if pipeline:
                df = pd.DataFrame([diab_input.model_dump(by_alias=True)])
                pred = int(pipeline.predict(df)[0])
                proba = pipeline.predict_proba(df)[0]
                risk_cat, guidance = derive_diabetes_risk_category(pred, float(proba[1]))
                results["diabetes_risk"] = {
                    "model_id": "diabetes_risk",
                    "model_name": MODEL_REGISTRY["diabetes_risk"]["model_name"],
                    "prediction": pred,
                    "prediction_label": "Diabetic" if pred == 1 else "Non-Diabetic",
                    "probability": round(float(proba[1]), 4),
                    "risk_category": risk_cat,
                    "guidance": guidance
                }
                executed_models.append("diabetes_risk")
            else:
                warnings.append("Diabetes model is not currently loaded.")
        except Exception as e:
            warnings.append(f"Diabetes analysis skipped due to invalid feature payload: {str(e)}")

    # 2. Appointment No-Show Analysis
    if payload.noshow_data:
        try:
            noshow_input = AppointmentNoShowInput(**payload.noshow_data)
            pipeline = model_loader.get_model("appointment_noshow")
            if pipeline:
                df = pd.DataFrame([noshow_input.model_dump()])
                pred = int(pipeline.predict(df)[0])
                proba = pipeline.predict_proba(df)[0]
                risk_cat, guidance = derive_noshow_risk_category(pred, proba)
                results["appointment_noshow"] = {
                    "model_id": "appointment_noshow",
                    "model_name": MODEL_REGISTRY["appointment_noshow"]["model_name"],
                    "prediction": pred,
                    "prediction_label": "Attended" if pred == 1 else "No-Show Expected",
                    "probability": round(float(proba[1]), 4),
                    "risk_category": risk_cat,
                    "guidance": guidance
                }
                executed_models.append("appointment_noshow")
            else:
                warnings.append("Appointment No-Show model is not currently loaded.")
        except Exception as e:
            warnings.append(f"Appointment No-Show analysis skipped due to invalid feature payload: {str(e)}")

    # 3. Appointment Reservation Analysis
    if payload.reservation_data:
        try:
            res_input = AppointmentReservationInput(**payload.reservation_data)
            pipeline = model_loader.get_model("appointment_reservation")
            if pipeline:
                df = pd.DataFrame([res_input.model_dump()])
                pred = int(pipeline.predict(df)[0])
                proba = pipeline.predict_proba(df)[0]
                risk_cat, guidance = derive_reservation_category(pred, float(proba[1]))
                results["appointment_reservation"] = {
                    "model_id": "appointment_reservation",
                    "model_name": MODEL_REGISTRY["appointment_reservation"]["model_name"],
                    "prediction": pred,
                    "prediction_label": "Completed Booking" if pred == 1 else "Non-Completed Booking",
                    "probability": round(float(proba[1]), 4),
                    "risk_category": risk_cat,
                    "guidance": guidance
                }
                executed_models.append("appointment_reservation")
            else:
                warnings.append("Appointment Reservation model is not currently loaded.")
        except Exception as e:
            warnings.append(f"Appointment Reservation analysis skipped due to invalid feature payload: {str(e)}")

    # 4. Hospital Readmission Analysis
    if payload.readmission_data:
        try:
            readm_input = HospitalReadmissionInput(**payload.readmission_data)
            pipeline = model_loader.get_model("hospital_readmission")
            if pipeline:
                df = pd.DataFrame([readm_input.model_dump(by_alias=True)])
                pred = int(pipeline.predict(df)[0])
                proba = pipeline.predict_proba(df)[0]
                label, category, guidance = derive_readmission_category(pred, proba.tolist())
                results["hospital_readmission"] = {
                    "model_id": "hospital_readmission",
                    "model_name": MODEL_REGISTRY["hospital_readmission"]["model_name"],
                    "prediction": pred,
                    "prediction_label": label,
                    "probabilities": [round(float(p), 4) for p in proba],
                    "risk_category": category,
                    "guidance": guidance
                }
                executed_models.append("hospital_readmission")
            else:
                warnings.append("Hospital Readmission model is not currently loaded.")
        except Exception as e:
            warnings.append(f"Hospital Readmission analysis skipped due to invalid feature payload: {str(e)}")

    if not executed_models:
        warnings.append("No valid model payloads were provided in the request body.")

    return UnifiedAnalysisResponse(
        analysis_id=analysis_id,
        models_executed=executed_models,
        results=results,
        warnings=warnings,
        timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
    )
