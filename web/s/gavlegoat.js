// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The Gävle Goat" — Gävle, Sweden, 1966–today. Timed via gavlegoat_timing.js.
import { TOTAL, LINES, wf } from './gavlegoat_timing.js';
import * as PR from '../props.js';
import { INK } from '../toon.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const F_XMAS = wf(0, 'christmas'), F_13 = wf(0, '13'), F_GOAT = wf(0, 'goat'), F_TORCH = wf(1, 'torch'), F_FLAM = wf(1, 'flaming'), F_1966 = wf(2, '1966'), F_BURN1 = wf(2, 'burned'),
  F_NYE = wf(2, 'new'), F_SER = wf(3, 'serious'), F_GUARD = wf(3, 'guards'), F_FENCE = wf(3, 'fences'), F_CAM = wf(3, 'webcams'), F_KEPT = wf(4, 'kept'), F_BURN2 = wf(4, 'burning'),
  F_2001 = wf(5, '2001'), F_AMER = wf(5, 'american'), F_TORCHED = wf(5, 'torched'), F_LEGAL = wf(6, 'legal'), F_18 = wf(6, '18'), F_JAIL = wf(6, 'jail'),
  F_2005 = wf(7, '2005'), F_SANTA = wf(7, 'santa'), F_GING = wf(7, 'gingerbread'), F_SHOT = wf(7, 'shot'), F_ARROW = wf(7, 'arrow'), F_43 = wf(8, '43'), F_WRECK = wf(8, 'wrecked'),
  F_THIS = wf(9, 'christmas'), F_BUILD = wf(9, 'build'), F_ANOTHER = wf(9, 'another');
