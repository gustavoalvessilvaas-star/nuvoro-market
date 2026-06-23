import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { sendOrderConfirmation, sendTrackingUpdate } from "@/lib/email";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const adminSession = await getAdminSession();
  if (!adminSession.ok) return NextResponse.redirect(new URL("/admin/login", request.url));
  const form = await request.formData();
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data } = await supabase.from("orders").update({
      payment_status: String(form.get("payment_status") || "pending"),
      fulfillment_status: String(form.get("fulfillment_status") || (form.get("tracking_code") ? "shipped" : "processing")),
      tracking_code: String(form.get("tracking_code") || "") || null,
      tracking_url: String(form.get("tracking_url") || "") || null,
      supplier_order_id: String(form.get("supplier_order_id") || "") || null,
      internal_notes: String(form.get("internal_notes") || "") || null
    }).eq("id", params.id).select("*").single();

    const emailAction = String(form.get("email_action") || "");
    if (data && emailAction === "confirmation") await sendOrderConfirmation(data);
    if (data && emailAction === "tracking") await sendTrackingUpdate(data);
  }
  return NextResponse.redirect(new URL("/admin/orders", request.url));
}
