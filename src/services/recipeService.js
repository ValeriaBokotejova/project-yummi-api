import { Recipe, User, Category, Area, Ingredient, RecipeIngredient, Favorite } from '../db/models/index.js';
import sequelize from '../db/connection.js';
import { NotFoundError, UnauthorizedError, DuplicateError } from '../errors/DomainErrors.js';
import * as cloudinaryService from './cloudinaryService.js';

export const searchRecipes = async (filters, pagination) => {
  const { page = 1, limit = 12 } = pagination;
  const { category, ingredient, area, sortBy = 'createdAt', sortDir = 'desc' } = filters;

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
  if (sortBy === 'popularity') {
    const { whereConditions, replacements } = buildPopularRecipesWhereConditions({ category, area, ingredient });

    const results = await executePopularRecipesQuery({ limit, offset, whereConditions, replacements });
    const totalCount = await getPopularRecipesTotalCount(whereConditions, replacements);

    // If no results, return empty array
    if (!results || results.length === 0) {
      return {
        items: [],
        totalCount: totalCount,
      };
    }

    // Get full recipe information with relations
    const recipeIds = results.map(r => r.id);
    const recipes = await Recipe.findAll({
      where: { id: recipeIds },
      include: includeClause,
      attributes: { exclude: ['ownerId', 'categoryId', 'areaId'] },
    });

    return {
      items: recipes.map(recipe => transformRecipeData(recipe)),
      totalCount: totalCount,
    };
  }

  // Handle other sorting options with regular Sequelize query
  const orderClause = [];
  const direction = sortDir.toUpperCase();

  switch (sortBy) {
    case 'title':
      orderClause.push(['title', direction]);
      break;
    case 'time':
      orderClause.push(['time', direction]);
      break;
    case 'createdAt':
    default:
      orderClause.push(['createdAt', direction]);
      break;
  }

  const queryOptions = {
    where: whereClause,
    include: includeClause,
    order: orderClause,
    limit,
    offset,
    distinct: true,
    attributes: { exclude: ['ownerId', 'categoryId', 'areaId'] },
  };

  const { count, rows: recipes } = await Recipe.findAndCountAll(queryOptions);

  return {
    items: recipes.map(recipe => transformRecipeData(recipe)),
    totalCount: count,
  };
};

export const getRecipeById = async id => {
  const recipe = await Recipe.findByPk(id, {
    include: getRecipeIncludes(),
    attributes: { exclude: ['ownerId', 'categoryId', 'areaId'] },
  });

  if (!recipe) {
    throw new NotFoundError('Recipe');
  }

  return transformRecipeData(recipe);
};

export const getPopularRecipes = async pagination => {
  const { page = 1, limit = 12 } = pagination;
  const offset = (page - 1) * limit;

  // Use direct SQL query to get popular recipes
  const results = await executePopularRecipesQuery({
    limit,
    offset,
    whereConditions: [],
    replacements: {},
  });

  // Get total count of recipes
  const totalCount = await Recipe.count();

  // If no results, return empty array
  if (!results || results.length === 0) {
    return {
      items: [],
      totalCount: totalCount,
    };
  }

  // Get full recipe information with relations
  const recipeIds = results.map(r => r.id);
  const recipes = await Recipe.findAll({
    where: { id: recipeIds },
    include: getRecipeIncludes(),
    attributes: { exclude: ['ownerId', 'categoryId', 'areaId'] },
  });

  return {
    items: recipes.map(recipe => transformRecipeData(recipe)),
    totalCount: totalCount,
  };
};

export const createRecipe = async (recipeData, file, userId) => {
  const { ingredients, ...recipeFields } = recipeData;

  const thumbUrl = await cloudinaryService.uploadImage(file, 'recipes');

  const recipe = await Recipe.create({
    ...recipeFields,
    thumbUrl,
    ownerId: userId,
  });

  // Add ingredients through junction table
  if (ingredients && ingredients.length > 0) {
    const recipeIngredients = ingredients.map(ingredient => ({
      recipeId: recipe.id,
      ingredientId: ingredient.id,
      measure: ingredient.measure,
    }));

    await RecipeIngredient.bulkCreate(recipeIngredients);
  }

  // Return recipe with all relations
  return await getRecipeById(recipe.id);
};

export const updateRecipe = async (id, recipeData, file, userId) => {
  const recipe = await Recipe.findByPk(id);

  if (!recipe) {
    throw new NotFoundError('Recipe');
  }

  if (recipe.ownerId !== userId) {
    throw new UnauthorizedError('Not authorized to update this recipe');
  }

  const { ingredients, ...recipeFields } = recipeData;

  // Handle optional image upload
  if (file) {
    const thumbUrl = await cloudinaryService.uploadImage(file, 'recipes');
    recipeFields.thumbUrl = thumbUrl;
  }

  await recipe.update(recipeFields);

  // Update ingredients
  if (ingredients) {
    // Remove old ingredients
    await RecipeIngredient.destroy({
      where: { recipeId: id },
    });

    // Add new ones
    if (ingredients.length > 0) {
      const recipeIngredients = ingredients.map(ingredient => ({
        recipeId: id,
        ingredientId: ingredient.id,
        measure: ingredient.measure,
      }));

      await RecipeIngredient.bulkCreate(recipeIngredients);
    }
  }

  return await getRecipeById(id);
};

