import { NextResponse } from "next/server";
import { trackingSchema } from "@/lib/validators";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const parsed = trackingSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid tracking request" }, { status: 400 });
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ order_id: parsed.data.order_id, status: "processing", tracking_code: "" });
  }
  const { data } = await supabase
    .from("orders")
    .select("id, customer_email, fulfillment_status, tracking_code")
    .eq("id", parsed.data.order_id)
    .eq("customer_email", parsed.data.customer_email.toLowerCase())
    .single();
  if (!data) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({ order_id: data.id, status: data.fulfillment_status, tracking_code: data.tracking_code });
}
