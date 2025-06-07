"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MappedExpense extends Model {
    static associate(models) {
      // Associações se necessário
    }
  }

  MappedExpense.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      expenseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expenseName: {
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
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "mappedExpense",
      tableName: "mapped_expenses",
    }
  );

  return MappedExpense;
};
