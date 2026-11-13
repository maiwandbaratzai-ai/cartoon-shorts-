// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The Pig War" — San Juan Island, 15 Jun 1859 – 1872. Timed via pigwar_timing.js.
import { TOTAL, LINES, wf } from './pigwar_timing.js';
import * as PR from '../props.js';
import { INK } from '../toon.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const F_1859 = wf(0, '1859'), F_WAR = wf(0, 'war'), F_PIG = wf(0, 'pig'), F_ISL = wf(1, 'island'), F_CLAIM = wf(1, 'claimed'), F_PIG2 = wf(2, 'pig'), F_POT = wf(2, 'potato'),
  F_SHOT = wf(3, 'shot'), F_TEN = wf(4, 'ten'), F_HUND = wf(4, 'hundred'), F_ARMY = wf(5, 'army'), F_64 = wf(5, '64'), F_BRIT = wf(5, 'britain'), F_SHIPS = wf(5, 'warships'),
  F_WORSE = wf(6, 'worse'), F_461 = wf(6, '461'), F_2000 = wf(6, '2000'), F_ADM = wf(7, 'admiral'), F_REF = wf(7, 'refused'), F_GREAT = wf(8, 'great'), F_SQ = wf(8, 'squabble'),
  F_12 = wf(9, '12'), F_CAS = wf(9, 'casualty'), F_PIG3 = wf(9, 'pig');
