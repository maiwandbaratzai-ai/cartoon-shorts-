// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Exploding Trousers" — sodium chlorate on ragwort, New Zealand, 1930s (Ig Nobel 2005). Timed via pants_timing.js.
import { TOTAL, LINES, wf } from './pants_timing.js';
import * as PR from '../props.js';
import { INK } from '../toon.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], cut = (i) => Math.max(0, A(i) - 4);
const W = wf;
const F_NZ = W(0, 'new'), F_EXPL = W(0, 'exploding'), F_BANG1 = W(1, 'bang'), F_WEAR = W(1, 'wearing'), F_WEED = W(2, 'weedkiller'), F_SOD = W(2, 'sodium'),
  F_1930 = W(3, '1930s'), F_GOV = W(3, 'government'), F_RAG = W(3, 'ragwort'), F_KILL = W(4, 'killed'), F_SOAK = W(4, 'soaked'), F_TROU = W(4, 'trousers'),
  F_DRIED = W(5, 'dried'), F_MATCH = W(5, 'match'), F_WORSE = W(6, 'worse'), F_LINE = W(6, 'washing'), F_SMOKE = W(6, 'smoking'), F_FIRE = W(7, 'fire'),
  F_BANG2 = W(7, 'bang'), F_70 = W(8, 'seventy'), F_PAPER = W(8, 'paper'), F_IG = W(8, 'ig'), F_TITLE = W(9, 'title'), F_MR = W(9, 'mr');
