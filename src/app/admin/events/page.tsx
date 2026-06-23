import { AdminPanel, EmptyState } from "@/components/admin/admin-ui";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminDashboard } from "@/lib/admin-data";

export const metadata = { title: "Admin Events" };
export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  await requireAdmin();
  const { events } = await getAdminDashboard();

  return (
    <AdminShell title="Events" description="Recent internal events used for the admin metrics dashboard and Meta CAPI preparation.">
      <AdminPanel>
        {events.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.12em] text-white/40">
                <tr>{["Event", "Source", "Product", "Order", "Email", "UTM", "Created"].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-t border-white/10">
                    <td className="px-4 py-4 font-black">{event.event_name}</td>
                    <td className="px-4 py-4">{event.source || "web"}</td>
                    <td className="px-4 py-4">{event.product_id || String(event.metadata?.product_id || "-")}</td>
                    <td className="px-4 py-4">{event.order_id || "-"}</td>
                    <td className="px-4 py-4">{event.customer_email || "-"}</td>
                    <td className="px-4 py-4">{String(event.utm_source || event.metadata?.utm_source || event.metadata?.utm || "-")}</td>
                    <td className="px-4 py-4">{event.created_at || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No events yet">Storefront events appear after users view products, search, add to cart, contact support or purchase.</EmptyState>
        )}
      </AdminPanel>
    </AdminShell>
  );
}
