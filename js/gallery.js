// 공개 장비 갤러리 — pages/gallery.html, ko/pages/gallery.html, zh/pages/gallery.html 공용.
// 언어는 <html lang> 으로 판단하고, 번역 제목이 비어 있으면 한국어로 표시합니다.
(() => {
  const lang = document.documentElement.lang.slice(0, 2);
  const T = {
    ko: { all: '전체', photos: n => `사진 ${n}장`, empty: '등록된 사진이 아직 없습니다.', notReady: '갤러리를 준비하고 있습니다.', error: '사진을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.', more: '제품 상세 보기 →', usedMore: '중고장비 문의하기 →', close: '닫기', prev: '이전 사진', next: '다음 사진' },
    en: { all: 'All', photos: n => `${n} photo${n > 1 ? 's' : ''}`, empty: 'No photos yet.', notReady: 'The gallery is being prepared.', error: 'Could not load photos. Please try again later.', more: 'View product →', usedMore: 'Ask about used equipment →', close: 'Close', prev: 'Previous photo', next: 'Next photo' },
    zh: { all: '全部', photos: n => `${n} 张照片`, empty: '暂无照片。', notReady: '图库正在准备中。', error: '照片加载失败，请稍后再试。', more: '查看产品详情 →', usedMore: '咨询二手设备 →', close: '关闭', prev: '上一张', next: '下一张' },
  }[lang] || {};

  const $ = id => document.getElementById(id);
  const esc = galleryEscape;
  const catOf = id => GALLERY_CATEGORIES.find(c => c.id === id);
  const catLabel = id => catOf(id)?.label[lang] || id;
  const pick = (p, field) => p[`${field}_${lang}`] || p[`${field}_ko`] || '';
  const fmtDate = d => d.replaceAll('-', '.');
  const NEW_DAYS = 30;

  let posts = [], filter = 'all', cur = null, idx = 0, lastFocus = null;

  function renderFilters() {
    const items = [{ id: 'all', text: T.all, n: posts.length },
      ...GALLERY_CATEGORIES.map(c => ({ id: c.id, text: c.label[lang], n: posts.filter(p => p.category === c.id).length }))];
    $('galleryFilters').innerHTML = items.map(i =>
      `<button type="button" class="gallery-chip" data-filter="${i.id}" aria-pressed="${filter === i.id}">${esc(i.text)}<span class="gallery-chip-n">${i.n}</span></button>`
    ).join('');
  }

  function renderGrid(message) {
    const grid = $('galleryGrid');
    if (message) { grid.innerHTML = `<p class="gallery-empty">${esc(message)}</p>`; return; }
    const list = posts.filter(p => filter === 'all' || p.category === filter);
    if (!list.length) { grid.innerHTML = `<p class="gallery-empty">${esc(T.empty)}</p>`; return; }
    const newSince = Date.now() - NEW_DAYS * 864e5;
    grid.innerHTML = list.map(p => `
      <button type="button" class="gallery-card" data-id="${p.id}">
        <span class="gallery-thumb">
          <img src="${galleryPhotoUrl(p.photos[0], 't')}" alt="" loading="lazy">
          ${new Date(p.created_at).getTime() > newSince ? '<span class="gallery-new">NEW</span>' : ''}
          ${p.photos.length > 1 ? `<span class="gallery-count">${p.photos.length}</span>` : ''}
        </span>
        <span class="gallery-card-body">
          <span class="gallery-cat">${esc(catLabel(p.category))}</span>
          <span class="gallery-title">${esc(pick(p, 'title'))}</span>
          <span class="gallery-meta"><span>${fmtDate(p.taken_on)}</span><span>${esc(T.photos(p.photos.length))}</span></span>
        </span>
      </button>`).join('');
  }

  function openLightbox(id) {
    cur = posts.find(p => p.id === id);
    if (!cur) return;
    idx = 0;
    lastFocus = document.activeElement;
    $('lbCat').textContent = `${catLabel(cur.category)} · ${fmtDate(cur.taken_on)}`;
    $('lbTitle').textContent = pick(cur, 'title');
    $('lbDesc').textContent = pick(cur, 'desc');
    const link = $('lbLink');
    link.href = catOf(cur.category)?.page || '#';
    link.textContent = cur.category === 'used' ? T.usedMore : T.more;
    showPhoto();
    $('lightbox').hidden = false;
    document.body.style.overflow = 'hidden';
    $('lbClose').focus();
  }

  function showPhoto() {
    const n = cur.photos.length;
    $('lbImg').src = galleryPhotoUrl(cur.photos[idx], 'p');
    $('lbImg').alt = `${pick(cur, 'title')} ${idx + 1}/${n}`;
    $('lbIdx').textContent = `${idx + 1} / ${n}`;
    $('lbPrev').hidden = $('lbNext').hidden = $('lbStrip').hidden = n < 2;
    $('lbStrip').innerHTML = cur.photos.map((name, i) =>
      `<button type="button" data-i="${i}" aria-current="${i === idx}"><img src="${galleryPhotoUrl(name, 't')}" alt=""></button>`
    ).join('');
  }

  function step(d) {
    if (!cur) return;
    idx = (idx + d + cur.photos.length) % cur.photos.length;
    showPhoto();
  }

  function closeLightbox() {
    $('lightbox').hidden = true;
    cur = null;
    document.body.style.overflow = '';
    lastFocus?.focus();
  }

  function bind() {
    $('lbClose').setAttribute('aria-label', T.close);
    $('lbPrev').setAttribute('aria-label', T.prev);
    $('lbNext').setAttribute('aria-label', T.next);

    $('galleryFilters').addEventListener('click', e => {
      const b = e.target.closest('[data-filter]');
      if (!b) return;
      filter = b.dataset.filter;
      renderFilters();
      renderGrid();
    });
    $('galleryGrid').addEventListener('click', e => {
      const card = e.target.closest('.gallery-card');
      if (card) openLightbox(Number(card.dataset.id));
    });
    $('lbPrev').addEventListener('click', () => step(-1));
    $('lbNext').addEventListener('click', () => step(1));
    $('lbClose').addEventListener('click', closeLightbox);
    $('lbStrip').addEventListener('click', e => {
      const b = e.target.closest('[data-i]');
      if (b) { idx = Number(b.dataset.i); showPhoto(); }
    });
    $('lightbox').addEventListener('click', e => { if (e.target === $('lightbox')) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if ($('lightbox').hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
    let touchX = 0;
    $('lightbox').addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
    $('lightbox').addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    });
  }

  async function load() {
    bind();
    renderFilters();
    const db = galleryClient();
    if (!db) { renderGrid(T.notReady); return; }
    const { data, error } = await db.from('gallery_posts').select('*')
      .order('taken_on', { ascending: false }).order('id', { ascending: false });
    if (error) { console.error(error); renderGrid(T.error); return; }
    posts = data.filter(p => p.photos?.length);
    renderFilters();
    renderGrid();
  }

  load();
})();
