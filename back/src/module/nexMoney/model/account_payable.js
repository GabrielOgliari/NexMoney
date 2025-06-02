"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AccountPayable extends Model {
    static associate(models) {
      // associações se necessário
    }
  }
  AccountPayable.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      description: { type: DataTypes.STRING, allowNull: false },
      amount: { type: DataTypes.NUMERIC, allowNull: false },
      dueDate: { type: DataTypes.DATEONLY, allowNull: false },
      category: { type: DataTypes.STRING, allowNull: false },
      categoryId: { type: DataTypes.INTEGER, allowNull: true },
      status: { type: DataTypes.STRING, allowNull: false },
      reminder: { type: DataTypes.BOOLEAN, allowNull: false },
      recurrence: { type: DataTypes.JSONB, allowNull: true },
    },
    {
      sequelize,
      modelName: "accountPayable",
      tableName: "accounts_payable",
    }
  );
  return AccountPayable;
};
