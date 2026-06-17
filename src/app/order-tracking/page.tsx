"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { fulfillmentSteps } from "@/lib/constants";

export default function OrderTrackingPage() {
  const [result, setResult] = useState<{ order_id: string; status: string; tracking_code?: string } | null>(null);
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
      <form onSubmit={submit} className="h-fit rounded-lg border border-line bg-white p-5">
        <h1 className="text-3xl font-black">Track Your Order</h1>
        <p className="mt-2 text-sm text-ink/70">Enter your order ID and email to view fulfillment status.</p>
        <label className="mt-5 grid gap-1"><span className="label">Order ID</span><input className="field" name="order_id" required /></label>
        <label className="mt-4 grid gap-1"><span className="label">Email</span><input className="field" type="email" name="customer_email" required /></label>
        <button className="btn-primary mt-5 w-full">Search</button>
        {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      </form>
      <div className="rounded-lg border border-line bg-white p-5">
        <h2 className="text-xl font-black">Fulfillment Status</h2>
        <div className="mt-6 grid gap-4">
          {fulfillmentSteps.map((step, index) => {
            const activeIndex = result ? fulfillmentSteps.indexOf(result.status as never) : -1;
            const active = index <= activeIndex;
            return <div key={step} className={`rounded-md border p-4 ${active ? "border-moss bg-mint" : "border-line bg-cloud"}`}><p className="font-bold capitalize">{step.replaceAll("_", " ")}</p></div>;
          })}
        </div>
        {result?.tracking_code ? <p className="mt-5 text-sm"><strong>Tracking code:</strong> {result.tracking_code}</p> : null}
      </div>
    </section>
  );
}
