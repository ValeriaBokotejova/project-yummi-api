import { User, Recipe, Favorite, Follow, Category, Area, Ingredient } from '../db/models/index.js';
import * as cloudinaryService from './cloudinaryService.js';
import { NotFoundError } from '../errors/DomainErrors.js';

export const getUserById = async id => {
  const user = await User.findOne({ where: { id } });
  return user;
};

export const getUserStatistics = async (id, options = {}) => {
  const { includeFavorite = false, includeFollowing = false } = options;

  const user = await getUserById(id);
  if (!user) {
    return null;
  }
  const ownRecipesCount = await Recipe.count({ where: { ownerId: user.id } });

  const followersCount = await Follow.count({ where: { followingId: user.id } });

  const result = { ownRecipesCount, followersCount };

  if (includeFavorite) {
    // Get favorite recipe IDs only if requested
    const favorites = await Favorite.findAll({
      where: { userId: user.id },
      attributes: ['recipeId'],
    });
    result.favoriteIds = favorites.map(fav => fav.recipeId);
  }

  if (includeFollowing) {
    // Get following user IDs only if requested
    const following = await Follow.findAll({
      where: { followerId: user.id },
      attributes: ['followingId'],
    });
    result.followingIds = following.map(follow => follow.followingId);
  }

  return result;
};

export const uploadAvatar = async (id, file) => {
  const user = await getUserById(id);
  if (!user) {
    return null;
  }
  let avatar = null;
  if (file) {
    avatar = await cloudinaryService.uploadImage(file, 'avatars');
  }
  await user.update({ avatarUrl: avatar });
  return user;
};

export const getUserRecipes = async (userId, pagination, sorting) => {
  const { page = 1, limit = 12 } = pagination;
  const { sortBy = 'createdAt', sortDir = 'desc' } = sorting;

  // Validate user exists
  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError('User');
  }

  // Pagination
  const offset = (page - 1) * limit;

  // Sorting
  const order = [];
  const direction = sortDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  switch (sortBy) {
    case 'title':
      order.push(['title', direction]);
      break;
    case 'time':
      order.push(['time', direction]);
      break;
    case 'createdAt':
    default:
      order.push(['createdAt', direction]);
      break;
  }

  const { count, rows } = await Recipe.findAndCountAll({
    where: { ownerId: userId },
    include: [
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
    ],
    attributes: { exclude: ['ownerId', 'categoryId', 'areaId'] },
    order,
    limit,
    offset,
    distinct: true,
  });

  // Transform recipes to flatten ingredient measures
  const items = rows.map(recipe => {
    const recipeData = recipe.toJSON();
    if (recipeData.ingredients) {
      recipeData.ingredients = recipeData.ingredients.map(ingredient => ({
        id: ingredient.id,
        name: ingredient.name,
        measure: ingredient.RecipeIngredient?.measure || '',
      }));
    }
    return recipeData;
  });

  return {
    items,
    totalCount: count,
  };
};

export const getUserFavoriteRecipes = async (userId, pagination, sorting) => {
  const { page = 1, limit = 12 } = pagination;
  const { sortBy = 'createdAt', sortDir = 'desc' } = sorting;

  // Validate user exists
  const user = await User.findByPk(userId);
  if (!user) {
    throw new NotFoundError('User');
  }

  // Pagination
  const offset = (page - 1) * limit;

  // Sorting
  const order = [];
  const direction = sortDir.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  switch (sortBy) {
    case 'title':
      order.push(['title', direction]);
      break;
    case 'time':
      order.push(['time', direction]);
      break;
    case 'createdAt':
    default:
      order.push(['createdAt', direction]);
      break;
  }

  const { count, rows } = await Recipe.findAndCountAll({
    include: [
      {
        model: User,
        as: 'usersWhoFavorited',
        attributes: [],
        through: {
          model: Favorite,
          attributes: [],
        },
        where: { id: userId },
        required: true,
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
    ],
    attributes: { exclude: ['ownerId', 'categoryId', 'areaId'] },
    order,
    limit,
    offset,
    distinct: true,
  });

  // Transform recipes to flatten ingredient measures
  const items = rows.map(recipe => {
    const recipeData = recipe.toJSON();
    if (recipeData.ingredients) {
      recipeData.ingredients = recipeData.ingredients.map(ingredient => ({
        id: ingredient.id,
        name: ingredient.name,
        measure: ingredient.RecipeIngredient?.measure || '',
      }));
    }
    return recipeData;
  });

  return {
    items,
    totalCount: count,
  };
};
