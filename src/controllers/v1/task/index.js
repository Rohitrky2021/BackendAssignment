const { sequelize } = require('../../../db/models'); // Import sequelize instance
const Repository = require('../../../repository'); // Import repository functions
const { TASK_STATUS } = require('../../../utils/status'); // Import task status enums
const logger = require('../../../utils/logs'); // Import logger utility
const { DB_TABLES } = require('../../../utils/modelEnums'); // Import database table enums
const {
  unprocessableEntityResponse,
  serverErrorResponse,
  successResponse,
  createdSuccessResponse,
} = require('../../../utils/response'); // Import response utilities

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, due_date } = req.body; // Extract task details from request body

    // Validate if title and due_date are provided
    if (!title)
      return unprocessableEntityResponse(
        res,
        'Please provide a title for task'
      );
    if (!due_date)
      return unprocessableEntityResponse(
        res,
        'Please provide a proper due date'
      );

    const { id } = req.user; // Extract user ID from request user object

    // Create a new task in the database
    const [task, taskErr] = await Repository.create({
      tableName: DB_TABLES.TASK,
      createObject: {
        title,
        description,
        due_date,
        user_id: id,
      },
    });

    // Handle error if occurred during task creation
    if (taskErr) return serverErrorResponse(res, 'Error while creating task');

    // Return success response with the created task
    return createdSuccessResponse(res, 'Task created successfully', task);
  } catch (err) {
    logger.error(`Error in creating task ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

// Get all tasks associated with the user
const getAllTasks = async (req, res) => {
  try {
    const { id } = req.user; // Extract user ID from request user object
    const { priority, due_date, page, limit } = req.body; // Extract filter criteria from request body

    const extraparams = {};
    if (priority) extraparams.priority = priority;
    if (due_date) extraparams.due_date = due_date;

    // Fetch all tasks from the database associated with the user ID and filter criteria
    const [tasks, tasksErr] = await Repository.fetchAll({
      tableName: DB_TABLES.TASK,
      query: { user_id: id, deleted_at: null, ...extraparams },
      extras: {
        offset: (page - 1) * limit,
        limit,
      },
    });

    // Handle error if occurred during fetching tasks
    if (tasksErr) return serverErrorResponse(res, tasksErr);

    // Return success response with the fetched tasks and data
    return successResponse(res, 'Tasks Fetched successfully', { tasks });
  } catch (err) {
    logger.error(`Error while fetching all tasks ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

// Export task controller functions
module.exports = {
  createTask,
  getAllTasks,
};

const updateTask = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { status, due_date } = req.body;

    let updateObject = {};
    if (status) updateObject.status = status;
    if (due_date) updateObject.due_date = due_date;

    const [updatedTask, updateErr] = await Repository.update({
      tableName: DB_TABLES.TASK,
      query: {
        id: task_id,
      },
      updateObject: updateObject,
    });

    if (updateErr) return serverErrorResponse(res, 'Error while updating task');

    return successResponse(res, 'Task updated successfuly', updatedTask);
  } catch (err) {
    logger.error(`Error in updating task ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const deleteTask = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    //soft deletion
    const { task_id } = req.params;

    const [_, updateErr] = await Repository.update({
      tableName: DB_TABLES.TASK,
      query: {
        id: task_id,
      },
      updateObject: {
        deleted_at: Date.now(),
        status: TASK_STATUS.DONE,
      },
      t,
    });
    if (updateErr) {
      await t.rollback();
      return serverErrorResponse(res, 'Error while deleting a tasks');
    }

    const [updateSubTasksCount, updateSubTaskErr] = await Repository.update({
      tableName: DB_TABLES.SUB_TASK,
      query: {
        task_id,
      },
      updateObject: {
        deleted_at: Date.now(),
      },
      t,
    });
    if (updateSubTaskErr) {
      await t.rollback();
      return serverErrorResponse(res, 'Error while deleting subtasks');
    }
    await t.commit();
    return successResponse(res, 'Task Deleted Successfuly');
  } catch (err) {
    logger.error(`Error while deleting task ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const taskController = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
};

module.exports = taskController;
