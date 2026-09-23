import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateBody, registerUserSchema, loginUserSchema } from '../middleware/validate.middleware.js';
import { authenticateJwt } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', validateBody(registerUserSchema), AuthController.register);
router.post('/login', validateBody(loginUserSchema), AuthController.login);
router.get('/me', authenticateJwt, AuthController.getCurrentUser);

export default router;
