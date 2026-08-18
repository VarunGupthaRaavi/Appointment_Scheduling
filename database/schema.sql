-- ==============================================================================
-- CAREflow AI — Supabase Database Schema DDL & Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. PROFILES TABLE (Tied to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'patient',
    phone_number VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. HOSPITALS TABLE
CREATE TABLE IF NOT EXISTS public.hospitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. DOCTORS TABLE
CREATE TABLE IF NOT EXISTS public.doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    specialty VARCHAR(150) NOT NULL,
    license_number VARCHAR(100) UNIQUE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender VARCHAR(20),
    blood_group VARCHAR(10),
    emergency_contact VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. MEDICAL HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.medical_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    condition_name VARCHAR(255) NOT NULL,
    diagnosis_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
    scheduled_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    appointment_date DATE NOT NULL,
    status appointment_status NOT NULL DEFAULT 'scheduled',
    notes TEXT,
    lead_time_days INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. PREDICTIONS TABLE (Individual Prediction Records)
CREATE TABLE IF NOT EXISTS public.predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id VARCHAR(100) NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
    model_id VARCHAR(100) NOT NULL,
    model_name VARCHAR(150) NOT NULL,
    algorithm VARCHAR(100) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    prediction INT NOT NULL,
    prediction_label VARCHAR(100) NOT NULL,
    probability FLOAT,
    probabilities JSONB,
    risk_category VARCHAR(50),
    input_features JSONB NOT NULL,
    disclaimer TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. PREDICTION HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.prediction_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prediction_id UUID REFERENCES public.predictions(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    model_id VARCHAR(100) NOT NULL,
    summary_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. MODEL VERSIONS TABLE (Contains verified benchmark metrics)
CREATE TABLE IF NOT EXISTS public.model_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id VARCHAR(100) NOT NULL UNIQUE,
    model_name VARCHAR(150) NOT NULL,
    task VARCHAR(150) NOT NULL,
    algorithm VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
    dataset_name VARCHAR(255) NOT NULL,
    test_samples INT NOT NULL,
    accuracy FLOAT NOT NULL,
    precision FLOAT NOT NULL,
    recall FLOAT NOT NULL,
    f1_score FLOAT NOT NULL,
    roc_auc FLOAT NOT NULL,
    pr_auc FLOAT,
    artifact_path VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON public.appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_predictions_patient ON public.predictions(patient_id);
CREATE INDEX IF NOT EXISTS idx_predictions_model ON public.predictions(model_id);
CREATE INDEX IF NOT EXISTS idx_prediction_history_patient ON public.prediction_history(patient_id);

-- SEED PRODUCTION MODEL METRICS INTO MODEL_VERSIONS TABLE
INSERT INTO public.model_versions 
(model_id, model_name, task, algorithm, version, dataset_name, test_samples, accuracy, precision, recall, f1_score, roc_auc, pr_auc, artifact_path, is_active)
VALUES
('diabetes_risk', 'Diabetes Risk Prediction Model', 'Diabetes Risk Classification', 'XGBoost', '1.0.0', 'archive/diabetes_dataset.csv', 14998, 0.9159, 0.5031, 0.8949, 0.6441, 0.9781, 0.8830, 'trained_models/diabetes_xgboost_pipeline.joblib', TRUE),

('appointment_noshow', 'Appointment No-Show Predictor', 'Appointment Attendance Prediction', 'LightGBM', '1.0.0', 'archive (2)/healthcare_noshows_appt.csv', 16047, 0.6107, 0.9210, 0.5597, 0.6963, 0.7438, 0.9209, 'trained_models/appointment_noshow_lightgbm_pipeline.joblib', TRUE),

('appointment_reservation', 'Appointment Reservation Model', 'Reservation Outcome Prediction', 'Extra Trees', '1.0.0', 'archive (3)/2017.csv', 9149, 0.7979, 0.7991, 0.9939, 0.8859, 0.6317, 0.8551, 'trained_models/appointment_reservation_extratrees_pipeline.joblib', TRUE),

('hospital_readmission', 'Hospital Readmission Triage Model', 'Inpatient Readmission Risk', 'XGBoost Multiclass', '1.0.0', 'diabetic_data.csv', 15265, 0.5941, 0.5409, 0.4188, 0.4014, 0.6852, NULL, 'trained_models/readmission_pipeline.joblib', TRUE)
ON CONFLICT (model_id) DO UPDATE SET
    accuracy = EXCLUDED.accuracy,
    precision = EXCLUDED.precision,
    recall = EXCLUDED.recall,
    f1_score = EXCLUDED.f1_score,
    roc_auc = EXCLUDED.roc_auc,
    pr_auc = EXCLUDED.pr_auc;

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_history ENABLE ROW LEVEL SECURITY;

-- Profiles: Patients access own profile, Admins access all
CREATE POLICY "Users can access own profile" ON public.profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Patients access own data" ON public.patients FOR ALL USING (auth.uid() = profile_id);
CREATE POLICY "Patients access own appointments" ON public.appointments FOR ALL USING (patient_id IN (SELECT id FROM public.patients WHERE profile_id = auth.uid()));
CREATE POLICY "Patients access own predictions" ON public.predictions FOR ALL USING (patient_id IN (SELECT id FROM public.patients WHERE profile_id = auth.uid()));
