require("dotenv").config(); // Garante que o .env seja lido

module.exports = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "NexMoney",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: console.log,
    define: { timestamps: true },
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    logging: false,
    define: { timestamps: true },
  },
};