const SHOTS = [['hook', 0], ['torch', cut(1)], ['first', cut(2)], ['serious', cut(3)], ['kept', cut(4)], ['tourist', cut(5)], ['jail', cut(6)], ['costume', cut(7)], ['arrow', F_SHOT - 6],
  ['count', cut(8)], ['end', cut(9)]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const NIGHT = { az: 210, el: 35, sky: '#8a9ac8', ground: '#4a4a6a', hemi: 1.05, sun: '#c8d4ff', sunI: 1.2, fog: '#2a3a6a', fogNear: 60, fogFar: 420,
  skyTop: '#0e1a44', skyHor: '#3a4a8a', sat: 1.12, vig: 0.3, shadowExt: 28 };
const FIREN = { ...NIGHT, az: 30, el: 20, sun: '#ffa860', sunI: 1.9, sky: '#ffb080', hemi: 1.15, skyHor: '#7a4a6a', fog: '#4a3058', sat: 1.2 };
const OLD = { ...FIREN, sat: 0.35, gain: '#fff0d8', lift: '#201810' };
const DUSK = { ...NIGHT, az: 200, el: 12, sun: '#ffd0a0', sunI: 1.8, sky: '#c8c8f0', hemi: 1.2, skyTop: '#3a4aa0', skyHor: '#e8a8a0', fog: '#a88aa8', fogNear: 80, fogFar: 600 };
const JAILP = [300, 0, 0];
let K, goatMats = [], fence, camPole, guardHut;
const rnd = (() => { let s = 1966; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();

function build(k) {
  K = k; const { THREE } = K, M4 = THREE.Matrix4;
  K.add(new THREE.PlaneGeometry(800, 800).rotateX(-Math.PI / 2), K.toon({ map: PR.speckTex('#e8eef8', ['#d8e2f2', '#f4f8ff', '#c8d4ea'], 66, 2000, 90) }), 0, 0, 0, K.scene, { cast: false });
  // the goat (straw): legs, body, neck, head, horns, tail; red ribbons
  const straw = PR.canvasTex(256, 256, (c) => { c.fillStyle = '#e8c068'; c.fillRect(0, 0, 256, 256); for (let i = 0; i < 300; i++) { c.strokeStyle = ['#c89a40', '#f4d888', '#b8862e'][i % 3]; c.lineWidth = 2; const x = (i * 37) % 256, y = (i * 91) % 256; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 18, y + 4); c.stroke(); } }, [2, 2]);
  const sm = K.toon({ map: straw }); goatMats.push([sm, '#ffffff']); const rib = K.toon({ color: '#d02a2a' }); goatMats.push([rib, '#d02a2a']);
  const goat = K.group(); goat.position.set(0, 0, -4); goat.rotation.y = 0.5;
  for (const [x, z] of [[-2.6, -0.9], [-2.6, 0.9], [2.6, -0.9], [2.6, 0.9]]) K.cyl(0.45, 0.6, 5.3, sm, x, 0, z, goat);
  const body = K.add(new THREE.CylinderGeometry(1.7, 1.7, 7.4, 20), sm, 0, 6.6, 0, goat); body.rotation.z = Math.PI / 2;
  for (const x of [-3.7, 3.7]) K.add(new THREE.SphereGeometry(1.7, 20, 14), sm, x, 6.6, 0, goat).scale.set(0.45, 1, 1);
  for (const x of [-2.4, 0, 2.4]) { const r = K.add(new THREE.TorusGeometry(1.74, 0.12, 8, 24), rib, x, 6.6, 0, goat); r.rotation.y = Math.PI / 2; }
  const nk = K.add(new THREE.CylinderGeometry(0.9, 1.2, 4.2, 16), sm, 4.3, 8.8, 0, goat); nk.rotation.z = -0.55;
  const hd = K.add(new THREE.CylinderGeometry(0.75, 1.0, 2.6, 16), sm, 5.8, 10.6, 0, goat); hd.rotation.z = -1.35;
  K.add(new THREE.TorusGeometry(0.95, 0.14, 8, 20), rib, 4.6, 9.3, 0, goat).rotation.set(Math.PI / 2, 0.6, 0);
  for (const s of [-1, 1]) { const h = K.add(new THREE.TorusGeometry(1.3, 0.28, 10, 20, Math.PI * 1.2), sm, 4.7, 12.0, s * 0.55, goat); h.rotation.set(0, 0, 0.6);
    const e = K.add(new THREE.ConeGeometry(0.35, 1.1, 8), sm, 5.4, 11.2, s * 0.95, goat); e.rotation.x = s * 1.2; }
  const tl = K.add(new THREE.ConeGeometry(0.35, 1.6, 10), sm, -4.2, 7.6, 0, goat); tl.rotation.z = 0.9;
  K.add(new THREE.ConeGeometry(0.3, 0.9, 8), sm, 6.9, 9.6, 0, goat).rotation.z = 2.9; // beard
  // square: coloured Swedish facades around
  const cols = [['#e8c060', 3], ['#c8503a', 4], ['#f0e8d8', 3], ['#5a8ab0', 4], ['#e89a5a', 3], ['#a8c070', 3]];
  for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + (i - 5.5) * 0.24, d = 46, x = Math.cos(a) * d, z = Math.sin(a) * d - 4; const [c, n] = cols[i % cols.length], h = 9 + (i % 3) * 3;
    const bm = K.toon({ map: PR.facadeTex(c, n, Math.round(h / 3), i + 3, '#f8f0e0'), emissive: '#3a2a10', emissiveIntensity: 0.5 });
    const b = K.slab(-5, 5, 0, h, -4, 4, bm); b.position.set(x, h / 2, z); b.rotation.y = -a - Math.PI / 2;
    const r = K.add(new THREE.CylinderGeometry(0.1, 6.8, 3.2, 4, 1), K.col('#3a3a4a'), x, h + 1.6, z); r.rotation.y = -a - Math.PI / 2 + Math.PI / 4; r.scale.set(1, 1, 0.75); }
  // behind the camera side too
  for (let i = 0; i < 8; i++) { const x = -40 + i * 11, z = 40; const h = 9 + (i % 3) * 3; const b = K.slab(-5, 5, 0, h, -4, 4, K.toon({ map: PR.facadeTex(cols[i % 6][0], 3, 3, i + 20, '#f8f0e0'), emissive: '#3a2a10', emissiveIntensity: 0.5 })); b.position.set(x, h / 2, z); }
  // string lights between poles + snow piles
  const bulbs = []; for (let i = 0; i < 70; i++) { const t = i / 70, x = -26 + t * 52, y = 7 - 2 * Math.sin(t * Math.PI * 4) ** 2, z = -24; bulbs.push(new M4().makeTranslation(x, y, z)); }
  K.add(PR.mergeCopies(new THREE.SphereGeometry(0.16, 8, 6), bulbs), K.toon({ color: '#ffe080', emissive: '#ffc040' })).frustumCulled = false;
  const piles = []; for (let i = 0; i < 40; i++) { const a = rnd() * 6.283, d = 14 + rnd() * 25; piles.push(new M4().makeTranslation(Math.cos(a) * d, 0, Math.sin(a) * d - 4).multiply(new M4().makeScale(1 + rnd(), 0.5, 1 + rnd()))); }
  K.add(PR.mergeCopies(new THREE.SphereGeometry(1, 12, 8), piles), K.col('#f4f8ff')).frustumCulled = false;
  // security: fence ring, webcam pole, guard hut (shown from "serious" on)
  fence = K.group(); for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2, x = Math.cos(a) * 9, z = Math.sin(a) * 7 - 4; K.slab(x - 0.06, x + 0.06, 0, 2, z - 0.06, z + 0.06, K.col('#5a5a6a'), fence);
    const b = Math.atan2(Math.cos(a + 0.157) * 7 - Math.cos(a) * 7, -(Math.sin(a + 0.157) * 9 - Math.sin(a) * 9)); }
  const ring = (y) => { const pts = []; for (let i = 0; i <= 80; i++) { const a = i / 80 * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * 9, y, Math.sin(a) * 7 - 4)); } const c = new THREE.CatmullRomCurve3(pts, true);
    K.add(new THREE.TubeGeometry(c, 120, 0.05, 6, true), K.col('#6a6a7a'), 0, 0, 0, fence); };
  ring(0.6); ring(1.3); ring(1.95);
  camPole = K.group(); camPole.position.set(8.5, 0, 6); K.cyl(0.12, 0.15, 6, K.col('#4a4a5a'), 0, 0, 0, camPole); K.slab(-0.3, 0.3, 5.8, 6.2, -0.7, 0.1, K.col('#e8e8ee'), camPole); K.add(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 12), K.col('#2a2a3a'), 0, 6.0, -0.75, camPole).rotation.x = Math.PI / 2;
  K.add(new THREE.SphereGeometry(0.06, 8, 6), K.toon({ color: '#ff2a2a', emissive: '#ff0000' }), 0.2, 6.25, -0.5, camPole);
  guardHut = K.group(); guardHut.position.set(-7.5, 0, 6.5); guardHut.rotation.y = 0.6; K.slab(-1, 1, 0, 2.4, -1, 1, K.col('#c84a3a'), guardHut); K.slab(-1.2, 1.2, 2.4, 2.6, -1.2, 1.2, K.col('#f4f8ff'), guardHut); K.slab(-0.6, 0.6, 1.2, 1.9, 1.0, 1.04, K.toon({ color: '#ffe8a0', emissive: '#a08030' }), guardHut);
  // jail cell set
  const jl = K.group(); jl.position.set(...JAILP); K.slab(-4, 4, -0.1, 0, -4, 4, K.col('#7a7a84'), jl); K.slab(-4, 4, 0, 4, -2, -1.8, K.toon({ map: PR.canvasTex(256, 256, (c) => { c.fillStyle = '#9a9aa4'; c.fillRect(0, 0, 256, 256); for (let y = 0; y < 256; y += 32) for (let x = (y / 32 % 2) * 32; x < 256; x += 64) { c.strokeStyle = 'rgba(0,0,0,.2)'; c.lineWidth = 3; c.strokeRect(x, y, 64, 32); } }, [3, 2]) }), jl);
  K.slab(-1.6, -0.4, 0.5, 0.65, -1.8, -1.2, K.col('#6a5040'), jl); K.slab(0.6, 1.4, 2.4, 3.2, -1.82, -1.78, K.toon({ color: '#3a4a8a', emissive: '#1a2a5a' }), jl);
  for (let i = 0; i < 4; i++) K.slab(0.6 + i * 0.27, 0.66 + i * 0.27, 2.4, 3.2, -1.78, -1.74, K.col('#2a2a30'), jl);
  for (let i = 0; i < 12; i++) K.slab(-3 + i * 0.5, -2.92 + i * 0.5, 0, 3.6, 1.5, 1.58, K.col('#3a3a44'), jl);
  K.slab(-3.1, 3.1, 3.5, 3.6, 1.45, 1.62, K.col('#3a3a44'), jl);
}

