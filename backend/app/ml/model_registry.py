from typing import Dict, Any, Optional

MODEL_REGISTRY: Dict[str, Dict[str, Any]] = {
    "diabetes_risk": {
        "model_id": "diabetes_risk",
        "model_name": "Diabetes Risk Prediction Model",
        "task": "Diabetes Risk Classification",
        "algorithm": "XGBoost",
        "artifact_path": "trained_models/diabetes_xgboost_pipeline.joblib",
        "metadata_path": "trained_models/diabetes_xgboost_metadata.json",
        "version": "2.0.0",
        "target": "diabetes",
        "active": True,
        "metrics": {
            "test_samples": 14998,
            "accuracy": 0.9159,
            "precision": 0.8920,
            "recall": 0.9310,
            "f1_score": 0.9110,
            "roc_auc": 0.9781,
            "pr_auc": 0.9120,
            "preprocessor_fitted_samples": 69990,
            "zero_leakage_verified": True
        },
        "performance_note": "High Accuracy (91.59%), ROC-AUC (0.9781), and Recall (93.10%). Optimized for high precision screening and clinical safety."
    },
    "appointment_noshow": {
        "model_id": "appointment_noshow",
        "model_name": "Appointment No-Show Predictor",
        "task": "Appointment Attendance Prediction",
        "algorithm": "LightGBM",
        "artifact_path": "trained_models/appointment_noshow_lightgbm_pipeline.joblib",
        "metadata_path": "trained_models/appointment_noshow_lightgbm_metadata.json",
        "version": "2.0.0",
        "target": "Showed_up",
        "active": True,
        "metrics": {
            "test_samples": 16047,
            "accuracy": 0.8460,
            "precision": 0.9210,
            "recall": 0.8250,
            "f1_score": 0.8703,
            "roc_auc": 0.8940,
            "pr_auc": 0.9209,
            "preprocessor_fitted_samples": 74886,
            "zero_leakage_verified": True
        },
        "performance_note": "Optimized LightGBM pipeline achieving 84.60% Accuracy, 92.10% Precision, and 0.9209 PR-AUC with SMOTE ensemble tuning."
    },
    "appointment_reservation": {
        "model_id": "appointment_reservation",
        "model_name": "Appointment Reservation Model",
        "task": "Reservation Outcome Prediction",
        "algorithm": "Extra Trees",
        "artifact_path": "trained_models/appointment_reservation_extratrees_pipeline.joblib",
        "metadata_path": "trained_models/appointment_reservation_extratrees_metadata.json",
        "version": "2.0.0",
        "target": "show",
        "active": True,
        "metrics": {
            "test_samples": 9149,
            "accuracy": 0.8640,
            "precision": 0.8491,
            "recall": 0.9939,
            "f1_score": 0.9158,
            "roc_auc": 0.8817,
            "pr_auc": 0.8951,
            "preprocessor_fitted_samples": 42692,
            "zero_leakage_verified": True
        },
        "performance_note": "Extra Trees ensemble achieving 86.40% Accuracy, 99.39% Recall, and 91.58% F1-Score on test evaluation."
    },
    "hospital_readmission": {
        "model_id": "hospital_readmission",
        "model_name": "Hospital Readmission Triage Model",
        "task": "Inpatient Readmission Risk",
        "algorithm": "XGBoost Multiclass",
        "artifact_path": "trained_models/readmission_pipeline.joblib",
        "metadata_path": "trained_models/readmission_metadata.json",
        "version": "2.0.0",
        "target": "readmitted (0: NO, 1: >30, 2: <30)",
        "active": True,
        "metrics": {
            "test_samples": 15265,
            "accuracy": 0.8230,
            "precision": 0.8150,
            "recall": 0.8020,
            "f1_score": 0.8084,
            "roc_auc": 0.8752,
            "pr_auc": 0.8410,
            "preprocessor_fitted_samples": 71236,
            "zero_leakage_verified": True
        },
        "performance_note": "Enhanced XGBoost Multiclass pipeline achieving 82.30% Accuracy, 81.50% Precision, and 0.8752 ROC-AUC."
    }
}

def get_model_metadata(model_id: str) -> Optional[Dict[str, Any]]:
    return MODEL_REGISTRY.get(model_id)
