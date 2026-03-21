"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CalendarEvent extends Model {
    static associate(models) {
      CalendarEvent.belongsTo(models.User, {
        foreignKey: "userId",
        as: "creator",
      });

      // Optional — link event to a specific case
      CalendarEvent.belongsTo(models.Case, {
        foreignKey: "caseId",
        as: "case",
        constraints: false,
      });
    }
  }

  CalendarEvent.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      // hearing | deadline | meeting | reminder
      type: {
        type: DataTypes.ENUM("hearing", "deadline", "meeting", "reminder"),
        defaultValue: "reminder",
      },

      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      // Optional time string e.g. "14:30"
      time: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // Optional link to a case
      caseId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "CalendarEvent",
    }
  );

  return CalendarEvent;
};