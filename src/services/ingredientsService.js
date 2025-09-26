import { Ingredient } from '../db/models/index.js';

export const listOfIngredients = async () => {
  return await Ingredient.findAll();
};
