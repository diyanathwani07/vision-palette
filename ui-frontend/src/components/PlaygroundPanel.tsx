import React from 'react';
import { Sparkles, Sliders, Type, Layers } from 'lucide-react';

interface PlaygroundPanelProps {
  radius: number;
  setRadius: (val: number) => void;
  shadow: number;
  setShadow: (val: number) => void;
  spacing: number;
  setSpacing: (val: number) => void;
  typography: string;
  setTypography: (val: string) => void;
  gradient: number;
  setGradient: (val: number) => void;
  glass: boolean;
  setGlass: (val: boolean) => void;
  neumorphism: boolean;
  setNeumorphism: (val: boolean) => void;
  hoverStrength: number;
  setHoverStrength: (val: number) => void;
}

export default function PlaygroundPanel({
  radius, setRadius,
  shadow, setShadow,
  spacing, setSpacing,
  typography, setTypography,
  gradient, setGradient,
  glass, setGlass,
  neumorphism, setNeumorphism,
  hoverStrength, setHoverStrength
}: PlaygroundPanelProps) {
  return (
    <div className="space-y-6 text-xs text-slate-300">
      
      {/* SECTION 1: LAYOUT & SPACING */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Sliders size={12} className="text-indigo-400" />
          Layout & Spacing
        </h4>

        {/* RADIUS SLIDER */}
        <div className="p-3 bg-slate-900/40 border border-white/5 rounded-xl space-y-3">
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Border Radius</span>
              <span className="font-semibold text-indigo-400">{(8 * radius).toFixed(0)}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.25"
              value={radius}
              onChange={(e) => setRadius(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* SHADOW INTENSITY */}
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Shadow Intensity</span>
              <span className="font-semibold text-indigo-400">{(shadow * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={shadow}
              onChange={(e) => setShadow(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* SPACING */}
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Component Spacing</span>
              <span className="font-semibold text-indigo-400">
                {spacing === 0.75 ? 'Compact' : spacing === 1.25 ? 'Relaxed' : 'Default'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 mt-1.5">
              {[0.75, 1, 1.25].map(val => (
                <button
                  key={val}
                  onClick={() => setSpacing(val)}
                  className={`py-1.5 rounded-lg border text-center transition ${
                    spacing === val 
                      ? 'border-indigo-500 bg-indigo-500/10 text-white font-bold' 
                      : 'border-white/5 bg-slate-950/40 text-slate-400 hover:bg-slate-950/80'
                  }`}
                >
                  {val === 0.75 ? 'Compact' : val === 1.25 ? 'Relaxed' : 'Normal'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: STYLING & FX */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Layers size={12} className="text-indigo-400" />
          Aesthetic Effects
        </h4>

        <div className="p-3 bg-slate-900/40 border border-white/5 rounded-xl space-y-3">
          {/* Glassmorphism Toggle */}
          <label className="flex items-center justify-between cursor-pointer py-1">
            <div>
              <p className="font-semibold text-slate-200">Glassmorphism</p>
              <p className="text-[10px] text-slate-400">Backdrop blurs & soft overlay borders</p>
            </div>
            <input 
              type="checkbox" 
              checked={glass} 
              onChange={(e) => {
                setGlass(e.target.checked);
                if (e.target.checked) setNeumorphism(false);
              }}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer accent-indigo-500"
            />
          </label>

          {/* Neumorphism Toggle */}
          <label className="flex items-center justify-between cursor-pointer py-1 border-t border-white/5 pt-3">
            <div>
              <p className="font-semibold text-slate-200">Neumorphism</p>
              <p className="text-[10px] text-slate-400">Extruded shadow depths & inset bevels</p>
            </div>
            <input 
              type="checkbox" 
              checked={neumorphism} 
              onChange={(e) => {
                setNeumorphism(e.target.checked);
                if (e.target.checked) setGlass(false);
              }}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer accent-indigo-500"
            />
          </label>

          {/* Gradient Strength */}
          <div className="border-t border-white/5 pt-3">
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Gradient Strength</span>
              <span className="font-semibold text-indigo-400">{(gradient * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={gradient}
              onChange={(e) => setGradient(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Hover Strength */}
          <div className="border-t border-white/5 pt-3">
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Card Hover Effects</span>
              <span className="font-semibold text-indigo-400">{(hoverStrength * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={hoverStrength}
              onChange={(e) => setHoverStrength(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: TYPOGRAPHY */}
      <div className="space-y-4">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Type size={12} className="text-indigo-400" />
          Typography System
        </h4>

        <div className="p-3 bg-slate-900/40 border border-white/5 rounded-xl space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'Outfit', label: 'Outfit (SaaS Standard)', desc: 'Clean, geometrical sans' },
              { id: 'Inter', label: 'Inter (UI Classic)', desc: 'Highly legible & structured' }
            ].map(font => (
              <button
                key={font.id}
                onClick={() => setTypography(font.id)}
                className={`p-2.5 rounded-lg border text-left transition flex flex-col ${
                  typography === font.id 
                    ? 'border-indigo-500 bg-indigo-500/10 text-white font-bold' 
                    : 'border-white/5 bg-slate-950/40 text-slate-400 hover:bg-slate-950/80'
                }`}
              >
                <span className="font-bold text-xs">{font.label}</span>
                <span className="text-[9px] text-slate-400 mt-0.5">{font.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
