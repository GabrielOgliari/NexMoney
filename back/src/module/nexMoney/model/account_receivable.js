"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AccountReceivable extends Model {
    static associate(models) {
      // associações se necessário
    }
  }

  AccountReceivable.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      receiptDate: {
        type: DataTypes.DATEONLY,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true, // deixado como opcional
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reminder: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      recurrence: {
        type: DataTypes.JSONB,
        allowNull: true, // recorrência pode ser opcional
      },
    },
    {
      sequelize,
      modelName: "accountReceivable",
      tableName: "accounts_receivable",
    }
  );

  return AccountReceivable;
};
