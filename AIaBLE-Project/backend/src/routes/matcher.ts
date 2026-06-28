import { Router } from 'express';
import { matchTaskController } from '../controllers/matcher';

const router = Router();

// POST /api/task-matcher - match subject and description to workflow steps
router.post('/', matchTaskController);

export default router;