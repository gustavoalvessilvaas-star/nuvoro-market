# Admin Guide

Admin routes live under `/admin` and must remain separate from customer login.

## Current Admin Areas

- `/admin`: dashboard and metrics
- `/admin/products`: product management
- `/admin/orders`: order operations
- `/admin/customers`: customers
- `/admin/events`: event log
- `/admin/support`: support requests
- `/admin/suppliers`: supplier quality and operations view
- `/admin/validation`: product validation board

## Required Protection

Admin pages and admin POST endpoints require Supabase Auth plus a matching row in the `admin_users` table. Normal customer accounts must not be inserted into `admin_users`.

```sql
insert into public.admin_users (user_id, role)
values ('AUTH_USER_ID', 'admin');
```

## Operational Priorities

1. Keep products active/inactive accurately.
2. Record supplier and tracking details.
3. Update fulfillment status promptly.
4. Watch event drop-off from product view to checkout to purchase.
5. Do not add risky products without compliance review.
6. Keep supplier sample status and validation scores updated before scaling ads.
