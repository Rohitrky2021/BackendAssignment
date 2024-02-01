const taskHelper = require('../../../helpers/task'); // Import task helper functions
const Repository = require('../../../repository'); // Import repository functions
const logger = require('../../../utils/logs'); // Import logger utility
const { DB_TABLES } = require('../../../utils/modelEnums'); // Import database table enums
const {
  serverErrorResponse,
  successResponse,
} = require('../../../utils/response'); // Import response utilities

// Create a new subtask
const createSubTask = async (req, res) => {
  try {
    const { task_id } = req.params; // Extract task ID from request parameters

    // Create a new subtask in the database
    const [subt, subtErr] = await Repository.create({
      tableName: DB_TABLES.SUB_TASK,
      createObject: {
        task_id,
      },
    });

    // Handle error if occurred during subtask creation
    if (subtErr) return serverErrorResponse(res, subtErr);

    // Return success response with the created subtask
    return successResponse(res, 'SubTask created successfully', subt);
  } catch (err) {
    logger.error(`Error in creating task ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

// Get all subtasks associated with a task
const getAllSubTasks = async (req, res) => {
  try {
    const { task_id } = req.params; // Extract task ID from request parameters

    // Fetch all subtasks from the database associated with the given task ID
    const [subTasks, subtasksErr] = await Repository.fetchAll({
      tableName: DB_TABLES.SUB_TASK,
      query: {
        task_id,
        deleted_at: null,
      },
    });

    // Handle error if occurred during fetching subtasks
    if (subtasksErr) return serverErrorResponse(res, subtasksErr);

    // Return success response with the fetched subtasks
    return successResponse(res, 'SubTasks fetched successfully', subTasks);
  } catch (err) {
    logger.error(`Error while fetching subtasks ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

// Update a subtask
const updateSubTask = async (req, res) => {
  try {
    const { sub_task_id } = req.params; // Extract subtask ID from request parameters
    const { status } = req.body; // Extract updated status from request body

    // Update the subtask status in the database
    const [updateRes, updateErr] = await Repository.update({
      tableName: DB_TABLES.SUB_TASK,
      query: { id: sub_task_id },
      updateObject: {
        status,
      },
    });

    // Handle error if occurred during subtask update
    if (updateErr) return serverErrorResponse(res, updateErr);

    // Update the status of associated task using task helper function
    const [_, taskUpdateErr] = await taskHelper.updateStatus({ task_id });

    // Handle error if occurred during task status update
    if (taskUpdateErr) return serverErrorResponse(res, taskUpdateErr);

    // Return success response with the updated subtask
    return successResponse(res, 'Sub Task updated successfully', updateRes);
  } catch (err) {
    logger.error(`Error while updating Sub Task ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

// Delete a subtask
const deleteSubTask = async (req, res) => {
  try {
    const { sub_task_id } = req.params; // Extract subtask ID from request parameters

    // Soft delete the subtask by marking deleted_at timestamp in the database
    const [_, deleteErr] = await Repository.update({
      tableName: DB_TABLES.SUB_TASK,
      query: {
        id: sub_task_id,
      },
      updateObject: {
        deleted_at: Date.now(),
      },
    });

    // Handle error if occurred during subtask deletion
    if (deleteErr) return serverErrorResponse(res, deleteErr);

    // Return success response after deleting the subtask
    return successResponse(res, 'Sub Task Deleted Successfully');
  } catch (err) {
    logger.error(`Error while deleting sub task ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

// Export subtask controller object containing controller functions
const subTaskController = {
  createSubTask,
  getAllSubTasks,
  updateSubTask,
  deleteSubTask,
};

module.exports = subTaskController;
