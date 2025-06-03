"use client";

import { useEffect } from "react";

export function TestStripe() {
  useEffect(() => {
    console.log("=== TESTE DE VARIÁVEIS DE AMBIENTE ===");
    console.log("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    console.log("NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL);
    console.log("NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL:", process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL);
  }, []);

  return null;
}
