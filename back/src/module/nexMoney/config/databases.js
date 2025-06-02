/*{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}*/

module.exports = {
  development: {
    username: "postgres",
    password: "159357", // coloque sua senha real
    database: "NexMoney", // coloque o nome do seu banco
    host: "127.0.0.1",
    port: 5432,
    dialect: "postgres",
  },
  // Adicione test e production se quiser
};
