import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig, getSupabaseServiceConfig } from "@/lib/supabase/config";

export function getSupabaseAdmin() {
  const config = getSupabaseServiceConfig();
  if (!config.ok) return null;
  return createClient(config.url, config.serviceRoleKey, { auth: { persistSession: false } });
}

export function getSupabasePublic() {
  const config = getSupabasePublicConfig();
  if (!config.ok) return null;
  return createClient(config.url, config.anonKey);
}
