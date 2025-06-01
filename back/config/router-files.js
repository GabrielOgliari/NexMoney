const filenames = {
  /**
   * nexMoney REST.
   */
  "nexMoney/api/v1/rest": [
    "category-resource",
    "account_payable-resource",
    // Descomente os recursos adicionais quando forem implementados
    // "post-resource",
    // "reply-resource",
    // "expense-resource",
    // "investiment-resource",
    // "initial_category-resource",
    // "bank_statement_expense-resource",
    // "mapped_expense-resource",
    // "investiment_exit-resource",
  ],
  /**
   * nexMoney RPC (se existir no futuro).
   */
  // "nexMoney/api/v1/rpc": [
  // ],
};

function toFilesList(imports, folder) {
  return [...imports, ...filenames[folder].map(toRelativePaths(folder))];
}

function toRelativePaths(folder) {
  return (filename) => {
    return `../src/module/${folder}/${filename}`; // Caminho relativo para cada rota
  };
}

module.exports = Object.keys(filenames).reduce(toFilesList, []);
