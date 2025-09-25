import { HttpError } from '../utils/HttpError.js';
import { uploadAvatar, getUserSatistics, getUserById } from '../services/usersService.js';

export const getCurrentUserController = async (req, res, next) => {
  try {
    const { user } = req;
    if (!user) {
      return next(HttpError(401, 'Not authorized'));
    }
    const statistics = await getUserSatistics(user.id);
    if (!statistics) {
      return next(HttpError(404, 'User not found'));
    }
    const { createdRecipes, favoriteCount, followersCount, followingCount } = statistics;
    res.status(200).json({
      email: user.email,
      name: user.name,
      avatarURL: user.avatarURL,
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
    const statistics = await getUserSatistics(user.id);
    if (!statistics) {
      return next(HttpError(404, 'User not found'));
    }
    const { createdRecipes, followersCount } = statistics;
    res.status(200).json({
      id: user.id,
      name: user.name,
      avatarURL: user.avatarURL,
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
    if (!user) {
      return next(HttpError(401, 'Not authorized'));
    }
    if (!file) {
      return next(HttpError(400, 'Avatar is required'));
    }
    const updatedUser = await uploadAvatar(user.id, file);
    res.status(200).json({
      avatarURL: updatedUser.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};
