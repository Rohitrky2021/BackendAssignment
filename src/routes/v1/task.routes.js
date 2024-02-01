// Import necessary modules
const express = require('express');
const taskController = require('../../controllers/v1/task'); // Import task controller
const middlewares = require('../../middlewares'); // Import middleware functions

// Create an instance of Express router
const router = express.Router();

// Define routes

// Route to get all tasks
router.post(
  '/get_all_tasks', // Route path
  middlewares.authToken, // Middleware to authenticate the request
  taskController.getAllTasks // Route handler to get all tasks
);

// Route to create a new task
router.post(
  '/create', // Route path
  middlewares.authToken, // Middleware to authenticate the request
  taskController.createTask // Route handler to create a task
);

// Route to update a task
router.patch(
  '/upd/:task_id', // Route path with parameter
  middlewares.authToken, // Middleware to authenticate the request
  taskController.updateTask // Route handler to update a task
);

// Route to delete a task
router.delete(
  '/:task_id', // Route path with parameter
  middlewares.authToken, // Middleware to authenticate the request
  taskController.deleteTask // Route handler to delete a task
);

// Export the router
module.exports = router;
