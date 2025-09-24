# Yummi API

A RESTful API backend service for a recipe sharing platform built with Node.js, Express, and PostgreSQL. Users can
create recipes, add recipes to their favorites, and follow other users to discover new culinary content. The project is
designed with a modular architecture for scalability and maintainability.

## 🚀 Features

### Core Functionality

- **Recipe Management**: Create, edit, and share recipes with ingredients and instructions
- **User Favorites**: Add recipes to personal favorites collection
- **Social Following**: Follow other users to discover new recipes
- **User Profiles**: Manage user accounts with avatars and preferences
- **Categorized Content**: Browse recipes by categories (Seafood, Dessert, Vegan, etc.)
- **Regional Cuisines**: Explore recipes from different areas (Italian, Thai, Mexican, etc.)
- **User Testimonials**: Share and view testimonials about recipes

### Technical Features

- **RESTful API** with Express.js
- **PostgreSQL Database** with Sequelize ORM
- **Database Migrations & Seeds** with Sequelize CLI
- **UUID Primary Keys** for all entities
- **Bcrypt Password Hashing** for secure authentication
- **JWT Authentication** system
- **Docker** support for development and deployment
- **API Documentation** with Swagger/OpenAPI
- **Environment-based Configuration**
- **Error Handling** middleware
- **Code Quality** tools (ESLint, Prettier)
- **Health Check** endpoints
- **CORS** enabled
- **Jest Testing Framework** with coverage reports

## 🏗️ Project Structure

```text
project-yummi-api/
├── src/
│   ├── app.js                      # Express app configuration
│   ├── server.js                   # Server entry point
│   ├── config/                     # Configuration files
│   │   └── swagger.js              # Swagger documentation setup
│   ├── controllers/                # Route controllers
│   │   └── authController.js
│   ├── db/                         # Database layer
│   │   ├── connection.js           # Sequelize database connection
│   │   ├── config/
│   │   │   └── config.js           # Database configuration
│   │   ├── migrations/             # Database migrations
│   │   ├── models/                 # Sequelize models
│   │   │   ├── User.js
│   │   │   ├── Recipe.js
│   │   │   ├── Category.js
│   │   │   ├── Area.js
│   │   │   ├── Ingredient.js
│   │   │   ├── Testimonial.js
│   │   │   ├── index.js            # Model associations
│   │   │   └── junctions/          # Junction table models
│   │   │       ├── Favorite.js
│   │   │       ├── Follow.js
│   │   │       └── RecipeIngredient.js
│   │   └── seeders/                # Database seeders
│   ├── docs/                       # API documentation
│   ├── middlewares/                # Custom middleware
│   │   └── errorHandler.js         # Global error handling
│   ├── routes/                     # API routes
│   │   ├── index.js                # Main router
│   │   └── authRouter.js           # Authentication routes
│   ├── schemas/                    # Data validation schemas (Joi)
│   ├── services/                   # Business logic layer
│   └── utils/                      # Utility functions
├── data/                           # Seed data (JSON files)
├── scripts/
│   └── seed-if-empty.js            # Conditional seeding script
├── .sequelizerc                    # Sequelize CLI configuration
├── docker-entrypoint.sh            # Docker startup script
├── .env.example                    # Environment variables template
├── .eslintrc.json                  # ESLint configuration
├── .prettierrc.json                # Prettier configuration
├── docker-compose.yml              # Docker services configuration
├── Dockerfile.dev                  # Development Docker configuration
└── package.json                    # Dependencies and scripts
```

### Architecture Layers

- **Routes Layer** (`/routes`): HTTP request routing and endpoint definitions
- **Controllers Layer** (`/controllers`): Request/response handling and validation
- **Services Layer** (`/services`): Business logic and data processing
- **Database Layer** (`/db`): Database models, migrations, and seeders
- **Middleware Layer** (`/middlewares`): Cross-cutting concerns (auth, error handling, etc.)

### Database Schema

The application uses a normalized PostgreSQL database with the following entities:

- **Users**: User accounts with authentication
- **Recipes**: Recipe content with instructions and metadata
- **Categories**: Recipe categories (Seafood, Dessert, Vegan, etc.)
- **Areas**: Cuisine regions (Italian, Thai, Mexican, etc.)
- **Ingredients**: Ingredient database with descriptions and images
- **Testimonials**: User reviews and testimonials
- **Favorites**: Many-to-many relationship between users and recipes
- **Follows**: Many-to-many relationship for user following
- **RecipeIngredients**: Junction table with ingredient measurements

