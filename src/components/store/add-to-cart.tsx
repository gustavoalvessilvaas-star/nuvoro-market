"use client";

import { ShoppingCart, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useCart } from "@/components/store/cart-provider";
import { trackEvent } from "@/lib/tracking-client";

export function AddToCartActions({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();

  function add() {
    addItem(product, 1);
    trackEvent("AddToCart", { product_id: product.id, value: product.price });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button className="btn-secondary gap-2" onClick={add}><ShoppingCart className="h-4 w-4" /> Add to Cart</button>
      <button className="btn-primary gap-2" onClick={() => { add(); router.push("/checkout"); }}><Zap className="h-4 w-4" /> Buy Now</button>
    </div>
  );
}
