import { User, Follow, Recipe } from '../db/models/index.js';
import sequelize from '../db/connection.js';
import { NotFoundError, DuplicateError, UnauthorizedError } from '../errors/DomainErrors.js';

export const getFollowers = async (userId, { page = 1, limit = 20 } = {}) => {
  // Get users who follow the specified user, along with their recipes
  const offset = (page - 1) * limit;

  // First, verify user exists
  const userExists = await User.findByPk(userId, { attributes: ['id'] });
  if (!userExists) throw new NotFoundError('User');

  // Get followers with their recipes
  const [followers, totalCount] = await Promise.all([
    User.findAll({
      include: [
        {
          model: User,
          as: 'following',
          where: { id: userId },
          attributes: [],
          through: { attributes: [] },
          required: true,
        },
        {
          model: Recipe,
          as: 'recipes',
          attributes: ['id', 'thumbUrl', 'title'],
          limit: 4,
          order: [['createdAt', 'DESC']],
          separate: true,
          required: false,
        },
      ],
      attributes: ['id', 'name', 'avatarUrl'],
      limit,
      offset,
      subQuery: false,
    }),
    Follow.count({ where: { followingId: userId } })
  ]);

  // Get recipe counts for all followers in a single query
  const userIds = followers.map(user => user.id);
  const recipeCounts = await Recipe.findAll({
    where: { ownerId: userIds },
    attributes: [
      'ownerId',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['ownerId'],
    raw: true
  });

  // Create a map for quick lookup
  const recipeCountMap = recipeCounts.reduce((map, item) => {
    map[item.ownerId] = parseInt(item.count);
    return map;
  }, {});

  // Transform the response to include latestRecipes field and ownRecipesCount
  const items = followers.map(user => ({
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    latestRecipes: user.recipes || [],
    ownRecipesCount: recipeCountMap[user.id] || 0
  }));

  return { items, totalCount };
};

export const getFollowing = async (userId, { page = 1, limit = 20 } = {}) => {
  // Get users that the specified user is following, along with their recipes
  const offset = (page - 1) * limit;

  // First, verify user exists
  const userExists = await User.findByPk(userId, { attributes: ['id'] });
  if (!userExists) throw new NotFoundError('User');

  // Get following users with their recipes
  const [following, totalCount] = await Promise.all([
    User.findAll({
      include: [
        {
          model: User,
          as: 'followers',
          where: { id: userId },
          attributes: [],
          through: { attributes: [] },
          required: true,
        },
        {
          model: Recipe,
          as: 'recipes',
          attributes: ['id', 'thumbUrl', 'title'],
          limit: 4,
          order: [['createdAt', 'DESC']],
          separate: true,
          required: false,
        },
      ],
      attributes: ['id', 'name', 'avatarUrl'],
      limit,
      offset,
      subQuery: false,
    }),
    Follow.count({ where: { followerId: userId } })
  ]);

  // Get recipe counts for all following users in a single query
  const userIds = following.map(user => user.id);
  const recipeCounts = await Recipe.findAll({
    where: { ownerId: userIds },
    attributes: [
      'ownerId',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['ownerId'],
    raw: true
  });

  // Create a map for quick lookup
  const recipeCountMap = recipeCounts.reduce((map, item) => {
    map[item.ownerId] = parseInt(item.count);
    return map;
  }, {});

  // Transform the response to include latestRecipes field and ownRecipesCount
  const items = following.map(user => ({
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    latestRecipes: user.recipes || [],
    ownRecipesCount: recipeCountMap[user.id] || 0
  }));

  return { items, totalCount };
};

export const follow = async (targetUserId, currentUserId) => {
  if (targetUserId === currentUserId) {
    throw new UnauthorizedError("You can't follow yourself");
  }

  const target = await User.findByPk(targetUserId, { raw: false });
  if (!target) throw new NotFoundError('User');

  const existing = await Follow.findOne({
    where: { followerId: currentUserId, followingId: targetUserId },
  });
  if (existing) throw new DuplicateError('Already following');

  await Follow.create({ followerId: currentUserId, followingId: targetUserId });
  return { message: 'Followed' };
};

export const unfollow = async (targetUserId, currentUserId) => {
  if (targetUserId === currentUserId) {
    throw new UnauthorizedError("You can't unfollow yourself");
  }

  const deleted = await Follow.destroy({
    where: { followerId: currentUserId, followingId: targetUserId },
  });

  if (!deleted) throw new NotFoundError('Follow relation');

  return { message: 'Unfollowed' };
};
