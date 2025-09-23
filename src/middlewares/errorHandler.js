import { UniqueConstraintError } from "sequelize";

const errorHandler = (err, req, res, next) => {
  if (err instanceof UniqueConstraintError) {
    const message = err.errors?.[0]?.message || "Email already exist";
    return res.status(409).json({ message });
  }
  next(err);
};

export default errorHandler;