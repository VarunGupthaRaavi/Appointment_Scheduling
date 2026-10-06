import os
import sys
import pytest
from fastapi.testclient import TestClient

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.ml.model_loader import model_loader
from app.main import app

# Ensure models are loaded for testing
model_loader.load_all_models()
client = TestClient(app)

def test_health_endpoints():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    assert res.json()["status"] == "online"

    res_models = client.get("/api/v1/health/models")
    assert res_models.status_code == 200
    models_data = res_models.json()["models"]
    assert "diabetes_risk" in models_data
    assert models_data["diabetes_risk"]["loaded"] is True

def test_diabetes_prediction_api():
    payload = {
        "year": 2019, "gender": "Female", "age": 54.0, "location": "Texas",
        "race:AfricanAmerican": 0, "race:Asian": 0, "race:Caucasian": 1, "race:Hispanic": 0, "race:Other": 0,
        "hypertension": 1, "heart_disease": 0, "smoking_history": "former", "bmi": 28.4, "hbA1c_level": 6.8, "blood_glucose_level": 160
    }
    res = client.post("/api/v1/predict/diabetes", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["model_id"] == "diabetes_risk"
    assert data["prediction"] in [0, 1]
    assert 0.0 <= data["probability"] <= 1.0

def test_noshow_prediction_api():
    payload = {
        "Gender": "F", "Age": 42, "Neighbourhood": "JARDIM DA PENHA", "Scholarship": 0, "Hipertension": 1,
        "Diabetes": 0, "Alcoholism": 0, "Handcap": 0, "SMS_received": 1, "lead_time_days": 12,
        "scheduled_dow": 1, "scheduled_hour": 10, "appointment_dow": 3, "appointment_month": 5
    }
    res = client.post("/api/v1/predict/appointment-no-show", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["model_id"] == "appointment_noshow"
    assert data["prediction"] in [0, 1]

def test_reservation_prediction_api():
    payload = {
        "especialidad": 76.0, "edad": 45.0, "sexo": 1.0, "reserva_mes_d": 5.0, "reserva_mes_c": 0.86,
        "reserva_dia_d": 12.0, "reserva_dia_c": 0.5, "reserva_hora_d": 14.0, "reserva_hora_c": 0.2,
        "creacion_mes_d": 5.0, "creacion_mes_c": 0.86, "creacion_dia_d": 1.0, "creacion_dia_c": -0.8,
        "creacion_hora_d": 9.0, "creacion_hora_c": -0.9, "latencia": 11.0, "canal": 1.0, "tipo": 1.0
    }
    res = client.post("/api/v1/predict/appointment-reservation", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["model_id"] == "appointment_reservation"
    assert data["prediction"] in [0, 1]

def test_readmission_prediction_api():
    payload = {
        "race": "Caucasian", "gender": "Female", "age": "[60-70)", "admission_type_id": 1,
        "discharge_disposition_id": 1, "admission_source_id": 7, "time_in_hospital": 4,
        "payer_code": "MC", "medical_specialty": "InternalMedicine", "num_lab_procedures": 43,
        "num_procedures": 1, "num_medications": 18, "number_outpatient": 0, "number_emergency": 0,
        "number_inpatient": 1, "diag_1": "250.02", "diag_2": "401", "diag_3": "272",
        "number_diagnoses": 7, "max_glu_serum": "None", "A1Cresult": ">8", "metformin": "No",
        "repaglinide": "No", "nateglinide": "No", "chlorpropamide": "No", "glimepiride": "No",
        "acetohexamide": "No", "glipizide": "Steady", "glyburide": "No", "tolbutamide": "No",
        "pioglitazone": "No", "rosiglitazone": "No", "acarbose": "No", "miglitol": "No",
        "troglitazone": "No", "tolazamide": "No", "examide": "No", "citoglipton": "No",
        "insulin": "Steady", "glyburide-metformin": "No", "glipizide-metformin": "No",
        "glimepiride-pioglitazone": "No", "metformin-rosiglitazone": "No",
        "metformin-pioglitazone": "No", "change": "Ch", "diabetesMed": "Yes", "total_prior_visits": 1
    }
    res = client.post("/api/v1/predict/readmission", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["algorithm"] == "XGBoost Multiclass"

def test_unified_patient_analyze_api():
    payload = {
        "diabetes_data": {
            "year": 2019, "gender": "Female", "age": 54.0, "location": "Texas",
            "race:AfricanAmerican": 0, "race:Asian": 0, "race:Caucasian": 1, "race:Hispanic": 0, "race:Other": 0,
            "hypertension": 1, "heart_disease": 0, "smoking_history": "former", "bmi": 28.4, "hbA1c_level": 6.8, "blood_glucose_level": 160
        }
    }
    res = client.post("/api/v1/patient/analyze", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "diabetes_risk" in data["models_executed"]
    assert "diabetes_risk" in data["results"]

def test_admin_models_and_retraining_api():
    # Test GET admin models
    res = client.get("/api/v1/admin/models")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert len(data["models"]) == 4
    for m in data["models"]:
        assert "trained_samples" in m
        assert "total_samples" in m
        assert m["total_samples"] > 0

    # Test retraining single model endpoint
    train_res = client.post("/api/v1/admin/models/diabetes_risk/train", json={"sample_size": 2000, "optimize": True})
    assert train_res.status_code == 200
    train_data = train_res.json()
    assert train_data["success"] is True
    assert train_data["result"]["total_dataset_used"] == 2000
    assert train_data["result"]["accuracy"] > 0.8
