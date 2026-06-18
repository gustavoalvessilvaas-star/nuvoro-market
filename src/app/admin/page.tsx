import Link from "next/link";
import { BarChart3, Boxes, ListOrdered, MousePointerClick } from "lucide-react";
import { getAdminDashboard } from "@/lib/admin-data";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const { metrics } = await getAdminDashboard();
  const cards = [
    ["Total revenue", formatCurrency(metrics.revenue), BarChart3],
    ["Total orders", String(metrics.totalOrders), ListOrdered],
    ["Pending orders", String(metrics.pendingOrders), Boxes],
    ["Tracked events", String(metrics.eventCount), MousePointerClick]
  ];

  return (
    <section className="container-page py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div><p className="text-sm font-bold uppercase tracking-wide text-moss">Admin</p><h1 className="mt-2 text-4xl font-black">Nuvoro Market Dashboard</h1></div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/products" className="btn-secondary">Products</Link>
          <Link href="/admin/orders" className="btn-secondary">Orders</Link>
          <Link href="/admin/customers" className="btn-secondary">Customers</Link>
          <Link href="/admin/events" className="btn-secondary">Events</Link>
          <Link href="/admin/support" className="btn-secondary">Support</Link>
        </div>
      </div>
      <p className="mt-4 rounded-md bg-mint p-4 text-sm text-ink/75">Supabase Auth should protect this route in production with middleware and the admin_users table. Without Supabase keys, this dashboard uses seed/fallback data.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value, Icon]) => (
          <div key={String(label)} className="rounded-lg border border-line bg-white p-5">
            <Icon className="h-5 w-5 text-moss" />
            <p className="mt-4 text-sm text-ink/60">{label as string}</p>
            <p className="mt-1 text-3xl font-black">{value as string}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