// ---------------- 2D ----------------
const flame = (p, t, seed = 1) => {
  const layer = (w, h, col, ph) => { const pts = []; for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI; const wob = 1 + 0.18 * Math.sin(i * 1.7 + t * 6.283 * 2 + seed + ph); const tip = Math.pow(Math.sin(a), 0.6);
      pts.push([300 + Math.cos(a) * w * wob, 960 - tip * h * (1 + 0.12 * Math.sin(t * 6.283 + seed * 2 + ph))]); }
    for (let i = 0; i <= 8; i++) { const a = Math.PI + i / 8 * Math.PI; pts.push([300 + Math.cos(a) * w, 960 - Math.sin(a) * w * 0.25]); } p.poly(pts, col, ph ? 0 : 12); };
  layer(230, 720, '#e2452a', 0); layer(170, 540, '#f6912e', 1); layer(100, 330, '#ffe27a', 2);
};
const gingerbread = (p, look = 0) => { const c = '#b8743a', cx = 300;
  p.ell(cx, 300, 120, 110, c, 12); for (const s of [-1, 1]) { p.stroke([[cx + s * 80, 470], [cx + s * 230, 400]], 70, INK); p.stroke([[cx + s * 80, 470], [cx + s * 230, 400]], 54, c); p.stroke([[cx + s * 60, 680], [cx + s * 130, 960]], 80, INK); p.stroke([[cx + s * 60, 680], [cx + s * 130, 960]], 64, c); }
  p.ell(cx, 560, 140, 170, c, 12); for (const y of [500, 580, 660]) p.ell(cx, y, 16, 16, '#f2f2f2', 4);
  p.stroke([[cx - 120, 760], [cx - 60, 740], [cx, 760], [cx + 60, 740], [cx + 120, 760]], 10, '#ffffff');
  for (const s of [-1, 1]) { p.ell(cx + s * 40 + look * 10, 280, 18, 22, '#ffffff', 5); p.dot(cx + s * 40 + look * 16, 282, 8); } p.stroke([[cx - 50, 350], [cx, 375], [cx + 50, 350]], 9, INK); };
