require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const showRoutes = require("./routes/showRoutes");

const app = express();


// --------------------------------------
// CORS FIX (for localhost & Azure)
// --------------------------------------
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL].filter(Boolean),
    methods: ["GET", "POST"],
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
// FRONTEND BUILD SERVING (IMPORTANT)
// --------------------------------------
const frontendPath = path.join(__dirname, "..", "frontend", "build");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});


// --------------------------------------
// START SERVER
// --------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
