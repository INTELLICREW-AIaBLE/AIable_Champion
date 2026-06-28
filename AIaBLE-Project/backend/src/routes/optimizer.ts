import { Router } from 'express';
import { handleOptimizePrompt } from '../controllers/optimizer';

const router = Router();

// POST /api/optimizer
router.post('/', handleOptimizePrompt);

export default router;
