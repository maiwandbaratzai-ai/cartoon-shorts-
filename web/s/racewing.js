// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Race Car Wings Are Upside Down" — invented story, engine: The Upgrade (SCRIPTS.md §000).
// Pit chief Vinnie ("Wings go UP!") flips Speedy Beans' rear wing like a plane's. Lap one: the car goes light like a shopping
// cart on ice. Henrietta the team hen (wants to fly since she was an egg) is thrilled. Upgrade: a second wing. Lap two: the front
// wheels lift, Dot the driver steers at clouds; the whole car takes off over forty rows of fans and a hot-dog stand and lands in
// the hay bales like a dart in a cushion. Explainer: a plane wing pulls up; the same wing upside down pushes the car down -> grip.
// Vinnie flips it back (the car hugs the track like the pit cat on the heater). Henrietta gets the spare wing and reaches the hot-dog stand.
import { TOTAL, LINES, wf } from './racewing_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const CX = -26, R0 = 22, R1 = 30, RM = 26;            // track ring centre (x) and radii; takeoff point (0,0,0) heading +z
const PIT = [-26, -32.2];                              // parked spot on the pit lane (car heads +x)
const HAY = [0, 39], DOG = [5.5, 33.5], EXP = [-26, 0]; // hay bales, hot-dog stand, explainer stage (infield)
let THREE, F = {}, CAR, RW, FW2, WHEELS = [], DOT, VIN, HEN, CAT, VENDOR, FANS = [], SPARE, HENWING, FOIL, FOILP, TRC = [], HCAR, ARR = [], WRENCH;

function airfoil(K, span, chord, thick, mat) {      // plane orientation: flat bottom, curved top, leading edge at +z
  const s = new THREE.Shape(); const N = 24; s.moveTo(chord, 0);
  for (let i = 0; i <= N; i++) { const u = i / N, x = chord * (1 - u); const y = thick * (u < 0.3 ? Math.sin(u / 0.3 * Math.PI / 2) : Math.cos((u - 0.3) / 0.7 * Math.PI / 2) ** 1.4); s.lineTo(x, y * (0.15 + 0.85 * Math.sqrt(Math.sin(Math.PI * Math.min(1, u * 1.02 + 0.02))))); }
  s.lineTo(chord, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: span, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2, curveSegments: 12 });
  g.rotateY(-Math.PI / 2); g.translate(span / 2, -thick * 0.35, -chord / 2);
  const m = new THREE.Mesh(g, mat); m.castShadow = true; return m; }

function raceCar(K) {
  const g = new THREE.Group(); K.scene.add(g); const body = new THREE.Group(); g.add(body);
  const OR = K.paint('#f2701e', { rough: 0.22 }), WH = K.paint('#f4f2ee', { rough: 0.25 }), BK = K.paint('#1a1a1e', { rough: 0.5 }), CH = K.chrome(), GO = K.gold();
  K.rbox(0.9, 0.42, 2.4, 0.16, OR, 0, 0.42, -0.1, body);                                     // tub
  const nose = K.cyl(0.08, 0.34, 1.5, OR, 0, 0.36 - 0.75, 1.75, body, 20); nose.rotation.x = Math.PI / 2; nose.scale.set(1.3, 1, 0.75);
  for (const sx of [-1, 1]) { K.rbox(0.42, 0.34, 1.3, 0.12, OR, sx * 0.62, 0.36, -0.35, body); K.rbox(0.44, 0.06, 1.32, 0.03, WH, sx * 0.62, 0.55, -0.35, body); K.rbox(0.3, 0.2, 0.05, 0.04, BK, sx * 0.62, 0.38, 0.32, body); }
  K.rbox(0.5, 0.45, 1.1, 0.18, OR, 0, 0.78, -0.75, body); K.rbox(0.18, 0.2, 0.3, 0.06, BK, 0, 1.0, -0.2, body);   // engine cover + airbox
  K.rbox(0.94, 0.04, 2.0, 0.02, WH, 0, 0.64, 0.3, body);                                     // racing stripe
  const num = new THREE.Mesh(new THREE.CircleGeometry(0.2, 24), K.set.textMat('7', { bg: '#f4f2ee', fg: '#1a1a1e', w: 128, h: 128, border: false })); for (const sx of [-1, 1]) { const n = num.clone(); n.position.set(sx * 0.84, 0.42, -0.4); n.rotation.y = sx * Math.PI / 2; body.add(n); }
  const lab = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.2), K.set.textMat('SPEEDY BEANS', { bg: '#f2701e', fg: '#ffffff', w: 512, h: 110, border: false })); lab.rotation.x = -Math.PI / 2; lab.position.set(0, 0.645, 1.0); body.add(lab);
  K.rbox(0.62, 0.05, 0.6, 0.02, K.glass({ color: '#bfe4ff', opacity: 0.45 }), 0, 0.72, 0.45, body).rotation.x = -0.5;   // windscreen
  K.rbox(1.9, 0.05, 0.4, 0.02, OR, 0, 0.14, 2.35, body); for (const sx of [-1, 1]) K.rbox(0.04, 0.24, 0.48, 0.02, WH, sx * 0.95, 0.22, 2.35, body);   // front wing (low, fixed)
  // rear wing (the hero): endplates, struts, gold trim; RW rotates about the forward axis to flip
  RW = new THREE.Group(); RW.position.set(0, 1.45, -1.45); body.add(RW);
  RW.add(airfoil(K, 1.6, 0.6, 0.16, K.paint('#1a1a1e', { rough: 0.25 }))); const tr = airfoil(K, 1.62, 0.1, 0.03, GO); tr.position.z = -0.26; RW.add(tr);
  for (const sx of [-1, 1]) { K.rbox(0.04, 0.6, 0.78, 0.03, OR, sx * 0.82, 0, 0, RW); const pl = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.22), K.set.textMat('UP!', { bg: '#f2701e', fg: '#ffffff', w: 256, h: 96, border: false })); pl.position.set(sx * 0.845, 0.05, 0); pl.rotation.y = sx * Math.PI / 2; RW.add(pl); }
  for (const sx of [-0.3, 0.3]) K.rbox(0.05, 0.55, 0.12, 0.02, CH, sx, 1.15, -1.45, body);
  // the second wing Vinnie bolts on (over the nose)
  FW2 = new THREE.Group(); FW2.position.set(0, 1.25, 1.2); body.add(FW2); FW2.add(airfoil(K, 1.9, 0.62, 0.17, K.paint('#2a62c8', { rough: 0.25 })));
  for (const sx of [-0.35, 0.35]) K.rbox(0.05, 0.75, 0.1, 0.02, CH, sx, -0.42, 0, FW2); for (const sx of [-1, 1]) K.rbox(0.04, 0.4, 0.7, 0.02, WH, sx * 0.96, 0, 0, FW2);
  // wheels: fat slicks with gold rims and lug nuts
  for (const [sx, z, r] of [[-1, 1.45, 0.36], [1, 1.45, 0.36], [-1, -1.25, 0.44], [1, -1.25, 0.44]]) { const w = new THREE.Group(); w.position.set(sx * 0.98, r, z); g.add(w);
    const t = K.cyl(r, r, 0.42, K.paint('#1c1c20', { rough: 0.7 }), 0, -0.21, 0, w, 28); t.rotation.z = Math.PI / 2;
    const rim = K.cyl(r * 0.6, r * 0.6, 0.44, GO, 0, -0.22, 0, w, 20); rim.rotation.z = Math.PI / 2;
    for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; K.sphere(0.03, CH, sx * 0.225, Math.cos(a) * r * 0.3, Math.sin(a) * r * 0.3, w); }
    const st = K.rbox(0.03, r * 1.1, 0.06, 0.01, K.paint('#f4f2ee'), sx * 0.22, 0, 0, w); w.userData.r = r; WHEELS.push(w); }
  for (const z of [1.45, -1.25]) { const a = K.cyl(0.03, 0.03, 1.9, CH, 0, (z > 0 ? 0.36 : 0.44) - 0.95, z, g, 8); a.rotation.z = Math.PI / 2; }
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g; }

