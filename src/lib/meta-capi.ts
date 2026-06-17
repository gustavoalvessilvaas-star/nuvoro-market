import type { EventName } from "@/lib/types";

export async function sendMetaCapiEvent(eventName: EventName, metadata: Record<string, unknown>) {
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  const pixelId = process.env.META_CAPI_PIXEL_ID;
  if (!token || !pixelId) return { skipped: true };

  const response = await fetch(`https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [{
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        custom_data: metadata
      }]
    })
  });
  return response.json();
}
