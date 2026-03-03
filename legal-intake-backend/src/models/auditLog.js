module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define("AuditLog", {
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }, {
    tableName: "audit_logs",   //  explicit lowercase table
    freezeTableName: true      //  prevents auto pluralization
  });

  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return AuditLog;
};