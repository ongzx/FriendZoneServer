'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    /**
     * POST /api/user/
     * retrieve list of users
     */
    router.route('/').post(_user2.default.list);

    /**
     * POST /api/user/
     * establish relationship between 2 users
     * params: 
     * { friends: [ email1, email2 ] }
     */
    router.route('/addFriend').post((0, _expressValidation2.default)(_paramValidation2.default.addFriend), _user2.default.addFriend);

    // router.route('/updateStatus')
    //     .put(
    //         validate(paramValidation.updateStatus),
    //         userCtrl.updateStatus
    //     );

    router.route('/findFriends').post((0, _expressValidation2.default)(_paramValidation2.default.findFriends), _user2.default.findFriends);

    router.route('/commonFriends').post((0, _expressValidation2.default)(_paramValidation2.default.commonFriends), _user2.default.commonFriends);

    router.route('/subscribe').post((0, _expressValidation2.default)(_paramValidation2.default.subscribe), _user2.default.subscribe);

    router.route('/blockUser').post((0, _expressValidation2.default)(_paramValidation2.default.blockUser), _user2.default.blockUser);

    router.route('/findRecipients').post((0, _expressValidation2.default)(_paramValidation2.default.findRecipients), _user2.default.findRecipients);

    return router;
};

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

var _user = require('../controllers/user');

var _user2 = _interopRequireDefault(_user);

var _paramValidation = require('../../helpers/param-validation');

var _paramValidation2 = _interopRequireDefault(_paramValidation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

module.exports = exports['default'];
//# sourceMappingURL=user.js.map
