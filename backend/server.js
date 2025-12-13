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
// STRIPE INITIALIZATION
// =========================
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

const app = express();

// =========================
// CORS CONFIGURATION
// =========================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env.FRONTEND_URL, // Azure frontend URL
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// =========================
// API ROUTES
// =========================
app.use("/auth", authRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/seats", seatRoutes);

// =====================================================
// STRIPE — CREATE CHECKOUT SESSION
// =====================================================
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { price } = req.body;

    if (!price || price <= 0) {
      return res.status(400).json({ error: "Invalid price value" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "custom",
      customer_email: "test@example.com", // ok for demo mode

      line_items: [
        {
          price_data: {
            currency: "EUR",
            product_data: { name: "Movie Ticket" },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],

      return_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    console.log("✔ Stripe session created:", session.id);

    res.json({
      client_secret: session.client_secret,
    });
  } catch (error) {
    console.error("❌ Stripe session error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// =====================================================
// STRIPE — GET PAYMENT SESSION STATUS
// =====================================================
app.get("/session-status", async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: "Missing session_id parameter" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    res.json({
      id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_details?.email,
    });
  } catch (error) {
    console.error("❌ Error fetching session status:", error.message);
    res.status(400).json({ error: error.message });
  }
});

// =====================================================
// AUTO DELETE EXPIRED SEAT LOCKS EVERY 30s
// =====================================================
setInterval(async () => {
  try {
    await pool.query("DELETE FROM seat_locks WHERE expires_at < NOW()");
    console.log("⏳ Expired seat locks cleaned");
  } catch (err) {
    console.error("❌ Seat lock cleanup error:", err);
  }
}, 30 * 1000);

// =====================================================
// HOST FRONTEND (LOCAL + AZURE)
// =====================================================
const localFrontendPath = path.join(__dirname, "frontend", "build");
const azureFrontendPath = "/home/site/wwwroot/frontend/build";

const finalFrontendPath = process.env.WEBSITE_SITE_NAME
  ? azureFrontendPath // running on Azure
  : localFrontendPath; // local dev

console.log("📁 Serving frontend from:", finalFrontendPath);

// Serve frontend static files
app.use(express.static(finalFrontendPath));

// React SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(finalFrontendPath, "index.html"));
});

// =====================================================
// START SERVER
// =====================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
