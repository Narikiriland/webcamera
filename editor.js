/* ==========================================================
   写真デコ：撮った写真や写真フォルダの写真に、スタンプとフレームをつける
   ・指1本でうごかす／指2本で大きさと向き
   ・写真はスマホの中だけで処理
   ========================================================== */
(function () {
  'use strict';
  const ART = window.NRL_ART;
  const FX = window.NRL_FX;
  const CFG = window.NRL_CONFIG;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const TAU = Math.PI * 2;
  const MAX = 1600;

  const st = {
    base: null, canvas: null, ctx: null, stickers: [], sel: -1, frame: 'none', tab: 'stickers',
    pointers: new Map(), gesture: null, dirty: true, running: false, onDone: null, can: () => true
  };

  /* ---------- スタンプの一覧 ---------- */
  const STICKERS = ART.stickers.map((s) => ({ id: s.id, name: s.name, img: ART.toImage(s.svg), w: s.w, thumb: s.svg }));
  (CFG.officialStickers || []).forEach((o) => {
    const img = new Image();
    const item = { id: o.id, name: o.name, img, w: o.w || 0.35, src: o.src, official: true, ok: false };
    img.onload = () => { item.ok = true; img.aspect = img.naturalWidth / img.naturalHeight; if (!$('#editor').hidden) renderTray(); };
    img.src = o.src;
    STICKERS.unshift(item);
  });
  const COLLAB = CFG.collab && CFG.collab.enabled ? CFG.collab : null;
  if (COLLAB) (COLLAB.stickers || []).forEach((o) => {
    const img = new Image();
    const item = { id: o.id, name: o.name, img, w: o.w || 0.35, src: o.src, official: true, ok: false, lock: 'purchase' };
    img.onload = () => { item.ok = true; img.aspect = img.naturalWidth / img.naturalHeight; if (!$('#editor').hidden) renderTray(); };
    img.src = o.src;
    STICKERS.unshift(item);
  });

  /* ---------- フレーム ---------- */
  const img = (key) => ART.toImage(ART.icons[key]);
  function put(ctx, im, x, y, w, rot = 0) {
    if (!im.complete || !im.naturalWidth) return;
    const h = w / (im.aspect || 1);
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.drawImage(im, -w / 2, -h / 2, w, h); ctx.restore();
  }
  function rrSub(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function ringPath(ctx, W, H, b, r) {
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    rrSub(ctx, b, b, W - b * 2, H - b * 2, r);
  }
  function borderFill(ctx, W, H, b, r, fill) {
    ctx.save();
    ringPath(ctx, W, H, b, r);
    ctx.fillStyle = fill; ctx.fill('evenodd');
    ctx.strokeStyle = ART.ink; ctx.lineWidth = Math.max(2, b * 0.08);
    FX.shapes.rr(ctx, b, b, W - b * 2, H - b * 2, r); ctx.stroke();
    ctx.restore();
  }
  function dateText() { const d = new Date(); return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`; }
  const FRAMES = [
    { id: 'none', name: 'なし', draw() {} },
    {
      id: 'halloween', name: 'ハロウィン', draw(ctx, W, H) {
        const s = Math.min(W, H), b = s * 0.065;
        borderFill(ctx, W, H, b, s * 0.05, '#FFA94D');
        ctx.save(); ctx.fillStyle = '#7A5BC7';
        const step = b * 1.2;
        for (let x = step / 2; x < W; x += step) { ctx.beginPath(); ctx.arc(x, b * 0.5, b * 0.13, 0, TAU); ctx.arc(x, H - b * 0.5, b * 0.13, 0, TAU); ctx.fill(); }
        ctx.restore();
        put(ctx, img('pumpkin'), b * 1.3, H - b * 1.3, s * 0.22, -0.15);
        put(ctx, img('pumpkin'), W - b * 1.2, H - b * 1.1, s * 0.15, 0.2);
        put(ctx, img('bat'), W - b * 1.7, b * 1.5, s * 0.17, 0.2);
        put(ctx, img('bat'), b * 3.2, b * 0.9, s * 0.11, -0.2);
        put(ctx, img('candy'), W / 2, H - b * 0.5, s * 0.12, 0.3);
        ctx.save();
        ctx.fillStyle = '#fff'; ctx.strokeStyle = ART.ink; ctx.lineWidth = b * 0.18; ctx.lineJoin = 'round';
        ctx.font = `900 ${b * 0.62}px "Yusei Magic", "Zen Maru Gothic", sans-serif`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.strokeText('Happy Halloween', b * 1.1, b * 0.55); ctx.fillText('Happy Halloween', b * 1.1, b * 0.55);
        ctx.restore();
      }
    },
    {
      id: 'night', name: 'おばけの夜', draw(ctx, W, H) {
        const s = Math.min(W, H), b = s * 0.065;
        const gr = ctx.createLinearGradient(0, 0, 0, H);
        gr.addColorStop(0, '#3B2A7A'); gr.addColorStop(1, '#7A5BC7');
        borderFill(ctx, W, H, b, s * 0.05, gr);
        ctx.save(); ctx.fillStyle = '#FFE58A';
        for (let i = 0; i < 26; i++) {
          const x = (i * 97) % W, y = (i * 53) % H;
          if (x > b && x < W - b && y > b && y < H - b) continue;
          FX.shapes.sparklePath(ctx, x, y, b * 0.14); ctx.fill();
        }
        ctx.restore();
        put(ctx, img('moon'), W - b * 1.6, b * 1.6, s * 0.2, 0);
        put(ctx, img('ghost'), b * 1.3, H * 0.62, s * 0.16, -0.15);
        put(ctx, img('ghost'), W - b * 1.1, H * 0.78, s * 0.12, 0.2);
        put(ctx, img('blackcat'), b * 1.5, H - b * 1.4, s * 0.17, 0);
      }
    },
    {
      id: 'cheki', name: 'チェキ', draw(ctx, W, H) {
        const s = Math.min(W, H), b = s * 0.05, bb = s * 0.2;
        ctx.save();
        ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.rect(b, b, W - b * 2, H - b - bb);
        ctx.fillStyle = '#FFFDF8'; ctx.fill('evenodd');
        ctx.fillStyle = ART.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = `900 ${bb * 0.26}px "Yusei Magic", "Zen Maru Gothic", sans-serif`;
        ctx.fillText(CFG.eventName, W / 2, H - bb * 0.6);
        ctx.font = `700 ${bb * 0.16}px "Zen Maru Gothic", sans-serif`; ctx.fillStyle = '#8A84B0';
        ctx.fillText(`${dateText()}  ${CFG.hashtag}`, W / 2, H - bb * 0.28);
        ctx.restore();
        put(ctx, img('heart'), W - b * 2.2, H - bb * 0.6, bb * 0.36, 0.2);
        put(ctx, img('star'), b * 2.2, H - bb * 0.6, bb * 0.36, -0.2);
      }
    },
    {
      id: 'rose', name: 'ローズ', draw(ctx, W, H) {
        const s = Math.min(W, H), b = s * 0.06;
        borderFill(ctx, W, H, b, s * 0.05, '#FFC2D6');
        ctx.save(); ctx.fillStyle = '#fff';
        for (let x = b; x < W; x += b * 1.4) { ctx.beginPath(); ctx.arc(x, b * 0.5, b * 0.12, 0, TAU); ctx.arc(x, H - b * 0.5, b * 0.12, 0, TAU); ctx.fill(); }
        ctx.restore();
        const rs = s * 0.2;
        put(ctx, img('rose'), b * 1.2, b * 1.2, rs, -0.3);
        put(ctx, img('rose'), W - b * 1.2, b * 1.2, rs * 0.8, 0.3);
        put(ctx, img('rose'), b * 1.2, H - b * 1.2, rs * 0.8, -0.2);
        put(ctx, img('rose'), W - b * 1.2, H - b * 1.2, rs, 0.25);
        put(ctx, img('heart'), W - b * 3.2, b * 0.8, rs * 0.35, 0.2);
      }
    },
    {
      id: 'holo', name: '近未来', draw(ctx, W, H) {
        const s = Math.min(W, H), b = s * 0.055;
        const gr = ctx.createLinearGradient(0, 0, W, H);
        gr.addColorStop(0, '#FF9BD0'); gr.addColorStop(0.35, '#FFE58A'); gr.addColorStop(0.65, '#7CF0F5'); gr.addColorStop(1, '#C3A6FF');
        borderFill(ctx, W, H, b, s * 0.06, gr);
        put(ctx, img('sparkle'), W - b * 1.6, b * 1.6, s * 0.16, 0.1);
        put(ctx, img('rocket'), b * 1.7, H - b * 1.9, s * 0.16, 0.5);
        put(ctx, img('hologram'), b * 1.4, b * 1.5, s * 0.12, 0);
        ctx.save();
        ctx.fillStyle = ART.ink; ctx.font = `900 ${b * 0.5}px "Zen Maru Gothic", sans-serif`; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText('KINMIRAI NARIKIRI LAND', W - b * 1.2, H - b * 0.5);
        ctx.restore();
      }
    },
    {
      id: 'dots', name: 'ドット', draw(ctx, W, H) {
        const s = Math.min(W, H), b = s * 0.06;
        borderFill(ctx, W, H, b, s * 0.05, '#FF7BA9');
        ctx.save(); ctx.fillStyle = '#fff';
        const step = b * 0.9;
        for (let y = step / 2; y < H; y += step) for (let x = ((y / step) % 2 ? step / 2 : 0); x < W; x += step) {
          if (x > b && x < W - b && y > b && y < H - b) continue;
          ctx.beginPath(); ctx.arc(x, y, b * 0.13, 0, TAU); ctx.fill();
        }
        ctx.restore();
        put(ctx, img('ribbon'), W / 2, b * 0.9, s * 0.2, 0);
      }
    },
    {
      id: 'book', name: '絵本', draw(ctx, W, H) {
        const s = Math.min(W, H), b = s * 0.065;
        borderFill(ctx, W, H, b, s * 0.03, '#BFEDE2');
        ctx.save(); ctx.fillStyle = '#fff';
        const sc = b * 0.55;
        for (let x = b; x < W - b; x += sc * 1.6) { ctx.beginPath(); ctx.arc(x + sc * 0.8, b, sc * 0.5, Math.PI, 0); ctx.fill(); ctx.beginPath(); ctx.arc(x + sc * 0.8, H - b, sc * 0.5, 0, Math.PI); ctx.fill(); }
        ctx.restore();
        const lw = W * 0.56, lh = b * 1.2;
        ctx.save();
        ctx.fillStyle = '#FFD66B'; ctx.strokeStyle = ART.ink; ctx.lineWidth = Math.max(2, b * 0.08);
        FX.shapes.rr(ctx, (W - lw) / 2, b * 0.35, lw, lh, lh / 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = ART.ink; ctx.font = `900 ${lh * 0.42}px "Yusei Magic", "Zen Maru Gothic", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('ものがたりの主人公', W / 2, b * 0.35 + lh / 2);
        ctx.restore();
        put(ctx, img('book'), b * 1.5, H - b * 1.6, s * 0.15, -0.2);
        put(ctx, img('wand'), W - b * 1.6, H - b * 1.8, s * 0.16, 0.2);
      }
    },
    { id: 'museum', name: '名画', draw(ctx, W, H) { FX.drawFrame(ctx, 'museum', W, H); } },
    {
      id: 'gold', name: 'クリア記念', lock: 'complete', draw(ctx, W, H) {
        const s = Math.min(W, H), b = s * 0.06;
        const gr = ctx.createLinearGradient(0, 0, W, H);
        gr.addColorStop(0, '#FFF1B8'); gr.addColorStop(0.5, '#FFB938'); gr.addColorStop(1, '#FFE58A');
        borderFill(ctx, W, H, b, s * 0.05, gr);
        put(ctx, img('crown-gold'), W / 2, b * 1.1, s * 0.24, 0);
        put(ctx, img('sparkle'), b * 1.4, H - b * 1.4, s * 0.12, 0);
        put(ctx, img('sparkle'), W - b * 1.4, b * 1.6, s * 0.1, 0.3);
      }
    }
  ];

  if (COLLAB) (COLLAB.frames || []).forEach((o) => {
    const im = new Image();
    const f = { id: o.id, name: o.name, lock: 'purchase', official: true, ok: false, draw(ctx, W, H) { if (im.complete && im.naturalWidth) ctx.drawImage(im, 0, 0, W, H); } };
    im.onload = () => { f.ok = true; if (!$('#editor').hidden) renderTray(); };
    im.src = o.src;
    FRAMES.push(f);
  });

  /* ---------- 描画 ---------- */
  function render(exporting) {
    const { ctx, canvas } = st;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(st.base, 0, 0, W, H);
    const f = FRAMES.find((x) => x.id === st.frame);
    if (f) f.draw(ctx, W, H);
    st.stickers.forEach((s, i) => {
      const h = s.w / (s.img.aspect || 1);
      ctx.save();
      ctx.translate(s.x, s.y); ctx.rotate(s.rot); ctx.scale(s.flip ? -1 : 1, 1);
      if (s.img.complete && s.img.naturalWidth) ctx.drawImage(s.img, -s.w / 2, -h / 2, s.w, h);
      if (!exporting && i === st.sel) {
        ctx.setLineDash([W * 0.012, W * 0.008]);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = Math.max(2, W * 0.005);
        ctx.strokeRect(-s.w / 2 - 6, -h / 2 - 6, s.w + 12, h + 12);
        ctx.strokeStyle = ART.ink; ctx.lineDashOffset = W * 0.01;
        ctx.strokeRect(-s.w / 2 - 6, -h / 2 - 6, s.w + 12, h + 12);
      }
      ctx.restore();
    });
  }
  function loop() {
    if (!st.running) return;
    requestAnimationFrame(loop);
    if (st.dirty) { st.dirty = false; render(false); }
  }
  const mark = () => { st.dirty = true; };

  /* ---------- 画面サイズに合わせる ---------- */
  function fit() {
    const box = $('#ed-stage');
    const bw = box.clientWidth - 24, bh = box.clientHeight - 24;
    const a = st.canvas.width / st.canvas.height;
    let w = bw, h = bw / a;
    if (h > bh) { h = bh; w = bh * a; }
    st.canvas.style.width = `${w}px`; st.canvas.style.height = `${h}px`;
  }

  /* ---------- 操作 ---------- */
  function toCanvas(e) {
    const r = st.canvas.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * st.canvas.width) / r.width, y: ((e.clientY - r.top) * st.canvas.height) / r.height };
  }
  function hit(p) {
    for (let i = st.stickers.length - 1; i >= 0; i--) {
      const s = st.stickers[i];
      const h = s.w / (s.img.aspect || 1);
      const dx = p.x - s.x, dy = p.y - s.y;
      const lx = dx * Math.cos(-s.rot) - dy * Math.sin(-s.rot);
      const ly = dx * Math.sin(-s.rot) + dy * Math.cos(-s.rot);
      const pad = st.canvas.width * 0.02;
      if (Math.abs(lx) < s.w / 2 + pad && Math.abs(ly) < h / 2 + pad) return i;
    }
    return -1;
  }
  function startGesture() {
    const s = st.stickers[st.sel];
    if (!s) { st.gesture = null; return; }
    const pts = [...st.pointers.values()];
    const g = { x: s.x, y: s.y, w: s.w, rot: s.rot, p: pts.map((p) => ({ ...p })) };
    if (pts.length >= 2) {
      g.d = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      g.a = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);
      g.m = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
    }
    st.gesture = g;
  }
  function onDown(e) {
    st.canvas.setPointerCapture(e.pointerId);
    const p = toCanvas(e);
    st.pointers.set(e.pointerId, p);
    if (st.pointers.size === 1) {
      const i = hit(p);
      if (i >= 0) {
        const [s] = st.stickers.splice(i, 1); st.stickers.push(s); st.sel = st.stickers.length - 1;
      } else st.sel = -1;
      updateTools();
    }
    startGesture(); mark();
  }
  function onMove(e) {
    if (!st.pointers.has(e.pointerId)) return;
    st.pointers.set(e.pointerId, toCanvas(e));
    const g = st.gesture, s = st.stickers[st.sel];
    if (!g || !s) return;
    const pts = [...st.pointers.values()];
    if (pts.length >= 2 && g.d) {
      const d = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      const a = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);
      const m = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      s.w = Math.max(st.canvas.width * 0.04, Math.min(st.canvas.width * 2, g.w * (d / g.d)));
      s.rot = g.rot + (a - g.a);
      s.x = g.x + (m.x - g.m.x); s.y = g.y + (m.y - g.m.y);
    } else if (pts.length === 1) {
      s.x = g.x + (pts[0].x - g.p[0].x); s.y = g.y + (pts[0].y - g.p[0].y);
    }
    mark();
  }
  function onUp(e) {
    st.pointers.delete(e.pointerId);
    startGesture();
  }
  function onWheel(e) {
    const s = st.stickers[st.sel];
    if (!s) return;
    e.preventDefault();
    s.w *= e.deltaY < 0 ? 1.06 : 0.94; mark();
  }

  /* ---------- トレイ ---------- */
  function frameThumb(f) {
    const c = document.createElement('canvas');
    c.width = 120; c.height = 150;
    const x = c.getContext('2d');
    const gr = x.createLinearGradient(0, 0, 0, 150);
    gr.addColorStop(0, '#E9E4FF'); gr.addColorStop(1, '#FFE3EE');
    x.fillStyle = gr; x.fillRect(0, 0, 120, 150);
    try { f.draw(x, 120, 150); } catch (e) { /* noop */ }
    return c.toDataURL('image/png');
  }
  function renderTray() {
    const tray = $('#ed-tray');
    if (st.tab === 'stickers') {
      tray.className = 'ed-tray is-stickers';
      tray.innerHTML = STICKERS.filter((s) => !s.official || s.ok).map((s) => `
        <li><button class="ed-item ${s.lock && !st.can(s.lock) ? 'is-locked' : ''}" data-sticker="${esc(s.id)}" aria-label="${esc(s.name)}をはる">
          ${s.official ? `<img src="${esc(s.src)}" alt="">` : `<span class="ed-svg">${s.thumb}</span>`}
        </button></li>`).join('');
    } else {
      tray.className = 'ed-tray is-frames';
      tray.innerHTML = FRAMES.filter((f) => !f.official || f.ok).map((f) => {
        const locked = f.lock && !st.can(f.lock);
        return `<li><button class="ed-frame ${st.frame === f.id ? 'is-selected' : ''} ${locked ? 'is-locked' : ''}" data-frame="${esc(f.id)}" aria-pressed="${st.frame === f.id}">
          <img src="${frameThumb(f)}" alt=""><span>${esc(f.name)}</span></button></li>`;
      }).join('');
    }
    document.querySelectorAll('[data-edtab]').forEach((b) => b.setAttribute('aria-selected', b.dataset.edtab === st.tab));
  }
  function updateTools() {
    $('#ed-tools').hidden = st.sel < 0;
    $('#ed-hint').hidden = st.sel >= 0;
  }
  function addSticker(id) {
    const def = STICKERS.find((s) => s.id === id);
    if (!def) return;
    if (def.lock && !st.can(def.lock)) { window.NRL_toast && window.NRL_toast('お買い上げのお客さま限定のスタンプです'); return; }
    const W = st.canvas.width, H = st.canvas.height;
    const n = st.stickers.length;
    st.stickers.push({ img: def.img, x: W / 2 + ((n % 3) - 1) * W * 0.06, y: H * 0.4 + ((n % 4) - 1.5) * H * 0.04, w: Math.min(W, H) * def.w * 1.4, rot: 0, flip: false });
    st.sel = st.stickers.length - 1;
    updateTools(); mark();
  }

  /* ---------- 開く・保存 ---------- */
  function loadImage(src) {
    return new Promise((res, rej) => {
      const im = new Image();
      im.onload = () => res(im); im.onerror = rej;
      im.src = src;
    });
  }
  async function open(source, opts = {}) {
    st.onDone = opts.onDone; st.can = opts.can || (() => true);
    const url = typeof source === 'string' ? source : URL.createObjectURL(source);
    let im;
    try { im = await loadImage(url); } catch (e) { opts.onError && opts.onError(); return; }
    const k = Math.min(1, MAX / Math.max(im.naturalWidth, im.naturalHeight));
    const base = document.createElement('canvas');
    base.width = Math.round(im.naturalWidth * k); base.height = Math.round(im.naturalHeight * k);
    base.getContext('2d').drawImage(im, 0, 0, base.width, base.height);
    st.base = base;
    st.canvas = $('#ed-canvas'); st.ctx = st.canvas.getContext('2d');
    st.canvas.width = base.width; st.canvas.height = base.height;
    st.stickers = []; st.sel = -1; st.frame = 'none'; st.tab = 'stickers';
    $('#editor').hidden = false;
    document.body.classList.add('cam-open');
    renderTray(); updateTools();
    requestAnimationFrame(fit);
    st.running = true; mark(); loop();
  }
  function close() {
    st.running = false;
    $('#editor').hidden = true;
    if ($('#camera').hidden) document.body.classList.remove('cam-open');
  }
  function save() {
    render(true);
    st.canvas.toBlob((blob) => {
      mark();
      if (blob && st.onDone) { close(); st.onDone(blob); }
    }, 'image/jpeg', 0.92);
  }

  /* ---------- イベント ---------- */
  document.addEventListener('DOMContentLoaded', init);
  if (document.readyState !== 'loading') init();
  let inited = false;
  function init() {
    if (inited || !$('#editor')) return;
    inited = true;
    const c = $('#ed-canvas');
    c.addEventListener('pointerdown', onDown);
    c.addEventListener('pointermove', onMove);
    c.addEventListener('pointerup', onUp);
    c.addEventListener('pointercancel', onUp);
    c.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', () => { if (!$('#editor').hidden) fit(); });
    $('#ed-close').addEventListener('click', close);
    $('#ed-save').addEventListener('click', save);
    $('#editor').addEventListener('click', (e) => {
      const t = e.target.closest('button');
      if (!t) return;
      if (t.dataset.edtab) { st.tab = t.dataset.edtab; renderTray(); }
      if (t.dataset.sticker) addSticker(t.dataset.sticker);
      if (t.dataset.frame) {
        const f = FRAMES.find((x) => x.id === t.dataset.frame);
        if (f.lock && !st.can(f.lock)) { window.NRL_toast && window.NRL_toast(f.lock === 'purchase' ? 'お買い上げのお客さま限定のフレームです' : 'スタンプラリーをクリアすると使えるよ'); return; }
        st.frame = f.id; renderTray(); mark();
      }
      const s = st.stickers[st.sel];
      if (t.dataset.tool && s) {
        const W = st.canvas.width;
        if (t.dataset.tool === 'smaller') s.w = Math.max(W * 0.04, s.w * 0.85);
        if (t.dataset.tool === 'bigger') s.w = Math.min(W * 2, s.w * 1.18);
        if (t.dataset.tool === 'turn') s.rot += Math.PI / 12;
        if (t.dataset.tool === 'flip') s.flip = !s.flip;
        if (t.dataset.tool === 'delete') { st.stickers.splice(st.sel, 1); st.sel = -1; updateTools(); }
        mark();
      }
    });
  }

  window.NRL_Editor = { open, close };
})();
