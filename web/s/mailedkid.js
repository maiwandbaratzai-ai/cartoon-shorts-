// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Mailed to Grandma" — May Pierstorff, Grangeville → Lewiston, Idaho, 19 Feb 1914. Timed via mailedkid_timing.js.
import { TOTAL, LINES, wf } from './mailedkid_timing.js';
import * as PR from '../props.js';
import { INK } from '../toon.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], cut = (i) => Math.max(0, A(i) - 4);
const W = wf;
const F_MAILED = W(0, 'mailed'), F_GRAN0 = W(0, 'grandma'), F_STAMPS = W(1, 'stamps'), F_COAT = W(1, 'coat'), F_1914 = W(2, '1914'), F_PARCEL = W(2, 'parcel'),
  F_50 = W(2, '50'), F_48 = W(3, '48'), F_SO3 = W(3, 'so'), F_PKG = W(3, 'package'), F_TICKET = W(4, 'ticket'), F_SO4 = W(4, 'so'), F_SACKS = W(5, 'sacks'),
  F_WEIRD = W(6, 'weirdest'), F_UTAH = W(7, 'utah'), F_BANK = W(7, 'bank'), F_40 = W(7, '40'), F_B50 = W(7, '50'), F_BANNED = W(8, 'banned'), F_PEOPLE = W(8, 'people'),
  F_LATE = W(9, 'late'), F_HAND = W(9, 'hand'), F_GRAN = W(9, 'grandma');
