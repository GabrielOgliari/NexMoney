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
      typeInvestment: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      initialValue: { type: DataTypes.NUMERIC, allowNull: false },
      withdrawalAmount: { type: DataTypes.NUMERIC, allowNull: false },

      sellDate: { type: DataTypes.DATEONLY, allowNull: true },
      interestRate: { type: DataTypes.NUMERIC, allowNull: true },
      startDate: { type: DataTypes.DATEONLY, allowNull: false },
      dueDate: { type: DataTypes.DATEONLY, allowNull: false },
      inclusionDate: { type: DataTypes.DATEONLY, allowNull: false },
    },
    {
      sequelize,
      modelName: "investimentFixedIncomeExit",
      tableName: "investment_fixed_income_exit",
    }
  );
  return investimentFixedIncomeExit;
};
