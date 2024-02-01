// Import necessary configurations, logger, and Twilio client
const {
  TWILIO_PHONE_NUMBER,
  DEPLOYED_BACKEND_HOST,
} = require('../../../utils/config');
const logger = require('../../../utils/logs');
const twilioClient = require('../client');

// Define a function to create a Twilio call
const createCall = async ({ to }) => {
  try {
    // Use Twilio client to create a call
    const call = await twilioClient.calls.create({
      url: 'http://demo.twilio.com/docs/voice.xml', // URL for TwiML document
      to: to, // Recipient's phone number
      from: TWILIO_PHONE_NUMBER, // Twilio phone number
      statusCallback: `${DEPLOYED_BACKEND_HOST}/v1/twilio/events`, // Callback URL for call events
      statusCallbackMethod: 'POST', // HTTP method for callback
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'], // Call events to be monitored
    });

    // Return the created call and no error
    return [call, null];
  } catch (err) {
    // Log and return error if call creation fails
    logger.error(`Error while creating call ${err.message}`);
    return [null, err.message];
  }
};

// Export the createCall function
module.exports = { createCall };
