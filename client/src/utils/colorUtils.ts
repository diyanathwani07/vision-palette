// Color conversion and analysis utilities

export interface ColorHSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface ColorRGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

// 1. Conversions
export function hexToRgb(hex: string): ColorRGB {
  let c = hex.replace(/^#/, '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function rgbToHex({ r, g, b }: ColorRGB): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  return '#' + ((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b)).toString(16).slice(1);
}

export function rgbToHsl({ r, g, b }: ColorRGB): ColorHSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hslToRgb({ h, s, l }: ColorHSL): ColorRGB {
  h /= 360;
  s /= 100;
  l /= 100;
  let r = l;
  let g = l;
  let b = l;

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
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

export function hexToHsl(hex: string): ColorHSL {
  return rgbToHsl(hexToRgb(hex));
}

export function hslToHex(hsl: ColorHSL): string {
  return rgbToHex(hslToRgb(hsl));
}

// 2. Color Harmonies Generation
export function getHarmonies(hexColor: string) {
  const hsl = hexToHsl(hexColor);
  
  // Complementary
  const compHsl = { ...hsl, h: (hsl.h + 180) % 360 };
  
  // Analogous
  const anal1 = { ...hsl, h: (hsl.h + 30) % 360 };
  const anal2 = { ...hsl, h: (hsl.h - 30 + 360) % 360 };

  // Monochromatic variations
  const mono1 = { ...hsl, l: Math.max(10, hsl.l - 20) };
  const mono2 = { ...hsl, l: Math.max(20, hsl.l - 10) };
  const mono3 = { ...hsl, l: Math.min(90, hsl.l + 10) };
  const mono4 = { ...hsl, l: Math.min(95, hsl.l + 20) };

  // Triadic
  const triad1 = { ...hsl, h: (hsl.h + 120) % 360 };
  const triad2 = { ...hsl, h: (hsl.h + 240) % 360 };

  return {
    complementary: hslToHex(compHsl),
    analogous: [hslToHex(anal2), hexColor, hslToHex(anal1)],
    monochromatic: [hslToHex(mono1), hslToHex(mono2), hexColor, hslToHex(mono3), hslToHex(mono4)],
    triadic: [hexColor, hslToHex(triad1), hslToHex(triad2)]
  };
}

// 3. WCAG Contrast Check
// Formula for relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export interface ContrastReport {
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
  score: 'Good' | 'Needs Improvement' | 'Poor';
}

export function evaluateContrast(fg: string, bg: string): ContrastReport {
  const ratio = getContrastRatio(fg, bg);
  const aaNormal = ratio >= 4.5;
  const aaLarge = ratio >= 3.0;
  const aaaNormal = ratio >= 7.0;
  const aaaLarge = ratio >= 4.5;

  let score: 'Good' | 'Needs Improvement' | 'Poor' = 'Poor';
  if (aaaNormal) {
    score = 'Good';
  } else if (aaNormal) {
    score = 'Needs Improvement';
  }

  return { ratio, aaNormal, aaLarge, aaaNormal, aaaLarge, score };
}

// Suggest a better text color (make it lighter or darker to satisfy ratio)
export function suggestBetterColor(fg: string, bg: string, targetRatio = 4.5): string {
  const bgHsl = hexToHsl(bg);
  const fgHsl = hexToHsl(fg);
  
  // Try shifting L value in increments
  let bestColor = fg;
  let bestRatio = getContrastRatio(fg, bg);
  
  if (bestRatio >= targetRatio) return fg;

  const isBgDark = bgHsl.l < 50;

  // If bg is dark, make fg lighter. If bg is light, make fg darker.
  for (let step = 1; step <= 50; step++) {
    const testL = isBgDark 
      ? Math.min(100, fgHsl.l + step) 
      : Math.max(0, fgHsl.l - step);
    
    const testHex = hslToHex({ ...fgHsl, l: testL });
    const ratio = getContrastRatio(testHex, bg);
    
    if (ratio >= targetRatio) {
      return testHex;
    }
    
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestColor = testHex;
    }
  }

  return bestColor;
}

// 4. Color Palette Interfaces & Presets
export interface ColorPalette {
  [key: string]: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  bgMain: string;
  bgSurface: string;
  navbar: string;
  sidebar: string;
  buttons: string;
  textPrimary: string;
  textSecondary: string;
  borders: string;
  success: string;
  warning: string;
  error: string;
}

