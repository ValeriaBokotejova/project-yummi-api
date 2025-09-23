import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function createToken(payload, expiresIn = "24h") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return { payload, error: null };
  } catch (error) {
    return { payload: null, error };
  }
}