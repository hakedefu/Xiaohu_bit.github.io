import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as workLogController from '../controllers/work-log.controller';

const router = Router();

/**
 * 所有工作日志路由都需要认证
 */
router.use(authMiddleware);

router.post('/', workLogController.createWorkLog);
router.get('/stats', workLogController.getWorkLogStats);
router.get('/date-range', workLogController.getWorkLogsInDateRange);
router.get('/project/:projectId', workLogController.getProjectWorkLogs);
router.get('/user/:userId', workLogController.getUserWorkLogs);
router.get('/:id', workLogController.getWorkLog);
router.put('/:id', workLogController.updateWorkLog);
router.delete('/:id', workLogController.deleteWorkLog);

export default router;
