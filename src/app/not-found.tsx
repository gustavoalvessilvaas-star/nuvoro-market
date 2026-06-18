import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-page grid min-h-[60vh] place-items-center py-12 text-center">
      <div className="card-surface max-w-xl p-8 shadow-soft">
        <p className="eyebrow">404</p>
        <h1 className="mt-2 text-4xl font-black text-ink">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-ink/60">This page may have moved or no longer exists. You can keep shopping smart everyday finds.</p>
        <Link href="/products" className="btn-primary mt-6">Shop Products</Link>
      </div>
    </section>
  );
}
