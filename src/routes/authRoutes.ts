import { Router } from 'express';
import { register, login, profile, logout } from '../controllers/userController';
import { jwtGuard } from '../middleware/jwtGuard';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', jwtGuard, profile);
router.post('/logout', jwtGuard, logout);

export default router;
