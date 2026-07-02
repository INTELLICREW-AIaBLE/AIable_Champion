import { Router } from 'express';
import { submitHelpRequest } from '../controllers/help';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Protect with requireAuth if you want only logged in users to submit
router.post('/', requireAuth, submitHelpRequest);

export default router;
