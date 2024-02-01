const express = require('express');
const middlewares = require('../../middlewares');
const { userController } = require('../../controllers/v1/user');

const router = express.Router();

// READ
router.get('/', middlewares.authToken, userController.getUser);

// CREATE
router.post('/', userController.createUser);

module.exports = router;
