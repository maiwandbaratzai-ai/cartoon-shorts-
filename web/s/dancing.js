// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The Dancing Plague" — Strasbourg, July–September 1518. Timed via dancing_timing.js.
import { TOTAL, LINES, wf } from './dancing_timing.js';
import * as PR from '../props.js';
import { INK } from '../toon.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const F_1518 = wf(0, '1518'), F_WOMAN = wf(0, 'woman'), F_DANCE = wf(0, 'dancing'), F_STOP = wf(0, 'stop'), F_FRAU = wf(1, 'frau'), F_STREET = wf(1, 'street'), F_WEEK = wf(1, 'week'),
  F_NEIGH = wf(2, 'neighbors'), F_JOIN = wf(2, 'joined'), F_34 = wf(2, 'thirty'), F_MONTH = wf(3, 'month'), F_400 = wf(3, 'four'), F_DOCS = wf(4, 'doctors'), F_DIAG = wf(4, 'diagnosis'), F_HOT = wf(4, 'hot'),
  F_CURE = wf(5, 'cure'), F_MORE = wf(5, 'more'), F_HALLS = wf(6, 'halls'), F_STAGE = wf(6, 'stage'), F_MUS = wf(6, 'musicians'), F_MUSIC = wf(7, 'music'), F_PULL = wf(7, 'pulled'),
  F_DANCERS = wf(7, 'dancers'), F_OPP = wf(8, 'opposite'), F_BAN = wf(8, 'banned'), F_MUSIC2 = wf(8, 'music'), F_DANCE2 = wf(8, 'dancing');
