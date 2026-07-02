import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(__dirname, '../data/users.json');
const RECIPES_FILE = path.join(__dirname, '../data/recipes.json');

// ─── Helpers ──────────────────────────────────────────────────────────────────
const readUsers = (): any[] => {
  try {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch { return []; }
};

const readRecipes = (): any[] => {
  try {
    return JSON.parse(fs.readFileSync(RECIPES_FILE, 'utf-8'));
  } catch { return []; }
};

const writeRecipes = (recipes: any[]) => {
  fs.writeFileSync(RECIPES_FILE, JSON.stringify(recipes, null, 2));
};

// Simple admin check — token must be mock-jwt-token-admin or first user
const isAdmin = (req: Request): boolean => {
  const token = req.headers.authorization?.split(' ')[1] || '';
  const userId = token.replace('mock-jwt-token-', '');
  const users = readUsers();
  if (users.length === 0) return false;
  // First registered user is admin, OR user with role=admin
  const user = users.find(u => u.id === userId);
  if (!user) return false;
  return user.role === 'admin' || user.id === users[0].id;
};

// ─── Dashboard Stats ──────────────────────────────────────────────────────────
export const getDashboardStats = (req: Request, res: Response) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Forbidden' });

  const users = readUsers();
  const recipes = readRecipes();

  // Aggregate all history across users
  const allHistory: any[] = [];
  users.forEach(u => {
    if (Array.isArray(u.history)) {
      u.history.forEach((h: any) => allHistory.push({ ...h, userId: u.id, userName: u.fullName }));
    }
  });

  // Total API calls by tool
  const toolCount: Record<string, number> = {};
  const subjectCount: Record<string, number> = {};
  const modelCount: Record<string, number> = {};
  const dailyCount: Record<string, number> = {};
  let validatorCount = 0;
  let optimizerCount = 0;
  let sandboxCount = 0;
  let taskMatcherCount = 0;
  let recipeCount = 0;

  allHistory.forEach(h => {
    // Tool counts
    const tool = h.tool || 'Unknown';
    toolCount[tool] = (toolCount[tool] || 0) + 1;

    // Subject counts (from task matcher)
    if (h.tool === 'Task Matcher' && h.detail) {
      const subjectMatch = h.detail.match(/subject[:\s]+([^,\n]+)/i);
      if (subjectMatch) {
        const sub = subjectMatch[1].trim();
        subjectCount[sub] = (subjectCount[sub] || 0) + 1;
      }
    }

    // Model counts
    const model = h.model || 'Unknown';
    modelCount[model] = (modelCount[model] || 0) + 1;

    // Daily counts
    if (h.time) {
      const day = h.time.slice(0, 10);
      dailyCount[day] = (dailyCount[day] || 0) + 1;
    }

    // Specific feature counts
    const toolLower = tool.toLowerCase();
    if (toolLower.includes('validator') || toolLower.includes('verify')) validatorCount++;
    else if (toolLower.includes('optimizer') || toolLower.includes('prompt')) optimizerCount++;
    else if (toolLower.includes('sandbox')) sandboxCount++;
    else if (toolLower.includes('task') || toolLower.includes('matcher')) taskMatcherCount++;
    else if (toolLower.includes('recipe')) recipeCount++;
  });

  // Build daily chart data (last 14 days)
  const today = new Date();
  const dailyChart = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (13 - i));
    const key = d.toISOString().slice(0, 10);
    return { date: key, count: dailyCount[key] || 0 };
  });

  // Saved recipes count
  const totalSavedRecipes = users.reduce((acc, u) => acc + (u.savedRecipes?.length || 0), 0);

  res.json({
    success: true,
    data: {
      overview: {
        totalUsers: users.length,
        totalRecipes: recipes.length,
        totalApiCalls: allHistory.length,
        totalSavedRecipes,
        validatorCount,
        optimizerCount,
        sandboxCount,
        taskMatcherCount,
        recipeCount,
      },
      charts: {
        daily: dailyChart,
        byTool: Object.entries(toolCount).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10),
        byModel: Object.entries(modelCount).map(([name, value]) => ({ name, value })),
        topSubjects: Object.entries(subjectCount).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 8),
      },
    },
  });
};

// ─── User Management ──────────────────────────────────────────────────────────
export const getAllUsers = (req: Request, res: Response) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Forbidden' });

  const users = readUsers();
  const sanitized = users.map(u => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    username: u.username || '',
    role: u.role || 'user',
    bio: u.bio || '',
    location: u.location || '',
    createdAt: u.createdAt || null,
    historyCount: u.history?.length || 0,
    savedRecipesCount: u.savedRecipes?.length || 0,
    isGoogleUser: u.password === 'google-oauth-dummy-password',
  }));

  res.json({ success: true, data: sanitized });
};

