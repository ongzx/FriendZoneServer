'use strict';

var faker = require('faker');
var moment = require('moment-timezone');
var Uuid = require('node-uuid');

var numUsers = 10;

module.exports = {
  up: function up(queryInterface, Sequelize) {

    var userArr = [];

    for (var i = 0; i < numUsers; i++) {
      userArr.push({
        uuid: 'U' + Uuid.v1().replace(/-/g, ""),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      });
    }

    return queryInterface.bulkInsert('User', userArr, {});
  },

  down: function down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('User', null, {});
  }
};
//# sourceMappingURL=20170727084810-seed-user.js.map
