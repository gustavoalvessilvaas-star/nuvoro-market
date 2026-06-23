# Admin Guide

Admin routes live under `/admin` and are separate from customer login.

## Admin Routes

- `/admin`: revenue, order, funnel, product performance and operations alerts.
- `/admin/products`: create, edit, activate, deactivate and review product margins/media/suppliers.
- `/admin/orders`: search orders, update payment/fulfillment, add supplier ID, tracking and internal notes.
- `/admin/suppliers`: create suppliers, link to products and compare cost, delivery, tracking and sample quality.
- `/admin/metrics`: product funnel, estimated profit and paid-test decisions.
- `/admin/product-validation`: score product ideas and convert approved ideas to product drafts.
- `/admin/settings`: store defaults and integration status without exposing secrets.
- `/admin/customers`, `/admin/events`, `/admin/support`: operational records.

## Create The First Admin User

1. In Supabase Auth, create or invite the owner user.
2. Copy the user's Auth UUID.
3. Run this SQL:

```sql
insert into public.admin_users (user_id, role)
values ('AUTH_USER_ID', 'admin')
on conflict (user_id) do update set role = excluded.role;
```

Only users in `admin_users` can access `/admin`. Normal customers must not be inserted into that table.

## Daily Admin Flow

1. Open `/admin` and check alerts.
2. In `/admin/orders`, handle paid orders without supplier IDs first.
3. Buy the product manually from the selected supplier.
4. Save `supplier_order_id`.
5. Add `tracking_code` and `tracking_url` when available.
6. Set fulfillment to `shipped`, `in_transit`, `delivered`, `cancelled` or `returned`.
7. Use resend buttons only after checking the customer's email and tracking details.
8. Review `/admin/metrics` before spending on paid ads.

## Manual Supabase SQL

Run this latest migration after the base schema:

```text
supabase/migrations/2026-06-23_admin_dashboard_operations.sql
```

It is idempotent and can be run more than once.
