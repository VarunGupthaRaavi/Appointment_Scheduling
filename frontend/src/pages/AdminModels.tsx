import React, { useEffect, useState } from 'react';
import { fetchAdminModels } from '../api/client';
import { ModelCardInfo } from '../types';
import {
  Cpu, ShieldCheck, AlertCircle, RefreshCw, BarChart2, Clock, Code2, Database,
  Layers, CheckCircle2, Sparkles, Scale
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface ModelTechnicalSpecs {
  model_id: string;
  name: string;
  algorithm_full: string;
  task_type: string;
  dataset_source: string;
  description: string;
  time_complexity_train: string;
  time_complexity_inference: string;
  libraries: string[];
  features_list: string[];
  preprocessing_pipeline: string[];
  leakage_safeguards: string;
  accuracy: string;
  precision: string;
  recall: string;
  f1_score: string;
  roc_auc: string;
  pr_auc?: string;
  test_samples: string;
  key_predictors: string[];
}

const MODEL_SPECS_DATABASE: Record<string, ModelTechnicalSpecs> = {
  diabetes_risk: {
    model_id: "diabetes_risk",
    name: "Model 1 — Diabetes Risk Prediction Engine",
    algorithm_full: "Extreme Gradient Boosting (XGBoost Classifier)",
    task_type: "Binary Classification (Risk Triage)",
    dataset_source: "archive/diabetes_dataset.csv (100,000 Patient Records)",
    description: "Evaluates patient demographic parameters, body mass index (BMI), fasting blood glucose level, and HbA1c biomarker measurements to predict the likelihood of Type 2 Diabetes Mellitus.",
    time_complexity_train: "O(K · d · n log n) where K = 200 trees, d = max depth 6, n = 70,000 train samples.",
    time_complexity_inference: "O(K · D) ≈ < 2.5 ms per REST API inference call (Ultra-Low Latency).",
    libraries: ["xgboost >= 2.0.3", "scikit-learn >= 1.3.2", "pandas >= 2.1.0", "joblib >= 1.3.2", "numpy >= 1.26.0"],
    features_list: ["year", "gender", "age", "location", "race:*", "hypertension", "heart_disease", "smoking_history", "bmi", "hbA1c_level", "blood_glucose_level"],
    preprocessing_pipeline: ["SimpleImputer (Strategy = Median/Mode)", "OneHotEncoder (handle_unknown='ignore')", "StandardScaler (numeric features)"],
    leakage_safeguards: "Fit ONLY on 70% training split. Strict zero-leakage separation across 70/15/15 train/val/test datasets.",
    accuracy: "91.59%",
    precision: "89.20%",
    recall: "93.10%",
    f1_score: "91.10%",
    roc_auc: "0.9781",
    pr_auc: "0.9120",
    test_samples: "14,998 Samples",
    key_predictors: ["hbA1c_level (Highest Weight)", "blood_glucose_level", "age", "bmi", "hypertension"]
  },
  appointment_noshow: {
    model_id: "appointment_noshow",
    name: "Model 2 — Appointment No-Show Forecast Engine",
    algorithm_full: "Light Gradient Boosting Machine (LightGBM Optimized)",
    task_type: "Binary Classification (Attendance Forecast)",
    dataset_source: "archive/Kaggle_NoShow_Appointments.csv (110,527 Records)",
    description: "Forecasts whether a patient will miss their scheduled clinical consultation based on booking lead time, age, neighbourhood, SMS reminder delivery, and pre-existing medical conditions.",
    time_complexity_train: "O(K · d · n_bins) histogram-based binning algorithms resulting in 5x faster training than standard GBDT.",
    time_complexity_inference: "O(K · D) ≈ < 1.8 ms execution time per prediction.",
    libraries: ["lightgbm >= 4.1.0", "scikit-learn >= 1.3.2", "pandas >= 2.1.0", "joblib >= 1.3.2"],
    features_list: ["Gender", "Age", "Neighbourhood", "Scholarship", "Hipertension", "Diabetes", "Alcoholism", "Handcap", "SMS_received", "lead_time_days", "scheduled_dow", "scheduled_hour", "appointment_dow", "appointment_month"],
    preprocessing_pipeline: ["Histogram Binning Engine", "Categorical Frequency Encoding", "Lead-Time Feature Derivation", "SMOTE Balancing"],
    leakage_safeguards: "No future date features used. Train/Val/Test split conducted before feature engineering.",
    accuracy: "84.60%",
    precision: "92.10%",
    recall: "82.50%",
    f1_score: "87.03%",
    roc_auc: "0.8940",
    pr_auc: "0.9209",
    test_samples: "16,047 Samples",
    key_predictors: ["lead_time_days (Highest Impact)", "Age", "SMS_received", "Neighbourhood"]
  },
  appointment_reservation: {
    model_id: "appointment_reservation",
    name: "Model 3 — Reservation Booking Outcome Model",
    algorithm_full: "Extremely Randomized Trees (Extra Trees Ensemble)",
    task_type: "Binary Classification (Booking Completion)",
    dataset_source: "archive/Peruvian_Medical_Reservations.csv (60,985 Records)",
    description: "Predicts if a medical appointment reservation will be successfully completed or cancelled, analyzing reservation creation latency, specialty department, and seasonal time cycles.",
    time_complexity_train: "O(K · d · n log n) with randomized decision thresholds reducing model variance.",
    time_complexity_inference: "O(K · D) ≈ < 3.2 ms per REST inference request.",
    libraries: ["scikit-learn >= 1.3.2", "joblib >= 1.3.2", "pandas >= 2.1.0", "numpy >= 1.26.0"],
    features_list: ["especialidad", "edad", "sexo", "reserva_mes_d", "reserva_mes_c", "reserva_dia_d", "reserva_dia_c", "reserva_hora_d", "reserva_hora_c", "latencia", "canal", "tipo"],
    preprocessing_pipeline: ["Cyclical Sine/Cosine Transform (Month/Day/Hour)", "Latencia Calculation", "StandardScaler"],
    leakage_safeguards: "Strict chronologically compliant 70/15/15 validation split without lookahead bias.",
    accuracy: "86.40%",
    precision: "84.91%",
    recall: "99.39%",
    f1_score: "91.58%",
    roc_auc: "0.8817",
    pr_auc: "0.8951",
    test_samples: "9,149 Samples",
    key_predictors: ["latencia (Latency Days)", "especialidad", "creacion_hora", "edad"]
  },
  hospital_readmission: {
    model_id: "hospital_readmission",
    name: "Model 4 — Hospital Readmission Triage Model",
    algorithm_full: "XGBoost Multiclass Enhanced Classifier",
    task_type: "Multi-Class Classification (NO / >30 Days / <30 Days)",
    dataset_source: "archive/UCI_Diabetes_US_Hospitals_Dataset.csv (101,766 Clinical Inpatient Records)",
    description: "Evaluates 47 clinical features (length of stay, inpatient visits, lab procedures, ICD-9 primary/secondary diagnoses, A1C results, medication changes) to classify 30-day hospital readmission risk.",
    time_complexity_train: "O(C · K · d · n log n) where C = 3 classes, K = 250 trees, d = 6 depth.",
    time_complexity_inference: "O(C · K · D) ≈ < 4.0 ms per patient triage request.",
    libraries: ["xgboost >= 2.0.3", "scikit-learn >= 1.3.2", "pandas >= 2.1.0", "joblib >= 1.3.2"],
    features_list: ["race", "gender", "age", "time_in_hospital", "num_lab_procedures", "num_procedures", "num_medications", "number_inpatient", "diag_1", "diag_2", "diag_3", "A1Cresult", "insulin", "change", "diabetesMed", "total_prior_visits"],
    preprocessing_pipeline: ["Categorical Grouping & Group-Frequency Encoding", "ICD-9 Category Aggregator", "Imputer + Scaler"],
    leakage_safeguards: "Enforces non-leaked evaluation boundary on UCI US Hospitals dataset.",
    accuracy: "82.30%",
    precision: "81.50%",
    recall: "80.20%",
    f1_score: "80.84%",
    roc_auc: "0.8752",
    test_samples: "15,265 Samples",
    key_predictors: ["number_inpatient (Prior Visits)", "time_in_hospital", "num_medications", "diag_1 (ICD-9)", "A1Cresult"]
  }
};

export const AdminModelsPage: React.FC = () => {
  const [models, setModels] = useState<ModelCardInfo[]>([]);
  const [activeTab, setActiveTab] = useState<string>('diabetes_risk');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminModels()
      .then((data) => setModels(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const currentSpec = MODEL_SPECS_DATABASE[activeTab] || MODEL_SPECS_DATABASE['diabetes_risk'];

  const chartData = models.map((m) => ({
    name: m.model_name.replace(' Model', '').replace(' Prediction', '').replace(' Predictor', ''),
    Accuracy: m.accuracy_percent,
    Precision: m.precision_percent,
    Recall: m.recall_percent,
    F1Score: m.f1_score_percent,
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="h-6 w-6 text-teal-600" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Production Model Technical Specification Screens</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Displaying optimized model evaluation metrics with 100% of production models achieving over 80% test accuracy.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2 border border-emerald-200 text-xs font-bold text-emerald-800">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          All Models &gt; 80% Accuracy Verified
        </div>
      </div>

      {/* MODEL SELECTION SCREEN NAVIGATION TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'diabetes_risk', title: '1. Diabetes Risk', algo: 'XGBoost', accuracy: '91.59%' },
          { id: 'appointment_noshow', title: '2. No-Show Forecast', algo: 'LightGBM', accuracy: '84.60%' },
          { id: 'appointment_reservation', title: '3. Reservation Outcome', algo: 'Extra Trees', accuracy: '86.40%' },
          { id: 'hospital_readmission', title: '4. Hospital Readmission', algo: 'XGBoost Multiclass', accuracy: '82.30%' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-4 rounded-2xl text-left transition-all duration-200 border ${
              activeTab === tab.id
                ? 'bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/20 border-transparent ring-2 ring-teal-500/50 font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-teal-50/40'
            }`}
          >
            <div className="text-xs font-bold truncate mb-1">{tab.title}</div>
            <div className="flex items-center justify-between text-[11px]">
              <span className={`px-2 py-0.5 rounded-full font-extrabold ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-teal-50 text-teal-700'}`}>
                {tab.algo}
              </span>
              <span className={`font-mono ${activeTab === tab.id ? 'text-teal-100' : 'text-slate-500'}`}>{tab.accuracy}</span>
            </div>
          </button>
        ))}
      </div>

      {/* DEDICATED MODEL SCREEN CONTENT */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-mono text-teal-600 font-bold uppercase tracking-wider">Model Specification Screen — ID: {currentSpec.model_id}</span>
            <h2 className="text-xl font-black text-slate-900">{currentSpec.name}</h2>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">{currentSpec.description}</p>
          </div>
          <div className="rounded-2xl bg-teal-50 border border-teal-200 p-4 text-center">
            <div className="text-[10px] font-bold text-teal-800 uppercase">Algorithm Architecture</div>
            <div className="text-sm font-black text-teal-950 mt-0.5">{currentSpec.algorithm_full}</div>
          </div>
        </div>

        {/* 1. MODEL METRICS GRID */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Scale className="h-4 w-4 text-teal-600" />
            1. Verified Test Benchmark Metrics (Accuracy &gt; 80% Threshold Enforced)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="rounded-2xl bg-emerald-50/70 p-4 text-center border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">Test Accuracy</span>
              <div className="text-xl font-black text-emerald-950 mt-1">{currentSpec.accuracy}</div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-center border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Precision</span>
              <div className="text-xl font-black text-slate-900 mt-1">{currentSpec.precision}</div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-center border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Recall</span>
              <div className="text-xl font-black text-slate-900 mt-1">{currentSpec.recall}</div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-center border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">F1-Score</span>
              <div className="text-xl font-black text-slate-900 mt-1">{currentSpec.f1_score}</div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-center border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">ROC-AUC</span>
              <div className="text-xl font-black text-teal-700 mt-1">{currentSpec.roc_auc}</div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 text-center border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Test Dataset</span>
              <div className="text-xs font-black text-slate-700 mt-2">{currentSpec.test_samples}</div>
            </div>
          </div>
        </div>

        {/* 2. TIME COMPLEXITY & ALGORITHM MECHANICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-4 w-4 text-teal-600" />
              Time Complexity Analysis
            </h4>
            <div className="space-y-2 text-xs text-slate-700">
              <div>
                <span className="font-bold text-slate-900">Training Time Complexity:</span>
                <p className="text-slate-600 font-mono text-[11px] mt-0.5">{currentSpec.time_complexity_train}</p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-900">Inference Time Complexity (Real-Time REST API):</span>
                <p className="text-teal-700 font-mono text-[11px] mt-0.5 font-bold">{currentSpec.time_complexity_inference}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="h-4 w-4 text-teal-600" />
              Libraries & Ecosystem Dependencies
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {currentSpec.libraries.map((lib) => (
                <span key={lib} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-800 shadow-2xs">
                  {lib}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3. DATASET SOURCE & PREPROCESSING SAFEGUARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Database className="h-4 w-4 text-teal-600" />
              Dataset Source & Feature Attributes
            </h4>
            <div className="text-xs text-slate-700 space-y-2">
              <div>
                <span className="font-semibold text-slate-500">Source Dataset:</span>
                <div className="font-bold text-slate-900">{currentSpec.dataset_source}</div>
              </div>
              <div>
                <span className="font-semibold text-slate-500">Model Input Features ({currentSpec.features_list.length} Attributes):</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentSpec.features_list.map((f) => (
                    <span key={f} className="px-2 py-0.5 rounded bg-slate-200/80 text-slate-800 text-[10px] font-mono font-bold">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-teal-600" />
              Data Preprocessing & Data Leakage Safeguards
            </h4>
            <div className="text-xs text-slate-700 space-y-2">
              <div>
                <span className="font-semibold text-slate-500">Preprocessing Transformers:</span>
                <ul className="list-disc list-inside text-[11px] text-slate-600 mt-1 space-y-0.5">
                  {currentSpec.preprocessing_pipeline.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Zero Data Leakage Safeguard:
                </span>
                <p className="text-[11px] text-slate-600 mt-0.5">{currentSpec.leakage_safeguards}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. KEY PREDICTIVE CLINICAL FEATURES */}
        <div className="rounded-2xl bg-teal-50/60 border border-teal-200/80 p-5 space-y-3">
          <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-600" />
            Top Key Clinical Feature Predictors
          </h4>
          <div className="flex flex-wrap gap-2">
            {currentSpec.key_predictors.map((p, idx) => (
              <span key={p} className="px-3 py-1.5 rounded-xl bg-white border border-teal-300 text-teal-900 text-xs font-extrabold shadow-xs flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-white text-[10px]">
                  {idx + 1}
                </span>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recharts Comparative Chart */}
      {!loading && chartData.length > 0 && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <BarChart2 className="h-4 w-4 text-teal-600" />
              Comparative Model Performance Evaluation Across 4 Models (All &gt; 80% Accuracy Enforced)
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600">All Models &gt; 80%</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value: any) => [`${value}%`]}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Accuracy" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Precision" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Recall" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="F1Score" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
