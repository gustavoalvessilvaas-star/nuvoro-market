"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  BarChart3,
  Boxes,
  CheckSquare,
  LayoutDashboard,
  LifeBuoy,
  ListOrdered,
  LogOut,
  Menu,
  Settings,
  Truck,
  Users,
  X
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { getSupabaseBrowser } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", Icon: Boxes },
  { href: "/admin/orders", label: "Orders", Icon: ListOrdered },
  { href: "/admin/suppliers", label: "Suppliers", Icon: Truck },
  { href: "/admin/metrics", label: "Metrics", Icon: BarChart3 },
  { href: "/admin/product-validation", label: "Validation", Icon: CheckSquare },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
  { href: "/admin/customers", label: "Customers", Icon: Users },
  { href: "/admin/support", label: "Support", Icon: LifeBuoy }
];

type AdminShellProps = {
  children: ReactNode;
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
};

export function AdminShell({ children, title, eyebrow = "Nuvoro admin", description, actions }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    const supabase = getSupabaseBrowser();
    await supabase?.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const nav = (
    <nav className="grid gap-1">
      {navItems.map(({ href, label, Icon }) => {
        const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-black text-white/68 hover:bg-white/10 hover:text-white",
              active && "bg-white text-night shadow-glow hover:bg-white hover:text-night"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-night text-white">
      <div className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-[#0a101d]/95 p-5 lg:block">
        <BrandLogo href="/admin" inverted />
        <div className="mt-8">{nav}</div>
        <button
          type="button"
          onClick={logout}
          className="absolute bottom-5 left-5 right-5 flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-black text-white/75 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      <header className="sticky top-0 z-20 border-b border-white/10 bg-night/88 backdrop-blur lg:ml-72">
        <div className="flex min-h-20 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-white/15 bg-white/5 text-white lg:hidden"
            aria-label="Open admin navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-aqua">{eyebrow}</p>
            <h1 className="mt-1 truncate text-2xl font-black sm:text-3xl">{title}</h1>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            {actions}
            <Link href="/" className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-black text-white/75 hover:bg-white/10 hover:text-white">
              Storefront
            </Link>
          </div>
        </div>
        {description ? <p className="px-4 pb-4 text-sm leading-6 text-white/60 sm:px-6 lg:px-8">{description}</p> : null}
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} aria-label="Close admin navigation" />
          <aside className="relative h-full w-[84vw] max-w-sm border-r border-white/10 bg-[#0a101d] p-5">
            <div className="flex items-center justify-between gap-3">
              <BrandLogo href="/admin" inverted onClick={() => setOpen(false)} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-2xl border border-white/15 text-white"
                aria-label="Close admin navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-8">{nav}</div>
            <button
              type="button"
              onClick={logout}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-black text-white/75"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </aside>
        </div>
      ) : null}

      <main className="lg:ml-72">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
