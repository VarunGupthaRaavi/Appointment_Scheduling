export type UserRole = 'patient' | 'doctor' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone_number?: string;
  avatar_url?: string;
}

export interface ModelMetrics {
  test_samples: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  pr_auc?: number | null;
  preprocessor_fitted_samples: number;
  zero_leakage_verified: boolean;
}

export interface ModelCardInfo {
  model_id: string;
  model_name: string;
  task: string;
  algorithm: string;
  version: string;
  active: boolean;
  target: string;
  test_samples: number;
  accuracy_percent: number;
  precision_percent: number;
  recall_percent: number;
  f1_score_percent: number;
  roc_auc: number;
  pr_auc?: number | null;
  performance_note: string;
}

export interface PredictionResult {
  success: boolean;
  request_id: string;
  model_id: string;
  model_name: string;
  algorithm: string;
  model_version: string;
  prediction: number;
  prediction_label: string;
  probability?: number;
  probabilities?: number[];
  risk_category?: string;
  clinical_guidance?: string;
  disclaimer: string;
  timestamp: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_age?: number;
  patient_gender?: string;
  patient_phone?: string;
  patient_height?: number;
  patient_weight?: number;
  patient_bmi?: number;
  hba1c_level?: number;
  blood_glucose_level?: number;
  smoking_history?: string;
  doctor_id: string;
  doctor_name: string;
  department: string;
  appointment_date: string;
  appointment_time: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Rescheduled' | 'Cancelled' | 'No Show';
  symptoms?: string;
  health_conditions?: string[];
  ai_risk_score?: number;
  ai_risk_category?: string;
  ai_clinical_report?: string;
  sync_status?: string;
  notes?: string;
  created_at: string;
}
