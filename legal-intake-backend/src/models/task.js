"use strict";

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "Task",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM("pending", "completed"),
        defaultValue: "pending",
      },

      matterId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "tasks",
      timestamps: true,
    }
  );
  /*Task.associate = (models) => {
  Task.belongsTo(models.Matter, {
    foreignKey: "matterId",
    as: "matter",
  });
};*/


  return Task;
};
