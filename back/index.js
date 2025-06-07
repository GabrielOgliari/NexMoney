"use strict";
const { createServer } = require("http");
const dotenv = require("dotenv");
dotenv.config();
const app = require("./src/config/router-factory");
const { sequelize } = require("./src/module/nexMoney/model");

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Tabelas sincronizadas com sucesso!");

    const http = createServer(app);
    process.on("SIGINT", () => {
      http.close((error) => {
        if (error) console.error(`${error.name}: ${error.message}`);
        process.exit(error ? 1 : 0);
      });
    });

    const PORT = process.env.PORT || 8080;
    http.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV || "development"}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao sincronizar tabelas:", err);
    process.exit(1);
  });
