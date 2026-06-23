# Supabase Admin Schema

Run this SQL file in Supabase SQL Editor:

```text
supabase/migrations/2026-06-23_admin_dashboard_operations.sql
```

It adds or updates:

- `products`: margin, shipping cost, supplier platform, backup supplier, media and draft fields.
- `orders`: UTM/source fields and expanded statuses.
- `suppliers`: product cost, shipping cost, delivery range, tracking quality, sample status and compliance notes.
- `product_suppliers`: links products and suppliers.
- `product_validation`: product idea scoring board.
- `store_settings`: editable store defaults.
- `events`: UTM columns for admin metrics.

The migration is idempotent. It uses safe SQL patterns and does not remove data.

## Security

RLS remains enabled. Public users can read active products only. Admin users can manage admin tables only when their Supabase Auth user ID exists in `admin_users`.
