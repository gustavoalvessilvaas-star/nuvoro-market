# Analytics and Tracking

Implemented events:

- PageView
- ViewContent
- ViewItemList
- AddToCart
- ViewCart
- InitiateCheckout
- AddShippingInfo
- AddPaymentInfo
- Purchase
- Lead
- Search
- ContactSubmit

The app captures UTM parameters in localStorage:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

Add `NEXT_PUBLIC_GA4_MEASUREMENT_ID` for GA4 and `NEXT_PUBLIC_META_PIXEL_ID` for Meta Pixel. Add `META_CAPI_ACCESS_TOKEN` and `META_CAPI_PIXEL_ID` for server-side Meta Conversions API events.

Newsletter submissions post to `/api/newsletter`, record a `Lead` event and upsert `newsletter_leads` when Supabase server credentials are configured.
