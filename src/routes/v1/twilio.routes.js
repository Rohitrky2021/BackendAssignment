// Import necessary modules
const twilioController = require('../../controllers/v1/twilio'); // Import Twilio controller
const express = require('express');

// Create an instance of Express router
const router = express.Router();

// Define routes

// Route to handle inbound voice webhook
router.post('/voice', twilioController.inboundWebhook);

// Route to handle events webhook
router.post('/events', twilioController.eventsWebhook);

// Export the router
module.exports = router;
