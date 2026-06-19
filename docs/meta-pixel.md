# Meta Pixel

## Browser Pixel

Set:

- `NEXT_PUBLIC_META_PIXEL_ID`

When configured, the storefront loads Meta Pixel and sends standard or custom events from the tracking helper.

## Conversions API

Set:

- `META_CAPI_ACCESS_TOKEN`
- `META_CAPI_PIXEL_ID`

Server-side CAPI calls are best-effort and will not crash checkout if credentials are missing.

## Event Mapping

- `PageView` -> Meta `PageView`
- `ViewContent` -> Meta `ViewContent`
- `AddToCart` -> Meta `AddToCart`
- `InitiateCheckout` -> Meta `InitiateCheckout`
- `Purchase` -> Meta `Purchase`
- `Lead` -> Meta `Lead`
- Other funnel events are sent as custom events.

Before paid ads, verify events in Meta Events Manager and confirm no fake reviews or unsupported product claims appear on the site.
