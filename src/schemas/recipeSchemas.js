import Joi from 'joi';

export const createRecipeSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required(),
  description: Joi.string().trim().max(1000).optional(),
  instructions: Joi.string().trim().min(1).required(),
  thumb: Joi.string().uri().optional(),
  time: Joi.string().trim().optional(),
  category: Joi.string().trim().required(),
  area: Joi.string().trim().optional(),
  ingredients: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      measure: Joi.string().required(),
    })
  ).min(1).required(),
});

export const updateRecipeSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).optional(),
  description: Joi.string().trim().max(1000).optional(),
  instructions: Joi.string().trim().min(1).optional(),
  thumb: Joi.string().uri().optional(),
  time: Joi.string().trim().optional(),
  category: Joi.string().trim().optional(),
  area: Joi.string().trim().optional(),
  ingredients: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      measure: Joi.string().required(),
    })
  ).min(1).optional(),
});

export const searchRecipesSchema = Joi.object({
  category: Joi.string().trim().optional(),
  ingredient: Joi.string().trim().optional(),
  area: Joi.string().trim().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(12),
  sort: Joi.string().valid('popularity', 'title', 'createdAt').default('createdAt'),
});

export const getPopularRecipesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(12),
});