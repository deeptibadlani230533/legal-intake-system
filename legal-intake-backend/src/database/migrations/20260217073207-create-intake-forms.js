"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("IntakeForms", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      clientName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      issueType: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      details: {
        type: Sequelize.TEXT,
      },

      submittedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("IntakeForms");
  },
};
