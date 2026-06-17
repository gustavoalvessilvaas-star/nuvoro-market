"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/components/store/cart-provider";
import { siteConfig } from "@/lib/constants";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

const links = [
  { href: "/products", label: "Shop" },
  { href: "/order-tracking", label: "Track Order" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const { count } = useCart();

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email || ""));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email || "");
      router.refresh();
    });
    return () => listener.subscription.unsubscribe();
  }, [router]);

  async function logout() {
    const supabase = getSupabaseBrowser();
    await supabase?.auth.signOut();
    setEmail("");
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const authLinks = email
    ? [{ href: "/account", label: "Account" }]
    : [{ href: "/login", label: "Login" }, { href: "/register", label: "Create Account" }];

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/90 backdrop-blur-xl">
      <div className="container-page flex min-h-16 items-center justify-between gap-4 py-3">
        <Link href="/" className="group flex items-center gap-3 font-black text-ink" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-white shadow-sm group-hover:bg-moss">N</span>
          <span className="leading-tight">
            <span className="block">{siteConfig.name}</span>
            <span className="hidden text-xs font-bold text-ink/50 sm:block">Smart Everyday Essentials</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`nav-link ${pathname === link.href ? "nav-link-active" : ""}`}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            {authLinks.map((link) => (
              <Link key={link.href} href={link.href} className={link.href === "/register" && !email ? "btn-primary min-h-10 px-4 py-2" : `btn-secondary min-h-10 gap-2 px-4 py-2 ${pathname === link.href ? "border-moss text-moss" : ""}`}>
                {link.href === "/account" ? <UserRound className="h-4 w-4" /> : null}
                {link.label}
              </Link>
            ))}
            {email ? (
              <button onClick={logout} className="btn-secondary min-h-10 gap-2 px-4 py-2">
                <LogOut className="h-4 w-4" /> Logout
              </button>
            ) : null}
          </div>
          <Link href="/cart" aria-label="Cart" className="relative grid h-11 w-11 place-items-center rounded-full border border-line bg-white shadow-sm hover:border-moss hover:text-moss">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 ? <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-coral px-1 text-xs font-bold text-white">{count}</span> : null}
          </Link>
          <button className="grid h-11 w-11 place-items-center rounded-full border border-line bg-white shadow-sm lg:hidden" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-line bg-white lg:hidden">
          <nav className="container-page grid gap-2 py-4" aria-label="Mobile navigation">
            {[...links, ...authLinks].map((link) => (
              <Link key={link.href} href={link.href} className={`rounded-xl px-4 py-3 text-sm font-bold ${pathname === link.href ? "bg-mint text-moss" : "text-ink/75"}`} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            {email ? (
              <button className="rounded-xl px-4 py-3 text-left text-sm font-bold text-ink/75" onClick={logout}>
                Logout
              </button>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
