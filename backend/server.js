const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const showRoutes = require("./routes/showRoutes");

const app = express();

// CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false,
  })
);

app.use(express.json());

// API ROUTES
app.use("/auth", authRoutes);
app.use("/api/shows", showRoutes);

// ---------------- SERVE FRONTEND FOR AZURE ----------------
const frontendPath = path.join(__dirname, "frontend", "build");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend + Frontend running on port ${PORT}`);
});
