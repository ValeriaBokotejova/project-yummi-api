import { Recipe, User, Category, Area, Ingredient, RecipeIngredient, Favorite } from '../db/models/index.js';
import { Op } from 'sequelize';
import sequelize from '../db/connection.js';

export const searchRecipes = async (filters, pagination) => {
  const { page = 1, limit = 12 } = pagination;
  const { category, ingredient, area, sort = 'createdAt' } = filters;
  
  const whereClause = {};
  const includeClause = [
    {
      model: User,
      as: 'owner',
      attributes: ['id', 'name', 'avatarUrl']
    },
    {
      model: Category,
      as: 'category',
      attributes: ['id', 'name']
    },
    {
      model: Area,
      as: 'area',
      attributes: ['id', 'name']
    },
    {
      model: Ingredient,
      through: {
        attributes: ['measure']
      },
      attributes: ['id', 'name']
    }
  ];

  // Add filters
  if (category) {
    whereClause.categoryId = category;
  }
  
  if (area) {
    whereClause.areaId = area;
  }
  
  if (ingredient) {
    includeClause[3].where = {
      name: {
        [Op.iLike]: `%${ingredient}%`
      }
    };
  }

  const offset = (page - 1) * limit;
  
  // Handle popularity sorting with direct SQL query (like in getPopularRecipes)
  if (sort === 'popularity') {
    // Build WHERE conditions for SQL query
    let whereConditions = [];
    let replacements = { limit, offset };
    
    if (category) {
      whereConditions.push('r."categoryId" = :category');
      replacements.category = category;
    }
    
    if (area) {
      whereConditions.push('r."areaId" = :area');
      replacements.area = area;
    }
    
    if (ingredient) {
      whereConditions.push('EXISTS (SELECT 1 FROM "recipe-ingredients" ri JOIN ingredients i ON ri."ingredientId" = i.id WHERE ri."recipeId" = r.id AND i.name ILIKE :ingredient)');
      replacements.ingredient = `%${ingredient}%`;
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Use direct SQL query to get popular recipes with filters
    const results = await sequelize.query(`
      SELECT r.*, COUNT(f.id) as favorites_count
      FROM recipes r
      LEFT JOIN favorites f ON r.id = f."recipeId"
      ${whereClause}
      GROUP BY r.id
      ORDER BY favorites_count DESC
      LIMIT :limit OFFSET :offset
    `, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    });

    // Get total count with same filters
    let countQuery = 'SELECT COUNT(*) as total FROM recipes r';
    if (whereConditions.length > 0) {
      countQuery += ` ${whereClause}`;
    }
    
    const countResult = await sequelize.query(countQuery, {
      replacements: Object.fromEntries(Object.entries(replacements).filter(([key]) => key !== 'limit' && key !== 'offset')),
      type: sequelize.QueryTypes.SELECT
    });
    
    const totalCount = parseInt(countResult[0].total);

    // If no results, return empty array
    if (!results || results.length === 0) {
      return {
        recipes: [],
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        }
      };
    }

    // Get full recipe information with relations
    const recipeIds = results.map(r => r.id);
    const recipes = await Recipe.findAll({
      where: { id: recipeIds },
      include: includeClause
    });

    return {
      recipes,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
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
    recipes,
    pagination: {
      page,
      limit,
      total: count,
      pages: Math.ceil(count / limit)
    }
  };
};

export const getRecipeById = async (id) => {
  const recipe = await Recipe.findByPk(id, {
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'avatarUrl']
      },
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      },
      {
        model: Area,
        as: 'area',
        attributes: ['id', 'name']
      },
      {
        model: Ingredient,
        through: {
          attributes: ['measure']
        },
        attributes: ['id', 'name']
      }
    ]
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
  const results = await sequelize.query(`
    SELECT r.*, COUNT(f.id) as favorites_count
    FROM recipes r
    LEFT JOIN favorites f ON r.id = f."recipeId"
    GROUP BY r.id
    ORDER BY favorites_count DESC
    LIMIT :limit OFFSET :offset
  `, {
    replacements: { limit, offset },
    type: sequelize.QueryTypes.SELECT
  });

  // Get total count of recipes
  const totalCount = await Recipe.count();

  // If no results, return empty array
  if (!results || results.length === 0) {
    return {
      recipes: [],
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    };
  }

  // Get full recipe information with relations
  const recipeIds = results.map(r => r.id);
  const recipes = await Recipe.findAll({
    where: { id: recipeIds },
    include: [
      {
        model: User,
        as: 'owner',
        attributes: ['id', 'name', 'avatarUrl']
      },
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      },
      {
        model: Area,
        as: 'area',
        attributes: ['id', 'name']
      },
      {
        model: Ingredient,
        through: {
          attributes: ['measure']
        },
        attributes: ['id', 'name']
      }
    ]
  });

  return {
    recipes,
    pagination: {
      page,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit)
    }
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

