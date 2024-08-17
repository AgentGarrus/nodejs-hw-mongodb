const bcrypt = require('bcrypt');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Session = require('../models/session');

/**
 * Реєструє нового користувача
 * @param {string} name - Ім'я користувача
 * @param {string} email - Email користувача
 * @param {string} password - Пароль користувача
 * @returns {Object} - Дані створеного користувача
 * @throws {Error} - Помилка реєстрації, якщо email вже використовується
 */
const registerUser = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };
};

/**
 * Аутентифікує користувача
 * @param {string} email - Email користувача
 * @param {string} password - Пароль користувача
 * @returns {Object} - Дані користувача та згенеровані токени
 * @throws {Error} - Помилка аутентифікації, якщо email або пароль невірний
 */
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError(401, 'Invalid email or password');
  }

  const accessToken = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '30d' });

  await Session.deleteOne({ userId: user._id.toString() });

  const Session = await Session.create({
    userId: user._id.toString(),
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

export const findUserByEmail = (email) => User.findOne({ email });

export const setupSession = async (userId) => {
  await Session.deleteOne({ userId });
  return await Session.create({ userId, ...createNewSession() });
};

export const createNewSession = () => {
  const accessToken = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: '30d' });
  const accessTokenValidUntil = Date.now() + 1000 * 60 * 15;
  const refreshTokenValidUntil = Date.now() + 1000 * 60 * 60 * 24 * 30;
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const setupCookies = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};

module.exports = {
  registerUser,
  loginUser,
};