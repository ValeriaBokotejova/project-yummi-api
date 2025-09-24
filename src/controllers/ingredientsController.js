import { getIngredientByName, listOfIngredients } from '../services/ingredientsService.js';


export const getAllIngredients = async (req, res, next) => {
  try {
    const ingredients = await listOfIngredients()
    return res.status(201).json(ingredients);
  } catch (error) {
    next(error);
  }
};

export const getOneAreaByName = async (req, res, next) => {
  try {
    const ingredient = await getIngredientByName()
    return res.status(201).json(ingredient);
  } catch (error) {
    next(error);
  }
};