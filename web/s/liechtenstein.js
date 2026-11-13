// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The Swiss army invades Liechtenstein by accident" — night of 1 Mar 2007, Alpine border. Timed via liechtenstein_timing.js.
import { TOTAL, LINES, wf } from './liechtenstein_timing.js';
import * as PR from '../props.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const F_2007 = wf(0, '2007'), F_ACC = wf(0, 'accident'), F_170 = wf(1, '170'), F_ALPS = wf(1, 'alps'), F_POUR = wf(2, 'pouring'), F_BORDER = wf(2, 'border'), F_FENCE = wf(2, 'fence'),
  F_MILE = wf(3, 'mile'), F_LIE = wf(3, 'liechtenstein'), F_RIFLE = wf(4, 'rifles'), F_BULLET = wf(4, 'bullet'), F_MAP = wf(5, 'map'), F_WRONG = wf(5, 'wrong'),
  F_TURN = wf(6, 'turned'), F_TIP = wf(6, 'tiptoed'), F_NOBODY = wf(7, 'nobody'), F_LIE2 = wf(7, 'liechtenstein'), F_ARMY = wf(7, 'army'), F_NOTICE = wf(8, 'noticed'),
  F_SPOKE = wf(9, 'spokeswoman'), F_SHRUG = wf(9, 'shrugged'), F_HAPP = wf(9, 'happened');
