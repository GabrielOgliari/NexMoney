"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // associações se necessário
    }
  }
  Category.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      descrption : { type: DataTypes.STRING, allowNull: true },
      planned: { type: DataTypes.NUMERIC, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },
      investiment: { type: DataTypes.STRING, defaultValue: true }, 
    },
    {
      sequelize,
      modelName: "category",
      tableName: "categories",
    }
  );
  return Category;
};
