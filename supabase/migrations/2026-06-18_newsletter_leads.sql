create table if not exists public.newsletter_leads (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text not null default 'site',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.newsletter_leads enable row level security;

drop policy if exists "Admins manage newsletter leads" on public.newsletter_leads;
create policy "Admins manage newsletter leads" on public.newsletter_leads
  for all using (public.is_admin()) with check (public.is_admin());
