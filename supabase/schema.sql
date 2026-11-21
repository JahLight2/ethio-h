-- ============================================================
-- ETHIO H · Supabase schema for booking requests
-- Run in Supabase → SQL Editor. Safe to run twice.
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.booking_requests (
  id              uuid primary key default gen_random_uuid(),
  reference       text unique not null,
  name            text not null,
  phone           text not null,
  email           text not null,
  neighbourhood   text,
  residence       text,
  service         text,
  preferred_date  date,
  preferred_time  text,
  notes           text,
  source          text default 'website',
  status          text not null default 'new'
                  check (status in ('new','survey_booked','scope_sent','won','lost')),
  calendar_event_id text,
  submitted_at    timestamptz not null default now(),
  created_at      timestamptz not null default now()
);

create index if not exists booking_requests_status_idx
  on public.booking_requests (status, submitted_at desc);

create index if not exists booking_requests_area_idx
  on public.booking_requests (neighbourhood);

-- Row Level Security: the website writes through the service-role key
-- on the server only. Nothing is readable by anon clients.
alter table public.booking_requests enable row level security;

drop policy if exists "service role full access" on public.booking_requests;
create policy "service role full access"
  on public.booking_requests
  for all
  to service_role
  using (true)
  with check (true);

-- Optional: a tidy view for the office
create or replace view public.booking_requests_week as
select
  reference, name, phone, neighbourhood, service,
  preferred_date, preferred_time, status, submitted_at
from public.booking_requests
where submitted_at > now() - interval '7 days'
order by submitted_at desc;
