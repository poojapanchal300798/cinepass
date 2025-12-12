require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const Stripe = require("stripe");
const pool = require("./db"); // ✅ FIXED DB IMPORT

// ROUTES
const authRoutes = require("./routes/auth");
const showRoutes = require("./routes/showRoutes");
const showtimeRoutes = require("./routes/showtimeRoutes"); // ✅ Showtime route
const seatRoutes = require("./routes/seatRoutes");         // ✅ Seat locking route

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-03-31.basil",
});

const app = express();

// ------------------------
// CORS
// ------------------------
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ------------------------
// API ROUTES
// ------------------------
app.use("/auth", authRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/showtimes", showtimeRoutes);
app.use("/api/seats", seatRoutes); // 🔥 IMPORTANT FOR LOCKING SEATS

// ------------------------
// STRIPE CHECKOUT
// ------------------------
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { price } = req.body;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "EUR",
            unit_amount: price * 100,
            product_data: { name: "Movie Tickets" },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      ui_mode: "custom",
      customer_email: "test@example.com",
      return_url:
        "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
    });

    res.json({ client_secret: session.client_secret });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(400).json({ error: error.message });
  }
});

// ------------------------
// STRIPE SESSION STATUS
// ------------------------
app.get("/session-status", async (req, res) => {
  try {
    const { session_id } = req.query;
    const session = await stripe.checkout.sessions.retrieve(session_id);

    res.json({
      id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
    });
  } catch (error) {
    console.error("Session error:", error);
    res.status(400).json({ error: error.message });
  }
});

// ------------------------
// AUTO CLEAN EXPIRED SEAT LOCKS
// ------------------------
setInterval(async () => {
  try {
    await pool.query(`DELETE FROM seat_locks WHERE expires_at < NOW()`);
    console.log("⏳ Expired seat locks removed");
  } catch (err) {
    console.error("Cleanup error:", err);
  }
}, 30 * 1000); // every 30 sec

// ------------------------
// FRONTEND SERVING (LOCAL + AZURE)
// ------------------------
const localFrontendPath = path.join(__dirname, "frontend", "build");
const azureFrontendPath = "/home/site/wwwroot/frontend/build";

const finalFrontendPath = process.env.WEBSITE_SITE_NAME
  ? azureFrontendPath
  : localFrontendPath;

console.log("📌 Serving frontend from:", finalFrontendPath);

app.use(express.static(finalFrontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(finalFrontendPath, "index.html"));
});

// ------------------------
// START SERVER
// ------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
