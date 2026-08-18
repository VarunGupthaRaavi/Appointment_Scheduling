import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import List, Dict, Any, Optional

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres.isfmahsyycgokjxtkppr:Appointmnet143@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"
)

def get_db_connection():
    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor, connect_timeout=5)
        return conn
    except Exception as e:
        print(f"Warning: Failed to connect to Supabase PostgreSQL: {str(e)}")
        return None

def fetch_all_appointments_from_supabase() -> Optional[List[Dict[str, Any]]]:
    conn = get_db_connection()
    if not conn:
        return None
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM appointments ORDER BY created_at DESC;")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        # Convert RealDictRow to standard python dicts
        results = []
        for r in rows:
            d = dict(r)
            if d.get("created_at"):
                d["created_at"] = str(d["created_at"])
            results.append(d)
        return results
    except Exception as e:
        print(f"Error reading appointments from Supabase: {str(e)}")
        if conn:
            conn.close()
        return None

def insert_appointment_into_supabase(appt: Dict[str, Any]) -> bool:
    conn = get_db_connection()
    if not conn:
        return False
    try:
        cursor = conn.cursor()
        sql = """
        INSERT INTO appointments (
            id, patient_id, patient_name, patient_age, patient_gender, patient_phone,
            patient_height, patient_weight, patient_bmi, hba1c_level, blood_glucose_level,
            smoking_history, doctor_id, doctor_name, department, appointment_date, appointment_time,
            status, symptoms, health_conditions, ai_risk_score, ai_risk_category, ai_clinical_report, sync_status
        ) VALUES (
            %(id)s, %(patient_id)s, %(patient_name)s, %(patient_age)s, %(patient_gender)s, %(patient_phone)s,
            %(patient_height)s, %(patient_weight)s, %(patient_bmi)s, %(hba1c_level)s, %(blood_glucose_level)s,
            %(smoking_history)s, %(doctor_id)s, %(doctor_name)s, %(department)s, %(appointment_date)s, %(appointment_time)s,
            %(status)s, %(symptoms)s, %(health_conditions)s, %(ai_risk_score)s, %(ai_risk_category)s, %(ai_clinical_report)s, %(sync_status)s
        ) ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status,
            appointment_date = EXCLUDED.appointment_date,
            appointment_time = EXCLUDED.appointment_time,
            sync_status = EXCLUDED.sync_status;
        """
        cursor.execute(sql, appt)
        conn.commit()
        cursor.close()
        conn.close()
        print(f"✅ Successfully inserted appointment {appt['id']} into Supabase PostgreSQL!")
        return True
    except Exception as e:
        print(f"Error inserting appointment into Supabase: {str(e)}")
        if conn:
            conn.close()
        return False

def update_appointment_in_supabase(appointment_id: str, updates: Dict[str, Any]) -> bool:
    conn = get_db_connection()
    if not conn:
        return False
    try:
        cursor = conn.cursor()
        set_clauses = []
        params = {"id": appointment_id}
        for k, v in updates.items():
            set_clauses.append(f"{k} = %({k})s")
            params[k] = v
        
        sql = f"UPDATE appointments SET {', '.join(set_clauses)} WHERE id = %(id)s;"
        cursor.execute(sql, params)
        conn.commit()
        cursor.close()
        conn.close()
        print(f"✅ Successfully updated appointment {appointment_id} in Supabase PostgreSQL!")
        return True
    except Exception as e:
        print(f"Error updating appointment in Supabase: {str(e)}")
        if conn:
            conn.close()
        return False
