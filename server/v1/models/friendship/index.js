import Sequelize from 'sequelize';
import db from '../../../../config/db';

const modelName = 'Friendship';
const tableName = 'Friendships';

/**
 * Relationship schema
 */

const Friendship = db.sequelize.define(modelName, {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    userUuid: Sequelize.STRING,
    friendUuid: Sequelize.STRING,
    following: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    status: {
        type: Sequelize.STRING,
        defaultValue: 'Accepted'
    }
}, {
    freezeTableName: true,
    // classMethods: {
    //     associate: function(models) {
    //         Friendship.belongsToMany(models.User);
    //         Friendship.belongsToMany(models.User, {as: "friend", foreignKey: "friendUuid"});
    //     }
    // }
})

export default Friendship;