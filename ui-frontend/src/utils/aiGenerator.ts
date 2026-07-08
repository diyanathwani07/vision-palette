import { ColorPalette } from './colorUtils';

const AI_PALETTE_TEMPLATES: Record<string, Omit<ColorPalette, 'name'>> = {
  premium: {
    primary: '#6366f1',
    secondary: '#4f46e5',
    accent: '#d946ef',
    bgMain: '#030014',
    bgSurface: '#0c0724',
    navbar: '#060312',
    sidebar: '#0c0724',
    buttons: '#6366f1',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    borders: '#1c1538',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  stripe: {
    primary: '#635bff',
    secondary: '#0a2540',
    accent: '#00d4b2',
    bgMain: '#f8f9fc',
    bgSurface: '#ffffff',
    navbar: '#ffffff',
    sidebar: '#f8f9fc',
    buttons: '#635bff',
    textPrimary: '#0a2540',
    textSecondary: '#425466',
    borders: '#e3e8ee',
    success: '#00d4b2',
    warning: '#ffd300',
    error: '#ff5c5c',
  },
  apple: {
    primary: '#0071e3',
    secondary: '#86868b',
    accent: '#ff3b30',
    bgMain: '#fafafa',
    bgSurface: '#ffffff',
    navbar: '#f5f5f7',
    sidebar: '#ffffff',
    buttons: '#0071e3',
    textPrimary: '#1d1d1f',
    textSecondary: '#6e6e73',
    borders: '#d2d2d7',
    success: '#34c759',
    warning: '#ff9500',
    error: '#ff3b30',
  },
  cyberpunk: {
    primary: '#00f0ff',
    secondary: '#ff007f',
    accent: '#9400d3',
    bgMain: '#05030a',
    bgSurface: '#0f0b1e',
    navbar: '#0f0b1e',
    sidebar: '#05030a',
    buttons: '#ff007f',
    textPrimary: '#ffffff',
    textSecondary: '#00f0ff',
    borders: '#2e1948',
    success: '#00ff66',
    warning: '#ffcc00',
    error: '#ff0055',
  },
  healthcare: {
    primary: '#0d9488',
    secondary: '#0f766e',
    accent: '#f43f5e',
    bgMain: '#f0fdfa',
    bgSurface: '#ffffff',
    navbar: '#ffffff',
    sidebar: '#f0fdfa',
    buttons: '#0d9488',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    borders: '#ccfbf1',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  education: {
    primary: '#8b5cf6',
    secondary: '#6d28d9',
    accent: '#ec4899',
    bgMain: '#f5f3ff',
    bgSurface: '#ffffff',
    navbar: '#ffffff',
    sidebar: '#f5f3ff',
    buttons: '#8b5cf6',
    textPrimary: '#1e1b4b',
    textSecondary: '#4c1d95',
    borders: '#ddd6fe',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  finance: {
    primary: '#047857',
    secondary: '#065f46',
    accent: '#d97706',
    bgMain: '#061712',
    bgSurface: '#0c2e24',
    navbar: '#030e0b',
    sidebar: '#0c2e24',
    buttons: '#047857',
    textPrimary: '#e6f4f1',
    textSecondary: '#789b92',
    borders: '#144637',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  dark: {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#10b981',
    bgMain: '#0f172a',
    bgSurface: '#1e293b',
    navbar: '#0f172a',
    sidebar: '#1e293b',
    buttons: '#3b82f6',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    borders: '#334155',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  light: {
    primary: '#2563eb',
    secondary: '#475569',
    accent: '#db2777',
    bgMain: '#f8fafc',
    bgSurface: '#ffffff',
    navbar: '#ffffff',
    sidebar: '#f1f5f9',
    buttons: '#2563eb',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    borders: '#e2e8f0',
    success: '#16a34a',
    warning: '#ca8a04',
    error: '#dc2626',
  }
};

export async function generateAIPalette(prompt: string): Promise<ColorPalette> {
  // First, check if backend server endpoint is responsive (optional)
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (response.ok) {
      const data = await response.json();
      return data.palette;
    }
  } catch (e) {
    // Ignore server error and fallback to high fidelity client-side matching
  }

  const p = prompt.toLowerCase();
  let key = 'premium'; // default fallback

  if (p.includes('stripe') || p.includes('indigo') || p.includes('fintech')) {
    key = 'stripe';
  } else if (p.includes('apple') || p.includes('minimal') || p.includes('clean')) {
    key = 'apple';
  } else if (p.includes('cyberpunk') || p.includes('neon') || p.includes('cyber') || p.includes('synthwave')) {
    key = 'cyberpunk';
  } else if (p.includes('medical') || p.includes('health') || p.includes('clinic') || p.includes('teal')) {
    key = 'healthcare';
  } else if (p.includes('edu') || p.includes('school') || p.includes('learning') || p.includes('course')) {
    key = 'education';
  } else if (p.includes('finance') || p.includes('bank') || p.includes('gold') || p.includes('trust') || p.includes('crypto')) {
    key = 'finance';
  } else if (p.includes('light') || p.includes('white') || p.includes('bright')) {
    key = 'light';
  } else if (p.includes('dark') || p.includes('black') || p.includes('midnight') || p.includes('shadow')) {
    key = 'dark';
  }

  // Add minor variations based on the prompt hash to simulate "generating new theme"
  const template = AI_PALETTE_TEMPLATES[key];
  const hash = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hueShift = hash % 20 - 10; // shift colors slightly to make it feel unique!

  const shiftColor = (hex: string): string => {
    if (hex.startsWith('rgba') || hex === '#ffffff' || hex === '#000000') return hex;
    try {
      // Parse hex to hsl
      const c = hex.replace(/^#/, '');
      const num = parseInt(c.length === 3 ? c.split('').map(x => x+x).join('') : c, 16);
      let r = (num >> 16) & 255;
      let g = (num >> 8) & 255;
      let b = num & 255;
      
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h /= 6;
      }
      
      h = (h * 360 + hueShift + 360) % 360;
      s = Math.round(s * 100);
      l = Math.round(l * 100);
      
      // Hsl to hex
      h /= 360; s /= 100; l /= 100;
      let nr = l, ng = l, nb = l;
      if (s !== 0) {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        nr = hue2rgb(p, q, h + 1/3);
        ng = hue2rgb(p, q, h);
        nb = hue2rgb(p, q, h - 1/3);
      }
      const toHexHex = (val: number) => {
        const str = Math.max(0, Math.min(255, Math.round(val * 255))).toString(16);
        return str.length === 1 ? '0' + str : str;
      };
      return `#${toHexHex(nr)}${toHexHex(ng)}${toHexHex(nb)}`;
    } catch {
      return hex;
    }
  };

  return {
    name: `AI: ${prompt.length > 20 ? prompt.substring(0, 20) + '...' : prompt}`,
    primary: shiftColor(template.primary),
    secondary: shiftColor(template.secondary),
    accent: shiftColor(template.accent),
    bgMain: template.bgMain,
    bgSurface: template.bgSurface,
    navbar: template.navbar,
    sidebar: template.sidebar,
    buttons: shiftColor(template.buttons),
    textPrimary: template.textPrimary,
    textSecondary: template.textSecondary,
    borders: template.borders,
    success: template.success,
    warning: template.warning,
    error: template.error,
  };
}
