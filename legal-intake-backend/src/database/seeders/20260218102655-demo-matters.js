"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("matters", [
      {
        // id will auto-generate (UUID default)
        title: "Missing Person Investigation",
        description: "Matter opened during Simhasta event",
        status: "open",
        clientName: "Rahul Sharma",
        assignedLawyerId: null,

        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Property Dispute Matter",
        description: "Client reported land ownership dispute",
        status: "in_progress",
        clientName: "Anita Verma",
        assignedLawyerId: null,

        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Cyber Fraud Complaint",
        description: "Online transaction fraud case",
        status: "closed",
        clientName: "Suresh Patel",
        assignedLawyerId: null,

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("matters", null, {});
  },
};
