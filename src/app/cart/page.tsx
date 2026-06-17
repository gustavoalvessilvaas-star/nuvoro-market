"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/components/store/cart-provider";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <section className="container-page py-10">
      <h1 className="text-4xl font-black">Cart</h1>
      {items.length ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-4">
            {items.map((item) => (
              <article key={item.product.id} className="grid grid-cols-[96px_1fr] gap-4 rounded-lg border border-line bg-white p-4">
                <Image src={item.product.images[0]} alt={item.product.name} width={160} height={120} className="aspect-square rounded-md object-cover" />
                <div className="grid gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-bold">{item.product.name}</h2>
                      <p className="text-sm text-ink/60">{item.product.short_description}</p>
                    </div>
                    <button aria-label="Remove item" onClick={() => removeItem(item.product.id)} className="grid h-9 w-9 place-items-center rounded-md border border-line"><Trash2 className="h-4 w-4" /></button>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <button className="grid h-9 w-9 place-items-center rounded-md border border-line" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button className="grid h-9 w-9 place-items-center rounded-md border border-line" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
                    </div>
                    <p className="font-bold">{formatCurrency(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <aside className="h-fit rounded-lg border border-line bg-white p-5">
            <h2 className="text-xl font-black">Order Summary</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between"><span>Estimated shipping</span><span>Free</span></div>
              <div className="flex justify-between border-t border-line pt-3 text-lg font-black"><span>Total</span><span>{formatCurrency(subtotal)}</span></div>
            </div>
            <Link href="/checkout" className="btn-primary mt-5 w-full">Proceed to Checkout</Link>
          </aside>
        </div>
      ) : (
        <div className="mt-8 rounded-lg border border-line bg-white p-10 text-center">
          <p className="text-lg font-bold">Your cart is empty.</p>
          <Link href="/products" className="btn-primary mt-5">Shop Products</Link>
        </div>
      )}
    </section>
  );
}
