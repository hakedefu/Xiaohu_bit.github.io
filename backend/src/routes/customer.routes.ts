import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as customerController from '../controllers/customer.controller';

const router = Router();

/**
 * 所有客户路由都需要认证
 */
router.use(authMiddleware);

router.post('/', customerController.createCustomer);
router.get('/stats', customerController.getCustomerStats);
router.get('/search', customerController.searchCustomers);
router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export default router;
