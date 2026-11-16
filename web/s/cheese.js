// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The Big Cheese" — Andrew Jackson's 1,400 lb cheese, East Room, 22 Feb 1837. Timed via cheese_timing.js.
import { TOTAL, LINES, wf } from './cheese_timing.js';
import * as PR from '../props.js';
import { INK } from '../toon.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], cut = (i) => Math.max(0, A(i) - 4);
const W = wf;
const F_JACK = W(0, 'andrew'), F_1400 = W(0, '1400'), F_10K = W(1, '10000'), F_MOB = W(1, 'mobbed'), F_TORE = W(1, 'tore'), F_FOUR = W(2, 'four'), F_TWO = W(2, 'two'),
  F_NY = W(3, 'new'), F_FARMER = W(3, 'dairy'), F_GIFT = W(3, 'gift'), F_WASH = W(4, 'washington'), F_1837 = W(4, '1837'), F_SERVED = W(4, 'served'), F_PUBLIC = W(4, 'public'),
  F_2H = W(5, 'two'), F_GONE = W(5, 'gone'), F_SMELL = W(6, 'smell'), F_STAYED = W(6, 'stayed'), F_REP = W(7, 'reporter'), F_SLIP = W(7, 'slippery'),
  F_NEXT = W(8, 'next'), F_AIR = W(8, 'air'), F_PAINT = W(8, 'repaint'), F_BAN = W(9, 'banned'), F_FOOD = W(9, 'food'), F_WHO = W(10, 'who'), F_PARTY = W(10, 'party');
