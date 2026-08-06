const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");

// Route imports
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const animalRoutes = require("./routes/animalRoutes");
const teamRoutes = require("./routes/teamRoutes");
const activityRoutes = require("./routes/activityRoutes");
const donationRoutes = require("./routes/donationRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN 
      ? [process.env.FRONTEND_ORIGIN, "http://localhost:5173"] 
      : ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// Trigger seed script from cloud environment
app.get("/api/trigger-seed", (req, res) => {
  const { exec } = require("child_process");
  const scriptPath = path.join(__dirname, "seed", "seedExtended.js");

  exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message, stderr });
    }
    res.json({ message: "Seed successful!", stdout });
  });
});

// Error middleware (must be last)
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Wild Shield server running on port ${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
  });
});
