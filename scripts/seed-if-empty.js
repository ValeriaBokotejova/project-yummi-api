import sequelize from '../src/db/connection.js';

async function run() {
  const [results] = await sequelize.query('SELECT COUNT(*)::int AS count FROM "users";');
  if (results[0].count === 0) {
    console.log('👉 Seeding database (tables are empty)...');
    const { spawn } = await import('child_process');
    spawn('npx', ['sequelize-cli', 'db:seed:all'], { stdio: 'inherit' });
  } else {
    console.log('✅ Database already seeded, skipping...');
  }
  await sequelize.close();
}

run();
