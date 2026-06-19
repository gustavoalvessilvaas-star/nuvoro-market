import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function getAdminSession() {
  const publicConfig = getSupabasePublicConfig();
  const supabaseAdmin = getSupabaseAdmin();
  if (!publicConfig.ok || !supabaseAdmin) return { ok: false as const, reason: "Supabase admin configuration is missing." };

  const cookieStore = cookies();
  const supabase = createServerClient(publicConfig.url, publicConfig.anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set() {
        return undefined;
      },
      remove() {
        return undefined;
      }
    }
  });

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return { ok: false as const, reason: "Admin login required." };

  const { data, error } = await supabaseAdmin
    .from("admin_users")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) return { ok: false as const, reason: "Admin role required." };
  return { ok: true as const, user, role: data.role as string };
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session.ok) redirect(`/admin/login?message=${encodeURIComponent(session.reason)}`);
  return session;
}