## 🛠️ Prerequisites

- **Node.js** (v18+ recommended)
- **PostgreSQL** (v12+ recommended)
- **Docker & Docker Compose** (optional, for containerized development)

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project-yummi-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your configuration
```

Required environment variables:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yummi_db
DB_USER=postgres
DB_PASS=your_password
DB_SSL=false

# Application Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration (add when implementing auth)
JWT_SECRET=your_jwt_secret_key
```

### 4. Initial Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL and the application
docker-compose up

# The docker-entrypoint.sh script will automatically:
# 1. Run migrations
# 2. Seed data if tables are empty
# 3. Start the application
```

#### Option B: Local PostgreSQL

```bash
# Ensure PostgreSQL is running and create database
createdb yummi_db

# Run migrations
npx sequelize-cli db:migrate

# Seed the database
npx sequelize-cli db:seed:all

# Start development server
npm run dev
```

## 🗄️ Database Management with Sequelize CLI

This project uses Sequelize CLI for database schema management, migrations, and seeding.

### Configuration

The Sequelize CLI is configured via `.sequelizerc`:

```javascript
const path = require('path');

module.exports = {
  'config': path.resolve('src', 'db', 'config', 'config.js'),
  'models-path': path.resolve('src', 'db', 'models'),
  'seeders-path': path.resolve('src', 'db', 'seeders'),
  'migrations-path': path.resolve('src', 'db', 'migrations')
};
```

### Available Sequelize CLI Commands

```bash
# Migration commands
npx sequelize-cli db:migrate              # Run pending migrations
npx sequelize-cli db:migrate:undo         # Undo last migration
npx sequelize-cli db:migrate:undo:all     # Undo all migrations
npx sequelize-cli db:migrate:status       # Check migration status

# Seeder commands
npx sequelize-cli db:seed:all              # Run all seeders
npx sequelize-cli db:seed:undo             # Undo last seeder
npx sequelize-cli db:seed:undo:all         # Undo all seeders

# Generate new files
npx sequelize-cli migration:generate --name <name>  # Generate new migration
npx sequelize-cli seed:generate --name <name>       # Generate new seeder
```

### Migration Overview

Migrations are executed in chronological order based on timestamps:

1. **20250923200100-create-users.cjs** - Users table with authentication
2. **20250923200200-create-categories.cjs** - Recipe categories
3. **20250923200201-create-areas.cjs** - Cuisine areas/regions
4. **20250923200202-create-ingredients.cjs** - Ingredient database
5. **20250923200203-create-recipes.cjs** - Recipes with foreign keys
6. **20250923200204-create-testimonials.cjs** - User testimonials
7. **20250923200205-create-favorites.cjs** - User favorites junction
8. **20250923200206-create-follows.cjs** - User follows junction
9. **20250923200207-create-recipe-ingredients.cjs** - Recipe-ingredient junction

### Seeder Overview

Seeders populate the database with sample data from `data/` JSON files:

1. **20250923202211-seed-users.cjs** - Sample users with bcrypt-hashed passwords
2. **20250923202219-seed-categories.cjs** - Recipe categories (Seafood, Dessert, etc.)
3. **20250923202226-seed-areas.cjs** - Cuisine areas (Italian, Thai, Mexican, etc.)
4. **20250923202232-seed-ingredients.cjs** - Comprehensive ingredient database
5. **20250923202239-seed-recipes.cjs** - Sample recipes with associations
6. **20250923202245-seed-testimonials.cjs** - User testimonials
7. **20250923202300-seed-recipe-ingredients.cjs** - Recipe-ingredient relationships

### Working with Migrations

#### Creating a New Migration

```bash
# Generate migration file
npx sequelize-cli migration:generate --name add-new-field-to-users

# Edit the generated file in src/db/migrations/
# Implement up() and down() methods
```

#### Migration Best Practices

- **Always provide rollback**: Implement both `up` and `down` methods
- **Use transactions**: Wrap multiple operations in transactions
- **Foreign key constraints**: Define relationships with proper cascade rules
- **UUID primary keys**: Use `gen_random_uuid()` for PostgreSQL UUIDs
- **Timestamps**: Include `createdAt` and `updatedAt` where appropriate

#### Sample Migration Structure

```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('table_name', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      // ... other fields
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('table_name');
  },
};
```

### Working with Seeders

#### Creating a New Seeder

```bash
# Generate seeder file
npx sequelize-cli seed:generate --name demo-users

