"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { siteConfig } from "@/lib/constants";

export default function ContactPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });
    setLoading(false);
    if (response.ok) {
      setMessage("Thanks. Support has received your message.");
      event.currentTarget.reset();
    } else {
      setError("Please check your details and try again.");
    }
  }

  return (
    <section className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_380px]">
      <form onSubmit={submit} className="card-surface p-5 sm:p-7">
        <p className="eyebrow">Support</p>
        <h1 className="mt-2 text-3xl font-black">Contact Support</h1>
        <p className="mt-2 text-ink/70">We usually respond within 1-2 business days.</p>
        <label className="mt-5 grid gap-1"><span className="label">Name</span><input className="field" name="name" required /></label>
        <label className="mt-4 grid gap-1"><span className="label">Email</span><input className="field" name="email" type="email" required /></label>
        <label className="mt-4 grid gap-1"><span className="label">Order ID (optional)</span><input className="field" name="order_id" /></label>
        <label className="mt-4 grid gap-1">
          <span className="label">Reason</span>
          <select className="field" name="reason" required defaultValue="Order question">
            {["Order question", "Tracking", "Return/refund", "Product question", "Other"].map((reason) => <option key={reason}>{reason}</option>)}
          </select>
        </label>
        <label className="hidden"><span>Company</span><input name="company" tabIndex={-1} autoComplete="off" /></label>
        <label className="mt-4 grid gap-1"><span className="label">Message</span><textarea className="field min-h-36" name="message" required /></label>
        <button className="btn-primary mt-5" disabled={loading}>{loading ? "Sending..." : "Send Message"}</button>
        {message ? <p className="mt-4 text-sm font-medium">{message}</p> : null}
        {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      </form>
      <aside className="card-surface h-fit p-5">
        <h2 className="text-xl font-black">Support</h2>
        <p className="mt-3 text-sm text-ink/70">{siteConfig.supportEmail}</p>
        <div className="mt-5 grid gap-2 text-sm">
          <a href="/order-tracking" className="font-semibold text-moss">Track an order</a>
          <a href="/policies/shipping-policy" className="font-semibold text-moss">Shipping policy</a>
          <a href="/policies/refund-policy" className="font-semibold text-moss">Refund policy</a>
        </div>
      </aside>
    </section>
  );
}
