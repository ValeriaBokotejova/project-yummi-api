import { User, Category, Area, Ingredient } from '../db/models/index.js';
import { Op } from 'sequelize';

export const getRecipeIncludes = () => [
  {
    model: User,
    as: 'owner',
    attributes: ['id', 'name', 'avatarUrl']
  },
  {
    model: Category,
    as: 'category',
    attributes: ['id', 'name']
  },
  {
    model: Area,
    as: 'area',
    attributes: ['id', 'name']
  },
  {
    model: Ingredient,
    through: {
      attributes: ['measure']
    },
    attributes: ['id', 'name']
  }
];

export const getRecipeIncludesWithIngredientFilter = (ingredient) => {
  const includes = getRecipeIncludes();
  
  if (ingredient) {
    const ingredientInclude = includes.find(include => include.model === Ingredient);
    if (ingredientInclude) {
      Object.assign(ingredientInclude, {
        where: {
          name: {
            [Op.iLike]: `%${ingredient}%`
          }
        }
      });
    }
  }
  
  return includes;
};