const F_LOOP = TOTAL - 16;
const SHOTS = [['hook', 0], ['stamps', cut(1)], ['office', cut(2)], ['dial', cut(3)], ['pkg', F_SO3 - 4], ['ticket', cut(4)], ['train', F_SO4 - 4], ['car', cut(5)],
  ['weird', cut(6)], ['bank', cut(7)], ['brick', F_B50 - 4], ['ban', cut(8)], ['door', cut(9)], ['loop', F_LOOP]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

// sets: post office at origin, mail car interior at CAR, snowy station / Grandma's street at OUT, Utah at UT
const CAR = [60, 0, 0], OUT = [300, 0, 0], UT = [-300, 0, 0], PORCH = [OUT[0] + 40, 0, OUT[2] - 30];
const IN = { az: 200, el: 40, sky: '#b8a890', ground: '#3a2a1e', hemi: 0.42, sun: '#dce8ff', sunI: 0.0, fog: '#2a1e16', fogNear: 9, fogFar: 34,
  skyTop: '#2a1e16', skyHor: '#2a1e16', sat: 1.05, vig: 0.32, shadowExt: 12, exposure: 1.2, bloom: 0.5, cardTint: '#fff0e0' };
const SNOW = { az: 210, el: 26, sky: '#dfe8f4', ground: '#c8ccd4', hemi: 0.95, sun: '#fff0dc', sunI: 2.2, fog: '#dfe6ee', fogNear: 40, fogFar: 260,
  skyTop: '#7fa2cc', skyHor: '#e6edf4', sat: 1.1, vig: 0.24, shadowExt: 26, exposure: 1.02, cardTint: '#f4f8ff' };
const UTL = { az: 150, el: 36, sky: '#cfe0f4', ground: '#b0603a', hemi: 0.9, sun: '#fff0d4', sunI: 2.8, fog: '#f0d8c0', fogNear: 80, fogFar: 700,
  skyTop: '#2f72cc', skyHor: '#f2dcc0', sat: 1.14, vig: 0.22, shadowExt: 30, exposure: 1.05 };
let K, grille, dial, needle, smoke = [];
const rnd = (() => { let s = 1914; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();

const txtTex = (w, h, bg, fg, lines, font = 'bold 64px Georgia, serif') => PR.canvasTex(w, h, (g) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
  lines.forEach((t, i) => g.fillText(t, w / 2, h * (i + 1) / (lines.length + 1))); });
const plane = (w, h, map, x, y, z, ry = 0, parent = K.scene) => { const m = K.add(new K.THREE.PlaneGeometry(w, h), K.toon({ map, kind: 'wood', amt: 0.25, plain: true }), x, y, z, parent, { cast: false }); m.rotation.y = ry; return m; };
const sack = (x, y, z, s = 1, parent = K.scene, col = '#c8b490') => { const m = K.sphere(0.45 * s, K.mat('fabric', col, { detail: 0.3 }), x, y + 0.36 * s, z, parent, 1, 0.8, 1.15); m.rotation.set(rnd() * 0.4, rnd() * 3, rnd() * 0.4);
  K.cyl(0.08 * s, 0.14 * s, 0.25 * s, K.mat('fabric', '#a89070'), x, y + 0.7 * s, z, parent, 10); };
const parcel = (x, y, z, s, parent, ry = 0) => { const g = K.group(parent); g.position.set(x, y, z); g.rotation.y = ry;
  K.slab(-0.3 * s, 0.3 * s, 0, 0.32 * s, -0.22 * s, 0.22 * s, K.mat('fabric', '#b88a5a', { detail: 0.4, amt: 0.3 }), g);
  K.slab(-0.31 * s, 0.31 * s, 0, 0.325 * s, -0.02 * s, 0.02 * s, K.mat('fabric', '#e8dcc0', { plain: true }), g, false);
  K.slab(-0.02 * s, 0.02 * s, 0, 0.325 * s, -0.225 * s, 0.225 * s, K.mat('fabric', '#e8dcc0', { plain: true }), g, false); return g; };

function build(k) {
  K = k; const { THREE } = K;
  const plank = K.mat('wood', '#8a5c36', { detail: 1.2 }), dark = K.mat('wood', '#5e3c24', { detail: 1.4 }), plaster = K.mat('plaster', '#d8c8a8', { detail: 2 }),
    brass = K.mat('metal', '#c8a040', { roughness: 0.35 }), iron = K.mat('metal', '#34302e', { roughness: 0.55 }), glass = new THREE.MeshBasicMaterial({ color: '#ffd9a0' });
  // ---------- post office (origin): counter along x at z=-1.4, back wall z=-4 ----------
  K.slab(-6, 6, -0.1, 0, -4.2, 8, K.mat('wood', '#7a5234', { detail: 0.9 }), K.scene, false);
  K.slab(-6, 6, 0, 4.2, -4.4, -4.2, plaster); K.slab(-6.2, -6, 0, 4.2, -4.4, 8, plaster); K.slab(6, 6.2, 0, 4.2, -4.4, 8, plaster); K.slab(-6, 6, 4.2, 4.4, -4.4, 8, dark);
  K.slab(-6, 6, 0, 1.0, -4.2, -4.1, dark); // wainscot
  K.slab(-5, 5, 0, 1.15, -1.6, -1.2, plank); K.slab(-5.1, 5.1, 1.15, 1.25, -1.7, -1.1, dark); // counter
  grille = K.group(); for (let i = 0; i < 6; i++) K.slab(-4.6 + i * 1.8, -4.5 + i * 1.8, 1.25, 2.3, -1.45, -1.35, brass, grille); // grille bars
  // pigeonholes on the back wall
  const pig = PR.canvasTex(512, 384, (g, w, h) => { g.fillStyle = '#4a2e1a'; g.fillRect(0, 0, w, h); for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) { g.fillStyle = '#2a1a10'; g.fillRect(8 + c * 63, 8 + r * 62, 55, 54);
    if ((r * 8 + c) % 3) { g.fillStyle = ['#f4ecd8', '#e8d8b0', '#dfe8f0'][(r + c) % 3]; g.fillRect(14 + c * 63, 30 + r * 62, 42, 30); } } });
  plane(4.6, 3.4, pig, -2.0, 2.25, -4.08);
  plane(3.4, 0.8, txtTex(512, 120, '#2a3a5a', '#f2e2b0', ['PARCEL POST']), 2.6, 3.4, -4.08);
  plane(1.0, 1.3, txtTex(200, 260, '#f4ecd8', '#3a2a1a', ['FEB', '1914'], 'bold 60px Georgia, serif'), 2.0, 2.2, -4.08);
  plane(1.5, 1.0, txtTex(300, 200, '#e8dcc0', '#8a2a1a', ['RATES', 'BY WEIGHT'], 'bold 40px Georgia, serif'), 3.6, 2.1, -4.08);
  // shelves with parcels + sacks
  for (let i = 0; i < 6; i++) parcel(-4.2 + (i % 3) * 0.7, 1.25, -1.4 + (i < 3 ? 0 : 0), 0.9, K.scene, rnd() * 0.4);
  for (let i = 0; i < 5; i++) sack(-5.2 + i * 0.55, 0, 1.0 + (i % 2) * 0.6, 0.9);
  sack(4.9, 0, 2.2); sack(5.2, 0, 3.0, 0.8);
  // window on the left wall with snow light
  K.slab(-6.02, -5.98, 1.2, 3.0, 2.2, 4.2, new THREE.MeshBasicMaterial({ color: '#dfeaf8' })); K.slab(-5.98, -5.9, 2.05, 2.15, 2.2, 4.2, dark); K.slab(-5.98, -5.9, 1.2, 3.0, 3.15, 3.25, dark);
  K.shaft([-5.8, 2.6, 3.2], [-2.6, 0, 3.0], 0.5, 1.4, '#dfeaff', 0.16);
  // the parcel scale: platform + column + round dial facing +z
  const sc = K.group(); sc.position.set(0.9, 0, 0.6);
  K.slab(-0.75, 0.75, 0, 0.26, -0.6, 0.6, iron, sc); K.slab(-0.7, 0.7, 0.26, 0.3, -0.55, 0.55, brass, sc);
  K.slab(-0.07, 0.07, 0.3, 2.0, -0.6, -0.46, iron, sc);
  dial = K.group(sc); dial.position.set(0, 2.25, -0.5);
  K.add(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 40).rotateX(Math.PI / 2), brass, 0, 0, 0, dial);
  K.add(new THREE.CircleGeometry(0.36, 40), K.toon({ map: PR.canvasTex(256, 256, (g) => { g.fillStyle = '#f6f0e0'; g.fillRect(0, 0, 256, 256); g.strokeStyle = '#2a2a2a'; g.lineWidth = 5; g.fillStyle = '#2a2a2a'; g.font = 'bold 26px Georgia'; g.textAlign = 'center';
    for (let i = 0; i <= 10; i++) { const a = Math.PI * (0.75 + i * 0.15); g.beginPath(); g.moveTo(128 + Math.cos(a) * 95, 128 + Math.sin(a) * 95); g.lineTo(128 + Math.cos(a) * 118, 128 + Math.sin(a) * 118); g.stroke();
      if (i % 2 === 0) g.fillText(String(i * 5), 128 + Math.cos(a) * 72, 136 + Math.sin(a) * 72); } g.fillText('LB', 128, 190); }), plain: true }), 0, 0, 0.045, dial, { cast: false });
  needle = K.group(dial); needle.position.z = 0.06; K.slab(-0.012, 0.012, 0, 0.3, -0.005, 0.005, K.col('#c8302a'), needle); K.cyl(0.03, 0.03, 0.02, iron, 0, 0, 0, dial).rotation.x = Math.PI / 2;
  // stamp desk, inkpad, lamps
  K.slab(1.9, 3.4, 0.78, 0.86, 1.6, 2.4, plank); for (const [x, z] of [[1.95, 1.65], [3.35, 1.65], [1.95, 2.35], [3.35, 2.35]]) K.slab(x - 0.04, x + 0.04, 0, 0.78, z - 0.04, z + 0.04, dark);
  K.slab(2.2, 2.6, 0.86, 0.9, 1.8, 2.1, K.col('#3a2a5a')); K.cyl(0.04, 0.06, 0.22, dark, 2.9, 0.86, 2.0);
  for (const [x, z] of [[-1.4, -0.4], [2.6, 1.2]]) { K.slab(x - 0.01, x + 0.01, 3.1, 4.2, z - 0.01, z + 0.01, iron);
    K.add(new THREE.CylinderGeometry(0.06, 0.28, 0.22, 20, 1, true), brass, x, 3.0, z); K.add(new THREE.SphereGeometry(0.08, 12, 8), glass, x, 2.88, z, K.scene, { cast: false });
    K.lamp(x, 2.82, z, { color: '#ffb468', intensity: 3.4, distance: 9, glowS: 0.5, flicker: 0.05 }); }
  K.dust([0, 2, 0], [8, 3, 6], 160);
  // ---------- mail car interior (CAR) ----------
  const cr = K.group(); cr.position.set(...CAR);
  K.slab(-1.6, 1.6, -0.1, 0, -7, 7, K.mat('wood', '#6e4a2e', { detail: 0.8 }), cr, false);
  for (const s of [-1, 1]) K.slab(s * 1.6 - 0.1, s * 1.6 + 0.1, 0, 2.8, -7, 7, K.mat('wood', '#7a5236', { detail: 1.0 }), cr);
  const roof = K.add(new THREE.CylinderGeometry(1.75, 1.75, 14, 24, 1, true, -Math.PI / 2, Math.PI), K.mat('wood', '#5a3a24'), 0, 2.6, 0, cr); roof.rotation.x = Math.PI / 2; roof.scale.set(1, 1, 0.35); roof.material.side = THREE.DoubleSide;
  plane(3.0, 2.0, pig, 0, 1.6, -6.9, 0, cr); // sorting rack at the end wall
  const rack = PR.canvasTex(256, 512, (g, w, h) => { g.fillStyle = '#4a2e1a'; g.fillRect(0, 0, w, h); for (let r = 0; r < 10; r++) { g.fillStyle = '#2a1a10'; g.fillRect(10, 10 + r * 50, 236, 42); g.fillStyle = '#efe4cc'; g.fillRect(20 + (r * 37) % 80, 26 + r * 50, 120, 22); } });
  const rk = plane(4, 2, rack, 1.48, 1.5, -1.5, -Math.PI / 2, cr); rk.rotation.z = Math.PI / 2;
  for (let i = 0; i < 9; i++) sack(-1.0 + (i % 3) * 0.45, 0, -3.5 + Math.floor(i / 3) * 0.9 + (i % 2) * 0.2, 0.85, cr, ['#c8b490', '#b8a07a', '#d4c4a0'][i % 3]);
  for (let i = 0; i < 4; i++) sack(-1.05 + i * 0.25, 0, 1.6 + (i % 2) * 0.5, 0.8, cr);
  K.slab(-1.48, -1.4, 0.8, 2.2, -0.5, 0.9, new THREE.MeshBasicMaterial({ color: '#e8f0fa' }), cr); // open door
  K.shaft([CAR[0] - 1.45, 1.8, 0.2], [CAR[0] + 0.3, 0, 0.6], 0.5, 1.0, '#e4eeff', 0.14);
  K.lamp(CAR[0] + 0.9, 2.3, -1.2, { color: '#ffb468', intensity: 3.2, distance: 8, glowS: 0.45, flicker: 0.08 });
  // ---------- snowy station + street (OUT) ----------
  const out = K.group(); out.position.set(...OUT);
  const snow = K.mat('plaster', '#eef2f8', { detail: 3, amt: 0.15 });
  K.slab(-120, 120, -0.1, 0, -160, 80, snow, out, false);
  for (const x of [-1.4, 1.4].map((v) => v + 6)) K.slab(x - 0.06, x + 0.06, 0.1, 0.22, -150, 60, iron, out);
  K.slab(-1, 2.6, 0, 0.9, -40, 20, K.mat('wood', '#8a7a6a', { detail: 1.4 }), out); // platform
  // locomotive + mail car + coach (along z, track x=6)
  const tr = K.group(out); tr.position.set(6, 0, 0);
  const bl = K.mat('metal', '#2a2a30', { roughness: 0.45 }), red = K.mat('metal', '#a8302a', { roughness: 0.5 }), green = K.mat('wood', '#3a5a3e', { detail: 1.2 });
  const boil = K.add(new THREE.CylinderGeometry(1.2, 1.2, 8, 28).rotateX(Math.PI / 2), bl, 0, 2.6, -26, tr); K.slab(-1.5, 1.5, 1.3, 4.6, -21.5, -19, bl, tr); K.slab(-1.6, 1.6, 4.6, 4.8, -21.8, -18.8, red, tr);
  K.cyl(0.35, 0.55, 1.8, bl, 0, 3.6, -29, tr); K.cyl(0.4, 0.4, 0.6, brass, 0, 3.6, -26, tr); K.add(new THREE.ConeGeometry(1.4, 1.6, 4).rotateX(-Math.PI / 2), red, 0, 1.1, -30.6, tr);
  for (let i = 0; i < 4; i++) for (const s of [-1, 1]) K.add(new THREE.CylinderGeometry(0.75, 0.75, 0.2, 24).rotateZ(Math.PI / 2), red, s * 1.15, 0.85, -28 + i * 2, tr);
  K.add(new THREE.SphereGeometry(0.35, 16, 10), new THREE.MeshBasicMaterial({ color: '#fff4c0' }), 0, 2.8, -30.1, tr, { cast: false });
  const mc = K.group(tr); mc.position.z = -9; K.slab(-1.6, 1.6, 1.0, 4.4, -8, 8, green, mc); K.slab(-1.75, 1.75, 4.4, 4.7, -8.2, 8.2, K.mat('wood', '#3a2a24'), mc);
  plane(4.6, 0.9, txtTex(512, 100, '#3a5a3e', '#f2d890', ['U.S. MAIL']), -1.62, 3.6, -3.5, -Math.PI / 2, mc);
  plane(4.6, 0.6, txtTex(512, 70, '#3a5a3e', '#f2d890', ['RAILWAY POST OFFICE'], 'bold 40px Georgia, serif'), -1.62, 2.7, -3.5, -Math.PI / 2, mc);
  K.slab(-1.62, -1.58, 1.2, 3.6, 0.5, 2.3, K.col('#1e1a18'), mc);
  for (const z of [-6, 6]) for (const s of [-1, 1]) K.add(new THREE.CylinderGeometry(0.45, 0.45, 0.2, 18).rotateZ(Math.PI / 2), iron, s * 1.15, 0.5, z, mc);
  const co = K.group(tr); co.position.z = 8; K.slab(-1.6, 1.6, 1.0, 4.4, -8, 8, K.mat('wood', '#8a3a2a'), co); K.slab(-1.75, 1.75, 4.4, 4.7, -8.2, 8.2, K.mat('wood', '#3a2a24'), co);
  for (let i = 0; i < 6; i++) K.slab(-1.62, -1.58, 2.4, 3.6, -6.5 + i * 2.2, -5.5 + i * 2.2, new THREE.MeshBasicMaterial({ color: '#ffe0a8' }), co);
  // depot building
  const dp = K.group(out); dp.position.set(-5, 0, -8); K.slab(-3, 3, 0, 4, -6, 6, K.mat('wood', '#b8763a', { detail: 1.4 }), dp); const dr = K.add(new THREE.CylinderGeometry(0.1, 5.2, 2.2, 4, 1), K.mat('wood', '#5a3a2a'), 0, 5.1, 0, dp); dr.rotation.y = Math.PI / 4; dr.scale.set(0.85, 1, 1.55);
  K.slab(-3.3, 3.3, 5.2, 5.5, -6.3, 6.3, snow, dp);
  plane(4, 0.8, txtTex(512, 100, '#2a1e16', '#f2e2c0', ['GRANGEVILLE']), 3.02, 3.4, 0, Math.PI / 2, dp);
  // pines + hills
  const pine = K.mat('grime', '#2e5a42', { amt: 0.6 }), bark = K.mat('wood', '#4a3020');
  for (let i = 0; i < 70; i++) { const x = (rnd() - 0.5) * 200, z = -40 - rnd() * 110; if (Math.abs(x - 6) < 6) continue; const s = 1 + rnd() * 1.6; K.cyl(0.2 * s, 0.3 * s, 2 * s, bark, x, 0, z, out);
    for (let j = 0; j < 3; j++) { K.add(new THREE.ConeGeometry((2.2 - j * 0.55) * s, 2.6 * s, 9), pine, x, (2.4 + j * 1.3) * s, z, out); K.add(new THREE.ConeGeometry((1.6 - j * 0.45) * s, 0.9 * s, 9), snow, x, (3.3 + j * 1.3) * s, z, out); } }
  for (let i = 0; i < 7; i++) K.sphere(70, K.mat('plaster', '#e4ecf4', { detail: 8 }), -260 + i * 90, -30, -230 - (i % 2) * 40, out, 1.3, 0.8, 0.8);
  // Grandma's house (PORCH)
  const gh = K.group(); gh.position.set(...PORCH);
  K.slab(-5, 5, 0, 4.6, -6, 0, K.mat('wood', '#e4d8c0', { detail: 0.7 }), gh); const gr = K.add(new THREE.CylinderGeometry(0.1, 6.6, 2.6, 4, 1), K.mat('wood', '#6a3a30'), 0, 5.9, -3, gh); gr.rotation.y = Math.PI / 4; gr.scale.set(1.15, 1, 0.75);
  K.slab(-5.6, 5.6, 6.4, 6.7, -6.4, 0.4, snow, gh, false);
  K.slab(-0.7, 0.7, 0.4, 2.8, 0.0, 0.08, K.mat('wood', '#7a3a2a'), gh); K.sphere(0.06, brass, 0.45, 1.6, 0.1, gh);
  for (const x of [-3, 3]) { K.slab(x - 0.8, x + 0.8, 1.6, 3.0, 0.0, 0.06, new THREE.MeshBasicMaterial({ color: '#ffd890' }), gh); K.slab(x - 0.9, x + 0.9, 1.5, 1.6, 0.0, 0.18, K.mat('wood', '#ffffff'), gh); }
  K.slab(-5, 5, 0, 0.4, 0, 2.6, K.mat('wood', '#a89a88'), gh); for (const x of [-4.8, 4.8, -1.3, 1.3]) K.slab(x - 0.1, x + 0.1, 0.4, 3.4, 2.4, 2.6, K.mat('wood', '#f0ece4'), gh);
  K.slab(-5.2, 5.2, 3.4, 3.6, 0, 2.8, K.mat('wood', '#6a3a30'), gh); K.slab(-5.2, 5.2, 3.6, 3.75, 0, 2.8, snow, gh, false);
  K.slab(-0.9, 0.9, 0, 0.2, 2.6, 3.2, K.mat('wood', '#a89a88'), gh);
  K.lamp(PORCH[0] - 1.1, 2.6, PORCH[2] + 0.4, { color: '#ffc070', intensity: 2.2, distance: 6, glowS: 0.5, flicker: 0.06 });
  // ---------- Utah: half-built brick bank in the desert (UT) ----------
  const ut = K.group(); ut.position.set(...UT);
  K.slab(-150, 150, -0.1, 0, -200, 80, K.mat('dirt', '#c88a5a', { detail: 2 }), ut, false);
  for (let i = 0; i < 6; i++) { const m = K.slab(-30, 30, 0, 26 + (i % 3) * 8, -10, 10, K.mat('rock', ['#b8603a', '#c8704a', '#a85a3a'][i % 3], { detail: 6, bump: 0.3 }), ut); m.position.set(-150 + i * 60, 0, -150 - (i % 2) * 30); m.scale.y = 1; m.geometry.translate(0, 13, 0); }
  const brick = K.mat('brick', '#b8583a', { detail: 0.5 });
  K.slab(-5, 5, 0, 4.0, -8, -7.5, brick, ut); for (const s of [-1, 1]) K.slab(s * 5 - 0.25, s * 5 + 0.25, 0, 2.6 + (s > 0 ? 0.8 : 0), -8, -1, brick, ut);
  for (let i = 0; i < 6; i++) K.slab(-5 + i * 1.6, -4.2 + i * 1.6, 4.0, 4.0 + 0.5 * ((i * 7) % 3), -8, -7.5, brick, ut);
  plane(5, 0.9, txtTex(512, 100, '#e8dcc0', '#7a2a1a', ['BANK OF VERNAL']), 0, 3.4, -7.4, 0, ut);
  for (let i = 0; i < 46; i++) { const r = Math.floor(i / 9), c = i % 9; parcel(-3.2 + c * 0.66 + (r % 2) * 0.2, r * 0.3, 0.8 + (r % 2) * 0.1, 1, ut, (rnd() - 0.5) * 0.3); }
  for (let i = 0; i < 18; i++) parcel(3 + (i % 4) * 0.66, Math.floor(i / 4) * 0.3, 2.4, 1, ut, (rnd() - 0.5) * 0.3);
  // wagon
  const wg = K.group(ut); wg.position.set(-5.5, 0, 3.5); wg.rotation.y = 0.5; K.slab(-1, 1, 0.6, 1.2, -1.8, 1.8, K.mat('wood', '#8a6a48'), wg);
  for (const [x, z] of [[-1.05, -1.2], [1.05, -1.2], [-1.05, 1.2], [1.05, 1.2]]) K.add(new THREE.TorusGeometry(0.5, 0.06, 6, 20).rotateY(Math.PI / 2), K.mat('wood', '#5a3a24'), x, 0.5, z, wg);
  for (let i = 0; i < 6; i++) parcel(-0.6 + (i % 3) * 0.6, 1.2 + Math.floor(i / 3) * 0.3, -0.5 + (i % 2) * 0.6, 0.9, wg);
  for (let i = 0; i < 20; i++) { const a = rnd() * 6.28, d = 14 + rnd() * 40; K.add(new THREE.DodecahedronGeometry(0.4 + rnd() * 1.2, 1), K.mat('rock', '#a8603a'), Math.cos(a) * d, 0, Math.sin(a) * d - 5, ut).scale.set(1, 0.6, 1); }
  K.addClouds(10, 700, 200);
}

