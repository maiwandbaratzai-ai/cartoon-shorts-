// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Operation Cat Drop" — Sarawak, Borneo, 1960: DDT, collapsing roofs, rats, and cats by parachute. Timed via catdrop_timing.js.
import { TOTAL, LINES, wf } from './catdrop_timing.js';
import * as PR from '../props.js';
import { INK } from '../toon.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const F_1960 = wf(0, '1960'), F_PARA = wf(0, 'parachuted'), F_CATS = wf(0, 'cats'), F_MOS = wf(1, 'mosquitoes'), F_MAL = wf(1, 'malaria'), F_SPRAY = wf(2, 'sprayed'), F_DDT = wf(2, 'ddt'),
  F_DIED = wf(3, 'died'), F_WASP = wf(3, 'wasps'), F_CAT = wf(3, 'caterpillars'), F_MUNCH = wf(4, 'munched'), F_CAVED = wf(4, 'caved'), F_WORSE = wf(5, 'worse'), F_LIZ = wf(5, 'lizards'),
  F_CATS2 = wf(5, 'cats'), F_CDIED = wf(6, 'died'), F_RATS = wf(6, 'rats'), F_RAF = wf(7, 'raf'), F_CRATES = wf(7, 'crates'), F_DROP = wf(7, 'dropped'), F_CHUTE = wf(7, 'parachute'),
  F_NAME = wf(8, 'name'), F_OP = wf(8, 'operation'), F_DROP2 = wf(8, 'drop');
