const Attendee = require("../models/Attendee");

const normalizeAttendeeData = (body) => ({
  name: body.name?.trim(),
  email: body.email?.trim(),
  company: body.company?.trim(),
  eventId: body.eventId?.trim(),
  eventName: body.eventName?.trim(),
  status: body.status || "registered"
});

const validateAttendeeData = (data) => {
  if (!data.name || !data.email || !data.company || !data.eventId || !data.eventName) {
    return "Name, email, company y event son requeridos";
  }

  return null;
};

const getAttendees = async (req, res) => {
  try {
    const where = {};

    if (req.query.eventId) {
      where.eventId = req.query.eventId;
    }

    if (req.query.status) {
      where.status = req.query.status;
    }

    const attendees = await Attendee.findAll({
      where,
      order: [["createdAt", "ASC"]]
    });

    res.json(attendees);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los asistentes",
      error: error.message
    });
  }
};

const createAttendee = async (req, res) => {
  try {
    const data = normalizeAttendeeData(req.body);
    const validationError = validateAttendeeData(data);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const attendee = await Attendee.create(data);
    res.status(201).json(attendee);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el asistente",
      error: error.message
    });
  }
};

const updateAttendee = async (req, res) => {
  try {
    const attendee = await Attendee.findByPk(req.params.id);

    if (!attendee) {
      return res.status(404).json({ message: "Asistente no encontrado" });
    }

    const data = normalizeAttendeeData(req.body);
    const validationError = validateAttendeeData(data);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    await attendee.update(data);
    res.json(attendee);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el asistente",
      error: error.message
    });
  }
};

const deleteAttendee = async (req, res) => {
  try {
    const attendee = await Attendee.findByPk(req.params.id);

    if (!attendee) {
      return res.status(404).json({ message: "Asistente no encontrado" });
    }

    await attendee.destroy();
    res.json({ message: "Asistente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el asistente",
      error: error.message
    });
  }
};

module.exports = {
  getAttendees,
  createAttendee,
  updateAttendee,
  deleteAttendee
};
