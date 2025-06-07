const express = require("express");
const router = express.Router();
const model = require("../../../model");
const investimentFixedIncome = model.investmentFixedIncome; // Use o nome exato do model

// Listar todas as contas a pagar
router.get("/api/v1/rest/investiments-fixed-income", async (req, res) => {
  try {
    const data = await investimentFixedIncome.findAll();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

// Obter uma conta específica por ID
router.get("/api/v1/rest/investiments-fixed-income/:id", async (req, res) => {
  try {
    const express = require("express");
    const router = express.Router();
    const { investimentFixedIncome: investimentFixedIncome } = require("../../../model");

    router.get("/api/v1/rest/investiments-fixed-income", async (req, res) => {
      try {
        const data = await investimentFixedIncome.findAll();
        res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
    });

    router.get("/api/v1/rest/investiments-fixed-income/:id", async (req, res) => {
      try {
        const data = await investimentFixedIncome.findByPk(req.params.id);
        if (!data)
          return res.status(404).json({ error: "não encontrado" });
        res.json(data);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
    });

    router.post("/api/v1/rest/investiments-fixed-income", async (req, res) => {
      try {
        const created = await investimentFixedIncome.create(req.body);
        res.status(201).json({ success: true, data: created });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
    });

    router.put("/api/v1/rest/investiments-fixed-income/:id", async (req, res) => {
      try {
        const data = await investimentFixedIncome.findByPk(req.params.id);
        if (!data)
          return res.status(404).json({ error: "não encontrado" });
        await data.update(req.body);
        res.json({ success: true, data });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
    });

    router.delete("/api/v1/rest/investiments-fixed-income/:id", async (req, res) => {
      try {
        const data = await investimentFixedIncome.findByPk(req.params.id);
        if (!data)
          return res.status(404).json({ error: "não encontrado" });
        await data.destroy();
        res.json({
          success: true,
          msg: `Conta ${data.id} deletada com sucesso!`,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
    });

    module.exports = router;

    const data = await investimentFixedIncome.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "não encontrado" });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

// Criar uma nova conta a pagar
router.post("/api/v1/rest/investiments-fixed-income", async (req, res) => {
  try {
    const created = await investimentFixedIncome.create(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

// Atualizar uma conta a pagar
router.put("/api/v1/rest/investiments-fixed-income/:id", async (req, res) => {
  try {
    const data = await investimentFixedIncome.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "não encontrado" });
    await data.update(req.body);
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || error });
  }
});

// Deletar uma conta a pagar
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
