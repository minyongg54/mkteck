# MKTECK 프로젝트 정복 기록

> 프로젝트: MKTECK - 스마트 제조 솔루션 기업 웹사이트
> 시작일: 2026-02-27
> 기록 갱신: 2026-03-01

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | MKTECK 기업 웹사이트 |
| 기술 스택 | Vanilla HTML5 + CSS3 + JavaScript (ES6+) |
| 폰트 | Noto Sans KR (Google Fonts) |
| 프레임워크 | 없음 (순수 프론트엔드) |
| 빌드 도구 | 없음 |
| 테마 컬러 | Primary `#0046ff`, Dark `#1a1a2e`, Darker `#0f0f1a` |

---

## 2. 디렉토리 구조 현황

```
semes-clone/
├── index.html          ✅ 완성 (320줄)
├── css/
│   └── style.css       ✅ 완성 (971줄)
├── js/
│   └── main.js         ✅ 완성 (102줄)
├── pages/              ❌ 비어있음 (서브페이지 없음)
├── images/             ❌ 비어있음 (이미지 에셋 없음)
└── PROGRESS.md         📝 이 파일
```

---

## 3. 구현 완료 항목 (상세)

### 3-1. Header / Navigation
- [x] 고정(fixed) 네비게이션 바
- [x] 로고 (아이콘 + 텍스트 "MKTECK")
- [x] 메뉴: 회사소개, 제품·솔루션, 기술역량, 뉴스룸, 문의하기
- [x] 스크롤 시 배경색 변경 (transparent → white, scrollY > 50px)
- [x] 스크롤 시 텍스트 색상 전환 (white → dark)
- [x] 언어 전환 버튼 (EN) - UI만 존재, 기능 미구현
- [x] 햄버거 메뉴 아이콘 (모바일용)
- [x] 메가 메뉴 (제품·솔루션 하위: 스마트 팩토리, 자동화 시스템, AI 품질검사, IoT 플랫폼)
- [x] nav-link hover 시 밑줄 애니메이션

### 3-2. Hero Section
- [x] 전체 화면(100vh) 히어로 배너
- [x] 그라데이션 배경 (dark → blue)
- [x] radial-gradient 오버레이 효과
- [x] 파티클 애니메이션 (30개, float 키프레임)
- [x] 메인 타이틀: "제조의 미래를 설계하다"
- [x] 로테이팅 텍스트 (3초 간격 전환)
  - 스마트 팩토리 → AI 품질검사 → IoT 플랫폼 → 자동화 시스템
