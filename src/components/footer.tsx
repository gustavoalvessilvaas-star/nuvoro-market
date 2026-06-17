import Link from "next/link";
import { siteConfig } from "@/lib/constants";

const policyLinks = [
  ["Privacy Policy", "/policies/privacy-policy"],
  ["Terms of Use", "/policies/terms-of-use"],
  ["Refund Policy", "/policies/refund-policy"],
  ["Shipping Policy", "/policies/shipping-policy"],
  ["Return Policy", "/policies/return-policy"],
  ["Cookie Policy", "/policies/cookie-policy"]
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-ink text-white">
      <div className="container-page grid gap-8 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="text-lg font-black">{siteConfig.name}</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-white/70">{siteConfig.promise}</p>
          <p className="mt-4 text-sm text-white/70">Support: {siteConfig.supportEmail}</p>
        </div>
        <div>
          <p className="font-semibold">Shop</p>
          <div className="mt-3 grid gap-2 text-sm text-white/70">
            <Link href="/products">All Products</Link>
            <Link href="/order-tracking">Order Tracking</Link>
            <Link href="/account">Account</Link>
            <Link href="/contact">Contact Support</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold">Policies</p>
          <div className="mt-3 grid gap-2 text-sm text-white/70">
            {policyLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">(c) 2026 Nuvoro Market. All rights reserved.</div>
    </footer>
  );
}