// ---------------- 2D ----------------
const STAMPC = ['#c8302a', '#2a6ac8', '#2a8a4a', '#c87a20', '#8a3ac8', '#c8302a', '#2a6ac8', '#2a8a4a', '#c87a20'];
const stampsOn = (p, n) => { for (let i = 0; i < n; i++) { const x = 238 + (i % 3) * 44, y = 618 + Math.floor(i / 3) * 44, c = STAMPC[i];
  p.poly([[x, y], [x + 38, y], [x + 38, y + 38], [x, y + 38]], '#fffaf0', 3); p.poly([[x + 6, y + 6], [x + 32, y + 6], [x + 32, y + 32], [x + 6, y + 32]], c, 0); } };
const tag = (p) => { p.stroke([[300, 600], [352, 668]], 4, INK); p.poly([[330, 660], [400, 650], [408, 700], [338, 710]], '#f4e8c8', 4); p.g.fillStyle = INK; p.g.font = 'bold 13px Georgia'; p.g.fillText('LEWISTON', 340, 685); };
const bigStamp = (p, t, w = ['PARCEL', 'POST']) => { const s = 1 + 1.5 * (1 - t); p.g.save(); p.g.translate(300, 500); p.g.scale(s, s); p.g.rotate(-0.12); p.g.globalAlpha = t;
  p.poly([[-230, -110], [230, -110], [230, 110], [-230, 110]], 'rgba(0,0,0,0)', 0); p.g.strokeStyle = '#c8302a'; p.g.lineWidth = 16; p.g.strokeRect(-230, -100, 460, 200);
  p.g.fillStyle = '#c8302a'; p.g.font = 'bold 78px Georgia, serif'; p.g.textAlign = 'center'; if (w.length > 1) { p.g.fillText(w[0], 0, -10); p.g.fillText(w[1], 0, 70); } else p.g.fillText(w[0], 0, 28); p.g.restore(); };
