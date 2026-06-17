"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

type AuthMode = "login" | "register" | "forgot-password";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isForgot = mode === "forgot-password";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true);
    setError("");
    setMessage("");

    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setError("Supabase Auth is not configured yet. Add the public Supabase URL and anon key.");
      setLoading(false);
      return;
    }

    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    const fullName = String(formData.get("full_name") || "").trim();

    if (!email.includes("@")) {
      setError("Enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!isForgot && password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (isRegister && fullName.length < 2) {
      setError("Enter your full name.");
      setLoading(false);
      return;
    }

    const redirectTo = `${window.location.origin}/account`;

    if (isForgot) {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (resetError) setError(resetError.message);
      else setMessage("If an account exists for that email, a password reset link has been sent.");
      setLoading(false);
      return;
    }

    if (isRegister) {
      const { data, error: registerError } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }, emailRedirectTo: redirectTo } });
      if (registerError) {
        setError(registerError.message);
        setLoading(false);
        return;
      }
      if (!data.session) {
        setMessage("Account created. Check your email to confirm your account before signing in.");
        setLoading(false);
        return;
      }
      router.push("/account");
      router.refresh();
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card-surface mx-auto grid w-full max-w-md gap-5 p-6 shadow-soft sm:p-8">
      <div>
        <p className="eyebrow">Nuvoro account</p>
        <h1 className="mt-2 text-3xl font-black text-ink">
          {isLogin ? "Welcome back" : isRegister ? "Create your account" : "Reset your password"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-ink/60">
          {isLogin ? "Sign in to view your account and order updates." : isRegister ? "Create an account for faster checkout and order access." : "Enter your email and we will send reset instructions."}
        </p>
      </div>

      {isRegister ? (
        <label className="grid gap-2">
          <span className="label">Full name</span>
          <input className="field" name="full_name" autoComplete="name" required />
        </label>
      ) : null}

      <label className="grid gap-2">
        <span className="label">Email</span>
        <input className="field" name="email" type="email" autoComplete="email" required />
      </label>

      {!isForgot ? (
        <label className="grid gap-2">
          <span className="label">Password</span>
          <input className="field" name="password" type="password" autoComplete={isLogin ? "current-password" : "new-password"} required />
        </label>
      ) : null}

      {error ? <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p> : null}
      {message ? <p className="rounded-md border border-moss/20 bg-mint p-3 text-sm font-medium text-moss">{message}</p> : null}

      <button className="btn-primary w-full gap-2" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {loading ? "Please wait..." : isLogin ? "Login" : isRegister ? "Create Account" : "Send Reset Link"}
      </button>

      <div className="grid gap-2 text-center text-sm text-ink/60">
        {isLogin ? (
          <>
            <Link href="/forgot-password" className="font-semibold text-moss hover:text-ink">Forgot password?</Link>
            <p>New here? <Link href="/register" className="font-semibold text-moss hover:text-ink">Create an account</Link></p>
          </>
        ) : (
          <p>Already have an account? <Link href="/login" className="font-semibold text-moss hover:text-ink">Login</Link></p>
        )}
      </div>
    </form>
  );
}