const SHOTS = [['hook', 0], ['island', cut(1)], ['munch', cut(2)], ['shot', cut(3)], ['offer', cut(4)], ['demand', F_HUND - 18], ['army', cut(5)], ['ships', F_BRIT - 4],
  ['worse', cut(6)], ['troops', F_2000 - 4], ['admiral', cut(7)], ['quote', cut(8)], ['years', cut(9)], ['angel', F_CAS - 4]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const DAY = { az: 150, el: 40, sky: '#d8e8f8', ground: '#8a9a68', hemi: 1.15, sun: '#fff2dc', sunI: 2.5, fog: '#d4e4f0', fogNear: 160, fogFar: 1100,
  skyTop: '#3d82d4', skyHor: '#dfeaf4', sat: 1.12, vig: 0.2, shadowExt: 22 };
const DUSK = { ...DAY, az: 20, el: 14, sun: '#ffd0a0', sky: '#ffd8b8', skyTop: '#4a5ab8', skyHor: '#ffc8a0', fog: '#f0c8b0', sat: 1.12, vig: 0.28 };
const SHORE = -24, CAMP = [-30, 0, -6];
let K, sea, ships = [], usFlag, ukFlag;
const rnd = (() => { let s = 31; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
const land = (x, z) => { const shore = SHORE + 6 * Math.sin(x * 0.02); const d = z - shore; let h = d > 0 ? Math.min(1.2, d * 0.15) : d * 0.3;
  h += 6 * Math.exp(-((x - CAMP[0]) ** 2 + (z - CAMP[2]) ** 2) / 300) + (z > 30 ? (z - 30) * 0.4 : 0) + 0.4 * Math.sin(x * 0.1) * Math.sin(z * 0.13) * clamp(d / 10);
  if (Math.abs(x) < 9 && Math.abs(z) < 9) h = 1.2; return h; };
const LY = 1.2; // farm plateau height

const warship = (scale = 1) => {
  const { THREE } = K, g = K.group(), hull = K.group(g);
  const geo = new THREE.BoxGeometry(30, 7, 8, 20, 4, 4), P = geo.attributes.position;
  for (let i = 0; i < P.count; i++) { const x = P.getX(i), y = P.getY(i), z = P.getZ(i), ax = Math.abs(x) / 15; let w = x > 0 ? 1 - ax ** 2 * 0.8 : 1 - ax ** 4 * 0.35; w *= 0.55 + 0.45 * clamp((y + 3.5) / 7) ** 0.5; P.setXYZ(i, x, y + 0.004 * x * x * (y > 0 ? 1 : 0.3), z * w); }
  geo.computeVertexNormals();
  const tex = PR.canvasTex(512, 128, (c) => { c.fillStyle = '#2a2a30'; c.fillRect(0, 0, 512, 128); c.fillStyle = '#e8d8a8'; c.fillRect(0, 44, 512, 26); c.fillStyle = '#2a2a30'; for (let i = 0; i < 14; i++) c.fillRect(14 + i * 36, 48, 16, 18); c.fillStyle = '#8a5a34'; c.fillRect(0, 100, 512, 28); });
  K.add(geo, K.toon({ map: tex }), 0, 2, 0, hull);
  K.slab(-14, 12, 5.3, 5.6, -3.6, 3.6, K.col('#b08a5e'), hull);
  const wood = K.col('#6a4a30'), sail = K.toon({ color: '#f4eedc', side: THREE.DoubleSide });
  [[8, 24], [-1, 28], [-10, 22]].forEach(([x, h]) => { K.cyl(0.3, 0.42, h, wood, x, 5.5, 0, hull);
    for (let k = 0; k < 2; k++) { const y = 5.5 + h * (0.42 + k * 0.3), w = 9 - k * 2.5; const yd = K.add(new THREE.CylinderGeometry(0.13, 0.13, w, 6), wood, x, y, 0, hull); yd.rotation.x = Math.PI / 2;
      const sg = new THREE.PlaneGeometry(w * 0.92, h * 0.26, 6, 3), sp = sg.attributes.position; for (let j = 0; j < sp.count; j++) { const u = sp.getX(j) / (w * 0.46); sp.setZ(j, 1.0 * (1 - u * u)); }
      sg.computeVertexNormals(); const s = K.add(sg, sail, x + 0.5, y - h * 0.13, 0, hull); s.rotation.y = Math.PI / 2; s.castShadow = false; } });
  const ens = PR.canvasTex(128, 64, (c) => { c.fillStyle = '#c8302a'; c.fillRect(0, 0, 128, 64); c.fillStyle = '#ffffff'; c.fillRect(0, 0, 56, 28); c.fillStyle = '#2a3f8a'; c.fillRect(3, 3, 50, 22); c.fillStyle = '#ffffff'; c.fillRect(24, 3, 8, 22); c.fillRect(3, 11, 50, 6); c.fillStyle = '#c8302a'; c.fillRect(26, 3, 4, 22); c.fillRect(3, 13, 50, 2); });
  K.add(new THREE.PlaneGeometry(4, 2), new THREE.MeshBasicMaterial({ map: ens, side: THREE.DoubleSide }), -15.5, 9.5, 0, hull);
  K.beam(K.V(-14.8, 5.5, 0), K.V(-15.2, 10.5, 0), 0.1, wood, hull);
  g.scale.setScalar(scale); return g;
};

function build(k) {
  K = k; const { THREE } = K;
  K.addClouds(12, 800, 160);
  sea = PR.ocean(K, { y: 0, shoreZ: SHORE + 4, deep: '#2a6a8a', shal: '#4a9ab0', foam: '#eef6f8' });
  PR.terrain(K, 700, 240, land, K.toon({ map: PR.speckTex('#7fae4c', ['#72a044', '#8cbc58', '#6a9840'], 8, 2600, 70) }));
  // far mountains across the strait
  for (let i = 0; i < 7; i++) K.add(new THREE.ConeGeometry(70 + i * 10, 60 + (i % 3) * 25, 7), K.col(i % 2 ? '#7a8ca8' : '#8698b2'), -350 + i * 120, 20, -520 - (i % 2) * 60, K.scene, { cast: false });
  // firs (merged)
  const M4 = THREE.Matrix4, mats = [];
  for (let i = 0; i < 420; i++) { const x = (rnd() - 0.5) * 300, z = -10 + rnd() * 120; if (Math.hypot(x, z) < 22 || Math.hypot(x - CAMP[0], z - CAMP[2]) < 18) continue; const s = 0.9 + rnd() * 0.8; mats.push(new M4().makeTranslation(x, land(x, z), z).multiply(new M4().makeScale(s, s * 1.3, s))); }
  const tiers = []; for (const m of mats) for (let t = 0; t < 3; t++) tiers.push(m.clone().multiply(new M4().makeTranslation(0, 1.8 + t * 1.4, 0)).multiply(new M4().makeScale(1 - t * 0.25, 1, 1 - t * 0.25)));
  const fir = K.add(PR.mergeCopies(new THREE.ConeGeometry(1.7, 3, 8), tiers), K.col('#2f6a3a'), 0, 0, 0); fir.frustumCulled = false;
  // potato patch: ridges with leafy tufts
  const dirt = K.col('#7a5434'), leafM = K.col('#4f8a2e'), tuftMats = [];
  for (let r = 0; r < 7; r++) { const z = -4.5 + r * 1.5; K.add(new THREE.CylinderGeometry(0.35, 0.35, 10, 8), dirt, 1, LY + 0.05, z).rotation.z = Math.PI / 2;
    for (let i = 0; i < 9; i++) tuftMats.push(new M4().makeTranslation(-3 + i * 1.1 + (r % 2) * 0.5, LY + 0.35, z)); }
  K.add(PR.mergeCopies(new THREE.IcosahedronGeometry(0.26, 1), tuftMats), leafM, 0, 0, 0);
  // rail fence around the patch
  const rail = K.col('#9a7450');
  for (let x = -5; x <= 7; x += 2) for (const z of [-6, 6]) K.slab(x - 0.07, x + 0.07, LY, LY + 1.1, z - 0.07, z + 0.07, rail);
  for (const z of [-6, 6]) for (const y of [0.45, 0.9]) K.slab(-5, 7, LY + y, LY + y + 0.1, z - 0.04, z + 0.04, rail);
  // Cutlar's log cabin
  const cab = K.group(); cab.position.set(-11, LY, 2);
  const logs = PR.canvasTex(256, 256, (c) => { c.fillStyle = '#8a5a34'; c.fillRect(0, 0, 256, 256); for (let y = 0; y < 256; y += 32) { c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(0, y, 256, 5); c.fillStyle = 'rgba(255,255,255,.08)'; c.fillRect(0, y + 8, 256, 6); } }, [2, 1]);
  K.slab(-3, 3, 0, 3, -2.5, 2.5, K.toon({ map: logs }), cab); const rf = K.add(new THREE.CylinderGeometry(0.1, 4.6, 2.4, 4, 1), K.col('#5a4a3e'), 0, 4.2, 0, cab); rf.rotation.y = Math.PI / 4; rf.scale.set(1, 1, 0.8);
  K.slab(-0.6, 0.6, 0, 2, 2.5, 2.56, K.col('#5a3a24'), cab); K.slab(1.4, 2.4, 1.2, 2.0, 2.5, 2.56, K.col('#9fd0e8'), cab); K.cyl(0.35, 0.4, 2, K.col('#8a8070'), 2, 3, -1, cab);
  // American camp on the hill: tents, earthworks, cannons, flag
  const ch = land(CAMP[0], CAMP[2]), tent = K.col('#efe8d6'), iron = K.col('#3a3a40'), wheelM = K.col('#6a4a30');
  for (let i = 0; i < 6; i++) { const t = K.add(new THREE.ConeGeometry(1.6, 2.4, 4), tent, CAMP[0] - 8 + (i % 3) * 3.4, ch + 1.0, CAMP[2] + 4 + Math.floor(i / 3) * 3.4); t.rotation.y = Math.PI / 4; }
  K.slab(CAMP[0] - 12, CAMP[0] + 12, ch - 0.5, ch + 0.9, CAMP[2] - 6.5, CAMP[2] - 5, K.col('#8a6a48'));
  for (let i = 0; i < 7; i++) { const x = CAMP[0] - 10.5 + i * 3.5, g = K.group(); g.position.set(x, ch, CAMP[2] - 4.4); g.rotation.y = -0.2;
    const b = K.add(new THREE.CylinderGeometry(0.16, 0.24, 2.4, 12), iron, 0, 0.9, -0.6, g); b.rotation.x = Math.PI / 2 - 0.12;
    for (const s of [-1, 1]) { const w = K.add(new THREE.CylinderGeometry(0.55, 0.55, 0.1, 14), wheelM, s * 0.45, 0.55, 0, g); w.rotation.z = Math.PI / 2; } K.slab(-0.3, 0.3, 0.4, 0.7, 0, 1.6, wheelM, g); }
  const flagMat = (draw) => new THREE.MeshBasicMaterial({ map: PR.canvasTex(192, 112, draw), side: THREE.DoubleSide });
  K.cyl(0.08, 0.1, 9, K.col('#e8e0d0'), CAMP[0], ch, CAMP[2] + 1);
  usFlag = K.add(new THREE.PlaneGeometry(3, 1.75, 8, 1), flagMat((c) => { for (let i = 0; i < 13; i++) { c.fillStyle = i % 2 ? '#ffffff' : '#b8302a'; c.fillRect(0, i * 112 / 13, 192, 112 / 13 + 1); } c.fillStyle = '#2a3a7a'; c.fillRect(0, 0, 84, 60);
    c.fillStyle = '#fff'; for (let i = 0; i < 20; i++) c.fillRect(6 + (i % 5) * 16, 6 + Math.floor(i / 5) * 13, 5, 5); }), CAMP[0] + 1.5, ch + 8, CAMP[2] + 1);
  // British side: a flagstaff on the far point
  K.cyl(0.08, 0.1, 9, K.col('#e8e0d0'), 30, land(30, -12), -12);
  ukFlag = K.add(new THREE.PlaneGeometry(3, 1.6, 8, 1), flagMat((c) => { c.fillStyle = '#2a3f8a'; c.fillRect(0, 0, 192, 112); c.strokeStyle = '#ffffff'; c.lineWidth = 22; c.beginPath(); c.moveTo(0, 0); c.lineTo(192, 112); c.moveTo(192, 0); c.lineTo(0, 112); c.stroke();
    c.strokeStyle = '#c8302a'; c.lineWidth = 8; c.stroke(); c.fillStyle = '#ffffff'; c.fillRect(80, 0, 32, 112); c.fillRect(0, 40, 192, 32); c.fillStyle = '#c8302a'; c.fillRect(86, 0, 20, 112); c.fillRect(0, 46, 192, 20); }), 31.5, land(30, -12) + 8, -12);
  // British warships in the bay
  for (let i = 0; i < 5; i++) { const s = warship(1); ships.push(s); }
}

// ---------------- world state ----------------
const SHIPPOS = [[-30, -110, 0.15], [20, -95, -0.2], [70, -120, 0.1], [-80, -130, 0.25], [120, -140, -0.1]];
function poseWorld(f) {
  const id = shotAt(f).id, t = f / 30; sea.U.t.value = t;
  const n = ['hook', 'worse', 'troops', 'years', 'angel', 'quote', 'admiral'].includes(id) ? 5 : id === 'ships' ? 3 : 0;
  ships.forEach((s, i) => { const p = SHIPPOS[i]; s.visible = i < n; let x = p[0]; if (id === 'ships') x = p[0] + 60 - 60 * M.easeOut(ramp(f, F_BRIT - 10, F_SHIPS + 20));
    s.position.set(x, -0.6 + 0.15 * Math.sin(t * 1.2 + i), p[1]); s.rotation.set(0.02 * Math.sin(t + i), p[2] + Math.PI, 0.03 * Math.sin(t * 0.8 + i)); });
  const wave = (m, k) => { const P = m.geometry.attributes.position; for (let i = 0; i < P.count; i++) { const x = P.getX(i); P.setZ(i, 0.18 * Math.sin(x * 2.2 - t * 6 + k) * (x + 1.5)); } P.needsUpdate = true; };
  wave(usFlag, 0); wave(ukFlag, 2);
}

// ---------------- characters ----------------
const pig = (p, phase = 0, mode = 'walk', angel = false) => {
  const TAU = Math.PI * 2, walk = mode === 'walk', eat = mode === 'eat', bob = walk ? 6 * Math.abs(Math.sin(phase * TAU)) : 0, pink = '#f2a8b0', dk = '#d8848e';
  if (angel) { for (const s of [-1, 1]) p.poly([[300, 600], [300 + s * 60, 470], [300 + s * 200, 430], [300 + s * 170, 520], [300 + s * 210, 560], [300 + s * 120, 640]], '#ffffff', 9); }
  for (const [x, s, c] of [[200, 1, dk], [380, -1, dk], [225, -1, pink], [405, 1, pink]]) { const a = walk ? s * 0.45 * Math.sin(phase * TAU) : 0; p.line([[x, 760 - bob], [x + 50 * Math.sin(a), 960]], c, 30); p.ell(x + 50 * Math.sin(a), 962, 20, 12, '#5a3a3a', 5); }
  p.ell(300, 690 - bob, 175, 115, pink, 12);
  p.stroke([[128, 660 - bob], [100, 640 - bob], [92, 670 - bob], [112, 680 - bob], [104, 650 - bob]], 8, INK);
  const hx = eat ? 470 : 465, hy = (eat ? 780 : 640) - bob;
  p.poly([[hx - 40, hy - 70], [hx - 10, hy - 125], [hx + 10, hy - 60]], dk, 9); p.ell(hx, hy, 85, 75, pink, 12); p.poly([[hx + 10, hy - 70], [hx + 50, hy - 120], [hx + 50, hy - 50]], dk, 9);
  p.ell(hx + 70, hy + 15, 34, 30, dk, 9); p.dot(hx + 62, hy + 10, 6); p.dot(hx + 80, hy + 10, 6);
  p.ell(hx + 10, hy - 22, 14, 16, '#ffffff', 5); p.dot(hx + 14, hy - 20, 7);
  if (eat) { p.ell(hx + 60, hy + 55, 22, 16, '#c8a060', 6); p.ell(hx + 92, hy + 48, 12, 10, '#5a8a2e', 4); }
  if (angel) { const h = Array.from({ length: 33 }, (_, i) => [hx + 80 * Math.cos(i / 32 * TAU), hy - 150 + 20 * Math.sin(i / 32 * TAU)]); p.stroke(h, 18, INK); p.stroke(h, 10, '#f6d040'); }
};
const CUTLAR = { jacket: '#8a5a34', pants: '#4a4f62', boots: '#3a2a20', hat: 'hair', hair: '#6a4a30', moustache: '#6a4a30', rifle: true, skin: '#f5c9a0' };
const AGENT = { jacket: '#b8302a', pants: '#e9e6da', boots: '#2a2420', hat: 'tophat', moustache: '#d9d0c0', buttons: '#e8c45a', build: 'stout' };
const BLUE = (v) => ({ jacket: '#2f4a8a', pants: '#6a88b8', boots: '#2a2420', hat: 'cap', cap: '#2a3a6a', belt: '#e8e0d0', buttons: '#e8c45a', rifle: true, skin: ['#ffe2c2', '#f5c9a0', '#ecd0b6', '#c99067'][v % 4] });
const ADMIRAL = { jacket: '#1f2a4a', pants: '#e9e6da', boots: '#2a2420', hat: 'tophat', moustache: '#e8e4dc', sash: '#e8c45a', buttons: '#e8c45a', build: 'stout', skin: '#f5c9a0' };
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
const pigCard = (x, z, f, mode, s = 0.75, flip = false, angel = false, y = null) => { const ph = mode === 'walk' ? q((f * 0.06) % 1, 1) : 0, chew = mode === 'eat' ? q(Math.sin(f * 0.5), 0) : 0;
  return { key: 'pig' + mode + ph + chew + angel, draw: (p) => { if (chew) p.g.translate(0, 6); pig(p, ph, mode, angel); }, x, y: y ?? LY, z, s, flip, blob: !angel, shadow: !angel }; };

function actorsAt(f, T) {
  const S = shotAt(f), out = [];
  switch (S.id) {
    case 'hook': out.push(pigCard(1.1, 0.75, f, 'eat', 0.8)); break;
    case 'munch': { const x = lerp(-6, 0.5, M.smooth(ramp(f, cut(2), F_POT))); out.push(pigCard(x, 0.75, f, f < F_POT ? 'walk' : 'eat', 0.8)); break; }
    case 'shot': out.push(card(T, 'cut', CUTLAR, fo(f, 5, { expr: f > F_SHOT - 6 ? 'stern' : 'shock', look: 0.5 }), [-4.5, LY, 4.5])); break;
    case 'offer': out.push(card(T, 'cut2', { ...CUTLAR, rifle: false }, fo(f, 5, { expr: 'nervous', look: 0.5, wave: q(Math.sin(f * 0.3), 1) }), [-0.9, LY, 6.4]));
      out.push(card(T, 'ag', AGENT, fo(f, 6, { expr: 'stern', look: -0.5 }), [0.9, LY, 6.0])); break;
    case 'demand': out.push(card(T, 'ag2', AGENT, fo(f, 6, { expr: f > F_HUND ? 'shock' : 'stern', look: 0, tilt: q(idle(f, 4).tilt, 1) }), [0, LY, 6.0])); break;
    case 'army': for (let i = 0; i < 12; i++) { const x = CAMP[0] - 12 + i * 1.6, z = CAMP[2] + 10 + (i % 2) * 1.2;
      out.push(card(T, 'us' + i, BLUE(i), fo(f, 10 + i, { side: true, mode: 'march', phase: q(((f * 0.034 + i * 0.3) % 1), 1), expr: 'stern' }), [x + (f - S.a) * 0.03, land(x, z), z])); } break;
    case 'worse': for (let i = 0; i < 8; i++) { const x = CAMP[0] - 9 + i * 2.6, z = CAMP[2] - 3.2;
      out.push(card(T, 'dg' + i, BLUE(i), fo(f, 30 + i, { expr: i % 3 ? 'stern' : 'nervous', look: q(0.2 * Math.sin(f * 0.04 + i), 1) }), [x, land(x, z), z])); } break;
    case 'admiral': case 'quote': out.push(card(T, 'adm', ADMIRAL, fo(f, 50, { expr: S.id === 'admiral' ? (f > F_REF ? 'stubborn' : 'stern') : f > F_SQ ? 'smile' : 'stern', headTilt: S.id === 'admiral' && f > F_REF ? q(8 * Math.sin((f - F_REF) * 0.4), 1) : 0 }), [0, 0, 0], { blob: false })); break;
    case 'years': out.push(card(T, 'yr1', BLUE(1), fo(f, 60, { expr: 'dazed', look: 0.4 }), [-0.75, LY, 4.2])); out.push(card(T, 'yr2', { ...AGENT, hat: 'tophat' }, fo(f, 61, { expr: 'dazed', look: -0.4 }), [0.75, LY, 4.2])); break;
    case 'angel': out.push(pigCard(1.1, 0.75, f, 'stand', 0.8, false, true, LY + 0.6 + 0.15 * Math.sin(f * 0.12) + (f - S.a) * 0.006)); break;
  }
  return out;
}

function fxAt(f, T, cam) {
  const S = shotAt(f), out = [], push = (x) => x && out.push(x);
  if (S.id === 'hook') { push(wordCard(f, F_1859, '1859', cam, '#f6c83a', F_PIG - F_1859 - 6)); push(wordCard(f, F_PIG, 'A PIG?!', cam, '#f2a8b0')); }
  if (S.id === 'island') push(wordCard(f, F_CLAIM, 'OURS!', cam, '#ffffff', 1e9, 170, 0.5));
  if (S.id === 'munch') push(wordCard(f, F_POT, 'MUNCH', cam, '#ffffff', 1e9, 150, 0.5));
  if (S.id === 'shot' && f >= F_SHOT - 1 && f < F_SHOT + 10) { const t = q((f - F_SHOT + 1) / 11); out.push(FX('mf' + t, (p) => { p.g.translate(50, 250); T.fxBurst(p, t, '#fff3b0', 10, 30, 200); }, [-3.4, LY + 1.6, 4.6], 1.2)); }
  if (S.id === 'shot') push(wordCard(f, F_SHOT, 'BANG!', cam, '#ffffff', 1e9, 190, 0.55));
  if (S.id === 'offer') push(wordCard(f, F_TEN, '$10', cam, '#7ad06a', 1e9, 190, 0.55));
  if (S.id === 'demand') push(wordCard(f, F_HUND, '$100!', cam, '#e8503a', 1e9, 200, 0.55));
  if (S.id === 'army') push(wordCard(f, F_64, '64 SOLDIERS', cam, '#f6c83a', 1e9, 170, 0.5));
  if (S.id === 'ships') push(wordCard(f, F_SHIPS, '3 WARSHIPS', cam, '#ffffff', 1e9, 170, 0.5));
  if (S.id === 'worse') push(wordCard(f, F_461, '461 + 14 CANNONS', cam, '#f6c83a', 1e9, 160, 0.5));
  if (S.id === 'troops') { push(wordCard(f, F_2000, '2,000 TROOPS', cam, '#e8503a', 1e9, 170, 0.5)); }
  if (S.id === 'admiral') push(wordCard(f, F_REF, 'NO.', cam, '#ffffff', 1e9, 220, 0.55));
  if (S.id === 'quote') push(wordCard(f, F_SQ, 'A PIG.', cam, '#f2a8b0', 1e9, 210, 0.55));
  if (S.id === 'years') push(wordCard(f, F_12, '12 YEARS', cam, '#f6c83a', 1e9, 180, 0.55));
  if (S.id === 'angel') push(wordCard(f, F_CAS + 2, 'RIP', cam, '#ffffff', F_PIG3 - F_CAS - 6, 200, 0.55));
  return out;
}

// ---------------- cameras ----------------
const C = (p, d) => [p[0] + d[0], p[1] + d[1], p[2] + d[2]];
const deckPt = () => { const s = ships[1]; s.updateMatrixWorld(); return new K.THREE.Vector3(5, 5.6, 0).applyMatrix4(s.matrixWorld).toArray(); };
const CAMS = {
  hook: [{ f: 0, pos: [1.6, LY + 1.5, 4.6], look: [-1.0, LY - 2.0, -30], fov: 46 }, { f: F_WAR, pos: [1.4, LY + 1.4, 4.1], look: [-1.0, LY - 2.5, -30], fov: 44 }, { f: cut(1), pos: [1.3, LY + 1.3, 3.8], look: [-0.2, LY + 0.2, 0], fov: 46 }],
  island: [{ f: cut(1), pos: [0, 70, 80], look: [0, 0, -10], fov: 44 }, { f: F_CLAIM, pos: [6, 45, 52], look: [0, 2, -10], fov: 44 }, { f: cut(2), pos: [8, 36, 42], look: [0, 2, -6], fov: 44 }],
  munch: [{ f: cut(2), pos: [-4.6, LY + 1.3, 4.6], look: [-5.4, LY + 0.8, 0.75], fov: 44 }, { f: F_POT, pos: [1.4, LY + 1.0, 4.4], look: [0.9, LY + 0.8, 0.75], fov: 42 }],
  shot: [{ f: cut(3), pos: [-5.5, LY + 1.6, 9.5], look: [-4.3, LY + 1.5, 4.5], fov: 44 }, { f: F_SHOT, pos: [-5.2, LY + 1.65, 8.4], look: [-4.2, LY + 1.55, 4.5], fov: 40 }],
  offer: [{ f: cut(4), pos: [0, LY + 1.6, 12.8], look: [0, LY + 1.4, 6], fov: 46 }, { f: F_HUND - 18, pos: [0, LY + 1.6, 12], look: [0, LY + 1.4, 6], fov: 44 }],
  demand: [{ f: F_HUND - 18, pos: [0, LY + 1.8, 9.2], look: [0, LY + 1.7, 6], fov: 40 }, { f: cut(5), pos: [0, LY + 1.8, 8.6], look: [0, LY + 1.75, 6], fov: 38 }],
  army: [{ f: cut(5), pos: [CAMP[0] + 1, 7.6, CAMP[2] + 17], look: [CAMP[0] - 2, 5.6, CAMP[2] + 9], fov: 48 }, { f: F_BRIT - 4, pos: [CAMP[0] + 0.5, 7.4, CAMP[2] + 16], look: [CAMP[0] - 1, 5.8, CAMP[2] + 9], fov: 46 }],
  ships: [{ f: F_BRIT - 4, pos: [10, 6, -14], look: [25, 8, -100], fov: 46 }, { f: cut(6), pos: [10, 5, -18], look: [20, 8, -100], fov: 42 }],
  worse: [{ f: cut(6), pos: [CAMP[0] + 1, 9, CAMP[2] + 8], look: [CAMP[0] + 4, 3, -100], fov: 46 }, { f: F_2000 - 4, pos: [CAMP[0] + 1, 9.5, CAMP[2] + 4], look: [CAMP[0] + 8, 2, -100], fov: 44 }],
  troops: [{ f: F_2000 - 4, pos: [8, 9, -30], look: [25, 7, -110], fov: 46 }, { f: cut(7), pos: [10, 8, -40], look: [24, 7, -110], fov: 42 }],
  admiral: [{ f: cut(7), pos: [0, 1.6, 6], look: [0, 1.45, 0], fov: 44 }, { f: cut(8), pos: [0, 1.65, 4.4], look: [0, 1.55, 0], fov: 42 }],
  quote: [{ f: cut(8), pos: [2.6, 1.4, 5.2], look: [-0.2, 1.7, 0], fov: 46 }, { f: F_GREAT, pos: [2.0, 1.5, 4.2], look: [-0.2, 1.75, 0], fov: 44 }, { f: cut(9), pos: [1.0, 1.7, 3.0], look: [0, 1.75, 0], fov: 40 }],
  years: [{ f: cut(9), pos: [0, LY + 1.7, 11], look: [0, LY + 1.5, 5], fov: 44 }, { f: F_CAS - 4, pos: [0, LY + 1.7, 9.5], look: [0, LY + 1.55, 5], fov: 42 }],
  angel: [{ f: F_CAS - 4, pos: [1.4, LY + 1.4, 4.2], look: [-1.0, LY + 0.5, -30], fov: 44 }, { f: TOTAL - 1, pos: [1.6, LY + 1.5, 4.6], look: [-1.0, LY - 2.0, -30], fov: 46 }],
};
const KICKS = [{ f: F_PIG, a: 0.03 }, { f: F_SHOT, a: 0.05 }, { f: F_HUND, a: 0.03 }, { f: F_2000, a: 0.04 }, { f: F_REF, a: 0.03 }];
const camAt = (f) => {
  const S = shotAt(f); const c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS });
  if (S.id === 'admiral' || S.id === 'quote') { const d = deckPt(); c.pos = C(d, c.pos); c.look = C(d, c.look); c.shadowAt = d; }
  else c.shadowAt = S.id === 'army' || S.id === 'worse' ? CAMP : S.id === 'ships' || S.id === 'troops' ? [20, 0, -100] : [0, LY, 2];
  return c;
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => {
  const S = shotAt(f);
  if (S.id === 'shot') return { focus: dist(Cm.pos, [-4.5, LY + 1.6, 4.5]), cinf: 9 };
  if (S.id === 'demand' || S.id === 'offer') return { focus: dist(Cm.pos, [0, LY + 1.7, 6.2]), cinf: 9 };
  if (S.id === 'munch') return { focus: dist(Cm.pos, [0.5, LY + 0.7, 1.5]), cinf: 8 };
  return { focus: 10, cinf: 0 };
};

export default {
  TOTAL, build,
  frame(f, k) {
    poseWorld(f);
    const S = shotAt(f), cam = camAt(f);
    const light = ['years', 'angel'].includes(S.id) ? { ...DUSK } : { ...DAY };
    if (['island', 'ships', 'troops', 'worse'].includes(S.id)) light.shadowExt = 60;
    const actors = actorsAt(f, k.T);
    if (S.id === 'admiral' || S.id === 'quote') { const d = deckPt(); actors[0].x = d[0]; actors[0].y = d[1]; actors[0].z = d[2]; }
    return { light, cam, dof: dofAt(f, cam), actors, fx: fxAt(f, k.T, cam) };
  },
};