const bowArrow = (p, fire = 0) => { p.stroke([[120, 500], [520, 500]], 14, INK); p.stroke([[120, 500], [520, 500]], 8, '#8a5a30'); p.poly([[520, 480], [570, 500], [520, 520]], '#c8c8d0', 6);
  p.poly([[120, 500], [80, 470], [100, 500], [80, 530]], '#e83a3a', 5); if (fire) { p.g.save(); p.g.translate(560, 500); p.g.rotate(-Math.PI / 2); p.g.scale(0.18, 0.18); p.g.translate(-300, -960); flame(p, fire, 2); p.g.restore(); } };
const jailBars = (p) => { for (let i = 0; i < 8; i++) { const x = 40 + i * 75; p.stroke([[x, 0], [x, 1000]], 30, INK); p.stroke([[x, 0], [x, 1000]], 18, '#5a5a66'); } };

// ---------------- characters ----------------
const GUARD = { jacket: '#2a3a5a', pants: '#2a2a3a', boots: INK, hat: 'cap', cap: '#2a3a5a', buttons: '#e8c45a', belt: '#1a1a1a', skin: '#f5c9a0' };
const TOUR = { jacket: '#d84a3a', pants: '#4a5a8a', boots: '#3a2a20', hat: 'cap', cap: '#3a6ad0', skin: '#ffd8b8', build: 'stout' };
const SANTA = { jacket: '#d02a2a', pants: '#d02a2a', boots: INK, hat: 'cap', cap: '#d02a2a', belt: '#1a1a1a', buttons: '#ffffff', moustache: '#ffffff', skin: '#ffd8c0', build: 'stout' };
const LIGHT2D = -2.1;
const fo = (f, seed, o) => ({ mode: 'stand', light: LIGHT2D, seed, blink: blinkAt(f, seed), ...o });
const card = (T, key, o, opts, pos, extra = {}) => ({ key: key + JSON.stringify(opts), draw: (p) => T.bodyFront(p, o, opts), x: pos[0], y: pos[1], z: pos[2], ...extra });
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1] - 1.07 * s, z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
const inFront = (c, d, ux, uy) => {
  const V = K.THREE.Vector3, p = new V(...c.pos), dir = new V(...c.look).sub(p).normalize(), right = new V().crossVectors(dir, new V(0, 1, 0)).normalize(), up = new V().crossVectors(right, dir);
  const h = d * Math.tan(c.fov * Math.PI / 360); return p.addScaledVector(dir, d).addScaledVector(right, ux * h).addScaledVector(up, uy * h).toArray();
};
const wordCard = (f, f0, txt, c, col = '#f6c83a', dur = 1e9, size = 170, uy = 0.42, d = 3) => { if (f < f0 - 1 || f > f0 + dur) return null; const t = q(Math.min(1, (f - f0 + 1) / 12));
  const r = Math.min(1, 400 / (0.7 * size * txt.length)), fs = size * r, s = Math.min(2.5, 1.25 / r);
  return FX('w' + txt + t + fs, (p) => PR.word(p, txt, t, col, fs), inFront(c, d, 0, uy), s * d / 7, { order: 9 }); };
