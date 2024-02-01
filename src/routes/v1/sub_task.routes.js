// Import necessary modules
const express = require('express');
const subTaskController = require('../../controllers/v1/sub_task');
const middlewares = require('../../middlewares');

// Create an instance of Express router
const router = express.Router();

// Define routes

// Route to get all sub-tasks for a specific task
router.get(
  '/get_all_sub_tasks/:task_id', // Route path with parameter
  middlewares.authToken, // Middleware to authenticate the request
  subTaskController.getAllSubTasks // Route handler to get all sub-tasks
);

// Route to create a sub-task for a specific task
router.post(
  '/create/:task_id', // Route path with parameter
  middlewares.authToken, // Middleware to authenticate the request
  subTaskController.createSubTask // Route handler to create a sub-task
);

// Route to update a sub-task
router.patch(
  '/upd/:sub_task_id', // Route path with parameter
  middlewares.authToken, // Middleware to authenticate the request
  subTaskController.updateSubTask // Route handler to update a sub-task
);

// Route to delete a sub-task
router.delete(
  '/del/:sub_task_id', // Route path with parameter
  middlewares.authToken, // Middleware to authenticate the request
  subTaskController.deleteSubTask // Route handler to delete a sub-task
);

// Export the router
module.exports = router;
