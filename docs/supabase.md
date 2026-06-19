# Supabase

## Steps

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Run `supabase/seed.sql`.
4. Create an admin user in Supabase Auth.
5. Insert the admin user ID into `admin_users`:

```sql
insert into public.admin_users (user_id, role) values ('AUTH_USER_ID', 'admin');
```

## RLS Model

- Public users can read active products only.
- Public users cannot read orders directly.
- Tracking uses `/api/orders/track` and requires matching order ID and email.
- Admin users can manage products, orders, customers, events, newsletter leads and product images.
- Product images are served from the public `product-images` bucket; uploads are restricted to admins.

## Newsletter Leads

Run the latest schema or `supabase/migrations/2026-06-18_newsletter_leads.sql` to create `newsletter_leads`. The table is idempotent and can be run more than once without removing data.

## Admin Operations Fields

Run `supabase/migrations/2026-06-19_admin_ops_fields.sql` to add product SEO, bundle, related product, risk note and supplier cost/compliance fields. The migration uses `ADD COLUMN IF NOT EXISTS` and does not remove existing data.

## Admin Access

Admin pages require Supabase Auth plus a matching row in `admin_users`. Customer accounts are not admins unless their Auth user ID is inserted into this table.
