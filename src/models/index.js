import User from './User.js';
import Recipe from './Recipe.js';
import FavoriteRecipe from './FavoriteRecipe.js';

User.hasMany(Recipe, { foreignKey: 'owner', as: 'recipes' });
Recipe.belongsTo(User, { foreignKey: 'owner', as: 'ownerUser' });

FavoriteRecipe.belongsTo(User, { foreignKey: 'userId', as: 'User' });
FavoriteRecipe.belongsTo(Recipe, { foreignKey: 'recipeId', as: 'Recipe' });
User.hasMany(FavoriteRecipe, { foreignKey: 'userId', as: 'favoriteRecipes' });
Recipe.hasMany(FavoriteRecipe, { foreignKey: 'recipeId', as: 'favorites' });

export {
  User,
  Recipe,
  FavoriteRecipe,
};