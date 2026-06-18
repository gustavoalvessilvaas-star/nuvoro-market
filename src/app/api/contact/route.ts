import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { sendSupportNotification } from "@/lib/email";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const parsed = contactSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid contact form" }, { status: 400 });
  if (parsed.data.company) return NextResponse.json({ ok: true });
  await sendSupportNotification(parsed.data);
  const supabase = getSupabaseAdmin();
  if (supabase) {
    try {
      await supabase.from("support_requests").insert({
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        order_id: parsed.data.order_id || null,
        reason: parsed.data.reason,
        message: parsed.data.message,
        status: "open"
      }).throwOnError();
    } catch {
      // Older Supabase installs may not have support_requests yet. Email/event fallback still works.
    }
    await supabase.from("events").insert([
      { event_name: "Lead", customer_email: parsed.data.email, source: "contact", metadata: parsed.data },
      { event_name: "ContactSubmit", customer_email: parsed.data.email, source: "contact", metadata: parsed.data }
    ]);
  }
  return NextResponse.json({ ok: true });
}
