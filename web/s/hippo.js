// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The American Hippo Bill" — H.R. 23261, Louisiana, 1910 (+ Colombia's wild hippos today). 64 s TikTok. Timed via hippo_timing.js.
import { TOTAL, LINES, wf } from './hippo_timing.js';
import * as PR from '../props.js';
import { INK } from '../toon.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], cut = (i) => Math.max(0, A(i) - 4);
const W = wf;
const F_RANCH = W(0, 'ranches'), F_WEEDS = W(1, 'weeds'), F_AMER = W(1, 'americans'), F_HYA = W(2, 'hyacinth'), F_1884 = W(2, '1884'), F_FAIR = W(2, 'fair'),
  F_FAST = W(3, 'fast'), F_STUCK = W(3, 'stuck'), F_MEAT = W(4, 'meat'), F_1910 = W(5, '1910'), F_BROU = W(5, 'robert'), F_BILL = W(5, 'bill'), F_IMPORT = W(5, 'import'), F_TWO = W(5, 'two'),
  F_STR = W(6, 'stranger'), F_ENEM = W(7, 'enemies'), F_WAR = W(7, 'war'), F_SPY = W(7, 'spy'), F_TEAM = W(8, 'teamed'), F_SELL = W(8, 'sell'),
  F_EXPERT = W(9, 'government'), F_MILL = W(9, 'million'), F_PORK = W(10, 'pork'), F_BEEF = W(10, 'beef'), F_NYT = W(11, 'new'), F_BACON = W(11, 'lake'),
  F_BURGER = W(12, 'hippo'), F_TR = W(13, 'theodore'), F_BACK = W(13, 'backed'), F_WHERE = W(14, 'where'), F_NOWHERE = W(15, 'nowhere'), F_DIED = W(15, 'died'), F_NOT = W(15, 'not'),
  F_AMS = W(16, 'americas'), F_ESC = W(16, 'pablo'), F_FOUR = W(16, 'four'), F_COL = W(16, 'colombia'), F_TODAY = W(17, 'today'), F_100 = W(17, 'hundred'), F_ROAM = W(17, 'roam'),
  F_FOLLOW = W(18, 'follow');