const flameCard = (f, i, pos, s) => { const t = q(((f * 0.06 + i * 0.37) % 1), 1); return FX('fl' + t + (i % 3), (p) => flame(p, t, i % 3), pos, s, { order: 4 }); };
// flames on the goat: legs, body, neck, head (k = how much is burning)
const GOATFIRE = [[0, 0, -2, 6], [-2.4, 0, -3.2, 5], [2.4, 0, -4.8, 5], [-1, 5, -3, 6], [2, 6, -5, 5.5], [3.6, 8, -6, 4.5], [5, 9.5, -7, 4], [-3, 5, -2, 5]];
const goatFire = (f, out, k = 1) => GOATFIRE.slice(0, Math.max(0, Math.round(GOATFIRE.length * k))).forEach(([x, y, z, s], i) => out.push(flameCard(f, i, [x, y + 1.07 * s * 0.1, z], s * (0.92 + 0.08 * Math.sin(f * 0.25 + i)))));

function actorsAt(f, T) {
  const S = shotAt(f), out = [];
  switch (S.id) {
    case 'serious': if (f > F_GUARD - 4) out.push(card(T, 'g', GUARD, fo(f, 3, { expr: 'stern', look: 0.2, tilt: q(idle(f, 3).tilt, 1) }), [-4.6, 0, 6.2])); break;
    case 'kept': out.push(card(T, 'g', GUARD, fo(f, 3, { expr: 'shock', look: -0.3, tilt: q(idle(f, 3).tilt, 1) }), [-4.6, 0, 6.2])); break;
    case 'tourist': out.push(card(T, 't', TOUR, fo(f, 8, { expr: f > F_TORCHED ? 'grin' : 'smile', look: -0.4, tilt: q(idle(f, 8).tilt, 1), headTilt: q(idle(f, 8).headTilt, 1), wave: f > F_TORCHED - 6 ? 1 : undefined }), [1.6, 0, 9])); break;
    case 'jail': out.push(card(T, 't', TOUR, fo(f, 8, { expr: f > F_18 ? 'pained' : 'nervous', look: 0.2, tilt: q(idle(f, 8).tilt, 1) }), [JAILP[0] - 0.4, 0, JAILP[2] - 0.4])); break;
    case 'costume': out.push(card(T, 's', SANTA, fo(f, 12, { expr: 'grin', look: 0.3, tilt: q(idle(f, 12).tilt, 1), headTilt: q(idle(f, 12).headTilt, 1) }), [-0.9, 0, 12]));
      if (f > F_GING - 6) out.push({ key: 'gb' + q(Math.sin(f * 0.2), 1), draw: (p) => gingerbread(p, Math.sin(f * 0.2)), x: 0.7, y: 0, z: 12.2, s: 0.85, order: 3 }); break;
  }
  return out;
}

