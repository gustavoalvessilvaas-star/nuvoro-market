"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/tracking-client";

export function ProductListTracker({ productIds, category, query, sort }: { productIds: string[]; category: string; query?: string; sort: string }) {
  useEffect(() => {
    trackEvent("ViewItemList", {
      product_ids: productIds,
      category,
      search_term: query || undefined,
      sort
    });
  }, [category, productIds, query, sort]);

  return null;
}
