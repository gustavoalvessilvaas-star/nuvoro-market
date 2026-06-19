import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { NewsletterForm } from "@/components/store/newsletter-form";
import { categories, siteConfig } from "@/lib/constants";

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
    <footer className="mt-16 border-t border-white/10 bg-gradient-to-br from-night via-graphite to-[#102f33] text-white">
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.1fr_.9fr_.8fr_1fr]">
        <div>
          <BrandLogo inverted />
          <p className="mt-2 max-w-md text-sm leading-6 text-white/70">{siteConfig.promise}</p>
          <p className="mt-4 text-sm text-white/70">Support: {siteConfig.supportEmail}</p>
          <div className="mt-5 flex gap-2">
            {["IG", "FB", "TT"].map((item) => <span key={item} className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-xs font-black text-white/70">{item}</span>)}
          </div>
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
          <p className="font-semibold">Categories</p>
          <div className="mt-3 grid gap-2 text-sm text-white/70">
            {categories.map((category) => <Link key={category} href={`/products?category=${encodeURIComponent(category)}`}>{category}</Link>)}
          </div>
        </div>
        <div>
          <p className="font-semibold">Policies</p>
          <div className="mt-3 grid gap-2 text-sm text-white/70">
            {policyLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </div>
        </div>
      </div>
      <div className="container-page border-t border-white/10 py-8">
        <div className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5 lg:grid-cols-[.8fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-black">Get smart finds and practical deals.</p>
            <p className="mt-1 text-sm text-white/60">Useful drops, product tips and launch offers.</p>
          </div>
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">(c) 2026 Nuvoro Market. All rights reserved.</div>
    </footer>
  );
}