const SHOTS = [['hook', 0], ['mosq', cut(1)], ['spray', cut(2)], ['wasps', cut(3)], ['roof', cut(4)], ['chain', cut(5)], ['catx', F_CATS2 - 4], ['rats', cut(6)], ['plane', cut(7)], ['drop', F_DROP - 4],
  ['name', cut(8)], ['loop', F_DROP2 + 4]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const DAY = { az: 120, el: 55, sky: '#e0f0e8', ground: '#6a8a4a', hemi: 1.15, sun: '#fff4dc', sunI: 2.4, fog: '#cfe4dc', fogNear: 90, fogFar: 700,
  skyTop: '#3a8ad0', skyHor: '#d8eee8', sat: 1.15, vig: 0.2, shadowExt: 24 };
const GLOOM = { ...DAY, sunI: 1.5, hemi: 1.25, skyTop: '#6a7f90', skyHor: '#c8d4cc', fog: '#b8c8c0', sat: 0.85, vig: 0.32 };
let K, roofSegs = [], plane, props = [], crates = [];
const rnd = (() => { let s = 77; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
const gnd = (x, z) => (z < -14 ? (-z - 14) * 0.25 : 0) + 0.3 * Math.sin(x * 0.2) * Math.sin(z * 0.25) * clamp((Math.abs(z) - 8) / 6) + (z > 16 ? -1.2 : 0);

const crateChute = () => {
  const g = K.group(), wood = K.col('#b08050');
  K.slab(-0.45, 0.45, 0, 0.6, -0.4, 0.4, wood, g); K.slab(-0.47, 0.47, 0.25, 0.33, -0.42, 0.42, K.col('#7a5434'), g);
  const dome = new K.THREE.SphereGeometry(2.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2.4);
  const tex = PR.canvasTex(256, 64, (c) => { for (let i = 0; i < 8; i++) { c.fillStyle = i % 2 ? '#f2ead6' : '#d84a3a'; c.fillRect(i * 32, 0, 32, 64); } });
  K.add(dome, K.toon({ map: tex, side: K.THREE.DoubleSide }), 0, 3.0, 0, g).scale.y = 0.75;
  for (let i = 0; i < 6; i++) { const a = i * 1.047; K.beam(K.V(0, 0.6, 0), K.V(Math.cos(a) * 1.9, 3.3, Math.sin(a) * 1.9), 0.02, K.col('#e8e4dc'), g).castShadow = false; }
  return g;
};

function build(k) {
  K = k; const { THREE } = K;
  K.addClouds(12, 700, 120);
  PR.terrain(K, 600, 200, gnd, K.toon({ map: PR.speckTex('#6a9a3e', ['#5e8c36', '#78a848', '#567f30'], 11, 2600, 70) }));
  // river in front
  K.slab(-300, 300, -1.0, -0.6, 17, 60, K.toon({ map: PR.speckTex('#3f8aa0', ['#4f9ab0', '#5aa8bc', '#3a7a90'], 3, 800, 30) }), K.scene, false);
  K.slab(-300, 300, -0.9, 0.05, 15.5, 17, K.col('#9a7a50'), K.scene, false);
  // jungle: broadleaf trees + palms (merged)
  const M4 = THREE.Matrix4, crowns = [], trunks = [], palms = [];
  for (let i = 0; i < 260; i++) { const x = (rnd() - 0.5) * 260, z = -16 - rnd() * 110; const s = 1 + rnd() * 1.4; const m = new M4().makeTranslation(x, gnd(x, z), z).multiply(new M4().makeScale(s, s, s));
    trunks.push(m.clone().multiply(new M4().makeTranslation(0, 4, 0))); for (let j = 0; j < 4; j++) crowns.push(m.clone().multiply(new M4().makeTranslation((j - 1.5) * 1.6, 8.5 + (j % 2) * 1.4, (j % 2) * 1.2 - 0.6))); }
  for (let i = 0; i < 40; i++) { const x = (rnd() - 0.5) * 120, z = -8 - rnd() * 10; if (Math.abs(x) < 16) continue; const m = new M4().makeTranslation(x, gnd(x, z), z); trunks.push(m.clone().multiply(new M4().makeTranslation(0, 4, 0)).multiply(new M4().makeScale(0.6, 1, 0.6)));
    for (let j = 0; j < 6; j++) palms.push(m.clone().multiply(new M4().makeTranslation(0, 8, 0)).multiply(new M4().makeRotationY(j * 1.05)).multiply(new M4().makeRotationZ(-0.5)).multiply(new M4().makeTranslation(1.6, 0, 0))); }
  K.add(PR.mergeCopies(new THREE.CylinderGeometry(0.35, 0.5, 8, 7), trunks), K.col('#7a5a3e'), 0, 0, 0).frustumCulled = false;
  K.add(PR.mergeCopies(new THREE.IcosahedronGeometry(2.6, 1), crowns), K.col('#3f7a36'), 0, 0, 0).frustumCulled = false;
  K.add(PR.mergeCopies(new THREE.BoxGeometry(3.4, 0.08, 0.9), palms), K.col('#5a9a3a'), 0, 0, 0).frustumCulled = false;
  for (let i = 0; i < 6; i++) K.sphere(70, K.col(i % 2 ? '#4f7f5a' : '#5a8a62'), -260 + i * 110, -30, -260 - (i % 2) * 40, K.scene, 1.4, 0.8, 1);
  // longhouse on stilts: floor at y 2.2, front face z = 3, roof in 6 segments that can cave in
  const bamboo = PR.canvasTex(256, 256, (c) => { c.fillStyle = '#c8a46a'; c.fillRect(0, 0, 256, 256); for (let x = 0; x < 256; x += 16) { c.fillStyle = 'rgba(0,0,0,.18)'; c.fillRect(x, 0, 3, 256); } for (let y = 0; y < 256; y += 64) { c.fillStyle = 'rgba(0,0,0,.15)'; c.fillRect(0, y, 256, 4); } }, [6, 1]);
  K.slab(-13, 13, 2.0, 2.3, -3, 5, K.col('#9a7450')); K.slab(-13, 13, 2.3, 5.0, -3, 2.6, K.toon({ map: bamboo }));
  for (let x = -12; x <= 12; x += 2.4) for (const z of [-2.6, 1, 4.6]) K.cyl(0.14, 0.16, 2.0, K.col('#6a4a30'), x, 0, z);
  for (let i = 0; i < 5; i++) K.slab(-6 + i * 3.4, -4.6 + i * 3.4, 2.9, 4.3, 2.58, 2.66, K.col('#4a3020'));
  const lad = K.group(); lad.position.set(-9, 0, 5.4); lad.rotation.x = -0.35; for (const x of [-0.4, 0.4]) K.slab(x - 0.06, x + 0.06, 0, 2.4, -0.05, 0.05, K.col('#6a4a30'), lad); for (let i = 0; i < 5; i++) K.slab(-0.4, 0.4, 0.3 + i * 0.45, 0.38 + i * 0.45, -0.04, 0.04, K.col('#6a4a30'), lad);
  const thatch = K.toon({ map: PR.canvasTex(256, 256, (c) => { c.fillStyle = '#c8a050'; c.fillRect(0, 0, 256, 256); for (let i = 0; i < 300; i++) { c.fillStyle = `rgba(${90 + (i % 3) * 20},60,20,.35)`; c.fillRect((i * 71) % 256, (i * 37) % 256, 2, 26); } }, [2, 2]), side: THREE.DoubleSide });
  for (let s = 0; s < 6; s++) { const seg = K.group(); seg.position.set(-11 + s * 4.4, 7.3, -0.2); K.slab(-2.25, 2.25, -0.12, 0.12, 0, 3.9, thatch, seg).rotation.x = 0.62; K.slab(-2.25, 2.25, -0.12, 0.12, -3.9, 0, thatch, seg).rotation.x = -0.62;
    roofSegs.push(seg); }
  // RAF transport plane (high wing, twin engine)
  plane = K.group(); const grey = K.col('#a8b0b8'), dk = K.col('#3a4048');
  const fus = K.add(new THREE.CylinderGeometry(1.1, 0.9, 16, 16), grey, 0, 0, 0, plane); fus.rotation.z = Math.PI / 2; K.sphere(1.1, grey, 8, 0, 0, plane, 1.4, 1, 1);
  const roundel = PR.canvasTex(128, 128, (c) => { c.fillStyle = '#a8b0b8'; c.fillRect(0, 0, 128, 128); c.fillStyle = '#2a3f8a'; c.beginPath(); c.arc(64, 64, 56, 0, 7); c.fill(); c.fillStyle = '#ffffff'; c.beginPath(); c.arc(64, 64, 38, 0, 7); c.fill(); c.fillStyle = '#c8302a'; c.beginPath(); c.arc(64, 64, 20, 0, 7); c.fill(); });
  K.slab(-2, 2, 1.0, 1.3, -13, 13, grey, plane); for (const z of [-9, 9]) K.add(new THREE.BoxGeometry(3, 0.05, 3), K.toon({ map: roundel }), 0, 1.33, z, plane);
  for (const z of [-4.5, 4.5]) { const e = K.add(new THREE.CylinderGeometry(0.6, 0.5, 3, 12), dk, 1.4, 0.7, z, plane); e.rotation.z = Math.PI / 2; K.slab(2.9, 3.0, -0.1, 1.5, z - 1.4, z + 1.4, K.col('#2a2a30'), plane); }
  K.slab(-9, -7, 0.4, 0.55, -4, 4, grey, plane); K.slab(-9, -7.5, 0.5, 3.6, -0.1, 0.1, grey, plane);
  for (let i = 0; i < 6; i++) { const c = crateChute(); crates.push(c); }
}

// ---------------- world state ----------------
const CRATEPOS = [[-6, 9], [2, 7], [8, 11], [-2, 12], [5, 4], [-9, 5]];
function poseWorld(f) {
  const id = shotAt(f).id;
  const cave = id === 'roof' ? M.easeIn(ramp(f, F_CAVED - 6, F_CAVED + 6)) : ['chain', 'catx', 'rats'].includes(id) ? 1 : 0;
  roofSegs.forEach((s, i) => { const c = i === 2 || i === 3 ? cave : i === 1 ? cave * 0.5 : 0; s.position.y = 7.3 - c * 2.0; s.rotation.z = (i - 2.5) * 0.12 * c; s.rotation.x = 0.15 * c * (i % 2 ? 1 : -1); });
  plane.visible = ['hook', 'plane', 'drop', 'loop'].includes(id);
  const pf = id === 'hook' || id === 'loop' ? (id === 'hook' ? f : f - TOTAL) : id === 'plane' ? f - cut(7) - 40 : f - cut(7) - 40;
  plane.position.set(-60 + pf * 0.9, 42, -8); plane.rotation.set(0.05, 0, 0.04 * Math.sin(f * 0.05));
  crates.forEach((c, i) => { const p = CRATEPOS[i]; let y = -50;
    if (id === 'hook' || id === 'loop') y = 30 - ((f + i * 25 + (id === 'loop' ? 0 : 60)) % 150) * 0.12 - i * 2.5;
    if (id === 'drop') y = Math.max(0, 40 - (f - F_DROP + i * 6) * 0.45);
    if (id === 'name') y = i < 4 ? 0 : -50;
    let px = p[0], pz = p[1]; if ((id === 'hook' || id === 'loop') && i === 0) { const u = id === 'hook' ? f / 115 : (f - TOTAL + 120) / 115; px = 2.1; pz = 12.5; y = lerp(8.0, 5.2, clamp(u)); }
    c.visible = y > -40; c.position.set(px, y, pz); c.rotation.set(0.05 * Math.sin(f * 0.08 + i), i, 0.06 * Math.sin(f * 0.07 + i));
    c.children.forEach((m, j) => { if (j > 1) m.visible = !(id === 'name'); }); });
}

// ---------------- 2D critters ----------------
const cat = (p, mode = 'sit', ph = 0, expr = 'happy') => {
  const o = '#f0a040', d = '#c87a28', TAU = Math.PI * 2;
  if (mode === 'sit') { p.stroke([[400, 900], [470, 860], [480, 780]], 26, o); p.ell(300, 800, 130, 160, o, 12); for (let i = 0; i < 3; i++) p.stroke([[220 + i * 50, 700], [240 + i * 50, 760]], 10, d);
    p.ell(240, 950, 50, 28, o, 10); p.ell(360, 950, 50, 28, o, 10); }
  else { const b = 8 * Math.abs(Math.sin(ph * TAU)); for (const [x, s] of [[200, 1], [240, -1], [380, -1], [420, 1]]) { const a = s * 0.5 * Math.sin(ph * TAU); p.line([[x, 800 - b], [x + 40 * Math.sin(a), 960]], o, 26); }
    p.ell(310, 790 - b, 170, 90, o, 12); p.stroke([[150, 780], [100, 700], [120, 640]], 24, o); for (let i = 0; i < 3; i++) p.stroke([[260 + i * 50, 715 - b], [270 + i * 50, 770 - b]], 10, d); }
  const hx = mode === 'sit' ? 300 : 470, hy = mode === 'sit' ? 600 : 690;
  p.poly([[hx - 95, hy - 30], [hx - 80, hy - 140], [hx - 20, hy - 70]], o, 10); p.poly([[hx + 95, hy - 30], [hx + 80, hy - 140], [hx + 20, hy - 70]], o, 10);
  p.ell(hx, hy, 110, 92, o, 12); p.poly([[hx - 66, hy - 100], [hx - 72, hy - 72], [hx - 48, hy - 82]], '#f2b8b0', 0);
  if (expr === 'dead') { for (const s of [-1, 1]) { p.stroke([[hx + s * 40 - 14, hy - 24], [hx + s * 40 + 14, hy + 4]], 9, INK); p.stroke([[hx + s * 40 + 14, hy - 24], [hx + s * 40 - 14, hy + 4]], 9, INK); } }
  else { for (const s of [-1, 1]) { p.ell(hx + s * 40, hy - 12, 20, 24, '#f6f0c0', 6); p.ell(hx + s * 40, hy - 10, 6, 16, INK, 0); } }
  p.poly([[hx - 12, hy + 18], [hx + 12, hy + 18], [hx, hy + 30]], '#e07080', 5); p.stroke([[hx, hy + 30], [hx - 18, hy + 46]], 6, INK); p.stroke([[hx, hy + 30], [hx + 18, hy + 46]], 6, INK);
  for (const s of [-1, 1]) for (const dy of [-6, 10]) p.stroke([[hx + s * 40, hy + 26 + dy], [hx + s * 140, hy + 14 + dy * 2]], 4, INK);
};
const rat = (p, ph = 0) => { const b = 6 * Math.abs(Math.sin(ph * 6.28)); p.stroke([[150, 900], [70, 870], [40, 920]], 10, '#d8a0a0');
  p.ell(300, 880 - b, 150, 70, '#8a8a92', 12); p.ell(450, 860 - b, 70, 55, '#8a8a92', 12); p.ell(420, 800 - b, 30, 30, '#d8a0a8', 8); p.dot(520, 860 - b, 10); p.dot(470, 845 - b, 8);
  for (const x of [240, 360]) p.stroke([[x, 930], [x + 20 * Math.sin(ph * 6.28), 975]], 10, '#d8a0a0'); };
const bug = (p, kind, t = 0) => { const g = p.g;
  if (kind === 'mosq') { p.ell(300, 500, 70, 24, '#4a4048', 8); p.ell(380, 490, 26, 22, '#4a4048', 8); p.stroke([[400, 495], [470, 520]], 6, INK); g.save(); g.globalAlpha = 0.6;
    p.ell(280, 440 - 30 * Math.sin(t * 40), 60, 22, '#d8f0ff', 5); g.restore(); for (let i = 0; i < 3; i++) p.stroke([[260 + i * 30, 520], [230 + i * 40, 600]], 5, INK); }
  if (kind === 'wasp') { p.ell(300, 500, 90, 50, '#f2c230', 9); for (let i = 0; i < 3; i++) p.stroke([[250 + i * 40, 460], [250 + i * 40, 540]], 14, INK); p.ell(400, 490, 40, 36, '#f2c230', 8);
    p.poly([[200, 500], [160, 510], [200, 520]], INK, 4); g.save(); g.globalAlpha = 0.6; p.ell(300, 420, 70, 30, '#e0f4ff', 5); g.restore(); if (t > 0) { p.stroke([[385, 470], [405, 490]], 6, INK); p.stroke([[405, 470], [385, 490]], 6, INK); } }
  if (kind === 'cater') { for (let i = 0; i < 7; i++) p.ell(140 + i * 50, 520 + 18 * Math.sin(i * 0.9 + t * 8), 34, 34, i % 2 ? '#8ac040' : '#6aa030', 7); p.dot(470, 505 + 18 * Math.sin(6 * 0.9 + t * 8), 6); }
  if (kind === 'gecko') { p.stroke([[100, 520], [180, 500], [260, 510], [360, 500], [430, 505]], 40, '#7ab84a'); p.ell(470, 505, 44, 30, '#7ab84a', 8); p.dot(480, 495, 8);
    for (const [x, s] of [[220, 1], [340, -1]]) for (const d of [-1, 1]) p.stroke([[x, 505], [x + 20 * s, 505 + d * 50]], 12, '#6aa040');
    if (t > 0) p.stroke([[510, 512], [560 + 40 * t, 520]], 6, '#e07080'); }
};

// ---------------- people ----------------
const VILL = [{ jacket: '#c8402e', pants: '#2a2a30', boots: '#5a3b2a', hat: 'hair', hair: '#1e1714', skin: '#c99067' }, { jacket: '#2f6a8a', pants: '#2a2a30', boots: '#5a3b2a', hat: 'hair', hair: '#1e1714', dress: '#d9a441', skin: '#b8805a' },
  { jacket: '#5a8a3a', pants: '#2a2a30', boots: '#5a3b2a', hat: 'hair', hair: '#2a201a', skin: '#c99067', build: 'kid' }, { jacket: '#e8d8b8', pants: '#3a3a30', boots: '#5a3b2a', hat: 'hair', hair: '#1e1714', moustache: '#1e1714', skin: '#b8805a' }];
const WORKER = { jacket: '#f2f0e8', pants: '#e8e4d8', boots: '#3a3a40', hat: 'cap', cap: '#e8e4d8', skin: '#f5c9a0' };
const LIGHT2D = -2.1;
const fo = (f, seed, o) => ({ mode: 'stand', light: LIGHT2D, seed, blink: blinkAt(f, seed), ...o });
const card = (T, key, o, opts, pos, extra = {}) => ({ key: key + JSON.stringify(opts), draw: (p) => T.bodyFront(p, o, opts), x: pos[0], y: pos[1], z: pos[2], ...extra });
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1] - 1.07 * s, z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
const crit = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, ...extra });
const inFront = (c, d, ux, uy) => {
  const V = K.THREE.Vector3, p = new V(...c.pos), dir = new V(...c.look).sub(p).normalize(), right = new V().crossVectors(dir, new V(0, 1, 0)).normalize(), up = new V().crossVectors(right, dir);
  const h = d * Math.tan(c.fov * Math.PI / 360); return p.addScaledVector(dir, d).addScaledVector(right, ux * h).addScaledVector(up, uy * h).toArray();
};
const wordCard = (f, f0, txt, c, col = '#f6c83a', dur = 1e9, size = 170, uy = 0.42) => { if (f < f0 - 1 || f > f0 + dur) return null; const t = q(Math.min(1, (f - f0 + 1) / 12));
  const r = Math.min(1, 400 / (0.7 * size * txt.length)), fs = size * r, s = Math.min(2.5, 1.25 / r);
  return FX('w' + txt + t, (p) => PR.word(p, txt, t, col, fs), inFront(c, 7, 0, uy), s, { order: 9 }); };

