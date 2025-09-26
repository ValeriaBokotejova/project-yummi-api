import { User, Follow } from '../db/models/index.js';
import { NotFoundError, DuplicateError, UnauthorizedError } from '../errors/DomainErrors.js';

export const getFollowers = async (userId, { page = 1, limit = 20 } = {}) => {
  const user = await User.findByPk(userId, { raw: false });
  if (!user) throw new NotFoundError('User');

  const offset = (page - 1) * limit;

  const [items, totalCount] = await Promise.all([
    user.getFollowers({
      attributes: ['id', 'name', 'avatarUrl'],
      joinTableAttributes: [],
      limit,
      offset,
      raw: false,
    }),
    user.countFollowers({ distinct: true }),
  ]);

  return { items, totalCount };
};

export const getFollowing = async (userId, { page = 1, limit = 20 } = {}) => {
  const user = await User.findByPk(userId, { raw: false });
  if (!user) throw new NotFoundError('User');

  const offset = (page - 1) * limit;

  const [items, totalCount] = await Promise.all([
    user.getFollowing({
      attributes: ['id', 'name', 'avatarUrl'],
      joinTableAttributes: [],
      limit,
      offset,
      raw: false,
    }),
    user.countFollowing({ distinct: true }),
  ]);

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
