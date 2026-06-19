"use client";

import { ShoppingCart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BundleOption, Product } from "@/lib/types";
import { useCart } from "@/components/store/cart-provider";
import { trackEvent } from "@/lib/tracking-client";
import { defaultBundleOptions } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export function AddToCartActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const bundleOptions: BundleOption[] = product.slug === "pawtrim-led-grinder"
    ? [...defaultBundleOptions]
    : [{ id: "single", label: "1x", quantity: 1, totalPrice: product.price }];
  const [selectedId, setSelectedId] = useState(bundleOptions[0].id);
  const [notice, setNotice] = useState("");
  const selected = bundleOptions.find((bundle) => bundle.id === selectedId) || bundleOptions[0];
  const linePrice = selected.totalPrice;

  function add(openDrawer = true) {
    addItem(product, 1, {
      bundleId: selected.id,
      bundleLabel: selected.label,
      unitPrice: linePrice,
      openDrawer
    });
    setNotice(openDrawer ? "Added to cart. Your mini-cart is ready." : "Added. Taking you to checkout.");
    window.setTimeout(() => setNotice(""), 2600);
    trackEvent("AddToCart", { product_id: product.id, value: selected.totalPrice, bundle: selected.id, units: selected.quantity });
  }

  return (
    <div className="grid gap-4">
      <fieldset className="grid gap-2">
        <legend className="text-sm font-bold text-ink">Choose your offer</legend>
        <div className="grid gap-2">
          {bundleOptions.map((bundle) => (
            <label key={bundle.id} className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-3 ${selectedId === bundle.id ? "border-moss bg-mint" : "border-line bg-white"}`}>
              <span className="flex items-center gap-3">
                <input className="h-4 w-4 accent-moss" type="radio" name="bundle" checked={selectedId === bundle.id} onChange={() => setSelectedId(bundle.id)} />
                <span>
                  <span className="block text-sm font-black">{bundle.label}</span>
                  {bundle.badge ? <span className="mt-1 inline-flex rounded-full bg-coral px-2 py-0.5 text-xs font-bold text-white">{bundle.badge}</span> : null}
                </span>
              </span>
              <span className="text-sm font-black">{formatCurrency(bundle.totalPrice)}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid gap-3 sm:grid-cols-2">
        <button className="btn-secondary gap-2" onClick={() => add(true)}><ShoppingCart className="h-4 w-4" /> Add to Cart</button>
        <button className="btn-primary gap-2" onClick={() => { add(false); trackEvent("InitiateCheckout", { product_id: product.id, value: selected.totalPrice }); router.push("/checkout"); }}><Zap className="h-4 w-4" /> Buy Now</button>
      </div>
      {notice ? <p className="rounded-2xl border border-moss/20 bg-mint p-3 text-sm font-bold text-moss">{notice}</p> : null}
    </div>
  );
}

export function QuickAddButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function quickAdd() {
    addItem(product, 1, { bundleId: "single", bundleLabel: "1x", unitPrice: product.price });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
    trackEvent("AddToCart", { product_id: product.id, value: product.price, source: "quick_add" });
  }

  return (
    <button className="btn-primary w-full" onClick={quickAdd}>
      {added ? "Added" : "Quick Add"}
    </button>
  );
}

export function StickyBuyNow({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();

  function buyNow() {
    addItem(product, 1, {
      bundleId: "single",
      bundleLabel: product.slug === "pawtrim-led-grinder" ? "1x PawTrim LED Grinder" : "1x",
      unitPrice: product.price,
      openDrawer: false
    });
    trackEvent("AddToCart", { product_id: product.id, value: product.price, source: "sticky_buy_now" });
    trackEvent("InitiateCheckout", { product_id: product.id, value: product.price, source: "sticky_buy_now" });
    router.push("/checkout");
  }

  return (
    <button className="btn-primary w-full" onClick={buyNow}>
      Buy Now - {formatCurrency(product.price)}
    </button>
  );
}
