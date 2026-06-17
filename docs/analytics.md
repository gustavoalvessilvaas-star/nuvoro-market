# Analytics and Tracking

Implemented events:

- PageView
- ViewContent
- AddToCart
- InitiateCheckout
- Purchase
- Lead
- Search

The app captures UTM parameters in localStorage:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

Add `NEXT_PUBLIC_GA4_MEASUREMENT_ID` for GA4 and `NEXT_PUBLIC_META_PIXEL_ID` for Meta Pixel. Add `META_CAPI_ACCESS_TOKEN` and `META_CAPI_PIXEL_ID` for server-side Meta Conversions API events.
