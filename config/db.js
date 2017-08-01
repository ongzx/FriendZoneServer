import Sequelize from 'sequelize';
import config from './env';
import bluebird from 'bluebird';

// connect to mariadb
let dbPassword = null;

switch (process.env.NODE_ENV) {
    case 'local':
        dbPassword = process.env.DB_PASSWORD_MARIADB_LOCAL;
        break;
    case 'development':
        dbPassword = process.env.DB_PASSWORD_MARIADB_DEV;
        break;
    case 'staging':
        dbPassword = process.env.DB_PASSWORD_MARIADB_STAGING;
        break;
    case 'production':
        dbPassword = process.env.DB_PASSWORD_MARIADB_PRODUCTION;
        break;
    default:
        dbPassword = process.env.DB_PASSWORD_MARIADB_LOCAL;
        break;
}

const sequelize = new Sequelize(
    config.db_name_mariadb,
    process.env.DB_USER_MARIADB,
    dbPassword, 
    {
        host: config.db_host_mariadb,
        dialect: config.db_dialect_mariadb,
        port: config.db_port_mariadb
    }
)

sequelize
    .authenticate()
    .then((error) => {
        console.log('Sequelize connection has been established succesfully.')
    }, (error) => {
        console.log('Unable to connect to database. ', error);
    });

export default { sequelize };