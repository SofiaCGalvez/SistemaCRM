const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Task = sequelize.define(
  "Task",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    assignee: {
      type: DataTypes.ENUM("admin", "staff"),
      allowNull: false
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM("pending", "in-progress", "completed"),
      allowNull: false,
      defaultValue: "pending"
    },
    priority: {
      type: DataTypes.ENUM("high", "medium", "low"),
      allowNull: false,
      defaultValue: "medium"
    },
    relatedTo: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "tasks"
  }
);

module.exports = Task;
