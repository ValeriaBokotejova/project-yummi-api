import User from './User.js';
import Recipe from './Recipe.js';
import Category from './Category.js';
import Area from './Area.js';
import Ingredient from './Ingredient.js';
import Testimonial from './Testimonial.js';
import Favorite from './junctions/Favorite.js';
import Follow from './junctions/Follow.js';
import RecipeIngredient from './junctions/RecipeIngredient.js';

// 1:N
User.hasMany(Recipe, { as: 'recipes', foreignKey: 'ownerId' });
Recipe.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

User.hasMany(Testimonial, { as: 'testimonials', foreignKey: 'ownerId' });
Testimonial.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

Category.hasMany(Recipe, { as: 'recipes', foreignKey: 'categoryId' });
Recipe.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' });

Area.hasMany(Recipe, { as: 'recipes', foreignKey: 'areaId' });
Recipe.belongsTo(Area, { as: 'area', foreignKey: 'areaId' });

// M:N (junction tables)
Recipe.belongsToMany(Ingredient, { through: RecipeIngredient, foreignKey: 'recipeId', as: 'ingredients' });
Ingredient.belongsToMany(Recipe, { through: RecipeIngredient, foreignKey: 'ingredientId', as: 'recipes' });

User.belongsToMany(Recipe, { through: Favorite, as: 'favoriteRecipes', foreignKey: 'userId' });
Recipe.belongsToMany(User, { through: Favorite, as: 'usersWhoFavorited', foreignKey: 'recipeId' });

User.belongsToMany(User, { through: Follow, as: 'followers', foreignKey: 'followingId' });
User.belongsToMany(User, { through: Follow, as: 'following', foreignKey: 'followerId' });

export { User, Recipe, Category, Area, Ingredient, Testimonial, Favorite, Follow, RecipeIngredient };
