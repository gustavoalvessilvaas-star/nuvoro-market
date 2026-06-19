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
  seo_title text,
  seo_description text,
  bundle_options jsonb not null default '[]'::jsonb,
  related_product_ids jsonb not null default '[]'::jsonb,
  how_it_works jsonb not null default '[]'::jsonb,
  risk_notes text,
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

create table if not exists public.newsletter_leads (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text not null default 'site',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  platform text,
  supplier_url text,
  product_cost numeric(10,2),
  shipping_cost numeric(10,2),
  contact_email text,
  warehouse_location text,
  average_shipping_days int,
  tracking_quality text,
  return_policy_notes text,
  compliance_notes text,
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

alter table public.products add column if not exists main_image_url text;
alter table public.products add column if not exists gallery_image_urls jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists lifestyle_image_url text;
alter table public.products add column if not exists demo_video_url text;
alter table public.products add column if not exists gif_url text;
alter table public.products add column if not exists alt_text text;
alter table public.products add column if not exists seo_title text;
alter table public.products add column if not exists seo_description text;
alter table public.products add column if not exists bundle_options jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists related_product_ids jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists how_it_works jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists risk_notes text;
alter table public.products add column if not exists media_status text not null default 'placeholder';

alter table public.suppliers add column if not exists product_cost numeric(10,2);
alter table public.suppliers add column if not exists shipping_cost numeric(10,2);
alter table public.suppliers add column if not exists compliance_notes text;

alter table public.orders add column if not exists tracking_url text;
alter table public.orders add column if not exists internal_notes text;

alter table public.support_requests add column if not exists order_id text;
alter table public.support_requests drop constraint if exists support_requests_order_id_fkey;
alter table public.support_requests alter column order_id type text using order_id::text;

alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.events enable row level security;
alter table public.admin_users enable row level security;
alter table public.support_requests enable row level security;
alter table public.newsletter_leads enable row level security;
alter table public.suppliers enable row level security;
alter table public.product_validation_candidates enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer as $$
  select exists(select 1 from public.admin_users where user_id = auth.uid());
$$;

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products" on public.products for select using (status = 'active');

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage customers" on public.customers;
create policy "Admins manage customers" on public.customers for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders" on public.orders for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage order items" on public.order_items;
create policy "Admins manage order items" on public.order_items for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage events" on public.events;
create policy "Admins manage events" on public.events for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins read admin users" on public.admin_users;
create policy "Admins read admin users" on public.admin_users for select using (public.is_admin());

drop policy if exists "Admins manage support requests" on public.support_requests;
create policy "Admins manage support requests" on public.support_requests for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Service inserts support requests" on public.support_requests;
create policy "Service inserts support requests" on public.support_requests for insert with check (true);

drop policy if exists "Admins manage suppliers" on public.suppliers;
create policy "Admins manage suppliers" on public.suppliers for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage product validation" on public.product_validation_candidates;
create policy "Admins manage product validation" on public.product_validation_candidates for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Service inserts events" on public.events;
create policy "Service inserts events" on public.events for insert with check (true);

drop policy if exists "Admins manage newsletter leads" on public.newsletter_leads;
create policy "Admins manage newsletter leads" on public.newsletter_leads for all using (public.is_admin()) with check (public.is_admin());

insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public reads product images" on storage.objects;
create policy "Public reads product images" on storage.objects for select using (bucket_id = 'product-images');

drop policy if exists "Admins upload product images" on storage.objects;
create policy "Admins upload product images" on storage.objects for insert with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins update product images" on storage.objects;
create policy "Admins update product images" on storage.objects for update using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins delete product images" on storage.objects;
create policy "Admins delete product images" on storage.objects for delete using (bucket_id = 'product-images' and public.is_admin());
