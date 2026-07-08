import React, { useState } from 'react';
import { ColorPalette } from '../utils/colorUtils';
import { 
  exportCssVariables, 
  exportTailwindConfig, 
  exportMaterialUI, 
  exportChakraUI, 
  exportBootstrapVariables, 
  exportScssVariables, 
  exportJsonTokens, 
  exportFigmaTokens 
} from '../utils/exporter';
import { Copy, Check, Download } from 'lucide-react';

interface ExporterPanelProps {
  palette: ColorPalette;
}

export default function ExporterPanel({ palette }: ExporterPanelProps) {
  const [activeTab, setActiveTab] = useState<'css' | 'tailwind' | 'mui' | 'chakra' | 'bootstrap' | 'scss' | 'json' | 'figma'>('css');
  const [copied, setCopied] = useState(false);

  // Get current export format text
  const getExportText = () => {
    switch (activeTab) {
      case 'css': return exportCssVariables(palette);
      case 'tailwind': return exportTailwindConfig(palette);
      case 'mui': return exportMaterialUI(palette);
      case 'chakra': return exportChakraUI(palette);
      case 'bootstrap': return exportBootstrapVariables(palette);
      case 'scss': return exportScssVariables(palette);
      case 'json': return exportJsonTokens(palette);
      case 'figma': return exportFigmaTokens(palette);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const text = getExportText();
    let filename = 'variables.css';
    let mime = 'text/css';

    switch (activeTab) {
      case 'tailwind': filename = 'tailwind.config.js'; mime = 'application/javascript'; break;
      case 'mui': filename = 'theme.ts'; mime = 'application/javascript'; break;
      case 'chakra': filename = 'theme.ts'; mime = 'application/javascript'; break;
      case 'bootstrap': filename = '_variables.scss'; mime = 'text/x-scss'; break;
      case 'scss': filename = '_variables.scss'; mime = 'text/x-scss'; break;
      case 'json': filename = 'tokens.json'; mime = 'application/json'; break;
      case 'figma': filename = 'figma-tokens.json'; mime = 'application/json'; break;
    }

    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const tabs: { id: typeof activeTab; label: string }[] = [
    { id: 'css', label: 'CSS Vars' },
    { id: 'tailwind', label: 'Tailwind' },
    { id: 'mui', label: 'Material UI' },
    { id: 'chakra', label: 'Chakra' },
    { id: 'bootstrap', label: 'Bootstrap' },
    { id: 'scss', label: 'SCSS' },
    { id: 'json', label: 'JSON' },
    { id: 'figma', label: 'Figma' }
  ];

  return (
    <div className="space-y-4 text-xs text-slate-300">
      
      {/* 1. TAB MENU */}
      <div className="flex gap-1 overflow-x-auto pb-2 pr-1 border-b border-white/5 scrollbar-thin">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCopied(false);
            }}
            className={`px-3 py-1.5 rounded-lg border shrink-0 transition font-medium ${
              activeTab === tab.id 
                ? 'border-indigo-500 bg-indigo-500/10 text-white font-bold' 
                : 'border-white/5 bg-slate-950/40 text-slate-400 hover:bg-slate-950/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. TEXTAREA & ACTIONS */}
      <div className="p-3 bg-slate-950/80 border border-white/5 rounded-xl space-y-3 relative group">
        
        {/* Copy / Download overlay buttons */}
        <div className="absolute top-5 right-5 flex gap-2">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition flex items-center justify-center gap-1.5"
            title="Copy to Clipboard"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span className="text-[10px] font-bold">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/10 transition flex items-center justify-center"
            title="Download File"
          >
            <Download size={14} />
          </button>
        </div>

        <pre className="text-[10px] font-mono text-indigo-200 overflow-x-auto overflow-y-auto max-h-72 p-2 select-all whitespace-pre leading-relaxed pr-12">
          {getExportText()}
        </pre>
      </div>

      <p className="text-[10px] text-slate-400">
        Copy the tokens to your clipboard or download them as config configurations directly. Figma tokens can be loaded via design token plugins like Figma Tokens.
      </p>

    </div>
  );
}
