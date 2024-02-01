const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
} = require('../../../utils/config');

const twilioClient = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

module.exports = twilioClient;
