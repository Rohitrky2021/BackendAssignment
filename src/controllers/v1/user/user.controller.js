const Repository = require('../../../repository'); // Import repository
const logger = require('../../../utils/logs'); // Import logger utility
const { DB_TABLES } = require('../../../utils/modelEnums'); // Import model enums
const {
  successResponse,
  serverErrorResponse,
  unprocessableEntityResponse,
  createdSuccessResponse,
} = require('../../../utils/response'); // Import response utilities

// Controller function to create a new user
const createUser = async (req, res) => {
  try {
    const { name, phone_number, password } = req.body;

    // Check if all required fields are provided
    if (!name || !phone_number || !password)
      return unprocessableEntityResponse(res, 'Please send proper values');

    // Create a new user in the database
    const [user, userErr] = await Repository.create({
      tableName: DB_TABLES.USER,
      createObject: {
        name,
        phone_number,
        password,
      },
    });

    // Handle errors if any
    if (userErr) return serverErrorResponse(res, userErr);

    // Send success response with created user data
    return createdSuccessResponse(res, 'Successfully created user', user);
  } catch (err) {
    // Handle internal server errors
    logger.error(`Error in creating user ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

// Controller function to get user details
const getUser = async (req, res) => {
  try {
    // Remove sensitive information from the user object before sending the response
    delete req.user.password;
    delete req.user.created_at;
    delete req.user.updated_at;

    // Send success response with user data
    return successResponse(res, 'User fetched successfully', req.user);
  } catch (err) {
    // Handle internal server errors
    logger.error(`Error in getting user details ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

module.exports = {
  createUser,
  getUser,
};
