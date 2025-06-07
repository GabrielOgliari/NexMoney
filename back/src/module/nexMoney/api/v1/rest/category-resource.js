const express = require("express");
const router = express.Router();
const model = require("../../../model");

const Category = model.category;

// Obter todas as categorias
router.get("/api/v1/rest/categories", async (req, res) => {
  try {
    const categories = await Category.findAll();
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
    delete req.body.id; // força ignorar id
    const newCategory = await Category.create(req.body);
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
    await category.update(req.body);
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