const ticket = (p, t) => { p.poly([[40, 330], [560, 330], [560, 670], [40, 670]], '#f2e2b0', 10); p.g.fillStyle = INK; p.g.textAlign = 'center'; p.g.font = 'bold 50px Georgia, serif'; p.g.fillText('RAIL TICKET', 300, 420);
  p.g.font = 'bold 40px Georgia, serif'; p.g.fillText('GRANGEVILLE → LEWISTON', 300, 500); p.g.fillStyle = '#8a2a1a'; p.g.font = 'bold 70px Georgia, serif'; p.g.fillText('FULL FARE', 300, 610);
  if (t > 0) { p.stroke([[80, 360], [80 + 440 * t, 360 + 280 * t]], 30, '#d03a2a'); } };
const brickParcel = (p) => { p.poly([[80, 360], [520, 360], [520, 700], [80, 700]], '#b88a5a', 12); p.stroke([[300, 360], [300, 700]], 16, '#efe4c8'); p.stroke([[80, 530], [520, 530]], 16, '#efe4c8');
  for (let i = 0; i < 3; i++) p.poly([[380 + i * 40, 390], [414 + i * 40, 390], [414 + i * 40, 430], [380 + i * 40, 430]], STAMPC[i], 3); p.g.fillStyle = INK; p.g.font = 'bold 44px Georgia'; p.g.fillText('1 BRICK LOT', 110, 470); };
