# 장비 갤러리 — Supabase 연결 방법

갤러리 페이지(`/ko/pages/gallery.html` 등)는 사진과 글을 Supabase에서 불러옵니다.
아래 순서대로 한 번만 설정하면 됩니다. 약 10분 걸립니다.

## 1. 프로젝트 만들기
1. https://supabase.com 에 가입하고 **New project** 를 누릅니다.
2. 이름: `mktech-gallery`, Region: **Northeast Asia (Seoul)**
3. Database password 는 아무 값이나 넣고 따로 보관합니다 (갤러리에서는 쓰지 않습니다).

## 2. 테이블·저장소 만들기
1. 왼쪽 메뉴 **SQL Editor** → **New query**
2. `supabase/setup.sql` 의 내용을 전부 붙여넣습니다.
3. 맨 아래 줄의 이메일을 **매니저의 실제 이메일**로 바꿉니다. 여러 명이면 줄을 추가합니다.
   ```sql
   insert into public.gallery_admins (email) values ('manager@example.com') on conflict do nothing;
   ```
4. **Run** 을 누릅니다.

## 3. 매니저 계정 만들기
1. **Authentication → Users → Add user → Create new user**
2. 2번에서 등록한 이메일과 비밀번호를 입력하고, **Auto Confirm User** 를 체크합니다.
3. **Authentication → Sign In / Providers** 에서 **Allow new users to sign up** 을 끕니다.
   (꺼두지 않아도 허용 목록에 없는 계정은 글을 쓸 수 없지만, 꺼두는 편이 안전합니다.)

## 4. 사이트에 연결하기
1. **Project URL**: **Project Settings → Data API** 맨 위 (또는 `https://<프로젝트ID>.supabase.co`, 프로젝트 ID는 대시보드 주소의 `project/` 다음 문자열)
2. **키**: **Project Settings → API Keys** 의 **Publishable key** (`sb_publishable_...`)
3. `js/gallery-config.js` 의 `url`, `anonKey` 에 붙여넣고 배포합니다.
   - Publishable key 는 공개용입니다. 페이지에 노출되어도 괜찮습니다.
   - **Secret key (`sb_secret_...`) 는 절대 넣지 마세요.**

## 5. 확인
- 매니저 페이지: `https://mktechinc.kr/admin/` → 로그인 → 사진을 올려 게시
- 갤러리: `https://mktechinc.kr/ko/pages/gallery.html` 에 바로 나타납니다.

## 알아둘 점
- **무료 플랜 일시정지**: 7일 동안 요청이 하나도 없으면 프로젝트가 일시정지됩니다.
  갤러리가 "사진을 불러오지 못했습니다" 로 나오면 Supabase 대시보드에서 **Restore** 를 누르세요.
- **용량**: 무료 저장소는 1GB 입니다. 사진은 올릴 때 약 300KB(원본) + 60KB(썸네일)로 줄어들어 약 2,500장까지 올릴 수 있습니다.
- 사진 파일은 `gallery` 버킷의 `p/`(원본)와 `t/`(썸네일)에 같은 이름으로 저장됩니다.