const F_LOOP = TOTAL - 16;
const SHOTS = [['hook', 0], ['bang', cut(1)], ['tin', cut(2)], ['gov', cut(3)], ['rag', F_RAG - 4], ['spray', cut(4)], ['soak', F_SOAK - 4], ['match', cut(5)],
  ['line', cut(6)], ['fire', cut(7)], ['paper', cut(8)], ['prize', F_IG - 4], ['title', cut(9)], ['loop', F_LOOP]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const HOUSE = [-8, 0, -22], KIT = [90, 0, 0], STUDY = [140, 0, 0];
const DAY = { az: 140, el: 34, sky: '#dcecfa', ground: '#6a8a3a', hemi: 1.0, sun: '#fff2d8', sunI: 2.6, fog: '#cfe2ee', fogNear: 60, fogFar: 600,
  skyTop: '#3a86d8', skyHor: '#dceef6', sat: 1.16, vig: 0.22, shadowExt: 22, exposure: 1.08 };
const IN = { az: 200, el: 40, sky: '#b8a890', ground: '#3a2a1e', hemi: 0.38, sun: '#ffd8a8', sunI: 0.0, fog: '#24180f', fogNear: 9, fogFar: 32,
  skyTop: '#24180f', skyHor: '#24180f', sat: 1.06, vig: 0.34, shadowExt: 12, exposure: 1.18, bloom: 0.55, cardTint: '#fff0e0' };
let K, flames, fireLamp, lamps = [];
const rnd = (() => { let s = 1931; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
const gnd = (x, z) => 0.6 * Math.sin(x * 0.05) * Math.cos(z * 0.04) + Math.max(0, -z - 40) * 0.12 + Math.max(0, Math.abs(x) - 60) * 0.1;
const txtTex = (w, h, bg, fg, lines, font = 'bold 64px Georgia, serif') => PR.canvasTex(w, h, (g) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
  lines.forEach((t, i) => g.fillText(t, w / 2, h * (i + 1) / (lines.length + 1))); });
const plane = (w, h, map, x, y, z, ry = 0, parent = K.scene) => { const m = K.add(new K.THREE.PlaneGeometry(w, h), K.toon({ map, kind: 'wood', amt: 0.2, plain: true }), x, y, z, parent, { cast: false }); m.rotation.y = ry; return m; };

function build(k) {
  K = k; const { THREE } = K, M4 = THREE.Matrix4;
  K.addClouds(12, 700, 180);
  PR.terrain(K, 500, 120, gnd, K.mat('grime', '#6a9a3a', { detail: 3, amt: 0.35 }));
  // rolling green hills
  for (let i = 0; i < 9; i++) K.sphere(90, K.mat('grime', i % 2 ? '#5a8a3a' : '#6a9a44', { detail: 10 }), -400 + i * 100, -50, -260 - (i % 3) * 30, K.scene, 1.4, 0.7, 1);
  // ragwort clumps: stems + yellow flower heads (merged)
  const st = [], fl = [];
  for (let i = 0; i < 900; i++) { const x = (rnd() - 0.5) * 60, z = -40 + rnd() * 52; if (Math.abs(x) < 1.6 && z > -2) continue; const h = 0.5 + rnd() * 0.5;
    st.push(new M4().makeTranslation(x, gnd(x, z) + h / 2, z).multiply(new M4().makeScale(1, h, 1)));
    for (let j = 0; j < 3; j++) fl.push(new M4().makeTranslation(x + (rnd() - 0.5) * 0.25, gnd(x, z) + h + rnd() * 0.12, z + (rnd() - 0.5) * 0.25)); }
  K.add(PR.mergeCopies(new THREE.CylinderGeometry(0.03, 0.04, 1, 5), st), K.col('#4a7a2a'), 0, 0, 0).frustumCulled = false;
  K.add(PR.mergeCopies(new THREE.IcosahedronGeometry(0.11, 0), fl), K.mat('grime', '#f2c81a', { plain: true }), 0, 0, 0).frustumCulled = false;
  // sheep: woolly bodies + dark heads
  const sb = [], sh = [];
  for (let i = 0; i < 40; i++) { const x = -30 + rnd() * 60, z = -60 + rnd() * 40; if (Math.abs(x) < 4 && z > -12) continue; const y = gnd(x, z); sb.push(new M4().makeTranslation(x, y + 0.55, z).multiply(new M4().makeScale(1, 0.75, 1.3)));
    sh.push(new M4().makeTranslation(x + 0.1, y + 0.75, z + 0.55)); }
  K.add(PR.mergeCopies(new THREE.IcosahedronGeometry(0.5, 2), sb), K.mat('fabric', '#f2eee4', { detail: 0.2, amt: 0.3 }), 0, 0, 0).frustumCulled = false;
  K.add(PR.mergeCopies(new THREE.SphereGeometry(0.18, 10, 8), sh), K.col('#2a2420'), 0, 0, 0).frustumCulled = false;
  // fence line with posts + wire
  const post = K.mat('wood', '#7a6a50');
  for (let i = 0; i < 30; i++) { const x = -30 + i * 2; K.slab(x - 0.07, x + 0.07, gnd(x, 3.5), gnd(x, 3.5) + 1.2, 3.43, 3.57, post); }
  for (const y of [0.6, 1.0]) K.slab(-30, 30, y - 0.01, y + 0.01, 3.49, 3.51, K.col('#8a8a8a'), K.scene, false);
  // the tin on a fence post (insert) near x=2.5
  const tin = K.group(); tin.position.set(2.4, 1.2 + gnd(2.4, 3.5), 3.5);
  const label = PR.canvasTex(512, 256, (g) => { g.fillStyle = '#e8c83a'; g.fillRect(0, 0, 512, 256); g.fillStyle = '#c8302a'; g.fillRect(0, 70, 512, 120); g.fillStyle = '#fff'; g.font = 'bold 50px Georgia'; g.textAlign = 'center'; g.fillText('SODIUM', 256, 120); g.fillText('CHLORATE', 256, 172);
    g.fillStyle = INK; g.font = 'bold 34px Georgia'; g.fillText('WEED KILLER', 256, 50); g.fillText('☠ KEEP FROM FLAME', 256, 228); });
  const tc = K.add(new THREE.CylinderGeometry(0.2, 0.2, 0.42, 32), K.toon({ map: label, plain: true }), 0, 0.21, 0, tin); tc.rotation.y = Math.PI + 0.12;
  K.cyl(0.21, 0.21, 0.03, K.mat('metal', '#9a9aa0'), 0, 0.42, 0, tin);
  // farmhouse with clothesline
  const h = K.group(); h.position.set(...HOUSE); h.rotation.y = 0.3;
  K.slab(-5, 5, 0, 3.6, -4, 4, K.mat('wood', '#f0e8d8', { detail: 0.6 }), h); const rf = K.add(new THREE.CylinderGeometry(0.1, 6.4, 2.4, 4, 1), K.mat('metal', '#b8302a', { roughness: 0.5 }), 0, 4.8, 0, h); rf.rotation.y = Math.PI / 4; rf.scale.set(1.15, 1, 0.9);
  K.slab(-0.6, 0.6, 0, 2.2, 3.98, 4.06, K.mat('wood', '#4a6a8a'), h); for (const x of [-3, 3]) K.slab(x - 0.7, x + 0.7, 1.4, 2.6, 3.98, 4.06, new THREE.MeshBasicMaterial({ color: '#a8c8e8' }), h);
  K.cyl(0.4, 0.5, 2.2, K.mat('brick', '#a8584a'), 3.5, 3.6, -1, h);
  for (const x of [-3, 3]) K.slab(x - 0.06, x + 0.06, 0, 2.2, -0.06, 0.06, post).position.set(HOUSE[0] + 6 + x, 1.1, HOUSE[2] + 9);
  K.slab(HOUSE[0] + 3, HOUSE[0] + 9, 2.1, 2.12, HOUSE[2] + 8.99, HOUSE[2] + 9.01, K.col('#e8e0d0'), K.scene, false);
  // trees
  const leaf = K.mat('grime', '#3a6a34', { amt: 0.5 }), bark = K.mat('wood', '#5a3a26');
  for (let i = 0; i < 18; i++) { const x = -50 + rnd() * 100, z = -45 - rnd() * 40, s = 1 + rnd(); K.cyl(0.25 * s, 0.35 * s, 3 * s, bark, x, gnd(x, z), z); K.sphere(1.8 * s, leaf, x, gnd(x, z) + 4 * s, z, K.scene, 1, 1.1, 1); }
  // ---------- kitchen with fireplace (KIT) ----------
  const kt = K.group(); kt.position.set(...KIT);
  const wood = K.mat('wood', '#8a5c36', { detail: 1.2 }), dark = K.mat('wood', '#5e3c24'), stone = K.mat('rock', '#9a8a7a', { detail: 0.6, bump: 0.03 });
  K.slab(-5, 5, -0.1, 0, -4, 6, K.mat('wood', '#7a5234', { detail: 0.8 }), kt, false); K.slab(-5, 5, 0, 3.6, -4.2, -4, K.mat('plaster', '#d8c8a8'), kt);
  K.slab(-5.2, -5, 0, 3.6, -4, 6, K.mat('plaster', '#d0c0a0'), kt); K.slab(5, 5.2, 0, 3.6, -4, 6, K.mat('plaster', '#d0c0a0'), kt); K.slab(-5, 5, 3.6, 3.8, -4, 6, dark, kt);
  for (let x = -4.5; x < 5; x += 1.5) K.slab(x - 0.1, x + 0.1, 3.3, 3.6, -4, 6, dark, kt);
  K.slab(-1.6, 1.6, 0, 2.2, -4, -3.3, stone, kt); K.slab(-0.9, 0.9, 0.1, 1.2, -3.32, -3.28, K.col('#140c08'), kt); K.slab(-1.8, 1.8, 2.2, 2.35, -4, -3.15, dark, kt); K.slab(-0.8, 0.8, 2.35, 3.6, -4, -3.5, stone, kt);
  for (let i = 0; i < 4; i++) K.cyl(0.05, 0.06, 0.25, K.mat('metal', ['#c8a040', '#7a7a80', '#a8583a', '#c8a040'][i]), -1.3 + i * 0.8, 2.35, -3.6, kt);
  flames = K.group(kt); flames.position.set(0, 0.15, -3.35); for (let i = 0; i < 5; i++) K.add(new THREE.ConeGeometry(0.16, 0.6, 8), new THREE.MeshBasicMaterial({ color: i % 2 ? '#ffb030' : '#ff7a20' }), -0.5 + i * 0.25, 0.3, 0, flames, { cast: false });
  K.slab(-0.7, 0.7, 0.1, 0.22, -3.4, -3.2, K.mat('wood', '#3a2418'), kt);
  lamps.push(K.lamp(KIT[0], 0.7, KIT[2] - 2.8, { color: '#ff9a40', intensity: 4, distance: 9, glowS: 0.9, flicker: 0.2 }));
  // drying rack in front of the fire
  for (const x of [-1.0, 1.0]) K.slab(x - 0.04, x + 0.04, 0, 1.5, -2.2, -2.12, wood, kt); K.slab(-1.05, 1.05, 1.45, 1.5, -2.2, -2.12, wood, kt);
  // table, chair, kettle, window, shelf, calendar
  K.slab(2, 4, 0.8, 0.88, 0, 1.4, wood, kt); for (const [x, z] of [[2.1, 0.1], [3.9, 0.1], [2.1, 1.3], [3.9, 1.3]]) K.slab(x - 0.05, x + 0.05, 0, 0.8, z - 0.05, z + 0.05, dark, kt);
  K.sphere(0.18, K.mat('metal', '#3a3a40'), 2.6, 1.0, 0.6, kt, 1, 0.8, 1); K.cyl(0.12, 0.1, 0.15, K.mat('grime', '#e8e0d0'), 3.3, 0.88, 0.5, kt);
  K.slab(3, 4.6, 1.2, 2.8, -4.02, -3.98, new THREE.MeshBasicMaterial({ color: '#cfe4f0' }), kt); K.slab(3.75, 3.85, 1.2, 2.8, -3.98, -3.94, dark, kt);
  K.slab(-4.6, -2.4, 2.3, 2.38, -3.95, -3.6, dark, kt); for (let i = 0; i < 6; i++) K.cyl(0.08, 0.08, 0.3, K.mat('grime', ['#4a7a4a', '#a83a2a', '#e8d8b0'][i % 3]), -4.4 + i * 0.35, 2.38, -3.78, kt);
  plane(0.9, 1.1, txtTex(200, 240, '#f4ecd8', '#3a2a1a', ['1931'], 'bold 64px Georgia, serif'), -3.4, 1.5, -3.97, 0, kt);
  lamps.push(K.lamp(KIT[0] + 3, 2.9, KIT[2] + 0.6, { color: '#ffc070', intensity: 2.2, distance: 8, glowS: 0.4, flicker: 0.05 }));
  K.dust([KIT[0], 1.6, KIT[2] - 1], [6, 2.5, 5], 120);
  // ---------- historian's study (STUDY) ----------
  const sd = K.group(); sd.position.set(...STUDY);
  K.slab(-4, 4, -0.1, 0, -4, 5, K.mat('wood', '#6a4a30'), sd, false); K.slab(-4, 4, 0, 3.6, -4.2, -4, K.mat('plaster', '#4a5a6a'), sd);
  const books = PR.canvasTex(512, 512, (g) => { g.fillStyle = '#3a2416'; g.fillRect(0, 0, 512, 512); for (let r = 0; r < 5; r++) { g.fillStyle = '#2a180e'; g.fillRect(0, r * 102 + 92, 512, 10);
    for (let x = 6; x < 506;) { const w = 14 + (x * 7 + r * 13) % 20; g.fillStyle = ['#8a2a2a', '#2a4a7a', '#3a6a3a', '#c8a050', '#6a3a6a', '#d8c8a0'][(x + r) % 6]; g.fillRect(x, r * 102 + 14 + (x % 3) * 4, w, 78 - (x % 3) * 4); x += w + 2; } } });
  plane(6, 3.4, books, 0, 1.8, -3.98, 0, sd);
  K.slab(-1.4, 1.4, 0.78, 0.86, -1.2, 0.2, K.mat('wood', '#7a4a2a'), sd); for (const [x, z] of [[-1.3, -1.1], [1.3, -1.1], [-1.3, 0.1], [1.3, 0.1]]) K.slab(x - 0.05, x + 0.05, 0, 0.78, z - 0.05, z + 0.05, dark, sd);
  K.slab(-0.5, 0.2, 0.86, 0.88, -0.6, -0.1, K.mat('fabric', '#f6f0e0', { plain: true }), sd); K.cyl(0.04, 0.08, 0.5, K.mat('metal', '#2a4a3a'), 0.9, 0.86, -0.8, sd);
  lamps.push(K.lamp(STUDY[0] + 0.9, 1.4, STUDY[2] - 0.7, { color: '#ffd090', intensity: 3, distance: 8, glowS: 0.35, flicker: 0.02 }));
}

// ---------------- 2D ----------------
const pantsShape = (p, burnt = 0, smoke = 0, f = 0) => { const c = burnt > 0.5 ? '#3a2a24' : '#7a6a4a';
  p.poly([[180, 300], [420, 300], [450, 920], [330, 920], [300, 520], [270, 920], [150, 920]], c, 12); p.poly([[180, 300], [420, 300], [422, 350], [178, 350]], '#5a4a32', 0);
  p.stroke([[300, 350], [300, 480]], 5, INK); p.stroke([[230, 300], [230, 250]], 6, INK); p.stroke([[370, 300], [370, 250]], 6, INK);
  if (burnt > 0.5) for (let i = 0; i < 7; i++) p.ell(200 + (i * 53) % 230, 420 + (i * 97) % 420, 22, 14, '#140c08', 0);
  for (let i = 0; i < 3 && smoke > 0; i++) { const t = ((f / 24) + i / 3) % 1; p.ell(300 + Math.sin(t * 6 + i) * 40, 280 - t * 260, 40 + 40 * t, 34 + 30 * t, `rgba(120,110,100,${(smoke * (1 - t) * 0.8).toFixed(2)})`, 0); } };
const matchHead = (p, t) => { p.stroke([[150, 850], [380, 420]], 30, INK); p.stroke([[150, 850], [380, 420]], 18, '#e8d0a0'); p.ell(395, 390, 46, 58, '#c8302a', 10);
  if (t > 0) { const s = M.back(t); p.g.save(); p.g.translate(410, 300); p.g.scale(s, s); p.poly([[0, -190], [70, -40], [40, 60], [-40, 60], [-70, -40]], '#ff8a20', 10); p.poly([[0, -110], [36, -20], [0, 40], [-36, -20]], '#ffe070', 0); p.g.restore(); } };
const paperCard = (p, big = false) => { p.poly([[70, 140], [530, 140], [530, 880], [70, 880]], '#fbf6ea', 10); p.g.fillStyle = INK; p.g.textAlign = 'center';
  p.g.font = 'bold 34px Georgia, serif'; p.g.fillText('AGRICULTURAL HISTORY', 300, 210);
  p.g.font = 'bold 52px Georgia, serif'; ['The Significance', 'of Mr. Richard', "Buckley's", 'Exploding', 'Trousers'].forEach((t, i) => { p.g.fillStyle = i >= 3 ? '#c8302a' : INK; p.g.fillText(t, 300, 330 + i * 72); });
  p.g.fillStyle = '#8a8a8a'; for (let i = 0; i < 6; i++) p.g.fillRect(120, 720 + i * 24, 360 - (i % 3) * 40, 8); };
const trophy = (p) => { p.poly([[200, 260], [400, 260], [370, 520], [230, 520]], '#e8b830', 12); p.stroke([[200, 300], [130, 330], [200, 430]], 16, INK); p.stroke([[400, 300], [470, 330], [400, 430]], 16, INK);
  p.poly([[270, 520], [330, 520], [330, 640], [270, 640]], '#e8b830', 10); p.poly([[200, 640], [400, 640], [400, 720], [200, 720]], '#5a3a24', 10);
  p.g.fillStyle = INK; p.g.font = 'bold 34px Poppins, sans-serif'; p.g.textAlign = 'center'; p.g.fillText('IG NOBEL', 300, 694); };
const cow = (p, sick = false) => { p.ell(300, 620, 230, 150, '#f4f0e8', 12); p.ell(220, 580, 70, 50, INK, 0); p.ell(380, 660, 60, 44, INK, 0);
  for (const x of [130, 200, 400, 470]) p.stroke([[x, 720], [x, 930]], 22, INK); p.ell(520, 520, 90, 80, '#f4f0e8', 10); p.ell(560, 560, 46, 34, '#f0b0a0', 6);
  p.ell(500, 495, 12, sick ? 4 : 12, INK, 0); if (sick) { p.stroke([[480, 600], [520, 620]], 6, '#7ab02a'); } };

// ---------------- characters ----------------
const FARM1 = { jacket: '#c8a050', pants: '#7a6a4a', boots: '#3a2a20', hat: 'cap', cap: '#5a4a3a', moustache: '#8a5a30', skin: '#f0c49a' };
const FARM2 = { jacket: '#5a7a9a', pants: '#7a6a4a', boots: '#3a2a20', hat: 'hair', hair: '#3a2a20', skin: '#f5c9a0' };
const GOVM = { jacket: '#2a2a34', pants: '#2a2a34', boots: INK, hat: 'tophat', moustache: '#d8d8d8', skin: '#f6dcc4', build: 'stout' };
const HIST = { jacket: '#6a5a7a', pants: '#3b3f52', boots: INK, hat: 'hair', hair: '#9a9a9a', skin: '#f0c49a', moustache: '#9a9a9a' };
const LIGHT2D = -2.1;
const fo = (f, seed, o) => ({ mode: 'stand', light: LIGHT2D, seed, blink: blinkAt(f, seed), tilt: q(idle(f, seed).tilt, 1), headTilt: q(idle(f, seed).headTilt, 1), ...o });
const trousers = (p, col, burnt = false, sit = false) => { if (sit) return; const c = burnt ? '#3a2a24' : col;
  p.poly([[238, 628], [362, 628], [366, 958], [306, 958], [300, 740], [294, 958], [234, 958]], c, 9); p.stroke([[300, 640], [300, 735]], 4, INK);
  if (burnt) for (let i = 0; i < 6; i++) { p.ell(252 + (i * 41) % 100, 700 + (i * 67) % 230, 12, 9, '#140c08', 0); p.ell(250 + (i * 37) % 100, 960 - (i % 3) * 6, 10, 8, '#f6a03a', 0); } };
const card = (T, key, o, opts, pos, extra = {}) => ({ key: key + JSON.stringify(opts) + (o.burnt ? 'b' : ''), draw: (p) => { T.bodyFront(p, o, opts); trousers(p, o.pants, o.burnt, opts.mode === 'sit'); }, x: pos[0], y: pos[1], z: pos[2], ...extra });
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1] - 1.07 * s, z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
const inFront = (c, d, ux, uy) => {
  const V = K.THREE.Vector3, p = new V(...c.pos), dir = new V(...c.look).sub(p).normalize(), right = new V().crossVectors(dir, new V(0, 1, 0)).normalize(), up = new V().crossVectors(right, dir);
  const h = d * Math.tan(c.fov * Math.PI / 360); return p.addScaledVector(dir, d).addScaledVector(right, ux * h).addScaledVector(up, uy * h).toArray();
};
const wordCard = (f, f0, txt, c, col = '#f6c83a', dur = 1e9, size = 170, uy = 0.42, d = 1.4) => { if (f < f0 - 1 || f > f0 + dur) return null; const t = q(Math.min(1, (f - f0 + 1) / 12));
  const r = Math.min(1, 400 / (0.7 * size * txt.length)), fs = size * r, s = Math.min(2.5, 1.25 / r);
  return FX('w' + txt + t + fs, (p) => PR.word(p, txt, t, col, fs), inFront(c, d, 0, uy), s * d / 7, { order: 9 }); };
const boom = (f, f0, pos, s, seed = 1) => { if (f < f0 || f > f0 + 18) return null; const t = q((f - f0) / 18, 2); return FX('kb' + seed + t, (p) => PR.kaboom(p, t, seed), pos, s, { order: 6 }); };

const P1 = [0.0, gnd(0, 0), 0];
// hook explosion loops: the first frames show the bang, then he smokes
const hookBoom = (f) => (f < 14 ? f : -99);
function actorsAt(f, T) {
  const S = shotAt(f), id = S.id, out = [];
  switch (id) {
    case 'hook': case 'loop': { const lf = id === 'loop' ? f - F_LOOP : f; out.push(card(T, 'f1', { ...FARM1, burnt: true }, fo(f, 4, { expr: lf < 40 || id === 'loop' ? 'shock' : 'dazed', look: 0.1, wave: Math.sin(f * 0.6) }), P1));
      out.push(card(T, 'f2', FARM2, fo(f, 9, { expr: id === 'hook' && f > F_EXPL ? 'laugh' : 'shock', look: -0.4 }), [-1.6, gnd(-1.6, -1.2), -1.2], { s: 0.95 })); break; }
    case 'bang': { const burnt = f > F_BANG1 + 4; out.push(card(T, 'f2b', { ...FARM2, burnt }, fo(f, 9, { expr: f < F_BANG1 ? 'whistle' : f < F_WEAR ? 'shock' : 'dazed', look: 0.1, mode: f < F_BANG1 ? 'march' : 'stand', phase: q((f / 20) % 1, 2) }), [0.4, gnd(0.4, -0.5), -0.5])); break; }
    case 'gov': out.push(card(T, 'gv', GOVM, fo(f, 13, { expr: 'stern', look: 0.3, wave: f > F_GOV ? Math.sin(f * 0.3) * 0.5 : undefined }), [-0.6, gnd(-0.6, -0.4), -0.4]));
      out.push(card(T, 'f1g', FARM1, fo(f, 4, { expr: 'nervous', look: -0.3 }), [1.1, gnd(1.1, -1.5), -1.5])); break;
    case 'spray': case 'soak': out.push(card(T, 'f1s', FARM1, fo(f, 4, { expr: id === 'soak' ? 'nervous' : 'grin', look: 0.3, prop: ['x', 0.3] }), [-0.3, gnd(-0.3, 0), 0])); break;
    case 'fire': { const burnt = f > F_BANG2 + 3; out.push(card(T, 'f1f', FARM1, fo(f, 4, { mode: 'sit', expr: f < F_BANG2 ? 'whistle' : 'shock', look: -0.5 }), [KIT[0] + 1.35, 0.25, KIT[2] - 1.2])); break; }
    case 'paper': case 'prize': out.push(card(T, 'hs', HIST, fo(f, 17, { expr: id === 'prize' ? 'laugh' : 'smile', look: 0.2 }), [STUDY[0] - 0.4, 0, STUDY[2] - 1.6])); break;
  }
  return out;
}

function fxAt(f, T, cam) {
  const S = shotAt(f), id = S.id, out = [], push = (x) => x && out.push(x);
  const smokeAt = (pos, s, n = 3, key = 'sm') => { for (let i = 0; i < n; i++) { const t = q(((f / 26) + i / n) % 1, 2); out.push(FX(key + i + t, (p) => T.fxPuff(p, t), [pos[0] + 0.3 * Math.sin(i * 2), pos[1] + t * 1.4, pos[2]], s * (1 + t), { order: 4 })); } };
  if (id === 'hook' || id === 'loop') { const lf = id === 'loop' ? -99 : hookBoom(f); push(boom(lf, -6, [P1[0], P1[1] + 0.5, P1[2] + 0.2], 0.55, 3)); smokeAt([P1[0], P1[1] + 0.3, P1[2] + 0.1], 0.6);
    if (id === 'hook') { push(wordCard(f, F_NZ, 'NEW ZEALAND', cam, '#ffffff', F_EXPL - F_NZ - 3, 170, 0.6, 2)); push(wordCard(f, F_EXPL, 'EXPLODING PANTS', cam, '#f6c83a', 1e9, 170, 0.6, 2)); } }
  if (id === 'bang') { push(boom(f, F_BANG1, [0.4, gnd(0.4, -0.5) + 0.3, -0.3], 0.6, 5)); if (f > F_BANG1 + 6) smokeAt([0.4, gnd(0.4, -0.5) + 0.3, -0.3], 0.6); push(wordCard(f, F_BANG1, 'BANG!', cam, '#ff7a3a', 1e9, 220, 0.62, 2)); }
  if (id === 'tin') { push(wordCard(f, F_WEED, 'WEEDKILLER', cam, '#9ad04a', 1e9, 190, 0.6, 1.0)); }
  if (id === 'gov') { push(wordCard(f, F_1930, '1930s', cam, '#f6c83a', F_GOV - F_1930 - 3, 200, 0.6, 2)); push(wordCard(f, F_GOV, 'GOVERNMENT ADVICE', cam, '#ffffff', 1e9, 150, 0.6, 2)); }
  if (id === 'rag') { out.push(FX('cw', (p) => cow(p, true), [3.2, gnd(3, -6) + 0.85, -6], 0.9, { order: 3, blob: true })); push(wordCard(f, F_RAG, 'RAGWORT', cam, '#f6c83a', 1e9, 200, 0.6, 2)); }
  if (id === 'spray' || id === 'soak') { for (let i = 0; i < 4; i++) { const t = q(((f / 14) + i / 4) % 1, 2); out.push(FX('sp' + i + t, (p) => T.fxPuff(p, t), [0.5 + t * 0.8, gnd(0.5, 0.3) + 0.2 + i * 0.05, 0.3], 0.5 + t * 0.4, { order: 4, alpha: 0.8 })); }
    if (id === 'spray') push(wordCard(f, F_KILL, 'WEEDS: DEAD', cam, '#9ad04a', 1e9, 180, 0.62, 2));
    else push(wordCard(f, F_SOAK, 'SOAKED IN', cam, '#ff9a4a', 1e9, 200, 0.62, 1.4)); }
  if (id === 'match') { const t = f > F_MATCH ? q(Math.min(1, (f - F_MATCH) / 8), 2) : 0; out.push(FX('mh' + t, (p) => matchHead(p, t), inFront(cam, 1.2, 0.0, -0.1), 0.34, { order: 7 }));
    push(wordCard(f, F_DRIED, 'DRY = FUEL', cam, '#ffffff', F_MATCH - F_DRIED - 2, 180, 0.62, 1.2)); push(wordCard(f, F_MATCH, 'MATCH HEAD!', cam, '#ff7a3a', 1e9, 190, 0.62, 1.2)); }
  if (id === 'line') { const sm = ramp(f, F_SMOKE - 6, F_SMOKE + 20); for (let i = 0; i < 3; i++) out.push(FX('pl' + i + (i === 1 ? q(sm, 1) : 0) + (i === 1 ? f % 24 : 0), (p) => pantsShape(p, 0, i === 1 ? sm : 0, f), [HOUSE[0] + 4.5 + i * 1.5, 2.12, HOUSE[2] + 9.02], 0.45, { order: 3, roll: 0.03 * Math.sin(f * 0.1 + i) }));
    push(wordCard(f, F_WORSE, 'IT GETS WORSE', cam, '#ff7a3a', F_LINE - F_WORSE - 3, 170, 0.6, 2)); push(wordCard(f, F_SMOKE, 'SMOKING!', cam, '#ffffff', 1e9, 200, 0.6, 2)); }
  if (id === 'fire') { const burnt = f > F_BANG2 + 3 ? 1 : 0; out.push(FX('fp' + burnt + (burnt ? f % 24 : 0), (p) => pantsShape(p, burnt, burnt, f), [KIT[0], 1.5, KIT[2] - 2.1], 0.5, { order: 3 }));
    push(boom(f, F_BANG2, [KIT[0], 1.25, KIT[2] - 1.9], 0.9, 7)); push(wordCard(f, F_BANG2, 'BANG!', cam, '#ff7a3a', 1e9, 220, 0.6, 1.8)); }
  if (id === 'paper') { out.push(FX('pc', (p) => paperCard(p), inFront(cam, 1.3, 0.35, -0.2), 0.22, { order: 7, roll: -0.05 })); push(wordCard(f, F_70, '70 YEARS LATER', cam, '#ffffff', 1e9, 160, 0.62, 1.6)); }
  if (id === 'prize') { const t = M.back(ramp(f, F_IG - 2, F_IG + 8)); out.push(FX('tr' + q(t, 2), trophy, inFront(cam, 1.4, 0.3, -0.05), 0.3 * Math.max(0.05, t), { order: 7 })); push(wordCard(f, F_IG, 'IG NOBEL PRIZE', cam, '#f6c83a', 1e9, 170, 0.62, 1.6)); }
  if (id === 'title') out.push(FX('pt', (p) => paperCard(p, true), inFront(cam, 1.2, 0, 0.02), 0.42, { order: 7 }));
  return out;
}

// ---------------- cameras ----------------
const G = (x, z) => gnd(x, z);
const CAMS = {
  hook: [{ f: 0, pos: [0.2, G(0, 4) + 1.2, 3.8], look: [-0.1, G(0, 0) + 1.0, 0], fov: 46 }, { f: F_EXPL, pos: [0.1, G(0, 4) + 1.1, 3.2], look: [-0.1, G(0, 0) + 1.0, 0], fov: 42, ease: 'easeOut' }, { f: cut(1), pos: [0.1, G(0, 4) + 1.1, 3.0], look: [-0.1, G(0, 0) + 1.0, 0], fov: 41 }],
  bang: [{ f: cut(1), pos: [1.4, G(1, 3) + 0.5, 3.2], look: [0.4, G(0.4, -0.5) + 1.2, -0.5], fov: 46 }, { f: F_WEAR, pos: [0.8, G(1, 3) + 1.0, 2.6], look: [0.4, G(0.4, -0.5) + 1.1, -0.5], fov: 42 }, { f: cut(2), pos: [0.75, G(1, 3) + 1.0, 2.5], look: [0.4, G(0.4, -0.5) + 1.1, -0.5], fov: 41 }],
  tin: [{ f: cut(2), pos: [2.7, G(2.4, 3.5) + 1.7, 5.4], look: [2.4, G(2.4, 3.5) + 1.35, 3.5], fov: 40 }, { f: cut(3), pos: [2.6, G(2.4, 3.5) + 1.6, 5.0], look: [2.4, G(2.4, 3.5) + 1.38, 3.5], fov: 38 }],
  gov: [{ f: cut(3), pos: [0.2, G(0, 4) + 1.5, 4.2], look: [0.2, G(0, 0) + 1.3, -0.8], fov: 44 }, { f: F_GOV, pos: [-0.4, G(0, 4) + 1.4, 3.0], look: [-0.5, G(0, 0) + 1.4, -0.4], fov: 40 }],
  rag: [{ f: F_RAG - 4, pos: [1.0, G(1, 2) + 0.5, 2.0], look: [2.6, G(2, -5) + 0.9, -6], fov: 46 }, { f: cut(4), pos: [1.2, G(1, 2) + 0.6, 1.2], look: [2.8, G(2, -5) + 0.9, -6], fov: 44 }],
  spray: [{ f: cut(4), pos: [1.8, G(1, 4) + 1.3, 3.6], look: [0, G(0, 0) + 1.0, -0.2], fov: 46 }, { f: F_SOAK - 4, pos: [1.2, G(1, 4) + 1.2, 3.0], look: [0, G(0, 0) + 1.0, -0.2], fov: 44 }],
  soak: [{ f: F_SOAK - 4, pos: [-0.1, G(0, 2) + 0.55, 1.9], look: [-0.3, G(0, 0) + 0.45, 0], fov: 42 }, { f: cut(5), pos: [-0.15, G(0, 2) + 0.5, 1.6], look: [-0.3, G(0, 0) + 0.45, 0], fov: 40 }],
  match: [{ f: cut(5), pos: [KIT[0] + 0.5, 1.5, KIT[2] + 1.6], look: [KIT[0] + 0.3, 1.2, KIT[2] - 3], fov: 40 }, { f: cut(6), pos: [KIT[0] + 0.45, 1.5, KIT[2] + 1.3], look: [KIT[0] + 0.3, 1.2, KIT[2] - 3], fov: 38 }],
  line: [{ f: cut(6), pos: [HOUSE[0] + 6, 1.7, HOUSE[2] + 16], look: [HOUSE[0] + 6, 2.0, HOUSE[2] + 7], fov: 46 }, { f: F_SMOKE, pos: [HOUSE[0] + 6, 1.9, HOUSE[2] + 11.4], look: [HOUSE[0] + 6, 1.9, HOUSE[2] + 8], fov: 42 }, { f: cut(7), pos: [HOUSE[0] + 6, 1.9, HOUSE[2] + 11.1], look: [HOUSE[0] + 6, 1.9, HOUSE[2] + 8], fov: 41 }],
  fire: [{ f: cut(7), pos: [KIT[0] + 1.6, 1.5, KIT[2] + 3.4], look: [KIT[0] + 0.6, 1.2, KIT[2] - 2], fov: 46 }, { f: F_BANG2, pos: [KIT[0] + 0.6, 1.4, KIT[2] + 1.6], look: [KIT[0] + 0.2, 1.2, KIT[2] - 2.2], fov: 44, ease: 'easeOut' }, { f: cut(8), pos: [KIT[0] + 0.6, 1.4, KIT[2] + 1.4], look: [KIT[0] + 0.2, 1.2, KIT[2] - 2.2], fov: 43 }],
  paper: [{ f: cut(8), pos: [STUDY[0] + 0.3, 1.5, STUDY[2] + 2.6], look: [STUDY[0] - 0.2, 1.3, STUDY[2] - 1.6], fov: 44 }, { f: F_IG - 4, pos: [STUDY[0] + 0.2, 1.45, STUDY[2] + 2.0], look: [STUDY[0] - 0.3, 1.3, STUDY[2] - 1.6], fov: 42 }],
  prize: [{ f: F_IG - 4, pos: [STUDY[0] - 0.4, 1.4, STUDY[2] + 1.8], look: [STUDY[0] - 0.2, 1.35, STUDY[2] - 1.6], fov: 42 }, { f: cut(9), pos: [STUDY[0] - 0.4, 1.4, STUDY[2] + 1.5], look: [STUDY[0] - 0.2, 1.35, STUDY[2] - 1.6], fov: 41 }],
  title: [{ f: cut(9), pos: [STUDY[0], 1.45, STUDY[2] + 2.4], look: [STUDY[0], 1.0, STUDY[2] - 0.4], fov: 40 }, { f: F_LOOP, pos: [STUDY[0], 1.45, STUDY[2] + 2.1], look: [STUDY[0], 1.0, STUDY[2] - 0.4], fov: 38 }],
  loop: [{ f: F_LOOP, pos: [0.15, G(0, 4) + 1.15, 3.5], look: [-0.1, G(0, 0) + 1.0, 0], fov: 44 }, { f: TOTAL - 1, pos: [0.2, G(0, 4) + 1.2, 3.8], look: [-0.1, G(0, 0) + 1.0, 0], fov: 46 }],
};
const KICKS = [{ f: 1, a: 0.04 }, { f: F_EXPL, a: 0.03 }, { f: F_BANG1, a: 0.06 }, { f: F_WEED, a: 0.02 }, { f: F_SOAK, a: 0.02 }, { f: F_MATCH, a: 0.03 }, { f: F_SMOKE, a: 0.02 }, { f: F_BANG2, a: 0.07 }, { f: F_IG, a: 0.03 }];
const camAt = (f) => { const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS }); c.shadowAt = [c.look[0], 0, c.look[2]]; return c; };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => { const id = shotAt(f).id;
  if (['hook', 'loop'].includes(id)) return { focus: dist(Cm.pos, [0, G(0, 0) + 1, 0]), cinf: 8 };
  if (id === 'bang') return { focus: dist(Cm.pos, [0.4, G(0.4, -0.5) + 1, -0.5]), cinf: 9 };
  if (id === 'tin') return { focus: dist(Cm.pos, [2.4, G(2.4, 3.5) + 1.4, 3.5]), cinf: 18 };
  if (id === 'match' || id === 'title') return { focus: 1.2, cinf: 16 };
  if (id === 'soak') return { focus: dist(Cm.pos, [-0.3, G(0, 0) + 0.5, 0]), cinf: 14 };
  if (['paper', 'prize'].includes(id)) return { focus: dist(Cm.pos, [STUDY[0] - 0.4, 1.3, STUDY[2] - 1.6]), cinf: 10 };
  if (id === 'fire') return { focus: dist(Cm.pos, [KIT[0], 1.3, KIT[2] - 2]), cinf: 8 };
  return { focus: 10, cinf: 0 }; };

export default {
  TOTAL, build, look: 'rich',
  frame(f, k) {
    const S = shotAt(f), cam = camAt(f), id = S.id;
    flames.children.forEach((c, i) => { c.scale.y = 0.8 + 0.35 * Math.sin(f * 0.5 + i * 1.7); });
    const indoor = ['match', 'fire', 'paper', 'prize', 'title'].includes(id);
    const light = indoor ? { ...IN } : { ...DAY };
    lamps.forEach((l) => { l.light.visible = indoor; if (l.glow) l.glow.visible = indoor; });
    const R = { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
    if (id === 'fire' && f >= F_BANG2 && f < F_BANG2 + 6) R.light = { ...IN, exposure: 1.6 };
    return R;
  },
};
