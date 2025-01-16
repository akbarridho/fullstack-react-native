'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, { foreignKey: "user_id", as: "user" })
      Profile.belongsTo(models.Role, { foreignKey: "role_id", as: "role" })
    }
  }
  Profile.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name cannot be empty'
        },
        notNull: {
          msg: 'Name cannot be empty'
        }
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'user_id cannot be empty'
        },
        notNull: {
          msg: 'user_id cannot be empty'
        }
      }
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'role_id cannot be empty'
        },
        notNull: {
          msg: 'role_id cannot be empty'
        }
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    created_id: DataTypes.INTEGER,
    updated_id: DataTypes.INTEGER
  }, {
    hooks: {
      async afterCreate(profile, options) {
        await profile.update({ created_id: options.user_id })
      }
    },
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};