"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("matters", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      status: {
        type: Sequelize.ENUM("open", "in_progress", "closed"),
        allowNull: false,
        defaultValue: "open",
      },

      clientName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      assignedLawyerId: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("matters");
  },
};
