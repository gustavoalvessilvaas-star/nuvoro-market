import { NextResponse } from "next/server";
import { trackingSchema } from "@/lib/validators";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const parsed = trackingSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid tracking request" }, { status: 400 });
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ order_id: parsed.data.order_id, status: "processing", tracking_code: "", tracking_url: "", updated_at: new Date().toISOString(), items: [] });
  }
  const { data } = await supabase
    .from("orders")
    .select("id, customer_email, fulfillment_status, tracking_code, updated_at, order_items(quantity, unit_price, product_snapshot)")
    .eq("id", parsed.data.order_id)
    .eq("customer_email", parsed.data.customer_email.toLowerCase())
    .single();
  if (!data) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({
    order_id: data.id,
    status: data.fulfillment_status,
    tracking_code: data.tracking_code,
    tracking_url: data.tracking_code ? `https://www.17track.net/en/track?nums=${encodeURIComponent(data.tracking_code)}` : "",
    updated_at: data.updated_at,
    items: data.order_items || []
  });
}
