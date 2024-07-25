require('dotenv').config();
const initMongoConnection = require('./db/initMongoConnection');
const setupServer = require('./server');

const startServer = async () => {
  await initMongoConnection();
  setupServer();
};

startServer();