import { User, Recipe, Favorite, Follow } from '../db/models/index.js';
import * as cloudinaryService from './cloudinaryService.js';

export const getUserById = async id => {
  const user = await User.findOne({ where: { id } });
  return user;
};

export const getUserStatistics = async id => {
  const user = await getUserById(id);
  if (!user) {
    return null;
  }
  const createdRecipes = await Recipe.count({ where: { ownerId: user.id } });
  const favoriteCount = await Favorite.count({ where: { userId: user.id } });
  const followersCount = await Follow.count({ where: { followingId: user.id } });
  const followingCount = await Follow.count({ where: { followerId: user.id } });

  return { createdRecipes, favoriteCount, followersCount, followingCount };
};

export const getAvatar = async id => {
  const user = await getUserById(id);
  if (!user) {
    return null;
  }
  return user.avatarUrl;
}

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
