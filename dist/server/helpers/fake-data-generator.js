'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _uuidGenerator = require('./uuid-generator');

var _uuidGenerator2 = _interopRequireDefault(_uuidGenerator);

var _models = require('../v1/models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateFakeUsers() {
    console.log("Generating fake users...");
    return Promise.resolve(0).then(function loop(i) {
        if (i < 20) {
            return fakeSingleUser().thenReturn(i + 1).then(loop);
        }
    }).then(function () {
        console.log('All users are created successfully.');
    });
}

function fakeSingleUser() {
    var user = {
        firstName: _faker2.default.name.firstName(),
        lastName: _faker2.default.name.lastName(),
        email: _faker2.default.internet.email()
    };

    return _models.User.create(user).then(function (user) {
        console.log('User created.');
    }).catch(function (err) {
        console.log('Error in creating user: ' + err);
    });
}

exports.default = {
    generateFakeUsers: generateFakeUsers
};
module.exports = exports['default'];
//# sourceMappingURL=fake-data-generator.js.map
