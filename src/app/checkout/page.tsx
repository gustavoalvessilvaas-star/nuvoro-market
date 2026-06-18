"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, LockKeyhole } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";
import { TrustBadges } from "@/components/store/trust-badges";
import { formatCurrency } from "@/lib/utils";
import { getStoredUtms, trackEvent } from "@/lib/tracking-client";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const paypalEnabled = process.env.NEXT_PUBLIC_PAYPAL_ENABLED === "true";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setLoading(true);
    setError("");
    trackEvent("InitiateCheckout", { value: subtotal });
    const payload = {
      customer: Object.fromEntries(formData.entries()),
      items: items.map((item) => ({
        cart_id: item.cart_id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        bundle_id: item.bundle_id,
        bundle_label: item.bundle_label,
        product: item.product
      })),
      utm: getStoredUtms()
    };
    const response = await fetch("/api/checkout/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Checkout could not be started.");
      setLoading(false);
      return;
    }
    window.location.href = data.url;
  }

  if (!items.length) {
    return (
      <section className="container-page py-10">
        <div className="card-surface p-10 text-center">
          <h1 className="text-3xl font-black">Your cart is empty</h1>
          <Link href="/products" className="btn-primary mt-5">Shop Products</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_420px]">
      <form onSubmit={submit} className="card-surface p-5 sm:p-7">
        <p className="eyebrow">Protected payment flow</p>
        <h1 className="mt-2 text-3xl font-black">Secure Checkout</h1>
        <p className="mt-2 text-sm leading-6 text-ink/60">Enter your shipping details. Payments are handled by Stripe, and Nuvoro Market never stores card numbers.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ["customer_name", "Full name"], ["customer_email", "Email"], ["customer_phone", "Phone (optional)"],
            ["address1", "Address line 1"], ["address2", "Address line 2"], ["city", "City"],
            ["state", "State"], ["zip", "ZIP code"]
          ].map(([name, label]) => (
            <label key={name} className="grid gap-1">
              <span className="label">{label}</span>
              <input className="field" name={name} required={name !== "address2" && name !== "customer_phone"} />
            </label>
          ))}
          <label className="grid gap-1">
            <span className="label">Country</span>
            <input className="field" name="country" defaultValue="United States" readOnly />
          </label>
        </div>
        {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <button disabled={loading} className="btn-primary mt-6 w-full gap-2"><CreditCard className="h-4 w-4" /> {loading ? "Starting checkout..." : "Pay with Stripe"}</button>
        <button type="button" disabled className="btn-secondary mt-3 w-full">{paypalEnabled ? "PayPal setup pending" : "PayPal coming soon"}</button>
        <p className="mt-4 flex gap-2 text-sm text-ink/60"><LockKeyhole className="h-4 w-4 shrink-0" /> Payments are processed by Stripe. Nuvoro Market does not store card numbers.</p>
      </form>
      <aside className="card-surface h-fit p-5">
        <h2 className="text-xl font-black">Order Summary</h2>
        <div className="mt-4 grid gap-4">
          {items.map((item) => (
            <div key={item.cart_id} className="grid grid-cols-[64px_1fr_auto] gap-3 text-sm">
              <Image src={item.product.images[0]} alt={item.product.name} width={80} height={80} className="aspect-square rounded-md object-cover" />
              <div><p className="font-bold">{item.product.name}</p><p className="text-ink/60">{item.bundle_label ? `${item.bundle_label} - ` : ""}Qty {item.quantity}</p></div>
              <p className="font-bold">{formatCurrency(item.unit_price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 grid gap-3 border-t border-line pt-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>Free</span></div>
          <div className="flex justify-between text-lg font-black"><span>Total</span><span>{formatCurrency(subtotal)}</span></div>
        </div>
        <div className="mt-5">
          <TrustBadges compact />
        </div>
      </aside>
    </section>
  );
}