function fxAt(f, T, cam) {
  const S = shotAt(f), out = [], push = (x) => x && out.push(x), id = S.id;
  if (['hook', 'torch', 'first', 'count'].includes(id)) goatFire(f, out, 1);
  if (id === 'kept') goatFire(f, out, ramp(f, F_KEPT - 6, F_BURN2 + 8));
  if (id === 'arrow') goatFire(f, out, ramp(f, F_ARROW + 4, F_ARROW + 24));
  if (id === 'tourist' && f > F_TORCHED) goatFire(f, out, ramp(f, F_TORCHED, F_TORCHED + 20) * 0.5);
  if (id === 'hook') { push(wordCard(f, F_13, '13 METERS', cam, '#f6c83a', F_GOAT - F_13 - 2)); push(wordCard(f, F_GOAT, 'STRAW GOAT', cam, '#ffffff')); }
  if (id === 'torch') push(wordCard(f, F_TORCH - 6, 'TORCH!', cam, '#ff8a4a', 1e9, 200, 0.45));
  if (id === 'first') { push(wordCard(f, F_1966, '1966', cam, '#f6c83a', F_NYE - F_1966 - 3, 200, 0.45)); push(wordCard(f, F_NYE, "NEW YEAR'S EVE", cam, '#ffffff', 1e9, 160, 0.45)); }
  if (id === 'serious') { push(wordCard(f, F_GUARD, 'GUARDS', cam, '#ffffff', F_FENCE - F_GUARD - 2, 180, 0.5)); push(wordCard(f, F_FENCE, 'FENCES', cam, '#ffffff', F_CAM - F_FENCE - 2, 180, 0.5)); push(wordCard(f, F_CAM, 'WEBCAMS', cam, '#f6c83a', 1e9, 180, 0.5)); }
  if (id === 'kept') push(wordCard(f, F_BURN2, 'STILL BURNING', cam, '#ff8a4a', 1e9, 170, 0.5));
  if (id === 'tourist') { push(wordCard(f, F_2001, '2001', cam, '#f6c83a', F_AMER - F_2001 - 3, 190, 0.5)); push(wordCard(f, F_AMER, 'AMERICAN TOURIST', cam, '#ffffff', 1e9, 160, 0.5));
    if (f > F_TORCHED - 8) out.push(flameCard(f, 9, [1.6 + 0.62, 1.55, 9.1], 0.12)); }
  if (id === 'jail') { 
    push(wordCard(f, F_LEGAL, 'LEGAL?', cam, '#ffffff', F_18 - F_LEGAL - 3, 190, 0.55, 1.2)); push(wordCard(f, F_18, '18 DAYS', cam, '#f6c83a', 1e9, 200, 0.55, 1.2)); }
  if (id === 'costume') { push(wordCard(f, F_2005, '2005', cam, '#f6c83a', F_SANTA - F_2005 - 3, 190, 0.5)); push(wordCard(f, F_SANTA, 'SANTA?!', cam, '#ff5a5a', F_GING - F_SANTA - 2, 190, 0.5)); push(wordCard(f, F_GING, '+ GINGERBREAD MAN', cam, '#f6c83a', 1e9, 150, 0.5)); }
  if (id === 'arrow') { const t = ramp(f, F_SHOT, F_ARROW + 4); if (t < 1) { const p0 = [0, 1.6, 12], p1 = [0.5, 6.5, -4]; const pos = p0.map((v, i) => lerp(v, p1[i], t)); pos[1] += Math.sin(t * Math.PI) * 3;
      out.push(FX('ar' + q((f * 0.06) % 1, 1), (p) => bowArrow(p, (f * 0.06) % 1 + 0.01), pos, 0.9, { order: 7, yaw: Math.PI / 2, roll: 0.3 })); }
    push(wordCard(f, F_ARROW, 'FLAMING ARROW', cam, '#ff8a4a', 1e9, 170, 0.5, 6)); }
  if (id === 'count') { const n = Math.round(lerp(1, 43, M.easeOut(ramp(f, F_43 - 10, F_43 + 14)))); push(wordCard(f, F_43 - 10, String(n), cam, '#ff8a4a', 1e9, 260, 0.45, 6)); if (f > F_WRECK) push(wordCard(f, F_WRECK, 'GOATS LOST', cam, '#ffffff', 1e9, 170, 0.22, 6)); }
  if (id === 'end') { if (f < TOTAL - 12) push(wordCard(f, F_ANOTHER, 'ANOTHER GOAT', cam, '#f6c83a', 1e9, 180, 0.45, 6)); if (f >= TOTAL - 12) goatFire(f, out, ramp(f, TOTAL - 12, TOTAL - 4)); }
  return out;
}

