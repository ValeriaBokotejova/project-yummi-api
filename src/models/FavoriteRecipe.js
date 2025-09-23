import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const FavoriteRecipe = sequelize.define('FavoriteRecipe', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  recipeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'recipes',
      key: 'id',
    },
  },
}, {
  tableName: 'favorite_recipes',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'recipeId'],
    },
  ],
});

export default FavoriteRecipe;