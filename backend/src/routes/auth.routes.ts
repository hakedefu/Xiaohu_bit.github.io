import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as authController from '../controllers/auth.controller';

const router = Router();

/**
 * 公开路由
 */
router.post('/register', authController.register);
router.post('/login', authController.login);

/**
 * 受保护的路由
 */
router.get('/me', authMiddleware, authController.getCurrentUser);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/change-password', authMiddleware, authController.changePassword);

export default router;
