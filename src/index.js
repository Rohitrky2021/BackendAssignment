 
  // Load environment variables from .env file based on NODE_ENV
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });

// Import required modules
const http = require('http');
const app = require('./app');
const logger = require('./utils/logger');
const { sequelize } = require('./db/models');
const registerSchedules = require('./CronLogic');

// Create HTTP server using Express app
const server = http.createServer(app);

// Get port from environment variables
const port = process.env.BACKEND_SERVICE_PORT;

// Get NODE_ENV or default to 'development'
const NODE_ENV = process.env.NODE_ENV || 'development';

// Register scheduled tasks
registerSchedules();

// Synchronize database models with database schema
sequelize
  .sync()
  .then(() => {
    // Log successful database connection
    logger.info('[CONNECTED TO DATABASE]');

    // Start server and listen on specified port
    server.listen(port, () =>
      logger.info(
        `[BACKEND-SERVICE (http) LISTENING ON PORT:${port} ENV:${NODE_ENV}]`
      )
    );
  })
  .catch((err) => {
    // Log error if failed to connect to the database
    logger.error('Failed to connect to db', err);
  });
