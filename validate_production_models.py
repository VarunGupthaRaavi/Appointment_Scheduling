import os
import sys
import json
import joblib
import pandas as pd
import numpy as np

# Force UTF-8 output encoding for Windows terminal
sys.stdout.reconfigure(encoding='utf-8')

FOLDER = r'c:\Users\amman\Downloads\New folder'
MODELS_DIR = os.path.join(FOLDER, 'trained_models')
EVAL_DIR = os.path.join(FOLDER, 'evaluation')

def validate_all_pipelines():
    print("="*80)
    print("RUNNING FINAL VALIDATION TEST SUITE ON SERIALIZED MODEL ARTIFACTS")
    print("="*80)

    pipelines_to_test = [
        {
            "name": "Model 1: Diabetes XGBoost Pipeline",
            "joblib": os.path.join(MODELS_DIR, "diabetes_xgboost_pipeline.joblib"),
            "meta": os.path.join(MODELS_DIR, "diabetes_xgboost_metadata.json"),
            "sample_data": pd.DataFrame([{
                "year": 2019,
                "gender": "Female",
                "age": 54.0,
                "location": "Texas",
                "race:AfricanAmerican": 0,
                "race:Asian": 0,
                "race:Caucasian": 1,
                "race:Hispanic": 0,
                "race:Other": 0,
                "hypertension": 1,
                "heart_disease": 0,
                "smoking_history": "former",
                "bmi": 28.4,
                "hbA1c_level": 6.8,
                "blood_glucose_level": 160
            }])
        },
        {
            "name": "Model 2: Appointment No-Show LightGBM Pipeline",
            "joblib": os.path.join(MODELS_DIR, "appointment_noshow_lightgbm_pipeline.joblib"),
            "meta": os.path.join(MODELS_DIR, "appointment_noshow_lightgbm_metadata.json"),
            "sample_data": pd.DataFrame([{
                "Gender": "F",
                "Age": 42,
                "Neighbourhood": "JARDIM DA PENHA",
                "Scholarship": 0,
                "Hipertension": 1,
                "Diabetes": 0,
                "Alcoholism": 0,
                "Handcap": 0,
                "SMS_received": 1,
                "lead_time_days": 12,
                "scheduled_dow": 1,
                "scheduled_hour": 10,
                "appointment_dow": 3,
                "appointment_month": 5
            }])
        },
        {
            "name": "Model 3: Appointment Reservation ExtraTrees Pipeline",
            "joblib": os.path.join(MODELS_DIR, "appointment_reservation_extratrees_pipeline.joblib"),
            "meta": os.path.join(MODELS_DIR, "appointment_reservation_extratrees_metadata.json"),
            "sample_data": pd.DataFrame([{
                "especialidad": 76.0,
                "edad": 45.0,
                "sexo": 1.0,
                "reserva_mes_d": 5.0,
                "reserva_mes_c": 0.86,
                "reserva_dia_d": 12.0,
                "reserva_dia_c": 0.5,
                "reserva_hora_d": 14.0,
                "reserva_hora_c": 0.2,
                "creacion_mes_d": 5.0,
                "creacion_mes_c": 0.86,
                "creacion_dia_d": 1.0,
                "creacion_dia_c": -0.8,
                "creacion_hora_d": 9.0,
                "creacion_hora_c": -0.9,
                "latencia": 11.0,
                "canal": 1.0,
                "tipo": 1.0
            }])
        },
        {
            "name": "Model 4: Hospital Readmission XGBoost Multiclass Pipeline",
            "joblib": os.path.join(MODELS_DIR, "readmission_pipeline.joblib"),
            "meta": os.path.join(MODELS_DIR, "readmission_metadata.json"),
            "sample_data": pd.DataFrame([{
                "race": "Caucasian",
                "gender": "Female",
                "age": "[60-70)",
                "admission_type_id": 1,
                "discharge_disposition_id": 1,
                "admission_source_id": 7,
                "time_in_hospital": 4,
                "payer_code": "MC",
                "medical_specialty": "InternalMedicine",
                "num_lab_procedures": 43,
                "num_procedures": 1,
                "num_medications": 18,
                "number_outpatient": 0,
                "number_emergency": 0,
                "number_inpatient": 1,
                "diag_1": "250.02",
                "diag_2": "401",
                "diag_3": "272",
                "number_diagnoses": 7,
                "max_glu_serum": "None",
                "A1Cresult": ">8",
                "metformin": "No",
                "repaglinide": "No",
                "nateglinide": "No",
                "chlorpropamide": "No",
                "glimepiride": "No",
                "acetohexamide": "No",
                "glipizide": "Steady",
                "glyburide": "No",
                "tolbutamide": "No",
                "pioglitazone": "No",
                "rosiglitazone": "No",
                "acarbose": "No",
                "miglitol": "No",
                "troglitazone": "No",
                "tolazamide": "No",
                "examide": "No",
                "citoglipton": "No",
                "insulin": "Steady",
                "glyburide-metformin": "No",
                "glipizide-metformin": "No",
                "glimepiride-pioglitazone": "No",
                "metformin-rosiglitazone": "No",
                "metformin-pioglitazone": "No",
                "change": "Ch",
                "diabetesMed": "Yes",
                "total_prior_visits": 1
            }])
        }
    ]

    all_passed = True

    for p in pipelines_to_test:
        print(f"\n--- Testing: {p['name']} ---")
        
        # Check files exist
        if not os.path.exists(p['joblib']):
            print(f"[FAIL] Joblib file missing at {p['joblib']}")
            all_passed = False
            continue
        if not os.path.exists(p['meta']):
            print(f"[FAIL] Metadata file missing at {p['meta']}")
            all_passed = False
            continue

        # Load metadata
        with open(p['meta'], 'r', encoding='utf-8') as f:
            meta = json.load(f)
        print(f"  Metadata loaded successfully. Target: '{meta['target']}', Model: '{meta['model_name']}'")

        # Load pipeline from disk
        try:
            pipeline = joblib.load(p['joblib'])
            print(f"  [PASS] Serialized .joblib pipeline loaded from disk ({os.path.getsize(p['joblib'])/(1024*1024):.2f} MB)")
        except Exception as e:
            print(f"[FAIL] Could not load joblib pipeline: {e}")
            all_passed = False
            continue

        # Test predict()
        try:
            pred = pipeline.predict(p['sample_data'])
            print(f"  [PASS] .predict() verification passed -> Output Class: {pred[0]}")
        except Exception as e:
            print(f"[FAIL] .predict() raised exception: {e}")
            all_passed = False

        # Test predict_proba()
        try:
            proba = pipeline.predict_proba(p['sample_data'])
            print(f"  [PASS] .predict_proba() verification passed -> Output Probabilities: {np.round(proba[0], 4)}")
        except Exception as e:
            print(f"[FAIL] .predict_proba() raised exception: {e}")
            all_passed = False

    print("\n" + "="*80)
    if all_passed:
        print("ALL 4 PRODUCTION MODEL ARTIFACTS PASSED ALL VALIDATION CHECKS!")
    else:
        print("SOME VALIDATION CHECKS FAILED!")
    print("="*80)

if __name__ == "__main__":
    validate_all_pipelines()
