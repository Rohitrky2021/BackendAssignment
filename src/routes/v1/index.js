// Import necessary modules
const express = require('express');

// Import route modules
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const taskRoutes = require('./task.routes');
const subTaskRoutes = require('./sub_task.routes');
const twilioRoutes = require('./twilio.routes');
const callRoutes = require('./call.routes'); // Import call routes

// Create an instance of Express router
const router = express.Router();

// Define routes

// Mount routes for handling calls
router.use('/call', callRoutes);

// Mount routes for user-related operations
router.use('/user', userRoutes);

// Mount routes for authentication
router.use('/auth', authRoutes);

// Mount routes for task-related operations
router.use('/task', taskRoutes);

// Mount routes for sub-task-related operations
router.use('/sub_task', subTaskRoutes);

// Mount routes for Twilio integration
router.use('/twilio', twilioRoutes);

// Export the router
module.exports = router;
