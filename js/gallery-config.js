// Supabase 연결 정보 — 대시보드 → Project Settings → Data API(URL) / API Keys(Publishable key).
// Publishable key 는 공개용 키라 페이지에 넣어도 됩니다 (쓰기 권한은 setup.sql 의 RLS 가 막습니다).
// Secret key (sb_secret_...) 는 절대 넣지 마세요.
const GALLERY_CONFIG = {
  url: 'https://fglsgsyktocalmmrayst.supabase.co',
  anonKey: 'sb_publishable_VhCrsUfMVBMmbN1qftoeog_mP61ZsI2',
  bucket: 'gallery',
};

const GALLERY_CATEGORIES = [
  { id: 'spin',  page: 'spin-coater.html',     label: { ko: '스핀 코터',       en: 'Spin Coater',     zh: '旋涂机' } },
  { id: 'dev',   page: 'wafer-developer.html', label: { ko: '웨이퍼 디벨로퍼', en: 'Wafer Developer', zh: '晶圆显影机' } },
  { id: 'scrub', page: 'scrubber-system.html', label: { ko: '스크러버 시스템', en: 'Scrubber System', zh: '清洗系统' } },
  { id: 'used',  page: 'used-equipment.html',  label: { ko: 'DNS 중고장비',    en: 'Used Equipment',  zh: '二手设备' } },
];

// 페이지당 하나만 만든다 (관리 페이지의 여러 스크립트가 같은 로그인 세션을 씀)
let galleryClientInstance = null;
function galleryClient() {
  if (!GALLERY_CONFIG.url || !GALLERY_CONFIG.anonKey || !window.supabase) return null;
  galleryClientInstance ||= window.supabase.createClient(GALLERY_CONFIG.url, GALLERY_CONFIG.anonKey);
  return galleryClientInstance;
}

// size: 'p' = 원본(긴 변 1600px), 't' = 썸네일(긴 변 640px)
function galleryPhotoUrl(name, size) {
  return `${GALLERY_CONFIG.url}/storage/v1/object/public/${GALLERY_CONFIG.bucket}/${size}/${name}`;
}

function galleryEscape(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
