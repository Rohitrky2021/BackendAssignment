const cron = require('node-cron');
const Repository = require('../repository');
const { DB_TABLES } = require('../utils/modelEnums');
const { TASK_STATUS } = require('../utils/status');
const { Op } = require('sequelize');
const twilioService = require('../services/twilio');
const globalEvents = require('../events');

// Schedule the cron job to run every minute
var due_calls = cron.schedule('0 0 * * * *', async () => {
  // Find all tasks whose due_date has passed and are still in TODO status
  const [dueTasks, _] = await Repository.fetchAll({
    tableName: DB_TABLES.TASK,
    query: {
      status: TASK_STATUS.TODO,
      due_date: {
        [Op.lt]: Date.now(), // Due date is less than current time
      },
    },
    include: {
      [DB_TABLES.USER]: { attributes: ['name', 'phone_number', 'priority'] }, // Include user details
    },
  });

  // Sort the tasks according to user priority
  dueTasks.sort((a, b) => {
    return a.User.priority - b.User.priority;
  });

  let i = 0;
  // Initiate calls to users for due tasks
  await twilioService.voice.createCall({
    to: dueTasks[i].User.phone_number, // Call the user with the highest priority
  });
  i++;

  // Handle events for call statuses
  globalEvents.on('status:no-answer', async (data) => {
    // If there are more due tasks and the call wasn't answered, initiate the next call
    if (i < dueTasks.length) {
      await twilioService.voice.createCall({
        to: dueTasks[i].User.phone_number, // Call the next user in the sorted list
      });
      i++;
    }
  });

  // Stop working further if the call was answered
  globalEvents.on('status:in-progress', (data) => {
    // Task is in progress, no further action needed
  });
});

module.exports = due_calls;
