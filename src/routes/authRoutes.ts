import { Router } from 'express';
import { register, login, profile, logout, getUserProfile } from '../controllers/userController';
import { jwtGuard } from '../middleware/jwtGuard';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', jwtGuard, profile);
router.get('/profile/:username', jwtGuard, getUserProfile);
router.post('/logout', jwtGuard, logout);

export default router;
