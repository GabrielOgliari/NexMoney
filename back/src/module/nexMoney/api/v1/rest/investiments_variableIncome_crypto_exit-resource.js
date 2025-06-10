const express = require("express");
const router = express.Router();
const model = require("../../../model");
const investimentsVariableIncomeCryptoExit = model.investimentsVariableIncomeCryptoExit;

// Listar todos os investimentos de renda variável (cripto)
router.get("/api/v1/rest/investiments-variableIncome-crypto-exit", async (req, res) => {
  try {
    const data = await investimentsVariableIncomeCryptoExit.findAll();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

// Obter um investimento específico por ID
router.get("/api/v1/rest/investiments-variableIncome-crypto-exit/:id", async (req, res) => {
  try {
    const data = await investimentsVariableIncomeCryptoExit.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "não encontrado" });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

// Criar um novo investimento de renda variável (cripto)
router.post("/api/v1/rest/investiments-variableIncome-crypto-exit", async (req, res) => {
  try {
    const {
      typeInvestment,
      name,
      initialValue,
      initialAmount,
      salesValue,
      withdrawalAmount,
      totalValue,
      sellDate,
      purchaseDate,
      inclusionDate
    } = req.body;

    // Apenas os campos obrigatórios do model são validados
    if (
      !typeInvestment ||
      !name ||
      initialValue === undefined ||
      initialAmount === undefined ||
      salesValue === undefined ||
      !sellDate ||
      !purchaseDate ||
      !inclusionDate
    ) {
      return res.status(400).json({ error: "Campos obrigatórios não preenchidos" });
    }

    const created = await investimentsVariableIncomeCryptoExit.create({
      typeInvestment,
      name,
      initialValue,
      initialAmount,
      salesValue,
      withdrawalAmount: withdrawalAmount ?? null,
      totalValue: totalValue ?? null,
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
router.put("/api/v1/rest/investiments-variableIncome-crypto-exit/:id", async (req, res) => {
  try {
    const data = await investimentsVariableIncomeCryptoExit.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "não encontrado" });

    const {
      typeInvestment,
      name,
      initialValue,
      initialAmount,
      salesValue,
      withdrawalAmount,
      totalValue,
      sellDate,
      purchaseDate,
      inclusionDate
    } = req.body;

    await data.update({
      typeInvestment: typeInvestment ?? data.typeInvestment,
      name: name ?? data.name,
      initialValue: initialValue ?? data.initialValue,
      initialAmount: initialAmount ?? data.initialAmount,
      salesValue: salesValue ?? data.salesValue,
      withdrawalAmount: withdrawalAmount ?? data.withdrawalAmount,
      totalValue: totalValue ?? data.totalValue,
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
router.delete("/api/v1/rest/investiments-variableIncome-crypto-exit/:id", async (req, res) => {
  try {
    const data = await investimentsVariableIncomeCryptoExit.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "não encontrado" });
    await data.destroy();
    res.json({ success: true, msg: `Conta ${data.id} deletada com sucesso!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

module.exports = router;