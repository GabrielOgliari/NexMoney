const express = require("express");
const router = express.Router();
const model = require("../../../model");
const BankStatementExpense = model.bankStatementExpense;

router.get("/api/v1/rest/bankStatementExpenses", async (req, res) => {
  try {
    const data = await BankStatementExpense.findAll();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// POST despesas de extrato (em lote)
router.post("/api/v1/rest/bankStatementExpenses", async (req, res) => {
  try {
    const payload = req.body;

    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Os dados devem ser um array." });
    }

    const created = await BankStatementExpense.bulkCreate(payload);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error("Erro ao inserir despesas de extrato:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
