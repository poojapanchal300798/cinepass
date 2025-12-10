require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const Stripe = require('stripe');

const authRoutes = require("./routes/auth");
const showRoutes = require("./routes/showRoutes");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-03-31.basil',
});

const app = express();

// --------------------------------------
// CORS SETTINGS
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

// Stripe checkout session initialization route
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { price } = req.body;
        const exampleItem = {
            price_data: {
                currency: 'EUR',
                product_data: {
                    name: 'T-shirt',
                },
                unit_amount: price * 100,
            },
            quantity: 1,
        };

        console.log('Creating checkout session for item:', exampleItem);
        const session = await stripe.checkout.sessions.create({
            line_items: [
                exampleItem,
            ],
            mode: 'payment',
            ui_mode: 'custom',
            customer_email: 'test@example.com', // Required for custom UI mode
            // The URL of your payment completion page - notice the session ID parameter,
            // the success page will need it to retrieve the session details to verify payment status
            return_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}'
        });

        console.log('Created checkout session:', session);

        res.json({client_secret: session.client_secret});
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(400).json({ error: error.message });
    }
});


// This endpoint retrieves the status of a checkout session, this is used after redirect to the return_url
app.get('/session-status', async (req, res) => {
    const { session_id } = req.query; // Get session_id from query parameters

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        res.json({
            id: session.id,
            payment_status: session.payment_status,
            amount_total: session.amount_total,
            currency: session.currency,
            customer_email: session.customer_email
        });
    } catch (error) {
        console.error('Error retrieving session:', error);
        res.status(400).json({ error: error.message });
    }
});

// --------------------------------------
// FRONTEND SERVING FOR LOCAL + AZURE
// --------------------------------------

// LOCAL DEVELOPMENT: serve backend/frontend/build
const localFrontendPath = path.join(__dirname, "frontend", "build");

// AZURE PATH: GitHub Actions places build here:
// /home/site/wwwroot/frontend/build
const azureFrontendPath = "/home/site/wwwroot/frontend/build";

// Detect Azure runtime using environment variable
const isAzure = !!process.env.WEBSITE_SITE_NAME;

// Select correct folder
const finalFrontendPath = isAzure ? azureFrontendPath : localFrontendPath;

console.log("📌 Serving frontend from:", finalFrontendPath);

// Serve static frontend files
app.use(express.static(finalFrontendPath));

// Fallback for React SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(finalFrontendPath, "index.html"));
});

// --------------------------------------
// START SERVER
// --------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
