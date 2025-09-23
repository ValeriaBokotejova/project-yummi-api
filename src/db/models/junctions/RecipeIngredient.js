import { DataTypes } from 'sequelize';
import sequelize from '../../connection.js';

const RecipeIngredient = sequelize.define(
  'RecipeIngredient',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    measure: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { tableName: 'recipe_ingredients', timestamps: false }
);

export default RecipeIngredient;
