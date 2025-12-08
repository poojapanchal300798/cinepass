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

// LOCAL DEVELOPMENT: serve backend/frontend/build
const localFrontendPath = path.join(__dirname, "frontend", "build");

// AZURE PATH: GitHub Actions places build here:
// /home/site/wwwroot/frontend/build
const azureFrontendPath = "/home/site/wwwroot/frontend/build";

// Detect Azure runtime using environment variable
const isAzure = !!process.env.WEBSITE_SITE_NAME;

// Select correct folder
const finalFrontendPath = isAzure ? azureFrontendPath : localFrontendPath;

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
  console.log(`🚀 Backend running on port ${PORT}`);
});
