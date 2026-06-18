import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validators";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { sendMetaCapiEvent } from "@/lib/meta-capi";

export async function POST(request: Request) {
  const parsed = newsletterSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Enter a valid email address" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("newsletter_leads").upsert({
      email: parsed.data.email.toLowerCase(),
      source: parsed.data.source
    }, { onConflict: "email" });

    await supabase.from("events").insert({
      event_name: "Lead",
      customer_email: parsed.data.email.toLowerCase(),
      source: "newsletter",
      metadata: { source: parsed.data.source }
    });
  }

  await sendMetaCapiEvent("Lead", { email: parsed.data.email, source: parsed.data.source }).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
