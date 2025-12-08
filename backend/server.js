require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const showRoutes = require("./routes/showRoutes");

const app = express();

// --------------------------------------
// CORS
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
// FRONTEND SERVING (LOCAL + AZURE)
// --------------------------------------

// Local development path (VS Code)
const localFrontend = path.join(__dirname, "..", "frontend", "build");

// Azure path
const azureFrontend = "/home/site/wwwroot";

// Detect Azure App Service
const isAzure = process.env.WEBSITE_INSTANCE_ID || process.env.WEBSITE_SITE_NAME;

// Choose the correct folder
const finalFrontendPath = isAzure ? azureFrontend : localFrontend;

console.log("Serving frontend from:", finalFrontendPath);

// Static files
app.use(express.static(finalFrontendPath));

// SPA fallback
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
