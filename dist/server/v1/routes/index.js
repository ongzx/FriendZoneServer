'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fakeDataGenerator = require('../../helpers/fake-data-generator');

var _fakeDataGenerator2 = _interopRequireDefault(_fakeDataGenerator);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

/** GET /health-check - Check service health */
router.get('/health-check', function (req, res) {
    return res.send({
        success: true,
        message: "Server is online."
    });
});

/** GET /seed-users - Generate fake users */
router.get('/seed-users', function (req, res) {
    _fakeDataGenerator2.default.generateFakeUsers().then(function () {
        return res.json({
            success: true,
            message: 'Users are seeded.'
        });
    });
});

router.use('/user', (0, _user2.default)());

module.exports = router;
//# sourceMappingURL=index.js.map
