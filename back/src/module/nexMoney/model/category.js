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
      planned: { type: DataTypes.NUMERIC, allowNull: false },
    },
    {
      sequelize,
      modelName: "category",
      tableName: "categories",
    }
  );
  return Category;
};
