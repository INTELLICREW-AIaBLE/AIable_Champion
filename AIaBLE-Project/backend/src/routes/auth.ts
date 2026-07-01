import { Router } from 'express';
import { register, login, googleLogin, verifyBot, forgotPassword } from '../controllers/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/verify-bot', verifyBot);
router.post('/forgot-password', forgotPassword);

export default router;
