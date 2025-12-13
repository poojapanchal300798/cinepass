import { CheckoutProvider } from "@stripe/react-stripe-js/checkout";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import CheckoutForm from "../CheckoutForm";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function CheckoutView({ totalAmount }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function createSession() {
      try {
        const res = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price: totalAmount }),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data?.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error("Missing client secret");
        }
      } catch (err) {
        console.error("Error creating checkout session:", err);
        setError("Failed to initialize payment.");
      }
    }

    createSession();
  }, [totalAmount]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!clientSecret) return <p>Loading payment…</p>;

  return (
    <CheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </CheckoutProvider>
  );
}

export default CheckoutView;
