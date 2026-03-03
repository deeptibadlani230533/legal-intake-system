// migrations/XXXXXXXXXXXXXX-add-userId-to-cases.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Cases', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',  // points to Users table
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Cases', 'userId');
  }
};