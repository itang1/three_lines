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

-- Moderation: one report per (note, reporter). Admins review pending rows.
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  note_id uuid references notes(id) on delete cascade not null,
  reporter_id uuid references profiles(id) on delete set null,
  reason text not null default '',
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- Shared fixed-window rate-limit counters. Survives serverless cold starts,
-- unlike an in-memory Map. Keyed like "contact:<ip>" or "passage:<ip>".
create table if not exists rate_limits (
  id text primary key,
  count int not null default 0,
  window_start timestamptz not null default now()
);

-- Columns (add if missing on existing databases)

alter table profiles add column if not exists preferred_translation text not null default 'ESV';
alter table profiles add column if not exists notes_public_default boolean not null default true;
alter table profiles add column if not exists theme_track_label text;
alter table profiles add column if not exists is_admin boolean not null default false;
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

-- reports: one open report per (note, reporter); upsert refreshes an existing one
alter table reports drop constraint if exists reports_note_id_reporter_id_key;
alter table reports add constraint reports_note_id_reporter_id_key
  unique (note_id, reporter_id);

-- Length caps: bound user-supplied content so a single row cannot store and
-- broadcast an unbounded payload. NOT VALID skips existing rows so this is safe
-- to run on a populated database; new and updated rows are checked.
alter table notes drop constraint if exists notes_content_length;
alter table notes add constraint notes_content_length
  check (char_length(content) <= 5000) not valid;

alter table comments drop constraint if exists comments_content_length;
alter table comments add constraint comments_content_length
  check (char_length(content) <= 5000) not valid;

-- Indexes

create index if not exists reports_status_created_at_idx on reports (status, created_at desc);
create index if not exists reports_note_id_idx on reports (note_id);

-- notes: loading a user's book via eq(user_id) + like(passage_ref, 'book:%').
-- text_pattern_ops lets the prefix LIKE use the index regardless of collation.
create index if not exists notes_user_passage_idx
  on notes (user_id, passage_ref text_pattern_ops);

-- notes: community feeds (where is_public, content <> '' order by updated_at desc).
create index if not exists notes_public_updated_idx
  on notes (is_public, updated_at desc);

-- notes: note search via ilike(content, '%q%'). A btree can't serve a leading
-- wildcard; a trigram GIN index can.
create extension if not exists pg_trgm;
create index if not exists notes_content_trgm_idx
  on notes using gin (content gin_trgm_ops);

-- comments: reply loads via eq(parent_id).
create index if not exists comments_parent_id_idx on comments (parent_id);

-- Functions

-- Atomic fixed-window rate limiter. Returns true if the call is allowed.
-- Row-locks the counter so concurrent serverless instances stay consistent.
create or replace function check_rate_limit(p_key text, p_max int, p_window_seconds int)
returns boolean as $$
declare
  v_count int;
  v_start timestamptz;
begin
  select count, window_start into v_count, v_start
  from rate_limits where id = p_key for update;

  if not found then
    insert into rate_limits (id, count, window_start) values (p_key, 1, now());
    return true;
  end if;

  if now() - v_start > make_interval(secs => p_window_seconds) then
    update rate_limits set count = 1, window_start = now() where id = p_key;
    return true;
  end if;

  if v_count >= p_max then
    return false;
  end if;

  update rate_limits set count = count + 1 where id = p_key;
  return true;
end;
$$ language plpgsql security definer;

-- Most-discussed passages, aggregated server-side so user_id never leaves the DB.
create or replace function top_passages(p_limit int default 30)
returns table (passage_ref text, notes bigint, lines bigint) as $$
  select passage_ref,
         count(distinct user_id) as notes,
         count(*) as lines
  from notes
  where is_public = true and content <> ''
  group by passage_ref
  order by notes desc, lines desc
  limit p_limit;
$$ language sql stable security definer;

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
alter table reports enable row level security;
-- No policies: only the service role and the security-definer RPC touch this table.
alter table rate_limits enable row level security;

-- Notes policies
drop policy if exists "Users read own notes" on notes;
drop policy if exists "Users insert own notes" on notes;
drop policy if exists "Users update own notes" on notes;
drop policy if exists "Users delete own notes" on notes;
drop policy if exists "Anyone reads public notes" on notes;

create policy "Users read own notes" on notes for select using (auth.uid() = user_id);
create policy "Users insert own notes" on notes for insert with check (auth.uid() = user_id);
create policy "Users update own notes" on notes for update using (auth.uid() = user_id);
create policy "Users delete own notes" on notes for delete using (auth.uid() = user_id);
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
-- No insert policy: the server fetch path uses the service role, which bypasses
-- RLS. A public insert policy would let any anon-key holder poison the cache.

-- Reports policies
-- Reads and moderation actions go through the service role in the API, which
-- bypasses RLS. Authenticated users may only file their own reports.
drop policy if exists "Users file own reports" on reports;

create policy "Users file own reports" on reports for insert with check (auth.uid() = reporter_id);
