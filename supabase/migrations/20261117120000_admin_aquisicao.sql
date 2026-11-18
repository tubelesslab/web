-- Bloco Aquisicao do /admin: gasto com anuncios, marcos e KPIs de aquisicao.
-- Nao altera admin_kpis() nem admin_refresh_kpis(). Os snapshots de aquisicao entram em
-- admin_kpi_snapshots com data.kind = 'acquisition' e o painel principal passa a ignora-los.

create table if not exists public.ad_spend (
  id          bigint generated always as identity primary key,
  start_date  date not null,
  end_date    date not null,
  campaign    text not null check (char_length(campaign) between 1 and 120),
  amount_brl  numeric(10,2) not null check (amount_brl >= 0),
  note        text check (char_length(note) <= 500),
  created_by  text,
  created_at  timestamptz not null default now(),
  check (end_date >= start_date)
);

create table if not exists public.acquisition_milestones (
  id         bigint generated always as identity primary key,
  day        date not null,
  kind       text not null check (kind in ('post','release','push','other')),
  label      text not null check (char_length(label) between 1 and 120),
  created_by text,
  created_at timestamptz not null default now()
);
create index if not exists acquisition_milestones_day_idx on public.acquisition_milestones (day);

-- RLS ligada sem policies + revoke: so o service_role acessa (como o resto do /admin).
alter table public.ad_spend enable row level security;
alter table public.acquisition_milestones enable row level security;
revoke all on public.ad_spend, public.acquisition_milestones from anon, authenticated;

-- Carga inicial (historico real)
insert into public.ad_spend (start_date, end_date, campaign, amount_brl, note, created_by)
select * from (values
  ('2026-10-28'::date, '2026-11-07'::date, 'Reels "Isso é selante em dia!" (impulsionado)', 199.91::numeric, 'carga inicial', 'migration'),
  ('2026-11-03'::date, '2026-11-10'::date, 'Reels "Esse furo vedou" (impulsionado)',        69.68::numeric,  'carga inicial', 'migration'),
  ('2026-11-13'::date, '2026-11-17'::date, 'A selante seco v2 (Gerenciador)',                32.11::numeric,  'carga inicial', 'migration'),
  ('2026-11-13'::date, '2026-11-17'::date, 'B furo MTB v2 (Gerenciador)',                    34.42::numeric,  'carga inicial', 'migration')
) v(start_date, end_date, campaign, amount_brl, note, created_by)
where not exists (select 1 from public.ad_spend);

