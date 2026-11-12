// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The 1904 Olympic Marathon" — St. Louis, Missouri, 30 Aug 1904. 64 s TikTok cut. Timed via marathon_timing.js.
import { TOTAL, LINES, wf } from './marathon_timing.js';
import * as PR from '../props.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const F_1904 = wf(0, '1904'), F_RAT = wf(0, 'rat'), F_90 = wf(1, 'ninety'), F_CARS = wf(2, 'cars'), F_DUST = wf(2, 'dust'), F_WATER = wf(4, 'water'), F_12 = wf(4, 'twelve'),
  F_32 = wf(5, 'thirty'), F_14 = wf(5, 'fourteen'), F_CRAMP = wf(6, 'cramps'), F_HOP = wf(6, 'hopped'), F_11 = wf(7, 'eleven'), F_JUMP = wf(7, 'jumped'), F_FIRST = wf(7, 'first'),
  F_POSE = wf(8, 'posing'), F_FOUND = wf(8, 'found'), F_LOST = wf(9, 'lost'), F_HITCH = wf(9, 'hitchhiked'), F_APPLE = wf(10, 'rotten'), F_NAP = wf(10, 'nap'), F_4TH = wf(11, 'fourth'),
  F_DOGS = wf(12, 'dogs'), F_9TH = wf(12, 'ninth'), F_STRY = wf(13, 'strychnine'), F_HALL = wf(14, 'hallucinating'), F_CARRY = wf(14, 'carried'), F_SLOW = wf(15, 'slowest');
