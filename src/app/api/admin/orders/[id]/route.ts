import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const form = await request.formData();
  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("orders").update({
      tracking_code: String(form.get("tracking_code") || ""),
      fulfillment_status: form.get("tracking_code") ? "shipped" : undefined
    }).eq("id", params.id);
  }
  return NextResponse.redirect(new URL("/admin/orders", request.url));
}