const SHOTS = [['hook', 0], ['troffea', cut(1)], ['neighbors', cut(2)], ['count', F_34 - 6], ['month', cut(3)], ['doctors', cut(4)], ['cure', cut(5)], ['stage', cut(6)], ['musicians', F_STAGE + 12],
  ['more', cut(7)], ['ban', cut(8)], ['end', F_DANCE2 + 14]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const DAY = { az: 120, el: 50, sky: '#e2eef8', ground: '#a08a6a', hemi: 1.15, sun: '#fff2d8', sunI: 2.4, fog: '#dce8f0', fogNear: 120, fogFar: 700,
  skyTop: '#3a86d8', skyHor: '#e4eef6', sat: 1.14, vig: 0.22, shadowExt: 30 };
const NIGHT = { ...DAY, az: 200, el: 35, sky: '#4a5a8a', ground: '#3a3a4a', hemi: 1.0, sun: '#a8b8ff', sunI: 1.2, fog: '#2a3458', skyTop: '#101a3a', skyHor: '#3a4a7a', sat: 0.9, vig: 0.36 };
const DUSK = { ...DAY, az: 30, el: 12, sun: '#ffc890', sky: '#ffd8b8', skyTop: '#5a5ab8', skyHor: '#ffc0a0', fog: '#e8c0b0', vig: 0.28 };
let K, crowd = [], stage, stageMusic = [];
const rnd = (() => { let s = 1518; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
const TR = [0, 0, 2]; // Frau Troffea's spot

function build(k) {
  K = k; const { THREE } = K;
  K.addClouds(8, 700, 160);
  // cobbled square
  const cob = PR.canvasTex(512, 512, (c) => { c.fillStyle = '#b8a888'; c.fillRect(0, 0, 512, 512); let s = 5; const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    for (let y = 0; y < 512; y += 22) for (let x = (y / 22 % 2) * 14; x < 512; x += 28) { c.fillStyle = ['#a8987a', '#c4b494', '#9c8c70', '#b4a080'][(r() * 4) | 0]; c.beginPath(); c.ellipse(x, y, 12, 9, 0, 0, 7); c.fill(); c.strokeStyle = 'rgba(60,40,30,.35)'; c.lineWidth = 2; c.stroke(); } }, [24, 24]);
  K.slab(-150, 150, -0.2, 0, -150, 150, K.toon({ map: cob }), K.scene, false);
  // half-timbered houses around the square (open toward +z where the camera lives)
  const plaster = ['#f2e8d4', '#f4dcc0', '#e8e0c8', '#f6e2d0', '#e8d8b8'], roofC = ['#b84a32', '#a8402e', '#c05a3a', '#9a4a3a'];
  const timber = (col, seed) => PR.canvasTex(256, 384, (c, w, h) => { c.fillStyle = col; c.fillRect(0, 0, w, h); c.strokeStyle = '#5a3a28'; c.lineWidth = 12;
    for (let y = 0; y <= h; y += 128) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); } for (let x = 0; x <= w; x += 64) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
    for (let y = 128; y < h; y += 128) for (let x = 0; x < w; x += 128) { c.beginPath(); if ((x / 128 + y / 128 + seed) % 2) { c.moveTo(x, y); c.lineTo(x + 64, y + 128); } else { c.moveTo(x + 128, y); c.lineTo(x + 64, y + 128); } c.stroke(); }
    c.fillStyle = '#5a7a9a'; for (let y = 24; y < 128; y += 200) for (let x = 12; x < w; x += 128) { c.fillRect(x + 4, y + 10, 40, 70); c.strokeRect(x + 4, y + 10, 40, 70); }
    c.fillStyle = '#6a9ac0'; for (let x = 12; x < w; x += 128) { c.fillRect(x + 4, 150, 40, 60); c.strokeRect(x + 4, 150, 40, 60); c.fillRect(x + 4, 278, 40, 60); c.strokeRect(x + 4, 278, 40, 60); }
    c.fillStyle = '#6a3a24'; c.fillRect(w / 2 - 28, h - 110, 56, 110); });
  const house = (x, z, ry, i) => { const g = K.group(); g.position.set(x, 0, z); g.rotation.y = ry; const w = 7 + (i % 3), h = 9 + (i % 2) * 3;
    K.slab(-w / 2, w / 2, 0, h, -4, 4, K.toon({ map: timber(plaster[i % 5], i) }), g);
    const rf = K.add(new THREE.CylinderGeometry(w * 0.62, w * 0.62, 8.6, 3), K.col(roofC[i % 4]), 0, h + w * 0.3, 0, g); rf.rotation.x = -Math.PI / 2;
    rf.position.y = h + w * 0.31; rf.scale.set(1, 1.0, 1);
    for (let k = 0; k < 2; k++) { const d = K.add(new THREE.BoxGeometry(1.1, 0.9, 1.0), K.col(roofC[(i + 1) % 4]), (k - 0.5) * w * 0.4, h + 1.6, 3.6, g); }
    return g; };
  let i = 0;
  for (let x = -30; x <= 30; x += 8.5) house(x + (i % 2) * 0.3, -20, 0, i++);
  for (let z = -12; z <= 30; z += 8.5) { house(-22, z, Math.PI / 2, i++); house(22, z, -Math.PI / 2, i++); }
  // cathedral tower behind the houses
  const sand = K.col('#c8826a'), sandD = K.col('#b06a56');
  K.slab(-7, 7, 0, 46, -60, -48, sand); K.slab(-7.4, 7.4, 46, 48, -60.4, -47.6, sandD);
  K.slab(-3, 3, 48, 66, -57, -51, sand); K.add(new THREE.ConeGeometry(4.6, 30, 8), sandD, 0, 81, -54);
  for (let y = 8; y < 44; y += 9) K.slab(-2, 2, y, y + 6, -47.98, -47.9, K.col('#6a8ab0'));
  K.add(new THREE.CircleGeometry(3, 24), K.col('#8aa8d0'), 0, 30, -47.8);
  // well in the square
  K.cyl(1.4, 1.5, 1.0, K.col('#a8a090'), -9, 0, -6); K.cyl(1.1, 1.1, 1.02, K.col('#4a6a8a'), -9, 0.01, -6); for (const s of [-1, 1]) K.slab(-9 + s * 1.2 - 0.1, -9 + s * 1.2 + 0.1, 1, 3, -6.1, -5.9, K.col('#6a4a30')); K.slab(-10.4, -7.6, 3, 3.2, -6.2, -5.8, K.col('#6a4a30'));
  // peg-people crowd (far dancers), sorted outward from Troffea
  const pts = [];
  for (let j = 0; j < 260; j++) { const x = -18 + rnd() * 36, z = -16 + rnd() * 19.5; if (Math.hypot(x - TR[0], z - TR[2]) < 2.2 || Math.hypot(x + 9, z + 6) < 2.4 || (Math.abs(x) < 2.8 && z > -1.5) || (x > 2 && x < 12 && z > -9.6 && z < -2.4)) continue; pts.push([x, z]); }
  pts.sort((a, b) => Math.hypot(a[0] - TR[0], a[1] - TR[2]) - Math.hypot(b[0] - TR[0], b[1] - TR[2]));
  const coats = ['#3f6fb5', '#8c3b4a', '#5d7a3a', '#b5653f', '#2f5f6a', '#7b5ac9', '#c25a7a', '#d9a441'], skins = ['#ffe2c2', '#f5c9a0', '#ecd0b6', '#c99067'];
  const bodyG = new THREE.CylinderGeometry(0.26, 0.36, 1.1, 10), headG = new THREE.SphereGeometry(0.27, 14, 10), armG = new THREE.CylinderGeometry(0.06, 0.06, 0.7, 5);
  pts.forEach(([x, z], j) => { const g = K.group(); g.position.set(x, 0, z); const cm = K.col(coats[j % 8]);
    K.add(bodyG, cm, 0, 0.75, 0, g); K.add(headG, K.col(skins[j % 4]), 0, 1.56, 0, g);
    const la = K.add(armG, cm, -0.33, 1.4, 0, g), ra = K.add(armG, cm, 0.33, 1.4, 0, g); la.rotation.z = 0.5; ra.rotation.z = -0.5;
    K.add(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 5), K.col('#3a3040'), -0.12, 0.2, 0, g); K.add(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 5), K.col('#3a3040'), 0.12, 0.2, 0, g);
    if (j % 3 === 0) K.add(new THREE.ConeGeometry(0.3, 0.3, 8), K.col('#f4f0e4'), 0, 1.82, 0, g);
    g.userData = { seed: j * 0.37, la, ra }; crowd.push(g); });
  // wooden stage + musicians' stools (pops up on "stage")
  stage = K.group(); stage.position.set(7, 0, -6);
  const plank = PR.canvasTex(256, 256, (c) => { c.fillStyle = '#a8784a'; c.fillRect(0, 0, 256, 256); for (let x = 0; x < 256; x += 32) { c.fillStyle = 'rgba(0,0,0,.22)'; c.fillRect(x, 0, 3, 256); } }, [3, 2]);
  K.slab(-4.5, 4.5, 0, 1.2, -3, 3, K.toon({ map: plank }), stage); for (const x of [-4.4, 4.4]) for (const z of [-2.9, 2.9]) K.slab(x - 0.12, x + 0.12, 0, 1.2, z - 0.12, z + 0.12, K.col('#6a4a30'), stage);
  K.slab(-4.6, 4.6, 1.2, 1.35, -3.1, 3.1, K.col('#8a5a34'), stage);
  for (const x of [-3.5, 3.5]) K.slab(x - 0.12, x + 0.12, 1.2, 5, -2.9, -2.7, K.col('#6a4a30'), stage);
  const bunt = PR.canvasTex(256, 64, (c) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#f6c83a' : '#c83a3a'; c.beginPath(); c.moveTo(i * 32, 0); c.lineTo(i * 32 + 32, 0); c.lineTo(i * 32 + 16, 56); c.fill(); } });
  K.add(new THREE.PlaneGeometry(7, 0.9), new THREE.MeshBasicMaterial({ map: bunt, transparent: true, side: THREE.DoubleSide, alphaTest: 0.5 }), 0, 4.6, -2.75, stage);
}

