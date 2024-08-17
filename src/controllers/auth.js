const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/user');
const Session = require('../models/session');

const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(409, 'Email in use'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      }
    });
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    next(createError(500, 'Server error'));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(createError(401, 'Invalid email or password'));
    }

    const accessToken = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '30d' });

    await Session.deleteOne({ userId: user._id.toString() });
    const session = await Session.create({
      userId: user._id.toString(),
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
    res.cookie('sessionId', session._id, { httpOnly: true, secure: true, expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: { accessToken }
    });
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    next(createError(500, 'Server error'));
  }
};

const refreshSession = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    console.error('No refresh token provided');
    return next(createError(401, 'No refresh token provided'));
  }

  try {
    console.log('Received refreshToken:', refreshToken);
    
    // Проверка, что refreshToken существует и валиден
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    console.log('Payload from refreshToken:', payload);

    if (!payload || !payload.id) {
      throw new Error('Invalid token payload');
    }

    // Попытка найти сессию в базе данных
    const session = await Session.findOne({ userId: payload.id.toString(), refreshToken });
    console.log('Found session:', session);

    if (!session) {
      console.error('Session not found for given refresh token');
      return next(createError(401, 'Session not found'));
    }

    // Удаление текущей сессии
    await Session.deleteOne({ userId: payload.id.toString() });

    // Генерация новых токенов
    const newAccessToken = jwt.sign({ id: payload.id.toString() }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ id: payload.id.toString() }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Создание новой сессии
    await Session.create({
      userId: payload.id.toString(),
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // Установка нового refreshToken в cookie
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });

    // Ответ клиенту
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken: newAccessToken }
    });
  } catch (error) {
    console.error('Error refreshing session:', error.message);
    console.error('Stack trace:', error.stack);
    next(createError(401, 'Invalid or expired refresh token'));
  }
};

const logout = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return next(createError(401, 'No refresh token provided'));
  }

  try {
    const session = await Session.findOne({ refreshToken });
    if (session) {
      await Session.deleteOne({ _id: session._id });
    }

    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    res.status(204).send();
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    next(createError(500, 'Server error'));
  }
};

module.exports = { register, login, refreshSession, logout };