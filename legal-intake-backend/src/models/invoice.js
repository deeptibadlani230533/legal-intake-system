'use strict';

module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    caseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    amount: DataTypes.INTEGER,
    paid: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM('paid', 'pending', 'partial', 'overdue'),
      defaultValue: 'pending',
    },
    issuedOn: DataTypes.DATEONLY,
    dueOn: DataTypes.DATEONLY,
    hours: DataTypes.FLOAT,
  });

  // 🔗 ASSOCIATION HERE (IMPORTANT)
  Invoice.associate = function (models) {
    Invoice.belongsTo(models.Case, {
      foreignKey: 'caseId',
      as: 'case',
    });
  };

  return Invoice;
};