const SHOTS = [['hook', 0], ['heat', cut(1)], ['cars', cut(2)], ['garcia', cut(3)], ['well', cut(4)], ['start', cut(5)], ['cramp', cut(6)], ['ride', cut(7)], ['lorzfin', F_JUMP - 3],
  ['pose', cut(8)], ['broke', cut(9)], ['hitch', F_HITCH - 3], ['orchard', cut(10)], ['fourth', cut(11)], ['dogs', cut(12)], ['potion', cut(13)], ['carry', cut(14)], ['slow', cut(15)]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const HOT = { az: 150, el: 52, sky: '#f0e6d4', ground: '#b08a5a', hemi: 1.1, sun: '#fff0d0', sunI: 2.7, fog: '#ead8bc', fogNear: 120, fogFar: 800,
  skyTop: '#4f88d0', skyHor: '#f2e2c4', sat: 1.12, vig: 0.24, shadowExt: 22, gain: '#fff8ec' };
const FIN = [220, 0, 0], ORCH = [70, 0, 9], WELL = [-60, 0, 6];
let K, car, carWheels = [], clock, cornGroup;
const rnd = (() => { let s = 19; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();

const motorcar = (color = '#a8322c') => {
  const { THREE } = K, root = K.group(), c = K.col(color), dark = K.col('#2b2420'), brass = K.toon({ color: '#d9a93a', emissive: '#2a1a00' }), seat = K.col('#3a2a20');
  K.slab(-1.6, 1.4, 0.55, 1.15, -0.75, 0.75, c, root); K.slab(1.4, 1.75, 0.6, 1.25, -0.55, 0.55, brass, root);
  K.slab(-1.4, -0.4, 1.15, 1.75, -0.7, 0.7, seat, root); K.slab(-0.2, 0.6, 1.15, 1.55, -0.7, 0.7, seat, root);
  const sw = K.add(new THREE.CylinderGeometry(0.22, 0.22, 0.04, 16), dark, 0.75, 1.6, 0.3, root); sw.rotation.z = 0.9;
  for (const x of [-1.2, 1.2]) for (const z of [-0.85, 0.85]) { const w = K.add(new THREE.TorusGeometry(0.48, 0.07, 8, 24), dark, x, 0.55, z, root); carWheels.push(w);
    for (let k = 0; k < 4; k++) { const sp = K.slab(-0.02, 0.02, -0.46, 0.46, -0.02, 0.02, K.col('#c8a46a'), w); sp.rotation.z = k * Math.PI / 4; } }
  for (const z of [-0.85, 0.85]) K.slab(-1.7, 1.7, 0.95, 1.0, z - 0.12, z + 0.12, dark, root);
  return root;
};

function build(k) {
  K = k; const { THREE } = K;
  K.addClouds(9, 800, 150);
  const hAt = (x, z) => (Math.abs(z) < 9 ? 0 : (Math.abs(z) - 9) * 0.08 * (1 + Math.sin(x * 0.03)) + 1.4 * Math.sin(x * 0.02 + z * 0.03) * clamp((Math.abs(z) - 9) / 20));
  PR.terrain(K, 1200, 160, hAt, K.toon({ map: PR.speckTex('#9ab060', ['#8aa050', '#a8bc6c', '#b8b070'], 6, 2600, 60) }));
  // the dusty road + verges
  K.slab(-600, 600, 0, 0.05, -3.5, 3.5, K.toon({ map: PR.speckTex('#d2b080', ['#c09a68', '#e0c494', '#b8905e'], 4, 2600, 40) }), K.scene, false);
  const post = K.col('#8a6a48');
  for (let x = -300; x <= 300; x += 4) { if (Math.abs(x - FIN[0]) < 30) continue; K.slab(x - 0.07, x + 0.07, 0, 1.2, -4.6, -4.46, post, K.scene); }
  K.slab(-300, 300, 0.95, 1.0, -4.58, -4.5, post, K.scene); K.slab(-300, 300, 0.55, 0.6, -4.58, -4.5, post, K.scene);
  // corn field (north side) — merged stalks
  const mats = [], qq = new THREE.Quaternion(), e = new THREE.Euler();
  for (let i = 0; i < 2600; i++) { const x = -200 + rnd() * 380, z = -6 - rnd() * 34; e.set((rnd() - 0.5) * 0.15, rnd() * 3, (rnd() - 0.5) * 0.15); qq.setFromEuler(e); mats.push(new THREE.Matrix4().compose(new THREE.Vector3(x, 1.0, z), qq, new THREE.Vector3(1, 0.9 + rnd() * 0.4, 1))); }
  cornGroup = K.add(PR.mergeCopies(new THREE.ConeGeometry(0.35, 2.2, 5), mats), K.col('#6f9a3a'), 0, 0, 0, K.scene, { cast: false });
  // trees + orchard
  const tree = (x, z, s = 1, apples = false) => { K.cyl(0.25 * s, 0.35 * s, 3 * s, K.col('#6a4a30'), x, hAt(x, z), z); K.sphere(2.4 * s, K.col('#4f8a3a'), x, hAt(x, z) + 3.6 * s, z, K.scene, 1.1, 0.85, 1.1);
    if (apples) for (let i = 0; i < 9; i++) { const a = i * 0.7, r = 2.3 * s; K.sphere(0.17, K.col('#c8302a'), x + Math.cos(a) * r * 0.9, hAt(x, z) + 3.0 * s + (i % 3) * 0.6, z + Math.sin(a) * r * 0.9); } };
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) tree(ORCH[0] - 8 + i * 6, ORCH[2] - 2 + j * 6, 0.9, true);
  for (let i = 0; i < 4; i++) K.sphere(0.17, K.col('#8a5a2a'), ORCH[0] - 1.5 + i * 0.5, 0.15, ORCH[2] - 4.2 + (i % 2) * 0.4);
  [[-120, 20], [-30, 24], [30, -50], [120, 22], [150, -46], [-90, -52], [280, 30]].forEach(([x, z]) => tree(x, z, 1.3));
  // farmhouse + barn
  const barn = K.group(); barn.position.set(-20, hAt(-20, 30), 30); K.slab(-6, 6, 0, 6, -5, 5, K.col('#a8322c'), barn); const br = K.add(new THREE.ConeGeometry(8.4, 3.6, 4), K.col('#5a4a44'), 0, 7.8, 0, barn); br.rotation.y = Math.PI / 4; br.scale.set(1, 1, 0.75);
  // the well (the only water stop)
  const wl = K.group(); wl.position.set(...WELL); K.cyl(1.0, 1.0, 1.0, K.texM(K.P.stone(4, 6, 2, 40, 40, 30), 2, 1, '#c8c0b0'), 0, 0, 0, wl);
  for (const s of [-1, 1]) K.slab(s * 0.95 - 0.08, s * 0.95 + 0.08, 0, 2.6, -0.08, 0.08, post, wl);
  const wr = K.add(new THREE.ConeGeometry(1.6, 0.9, 4), K.col('#7a4e2c'), 0, 3.0, 0, wl); wr.rotation.y = Math.PI / 4;
  K.cyl(0.25, 0.2, 0.35, K.col('#8a6a48'), 0.6, 1.0, 0.5, wl);
  const sgn = PR.canvasTex(256, 96, (c) => { c.fillStyle = '#f2e6c8'; c.fillRect(0, 0, 256, 96); c.fillStyle = '#3a2a20'; c.font = 'bold 44px Poppins, sans-serif'; c.textAlign = 'center'; c.fillText('WATER', 128, 44); c.font = 'bold 28px Poppins, sans-serif'; c.fillText('MILE 12', 128, 82); });
  K.slab(1.6, 1.7, 0, 1.8, 2.2, 2.3, post, wl); K.add(new THREE.PlaneGeometry(1.6, 0.6), new THREE.MeshBasicMaterial({ map: sgn }), 1.65, 1.8, 2.36, wl, { cast: false });
  // the stadium finish: track, grandstand with painted crowd, banner, clock board
  const st = K.group(); st.position.set(...FIN);
  K.slab(-30, 30, 0.02, 0.07, -3.5, 3.5, K.col('#b8603a'), st, false);
  for (const s of [-1, 1]) K.cyl(0.15, 0.18, 6, K.col('#f2f0ea'), 0, 0, s * 4.2, st);
  const ban = PR.canvasTex(512, 96, (c) => { c.fillStyle = '#f2f0ea'; c.fillRect(0, 0, 512, 96); c.fillStyle = '#2f5fae'; c.fillRect(0, 0, 512, 14); c.fillRect(0, 82, 512, 14); c.fillStyle = '#c8402e'; c.font = 'bold 60px Poppins, sans-serif'; c.textAlign = 'center'; c.fillText('FINISH', 256, 70); });
  const bn = K.add(new THREE.BoxGeometry(0.1, 1.2, 8.4), K.toon({ map: ban }), 0, 5.4, 0, st); bn.material.map.center.set(0.5, 0.5);
  const crowdTex = PR.canvasTex(1024, 256, (c) => { c.fillStyle = '#8a7a6a'; c.fillRect(0, 0, 1024, 256); const cols = ['#c8402e', '#2f5fae', '#f2f0ea', '#d9a441', '#3a3e52', '#5a8a4a'];
    for (let r = 0; r < 4; r++) for (let i = 0; i < 40; i++) { const x = 12 + i * 25.5 + (r % 2) * 12, y = 40 + r * 60; c.fillStyle = cols[(i * 7 + r * 3) % 6]; c.fillRect(x - 9, y, 18, 26); c.fillStyle = '#f5d2b0'; c.beginPath(); c.arc(x, y - 6, 8, 0, 7); c.fill();
      c.fillStyle = '#3a2a20'; c.fillRect(x - 10, y - 16, 20, 6); } });
  for (const s of [-1, 1]) { const gs = K.group(st); gs.position.set(0, 0, s * 12); gs.rotation.y = s > 0 ? Math.PI : 0;
    for (let r = 0; r < 4; r++) K.slab(-24, 24, 0, 1 + r * 1.2, -r * 1.4 - 1.4, -r * 1.4, K.col('#a89a88'), gs);
    const cp = K.add(new THREE.PlaneGeometry(48, 5.2), new THREE.MeshBasicMaterial({ map: crowdTex }), 0, 3.4, -2.6, gs, { cast: false }); cp.rotation.x = -0.7; cp.rotation.y = 0; cp.position.z = -2.9; if (s > 0) cp.position.z = -2.9;
    K.slab(-24, 24, 6.2, 6.5, -6.4, 0, K.col('#e9e6da'), gs); }
  const ct = PR.canvasTex(512, 200, (c) => { c.fillStyle = '#1e1a1a'; c.fillRect(0, 0, 512, 200); c.strokeStyle = '#d9a93a'; c.lineWidth = 10; c.strokeRect(5, 5, 502, 190); c.fillStyle = '#f6e6a8'; c.font = 'bold 120px Poppins, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('3:28:53', 256, 106); });
  clock = K.group(st); clock.position.set(9, 0, -6.5); K.slab(-0.12, 0.12, 0, 6, -0.12, 0.12, K.col('#5a4a3a'), clock); K.slab(-2.6, 2.6, 5.4, 7.5, -0.1, 0.1, K.col('#5a4a3a'), clock);
  K.add(new THREE.PlaneGeometry(5, 1.95), new THREE.MeshBasicMaterial({ map: ct }), 0, 6.45, 0.12, clock, { cast: false });
  car = motorcar();
}

// ---------------- positions ----------------
const RUNV = 3.0;
const runX = (f, f0, x0) => x0 + RUNV * (f - f0) / 30;
function carState(f) {
  const S = shotAt(f), id = S.id;
  if (id === 'cars') return { vis: true, x: runX(f, cut(2), 3), z: 0.4 };
  if (id === 'cramp') { const stop = F_HOP - 30; const x = f < stop ? lerp(-12, 3.5, M.easeOut(ramp(f, cut(6), stop))) : 3.5; return { vis: true, x, z: 1.2 }; }
  if (id === 'ride') return { vis: true, x: 3.5 + 9 * (f - cut(7)) / 30, z: 1.2 };
  if (id === 'hitch') return { vis: true, x: lerp(-30, 6, M.easeOut(ramp(f, F_HITCH - 3, E(9) - 10))), z: 1.2 };
  return { vis: false, x: 0, z: 0 };
}

// ---------------- cameras ----------------
const C = (p, d) => [p[0] + d[0], p[1] + d[1], p[2] + d[2]];
const CAMS = {
  hook: [{ f: 0, pos: [10, 1.7, 2.2], look: [-1, 2.1, 0], fov: 44 }, { f: F_RAT - 6, pos: [7.4, 1.6, 1.6], look: [-1, 2.0, 0], fov: 42 }, { f: cut(1), pos: [6.2, 1.5, 1.4], look: [-1.5, 2.1, 0], fov: 40 }],
  well: [{ f: cut(4), pos: [6, 1.8, 7.4], look: [0.4, 1.4, 1.2], fov: 44 }, { f: F_12, pos: [4.4, 1.7, 5.6], look: [0.8, 1.4, 1.4], fov: 42 }],
  start: [{ f: cut(5), pos: [10, 2.6, 0.2], look: [0, 1.6, 0], fov: 46 }, { f: F_14 - 4, pos: [8.5, 2.4, 0.2], look: [0, 1.5, 0], fov: 44 }],
  cramp: [{ f: cut(6), pos: [2.0, 1.7, 7.5], look: [0, 1.5, 0.6], fov: 42 }, { f: F_HOP, pos: [5.5, 2.2, 8.5], look: [2.6, 1.4, 1.0], fov: 44 }],
  lorzfin: [{ f: F_JUMP - 3, pos: [9, 1.8, 2.4], look: [-1, 2.0, 0], fov: 46 }, { f: cut(8), pos: [7, 1.7, 2.0], look: [-1, 1.9, 0], fov: 44 }],
  pose: [{ f: cut(8), pos: [-2.8, 1.7, 6.5], look: [-3, 1.75, 1.5], fov: 40 }, { f: F_FOUND - 4, pos: [-2.8, 1.7, 5.8], look: [-2.7, 1.8, 1.5], fov: 40 }, { f: cut(9), pos: [-1.6, 1.8, 7.5], look: [-2.4, 1.7, 1.5], fov: 44 }],
  broke: [{ f: cut(9), pos: [0.6, 1.6, 6.0], look: [0, 1.6, 2.0], fov: 40 }, { f: F_HITCH - 3, pos: [0.4, 1.6, 5.2], look: [0, 1.6, 2.0], fov: 38 }],
  hitch: [{ f: F_HITCH - 3, pos: [3.5, 1.8, 9], look: [-1.5, 1.4, 1.5], fov: 46 }, { f: cut(10), pos: [5, 2.0, 9.5], look: [1.5, 1.4, 1.5], fov: 46 }],
  orchard: [{ f: cut(10), pos: [3.2, 1.7, 3.6], look: [0, 1.5, -2.2], fov: 42 }, { f: F_NAP - 10, pos: [3.4, 1.9, 4.2], look: [0, 1.3, -2.4], fov: 44 }, { f: cut(11), pos: [2.4, 1.6, 2.6], look: [0, 1.0, -2.4], fov: 40 }],
  potion: [{ f: cut(13), pos: [0.35, 1.8, 6.4], look: [0.35, 1.7, 1.0], fov: 42 }, { f: F_STRY, pos: [0.35, 1.8, 5.4], look: [0.35, 1.8, 1.0], fov: 40 }],
  carry: [{ f: cut(14), pos: [12, 1.8, 2.6], look: [0, 2.2, 0], fov: 44 }, { f: F_CARRY, pos: [8, 1.7, 2.0], look: [0, 2.0, 0], fov: 42 }],
  slow: [{ f: cut(15), pos: [13, 3.5, 6], look: [9, 5.6, -6.5], fov: 44 }, { f: F_SLOW + 10, pos: [12, 3.0, 5], look: [9, 6.0, -6.5], fov: 44 }, { f: TOTAL - 1, pos: [10, 1.7, 2.2], look: [-1, 2.1, 0], fov: 44 }],
};
const FINREL = ['hook', 'lorzfin', 'pose', 'carry', 'slow'];
const KICKS = [{ f: F_FOUND, a: 0.04 }, { f: F_DOGS, a: 0.03 }];
const camAt = (f) => {
  const S = shotAt(f), id = S.id; let c;
  if (id === 'heat' || id === 'cars' || id === 'garcia' || id === 'fourth' || id === 'dogs' || id === 'ride') { // tracking along the road
    const u = ramp(f, S.a, S.b), f0 = S.a;
    if (id === 'heat') { const x = runX(f, f0, 0); c = { pos: [x + lerp(2, 3.5, u), 1.6, lerp(6, 8, u)], look: [x - 1.5, 1.6, 0], fov: 46 }; }
    if (id === 'cars') { const x = runX(f, f0, 0); c = { pos: [x + lerp(2, 1.2, u), 2.2, 14], look: [x + 0.2, 1.4, 0], fov: 48 }; }
    if (id === 'garcia') { c = { pos: [lerp(5, 4, u), 1.4, 6], look: [0, 1.1, 2.6], fov: 42 }; }
    if (id === 'fourth') { const x = runX(f, f0, 0); c = { pos: [x + 3.5, 1.5, 6.5], look: [x, 1.6, 0], fov: 42 }; }
    if (id === 'dogs') { const x = runX(f, f0, 0) * 1.3, zl = -lerp(0, 7, ramp(f, F_DOGS - 20, S.b)); c = { pos: [x + 0.6, 1.5, zl + 5.5], look: [x - 1.8, 1.0, zl], fov: 46 }; }
    if (id === 'ride') { const x = carState(f).x; c = { pos: [x + 5.5, 2.0, 6.5], look: [x, 1.6, 1.2], fov: 44 }; }
    c = camFromKeys([{ f: 0, ...c }], f, { creep: 0, kicks: KICKS });
  } else c = camFromKeys(CAMS[id], f, { creep: 0.0012, kicks: KICKS });
  if (FINREL.includes(id)) { c.pos = C(FIN, c.pos); c.look = C(FIN, c.look); }
  if (id === 'well') { c.pos = C(WELL, c.pos); c.look = C(WELL, c.look); }
  if (id === 'orchard') { c.pos = C(ORCH, c.pos); c.look = C(ORCH, c.look); }
  if (id === 'potion' || id === 'broke' || id === 'hitch' || id === 'start') { c.pos = C([-120, 0, 0], c.pos); c.look = C([-120, 0, 0], c.look); }
  c.shadowAt = [c.look[0], 0, c.look[2]];
  return c;
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => {
  const S = shotAt(f);
  const at = { pose: C(FIN, [-3, 1.7, 1.5]), broke: [-120, 1.6, 2.0], potion: [-120, 1.8, 1.2], orchard: C(ORCH, [0, 1.4, -2.2]), well: C(WELL, [0.6, 1.5, 1.4]), hook: C(FIN, [-0.4, 1.8, 0]) }[S.id];
  if (at) return { focus: dist(Cm.pos, at), cinf: 6 };
  return { focus: 10, cinf: 0 };
};

// ---------------- characters ----------------
const RUN = (jacket, o = {}) => ({ jacket, pants: '#f2f0ea', boots: '#3a2a20', hat: 'hair', hair: '#5a3b2a', ...o });
const HICKS = RUN('#f2f0ea', { pants: '#f2f0ea', hair: '#8a5a34', sash: '#c8402e' });
const LORZ = RUN('#2f5fae', { hair: '#1e1714' });
const CARV = { jacket: '#f2f0ea', pants: '#3a3e52', boots: '#2a2420', hat: 'cap', cap: '#5a4a3a', moustache: '#2a201a', skin: '#e8b890' };
const LEN = RUN('#f2c230', { skin: '#7a4a2a', hair: '#1e1714' });
const GARCIA = RUN('#c8402e', { skin: '#d9a27a', hair: '#1e1714' });
const PACK = [RUN('#5a8a4a'), RUN('#8a3a32', { skin: '#f5c9a0', hair: '#d9a441' }), RUN('#3b4f7a', { moustache: '#4a3426' }), RUN('#d9a441', { skin: '#c99067', hair: '#1e1714' }), RUN('#7b5ac9'), RUN('#e2742d', { hair: '#8a4a2a' })];
const TRAINER = { jacket: '#3a3e52', pants: '#3a3e52', boots: '#1e1a1a', hat: 'tophat', moustache: '#5a3b2a', build: 'stout' };
const TRAINER2 = { jacket: '#5a4a3a', pants: '#4a4038', boots: '#1e1a1a', hat: 'cap', cap: '#3a3e52', skin: '#f5c9a0' };
const ALICE = { jacket: '#f2f0ea', pants: '#f2f0ea', boots: '#e9e6da', hat: 'bonnet', dress: '#f2f0ea', skin: '#f5d8bc' };
const OFFICIAL = { jacket: '#1f2a44', pants: '#3a3e52', boots: '#1e1a1a', hat: 'tophat', moustache: '#8a8a8a', sash: '#d9a93a', build: 'stout' };
const DRIVER = { jacket: '#6a5a4a', pants: '#4a4038', boots: '#1e1a1a', hat: 'cap', cap: '#3a3e52', moustache: '#3a2a20' };
const LIGHT2D = -2.1;
const fo = (f, seed, o) => ({ mode: 'stand', light: LIGHT2D, seed, blink: blinkAt(f, seed), ...o });
const card = (T, key, o, opts, pos, extra = {}) => ({ key: key + JSON.stringify(opts) + (extra.extraKey || ''), draw: (p) => { if (opts.side) T.bodySide(p, o, opts); else T.bodyFront(p, o, opts); if (extra.drawExtra) extra.drawExtra(p); }, x: pos[0], y: pos[1], z: pos[2], ...extra });
const runner = (T, key, o, f, seed, pos, expr = 'pained', flip = false, extra = {}) => card(T, key, o, fo(f, seed, { side: true, mode: 'march', phase: q(((f * 0.07 + seed * 0.37) % 1), 2), expr, stride: 1.1 }), pos, { flip, ...extra });
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1] - 1.07 * s, z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
const inFront = (c, d, ux, uy) => {
  const V = K.THREE.Vector3, p = new V(...c.pos), dir = new V(...c.look).sub(p).normalize(), right = new V().crossVectors(dir, new V(0, 1, 0)).normalize(), up = new V().crossVectors(right, dir);
  const h = d * Math.tan(c.fov * Math.PI / 360); return p.addScaledVector(dir, d).addScaledVector(right, ux * h).addScaledVector(up, uy * h).toArray();
};
const wordCard = (f, f0, txt, c, col = '#f6c83a', dur = 1e9, size = 170, uy = 0.42) => { if (f < f0 - 1 || f > f0 + dur) return null; const t = q(Math.min(1, (f - f0 + 1) / 12));
  const r = Math.min(1, 400 / (0.7 * size * txt.length)), fs = size * r, s = Math.min(2.5, 1.25 / r);
  return FX('w' + txt + t, (p) => PR.word(p, txt, t, col, fs), inFront(c, 7, 0, uy), s, { order: 9 }); };
const dustPuff = (p, t, seed) => { p.g.save(); p.g.globalAlpha = Math.max(0, 1 - t) * 0.85;
  for (let i = 0; i < 6; i++) { const a = i * 1.1 + seed, d = 50 + 150 * t; p.ell(300 + Math.cos(a) * d, 760 + Math.sin(a) * d * 0.4 - t * 120, (60 + 25 * (i % 2)) * (0.6 + t), (45 + 20 * (i % 3)) * (0.6 + t), i % 2 ? '#d8bc90' : '#e6d2ac', 0); }
  p.g.restore(); };
const dog = (p, ph) => { const TAU = Math.PI * 2, b = 10 * Math.abs(Math.sin(ph * TAU)), cx = 300, cy = 780 - b;
  for (const s of [-1, 1]) for (const x0 of [-70, 70]) { const a = s * 0.6 * Math.sin(ph * TAU + (x0 > 0 ? 0 : Math.PI)); p.stroke([[cx + x0, cy + 20], [cx + x0 + 70 * Math.sin(a), 960]], 20, s < 0 ? '#5a3a24' : '#7a5232'); }
  p.ell(cx, cy, 120, 52, '#7a5232', 10); p.ell(cx + 130, cy - 60, 52, 44, '#7a5232', 10); p.poly([[cx + 165, cy - 70], [cx + 220, cy - 50], [cx + 168, cy - 36]], '#7a5232', 8);
  p.dot(cx + 215, cy - 54, 8); p.ell(cx + 140, cy - 72, 9, 9, '#ffffff', 4); p.dot(cx + 143, cy - 72, 4);
  p.poly([[cx + 100, cy - 96], [cx + 118, cy - 140], [cx + 132, cy - 92]], '#5a3a24', 7);
  p.stroke([[cx - 115, cy - 10], [cx - 170, cy - 60 - 15 * Math.sin(ph * TAU * 2)]], 14, '#7a5232');
  p.poly([[cx + 170, cy - 30], [cx + 205, cy - 22], [cx + 172, cy - 14]], '#e86a7a', 4); };
const bottle = (p) => { p.poly([[400, 520], [440, 520], [446, 640], [394, 640]], '#5a8a4a', 7); p.poly([[408, 480], [432, 480], [434, 522], [406, 522]], '#5a8a4a', 6); p.poly([[404, 560], [436, 560], [438, 600], [402, 600]], '#f2e6c8', 4); };
const appleDraw = (p) => { p.ell(400, 560, 34, 30, '#8a5a2a', 7); p.stroke([[400, 530], [404, 510]], 6, '#3a2a20'); };

function actorsAt(f, T) {
  const S = shotAt(f), id = S.id, out = [], cs = carState(f), Fp = (d) => C(FIN, d), At = (d) => C([-120, 0, 0], d);
  // Hicks held up by two trainers, walking toward the finish (hook / carry / slow)
  const hicksGroup = (base, expr = 'dazed', walk = true) => { const s = walk ? (id === 'hook' ? 0.55 : 1.0) * (f - S.a) / 30 : 0, x = base[0] + s, bob = q(Math.sin(f * 0.25), 1);
    out.push(card(T, 'hk', HICKS, fo(f, 2, { expr, look: q(Math.sin(f * 0.07), 1) * 0.5, tilt: q(6 * Math.sin(f * 0.12), 1), headTilt: q(10 * Math.sin(f * 0.09), 1), mode: walk ? 'stroll' : 'stand', phase: q((f * 0.05) % 1, 2) }), [x, 0.07, base[2]]));
    out.push(card(T, 't1', TRAINER, fo(f, 3, { expr: 'nervous', look: 0.5, facing: 1, mode: walk ? 'stroll' : 'stand', phase: q((f * 0.05 + 0.3) % 1, 2) }), [x + 0.1, 0.07, base[2] - 0.9]));
    out.push(card(T, 't2', TRAINER2, fo(f, 4, { expr: 'pained', look: -0.5, facing: -1, mode: walk ? 'stroll' : 'stand', phase: q((f * 0.05 + 0.6) % 1, 2) }), [x + 0.1, 0.07, base[2] + 0.9])); };
  switch (id) {
    case 'hook': hicksGroup(Fp([1.0, 0, 0])); break;
    case 'carry': hicksGroup(Fp([-7.0, 0, 0])); break;
    case 'slow': hicksGroup(Fp([3.0, 0, 0]), 'dazed', false); break;
    case 'heat': { const x0 = runX(f, S.a, 0); [HICKS, LORZ, ...PACK.slice(0, 3)].forEach((o, i) => out.push(runner(T, 'r' + i, o, f, i + 2, [x0 - i * 1.1 + (i % 2) * 0.4, 0.05, -1.4 + (i % 3) * 1.2], f > F_90 ? 'pained' : 'neutral'))); break; }
    case 'cars': { const x0 = runX(f, S.a, 0); [LORZ, ...PACK.slice(2, 5)].forEach((o, i) => out.push(runner(T, 'r' + i, o, f, i + 4, [x0 - i * 0.9, 0.05, -1.4 + (i % 3) * 1.2], f > F_DUST - 6 ? 'pained' : 'nervous')));
      out.push(card(T, 'drv', DRIVER, fo(f, 9, { mode: 'sit', expr: 'grin', look: 0.4 }), [cs.x - 0.6, 1.05, cs.z], { blob: false })); break; }
    case 'garcia': out.push(card(T, 'gar', GARCIA, fo(f, 6, { mode: 'sit', expr: 'pained', look: -0.3, tilt: q(idle(f, 6).tilt, 1) }), [0, 0.05, 2.6]));
      [PACK[0], PACK[3]].forEach((o, i) => out.push(runner(T, 'p' + i, o, f, i + 7, [-6 + (f - S.a) * 0.12 + i * 1.7, 0.05, -0.8 - i], 'nervous'))); break;
    case 'well': out.push(card(T, 'w1', PACK[1], fo(f, 5, { expr: f < F_12 ? 'pained' : 'relief', look: -0.4, facing: -1 }), C(WELL, [0.5, 0.05, 1.6]), { drawExtra: f > F_WATER ? (p) => p.ell(400, 560, 40, 22, '#8fc8e8', 7) : null, extraKey: f > F_WATER ? 'cup' : '' }));
      out.push(card(T, 'w2', PACK[4], fo(f, 8, { expr: 'pained', look: -0.6, facing: -1 }), C(WELL, [2.6, 0.05, 0.4]))); break;
    case 'start': { const ppl = [HICKS, LORZ, CARV, LEN, GARCIA, ...PACK]; ppl.forEach((o, i) => { const row = Math.floor(i / 4), x = -row * 1.4, z = -2.4 + (i % 4) * 1.6 + row * 0.4;
      const go = f > F_14 + 6 ? (f - F_14 - 6) / 30 * 3 : 0;
      out.push(card(T, 'st' + i, o, fo(f, 10 + i, { expr: f < F_14 ? ['stern', 'grin', 'smile'][i % 3] : 'nervous', look: 0.3, facing: 1, mode: go > 0 ? 'march' : 'stand', phase: q((f * 0.08 + i * 0.3) % 1, 2) }), At([x - go * 0, 0.05, z]))); }); break; }
    case 'cramp': {
      const inCar = f > F_HOP + 4;
      if (!inCar) out.push(card(T, 'lorz', LORZ, fo(f, 3, { expr: f < F_CRAMP - 4 ? 'neutral' : 'pained', look: 0.2, tilt: q(f > F_CRAMP ? 8 : 0, 1) }), [0, 0.05, 0.6]));
      else out.push(card(T, 'lorz', LORZ, fo(f, 3, { mode: 'sit', expr: 'grin', look: 0.3, wave: q(Math.sin(f * 0.4), 1) }), [cs.x - 1.0, 1.1, cs.z + 0.2], { blob: false }));
      out.push(card(T, 'drv', DRIVER, fo(f, 9, { mode: 'sit', expr: inCar ? 'smile' : 'neutral', look: -0.4 }), [cs.x + 0.1, 1.05, cs.z - 0.2], { blob: false })); break; }
    case 'ride': out.push(card(T, 'lorz', LORZ, fo(f, 3, { mode: 'sit', expr: 'grin', look: 0.3, wave: q(Math.sin(f * 0.4), 1) }), [cs.x - 1.0, 1.1, cs.z + 0.2], { blob: false }));
      out.push(card(T, 'drv', DRIVER, fo(f, 9, { mode: 'sit', expr: 'smile', look: -0.4 }), [cs.x + 0.1, 1.05, cs.z - 0.2], { blob: false }));
      for (let i = 0; i < 3; i++) { const x0 = runX(f, S.a, -2 - i * 2); out.push(runner(T, 'rr' + i, PACK[i], f, i + 3, [x0, 0.05, -1.6], 'shock')); } break;
    case 'lorzfin': { const x = Fp([0, 0, 0])[0] - 5 + 3.2 * (f - S.a) / 30;
      out.push(card(T, 'lorz', LORZ, fo(f, 3, { expr: 'laugh', look: 0, wave: q(Math.sin(f * 0.5), 1), mode: 'march', phase: q((f * 0.08) % 1, 2) }), [x, 0.07, 0])); break; }
    case 'pose': out.push(card(T, 'lorz', LORZ, fo(f, 3, { expr: f < F_FOUND ? 'grin' : 'nervous', look: f < F_FOUND ? 0 : 0.6, facing: f < F_FOUND ? 0 : 1 }), Fp([-3.55, 0.07, 1.5])));
      out.push(card(T, 'alice', ALICE, fo(f, 7, { expr: 'smile', look: -0.2 }), Fp([-2.45, 0.07, 1.4])));
      if (f > F_FOUND - 12) { const k = M.easeOut(ramp(f, F_FOUND - 12, F_FOUND + 4)); out.push(card(T, 'off', OFFICIAL, fo(f, 8, { expr: 'stern', look: -0.7, facing: -1, wave: 0.8 }), Fp([lerp(1, -1.1, k), 0.07, 1.2]))); } break;
    case 'broke': out.push(card(T, 'carv', CARV, fo(f, 4, { expr: f < F_LOST + 6 ? 'neutral' : 'shock', look: 0, drawExtra: null }), At([0, 0.05, 2.0]),
      { drawExtra: f > F_LOST ? (p) => { for (const s of [-1, 1]) p.poly([[300 + s * 70, 640], [300 + s * 110, 650], [300 + s * 100, 700], [300 + s * 70, 690]], '#f2f0ea', 6); } : null, extraKey: f > F_LOST ? 'pk' : '' })); break;
    case 'hitch': out.push(card(T, 'carv', CARV, fo(f, 4, { expr: 'grin', look: -0.6, facing: -1, wave: q(0.6 + 0.3 * Math.sin(f * 0.3), 1) }), At([1.5, 0.05, 4.2])));
      if (cs.vis) out.push(card(T, 'drv', DRIVER, fo(f, 9, { mode: 'sit', expr: 'smile', look: 0.4 }), At([cs.x + 0.1, 1.05, cs.z - 0.2]), { blob: false })); break;
    case 'orchard': { const nap = f > F_NAP - 4, eat = f > F_APPLE - 4 && !nap;
      out.push(card(T, 'carv', CARV, fo(f, 4, { expr: nap ? 'dazed' : eat ? 'lick' : 'smile', mode: nap ? 'sit' : 'stand', look: 0.3, blink: nap ? 1 : blinkAt(f, 4) }), C(ORCH, [0, 0.05, -2.2]),
        { drawExtra: eat ? appleDraw : null, extraKey: eat ? 'ap' : '' })); break; }
    case 'fourth': out.push(runner(T, 'carv', CARV, f, 4, [runX(f, S.a, 0), 0.05, 0], 'grin')); break;
    case 'dogs': { const s = (f - S.a) / 30, x0 = runX(f, S.a, 0) * 1.3, z = -lerp(0, 7, ramp(f, F_DOGS - 20, S.b));
      out.push(runner(T, 'len', LEN, f, 5, [x0, 0.05, z], 'shock'));
      for (let i = 0; i < 3; i++) { const ph = q(((f * 0.12 + i * 0.33) % 1), 2); out.push({ key: 'dog' + ph, draw: (p) => dog(p, ph), x: x0 - 2.0 - i * 1.0, y: 0.05, z: z + (i - 1) * 0.6 + 0.5, s: 0.72 }); } break; }
    case 'potion': out.push(card(T, 'hk', HICKS, fo(f, 2, { expr: f < F_STRY - 4 ? 'pained' : 'nervous', look: 0.3 }), At([-0.3, 0.05, 1.2])));
      out.push(card(T, 't1', TRAINER, fo(f, 3, { expr: 'grin', look: -0.6, facing: -1 }), At([1.0, 0.05, 0.9]), { drawExtra: bottle, extraKey: 'b' })); break;
  }
  return out;
}
function fxAt(f, T, cam) {
  const S = shotAt(f), id = S.id, out = [], push = (x) => x && out.push(x), cs = carState(f);
  const stars = (pos) => { const t = q((f % 30) / 30, 2); out.push(FX('stars' + t, (p) => T.fxStars(p, t), pos, 1.4)); };
  if (id === 'hook') { push(wordCard(f, F_1904, '1904', cam, '#f6c83a', F_RAT - F_1904 - 3)); push(wordCard(f, F_RAT, 'RAT POISON', cam, '#7ad06a')); }
  if (['hook', 'carry'].includes(id)) { const x = FIN[0] + (id === 'hook' ? 1 : -7) + (id === 'hook' ? 0.55 : 1.0) * (f - S.a) / 30; stars([x, 0.9, 0.05]); }
  if (id === 'heat') push(wordCard(f, F_90, '90°F', cam, '#e8503a', 1e9, 220));
  if (id === 'cars' || id === 'ride' || id === 'hitch') { const base = id === 'hitch' ? -120 : 0;
    for (let i = 0; i < 6; i++) { const t = q(((f * 0.035 + i / 6) % 1), 2); out.push(FX('dp' + i + t, (p) => dustPuff(p, t, i), [base + cs.x - 2.2 - t * 6, 0.9 + t * 1.5, cs.z + (i % 2) * 0.8 - 0.4], 2.4 + t * 2.2, { order: 4 })); } }
  if (id === 'garcia') for (let i = 0; i < 4; i++) { const t = q(((f * 0.02 + i / 4) % 1), 2); out.push(FX('gd' + i + t, (p) => dustPuff(p, t, i + 3), [-2 + i * 1.5, 0.6 + t, -1.2], 3 + t * 2, { alpha: 0.8 })); }
  if (id === 'well') { push(wordCard(f, F_12, 'MILE 12', cam)); push(wordCard(f, F_WATER, '1 WATER STOP', cam, '#8fc8e8', F_12 - F_WATER - 2, 170, 0.62)); }
  if (id === 'start') { push(wordCard(f, F_32, '32', cam, '#f6c83a', F_14 - F_32 - 2, 230)); push(wordCard(f, F_14, '14 FINISHED', cam, '#e8503a')); }
  if (id === 'ride') push(wordCard(f, F_11, '11 MILES', cam));
  if (id === 'cramp' && f > F_CRAMP && f < F_HOP) push(wordCard(f, F_CRAMP, 'OUCH!', cam, '#ffffff', 30, 190));
  if (id === 'lorzfin') push(wordCard(f, F_FIRST, '1ST?!', cam, '#f6c83a', 1e9, 220));
  if (id === 'pose') push(wordCard(f, F_FOUND, 'BUSTED!', cam, '#e8503a', 1e9, 200));
  if (id === 'orchard' && f > F_NAP) { const t = q(((f - F_NAP) / 40) % 1, 2); out.push(FX('zz' + t, (p) => T.fxZ(p, t), C(ORCH, [0.4, 1.9, -2.0]), 1.4)); }
  if (id === 'fourth') push(wordCard(f, F_4TH, '4TH', cam, '#f6c83a', 1e9, 230));
  if (id === 'dogs') push(wordCard(f, F_9TH, '9TH', cam, '#f6c83a', 1e9, 230));
  if (id === 'potion') push(wordCard(f, F_STRY, 'STRYCHNINE', cam, '#7ad06a'));
  if (id === 'slow') push(wordCard(f, F_SLOW, 'SLOWEST EVER', cam, '#e8503a', 1e9, 170, 0.62));
  return out;
}

export default {
  TOTAL, build,
  frame(f, k) {
    const S = shotAt(f), cs = carState(f), cam = camAt(f);
    car.visible = cs.vis; const base = ['hitch'].includes(S.id) ? -120 : 0; car.position.set(base + cs.x, 0.0, cs.z);
    carWheels.forEach((w) => { w.rotation.z = -cs.x / 0.48; });
    clock.visible = S.id === 'slow';
    return { light: { ...HOT }, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
  },
};
