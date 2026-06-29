import { Router } from 'express';
import { handleValidate } from '../controllers/validator';

const router = Router();

// POST /api/validator
router.post('/', handleValidate);

export default router;
