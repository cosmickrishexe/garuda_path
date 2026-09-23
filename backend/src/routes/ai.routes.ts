import { Router } from 'express';
import { AiController } from '../controllers/ai.controller.js';
import { validateBody, copilotChatSchema } from '../middleware/validate.middleware.js';

const router = Router();

router.post('/copilot-chat', validateBody(copilotChatSchema), AiController.copilotChat);
router.post('/verify-epod', AiController.verifyEpod);

export default router;
