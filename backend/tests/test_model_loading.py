import os
import sys
import pytest
import pandas as pd

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.ml.model_loader import model_loader
from app.ml.model_registry import MODEL_REGISTRY

def test_model_loading_and_sample_inference():
    # Load all models
    model_loader.load_all_models()
    
    # 1. Diabetes XGBoost
    assert model_loader.is_model_loaded("diabetes_risk")
    m1 = model_loader.get_model("diabetes_risk")
    df1 = pd.DataFrame([{
        "year": 2019, "gender": "Female", "age": 54.0, "location": "Texas",
        "race:AfricanAmerican": 0, "race:Asian": 0, "race:Caucasian": 1, "race:Hispanic": 0, "race:Other": 0,
        "hypertension": 1, "heart_disease": 0, "smoking_history": "former", "bmi": 28.4, "hbA1c_level": 6.8, "blood_glucose_level": 160
    }])
    p1 = m1.predict(df1)
    assert p1[0] in [0, 1]

    # 2. Appointment No-Show LightGBM
    assert model_loader.is_model_loaded("appointment_noshow")
    m2 = model_loader.get_model("appointment_noshow")
    df2 = pd.DataFrame([{
        "Gender": "F", "Age": 42, "Neighbourhood": "JARDIM DA PENHA", "Scholarship": 0, "Hipertension": 1,
        "Diabetes": 0, "Alcoholism": 0, "Handcap": 0, "SMS_received": 1, "lead_time_days": 12,
        "scheduled_dow": 1, "scheduled_hour": 10, "appointment_dow": 3, "appointment_month": 5
    }])
    p2 = m2.predict(df2)
    assert p2[0] in [0, 1]

    # 3. Appointment Reservation Extra Trees
    assert model_loader.is_model_loaded("appointment_reservation")
    m3 = model_loader.get_model("appointment_reservation")
    df3 = pd.DataFrame([{
        "especialidad": 76.0, "edad": 45.0, "sexo": 1.0, "reserva_mes_d": 5.0, "reserva_mes_c": 0.86,
        "reserva_dia_d": 12.0, "reserva_dia_c": 0.5, "reserva_hora_d": 14.0, "reserva_hora_c": 0.2,
        "creacion_mes_d": 5.0, "creacion_mes_c": 0.86, "creacion_dia_d": 1.0, "creacion_dia_c": -0.8,
        "creacion_hora_d": 9.0, "creacion_hora_c": -0.9, "latencia": 11.0, "canal": 1.0, "tipo": 1.0
    }])
    p3 = m3.predict(df3)
    assert p3[0] in [0, 1]

    # 4. Hospital Readmission XGBoost Multiclass
    assert model_loader.is_model_loaded("hospital_readmission")
    m4 = model_loader.get_model("hospital_readmission")
    df4 = pd.DataFrame([{
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
    }])
    p4 = m4.predict(df4)
    assert p4[0] in [0, 1, 2]
