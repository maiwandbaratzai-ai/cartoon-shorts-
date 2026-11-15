// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The Gimli Glider" — Air Canada Flight 143, 23 July 1983, Gimli, Manitoba. Timed via gimli_timing.js.
import { TOTAL, LINES, wf } from './gimli_timing.js';
import * as PR from '../props.js';
import { INK } from '../toon.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const W = (li, w) => wf(li, w);
const F_1983 = W(0, '1983'), F_FUEL0 = W(0, 'fuel'), F_41 = W(0, '41'), F_ENG = W(1, 'engines'), F_SIL = W(1, 'silent'), F_COCK = W(1, 'cockpit'), F_BLACK = W(1, 'black'),
  F_PROP = W(2, 'propeller'), F_POP = W(2, 'popped'), F_CTRL = W(2, 'controls'), F_69 = W(3, 'sixty'), F_PAPER = W(3, 'paper'), F_HOW = W(4, 'how'), F_FUELQ = W(4, 'fuel'),
  F_METRIC = W(5, 'metric'), F_LB = W(5, 'pounds'), F_KG = W(5, 'kilograms'), F_HALF = W(6, 'half'), F_CAPT = W(7, 'captain'), F_GLIDE = W(7, 'gliders'),
  F_COP = W(8, 'co'), F_GIMLI = W(8, 'gimli'), F_WORSE = W(9, 'worse'), F_DRAG = W(10, 'drag'), F_RACE = W(10, 'race'), F_CAMP = W(10, 'campers'),
  F_LOOK = W(11, 'looked'), F_SILJ = W(11, 'silent'), F_HIGH = W(12, 'high'), F_TRICK = W(12, 'trick'), F_SIDE = W(13, 'sideways'), F_GEAR = W(14, 'gear'),
  F_COLL = W(14, 'collapsed'), F_SPARK = W(14, 'sparks'), F_STOP = W(15, 'stop'), F_STUN = W(15, 'stunned'), F_NOBODY = W(16, 'nobody'), F_HURT = W(16, 'hurt'),
  F_25 = W(17, '25'), F_NAME = W(17, 'gimli'), F_FOLLOW = W(18, 'follow');
