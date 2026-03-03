'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    static associate(models) {

      // 🔹 Document belongs to Case
      Document.belongsTo(models.Case, {
        foreignKey: 'caseId',
        as: 'case',
        onDelete: 'CASCADE',
      });

      // 🔹 Document belongs to User (Uploader)
      Document.belongsTo(models.User, {
        foreignKey: 'uploadedBy',
        as: 'uploader',
      });

    }
  }

  Document.init({
    originalName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    storedName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    filePath: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    fileType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    caseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    version: {
  type: DataTypes.INTEGER,
  allowNull: false,
  defaultValue: 1
},



  }, {
    sequelize,
    modelName: 'Document',
    tableName: 'documents', // VERY IMPORTANT (matches migration)
    freezeTableName: true 
  });

  return Document;
};