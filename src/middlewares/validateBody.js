const createError = require('http-errors');

const validateBody = (schema) => {
  return (req, res, next) => {
    const body = req.body;
    for (const key in schema) {
      if (schema[key] && !schema[key](body[key])) {
        return next(createError(400, `Invalid value for ${key}`));
      }
    }
    next();
  };
};

const createContactSchema = {
  name: (value) => typeof value === 'string' && value.length >= 3 && value.length <= 20,
  phoneNumber: (value) => typeof value === 'string' && value.length >= 3 && value.length <= 20,
  email: (value) => typeof value === 'string' && value.includes('@'),
  isFavourite: (value) => typeof value === 'boolean',
  contactType: (value) => ['work', 'home', 'personal'].includes(value),
};

const updateContactSchema = {
  name: (value) => value === undefined || (typeof value === 'string' && value.length >= 3 && value.length <= 20),
  phoneNumber: (value) => value === undefined || (typeof value === 'string' && value.length >= 3 && value.length <= 20),
  email: (value) => value === undefined || (typeof value === 'string' && value.includes('@')),
  isFavourite: (value) => value === undefined || typeof value === 'boolean',
  contactType: (value) => value === undefined || ['work', 'home', 'personal'].includes(value),
};

module.exports = { validateBody, createContactSchema, updateContactSchema };