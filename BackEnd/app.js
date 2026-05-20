const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
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

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.warn("Security warning: set JWT_SECRET to a long random value with at least 32 characters.");
}

const defaultAllowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];
const configuredAllowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = new Set([...defaultAllowedOrigins, ...configuredAllowedOrigins]);
const isAllowedOrigin = (origin) => {
  return !origin || allowedOrigins.has(origin) || /\.netlify\.app$/.test(origin);
};

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use((req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    next();
    return;
  }

  const origin = req.get("origin");

  if (!isAllowedOrigin(origin)) {
    return res.status(403).json({ message: "Request origin is not allowed" });
  }

  next();
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: Number(process.env.AUTH_RATE_LIMIT || 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again later." }
});

app.use("/api/attendees", attendeeRoutes);
app.use("/api/auth/login", authLimiter);
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
