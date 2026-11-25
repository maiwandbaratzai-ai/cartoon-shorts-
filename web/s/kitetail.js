// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Kites Have Tails" — invented story, engine: The Bet (SCRIPTS.md §000).
// Rolf ("Tails are for dogs!") bets Bea one cheese sandwich and two pickles that his kite needs no tail. Bea's kite has nine
// ribbons, which Pretzel the goat wants to eat. Rolf's kite spins like a washing machine into the duck pond; a bigger sail spins
// so hard it lifts Rolf off his boots and wraps him to Pretzel. Bea's kite sits calm for forty minutes. Explainer: wind drags the
// tail back, the nose points into the wind (like feathers on an arrow); no tail, every gust spins it. Bea wins the pickles, Pretzel
// eats her tail, and now she's tied to the goat too.
import { TOTAL, LINES, wf } from './kitetail_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const RX = -1.5, RZ = 0.4, BX = 1.7, BZ = 0.0;        // Rolf and Bea's spots on Gusty Hill
const PX = -6.5, PZ = -5.0;                           // duck pond
const EX = 16, EY = 9.5, EZ = -3;                     // explainer spot (against the sky)
let THREE, F = {}, ROLF, BEA, GOAT, DUCKS = [], KR, KB, KBIG, RIBB = [], STR_R = [], STR_B = [], RINGS = [], BOOTS, HKITE, HTAIL, WIND = [], ARROW, SPINK, JAR, LUNCH, SPLASH = [];

function kite(K, parent, c1, c2, s = 1) {        // a diamond kite: glossy panels, spars, a bow at the nose
  const g = new THREE.Group(); parent.add(g); const k = new THREE.Group(); g.add(k); k.scale.setScalar(s);
  const tri = (a, b, c, col) => { const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c], 3)); geo.computeVertexNormals(); const m = new THREE.Mesh(geo, K.paint(col, { rough: 0.35 })); m.material.side = THREE.DoubleSide; m.castShadow = true; k.add(m); };
  const T = [0, 0.75, 0], B = [0, -1.15, 0], L = [-0.6, 0.15, 0], R = [0.6, 0.15, 0], C = [0, 0.15, 0.0];
  tri(T, L, C, c1); tri(T, C, R, c2); tri(C, L, B, c2); tri(C, B, R, c1);
  const sp = K.paint('#5a3a22', { rough: 0.6, coat: 0 }); const v = K.cyl(0.018, 0.018, 1.9, sp, 0, -1.15, 0.02, k, 6); const h = K.cyl(0.018, 0.018, 1.2, sp, 0, 0, 0.02, k, 6); h.rotation.z = Math.PI / 2; h.position.set(0, 0.15, 0.02);
  for (const sx of [-1, 1]) { const b = K.cyl(0.0, 0.07, 0.16, K.paint('#f2c230'), 0, 0, 0, k, 8); b.rotation.z = sx * Math.PI / 2; b.position.set(sx * 0.08, 0.75, 0.03); }
  const ed = K.gold(); for (const [a, b] of [[T, L], [T, R], [L, B], [R, B]]) { const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy); const e = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, len, 6), ed); e.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0.01); e.rotation.z = Math.atan2(-dx, dy); k.add(e); }
  return g; }
