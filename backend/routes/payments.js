const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { price } = req.body;

    if (!price) {
      return res.status(400).json({ error: "Missing price" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Movie Ticket",
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      return_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`
    });

    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(400).json({ error: err.message });
  }
});

// Session status
router.get("/session-status", async (req, res) => {
  try {
    const { session_id } = req.query;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    res.json({
      status: session.status,
      amount: session.amount_total,
      email: session.customer_details?.email,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
    