// ---------------- crowd state ----------------
const crowdAt = (f) => { const id = shotAt(f).id;
  if (id === 'hook' || id === 'end') return 200; if (id === 'troffea') return 0; if (id === 'neighbors') return Math.round(lerp(0, 20, ramp(f, F_JOIN - 6, E(2)))); if (id === 'count') return Math.round(lerp(14, 34, ramp(f, F_34 - 6, E(2))));
  if (id === 'month') return Math.round(lerp(40, 210, M.easeOut(ramp(f, cut(3), F_400 + 6)))); if (id === 'more') return Math.round(lerp(140, 250, ramp(f, cut(7), F_DANCERS + 6)));
  if (id === 'ban') return f > F_BAN + 4 ? 180 : 200; return 160; };
function poseWorld(f) {
  const n = crowdAt(f), id = shotAt(f).id, frozen = id === 'ban' && f > F_BAN + 4;
  crowd.forEach((g, j) => { g.visible = j < n; if (!g.visible) return; const ph = f * 0.22 + g.userData.seed * 20, hop = frozen ? 0 : Math.abs(Math.sin(ph)) * 0.35;
    g.position.y = hop; g.rotation.y = frozen ? 0 : Math.sin(ph * 0.5) * 1.2; g.rotation.z = frozen ? 0 : Math.sin(ph) * 0.15;
    g.userData.la.rotation.z = frozen ? 0.15 : 0.5 + 1.8 * (0.5 + 0.5 * Math.sin(ph + 1)); g.userData.ra.rotation.z = frozen ? -0.15 : -0.5 - 1.8 * (0.5 + 0.5 * Math.sin(ph + 2)); });
  const sv = ['stage', 'musicians', 'more', 'hook', 'end', 'ban'].includes(id) ? (id === 'stage' ? M.back(ramp(f, F_STAGE - 4, F_STAGE + 8)) : 1) : 0;
  stage.visible = sv > 0.01; stage.scale.set(1, Math.max(0.01, sv), 1);
}

