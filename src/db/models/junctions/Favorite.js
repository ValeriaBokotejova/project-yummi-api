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
      type: DataTypes.STRING, 
      allowNull: false 
    },
    recipeId: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
  },
  { tableName: 'favorites', timestamps: false }
);

export default Favorite;