const noPeople = (p, t) => { p.poly([[50, 280], [550, 280], [550, 720], [50, 720]], '#f6eedc', 12); p.g.fillStyle = INK; p.g.textAlign = 'center'; p.g.font = 'bold 54px Georgia, serif'; p.g.fillText('NOTICE', 300, 370);
  p.g.font = 'bold 46px Georgia, serif'; p.g.fillText('NO MAILING', 300, 470); p.g.fillText('PEOPLE', 300, 540); p.g.font = 'bold 30px Georgia, serif'; p.g.fillText('— Postmaster General', 300, 640);
  if (t > 0) bigStamp(p, t, ['BANNED']); };

// ---------------- characters ----------------
const MAY = { jacket: '#c84a4a', pants: '#3b4f7a', boots: '#3a2a20', hat: 'bonnet', dress: '#c84a4a', build: 'kid', skin: '#f5d0ac' };
const MOM = { jacket: '#4a6a9a', pants: '#3b3f52', boots: '#3a2a20', hat: 'bonnet', dress: '#4a6a9a', skin: '#f5c9a0' };
const DAD = { jacket: '#6a5a4a', pants: '#3b3f52', boots: '#3a2a20', hat: 'hair', hair: '#5a3b2a', moustache: '#5a3b2a', skin: '#f0c49a' };
const CLERK = { jacket: '#2a3a5a', pants: '#2a3a5a', boots: INK, hat: 'cap', cap: '#2a3a5a', buttons: '#e8c45a', moustache: '#6a4a30', skin: '#f5c9a0' };
const GRAN = { jacket: '#7a5a8a', pants: '#3b3f52', boots: '#3a2a20', hat: 'hair', hair: '#d8d8d8', dress: '#7a5a8a', skin: '#f5d0b4', build: 'stout' };
const UTMAN = { jacket: '#e8dcc0', pants: '#5a4a3a', boots: '#3a2a20', hat: 'tophat', moustache: '#3a2a1a', skin: '#f0c49a' };
const LIGHT2D = -2.1;
const fo = (f, seed, o) => ({ mode: 'stand', light: LIGHT2D, seed, blink: blinkAt(f, seed), tilt: q(idle(f, seed).tilt, 1), headTilt: q(idle(f, seed).headTilt, 1), ...o });
const card = (T, key, o, opts, pos, extra = {}) => ({ key: key + JSON.stringify(opts), draw: (p) => T.bodyFront(p, o, opts), x: pos[0], y: pos[1], z: pos[2], ...extra });
const mayCard = (T, f, opts, pos, extra = {}, n = 9) => ({ key: 'may' + n + JSON.stringify(opts), draw: (p) => { T.bodyFront(p, MAY, opts); stampsOn(p, n); tag(p); }, x: pos[0], y: pos[1], z: pos[2], ...extra });
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1] - 1.07 * s, z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
const inFront = (c, d, ux, uy) => {
  const V = K.THREE.Vector3, p = new V(...c.pos), dir = new V(...c.look).sub(p).normalize(), right = new V().crossVectors(dir, new V(0, 1, 0)).normalize(), up = new V().crossVectors(right, dir);
  const h = d * Math.tan(c.fov * Math.PI / 360); return p.addScaledVector(dir, d).addScaledVector(right, ux * h).addScaledVector(up, uy * h).toArray();
};
const wordCard = (f, f0, txt, c, col = '#f6c83a', dur = 1e9, size = 170, uy = 0.42, d = 1.4) => { if (f < f0 - 1 || f > f0 + dur) return null; const t = q(Math.min(1, (f - f0 + 1) / 12));
  const r = Math.min(1, 400 / (0.7 * size * txt.length)), fs = size * r, s = Math.min(2.5, 1.25 / r);
  return FX('w' + txt + t + fs, (p) => PR.word(p, txt, t, col, fs), inFront(c, d, 0, uy), s * d / 7, { order: 9 }); };

