
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  furniture_type text not null,
  budget text not null,
  description text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
alter table public.orders enable row level security;

create policy "orders_select_own" on public.orders for select using (auth.uid() = user_id);
create policy "orders_insert_own" on public.orders for insert with check (auth.uid() = user_id);

-- FAQs
create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.faqs enable row level security;

create policy "faqs_select_all" on public.faqs for select using (true);

-- Profile auto-create trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), coalesce(new.raw_user_meta_data->>'phone',''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Seed FAQs
insert into public.faqs (question, answer, sort_order) values
('Как проходит процесс замера и нужно ли к нему готовиться?','Специалист проведёт лазерные измерения с учётом всех розеток и неровностей стен. Вам нужно лишь обеспечить свободный доступ к месту будущей установки. После этого мы подготовим финальный расчёт в течение 48 часов.',1),
('Сколько времени занимает производство мебели?','Стандартный срок производства — 25–40 рабочих дней в зависимости от сложности проекта. После подписания договора вы получаете доступ к трекеру заказа, где видны все этапы.',2),
('Предоставляете ли вы гарантию на изделия и установку?','Да, мы даём 24 месяца гарантии на всю мебель и фурнитуру. При необходимости проведём бесплатную регулировку в гарантийный период.',3),
('Можно ли заказать образцы материалов до принятия решения?','Конечно! Мы предоставляем физические образцы шпонов, плит и лакокрасочных покрытий в трёх условиях освещения.',4),
('Как формируется цена и есть ли скрытые платежи?','Итоговая смета разбита по позициям: материалы, фурнитура, работа и монтаж. Итоговая цена отличается от первичной оценки не более чем на 5–10%.',5);
