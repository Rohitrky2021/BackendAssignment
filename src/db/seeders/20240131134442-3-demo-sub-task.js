'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Sub_Task',
      [
        {
          id: 1,
          task_id: 1,
          created_at: '2024-01-08T22:00:000',
          updated_at: '2024-01-08T22:00:000',
        },
        {
          id: 2,
          task_id: 1,
          created_at: '2024-01-08T22:00:000',
          updated_at: '2024-01-08T22:00:000',
        },
        {
          id: 3,
          task_id: 2,
          created_at: '2024-01-08T22:00:000',
          updated_at: '2024-01-08T22:00:000',
        },
        {
          id: 4,
          task_id: 2,
          created_at: '2024-01-08T22:00:000',
          updated_at: '2024-01-08T22:00:000',
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Sub_Task', null, {});
  },
};
