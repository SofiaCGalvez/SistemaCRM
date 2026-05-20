const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require("../controllers/taskController");
const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, authorizeRoles("admin", "staff"), getTasks);
router.post("/", authenticateToken, authorizeRoles("admin", "staff"), createTask);
router.put("/:id", authenticateToken, authorizeRoles("admin", "staff"), updateTask);
router.delete("/:id", authenticateToken, authorizeRoles("admin", "staff"), deleteTask);

module.exports = router;