const SHOTS = [['hook', 0], ['engines', cut(1)], ['cockpit', F_COCK - 6], ['belly', cut(2)], ['glide', cut(3)], ['how', cut(4)], ['metric', cut(5)], ['half', cut(6)],
  ['captain', cut(7)], ['copilot', cut(8)], ['worse', cut(9)], ['strip', cut(10)], ['racers', cut(11)], ['high', cut(12)], ['side', cut(13)], ['land', cut(14)], ['stop', cut(15)],
  ['ok', cut(16)], ['years', cut(17)], ['follow', cut(18)]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const DAY = { az: 230, el: 38, sky: '#e4f0fa', ground: '#8a9a5a', hemi: 1.15, sun: '#fff2dc', sunI: 2.5, fog: '#d8e8f4', fogNear: 200, fogFar: 1600,
  skyTop: '#2f7fd8', skyHor: '#e2eef8', sat: 1.14, vig: 0.2, shadowExt: 40 };
const SKYL = { ...DAY, az: 160, el: 30, fog: '#c8dcf0', fogNear: 300, fogFar: 3000, skyTop: '#1e64c8', skyHor: '#d8e8f8' };
const COCKL = { ...DAY, az: 180, el: 10, sun: '#ffe8c8', sunI: 1.4, sky: '#c8d0e0', ground: '#3a3e4a', hemi: 1.4, fog: '#8a90a0', fogNear: 30, fogFar: 300, vig: 0.34 };
const SKY = [0, 420, 0], COCK = [3000, 0, 0], TARMAC = [0, 0, 700];
let K, jet, fans = [], rat, noseGear, cockScreens = [], cars = [], slideM;
const rnd = (() => { let s = 1983; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();

// ---------------- the jet (generic twin widebody, nose toward -z) ----------------
const makeJet = () => {
  const g = K.group(), wht = K.col('#f2f4f6'), grey = K.col('#b8bec6'), red = K.col('#c8302a'), dk = K.col('#3a3e46'), glass = K.col('#2a3a5a');
  const f = K.add(new K.THREE.CylinderGeometry(2.6, 2.6, 40, 24), wht, 0, 0, 0, g); f.rotation.x = Math.PI / 2;
  K.add(new K.THREE.SphereGeometry(2.6, 24, 16), wht, 0, 0, -20, g).scale.set(1, 0.95, 2.0);
  const tc = K.add(new K.THREE.CylinderGeometry(2.6, 0.6, 10, 24), wht, 0, 0.6, 25, g); tc.rotation.x = Math.PI / 2;
  K.slab(-2.62, 2.62, -1.2, -0.9, -22, 22, grey, g); // belly stripe
  for (let i = 0; i < 26; i++) for (const s of [-1, 1]) K.slab(s * 2.58 - 0.03, s * 2.58 + 0.03, 0.5, 0.95, -15 + i * 1.3, -14.5 + i * 1.3, glass, g);
  K.slab(-1.4, 1.4, 0.6, 1.2, -24.6, -23.4, glass, g).rotation.x = -0.6;
  for (const s of [-1, 1]) { const w = K.group(g); w.position.set(s * 2, -1.2, -1); w.rotation.y = s * 0.45;
    K.slab(s > 0 ? 0 : -24, s > 0 ? 24 : 0, -0.25, 0.25, -2.6, 2.6, wht, w);
    const e = K.group(g); e.position.set(s * 8.5, -2.6, -5); K.add(new K.THREE.CylinderGeometry(1.35, 1.2, 5, 18), grey, 0, 0, 0, e).rotation.x = Math.PI / 2;
    K.add(new K.THREE.CylinderGeometry(1.1, 1.1, 0.1, 18), dk, 0, 0, -2.52, e).rotation.x = Math.PI / 2;
    const fan = K.group(e); fan.position.z = -2.6; for (let b = 0; b < 6; b++) { const bl = K.slab(-0.1, 0.1, 0, 1.0, -0.05, 0.05, K.col('#d8dce2'), fan); bl.rotation.z = b * Math.PI / 3; } fans.push(fan);
    K.slab(-0.3, 0.3, 0.8, 1.6, -1.5, 1.5, wht, e);
    const hs = K.group(g); hs.position.set(s * 1, 0.8, 26); hs.rotation.y = s * 0.5; K.slab(s > 0 ? 0 : -9, s > 0 ? 9 : 0, -0.15, 0.15, -1.6, 1.6, wht, hs); }
  const fin = K.group(g); fin.position.set(0, 2, 26); fin.rotation.x = -0.5; K.slab(-0.2, 0.2, 0, 10, -2.5, 2.5, red, fin);
  for (const s of [-1, 1]) for (const z of [0.5, 2.5]) K.cyl(0.6, 0.6, 0.5, dk, s * 3.2, -4.6, z, g).rotation.z = Math.PI / 2;
  for (const s of [-1, 1]) K.slab(s * 3.2 - 0.15, s * 3.2 + 0.15, -4.4, -2.0, 1.4, 1.6, grey, g);
  noseGear = K.group(g); noseGear.position.set(0, -2.4, -17); K.slab(-0.12, 0.12, -2.2, 0, -0.12, 0.12, grey, noseGear); K.cyl(0.45, 0.45, 0.5, dk, 0, -2.4, 0, noseGear).rotation.z = Math.PI / 2;
  rat = K.group(g); rat.position.set(1.8, -2.0, -6); K.slab(-0.08, 0.08, -1.2, 0, -0.08, 0.08, grey, rat);
  const prop = K.group(rat); prop.position.y = -1.2; for (let b = 0; b < 2; b++) { const bl = K.slab(-0.06, 0.06, -0.55, 0.55, -0.03, 0.03, K.col('#e8c040'), prop); bl.rotation.x = b * Math.PI / 2; } rat.userData.prop = prop;
  return g;
};

function build(k) {
  K = k; const { THREE } = K, M4 = THREE.Matrix4;
  K.addClouds(16, 700, 240);
  K.add(new THREE.PlaneGeometry(4000, 4000).rotateX(-Math.PI / 2), K.toon({ map: PR.speckTex('#9ab062', ['#8aa456', '#a8bc70', '#7e9a4a', '#b0b878'], 83, 2600, 240) }), 0, 0, 0, K.scene, { cast: false });
  // runway (along z) + drag strip markings
  K.slab(-22, 22, 0, 0.04, -400, 600, K.toon({ map: PR.canvasTex(256, 512, (c, w, h) => { c.fillStyle = '#6e6c6a'; c.fillRect(0, 0, w, h); c.fillStyle = '#e8e4d8'; for (let y = 0; y < h; y += 64) c.fillRect(124, y, 8, 34); c.fillRect(6, 0, 5, h); c.fillRect(w - 11, 0, 5, h); }, [1, 8]) }), K.scene, false);
  K.slab(-30, -22, 0, 0.05, -160, 40, K.toon({ map: PR.canvasTex(256, 512, (c, w, h) => { c.fillStyle = '#5a5856'; c.fillRect(0, 0, w, h); c.fillStyle = '#f4f0e8'; c.fillRect(124, 0, 8, h); }, [1, 4]) }), K.scene, false);
  K.slab(-30, -22, 0.05, 0.07, -42, -40, K.col('#f4f0e8'), K.scene, false); // start line
  // guard rail along the drag strip
  for (let i = 0; i < 50; i++) K.slab(-30.3, -30.1, 0, 0.9, -160 + i * 4, -157 + i * 4, K.col('#c8ccd2'));
  // lake Winnipeg on the horizon + town
  K.add(new THREE.PlaneGeometry(3000, 1200).rotateX(-Math.PI / 2), K.toon({ color: '#4a8ab8' }), -1700, 0.02, -200, K.scene, { cast: false });
  for (let i = 0; i < 12; i++) K.slab(-2, 2, 0, 3 + (i % 3), -2, 2, K.col(['#e8e0d0', '#c86a5a', '#6a8ab0'][i % 3])).position.set(120 + (i % 4) * 9, (3 + (i % 3)) / 2, -300 + Math.floor(i / 4) * 12);
  // campers: tents, trailers, a crowd of spectator blobs
  for (let i = 0; i < 14; i++) { const x = -48 - (i % 3) * 7, z = -150 + i * 8; const t = K.add(new THREE.ConeGeometry(2, 2.4, 4), K.col(['#e8a040', '#4a8ad0', '#d04a4a', '#5aa050'][i % 4]), x, 1.2, z); t.rotation.y = Math.PI / 4; }
  for (let i = 0; i < 6; i++) { const tr = K.group(); tr.position.set(-62, 0, -130 + i * 20); K.slab(-1.3, 1.3, 0.4, 2.8, -3, 3, K.col('#f0ece0'), tr); K.slab(-1.32, 1.32, 1.4, 2.0, -3.02, 3.02, K.col(['#3a8ab8', '#c86a3a'][i % 2]), tr); }
  // race cars on the drag strip
  const cc = ['#d03a2a', '#2a6ad0', '#f0c030', '#2aa060', '#8a3ad0'];
  for (let i = 0; i < 5; i++) { const c = PR.sedan(K, cc[i]); c.root.rotation.y = Math.PI / 2; c.root.position.set(-26 + (i % 2) * 2.2, 0, -40 + i * 7); cars.push(c.root); }
  // the jet + escape slide
  jet = makeJet();
  slideM = K.group(); const sl = K.add(new THREE.BoxGeometry(2.2, 0.4, 9), K.col('#f2c230'), 0, 0, 0, slideM); sl.rotation.x = -0.45; sl.position.set(0, 2.2, 4.0);
  // fuel truck at the tarmac
  const tk = PR.oldTruck(K, '#e8e0d0'); tk.root.position.set(TARMAC[0] + 10, 0, TARMAC[2] + 2); tk.root.rotation.y = Math.PI / 2; K.cyl(1.0, 1.0, 3.6, K.col('#d8d4cc'), 0, 0, 0, tk.root).rotation.z = Math.PI / 2;
  // cockpit interior set
  const ck = K.group(); ck.position.set(...COCK); const pan = K.col('#6a6e7a'), pan2 = K.col('#5a5e6a');
  K.slab(-3, 3, -0.2, 0, -3, 4, K.col('#4a4c56'), ck); K.slab(-3, 3, 3.2, 3.4, -3, 4, pan2, ck); for (const s of [-1, 1]) K.slab(s * 3 - 0.2, s * 3, 0, 3.4, -3, 4, pan2, ck);
  K.slab(-3, 3, 0, 1.4, -2.6, -2.2, pan, ck); K.slab(-3, 3, 1.3, 1.5, -2.7, -1.6, pan, ck); K.slab(-0.4, 0.4, 0, 1.2, -2.2, -0.4, pan, ck); // glareshield, pedestal
  for (const [x, w] of [[-1.6, 1.2], [1.6, 1.2]]) K.slab(x - w / 2, x + w / 2, 1.6, 3.0, -3.0, -2.95, K.toon({ color: '#9ad0f0', emissive: '#6aa0d0' }), ck);
  for (let i = 0; i < 6; i++) { const x = -2.2 + i * 0.88; const sc = K.slab(x - 0.32, x + 0.32, 0.5, 1.2, -2.18, -2.14, K.toon({ color: '#1a3a2a', emissive: '#2aa060' }), ck); cockScreens.push(sc); }
  for (const s of [-1, 1]) { K.slab(s * 1.3 - 0.6, s * 1.3 + 0.6, 0, 0.6, 0.2, 1.2, K.col('#5a4a3a'), ck); }
}

// ---------------- 2D ----------------
const gauge = (p, v, label) => { p.ell(300, 500, 250, 250, '#2a2e36', 16); p.ell(300, 500, 215, 215, '#f4f0e0', 8);
  for (let i = 0; i <= 8; i++) { const a = Math.PI * (0.8 + i * 0.175); p.stroke([[300 + Math.cos(a) * 170, 500 + Math.sin(a) * 170], [300 + Math.cos(a) * 205, 500 + Math.sin(a) * 205]], 8, INK); }
  p.g.fillStyle = '#d03a2a'; p.g.font = 'bold 60px Poppins, sans-serif'; p.g.textAlign = 'center'; p.g.fillText('E', 300 + Math.cos(Math.PI * 0.8) * 130, 520 + Math.sin(Math.PI * 0.8) * 130); p.g.fillStyle = INK; p.g.fillText('F', 300 + Math.cos(Math.PI * 2.2) * 130, 520 + Math.sin(Math.PI * 2.2) * 130);
  p.g.font = 'bold 44px Poppins, sans-serif'; p.g.fillText(label, 300, 640);
  const a = Math.PI * (0.8 + v * 1.4); p.stroke([[300, 500], [300 + Math.cos(a) * 180, 500 + Math.sin(a) * 180]], 14, '#d03a2a'); p.ell(300, 500, 26, 26, INK, 0); };
const unitCard = (p, t) => { p.poly([[30, 230], [570, 230], [570, 780], [30, 780]], '#fff8e8', 12); p.g.textAlign = 'center'; p.g.fillStyle = INK;
  p.g.font = 'bold 46px Poppins, sans-serif'; p.g.fillText('LOADED', 300, 310); p.g.font = 'bold 80px Poppins, sans-serif'; p.g.fillStyle = '#d03a2a'; p.g.fillText('22,300 LB', 300, 400);
  if (t > 0) { p.g.globalAlpha = Math.min(1, t * 2); p.g.fillStyle = INK; p.g.font = 'bold 46px Poppins, sans-serif'; p.g.fillText('NEEDED', 300, 560); p.g.font = 'bold 80px Poppins, sans-serif'; p.g.fillStyle = '#1a7a3a'; p.g.fillText('22,300 KG', 300, 650); p.g.globalAlpha = 1; } };
const mapCard = (p, t) => { p.poly([[40, 200], [560, 200], [560, 820], [40, 820]], '#e8eed8', 12);
  p.poly([[60, 220], [260, 220], [300, 420], [220, 700], [60, 760]], '#7ab0d8', 0); p.g.fillStyle = '#2a4a6a'; p.g.font = 'bold 30px Poppins, sans-serif'; p.g.fillText('LAKE', 130, 480);
  p.ell(360, 470, 18, 18, '#d03a2a', 6); p.g.fillStyle = INK; p.g.font = 'bold 44px Poppins, sans-serif'; p.g.fillText('GIMLI', 380, 430);
  const x = lerp(520, 372, t), y = lerp(260, 462, t); p.stroke([[520, 260], [x, y]], 8, '#d03a2a'); p.g.save(); p.g.translate(x, y); p.g.rotate(Math.atan2(462 - 260, 372 - 520)); p.poly([[30, 0], [-20, -16], [-20, 16]], '#ffffff', 6); p.g.restore(); };
const glider = (p) => { p.stroke([[60, 500], [540, 470]], 26, INK); p.stroke([[60, 500], [540, 470]], 16, '#ffffff'); p.ell(300, 520, 140, 34, '#ffffff', 9); p.ell(360, 506, 40, 18, '#7ab0d8', 5); p.poly([[160, 520], [130, 440], [175, 515]], '#ffffff', 7); };
const spark = (p, t, T) => T.fxBurst(p, t, '#ffd84a', 12, 40, 260);

// ---------------- characters ----------------
const CAPT = { jacket: '#1f2a4a', pants: '#1f2a4a', boots: INK, hat: 'cap', cap: '#1f2a4a', buttons: '#e8c45a', moustache: '#6a4a30', skin: '#f5c9a0' };
const COP = { jacket: '#1f2a4a', pants: '#1f2a4a', boots: INK, hat: 'hair', hair: '#3a2a20', buttons: '#e8c45a', skin: '#f0c49a' };
const CREW = { jacket: '#e86a2a', pants: '#3a3e52', boots: INK, hat: 'cap', cap: '#e8e0d0', skin: '#f5c9a0' };
const RACER1 = { jacket: '#d03a2a', pants: '#2a2a3a', boots: INK, hat: 'cap', cap: '#ffffff', skin: '#f5c9a0' };
const RACER2 = { jacket: '#2a6ad0', pants: '#3a3a4a', boots: INK, hat: 'hair', hair: '#c89a50', skin: '#ffe0c0' };
const RACER3 = { jacket: '#f0c030', pants: '#4a4a5a', boots: INK, hat: 'cap', cap: '#2a2a3a', moustache: '#6a4a30', build: 'stout', skin: '#ecd0b6' };
const PASS = { jacket: '#7a5ac9', pants: '#3b3f52', boots: INK, hat: 'hair', hair: '#6a4a30', skin: '#f5c9a0' };
const LIGHT2D = -2.1;
const fo = (f, seed, o) => ({ mode: 'stand', light: LIGHT2D, seed, blink: blinkAt(f, seed), ...o });
const card = (T, key, o, opts, pos, extra = {}) => ({ key: key + JSON.stringify(opts), draw: (p) => T.bodyFront(p, o, opts), x: pos[0], y: pos[1], z: pos[2], ...extra });
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1] - 1.07 * s, z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
const inFront = (c, d, ux, uy) => {
  const V = K.THREE.Vector3, p = new V(...c.pos), dir = new V(...c.look).sub(p).normalize(), right = new V().crossVectors(dir, new V(0, 1, 0)).normalize(), up = new V().crossVectors(right, dir);
  const h = d * Math.tan(c.fov * Math.PI / 360); return p.addScaledVector(dir, d).addScaledVector(right, ux * h).addScaledVector(up, uy * h).toArray();
};
const wordCard = (f, f0, txt, c, col = '#f6c83a', dur = 1e9, size = 170, uy = 0.42, d = 1.4) => { if (f < f0 - 1 || f > f0 + dur) return null; const t = q(Math.min(1, (f - f0 + 1) / 12));
  const r = Math.min(1, 400 / (0.7 * size * txt.length)), fs = size * r, s = Math.min(2.5, 1.25 / r);
  return FX('w' + txt + t + fs, (p) => PR.word(p, txt, t, col, fs), inFront(c, d, 0, uy), s * d / 7, { order: 9 }); };

// ---------------- jet path ----------------
// landing keys: [f, z, y, yaw, roll, pitch]
const LK = [[cut(11), 900, 160, 0, 0, 0.05], [cut(12), 520, 90, 0, 0, 0.06], [cut(13), 300, 55, 0, 0, 0.08], [F_SIDE + 8, 170, 28, 0.45, 0.32, 0.1], [cut(14), 90, 8, 0.1, 0.05, 0.12],
  [F_GEAR, 40, 4.8, 0, 0, 0.1], [F_COLL + 4, 10, 4.6, 0, 0, -0.09], [cut(15), -15, 4.6, 0, 0, -0.09], [F_STOP + 6, -38, 4.6, 0, 0, -0.09], [TOTAL, -38, 4.6, 0, 0, -0.09]];
const landAt = (f) => { const i = Math.max(0, LK.findIndex((k, j) => j + 1 < LK.length && f >= k[0] && f < LK[j + 1][0])), a = LK[i], b = LK[i + 1] || a;
  const t = b[0] > a[0] ? M.smooth((f - a[0]) / (b[0] - a[0])) : 0; return a.map((v, k) => k ? lerp(v, b[k], t) : f); };
const HOOKJ = [0, 26, 140, 0, 0, 0.08];

function actorsAt(f, T) {
  const S = shotAt(f), id = S.id, out = [];
  const racers = (e, look = 0.6, z0 = -52, dx = 0) => [[RACER1, -36, 3], [RACER2, -34.4, 4], [RACER3, -32.8, 5]].forEach(([o, x, sd]) => out.push(card(T, 'r' + sd, o, fo(f, sd, { expr: e, look, tilt: q(idle(f, sd).tilt, 1), headTilt: q(idle(f, sd).headTilt, 1) }), [x + dx, 0, z0 + sd * 0.3])));
  switch (id) {
    case 'hook': case 'follow': racers('shock', 0.2, -54); break;
    case 'cockpit': case 'how': case 'half': out.push(card(T, 'cp', CAPT, fo(f, 7, { mode: 'sit', expr: id === 'cockpit' ? 'shock' : id === 'half' ? 'pained' : 'nervous', look: -0.3 }), [COCK[0] - 0.75, 0.25, COCK[2] + 0.6]));
      out.push(card(T, 'co', COP, fo(f, 9, { mode: 'sit', expr: id === 'cockpit' ? 'shock' : 'nervous', look: 0.3 }), [COCK[0] + 0.75, 0.25, COCK[2] + 0.6])); break;
    case 'captain': out.push(card(T, 'cp', CAPT, fo(f, 7, { mode: 'sit', expr: f > F_GLIDE ? 'grin' : 'stern', look: 0.2, tilt: q(idle(f, 7).tilt, 1) }), [COCK[0] - 0.75, 0.25, COCK[2] + 0.6])); break;
    case 'copilot': out.push(card(T, 'co', COP, fo(f, 9, { mode: 'sit', expr: f > F_GIMLI ? 'grin' : 'neutral', look: -0.3, tilt: q(idle(f, 9).tilt, 1), wave: f > F_COP + 10 ? 1 : undefined }), [COCK[0] + 0.75, 0.25, COCK[2] + 0.6])); break;
    case 'metric': out.push(card(T, 'cw', CREW, fo(f, 13, { expr: f > F_KG ? 'nervous' : 'whistle', look: 0.3, tilt: q(idle(f, 13).tilt, 1), headTilt: q(idle(f, 13).headTilt, 1) }), [TARMAC[0] + 2.5, 0, TARMAC[2] + 9])); break;
    case 'strip': racers(f > F_RACE ? 'grin' : 'smile', 0.6); break;
    case 'racers': racers(f > F_SILJ ? 'shock' : 'neutral', f > F_LOOK ? 0.0 : 0.6); break;
    case 'stop': racers(f > F_STUN - 4 ? 'shock' : 'nervous', 0.0, -78, 31); break;
    case 'ok': for (let i = 0; i < 4; i++) { const t = ((f - cut(16)) / 26 + i * 0.25) % 1; out.push(card(T, 'ps' + i, { ...PASS, jacket: ['#7a5ac9', '#4a9a6a', '#c86a3a', '#3a7ab0'][i] }, fo(f, 30 + i, { expr: t < 0.8 ? 'shock' : 'relief', look: 0 }), [-4.4, lerp(4.5, 0.2, t), lerp(-15, -8, t)], { s: 0.9 })); }
      racers('relief', -0.3, -26); break;
  }
  return out;
}

function fxAt(f, T, cam) {
  const S = shotAt(f), id = S.id, out = [], push = (x) => x && out.push(x);
  if (id === 'hook') { push(wordCard(f, F_1983, '1983', cam, '#f6c83a', F_FUEL0 - F_1983 - 3)); push(wordCard(f, F_FUEL0, 'OUT OF FUEL', cam, '#ff7a4a', F_41 - F_FUEL0 - 2)); push(wordCard(f, F_41, '41,000 FT', cam, '#ffffff')); }
  if (id === 'engines') { push(wordCard(f, F_SIL, 'SILENT', cam, '#ffffff', 1e9, 190)); for (const s of [-1, 1]) { const t = q(((f - F_ENG) / 30) % 1, 2); if (f > F_ENG) out.push(FX('pf' + s + t, (p) => { p.g.translate(-150, 0); p.g.scale(2, 2); T.fxPuff(p, t); }, [SKY[0] + s * 8.5, SKY[1] - 1.4, SKY[2] + 1 + t * 6], 2.2, { order: 4 })); } }
  if (id === 'cockpit') push(wordCard(f, F_BLACK, 'BLACK!', cam, '#ff5a3a', 1e9, 200, 0.5, 1.4));
  if (id === 'belly') { push(wordCard(f, F_POP, 'POP!', cam, '#f6c83a', F_CTRL - F_POP - 4, 200, 0.45, 2)); push(wordCard(f, F_CTRL, 'EMERGENCY PROPELLER', cam, '#ffffff', 1e9, 150, 0.45, 2)); }
  if (id === 'glide') { push(wordCard(f, F_69, '69 PEOPLE', cam, '#ffffff', F_PAPER - F_69 - 3, 190, 0.45, 3)); push(wordCard(f, F_PAPER, 'GIANT PAPER PLANE', cam, '#f6c83a', 1e9, 150, 0.45, 3)); }
  if (id === 'how') { out.push(FX('g0', (p) => gauge(p, 0, 'FUEL'), inFront(cam, 1.3, 0, -0.2), 0.32, { order: 7 })); push(wordCard(f, F_HOW, 'HOW?!', cam, '#ff5a3a', 1e9, 210, 0.5, 1.3)); }
  if (id === 'metric') { const t = q(ramp(f, F_KG - 4, F_KG + 8), 2); out.push(FX('uc' + t, (p) => unitCard(p, t), inFront(cam, 1.6, 0.26, -0.12), 0.3, { order: 7 })); push(wordCard(f, F_METRIC, 'METRIC', cam, '#f6c83a', F_LB - F_METRIC - 4, 190, 0.6, 1.6)); }
  if (id === 'half') { const v = q(lerp(1, 0.45, M.smooth(ramp(f, cut(6), F_HALF + 6))), 2); out.push(FX('g' + v, (p) => gauge(p, v, 'NEEDED'), inFront(cam, 1.3, 0, -0.18), 0.32, { order: 7 }));
    push(wordCard(f, F_HALF, 'LESS THAN HALF', cam, '#ff5a3a', 1e9, 170, 0.55, 1.3)); }
  if (id === 'captain') { if (f > F_GLIDE - 4) out.push(FX('gl', glider, inFront(cam, 1.5, 0.1, 0.25), 0.3, { order: 7, roll: 0.1 * Math.sin(f * 0.1) })); push(wordCard(f, F_GLIDE, 'GLIDER PILOT', cam, '#f6c83a', 1e9, 180, 0.62, 1.5)); }
  if (id === 'copilot') { const t = q(ramp(f, F_COP, F_GIMLI), 2); out.push(FX('mp' + t, (p) => mapCard(p, t), inFront(cam, 1.5, 0, -0.08), 0.38, { order: 7 })); push(wordCard(f, F_GIMLI, 'GIMLI!', cam, '#f6c83a', 1e9, 200, 0.62, 1.5)); }
  if (id === 'worse') push(wordCard(f, F_WORSE + 6, 'NOT AN AIR BASE', cam, '#ff7a4a', 1e9, 160, 0.45, 3));
  if (id === 'strip') { push(wordCard(f, F_DRAG, 'DRAG STRIP', cam, '#f6c83a', F_RACE - F_DRAG - 2, 180, 0.45, 3)); push(wordCard(f, F_RACE, 'CAR RACE', cam, '#ffffff', F_CAMP - F_RACE - 2, 180, 0.45, 3)); push(wordCard(f, F_CAMP, '+ CAMPERS', cam, '#ffffff', 1e9, 180, 0.45, 3)); }
  if (id === 'racers') push(wordCard(f, F_SILJ, 'SILENT JET', cam, '#ffffff', 1e9, 180, 0.5, 3));
  if (id === 'high') { push(wordCard(f, F_HIGH, 'TOO HIGH', cam, '#ff7a4a', F_TRICK - F_HIGH - 2, 190, 0.5, 4)); push(wordCard(f, F_TRICK, 'GLIDER TRICK', cam, '#f6c83a', 1e9, 180, 0.5, 4)); }
  if (id === 'side') push(wordCard(f, F_SIDE, 'SIDEWAYS!', cam, '#f6c83a', 1e9, 200, 0.5, 4));
  if (id === 'land' || id === 'stop') { const J = landAt(f); if (f > F_COLL && f < F_STOP + 10) for (let i = 0; i < 3; i++) { const t = q(((f - F_COLL) / 12 + i / 3) % 1, 2); out.push(FX('sp' + i + t, (p) => spark(p, t, T), [(i - 1) * 1.2, 0.3, J[1] - 20 + i * 1.5], 3, { order: 6 })); }
    if (id === 'land') push(wordCard(f, F_SPARK, 'SPARKS!', cam, '#ffd84a', 1e9, 200, 0.5, 4)); else push(wordCard(f, F_STOP, 'STOPPED!', cam, '#ffffff', 1e9, 200, 0.5, 4)); }
  if (id === 'ok') push(wordCard(f, F_NOBODY, 'NOBODY SERIOUSLY HURT', cam, '#9ad04a', 1e9, 150, 0.5, 4));
  if (id === 'years') { push(wordCard(f, F_25, '25 MORE YEARS', cam, '#ffffff', F_NAME - F_25 - 4, 170, 0.45, 3)); push(wordCard(f, F_NAME, 'THE GIMLI GLIDER', cam, '#f6c83a', 1e9, 160, 0.45, 3)); }
  if (id === 'follow') push(wordCard(f, F_FOLLOW, 'NEW TRUE STORY DAILY', cam, '#ffffff', 1e9, 150, 0.45, 4));
  return out;
}

// ---------------- cameras ----------------
const S0 = SKY, C0 = COCK, T0 = TARMAC;
const CAMS = {
  hook: [{ f: 0, pos: [-38, 1.7, -66], look: [-6, 22, 120], fov: 52 }, { f: F_41, pos: [-37, 1.7, -64], look: [-6, 18, 80], fov: 50 }, { f: cut(1), pos: [-36.5, 1.7, -63], look: [-6, 16, 60], fov: 49 }],
  engines: [{ f: cut(1), pos: [S0[0] + 22, S0[1] + 3, S0[2] - 30], look: [S0[0] + 4, S0[1] - 1, S0[2] - 2], fov: 46 }, { f: F_COCK - 6, pos: [S0[0] + 16, S0[1] - 1, S0[2] - 18], look: [S0[0] + 8, S0[1] - 2.4, S0[2] - 4], fov: 40 }],
  cockpit: [{ f: F_COCK - 6, pos: [C0[0], 2.0, 4.6], look: [C0[0], 1.2, -2], fov: 52 }, { f: cut(2), pos: [C0[0], 1.8, 3.6], look: [C0[0], 1.0, -2], fov: 50 }],
  belly: [{ f: cut(2), pos: [S0[0] + 9, S0[1] - 6, S0[2] - 2], look: [S0[0] + 1.8, S0[1] - 3, S0[2] - 6], fov: 46 }, { f: F_POP, pos: [S0[0] + 7, S0[1] - 5, S0[2] - 4], look: [S0[0] + 1.8, S0[1] - 3.2, S0[2] - 6], fov: 40 }, { f: cut(3), pos: [S0[0] + 6.5, S0[1] - 4.8, S0[2] - 4.5], look: [S0[0] + 1.8, S0[1] - 3.2, S0[2] - 6], fov: 38 }],
  glide: [{ f: cut(3), pos: [S0[0] - 60, S0[1] + 10, S0[2] - 50], look: [S0[0], S0[1], S0[2]], fov: 46 }, { f: cut(4), pos: [S0[0] - 70, S0[1] + 4, S0[2] + 10], look: [S0[0], S0[1], S0[2]], fov: 44 }],
  how: [{ f: cut(4), pos: [C0[0], 1.8, 3.4], look: [C0[0], 1.1, -2], fov: 50 }, { f: cut(5), pos: [C0[0], 1.7, 3.0], look: [C0[0], 1.0, -2], fov: 48 }],
  metric: [{ f: cut(5), pos: [T0[0] + 3, 1.7, T0[2] + 14.5], look: [T0[0] + 3, 1.6, T0[2] + 9], fov: 44 }, { f: F_KG, pos: [T0[0] + 3.1, 1.65, T0[2] + 13.5], look: [T0[0] + 3.1, 1.5, T0[2] + 9], fov: 42 }, { f: cut(6), pos: [T0[0] + 3.1, 1.65, T0[2] + 13.2], look: [T0[0] + 3.1, 1.5, T0[2] + 9], fov: 41 }],
  half: [{ f: cut(6), pos: [C0[0], 1.7, 3.2], look: [C0[0], 1.0, -2], fov: 48 }, { f: cut(7), pos: [C0[0], 1.65, 2.9], look: [C0[0], 1.0, -2], fov: 46 }],
  captain: [{ f: cut(7), pos: [C0[0] - 0.75, 1.5, 4.0], look: [C0[0] - 0.75, 1.25, 0.6], fov: 44 }, { f: cut(8), pos: [C0[0] - 0.75, 1.5, 3.6], look: [C0[0] - 0.75, 1.25, 0.6], fov: 42 }],
  copilot: [{ f: cut(8), pos: [C0[0] + 0.75, 1.5, 4.0], look: [C0[0] + 0.75, 1.25, 0.6], fov: 44 }, { f: cut(9), pos: [C0[0] + 0.75, 1.5, 3.6], look: [C0[0] + 0.75, 1.25, 0.6], fov: 42 }],
  worse: [{ f: cut(9), pos: [60, 90, 120], look: [-20, 0, -40], fov: 50 }, { f: cut(10), pos: [40, 60, 70], look: [-24, 0, -50], fov: 50 }],
  strip: [{ f: cut(10), pos: [-16, 3, 16], look: [-28, 1.0, -30], fov: 48 }, { f: F_CAMP, pos: [-18, 4, 4], look: [-42, 1.0, -48], fov: 50 }, { f: cut(11), pos: [-18.5, 4.2, 2], look: [-44, 1.0, -50], fov: 50 }],
  racers: [{ f: cut(11), pos: [-34.2, 1.6, -45.5], look: [-34.4, 1.5, -51], fov: 46 }, { f: F_LOOK, pos: [-34.2, 1.6, -45.5], look: [-34.4, 1.5, -51], fov: 46 }, { f: F_SILJ, pos: [-35, 1.2, -58], look: [-10, 30, 300], fov: 46, ease: 'easeOut' }, { f: cut(12), pos: [-35, 1.2, -58], look: [-5, 40, 400], fov: 44 }],
  high: [{ f: cut(12), pos: [30, 20, 160], look: [0, 60, 380], fov: 50 }, { f: cut(13), pos: [26, 18, 120], look: [0, 50, 300], fov: 50 }],
  side: [{ f: cut(13), pos: [40, 8, 120], look: [0, 40, 260], fov: 50 }, { f: cut(14), pos: [30, 4, 40], look: [0, 12, 110], fov: 52 }],
  land: [{ f: cut(14), pos: [26, 3, -30], look: [0, 6, 70], fov: 50 }, { f: F_COLL, pos: [22, 2.5, -40], look: [0, 4, 20], fov: 48 }, { f: cut(15), pos: [20, 2.5, -50], look: [0, 4, -5], fov: 48 }],
  stop: [{ f: cut(15), pos: [-3.5, 2.2, -96], look: [-2, 4, -50], fov: 50 }, { f: F_STUN, pos: [-3.5, 2.0, -93], look: [-2.5, 3, -60], fov: 48 }, { f: cut(16), pos: [-3.5, 2.0, -92], look: [-2.5, 3, -60], fov: 47 }],
  ok: [{ f: cut(16), pos: [-14, 3, -24], look: [-3, 2.5, -10], fov: 52 }, { f: cut(17), pos: [-13, 3, -25], look: [-3, 2.5, -10], fov: 50 }],
  years: [{ f: cut(17), pos: [S0[0] + 40, S0[1] + 6, S0[2] - 60], look: [S0[0], S0[1], S0[2]], fov: 46 }, { f: cut(18), pos: [S0[0] + 55, S0[1] + 2, S0[2] - 20], look: [S0[0], S0[1], S0[2]], fov: 44 }],
  follow: [{ f: cut(18), pos: [-36, 1.7, -62], look: [-6, 14, 40], fov: 48 }, { f: TOTAL - 1, pos: [-38, 1.7, -66], look: [-6, 22, 120], fov: 52 }],
};
const KICKS = [{ f: F_SIL, a: 0.03 }, { f: F_BLACK, a: 0.04 }, { f: F_POP, a: 0.03 }, { f: F_HALF, a: 0.03 }, { f: F_WORSE, a: 0.03 }, { f: F_SIDE, a: 0.03 }, { f: F_COLL, a: 0.06 }, { f: F_STOP, a: 0.04 }, { f: F_NAME, a: 0.03 }];
const camAt = (f) => { const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS });
  c.shadowAt = ['cockpit', 'how', 'half', 'captain', 'copilot'].includes(S.id) ? COCK : ['engines', 'belly', 'glide', 'years'].includes(S.id) ? SKY : S.id === 'metric' ? TARMAC : [c.look[0], 0, c.look[2]];
  return c; };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => { const id = shotAt(f).id;
  
  if (id === 'metric') return { focus: dist(Cm.pos, [T0[0] + 3, 1.5, T0[2] + 9]), cinf: 8 };
  if (id === 'racers' && f < F_SILJ) return { focus: 5.5, cinf: 10 };
  return { focus: 10, cinf: 0 }; };

