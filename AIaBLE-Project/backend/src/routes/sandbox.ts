import { Router } from 'express';
import { runSandboxModel } from '../controllers/sandbox';

const router = Router();

router.post('/', runSandboxModel);

export default router;