function actorsAt(f, T) {
  const S = shotAt(f), out = [];
  const crowd = (exprs, z = 6.5) => VILL.forEach((o, i) => out.push(card(T, 'v' + i, o, fo(f, 10 + i, { expr: exprs[i % exprs.length], look: q(0.3 * Math.sin(f * 0.03 + i), 1), tilt: q(idle(f, i).tilt, 1) }), [-2.4 + i * 1.6, 0, z + (i % 2) * 0.6])));
  switch (S.id) {
    case 'hook': crowd(['shock', 'grin', 'laugh', 'shock'], 13); break;
    case 'mosq': crowd(['nervous', 'pained', 'nervous', 'pained']); break;
    case 'spray': out.push(card(T, 'wk', WORKER, fo(f, 20, { expr: 'stern', look: -0.4 }), [0.6, 0, 4.6])); break;
    case 'roof': crowd(f > F_CAVED - 2 ? ['shock', 'shock', 'pained', 'shock'] : ['neutral', 'smile', 'neutral', 'neutral'], 8); break;
    case 'catx': out.push(crit('cx' + (f > F_CDIED - 30), (p) => cat(p, 'sit', 0, f > F_CATS2 + 14 ? 'dead' : 'happy'), [0.3, 2.3, 3.4], 0.5)); break;
    case 'rats': for (let i = 0; i < 14; i++) { const ph = q(((f * 0.12 + i * 0.37) % 1), 1), x = -8 + ((i * 2.3 + (f - S.a) * 0.06 * (i % 3 + 1)) % 16), z = 6.5 + (i % 4) * 1.3;
      out.push(crit('rt' + ph, (p) => rat(p, ph), [x, 0, z], 0.6, { flip: i % 2 === 0 })); } crowd(['shock', 'pained', 'shock', 'nervous'], 4.4); break;
    case 'name': { crowd(['laugh', 'grin', 'laugh', 'grin'], 12); [[-6, 9], [2, 7], [8, 11], [-2, 12]].forEach(([x, z], i) => { const ph = q(((f * 0.05 + i * 0.3) % 1), 1);
      out.push(crit('ct' + i + ph, (p) => cat(p, 'walk', ph), [x + 0.6 + (f - S.a) * 0.02, 0, z + 0.6], 0.55, { flip: i % 2 === 1 })); }); break; }
  }
  return out;
}

