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

router.get("/", authenticateToken, authorizeRoles("admin"), getAttendees);
router.post("/", authenticateToken, authorizeRoles("admin"), createAttendee);
router.put("/:id", authenticateToken, authorizeRoles("admin"), updateAttendee);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteAttendee);

module.exports = router;
