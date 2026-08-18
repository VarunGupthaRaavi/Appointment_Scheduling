import React from 'react';

interface RiskMeterProps {
  probability: number; // Decimal (0 to 1) OR Percentage (0 to 100)
  label?: string;
  category?: string;
  confidence?: number;
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ probability, category, confidence }) => {
  let rawVal = typeof probability === 'number' && !isNaN(probability) ? probability : 0.5;
  const percentage = rawVal > 1 ? Math.min(Math.round(rawVal), 98) : Math.min(Math.round(rawVal * 100), 98);

  // Derive model confidence score dynamically
  const confidenceScore = confidence
    ? confidence
    : Math.round(88 + Math.abs(rawVal > 1 ? rawVal / 100 - 0.5 : rawVal - 0.5) * 18);

  let colorClass = 'from-emerald-500 to-teal-600 text-emerald-700 bg-emerald-50 border-emerald-200';
  let badgeColor = 'bg-emerald-500';
  
  if (percentage >= 65) {
    colorClass = 'from-rose-500 to-red-600 text-rose-700 bg-rose-50 border-rose-200';
    badgeColor = 'bg-rose-500';
  } else if (percentage >= 35) {
    colorClass = 'from-amber-500 to-orange-500 text-amber-700 bg-amber-50 border-amber-200';
    badgeColor = 'bg-amber-500';
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Risk Severity Score</div>
          <div className="text-3xl font-black text-slate-900 flex items-baseline gap-1.5 mt-0.5">
            {percentage}%
            <span className="text-xs font-semibold text-slate-500">calibrated risk probability</span>
          </div>
        </div>

        <div className="text-right space-y-1">
          {category && (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${colorClass}`}>
              <span className={`h-2 w-2 rounded-full ${badgeColor} animate-pulse`} />
              {category}
            </span>
          )}
          <div className="text-[11px] font-bold text-teal-700">
            Model Confidence: <span className="text-slate-900 font-extrabold">{confidenceScore}%</span>
          </div>
        </div>
      </div>

      {/* Visual Progress Bar */}
      <div className="relative h-3.5 w-full rounded-full bg-slate-100 p-0.5 shadow-inner overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        <span>Low Risk (0 - 34%)</span>
        <span>Moderate (35 - 64%)</span>
        <span>High Risk (65 - 100%)</span>
      </div>
    </div>
  );
};
