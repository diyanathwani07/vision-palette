import { ColorPalette } from './colorUtils';

export function exportCssVariables(palette: ColorPalette): string {
  return `:root {
  --primary: ${palette.primary};
  --secondary: ${palette.secondary};
  --accent: ${palette.accent};
  --bg-main: ${palette.bgMain};
  --bg-surface: ${palette.bgSurface};
  --navbar: ${palette.navbar};
  --sidebar: ${palette.sidebar};
  --buttons: ${palette.buttons};
  --text-primary: ${palette.textPrimary};
  --text-secondary: ${palette.textSecondary};
  --borders: ${palette.borders};
  --success: ${palette.success};
  --warning: ${palette.warning};
  --error: ${palette.error};
}`;
}

export function exportTailwindConfig(palette: ColorPalette): string {
  return `module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '${palette.primary}',
          foreground: '${palette.textPrimary}',
        },
        secondary: {
          DEFAULT: '${palette.secondary}',
          foreground: '${palette.textSecondary}',
        },
        accent: '${palette.accent}',
        background: '${palette.bgMain}',
        surface: '${palette.bgSurface}',
        navbar: '${palette.navbar}',
        sidebar: '${palette.sidebar}',
        button: '${palette.buttons}',
        text: {
          primary: '${palette.textPrimary}',
          secondary: '${palette.textSecondary}',
        },
        border: '${palette.borders}',
        success: '${palette.success}',
        warning: '${palette.warning}',
        error: '${palette.error}',
      }
    }
  }
}`;
}

export function exportMaterialUI(palette: ColorPalette): string {
  return `import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '${palette.primary}',
    },
    secondary: {
      main: '${palette.secondary}',
    },
    error: {
      main: '${palette.error}',
    },
    warning: {
      main: '${palette.warning}',
    },
    success: {
      main: '${palette.success}',
    },
    background: {
      default: '${palette.bgMain}',
      paper: '${palette.bgSurface}',
    },
    text: {
      primary: '${palette.textPrimary}',
      secondary: '${palette.textSecondary}',
    },
  },
});

export default theme;`;
}

export function exportChakraUI(palette: ColorPalette): string {
  return `import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    primary: '${palette.primary}',
    secondary: '${palette.secondary}',
    accent: '${palette.accent}',
    bgMain: '${palette.bgMain}',
    bgSurface: '${palette.bgSurface}',
    navbar: '${palette.navbar}',
    sidebar: '${palette.sidebar}',
    button: '${palette.buttons}',
    textPrimary: '${palette.textPrimary}',
    textSecondary: '${palette.textSecondary}',
    border: '${palette.borders}',
    success: '${palette.success}',
    warning: '${palette.warning}',
    error: '${palette.error}',
  },
};

const theme = extendTheme({ colors });
export default theme;`;
}

export function exportBootstrapVariables(palette: ColorPalette): string {
  return `$primary: ${palette.primary};
$secondary: ${palette.secondary};
$success: ${palette.success};
$info: ${palette.accent};
$warning: ${palette.warning};
$danger: ${palette.error};
$light: ${palette.bgSurface};
$dark: ${palette.bgMain};
$body-bg: ${palette.bgMain};
$body-color: ${palette.textPrimary};
$border-color: ${palette.borders};`;
}

export function exportScssVariables(palette: ColorPalette): string {
  return `$color-primary: ${palette.primary};
$color-secondary: ${palette.secondary};
$color-accent: ${palette.accent};
$color-bg-main: ${palette.bgMain};
$color-bg-surface: ${palette.bgSurface};
$color-navbar: ${palette.navbar};
$color-sidebar: ${palette.sidebar};
$color-buttons: ${palette.buttons};
$color-text-primary: ${palette.textPrimary};
$color-text-secondary: ${palette.textSecondary};
$color-borders: ${palette.borders};
$color-success: ${palette.success};
$color-warning: ${palette.warning};
$color-error: ${palette.error};`;
}

export function exportJsonTokens(palette: ColorPalette): string {
  return JSON.stringify({
    global: {
      primary: { value: palette.primary, type: 'color' },
      secondary: { value: palette.secondary, type: 'color' },
      accent: { value: palette.accent, type: 'color' },
      bgMain: { value: palette.bgMain, type: 'color' },
      bgSurface: { value: palette.bgSurface, type: 'color' },
      navbar: { value: palette.navbar, type: 'color' },
      sidebar: { value: palette.sidebar, type: 'color' },
      buttons: { value: palette.buttons, type: 'color' },
      textPrimary: { value: palette.textPrimary, type: 'color' },
      textSecondary: { value: palette.textSecondary, type: 'color' },
      borders: { value: palette.borders, type: 'color' },
      success: { value: palette.success, type: 'color' },
      warning: { value: palette.warning, type: 'color' },
      error: { value: palette.error, type: 'color' },
    }
  }, null, 2);
}

export function exportFigmaTokens(palette: ColorPalette): string {
  return JSON.stringify({
    name: palette.name,
    version: '1.0.0',
    tokens: [
      { name: 'Colors/Primary', value: palette.primary, type: 'color' },
      { name: 'Colors/Secondary', value: palette.secondary, type: 'color' },
      { name: 'Colors/Accent', value: palette.accent, type: 'color' },
      { name: 'Colors/Background', value: palette.bgMain, type: 'color' },
      { name: 'Colors/Surface', value: palette.bgSurface, type: 'color' },
      { name: 'Colors/Navbar', value: palette.navbar, type: 'color' },
      { name: 'Colors/Sidebar', value: palette.sidebar, type: 'color' },
      { name: 'Colors/Button', value: palette.buttons, type: 'color' },
      { name: 'Colors/TextPrimary', value: palette.textPrimary, type: 'color' },
      { name: 'Colors/TextSecondary', value: palette.textSecondary, type: 'color' },
      { name: 'Colors/Border', value: palette.borders, type: 'color' },
      { name: 'Colors/Success', value: palette.success, type: 'color' },
      { name: 'Colors/Warning', value: palette.warning, type: 'color' },
      { name: 'Colors/Error', value: palette.error, type: 'color' },
    ]
  }, null, 2);
}
