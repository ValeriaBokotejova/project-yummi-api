import { verifyToken } from '../utils/jwt.js';
import HttpError from '../utils/HttpError.js';

export default async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new HttpError(401, 'Authorization header is missing');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new HttpError(401, 'Authorization header must be in format: Bearer <token>');
    }

    const { payload, error } = verifyToken(token);

    if (error) {
      throw new HttpError(401, 'Invalid or expired token');
    }

    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
}
