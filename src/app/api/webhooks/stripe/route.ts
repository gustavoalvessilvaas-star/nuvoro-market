import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return NextResponse.json({ error: "Stripe webhook not configured" }, { status: 503 });
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.order_id;
    const supabase = getSupabaseAdmin();
    if (supabase && orderId) {
      const { data } = await supabase.from("orders").update({
        payment_status: "paid",
        stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null
      }).eq("id", orderId).select("*").single();
      if (data) {
        await supabase.from("events").insert({ event_name: "Purchase", order_id: orderId, customer_email: data.customer_email, source: "stripe", metadata: { total: data.total_amount } });
        await sendOrderConfirmation(data);
      }
    }
  }

  return NextResponse.json({ received: true });
}
