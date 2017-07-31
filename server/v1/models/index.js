// User
import User from './user';
import Friendship from './friendship';

import db from '../../../config/db';
import childProcess from 'child_process';

// DO NOT SET dropAndCreateDB to true in PRODUCTION
let dropAndCreateDB = false; // this will auto migrate and seed
let migrateDB = true;
const seedDB = true;

if(process.env.NODE_ENV == 'production') {
	dropAndCreateDB = false;
	migrateDB = true;
}

/**
 * SETTING MODEL RELATIONSHIP
 */


User.belongsToMany(User, {
    as: "friend",
    foreignKey: "userUuid",
    through: "Friendship"
})

User.belongsToMany(User, {
    as: "user",
    foreignKey: "friendUuid",
    through: "Friendship"
})

// User.belongsToMany(User, {
//     as: "followedUser",
//     foreignKey: "userUuid",
//     through: "Followers"
// })


// Friendship.belongsTo(User);
// Friendship.belongsToMany(User, {as: "friend", through: "Friendship"});

// sync
const syncOptions = {
	force: dropAndCreateDB
};

const modelList = [
    User.sync(syncOptions),
    Friendship.sync(syncOptions),
    (function() {
        if (dropAndCreateDB) {
            console.log("Dropping SequelizeMeta and SequelizeData...");

            db.sequelize.query('DROP TABLE SequelizeMeta;', {
				raw: true
			});
			db.sequelize.query('DROP TABLE SequelizeData;', {
				raw: true
			});
        }
    })
]

Promise.all(modelList).then(function (result) {
	db.sequelize.sync(syncOptions).then(function (result) {
		console.log('Database tables created successfully.');

		// run seed function if dropAndCreateDB is true
		if(dropAndCreateDB || migrateDB) {
			console.log('Initializing database migrations and seeds...');

			const exec = childProcess.exec;
			const child1 = exec("sequelize db:migrate", function (error, stdout, stderr) {
				console.log('stdout: ' + stdout);
				console.log('stderr: ' + stderr);
				if (error !== null) {
					console.log('exec error: ' + error);
				}
			});

			child1.on('close', function (code) {
				console.log('Child 1 process exited with exit code ' + code);

				if(code === 0 || dropAndCreateDB) {
					console.log('Database tables migrated successfully.');

					if (dropAndCreateDB || seedDB) {
						const child2 = exec("sequelize db:seed:all", function (error, stdout, stderr) {
							console.log('stdout: ' + stdout);
							console.log('stderr: ' + stderr);
				
							if (error !== null) {
								console.log('exec error: ' + error);
							}
						});

						child2.on('close', function (code) {
							console.log('Child 2 process exited with exit code ' + code);

							if(code === 0) {
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


export default {
    User,
    Friendship,
}