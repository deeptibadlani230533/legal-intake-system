'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {

      // 🔹 User has many created cases (Client)
      User.hasMany(models.Case, {
        foreignKey: 'userId',
        as: 'createdCases',
        onDelete: 'CASCADE',
      });

      // 🔹 User has many assigned cases (Lawyer)
      User.hasMany(models.Case, {
        foreignKey: 'assignedLawyerId',
        as: 'assignedCases',
      });

      // 🔹 User has many uploaded Documents
User.hasMany(models.Document, {
  foreignKey: 'uploadedBy',
  as: 'uploadedDocuments',
});

User.hasMany(models.AuditLog, {
  foreignKey: "userId",
});

    }
  }

  User.init({
    name:         DataTypes.STRING,
    email:        DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    role:         DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    freezeTableName: true
  });

  return User;
};