const express = require("express");
const {
  getDirectory,
  createDirectoryEntry,
  updateDirectoryEntry,
  deleteDirectoryEntry
} = require("../controllers/directoryController");
const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, authorizeRoles("admin", "staff"), getDirectory);
router.post("/", authenticateToken, authorizeRoles("admin", "staff"), createDirectoryEntry);
router.put("/:id", authenticateToken, authorizeRoles("admin", "staff"), updateDirectoryEntry);
router.delete("/:id", authenticateToken, authorizeRoles("admin", "staff"), deleteDirectoryEntry);

module.exports = router;
