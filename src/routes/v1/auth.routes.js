// Import necessary modules
const express = require('express');
const { authController } = require('../../controllers/v1/user');

// Create an instance of Express router
const router = express.Router();

// Define routes

// Route for user login
router.post('/', authController.login);

// Export the router
module.exports = router;
