import Joi from 'joi';

export const createRecipeSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().trim().max(1000).optional(),
  instructions: Joi.string().trim().min(1).required(),
  thumbUrl: Joi.string().uri().required(),
  time: Joi.number().integer().min(1).required(),
  categoryId: Joi.string().uuid().required(),
  areaId: Joi.string().uuid().optional(),
  ingredients: Joi.array().items(
    Joi.object({
      id: Joi.string().uuid().required(),
      measure: Joi.string().required(),
    })
  ).min(1).required(),
});

export const updateRecipeSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).optional(),
  description: Joi.string().trim().max(1000).optional(),
  instructions: Joi.string().trim().min(1).optional(),
  thumbUrl: Joi.string().uri().optional(),
  time: Joi.number().integer().min(1).optional(),
  categoryId: Joi.string().uuid().optional(),
  areaId: Joi.string().uuid().optional(),
  ingredients: Joi.array().items(
    Joi.object({
      id: Joi.string().uuid().required(),
      measure: Joi.string().required(),
    })
  ).min(1).optional(),
});

export const searchRecipesSchema = Joi.object({
  category: Joi.string().uuid().optional(),
  ingredient: Joi.string().trim().optional(),
  area: Joi.string().uuid().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(12),
  sortBy: Joi.string().valid('popularity', 'title', 'createdAt', 'time').default('createdAt'),
  sortDir: Joi.string().valid('asc', 'desc').default('desc'),
});

export const getPopularRecipesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(12),
});