function carAt(f) {   // { x, y, z, yaw, pitch, roll, spin }
  const ring = (th, r = RM) => [CX + r * Math.cos(th), r * Math.sin(th)];
  const onRing = (th, r, extra = 0) => { const p = ring(th, r); return { x: p[0], y: 0, z: p[1], yaw: Math.atan2(-Math.sin(th), Math.cos(th)) + extra, pitch: 0, roll: 0 }; };
  if (f < 112) { const g = 688 + f * 0.4; return carAt(g); }                               // hook = flash-forward of the flight
  if (f >= 112 && f < 236) return { x: PIT[0], y: 0, z: PIT[1], yaw: Math.PI / 2, pitch: 0, roll: 0 };
  if (f >= 236 && f < 442) { const th = -Math.PI / 2 + (f - 236) * 0.021; const wob = sm(240, 290, f) * (0.55 * Math.sin((f - 236) * 0.13) + 0.2 * Math.sin((f - 236) * 0.31));
    const r = RM + 2.2 * Math.sin((f - 236) * 0.07) * sm(240, 290, f); const c = onRing(th, r, wob); c.roll = -0.06 * Math.sin((f - 236) * 0.13); return c; }
  if (f >= 442 && f < 524) return { x: PIT[0], y: 0, z: PIT[1], yaw: Math.PI / 2, pitch: 0, roll: 0 };
  if (f < 650) { const th = -Math.PI + (f - 524) / 126 * Math.PI; const c = onRing(th, RM); c.pitch = -0.2 * sm(F.LIFTED - 6, F.LIFTED + 8, f) - 0.05 * Math.sin(f * 0.3) * sm(F.LIFTED, F.LIFTED + 10, f);
    c.y = 0.3 * sm(F.LIFTED - 6, F.LIFTED + 8, f) + 0.6 * sm(F.CLOUDS - 10, 650, f); return c; }
  if (f < 760) { const u = clamp((f - 650) / (752 - 650), 0, 1); const z = HAY[1] * (u * 0.9 + 0.1 * u * u); const y = 0.9 + 11 * Math.sin(Math.PI * Math.min(1, u * 1.12)) * (u < 0.89 ? 1 : 1) - (u > 0.89 ? 0 : 0);
    return { x: 0, y: Math.max(0.9, u < 0.95 ? y : lerp(y, 1.3, (u - 0.95) / 0.05)), z, yaw: 0, pitch: lerp(-0.35, 0.9, sm(0.35, 0.95, u)), roll: 0.08 * Math.sin(f * 0.2) }; }
  if (f < 820) return { x: 0, y: 1.6, z: HAY[1] - 0.2, yaw: 0, pitch: 0.95, roll: 0.05 };       // stuck nose-first in the hay
  if (f >= 1032 && f < 1117) { const th = -0.9 + (f - 1032) * 0.024; return onRing(th, RM); }
  if (f >= 1117 && f < 1160) return { x: PIT[0], y: 0, z: PIT[1], yaw: Math.PI / 2, pitch: 0, roll: 0 };
  if (f >= 1160 && f < 1216) { const th = -0.2 + (f - 1160) * 0.03; return onRing(th, RM); }
  return { x: PIT[0], y: 0, z: PIT[1], yaw: Math.PI / 2, pitch: 0, roll: 0 };
}

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { FLEW: wf(0, 'flew'), GRAND: wf(0, 'grandstand'), CHICK: wf(0, 'chicken'), FLIPPED: wf(1, 'flipped'), UP1: wf(1, 'up'), WHY: wf(1, 'why'), UPSIDE: wf(1, 'upside'),
      LAP1: wf(2, 'lap'), LIGHT: wf(2, 'light'), CART: wf(2, 'shopping'), ICE: wf(2, 'ice'), HEN: wf(3, 'henrietta'), THRILL: wf(3, 'thrilled'), FLY: wf(3, 'fly'), EGG: wf(3, 'egg'),
      BOLTED: wf(4, 'bolted'), SECOND: wf(4, 'second'), UP2: wf(4, 'up'), LAP2: wf(5, 'lap'), LIFTED: wf(5, 'lifted'), DOT: wf(5, 'dot'), CLOUDS: wf(5, 'clouds'),
      TOOK: wf(6, 'took'), FORTY: wf(6, 'forty'), HOTDOG: wf(6, 'hot'), LANDED: wf(7, 'landed'), HAY: wf(7, 'hay'), DART: wf(7, 'dart'), CUSH: wf(7, 'cushion'),
      WINGQ: wf(8, 'wing'), PLANE: wf(8, 'planes'), PULL: wf(8, 'pull'), UPX: wf(8, 'up'), FLIP: wf(9, 'flip'), UPSIDE2: wf(9, 'upside'), PUSHES: wf(9, 'pushes'), DOWN: wf(9, 'down'),
      MORE: wf(10, 'more'), GRIP: wf(10, 'grip'), BITE: wf(10, 'bite'), CORN: wf(10, 'corners'), BACK: wf(11, 'back'), HUGGED: wf(11, 'hugged'), CAT: wf(11, 'cat'), HEATER: wf(11, 'heater'),
      SPARE: wf(12, 'spare'), REACHED: wf(12, 'reached'), STAND: wf(12, 'stand') };
    // ================= Thunder Valley Speedway =================
    const G = K.group();
    K.slab(-90, 60, -0.1, 0, -70, 70, K.mat('grime', '#5f9a44', { detail: 2.0, amt: 0.35 }), G, false);              // grass
    const ring = new THREE.Mesh(new THREE.RingGeometry(R0, R1, 160, 1), K.mat('grime', '#3a3a40', { detail: 0.6, amt: 0.25 })); ring.rotation.x = -Math.PI / 2; ring.position.set(CX, 0.01, 0); ring.receiveShadow = true; G.add(ring);
    for (let k = 0; k < 180; k++) { const a = k / 180 * Math.PI * 2, a1 = (k + 1) / 180 * Math.PI * 2, am = (a + a1) / 2; for (const [r, w] of [[R0 - 0.3, 0.6], [R1 + 0.3, 0.6]]) {
      const b = K.rbox(w, 0.08, r * (a1 - a) + 0.01, 0.02, K.paint(k % 2 ? '#e8e4dc' : '#d0302a', { rough: 0.4 }), CX + r * Math.cos(am), 0.04, r * Math.sin(am), G); b.rotation.y = -am; } }
    for (let k = 0; k < 90; k++) { if (k % 2) continue; const a = k / 90 * Math.PI * 2; const b = K.rbox(0.12, 0.02, 1.4, 0.01, K.paint('#f4f2ee', { coat: 0 }), CX + RM * Math.cos(a), 0.02, RM * Math.sin(a), G); b.rotation.y = -a; }
    // catch fence + posts along the outside near the grandstand and pits
    for (let k = 0; k < 70; k++) { const a = -0.9 + k / 70 * 2.4; const p = [CX + (R1 + 1.2) * Math.cos(a), (R1 + 1.2) * Math.sin(a)]; if (Math.abs(p[0]) < 3 && p[1] > 8) continue; K.cyl(0.05, 0.05, 2.2, K.chrome(), p[0], 1.1, p[1], G, 8); }
    // tire stacks + billboards + flags around the ring
    const tyre = K.paint('#1c1c20', { rough: 0.7 });
    for (const [x, z, c] of [[8, -6, '#f2c230'], [7, 7, '#2a62c8'], [-50, -20, '#d0302a'], [-14, -34, '#f2c230'], [-40, 22, '#2a62c8'], [-6, 18, '#d0302a'], [-60, 4, '#f2c230']]) for (let k = 0; k < 5; k++) for (let j = 0; j < 3; j++) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.14, 8, 18), k === 4 ? K.paint(c) : tyre); t.rotation.x = Math.PI / 2; t.position.set(x + j * 0.75, 0.14 + k * 0.26, z); t.castShadow = true; G.add(t); }
    const bb = [['THUNDER VALLEY|SPEEDWAY', '#1f2a44', '#f2c230', 9, -12, -1.2], ['SPEEDY|BEANS', '#f2701e', '#ffffff', -57, 10, 1.7], ['HOT DOGS|$2', '#d0302a', '#ffffff', -42, -27, 0.5], ['GO GO GO!', '#2a62c8', '#ffffff', -2, -26, -0.6], ['CORNER 3', '#f4f2ee', '#1a1a1a', 6, 14, -1.9]];
    for (const [t, bg, fg, x, z, ry] of bb) { const b = new THREE.Group(); b.position.set(x, 0, z); b.rotation.y = ry; G.add(b); const m = new THREE.Mesh(new THREE.PlaneGeometry(5, 2), S.textMat(t, { bg, fg, w: 700, h: 280 })); m.position.y = 2.6; b.add(m); K.rbox(5.2, 2.2, 0.12, 0.05, K.paint('#3a3a40'), 0, 2.6, -0.08, b); for (const dx of [-2, 2]) K.cyl(0.08, 0.08, 1.6, K.chrome(), dx, 0.8, -0.1, b, 8); }
    // start/finish gantry at the pits
    const gx = PIT[0] + 6; for (const r of [R0 - 1.5, R1 + 1.5]) K.rbox(0.4, 6, 0.4, 0.05, K.paint('#e8e4dc'), gx, 3, -r, G);
    const chk = new THREE.Mesh(new THREE.PlaneGeometry(10, 1.2), S.textMat('START  ▪  FINISH', { bg: '#1a1a1a', fg: '#ffffff', w: 1024, h: 120 })); chk.position.set(gx, 5.6, -26); chk.rotation.y = Math.PI / 2; G.add(chk);
    for (let k = 0; k < 20; k++) for (let j = 0; j < 2; j++) K.rbox(0.05, 0.25, 0.45, 0, K.paint((k + j) % 2 ? '#f4f2ee' : '#1a1a1a', { coat: 0 }), gx, 6.35 + j * 0.25, -21 - k * 0.5 + 0.25, G);
    for (let k = 0; k < 18; k++) K.rbox(0.5, 0.012, 0.5, 0, K.paint((k % 2) ? '#f4f2ee' : '#1a1a1a', { coat: 0 }), gx + (k % 2 ? 0.25 : -0.25), 0.03, -22.5 - k * 0.5, G);
    // the grandstand: forty rows of fans (stepped), roof, banner
    const GS = new THREE.Group(); GS.position.set(0, 0, 21); G.add(GS);
    const NR = 16; for (let r = 0; r < NR; r++) { K.rbox(26, 0.5 * (r + 1), 0.62, 0.03, K.mat('plaster', '#b8bcc4', { detail: 0.8 }), 0, 0.25 * (r + 1), r * 0.6, GS); K.rbox(26, 0.08, 0.2, 0.02, K.paint(['#2a62c8', '#d0302a', '#f2c230'][r % 3]), 0, 0.5 * (r + 1) + 0.04, r * 0.6 - 0.15, GS); }
    const fanC = ['#d0302a', '#2a62c8', '#f2c230', '#2a9a6a', '#f2701e', '#9a5ad8', '#f4f2ee', '#e84a8f'], skin = ['#f1c9a5', '#d9a77e', '#a8754f', '#7a4e32', '#f6d8bf'];
    for (let r = 0; r < NR; r++) for (let k = 0; k < 24; k++) { if (hash(r * 31 + k) < 0.18) continue; const x = -12 + k + (hash(r + k * 7) - 0.5) * 0.4, y = 0.5 * (r + 1), z = r * 0.6;
      K.cyl(0.2, 0.24, 0.5, K.paint(fanC[Math.floor(hash(r * 7 + k * 3) * 8)], { coat: 0, rough: 0.6 }), x, y + 0.25, z + 0.05, GS, 10); K.sphere(0.17, K.paint(skin[Math.floor(hash(r + k * 11) * 5)], { coat: 0 }), x, y + 0.66, z + 0.05, GS);
      if (hash(r * 3 + k * 5) > 0.75) { const fl = K.rbox(0.04, 0.5, 0.04, 0, K.paint('#3a2418'), x + 0.2, y + 0.9, z, GS); K.rbox(0.36, 0.24, 0.02, 0, K.paint(fanC[(r + k) % 8], { coat: 0 }), x + 0.38, y + 1.05, z, GS); } }
    K.rbox(27, 0.3, 4, 0.05, K.paint('#e8e4dc'), 0, 0.5 * NR + 3.2, NR * 0.6 - 1.6, GS); for (const dx of [-12.5, -4, 4, 12.5]) K.cyl(0.12, 0.12, 3.4, K.chrome(), dx, 0.5 * NR + 1.5, NR * 0.6 - 0.2, GS, 10);
    const ban = new THREE.Mesh(new THREE.PlaneGeometry(14, 1.2), S.textMat('THUNDER VALLEY GRANDSTAND · 40 ROWS', { bg: '#1f2a44', fg: '#f2c230', w: 1400, h: 120, border: false })); ban.position.set(0, 0.5 * NR + 2.7, NR * 0.6 - 3.7); ban.rotation.y = Math.PI; GS.add(ban);
    const ban2 = ban.clone(); ban2.rotation.y = 0; ban2.position.z = NR * 0.6 + 0.45; GS.add(ban2);
    const bk = new THREE.Mesh(new THREE.PlaneGeometry(26, 8.2), K.mat('brick', '#b8664a', { detail: 0.6 })); bk.position.set(0, 4.1, NR * 0.6 - 0.28); GS.add(bk);
    const mur = new THREE.Mesh(new THREE.PlaneGeometry(16, 2.4), S.textMat('THUNDER VALLEY|SPEEDWAY', { bg: '#1f2a44', fg: '#f2c230', w: 1200, h: 200 })); mur.position.set(0, 4.6, NR * 0.6 - 0.24); GS.add(mur);
    for (const dx of [-12, -8.5, 8.5, 12]) { K.rbox(0.5, 8.2, 0.3, 0.05, K.paint('#e8e4dc'), dx, 4.1, NR * 0.6 - 0.15, GS); }
    for (let k = 0; k < 9; k++) { const d = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.4), K.paint(k % 2 ? '#2a62c8' : '#d0302a', { coat: 0 })); d.position.set(-11 + k * 2.75, 7.3, NR * 0.6 - 0.22); GS.add(d); }
    K.rbox(26, 0.9, 0.2, 0.03, K.paint('#f4f2ee'), 0, 0.45, -0.45, GS); const wall = new THREE.Mesh(new THREE.PlaneGeometry(24, 0.6), S.textMat('SPEEDY BEANS · SPEEDY BEANS · SPEEDY BEANS', { bg: '#f2701e', fg: '#ffffff', w: 1400, h: 60, border: false })); wall.position.set(0, 0.5, -0.56); wall.rotation.y = Math.PI; GS.add(wall);
    // hot-dog stand behind the grandstand
    const HD = new THREE.Group(); HD.position.set(DOG[0], 0, DOG[1]); G.add(HD);
    K.rbox(3.0, 1.1, 1.6, 0.06, K.paint('#d0302a'), 0, 0.55, 0, HD); K.rbox(3.2, 0.08, 1.8, 0.03, K.paint('#f4f2ee'), 0, 1.14, 0, HD);
    for (let k = 0; k < 6; k++) K.rbox(0.55, 0.06, 1.9, 0.02, K.paint(k % 2 ? '#f4f2ee' : '#d0302a'), -1.4 + k * 0.56, 2.45 - (k % 2) * 0.0, 0, HD).rotation.x = 0.12;
    for (const dx of [-1.45, 1.45]) K.cyl(0.04, 0.04, 1.4, K.chrome(), dx, 1.8, -0.7, HD, 8);
    const hs = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.5), S.textMat('HOT DOGS $2', { bg: '#f2c230', fg: '#d0302a', w: 700, h: 140, border: false })); hs.position.set(0, 2.85, -0.85); hs.rotation.y = Math.PI; HD.add(hs); const hs2 = hs.clone(); hs2.rotation.y = 0; hs2.position.z = 0.85; HD.add(hs2);
    const big = K.cyl(0.25, 0.25, 1.4, K.paint('#c8783a'), 0, 3.3 - 0.7, 0, HD, 16); big.rotation.z = Math.PI / 2; const bun = K.cyl(0.3, 0.3, 1.2, K.paint('#f2c48a'), 0, 3.15 - 0.6, 0, HD, 16); bun.rotation.z = Math.PI / 2; bun.scale.set(1, 1, 0.6);
    for (let k = 0; k < 4; k++) { const d = K.cyl(0.05, 0.05, 0.35, K.paint('#c8783a'), -0.9 + k * 0.25, 1.22 - 0.175, -0.4, HD, 8); d.rotation.z = Math.PI / 2; }
    K.cyl(0.14, 0.14, 0.3, K.paint('#f2c230'), 0.9, 1.33, 0.3, HD, 12); K.cyl(0.14, 0.14, 0.3, K.paint('#d0302a'), 1.2, 1.33, 0.3, HD, 12);
    // hay bales (round + square) behind the stand
    const hayM = K.mat('fabric', '#e8c860', { detail: 0.25, amt: 0.4 });
    for (let k = 0; k < 14; k++) { const x = HAY[0] - 3.5 + (k % 7) * 1.15, z = HAY[1] + Math.floor(k / 7) * 1.2, y = 0.45; K.rbox(1.1, 0.9, 1.15, 0.12, hayM, x, y, z, G); }
    for (let k = 0; k < 6; k++) K.rbox(1.1, 0.9, 1.15, 0.12, hayM, HAY[0] - 2.9 + k * 1.15, 1.35, HAY[1] + 0.6, G);
    for (let k = 0; k < 4; k++) { const b = K.cyl(0.8, 0.8, 1.2, hayM, HAY[0] - 6 + (k % 2) * 13, 0.8 - 0.6, HAY[1] - 1 + Math.floor(k / 2) * 2.2, G, 24); b.rotation.z = Math.PI / 2; }
    const hsg = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.6), S.textMat('SOFT LANDING', { bg: '#5a3a24', fg: '#f2c230', w: 600, h: 160 })); hsg.position.set(HAY[0] + 5.5, 1.6, HAY[1] - 1.8); G.add(hsg); K.cyl(0.06, 0.06, 1.6, K.mat('wood', '#7a5a3a'), HAY[0] + 5.5, 0.8, HAY[1] - 1.9, G, 8);
    // trees on the horizon
    for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2; const t = S.tree({ h: 5 + hash(k) * 3, seed: k }); t.position.set(CX + 46 * Math.cos(a) + 10, 0, 46 * Math.sin(a)); }
    for (let k = 0; k < 8; k++) { const t = S.tree({ h: 4 + hash(k + 9) * 2, seed: k + 20 }); t.position.set(-12 + k * 4 + hash(k) * 2, 0, 46 + hash(k + 3) * 4); }
    // ===== pit garage: Speedy Beans Racing =====
    const PG = new THREE.Group(); PG.position.set(PIT[0], 0, PIT[1] - 4.2); G.add(PG);
    K.slab(PIT[0] - 12, PIT[0] + 12, 0, 0.012, PIT[1] - 3.2, PIT[1] + 1.6, K.mat('grime', '#8a8a90', { detail: 0.8 }), G, false);
    K.rbox(16, 0.4, 7, 0.05, K.paint('#e8e4dc'), 0, 4.2, -3, PG); K.rbox(16, 4, 0.3, 0.03, K.mat('plaster', '#d8d4cc'), 0, 2, -6.4, PG);
    for (const dx of [-8, -2.7, 2.7, 8]) K.rbox(0.4, 4, 6.5, 0.04, K.mat('plaster', '#c8c4bc'), dx, 2, -3.2, PG);
    const pgs = new THREE.Mesh(new THREE.PlaneGeometry(9, 0.9), S.textMat('SPEEDY BEANS RACING', { bg: '#f2701e', fg: '#ffffff', w: 1200, h: 120, border: false })); pgs.position.set(0, 3.8, 0.27); PG.add(pgs);
    for (const dx of [-5.35, 5.35]) { K.rbox(4.8, 1.0, 0.1, 0.02, K.paint('#9aa0a8', { metal: 0.6 }), dx, 3.3, 0.1, PG); for (let k = 0; k < 5; k++) K.rbox(4.8, 0.03, 0.12, 0, K.paint('#6a7078'), dx, 2.9 + k * 0.18, 0.12, PG); }
    // tool chests, tire rack, workbench, fuel cans, heater (pit cat), spare wing on the wall, pit board
    for (const [dx, c] of [[-2.0, '#d0302a'], [-1.2, '#2a62c8']]) { K.rbox(0.7, 1.0, 0.5, 0.04, K.paint(c), dx, 0.5, -5.8, PG); for (let k = 0; k < 4; k++) K.rbox(0.6, 0.02, 0.02, 0, K.chrome(), dx, 0.25 + k * 0.22, -5.54, PG); }
    for (let k = 0; k < 4; k++) { const t = K.cyl(0.36, 0.36, 0.42, tyre, 1.2 + k * 0.5, 0.36 - 0.21, -5.6, PG, 20); t.rotation.z = Math.PI / 2; t.rotation.y = 0.15; }
    K.rbox(1.8, 0.08, 0.7, 0.02, K.mat('wood', '#a8784a'), -4.5, 0.95, -5.6, PG); for (const dx of [-5.3, -3.7]) K.rbox(0.08, 0.95, 0.6, 0.02, K.paint('#3a3a40'), dx, 0.48, -5.6, PG);
    for (let k = 0; k < 3; k++) K.rbox(0.3, 0.45, 0.2, 0.05, K.paint('#d0302a'), -4.9 + k * 0.4, 1.22, -5.6, PG);
    const HT = K.rbox(0.8, 0.6, 0.4, 0.06, K.paint('#5a5a60', { metal: 0.5 }), 4.4, 0.3, -5.6, PG); for (let k = 0; k < 4; k++) K.rbox(0.6, 0.04, 0.02, 0, new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff7a2a').multiplyScalar(1.6), toneMapped: false }), 4.4, 0.15 + k * 0.1, -5.39, PG);
    const pb = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.6), S.textMat('LAP|1', { bg: '#1a1a1a', fg: '#f2c230', w: 256, h: 180 })); pb.position.set(3.2, 1.6, -6.2); PG.add(pb);
    const pst = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.6), S.textMat('HENRIETTA|TEAM HEN', { bg: '#f4efe4', fg: '#d0302a', w: 300, h: 400 })); pst.position.set(-0.6, 2.2, -6.2); PG.add(pst);
    S.bake(G);
    K.lamp(PIT[0] - 1, 3.6, PIT[1] - 6, { color: '#fff0d0', intensity: 4, distance: 9 });
    SPARE = new THREE.Group(); SPARE.position.set(PIT[0] + 2.0, 2.4, PIT[1] - 10.2); sc.add(SPARE); SPARE.add(airfoil(K, 1.4, 0.5, 0.14, K.paint('#d0302a', { rough: 0.25 })));
    // ================= car + characters =================
    CAR = raceCar(K);
    DOT = K.stick({ jacket: '#f2701e', pants: '#f2701e', hat: 'helmet', hatColor: '#f4f2ee', gloves: '#1a1a1a', scarf: '#2a62c8', hairStyle: 'ponytail', hair: '#3a2418', badge: true }, { key: 'dot' });
    CAR.add(DOT.root);
    HEN = K.animal('chicken', { color: '#f4f2ee', seed: 3, scale: 1.5 });
    VIN = K.stick({ jacket: '#f2701e', pants: '#2a2a40', hat: 'cap', hatColor: '#1f2a44', moustache: '#3a2418', belt: '#1a1a1a', gloves: '#3a3a40', pockets: true, vest: '#1f2a44', build: 'stout' }, { key: 'vinnie' });
    VENDOR = K.stick({ jacket: '#f4f2ee', pants: '#d0302a', hat: 'chef', bowtie: '#d0302a', apron: '#ffffff', moustache: '#2a1a14' }, { key: 'vendor' });
    for (let k = 0; k < 4; k++) FANS.push(K.stick([{ jacket: '#2a62c8', pants: '#1f2a44', hat: 'cap', hatColor: '#d0302a', glasses: true, scarf: '#f2c230' }, { jacket: '#2a9a6a', pants: '#3a3a40', hairStyle: 'curly', hair: '#2a1a14', scarf: '#f4f2ee', belt: '#3a2418' },
      { jacket: '#9a5ad8', pants: '#2a2a40', hat: 'beanie', hatColor: '#f2c230', glasses: '#c0392b', dress: '#9a5ad8' }, { jacket: '#f2c230', pants: '#2a62c8', hat: 'cowboy', moustache: '#5a3a24', vest: '#8a5a34' }][k], { key: 'fan' + k }));
    CAT = K.animal('cat', { color: '#e8a050', seed: 4, scale: 1.0 });
    HENWING = new THREE.Group(); sc.add(HENWING); HENWING.add(airfoil(K, 0.9, 0.32, 0.09, K.paint('#d0302a', { rough: 0.25 }))); K.rbox(0.05, 0.25, 0.05, 0, K.chrome(), 0, -0.15, 0, HENWING);
    // ================= explainer: wing cross-section + airflow + holo car =================
    FOILP = new THREE.Group(); FOILP.position.set(EXP[0], 3.0, EXP[1]); sc.add(FOILP);
    FOIL = airfoil(K, 3.2, 2.4, 0.6, K.glass({ color: '#bfe4ff', opacity: 0.35 })); FOILP.add(FOIL); const fe = airfoil(K, 3.24, 2.42, 0.61, K.holo('#36e2ff')); FOILP.add(fe);
    FOILP.userData.stand = K.group(); K.cyl(1.6, 1.8, 0.3, K.paint('#1f2a44', { rough: 0.3 }), EXP[0], 0.15, EXP[1], FOILP.userData.stand, 40); K.cyl(1.62, 1.62, 0.05, K.gold(), EXP[0], 0.31, EXP[1], FOILP.userData.stand, 40);
    for (let j = 0; j < 4; j++) { const y0 = [-0.9, -0.45, 0.75, 1.15][j]; const pts = []; for (let i = 0; i <= 30; i++) { const z = 3 - i * 0.2; const bump = j >= 2 ? 0.5 * Math.exp(-(((z - 0.4) / 0.9) ** 2)) * (j === 2 ? 1 : 0.6) : -0.1 * Math.exp(-((z / 1.2) ** 2)); pts.push([0, y0 + bump, z]); }
      TRC.push(K.trace(pts, { parent: FOILP, color: j >= 2 ? '#7af8a0' : '#ffd23a', r: 0.04 })); }
    const amat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff7a2a').multiplyScalar(2.0), toneMapped: false });
    for (let k = 0; k < 3; k++) { const g = new THREE.Group(); const s = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.9, 10), amat); s.position.y = 0.45; g.add(s); const h = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.35, 12), amat); h.position.y = 1.0; g.add(h);
      g.traverse((o) => { o.userData.ndSkip = true; }); g.position.set(-1 + k, 0.4, 0); FOILP.add(g); ARR.push(g); }
    HCAR = new THREE.Group(); sc.add(HCAR); { const hm = K.holo('#36e2ff'); K.rbox(0.9, 0.42, 3.6, 0.16, hm, 0, 0.42, 0, HCAR); for (const [sx, z] of [[-1, 1.3], [1, 1.3], [-1, -1.2], [1, -1.2]]) { const t = K.cyl(0.4, 0.4, 0.4, hm, sx * 0.85, 0.4 - 0.2, z, HCAR, 20); t.rotation.z = Math.PI / 2; } }
    K.addClouds(10, 700, 150);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s);
    const ex = f >= 822 && f < 1030;
    // ---------- the car ----------
    const c = carAt(f); CAR.visible = !ex; CAR.position.set(c.x, c.y, c.z); CAR.rotation.set(0, 0, 0); CAR.rotateY(c.yaw); CAR.rotateX(c.pitch); CAR.rotateZ(c.roll); CAR.updateMatrixWorld(true);
    const flipped = f < 112 || (f >= 112 && f < 1117 && f >= F.FLIPPED - 2) ? 1 : 0;
    const flipU = f < 112 ? 1 : f < 1117 ? sm(F.FLIPPED - 8, F.FLIPPED + 6, f) : 1 - sm(F.BACK - 8, F.BACK + 6, f);
    RW.rotation.z = Math.PI * (1 - flipU); RW.position.y = 1.45; void flipped;
    const two = f < 112 || (f >= F.SECOND - 6 && f < 1117); FW2.visible = two; FW2.scale.setScalar(f >= 112 && f < F.SECOND + 4 ? sm(F.SECOND - 6, F.SECOND + 2, f) : 1);
    const moving = (f >= 236 && f < 442) || (f >= 524 && f < 760) || (f >= 1032 && f < 1117) || (f >= 1160 && f < 1216) || f < 112;
    WHEELS.forEach((w) => { w.rotation.x = moving ? f * 0.9 : 0; });
    // Dot the driver, seated in the cockpit (local to the car)
    const dk = [[0, 'cheer', { expr: 'excited' }], [112, 'sit', { expr: 'nervous', sweat: true }], [236, 'sit', { expr: 'scared', R: [0.35, 0.3, null, true], L: [0.35, 0.3, null, true] }], [442, 'sit', { expr: 'nervous' }],
      [524, 'sit', { expr: 'scared', R: [0.35, 0.3, null, true], L: [0.35, 0.3, null, true] }], [F.CLOUDS - 20, 'pointUp', { expr: 'confused' }], [F.TOOK, 'panic', { expr: 'scared' }], [746, 'shock', { expr: 'dazed' }],
      [1032, 'sit', { expr: 'grin', R: [0.35, 0.3, null, true], L: [0.35, 0.3, null, true] }], [1117, 'sit', { expr: 'smile' }], [1160, 'cheer', { expr: 'laugh' }]];
    const DA = T.act(f, dk, { seed: 3, blink: blink(3) }); DA.opts.mode = 'sit';
    DOT.set(DA, { x: 0, y: 0.05, z: 0.05, yaw: 0, visible: !ex && f < 1216 });
    // Henrietta: on board (engine cover / wing), then her spare wing at the end
    let hp = { x: 0, z: 0, yaw: 0, mode: 'stand', expr: 'happy' }, onCar = true, hy = 0;
    if (f < 112) hp = { mode: 'jump', expr: 'happy', flap: true };
    else if (f < 236) hp = { mode: f >= F.FLIPPED ? 'jump' : 'stand', expr: f >= F.FLIPPED ? 'happy' : 'neutral', flap: f >= F.FLIPPED };
    else if (f < 322) hp = { mode: 'stand', expr: 'shock' };
    else if (f < 442) hp = { mode: 'jump', expr: 'happy', flap: true, onWing: f >= 370 };
    else if (f < 524) hp = { mode: 'stand', expr: 'happy', flap: f >= F.UP2 };
    else if (f < 650) hp = { mode: 'jump', expr: 'happy', flap: true };
    else if (f < 760) hp = { mode: 'jump', expr: 'happy', flap: true };
    else if (f < 822) hp = { mode: 'jump', expr: 'happy', flap: true, pop: true };
    else onCar = false;
    if (onCar && !ex) { const lp = hp.onWing ? new THREE.Vector3(0, 1.62, -1.45) : new THREE.Vector3(0, 1.0, -0.95); if (hp.pop) lp.set(0, 0, 0);
      const wp = hp.pop ? new THREE.Vector3(0.6, 2.3 + 0.3 * Math.max(0, Math.sin((f - 790) * 0.2)), HAY[1] - 1.0) : CAR.localToWorld(lp);
      HEN.set(f, { x: wp.x, y: wp.y, z: wp.z, yaw: hp.pop ? 0.4 : c.yaw + Math.PI * 0, mode: hp.mode, expr: hp.expr, flap: hp.flap, visible: hp.pop ? f >= 795 : true }); if (!hp.pop) HEN.root.rotation.set(c.pitch * 0.6, c.yaw, 0, 'YXZ'); }
    else if (!ex) { // end: Henrietta on the pit lane with the spare wing -> flies to the hot-dog stand
      let p; if (f < 1216) p = { x: PIT[0] + 2.2, y: 0, z: PIT[1] - 1.5, yaw: 0.4, mode: f >= F.HEATER ? 'wag' : 'stand', expr: 'neutral' };
      else if (f < 1262) { const u = sm(F.SPARE + 4, 1262, f); p = { x: PIT[0] + 2.2 + u * 2, y: u * 2.5, z: PIT[1] - 1.5 + u * 3, yaw: 0.6, mode: f >= F.SPARE ? 'jump' : 'stand', expr: 'happy', flap: f >= F.SPARE }; }
      else { const u = sm(1262, F.STAND + 6, f); p = { x: lerp(DOG[0] - 5, DOG[0] + 0.3, u), y: lerp(4, 1.2, u * u), z: lerp(DOG[1] - 6, DOG[1] - 0.2, u), yaw: 0.5, mode: u < 1 ? 'jump' : 'wag', expr: 'happy', flap: u < 1 }; }
      HEN.set(f, p); }
    else HEN.set(f, { visible: false });
    HENWING.visible = !ex && f >= F.SPARE - 2; if (HENWING.visible) { const hb = HEN.root.position; HENWING.position.set(hb.x, hb.y + 0.95, hb.z - 0.05); HENWING.rotation.set(0, HEN.root.rotation.y, 0); HENWING.scale.setScalar(f < F.SPARE + 4 ? sm(F.SPARE - 2, F.SPARE + 4, f) : 1); }
    SPARE.visible = !(f >= F.SPARE - 2);
    // Vinnie at the pits
    const vk = [[0, 'cheer', { expr: 'shock' }], [112, 'hammer', { expr: 'grin', R: [0.3, 0.3, 'hammer'] }], [F.FLIPPED - 4, 'reach', { expr: 'proud' }], [F.UP1 - 6, 'pointUp', { expr: 'proud', talk: true }], [F.WHY, 'hips', { expr: 'smug' }],
      [236, 'cheer', { expr: 'excited' }], [F.ICE - 4, 'shock', { expr: 'confused' }], [322, 'scared', { expr: 'nervous', sweat: true }], [442, 'hammer', { expr: 'stern', R: [0.3, 0.3, 'hammer'] }], [F.UP2 - 6, 'cheer', { expr: 'proud', talk: true }],
      [524, 'idle', { expr: 'proud' }], [F.LIFTED, 'shock', { expr: 'shock' }], [F.TOOK, 'panic', { expr: 'scared' }], [1032, 'think', { expr: 'confused' }], [1117, 'hammer', { expr: 'stern', R: [0.3, 0.3, 'hammer'] }], [F.BACK + 4, 'clap', { expr: 'smile' }],
      [F.HUGGED, 'cheer', { expr: 'laugh' }], [1216, 'show', { expr: 'smile' }], [F.REACHED, 'facepalm', { expr: 'laugh' }]];
    const VA = T.act(f, vk, { seed: 9, blink: blink(9), phase: (f / 18) % 1 });
    let vp = { x: PIT[0] - 1.0, z: PIT[1] - 2.0, yaw: 0.5 };
    if (f >= 112 && f < 236) vp = { x: PIT[0] - 1.1, z: PIT[1] - 1.6, yaw: 0.9 };
    if (f >= 442 && f < 524) vp = { x: PIT[0] + 3.3, z: PIT[1] + 1.0, yaw: 0.6 };
    if (f >= 524 && f < 1032) vp = { x: PIT[0] + 1.0, z: PIT[1] + 4.0 > -27 ? PIT[1] - 2.0 : PIT[1] - 2.0, yaw: 0.2 };
    if (f >= 1117 && f < 1216) vp = { x: PIT[0] - 1.1, z: PIT[1] - 1.6, yaw: 0.9 };
    if (f >= 1216) vp = { x: PIT[0] + 0.6, z: PIT[1] - 2.4, yaw: 0.6 };
    VIN.set(VA, { ...vp, visible: !ex && !(f < 112) && !(f >= 650 && f < 1032) });
    // the pit cat on the heater
    CAT.set(f, { x: PIT[0] + 4.4, y: 0.62, z: PIT[1] - 9.8, yaw: 0.2, mode: 'sleep', expr: 'sleepy', visible: !ex });
    // fans in the front row + hot-dog vendor
    FANS.forEach((fa, k) => { const look = f < 112 || (f >= 637 && f < 760); const A = T.act(f, [[0, look ? 'pointUp' : 'cheer', { expr: look ? 'shock' : 'excited' }], [k * 3 + 30, look ? 'shock' : 'clap', { expr: look ? 'shock' : 'laugh' }]], { seed: 20 + k, blink: blink(20 + k) });
      fa.set(A, { x: -3.5 + k * 2.2, y: 0, z: 19.4 - (k % 2) * 0.5, yaw: f < 112 || (f >= 637 && f < 760) ? 0.2 : Math.PI + 0.2, visible: !ex }); });
    const vdk = [[0, 'shock', { expr: 'shock' }], [637, 'idle', { expr: 'neutral', R: [0.3, 0.3, 'food'] }], [F.HOTDOG - 6, 'shock', { expr: 'shock' }], [F.HOTDOG + 10, 'panic', { expr: 'scared' }], [1216, 'idle', { expr: 'neutral', R: [0.3, 0.3, 'food'] }], [F.STAND - 6, 'shock', { expr: 'shock' }], [F.STAND + 14, 'show', { expr: 'laugh', R: [0.3, 0.3, 'food'] }]];
    VENDOR.set(T.act(f, vdk, { seed: 31, blink: blink(31) }), { x: DOG[0] - 0.3, z: f >= 1216 ? DOG[1] - 1.3 : DOG[1] + 1.4, yaw: f >= 1216 ? 0.3 : Math.PI, visible: !ex });
    // ---------- explainer ----------
    FOILP.visible = FOILP.userData.stand.visible = ex; HCAR.visible = ex && f >= F.FLIP + 10;
    const fl = sm(F.FLIP - 2, F.FLIP + 16, f); FOILP.rotation.set(0, 0, Math.PI * fl); FOILP.position.y = 3.0 + 0.25 * Math.sin(f * 0.05) * (1 - fl) + 0.4 * (f >= F.PULL && f < F.FLIP ? sm(F.PULL - 4, F.PULL + 10, f) : 0) - 1.2 * sm(F.PUSHES - 4, F.PUSHES + 10, f);
    HCAR.position.set(EXP[0], 0.32, EXP[1]); HCAR.scale.setScalar(0.8);
    TRC.forEach((t, j) => t.show(ex ? sm(818 + j * 5, 850 + j * 5, f) : 0)); ARR.forEach((a) => { a.visible = ex && f >= F.PULL - 6; a.position.y = 0.4 + 0.15 * Math.sin(f * 0.3 + a.position.x); });
    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const body = (x, z, y = 0, h = 2.2) => [[x, y, z], [x, y + h, z]];
    const CP = [c.x, c.y, c.z], carPts = [[c.x - 1.4, c.y, c.z - 1.4], [c.x + 1.4, c.y + 1.8, c.z + 1.4]];
    const carFit = (rel, pitch, margin) => { const a = Math.atan2(Math.cos(c.yaw), Math.sin(c.yaw)) * 180 / Math.PI + rel; return K.fit([...carPts, [c.x, c.y + 2.2, c.z]], { yaw: a, pitch, fov: 44, margin, maxDist: 12 }); };
    const PK = [[PIT[0] - 2.4, 0, PIT[1] - 1.8], [PIT[0] + 2.4, 2.4, PIT[1] + 1.2]];
    if (sh(0, 55)) {                          // 1. hook: the car flies over the grandstand, chicken flapping on board, fans pointing up
      cam = K.fit([[-3, 0, 20.5], [3, 4, 22], ...carPts], { yaw: -50, pitch: 2, fov: 44, margin: 0.75, maxDist: 14 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(55, 112)) {                 // 2. over the top: car + Henrietta flapping, the crowd below (wide, behind)
      cam = K.fit([...carPts, [-5, 7, 27], [5, 8.5, 30], [DOG[0], 0, DOG[1]]], { yaw: -120, pitch: 22, fov: 44, margin: 0.85, maxDist: 24 });
    } else if (sh(112, 170)) {                // 3. flashback, pits: Vinnie flips the wing (wide)
      cam = K.fit([...PK, ...body(PIT[0] - 1.1, PIT[1] - 1.6)], { yaw: 60, pitch: 10, fov: 40, margin: 0.95, maxDist: 16 }); cam.fov *= K.punch(f, F.FLIPPED + 4, 0.12, 6);
    } else if (sh(170, 232)) {                // 4. "Wings go UP!" — why upside down? (wide, garage behind)
      cam = K.fit([...PK, ...body(PIT[0] - 1.1, PIT[1] - 1.6), [PIT[0] + 3, 4, PIT[1] - 6]], { yaw: 110, pitch: 6, fov: 42, margin: 0.95, maxDist: 16 }); cam.fov *= K.punch(f, F.UP1, 0.1, 6);
    } else if (sh(232, 278)) {                // 5. lap one: the car goes light (tracking wide)
      const tc = K.track(f, (g) => { const q = carAt(g); return [q.x, 0, q.z]; }, { off: [-6, 3.0, -7], lag: 6, lookY: 0.8 }); cam = { ...tc, fov: 48 };
    } else if (sh(278, 318)) {                // 6. like a shopping cart on ice: sliding sideways past the stands (wide high)
      cam = K.fit([...carPts, [c.x - 4, 0, c.z - 4], [c.x + 4, 0, c.z + 4]], { yaw: 200, pitch: 30, fov: 42, margin: 0.9, maxDist: 20 }); cam.fov *= K.punch(f, F.ICE, 0.12, 6);
    } else if (sh(318, 372)) {                // 7. Henrietta is thrilled (reaction, on the car)
      const hp2 = HEN.root.position; cam = { pos: [hp2.x + Math.sin(c.yaw) * 3 + Math.cos(c.yaw) * 1.6, hp2.y + 1.0, hp2.z + Math.cos(c.yaw) * 3 - Math.sin(c.yaw) * 1.6], look: [hp2.x, hp2.y + 0.4, hp2.z], fov: 42 * K.push(u, 0.06) }; dof = { focus: 3.4, cinf: 12 };
    } else if (sh(372, 438)) {                // 8. she's wanted to fly since she was an egg: on the wing, flapping (wide tracking)
      const tc = K.track(f, (g) => { const q = carAt(g); return [q.x, 0, q.z]; }, { off: [5, 3.2, 6], lag: 5, lookY: 1.2 }); cam = { ...tc, fov: 46 }; cam.fov *= K.punch(f, F.EGG, 0.1, 6);
    } else if (sh(438, 482)) {                // 9. Vinnie bolts on a second wing (wide pits)
      cam = K.fit([...PK, ...body(PIT[0] + 3.3, PIT[1] + 1.0), [PIT[0] - 4, 3, PIT[1] - 6]], { yaw: 75, pitch: 14, fov: 40, margin: 0.95, maxDist: 16 }); cam.fov *= K.punch(f, F.SECOND, 0.12, 6);
    } else if (sh(482, 524)) {                // 10. "Wings go UP!" (Vinnie reaction close)
      cam = { pos: [PIT[0] + 3.3 + 1.5, 1.8, PIT[1] + 1.0 + 2.2], look: [PIT[0] + 3.1, 1.4, PIT[1] + 0.8], fov: 42 * K.push(u, 0.07) }; dof = { focus: 2.7, cinf: 12 };
    } else if (sh(524, 578)) {                // 11. lap two: the front wheels lift (tracking wide, low)
      cam = carFit(70, 6, 1.0); cam.fov *= K.punch(f, F.LIFTED, 0.12, 6);
    } else if (sh(578, 632)) {                // 12. Dot steers at clouds (reaction, low looking up, sky behind)
      const dp = CAR.localToWorld(new THREE.Vector3(0, 1.4, 0.2)); const fw = [Math.sin(c.yaw), Math.cos(c.yaw)];
      cam = { pos: [dp.x + fw[0] * 2.4 + fw[1] * 2.0, dp.y + 1.5, dp.z + fw[1] * 2.4 - fw[0] * 2.0], look: [dp.x, dp.y + 0.1, dp.z], fov: 44 }; dof = { focus: 3.6, cinf: 10 };
    } else if (sh(632, 690)) {                // 13. the whole car takes off toward the grandstand (wide)
      cam = K.fit([...carPts, [-8, 0, 20], [8, 8.5, 28]], { yaw: -55, pitch: 8, fov: 44, margin: 0.9, maxDist: 30 }); cam.fov *= K.punch(f, F.TOOK, 0.12, 6);
    } else if (sh(690, 744)) {                // 14. over forty rows of fans and a hot-dog stand (wide from behind/below)
      cam = K.fit([...carPts, [DOG[0] - 1.5, 0, DOG[1]], [DOG[0] + 1.5, 3.4, DOG[1]], [-2, 8, 24]], { yaw: -8, pitch: 14, fov: 46, margin: 0.85, maxDist: 22 }); cam.fov *= K.punch(f, F.FORTY, 0.08, 6);
    } else if (sh(744, 790)) {                // 15. lands in the hay bales like a dart (wide, impact)
      cam = K.fit([[HAY[0] - 5, 0, HAY[1] - 2], [HAY[0] + 5, 3.5, HAY[1] + 2], ...carPts], { yaw: -30, pitch: 10, fov: 42, margin: 0.9, maxDist: 20 }); cam.fov *= K.punch(f, F.DART, 0.14, 6);
      const s = K.shake(f, F.LANDED + 3, 0.12, 14); cam.pos[0] += s[0]; cam.pos[1] += s[1];
    } else if (sh(790, 822)) {                // 16. tail up, wheels spinning, Henrietta pops out of the hay (wide)
      cam = K.fit([[HAY[0] - 3, 0, HAY[1] - 1], [HAY[0] + 3, 3.6, HAY[1] + 1], ...body(DOG[0] - 0.3, DOG[1] + 1.4)], { yaw: 50, pitch: 14, fov: 42, margin: 0.85, maxDist: 14 }); cam.fov *= K.punch(f, F.CUSH, 0.1, 6);
    } else if (sh(822, 878)) {                // 17. explainer: a plane's wing pulls the plane up
      cam = K.fit([[EXP[0], 1.6, EXP[1] - 2.6], [EXP[0], 4.6, EXP[1] + 2.6], [EXP[0] - 1.6, 0, EXP[1]]], { yaw: 0, pitch: 4, fov: 40, margin: 0.55, maxDist: 9 }); cam.fov *= K.punch(f, F.UPX, 0.1, 6);
    } else if (sh(878, 930)) {                // 18. the green flow over the curved top (another angle)
      cam = K.fit([[EXP[0] - 1.6, 1.6, EXP[1] - 2.6], [EXP[0] + 1.6, 4.6, EXP[1] + 2.6]], { yaw: 30, pitch: 14, fov: 40, margin: 0.55, maxDist: 9 });
    } else if (sh(930, 980)) {                // 19. flip that same wing upside down
      cam = K.fit([[EXP[0], 0, EXP[1] - 2.6], [EXP[0], 4.4, EXP[1] + 2.6]], { yaw: -10, pitch: 6, fov: 40, margin: 0.85, maxDist: 16 }); cam.fov *= K.punch(f, F.UPSIDE2, 0.08, 6);
    } else if (sh(980, 1030)) {               // 20. it pushes the (holo) car down
      cam = K.fit([[EXP[0] - 1.5, 0, EXP[1] - 2.6], [EXP[0] + 1.5, 3.2, EXP[1] + 2.6]], { yaw: -40, pitch: 16, fov: 40, margin: 0.85, maxDist: 16 }); cam.fov *= K.punch(f, F.DOWN, 0.12, 6);
    } else if (sh(1030, 1072)) {              // 21. more push, more grip: low by the front tyre in the corner
      cam = carFit(35, 4, 0.9); cam.fov *= K.punch(f, F.GRIP, 0.1, 6);
    } else if (sh(1072, 1117)) {              // 22. the tyres bite into the corners (high wide)
      cam = K.fit([...carPts, [c.x - 6, 0, c.z - 6], [c.x + 6, 0, c.z + 6]], { yaw: 150, pitch: 38, fov: 42, margin: 0.9, maxDist: 22 });
    } else if (sh(1117, 1162)) {              // 23. Vinnie flips it back; the pit cat on the heater (wide garage)
      cam = K.fit([...PK, ...body(PIT[0] - 1.1, PIT[1] - 1.6), [PIT[0] + 4.6, 0.6, PIT[1] - 9.8]], { yaw: 95, pitch: 10, fov: 42, margin: 0.9, maxDist: 16 }); cam.fov *= K.punch(f, F.BACK, 0.1, 6);
    } else if (sh(1162, 1214)) {              // 24. hugs the track like a cat on a heater (low tracking)
      cam = carFit(115, 8, 1.1); cam.fov *= K.punch(f, F.HEATER, 0.08, 6);
    } else if (sh(1214, 1262)) {              // 25. Henrietta gets the spare wing and takes off (wide pits)
      cam = K.fit([...PK, ...body(PIT[0] + 0.6, PIT[1] - 2.4), [PIT[0] + 4, 3, PIT[1] + 2]], { yaw: 60, pitch: 8, fov: 42, margin: 0.95, maxDist: 16 }); cam.fov *= K.punch(f, F.SPARE, 0.1, 6);
    } else {                                  // 26. she reaches the hot-dog stand (wide, grandstand behind = the hook's world)
      const hq = HEN.root.position; cam = K.fit([[DOG[0] - 1.8, 0, DOG[1] - 1], [DOG[0] + 1.8, 3.4, DOG[1] + 1], ...body(DOG[0] - 0.3, DOG[1] - 1.3), [hq.x, hq.y, hq.z], [hq.x, hq.y + 1, hq.z]], { yaw: lerp(35, 25, u), pitch: 10, fov: 44, margin: 0.85, maxDist: 13 }); cam.fov *= K.punch(f, F.STAND, 0.1, 6);
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    void CP;
    // ---------- effects + graphics ----------
    if (f >= F.SECOND - 4 && f < F.SECOND + 12) K.sparks(f, F.SECOND - 4, F.SECOND + 12, CAR.localToWorld(new THREE.Vector3(0, 1.0, 1.2)).toArray(), { dir: [0, 1, 0], spread: 1.2, rate: 20, speed: 4, life: 14, color: '#ffd23a', seed: 5 });
    if (f >= F.FLIPPED - 2 && f < F.FLIPPED + 10) K.sparks(f, F.FLIPPED - 2, F.FLIPPED + 10, CAR.localToWorld(new THREE.Vector3(0.8, 1.45, -1.45)).toArray(), { dir: [0, 1, 0], spread: 1.0, rate: 16, speed: 3, life: 12, color: '#ffd23a', seed: 7 });
    if (f >= F.LANDED && f < F.LANDED + 30) { K.puff(f, F.LANDED + 2, HAY[0], HAY[1] - 1.0, 14, 1.2, '#e8c860'); K.sparks(f, F.LANDED, F.LANDED + 30, [HAY[0], 1.5, HAY[1] - 1], { dir: [0, 1, -0.3], spread: 1.6, rate: 24, speed: 6, life: 26, color: '#f2d070', seed: 11 }); }
    if ((f >= 236 && f < 442) && f % 6 === 0) K.puff(f, f, c.x, c.z, 4, 0.5, '#c8c8c8');
    if (f >= 236 && f < 442) K.puff(f, f - 3, c.x - Math.sin(c.yaw) * 1.5, c.z - Math.cos(c.yaw) * 1.5, 5, 0.6, '#d8d8d8');
    if (f >= 1032 && f < 1117) K.sparks(f, 1032, 1117, () => CAR.localToWorld(new THREE.Vector3(0, 0.05, -2.0)).toArray(), { dir: [0, 0.3, -1], spread: 0.5, rate: 10, speed: 4, life: 10, color: '#ffb040', seed: 13 });
    K.mist(f, 814, 16); K.mist(f, 1022, 16);
    if (f >= 236 && f < 744) K.hud(f, 236, { stages: 2, labels: ['LAP 1', 'LAP 2'], u: f < 524 ? 0.25 + 0.2 * clamp((f - 236) / 200, 0, 1) : 0.6 + 0.39 * clamp((f - 524) / 200, 0, 1), f1: 740 });
    const BY = f >= 236 && f < 744 ? 0.25 : 0.2;
    K.badge(f, F.FLEW, 'WING: UPSIDE UP', { sx: 0.5, sy: 0.2 }, { icon: 'down', f1: 108 });
    K.badge(f, F.WHY, 'WHY UPSIDE DOWN?', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 230 });
    K.badge(f, F.LIGHT, '1 WING UP', { sx: 0.5, sy: BY }, { icon: 'x', f1: 436 });
    K.badge(f, F.SECOND, '2 WINGS UP', { sx: 0.5, sy: BY }, { icon: 'x', f1: 630 });
    K.badge(f, F.FORTY, '40 ROWS', { sx: 0.5, sy: BY }, { icon: 'down', f1: 742 });
    K.badge(f, F.PULL, 'PLANE WING = LIFT', { sx: 0.5, sy: 0.2 }, { icon: 'down', f1: 926 });
    K.badge(f, F.PUSHES, 'UPSIDE DOWN = DOWNFORCE', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: 1026 });
    K.badge(f, F.GRIP, 'MORE GRIP', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1114 });
    K.badge(f, F.BACK, 'WINGS FIXED', { sx: 0.5, sy: 0.2 }, { style: 'stamp', size: 1.1, f1: 1212 });
    const L = K.light('golden', { az: 200, el: 34, shadowExt: 34, exposure: 1.2 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
