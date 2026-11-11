// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The Exploding Whale" — Florence, Oregon, 12 Nov 1970. Timed to stories/whale/voice.wav via whale_timing.js.
import { TOTAL, LINES, wf } from './whale_timing.js';
import * as PR from '../props.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0];
// shots: one per narration line (cuts land 4 frames before each line starts)
const cut = (i) => Math.max(0, A(i) - 4);
const F_BOOM = A(5), F_CRUSH = wf(7, 'crushed');
const SHOTS = [
  ['hook', 0], ['whale', cut(1)], ['plan', cut(2)], ['pack', cut(3)], ['crowd', cut(4)], ['boom', cut(5)], ['rain', cut(6)], ['car', cut(7)], ['still', cut(8)],
].map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

// ground: wet sand at the waterline (z = -14), gentle beach, dune ridge to a plateau where the crowd + car park are
const SHORE = -14;
const hAt = (x, z) => {
  let h = z < SHORE ? (z - SHORE) * 0.25 : 0.06 * (z - SHORE);
  const d = Math.min(1, Math.max(0, (z - 26) / 14)); h += d * d * (3 - 2 * d) * (6.2 - 0.06 * 40);
  if (z > 26) h += 0.35 * Math.sin(x * 0.21) * Math.sin(z * 0.17) * Math.min(1, (z - 26) / 10);
  if (z > 46 && x > 22 && x < 48 && z < 64) h = lerp(h, 6.2, 0.95); // car park
  return h;
};
const LIGHT = { az: 120, el: 40, sky: '#d3e3f6', ground: '#a89a78', hemi: 1.15, sun: '#fff1dc', sunI: 2.5, fog: '#cfe0f0', fogNear: 120, fogFar: 900,
  skyTop: '#4a86d8', skyHor: '#d6e6f4', sat: 1.1, vig: 0.2, shadowExt: 30 };

