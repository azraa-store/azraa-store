-- AZRAA auth schema: profiles + addresses, backing src/services/auth/supabase.js.
--
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste
-- this whole file -> Run. Safe to re-run (uses IF NOT EXISTS / OR REPLACE
-- throughout).

create extension if not exists pgcrypto;

-- One row per authenticated user, extending auth.users with app-specific
-- fields. id is the same uuid as auth.users.id.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  phone text,
  company text,
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create a profiles row whenever someone signs up, seeded with the
-- name and phone passed to
-- supabase.auth.signUp({ options: { data: { name, phone } } }).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name, phone)
  values (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'phone');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Saved addresses, many per user. Field names match the existing
-- AccountPage.jsx address form exactly (name/line1/line2/city/state/
-- postcode/phone) so no UI changes were needed.
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text,
  line1 text not null,
  line2 text,
  city text not null,
  state text,
  postcode text,
  phone text,
  created_at timestamptz not null default now()
);

alter table public.addresses enable row level security;

drop policy if exists "Users can manage own addresses" on public.addresses;
create policy "Users can manage own addresses"
  on public.addresses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Orders, backing src/services/orders/supabase.js. Previously orders only
-- ever lived in localStorage (services/orders.js had no backend at all,
-- even with Supabase auth configured) — this is what makes order history
-- real and cross-device. Column shapes mirror the JSON the app already
-- builds in CheckoutPage.jsx, so the frontend needed no reshaping, just a
-- real place to put it.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  number text not null default ('AZ' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  order_type text not null default 'retail' check (order_type in ('retail', 'wholesale')),
  currency text not null,
  customer jsonb not null,
  shipping_address jsonb not null,
  shipping_method jsonb,
  items jsonb not null,
  amounts jsonb not null,
  promo jsonb,
  display jsonb not null,
  inventory_applied boolean not null default true,
  created_at timestamptz not null default now(),
  cancelled_at timestamptz
);

alter table public.orders enable row level security;

drop policy if exists "Users can view own orders" on public.orders;
create policy "Users can view own orders"
  on public.orders for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own orders" on public.orders;
create policy "Users can create own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- Cancellation only: a real backend would also re-validate here before
-- restoring inventory, same caveat already on the client-side mock.
drop policy if exists "Users can cancel own orders" on public.orders;
create policy "Users can cancel own orders"
  on public.orders for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
