const config = require('./../configrc');
const Sequelize = require('sequelize');

module.exports = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    {
        host: config.db.host,
        dialect: config.db.dialect,
        pool: {
            max: 8,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);