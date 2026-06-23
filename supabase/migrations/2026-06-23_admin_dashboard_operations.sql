create extension if not exists "pgcrypto";

create or replace function public.is_admin()
returns boolean language sql stable security definer as $$
  select exists(select 1 from public.admin_users where user_id = auth.uid());
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter table public.products add column if not exists shipping_cost numeric(10,2);
alter table public.products add column if not exists estimated_total_cost numeric(10,2);
alter table public.products add column if not exists estimated_margin_amount numeric(10,2);
alter table public.products add column if not exists estimated_margin_percent numeric(10,2);
alter table public.products add column if not exists supplier_platform text;
alter table public.products add column if not exists backup_supplier_url text;
alter table public.products add column if not exists related_products jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists gallery_image_urls jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists bundle_options jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists how_it_works jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists risk_notes text;
alter table public.products drop constraint if exists products_status_check;
alter table public.products add constraint products_status_check check (status in ('active','inactive','draft'));
alter table public.products drop constraint if exists products_media_status_check;
alter table public.products add constraint products_media_status_check check (media_status in ('placeholder','supplier-approved','original-content'));

update public.products
set
  estimated_total_cost = coalesce(cost_price, 0) + coalesce(shipping_cost, 0),
  estimated_margin_amount = price - (coalesce(cost_price, 0) + coalesce(shipping_cost, 0)),
  estimated_margin_percent = case when price > 0 then ((price - (coalesce(cost_price, 0) + coalesce(shipping_cost, 0))) / price) * 100 else null end
where estimated_total_cost is null
   or estimated_margin_amount is null
   or estimated_margin_percent is null;

alter table public.orders add column if not exists source text;
alter table public.orders add column if not exists utm_source text;
alter table public.orders add column if not exists utm_medium text;
alter table public.orders add column if not exists utm_campaign text;
alter table public.orders add column if not exists utm_content text;
alter table public.orders add column if not exists utm_term text;
alter table public.orders drop constraint if exists orders_payment_status_check;
alter table public.orders add constraint orders_payment_status_check check (payment_status in ('pending','paid','failed','refunded','partially_refunded'));
alter table public.orders drop constraint if exists orders_fulfillment_status_check;
alter table public.orders add constraint orders_fulfillment_status_check check (fulfillment_status in ('order_received','processing','shipped','in_transit','delivered','cancelled','returned'));

alter table public.events add column if not exists utm_source text;
alter table public.events add column if not exists utm_medium text;
alter table public.events add column if not exists utm_campaign text;
alter table public.events add column if not exists utm_content text;
alter table public.events add column if not exists utm_term text;

alter table public.suppliers add column if not exists product_id uuid references public.products(id);
alter table public.suppliers add column if not exists backup_supplier_url text;
alter table public.suppliers add column if not exists product_cost numeric(10,2);
alter table public.suppliers add column if not exists shipping_cost numeric(10,2);
alter table public.suppliers add column if not exists total_estimated_cost numeric(10,2);
alter table public.suppliers add column if not exists estimated_delivery_days_min int;
alter table public.suppliers add column if not exists estimated_delivery_days_max int;
alter table public.suppliers add column if not exists tracking_available boolean not null default false;
alter table public.suppliers add column if not exists sample_approved boolean not null default false;
alter table public.suppliers add column if not exists observations text;
alter table public.suppliers add column if not exists compliance_notes text;
alter table public.suppliers drop constraint if exists suppliers_platform_check;
alter table public.suppliers add constraint suppliers_platform_check check (platform is null or platform in ('AliExpress','DSers','CJdropshipping','Zendrop','Spocket','AutoDS','Other'));
alter table public.suppliers drop constraint if exists suppliers_tracking_quality_check;
alter table public.suppliers add constraint suppliers_tracking_quality_check check (tracking_quality is null or tracking_quality in ('unknown','poor','acceptable','good','excellent'));

update public.suppliers
set total_estimated_cost = coalesce(product_cost, 0) + coalesce(shipping_cost, 0)
where total_estimated_cost is null;

create table if not exists public.product_suppliers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(product_id, supplier_id)
);

