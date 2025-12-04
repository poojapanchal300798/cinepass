const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const movieRoutes = require('./routes/movies');
const showRoutes = require('./routes/shows');
const bookingRoutes = require('./routes/bookings');
const errorMiddleware = require('./middlewares/errorMiddleware');


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
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);

// Error handling middleware
app.use(errorMiddleware);

// ---------------- SERVE FRONTEND (CORRECT PATH) ----------------
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend + Frontend running on port ${PORT}`);
});
