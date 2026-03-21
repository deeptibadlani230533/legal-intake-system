"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CaseComment extends Model {
    static associate(models) {
      // Comment belongs to a case
      CaseComment.belongsTo(models.Case, {
        foreignKey: "caseId",
        as: "case",
        onDelete: "CASCADE",
      });

      // Comment belongs to the user who wrote it
      CaseComment.belongsTo(models.User, {
        foreignKey: "userId",
        as: "author",
      });
    }
  }

  CaseComment.init(
    {
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      caseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "CaseComment",
    }
  );

  return CaseComment;
};