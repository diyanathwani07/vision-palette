import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'vision_palette_secret_key_123';

app.use(cors());
app.use(express.json());

// Setup local JSON DB fallbacks
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');

// Helper to read/write local files
const readLocalFile = (filepath, defaultValue = []) => {
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch (e) {
    return defaultValue;
  }
};

const writeLocalFile = (filepath, data) => {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
};

// Try connecting to MongoDB (falls back gracefully to JSON DB)
let isMongoConnected = false;
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('MongoDB connected successfully');
      isMongoConnected = true;
    })
    .catch((err) => {
      console.log('MongoDB connection error, falling back to local JSON database:');
    });
} else {
  console.log('No MONGODB_URI environment variable detected; using local JSON database');
}

// ----------------- AUTHENTICATION ROUTES -----------------
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const users = readLocalFile(USERS_FILE);
  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeLocalFile(USERS_FILE, users);

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { name, email } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const users = readLocalFile(USERS_FILE);
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { name: user.name, email: user.email } });
});

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is invalid or expired' });
    req.user = user;
    next();
  });
};

// ----------------- PROJECTS ROUTES -----------------
app.get('/api/projects', authenticateToken, (req, res) => {
  const allProjects = readLocalFile(PROJECTS_FILE);
  const userProjects = allProjects.filter(p => p.userId === req.user.id);
  res.json(userProjects);
});

app.post('/api/projects', authenticateToken, (req, res) => {
  const { name, url, palette } = req.body;
  if (!name || !palette) {
    return res.status(400).json({ message: 'Project name and palette are required' });
  }

  const allProjects = readLocalFile(PROJECTS_FILE);
  const newProject = {
    id: Date.now().toString(),
    userId: req.user.id,
    name,
    url,
    palette,
    createdAt: new Date().toISOString()
  };

  allProjects.push(newProject);
  writeLocalFile(PROJECTS_FILE, allProjects);
  res.status(201).json(newProject);
});

app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  const allProjects = readLocalFile(PROJECTS_FILE);
  const index = allProjects.findIndex(p => p.id === req.params.id && p.userId === req.user.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Project not found' });
  }

  allProjects.splice(index, 1);
  writeLocalFile(PROJECTS_FILE, allProjects);
  res.json({ message: 'Project deleted successfully' });
});

// ----------------- AI PALETTE GENERATOR -----------------
// Endpoint that client can communicate with, simulating an LLM completion loop
app.post('/api/ai/generate', (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: 'Prompt query description is required' });
  }

  // AI palette templates dictionary
  const templates = {
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
    }
  };

  const p = prompt.toLowerCase();
  let selected = templates.premium;

  if (p.includes('stripe') || p.includes('fintech') || p.includes('indigo')) {
    selected = templates.stripe;
  } else if (p.includes('apple') || p.includes('minimal')) {
    selected = templates.apple;
  }

  res.json({
    palette: {
      name: `AI Server: ${prompt.slice(0, 15)}...`,
      ...selected
    }
  });
});

app.listen(PORT, () => {
  console.log(`Vision Palette backend running on port ${PORT}`);
});
