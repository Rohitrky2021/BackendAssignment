// Import necessary packages
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./utils/logger');

// Create Express application
const app = express();

// Middlewares
// Enable Cross-Origin Resource Sharing (CORS) with default options
app.use(
  cors({
    // origin: ['*'], // Uncomment and specify origins if needed
  })
);

// Set security-related HTTP headers using Helmet
app.use(helmet());

// Parse JSON bodies with a size limit of 50mb
app.use(express.json({ limit: '50mb', extended: true, parameterLimit: 50000 }));

// Parse URL-encoded bodies with a size limit of 50mb
app.use(
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })
);

// Log HTTP requests using Morgan
app.use(morgan('common', { stream: logger.stream }));

// Routes imports
const v1Routes = require('./routes/v1');

// Routes
// Mount version 1 routes under the /v1 path
app.use('/v1', v1Routes);

// Default route handler for root path
app.get('/', (_, res) => {
  res.status(200).send('Backend up and running');
});

module.exports = app;
