const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const showRoutes = require("./routes/showRoutes");

const app = express();

// ------------------- CORS (LOCAL + AZURE READY) -------------------
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "https://YOUR_AZURE_FRONTEND_URL" // Replace after deployment
    ],
    methods: ["GET", "POST"],
    credentials: true
  })
);

// Body parser
app.use(express.json());

// --------------------- API ROUTES ---------------------
app.use("/auth", authRoutes);
app.use("/api/shows", showRoutes);

// ------------------------ SERVE REACT ------------------------
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// ---------------------- START SERVER ------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend + Frontend running at http://localhost:${PORT}`);
});
