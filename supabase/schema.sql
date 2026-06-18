create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text not null default '',
  short_description text not null default '',
  headline text not null default '',
  subheadline text not null default '',
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  cost_price numeric(10,2),
  category text not null,
  images jsonb not null default '[]'::jsonb,
  main_image_url text,
  gallery_image_urls jsonb not null default '[]'::jsonb,
  lifestyle_image_url text,
  demo_video_url text,
  gif_url text,
  alt_text text,
  media_status text not null default 'placeholder' check (media_status in ('placeholder','supplier-approved','original-content')),
  benefits jsonb not null default '[]'::jsonb,
  details jsonb not null default '{}'::jsonb,
  faqs jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active','inactive')),
  supplier_name text,
  supplier_url text,
  shipping_estimate text not null default 'Estimated 7-14 business days',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  shipping_address jsonb not null,
  total_amount numeric(10,2) not null,
  payment_status text not null default 'pending',
  fulfillment_status text not null default 'order_received',
  tracking_code text,
  tracking_url text,
  supplier_order_id text,
  internal_notes text,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  product_snapshot jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  product_id uuid references public.products(id),
  order_id uuid references public.orders(id),
  user_id uuid,
  customer_email text,
  source text not null default 'web',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  order_id text,
  reason text not null,
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  platform text,
  supplier_url text,
  contact_email text,
  warehouse_location text,
  average_shipping_days int,
  tracking_quality text,
  return_policy_notes text,
  product_quality_score int,
  sample_ordered boolean not null default false,
  sample_received boolean not null default false,
  backup_supplier_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_validation_candidates (
  id uuid primary key default gen_random_uuid(),
  product_idea text not null,
  category text,
  demand_score int,
  wow_factor_score int,
  margin_score int,
  logistics_risk int,
  compliance_risk int,
  supplier_confidence int,
  creative_potential int,
  status text not null default 'idea' check (status in ('idea','researching','sample ordered','approved','rejected','testing','winner')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.events enable row level security;
alter table public.admin_users enable row level security;
alter table public.support_requests enable row level security;
alter table public.suppliers enable row level security;
alter table public.product_validation_candidates enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer as $$
  select exists(select 1 from public.admin_users where user_id = auth.uid());
$$;

create policy "Public can read active products" on public.products for select using (status = 'active');
create policy "Admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage customers" on public.customers for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage orders" on public.orders for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage order items" on public.order_items for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage events" on public.events for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins read admin users" on public.admin_users for select using (public.is_admin());
create policy "Admins manage support requests" on public.support_requests for all using (public.is_admin()) with check (public.is_admin());
create policy "Service inserts support requests" on public.support_requests for insert with check (true);
create policy "Admins manage suppliers" on public.suppliers for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage product validation" on public.product_validation_candidates for all using (public.is_admin()) with check (public.is_admin());

create policy "Service inserts events" on public.events for insert with check (true);

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public reads product images" on storage.objects for select using (bucket_id = 'product-images');
create policy "Admins upload product images" on storage.objects for insert with check (bucket_id = 'product-images' and public.is_admin());
create policy "Admins update product images" on storage.objects for update using (bucket_id = 'product-images' and public.is_admin());
create policy "Admins delete product images" on storage.objects for delete using (bucket_id = 'product-images' and public.is_admin());
