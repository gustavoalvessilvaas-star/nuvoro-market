"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function subscribe(formData: FormData) {
    setStatus("loading");
    setMessage("");
    const email = String(formData.get("email") || "");
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "home_newsletter" })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setStatus("error");
      setMessage(data.error || "Could not subscribe right now.");
      return;
    }
    setStatus("success");
    setMessage("You're on the list. We'll send useful drops, not inbox clutter.");
  }

  return (
    <form action={subscribe} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
      <label className="sr-only" htmlFor="newsletter-email">Email address</label>
      <input id="newsletter-email" className="field bg-white" name="email" type="email" placeholder="Email address" required />
      <button className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Joining..." : "Join List"}
      </button>
      {message ? <p className={`text-sm font-semibold sm:col-span-2 ${status === "error" ? "text-red-700" : "text-moss"}`}>{message}</p> : null}
    </form>
  );
}
