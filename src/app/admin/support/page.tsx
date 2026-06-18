import { getAdminDashboard } from "@/lib/admin-data";

export const metadata = { title: "Admin Support" };

export default async function AdminSupportPage() {
  const { supportRequests } = await getAdminDashboard() as {
    supportRequests: Array<{ id: string; name: string; email: string; reason: string; message: string; order_id?: string | null; status: string; created_at?: string }>;
  };

  return (
    <section className="container-page py-10">
      <p className="eyebrow">Admin</p>
      <h1 className="mt-2 text-4xl font-black">Support Requests</h1>
      <div className="mt-6 grid gap-4">
        {supportRequests.length ? supportRequests.map((request) => (
          <article key={request.id} className="card-surface p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="font-black">{request.reason}</h2>
                <p className="mt-1 text-sm text-ink/60">{request.name} - {request.email}</p>
                {request.order_id ? <p className="mt-1 text-sm text-ink/60">Order: {request.order_id}</p> : null}
              </div>
              <span className="rounded-full bg-mint px-3 py-1 text-xs font-black text-moss">{request.status}</span>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-ink/70">{request.message}</p>
          </article>
        )) : (
          <div className="card-surface p-8 text-center">
            <p className="font-black">No support requests yet.</p>
            <p className="mt-2 text-sm text-ink/60">Requests submitted through the contact page will appear here after `support_requests` exists in Supabase.</p>
          </div>
        )}
      </div>
    </section>
  );
}
