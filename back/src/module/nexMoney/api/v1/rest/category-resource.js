const express = require("express");
const router = express.Router();
const model = require("../../../model");

const Category = model.category;

// Obter categorias, com suporte a filtro por tipo (expanse, income, investment)
router.get("/api/v1/rest/categories", async (req, res) => {
  try {
    const { type } = req.query;
    let where = {};

    if (type) {
      const typesArray = Array.isArray(type) ? type : [type];
      where.type = typesArray;
    }

    const categories = await Category.findAll({ where });
    res.json(categories);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    res.status(500).json({ error: "Erro ao buscar categorias" });
  }
});

// Obter uma categoria pelo ID
router.get("/api/v1/rest/categories/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category)
      return res.status(404).json({ error: "Categoria não encontrada" });
    res.json(category);
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);
    res.status(500).json({ error: "Erro ao buscar categoria" });
  }
});

// Criar uma nova categoria
router.post("/api/v1/rest/categories", async (req, res) => {
  try {
    const { name, type, description, planned, investmentType } = req.body;

    if (!name || !type) {
      return res
        .status(400)
        .json({ error: "Campos obrigatórios não preenchidos" });
    }

    const newCategory = await Category.create({
      name,
      type,
      description: description ?? null,
      planned: planned ?? null,
      investmentType: investmentType ?? null,
    });

    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    res.status(500).json({ error: "Erro ao criar categoria" });
  }
});

// Atualizar uma categoria existente
router.put("/api/v1/rest/categories/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category)
      return res.status(404).json({ error: "Categoria não encontrada" });

    const { name, type, description, planned, investmentType } = req.body;

    // Atualiza apenas os campos enviados
    await category.update({
      name: name ?? category.name,
      type: type ?? category.type,
      description: description ?? category.description,
      planned: planned ?? category.planned,
      investmentType: investmentType ?? category.investmentType,
    });

    res.json({ success: true, data: category });
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    res.status(500).json({ error: "Erro ao atualizar categoria" });
  }
});

// Excluir uma categoria
router.delete("/api/v1/rest/categories/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category)
      return res.status(404).json({ error: "Categoria não encontrada" });

    await category.destroy();
    res.json({
      success: true,
      msg: `Categoria ${category.id} deletada com sucesso!`,
    });
  } catch (error) {
    console.error("Erro ao excluir categoria:", error);
    res.status(500).json({ error: "Erro ao excluir categoria" });
  }
});

module.exports = router;