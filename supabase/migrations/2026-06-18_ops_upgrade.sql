create extension if not exists "pgcrypto";

alter table public.products add column if not exists main_image_url text;
alter table public.products add column if not exists gallery_image_urls jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists lifestyle_image_url text;
alter table public.products add column if not exists demo_video_url text;
alter table public.products add column if not exists gif_url text;
alter table public.products add column if not exists alt_text text;
alter table public.products add column if not exists media_status text not null default 'placeholder';

alter table public.orders add column if not exists tracking_url text;
alter table public.orders add column if not exists internal_notes text;

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
  status text not null default 'idea',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.support_requests enable row level security;
alter table public.suppliers enable row level security;
alter table public.product_validation_candidates enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'support_requests' and policyname = 'Admins manage support requests'
  ) then
    create policy "Admins manage support requests" on public.support_requests
      for all using (public.is_admin()) with check (public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'support_requests' and policyname = 'Service inserts support requests'
  ) then
    create policy "Service inserts support requests" on public.support_requests
      for insert with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'suppliers' and policyname = 'Admins manage suppliers'
  ) then
    create policy "Admins manage suppliers" on public.suppliers
      for all using (public.is_admin()) with check (public.is_admin());
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'product_validation_candidates' and policyname = 'Admins manage product validation'
  ) then
    create policy "Admins manage product validation" on public.product_validation_candidates
      for all using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;
