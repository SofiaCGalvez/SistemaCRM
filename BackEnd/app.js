const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const sequelize = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);

sequelize.authenticate()
  .then(() => {
    console.log("MySQL conectado");
  })
  .catch((error) => {
    console.log("Error de conexion:");
    console.log(error);
  });

app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
