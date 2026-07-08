import React from 'react';
import { ColorPalette } from '../utils/colorUtils';
import { calculateDesignScore } from '../utils/designScore';
import { Award, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

interface DesignScorePanelProps {
  palette: ColorPalette;
  radius: number;
  shadow: number;
}

export default function DesignScorePanel({ palette, radius, shadow }: DesignScorePanelProps) {
  const report = calculateDesignScore(palette, radius, shadow);

  // Score status text and colors
  let statusColor = 'text-rose-400';
  let statusBg = 'bg-rose-500/10 border-rose-500/20';
  let statusText = 'Needs Improvement';

  if (report.overall >= 85) {
    statusColor = 'text-emerald-400';
    statusBg = 'bg-emerald-500/10 border-emerald-500/20';
    statusText = 'Outstanding';
  } else if (report.overall >= 65) {
    statusColor = 'text-amber-400';
    statusBg = 'bg-amber-500/10 border-amber-500/20';
    statusText = 'Good Harmony';
  }

  const scoreBars = [
    { label: 'Modernity', value: report.modernity },
    { label: 'Accessibility', value: report.accessibility },
    { label: 'Premium Feel', value: report.premiumFeel },
    { label: 'Trust Score', value: report.trustScore },
    { label: 'Color Harmony', value: report.harmony },
    { label: 'Visual Balance', value: report.balance },
    { label: 'Consistency', value: report.consistency },
  ];

  return (
    <div className="space-y-6 text-xs text-slate-300">
      
      {/* 1. OVERALL SCORE CARD */}
      <div className={`p-4 rounded-xl border flex items-center gap-4 ${statusBg}`}>
        <div className="relative shrink-0 w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center bg-black/40">
          {/* Subtle glow behind score */}
          <div className="absolute inset-0 rounded-full blur bg-indigo-500/10" />
          <span className="text-xl font-black text-white">{report.overall}</span>
          <span className="text-[8px] absolute bottom-1.5 text-slate-400 uppercase tracking-widest">/100</span>
        </div>
        
        <div>
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-1">
            <Award size={16} className={statusColor} />
            Design Rating: <span className={statusColor}>{statusText}</span>
          </h3>
          <p className="text-[10px] text-slate-400 mt-1">
            Calculated in real-time based on contrast spacing, color wheel harmony rules, and surface elevation depths.
          </p>
        </div>
      </div>

      {/* 2. SUB-SCORES LIST */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aesthetic Breakdown</h4>
        <div className="p-3 bg-slate-900/40 border border-white/5 rounded-xl space-y-3">
          {scoreBars.map((bar, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>{bar.label}</span>
                <span className="font-semibold text-slate-200">{bar.value}%</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500"
                  style={{ width: `${bar.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. RECOMMENDATIONS */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Design Suggestions</h4>
        {report.recommendations.length > 0 ? (
          <div className="space-y-2">
            {report.recommendations.slice(0, 4).map((rec, idx) => (
              <div key={idx} className="p-2.5 bg-slate-900/20 border border-white/5 rounded-lg flex items-start gap-2">
                <AlertCircle size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-300 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-center">
            <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold text-slate-200">Perfect Harmony!</p>
            <p className="text-[10px] text-slate-400 mt-1">Your configuration matches all optimal premium design specifications.</p>
          </div>
        )}
      </div>

    </div>
  );
}
