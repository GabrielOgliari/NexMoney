"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class investmentFixedIncome extends Model {
    static associate(models) {
      // associações se necessário
    }
  }
  investmentFixedIncome.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      typeinvestment: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      value: { type: DataTypes.NUMERIC, allowNull: false },
      interestRate: { type: DataTypes.NUMERIC, allowNull: true },
      startDate: { type: DataTypes.DATEONLY, allowNull: false },
      dueDate: { type: DataTypes.DATEONLY, allowNull: false },
    },
    {
      sequelize,
      modelName: "investmentFixedIncome",
      tableName: "investment_fixed_income",
    }
  );
  return investmentFixedIncome;
};
