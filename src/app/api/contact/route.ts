import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { sendSupportNotification } from "@/lib/email";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const parsed = contactSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid contact form" }, { status: 400 });
  await sendSupportNotification(parsed.data);
  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("events").insert({ event_name: "Lead", customer_email: parsed.data.email, source: "contact", metadata: parsed.data });
  }
  return NextResponse.json({ ok: true });
}
