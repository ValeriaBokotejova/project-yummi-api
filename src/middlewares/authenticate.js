import { verifyToken } from '../utils/jwt.js';
import HttpError from '../utils/HttpError.js';
import { getUserById } from '../services/usersService.js';

export default async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw HttpError(401, 'Authorization header is missing');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw HttpError(401, 'Authorization header must be in format: Bearer <token>');
    }

    const { payload, error } = verifyToken(token);

    if (error) {
      throw HttpError(401, 'Invalid or expired token');
    }

    // Find user by id from payload
    // and ensure that the token is still valid (not replaced/removed)
    const user = await getUserById(payload.id);

    if (!user) throw HttpError(401, 'Invalid or expired token');
    if (!user.token || user.token !== token) {
      // token is valid cryptographically, but user has no token or it is different
      throw HttpError(401, 'Invalid or expired token');
    }

    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
}
