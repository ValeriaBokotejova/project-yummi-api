# JWT Authentication - Backend Implementation

##  **API Endpoints**

###  POST /auth/register
**Реєстрація нового користувача**
`javascript
// Request
{
  "username": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

// Response 201
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-string",
    "name": "John Doe",
    "email": "john@example.com",
    "avatarUrl": null
  }
}
`

###  POST /auth/login
**Аутентифікація користувача**
`javascript
// Request
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

// Response 200
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-string",
    "name": "John Doe",
    "email": "john@example.com",
    "avatarUrl": null
  }
}
`

###  POST /auth/logout
**Вихід користувача (потребує авторизації)**
`javascript
// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response 200
{
  "message": "Logout successful"
}
`

###  GET /auth/current
**Отримання поточного користувача (потребує авторизації)**
`javascript
// Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Response 200
{
  "user": {
    "id": "uuid-string",
    "name": "John Doe", 
    "email": "john@example.com",
    "avatarUrl": null
  }
}
`

##  **Security Features**

### JWT Middleware
- **Token verification**: Перевіряє валідність JWT токену
- **Authorization header**: Очікує формат Bearer <token>
- **Payload extraction**: Додає user info в eq.user

### Password Security
- **bcryptjs hashing**: Безпечне хешування паролів
- **Salt rounds**: 10 rounds для оптимальної безпеки
- **No plain text**: Паролі ніколи не зберігаються відкритим текстом

### Validation
- **Joi schemas**: Валідація input даних на рівні роутів
- **Email format**: Перевірка коректності email
- **Password strength**: Мінімум 8 символів
- **Username length**: Мінімум 3 символи

##  **Architecture**

### Database Model (Sequelize)
`javascript
User {
  id: UUID (Primary Key)
  name: String (Not Null)
  email: String (Not Null, Unique, Email)
  password: String (Not Null, Hashed)
  avatarUrl: String (Nullable)
  createdAt: DateTime
  updatedAt: DateTime
}
`

### Service Layer
- **authService**: Бізнес-логіка аутентифікації
- **User operations**: CRUD операції з користувачами
- **Token management**: Створення та верифікація JWT

### Middleware Stack
- **authenticate**: JWT авторизація
- **validateBody**: Joi валідація запитів
- **errorHandler**: Централізована обробка помилок

##  **Environment Variables**

`ash
# .env file
JWT_SECRET=your-super-secret-key-here
DB_HOST=localhost
DB_PORT=5432
DB_NAME=yummi_db
DB_USER=postgres
DB_PASS=password
`

##  **Error Responses**

### 400 Bad Request
`javascript
{
  "message": "Validation error",
  "details": ["Username is required", "Invalid email format"]
}
`

### 401 Unauthorized
`javascript
{
  "message": "Invalid email or password"
}
// or
{
  "message": "Authorization header is missing"
}
`

### 409 Conflict
`javascript
{
  "message": "Email already in use"
}
`

##  **Frontend Integration**

Цей backend API повністю сумісний з frontend модальними формами:
- **LoginForm**  POST /auth/login
- **RegisterForm**  POST /auth/register  
- **LogoutModal**  POST /auth/logout
- **Auto-refresh**  GET /auth/current

** Готовий до production з повною JWT аутентифікацією!** 
