import express from 'express';
import * as authController from '../controllers/authController.js';
import validateBody from '../middlewares/validateBody.js';
import authenticate from '../middlewares/authenticate.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), authController.register);

authRouter.post('/login', validateBody(loginSchema), authController.login);

authRouter.post('/logout', authenticate, authController.logout);

export default authRouter;
