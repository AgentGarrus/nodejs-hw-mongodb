const bcrypt = require('bcrypt');
const createError = require('http-errors');
const crypto = require('crypto');
const User = require('../models/user');
const Session = require('../models/session');

const generateToken = () => crypto.randomBytes(64).toString('hex');

const registerUser = async (name, email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });

  return {
    id: newUser._id.toString(),
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError(401, 'Invalid email or password');
  }

  const accessToken = generateToken();
  const refreshToken = generateToken();

  await Session.deleteOne({ userId: user._id.toString() });

  const session = await Session.create({
    userId: user._id.toString(),
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken,
    refreshToken,
    sessionId: session._id.toString()
  };
};

const refreshUserSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (!session || session.refreshTokenValidUntil < new Date()) {
    throw createError(401, 'Session not found or refresh token expired');
  }

  await Session.deleteOne({ userId: session.userId });

  const newAccessToken = generateToken();
  const newRefreshToken = generateToken();

  await Session.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};

const logoutUser = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (session) {
    await Session.deleteOne({ _id: session._id });
  }
};

module.exports = { registerUser, loginUser, refreshUserSession, logoutUser };