"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function AdminLoginPage() {
  const [message, setMessage] = useState("");

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      setMessage("Supabase Auth is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }
    const supabase = createClient(url, key);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setMessage(error ? error.message : "Signed in. Open the admin dashboard.");
  }

  return (
    <section className="container-page py-12">
      <form onSubmit={login} className="mx-auto max-w-md rounded-lg border border-line bg-white p-6">
        <h1 className="text-3xl font-black">Admin Login</h1>
        <label className="mt-5 grid gap-1"><span className="label">Email</span><input className="field" type="email" name="email" required /></label>
        <label className="mt-4 grid gap-1"><span className="label">Password</span><input className="field" type="password" name="password" required /></label>
        <button className="btn-primary mt-5 w-full">Sign in</button>
        {message ? <p className="mt-4 text-sm text-ink/70">{message}</p> : null}
      </form>
    </section>
  );
}
