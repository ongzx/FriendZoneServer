'use strict';
let faker = require('faker');
let moment = require('moment-timezone');
let Uuid = require('node-uuid');

const numUsers = 10;

module.exports = {
  up: function (queryInterface, Sequelize) {

    let userArr = [];

    for (let i = 0; i < numUsers; i++) {
      userArr.push({
        uuid: 'U'+Uuid.v1().replace(/-/g, ""),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      })
    }

    return queryInterface.bulkInsert('User', userArr, {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('User', null, {});
  }
};
