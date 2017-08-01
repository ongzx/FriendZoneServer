'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _friendship = require('./friendship');

var _friendship2 = _interopRequireDefault(_friendship);

var _db = require('../../../config/db');

var _db2 = _interopRequireDefault(_db);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// DO NOT SET dropAndCreateDB to true in PRODUCTION
// User
var dropAndCreateDB = false; // this will auto migrate and seed
var migrateDB = true;
var seedDB = false;

if (process.env.NODE_ENV == 'production') {
	dropAndCreateDB = false;
	migrateDB = true;
}

/**
 * SETTING MODEL RELATIONSHIP
 */

_user2.default.belongsToMany(_user2.default, {
	as: "friend",
	foreignKey: "userUuid",
	through: "Friendship"
});

_user2.default.belongsToMany(_user2.default, {
	as: "user",
	foreignKey: "friendUuid",
	through: "Friendship"
});

// User.belongsToMany(User, {
//     as: "followedUser",
//     foreignKey: "userUuid",
//     through: "Followers"
// })


// Friendship.belongsTo(User);
// Friendship.belongsToMany(User, {as: "friend", through: "Friendship"});

// sync
var syncOptions = {
	force: dropAndCreateDB
};

var modelList = [_user2.default.sync(syncOptions), _friendship2.default.sync(syncOptions), function () {
	if (dropAndCreateDB) {
		console.log("Dropping SequelizeMeta and SequelizeData...");

		_db2.default.sequelize.query('DROP TABLE SequelizeMeta;', {
			raw: true
		});
		_db2.default.sequelize.query('DROP TABLE SequelizeData;', {
			raw: true
		});
	}
}];

Promise.all(modelList).then(function (result) {
	_db2.default.sequelize.sync(syncOptions).then(function (result) {
		console.log('Database tables created successfully.');

		// run seed function if dropAndCreateDB is true
		if (dropAndCreateDB || migrateDB) {
			console.log('Initializing database migrations and seeds...');

			var exec = _child_process2.default.exec;
			var child1 = exec("sequelize db:migrate", function (error, stdout, stderr) {
				console.log('stdout: ' + stdout);
				console.log('stderr: ' + stderr);
				if (error !== null) {
					console.log('exec error: ' + error);
				}
			});

			child1.on('close', function (code) {
				console.log('Child 1 process exited with exit code ' + code);

				if (code === 0 || dropAndCreateDB) {
					console.log('Database tables migrated successfully.');

					if (dropAndCreateDB || seedDB) {
						var child2 = exec("sequelize db:seed:all", function (error, stdout, stderr) {
							console.log('stdout: ' + stdout);
							console.log('stderr: ' + stderr);

							if (error !== null) {
								console.log('exec error: ' + error);
							}
						});

						child2.on('close', function (code) {
							console.log('Child 2 process exited with exit code ' + code);

							if (code === 0) {
								console.log('Database tables seeded successfully.');
							}
						});
					}
				}
			});
		}
	});
}).catch(function (err) {
	console.log('An error occurred while syncing the models:', err);
});

exports.default = {
	User: _user2.default,
	Friendship: _friendship2.default
};
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
