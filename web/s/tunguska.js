// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The Tunguska Event" — Siberia, 30 Jun 1908. Timed via tunguska_timing.js.
import { TOTAL, LINES, wf } from './tunguska_timing.js';
import * as PR from '../props.js';
import { INK } from '../toon.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const F_1908 = wf(0, '1908'), F_FLAT = wf(0, 'flattened'), F_80 = wf(0, '80'), F_SIB = wf(0, 'siberia'), F_FORTY = wf(1, 'forty'), F_TRADER = wf(1, 'trader'), F_SHIRT = wf(1, 'shirt'), F_FIRE = wf(1, 'fire'),
  F_BLAST = wf(2, 'blast'), F_THREW = wf(2, 'threw'), F_PORCH = wf(2, 'porch'), F_EXPL = wf(3, 'explosion'), F_HUND = wf(3, 'hundreds'), F_HIRO = wf(3, 'hiroshima'), F_NOBODY = wf(4, 'nobody'), F_19 = wf(4, 'nineteen'),
  F_FIRST = wf(5, 'first'), F_FIND = wf(5, 'find'), F_RING = wf(6, 'ring'), F_TRUNK = wf(6, 'trunk'), F_AWAY = wf(6, 'away'), F_CENTER = wf(7, 'center'), F_STOOD = wf(7, 'stood'), F_NO = wf(7, 'no'),
  F_CRATER = wf(7, 'crater'), F_ROCK = wf(8, 'space'), F_BOOM = wf(8, 'exploded'), F_MILES = wf(8, 'miles'), F_TREES = wf(8, 'trees');
