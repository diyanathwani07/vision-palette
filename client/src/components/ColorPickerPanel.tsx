import React, { useState, useEffect, useRef } from 'react';
import { ColorPalette, hexToHsl, hslToHex, getHarmonies, hexToRgb } from '../utils/colorUtils';
import { Copy, Check, Info } from 'lucide-react';

interface ColorPickerPanelProps {
  palette: ColorPalette;
  onChangeColor: (key: keyof ColorPalette, hex: string) => void;
}

export default function ColorPickerPanel({ palette, onChangeColor }: ColorPickerPanelProps) {
  const [activeKey, setActiveKey] = useState<keyof ColorPalette>('primary');
  const activeColor = palette[activeKey] || '#6366f1';
  
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Harmonized suggestions for active color
  const harmonies = getHarmonies(activeColor);

  // Color chips config
  const colorChips: { key: keyof ColorPalette; label: string; group: string }[] = [
    { key: 'primary', label: 'Primary Brand', group: 'Brand' },
    { key: 'secondary', label: 'Secondary', group: 'Brand' },
    { key: 'accent', label: 'Accent Detail', group: 'Brand' },
    { key: 'buttons', label: 'Button Accent', group: 'Brand' },
    { key: 'bgMain', label: 'App Background', group: 'Layout' },
    { key: 'bgSurface', label: 'Card Surface', group: 'Layout' },
    { key: 'navbar', label: 'Header Navbar', group: 'Layout' },
    { key: 'sidebar', label: 'Side Navigation', group: 'Layout' },
    { key: 'textPrimary', label: 'Primary Text', group: 'Typography' },
    { key: 'textSecondary', label: 'Secondary Text', group: 'Typography' },
    { key: 'borders', label: 'Borders / Lines', group: 'Typography' },
    { key: 'success', label: 'Success Flag', group: 'Status' },
    { key: 'warning', label: 'Warning Flag', group: 'Status' },
    { key: 'error', label: 'Error Flag', group: 'Status' },
  ];

  // Draw the Color Wheel Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(cx, cy) - 5;

    ctx.clearRect(0, 0, width, height);

    // Draw HSL color wheel
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 0.5) * Math.PI / 180;
      const endAngle = (angle + 1.5) * Math.PI / 180;
      
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, '#ffffff'); // Center is white
      grad.addColorStop(1, `hsl(${angle}, 100%, 50%)`); // Border is full hue

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }, []);

  // Handle color wheel mouse interaction
  const handleWheelClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const dx = x - cx;
    const dy = y - cy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = Math.min(cx, cy) - 5;

    if (distance > radius) return; // Out of bounds

    // Calculate Hue
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    if (angle < 0) angle += 360;
    const hue = Math.round(angle);

    // Calculate Saturation (based on distance from center)
    const sat = Math.round((distance / radius) * 100);
    
    // Maintain current lightness
    const currentHsl = hexToHsl(activeColor);
    const newHex = hslToHex({ h: hue, s: sat, l: currentHsl.l });
    onChangeColor(activeKey, newHex);
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const activeHsl = hexToHsl(activeColor);
  const activeRgb = hexToRgb(activeColor);

  return (
    <div className="space-y-6 text-xs text-slate-300">
      
      {/* 1. KEY SELECTOR & CHIPS */}
      <div>
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Editable Color Chips</h4>
        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
          {colorChips.map(chip => {
            const isSelected = activeKey === chip.key;
            return (
              <button
                key={chip.key}
                onClick={() => setActiveKey(chip.key)}
                className={`p-2 flex items-center justify-between border rounded-lg transition-all text-left ${
                  isSelected 
                    ? 'border-indigo-500/80 bg-indigo-500/10 shadow-lg' 
                    : 'border-white/5 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span 
                    className="w-4 h-4 rounded border border-white/20 shrink-0" 
                    style={{ backgroundColor: palette[chip.key] }}
                  />
                  <div className="truncate">
                    <p className="font-semibold text-slate-200 truncate">{chip.label}</p>
                    <p className="text-[9px] text-slate-400 font-mono truncate">{palette[chip.key]}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SLIDERS & CONTROLS */}
      <div className="p-4 rounded-xl border border-white/5 bg-slate-900/40 space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Adjust: <span className="text-indigo-400">{colorChips.find(c => c.key === activeKey)?.label}</span>
          </h4>
          <button 
            onClick={() => copyToClipboard(activeColor)}
            className="flex items-center gap-1 hover:text-white"
          >
            {copiedColor === activeColor ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            <span className="font-mono">{activeColor}</span>
          </button>
        </div>

        {/* Dynamic Color Wheel & Values */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative">
            <canvas 
              ref={canvasRef} 
              width={110} 
              height={110} 
              className="cursor-crosshair rounded-full border border-white/10"
              onClick={handleWheelClick}
            />
            {/* Center target indicator */}
            <div 
              className="absolute w-2 h-2 rounded-full border-2 border-white pointer-events-none shadow" 
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: activeColor
              }}
            />
          </div>

          <div className="flex-1 w-full space-y-2.5">
            {/* HUE SLIDER */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Hue ({activeHsl.h}°)</span>
                <span className="font-mono">H</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="360" 
                value={activeHsl.h}
                onChange={(e) => {
                  const h = parseInt(e.target.value);
                  onChangeColor(activeKey, hslToHex({ ...activeHsl, h }));
                }}
                className="w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* SATURATION SLIDER */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Saturation ({activeHsl.s}%)</span>
                <span className="font-mono">S</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={activeHsl.s}
                onChange={(e) => {
                  const s = parseInt(e.target.value);
                  onChangeColor(activeKey, hslToHex({ ...activeHsl, s }));
                }}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* LIGHTNESS SLIDER */}
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Lightness ({activeHsl.l}%)</span>
                <span className="font-mono">L</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={activeHsl.l}
                onChange={(e) => {
                  const l = parseInt(e.target.value);
                  onChangeColor(activeKey, hslToHex({ ...activeHsl, l }));
                }}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* RGB Raw inputs */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-1.5 bg-black/20 border border-white/5 rounded text-center">
            <span className="text-[9px] text-slate-500 font-bold">RED</span>
            <p className="font-mono text-slate-300 font-bold">{activeRgb.r}</p>
          </div>
          <div className="p-1.5 bg-black/20 border border-white/5 rounded text-center">
            <span className="text-[9px] text-slate-500 font-bold">GREEN</span>
            <p className="font-mono text-slate-300 font-bold">{activeRgb.g}</p>
          </div>
          <div className="p-1.5 bg-black/20 border border-white/5 rounded text-center">
            <span className="text-[9px] text-slate-500 font-bold">BLUE</span>
            <p className="font-mono text-slate-300 font-bold">{activeRgb.b}</p>
          </div>
        </div>
      </div>

      {/* 3. COLOR HARMONIES */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          Color Theory Harmonies
          <span className="group relative">
            <Info size={10} className="text-slate-500 cursor-pointer" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 p-2 w-48 text-[9px] bg-slate-950 border border-white/10 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition duration-200 z-50 shadow-2xl">
              Applying a harmony automatically updates the Accent / Secondary color slots.
            </span>
          </span>
        </h4>

        {/* Monochromatic suggestions */}
        <div className="p-3 bg-slate-900/20 border border-white/5 rounded-xl space-y-2.5">
          <div>
            <span className="text-[10px] text-slate-400">Monochromatic Variations</span>
            <div className="flex gap-1.5 mt-1.5">
              {harmonies.monochromatic.map((hex, i) => (
                <button
                  key={i}
                  onClick={() => onChangeColor(activeKey, hex)}
                  className="h-7 flex-1 rounded border border-white/10 relative group/chip"
                  style={{ backgroundColor: hex }}
                >
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/chip:block p-1 bg-black/90 text-[8px] font-mono rounded select-all z-10 border border-white/10">
                    {hex}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Complementary & Triadic */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
            <div>
              <span className="text-[10px] text-slate-400">Complementary</span>
              <button
                onClick={() => onChangeColor('accent', harmonies.complementary)}
                className="w-full h-8 mt-1.5 rounded-lg border border-white/10 flex items-center justify-center gap-2 relative group/chip hover:border-indigo-500/50 transition"
                style={{ backgroundColor: harmonies.complementary }}
              >
                <span className="px-2 py-0.5 bg-black/60 rounded text-[9px] font-mono text-slate-200 font-bold uppercase">
                  Apply Accent
                </span>
              </button>
            </div>

            <div>
              <span className="text-[10px] text-slate-400">Analogous Shift</span>
              <div className="flex gap-1 mt-1.5">
                {harmonies.analogous.map((hex, i) => (
                  <button
                    key={i}
                    onClick={() => onChangeColor(activeKey, hex)}
                    className="h-8 flex-1 rounded-lg border border-white/10 hover:scale-105 transition"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
