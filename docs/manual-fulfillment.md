# Manual Fulfillment

Nuvoro Market is prepared for manual dropshipping fulfillment.

## Flow

1. Customer places order.
2. Stripe confirms payment through webhook.
3. Order appears in Supabase/admin.
4. Store owner purchases the item from the supplier.
5. Store owner records `supplier_order_id`.
6. Store owner adds `tracking_code` and optional `tracking_url`.
7. Fulfillment status is updated.
8. Customer can track the order from `/order-tracking`.

## Statuses

- `order_received`
- `processing`
- `shipped`
- `in_transit`
- `delivered`

## Supplier Checks

Before scaling a product, verify product quality, US shipping time, tracking reliability, return conditions, compliance risks, reviews and backup supplier availability.
