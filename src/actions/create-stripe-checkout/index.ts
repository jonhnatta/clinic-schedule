"use server";

import { headers } from "next/headers";
import Stripe from "stripe";

import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

export const createStripeCheckout = actionClient.action(async () => {
  console.log("=== Criando checkout Stripe ===");
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("Usuário logado:", session?.user?.id);
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key not found");
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-05-28.basil",
  });
  const { id: sessionId } = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription`,
    subscription_data: {
      metadata: {
        userId: session.user.id,
      },
    },
    line_items: [
      {
        price: process.env.STRIPE_ESSENTIAL_PLAN_PRICE_ID,
        quantity: 1,
      },
    ],
  });
  console.log("Sessão criada com sucesso:", sessionId);
  return {
    sessionId,
  };
});