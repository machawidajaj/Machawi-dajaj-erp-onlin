-- Machawi Dajaj ERP - Cloud State
-- Run this entire script once in Supabase SQL Editor.

create table if not exists public.machawi_app_state (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.machawi_app_state enable row level security;

drop policy if exists "machawi_state_select" on public.machawi_app_state;
drop policy if exists "machawi_state_insert" on public.machawi_app_state;
drop policy if exists "machawi_state_update" on public.machawi_app_state;

create policy "machawi_state_select"
on public.machawi_app_state
for select
to anon, authenticated
using (id = 'main');

create policy "machawi_state_insert"
on public.machawi_app_state
for insert
to anon, authenticated
with check (id = 'main');

create policy "machawi_state_update"
on public.machawi_app_state
for update
to anon, authenticated
using (id = 'main')
with check (id = 'main');

grant select, insert, update on public.machawi_app_state to anon, authenticated;

-- Optional verification:
select id, updated_at, jsonb_typeof(data) as data_type
from public.machawi_app_state;
