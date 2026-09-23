import { Router } from 'express';
import { OrdersController } from '../controllers/orders.controller.js';
import { validateBody, createOrderSchema, updateOrderStatusSchema } from '../middleware/validate.middleware.js';

const router = Router();

router.get('/', OrdersController.getAllOrders);
router.post('/', validateBody(createOrderSchema), OrdersController.createOrder);
router.patch('/:id/status', validateBody(updateOrderStatusSchema), OrdersController.updateStatus);
router.get('/public/tracking/:code', OrdersController.getPublicTracking);

export default router;
