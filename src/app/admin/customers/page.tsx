import { requireAdmin } from "@/lib/admin-auth";
import { getAdminDashboard } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  await requireAdmin();
  const { customers } = await getAdminDashboard();
  return (
    <section className="container-page py-10">
      <h1 className="text-4xl font-black">Customers</h1>
      <div className="mt-6 rounded-lg border border-line bg-white">
        {customers.length ? customers.map((customer) => <div key={customer.id} className="border-b border-line p-4"><p className="font-bold">{customer.name}</p><p className="text-sm text-ink/60">{customer.email} {customer.phone ? `- ${customer.phone}` : ""}</p></div>) : <p className="p-8 text-center text-ink/60">No customer records yet.</p>}
      </div>
    </section>
  );
}
