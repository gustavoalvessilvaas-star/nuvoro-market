import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validators";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/utils";

type CheckoutItem = {
  cart_id?: string;
  product_id: string;
  quantity: number;
  unit_price?: number;
  bundle_id?: string;
  bundle_label?: string;
  product: {
    id?: string;
    name: string;
    description: string;
    price: number;
  };
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = checkoutSchema.safeParse(body.customer || {});
  if (!parsed.success) return NextResponse.json({ error: "Invalid customer information" }, { status: 400 });
  const items = Array.isArray(body.items) ? body.items as CheckoutItem[] : [];
  if (!items.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: "Stripe is not configured. Add STRIPE_SECRET_KEY to enable checkout." }, { status: 503 });

  const supabase = getSupabaseAdmin();
  const total = items.reduce((sum, item) => sum + Number(item.unit_price || item.product.price) * item.quantity, 0);
  let orderId = `dev_${Date.now()}`;
  if (supabase) {
    const { data: customer } = await supabase.from("customers").upsert({
      name: parsed.data.customer_name,
      email: parsed.data.customer_email.toLowerCase(),
      phone: parsed.data.customer_phone
    }, { onConflict: "email" }).select("id").single();
    const { data, error } = await supabase.from("orders").insert({
      customer_id: customer?.id,
      customer_name: parsed.data.customer_name,
      customer_email: parsed.data.customer_email.toLowerCase(),
      customer_phone: parsed.data.customer_phone,
      shipping_address: {
        address1: parsed.data.address1,
        address2: parsed.data.address2,
        city: parsed.data.city,
        state: parsed.data.state,
        zip: parsed.data.zip,
        country: parsed.data.country
      },
      total_amount: total,
      payment_status: "pending",
      fulfillment_status: "order_received"
    }).select("id").single();
    if (error) return NextResponse.json({ error: "Order could not be created" }, { status: 500 });
    orderId = data.id;
    await supabase.from("order_items").insert(items.map((item) => ({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: Number(item.unit_price || item.product.price),
      product_snapshot: { ...item.product, bundle_id: item.bundle_id, bundle_label: item.bundle_label }
    })));
  }

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: parsed.data.customer_email,
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(Number(item.unit_price || item.product.price) * 100),
          product_data: { name: item.bundle_label ? `${item.product.name} (${item.bundle_label})` : item.product.name, description: item.product.description }
        }
      })),
      shipping_address_collection: { allowed_countries: ["US"] },
      metadata: {
        order_id: orderId,
        customer_email: parsed.data.customer_email,
        internal_cart_ids: items.map((item) => item.cart_id).filter(Boolean).join(","),
        utm: JSON.stringify(body.utm || {})
      },
      success_url: siteUrl(`/thank-you?order=${orderId}&email=${encodeURIComponent(parsed.data.customer_email)}`),
      cancel_url: siteUrl("/checkout")
    });
  } catch {
    return NextResponse.json({ error: "Stripe checkout could not be started. Check Stripe keys and try again." }, { status: 502 });
  }

  if (supabase) await supabase.from("orders").update({ stripe_checkout_session_id: session.id }).eq("id", orderId);
  return NextResponse.json({ url: session.url });
}
