import HttpError from '../utils/HttpError.js';

export const register = async (req, res, next) => {
  try {
    res.status(201).json({});
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    res.status(200).json({});
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