function fxAt(f, T, cam) {
  const S = shotAt(f), out = [], push = (x) => x && out.push(x);
  const peek = (c) => { const p = c.position; out.push(crit('pk', (pp) => cat(pp, 'sit'), [p.x, p.y + 0.6, p.z], 0.5, { order: 3 })); };
  if (S.id === 'hook' || S.id === 'loop') { const p = crates[0].position; out.push(crit('hero', (pp) => cat(pp, 'sit'), [p.x, p.y + 0.55, p.z + 0.1], 0.9, { order: 3 })); crates.slice(1, 3).forEach(peek); }
  if (S.id === 'hook') { push(wordCard(f, F_1960, '1960', cam, '#f6c83a', F_CATS - F_1960 - 6, 170, 0.5)); push(wordCard(f, F_CATS, 'CATS?!', cam, '#ffffff', 1e9, 190, 0.5)); }
  if (S.id === 'mosq') { for (let i = 0; i < 6; i++) { const t = f / 30 + i; out.push(FX('mq' + i + (f % 2), (p) => bug(p, 'mosq', t), [-1.5 + 1.3 * Math.sin(t * 1.3 + i) + i * 0.5, 3.6 + 0.6 * Math.sin(t * 2.1 + i * 2), 8 + (i % 3)], 0.35)); }
    push(wordCard(f, F_MAL, 'MALARIA', cam, '#e8503a', 1e9, 170, 0.55)); }
  if (S.id === 'spray' && f > F_SPRAY - 4) { for (let i = 0; i < 6; i++) { const t = q(((f - F_SPRAY) / 20 + i / 6) % 1, 1); out.push(FX('mist' + i + t, (p) => { p.g.translate(150, 500); p.g.scale(2, 2); T.fxPuff(p, t); }, [-0.4 - t * 2.6, 3.4 + (i % 3) * 0.3, 3.4], 1.2 + t * 1.6, { alpha: 0.85 })); }
    push(wordCard(f, F_DDT, 'DDT', cam, '#ffffff', 1e9, 220, 0.55)); }
  if (S.id === 'wasps') { const fall = (t0) => Math.max(0, (f - t0) * 0.06); for (let i = 0; i < 4; i++) out.push(FX('md' + i + (f > F_DIED), (p) => bug(p, 'mosq', f > F_DIED ? 0 : f / 30), [-1.2 + i * 0.8, 4.2 - Math.min(2.6, fall(F_DIED + i * 3)), 6.5], 0.35));
    out.push(FX('wsp' + (f > F_WASP), (p) => bug(p, 'wasp', f > F_WASP ? 1 : 0), [0.3, 4.6 - Math.min(2.9, fall(F_WASP)), 7.0], 0.55, { roll: f > F_WASP ? 3.1 : 0 }));
    if (f > F_CAT - 4) out.push(FX('ctp' + q((f % 20) / 20, 1), (p) => bug(p, 'cater', f / 30), [0.6, 1.9, 7.2], 0.5)); }
  if (S.id === 'roof') { for (let i = 0; i < 4; i++) out.push(FX('cr' + i + q((f % 20) / 20, 1), (p) => bug(p, 'cater', f / 30 + i), [-3.5 + i * 2.2, 5.6 - (f > F_CAVED ? 1.8 : 0), 2.4], 0.5));
    if (f > F_CAVED) for (let i = 0; i < 4; i++) { const t = q(Math.min(1, (f - F_CAVED) / 30 + i * 0.05), 2); if (t < 1) out.push(FX('rd' + i + t, (p) => { p.g.translate(150, 500); p.g.scale(2, 2); T.fxPuff(p, t); }, [-3 + i * 2, 4.5, 2.5], 3 + t * 2)); }
    push(wordCard(f, F_CAVED, 'CRUNCH!', cam, '#ffffff', 1e9, 190, 0.55)); }
  if (S.id === 'chain') { out.push(FX('gk' + (f > F_LIZ + 10) + q((f % 10) / 10, 1), (p) => bug(p, 'gecko', f > F_LIZ + 10 ? (f % 10) / 10 : 0), [0, 3.4, 2.75], 0.6));
    if (f < F_LIZ + 14) out.push(FX('bb' + (f % 2), (p) => bug(p, 'mosq', f / 30), [0.55, 3.55, 2.8], 0.25)); push(wordCard(f, F_WORSE, 'WORSE', cam, '#e8503a', 1e9, 190, 0.55)); }
  if (S.id === 'catx') push(wordCard(f, F_CATS2, 'CAT ATE LIZARD', cam, '#ffffff', 1e9, 150, 0.55));
  if (S.id === 'rats') push(wordCard(f, F_RATS, 'RATS!', cam, '#e8503a', 1e9, 200, 0.08));
  if (S.id === 'plane') push(wordCard(f, F_RAF, 'RAF', cam, '#ffffff', 1e9, 220, 0.4));
  if (S.id === 'drop') push(wordCard(f, F_CHUTE, 'CAT DELIVERY', cam, '#f6c83a', 1e9, 170, 0.55));
  if (S.id === 'name') push(wordCard(f, F_OP, 'OPERATION CAT DROP', cam, '#f6c83a', 1e9, 150, 0.5));
  return out;
}

