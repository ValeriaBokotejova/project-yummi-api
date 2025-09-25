import { listOfCategories } from '../services/categoriesService.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await listOfCategories()
    return res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};
