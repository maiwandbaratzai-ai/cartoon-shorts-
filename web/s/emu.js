// "The Great Emu War" — Campion, Western Australia, Nov 1932. Timed to stories/emu/voice.wav via emu_timing.js.
import { TOTAL, LINES, wf } from './emu_timing.js';
import * as PR from '../props.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], cut = (i) => Math.max(0, A(i) - 4);
const F_LOST = wf(0, 'lost'), F_SCAT = wf(3, 'scattered'), F_AIM = wf(3, 'aimed'), F_FAST = wf(4, 'faster'), F_TRUCK = A(4), F_2500 = wf(5, 'twenty'), F_WON = wf(6, 'won'), F_PULL = wf(6, 'pulled');
const SHOTS = [['hook', 0], ['field', cut(1)], ['army', cut(2)], ['aim', cut(3)], ['truck', cut(4)], ['bullets', cut(5)], ['won', cut(6)]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];
const LIGHT = { az: 60, el: 46, sky: '#dce6f4', ground: '#b08a5a', hemi: 1.1, sun: '#fff0d8', sunI: 2.6, fog: '#e6dccb', fogNear: 120, fogFar: 900,
  skyTop: '#3f7fd2', skyHor: '#f0e2c8', sat: 1.12, vig: 0.22, shadowExt: 24 };
