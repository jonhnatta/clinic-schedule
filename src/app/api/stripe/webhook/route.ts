import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

export const POST = async (request: Request) => {
  try {
    console.log("=== Webhook iniciado ===", new Date().toISOString());
    console.log("Headers recebidos:", Object.fromEntries(request.headers.entries()));
    
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Stripe secret key not found");
    }
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("Stripe signature not found");
    }
    const text = await request.text();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-05-28.basil",
    });
    const event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log(`Event recebido: ${event.type} - ID: ${event.id}`);

  switch (event.type) {
    case "invoice.paid": {
      console.log("=== Processando invoice.paid ===");
      const invoice = event.data.object as any;
      console.log("Invoice object:", JSON.stringify(invoice, null, 2));
      
      // O invoice pode ter subscription em diferentes lugares
      let subscriptionId;
      let userId;
      
      if (typeof invoice.subscription === 'string') {
        subscriptionId = invoice.subscription;
      } else if (invoice.subscription?.id) {
        subscriptionId = invoice.subscription.id;
      } else if (invoice.parent?.subscription_details?.subscription) {
        subscriptionId = invoice.parent.subscription_details.subscription;
        // O userId pode estar nos metadados do parent
        userId = invoice.parent.subscription_details.metadata?.userId;
      }
      
      // Se não encontrou subscription, pode ser que esteja nos line items
      if (!subscriptionId && invoice.lines?.data) {
        for (const lineItem of invoice.lines.data) {
          if (lineItem.parent?.subscription_item_details?.subscription) {
            subscriptionId = lineItem.parent.subscription_item_details.subscription;
            // O userId pode estar nos metadados do line item
            userId = lineItem.metadata?.userId;
            break;
          }
        }
      }
      
      console.log("Subscription ID encontrado:", subscriptionId);
      console.log("User ID dos metadados:", userId);
        
      if (!subscriptionId) {
        console.log("Nenhum subscription ID encontrado, ignorando este invoice");
        break;
      }
      
      // Buscar a subscription para obter os metadados
      console.log("Buscando subscription no Stripe...");
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      console.log("Subscription metadata:", subscription.metadata);
      
      // Usar o userId dos metadados encontrados ou da subscription
      const finalUserId = userId || subscription.metadata?.userId;
      
      if (!finalUserId) {
        throw new Error("User ID not found in subscription metadata");
      }
      
      const customerId = subscription.customer as string;
      
      console.log("Atualizando usuário:", { userId: finalUserId, subscriptionId: subscription.id, customerId });
      
      await db
        .update(usersTable)
        .set({
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: customerId,
          plan: "essential",
        })
        .where(eq(usersTable.id, finalUserId));
        
      console.log("Usuário atualizado com sucesso!");
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as any;
      
      if (!subscription.metadata?.userId) {
        throw new Error("User ID not found in subscription metadata");
      }
      
      const subscriptionUserId = subscription.metadata.userId;
      
      await db
        .update(usersTable)
        .set({
          stripeSubscriptionId: null,
          stripeCustomerId: null,
          plan: null,
        })
        .where(eq(usersTable.id, subscriptionUserId));
      break;
    }
    default:
      console.log(`Evento não tratado: ${event.type}`);
  }
  
  console.log("=== Webhook processado com sucesso ===");
  return NextResponse.json({
    received: true,
  });
  
  } catch (error) {
    console.error("=== ERRO NO WEBHOOK ===");
    console.error("Erro:", error);
    console.error("Stack:", error instanceof Error ? error.stack : 'N/A');
    return NextResponse.json(
      { error: "Webhook error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};