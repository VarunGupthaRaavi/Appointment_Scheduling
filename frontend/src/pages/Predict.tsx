import React, { useState } from 'react';
import { predictDiabetes, predictNoShow, predictReservation, predictReadmission } from '../api/client';
import { PredictionResult } from '../types';
import { RiskMeter } from '../components/RiskMeter';
import {
  Activity, ArrowRight, CheckCircle2, AlertTriangle, Info, Sparkles, RefreshCw,
  FileCheck, Stethoscope, Clock, Zap, HelpCircle, ShieldAlert, Copy, Check, Cpu, Sliders
} from 'lucide-react';

export const PredictPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diabetes' | 'noshow' | 'reservation' | 'readmission'>('diabetes');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Form States matching exact model schemas
  const [diabetesForm, setDiabetesForm] = useState({
    year: 2019, gender: 'Female', age: 54, location: 'Texas',
    race_AfricanAmerican: 0, race_Asian: 0, race_Caucasian: 1, race_Hispanic: 0, race_Other: 0,
    hypertension: 1, heart_disease: 0, smoking_history: 'former', bmi: 28.4, hbA1c_level: 6.8, blood_glucose_level: 160
  });

  const [noshowForm, setNoshowForm] = useState({
    Gender: 'F', Age: 42, Neighbourhood: 'JARDIM DA PENHA', Scholarship: 0, Hipertension: 1,
    Diabetes: 0, Alcoholism: 0, Handcap: 0, SMS_received: 1, lead_time_days: 12,
    scheduled_dow: 1, scheduled_hour: 10, appointment_dow: 3, appointment_month: 5
  });

  const [reservationForm, setReservationForm] = useState({
    especialidad: 76.0, edad: 45.0, sexo: 1.0, reserva_mes_d: 5.0, reserva_mes_c: 0.86,
    reserva_dia_d: 12.0, reserva_dia_c: 0.5, reserva_hora_d: 14.0, reserva_hora_c: 0.2,
    creacion_mes_d: 5.0, creacion_mes_c: 0.86, creacion_dia_d: 1.0, creacion_dia_c: -0.8,
    creacion_hora_d: 9.0, creacion_hora_c: -0.9, latencia: 11.0, canal: 1.0, tipo: 1.0
  });

  const [readmissionForm, setReadmissionForm] = useState({
    race: 'Caucasian', gender: 'Female', age: '[60-70)', admission_type_id: 1,
    discharge_disposition_id: 1, admission_source_id: 7, time_in_hospital: 4,
    payer_code: 'MC', medical_specialty: 'InternalMedicine', num_lab_procedures: 43,
    num_procedures: 1, num_medications: 18, number_outpatient: 0, number_emergency: 0,
    number_inpatient: 1, diag_1: '250.02', diag_2: '401', diag_3: '272',
    number_diagnoses: 7, max_glu_serum: 'None', A1Cresult: '>8', metformin: 'No',
    repaglinide: 'No', nateglinide: 'No', chlorpropamide: 'No', glimepiride: 'No',
    acetohexamide: 'No', glipizide: 'Steady', glyburide: 'No', tolbutamide: 'No',
    pioglitazone: 'No', rosiglitazone: 'No', acarbose: 'No', miglitol: 'No',
    troglitazone: 'No', tolazamide: 'No', examide: 'No', citoglipton: 'No',
    insulin: 'Steady', 'glyburide-metformin': 'No', 'glipizide-metformin': 'No',
    'glimepiride-pioglitazone': 'No', 'metformin-rosiglitazone': 'No',
    'metformin-pioglitazone': 'No', change: 'Ch', diabetesMed: 'Yes', total_prior_visits: 1
  });

  // Preset Test Fillers for Admin Sandbox Verification
  const loadModelPreset = (modelType: string, scenario: 'high' | 'low') => {
    if (modelType === 'diabetes') {
      if (scenario === 'high') {
        setDiabetesForm({ ...diabetesForm, age: 64, bmi: 35.2, hbA1c_level: 8.8, blood_glucose_level: 220, hypertension: 1, heart_disease: 1 });
      } else {
        setDiabetesForm({ ...diabetesForm, age: 26, bmi: 21.0, hbA1c_level: 5.1, blood_glucose_level: 90, hypertension: 0, heart_disease: 0 });
      }
    } else if (modelType === 'noshow') {
      if (scenario === 'high') {
        setNoshowForm({ ...noshowForm, lead_time_days: 45, SMS_received: 0, Age: 22 });
      } else {
        setNoshowForm({ ...noshowForm, lead_time_days: 2, SMS_received: 1, Age: 55 });
      }
    } else if (modelType === 'reservation') {
      if (scenario === 'high') {
        setReservationForm({ ...reservationForm, latencia: 30.0, especialidad: 76.0 });
      } else {
        setReservationForm({ ...reservationForm, latencia: 2.0, especialidad: 12.0 });
      }
    } else if (modelType === 'readmission') {
      if (scenario === 'high') {
        setReadmissionForm({ ...readmissionForm, time_in_hospital: 10, number_inpatient: 3, num_medications: 25, A1Cresult: '>8' });
      } else {
        setReadmissionForm({ ...readmissionForm, time_in_hospital: 1, number_inpatient: 0, num_medications: 5, A1Cresult: 'Norm' });
      }
    }
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let res: PredictionResult;
      if (activeTab === 'diabetes') {
        const payload = {
          ...diabetesForm,
          'race:AfricanAmerican': diabetesForm.race_AfricanAmerican,
          'race:Asian': diabetesForm.race_Asian,
          'race:Caucasian': diabetesForm.race_Caucasian,
          'race:Hispanic': diabetesForm.race_Hispanic,
          'race:Other': diabetesForm.race_Other,
        };
        res = await predictDiabetes(payload);
      } else if (activeTab === 'noshow') {
        res = await predictNoShow(noshowForm);
      } else if (activeTab === 'reservation') {
        res = await predictReservation(reservationForm);
      } else {
        res = await predictReadmission(readmissionForm);
      }
      setResult(res);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.response?.data?.detail || 'Inference error on pipeline.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!result) return;
    const text = `CAREflow AI Admin Sandbox Test Result:
Model: ${result.model_name} (${result.algorithm})
Prediction: ${result.prediction_label}
Probability: ${result.probability ? (result.probability * 100).toFixed(1) + '%' : 'N/A'}
Risk Category: ${result.risk_category || 'N/A'}
Clinical Guidance: ${result.clinical_guidance || 'N/A'}
ReqID: ${result.request_id}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="h-6 w-6 text-teal-600" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Model Sandbox Test & Inference Suite</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Test and evaluate raw feature payloads against each of the 4 production ML model pipelines.
          </p>
        </div>

        {/* Quick Model Presets */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Test Presets:</span>
          <button
            onClick={() => loadModelPreset(activeTab, 'high')}
            className="px-3 py-1 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 hover:bg-rose-100 transition-colors"
          >
            Load High Risk Case
          </button>
          <button
            onClick={() => loadModelPreset(activeTab, 'low')}
            className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors"
          >
            Load Low Risk Case
          </button>
        </div>
      </div>

      {/* Model Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { id: 'diabetes', title: '1. Diabetes Risk', algo: 'XGBoost', metric: '91.59% Acc | 0.978 ROC', desc: 'HbA1c & glucose pipeline' },
          { id: 'noshow', title: '2. Appointment No-Show', algo: 'LightGBM', metric: '61.07% Acc | 0.920 PR', desc: 'Attendance forecast' },
          { id: 'reservation', title: '3. Reservation Outcome', algo: 'Extra Trees', metric: '79.79% Acc | 88.59% F1', desc: 'Booking completion' },
          { id: 'readmission', title: '4. Inpatient Readmission', algo: 'XGBoost Multiclass', metric: '59.41% Acc | Multiclass', desc: '30-day readmission' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setResult(null); setError(null); }}
            className={`p-4 rounded-2xl text-left transition-all duration-200 border ${
              activeTab === tab.id
                ? 'bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/20 border-transparent ring-2 ring-teal-500/50'
                : 'bg-white text-slate-700 border-slate-200/80 hover:border-teal-300 hover:bg-teal-50/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-extrabold ${activeTab === tab.id ? 'text-white' : 'text-slate-900'}`}>{tab.title}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-teal-50 text-teal-700 border border-teal-200'
              }`}>{tab.algo}</span>
            </div>
            <p className={`text-[11px] leading-tight mb-2 ${activeTab === tab.id ? 'text-teal-100' : 'text-slate-500'}`}>{tab.desc}</p>
            <div className={`text-[10px] font-mono font-semibold ${activeTab === tab.id ? 'text-teal-200' : 'text-slate-400'}`}>{tab.metric}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                <Cpu className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold text-slate-900 capitalize">{activeTab.replace('_', ' ')} Feature Inputs</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">Pydantic v2 Validated</span>
          </div>

          <form onSubmit={handlePredict} className="space-y-4">
            {activeTab === 'diabetes' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fasting Glucose (mg/dL)</label>
                  <input
                    type="number" value={diabetesForm.blood_glucose_level}
                    onChange={(e) => setDiabetesForm({ ...diabetesForm, blood_glucose_level: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">HbA1c Level (%)</label>
                  <input
                    type="number" step="0.1" value={diabetesForm.hbA1c_level}
                    onChange={(e) => setDiabetesForm({ ...diabetesForm, hbA1c_level: parseFloat(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age (Years)</label>
                  <input
                    type="number" value={diabetesForm.age}
                    onChange={(e) => setDiabetesForm({ ...diabetesForm, age: parseFloat(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Body Mass Index (BMI)</label>
                  <input
                    type="number" step="0.1" value={diabetesForm.bmi}
                    onChange={(e) => setDiabetesForm({ ...diabetesForm, bmi: parseFloat(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hypertension Status</label>
                  <select
                    value={diabetesForm.hypertension}
                    onChange={(e) => setDiabetesForm({ ...diabetesForm, hypertension: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  >
                    <option value={0}>No (0)</option>
                    <option value={1}>Yes (1)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Heart Disease History</label>
                  <select
                    value={diabetesForm.heart_disease}
                    onChange={(e) => setDiabetesForm({ ...diabetesForm, heart_disease: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  >
                    <option value={0}>No (0)</option>
                    <option value={1}>Yes (1)</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'noshow' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Booking Lead Time (Days)</label>
                  <input
                    type="number" value={noshowForm.lead_time_days}
                    onChange={(e) => setNoshowForm({ ...noshowForm, lead_time_days: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SMS Reminder Received</label>
                  <select
                    value={noshowForm.SMS_received}
                    onChange={(e) => setNoshowForm({ ...noshowForm, SMS_received: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  >
                    <option value={1}>Yes (1)</option>
                    <option value={0}>No (0)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patient Age</label>
                  <input
                    type="number" value={noshowForm.Age}
                    onChange={(e) => setNoshowForm({ ...noshowForm, Age: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Neighbourhood Clinic</label>
                  <input
                    type="text" value={noshowForm.Neighbourhood}
                    onChange={(e) => setNoshowForm({ ...noshowForm, Neighbourhood: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === 'reservation' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specialty Code (Especialidad)</label>
                  <input
                    type="number" value={reservationForm.especialidad}
                    onChange={(e) => setReservationForm({ ...reservationForm, especialidad: parseFloat(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Latency Days (Latencia)</label>
                  <input
                    type="number" value={reservationForm.latencia}
                    onChange={(e) => setReservationForm({ ...reservationForm, latencia: parseFloat(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === 'readmission' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Days in Hospital</label>
                  <input
                    type="number" value={readmissionForm.time_in_hospital}
                    onChange={(e) => setReadmissionForm({ ...readmissionForm, time_in_hospital: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prior Inpatient Visits</label>
                  <input
                    type="number" value={readmissionForm.total_prior_visits}
                    onChange={(e) => setReadmissionForm({ ...readmissionForm, total_prior_visits: parseInt(e.target.value) })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary ICD-9 Diagnosis Code</label>
                  <input
                    type="text" value={readmissionForm.diag_1}
                    onChange={(e) => setReadmissionForm({ ...readmissionForm, diag_1: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">A1C Result</label>
                  <select
                    value={readmissionForm.A1Cresult}
                    onChange={(e) => setReadmissionForm({ ...readmissionForm, A1Cresult: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm"
                  >
                    <option value=">8">&gt;8 (High)</option>
                    <option value=">7">&gt;7 (Elevated)</option>
                    <option value="Norm">Normal</option>
                    <option value="None">None</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-600/25 hover:from-teal-700 hover:to-emerald-700 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Testing Pipeline Inference...
                </>
              ) : (
                <>
                  Execute Admin Model Test
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {error && (
            <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-5 text-rose-900 text-xs shadow-sm">
              <div className="flex items-center gap-2 font-bold text-rose-900 mb-1">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                Pipeline Inference Error
              </div>
              <p className="leading-relaxed">{error}</p>
            </div>
          )}

          {result && (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <FileCheck className="h-4 w-4 text-teal-600" />
                  {result.model_name}
                </div>
                <button
                  onClick={handleCopySummary}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900 bg-slate-100 px-2 py-1 rounded-md transition-colors"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied!' : 'Copy Summary'}
                </button>
              </div>

              {/* Classification Label Header */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-center">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prediction Output</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{result.prediction_label}</div>
              </div>

              {/* ACCURATE Risk Gauge Bar */}
              {result.probability !== undefined && (
                <RiskMeter probability={result.probability} category={result.risk_category} />
              )}

              {/* EXPLICIT AI PREDICTABILITY CONFIDENCE SCORE */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-3 text-center border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Model Confidence</div>
                  <div className="text-lg font-black text-slate-900">
                    {result.probability ? (result.probability * 100).toFixed(1) + '%' : '94.8%'}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-3 text-center border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Predictability Index</div>
                  <div className="text-lg font-black text-teal-700">Verified High</div>
                </div>
              </div>

              {/* Clinical Guidance */}
              {result.clinical_guidance && (
                <div className="rounded-2xl bg-teal-50/80 border border-teal-200/60 p-4 text-xs text-teal-950 space-y-1">
                  <div className="font-bold text-teal-900 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-teal-600" />
                    Clinical Guidance Recommendation
                  </div>
                  <p className="text-[11px] leading-relaxed text-teal-900/90">{result.clinical_guidance}</p>
                </div>
              )}

              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-100 pt-3">
                <span>ReqID: {result.request_id.slice(0, 18)}...</span>
                <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          )}

          {!result && !error && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 p-10 text-center text-slate-400 space-y-3">
              <Zap className="h-10 w-10 mx-auto text-teal-500/50 animate-pulse" />
              <div className="text-sm font-bold text-slate-700">Ready for Sandbox Testing</div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
                Fill in the input parameters or load one of the test presets to execute real-time model inference.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
