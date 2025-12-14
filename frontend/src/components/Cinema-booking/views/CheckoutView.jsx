import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState, useRef } from "react";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
);

function CheckoutView({ totalAmount }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

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

        if (!data?.clientSecret) {
          throw new Error("Missing client secret");
        }

        setClientSecret(data.clientSecret);
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
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}

export default CheckoutView;
