import { User, Recipe, Favorite, Follow } from '../db/models/index.js';
// import cloudinary from '../config/cloudinary.js';

export const getUserById = async id => {
  const user = await User.findOne({ where: { id } });
  return user;
};

export const getUserSatistics = async id => {
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
  // const user = await getUserById(id);
  // if (!user) {
  //   return null;
  // }
  // let avatar = null;
  // if (file) {
  //   const { url } = await cloudinary.uploader.upload(file.path, {
  //     folder: 'avatars',
  //   });
  //   avatar = url;
  // }
  // await user.update({ avatarURL: avatar });
  // return user;
  const user = await getUserById(id);
  if (!user || !file) return null;

  user.avatarURL = file.path;
  await user.save();

  return user;
};
