require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const showRoutes = require("./routes/showRoutes");

const app = express();

// --------------------------------------
// CORS SETTINGS
// --------------------------------------
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// --------------------------------------
// API ROUTES
// --------------------------------------
app.use("/auth", authRoutes);
app.use("/api/shows", showRoutes);

// --------------------------------------
// FRONTEND SERVING FOR LOCAL + AZURE
// --------------------------------------

// We will store the frontend build inside:
// backend/frontend-build/
const finalFrontendPath = path.join(__dirname, "frontend-build");

console.log("📌 Serving frontend from:", finalFrontendPath);

// Serve static frontend files
app.use(express.static(finalFrontendPath));

// Fallback for React SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(finalFrontendPath, "index.html"));
});

// --------------------------------------
// START SERVER
// --------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