-- Calculo puro: nao grava nada. Devolve so agregados (sem e-mail nem nome).
create or replace function public.admin_acquisition(p_from date, p_to date)
returns jsonb
language sql stable security definer
set search_path = ''
as $$
with
cur as (select (now() at time zone 'America/Sao_Paulo')::date as today),
bounds as (select greatest(p_from, p_to - 179) as f, p_to as t),   -- teto de 180 dias
nu as (                                                             -- novos usuarios no periodo
  select u.id, u.created_at as ts,
         (u.created_at at time zone 'America/Sao_Paulo')::date as d
  from auth.users u, bounds b
  where not exists (select 1 from public.admin_excluded_emails x where lower(x.email) = lower(u.email))
    and (u.created_at at time zone 'America/Sao_Paulo')::date between b.f and b.t
),
plat as (                                                           -- plataforma do 1o app_event
  select distinct on (e.user_id) e.user_id,
         case lower(e.platform) when 'ios' then 'ios' when 'android' then 'android' else 'sem_evento' end as p
  from public.app_events e join nu on nu.id = e.user_id
  order by e.user_id, e.created_at
),
fw as (select b.user_id, min(b.created_at) as ts from public.bikes b join nu on nu.id = b.user_id group by 1),
fm as (select m.user_id, min(m.created_at) as ts from public.maintenance_logs m join nu on nu.id = m.user_id group by 1),
opens as (
  select distinct e.user_id, (e.created_at at time zone 'America/Sao_Paulo')::date as d
  from public.app_events e join nu on nu.id = e.user_id where e.event = 'app_open'
),
evs as (
  select distinct e.user_id, e.event from public.app_events e join nu on nu.id = e.user_id
  where e.event in ('onboarding_tour_start', 'onboarding_tour_complete')
),
pu as (                                                             -- uma linha por novo usuario
  select nu.id, nu.d, nu.ts, coalesce(p.p, 'sem_evento') as plat,
         (now() >= nu.ts + interval '24 hours') as elig24,
         (now() >= nu.ts + interval '7 days')   as elig7,
         coalesce(fw.ts <= nu.ts + interval '24 hours', false) as wheel24,
         coalesce(fw.ts <= nu.ts + interval '7 days',  false) as wheel7,
         coalesce(fm.ts <= nu.ts + interval '7 days',  false) as maint7,
         (fw.ts is not null) as has_wheel,
         (fm.ts is not null) as has_maint,
         exists (select 1 from opens o where o.user_id = nu.id and o.d = nu.d + 1)  as r1,
         exists (select 1 from opens o where o.user_id = nu.id and o.d = nu.d + 7)  as r7,
         exists (select 1 from opens o where o.user_id = nu.id and o.d = nu.d + 30) as r30,
         exists (select 1 from evs v where v.user_id = nu.id and v.event = 'onboarding_tour_start')    as tour_open,
         exists (select 1 from evs v where v.user_id = nu.id and v.event = 'onboarding_tour_complete') as tour_done
  from nu
  left join plat p on p.user_id = nu.id
  left join fw on fw.user_id = nu.id
  left join fm on fm.user_id = nu.id
),
days as (select g::date as d from bounds b, generate_series(b.f, b.t, interval '1 day') g),
daily as (
  select days.d,
    count(pu.id)                                   as novos,
    count(*) filter (where pu.plat = 'ios')        as ios,
    count(*) filter (where pu.plat = 'android')    as android,
    count(*) filter (where pu.plat = 'sem_evento') as sem_evento,
    count(*) filter (where pu.elig24)              as elig24,
    count(*) filter (where pu.wheel24)             as wheel24,
    count(*) filter (where pu.elig7)               as elig7,
    count(*) filter (where pu.wheel7)              as wheel7,
    count(*) filter (where pu.maint7)              as maint7
  from days left join pu on pu.d = days.d
  group by days.d
),
weekly as (                                                         -- so conta quem ja completou a janela
  select date_trunc('week', d)::date as semana, count(*) as usuarios,
    count(*) filter (where d + 1  <= (select today from cur))                as elig1,
    count(*) filter (where r1  and d + 1  <= (select today from cur))        as d1,
    count(*) filter (where d + 7  <= (select today from cur))                as elig7,
    count(*) filter (where r7  and d + 7  <= (select today from cur))        as d7,
    count(*) filter (where d + 30 <= (select today from cur))                as elig30,
    count(*) filter (where r30 and d + 30 <= (select today from cur))        as d30
  from pu group by 1
),
spend_days as (                                                     -- gasto rateado por dia
  select s.campaign, g::date as d, s.amount_brl / (s.end_date - s.start_date + 1) as v
  from public.ad_spend s, bounds b,
       generate_series(greatest(s.start_date, b.f), least(s.end_date, b.t), interval '1 day') g
),
spend_by_day as (select d, sum(v) as v from spend_days group by d),
tot as (
  select count(*) as novos,
         count(*) filter (where elig24) as elig24, count(*) filter (where wheel24) as wheel24,
         count(*) filter (where elig7)  as elig7,  count(*) filter (where wheel7)  as wheel7,
         count(*) filter (where maint7) as maint7
  from pu
)
select jsonb_build_object(
  'from', (select f from bounds), 'to', (select t from bounds),
  'totals', (select to_jsonb(tot) from tot),
  'spend_total', coalesce((select round(sum(v), 2) from spend_days), 0),
  'daily', (select coalesce(jsonb_agg(jsonb_build_object(
      'day', d.d, 'novos', d.novos, 'ios', d.ios, 'android', d.android, 'sem_evento', d.sem_evento,
      'elig24', d.elig24, 'wheel24', d.wheel24, 'elig7', d.elig7, 'wheel7', d.wheel7, 'maint7', d.maint7,
      'spend', coalesce(round(sb.v, 2), 0)) order by d.d), '[]'::jsonb)
    from daily d left join spend_by_day sb on sb.d = d.d),
  'retention_weekly', (select coalesce(jsonb_agg(to_jsonb(w) order by w.semana), '[]'::jsonb) from weekly w),
  'funnel', jsonb_build_object(
      'registrou',           (select count(*) from pu),
      'abriu_tour',          (select count(*) from pu where tour_open),
      'completou_tour',      (select count(*) from pu where tour_done),
      'cadastrou_roda',      (select count(*) from pu where has_wheel),
      'primeira_manutencao', (select count(*) from pu where has_maint)),
  'spend_items', (select coalesce(jsonb_agg(jsonb_build_object(
      'id', s.id, 'start_date', s.start_date, 'end_date', s.end_date, 'campaign', s.campaign,
      'amount_brl', s.amount_brl, 'note', s.note) order by s.start_date desc), '[]'::jsonb)
      from public.ad_spend s, bounds b where s.end_date >= b.f and s.start_date <= b.t),
  'milestones', (select coalesce(jsonb_agg(jsonb_build_object(
      'id', m.id, 'day', m.day, 'kind', m.kind, 'label', m.label) order by m.day), '[]'::jsonb)
      from public.acquisition_milestones m, bounds b where m.day between b.f and b.t)
);
$$;

-- Calcula e grava o snapshot (mesmo padrao do admin_refresh_kpis). Devolve { id, data, created_at }.
create or replace function public.admin_refresh_acquisition(p_from date, p_to date)
returns jsonb
language plpgsql security definer
set search_path = ''
as $$
declare
  v_data jsonb;
  v_row  record;
begin
  if p_from is null or p_to is null or p_to < p_from then
    raise exception 'periodo invalido';
  end if;
  v_data := jsonb_build_object('kind', 'acquisition') || public.admin_acquisition(p_from, p_to);
  insert into public.admin_kpi_snapshots (data) values (v_data)
  returning id, data, created_at into v_row;
  return jsonb_build_object('id', v_row.id, 'data', v_row.data, 'created_at', v_row.created_at);
end;
$$;

revoke all on function public.admin_acquisition(date, date) from public, anon, authenticated;
revoke all on function public.admin_refresh_acquisition(date, date) from public, anon, authenticated;
grant execute on function public.admin_acquisition(date, date) to service_role;
grant execute on function public.admin_refresh_acquisition(date, date) to service_role;
