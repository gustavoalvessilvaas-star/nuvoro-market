"use client";

import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/store/cart-provider";
import { siteConfig } from "@/lib/constants";

const links = [
  { href: "/products", label: "Shop" },
  { href: "/order-tracking", label: "Track Order" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-ink">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-moss text-white">N</span>
          <span>{siteConfig.name}</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-ink/75 hover:text-moss">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/cart" aria-label="Cart" className="relative grid h-10 w-10 place-items-center rounded-md border border-line bg-white">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-coral px-1 text-xs font-bold text-white">{count}</span> : null}
          </Link>
          <button className="grid h-10 w-10 place-items-center rounded-md border border-line md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      {open ? (
        <nav className="container-page grid gap-3 border-t border-line bg-white py-4 md:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="py-2 text-sm font-medium" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
