import { Router } from 'express';
import { handleLogin } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import { loginSchema } from '../schemas';

const authRouter = Router();

authRouter.post('/auth/login', validateRequest(loginSchema), handleLogin);

export { authRouter };
