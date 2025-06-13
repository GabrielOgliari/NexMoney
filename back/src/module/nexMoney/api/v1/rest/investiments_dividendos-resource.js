const express = require("express");
const router = express.Router();
const model = require("../../../model");
const investimentsDividendos = model.investimentsDividendos;

// Listar todos os investimentos de renda variável (cripto)
router.get("/api/v1/rest/investiments-dividendos", async (req, res) => {
  try {
    const data = await investimentsDividendos.findAll();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

// Obter um investimento específico por ID
router.get("/api/v1/rest/investiments-dividendos/:id", async (req, res) => {
  try {
    const data = await investimentsDividendos.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "não encontrado" });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

// Criar um novo investimento de renda variável (cripto)
router.post("/api/v1/rest/investiments-dividendos", async (req, res) => {
  try {
    const {
      typeInvestment,
      name,
      // value,
      // amount,
      totalValue,
      purchaseDate
    } = req.body;

    // Apenas os campos obrigatórios do model são validados
    if (
      !typeInvestment ||
      !name ||
      // value === undefined ||
      // amount === undefined ||
      totalValue === undefined ||
      !purchaseDate
    ) {
      return res.status(400).json({ error: "Campos obrigatórios não preenchidos" });
    }

    const created = await investimentsDividendos.create({
      typeInvestment,
      name,
      // value,
      // amount,
      totalValue,
      purchaseDate
    });
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

// Atualizar um investimento de renda variável (cripto)
router.put("/api/v1/rest/investiments-dividendos/:id", async (req, res) => {
  try {
    const data = await investimentsDividendos.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "não encontrado" });

    const {
      typeInvestment,
      name,
      // value,
      // amount,
      totalValue,
      purchaseDate
    } = req.body;

    await data.update({
      typeInvestment: typeInvestment ?? data.typeInvestment,
      name: name ?? data.name,
      // value: value ?? data.value,
      // amount: amount ?? data.amount,
      totalValue: totalValue ?? data.totalValue,
      purchaseDate: purchaseDate ?? data.purchaseDate
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

// Deletar um investimento de renda variável (cripto)
router.delete("/api/v1/rest/investiments-dividendos/:id", async (req, res) => {
  try {
    const data = await investimentsDividendos.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "não encontrado" });
    await data.destroy();
    res.json({ success: true, msg: `Conta ${data.id} deletada com sucesso!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

module.exports = router;