const SHOTS = [['hook', 0], ['ranch', F_RANCH - 4], ['munch', cut(1)], ['diner', F_AMER - 4], ['flower', cut(2)], ['poster', F_1884 - 4], ['stuck', cut(3)], ['meat', cut(4)],
  ['room', cut(5)], ['bill', F_BILL - 4], ['two', F_TWO - 4], ['stranger', cut(6)], ['enemies', cut(7)], ['spy', F_SPY - 8], ['team', cut(8)], ['expert', cut(9)], ['taste', cut(10)],
  ['nyt', cut(11)], ['burger', cut(12)], ['tr', cut(13)], ['where', cut(14)], ['died', cut(15)], ['empty', F_NOT - 4], ['colombia', cut(16)], ['four', F_ESC - 4], ['today', cut(17)],
  ['follow', cut(18)]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const ROOM = [100, 0, 0], SHOP = [160, 0, 0], COL = [-220, 0, 0];
const BAYOU = { az: 210, el: 30, sky: '#e8ecd8', ground: '#4a5a3a', hemi: 1.0, sun: '#fff0d0', sunI: 2.4, fog: '#cfd8c0', fogNear: 25, fogFar: 160,
  skyTop: '#5a8ac8', skyHor: '#e8ecd0', sat: 1.12, vig: 0.26, shadowExt: 22, exposure: 1.06 };
const TROP = { ...BAYOU, az: 140, el: 45, sun: '#fff4dc', sunI: 2.8, fog: '#d8ecd8', fogNear: 60, fogFar: 400, skyTop: '#2a7ad8', skyHor: '#e0f0f0', sat: 1.18, vig: 0.2 };
const IN = { az: 200, el: 40, sky: '#d8c8a8', ground: '#4a3020', hemi: 0.5, sun: '#ffe8c8', sunI: 0.0, fog: '#2e2218', fogNear: 10, fogFar: 36,
  skyTop: '#2e2218', skyHor: '#2e2218', sat: 1.06, vig: 0.32, shadowExt: 14, exposure: 1.18, bloom: 0.55, cardTint: '#fff2e2' };
let K, lampsRoom = [], lampsShop = [], boat, gavel;
const rnd = (() => { let s = 1910; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
const txtTex = (w, h, bg, fg, lines, font = 'bold 64px Georgia, serif') => PR.canvasTex(w, h, (g) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
  lines.forEach((t, i) => g.fillText(t, w / 2, h * (i + 1) / (lines.length + 1))); });
const plane = (w, h, map, x, y, z, ry = 0, parent = K.scene) => { const m = K.add(new K.THREE.PlaneGeometry(w, h), K.toon({ map, kind: 'wood', amt: 0.15, plain: true }), x, y, z, parent, { cast: false }); m.rotation.y = ry; return m; };

function swamp(parent, { hyacinth = true, tropical = false, seed = 1 } = {}) {
  const { THREE } = K, M4 = THREE.Matrix4;
  K.add(new THREE.PlaneGeometry(400, 400).rotateX(-Math.PI / 2), K.mat('grime', tropical ? '#5a8a7a' : '#4a6a52', { detail: 4, amt: 0.2, roughness: 0.25 }), 0, 0, -120, parent, { cast: false });
  // muddy banks
  for (const s of [-1, 1]) K.slab(s * 14, s * 120, -0.5, 0.35, -260, 40, K.mat('dirt', tropical ? '#8a7a4a' : '#5a4a32', { detail: 2 }), parent, false);
  if (hyacinth) { const lv = [], fl = [];
    for (let i = 0; i < 2600; i++) { const x = (rnd() - 0.5) * 28, z = 8 - rnd() * 90; if (Math.abs(x) < 3 && z > -6 && z < 6) continue;
      lv.push(new M4().makeTranslation(x, 0.06, z).multiply(new M4().makeRotationY(rnd() * 6)).multiply(new M4().makeScale(1, 0.35, 1)));
      if (rnd() < 0.5) fl.push(new M4().makeTranslation(x + 0.1, 0.32, z)); }
    K.add(PR.mergeCopies(new THREE.IcosahedronGeometry(0.32, 0), lv), K.mat('grime', '#3a8a3a', { amt: 0.4 }), 0, 0, 0, parent).frustumCulled = false;
    K.add(PR.mergeCopies(new THREE.ConeGeometry(0.1, 0.32, 6), fl), K.mat('grime', '#a86ad8', { plain: true, emissive: '#2a1040' }), 0, 0, 0, parent).frustumCulled = false; }
  // trees: cypress with moss (bayou) or palms/broadleaf (tropical)
  const bark = K.mat('wood', tropical ? '#7a5a3a' : '#6a5a48'), leaf = K.mat('grime', tropical ? '#2a8a3a' : '#4a6a3a', { amt: 0.5 }), moss = K.mat('fabric', '#9aa088', { detail: 0.3 });
  for (let i = 0; i < 60; i++) { const s = rnd() < 0.5 ? -1 : 1, x = s * (12 + rnd() * 40), z = 20 - rnd() * 160, h = 6 + rnd() * 6;
    K.cyl(0.25, 0.9, h, bark, x, 0, z, parent, 10); K.cyl(1.0, 0.25, 1.2, bark, x, 0, z, parent, 10);
    if (tropical) { for (let j = 0; j < 6; j++) { const l = K.add(new THREE.ConeGeometry(0.5, 4, 4), leaf, x, h, z, parent); l.rotation.set(1.2, j * 1.05, 0); l.position.x += Math.sin(j * 1.05) * 1.6; l.position.z += Math.cos(j * 1.05) * 1.6; } }
    else { K.sphere(2.6, leaf, x, h + 0.8, z, parent, 1.4, 0.55, 1.4); for (let j = 0; j < 4; j++) K.cyl(0.05, 0.25, 2.2, moss, x + (rnd() - 0.5) * 3, h - 2.4, z + (rnd() - 0.5) * 3, parent, 6); } }
}
function hippoTex() { return null; }

function build(k) {
  K = k; const { THREE } = K;
  K.addClouds(10, 600, 160);
  // ---------- Louisiana bayou (origin) ----------
  swamp(K.scene, { hyacinth: true });
  const post = K.mat('wood', '#7a6a50');
  for (let i = 0; i < 12; i++) { const x = -6.5 + i * 1.2; K.slab(x - 0.06, x + 0.06, -0.3, 1.3, -9.06, -8.94, post); } K.slab(-6.6, 7, 0.9, 1.0, -9.02, -8.98, post);
  plane(4.2, 1.0, txtTex(512, 120, '#e8dcc0', '#6a2a1a', ['HIPPO RANCH'], 'bold 70px Georgia, serif'), 0.3, 1.9, -8.9);
  K.slab(-0.07, 0.07, -0.3, 1.6, -8.94, -8.86, post).position.x = -1.5; K.slab(-0.07, 0.07, -0.3, 1.6, -8.94, -8.86, post).position.x = 2.1;
  // boat (stuck in the hyacinth)
  boat = K.group(); boat.position.set(-3.2, 0.05, -16); const bw = K.mat('wood', '#8a6a48', { detail: 0.8 });
  K.slab(-0.8, 0.8, 0, 0.5, -2.4, 2.4, bw, boat); K.slab(-0.7, 0.7, 0.1, 0.52, -2.2, 2.2, K.mat('wood', '#5a3a24'), boat); K.add(new THREE.ConeGeometry(0.8, 1.4, 4).rotateX(-Math.PI / 2), bw, 0, 0.25, -3.0, boat).scale.set(1, 0.35, 1);
  // ---------- committee room (ROOM) ----------
  const rm = K.group(); rm.position.set(...ROOM);
  const wall = K.mat('plaster', '#d8ccb0', { detail: 2 }), wood = K.mat('wood', '#6a3e22', { detail: 1.2 }), dark = K.mat('wood', '#4a2a16');
  K.slab(-7, 7, -0.1, 0, -6, 8, K.mat('wood', '#7a4a2a', { detail: 0.7 }), rm, false); K.slab(-7, 7, 0, 5.5, -6.2, -6, wall, rm); K.slab(-7.2, -7, 0, 5.5, -6, 8, wall, rm); K.slab(7, 7.2, 0, 5.5, -6, 8, wall, rm); K.slab(-7, 7, 5.5, 5.7, -6, 8, dark, rm);
  K.slab(-7, 7, 0, 1.2, -6, -5.9, dark, rm);
  // the committee bench (raised, curved front)
  K.slab(-5, 5, 0, 0.5, -5.8, -3.6, wood, rm); K.slab(-5, 5, 0.5, 1.6, -3.7, -3.5, wood, rm); K.slab(-5.1, 5.1, 1.6, 1.7, -3.9, -3.4, dark, rm);
  for (let i = 0; i < 7; i++) K.slab(-4.6 + i * 1.5, -4.0 + i * 1.5, 0.5, 2.2, -5.6, -5.5, K.mat('fabric', '#5a2a2a'), rm); // chair backs
  plane(5.4, 0.9, txtTex(640, 110, '#1e2a4a', '#f2d890', ['COMMITTEE ON AGRICULTURE'], 'bold 46px Georgia, serif'), 0, 4.3, -5.95, 0, rm);
  plane(3, 1.9, txtTex(320, 200, '#f4ecd8', '#3a2a1a', ['HEARING', 'H.R. 23261'], 'bold 44px Georgia, serif'), -4.2, 2.8, -5.95, 0, rm);
  // witness table
  K.slab(-1.6, 1.6, 0.78, 0.86, 0.6, 1.6, wood, rm); for (const [x, z] of [[-1.5, 0.7], [1.5, 0.7], [-1.5, 1.5], [1.5, 1.5]]) K.slab(x - 0.05, x + 0.05, 0, 0.78, z - 0.05, z + 0.05, dark, rm);
  for (let i = 0; i < 4; i++) K.slab(-1.2 + i * 0.7, -0.9 + i * 0.7, 0.86, 0.9, 0.8, 1.2, K.mat('fabric', '#f4ecd8', { plain: true }), rm);
  K.cyl(0.05, 0.08, 0.06, K.mat('metal', '#c8c8d0'), 0.6, 0.86, 1.0, rm); K.cyl(0.04, 0.04, 0.28, K.mat('metal', '#c8e0f0'), 0.9, 0.86, 1.1, rm);
  gavel = K.group(rm); gavel.position.set(0.8, 1.7, -3.65); K.slab(-0.02, 0.02, -0.02, 0.02, 0, 0.32, K.mat('wood', '#3a2010'), gavel); K.add(new THREE.CylinderGeometry(0.06, 0.06, 0.18, 12).rotateZ(Math.PI / 2), K.mat('wood', '#3a2010'), 0, 0, 0.32, gavel);
  for (const [x, z] of [[-3, -1], [3, -1]]) lampsRoom.push(K.lamp(ROOM[0] + x, 4.2, ROOM[2] + z, { color: '#ffd090', intensity: 3, distance: 11, glowS: 0.7, flicker: 0.04 }));
  for (const x of [-3, 3]) { K.slab(ROOM[0] + x - 0.02, ROOM[0] + x + 0.02, 4.4, 5.5, -1.02, -0.98, K.mat('metal', '#3a3030')); K.add(new THREE.SphereGeometry(0.22, 14, 10), new THREE.MeshBasicMaterial({ color: '#fff0c8' }), ROOM[0] + x, 4.3, -1, K.scene, { cast: false }); }
  // ---------- butcher shop / diner (SHOP) ----------
  const sh = K.group(); sh.position.set(...SHOP);
  K.slab(-5, 5, -0.1, 0, -4, 6, K.mat('rock', '#d8d0c0', { detail: 0.4 }), sh, false); K.slab(-5, 5, 0, 4, -4.2, -4, K.mat('plaster', '#e8e0c8'), sh); K.slab(-5.2, -5, 0, 4, -4, 6, K.mat('plaster', '#e0d8c0'), sh); K.slab(5, 5.2, 0, 4, -4, 6, K.mat('plaster', '#e0d8c0'), sh);
  K.slab(-5, 5, 0, 1.2, -4.0, -3.95, K.mat('rock', '#f2f2f2', { detail: 0.2 }), sh); // tiles
  K.slab(-3.5, 3.5, 0, 1.0, -1.4, -0.6, K.mat('wood', '#8a5a34'), sh); K.slab(-3.6, 3.6, 1.0, 1.08, -1.5, -0.5, K.mat('rock', '#e8e8e8', { detail: 0.3 }), sh);
  K.slab(-4, 4, 2.6, 2.66, -3.6, -3.5, K.mat('metal', '#8a8a90'), sh); for (let i = 0; i < 9; i++) { const h = K.add(new THREE.TorusGeometry(0.1, 0.02, 6, 12, Math.PI * 1.4), K.mat('metal', '#a0a0a8'), -3.5 + i * 0.85, 2.5, -3.55, sh); h.rotation.z = Math.PI * 0.8; }
  plane(3.2, 1.2, txtTex(400, 150, '#f6f0e0', '#a8302a', ['SORRY', 'NO MEAT TODAY'], 'bold 46px Georgia, serif'), 0, 3.3, -3.95, 0, sh);
  plane(1.2, 0.6, txtTex(200, 100, '#2a2a2a', '#f2e8c8', ['1910'], 'bold 56px Georgia, serif'), 3.6, 3.2, -3.95, 0, sh);
  for (let i = 0; i < 4; i++) K.cyl(0.25, 0.25, 0.04, K.mat('grime', '#f4f0e8'), -2 + i * 1.3, 1.08, -1.0, sh); // plates
  lampsShop.push(K.lamp(SHOP[0], 3.4, SHOP[2] + 0.5, { color: '#ffd8a0', intensity: 3.2, distance: 10, glowS: 0.5, flicker: 0.03 }));
  // ---------- Colombia river (COL) ----------
  const cl = K.group(); cl.position.set(...COL); swamp(cl, { hyacinth: false, tropical: true });
  for (let i = 0; i < 8; i++) K.sphere(60, K.mat('grime', i % 2 ? '#3a7a3a' : '#4a8a44', { detail: 8 }), -260 + i * 80, -20, -220 - (i % 3) * 30, cl, 1.3, 0.9, 1);
}

// ---------------- 2D ----------------
const HIP = '#9a8aa8', HIPD = '#7a6a8a', HIPB = '#c8a8b8';
/** hippo, front view; mouth 0..1 open, chew; mood 'happy'|'smug'|'shock' */
const hippo = (p, mouth = 0, mood = 'happy', munch = false) => {
  const cx = 300, by = 975;
  for (const s of [-1, 1]) { p.ell(cx + s * 150, by - 90, 60, 100, HIPD, 10); }
  p.ell(cx, by - 330, 250, 220, HIP, 12);
  p.ell(cx, by - 230, 160, 110, HIPB, 0);
  // head
  const hy = by - 560;
  for (const s of [-1, 1]) { p.ell(cx + s * 110, hy - 150, 34, 30, HIP, 9); p.ell(cx + s * 110, hy - 148, 16, 14, HIPB, 0); }
  p.ell(cx, hy - 40, 170, 140, HIP, 12);
  for (const s of [-1, 1]) { p.ell(cx + s * 70, hy - 100, 40, mood === 'smug' ? 18 : 40, '#ffffff', 8); p.dot(cx + s * 70 + (mood === 'shock' ? 0 : 6), hy - 96, mood === 'shock' ? 8 : 12); if (mood === 'smug') p.stroke([[cx + s * 70 - 40, hy - 116], [cx + s * 70 + 40, hy - 116]], 8, HIP); }
  // muzzle
  const mo = mouth * 120;
  p.ell(cx, hy + 60 + mo * 0.5, 200, 110 + mo * 0.3, HIP, 12);
  if (mouth > 0.05) { p.ell(cx, hy + 80 + mo * 0.5, 150, 30 + mo * 0.6, '#c84a6a', 6); for (const s of [-1, 1]) p.poly([[cx + s * 110, hy + 60], [cx + s * 95, hy + 60 + mo * 0.5], [cx + s * 80, hy + 60]], '#fffaf0', 4); }
  else p.stroke([[cx - 120, hy + 110], [cx, hy + 130], [cx + 120, hy + 110]], 8, INK);
  for (const s of [-1, 1]) p.ell(cx + s * 70, hy + 20, 20, 14, HIPD, 0);
  if (munch) { p.ell(cx + 60, hy + 140, 50, 26, '#3a8a3a', 6); p.ell(cx + 90, hy + 125, 22, 22, '#a86ad8', 5); }
};
const hyacinthCard = (p) => { p.stroke([[300, 960], [300, 420]], 20, '#3a7a2a'); for (const s of [-1, 1]) p.ell(300 + s * 110, 820, 120, 60, '#3a8a3a', 8);
  for (let i = 0; i < 14; i++) { const y = 200 + i * 18, x = 300 + ((i % 3) - 1) * 60; p.ell(x, y, 46, 40, i % 2 ? '#a86ad8' : '#9a5ac8', 6); p.ell(x, y - 8, 12, 10, '#f2d040', 0); } };
const poster = (p) => { p.poly([[40, 140], [560, 140], [560, 880], [40, 880]], '#f2e2b8', 12); p.g.fillStyle = '#6a2a1a'; p.g.textAlign = 'center'; p.g.font = 'bold 48px Georgia, serif'; p.g.fillText("WORLD'S FAIR", 300, 230);
  p.g.font = 'bold 40px Georgia, serif'; p.g.fillText('NEW ORLEANS', 300, 290); p.g.font = 'bold 100px Georgia, serif'; p.g.fillText('1884', 300, 410); hyacinthCardMini(p); };
const hyacinthCardMini = (p) => { for (let i = 0; i < 9; i++) { const x = 300 + ((i % 3) - 1) * 50, y = 500 + Math.floor(i / 3) * 50; p.ell(x, y, 32, 28, '#a86ad8', 5); } p.stroke([[300, 650], [300, 820]], 14, '#3a7a2a'); };
const billCard = (p, t) => { p.poly([[60, 160], [540, 160], [540, 860], [60, 860]], '#f8f2e2', 10); p.g.fillStyle = INK; p.g.textAlign = 'center'; p.g.font = 'bold 40px Georgia, serif'; p.g.fillText('H. R. 23261', 300, 240);
  p.g.font = 'bold 34px Georgia, serif'; p.g.fillText('A BILL', 300, 300); p.g.font = 'bold 50px Georgia, serif'; p.g.fillText('To import', 300, 400); p.g.fillStyle = '#7a3a9a'; p.g.font = 'bold 72px Georgia, serif'; p.g.fillText('HIPPOS', 300, 480);
  p.g.fillStyle = INK; p.g.font = 'bold 40px Georgia, serif'; p.g.fillText('into the United States', 300, 550); p.g.fillStyle = '#8a8a8a'; for (let i = 0; i < 5; i++) p.g.fillRect(110, 610 + i * 34, 380 - (i % 2) * 70, 10);
  if (t > 0) { p.g.save(); p.g.translate(300, 720); p.g.rotate(-0.15); p.g.globalAlpha = Math.min(1, t * 1.5); p.g.strokeStyle = '#c8302a'; p.g.lineWidth = 12; p.g.strokeRect(-190, -60, 380, 120); p.g.fillStyle = '#c8302a'; p.g.font = 'bold 80px Georgia, serif'; p.g.fillText('SHELVED', 0, 28); p.g.restore(); } };
const chart = (p, t) => { p.poly([[40, 180], [560, 180], [560, 820], [40, 820]], '#f6f2e6', 10); p.g.fillStyle = INK; p.g.textAlign = 'center'; p.g.font = 'bold 40px Poppins, sans-serif'; p.g.fillText('MEAT PER YEAR', 300, 250);
  const h = 460 * t; p.poly([[110, 760], [250, 760], [250, 700], [110, 700]], '#c86a5a', 6); p.poly([[330, 760], [480, 760], [480, 760 - h], [330, 760 - h]], '#7a5a9a', 6);
  p.g.font = 'bold 30px Poppins, sans-serif'; p.g.fillText('NOW', 180, 800); p.g.fillText('+HIPPO', 405, 800); };
const steak = (p, kind = 'steak') => { if (kind === 'burger') { p.ell(300, 470, 210, 110, '#d89a4a', 10); p.ell(300, 560, 220, 50, '#4aa03a', 6); p.ell(300, 600, 215, 60, '#6a3a2a', 8); p.ell(300, 660, 200, 60, '#d89a4a', 10);
    for (let i = 0; i < 6; i++) p.ell(220 + i * 30, 430 + (i % 2) * 14, 6, 4, '#f6e8c8', 0); return; }
  p.ell(300, 500, 240, 170, '#c84a4a', 12); p.ell(250, 470, 60, 40, '#f4d8c8', 0); p.ell(380, 540, 40, 26, '#f4d8c8', 0); };
const paper = (p, head1, head2) => { p.poly([[40, 160], [560, 160], [560, 860], [40, 860]], '#f4f0e6', 10); p.g.fillStyle = INK; p.g.textAlign = 'center'; p.g.font = 'bold 36px Georgia, serif'; p.g.fillText('THE DAILY NEWS · 1910', 300, 220);
  p.g.fillRect(70, 240, 460, 6); p.g.font = 'bold 76px Georgia, serif'; p.g.fillText(head1, 300, 350); p.g.fillText(head2, 300, 440); p.g.fillStyle = '#8a8a8a'; for (let i = 0; i < 9; i++) p.g.fillRect(80, 500 + i * 34, 440 - (i % 3) * 60, 12); };
const mapCard = (p) => { p.poly([[40, 200], [560, 200], [560, 820], [40, 820]], '#d8eef8', 10); p.poly([[200, 260], [430, 300], [470, 520], [380, 760], [250, 700], [180, 460]], '#7ac06a', 10);
  p.ell(300, 470, 16, 16, '#d03a2a', 4); p.g.fillStyle = INK; p.g.font = 'bold 44px Poppins, sans-serif'; p.g.textAlign = 'center'; p.g.fillText('COLOMBIA', 310, 600); };

// ---------------- characters ----------------
const BROU = { jacket: '#2a2a34', pants: '#2a2a34', boots: INK, hat: 'hair', hair: '#2a201a', moustache: '#2a201a', skin: '#f0c8a4', buttons: '#c8a040' };
const BURN = { jacket: '#a89060', pants: '#6a5a40', boots: '#4a3020', hat: 'cap', cap: '#8a7a50', moustache: '#8a6a40', skin: '#f0c49a' };
const DUQ = { jacket: '#3a3a4a', pants: '#2a2a34', boots: INK, hat: 'tophat', moustache: '#1a1410', skin: '#f6dcc4' };
const EXPERT = { jacket: '#5a6a5a', pants: '#3b3f52', boots: INK, hat: 'hair', hair: '#9a9a9a', skin: '#f6dcc4', build: 'stout' };
const BOATMAN = { jacket: '#c8a050', pants: '#4a5a7a', boots: '#3a2a20', hat: 'cap', cap: '#e8d8a0', skin: '#c99067' };
const BUTCHER = { jacket: '#f2f0ea', pants: '#3b3f52', boots: INK, hat: 'cap', cap: '#f2f0ea', moustache: '#4a3020', skin: '#f5c9a0', build: 'stout' };
const DINER = { jacket: '#c84a3a', pants: '#3b3f52', boots: INK, hat: 'hair', hair: '#6a4a30', skin: '#f5d0b4' };
const LIGHT2D = -2.1;
const fo = (f, seed, o) => ({ mode: 'stand', light: LIGHT2D, seed, blink: blinkAt(f, seed), tilt: q(idle(f, seed).tilt, 1), headTilt: q(idle(f, seed).headTilt, 1), ...o });
const card = (T, key, o, opts, pos, extra = {}) => ({ key: key + JSON.stringify(opts), draw: (p) => T.bodyFront(p, o, opts), x: pos[0], y: pos[1], z: pos[2], ...extra });
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1] - 1.07 * s, z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
const inFront = (c, d, ux, uy) => {
  const V = K.THREE.Vector3, p = new V(...c.pos), dir = new V(...c.look).sub(p).normalize(), right = new V().crossVectors(dir, new V(0, 1, 0)).normalize(), up = new V().crossVectors(right, dir);
  const h = d * Math.tan(c.fov * Math.PI / 360); return p.addScaledVector(dir, d).addScaledVector(right, ux * h).addScaledVector(up, uy * h).toArray();
};
const wordCard = (f, f0, txt, c, col = '#f6c83a', dur = 1e9, size = 170, uy = 0.42, d = 1.4) => { if (f < f0 - 1 || f > f0 + dur) return null; const t = q(Math.min(1, (f - f0 + 1) / 12));
  const r = Math.min(1, 400 / (0.7 * size * txt.length)), fs = size * r, s = Math.min(2.5, 1.25 / r);
  return FX('w' + txt + t + fs, (p) => PR.word(p, txt, t, col, fs), inFront(c, d, 0, uy), s * d / 7, { order: 9 }); };
const hip = (f, key, pos, s, o = {}) => { const m = q(o.mouth ?? 0, 1), md = o.mood || 'happy', mu = !!o.munch;
  return { key: 'hp' + key + m + md + mu, draw: (p) => hippo(p, m, md, mu), x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 3, roll: o.roll || 0 }; };

const HERD = [[0.2, -1.2, 1.0], [-2.6, -4.5, 0.9], [2.8, -5.5, 0.85], [-1.0, -10, 0.8], [4.5, -12, 0.8], [-4.6, -14, 0.75]];
function actorsAt(f, T) {
  const S = shotAt(f), id = S.id, out = [];
  const bob = (i) => 0.06 * Math.sin(f * 0.08 + i);
  const herd = (n, base = [0, 0, 0], munching = true) => HERD.slice(0, n).forEach(([x, z, s], i) => out.push(hip(f, 'h' + i, [base[0] + x, base[1] - 0.9 * s + bob(i), base[2] + z], s * 1.4, { mouth: munching && i % 2 ? Math.max(0, Math.sin(f * 0.3 + i)) : 0, munch: munching && i % 2 === 0 })));
  switch (id) {
    case 'hook': case 'ranch': case 'follow': herd(6); out.push(card(T, 'bm', BOATMAN, fo(f, 5, { expr: 'grin', look: 0.3, wave: Math.sin(f * 0.35) }), [-3.0, 0.15, -15.5])); break;
    case 'munch': out.push(hip(f, 'm', [0.2, -1.3 + bob(0), -1.2], 1.6, { mouth: Math.max(0, Math.sin(f * 0.35)), munch: true, mood: 'smug' })); break;
    case 'stuck': out.push(card(T, 'bm2', BOATMAN, fo(f, 5, { expr: f > F_STUCK ? 'pained' : 'nervous', look: 0.2, prop: ['x', 0.2 + 0.2 * Math.sin(f * 0.4)] }), [-3.2, 0.15, -15.6])); break;
    case 'diner': out.push(card(T, 'dn', DINER, fo(f, 21, { expr: 'lick', look: 0.1, prop: ['x', 0.3] }), [SHOP[0] - 0.2, 0, SHOP[2] + 0.2])); break;
    case 'meat': out.push(card(T, 'bu', BUTCHER, fo(f, 22, { expr: 'pained', look: 0.1, wave: Math.sin(f * 0.2) * 0.4 }), [SHOP[0] + 0.3, 0, SHOP[2] + 0.3])); break;
    case 'burger': out.push(card(T, 'dn2', DINER, fo(f, 21, { expr: f > F_BURGER + 10 ? 'laugh' : 'lick', look: 0.1, prop: ['x', 0.2] }), [SHOP[0] - 0.2, 0, SHOP[2] + 0.2])); break;
    case 'room': case 'bill': case 'two': case 'stranger': out.push(card(T, 'br', BROU, fo(f, 7, { expr: id === 'stranger' ? 'nervous' : 'grin', look: 0.2, wave: id === 'two' ? Math.sin(f * 0.4) : undefined }), [ROOM[0] - 0.2, 0, ROOM[2] - 1.0])); break;
    case 'enemies': case 'spy': out.push(card(T, 'bn', BURN, fo(f, 11, { expr: 'stern', look: 0.6 }), [ROOM[0] - 0.75, 0, ROOM[2] + 1.9]));
      out.push(card(T, 'dq', DUQ, fo(f, 13, { expr: id === 'spy' ? 'grin' : 'stern', look: -0.6 }), [ROOM[0] + 0.75, 0, ROOM[2] + 1.9])); break;
    case 'team': out.push(card(T, 'bn', BURN, fo(f, 11, { expr: 'grin', look: 0.2, wave: Math.sin(f * 0.3) }), [ROOM[0] - 0.65, 0, ROOM[2] + 1.9]));
      out.push(card(T, 'dq', DUQ, fo(f, 13, { expr: 'grin', look: -0.2, wave: Math.sin(f * 0.3 + 1) }), [ROOM[0] + 0.65, 0, ROOM[2] + 1.9])); break;
    case 'expert': case 'taste': out.push(card(T, 'ex', EXPERT, fo(f, 17, { expr: id === 'taste' ? 'lick' : 'grin', look: 0.2, prop: ['x', 0.4] }), [ROOM[0] - 0.4, 0, ROOM[2] + 1.9])); break;
    case 'where': herd(0); break;
    case 'died': out.push(card(T, 'br2', BROU, fo(f, 7, { expr: f > F_DIED ? 'shock' : 'nervous', look: 0.2 }), [ROOM[0] - 0.2, 0, ROOM[2] - 1.0])); break;
    case 'colombia': case 'four': herd(4, COL, true); break;
    case 'today': herd(6, COL, true); for (let i = 0; i < 10; i++) { const x = COL[0] - 8 + (i % 5) * 4, z = COL[2] - 18 - Math.floor(i / 5) * 9; out.push(hip(f, 't' + i, [x, -0.8 + bob(i + 6), z], 1.1, { mouth: i % 3 === 0 ? 0.6 : 0 })); } break;
  }
  return out;
}

function fxAt(f, T, cam) {
  const S = shotAt(f), id = S.id, out = [], push = (x) => x && out.push(x);
  if (id === 'hook') push(wordCard(f, 2, 'LOUISIANA', cam, '#ffffff', 1e9, 190, 0.62, 2.5));
  if (id === 'ranch') push(wordCard(f, F_RANCH, 'HIPPO RANCHES', cam, '#f6c83a', 1e9, 180, 0.62, 2.5));
  if (id === 'munch') push(wordCard(f, F_WEEDS, 'HIPPOS EAT WEEDS', cam, '#9ad04a', 1e9, 160, 0.66, 2));
  if (id === 'diner') { out.push(FX('stk', (p) => steak(p), inFront(cam, 1.2, 0, -0.3), 0.22, { order: 7 })); push(wordCard(f, F_AMER, 'PEOPLE EAT HIPPOS', cam, '#f6c83a', 1e9, 160, 0.66, 1.6)); }
  if (id === 'flower') { out.push(FX('hy', hyacinthCard, inFront(cam, 1.3, 0, -0.1), 0.34, { order: 7, roll: 0.03 * Math.sin(f * 0.1) })); push(wordCard(f, F_HYA, 'WATER HYACINTH', cam, '#c89aff', 1e9, 170, 0.66, 1.3)); }
  if (id === 'poster') { out.push(FX('ps', poster, inFront(cam, 1.3, 0, -0.04), 0.34, { order: 7 })); }
  if (id === 'stuck') { push(wordCard(f, F_FAST, 'IT SPREAD FAST', cam, '#ffffff', F_STUCK - F_FAST - 3, 170, 0.62, 2)); push(wordCard(f, F_STUCK, 'STUCK!', cam, '#ff7a3a', 1e9, 210, 0.62, 2)); }
  if (id === 'meat') push(wordCard(f, F_MEAT, 'MEAT SHORTAGE', cam, '#ff5a3a', 1e9, 170, 0.66, 1.6));
  if (id === 'room') { push(wordCard(f, F_1910, '1910', cam, '#f6c83a', F_BROU - F_1910 - 3, 200, 0.62, 2)); push(wordCard(f, F_BROU, 'REP. BROUSSARD', cam, '#ffffff', 1e9, 170, 0.62, 2)); }
  if (id === 'bill') out.push(FX('bl', (p) => billCard(p, 0), inFront(cam, 1.3, 0, -0.04), 0.34, { order: 7 }));
  if (id === 'two') push(wordCard(f, F_TWO, '2 PROBLEMS, 1 HIPPO', cam, '#f6c83a', 1e9, 150, 0.62, 2));
  if (id === 'stranger') push(wordCard(f, F_STR, 'STRANGER...', cam, '#c89aff', 1e9, 190, 0.62, 2));
  if (id === 'enemies') { push(wordCard(f, F_ENEM, 'OLD ENEMIES', cam, '#ff5a3a', 1e9, 180, 0.66, 2)); }
  if (id === 'spy') push(wordCard(f, F_SPY, 'FUTURE SPY', cam, '#ffffff', 1e9, 190, 0.66, 2));
  if (id === 'team') push(wordCard(f, F_TEAM, 'NOW: TEAMMATES', cam, '#9ad04a', 1e9, 170, 0.66, 2));
  if (id === 'expert') { const t = q(M.smooth(ramp(f, F_MILL - 10, F_MILL + 12)), 2); out.push(FX('ch' + t, (p) => chart(p, t), inFront(cam, 1.4, 0.32, -0.05), 0.24, { order: 7 })); push(wordCard(f, F_MILL, '1,000,000 TONS', cam, '#f6c83a', 1e9, 170, 0.66, 1.6)); }
  if (id === 'taste') { push(wordCard(f, F_PORK, 'PORK', cam, '#ff9ab0', F_BEEF - F_PORK - 2, 200, 0.66, 1.6)); push(wordCard(f, F_BEEF, 'PORK + BEEF', cam, '#ffffff', 1e9, 190, 0.66, 1.6)); }
  if (id === 'nyt') { out.push(FX('ny', (p) => paper(p, 'LAKE COW', 'BACON!'), inFront(cam, 1.3, 0, -0.04), 0.34, { order: 7, roll: -0.04 })); }
  if (id === 'burger') { out.push(FX('bg', (p) => steak(p, 'burger'), inFront(cam, 1.2, 0, -0.28), 0.22, { order: 7 })); push(wordCard(f, F_BURGER, 'HIPPO BURGER?', cam, '#f6c83a', 1e9, 170, 0.66, 1.6)); }
  if (id === 'tr') { out.push(FX('tr', (p) => paper(p, 'ROOSEVELT', 'BACKS IT'), inFront(cam, 1.3, 0, -0.04), 0.34, { order: 7, roll: 0.04 })); }
  if (id === 'where') push(wordCard(f, F_WHERE, 'WHERE ARE THEY?', cam, '#ffffff', 1e9, 170, 0.62, 2.5));
  if (id === 'died') { out.push(FX('bd' + (f > F_DIED ? q(Math.min(1, (f - F_DIED) / 6), 2) : 0), (p) => billCard(p, f > F_DIED ? Math.min(1, (f - F_DIED) / 6) : 0), inFront(cam, 1.3, 0.3, -0.12), 0.22, { order: 7 }));
    push(wordCard(f, F_NOWHERE, 'NOWHERE', cam, '#ff5a3a', 1e9, 200, 0.66, 1.6)); }
  if (id === 'empty') push(wordCard(f, F_NOT, 'ZERO HIPPOS', cam, '#ffffff', 1e9, 190, 0.62, 2.5));
  if (id === 'colombia') { if (f < F_ESC - 10) out.push(FX('mp', mapCard, inFront(cam, 1.3, 0.3, 0.12), 0.18, { order: 7 })); push(wordCard(f, F_AMS, 'BUT...', cam, '#f6c83a', 1e9, 200, 0.62, 2.5)); }
  if (id === 'four') { push(wordCard(f, F_FOUR, '4 HIPPOS', cam, '#f6c83a', F_COL - F_FOUR - 2, 190, 0.62, 2.5)); push(wordCard(f, F_COL, 'COLOMBIA', cam, '#ffffff', 1e9, 190, 0.62, 2.5)); }
  if (id === 'today') push(wordCard(f, F_100, '100+ ROAM WILD', cam, '#f6c83a', 1e9, 170, 0.62, 3));
  if (id === 'follow') push(wordCard(f, F_FOLLOW, 'NEW TRUE STORY DAILY', cam, '#ffffff', 1e9, 150, 0.62, 2.5));
  return out;
}

// ---------------- cameras ----------------
const R = ROOM, Sp = SHOP, C = COL;
const CAMS = {
  hook: [{ f: 0, pos: [0.5, 1.15, 4.2], look: [0.1, 1.0, -6], fov: 46 }, { f: F_RANCH - 4, pos: [0.4, 1.1, 3.4], look: [0.1, 1.0, -6], fov: 44 }],
  ranch: [{ f: F_RANCH - 4, pos: [0.3, 1.6, -3.5], look: [0.3, 1.6, -9], fov: 46 }, { f: cut(1), pos: [0.3, 1.6, -4.6], look: [0.3, 1.7, -9], fov: 44 }],
  munch: [{ f: cut(1), pos: [0.2, 0.9, 3.2], look: [0.2, 0.7, -1.2], fov: 44 }, { f: F_AMER - 4, pos: [0.2, 0.85, 2.6], look: [0.2, 0.7, -1.2], fov: 42 }],
  diner: [{ f: F_AMER - 4, pos: [Sp[0] - 0.2, 1.45, Sp[2] + 3.2], look: [Sp[0] - 0.2, 1.3, Sp[2] + 0.2], fov: 44 }, { f: cut(2), pos: [Sp[0] - 0.2, 1.4, Sp[2] + 2.8], look: [Sp[0] - 0.2, 1.3, Sp[2] + 0.2], fov: 42 }],
  flower: [{ f: cut(2), pos: [2, 0.8, 2], look: [1, 0.4, -6], fov: 44 }, { f: F_1884 - 4, pos: [2, 0.75, 1.6], look: [1, 0.4, -6], fov: 42 }],
  poster: [{ f: F_1884 - 4, pos: [-2, 1.2, 3], look: [-1, 1.0, -6], fov: 44 }, { f: cut(3), pos: [-2, 1.2, 2.6], look: [-1, 1.0, -6], fov: 42 }],
  stuck: [{ f: cut(3), pos: [-5.6, 2.4, -8.5], look: [-3.0, 0.8, -16], fov: 46 }, { f: F_STUCK, pos: [-1.6, 1.6, -10.5], look: [-3.1, 1.2, -15.6], fov: 44 }, { f: cut(4), pos: [-1.7, 1.6, -11], look: [-3.1, 1.2, -15.6], fov: 43 }],
  meat: [{ f: cut(4), pos: [Sp[0] + 0.5, 1.8, Sp[2] + 4.0], look: [Sp[0] + 0.3, 1.9, Sp[2] - 3], fov: 46 }, { f: cut(5), pos: [Sp[0] + 0.4, 1.7, Sp[2] + 3.4], look: [Sp[0] + 0.3, 1.8, Sp[2] - 3], fov: 44 }],
  room: [{ f: cut(5), pos: [R[0] + 1, 2.4, R[2] + 6.5], look: [R[0], 1.8, R[2] - 3], fov: 48 }, { f: F_BROU, pos: [R[0] - 0.1, 1.5, R[2] + 2.6], look: [R[0] - 0.2, 1.3, R[2] - 1], fov: 42, ease: 'easeOut' }, { f: F_BILL - 4, pos: [R[0] - 0.1, 1.5, R[2] + 2.4], look: [R[0] - 0.2, 1.3, R[2] - 1], fov: 41 }],
  bill: [{ f: F_BILL - 4, pos: [R[0] + 0.5, 1.4, R[2] + 3], look: [R[0] + 0.5, 1.2, R[2] - 2], fov: 42 }, { f: F_TWO - 4, pos: [R[0] + 0.5, 1.4, R[2] + 2.7], look: [R[0] + 0.5, 1.2, R[2] - 2], fov: 40 }],
  two: [{ f: F_TWO - 4, pos: [R[0] - 1.2, 1.2, R[2] + 2.4], look: [R[0] - 0.2, 1.4, R[2] - 1], fov: 44 }, { f: cut(6), pos: [R[0] - 1.1, 1.2, R[2] + 2.1], look: [R[0] - 0.2, 1.4, R[2] - 1], fov: 42 }],
  stranger: [{ f: cut(6), pos: [R[0] - 0.2, 1.7, R[2] + 2.4], look: [R[0] - 0.2, 1.7, R[2] - 1], fov: 44 }, { f: cut(7), pos: [R[0] - 0.2, 1.75, R[2] + 1.3], look: [R[0] - 0.2, 1.75, R[2] - 1], fov: 38, ease: 'easeOut' }],
  enemies: [{ f: cut(7), pos: [R[0], 1.6, R[2] + 6.0], look: [R[0], 1.3, R[2] + 1.9], fov: 44 }, { f: F_WAR, pos: [R[0] - 0.6, 1.5, R[2] + 4.6], look: [R[0] - 0.7, 1.3, R[2] + 1.9], fov: 40 }, { f: F_SPY - 8, pos: [R[0] - 0.6, 1.5, R[2] + 4.4], look: [R[0] - 0.7, 1.3, R[2] + 1.9], fov: 40 }],
  spy: [{ f: F_SPY - 8, pos: [R[0] + 0.8, 1.5, R[2] + 4.4], look: [R[0] + 0.75, 1.35, R[2] + 1.9], fov: 40 }, { f: cut(8), pos: [R[0] + 0.8, 1.5, R[2] + 4.0], look: [R[0] + 0.75, 1.35, R[2] + 1.9], fov: 38 }],
  team: [{ f: cut(8), pos: [R[0] + 1.2, 2.4, R[2] - 2.6], look: [R[0], 1.3, R[2] + 1.9], fov: 46 }, { f: cut(9), pos: [R[0] + 0.8, 2.2, R[2] - 2.0], look: [R[0], 1.3, R[2] + 1.9], fov: 44 }],
  expert: [{ f: cut(9), pos: [R[0] - 0.2, 1.5, R[2] + 5.4], look: [R[0] - 0.1, 1.3, R[2] + 1.9], fov: 44 }, { f: cut(10), pos: [R[0] - 0.2, 1.5, R[2] + 4.9], look: [R[0] - 0.1, 1.3, R[2] + 1.9], fov: 42 }],
  taste: [{ f: cut(10), pos: [R[0] - 0.4, 1.55, R[2] + 4.2], look: [R[0] - 0.4, 1.55, R[2] + 1.9], fov: 40 }, { f: cut(11), pos: [R[0] - 0.4, 1.6, R[2] + 3.8], look: [R[0] - 0.4, 1.6, R[2] + 1.9], fov: 38 }],
  nyt: [{ f: cut(11), pos: [R[0] + 3, 1.6, R[2] + 5], look: [R[0] + 3, 1.6, R[2] - 4], fov: 44 }, { f: cut(12), pos: [R[0] + 3, 1.6, R[2] + 4.6], look: [R[0] + 3, 1.6, R[2] - 4], fov: 42 }],
  burger: [{ f: cut(12), pos: [Sp[0] - 0.2, 1.45, Sp[2] + 3.0], look: [Sp[0] - 0.2, 1.3, Sp[2] + 0.2], fov: 44 }, { f: cut(13), pos: [Sp[0] - 0.2, 1.4, Sp[2] + 2.6], look: [Sp[0] - 0.2, 1.3, Sp[2] + 0.2], fov: 42 }],
  tr: [{ f: cut(13), pos: [R[0] - 3, 1.6, R[2] + 5], look: [R[0] - 3, 1.6, R[2] - 4], fov: 44 }, { f: cut(14), pos: [R[0] - 3, 1.6, R[2] + 4.6], look: [R[0] - 3, 1.6, R[2] - 4], fov: 42 }],
  where: [{ f: cut(14), pos: [3, 2.2, 6], look: [-4, 1.0, -10], fov: 48 }, { f: cut(15), pos: [-1, 2.2, 6], look: [4, 1.0, -10], fov: 48 }],
  died: [{ f: cut(15), pos: [R[0] - 0.2, 1.6, R[2] + 2.8], look: [R[0] - 0.2, 1.5, R[2] - 1], fov: 44 }, { f: F_DIED, pos: [R[0] - 0.2, 1.6, R[2] + 2.3], look: [R[0] - 0.2, 1.5, R[2] - 1], fov: 42, ease: 'easeOut' }, { f: F_NOT - 4, pos: [R[0] - 0.2, 1.6, R[2] + 2.2], look: [R[0] - 0.2, 1.5, R[2] - 1], fov: 41 }],
  empty: [{ f: F_NOT - 4, pos: [0.3, 1.6, -4.2], look: [0.3, 1.5, -9], fov: 46 }, { f: cut(16), pos: [0.3, 1.6, -5.0], look: [0.3, 1.5, -9], fov: 44 }],
  colombia: [{ f: cut(16), pos: [C[0] + 4, 3.5, C[2] + 10], look: [C[0], 0.5, C[2] - 6], fov: 48 }, { f: F_ESC - 4, pos: [C[0] + 2, 2.4, C[2] + 7], look: [C[0], 0.8, C[2] - 4], fov: 46 }],
  four: [{ f: F_ESC - 4, pos: [C[0] + 0.4, 1.2, C[2] + 4.2], look: [C[0] + 0.1, 0.9, C[2] - 2], fov: 46 }, { f: cut(17), pos: [C[0] + 0.3, 1.1, C[2] + 3.4], look: [C[0] + 0.1, 0.9, C[2] - 2], fov: 44 }],
  today: [{ f: cut(17), pos: [C[0], 8, C[2] + 14], look: [C[0], 0, C[2] - 10], fov: 50 }, { f: cut(18), pos: [C[0] + 3, 5, C[2] + 9], look: [C[0], 0, C[2] - 12], fov: 50 }],
  follow: [{ f: cut(18), pos: [0.4, 1.1, 3.4], look: [0.1, 1.0, -6], fov: 44 }, { f: TOTAL - 1, pos: [0.5, 1.15, 4.2], look: [0.1, 1.0, -6], fov: 46 }],
};
const KICKS = [{ f: F_RANCH, a: 0.03 }, { f: F_WEEDS, a: 0.02 }, { f: F_STUCK, a: 0.04 }, { f: F_MEAT, a: 0.03 }, { f: F_BILL, a: 0.02 }, { f: F_STR, a: 0.03 }, { f: F_ENEM, a: 0.03 }, { f: F_SPY, a: 0.03 },
  { f: F_MILL, a: 0.03 }, { f: F_BACON, a: 0.03 }, { f: F_NOWHERE, a: 0.04 }, { f: F_DIED, a: 0.05 }, { f: F_FOUR, a: 0.03 }, { f: F_100, a: 0.03 }];
const camAt = (f) => { const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS }); c.shadowAt = [c.look[0], 0, c.look[2]]; return c; };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => { const id = shotAt(f).id;
  if (['flower', 'poster', 'bill', 'nyt', 'tr'].includes(id)) return { focus: 1.3, cinf: 16 };
  if (['diner', 'burger'].includes(id)) return { focus: dist(Cm.pos, [Sp[0], 1.3, Sp[2] + 0.2]), cinf: 10 };
  if (['room', 'two', 'stranger', 'died'].includes(id)) return { focus: dist(Cm.pos, [R[0] - 0.2, 1.4, R[2] - 1]), cinf: 10 };
  if (['enemies', 'spy', 'expert', 'taste'].includes(id)) return { focus: dist(Cm.pos, [R[0], 1.4, R[2] + 1.9]), cinf: 10 };
  if (id === 'munch') return { focus: dist(Cm.pos, [0.2, 0.8, -1.2]), cinf: 10 };
  if (id === 'four') return { focus: dist(Cm.pos, [C[0], 0.8, C[2] - 1.2]), cinf: 8 };
  return { focus: 10, cinf: 0 }; };

