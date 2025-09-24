import { Category } from '../db/models/index.js';

export const listOfCategories = () =>Category.findAll();

