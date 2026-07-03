import { Router } from 'express';
import { runSandboxModel } from '../controllers/sandbox';
import { checkEthics } from '../middleware/ethicsGuardrail';

const router = Router();

router.post('/', checkEthics, runSandboxModel);

export default router;
