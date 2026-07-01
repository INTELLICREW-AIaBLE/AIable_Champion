import { Router } from 'express';
import { getProfile, updateProfile, getHistory, addHistory, getSavedRecipes, toggleSavedRecipe } from '../controllers/profile';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Apply auth middleware to all profile routes
router.use(requireAuth);

router.get('/', getProfile);
router.put('/', updateProfile);

router.get('/history', getHistory);
router.post('/history', addHistory);

router.get('/recipes/saved', getSavedRecipes);
router.post('/recipes/saved', toggleSavedRecipe);

export default router;
