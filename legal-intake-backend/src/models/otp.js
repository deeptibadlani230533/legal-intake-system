"use strict";

module.exports = (sequelize, DataTypes) => {
  const OTP = sequelize.define(
    "OTP",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "otps",
      timestamps: true,
    }
  );

  return OTP;
};
