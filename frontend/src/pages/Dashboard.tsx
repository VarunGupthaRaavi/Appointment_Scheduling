import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Calendar, FileText, ArrowRight, ShieldCheck, HeartPulse, Clock, Sparkles, UserCheck } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 p-8 text-white shadow-lg shadow-teal-700/20 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-teal-200" />
            AI Clinical Triage Ready
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome to CAREflow AI Triage</h1>
          <p className="text-sm text-teal-100 leading-relaxed">
            Run real-time risk assessments for diabetes, appointment no-shows, reservation outcomes, and hospital readmissions using validated non-leaked ML models.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/predict"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-extrabold text-teal-800 shadow-sm hover:bg-teal-50 transition-all"
            >
              <Activity className="h-4 w-4 text-teal-600" />
              Launch Risk Predictor
            </Link>
            <Link
              to="/appointments"
              className="inline-flex items-center gap-2 rounded-xl bg-teal-800/60 px-5 py-2.5 text-xs font-semibold text-white border border-teal-500/40 hover:bg-teal-800 transition-all"
            >
              <Calendar className="h-4 w-4" />
              Schedule Appointment
            </Link>
          </div>
        </div>

        {/* Decorative Background Icon */}
        <HeartPulse className="absolute -right-8 -bottom-10 h-64 w-64 text-white/10 pointer-events-none" />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-shadow space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Active ML Models</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">4 Active</div>
          <p className="text-[11px] text-slate-400">XGBoost, LightGBM, Extra Trees</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-shadow space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Upcoming Appointments</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">2 Scheduled</div>
          <p className="text-[11px] text-slate-400">Next: Aug 20, 10:30 AM</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-shadow space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Recent Assessments</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">12 Logged</div>
          <p className="text-[11px] text-slate-400">Latest: Diabetes Risk Assessed</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-shadow space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Data Isolation</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-700">Supabase RLS</div>
          <p className="text-[11px] text-slate-400">Row-Level Security Active</p>
        </div>
      </div>

      {/* Model Shortcuts Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Validated Triage Modules</h2>
            <p className="text-xs text-slate-500">Select any module to perform fast clinical prediction.</p>
          </div>
          <Link to="/predict" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
            Open Full Predictor <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/predict" className="group rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">1. Diabetes Risk Model</span>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">XGBoost</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assesses HbA1c, fasting glucose, BMI, and hypertension. (ROC-AUC: 0.9781 | Recall: 89.49%)
            </p>
          </Link>

          <Link to="/predict" className="group rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 hover:border-teal-300 hover:bg-teal-50/40 transition-all">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">2. Appointment No-Show Predictor</span>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">LightGBM</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Forecasts appointment attendance based on lead time and SMS reminders. (PR-AUC: 0.9209)
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};
