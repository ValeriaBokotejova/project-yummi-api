import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';

const Area = sequelize.define(
  'Area',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { tableName: 'areas', timestamps: false }
);

export default Area;
