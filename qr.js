/* QRコード印刷シート */
(() => {
  'use strict';
  const CFG = window.NRL_CONFIG;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function defaultBase() {
    if (CFG.baseUrl) return CFG.baseUrl;
    return location.origin + location.pathname.replace(/qr\.html$/, '');
  }
  function urlFor(base, spot) {
    const b = base.endsWith('/') ? base : base + '/';
    return `${b}?s=${encodeURIComponent(spot.token)}`;
  }
  function makeQr(text) {
    const q = qrcode(0, 'M');
    q.addData(text);
    q.make();
    return q;
  }
  function qrSvg(q) {
    const n = q.getModuleCount(), m = 4, size = n + m * 2;
    let d = '';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c + m} ${r + m}h1v1h-1z`;
    return `<svg viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" role="img" aria-label="QRコード"><rect width="${size}" height="${size}" fill="#fff"/><path d="${d}" fill="#2A2550"/></svg>`;
  }
  function qrPng(q, label) {
    const n = q.getModuleCount(), m = 4, cell = 24, size = (n + m * 2) * cell, foot = 120;
    const c = document.createElement('canvas');
    c.width = size; c.height = size + foot;
    const x = c.getContext('2d');
    x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = '#1E1B4B';
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) x.fillRect((k + m) * cell, (r + m) * cell, cell, cell);
    x.font = '700 56px "Zen Maru Gothic", sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(label, size / 2, size + foot / 2 - 10);
    return c.toDataURL('image/png');
  }

  function build() {
    const base = $('#base').value.trim() || defaultBase();
    const sheet = $('#sheet');
    const links = $('#links');
    sheet.innerHTML = ''; links.innerHTML = '';
    CFG.spots.forEach((s) => {
      const url = urlFor(base, s);
      const q = makeQr(url);
      const isStage = s.id === 'stage';
      const card = document.createElement('article');
      card.className = 'qcard' + (isStage ? ' stage' : '');
      card.style.setProperty('--c', s.color);
      card.innerHTML = `
        <span class="ic" aria-hidden="true">${window.NRL_ART.icon(s.icon)}</span>
        <h2>${isStage ? 'この円の中に立ってね' : esc(s.name)}</h2>
        <p class="place">${isStage ? 'おうちの人がスマホで読み取ると、なりきりカメラがひらくよ' : esc(s.place)}</p>
        <div class="qr">${qrSvg(q)}</div>
        <p class="how">${isStage ? 'スマホのカメラでよみとってね' : 'よみとってハロウィンスタンプゲット！'}</p>
        <p class="gift">スタンプは1日1こ。${CFG.rally ? CFG.rally.goal : 3}回あつめると${esc(CFG.rally ? CFG.rally.prize : 'プレゼント')}がもらえるよ</p>
        <p class="ev">${esc(CFG.eventName)}｜${esc(CFG.storeLabel)}</p>
        <button class="dl" type="button">PNGで保存</button>`;
      card.querySelector('.dl').addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = qrPng(q, s.name); a.download = `qr-${s.id}.png`;
        document.body.appendChild(a); a.click(); a.remove();
      });
      sheet.appendChild(card);
      links.insertAdjacentHTML('beforeend', `<p>${esc(s.icon)} ${esc(s.name)}：<a href="${esc(url)}" target="_blank" rel="noopener">${esc(url)}</a></p>`);
    });
    const COL = CFG.collab && CFG.collab.enabled ? CFG.collab : null;
    if (COL) (COL.tokens || []).forEach((tk, i) => {
      const b2 = base.endsWith('/') ? base : base + '/';
      const url = `${b2}?p=${encodeURIComponent(tk)}`;
      const q = makeQr(url);
      const card = document.createElement('article');
      card.className = 'qcard buy';
      card.style.setProperty('--c', '#E0457B');
      card.innerHTML = `
        <span class="ic" aria-hidden="true">${window.NRL_ART.icon('gift')}</span>
        <h2>お買い上げありがとうございます</h2>
        <p class="place">レジでお渡しする購入者限定QR</p>
        <div class="qr">${qrSvg(q)}</div>
        <p class="how">よみとると${esc(COL.label)}の衣装とフレームが使えるよ</p>
        <p class="ev">${esc(CFG.eventName)}｜${esc(CFG.storeLabel)}</p>
        <button class="dl" type="button">PNGで保存</button>`;
      card.querySelector('.dl').addEventListener('click', () => {
        const a = document.createElement('a'); a.href = qrPng(q, '購入者限定'); a.download = `qr-purchase-${i + 1}.png`;
        document.body.appendChild(a); a.click(); a.remove();
      });
      sheet.appendChild(card);
      links.insertAdjacentHTML('beforeend', `<p>購入者限定QR：<a href="${esc(url)}" target="_blank" rel="noopener">${esc(url)}</a></p>`);
    });
    links.insertAdjacentHTML('beforeend', `<p>スタンプのリセット：<a href="${esc(base.replace(/\/?$/, '/'))}?reset=1" target="_blank" rel="noopener">${esc(base.replace(/\/?$/, '/'))}?reset=1</a></p>`);
  }

  $('#base').value = defaultBase();
  $('#make').addEventListener('click', build);
  $('#print').addEventListener('click', () => window.print());
  build();
})();
