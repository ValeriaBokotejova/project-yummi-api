import fs from 'node:fs/promises';

import { User, Recipe, Favorite, Follow } from '../db/models/index.js';
import cloudinary from '../config/cloudinary.js';

export const getUserById = async id => {
  const user = await User.findOne({ where: { id } });
  return user;
};

export const getUserStatistics = async id => {
  const user = await getUserById(id);
  if (!user) {
    return null;
  }
  const createdRecipes = await Recipe.count({ where: { authorId: user.id } });
  const favoriteCount = await Favorite.count({ where: { userId: user.id } });
  const followersCount = await Follow.count({ where: { followingId: user.id } });
  const followingCount = await Follow.count({ where: { followerId: user.id } });

  return { createdRecipes, favoriteCount, followersCount, followingCount };
};

export const uploadAvatar = async (id, file) => {
  const user = await getUserById(id);
  if (!user) {
    return null;
  }
  let avatar = null;
  if (file) {
    const { url } = await cloudinary.uploader.upload(file.path, {
      folder: 'avatars',
      use_filename: true,
    });
    avatar = url;
    await fs.unlink(file.path);
  }
  await user.update({ avatarURL: avatar });
  return user;
};
