import express from 'express';
import * as recipeController from '../controllers/recipeController.js';
import authenticate from '../middlewares/authenticate.js';
import validateBody from '../middlewares/validateBody.js';
import {
  createRecipeSchema,
  updateRecipeSchema,
  searchRecipesSchema,
  getPopularRecipesSchema,
} from '../schemas/recipeSchemas.js';

const router = express.Router();

// Public endpoints
router.get('/', validateBody(searchRecipesSchema), recipeController.searchRecipes);
router.get('/popular', validateBody(getPopularRecipesSchema), recipeController.getPopularRecipes);
router.get('/:id', recipeController.getRecipeById);

// Private endpoints (authentication is required)
router.use(authenticate);

router.post('/', validateBody(createRecipeSchema), recipeController.createRecipe);
router.patch('/:id', validateBody(updateRecipeSchema), recipeController.updateRecipe);
router.delete('/:id', recipeController.deleteRecipe);
router.post('/:id/favorite', recipeController.addToFavorites);
router.delete('/:id/favorite', recipeController.removeFromFavorites);

export default router;