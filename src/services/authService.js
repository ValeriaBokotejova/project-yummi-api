import bcryptjs from 'bcryptjs';
import { User } from '../db/models/index.js';
import { createToken } from '../utils/jwt.js';
import { ValidationError, NotFoundError } from '../errors/DomainErrors.js';

const SALT_ROUNDS = 10;

export const registerUser = async userData => {
  const { name, email, password } = userData;

  const hashedPassword = await bcryptjs.hash(password, SALT_ROUNDS);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  };
};

export const loginUser = async payload => {
  const { email, password } = payload;
  const user = await User.findOne({ where: { email: email.toLowerCase() } });
  if (!user) throw new ValidationError('Email or password is wrong');

  const passwordMatch = await bcryptjs.compare(password, user.password);
  if (!passwordMatch) throw new ValidationError('Email or password is wrong');

  const tokenPayload = { id: user.id, email: user.email, name: user.name };
  const token = createToken(tokenPayload);

  user.token = token;
  await user.save();

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
  };
};

export const getUserById = async userId => {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    throw new NotFoundError('User');
  }

  return user;
};
