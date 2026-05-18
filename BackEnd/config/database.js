const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "crm_asociacion",
  "root",
  "AiDualC2000",
  {
    host: "localhost",
    dialect: "mysql"
  }
);

module.exports = sequelize;