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
  trained_samples?: number;
  test_samples: number;
  total_samples?: number;
  accuracy_percent: number;
  precision_percent: number;
  recall_percent: number;
  f1_score_percent: number;
  roc_auc: number;
  pr_auc?: number | null;
  training_time_seconds?: number;
  last_trained_at?: string;
  status?: string;
  disparate_impact_ratio?: number;
  conformal_coverage_rate?: number;
  performance_note: string;
}

export interface TrainModelPayload {
  sample_size?: number | null;
  optimize?: boolean;
}

export interface TrainModelResult {
  model_id: string;
  model_name: string;
  algorithm: string;
  trained_samples: number;
  validation_samples?: number;
  test_samples: number;
  total_dataset_used: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  pr_auc?: number;
  training_time_seconds: number;
  last_trained_at: string;
  status: string;
}

export interface TrainModelResponse {
  success: boolean;
  message: string;
  model_id: string;
  result: TrainModelResult;
}

export interface TrainAllModelsResponse {
  success: boolean;
  message: string;
  batch_result: {
    success: boolean;
    models_trained: number;
    total_time_seconds: number;
    results: Record<string, TrainModelResult>;
    errors: Record<string, string>;
  };
}

export interface ConformalInterval {
  lower: number;
  upper: number;
  confidence_level: number;
  coverage_guarantee: string;
}

export interface CounterfactualPlan {
  target_status: string;
  actionable_interventions: Record<string, { current: any; target: any; change: string }>;
  expected_risk_reduction: number;
  clinical_recourse_summary: string;
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
  conformal_interval?: ConformalInterval;
  counterfactual_plan?: CounterfactualPlan;
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
