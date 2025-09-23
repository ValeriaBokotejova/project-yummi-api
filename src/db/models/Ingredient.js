import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';

const Ingredient = sequelize.define(
  'Ingredient',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.TEXT,
    },
    imgUrl: {
      type: DataTypes.STRING,
    },
  },
  { tableName: 'ingredients', timestamps: false }
);

export default Ingredient;
