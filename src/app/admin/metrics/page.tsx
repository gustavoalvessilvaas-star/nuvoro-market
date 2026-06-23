import { BarChart3 } from "lucide-react";
import { AdminPanel, EmptyState, MarginBadge, MoneyCell, PercentCell, StatusBadge, StatCard } from "@/components/admin/admin-ui";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminDashboard } from "@/lib/admin-data";

export const metadata = { title: "Admin Metrics" };
export const dynamic = "force-dynamic";

export default async function AdminMetricsPage() {
  await requireAdmin();
  const { metrics } = await getAdminDashboard();

  return (
    <AdminShell
      title="Metrics"
      description="Product-level conversion and margin signal from internal event logging. No fake data is generated."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Product views" value={String(metrics.conversionFunnel.productViews)} detail="view_item / ViewContent" Icon={BarChart3} />
        <StatCard label="Add to cart" value={String(metrics.conversionFunnel.addToCart)} detail={`${metrics.conversionFunnel.viewToCartRate.toFixed(1)}% view-to-cart`} Icon={BarChart3} />
        <StatCard label="Checkouts" value={String(metrics.conversionFunnel.checkoutStarted)} detail={`${metrics.conversionFunnel.cartToCheckoutRate.toFixed(1)}% cart-to-checkout`} Icon={BarChart3} />
        <StatCard label="Purchases" value={String(metrics.conversionFunnel.purchases)} detail={`${metrics.conversionFunnel.checkoutToPurchaseRate.toFixed(1)}% checkout-to-purchase`} Icon={BarChart3} />
      </div>

      <AdminPanel className="mt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-aqua">Product metrics</p>
            <h2 className="mt-2 text-2xl font-black">Decision table</h2>
          </div>
          <p className="text-sm font-bold text-white/50">Tracking fills after customer actions happen on the storefront.</p>
        </div>
        {metrics.eventCount ? (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[1120px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.12em] text-white/40">
                <tr>{["Product", "Views", "Cart", "Checkout", "Purchases", "View-cart", "Cart-checkout", "Checkout-purchase", "Revenue", "Cost", "Profit", "Margin", "Decision"].map((head) => <th key={head} className="px-3 py-3">{head}</th>)}</tr>
              </thead>
              <tbody>
                {metrics.productMetrics.map((metric) => (
                  <tr key={metric.product.id} className="border-t border-white/10">
                    <td className="px-3 py-4">
                      <p className="font-black">{metric.product.name}</p>
                      <p className="mt-1 text-xs text-white/45">{metric.product.category}</p>
                    </td>
                    <td className="px-3 py-4">{metric.product_views}</td>
                    <td className="px-3 py-4">{metric.add_to_cart_count}</td>
                    <td className="px-3 py-4">{metric.checkout_count}</td>
                    <td className="px-3 py-4">{metric.purchase_count}</td>
                    <td className="px-3 py-4"><PercentCell value={metric.view_to_cart_rate} /></td>
                    <td className="px-3 py-4"><PercentCell value={metric.cart_to_checkout_rate} /></td>
                    <td className="px-3 py-4"><PercentCell value={metric.checkout_to_purchase_rate} /></td>
                    <td className="px-3 py-4"><MoneyCell value={metric.estimated_revenue} /></td>
                    <td className="px-3 py-4"><MoneyCell value={metric.estimated_cost} /></td>
                    <td className="px-3 py-4"><MoneyCell value={metric.estimated_profit} /></td>
                    <td className="px-3 py-4"><MarginBadge percent={metric.estimated_margin_percent} /></td>
                    <td className="px-3 py-4"><StatusBadge value={metric.decision} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No internal events yet">
            Product views, add-to-cart events, checkout starts and purchases will appear after tracking is active and shoppers interact with the store.
          </EmptyState>
        )}
      </AdminPanel>

      <AdminPanel className="mt-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-aqua">Decision guide</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["Needs better product page", "Many views but few add-to-carts. Review hero image, offer, price, benefit clarity and trust signals."],
            ["Needs better creative", "Adds to cart happen, but checkout does not. Review cart confidence, bundles, shipping and urgency."],
            ["High interest, low conversion", "Checkout starts but purchases are weak. Review Stripe, final price, shipping confidence and checkout friction."],
            ["Low margin", "Purchases or interest exist, but supplier cost, shipping or pricing leaves too little room for ads."],
            ["Ready for paid test", "Good interest, add-to-cart signal and 55%+ estimated margin."],
            ["Pause for now", "Not enough signal or economics to justify paid traffic yet."]
          ].map(([title, copy]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <StatusBadge value={title} />
              <p className="mt-3 text-sm leading-6 text-white/60">{copy}</p>
            </div>
          ))}
        </div>
      </AdminPanel>
    </AdminShell>
  );
}
