const express = require("express");
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} = require("../controllers/eventController");
const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, authorizeRoles("admin", "staff"), getEvents);
router.post("/", authenticateToken, authorizeRoles("admin", "staff"), createEvent);
router.put("/:id", authenticateToken, authorizeRoles("admin", "staff"), updateEvent);
router.delete("/:id", authenticateToken, authorizeRoles("admin", "staff"), deleteEvent);

module.exports = router;
