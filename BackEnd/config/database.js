const { Sequelize } = require("sequelize");

const useSsl = process.env.DB_SSL === "true";
const sslCa = process.env.DB_SSL_CA?.replace(/\\n/g, "\n");
const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false";

const sequelize = new Sequelize(
  process.env.DB_NAME || "crm_asociacion",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectOptions: useSsl
      ? {
          ssl: {
            rejectUnauthorized,
            ca: sslCa
          }
        }
      : {}
  }
);

module.exports = sequelize;
