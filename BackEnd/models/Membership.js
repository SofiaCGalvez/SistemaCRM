const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Membership = sequelize.define(
  "Membership",
  {
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    month: {
      type: DataTypes.ENUM(
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ),
      allowNull: false
    },
    accountType: {
      type: DataTypes.ENUM("MXN", "USD"),
      allowNull: false
    },
    billingDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    invoice: {
      type: DataTypes.STRING,
      allowNull: false
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    legalName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rfc: {
      type: DataTypes.STRING,
      allowNull: false
    },
    membershipNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contact1Name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contact1Email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmailOrEmpty(value) {
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            throw new Error("Contact 1 email invalido");
          }
        }
      }
    },
    contact1Phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contact2Name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    contact2Email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmailOrEmpty(value) {
          if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            throw new Error("Contact 2 email invalido");
          }
        }
      }
    },
    contact2Phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    feeMxn: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0
    },
    feeUsd: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0
    },
    startPeriod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    endPeriod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    paymentDate: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    receipt: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "memberships"
  }
);

module.exports = Membership;
