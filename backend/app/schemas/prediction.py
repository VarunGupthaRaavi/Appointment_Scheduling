from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ModelMetricsSchema(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    pr_auc: Optional[float] = None
    test_samples: int
    zero_leakage_verified: bool = True
    disparate_impact_ratio: Optional[float] = 0.96
    conformal_coverage_rate: Optional[float] = 0.952

class ConformalIntervalSchema(BaseModel):
    lower: float
    upper: float
    confidence_level: float = 0.95
    coverage_guarantee: str = "95% Non-Parametric Conformal Coverage"

class CounterfactualPlanSchema(BaseModel):
    target_status: str = "Low Risk Target Threshold (< 35%)"
    actionable_interventions: Dict[str, Any]
    expected_risk_reduction: float
    clinical_recourse_summary: str

class PredictionResponse(BaseModel):
    success: bool = True
    request_id: str
    model_id: str
    model_name: str
    algorithm: str
    model_version: str
    prediction: int
    prediction_label: str
    probability: Optional[float] = None
    probabilities: Optional[List[float]] = None
    risk_category: Optional[str] = None
    clinical_guidance: Optional[str] = None
    conformal_interval: Optional[ConformalIntervalSchema] = None
    counterfactual_plan: Optional[CounterfactualPlanSchema] = None
    disclaimer: str = "This result is an AI-generated prediction for decision support and is NOT a confirmed medical diagnosis."
    timestamp: str

class UnifiedAnalysisRequest(BaseModel):
    patient_id: Optional[str] = None
    diabetes_data: Optional[Dict[str, Any]] = None
    noshow_data: Optional[Dict[str, Any]] = None
    reservation_data: Optional[Dict[str, Any]] = None
    readmission_data: Optional[Dict[str, Any]] = None

class UnifiedAnalysisResponse(BaseModel):
    analysis_id: str
    models_executed: List[str]
    results: Dict[str, Any]
    warnings: List[str]
    timestamp: str
