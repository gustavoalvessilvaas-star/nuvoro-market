import { Save, Truck } from "lucide-react";
import { AdminPanel, EmptyState, MarginBadge, MoneyCell, StatusBadge } from "@/components/admin/admin-ui";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { calculateMargin, getAdminDashboard, type AdminProduct, type AdminSupplier } from "@/lib/admin-data";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Admin Suppliers" };
export const dynamic = "force-dynamic";

const platforms = ["AliExpress", "DSers", "CJdropshipping", "Zendrop", "Spocket", "AutoDS", "Other"];
const trackingQualities = ["unknown", "poor", "acceptable", "good", "excellent"];

function totalCost(supplier: AdminSupplier) {
  return Number(supplier.total_estimated_cost ?? 0) || Number(supplier.product_cost || 0) + Number(supplier.shipping_cost || 0);
}

function recommendation(supplier: AdminSupplier, product?: AdminProduct) {
  const hasBackup = Boolean(supplier.backup_supplier_url);
  const total = totalCost(supplier);
  const productMargin = product ? calculateMargin({ ...product, cost_price: supplier.product_cost ?? product.cost_price, shipping_cost: supplier.shipping_cost ?? product.shipping_cost }).estimatedMarginPercent : null;
  const slow = Number(supplier.estimated_delivery_days_max || 0) > 18;
  const risky = !supplier.tracking_available || supplier.tracking_quality === "poor" || Boolean(supplier.compliance_notes) || slow;

  if (!supplier.sample_ordered || !supplier.sample_received) return "needs sample";
  if (risky || !hasBackup) return "risky";
  if (supplier.sample_approved && supplier.tracking_available && hasBackup && productMargin != null && productMargin >= 55) return "best balance";
  if (total > 0) return "cheapest";
  return "safest";
}

