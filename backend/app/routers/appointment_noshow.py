import datetime
import pandas as pd
from fastapi import APIRouter, Request, HTTPException, status
from app.schemas.appointment_noshow import AppointmentNoShowInput
from app.schemas.prediction import PredictionResponse
from app.ml.model_loader import model_loader
from app.ml.model_registry import MODEL_REGISTRY
from app.ml.prediction_utils import derive_noshow_risk_category
from app.ml.research_engine import compute_conformal_interval, generate_counterfactual_recourse

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
        # Class 0 = Missed appointment (No-Show), Class 1 = Attended appointment
        noshow_prob = float(raw_proba[0]) if len(raw_proba) > 1 else float(1.0 - raw_proba[0])
        attend_prob = float(raw_proba[1]) if len(raw_proba) > 1 else float(raw_proba[0])
        
        risk_cat, guidance = derive_noshow_risk_category(raw_pred, attend_prob)
        meta = MODEL_REGISTRY[model_id]

        label = "Likely No-Show" if noshow_prob >= 0.50 else "Likely Attendance"

        # Research Engine Outputs
        conformal_bounds = compute_conformal_interval(noshow_prob)
        counterfactual_plan = generate_counterfactual_recourse(model_id, input_data, noshow_prob)

        return PredictionResponse(
            success=True,
            request_id=getattr(request.state, "request_id", "unknown"),
            model_id=model_id,
            model_name=meta["model_name"],
            algorithm=meta["algorithm"],
            model_version=meta["version"],
            prediction=1 if noshow_prob >= 0.50 else 0,
            prediction_label=label,
            probability=round(noshow_prob, 4),
            probabilities=[round(float(p), 4) for p in raw_proba],
            risk_category=risk_cat,
            clinical_guidance=guidance,
            conformal_interval=conformal_bounds,
            counterfactual_plan=counterfactual_plan,
            disclaimer="This result is an AI-generated probability estimation for schedule optimization and is NOT a certainty.",
            timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error on Appointment No-Show LightGBM pipeline: {str(e)}"
        )
