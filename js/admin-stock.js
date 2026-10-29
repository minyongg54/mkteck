// 관리 페이지 "생산 설비 · STOCK" 탭 — 홈페이지 #facility 섹션의 세 표를 편집합니다.
(() => {
  const db = galleryClient();
  if (!db) return;
  const esc = galleryEscape;
  const $ = id => document.getElementById(id);

  // tr: 영어·중국어 칸 (비우면 홈페이지에 한국어가 나옴)
  const EDITORS = {
    facility_equipment: [
      { key: 'name', label: '설비 이름', required: true },
      { key: 'qty', label: '수량 (Set)', type: 'number' },
    ],
    stock_groups: [
      { key: 'label_ko', label: '분류', required: true, tr: { en: 'label_en', zh: 'label_zh' } },
      { key: 'qty', label: '수량', type: 'number' },
    ],
    stock_items: [
      { key: 'model_ko', label: '모델', required: true, tr: { en: 'model_en', zh: 'model_zh' } },
      { key: 'maker_ko', label: '메이커', tr: { en: 'maker_en', zh: 'maker_zh' } },
      { key: 'size', label: '사이즈' },
      { key: 'qty', label: '수량', type: 'number' },
    ],
  };

  const editors = {};
  let loaded = false;

  function cellInputs(field, row) {
    const v = k => esc(row?.[k] ?? '');
    const input = (k, cls, ph = '') => field.type === 'number'
      ? `<td><input class="num" type="number" min="0" step="1" data-k="${k}" value="${row ? row[k] : 0}"></td>`
      : `<td class="${cls}"><input type="text" data-k="${k}" value="${v(k)}" placeholder="${ph}"></td>`;
    let html = input(field.key, '');
    if (field.tr) html += input(field.tr.en, 'tr', 'English') + input(field.tr.zh, 'tr', '中文');
    return html;
  }

  function rowHtml(fields, row) {
    return `<tr${row ? ` data-id="${row.id}"` : ''}>${fields.map(f => cellInputs(f, row)).join('')}
      <td class="rowtools"><button type="button" data-act="up" title="위로">↑</button> <button type="button" data-act="down" title="아래로">↓</button> <button type="button" class="del" data-act="del" title="줄 삭제">✕</button></td></tr>`;
  }

  function wireRow(table, fields, tr) {
    for (const f of fields.filter(f => f.tr)) {
      const q = k => tr.querySelector(`[data-k="${k}"]`);
      AiTranslate.wire(q(f.key), { en: q(f.tr.en), zh: q(f.tr.zh) }, {
        onFill: () => {
          // 채워진 번역이 보이도록 번역 칸을 펼친다
          $('showTr').checked = true;
          $('stockPanel').classList.add('show-tr');
          markDirty(table);
        },
      });
    }
  }

  function build(section) {
    const table = section.dataset.editor;
    const fields = EDITORS[table];
    const head = fields.map(f => `<th>${f.label}</th>` + (f.tr ? `<th class="tr">${f.label} (EN)</th><th class="tr">${f.label} (中文)</th>` : '')).join('');
    section.insertAdjacentHTML('beforeend', `
      <div class="etable-wrap"><table class="etable"><thead><tr>${head}<th></th></tr></thead><tbody></tbody></table></div>
      <p class="msg err" hidden></p>
      <div class="editor-actions">
        <button type="button" class="btn ghost small" data-act="add">+ 줄 추가</button>
        <span class="dirty-note" hidden>저장하지 않은 변경이 있습니다</span>
        <button type="button" class="btn" data-act="save">저장</button>
      </div>`);
    const ed = editors[table] = { section, fields, tbody: section.querySelector('tbody'), removed: [], dirty: false };

    section.addEventListener('click', e => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      const tr = b.closest('tr');
      if (b.dataset.act === 'add') {
        ed.tbody.insertAdjacentHTML('beforeend', rowHtml(fields, null));
        wireRow(table, fields, ed.tbody.lastElementChild);
        ed.tbody.lastElementChild.querySelector('input').focus();
      } else if (b.dataset.act === 'up' && tr.previousElementSibling) {
        tr.previousElementSibling.before(tr);
      } else if (b.dataset.act === 'down' && tr.nextElementSibling) {
        tr.nextElementSibling.after(tr);
      } else if (b.dataset.act === 'del') {
        if (tr.dataset.id) ed.removed.push(Number(tr.dataset.id));
        tr.remove();
      } else if (b.dataset.act === 'save') {
        save(table);
        return;
      } else {
        return;
      }
      markDirty(table);
    });
    section.addEventListener('input', () => markDirty(table));
  }

  function markDirty(table) {
    const ed = editors[table];
    ed.dirty = true;
    ed.section.querySelector('.dirty-note').hidden = false;
    updateTotal();
  }

  function updateTotal() {
    const ed = editors.stock_groups;
    const sum = [...ed.tbody.querySelectorAll('[data-k="qty"]')].reduce((s, el) => s + (parseInt(el.value, 10) || 0), 0);
    ed.section.querySelector('[data-total]').textContent = `총 ${sum} Set`;
  }

  async function load(table) {
    const ed = editors[table];
    const { data, error } = await db.from(table).select('*').order('sort').order('id');
    if (error) { showError(table, '불러오지 못했습니다. setup 안내의 stock.sql 을 실행했는지 확인해 주세요.'); console.error(error); return; }
    ed.tbody.innerHTML = data.map(row => rowHtml(ed.fields, row)).join('');
    ed.tbody.querySelectorAll('tr').forEach(tr => wireRow(table, ed.fields, tr));
    ed.removed = [];
    ed.dirty = false;
    ed.section.querySelector('.dirty-note').hidden = true;
    ed.section.querySelector('.msg.err').hidden = true;
    if (table === 'stock_groups') updateTotal();
  }

  function showError(table, text) {
    const el = editors[table].section.querySelector('.msg.err');
    el.textContent = text;
    el.hidden = false;
  }

  async function save(table) {
    const ed = editors[table];
    const btn = ed.section.querySelector('[data-act="save"]');
    const rows = [];
    for (const [i, tr] of [...ed.tbody.querySelectorAll('tr')].entries()) {
      const row = { sort: i };
      for (const input of tr.querySelectorAll('[data-k]')) {
        const k = input.dataset.k;
        if (input.type === 'number') {
          const n = Number(input.value);
          if (!Number.isInteger(n) || n < 0) { showError(table, `${i + 1}번째 줄의 수량은 0 이상의 정수로 입력해 주세요.`); input.focus(); return; }
          row[k] = n;
        } else {
          const v = input.value.trim();
          row[k] = v || (k.endsWith('_en') || k.endsWith('_zh') ? null : '');
        }
      }
      const req = ed.fields.find(f => f.required);
      if (!row[req.key]) { showError(table, `${i + 1}번째 줄의 ${req.label}을(를) 입력해 주세요.`); tr.querySelector(`[data-k="${req.key}"]`).focus(); return; }
      if (tr.dataset.id) row.id = Number(tr.dataset.id);
      rows.push(row);
    }

    btn.disabled = true;
    btn.textContent = '저장 중…';
    try {
      const existing = rows.filter(r => r.id);
      const fresh = rows.filter(r => !r.id);
      if (ed.removed.length) {
        const { error } = await db.from(table).delete().in('id', ed.removed);
        if (error) throw error;
      }
      if (existing.length) {
        const { error } = await db.from(table).upsert(existing);
        if (error) throw error;
      }
      if (fresh.length) {
        const { error } = await db.from(table).insert(fresh);
        if (error) throw error;
      }
      await load(table);
      flash('저장했습니다 · 홈페이지에 바로 반영됩니다');
    } catch (err) {
      console.error(err);
      showError(table, '저장하지 못했습니다. 인터넷 연결과 매니저 권한을 확인한 뒤 다시 눌러 주세요.');
    } finally {
      btn.disabled = false;
      btn.textContent = '저장';
    }
  }

  function flash(text) {
    const t = $('toast');
    t.textContent = text;
    t.hidden = false;
    setTimeout(() => { t.hidden = true; }, 2800);
  }

  document.querySelectorAll('#stockPanel [data-editor]').forEach(build);
  $('showTr').addEventListener('change', e => $('stockPanel').classList.toggle('show-tr', e.target.checked));

  document.addEventListener('admin:stock-open', () => {
    if (loaded) return;
    loaded = true;
    Object.keys(EDITORS).forEach(load);
  });

  window.addEventListener('beforeunload', e => {
    if (Object.values(editors).some(ed => ed.dirty)) e.preventDefault();
  });
})();
