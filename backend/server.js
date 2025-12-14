require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const Stripe = require("stripe");
const pool = require("./db");

// =========================
// ROUTES
// =========================
const authRoutes = require("./routes/auth");
const showRoutes = require("./routes/showRoutes");
const showtimeRoutes = require("./routes/showtimeRoutes");
const seatRoutes = require("./routes/seatRoutes");

// =========================
// STRIPE
// =========================
console.log(
  "STRIPE_SECRET_KEY loaded:",
  process.env.STRIPE_SECRET_KEY
    ? process.env.STRIPE_SECRET_KEY.slice(0, 12) + "..."
    : "UNDEFINED"
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

// =========================
// MIDDLEWARE
// =========================
app.use(
  cors({
    origin: [
      "http://localhost:3001", 
      "http://localhost:3000", // CRA (kept)
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
  })
);

app.use(express.json());

// =========================
// API ROUTES
// =========================
app.use("/api/auth", authRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/seats", seatRoutes);

// =========================
// STRIPE — CREATE PAYMENT INTENT (FOR STRIPE ELEMENTS)
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { price } = req.body;

    if (!price || price <= 0) {
      return res.status(400).json({ error: "Invalid price value" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100,
      currency: "eur",
      automatic_payment_methods: {
        enabled: true
      }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({ error: "Payment intent creation failed" });
  }
});


// =========================
// STRIPE — SESSION STATUS
// =========================
app.get("/api/session-status", async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: "Missing session_id" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    res.json({
      status: session.payment_status,
      amount: session.amount_total,
      email: session.customer_details?.email
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve session" });
  }
});

// =========================
// CLEAN EXPIRED SEAT LOCKS
// =========================
setInterval(async () => {
  try {
    await pool.query("DELETE FROM seat_locks WHERE expires_at < NOW()");
    console.log("⏳ Expired seat locks cleaned");
  } catch (err) {
    console.error("Seat lock cleanup error:", err.message);
  }
}, 30 * 1000);

// =========================
// SERVE FRONTEND (LOCAL + AZURE)
// =========================
const frontendPath = process.env.WEBSITE_SITE_NAME
  ? "/home/site/wwwroot/frontend/build"
  : path.join(__dirname, "frontend", "build");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
