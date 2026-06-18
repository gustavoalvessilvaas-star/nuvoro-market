export type SupabasePublicConfig =
  | { ok: true; url: string; anonKey: string }
  | { ok: false; error: string };

function normalizeSupabaseUrl(rawUrl: string) {
  return rawUrl.trim().replace(/\/+$/, "");
}

export function validateSupabaseProjectUrl(rawUrl: string | undefined) {
  if (!rawUrl?.trim()) return "NEXT_PUBLIC_SUPABASE_URL is missing.";

  let parsed: URL;
  try {
    parsed = new URL(normalizeSupabaseUrl(rawUrl));
  } catch {
    return "NEXT_PUBLIC_SUPABASE_URL must be a valid URL like https://PROJECT_REF.supabase.co.";
  }

  if (parsed.protocol !== "https:") {
    return "NEXT_PUBLIC_SUPABASE_URL must start with https://.";
  }

  if (parsed.pathname !== "/" && parsed.pathname !== "") {
    return "NEXT_PUBLIC_SUPABASE_URL must be only the project base URL. Remove paths like /auth/v1 or /rest/v1.";
  }

  if (!parsed.hostname.endsWith(".supabase.co")) {
    return "NEXT_PUBLIC_SUPABASE_URL should look like https://PROJECT_REF.supabase.co.";
  }

  return null;
}

export function getSupabasePublicConfig(): SupabasePublicConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const urlError = validateSupabaseProjectUrl(url);

  if (urlError) return { ok: false, error: urlError };
  if (!anonKey?.trim()) return { ok: false, error: "NEXT_PUBLIC_SUPABASE_ANON_KEY is missing." };

  return { ok: true, url: normalizeSupabaseUrl(url as string), anonKey: anonKey.trim() };
}

export function getSupabaseServiceConfig() {
  const publicConfig = getSupabasePublicConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!publicConfig.ok) return publicConfig;
  if (!serviceRoleKey?.trim()) return { ok: false as const, error: "SUPABASE_SERVICE_ROLE_KEY is missing on the server." };

  return { ok: true as const, url: publicConfig.url, serviceRoleKey: serviceRoleKey.trim() };
}
