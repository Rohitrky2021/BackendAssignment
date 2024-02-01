// Import the node-cron library
const cron = require('node-cron');

// Import the Repository module to interact with the database
const Repository = require('../repository');

// Define the task_priority_cron cron job
var task_priority_cron = cron.schedule(
  // Define the cron schedule pattern to run the job every second
  '0 0 * * * *',
  // Define the function to execute when the cron job runs
  async () => {
    // Update task priorities based on due dates
    await Repository.runRawUpdateQuery({
      rawQuery: `UPDATE task SET priority = 
        CASE
            WHEN DATE(due_date) = CURRENT_DATE THEN 0
            WHEN DATE(due_date) BETWEEN CURRENT_DATE + INTERVAL 1 DAY AND CURRENT_DATE + INTERVAL 2 DAY THEN 1
            WHEN DATE(due_date) BETWEEN CURRENT_DATE + INTERVAL 3 DAY AND CURRENT_DATE + INTERVAL 4 DAY THEN 2
            WHEN DATE(due_date) > CURRENT_DATE + INTERVAL 4 DAY THEN 3
        END`,
    });
  },
  {
    scheduled: false, // Set the cron job initially to not be scheduled
  }
);

// Export the task_priority_cron cron job for use elsewhere in the application
module.exports = task_priority_cron;
