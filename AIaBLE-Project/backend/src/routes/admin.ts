import { Router } from 'express';
import {
  getDashboardStats,
  getAllUsers, getUserDetail, updateUserRole, deleteUser,
  getActivityLog,
  adminGetRecipes, adminCreateRecipe, adminUpdateRecipe, adminDeleteRecipe,
  getSystemHealth,
} from '../controllers/admin';

const router = Router();

// Dashboard
router.get('/stats', getDashboardStats);
router.get('/health', getSystemHealth);

// Users
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetail);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Activity log
router.get('/activity', getActivityLog);

// Recipes (admin CRUD)
router.get('/recipes', adminGetRecipes);
router.post('/recipes', adminCreateRecipe);
router.put('/recipes/:id', adminUpdateRecipe);
router.delete('/recipes/:id', adminDeleteRecipe);

export default router;
