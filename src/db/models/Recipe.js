import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';

const Recipe = sequelize.define(
  'recipe',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      validate: { len: [0, 200] },
      allowNull: false,
    },
    instructions: {
      type: DataTypes.TEXT,
      validate: { len: [0, 3000] },
      allowNull: false,
    },
    thumbUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { tableName: 'recipes', timestamps: true }
);

export default Recipe;
