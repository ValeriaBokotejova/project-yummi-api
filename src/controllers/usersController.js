import HttpError from '../utils/HttpError.js';
import * as usersService from '../services/usersService.js';

export const getCurrentUser = async (req, res, next) => {
  try {
    const { user } = req;

    const currentUser = await usersService.getUserById(user.id);
    const statistics = await usersService.getUserStatistics(user.id, {
      includeFavorite: true,
      includeFollowing: true,
    });
    if (!statistics) {
      return next(HttpError(404, 'User not found'));
    }
    res.status(200).json({
      id: currentUser.id,
      email: currentUser.email,
      name: currentUser.name,
      avatarUrl: currentUser.avatarUrl,
      ...statistics
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { user: currentUser } = req;
    const { id } = req.params;

    const user = await usersService.getUserById(id);
    if (!user) {
      return next(HttpError(404, 'User not found'));
    }
    const statistics = await usersService.getUserStatistics(user.id, {
      includeFavorite: currentUser.id === user.id,
      includeFollowing: currentUser.id === user.id,
    });
    if (!statistics) {
      return next(HttpError(404, 'User not found'));
    }
    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      ...statistics
    });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    const { user, file } = req;

    if (!file) {
      return next(HttpError(400, 'Avatar is required'));
    }
    const updatedUser = await usersService.uploadAvatar(user.id, file);
    res.status(200).json({
      avatarUrl: updatedUser.avatarUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserRecipes = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Parse pagination parameters
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 12, 50);

    // Parse sorting parameters
    const sortBy = req.query.sortBy || 'createdAt';
    const sortDir = req.query.sortDir || 'desc';

    const pagination = { page, limit };
    const sorting = { sortBy, sortDir };

    const result = await usersService.getUserRecipes(id, pagination, sorting);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserFavoriteRecipes = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Parse pagination parameters
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 12, 50);

    // Parse sorting parameters
    const sortBy = req.query.sortBy || 'createdAt';
    const sortDir = req.query.sortDir || 'desc';

    const pagination = { page, limit };
    const sorting = { sortBy, sortDir };

    const result = await usersService.getUserFavoriteRecipes(id, pagination, sorting);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
