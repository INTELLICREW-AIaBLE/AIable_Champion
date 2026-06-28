import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { callGemini } from './services/gemini';
import recipeRoutes from './routes/recipeRoutes';
import matcherRoutes from './routes/matcher';
import optimizerRoutes from './routes/optimizer';
import sandboxRoutes from './routes/sandbox';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*', // For development, allow all. Change to specific frontend domain in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Recipe Library routes
app.use('/api/recipes', recipeRoutes);

// Task Matcher routes
app.use('/api/task-matcher', matcherRoutes);

// Prompt Optimizer routes
app.use('/api/optimizer', optimizerRoutes);

// Auth routes
app.use('/api/auth', authRoutes);

// Profile routes
app.use('/api/profile', profileRoutes);

// Sandbox routes
app.use('/api/sandbox', sandboxRoutes);

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
