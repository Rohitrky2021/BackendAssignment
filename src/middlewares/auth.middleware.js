// Import necessary modules and utilities
const jwtHelper = require('../helpers/jwt');
const Repository = require('../repository');
const logger = require('../utils/logs');
const { DB_TABLES } = require('../utils/modelEnums');
const { unauthorizedResponse } = require('../utils/response');

// Middleware function to verify authentication token
const authToken = async (req, res, next) => {
  try {
    // Extract token from request headers
    let token = req.headers.authorization;

    // Check if token exists
    if (!token) return unauthorizedResponse(res, 'Unauthorized access');

    // Extract token value
    token = token.split(' ')[1];

    // Verify and decode the token
    const decodedToken = await jwtHelper.verify(token);
    const { id } = decodedToken;

    // Fetch user details from the database based on decoded token
    const [user, userErr] = await Repository.fetchOne({
      tableName: DB_TABLES.USER,
      query: {
        id,
      },
    });

    // Check if user exists and there are no errors
    if (!user || userErr)
      return unauthorizedResponse(res, 'Unauthorized access');

    // Attach user details to the request object for further use
    req.user = user;
    next();
  } catch (err) {
    // Log any errors encountered during token verification
    logger.error(`Unable to verify token: ${err}`);

    // Return unauthorized response in case of errors
    return unauthorizedResponse(res, 'Unauthorized access');
  }
};

module.exports = authToken;
