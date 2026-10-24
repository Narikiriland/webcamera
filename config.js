/* ==========================================================
   近未来なりきりランド ― 設定ファイル
   売り場の数・QRコード・特別衣装の対応はここだけで変更できます
   ========================================================== */
window.NRL_CONFIG = {
  eventName: '近未来なりきりランド',
  eventNameEn: 'Kinmirai Narikiri Land',
  storeLabel: '子供服・おもちゃ売り場',   // ヘッダーと写真のフチに表示
  hashtag: '#近未来なりきりランド',
  period: '',                                    // 例: '2026.11.1 ― 12.25'（空なら非表示）

  // 公開URL（例: 'https://your-name.github.io/narikiri-land/'）
  // 空のままなら qr.html を開いたページのURLを自動で使います
  baseUrl: '',

  // 高島屋の公式ロゴ画像（許諾を得た素材を assets/ に置いてください）。無ければ文字表示
  logoImage: 'assets/logo.png',

  storageKey: 'nrl-halloween-v1',

  /* ---------- ハロウィンスタンプラリー ----------
     売り場のどのQRを読んでも「その日のスタンプ」が1こ押されます（1日1こ）
     goal 回（＝別々の日に goal 回来店）でクリア → お菓子のプレゼント
  */
  rally: {
    name: 'ハロウィンスタンプラリー',
    goal: 3,
    prize: 'お菓子',
    clearMessage: 'このがめんを売り場のスタッフに見せてね。お菓子をプレゼント！'
  },

  /* ---------- QRスポット（どれを読んでもその日のスタンプ） ----------
     token: QRコードに入る合言葉（推測されにくい文字列に変更推奨）
  */
  spots: [
    { id: 'stage',        token: 'stg-7q4m', name: 'なりきりステージ', place: '子供服売り場・床の円',   icon: 'stage', color: '#FF7BA9' },
    { id: 'toy-castle',   token: 'toy-k2x9', name: 'おもちゃのお城',   place: 'おもちゃ売り場',         icon: 'castle', color: '#C3A6FF' },
    { id: 'boutique',     token: 'btq-r5n3', name: 'キッズブティック', place: '子供服売り場',           icon: 'dress', color: '#FF7BA9' },
    { id: 'picture-book', token: 'bk-8w1z',  name: 'えほんの森',       place: '絵本コーナー',           icon: 'book', color: '#7FD8C6' },
    { id: 'baby',         token: 'bb-3h6t',  name: 'ゆめいろベビー',   place: 'ベビー用品売り場',       icon: 'bottle', color: '#FFB3CF' },
    { id: 'hobby',        token: 'hb-9p2v',  name: 'ホビーラボ',       place: 'ホビー・ゲーム売り場',   icon: 'controller', color: '#8FD3F4' },
    { id: 'hero-base',    token: 'hr-4c7k',  name: 'ヒーロー基地',     place: 'キャラクター玩具売り場', icon: 'shield', color: '#FFA94D' }
  ],

  /* ==========================================================
     コラボ限定（購入者限定）
     有名キャラクターとのコラボ衣装・フレーム・スタンプは、権利者から許諾を受けた
     公式画像（背景透過PNG）を assets/collab/ に置くと表示されます。
     レジでお渡しする「購入者限定QR」（?p=合言葉）を読むと使えるようになります。
     ========================================================== */
  collab: {
    enabled: true,
    label: 'コラボ限定',
    tokens: ['buy-6w2r'],          // 購入者限定QRの合言葉（期間ごとに変えるのがおすすめ）
    costumes: [
      // 例）頭・体のパーツと、画面全体にかぶせるフレーム（どれか1つでもOK）
      { id: 'collab-1', name: 'コラボ衣装', icon: 'collab',
        parts: { head: { src: 'assets/collab/costume1-head.png', width: 1.0, y: 0.8 }, body: { src: 'assets/collab/costume1-body.png', width: 1.8, top: 0.1 } },
        overlay: 'assets/collab/costume1-frame.png' }
    ],
    frames: [
      { id: 'collab-frame-1', name: 'コラボフレーム', src: 'assets/collab/frame1.png' }
    ],
    stickers: [
      { id: 'collab-sticker-1', name: 'コラボスタンプ', src: 'assets/collab/sticker1.png', w: 0.35 }
    ]
  },

  /* ==========================================================
     高島屋公式キャラクター（ローズちゃん）の素材
     公式キャラクターはこのサイトでは描いていません。
     高島屋さまから提供された「背景透過PNG」を assets/ に置くと自動で有効になります。
     ファイルが無いものは画面に出ません。
     ========================================================== */

  // ① ローズちゃんの衣装（カメラでお子さまに着せる）
  //    head: 頭にのせるパーツ（帽子など）  width: 頭の幅に対する倍率 / y: 上下位置
  //    body: 肩から下に重ねるパーツ（お洋服）  width: 肩幅に対する倍率 / top: 肩からの位置
  officialCostumes: [
    {
      id: 'rose-chan-coord', name: 'ローズちゃんコーデ', icon: 'rose', cat: 'kids', lock: null,
      particles: 'petal', filter: 'glow',
      parts: {
        head: { src: 'assets/rosechan-head.png', width: 0.9, y: 0.75 },
        body: { src: 'assets/rosechan-dress.png', width: 1.8, top: 0.15 }
      }
    }
  ],

  // ② お子さまの横に並んで写る（全身画像）
  officialImages: [
    { id: 'rose-chan', name: 'ローズちゃんといっしょ', icon: 'rose', src: 'assets/rose-chan.png', placement: 'beside', lock: null }
  ],

  // ③ 写真デコ用のスタンプ（ポーズ違いなど何枚でも）
  officialStickers: [
    { id: 'rose-chan-sticker', name: 'ローズちゃん', src: 'assets/rose-chan.png', w: 0.35 },
    { id: 'rose-chan-sticker2', name: 'ローズちゃん2', src: 'assets/rose-chan-2.png', w: 0.35 }
  ]
};
