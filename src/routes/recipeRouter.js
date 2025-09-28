import express from 'express';
import * as recipeController from '../controllers/recipeController.js';
import authenticate from '../middlewares/authenticate.js';
import validateBody from '../middlewares/validateBody.js';
import validateQuery from '../middlewares/validateQuery.js';
import uploadRecipeImage from '../middlewares/uploadRecipeImage.js';
import {
  createRecipeSchema,
  updateRecipeSchema,
  searchRecipesSchema,
  getPopularRecipesSchema,
} from '../schemas/recipeSchemas.js';

const router = express.Router();

// Public endpoints
router.get('', validateQuery(searchRecipesSchema), recipeController.searchRecipes);
router.get('/popular', validateQuery(getPopularRecipesSchema), recipeController.getPopularRecipes);
router.get('/:id', recipeController.getRecipeById);

// Private endpoints (authentication is required)
router.post('', authenticate, uploadRecipeImage.single('image'), validateBody(createRecipeSchema), recipeController.createRecipe);
router.patch('/:id', authenticate, validateBody(updateRecipeSchema), recipeController.updateRecipe);
router.delete('/:id', authenticate, recipeController.deleteRecipe);
router.post('/:id/favorite', authenticate, recipeController.addToFavorites);
router.delete('/:id/favorite', authenticate, recipeController.removeFromFavorites);

export default router;
