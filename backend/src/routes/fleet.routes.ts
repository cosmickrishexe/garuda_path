import { Router } from 'express';
import { FleetController } from '../controllers/fleet.controller.js';

const router = Router();

router.get('/', FleetController.getAllVehicles);
router.get('/:id', FleetController.getVehicleById);
router.patch('/:id/telemetry', FleetController.updateTelemetry);

export default router;