const F_LOOP = TOTAL - 16;
const SHOTS = [['hook', 0], ['mob', cut(1)], ['size', cut(2)], ['farm', cut(3)], ['bday', cut(4)], ['doors', F_SERVED - 4], ['gone', cut(5)], ['smell', cut(6)],
  ['carpet', cut(7)], ['air', cut(8)], ['ban', cut(9)], ['who', cut(10)], ['loop', F_LOOP]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const FARM = [200, 0, 0], CH = [0, 0, -1];
const IN = { az: 200, el: 40, sky: '#e8dcc8', ground: '#5a3020', hemi: 0.55, sun: '#ffe8c8', sunI: 0.0, fog: '#3a2a20', fogNear: 14, fogFar: 46,
  skyTop: '#3a2a20', skyHor: '#3a2a20', sat: 1.08, vig: 0.3, shadowExt: 14, exposure: 1.18, bloom: 0.55, cardTint: '#fff4e4' };
const DAY = { az: 130, el: 32, sky: '#dcecfa', ground: '#6a8a3a', hemi: 1.0, sun: '#fff2d8', sunI: 2.6, fog: '#d4e4ee', fogNear: 60, fogFar: 500,
  skyTop: '#3a86d8', skyHor: '#dceef6', sat: 1.14, vig: 0.22, shadowExt: 22, exposure: 1.08 };
let K, cheese, wedge, lamps = [], sash, paintWall;
const rnd = (() => { let s = 1837; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
const txtTex = (w, h, bg, fg, lines, font = 'bold 64px Georgia, serif') => PR.canvasTex(w, h, (g) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
  lines.forEach((t, i) => g.fillText(t, w / 2, h * (i + 1) / (lines.length + 1))); });
const plane = (w, h, map, x, y, z, ry = 0, parent = K.scene) => { const m = K.add(new K.THREE.PlaneGeometry(w, h), K.toon({ map, kind: 'wood', amt: 0.2, plain: true }), x, y, z, parent, { cast: false }); m.rotation.y = ry; return m; };
const wheel = (parent, s = 1) => { const g = K.group(parent); const rind = K.mat('grime', '#ffd050', { detail: 0.3, amt: 0.2, emissive: '#3a2400' }), top = K.mat('grime', '#ffe080', { detail: 0.2, amt: 0.12, emissive: '#3a2a00' });
  K.add(new K.THREE.CylinderGeometry(0.62 * s, 0.62 * s, 0.6 * s, 48), rind, 0, 0.3 * s, 0, g); K.add(new K.THREE.CylinderGeometry(0.6 * s, 0.6 * s, 0.02, 48), top, 0, 0.61 * s, 0, g); return g; };

function build(k) {
  K = k; const { THREE } = K;
  // ---------- the East Room ----------
  const wall = K.mat('plaster', '#f0e6d0', { detail: 2 }), trim = K.mat('wood', '#f6f0e4', { detail: 1, amt: 0.1 }), gold = K.mat('metal', '#d8b050', { roughness: 0.35 }),
    carpet = K.mat('fabric', '#a8302a', { detail: 0.6, amt: 0.25 }), wood = K.mat('wood', '#7a4a2a'), dark = K.mat('wood', '#4a2a18');
  K.slab(-9, 9, -0.1, 0, -6, 12, K.mat('wood', '#8a5a34', { detail: 0.7 }), K.scene, false); K.slab(-6, 6, 0, 0.02, -5, 10, carpet, K.scene, false);
  paintWall = K.slab(-9, 9, 0, 6, -6.2, -6, wall); K.slab(-9.2, -9, 0, 6, -6, 12, wall); K.slab(9, 9.2, 0, 6, -6, 12, wall); K.slab(-9, 9, 6, 6.3, -6, 12, trim);
  K.slab(-9, 9, 0, 0.9, -6, -5.95, trim); K.slab(-9, 9, 5.5, 6, -6, -5.9, trim);
  for (let i = 0; i < 6; i++) { const x = -7.5 + i * 3; K.cyl(0.22, 0.26, 5.5, trim, x, 0, -5.6); K.slab(x - 0.35, x + 0.35, 5.3, 5.6, -5.95, -5.25, gold); }
  // tall windows on the side walls (one opens later), curtains
  for (const z of [-3, 2, 7]) { K.slab(8.95, 9.0, 1.2, 4.8, z - 0.9, z + 0.9, new THREE.MeshBasicMaterial({ color: '#cfe0f0' })); K.slab(8.8, 9.0, 1.1, 1.2, z - 1.0, z + 1.0, trim);
    for (const s of [-1, 1]) K.slab(8.7, 8.9, 0.2, 5.2, z + s * 1.15 - 0.3, z + s * 1.15 + 0.3, K.mat('fabric', '#c8a040', { detail: 0.4 })); }
  sash = K.group(); sash.position.set(8.9, 2.0, 2); K.slab(-0.04, 0.04, 0, 1.8, -0.9, 0.9, trim, sash); K.slab(-0.05, 0.05, 0.2, 1.6, -0.75, 0.75, new THREE.MeshBasicMaterial({ color: '#e8f0f8' }), sash);
  // portraits (generic, not real likenesses) + banner
  const portrait = (x, label, col) => { K.slab(x - 0.8, x + 0.8, 2.3, 4.3, -5.95, -5.85, gold); plane(1.4, 1.8, PR.canvasTex(256, 320, (g) => { g.fillStyle = col; g.fillRect(0, 0, 256, 320); g.fillStyle = '#2a1e18'; g.beginPath(); g.ellipse(128, 300, 100, 120, 0, 0, 7); g.fill();
    g.fillStyle = '#e8c8a8'; g.beginPath(); g.ellipse(128, 130, 50, 62, 0, 0, 7); g.fill(); g.fillStyle = '#f0f0f0'; g.beginPath(); g.ellipse(128, 82, 56, 30, 0, 0, 7); g.fill(); g.fillStyle = '#f2e2b0'; g.font = 'bold 22px Georgia'; g.textAlign = 'center'; g.fillText(label, 128, 312); }), x, 3.3, -5.84); };
  portrait(-4.5, 'G. W.', '#4a3a2a'); portrait(4.5, '1776', '#3a4a3a');
  plane(5, 0.8, txtTex(640, 100, '#1e2a5a', '#f2d890', ["WASHINGTON'S BIRTHDAY · 1837"], 'bold 42px Georgia, serif'), 0, 4.75, -5.84);
  for (let i = 0; i < 9; i++) { const st = K.add(new THREE.ConeGeometry(0.45, 0.6, 3), new THREE.MeshBasicMaterial({ color: ['#c8302a', '#f4f0e4', '#2a4a8a'][i % 3] }), -4 + i, 5.1, -5.8, K.scene, { cast: false }); st.rotation.z = Math.PI; }
  // table + the giant cheese
  K.slab(-1.2, 1.2, 0.82, 0.92, CH[2] - 0.9, CH[2] + 0.9, wood); for (const [x, z] of [[-1.1, -0.8], [1.1, -0.8], [-1.1, 0.8], [1.1, 0.8]]) K.slab(x - 0.06, x + 0.06, 0, 0.82, CH[2] + z - 0.06, CH[2] + z + 0.06, dark);
  K.slab(-1.25, 1.25, 0.6, 0.92, CH[2] + 0.88, CH[2] + 0.92, K.mat('fabric', '#f4ecd8', { plain: true }));
  cheese = wheel(); cheese.position.set(CH[0], 0.92, CH[2]);
  wedge = K.group(); K.add(new THREE.CylinderGeometry(0.4, 0.4, 0.3, 3, 1, false, 0, 0.7), K.mat('grime', '#f2c84a'), 0, 0.15, 0, wedge); wedge.visible = false;
  // side tables with punch, chairs, sideboard
  for (const x of [-5, 5]) { K.slab(x - 0.8, x + 0.8, 0.8, 0.88, -4.6, -3.8, wood); K.slab(x - 0.75, x + 0.75, 0, 0.8, -4.55, -4.5, dark); K.sphere(0.32, K.mat('metal', '#c8c8d0', { roughness: 0.3 }), x, 1.1, -4.2, K.scene, 1, 0.7, 1);
    for (let j = 0; j < 5; j++) K.cyl(0.05, 0.04, 0.14, K.mat('metal', '#d8d8e0'), x - 0.5 + j * 0.25, 0.88, -3.95); }
  // chandeliers as lamps
  for (const [x, z] of [[-4, -1.5], [4, -1.5], [0, 4]]) { const c = K.group(); c.position.set(x, 5.0, z); K.slab(-0.02, 0.02, 0, 1.3, -0.02, 0.02, gold, c);
    K.add(new THREE.TorusGeometry(0.55, 0.04, 6, 24).rotateX(Math.PI / 2), gold, 0, 0, 0, c); for (let j = 0; j < 8; j++) { const a = j / 8 * 6.283; K.add(new THREE.SphereGeometry(0.06, 8, 6), new THREE.MeshBasicMaterial({ color: '#fff0c0' }), Math.cos(a) * 0.55, 0.1, Math.sin(a) * 0.55, c, { cast: false }); }
    lamps.push(K.lamp(x, 4.8, z, { color: '#ffd090', intensity: 3.2, distance: 12, glowS: 0.9, flicker: 0.04 })); }
  K.dust([0, 2.5, 0], [12, 4, 10], 220);
  // ---------- dairy farm in upstate New York (FARM) ----------
  const fm = K.group(); fm.position.set(...FARM);
  K.slab(-150, 150, -0.1, 0, -150, 60, K.mat('grime', '#6aa040', { detail: 3, amt: 0.35 }), fm, false);
  for (let i = 0; i < 8; i++) K.sphere(70, K.mat('grime', i % 2 ? '#5a8a3a' : '#6a9a44', { detail: 8 }), -300 + i * 90, -40, -200 - (i % 3) * 30, fm, 1.4, 0.7, 1);
  const barn = K.group(fm); barn.position.set(-4, 0, -12); K.slab(-5, 5, 0, 5, -4, 4, K.mat('wood', '#a83a2a', { detail: 0.8 }), barn);
  const br = K.add(new THREE.CylinderGeometry(0.1, 5.8, 2.6, 4, 1), K.mat('wood', '#4a3a3a'), 0, 6.3, 0, barn); br.rotation.y = Math.PI / 4; br.scale.set(1.2, 1, 0.98);
  K.slab(-1.6, 1.6, 0, 3.4, 4.0, 4.1, K.mat('wood', '#e8e0d0'), barn); K.slab(-1.5, 1.5, 0.1, 3.3, 4.1, 4.15, K.mat('wood', '#7a2a20'), barn);
  plane(4, 0.8, txtTex(512, 100, '#f2e8d0', '#7a2a1a', ['MEACHAM DAIRY'], 'bold 52px Georgia, serif'), 0, 4.2, 4.12, 0, barn);
  for (let i = 0; i < 14; i++) { const x = -16 + i * 2.2; K.slab(x - 0.07, x + 0.07, 0, 1.1, -5.07, -4.93, K.mat('wood', '#8a7a60'), fm); } K.slab(-16, 14, 0.8, 0.88, -5.02, -4.98, K.mat('wood', '#8a7a60'), fm);
  const cart = K.group(fm); cart.position.set(1.4, 0, -1.5); K.slab(-1.2, 1.2, 0.7, 0.85, -1.5, 1.5, K.mat('wood', '#8a6a48'), cart);
  for (const [x, z] of [[-1.25, -1], [1.25, -1], [-1.25, 1], [1.25, 1]]) K.add(new THREE.TorusGeometry(0.55, 0.07, 6, 20).rotateY(Math.PI / 2), K.mat('wood', '#5a3a24'), x, 0.55, z, cart);
  const cw = wheel(cart); cw.position.set(0, 0.85, 0);
  const leaf = K.mat('grime', '#3a6a34', { amt: 0.5 }), bark = K.mat('wood', '#5a3a26');
  for (let i = 0; i < 16; i++) { const x = -40 + rnd() * 80, z = -25 - rnd() * 40, s = 1 + rnd(); K.cyl(0.25 * s, 0.35 * s, 3 * s, bark, x, 0, z, fm); K.sphere(1.8 * s, leaf, x, 4 * s, z, fm, 1, 1.1, 1); }
  K.addClouds(10, 700, 180);
}

// ---------------- 2D ----------------
const chunk = (p, i) => { p.poly([[300, 380], [420, 470], [300, 560]], '#f2c84a', 10); p.ell(330, 470, 12, 10, '#e0a830', 0); };
const cow = (p) => { p.ell(300, 620, 230, 150, '#f4f0e8', 12); p.ell(220, 580, 70, 50, INK, 0); p.ell(380, 660, 60, 44, INK, 0);
  for (const x of [130, 200, 400, 470]) p.stroke([[x, 720], [x, 930]], 22, INK); p.ell(520, 520, 90, 80, '#f4f0e8', 10); p.ell(560, 560, 46, 34, '#f0b0a0', 6); p.ell(500, 495, 12, 12, INK, 0); };
const clock = (p, t) => { p.ell(300, 500, 240, 240, '#f6f0e0', 14); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; p.stroke([[300 + Math.cos(a) * 190, 500 + Math.sin(a) * 190], [300 + Math.cos(a) * 220, 500 + Math.sin(a) * 220]], 8, INK); }
  const ah = -Math.PI / 2 + t * Math.PI, am = -Math.PI / 2 + t * 4 * Math.PI; p.stroke([[300, 500], [300 + Math.cos(ah) * 120, 500 + Math.sin(ah) * 120]], 16, INK); p.stroke([[300, 500], [300 + Math.cos(am) * 180, 500 + Math.sin(am) * 180]], 10, '#c8302a'); };
const noFood = (p) => { p.poly([[60, 260], [540, 260], [540, 760], [60, 760]], '#f6eedc', 12); p.g.fillStyle = INK; p.g.textAlign = 'center'; p.g.font = 'bold 56px Georgia, serif'; p.g.fillText('BY ORDER OF', 300, 350); p.g.fillText('THE PRESIDENT', 300, 420);
  p.g.fillStyle = '#c8302a'; p.g.font = 'bold 92px Georgia, serif'; p.g.fillText('NO FOOD', 300, 560); p.g.font = 'bold 40px Georgia, serif'; p.g.fillStyle = INK; p.g.fillText('(ESPECIALLY CHEESE)', 300, 650); };
const smear = (p) => { for (let i = 0; i < 6; i++) p.ell(120 + i * 75, 880 - (i % 2) * 40, 60, 16, '#f2c84a', 0); };
const quote = (p) => { p.poly([[40, 300], [560, 300], [560, 700], [40, 700]], '#f4ecd8', 10); p.g.fillStyle = INK; p.g.textAlign = 'center'; p.g.font = 'italic bold 52px Georgia, serif';
  p.g.fillText('"The carpet was', 300, 430); p.g.fillText('slippery with', 300, 510); p.g.fillText('cheese."', 300, 590); };

// ---------------- characters ----------------
const JACK = { jacket: '#1e1e26', pants: '#1e1e26', boots: INK, hat: 'hair', hair: '#f0f0f0', skin: '#f6dcc4', buttons: '#d8b050' };
const VANB = { jacket: '#3a2a4a', pants: '#2a2a34', boots: INK, hat: 'hair', hair: '#d88a4a', moustache: '#d88a4a', skin: '#f6dcc4', build: 'stout' };
const FARMER = { jacket: '#e8e0c8', pants: '#5a6a8a', boots: '#4a3426', hat: 'cap', cap: '#c8a860', skin: '#f0c49a', moustache: '#8a5a30' };
const PAINTER = { jacket: '#f2f0ea', pants: '#e8e4dc', boots: '#4a3426', hat: 'cap', cap: '#f2f0ea', skin: '#f0c49a' };
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

// crowd ring around the cheese (positions fixed, poses animate)
const CROWD = []; { let s = 7; const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < 16; i++) { const a = Math.PI * (0.05 + 0.9 * (i % 8) / 7) + (i >= 8 ? 0 : Math.PI), d = 1.6 + (i >= 8 ? 0.9 : 0.2) + r() * 0.5; CROWD.push({ v: i, x: CH[0] + Math.cos(a) * d * 1.3, z: CH[2] + Math.sin(a) * d * 0.9 - (i >= 8 ? 0 : 0.2), seed: 20 + i }); } }
const crowd = (f, T, out, eat = true, filter = () => true) => CROWD.filter(filter).forEach((c) => { const o = T.townsfolk(c.v);
  out.push(card(T, 'c' + c.v, o, fo(f, c.seed, { expr: eat ? (c.v % 3 === 0 ? 'lick' : c.v % 3 === 1 ? 'grin' : 'laugh') : 'smile', look: (CH[0] - c.x) * 0.2, prop: eat && c.v % 2 ? ['x', 0.3 + 0.3 * Math.abs(Math.sin(f * 0.2 + c.v))] : null }), [c.x, 0, c.z], { s: 0.95 })); });