const ROADZ = 7, GUNZ = 14;
let K, truck, guns = [], casings;
const rnd = (() => { let s = 11; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();

const lewis = (parent) => {
  const g = K.group(parent), dark = K.col('#2e3236'), wood = K.col('#7a5234');
  for (const a of [0, 2.1, 4.2]) K.beam(K.V(0, 0.75, 0), K.V(Math.cos(a) * 0.55, 0, Math.sin(a) * 0.55), 0.05, dark, g);
  const body = K.group(g); body.position.set(0, 0.8, 0);
  const barrel = K.add(new K.THREE.CylinderGeometry(0.09, 0.09, 1.3, 14), dark, 0, 0, -0.45, body); barrel.rotation.x = Math.PI / 2;
  K.add(new K.THREE.CylinderGeometry(0.03, 0.03, 0.4, 8), dark, 0, 0, -1.25, body).rotation.x = Math.PI / 2;
  const drum = K.add(new K.THREE.CylinderGeometry(0.22, 0.22, 0.08, 20), dark, 0, 0.14, -0.1, body);
  K.slab(-0.05, 0.05, -0.12, 0.05, 0.2, 0.75, wood, body);
  g.userData.body = body; return g;
};

function build(k) {
  K = k; const { THREE } = K;
  K.addClouds(10, 800, 140);
  const dirt = K.toon({ map: PR.speckTex('#c98a55', ['#b87444', '#d89a66', '#a96a3c'], 5, 2600, 60) });
  PR.terrain(K, 900, 120, (x, z) => (Math.abs(z) > 120 ? 2 * Math.sin(x * 0.02) : 0), dirt);
  // wheat field: golden ground patch + merged wheat tufts (skip the road strip and a clearing around the guns)
  const wheatTex = K.toon({ map: PR.speckTex('#e3bd5e', ['#d4a843', '#efcf74', '#c99b3a'], 9, 2600, 30) });
  K.slab(-90, 90, 0, 0.04, -90, ROADZ - 2, wheatTex, K.scene, false);
  const mats = [], qq = new THREE.Quaternion(), e = new THREE.Euler();
  const wh = (x, z) => 0.62 + 0.1 * Math.sin(x * 0.9) * Math.sin(z * 0.7) + 0.08 * Math.sin(x * 2.3 + z * 1.7);
  const cg = new THREE.PlaneGeometry(180, 88, 360, 176); cg.rotateX(-Math.PI / 2); cg.translate(0, 0, -90 + 44 + (ROADZ - 2.6));
  { const P = cg.attributes.position; for (let i = 0; i < P.count; i++) P.setY(i, wh(P.getX(i), P.getZ(i))); cg.computeVertexNormals(); }
  const wheatTop = K.toon({ map: PR.canvasTex(256, 256, (g) => { g.fillStyle = '#e6be58'; g.fillRect(0, 0, 256, 256); let s2 = 4; const r = () => ((s2 = (s2 * 1664525 + 1013904223) >>> 0) / 4294967296);
    for (let i = 0; i < 900; i++) { g.strokeStyle = ['#d1a23d', '#f3d77e', '#c8952f'][i % 3]; g.lineWidth = 2; const x = r() * 256, y = r() * 256; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 3, y - 9); g.stroke(); } }, [90, 44]) });
  K.add(cg, wheatTop, 0, 0, 0, K.scene, { cast: false });
  // fringe of seed heads along the front edge so the field reads as wheat
  for (let i = 0; i < 900; i++) { const x = -90 + rnd() * 180, z = ROADZ - 2.6 - rnd() * 1.2; e.set((rnd() - 0.5) * 0.4, rnd() * 3, (rnd() - 0.5) * 0.4); qq.setFromEuler(e);
    mats.push(new THREE.Matrix4().compose(new THREE.Vector3(x, 0.62 + rnd() * 0.12, z), qq, new THREE.Vector3(1, 1, 1))); }
  K.add(PR.mergeCopies(new THREE.CapsuleGeometry(0.05, 0.22, 2, 5), mats), K.col('#d9ad46'), 0, 0, 0, K.scene, { cast: false });
  K.slab(-90, 90, 0, 0.62, ROADZ - 2.62, ROADZ - 2.58, K.col('#c99a3c'), K.scene, false);
  // road + fence + gum trees + farmhouse
  K.slab(-200, 200, 0, 0.03, ROADZ - 2, ROADZ + 2, K.col('#b07a4c'), K.scene, false);
  const post = K.col('#8a6a48');
  for (let x = -60; x <= 60; x += 3) { K.slab(x - 0.07, x + 0.07, 0, 1.1, ROADZ - 2.4, ROADZ - 2.26, post, K.scene); }
  K.slab(-60, 60, 0.85, 0.9, ROADZ - 2.36, ROADZ - 2.3, post, K.scene); K.slab(-60, 60, 0.5, 0.55, ROADZ - 2.36, ROADZ - 2.3, post, K.scene);
  const gum = (x, z, h = 9) => { K.cyl(0.25, 0.4, h, K.col('#e8e0d0'), x, 0, z); for (let i = 0; i < 4; i++) K.sphere(1, K.col('#7f9460'), x + (rnd() - 0.5) * 3, h - 0.5 + rnd() * 2, z + (rnd() - 0.5) * 3, K.scene, 2.4, 1.4, 2.2); };
  [[-38, -60], [-20, -75], [26, -66], [44, -52], [60, -80], [-55, 30], [30, 34], [-15, 40]].forEach(([x, z]) => gum(x, z, 8 + rnd() * 4));
  const fh = K.group(); fh.position.set(34, 0, -48);
  K.slab(-5, 5, 0, 3.4, -4, 4, K.col('#efe6d2'), fh); const roof = K.add(new THREE.ConeGeometry(7.4, 2.6, 4), K.col('#a4a8ae'), 0, 4.7, 0, fh); roof.rotation.y = Math.PI / 4; roof.scale.set(1, 1, 0.8);
  // windmill
  const wm = K.group(); wm.position.set(-26, 0, -40); K.cyl(0.15, 0.4, 10, K.col('#9aa0a8'), 0, 0, 0, wm);
  for (let i = 0; i < 8; i++) { const b = K.slab(-0.12, 0.12, 0, 1.6, -0.02, 0.02, K.col('#c9ced6'), wm); b.position.set(0, 10, 0.4); b.geometry.translate(0, 0.8, 0); b.rotation.z = i * Math.PI / 4; }
  // the guns + ammo
  [-1.6, 1.8].forEach((x) => { const g = lewis(); g.position.set(x, 0, GUNZ); guns.push(g); });
  for (let i = 0; i < 4; i++) PR.crate(K, 'AMMO', '#5d6b4a').position.set(-5.2 + (i % 2) * 1.0, (i > 1 ? 0.55 : 0), GUNZ + 0.6 + (i % 2) * 0.1);
  truck = PR.oldTruck(K); truck.root.position.set(-12, 0, ROADZ);
  const truckGun = lewis(truck.root); truckGun.position.set(-1.4, 0.95, 0); truckGun.rotation.y = -Math.PI / 2; truck.gun = truckGun;
  // brass casings pile (shown from the 'bullets' shot)
  const cm = []; for (let i = 0; i < 900; i++) { const r = Math.pow(rnd(), 0.6) * 2.4, a = rnd() * 6.28, h = Math.max(0, 0.9 - r * 0.38) * rnd();
    e.set(rnd() * 3, rnd() * 3, rnd() * 3); qq.setFromEuler(e); cm.push(new THREE.Matrix4().compose(new THREE.Vector3(Math.cos(a) * r, 0.03 + h, Math.sin(a) * r), qq, new THREE.Vector3(1, 1, 1))); }
  casings = K.add(PR.mergeCopies(new THREE.CylinderGeometry(0.03, 0.03, 0.2, 6), cm), K.toon({ color: '#d9a93a', emissive: '#3a2a08' }), 2.2, 0, GUNZ + 2.2);
}

// ---------------- emus ----------------
const NE = 26;
const HOME = Array.from({ length: NE }, (_, i) => { const a = i * 2.39996, r = 2.5 + Math.sqrt(i) * 2.3; return [Math.cos(a) * r * 0.85, -6 + Math.sin(a) * r * 1.1]; });
const emuState = (i, f) => {
  const S = shotAt(f), [hx, hz] = HOME[i], seed = i * 37.1;
  let x = hx + Math.sin(f * 0.01 + seed) * 0.8, z = hz + Math.cos(f * 0.013 + seed) * 0.5, mode = ((f + i * 23) % 140) < 70 ? 'peck' : 'stand', speed = 0, dir = Math.sin(seed) > 0 ? 1 : -1;
  if (S.id === 'aim' && f >= F_SCAT) { // scatter radially from the gun line
    const s = (f - F_SCAT) / 30, ang = Math.atan2(hz - GUNZ, hx) + (Math.sin(seed) * 0.6), v = 4.5 + (i % 5) * 1.0;
    x = hx + Math.cos(ang) * v * s * 0.6 + (Math.sin(seed * 3) * 7) * s; z = hz + Math.sin(ang) * v * s * 0.6; mode = 'run'; speed = v; dir = Math.cos(ang) + Math.sin(seed * 3) > 0 ? 1 : -1;
  }
  return { x, z, mode, speed, dir };
};
const truckX = (f) => -12 + 7.5 * Math.max(0, f - F_TRUCK) / 30;
const runEmu = (i, f) => { // truck shot: a mob running ahead along the road, pulling away after "faster"
  const s = Math.max(0, f - F_TRUCK) / 30, extra = Math.max(0, f - F_FAST) / 30, lane = (i % 4) - 1.5;
  const x = -4 + (i % 6) * 2.2 + 7.5 * s + 6 * extra * extra * 0.5 + 3 * extra, z = ROADZ + lane * 1.6 + (i % 3) * 0.4;
  return { x, z, mode: 'run', speed: 9, dir: 1 };
};

// ---------------- cameras ----------------
const CAMS = {
  hook: [{ f: 0, pos: [2.8, 2.5, 21.5], look: [-0.2, 1.3, 4], fov: 42 }, { f: cut(1), pos: [2.4, 2.3, 20], look: [-0.2, 1.3, 4], fov: 40 }],
  field: [{ f: cut(1), pos: [1.5, 4.2, 10], look: [0, 0.9, -12], fov: 46 }, { f: cut(2), pos: [1.0, 3.2, 7], look: [0, 1.0, -12], fov: 44 }],
  army: [{ f: cut(2), pos: [-2.8, 1.9, 25], look: [-0.8, 1.3, GUNZ], fov: 40 }, { f: cut(3), pos: [2.8, 1.9, 25], look: [0.8, 1.3, GUNZ], fov: 40 }],
  aim: [{ f: cut(3), pos: [-0.9, 1.6, GUNZ + 2.4], look: [-1.6, 0.9, -5], fov: 40 }, { f: F_SCAT, pos: [-0.9, 1.58, GUNZ + 2.1], look: [-1.6, 0.9, -5], fov: 34 },
    { f: cut(4), pos: [-1.0, 3.2, GUNZ + 4], look: [-1.4, 0.8, -6], fov: 44 }],
  bullets: [{ f: cut(5), pos: [8, 2.4, GUNZ + 8], look: [1.5, 1.0, GUNZ], fov: 40 }, { f: cut(6), pos: [6.5, 2.2, GUNZ + 6.5], look: [1.5, 1.0, GUNZ], fov: 38 }],
  won: [{ f: cut(6), pos: [0.3, 1.0, ROADZ + 5.8], look: [0, 1.35, ROADZ], fov: 40 }, { f: TOTAL - 1, pos: [0.2, 0.9, ROADZ + 4.8], look: [0, 1.4, ROADZ], fov: 38 }],
};
const KICKS = [{ f: F_SCAT, a: 0.04 }, { f: F_SCAT + 4, a: 0.04 }, { f: F_SCAT + 8, a: 0.03 }];
const camAt = (f) => {
  const S = shotAt(f);
  let c;
  if (S.id === 'truck') { const tx = truckX(f); c = { pos: [tx - 7.5, 3.3, ROADZ + 2.8], look: [tx + 10, 1.0, ROADZ - 0.3], fov: 44, roll: 0 }; c.shadowAt = [tx + 5, 0, ROADZ]; }
  else c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS });
  if (S.id === 'aim' && f >= F_SCAT && f < F_SCAT + 30) { const s = (f % 3) - 1; c.look = [c.look[0] + s * 0.05, c.look[1] + s * 0.04, c.look[2]]; }
  if (['hook', 'army', 'bullets'].includes(S.id)) c.shadowAt = [0, 0, GUNZ];
  return c;
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => {
  const S = shotAt(f);
  if (S.id === 'army') return { focus: dist(Cm.pos, [Cm.look[0], 1.3, GUNZ]), cinf: 9 };
  if (S.id === 'won') return { focus: dist(Cm.pos, [0, 1.5, ROADZ]), cinf: 12 };
  if (S.id === 'bullets') return { focus: dist(Cm.pos, [1.5, 1.2, GUNZ]), cinf: 8 };
  return { focus: 10, cinf: 0 };
};

