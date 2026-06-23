import Link from "next/link";
import { BarChart3, Boxes, CheckCircle2, ListOrdered, MousePointerClick, RefreshCcw, TrendingUp, Truck } from "lucide-react";
import { AdminPanel, EmptyState, MarginBadge, MoneyCell, PercentCell, StatCard, StatusBadge } from "@/components/admin/admin-ui";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminDashboard } from "@/lib/admin-data";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdmin();
  const { metrics } = await getAdminDashboard();
  const performance = [
    ["Most viewed product", metrics.mostViewedProduct, "product_views"],
    ["Most added to cart", metrics.mostAddedProduct, "add_to_cart_count"],
    ["Most checkouts", metrics.mostCheckoutProduct, "checkout_count"],
    ["Most purchases", metrics.mostPurchasedProduct, "purchase_count"],
    ["Worst estimated margin", metrics.worstMarginProduct, "estimated_margin_percent"],
    ["Deserves paid test", metrics.paidTestProduct, "decision"]
  ] as const;

  return (
    <AdminShell
      title="Dashboard"
      description="Live operating view for revenue, orders, product validation, supplier risk and conversion tracking."
      actions={<Link href="/admin/products" className="rounded-2xl bg-aqua px-4 py-3 text-sm font-black text-night hover:bg-white">New product</Link>}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total revenue" value={formatCurrency(metrics.totalRevenue)} detail={`${formatCurrency(metrics.revenueToday)} today`} Icon={BarChart3} />
        <StatCard label="This week" value={formatCurrency(metrics.revenueThisWeek)} detail={`${formatCurrency(metrics.revenueThisMonth)} this month`} Icon={TrendingUp} />
        <StatCard label="Total orders" value={String(metrics.totalOrders)} detail={`${metrics.paidOrders} paid orders`} Icon={ListOrdered} />
        <StatCard label="Tracked events" value={String(metrics.eventCount)} detail="Internal events, GA4 and Meta-ready" Icon={MousePointerClick} />
        <StatCard label="Pending orders" value={String(metrics.pendingOrders)} detail="Payment pending or not fulfilled" Icon={Boxes} />
        <StatCard label="Shipped orders" value={String(metrics.shippedOrders)} detail="Shipped or in transit" Icon={Truck} />
        <StatCard label="Delivered orders" value={String(metrics.deliveredOrders)} detail="Completed deliveries" Icon={CheckCircle2} />
        <StatCard label="Refunded orders" value={String(metrics.refundedOrders)} detail="Full or partial refunds" Icon={RefreshCcw} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <AdminPanel>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-aqua">Conversion funnel</p>
              <h2 className="mt-2 text-2xl font-black">Storefront signal</h2>
            </div>
            <Link href="/admin/metrics" className="rounded-2xl border border-white/15 px-4 py-2 text-sm font-black text-white/70 hover:bg-white/10 hover:text-white">Open metrics</Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            {[
              ["Product views", metrics.conversionFunnel.productViews],
              ["Add to cart", metrics.conversionFunnel.addToCart],
              ["Checkout started", metrics.conversionFunnel.checkoutStarted],
              ["Purchases", metrics.conversionFunnel.purchases]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-bold text-white/45">{label}</p>
                <p className="mt-2 text-2xl font-black">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/[0.04] p-4"><p className="text-xs text-white/45">View to cart</p><PercentCell value={metrics.conversionFunnel.viewToCartRate} /></div>
            <div className="rounded-2xl bg-white/[0.04] p-4"><p className="text-xs text-white/45">Cart to checkout</p><PercentCell value={metrics.conversionFunnel.cartToCheckoutRate} /></div>
            <div className="rounded-2xl bg-white/[0.04] p-4"><p className="text-xs text-white/45">Checkout to purchase</p><PercentCell value={metrics.conversionFunnel.checkoutToPurchaseRate} /></div>
          </div>
        </AdminPanel>

        <AdminPanel>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-aqua">Operational alerts</p>
          <h2 className="mt-2 text-2xl font-black">Needs attention</h2>
          <div className="mt-5 grid gap-3">
            {metrics.operationalAlerts.map((alert) => (
              <Link key={alert.label} href={alert.href} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.08]">
                <span className="text-sm font-bold text-white/72">{alert.label}</span>
                <span className={alert.tone === "danger" ? "text-lg font-black text-red-200" : alert.tone === "warning" ? "text-lg font-black text-gold" : "text-lg font-black text-aqua"}>{alert.count}</span>
              </Link>
            ))}
          </div>
        </AdminPanel>
      </div>

      <AdminPanel className="mt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-aqua">Product performance</p>
            <h2 className="mt-2 text-2xl font-black">Winning products and weak spots</h2>
          </div>
          <Link href="/admin/product-validation" className="rounded-2xl border border-white/15 px-4 py-2 text-sm font-black text-white/70 hover:bg-white/10 hover:text-white">Validation board</Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {performance.map(([label, metric, key]) => (
            <div key={label} className="rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-white/40">{label}</p>
              {metric ? (
                <>
                  <h3 className="mt-3 text-lg font-black">{metric.product.name}</h3>
                  <p className="mt-1 text-sm text-white/50">{metric.product.category}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <StatusBadge value={metric.decision} />
                    <MarginBadge percent={metric.estimated_margin_percent} />
                  </div>
                  <p className="mt-3 text-sm font-bold text-white/65">
                    {key === "estimated_margin_percent" ? `${metric.estimated_margin_percent?.toFixed(1) || "0.0"}% margin` : key === "decision" ? metric.decision : `${metric[key]} events`}
                  </p>
                </>
              ) : (
                <p className="mt-3 text-sm leading-6 text-white/50">No data yet. Product events and paid orders will fill this card.</p>
              )}
            </div>
          ))}
        </div>
      </AdminPanel>

      <AdminPanel className="mt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-aqua">Quick product economics</p>
            <h2 className="mt-2 text-2xl font-black">Top metric rows</h2>
          </div>
          <Link href="/admin/products" className="rounded-2xl border border-white/15 px-4 py-2 text-sm font-black text-white/70 hover:bg-white/10 hover:text-white">Manage products</Link>
        </div>
        {metrics.productMetrics.length ? (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.12em] text-white/40">
                <tr>{["Product", "Views", "Cart", "Checkout", "Purchases", "Revenue", "Profit", "Decision"].map((head) => <th key={head} className="px-3 py-3">{head}</th>)}</tr>
              </thead>
              <tbody>
                {metrics.productMetrics.slice(0, 8).map((metric) => (
                  <tr key={metric.product.id} className="border-t border-white/10">
                    <td className="px-3 py-4 font-black">{metric.product.name}</td>
                    <td className="px-3 py-4">{metric.product_views}</td>
                    <td className="px-3 py-4">{metric.add_to_cart_count}</td>
                    <td className="px-3 py-4">{metric.checkout_count}</td>
                    <td className="px-3 py-4">{metric.purchase_count}</td>
                    <td className="px-3 py-4"><MoneyCell value={metric.estimated_revenue} /></td>
                    <td className="px-3 py-4"><MoneyCell value={metric.estimated_profit} /></td>
                    <td className="px-3 py-4"><StatusBadge value={metric.decision} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState title="No product metrics yet">Events will appear after shoppers view products, add to cart, start checkout and purchase.</EmptyState>
        )}
      </AdminPanel>
    </AdminShell>
  );
}