function actorsAt(f, T) {
  const S = shotAt(f), id = S.id, out = [];
  switch (id) {
    case 'hook': case 'loop': case 'mob': case 'who':
      crowd(f, T, out, true, (c) => id === 'mob' || c.z < CH[2] || Math.abs(c.x - CH[0]) > 2.2);
      out.push(card(T, 'jk', JACK, fo(f, 3, { expr: id === 'who' ? 'laugh' : 'grin', look: 0.3, wave: Math.sin(f * 0.25) }), [CH[0] - 0.95, 0, CH[2] + 1.5])); break;
    case 'size': out.push(card(T, 'g1', T.townsfolk(2), fo(f, 30, { expr: f > F_TWO ? 'shock' : 'lick', look: 0.4 }), [CH[0] + 1.0, 0, CH[2] + 0.9])); break;
    case 'farm': out.push(card(T, 'fm', FARMER, fo(f, 8, { expr: f > F_GIFT - 4 ? 'grin' : 'smile', look: 0.3, wave: f > F_GIFT ? Math.sin(f * 0.4) : undefined }), [FARM[0] - 0.4, 0, FARM[2]]));
      out.push({ key: 'cow', draw: cow, x: FARM[0] - 3, y: 0, z: FARM[2] - 3.5, s: 1.0, blob: true }); break;
    case 'bday': out.push(card(T, 'jk', JACK, fo(f, 3, { expr: 'grin', look: 0.1 }), [CH[0] - 0.5, 0, -4.1])); break;
    case 'doors': crowd(f, T, out, false, (c) => c.v < 10); out.push(card(T, 'jk', JACK, fo(f, 3, { expr: 'laugh', look: 0.3, wave: Math.sin(f * 0.4) }), [CH[0] - 1.1, 0, CH[2] + 2.0])); break;
    case 'gone': crowd(f, T, out, false, (c) => c.v % 3 === 0); out.push(card(T, 'jk', JACK, fo(f, 3, { expr: f > F_GONE ? 'shock' : 'neutral', look: 0.2 }), [CH[0] - 1.1, 0, CH[2] + 1.6])); break;
    case 'smell': out.push(card(T, 'jk', JACK, fo(f, 3, { expr: f > F_STAYED - 4 ? 'pained' : 'nervous', look: 0.1 }), [CH[0] - 0.6, 0, CH[2] + 1.6])); break;
    case 'carpet': { const fall = M.smooth(ramp(f, F_SLIP - 6, F_SLIP + 6)); out.push(card(T, 'sl', T.townsfolk(0), fo(f, 33, { mode: fall > 0 ? 'stand' : 'march', phase: q((f / 18) % 1, 2), expr: fall > 0 ? 'shock' : 'whistle', look: 0.3, wave: fall > 0 ? Math.sin(f * 0.8) : undefined }), [lerp(-1.2, 0.0, ramp(f, cut(7), F_SLIP)), 0.3 * fall, 1.5], { roll: -0.9 * fall })); break; }
    case 'air': out.push(card(T, 'vb', VANB, fo(f, 12, { expr: 'pained', look: 0.5, prop: ['x', 0.2] }), [7.6, 0, 2.6])); out.push(card(T, 'pt', PAINTER, fo(f, 15, { expr: 'whistle', look: 0.3, prop: ['x', 0.4 + 0.3 * Math.sin(f * 0.4)] }), [4.6, 0, -4.9])); break;
    case 'ban': out.push(card(T, 'vb', VANB, fo(f, 12, { expr: 'stern', look: -0.3 }), [-0.2, 0, -3.6])); break;
  }
  return out;
}

