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
