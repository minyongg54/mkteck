// 관리 페이지 AI 자동 번역 — 한국어 칸을 채우면 비어 있는 영어·중국어 칸을 채워 줍니다.
// 요청은 Supabase translate_jobs 에 들어가고, 사무실 Mac 의 번역 브리지가 처리합니다.
// 매니저가 직접 쓴 칸은 덮어쓰지 않으며, 번역이 안 되면 칸을 그대로 둡니다.
const AiTranslate = (() => {
  const HANGUL = /[가-힣]/;
  const TIMEOUT_MS = 30000;
  let unavailableUntil = 0;
  let onStatus = () => {};

  async function request(text) {
    if (!HANGUL.test(text)) return { en: text, zh: text };
    if (Date.now() < unavailableUntil) throw Error('unavailable');
    const db = galleryClient();
    const { data, error } = await db.from('translate_jobs').insert({ text_ko: text }).select('id').single();
    if (error) throw error;
    const deadline = Date.now() + TIMEOUT_MS;
    while (Date.now() < deadline) {
      await new Promise(r => setTimeout(r, 1000));
      const { data: job } = await db.from('translate_jobs').select('status,en,zh').eq('id', data.id).single();
      if (job?.status === 'done') return { en: job.en, zh: job.zh };
      if (job?.status === 'error') throw Error('failed');
    }
    // 브리지가 응답하지 않으면 5분 동안은 요청하지 않는다 (Mac 이 꺼져 있을 가능성)
    unavailableUntil = Date.now() + 5 * 60000;
    throw Error('timeout');
  }

  // 사람이 고친 칸인지: 자동으로 넣은 값과 지금 값이 같으면 자동 칸으로 본다
  const isFree = el => !el.value.trim() || el.dataset.auto === el.value;

  function wire(ko, targets, { onFill } = {}) {
    const fields = [['en', targets.en], ['zh', targets.zh]].filter(([, el]) => el);
    let seq = 0;
    ko.addEventListener('change', async () => {
      const text = ko.value.trim();
      const free = fields.filter(([, el]) => isFree(el));
      if (!text || !free.length) return;
      const mine = ++seq;
      free.forEach(([, el]) => { el.dataset.placeholder ??= el.placeholder; el.placeholder = 'AI 번역 중…'; });
      onStatus('working');
      try {
        const out = await request(text);
        if (mine !== seq) return;  // 그 사이 한국어를 다시 고쳤으면 버린다
        let filled = false;
        for (const [lang, el] of free) {
          if (!isFree(el) || !out[lang]) continue;
          el.value = out[lang];
          el.dataset.auto = out[lang];
          filled = true;
        }
        onStatus('done');
        if (filled && onFill) onFill();
      } catch (err) {
        if (mine === seq) onStatus('unavailable', err);
      } finally {
        free.forEach(([, el]) => { el.placeholder = el.dataset.placeholder; });
      }
    });
  }

  return { wire, setStatusHandler: fn => { onStatus = fn; }, request };
})();