const SHOTS = [['hook', 0], ['march', cut(1)], ['rain', cut(2)], ['stone', F_BORDER - 4], ['mile', cut(3)], ['rifle', cut(4)], ['map', cut(5)], ['back', cut(6)],
  ['village', cut(7)], ['sleep', cut(8)], ['quote', cut(9)], ['loop', F_HAPP - 6]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const NIGHT = { az: 215, el: 38, sky: '#8090c8', ground: '#3a4058', hemi: 1.45, sun: '#c8d4ff', sunI: 1.5, fog: '#2c3a62', fogNear: 50, fogFar: 420,
  skyTop: '#0c1636', skyHor: '#41558c', sat: 1.05, vig: 0.3, shadowExt: 26, gain: '#f0f2ff' };
const HALL = { az: 120, el: 60, sky: '#f0e0c8', ground: '#5a4a40', hemi: 1.2, sun: '#fff0d8', sunI: 2.0, fog: '#2a2a3a', fogNear: 60, fogFar: 200,
  skyTop: '#2a2a3a', skyHor: '#2a2a3a', sat: 1.08, vig: 0.28, shadowExt: 14 };
const POD = [0, 0, -3000], VIL = [70, 0, -40], SL = [47, 0, 5];
let K;
const rnd = (() => { let s = 21; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();

const ground = (x, z) => {
  const vm = 1 - 0.8 * clamp(1 - Math.abs(x - 68) / 45), back = z < -6 ? Math.pow(-z - 6, 1.15) * 0.3 * vm : 0, front = z > 8 ? -(z - 8) * 0.05 : 0;
  return back + front + 0.35 * Math.sin(x * 0.13) * Math.sin(z * 0.17) * clamp((Math.abs(z) - 3) / 6);
};

function build(k) {
  K = k; const { THREE } = K;
  K.addClouds(10, 800, 140);
  // meadow + forest slope
  PR.terrain(K, 600, 200, ground, K.toon({ map: PR.speckTex('#4f7a46', ['#456d3e', '#5a8650', '#3f6438'], 4, 2600, 60) }));
  // muddy path along x
  const path = new THREE.PlaneGeometry(600, 2.8, 120, 1); path.rotateX(-Math.PI / 2);
  K.add(path, K.toon({ map: PR.speckTex('#8a7458', ['#7a6448', '#9a8466', '#6a5640'], 9, 1800, 40) }), 0, 0.03, 0, K.scene, { cast: false });
  // pines (one merged mesh): forest on the back slope and scattered in front
  const mats = [], M4 = THREE.Matrix4;
  for (let i = 0; i < 900; i++) {
    const x = (rnd() - 0.5) * 360, z = -8 - rnd() * 140; if ((Math.abs(x - VIL[0]) < 34 && z > -70) || (Math.abs(x - 64) < 30 && z > -140)) continue;
    const s = 0.8 + rnd() * 0.9; mats.push(new M4().makeTranslation(x, ground(x, z), z).multiply(new M4().makeScale(s, s * (0.9 + rnd() * 0.4), s)));
  }
  for (let i = 0; i < 60; i++) { const x = (rnd() - 0.5) * 200, z = 9 + rnd() * 40; if ((Math.abs(x) < 14 && z < 20) || (x > 28 && x < 62 && z < 26)) continue; const s = 0.9 + rnd() * 0.6; mats.push(new M4().makeTranslation(x, ground(x, z), z).multiply(new M4().makeScale(s, s, s))); }
  const cone = new THREE.ConeGeometry(1.6, 3.2, 8); const tiers = [];
  for (const m of mats) for (let t = 0; t < 3; t++) tiers.push(m.clone().multiply(new M4().makeTranslation(0, 1.6 + t * 1.5, 0)).multiply(new M4().makeScale(1 - t * 0.25, 1 - t * 0.15, 1 - t * 0.25)));
  const pines = K.add(PR.mergeCopies(cone, tiers), K.col('#2f5a3e'), 0, 0, 0); pines.frustumCulled = false;
  const trunk = K.add(PR.mergeCopies(new THREE.CylinderGeometry(0.2, 0.28, 1.8, 6), mats.map((m) => m.clone().multiply(new M4().makeTranslation(0, 0.8, 0)))), K.col('#5a4030'), 0, 0, 0); trunk.frustumCulled = false;
  // far Alps with snow caps
  const rock = K.col('#5a6680'), snow = K.col('#eef2fa');
  [[-260, -380, 150, 190], [-90, -420, 120, 230], [60, -400, 140, 200], [220, -360, 130, 170], [-170, -300, 90, 120], [150, -300, 80, 110], [360, -420, 150, 210]].forEach(([x, z, r, h]) => {
    K.add(new THREE.ConeGeometry(r, h, 7), rock, x, h / 2 - 10, z, K.scene, { cast: false }); K.add(new THREE.ConeGeometry(r * 0.36, h * 0.36, 7), snow, x, h - 10 - h * 0.18 + 0.5, z, K.scene, { cast: false });
  });
  // border stone (CH | FL) at x = 0 beside the path
  const stoneT = PR.canvasTex(256, 384, (g) => { g.fillStyle = '#c9c4b6'; g.fillRect(0, 0, 256, 384); g.fillStyle = '#3a3a44'; g.font = 'bold 76px Poppins, sans-serif'; g.textAlign = 'center';
    g.fillText('CH', 128, 120); g.fillRect(40, 160, 176, 10); g.fillText('FL', 128, 270); g.fillStyle = 'rgba(0,0,0,.12)'; for (let i = 0; i < 30; i++) g.fillRect((i * 53) % 256, (i * 97) % 384, 14, 6); });
  const st = K.add(new THREE.BoxGeometry(0.5, 1.0, 0.3), K.toon({ map: stoneT }), 0, 0.5, -1.75); st.rotation.y = 0.1;
  K.sphere(0.27, K.col('#c9c4b6'), 0, 1.0, -1.75, K.scene, 0.92, 0.4, 0.55);
  // signpost deeper in Liechtenstein
  const signT = PR.canvasTex(512, 128, (g) => { g.fillStyle = '#f2ead6'; g.fillRect(0, 0, 512, 128); g.strokeStyle = '#3a2a20'; g.lineWidth = 10; g.strokeRect(5, 5, 502, 118);
    g.fillStyle = '#2f4f8a'; g.font = 'bold 54px Poppins, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('VADUZ  4 km  →', 256, 66); });
  K.cyl(0.07, 0.08, 2.4, K.col('#6a4a30'), 34, 0, -1.9); K.add(new THREE.BoxGeometry(1.7, 0.42, 0.06), new THREE.MeshBasicMaterial({ map: signT }), 34.5, 2.1, -1.88);
  // village: chalets with lit windows, a church, the castle on its rock
  const lit = K.toon({ color: '#ffd77a', emissive: '#c88a20' }), walls = ['#e8dcc4', '#f2e6d0', '#d8c8a8', '#efe0c8'];
  const chalet = (x, z, i, ry = 0) => { const g = K.group(); g.position.set(x, ground(x, z), z); g.rotation.y = ry;
    K.slab(-3.5, 3.5, 0, 4.5, -3, 3, K.col(walls[i % 4]), g); K.slab(-3.6, 3.6, 0, 1.2, -3.1, 3.1, K.col('#7a5a3e'), g);
    const r = K.add(new THREE.CylinderGeometry(0.1, 5.4, 3, 4, 1), K.col('#5a3a2e'), 0, 6, 0, g); r.rotation.y = Math.PI / 4; r.scale.set(1, 1, 0.85);
    for (const wx of [-2, 0.2, 2.2]) K.slab(wx - 0.55, wx + 0.55, 2.3, 3.4, 3.0, 3.08, (i + wx * 3) % 3 < 2 ? lit : K.col('#3a4a5c'), g);
    K.slab(-0.6, 0.6, 0, 2.1, 3.0, 3.1, K.col('#5a3a26'), g); return g; };
  let ci = 0; for (const [dx, dz] of [[-22, 6], [-12, 10], [-2, 4], [9, 9], [19, 3], [-16, -8], [4, -10], [15, -6], [26, -12], [-26, -14], [32, 6]]) chalet(VIL[0] + dx, VIL[2] + dz, ci++, (dx % 3) * 0.2);
  const ch = K.group(); ch.position.set(VIL[0] + 2, ground(VIL[0] + 2, VIL[2] - 22), VIL[2] - 22);
  K.slab(-3, 3, 0, 14, -3, 3, K.col('#efe6d6'), ch); K.add(new THREE.ConeGeometry(3.2, 9, 8), K.col('#3a5a6a'), 0, 18.5, 0, ch); K.slab(-1, 1, 9, 11, 3, 3.1, lit, ch);
  const CG = ground(VIL[0] - 6, VIL[2] - 70); K.sphere(26, K.col('#6a6458'), VIL[0] - 6, CG - 8, VIL[2] - 70, K.scene, 1.1, 0.95, 0.9);
  const cas = K.group(); cas.position.set(VIL[0] - 6, CG + 15, VIL[2] - 70); const cw = K.col('#efe8da'), cr = K.col('#8a3a2e');
  K.slab(-9, 9, 0, 9, -5, 5, cw, cas); K.cyl(3.4, 3.4, 15, cw, -9, 0, 0, cas); K.add(new THREE.ConeGeometry(4.0, 5, 12), cr, -9, 17.5, 0, cas);
  K.slab(5, 11, 0, 18, -4, 4, cw, cas); K.add(new THREE.ConeGeometry(5.2, 5, 4), cr, 8, 20.5, 0, cas).rotation.y = Math.PI / 4;
  for (const wx of [-4, -1, 2]) K.slab(wx - 0.6, wx + 0.6, 4, 5.8, 5, 5.1, lit, cas); K.slab(-9.6, -8.4, 9, 11, 3.4, 3.5, lit, cas);
  // the sleeper's porch: a bench in front of a chalet near the path
  const bench = K.group(); bench.position.set(SL[0], ground(SL[0], SL[2]), SL[2] - 0.15);
  K.slab(-1.2, 1.2, 0.45, 0.55, -0.3, 0.3, K.col('#8a6040'), bench); for (const s of [-1, 1]) K.slab(s * 1.0 - 0.07, s * 1.0 + 0.07, 0, 0.45, -0.25, 0.25, K.col('#6a4a30'), bench);
  const lamp = K.cyl(0.06, 0.08, 2.6, K.col('#3a3a40'), SL[0] + 1.8, ground(SL[0], SL[2]), SL[2] + 0.6); K.sphere(0.25, K.toon({ color: '#ffe8a0', emissive: '#e0b040' }), SL[0] + 1.8, ground(SL[0], SL[2]) + 2.7, SL[2] + 0.6);
  // press room (far away)
  const pr = K.group(); pr.position.set(...POD);
  K.slab(-20, 20, -0.2, 0, -10, 10, K.col('#6a4a3a'), pr, false);
  const back = PR.canvasTex(512, 256, (g) => { g.fillStyle = '#2a4a9a'; g.fillRect(0, 0, 512, 128); g.fillStyle = '#c8302a'; g.fillRect(0, 128, 512, 128); g.fillStyle = 'rgba(255,255,255,.12)'; for (let i = 0; i < 8; i++) g.fillRect(i * 64, 0, 4, 256); });
  K.add(new THREE.BoxGeometry(14, 7, 0.2), K.toon({ map: back }), 0, 3.5, -3, pr, { cast: false });
  K.slab(-2, 2, 0, 0.35, -1.6, 0.2, K.col('#4a3a40'), pr); K.slab(-0.7, 0.7, 0, 1.25, -0.25, 0.45, K.col('#7a5234'), pr); K.slab(-0.8, 0.8, 1.25, 1.35, -0.3, 0.5, K.col('#5a3a24'), pr);
  K.beam(K.V(0.45, 1.35, 0.1), K.V(0.35, 1.7, -0.25), 0.03, K.col('#2a2a30'), pr); K.sphere(0.07, K.col('#2a2a30'), 0.33, 1.73, -0.3, pr);
}

// ---------------- soldiers ----------------
const NS = 18, SP = 1.45;
const headX = (f) => {
  const id = shotAt(f).id, s = shotAt(f).a;
  if (id === 'hook' || id === 'loop') return 4.5 + (f - s) * 0.045;
  if (id === 'march') return 10 + (f - s) * 0.045;
  if (id === 'mile') return 22 + (f - s) * 0.06;
  if (id === 'back') return 36 - (f - s) * 0.035;
  if (id === 'sleep') return 44 - (f - s) * 0.035;
  return 0;
};
const soldierPos = (i, f) => { const back = shotAt(f).id === 'back' || shotAt(f).id === 'sleep'; return [headX(f) + (back ? i : -i) * SP + (i % 2) * 0.25, 0, i % 2 ? 0.55 : -0.55]; };

const SOLD = { jacket: '#5f6e48', pants: '#4f5c3c', boots: '#2a2420', hat: 'cap', cap: '#55643f', belt: '#3a3a2a', rifle: true };
const SOLDS = [SOLD, { ...SOLD, skin: '#f5c9a0' }, { ...SOLD, skin: '#ecd0b6', moustache: '#4a3426' }, { ...SOLD, skin: '#c99067' }];
const OFFI = { ...SOLD, rifle: false, moustache: '#5a3b2a', build: 'stout', jacket: '#56653f', buttons: '#e8c45a' };
const PJ = { jacket: '#7aa0d8', pants: '#7aa0d8', boots: '#c8402e', hat: 'hair', hair: '#9a9a9a', moustache: '#d8d8d8', build: 'stout', skin: '#f5c9a0' };
const SPOKE = { jacket: '#c8402e', pants: '#3a3e52', boots: '#2a2420', hat: 'hair', hair: '#5a3b2a', dress: '#2f4f8a' };
const PRESS = [{ jacket: '#4a4f62', pants: '#3b3f52', boots: '#2a2420', hat: 'hair', hair: '#1e1714' }, { jacket: '#8a6a48', pants: '#3b3f52', boots: '#2a2420', hat: 'hair', hair: '#d9a441', skin: '#f5c9a0' },
  { jacket: '#3f6a6f', pants: '#3b3f52', boots: '#2a2420', hat: 'cap', cap: '#c8402e', skin: '#c99067' }];
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

const column = (f, T, out, expr = 'stern', n = NS, stomp = 1) => {
  const back = shotAt(f).id === 'back' || shotAt(f).id === 'sleep';
  for (let i = 0; i < n; i++) { const p = soldierPos(i, f), ph = q(((f * 0.034 + i * 0.37) % 1), 1);
    out.push(card(T, 's' + i, SOLDS[i % 4], fo(f, 40 + i, { side: true, mode: 'march', phase: ph, expr: typeof expr === 'function' ? expr(i) : expr, stomp }), p, { flip: back })); }
};

function actorsAt(f, T) {
  const S = shotAt(f), out = [];
  switch (S.id) {
    case 'hook': case 'loop': column(f, T, out, (i) => (i % 3 ? 'stern' : 'neutral')); break;
    case 'march': column(f, T, out, 'stern'); break;
    case 'rain': [[-1.1, 0.3, 2], [0.9, 1.4, 1], [-0.2, -1.6, 3]].forEach(([x, z, v], i) => { const ph = q(((f * 0.034 + i * 0.4) % 1), 1);
      out.push(card(T, 'r' + i, SOLDS[v], fo(f, 50 + i, { mode: 'march', phase: ph, expr: f > F_POUR ? (i === 1 ? 'pained' : 'nervous') : 'stern', look: q(0.3 * Math.sin(f * 0.03 + i), 1) }), [x, 0, z + (f - S.a) * 0.012])); });
      break;
    case 'stone': break;
    case 'mile': column(f, T, out, (i) => (f > F_LIE && i % 2 ? 'grin' : 'stern')); break;
    case 'rifle': out.push(card(T, 'rf', SOLDS[1], fo(f, 61, { expr: f > F_BULLET ? 'nervous' : 'stern', look: f > F_BULLET ? -0.5 : 0, tilt: q(idle(f, 3).tilt, 1) }), [0, 0, 0.2]));
      out.push(card(T, 'rf2', SOLDS[2], fo(f, 62, { expr: f > F_BULLET + 6 ? 'dazed' : 'stern', look: 0.4 }), [1.3, 0, -0.9])); break;
    case 'map': out.push(card(T, 'off', OFFI, fo(f, 70, { expr: f > F_WRONG - 2 ? 'shock' : 'squint', look: f > F_WRONG - 2 ? 0 : -0.3, headTilt: q(idle(f, 2).headTilt, 1) }), [0, 0, 0.2]));
      out.push(card(T, 'm2', SOLDS[3], fo(f, 71, { expr: f > F_WRONG + 4 ? 'shock' : 'neutral', look: -0.6 }), [-1.2, 0, -0.8]));
      out.push(card(T, 'm3', SOLDS[0], fo(f, 72, { expr: f > F_WRONG + 8 ? 'pained' : 'neutral', look: -0.6 }), [1.25, 0, -1.0])); break;
    case 'back': column(f, T, out, (i) => (i % 2 ? 'nervous' : 'pained'), NS, 0.35); break;
    case 'sleep': { const g = ground(SL[0], SL[2]); out.push(card(T, 'pj', PJ, fo(f, 80, { mode: 'sit', expr: 'snore', blink: 0, headTilt: q(4 + 3 * Math.sin(f * 0.08), 1) }), [SL[0], g, SL[2]]));
      column(f, T, out, 'nervous', 10, 0.35); break; }
    case 'quote': { out.push(card(T, 'sp', SPOKE, fo(f, 90, { expr: f > F_SHRUG ? 'smile' : 'neutral', tilt: f > F_SHRUG ? q(6 * Math.sin((f - F_SHRUG) * 0.12), 1) : 0, headTilt: f > F_SHRUG ? 8 : 0, look: 0 }), [POD[0], 0.35, POD[2] - 0.6], { s: 1.0 }));
      PRESS.slice(0, 2).forEach((o, i) => out.push(card(T, 'pr' + i, o, fo(f, 91 + i, { expr: f > F_SHRUG + 8 ? ['laugh', 'grin'][i] : 'neutral', facing: 0, look: i ? -0.4 : 0.4 }), [POD[0] + (i ? 1.25 : -1.25), 0, POD[2] + 2.4]))); break; }
  }
  return out;
}

const rainFX = (f, c, out, alpha = 0.7) => { const k = f % 4; out.push(FX('rain' + k, (p) => { const g = p.g; g.save(); g.globalAlpha = alpha; g.strokeStyle = '#c8d8ff'; g.lineWidth = 3;
  let s = 7 + k * 101; const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < 140; i++) { const x = r() * 700 - 50, y = r() * 1000; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 14, y + 60 + r() * 30); g.stroke(); } g.restore(); }, inFront(c, 3, 0, 0), 1.3, { order: 8 })); };

function fxAt(f, T, cam) {
  const S = shotAt(f), out = [], push = (x) => x && out.push(x);
  if (S.id !== 'quote' && S.id !== 'village' && S.id !== 'sleep') rainFX(f, cam, out, S.id === 'rain' || S.id === 'stone' ? 0.8 : 0.55);
  if (S.id === 'village' || S.id === 'sleep') rainFX(f, cam, out, 0.3);
  if (S.id === 'hook') { push(wordCard(f, F_2007, '2007', cam, '#f6c83a', F_ACC - F_2007 - 4)); push(wordCard(f, F_ACC, 'OOPS!', cam, '#ffffff')); }
  if (S.id === 'march') push(wordCard(f, F_170, '170 SOLDIERS', cam, '#f6c83a', 50));
  if (S.id === 'stone') push(wordCard(f, F_FENCE, 'NO FENCE', cam, '#ffffff', 1e9, 170, 0.55));
  if (S.id === 'mile') push(wordCard(f, F_MILE, '1 MILE IN', cam));
  if (S.id === 'rifle') push(wordCard(f, F_BULLET, '0 BULLETS', cam, '#e8503a', 1e9, 170, 0.55));
  if (S.id === 'map') { const p = [0.05, 1.25, 0.75]; out.push(FX('mapc' + (f > F_WRONG), (pp) => { pp.poly([[150, 380], [450, 360], [460, 620], [140, 640]], '#f2ead6', 10);
      pp.stroke([[170, 520], [260, 470], [320, 540], [430, 480]], 8, '#6aa0d8'); pp.stroke([[300, 370], [310, 630]], 7, '#8a7a6a');
      pp.stroke([[190, 600], [240, 560], [300, 540], [360, 500]], 9, '#c8402e'); if (f > F_WRONG) pp.ell(380, 490, 34, 34, null, 8); }, p, 0.62, { order: 6 }));
    push(wordCard(f, F_WRONG, 'WRONG COUNTRY!', cam, '#e8503a', 1e9, 170, 0.5)); }
  if (S.id === 'village') push(wordCard(f, F_ARMY, 'NO ARMY', cam, '#e8503a', 1e9, 190, 0.38));
  if (S.id === 'sleep') { const t = q(((f - S.a) / 45) % 1, 2); out.push(FX('zz' + t, (p) => T.fxZ(p, t), [SL[0] + 0.5, ground(SL[0], SL[2]) + 2.3, SL[2] + 0.1], 0.9, { order: 6 })); }
  if (S.id === 'quote') { for (let i = 0; i < 3; i++) { const ph = (f + i * 13) % 37; if (ph < 4) out.push(FX('fl' + i + ph, (p) => { p.g.translate(50, 250); T.fxBurst(p, ph / 4, '#ffffff', 8, 30, 140); }, [POD[0] - 2 + i * 2, 2.2 + (i % 2) * 0.5, POD[2] + 3.0], 1.2)); }
  }
  if (S.id === 'loop') push(wordCard(f, F_HAPP, 'AGAIN?!', cam, '#f6c83a'));
  return out;
}

// ---------------- cameras ----------------
const C = (p, d) => [p[0] + d[0], p[1] + d[1], p[2] + d[2]];
const CAMS = {
  hook: [{ f: 0, pos: [10.5, 1.2, 4.6], look: [0.5, 1.6, -0.6], fov: 48 }, { f: F_ACC - 4, pos: [8.5, 1.3, 3.6], look: [1.5, 1.6, -0.6], fov: 44 }, { f: cut(1), pos: [7.5, 1.4, 3.0], look: [2, 1.6, -0.6], fov: 42 }],
  march: [{ f: cut(1), pos: [24, 7, 18], look: [2, 1, -2], fov: 40 }, { f: F_ALPS - 10, pos: [22, 6, 16], look: [0, 3, -4], fov: 44 }, { f: cut(2), pos: [21, 5.5, 15], look: [1, 1.6, -2], fov: 38 }],
  rain: [{ f: cut(2), pos: [0, 1.7, 7.5], look: [0, 1.4, 0], fov: 46 }, { f: F_BORDER - 4, pos: [0, 1.6, 6.0], look: [0, 1.5, 0], fov: 42 }],
  stone: [{ f: F_BORDER - 4, pos: [1.6, 0.9, 1.6], look: [0, 0.75, -1.75], fov: 46 }, { f: cut(3), pos: [2.4, 1.1, 2.8], look: [0, 0.9, -1.75], fov: 46 }],
  mile: [{ f: cut(3), pos: [17, 1.5, 5], look: [20, 1.3, 0], fov: 46 }, { f: F_LIE - 6, pos: [21, 1.7, 5], look: [24, 1.4, 0], fov: 46 }, { f: cut(4), pos: [24, 1.9, 5], look: [30, 1.5, -1.2], fov: 46 }],
  rifle: [{ f: cut(4), pos: [0.2, 1.75, 4.2], look: [0.3, 1.45, 0], fov: 44 }, { f: F_BULLET - 4, pos: [0.1, 1.85, 2.9], look: [0.1, 1.6, 0], fov: 40 }],
  map: [{ f: cut(5), pos: [0.3, 1.8, 4.6], look: [0.1, 1.4, 0], fov: 44 }, { f: F_MAP - 3, pos: [0.15, 1.6, 2.9], look: [0.05, 1.35, 0.6], fov: 40 }, { f: F_WRONG + 2, pos: [0.1, 1.7, 3.6], look: [0.05, 1.45, 0.3], fov: 46 }],
  back: [{ f: cut(6), pos: [27, 1.5, 4.8], look: [38, 1.3, -0.3], fov: 46 }, { f: F_TIP, pos: [28, 0.9, 4.0], look: [37, 1.0, -0.3], fov: 44 }, { f: cut(7), pos: [28, 0.9, 3.8], look: [36, 1.0, -0.3], fov: 44 }],
  village: [{ f: cut(7), pos: [64, 16, 6], look: [64, 28, -110], fov: 46 }, { f: F_LIE2 - 4, pos: [64, 15, -4], look: [64, 30, -110], fov: 42 }, { f: cut(8), pos: [64, 15, -10], look: [64, 31, -110], fov: 40 }],
  sleep: [{ f: cut(8), pos: [41.5, 1.5, 10.5], look: [47.5, 1.3, 4.0], fov: 46 }, { f: F_NOTICE, pos: [43, 1.4, 9.2], look: [47.6, 1.25, 4.2], fov: 42 }],
  quote: [{ f: cut(9), pos: [0.4, 2.0, 6.0], look: [0, 1.9, -0.6], fov: 44 }, { f: F_SHRUG, pos: [0.2, 2.1, 3.6], look: [0, 2.1, -0.6], fov: 42 }],
  loop: [{ f: F_HAPP - 6, pos: [10.8, 1.2, 4.8], look: [0.5, 1.6, -0.6], fov: 50 }, { f: TOTAL - 1, pos: [10.5, 1.2, 4.6], look: [0.5, 1.6, -0.6], fov: 48 }],
};
const KICKS = [{ f: F_ACC, a: 0.04 }, { f: F_WRONG, a: 0.05 }, { f: F_ARMY, a: 0.04 }, { f: F_BULLET, a: 0.03 }];
const camAt = (f) => {
  const S = shotAt(f); const c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS });
  if (S.id === 'quote') { c.pos = C(POD, c.pos); c.look = C(POD, c.look); }
  if (S.id === 'sleep') { const g = ground(SL[0], SL[2]); c.pos[1] += g; c.look[1] += g; }
  c.shadowAt = S.id === 'quote' ? POD : S.id === 'village' ? [70, 0, -40] : S.id === 'march' ? [4, 0, 0] : c.look;
  return c;
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => {
  const S = shotAt(f);
  if (S.id === 'rifle') return { focus: dist(Cm.pos, [0, 1.8, 0.2]), cinf: 10 };
  if (S.id === 'map') return { focus: dist(Cm.pos, [0, 1.8, 0.3]), cinf: 10 };
  if (S.id === 'sleep') return { focus: dist(Cm.pos, [SL[0], ground(SL[0], SL[2]) + 1.2, SL[2]]), cinf: 7 };
  if (S.id === 'quote') return { focus: dist(Cm.pos, C(POD, [0, 1.8, -0.6])), cinf: 9 };
  return { focus: 10, cinf: 0 };
};

export default {
  TOTAL, build,
  frame(f, k) {
    const S = shotAt(f), cam = camAt(f);
    const light = S.id === 'quote' ? { ...HALL } : { ...NIGHT };
    if (['rifle', 'map', 'stone', 'sleep'].includes(S.id)) light.shadowExt = 10;
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
  },
};
