import { Category } from '../db/models/index.js';

export const listOfCategories = async () => {
  return await Category.findAll();
};

