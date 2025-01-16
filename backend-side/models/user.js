'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, { foreignKey: "user_id", as: "profile" })
      User.hasMany(models.Transaction, { foreignKey: "user_id", as: "transactions" })
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: 'Email was already used'
      },
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Email cannot be empty'
        },
        notNull: {
          msg: 'Email cannot be empty'
        },
        isEmail: {
          msg: 'Please use email format'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'password cannot be empty'
        },
        notNull: {
          msg: 'password cannot be empty'
        }
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    created_id: {
      type: DataTypes.INTEGER
    },
    updated_id: {
      type: DataTypes.INTEGER
    }
  }, {
    hooks: {
      beforeCreate: (user) => {
        user.password = hashPassword(user.password)
      },
      beforeUpdate: (user) => {
        user.password = hashPassword(user.password)
      },
      async afterCreate(user) {
        await user.update({ created_id: user.id })
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};