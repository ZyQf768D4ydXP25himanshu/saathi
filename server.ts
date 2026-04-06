import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let stripe: Stripe | null = null;
const getStripe = () => {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      console.warn("STRIPE_SECRET_KEY is not set. Stripe operations will fail.");
      return null;
    }
    stripe = new Stripe(key);
  }
  return stripe;
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Stripe Checkout Session
  app.post("/api/create-checkout-session", async (req, res) => {
    const { eventId, title, budget, userEmail } = req.body;
    const stripeClient = getStripe();

    if (!stripeClient) {
      return res.status(500).json({ error: "Stripe is not configured." });
    }

    try {
      const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ["card", "upi"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: title,
                description: `Booking for event: ${title}`,
              },
              unit_amount: budget * 100, // Amount in paise
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.APP_URL || "http://localhost:3000"}/?booking=success&eventId=${eventId}`,
        cancel_url: `${process.env.APP_URL || "http://localhost:3000"}/?booking=cancel`,
        customer_email: userEmail,
        metadata: {
          eventId,
          userEmail,
        },
      });

      res.json({ id: session.id });
    } catch (error: any) {
      console.error("Stripe session error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Waitlist endpoint
  app.post("/api/waitlist", (req, res) => {
    const { email, city } = req.body;
    console.log(`Waitlist signup: ${email} from ${city}`);
    res.json({ success: true, message: "You're on the list!" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
