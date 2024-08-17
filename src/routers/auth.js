const express = require('express');
const { register } = require('../controllers/auth');
const { validateBody } = require('../middlewares/validateBody');
const { registerSchema } = require('../validationSchemas/authSchemas');
const ctrlWrapper = require('../utils/ctrlWrapper');
const { login } = require('../controllers/auth');
const { loginSchema } = require('../validationSchemas/authSchemas');
const { refreshSession } = require('../controllers/auth');
const { logout } = require('../controllers/auth');

const router = express.Router();

router.post('/auth/register', validateBody(registerSchema), ctrlWrapper(register));
router.post('/auth/login', validateBody(loginSchema), ctrlWrapper(login));
router.post('/auth/refresh', ctrlWrapper(refreshSession));
router.post('/auth/logout', ctrlWrapper(logout));

module.exports = router;