import { notFound } from "next/navigation";

const policies: Record<string, { title: string; body: string[] }> = {
  "privacy-policy": { title: "Privacy Policy", body: ["Nuvoro Market collects information needed to process orders, provide support, improve the storefront and measure marketing performance. This can include name, email, shipping address, phone number, order details, device data and messages sent through support forms.", "Payment details are processed by Stripe. Nuvoro Market does not store full card numbers on its own servers.", "Supabase may store customer, order, support and account records. Vercel may process hosting logs. Analytics and advertising tools may use cookies or similar technologies when configured.", "Information may be used to fulfill orders, prevent fraud, answer support requests, improve product selection, send transactional messages and measure advertising performance.", "Customers can contact support to request access, correction or deletion where applicable. Some records may be retained when required for security, tax, fraud prevention or legitimate business operations."] },
  "terms-of-use": { title: "Terms of Use", body: ["By using this site, you agree to use it lawfully, provide accurate checkout information and avoid interfering with the storefront, admin tools or payment flow.", "Product descriptions are written for practical clarity and may be updated as supplier details are verified. Nuvoro Market avoids unsupported health, safety or performance guarantees.", "Prices, availability, discounts, bundles and shipping estimates may change before an order is placed. A checkout confirmation does not guarantee fulfillment if fraud checks, stock limits or supplier issues require cancellation.", "Account access is intended for the customer who created the account. Admin access is separate and restricted to approved admin users.", "These terms are starter operational language and should be reviewed before public launch."] },
  "refund-policy": { title: "Refund Policy", body: ["Customers should contact support within 30 days of delivery if an item arrives damaged, defective or materially different from the order.", "Refund eligibility may require photos, order information, delivery confirmation and supplier review. Do not discard damaged packaging until support has replied.", "Approved refunds are returned to the original payment method when possible. Processing time may vary based on Stripe, the card issuer and bank rules.", "Shipping charges, return shipping and non-returnable products should be confirmed before launch based on final supplier terms.", "Orders affected by clear fulfillment mistakes, duplicate payment or confirmed non-delivery should be reviewed promptly by the admin team."] },
  "shipping-policy": { title: "Shipping Policy", body: ["Nuvoro Market is prepared for United States shipping at launch. International shipping should remain disabled until supplier, tax and return processes are ready.", "Estimated shipping times are shown on product pages and may vary by supplier, destination, warehouse, weather, carrier delays and order review.", "Tracking is provided when available from the supplier or carrier. Customers can use the order tracking page with order ID and email after tracking is added by an admin.", "Some products may ship separately if fulfilled by different suppliers. Delivery estimates are not guarantees unless a final supplier agreement says otherwise.", "Customers are responsible for entering a complete, accurate shipping address at checkout. Address changes after payment may not be possible once fulfillment begins."] },
  "return-policy": { title: "Return Policy", body: ["Return instructions must be requested from support before sending items back. Unapproved returns may not be accepted by the supplier or warehouse.", "Some products may not be returnable if used, damaged after delivery, missing parts, hygienic in nature or restricted by supplier policy.", "Return costs, restocking rules and warehouse addresses depend on the selected supplier and should be confirmed before launch.", "If a return is approved, customers should package the item securely and provide tracking when available.", "The admin team should record return status, supplier response and refund decision in order notes for clear customer support history."] },
  "cookie-policy": { title: "Cookie Policy", body: ["Cookies and localStorage may be used for cart persistence, UTM attribution, account sessions, analytics and advertising measurement.", "Optional marketing cookies depend on configured Google Analytics and Meta Pixel IDs. Server-side Meta Conversions API events depend on server tokens.", "Essential storage supports core shopping features such as keeping cart items available between page visits.", "Browser settings can block or delete cookies, though some site features may be affected.", "Cookie language should be aligned with the final consent banner and applicable privacy requirements before launch."] }
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
