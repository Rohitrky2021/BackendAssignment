// Import necessary modules and utilities
const { sequelize } = require('../../db/models'); // Import Sequelize instance
const Repository = require('../../repository'); // Import repository module
const { TASK_STATUS } = require('../../utils/status'); // Import task status enums
const logger = require('../../utils/logs'); // Import logger
const { DB_TABLES } = require('../../utils/modelEnums'); // Import database table enums

// Function to update task status based on subtask completion
const updateStatus = async ({ task_id }) => {
  // Begin a transaction
  const t = await sequelize.transaction();
  try {
    // Count completed subtasks
    const [completedCount, completedCountErr] = await Repository.count({
      tableName: DB_TABLES.SUB_TASK,
      query: {
        task_id,
        status: true,
      },
      t,
    });
    if (completedCountErr) {
      await t.rollback(); // Rollback transaction if error occurs
      return [null, completedCountErr]; // Return error message
    }

    // Count all subtasks
    const [allCount, allCountErr] = await Repository.count({
      tableName: DB_TABLES.SUB_TASK,
      query: {
        task_id,
      },
      t,
    });
    if (allCountErr) {
      await t.rollback(); // Rollback transaction if error occurs
      return [null, allCountErr]; // Return error message
    }

    let status = ''; // Initialize status variable

    // Determine task status based on subtask completion
    if (allCount === completedCount) {
      status = TASK_STATUS.DONE; // Set status to 'DONE' if all subtasks are completed
    } else if (completedCount > 0) {
      status = TASK_STATUS.IN_PROGRESS; // Set status to 'IN_PROGRESS' if some subtasks are completed
    }

    // Update task status in the database
    const [updateTask, updateErr] = await Repository.update({
      tableName: DB_TABLES.TASK,
      query: {
        id: task_id,
      },
      updateObject: {
        status,
      },
      t,
    });

    if (updateErr) {
      await t.rollback(); // Rollback transaction if error occurs
      return [null, updateErr]; // Return error message
    }

    await t.commit(); // Commit transaction if all operations succeed
    return [status, null]; // Return updated status
  } catch (err) {
    logger.error(`Error while updating status ${err.message}`); // Log error message
    return [null, err.message]; // Return error message
  }
};

module.exports = updateStatus; // Export updateStatus function
