import { NextResponse } from "next/server";
import { eventSchema } from "@/lib/validators";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { sendMetaCapiEvent } from "@/lib/meta-capi";

export async function POST(request: Request) {
  const parsed = eventSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  const supabase = getSupabaseAdmin();
  const metadata = parsed.data.metadata || {};
  const utm = typeof metadata.utm === "object" && metadata.utm ? metadata.utm as Record<string, unknown> : metadata;
  if (supabase) {
    await supabase.from("events").insert({
      ...parsed.data,
      product_id: parsed.data.product_id || String(metadata.product_id || "") || null,
      utm_source: String(utm.utm_source || "") || null,
      utm_medium: String(utm.utm_medium || "") || null,
      utm_campaign: String(utm.utm_campaign || "") || null,
      utm_content: String(utm.utm_content || "") || null,
      utm_term: String(utm.utm_term || "") || null
    });
  }
  await sendMetaCapiEvent(parsed.data.event_name, parsed.data.metadata || {}).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
