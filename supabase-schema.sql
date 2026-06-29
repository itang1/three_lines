-- Three Lines — Supabase schema
-- Safe to run top to bottom multiple times on any database state.

-- Tables

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null default 'Anonymous',
  preferred_translation text not null default 'ESV',
  notes_public_default boolean not null default true,
  created_at timestamptz default now()
);

-- One note row per (user, passage, track). App upserts on this composite key.
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  passage_ref text not null,
  track_id text not null,
  content text not null default '',
  is_public boolean not null default false,
  updated_at timestamptz default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  passage_ref text not null,
  track_id text not null,
  content text not null,
  parent_id uuid references comments(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists passages (
  id uuid primary key default gen_random_uuid(),
  book_id text not null,
  chapter int not null,
  ref text not null,
  translation text not null default 'ESV',
  text text not null,
  fetched_at timestamptz default now()
);

-- Columns (add if missing on existing databases)

alter table profiles add column if not exists preferred_translation text not null default 'ESV';
alter table profiles add column if not exists notes_public_default boolean not null default true;
alter table profiles add column if not exists theme_track_label text;
alter table passages add column if not exists translation text not null default 'ESV';

-- Constraints

-- notes: composite unique key used for upserts in the app
alter table notes drop constraint if exists notes_user_id_passage_ref_track_id_key;
alter table notes add constraint notes_user_id_passage_ref_track_id_key
  unique (user_id, passage_ref, track_id);

-- passages: unique per (book, ref, translation)
alter table passages drop constraint if exists passages_book_id_ref_key;
alter table passages drop constraint if exists passages_book_ref_translation_key;
alter table passages add constraint passages_book_ref_translation_key
  unique (book_id, ref, translation);

-- Trigger: auto-create profile on signup

create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, display_name, notes_public_default)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Anonymous'), true)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Row Level Security

alter table notes enable row level security;
alter table comments enable row level security;
alter table profiles enable row level security;
alter table passages enable row level security;

-- Notes policies
drop policy if exists "Users read own notes" on notes;
drop policy if exists "Users insert own notes" on notes;
drop policy if exists "Users update own notes" on notes;
drop policy if exists "Anyone reads public notes" on notes;

create policy "Users read own notes" on notes for select using (auth.uid() = user_id);
create policy "Users insert own notes" on notes for insert with check (auth.uid() = user_id);
create policy "Users update own notes" on notes for update using (auth.uid() = user_id);
create policy "Anyone reads public notes" on notes for select using (is_public = true);

-- Comments policies
drop policy if exists "Anyone reads comments" on comments;
drop policy if exists "Auth users post comments" on comments;
drop policy if exists "Users delete own comments" on comments;

create policy "Anyone reads comments" on comments for select using (true);
create policy "Auth users post comments" on comments for insert with check (auth.uid() = user_id);
create policy "Users delete own comments" on comments for delete using (auth.uid() = user_id);

-- Profiles policies
drop policy if exists "Anyone reads profiles" on profiles;
drop policy if exists "Users update own profile" on profiles;

create policy "Anyone reads profiles" on profiles for select using (true);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);

-- Passages policies
drop policy if exists "Anyone reads passages" on passages;
drop policy if exists "Service role inserts passages" on passages;

create policy "Anyone reads passages" on passages for select using (true);
create policy "Service role inserts passages" on passages for insert with check (true);
