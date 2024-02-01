const generate = require('./generate');
const verify = require('./verify');

const jwtHelper = {
  generate,
  verify,
};

module.exports = jwtHelper;
