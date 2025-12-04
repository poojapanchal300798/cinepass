const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// ROUTES
const authRoutes = require("./routes/auth");
const showRoutes = require("./routes/showRoutes");

const app = express();

// --------------------------------------
// CORS
// --------------------------------------
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false,
  })
);

app.use(express.json());

// --------------------------------------
// API ROUTES
// --------------------------------------
app.use("/auth", authRoutes);
app.use("/api/shows", showRoutes);

// --------------------------------------
// SERVE FRONTEND (WORKS ON AZURE + LOCAL)
// --------------------------------------

// __dirname = /home/site/wwwroot (Azure)
// __dirname = C:/your/local/project/backend (local)

const frontendPath = path.join(__dirname, "frontend", "build");

console.log("Frontend build path:", frontendPath);

app.use(express.static(frontendPath));

// For ANY route not starting with /auth or /api → return React
app.get("*", (req, res) => {
  const indexFile = path.join(frontendPath, "index.html");
  console.log("Serving index.html from:", indexFile);
  res.sendFile(indexFile);
});

// --------------------------------------
// START SERVER
// --------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend + Frontend running on port ${PORT}`);
});
