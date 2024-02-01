'use strict';

const { Model } = require('sequelize');
// enums
const { TASK_STATUS } = require('../../utils/status');

module.exports = (sequelize, Sequelize) => {
  class Task extends Model {
    static associate({ User, Sub_Task }) {
      this.hasMany(Sub_Task, { foreignKey: 'task_id' });
      this.belongsTo(User, { foreignKey: 'user_id' });
    }
  }
  Task.init(
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: false,
        set(value) {
          const today = new Date();
          const dueDate = new Date(value); // Explicitly convert value to a Date object

          // Extract only the date part
          dueDate.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);

          const timeDifference = dueDate.getTime() - today.getTime();
          const daysDifference = timeDifference / (1000 * 3600 * 24);
          let p = 0;

          if (daysDifference < 0) {
            p = 3; // Due date is in the past
          } else if (daysDifference < 1) {
            p = 0; // Due date is today
          } else if (daysDifference < 2) {
            p = 1; // Due date is tomorrow
          } else if (daysDifference < 4) {
            p = 2; // Due date is between 2-3 days
          } else {
            p = 3; // Due date is more than 3 days
          }
          this.setDataValue('priority', p);
          this.setDataValue('due_date', value);
        },
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: TASK_STATUS.TODO,
      },
      priority: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      deleted_at: {
        // mark the date only when it is deleted
        type: Sequelize.DATE,
      },
    },
    {
      timestamps: true,
      sequelize,
      tableName: 'task',
      modelName: 'Task',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Task;
};
