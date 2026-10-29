// 홈페이지 "생산 설비 및 보유 STOCK" 섹션 — 매니저가 /admin/ 에서 고친 값을 Supabase 에서 불러와 다시 그립니다.
// 불러오지 못하면 HTML 에 들어 있는 내용이 그대로 보입니다.
(() => {
  const lang = document.documentElement.lang.slice(0, 2);
  const totalTitle = {
    ko: n => `보유 STOCK 구성 · 총 ${n} Set`,
    en: n => `Stock Composition · ${n} Set Total`,
    zh: n => `库存构成 · 共 ${n} Set`,
  }[lang];
  const esc = galleryEscape;
  const pick = (row, field) => row[`${field}_${lang}`] || row[`${field}_ko`] || '';
  const els = {
    equip: document.getElementById('equipList'),
    title: document.getElementById('stockTitle'),
    summary: document.getElementById('stockSummary'),
    table: document.getElementById('stockTableBody'),
  };
  if (!GALLERY_CONFIG.url || !GALLERY_CONFIG.anonKey || !els.equip) return;

  const get = table => fetch(`${GALLERY_CONFIG.url}/rest/v1/${table}?select=*&order=sort.asc,id.asc`, {
    headers: { apikey: GALLERY_CONFIG.anonKey, Authorization: `Bearer ${GALLERY_CONFIG.anonKey}` },
  }).then(r => (r.ok ? r.json() : Promise.reject(r.status)));

  Promise.all([get('facility_equipment'), get('stock_groups'), get('stock_items')])
    .then(([equip, groups, items]) => {
      els.equip.innerHTML = equip.map(e => `<li>${esc(e.name)} <span>${e.qty} Set</span></li>`).join('');
      els.title.textContent = totalTitle(groups.reduce((sum, g) => sum + g.qty, 0));
      els.summary.innerHTML = groups.map(g =>
        `<div class="stock-chip"><strong>${g.qty}</strong><span>${esc(pick(g, 'label'))}</span></div>`
      ).join('');
      els.table.innerHTML = items.map(i =>
        `<tr><td>${esc(pick(i, 'model'))}</td><td class="col-maker">${esc(pick(i, 'maker'))}</td><td class="col-size">${esc(i.size)}</td><td class="col-qty">${i.qty}</td></tr>`
      ).join('');
    })
    .catch(err => console.warn('stock: showing built-in data', err));
})();
