const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const pino = require('pino-http')();
const contactsRouter = require('./routers/contacts');
const authRouter = require('./routers/auth');
const errorHandler = require('./middlewares/errorHandler');
const notFoundHandler = require('./middlewares/notFoundHandler');
const authenticate = require('./middlewares/authenticate');

const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(cookieParser());
  app.use(pino);
  app.use(express.json());

  app.use('/auth', authRouter);
  app.use('/contacts', authenticate, contactsRouter);
  
  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

module.exports = setupServer;