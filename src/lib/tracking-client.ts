"use client";

import type { EventName } from "@/lib/types";

type TrackingMetadata = Record<string, unknown>;

const ga4EventNames: Record<EventName, string> = {
  PageView: "page_view",
  ViewContent: "view_item",
  ViewItemList: "view_item_list",
  AddToCart: "add_to_cart",
  ViewCart: "view_cart",
  InitiateCheckout: "begin_checkout",
  AddShippingInfo: "add_shipping_info",
  AddPaymentInfo: "add_payment_info",
  Purchase: "purchase",
  Refund: "refund",
  Lead: "generate_lead",
  Search: "search",
  ContactSubmit: "contact_submit"
};

const metaStandardEvents: Partial<Record<EventName, string>> = {
  PageView: "PageView",
  ViewContent: "ViewContent",
  AddToCart: "AddToCart",
  InitiateCheckout: "InitiateCheckout",
  Purchase: "Purchase",
  Lead: "Lead",
  Search: "Search",
  ContactSubmit: "Contact"
};

export function captureUtmParams() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const captured: Record<string, string> = {};
  keys.forEach((key) => {
    const value = params.get(key);
    if (value) captured[key] = value;
  });
  if (Object.keys(captured).length) window.localStorage.setItem("nuvoro_utm", JSON.stringify(captured));
}

export function getStoredUtms() {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem("nuvoro_utm");
  return raw ? JSON.parse(raw) as Record<string, string> : {};
}

export async function trackEvent(eventName: EventName, metadata: TrackingMetadata = {}) {
  if (typeof window === "undefined") return;
  const utm = getStoredUtms();
  const ga4Name = ga4EventNames[eventName];
  window.gtag?.("event", ga4Name, metadata);
  const metaName = metaStandardEvents[eventName];
  if (metaName) window.fbq?.("track", metaName, metadata);
  else window.fbq?.("trackCustom", ga4Name, metadata);
  await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_name: eventName, source: "web", metadata: { ...metadata, utm } })
  }).catch(() => undefined);
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}
