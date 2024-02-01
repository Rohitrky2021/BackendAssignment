'use strict';

const { TASK_STATUS } = require('../../utils/enums'); // Import TASK_STATUS enum

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     * This function is called when the migration is applied.
     */

    // Create the 'task' table
    await queryInterface.createTable('task', {
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
          model: 'User', // Referencing 'User' model
          key: 'id', // Referencing 'id' column in 'User' model
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
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: TASK_STATUS.TODO, // Default value from TASK_STATUS enum
      },
      priority: {
        type: Sequelize.INTEGER,
        default: 0, // Default priority value
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        // mark the date only when it is deleted
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     * This function is called when the migration is rolled back.
     */

    // Drop the 'task' table
    await queryInterface.dropTable('task');
  },
};
