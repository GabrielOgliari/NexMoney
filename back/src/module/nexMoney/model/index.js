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
const accountReceivable = require("./account_receivable")(sequelize, Sequelize.DataTypes);

const mappedExpense = require("./mapped_expense")(
  sequelize,
  Sequelize.DataTypes
);

const bankStatementExpense = require("./bank_statement_expense")(
  sequelize,
  Sequelize.DataTypes
);

const investmentFixedIncome = require("./investment_fixed_income")(
  sequelize,
  Sequelize.DataTypes
);

const investimentFixedIncomeExit = require("./investment_fixed_income_exit")(
  sequelize,
  Sequelize.DataTypes
);

const investimentsVariableIncome = require("./investiments_variable_income")(
  sequelize,
  Sequelize.DataTypes
);

const investimentsVariableIncomeExit = require("./investiments_variable_income_exit")(
  sequelize,
  Sequelize.DataTypes
);

const investimentsCrypto = require("./investiments_crypto")(
  sequelize,
  Sequelize.DataTypes
);

const investimentsCryptoExit = require("./investiments_crypto_exit")(
  sequelize,
  Sequelize.DataTypes
);

const db = {
  category,
  accountPayable,
  accountReceivable,
  mappedExpense,
  bankStatementExpense,
  investmentFixedIncome,
  investimentFixedIncomeExit,
  investimentsVariableIncome,
  investimentsVariableIncomeExit,
  investimentsCrypto,
  investimentsCryptoExit,
  sequelize,
  Sequelize,
};
module.exports = db;
