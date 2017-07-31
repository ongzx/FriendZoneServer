'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _db = require('../../../../config/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var modelName = 'Friendship';
var tableName = 'Friendships';

/**
 * Relationship schema
 */

var Friendship = _db2.default.sequelize.define(modelName, {
    id: {
        type: _sequelize2.default.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    userUuid: _sequelize2.default.STRING,
    friendUuid: _sequelize2.default.STRING,
    following: {
        type: _sequelize2.default.BOOLEAN,
        defaultValue: true
    },
    status: {
        type: _sequelize2.default.STRING,
        defaultValue: 'Accepted'
    }
}, {
    freezeTableName: true
    // classMethods: {
    //     associate: function(models) {
    //         Friendship.belongsToMany(models.User);
    //         Friendship.belongsToMany(models.User, {as: "friend", foreignKey: "friendUuid"});
    //     }
    // }
});

exports.default = Friendship;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
