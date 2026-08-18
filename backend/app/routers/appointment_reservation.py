import datetime
import pandas as pd
from fastapi import APIRouter, Request, HTTPException, status
from app.schemas.appointment_reservation import AppointmentReservationInput
from app.schemas.prediction import PredictionResponse
from app.ml.model_loader import model_loader
from app.ml.model_registry import MODEL_REGISTRY
from app.ml.prediction_utils import derive_reservation_category

router = APIRouter(prefix="/predict", tags=["Predictions"])

@router.post("/appointment-reservation", response_model=PredictionResponse)
async def predict_reservation(payload: AppointmentReservationInput, request: Request):
    model_id = "appointment_reservation"
    pipeline = model_loader.get_model(model_id)

    if not pipeline:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Appointment Reservation Extra Trees model artifact is not loaded."
        )

    input_data = payload.model_dump()
    input_df = pd.DataFrame([input_data])

    try:
        raw_pred = int(pipeline.predict(input_df)[0])
        raw_proba = pipeline.predict_proba(input_df)[0]
        
        category, guidance = derive_reservation_category(raw_pred, float(raw_proba[1]))
        meta = MODEL_REGISTRY[model_id]

        return PredictionResponse(
            success=True,
            request_id=getattr(request.state, "request_id", "unknown"),
            model_id=model_id,
            model_name=meta["model_name"],
            algorithm=meta["algorithm"],
            model_version=meta["version"],
            prediction=raw_pred,
            prediction_label="Completed Booking" if raw_pred == 1 else "Non-Completed Booking",
            probability=round(float(raw_proba[1]), 4),
            probabilities=[round(float(p), 4) for p in raw_proba],
            risk_category=category,
            clinical_guidance=guidance,
            disclaimer="This result is an AI-generated reservation forecast.",
            timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error on Appointment Reservation Extra Trees pipeline: {str(e)}"
        )
