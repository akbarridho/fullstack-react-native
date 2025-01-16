'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.hasMany(models.Profile, { foreignKey: "role_id", as: "profiles" })
    }
  }
  Role.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'name cannot be empty'
        },
        notNull: {
          msg: 'name cannot be empty'
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
      async afterCreate(role, options) {
        await role.update({ created_id: options.user_id })
      }
    },
    sequelize,
    modelName: 'Role',
  });
  return Role;
};