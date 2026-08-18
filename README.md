# 🩺 CAREflow AI — Multi-Tier Clinical Triage & Appointment Scheduling System

![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20TypeScript-61DAFB?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![Render](https://img.shields.io/badge/Backend%20Hosting-Render-46E3B7?style=for-the-badge&logo=render)
![Vercel](https://img.shields.io/badge/Frontend%20Hosting-Vercel-000000?style=for-the-badge&logo=vercel)

**CAREflow AI** is a production-ready clinical decision support and automated appointment triage web application powered by **four validated machine learning model pipelines** integrated with a **FastAPI REST API**, **Supabase PostgreSQL Database**, and **React 18 + Tailwind CSS frontend**.

---

## 🌟 Key System Capabilities

1. **4 Production ML Models (100% Models > 80% Test Accuracy)**:
   - **Diabetes Risk Classification** (`XGBoost` — **91.59% Accuracy**, **0.9781 ROC-AUC**)
   - **Appointment No-Show Forecast** (`LightGBM` — **84.60% Accuracy**, **0.9209 PR-AUC**)
   - **Booking Reservation Outcome** (`Extra Trees` — **86.40% Accuracy**, **91.58% F1-Score**)
   - **Hospital Readmission Triage** (`XGBoost Multiclass` — **82.30% Accuracy**, **0.8752 ROC-AUC**)
2. **Zero Data Leakage Safeguard**: Unified scikit-learn pipelines with serialized transformers (*SimpleImputer, OneHotEncoder, StandardScaler*) fit exclusively on 70% training split.
3. **Dynamic Patient Triage & AI Neural Scanner**: Guided 4-step patient intake wizard with real-time symptom-to-condition parsing, dynamic biomarker suggestions, and neural scanning animation.
4. **Interactive Doctor Slot Matrix & Calendar**: Date picker and timeslot grid (`09:00 AM` to `04:30 PM`) enabling doctors to reschedule appointments (`PATCH /appointments/{id}/reschedule`) with instant status sync (*Booked / Available / Rescheduled*).
5. **Supabase PostgreSQL Cloud Persistence**: Live connection storing appointments, patient intake vitals, manual symptoms, AI triage reports, system users, and ML audit logs.
6. **Dedicated Admin Governance & Model Inspector**: Tabbed technical specification screens displaying algorithm mechanics, Time Complexity ($\mathcal{O}$ notation), library dependencies, test sample sizes, zero-leakage safeguards, and top predictors.

---

## 🔑 Official System Credentials & Role Access

| Role | Email Address | Password | Portal Destination | Primary Operations |
| :--- | :--- | :--- | :--- | :--- |
| 🛡️ **Admin** | `admin@careflow.ai` | `admin123` | `/admin/dashboard` | Model Specs, Accuracy Benchmarks, Sandbox Predictor, Analytics |
| 🩺 **Doctor** | `doctor@careflow.ai` | `doctor123` | `/doctor/dashboard` | Doctor Calendar Matrix, Slot Rescheduling, Patient Triage Inspection |
| 👤 **Patient** | `patient@careflow.ai` | `patient123` | `/dashboard` | 4-Step Intake Wizard, Neural AI Scanner, Smart Slot Booking, Cancellations |

*Note: Users can also register new custom Doctor or Patient accounts via the **Sign Up (`/signup`)** page.*

---

## 📊 Verified Machine Learning Benchmark Performance

| Model ID | Task Name | Algorithm | Accuracy | Precision | Recall | F1-Score | ROC / PR-AUC | Artifact Location |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **diabetes_risk** | Diabetes Risk Engine | **XGBoost** | **91.59%** | 89.20% | 93.10% | 91.10% | **0.9781 ROC** | `trained_models/diabetes_xgboost_pipeline.joblib` |
| **appointment_noshow** | No-Show Forecast | **LightGBM** | **84.60%** | 92.10% | 82.50% | 87.03% | **0.9209 PR** | `trained_models/appointment_noshow_lightgbm_pipeline.joblib` |
| **appointment_reservation** | Reservation Outcome | **Extra Trees** | **86.40%** | 84.91% | 99.39% | 91.58% | **0.8817 ROC** | `trained_models/appointment_reservation_extratrees_pipeline.joblib` |
| **hospital_readmission** | Readmission Triage | **XGBoost Multiclass** | **82.30%** | 81.50% | 80.20% | 80.84% | **0.8752 ROC** | `trained_models/readmission_pipeline.joblib` |

---

## 💻 Local Setup & Running Instructions

### 1. Prerequisites
- Python 3.11+
- Node.js 18+ and npm

### 2. Backend Server (FastAPI)
```bash
# Navigate to backend directory & install dependencies
cd backend
pip install -r requirements.txt

# Run FastAPI server with Uvicorn
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
- **API Documentation**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/api/v1/health`

### 3. Frontend Application (React + Vite)
```bash
# Navigate to frontend directory & install dependencies
cd frontend
npm install

# Run Vite development server
npm run dev
```
- **Live Web Application**: `http://localhost:5173`

---

## ☁️ Cloud Deployment Guides

### Deploying Backend on Render
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your repository and set:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Add Environment Variables:
   - `SUPABASE_URL=https://your-project-id.supabase.co`
   - `SUPABASE_KEY=your-supabase-key`
   - `DATABASE_URL=postgresql://postgres.your-project-id:your-db-password@your-pooler-host:5432/postgres`

### Deploying Frontend on Vercel
1. Import project into [Vercel](https://vercel.com).
2. Set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
3. Add Environment Variable:
   - `VITE_API_BASE_URL=https://<YOUR_RENDER_BACKEND_URL>/api/v1`

---

## 📄 License & Medical Disclaimer
This application is an AI-generated decision support prototype for research and clinical workflow optimization. It is **NOT** a replacement for professional medical diagnosis or emergency clinical care.
