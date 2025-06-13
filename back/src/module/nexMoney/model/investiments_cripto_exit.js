"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class InvestimentsCriptoExit extends Model {
    static associate(models) {
      // associações se necessário
    }
  }
  InvestimentsCriptoExit.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      typeInvestment: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      // initialValue: { type: DataTypes.NUMERIC, allowNull: false },
      initialAmount: { type: DataTypes.NUMERIC, allowNull: false },
      salesValue: { type: DataTypes.NUMERIC, allowNull: false },           // obrigatório
      withdrawalAmount: { type: DataTypes.NUMERIC, allowNull: false },     // obrigatório
      // totalValue: { type: DataTypes.NUMERIC, allowNull: false },           // obrigatório
      sellDate: { type: DataTypes.DATEONLY, allowNull: false },            // obrigatório
      purchaseDate: { type: DataTypes.DATEONLY, allowNull: false },
      inclusionDate: { type: DataTypes.DATEONLY, allowNull: false },
    },
    {
      sequelize,
      modelName: "InvestimentsCriptoExit",
      tableName: "investiments_cripto_exit",
    }
  );
  return InvestimentsCriptoExit;
};