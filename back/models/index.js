fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const filePath = path.join(__dirname, file);
    const modelFunc = require(filePath);
    if (typeof modelFunc === "function") {
      const model = modelFunc(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    } else {
      console.warn(`⚠️  Ignorando arquivo ${file} pois não exporta uma função`);
    }
  });
