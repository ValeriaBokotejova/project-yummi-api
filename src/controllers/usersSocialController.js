import * as followService from '../services/followService.js';

export const getFollowers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;
    const result = await followService.getFollowers(id, { page, limit });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getFollowing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query;
    const result = await followService.getFollowing(id, { page, limit });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const follow = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;
    const result = await followService.follow(id, currentUserId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const unfollow = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id;
    const result = await followService.unfollow(id, currentUserId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