function fxAt(f, T, cam) {
  const S = shotAt(f), id = S.id, out = [], push = (x) => x && out.push(x);
  const chunks = (n, base) => { for (let i = 0; i < n; i++) { const t = ((f / 22) + i / n) % 1, a = i * 2.4; out.push(FX('ck' + i + q(t, 2), (p) => chunk(p, i), [CH[0] + Math.cos(a) * t * 1.6, 1.6 + 2.2 * t - 3 * t * t, CH[2] + Math.sin(a) * t * 0.8 + 0.4], 0.42, { order: 4, roll: t * 5 + i })); } };
  if (id === 'hook' || id === 'mob' || id === 'loop') chunks(id === 'mob' ? 8 : 6);
  if (id === 'hook') { push(wordCard(f, F_JACK, 'ANDREW JACKSON', cam, '#ffffff', F_1400 - F_JACK - 3, 160, 0.6, 2.2)); push(wordCard(f, F_1400, '1,400 LB CHEESE', cam, '#f6c83a', 1e9, 170, 0.6, 2.2)); }
  if (id === 'mob') push(wordCard(f, F_10K, '10,000 PEOPLE', cam, '#f6c83a', 1e9, 180, 0.6, 2.2));
  if (id === 'size') { push(wordCard(f, F_FOUR, '4 FT WIDE', cam, '#f6c83a', F_TWO - F_FOUR - 3, 190, 0.6, 2)); push(wordCard(f, F_TWO, '2 FT THICK', cam, '#ffffff', 1e9, 190, 0.6, 2)); }
  if (id === 'farm') { push(wordCard(f, F_NY, 'NEW YORK', cam, '#ffffff', F_GIFT - F_NY - 3, 180, 0.6, 2.5)); push(wordCard(f, F_GIFT, 'A GIFT!', cam, '#f6c83a', 1e9, 200, 0.6, 2.5)); }
  if (id === 'bday') push(wordCard(f, F_1837, 'FEB 22, 1837', cam, '#f6c83a', 1e9, 180, 0.6, 2));
  if (id === 'doors') push(wordCard(f, F_PUBLIC, 'FREE CHEESE!', cam, '#f6c83a', 1e9, 190, 0.6, 2.5));
  if (id === 'gone') { const t = ramp(f, cut(5), F_GONE); out.push(FX('cl' + q(t, 2), (p) => clock(p, t), inFront(cam, 1.5, 0.45, 0.25), 0.18, { order: 7 })); push(wordCard(f, F_2H, '2 HOURS', cam, '#ffffff', F_GONE - F_2H - 3, 190, 0.6, 2)); push(wordCard(f, F_GONE, 'GONE!', cam, '#f6c83a', 1e9, 210, 0.6, 2)); }
  if (id === 'smell' || id === 'air' || id === 'ban') { for (let i = 0; i < 4; i++) { const t = q(((f / 40) + i / 4) % 1, 2); out.push(FX('st' + i + t, (p) => PR.stink(p, t), [CH[0] - 1.8 + i * 1.2, 0.6, CH[2] + 0.6 + (i % 2) * 1.0], 1.6, { order: 4 })); }
    if (id === 'smell') push(wordCard(f, F_STAYED, 'THE SMELL STAYED', cam, '#9ad04a', 1e9, 160, 0.62, 2)); }
  if (id === 'carpet') { out.push(FX('sm', smear, [0, 0.1, 1.2], 1.0, { order: 3, yaw: 0 })); if (f > F_REP + 6 && f < F_SLIP - 6) out.push(FX('qt', quote, inFront(cam, 1.4, 0, 0.1), 0.3, { order: 7 })); push(wordCard(f, F_SLIP, 'SLIPPERY!', cam, '#f6c83a', 1e9, 200, 0.75, 1.4)); }
  if (id === 'air') { push(wordCard(f, F_NEXT, 'NEXT PRESIDENT', cam, '#ffffff', F_AIR - F_NEXT - 3, 170, 0.62, 2)); push(wordCard(f, F_AIR, 'AIR IT OUT', cam, '#9ad04a', F_PAINT - F_AIR - 3, 190, 0.62, 2)); push(wordCard(f, F_PAINT, 'REPAINT!', cam, '#f6c83a', 1e9, 200, 0.62, 2)); }
  if (id === 'ban') { out.push(FX('nf', noFood, [1.2, 2.6, -5.8], 1.0, { order: 3 })); push(wordCard(f, F_BAN, 'BANNED', cam, '#ff5a3a', 1e9, 200, 0.62, 2)); }
  if (id === 'who') push(wordCard(f, F_PARTY - 6, 'CHEESE PARTY?!', cam, '#f6c83a', 1e9, 180, 0.6, 2.2));
  return out;
}

