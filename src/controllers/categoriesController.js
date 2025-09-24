import { getCategoryByName, listOfCategories } from '../services/categoriesService.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await listOfCategories()
    return res.status(201).json(categories);
  } catch (error) {
    next(error);
  }
};

export const getOneCategoryByName = async (req, res, next) => {
  try {
    const categories = await getCategoryByName()
    return res.status(201).json(categories);
  } catch (error) {
    next(error);
  }
};