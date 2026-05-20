const Event = require("../models/Event");

const emptyToNull = (value) => {
  if (typeof value !== "string") {
    return value ?? null;
  }

  const trimmedValue = value.trim();
  return trimmedValue || null;
};

const getDateParts = (dateValue) => {
  const [year, month] = String(dateValue || "").split("-").map(Number);
  return {
    year,
    month
  };
};

const normalizeEventData = (body) => {
  const dateParts = getDateParts(body.date);

  return {
    year: dateParts.year,
    month: dateParts.month,
    title: body.title?.trim(),
    type: body.type || "other",
    status: body.status || "upcoming",
    date: body.date,
    endDate: emptyToNull(body.endDate),
    location: body.location?.trim(),
    description: emptyToNull(body.description)
  };
};

const validateEventData = (data) => {
  if (!data.title || !data.type || !data.status || !data.date || !data.location) {
    return "Title, type, status, date y location son requeridos";
  }

  if (!data.year || !data.month || data.month < 1 || data.month > 12) {
    return "La fecha del evento no es valida";
  }

  if (data.endDate && data.endDate < data.date) {
    return "End date no puede ser menor que date";
  }

  return null;
};

const getEvents = async (req, res) => {
  try {
    const where = {};

    if (req.query.year) {
      where.year = Number(req.query.year);
    }

    if (req.query.month) {
      where.month = Number(req.query.month);
    }

    const events = await Event.findAll({
      where,
      order: [
        ["year", "ASC"],
        ["month", "ASC"],
        ["date", "ASC"],
        ["createdAt", "ASC"]
      ]
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los eventos",
      error: error.message
    });
  }
};

const createEvent = async (req, res) => {
  try {
    const data = normalizeEventData(req.body);
    const validationError = validateEventData(data);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const event = await Event.create(data);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el evento",
      error: error.message
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    const data = normalizeEventData(req.body);
    const validationError = validateEventData(data);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    await event.update(data);
    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el evento",
      error: error.message
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    await event.destroy();
    res.json({ message: "Evento eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el evento",
      error: error.message
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
