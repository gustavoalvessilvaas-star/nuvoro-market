import { notFound } from "next/navigation";

const policies: Record<string, { title: string; body: string[] }> = {
  "privacy-policy": { title: "Privacy Policy", body: ["Nuvoro Market collects information needed to process orders, provide support, improve the site and measure marketing performance.", "Payment details are processed by Stripe. We do not store full card numbers.", "Analytics and advertising tools may use cookies or similar technologies when configured.", "Contact support to request access, correction or deletion where applicable."] },
  "terms-of-use": { title: "Terms of Use", body: ["By using this site, you agree to use it lawfully and provide accurate information at checkout.", "Product descriptions are written for practical clarity and may be updated as supplier details are verified.", "Prices, availability and shipping estimates may change before an order is placed."] },
  "refund-policy": { title: "Refund Policy", body: ["Customers should contact support within 30 days of delivery if an item arrives damaged, defective or materially different from the order.", "Refund eligibility may require photos, order information and supplier review.", "Approved refunds are returned to the original payment method when possible."] },
  "shipping-policy": { title: "Shipping Policy", body: ["Nuvoro Market is prepared for United States shipping at launch.", "Estimated shipping times are shown on product pages and may vary by supplier, destination and carrier.", "Tracking is provided when available from the supplier or carrier."] },
  "return-policy": { title: "Return Policy", body: ["Return instructions must be requested from support before sending items back.", "Some products may not be returnable if used, damaged after delivery or restricted by supplier policy.", "Return costs and warehouse addresses depend on the selected supplier and should be confirmed before launch."] },
  "cookie-policy": { title: "Cookie Policy", body: ["Cookies and localStorage may be used for cart persistence, UTM attribution, analytics and advertising measurement.", "Optional marketing cookies depend on configured Google Analytics and Meta Pixel IDs.", "Browser settings can block or delete cookies, though some site features may be affected."] }
};

export function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }));
}

export default function PolicyPage({ params }: { params: { slug: string } }) {
  const policy = policies[params.slug];
  if (!policy) notFound();
  return (
    <section className="container-page py-12">
      <article className="max-w-3xl rounded-lg border border-line bg-white p-6">
        <h1 className="text-4xl font-black">{policy.title}</h1>
        <p className="mt-3 text-sm font-medium text-ink/60">This template is operational guidance and is not formal legal advice. Obtain legal review before launch.</p>
        <div className="mt-6 grid gap-4 text-ink/75">
          {policy.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </article>
    </section>
  );
}
