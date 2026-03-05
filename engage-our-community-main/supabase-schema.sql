-- ============================================================
-- SCHEMA FOR: Училищно настоятелство към 163 ОУ
-- Run this entire file in Supabase → SQL Editor → New Query
-- ============================================================

-- ANNOUNCEMENTS
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date text not null,
  description text not null,
  urgent boolean default false,
  created_at timestamptz default now()
);

-- NEWS
create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  excerpt text not null,
  date text not null,
  created_at timestamptz default now()
);

-- BOARD MEMBERS
create table if not exists board_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  description text,
  email text,
  phone text,
  initials text,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- DOCUMENTS
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text default 'PDF',
  size text,
  url text default '#',
  created_at timestamptz default now()
);

-- IMPACT STATS
create table if not exists impact_stats (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label text not null,
  sort_order int default 0
);

-- GALLERY
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- DONATION INFO
create table if not exists donation_info (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  label text not null,
  value text not null
);

-- ============================================================
-- SEED DATA (matches your current hardcoded content)
-- ============================================================

insert into announcements (title, date, description, urgent) values
  ('Заседание на училищния съвет — отворено за всички родители', '5 март 2026', 'Присъединете се към пролетното заседание, на което ще обсъдим проекта за обновяване на двора и извънкласните програми.', true),
  ('Годишно общо събрание', '20 март 2026', 'Всички членове са поканени. Ще представим годишния отчет, ще изберем нови членове на управителния съвет и ще гласуваме бюджета за следващата година.', false),
  ('Регистрацията за доброволци е отворена', 'Текущо', 'Запишете се, за да помогнете за предстоящия пролетен празник. Търсим доброволци за подготовка, щандове и координация на дейности.', false);

insert into news (category, title, excerpt, date) values
  ('Инициатива', 'Стартира нова програма за допълнително обучение', 'Благодарение на родители-доброволци, безплатна помощ по учебни предмети е налична всяка сряда и петък за 3–5 клас.', '10 фев 2026'),
  ('Новина', 'Общината одобри финансиране за двора', 'След месеци на застъпничество, общинският съвет одобри 90 000 лв. за обновяване на училищния двор.', '28 яну 2026'),
  ('Събитие', 'Зимният базар събра рекордни средства', 'Тазгодишният благотворителен базар събра над 6 200 лв. за учебни материали и извънкласни дейности.', '15 яну 2026'),
  ('Мнение', 'Защо училищното хранене е важно: гледната точка на родител', 'Отворено писмо от нашата комисия по хранене за значението на здравословното и приобщаващо училищно меню.', '5 яну 2026'),
  ('Инициатива', 'Актуализация на проекта „Зелен двор"', 'Първата фаза на озеленяването е завършена. Учениците помогнаха с посаждането на местни храсти и билки.', '18 дек 2025'),
  ('Новина', 'Обявено партньорство с районната библиотека', 'Нова инициатива за четене ще осигури месечни срещи с автори и разширен достъп до книги за нашето училище.', '2 дек 2025');

insert into board_members (name, role, description, email, phone, initials, image_url, sort_order) values
  ('Мария Иванова', 'Председател', 'Отдадена на приобщаващото образование и ангажираността на общността.', 'maria.ivanova@example.com', '+359 888 111 222', 'МИ', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', 1),
  ('Петър Георгиев', 'Заместник-председател', 'Работи за по-силни връзки между семействата и преподавателите.', 'petar.georgiev@example.com', '+359 888 222 333', 'ПГ', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', 2),
  ('Елена Димитрова', 'Касиер', 'Осигурява прозрачно финансово управление и устойчиво набиране на средства.', 'elena.dimitrova@example.com', '+359 888 333 444', 'ЕД', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', 3),
  ('Георги Стоянов', 'Секретар', 'Поддържа организацията и комуникацията на настоятелството.', 'georgi.stoyanov@example.com', '+359 888 444 555', 'ГС', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', 4),
  ('Ана Колева', 'Координатор събития', 'Внася креативна енергия във всяко училищно събитие и общностна среща.', 'ana.koleva@example.com', '+359 888 555 666', 'АК', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', 5);

insert into documents (title, type, size, url) values
  ('Годишен отчет 2025', 'PDF', '2.4 MB', '#'),
  ('Устав на настоятелството', 'PDF', '340 KB', '#'),
  ('Бюджет 2025–2026', 'PDF', '1.1 MB', '#'),
  ('Протокол от заседание — януари 2026', 'PDF', '180 KB', '#');

insert into impact_stats (value, label, sort_order) values
  ('350+', 'Активни членове', 1),
  ('42', 'Завършени проекта', 2),
  ('35 000 лв.', 'Събрани тази година', 3),
  ('12', 'Години дейност', 4);

insert into gallery (url, alt, sort_order) values
  ('https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&h=400&fit=crop', 'Работилница по изкуства и занаяти', 1),
  ('https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=400&fit=crop', 'Училищен празник', 2),
  ('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop', 'Среща на родители', 3),
  ('https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=400&fit=crop', 'Благотворителен базар', 4);

insert into donation_info (key, label, value) values
  ('bank', 'Банка', 'Уникредит Булбанк'),
  ('holder', 'Титуляр', 'УН към 163 ОУ „Черноризец Храбър"'),
  ('iban', 'IBAN', 'BG80 UNCR 7000 1524 3456 78'),
  ('bic', 'BIC/SWIFT', 'UNCRBGSF'),
  ('reason', 'Основание', 'Дарение');

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table announcements enable row level security;
alter table news enable row level security;
alter table board_members enable row level security;
alter table documents enable row level security;
alter table impact_stats enable row level security;
alter table gallery enable row level security;
alter table donation_info enable row level security;

-- Public can read everything
create policy "Public read announcements" on announcements for select using (true);
create policy "Public read news" on news for select using (true);
create policy "Public read board_members" on board_members for select using (true);
create policy "Public read documents" on documents for select using (true);
create policy "Public read impact_stats" on impact_stats for select using (true);
create policy "Public read gallery" on gallery for select using (true);
create policy "Public read donation_info" on donation_info for select using (true);

-- Authenticated (admin) users can do everything
create policy "Admin all announcements" on announcements for all using (auth.role() = 'authenticated');
create policy "Admin all news" on news for all using (auth.role() = 'authenticated');
create policy "Admin all board_members" on board_members for all using (auth.role() = 'authenticated');
create policy "Admin all documents" on documents for all using (auth.role() = 'authenticated');
create policy "Admin all impact_stats" on impact_stats for all using (auth.role() = 'authenticated');
create policy "Admin all gallery" on gallery for all using (auth.role() = 'authenticated');
create policy "Admin all donation_info" on donation_info for all using (auth.role() = 'authenticated');
