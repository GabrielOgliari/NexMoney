const express = require("express");
const routes = require("./router-files.js"); // Ajustado o caminho
const path = require("path");

const app = express();

// Configurar CORS
const cors = require("cors");
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://seusite.com" // Substitua pelo domínio real de produção
      : "http://localhost:5173", // Domínio do frontend local
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Arquivos públicos
app.use("/public", express.static(path.join(__dirname, "..", "public")));

// Carregar rotas dinamicamente
routes.forEach((file) => {
  try {
    app.use(require(file));
  } catch (error) {
    console.error(`Erro ao importar rota ${file}:`, error.message);
  }
});

// Rota principal simples para testes
app.get("/", (_, res) => res.send("<h1>API NexMoney 🚀</h1>"));

module.exports = app;
