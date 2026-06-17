"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { siteConfig } from "@/lib/constants";

export default function ContactPage() {
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });
    setMessage(response.ok ? "Thanks. Support has received your message." : "Please check your details and try again.");
  }

  return (
    <section className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_380px]">
      <form onSubmit={submit} className="rounded-lg border border-line bg-white p-5">
        <h1 className="text-3xl font-black">Contact Support</h1>
        <p className="mt-2 text-ink/70">We usually respond within 1-2 business days.</p>
        <label className="mt-5 grid gap-1"><span className="label">Name</span><input className="field" name="name" required /></label>
        <label className="mt-4 grid gap-1"><span className="label">Email</span><input className="field" name="email" type="email" required /></label>
        <label className="mt-4 grid gap-1"><span className="label">Message</span><textarea className="field min-h-36" name="message" required /></label>
        <button className="btn-primary mt-5">Send Message</button>
        {message ? <p className="mt-4 text-sm font-medium">{message}</p> : null}
      </form>
      <aside className="h-fit rounded-lg border border-line bg-white p-5">
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