const MAYPOS = [0.9, 0.3, 0.7];
function actorsAt(f, T) {
  const S = shotAt(f), id = S.id, out = [];
  const nSt = id === 'stamps' ? Math.min(9, Math.max(0, Math.floor((f - F_STAMPS + 2) / 3))) : 9;
  switch (id) {
    case 'hook': case 'loop': case 'stamps': case 'office': case 'pkg':
      out.push(mayCard(T, f, fo(f, 4, { expr: id === 'pkg' ? 'grin' : id === 'hook' && f < F_MAILED ? 'neutral' : id === 'office' ? 'smile' : 'grin', look: 0.1 }), MAYPOS, {}, nSt));
      if (id !== 'stamps') { out.push(card(T, 'mom', MOM, fo(f, 7, { expr: 'smile', look: 0.4, wave: id === 'hook' && f > F_GRAN0 ? Math.sin(f * 0.4) : undefined }), [-0.6, 0, 1.3]));
        out.push(card(T, 'dad', DAD, fo(f, 11, { expr: id === 'pkg' ? 'laugh' : 'whistle', look: 0.3 }), [-1.6, 0, 0.5]));
        out.push(card(T, 'clk', CLERK, fo(f, 3, { expr: id === 'office' ? 'stern' : id === 'pkg' ? 'shock' : 'nervous', look: -0.3 }), [2.1, 0, -2.3])); }
      break;
    case 'dial': break;
    case 'train': { const t = ramp(f, F_SO4 - 4, cut(5)); out.push(card(T, 'clk2', CLERK, fo(f, 3, { expr: 'grin', look: -0.2, prop: ['x', 0.3] }), [OUT[0] + 4.3, 0.9, OUT[2] - 8.5]));
      out.push(mayCard(T, f, fo(f, 4, { expr: 'grin', look: 0.3 }), [OUT[0] + lerp(3.2, 4.0, M.smooth(t)), 0.9 + 0.25 * M.smooth(t), OUT[2] - 7.2])); break; }
    case 'car': out.push(mayCard(T, f, fo(f, 4, { mode: 'sit', expr: f > F_SACKS ? 'grin' : 'smile', look: 0.2 }), [CAR[0] - 0.55, 0.35, CAR[2] - 0.2]));
      out.push(card(T, 'clk3', CLERK, fo(f, 3, { expr: 'smile', look: -0.4, prop: ['x', 0.2 + 0.2 * Math.sin(f * 0.3)] }), [CAR[0] + 0.85, 0, CAR[2] - 0.9])); break;
    case 'weird': out.push(card(T, 'clk4', CLERK, fo(f, 3, { expr: f > F_WEIRD - 2 ? 'shock' : 'neutral', look: 0.1 }), [CAR[0] + 0.2, 0, CAR[2] - 0.9]));
      out.push(mayCard(T, f, fo(f, 4, { mode: 'sit', expr: 'shock', look: -0.3 }), [CAR[0] - 0.75, 0.35, CAR[2] - 0.1])); break;
    case 'bank': { const w = ((f - cut(7)) / 40) % 1; out.push(card(T, 'ut', UTMAN, fo(f, 21, { expr: f > F_40 ? 'grin' : 'whistle', look: 0.3, prop: ['x', 0.5] }), [UT[0] + 1.3, 0, UT[2] + 3.2]));
      for (let i = 0; i < 2; i++) out.push(card(T, 'wk' + i, { ...CLERK, jacket: ['#c86a3a', '#6a8a4a'][i], hat: 'cap', cap: '#8a6a4a', buttons: null }, fo(f, 30 + i, { expr: 'nervous', look: 0.2, mode: 'march', phase: q(((f + i * 9) / 18) % 1, 2) }), [UT[0] - 2.5 + i * 1.8, 0, UT[2] + 1.8 - i * 0.5])); break; }
    case 'ban': out.push(card(T, 'clk5', CLERK, fo(f, 3, { expr: f > F_PEOPLE ? 'stern' : 'neutral', look: 0.3, prop: ['x', f > F_BANNED - 6 && f < F_BANNED + 6 ? 0.0 : 0.5] }), [2.5, 0, -3.2])); break;
    case 'door': { const t = M.smooth(ramp(f, cut(9), F_HAND + 6));
      out.push(card(T, 'gran', GRAN, fo(f, 13, { expr: f > F_GRAN - 6 ? 'laugh' : 'shock', look: -0.2, wave: f > F_GRAN ? Math.sin(f * 0.4) : undefined }), [PORCH[0] + 0.35, 0.4, PORCH[2] + 0.9]));
      out.push(card(T, 'clk6', CLERK, fo(f, 3, { expr: 'grin', look: 0.3 }), [PORCH[0] - 1.9, 0.2, PORCH[2] + 2.6]));
      out.push(mayCard(T, f, fo(f, 4, { expr: 'laugh', look: 0.2 }), [PORCH[0] + lerp(-1.2, -0.55, t), 0.4, PORCH[2] + lerp(2.4, 1.3, t)])); break; }
  }
  return out;
}

