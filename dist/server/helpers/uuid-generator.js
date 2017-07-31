'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generate(tableName) {
    var uuid = "";

    switch (tableName) {
        case 'Users':
            uuid += 'U';
            break;

        case 'Relationships':
            uuid += 'R';
            break;

        case 'Status':
            uuid += 'S';
            break;

        default:
            break;
    }

    return uuid + _nodeUuid2.default.v1().replace(/-/g, "");
}

exports.default = { generate: generate };
module.exports = exports['default'];
//# sourceMappingURL=uuid-generator.js.map
