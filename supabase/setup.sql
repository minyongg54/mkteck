-- MKTECH 장비 갤러리 — Supabase 초기 설정
-- Supabase 대시보드 → SQL Editor 에 전체를 붙여넣고 Run.
-- 마지막 줄의 매니저 이메일만 실제 주소로 바꾸세요.

-- 1) 게시물 테이블 ---------------------------------------------------------
create table if not exists public.gallery_posts (
  id          bigint generated always as identity primary key,
  category    text not null check (category in ('spin', 'dev', 'scrub', 'used')),
  title_ko    text not null,
  title_en    text,
  title_zh    text,
  desc_ko     text,
  desc_en     text,
  desc_zh     text,
  taken_on    date not null default current_date,
  photos      text[] not null default '{}',   -- storage 파일 이름 (p/<name>, t/<name>)
  created_at  timestamptz not null default now()
);

create index if not exists gallery_posts_taken_on_idx on public.gallery_posts (taken_on desc);

-- 2) 매니저 허용 목록 ------------------------------------------------------
-- 로그인 계정이 있어도 여기에 이메일이 없으면 글을 쓸 수 없습니다.
create table if not exists public.gallery_admins (
  email text primary key
);

alter table public.gallery_admins enable row level security;
-- (정책 없음 = 외부에서 읽기/쓰기 불가. 아래 함수만 조회합니다.)

create or replace function public.is_gallery_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.gallery_admins
    where email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- 3) 게시물 접근 권한 (RLS) ------------------------------------------------
alter table public.gallery_posts enable row level security;

drop policy if exists "gallery read"   on public.gallery_posts;
drop policy if exists "gallery insert" on public.gallery_posts;
drop policy if exists "gallery update" on public.gallery_posts;
drop policy if exists "gallery delete" on public.gallery_posts;

create policy "gallery read"   on public.gallery_posts for select using (true);
create policy "gallery insert" on public.gallery_posts for insert to authenticated with check (public.is_gallery_admin());
create policy "gallery update" on public.gallery_posts for update to authenticated using (public.is_gallery_admin()) with check (public.is_gallery_admin());
create policy "gallery delete" on public.gallery_posts for delete to authenticated using (public.is_gallery_admin());

-- 4) 사진 저장소 -----------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gallery', 'gallery', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true;

drop policy if exists "gallery upload" on storage.objects;
drop policy if exists "gallery remove" on storage.objects;

create policy "gallery upload" on storage.objects for insert to authenticated
  with check (bucket_id = 'gallery' and public.is_gallery_admin());
create policy "gallery remove" on storage.objects for delete to authenticated
  using (bucket_id = 'gallery' and public.is_gallery_admin());

-- 5) 매니저 등록 (실제 이메일로 변경, 소문자) ------------------------------
insert into public.gallery_admins (email) values ('mktech1@mktechinc.kr')
on conflict do nothing;
