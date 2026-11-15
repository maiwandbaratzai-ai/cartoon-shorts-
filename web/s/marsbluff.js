// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The Mars Bluff Bomb" — Mars Bluff, South Carolina, 11 Mar 1958. Timed via marsbluff_timing.js.
import { TOTAL, LINES, wf } from './marsbluff_timing.js';
import * as PR from '../props.js';
import { INK } from '../toon.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const F_1958 = wf(0, '1958'), F_BOMBER = wf(0, 'bomber'), F_ATOM = wf(0, 'atomic'), F_YARD = wf(0, 'backyard'), F_PLAY = wf(1, 'playhouse'), F_SPLIN = wf(1, 'splinters'),
  F_CRATER = wf(1, 'crater'), F_70 = wf(1, '70'), F_WARN = wf(2, 'warning'), F_NAV = wf(2, 'navigator'), F_PIN = wf(3, 'pin'), F_UNH = wf(3, 'unhooked'),
  F_TONS = wf(4, 'tons'), F_SMASH = wf(4, 'smashed'), F_DOORS = wf(4, 'doors'), F_FELL = wf(5, 'fell'), F_15 = wf(5, '15'), F_MARS = wf(5, 'mars'),
  F_PART = wf(6, 'part'), F_CORE = wf(6, 'core'), F_SIX = wf(7, 'six'), F_DIED = wf(7, 'died'), F_CHICK = wf(7, 'chickens'), F_LUCKY = wf(7, 'lucky'),
  F_PAID = wf(8, 'paid'), F_54 = wf(8, '54'), F_ONE = wf(8, 'one');
