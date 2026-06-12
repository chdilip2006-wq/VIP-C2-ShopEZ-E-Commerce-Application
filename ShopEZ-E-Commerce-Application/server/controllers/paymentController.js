import Stripe from "stripe";
import Product from "../models/Product.js";

export async function createPaymentIntent(req, res) {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Cart items are required" });
  }

  const products = await Product.find({ _id: { $in: items.map((item) => item.product) } });
  const productMap = new Map(products.map((product) => [product.id, product]));
  let subtotal = 0;
  for (const item of items) {
    const product = productMap.get(item.product);
    const quantity = Number(item.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || product.stockCount < quantity) {
      return res.status(400).json({ message: "One or more cart items are invalid or unavailable" });
    }
    subtotal += product.price * quantity;
  }
  const amount = subtotal + (subtotal >= 2000 ? 0 : 199);

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
  const livePaymentsEnabled = process.env.STRIPE_LIVE_PAYMENTS === "true";

  if (!stripeSecretKey) {
    if (livePaymentsEnabled) {
      return res.status(503).json({
        message: "Live payments are enabled, but STRIPE_SECRET_KEY is not configured."
      });
    }

    return res.json({
      demo: true,
      paymentId: `demo_${Date.now()}`,
      message: "Demo payment approved. Configure STRIPE_SECRET_KEY for live Stripe payments."
    });
  }

  if (livePaymentsEnabled && !stripeSecretKey.startsWith("sk_live_")) {
    return res.status(503).json({
      message: "Live payments require a Stripe live secret key."
    });
  }

  const stripe = new Stripe(stripeSecretKey);
  const intent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: process.env.STRIPE_CURRENCY || "inr",
    automatic_payment_methods: { enabled: true }
  });
  res.json({ clientSecret: intent.client_secret, paymentId: intent.id });
}
