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

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });


  await Session.deleteOne({ userId: user._id });
  
  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
};

module.exports = {
  registerUser,
  loginUser,
};