const SHOTS = [['hook', 0], ['crater', cut(1)], ['plane', cut(2)], ['bay', F_NAV - 6], ['pin', cut(3)], ['doors', cut(4)], ['fall', cut(5)], ['boom', cut(6)], ['core', F_CORE - 8],
  ['family', cut(7)], ['chick', F_CHICK - 6], ['paid', cut(8)], ['end', F_ONE - 4]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const DAY = { az: 140, el: 42, sky: '#e4f0fa', ground: '#7a8a4a', hemi: 1.15, sun: '#fff2dc', sunI: 2.5, fog: '#d8e6f2', fogNear: 120, fogFar: 1000,
  skyTop: '#3a84d8', skyHor: '#e4eef6', sat: 1.14, vig: 0.2, shadowExt: 26 };
const HIGH = { ...DAY, fog: '#cfe0f4', fogNear: 400, fogFar: 4000, skyTop: '#1a5ac8', skyHor: '#d8e8f8' };
const BAY = { ...DAY, az: 90, el: 70, sun: '#ffe8c8', sunI: 1.6, sky: '#d8dce8', ground: '#4a4e5a', hemi: 1.5, skyTop: '#5a6a8a', skyHor: '#aab4c8', fog: '#8a90a0', fogNear: 30, fogFar: 200, vig: 0.34 };
const PLANE = [0, 4500, -200], BAYP = [620, 0, 0];
let K, bombW, bombB, plane, doors = [], crater, playhouse, ph2, warnL;
const rnd = (() => { let s = 1958; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
const gnd = (x, z) => { const r = Math.hypot(x, z); return r < 30 ? 0 : (r - 30) * 0.01 * (1 + Math.sin(x * 0.03) * Math.cos(z * 0.02)); };

/** Mark 6-style bomb: fat ovoid + box fins, nose along -y (falls nose down when rotated) */
const makeBomb = (parent) => {
  const g = K.group(parent), skin = K.col('#9aa2a8'), dk = K.col('#5a6268');
  const b = K.add(new K.THREE.SphereGeometry(0.76, 28, 18), skin, 0, 0, 0, g); b.scale.set(1, 1.9, 1);
  K.cyl(0.5, 0.7, 1.0, skin, 0, 0.9, 0, g); K.cyl(0.35, 0.5, 0.6, dk, 0, 1.85, 0, g);
  for (let i = 0; i < 4; i++) { const fn = K.slab(-0.04, 0.04, 1.8, 2.7, 0.3, 0.95, dk, g); fn.parent.remove(fn); const h = K.group(g); h.rotation.y = i * Math.PI / 2; h.add(fn); }
  K.slab(-0.62, 0.62, 2.62, 2.7, -0.62, 0.62, dk, g);
  K.cyl(0.78, 0.78, 0.12, K.col('#d8c040'), 0, -0.2, 0, g);
  return g;
};

function build(k) {
  K = k; const { THREE } = K, M4 = THREE.Matrix4;
  K.addClouds(10, 900, 220);
  PR.terrain(K, 900, 160, gnd, K.toon({ map: PR.speckTex('#8aa858', ['#7a9a4a', '#9ab664', '#86a050', '#a8b870'], 58, 2600, 80) }));
  // pines (merged)
  const tr = [], cr = [];
  for (let i = 0; i < 260; i++) { const a = rnd() * 6.283, d = 26 + rnd() * 170, x = Math.cos(a) * d, z = Math.sin(a) * d - 30; if (Math.hypot(x + 4, z - 12) < 30) continue; const s = 1 + rnd() * 0.8;
    const m = new M4().makeTranslation(x, gnd(x, z), z).multiply(new M4().makeScale(s, s, s)); tr.push(m.clone().multiply(new M4().makeTranslation(0, 4, 0))); cr.push(m.clone().multiply(new M4().makeTranslation(0, 10, 0))); }
  K.add(PR.mergeCopies(new THREE.CylinderGeometry(0.25, 0.4, 8, 6), tr), K.col('#7a5a3e')).frustumCulled = false;
  K.add(PR.mergeCopies(new THREE.ConeGeometry(2.6, 8, 8), cr), K.col('#3e7a44')).frustumCulled = false;
  // white farmhouse
  const fh = K.group(); fh.position.set(-14, 0, -14); fh.rotation.y = 0.4;
  const clap = PR.canvasTex(256, 256, (c) => { c.fillStyle = '#f4eee2'; c.fillRect(0, 0, 256, 256); for (let y = 0; y < 256; y += 16) { c.fillStyle = 'rgba(80,60,40,.16)'; c.fillRect(0, y, 256, 3); } }, [3, 2]);
  K.slab(-6, 6, 0, 5, -4, 4, K.toon({ map: clap }), fh); const rf = K.add(new THREE.CylinderGeometry(0.1, 6.6, 2.8, 4, 1), K.col('#6a4a44'), 0, 6.4, 0, fh); rf.rotation.y = Math.PI / 4; rf.scale.set(1.3, 1, 0.95);
  for (const x of [-3.5, 0, 3.5]) { K.slab(x - 0.8, x + 0.8, 1.6, 3.2, 4, 4.06, K.col('#9fd0e8'), fh); K.slab(x - 0.95, x + 0.95, 1.5, 3.3, 3.98, 4.02, K.col('#4a6a8a'), fh); }
  K.slab(-6.2, 6.2, 2.9, 3.1, 4, 6.2, K.col('#8a7a6a'), fh); K.cyl(0.45, 0.5, 2.6, K.col('#9a5a4a'), 3.5, 6, -1, fh);
  // garden rows + fence
  for (let i = 0; i < 8; i++) K.slab(4, 16, 0, 0.25, -14 + i * 1.4, -13.4 + i * 1.4, K.col(i % 2 ? '#6a8a3a' : '#5a7a30'));
  for (let i = 0; i < 18; i++) { const x = -20 + i * 2.6; K.slab(x - 0.07, x + 0.07, 0, 1.1, 12, 12.14, K.col('#e8e0d0')); } K.slab(-20, 26, 0.75, 0.85, 12.02, 12.12, K.col('#e8e0d0'));
  // wooden playhouse (intact) + wrecked version
  playhouse = K.group(); playhouse.position.set(4, 0, -2);
  K.slab(-1.3, 1.3, 0, 1.8, -1.1, 1.1, K.toon({ map: PR.canvasTex(128, 128, (c) => { c.fillStyle = '#e88a8a'; c.fillRect(0, 0, 128, 128); for (let y = 0; y < 128; y += 12) { c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(0, y, 128, 2); } }) }), playhouse);
  const pr = K.add(new THREE.CylinderGeometry(0.1, 1.9, 1.1, 4, 1), K.col('#f2ecd8'), 0, 2.35, 0, playhouse); pr.rotation.y = Math.PI / 4; pr.scale.set(1.0, 1, 0.85);
  K.slab(-0.35, 0.35, 0, 1.2, 1.1, 1.15, K.col('#ffffff'), playhouse); K.slab(0.6, 1.1, 0.8, 1.3, 1.1, 1.15, K.col('#9fd0e8'), playhouse);
  ph2 = K.group(); ph2.position.set(4, 0, -2);
  for (let i = 0; i < 14; i++) { const a = i * 0.45, d = 2 + (i % 5) * 1.3; const pl = K.slab(-0.6, 0.6, 0, 0.12, -0.1, 0.1, K.col(i % 3 ? '#e88a8a' : '#f2ecd8'), ph2); pl.position.set(Math.cos(a) * d + 4, 0.06, Math.sin(a) * d * 0.8); pl.rotation.y = a * 2; }
  // crater (bowl) at the impact point
  const cg = new THREE.CircleGeometry(10.5, 48, 0, Math.PI * 2); cg.rotateX(-Math.PI / 2); const p = cg.attributes.position;
  for (let i = 0; i < p.count; i++) { const r = Math.hypot(p.getX(i), p.getZ(i)) / 10.5; p.setY(i, 0.05 + 0.02 * r); } cg.computeVertexNormals();
  crater = K.add(cg, K.toon({ map: PR.speckTex('#5a3e2a', ['#4a3020', '#6a4a30', '#3a2618'], 9, 1500, 8) }), 4, 0, -2, K.scene, { cast: false });
  const rim = K.add(new THREE.TorusGeometry(10.8, 1.0, 8, 48), K.col('#9a7a58'), 4, 0, -2); rim.rotation.x = Math.PI / 2; rim.scale.z = 0.5; crater.userData.rim = rim;
  // bomb in the world
  bombW = makeBomb(K.scene);
  // B-47-ish swept-wing jet at altitude
  plane = K.group(); plane.position.set(...PLANE); const pw = K.col('#d4d8de'), pd = K.col('#8a9098');
  const fus = K.add(new THREE.CylinderGeometry(1.1, 0.9, 32, 20), pw, 0, 0, 0, plane); fus.rotation.x = Math.PI / 2;
  K.add(new THREE.SphereGeometry(1.1, 20, 14), pw, 0, 0, -16, plane).scale.set(1, 1, 2.2); K.add(new THREE.SphereGeometry(0.75, 16, 10), K.col('#9fd0e8'), 0, 0.8, -12, plane).scale.set(1, 0.7, 2);
  for (const s of [-1, 1]) { const w = K.slab(-0.15, 0.15, -9, 9, -2.2, 2.2, pw, plane); w.position.set(s * 9.5, 0.3, 2); w.rotation.set(0, s * -0.55, Math.PI / 2 * s); w.scale.set(1, 1, 1);
    for (const d of [5, 11]) { const e = K.add(new THREE.CylinderGeometry(0.5, 0.5, 3.4, 12), pd, s * d, -0.8, -0.6 + d * 0.45, plane); e.rotation.x = Math.PI / 2; } }
  const tl = K.slab(-0.12, 0.12, 0, 6, -2, 1.5, pw, plane); tl.position.set(0, 0.6, 14); tl.rotation.x = -0.4;
  for (const s of [-1, 1]) { const h = K.slab(-0.1, 0.1, -3.6, 3.6, -1, 1, pw, plane); h.position.set(s * 3.5, 0.8, 15); h.rotation.set(0, s * -0.5, Math.PI / 2 * s); }
  // bay door panels on the jet (fall away) + bomb bay interior set
  for (const s of [-1, 1]) { const d = K.slab(-0.55, 0.55, -0.06, 0.06, -3, 3, K.col('#b8bcc4'), plane); d.position.set(s * 0.55, -1.08, 0); doors.push(d); }
  const by = K.group(); by.position.set(...BAYP); const steel = K.col('#7a828c'), rib = K.col('#5a6068');
  K.slab(-2.2, 2.2, -0.2, 0, -6, 6, K.col('#4a5058'), by); // catwalk/doors level
  for (const s of [-1, 1]) K.slab(s * 2.2 - 0.1, s * 2.2 + 0.1, 0, 4.4, -6, 6, steel, by);
  K.slab(-2.3, 2.3, 4.4, 4.6, -6, 6, steel, by); K.slab(-2.3, 2.3, 0, 4.6, -6.2, -6, K.col('#6a7078'), by);
  for (let i = 0; i < 7; i++) K.slab(-2.25, 2.25, 4.2, 4.4, -5 + i * 1.6, -4.8 + i * 1.6, rib, by);
  for (let i = 0; i < 7; i++) for (const s of [-1, 1]) K.slab(s * 2.05 - 0.1, s * 2.05 + 0.1, 0, 4.4, -5 + i * 1.6, -4.8 + i * 1.6, rib, by);
  K.slab(-0.15, 0.15, 3.5, 4.4, -0.2, 0.2, K.col('#3a3e44'), by); // shackle
  warnL = K.add(new THREE.SphereGeometry(0.18, 16, 10), K.toon({ color: '#ff3a2a', emissive: '#ff2010' }), 2.0, 3.4, -5.9, by);
  // bay doors (split, swing open when smashed)
  for (const s of [-1, 1]) { const d = K.slab(-1.1, 1.1, -0.1, 0, -2.6, 2.6, K.col('#8a9098'), by); d.position.set(s * 1.1, 0.1, 0); doors.push(d); }
  bombB = makeBomb(by); bombB.rotation.set(0, 0, Math.PI / 2); bombB.position.set(0, 2.4, 0); bombB.scale.setScalar(0.85);
}

// ---------------- 2D ----------------
const chicken = (p, flap = 0) => { const cx = 300, cy = 720; p.ell(cx, cy, 120, 95, '#ffffff', 11); p.poly([[cx - 100, cy - 30], [cx - 170, cy - 110], [cx - 120, cy + 10]], '#ffffff', 9);
  p.poly([[cx - 40, cy - 10], [cx + 40, cy - 60 - 60 * flap], [cx + 60, cy + 10]], '#f0f0ea', 8);
  p.ell(cx + 90, cy - 110, 50, 48, '#ffffff', 10); p.poly([[cx + 70, cy - 160], [cx + 85, cy - 190], [cx + 100, cy - 165], [cx + 115, cy - 190], [cx + 120, cy - 150]], '#e0302a', 6);
  p.poly([[cx + 136, cy - 112], [cx + 176, cy - 100], [cx + 136, cy - 92]], '#f2b020', 6); p.ell(cx + 104, cy - 120, 10, 10, '#ffffff', 4); p.dot(cx + 106, cy - 120, 5);
  for (const s of [-1, 1]) p.stroke([[cx + s * 30, cy + 90], [cx + s * 34, cy + 250]], 10, '#f2b020'); };
const feathers = (p, t) => { for (let i = 0; i < 9; i++) { const a = i * 0.7, x = 300 + Math.cos(a) * (60 + 200 * t), y = 600 + Math.sin(a) * 120 * t + 300 * t * t;
  p.g.save(); p.g.translate(x, y); p.g.rotate(t * 4 + i); p.ell(0, 0, 34, 12, '#ffffff', 6); p.stroke([[-30, 0], [30, 0]], 3, '#c8c8c8'); p.g.restore(); } };
const check = (p) => { p.g.save(); p.g.translate(300, 500); p.g.rotate(-0.06); p.g.translate(-300, -500);
  p.poly([[20, 340], [580, 340], [580, 640], [20, 640]], '#e8f2e0', 12); p.g.strokeStyle = '#7a9a7a'; p.g.lineWidth = 4; p.g.strokeRect(40, 360, 520, 260);
  p.g.fillStyle = INK; p.g.font = 'bold 34px Poppins, sans-serif'; p.g.fillText('PAY TO: THE GREGG FAMILY', 60, 420); p.g.font = 'bold 84px Poppins, sans-serif'; p.g.fillStyle = '#1a6a3a'; p.g.fillText('$54,000', 150, 540);
  p.stroke([[330, 600], [540, 600]], 4, INK); p.g.restore(); };

// ---------------- characters ----------------
const NAV = { jacket: '#7a8a5a', pants: '#6a7a4a', boots: '#3a2a20', hat: 'hair', hair: '#5a3a24', belt: '#4a3a2a', skin: '#f5c9a0' };
const DAD = { jacket: '#5a7ab0', pants: '#3a4a6a', boots: '#4a3426', hat: 'hair', hair: '#3a2a20', skin: '#f2c8a0' };
const MOM = { jacket: '#c86a7a', pants: '#3b3f52', boots: '#4a3426', hat: 'bonnet', dress: '#e8a0b0', skin: '#f5d0b0' };
const GIRL1 = { jacket: '#f2c84a', pants: '#3b3f52', boots: '#c83a3a', hat: 'hair', hair: '#8a5a30', dress: '#f2c84a', build: 'kid', skin: '#ffe0c0' };
const GIRL2 = { jacket: '#6ab0d0', pants: '#3b3f52', boots: '#c83a3a', hat: 'hair', hair: '#c89a50', dress: '#6ab0d0', build: 'kid', skin: '#ffe0c0' };
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
const boomCard = (f, f0, pos, s, seed = 1) => { const t = q(ramp(f, f0, f0 + 30), 2); return t > 0 && t < 1 ? FX('kb' + t + seed, (p) => PR.kaboom(p, t, seed), pos, s, { order: 6 }) : null; };

function actorsAt(f, T) {
  const S = shotAt(f), out = [];
  switch (S.id) {
    case 'bay': case 'pin': { const near = S.id === 'pin'; const e = f > F_UNH ? 'shock' : f > F_PIN ? 'nervous' : 'neutral';
      out.push(card(T, 'nv', NAV, fo(f, 6, { expr: e, look: 0.3, tilt: q(idle(f, 6).tilt, 1), wave: near && f > F_PIN - 6 && f < F_UNH ? 1 : undefined }), [BAYP[0] + (near ? 0.55 : 0.9), 0, BAYP[2] + (near ? 1.4 : 2.5)])); break; }
    case 'family': case 'chick': { const z = 4; const e = S.id === 'chick' ? 'dazed' : f > F_DIED ? 'relief' : 'dazed';
      [[DAD, -1.2, 2], [MOM, -0.4, 3], [GIRL1, 0.35, 4], [GIRL2, 1.0, 5]].forEach(([o, x, sd]) => out.push(card(T, 'fm' + sd, o, fo(f, sd, { expr: e, look: 0.1, tilt: q(idle(f, sd).tilt, 1), headTilt: q(idle(f, sd).headTilt + (e === 'dazed' ? 6 : 0), 1) }), [x - 8, 0, z + 12]))); break; }
    case 'paid': out.push(card(T, 'dd', DAD, fo(f, 2, { expr: f > F_54 ? 'grin' : 'neutral', look: 0.2, tilt: q(idle(f, 2).tilt, 1) }), [-8.4, 0, 16])); break;
  }
  return out;
}

function fxAt(f, T, cam) {
  const S = shotAt(f), out = [], push = (x) => x && out.push(x);
  if (S.id === 'hook') { push(boomCard(f, -12, [4, 6, -2], 12, 2)); push(boomCard(f, 14, [3, 5, -1], 10, 5));
    push(wordCard(f, F_1958, '1958', cam, '#f6c83a', F_ATOM - F_1958 - 3)); push(wordCard(f, F_ATOM, 'ATOMIC BOMB', cam, '#ff7a4a', F_YARD - F_ATOM - 2)); push(wordCard(f, F_YARD, 'ON A BACKYARD', cam, '#ffffff')); }
  if (S.id === 'crater') { push(wordCard(f, F_PLAY, 'PLAYHOUSE', cam, '#ffffff', F_70 - F_PLAY - 4, 170, 0.5)); push(wordCard(f, F_70, '70 FT WIDE', cam, '#f6c83a', 1e9, 180, 0.5)); }
  if (S.id === 'plane') { push(wordCard(f, F_WARN, 'WARNING LIGHT', cam, '#ff5a3a', 1e9, 170, 0.5, 20)); }
  if (S.id === 'pin') { push(wordCard(f, F_PIN, 'LOCKING PIN', cam, '#ffffff', F_UNH - F_PIN - 3, 170, 0.55, 1.4)); push(wordCard(f, F_UNH, 'CLUNK!', cam, '#ff5a3a', 1e9, 200, 0.55, 1.4)); }
  if (S.id === 'doors') { push(wordCard(f, F_TONS, '2 TONS', cam, '#f6c83a', F_SMASH - F_TONS - 2, 200, 0.5, 20)); push(wordCard(f, F_SMASH, 'CRASH!', cam, '#ff5a3a', 1e9, 210, 0.5, 20)); }
  if (S.id === 'fall') { push(wordCard(f, F_15, '15,000 FT', cam, '#ffffff', F_MARS - F_15 - 3, 180, 0.45, 6)); push(wordCard(f, F_MARS, 'MARS BLUFF, SC', cam, '#f6c83a', 1e9, 160, 0.45, 6)); }
  if (S.id === 'boom') { push(boomCard(f, cut(6) + 2, [4, 6, -2], 14, 3)); push(boomCard(f, cut(6) + 14, [2, 5, 0], 11, 7)); }
  if (S.id === 'core') { push(boomCard(f, F_CORE - 30, [4, 6, -2], 13, 9)); push(wordCard(f, F_CORE, 'NO NUCLEAR CORE', cam, '#9ad04a', 1e9, 160, 0.45, 6)); }
  if (S.id === 'family') { push(wordCard(f, F_SIX, '6 HURT', cam, '#ffffff', F_DIED - F_SIX - 6, 180, 0.5)); push(wordCard(f, F_DIED, 'NOBODY DIED', cam, '#f6c83a', 1e9, 170, 0.5)); }
  if (S.id === 'chick') { const t = q(ramp(f, F_LUCKY - 10, F_LUCKY + 30), 2); if (t > 0) out.push(FX('ft' + t, (p) => feathers(p, t), [-4.6, 1.2, 18.2], 1.0, { order: 6 }));
    if (f < F_LUCKY - 8) out.push(FX('ck' + q(Math.abs(Math.sin(f * 0.6)), 1), (p) => chicken(p, Math.abs(Math.sin(f * 0.6))), [-4.6, 1.07 * 0.8, 18.2], 0.8, { order: 4 }));
    push(wordCard(f, F_LUCKY, 'POOF', cam, '#ffffff', 1e9, 190, 0.5)); }
  if (S.id === 'paid') { out.push(FX('chk', check, inFront(cam, 1.6, 0, -0.18), 0.45, { order: 7 })); push(wordCard(f, F_PAID, 'PAID', cam, '#f6c83a', F_54 - F_PAID - 3, 180, 0.55)); }
  if (S.id === 'end') { push(wordCard(f, F_ONE, 'FOR ONE BACKYARD', cam, '#f6c83a', 1e9, 160, 0.42, 6)); push(boomCard(f, TOTAL - 14, [4, 6, -2], 12, 2)); }
  return out;
}

// ---------------- world ----------------
const boomed = (f) => f < cut(2) || f >= cut(6);
// bomb in the world: [pos, rot]
const bombAt = (f) => { const id = shotAt(f).id;
  if (id === 'doors') { const t = Math.max(0, (f - F_SMASH + 4) / 30); return [[PLANE[0], PLANE[1] - 1.5 - 9.8 * t * t * 6, PLANE[2]], [Math.PI / 2 - Math.min(1, t) * 1.2, 0, 0]]; }
  if (id === 'fall') { const t = ramp(f, cut(5), cut(6)); return [[4, lerp(140, 30, t), -2 + 3 * (1 - t)], [Math.PI * 0.95, 0, 0.1]]; }
  return null; };

// ---------------- cameras ----------------
const P0 = PLANE;
const CAMS = {
  hook: [{ f: 0, pos: [-6, 2.2, 22], look: [3, 4.5, -2], fov: 54 }, { f: F_YARD, pos: [-5.5, 2.0, 19], look: [3, 4, -2], fov: 52 }, { f: cut(1), pos: [-5.2, 2.0, 18], look: [3, 4, -2], fov: 50 }],
  crater: [{ f: cut(1), pos: [-6, 18, 20], look: [4, 0, -2], fov: 50 }, { f: F_CRATER, pos: [-2, 26, 14], look: [4, -1, -2], fov: 50 }, { f: cut(2), pos: [-1, 28, 12], look: [4, -1, -2], fov: 50 }],
  plane: [{ f: cut(2), pos: [P0[0] + 30, P0[1] + 6, P0[2] - 40], look: [P0[0], P0[1], P0[2]], fov: 46 }, { f: F_NAV - 6, pos: [P0[0] + 26, P0[1] + 4, P0[2] - 30], look: [P0[0], P0[1], P0[2]], fov: 44 }],
  bay: [{ f: F_NAV - 6, pos: [BAYP[0] + 1.4, 1.7, 6.4], look: [BAYP[0] + 0.3, 1.8, 0], fov: 50 }, { f: cut(3), pos: [BAYP[0] + 1.2, 1.7, 5.2], look: [BAYP[0] + 0.4, 1.8, 0.5], fov: 46 }],
  pin: [{ f: cut(3), pos: [BAYP[0] + 0.6, 1.9, 4.8], look: [BAYP[0] + 0.45, 2.0, 0.4], fov: 48 }, { f: F_UNH, pos: [BAYP[0] + 0.5, 1.8, 4.2], look: [BAYP[0] + 0.2, 1.6, 0.3], fov: 48 }, { f: cut(4), pos: [BAYP[0] + 0.5, 1.8, 4.0], look: [BAYP[0] + 0.2, 1.2, 0.3], fov: 50 }],
  doors: [{ f: cut(4), pos: [P0[0] + 32, P0[1] - 8, P0[2] + 6], look: [P0[0], P0[1] - 2, P0[2]], fov: 46 }, { f: F_DOORS, pos: [P0[0] + 30, P0[1] - 14, P0[2] + 6], look: [P0[0], P0[1] - 12, P0[2]], fov: 48 }, { f: cut(5), pos: [P0[0] + 30, P0[1] - 22, P0[2] + 6], look: [P0[0], P0[1] - 26, P0[2]], fov: 50 }],
  fall: [{ f: cut(5), pos: [10, 150, 12], look: [4, 120, -2], fov: 52 }, { f: cut(6), pos: [9, 40, 14], look: [4, 20, -2], fov: 52 }],
  boom: [{ f: cut(6), pos: [-20, 4, 36], look: [3, 6, -2], fov: 50 }, { f: F_CORE - 8, pos: [-18, 4, 32], look: [3, 6, -2], fov: 48 }],
  core: [{ f: F_CORE - 8, pos: [-14, 3, 26], look: [3, 5, -2], fov: 52 }, { f: cut(7), pos: [-13, 3, 24], look: [3, 5, -2], fov: 50 }],
  family: [{ f: cut(7), pos: [-8.1, 1.5, 22.5], look: [-8.1, 1.3, 16], fov: 44 }, { f: F_DIED, pos: [-8.1, 1.5, 21.6], look: [-8.1, 1.3, 16], fov: 42 }],
  chick: [{ f: F_CHICK - 6, pos: [-4.4, 0.9, 21.6], look: [-4.6, 0.7, 18.2], fov: 44 }, { f: cut(8), pos: [-4.4, 1.0, 21.2], look: [-4.6, 0.9, 18.2], fov: 44 }],
  paid: [{ f: cut(8), pos: [-8.3, 1.7, 19.5], look: [-8.35, 1.5, 16], fov: 42 }, { f: F_54, pos: [-8.3, 1.6, 18.6], look: [-8.35, 1.3, 16], fov: 42 }, { f: F_ONE - 4, pos: [-8.3, 1.6, 18.4], look: [-8.35, 1.3, 16], fov: 41 }],
  end: [{ f: F_ONE - 4, pos: [-7, 6, 30], look: [3, 0, -2], fov: 50 }, { f: TOTAL - 16, pos: [-6, 2.4, 23], look: [3, 2, -2], fov: 52 }, { f: TOTAL - 1, pos: [-6, 2.2, 22], look: [3, 4.5, -2], fov: 54 }],
};
const KICKS = [{ f: F_ATOM, a: 0.04 }, { f: F_UNH, a: 0.04 }, { f: F_SMASH, a: 0.05 }, { f: cut(6) + 2, a: 0.06 }, { f: F_LUCKY, a: 0.03 }, { f: TOTAL - 14, a: 0.04 }];
const camAt = (f) => { const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS });
  c.shadowAt = ['bay', 'pin'].includes(S.id) ? BAYP : ['plane', 'doors'].includes(S.id) ? P0 : S.id === 'fall' ? [4, 0, -2] : [c.look[0], 0, c.look[2]]; return c; };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => { const id = shotAt(f).id;
  if (['family', 'paid'].includes(id)) return { focus: dist(Cm.pos, [-8.2, 1.4, 16]), cinf: 10 };
  if (id === 'pin' || id === 'bay') return { focus: dist(Cm.pos, [BAYP[0] + 0.6, 1.8, 1.5]), cinf: 8 };
  return { focus: 10, cinf: 0 }; };

export default {
  TOTAL, build,
  frame(f, k) {
    const S = shotAt(f), cam = camAt(f), id = S.id, bm = boomed(f);
    playhouse.visible = !bm; ph2.visible = bm; crater.visible = crater.userData.rim.visible = bm && id !== 'fall';
    const b = bombAt(f); bombW.visible = !!b; if (b) { bombW.position.set(...b[0]); bombW.rotation.set(...b[1]); }
    // bay: bomb drops off the shackle on "unhooked", doors burst on "smashed"
    const drop = Math.max(0, (f - F_UNH) / 30); bombB.position.y = id === 'pin' ? 2.4 - 4.9 * drop * drop : 2.4;
    warnL.visible = Math.floor(f / 8) % 2 === 0;
    const dOpen = id === 'doors' ? clamp((f - F_SMASH + 2) / 6) : 0;
    doors.slice(0, 2).forEach((d, i) => { const s = i ? 1 : -1; d.position.set(s * (0.55 + dOpen * 1.5), -1.08 - dOpen * 3 * (1 + i * 0.4) - Math.max(0, f - F_SMASH) * 0.04 * dOpen, 0); d.rotation.set(dOpen * (i ? 0.8 : -1.1), 0, s * dOpen * 1.2); });
    const light = ['bay', 'pin'].includes(id) ? { ...BAY } : ['plane', 'doors', 'fall'].includes(id) ? { ...HIGH } : { ...DAY };
    if (['crater', 'boom', 'core', 'end', 'hook', 'fall'].includes(id)) light.shadowExt = 50;
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
  },
};
