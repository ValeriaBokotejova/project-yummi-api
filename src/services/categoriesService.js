import { Category } from '../db/models/index.js';

export const listOfCategories = () =>Category.findAll();

export const getCategoryByName = (categoryName) => Category.findOne({ where: {name: categoryName }});