# Admin Guide

Admin routes live under `/admin` and must remain separate from customer login.

## Current Admin Areas

- `/admin`: dashboard and metrics
- `/admin/products`: product management
- `/admin/orders`: order operations
- `/admin/customers`: customers
- `/admin/events`: event log
- `/admin/support`: support requests

## Required Protection

Use Supabase Auth and the `admin_users` table. Normal customer accounts must not be inserted into `admin_users`.

## Operational Priorities

1. Keep products active/inactive accurately.
2. Record supplier and tracking details.
3. Update fulfillment status promptly.
4. Watch event drop-off from product view to checkout to purchase.
5. Do not add risky products without compliance review.
