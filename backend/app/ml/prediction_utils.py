from typing import List, Dict, Any, Tuple

def derive_diabetes_risk_category(pred: int, proba: float) -> Tuple[str, str]:
    if proba >= 0.65 or (pred == 1 and proba >= 0.50):
        return "High Risk", "Estimated high risk of diabetes. Recommend clinical biomarker evaluation and urgent consultation."
    elif proba >= 0.35 or pred == 1:
        return "Moderate Risk", "Estimated moderate risk of diabetes. Recommend routine health check and blood glucose monitoring."
    else:
        return "Low Risk", "Estimated low risk of diabetes based on submitted vitals."

def derive_noshow_risk_category(pred: int, proba: Any) -> Tuple[str, str]:
    if hasattr(proba, "__getitem__"):
        prob_val = float(proba[1]) if len(proba) > 1 else float(proba[0])
    else:
        prob_val = float(proba)

    if pred == 0 or prob_val >= 0.65:
        return "High No-Show Risk", "Patient has a high probability of missing the appointment. Recommend automated SMS reminder."
    elif prob_val >= 0.35:
        return "Moderate No-Show Risk", "Moderate chance of missed appointment. Send confirmation notification."
    else:
        return "Low No-Show Risk", "High probability of appointment attendance."

def derive_reservation_category(pred: int, proba: float) -> Tuple[str, str]:
    if pred == 1 or proba >= 0.50:
        return "Confirmed Completion", "High likelihood of appointment booking completion."
    else:
        return "Cancellation Risk", "Elevated probability of booking cancellation or non-completion."

def derive_readmission_category(pred: int, proba: Any) -> Tuple[str, str, str]:
    mapping = {0: "NO Readmission", 1: "Readmission > 30 Days", 2: "Urgent Readmission < 30 Days"}
    clean_pred = int(pred) if not hasattr(pred, "item") else int(pred.item())
    label = mapping.get(clean_pred, "NO Readmission")
    
    if clean_pred == 2:
        category = "High Urgency (<30 Days Readmission)"
        guidance = "High risk of early inpatient readmission. Recommend post-discharge care protocol."
    elif clean_pred == 1:
        category = "Moderate Urgency (>30 Days Readmission)"
        guidance = "Moderate readmission risk. Schedule follow-up outpatient consultation."
    else:
        category = "Low Readmission Risk"
        guidance = "Standard discharge protocol recommended."
        
    return label, category, guidance
