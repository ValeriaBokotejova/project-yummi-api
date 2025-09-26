import bcryptjs from 'bcryptjs';
import { User } from '../db/models/index.js';
import { createToken } from '../utils/jwt.js';
import HttpError from '../utils/HttpError.js';

const SALT_ROUNDS = 10;

export const registerUser = async (userData) => {
  const { username: name, email, password } = userData;

  // Перевіряємо чи користувач вже існує
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new HttpError(409, 'Email already in use');
  }

  // Хешуємо пароль
  const hashedPassword = await bcryptjs.hash(password, SALT_ROUNDS);

  // Створюємо користувача
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Створюємо JWT токен
  const token = createToken({ id: user.id, email: user.email });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
  };
};

export const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Знаходимо користувача за email
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new HttpError(401, 'Invalid email or password');
  }

  // Перевіряємо пароль
  const isPasswordValid = await bcryptjs.compare(password, user.password);
  if (!isPasswordValid) {
    throw new HttpError(401, 'Invalid email or password');
  }

  // Створюємо JWT токен
  const token = createToken({ id: user.id, email: user.email });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
  };
};

export const getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  return user;
};
