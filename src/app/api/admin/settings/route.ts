import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const settingKeys = [
  "store_name",
  "support_email",
  "default_shipping_estimate",
  "default_processing_time",
  "default_guarantee_text",
  "logo_url",
  "favicon_url",
  "instagram_url",
  "facebook_url",
  "tiktok_url"
];

export async function POST(request: Request) {
  const adminSession = await getAdminSession();
  if (!adminSession.ok) return NextResponse.redirect(new URL("/admin/login", request.url));
  const form = await request.formData();
  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.redirect(new URL("/admin/settings", request.url));

  const rows = settingKeys.map((key) => ({
    key,
    value: String(form.get(key) || ""),
    updated_at: new Date().toISOString()
  }));

  await supabase.from("store_settings").upsert(rows, { onConflict: "key" });
  return NextResponse.redirect(new URL("/admin/settings", request.url));
}