let K, whale, whalePatch, crates = [], chunks = [], car, bigChunk, sea;
const rnd = (() => { let s = 7; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();

function build(k) {
  K = k; const { THREE } = K;
  K.addClouds(10, 800, 140);
  const sand = K.toon({ map: PR.speckTex('#e6d2a6', ['#d9c391', '#efdfba', '#cdb383', '#f4e8c8'], 5, 3000, 60) });
  PR.terrain(K, 900, 220, hAt, sand);
  sea = PR.ocean(K, { y: -0.35, shoreZ: SHORE, deep: '#2a6f98', shal: '#58b6cc' });
  // dune grass tufts
  const grass = K.col('#7f9a4a');
  for (let i = 0; i < 160; i++) { const x = -80 + rnd() * 160, z = 28 + rnd() * 30; if (x > 20 && x < 50 && z > 44) continue; if (x > -6 && x < 16 && z > 30) continue;
    const m = K.add(new THREE.ConeGeometry(0.25 + rnd() * 0.2, 0.8 + rnd() * 0.7, 5), grass, x, hAt(x, z) + 0.4, z); m.castShadow = false; }
  // driftwood logs
  for (let i = 0; i < 8; i++) { const x = -40 + rnd() * 80, z = 4 + rnd() * 18; const m = K.add(new THREE.CylinderGeometry(0.18, 0.22, 3 + rnd() * 3, 8), K.col('#b9a58a'), x, hAt(x, z) + 0.15, z); m.rotation.set(Math.PI / 2, rnd() * 3, 0); m.rotation.order = 'YXZ'; }
  // car park asphalt + three cars
  K.slab(22, 48, 6.15, 6.25, 46, 64, K.col('#55575e'), K.scene, false);
  for (let i = 0; i < 5; i++) K.slab(24.5 + i * 5.5, 24.7 + i * 5.5, 6.25, 6.27, 50, 58, K.col('#e9e6da'), K.scene, false);
  const cols = ['#c8402e', '#5a8fc2', '#3f8a5a'];
  [[27.2, 54], [38.2, 54], [43.7, 54]].forEach((p, i) => { const c = PR.sedan(K, cols[i]); c.root.position.set(p[0], 6.25, p[1]); c.root.rotation.y = Math.PI / 2; if (i === 0) car = c; });
  // the whale: sperm whale ~13.7 m, lying on the sand along x, square head at +x
  whale = K.group(); whale.position.set(0, hAt(0, -6) - 0.5, -6);
  const skin = K.col('#5d6672'), belly = K.col('#a6adb6');
  K.sphere(1, skin, -1.2, 1.55, 0, whale, 5.3, 1.75, 1.95);
  K.sphere(1, skin, 4.1, 1.75, 0, whale, 3.0, 1.85, 1.85);
  K.slab(3.0, 6.6, 0.15, 0.5, -0.45, 0.45, belly, whale);
  K.sphere(1, belly, 0.5, 0.55, 0, whale, 5.0, 0.6, 1.6);
  const tail = K.add(new THREE.ConeGeometry(1.25, 4.6, 24), skin, -8.2, 1.4, 0, whale); tail.rotation.z = Math.PI / 2;
  for (const s of [-1, 1]) { const fl = K.add(new THREE.BoxGeometry(1.6, 0.22, 2.4), skin, -10.6, 1.4, s * 1.1, whale); fl.rotation.y = s * 0.45; }
  for (const s of [-1, 1]) { K.sphere(0.13, K.col('#141118'), 2.4, 1.35, s * 1.62, whale); const fin = K.add(new THREE.BoxGeometry(1.2, 0.15, 0.7), skin, 1.2, 0.7, s * 1.9, whale); fin.rotation.set(0, s * 0.5, s * 0.4); }
  whalePatch = K.sphere(1, K.col('#c86f7c'), 0.4, 2.7, 0.2, whale, 2.6, 0.7, 1.5); whalePatch.visible = false;
  // 20 cases of dynamite stacked along the whale
  for (let i = 0; i < 20; i++) {
    const side = i % 2 ? 1 : -1, j = (i / 2) | 0, x = -6 + (j % 5) * 2.6, z = -6 + side * (2.5 + (j > 4 ? 0.7 : 0)), y = hAt(x, z) + (j > 4 ? 0.55 : 0);
    const c = PR.crate(K); c.position.set(x + (j > 4 ? 1.1 : 0), y, z); c.rotation.y = (rnd() - 0.5) * 0.4; c.userData.p0 = c.position.clone(); crates.push(c);
  }
  // flying chunks (grey skin / pink blubber), launched at F_BOOM
  for (let i = 0; i < 46; i++) {
    const r = 0.35 + rnd() * 0.85, m = K.add(new THREE.IcosahedronGeometry(r, 0), K.col(i % 3 ? '#c97a86' : '#5d6672'), 0, -50, 0);
    const toCrowd = i < 30, a = toCrowd ? (rnd() - 0.5) * 1.4 : rnd() * Math.PI * 2;
    const v = toCrowd ? [Math.sin(a) * 9, 26 + rnd() * 10, 12 + rnd() * 6] : [Math.cos(a) * 10, 18 + rnd() * 14, Math.sin(a) * 10];
    m.userData = { v, r, spin: [rnd() * 6, rnd() * 6, rnd() * 6], delay: rnd() * 0.15 }; chunks.push(m);
  }
  bigChunk = K.add(new THREE.IcosahedronGeometry(1.5, 1), K.col('#c97a86'), 0, -50, 0); bigChunk.scale.set(1.2, 0.8, 1);
}

const G = 12; // cartoon gravity (slower fall reads better)
function poseWorld(f) {
  const S = shotAt(f), t = f / 30;
  sea.U.t.value = t;
  // crates: visible in the hook (flash-forward) and from the packing shot until the blast; pop in one by one
  crates.forEach((c, i) => {
    let s = 0;
    if (S.id === 'hook') s = 1;
    if (f >= cut(3) && f < F_BOOM) s = M.back(ramp(f, A(3) + i * 3, A(3) + i * 3 + 8));
    c.visible = s > 0.01; c.scale.setScalar(Math.max(0.01, s));
  });
  const tb = (f - F_BOOM) / 30;
  whalePatch.visible = tb > 0; whale.scale.set(1, tb > 0 ? 0.92 : 1, 1);
  chunks.forEach((m) => {
    const u = m.userData, s = tb - u.delay;
    if (s < 0) { m.visible = false; return; }
    m.visible = true;
    let x = u.v[0] * s, z = -6 + u.v[2] * s, y = 2 + u.v[1] * s - 0.5 * G * s * s;
    const gnd = hAt(x, z) + u.r * 0.5;
    if (y < gnd && s > 0.3) { // landed: find landing time, stay put, squashed
      const disc = u.v[1] ** 2 + 2 * G * (2 - gnd), sl = (u.v[1] + Math.sqrt(Math.max(0, disc))) / G;
      x = u.v[0] * sl; z = -6 + u.v[2] * sl; y = hAt(x, z) + u.r * 0.3; m.scale.set(1.2, 0.6, 1.2); m.rotation.set(u.spin[0] * sl, u.spin[1] * sl, 0);
    } else { m.scale.setScalar(1); m.rotation.set(u.spin[0] * s, u.spin[1] * s, u.spin[2] * s); }
    m.position.set(x, y, z);
  });
  // the big one onto the red car
  const tc = (f - F_CRUSH) / 30, cx = 27.2, cz = 54;
  if (tc < -1.2 || S.id !== 'car' && S.id !== 'still') { bigChunk.visible = false; }
  else { bigChunk.visible = true; const y = tc < 0 ? 6.25 + 1.9 + 0.5 * 22 * tc * tc : 6.25 + 1.2; bigChunk.position.set(cx, y, cz); bigChunk.rotation.set(tc * 3, tc * 2, 0); }
  const crush = M.easeOut(ramp(f, F_CRUSH, F_CRUSH + 4));
  car.cabin.scale.y = lerp(1, 0.25, crush); car.body.scale.y = lerp(1, 0.8, crush); car.body.rotation.z = 0.06 * crush;
}

// ---------------- cameras ----------------
const CAMS = {
  hook: [{ f: 0, pos: [30, 24, 36], look: [0, 0, -6], fov: 40 }, { f: cut(1), pos: [15, 9, 18], look: [0, 1, -6], fov: 38 }],
  whale: [{ f: cut(1), pos: [-14, 2.6, 9], look: [-2, 1.8, -6], fov: 40 }, { f: cut(2), pos: [5, 2.8, 10], look: [1.5, 1.9, -6], fov: 38 }],
  plan: [{ f: cut(2), pos: [9.5, 2.6, 7.2], look: [6.6, 2.0, -0.4], fov: 38 }, { f: cut(3), pos: [9.0, 2.5, 6.4], look: [6.6, 2.0, -0.4], fov: 36 }],
  pack: [{ f: cut(3), pos: [12, 8, 13], look: [-1, 0.6, -6], fov: 40 }, { f: cut(4), pos: [9, 6.5, 10], look: [-1, 0.8, -6], fov: 40 }],
  crowd: [{ f: cut(4), pos: [4.8, 7.6, 32.5], look: [4.6, 7.0, 41], fov: 42 }, { f: cut(5), pos: [4.8, 7.5, 34], look: [4.6, 7.0, 41], fov: 40 }],
  boom: [{ f: cut(5), pos: [14, 13, 56], look: [0, 3, -6], fov: 40 }, { f: cut(6), pos: [13, 12, 52], look: [0, 6, -6], fov: 42 }],
  rain: [{ f: cut(6), pos: [5, 8.6, 57], look: [3, 12, 30], fov: 50 }, { f: cut(7), pos: [5, 8.4, 56], look: [3, 10.5, 32], fov: 48 }],
  car: [{ f: cut(7), pos: [36, 9.5, 66], look: [28, 7, 54], fov: 40 }, { f: cut(8), pos: [34.5, 8.6, 63], look: [27.5, 7, 54], fov: 38 }],
  still: [{ f: cut(8), pos: [12, 3.4, 13], look: [0, 1.6, -6], fov: 40 }, { f: TOTAL - 1, pos: [9, 3.0, 10], look: [0, 1.6, -6], fov: 38 }],
};
const KICKS = [{ f: F_BOOM, a: 0.08 }, { f: F_BOOM + 6, a: 0.04 }, { f: F_CRUSH, a: 0.07 }];
const camAt = (f) => {
  const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS });
  c.flash = f >= F_BOOM && f < F_BOOM + 5 ? (1 - (f - F_BOOM) / 5) * 0.9 : 0;
  if (S.id === 'car') c.shadowAt = [30, 6, 55];
  if (S.id === 'crowd' || S.id === 'rain') c.shadowAt = [5, 6, 40];
  return c;
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => {
  const S = shotAt(f);
  if (S.id === 'plan') return { focus: dist(Cm.pos, [6.6, 1.6, -0.2]), cinf: 10 };
  if (S.id === 'crowd') return { focus: dist(Cm.pos, [5, 7, 40]), cinf: 8 };
  if (S.id === 'whale' && f > wf(1, 'stank') - 10) return { focus: dist(Cm.pos, [-1, 1.6, 0.8]), cinf: 7 };
  return { focus: 10, cinf: 0 };
};

// ---------------- characters ----------------
const WORKER = { jacket: '#e2742d', pants: '#3b4f7a', boots: '#3a2a20', hat: 'cap', cap: '#f2c230' };
const WORKER2 = { jacket: '#e2742d', pants: '#3b4f7a', boots: '#3a2a20', hat: 'cap', cap: '#f2c230', skin: '#c99067', moustache: '#2a201a' };
const ENGINEER = { jacket: '#f0efe8', pants: '#5a5f6e', boots: '#2a2420', hat: 'cap', cap: '#f4f1ea', moustache: '#6a4a30', sash: undefined };
const CROWD = [
  { jacket: '#c25a3a', pants: '#3b3f52', boots: '#4a3426', hat: 'hair', hair: '#3b2a20' },
  { jacket: '#5a8fc2', pants: '#6a5a4a', boots: '#4a3426', hat: 'hair', hair: '#d9a441', dress: '#d9a441', skin: '#f5c9a0' },
  { jacket: '#3f8a5a', pants: '#3b3f52', boots: '#2a2420', hat: 'hair', hair: '#1e1714', skin: '#c99067' },
  { jacket: '#d9a441', pants: '#4a4f62', boots: '#4a3426', hat: 'cap', cap: '#c8402e' },
  { jacket: '#7b5ac9', pants: '#3b3f52', boots: '#4a3426', hat: 'hair', hair: '#8a4a2a', dress: '#c25a7a' },
  { jacket: '#8c3b4a', pants: '#3b3f52', boots: '#4a3426', hat: 'hair', hair: '#5a3b2a', moustache: '#5a3b2a', skin: '#ecd0b6' },
  { jacket: '#2f5f6a', pants: '#6a5a4a', boots: '#2a2420', hat: 'hair', hair: '#2b211c', skin: '#f5c9a0' },
  { jacket: '#e9e6da', pants: '#3b4f7a', boots: '#4a3426', hat: 'cap', cap: '#3b6fb2', skin: '#c99067' },
];
const LIGHT2D = -2.1;
const fo = (f, seed, o) => ({ mode: 'stand', light: LIGHT2D, seed, blink: blinkAt(f, seed), ...o });
const card = (T, key, o, opts, pos, extra = {}) => ({ key: key + JSON.stringify(opts), draw: (p) => (opts.side ? T.bodySide(p, o, opts) : T.bodyFront(p, o, opts)), x: pos[0], y: pos[1], z: pos[2], ...extra });
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
const CROWD_POS = CROWD.map((_, i) => { const x = -1 + i * 1.5 + (i % 2) * 0.3, z = 40.5 + (i % 3) * 0.9; return [x, hAt(x, z), z]; });

function actorsAt(f, T) {
  const S = shotAt(f), out = [];
  const crowd = (exprFn, run = 0) => CROWD.forEach((o, i) => {
    const [x0, , z0] = CROWD_POS[i], id = idle(f, i + 3);
    if (run > 0) { // scatter away from the beach
      const d = run * (4 + (i % 3) * 1.5), x = x0 + (i % 2 ? 1 : -1) * d * 0.4, z = z0 + d;
      out.push(card(T, 'cr' + i, o, fo(f, 20 + i, { expr: 'shock', mode: 'march', phase: q((f * 0.09 + i * 0.3) % 1), look: 0 }), [x, hAt(x, z), z]));
    } else out.push(card(T, 'cr' + i, o, fo(f, 20 + i, { expr: exprFn(i), look: (i % 3 - 1) * 0.3, tilt: q(id.tilt * 0.5, 1), headTilt: q(id.headTilt, 1) }), CROWD_POS[i]));
  });
  switch (S.id) {
    case 'whale': {
      const st = f > wf(1, 'stank') - 6;
      out.push(card(T, 'wk', WORKER, fo(f, 4, { expr: st ? 'pained' : 'nervous', look: -0.6, facing: -1, tilt: q(idle(f, 4).tilt, 1) }), [-1.2, hAt(-1, 1), 1.0]));
      break;
    }
    case 'plan': {
      const e = f > A(2) + 40 ? 'grin' : 'smile';
      out.push(card(T, 'en', ENGINEER, fo(f, 6, { expr: e, look: 0.3, wave: f > wf(2, 'blow') - 4 ? q(Math.sin(f * 0.4), 1) : undefined }), [6.6, hAt(6.6, -0.4), -0.4]));
      out.push(card(T, 'wk', WORKER, fo(f, 4, { expr: 'nervous', look: -0.5, facing: -1 }), [5.0, hAt(5, -1.4), -1.4]));
      out.push(card(T, 'wk2', WORKER2, fo(f, 5, { expr: 'stern', look: -0.4 }), [8.2, hAt(8.2, -1.6), -1.6]));
      break;
    }
    case 'pack': {
      out.push(card(T, 'en', ENGINEER, fo(f, 6, { expr: 'grin', look: -0.4 }), [7.5, hAt(7.5, -1), -1]));
      out.push(card(T, 'wk', WORKER, fo(f, 4, { expr: 'nervous', look: 0.3 }), [5.6, hAt(5.6, -2.2), -2.2]));
      break;
    }
    case 'crowd': crowd((i) => (f > A(4) + 20 ? ['grin', 'laugh', 'smile', 'grin'][i % 4] : ['smile', 'neutral', 'grin', 'smile'][i % 4])); break;
    case 'boom': crowd(() => 'shock'); break;
    case 'rain': crowd(() => 'shock', M.easeIn(ramp(f, A(6), A(6) + 60)) * 1.6); break;
    case 'still': {
      out.push(card(T, 'en', ENGINEER, fo(f, 6, { expr: 'dazed', look: -0.5, tilt: q(idle(f, 6).tilt, 1) }), [7.6, hAt(7.6, 1.5), 1.5]));
      out.push(card(T, 'wk', WORKER, fo(f, 4, { expr: 'dazed', look: -0.6 }), [6.2, hAt(6.2, 2.6), 2.6]));
      break;
    }
  }
  return out;
}
function fxAt(f, T) {
  const S = shotAt(f), out = [];
  if (S.id === 'whale' && f > wf(1, 'stank') - 8) { const t = q(((f - A(1)) / 40) % 1); out.push(FX('stink' + t, (p) => PR.stink(p, t), [-1, 2.6, -4.6], 3.4)); out.push(FX('stink2' + t, (p) => PR.stink(p, (t + 0.5) % 1), [4.5, 2.6, -4.6], 3.0)); }
  if (S.id === 'plan' || S.id === 'whale' || S.id === 'hook') for (let i = 0; i < 4; i++) { // gulls circling the whale
    const a = f * 0.025 + i * 1.57, r = 7 + i * 1.5, x = Math.cos(a) * r, z = -6 + Math.sin(a) * r * 0.7, fl = q(((f * 0.07 + i * 0.25) % 1), 1);
    out.push(FX('gull' + fl, (p) => PR.gull(p, fl), [x, 7 + i * 0.8 + Math.sin(f * 0.05 + i), z], 1.4, { flip: Math.sin(a) > 0 }));
  }
  if (S.id === 'boom' || S.id === 'rain') {
    const t = (f - F_BOOM) / 40;
    if (t >= 0 && t < 1) { const tq = q(t); out.push(FX('kb' + tq, (p) => PR.kaboom(p, tq), [0, -2, -6], 26)); }
    const tw = (f - F_BOOM) / 24;
    if (S.id === 'boom' && tw >= 0 && tw < 1) { const tq = q(tw); out.push(FX('boomw' + tq, (p) => PR.word(p, 'BOOM!', tq), [6, 16, 10], 12)); }
    for (let i = 0; i < 5; i++) { const s = (f - F_BOOM - 10 - i * 4) / 90; if (s > 0 && s < 1) { const tq = q(s); out.push(FX('smk' + i + tq, (p) => { p.g.translate(150, 600); p.g.scale(2, 2); T.fxPuff(p, tq); }, [(i - 2) * 3, 1 + s * 8, -6 + i], 14 + s * 10, { alpha: 0.95 })); } }
  }
  if (S.id === 'car' && f >= F_CRUSH) { const t = q((f - F_CRUSH) / 18); if (t < 1) out.push(FX('crb' + t, (p) => { p.g.translate(50, 250); T.fxBurst(p, t, '#fff3b0'); }, [27.2, 3.2, 55.5], 4)); }
  if (S.id === 'still') { const s = 0.55 + (f - cut(8)) / 200; for (let i = 0; i < 3; i++) { const tq = q(Math.min(0.98, s + i * 0.1)); out.push(FX('smk_s' + i + tq, (p) => { p.g.translate(150, 600); p.g.scale(2, 2); T.fxPuff(p, tq); }, [-3 + i * 3, 4 + i, -8], 18, { alpha: 0.6 })); } }
  return out;
}

export default {
  TOTAL, build,
  frame(f, k) {
    poseWorld(f);
    const S = shotAt(f), cam = camAt(f), light = { ...LIGHT };
    if (['plan', 'whale', 'still'].includes(S.id)) light.shadowExt = 16;
    if (S.id === 'car') light.shadowExt = 14;
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T) };
  },
};
