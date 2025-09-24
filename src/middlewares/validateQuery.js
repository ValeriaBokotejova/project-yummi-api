import HttpError from '../utils/HttpError.js';

const validateQuery = schema => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

export default validateQuery;
