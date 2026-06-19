import { requireAdmin } from "@/lib/admin-auth";
import { getAdminDashboard } from "@/lib/admin-data";

export const metadata = { title: "Admin Suppliers" };
export const dynamic = "force-dynamic";

type Supplier = {
  id: string;
  name: string;
  platform?: string | null;
  supplier_url?: string | null;
  warehouse_location?: string | null;
  average_shipping_days?: number | null;
  tracking_quality?: string | null;
  product_quality_score?: number | null;
  sample_ordered?: boolean;
  sample_received?: boolean;
  active?: boolean;
};

export default async function AdminSuppliersPage() {
  await requireAdmin();
  const { suppliers } = await getAdminDashboard() as { suppliers: Supplier[] };

  return (
    <section className="container-page py-10">
      <p className="eyebrow">Admin</p>
      <h1 className="mt-2 text-4xl font-black">Suppliers</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/60">Track supplier reliability, sample status, warehouse notes and backup supplier readiness before approving products for paid traffic.</p>
      <div className="mt-6 overflow-x-auto rounded-[1.5rem] border border-line bg-white">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-cloud"><tr>{["Name", "Platform", "Warehouse", "Avg days", "Tracking", "Quality", "Samples", "Status"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>
            {suppliers.length ? suppliers.map((supplier) => (
              <tr key={supplier.id} className="border-t border-line">
                <td className="p-3 font-bold">{supplier.supplier_url ? <a className="text-moss" href={supplier.supplier_url} target="_blank" rel="noreferrer">{supplier.name}</a> : supplier.name}</td>
                <td className="p-3">{supplier.platform || "-"}</td>
                <td className="p-3">{supplier.warehouse_location || "-"}</td>
                <td className="p-3">{supplier.average_shipping_days ?? "-"}</td>
                <td className="p-3">{supplier.tracking_quality || "-"}</td>
                <td className="p-3">{supplier.product_quality_score ?? "-"}</td>
                <td className="p-3">{supplier.sample_ordered ? "Ordered" : "Not ordered"} / {supplier.sample_received ? "Received" : "Pending"}</td>
                <td className="p-3">{supplier.active ? "Active" : "Inactive"}</td>
              </tr>
            )) : <tr><td colSpan={8} className="p-8 text-center text-ink/60">No suppliers yet. Add supplier records in Supabase or through a future admin create form.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
