import 'dotenv/config';

function sslDialectOptions(enabled) {
  return enabled
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {};
}

const {
  DATABASE_INTERNAL_URL,
  DATABASE_URL,
  DB_HOST, DB_NAME, DB_USER, DB_PASS, DB_PORT,
  DB_SSL,
} = process.env;

const development = {
  username: DB_USER || 'postgres',
  password: DB_PASS || null,
  database: DB_NAME || 'postgres',
  host: DB_HOST || '127.0.0.1',
  port: Number(DB_PORT || 5432),
  dialect: 'postgres',
  dialectOptions: sslDialectOptions(DB_SSL === 'true'),
};

const test = {
  username: 'postgres',
  password: null,
  database: 'testdb',
  host: '127.0.0.1',
  port: 5432,
  dialect: 'postgres',
};

const production = (() => {
  if (DATABASE_INTERNAL_URL) {
    return {
      use_env_variable: 'DATABASE_INTERNAL_URL',
      dialect: 'postgres',
    };
  }
  if (DATABASE_URL) {
    return {
      use_env_variable: 'DATABASE_URL',
      dialect: 'postgres',
      dialectOptions: sslDialectOptions(true),
    };
  }
  return {
    username: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    host: DB_HOST,
    port: Number(DB_PORT || 5432),
    dialect: 'postgres',
    dialectOptions: sslDialectOptions(DB_SSL === 'true'),
  };
})();

const config = { development, test, production };
export default config;
