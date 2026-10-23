/* ==========================================================
   なりきり衣装 ― すべてオリジナルのベクター描画
   童話（白雪姫・シンデレラ・アリス・ピーターパン）は原作のモチーフのみを使い、
   映画版など特定の作品のデザイン（配色・髪飾り・帽子など）は避けています。
   ========================================================== */
(function () {
  'use strict';
  const TAU = Math.PI * 2;

  /* ---------- 乱数（毎フレーム同じ柄になるよう固定シード） ---------- */
  function seeded(seed) {
    let s = seed;
    return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }
  const PATTERN = (() => { const r = seeded(42); const a = []; for (let i = 0; i < 24; i++) a.push([r() * 2 - 1, 0.1 + r() * 0.85, r()]); return a; })();

  /* ---------- 形 ---------- */
  function starPath(ctx, x, y, r, n = 5, inner = 0.45) {
    ctx.beginPath();
    for (let i = 0; i < n * 2; i++) {
      const rr = i % 2 ? r * inner : r;
      const a = -Math.PI / 2 + (i * Math.PI) / n;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
  }
  function heartPath(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.4);
    ctx.bezierCurveTo(x + s * 1.05, y - s * 0.3, x + s * 0.5, y - s * 1.05, x, y - s * 0.42);
    ctx.bezierCurveTo(x - s * 0.5, y - s * 1.05, x - s * 1.05, y - s * 0.3, x, y + s * 0.4);
    ctx.closePath();
  }
  function sparklePath(ctx, x, y, r) {
    ctx.beginPath();
    ctx.moveTo(x, y - r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.quadraticCurveTo(x, y, x, y + r);
    ctx.quadraticCurveTo(x, y, x - r, y);
    ctx.quadraticCurveTo(x, y, x, y - r);
    ctx.closePath();
  }
  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function drawApple(ctx, x, y, r) {
    ctx.fillStyle = '#D62839';
    ctx.beginPath(); ctx.arc(x - r * 0.3, y, r * 0.68, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.arc(x + r * 0.3, y, r * 0.68, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.beginPath(); ctx.ellipse(x - r * 0.45, y - r * 0.2, r * 0.14, r * 0.24, -0.4, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#6B3E1E'; ctx.lineWidth = r * 0.12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y - r * 0.55); ctx.lineTo(x + r * 0.08, y - r * 0.95); ctx.stroke();
    drawLeaf(ctx, x + r * 0.1, y - r * 0.8, r * 0.6, -0.5, '#3A8D4F');
  }
  function drawLeaf(ctx, x, y, len, ang, c) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    ctx.fillStyle = c;
    ctx.beginPath(); ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(len * 0.5, -len * 0.38, len, 0);
    ctx.quadraticCurveTo(len * 0.5, len * 0.38, 0, 0);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = Math.max(1, len * 0.05);
    ctx.beginPath(); ctx.moveTo(len * 0.1, 0); ctx.lineTo(len * 0.85, 0); ctx.stroke();
    ctx.restore();
  }
  function drawRose(ctx, x, y, r, c = '#E0457B', d = '#9E1F4A') {
    ctx.fillStyle = c;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    ctx.strokeStyle = d; ctx.lineWidth = r * 0.14; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(x + r * 0.06 * i, y - r * 0.04 * i, r * (0.78 - i * 0.24), 0.3 + i * 1.7, 0.3 + i * 1.7 + 4.2);
      ctx.stroke();
    }
  }
  function drawPumpkin(ctx, x, y, r, face = true) {
    ctx.save();
    ctx.fillStyle = '#FFA94D'; ctx.strokeStyle = '#2A2550'; ctx.lineWidth = Math.max(1, r * 0.12);
    ctx.beginPath(); ctx.ellipse(x - r * 0.35, y, r * 0.6, r * 0.8, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x + r * 0.35, y, r * 0.6, r * 0.8, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x, y, r * 0.55, r * 0.82, 0, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = '#3E8A57'; ctx.lineWidth = r * 0.18; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y - r * 0.75); ctx.lineTo(x + r * 0.12, y - r * 1.05); ctx.stroke();
    if (face) {
      ctx.fillStyle = '#2A2550';
      for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + d * r * 0.3 - r * 0.12, y - r * 0.05); ctx.lineTo(x + d * r * 0.3, y - r * 0.3); ctx.lineTo(x + d * r * 0.3 + r * 0.12, y - r * 0.05); ctx.fill(); }
      ctx.strokeStyle = '#2A2550'; ctx.lineWidth = r * 0.1;
      ctx.beginPath(); ctx.arc(x, y + r * 0.1, r * 0.3, 0.3, Math.PI - 0.3); ctx.stroke();
    }
    ctx.restore();
  }
  function drawBat(ctx, x, y, s, c = '#4A4280') {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.2);
    ctx.quadraticCurveTo(-s * 0.6, -s * 0.7, -s * 1.2, -s * 0.3);
    ctx.quadraticCurveTo(-s * 0.9, -s * 0.1, -s * 0.95, s * 0.2);
    ctx.quadraticCurveTo(-s * 0.6, 0, -s * 0.45, s * 0.25);
    ctx.quadraticCurveTo(-s * 0.2, s * 0.05, 0, s * 0.35);
    ctx.quadraticCurveTo(s * 0.2, s * 0.05, s * 0.45, s * 0.25);
    ctx.quadraticCurveTo(s * 0.6, 0, s * 0.95, s * 0.2);
    ctx.quadraticCurveTo(s * 0.9, -s * 0.1, s * 1.2, -s * 0.3);
    ctx.quadraticCurveTo(s * 0.6, -s * 0.7, 0, -s * 0.2);
    ctx.fill();
    ctx.beginPath(); ctx.moveTo(-s * 0.2, -s * 0.15); ctx.lineTo(-s * 0.15, -s * 0.45); ctx.lineTo(0, -s * 0.25); ctx.lineTo(s * 0.15, -s * 0.45); ctx.lineTo(s * 0.2, -s * 0.15); ctx.fill();
    ctx.restore();
  }
  function drawGhost(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.strokeStyle = '#2A2550'; ctx.lineWidth = Math.max(1, s * 0.08);
    ctx.beginPath(); ctx.moveTo(-s * 0.5, s * 0.6); ctx.lineTo(-s * 0.5, 0); ctx.arc(0, 0, s * 0.5, Math.PI, 0); ctx.lineTo(s * 0.5, s * 0.6);
    for (let i = 0; i < 3; i++) { const x0 = s * 0.5 - (i + 0.5) * s / 3; ctx.quadraticCurveTo(x0 + s / 6, s * 0.4, x0, s * 0.6); ctx.quadraticCurveTo(x0 - s / 6, s * 0.8, x0 - s / 6, s * 0.6); }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#2A2550';
    ctx.beginPath(); ctx.ellipse(-s * 0.17, 0, s * 0.06, s * 0.09, 0, 0, TAU); ctx.ellipse(s * 0.17, 0, s * 0.06, s * 0.09, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function drawCandy(ctx, x, y, s, ang) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    ctx.fillStyle = '#FF7BA9';
    ctx.beginPath(); ctx.moveTo(-s * 0.4, 0); ctx.lineTo(-s * 0.85, -s * 0.3); ctx.lineTo(-s * 0.85, s * 0.3); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s * 0.4, 0); ctx.lineTo(s * 0.85, -s * 0.3); ctx.lineTo(s * 0.85, s * 0.3); ctx.fill();
    ctx.fillStyle = '#FFD66B'; ctx.beginPath(); ctx.arc(0, 0, s * 0.42, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#FFA94D'; ctx.lineWidth = s * 0.1;
    ctx.beginPath(); ctx.arc(0, 0, s * 0.22, 0, Math.PI * 1.4); ctx.stroke();
    ctx.restore();
  }
  function drawCard(ctx, x, y, s, ang, suit) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
    rr(ctx, -s * 0.36, -s * 0.5, s * 0.72, s, s * 0.08);
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.strokeStyle = '#2B2B3A'; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
    ctx.fillStyle = suit === '♥' || suit === '♦' ? '#D62839' : '#1E1B4B';
    ctx.font = `700 ${s * 0.5}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(suit, 0, s * 0.03);
    ctx.restore();
  }
  function goldGrad(ctx, x0, y0, x1, y1) {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, '#FFF1B8'); g.addColorStop(0.45, '#E8B947'); g.addColorStop(1, '#A87418');
    return g;
  }
  function silverGrad(ctx, x0, y0, x1, y1) {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.5, '#C9CCE8'); g.addColorStop(1, '#8E92B8');
    return g;
  }

  /* ---------- 頭の座標系（頭の中心を原点、傾きに合わせて回転） ---------- */
  function onHead(ctx, g, fn) {
    ctx.save();
    ctx.translate(g.hc.x, g.hc.y);
    ctx.rotate(g.headAngle || 0);
    fn(g.headR);
    ctx.restore();
  }

  /* ==========================================================
     パーツ
     ========================================================== */
  const P = {
    /* ドレス（肩から足元まで） */
    gown(ctx, g, o) {
      const sw = g.sw;
      const waistY = g.sc.y + (g.hip.y - g.sc.y) * 0.78;
      const cx = g.hip.x;
      const bw = sw * 0.34;
      const hem = sw * (o.flare || 1.25);
      const bottom = g.bottomY;
      const H = bottom - waistY;
      ctx.save();
      ctx.globalAlpha = o.alpha == null ? 0.94 : o.alpha;

      // スカート
      const skirt = new Path2D();
      skirt.moveTo(cx - bw, waistY);
      skirt.bezierCurveTo(cx - bw - sw * 0.25, waistY + H * 0.35, cx - hem, bottom - H * 0.25, cx - hem, bottom);
      const n = 8;
      for (let i = 0; i < n; i++) {
        const x0 = cx - hem + (2 * hem * i) / n;
        const x1 = cx - hem + (2 * hem * (i + 1)) / n;
        skirt.quadraticCurveTo((x0 + x1) / 2, bottom + sw * 0.1, x1, bottom);
      }
      skirt.bezierCurveTo(cx + hem, bottom - H * 0.25, cx + bw + sw * 0.25, waistY + H * 0.35, cx + bw, waistY);
      skirt.closePath();
      const gr = ctx.createLinearGradient(0, waistY, 0, bottom);
      gr.addColorStop(0, o.c1); gr.addColorStop(1, o.c2);
      ctx.fillStyle = gr;
      ctx.fill(skirt);

      // ひだ
      ctx.save(); ctx.clip(skirt);
      ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.lineWidth = sw * 0.03;
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * bw * 0.25, waistY);
        ctx.quadraticCurveTo(cx + i * hem * 0.2, waistY + H * 0.5, cx + i * hem * 0.3, bottom + 4);
        ctx.stroke();
      }
      // 柄
      if (o.pattern) {
        for (const [u, v, k] of PATTERN) {
          const y = waistY + v * H;
          const x = cx + u * (bw + (hem - bw) * v) * 0.92;
          const s = sw * 0.1 * (0.75 + k * 0.5);
          ctx.globalAlpha = 0.9;
          if (o.pattern === 'apple') drawApple(ctx, x, y, s);
          else if (o.pattern === 'star') { ctx.fillStyle = k > 0.5 ? '#fff' : '#FFF4C2'; sparklePath(ctx, x, y, s * 0.8); ctx.fill(); }
          else if (o.pattern === 'rose') drawRose(ctx, x, y, s * 0.75, '#FFD6E4', '#E0457B');
          else if (o.pattern === 'card') drawCard(ctx, x, y, s * 1.2, (k - 0.5) * 0.8, ['♥', '♠', '♦', '♣'][Math.floor(k * 4)]);
          else if (o.pattern === 'heart') { ctx.fillStyle = '#fff'; heartPath(ctx, x, y, s * 0.6); ctx.fill(); }
          else if (o.pattern === 'pumpkin') drawPumpkin(ctx, x, y, s * 0.6, k > 0.4);
          else if (o.pattern === 'bat') drawBat(ctx, x, y, s * 0.7, '#2A2550');
        }
      }
      ctx.restore();

      // 胸元（身ごろ）
      ctx.globalAlpha = o.alpha == null ? 0.96 : o.alpha;
      const L = g.sL, R = g.sR;
      ctx.beginPath();
      ctx.moveTo(L.x + sw * 0.04, L.y + sw * 0.1);
      ctx.quadraticCurveTo(g.sc.x, g.sc.y + sw * (o.neck || 0.28), R.x - sw * 0.04, R.y + sw * 0.1);
      ctx.lineTo(cx + bw, waistY);
      ctx.lineTo(cx - bw, waistY);
      ctx.closePath();
      ctx.fillStyle = o.bodice || o.c1;
      ctx.fill();

      // 袖（ふわっと）
      if (o.sleeves) {
        ctx.fillStyle = o.sleeves;
        for (const S of [L, R]) {
          ctx.beginPath(); ctx.ellipse(S.x, S.y + sw * 0.08, sw * 0.17, sw * 0.14, 0, 0, TAU); ctx.fill();
        }
      }
      // ベルト
      ctx.fillStyle = o.trim || goldGrad(ctx, cx - bw, 0, cx + bw, 0);
      rr(ctx, cx - bw * 1.05, waistY - sw * 0.05, bw * 2.1, sw * 0.1, sw * 0.05); ctx.fill();
      if (o.brooch) {
        if (o.brooch === 'rose') drawRose(ctx, cx, waistY, sw * 0.1);
        else { ctx.fillStyle = o.brooch; starPath(ctx, cx, waistY, sw * 0.09); ctx.fill(); }
      }
      ctx.restore();
    },

    /* エプロン（アリスモチーフ） */
    pinafore(ctx, g) {
      const sw = g.sw, cx = g.hip.x;
      const waistY = g.sc.y + (g.hip.y - g.sc.y) * 0.78;
      const bottom = waistY + (g.bottomY - waistY) * 0.72;
      ctx.save(); ctx.globalAlpha = 0.96; ctx.fillStyle = '#FFFFFF';
      rr(ctx, cx - sw * 0.24, g.sc.y + sw * 0.18, sw * 0.48, waistY - g.sc.y - sw * 0.1, sw * 0.06); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx - sw * 0.38, waistY);
      ctx.lineTo(cx + sw * 0.38, waistY);
      ctx.quadraticCurveTo(cx + sw * 0.75, bottom, cx + sw * 0.6, bottom);
      ctx.lineTo(cx - sw * 0.6, bottom);
      ctx.quadraticCurveTo(cx - sw * 0.75, bottom, cx - sw * 0.38, waistY);
      ctx.fill();
      ctx.strokeStyle = '#F1C1D3'; ctx.lineWidth = sw * 0.035; ctx.setLineDash([sw * 0.05, sw * 0.04]);
      ctx.beginPath(); ctx.moveTo(cx - sw * 0.6, bottom - sw * 0.06); ctx.lineTo(cx + sw * 0.6, bottom - sw * 0.06); ctx.stroke();
      ctx.restore();
    },

    /* はっぱのチュニック（ピーターパンモチーフ：原作の「木の葉の服」） */
    tunic(ctx, g) {
      const sw = g.sw, cx = g.hip.x;
      const bottom = g.hip.y + (g.hip.y - g.sc.y) * 0.45;
      ctx.save(); ctx.globalAlpha = 0.95;
      const gr = ctx.createLinearGradient(0, g.sc.y, 0, bottom);
      gr.addColorStop(0, '#7BC67E'); gr.addColorStop(1, '#2E7D4F');
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.moveTo(g.sL.x - sw * 0.02, g.sL.y + sw * 0.05);
      ctx.lineTo(g.sR.x + sw * 0.02, g.sR.y + sw * 0.05);
      ctx.lineTo(cx + sw * 0.62, bottom);
      const n = 7;
      for (let i = 0; i < n; i++) {
        const x0 = cx + sw * 0.62 - (sw * 1.24 * (i + 0.5)) / n;
        const x1 = cx + sw * 0.62 - (sw * 1.24 * (i + 1)) / n;
        ctx.lineTo(x0, bottom + sw * 0.2);
        ctx.lineTo(x1, bottom);
      }
      ctx.closePath(); ctx.fill();
      for (let i = 0; i < 9; i++) {
        const k = PATTERN[i];
        drawLeaf(ctx, cx + k[0] * sw * 0.4, g.sc.y + sw * 0.3 + k[1] * (bottom - g.sc.y - sw * 0.3), sw * 0.22, k[2] * 3, 'rgba(255,255,255,.18)');
      }
      ctx.fillStyle = '#7A4A23';
      rr(ctx, cx - sw * 0.5, g.hip.y - sw * 0.06, sw, sw * 0.1, sw * 0.04); ctx.fill();
      ctx.restore();
    },

    /* うちゅうふく */
    spacesuit(ctx, g) {
      const sw = g.sw, cx = g.hip.x;
      const top = g.sc.y - sw * 0.02, bottom = Math.min(g.bottomY, g.hip.y + (g.hip.y - g.sc.y) * 1.2);
      ctx.save(); ctx.globalAlpha = 0.96;
      const gr = ctx.createLinearGradient(cx - sw, 0, cx + sw, 0);
      gr.addColorStop(0, '#D9DEEA'); gr.addColorStop(0.5, '#FFFFFF'); gr.addColorStop(1, '#C7CDE0');
      ctx.fillStyle = gr;
      rr(ctx, g.sL.x - sw * 0.12, top, (g.sR.x - g.sL.x) + sw * 0.24, bottom - top, sw * 0.28); ctx.fill();
      ctx.strokeStyle = '#9AA3BF'; ctx.lineWidth = sw * 0.025; ctx.stroke();
      // 胸のパネル
      const py = g.sc.y + sw * 0.32;
      ctx.fillStyle = '#1E1B4B'; rr(ctx, cx - sw * 0.26, py, sw * 0.52, sw * 0.3, sw * 0.06); ctx.fill();
      const cols = ['#FF5C8A', '#3FD6E0', '#FFD166'];
      cols.forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(cx - sw * 0.14 + i * sw * 0.14, py + sw * 0.1, sw * 0.045, 0, TAU); ctx.fill(); });
      ctx.fillStyle = '#3FD6E0'; rr(ctx, cx - sw * 0.18, py + sw * 0.19, sw * 0.36, sw * 0.04, 2); ctx.fill();
      // ワッペン
      ctx.fillStyle = '#C8325E'; ctx.beginPath(); ctx.arc(g.sL.x + sw * 0.12, g.sL.y + sw * 0.25, sw * 0.1, 0, TAU); ctx.fill();
      ctx.fillStyle = '#fff'; starPath(ctx, g.sL.x + sw * 0.12, g.sL.y + sw * 0.25, sw * 0.06); ctx.fill();
      ctx.restore();
    },

    /* マント */
    cape(ctx, g, t, o) {
      const sw = g.sw;
      const L = g.sL, R = g.sR;
      const bottom = g.bottomY;
      const spread = sw * (o.spread || 1.0);
      ctx.save(); ctx.globalAlpha = 0.95;
      const gr = ctx.createLinearGradient(0, L.y, 0, bottom);
      gr.addColorStop(0, o.c1); gr.addColorStop(1, o.c2 || o.c1);
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.moveTo(L.x - sw * 0.06, L.y);
      ctx.lineTo(R.x + sw * 0.06, R.y);
      ctx.quadraticCurveTo(R.x + spread * 0.7, (R.y + bottom) / 2, R.x + spread * 0.55, bottom);
      const n = 6;
      const w0 = R.x + spread * 0.55, w1 = L.x - spread * 0.55;
      for (let i = 1; i <= n; i++) {
        const x = w0 + ((w1 - w0) * i) / n;
        const wave = Math.sin(t * 3 + i) * sw * 0.06;
        ctx.quadraticCurveTo(x - (w1 - w0) / n / 2, bottom + sw * 0.12 + wave, x, bottom);
      }
      ctx.quadraticCurveTo(L.x - spread * 0.7, (L.y + bottom) / 2, L.x - sw * 0.06, L.y);
      ctx.closePath(); ctx.fill();
      // えり
      ctx.fillStyle = o.collar || o.c2 || o.c1;
      for (const [S, d] of [[L, -1], [R, 1]]) {
        ctx.beginPath();
        ctx.moveTo(S.x, S.y);
        ctx.lineTo(S.x + d * sw * 0.18, S.y - sw * 0.3);
        ctx.lineTo(S.x - d * sw * 0.12, S.y - sw * 0.05);
        ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    },

    /* はね */
    wings(ctx, g, t, o) {
      const sw = g.sw;
      const cx = g.sc.x, cy = g.sc.y + sw * 0.25;
      const flap = Math.sin(t * 2.4) * 0.08;
      ctx.save();
      for (const s of [-1, 1]) {
        ctx.save(); ctx.translate(cx, cy); ctx.scale(s, 1); ctx.rotate(-flap);
        if (o.type === 'fairy') {
          ctx.globalAlpha = 0.55;
          const gr = ctx.createLinearGradient(0, -sw, sw * 1.4, sw);
          gr.addColorStop(0, '#B9F3FF'); gr.addColorStop(0.5, '#E6C8FF'); gr.addColorStop(1, '#FFD1E8');
          ctx.fillStyle = gr; ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = sw * 0.02;
          ctx.beginPath(); ctx.ellipse(sw * 0.6, -sw * 0.45, sw * 0.65, sw * 0.32, -0.6, 0, TAU); ctx.fill(); ctx.stroke();
          ctx.beginPath(); ctx.ellipse(sw * 0.45, sw * 0.25, sw * 0.4, sw * 0.22, 0.6, 0, TAU); ctx.fill(); ctx.stroke();
        } else {
          for (let i = 0; i < 7; i++) {
            const len = sw * (1.25 - i * 0.12);
            const a = -0.75 + i * 0.27;
            ctx.save(); ctx.rotate(a);
            const gr = ctx.createLinearGradient(0, 0, len, 0);
            gr.addColorStop(0, o.c1 || '#FFFFFF'); gr.addColorStop(1, o.c2 || '#E9EEFF');
            ctx.fillStyle = gr; ctx.globalAlpha = 0.93;
            ctx.beginPath(); ctx.ellipse(len * 0.55, 0, len * 0.55, sw * 0.13, 0, 0, TAU); ctx.fill();
            ctx.strokeStyle = 'rgba(160,170,210,.5)'; ctx.lineWidth = sw * 0.012; ctx.stroke();
            ctx.restore();
          }
        }
        ctx.restore();
      }
      ctx.restore();
    },

    /* むねのマーク */
    emblem(ctx, g, o) {
      const sw = g.sw, x = g.sc.x, y = g.sc.y + sw * 0.42;
      ctx.save();
      ctx.fillStyle = o.bg || '#1E1B4B';
      ctx.beginPath(); ctx.arc(x, y, sw * 0.24, 0, TAU); ctx.fill();
      ctx.strokeStyle = goldGrad(ctx, x - sw * 0.24, y, x + sw * 0.24, y); ctx.lineWidth = sw * 0.04; ctx.stroke();
      if (o.kind === 'flame') {
        ctx.fillStyle = '#FFB703';
        ctx.beginPath();
        ctx.moveTo(x, y - sw * 0.17);
        ctx.quadraticCurveTo(x + sw * 0.17, y, x + sw * 0.07, y + sw * 0.14);
        ctx.quadraticCurveTo(x, y + sw * 0.18, x - sw * 0.07, y + sw * 0.14);
        ctx.quadraticCurveTo(x - sw * 0.17, y, x, y - sw * 0.17);
        ctx.fill();
        ctx.fillStyle = '#FB5607'; ctx.beginPath(); ctx.ellipse(x, y + sw * 0.06, sw * 0.045, sw * 0.08, 0, 0, TAU); ctx.fill();
      } else {
        ctx.fillStyle = goldGrad(ctx, x, y - sw * 0.2, x, y + sw * 0.2);
        starPath(ctx, x, y, sw * 0.18); ctx.fill();
      }
      ctx.restore();
    },

    /* ネオンのライン（若者向け） */
    neonLimbs(ctx, g, t) {
      if (!g.lm) return;
      const pairs = [[11, 13], [13, 15], [12, 14], [14, 16], [11, 12], [11, 23], [12, 24], [23, 24], [23, 25], [25, 27], [24, 26], [26, 28]];
      ctx.save();
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.shadowBlur = g.sw * 0.25;
      const hue = (t * 60) % 360;
      for (const [a, b] of pairs) {
        const A = g.lm[a], B = g.lm[b];
        if (!A || !B || A.v < 0.5 || B.v < 0.5) continue;
        const c = `hsl(${(hue + a * 12) % 360} 100% 65%)`;
        ctx.shadowColor = c; ctx.strokeStyle = c; ctx.lineWidth = g.sw * 0.07;
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
      }
      ctx.restore();
    },

    /* ---------- あたま ---------- */
    crown(ctx, g, o = {}) {
      onHead(ctx, g, (r) => {
        const s = o.scale || 1;
        const w = r * 1.25 * s, h = r * 0.72 * s, y0 = -r * 0.92;
        ctx.fillStyle = goldGrad(ctx, -w / 2, y0 - h, w / 2, y0);
        ctx.beginPath();
        ctx.moveTo(-w / 2, y0);
        ctx.lineTo(-w / 2, y0 - h * 0.55);
        ctx.lineTo(-w / 4, y0 - h * 0.25);
        ctx.lineTo(0, y0 - h);
        ctx.lineTo(w / 4, y0 - h * 0.25);
        ctx.lineTo(w / 2, y0 - h * 0.55);
        ctx.lineTo(w / 2, y0);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#8A5A10'; ctx.lineWidth = r * 0.03; ctx.stroke();
        rr(ctx, -w / 2 - r * 0.03, y0 - r * 0.12, w + r * 0.06, r * 0.16, r * 0.06); ctx.fill(); ctx.stroke();
        const gems = o.gems || ['#E0457B', '#3FD6E0', '#E0457B'];
        gems.forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(-w / 3 + (i * w) / 3, y0 - r * 0.04, r * 0.06, 0, TAU); ctx.fill(); });
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, y0 - h, r * 0.07, 0, TAU); ctx.fill();
      });
    },
    tiara(ctx, g, o = {}) {
      onHead(ctx, g, (r) => {
        const y0 = -r * 0.82;
        ctx.fillStyle = silverGrad(ctx, -r, y0 - r * 0.4, r, y0);
        ctx.beginPath();
        ctx.moveTo(-r * 0.75, y0 + r * 0.08);
        ctx.quadraticCurveTo(-r * 0.4, y0 - r * 0.2, -r * 0.18, y0 - r * 0.22);
        ctx.lineTo(0, y0 - r * 0.55);
        ctx.lineTo(r * 0.18, y0 - r * 0.22);
        ctx.quadraticCurveTo(r * 0.4, y0 - r * 0.2, r * 0.75, y0 + r * 0.08);
        ctx.quadraticCurveTo(0, y0 - r * 0.08, -r * 0.75, y0 + r * 0.08);
        ctx.fill();
        ctx.fillStyle = o.gem || '#B9A2FF';
        starPath(ctx, 0, y0 - r * 0.28, r * 0.13); ctx.fill();
        ctx.fillStyle = '#fff';
        [-0.45, 0.45].forEach((k) => { ctx.beginPath(); ctx.arc(r * k, y0 - r * 0.08, r * 0.045, 0, TAU); ctx.fill(); });
      });
    },
    flowerCrown(ctx, g, o = {}) {
      const cols = o.colors || ['#FF8FB1', '#FFFFFF', '#FFD166'];
      onHead(ctx, g, (r) => {
        for (let i = 0; i <= 8; i++) {
          const a = Math.PI + 0.25 + (i / 8) * (Math.PI - 0.5);
          const x = Math.cos(a) * r * 0.98, y = Math.sin(a) * r * 0.92 - r * 0.12;
          drawLeaf(ctx, x, y, r * 0.3, a + 1.2, '#4C9A5B');
        }
        for (let i = 0; i <= 6; i++) {
          const a = Math.PI + 0.3 + (i / 6) * (Math.PI - 0.6);
          const x = Math.cos(a) * r * 0.98, y = Math.sin(a) * r * 0.92 - r * 0.12;
          const c = cols[i % cols.length];
          ctx.fillStyle = c;
          for (let p = 0; p < 5; p++) {
            const pa = (p / 5) * TAU;
            ctx.beginPath(); ctx.arc(x + Math.cos(pa) * r * 0.1, y + Math.sin(pa) * r * 0.1, r * 0.09, 0, TAU); ctx.fill();
          }
          ctx.fillStyle = '#F7B32B'; ctx.beginPath(); ctx.arc(x, y, r * 0.06, 0, TAU); ctx.fill();
        }
      });
    },
    roseCrown(ctx, g) {
      onHead(ctx, g, (r) => {
        for (let i = 0; i <= 6; i++) {
          const a = Math.PI + 0.3 + (i / 6) * (Math.PI - 0.6);
          drawLeaf(ctx, Math.cos(a) * r, Math.sin(a) * r * 0.92 - r * 0.1, r * 0.28, a + 1.1, '#3E8A57');
        }
        for (let i = 0; i <= 4; i++) {
          const a = Math.PI + 0.45 + (i / 4) * (Math.PI - 0.9);
          const big = i === 2;
          drawRose(ctx, Math.cos(a) * r * 0.98, Math.sin(a) * r * 0.92 - r * 0.12, r * (big ? 0.22 : 0.16), big ? '#E0457B' : '#F7A1C0', '#9E1F4A');
        }
      });
    },
    leafCrown(ctx, g) {
      onHead(ctx, g, (r) => {
        for (let i = 0; i <= 10; i++) {
          const a = Math.PI + 0.2 + (i / 10) * (Math.PI - 0.4);
          const x = Math.cos(a) * r, y = Math.sin(a) * r * 0.9 - r * 0.1;
          drawLeaf(ctx, x, y, r * (i % 2 ? 0.38 : 0.3), a + (i < 5 ? -0.3 : 0.3), i % 3 ? '#4FAE5E' : '#2E7D4F');
        }
      });
    },
    ribbon(ctx, g, o = {}) {
      const c = o.color || '#FF7EB3';
      onHead(ctx, g, (r) => {
        const s = o.scale || 1;
        const x = o.center ? 0 : r * 0.45, y = -r * 0.95;
        ctx.save(); ctx.translate(x, y); ctx.rotate(o.center ? 0 : 0.25); ctx.scale(s, s);
        ctx.fillStyle = c;
        for (const d of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(d * r * 0.3, -r * 0.5, d * r * 0.8, -r * 0.35, d * r * 0.7, 0);
          ctx.bezierCurveTo(d * r * 0.8, r * 0.35, d * r * 0.3, r * 0.4, 0, 0);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(0, 0); ctx.lineTo(d * r * 0.25, r * 0.6); ctx.lineTo(d * r * 0.12, r * 0.55); ctx.lineTo(d * r * 0.05, r * 0.62);
          ctx.closePath(); ctx.fill();
        }
        ctx.fillStyle = 'rgba(255,255,255,.35)';
        ctx.beginPath(); ctx.ellipse(-r * 0.4, -r * 0.08, r * 0.14, r * 0.07, -0.4, 0, TAU); ctx.fill();
        ctx.fillStyle = o.knot || c; ctx.beginPath(); ctx.arc(0, 0, r * 0.13, 0, TAU); ctx.fill();
        ctx.restore();
        if (o.band) {
          ctx.strokeStyle = c; ctx.lineWidth = r * 0.1;
          ctx.beginPath(); ctx.arc(0, -r * 0.05, r * 0.95, Math.PI + 0.35, TAU - 0.35); ctx.stroke();
        }
      });
    },
    halo(ctx, g, t, o = {}) {
      onHead(ctx, g, (r) => {
        const y = -r * 1.55 + Math.sin(t * 2) * r * 0.05;
        ctx.save();
        ctx.shadowColor = o.glow || '#FFE9A8'; ctx.shadowBlur = r * 0.6;
        ctx.strokeStyle = o.color || '#FFE58A'; ctx.lineWidth = r * 0.14;
        ctx.beginPath(); ctx.ellipse(0, y, r * 0.75, r * 0.2, 0, 0, TAU); ctx.stroke();
        ctx.restore();
      });
    },
    horns(ctx, g, o = {}) {
      onHead(ctx, g, (r) => {
        for (const d of [-1, 1]) {
          const gr = ctx.createLinearGradient(0, -r, 0, -r * 1.7);
          gr.addColorStop(0, o.c1 || '#F77F00'); gr.addColorStop(1, o.c2 || '#FFE066');
          ctx.fillStyle = gr;
          ctx.beginPath();
          ctx.moveTo(d * r * 0.3, -r * 0.8);
          ctx.quadraticCurveTo(d * r * 0.45, -r * 1.5, d * r * 0.85, -r * 1.75);
          ctx.quadraticCurveTo(d * r * 0.7, -r * 1.25, d * r * 0.7, -r * 0.7);
          ctx.closePath(); ctx.fill();
        }
      });
    },
    helmet(ctx, g) {
      onHead(ctx, g, (r) => {
        const R = r * 1.45;
        ctx.save();
        ctx.fillStyle = 'rgba(190,225,255,.16)';
        ctx.beginPath(); ctx.arc(0, r * 0.05, R, 0, TAU); ctx.fill();
        ctx.strokeStyle = '#F4F6FB'; ctx.lineWidth = r * 0.2; ctx.stroke();
        ctx.strokeStyle = '#9AA3BF'; ctx.lineWidth = r * 0.04;
        ctx.beginPath(); ctx.arc(0, r * 0.05, R + r * 0.1, 0, TAU); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = r * 0.09; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(0, r * 0.05, R * 0.8, Math.PI * 1.1, Math.PI * 1.4); ctx.stroke();
        ctx.strokeStyle = '#D9DEEA'; ctx.lineWidth = r * 0.06;
        ctx.beginPath(); ctx.moveTo(R * 0.55, -R * 0.75); ctx.lineTo(R * 0.75, -R * 1.15); ctx.stroke();
        ctx.fillStyle = '#FF5C8A'; ctx.beginPath(); ctx.arc(R * 0.75, -R * 1.15, r * 0.1, 0, TAU); ctx.fill();
        ctx.restore();
      });
    },
    mask(ctx, g, o = {}) {
      onHead(ctx, g, (r) => {
        const y = g.eyeDy == null ? -r * 0.08 : g.eyeDy;
        ctx.save();
        ctx.fillStyle = o.color || '#1E1B4B';
        ctx.beginPath();
        ctx.moveTo(-r * 0.85, y - r * 0.05);
        ctx.quadraticCurveTo(-r * 0.4, y - r * 0.38, 0, y - r * 0.15);
        ctx.quadraticCurveTo(r * 0.4, y - r * 0.38, r * 0.85, y - r * 0.05);
        ctx.quadraticCurveTo(r * 0.6, y + r * 0.3, r * 0.1, y + r * 0.12);
        ctx.lineTo(0, y + r * 0.04);
        ctx.lineTo(-r * 0.1, y + r * 0.12);
        ctx.quadraticCurveTo(-r * 0.6, y + r * 0.3, -r * 0.85, y - r * 0.05);
        ctx.closePath();
        const ex = g.eyeHalf || r * 0.35;
        ctx.ellipse(-ex, y, r * 0.17, r * 0.11, 0, 0, TAU);
        ctx.ellipse(ex, y, r * 0.17, r * 0.11, 0, 0, TAU);
        ctx.fill('evenodd');
        ctx.restore();
      });
    },
    visor(ctx, g, t) {
      onHead(ctx, g, (r) => {
        const y = g.eyeDy == null ? -r * 0.08 : g.eyeDy;
        ctx.save();
        const gr = ctx.createLinearGradient(-r, 0, r, 0);
        const h = (t * 50) % 360;
        gr.addColorStop(0, `hsl(${h} 100% 62%)`); gr.addColorStop(0.5, `hsl(${(h + 120) % 360} 100% 62%)`); gr.addColorStop(1, `hsl(${(h + 240) % 360} 100% 62%)`);
        ctx.shadowColor = '#3FD6E0'; ctx.shadowBlur = r * 0.5;
        ctx.globalAlpha = 0.88; ctx.fillStyle = gr;
        rr(ctx, -r * 0.95, y - r * 0.22, r * 1.9, r * 0.42, r * 0.21); ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = 0.7; ctx.fillStyle = '#fff';
        rr(ctx, -r * 0.7, y - r * 0.15, r * 0.5, r * 0.06, r * 0.03); ctx.fill();
        ctx.restore();
      });
    },
    cheeks(ctx, g) {
      onHead(ctx, g, (r) => {
        const y = (g.eyeDy == null ? -r * 0.08 : g.eyeDy) + r * 0.38;
        ctx.save(); ctx.fillStyle = 'rgba(255,120,170,.45)';
        for (const d of [-1, 1]) { ctx.beginPath(); ctx.ellipse(d * r * 0.5, y, r * 0.17, r * 0.1, 0, 0, TAU); ctx.fill(); }
        ctx.fillStyle = 'rgba(255,255,255,.9)';
        for (const d of [-1, 1]) { heartPath(ctx, d * r * 0.72, y - r * 0.12, r * 0.07); ctx.fill(); }
        ctx.restore();
      });
    },
    witchHat(ctx, g, o = {}) {
      onHead(ctx, g, (r) => {
        ctx.save(); ctx.strokeStyle = '#2A2550'; ctx.lineWidth = r * 0.07; ctx.lineJoin = 'round';
        ctx.fillStyle = o.color || '#7A5BC7';
        ctx.beginPath();
        ctx.moveTo(-r * 0.75, -r * 0.85);
        ctx.quadraticCurveTo(-r * 0.4, -r * 1.7, r * 0.05, -r * 2.25);
        ctx.quadraticCurveTo(r * 0.45, -r * 2.55, r * 0.85, -r * 2.2);
        ctx.quadraticCurveTo(r * 0.35, -r * 2.15, r * 0.3, -r * 1.75);
        ctx.lineTo(r * 0.75, -r * 0.85); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#FFA94D';
        ctx.beginPath(); ctx.moveTo(-r * 0.68, -r * 1.02); ctx.lineTo(r * 0.68, -r * 1.02); ctx.lineTo(r * 0.72, -r * 0.88); ctx.lineTo(-r * 0.72, -r * 0.88); ctx.closePath(); ctx.fill();
        ctx.fillStyle = o.brim || '#C3A6FF';
        ctx.beginPath(); ctx.ellipse(0, -r * 0.85, r * 1.35, r * 0.24, 0, 0, TAU); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#FFD66B'; starPath(ctx, -r * 0.1, -r * 1.3, r * 0.17); ctx.fill(); ctx.stroke();
        ctx.restore();
      });
    },
    pumpkinHat(ctx, g) {
      onHead(ctx, g, (r) => { drawPumpkin(ctx, r * 0.35, -r * 1.2, r * 0.42, true); });
    },
    ghostHood(ctx, g) {
      onHead(ctx, g, (r) => {
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.strokeStyle = '#2A2550'; ctx.lineWidth = r * 0.06;
        const p = new Path2D();
        p.moveTo(-r * 1.25, r * 1.2);
        p.bezierCurveTo(-r * 1.45, -r * 0.4, -r * 0.9, -r * 1.5, 0, -r * 1.5);
        p.bezierCurveTo(r * 0.9, -r * 1.5, r * 1.45, -r * 0.4, r * 1.25, r * 1.2);
        for (let i = 0; i < 5; i++) { const x0 = r * 1.25 - (i + 1) * (r * 2.5 / 5); p.quadraticCurveTo(x0 + r * 0.25, r * 1.55, x0, r * 1.2); }
        p.closePath();
        p.ellipse(0, r * 0.05, r * 0.82, r * 0.98, 0, 0, TAU);
        ctx.fill(p, 'evenodd'); ctx.stroke(p);
        ctx.fillStyle = '#FF9EBB';
        for (const d of [-1, 1]) { ctx.beginPath(); ctx.ellipse(d * r * 1.02, r * 0.5, r * 0.1, r * 0.07, 0, 0, TAU); ctx.fill(); }
        ctx.restore();
      });
    },
    batBand(ctx, g) {
      onHead(ctx, g, (r) => {
        ctx.save(); ctx.strokeStyle = '#2A2550'; ctx.lineWidth = r * 0.09;
        ctx.beginPath(); ctx.arc(0, -r * 0.05, r * 0.98, Math.PI + 0.35, TAU - 0.35); ctx.stroke();
        drawBat(ctx, 0, -r * 1.1, r * 0.55, '#2A2550');
        ctx.restore();
      });
    },
    catEars(ctx, g, o = {}) {
      onHead(ctx, g, (r) => {
        ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
        for (const d of [-1, 1]) {
          if (o.fill) { ctx.fillStyle = o.fill; ctx.beginPath(); ctx.moveTo(d * r * 0.3, -r * 0.92); ctx.quadraticCurveTo(d * r * 0.55, -r * 1.5, d * r * 0.75, -r * 1.75); ctx.quadraticCurveTo(d * r * 1.0, -r * 1.3, d * r * 1.02, -r * 0.7); ctx.closePath(); ctx.fill(); }
          ctx.fillStyle = '#FF9EC4';
          ctx.beginPath(); ctx.moveTo(d * r * 0.42, -r * 0.95); ctx.lineTo(d * r * 0.72, -r * 1.55); ctx.lineTo(d * r * 0.9, -r * 0.75); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = '#2A2550'; ctx.lineWidth = r * 0.09;
          ctx.beginPath(); ctx.moveTo(d * r * 0.3, -r * 0.92); ctx.quadraticCurveTo(d * r * 0.55, -r * 1.5, d * r * 0.75, -r * 1.75); ctx.quadraticCurveTo(d * r * 1.0, -r * 1.3, d * r * 1.02, -r * 0.7); ctx.stroke();
        }
        ctx.restore();
      });
    },
    whiskers(ctx, g) {
      onHead(ctx, g, (r) => {
        const y = (g.eyeDy == null ? -r * 0.08 : g.eyeDy) + r * 0.42;
        ctx.save(); ctx.strokeStyle = '#2A2550'; ctx.lineWidth = r * 0.05; ctx.lineCap = 'round';
        ctx.fillStyle = '#FF7BA9';
        ctx.beginPath(); ctx.moveTo(-r * 0.09, y - r * 0.05); ctx.lineTo(r * 0.09, y - r * 0.05); ctx.lineTo(0, y + r * 0.06); ctx.closePath(); ctx.fill();
        for (const d of [-1, 1]) for (const k of [-1, 0, 1]) {
          ctx.beginPath(); ctx.moveTo(d * r * 0.42, y + k * r * 0.07); ctx.lineTo(d * r * 0.95, y + k * r * 0.18 - r * 0.02); ctx.stroke();
        }
        ctx.restore();
      });
    },
    bunnyEars(ctx, g, t) {
      onHead(ctx, g, (r) => {
        const sway = Math.sin(t * 2) * 0.06;
        for (const d of [-1, 1]) {
          ctx.save(); ctx.translate(d * r * 0.38, -r * 0.95); ctx.rotate(d * (0.18 + sway));
          ctx.fillStyle = '#FFE3EE'; ctx.strokeStyle = '#2A2550'; ctx.lineWidth = r * 0.06;
          ctx.beginPath(); ctx.ellipse(0, -r * 0.7, r * 0.26, r * 0.78, 0, 0, TAU); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#FF9EC4'; ctx.beginPath(); ctx.ellipse(0, -r * 0.66, r * 0.12, r * 0.56, 0, 0, TAU); ctx.fill();
          ctx.restore();
        }
      });
    },
    starRing(ctx, g, t) {
      onHead(ctx, g, (r) => {
        ctx.save();
        for (let i = 0; i < 8; i++) {
          const a = t * 1.6 + (i / 8) * TAU;
          const x = Math.cos(a) * r * 1.25, y = -r * 1.2 + Math.sin(a) * r * 0.3;
          const front = Math.sin(a) > 0;
          ctx.globalAlpha = front ? 1 : 0.45;
          ctx.shadowColor = '#7CF6FF'; ctx.shadowBlur = r * 0.3;
          ctx.fillStyle = i % 2 ? '#7CF6FF' : '#FF9EE6';
          starPath(ctx, x, y, r * (front ? 0.14 : 0.1)); ctx.fill();
        }
        ctx.restore();
      });
    },
    fairyLight(ctx, g, t) {
      // ちいさな光の妖精（キャラクターではなく、ただの光）
      const sw = g.sw;
      const x = g.hc.x + Math.cos(t * 1.7) * sw * 1.1;
      const y = g.hc.y + Math.sin(t * 2.3) * sw * 0.5 - sw * 0.2;
      ctx.save();
      const gr = ctx.createRadialGradient(x, y, 0, x, y, sw * 0.25);
      gr.addColorStop(0, 'rgba(255,255,220,1)'); gr.addColorStop(0.3, 'rgba(255,230,140,.8)'); gr.addColorStop(1, 'rgba(255,230,140,0)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, sw * 0.25, 0, TAU); ctx.fill();
      ctx.restore();
      return { x, y };
    }
  };

  /* ==========================================================
     衣装リスト
     cat: kids（キッズ） / teen（ティーン・映え） / special（スタンプで解放）
     lock: スポットID または 'complete'。null は最初から使える
     ========================================================== */
  const COSTUMES = [
    /* ---- ハロウィン ---- */
    {
      id: 'h-pumpkin', name: 'かぼちゃのおひめさま', icon: 'pumpkin', cat: 'halloween', lock: null,
      motif: 'ハロウィン限定', particles: 'candy', filter: 'halloween', rate: 12,
      draw(ctx, g, t) {
        P.gown(ctx, g, { c1: '#FFC77A', c2: '#F07F1E', bodice: '#7A5BC7', pattern: 'pumpkin', flare: 1.35, trim: '#2A2550', brooch: '#FFD66B' });
        P.pumpkinHat(ctx, g);
      }
    },
    {
      id: 'h-witch', name: 'まじょっこ', icon: 'witch', cat: 'halloween', lock: null,
      motif: 'ハロウィン限定', particles: 'star', filter: 'halloween',
      back(ctx, g, t) { P.cape(ctx, g, t, { c1: '#7A5BC7', c2: '#3B2A7A', collar: '#FFA94D' }); },
      draw(ctx, g, t) { P.witchHat(ctx, g); }
    },
    {
      id: 'h-blackcat', name: 'くろねこ', icon: 'blackcat', cat: 'halloween', lock: null,
      motif: 'ハロウィン限定', particles: 'bat', filter: 'halloween', rate: 8,
      draw(ctx, g, t) { P.catEars(ctx, g, { fill: '#4A4280' }); P.whiskers(ctx, g); P.cheeks(ctx, g); }
    },
    {
      id: 'h-ghost', name: 'ちびおばけ', icon: 'ghost', cat: 'halloween', lock: 'visit2',
      motif: 'ハロウィン限定', particles: 'ghost', filter: 'halloween', rate: 6,
      draw(ctx, g, t) { P.ghostHood(ctx, g); }
    },
    {
      id: 'h-vampire', name: 'こうもりヴァンパイア', icon: 'bat', cat: 'halloween', lock: 'visit2',
      motif: 'ハロウィン限定', particles: 'bat', filter: 'halloween', rate: 10,
      back(ctx, g, t) { P.cape(ctx, g, t, { c1: '#2A2550', c2: '#130F33', collar: '#C8213A', spread: 1.3 }); },
      draw(ctx, g, t) { P.batBand(ctx, g); }
    },
    {
      id: 'apple-princess', name: 'りんごの森のプリンセス', icon: 'apple', cat: 'kids', lock: null,
      motif: '童話『白雪姫』モチーフ', particles: 'petal',
      draw(ctx, g, t) {
        P.gown(ctx, g, { c1: '#FFF4E4', c2: '#3E8F5E', bodice: '#C8213A', pattern: 'apple', flare: 1.25, brooch: '#FFD166' });
        P.flowerCrown(ctx, g, { colors: ['#E63946', '#FFFFFF', '#FFD166'] });
      }
    },
    {
      id: 'glass-ball', name: 'ガラスのくつの舞踏会', icon: 'slipper', cat: 'kids', lock: null,
      motif: '童話『シンデレラ』モチーフ', particles: 'sparkle', filter: 'glow',
      draw(ctx, g, t) {
        P.gown(ctx, g, { c1: '#F6F1FF', c2: '#A994EE', bodice: '#E7DEFF', pattern: 'star', flare: 1.5, neck: 0.18, trim: '#D7DBF2' });
        P.tiara(ctx, g, { gem: '#C9B8FF' });
      }
    },
    {
      id: 'star-hero', name: 'スターヒーロー', icon: 'shield', cat: 'kids', lock: null,
      motif: 'オリジナル', particles: 'star',
      back(ctx, g, t) { P.cape(ctx, g, t, { c1: '#D7263D', c2: '#8E1330', collar: '#1E1B4B' }); },
      draw(ctx, g, t) { P.emblem(ctx, g, {}); P.mask(ctx, g, {}); }
    },
    {
      id: 'space-cadet', name: 'みらいの宇宙飛行士', icon: 'helmet', cat: 'kids', lock: null,
      motif: 'オリジナル', particles: 'star', filter: 'space',
      draw(ctx, g, t) { P.spacesuit(ctx, g); P.helmet(ctx, g); }
    },
    {
      id: 'angel', name: '天使のわっか', icon: 'angel', cat: 'teen', lock: null,
      motif: 'オリジナル', particles: 'feather', filter: 'glow',
      back(ctx, g, t) { P.wings(ctx, g, t, {}); },
      draw(ctx, g, t) { P.halo(ctx, g, t); }
    },
    {
      id: 'cyber-neon', name: 'サイバーネオン', icon: 'cyber', cat: 'teen', lock: null,
      motif: 'オリジナル', particles: 'glitch', filter: 'neon',
      draw(ctx, g, t) { P.neonLimbs(ctx, g, t); P.visor(ctx, g, t); }
    },
    {
      id: 'neko', name: 'らくがきねこ', icon: 'cat', cat: 'teen', lock: null,
      motif: 'オリジナル', particles: 'heart', filter: 'glow', rate: 14,
      draw(ctx, g, t) { P.catEars(ctx, g); P.whiskers(ctx, g); P.cheeks(ctx, g); }
    },
    {
      id: 'usagi', name: 'ふわふわうさぎ', icon: 'bunny', cat: 'teen', lock: null,
      motif: 'オリジナル', particles: 'sparkle', filter: 'pastel', rate: 16,
      draw(ctx, g, t) { P.bunnyEars(ctx, g, t); P.cheeks(ctx, g); }
    },
    {
      id: 'museum', name: '名画になっちゃった', icon: 'museum', cat: 'teen', lock: null,
      motif: 'オリジナル', particles: null, filter: 'painting', frame: 'museum',
      draw(ctx, g, t) { P.crown(ctx, g, { scale: 0.85, gems: ['#2B59C3', '#C8325E', '#2B59C3'] }); }
    },
    /* ---- スタンプで解放 ---- */
    {
      id: 'wonder-tea', name: 'ふしぎの国のお茶会', icon: 'teacup', cat: 'special', lock: 'visit1',
      motif: '童話『不思議の国のアリス』モチーフ', particles: 'card', rate: 8,
      draw(ctx, g, t) {
        P.gown(ctx, g, { c1: '#FFE27A', c2: '#F2B33D', bodice: '#FFE27A', pattern: 'card', flare: 1.15, trim: '#2B59C3' });
        P.pinafore(ctx, g);
        P.ribbon(ctx, g, { color: '#2B59C3', center: true, band: true, scale: 0.8 });
      }
    },
    {
      id: 'rose-garden', name: 'ローズガーデンのお姫さま', icon: 'rose', cat: 'special', lock: 'visit1',
      motif: '高島屋のバラをイメージしたオリジナル', particles: 'petal', filter: 'glow',
      draw(ctx, g, t) {
        P.gown(ctx, g, { c1: '#FFE1EB', c2: '#C8325E', bodice: '#E0457B', pattern: 'rose', flare: 1.4, sleeves: '#FFD6E4', brooch: 'rose' });
        P.roseCrown(ctx, g);
      }
    },
    {
      id: 'neverland', name: 'ネバーランドの空とぶ子', icon: 'leaf', cat: 'special', lock: 'visit1',
      motif: '童話『ピーター・パン』モチーフ', particles: 'fairy',
      draw(ctx, g, t) {
        P.tunic(ctx, g);
        P.leafCrown(ctx, g);
        const f = P.fairyLight(ctx, g, t);
        g._fairy = f;
      }
    },
    {
      id: 'yumekawa', name: 'ゆめかわリボン', icon: 'ribbon', cat: 'special', lock: 'visit2',
      motif: 'オリジナル', particles: 'heart', filter: 'pastel',
      draw(ctx, g, t) { P.ribbon(ctx, g, { color: '#FF8CC6', scale: 1.15 }); P.cheeks(ctx, g); }
    },
    {
      id: 'hologram', name: 'ホログラム・アイドル', icon: 'hologram', cat: 'special', lock: 'visit2',
      motif: 'オリジナル', particles: 'star', filter: 'hologram',
      back(ctx, g, t) { P.wings(ctx, g, t, { type: 'fairy' }); },
      draw(ctx, g, t) { P.starRing(ctx, g, t); }
    },
    {
      id: 'dragon', name: 'ほのおのドラゴンナイト', icon: 'flame', cat: 'special', lock: 'visit3',
      motif: 'オリジナル', particles: 'flame',
      back(ctx, g, t) { P.cape(ctx, g, t, { c1: '#3A0CA3', c2: '#F77F00', collar: '#F77F00', spread: 1.2 }); },
      draw(ctx, g, t) { P.emblem(ctx, g, { kind: 'flame', bg: '#3A0CA3' }); P.horns(ctx, g, {}); }
    },
    {
      id: 'golden-legend', name: 'ゴールドレジェンド', icon: 'crown-gold', cat: 'special', lock: 'visit3',
      motif: 'コンプリート記念', particles: 'confetti', filter: 'gold',
      back(ctx, g, t) { P.cape(ctx, g, t, { c1: '#F5D27A', c2: '#B8862A', collar: '#FFF1B8', spread: 1.3 }); },
      draw(ctx, g, t) { P.emblem(ctx, g, { bg: '#C8325E' }); P.crown(ctx, g, { scale: 1.15 }); }
    }
  ];

  /* ==========================================================
     公式画像（ローズちゃん等）の配置
     ========================================================== */
  function drawParts(ctx, c, g) {
    const parts = c.parts || {};
    const ok = (p) => p && p.img && p.img.complete && p.img.naturalWidth;
    if (ok(parts.body)) {
      const p = parts.body, img = p.img;
      const w = g.sw * (p.width || 1.7);
      const h = w * (img.naturalHeight / img.naturalWidth);
      ctx.drawImage(img, g.sc.x - w / 2, g.sc.y - g.sw * (p.top == null ? 0.12 : p.top), w, h);
    }
    if (ok(parts.head)) {
      const p = parts.head, img = p.img;
      onHead(ctx, g, (r) => {
        const w = r * 2 * (p.width || 1.1);
        const h = w * (img.naturalHeight / img.naturalWidth);
        ctx.drawImage(img, -w / 2, -r * (p.y == null ? 0.95 : p.y) - h, w, h);
      });
    }
  }
  function drawOfficial(ctx, c, g, W, H) {
    const img = c.image;
    if (!img || !img.complete || !img.naturalWidth) return;
    const ratio = img.naturalWidth / img.naturalHeight;
    let h, x, y;
    if (c.placement === 'corner' || !g) {
      h = H * 0.36; x = W - h * ratio - W * 0.04; y = H - h - H * 0.16;
    } else {
      h = Math.max(g.bottomY - g.headTop, g.sw * 2.5) * 0.85;
      const w = h * ratio;
      const right = g.sR.x + g.sw * 0.35;
      x = right + w <= W ? right : g.sL.x - g.sw * 0.35 - w;
      y = g.bottomY - h;
    }
    ctx.drawImage(img, x, y, h * ratio, h);
  }

  /* ==========================================================
     パーティクル
     ========================================================== */
  const COLORS = {
    sparkle: ['#FFFFFF', '#FFF2B3', '#E9DCFF'],
    star: ['#FFE066', '#FFFFFF', '#7CF6FF'],
    heart: ['#FF8CC6', '#FFFFFF', '#FFC2DD'],
    petal: ['#FFC6D9', '#FF8FB1', '#FFFFFF'],
    confetti: ['#F5D27A', '#FFFFFF', '#E0457B', '#B9A2FF'],
    feather: ['#FFFFFF', '#F2F4FF'],
    card: ['#FFFFFF'],
    flame: ['#FFB703', '#FB5607', '#FFE066'],
    fairy: ['#FFF6C2', '#FFFFFF', '#FFE58A'],
    glitch: ['#FF3CAC', '#3FD6E0', '#B9A2FF'],
    candy: ['#FFD66B'], bat: ['#2A2550', '#4A4280'], ghost: ['#FFFFFF']
  };
  function spawn(type, g, W, H) {
    const sw = g ? g.sw : W * 0.3;
    const cx = g ? g.hc.x : W / 2;
    const top = g ? g.headTop : H * 0.2;
    const bottom = g ? g.bottomY : H * 0.9;
    const col = COLORS[type] || COLORS.sparkle;
    const p = {
      type, x: cx + (Math.random() - 0.5) * sw * 3, y: top + Math.random() * (bottom - top),
      vx: (Math.random() - 0.5) * sw * 0.2, vy: 0, life: 0, max: 1 + Math.random() * 1.2,
      size: sw * (0.05 + Math.random() * 0.07), rot: Math.random() * TAU, vr: (Math.random() - 0.5) * 3,
      color: col[Math.floor(Math.random() * col.length)], suit: ['♥', '♠', '♦', '♣'][Math.floor(Math.random() * 4)]
    };
    if (type === 'petal' || type === 'confetti' || type === 'feather' || type === 'card') { p.y = top - sw * 0.5 + Math.random() * sw; p.vy = sw * (0.35 + Math.random() * 0.3); p.max = 2.5; }
    if (type === 'bat' || type === 'ghost') { p.vy = -sw * (0.2 + Math.random() * 0.2); p.vx = (Math.random() - 0.5) * sw * 0.6; p.max = 2.2; p.vr = 0; p.rot = 0; }
    if (type === 'candy') { p.y = top - sw * 0.5 + Math.random() * sw; p.vy = sw * (0.35 + Math.random() * 0.3); p.max = 2.5; }
    if (type === 'heart' || type === 'flame') { p.y = bottom - Math.random() * (bottom - top) * 0.5; p.vy = -sw * (0.5 + Math.random() * 0.4); }
    if (type === 'fairy' && g && g._fairy) { p.x = g._fairy.x; p.y = g._fairy.y; p.vy = sw * 0.15; p.max = 1.3; p.size *= 0.7; }
    if (type === 'glitch') { p.max = 0.25 + Math.random() * 0.3; }
    return p;
  }
  function drawParticle(ctx, p) {
    const k = p.life / p.max;
    const a = k < 0.2 ? k / 0.2 : 1 - (k - 0.2) / 0.8;
    ctx.save(); ctx.globalAlpha = Math.max(0, a); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
    const s = p.size;
    ctx.fillStyle = p.color;
    switch (p.type) {
      case 'heart': heartPath(ctx, 0, 0, s); ctx.fill(); break;
      case 'star': starPath(ctx, 0, 0, s); ctx.fill(); break;
      case 'petal': ctx.beginPath(); ctx.ellipse(0, 0, s * 0.9, s * 0.5, 0, 0, TAU); ctx.fill(); break;
      case 'confetti': ctx.fillRect(-s * 0.5, -s * 0.25, s, s * 0.5); break;
      case 'feather': ctx.beginPath(); ctx.ellipse(0, 0, s * 1.2, s * 0.35, 0, 0, TAU); ctx.fill(); break;
      case 'card': ctx.restore(); drawCard(ctx, p.x, p.y, s * 1.5, p.rot, p.suit); return;
      case 'flame': ctx.beginPath(); ctx.ellipse(0, 0, s * 0.45, s * 0.8, 0, 0, TAU); ctx.fill(); break;
      case 'candy': ctx.restore(); drawCandy(ctx, p.x, p.y, s * 1.4, p.rot); return;
      case 'bat': ctx.restore(); drawBat(ctx, p.x, p.y, s * 1.2, p.color); return;
      case 'ghost': ctx.restore(); drawGhost(ctx, p.x, p.y, s * 2); return;
      case 'glitch': ctx.rotate(-p.rot); ctx.fillRect(-s * 2, -s * 0.15, s * 4, s * 0.3); break;
      default: sparklePath(ctx, 0, 0, s); ctx.fill();
    }
    ctx.restore();
  }

  /* ==========================================================
     画面全体のフィルター・額縁
     ========================================================== */
  function applyFilter(ctx, name, W, H, t, canvas) {
    if (!name) return;
    ctx.save();
    if (name === 'glow') {
      ctx.globalCompositeOperation = 'screen';
      const gr = ctx.createRadialGradient(W / 2, H * 0.4, 0, W / 2, H * 0.4, Math.max(W, H) * 0.7);
      gr.addColorStop(0, 'rgba(255,220,240,.18)'); gr.addColorStop(1, 'rgba(180,160,255,.12)');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    } else if (name === 'pastel') {
      ctx.globalCompositeOperation = 'screen';
      const gr = ctx.createLinearGradient(0, 0, W, H);
      gr.addColorStop(0, 'rgba(255,170,215,.28)'); gr.addColorStop(1, 'rgba(185,162,255,.24)');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    } else if (name === 'neon' || name === 'hologram') {
      ctx.globalCompositeOperation = 'soft-light';
      const gr = ctx.createLinearGradient(0, 0, W, H);
      gr.addColorStop(0, 'rgba(255,60,172,.8)'); gr.addColorStop(1, 'rgba(63,214,224,.8)');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0,0,0,.08)';
      const step = Math.max(3, Math.round(H / 220));
      const off = name === 'hologram' ? Math.floor(t * 40) % (step * 2) : 0;
      for (let y = off; y < H; y += step * 2) ctx.fillRect(0, y, W, step);
      if (name === 'hologram' && Math.random() < 0.08) {
        const y = Math.random() * H, h = H * (0.02 + Math.random() * 0.04);
        ctx.drawImage(canvas, 0, y, W, h, (Math.random() - 0.5) * W * 0.05, y, W, h);
      }
    } else if (name === 'painting') {
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = 'rgba(232,201,154,.45)'; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75);
      v.addColorStop(0, 'rgba(40,20,0,0)'); v.addColorStop(1, 'rgba(40,20,0,.55)');
      ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    } else if (name === 'gold') {
      ctx.globalCompositeOperation = 'soft-light';
      ctx.fillStyle = 'rgba(245,200,90,.55)'; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
      v.addColorStop(0, 'rgba(120,80,0,0)'); v.addColorStop(1, 'rgba(120,80,0,.35)');
      ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    } else if (name === 'halloween') {
      ctx.globalCompositeOperation = 'soft-light';
      const gr = ctx.createLinearGradient(0, 0, 0, H);
      gr.addColorStop(0, 'rgba(122,91,199,.75)'); gr.addColorStop(1, 'rgba(255,169,77,.7)');
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over';
      const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
      v.addColorStop(0, 'rgba(42,37,80,0)'); v.addColorStop(1, 'rgba(42,37,80,.45)');
      ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    } else if (name === 'space') {
      ctx.globalCompositeOperation = 'soft-light';
      ctx.fillStyle = 'rgba(40,40,140,.5)'; ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }
  function drawFrame(ctx, name, W, H) {
    if (name !== 'museum') return;
    const b = Math.min(W, H) * 0.07;
    ctx.save();
    ctx.fillStyle = goldGrad(ctx, 0, 0, W, H);
    ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.rect(b, b, W - b * 2, H - b * 2); ctx.fill('evenodd');
    ctx.strokeStyle = '#7A4E0E'; ctx.lineWidth = b * 0.12;
    ctx.strokeRect(b * 0.5, b * 0.5, W - b, H - b);
    ctx.strokeStyle = '#FFF1B8'; ctx.lineWidth = b * 0.08;
    ctx.strokeRect(b - b * 0.05, b - b * 0.05, W - b * 2 + b * 0.1, H - b * 2 + b * 0.1);
    const pw = W * 0.5, ph = b * 1.1, px = (W - pw) / 2, py = b * 1.4;
    ctx.fillStyle = '#F7EBD3'; rr(ctx, px, py, pw, ph, ph * 0.12); ctx.fill();
    ctx.strokeStyle = '#A87418'; ctx.lineWidth = b * 0.05; ctx.stroke();
    ctx.fillStyle = '#3B2A12'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = `700 ${ph * 0.36}px "Shippori Mincho", serif`;
    ctx.fillText('作品名『近未来の主役』', W / 2, py + ph * 0.5);
    ctx.restore();
  }

  window.NRL_COSTUMES = COSTUMES;
  window.NRL_COSTUME_NAMES = Object.fromEntries(COSTUMES.map((c) => [c.id, c.name]));
  window.NRL_FX = { drawOfficial, drawParts, drawPumpkin, drawBat, drawGhost, drawCandy, spawn, drawParticle, applyFilter, drawFrame, shapes: { starPath, heartPath, sparklePath, drawRose, rr } };
})();
