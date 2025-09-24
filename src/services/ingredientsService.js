import { Ingredient } from '../db/models/index.js';

export const listOfIngredients = () =>Ingredient.findAll();

export const getIngredientByName = (ingredientName) => Ingredient.findOne({ where: {name: ingredientName }});