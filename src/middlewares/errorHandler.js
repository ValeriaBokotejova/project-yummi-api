import { UniqueConstraintError } from 'sequelize';
import HttpError from '../utils/HttpError.js';
import {
  NotFoundError,
  ConflictError,
  ValidationError,
  UnauthorizedError,
  DuplicateError,
} from '../errors/DomainErrors.js';

const errorHandler = (err, req, res, next) => {
  // Domain/Business errors
  if (err instanceof NotFoundError) {
    return next(HttpError(404, err.message));
  }
  if (err instanceof ConflictError) {
    return next(HttpError(409, err.message));
  }
  if (err instanceof ValidationError) {
    return next(HttpError(400, err.message));
  }
  if (err instanceof UnauthorizedError) {
    return next(HttpError(403, err.message));
  }
  if (err instanceof DuplicateError) {
    return next(HttpError(409, err.message));
  }

  // Validation errors from Joi (HttpError with status 400)
  if (err.status === 400) {
    return next(HttpError(400, err.message));
  }

  // Database errors
  if (err instanceof UniqueConstraintError) {
    const message = err.errors?.[0]?.message || 'Email already exist';
    return next(HttpError(409, message));
  }

  // Default fallback
  console.error(err);
  return next(HttpError(500, 'Internal Server Error'));
};

export default errorHandler;
