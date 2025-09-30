import * as recipeService from '../services/recipeService.js';
import HttpError from '../utils/HttpError.js';

// Public endpoints

export const searchRecipes = async (req, res, next) => {
  try {
    const { category, ingredient, area, page, limit, sortBy, sortDir } = req.query;
    const filters = { category, ingredient, area, sortBy, sortDir };
    const pagination = { page, limit };

    const result = await recipeService.searchRecipes(filters, pagination);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await recipeService.getRecipeById(id);

    res.status(200).json(recipe);
  } catch (error) {
    next(error);
  }
};

export const getPopularRecipes = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pagination = { page, limit };

    const result = await recipeService.getPopularRecipes(pagination);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Private endpoints

export const createRecipe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const recipeData = req.body;
    const file = req.file; // Multer adds file to req.file
    if (!file) {
      return next(HttpError(400, 'Image file is required'));
    }

    const recipe = await recipeService.createRecipe(recipeData, file, userId);

    res.status(201).json(recipe);
  } catch (error) {
    next(error);
  }
};

export const updateRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const recipeData = req.body;
    const file = req.file; // Multer adds file to req.file (optional for updates)

    const recipe = await recipeService.updateRecipe(id, recipeData, file, userId);

    res.status(200).json(recipe);
  } catch (error) {
    next(error);
  }
};

export const deleteRecipe = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await recipeService.deleteRecipe(id, userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const addToFavorites = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await recipeService.addToFavorites(id, userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const removeFromFavorites = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await recipeService.removeFromFavorites(id, userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
