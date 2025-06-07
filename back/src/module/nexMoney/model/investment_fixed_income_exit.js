"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class investimentFixedIncomeExit extends Model {
    static associate(models) {
      // associações se necessário
    }
  }
  investimentFixedIncomeExit.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      typeInvestiment: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      initialValue: { type: DataTypes.NUMERIC, allowNull: false },
      withdrawalAmount: { type: DataTypes.NUMERIC, allowNull: false },
      interestRate: { type: DataTypes.NUMERIC, allowNull: true },
      sellDate: { type: DataTypes.NUMERIC, allowNull: true },
      interestRate: { type: DataTypes.NUMERIC, allowNull: true },
      startDate: { type: DataTypes.DATEONLY, allowNull: false },
      dueDate: { type: DataTypes.DATEONLY, allowNull: false },
      inclusionDate: { type: DataTypes.DATEONLY, allowNull: false },
    },
    {
      sequelize,
      modelName: "investimentFixedIncomeExit",
      tableName: "fixed_incomes_exit",
    }
  );
  return investimentFixedIncomeExit;
};
