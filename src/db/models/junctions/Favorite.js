import { DataTypes } from 'sequelize';
import sequelize from '../../connection.js';

const Favorite = sequelize.define(
  'Favorite',
  {
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
  },
  { tableName: 'favorites', timestamps: false }
);

export default Favorite;
