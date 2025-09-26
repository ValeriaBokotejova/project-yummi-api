import User from '../db/models/User.js';

export default async function authenticate(req, _res, next) {
  // Implement authentication middleware
  req.user = new User({ id: '8b390a62-cf7a-4938-9345-d3f3232c63a1' });
  next();
}
