const { Sub_Task, Task, User } = require('../db/models');

const DB_TABLES = { SUB_TASK: 'sub_task', TASK: 'task', USER: 'user' };

const DB_MODELS = {
  sub_task: Sub_Task,
  task: Task,
  user: User,
};

module.exports = { DB_TABLES, DB_MODELS };
