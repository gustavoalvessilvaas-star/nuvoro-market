# Metrics Guide

Use `/admin/metrics`.

## Internal Events

The storefront logs these events when configured:

- page view
- product view
- product list view
- search
- add to cart
- view cart
- begin checkout
- add shipping info
- add payment info
- purchase
- refund
- lead
- contact submit

UTM parameters are captured from the storefront and attached to events and checkout orders when available.

## Product Decision Labels

- `Needs better product page`: views exist but add-to-cart is weak.
- `Needs better creative`: add-to-cart exists but checkout is weak.
- `High interest, low conversion`: checkout starts but purchases are weak.
- `Low margin`: unit economics are too thin.
- `Ready for paid test`: interest, add-to-cart and 55%+ margin are present.
- `Potential winner`: purchases exist with acceptable margin.
- `Pause for now`: not enough signal yet.

Do not invent data. If events are empty, wait for real customer activity or test the storefront manually.
