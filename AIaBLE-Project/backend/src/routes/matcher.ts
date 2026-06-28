import { Router } from 'express';
import { matchTaskController, getDefaultWorkflowController, getSubjects } from '../controllers/matcher';

const router = Router();

// GET /api/task-matcher - return default workflow
router.get('/', getDefaultWorkflowController);

// GET /api/task-matcher/subjects - get all available subjects
router.get('/subjects', getSubjects);

// POST /api/task-matcher - match subject and description to workflow steps
router.post('/', matchTaskController);

export default router;