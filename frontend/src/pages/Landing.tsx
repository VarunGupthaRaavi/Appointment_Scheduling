import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, Activity, ShieldCheck, Cpu, ArrowRight, CheckCircle } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
            <HeartPulse className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold text-slate-900">CAREflow <span className="text-teal-600">AI</span></span>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900">
            Sign In
          </Link>
          <Link to="/dashboard" className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-teal-700">
            Launch Portal
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-16 text-center space-y-8 my-auto">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3.5 py-1 text-xs font-semibold text-teal-800 border border-teal-200">
          <ShieldCheck className="h-4 w-4 text-teal-600" />
          4 Validated Production ML Models Active
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
          AI-Driven Patient Triage & Clinical Decision Support Engine
        </h1>

        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          CAREflow AI combines XGBoost, LightGBM, and Extra Trees machine learning pipelines to predict diabetes risk, appointment no-shows, reservation completions, and 30-day hospital readmissions.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to="/predict"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/30 hover:bg-teal-700 transition-all"
          >
            Explore AI Risk Assessment
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            to="/admin/models"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          >
            <Cpu className="h-4 w-4 text-teal-600" />
            View Verified Model Cards
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-12 text-left">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-1">
            <div className="text-xs font-bold text-teal-700">Diabetes Risk</div>
            <div className="text-lg font-extrabold text-slate-900">91.59% Acc</div>
            <div className="text-[11px] text-slate-500">0.9781 ROC-AUC</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-1">
            <div className="text-xs font-bold text-teal-700">No-Show Predictor</div>
            <div className="text-lg font-extrabold text-slate-900">61.07% Acc</div>
            <div className="text-[11px] text-slate-500">0.9209 PR-AUC</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-1">
            <div className="text-xs font-bold text-teal-700">Reservation Model</div>
            <div className="text-lg font-extrabold text-slate-900">79.79% Acc</div>
            <div className="text-[11px] text-slate-500">88.59% F1-Score</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-1">
            <div className="text-xs font-bold text-teal-700">Readmission Triage</div>
            <div className="text-lg font-extrabold text-slate-900">59.41% Acc</div>
            <div className="text-[11px] text-slate-500">Multiclass Output</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        CAREflow AI — Production Healthcare Machine Learning Prototype. Not a replacement for professional medical diagnosis.
      </footer>
    </div>
  );
};