export const PRESETS: ColorPalette[] = [
  {
    name: 'Apple Minimal',
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
  {
    name: 'Apple Midnight',
    primary: '#2997ff',
    secondary: '#86868b',
    accent: '#ff453a',
    bgMain: '#000000',
    bgSurface: '#161617',
    navbar: '#1d1d1f',
    sidebar: '#161617',
    buttons: '#0071e3',
    textPrimary: '#f5f5f7',
    textSecondary: '#86868b',
    borders: '#424245',
    success: '#30d158',
    warning: '#ffd60a',
    error: '#ff453a',
  },
  {
    name: 'Stripe Connect',
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
    warning: '#e2a100',
    error: '#ff5c5c',
  },
  {
    name: 'Vercel Sleek',
    primary: '#ffffff',
    secondary: '#a1a1aa',
    accent: '#f43f5e',
    bgMain: '#000000',
    bgSurface: '#111111',
    navbar: '#000000',
    sidebar: '#111111',
    buttons: '#ffffff',
    textPrimary: '#ffffff',
    textSecondary: '#888888',
    borders: '#333333',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  {
    name: 'Cyberpunk Neon',
    primary: '#00f0ff',
    secondary: '#ff007f',
    accent: '#9400d3',
    bgMain: '#0b0813',
    bgSurface: '#140e28',
    navbar: '#140e28',
    sidebar: '#0b0813',
    buttons: '#ff007f',
    textPrimary: '#ffffff',
    textSecondary: '#00f0ff',
    borders: '#2d1b54',
    success: '#00ff66',
    warning: '#ffcc00',
    error: '#ff0055',
  },
  {
    name: 'Spotify Green',
    primary: '#1db954',
    secondary: '#b3b3b3',
    accent: '#1db954',
    bgMain: '#121212',
    bgSurface: '#181818',
    navbar: '#040404',
    sidebar: '#121212',
    buttons: '#1db954',
    textPrimary: '#ffffff',
    textSecondary: '#b3b3b3',
    borders: '#282828',
    success: '#1db954',
    warning: '#f59e0b',
    error: '#e91429',
  },
  {
    name: 'GitHub Dark',
    primary: '#2ea44f',
    secondary: '#8b949e',
    accent: '#58a6ff',
    bgMain: '#0d1117',
    bgSurface: '#161b22',
    navbar: '#161b22',
    sidebar: '#0d1117',
    buttons: '#238636',
    textPrimary: '#c9d1d9',
    textSecondary: '#8b949e',
    borders: '#30363d',
    success: '#56d364',
    warning: '#e3b341',
    error: '#f85149',
  },
  {
    name: 'Discord Classic',
    primary: '#5865f2',
    secondary: '#99aab5',
    accent: '#eb459e',
    bgMain: '#2f3136',
    bgSurface: '#36393f',
    navbar: '#202225',
    sidebar: '#2f3136',
    buttons: '#5865f2',
    textPrimary: '#ffffff',
    textSecondary: '#b9bbbe',
    borders: '#202225',
    success: '#3ba55d',
    warning: '#faa81a',
    error: '#ed4245',
  },
  {
    name: 'Forest Moss',
    primary: '#2d6a4f',
    secondary: '#74c69d',
    accent: '#ffb703',
    bgMain: '#1b4332',
    bgSurface: '#2d6a4f',
    navbar: '#1b4332',
    sidebar: '#2d6a4f',
    buttons: '#40916c',
    textPrimary: '#d8f3dc',
    textSecondary: '#95d5b2',
    borders: '#40916c',
    success: '#52b788',
    warning: '#ffd166',
    error: '#d90429',
  },
  {
    name: 'Sunset Glow',
    primary: '#f77f00',
    secondary: '#fcbf49',
    accent: '#d62828',
    bgMain: '#003049',
    bgSurface: '#00283e',
    navbar: '#00283e',
    sidebar: '#003049',
    buttons: '#f77f00',
    textPrimary: '#eae2b7',
    textSecondary: '#fcbf49',
    borders: '#f77f0022',
    success: '#40916c',
    warning: '#ffd166',
    error: '#d62828',
  }
];

// Extracted colors default
export const DEFAULT_PALETTE: ColorPalette = {
  name: 'Default Palette',
  primary: '#6366f1',
  secondary: '#64748b',
  accent: '#f43f5e',
  bgMain: '#0b0a14',
  bgSurface: '#161525',
  navbar: '#12111f',
  sidebar: '#0b0a14',
  buttons: '#6366f1',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  borders: '#27263b',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};