export default async function AdminSuppliersPage() {
  await requireAdmin();
  const { suppliers, products } = await getAdminDashboard();
  const productById = new Map(products.map((product) => [product.id, product]));
  const suppliersByProduct = suppliers.reduce<Record<string, AdminSupplier[]>>((acc, supplier) => {
    const key = supplier.product_id || "unlinked";
    acc[key] = acc[key] || [];
    acc[key].push(supplier);
    return acc;
  }, {});

  return (
    <AdminShell
      title="Suppliers"
      description="Track supplier costs, backup links, sample status, tracking quality and margin risk before scaling products."
    >
      <AdminPanel>
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-aqua" />
          <h2 className="text-2xl font-black">Add supplier</h2>
        </div>
        <form action="/api/admin/suppliers" method="post" className="mt-5 grid gap-4 md:grid-cols-3">
          <input type="hidden" name="action" value="create" />
          <label className="grid gap-2">
            <span className="text-xs font-bold text-white/55">Supplier name</span>
            <input className="field" name="name" required />
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold text-white/55">Platform</span>
            <select className="field" name="platform">
              {platforms.map((platform) => <option key={platform}>{platform}</option>)}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-xs font-bold text-white/55">Linked product</span>
            <select className="field" name="product_id">
              <option value="">Not linked yet</option>
              {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
            </select>
          </label>
          {[
            ["supplier_url", "Supplier URL"],
            ["backup_supplier_url", "Backup supplier URL"],
            ["product_cost", "Product cost"],
            ["shipping_cost", "Shipping cost"],
            ["estimated_delivery_days_min", "Min delivery days"],
            ["estimated_delivery_days_max", "Max delivery days"],
            ["warehouse_location", "Warehouse location"],
            ["product_quality_score", "Product quality score"]
          ].map(([name, label]) => (
            <label key={name} className="grid gap-2">
              <span className="text-xs font-bold text-white/55">{label}</span>
              <input className="field" name={name} />
            </label>
          ))}
          <label className="grid gap-2">
            <span className="text-xs font-bold text-white/55">Tracking quality</span>
            <select className="field" name="tracking_quality" defaultValue="unknown">
              {trackingQualities.map((quality) => <option key={quality}>{quality}</option>)}
            </select>
          </label>
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:col-span-3 sm:grid-cols-4">
            {[
              ["tracking_available", "Tracking available"],
              ["sample_ordered", "Sample ordered"],
              ["sample_received", "Sample received"],
              ["sample_approved", "Sample approved"],
              ["active", "Active"]
            ].map(([name, label]) => (
              <label key={name} className="flex items-center gap-2 text-sm font-bold text-white/70">
                <input type="checkbox" name={name} defaultChecked={name === "active"} />
                {label}
              </label>
            ))}
          </div>
          <label className="grid gap-2 md:col-span-3">
            <span className="text-xs font-bold text-white/55">Observations</span>
            <textarea className="field min-h-24" name="observations" />
          </label>
          <label className="grid gap-2 md:col-span-3">
            <span className="text-xs font-bold text-white/55">Return/compliance notes</span>
            <textarea className="field min-h-24" name="compliance_notes" />
          </label>
          <button className="btn-primary gap-2 md:col-span-3"><Truck className="h-4 w-4" /> Save supplier</button>
        </form>
      </AdminPanel>

      <div className="mt-6 grid gap-5">
        {suppliers.length ? suppliers.map((supplier) => {
          const product = supplier.product_id ? productById.get(supplier.product_id) : undefined;
          const margin = product ? calculateMargin({ ...product, cost_price: supplier.product_cost ?? product.cost_price, shipping_cost: supplier.shipping_cost ?? product.shipping_cost }).estimatedMarginPercent : null;

          return (
            <AdminPanel key={supplier.id}>
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-black">{supplier.name}</h2>
                    <StatusBadge value={supplier.active ? "active" : "inactive"} />
                    <StatusBadge value={recommendation(supplier, product)} />
                    <MarginBadge percent={margin} />
                  </div>
                  <p className="mt-2 text-sm text-white/55">{supplier.platform || "Other"} - {product?.name || "Not linked to product"}</p>
                  <p className="mt-2 text-sm text-white/65">Total estimated cost: {formatCurrency(totalCost(supplier))}</p>
                </div>
                {supplier.supplier_url ? <a href={supplier.supplier_url} target="_blank" rel="noreferrer" className="btn-secondary">Open supplier</a> : null}
              </div>

              <form action="/api/admin/suppliers" method="post" className="mt-5 grid gap-4 md:grid-cols-3">
                <input type="hidden" name="action" value="update" />
                <input type="hidden" name="supplier_id" value={supplier.id} />
                <label className="grid gap-2">
                  <span className="text-xs font-bold text-white/55">Supplier name</span>
                  <input className="field" name="name" defaultValue={supplier.name} required />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-bold text-white/55">Platform</span>
                  <select className="field" name="platform" defaultValue={supplier.platform || "Other"}>
                    {platforms.map((platform) => <option key={platform}>{platform}</option>)}
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-bold text-white/55">Linked product</span>
                  <select className="field" name="product_id" defaultValue={supplier.product_id || ""}>
                    <option value="">Not linked yet</option>
                    {products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select>
                </label>
                {[
                  ["supplier_url", "Supplier URL", supplier.supplier_url],
                  ["backup_supplier_url", "Backup supplier URL", supplier.backup_supplier_url],
                  ["product_cost", "Product cost", supplier.product_cost],
                  ["shipping_cost", "Shipping cost", supplier.shipping_cost],
                  ["estimated_delivery_days_min", "Min delivery days", supplier.estimated_delivery_days_min],
                  ["estimated_delivery_days_max", "Max delivery days", supplier.estimated_delivery_days_max],
                  ["warehouse_location", "Warehouse location", supplier.warehouse_location],
                  ["product_quality_score", "Product quality score", supplier.product_quality_score]
                ].map(([name, label, value]) => (
                  <label key={String(name)} className="grid gap-2">
                    <span className="text-xs font-bold text-white/55">{label}</span>
                    <input className="field" name={String(name)} defaultValue={String(value || "")} />
                  </label>
                ))}
                <label className="grid gap-2">
                  <span className="text-xs font-bold text-white/55">Tracking quality</span>
                  <select className="field" name="tracking_quality" defaultValue={supplier.tracking_quality || "unknown"}>
                    {trackingQualities.map((quality) => <option key={quality}>{quality}</option>)}
                  </select>
                </label>
                <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:col-span-3 sm:grid-cols-4">
                  {[
                    ["tracking_available", "Tracking available", supplier.tracking_available],
                    ["sample_ordered", "Sample ordered", supplier.sample_ordered],
                    ["sample_received", "Sample received", supplier.sample_received],
                    ["sample_approved", "Sample approved", supplier.sample_approved],
                    ["active", "Active", supplier.active !== false]
                  ].map(([name, label, checked]) => (
                    <label key={String(name)} className="flex items-center gap-2 text-sm font-bold text-white/70">
                      <input type="checkbox" name={String(name)} defaultChecked={Boolean(checked)} />
                      {label}
                    </label>
                  ))}
                </div>
                <label className="grid gap-2 md:col-span-3">
                  <span className="text-xs font-bold text-white/55">Observations</span>
                  <textarea className="field min-h-24" name="observations" defaultValue={supplier.observations || ""} />
                </label>
                <label className="grid gap-2 md:col-span-3">
                  <span className="text-xs font-bold text-white/55">Return/compliance notes</span>
                  <textarea className="field min-h-24" name="compliance_notes" defaultValue={supplier.compliance_notes || supplier.return_policy_notes || ""} />
                </label>
                <button className="btn-primary gap-2 md:col-span-3"><Save className="h-4 w-4" /> Save supplier</button>
              </form>
            </AdminPanel>
          );
        }) : (
          <EmptyState title="No suppliers yet">Add supplier records here after choosing potential fulfillment sources for a product.</EmptyState>
        )}
      </div>

      <AdminPanel className="mt-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-aqua">Supplier comparison</p>
        <h2 className="mt-2 text-2xl font-black">By product</h2>
        <div className="mt-5 grid gap-4">
          {Object.entries(suppliersByProduct).map(([productId, rows]) => {
            const product = productById.get(productId);
            return (
              <div key={productId} className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04]">
                <div className="border-b border-white/10 p-4">
                  <h3 className="font-black">{product?.name || "Unlinked suppliers"}</h3>
                  <p className="mt-1 text-sm text-white/50">{rows.length} supplier option{rows.length === 1 ? "" : "s"}</p>
                </div>
                <table className="w-full min-w-[920px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-[0.12em] text-white/40">
                    <tr>{["Supplier", "Platform", "Cost", "Delivery", "Tracking", "Sample", "Backup", "Margin", "Recommendation"].map((head) => <th key={head} className="px-4 py-3">{head}</th>)}</tr>
                  </thead>
                  <tbody>
                    {rows.map((supplier) => {
                      const productMargin = product ? calculateMargin({ ...product, cost_price: supplier.product_cost ?? product.cost_price, shipping_cost: supplier.shipping_cost ?? product.shipping_cost }).estimatedMarginPercent : null;
                      return (
                        <tr key={supplier.id} className="border-t border-white/10">
                          <td className="px-4 py-3 font-black">{supplier.name}</td>
                          <td className="px-4 py-3">{supplier.platform || "Other"}</td>
                          <td className="px-4 py-3"><MoneyCell value={totalCost(supplier)} /></td>
                          <td className="px-4 py-3">{supplier.estimated_delivery_days_min || "?"}-{supplier.estimated_delivery_days_max || "?"} days</td>
                          <td className="px-4 py-3">{supplier.tracking_available ? supplier.tracking_quality || "yes" : "no"}</td>
                          <td className="px-4 py-3">{supplier.sample_approved ? "approved" : supplier.sample_received ? "received" : supplier.sample_ordered ? "ordered" : "needed"}</td>
                          <td className="px-4 py-3">{supplier.backup_supplier_url ? "yes" : "missing"}</td>
                          <td className="px-4 py-3"><MarginBadge percent={productMargin} /></td>
                          <td className="px-4 py-3"><StatusBadge value={recommendation(supplier, product)} /></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </AdminPanel>
    </AdminShell>
  );
}
