import { Sequelize } from 'sequelize';

const { DB_HOST, DB_NAME, DB_USER, DB_PASS, DB_PORT, DB_SSL } = process.env;
if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASS || !DB_PORT) {
  throw new Error('Database configuration variables are not set');
}

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: DB_SSL === 'true'
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false, // useful for managed services like Render
        },
      }
    : {},
});

export default sequelize;