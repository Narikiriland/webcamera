/* ==========================================================
   近未来なりきりランド ― オリジナルイラスト集（SVG）
   太めのふち線＋フラットな色で、シール帳のような世界観に統一
   ========================================================== */
(function () {
  'use strict';
  const N = '#2A2550';   // ふち線
  const C = { pink: '#FF7BA9', rose: '#E0457B', red: '#FF5A5F', yellow: '#FFD66B', orange: '#FFA94D', gold: '#FFB938', mint: '#7FD8C6', sky: '#8FD3F4', lilac: '#C3A6FF', green: '#6BCB77', cheek: '#FF9EBB', white: '#FFFFFF' };

  function starD(cx, cy, R, r, n = 5, rot = -90) {
    let d = '';
    for (let i = 0; i < n * 2; i++) {
      const rr = i % 2 ? r : R;
      const a = ((rot + (i * 180) / n) * Math.PI) / 180;
      d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rr).toFixed(1) + ' ' + (cy + Math.sin(a) * rr).toFixed(1);
    }
    return d + 'Z';
  }
  function sparkD(cx, cy, r) {
    return `M${cx} ${cy - r}Q${cx} ${cy} ${cx + r} ${cy}Q${cx} ${cy} ${cx} ${cy + r}Q${cx} ${cy} ${cx - r} ${cy}Q${cx} ${cy} ${cx} ${cy - r}Z`;
  }
  function heartD(x, y, s) {
    return `M${x} ${y + s * 0.45}C${x + s * 1.1} ${y - s * 0.25} ${x + s * 0.55} ${y - s * 1.05} ${x} ${y - s * 0.4}C${x - s * 0.55} ${y - s * 1.05} ${x - s * 1.1} ${y - s * 0.25} ${x} ${y + s * 0.45}Z`;
  }
  const face = (cx, cy, k = 1) => `
    <circle cx="${cx - 6 * k}" cy="${cy}" r="${2.2 * k}" fill="${N}" stroke="none"/>
    <circle cx="${cx + 6 * k}" cy="${cy}" r="${2.2 * k}" fill="${N}" stroke="none"/>
    <path d="M${cx - 3.5 * k} ${cy + 5 * k}q${3.5 * k} ${3.5 * k} ${7 * k} 0" fill="none" stroke-width="${2.4 * k}"/>
    <ellipse cx="${cx - 11 * k}" cy="${cy + 5 * k}" rx="${3 * k}" ry="${2 * k}" fill="${C.cheek}" stroke="none"/>
    <ellipse cx="${cx + 11 * k}" cy="${cy + 5 * k}" rx="${3 * k}" ry="${2 * k}" fill="${C.cheek}" stroke="none"/>`;
  const shine = (d) => `<path d="${d}" fill="none" stroke="#fff" stroke-width="3" opacity=".9"/>`;
  const svg = (body, vb = '0 0 64 64', defs = '') =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${defs ? '<defs>' + defs + '</defs>' : ''}<g stroke="${N}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;

  /* ---------------- アイコン（64×64） ---------------- */
  const I = {};
  I.crown = svg(`
    <path d="M9 46 7 20l14 11 11-17 11 17 14-11-2 26Z" fill="${C.yellow}"/>
    <rect x="8" y="44" width="48" height="10" rx="4" fill="${C.gold}"/>
    <circle cx="7" cy="19" r="4" fill="${C.pink}"/><circle cx="32" cy="12" r="4" fill="${C.mint}"/><circle cx="57" cy="19" r="4" fill="${C.pink}"/>
    <circle cx="20" cy="49" r="2.6" fill="${C.pink}" stroke-width="2"/><circle cx="32" cy="49" r="2.6" fill="${C.sky}" stroke-width="2"/><circle cx="44" cy="49" r="2.6" fill="${C.pink}" stroke-width="2"/>
    ${shine('M15 27l2 12')}`);
  I['crown-gold'] = svg(`
    <path d="${sparkD(10, 12, 7)}" fill="${C.yellow}" stroke-width="2"/><path d="${sparkD(55, 9, 5)}" fill="#fff" stroke-width="2"/>
    <path d="M10 50 8 26l13 10 11-16 11 16 13-10-2 24Z" fill="${C.gold}"/>
    <rect x="9" y="48" width="46" height="9" rx="4" fill="${C.yellow}"/>
    <path d="${heartD(32, 39, 6)}" fill="${C.rose}" stroke-width="2"/>
    ${shine('M16 32l2 12')}`);
  I.star = svg(`<path d="${starD(32, 35, 28, 13)}" fill="${C.yellow}"/>${face(32, 36, 0.9)}`);
  I.rocket = svg(`
    <path d="M22 35 10 48l13-2Z" fill="${C.pink}"/><path d="M42 35l12 13-13-2Z" fill="${C.pink}"/>
    <path d="M27 45q5 17 10 0Z" fill="${C.orange}"/>
    <path d="M32 4c11 8 14 23 10 41H22C18 27 21 12 32 4Z" fill="#fff"/>
    <path d="M25 13q7-4 14 0" fill="none"/>
    <circle cx="32" cy="26" r="6.5" fill="${C.sky}"/>${shine('M29 23q1-2 3-2.5')}`);
  I.rose = svg(`
    <path d="M32 38v20" fill="none"/>
    <path d="M32 52c-10-1-15-7-16-13 9 0 14 5 16 13Z" fill="${C.green}"/>
    <path d="M32 46c6-1 11-5 12-10-7 0-11 4-12 10Z" fill="${C.green}"/>
    <path d="M16 22c0-10 7-15 16-15s16 5 16 15c0 10-7 17-16 17S16 32 16 22Z" fill="${C.rose}"/>
    <path d="M25 19c2-6 11-6 13 0-1 5-8 6-10 2" fill="none" stroke-width="2.6"/>
    <path d="M20 25c5 7 19 7 24-2" fill="none" stroke-width="2.6"/>${shine('M21 15q2-3 5-4')}`);
  I.tiara = svg(`
    <path d="M24 32 32 22l8 10" fill="none"/>
    <path d="M7 46c6-11 15-16 25-16s19 5 25 16c-8-4-16-6-25-6S15 42 7 46Z" fill="#EEF0FF"/>
    <path d="M32 6l8 12-8 10-8-10Z" fill="${C.lilac}"/>
    <circle cx="17" cy="37" r="3.4" fill="${C.sky}"/><circle cx="47" cy="37" r="3.4" fill="${C.sky}"/>
    ${shine('M29 13l3-4')}`);
  I.wand = svg(`<path d="M12 54 36 30" stroke-width="7"/><path d="M12 54 36 30" stroke="${C.pink}" stroke-width="3"/><path d="${starD(42, 22, 17, 8)}" fill="${C.yellow}"/><path d="${sparkD(56, 46, 5)}" fill="#fff" stroke-width="2"/><path d="${sparkD(20, 12, 4)}" fill="#fff" stroke-width="2"/>`);
  I.apple = svg(`
    <path d="M32 18c-6-5-21-4-22 10-1 14 9 27 22 25 13 2 23-11 22-25-1-14-16-15-22-10Z" fill="${C.red}"/>
    <path d="M32 18c0-5 2-9 5-11" fill="none"/>
    <path d="M36 12c6-6 14-4 15 0-5 5-12 5-15 0Z" fill="${C.green}"/>
    ${face(32, 34)}${shine('M16 28q1-5 5-7')}`);
  I.slipper = svg(`
    <path d="M8 46C8 38 16 36 24 36c8 0 14-6 20-14l10-2c3 6 3 12 0 16l-2 20h-5l-1-14c-10 2-20 8-30 9-5 0-8-2-8-5Z" fill="#D6EEFF"/>
    <path d="M24 36c8 0 14-5 18-10" fill="none" stroke="#fff" stroke-width="2.6"/>
    <path d="${sparkD(16, 18, 7)}" fill="#fff" stroke-width="2"/><path d="${sparkD(30, 10, 4)}" fill="${C.yellow}" stroke-width="2"/><path d="${heartD(26, 44, 3.5)}" fill="${C.pink}" stroke="none"/>`);
  I.shield = svg(`
    <path d="M32 5 55 13v17c0 15-10 25-23 29C19 55 9 45 9 30V13Z" fill="${C.red}"/>
    <path d="${starD(32, 31, 14, 6.5)}" fill="${C.yellow}"/>${shine('M16 18v10')}`);
  I.helmet = svg(`
    <path d="M46 12l6-8" fill="none"/><circle cx="53" cy="4.5" r="3.5" fill="${C.yellow}"/>
    <rect x="16" y="50" width="32" height="10" rx="4" fill="${C.pink}"/>
    <circle cx="32" cy="30" r="22" fill="#fff"/>
    <rect x="15" y="19" width="34" height="22" rx="11" fill="${N}"/>
    <path d="M21 26q3-4 8-4" fill="none" stroke="#fff"/><circle cx="41" cy="33" r="2" fill="${C.sky}" stroke="none"/>`);
  I.angel = svg(`
    <ellipse cx="32" cy="11" rx="15" ry="5.5" fill="none" stroke-width="8"/><ellipse cx="32" cy="11" rx="15" ry="5.5" fill="none" stroke="${C.yellow}" stroke-width="3.5"/>
    <path d="M29 40c-6-11-19-14-25-7 2 9 11 15 23 13Z" fill="#fff"/><path d="M35 40c6-11 19-14 25-7-2 9-11 15-23 13Z" fill="#fff"/>
    <path d="M12 36q6-1 11 3M52 36q-6-1-11 3" fill="none" stroke-width="2"/>
    <path d="${heartD(32, 44, 9)}" fill="${C.pink}"/>`);
  I.cyber = svg(`
    <path d="M5 24h54v9c0 7-5 11-11 11h-8c-4 0-6-4-8-6-2 2-4 6-8 6h-8C10 44 5 40 5 33Z" fill="url(#gcy)"/>
    <path d="M11 30l8-4M14 35l12-6M40 30l8-4" fill="none" stroke="#fff" stroke-width="2.6"/>
    <path d="${sparkD(55, 12, 6)}" fill="#fff" stroke-width="2"/>`, '0 0 64 64',
    `<linearGradient id="gcy" x1="0" x2="1"><stop offset="0" stop-color="#FF7BD5"/><stop offset=".5" stop-color="#B78CFF"/><stop offset="1" stop-color="#5EE7F2"/></linearGradient>`);
  I.museum = svg(`
    <rect x="7" y="9" width="50" height="46" rx="5" fill="${C.gold}"/>
    <rect x="15" y="17" width="34" height="30" rx="2" fill="${C.sky}"/>
    <path d="M15 40c8-8 14-8 20-2 4-4 9-5 14-1v10H15Z" fill="${C.green}" stroke-width="2.4"/>
    <circle cx="40" cy="26" r="4" fill="${C.yellow}" stroke-width="2.4"/>
    <circle cx="10" cy="12" r="1.6" fill="#fff" stroke="none"/><circle cx="54" cy="52" r="1.6" fill="#fff" stroke="none"/>`);
  I.teacup = svg(`
    <g transform="rotate(14 46 20)"><rect x="35" y="5" width="22" height="30" rx="4" fill="#fff"/><path d="${heartD(46, 21, 5.5)}" fill="${C.red}" stroke="none"/></g>
    <ellipse cx="29" cy="55" rx="23" ry="5" fill="${C.sky}"/>
    <path d="M46 33c9 0 9 11 0 11" fill="none" stroke-width="4"/>
    <path d="M11 29h36v6c0 10-8 18-18 18S11 45 11 35Z" fill="${C.yellow}"/>
    <path d="M17 36h24" fill="none" stroke="${C.lilac}" stroke-width="3"/>
    <path d="M21 22q-3-4 0-8M30 21q-3-4 0-8" fill="none" stroke-width="2.4"/>`);
  I.leaf = svg(`
    <path d="M9 55C9 28 28 9 55 9c0 27-19 46-46 46Z" fill="${C.green}"/>
    <path d="M13 51 41 23M27 37l-1-10M34 30l9 1" fill="none" stroke-width="2.6"/>
    <path d="${sparkD(50, 47, 7)}" fill="${C.yellow}" stroke-width="2"/><path d="${sparkD(41, 56, 3.5)}" fill="#fff" stroke-width="1.8"/>`);
  I.ribbon = svg(`
    <path d="M29 33 21 55l7-3 4 6 1-23Z" fill="${C.pink}"/><path d="M35 33l8 22-7-3-4 6-1-23Z" fill="${C.pink}"/>
    <path d="M32 31C24 15 7 13 7 24s11 17 25 7Z" fill="${C.pink}"/><path d="M32 31c8-16 25-18 25-7s-11 17-25 7Z" fill="${C.pink}"/>
    <path d="M13 22q3-3 8-2M51 22q-3-3-8-2" fill="none" stroke="#fff" stroke-width="2.6"/>
    <circle cx="32" cy="31" r="6.5" fill="${C.rose}"/>`);
  I.hologram = svg(`
    <path d="${sparkD(30, 32, 25)}" fill="url(#gho)"/>
    <path d="${sparkD(53, 13, 7)}" fill="${C.yellow}" stroke-width="2"/><path d="${sparkD(52, 52, 5)}" fill="#fff" stroke-width="2"/>
    ${shine('M25 22q3-3 5-9')}`, '0 0 64 64',
    `<linearGradient id="gho" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF9BD0"/><stop offset=".5" stop-color="#C3A6FF"/><stop offset="1" stop-color="#7CF0F5"/></linearGradient>`);
  I.flame = svg(`
    <path d="M32 59c-13 0-19-8-19-18 0-11 9-15 9-25 6 4 8 10 8 14 2-6 6-10 6-19 11 8 15 19 15 30 0 10-6 18-19 18Z" fill="${C.orange}"/>
    <path d="M32 56c-7 0-10-4-10-9 0-6 5-9 6-13 3 3 4 6 4 9 2-2 4-5 4-9 4 4 6 8 6 12 0 6-3 10-10 10Z" fill="${C.yellow}" stroke-width="2.4"/>
    <circle cx="28" cy="46" r="1.8" fill="${N}" stroke="none"/><circle cx="36" cy="46" r="1.8" fill="${N}" stroke="none"/>
    <path d="M30 50q2 2 4 0" fill="none" stroke-width="2"/>`);
  I.cat = svg(`
    <path d="M11 52c-4-10-3-21 2-27L11 7l15 11c4-1 8-1 12 0L53 7l-2 18c5 6 6 17 2 27-9 7-33 7-42 0Z" fill="#fff"/>
    <path d="M15 13l1 9 6-4ZM49 13l-1 9-6-4Z" fill="${C.pink}" stroke="none"/>
    <path d="M21 36q4-4 8 0M35 36q4-4 8 0" fill="none"/>
    <path d="M30 42h4l-2 2.5Z" fill="${C.pink}" stroke-width="2"/>
    <path d="M6 40l12 2M6 47l12-2M58 40l-12 2M58 47l-12-2" fill="none" stroke-width="2.2"/>
    <ellipse cx="19" cy="44" rx="3" ry="2" fill="${C.cheek}" stroke="none"/><ellipse cx="45" cy="44" rx="3" ry="2" fill="${C.cheek}" stroke="none"/>`);
  I.bunny = svg(`
    <path d="M22 34C14 22 13 5 20 4s11 16 9 30Z" fill="#fff"/><path d="M42 34c8-12 9-29 2-30s-11 16-9 30Z" fill="#fff"/>
    <path d="M22 28c-4-8-4-17-1-18 3 1 5 10 5 18Z M42 28c4-8 4-17 1-18-3 1-5 10-5 18Z" fill="${C.pink}" stroke="none"/>
    <ellipse cx="32" cy="44" rx="20" ry="16" fill="#fff"/>${face(32, 44, 0.85)}`);
  I.heart = svg(`<path d="${heartD(32, 34, 26)}" fill="${C.pink}"/>${shine('M16 22q2-5 7-6')}`);
  I.sparkle = svg(`<path d="${sparkD(28, 34, 22)}" fill="${C.yellow}"/><path d="${sparkD(52, 14, 8)}" fill="#fff" stroke-width="2"/><path d="${sparkD(51, 50, 5)}" fill="${C.pink}" stroke-width="2"/>`);
  /* ハロウィン */
  I.pumpkin = svg(`
    <path d="M32 16c0-5 2-9 6-11" fill="none" stroke-width="3.5"/>
    <path d="M36 11c4-4 10-3 12 0-4 3-9 4-12 0Z" fill="${C.green}"/>
    <path d="M32 16c-6-3-14-3-19 2-7 7-7 25 1 32 6 5 13 4 18 1 5 3 12 4 18-1 8-7 8-25 1-32-5-5-13-5-19-2Z" fill="${C.orange}"/>
    <path d="M24 18c-5 8-5 24 0 32M40 18c5 8 5 24 0 32" fill="none" stroke-width="2.4"/>
    <path d="M20 33l4-6 4 6Z M36 33l4-6 4 6Z" fill="${N}" stroke-width="2"/>
    <path d="M22 40q10 8 20 0" fill="none"/>
    <ellipse cx="17" cy="40" rx="3" ry="2" fill="${C.cheek}" stroke="none"/><ellipse cx="47" cy="40" rx="3" ry="2" fill="${C.cheek}" stroke="none"/>`);
  I.ghost = svg(`
    <path d="M14 55V28C14 16 22 8 32 8s18 8 18 20v27l-6-5-6 5-6-5-6 5-6-5Z" fill="#fff"/>
    <ellipse cx="26" cy="28" rx="2.6" ry="3.6" fill="${N}" stroke="none"/><ellipse cx="38" cy="28" rx="2.6" ry="3.6" fill="${N}" stroke="none"/>
    <ellipse cx="32" cy="37" rx="3" ry="3.6" fill="${C.pink}" stroke-width="2"/>
    <ellipse cx="20" cy="34" rx="3" ry="2" fill="${C.cheek}" stroke="none"/><ellipse cx="44" cy="34" rx="3" ry="2" fill="${C.cheek}" stroke="none"/>
    ${shine('M20 18q3-5 8-6')}`);
  I.bat = svg(`
    <path d="M26 31C20 21 10 19 3 23c5 2 6 7 5 10 4-2 9-1 11 3 2-3 5-4 8-3Z" fill="${C.lilac}"/>
    <path d="M38 31c6-10 16-12 23-8-5 2-6 7-5 10-4-2-9-1-11 3-2-3-5-4-8-3Z" fill="${C.lilac}"/>
    <path d="M24 25l1-10 5 6Z M40 25l-1-10-5 6Z" fill="#8E6FD6"/>
    <ellipse cx="32" cy="33" rx="10" ry="12" fill="#8E6FD6"/>
    <circle cx="28" cy="31" r="2.8" fill="#fff" stroke-width="1.6"/><circle cx="36" cy="31" r="2.8" fill="#fff" stroke-width="1.6"/>
    <circle cx="28.5" cy="31.5" r="1.2" fill="${N}" stroke="none"/><circle cx="36.5" cy="31.5" r="1.2" fill="${N}" stroke="none"/>
    <path d="M29 38q3 3 6 0" fill="none" stroke-width="2"/><path d="M30 38.5l1 2.5 1-2.2Z" fill="#fff" stroke="none"/>`);
  I.witch = svg(`
    <path d="M18 46c2-12 6-26 14-36 4-4 11-4 14 1-6 0-9 3-10 9l4 26Z" fill="#8E6FD6"/>
    <path d="M18 40c8 2 16 2 23 0l1 6c-8 2-17 2-25 0Z" fill="${C.orange}"/>
    <path d="M5 48c9 5 45 5 54 0-5-5-49-5-54 0Z" fill="${C.lilac}"/>
    <path d="${starD(30, 43, 5.5, 2.6)}" fill="${C.yellow}" stroke-width="2"/>
    <path d="${sparkD(52, 14, 5)}" fill="${C.yellow}" stroke-width="2"/>`);
  I.candy = svg(`
    <path d="M17 32 5 21v22Z" fill="${C.pink}"/><path d="M47 32l12-11v22Z" fill="${C.pink}"/>
    <circle cx="32" cy="32" r="16" fill="${C.yellow}"/>
    <path d="M22 21c8 4 8 18 0 22M32 16c6 6 6 26 0 32M42 21c-8 4-8 18 0 22" fill="none" stroke="${C.orange}" stroke-width="3"/>
    <circle cx="32" cy="32" r="16" fill="none"/>${shine('M22 25q2-4 6-5')}`);
  I.moon = svg(`
    <path d="M38 6a26 26 0 1 0 20 40A22 22 0 1 1 38 6Z" fill="${C.yellow}"/>
    <path d="M22 32q3 3 6 0M33 36q3 3 6 0" fill="none" stroke-width="2.4"/>
    <ellipse cx="22" cy="40" rx="3" ry="2" fill="${C.cheek}" stroke="none"/>
    <path d="${sparkD(52, 12, 5)}" fill="#fff" stroke-width="2"/>`);
  I.blackcat = svg(`
    <path d="M11 52c-4-10-3-21 2-27L11 7l15 11c4-1 8-1 12 0L53 7l-2 18c5 6 6 17 2 27-9 7-33 7-42 0Z" fill="#4A4280"/>
    <path d="M15 13l1 9 6-4ZM49 13l-1 9-6-4Z" fill="${C.pink}" stroke="none"/>
    <ellipse cx="24" cy="35" rx="4" ry="5" fill="${C.yellow}" stroke-width="2"/><ellipse cx="40" cy="35" rx="4" ry="5" fill="${C.yellow}" stroke-width="2"/>
    <path d="M24 32v6M40 32v6" fill="none" stroke-width="2"/>
    <path d="M30 43h4l-2 2.5Z" fill="${C.pink}" stroke-width="2"/>
    <path d="M6 41l12 2M6 48l12-2M58 41l-12 2M58 48l-12-2" fill="none" stroke-width="2.2"/>`);
  I.gift = svg(`
    <rect x="10" y="27" width="44" height="29" rx="4" fill="${C.pink}"/>
    <rect x="6" y="19" width="52" height="10" rx="3" fill="${C.rose}"/>
    <path d="M32 19v37" stroke-width="9"/><path d="M32 20v35" stroke="${C.yellow}" stroke-width="4"/>
    <path d="M32 19c-6-11-17-11-15-3 2 4 9 4 15 3Z M32 19c6-11 17-11 15-3-2 4-9 4-15 3Z" fill="${C.yellow}"/>`);
  I.collab = svg(`
    <path d="${heartD(22, 34, 15)}" fill="${C.pink}"/><path d="${starD(44, 30, 16, 7.5)}" fill="${C.yellow}"/>
    <path d="${sparkD(14, 12, 5)}" fill="#fff" stroke-width="2"/><path d="${sparkD(52, 54, 5)}" fill="${C.mint}" stroke-width="2"/>`);
  /* スポット */
  I.stage = svg(`
    <path d="M14 46 24 10h16l10 36Z" fill="#FFF3B0" stroke="none" opacity=".9"/>
    <ellipse cx="32" cy="49" rx="27" ry="10" fill="${C.pink}"/><ellipse cx="32" cy="47" rx="18" ry="5.5" fill="#fff"/>
    <path d="${starD(32, 24, 12, 5.5)}" fill="${C.yellow}"/>
    <path d="${sparkD(12, 16, 4)}" fill="#fff" stroke-width="2"/><path d="${sparkD(53, 20, 5)}" fill="${C.mint}" stroke-width="2"/>`);
  I.castle = svg(`
    <rect x="11" y="28" width="42" height="29" fill="${C.lilac}"/>
    <rect x="23" y="22" width="18" height="35" fill="#EEE6FF"/>
    <path d="M7 29 15 11l8 18Z M41 29l8-18 8 18Z" fill="${C.pink}"/><path d="M21 23 32 3l11 20Z" fill="${C.rose}"/>
    <path d="M27 57V47a5 5 0 0 1 10 0v10Z" fill="${N}"/>
    <circle cx="16" cy="38" r="2.6" fill="${C.yellow}" stroke-width="2"/><circle cx="48" cy="38" r="2.6" fill="${C.yellow}" stroke-width="2"/><circle cx="32" cy="33" r="3" fill="${C.sky}" stroke-width="2"/>`);
  I.dress = svg(`
    <path d="M24 6h16l-3 12 5 6-5 5 15 27H12l15-27-5-5 5-6Z" fill="${C.pink}"/>
    <path d="M22 29h20" fill="none"/><path d="${heartD(32, 26, 4)}" fill="#fff" stroke-width="2"/>
    <circle cx="22" cy="46" r="2.2" fill="#fff" stroke="none"/><circle cx="34" cy="44" r="2.2" fill="#fff" stroke="none"/><circle cx="43" cy="50" r="2.2" fill="#fff" stroke="none"/><circle cx="26" cy="52" r="2.2" fill="#fff" stroke="none"/>`);
  I.book = svg(`
    <path d="M32 17C24 10 14 10 5 12v39c9-2 19-2 27 4 8-6 18-6 27-4V12c-9-2-19-2-27 5Z" fill="${C.mint}"/>
    <path d="M32 19c-7-5-15-5-23-3v31c8-1 16 0 23 4 7-4 15-5 23-4V16c-8-2-16-2-23 3Z" fill="#fff"/>
    <path d="M32 19v32" fill="none"/>
    <path d="M14 25h12M14 31h10M38 25h12M38 31h9" fill="none" stroke-width="2.2"/>
    <path d="${sparkD(44, 41, 5)}" fill="${C.yellow}" stroke-width="2"/>`);
  I.bottle = svg(`
    <path d="M26 16c0-9 12-9 12 0Z" fill="${C.yellow}"/>
    <rect x="18" y="15" width="28" height="9" rx="3" fill="${C.sky}"/>
    <rect x="20" y="23" width="24" height="35" rx="9" fill="#fff"/>
    <path d="M26 33h6M26 40h6M26 47h6" fill="none" stroke-width="2.2"/>
    <path d="${heartD(38, 42, 5)}" fill="${C.pink}" stroke-width="2"/>`);
  I.controller = svg(`
    <path d="M14 20h36c7 0 11 7 11 18s-4 17-10 17c-5 0-7-7-11-9H24c-4 2-6 9-11 9-6 0-10-6-10-17s4-18 11-18Z" fill="${C.sky}"/>
    <path d="M16 30v10M11 35h10" fill="none" stroke-width="3.5"/>
    <circle cx="45" cy="31" r="3.2" fill="${C.pink}" stroke-width="2"/><circle cx="51" cy="37" r="3.2" fill="${C.yellow}" stroke-width="2"/>`);

  /* ---------------- 写真デコ用スタンプ ---------------- */
  const S = [];
  const add = (id, name, body, vb = '0 0 64 64', w = 0.3, defs = '') => S.push({ id, name, svg: svg(body, vb, defs), w });
  add('neko', 'ねこみみ', `
    <path d="M14 66C16 44 20 24 30 8c12 10 24 24 32 42" fill="none" stroke-width="5"/>
    <path d="M28 24c-2 10-3 20-2 30 9-4 16-8 23-10Z" fill="${C.pink}" stroke="none"/>
    <path d="M146 66c-2-22-6-42-16-58-12 10-24 24-32 42" fill="none" stroke-width="5"/>
    <path d="M132 24c2 10 3 20 2 30-9-4-16-8-23-10Z" fill="${C.pink}" stroke="none"/>`, '0 0 160 72', 0.5);
  add('usagi', 'うさみみ', `
    <path d="M44 96C26 70 22 18 38 8s26 40 22 88Z" fill="#FFE3EE"/><path d="M42 80c-8-18-10-48-2-56 8 6 10 38 8 56Z" fill="${C.pink}" stroke="none"/>
    <path d="M96 96c18-26 22-78 6-88S76 48 80 96Z" fill="#FFE3EE"/><path d="M98 80c8-18 10-48 2-56-8 6-10 38-8 56Z" fill="${C.pink}" stroke="none"/>
    <path d="M70 84C62 70 46 70 46 80s14 14 24 4Z" fill="${C.rose}"/><path d="M70 84c8-14 24-14 24-4s-14 14-24 4Z" fill="${C.rose}"/><circle cx="70" cy="84" r="6" fill="${C.pink}"/>`, '0 0 140 100', 0.45);
  add('crown', 'おうかん', I.crown.replace(/^<svg[^>]*><g[^>]*>|<\/g><\/svg>$/g, ''), '0 0 64 64', 0.32);
  add('tiara', 'ティアラ', I.tiara.replace(/^<svg[^>]*><g[^>]*>|<\/g><\/svg>$/g, ''), '0 0 64 64', 0.32);
  add('ribbon', 'リボン', I.ribbon.replace(/^<svg[^>]*><g[^>]*>|<\/g><\/svg>$/g, ''), '0 0 64 64', 0.28);
  add('halo', '天使のわっか', `
    <ellipse cx="60" cy="22" rx="52" ry="14" fill="none" stroke="#FFF4C2" stroke-width="16" opacity=".55"/>
    <ellipse cx="60" cy="22" rx="52" ry="14" fill="none" stroke-width="10"/><ellipse cx="60" cy="22" rx="52" ry="14" fill="none" stroke="${C.yellow}" stroke-width="5"/>`, '0 0 120 44', 0.38);
  add('wings', 'てんしのはね', `
    <path d="M96 60C80 30 50 10 10 18c4 18 18 26 30 28-10 4-16 12-14 22 18 4 40 0 70-8Z" fill="#fff"/>
    <path d="M24 30q20 0 40 14M34 54q22-2 46-2" fill="none" stroke-width="2.4"/>
    <path d="M104 60c16-30 46-50 86-42-4 18-18 26-30 28 10 4 16 12 14 22-18 4-40 0-70-8Z" fill="#fff"/>
    <path d="M176 30q-20 0-40 14M166 54q-22-2-46-2" fill="none" stroke-width="2.4"/>`, '0 0 200 84', 0.7);
  add('flower', 'お花のかんむり', [0, 1, 2, 3, 4, 5].map((i) => {
    const x = 16 + i * 25.6, y = 26 + Math.abs(2.5 - i) * 5;
    const col = [C.pink, '#fff', C.yellow, C.lilac, '#fff', C.pink][i];
    return `<path d="M${x - 14} ${y + 6}q8 8 16 2" fill="${C.green}"/>` + [0, 72, 144, 216, 288].map((a) => `<circle cx="${(x + Math.cos(a * Math.PI / 180) * 7).toFixed(1)}" cy="${(y + Math.sin(a * Math.PI / 180) * 7).toFixed(1)}" r="6.5" fill="${col}" stroke-width="2.4"/>`).join('') + `<circle cx="${x}" cy="${y}" r="4" fill="${C.gold}" stroke-width="2"/>`;
  }).join(''), '0 0 160 56', 0.5);
  add('heart-glasses', 'ハートめがね', `
    <path d="M58 30h24" fill="none" stroke-width="5"/>
    <path d="${heartD(32, 34, 26)}" fill="${C.pink}" fill-opacity=".85"/><path d="${heartD(108, 34, 26)}" fill="${C.pink}" fill-opacity=".85"/>
    ${shine('M18 22q3-5 9-6')}${shine('M94 22q3-5 9-6')}`, '0 0 140 60', 0.45);
  add('whisker', 'ひげ＆はな', `
    <path d="M72 18h16l-8 9Z" fill="${C.pink}"/>
    <path d="M4 10l50 12M2 28l52-2M8 46l46-14M156 10l-50 12M158 28l-52-2M152 46l-46-14" fill="none" stroke-width="3.5"/>`, '0 0 160 56', 0.42);
  add('cheek', 'ほっぺ', `
    <ellipse cx="22" cy="20" rx="18" ry="11" fill="${C.cheek}" stroke="none" opacity=".85"/><ellipse cx="118" cy="20" rx="18" ry="11" fill="${C.cheek}" stroke="none" opacity=".85"/>
    <path d="M12 16l4 8M20 14l4 8M28 16l4 8M108 16l4 8M116 14l4 8M124 16l4 8" fill="none" stroke="#fff" stroke-width="2.6"/>`, '0 0 140 40', 0.4);
  add('star', 'にこにこ星', I.star.replace(/^<svg[^>]*><g[^>]*>|<\/g><\/svg>$/g, ''), '0 0 64 64', 0.2);
  add('heart', 'ハート', I.heart.replace(/^<svg[^>]*><g[^>]*>|<\/g><\/svg>$/g, ''), '0 0 64 64', 0.18);
  add('sparkle', 'キラキラ', I.sparkle.replace(/^<svg[^>]*><g[^>]*>|<\/g><\/svg>$/g, ''), '0 0 64 64', 0.2);
  add('rose', 'バラ', I.rose.replace(/^<svg[^>]*><g[^>]*>|<\/g><\/svg>$/g, ''), '0 0 64 64', 0.2);
  add('wand', 'まほうのステッキ', I.wand.replace(/^<svg[^>]*><g[^>]*>|<\/g><\/svg>$/g, ''), '0 0 64 64', 0.25);
  add('apple', 'りんご', I.apple.replace(/^<svg[^>]*><g[^>]*>|<\/g><\/svg>$/g, ''), '0 0 64 64', 0.18);
  add('rocket', 'ロケット', I.rocket.replace(/^<svg[^>]*><g[^>]*>|<\/g><\/svg>$/g, ''), '0 0 64 64', 0.22);
  add('bubble', 'ふきだし', `
    <path d="M20 6h120c8 0 14 6 14 14v24c0 8-6 14-14 14H64l-16 14 2-14H20c-8 0-14-6-14-14V20c0-8 6-14 14-14Z" fill="#fff"/>
    <text x="80" y="40" text-anchor="middle" font-family="'Hiragino Maru Gothic ProN','Zen Maru Gothic',sans-serif" font-weight="900" textLength="124" lengthAdjust="spacingAndGlyphs" font-size="22" fill="${N}" stroke="none">なりきり中！</text>`, '0 0 160 76', 0.45);
  add('daisuki', 'だいすき', `
    <text x="62" y="40" text-anchor="middle" font-family="'Hiragino Maru Gothic ProN','Zen Maru Gothic',sans-serif" font-weight="900" textLength="112" lengthAdjust="spacingAndGlyphs" font-size="34" fill="${C.pink}" stroke="#fff" stroke-width="8" paint-order="stroke">だいすき</text>
    <path d="${heartD(130, 20, 8)}" fill="${C.rose}" stroke-width="2"/>`, '0 0 146 54', 0.45);
  add('shuyaku', '主役はわたし', `
    <rect x="4" y="6" width="152" height="40" rx="20" fill="${C.yellow}"/>
    <text x="80" y="34" text-anchor="middle" font-family="'Hiragino Maru Gothic ProN','Zen Maru Gothic',sans-serif" font-weight="900" textLength="136" lengthAdjust="spacingAndGlyphs" font-size="20" fill="${N}" stroke="none">今日の主役はわたし</text>`, '0 0 160 52', 0.5);
  add('cloud', 'くも', `
    <path d="M30 64c-14 0-24-8-24-20 0-10 8-18 20-18 2-12 14-20 28-20 12 0 22 6 26 16 4-2 8-3 12-3 14 0 24 10 24 24 0 12-10 21-24 21Z" fill="#fff"/>
    ${face(66, 42)}`, '0 0 124 70', 0.35);
  add('rainbow', 'にじ', `
    <path d="M6 66a54 54 0 0 1 108 0" fill="none" stroke-width="22"/>
    <path d="M6 66a54 54 0 0 1 108 0" fill="none" stroke="${C.pink}" stroke-width="16"/>
    <path d="M14 66a46 46 0 0 1 92 0" fill="none" stroke="${C.yellow}" stroke-width="6"/>
    <path d="M22 66a38 38 0 0 1 76 0" fill="none" stroke="${C.mint}" stroke-width="6"/>`, '0 0 120 70', 0.45);

  /* ハロウィン用スタンプ */
  const inner = (k) => I[k].replace(/^<svg[^>]*><g[^>]*>|<\/g><\/svg>$/g, '');
  add('h-pumpkin', 'かぼちゃ', inner('pumpkin'), '0 0 64 64', 0.22);
  add('h-ghost', 'おばけ', inner('ghost'), '0 0 64 64', 0.2);
  add('h-bat', 'こうもり', inner('bat'), '0 0 64 64', 0.22);
  add('h-witch', 'まじょのぼうし', inner('witch'), '0 0 64 64', 0.32);
  add('h-candy', 'キャンディ', inner('candy'), '0 0 64 64', 0.18);
  add('h-moon', 'おつきさま', inner('moon'), '0 0 64 64', 0.2);
  add('h-cat', 'くろねこみみ', `
    <path d="M14 66C16 44 20 24 30 8c12 10 24 24 32 42Z" fill="#4A4280"/>
    <path d="M28 26c-2 9-3 18-2 26 8-3 14-7 20-9Z" fill="${C.pink}" stroke="none"/>
    <path d="M146 66c-2-22-6-42-16-58-12 10-24 24-32 42Z" fill="#4A4280"/>
    <path d="M132 26c2 9 3 18 2 26-8-3-14-7-20-9Z" fill="${C.pink}" stroke="none"/>`, '0 0 160 72', 0.5);
  add('h-trick', 'Trick or Treat', `
    <text x="90" y="40" text-anchor="middle" font-family="'Hiragino Maru Gothic ProN','Zen Maru Gothic',sans-serif" font-weight="900" textLength="168" lengthAdjust="spacingAndGlyphs" font-size="30" fill="${C.orange}" stroke="${N}" stroke-width="7" paint-order="stroke">Trick or Treat!</text>`, '0 0 180 54', 0.55);
  add('h-happy', 'ハッピーハロウィン', `
    <rect x="4" y="6" width="172" height="42" rx="21" fill="#8E6FD6"/>
    <text x="90" y="35" text-anchor="middle" font-family="'Hiragino Maru Gothic ProN','Zen Maru Gothic',sans-serif" font-weight="900" textLength="150" lengthAdjust="spacingAndGlyphs" font-size="21" fill="#fff" stroke="none">ハッピーハロウィン</text>`, '0 0 180 54', 0.55);

  /* ---------- 画像に変換 ---------- */
  const imgCache = {};
  function sized(svgText, scale) {
    const m = svgText.match(/viewBox="([\d.\s-]+)"/);
    const vb = m ? m[1].trim().split(/\s+/).map(Number) : [0, 0, 64, 64];
    return { text: svgText.replace('<svg ', `<svg width="${vb[2] * scale}" height="${vb[3] * scale}" `), aspect: vb[2] / vb[3] };
  }
  function toImage(svgText, scale = 6) {
    const key = scale + svgText;
    if (imgCache[key]) return imgCache[key];
    const { text, aspect } = sized(svgText, scale);
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(text)));
    img.aspect = aspect;
    imgCache[key] = img;
    return img;
  }
  const icon = (key) => I[key] || I.sparkle;

  const HS = S.filter((x) => x.id.startsWith('h-'));
  const ST = HS.concat(S.filter((x) => !x.id.startsWith('h-')));
  window.NRL_ART = { icons: I, stickers: ST, icon, toImage, colors: C, ink: N };
})();