create table if not exists public.product_validation (
  id uuid primary key default gen_random_uuid(),
  product_name text not null,
  category text,
  product_url text,
  supplier_url text,
  backup_supplier_url text,
  estimated_product_cost numeric(10,2),
  estimated_shipping_cost numeric(10,2),
  estimated_selling_price numeric(10,2),
  demand_score int,
  wow_factor_score int,
  margin_score int,
  logistics_risk_score int,
  compliance_risk_score int,
  supplier_confidence_score int,
  creative_potential_score int,
  total_score int,
  status text not null default 'idea',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.product_validation drop constraint if exists product_validation_status_check;
alter table public.product_validation add constraint product_validation_status_check check (status in ('idea','researching','sample_ordered','sample_received','approved','rejected','testing','winner','paused'));

do $$
begin
  if to_regclass('public.product_validation_candidates') is not null then
    insert into public.product_validation (
      id,
      product_name,
      category,
      demand_score,
      wow_factor_score,
      margin_score,
      logistics_risk_score,
      compliance_risk_score,
      supplier_confidence_score,
      creative_potential_score,
      total_score,
      status,
      notes,
      created_at,
      updated_at
    )
    select
      id,
      product_idea,
      category,
      demand_score,
      wow_factor_score,
      margin_score,
      logistics_risk,
      compliance_risk,
      supplier_confidence,
      creative_potential,
      coalesce(demand_score,0) + coalesce(wow_factor_score,0) + coalesce(margin_score,0) + coalesce(logistics_risk,0) + coalesce(compliance_risk,0) + coalesce(supplier_confidence,0) + coalesce(creative_potential,0),
      replace(status, ' ', '_'),
      notes,
      created_at,
      updated_at
    from public.product_validation_candidates
    on conflict (id) do nothing;
  end if;
end $$;

create table if not exists public.store_settings (
  key text primary key,
  value text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.store_settings (key, value)
values
  ('store_name', 'Nuvoro Market'),
  ('support_email', 'support@nuvoro-market.com'),
  ('default_shipping_estimate', 'Estimated 7-14 business days'),
  ('default_processing_time', '2-4 business days'),
  ('default_guarantee_text', 'Need help? Contact support with your order ID.'),
  ('logo_url', '/nuvoro-logo.png'),
  ('favicon_url', '/nuvoro-icon.png')
on conflict (key) do nothing;

create index if not exists products_status_idx on public.products(status);
create index if not exists products_category_idx on public.products(category);
create index if not exists products_supplier_missing_idx on public.products(supplier_url);
create index if not exists orders_customer_email_idx on public.orders(customer_email);
create index if not exists orders_payment_status_idx on public.orders(payment_status);
create index if not exists orders_fulfillment_status_idx on public.orders(fulfillment_status);
create index if not exists events_event_name_idx on public.events(event_name);
create index if not exists events_product_id_idx on public.events(product_id);
create index if not exists suppliers_product_id_idx on public.suppliers(product_id);
create index if not exists product_validation_status_idx on public.product_validation(status);

alter table public.product_suppliers enable row level security;
alter table public.product_validation enable row level security;
alter table public.store_settings enable row level security;

drop policy if exists "Admins manage product suppliers" on public.product_suppliers;
create policy "Admins manage product suppliers" on public.product_suppliers
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage product validation" on public.product_validation;
create policy "Admins manage product validation" on public.product_validation
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage store settings" on public.store_settings;
create policy "Admins manage store settings" on public.store_settings
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products" on public.products
  for select using (status = 'active');

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage suppliers" on public.suppliers;
create policy "Admins manage suppliers" on public.suppliers
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins manage events" on public.events;
create policy "Admins manage events" on public.events
  for all using (public.is_admin()) with check (public.is_admin());

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists set_suppliers_updated_at on public.suppliers;
create trigger set_suppliers_updated_at before update on public.suppliers
for each row execute function public.set_updated_at();

drop trigger if exists set_product_suppliers_updated_at on public.product_suppliers;
create trigger set_product_suppliers_updated_at before update on public.product_suppliers
for each row execute function public.set_updated_at();

drop trigger if exists set_product_validation_updated_at on public.product_validation;
create trigger set_product_validation_updated_at before update on public.product_validation
for each row execute function public.set_updated_at();

drop trigger if exists set_store_settings_updated_at on public.store_settings;
create trigger set_store_settings_updated_at before update on public.store_settings
for each row execute function public.set_updated_at();
