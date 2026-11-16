const path = require("path");
// Explicitly resolve .env from backend directory and fallback to process.cwd()
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const validateEnv = require("./config/envValidation");
const connectDB = require("./config/database");

// Security Middleware
const setSecurityHeaders = require("./middleware/securityHeaders");
const sanitizeInput = require("./middleware/sanitizer");
const { authLimiter, generalLimiter, emergencyLimiter } = require("./middleware/rateLimiter");
const auditLogger = require("./middleware/auditLogger");
const errorHandler = require("./middleware/errorHandler");
const checkDbConnection = require("./middleware/checkDbConnection");

// Route Modules
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const pharmacyRoutes = require("./routes/pharmacyRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const ambulanceRoutes = require("./routes/ambulanceRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminRoutes = require("./routes/adminRoutes");
const emergencyContactRoutes = require("./routes/emergencyContactRoutes");

// 1. Environment Validation
validateEnv();

const app = express();

// 2. Global Security Headers & CORS
app.use(setSecurityHeaders);

const isDev = process.env.NODE_ENV !== "production";
const defaultOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
];
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim()).filter(Boolean)
  : defaultOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes("*") ||
        (isDev && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))
      ) {
        callback(null, true);
      } else {
        callback(new Error("CORS Policy Restriction: Domain not allowed"));
      }
    },
    credentials: true,
  })
);

// 3. Request Body Size Limits & Parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// 4. Health check endpoints (exposed before rate limiters/auth)
const getHealthHandler = (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    status: dbConnected ? "healthy" : "degraded",
    database: dbConnected ? "connected" : "disconnected",
    environment: process.env.NODE_ENV || "development",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
};

app.get("/health", getHealthHandler);
app.get("/api/health", getHealthHandler);

// 5. Input Sanitization (NoSQL Injection Defense)
app.use(sanitizeInput);

// 6. Security Audit Logging
app.use(auditLogger);

// 7. Rate Limiting Middleware Application
app.use("/api/ambulances/request", emergencyLimiter);
app.use("/api", generalLimiter);

// 8. Database Connectivity Guard (Immediately returns 503 if DB disconnected to prevent Mongoose buffering hang)
app.use("/api", checkDbConnection);

// 9. API Routes Mounting
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/ambulances", ambulanceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/emergency-contacts", emergencyContactRoutes);

// 9. Centralized Global Error Handler (Must be attached last)
app.use(errorHandler);

const PORT = process.env.PORT || 5050;
let server;

const startServer = async () => {
  await connectDB();
  server = app.listen(PORT, () => {
    console.log(`🚀 Secure Hospitality API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
  });
};

startServer();

// 10. Graceful Shutdown Signals Handling
const gracefulShutdown = (signal) => {
  console.log(`\n🛑 Received ${signal}. Initiating graceful shutdown...`);
  if (server) {
    server.close(async () => {
      console.log("HTTP server closed.");
      try {
        await mongoose.connection.close(false);
        console.log("MongoDB connection closed cleanly.");
        process.exit(0);
      } catch (err) {
        console.error("Error closing MongoDB connection:", err);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }

  setTimeout(() => {
    console.error("Forced exit after shutdown timeout.");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

module.exports = { app, server };