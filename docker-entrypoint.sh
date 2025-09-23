#!/bin/sh
set -e

echo "👉 Running migrations..."
npx sequelize-cli db:migrate

echo "👉 Running seeders if tables empty..."
node scripts/seed-if-empty.js

echo "👉 Starting app..."
exec "$@"