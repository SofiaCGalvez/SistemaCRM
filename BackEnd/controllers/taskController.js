const Task = require("../models/Task");

const normalizeTaskData = (body) => ({
  title: body.title?.trim(),
  assignee: body.assignee,
  dueDate: body.dueDate,
  status: body.status || "pending",
  priority: body.priority || "medium",
  relatedTo: body.relatedTo?.trim()
});

const validateTaskData = (data) => {
  if (!data.title || !data.assignee || !data.dueDate || !data.status || !data.priority || !data.relatedTo) {
    return "Task, assignee, due date, status, priority y related to son requeridos";
  }

  return null;
};

const getTasks = async (req, res) => {
  try {
    const where = {};

    if (req.query.status) {
      where.status = req.query.status;
    }

    if (req.query.priority) {
      where.priority = req.query.priority;
    }

    if (req.query.assignee) {
      where.assignee = req.query.assignee;
    }

    // Staff users only work with staff-assigned tasks, even if the query asks for another assignee.
    if (req.user.role === "staff") {
      where.assignee = "staff";
    }

    const tasks = await Task.findAll({
      where,
      order: [
        ["dueDate", "ASC"],
        ["createdAt", "ASC"]
      ]
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las tareas",
      error: error.message
    });
  }
};

const createTask = async (req, res) => {
  try {
    const data = normalizeTaskData(req.body);

    // Staff-created tasks are always assigned to staff to preserve the role boundary.
    if (req.user.role === "staff") {
      data.assignee = "staff";
    }

    const validationError = validateTaskData(data);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const task = await Task.create(data);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la tarea",
      error: error.message
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    // Staff cannot modify admin tasks, even if they know the task id.
    if (req.user.role === "staff" && task.assignee !== "staff") {
      return res.status(403).json({ message: "No tienes permisos para modificar esta tarea" });
    }

    const data = normalizeTaskData(req.body);

    if (req.user.role === "staff") {
      data.assignee = "staff";
    }

    const validationError = validateTaskData(data);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    await task.update(data);
    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la tarea",
      error: error.message
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    // Deleting follows the same ownership rule used by update.
    if (req.user.role === "staff" && task.assignee !== "staff") {
      return res.status(403).json({ message: "No tienes permisos para eliminar esta tarea" });
    }

    await task.destroy();
    res.json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la tarea",
      error: error.message
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
