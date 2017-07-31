import Sequelize from 'sequelize';
import db from '../../../../config/db';
import uuidGenerator from '../../../helpers/uuid-generator';
import _ from 'lodash';

const modelName = 'User';
const tableName = 'Users';

/**
 * User Schema
 */

const User = db.sequelize.define(modelName, {
    uuid: {
        type: Sequelize.UUID,
        defaultValue: () => {
            return uuidGenerator.generate(tableName)
        },
        primaryKey: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING
}, {
    freezeTableName: true,
    // classMethods: {
    //     associate: function(models) {
    //         User.belongsToMany(models.User, {
    //             as: "friend",
    //             through: "Friendship"
    //         })
    //     }
    // }
});

export default User;