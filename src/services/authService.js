import bcryptjs from 'bcryptjs';
import { User } from '../db/models/index.js';
import { createToken } from '../utils/jwt.js';
import { ValidationError } from '../errors/DomainErrors.js';

const SALT_ROUNDS = 10;

export const registerUser = async userData => {
  const { name, email, password } = userData;

  const hashedPassword = await bcryptjs.hash(password, SALT_ROUNDS);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
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
