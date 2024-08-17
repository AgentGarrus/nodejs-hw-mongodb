const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const Session = require('../models/session');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createError(401, 'Authentication required'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const session = await Session.findOne({
      userId: payload.id,
      accessToken: token,
      accessTokenValidUntil: { $gt: new Date() }
    });

    if (!session) {
      return next(createError(401, 'Access token expired'));
    }

    req.user = { _id: payload.id };
    next();
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return next(createError(401, 'Invalid access token'));
  }
};

module.exports = authenticate;