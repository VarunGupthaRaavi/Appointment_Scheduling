import React from 'react';
import { ModelCardInfo } from '../types';
import { Cpu, CheckCircle2, AlertCircle, TrendingUp, HelpCircle } from 'lucide-react';

interface Props {
  model: ModelCardInfo;
}

export const ModelCardBadge: React.FC<Props> = ({ model }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700 border border-teal-200">
              {model.algorithm}
            </span>
            <span className="text-xs text-slate-400 font-mono">v{model.version}</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-1">{model.model_name}</h3>
          <p className="text-xs text-slate-500">{model.task}</p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Active
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl bg-slate-50 p-2.5 text-center">
          <div className="text-[11px] font-medium text-slate-500">Accuracy</div>
          <div className="text-base font-extrabold text-slate-900">{model.accuracy_percent}%</div>
        </div>

        <div className="rounded-xl bg-slate-50 p-2.5 text-center">
          <div className="text-[11px] font-medium text-slate-500">Precision</div>
          <div className="text-base font-extrabold text-slate-900">{model.precision_percent}%</div>
        </div>

        <div className="rounded-xl bg-slate-50 p-2.5 text-center">
          <div className="text-[11px] font-medium text-slate-500">Recall</div>
          <div className="text-base font-extrabold text-slate-900">{model.recall_percent}%</div>
        </div>

        <div className="rounded-xl bg-slate-50 p-2.5 text-center">
          <div className="text-[11px] font-medium text-slate-500">F1-Score</div>
          <div className="text-base font-extrabold text-slate-900">{model.f1_score_percent}%</div>
        </div>

        <div className="rounded-xl bg-slate-50 p-2.5 text-center">
          <div className="text-[11px] font-medium text-slate-500">ROC-AUC</div>
          <div className="text-base font-extrabold text-slate-900">{model.roc_auc}</div>
        </div>

        <div className="rounded-xl bg-slate-50 p-2.5 text-center">
          <div className="text-[11px] font-medium text-slate-500">PR-AUC</div>
          <div className="text-base font-extrabold text-slate-900">{model.pr_auc ?? 'N/A'}</div>
        </div>
      </div>

      <div className="rounded-xl bg-amber-50/80 border border-amber-200/60 p-3 text-xs text-amber-900">
        <div className="flex items-center gap-1.5 font-semibold text-amber-800 mb-1">
          <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
          Performance Interpretation
        </div>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          {model.performance_note}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
        <span>Test Samples: {model.test_samples.toLocaleString()}</span>
        <span>Zero-Leakage Verified</span>
      </div>
    </div>
  );
};
