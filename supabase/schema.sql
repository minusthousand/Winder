create table if not exists profiles (
  id        bigint primary key generated always as identity,
  name      text    not null,
  age       integer,
  likes_you boolean default false,
  job       text,
  location  text,
  distance  integer,
  bio       text,
  interests text[]  default '{}',
  images    text[]  default '{}',
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "public read"   on profiles for select using (true);
create policy "public insert" on profiles for insert with check (true);
create policy "public update" on profiles for update using (true);
create policy "public delete" on profiles for delete using (true);
