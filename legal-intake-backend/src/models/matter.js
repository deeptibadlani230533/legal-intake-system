"use strict";

module.exports = (sequelize, DataTypes) => {
  const Matter = sequelize.define(
    "Matter",
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

      status: {
        type: DataTypes.ENUM("open", "in_progress", "closed"),
        allowNull: false,
        defaultValue: "open",
      },

      closedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "closed_at",
    },

      clientName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      assignedLawyerId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      tableName: "matters",
      timestamps: true,
    }
  );
  Matter.associate = (models) => {
  Matter.hasMany(models.Task, {
    foreignKey: "matterId",
    as: "tasks",
    onDelete: "CASCADE",
  });
};


  return Matter;
};
