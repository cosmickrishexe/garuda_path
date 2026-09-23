import { Router } from 'express';
import { OptimizeController } from '../controllers/optimize.controller.js';

const router = Router();

router.post('/', OptimizeController.optimizeRoutes);
router.get('/plans', OptimizeController.getActiveRoutePlans);

export default router;
