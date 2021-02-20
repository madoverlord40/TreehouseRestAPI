const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    class Course extends Model {}
    Course.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A name is required'
                },
                notEmpty: {
                    msg: 'Please provide a name'
                }
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: 'The username you entered already exists'
            },
            validate: {
                notNull: {
                    msg: 'A username is required'
                },
                notEmpty: {
                    msg: 'Please provide a username'
                }
            }
        },
        estimatedTime: {
            type: DataTypes.TIME,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A password is required'
                },
                notEmpty: {
                    msg: 'Please provide a password'
                },
                len: {
                    args: [8, 20],
                    msg: 'The password should be between 8 and 20 characters in length'
                }
            }
        },
        materialsNeeded: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, { sequelize });

    Course.associate = (models) => {
        Course.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return Course;
};