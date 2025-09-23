# Yummi API

A RESTful API backend service for a recipe sharing platform built with Node.js, Express, and PostgreSQL. Users can
create recipes, add recipes to their favorites, and follow other users to discover new culinary content. The project is
designed with a modular architecture for scalability and maintainability.

## 🚀 Features

### Core Functionality

- **Recipe Management**: Create, edit, and share recipes
- **User Favorites**: Add recipes to personal favorites collection
- **Social Following**: Follow other users to discover new recipes
- **User Profiles**: Manage user accounts and preferences

### Technical Features

- **RESTful API** with Express.js
- **PostgreSQL Database** with Sequelize ORM
- **JWT Authentication** system
- **Docker** support for development and deployment
- **API Documentation** with Swagger/OpenAPI
- **Environment-based Configuration**
- **Error Handling** middleware
- **Code Quality** tools (ESLint, Prettier)
- **Health Check** endpoints
- **CORS** enabled
- **Jest Testing Framework** (setup in progress)

## 🏗️ Project Structure

```text
project-yummi-api/
├── src/
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   ├── config/             # Configuration files
│   │   └── swagger.js      # Swagger documentation setup
│   ├── controllers/        # Route controllers
│   │   └── authController.js
│   ├── db/                 # Database configuration
│   │   └── connection.js   # Sequelize database connection
│   ├── docs/               # API documentation
│   ├── middlewares/        # Custom middleware
│   │   └── errorHandler.js # Global error handling
│   ├── routes/             # API routes
│   │   ├── index.js        # Main router
│   │   └── authRouter.js   # Authentication routes
│   ├── schemas/            # Data validation schemas (Joi)
│   ├── services/           # Business logic layer
│   └── utils/              # Utility functions
├── .env.example            # Environment variables template
├── .eslintrc.json          # ESLint configuration
├── .prettierrc.json        # Prettier configuration
├── docker-compose.yml      # Docker services configuration
├── Dockerfile.dev          # Development Docker configuration
└── package.json            # Dependencies and scripts
```

### Architecture Layers

- **Routes Layer** (`/routes`): HTTP request routing and endpoint definitions
- **Controllers Layer** (`/controllers`): Request/response handling and validation
- **Services Layer** (`/services`): Business logic and data processing
- **Database Layer** (`/db`): Database models and connection management
- **Middleware Layer** (`/middlewares`): Cross-cutting concerns (auth, error handling, etc.)

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
# Application
PORT=3000
JWT_SECRET=your_jwt_secret_key

# Database
DB_HOST=localhost
DB_NAME=yummi
DB_USER=your_db_user
DB_PASS=your_db_password
DB_PORT=5432
DB_SSL=false
```

### 4. Database Setup

Make sure PostgreSQL is running and create the database:

```bash
# Using PostgreSQL command line
createdb yummi

# Or using SQL
CREATE DATABASE yummi;
```

### 5. Start Development Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3000`

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
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests
npm run test:coverage  # Run tests with coverage report
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

### Code Quality Tools

- **ESLint**: JavaScript linting and code quality
- **Prettier**: Code formatting
- **EditorConfig**: Consistent editor configuration

Run linting and formatting:

```bash
# Check for linting issues
npm run lint

# Automatically fix linting issues
npm run lint:fix

# Check code formatting
npm run format:check

# Automatically format code
npm run format
```

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

### Database Migrations & Seeding

**Note:** Database migration and seeding setup is currently in development.

Initial database seeding script will be added to populate the database with sample data including:

- Sample users and profiles
- Sample recipes
- User relationships (followers/following)
- Recipe favorites

\*Migration and seeding instructions: **TBD\***

## 🔒 Authentication

The API implements JWT-based authentication:

- **JWT tokens** for stateless authentication
- **Protected routes** via middleware
- **Token-based** user sessions

Authentication endpoints are available under `/api/auth/*`.

## 🧪 Testing

The project is configured with Jest testing framework.

**Current Status**: Jest setup is in progress and will be configured in the next development phase.

When testing is fully configured, use these commands:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Future Testing Strategy

- **Unit Tests**: Controller and service layer testing
- **Integration Tests**: Database and API endpoint testing
- **Authentication Tests**: JWT token validation and protected routes
- **Recipe Management Tests**: CRUD operations for recipes
- **User Interaction Tests**: Following/favorites functionality

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
