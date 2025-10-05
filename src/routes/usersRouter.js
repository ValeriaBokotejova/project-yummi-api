import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import {
  getCurrentUser,
  getUserById,
  uploadAvatar,
  getUserRecipes,
  getUserFavoriteRecipes,
} from '../controllers/usersController.js';
import upload from '../middlewares/uploadAvatar.js';
import validateQuery from '../middlewares/validateQuery.js';
import { listParamsSchema } from '../schemas/userRecipesSchemas.js';

const usersRouter = express.Router();

usersRouter.get('/me', authenticate, getCurrentUser);

usersRouter.patch('/avatar', authenticate, upload.single('avatar'), uploadAvatar);

usersRouter.get('/:id', authenticate, getUserById);

usersRouter.get('/:id/recipes', authenticate, validateQuery(listParamsSchema), getUserRecipes);

usersRouter.get('/:id/favorites', authenticate, validateQuery(listParamsSchema), getUserFavoriteRecipes);

export default usersRouter;
