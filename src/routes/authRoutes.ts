import { Router } from 'express';
import { register, login, profile, logout, updateProfile } from '../controllers/userController';
import { jwtGuard } from '../middleware/jwtGuard';
import { upload } from '../middleware/uploadMiddleware';
import { deleteStatus, getStatuses, postStatus } from '../controllers/statusController';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/status', getStatuses);

// Protected routes (can do it two ways)
router.use(jwtGuard);

router.get('/profile', profile);
router.put('/profile', upload.single('profile_picture'), updateProfile);
// router.get('/profile', jwtGuard, profile);
// router.get('/profile/:username', getUserProfile);
router.post('/status', postStatus);
router.delete('/status/:statusId', deleteStatus);
router.post('/logout', logout);

export default router;