export default {
  TOTAL, build,
  frame(f, k) {
    const S = shotAt(f), cam = camAt(f), id = S.id;
    // where is the jet?
    let J = null;
    if (['engines', 'belly', 'glide', 'years'].includes(id)) J = [f, S0[2], S0[1], 0, id === 'glide' ? 0.06 * Math.sin(f * 0.03) : 0, 0.02];
    else if (['hook', 'follow'].includes(id)) J = id === 'hook' ? [f, 120 - (f / 30) * 20, 22 - f * 0.03, 0, 0.04, 0.08] : [f, 140 - ((f - cut(18)) / 30) * 20, 26 - (f - cut(18)) * 0.03, 0, 0.04, 0.08];
    else if (['racers', 'high', 'side', 'land', 'stop', 'ok'].includes(id)) J = landAt(f);
    else if (id === 'metric') J = [f, T0[2] - 18, 4.6, 0, 0, 0];
    jet.visible = !!J;
    if (J) { const sky = ['engines', 'belly', 'glide', 'years'].includes(id); jet.position.set(sky ? S0[0] : id === 'metric' ? T0[0] - 6 : 0, J[2], J[1]); jet.rotation.set(J[5], J[3], J[4], 'YXZ');
      if (id === 'stop' || id === 'ok') jet.rotation.x = -0.09; }
    const enginesOn = id === 'years' || id === 'metric' || (id === 'engines' && f < F_ENG + 6);
    fans.forEach((fn) => { fn.rotation.z = enginesOn ? f * 1.3 : (id === 'engines' ? Math.min(f, F_ENG + 30) * 0.4 : 0.3); });
    const ratOut = ['belly', 'glide', 'racers', 'high', 'side', 'land', 'stop', 'ok', 'hook', 'follow'].includes(id) && !(id === 'belly' && f < F_POP - 2);
    rat.visible = ratOut; rat.scale.setScalar(id === 'belly' ? M.back(ramp(f, F_POP - 2, F_POP + 8)) : 1); rat.userData.prop.rotation.y = f * 0.9;
    noseGear.visible = ['land', 'stop', 'ok', 'metric'].includes(id) ? (id === 'land' ? f < F_COLL : id === 'metric') : ['side', 'high'].includes(id);
    cockScreens.forEach((sc, i) => { const on = id === 'cockpit' ? f < F_BLACK - 4 + i * 2 : !['how', 'half', 'captain', 'copilot'].includes(id); sc.material.emissive.set(on ? '#2aa060' : '#050808'); sc.material.color.set(on ? '#1a3a2a' : '#0a0c10'); });
    // race cars launch in the strip shot
    cars.forEach((c, i) => { c.position.z = -40 + i * 7 - (id === 'strip' ? Math.max(0, f - F_RACE) ** 2 * 0.02 * (i < 2 ? 1 : 0) : 0); });
    slideM.visible = id === 'ok'; slideM.position.set(-3.2, 0, -16); slideM.rotation.y = 0;
    const light = ['cockpit', 'how', 'half', 'captain', 'copilot'].includes(id) ? { ...COCKL } : ['engines', 'belly', 'glide', 'years'].includes(id) ? { ...SKYL } : { ...DAY };
    if (['worse', 'high', 'side', 'land'].includes(id)) light.shadowExt = 80;
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
  },
};
