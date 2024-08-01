const express = require('express');
const cors = require('cors');
const pino = require('pino-http')();
const contactsRouter = require('./routers/contacts');
const errorHandler = require('./middlewares/errorHandler.js');
const notFoundHandler = require('./middlewares/notFoundHandler');

const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(pino);
  app.use(express.json());

  app.use('/api', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

module.exports = setupServer;