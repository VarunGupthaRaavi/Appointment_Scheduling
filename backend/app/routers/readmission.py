import datetime
import pandas as pd
from fastapi import APIRouter, Request, HTTPException, status
from app.schemas.readmission import HospitalReadmissionInput
from app.schemas.prediction import PredictionResponse
from app.ml.model_loader import model_loader
from app.ml.model_registry import MODEL_REGISTRY
from app.ml.prediction_utils import derive_readmission_category

router = APIRouter(prefix="/predict", tags=["Predictions"])

@router.post("/readmission", response_model=PredictionResponse)
async def predict_readmission(payload: HospitalReadmissionInput, request: Request):
    model_id = "hospital_readmission"
    pipeline = model_loader.get_model(model_id)

    if not pipeline:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Hospital Readmission XGBoost Multiclass model artifact is not loaded."
        )

    input_data = payload.model_dump(by_alias=True)
    input_df = pd.DataFrame([input_data])

    try:
        raw_pred = int(pipeline.predict(input_df)[0])
        raw_proba = pipeline.predict_proba(input_df)[0]
        
        label, category, guidance = derive_readmission_category(raw_pred, raw_proba.tolist())
        meta = MODEL_REGISTRY[model_id]

        return PredictionResponse(
            success=True,
            request_id=getattr(request.state, "request_id", "unknown"),
            model_id=model_id,
            model_name=meta["model_name"],
            algorithm=meta["algorithm"],
            model_version=meta["version"],
            prediction=raw_pred,
            prediction_label=label,
            probability=round(float(raw_proba[raw_pred]), 4),
            probabilities=[round(float(p), 4) for p in raw_proba],
            risk_category=category,
            clinical_guidance=guidance,
            disclaimer="This result is an experimental decision-support readmission prediction. It is NOT a clinical diagnosis.",
            timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error on Hospital Readmission XGBoost Multiclass pipeline: {str(e)}"
        )
