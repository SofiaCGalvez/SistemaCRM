const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Directory = sequelize.define(
  "Directory",
  {
    company: {
      type: DataTypes.STRING,
      allowNull: false
    },
    representative: {
      type: DataTypes.STRING,
      allowNull: false
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Other"
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "active"
    }
  },
  {
    tableName: "directory"
  }
);

module.exports = Directory;
