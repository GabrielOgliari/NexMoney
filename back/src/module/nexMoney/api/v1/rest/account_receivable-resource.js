const express = require("express");
const router = express.Router();
const model = require("../../../model");
const AccountReceivable = model.accountReceivable;

// GET todas as contas a receber
router.get("/api/v1/rest/accounts-receivable", async (req, res) => {
  try {
    const data = await AccountReceivable.findAll();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET por ID
router.get("/api/v1/rest/accounts-receivable/:id", async (req, res) => {
  try {
    const data = await AccountReceivable.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Conta não encontrada" });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// POST nova conta
router.post("/api/v1/rest/accounts-receivable", async (req, res) => {
  try {
    if (req.body.categoryId === "") {
      delete req.body.categoryId;
    }

    const created = await AccountReceivable.create(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// PUT atualizar conta
router.put("/api/v1/rest/accounts-receivable/:id", async (req, res) => {
  try {
    if (req.body.categoryId === "") {
      delete req.body.categoryId;
    }

    const data = await AccountReceivable.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Conta não encontrada" });

    await data.update(req.body);
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE remover conta
router.delete("/api/v1/rest/accounts-receivable/:id", async (req, res) => {
  try {
    const data = await AccountReceivable.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: "Conta não encontrada" });

    await data.destroy();
    res.json({ success: true, msg: `Conta ${data.id} deletada com sucesso!` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
