import { Ingredient } from '../db/models/index.js';

export const listOfIngredients = () =>Ingredient.findAll();

