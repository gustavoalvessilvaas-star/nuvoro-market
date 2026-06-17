import { NextResponse } from "next/server";
import { eventSchema } from "@/lib/validators";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { sendMetaCapiEvent } from "@/lib/meta-capi";

export async function POST(request: Request) {
  const parsed = eventSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  const supabase = getSupabaseAdmin();
  if (supabase) {
    await supabase.from("events").insert(parsed.data);
  }
  await sendMetaCapiEvent(parsed.data.event_name, parsed.data.metadata || {}).catch(() => undefined);
  return NextResponse.json({ ok: true });
}
