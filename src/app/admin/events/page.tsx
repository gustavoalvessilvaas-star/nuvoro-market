import { getAdminDashboard } from "@/lib/admin-data";

export default async function AdminEventsPage() {
  const { events } = await getAdminDashboard();
  return (
    <section className="container-page py-10">
      <h1 className="text-4xl font-black">Tracked Events</h1>
      <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-cloud"><tr>{["Event", "Source", "Product", "Order", "Email", "Created"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead>
          <tbody>{events.length ? events.map((event) => <tr key={event.id} className="border-t border-line"><td className="p-3 font-bold">{event.event_name}</td><td className="p-3">{event.source}</td><td className="p-3">{event.product_id || "-"}</td><td className="p-3">{event.order_id || "-"}</td><td className="p-3">{event.customer_email || "-"}</td><td className="p-3">{event.created_at || "-"}</td></tr>) : <tr><td colSpan={6} className="p-8 text-center text-ink/60">No events yet.</td></tr>}</tbody>
        </table>
      </div>
    </section>
  );
}
