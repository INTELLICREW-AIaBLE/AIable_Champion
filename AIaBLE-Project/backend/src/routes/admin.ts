import { Router } from 'express';
import {
  getDashboardStats,
  getAllUsers, getUserDetail, updateUserRole, toggleUserLock, deleteUser,
  getActivityLog,
  adminGetRecipes, adminCreateRecipe, adminUpdateRecipe, adminDeleteRecipe,
  getSystemHealth,
} from '../controllers/admin';

import { requireAdmin } from '../middleware/adminMiddleware';

const router = Router();

// Áp dụng middleware bảo mật cho toàn bộ route admin
router.use(requireAdmin);

// Dashboard
router.get('/stats', getDashboardStats);
router.get('/health', getSystemHealth);

// Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetail);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/lock', toggleUserLock);
router.delete('/users/:id', deleteUser);

// Activity log
router.get('/activity', getActivityLog);

// Recipes (admin CRUD)
router.get('/recipes', adminGetRecipes);
router.post('/recipes', adminCreateRecipe);
router.put('/recipes/:id', adminUpdateRecipe);
router.delete('/recipes/:id', adminDeleteRecipe);

export default router;