export const getUserDetail = (req: Request, res: Response) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Forbidden' });

  const users = readUsers();
  const user = users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const { password, resetToken, resetTokenExpiry, ...safe } = user;
  res.json({ success: true, data: safe });
};

export const updateUserRole = (req: Request, res: Response) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Forbidden' });

  const users = readUsers();
  const idx = users.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'User not found' });

  users[idx].role = req.body.role || 'user';
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.json({ success: true, message: 'Role updated' });
};

export const deleteUser = (req: Request, res: Response) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Forbidden' });

  const users = readUsers();
  const filtered = users.filter(u => u.id !== req.params.id);
  if (filtered.length === users.length) return res.status(404).json({ success: false, message: 'User not found' });

  fs.writeFileSync(USERS_FILE, JSON.stringify(filtered, null, 2));
  res.json({ success: true, message: 'User deleted' });
};

// ─── Activity Log (all users) ─────────────────────────────────────────────────
export const getActivityLog = (req: Request, res: Response) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Forbidden' });

  const users = readUsers();
  const allHistory: any[] = [];
  users.forEach(u => {
    if (Array.isArray(u.history)) {
      u.history.forEach((h: any) => allHistory.push({ ...h, userId: u.id, userName: u.fullName, userEmail: u.email }));
    }
  });

  // Sort by time desc
  allHistory.sort((a, b) => new Date(b.time || 0).getTime() - new Date(a.time || 0).getTime());

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const tool = req.query.tool as string;

  const filtered = tool ? allHistory.filter(h => h.tool?.toLowerCase().includes(tool.toLowerCase())) : allHistory;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  res.json({
    success: true,
    data: paginated,
    total: filtered.length,
    page,
    totalPages: Math.ceil(filtered.length / limit),
  });
};

// ─── Recipe Management (Admin CRUD) ───────────────────────────────────────────
export const adminGetRecipes = (req: Request, res: Response) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Forbidden' });

  const recipes = readRecipes();
  const { category, search } = req.query;

  let filtered = recipes;
  if (category && category !== 'All') {
    filtered = filtered.filter(r => r.category?.toLowerCase() === (category as string).toLowerCase());
  }
  if (search) {
    const q = (search as string).toLowerCase();
    filtered = filtered.filter(r => r.title?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q));
  }

  res.json({ success: true, data: filtered, total: filtered.length });
};

export const adminCreateRecipe = (req: Request, res: Response) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Forbidden' });

  const recipes = readRecipes();
  const newRecipe = {
    ...req.body,
    id: req.body.id || `${req.body.category?.toLowerCase() || 'custom'}-${Date.now()}`,
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
    author: 'Admin',
    version: '1.0',
    language: 'vi',
  };

  if (!newRecipe.title || !newRecipe.category || !newRecipe.prompt) {
    return res.status(400).json({ success: false, message: 'title, category, và prompt là bắt buộc.' });
  }

  recipes.push(newRecipe);
  writeRecipes(recipes);
  res.status(201).json({ success: true, data: newRecipe });
};

export const adminUpdateRecipe = (req: Request, res: Response) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Forbidden' });

  const recipes = readRecipes();
  const idx = recipes.findIndex(r => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Recipe not found' });

  recipes[idx] = { ...recipes[idx], ...req.body, updatedAt: new Date().toISOString().slice(0, 10) };
  writeRecipes(recipes);
  res.json({ success: true, data: recipes[idx] });
};

export const adminDeleteRecipe = (req: Request, res: Response) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Forbidden' });

  const recipes = readRecipes();
  const filtered = recipes.filter(r => r.id !== req.params.id);
  if (filtered.length === recipes.length) return res.status(404).json({ success: false, message: 'Recipe not found' });

  writeRecipes(filtered);
  res.json({ success: true, message: 'Recipe deleted' });
};

// ─── System Health ────────────────────────────────────────────────────────────
export const getSystemHealth = (req: Request, res: Response) => {
  if (!isAdmin(req)) return res.status(403).json({ success: false, message: 'Forbidden' });

  const uptimeSeconds = process.uptime();
  const uptimeHours = Math.floor(uptimeSeconds / 3600);
  const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);

  const memUsage = process.memoryUsage();
  const users = readUsers();
  const recipes = readRecipes();

  res.json({
    success: true,
    data: {
      status: 'ok',
      uptime: `${uptimeHours}h ${uptimeMinutes}m`,
      uptimeSeconds,
      memory: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024),
      },
      dataFiles: {
        users: users.length,
        recipes: recipes.length,
      },
      env: {
        hasGeminiKey: !!process.env.GEMINI_API_KEY,
        hasGoogleSearch: !!process.env.GOOGLE_SEARCH_API_KEY,
        hasSmtp: !!process.env.SMTP_EMAIL,
        nodeVersion: process.version,
      },
      timestamp: new Date().toISOString(),
    },
  });
};
