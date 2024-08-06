const mongoose = require('mongoose');
const createError = require('http-errors');

const isValidId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.contactId)) {
    return next(createError(400, 'Invalid ID format'));
  }
  next();
};

module.exports = isValidId;