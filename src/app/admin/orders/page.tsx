import { getAdminDashboard } from "@/lib/admin-data";
import { formatCurrency } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const { orders } = await getAdminDashboard();
  return (
    <section className="container-page py-10">
      <h1 className="text-4xl font-black">Order Management</h1>
      <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="bg-cloud"><tr>{["Order", "Customer", "Total", "Payment", "Fulfillment", "Tracking", "Supplier ID", "Update"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>
            {orders.length ? orders.map((order) => (
              <tr key={order.id} className="border-t border-line">
                <td className="p-3 font-bold">{order.id}</td><td className="p-3">{order.customer_email}</td><td className="p-3">{formatCurrency(Number(order.total_amount))}</td><td className="p-3">{order.payment_status}</td><td className="p-3">{order.fulfillment_status}</td><td className="p-3">{order.tracking_code || "-"}</td><td className="p-3">{order.supplier_order_id || "-"}</td>
                <td className="p-3"><form action={`/api/admin/orders/${order.id}`} method="post" className="flex gap-2"><input className="field w-36" name="tracking_code" placeholder="Tracking" /><button className="btn-secondary">Save</button></form></td>
              </tr>
            )) : <tr><td colSpan={8} className="p-8 text-center text-ink/60">No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
