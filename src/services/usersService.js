// import User from "../db/models/User";
import { User, Recipe, Favorite, Follow } from '../db/models/index.js';

export const getUserById = async id => {
  const user =  await User.findOne({ where: { id } });
  return user;
}

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
  const user = await getUserById(id);
  if (!user) {
    return null;
  }
  let avatar = null;
  if (file) {
    // const newPath = path.join(avatarsDir, file.filename);
    // await fs.rename(file.path, newPath);
    // avatar = path.join("avatars", file.filename);
  }
  await user.update({ avatarURL: avatar });
  return user;
};
