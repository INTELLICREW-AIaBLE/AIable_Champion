import { Router } from 'express';
import { handleValidate, getHistory, resolveClaim } from '../controllers/validator';

const router = Router();

// POST /api/validator/analyze
router.post('/analyze', handleValidate);

// GET /api/validator/history
router.get('/history', getHistory);

// PATCH /api/validator/claims/:claimId/resolve
router.patch('/claims/:claimId/resolve', resolveClaim);

// Keep fallback endpoint mapping for backward compatibility if any old client code uses it
router.post('/', handleValidate);

export default router;
