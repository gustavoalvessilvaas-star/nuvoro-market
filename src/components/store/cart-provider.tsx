"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import type { CartItem, Product } from "@/lib/types";
import { getPrimaryProductImage, getProductAlt } from "@/lib/product-media";
import { formatCurrency } from "@/lib/utils";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  drawerOpen: boolean;
  addItem: (product: Product, quantity?: number, options?: { bundleId?: string; bundleLabel?: string; unitPrice?: number; openDrawer?: boolean }) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  removeItem: (cartId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const key = "nuvoro_cart";

function normalizeItems(raw: CartItem[]): CartItem[] {
  return raw.map((item) => ({
    ...item,
    cart_id: item.cart_id || item.product.id,
    unit_price: Number(item.unit_price || item.product.price),
    quantity: Number(item.quantity || 1)
  }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const saved = window.localStorage.getItem(key);
    return saved ? normalizeItems(JSON.parse(saved) as CartItem[]) : [];
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0),
    drawerOpen,
    addItem: (product, quantity = 1, options) => {
      const cartId = `${product.id}:${options?.bundleId || "single"}`;
      const unitPrice = Number(options?.unitPrice || product.price);
      setItems((current) => {
        const existing = current.find((item) => item.cart_id === cartId);
        if (existing) return current.map((item) => item.cart_id === cartId ? { ...item, quantity: item.quantity + quantity } : item);
        return [...current, { cart_id: cartId, product, quantity, unit_price: unitPrice, bundle_id: options?.bundleId, bundle_label: options?.bundleLabel }];
      });
      if (options?.openDrawer !== false) setDrawerOpen(true);
    },
    updateQuantity: (cartId, quantity) => setItems((current) => current.map((item) => item.cart_id === cartId ? { ...item, quantity } : item).filter((item) => item.quantity > 0)),
    removeItem: (cartId) => setItems((current) => current.filter((item) => item.cart_id !== cartId)),
    clearCart: () => setItems([]),
    openCart: () => setDrawerOpen(true),
    closeCart: () => setDrawerOpen(false)
  }), [drawerOpen, items]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <div className={`fixed inset-0 z-50 ${drawerOpen ? "" : "pointer-events-none"}`} aria-hidden={!drawerOpen}>
        <button className={`absolute inset-0 bg-ink/35 transition-opacity ${drawerOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setDrawerOpen(false)} aria-label="Close cart drawer" />
        <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-soft transition-transform ${drawerOpen ? "translate-x-0" : "translate-x-full"}`} aria-label="Shopping cart drawer">
          <div className="flex items-center justify-between border-b border-line p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-mint text-moss"><ShoppingBag className="h-5 w-5" /></span>
              <div>
                <p className="font-black text-ink">Your Cart</p>
                <p className="text-sm text-ink/60">{value.count} item{value.count === 1 ? "" : "s"}</p>
              </div>
            </div>
            <button className="grid h-10 w-10 place-items-center rounded-full border border-line" onClick={() => setDrawerOpen(false)} aria-label="Close cart drawer"><X className="h-5 w-5" /></button>
          </div>
          {items.length ? (
            <>
              <div className="grid flex-1 gap-4 overflow-y-auto p-5">
                {items.map((item) => (
                  <div key={item.cart_id} className="grid grid-cols-[72px_1fr] gap-3 rounded-2xl border border-line p-3">
                    <Image src={getPrimaryProductImage(item.product)} alt={getProductAlt(item.product)} width={90} height={90} className="aspect-square rounded-xl bg-mint object-cover" />
                    <div>
                      <p className="font-bold leading-tight text-ink">{item.product.name}</p>
                      {item.bundle_label ? <p className="mt-1 text-xs font-semibold text-moss">{item.bundle_label}</p> : null}
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button className="grid h-8 w-8 place-items-center rounded-full border border-line" onClick={() => value.updateQuantity(item.cart_id, item.quantity - 1)} aria-label="Decrease quantity">-</button>
                          <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                          <button className="grid h-8 w-8 place-items-center rounded-full border border-line" onClick={() => value.updateQuantity(item.cart_id, item.quantity + 1)} aria-label="Increase quantity">+</button>
                        </div>
                        <p className="text-sm font-black">{formatCurrency(item.unit_price * item.quantity)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-line p-5">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span className="font-black">{formatCurrency(value.subtotal)}</span></div>
                <p className="mt-2 text-xs text-ink/60">Free shipping. Taxes calculated by Stripe when applicable.</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  <Link href="/cart" onClick={() => setDrawerOpen(false)} className="btn-secondary">View Cart</Link>
                  <Link href="/checkout" onClick={() => setDrawerOpen(false)} className="btn-primary">Checkout</Link>
                </div>
                <button className="mt-3 w-full text-sm font-bold text-moss" onClick={() => setDrawerOpen(false)}>Continue shopping</button>
              </div>
            </>
          ) : (
            <div className="grid flex-1 place-items-center p-8 text-center">
              <div>
                <p className="text-xl font-black">Your cart is empty.</p>
                <p className="mt-2 text-sm text-ink/60">Add a smart find to start checkout.</p>
                <Link href="/products" onClick={() => setDrawerOpen(false)} className="btn-primary mt-5">Shop Products</Link>
              </div>
            </div>
          )}
        </aside>
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
