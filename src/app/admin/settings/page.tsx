import { Save, Settings } from "lucide-react";
import { AdminPanel, StatusBadge } from "@/components/admin/admin-ui";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminDashboard } from "@/lib/admin-data";
import { getSupabasePublicConfig, getSupabaseServiceConfig } from "@/lib/supabase/config";

export const metadata = { title: "Admin Settings" };
export const dynamic = "force-dynamic";

type SettingRow = {
  key: string;
  value?: string | null;
};

function configured(value?: string | null) {
  return value ? "configured" : "missing";
}

function settingValue(settings: SettingRow[], key: string, fallback = "") {
  return settings.find((setting) => setting.key === key)?.value || fallback;
}

export default async function AdminSettingsPage() {
  await requireAdmin();
  const { settings } = await getAdminDashboard() as { settings: SettingRow[] };
  const supabasePublic = getSupabasePublicConfig();
  const supabaseService = getSupabaseServiceConfig();
  const integrationStatus = [
    ["Supabase URL", supabasePublic.ok ? "configured" : "missing"],
    ["Supabase anon key", supabasePublic.ok ? "configured" : "missing"],
    ["Supabase service role", supabaseService.ok ? "configured" : "missing"],
    ["Stripe", configured(process.env.STRIPE_SECRET_KEY)],
    ["Stripe webhook", configured(process.env.STRIPE_WEBHOOK_SECRET)],
    ["Resend", configured(process.env.RESEND_API_KEY)],
    ["GA4", configured(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID)],
    ["Meta Pixel", configured(process.env.NEXT_PUBLIC_META_PIXEL_ID)],
    ["Meta CAPI", configured(process.env.META_CAPI_ACCESS_TOKEN && process.env.META_CAPI_PIXEL_ID)],
    ["Vercel", configured(process.env.VERCEL)]
  ];

  return (
    <AdminShell
      title="Settings"
      description="Store-level defaults and integration readiness. Secret values are never displayed in the browser."
    >
      <AdminPanel>
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5 text-aqua" />
          <h2 className="text-2xl font-black">Integration status</h2>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {integrationStatus.map(([label, status]) => (
            <div key={label} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <span className="text-sm font-bold text-white/68">{label}</span>
              <StatusBadge value={status} />
            </div>
          ))}
        </div>
      </AdminPanel>

      <AdminPanel className="mt-6">
        <div className="flex items-center gap-3">
          <Save className="h-5 w-5 text-aqua" />
          <h2 className="text-2xl font-black">Store defaults</h2>
        </div>
        <form action="/api/admin/settings" method="post" className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ["store_name", "Store name", "Nuvoro Market"],
            ["support_email", "Support email", "support@nuvoro-market.com"],
            ["default_shipping_estimate", "Default shipping estimate", "Estimated 7-14 business days"],
            ["default_processing_time", "Default processing time", "2-4 business days"],
            ["default_guarantee_text", "Guarantee/support text", "Need help? Contact support with your order ID."],
            ["logo_url", "Logo URL", "/nuvoro-logo.png"],
            ["favicon_url", "Favicon URL", "/nuvoro-icon.png"],
            ["instagram_url", "Instagram URL", ""],
            ["facebook_url", "Facebook URL", ""],
            ["tiktok_url", "TikTok URL", ""]
          ].map(([key, label, fallback]) => (
            <label key={key} className="grid gap-2">
              <span className="text-xs font-bold text-white/55">{label}</span>
              <input className="field" name={key} defaultValue={settingValue(settings, key, fallback)} />
            </label>
          ))}
          <button className="btn-primary gap-2 md:col-span-2"><Save className="h-4 w-4" /> Save settings</button>
        </form>
      </AdminPanel>
    </AdminShell>
  );
}
