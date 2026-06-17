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
- Admin users can manage products, orders, customers, events and product images.
- Product images are served from the public `product-images` bucket; uploads are restricted to admins.
