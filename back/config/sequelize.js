const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("nexMoney", "postgres", "postgres", {
  host: "db", // ajuste para seu host Postgres se necessário
  dialect: "postgres",
});

// Importar modelos
const Category = require("../models/category")(sequelize, DataTypes);
const AccountPayable = require("../models/account_payable")(
  sequelize,
  DataTypes
);
const Expense = require("../models/expense")(sequelize, DataTypes);
const Investiment = require("../models/investiment")(sequelize, DataTypes);
const InitialCategory = require("../models/initial_category")(
  sequelize,
  DataTypes
);
const BankStatementExpense = require("../models/bank_statement_expense")(
  sequelize,
  DataTypes
);
const MappedExpense = require("../models/mapped_expense")(sequelize, DataTypes);
const InvestimentFixedIncomeExit = require("../models/investiment_exit")(
  sequelize,
  DataTypes
);

module.exports = {
  sequelize,
  models: {
    Category,
    AccountPayable,
    Expense,
    Investiment,
    InitialCategory,
    BankStatementExpense,
    MappedExpense,
    InvestimentFixedIncomeExit,
  },
};