- [x] 서브 텍스트: AI·IoT·자동화 기술 설명
- [x] CTA 버튼: "솔루션 알아보기" (→ #products 앵커)
- [x] SCROLL 인디케이터 (bounce 애니메이션)

### 3-3. About Section (회사소개)
- [x] 섹션 라벨: "About MKTECK"
- [x] 섹션 타이틀: "기술로 만드는 스마트 제조 혁신"
- [x] 3열 그리드 카드 레이아웃
- [x] 카드 1: 기술 혁신 (SVG 아이콘 - 태양 형태)
- [x] 카드 2: 통합 솔루션 (SVG 아이콘 - 레이어)
- [x] 카드 3: 글로벌 네트워크 (SVG 아이콘 - 지구)
- [x] 카드 hover 시 translateY(-8px) + 그림자 효과
- [x] 아이콘 그라데이션 배경 (#0046ff → #00d4ff)
- [x] scroll reveal 애니메이션

### 3-4. Products Section (제품·솔루션)
- [x] 회색 배경 (#f5f5f7)
- [x] 3열 그리드 프로덕트 카드
- [x] 카드 1: 스마트 팩토리 플랫폼 (gradient: #1a1a3e → #0046ff)
- [x] 카드 2: AI 비전 품질검사 (gradient: #0a2a4a → #00a8ff)
- [x] 카드 3: 산업용 IoT 플랫폼 (gradient: #1a0a3e → #8800ff)
- [x] 카드 높이 400px, 둥근 모서리 20px
- [x] 하단 오버레이 그라데이션 (어두운 → 투명)
- [x] hover 시 배경 scale(1.1) 확대
- [x] hover 시 오버레이 파란색으로 변경
- [x] 우상단 화살표 버튼 (hover 시 반전)
- [x] 영문 라벨 + 한글 제품명 + 설명

### 3-5. Process Section (기술역량)
- [x] 어두운 배경 (#0f0f1a)
- [x] 4단계 프로세스 타임라인 (가로 배치)
- [x] 단계 간 연결선 (::before, ::after pseudo-elements)
- [x] 번호 원형 뱃지 (그라데이션 배경)
  - 01 컨설팅
  - 02 설계·개발
  - 03 구축·통합
  - 04 운영·지원
- [x] scroll reveal 애니메이션

### 3-6. Stats Section (통계)
- [x] 4열 그리드 통계 카드
- [x] 카운터 애니메이션 (IntersectionObserver + requestAnimationFrame)
  - 25+ Years of Experience
  - 500+ Global Projects
  - 20+ Countries
  - 98% Customer Satisfaction
- [x] 2초 동안 0부터 목표값까지 카운트업
- [x] viewport 진입 시 1회만 실행

### 3-7. News Section (뉴스룸)
- [x] 회색 배경
- [x] 4열 그리드 뉴스 카드
- [x] 카드 구조: 썸네일 (그라데이션) + 본문
- [x] 카테고리 태그 (기술, 사업, 수상, ESG)
- [x] 뉴스 제목 (2줄 말줄임 -webkit-line-clamp: 2)
- [x] "자세히 보기 →" 링크
- [x] hover 시 translateY(-6px) + 그림자
- [x] 뉴스 4건:
  1. AI 기반 차세대 품질검사 시스템 출시
  2. 글로벌 반도체 기업과 전략적 파트너십 체결
  3. 2026 스마트 제조 혁신 대상 수상
  4. 탄소중립 달성을 위한 친환경 제조 로드맵 발표

### 3-8. CTA Section (문의하기)
- [x] 파란색 그라데이션 배경 (#0046ff → #0033cc)
- [x] 타이틀: "MKTECK과 함께 제조 혁신을 시작하세요"
- [x] 설명 텍스트
- [x] "문의하기" 버튼 (mailto:contact@mkteck.com)
- [x] hover 시 translateY(-2px) + 그림자

### 3-9. Footer
- [x] 어두운 배경 (#0a0a14)
- [x] 4열 그리드 (브랜드 2fr + 링크 3개 각 1fr)
- [x] 브랜드 영역: 로고, 설명, 전화번호 (1800-MKTECK), 주소
- [x] 제품·솔루션 링크 (4개)
- [x] 회사 링크 (회사소개, 연혁, 채용, IR)
- [x] 고객지원 링크 (기술지원, 다운로드, FAQ, 문의하기)
- [x] 하단 구분선 + 저작권 + 정책 링크 (개인정보처리방침, 이용약관, 사이트맵)

### 3-10. JavaScript 인터랙션
- [x] 헤더 스크롤 효과 (classList.toggle)
- [x] 모바일 메뉴 토글 (hamburger click)
- [x] 모바일 메뉴 링크 클릭 시 자동 닫기
- [x] 스크롤 Reveal 애니메이션 (opacity 0→1, translateY 40→0)
- [x] 히어로 로테이팅 텍스트 (setInterval 3000ms)
- [x] 히어로 파티클 생성 (30개 DOM 요소)
- [x] 카운터 애니메이션 (IntersectionObserver threshold 0.5)
- [x] 앵커 링크 스무스 스크롤 (scrollIntoView)

### 3-11. 반응형 디자인
- [x] 데스크톱 (1340px+ 컨테이너)
- [x] 태블릿 (max-width: 1024px)
  - 히어로 타이틀 44px
  - 그리드 2열 전환 (values, products, news, stats)
  - 푸터 2열 전환
  - 프로세스 33.33% flex
- [x] 모바일 (max-width: 768px)
  - nav 숨김 + 햄버거 표시
  - 히어로 타이틀 32px
  - 그리드 1열 전환 (values, products, news)
  - stats 2열 유지 (36px)
  - 푸터 1열 + 중앙 정렬
  - 프로세스 50% flex
  - 풀스크린 모바일 메뉴 (rgba(10,10,20,0.98))
  - 컨테이너 패딩 20px

---

## 4. 미구현 항목 (TODO)

### 4-1. 서브페이지 (pages/ 디렉토리)
- [ ] 회사소개 상세 페이지
- [ ] 연혁 페이지
- [ ] 채용 페이지
- [ ] IR 페이지
- [ ] 스마트 팩토리 제품 상세 페이지
- [ ] AI 품질검사 제품 상세 페이지
- [ ] IoT 플랫폼 제품 상세 페이지
- [ ] 자동화 시스템 제품 상세 페이지
- [ ] 뉴스 상세 페이지 (4건)
- [ ] 기술지원 페이지
- [ ] 다운로드 페이지
- [ ] FAQ 페이지
- [ ] 문의하기 폼 페이지
- [ ] 개인정보처리방침 페이지
- [ ] 이용약관 페이지
- [ ] 사이트맵 페이지

### 4-2. 기능
- [ ] 언어 전환 (KO ↔ EN) 실제 기능
- [ ] 문의하기 폼 (현재 mailto 링크만 존재)
- [ ] 뉴스 "자세히 보기" 연결
- [ ] 제품 카드 클릭 → 상세 페이지 이동
- [ ] 메가 메뉴 하위 링크 연결
- [ ] 푸터 링크 전체 연결
- [ ] 검색 기능
- [ ] 쿠키 동의 배너

### 4-3. 에셋
- [ ] 이미지 에셋 (images/ 디렉토리 비어있음)
- [ ] favicon 아이콘
- [ ] OG 메타 태그 (소셜 미리보기)
- [ ] 실제 제품/회사 이미지 대체

### 4-4. 최적화 & 배포
- [ ] SEO 메타 태그 강화
- [ ] 성능 최적화 (이미지 lazy loading 등)
- [ ] 접근성(a11y) 개선
- [ ] 크로스 브라우저 테스트
- [ ] 배포 설정 (GitHub Pages / Vercel / Netlify)

---

## 5. CSS 변수 (디자인 토큰)

```css
--primary:      #0046ff    /* 메인 블루 */
--primary-dark: #0033cc    /* 다크 블루 */
--dark:         #1a1a2e    /* 다크 네이비 */
--darker:       #0f0f1a    /* 최다크 배경 */
--white:        #ffffff    /* 화이트 */
--gray-light:   #f5f5f7    /* 라이트 그레이 배경 */
--gray:         #888       /* 텍스트 그레이 */
--gray-dark:    #333       /* 다크 텍스트 */
--transition:   0.3s ease  /* 기본 전환 속도 */
```

---

## 6. 주요 기술 포인트

| 기술 | 적용 위치 | 설명 |
|------|-----------|------|
| IntersectionObserver | 카운터 | viewport 진입 감지 후 1회 애니메이션 |
| requestAnimationFrame | 카운터 | 부드러운 숫자 카운트업 |
| CSS Grid | 전체 | 반응형 그리드 레이아웃 |
| CSS pseudo-elements | 프로세스 | 타임라인 연결선 |
| setInterval | 히어로 | 3초 간격 텍스트 로테이션 |
| classList.toggle | 헤더 | 스크롤 상태 클래스 전환 |
| scrollIntoView | 앵커 | 네이티브 스무스 스크롤 |
| linear-gradient | 다수 | 그라데이션 배경/오버레이 |
| -webkit-line-clamp | 뉴스 | 멀티라인 텍스트 말줄임 |
| radial-gradient | 히어로 | 원형 빛 효과 |

---

## 7. 파일별 코드 라인 수

| 파일 | 라인 수 | 비고 |
|------|---------|------|
| index.html | 320줄 | 전체 SPA 구조 |
| css/style.css | 971줄 | 전체 스타일링 + 반응형 |
| js/main.js | 102줄 | 인터랙션 로직 |
| **합계** | **1,393줄** | |

---

## 8. 현재 완성도

```
전체 진행률: ████████████░░░░░░░░ 60%

메인 페이지 UI:    ██████████████████ 95%
반응형 디자인:     ████████████████░░ 85%
인터랙션/애니메이션: ██████████████████ 90%
서브페이지:        ░░░░░░░░░░░░░░░░░░  0%
이미지 에셋:       ░░░░░░░░░░░░░░░░░░  0%
기능 연결:         ██░░░░░░░░░░░░░░░░ 10%
SEO/접근성:        ██░░░░░░░░░░░░░░░░ 10%
배포:              ░░░░░░░░░░░░░░░░░░  0%
```

---

## 9. 다음 단계 우선순위

1. **서브페이지 생성** - 제품 상세, 회사소개 등 핵심 페이지
2. **이미지 에셋** - 실제 이미지 또는 플레이스홀더
3. **링크 연결** - 모든 내부 링크를 실제 페이지에 연결
4. **문의하기 폼** - 실제 입력 폼 구현
5. **언어 전환** - KO/EN 다국어 지원
6. **SEO 최적화** - 메타 태그, OG, favicon
7. **배포** - GitHub Pages 또는 Vercel

---

## 10. 서버 실행 & 외부 접근 설정

### 10-1. 로컬 웹서버

| 항목 | 내용 |
|------|------|
| 서버 | Python3 `http.server` |
| 명령어 | `python3 -m http.server 8080 --bind 0.0.0.0` |
| 로컬 URL | http://localhost:8080 |
| 포트 | 8080 |
| 실행 위치 | `/Users/hugh/semes-clone/` |

### 10-2. 외부 접근 (Cloudflare Tunnel)

| 항목 | 내용 |
|------|------|
| 터널 도구 | `cloudflared` (v2026.2.0) |
| 명령어 | `cloudflared tunnel --url http://localhost:8080` |
| 공개 URL | https://humanities-meaningful-joyce-alternatives.trycloudflare.com |
| 프로토콜 | QUIC |
| 접속 서버 위치 | ICN (인천) |
| 계정 필요 여부 | 불필요 (Quick Tunnel) |

### 10-3. 재실행 방법

터미널에서 프로젝트 폴더로 이동 후 아래 명령어를 순서대로 실행:

```bash
# 1. 웹서버 실행 (백그라운드)
cd /Users/hugh/semes-clone
python3 -m http.server 8080 --bind 0.0.0.0 &

# 2. 외부 터널 실행 (새 URL이 생성됨)
cloudflared tunnel --url http://localhost:8080
```

### 10-4. 참고사항

- Cloudflare Quick Tunnel은 **임시 URL**이므로 세션 종료 시 만료됨
- 재실행 시 매번 새로운 URL이 발급됨
- ngrok도 설치되어 있으나 authtoken 미등록 상태 (사용 불가)
- 영구 URL이 필요하면 Cloudflare 계정 등록 후 Named Tunnel 설정 필요
- 같은 네트워크(Wi-Fi) 내에서는 `http://<로컬IP>:8080`으로도 접근 가능

### 10-5. 서버 종료 방법

```bash
# 웹서버 종료
kill $(lsof -ti:8080)

# cloudflared 종료
pkill cloudflared
```

---

## 11. 회사 정보 (실제)

| 항목 | 내용 |
|------|------|
| 회사명 | MKTECK Inc. |
| 대표이사 | 정명균 (JEONG MYUNG KYUN) |
| 주소 | 경기도 안성시 원곡면 원남로 250-33 |
| 우편번호 | 17554 |
| 영문 주소 | 250-33 Wonam-ro, Wongok-myeon, Anseong-si, Gyeonggi-do, Republic of Korea |
| 전화 | 070-7717-3069 |
| 팩스 | 031-336-3069 |
| 모바일 | 010-4640-6220 |
| 이메일 | mktech1@mktechinc.kr |
| 도메인 | mktechinc.kr |
| 도메인 등록 | 가비아 |

### 11-1. 웹사이트 적용 현황

- [x] Footer 전화번호 → `070-7717-3069`
- [x] Footer 주소 → `경기도 안성시 원곡면 원남로 250-33`
- [x] Footer 이메일 → `mktech1@mktechinc.kr`
- [x] Footer 대표이사 → `정명균`
- [x] Footer 하단 저작권 → 대표/전화/팩스 포함
- [x] CTA 문의하기 → `mailto:mktech1@mktechinc.kr`
- [x] 페이지 타이틀 → `MKTECK Inc. - 스마트 제조 솔루션`

---

## 12. 도메인 연결 (GitHub Pages 배포 계획)

### 12-1. GitHub 정보

| 항목 | 내용 |
|------|------|
| GitHub 사용자 | hughchung |
| 레포지토리 | mkteck (예정) |
| GitHub Pages URL | https://hughchung.github.io/mkteck |
| 커스텀 도메인 | mktechinc.kr |

### 12-2. 배포 절차

```bash
# 1단계: Git 초기화 & 커밋
cd /Users/hugh/semes-clone
git init
git add .
git commit -m "Initial commit - MKTECK Inc. website"

# 2단계: GitHub 레포 생성 후 push
git remote add origin https://github.com/hughchung/mkteck.git
git branch -M main
git push -u origin main
```

### 12-3. GitHub Pages 설정
1. GitHub 레포 → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `/ (root)` → **Save**
4. Custom domain: `mktechinc.kr` 입력 → **Save**
5. **Enforce HTTPS** 체크

### 12-4. 가비아 DNS 설정

가비아 관리 → DNS 설정 → 아래 레코드 추가:

| 타입 | 호스트 | 값 | TTL |
|------|--------|-----|-----|
| A | @ | `185.199.108.153` | 3600 |
| A | @ | `185.199.109.153` | 3600 |
| A | @ | `185.199.110.153` | 3600 |
| A | @ | `185.199.111.153` | 3600 |
| CNAME | www | `hughchung.github.io` | 3600 |

> 기존 A 레코드나 CNAME이 있다면 삭제 후 위 레코드로 교체

### 12-5. 반영 소요 시간
- DNS 전파: 최대 24~48시간 (보통 30분~1시간)
- HTTPS 인증서: DNS 전파 후 자동 발급 (최대 1시간)

---

*이 문서는 프로젝트 진행에 따라 지속적으로 갱신됩니다.*
