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

  // Додаємо фільтри
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
  
  const orderClause = [];
  if (sort === 'popularity') {
    // Для сортування за популярністю потрібно додати підрахунок favorites
    includeClause.push({
      model: Favorite,
      as: 'usersWhoFavorited',
      attributes: [],
      required: false
    });
    orderClause.push([sequelize.fn('COUNT', sequelize.col('usersWhoFavorited.id')), 'DESC']);
  } else if (sort === 'title') {
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

  // Додаємо GROUP BY для сортування за популярністю
  if (sort === 'popularity') {
    queryOptions.group = [
      'Recipe.id',
      'owner.id',
      'category.id', 
      'area.id',
      'ingredients.id',
      'ingredients->RecipeIngredient.recipeId',
      'ingredients->RecipeIngredient.ingredientId',
      'ingredients->RecipeIngredient.measure',
      'usersWhoFavorited.id'
    ];
    queryOptions.subQuery = false;
  }

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

  // Використовуємо прямий SQL запит для отримання популярних рецептів
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

  // Отримуємо загальну кількість рецептів
  const totalCount = await Recipe.count();

  // Якщо немає результатів, повертаємо порожній масив
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

  // Отримуємо повну інформацію про рецепти з релейшенами
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
  const { title, description, instructions, thumbUrl, time, categoryId, areaId, ingredients } = recipeData;

  const recipe = await Recipe.create({
    title,
    description,
    instructions,
    thumbUrl,
    time,
    ownerId: userId,
    categoryId,
    areaId
  });

  // Додаємо інгредієнти через junction table
  if (ingredients && ingredients.length > 0) {
    const recipeIngredients = ingredients.map(ingredient => ({
      recipeId: recipe.id,
      ingredientId: ingredient.id,
      measure: ingredient.measure
    }));
    
    await RecipeIngredient.bulkCreate(recipeIngredients);
  }

  // Повертаємо рецепт з усіма релейшенами
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

  const { title, description, instructions, thumbUrl, time, categoryId, areaId, ingredients } = recipeData;

  await recipe.update({
    title,
    description,
    instructions,
    thumbUrl,
    time,
    categoryId,
    areaId
  });

  // Оновлюємо інгредієнти
  if (ingredients) {
    // Видаляємо старі інгредієнти
    await RecipeIngredient.destroy({
      where: { recipeId: id }
    });
    
    // Додаємо нові
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

  // Видаляємо пов'язані інгредієнти
  await RecipeIngredient.destroy({
    where: { recipeId: id }
  });

  // Видаляємо рецепт
  await recipe.destroy();

  return { message: 'Recipe deleted successfully' };
};

export const addToFavorites = async (recipeId, userId) => {
  const recipe = await Recipe.findByPk(recipeId);
  
  if (!recipe) {
    throw new Error('Recipe not found');
  }

  // Перевіряємо, чи вже в улюблених
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

