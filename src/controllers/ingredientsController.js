import * as ingService from '../services/ingredientsService.js';

export const getAllIngredients = async (req, res, next) => {
  try {
    const ingredients = await ingService.getAllIngredients();
    return res.status(200).json(ingredients);
  } catch (error) {
    next(error);
  }
};
