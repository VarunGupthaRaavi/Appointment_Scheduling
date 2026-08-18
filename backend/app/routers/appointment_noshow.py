import datetime
import pandas as pd
from fastapi import APIRouter, Request, HTTPException, status
from app.schemas.appointment_noshow import AppointmentNoShowInput
from app.schemas.prediction import PredictionResponse
from app.ml.model_loader import model_loader
from app.ml.model_registry import MODEL_REGISTRY
from app.ml.prediction_utils import derive_noshow_risk_category

router = APIRouter(prefix="/predict", tags=["Predictions"])

@router.post("/appointment-no-show", response_model=PredictionResponse)
@router.post("/appointment-noshow", response_model=PredictionResponse)
@router.post("/noshow", response_model=PredictionResponse)
async def predict_noshow(payload: AppointmentNoShowInput, request: Request):
    model_id = "appointment_noshow"
    pipeline = model_loader.get_model(model_id)

    if not pipeline:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Appointment No-Show LightGBM model artifact is not loaded."
        )

    input_data = payload.model_dump()
    input_df = pd.DataFrame([input_data])

    try:
        raw_pred = int(pipeline.predict(input_df)[0])
        raw_proba = pipeline.predict_proba(input_df)[0]
        pos_prob = float(raw_proba[1]) if len(raw_proba) > 1 else float(raw_proba[0])
        
        risk_cat, guidance = derive_noshow_risk_category(raw_pred, pos_prob)
        meta = MODEL_REGISTRY[model_id]

        label = "Attended Appointment" if raw_pred == 1 else "No-Show Expected"

        return PredictionResponse(
            success=True,
            request_id=getattr(request.state, "request_id", "unknown"),
            model_id=model_id,
            model_name=meta["model_name"],
            algorithm=meta["algorithm"],
            model_version=meta["version"],
            prediction=raw_pred,
            prediction_label=label,
            probability=round(pos_prob, 4),
            probabilities=[round(float(p), 4) for p in raw_proba],
            risk_category=risk_cat,
            clinical_guidance=guidance,
            disclaimer="This result is an AI-generated probability estimation for schedule optimization and is NOT a certainty.",
            timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error on Appointment No-Show LightGBM pipeline: {str(e)}"
        )
