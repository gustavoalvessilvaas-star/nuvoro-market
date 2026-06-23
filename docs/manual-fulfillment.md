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
- `cancelled`
- `returned`

Payment statuses:

- `pending`
- `paid`
- `failed`
- `refunded`
- `partially_refunded`

## Admin Steps

1. Open `/admin/orders`.
2. Search by order ID, customer email, customer name or tracking code.
3. Copy the shipping address or fulfillment block.
4. Purchase the item from the selected supplier.
5. Save the supplier order ID.
6. Add tracking code and tracking URL.
7. Mark the order as shipped.
8. Send the tracking email only after verifying the tracking details.
9. Customers can use `/order-tracking` with order ID and matching email.

## Supplier Checks

Before scaling a product, verify product quality, US shipping time, tracking reliability, return conditions, compliance risks, reviews and backup supplier availability.
