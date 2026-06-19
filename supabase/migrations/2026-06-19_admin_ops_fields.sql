alter table public.products add column if not exists seo_title text;
alter table public.products add column if not exists seo_description text;
alter table public.products add column if not exists bundle_options jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists related_product_ids jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists how_it_works jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists risk_notes text;

alter table public.suppliers add column if not exists product_cost numeric(10,2);
alter table public.suppliers add column if not exists shipping_cost numeric(10,2);
alter table public.suppliers add column if not exists compliance_notes text;
