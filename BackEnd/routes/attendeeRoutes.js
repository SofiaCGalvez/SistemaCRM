const express = require("express");
const {
  getAttendees,
  createAttendee,
  updateAttendee,
  deleteAttendee
} = require("../controllers/attendeeController");
const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, authorizeRoles("admin", "staff"), getAttendees);
router.post("/", authenticateToken, authorizeRoles("admin", "staff"), createAttendee);
router.put("/:id", authenticateToken, authorizeRoles("admin", "staff"), updateAttendee);
router.delete("/:id", authenticateToken, authorizeRoles("admin", "staff"), deleteAttendee);

module.exports = router;
