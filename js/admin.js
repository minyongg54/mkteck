// 갤러리 관리 페이지 (admin/index.html) — 로그인, 게시, 수정, 삭제.
(() => {
  const $ = id => document.getElementById(id);
  const esc = galleryEscape;
  const db = galleryClient();
  const bucket = () => db.storage.from(GALLERY_CONFIG.bucket);
  const today = () => new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD (로컬 시간)
  const kb = n => n >= 1048576 ? (n / 1048576).toFixed(1) + 'MB' : Math.round(n / 1024) + 'KB';

  let posts = [];
  let photos = [];       // { name } 기존 사진 | { full, thumb, preview, before } 새 사진
  let removed = [];      // 수정 중 뺀 기존 사진 이름
  let editingId = null;

  if (!db) { $('notConfigured').hidden = false; return; }

  // ---- 로그인 ----
  async function showSession(session) {
    $('loginPanel').hidden = !!session;
    $('adminPanel').hidden = !session;
    $('who').hidden = !session;
    if (!session) return;
    $('whoEmail').textContent = session.user.email;
    const { data: isAdmin } = await db.rpc('is_gallery_admin');
    $('notAdmin').hidden = !!isAdmin;
    loadPosts();
  }

  $('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    $('loginErr').hidden = true;
    $('loginBtn').disabled = true;
    const { data, error } = await db.auth.signInWithPassword({ email: $('email').value.trim(), password: $('password').value });
    $('loginBtn').disabled = false;
    if (error) {
      $('loginErr').textContent = '이메일 또는 비밀번호가 맞지 않습니다.';
      $('loginErr').hidden = false;
      return;
    }
    showSession(data.session);
  });

  $('logout').addEventListener('click', async () => {
    await db.auth.signOut();
    resetForm();
    showSession(null);
  });

  // ---- 게시물 목록 ----
  async function loadPosts() {
    const { data, error } = await db.from('gallery_posts').select('*')
      .order('taken_on', { ascending: false }).order('id', { ascending: false });
    if (error) { toast('목록을 불러오지 못했습니다'); console.error(error); return; }
    posts = data;
    renderList();
  }

  const catLabel = id => GALLERY_CATEGORIES.find(c => c.id === id)?.label.ko || id;

  function renderList() {
    $('listSub').textContent = `총 ${posts.length}개 · 날짜 최신순`;
    if (!posts.length) { $('postList').innerHTML = '<li class="empty" style="display:block">아직 게시물이 없습니다. 왼쪽에서 첫 사진을 올려 보세요.</li>'; return; }
    $('postList').innerHTML = posts.map(p => `
      <li>
        <img src="${p.photos[0] ? galleryPhotoUrl(p.photos[0], 't') : ''}" alt="" loading="lazy">
        <div style="min-width:0"><div class="pn">${esc(p.title_ko)}</div><div class="pm">${esc(catLabel(p.category))} · ${p.taken_on.replaceAll('-', '.')} · ${p.photos.length}장</div></div>
        <div class="pa">
          <button type="button" class="btn ghost small${p.id === editingId ? ' editing' : ''}" data-edit="${p.id}">수정</button>
          <button type="button" class="btn ghost small" data-del="${p.id}">삭제</button>
        </div>
      </li>`).join('');
  }

  $('postList').addEventListener('click', async e => {
    const edit = e.target.closest('[data-edit]');
    if (edit) { startEdit(Number(edit.dataset.edit)); return; }
    const del = e.target.closest('[data-del]');
    if (!del) return;
    if (!del.classList.contains('danger')) {
      del.classList.add('danger');
      del.textContent = '정말 삭제';
      setTimeout(() => { del.classList.remove('danger'); del.textContent = '삭제'; }, 4000);
      return;
    }
    const post = posts.find(p => p.id === Number(del.dataset.del));
    del.disabled = true;
    const { error } = await db.from('gallery_posts').delete().eq('id', post.id);
    if (error) { toast('삭제하지 못했습니다'); console.error(error); del.disabled = false; return; }
    await removeFiles(post.photos);
    if (editingId === post.id) resetForm();
    toast('삭제했습니다');
    loadPosts();
  });

  // ---- 사진 선택 / 압축 ----
  $('category').innerHTML = GALLERY_CATEGORIES.map(c => `<option value="${c.id}">${esc(c.label.ko)}</option>`).join('');
  $('takenOn').value = today();

  const drop = $('drop');
  drop.addEventListener('click', () => $('fileInput').click());
  drop.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('fileInput').click(); } });
  ['dragenter', 'dragover'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(t => drop.addEventListener(t, e => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', e => addFiles(e.dataTransfer.files));
  $('fileInput').addEventListener('change', e => { addFiles(e.target.files); e.target.value = ''; });

  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  function resize(img, maxSide, quality) {
    const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';  // 투명 PNG 배경
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
  }

  async function addFiles(fileList) {
    for (const file of fileList) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const img = await loadImage(file);
        const [full, thumb] = await Promise.all([resize(img, 1600, 0.82), resize(img, 640, 0.78)]);
        URL.revokeObjectURL(img.src);
        photos.push({ full, thumb, preview: URL.createObjectURL(thumb), before: file.size });
      } catch {
        toast(`${file.name} 은(는) 열 수 없는 형식입니다`);
      }
    }
    renderPreviews();
  }

  function renderPreviews() {
    $('previews').innerHTML = photos.map((p, i) => `
      <figure>
        <img src="${p.name ? galleryPhotoUrl(p.name, 't') : p.preview}" alt="">
        ${i === 0 ? '<span class="cover">대표</span>' : ''}
        <span class="tools">
          ${i > 0 ? `<button type="button" data-front="${i}" title="대표 사진으로">★</button>` : ''}
          <button type="button" data-remove="${i}" title="빼기">✕</button>
        </span>
        ${p.name ? '' : `<figcaption>${kb(p.before)} → ${kb(p.full.size)}</figcaption>`}
      </figure>`).join('');
  }

  $('previews').addEventListener('click', e => {
    const front = e.target.closest('[data-front]');
    const rm = e.target.closest('[data-remove]');
    if (front) photos.unshift(...photos.splice(Number(front.dataset.front), 1));
    if (rm) {
      const [p] = photos.splice(Number(rm.dataset.remove), 1);
      if (p.name) removed.push(p.name); else URL.revokeObjectURL(p.preview);
    }
    renderPreviews();
  });

  // ---- 저장 ----
  const newName = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;

  async function uploadNew(onProgress) {
    const names = [];
    const fresh = photos.filter(p => !p.name);
    let done = 0;
    for (const p of photos) {
      if (p.name) { names.push(p.name); continue; }
      const name = newName();
      for (const [size, blob] of [['p', p.full], ['t', p.thumb]]) {
        const { error } = await bucket().upload(`${size}/${name}`, blob, { contentType: 'image/jpeg', cacheControl: '31536000' });
        if (error) throw error;
      }
      p.name = name;  // 실패 후 다시 저장할 때 중복 업로드 방지
      names.push(name);
      onProgress(++done, fresh.length);
    }
    return names;
  }

  async function removeFiles(names) {
    if (!names.length) return;
    const { error } = await bucket().remove(names.flatMap(n => [`p/${n}`, `t/${n}`]));
    if (error) console.error(error);
  }

  function showPostError(text) {
    $('postErr').textContent = text;
    $('postErr').hidden = false;
  }

  $('postForm').addEventListener('submit', async e => {
    e.preventDefault();
    $('postErr').hidden = true;
    const title = $('titleKo').value.trim();
    if (!title) { showPostError('제목을 입력해 주세요.'); $('titleKo').focus(); return; }
    if (!photos.length) { showPostError('사진을 한 장 이상 올려 주세요.'); return; }

    const btn = $('saveBtn');
    btn.disabled = true;
    try {
      const names = await uploadNew((n, total) => { btn.textContent = `사진 올리는 중 ${n}/${total}`; });
      btn.textContent = '저장 중…';
      const row = {
        category: $('category').value,
        taken_on: $('takenOn').value || today(),
        title_ko: title,
        desc_ko: $('descKo').value.trim() || null,
        title_en: $('titleEn').value.trim() || null,
        desc_en: $('descEn').value.trim() || null,
        title_zh: $('titleZh').value.trim() || null,
        desc_zh: $('descZh').value.trim() || null,
        photos: names,
      };
      const { error } = editingId
        ? await db.from('gallery_posts').update(row).eq('id', editingId)
        : await db.from('gallery_posts').insert(row);
      if (error) throw error;
      await removeFiles(removed);
      toast(editingId ? '수정했습니다' : '게시했습니다 · 갤러리에 바로 보입니다');
      resetForm();
      loadPosts();
    } catch (err) {
      console.error(err);
      showPostError('저장하지 못했습니다. 인터넷 연결과 매니저 권한을 확인한 뒤 다시 눌러 주세요.');
    } finally {
      btn.disabled = false;
      btn.textContent = editingId ? '수정 저장' : '게시';
    }
  });

  // ---- 수정 모드 ----
  function startEdit(id) {
    const p = posts.find(x => x.id === id);
    if (!p) return;
    resetForm();
    editingId = id;
    $('category').value = p.category;
    $('takenOn').value = p.taken_on;
    $('titleKo').value = p.title_ko;
    $('descKo').value = p.desc_ko || '';
    $('titleEn').value = p.title_en || '';
    $('descEn').value = p.desc_en || '';
    $('titleZh').value = p.title_zh || '';
    $('descZh').value = p.desc_zh || '';
    $('translations').open = !!(p.title_en || p.title_zh || p.desc_en || p.desc_zh);
    photos = p.photos.map(name => ({ name }));
    renderPreviews();
    $('formTitle').textContent = '게시물 수정';
    $('saveBtn').textContent = '수정 저장';
    $('cancelEdit').hidden = false;
    renderList();
    $('formTitle').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function resetForm() {
    photos.forEach(p => p.preview && URL.revokeObjectURL(p.preview));
    photos = [];
    removed = [];
    editingId = null;
    $('postForm').reset();
    $('takenOn').value = today();
    $('translations').open = false;
    $('postErr').hidden = true;
    $('formTitle').textContent = '새 게시물';
    $('saveBtn').textContent = '게시';
    $('cancelEdit').hidden = true;
    renderPreviews();
    renderList();
  }

  $('cancelEdit').addEventListener('click', resetForm);

  let toastTimer;
  function toast(text) {
    $('toast').textContent = text;
    $('toast').hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $('toast').hidden = true; }, 2800);
  }

  db.auth.getSession().then(({ data }) => showSession(data.session));
})();
