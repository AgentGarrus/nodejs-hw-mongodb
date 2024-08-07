const createError = require('http-errors');

const validateCreateBody = (req, res, next) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  if (!name || typeof name !== 'string' || name.length < 3 || name.length > 20) {
    return next(createError(400, 'Name must be a string between 3 and 20 characters'));
  }
  if (!phoneNumber || typeof phoneNumber !== 'string' || phoneNumber.length < 3 || phoneNumber.length > 20) {
    return next(createError(400, 'Phone number must be a string between 3 and 20 characters'));
  }
  if (email && (typeof email !== 'string' || !email.includes('@'))) {
    return next(createError(400, 'Invalid email format'));
  }
  if (isFavourite !== undefined && typeof isFavourite !== 'boolean') {
    return next(createError(400, 'isFavourite must be a boolean'));
  }
  if (!contactType || !['work', 'home', 'personal'].includes(contactType)) {
    return next(createError(400, 'Contact type must be one of work, home, personal'));
  }
  next();
};

const validateUpdateBody = (req, res, next) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  if (name && (typeof name !== 'string' || name.length < 3 || name.length > 20)) {
    return next(createError(400, 'Name must be a string between 3 and 20 characters'));
  }
  if (phoneNumber && (typeof phoneNumber !== 'string' || phoneNumber.length < 3 || phoneNumber.length > 20)) {
    return next(createError(400, 'Phone number must be a string between 3 and 20 characters'));
  }
  if (email && (typeof email !== 'string' || !email.includes('@'))) {
    return next(createError(400, 'Invalid email format'));
  }
  if (isFavourite !== undefined && typeof isFavourite !== 'boolean') {
    return next(createError(400, 'isFavourite must be a boolean'));
  }
  if (contactType && !['work', 'home', 'personal'].includes(contactType)) {
    return next(createError(400, 'Contact type must be one of work, home, personal'));
  }
  next();
};

module.exports = { validateCreateBody, validateUpdateBody };