function fxAt(f, T, cam) {
  const S = shotAt(f), id = S.id, out = [], push = (x) => x && out.push(x);
  if (id === 'hook') { push(wordCard(f, F_MAILED, 'MAILED!', cam, '#f6c83a', F_GRAN0 - F_MAILED - 3, 200, 0.55, 2)); push(wordCard(f, F_GRAN0, 'TO GRANDMA', cam, '#ffffff', 1e9, 170, 0.55, 2)); }
  if (id === 'stamps') { if (f > F_COAT - 2) { const t = q(M.back(ramp(f, F_COAT - 2, F_COAT + 6)), 2); out.push(FX('bs' + t, (p) => bigStamp(p, Math.min(1, t)), inFront(cam, 1.0, 0.0, -0.2), 0.16, { order: 8, roll: 0 })); }
    push(wordCard(f, F_STAMPS, 'STAMPS!', cam, '#f6c83a', 1e9, 190, 0.8, 1.0)); }
  if (id === 'office') { push(wordCard(f, F_1914, '1914', cam, '#f6c83a', F_PARCEL - F_1914 - 3, 200, 0.55, 2)); push(wordCard(f, F_50, 'UNDER 50 LB', cam, '#ffffff', 1e9, 190, 0.55, 2)); }
  if (id === 'dial') push(wordCard(f, F_48, '48½ LB', cam, '#f6c83a', 1e9, 200, 0.6, 1.2));
  if (id === 'pkg') push(wordCard(f, F_PKG, 'PACKAGE', cam, '#f6c83a', 1e9, 200, 0.6, 2));
  if (id === 'ticket') { const t = q(ramp(f, F_TICKET + 2, F_TICKET + 12), 2); out.push(FX('tk' + t, (p) => ticket(p, t), inFront(cam, 1.2, 0, -0.05), 0.3, { order: 7 })); push(wordCard(f, F_TICKET - 12, 'CHEAPER BY MAIL', cam, '#f6c83a', 1e9, 160, 0.62, 1.2)); }
  if (id === 'train') for (let i = 0; i < 3; i++) { const t = q(((f - S.a) / 26 + i / 3) % 1, 2); out.push(FX('sm' + i + t, (p) => T.fxPuff(p, t), [OUT[0] + 6 + t * 1.5, 6 + t * 5, OUT[2] - 29 + t * 2], 2.5 + t * 2, { order: 4 })); }
  if (id === 'car') push(wordCard(f, F_SACKS, 'SPECIAL DELIVERY', cam, '#ffffff', 1e9, 160, 0.55, 1.6));
  if (id === 'weird') push(wordCard(f, F_WEIRD, 'WEIRDER?!', cam, '#ff7a4a', 1e9, 200, 0.55, 1.6));
  if (id === 'bank') { push(wordCard(f, F_BANK, 'A WHOLE BANK', cam, '#ffffff', F_40 - F_BANK - 3, 180, 0.5, 3)); push(wordCard(f, F_40, '40 TONS', cam, '#f6c83a', 1e9, 200, 0.5, 3)); }
  if (id === 'brick') { out.push(FX('bp', brickParcel, inFront(cam, 1.2, 0, -0.08), 0.34, { order: 7 })); push(wordCard(f, F_B50, '50 LB AT A TIME', cam, '#f6c83a', 1e9, 160, 0.62, 1.2)); }
  if (id === 'ban') { const t = f > F_BANNED ? q(Math.min(1, (f - F_BANNED) / 6), 2) : 0; out.push(FX('np' + t, (p) => noPeople(p, t), [3.0, 2.0, -4.0], 1.0, { order: 4 })); push(wordCard(f, F_BANNED, 'BANNED', cam, '#ff5a3a', 1e9, 200, 0.6, 2)); }
  if (id === 'door') { push(wordCard(f, F_LATE, 'TOO LATE', cam, '#ff7a4a', F_HAND - F_LATE - 3, 190, 0.55, 3)); push(wordCard(f, F_HAND, 'DELIVERED!', cam, '#9ad04a', 1e9, 200, 0.55, 3)); }
  return out;
}