// ---------------- world pose ----------------
function poseWorld(f) {
  const S = shotAt(f);
  const tx = truckX(f); truck.root.position.x = S.id === 'won' ? -30 + 0 * tx : tx; truck.root.visible = S.id === 'truck' || S.id === 'won';
  if (S.id === 'won') { const s = Math.max(0, f - F_PULL) / 30; truck.root.position.set(-5 - 6 * s, 0, ROADZ - 1.2); truck.root.rotation.y = Math.PI; }
  else truck.root.rotation.y = 0;
  truck.wheels.forEach((w) => { w.rotation.y = -tx / 0.48; });
  truck.gun.userData.body.rotation.x = Math.sin(f * 0.6) * (S.id === 'truck' ? 0.04 : 0);
  guns.forEach((g, i) => { g.visible = S.id !== 'truck' && S.id !== 'won'; g.userData.body.rotation.y = S.id === 'aim' ? 0.15 * Math.sin((f - F_AIM) * 0.06 + i) * clamp((f - F_AIM) / 20) : 0; });
  casings.visible = S.id === 'bullets' || S.id === 'won';
  casings.scale.setScalar(S.id === 'bullets' ? lerp(0.5, 1, M.smooth(ramp(f, A(5), F_2500 + 20))) : 1);
}

// ---------------- characters ----------------
const KHAKI = { jacket: '#8a7a52', pants: '#6f6446', boots: '#3a2a20', hat: 'cap', cap: '#6f6446', belt: '#5a4a32', buttons: '#c9a640' };
const SOLDIERS = [{ ...KHAKI }, { ...KHAKI, skin: '#f5c9a0', moustache: '#4a3426' }];
const MAJOR = { ...KHAKI, jacket: '#7d6e4a', moustache: '#5a3b2a', sash: '#a83a32', build: 'stout', buttons: '#e8c45a' };
const FARMER = { jacket: '#5a8fc2', pants: '#6a5a4a', boots: '#4a3426', hat: 'hair', hair: '#8a6a48', moustache: '#8a6a48', skin: '#f5c9a0' };
const LIGHT2D = -2.1;
const fo = (f, seed, o) => ({ mode: 'stand', light: LIGHT2D, seed, blink: blinkAt(f, seed), ...o });
const card = (T, key, o, opts, pos, extra = {}) => ({ key: key + JSON.stringify(opts), draw: (p) => (opts.side ? T.bodySide(p, o, opts) : T.bodyFront(p, o, opts)), x: pos[0], y: pos[1], z: pos[2], ...extra });
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
const emuCard = (i, st, f, s = 0.92) => {
  const ph = st.mode === 'run' ? q(((f * 0.13 + i * 0.37) % 1), 1) : 0, look = st.mode === 'stand' ? q(Math.sin(f * 0.05 + i), 0) : 0;
  return { key: `emu${st.mode}${ph}${look}`, draw: (p) => PR.emu(p, ph, st.mode, look), x: st.x, y: st.mode === 'run' ? 0 : 0, z: st.z, s, flip: st.dir < 0 };
};
const crew = (f, T, out, exprs, extra = {}) => {
  out.push(card(T, 'maj', MAJOR, fo(f, 7, { expr: exprs[0], look: 0.2, tilt: q(idle(f, 7).tilt, 1), ...extra.maj }), [0.1, 0, GUNZ + 0.8]));
  out.push(card(T, 's0', SOLDIERS[0], fo(f, 8, { expr: exprs[1], look: -0.3, ...extra.s }), [-1.6, 0, GUNZ + 1.0]));
  out.push(card(T, 's1', SOLDIERS[1], fo(f, 9, { expr: exprs[2], look: 0.3, ...extra.s }), [1.8, 0, GUNZ + 1.0]));
};

