"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash("Password@123", 10);

    await queryInterface.bulkInsert("Users", [
      {
        
        name: "Admin User",
        email: "admin@legal.com",
        passwordHash: passwordHash,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        
        name: "Lawyer User",
        email: "lawyer@legal.com",
        passwordHash: passwordHash,
        role: "lawyer",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        
        name: "Client User",
        email: "client@legal.com",
        passwordHash: passwordHash,
        role: "client",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
