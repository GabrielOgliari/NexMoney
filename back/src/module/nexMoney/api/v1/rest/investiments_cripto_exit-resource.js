const express = require("express");
const router = express.Router();
const model = require("../../../model");
const investimentsCriptoExit = model.investimentsCriptoExit;

// Listar todos os investimentos de renda variável (cripto)
router.get("/api/v1/rest/investiments-cripto-exit", async (req, res) => {
  try {
    const data = await investimentsCriptoExit.findAll();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

// Obter um investimento específico por ID
router.get("/api/v1/rest/investiments-cripto-exit/:id", async (req, res) => {
  try {
    const data = await investimentsCriptoExit.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "não encontrado" });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

// Criar um novo investimento de renda variável (cripto)
router.post("/api/v1/rest/investiments-cripto-exit", async (req, res) => {
  try {
    const {
      typeInvestment,
      name,
      // initialValue,
      initialAmount,
      salesValue,
      withdrawalAmount,
      // totalValue,
      sellDate,
      purchaseDate,
      inclusionDate
    } = req.body;

    // Validação dos campos obrigatórios
    if (
      !typeInvestment ||
      !name ||
      // initialValue === undefined ||
      initialAmount === undefined ||
      salesValue === undefined ||
      withdrawalAmount === undefined ||
      // totalValue === undefined ||
      !sellDate ||
      !purchaseDate ||
      !inclusionDate
    ) {
      return res.status(400).json({ error: "Campos obrigatórios não preenchidos" });
    }

    const created = await investimentsCriptoExit.create({
      typeInvestment,
      name,
      // initialValue,
      initialAmount,
      salesValue,
      withdrawalAmount,
      // totalValue,
      sellDate,
      purchaseDate,
      inclusionDate
    });
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

// Atualizar um investimento de renda variável (cripto)
router.put("/api/v1/rest/investiments-cripto-exit/:id", async (req, res) => {
  try {
    const data = await investimentsCriptoExit.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "não encontrado" });

    const {
      typeInvestment,
      name,
      // initialValue,
      initialAmount,
      salesValue,
      withdrawalAmount,
      // totalValue,
      sellDate,
      purchaseDate,
      inclusionDate
    } = req.body;

    await data.update({
      typeInvestment: typeInvestment ?? data.typeInvestment,
      name: name ?? data.name,
      // initialValue: initialValue ?? data.initialValue,
      initialAmount: initialAmount ?? data.initialAmount,
      salesValue: salesValue ?? data.salesValue,
      withdrawalAmount: withdrawalAmount ?? data.withdrawalAmount,
      // totalValue: totalValue ?? data.totalValue,
      sellDate: sellDate ?? data.sellDate,
      purchaseDate: purchaseDate ?? data.purchaseDate,
      inclusionDate: inclusionDate ?? data.inclusionDate
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

// Deletar um investimento de renda variável (cripto)
router.delete("/api/v1/rest/investiments-cripto-exit/:id", async (req, res) => {
  try {
    const data = await investimentsCriptoExit.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "não encontrado" });
    await data.destroy();
    res.json({ success: true, msg: `Conta ${data.id} deletada com sucesso!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

module.exports = router;