const SHOTS = [['hook', 0], ['porch', cut(1)], ['thrown', cut(2)], ['power', cut(3)], ['silent', cut(4)], ['walk', cut(5)], ['ring', cut(6)], ['center', cut(7)], ['crater', F_NO - 6], ['sky', cut(8)], ['end', F_TREES + 14]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const DAWN = { az: 70, el: 16, sky: '#ffe2c8', ground: '#5a6a48', hemi: 1.2, sun: '#ffd8a8', sunI: 2.4, fog: '#f0d0b8', fogNear: 200, fogFar: 1400,
  skyTop: '#4a78c8', skyHor: '#ffd2b0', sat: 1.12, vig: 0.24, shadowExt: 40 };
const BLAST = { ...DAWN, sky: '#ffc890', sun: '#ffb070', sunI: 2.8, skyTop: '#c86a3a', skyHor: '#ffd890', fog: '#f8c890', sat: 1.2, vig: 0.3 };
const QUIET = { ...DAWN, az: 140, el: 40, sun: '#fff4e0', sky: '#d8e8f0', skyTop: '#5a8ac8', skyHor: '#dfe8ee', fog: '#d8e4e8', sat: 1.0, vig: 0.24 };
const TP = [0, 0, 430], BH = 70, NB = 10, R0 = 22, R1 = 270;
let K, bands = [], centerCrowns, fireball, trail;
const rnd = (() => { let s = 1908; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
const gnd = (x, z) => 3 * Math.sin(x * 0.012) * Math.cos(z * 0.01) + 1.5 * Math.sin(x * 0.031 + z * 0.02) - (Math.hypot(x - TP[0], z - TP[2]) < 30 ? 0 : 0);
const waveR = (t) => (t < 0 ? 0 : R0 + 140 * t);   // blast front radius, t seconds after the explosion

function build(k) {
  K = k; const { THREE } = K, M4 = THREE.Matrix4;
  K.addClouds(10, 900, 200);
  PR.terrain(K, 1400, 220, gnd, K.toon({ map: PR.speckTex('#6a8a4a', ['#5e7e40', '#7a9658', '#6a7a3a', '#8a9a5a'], 9, 2600, 120) }));
  for (let i = 0; i < 9; i++) K.sphere(160, K.col(i % 2 ? '#5a7a6a' : '#668672'), -800 + i * 200, -90, -900 - (i % 3) * 80, K.scene, 1.6, 0.8, 1);
  // swamp ponds
  for (let i = 0; i < 14; i++) { const a = rnd() * 6.28, d = 60 + rnd() * 300, x = Math.cos(a) * d, z = Math.sin(a) * d; if (Math.hypot(x - TP[0], z - TP[2]) < 60) continue;
    K.add(new THREE.CircleGeometry(6 + rnd() * 10, 18).rotateX(-Math.PI / 2), K.col('#6a98a8'), x, gnd(x, z) + 0.3, z, K.scene, { cast: false }).scale.set(1.6, 1, 1); }
  // tree parts in the tree's local frame (trunk along +y)
  const partsCrown = [new M4().makeTranslation(0, 4.2, 0).multiply(new M4().makeScale(1, 1.3, 1)), new M4().makeTranslation(0, 6.4, 0).multiply(new M4().makeScale(0.7, 1.1, 0.7))];
  const partTrunk = new M4().makeTranslation(0, 3.5, 0);
  const coneG = new THREE.ConeGeometry(1.8, 3.4, 6, 1, true), trunkG = new THREE.CylinderGeometry(0.22, 0.32, 7, 5, 1, true);
  const crownM = K.col('#2f5a3a'), trunkM = K.col('#7a5a40'), deadM = K.col('#6a4630');
  for (let b = 0; b < NB; b++) bands.push({ r: R0 + (R1 - R0) * b / NB, sc: [], st: [], fc: [], ft: [] });
  const outC = [], outT = [], cenT = [], cenC = [];
  const place = (x, z, s) => {
    const y = gnd(x, z), r = Math.hypot(x, z);
    if (Math.hypot(x - TP[0], z - TP[2]) < 26 || Math.hypot(x + 36, z - 96) < 13) return;
    const base = new M4().makeTranslation(x, y, z).multiply(new M4().makeScale(s, s, s));
    if (r > R1 || Math.hypot(x - TP[0], z - TP[2]) < 120) { partsCrown.forEach((p) => outC.push(base.clone().multiply(p))); outT.push(base.clone().multiply(partTrunk)); return; }
    if (r < R0) return;
    const B = bands[Math.min(NB - 1, Math.floor((r - R0) / (R1 - R0) * NB))];
    partsCrown.forEach((p) => B.sc.push(base.clone().multiply(p))); B.st.push(base.clone().multiply(partTrunk));
    const th = Math.atan2(z, x), fall = new M4().makeTranslation(x, y + 0.5 * s, z).multiply(new M4().makeRotationY(-th)).multiply(new M4().makeRotationZ(-Math.PI / 2 + 0.03)).multiply(new M4().makeScale(s * 1.7, s, s * 1.7));
    B.ft.push(fall.clone().multiply(partTrunk));
  };
  for (let i = 0; i < 3400; i++) { const a = rnd() * Math.PI * 2, r = R0 + Math.sqrt(rnd()) * (R1 - R0); place(Math.cos(a) * r, Math.sin(a) * r, 1.3 + rnd() * 0.8); }
  for (let i = 0; i < 1500; i++) { const a = rnd() * Math.PI * 2, r = R1 + rnd() * 330; place(Math.cos(a) * r, Math.sin(a) * r, 1.3 + rnd() * 0.8); }
  for (let i = 0; i < 160; i++) { const a = rnd() * 6.28, r = 70 + rnd() * 70; place(TP[0] + Math.cos(a) * r, TP[2] + Math.sin(a) * r, 1.2 + rnd() * 0.7); }
  for (let i = 0; i < 28; i++) { const a = i * 2.4, r = 3 + (i * 0.7) % 17, x = Math.cos(a) * r, z = Math.sin(a) * r, s = 1.4 + (i % 3) * 0.25; if (Math.hypot(x - 2, z - 8) < 3) continue;
    const base = new M4().makeTranslation(x, gnd(x, z), z).multiply(new M4().makeScale(s, s, s)); cenT.push(base.clone().multiply(partTrunk)); partsCrown.forEach((p) => cenC.push(base.clone().multiply(p))); }
  const mk = (geo, list, mat) => { if (!list.length) return null; const m = K.add(PR.mergeCopies(geo, list), mat, 0, 0, 0); m.frustumCulled = false; return m; };
  mk(coneG, outC, crownM); mk(trunkG, outT, trunkM);
  for (const B of bands) { B.m = [mk(coneG, B.sc, crownM), mk(trunkG, B.st, trunkM), mk(coneG, B.fc, K.col('#5a6a3a')), mk(trunkG, B.ft, deadM)]; }
  mk(trunkG, cenT, deadM); centerCrowns = mk(coneG, cenC, crownM);
  // the trading post: log cabin with a porch
  const cab = K.group(); cab.position.set(TP[0], gnd(TP[0], TP[2]), TP[2]);
  const logs = PR.canvasTex(256, 256, (c) => { c.fillStyle = '#8a5a34'; c.fillRect(0, 0, 256, 256); for (let y = 0; y < 256; y += 28) { c.fillStyle = 'rgba(0,0,0,.28)'; c.fillRect(0, y, 256, 5); c.fillStyle = 'rgba(255,255,255,.08)'; c.fillRect(0, y + 8, 256, 6); } }, [2, 1]);
  K.slab(-4, 4, 0, 3.2, -3, 3, K.toon({ map: logs }), cab);
  const rf = K.add(new THREE.CylinderGeometry(0.1, 5.4, 2.4, 4, 1), K.col('#5a4a3e'), 0, 4.4, 0, cab); rf.rotation.y = Math.PI / 4; rf.scale.set(1.1, 1, 0.9);
  K.slab(-4, 4, 0, 0.5, -6, -3, K.col('#9a7450'), cab); // porch deck toward the north (-z)
  K.slab(-4.1, 4.1, 2.7, 2.85, -6.2, -3, K.col('#6a5040'), cab); for (const x of [-3.8, 3.8]) K.slab(x - 0.1, x + 0.1, 0.5, 2.7, -6.1, -5.9, K.col('#7a5a40'), cab);
  K.slab(-0.6, 0.6, 0.5, 2.5, -3.06, -3, K.col('#4a2e1e'), cab); for (const x of [-2.4, 2.4]) K.slab(x - 0.6, x + 0.6, 1.4, 2.4, -3.06, -3, K.col('#f6e0a0'), cab);
  K.slab(-1.2, 1.2, 0, 0.25, -6.8, -6, K.col('#8a6a4a'), cab);
  for (let i = 0; i < 4; i++) K.cyl(0.35, 0.35, 0.8, K.col('#7a5434'), 5 + i * 0.8, 0, -2 + (i % 2), cab);
  // fireball + trail
  fireball = K.group(); fireball.scale.setScalar(2.2); fireball.userData.s = 1; K.add(new THREE.SphereGeometry(3, 20, 14), new THREE.MeshBasicMaterial({ color: '#fff4c0' }), 0, 0, 0, fireball).userData.ndSkip = true;
  K.add(new THREE.SphereGeometry(4.6, 20, 14), new THREE.MeshBasicMaterial({ color: '#ffb040', transparent: true, opacity: 0.55 }), 0, 0, 0, fireball).userData.ndSkip = true;
  trail = K.add(new THREE.CylinderGeometry(4.2, 0.4, 120, 16, 1, true).translate(0, 60, 0), new THREE.MeshBasicMaterial({ color: '#ffd080', transparent: true, opacity: 0.6, side: THREE.DoubleSide }), 0, 0, 0, fireball);
  trail.userData.ndSkip = true; trail.castShadow = false; fireball.children.forEach((c) => (c.castShadow = false));
}

// ---------------- blast state ----------------
const FB_FROM = [-200, 330, -150], FB_AT = [0, BH, 0];
const blastAt = (f) => { // {tExp: seconds since explosion (or -1 = before), fb: 0..1 approach}
  const id = shotAt(f).id;
  if (id === 'hook') return { t: 0.35 + f / 30 * 0.6, fb: 1 };
  if (id === 'end') return { t: 0.35 * ramp(f, shotAt(f).a, TOTAL - 1), fb: 1 };
  if (id === 'porch') return { t: (f - F_TRADER + 8) / 30, fb: 1 };
  if (id === 'thrown') return { t: 2 + (f - F_BLAST) / 30, fb: 1 };
  if (id === 'power') return { t: (f - (F_EXPL - 6)) / 30 * 0.8, fb: 1 };
  if (id === 'sky') return { t: (f - F_BOOM) / 30 * 0.9, fb: clamp((f - cut(8)) / (F_BOOM - cut(8))) };
  return { t: 99, fb: 1, done: true };
};
function poseWorld(f) {
  const B = blastAt(f), id = shotAt(f).id;
  let R = B.done ? 1e9 : waveR(B.t);
  if (id === 'thrown') R = 1e9; if (id === 'porch') R = waveR(B.t);
  for (const b of bands) { const flat = b.r + (R1 - R0) / NB < R; b.m[0] && (b.m[0].visible = !flat); b.m[1] && (b.m[1].visible = !flat); b.m[2] && (b.m[2].visible = flat); b.m[3] && (b.m[3].visible = flat); }
  centerCrowns.visible = R < R0;
  const fbOn = !B.done && B.t < 0.05 && ['sky', 'power'].includes(id);
  fireball.visible = fbOn || (id === 'sky' && B.t < 0);
  const u = M.easeIn(B.fb); fireball.position.set(lerp(FB_FROM[0], FB_AT[0], u), lerp(FB_FROM[1], FB_AT[1], u), lerp(FB_FROM[2], FB_AT[2], u));
  const d = [FB_FROM[0] - FB_AT[0], FB_FROM[1] - FB_AT[1], FB_FROM[2] - FB_AT[2]], l = Math.hypot(...d);
  fireball.quaternion.setFromUnitVectors(new K.THREE.Vector3(0, 1, 0), new K.THREE.Vector3(d[0] / l, d[1] / l, d[2] / l));
  return { R, B };
}

// ---------------- characters ----------------
const TRADER = { jacket: '#6a4a3a', pants: '#3a3a4a', boots: '#2a2020', hat: 'cap', cap: '#3a3030', moustache: '#4a3020', build: 'stout', skin: '#f5c9a0' };
const KULIK = { jacket: '#8a8a5a', pants: '#5a5a40', boots: '#3a2a20', hat: 'cap', cap: '#6a6a48', moustache: '#5a3a28', skin: '#ffe2c2' };
const HELP = { jacket: '#5a6a7a', pants: '#4a4a40', boots: '#3a2a20', hat: 'hair', hair: '#2a201a', skin: '#ecd0b6' };
const LIGHT2D = -2.1;
const fo = (f, seed, o) => ({ mode: 'stand', light: LIGHT2D, seed, blink: blinkAt(f, seed), ...o });
const card = (T, key, o, opts, pos, extra = {}) => ({ key: key + JSON.stringify(opts), draw: (p) => (opts.side ? T.bodySide(p, o, opts) : T.bodyFront(p, o, opts)), x: pos[0], y: pos[1], z: pos[2], ...extra });
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1] - 1.07 * s, z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
const inFront = (c, d, ux, uy) => {
  const V = K.THREE.Vector3, p = new V(...c.pos), dir = new V(...c.look).sub(p).normalize(), right = new V().crossVectors(dir, new V(0, 1, 0)).normalize(), up = new V().crossVectors(right, dir);
  const h = d * Math.tan(c.fov * Math.PI / 360); return p.addScaledVector(dir, d).addScaledVector(right, ux * h).addScaledVector(up, uy * h).toArray();
};
const wordCard = (f, f0, txt, c, col = '#f6c83a', dur = 1e9, size = 170, uy = 0.42) => { if (f < f0 - 1 || f > f0 + dur) return null; const t = q(Math.min(1, (f - f0 + 1) / 12));
  const r = Math.min(1, 400 / (0.7 * size * txt.length)), fs = size * r, s = Math.min(2.5, 1.25 / r);
  return FX('w' + txt + t, (p) => PR.word(p, txt, t, col, fs), inFront(c, 7, 0, uy), s, { order: 9 }); };
const TPY = () => gnd(TP[0], TP[2]);
const porchPos = () => [TP[0] + 0.6, TPY() + 0.5, TP[2] - 5.2];

function actorsAt(f, T) {
  const S = shotAt(f), out = [];
  switch (S.id) {
    case 'porch': out.push(card(T, 'tr', TRADER, fo(f, 4, { mode: 'sit', expr: f > F_SHIRT ? 'pained' : f > F_FORTY + 10 ? 'shock' : 'neutral', look: 0, tilt: f > F_SHIRT ? q(3 * Math.sin(f * 0.8), 0) : 0 }), porchPos())); break;
    case 'thrown': { const k = M.easeOut(ramp(f, F_THREW - 6, F_THREW + 26)), p = porchPos();
      out.push(card(T, 'tr2', TRADER, fo(f, 4, { mode: k > 0.05 ? 'fall' : 'sit', expr: 'shock' }), [p[0] + 4.5 * k, p[1] + 2.6 * Math.sin(k * Math.PI) - 0.5 * k, p[2] - 0.8 * k], { roll: -0.9 * k })); break; }
    case 'walk': for (let i = 0; i < 2; i++) { const x = -40 + (f - S.a) * 0.035 + i * 1.6, z = 92 + i * 0.6;
      out.push(card(T, 'k' + i, i ? HELP : KULIK, fo(f, 30 + i, { side: true, mode: 'march', phase: q(((f * 0.03 + i * 0.4) % 1), 1), expr: f > F_FIND - 6 ? 'shock' : 'stern' }), [x, gnd(x, z) + 0.4, z])); } break;
    case 'center': case 'crater': out.push(card(T, 'kc', KULIK, fo(f, 30, { mode: S.id === 'crater' && f > F_CRATER ? 'fall' : 'stand', expr: f > F_STOOD ? 'shock' : 'dazed', look: q(0.4 * Math.sin(f * 0.05), 1) }), [2, gnd(2, 8), 8])); break;
  }
  return out;
}

function fxAt(f, T, cam, W) {
  const S = shotAt(f), out = [], push = (x) => x && out.push(x), t = W.B.t;
  const boom = (s) => { if (W.B.done || t < 0 || t > 3.2) return; const k = q(Math.min(0.54, t / 3.2 * 0.6 + 0.08), 2); out.push(FX('kb' + k, (p) => PR.kaboom(p, k, 3), [0, BH + 6, 0], s, { order: 3 })); };
  if (S.id === 'hook' || S.id === 'end') { boom(55); }
  if (S.id === 'hook') { push(wordCard(f, F_1908, '1908', cam, '#f6c83a', F_80 - F_1908 - 4)); push(wordCard(f, F_80, '80 MILLION TREES', cam, '#ffffff')); }
  if (S.id === 'porch') { if (f < F_SHIRT - 6) boom(55); push(wordCard(f, F_FORTY, '40 MILES AWAY', cam, '#ffffff', F_SHIRT - F_FORTY - 4, 160, 0.5)); push(wordCard(f, F_FIRE, 'HOT!', cam, '#ff8a3a', 1e9, 200, 0.5)); }
  if (S.id === 'thrown') { if (f > F_BLAST - 2 && f < F_BLAST + 14) { const k = q((f - F_BLAST + 2) / 16); const p = porchPos(); out.push(FX('dust' + k, (p2) => T.fxDust(p2, k, '#e8d0a8'), [p[0] - 1, p[1] + 0.3, p[2] + 1.5], 1.4)); }
    push(wordCard(f, F_BLAST, 'BOOM!', cam, '#ff8a3a', 1e9, 210, 0.5)); }
  if (S.id === 'power') { boom(60); push(wordCard(f, F_HUND, '100s x HIROSHIMA', cam, '#ffffff', 1e9, 160, 0.5)); }
  if (S.id === 'silent') push(wordCard(f, F_19, '19 YEARS', cam, '#f6c83a', 1e9, 190, 0.45));
  if (S.id === 'walk') push(wordCard(f, F_FIND, '?', cam, '#ffffff', 1e9, 260, 0.45));
  if (S.id === 'ring') { push(wordCard(f, F_RING, 'A RING', cam, '#f6c83a', F_TRUNK - F_RING - 2, 190, 0.5)); push(wordCard(f, F_AWAY, 'ALL POINTING OUT', cam, '#ffffff', 1e9, 160, 0.5)); }
  if (S.id === 'center') push(wordCard(f, F_STOOD, 'STILL STANDING', cam, '#ffffff', 1e9, 160, 0.55));
  if (S.id === 'crater') push(wordCard(f, F_NO, 'NO CRATER!', cam, '#ff8a3a', 1e9, 190, 0.5));
  if (S.id === 'sky') { boom(55); push(wordCard(f, F_ROCK, 'SPACE ROCK', cam, '#ffffff', F_MILES - F_ROCK - 2, 170, 0.45)); push(wordCard(f, F_MILES, 'MILES UP', cam, '#f6c83a', 1e9, 190, 0.45)); }
  return out;
}

// ---------------- cameras ----------------
const P0 = () => porchPos();
const camKeys = () => { const p = P0(); return {
  hook: [{ f: 0, pos: [90, 55, 200], look: [0, 40, 0], fov: 50 }, { f: F_80, pos: [80, 48, 180], look: [0, 30, 0], fov: 50 }, { f: cut(1), pos: [70, 44, 165], look: [0, 28, 0], fov: 48 }],
  porch: [{ f: cut(1), pos: [p[0] - 1, p[1] + 1.6, p[2] - 8], look: [p[0], p[1] + 1.4, p[2]], fov: 46 }, { f: F_TRADER, pos: [p[0] - 1, p[1] + 2.2, p[2] - 9], look: [p[0] - 1, p[1] + 6, p[2] - 100], fov: 48, ease: 'smooth' }, { f: F_SHIRT - 6, pos: [p[0] - 0.6, p[1] + 1.4, p[2] - 4.5], look: [p[0], p[1] + 1.2, p[2]], fov: 42 }, { f: cut(2), pos: [p[0] - 0.5, p[1] + 1.3, p[2] - 3.8], look: [p[0], p[1] + 1.15, p[2]], fov: 40 }],
  thrown: [{ f: cut(2), pos: [p[0] + 3, p[1] + 1.6, p[2] - 8], look: [p[0] + 2.2, p[1] + 1.2, p[2]], fov: 48 }, { f: cut(3), pos: [p[0] + 5, p[1] + 1.8, p[2] - 9], look: [p[0] + 4.5, p[1] + 0.8, p[2]], fov: 50 }],
  power: [{ f: cut(3), pos: [-150, 25, 240], look: [0, 50, 0], fov: 50 }, { f: F_HIRO, pos: [-120, 30, 200], look: [0, 55, 0], fov: 52 }, { f: cut(4), pos: [-110, 32, 185], look: [0, 55, 0], fov: 52 }],
  silent: [{ f: cut(4), pos: [80, 14, 80], look: [45, 0, 40], fov: 46 }, { f: cut(5), pos: [72, 12, 72], look: [40, 0, 36], fov: 44 }],
  walk: [{ f: cut(5), pos: [-36, 2.2, 101], look: [-39.5, 1.8, 92], fov: 46 }, { f: F_FIND, pos: [-37, 2.0, 99], look: [-39, 1.9, 92], fov: 42 }],
  ring: [{ f: cut(6), pos: [0, 260, 300], look: [0, 0, 20], fov: 50 }, { f: F_AWAY, pos: [0, 330, 260], look: [0, 0, 0], fov: 52 }, { f: cut(7), pos: [0, 340, 240], look: [0, 0, 0], fov: 52 }],
  center: [{ f: cut(7), pos: [4, 2.0, 16], look: [0, 7, -6], fov: 50 }, { f: F_NO - 6, pos: [3.6, 2.0, 13.5], look: [1.5, 3.5, 0], fov: 46 }],
  crater: [{ f: F_NO - 6, pos: [-8, 26, 26], look: [0, 0, 0], fov: 46 }, { f: cut(8), pos: [-9, 30, 28], look: [0, 0, 0], fov: 48 }],
  sky: [{ f: cut(8), pos: [-36, 4, 100], look: [-170, 290, -120], fov: 54 }, { f: F_BOOM, pos: [-36, 4, 98], look: [0, 70, 0], fov: 52 }, { f: F_TREES + 14, pos: [-34, 6, 104], look: [0, 55, 0], fov: 52 }],
  end: [{ f: F_TREES + 14, pos: [70, 44, 165], look: [0, 28, 0], fov: 48 }, { f: TOTAL - 1, pos: [90, 55, 200], look: [0, 40, 0], fov: 50 }],
}; };
let CAMS = null;
const KICKS = [{ f: F_80, a: 0.03 }, { f: F_BLAST, a: 0.07 }, { f: F_EXPL, a: 0.05 }, { f: F_CRATER, a: 0.03 }, { f: F_BOOM, a: 0.06 }];
const camAt = (f) => {
  CAMS = CAMS || camKeys();
  const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS });
  const B = blastAt(f); if (!B.done && B.t >= 0 && B.t < 0.25 && ['sky', 'power'].includes(S.id)) c.flash = 0.8 * (1 - B.t / 0.25);
  if (S.id === 'porch' && f > F_FIRE - 34 && f < F_FIRE - 20) c.flash = 0.5 * (1 - Math.abs(f - (F_FIRE - 27)) / 7);
  if (S.id === 'thrown' && f >= F_BLAST && f < F_BLAST + 6) c.flash = 0.35 * (1 - (f - F_BLAST) / 6);
  c.shadowAt = ['porch', 'thrown'].includes(S.id) ? P0() : S.id === 'walk' ? [-38, 0, 92] : [c.look[0], 0, c.look[2]];
  if (['hook', 'end', 'power', 'sky', 'ring'].includes(S.id)) c.shadowAt = [0, 0, 0];
  return c;
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => {
  const S = shotAt(f);
  if (S.id === 'porch' && f > F_SHIRT - 6) return { focus: dist(Cm.pos, P0()) , cinf: 9 };
  if (S.id === 'walk') return { focus: dist(Cm.pos, [-39, 1.6, 92]), cinf: 8 };
  return { focus: 10, cinf: 0 };
};

export default {
  TOTAL, build,
  frame(f, k) {
    const W = poseWorld(f), S = shotAt(f), cam = camAt(f);
    let light = { ...DAWN };
    if (['hook', 'end', 'power', 'thrown'].includes(S.id) || (S.id === 'sky' && f > F_BOOM) || (S.id === 'porch' && f > F_FIRE - 30)) light = { ...BLAST };
    if (['silent', 'walk', 'center', 'crater', 'ring'].includes(S.id)) light = { ...QUIET };
    if (['hook', 'end', 'power', 'sky', 'ring'].includes(S.id)) light.shadowExt = 260;
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam, W) };
  },
};
