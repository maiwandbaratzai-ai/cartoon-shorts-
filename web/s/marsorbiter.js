// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Mars Climate Orbiter" — lost at Mars, 23 Sep 1999 (pound-force vs newton mix-up). Timed via marsorbiter_timing.js.
import { TOTAL, LINES, wf } from './marsorbiter_timing.js';
import * as PR from '../props.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const F_1999 = wf(0, '1999'), F_NINE = wf(1, 'nine'), F_THR = wf(2, 'thruster'), F_LB = wf(3, 'pounds'), F_N = wf(4, 'newtons'), F_SO = wf(5, 'so'), F_FOUR = wf(5, 'four'),
  F_57 = wf(7, 'fifty'), F_HIT = wf(8, 'hit'), F_NEVER = wf(8, 'never'), F_MULT = wf(9, 'multiplication'), F_COST = wf(9, 'cost'), F_125 = wf(9, '125');
const SHOTS = [['hook', 0], ['cruise', cut(1)], ['burns', cut(2)], ['pounds', cut(3)], ['newtons', cut(4)], ['nobody', cut(5)], ['push', F_SO - 3], ['drift', cut(6)],
  ['arrive', cut(7)], ['burn', cut(8)], ['nosignal', F_NEVER - 3], ['fix', cut(9)], ['cost', F_COST - 3]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const SPACE = { az: 30, el: 18, sky: '#7d8cc0', ground: '#3a2a3a', hemi: 0.75, sun: '#fff4e2', sunI: 2.9, fog: '#0b1030', fogNear: 1e5, fogFar: 2e5,
  skyTop: '#05081c', skyHor: '#141a44', sat: 1.12, vig: 0.3, shadowExt: 12, gain: '#ffffff', lift: '#06060e' };
const ROOMLIGHT = { az: 110, el: 60, sky: '#eef2fa', ground: '#8a8478', hemi: 1.35, sun: '#fff6e8', sunI: 1.4, fog: '#d8dde6', fogNear: 200, fogFar: 600,
  skyTop: '#c9d2e0', skyHor: '#e4e8ee', sat: 1.05, vig: 0.24, shadowExt: 12 };
const MC = [0, -310, 0], MR = 300, ROOM = [4000, 0, 0], CRUISE = [0, 1300, 1500];
let K, orb, stars, atmo, planned, actual, screenMat, scrTex = {}, calc;
const rnd = (() => { let s = 9; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();

const orbiter = () => {
  const { THREE } = K, g = K.group();
  const foil = K.toon({ map: PR.canvasTex(128, 128, (c) => { c.fillStyle = '#d9a93a'; c.fillRect(0, 0, 128, 128); for (let i = 0; i < 60; i++) { c.strokeStyle = i % 2 ? '#f2d27a' : '#a8781e'; c.lineWidth = 2; c.beginPath(); const x = (i * 37) % 128, y = (i * 53) % 128; c.moveTo(x, y); c.lineTo(x + 20, y + 9); c.lineTo(x + 8, y + 22); c.stroke(); } }) });
  K.slab(-0.8, 0.8, -1, 1, -0.8, 0.8, foil, g);
  const cells = K.toon({ map: PR.canvasTex(256, 96, (c) => { c.fillStyle = '#1f3f8a'; c.fillRect(0, 0, 256, 96); c.strokeStyle = '#8fb2e8'; c.lineWidth = 2; for (let x = 0; x < 256; x += 21) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 96); c.stroke(); } for (let y = 0; y < 96; y += 24) { c.beginPath(); c.moveTo(0, y); c.lineTo(256, y); c.stroke(); } }) });
  K.beam(K.V(-0.8, 0, 0), K.V(-1.6, 0, 0), 0.12, K.col('#c9ced6'), g);
  K.slab(-7.4, -1.6, -0.06, 0.06, -1.0, 1.0, cells, g);
  const dish = K.add(new THREE.CylinderGeometry(0.95, 0.12, 0.45, 28, 1, true), K.toon({ color: '#f2f0ea', side: THREE.DoubleSide }), 0.2, 1.4, 0, g);
  K.beam(K.V(0.2, 1.0, 0), K.V(0.2, 1.3, 0), 0.08, K.col('#c9ced6'), g);
  K.add(new THREE.ConeGeometry(0.42, 0.7, 16), K.col('#5a5f6e'), 0, -1.3, 0, g).rotation.x = Math.PI;
  for (const s of [-1, 1]) K.add(new THREE.CylinderGeometry(0.1, 0.16, 0.3, 10), K.col('#5a5f6e'), 0.8, -0.8, s * 0.6, g).rotation.z = Math.PI / 2;
  return g;
};

function build(k) {
  K = k; const { THREE } = K;
  // star field (follows the camera)
  const st = PR.canvasTex(2048, 1024, (c) => { c.clearRect(0, 0, 2048, 1024); for (let i = 0; i < 1600; i++) { const x = rnd() * 2048, y = rnd() * 1024, r = rnd() < 0.06 ? 2.4 : 1.1; c.fillStyle = `rgba(255,${230 + rnd() * 25 | 0},${200 + rnd() * 55 | 0},${0.5 + rnd() * 0.5})`; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); } });
  st.repeat.set(1, 1);
  stars = new THREE.Mesh(new THREE.SphereGeometry(1900, 32, 16), new THREE.MeshBasicMaterial({ map: st, transparent: true, side: THREE.BackSide, fog: false, depthWrite: false }));
  stars.userData.ndSkip = true; K.scene.add(stars);
  // Mars
  const mt = PR.canvasTex(1024, 512, (c) => { c.fillStyle = '#c4582f'; c.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 40; i++) { c.fillStyle = ['#a8462a', '#d9784a', '#8e3a24'][i % 3]; c.globalAlpha = 0.55; c.beginPath(); c.ellipse(rnd() * 1024, 80 + rnd() * 352, 30 + rnd() * 120, 14 + rnd() * 50, rnd() * 3, 0, 7); c.fill(); }
    c.globalAlpha = 1; for (let i = 0; i < 160; i++) { const x = rnd() * 1024, y = 40 + rnd() * 432, r = 2 + rnd() ** 2 * 18; c.fillStyle = '#9a4428'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.fillStyle = '#e08a5a'; c.beginPath(); c.arc(x - r * 0.25, y - r * 0.25, r * 0.7, 0, 7); c.fill(); }
    c.fillStyle = '#f4efe8'; c.fillRect(0, 0, 1024, 26); c.fillRect(0, 494, 1024, 18); });
  mt.wrapS = THREE.RepeatWrapping; mt.repeat.set(2, 1);
  const mars = K.add(new THREE.SphereGeometry(MR, 128, 64), K.toon({ map: mt }), ...MC, K.scene, { cast: false }); mars.rotation.x = -0.82;
  atmo = new THREE.Mesh(new THREE.SphereGeometry(MR + 7, 96, 48), new THREE.MeshBasicMaterial({ color: '#f0a070', transparent: true, opacity: 0.22, fog: false, depthWrite: false }));
  atmo.position.set(...MC); atmo.userData.ndSkip = true; K.scene.add(atmo);
  // Earth, far behind on the cruise
  const et = PR.canvasTex(512, 256, (c) => { c.fillStyle = '#2f6fc8'; c.fillRect(0, 0, 512, 256); for (let i = 0; i < 14; i++) { c.fillStyle = '#5aa04a'; c.beginPath(); c.ellipse(rnd() * 512, 50 + rnd() * 156, 20 + rnd() * 50, 12 + rnd() * 30, rnd() * 3, 0, 7); c.fill(); }
    for (let i = 0; i < 30; i++) { c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.ellipse(rnd() * 512, rnd() * 256, 20 + rnd() * 40, 4 + rnd() * 6, 0, 0, 7); c.fill(); } });
  K.add(new THREE.SphereGeometry(45, 48, 24), K.toon({ map: et }), CRUISE[0] - 120, CRUISE[1] + 60, CRUISE[2] + 700, K.scene, { cast: false });
  orb = orbiter();
  // planned (green) vs actual (red) approach paths for the drift shot
  const path = (pts, col) => { const c = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))); const m = K.add(new THREE.TubeGeometry(c, 120, 2.4, 8), K.toon({ color: col, emissive: col, emissiveIntensity: 0.6 }), 0, 0, 0, K.scene, { cast: false }); m.visible = false; return m; };
  planned = path([[-260, 140, -60], [-150, 95, -20], [-40, 75, 0], [70, 80, 0], [170, 110, -20]], '#5ad06a');
  actual = path([[-260, 140, -60], [-150, 80, -20], [-60, 30, 0], [10, 4, 0], [60, -6, 0]], '#e8503a');
  // mission control room
  const R = K.group(); R.position.set(...ROOM);
  K.slab(-14, 14, -0.1, 0, -10, 10, K.texM(K.P.stone(6, 10, 3, 20, 20, 20), 6, 6, '#b8b4ac'), R, false);
  K.slab(-14, 14, 0, 6, -10.2, -10, K.col('#56607a'), R, false); K.slab(-14, 14, 6, 6.2, -10, 10, K.col('#e4e6ea'), R, false);
  for (const s of [-1, 1]) K.slab(s * 14, s * 14.2, 0, 6, -10, 10, K.col('#6a7490'), R, false);
  K.slab(-14, 14, 0, 6, 10, 10.2, K.col('#6a7490'), R, false);
  const scr = (draw) => PR.canvasTex(512, 288, draw);
  scrTex.mars = scr((c) => { c.fillStyle = '#071030'; c.fillRect(0, 0, 512, 288); c.fillStyle = '#c4582f'; c.beginPath(); c.arc(256, 340, 190, 0, 7); c.fill();
    c.setLineDash([10, 8]); c.strokeStyle = '#7ad06a'; c.lineWidth = 5; c.beginPath(); c.ellipse(256, 340, 250, 250, 0, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
    c.fillStyle = '#ffffff'; c.font = 'bold 30px Poppins, sans-serif'; c.fillText('MCO  ORBIT  INSERTION', 80, 40); });
  scrTex.none = scr((c) => { for (let i = 0; i < 6000; i++) { const v = rnd() * 255 | 0; c.fillStyle = `rgb(${v},${v},${v})`; c.fillRect(rnd() * 512, rnd() * 288, 4, 3); }
    c.fillStyle = '#c8402e'; c.fillRect(96, 104, 320, 80); c.fillStyle = '#ffffff'; c.font = 'bold 48px Poppins, sans-serif'; c.textAlign = 'center'; c.fillText('NO SIGNAL', 256, 160); });
  screenMat = new THREE.MeshBasicMaterial({ map: scrTex.mars });
  const big = K.add(new THREE.PlaneGeometry(14, 7.9), screenMat, 0, 3.4, -9.9, R, { cast: false });
  const deskMat = K.col('#8a8f9a'), crt = K.col('#d9d4c4');
  const mon = (x, z, txt, col) => { const g = K.group(R); g.position.set(x, 0, z);
    K.slab(-1.6, 1.6, 0, 1.0, -0.5, 0.5, deskMat, g);
    K.slab(-0.55, 0.55, 1.0, 1.9, -0.4, 0.4, crt, g);
    K.add(new THREE.PlaneGeometry(0.9, 0.62), new THREE.MeshBasicMaterial({ map: scr((c) => { c.fillStyle = '#0c2a12'; c.fillRect(0, 0, 512, 288); c.fillStyle = col; c.font = 'bold 110px Poppins, sans-serif'; c.textAlign = 'center'; c.fillText(txt, 256, 180); for (let i = 0; i < 4; i++) c.fillRect(60, 220 + i * 14, 120 + i * 60, 6); }) }), 0, 1.47, 0.41, g, { cast: false });
  };
  mon(-4.2, -1, 'lbf·s', '#7ad06a'); mon(4.2, -1, 'N·s', '#7ad06a'); mon(-8.2, -3.5, '0110', '#7ad06a'); mon(8.2, -3.5, '0110', '#7ad06a');
  // partition between the two teams
  const sign = (x, txt, col) => { const t = PR.canvasTex(512, 128, (c) => { c.fillStyle = col; c.fillRect(0, 0, 512, 128); c.fillStyle = '#ffffff'; c.font = 'bold 74px Poppins, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 256, 68); });
    K.add(new THREE.PlaneGeometry(3.2, 0.8), new THREE.MeshBasicMaterial({ map: t }), x, 3.0, -2.0, R, { cast: false }); };
  sign(-4.2, 'POUNDS', '#c8402e'); sign(4.2, 'NEWTONS', '#2f5fae');
}

// ---------------- orbiter path ----------------
const C = (p, d) => [p[0] + d[0], p[1] + d[1], p[2] + d[2]];
const DRIFT = (u) => { const c = actual.geometry.parameters.path; return c.getPoint(clamp(u)).toArray(); };
function orbState(f) {
  const S = shotAt(f), id = S.id, t = f / 30;
  let pos = [0, 0, 0], rot = [0.15, 0.4 + t * 0.05, 0.1], fire = 0;
  if (id === 'hook' || id === 'cost') { const f0 = id === 'hook' ? 0 : S.a; pos = [-6 + (f - f0) * 0.12, -4.0 - (f - f0) * 0.012, 0]; rot = [0.3, 0.2, -0.5 + 0.02 * Math.sin(f * 0.6)]; fire = 1; }
  if (id === 'cruise') pos = C(CRUISE, [0, 0, -(f - S.a) * 0.06]);
  if (id === 'burns' || id === 'push') pos = C(CRUISE, [0, 0, -(f - S.a) * 0.04]);
  if (id === 'drift') pos = DRIFT(lerp(0.15, 0.75, ramp(f, S.a, S.b)));
  if (id === 'arrive') { pos = [-20 + (f - S.a) * 0.18, 2.6 - (f - S.a) * 0.01, 0]; rot = [0.2, 0.3, -0.25]; }
  if (id === 'burn') { pos = [-6 + (f - S.a) * 0.14, -3 - (f - S.a) * 0.02, 0]; rot = [0.3, 0.2, -0.5 + 0.03 * Math.sin(f * 0.7)]; fire = ramp(f, F_HIT - 6, F_HIT + 8); }
  return { pos, rot, fire };
}

// ---------------- cameras ----------------
const DIRM = [0, -0.73, -0.68];
const CAMS = {
  hook: [{ f: 0, pos: [2.5, 1.6, 8], look: [-0.8, -0.2, 0], fov: 46 }, { f: F_1999 + 12, pos: [4, 1.2, 9], look: [0, -0.4, 0], fov: 44 }, { f: cut(1), pos: [7, 2.5, 12], look: [1, -1.5, 0], fov: 46 }],
  cruise: [{ f: cut(1), pos: [3, 1.5, -14], look: [-1.5, 1.0, 10], fov: 42 }, { f: F_NINE, pos: [3, 9, 9], look: [0, -14, -12], fov: 44 }, { f: cut(2), pos: [2, 7.5, 7.5], look: [0, -14, -12], fov: 42 }],
  burns: [{ f: cut(2), pos: [7, 2, 9], look: [-2, -0.2, -1], fov: 44 }, { f: cut(3), pos: [6, 1.6, 8], look: [-1.8, -0.2, -1], fov: 42 }],
  pounds: [{ f: cut(3), pos: [-3.4, 1.9, 4.6], look: [-4.7, 1.5, 0.5], fov: 42 }, { f: cut(4), pos: [-3.8, 1.8, 3.6], look: [-4.8, 1.5, 0.4], fov: 40 }],
  newtons: [{ f: cut(4), pos: [3.4, 1.9, 4.6], look: [4.7, 1.5, 0.5], fov: 42 }, { f: cut(5), pos: [3.8, 1.8, 3.6], look: [4.8, 1.5, 0.4], fov: 40 }],
  nobody: [{ f: cut(5), pos: [0, 2.4, 7.5], look: [0, 1.6, -1], fov: 46 }, { f: F_SO - 3, pos: [0, 2.3, 6.8], look: [0, 1.6, -1], fov: 44 }],
  push: [{ f: F_SO - 3, pos: [8, 2, 10], look: [-1, 0, -1.5], fov: 44 }, { f: F_FOUR, pos: [11, 2.5, 14], look: [-1.5, 0, -2.5], fov: 46 }, { f: cut(6), pos: [10, 2.5, 13], look: [-1.5, 0, -2.5], fov: 44 }],
  drift: [{ f: cut(6), pos: [-20, 160, 330], look: [-40, 30, 0], fov: 50 }, { f: cut(7), pos: [10, 120, 300], look: [-10, 20, 0], fov: 50 }],
  arrive: [{ f: cut(7), pos: [4, 2.5, 9], look: [0, -0.6, 0], fov: 44 }, { f: F_57, pos: [2.5, 1.6, 7], look: [0, -1, 0], fov: 42 }, { f: cut(8), pos: [6, 1.2, 9], look: [0, -1.2, 0], fov: 44 }],
  burn: [{ f: cut(8), pos: [4, 2, 9], look: [0, -0.5, 0], fov: 44 }, { f: F_NEVER - 3, pos: [6, 1, 11], look: [0, -0.6, 0], fov: 46 }],
  nosignal: [{ f: F_NEVER - 3, pos: [0, 2.4, 6.5], look: [0, 2.2, -6], fov: 50 }, { f: cut(9), pos: [0, 2.4, 5.0], look: [0, 2.6, -6], fov: 46 }],
  fix: [{ f: cut(9), pos: [-2.4, 1.75, 3.0], look: [-3.9, 1.55, 0.4], fov: 40 }, { f: F_COST - 3, pos: [-2.8, 1.7, 2.4], look: [-4.0, 1.55, 0.4], fov: 38 }],
  cost: [{ f: F_COST - 3, pos: [7, 2.5, 12], look: [1, -1.5, 0], fov: 46 }, { f: TOTAL - 1, pos: [2.5, 1.6, 8], look: [-0.8, -0.2, 0], fov: 46 }],
};
const KICKS = [{ f: F_THR, a: 0.03 }, { f: F_FOUR, a: 0.06 }, { f: F_HIT, a: 0.07 }];
const ROOMSHOTS = ['pounds', 'newtons', 'nobody', 'nosignal', 'fix'];
const ORBREL = ['cruise', 'burns', 'push', 'hook', 'cost', 'arrive', 'burn'];
const camAt = (f) => {
  const S = shotAt(f); let c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS });
  if (ROOMSHOTS.includes(S.id)) { c.pos = C(ROOM, c.pos); c.look = C(ROOM, c.look); c.shadowAt = C(ROOM, [0, 0, 0]); }
  if (ORBREL.includes(S.id)) { const p = orbState(f).pos; c.pos = C(p, c.pos); c.look = C(p, c.look); c.shadowAt = p; }
  if (!c.shadowAt) c.shadowAt = orbState(f).pos;
  return c;
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => {
  const S = shotAt(f);
  if (S.id === 'pounds') return { focus: dist(Cm.pos, C(ROOM, [-4.6, 1.5, 0.4])), cinf: 9 };
  if (S.id === 'newtons') return { focus: dist(Cm.pos, C(ROOM, [4.6, 1.5, 0.4])), cinf: 9 };
  if (S.id === 'fix') return { focus: dist(Cm.pos, C(ROOM, [-4.0, 1.5, 0.4])), cinf: 10 };
  return { focus: 10, cinf: 0 };
};

// ---------------- characters ----------------
const ENG = { jacket: '#f2f0ea', pants: '#3b3f52', boots: '#2a2420', hat: 'hair', hair: '#5a3b2a', sash: '#c8402e' };
const NAV = { jacket: '#9fc2e8', pants: '#4a4f5c', boots: '#2a2420', hat: 'hair', hair: '#1e1714', skin: '#c99067', sash: '#2f5fae' };
const ENG2 = { jacket: '#f2f0ea', pants: '#5a5f6e', boots: '#2a2420', hat: 'hair', hair: '#d9a441', skin: '#f5c9a0', dress: '#5a8fc2' };
const NAV2 = { jacket: '#e9e6da', pants: '#3b3f52', boots: '#2a2420', hat: 'hair', hair: '#8a8a8a', moustache: '#8a8a8a', build: 'stout' };
const LIGHT2D = -2.1;
const fo = (f, seed, o) => ({ mode: 'stand', light: LIGHT2D, seed, blink: blinkAt(f, seed), ...o });
const card = (T, key, o, opts, pos, extra = {}) => ({ key: key + JSON.stringify(opts) + (extra.calc ? 'c' : ''), draw: (p) => { T.bodyFront(p, o, opts); if (extra.calc) calcDraw(p); }, x: pos[0], y: pos[1], z: pos[2], ...extra });
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1] - 1.07 * s, z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
const calcDraw = (p) => { p.g.save(); p.g.translate(380, 560); p.g.rotate(0.12); p.poly([[-55, -85], [55, -85], [55, 85], [-55, 85]], '#3a3e44', 8); p.poly([[-42, -70], [42, -70], [42, -30], [-42, -30]], '#b8d8a0', 5);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) p.ell(-28 + i * 28, -5 + j * 28, 9, 8, '#e9e6da', 4); p.g.restore(); };
const inFront = (c, d, ux, uy) => {
  const V = K.THREE.Vector3, p = new V(...c.pos), dir = new V(...c.look).sub(p).normalize(), right = new V().crossVectors(dir, new V(0, 1, 0)).normalize(), up = new V().crossVectors(right, dir);
  const h = d * Math.tan(c.fov * Math.PI / 360); return p.addScaledVector(dir, d).addScaledVector(right, ux * h).addScaledVector(up, uy * h).toArray();
};
const wordCard = (f, f0, txt, c, col = '#f6c83a', dur = 1e9, size = 170, uy = 0.42) => { if (f < f0 - 1 || f > f0 + dur) return null; const t = q(Math.min(1, (f - f0 + 1) / 12));
  const r = Math.min(1, 400 / (0.7 * size * txt.length)), fs = size * r, s = Math.min(2.5, 1.25 / r);
  return FX('w' + txt + t, (p) => PR.word(p, txt, t, col, fs), inFront(c, 7, 0, uy), s, { order: 9 }); };
