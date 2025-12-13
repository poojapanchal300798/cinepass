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
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const app = express();

// =========================
// MIDDLEWARE
// =========================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
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
// STRIPE — CREATE SESSION
// =========================
app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { price } = req.body;

    if (!price || price <= 0) {
      return res.status(400).json({ error: "Invalid price value" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      line_items: [
        {
          price_data: {
            currency: "EUR",
            product_data: { name: "Movie Ticket" },
            unit_amount: price * 100
          },
          quantity: 1
        }
      ],
      return_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`
    });

    res.json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({ error: "Stripe session creation failed" });
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