// ---------------- cameras ----------------
const C = CH;
const CAMS = {
  hook: [{ f: 0, pos: [C[0] + 0.3, 3.0, C[2] + 5.4], look: [C[0] - 0.3, 1.1, C[2] + 0.3], fov: 46 }, { f: F_1400, pos: [C[0] + 0.1, 2.5, C[2] + 4.2], look: [C[0] - 0.2, 1.1, C[2] + 0.2], fov: 42, ease: 'easeOut' }, { f: cut(1), pos: [C[0], 2.4, C[2] + 4.0], look: [C[0] - 0.2, 1.1, C[2] + 0.2], fov: 41 }],
  mob: [{ f: cut(1), pos: [C[0] + 4, 3.6, C[2] + 6.5], look: [C[0], 1.0, C[2]], fov: 48 }, { f: F_TORE, pos: [C[0] + 1.5, 1.4, C[2] + 3.6], look: [C[0], 1.3, C[2]], fov: 46 }, { f: cut(2), pos: [C[0] + 1.3, 1.4, C[2] + 3.3], look: [C[0], 1.3, C[2]], fov: 45 }],
  size: [{ f: cut(2), pos: [C[0] + 1.0, 1.3, C[2] + 3.6], look: [C[0] + 0.75, 1.3, C[2]], fov: 46 }, { f: F_TWO, pos: [C[0] + 1.0, 1.4, C[2] + 3.4], look: [C[0] + 0.75, 1.3, C[2]], fov: 44 }],
  farm: [{ f: cut(3), pos: [FARM[0] + 2, 1.8, FARM[2] + 6.5], look: [FARM[0] + 0.2, 1.4, FARM[2] - 1.5], fov: 46 }, { f: F_GIFT, pos: [FARM[0] + 1.2, 1.6, FARM[2] + 4.6], look: [FARM[0] + 0.4, 1.3, FARM[2] - 1.2], fov: 42 }],
  bday: [{ f: cut(4), pos: [C[0] - 0.2, 2.6, -1.4], look: [C[0], 3.6, -6], fov: 46 }, { f: F_1837, pos: [C[0] - 0.45, 1.6, -1.6], look: [C[0] - 0.45, 1.75, -6], fov: 46 }],
  doors: [{ f: F_SERVED - 4, pos: [C[0] - 3, 3.2, C[2] + 8], look: [C[0], 1.0, C[2]], fov: 50 }, { f: cut(5), pos: [C[0] - 2, 2.2, C[2] + 6], look: [C[0], 1.2, C[2]], fov: 48 }],
  gone: [{ f: cut(5), pos: [C[0] + 0.3, 1.9, C[2] + 3.8], look: [C[0], 1.0, C[2]], fov: 44 }, { f: F_GONE, pos: [C[0] + 0.2, 1.6, C[2] + 2.8], look: [C[0], 1.0, C[2]], fov: 42, ease: 'easeOut' }],
  smell: [{ f: cut(6), pos: [C[0] - 0.4, 1.5, C[2] + 4.6], look: [C[0] - 0.5, 1.6, C[2]], fov: 46 }, { f: cut(7), pos: [C[0] - 0.5, 1.5, C[2] + 3.8], look: [C[0] - 0.5, 1.6, C[2]], fov: 44 }],
  carpet: [{ f: cut(7), pos: [0.2, 0.8, 5.8], look: [-0.3, 1.0, 1.5], fov: 48 }, { f: F_SLIP, pos: [0.3, 0.7, 5.2], look: [0.3, 0.9, 1.5], fov: 46 }],
  air: [{ f: cut(8), pos: [5.5, 1.9, 6.5], look: [7.8, 1.8, 2.2], fov: 46 }, { f: F_PAINT - 4, pos: [5.6, 1.8, 6.0], look: [7.8, 1.8, 2.2], fov: 44 }, { f: F_PAINT + 2, pos: [3.2, 1.7, -1.0], look: [4.6, 1.6, -5.2], fov: 44 }, { f: cut(9), pos: [3.3, 1.7, -1.4], look: [4.6, 1.6, -5.2], fov: 43 }],
  ban: [{ f: cut(9), pos: [0.0, 1.8, 0.4], look: [0.2, 2.0, -5.8], fov: 46 }, { f: cut(10), pos: [0.1, 1.85, -0.4], look: [0.3, 2.0, -5.8], fov: 44 }],
  who: [{ f: cut(10), pos: [C[0] - 0.7, 1.5, C[2] + 5.4], look: [C[0] - 0.6, 1.3, C[2] + 1.0], fov: 42 }, { f: F_LOOP, pos: [C[0] - 0.7, 1.5, C[2] + 5.0], look: [C[0] - 0.6, 1.3, C[2] + 1.0], fov: 40 }],
  loop: [{ f: F_LOOP, pos: [C[0] + 0.25, 2.8, C[2] + 5.0], look: [C[0] - 0.3, 1.1, C[2] + 0.3], fov: 45 }, { f: TOTAL - 1, pos: [C[0] + 0.3, 3.0, C[2] + 5.4], look: [C[0] - 0.3, 1.1, C[2] + 0.3], fov: 46 }],
};
const KICKS = [{ f: F_1400, a: 0.03 }, { f: F_10K, a: 0.02 }, { f: F_TORE, a: 0.03 }, { f: F_GIFT, a: 0.02 }, { f: F_GONE, a: 0.04 }, { f: F_STAYED, a: 0.03 }, { f: F_SLIP, a: 0.05 }, { f: F_BAN, a: 0.04 }];
const camAt = (f) => { const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS }); c.shadowAt = [c.look[0], 0, c.look[2]]; return c; };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => { const id = shotAt(f).id;
  if (['hook', 'loop', 'gone'].includes(id)) return { focus: dist(Cm.pos, [C[0] - 0.5, 1.3, C[2] + 1.2]), cinf: 7 };
  if (['size', 'smell', 'who'].includes(id)) return { focus: dist(Cm.pos, [C[0], 1.3, C[2] + 1]), cinf: 10 };
  if (id === 'farm') return { focus: dist(Cm.pos, [FARM[0], 1.3, FARM[2]]), cinf: 8 };
  if (id === 'carpet') return { focus: dist(Cm.pos, [0, 0.6, 1.4]), cinf: 10 };
  return { focus: 10, cinf: 0 }; };

export default {
  TOTAL, build, look: 'rich',
  frame(f, k) {
    const S = shotAt(f), cam = camAt(f), id = S.id;
    // the cheese shrinks once the doors open
    const eaten = id === 'doors' ? 0.15 * ramp(f, F_SERVED, cut(5)) : id === 'gone' ? lerp(0.2, 1, ramp(f, cut(5), F_GONE)) : ['smell', 'carpet', 'air', 'ban'].includes(id) ? 1 : 0;
    cheese.visible = eaten < 0.98; cheese.scale.set(1 - eaten * 0.7, Math.max(0.05, 1 - eaten), 1 - eaten * 0.7);
    sash.position.y = id === 'air' ? 2.0 + 1.4 * M.smooth(ramp(f, F_AIR - 4, F_AIR + 10)) : 2.0;
    paintWall.material.color.set(id === 'air' && f > F_PAINT + 2 ? '#f6f2e8' : '#f0e6d0');
    const out = id === 'farm';
    lamps.forEach((l) => { l.light.visible = !out; if (l.glow) l.glow.visible = !out; });
    const light = out ? { ...DAY } : { ...IN };
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
  },
};
