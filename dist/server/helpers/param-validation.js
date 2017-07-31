'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    addFriend: {
        body: {
            friends: _joi2.default.array().max(2).required()
        }
    },
    updateStatus: {
        body: {
            email: _joi2.default.string().email().required(),
            status: _joi2.default.string().required()
        }
    },
    findFriends: {
        body: {
            email: _joi2.default.string().email().required()
        }
    },
    commonFriends: {
        body: {
            friends: _joi2.default.array().max(2).required()
        }
    },
    subscribe: {
        body: {
            requestor: _joi2.default.string().email().required(),
            target: _joi2.default.string().email().required()
        }
    },
    blockUser: {
        body: {
            requestor: _joi2.default.string().email().required(),
            target: _joi2.default.string().email().required()
        }
    },
    findRecipients: {
        body: {
            sender: _joi2.default.string().email().required(),
            text: _joi2.default.string().required()
        }
    }
};
module.exports = exports['default'];
//# sourceMappingURL=param-validation.js.map
