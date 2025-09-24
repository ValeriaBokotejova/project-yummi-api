import { Recipe, User, Category, Area, Ingredient, RecipeIngredient, Favorite } from '../db/models/index.js';
import { Op } from 'sequelize';
import sequelize from '../db/connection.js';
import { getRecipeIncludes, getRecipeIncludesWithIngredientFilter } from '../utils/recipeIncludes.js';
import { 
  buildPopularRecipesWhereConditions, 
  executePopularRecipesQuery, 
  getPopularRecipesTotalCount 
} from '../utils/popularRecipesQuery.js';

export const searchRecipes = async (filters, pagination) => {
  const { page = 1, limit = 12 } = pagination;
  const { category, ingredient, area, sort = 'createdAt' } = filters;
  
  const whereClause = {};
  const includeClause = getRecipeIncludesWithIngredientFilter(ingredient);

  // Add filters
  if (category) {
    whereClause.categoryId = category;
  }
  
  if (area) {
    whereClause.areaId = area;
  }

  const offset = (page - 1) * limit;
  
  // Handle popularity sorting with direct SQL query
  if (sort === 'popularity') {
    const { whereConditions, replacements } = buildPopularRecipesWhereConditions({ category, area, ingredient });
    
    const results = await executePopularRecipesQuery({ limit, offset, whereConditions, replacements });
    const totalCount = await getPopularRecipesTotalCount(whereConditions, replacements);

    // If no results, return empty array
    if (!results || results.length === 0) {
      return {
        items: [],
        totalCount: totalCount
      };
    }

    // Get full recipe information with relations
    const recipeIds = results.map(r => r.id);
    const recipes = await Recipe.findAll({
      where: { id: recipeIds },
      include: includeClause
    });

    return {
      items: recipes,
      totalCount: totalCount
    };
  }

  // Handle other sorting options with regular Sequelize query
  const orderClause = [];
  if (sort === 'title') {
    orderClause.push(['title', 'ASC']);
  } else {
    orderClause.push(['createdAt', 'DESC']);
  }

  const queryOptions = {
    where: whereClause,
    include: includeClause,
    order: orderClause,
    limit,
    offset,
    distinct: true
  };

  const { count, rows: recipes } = await Recipe.findAndCountAll(queryOptions);

  return {
    items: recipes,
    totalCount: count
  };
};

export const getRecipeById = async (id) => {
  const recipe = await Recipe.findByPk(id, {
    include: getRecipeIncludes()
  });

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  return recipe;
};

export const getPopularRecipes = async (pagination) => {
  const { page = 1, limit = 12 } = pagination;
  const offset = (page - 1) * limit;

  // Use direct SQL query to get popular recipes
  const results = await executePopularRecipesQuery({ 
    limit, 
    offset, 
    whereConditions: [], 
    replacements: {} 
  });

  // Get total count of recipes
  const totalCount = await Recipe.count();

  // If no results, return empty array
  if (!results || results.length === 0) {
    return {
      items: [],
      totalCount: totalCount
    };
  }

  // Get full recipe information with relations
  const recipeIds = results.map(r => r.id);
  const recipes = await Recipe.findAll({
    where: { id: recipeIds },
    include: getRecipeIncludes()
  });

  return {
    items: recipes,
    totalCount: totalCount
  };
};

export const createRecipe = async (recipeData, userId) => {
  const { ingredients, ...recipeFields } = recipeData;

  const recipe = await Recipe.create({
    ...recipeFields,
    ownerId: userId,
  });

  // Add ingredients through junction table
  if (ingredients && ingredients.length > 0) {
    const recipeIngredients = ingredients.map(ingredient => ({
      recipeId: recipe.id,
      ingredientId: ingredient.id,
      measure: ingredient.measure
    }));
    
    await RecipeIngredient.bulkCreate(recipeIngredients);
  }

  // Return recipe with all relations
  return await getRecipeById(recipe.id);
};

export const updateRecipe = async (id, recipeData, userId) => {
  const recipe = await Recipe.findByPk(id);
  
  if (!recipe) {
    throw new Error('Recipe not found');
  }
  
  if (recipe.ownerId !== userId) {
    throw new Error('Not authorized to update this recipe');
  }

  const { ingredients, ...recipeFields } = recipeData;

  await recipe.update(recipeFields);

  // Update ingredients
  if (ingredients) {
    // Remove old ingredients
    await RecipeIngredient.destroy({
      where: { recipeId: id }
    });
    
    // Add new ones
    if (ingredients.length > 0) {
      const recipeIngredients = ingredients.map(ingredient => ({
        recipeId: id,
        ingredientId: ingredient.id,
        measure: ingredient.measure
      }));
      
      await RecipeIngredient.bulkCreate(recipeIngredients);
    }
  }

  return await getRecipeById(id);
};

export const deleteRecipe = async (id, userId) => {
  const recipe = await Recipe.findByPk(id);
  
  if (!recipe) {
    throw new Error('Recipe not found');
  }
  
  if (recipe.ownerId !== userId) {
    throw new Error('Not authorized to delete this recipe');
  }

  // Remove related ingredients
  await RecipeIngredient.destroy({
    where: { recipeId: id }
  });

  // Delete recipe
  await recipe.destroy();

  return { message: 'Recipe deleted successfully' };
};

export const addToFavorites = async (recipeId, userId) => {
  const recipe = await Recipe.findByPk(recipeId);
  
  if (!recipe) {
    throw new Error('Recipe not found');
  }

  // Check if already in favorites
  const existingFavorite = await Favorite.findOne({
    where: { userId, recipeId }
  });

  if (existingFavorite) {
    throw new Error('Recipe already in favorites');
  }

  await Favorite.create({ userId, recipeId });

  return { message: 'Recipe added to favorites' };
};

export const removeFromFavorites = async (recipeId, userId) => {
  const favorite = await Favorite.findOne({
    where: { userId, recipeId }
  });

  if (!favorite) {
    throw new Error('Recipe not in favorites');
  }

  await favorite.destroy();

  return { message: 'Recipe removed from favorites' };
};

