"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/tracking-client";

export function ProductViewTracker({ productId, value }: { productId: string; value: number }) {
  useEffect(() => {
    trackEvent("ViewContent", { product_id: productId, value });
  }, [productId, value]);
  return null;
}