function seg(K, mat, r = 0.012) { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 6), mat); m.userData.ndSkip = false; K.scene.add(m); return m; }
const _a = { v: null };
function setSeg(m, a, b) { const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2], L = Math.hypot(dx, dy, dz); m.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2); m.scale.set(1, L, 1);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dx / L, dy / L, dz / L)); }
function stringTo(list, a, b, sag, vis) { const n = list.length; for (let i = 0; i < n; i++) { const p = (t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t) - sag * Math.sin(Math.PI * t), lerp(a[2], b[2], t)]; setSeg(list[i], p(i / n), p((i + 1) / n)); list[i].visible = vis; } }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { LOOP: wf(0, 'looped'), TIED: wf(0, 'tied'), GOAT: wf(0, 'goat'), BET: wf(1, 'bet'), TAIL: wf(1, 'tail'), DOGS: wf(1, 'for') + 6, WHY: wf(1, 'why'), LOSER: wf(2, 'loser'), CHEESE: wf(2, 'cheese'), PICK: wf(2, 'pickles'),
      NINE: wf(3, 'nine'), RIBB: wf(3, 'ribbons'), PRETZEL: wf(3, 'pretzel'), EAT: wf(3, 'eat'), UP: wf(4, 'up'), SPUN: wf(4, 'spun'), WASH: wf(4, 'washing'), DOVE: wf(4, 'dove'), POND: wf(4, 'pond'),
      GAVE: wf(5, 'gave'), BIGGER: wf(5, 'bigger'), DOGS2: wf(5, 'for') + 6, SPUN2: wf(6, 'spun'), LIFTED: wf(6, 'lifted'), BOOTS: wf(6, 'boots'), WRAP: wf(6, 'wrapped'), PRETZ2: wf(6, 'pretzel'),
      MEAN: wf(7, 'meanwhile'), FORTY: wf(7, 'forty'), CALM: wf(7, 'calm'), CLOUD: wf(7, 'cloud'), WHAT: wf(8, 'what'), WIND: wf(9, 'wind'), DRAGS: wf(9, 'drags'), BACK: wf(9, 'backward'), NOSE: wf(9, 'nose'), POINTS: wf(9, 'points'),
      FEATH: wf(10, 'feathers'), ARROW: wf(10, 'arrow'), NO: wf(10, 'no'), GUST: wf(10, 'gust'), SPINS: wf(10, 'spins'), WON: wf(11, 'won'), PICK2: wf(11, 'pickles'), ATE: wf(11, 'ate'), TAIL2: wf(11, 'tail'), TIED2: wf(12, 'tied'), GOAT2: wf(12, 'goat') };
    // ================= Gusty Hill =================
    const G = K.group();
    K.slab(-120, 120, -0.3, 0, -120, 60, K.mat('grime', '#78b04a', { amt: 0.55, detail: 1.2 }), G, false);
    for (const [x, z, r, sy, c] of [[-40, -70, 40, 0.35, '#6aa040'], [10, -90, 55, 0.3, '#5e9a3e'], [60, -75, 45, 0.4, '#70a848'], [-80, -40, 35, 0.3, '#64a044']]) K.sphere(r, K.mat('grime', c, { amt: 0.5, detail: 3 }), x, -r * sy * 0.3, z, G, 1, sy, 1);
    // pond with reeds and lily pads
    K.cyl(3.3, 3.3, 0.03, K.paint('#2a7ab0', { rough: 0.08 }), PX, 0.0, PZ, G, 40); K.cyl(3.55, 3.6, 0.025, K.mat('dirt', '#8a7a5a'), PX, -0.005, PZ, G, 40);
    for (let k = 0; k < 18; k++) { const a = k / 18 * 6.28, r = 3.3 + 0.15 * hash(k); K.cyl(0.02, 0.03, 0.7 + 0.5 * hash(k + 3), K.mat('grime', '#4a7a2a'), PX + Math.cos(a) * r, 0, PZ + Math.sin(a) * r, G, 5); if (k % 3 === 0) K.cyl(0.05, 0.05, 0.18, K.paint('#6a3a1a'), PX + Math.cos(a) * r, 0.75 + 0.5 * hash(k + 3), PZ + Math.sin(a) * r, G, 8); }
    for (let k = 0; k < 6; k++) K.cyl(0.28, 0.28, 0.012, K.paint('#4a9a3a', { rough: 0.5 }), PX - 2 + hash(k + 50) * 4, 0.03, PZ - 1.5 + hash(k + 51) * 3, G, 14);
    // fence, hay bales, rocks, flowers, trees
    for (let x = -14; x <= 14; x += 2) { K.rbox(0.12, 1.1, 0.12, 0.03, K.mat('wood', '#8a6a44'), x, 0.55, -10, G); }
    for (const y of [0.45, 0.9]) K.rbox(28.2, 0.08, 0.06, 0.02, K.mat('wood', '#a8845a'), 0, y, -10, G);
    for (const [x, z] of [[7, -6], [8.2, -6.4], [7.6, -5.2]]) { const h = K.cyl(0.6, 0.6, 1.0, K.mat('fabric', '#e8c060', { detail: 0.2 }), x, 0.6, z, G, 20); h.rotation.z = Math.PI / 2; h.position.set(x, 0.6, z); }
    for (let k = 0; k < 14; k++) K.sphere(0.2 + hash(k + 70) * 0.35, K.mat('rock', '#9a968e'), -12 + hash(k + 71) * 24, 0.05, -9 + hash(k + 72) * 14 - (Math.abs(-12 + hash(k + 71) * 24) < 4 ? 6 : 0), G, 1, 0.6, 1);
    for (let k = 0; k < 160; k++) { const x = -14 + hash(k + 100) * 28, z = -9 + hash(k + 101) * 16; if (Math.hypot(x - PX, z - PZ) < 3.8) continue; K.sphere(0.06, K.paint(['#f2c230', '#f4f2ee', '#e86a9a', '#8a6ae8'][k % 4], { coat: 0, rough: 0.6 }), x, 0.08, z, G); K.cyl(0.008, 0.008, 0.08, K.paint('#3a7a2a'), x, 0, z, G, 4); }
    for (const [x, z, h] of [[-11, -7, 5], [10, -8, 4.5], [-13, 2, 4.2], [12, 1, 4.8], [-4, -12, 5.5], [4, -13, 5]]) { const t = S.tree({ h, seed: x * 3 + z }); t.position.set(x, 0, z); }
    // windmill far away + a windsock + the kite-day sign
    const wm = new THREE.Group(); wm.position.set(-26, 0, -44); G.add(wm); K.cyl(1.6, 2.4, 9, K.mat('plaster', '#f2ece2'), 0, 0, 0, wm, 16); K.cyl(0, 2.0, 2.2, K.mat('wood', '#7a3a2a'), 0, 9, 0, wm, 16);
    const ws = new THREE.Group(); ws.position.set(4.6, 0, -2.6); G.add(ws); K.cyl(0.05, 0.05, 3.2, K.chrome(), 0, 0, 0, ws, 8);
    for (let k = 0; k < 4; k++) { const c = K.cyl(0.24 - k * 0.04, 0.2 - k * 0.04, 0.35, K.paint(k % 2 ? '#f4f2ee' : '#e0501a'), 0, 0, 0, ws, 14); c.rotation.x = -Math.PI / 2 + 0.25; c.position.set(0, 3.05 - k * 0.09, -0.2 - k * 0.34); }
    const sg = S.board('GUSTY HILL|KITE DAY', 2.0, 1.1, { frame: '#e0501a' }); sg.position.set(-4.2, 0, 1.2); sg.rotation.y = 0.5;
    const rule = S.board('NO KITES|IN THE POND', 1.4, 0.8, { frame: '#2a62c8' }); rule.position.set(PX + 3.6, 0, PZ + 2.2); rule.rotation.y = 0.2; rule.scale.setScalar(0.85);
    // picnic blanket + lunch (the bet)
    const bl = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.7), S.textMat(' ', { bg: '#c0392b', w: 64, h: 64, border: false })); bl.rotation.x = -Math.PI / 2; bl.position.set(0.4, 0.02, 1.8); G.add(bl);
    for (let k = 0; k < 6; k++) { K.slab(0.4 - 1.1 + k * 0.38, 0.4 - 1.1 + k * 0.38 + 0.16, 0.021, 0.026, 0.95, 2.65, K.paint('#f4f2ee', { coat: 0, rough: 0.9 }), G, false); K.slab(-0.7, 1.5, 0.022, 0.027, 0.95 + k * 0.3, 0.95 + k * 0.3 + 0.13, K.paint('#f4f2ee', { coat: 0, rough: 0.9 }), G, false); }
    K.rbox(0.6, 0.35, 0.4, 0.05, K.mat('wood', '#b8844a', { detail: 0.2 }), 1.2, 0.2, 2.2, G); const hd = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.03, 8, 20, Math.PI), K.mat('wood', '#8a5a34')); hd.position.set(1.2, 0.37, 2.2); G.add(hd);
    S.bake(G);
    LUNCH = new THREE.Group(); LUNCH.position.set(0.2, 0.03, 1.9); sc.add(LUNCH);
    K.rbox(0.36, 0.06, 0.3, 0.03, K.mat('grime', '#e8c48a', { detail: 0.1 }), 0, 0.03, 0, LUNCH); K.rbox(0.38, 0.03, 0.32, 0.01, K.paint('#f2c230', { rough: 0.5 }), 0, 0.075, 0, LUNCH); K.rbox(0.36, 0.06, 0.3, 0.03, K.mat('grime', '#e8c48a', { detail: 0.1 }), 0, 0.12, 0, LUNCH);
    K.cyl(0.2, 0.2, 0.01, K.paint('#f4f2ee'), 0, -0.005, 0, LUNCH, 24);
    JAR = new THREE.Group(); JAR.position.set(0.7, 0.03, 1.7); sc.add(JAR);
    K.cyl(0.13, 0.13, 0.34, K.glass({ color: '#d8ffd0', opacity: 0.4 }), 0, 0, 0, JAR, 20); K.cyl(0.135, 0.135, 0.06, K.gold(), 0, 0.34, 0, JAR, 20);
    for (let k = 0; k < 2; k++) { const p = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.16, 6, 12), K.paint('#5a8a2a', { rough: 0.6 })); p.position.set(-0.04 + k * 0.08, 0.15, 0); p.rotation.z = (k - 0.5) * 0.3; JAR.add(p); }
    const jl = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.1), S.textMat('PICKLES', { bg: '#f4efe4', fg: '#2a7a2a', w: 256, h: 110 })); jl.position.set(0, 0.17, 0.135); JAR.add(jl);
    // ================= kites + strings + ribbons =================
    KR = kite(K, sc, '#c0392b', '#f4f2ee', 0.9); KB = kite(K, sc, '#f2c230', '#2a62c8', 0.85); KBIG = kite(K, sc, '#c0392b', '#f4f2ee', 1.7);
    const strM = K.paint('#f4f2ee', { coat: 0, rough: 0.7 }), tailM = K.paint('#2a2a2a', { coat: 0 });
    for (let k = 0; k < 8; k++) { STR_R.push(seg(K, strM)); STR_B.push(seg(K, strM)); }
    for (let k = 0; k < 9; k++) { const g = new THREE.Group(); sc.add(g); const col = ['#e0501a', '#f2c230', '#2a9a6a', '#2a62c8', '#e86a9a', '#8a6ae8', '#e0501a', '#f2c230', '#2a9a6a'][k];
      for (const sx of [-1, 1]) { const c = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.24, 4), K.paint(col, { rough: 0.4 })); c.rotation.z = sx * Math.PI / 2; c.position.x = sx * 0.11; c.scale.z = 0.3; c.castShadow = true; g.add(c); }
      const s = seg(K, strM, 0.008); RIBB.push({ g, s }); }
    for (let k = 0; k < 9; k++) { const r = new THREE.Mesh(new THREE.TorusGeometry(1, 0.03, 6, 40), K.paint('#f4f2ee', { coat: 0, rough: 0.6 })); r.rotation.x = Math.PI / 2; r.castShadow = true; sc.add(r); RINGS.push(r); }
    BOOTS = new THREE.Group(); sc.add(BOOTS); for (const sx of [-1, 1]) { K.rbox(0.13, 0.12, 0.26, 0.04, K.paint('#5a3a22', { rough: 0.5 }), sx * 0.11, 0.06, 0.03, BOOTS); K.rbox(0.12, 0.18, 0.12, 0.03, K.paint('#5a3a22', { rough: 0.5 }), sx * 0.11, 0.18, -0.05, BOOTS); }
    for (let k = 0; k < 10; k++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), K.paint('#bfe4ff', { rough: 0.1 })); sc.add(d); SPLASH.push(d); }
    // ================= explainer (holo kite in the wind, arrow, tail-less spinner) =================
    HKITE = new THREE.Group(); HKITE.position.set(EX, EY, EZ); sc.add(HKITE);
    kite(K, HKITE, '#f2c230', '#2a62c8', 1.6);
    HTAIL = K.trace(Array.from({ length: 12 }, (_, k) => [EX + 0.15 * Math.sin(k * 0.9), EY - 1.5 - k * 0.22, EZ - k * 0.28]), { color: '#ff8a30', r: 0.06 });
    for (let k = 0; k < 6; k++) { const y = EY - 2 + k * 0.85; WIND.push(K.trace([[EX - 1.4 + (k % 2) * 2.8, y, EZ + 4], [EX - 1.4 + (k % 2) * 2.8, y + 0.1, EZ + 1.5], [EX - 1.4 + (k % 2) * 2.8, y, EZ - 1.5]], { color: '#bfe8ff', r: 0.012, glow: 1.6 })); }
    ARROW = new THREE.Group(); sc.add(ARROW); K.cyl(0.035, 0.035, 2.4, K.mat('wood', '#c8945a'), 0, -1.2, 0, ARROW, 8); const tip = K.cyl(0, 0.1, 0.28, K.chrome(), 0, 1.2, 0, ARROW, 8); tip.rotation.x = Math.PI; tip.position.y = 1.48;
    for (let k = 0; k < 3; k++) { const fth = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.42), K.paint('#e0501a', { rough: 0.5 })); fth.material.side = THREE.DoubleSide; fth.position.set(Math.cos(k * 2.1) * 0.1, -1.0, Math.sin(k * 2.1) * 0.1); fth.rotation.y = -k * 2.1; ARROW.add(fth); }
    ARROW.scale.setScalar(1.4);
    ARROW.rotation.x = -Math.PI / 2;
    SPINK = kite(K, sc, '#c0392b', '#f4f2ee', 1.3);
    // ================= characters =================
    ROLF = K.stick({ jacket: '#e0501a', pants: '#2a3a5a', hat: 'cap', hatColor: '#2a3a5a', hairStyle: 'spiky', hair: '#8a5a34', scarf: '#f2c230', belt: '#3a2418', boots: '#5a3a22', gloves: '#2a3a5a' }, { key: 'rolf' });
    BEA = K.stick({ jacket: '#2a62c8', pants: '#f2e2c0', hairStyle: 'ponytail', hair: '#3a2418', glasses: true, vest: '#f2c230', scarf: '#e86a9a', boots: '#7a3a2a' }, { key: 'bea' });
    GOAT = K.animal('sheep', { fluffy: false, horns: true, color: '#8a5a3a', face: '#f2ece2', nose: '#4a3a30', seed: 6, scale: 1.05 });
    for (let k = 0; k < 3; k++) DUCKS.push(K.animal('duck', { seed: 20 + k, scale: 1.3 }));
    K.addClouds(10, 700, 160);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s), t = f / 30;
    const ex = f >= 930 && f < 1182;
    // ---------- where people are ----------
    const tied = f < 97 || f >= F.WRAP;                                  // Rolf + Pretzel bundled together
    const lift = f >= F.LIFTED - 4 && f < F.WRAP + 6 ? sm(F.LIFTED - 4, F.LIFTED + 10, f) * (1 - sm(F.WRAP - 4, F.WRAP + 8, f)) * 1.3 : 0;
    let rp = { x: RX, z: RZ, yaw: -0.3 }, gp = { x: BX + 1.0, z: BZ + 0.9, yaw: -0.6, mode: 'stand', expr: 'neutral' };
    if (tied) { rp = { x: RX, z: RZ, yaw: 0.2 }; gp = { x: RX + 0.62, z: RZ + 0.18, yaw: 0.2, mode: 'stand', expr: 'sad' }; }
    if (f >= 590 && f < F.WRAP) rp = { x: RX + 0.4, z: RZ, yaw: -0.1 };
    if (f >= F.LIFTED - 4 && f < F.WRAP) gp = { x: RX + 0.5 + 0.6 * (1 - sm(F.BOOTS, F.WRAP, f)), z: RZ + 0.5, yaw: -0.4, mode: 'run', expr: 'shock' };
    let bp = { x: BX, z: BZ, yaw: -0.2 };
    if (f >= 785 && f < 930) bp = { x: 0.9, z: 1.5, yaw: -0.3 };   // sitting on the blanket
    let bwalk = null; if (f >= 1182) { const W = K.walkPath(f, 1186, [[BX, BZ], [RX + 1.25, RZ + 0.75]], 1.4); bp = { x: W.x, z: W.z, yaw: W.moving ? W.yaw : -1.2 }; bwalk = W.moving; }
    // ---------- kites ----------
    const hand = (p, sx = 1) => [p.x + sx * 0.3 * Math.cos(p.yaw || 0), 1.3 + (p === rp ? lift : 0), p.z - sx * 0.3 * Math.sin(p.yaw || 0)];
    // Bea's kite: calm, nose into the wind, tail streaming back
    let kb = [bp.x + 1.2, 7.4 + 0.25 * Math.sin(t * 0.7), bp.z - 7]; let kbSpin = 0;
    if (f < 249) kb = [BX + 0.35, 1.2, BZ + 0.2];                   // held in hand during the bet
    if (f >= 1182) kb = [bp.x + 1.0, lerp(7.4, 4.6, sm(1190, F.ATE, f)), bp.z - 4.5];
    if (f >= F.TIED2 - 20) { kbSpin = (f - F.TIED2 + 20) * 0.35; kb = [bp.x + 0.8 + 1.2 * Math.cos(kbSpin), 4.2 + 1.2 * Math.sin(kbSpin), bp.z - 3]; }
    KB.position.set(...kb); KB.rotation.set(f < 249 ? 0 : -0.5, f < 249 ? -0.3 : 0, f < 249 ? 0.1 : 0.06 * Math.sin(t * 1.3) + kbSpin * 3);
    KB.visible = !ex;
    // the tail: nine ribbons hanging back and down from the kite, waving
    const tailOn = (k) => !(f >= F.ATE - 2 && k >= 8 - Math.floor((f - F.ATE + 2) / 2));
    let prev = null; RIBB.forEach((r, k) => { const s = k + 1; let p;
      if (f < 249) p = [kb[0] + 0.08 * Math.sin(k), kb[1] - 0.5 - s * 0.1, kb[2] + 0.1];
      else p = [kb[0] + 0.25 * Math.sin(t * 3 + k * 0.7) * (s / 9), kb[1] - 1.0 - s * 0.38, kb[2] - s * 0.35 + 0.15 * Math.sin(t * 2.5 + k)];
      if (f >= F.TIED2 - 20) p = [kb[0], kb[1] - 1.0 - s * 0.3, kb[2]];
      r.g.position.set(...p); r.g.rotation.set(0, 0, 0.4 * Math.sin(t * 4 + k)); const on = tailOn(k) && !ex && f < F.TIED2 - 20; r.g.visible = on;
      const a = prev || [kb[0], kb[1] - 1.0, kb[2]]; setSeg(r.s, a, p); r.s.visible = on; prev = p; });
    // Rolf's kite: held (bet), up + spin + dive into the pond (sail 1); big sail spins and loops (sail 2)
    let kr = [RX - 0.35, 1.2, RZ + 0.2], krRot = [0, 0.3, -0.1], krVis = f >= 97 && f < 590 && !ex;
    if (f >= 462 && f < 590) { const up = sm(462, F.UP + 6, f); kr = [lerp(RX, RX - 1.5, up), lerp(1.2, 6.5, up), lerp(RZ, RZ - 4.5, up)]; krRot = [-0.4, 0, (f - 470) * 0.5 * sm(F.SPUN - 6, F.SPUN + 4, f)];
      if (f >= F.DOVE - 4) { const d = sm(F.DOVE - 4, F.POND, f); kr = [lerp(RX - 1.5, PX + 0.5, d), lerp(6.5, 0.05, d), lerp(RZ - 4.5, PZ, d)]; krRot = [-0.4 - 1.1 * d, 0, (f - 470) * 0.5]; }
      if (f >= F.POND) { kr = [PX + 0.5, 0.06, PZ]; krRot = [-Math.PI / 2 + 0.1, 0, 0.4]; } }
    KR.position.set(...kr); KR.rotation.set(...krRot); KR.visible = krVis;
    let kg = [RX + 0.6, 0.15, RZ + 0.9], kgRot = [-Math.PI / 2, 0, 0.3], kgVis = f >= 584 && !ex && f < 1182 || (f < 97 && !ex) || f >= 1182;
    if (f >= 630 || f < 97 || f >= 1182) { const s = f < 97 ? 1 : sm(630, 690, f); const ang = (f < 97 ? f : f - 640) * (f < 97 || f >= F.WRAP ? 0.3 : 0.22) * s;
      kg = [lerp(RX + 0.6, RX + 0.3 + 2.0 * Math.cos(ang), s), lerp(0.15, 6.2 + 1.6 * Math.sin(ang), s), lerp(RZ + 0.9, RZ - 3.5, s)]; kgRot = [lerp(-Math.PI / 2, -0.3, s), 0, ang * 2.5]; }
    if (f >= 785 && f < 1182) { kg = [RX + 0.4, 0.12, RZ + 1.0]; kgRot = [-Math.PI / 2, 0, 2.4]; }
    KBIG.position.set(...kg); KBIG.rotation.set(...kgRot); KBIG.visible = kgVis && !ex;
    // strings
    stringTo(STR_B, hand(bp, 1), [kb[0], kb[1] - 0.2, kb[2]], f < 249 ? 0 : 0.6, f >= 249 && !ex);
    const rHolding = (f >= 462 && f < F.POND + 10) ? [kr[0], kr[1], kr[2]] : (KBIG.visible && kg[1] > 0.5 ? [kg[0], kg[1], kg[2]] : null);
    stringTo(STR_R, hand(rp, -1), rHolding || [0, 0, 0], 0.5, !!rHolding && !ex);
    // the rings of string tying Rolf + Pretzel (and finally Bea)
    const nR = f < 97 ? 9 : f >= F.WRAP - 6 ? Math.min(9, Math.floor((f - F.WRAP + 6) / 2)) : 0;
    const nB = f >= F.TIED2 - 6 ? Math.min(5, Math.floor((f - F.TIED2 + 6) / 3)) : 0;
    RINGS.forEach((r, k) => { const both = k >= 9 - nB; r.visible = !ex && (k < nR); const cx = both ? (RX + 0.62 + bp.x) / 2 - 0.2 : RX + 0.3, cz = both ? RZ + 0.35 : RZ + 0.1;
      r.position.set(cx, 0.3 + k * 0.1, cz); r.scale.set(both ? 1.6 : 0.75, both ? 0.7 : 0.45, 1); r.rotation.set(Math.PI / 2 + 0.06 * Math.sin(k), 0, 0.1 * Math.sin(k * 2)); });
    BOOTS.visible = f >= F.LIFTED - 2 && !ex; BOOTS.position.set(RX + 0.4, 0, RZ); BOOTS.rotation.y = -0.1;
    // splash in the pond
    SPLASH.forEach((d, k) => { const u = (f - F.POND) / 20; d.visible = u > 0 && u < 1; const a = k / 10 * 6.28; d.position.set(PX + 0.5 + Math.cos(a) * u * 1.2, 0.1 + 2.2 * u * (1 - u), PZ + Math.sin(a) * u * 1.2); d.scale.setScalar(1 - u * 0.6); });
    // lunch + jar (the jar goes to Bea at the end)
    JAR.position.set(0.7, 0.03, 1.7); if (f >= F.WON) { const h = hand(bp, 1); JAR.position.set(h[0], h[1] - 0.2, h[2] + 0.1); }
    // ---------- explainer ----------
    HKITE.visible = ex && f < 1062; HKITE.rotation.set(-0.35, lerp(0.9, 0, sm(F.NOSE - 10, F.POINTS + 6, f)), 0.04 * Math.sin(t * 2));
    HTAIL.show(ex && f < 1062 ? sm(F.DRAGS - 6, F.BACK + 8, f) : 0);
    WIND.forEach((w, k) => w.show(ex && f < 1182 ? sm(F.WIND - 6 + k * 2, F.WIND + 14 + k * 2, f) : 0));
    ARROW.visible = ex && f >= 1062 && f < 1126; ARROW.position.set(EX, EY + 0.2, lerp(EZ + 6, EZ - 5, clamp((f - 1068) / 50, 0, 1)));
    SPINK.visible = ex && f >= 1126; SPINK.position.set(EX - 0.3 + 0.6 * Math.sin(f * 0.4), EY + 0.3 * Math.cos(f * 0.5), EZ + 0.5); SPINK.rotation.set(-0.3 + 0.5 * Math.sin(f * 0.3), 0.6 * Math.sin(f * 0.21), (f - 1126) * 0.35 * sm(F.GUST - 4, F.GUST + 6, f));
    // ---------- characters ----------
    const rk = [[0, 'panic', { expr: 'dazed' }], [97, 'show', { expr: 'smug', item: null }], [F.TAIL, 'point', { expr: 'smug', talk: true }], [F.DOGS - 6, 'cheer', { expr: 'laugh', talk: true }], [F.WHY, 'hips', { expr: 'smug' }],
      [249, 'grab', { expr: 'grin' }], [F.PICK, 'hips', { expr: 'smug' }], [340, 'cross', { expr: 'deadpan' }], [462, 'cheer', { expr: 'excited' }], [F.SPUN, 'reach', { expr: 'nervous' }], [F.DOVE, 'panic', { expr: 'scared' }], [F.POND + 4, 'facepalm', { expr: 'pained' }],
      [590, 'hammer', { expr: 'stern', R: [0.3, 0.3, 'hammer'] }], [630, 'show', { expr: 'proud' }], [F.DOGS2 - 6, 'pointUp', { expr: 'yell', talk: true }], [678, 'reach', { expr: 'shock' }], [F.LIFTED, 'panic', { expr: 'scared' }],
      [F.WRAP + 4, 'cross', { expr: 'dazed' }], [785, 'cross', { expr: 'sad' }], [F.CALM, 'idle', { expr: 'sleepy' }], [896, 'shrug', { expr: 'confused', sweat: true }], [1182, 'show', { expr: 'sad', R: [0.3, 0.2, null] }], [F.TIED2, 'cheer', { expr: 'laugh' }]];
    const RA = T.act(f, rk, { seed: 3, blink: blink(3) }); if (tied || (f >= F.LIFTED && f < F.WRAP)) { RA.opts.L = [0.05, 0.55]; RA.opts.R = RA.opts.R || [0.05, 0.55]; }
    ROLF.set(RA, { ...rp, y: lift, visible: !ex });
    const bk = [[0, 'idle', { expr: 'neutral' }], [97, 'hold', { expr: 'smile' }], [F.DOGS - 4, 'cross', { expr: 'deadpan' }], [249, 'grab', { expr: 'smile' }], [F.PICK, 'point', { expr: 'grin' }], [340, 'cheer', { expr: 'proud' }],
      [F.RIBB, 'hold', { expr: 'smile' }], [F.EAT, 'stop', { expr: 'stern' }], [462, 'hold', { expr: 'smile' }], [F.POND, 'cheer', { expr: 'laugh' }], [590, 'hold', { expr: 'deadpan' }], [F.WRAP, 'facepalm', { expr: 'confused' }],
      [785, 'sit', { expr: 'smile', R: [0.3, -0.5, null] }], [F.CALM, 'sit', { expr: 'sleepy' }], [1182, 'walk', { expr: 'grin' }], [F.WON, 'celebrate', { expr: 'laugh' }], [F.ATE, 'shock', { expr: 'shock' }], [F.TIED2, 'panic', { expr: 'scared', sweat: true }]];
    const BA = T.act(f, bk, { seed: 5, blink: blink(5), phase: (f / 18) % 1 }); if (f >= 785 && f < 930) BA.opts.mode = 'sit'; if (bwalk) BA.opts.mode = 'walk';
    BEA.set(BA, { ...bp, visible: !ex, seat: 0.05 });
    // Pretzel the goat: wants the ribbons
    if (f >= 340 && f < 462) gp = { x: BX + 0.9, z: BZ + 0.6, yaw: -0.5, mode: f >= F.EAT ? (f % 16 < 8 ? 'jump' : 'stand') : 'stand', expr: f >= F.PRETZEL ? 'happy' : 'neutral', nod: -0.5 };
    if (f >= 48 && f < 97) gp = { ...gp, mode: 'eat', expr: 'sad' };
    if (f >= 1182 && f < F.TIED2) gp = { ...gp, mode: f >= F.ATE - 8 && f < F.ATE + 14 ? 'jump' : 'eat', expr: 'happy', nod: -0.4 };
    if (f >= F.TIED2) gp = { ...gp, mode: 'stand', expr: 'happy' };
    if (ex) gp = { visible: false };
    GOAT.set(f, gp);
    DUCKS.forEach((d, k) => { const a = t * 0.3 + k * 2.1, scat = f >= F.POND ? sm(F.POND, F.POND + 30, f) : 0; d.set(f, { x: PX + Math.cos(a) * (1.4 + scat * 1.2), y: scat > 0 && scat < 1 ? 0.6 * Math.sin(scat * Math.PI) : 0, z: PZ + Math.sin(a) * (1.4 + scat * 1.2), yaw: a + Math.PI, mode: scat > 0 && scat < 1 ? 'jump' : 'walk', expr: f >= F.POND && f < F.POND + 40 ? 'shock' : 'happy', flap: scat > 0 && scat < 1 ? 1 : 0, visible: !ex }); });
    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const body = (x, z, y = 0, h = 2.1) => [[x, y, z], [x, y + h, z]];
    const R0 = [rp.x, rp.z], B0 = [bp.x, bp.z];
    if (sh(0, 48)) {                          // 1. the hook: Rolf tied to his goat, the kite still looping above (wide)
      cam = K.fit([...body(RX, RZ), [RX + 1, 0, RZ + 0.3], [kg[0], kg[1] + 1, kg[2]]], { yaw: 82, pitch: 6, fov: 42, margin: 0.95 }); cam.fov *= K.push(u, 0.05);
    } else if (sh(48, 97)) {                  // 2. Pretzel chewing the string (reaction)
      cam = { pos: [RX + 1.5, 1.6, RZ + 3.0], look: [RX + 0.5, 0.7, RZ + 0.1], fov: 40 * K.push(u, 0.08) }; dof = { focus: 2.5, cinf: 12 };
    } else if (sh(97, 165)) {                 // 3. the bet: Rolf's tail-less kite vs Bea's ribbons (wide)
      cam = K.fit([...body(RX, RZ), ...body(BX, BZ), [BX + 1.2, 0, BZ + 0.9]], { yaw: 90, pitch: 8, fov: 40, margin: 0.95, lift: 0.3 });
    } else if (sh(165, 245)) {                // 4. "Tails are for dogs!" (low wide, other side)
      cam = K.fit([...body(RX, RZ), ...body(BX, BZ), [-4.2, 0, 1.2]], { yaw: 60, pitch: 4, fov: 40, margin: 0.95, lift: 0.4 }); cam.fov *= K.punch(f, F.DOGS, 0.1, 6);
    } else if (sh(245, 295)) {                // 5. loser buys lunch: handshake over the blanket (wide)
      cam = K.fit([...body(RX, RZ), ...body(BX, BZ), [0.4, 0, 2.6]], { yaw: 100, pitch: 14, fov: 40, margin: 0.95 });
    } else if (sh(295, 334)) {                // 6. insert: one cheese sandwich and two pickles
      cam = { pos: [0.45, 0.75, 2.85], look: [0.45, 0.15, 1.8], fov: 40 * K.push(u, 0.1) }; dof = { focus: 1.2, cinf: 18 };
    } else if (sh(334, 400)) {                // 7. Bea's kite up, nine ribbons (looking up past Bea)
      cam = K.fit([...body(BX, BZ), [kb[0], kb[1] + 0.8, kb[2]], [kb[0], kb[1] - 4.6, kb[2] - 3]], { yaw: 75, pitch: 10, fov: 44, margin: 0.95 });
    } else if (sh(400, 462)) {                // 8. Pretzel jumps for the ribbons (wide)
      cam = K.fit([...body(BX, BZ), [gp.x, 0, gp.z], [kb[0], kb[1] - 4.0, kb[2] - 3]], { yaw: 110, pitch: 6, fov: 42, margin: 0.95 }); cam.fov *= K.punch(f, F.EAT, 0.08, 6);
    } else if (sh(462, 520)) {                // 9. Rolf's kite goes up and spins like a washing machine (wide, tracking up)
      cam = K.fit([...body(RX, RZ), [kr[0], kr[1] + 0.8, kr[2]], [PX + 2, 0, PZ + 2]], { yaw: 95, pitch: 8, fov: 44, margin: 0.95 }); cam.fov *= K.punch(f, F.WASH, 0.08, 6);
    } else if (sh(520, 590)) {                // 10. it dives into the duck pond (wide on the pond)
      cam = K.fit([[PX - 3, 0, PZ], [PX + 3, 0, PZ], [kr[0], Math.max(kr[1], 2.5), kr[2]], ...body(RX, RZ)], { yaw: 70, pitch: 14, fov: 44, margin: 0.95 }); cam.fov *= K.punch(f, F.POND, 0.12, 6); const s = K.shake(f, F.POND, 0.08, 12); cam.pos[0] += s[0]; cam.pos[1] += s[1];
    } else if (sh(590, 630)) {                // 11. a bigger sail (wide)
      cam = K.fit([...body(rp.x, rp.z), [RX + 0.6, 0, RZ + 1.9], [RX - 0.6, 0, RZ + 0.9], ...body(BX, BZ)], { yaw: 80, pitch: 12, fov: 40, margin: 0.95, lift: 0.2 });
    } else if (sh(630, 678)) {                // 12. "Tails are for dogs!" the big kite goes up (low wide)
      cam = K.fit([...body(rp.x, rp.z), [kg[0], kg[1] + 1.2, kg[2]]], { yaw: 100, pitch: 4, fov: 44, margin: 0.95 }); cam.fov *= K.punch(f, F.DOGS2, 0.1, 6);
    } else if (sh(678, 730)) {                // 13. it lifts Rolf off his boots (wide)
      cam = K.fit([...body(rp.x, rp.z, 0, 2.1 + lift), [RX + 0.4, 0, RZ], [kg[0], kg[1] + 1.2, kg[2]], [gp.x, 0, gp.z]], { yaw: 78, pitch: 6, fov: 44, margin: 0.95 }); cam.fov *= K.punch(f, F.LIFTED, 0.08, 6);
    } else if (sh(730, 785)) {                // 14. ...and wraps him to Pretzel (wide, rings)
      cam = K.fit([...body(RX, RZ), [RX + 1.0, 0, RZ + 0.4], [RX + 0.4, 0, RZ - 0.5]], { yaw: 110, pitch: 10, fov: 40, margin: 1.2 }); cam.fov *= K.punch(f, F.WRAP, 0.12, 6); const s = K.shake(f, F.WRAP, 0.05, 10); cam.pos[0] += s[0];
    } else if (sh(785, 848)) {                // 15. forty minutes: Bea's kite calm as a cloud (wide, Bea on the blanket)
      cam = K.fit([[0.9, 0, 1.5], [0.9, 1.4, 1.5], [kb[0], kb[1] + 0.8, kb[2]], ...body(RX, RZ)], { yaw: 70, pitch: 8, fov: 44, margin: 0.95 });
    } else if (sh(848, 896)) {                // 16. calm kite vs tied Rolf (high wide)
      cam = K.fit([[0.9, 0, 1.5], ...body(RX, RZ), [kb[0], kb[1], kb[2]]], { yaw: 120, pitch: 20, fov: 44, margin: 0.95 }); cam.fov *= K.punch(f, F.CLOUD, 0.06, 6);
    } else if (sh(896, 930)) {                // 17. Rolf, tied up, sweating: so what does the tail do? (reaction)
      cam = { pos: [RX + 0.6, 2.1, RZ + 2.5], look: [RX + 0.2, 1.4, RZ], fov: 40 * K.push(u, 0.08) }; dof = { focus: 2.6, cinf: 12 };
    } else if (sh(930, 998)) {                // 18. explainer: wind drags the tail back (holo kite, side view)
      cam = K.fit([[EX, EY + 1.4, EZ + 1.2], [EX, EY - 3.0, EZ - 2.5]], { yaw: 10, pitch: 0, fov: 42, margin: 0.75 });
    } else if (sh(998, 1062)) {               // 19. the nose points into the wind (front 3/4)
      cam = K.fit([[EX - 1, EY + 1.4, EZ], [EX + 1, EY - 2.5, EZ - 2]], { yaw: 50, pitch: 0, fov: 42, margin: 0.75 }); cam.fov *= K.punch(f, F.POINTS, 0.08, 6);
    } else if (sh(1062, 1126)) {              // 20. like the feathers on an arrow
      cam = K.fit([[EX, EY - 1.0, EZ + 1.5], [EX, EY + 1.4, EZ - 1.5]], { yaw: 15, pitch: 0, fov: 42, margin: 0.8 }); cam.fov *= K.punch(f, F.ARROW, 0.08, 6);
    } else if (sh(1126, 1182)) {              // 21. no tail: every gust spins it
      cam = K.fit([[EX - 1.2, EY - 1.4, EZ + 0.5], [EX + 1.2, EY + 1.4, EZ + 0.5]], { yaw: 30, pitch: 0, fov: 42, margin: 0.9 }); cam.fov *= K.punch(f, F.SPINS, 0.1, 6);
    } else if (sh(1182, 1252)) {              // 22. Bea wins the pickles; Pretzel eats her tail (wide)
      cam = K.fit([...body(RX, RZ), ...body(bp.x, bp.z), [kb[0], kb[1] + 0.6, kb[2]]], { yaw: 88, pitch: 6, fov: 44, margin: 0.95 }); cam.fov *= K.punch(f, F.ATE, 0.1, 6);
    } else {                                  // 23. now she's tied to the goat too (wide, echoes the opening)
      cam = K.fit([...body(RX, RZ), ...body(bp.x, bp.z), [kb[0], kb[1] + 1.2, kb[2]], [kg[0], kg[1], kg[2]]], { yaw: lerp(95, 85, u), pitch: 6, fov: 44, margin: 0.95 }); cam.fov *= K.punch(f, F.TIED2, 0.1, 6);
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    if (!ex) K.leaves(f, [cam.look[0], 1.5, cam.look[2]], { area: 10, count: 18, fall: 0.15, drift: [0, -2.5], colors: ['#6ab84a', '#f2c12e', '#e86a9a'] });
    if (f >= F.POND && f < F.POND + 24) K.puff(f, F.POND, PX + 0.5, PZ, 12, 0.9, '#e8f6ff');
    if (f >= F.BOOTS - 2 && f < F.BOOTS + 24) K.puff(f, F.BOOTS, RX + 0.4, RZ, 8, 0.5);
    K.mist(f, 790, 16); K.mist(f, 922, 16); K.mist(f, 1176, 14);
    K.badge(f, F.BET, 'THE BET', { sx: 0.5, sy: 0.2 }, { icon: 'coin', f1: 160 });
    K.badge(f, F.WHY, 'WHY THE TAIL?', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 243 });
    K.badge(f, F.CHEESE, 'LOSER BUYS LUNCH', { sx: 0.5, sy: 0.2 }, { icon: 'coin', f1: 332 });
    K.badge(f, F.NINE, '9 RIBBONS', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 460 });
    K.badge(f, F.SPUN, 'SAIL 1: SPLASH', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 588 });
    K.badge(f, F.BIGGER, 'SAIL 2: LIFT-OFF', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 783 });
    K.badge(f, F.FORTY, '40 MINUTES', { sx: 0.5, sy: 0.2 }, { icon: 'clock', f1: 894 });
    K.badge(f, F.DRAGS, 'TAIL = DRAG', { sx: 0.5, sy: 0.2 }, { icon: 'down', f1: 1060 });
    K.badge(f, F.NO, 'NO TAIL = SPIN', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 1180 });
    K.badge(f, F.WON, 'BEA WINS', { sx: 0.5, sy: 0.2 }, { style: 'stamp', size: 1.15, f1: 1250 });
    const L = K.light('golden', { az: 75, el: 34, shadowExt: 22, exposure: 1.3 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
