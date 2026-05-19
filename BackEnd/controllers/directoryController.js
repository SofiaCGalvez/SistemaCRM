const Directory = require("../models/Directory");

const normalizeDirectoryData = (body) => ({
  company: body.company?.trim(),
  representative: body.representative?.trim(),
  position: body.position?.trim() || null,
  email: body.email?.trim(),
  phone: body.phone?.trim() || null,
  industry: body.industry && body.industry !== "all" ? body.industry.trim() : "Other",
  website: body.website?.trim() || null,
  status: body.status || "active"
});

const getDirectory = async (req, res) => {
  try {
    const directory = await Directory.findAll({
      order: [["createdAt", "ASC"]]
    });

    res.json(directory);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el directorio",
      error: error.message
    });
  }
};

const createDirectoryEntry = async (req, res) => {
  try {
    const data = normalizeDirectoryData(req.body);

    if (!data.company || !data.representative || !data.email) {
      return res.status(400).json({ message: "Company, representative y email son requeridos" });
    }

    const entry = await Directory.create(data);
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el registro del directorio",
      error: error.message
    });
  }
};

const updateDirectoryEntry = async (req, res) => {
  try {
    const entry = await Directory.findByPk(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    const data = normalizeDirectoryData(req.body);

    if (!data.company || !data.representative || !data.email) {
      return res.status(400).json({ message: "Company, representative y email son requeridos" });
    }

    await entry.update(data);
    res.json(entry);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el registro del directorio",
      error: error.message
    });
  }
};

const deleteDirectoryEntry = async (req, res) => {
  try {
    const entry = await Directory.findByPk(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    await entry.destroy();
    res.json({ message: "Registro eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el registro del directorio",
      error: error.message
    });
  }
};

module.exports = {
  getDirectory,
  createDirectoryEntry,
  updateDirectoryEntry,
  deleteDirectoryEntry
};
