const Sequelize = require('sequelize');

const sequelize = require('./../components/sequelize');

const user = sequelize.define(
    'user',
    {
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: { msg: 'Invalid email' }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [5, 255],
                    msg: 'Password must be between 5 and 255 chars'
                }
            }
        },
        createdBy: {
            type: Sequelize.INTEGER
        }
    },
    {
        paranoid: true
    }
);

module.exports = user;