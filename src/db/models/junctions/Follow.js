import { DataTypes } from 'sequelize';
import sequelize from '../../connection.js';

const Follow = sequelize.define(
  'Follow',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    followerId: { 
      type: DataTypes.STRING,
       allowNull: false
      },
    followingId: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
  },
  { tableName: 'follows', timestamps: false }
);

export default Follow;
