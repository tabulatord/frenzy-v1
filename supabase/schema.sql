-- FRENZY V1 — pre_registrations schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists "pgcrypto";

create table if not exists public.pre_registrations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Personal
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  date_of_birth date not null,
  gender text not null,

  -- Location (kept as separate fields, never a single free-text string)
  country_code text not null,
  country_name text not null,
  region text,
  city text not null,
  postal_code text,

  -- Pickleball
  rating text not null,
  disciplines text[] not null default '{}',
  usual_pickleball_location text,
  location_not_listed boolean not null default false,

  -- Consent
  consent_terms boolean not null,
  consent_marketing boolean not null default false,

  -- Attribution
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,

  constraint pre_registrations_email_unique unique (email),
  constraint pre_registrations_consent_terms_check check (consent_terms is true),
  constraint pre_registrations_rating_check check (
    rating in ('No Rating', '3.0', '3.5', '4.0', '4.5', '5.0+', 'Pro')
  )
);

create index if not exists pre_registrations_created_at_idx
  on public.pre_registrations (created_at desc);

create index if not exists pre_registrations_country_code_idx
  on public.pre_registrations (country_code);

-- Row Level Security
alter table public.pre_registrations enable row level security;

-- No public select/update/delete policies are defined, so anon and
-- authenticated roles have zero read/write access by default. All writes
-- go through the server-side API route using the service role key, which
-- bypasses RLS. This keeps the anon key safe to ship to the browser even
-- though the app currently only calls the API route directly.

-- CSV export: use the Supabase Studio Table Editor > pre_registrations >
-- Export as CSV, or `supabase db dump` / SQL: `copy (select * from
-- public.pre_registrations) to stdout with csv header`.
