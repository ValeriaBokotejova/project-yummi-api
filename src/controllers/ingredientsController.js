import { listOfIngredients } from '../services/ingredientsService.js';


export const getAllIngredients = async (req, res, next) => {
  try {
    const ingredients = await listOfIngredients()
    return res.status(201).json(ingredients);
  } catch (error) {
    next(error);
  }
};
