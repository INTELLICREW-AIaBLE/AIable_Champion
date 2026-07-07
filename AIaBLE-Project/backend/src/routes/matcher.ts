import { Router } from 'express';
import { matchTaskController, getDefaultWorkflowController, executeStepController } from '../controllers/matcher';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// GET /api/task-matcher - return default workflow
router.get('/', getDefaultWorkflowController);

// POST /api/task-matcher - match subject and description to workflow steps
router.post('/', matchTaskController);

// POST /api/task-matcher/execute-step - execute single workflow step (n8n node)
router.post('/execute-step', requireAuth, executeStepController);

export default router;