# Edit the generated file in src/db/seeders/
```

#### Seeder Best Practices

- **Use database-generated UUIDs**: `queryInterface.sequelize.literal('gen_random_uuid()')`
- **Handle relationships**: Resolve foreign keys by querying existing data
- **Provide rollback**: Implement proper `down` method
- **Use sample data**: Reference JSON files in `data/` directory
- **Hash passwords**: Use bcrypt for user passwords

#### Sample Seeder Structure

```javascript
'use strict';

const fs = require('fs');
const path = require('path');

module.exports = {
  async up(queryInterface) {
    const dataPath = path.join(process.cwd(), 'data', 'sample.json');
    const items = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    const records = items.map(item => ({
      id: queryInterface.sequelize.literal('gen_random_uuid()'),
      name: item.name,
      // ... other fields
    }));

    await queryInterface.bulkInsert('table_name', records, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('table_name', null, {});
  },
};
```

### Database Relationships

The database implements the following relationships:

```
Users (1:N) Recipes
Users (1:N) Testimonials
Categories (1:N) Recipes
Areas (1:N) Recipes

Users (M:N) Recipes (via Favorites)
Users (M:N) Users (via Follows)
Recipes (M:N) Ingredients (via RecipeIngredients)
```

### Docker Integration

The Docker setup includes automatic database management:

```bash
# docker-entrypoint.sh automatically:
echo "👉 Running migrations..."
npx sequelize-cli db:migrate

echo "👉 Running seeders if tables empty..."
node scripts/seed-if-empty.js

echo "👉 Starting app..."
exec "$@"
```

### Troubleshooting

#### Database Common Issues

1. **Migration order**: Ensure migrations run in correct dependency order
2. **Foreign key violations**: Check that referenced tables exist first
3. **UUID generation**: Ensure PostgreSQL has `gen_random_uuid()` available
4. **Seeder dependencies**: Run seeders after migrations complete
5. **Environment variables**: Verify database connection settings

#### Reset Database

```bash
# Undo all migrations and seeders
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:seed:undo:all

# Re-run everything
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

#### Check Database Status

```bash
# View migration status
#### Check Database Status

```bash
# View migration status
npx sequelize-cli db:migrate:status

# Connect to database
psql -h localhost -U postgres -d yummi_db
```

## 🐳 Docker Development

### Using Docker Compose (Recommended)

```bash
# Start all services (API + PostgreSQL)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

This will start:

- **API Server** on `http://localhost:3000`
- **PostgreSQL Database** on `localhost:5432`
- **API Documentation** on `http://localhost:3000/docs`

## 📋 Available Scripts

```bash
# Application
npm start              # Start production server
npm run dev            # Start development server with nodemon
npm test               # Run tests
npm run test:coverage  # Run tests with coverage report

# Database operations (using Sequelize CLI directly)
npx sequelize-cli db:migrate                # Run pending migrations
npx sequelize-cli db:migrate:undo           # Undo last migration
npx sequelize-cli db:migrate:undo:all       # Undo all migrations
npx sequelize-cli db:migrate:status         # Check migration status
npx sequelize-cli db:seed:all               # Run all seeders
npx sequelize-cli db:seed:undo              # Undo last seeder
npx sequelize-cli db:seed:undo:all          # Undo all seeders
npx sequelize-cli migration:generate --name # Generate new migration
npx sequelize-cli seed:generate --name      # Generate new seeder

# Code quality
npm run lint           # Check for linting issues
npm run lint:fix       # Automatically fix linting issues
npm run format         # Check code formatting
npm run format:fix     # Automatically format code
```

## 📖 API Documentation

Interactive API documentation is available via Swagger UI:

- **Local**: `http://localhost:3000/docs`
- **Health Check**: `http://localhost:3000/api/health`

### Health Check Response

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 123.45
}
```

## 🔧 Configuration

### Environment Variables

| Variable     | Description         | Default     | Required |
| ------------ | ------------------- | ----------- | -------- |
| `PORT`       | Application port    | `3000`      | No       |
| `JWT_SECRET` | JWT signing secret  | -           | Yes      |
| `DB_HOST`    | Database host       | `localhost` | Yes      |
| `DB_NAME`    | Database name       | -           | Yes      |
| `DB_USER`    | Database user       | -           | Yes      |
| `DB_PASS`    | Database password   | -           | Yes      |
| `DB_PORT`    | Database port       | `5432`      | Yes      |
| `DB_SSL`     | Enable database SSL | `false`     | No       |

## 🗄️ Database

This project uses:

- **PostgreSQL** as the primary database
- **Sequelize** as the ORM
- **Connection pooling** for optimal performance

### Database Connection

The database connection is configured in `src/db/connection.js` and supports:

- SSL connections for production environments
- Connection validation on startup
- Environment-based configuration

## 🔒 Authentication

The API implements JWT-based authentication:

- **JWT tokens** for stateless authentication
- **Protected routes** via middleware
- **Token-based** user sessions

Authentication endpoints are available under `/api/auth/*`.

## 🧪 Testing

The project is configured with Jest testing framework. Use the following commands:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Deployment

### Local Docker Production

```bash
# Build production image
docker build -t yummi-api .

# Run container
docker run -p 3000:3000 --env-file .env yummi-api
```

### Render Deployment

This project is configured for deployment on [Render](https://render.com/).

#### Prerequisites

1. **Render Account**: Create an account at [render.com](https://render.com)
2. **GitHub Repository**: Push your code to GitHub
3. **PostgreSQL Database**: Set up a PostgreSQL database on Render

#### Deployment Steps

1. **Create PostgreSQL Database**
   - Go to Render Dashboard
   - Click "New" → "PostgreSQL"
   - Choose a name (e.g., `yummi-api-db`)
   - Select region and plan
   - Note the connection details

2. **Create Web Service**
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Configure the service:
     - **Name**: `yummi-api`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Node Version**: `18` (or latest LTS)

3. **Environment Variables**

   Set the following environment variables in Render:

   ```bash
   PORT=10000
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   DB_HOST=your_render_postgres_host
   DB_NAME=your_render_postgres_database
   DB_USER=your_render_postgres_user
   DB_PASS=your_render_postgres_password
   DB_PORT=5432
   DB_SSL=true
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy your application
   - Your API will be available at `https://your-service-name.onrender.com`

#### Production Environment Setup

**Important Configuration for Production:**

1. **Database SSL**: Always set `DB_SSL=true` for Render PostgreSQL
2. **JWT Secret**: Use a strong, unique secret (32+ random characters)
3. **Port**: Render automatically assigns the port via `PORT` environment variable
4. **Database Connection**: Use the exact connection details from Render PostgreSQL dashboard

#### Render-Specific Notes

- **Cold Starts**: Free tier services may have cold starts after 15 minutes of inactivity
- **Build Logs**: Monitor deployment in Render dashboard logs
- **Auto-Deploy**: Render automatically redeploys on git pushes to main branch
- **Health Checks**: Use the `/api/health` endpoint for monitoring

## 🤝 Development Workflow

1. **Create Feature Branch**: `git checkout -b feature/your-feature`
2. **Make Changes**: Follow the existing code structure
3. **Test**: Run `npm test` to ensure all tests pass
4. **Lint**: Run ESLint and Prettier checks
5. **Commit**: Use conventional commit messages
6. **Push & PR**: Create pull request for review

## 📁 Adding New Features

### Adding a New Route

1. Create controller in `src/controllers/`
2. Define routes in `src/routes/`
3. Add business logic in `src/services/`
4. Include validation schemas in `src/schemas/`
5. Update API documentation

### Project Conventions

- Use **ES6 modules** (`import/export`)
- Follow **RESTful API** principles
- Implement **proper error handling**
- Add **input validation** for all endpoints
- Write **tests** for new functionality
- Update **API documentation**

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check environment variables in `.env`
   - Ensure database exists

2. **Port Already in Use**
   - Change `PORT` in `.env`
   - Kill existing process: `lsof -ti:3000 | xargs kill`

3. **Module Import Errors**
   - Verify `"type": "module"` in `package.json`
   - Use `.js` extensions in imports
   - Check file paths are correct

## 📄 License

ISC License - see package.json for details.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

For additional questions or support, please refer to the API documentation at `/docs` or create an issue in the
repository.
