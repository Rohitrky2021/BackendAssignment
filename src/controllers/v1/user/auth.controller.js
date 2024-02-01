const jwtHelper = require('../../../helpers/jwt'); // Import JWT helper
const Repository = require('../../../repository'); // Import repository
const logger = require('../../../utils/logs'); // Import logger utility
const { DB_TABLES } = require('../../../utils/modelEnums'); // Import model enums
const {
  serverErrorResponse,
  unprocessableEntityResponse,
  unauthorizedResponse,
  successResponse,
} = require('../../../utils/response'); // Import response utilities
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

// Login controller function
const login = async (req, res) => {
  try {
    const { phone_number, password } = req.body;

    // Check if phone number and password are provided
    if (!phone_number)
      unprocessableEntityResponse(res, 'phone_number not found');
    if (!password) unprocessableEntityResponse(res, 'password not found');

    // Fetch user from the database based on phone number
    const [user, userErr] = await Repository.fetchOne({
      tableName: DB_TABLES.USER,
      query: { phone_number },
    });

    if (userErr) return serverErrorResponse(res, userErr);

    // Check if user exists
    if (!user) return unauthorizedResponse(res, 'User not found');

    // Compare passwords
    if (!bcrypt.compareSync(password, user.password))
      return unauthorizedResponse(
        res,
        'Password does not match. Kindly retry.'
      );

    // Generate JWT access token
    const accessToken = jwtHelper.generate({
      id: user.id,
      first_name: user.name,
      phone_number: user.phone_number,
    });

    // Remove sensitive information from user object
    delete user.password;
    delete user.created_at;
    delete user.updated_at;

    // Send success response with user data and access token
    return successResponse(res, 'Login successful', { ...user, accessToken });
  } catch (err) {
    // Handle errors
    logger.error(`Error in login user ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

module.exports = {
  login,
};
