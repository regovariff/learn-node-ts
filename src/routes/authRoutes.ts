import { Router } from 'express';
import { register, login, profile, logout, updateProfile } from '../controllers/userController';
import { jwtGuard } from '../middleware/jwtGuard';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (can do it two ways)
router.use(jwtGuard);

router.get('/profile', profile);
router.put('/profile', upload.single('profile_picture'), updateProfile);
// router.get('/profile', jwtGuard, profile);
// router.get('/profile/:username', getUserProfile);
router.post('/logout', logout);

export default router;
