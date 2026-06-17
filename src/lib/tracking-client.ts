"use client";

import type { EventName } from "@/lib/types";

type TrackingMetadata = Record<string, unknown>;

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
  window.gtag?.("event", eventName, metadata);
  window.fbq?.("track", eventName, metadata);
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
