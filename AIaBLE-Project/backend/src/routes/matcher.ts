import { Router } from 'express';
import { matchTaskController, getDefaultWorkflowController } from '../controllers/matcher';

const router = Router();

// GET /api/task-matcher - return default workflow
router.get('/', getDefaultWorkflowController);

// POST /api/task-matcher - match subject and description to workflow steps
router.post('/', matchTaskController);

export default router;