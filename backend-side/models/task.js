'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Task.belongsTo(models.Project, {foreignKey: "project_id", as: "project"})
      Task.belongsTo(models.Priority, {foreignKey: "priority_id", as: "priority"})
    }
  }
  Task.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name cannot be empty"
        },
        notNull: {
          msg: "Name cannot be empty"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description cannot be empty"
        },
        notNull: {
          msg: "Description cannot be empty"
        }
      }
    },
    is_done: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "project cannot be empty"
        },
        notNull: {
          msg: "project cannot be empty"
        }
      }
    },
    priority_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "priority cannot be empty"
        },
        notNull: {
          msg: "priority cannot be empty"
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
      async afterCreate(task, options) {
        await task.update({ created_id: options.user_id })
      }
    },
    sequelize,
    modelName: 'Task',
  });
  return Task;
};