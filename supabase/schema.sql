-- FitApp schema — run in Supabase SQL Editor
-- Auth users are created via supabase.auth; profiles.id matches auth.users.id

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  age int default 22,
  height_cm numeric default 185,
  weight_kg numeric default 90,
  calorie_target int default 2600,
  protein_target int default 170,
  carb_target int default 310,
  fat_target int default 75,
  created_at timestamptz default now()
);

create table if not exists public.food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  food_name text not null,
  calories numeric not null,
  protein numeric not null,
  carbs numeric not null,
  fat numeric not null,
  amount_g numeric not null default 100,
  logged_on date not null default (timezone('Europe/Istanbul', now()))::date,
  created_at timestamptz default now()
);

create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  template_id text not null,
  name text not null,
  logged_on date not null default (timezone('Europe/Istanbul', now()))::date,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.workout_sets (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid not null references public.workouts(id) on delete cascade,
  exercise_name text not null,
  set_index int not null,
  reps int,
  weight_kg numeric,
  done boolean default false
);

create table if not exists public.supplement_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  supplement_id text not null,
  logged_on date not null default (timezone('Europe/Istanbul', now()))::date,
  taken boolean default true,
  unique (user_id, supplement_id, logged_on)
);

create table if not exists public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weight_kg numeric not null,
  logged_on date not null default (timezone('Europe/Istanbul', now()))::date,
  unique (user_id, logged_on)
);

alter table public.profiles enable row level security;
alter table public.food_logs enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_sets enable row level security;
alter table public.supplement_logs enable row level security;
alter table public.weight_logs enable row level security;

create policy "own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own food" on public.food_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own workouts" on public.workouts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own sets" on public.workout_sets for all
  using (exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()))
  with check (exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()));
create policy "own supplements" on public.supplement_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own weight" on public.weight_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
