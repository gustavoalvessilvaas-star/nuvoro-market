import { Save, Send } from "lucide-react";
import { AdminPanel, EmptyState, MoneyCell, StatusBadge } from "@/components/admin/admin-ui";
import { AdminShell } from "@/components/admin/admin-shell";
import { CopyButton } from "@/components/admin/copy-button";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminDashboard, type AdminOrder } from "@/lib/admin-data";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Admin Orders" };
export const dynamic = "force-dynamic";

type OrdersPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const paymentStatuses = ["pending", "paid", "failed", "refunded", "partially_refunded"];
const fulfillmentStatuses = ["order_received", "processing", "shipped", "in_transit", "delivered", "cancelled", "returned"];

function param(searchParams: OrdersPageProps["searchParams"], key: string) {
  const value = searchParams?.[key];
  return Array.isArray(value) ? value[0] || "" : value || "";
}

function shippingAddress(order: AdminOrder) {
  const address = order.shipping_address || {};
  return [
    order.customer_name,
    address.address1,
    address.address2,
    `${address.city || ""}, ${address.state || ""} ${address.zip || ""}`.trim(),
    address.country
  ].filter(Boolean).join("\n");
}

function fulfillmentCopy(order: AdminOrder) {
  const items = (order.order_items || []).map((item) => {
    const snapshot = item.product_snapshot || {};
    return `${item.quantity || 1}x ${snapshot.name || item.product_id || "Product"} at ${formatCurrency(Number(item.unit_price || 0))}`;
  }).join("\n");
  return `Order ${order.id}\nCustomer: ${order.customer_name} <${order.customer_email}>\n\nShip to:\n${shippingAddress(order)}\n\nItems:\n${items || "No items recorded"}\n\nNotes:\n${order.internal_notes || ""}`;
}

function orderWarnings(order: AdminOrder) {
  const warnings = [];
  if (order.payment_status === "paid" && !order.supplier_order_id) warnings.push("Paid order missing supplier order ID");
  if (order.payment_status === "paid" && !order.tracking_code) warnings.push("Paid order missing tracking");
  if (order.fulfillment_status === "shipped" && !order.tracking_code) warnings.push("Shipped without tracking code");
  if (String(order.fulfillment_status).includes("return") && !String(order.payment_status).includes("refund")) warnings.push("Return status without refunded payment status");
  return warnings;
}

