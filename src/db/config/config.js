import 'dotenv/config';

const config = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || null,
    database: process.env.DB_NAME || 'postgres',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    dialectOptions:
      process.env.DB_SSL === 'true'
        ? {
            ssl: { require: true, rejectUnauthorized: false },
          }
        : {},
  },
  test: {
    username: 'postgres',
    password: null,
    database: 'testdb',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions:
      process.env.DB_SSL === 'true'
        ? {
            ssl: { require: true, rejectUnauthorized: false },
          }
        : {},
  },
};

export default config;
