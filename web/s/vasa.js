// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The Vasa" — Stockholm harbour, 10 Aug 1628; raised 1961. Timed to stories/vasa/voice.wav via vasa_timing.js.
import { TOTAL, LINES, wf } from './vasa_timing.js';
import * as PR from '../props.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const F_1628 = wf(0, '1628'), F_SANK = wf(0, 'sank'), F_64 = wf(1, 'sixty'), F_STAT = wf(1, 'statues'), F_TOP = wf(2, 'top'), F_30 = wf(3, 'thirty'), F_RAN = wf(3, 'ran'), F_CAPS = wf(3, 'capsized'),
  F_CHEER = wf(4, 'cheered'), F_GUST = wf(5, 'gust'), F_WATER = wf(5, 'water'), F_SANK2 = wf(6, 'sank'), F_333 = wf(7, 'three'), F_RAISED = wf(7, 'raised'), F_MILL = wf(8, 'millions'), F_MILE = wf(8, 'mile');
const SHOTS = [['hook', 0], ['proud', cut(1)], ['statues', F_STAT - 6], ['heavy', cut(2)], ['test', cut(3)], ['capsize', F_CAPS - 12], ['quay', cut(4)], ['gust', cut(5)], ['ports', F_WATER - 4],
  ['sink', cut(6)], ['raise', cut(7)], ['museum', cut(8)]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const DAY = { az: 150, el: 34, sky: '#dbe6f4', ground: '#8a8a78', hemi: 1.15, sun: '#fff0d8', sunI: 2.5, fog: '#d6e2ee', fogNear: 150, fogFar: 1000,
  skyTop: '#4a86d0', skyHor: '#e0e8f0', sat: 1.1, vig: 0.22, shadowExt: 40 };
const GREY = { ...DAY, sunI: 1.4, hemi: 1.3, skyTop: '#7f95b0', skyHor: '#d0d8e0', fog: '#c8d0da', sat: 0.85, vig: 0.3 };
const HALL = { az: 120, el: 70, sky: '#c8b89a', ground: '#4a4038', hemi: 1.0, sun: '#ffe8c8', sunI: 2.0, fog: '#2a2a34', fogNear: 60, fogFar: 260,
  skyTop: '#2a2a34', skyHor: '#2a2a34', sat: 1.05, vig: 0.34, shadowExt: 40 };
const QUAYZ = 34, MUS = [0, 0, -3000];
let K, ship, hull, masts, sails = [], lids = [], guns = [], sea, rigging = [];
const rnd = (() => { let s = 13; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();

function buildShip() {
  const { THREE } = K; ship = K.group(); hull = K.group(ship);
  // hull: deformed box, bow at +x, sheer rising to a high stern
  const g = new THREE.BoxGeometry(40, 11, 11, 40, 10, 10), P = g.attributes.position;
  for (let i = 0; i < P.count; i++) {
    let x = P.getX(i), y = P.getY(i) + 1.5, z = P.getZ(i); const ax = Math.abs(x) / 20, yb = clamp((y + 4) / 11);
    let w = x > 0 ? 1 - Math.pow(ax, 2.2) * 0.85 : 1 - Math.pow(ax, 4) * 0.3;
    w *= 0.5 + 0.5 * Math.pow(yb, 0.45); z *= w; y += (x < 0 ? 0.004 : 0.0025) * x * x * (yb > 0.5 ? 1 : 0.4);
    if (y < -3.6) y = -3.6 + (y + 3.6) * 0.3; P.setXYZ(i, x, y, z);
  }
  g.computeVertexNormals();
  const plank = K.toon({ map: PR.canvasTex(512, 256, (c) => { c.fillStyle = '#7a4e2c'; c.fillRect(0, 0, 512, 256); for (let y = 0; y < 256; y += 16) { c.fillStyle = `rgba(0,0,0,${0.12 + (y % 32 ? 0.05 : 0)})`; c.fillRect(0, y, 512, 3); }
    c.fillStyle = '#b8322f'; c.fillRect(0, 0, 512, 22); c.fillStyle = '#d9a93a'; c.fillRect(0, 22, 512, 6); }, [3, 1]) });
  hull.userData.mat = plank; K.add(g, plank, 0, 0, 0, hull);
  // deck + stern castle with gold carvings + figurehead
  K.slab(-19, 18, 7.0, 7.3, -4.6, 4.6, K.col('#b08a5e'), hull);
  const gold = K.toon({ color: '#e0b040', emissive: '#3a2800' });
  const stern = K.group(hull); stern.position.set(-19, 0, 0);
  K.slab(-1.8, 5, 7.2, 12.5, -4.4, 4.4, K.col('#2f4f8a'), stern);
  const carv = K.toon({ map: PR.canvasTex(256, 384, (c) => { c.fillStyle = '#2f4f8a'; c.fillRect(0, 0, 256, 384); c.fillStyle = '#e0b040'; c.strokeStyle = '#7a5a1a'; c.lineWidth = 4;
    for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) { const x = 32 + k * 64, y = 40 + r * 92; c.beginPath(); c.ellipse(x, y, 14, 16, 0, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.ellipse(x, y + 40, 18, 26, 0, 0, 7); c.fill(); c.stroke(); }
    c.fillRect(0, 0, 256, 10); c.fillRect(0, 374, 256, 10); for (let k = 0; k < 5; k++) c.fillRect(k * 64 - 4, 0, 8, 384); }) });
  K.slab(-2.2, -1.6, 4, 13.2, -4.6, 4.6, carv, stern);
  for (let i = 0; i < 6; i++) K.sphere(0.5, gold, -2.3, 5 + i * 1.4, (i % 2 ? 1 : -1) * 2.6, stern);
  K.slab(-2.5, 5.2, 12.5, 13.0, -4.6, 4.6, gold, stern);
  const head = K.add(new THREE.ConeGeometry(0.9, 5, 10), gold, 21.5, 6.5, 0, hull); head.rotation.z = -1.1;
  K.sphere(1.0, gold, 23.2, 7.6, 0, hull);
  // gun ports: two rows of red lids per side, bronze barrels
  const red = K.col('#c0302a'), bronze = K.toon({ color: '#b07a3a', emissive: '#2a1808' });
  for (const s of [-1, 1]) for (let row = 0; row < 2; row++) for (let i = 0; i < 12; i++) {
    const x = -14 + i * 2.6 + row * 1.3, y = 2.2 + row * 2.4, zz = s * (5.5 * (1 - Math.pow(Math.abs(x) / 20, x > 0 ? 2.2 : 4) * (x > 0 ? 0.85 : 0.3)) * (0.5 + 0.5 * Math.pow(clamp((y + 4) / 11), 0.45)) + 0.05);
    const lid = K.slab(-0.55, 0.55, 0, 1.1, -0.05, 0.05, red, hull); lid.position.set(x, y + 1.1, zz); lid.userData.s = s; lids.push(lid);
    const gun = K.add(new THREE.CylinderGeometry(0.18, 0.24, 1.6, 10), bronze, x, y + 0.55, zz + s * 0.6, hull); gun.rotation.x = Math.PI / 2; guns.push(gun);
    K.slab(x - 0.55, x + 0.55, y, y + 1.1, zz - 0.04, zz + 0.04, K.col('#1e1410'), hull).position.z = zz - s * 0.02;
  }
  // masts, yards, sails
  masts = K.group(hull); const wood = K.col('#8a6a48'), sailM = K.toon({ color: '#f2ead6', side: THREE.DoubleSide });
  [[11, 34], [-1, 40], [-12, 28]].forEach(([x, h], mi) => {
    K.cyl(0.38, 0.55, h, wood, x, 7, 0, masts);
    for (let k = 0; k < 3; k++) { const y = 7 + h * (0.35 + k * 0.24), w = 10 - k * 2.4;
      const yd = K.add(new THREE.CylinderGeometry(0.16, 0.16, w, 8), wood, x, y, 0, masts); yd.rotation.x = Math.PI / 2;
      const sg = new THREE.PlaneGeometry(w * 0.92, h * 0.21, 8, 4); const sp = sg.attributes.position; for (let j = 0; j < sp.count; j++) { const u = sp.getX(j) / (w * 0.46), v = sp.getY(j) / (h * 0.105); sp.setZ(j, 1.2 * (1 - u * u) * (1 - 0.3 * v * v)); }
      sg.computeVertexNormals(); const s = K.add(sg, sailM, x + 0.6, y - h * 0.11, 0, masts); s.rotation.y = Math.PI / 2; sails.push(s); }
  });
  // bowsprit + flag + rigging lines
  const bs = K.add(new THREE.CylinderGeometry(0.25, 0.3, 14, 8), wood, 24, 10, 0, hull); bs.rotation.z = -1.15;
  const flag = PR.canvasTex(128, 80, (c) => { c.fillStyle = '#2f5fae'; c.fillRect(0, 0, 128, 80); c.fillStyle = '#f2c230'; c.fillRect(36, 0, 14, 80); c.fillRect(0, 33, 128, 14); });
  K.add(new THREE.PlaneGeometry(5, 3), new THREE.MeshBasicMaterial({ map: flag, side: THREE.DoubleSide }), -3.5, 7 + 40 + 0.5, 0, masts).position.x = -1 - 2.6;
  const rope = K.col('#5a4a3a');
  for (const [x, h] of [[11, 34], [-1, 40], [-12, 28]]) for (const s of [-1, 1]) for (const dx of [-2, 0, 2]) { const r = K.beam(K.V(x, 7 + h * 0.9, 0), K.V(x + dx, 7.2, s * 4.6), 0.06, rope, masts); r.castShadow = false; rigging.push(r); }
}

function build(k) {
  K = k; const { THREE } = K;
  K.addClouds(12, 800, 150);
  sea = PR.ocean(K, { y: 0, shoreZ: QUAYZ, deep: '#2a5a7a', shal: '#4a8aa0', foam: '#e8f2f4' });
  // quay + Stockholm waterfront: stone quay, gabled houses, a church spire, hills
  K.slab(-300, 300, -2, 1.6, QUAYZ, QUAYZ + 30, K.texM(K.P.stone(4, 20, 6, 40, 40, 30), 30, 6, '#b8b0a2'), K.scene, false);
  const cols = ['#d9a441', '#c25a3a', '#e8d6a8', '#a8483a', '#e0b070', '#c87a50'];
  for (let x = -150; x < 150; x += 0) { const w = 7 + rnd() * 5, h = 9 + rnd() * 9, c = cols[(rnd() * 6) | 0];
    const m = K.add(new THREE.BoxGeometry(w, h, 9), K.toon({ map: PR.facadeTex(c, Math.max(2, Math.round(w / 3)), Math.round(h / 3), (rnd() * 99) | 0, '#f2ead6') }), x + w / 2, 1.6 + h / 2, QUAYZ + 16);
    const r = K.add(new THREE.ConeGeometry(w * 0.72, 5, 4), K.col(rnd() < 0.5 ? '#6a3a2a' : '#4a4f5c'), x + w / 2, 1.6 + h + 2.5, QUAYZ + 16); r.rotation.y = Math.PI / 4; r.scale.set(1, 1, 1.2); x += w + 0.3; }
  const ch = K.group(); ch.position.set(26, 1.6, QUAYZ + 30); K.slab(-4, 4, 0, 26, -4, 4, K.col('#e8d6a8'), ch); K.add(new THREE.ConeGeometry(4.5, 26, 8), K.col('#3f6a5a'), 0, 39, 0, ch);
  for (let i = 0; i < 6; i++) K.sphere(60, K.col('#6f8f4a'), -200 + i * 80, -20, QUAYZ + 120 + (i % 2) * 40, K.scene, 1.4, 0.7, 1);
  // bollards
  buildShip();
  // museum hall (far away): floor, walls, cradle
  const mh = K.group(); mh.position.set(...MUS);
  K.slab(-60, 60, -6, -5.6, -40, 40, K.col('#5a5048'), mh, false);
  K.slab(-60, 60, -6, 70, -40, -39, K.col('#3a3f4a'), mh, false); for (const s of [-1, 1]) K.slab(s * 60 - 1, s * 60 + 1, -6, 70, -40, 40, K.col('#3a3f4a'), mh, false);
  K.slab(-60, 60, 70, 71, -40, 40, K.col('#2a2e36'), mh, false); K.slab(-60, 60, -6, 70, 40, 41, K.col('#3a3f4a'), mh, false);
  for (let x = -16; x <= 16; x += 8) K.slab(x - 0.6, x + 0.6, -5.6, -2.5, -3, 3, K.col('#2a2a30'), mh, false);
  K.slab(-30, 30, -5.6, -5.2, 16, 22, K.col('#8a7a6a'), mh, false);
}

// ---------------- ship state ----------------
function shipState(f) {
  const S = shotAt(f), id = S.id, t = f / 30;
  let pos = [0, 0, 0], heel = 0.03 * Math.sin(t * 1.3), yaw = 0, raised = false, sails = true, inMus = false;
  if (id === 'hook') { heel = lerp(0.42, 0.62, M.smooth(ramp(f, 0, F_SANK + 10))); pos = [f * 0.02, -lerp(0, 3, ramp(f, F_SANK - 10, cut(1))), 0]; }
  if (id === 'proud' || id === 'statues') { pos = [(f - cut(1)) * 0.06, 0, 0]; }
  if (id === 'heavy') heel = 0.12 * Math.sin((f - cut(2)) * 0.18);
  if (id === 'test' || id === 'capsize') { const s = (f - F_RAN) / 30; heel = f < F_RAN ? 0.02 : 0.1 * Math.sin(s * 3.2) * (1 + s * 0.7); if (id === 'capsize') heel = -0.32 + 0.06 * Math.sin((f - F_CAPS) * 0.25); }
  if (id === 'quay') { pos = [-30 + (f - cut(4)) * 0.08, 0, -40]; yaw = 0; }
  if (id === 'gust' || id === 'ports') { pos = [-20, 0, -40]; heel = lerp(0.03, 0.5, M.easeOut(ramp(f, F_GUST, F_WATER + 6))); }
  if (id === 'sink') { pos = [-20, -lerp(0, 22, M.easeIn(ramp(f, F_SANK2 - 6, E(6) + 4))), -40]; heel = 0.5 + 0.2 * ramp(f, F_SANK2, E(6)); }
  if (id === 'raise') { raised = true; sails = false; pos = [0, lerp(-7, -1.2, M.smooth(ramp(f, cut(7), F_RAISED + 20))), 0]; heel = 0.06; }
  if (id === 'museum') { raised = true; sails = false; inMus = true; pos = [MUS[0], MUS[1] - 1.2, MUS[2]]; heel = 0; yaw = 0; }
  return { pos, heel, yaw, raised, sails, inMus };
}

// ---------------- cameras ----------------
const C = (p, d) => [p[0] + d[0], p[1] + d[1], p[2] + d[2]];
const CAMS = {
  hook: [{ f: 0, pos: [46, 4, 28], look: [-6, 11, 0], fov: 48 }, { f: F_SANK, pos: [36, 3.5, 24], look: [0, 10, 0], fov: 46 }, { f: cut(1), pos: [32, 3, 22], look: [0, 8, 0], fov: 46 }],
  proud: [{ f: cut(1), pos: [52, 8, 50], look: [0, 16, 0], fov: 50 }, { f: F_64 - 4, pos: [40, 6, 38], look: [0, 12, 0], fov: 48 }, { f: F_STAT - 6, pos: [22, 4, 20], look: [4, 5, 0], fov: 44 }],
  statues: [{ f: F_STAT - 6, pos: [-38, 9, 20], look: [-21, 9, 0], fov: 44 }, { f: cut(2), pos: [-34, 8.5, 16], look: [-21, 9, 0], fov: 42 }],
  heavy: [{ f: cut(2), pos: [62, 4, 0.1], look: [0, 16, 0], fov: 46 }, { f: cut(3), pos: [56, 4, 0.1], look: [0, 16, 0], fov: 46 }],
  test: [{ f: cut(3), pos: [13, 10.4, 3.5], look: [3, 8.6, 0], fov: 46 }, { f: F_RAN + 10, pos: [14.5, 10.8, 5], look: [3.2, 8.9, 0], fov: 48 }],
  capsize: [{ f: F_CAPS - 12, pos: [52, 3, 0.1], look: [0, 12, 0], fov: 46 }, { f: cut(4), pos: [48, 3, 0.1], look: [0, 12, 0], fov: 46 }],
  quay: [{ f: cut(4), pos: [0, 4.4, QUAYZ + 9], look: [-6, 6, -20], fov: 46 }, { f: F_CHEER, pos: [2, 3.8, QUAYZ + 7], look: [-4, 4, -10], fov: 44 }, { f: cut(5), pos: [3, 4.6, QUAYZ + 6], look: [-12, 8, -40], fov: 40 }],
  gust: [{ f: cut(5), pos: [10, 6, 0], look: [-20, 12, -40], fov: 46 }, { f: F_WATER - 4, pos: [8, 5, -6], look: [-20, 9, -40], fov: 44 }],
  ports: [{ f: F_WATER - 4, pos: [-6, 3, -18], look: [-16, 2.5, -36], fov: 44 }, { f: cut(6), pos: [-8, 2.6, -21], look: [-17, 2, -36], fov: 42 }],
  sink: [{ f: cut(6), pos: [0, 4.0, QUAYZ + 4], look: [-12, 6, -20], fov: 46 }, { f: F_SANK2 + 30, pos: [12, 8, 4], look: [-20, 6, -40], fov: 48 }, { f: cut(7), pos: [10, 7, 0], look: [-20, 4, -40], fov: 48 }],
  raise: [{ f: cut(7), pos: [24, 2.2, 26], look: [2, 5, 0], fov: 50 }, { f: F_RAISED, pos: [20, 1.6, 20], look: [0, 6, 0], fov: 48 }, { f: cut(8), pos: [18, 1.8, 18], look: [0, 7, 0], fov: 48 }],
  museum: [{ f: cut(8), pos: [2, -3.0, 25], look: [0, -1.0, 0], fov: 48 }, { f: F_MILE - 10, pos: [10, -2.6, 30], look: [0, 3.0, 0], fov: 48 }, { f: TOTAL - 1, pos: [30, -1.0, 40], look: [0, 9, 0], fov: 48 }],
};
const KICKS = [{ f: F_SANK, a: 0.05 }, { f: F_CAPS, a: 0.05 }, { f: F_WATER, a: 0.05 }, { f: F_SANK2, a: 0.04 }];
const camAt = (f) => {
  const S = shotAt(f); let c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS });
  if (S.id === 'museum') { c.pos = C(MUS, c.pos); c.look = C(MUS, c.look); }
  if (['proud', 'statues'].includes(S.id)) { const p = shipState(f).pos; c.pos = C(p, c.pos); c.look = C(p, c.look); }
  c.shadowAt = S.id === 'museum' ? MUS : S.id === 'quay' ? [0, 2, QUAYZ + 3] : shipState(f).pos;
  return c;
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => {
  const S = shotAt(f);
  if (S.id === 'quay') return { focus: dist(Cm.pos, [0, 2.8, QUAYZ + 2]), cinf: 8 };
  if (S.id === 'test') return { focus: dist(Cm.pos, [3, 8.4, 0]), cinf: 7 };
  if (S.id === 'museum' && f < F_MILL + 10) return { focus: dist(Cm.pos, C(MUS, [0, -4.0, 19.3])), cinf: 8 };
  return { focus: 10, cinf: 0 };
};

// ---------------- world pose ----------------
function poseWorld(f) {
  const st = shipState(f);
  ship.position.set(...st.pos); ship.rotation.set(st.heel, st.yaw, 0);
  sea.U.t.value = f / 30;
  sails.forEach((s) => (s.visible = st.sails)); rigging.forEach((r) => (r.visible = st.sails));
  masts.scale.y = st.raised ? 0.32 : 1;
  hull.userData.mat.color.set(st.raised ? '#7a6a5a' : '#ffffff');
}

// ---------------- characters ----------------
const SAILOR = (c, o = {}) => ({ jacket: c, pants: '#e9e6da', boots: '#3a2a20', hat: 'cap', cap: '#3a3e52', ...o });
const SAILORS = [SAILOR('#3b4f7a'), SAILOR('#7a4e2c', { skin: '#f5c9a0' }), SAILOR('#5a6a4a', { moustache: '#4a3426' }), SAILOR('#8a3a32', { skin: '#c99067' }), SAILOR('#3b4f7a', { hat: 'hair', hair: '#d9a441' }), SAILOR('#6a5a4a')];
const CAPT = { jacket: '#1f2a44', pants: '#3a3e52', boots: '#2a2420', hat: 'tophat', moustache: '#6a4a30', sash: '#c8402e', buttons: '#e8c45a', build: 'stout' };
const TOWN = [
  { jacket: '#8a3a32', pants: '#3b3f52', boots: '#3a2a20', hat: 'tophat' },
  { jacket: '#2f5fae', pants: '#4a4038', boots: '#3a2a20', hat: 'bonnet', dress: '#2f5fae', skin: '#f5c9a0' },
  { jacket: '#5a6a4a', pants: '#3b3f52', boots: '#3a2a20', hat: 'hair', hair: '#d9a441', moustache: '#d9a441' },
  { jacket: '#c87a50', pants: '#3b3f52', boots: '#3a2a20', hat: 'bonnet', dress: '#c87a50' },
  { jacket: '#3a3e52', pants: '#3b3f52', boots: '#3a2a20', hat: 'tophat', skin: '#c99067' },
  { jacket: '#a8483a', pants: '#3b3f52', boots: '#3a2a20', hat: 'hair', hair: '#5a3b2a', dress: '#e8d6a8' },
  { jacket: '#4a4f62', pants: '#3b3f52', boots: '#3a2a20', hat: 'hair', hair: '#1e1714' },
];
const VISIT = [
  { jacket: '#e2742d', pants: '#3b4f7a', boots: '#4a3426', hat: 'hair', hair: '#5a3b2a' },
  { jacket: '#5a8fc2', pants: '#6a5a4a', boots: '#4a3426', hat: 'hair', hair: '#d9a441', dress: '#c25a7a', skin: '#f5c9a0' },
  { jacket: '#3f8a5a', pants: '#3b3f52', boots: '#2a2420', hat: 'cap', cap: '#c8402e', skin: '#c99067' },
  { jacket: '#d9a441', pants: '#4a4f62', boots: '#4a3426', hat: 'hair', hair: '#1e1714', build: 'kid' },
  { jacket: '#7b5ac9', pants: '#3b3f52', boots: '#4a3426', hat: 'hair', hair: '#8a4a2a' },
];
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
// a point on the (heeled) ship in world space
const onShip = (st, local) => { const v = new K.THREE.Vector3(...local); v.applyEuler(new K.THREE.Euler(st.heel, st.yaw, 0)); return [v.x + st.pos[0], v.y + st.pos[1], v.z + st.pos[2]]; };

function actorsAt(f, T) {
  const S = shotAt(f), out = [], st = shipState(f);
  switch (S.id) {
    case 'test': case 'capsize': {
      const run = f >= F_RAN, s = run ? (f - F_RAN) / 30 : 0;
      SAILORS.forEach((o, i) => { const zz = run ? 3.6 * Math.sin(s * 3.2 + 0.2) : -3 + (i % 3) * 0.6, x = 0 + i * 1.3;
        const p = onShip(st, [x, 7.3, zz]);
        out.push(card(T, 'sl' + i, o, fo(f, 10 + i, { expr: f > F_CAPS - 8 ? 'shock' : run ? 'grin' : 'neutral', mode: run ? 'march' : 'stand', phase: q((f * 0.09 + i * 0.3) % 1), look: 0 }), p, { roll: -st.heel * 0.6, blob: false })); });
      out.push(card(T, 'capt', CAPT, fo(f, 3, { expr: f > F_CAPS - 8 ? 'shock' : 'stern', look: 0.4 }), onShip(st, [7.5, 7.3, 1.5]), { roll: -st.heel * 0.6, blob: false }));
      break;
    }
    case 'quay': case 'sink': {
      TOWN.forEach((o, i) => { const x = -6 + i * 1.7 + (i % 2) * 0.3, z = QUAYZ + 2.2 + (i % 3) * 0.9, cheer = S.id === 'quay' && f > F_CHEER - 6;
        const e = S.id === 'sink' ? (i % 2 ? 'shock' : 'pained') : cheer ? ['grin', 'laugh', 'smile'][i % 3] : 'smile';
        out.push(card(T, 'tw' + i, o, fo(f, 20 + i, { expr: e, look: -0.4, wave: cheer && i % 2 === 0 ? q(Math.sin(f * 0.4 + i), 1) : undefined, tilt: q(idle(f, i).tilt, 1) }), [x, 1.6, z])); });
      break;
    }
    case 'museum': VISIT.forEach((o, i) => { const x = -0.3 + i * 0.85, z = 19 + (i % 2) * 0.7;
      out.push(card(T, 'v' + i, o, fo(f, 30 + i, { expr: f > F_MILL ? ['smile', 'grin', 'shock'][i % 3] : 'neutral', look: -0.5, facing: -1 }), C(MUS, [x, -5.2, z]))); }); break;
  }
  return out;
}
function fxAt(f, T, cam) {
  const S = shotAt(f), out = [], st = shipState(f), push = (x) => x && out.push(x);
  const splashAt = (local, f0, s = 3, per = 14) => { const t = (((f - f0) % per) + per) % per / per; if (f < f0) return; const tq = q(t, 1);
    out.push(FX('sp' + local.join() + tq, (p) => { p.g.translate(150, 500); T.fxSplash(p, tq); }, onShip(st, local), s)); };
  if (S.id === 'hook') { push(wordCard(f, F_1628, '1628', cam)); for (let i = 0; i < 4; i++) splashAt([-8 + i * 5, 2.4, 5.6], i * 3, 3.4); }
  if (S.id === 'proud') push(wordCard(f, F_64, '64 CANNONS', cam));
  if (S.id === 'heavy') push(wordCard(f, F_TOP, 'TOP-HEAVY', cam, '#e8503a'));
  if (S.id === 'test') push(wordCard(f, F_30, '30 SAILORS', cam));
  if (S.id === 'capsize') push(wordCard(f, F_CAPS, 'WHOA!', cam, '#ffffff'));
  if (S.id === 'gust' && f > F_GUST - 4) { for (let i = 0; i < 4; i++) { const t = q(((f - F_GUST) / 16 + i * 0.25) % 1, 1); out.push(FX('wind' + i + t, (p) => { p.g.globalAlpha = Math.sin(t * Math.PI); p.stroke([[60 + t * 300, 400 + i * 50], [260 + t * 300, 380 + i * 50], [400 + t * 300, 410 + i * 50]], 14, '#ffffff'); }, [-6, 14 + i * 2, -26], 6)); } }
  if (S.id === 'ports') for (let i = 0; i < 5; i++) splashAt([-10 + i * 5, 2.6, 5.7], F_WATER + i * 2, 3.0, 12);
  if (S.id === 'sink') { if (f > F_SANK2) for (let i = 0; i < 3; i++) { const t = q(((f - F_SANK2) / 20 + i * 0.33) % 1, 1); out.push(FX('bub' + i + t, (p) => { p.g.translate(150, 500); T.fxSplash(p, t); }, [-26 + i * 6, 0.2, -38], 5)); } }
  if (S.id === 'raise') { push(wordCard(f, F_333, '333 YEARS', cam)); if (f > cut(7) + 10) for (let i = 0; i < 4; i++) splashAt([-12 + i * 8, 1 - st.pos[1] - 1.0, 5.4], i * 4, 3.2, 16); }
  if (S.id === 'museum') push(wordCard(f, F_MILL, 'MILLIONS', cam));
  return out;
}

export default {
  TOTAL, build,
  frame(f, k) {
    poseWorld(f);
    const S = shotAt(f), cam = camAt(f);
    const light = S.id === 'museum' ? { ...HALL } : ['sink'].includes(S.id) ? { ...GREY } : { ...DAY };
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
  },
};