function filterOrders(orders: AdminOrder[], searchParams: OrdersPageProps["searchParams"]) {
  const q = param(searchParams, "q").toLowerCase();
  const payment = param(searchParams, "payment_status");
  const fulfillment = param(searchParams, "fulfillment_status");
  const needsTracking = param(searchParams, "needs_tracking");
  const dateFrom = param(searchParams, "date_from");
  const dateTo = param(searchParams, "date_to");

  return orders.filter((order) => {
    const created = order.created_at ? new Date(order.created_at) : null;
    if (q && !`${order.id} ${order.customer_name} ${order.customer_email} ${order.tracking_code || ""}`.toLowerCase().includes(q)) return false;
    if (payment && order.payment_status !== payment) return false;
    if (fulfillment && order.fulfillment_status !== fulfillment) return false;
    if (needsTracking && order.tracking_code) return false;
    if (dateFrom && created && created < new Date(`${dateFrom}T00:00:00`)) return false;
    if (dateTo && created && created > new Date(`${dateTo}T23:59:59`)) return false;
    return true;
  });
}

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  await requireAdmin();
  const { orders } = await getAdminDashboard();
  const filteredOrders = filterOrders(orders, searchParams);

  return (
    <AdminShell
      title="Orders"
      description="Manage paid orders, supplier purchase IDs, tracking codes, customer email updates and fulfillment notes."
    >
      <AdminPanel>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-aqua">Fulfillment queue</p>
            <h2 className="mt-2 text-2xl font-black">Search and filters</h2>
          </div>
          <p className="text-sm font-bold text-white/55">{filteredOrders.length} of {orders.length} orders shown</p>
        </div>
        <form className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <label className="grid gap-2 md:col-span-2">
            <span className="text-xs font-bold text-white/55">Search</span>
            <input className="field" name="q" placeholder="Order ID, email, name, tracking..." defaultValue={param(searchParams, "q")} />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold text-white/55">Payment</span>
            <select className="field" name="payment_status" defaultValue={param(searchParams, "payment_status")}>
              <option value="">All</option>
              {paymentStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold text-white/55">Fulfillment</span>
            <select className="field" name="fulfillment_status" defaultValue={param(searchParams, "fulfillment_status")}>
              <option value="">All</option>
              {fulfillmentStatuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold text-white/55">From</span>
            <input className="field" type="date" name="date_from" defaultValue={param(searchParams, "date_from")} />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold text-white/55">To</span>
            <input className="field" type="date" name="date_to" defaultValue={param(searchParams, "date_to")} />
          </label>
          <button className="btn-primary md:col-span-3 xl:col-span-6">Apply filters</button>
        </form>
      </AdminPanel>

      <div className="mt-6 grid gap-5">
        {filteredOrders.length ? filteredOrders.map((order) => {
          const warnings = orderWarnings(order);

          return (
            <AdminPanel key={order.id}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-black">Order {order.id}</h2>
                    <StatusBadge value={order.payment_status} />
                    <StatusBadge value={order.fulfillment_status} />
                  </div>
                  <p className="mt-2 text-sm text-white/55">{order.customer_name} - {order.customer_email}</p>
                  <p className="mt-2 text-sm text-white/55">Created {order.created_at || "unknown"} - Source {String(order.source || "storefront")}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-white/45">Total</p>
                  <MoneyCell value={Number(order.total_amount || 0)} />
                </div>
              </div>

              {warnings.length ? (
                <div className="mt-4 rounded-2xl border border-gold/25 bg-gold/10 p-4 text-sm font-bold text-gold">
                  {warnings.join(" / ")}
                </div>
              ) : null}

              <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="grid gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-black">Shipping address</h3>
                      <CopyButton value={shippingAddress(order)} label="Copy address" />
                    </div>
                    <pre className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/65">{shippingAddress(order) || "No shipping address recorded."}</pre>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-black">Supplier purchase copy</h3>
                      <CopyButton value={fulfillmentCopy(order)} label="Copy fulfillment" />
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-white/65">
                      {(order.order_items || []).length ? (order.order_items || []).map((item) => (
                        <p key={item.id || `${order.id}-${item.product_id}`}>{item.quantity || 1}x {String(item.product_snapshot?.name || item.product_id || "Product")} - {formatCurrency(Number(item.unit_price || 0))}</p>
                      )) : <p>No order items recorded.</p>}
                    </div>
                  </div>
                </div>

                <form action={`/api/admin/orders/${order.id}`} method="post" className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-xs font-bold text-white/55">Payment status</span>
                    <select className="field" name="payment_status" defaultValue={order.payment_status}>
                      {paymentStatuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs font-bold text-white/55">Fulfillment status</span>
                    <select className="field" name="fulfillment_status" defaultValue={order.fulfillment_status}>
                      {fulfillmentStatuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs font-bold text-white/55">Supplier order ID</span>
                    <input className="field" name="supplier_order_id" defaultValue={order.supplier_order_id || ""} />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-xs font-bold text-white/55">Tracking code</span>
                    <input className="field" name="tracking_code" defaultValue={order.tracking_code || ""} />
                  </label>
                  <label className="grid gap-2 md:col-span-2">
                    <span className="text-xs font-bold text-white/55">Tracking URL</span>
                    <input className="field" name="tracking_url" defaultValue={order.tracking_url || ""} />
                  </label>
                  <label className="grid gap-2 md:col-span-2">
                    <span className="text-xs font-bold text-white/55">Internal notes</span>
                    <textarea className="field min-h-28" name="internal_notes" defaultValue={order.internal_notes || ""} />
                  </label>
                  <div className="flex flex-wrap gap-3 md:col-span-2">
                    <button className="btn-primary gap-2"><Save className="h-4 w-4" /> Save order</button>
                    <button className="btn-secondary gap-2" name="email_action" value="confirmation"><Send className="h-4 w-4" /> Resend confirmation</button>
                    <button className="btn-secondary gap-2" name="email_action" value="tracking"><Send className="h-4 w-4" /> Send tracking email</button>
                  </div>
                </form>
              </div>
            </AdminPanel>
          );
        }) : (
          <EmptyState title="No orders found">Orders from Stripe checkout will appear here after customers start checkout or complete payment.</EmptyState>
        )}
      </div>
    </AdminShell>
  );
}
