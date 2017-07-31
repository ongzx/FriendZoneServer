'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _env = require('./env');

var _env2 = _interopRequireDefault(_env);

var _routes = require('../server/v1/routes');

var _routes2 = _interopRequireDefault(_routes);

var _apiError = require('../server/helpers/api-error');

var _apiError2 = _interopRequireDefault(_apiError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

if (_env2.default.env === 'production' || _env2.default.env === 'development') {
	app.use((0, _morgan2.default)('combined'));
} else {
	app.use((0, _morgan2.default)('dev'));
}

app.use(_express2.default.static('public')); // for static assets
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use((0, _cookieParser2.default)());
app.use((0, _compression2.default)());

// disable 'X-Powered-By' header in response
app.disable('x-powered-by');

// enable CORS - Cross Origin Resource Sharing
app.use((0, _cors2.default)());

app.use('/api', _routes2.default);

// if error is not an instanceOf APIError, convert it.
app.use(function (err, req, res, next) {
	if (err instanceof _expressValidation2.default.ValidationError) {
		// validation error contains errors which is an array of error each containing message[]
		var unifiedErrorMessage = err.errors.map(function (error) {
			return error.messages.join('. ');
		}).join(' and ');
		var error = new _apiError2.default(unifiedErrorMessage, err.status, true);
		return next(error);
	} else if (!(err instanceof _apiError2.default)) {
		var apiError = new _apiError2.default(err.message, err.status, err.isPublic);
		return next(apiError);
	}
	return next(err);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new _apiError2.default('API not found', _httpStatus2.default.NOT_FOUND);
	return next(err);
});

// error handler, send stacktrace only during development
app.use(function (err, req, res, next) {
	return (// eslint-disable-line no-unused-vars
		res.status(err.status).json({
			success: false,
			message: err.isPublic ? err.message : _httpStatus2.default[err.status],
			stack: _env2.default.env === 'development' ? err.stack : {}
		})
	);
});

exports.default = app;
module.exports = exports['default'];
//# sourceMappingURL=express.js.map
