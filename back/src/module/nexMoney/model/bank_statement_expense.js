"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BankStatementExpense extends Model {
    static associate(models) {
      // associações se necessário
    }
  }

  BankStatementExpense.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      mapped: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "bankStatementExpense",
      tableName: "bank_statement_expenses",
    }
  );

  return BankStatementExpense;
};
