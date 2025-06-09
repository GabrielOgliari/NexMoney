const express = require("express");
const router = express.Router();
const model = require("../../../model");
const investimentFixedIncome = model.investmentFixedIncome;

// Listar todos os investimentos de renda fixa
router.get("/api/v1/rest/investiments-fixed-income", async (req, res) => {
  try {
    const data = await investimentFixedIncome.findAll();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

// Obter um investimento específico por ID
router.get("/api/v1/rest/investiments-fixed-income/:id", async (req, res) => {
  try {
    const data = await investimentFixedIncome.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "não encontrado" });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

// Criar um novo investimento de renda fixa
router.post("/api/v1/rest/investiments-fixed-income", async (req, res) => {
  try {
    const {
      typeInvestment,
      name,
      value,
      interestRate,
      startDate,
      dueDate
    } = req.body;

    // Apenas os campos obrigatórios do model são validados
    if (!typeInvestment || !name || value === undefined || !startDate || !dueDate) {
      return res.status(400).json({ error: "Campos obrigatórios não preenchidos" });
    }

    const created = await investimentFixedIncome.create({
      typeInvestment,
      name,
      value,
      interestRate: interestRate ?? null,
      startDate,
      dueDate
    });
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

// Atualizar um investimento de renda fixa
router.put("/api/v1/rest/investiments-fixed-income/:id", async (req, res) => {
  try {
    const data = await investimentFixedIncome.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "não encontrado" });

    const {
      typeInvestment,
      name,
      value,
      interestRate,
      startDate,
      dueDate
    } = req.body;

    await data.update({
      typeInvestment: typeInvestment ?? data.typeInvestment,
      name: name ?? data.name,
      value: value ?? data.value,
      interestRate: interestRate ?? data.interestRate,
      startDate: startDate ?? data.startDate,
      dueDate: dueDate ?? data.dueDate
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

// Deletar um investimento de renda fixa
router.delete("/api/v1/rest/investiments-fixed-income/:id", async (req, res) => {
  try {
    const data = await investimentFixedIncome.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "não encontrado" });
    await data.destroy();
    res.json({ success: true, msg: `Conta ${data.id} deletada com sucesso!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

module.exports = router;