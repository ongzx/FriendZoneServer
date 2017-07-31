'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _env = require('./env');

var _env2 = _interopRequireDefault(_env);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// connect to mariadb
var dbPassword = null;

switch (process.env.NODE_ENV) {
    case 'local':
        console.log("LOCAL! ");
        dbPassword = process.env.DB_PASSWORD_MARIADB_LOCAL;
        break;
    case 'development':
        console.log("DEVELOPMENT! ");
        dbPassword = process.env.DB_PASSWORD_MARIADB_DEV;
        break;
    case 'staging':
        dbPassword = process.env.DB_PASSWORD_MARIADB_STAGING;
        break;
    case 'production':
        dbPassword = process.env.DB_PASSWORD_MARIADB_PRODUCTION;
        break;
    default:
        dbPassword = process.env.DB_PASSWORD_MARIADB_LOCAL;
        break;
}

console.log("CONFIG");
console.log(_env2.default);

var sequelize = new _sequelize2.default(_env2.default.db_name_mariadb, process.env.DB_USER_MARIADB, dbPassword, {
    host: _env2.default.db_host_mariadb,
    dialect: _env2.default.db_dialect_mariadb,
    port: _env2.default.db_port_mariadb
});

sequelize.authenticate().then(function (error) {
    console.log('Sequelize connection has been established succesfully.');
}, function (error) {
    console.log('Unable to connect to database. ', error);
});

exports.default = { sequelize: sequelize };
module.exports = exports['default'];
//# sourceMappingURL=db.js.map
