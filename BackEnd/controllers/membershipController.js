const Membership = require("../models/Membership");

const emptyToNull = (value) => {
  if (typeof value !== "string") {
    return value ?? null;
  }

  const trimmedValue = value.trim();
  return trimmedValue || null;
};

const parseAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const normalizeMembershipData = (body) => ({
  year: Number(body.year),
  month: body.month,
  accountType: body.accountType,
  billingDate: body.billingDate,
  invoice: body.invoice?.trim(),
  companyName: body.companyName?.trim(),
  legalName: emptyToNull(body.legalName),
  rfc: body.rfc?.trim(),
  membershipNumber: emptyToNull(body.membershipNumber),
  contact1Name: emptyToNull(body.contact1Name),
  contact1Email: emptyToNull(body.contact1Email),
  contact1Phone: emptyToNull(body.contact1Phone),
  contact2Name: emptyToNull(body.contact2Name),
  contact2Email: emptyToNull(body.contact2Email),
  contact2Phone: emptyToNull(body.contact2Phone),
  feeMxn: parseAmount(body.feeMxn),
  feeUsd: parseAmount(body.feeUsd),
  startPeriod: emptyToNull(body.startPeriod),
  endPeriod: emptyToNull(body.endPeriod),
  paymentDate: emptyToNull(body.paymentDate),
  paymentMethod: emptyToNull(body.paymentMethod),
  receipt: emptyToNull(body.receipt) || emptyToNull(body.membershipNumber) || body.invoice?.trim()
});

const validateMembershipData = (data) => {
  if (
    !data.year ||
    !data.month ||
    !data.accountType ||
    !data.billingDate ||
    !data.invoice ||
    !data.companyName ||
    !data.rfc
  ) {
    return "Year, month, account type, billing date, invoice, company name y RFC son requeridos";
  }

  return null;
};

const getMemberships = async (req, res) => {
  try {
    const memberships = await Membership.findAll({
      order: [
        ["year", "DESC"],
        ["createdAt", "ASC"]
      ]
    });

    res.json(memberships);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las membresias",
      error: error.message
    });
  }
};

const createMembership = async (req, res) => {
  try {
    const data = normalizeMembershipData(req.body);
    const validationError = validateMembershipData(data);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const membership = await Membership.create(data);
    res.status(201).json(membership);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la membresia",
      error: error.message
    });
  }
};

const updateMembership = async (req, res) => {
  try {
    const membership = await Membership.findByPk(req.params.id);

    if (!membership) {
      return res.status(404).json({ message: "Membresia no encontrada" });
    }

    const data = normalizeMembershipData(req.body);
    const validationError = validateMembershipData(data);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    await membership.update(data);
    res.json(membership);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la membresia",
      error: error.message
    });
  }
};

const deleteMembership = async (req, res) => {
  try {
    const membership = await Membership.findByPk(req.params.id);

    if (!membership) {
      return res.status(404).json({ message: "Membresia no encontrada" });
    }

    await membership.destroy();
    res.json({ message: "Membresia eliminada correctamente" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la membresia",
      error: error.message
    });
  }
};

module.exports = {
  getMemberships,
  createMembership,
  updateMembership,
  deleteMembership
};
