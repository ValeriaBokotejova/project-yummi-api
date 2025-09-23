import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';

const Testimonial = sequelize.define(
  'Testimonial',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    testimonial: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { tableName: 'testimonials', timestamps: true }
);

export default Testimonial;