const SET = (id) => (['room', 'bill', 'two', 'stranger', 'enemies', 'spy', 'team', 'expert', 'taste', 'nyt', 'tr', 'died'].includes(id) ? 'room' : ['meat', 'diner', 'burger'].includes(id) ? 'shop' : ['colombia', 'four', 'today'].includes(id) ? 'col' : 'bayou');
export default {
  TOTAL, build, look: 'rich',
  frame(f, k) {
    const S = shotAt(f), cam = camAt(f), id = S.id, set = SET(id);
    lampsRoom.forEach((l) => { l.light.visible = set === 'room'; if (l.glow) l.glow.visible = set === 'room'; });
    lampsShop.forEach((l) => { l.light.visible = set === 'shop'; if (l.glow) l.glow.visible = set === 'shop'; });
    boat.rotation.z = id === 'stuck' ? 0.04 * Math.sin(f * 0.5) : 0;
    gavel.rotation.x = id === 'died' ? -1.2 * Math.max(0, Math.sin(Math.PI * ramp(f, F_DIED - 8, F_DIED + 2))) : 0;
    const light = set === 'room' || set === 'shop' ? { ...IN } : set === 'col' ? { ...TROP } : { ...BAYOU };
    if (id === 'today') light.shadowExt = 40;
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
  },
};
