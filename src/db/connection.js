import { Sequelize } from 'sequelize';
import 'dotenv/config';

const {
  DATABASE_INTERNAL_URL,
  DATABASE_URL,
  DB_HOST, DB_NAME, DB_USER, DB_PASS, DB_PORT, DB_SSL,
  NODE_ENV
} = process.env;

const isProd = NODE_ENV === 'production';
const logging = !isProd;

function pickConnection() {
  if (DATABASE_INTERNAL_URL) {
    return { url: DATABASE_INTERNAL_URL, useSSL: false };
  }
  if (DATABASE_URL) {
    return { url: DATABASE_URL, useSSL: true };
  }
  if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASS || !DB_PORT) {
    throw new Error('Database configuration variables are not set');
  }
  return {
    url: `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
    useSSL: DB_SSL === 'true',
  };
}

const { url, useSSL } = pickConnection();

const sequelize = new Sequelize(url, {
  dialect: 'postgres',
  logging,
  dialectOptions: useSSL ? { ssl: { require: true, rejectUnauthorized: false } } : {},
});

export default sequelize;
