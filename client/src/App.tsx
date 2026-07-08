import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Palette, 
  Sliders, 
  ShieldCheck, 
  Award, 
  Save, 
  Download, 
  Upload, 
  Globe, 
  RefreshCw, 
  Undo2, 
  Redo2,
  FileImage,
  Eye,
  Settings,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

import DashboardPreview from './components/DashboardPreview';
import ColorPickerPanel from './components/ColorPickerPanel';
import PlaygroundPanel from './components/PlaygroundPanel';
import AccessibilityPanel from './components/AccessibilityPanel';
import DesignScorePanel from './components/DesignScorePanel';
import AIPromptPanel from './components/AIPromptPanel';
import SaveProjectsPanel from './components/SaveProjectsPanel';
import ExporterPanel from './components/ExporterPanel';

import { ColorPalette, DEFAULT_PALETTE } from './utils/colorUtils';
import { extractColorsFromCanvas, recolorImage, ColorCluster } from './utils/imageRecolor';

type ActiveTab = 'ai' | 'picker' | 'playground' | 'accessibility' | 'score' | 'save' | 'export';
type PreviewMode = 'dashboard' | 'screenshot';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('ai');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('dashboard');

  // Palette State
  const [palette, setPalette] = useState<ColorPalette>({ ...DEFAULT_PALETTE });
  
  // History State
  const [history, setHistory] = useState<ColorPalette[]>([{ ...DEFAULT_PALETTE }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Playground state
  const [radius, setRadius] = useState(1);
  const [shadow, setShadow] = useState(1);
  const [spacing, setSpacing] = useState(1);
  const [typography, setTypography] = useState('Outfit');
  const [gradient, setGradient] = useState(0.5);
  const [glass, setGlass] = useState(true);
  const [neumorphism, setNeumorphism] = useState(false);
  const [hoverStrength, setHoverStrength] = useState(0.5);

  // Screenshot Upload State
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);
  const [originalClusters, setOriginalClusters] = useState<ColorCluster[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [urlStatus, setUrlStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [compareSplit, setCompareSplit] = useState(50); // slider percent 0-100
  const [showOriginal, setShowOriginal] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Write palette colors to document CSS root variables in real time
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', palette.primary);
    root.style.setProperty('--secondary', palette.secondary);
    root.style.setProperty('--accent', palette.accent);
    root.style.setProperty('--bg-main', palette.bgMain);
    root.style.setProperty('--bg-surface', palette.bgSurface);
    root.style.setProperty('--navbar', palette.navbar);
    root.style.setProperty('--sidebar', palette.sidebar);
    root.style.setProperty('--buttons', palette.buttons);
    root.style.setProperty('--text-primary', palette.textPrimary);
    root.style.setProperty('--text-secondary', palette.textSecondary);
    root.style.setProperty('--borders', palette.borders);
    root.style.setProperty('--success', palette.success);
    root.style.setProperty('--warning', palette.warning);
    root.style.setProperty('--error', palette.error);
    
    root.style.setProperty('--radius-factor', radius.toString());
    root.style.setProperty('--shadow-intensity', shadow.toString());
  }, [palette, radius, shadow]);

  // Handle color updates and maintain undo/redo history stack
  const updatePaletteColor = (key: keyof ColorPalette, hex: string) => {
    if (palette[key] === hex) return;
    const newPalette = { ...palette, [key]: hex };
    setPalette(newPalette);
    
    // Truncate future index pointers and append new state
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newPalette]);
    setHistoryIndex(newHistory.length);
  };

  const applyFullTheme = (newPalette: ColorPalette) => {
    setPalette(newPalette);
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newPalette]);
    setHistoryIndex(newHistory.length);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const idx = historyIndex - 1;
      setHistoryIndex(idx);
      setPalette(history[idx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const idx = historyIndex + 1;
      setHistoryIndex(idx);
      setPalette(history[idx]);
    }
  };

  const handleReset = () => {
    applyFullTheme({ ...DEFAULT_PALETTE });
  };

  // Canvas Image Processing & Colors Extraction
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        processUploadedImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const processUploadedImage = (dataUrl: string) => {
    setImageSrc(dataUrl);
    setUrlStatus('success');

    const img = new Image();
    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      if (!ctx) return;

      // Restrict resolution for ultra-fast canvas manipulation
      const maxDim = 600;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }

      tempCanvas.width = w;
      tempCanvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);

      const imgData = ctx.getImageData(0, 0, w, h);
      setOriginalImageData(imgData);

      // Extract colors from canvas
      const extractedHexColors = extractColorsFromCanvas(tempCanvas, 6);
      
      // Auto-populate some color slots in active palette based on extraction
      const updatedPalette = { ...palette };
      if (extractedHexColors[0]) updatedPalette.bgMain = extractedHexColors[0];
      if (extractedHexColors[1]) updatedPalette.primary = extractedHexColors[1];
      if (extractedHexColors[2]) updatedPalette.accent = extractedHexColors[2];
      if (extractedHexColors[3]) updatedPalette.bgSurface = extractedHexColors[3];
      if (extractedHexColors[4]) updatedPalette.textPrimary = extractedHexColors[4];
      if (extractedHexColors[5]) updatedPalette.textSecondary = extractedHexColors[5];
      updatedPalette.name = 'Extracted Colors';
      applyFullTheme(updatedPalette);

      // Save initial clusters for live recolor tracking
      const keys: string[] = ['bgMain', 'primary', 'accent', 'bgSurface', 'textPrimary', 'textSecondary'];
      const clusters: ColorCluster[] = extractedHexColors.map((hex, i) => ({
        key: keys[i] || 'secondary',
        hex,
        rgb: {
          r: parseInt(hex.slice(1, 3), 16),
          g: parseInt(hex.slice(3, 5), 16),
          b: parseInt(hex.slice(5, 7), 16),
        }
      }));
      setOriginalClusters(clusters);
    };
    img.src = dataUrl;
  };

  // Live Recolor Trigger
  useEffect(() => {
    if (!originalImageData || !canvasRef.current || originalClusters.length === 0) return;
    
    // Recolor screen image in real-time using mappings
    recolorImage(originalImageData, canvasRef.current, originalClusters, palette, 65);
  }, [palette, originalImageData, originalClusters]);

  // URL extraction simulation
  const handleUrlAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setUrlStatus('loading');
    
    // Simulate screenshot retrieval & analysis
    setTimeout(() => {
      // Pick a random mock website layout representation
      const mockSites = [
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'
      ];
      const randomSiteImg = mockSites[Math.floor(Math.random() * mockSites.length)];
      
      processUploadedImage(randomSiteImg);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07050f] text-slate-100 selection:bg-indigo-500/30 overflow-hidden font-sans">
      
      {/* 1. TOP HEADER NAVIGATION */}
      <header className="h-14 border-b border-white/5 bg-[#0a0815]/90 backdrop-blur-md flex items-center justify-between px-6 z-40 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Palette size={18} className="text-white animate-pulse-slow" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5">
              Vision Palette
              <span className="text-[9px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 font-bold rounded-full uppercase tracking-wider">
                SaaS AI Theme Engine
              </span>
            </h1>
          </div>
        </div>

        {/* Preview Sandbox View Mode Toggle */}
        <div className="flex bg-slate-950/80 p-1 border border-white/5 rounded-xl">
          <button 
            onClick={() => setPreviewMode('dashboard')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
              previewMode === 'dashboard' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye size={13} />
            Dashboard Sandbox
          </button>
          <button 
            onClick={() => setPreviewMode('screenshot')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
              previewMode === 'screenshot' ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileImage size={13} />
            Screenshot Colorizer
          </button>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center gap-1">
          <button 
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition"
            title="Undo"
          >
            <Undo2 size={16} />
          </button>
          <button 
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg disabled:opacity-30 disabled:pointer-events-none transition"
            title="Redo"
          >
            <Redo2 size={16} />
          </button>
          <button 
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded-lg transition"
            title="Reset to default theme"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </header>

      {/* 2. BODY LAYOUT */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* CONTROL SIDEBAR (LEFT) */}
        <aside className="w-80 border-r border-white/5 bg-[#0a0815]/50 flex flex-col shrink-0 overflow-hidden">
          
          {/* TAB SYSTEM */}
          <div className="flex border-b border-white/5 bg-black/25 shrink-0 px-2 pt-1 gap-1">
            {[
              { id: 'ai', label: 'AI Presets', icon: Sparkles },
              { id: 'picker', label: 'Color Picker', icon: Palette },
              { id: 'playground', label: 'Style Playground', icon: Sliders },
              { id: 'accessibility', label: 'Contrast', icon: ShieldCheck },
              { id: 'score', label: 'Design Score', icon: Award },
              { id: 'save', label: 'Projects', icon: Save },
              { id: 'export', label: 'Export Tokens', icon: Download },
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`p-2 hover:bg-white/5 rounded-t-lg transition flex flex-col items-center gap-1.5 relative group border-b-2 ${
                    isSelected 
                      ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5 font-bold' 
                      : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon size={16} />
                  {/* Tooltip on hover */}
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 p-1 text-[9px] bg-slate-950 border border-white/10 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition z-50 whitespace-nowrap shadow-2xl">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE PANEL CONTENT */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            {activeTab === 'ai' && (
              <AIPromptPanel 
                onApplyTheme={applyFullTheme} 
                currentPaletteName={palette.name} 
              />
            )}
            {activeTab === 'picker' && (
              <ColorPickerPanel 
                palette={palette} 
                onChangeColor={updatePaletteColor} 
              />
            )}
            {activeTab === 'playground' && (
              <PlaygroundPanel
                radius={radius} setRadius={setRadius}
                shadow={shadow} setShadow={setShadow}
                spacing={spacing} setSpacing={setSpacing}
                typography={typography} setTypography={setTypography}
                gradient={gradient} setGradient={setGradient}
                glass={glass} setGlass={setGlass}
                neumorphism={neumorphism} setNeumorphism={setNeumorphism}
                hoverStrength={hoverStrength} setHoverStrength={setHoverStrength}
              />
            )}
            {activeTab === 'accessibility' && (
              <AccessibilityPanel 
                palette={palette} 
                onChangeColor={updatePaletteColor} 
              />
            )}
            {activeTab === 'score' && (
              <DesignScorePanel 
                palette={palette} 
                radius={radius} 
                shadow={shadow} 
              />
            )}
            {activeTab === 'save' && (
              <SaveProjectsPanel 
                currentPalette={palette} 
                onLoadPalette={applyFullTheme} 
              />
            )}
            {activeTab === 'export' && (
              <ExporterPanel palette={palette} />
            )}
          </div>
        </aside>

        {/* VISUALIZATION SANDBOX SCREEN (RIGHT) */}
        <main className="flex-1 bg-[#05030a] p-6 overflow-y-auto flex items-center justify-center relative">
          
          {/* Subtle abstract gradient background glow */}
          <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

          {/* PREVIEW CONTAINER SCREEN */}
          <div className="w-full max-w-5xl h-full flex flex-col border border-white/5 rounded-2xl overflow-hidden glass-panel">
            
            {/* WINDOW CONTROL TOP BAR */}
            <div className="h-10 border-b border-white/5 bg-slate-950/70 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] text-slate-500 font-mono ml-4 truncate max-w-xs">
                  {previewMode === 'dashboard' ? 'Active Visualizer Dashboard View' : 'Screenshot Recolor Studio Editor'}
                </span>
              </div>
              
              {previewMode === 'screenshot' && imageSrc && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowOriginal(!showOriginal)}
                    className={`px-2.5 py-1 text-[10px] rounded border font-semibold transition ${
                      showOriginal 
                        ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                        : 'border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    Compare Original
                  </button>
                </div>
              )}
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="flex-1 overflow-auto bg-[#07050f] relative flex items-center justify-center">
              
              {/* MODE A: INTERACTIVE SANDBOX DASHBOARD */}
              {previewMode === 'dashboard' && (
                <DashboardPreview
                  radius={radius}
                  shadow={shadow}
                  spacing={spacing}
                  typography={typography}
                  gradient={gradient}
                  glass={glass}
                  neumorphism={neumorphism}
                />
              )}

              {/* MODE B: SCREENSHOT RECOLOR STUDIO EDITOR */}
              {previewMode === 'screenshot' && (
                <div className="w-full max-w-2xl p-6 space-y-6">
                  
                  {/* Website analyzer panel */}
                  {!imageSrc && (
                    <div className="space-y-6">
                      <form onSubmit={handleUrlAnalyze} className="space-y-3">
                        <label className="text-xs font-bold text-slate-400">Paste Website URL</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Globe size={14} className="text-slate-500" />
                            </span>
                            <input
                              type="text"
                              placeholder="e.g. https://github.com"
                              value={urlInput}
                              onChange={(e) => setUrlInput(e.target.value)}
                              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-white/5 rounded-xl focus:outline-none focus:border-indigo-500 text-xs text-white placeholder-slate-600"
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={urlStatus === 'loading'}
                            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 font-bold rounded-xl text-xs text-white flex items-center gap-1.5 transition shrink-0"
                          >
                            {urlStatus === 'loading' ? (
                              <>
                                <RefreshCw size={13} className="animate-spin" />
                                Analyzing...
                              </>
                            ) : 'Capture & Extract'}
                          </button>
                        </div>
                      </form>

                      {/* Dropzone screen */}
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-white/10 hover:border-indigo-500/40 p-8 rounded-2xl bg-slate-900/10 hover:bg-slate-900/30 text-center cursor-pointer transition"
                      >
                        <Upload size={32} className="text-slate-600 mx-auto mb-3" />
                        <h4 className="font-bold text-slate-300">Upload screenshot image</h4>
                        <p className="text-[10px] text-slate-500 mt-1">Drag and drop png/jpg files or click to browse</p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}

                  {/* Visual canvas representation of uploaded screenshot */}
                  {imageSrc && (
                    <div className="flex flex-col items-center gap-4">
                      
                      {/* Interactive splitter container or side-by-side comparative viewer */}
                      <div className="border border-white/10 rounded-2xl overflow-hidden bg-slate-950 max-h-[380px] max-w-full flex items-center justify-center relative group">
                        
                        {/* Target/Colorizer canvas */}
                        <canvas 
                          ref={canvasRef} 
                          className="max-h-[380px] object-contain max-w-full"
                          style={{ display: showOriginal ? 'none' : 'block' }}
                        />

                        {/* Original comparison overlay if toggled */}
                        {showOriginal && (
                          <img 
                            src={imageSrc} 
                            alt="Original Website" 
                            className="max-h-[380px] object-contain max-w-full"
                          />
                        )}

                        {/* Analysis overlay toast */}
                        {urlStatus === 'loading' && (
                          <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center gap-2">
                            <RefreshCw size={24} className="animate-spin text-indigo-400" />
                            <p className="text-xs font-bold text-white">Extracting design nodes...</p>
                          </div>
                        )}
                      </div>

                      {/* Reset image and picker bar */}
                      <div className="flex gap-2 w-full justify-between items-center">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setImageSrc(null);
                              setOriginalImageData(null);
                              setOriginalClusters([]);
                              setUrlStatus('idle');
                            }}
                            className="px-3 py-1.5 border border-white/5 hover:bg-white/5 text-[10px] rounded-lg text-slate-400 hover:text-white transition"
                          >
                            Clear Screenshot
                          </button>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 border border-white/5 hover:bg-white/5 text-[10px] rounded-lg text-slate-400 hover:text-white transition"
                          >
                            Upload Different File
                          </button>
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <div className="flex gap-1">
                          {originalClusters.map(c => (
                            <span 
                              key={c.key} 
                              className="w-4.5 h-4.5 rounded-sm border border-white/20" 
                              style={{ backgroundColor: palette[c.key as keyof ColorPalette] }}
                              title={`Mapped color for ${c.key}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>

        </main>
      </div>

    </div>
  );
}