// ---------------- cameras ----------------
const CAMS = {
  hook: [{ f: 0, pos: [0.5, 1.2, 22], look: [0, 14, -6], fov: 54 }, { f: F_PARA, pos: [0.5, 1.6, 20], look: [0, 11, -4], fov: 52 }, { f: cut(1), pos: [0.5, 2.0, 19], look: [0, 9, -4], fov: 50 }],
  mosq: [{ f: cut(1), pos: [0, 2.4, 16], look: [0, 3.0, 5], fov: 46 }, { f: F_MAL - 4, pos: [0, 2.2, 13.5], look: [0, 2.6, 5], fov: 42 }],
  spray: [{ f: cut(2), pos: [2.6, 2.2, 10], look: [-0.5, 2.6, 3], fov: 46 }, { f: F_DDT - 4, pos: [2.0, 2.4, 8.4], look: [-0.6, 2.9, 3], fov: 42 }],
  wasps: [{ f: cut(3), pos: [0, 3.6, 12.5], look: [0, 3.4, 6.5], fov: 44 }, { f: F_CAT - 6, pos: [0.4, 2.6, 11], look: [0.4, 2.3, 7], fov: 40 }],
  roof: [{ f: cut(4), pos: [0, 7.5, 14], look: [0, 5.6, 0], fov: 48 }, { f: F_CAVED - 6, pos: [0, 6.5, 17], look: [0, 4.4, 0], fov: 50 }, { f: cut(5), pos: [0, 5.5, 20], look: [0, 3.8, 0], fov: 50 }],
  chain: [{ f: cut(5), pos: [0.1, 3.5, 6.2], look: [0.1, 3.5, 2.6], fov: 46 }, { f: F_LIZ + 8, pos: [0.15, 3.5, 5.2], look: [0.15, 3.45, 2.6], fov: 42 }],
  catx: [{ f: F_CATS2 - 4, pos: [0.3, 2.9, 6.6], look: [0.3, 2.85, 3.4], fov: 44 }, { f: cut(6), pos: [0.3, 2.9, 5.8], look: [0.3, 2.8, 3.4], fov: 42 }],
  rats: [{ f: cut(6), pos: [0, 1.3, 17], look: [0, 0.9, 6], fov: 46 }, { f: F_RATS, pos: [0.4, 1.0, 15], look: [0, 0.8, 6], fov: 44 }],
  plane: [{ f: cut(7), pos: [-20, 30, 22], look: [-40, 42, -8], fov: 46 }, { f: F_CRATES, pos: [-12, 32, 18], look: [-28, 41, -8], fov: 44 }, { f: F_DROP - 4, pos: [-6, 33, 16], look: [-18, 40, -8], fov: 44 }],
  drop: [{ f: F_DROP - 4, pos: [0.5, 1.6, 24], look: [0, 16, 4], fov: 54 }, { f: cut(8), pos: [0.5, 1.8, 22], look: [0, 4, 6], fov: 52 }],
  name: [{ f: cut(8), pos: [0, 1.4, 21], look: [0, 1.4, 9], fov: 46 }, { f: F_OP, pos: [0, 1.5, 19], look: [0, 1.6, 9], fov: 44 }],
  loop: [{ f: F_DROP2 + 4, pos: [0.5, 1.2, 22.5], look: [0, 14.5, -6], fov: 55 }, { f: TOTAL - 1, pos: [0.5, 1.2, 22], look: [0, 14, -6], fov: 54 }],
};
const KICKS = [{ f: F_CATS, a: 0.03 }, { f: F_CAVED, a: 0.06 }, { f: F_RATS, a: 0.03 }];
const camAt = (f) => {
  const S = shotAt(f); const c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS });
  if (S.id === 'plane') { const dx = plane.position.x; c.pos[0] += dx + 40; c.look[0] += dx + 40; }
  c.shadowAt = S.id === 'plane' ? plane.position.toArray() : [0, 0, 5];
  return c;
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => {
  const S = shotAt(f);
  if (S.id === 'chain') return { focus: dist(Cm.pos, [0, 3.4, 2.75]), cinf: 10 };
  if (S.id === 'catx') return { focus: dist(Cm.pos, [0.3, 2.9, 3.4]), cinf: 10 };
  if (S.id === 'spray') return { focus: dist(Cm.pos, [0.6, 2.0, 4.6]), cinf: 8 };
  return { focus: 10, cinf: 0 };
};

export default {
  TOTAL, build,
  frame(f, k) {
    poseWorld(f);
    const S = shotAt(f), cam = camAt(f);
    const light = ['roof', 'chain', 'catx', 'rats'].includes(S.id) ? { ...GLOOM } : { ...DAY };
    if (S.id === 'plane') light.shadowExt = 40;
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
  },
};
