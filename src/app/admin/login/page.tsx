"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { getSupabaseBrowser, getSupabaseBrowserConfigError } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
  const [message, setMessage] = useState("");

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setMessage(getSupabaseBrowserConfigError() || "Supabase Auth is not configured yet.");
      return;
    }
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : "Signed in. Open the admin dashboard.");
  }

  return (
    <section className="container-page py-12">
      <form onSubmit={login} className="card-surface mx-auto max-w-md p-6">
        <p className="eyebrow">Admin only</p>
        <h1 className="mt-2 text-3xl font-black">Admin Login</h1>
        <label className="mt-5 grid gap-1"><span className="label">Email</span><input className="field" type="email" name="email" required /></label>
        <label className="mt-4 grid gap-1"><span className="label">Password</span><input className="field" type="password" name="password" required /></label>
        <button className="btn-primary mt-5 w-full">Sign in</button>
        {message ? <p className="mt-4 text-sm text-ink/70">{message}</p> : null}
      </form>
    </section>
  );
}
