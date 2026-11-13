// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The Tree of Ténéré" — the loneliest tree on Earth, Niger, hit by a truck in 1973. Timed via tenere_timing.js.
import { TOTAL, LINES, wf } from './tenere_timing.js';
import * as PR from '../props.js';
import { INK } from '../toon.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const F_1973 = wf(0, '1973'), F_ONLY = wf(0, 'only'), F_250 = wf(0, '250'), F_ALONE = wf(1, 'alone'), F_ROOTS = wf(2, 'roots'), F_100 = wf(2, '100'), F_WATER = wf(2, 'water'),
  F_CAR = wf(3, 'caravans'), F_MAPS = wf(3, 'maps'), F_CITY = wf(3, 'city'), F_THOU = wf(4, 'thousands'), F_NONE = wf(4, 'none'), F_TRUCK = wf(5, 'truck'),
  F_HOW = wf(6, 'how'), F_DESERT = wf(6, 'desert'), F_DRUNK = wf(7, 'drunk'), F_SNAP = wf(7, 'snapped'), F_TODAY = wf(8, 'today'), F_MUS = wf(8, 'museum'),
  F_METAL = wf(9, 'metal'), F_TRY = wf(9, 'try');
const SHOTS = [['hook', 0], ['alone', cut(1)], ['roots', cut(2)], ['caravan', cut(3)], ['map', F_MAPS - 4], ['camels', cut(4)], ['truck', cut(5)], ['aerial', cut(6)],
  ['driver', cut(7)], ['snap', F_SNAP - 14], ['museum', cut(8)], ['metal', cut(9)], ['loop', F_TRY - 3]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const DAY = { az: 140, el: 42, sky: '#ffe8c8', ground: '#c89a60', hemi: 1.15, sun: '#fff0d0', sunI: 2.6, fog: '#f2dcb8', fogNear: 160, fogFar: 1400,
  skyTop: '#3a80d6', skyHor: '#f6e4c6', sat: 1.12, vig: 0.2, shadowExt: 26 };
const GOLD = { ...DAY, az: 15, el: 12, sun: '#ffd8a0', sunI: 2.4, sky: '#ffd8b0', skyTop: '#5a6ac8', skyHor: '#ffc89a', fog: '#f4c8a0', sat: 1.15, vig: 0.28, shadowExt: 40 };
const HALL = { az: 120, el: 65, sky: '#f4e6d0', ground: '#6a5a4a', hemi: 1.2, sun: '#fff0d8', sunI: 2.0, fog: '#4a4038', fogNear: 60, fogFar: 220, skyTop: '#4a4038', skyHor: '#4a4038', sat: 1.05, vig: 0.3, shadowExt: 14 };
const ROOT = [0, 0, 3000], MUS = [0, 0, -3000], TRAILZ = 2.6;
let K, tree, trunkTop, metal, truck, wheels = [], roots;
const dune = (x, z) => { const r = Math.hypot(x, z), flat = clamp((r - 30) / 50); return flat * (4 * Math.sin(x * 0.035 + z * 0.02) * Math.sin(z * 0.05) + 3 * Math.sin(x * 0.011 - 1) + 3) * (Math.abs(z - TRAILZ) < 6 ? 0.3 : 1); };

const acacia = (parent) => {
  const g = K.group(parent), bark = K.col('#6a4a32'), leaf = K.col('#6f8f3a'), leaf2 = K.col('#5f7f30');
  const top = K.group(g);
  K.beam(K.V(0, 0, 0), K.V(0.4, 2.4, 0), 0.42, bark, g); K.beam(K.V(0.4, 2.4, 0), K.V(-0.3, 3.6, 0.2), 0.32, bark, g);
  K.beam(K.V(0.4, 2.4, 0), K.V(1.6, 3.7, -0.2), 0.28, bark, g); K.beam(K.V(-0.3, 3.6, 0.2), K.V(-1.6, 4.1, 0.4), 0.2, bark, g);
  [[0.1, 4.4, 0, 2.6, leaf], [1.8, 4.3, -0.3, 1.8, leaf2], [-1.7, 4.4, 0.4, 1.7, leaf2], [0.4, 4.7, 0.8, 1.6, leaf]].forEach(([x, y, z, r, m]) => K.sphere(r, m, x, y, z, top, 1, 0.32, 1));
  return g;
};

function build(k) {
  K = k; const { THREE } = K;
  K.addClouds(6, 900, 200);
  PR.terrain(K, 1600, 220, dune, K.toon({ map: PR.speckTex('#e2b878', ['#d6a868', '#ecc68a', '#cfa060'], 5, 2400, 90) }));
  // faint caravan trail
  const tr = new THREE.PlaneGeometry(800, 3, 160, 1); tr.rotateX(-Math.PI / 2); const tp = tr.attributes.position; for (let i = 0; i < tp.count; i++) tp.setY(i, dune(tp.getX(i), TRAILZ + tp.getZ(i)) + 0.04);
  K.add(tr, K.toon({ map: PR.speckTex('#cfa46a', ['#c09460', '#d8b07a'], 6, 1200, 40) }), 0, 0, TRAILZ, K.scene, { cast: false });
  // a few rocks + far mesas
  for (let i = 0; i < 9; i++) { const a = i * 2.1, d = 140 + i * 40; K.add(new THREE.CylinderGeometry(18 + i * 3, 26 + i * 3, 14 + (i % 3) * 6, 7), K.col('#b8784a'), Math.cos(a) * d * 3, 5, Math.sin(a) * d * 3 - 300, K.scene, { cast: false }); }
  // THE tree: pivot at the base so it can tip over
  tree = K.group(); acacia(tree);
  // metal sculpture (shown at the end)
  metal = K.group(); metal.visible = false; const steel = K.toon({ color: '#9aa4b2', emissive: '#1a1e24' });
  K.beam(K.V(0, 0, 0), K.V(0, 3.2, 0), 0.24, steel, metal); for (let i = 0; i < 6; i++) { const a = i * 1.05; K.beam(K.V(0, 3.0, 0), K.V(Math.cos(a) * 1.8, 4.2 + (i % 2) * 0.4, Math.sin(a) * 1.8), 0.1, steel, metal); }
  for (let i = 0; i < 3; i++) K.add(new THREE.TorusGeometry(1.2 + i * 0.6, 0.06, 6, 24), steel, 0, 4.3 + i * 0.12, 0, metal).rotation.x = Math.PI / 2;
  K.cyl(0.6, 0.7, 0.4, K.col('#8a8070'), 0, 0, 0, metal);
  // 1970s lorry along +x: cab, hood, flatbed with drums
  truck = K.group(); const red = K.col('#c8502e'), dark = K.col('#2b2e36'), glass = K.col('#9fd0e8'), chrome = K.col('#d7dbe2');
  K.slab(-5, 1.6, 0.75, 1.0, -1.15, 1.15, dark, truck); K.slab(1.4, 3.4, 0.9, 2.1, -1.2, 1.2, red, truck); K.slab(1.4, 3.4, 3.0, 3.3, -1.2, 1.2, red, truck); K.slab(1.4, 1.6, 2.1, 3.0, -1.2, 1.2, red, truck); K.slab(3.2, 3.4, 2.1, 3.0, -1.2, 1.2, red, truck); K.slab(3.38, 3.42, 2.1, 3.0, -1.05, 1.05, glass, truck);
  K.slab(1.6, 3.2, 2.2, 3.0, -1.22, -1.19, glass, truck); K.slab(3.4, 3.55, 0.8, 1.6, -1.1, 1.1, chrome, truck);
  for (const z of [-0.8, 0.8]) K.add(new THREE.SphereGeometry(0.16, 10, 8), K.col('#fff6c8'), 3.55, 1.3, z, truck);
  K.slab(-5, 1.3, 1.0, 1.2, -1.2, 1.2, K.col('#9a6a44'), truck); for (const z of [-1.2, 1.2]) K.slab(-5, 1.3, 1.2, 1.9, z - 0.04, z + 0.04, K.col('#8a5a34'), truck);
  for (let i = 0; i < 6; i++) K.cyl(0.38, 0.38, 1.1, K.col(i % 2 ? '#3f6a8a' : '#8a3a32'), -4.3 + (i % 3) * 1.6, 1.2, i < 3 ? -0.5 : 0.5, truck, 14);
  for (const x of [-3.6, -2.4, 2.4]) for (const z of [-1.1, 1.1]) { const w = K.add(new THREE.CylinderGeometry(0.55, 0.55, 0.35, 18), dark, x, 0.55, z, truck); w.rotation.x = Math.PI / 2; wheels.push(w); }
  // --- roots cross-section diorama (far away): sand block cut open, roots down to the water table
  const rs = K.group(); rs.position.set(...ROOT);
  const strata = PR.canvasTex(512, 512, (g) => { const cols = ['#e2b878', '#d4a466', '#c8955a', '#b8844e', '#a8764a', '#9a6a44'];
    for (let i = 0; i < 6; i++) { g.fillStyle = cols[i]; g.fillRect(0, i * 78, 512, 80); }
    g.fillStyle = '#4fa0d0'; g.fillRect(0, 468, 512, 44); g.fillStyle = 'rgba(255,255,255,.35)'; for (let i = 0; i < 12; i++) g.fillRect(i * 44, 476 + (i % 2) * 14, 26, 5);
    g.fillStyle = 'rgba(0,0,0,.1)'; for (let i = 0; i < 400; i++) g.fillRect((i * 97) % 512, (i * 61) % 460, 4, 3); });
  K.add(new THREE.BoxGeometry(60, 40, 30), K.toon({ map: strata }), 0, -20, -15, rs, { cast: false });
  K.slab(-200, 200, -0.2, 0, -200, -30, K.col('#e2b878'), rs, false);
  acacia(rs).position.set(0, 0, -1.2);
  const rootM = K.col('#7a4e30'); roots = K.group(rs);
  const rpath = [[0, 0], [0.4, -6], [-0.6, -13], [0.5, -20], [-0.4, -27], [0.3, -33], [0, -36.5]];
  for (let i = 0; i + 1 < rpath.length; i++) K.beam(K.V(rpath[i][0], rpath[i][1], 0.25), K.V(rpath[i + 1][0], rpath[i + 1][1], 0.25), 0.34 - i * 0.035, rootM, roots);
  for (const [x0, y0, x1, y1] of [[0.2, -2, 3.5, -6], [-0.2, -3, -3.8, -7.5], [0.4, -9, 2.6, -13], [-0.5, -15, -2.8, -19], [0.2, -24, 2.2, -28]]) K.beam(K.V(x0, y0, 0.2), K.V(x1, y1, 0.2), 0.13, rootM, roots);
  // --- museum hall (far away)
  const mh = K.group(); mh.position.set(...MUS);
  K.slab(-20, 20, -0.2, 0, -12, 12, K.toon({ map: PR.speckTex('#b8a890', ['#a89880', '#c8b8a0'], 3, 800, 6) }), mh, false);
  K.slab(-20, 20, 0, 9, -6, -5.6, K.col('#e8dcc4'), mh, false); K.slab(-6, 6, 0, 0.6, -2.4, 0.8, K.col('#5a4a40'), mh);
  const log = K.group(mh); log.position.set(0, 0.6, -0.8); log.rotation.z = 0.12; K.beam(K.V(-2.4, 0.3, 0), K.V(2.6, 0.5, 0), 0.5, K.col('#6a4a32'), log); K.beam(K.V(1.4, 0.45, 0), K.V(2.6, 1.3, 0.1), 0.25, K.col('#6a4a32'), log);
  const plq = PR.canvasTex(512, 160, (g) => { g.fillStyle = '#2a2a30'; g.fillRect(0, 0, 512, 160); g.fillStyle = '#e8c45a'; g.font = 'bold 50px Poppins, sans-serif'; g.textAlign = 'center'; g.fillText("L'ARBRE DU TÉNÉRÉ", 256, 70); g.font = '36px Poppins, sans-serif'; g.fillText('† 1973', 256, 128); });
  K.add(new THREE.BoxGeometry(3.2, 1.0, 0.05), new THREE.MeshBasicMaterial({ map: plq }), 0, 3.4, -5.5, mh, { cast: false });
  for (const x of [-4, 4]) K.cyl(0.06, 0.1, 1.0, K.col('#c8a040'), x, 0, 1.6, mh); K.beam(K.V(-4, 0.9, 1.6), K.V(4, 0.9, 1.6), 0.05, K.col('#a8302a'), mh);
}

// ---------------- state ----------------
const tilt = (f) => { const id = shotAt(f).id; if (id === 'hook') return lerp(0.18, 0.55, M.easeOut(ramp(f, 0, 40))); if (id === 'snap') return lerp(0, 1.45, M.easeIn(ramp(f, F_SNAP - 2, F_SNAP + 14))); return 0; };
const truckX = (f) => { const id = shotAt(f).id; if (id === 'hook') return -3.7; if (id === 'truck') return -60 + (f - cut(5)) * 0.4; if (id === 'aerial') return -38 + (f - cut(6)) * 0.45;
  if (id === 'driver') return -16 + (f - cut(7)) * 0.2; if (id === 'snap') return lerp(-8, -3.7, M.easeOut(ramp(f, F_SNAP - 14, F_SNAP - 1))); if (id === 'metal') return lerp(-40, -6.5, M.easeOut(ramp(f, cut(9), F_TRY - 6))); if (id === 'loop') return -3.7; return -400; };
const truckZ = (f) => { const id = shotAt(f).id; return id === 'truck' || id === 'aerial' || id === 'driver' ? TRAILZ - 2.4 * ramp(f, cut(6), F_SNAP) : 0.2; };
function poseWorld(f) {
  const id = shotAt(f).id;
  tree.rotation.set(0, 0, -tilt(f)); tree.visible = !['metal', 'museum', 'roots'].includes(id);
  if (id === 'loop') tree.rotation.z = -0.18;
  metal.visible = id === 'metal';
  const x = truckX(f), z = truckZ(f); truck.position.set(x, dune(x, z), z); truck.visible = x > -300 && id !== 'museum' && id !== 'roots';
  truck.rotation.set(0, id === 'aerial' || id === 'driver' ? 0.12 : 0, id === 'hook' || id === 'loop' ? 0.03 : 0);
  wheels.forEach((w) => { w.rotation.y = -x / 0.55; });
  roots.scale.y = id === 'roots' ? lerp(0.15, 1, M.smooth(ramp(f, F_ROOTS - 4, F_WATER))) : 1;
}

// ---------------- characters ----------------
const camel = (p, phase = 0, walk = true, head = 0) => {
  const TAU = Math.PI * 2, bob = walk ? 8 * Math.abs(Math.sin(phase * TAU)) : 0, body = '#c8925a', dk = '#a8743e', leg = '#b8824c';
  for (const [hx, s, c] of [[220, 1, dk], [400, -1, dk], [240, -1, leg], [420, 1, leg]]) { const a = walk ? s * 0.4 * Math.sin(phase * TAU) : 0;
    const kn = [hx + 30 * Math.sin(a), 720]; const ft = [hx + 70 * Math.sin(a), 975]; p.line([[hx, 560 - bob], kn, ft], c, 24); p.ell(ft[0] + 6, 970, 24, 10, c, 6); }
  p.ell(320, 540 - bob, 170, 95, body, 12); p.ell(300, 445 - bob, 85, 85, body, 12); p.ell(300, 470 - bob, 60, 40, body, 0);
  const nk = [[470, 520 - bob], [540, 470 - bob], [560 + head * 10, 380 - bob], [575 + head * 14, 330 - bob]]; p.line(nk, body, 50);
  const hx = 590 + head * 14, hy = 320 - bob; p.ell(hx, hy, 52, 32, body, 10); p.ell(hx + 38, hy + 12, 22, 18, body, 8);
  p.ell(hx - 4, hy - 8, 13, 13, '#ffffff', 5); p.dot(hx, hy - 7, 6); p.stroke([[hx - 30, hy - 28], [hx - 22, hy - 44]], 8, INK);
  p.stroke([[170, 520 - bob], [130, 600 - bob]], 10, dk);
  p.poly([[230, 470 - bob], [400, 470 - bob], [390, 560 - bob], [240, 560 - bob]], '#b8322f', 8); p.stroke([[240, 500 - bob], [390, 500 - bob]], 6, '#f2c230');
};
const NOMAD = (c, s = '#c99067') => ({ jacket: c, pants: c, boots: '#5a3b2a', hat: 'cap', cap: '#2f4f8a', skin: s, dress: c });
const DRIVER = { jacket: '#5a8fc2', pants: '#4a4f62', boots: '#2a2420', hat: 'hair', hair: '#1e1714', moustache: '#1e1714', skin: '#c99067' };
const VISIT = [{ jacket: '#e2742d', pants: '#3b4f7a', boots: '#4a3426', hat: 'hair', hair: '#5a3b2a' }, { jacket: '#3f8a5a', pants: '#6a5a4a', boots: '#4a3426', hat: 'hair', hair: '#1e1714', dress: '#c25a7a', skin: '#c99067' },
  { jacket: '#d9a441', pants: '#4a4f62', boots: '#4a3426', hat: 'cap', cap: '#c8402e', build: 'kid', skin: '#f5c9a0' }];
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
const camelCard = (key, x, z, f, walk, dir = 1, s = 1.25, head = 0) => { const ph = walk ? q(((f * 0.03 + x * 0.1) % 1 + 1) % 1, 1) : 0;
  return { key: 'cm' + walk + ph + head, draw: (p) => { p.g.translate(300, 0); p.g.scale(0.85, 1); p.g.translate(-340, 0); camel(p, ph, walk, head); }, x, y: dune(x, z), z, s, flip: dir < 0 }; };

function actorsAt(f, T) {
  const S = shotAt(f), out = [];
  switch (S.id) {
    case 'caravan': for (let i = 0; i < 6; i++) { const x = -14 + (f - S.a) * 0.05 + i * 3.6; out.push(camelCard('c' + i, x, TRAILZ + 0.2, f, true));
      if (i % 2 === 0) out.push(card(T, 'n' + i, NOMAD(['#2f4f8a', '#e8e0d0', '#5a3a6a'][i / 2]), fo(f, 10 + i, { mode: 'march', phase: q(((f * 0.034 + i * 0.3) % 1), 1), expr: 'neutral', look: 0.3 }), [x - 1.6, dune(x, TRAILZ + 1.4), TRAILZ + 1.4])); } break;
    case 'camels': [[-2.3, -1.2, 1], [2.4, -0.8, -1], [-1.6, -4.5, 1], [1.8, -4.0, -1], [4.5, -7, -1]].forEach(([x, z, d], i) => out.push(camelCard('k' + i, x, z, f, i === 4, d, 1.25, q(Math.sin(f * 0.06 + i), 1))));
      out.push(card(T, 'nn', NOMAD('#2f4f8a'), fo(f, 21, { expr: 'smile', look: -0.3 }), [0.4, 0, 3.6])); break;
    case 'driver': out.push(card(T, 'drv', DRIVER, fo(f, 30, { expr: f > F_DRUNK - 4 ? 'dazed' : 'whistle', headTilt: q(10 * Math.sin(f * 0.15), 1), tilt: q(4 * Math.sin(f * 0.1), 1) }), [0, 0, 0], { s: 0.55, blob: false, shadow: false })); break;
    case 'museum': VISIT.forEach((o, i) => out.push(card(T, 'v' + i, o, fo(f, 40 + i, { expr: ['shock', 'pained', 'neutral'][i], look: -0.5, facing: 0 }), [MUS[0] + [-1.9, 1.9, 0.3][i], 0, MUS[2] + [3.0, 3.2, 3.8][i]]))); break;
    case 'metal': case 'loop': if (S.id === 'metal' && f > F_TRY - 20) out.push(card(T, 'drv2', DRIVER, fo(f, 30, { expr: 'nervous', look: 0.6 }), [truckX(f) + 1.0, 0, 3.0], { s: 0.95 })); break;
  }
  return out;
}

function fxAt(f, T, cam) {
  const S = shotAt(f), out = [], push = (x) => x && out.push(x);
  const dust = (x, z, t0, s = 4, n = 5) => { for (let i = 0; i < n; i++) { const t = q(clamp((f - t0) / 30 + i * 0.06), 2); if (f < t0 || t >= 1) continue; out.push(FX('d' + i + t, (p) => { p.g.translate(150, 500); p.g.scale(2, 2); T.fxPuff(p, t); }, [x + (i - 2) * 0.8, 1.2 + i * 0.3, z + (i % 2) * 0.6], s + t * 2, { alpha: 0.95 })); } };
  if (S.id === 'hook') { dust(0.6, 0.6, 0, 3.4); push(wordCard(f, F_1973, '1973', cam, '#f6c83a', F_250 - F_1973 - 6)); push(wordCard(f, F_250, '250 MILES', cam, '#ffffff', 1e9, 170, 0.5)); }
  if (S.id === 'alone') push(wordCard(f, F_ALONE, 'ALONE', cam, '#ffffff', 1e9, 170, 0.55));
  if (S.id === 'roots') push(wordCard(f, F_100, '100+ FEET', cam, '#f6c83a', 1e9, 170, 0.4));
  if (S.id === 'map') { out.push(FX('mapx' + (f > F_CITY), (p) => { p.poly([[40, 140], [560, 120], [570, 880], [30, 900]], '#efe2c0', 12);
      p.stroke([[60, 500], [200, 470], [300, 500], [440, 430], [560, 460]], 7, '#b8784a'); p.stroke([[300, 140], [290, 300], [300, 500], [320, 700], [300, 880]], 7, '#b8784a');
      p.g.setLineDash([18, 14]); p.stroke([[60, 700], [300, 500], [540, 250]], 6, '#8a3a32'); p.g.setLineDash([]);
      p.ell(300, 500, 46, 30, '#6f8f3a', 7); p.stroke([[300, 520], [300, 560]], 9, '#6a4a32');
      p.g.font = 'bold 44px Poppins, sans-serif'; p.g.fillStyle = '#3a2a20'; p.g.textAlign = 'center'; p.g.fillText('ARBRE DU TÉNÉRÉ', 300, 620);
      p.g.font = '36px Poppins, sans-serif'; p.g.fillText('BILMA', 470, 230); p.g.fillText('AGADEZ', 140, 790);
      if (f > F_CITY) p.ell(300, 510, 120, 90, null, 9); }, inFront(cam, 3, 0, -0.1), 1.25, { order: 7 }));
    push(wordCard(f, F_CITY, 'LIKE A CITY', cam, '#e8503a', 1e9, 160, 0.62)); }
  if (S.id === 'camels') push(wordCard(f, F_NONE, 'NOT ONE', cam, '#ffffff', 1e9, 170, 0.55));
  if (S.id === 'truck' || S.id === 'aerial' || S.id === 'metal') { const x = truckX(f), z = truckZ(f); for (let i = 0; i < 4; i++) { const t = q(((f * 0.05 + i * 0.25) % 1), 1);
    out.push(FX('td' + i + t, (p) => { p.g.translate(150, 500); p.g.scale(2, 2); T.fxPuff(p, t); }, [x - 5.5 - t * 5, dune(x, z) + 0.9, z + (i % 2) - 0.5], 2.5 + t * 2.5, { alpha: 0.9 })); } }
  if (S.id === 'aerial') push(wordCard(f, F_HOW + 6, '?!', cam, '#ffffff', 1e9, 260, 0.45));
  if (S.id === 'driver') { push(wordCard(f, F_DRUNK, 'HIC!', cam, '#ffffff', 1e9, 160, 0.55)); }
  if (S.id === 'snap') { if (f >= F_SNAP - 2) { const t = q(Math.min(1, (f - F_SNAP + 2) / 14)); out.push(FX('snb' + t, (p) => { p.g.translate(50, 250); T.fxBurst(p, t, '#fff3b0', 12, 60, 260); }, [0.6, 1.4, 0.8], 2.6)); }
    dust(0.5, 0.8, F_SNAP, 3.2); push(wordCard(f, F_SNAP, 'SNAP!', cam, '#ffffff')); }
  if (S.id === 'museum') push(wordCard(f, F_MUS, 'MUSEUM', cam, '#f6c83a', 1e9, 170, 0.55));
  if (S.id === 'metal') push(wordCard(f, F_METAL, 'METAL', cam, '#cfd8e4', 1e9, 190, 0.5));
  if (S.id === 'loop') dust(0.6, 0.6, S.a, 3.4);
  return out;
}

// ---------------- cameras ----------------
const C = (p, d) => [p[0] + d[0], p[1] + d[1], p[2] + d[2]];
const CAMS = {
  hook: [{ f: 0, pos: [3.5, 2.0, 10.5], look: [-0.6, 2.4, 0], fov: 50 }, { f: F_ONLY - 6, pos: [4.5, 2.8, 13], look: [-0.5, 2.6, 0], fov: 50 },
    { f: F_250 + 10, pos: [10, 60, 70], look: [0, 0, 0], fov: 46 }, { f: cut(1), pos: [12, 80, 90], look: [0, 0, 0], fov: 44 }],
  alone: [{ f: cut(1), pos: [-14, 2.0, 36], look: [0, 4, 0], fov: 44 }, { f: cut(2), pos: [-10, 2.2, 26], look: [0, 3.6, 0], fov: 40 }],
  roots: [{ f: cut(2), pos: [0, 3, 32], look: [0, -1, 0], fov: 50 }, { f: F_100 - 4, pos: [0, -14, 36], look: [0, -16, 0], fov: 52 }, { f: cut(3), pos: [0, -30, 30], look: [0, -34, 0], fov: 48 }],
  caravan: [{ f: cut(3), pos: [2, 2.2, 16], look: [-2, 2.6, 0], fov: 46 }, { f: F_MAPS - 4, pos: [4, 2.4, 14], look: [0, 2.8, 0], fov: 44 }],
  map: [{ f: F_MAPS - 4, pos: [0, 2, 10], look: [0, 2, 0], fov: 46 }, { f: cut(4), pos: [0, 2, 10.6], look: [0, 2, 0], fov: 44 }],
  camels: [{ f: cut(4), pos: [0.5, 2.6, 13], look: [0, 2.6, 0], fov: 50 }, { f: F_NONE - 4, pos: [1, 2.2, 10], look: [0, 2.4, 0], fov: 46 }],
  truck: [{ f: cut(5), pos: [-50, 2.4, 11], look: [-59, 2, TRAILZ], fov: 46 }, { f: cut(6), pos: [-51, 2.0, 9], look: [-59, 1.8, TRAILZ], fov: 46 }],
  aerial: [{ f: cut(6), pos: [-8, 110, 60], look: [-14, 0, 0], fov: 46 }, { f: cut(7), pos: [-6, 70, 40], look: [-10, 0, 0], fov: 44 }],
  driver: [{ f: cut(7), pos: [0.4, 0.5, 3.6], look: [0, 0.4, 0], fov: 40 }, { f: F_SNAP - 14, pos: [0.3, 0.5, 3.0], look: [0, 0.45, 0], fov: 38 }],
  snap: [{ f: F_SNAP - 14, pos: [5.5, 2.4, 11], look: [-1, 2.4, 0], fov: 50 }, { f: cut(8), pos: [6.5, 2.2, 12.5], look: [-1, 1.8, 0], fov: 50 }],
  museum: [{ f: cut(8), pos: [0, 2.8, 9], look: [0, 1.1, -1], fov: 46 }, { f: F_MUS, pos: [0, 2.6, 7.5], look: [0, 1.2, -1.2], fov: 44 }],
  metal: [{ f: cut(9), pos: [3.0, 2.0, 11], look: [-0.4, 2.8, 0], fov: 48 }, { f: F_METAL, pos: [3.2, 2.4, 10.5], look: [-0.8, 3.0, 0], fov: 46 }, { f: F_TRY - 3, pos: [3.5, 2.0, 10.5], look: [-1.2, 2.4, 0], fov: 50 }],
  loop: [{ f: F_TRY - 3, pos: [3.6, 2.0, 10.8], look: [-0.6, 2.4, 0], fov: 51 }, { f: TOTAL - 1, pos: [3.5, 2.0, 10.5], look: [-0.6, 2.4, 0], fov: 50 }],
};
const KICKS = [{ f: 2, a: 0.04 }, { f: F_SNAP, a: 0.06 }, { f: F_100, a: 0.02 }];
const camAt = (f) => {
  const S = shotAt(f); const c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS });
  if (S.id === 'roots') { c.pos = C(ROOT, c.pos); c.look = C(ROOT, c.look); }
  if (S.id === 'museum') { c.pos = C(MUS, c.pos); c.look = C(MUS, c.look); }
  if (S.id === 'truck') { const x = truckX(f) - truckX(cut(5)); c.pos[0] += x; c.look[0] += x; }
  if (S.id === 'driver') { const tp = truck.position; const d = [tp.x + 2.4, tp.y + 2.2, tp.z]; c.pos = C(d, c.pos); c.look = C(d, c.look); }
  c.shadowAt = S.id === 'roots' ? ROOT : S.id === 'museum' ? MUS : S.id === 'aerial' ? [-10, 0, 0] : S.id === 'truck' ? [truckX(f), 0, TRAILZ] : [0, 0, 0];
  return c;
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => {
  const S = shotAt(f);
  if (S.id === 'driver') return { focus: dist(Cm.pos, truck.position.toArray().map((v, i) => v + [2.4, 2.4, 0][i])), cinf: 10 };
  if (S.id === 'museum') return { focus: dist(Cm.pos, C(MUS, [0, 1.6, 3])), cinf: 9 };
  if (S.id === 'map') return { focus: 3, cinf: 10 };
  return { focus: 10, cinf: 0 };
};

export default {
  TOTAL, build,
  frame(f, k) {
    poseWorld(f);
    const S = shotAt(f), cam = camAt(f);
    const light = S.id === 'museum' ? { ...HALL } : ['alone', 'metal'].includes(S.id) ? { ...GOLD } : { ...DAY };
    if (S.id === 'aerial' || S.id === 'hook') light.shadowExt = 60;
    const fx = fxAt(f, k.T, cam), actors = actorsAt(f, k.T);
    if (S.id === 'driver') { const tp = truck.position; actors[0].x = tp.x + 2.4; actors[0].y = tp.y + 1.75; actors[0].z = tp.z; }
    return { light, cam, dof: dofAt(f, cam), actors, fx };
  },
};