// ---------------- characters ----------------
const TROF = { jacket: '#c25a3a', pants: '#3b3f52', boots: '#4a3426', hat: 'bonnet', dress: '#c8584a', skin: '#f5c9a0' };
const NB = (v) => ({ jacket: ['#3f6fb5', '#5d7a3a', '#7b5ac9', '#b5653f'][v % 4], pants: '#3b3f52', boots: '#4a3426', skin: ['#ffe2c2', '#f5c9a0', '#ecd0b6', '#c99067'][v % 4],
  ...(v % 2 ? { hat: 'bonnet', dress: ['#d9a441', '#5a8fc2', '#c25a7a'][v % 3] } : { hat: 'hair', hair: ['#5a3b2a', '#2a201a', '#8a6a3a'][v % 3] }) });
const DOC = { jacket: '#2a2430', pants: '#2a2430', boots: INK, hat: 'cap', cap: '#1a1820', moustache: '#d9d0c0', build: 'stout', skin: '#f5c9a0', buttons: '#e8c45a' };
const DOC2 = { jacket: '#3a2a3a', pants: '#2a2430', boots: INK, hat: 'cap', cap: '#4a1a2a', skin: '#ecd0b6', buttons: '#e8c45a' };
const MUS = (v) => ({ jacket: ['#c83a3a', '#2f6a5a', '#d9a441'][v % 3], pants: '#e9e6da', boots: '#4a3426', hat: 'cap', cap: ['#f6c83a', '#c83a3a', '#2a4a8a'][v % 3], skin: ['#f5c9a0', '#c99067', '#ffe2c2'][v % 3] });
const OFF = { jacket: '#8a2a2a', pants: '#e9e6da', boots: INK, hat: 'tophat', moustache: '#e8e4dc', sash: '#e8c45a', buttons: '#e8c45a', build: 'stout', skin: '#f5c9a0' };
const LIGHT2D = -2.1;
const fo = (f, seed, o) => ({ mode: 'stand', light: LIGHT2D, seed, blink: blinkAt(f, seed), ...o });
const card = (T, key, o, opts, pos, extra = {}) => ({ key: key + JSON.stringify(opts), draw: (p) => T.bodyFront(p, o, opts), x: pos[0], y: pos[1], z: pos[2], ...extra });
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1] - 1.07 * s, z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
const inFront = (c, d, ux, uy) => {
  const V = K.THREE.Vector3, p = new V(...c.pos), dir = new V(...c.look).sub(p).normalize(), right = new V().crossVectors(dir, new V(0, 1, 0)).normalize(), up = new V().crossVectors(right, dir);
  const h = d * Math.tan(c.fov * Math.PI / 360); return p.addScaledVector(dir, d).addScaledVector(right, ux * h).addScaledVector(up, uy * h).toArray();
};
const wordCard = (f, f0, txt, c, col = '#f6c83a', dur = 1e9, size = 170, uy = 0.42) => { if (f < f0 - 1 || f > f0 + dur) return null; const t = q(Math.min(1, (f - f0 + 1) / 12));
  const r = Math.min(1, 400 / (0.7 * size * txt.length)), fs = size * r, s = Math.min(2.5, 1.25 / r);
  return FX('w' + txt + t, (p) => PR.word(p, txt, t, col, fs), inFront(c, 7, 0, uy), s, { order: 9 }); };
