"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export function getSupabaseBrowserConfigError() {
  const config = getSupabasePublicConfig();
  return config.ok ? null : config.error;
}

export function getSupabaseBrowser() {
  const config = getSupabasePublicConfig();
  if (!config.ok) return null;
  return createBrowserClient(config.url, config.anonKey);
}
