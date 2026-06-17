import Link from "next/link";

export default function ThankYouPage({ searchParams }: { searchParams: { order?: string; email?: string } }) {
  return (
    <section className="container-page py-12">
      <div className="mx-auto max-w-2xl rounded-lg border border-line bg-white p-8 text-center shadow-soft">
        <p className="text-sm font-bold uppercase tracking-wide text-moss">Order Confirmed</p>
        <h1 className="mt-3 text-4xl font-black">Thank you for shopping with Nuvoro Market.</h1>
        <p className="mt-4 text-ink/70">We received your order and will send updates as fulfillment progresses.</p>
        <div className="mt-6 rounded-md bg-cloud p-4 text-left text-sm">
          <p><strong>Order number:</strong> {searchParams.order || "Pending confirmation"}</p>
          <p><strong>Customer email:</strong> {searchParams.email || "Sent by checkout confirmation"}</p>
        </div>
        <div className="mt-6 text-left">
          <h2 className="font-bold">Next steps</h2>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-ink/70">
            <li>Your payment is confirmed by Stripe.</li>
            <li>Our team reviews the order and places the supplier order manually.</li>
            <li>Tracking is emailed once available and can be checked on the tracking page.</li>
          </ol>
        </div>
        <Link href="/order-tracking" className="btn-primary mt-6">Track Order</Link>
      </div>
    </section>
  );
}
