'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      is_done: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Projects",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      priority_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Priorities",
          key: "id"
        },
        onDelete: "cascade",
        onUpdate: "cascade"
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_id: {
        type: Sequelize.INTEGER
      },
      updated_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tasks');
  }
};