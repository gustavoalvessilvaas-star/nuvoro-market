import { AdminPanel, EmptyState, StatusBadge } from "@/components/admin/admin-ui";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminDashboard } from "@/lib/admin-data";

export const metadata = { title: "Admin Support" };
export const dynamic = "force-dynamic";

type SupportRequest = {
  id: string;
  name: string;
  email: string;
  reason: string;
  message: string;
  order_id?: string | null;
  status: string;
  created_at?: string;
};

export default async function AdminSupportPage() {
  await requireAdmin();
  const { supportRequests } = await getAdminDashboard() as { supportRequests: SupportRequest[] };

  return (
    <AdminShell title="Support" description="Customer contact requests submitted from the storefront contact page.">
      <div className="grid gap-5">
        {supportRequests.length ? supportRequests.map((request) => (
          <AdminPanel key={request.id}>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black">{request.reason}</h2>
                  <StatusBadge value={request.status} />
                </div>
                <p className="mt-2 text-sm text-white/55">{request.name} - {request.email}</p>
                {request.order_id ? <p className="mt-1 text-sm text-white/55">Order: {request.order_id}</p> : null}
              </div>
              <p className="text-sm text-white/45">{request.created_at || "-"}</p>
            </div>
            <p className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/70">{request.message}</p>
          </AdminPanel>
        )) : (
          <EmptyState title="No support requests yet">Requests submitted through the contact page will appear here after Supabase is configured.</EmptyState>
        )}
      </div>
    </AdminShell>
  );
}
