/* ==========================================================
   近未来なりきりランド ― アプリ本体
   写真・映像はすべて端末の中だけで処理し、外部には送信しません
   ========================================================== */
(() => {
  'use strict';
  const CFG = window.NRL_CONFIG;
  const FX = window.NRL_FX;
  const ART = window.NRL_ART;
  const ic = (k) => ART.icon(k);
  const LOCK = '<svg class="lock-ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 0 1 6 0v3Z"/></svg>';
  const COSTUMES = window.NRL_COSTUMES.slice();
  const MP_VER = '0.10.14';
  const MP_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VER}/vision_bundle.mjs`;
  const MP_WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VER}/wasm`;
  const MP_MODEL = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- 保存データ ----------
     visits: { 'YYYY-MM-DD': { t: 来店時刻, spot: 読んだQR, photo: 写真の有無 } }
     purchase: 購入者限定QRを読んだ時刻 / candy: お菓子を受け取った時刻
     写真そのものは IndexedDB（photoDB）に日付をキーにして保存 */
  const RALLY = CFG.rally || { name: 'スタンプラリー', goal: 3, prize: 'プレゼント', clearMessage: '' };
  const GOAL = RALLY.goal || 3;
  function load() {
    try { const d = JSON.parse(localStorage.getItem(CFG.storageKey)); if (d && d.visits) return d; } catch (e) { /* noop */ }
    return { visits: {}, purchase: null, candy: null };
  }
  function save() { try { localStorage.setItem(CFG.storageKey, JSON.stringify(data)); } catch (e) { /* noop */ } }
  let data = load();

  const pad = (n) => String(n).padStart(2, '0');
  const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const WEEK = ['日', '月', '火', '水', '木', '金', '土'];
  function dayLabel(key) { const [y, m, d] = key.split('-').map(Number); const dt = new Date(y, m - 1, d); return `${m}/${d}（${WEEK[dt.getDay()]}）`; }
  const visitDays = () => Object.keys(data.visits).sort();
  const visitCount = () => visitDays().length;
  const isClear = () => visitCount() >= GOAL;
  const hasPurchase = () => !!data.purchase;
  const costumeById = (id) => COSTUMES.find((c) => c.id === id);
  function canUse(lock) {
    if (!lock) return true;
    if (lock === 'purchase') return hasPurchase();
    if (lock === 'complete') return isClear();
    const m = /^visit(\d+)$/.exec(lock);
    return m ? visitCount() >= Number(m[1]) : false;
  }
  const isUnlocked = (c) => canUse(c.lock);
  function lockLabel(c) {
    if (c.lock === 'purchase') return 'お買い上げのお客さま限定';
    if (c.lock === 'complete') return `スタンプ${GOAL}こで解放`;
    const m = /^visit(\d+)$/.exec(c.lock || '');
    return m ? `スタンプ${m[1]}こで解放` : '';
  }

  /* ---------- 思い出写真（IndexedDB） ---------- */
  const photoDB = (() => {
    let dbp = null;
    const open = () => dbp || (dbp = new Promise((res, rej) => {
      const r = indexedDB.open('nrl-album', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('photos');
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    }));
    const run = async (mode, fn) => {
      const db = await open();
      return new Promise((res, rej) => {
        const t = db.transaction('photos', mode);
        const req = fn(t.objectStore('photos'));
        t.oncomplete = () => res(req ? req.result : undefined);
        t.onerror = () => rej(t.error); t.onabort = () => rej(t.error);
      });
    };
    return {
      put: (k, v) => run('readwrite', (s) => s.put(v, k)),
      get: (k) => run('readonly', (s) => s.get(k)),
      clear: () => run('readwrite', (s) => s.clear())
    };
  })();
  const photoURL = {};
  async function shrink(blob, max = 1280) {
    const url = URL.createObjectURL(blob);
    try {
      const im = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
      const k = Math.min(1, max / Math.max(im.naturalWidth, im.naturalHeight));
      const c = document.createElement('canvas');
      c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      return await new Promise((res) => c.toBlob(res, 'image/jpeg', 0.85));
    } finally { URL.revokeObjectURL(url); }
  }
  async function setMemory(key, blob) {
    try {
      const small = await shrink(blob);
      await photoDB.put(key, small);
      if (photoURL[key]) URL.revokeObjectURL(photoURL[key]);
      photoURL[key] = URL.createObjectURL(small);
      data.visits[key].photo = true; save();
      renderStamps();
      return true;
    } catch (e) {
      toast('写真を保存できませんでした。スマホの空き容量を確認してください');
      return false;
    }
  }
  async function loadMemories() {
    for (const k of visitDays()) {
      if (data.visits[k].photo && !photoURL[k]) {
        try { const b = await photoDB.get(k); if (b) photoURL[k] = URL.createObjectURL(b); } catch (e) { /* noop */ }
      }
    }
    renderStamps();
  }

  /* ---------- 公式画像（任意） ---------- */
  function loadImg(src, onok) { const img = new Image(); img.onload = onok; img.src = src; return img; }
  (CFG.officialImages || []).forEach((o) => {
    const c = { id: o.id, name: o.name, icon: o.icon || 'sparkle', cat: 'kids', lock: o.lock || null, placement: o.placement, available: false, official: true };
    c.image = loadImg(o.src, () => { c.available = true; renderAll(); });
    COSTUMES.unshift(c);
  });
  function addPartsCostume(o, extra) {
    const c = Object.assign({ id: o.id, name: o.name, icon: o.icon || 'rose', cat: o.cat || 'kids', lock: o.lock || null, particles: o.particles, filter: o.filter, parts: {}, available: false, official: true }, extra);
    Object.entries(o.parts || {}).forEach(([k, p]) => {
      c.parts[k] = Object.assign({}, p, { img: loadImg(p.src, () => { c.available = true; renderAll(); }) });
    });
    if (o.overlay) c.overlay = loadImg(o.overlay, () => { c.available = true; renderAll(); });
    COSTUMES.unshift(c);
  }
  (CFG.officialCostumes || []).forEach((o) => addPartsCostume(o, {}));
  const COLLAB = CFG.collab && CFG.collab.enabled ? CFG.collab : null;
  if (COLLAB) (COLLAB.costumes || []).forEach((o) => addPartsCostume(o, { cat: 'collab', lock: 'purchase' }));
  const logo = new Image();
  let logoOk = false;
  if (CFG.logoImage) {
    logo.onload = () => { logoOk = true; $$('[data-logo]').forEach((el) => { el.innerHTML = `<img src="${esc(CFG.logoImage)}" alt="${esc(CFG.storeLabel)}">`; }); };
    logo.src = CFG.logoImage;
  }
  const visibleCostumes = () => COSTUMES.filter((c) => !c.official || c.available);

  /* ---------- 画面切り替え ---------- */
  function showView(name) {
    $$('.view').forEach((v) => v.classList.toggle('is-active', v.id === `view-${name}`));
    $$('.tabbar [data-view]').forEach((b) => b.setAttribute('aria-current', b.dataset.view === name ? 'page' : 'false'));
    window.scrollTo(0, 0);
  }

  /* ---------- トースト・モーダル ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg; el.classList.add('is-show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('is-show'), 2800);
  }
  const modalQueue = [];
  function modal(html, actions) {
    const m = $('#modal');
    if (!m.hidden) { modalQueue.push([html, actions]); return; }
    $('#modal-body').innerHTML = html;
    const act = $('#modal-actions'); act.innerHTML = '';
    actions.forEach((a) => {
      const b = document.createElement('button');
      b.className = a.primary ? 'btn btn-pop' : 'btn btn-pop btn-paper';
      b.textContent = a.label;
      b.addEventListener('click', () => { closeModal(); a.onClick && a.onClick(); });
      act.appendChild(b);
    });
    m.hidden = false;
    requestAnimationFrame(() => m.classList.add('is-open'));
    const first = act.querySelector('button'); if (first) first.focus();
  }
  function closeModal() {
    const m = $('#modal'); m.classList.remove('is-open');
    setTimeout(() => { m.hidden = true; const next = modalQueue.shift(); if (next) setTimeout(() => modal(next[0], next[1]), 150); }, 200);
  }
  const unlockList = (list) => list.map((c) => `<p class="modal-unlock"><span class="mu-ic" aria-hidden="true">${ic(c.icon)}</span>「${esc(c.name)}」で撮影できるよ</p>`).join('');

  /* ---------- QRから来たときの処理 ---------- */
  function handleQuery(forced) {
    const q = new URLSearchParams(forced || location.search);
    const clean = () => { if (!forced) history.replaceState(null, '', location.pathname + location.hash); };
    if (q.get('reset') === '1') {
      clean();
      modal('<h2 class="modal-title">データをリセットしますか？</h2><p>この端末のスタンプ・思い出写真・購入者限定の解放がすべて消えます（スタッフ用）。</p>', [
        { label: 'リセットする', primary: true, onClick: async () => { data = { visits: {}, purchase: null, candy: null }; save(); try { await photoDB.clear(); } catch (e) { /* noop */ } Object.keys(photoURL).forEach((k) => delete photoURL[k]); renderAll(); toast('リセットしました'); } },
        { label: 'やめる' }
      ]);
      return;
    }
    const ptoken = q.get('p');
    if (ptoken) {
      clean();
      if (!COLLAB || !(COLLAB.tokens || []).includes(ptoken)) { toast('このQRコードは読み取れませんでした。スタッフにお声がけください'); return; }
      const first = !data.purchase;
      data.purchase = data.purchase || Date.now(); save(); renderAll();
      modal(`<div class="stamp-pop is-gold"><span aria-hidden="true">${ic('gift')}</span></div><h2 class="modal-title">${first ? 'お買い上げありがとうございます！' : 'コラボ限定はもう使えるよ'}</h2><p>${esc(COLLAB.label)}の衣装・フレーム・スタンプが使えるようになりました。</p>`, [
        { label: 'なりきりカメラであそぶ', primary: true, onClick: () => { cam.cat = 'collab'; openCamera(); } },
        { label: 'とじる' }
      ]);
      return;
    }
    const token = q.get('s');
    if (!token) return;
    clean();
    const spot = CFG.spots.find((s) => s.token === token);
    if (!spot) { toast('このQRコードは読み取れませんでした。売り場のスタッフにお声がけください'); return; }
    const key = dayKey();
    const isNew = !data.visits[key];
    const before = visitCount();
    if (isNew) { data.visits[key] = { t: Date.now(), spot: spot.id, photo: false }; save(); }
    renderAll();
    const n = visitCount();
    const newly = isNew ? COSTUMES.filter((c) => c.lock && c.lock !== 'purchase' && !canUseAt(c.lock, before) && canUse(c.lock)) : [];
    const pop = `<div class="stamp-pop is-halloween"><span aria-hidden="true">${ic('pumpkin')}</span></div>`;
    if (isNew) {
      modal(`${pop}<h2 class="modal-title">${n}回目のスタンプをゲット！</h2><p class="modal-count">${dayLabel(key)}　${Math.min(n, GOAL)} / ${GOAL}</p><p class="modal-text">今日のお気に入り写真を1まい、スタンプカードに登録しよう</p>${unlockList(newly)}`, [
        { label: 'なりきりカメラで撮る', primary: true, onClick: () => openCamera(newly[0] ? newly[0].id : null) },
        { label: 'スタンプカードを見る', onClick: () => showView('stamps') }
      ]);
      if (before < GOAL && n >= GOAL) {
        modal(`<div class="stamp-pop is-gold"><span aria-hidden="true">${ic('candy')}</span></div><h2 class="modal-title">クリアおめでとう！</h2><p class="modal-text">${esc(RALLY.prize)}をプレゼント！スタンプカードの画面をスタッフに見せてね</p>`, [
          { label: 'スタンプカードを見る', primary: true, onClick: () => showView('stamps') },
          { label: 'あとで' }
        ]);
      }
    } else {
      modal(`${pop}<h2 class="modal-title">今日のスタンプはもう押してあるよ</h2><p class="modal-text">スタンプは1日1こ。また別の日に来てね！</p>`, [
        { label: 'なりきりカメラで撮る', primary: true, onClick: () => openCamera() },
        { label: 'スタンプカードを見る', onClick: () => showView('stamps') }
      ]);
    }
  }
  function canUseAt(lock, count) {
    if (lock === 'complete') return count >= GOAL;
    const m = /^visit(\d+)$/.exec(lock || '');
    return m ? count >= Number(m[1]) : true;
  }

  /* ---------- スタンプカード兼アルバム ---------- */
  function clearCode() {
    let h = 7;
    visitDays().slice(0, GOAL).forEach((k) => { h = (h * 31 + data.visits[k].t) % 1679616; });
    return h.toString(36).toUpperCase().padStart(4, '0');
  }
  function renderStamps() {
    const n = visitCount();
    $$('[data-stamp-count]').forEach((el) => { el.textContent = Math.min(n, GOAL); });
    $$('[data-stamp-total]').forEach((el) => { el.textContent = GOAL; });
    $$('[data-rally-name]').forEach((el) => { el.textContent = RALLY.name; });
    $$('[data-prize]').forEach((el) => { el.textContent = RALLY.prize; });
    const dots = $('#tk-dots');
    if (dots) dots.innerHTML = Array.from({ length: GOAL }, (_, i) => `<i class="${i < n ? 'on' : ''}">${i < n ? ic('pumpkin') : ''}</i>`).join('');
    const days = visitDays();
    const slots = Math.max(GOAL, days.length);
    const today = dayKey();
    $('#stamp-grid').innerHTML = Array.from({ length: slots }, (_, i) => {
      const k = days[i];
      const goalSlot = i < GOAL;
      if (!k) {
        return `<li class="memo is-empty"><div class="memo-photo"><span class="memo-num">${i + 1}</span><span class="memo-wait">${i === n ? 'つぎの来店で<br>スタンプ' : 'まだだよ'}</span></div></li>`;
      }
      const url = photoURL[k];
      return `<li class="memo ${goalSlot ? '' : 'is-extra'}">
        <div class="memo-photo">
          ${url ? `<button class="memo-img" data-memory="${k}" aria-label="${dayLabel(k)}の写真を見る"><img src="${url}" alt=""></button>`
                : `<label class="memo-add">写真を登録<input class="sr-only" type="file" accept="image/*" data-album-date="${k}"></label>`}
          <span class="memo-stamp" aria-hidden="true">${ic('pumpkin')}</span>
        </div>
        <p class="memo-date">${dayLabel(k)}${k === today ? '<span class="memo-today">今日</span>' : ''}</p>
        ${url ? `<label class="memo-change">写真をかえる<input class="sr-only" type="file" accept="image/*" data-album-date="${k}"></label>` : ''}
      </li>`;
    }).join('');
    const done = $('#complete-panel');
    if (isClear()) {
      done.hidden = false;
      $('#complete-code').textContent = `HW-${clearCode()}`;
      $('#complete-msg').innerHTML = String(RALLY.clearMessage).split(/(?<=[。！])/).filter(Boolean).map((t) => `<span class="line">${esc(t)}</span>`).join('');
      const got = !!data.candy;
      $('#candy-status').innerHTML = got ? `${esc(RALLY.prize)}受け取りずみ（${dayLabel(dayKey(new Date(data.candy)))}）` : '';
      $('#btn-candy').hidden = got;
      done.classList.toggle('is-claimed', got);
    } else done.hidden = true;
  }
  setInterval(() => {
    const el = $('#complete-clock');
    if (el && !$('#complete-panel').hidden) {
      const d = new Date();
      el.textContent = `${d.getMonth() + 1}月${d.getDate()}日 ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }
  }, 1000);

  /* ---------- 衣装ギャラリー（ホーム） ---------- */
  function renderGallery() {
    const el = $('#gallery');
    const list = visibleCostumes();
    let html = list.map((c) => {
      const ok = isUnlocked(c);
      return `<li><button class="look ${ok ? '' : 'is-locked'} ${c.cat === 'halloween' ? 'is-halloween' : ''}" data-costume="${esc(c.id)}" ${ok ? '' : 'aria-disabled="true"'}>
        <span class="look-ic" aria-hidden="true">${ic(c.icon)}</span>${ok ? '' : `<span class="look-lock">${LOCK}</span>`}
        <span class="look-name">${esc(c.name)}</span>
        <span class="look-sub">${ok ? '' : esc(lockLabel(c))}</span>
      </button></li>`;
    }).join('');
    if (COLLAB && !list.some((c) => c.cat === 'collab')) {
      html += `<li><button class="look is-locked is-collab" data-collab-info>
        <span class="look-ic" aria-hidden="true">${ic('collab')}</span><span class="look-lock">${LOCK}</span>
        <span class="look-name">${esc(COLLAB.label)}衣装</span><span class="look-sub">お買い上げのお客さま限定</span></button></li>`;
    }
    el.innerHTML = html;
  }

  /* ==========================================================
     カメラ
     ========================================================== */
  const cam = {
    el: $('#camera'), video: $('#video'), canvas: $('#stage'), ctx: null,
    stream: null, facing: 'environment', running: false,
    lm: null, poseState: 'idle', lastT: -1, poses: [], smooth: [],
    selected: null, cat: 'all', particles: [], lastFrame: 0, timer: true, busy: false
  };
  cam.ctx = cam.canvas.getContext('2d');

  function setStatus(state, text) {
    const s = $('#cam-status');
    s.dataset.state = state; $('#cam-status-text').textContent = text;
  }

  async function openCamera(costumeId) {
    const list = visibleCostumes();
    if (costumeId && isUnlocked(costumeById(costumeId) || {})) cam.selected = costumeId;
    if (!cam.selected) cam.selected = (list.find((c) => isUnlocked(c)) || list[0]).id;
    cam.el.hidden = false;
    document.body.classList.add('cam-open');
    renderRail();
    $('#cam-error').hidden = true;
    await startStream();
    if (!cam.running) { cam.running = true; requestAnimationFrame(loop); }
    initPose();
  }
  function closeCamera() {
    cam.running = false;
    if (cam.stream) cam.stream.getTracks().forEach((t) => t.stop());
    cam.stream = null;
    cam.el.hidden = true;
    document.body.classList.remove('cam-open');
    renderAll();
  }

  async function startStream() {
    if (cam.stream) cam.stream.getTracks().forEach((t) => t.stop());
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showCamError('このブラウザではカメラを使えません。SafariかChromeで開いてください。LINEやInstagramから開いた場合は、右上のメニューから「ブラウザで開く」を選んでください。');
      return;
    }
    try {
      cam.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: cam.facing }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false
      });
      cam.video.srcObject = cam.stream;
      await cam.video.play();
      cam.smooth = [];
    } catch (e) {
      const msg = e && e.name === 'NotAllowedError'
        ? 'カメラの使用が許可されていません。ブラウザの設定でこのサイトのカメラを「許可」にしてから、もう一度ひらいてください。'
        : 'カメラを起動できませんでした。ほかのアプリでカメラを使っていないか確認して、もう一度ひらいてください。';
      showCamError(msg);
    }
  }
  function showCamError(msg) { $('#cam-error-text').textContent = msg; $('#cam-error').hidden = false; }

  async function initPose() {
    if (cam.poseState !== 'idle') return;
    cam.poseState = 'loading';
    setStatus('loading', 'AIを準備中…');
    try {
      const vision = await import(MP_URL);
      const files = await vision.FilesetResolver.forVisionTasks(MP_WASM);
      const make = (delegate) => vision.PoseLandmarker.createFromOptions(files, {
        baseOptions: { modelAssetPath: MP_MODEL, delegate },
        runningMode: 'VIDEO', numPoses: 3,
        minPoseDetectionConfidence: 0.5, minPosePresenceConfidence: 0.5, minTrackingConfidence: 0.5
      });
      try { cam.lm = await make('GPU'); } catch (e) { cam.lm = await make('CPU'); }
      cam.poseState = 'ready';
      setStatus('ready', 'からだに合わせて着せかえ中');
    } catch (e) {
      console.warn('pose init failed', e);
      cam.poseState = 'failed';
      setStatus('frame', 'わくに合わせて立ってね');
    }
  }

  function resizeCanvas() {
    const c = cam.canvas;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(c.clientWidth * dpr), h = Math.round(c.clientHeight * dpr);
    if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
  }

  function smoothLm(i, lm) {
    const prev = cam.smooth[i];
    if (!prev || prev.length !== lm.length) { cam.smooth[i] = lm.map((p) => ({ x: p.x, y: p.y, v: p.visibility == null ? 1 : p.visibility })); return cam.smooth[i]; }
    const a = 0.55;
    for (let k = 0; k < lm.length; k++) {
      prev[k].x += (lm[k].x - prev[k].x) * a;
      prev[k].y += (lm[k].y - prev[k].y) * a;
      prev[k].v = lm[k].visibility == null ? 1 : lm[k].visibility;
    }
    return prev;
  }

  function toGeom(lm, map, W, H, mirror) {
    const pts = lm.map((p) => {
      let x = map.ox + p.x * map.dw;
      if (mirror) x = W - x;
      return { x, y: map.oy + p.y * map.dh, v: p.v };
    });
    const vis = (i) => pts[i] && pts[i].v > 0.45;
    if (!vis(11) || !vis(12)) return null;
    const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
    const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    const [sL, sR] = pts[11].x < pts[12].x ? [pts[11], pts[12]] : [pts[12], pts[11]];
    const sc = mid(sL, sR);
    const sw = Math.max(dist(sL, sR), 20);
    let hc, headR, headAngle = 0, eyeDy = null, eyeHalf = null;
    if (vis(7) && vis(8)) {
      const [eL, eR] = pts[7].x < pts[8].x ? [pts[7], pts[8]] : [pts[8], pts[7]];
      headR = Math.max(dist(eL, eR) * 0.62, sw * 0.28);
      const em = mid(eL, eR);
      hc = { x: em.x, y: em.y - headR * 0.08 };
      headAngle = Math.atan2(eR.y - eL.y, eR.x - eL.x);
    } else if (vis(0)) {
      headR = sw * 0.36; hc = { x: pts[0].x, y: pts[0].y - headR * 0.1 };
    } else {
      headR = sw * 0.36; hc = { x: sc.x, y: sc.y - sw * 0.75 };
    }
    if (vis(2) && vis(5)) {
      const em = mid(pts[2], pts[5]);
      eyeDy = (em.y - hc.y) * Math.cos(headAngle) - (em.x - hc.x) * Math.sin(headAngle);
      eyeHalf = dist(pts[2], pts[5]) / 2;
    }
    let hip;
    if (vis(23) && vis(24)) hip = mid(pts[23], pts[24]);
    else hip = { x: sc.x, y: sc.y + sw * 1.25 };
    if (hip.y - sc.y < sw * 0.6) hip.y = sc.y + sw * 0.6;
    const torso = hip.y - sc.y;
    let bottomY;
    if (vis(27) || vis(28)) bottomY = Math.max(vis(27) ? pts[27].y : 0, vis(28) ? pts[28].y : 0) + sw * 0.08;
    else if (vis(25) || vis(26)) bottomY = Math.max(vis(25) ? pts[25].y : 0, vis(26) ? pts[26].y : 0) + torso * 0.95;
    else bottomY = hip.y + torso * 1.7;
    bottomY = Math.min(bottomY, H * 1.15);
    return { hc, headR, headAngle, headTop: hc.y - headR * 1.2, eyeDy, eyeHalf, sc, sw, sL, sR, hip, bottomY, lm: pts };
  }

  function fixedGeom(W, H) {
    const sw = Math.min(W * 0.26, H * 0.13);
    const sc = { x: W / 2, y: H * 0.32 };
    const headR = sw * 0.38;
    const hc = { x: W / 2, y: sc.y - sw * 0.85 };
    return { hc, headR, headAngle: 0, headTop: hc.y - headR * 1.2, eyeDy: null, sc, sw, sL: { x: sc.x - sw / 2, y: sc.y }, sR: { x: sc.x + sw / 2, y: sc.y }, hip: { x: W / 2, y: sc.y + sw * 1.25 }, bottomY: H * 0.72, lm: null, fixed: true };
  }

  function loop(now) {
    if (!cam.running) return;
    requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - (cam.lastFrame || now)) / 1000);
    cam.lastFrame = now;
    resizeCanvas();
    drawScene(cam.ctx, now / 1000, dt);
  }

  function drawScene(ctx, t, dt) {
    const { canvas, video } = cam;
    const W = canvas.width, H = canvas.height;
    const mirror = cam.facing === 'user';
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#1E1B4B'; ctx.fillRect(0, 0, W, H);
    let map = null;
    if (video.readyState >= 2 && video.videoWidth) {
      const vw = video.videoWidth, vh = video.videoHeight;
      const s = Math.max(W / vw, H / vh);
      map = { dw: vw * s, dh: vh * s, ox: (W - vw * s) / 2, oy: (H - vh * s) / 2 };
      ctx.save();
      if (mirror) { ctx.translate(W, 0); ctx.scale(-1, 1); }
      ctx.drawImage(video, map.ox, map.oy, map.dw, map.dh);
      ctx.restore();
      if (cam.poseState === 'ready' && video.currentTime !== cam.lastT) {
        cam.lastT = video.currentTime;
        try { cam.poses = cam.lm.detectForVideo(video, performance.now()).landmarks || []; } catch (e) { cam.poses = []; }
        if (cam.poses.length < cam.smooth.length) cam.smooth.length = cam.poses.length;
      }
    }
    const c = costumeById(cam.selected) || COSTUMES[0];
    let geoms = [];
    if (cam.poseState === 'ready' && map) {
      geoms = cam.poses.map((lm, i) => toGeom(smoothLm(i, lm), map, W, H, mirror)).filter(Boolean);
    } else {
      geoms = [fixedGeom(W, H)];
    }
    cam.el.classList.toggle('no-person', cam.poseState === 'ready' && geoms.length === 0);
    cam.el.classList.toggle('frame-mode', cam.poseState !== 'ready');

    if (geoms[0] && geoms[0].fixed) {
      // フレームモード：顔の位置の目安
      const g0 = geoms[0];
      ctx.save(); ctx.setLineDash([g0.headR * 0.25, g0.headR * 0.18]);
      ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = Math.max(2, g0.headR * 0.06);
      ctx.beginPath(); ctx.arc(g0.hc.x, g0.hc.y, g0.headR * 1.05, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    }
    if (c.parts) {
      geoms.forEach((g) => FX.drawParts(ctx, c, g));
    } else if (c.image) {
      FX.drawOfficial(ctx, c, geoms.find((g) => !g.fixed) || null, W, H);
    } else {
      geoms.forEach((g) => { if (c.back) c.back(ctx, g, t); });
      geoms.forEach((g) => { c.draw(ctx, g, t); });
    }
    // パーティクル
    if (c.particles && geoms.length) {
      const rate = (c.rate || 26) * geoms.length;
      let n = rate * dt;
      while (n > 0) { if (Math.random() < n && cam.particles.length < 120) cam.particles.push(FX.spawn(c.particles, geoms[Math.floor(Math.random() * geoms.length)], W, H)); n -= 1; }
    }
    cam.particles = cam.particles.filter((p) => {
      p.life += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
      if (p.type === 'petal' || p.type === 'feather') p.x += Math.sin(t * 2 + p.rot) * p.size * 0.05;
      return p.life < p.max;
    });
    cam.particles.forEach((p) => FX.drawParticle(ctx, p));
    FX.applyFilter(ctx, c.filter, W, H, t, canvas);
    if (c.overlay && c.overlay.complete && c.overlay.naturalWidth) ctx.drawImage(c.overlay, 0, 0, W, H);
    FX.drawFrame(ctx, c.frame, W, H);
  }

  /* ---------- 衣装レール ---------- */
  function renderRail() {
    const rail = $('#rail');
    const list = visibleCostumes().filter((c) => cam.cat === 'all' || c.cat === cam.cat);
    rail.innerHTML = list.map((c) => {
      const ok = isUnlocked(c);
      return `<li><button class="rail-item ${c.id === cam.selected ? 'is-selected' : ''} ${ok ? '' : 'is-locked'}" data-pick="${esc(c.id)}" aria-pressed="${c.id === cam.selected}" aria-label="${esc(c.name)}${ok ? '' : '（' + esc(lockLabel(c)) + '）'}">
        <span class="rail-ic" aria-hidden="true">${ic(c.icon)}</span>${ok ? '' : `<span class="rail-lock" aria-hidden="true">${LOCK}</span>`}
      </button></li>`;
    }).join('');
    const cur = costumeById(cam.selected);
    $('#cam-costume-name').textContent = cur ? cur.name : '';
    $$('.cat-chip').forEach((b) => b.setAttribute('aria-pressed', b.dataset.cat === cam.cat));
    const sel = rail.querySelector('.is-selected');
    if (sel) sel.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }

  /* ---------- 撮影 ---------- */
  async function shoot() {
    if (cam.busy || !cam.stream) return;
    cam.busy = true;
    const cd = $('#countdown');
    if (cam.timer) {
      for (let i = 3; i > 0; i--) {
        cd.textContent = i; cd.classList.remove('is-tick'); void cd.offsetWidth; cd.classList.add('is-tick');
        await new Promise((r) => setTimeout(r, 900));
      }
      cd.textContent = '';
    }
    const flash = $('#flash'); flash.classList.remove('is-on'); void flash.offsetWidth; flash.classList.add('is-on');
    const src = cam.canvas;
    const out = document.createElement('canvas');
    out.width = src.width; out.height = src.height;
    const o = out.getContext('2d');
    o.drawImage(src, 0, 0);
    drawBanner(o, out.width, out.height);
    out.toBlob((blob) => { cam.busy = false; if (blob) openPreview(blob); }, 'image/jpeg', 0.92);
  }
  function drawBanner(o, W, H) {
    const bh = Math.round(H * 0.085);
    const y = H - bh;
    const gr = o.createLinearGradient(0, y, W, H);
    gr.addColorStop(0, 'rgba(30,27,75,.88)'); gr.addColorStop(1, 'rgba(200,50,94,.88)');
    o.fillStyle = gr; o.fillRect(0, y, W, bh);
    o.fillStyle = '#FFFFFF'; o.textBaseline = 'middle';
    const pad = W * 0.045;
    let x = pad;
    if (logoOk) {
      const lh = bh * 0.5, lw = lh * (logo.naturalWidth / logo.naturalHeight);
      o.drawImage(logo, x, y + (bh - lh) / 2, lw, lh); x += lw + pad * 0.5;
    }
    o.font = `900 ${bh * 0.34}px "Zen Maru Gothic", sans-serif`;
    o.textAlign = 'left';
    o.fillText(CFG.eventName, x, y + bh * 0.38);
    o.font = `500 ${bh * 0.2}px "Zen Maru Gothic", sans-serif`;
    const d = new Date();
    o.fillText(`${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}  ${CFG.storeLabel}`, x, y + bh * 0.72);
    o.textAlign = 'right';
    o.font = `700 ${bh * 0.22}px "Zen Maru Gothic", sans-serif`;
    o.fillText(CFG.hashtag, W - pad, y + bh * 0.5);
  }

  let previewBlob = null, previewUrl = null;
  let previewMode = 'shot', previewKey = null;
  function openPreview(blob, opts = {}) {
    previewMode = opts.mode || 'shot'; previewKey = opts.key || null;
    previewBlob = blob;
    const album = previewMode === 'album';
    $('#btn-deco').hidden = album;
    $('#btn-memory').hidden = album;
    $('#btn-again').textContent = album ? 'とじる' : 'もう一回撮る';
    $('#preview-title').textContent = album ? `${dayLabel(previewKey)}の思い出` : '';
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = URL.createObjectURL(blob);
    $('#preview-img').src = previewUrl;
    const p = $('#preview'); p.hidden = false;
    const canShare = !!(navigator.canShare && navigator.canShare({ files: [new File([blob], 'x.jpg', { type: 'image/jpeg' })] }));
    $('#btn-share').hidden = !canShare;
    $('#preview-hint').textContent = canShare ? '「保存・シェア」で写真アプリに保存できるよ' : '保存できないときは、写真を長押ししてね';
  }
  function fileName() { const d = new Date(); return `narikiri-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${d.getHours()}${d.getMinutes()}${d.getSeconds()}.jpg`; }
  async function sharePhoto() {
    try {
      await navigator.share({ files: [new File([previewBlob], fileName(), { type: 'image/jpeg' })], text: CFG.hashtag });
    } catch (e) { if (e && e.name !== 'AbortError') toast('シェアできませんでした。「ダウンロード」をお試しください'); }
  }
  function downloadPhoto() {
    const a = document.createElement('a');
    a.href = previewUrl; a.download = fileName();
    document.body.appendChild(a); a.click(); a.remove();
    toast('写真を保存しました');
  }

  /* ---------- イベント ---------- */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('button, a');
    if (!t) return;
    if (t.dataset.view) { e.preventDefault(); showView(t.dataset.view); }
    if (t.dataset.open === 'camera') { e.preventDefault(); openCamera(); }
    if (t.dataset.costume) {
      const c = costumeById(t.dataset.costume);
      if (!isUnlocked(c)) { toast(lockLabel(c)); return; }
      openCamera(c.id);
    }
    if (t.dataset.pick) {
      const c = costumeById(t.dataset.pick);
      if (!isUnlocked(c)) { toast(lockLabel(c)); return; }
      cam.selected = c.id; cam.particles = []; renderRail();
    }
    if (t.dataset.cat) { cam.cat = t.dataset.cat; renderRail(); }
  });
  $('#btn-close').addEventListener('click', closeCamera);
  $('#btn-flip').addEventListener('click', async () => { cam.facing = cam.facing === 'user' ? 'environment' : 'user'; await startStream(); });
  $('#btn-timer').addEventListener('click', (e) => {
    cam.timer = !cam.timer;
    e.currentTarget.setAttribute('aria-pressed', cam.timer);
    toast(cam.timer ? '3秒タイマー：オン' : '3秒タイマー：オフ');
  });
  $('#btn-shutter').addEventListener('click', shoot);
  $('#btn-retry').addEventListener('click', () => { $('#cam-error').hidden = true; startStream(); });
  $('#btn-share').addEventListener('click', sharePhoto);
  $('#btn-download').addEventListener('click', downloadPhoto);
  $('#btn-again').addEventListener('click', () => { $('#preview').hidden = true; });
  $('#btn-memory').addEventListener('click', () => {
    const key = dayKey();
    if (!data.visits[key]) {
      modal(`<div class="stamp-pop is-halloween"><span aria-hidden="true">${ic('pumpkin')}</span></div><h2 class="modal-title">今日のスタンプがまだないよ</h2><p class="modal-text">売り場のQRを読むと今日のスタンプが押されて、お気に入り写真を登録できるようになるよ</p>`, [{ label: 'わかった', primary: true }]);
      return;
    }
    const doIt = async () => { if (await setMemory(key, previewBlob)) toast(`${dayLabel(key)}の思い出に登録しました`); };
    if (data.visits[key].photo) {
      modal('<h2 class="modal-title">今日の写真をこの写真にかえる？</h2><p class="modal-text">お気に入りは1日1まいだよ</p>', [{ label: 'かえる', primary: true, onClick: doIt }, { label: 'やめる' }]);
    } else doIt();
  });
  $('#btn-candy').addEventListener('click', () => {
    modal(`<h2 class="modal-title">スタッフの方へ</h2><p class="modal-text">${esc(RALLY.prize)}をお渡ししたら「お渡ししました」を押してください。もとに戻せません。</p>`, [
      { label: 'お渡ししました', primary: true, onClick: () => { data.candy = Date.now(); save(); renderStamps(); toast('受け取りずみにしました'); } },
      { label: 'もどる' }
    ]);
  });
  document.addEventListener('change', async (e) => {
    const inp = e.target;
    if (!inp.matches || !inp.matches('input[type="file"]')) return;
    const f = inp.files && inp.files[0];
    inp.value = '';
    if (!f) return;
    if (inp.dataset.albumDate) {
      if (await setMemory(inp.dataset.albumDate, f)) toast(`${dayLabel(inp.dataset.albumDate)}の思い出に登録しました`);
    } else openEditor(f);
  });
  document.addEventListener('click', async (e) => {
    const m = e.target.closest('[data-memory]');
    if (m) {
      try { const b = await photoDB.get(m.dataset.memory); if (b) openPreview(b, { mode: 'album', key: m.dataset.memory }); } catch (err) { toast('写真を開けませんでした'); }
    }
    if (e.target.closest('[data-collab-info]')) toast('お買い上げのお客さまにレジでお渡しするQRで使えるようになります');
  });
  const openEditor = (src) => window.NRL_Editor.open(src, {
    onDone: (blob) => openPreview(blob), can: canUse,
    onError: () => toast('写真を読み込めませんでした。別の写真をえらんでください')
  });
  $('#btn-deco').addEventListener('click', () => { $('#preview').hidden = true; openEditor(previewBlob); });
  window.NRL_toast = toast;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!$('#modal').hidden) closeModal();
      else if (!$('#preview').hidden) $('#preview').hidden = true;
      else if (!$('#editor').hidden) window.NRL_Editor.close();
      else if (!cam.el.hidden) closeCamera();
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && cam.stream) { cam.stream.getTracks().forEach((t) => t.stop()); cam.stream = null; }
    else if (!document.hidden && !cam.el.hidden && !cam.stream) startStream();
  });

  /* ---------- 初期化 ---------- */
  function renderAll() { renderStamps(); renderGallery(); if (!cam.el.hidden) renderRail(); }
  $$('[data-event-name]').forEach((el) => { el.textContent = CFG.eventName; });
  $$('[data-store]').forEach((el) => { el.textContent = CFG.storeLabel; });
  $$('[data-hashtag]').forEach((el) => { el.textContent = CFG.hashtag; });
  if (CFG.period) $$('[data-period]').forEach((el) => { el.textContent = CFG.period; el.hidden = false; });
  $$('[data-art]').forEach((el) => { el.innerHTML = ic(el.dataset.art); });
  $$('[data-sticker-art]').forEach((el) => { const st = ART.stickers.find((x) => x.id === el.dataset.stickerArt); if (st) el.innerHTML = st.svg; });
  renderAll();
  loadMemories();
  handleQuery();
})();
