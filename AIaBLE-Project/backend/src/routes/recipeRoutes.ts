import { Router } from 'express';
import { getRecipes, getRecipeById } from '../controllers/recipeController';

const router = Router();

// GET /api/recipes - get all recipes, support filter by category & difficulty
router.get('/', getRecipes);

// GET /api/recipes/:id - get single recipe by id
router.get('/:id', getRecipeById);

export default router;