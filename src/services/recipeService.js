import { Op } from 'sequelize';
import HttpError from '../utils/HttpError.js';
import { Recipe, User, FavoriteRecipe } from '../models/index.js';

export const searchRecipes = async (filters, pagination) => {
  const { category, ingredient, area, page = 1, limit = 12, sort = 'createdAt' } = filters;
  const offset = (page - 1) * limit;

  const whereClause = {};

  if (category) {
    whereClause.category = category;
  }

  if (area) {
    whereClause.area = area;
  }

  if (ingredient) {
    whereClause.ingredients = {
      [Op.contains]: [{ id: ingredient }],
    };
  }

  const orderClause = [];
  if (sort === 'popularity') {
    orderClause.push(['popularity', 'DESC']);
  } else if (sort === 'title') {
    orderClause.push(['title', 'ASC']);
  } else {
    orderClause.push(['createdAt', 'DESC']);
  }

  const recipes = await Recipe.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: 'ownerUser',
        attributes: ['id', 'name', 'email'],
      },
    ],
    limit,
    offset,
    order: orderClause,
    distinct: true,
  });

  return {
    recipes: recipes.rows,
    totalCount: recipes.count,
    totalPages: Math.ceil(recipes.count / limit),
    currentPage: page,
    limit,
  };
};

export const getRecipeById = async (recipeId) => {
  const recipe = await Recipe.findByPk(recipeId, {
    include: [
      {
        model: User,
        as: 'ownerUser',
        attributes: ['id', 'name', 'email'],
      },
    ],
  });

  if (!recipe) {
    throw HttpError(404, 'Recipe not found');
  }

  return recipe;
};

export const getPopularRecipes = async (pagination) => {
  const { page = 1, limit = 12 } = pagination;
  const offset = (page - 1) * limit;

  const recipes = await Recipe.findAndCountAll({
    include: [
      {
        model: User,
        as: 'ownerUser',
        attributes: ['id', 'name', 'email'],
      },
    ],
    order: [['popularity', 'DESC'], ['createdAt', 'DESC']],
    limit,
    offset,
  });

  return {
    recipes: recipes.rows,
    totalCount: recipes.count,
    totalPages: Math.ceil(recipes.count / limit),
    currentPage: page,
    limit,
  };
};

export const createRecipe = async (recipeData, userId) => {
  const recipe = await Recipe.create({
    ...recipeData,
    owner: userId,
  });

  return await Recipe.findByPk(recipe.id, {
    include: [
      {
        model: User,
        as: 'ownerUser',
        attributes: ['id', 'name', 'email'],
      },
    ],
  });
};

export const updateRecipe = async (recipeId, recipeData, userId) => {
  const recipe = await Recipe.findByPk(recipeId);

  if (!recipe) {
    throw HttpError(404, 'Recipe not found');
  }

  if (recipe.owner !== userId) {
    throw HttpError(403, 'Access denied. You can only update your own recipes');
  }

  await recipe.update(recipeData);

  return await Recipe.findByPk(recipeId, {
    include: [
      {
        model: User,
        as: 'ownerUser',
        attributes: ['id', 'name', 'email'],
      },
    ],
  });
};

export const deleteRecipe = async (recipeId, userId) => {
  const recipe = await Recipe.findByPk(recipeId);

  if (!recipe) {
    throw HttpError(404, 'Recipe not found');
  }

  if (recipe.owner !== userId) {
    throw HttpError(403, 'Access denied. You can only delete your own recipes');
  }

  await recipe.destroy();
  return { message: 'Recipe deleted successfully' };
};

export const addToFavorites = async (recipeId, userId) => {
  const recipe = await Recipe.findByPk(recipeId);

  if (!recipe) {
    throw HttpError(404, 'Recipe not found');
  }

  const [favoriteRecipe, created] = await FavoriteRecipe.findOrCreate({
    where: {
      userId,
      recipeId,
    },
  });

  if (!created) {
    throw HttpError(400, 'Recipe is already in favorites');
  }

  // Increases recipe popularity
  await recipe.increment('popularity');

  return { message: 'Recipe added to favorites' };
};

export const removeFromFavorites = async (recipeId, userId) => {
  const favoriteRecipe = await FavoriteRecipe.findOne({
    where: {
      userId,
      recipeId,
    },
  });

  if (!favoriteRecipe) {
    throw HttpError(404, 'Recipe not found in favorites');
  }

  await favoriteRecipe.destroy();

  // Decreases recipe popularity
  const recipe = await Recipe.findByPk(recipeId);
  if (recipe && recipe.popularity > 0) {
    await recipe.decrement('popularity');
  }

  return { message: 'Recipe removed from favorites' };
};