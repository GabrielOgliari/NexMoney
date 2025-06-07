"use strict";
const Sequelize = require("sequelize");
const config = require("../../../../src/config/databases")[
  process.env.NODE_ENV || "development"
];
const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

const category = require("./category")(sequelize, Sequelize.DataTypes);
const accountPayable = require("./account_payable")(
  sequelize,
  Sequelize.DataTypes
);
const mappedExpense = require("./mapped_expense")(
  sequelize,
  Sequelize.DataTypes
);

const bankStatementExpense = require("./bank_statement_expense")(
  sequelize,
  Sequelize.DataTypes
);

const db = {
  category,
  accountPayable,
  mappedExpense,
  bankStatementExpense,
  sequelize,
  Sequelize,
};
module.exports = db;
