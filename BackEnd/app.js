const express = require("express");
const cors = require("cors");
require("dotenv").config();

const attendeeRoutes = require("./routes/attendeeRoutes");
const authRoutes = require("./routes/authRoutes");
const directoryRoutes = require("./routes/directoryRoutes");
const eventRoutes = require("./routes/eventRoutes");
const membershipRoutes = require("./routes/membershipRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const taskRoutes = require("./routes/taskRoutes");
const sequelize = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/attendees", attendeeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/directory", directoryRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/tasks", taskRoutes);

sequelize.authenticate()
  .then(() => {
    console.log("MySQL conectado");
    return sequelize.sync();
  })
  .then(() => {
    console.log("Tablas sincronizadas");
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
