'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Project.hasMany(models.Task, {foreignKey: "project_id", as: "tasks"})
    }
  }
  Project.init({
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
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    created_id: DataTypes.INTEGER,
    updated_id: DataTypes.INTEGER
  }, {
    hooks: {
      async afterCreate(project, options) {
        await project.update({ created_id: options.user_id })
      }
    },
    sequelize,
    modelName: 'Project',
  });
  return Project;
};