// a dance step: arms up / one arm waving, hop, sway, flip
const dancer = (T, key, o, f, seed, pos, expr = 'laugh', tired = 0) => { const ph = f * 0.2 + seed * 3, beat = Math.floor(ph / Math.PI) % 4;
  const opts = fo(f, seed, { mode: beat % 2 ? 'fall' : 'stand', wave: beat % 2 ? undefined : q(Math.sin(ph * 2), 1), expr, tilt: q(12 * Math.sin(ph), 0), headTilt: q(-8 * Math.sin(ph), 0), look: q(0.4 * Math.sin(ph * 0.5), 1) });
  return card(T, key, o, opts, [pos[0], pos[1] + Math.abs(Math.sin(ph)) * 0.25 * (1 - tired), pos[2]], { flip: beat === 2 }); };

function actorsAt(f, T) {
  const S = shotAt(f), out = [];
  const trof = (expr = 'laugh', tired = 0) => out.push(dancer(T, 'tr', TROF, f, 2, TR, expr, tired));
  switch (S.id) {
    case 'hook': case 'end': trof(f > F_STOP - 6 && S.id === 'hook' ? 'pained' : 'laugh'); out.push(dancer(T, 'n1', NB(1), f, 5, [-1.6, 0, 0.6], 'grin')); out.push(dancer(T, 'n2', NB(2), f, 7, [1.7, 0, 0.4], 'laugh')); break;
    case 'troffea': trof(f > F_WEEK - 10 ? 'dazed' : f > F_STREET ? 'pained' : 'laugh'); break;
    case 'neighbors': case 'count': { trof('pained'); for (let i = 0; i < 4; i++) { const t0 = F_NEIGH + i * 8, k = M.smooth(ramp(f, t0, t0 + 24)), sp = [[-2.0, 0, -0.6], [2.0, 0, -0.4], [-1.2, 0, -2.4], [1.3, 0, -2.6]][i], from = [sp[0] * 4, 0, sp[2] - 6];
        const p = [lerp(from[0], sp[0], k), 0, lerp(from[2], sp[2], k)]; out.push(k < 0.98 ? card(T, 'w' + i, NB(i), fo(f, 10 + i, { expr: 'shock', look: 0.3 }), p) : dancer(T, 'n' + i, NB(i), f, 10 + i, p, i % 2 ? 'grin' : 'laugh')); } break; }
    case 'doctors': out.push(card(T, 'd1', DOC, fo(f, 31, { expr: f > F_DIAG ? 'stern' : 'neutral', look: 0.4, tilt: q(idle(f, 31).tilt, 1) }), [-0.8, 0, 8])); out.push(card(T, 'd2', DOC2, fo(f, 32, { expr: f > F_HOT ? 'grin' : 'nervous', look: -0.4 }), [0.8, 0, 8.2])); break;
    case 'cure': out.push(card(T, 'd1c', DOC, fo(f, 31, { expr: f > F_MORE ? 'grin' : 'smile', wave: f > F_MORE ? q(Math.sin(f * 0.35), 1) : undefined }), [0, 0, 8])); break;
    case 'stage': case 'musicians': case 'more': for (let i = 0; i < 3; i++) { const p = [7 - 2.4 + i * 2.4, 1.2 * stage.scale.y, -6.2]; out.push(card(T, 'm' + i, MUS(i), fo(f, 40 + i, { expr: 'whistle', tilt: q(6 * Math.sin(f * 0.25 + i), 0), wave: q(Math.sin(f * 0.4 + i * 2), 1) }), p, { ground: p[1] })); }
      if (S.id !== 'stage') { trof('dazed', 0.3); out.push(dancer(T, 'n1', NB(1), f, 5, [-1.6, 0, 0.6], 'grin')); out.push(dancer(T, 'n2', NB(2), f, 7, [1.7, 0, 0.4], 'laugh')); } break;
    case 'month': trof('dazed', 0.4); break;
    case 'ban': { const fr = f > F_BAN + 4; out.push(card(T, 'off', OFF, fo(f, 50, { expr: fr ? 'stubborn' : 'stern', wave: f > F_OPP && !fr ? q(Math.sin(f * 0.5), 1) : undefined, tilt: q(idle(f, 50).tilt, 1) }), [3.2, 0, 4.2]));
      out.push(fr ? card(T, 'trf', TROF, fo(f, 2, { expr: 'relief' }), TR) : dancer(T, 'tr', TROF, f, 2, TR, 'dazed', 0.5)); break; }
  }
  return out;
}

