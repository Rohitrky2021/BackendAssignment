'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  class Sub_Task extends Model {
    static associate({ Task }) {
      this.belongsTo(Task, { foreignKey: 'task_id' });
    }
  }
  Sub_Task.init(
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      task_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Task',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      deleted_at: {
        // mark the date only when it is deleted
        type: Sequelize.DATE,
      },
    },
    {
      timestamps: true,
      sequelize,
      tableName: 'sub_task',
      modelName: 'Sub_Task',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Sub_Task;
};
