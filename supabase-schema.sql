-- Run this in your Supabase project → SQL Editor

-- User profiles (auto-created when someone signs up)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null default 'Anonymous',
  preferred_translation text not null default 'ESV',
  created_at timestamptz default now()
);

-- Notes: one row per (user, passage, track)
create table notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  passage_ref text not null,   -- e.g. "john:1:1:1-5"
  track_id text not null,      -- e.g. "event"
  content text not null default '',
  is_public boolean not null default false,
  updated_at timestamptz default now()
);

-- Community comments (shared publicly)
create table comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  passage_ref text not null,
  track_id text not null,
  content text not null,
  parent_id uuid references comments(id) on delete cascade, -- null = top-level, set = reply
  created_at timestamptz default now()
);

-- Cached passage text fetched from ESV API or API.Bible
create table passages (
  id uuid primary key default gen_random_uuid(),
  book_id text not null,
  chapter int not null,
  ref text not null,           -- e.g. "John 1:1-5"
  translation text not null default 'ESV',
  text text not null,
  fetched_at timestamptz default now(),
  unique(book_id, ref, translation)
);

-- Triggers to auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, display_name, notes_public_default)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Anonymous'), false);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Row Level Security
alter table notes enable row level security;
alter table comments enable row level security;
alter table profiles enable row level security;
alter table passages enable row level security;

-- Notes policies
create policy "Users read own notes" on notes for select using (auth.uid() = user_id);
create policy "Users insert own notes" on notes for insert with check (auth.uid() = user_id);
create policy "Users update own notes" on notes for update using (auth.uid() = user_id);
create policy "Anyone reads public notes" on notes for select using (is_public = true);

-- Comments policies (public read, auth write)
create policy "Anyone reads comments" on comments for select using (true);
create policy "Auth users post comments" on comments for insert with check (auth.uid() = user_id);
create policy "Users delete own comments" on comments for delete using (auth.uid() = user_id);

-- Profiles: public read
create policy "Anyone reads profiles" on profiles for select using (true);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);

-- Passages: public read, service role writes (via API route)
create policy "Anyone reads passages" on passages for select using (true);
create policy "Service role inserts passages" on passages for insert with check (true);

-- Migration: add preferred_translation to existing profiles tables
alter table profiles add column if not exists preferred_translation text not null default 'ESV';

-- Migration: add notes_public_default to profiles (false = private by default, which is the safe consent default)
alter table profiles add column if not exists notes_public_default boolean not null default false;

-- Migration: add translation column to passages and fix unique constraint
alter table passages add column if not exists translation text not null default 'ESV';
alter table passages drop constraint if exists passages_book_id_ref_key;
alter table passages add constraint passages_book_ref_translation_key unique (book_id, ref, translation);
