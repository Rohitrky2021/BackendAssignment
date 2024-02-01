const voice = require('./voice');
const client = require('./client');

const twilioService = {
  voice,
  client,
};

module.exports = twilioService;
