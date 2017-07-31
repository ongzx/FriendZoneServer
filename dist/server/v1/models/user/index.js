'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _db = require('../../../../config/db');

var _db2 = _interopRequireDefault(_db);

var _uuidGenerator = require('../../../helpers/uuid-generator');

var _uuidGenerator2 = _interopRequireDefault(_uuidGenerator);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var modelName = 'User';
var tableName = 'Users';

/**
 * User Schema
 */

var User = _db2.default.sequelize.define(modelName, {
    uuid: {
        type: _sequelize2.default.UUID,
        defaultValue: function defaultValue() {
            return _uuidGenerator2.default.generate(tableName);
        },
        primaryKey: true
    },
    firstName: _sequelize2.default.STRING,
    lastName: _sequelize2.default.STRING,
    email: _sequelize2.default.STRING
}, {
    freezeTableName: true
    // classMethods: {
    //     associate: function(models) {
    //         User.belongsToMany(models.User, {
    //             as: "friend",
    //             through: "Friendship"
    //         })
    //     }
    // }
});

exports.default = User;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
