import React from 'react';
import { ColorPalette, evaluateContrast, suggestBetterColor } from '../utils/colorUtils';
import { ShieldCheck, ShieldAlert, Sparkles, Check, AlertTriangle } from 'lucide-react';

interface AccessibilityPanelProps {
  palette: ColorPalette;
  onChangeColor: (key: keyof ColorPalette, hex: string) => void;
}

export default function AccessibilityPanel({ palette, onChangeColor }: AccessibilityPanelProps) {
  // 1. Evaluate Primary Text contrast against App Background
  const primaryTextBg = evaluateContrast(palette.textPrimary, palette.bgMain);
  
  // 2. Evaluate Secondary Text contrast against App Background
  const secondaryTextBg = evaluateContrast(palette.textSecondary, palette.bgMain);

  // 3. Evaluate Button Text (White #ffffff) against Button background
  const buttonWhiteBg = evaluateContrast('#ffffff', palette.buttons);

  // 4. Evaluate Primary Text contrast against Card background
  const primaryTextCard = evaluateContrast(palette.textPrimary, palette.bgSurface);

  const checks = [
    {
      label: 'Primary Text on App Background',
      report: primaryTextBg,
      targetKey: 'textPrimary' as keyof ColorPalette,
      bgValue: palette.bgMain,
      fgValue: palette.textPrimary
    },
    {
      label: 'Secondary Text on App Background',
      report: secondaryTextBg,
      targetKey: 'textSecondary' as keyof ColorPalette,
      bgValue: palette.bgMain,
      fgValue: palette.textSecondary
    },
    {
      label: 'Primary Text on Surface Cards',
      report: primaryTextCard,
      targetKey: 'textPrimary' as keyof ColorPalette,
      bgValue: palette.bgSurface,
      fgValue: palette.textPrimary
    },
    {
      label: 'White Text on Buttons',
      report: buttonWhiteBg,
      targetKey: 'buttons' as keyof ColorPalette,
      bgValue: palette.buttons,
      fgValue: '#ffffff'
    }
  ];

  const handleAutoFix = (targetKey: keyof ColorPalette, fg: string, bg: string) => {
    // If fixing buttons, we adjust the button background so white text stands out.
    // Otherwise, we adjust the text foreground color.
    if (targetKey === 'buttons') {
      const fixedBtn = suggestBetterColor(fg, bg, 4.5);
      onChangeColor('buttons', fixedBtn);
    } else {
      const fixedFg = suggestBetterColor(fg, bg, 4.5);
      onChangeColor(targetKey, fixedFg);
    }
  };

  const handleFixAll = () => {
    checks.forEach(c => {
      if (!c.report.aaNormal) {
        handleAutoFix(c.targetKey, c.fgValue, c.bgValue);
      }
    });
  };

  const hasFails = checks.some(c => !c.report.aaNormal);

  return (
    <div className="space-y-5 text-xs text-slate-300">
      
      {/* HEADER BANNER */}
      <div className={`p-3 rounded-xl border flex items-center justify-between ${
        hasFails 
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-200' 
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
      }`}>
        <div className="flex items-center gap-2">
          {hasFails ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
          <div>
            <p className="font-semibold text-xs">{hasFails ? 'Accessibility Issues Found' : 'WCAG Compliant Theme'}</p>
            <p className="text-[10px] opacity-80 mt-0.5">
              {hasFails ? 'Some text ratios are too low for legibility.' : 'All primary text passes WCAG checks.'}
            </p>
          </div>
        </div>
        {hasFails && (
          <button 
            onClick={handleFixAll}
            className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg flex items-center gap-1 font-bold transition shadow-lg shrink-0 text-[10px]"
          >
            <Sparkles size={11} />
            Auto-Fix All
          </button>
        )}
      </div>

      {/* DETAILED CONTRAST LIST */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contrast Reports</h4>
        
        <div className="space-y-2">
          {checks.map((check, idx) => {
            const { report, label, targetKey, fgValue, bgValue } = check;
            return (
              <div key={idx} className="p-3 bg-slate-900/40 border border-white/5 rounded-xl space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-200">{label}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Ratio: <span className="font-bold text-indigo-400">{report.ratio.toFixed(2)}:1</span>
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      report.aaNormal ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      AA {report.aaNormal ? '✔' : '✘'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      report.aaaNormal ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                    }`}>
                      AAA {report.aaaNormal ? '✔' : '✘'}
                    </span>
                  </div>
                </div>

                {/* Rating Meter */}
                <div className="flex items-center justify-between text-[10px] border-t border-white/5 pt-2 mt-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    {report.score === 'Good' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                    {report.score === 'Needs Improvement' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                    {report.score === 'Poor' && <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>}
                    Readability: <span className="font-semibold text-slate-200">{report.score}</span>
                  </span>

                  {!report.aaNormal && (
                    <button 
                      onClick={() => handleAutoFix(targetKey, fgValue, bgValue)}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-0.5 hover:underline"
                    >
                      <Sparkles size={10} /> Fix contrast
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
