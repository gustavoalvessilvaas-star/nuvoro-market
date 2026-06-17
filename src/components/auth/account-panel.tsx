"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, PackageCheck, UserRound } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import type { Order } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function AccountPanel() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      const supabase = getSupabaseBrowser();
      if (!supabase) {
        setError("Supabase Auth is not configured yet.");
        setLoading(false);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session?.user) {
        router.replace("/login");
        return;
      }

      if (!active) return;
      setEmail(session.user.email || "");
      setFullName(String(session.user.user_metadata?.full_name || ""));

      const response = await fetch("/api/account/orders", {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const data = await response.json().catch(() => ({}));
      if (!active) return;
      if (response.ok) setOrders(data.orders || []);
      else setError(data.error || "Recent orders could not be loaded.");
      setLoading(false);
    }

    loadAccount();
    return () => {
      active = false;
    };
  }, [router]);

  async function logout() {
    const supabase = getSupabaseBrowser();
    await supabase?.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <section className="container-page py-12">
        <div className="card-surface mx-auto max-w-3xl p-8">
          <div className="h-6 w-40 animate-pulse rounded-full bg-line" />
          <div className="mt-6 h-24 animate-pulse rounded-lg bg-cloud" />
        </div>
      </section>
    );
  }

  return (
    <section className="container-page py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Customer account</p>
          <h1 className="mt-2 text-4xl font-black text-ink">Account</h1>
          <p className="mt-2 text-ink/60">Manage your Nuvoro Market profile and order history.</p>
        </div>
        <button onClick={logout} className="btn-secondary gap-2 self-start md:self-auto">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>

      {error ? <p className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p> : null}

      <div className="mt-8 grid gap-5 lg:grid-cols-[360px_1fr]">
        <aside className="card-surface h-fit p-6">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-mint text-moss">
            <UserRound className="h-6 w-6" />
          </span>
          <h2 className="mt-4 text-xl font-black text-ink">{fullName || "Nuvoro customer"}</h2>
          <p className="mt-1 break-words text-sm text-ink/60">{email}</p>
          <div className="mt-5 rounded-lg bg-cloud p-4 text-sm leading-6 text-ink/70">
            Your account is connected through Supabase Auth. Checkout orders can appear here when the order email matches your login email.
          </div>
        </aside>

        <div className="card-surface p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-mint text-moss">
              <PackageCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-ink">Recent Orders</h2>
              <p className="text-sm text-ink/60">Orders tied to your account email.</p>
            </div>
          </div>

          {orders.length ? (
            <div className="mt-5 grid gap-3">
              {orders.map((order) => (
                <article key={order.id} className="rounded-lg border border-line bg-white p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-ink">Order {order.id}</p>
                      <p className="mt-1 text-sm text-ink/60">Fulfillment: {order.fulfillment_status.replaceAll("_", " ")}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-black">{formatCurrency(Number(order.total_amount))}</p>
                      <p className="text-sm text-ink/60">{order.payment_status}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-lg border border-dashed border-line bg-cloud p-8 text-center">
              <p className="font-bold text-ink">No recent orders yet.</p>
              <p className="mt-2 text-sm leading-6 text-ink/60">When you purchase with this email, your orders can appear here.</p>
              <Link href="/products" className="btn-primary mt-5">Shop Smart Finds</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
