const globalEvents = require('../../../events'); // Import global event emitter
const logger = require('../../../utils/logs'); // Import logger utility
const {
  serverErrorResponse,
  successResponse,
} = require('../../../utils/response'); // Import response utilities

const VoiceResponse = require('twilio').twiml.VoiceResponse; // Import Twilio VoiceResponse module

// Handle inbound webhook from Twilio
const inboundWebhook = async (req, res) => {
  // Create a new Twilio VoiceResponse
  const twiml = new VoiceResponse();

  // Add a message to the Twilio response
  twiml.say('Hello from your pals at Twilio! Have fun.');

  // Send the Twilio response as XML
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
};

// Handle events webhook from Twilio
const eventsWebhook = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { To, From, CallSid, CallStatus } = req.body;

    // Emit global event based on the CallStatus received from Twilio
    globalEvents.emit(`status:${CallStatus}`, CallStatus);

    // Return success response indicating event received
    return successResponse(res, 'Event received');
  } catch (err) {
    // Handle error if occurred during event handling
    logger.error(`Error in events webhook ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

// Export Twilio controller functions
const twilioController = {
  inboundWebhook,
  eventsWebhook,
};
module.exports = twilioController;
