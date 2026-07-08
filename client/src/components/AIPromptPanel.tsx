import React, { useState } from 'react';
import { ColorPalette, PRESETS } from '../utils/colorUtils';
import { generateAIPalette } from '../utils/aiGenerator';
import { Sparkles, Compass, Check, AlertCircle } from 'lucide-react';

interface AIPromptPanelProps {
  onApplyTheme: (palette: ColorPalette) => void;
  currentPaletteName: string;
}

export default function AIPromptPanel({ onApplyTheme, currentPaletteName }: AIPromptPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (queryText: string) => {
    if (!queryText.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const result = await generateAIPalette(queryText);
      onApplyTheme(result);
      setPrompt('');
    } catch (err) {
      setError('Could not contact theme engine. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const quickPrompts = [
    { label: 'Stripe Indigo', query: 'Make it look premium like Stripe' },
    { label: 'Cyberpunk Neon', query: 'Dark cyberpunk theme with vibrant blue and magenta' },
    { label: 'Apple Minimal', query: 'Clean Apple-inspired monochrome palette' },
    { label: 'Healthcare Teal', query: 'Calming healthcare app theme' },
    { label: 'Education Purple', query: 'Vibrant online learning platform' },
    { label: 'Finance Trust', query: 'Professional trustworthy banking platform' }
  ];

  return (
    <div className="space-y-6 text-xs text-slate-300">
      
      {/* AI GENERATOR INPUT */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles size={12} className="text-indigo-400 animate-pulse-slow" />
          AI Color Generator
        </h4>
        
        <div className="p-3 bg-slate-900/40 border border-white/5 rounded-xl space-y-3">
          <textarea
            placeholder='Type a description, e.g., "Give me a high-trust investment banking design..."'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-16 p-2 bg-slate-950 border border-white/5 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-200 placeholder-slate-500 resize-none text-[11px] leading-relaxed"
          />

          {error && (
            <div className="flex gap-1.5 text-[10px] text-rose-400 items-start">
              <AlertCircle size={12} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={() => handleGenerate(prompt)}
            disabled={generating || !prompt.trim()}
            className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/30 text-white rounded-lg flex items-center justify-center gap-1.5 font-bold transition shadow-lg"
          >
            <Sparkles size={13} className={generating ? 'animate-spin' : ''} />
            {generating ? 'Generating Palette...' : 'Generate Theme'}
          </button>

          {/* Quick tags */}
          <div className="space-y-1">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Suggested Prompts</span>
            <div className="flex flex-wrap gap-1">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGenerate(qp.query)}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-[9px] text-slate-400 hover:text-white transition"
                >
                  {qp.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* READY MADE PRESETS */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Compass size={12} className="text-indigo-400" />
          Ready-Made Presets
        </h4>

        <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
          {PRESETS.map((preset, idx) => {
            const isApplied = currentPaletteName === preset.name;
            return (
              <button
                key={idx}
                onClick={() => onApplyTheme(preset)}
                className={`p-2 border rounded-xl transition text-left relative flex flex-col justify-between overflow-hidden ${
                  isApplied 
                    ? 'border-indigo-500/80 bg-indigo-500/10' 
                    : 'border-white/5 bg-slate-900/30 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center gap-1">
                    <span className="font-semibold text-slate-200 truncate">{preset.name}</span>
                    {isApplied && <Check size={10} className="text-indigo-400 shrink-0" />}
                  </div>
                  
                  {/* Colors Preview row */}
                  <div className="flex gap-1.5 mt-2.5">
                    <span className="w-3.5 h-3.5 rounded border border-white/10 shrink-0" style={{ backgroundColor: preset.primary }} title="Primary" />
                    <span className="w-3.5 h-3.5 rounded border border-white/10 shrink-0" style={{ backgroundColor: preset.secondary }} title="Secondary" />
                    <span className="w-3.5 h-3.5 rounded border border-white/10 shrink-0" style={{ backgroundColor: preset.accent }} title="Accent" />
                    <span className="w-3.5 h-3.5 rounded border border-white/10 shrink-0 animate-pulse-slow" style={{ backgroundColor: preset.bgMain }} title="Background" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
