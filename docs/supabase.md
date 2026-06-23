# Supabase

## Steps

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Run `supabase/seed.sql`.
4. Run the latest admin operations migration:

```text
supabase/migrations/2026-06-23_admin_dashboard_operations.sql
```

5. Create an admin user in Supabase Auth.
6. Insert the admin user ID into `admin_users`:

```sql
insert into public.admin_users (user_id, role)
values ('AUTH_USER_ID', 'admin')
on conflict (user_id) do update set role = excluded.role;
```

## RLS Model

- Public users can read active products only.
- Public users cannot read orders directly.
- Tracking uses `/api/orders/track` and requires matching order ID and email.
- Admin users can manage products, orders, customers, events, newsletter leads and product images.
- Admin users can manage suppliers, product validation, product-supplier links and store settings.
- Product images are served from the public `product-images` bucket; uploads are restricted to admins.

## Newsletter Leads

Run the latest schema or `supabase/migrations/2026-06-18_newsletter_leads.sql` to create `newsletter_leads`. The table is idempotent and can be run more than once without removing data.

## Admin Operations Fields

Run `supabase/migrations/2026-06-19_admin_ops_fields.sql` to add product SEO, bundle, related product, risk note and supplier cost/compliance fields. The migration uses `ADD COLUMN IF NOT EXISTS` and does not remove existing data.

Run `supabase/migrations/2026-06-23_pawtrim_safe_copy_refresh.sql` if your database was seeded before the safer PawTrim copy was added. It only updates PawTrim rows that still contain older unsafe wording.

## Admin Dashboard Operations

Run `supabase/migrations/2026-06-23_admin_dashboard_operations.sql` to add:

- product margin fields, shipping cost, backup supplier URL, supplier platform and draft status
- order UTM fields and expanded payment/fulfillment statuses
- supplier cost, delivery, sample and tracking fields
- `product_suppliers`
- `product_validation`
- `store_settings`
- RLS policies for the new admin tables
- updated-at triggers and indexes

The migration uses `CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`, `DROP POLICY IF EXISTS` and `DROP TRIGGER IF EXISTS`. It does not remove existing data.

## Admin Access

Admin pages require Supabase Auth plus a matching row in `admin_users`. Customer accounts are not admins unless their Auth user ID is inserted into this table.
