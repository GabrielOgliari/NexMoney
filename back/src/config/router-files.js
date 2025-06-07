const filenames = {
  "nexMoney/api/v1/rest": [
    "category-resource",
    "account_payable-resource",
    "mapped_expense-resource",
    "bank_statement_expense-resource",
    "ofx-upload-resource",
    "account_receivable-resource",
    // Descomente os recursos adicionais quando forem implementados
    // "post-resource",
    // "reply-resource",
    // "expense-resource",
    // "investiment-resource",
    // "initial_category-resource",
    // "investiment_exit-resource"
  ],
};

function toFilesList(imports, folder) {
  return [...imports, ...filenames[folder].map(toRelativePaths(folder))];
}

function toRelativePaths(folder) {
  return (filename) => {
    return path.resolve(__dirname, `../module/${folder}/${filename}.js`);
  };
}

const path = require("path");
module.exports = Object.keys(filenames).reduce(toFilesList, []);
