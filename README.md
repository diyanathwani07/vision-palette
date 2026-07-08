# Vision Palette | AI Theme Visualizer & Color Generator

Vision Palette is a premium SaaS web application designed for developers and designers to instantly visualize custom and AI-generated color themes on interactive dashboards or uploaded screenshots.

## Tech Stack
* **Frontend**: React, Vite, TypeScript, Tailwind CSS, Framer Motion, Recharts
* **Backend**: Node.js, Express
* **Database**: MongoDB (with local JSON fallback)

## Getting Started

### Prerequisites
* [Node.js](https://nodejs.org) (v18 or higher recommended)

### Installation
From the root directory:
```bash
npm run install:all
```

### Running Locally
To start both the client and server concurrently:
```bash
npm run dev
```
* **Frontend client**: http://localhost:5173
* **Backend server**: http://localhost:5000

## Features
1. **Interactive Sandbox Dashboard**: Live preview dashboard containing navigation, stat cards, charts, alerts, inputs, and tables styled with your palette.
2. **Screenshot Colorizer**: Drag-and-drop screenshots and recolor image elements in real time.
3. **Advanced Color Picker**: Color Wheel, HSL/RGB/HEX adjusters, and color harmonies generator.
4. **AI Theme Prompting**: Prompts like *"Make it look premium like Stripe"* are compiled locally and styled instantly.
5. **WCAG Contrast Checker**: Calculates AA/AAA legibility targets with auto-fix recommendations.
6. **Multi-Format Tokens Exporter**: Export as Tailwind, CSS variables, Material UI, Chakra, SCSS, JSON, or Figma tokens.
7. **Saved Projects**: Log in and save themes to local storage and sync with the database.