export const deleteRecipe = async (id, userId) => {
  const recipe = await Recipe.findByPk(id);

  if (!recipe) {
    throw new NotFoundError('Recipe');
  }

  if (recipe.ownerId !== userId) {
    throw new UnauthorizedError('Not authorized to delete this recipe');
  }

  // Remove related ingredients
  await RecipeIngredient.destroy({
    where: { recipeId: id },
  });

  // Delete recipe
  await recipe.destroy();

  return { message: 'Recipe deleted successfully' };
};

export const addToFavorites = async (recipeId, userId) => {
  const recipe = await Recipe.findByPk(recipeId);

  if (!recipe) {
    throw new NotFoundError('Recipe');
  }

  // Check if already in favorites
  const existingFavorite = await Favorite.findOne({
    where: { userId, recipeId },
  });

  if (existingFavorite) {
    throw new DuplicateError('Recipe already in favorites');
  }

  await Favorite.create({ userId, recipeId });

  return { message: 'Recipe added to favorites' };
};

export const removeFromFavorites = async (recipeId, userId) => {
  const favorite = await Favorite.findOne({
    where: { userId, recipeId },
  });

  if (!favorite) {
    throw new NotFoundError('Recipe not in favorites');
  }

  await favorite.destroy();

  return { message: 'Recipe removed from favorites' };
};

// Private helper functions for popular recipes queries
function buildPopularRecipesWhereConditions(filters) {
  const { category, area, ingredient } = filters;
  const whereConditions = [];
  const replacements = {};

  if (category) {
    whereConditions.push('r."categoryId" = :category');
    replacements.category = category;
  }

  if (area) {
    whereConditions.push('r."areaId" = :area');
    replacements.area = area;
  }

  if (ingredient) {
    whereConditions.push(
      'EXISTS (SELECT 1 FROM recipe_ingredients ri WHERE ri."recipeId" = r.id AND ri."ingredientId" = :ingredient)'
    );
    replacements.ingredient = ingredient;
  }

  return { whereConditions, replacements };
}

async function executePopularRecipesQuery({ limit, offset, whereConditions, replacements }) {
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  const query = `
    SELECT r.*, COUNT(f.id) as favorites_count
    FROM recipes r
    LEFT JOIN favorites f ON r.id = f."recipeId"
    ${whereClause}
    GROUP BY r.id
    ORDER BY favorites_count DESC
    LIMIT :limit OFFSET :offset
  `;

  return await sequelize.query(query, {
    replacements: { ...replacements, limit, offset },
    type: sequelize.QueryTypes.SELECT,
  });
}

async function getPopularRecipesTotalCount(whereConditions, replacements) {
  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  const countQuery = `SELECT COUNT(*) as total FROM recipes r ${whereClause}`;

  const countResult = await sequelize.query(countQuery, {
    replacements: Object.fromEntries(
      Object.entries(replacements).filter(([key]) => key !== 'limit' && key !== 'offset')
    ),
    type: sequelize.QueryTypes.SELECT,
  });

  return parseInt(countResult[0].total);
}

// Transform recipe data to remove foreign keys and flatten ingredient measures
function transformRecipeData(recipe) {
  const recipeData = recipe.toJSON();

  // Remove foreign key IDs
  delete recipeData.ownerId;
  delete recipeData.categoryId;
  delete recipeData.areaId;

  // Transform ingredients to flatten the measure
  if (recipeData.ingredients) {
    recipeData.ingredients = recipeData.ingredients.map(ingredient => ({
      id: ingredient.id,
      name: ingredient.name,
      measure: ingredient.RecipeIngredient?.measure || '',
    }));
  }

  return recipeData;
}

// Private helper functions for recipe includes
function getRecipeIncludes() {
  return [
    {
      model: User,
      as: 'owner',
      attributes: ['id', 'name', 'avatarUrl'],
    },
    {
      model: Category,
      as: 'category',
      attributes: ['id', 'name'],
    },
    {
      model: Area,
      as: 'area',
      attributes: ['id', 'name'],
    },
    {
      model: Ingredient,
      as: 'ingredients',
      through: {
        attributes: ['measure'],
        as: 'RecipeIngredient',
      },
      attributes: ['id', 'name'],
    },
  ];
}

function getRecipeIncludesWithIngredientFilter(ingredientId) {
  const includes = getRecipeIncludes();

  if (ingredientId) {
    const ingredientInclude = includes.find(include => include.model === Ingredient);
    if (ingredientInclude) {
      Object.assign(ingredientInclude, {
        where: {
          id: ingredientId,
        },
      });
    }
  }

  return includes;
}
