'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('documents', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      caseId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Cases',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      uploadedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      originalName: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      storedName: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      filePath: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      fileType: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      fileSize: {
        type: Sequelize.INTEGER,
        allowNull: false
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

    await queryInterface.addIndex('documents', ['caseId']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('documents');
  }
};