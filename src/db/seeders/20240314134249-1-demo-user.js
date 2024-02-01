'use strict';
const bcrypt = require('bcrypt');

const { SALT_ROUNDS } = require('../../utils/config');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'User',
      [
        {
          id: 1,
          name: 'User 1',
          phone_number: '9721075430',
          priority: 0,
          password: bcrypt.hashSync('pass@1', SALT_ROUNDS),
          created_at: '2024-01-08T20:00:000',
          updated_at: '2024-01-08T20:00:000',
        },
        {
          id: 2,
          name: 'User 2',
          phone_number: '+919876543210',
          priority: 1,
          password: bcrypt.hashSync('pass@2', SALT_ROUNDS),
          created_at: '2024-01-08T20:00:000',
          updated_at: '2024-01-08T20:00:000',
        },
        {
          id: 3,
          name: 'User 3',
          phone_number: '+919876543211',
          priority: 2,
          password: bcrypt.hashSync('pass@3', SALT_ROUNDS),
          created_at: '2024-01-08T20:00:000',
          updated_at: '2024-01-08T20:00:000',
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('User', null, {});
  },
};