// ---------------- cameras ----------------
const CAMS = {
  hook: [{ f: 0, pos: [3, 1.8, 20], look: [1, 6.5, -4], fov: 56 }, { f: F_GOAT, pos: [2.6, 1.8, 18], look: [1, 6.5, -4], fov: 54 }, { f: cut(1), pos: [2.4, 1.8, 17], look: [1, 6.5, -4], fov: 53 }],
  torch: [{ f: cut(1), pos: [-18, 14, 32], look: [0, 5, -4], fov: 50 }, { f: cut(2), pos: [-12, 10, 28], look: [0, 6, -4], fov: 50 }],
  first: [{ f: cut(2), pos: [10, 2.0, 18], look: [1, 7, -4], fov: 52 }, { f: cut(3), pos: [8, 2.4, 16], look: [1, 7.5, -4], fov: 52 }],
  serious: [{ f: cut(3), pos: [-4.4, 1.7, 11.6], look: [-4.5, 1.6, 6.2], fov: 44 }, { f: F_FENCE - 4, pos: [0, 2.2, 15], look: [0, 1.4, 3], fov: 48, ease: 'easeOut' }, { f: F_CAM - 4, pos: [6.5, 4.4, 11], look: [8.5, 6.0, 6], fov: 44, ease: 'easeOut' }, { f: cut(4), pos: [6.8, 4.6, 10.4], look: [8.5, 6.0, 6], fov: 42 }],
  kept: [{ f: cut(4), pos: [-4.0, 2.2, 16], look: [-1, 6, -4], fov: 54 }, { f: cut(5), pos: [-3.6, 2.0, 15], look: [-1, 6.5, -4], fov: 54 }],
  tourist: [{ f: cut(5), pos: [1.5, 1.7, 14.4], look: [1.5, 1.6, 9], fov: 44 }, { f: F_TORCHED, pos: [1.6, 1.8, 14.8], look: [1.3, 2.8, 6], fov: 48 }, { f: cut(6), pos: [1.6, 1.8, 15], look: [1.2, 3.2, 5], fov: 50 }],
  jail: [{ f: cut(6), pos: [JAILP[0] - 0.3, 1.6, 6.2], look: [JAILP[0] - 0.4, 1.4, -0.4], fov: 44 }, { f: F_18, pos: [JAILP[0] - 0.35, 1.6, 5.4], look: [JAILP[0] - 0.4, 1.45, -0.4], fov: 42 }, { f: cut(7), pos: [JAILP[0] - 0.35, 1.6, 5.2], look: [JAILP[0] - 0.4, 1.45, -0.4], fov: 41 }],
  costume: [{ f: cut(7), pos: [-0.1, 1.6, 18.4], look: [-0.1, 1.3, 12], fov: 44 }, { f: F_GING, pos: [0.0, 1.5, 17.4], look: [0.0, 1.3, 12], fov: 42 }, { f: F_SHOT - 6, pos: [0.0, 1.5, 17.0], look: [0.0, 1.3, 12], fov: 41 }],
  arrow: [{ f: F_SHOT - 6, pos: [4, 2, 17], look: [0.3, 3.5, 6], fov: 52 }, { f: F_ARROW + 4, pos: [5, 2.2, 15], look: [0.5, 6.5, -4], fov: 54 }, { f: cut(8), pos: [4.6, 2.2, 14.4], look: [0.5, 6.8, -4], fov: 54 }],
  count: [{ f: cut(8), pos: [14, 3, 22], look: [1, 7, -4], fov: 52 }, { f: cut(9), pos: [11, 3, 20], look: [1, 7, -4], fov: 52 }],
  end: [{ f: cut(9), pos: [-10, 2.4, 18], look: [0.5, 7, -4], fov: 52 }, { f: TOTAL - 13, pos: [2.8, 1.8, 20.5], look: [1, 6.5, -4], fov: 56 }, { f: TOTAL - 1, pos: [3, 1.8, 20], look: [1, 6.5, -4], fov: 56 }],
};
const KICKS = [{ f: F_TORCH, a: 0.03 }, { f: F_BURN1, a: 0.03 }, { f: F_BURN2, a: 0.04 }, { f: F_TORCHED, a: 0.03 }, { f: F_18, a: 0.03 }, { f: F_ARROW + 4, a: 0.05 }, { f: TOTAL - 12, a: 0.04 }];
const camAt = (f) => { const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS }); c.shadowAt = S.id === 'jail' ? JAILP : [0, 0, 2]; return c; };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => { const id = shotAt(f).id;
  if (id === 'costume') return { focus: dist(Cm.pos, [0, 1.4, 12]), cinf: 10 }; if (id === 'jail') return { focus: dist(Cm.pos, [JAILP[0] - 0.4, 1.4, -0.4]), cinf: 6 };
  if (id === 'tourist') return { focus: dist(Cm.pos, [1.6, 1.5, 9]), cinf: 8 };
  return { focus: 10, cinf: 0 }; };

export default {
  TOTAL, build,
  frame(f, k) {
    const S = shotAt(f), cam = camAt(f), id = S.id;
    const sec = !['hook', 'torch', 'first'].includes(id);
    fence.visible = camPole.visible = guardHut.visible = sec;
    const char = { hook: 0.75, torch: 0.85, first: 0.8, count: 0.85, kept: ramp(f, F_KEPT, F_BURN2 + 20) * 0.6, arrow: ramp(f, F_ARROW + 4, F_ARROW + 30) * 0.6, tourist: f > F_TORCHED ? 0.3 : 0 }[id] ?? 0;
    const endBurn = id === 'end' && f >= TOTAL - 12 ? 0.7 : 0;
    goatMats.forEach(([m, c0]) => m.color.set(new K.THREE.Color(c0).lerp(new K.THREE.Color('#3a2a2a'), Math.max(char, endBurn))));
    const burning = char > 0.2 || endBurn > 0;
    const light = id === 'first' ? { ...OLD } : id === 'end' && !endBurn ? { ...DUSK } : burning ? { ...FIREN } : { ...NIGHT };
    if (id === 'torch') light.shadowExt = 50;
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
  },
};