function fxAt(f, T, cam) {
  const S = shotAt(f), out = [], push = (x) => x && out.push(x);
  const notes = (n, c0, spread = 3) => { for (let i = 0; i < n; i++) { const t = ((f * 0.012 + i / n) % 1), x = c0[0] + (i - n / 2) * spread / n + Math.sin(f * 0.05 + i) * 0.5;
    out.push(FX('nt' + (i % 3) + q(t, 1), (p) => { p.g.save(); p.g.globalAlpha = Math.sin(t * Math.PI); p.g.translate(200, 300); p.g.scale(2, 2); T.fxNote(p, i % 2 ? 'eighth' : 'quarter', ['#c83a3a', '#2a4a8a', '#3a7a3a'][i % 3]); p.g.restore(); }, [x, c0[1] + t * 4, c0[2]], 0.8, { order: 6 })); } };
  if (S.id === 'hook') { push(wordCard(f, F_1518, '1518', cam, '#f6c83a', F_DANCE - F_1518 - 4)); push(wordCard(f, F_STOP, "CAN'T STOP!", cam, '#ffffff')); }
  if (S.id === 'troffea') { const day = 1 + Math.min(5, Math.floor((f - F_FRAU) / 13)); if (f >= F_FRAU) push(wordCard(f, F_FRAU + (day - 1) * 13, 'DAY ' + day, cam, day > 5 ? '#ff7a6a' : '#ffffff', 12, 200, 0.45)); if (f > F_FRAU + 78) push(wordCard(f, F_FRAU + 78, 'DAY 6', cam, '#ff7a6a', 1e9, 200, 0.45)); }
  if (S.id === 'count') push(wordCard(f, F_34, '34 DANCERS', cam, '#f6c83a', 1e9, 170, 0.5));
  if (S.id === 'month') push(wordCard(f, F_400, '~400', cam, '#ff7a6a', 1e9, 220, 0.45));
  if (S.id === 'doctors') push(wordCard(f, F_HOT, 'HOT BLOOD', cam, '#ff5a4a', 1e9, 180, 0.5));
  if (S.id === 'cure') push(wordCard(f, F_MORE, 'MORE DANCING!', cam, '#f6c83a', 1e9, 170, 0.5));
  if (S.id === 'stage') { push(wordCard(f, F_HALLS, 'HALLS', cam, '#ffffff', F_STAGE - F_HALLS - 2, 190, 0.5)); push(wordCard(f, F_STAGE, 'STAGE', cam, '#f6c83a', 1e9, 190, 0.5)); }
  if (S.id === 'musicians') { notes(6, [7, 3, -5.6]); push(wordCard(f, F_MUS, 'BAND', cam, '#ffffff', 1e9, 200, 0.5)); }
  if (S.id === 'more' || S.id === 'hook' || S.id === 'end') notes(5, [7, 3, -5.6], 4);
  if (S.id === 'more') push(wordCard(f, F_DANCERS, 'MORE DANCERS', cam, '#ff7a6a', 1e9, 170, 0.5));
  if (S.id === 'ban') { if (f > F_BAN) out.push(FX('sign', (p) => { p.g.translate(60, 200); p.g.scale(0.7, 0.7); T.fxSign(p); }, [4.0, 2.4, 4.4], 0.9, { order: 6 }));
    push(wordCard(f, F_OPP, 'THE OPPOSITE', cam, '#ffffff', F_BAN - F_OPP - 2, 170, 0.55)); push(wordCard(f, F_BAN, 'BANNED!', cam, '#ff5a4a', 1e9, 200, 0.55)); }
  return out;
}

