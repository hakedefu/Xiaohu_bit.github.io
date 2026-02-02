import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as projectController from '../controllers/project.controller';

const router = Router();

/**
 * 所有项目路由都需要认证
 */
router.use(authMiddleware);

router.post('/', projectController.createProject);
router.get('/stats', projectController.getProjectStats);
router.get('/search', projectController.searchProjects);
router.get('/quadrant', projectController.getQuadrantProjects);
router.get('/:id', projectController.getProject);
router.put('/:id', projectController.updateProject);
router.patch('/:id/status', projectController.updateProjectStatus);
router.patch('/:id/quadrant', projectController.updateProjectQuadrant);

export default router;
