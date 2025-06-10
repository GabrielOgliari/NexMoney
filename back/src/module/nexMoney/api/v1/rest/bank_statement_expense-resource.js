const express = require("express");
const router = express.Router();
const model = require("../../../model");
const BankStatementExpense = model.bankStatementExpense;

// GET - Buscar somente despesas do extrato
router.get("/api/v1/rest/bankStatementExpenses", async (req, res) => {
  try {
    const data = await BankStatementExpense.findAll({
      where: {
        mapped: false, // somente despesas não mapeadas
      },
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// PUT - Atualizar categoriaId e mapped das despesas
router.put("/api/v1/rest/bankStatementExpenses", async (req, res) => {
  try {
    const payload = req.body;

    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Os dados devem ser um array." });
    }

    const updatedItems = [];

    for (const item of payload) {
      const { id, categoryId, category } = item;

      if (!id || !categoryId) {
        continue; // ignora itens incompletos
      }

      const [count, [updated]] = await BankStatementExpense.update(
        { categoryId, category: category || null, mapped: true },
        { where: { id }, returning: true }
      );

      if (count > 0) {
        updatedItems.push(updated);
      }
    }

    res.status(200).json({ success: true, updated: updatedItems });
  } catch (error) {
    console.error("Erro ao atualizar despesas de extrato:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
