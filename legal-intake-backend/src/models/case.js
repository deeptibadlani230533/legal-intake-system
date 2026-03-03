"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Case extends Model {
    static associate(models) {
      // 🔹 Case belongs to Client (Owner)
      Case.belongsTo(models.User, {
        foreignKey: "userId",
        as: "owner",
      });

      // 🔹 Case belongs to Assigned Lawyer
      Case.belongsTo(models.User, {
        foreignKey: "assignedLawyerId",
        as: "assignedLawyer",
      });

      // 🔹 Case has many Documents
      Case.hasMany(models.Document, {
        foreignKey: "caseId",
        as: "documents",
        onDelete: "CASCADE",
      });
    }
  }

  Case.init(
    {
      caseTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
      },

      status: {
        type: DataTypes.STRING,
        defaultValue: "open",
      },

      // 🔹 Client Information
      clientName: {
        type: DataTypes.STRING,
      },

      clientEmail: {
        type: DataTypes.STRING,
      },

      clientPhone: {
        type: DataTypes.STRING,
      },

      clientAddress: {
        type: DataTypes.TEXT,
      },

      // 🔹 Case Details
      category: {
        type: DataTypes.STRING,
      },

      priority: {
        type: DataTypes.STRING,
        defaultValue: "medium",
      },

      incidentDate: {
        type: DataTypes.DATE,
      },

      opponentName: {
        type: DataTypes.STRING,
      },

      claimAmount: {
        type: DataTypes.FLOAT,
      },

      // 🔹 Ownership
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // 🔹 Assigned Lawyer
      assignedLawyerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Case",
    },
  );

  return Case;
};
