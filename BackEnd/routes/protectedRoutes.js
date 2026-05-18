const express = require("express");
const {
  authenticateToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", authenticateToken, authorizeRoles("admin", "staff"), (req, res) => {
  res.json({
    message: "Ruta dashboard protegida",
    user: req.user
  });
});

router.get("/directorio", authenticateToken, authorizeRoles("admin", "staff"), (req, res) => {
  res.json({
    message: "Ruta directorio protegida",
    user: req.user
  });
});

router.get("/admin", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: "Ruta solo para admin",
    user: req.user
  });
});

module.exports = router;
