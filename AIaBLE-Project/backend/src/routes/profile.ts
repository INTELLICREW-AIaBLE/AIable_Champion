import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Apply auth middleware to all profile routes
router.use(requireAuth);

router.get('/', getProfile);
router.put('/', updateProfile);

export default router;
