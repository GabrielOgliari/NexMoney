// crud para mapeamento de despesas
const express = require("express");
const router = express.Router();
const model = require("../../../model");
const MappedExpense = model.mappedExpense;

// GET todas as despesas mapeadas
router.get("/api/v1/rest/mapped-expenses", async (req, res) => {
  try {
    const data = await MappedExpense.findAll();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// POST despesas mapeadas (em lote)
router.post("/api/v1/rest/mapped-expenses", async (req, res) => {
  try {
    const payload = req.body;

    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Dados devem ser um array" });
    }

    const created = await MappedExpense.bulkCreate(payload);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error("Erro ao salvar despesas mapeadas:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
