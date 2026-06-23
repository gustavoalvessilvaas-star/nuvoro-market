"use client";

import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="container-page grid min-h-[60vh] place-items-center py-16">
      <div className="card-surface max-w-xl p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-mint text-moss">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-3xl font-black text-ink">Something went wrong.</h1>
        <p className="mt-3 text-sm leading-6 text-ink/70">The storefront hit a temporary issue. Try again, or return to the product catalog.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button className="btn-primary gap-2" onClick={reset}>
            <RefreshCcw className="h-4 w-4" /> Try Again
          </button>
          <Link href="/products" className="btn-secondary">Shop Products</Link>
        </div>
      </div>
    </section>
  );
}
