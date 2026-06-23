import { AdminPanel, EmptyState } from "@/components/admin/admin-ui";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminDashboard } from "@/lib/admin-data";

export const metadata = { title: "Admin Customers" };
export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  await requireAdmin();
  const { customers, orders } = await getAdminDashboard();

  return (
    <AdminShell title="Customers" description="Customer records created during checkout and account/order activity.">
      <AdminPanel>
        {customers.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.12em] text-white/40">
                <tr>{["Name", "Email", "Phone", "Orders", "Created"].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-t border-white/10">
                    <td className="px-4 py-4 font-black">{customer.name}</td>
                    <td className="px-4 py-4">{customer.email}</td>
                    <td className="px-4 py-4">{customer.phone || "-"}</td>
                    <td className="px-4 py-4">{orders.filter((order) => order.customer_email === customer.email).length}</td>
                    <td className="px-4 py-4">{customer.created_at || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No customers yet">Customer records appear after checkout or manual order creation.</EmptyState>
        )}
      </AdminPanel>
    </AdminShell>
  );
}