// ---------------- cameras ----------------
const CAMS = {
  hook: [{ f: 0, pos: [1.2, 1.6, 9.5], look: [0, 1.6, 0], fov: 50 }, { f: F_STRAS(), pos: [-1, 2.4, 10.5], look: [0, 3, -10], fov: 52 }, { f: F_DANCE, pos: [0.6, 1.5, 7.2], look: [0, 1.4, 2], fov: 46 }, { f: cut(1), pos: [0.4, 1.5, 6.4], look: [0, 1.4, 2], fov: 44 }],
  troffea: [{ f: cut(1), pos: [4, 1.6, 7.6], look: [0, 1.3, 2], fov: 46, }, { f: F_STREET, pos: [-2, 2.0, 7.4], look: [0, 1.3, 2], fov: 46, path: [[1.5, 1.8, 8.2]] }, { f: cut(2), pos: [-4, 2.6, 6.0], look: [0, 1.3, 2], fov: 46, path: [[-3.4, 2.2, 7.0]] }],
  neighbors: [{ f: cut(2), pos: [0, 2.6, 10.5], look: [0, 1.4, -1], fov: 50 }, { f: F_34 - 6, pos: [0, 2.4, 9.5], look: [0, 1.3, -1], fov: 48 }],
  count: [{ f: F_34 - 6, pos: [3.5, 4.5, 11], look: [0, 1.0, -1], fov: 50 }, { f: cut(3), pos: [4.5, 5.5, 12], look: [0, 1.0, -2], fov: 50 }],
  month: [{ f: cut(3), pos: [10, 14, 22], look: [0, 0, -2], fov: 50 }, { f: F_400, pos: [6, 22, 26], look: [0, 0, -3], fov: 52 }, { f: cut(4), pos: [4, 24, 27], look: [0, 0, -3], fov: 52 }],
  doctors: [{ f: cut(4), pos: [0, 1.8, 14.5], look: [0, 1.5, 8], fov: 44 }, { f: F_HOT - 4, pos: [0.4, 1.75, 12.5], look: [0.4, 1.6, 8], fov: 40 }],
  cure: [{ f: cut(5), pos: [0, 1.6, 11.6], look: [0, 1.6, 8], fov: 42 }, { f: F_MORE, pos: [-1.5, 2.2, 13.5], look: [0, 1.5, 3], fov: 50 }, { f: cut(6), pos: [-1.6, 2.4, 14], look: [0, 1.5, 2], fov: 52 }],
  stage: [{ f: cut(6), pos: [-6, 3, 9], look: [-14, 2, -10], fov: 50 }, { f: F_STAGE - 6, pos: [0, 3, 8], look: [7, 1.5, -6], fov: 48 }, { f: F_STAGE + 12, pos: [1, 2.8, 6], look: [7, 2.0, -6], fov: 46 }],
  musicians: [{ f: F_STAGE + 12, pos: [7, 6.0, 5.5], look: [7, 2.4, -6], fov: 54 }, { f: cut(7), pos: [7.2, 5.4, 4.0], look: [7, 2.5, -6], fov: 50 }],
  more: [{ f: cut(7), pos: [-6, 6, 15], look: [2, 1, -4], fov: 50 }, { f: F_DANCERS, pos: [-10, 12, 20], look: [0, 0, -4], fov: 52 }, { f: cut(8), pos: [-11, 13, 21], look: [0, 0, -4], fov: 52 }],
  ban: [{ f: cut(8), pos: [3.0, 1.9, 9.2], look: [3.2, 1.7, 4.2], fov: 42 }, { f: F_BAN - 4, pos: [2.2, 2.0, 9.8], look: [2.0, 1.6, 3.0], fov: 46 }, { f: F_DANCE2 + 14, pos: [2.0, 2.0, 10.2], look: [1.8, 1.6, 3.0], fov: 46 }],
  end: [{ f: F_DANCE2 + 14, pos: [-1.2, 1.9, 8.6], look: [0, 1.6, 0], fov: 52 }, { f: TOTAL - 1, pos: [1.2, 1.6, 9.5], look: [0, 1.6, 0], fov: 50 }],
};
function F_STRAS() { return wf(0, 'strasbourg') - 4; }
const KICKS = [{ f: F_STOP, a: 0.03 }, { f: F_34, a: 0.03 }, { f: F_400, a: 0.04 }, { f: F_HOT, a: 0.03 }, { f: F_STAGE, a: 0.04 }, { f: F_BAN, a: 0.05 }];
const camAt = (f) => { const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS }); c.shadowAt = [c.look[0], 0, Math.max(-10, c.look[2])]; return c; };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => {
  const S = shotAt(f);
  if (S.id === 'doctors' || S.id === 'cure' && f < F_MORE) return { focus: dist(Cm.pos, [0, 1.6, 8]), cinf: 10 };
  if (S.id === 'ban') return { focus: dist(Cm.pos, [3.2, 1.6, 4.2]), cinf: 8 };
  return { focus: 10, cinf: 0 };
};

export default {
  TOTAL, build,
  frame(f, k) {
    poseWorld(f);
    const S = shotAt(f), cam = camAt(f);
    let light = { ...DAY };
    if (S.id === 'troffea' && f >= F_FRAU) { const d = Math.floor((f - F_FRAU) / 13) % 2; light = d ? { ...NIGHT } : { ...DAY }; if (f > F_FRAU + 78) light = { ...DUSK }; }
    if (S.id === 'month' || S.id === 'more') light = { ...DUSK };
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
  },
};
