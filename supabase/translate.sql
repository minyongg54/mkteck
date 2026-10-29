-- 관리 페이지 AI 자동 번역 — 요청 대기열
-- 매니저가 한국어를 입력하면 요청이 여기에 쌓이고, 사무실 Mac 의 번역 브리지가
-- 가져가 Ollama 로 번역한 뒤 en / zh 를 채웁니다. setup.sql 다음에 실행하세요.
-- 맨 아래 번역 계정 이메일을 실제로 만든 계정으로 바꾸세요.

create table if not exists public.translate_jobs (
  id          uuid primary key default gen_random_uuid(),
  created_by  uuid not null default auth.uid(),
  text_ko     text not null check (char_length(text_ko) between 1 and 2000),
  status      text not null default 'pending' check (status in ('pending', 'working', 'done', 'error')),
  en          text,
  zh          text,
  created_at  timestamptz not null default now(),
  finished_at timestamptz
);

create index if not exists translate_jobs_pending_idx on public.translate_jobs (created_at) where status = 'pending';

-- 번역 브리지가 로그인하는 계정 (매니저와 별도)
create table if not exists public.translate_workers (
  email text primary key
);
alter table public.translate_workers enable row level security;

create or replace function public.is_translate_worker()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.translate_workers
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

alter table public.translate_jobs enable row level security;

drop policy if exists "translate request" on public.translate_jobs;
drop policy if exists "translate read own" on public.translate_jobs;
drop policy if exists "translate worker read" on public.translate_jobs;
drop policy if exists "translate worker update" on public.translate_jobs;

-- 매니저: 요청을 넣고 자기 요청만 읽음
create policy "translate request" on public.translate_jobs for insert to authenticated
  with check (public.is_gallery_admin() and created_by = auth.uid() and status = 'pending');
create policy "translate read own" on public.translate_jobs for select to authenticated
  using (created_by = auth.uid());
-- 번역 계정: 대기 중인 요청을 읽고 결과를 씀 (지우거나 새로 넣을 수는 없음)
create policy "translate worker read" on public.translate_jobs for select to authenticated
  using (public.is_translate_worker());
create policy "translate worker update" on public.translate_jobs for update to authenticated
  using (public.is_translate_worker()) with check (public.is_translate_worker());

-- 하루 지난 요청은 정리 (요청이 들어올 때마다 같이 지움)
create or replace function public.translate_jobs_cleanup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.translate_jobs where created_at < now() - interval '1 day';
  return new;
end;
$$;

drop trigger if exists translate_jobs_cleanup on public.translate_jobs;
create trigger translate_jobs_cleanup after insert on public.translate_jobs
  for each statement execute function public.translate_jobs_cleanup();

-- 번역 계정 등록 (Authentication → Users 에서 만든 이메일, 소문자)
insert into public.translate_workers (email) values ('translator@mktechinc.kr')
on conflict do nothing;
