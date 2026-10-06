import datetime
import pandas as pd
from fastapi import APIRouter, Request, HTTPException, status
from app.schemas.diabetes import DiabetesPredictionInput
from app.schemas.prediction import PredictionResponse
from app.ml.model_loader import model_loader
from app.ml.model_registry import MODEL_REGISTRY
from app.ml.prediction_utils import derive_diabetes_risk_category
from app.ml.research_engine import compute_conformal_interval, generate_counterfactual_recourse

router = APIRouter(prefix="/predict", tags=["Predictions"])

@router.post("/diabetes", response_model=PredictionResponse)
async def predict_diabetes(payload: DiabetesPredictionInput, request: Request):
    model_id = "diabetes_risk"
    pipeline = model_loader.get_model(model_id)
    
    if not pipeline:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Diabetes XGBoost model artifact is not loaded."
        )

    input_data = payload.model_dump(by_alias=True)
    input_df = pd.DataFrame([input_data])

    try:
        raw_pred = int(pipeline.predict(input_df)[0])
        raw_proba = pipeline.predict_proba(input_df)[0]
        
        # Use accurate XGBoost machine learning model predicted probability
        model_prob = float(raw_proba[1]) if len(raw_proba) > 1 else float(raw_proba[0])
        calibrated_prob = round(float(model_prob), 4)

        risk_cat, guidance = derive_diabetes_risk_category(raw_pred, calibrated_prob)
        meta = MODEL_REGISTRY[model_id]

        # Research Engine Outputs
        conformal_bounds = compute_conformal_interval(calibrated_prob)
        counterfactual_plan = generate_counterfactual_recourse(model_id, input_data, calibrated_prob)

        return PredictionResponse(
            success=True,
            request_id=getattr(request.state, "request_id", "unknown"),
            model_id=model_id,
            model_name=meta["model_name"],
            algorithm=meta["algorithm"],
            model_version=meta["version"],
            prediction=raw_pred,
            prediction_label="Diabetic Risk High" if calibrated_prob >= 0.50 else "Low Diabetic Risk",
            probability=calibrated_prob,
            probabilities=[round(1.0 - calibrated_prob, 4), calibrated_prob],
            risk_category=risk_cat,
            clinical_guidance=guidance,
            conformal_interval=conformal_bounds,
            counterfactual_plan=counterfactual_plan,
            disclaimer="This result is an AI-generated prediction for decision support and is NOT a confirmed medical diagnosis.",
            timestamp=datetime.datetime.now(datetime.timezone.utc).isoformat()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error on Diabetes XGBoost pipeline: {str(e)}"
        )
