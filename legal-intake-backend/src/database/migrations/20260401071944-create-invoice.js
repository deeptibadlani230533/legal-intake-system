"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Invoices", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },

      caseId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Cases",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      paid: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      status: {
        type: Sequelize.ENUM("paid", "pending", "partial", "overdue"),
        defaultValue: "pending",
      },

      issuedOn: {
        type: Sequelize.DATEONLY,
      },

      dueOn: {
        type: Sequelize.DATEONLY,
      },

      hours: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Invoices");
  },
};