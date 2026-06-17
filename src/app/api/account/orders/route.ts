import { NextResponse } from "next/server";
import { getSupabaseAdmin, getSupabasePublic } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const supabasePublic = getSupabasePublic();
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabasePublic || !supabaseAdmin) {
    return NextResponse.json({ orders: [], warning: "Supabase is not configured yet." });
  }

  const { data: userData, error: userError } = await supabasePublic.auth.getUser(token);
  const email = userData.user?.email?.toLowerCase();
  if (userError || !email) return NextResponse.json({ error: "Invalid session." }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("customer_email", email)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return NextResponse.json({ error: "Orders could not be loaded." }, { status: 500 });
  return NextResponse.json({ orders: data || [] });
}
