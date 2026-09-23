import { Router } from 'express';
import { IncidentController } from '../controllers/incident.controller.js';
import { validateBody, simulateIncidentSchema } from '../middleware/validate.middleware.js';

const router = Router();

router.get('/', IncidentController.getAllIncidents);
router.post('/simulate', validateBody(simulateIncidentSchema), IncidentController.simulateIncident);
router.post('/:id/resolve', IncidentController.resolveIncident);

export default router;
