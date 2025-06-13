"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class investimentsCripto extends Model {
    static associate(models) {
      // associações se necessário
    }
  }
  investimentsCripto.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      typeInvestment: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      // value: { type: DataTypes.NUMERIC, allowNull: false },
      amount: { type: DataTypes.NUMERIC, allowNull: false },
      totalValue: { type: DataTypes.NUMERIC, allowNull: false },
      purchaseDate: { type: DataTypes.DATEONLY, allowNull: false },
    },
    {
      sequelize,
      modelName: "investimentsCripto",
      tableName: "investiments_cripto",
    }
  );
  return investimentsCripto;
};
