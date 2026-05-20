const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Attendee = sequelize.define(
  "Attendee",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false
    },
    eventId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    eventName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("registered", "attended", "no-show"),
      allowNull: false,
      defaultValue: "registered"
    }
  },
  {
    tableName: "attendees"
  }
);

module.exports = Attendee;
