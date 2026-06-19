"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";
import { TrustBadges } from "@/components/store/trust-badges";
import { getPrimaryProductImage, getProductAlt } from "@/lib/product-media";
import { formatCurrency } from "@/lib/utils";
import { trackEvent } from "@/lib/tracking-client";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    trackEvent("ViewCart", { value: subtotal, items: items.length });
  }, [items.length, subtotal]);

  return (
    <section className="container-page py-10">
      <p className="eyebrow">Review your order</p>
      <h1 className="mt-2 text-4xl font-black text-ink">Cart</h1>
      {items.length ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-4">
            {items.map((item) => (
              <article key={item.cart_id} className="card-surface grid grid-cols-[96px_1fr] gap-4 p-4">
                <Image src={getPrimaryProductImage(item.product)} alt={getProductAlt(item.product)} width={160} height={120} className="aspect-square rounded-2xl bg-mint object-cover" />
                <div className="grid gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-bold">{item.product.name}</h2>
                      {item.bundle_label ? <p className="text-sm font-semibold text-moss">{item.bundle_label}</p> : null}
                      <p className="text-sm text-ink/60">{item.product.short_description}</p>
                    </div>
                    <button aria-label="Remove item" onClick={() => removeItem(item.cart_id)} className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white hover:border-coral hover:text-coral"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <button className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white" onClick={() => updateQuantity(item.cart_id, item.quantity - 1)} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white" onClick={() => updateQuantity(item.cart_id, item.quantity + 1)} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
                    </div>
                    <p className="font-bold">{formatCurrency(item.unit_price * item.quantity)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <aside className="card-surface h-fit p-5">
            <h2 className="text-xl font-black">Order Summary</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between"><span>Estimated shipping</span><span>Free</span></div>
              <div className="flex justify-between border-t border-line pt-3 text-lg font-black"><span>Total</span><span>{formatCurrency(subtotal)}</span></div>
            </div>
            <Link href="/checkout" className="btn-primary mt-5 w-full">Proceed to Checkout</Link>
            <Link href="/products" className="btn-secondary mt-3 w-full">Continue Shopping</Link>
            <div className="mt-4 flex flex-wrap justify-center gap-2" aria-label="Payment methods">
              {["Visa", "Mastercard", "Amex", "Stripe"].map((item) => <span key={item} className="payment-chip">{item}</span>)}
            </div>
            <p className="mt-4 text-center text-xs font-medium text-ink/50">Free shipping and secure Stripe payment flow.</p>
          </aside>
        </div>
      ) : (
        <div className="card-surface mt-8 p-10 text-center">
          <p className="text-xl font-black">Your cart is empty.</p>
          <p className="mt-2 text-sm text-ink/60">Discover useful everyday products curated for simple routines.</p>
          <Link href="/products" className="btn-primary mt-5">Shop Products</Link>
        </div>
      )}
      <div className="mt-10">
        <TrustBadges compact />
      </div>
    </section>
  );
}
