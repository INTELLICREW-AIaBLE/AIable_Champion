import express from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { errorHandler } from './middleware/errorHandler';
import { callGemini } from './services/gemini';
import recipeRoutes from './routes/recipeRoutes';
import matcherRoutes from './routes/matcher';
import optimizerRoutes from './routes/optimizer';
import sandboxRoutes from './routes/sandbox';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import validatorRoutes from './routes/validator';
import adminRoutes from './routes/admin';
import projectRoutes from './routes/projects';
import helpRoutes from './routes/help';
import { globalLimiter, strictLimiter, ipBlacklistMiddleware } from './middleware/rateLimiter';

// Load environment variables
dotenv.config();

import { connectDB } from './config/db';

// Connect to MongoDB
connectDB();

const app = express();

app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// Compression middleware - compress all responses
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6
}));

// ── Security Middlewares ──────────────────────────────────────────────────────
app.use(helmet());
app.use(mongoSanitize());

const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:3000'].filter(Boolean) as string[];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '1mb' })); // Reduce from 2mb to 1mb for tighter DoS protection
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// ── Global Rate Limiter + IP Blacklist ────────────────────────────────────────
// Block IPs that have been banned due to repeated rate limit violations
app.use('/api', ipBlacklistMiddleware);

// Global limiter: 100 requests / 15 min per IP for all routes
app.use('/api', globalLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────

// Recipe Library routes (public, general limit is enough)
app.use('/api/recipes', recipeRoutes);

// Task Matcher routes
app.use('/api/task-matcher', matcherRoutes);

// Prompt Optimizer routes (strict: 15 reqs/15 min — high CPU cost)
app.use('/api/optimizer', strictLimiter, optimizerRoutes);

// Auth routes (strict: 15 reqs/15 min — prevents registration flood attacks)
app.use('/api/auth', strictLimiter, authRoutes);

// Profile routes
app.use('/api/profile', profileRoutes);

// Sandbox routes (strict: 15 reqs/15 min — high CPU cost)
app.use('/api/sandbox', strictLimiter, sandboxRoutes);

// Validator routes (strict: 15 reqs/15 min — FACTSCORE pipeline is expensive)
app.use('/api/validator', strictLimiter, validatorRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Projects routes
app.use('/api/projects', projectRoutes);

// Help routes
app.use('/api/help', helpRoutes);

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AIaBLE Backend is running smoothly.' });
});

// Test route to verify Gemini API
app.get('/api/test-ai', async (req, res, next) => {
  try {
    console.log('[Test AI]: Sending request to Gemini API...');
    const geminiResult = await callGemini('Hello, say "Gemini is working!" in 3 words.');

    res.json({
      success: true,
      message: 'Connection to Gemini API was successful!',
      gemini: geminiResult.trim()
    });
  } catch (error: any) {
    console.error('[Test AI] Gemini Error:', error.message);
    next(error);
  }
});

// Global Error Handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`[server]: AIaBLE Backend Server is running at http://localhost:${PORT}`);
});
