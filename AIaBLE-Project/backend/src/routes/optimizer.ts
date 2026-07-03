import { Router } from 'express';
import { handleOptimizePrompt } from '../controllers/optimizer';
import { checkEthics } from '../middleware/ethicsGuardrail';

const router = Router();

// POST /api/optimizer
router.post('/', checkEthics, handleOptimizePrompt);

export default router;
