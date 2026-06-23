import { requireAdmin } from "@/lib/admin-auth";
import { getAdminDashboard } from "@/lib/admin-data";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await requireAdmin();
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
                <td className="p-3">
                  <form action={`/api/admin/orders/${order.id}`} method="post" className="grid gap-2">
                    <select className="field w-44" name="payment_status" defaultValue={order.payment_status}>
                      {["pending", "paid", "failed", "refunded"].map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                    <input className="field w-44" name="tracking_code" placeholder="Tracking code" defaultValue={order.tracking_code || ""} />
                    <input className="field w-44" name="tracking_url" placeholder="Tracking URL" defaultValue={order.tracking_url || ""} />
                    <input className="field w-44" name="supplier_order_id" placeholder="Supplier order ID" defaultValue={order.supplier_order_id || ""} />
                    <select className="field w-44" name="fulfillment_status" defaultValue={order.fulfillment_status}>
                      {["order_received", "processing", "shipped", "in_transit", "delivered"].map((status) => <option key={status} value={status}>{status.replaceAll("_", " ")}</option>)}
                    </select>
                    <textarea className="field min-h-24 w-44" name="internal_notes" placeholder="Internal notes" defaultValue={order.internal_notes || ""} />
                    <button className="btn-secondary">Save</button>
                    <button className="btn-secondary" name="email_action" value="confirmation">Resend Confirmation</button>
                    <button className="btn-secondary" name="email_action" value="tracking">Send Tracking Email</button>
                  </form>
                </td>
              </tr>
            )) : <tr><td colSpan={8} className="p-8 text-center text-ink/60">No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
