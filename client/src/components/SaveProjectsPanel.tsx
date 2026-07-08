import React, { useState, useEffect } from 'react';
import { ColorPalette } from '../utils/colorUtils';
import { Save, LogIn, Github, Mail, Folder, Trash, Heart, Check } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  url?: string;
  palette: ColorPalette;
  timestamp: string;
}

interface SaveProjectsPanelProps {
  currentPalette: ColorPalette;
  onLoadPalette: (palette: ColorPalette) => void;
}

export default function SaveProjectsPanel({ currentPalette, onLoadPalette }: SaveProjectsPanelProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  
  // Authentication mock state
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Load projects from local storage
  useEffect(() => {
    const saved = localStorage.getItem('vision_projects');
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const saveToLocalStorage = (list: Project[]) => {
    localStorage.setItem('vision_projects', JSON.stringify(list));
    setProjects(list);
  };

  const handleSaveProject = () => {
    const name = projectName.trim() || 'Untitled Project';
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      url: projectUrl.trim() || undefined,
      palette: { ...currentPalette },
      timestamp: new Date().toLocaleDateString()
    };
    const updated = [newProject, ...projects];
    saveToLocalStorage(updated);
    setProjectName('');
    setProjectUrl('');
    
    // Attempt syncing with backend if logged in
    if (user) {
      fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      }).catch(() => {/* ignore backend sync issues */});
    }
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    saveToLocalStorage(updated);
  };

  // Mock Authentication handler
  const handleSocialLogin = (provider: string) => {
    setLoadingAuth(true);
    setTimeout(() => {
      setUser({
        name: provider === 'Google' ? 'Alex Rivera' : 'alex_rivera',
        email: `${provider.toLowerCase()}@example.com`
      });
      setLoadingAuth(false);
    }, 1000);
  };

  return (
    <div className="space-y-6 text-xs text-slate-300">
      
      {/* 1. AUTHENTICATION MOCK */}
      {!user ? (
        <div className="p-3.5 bg-slate-900/40 border border-white/5 rounded-xl space-y-3">
          <div>
            <h4 className="font-semibold text-slate-200 text-xs">Unlock Cloud Storage</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Sign in to save themes, project dashboards, and sync across tools.</p>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => handleSocialLogin('Google')}
              disabled={loadingAuth}
              className="w-full py-1.5 bg-white text-slate-950 font-bold hover:bg-slate-100 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <LogIn size={13} />
              {loadingAuth ? 'Connecting...' : 'Sign in with Google'}
            </button>
            <button
              onClick={() => handleSocialLogin('GitHub')}
              disabled={loadingAuth}
              className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 font-bold text-white border border-white/10 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Github size={13} />
              {loadingAuth ? 'Connecting...' : 'Sign in with GitHub'}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
          <div>
            <p className="font-bold text-emerald-400">Sync Connected</p>
            <p className="text-[9px] text-slate-400 mt-0.5">Logged in as {user.email}</p>
          </div>
          <button 
            onClick={() => setUser(null)}
            className="text-[10px] text-rose-400 hover:underline"
          >
            Sign Out
          </button>
        </div>
      )}

      {/* 2. SAVE PALETTE FORM */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Save size={12} className="text-indigo-400" />
          Save Current Configuration
        </h4>
        
        <div className="p-3.5 bg-slate-900/40 border border-white/5 rounded-xl space-y-3">
          <div>
            <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Project / Preset Name</label>
            <input
              type="text"
              placeholder="e.g. Stripe Dashboard V2"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full mt-1 p-2 bg-slate-950 border border-white/5 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-200 placeholder-slate-600 text-[11px]"
            />
          </div>
          <div>
            <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Website URL (Optional)</label>
            <input
              type="text"
              placeholder="e.g. https://stripe.com"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              className="w-full mt-1 p-2 bg-slate-950 border border-white/5 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-200 placeholder-slate-600 text-[11px]"
            />
          </div>
          <button
            onClick={handleSaveProject}
            className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg flex items-center justify-center gap-1.5 font-bold transition shadow-lg"
          >
            <Folder size={13} />
            Save Project
          </button>
        </div>
      </div>

      {/* 3. SAVED PROJECTS LIST */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saved Dashboards</h4>
        {projects.length > 0 ? (
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {projects.map(proj => (
              <div 
                key={proj.id}
                className="p-2.5 bg-slate-900/30 border border-white/5 rounded-xl flex items-center justify-between group/item"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-200 truncate">{proj.name}</span>
                    <span className="text-[9px] text-slate-500 font-mono shrink-0">{proj.timestamp}</span>
                  </div>
                  {proj.url && <p className="text-[9px] text-indigo-400 truncate">{proj.url}</p>}
                  
                  {/* Minified color chips row */}
                  <div className="flex gap-1 mt-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm border border-white/10" style={{ backgroundColor: proj.palette.primary }} />
                    <span className="w-2.5 h-2.5 rounded-sm border border-white/10" style={{ backgroundColor: proj.palette.secondary }} />
                    <span className="w-2.5 h-2.5 rounded-sm border border-white/10" style={{ backgroundColor: proj.palette.accent }} />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 ml-2">
                  <button
                    onClick={() => onLoadPalette(proj.palette)}
                    className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded font-bold text-[9px] text-slate-300 hover:text-white"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded opacity-0 group-hover/item:opacity-100 transition"
                  >
                    <Trash size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-950/20 border border-white/5 rounded-xl text-center text-slate-500">
            No saved themes yet.
          </div>
        )}
      </div>

    </div>
  );
}
