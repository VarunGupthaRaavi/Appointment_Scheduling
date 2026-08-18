import os
import psycopg2

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres.your-project:your-password@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
)

CREATE_TABLES_SQL = """
-- 1. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) DEFAULT 'p-1001',
    patient_name VARCHAR(255) NOT NULL,
    patient_age INT DEFAULT 54,
    patient_gender VARCHAR(20) DEFAULT 'Female',
    patient_phone VARCHAR(50) DEFAULT '+1 (555) 234-5678',
    patient_height FLOAT DEFAULT 168.0,
    patient_weight FLOAT DEFAULT 80.0,
    patient_bmi FLOAT DEFAULT 28.3,
    hba1c_level FLOAT DEFAULT 7.2,
    blood_glucose_level INT DEFAULT 175,
    smoking_history VARCHAR(50) DEFAULT 'former',
    doctor_id VARCHAR(50) DEFAULT 'doc-202',
    doctor_name VARCHAR(255) DEFAULT 'Dr. Michael Chen',
    department VARCHAR(255) DEFAULT 'Endocrinology & Internal Medicine',
    appointment_date VARCHAR(20) NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'Scheduled',
    symptoms TEXT,
    health_conditions TEXT[],
    ai_risk_score FLOAT DEFAULT 0.78,
    ai_risk_category VARCHAR(100) DEFAULT 'High Risk',
    ai_clinical_report TEXT,
    sync_status VARCHAR(255) DEFAULT 'Synced across Patient, Doctor & Admin Portals',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. System Users Table
CREATE TABLE IF NOT EXISTS system_users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Prediction Audit Logs Table
CREATE TABLE IF NOT EXISTS prediction_logs (
    id VARCHAR(50) PRIMARY KEY,
    request_id VARCHAR(100),
    model_id VARCHAR(100) NOT NULL,
    prediction_label VARCHAR(100),
    probability FLOAT,
    risk_category VARCHAR(100),
    clinical_guidance TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Seed System Users if not exist
INSERT INTO system_users (id, email, full_name, role)
VALUES 
    ('usr-admin-101', 'admin@careflow.ai', 'Dr. Arthur Pendelton (Admin)', 'admin'),
    ('usr-doctor-101', 'doctor@careflow.ai', 'Dr. Michael Chen (Endocrinologist)', 'doctor'),
    ('usr-patient-101', 'patient@careflow.ai', 'Alex Morgan (Patient)', 'patient')
ON CONFLICT (email) DO NOTHING;

-- Seed Initial Active Appointments
INSERT INTO appointments (id, patient_id, patient_name, patient_age, patient_gender, patient_phone, patient_height, patient_weight, patient_bmi, hba1c_level, blood_glucose_level, smoking_history, doctor_id, doctor_name, department, appointment_date, appointment_time, status, symptoms, health_conditions, ai_risk_score, ai_risk_category, ai_clinical_report, sync_status)
VALUES 
    ('appt-101', 'p-1001', 'Alex Morgan', 54, 'Female', '+1 (555) 234-5678', 168.0, 80.0, 28.3, 7.2, 175, 'former', 'doc-202', 'Dr. Michael Chen', 'Endocrinology & Internal Medicine', '2026-08-20', '10:00 AM', 'Confirmed', 'Experiencing increased thirst, occasional dizziness after meals, and persistent fatigue over the past 2 weeks.', ARRAY['Diabetes Type 2', 'Hypertension'], 0.78, 'High Risk', 'Patient presents elevated fasting blood glucose (175 mg/dL) and HbA1c (7.2%). AI Triage indicates high risk of glycemic imbalance. Recommend HbA1c lab review and urgent consultation.', 'Synced across Patient, Doctor & Admin Portals'),
    ('appt-102', 'p-1002', 'Robert Smith', 62, 'Male', '+1 (555) 876-5432', 175.0, 92.0, 30.0, 8.5, 210, 'current', 'doc-201', 'Dr. Sarah Jenkins', 'Cardiology', '2026-08-20', '02:00 PM', 'Scheduled', 'Chest tightness on mild exertion, short of breath when climbing stairs.', ARRAY['Hypertension', 'Heart Disease'], 0.85, 'High Risk', 'High risk classification (85% severity). Hypertension and active chest tightness. Immediate cardiology consultation and ECG evaluation advised.', 'Synced across Patient, Doctor & Admin Portals')
ON CONFLICT (id) DO NOTHING;
"""

def setup_database():
    print("Connecting to Supabase PostgreSQL Database...")
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        cursor.execute(CREATE_TABLES_SQL)
        conn.commit()
        print("SUCCESS: Successfully created Supabase tables ('appointments', 'system_users', 'prediction_logs')!")
        
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public';")
        tables = [row[0] for row in cursor.fetchall()]
        print(f"Active Supabase Tables in 'public' schema: {tables}")

        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"ERROR: Failed to connect to Supabase: {str(e)}")
        return False

if __name__ == "__main__":
    setup_database()
