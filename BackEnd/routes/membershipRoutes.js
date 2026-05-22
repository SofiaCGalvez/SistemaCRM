const express = require("express");
const {
  getMemberships,
  createMembership,
  updateMembership,
  deleteMembership
} = require("../controllers/membershipController");
const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, authorizeRoles("admin", "staff"), getMemberships);
router.post("/", authenticateToken, authorizeRoles("admin"), createMembership);
router.put("/:id", authenticateToken, authorizeRoles("admin"), updateMembership);
router.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteMembership);

module.exports = router;
