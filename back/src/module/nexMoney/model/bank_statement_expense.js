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
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
      },
      date: {
        type: DataTypes.DATEONLY,
      },
      type: {
        type: DataTypes.STRING,
      },
      memo_info: {
        type: DataTypes.DATE,
      },
      person_name: {
        type: DataTypes.STRING,
      },
      category: {
        type: DataTypes.STRING,
      },
      mapped: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      fitid: {
        type: DataTypes.STRING,
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
