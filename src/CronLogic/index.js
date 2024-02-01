// Import the cron jobs
const due_calls = require('./due_calls'); // Cron job for handling due tasks
const task_priority_cron = require('./task_priority'); // Cron job for managing task priorities

// Function to register and start the cron jobs
const registerSchedules = () => {
  // Start the task priority cron job
  task_priority_cron.start();
  
  // Start the due calls cron job
  due_calls.start();
};

// Export the registerSchedules function for use elsewhere in the application
module.exports = registerSchedules;
