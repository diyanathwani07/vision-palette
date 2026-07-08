import { ColorPalette, evaluateContrast, hexToHsl } from './colorUtils';

export interface DesignScoreReport {
  modernity: number;
  accessibility: number;
  premiumFeel: number;
  trustScore: number;
  harmony: number;
  balance: number;
  consistency: number;
  overall: number;
  recommendations: string[];
}

export function calculateDesignScore(palette: ColorPalette, borderFactor: number, shadowFactor: number): DesignScoreReport {
  const recommendations: string[] = [];
  
  // 1. Accessibility Score
  const primaryContrast = evaluateContrast(palette.textPrimary, palette.bgMain).ratio;
  const secondaryContrast = evaluateContrast(palette.textSecondary, palette.bgMain).ratio;
  const buttonContrast = evaluateContrast('#ffffff', palette.buttons).ratio;

  let accessibility = 50;
  if (primaryContrast >= 7.0) accessibility += 25;
  else if (primaryContrast >= 4.5) accessibility += 15;
  else recommendations.push('Increase contrast of primary text against the main background.');

  if (secondaryContrast >= 4.5) accessibility += 15;
  else if (secondaryContrast >= 3.0) accessibility += 8;
  else recommendations.push('Increase contrast of secondary text (e.g. make it lighter or darker).');

  if (buttonContrast >= 4.5) accessibility += 10;
  else if (buttonContrast >= 3.0) accessibility += 5;
  else recommendations.push('Increase button color contrast against text (or make buttons darker/lighter).');

  accessibility = Math.min(100, Math.max(20, accessibility));

  // 2. Modernity Score (0-100)
  // Modern designs favor moderate rounded corners (0.5 to 1.5 borderFactor), soft shadows (0.5 to 1.5 shadowFactor), and dark surfaces.
  let modernity = 60;
  if (borderFactor >= 0.5 && borderFactor <= 1.5) modernity += 15;
  else if (borderFactor > 1.5) recommendations.push('Slightly decrease border-radius to look more clean and modern.');
  else recommendations.push('Increase border-radius slightly for a softer UI appearance.');

  if (shadowFactor >= 0.6 && shadowFactor <= 1.5) modernity += 15;
  else if (shadowFactor > 1.5) recommendations.push('Soften your shadows; they are currently too intense.');
  else recommendations.push('Add soft shadows to create clean elevation layers.');

  const bgHsl = hexToHsl(palette.bgMain);
  if (bgHsl.l < 15) modernity += 10; // Dark mode premium bonus

  modernity = Math.min(100, Math.max(30, modernity));

  // 3. Premium Feel Score (0-100)
  // Glassmorphic properties, subtle borders, well-balanced primary colors.
  let premiumFeel = 55;
  const surfaceHsl = hexToHsl(palette.bgSurface);
  const borderHsl = hexToHsl(palette.borders);
  
  // High contrast borders feel cheap; soft, low-opacity borders feel premium
  const borderBgDiff = Math.abs(borderHsl.l - surfaceHsl.l);
  if (borderBgDiff < 15) {
    premiumFeel += 20;
  } else {
    recommendations.push('Reduce border color opacity or brightness to make card dividers subtle.');
  }

  // Soft saturated accents
  const primaryHsl = hexToHsl(palette.primary);
  if (primaryHsl.s > 40 && primaryHsl.s < 90) {
    premiumFeel += 15;
  } else if (primaryHsl.s >= 90) {
    recommendations.push('Tone down the primary color saturation slightly for a more premium vibe.');
  }

  // Surface card check
  if (surfaceHsl.l > bgHsl.l && Math.abs(surfaceHsl.l - bgHsl.l) > 4) {
    premiumFeel += 10;
  } else {
    recommendations.push('Make your card background distinct from the main application background.');
  }

  premiumFeel = Math.min(100, Math.max(30, premiumFeel));

  // 4. Trust Score (0-100)
  // Deep blues, greens, teals, slate grays are trust builders. Neons decrease trust score slightly.
  let trustScore = 70;
  if (primaryHsl.h >= 190 && primaryHsl.h <= 240) {
    trustScore += 20; // Trusty blues
  } else if (primaryHsl.h >= 120 && primaryHsl.h <= 170) {
    trustScore += 15; // Safe greens
  } else if (primaryHsl.s > 85) {
    trustScore -= 10; // Extreme neons
    recommendations.push('Highly saturated neon primary colors can sometimes feel less corporate/trustworthy.');
  }

  trustScore = Math.min(100, Math.max(40, trustScore));

  // 5. Harmony Score (0-100)
  // Hues spacing calculation
  let harmony = 60;
  const accentHsl = hexToHsl(palette.accent);
  const diffH = Math.abs(primaryHsl.h - accentHsl.h);
  
  // Complementary (~180 deg) or Analogous (~30 deg) or Monochromatic (0-10 deg)
  if (diffH < 15 || (diffH > 165 && diffH < 195) || (diffH > 25 && diffH < 35)) {
    harmony += 30;
  } else if ((diffH > 105 && diffH < 135) || (diffH > 225 && diffH < 255)) {
    harmony += 20; // Triadic
  } else {
    recommendations.push('Try matching primary and accent colors to complementary or analogous angles on the color wheel.');
  }

  // Check saturation consistency
  if (Math.abs(primaryHsl.s - accentHsl.s) < 25) {
    harmony += 10;
  }

  harmony = Math.min(100, Math.max(40, harmony));

  // 6. Balance Score (0-100)
  // 60-30-10 Rule: Dominant (bg) should be light/dark, structure (cards/text) secondary, details (primary/accent) detail.
  let balance = 65;
  if (bgHsl.l < 15 || bgHsl.l > 85) {
    balance += 15; // clean base
  } else {
    recommendations.push('Use a very dark or very light background for optimal layout contrast.');
  }

  if (primaryHsl.l > 30 && primaryHsl.l < 70) {
    balance += 20; // brand color is distinct but not washing out
  }

  balance = Math.min(100, Math.max(30, balance));

  // 7. Consistency Score (0-100)
  let consistency = 75;
  const navbarHsl = hexToHsl(palette.navbar);
  const sidebarHsl = hexToHsl(palette.sidebar);

  // If dark mode, navbar and sidebar should also be dark.
  const isDarkTheme = bgHsl.l < 50;
  if (isDarkTheme) {
    if (navbarHsl.l > 40) {
      consistency -= 15;
      recommendations.push('Navbar is too bright for a dark theme layout.');
    }
    if (sidebarHsl.l > 40) {
      consistency -= 15;
      recommendations.push('Sidebar is too bright for a dark theme layout.');
    }
  } else {
    if (navbarHsl.l < 60) {
      consistency -= 15;
      recommendations.push('Navbar is too dark for a light theme layout.');
    }
    if (sidebarHsl.l < 60) {
      consistency -= 15;
      recommendations.push('Sidebar is too dark for a light theme layout.');
    }
  }

  consistency = Math.min(100, Math.max(40, consistency));

  // 8. Overall Score
  const overall = Math.round(
    (accessibility * 0.20) +
    (modernity * 0.15) +
    (premiumFeel * 0.15) +
    (trustScore * 0.10) +
    (harmony * 0.15) +
    (balance * 0.15) +
    (consistency * 0.10)
  );

  return {
    modernity,
    accessibility,
    premiumFeel,
    trustScore,
    harmony,
    balance,
    consistency,
    overall,
    recommendations
  };
}