// 2D flame / re-entry streak, pointing left (trail) from the card centre
const flame = (p, t, k) => {
  const g = p.g; g.save(); g.translate(300, 500); g.globalAlpha = Math.min(1, k * 1.5);
  const w = (s, col, len) => { const pts = []; for (let i = 0; i <= 24; i++) { const a = -Math.PI / 2 + i / 24 * Math.PI, r = 90 * s; pts.push([Math.cos(a) * r * 0.9 + 20, Math.sin(a) * r]); }
    for (let i = 0; i <= 10; i++) { const u = i / 10; pts.push([20 - len * u, 90 * s * (1 - u) ** 0.7 * (1 + 0.12 * Math.sin(u * 20 + t * 40))]); }
    for (let i = 10; i >= 0; i--) { const u = i / 10; pts.push([20 - len * u, -90 * s * (1 - u) ** 0.7 * (1 + 0.12 * Math.cos(u * 18 + t * 37))]); }
    p.poly(pts, col, 0); };
  w(1.35 * k, 'rgba(232,80,40,.85)', 270 * k); w(1.0 * k, 'rgba(246,160,58,.95)', 220 * k); w(0.62 * k, '#fff3b0', 150 * k);
  g.restore();
};

function actorsAt(f, T) {
  const S = shotAt(f), out = [], R = (d) => C(ROOM, d);
  switch (S.id) {
    case 'pounds':
      out.push(card(T, 'eng', ENG, fo(f, 4, { expr: f < F_LB - 4 ? 'smile' : 'grin', look: 0.5, facing: 1, wave: f > F_LB - 2 ? q(Math.sin(f * 0.4), 1) : undefined, tilt: q(idle(f, 4).tilt, 1) }), R([-5.0, 0, 0.9])));
      out.push(card(T, 'eng2', ENG2, fo(f, 5, { expr: 'smile', look: 0.4 }), R([-6.0, 0, -0.6]))); break;
    case 'newtons':
      out.push(card(T, 'nav', NAV, fo(f, 6, { expr: f < F_N - 4 ? 'smile' : 'grin', look: -0.5, facing: -1, wave: f > F_N - 2 ? q(Math.sin(f * 0.4), 1) : undefined, tilt: q(idle(f, 6).tilt, 1) }), R([5.0, 0, 0.9])));
      out.push(card(T, 'nav2', NAV2, fo(f, 7, { expr: 'neutral', look: -0.4 }), R([6.0, 0, -0.6]))); break;
    case 'nobody':
      out.push(card(T, 'eng', ENG, fo(f, 4, { expr: 'whistle', look: -0.6, facing: -1 }), R([-0.95, 0, 0.6])));
      out.push(card(T, 'nav', NAV, fo(f, 6, { expr: 'whistle', look: 0.6, facing: 1 }), R([0.95, 0, 0.6])));
      out.push(card(T, 'eng2', ENG2, fo(f, 5, { expr: 'neutral', look: -0.3 }), R([-2.1, 0, -1.2])));
      out.push(card(T, 'nav2', NAV2, fo(f, 7, { expr: 'neutral', look: 0.3 }), R([2.1, 0, -1.2]))); break;
    case 'nosignal': {
      const e = f < F_NEVER + 10 ? 'shock' : 'dazed';
      [[ENG, -1.0, 4], [NAV, 1.0, 6], [ENG2, -2.1, 5], [NAV2, 2.1, 7]].forEach(([o, x, sd], i) => out.push(card(T, 'p' + i, o, fo(f, sd, { expr: i < 2 ? e : 'pained', look: x > 0 ? -0.3 : 0.3 }), R([x, 0, -2.0 - (i > 1 ? 1.4 : 0)]))));
      break;
    }
    case 'fix': out.push(card(T, 'eng', ENG, fo(f, 4, { expr: 'pained', look: 0.4, facing: 1 }), R([-4.0, 0, 0.6]), { calc: true })); break;
  }
  return out;
}
function fxAt(f, T, cam) {
  const S = shotAt(f), out = [], o = orbState(f), push = (x) => x && out.push(x);
  if (o.fire > 0.01) { const t = q((f % 12) / 12, 2), k = q(o.fire, 2); out.push(FX('fl' + t + k, (p) => flame(p, t, k), C(o.pos, [-0.4, 0.1, 0.4]), 4.2, { roll: 0.3, order: 4 })); }
  if (S.id === 'hook') push(wordCard(f, F_1999, '1999', cam));
  if (S.id === 'cruise') push(wordCard(f, F_NINE, '9 MONTHS', cam));
  if (S.id === 'pounds') push(wordCard(f, F_LB, 'POUNDS', cam, '#e8503a'));
  if (S.id === 'newtons') push(wordCard(f, F_N, 'NEWTONS', cam, '#6aa8f2'));
  if (S.id === 'push') push(wordCard(f, F_FOUR, '4×', cam, '#f6c83a', 1e9, 230));
  if (S.id === 'arrive') push(wordCard(f, F_57, '57 KM', cam, '#ffffff'));
  if (S.id === 'fix') push(wordCard(f, F_MULT, '× 4.45', cam, '#7ad06a'));
  if (S.id === 'cost') push(wordCard(f, F_125, '$125 MILLION', cam, '#f6c83a', 1e9, 130));
  // thruster puffs
  const puffAt = (f0, big) => { const t = (f - f0) / (big ? 24 : 14); if (t < 0 || t >= 1) return; const tq = q(t);
    out.push(FX('th' + f0 + tq, (p) => { p.g.translate(150, 600); p.g.scale(2, 2); T.fxPuff(p, tq); }, C(o.pos, [1.3 + t * (big ? 3 : 1), -0.8, 0.6]), big ? 4.5 : 1.4, { alpha: 0.95 })); };
  if (S.id === 'burns') [F_THR - 6, F_THR + 10, F_THR + 26].forEach((x) => puffAt(x, false));
  if (S.id === 'push') [F_SO + 2, F_FOUR].forEach((x, i) => puffAt(x, i === 1));
  if (S.id === 'burn' && f > F_HIT + 4) { const t = q(((f - F_HIT) % 10) / 10); out.push(FX('bb' + t, (p) => { p.g.translate(50, 250); T.fxBurst(p, t, '#fff3b0', 9, 30, 200); }, C(o.pos, [0.6, 0, 0.6]), 2.4)); }
  if (S.id === 'drift') { // little "you are here" ring on the orbiter
    const t = q((f % 20) / 20); out.push(FX('ring' + t, (p) => { p.g.translate(150, 350); T.fxRing ? T.fxRing(p, t) : null; }, C(o.pos, [0, 2, 0]), 22));
  }
  return out;
}

export default {
  TOTAL, build,
  frame(f, k) {
    const S = shotAt(f), cam = camAt(f), o = orbState(f);
    orb.position.set(...o.pos); orb.rotation.set(...o.rot); orb.visible = !ROOMSHOTS.includes(S.id);
    if (S.id === 'drift') orb.scale.setScalar(8); else orb.scale.setScalar(1);
    stars.position.set(...cam.pos);
    planned.visible = actual.visible = S.id === 'drift';
    actual.scale.setScalar(1); planned.material.emissiveIntensity = actual.material.emissiveIntensity = 0.6;
    screenMat.map = S.id === 'nosignal' && f > F_NEVER + 2 ? scrTex.none : scrTex.mars;
    const light = ROOMSHOTS.includes(S.id) ? { ...ROOMLIGHT } : { ...SPACE };
    if (S.id === 'drift') light.shadowExt = 200;
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
  },
};
