'use strict';

const bcrypt = require('bcrypt');

// Packages
const { Model } = require('sequelize');
const { SALT_ROUNDS } = require('../../utils/config');

module.exports = (sequelize, Sequelize) => {
  class User extends Model {
    static associate({ Task }) {
      this.hasMany(Task, { foreignKey: 'user_id' });
    }
  }
  User.init(
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          validateMobile(value) {
            const regexMobile = /^(\+91)?\s?\d{10}$/;
            if (!regexMobile.test(value)) {
              throw new Error('Wrong Phone Number');
            }
          },
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
        set(value) {
          const encryptedPassword = bcrypt.hashSync(value, SALT_ROUNDS);
          this.setDataValue('password', encryptedPassword);
        },
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
      sequelize,
      tableName: 'user',
      modelName: 'User',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return User;
};
