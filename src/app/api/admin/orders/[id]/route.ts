import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const adminSession = await getAdminSession();
  if (!adminSession.ok) return NextResponse.redirect(new URL("/admin/login", request.url));
  const form = await request.formData();
  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("orders").update({
      tracking_code: String(form.get("tracking_code") || ""),
      tracking_url: String(form.get("tracking_url") || "") || null,
      supplier_order_id: String(form.get("supplier_order_id") || "") || null,
      fulfillment_status: String(form.get("fulfillment_status") || (form.get("tracking_code") ? "shipped" : "processing"))
    }).eq("id", params.id);
  }
  return NextResponse.redirect(new URL("/admin/orders", request.url));
}
