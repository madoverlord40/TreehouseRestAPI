/*jshint esversion: 8 */
/* jshint node: true */

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
                    msg: 'A title is required'
                },
                notEmpty: {
                    msg: 'Please provide a title'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'A description is required'
                },
                notEmpty: {
                    msg: 'Please provide a description'
                }
            }
        },
        estimatedTime: {
            type: DataTypes.TIME,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'An estimated time is required'
                },
                notEmpty: {
                    msg: 'Please provide an estimated time.'
                },
                len: {
                    args: [1, 3],
                    msg: 'The estimated time should be between 1 and 3 characters in length'
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