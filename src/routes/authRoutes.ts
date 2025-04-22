import { Router } from 'express';
import { register, login, profile, logout, updateProfile } from '../controllers/userController';
import { jwtGuard } from '../middleware/jwtGuard';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (can do it two ways)
router.use(jwtGuard);

router.get('/profile', profile);
router.put('/profile', updateProfile);
// router.get('/profile', jwtGuard, profile);
// router.get('/profile/:username', getUserProfile);
router.post('/logout', logout);

export default router;