// ---------------- cameras ----------------
const MP = MAYPOS;
const CAMS = {
  hook: [{ f: 0, pos: [0.7, 1.15, 3.9], look: [0.75, 1.05, 0.4], fov: 40 }, { f: F_MAILED, pos: [0.85, 1.0, 3.2], look: [0.85, 1.0, 0.4], fov: 36, ease: 'easeOut' }, { f: cut(1), pos: [0.85, 1.0, 3.0], look: [0.85, 1.0, 0.4], fov: 35 }],
  stamps: [{ f: cut(1), pos: [MP[0] + 0.15, 1.25, MP[2] + 2.9], look: [MP[0], 1.15, MP[2]], fov: 34 }, { f: cut(2), pos: [MP[0] + 0.05, 1.2, MP[2] + 2.5], look: [MP[0], 1.1, MP[2]], fov: 32 }],
  office: [{ f: cut(2), pos: [-3.6, 2.2, 6.5], look: [0.4, 1.6, -2], fov: 46 }, { f: F_PARCEL, pos: [-2.6, 1.9, 5.6], look: [1.4, 2.4, -3.5], fov: 42 }, { f: F_50, pos: [-0.6, 1.5, 4.6], look: [0.8, 1.6, -1], fov: 44 }, { f: cut(3), pos: [-0.5, 1.5, 4.4], look: [0.8, 1.6, -1], fov: 43 }],
  dial: [{ f: cut(3), pos: [0.9, 2.2, 1.9], look: [0.9, 2.1, 0.1], fov: 38 }, { f: F_SO3 - 4, pos: [0.9, 2.2, 1.6], look: [0.9, 2.1, 0.1], fov: 36 }],
  pkg: [{ f: F_SO3 - 4, pos: [0.3, 0.7, 3.4], look: [0.6, 1.3, 0.2], fov: 42 }, { f: cut(4), pos: [0.4, 0.75, 3.0], look: [0.65, 1.3, 0.2], fov: 40 }],
  ticket: [{ f: cut(4), pos: [2.65, 1.5, 3.4], look: [2.65, 0.86, 2.0], fov: 40 }, { f: F_SO4 - 4, pos: [2.65, 1.45, 3.2], look: [2.65, 0.86, 2.0], fov: 38 }],
  train: [{ f: F_SO4 - 4, pos: [OUT[0] - 1, 2.0, OUT[2] + 6], look: [OUT[0] + 4, 2.2, OUT[2] - 12], fov: 48 }, { f: cut(5), pos: [OUT[0] + 0.2, 1.9, OUT[2] + 0.5], look: [OUT[0] + 4, 1.9, OUT[2] - 8], fov: 44 }],
  car: [{ f: cut(5), pos: [CAR[0] + 0.1, 1.5, CAR[2] + 4.2], look: [CAR[0], 1.0, CAR[2] - 1], fov: 46 }, { f: F_SACKS, pos: [CAR[0] - 0.2, 1.1, CAR[2] + 2.6], look: [CAR[0] - 0.4, 0.95, CAR[2] - 0.5], fov: 42 }, { f: cut(6), pos: [CAR[0] - 0.25, 1.1, CAR[2] + 2.4], look: [CAR[0] - 0.4, 0.95, CAR[2] - 0.5], fov: 41 }],
  weird: [{ f: cut(6), pos: [CAR[0] + 0.1, 1.5, CAR[2] + 3.4], look: [CAR[0], 1.4, CAR[2] - 1], fov: 46 }, { f: F_WEIRD, pos: [CAR[0] + 0.2, 1.6, CAR[2] + 1.9], look: [CAR[0] + 0.2, 1.65, CAR[2] - 1], fov: 40, ease: 'easeOut' }, { f: cut(7), pos: [CAR[0] + 0.2, 1.6, CAR[2] + 1.8], look: [CAR[0] + 0.2, 1.65, CAR[2] - 1], fov: 39 }],
  bank: [{ f: cut(7), pos: [UT[0] + 9, 5, UT[2] + 16], look: [UT[0], 2, UT[2] - 2], fov: 46 }, { f: F_40, pos: [UT[0] + 3, 2.2, UT[2] + 9], look: [UT[0] - 0.3, 1.6, UT[2] - 1], fov: 46 }, { f: F_B50 - 4, pos: [UT[0] + 2.6, 2.0, UT[2] + 8.2], look: [UT[0] - 0.3, 1.6, UT[2] - 1], fov: 45 }],
  brick: [{ f: F_B50 - 4, pos: [UT[0] + 1.5, 1.5, UT[2] + 5.2], look: [UT[0] + 0.6, 0.8, UT[2] + 1.0], fov: 40 }, { f: cut(8), pos: [UT[0] + 1.4, 1.4, UT[2] + 4.8], look: [UT[0] + 0.6, 0.8, UT[2] + 1.0], fov: 38 }],
  ban: [{ f: cut(8), pos: [2.0, 1.8, 1.4], look: [2.6, 1.9, -3.6], fov: 44 }, { f: cut(9), pos: [2.2, 1.9, 0.6], look: [2.7, 1.95, -3.6], fov: 42 }],
  door: [{ f: cut(9), pos: [PORCH[0] - 0.3, 1.8, PORCH[2] + 9], look: [PORCH[0] - 0.3, 1.6, PORCH[2] + 1], fov: 46 }, { f: F_HAND, pos: [PORCH[0] - 0.2, 1.45, PORCH[2] + 5.6], look: [PORCH[0] - 0.2, 1.4, PORCH[2] + 1], fov: 42 }, { f: F_LOOP, pos: [PORCH[0] - 0.1, 1.4, PORCH[2] + 5.0], look: [PORCH[0] - 0.1, 1.4, PORCH[2] + 1], fov: 40 }],
  loop: [{ f: F_LOOP, pos: [0.75, 1.1, 3.5], look: [0.75, 1.05, 0.4], fov: 38 }, { f: TOTAL - 1, pos: [0.7, 1.15, 3.9], look: [0.75, 1.05, 0.4], fov: 40 }],
};
const KICKS = [{ f: F_MAILED, a: 0.02 }, { f: F_COAT, a: 0.03 }, { f: F_50, a: 0.02 }, { f: F_48 + 8, a: 0.02 }, { f: F_PKG, a: 0.03 }, { f: F_WEIRD, a: 0.03 }, { f: F_40, a: 0.04 }, { f: F_BANNED, a: 0.04 }, { f: F_HAND, a: 0.02 }];
const camAt = (f) => { const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS }); c.shadowAt = [c.look[0], 0, c.look[2]]; return c; };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => { const id = shotAt(f).id;
  if (['hook', 'loop', 'pkg'].includes(id)) return { focus: dist(Cm.pos, [MP[0], 1.1, MP[2]]), cinf: 10 };
  if (id === 'stamps') return { focus: dist(Cm.pos, [MP[0], 0.95, MP[2]]), cinf: 16 };
  if (id === 'dial') return { focus: dist(Cm.pos, [0.9, 2.25, 0.15]), cinf: 18 };
  if (id === 'ticket' || id === 'brick') return { focus: 1.2, cinf: 18 };
  if (id === 'car' || id === 'weird') return { focus: dist(Cm.pos, [CAR[0], 1.1, CAR[2] - 0.5]), cinf: 12 };
  if (id === 'door') return { focus: dist(Cm.pos, [PORCH[0], 1.2, PORCH[2] + 1.3]), cinf: 7 };
  if (id === 'ban') return { focus: dist(Cm.pos, [2.4, 2, -3.6]), cinf: 10 };
  return { focus: 10, cinf: 0 }; };

export default {
  TOTAL, build, look: 'rich',
  frame(f, k) {
    const S = shotAt(f), cam = camAt(f), id = S.id;
    // scale needle: 0 → 48.5 lb (dial spans 0..50 over 1.5π starting at 0.75π)
    const w = id === 'dial' || id === 'pkg' ? M.spring(Math.max(0, f - F_48 + 8) / 30, 1.4, 3) * 48.5 : ['hook', 'loop', 'stamps', 'office'].includes(id) ? 48.5 : 0;
    needle.rotation.z = -(Math.PI * (0.75 + w / 50 * 1.5)) - Math.PI / 2;
    grille.visible = id !== 'ban';
    const indoor = !['train', 'door', 'bank', 'brick'].includes(id);
    const light = ['bank', 'brick'].includes(id) ? { ...UTL } : indoor ? { ...IN } : { ...SNOW };
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
  },
};
