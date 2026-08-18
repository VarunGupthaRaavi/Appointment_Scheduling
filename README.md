# CAREflow AI — Production Healthcare Machine Learning & Clinical Triage System

**CAREflow AI** is a production-grade clinical decision support and triage system powered by **four validated production machine learning model pipelines** integrated into a FastAPI backend and React + TypeScript frontend.

---

## 🚀 Key Features

1. **4 Production ML Models**:
   - **Diabetes Risk Classification** (XGBoost — 91.59% Acc | 0.9781 ROC-AUC)
   - **Appointment No-Show Prediction** (LightGBM — 61.07% Acc | 0.9209 PR-AUC)
   - **Appointment Reservation Outcome** (Extra Trees — 79.79% Acc | 88.59% F1)
   - **Hospital Readmission Triage** (XGBoost Multiclass — 59.41% Acc | 0.6852 ROC-AUC)
2. **Zero-Leakage Pipeline Architecture**: Preprocessing transformers are serialized inside unified scikit-learn `Pipeline` objects.
3. **FastAPI REST Engine**: Includes singleton `ModelLoader`, OpenAPI Swagger docs (`/docs`), unified triage analysis endpoint (`/api/v1/patient/analyze`), and health endpoints.
4. **Supabase Database & Security**: Complete schema DDL (`database/schema.sql`) with Row Level Security (RLS) policies isolating patient and doctor data.
5. **Modern React Frontend**: Clean, responsive UI built with React 18, TypeScript, Vite, Tailwind CSS, and Recharts.

---

## 🛠️ Quick Start & Running the Project

### 1. Backend Server (FastAPI)
```bash
# Install backend dependencies
pip install -r backend/requirements.txt

# Run backend server directly with Uvicorn (No Docker)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- Open Swagger API Documentation: `http://localhost:8000/docs`
- Health Check: `http://localhost:8000/api/v1/health`
- Model Status: `http://localhost:8000/api/v1/health/models`

### 2. Frontend Application (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
- Open Web Application: `http://localhost:5173`

### 3. Automated Test Suite
```bash
# Run backend API & Model Loading Tests
pytest backend/tests/

# Run Independent Model Validation Test
python run_independent_validation.py
```

---

## 📊 Verified Model Benchmark Metrics

| Model ID | Dataset | Algorithm | Test Accuracy | Test F1-Score | Test ROC-AUC | Test PR-AUC | Artifact Path |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **diabetes_risk** | `archive/diabetes_dataset.csv` | **XGBoost** | **91.59%** | **64.41%** | **0.9781** | **0.8830** | [`trained_models/diabetes_xgboost_pipeline.joblib`](file:///c:/Users/amman/Downloads/New%20folder/trained_models/diabetes_xgboost_pipeline.joblib) |
| **appointment_noshow** | `archive (2)/healthcare_noshows_appt.csv` | **LightGBM** | **61.07%** | **69.63%** | **0.7438** | **0.9209** | [`trained_models/appointment_noshow_lightgbm_pipeline.joblib`](file:///c:/Users/amman/Downloads/New%20folder/trained_models/appointment_noshow_lightgbm_pipeline.joblib) |
| **appointment_reservation** | `archive (3)/2017.csv` | **Extra Trees** | **79.79%** | **88.59%** | **0.6317** | **0.8551** | [`trained_models/appointment_reservation_extratrees_pipeline.joblib`](file:///c:/Users/amman/Downloads/New%20folder/trained_models/appointment_reservation_extratrees_pipeline.joblib) |
| **hospital_readmission** | `diabetic_data.csv` | **XGBoost Multiclass** | **59.41%** | **40.14%** | **0.6852** | N/A | [`trained_models/readmission_pipeline.joblib`](file:///c:/Users/amman/Downloads/New%20folder/trained_models/readmission_pipeline.joblib) |

---

## 📄 License & Disclaimer
This application is an AI-generated decision support prototype. It is **NOT** a replacement for professional medical diagnosis.
