import HttpError from '../utils/HttpError.js';
import { uploadAvatar, getUserStatistics, getUserById, getAvatar } from '../services/usersService.js';

export const getCurrentUserController = async (req, res, next) => {
  try {
    const { user } = req;
    const statistics = await getUserStatistics(user.id);
    if (!statistics) {
      return next(HttpError(404, 'User not found'));
    }
    const avatar = await getAvatar(user.id);
    const { createdRecipes, favoriteCount, followersCount, followingCount } = statistics;
    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: avatar,
      createdRecipes,
      favoriteCount,
      followersCount,
      followingCount,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
      return next(HttpError(404, 'User not found'));
    }
    const statistics = await getUserStatistics(user.id);
    if (!statistics) {
      return next(HttpError(404, 'User not found'));
    }
    const { createdRecipes, followersCount } = statistics;
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      createdRecipes,
      followersCount,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatarController = async (req, res, next) => {
  try {
    const { user, file } = req;

    if (!file) {
      return next(HttpError(400, 'Avatar is required'));
    }
    const updatedUser = await uploadAvatar(user.id, file);
    res.status(200).json({
      avatarUrl: updatedUser.avatarUrl,
    });
  } catch (error) {
    next(error);
  }
};