function actorsAt(f, T) {
  const S = shotAt(f), out = [];
  const flock = (n = NE, s = 0.92) => { for (let i = 0; i < n; i++) out.push(emuCard(i, emuState(i, f), f, s)); };
  switch (S.id) {
    case 'hook': crew(f, T, out, f < F_LOST - 6 ? ['stern', 'stern', 'stern'] : ['dazed', 'nervous', 'dazed']); flock(); break;
    case 'field': flock(); out.push(card(T, 'farm', FARMER, fo(f, 3, { expr: 'pained', wave: q(Math.sin(f * 0.45), 1) }), [8, 0, ROADZ - 1.4])); break;
    case 'army': crew(f, T, out, f > A(2) + 40 ? ['grin', 'stern', 'stern'] : ['stern', 'stern', 'stern']); flock(10); break;
    case 'aim': flock(); break;
    case 'truck': for (let i = 0; i < 14; i++) out.push(emuCard(i, runEmu(i, f), f));
      out.push(card(T, 'tg', SOLDIERS[0], fo(f, 8, { expr: f > F_FAST ? 'shock' : 'stern', look: 0.4 }), [truckX(f) - 1.4, 0.95, ROADZ + 0.5], { blob: false }));
      out.push(card(T, 'tm', MAJOR, fo(f, 7, { expr: f > F_FAST ? 'pained' : 'nervous', look: 0.4 }), [truckX(f) - 2.4, 0.95, ROADZ - 0.3], { blob: false })); break;
    case 'bullets': crew(f, T, out, ['dazed', 'pained', 'dazed']); flock(); break;
    case 'won': {
      for (let i = 0; i < 12; i++) { const st = emuState(i, f); out.push(emuCard(i, st, f)); }
      const hero = { x: 0, z: ROADZ, mode: 'stand', dir: f >= F_WON ? -1 : 1 }; out.push(emuCard(99, hero, f, 1.05));
      break;
    }
  }
  return out;
}
function fxAt(f, T) {
  const S = shotAt(f), out = [];
  if (S.id === 'aim' && f >= F_SCAT - 2 && f < F_SCAT + 30 && f % 3 !== 2) { const t = q(((f - F_SCAT) % 3) / 3); out.push(FX('mf' + t, (p) => { p.g.translate(50, 250); T.fxBurst(p, 0.2 + t * 0.4, '#fff3b0', 8, 20, 160); }, [-1.6, -0.6, GUNZ - 1.3], 1.3)); }
  if (S.id === 'truck' && f > F_TRUCK + 10 && f % 4 < 2) out.push(FX('tmf', (p) => { p.g.translate(50, 250); T.fxBurst(p, 0.35, '#fff3b0', 8, 20, 160); }, [truckX(f) + 0.3, 0.65, ROADZ], 1.0));
  if (S.id === 'truck') for (let i = 0; i < 4; i++) { const t = q(((f * 0.04 + i * 0.25) % 1), 1); out.push(FX('dust' + i + t, (p) => { p.g.translate(150, 600); T.fxPuff(p, t); }, [truckX(f) - 3 - t * 4, 0.1, ROADZ + (i % 2) - 0.5], 3 + t * 2, { alpha: 0.9 })); }
  if (S.id === 'bullets' && f >= F_2500) { const t = q(Math.min(1, (f - F_2500) / 50)); out.push(FX('n2500' + t, (p) => PR.word(p, '2,500', t, '#f6c83a', 150), [0.2, 0.9, GUNZ - 1.5], 2.0)); }
  if (S.id === 'won' && f >= F_WON - 2) { const t = q(Math.min(1, (f - F_WON + 2) / 14)); out.push(FX('wonb' + t, (p) => { p.g.translate(50, 250); T.fxBurst(p, t, '#fff3b0', 12, 60, 260); }, [0, 0.3, ROADZ - 0.6], 3.2, { order: 1 })); }
  return out;
}

export default {
  TOTAL, build,
  frame(f, k) {
    poseWorld(f);
    const S = shotAt(f), cam = camAt(f), light = { ...LIGHT };
    if (['army', 'bullets', 'won', 'hook'].includes(S.id)) light.shadowExt = 14;
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T) };
  },
};
