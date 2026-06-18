"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { fulfillmentSteps } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

type TrackingResult = {
  order_id: string;
  status: string;
  tracking_code?: string;
  tracking_url?: string;
  updated_at?: string;
  items?: Array<{ quantity: number; unit_price: number; product_snapshot?: { name?: string; bundle_label?: string } }>;
};

export default function OrderTrackingPage() {
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError("");
    setResult(null);
    const response = await fetch("/api/orders/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });
    const data = await response.json();
    if (!response.ok) setError(data.error || "Order not found.");
    else setResult(data);
  }

  return (
    <section className="container-page grid gap-8 py-10 lg:grid-cols-[420px_1fr]">
      <form onSubmit={submit} className="card-surface h-fit p-5">
        <p className="eyebrow">Order status</p>
        <h1 className="mt-2 text-3xl font-black">Track Your Order</h1>
        <p className="mt-2 text-sm text-ink/70">Enter your order ID and email to view fulfillment status.</p>
        <label className="mt-5 grid gap-1"><span className="label">Order ID</span><input className="field" name="order_id" required /></label>
        <label className="mt-4 grid gap-1"><span className="label">Email</span><input className="field" type="email" name="customer_email" required /></label>
        <button className="btn-primary mt-5 w-full">Search</button>
        {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      </form>
      <div className="card-surface p-5">
        <h2 className="text-xl font-black">Fulfillment Status</h2>
        {!result ? <p className="mt-3 text-sm text-ink/60">Your order timeline will appear here after a successful search.</p> : null}
        <div className="mt-6 grid gap-4">
          {fulfillmentSteps.map((step, index) => {
            const activeIndex = result ? fulfillmentSteps.indexOf(result.status as never) : -1;
            const active = index <= activeIndex;
            return <div key={step} className={`rounded-md border p-4 ${active ? "border-moss bg-mint" : "border-line bg-cloud"}`}><p className="font-bold capitalize">{step.replaceAll("_", " ")}</p></div>;
          })}
        </div>
        {result ? (
          <div className="mt-6 grid gap-4 border-t border-line pt-5">
            <div className="grid gap-2 text-sm">
              <p><strong>Order:</strong> {result.order_id}</p>
              <p><strong>Last updated:</strong> {result.updated_at ? new Date(result.updated_at).toLocaleString() : "Pending update"}</p>
              <p><strong>Tracking code:</strong> {result.tracking_code || "Tracking not available yet"}</p>
              {result.tracking_url ? <a className="font-bold text-moss" href={result.tracking_url} target="_blank" rel="noreferrer">Open carrier tracking</a> : null}
            </div>
            {result.items?.length ? (
              <div>
                <h3 className="font-black">Product Summary</h3>
                <div className="mt-3 grid gap-2">
                  {result.items.map((item, index) => (
                    <div key={`${item.product_snapshot?.name || "item"}-${index}`} className="rounded-xl border border-line bg-cloud p-3 text-sm">
                      <p className="font-bold">{item.product_snapshot?.name || "Product"}</p>
                      <p className="text-ink/60">{item.product_snapshot?.bundle_label ? `${item.product_snapshot.bundle_label} - ` : ""}Qty {item.quantity} - {formatCurrency(Number(item.unit_price) * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            <Link href="/contact" className="btn-secondary w-full">Need help? Contact support</Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
