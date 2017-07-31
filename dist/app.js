'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _env = require('./config/env');

var _env2 = _interopRequireDefault(_env);

var _express = require('./config/express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = _http2.default.Server(_express2.default);

// listen on port config.port
server.listen(_env2.default.port, function () {
	console.log('server started on port ' + _env2.default.port + ' (' + _env2.default.env + ')');
});

exports.default = server;
module.exports = exports['default'];
//# sourceMappingURL=app.js.map
