// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Train Wheels Are Cones" — invented story, engine: The Heist (SCRIPTS.md §000).
// Big Lou's gang ("Easy as pie!") swaps the Pie Express pie car's cone-shaped wheels for flat ones, so it will get stuck at Hairpin
// Bend. Fennel the fox only wants the one cherry pie he picked out a week ago. At the bend the pie car screeches, throws sparks,
// climbs the rail like a cat up a curtain, ignores the bend and rolls straight across Moo Meadow past three confused cows — and
// through Lou's own barn. Explainer (x-ray wheelset): each wheel is fatter on the inside; on a bend the axle slides out, the outer
// wheel rides its fat part, the inner its thin part, so the axle steers itself — like a paper cup rolling in a circle. Flat wheels only
// know straight. Fennel gets his pie; Lou gets the other forty-nine. "Easy as pie."
import { TOTAL, LINES, wf } from './conewheel_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const RB = 14, GA = 1.5;                       // bend radius, rail gauge
const BARN = 34;                               // barn front wall x (doorway faces -x)
const YARD = -40;                              // rail-yard siding where the wheels are swapped
const EX = [-15, -25];                          // explainer stage
const BOARD = [BARN - 1, -7];                  // plan board beside the barn
const COWS = [[9, 6], [15, 8.5], [21, 5.5]];
let THREE, F = {}, LOCO, PIECAR, LOU, TESS, FOX, COW = [], PIES = [], WS = {}, FLATW, CONEW, CUP, ARCS = [], RINGS = [], PLANKS = [], LOUPIES = [], FOXPIE, LOOSEW;

function trackAt(s) {   // centreline: straight along +x to the bend at the origin, then a left bend toward -z, then straight -z
  if (s <= 0) return { x: s, z: 0, yaw: Math.PI / 2 };
  const L = RB * Math.PI / 2; if (s >= L) return { x: RB, z: -RB - (s - L), yaw: Math.PI };
  const a = s / RB; return { x: RB * Math.sin(a), z: -RB * (1 - Math.cos(a)), yaw: Math.atan2(Math.cos(a), -Math.sin(a)) };
}
function pie(K, parent, s = 1) { const g = new THREE.Group(); parent.add(g); g.scale.setScalar(s);
  K.cyl(0.32, 0.26, 0.12, K.paint('#d8a060', { rough: 0.6 }), 0, 0, 0, g, 20); K.cyl(0.29, 0.29, 0.02, K.paint('#b8202a', { rough: 0.25 }), 0, 0.11, 0, g, 20);
  for (let k = -2; k <= 2; k++) { K.rbox(0.05, 0.03, 0.56 - Math.abs(k) * 0.08, 0.01, K.paint('#e8b070'), k * 0.1, 0.14, 0, g); K.rbox(0.56 - Math.abs(k) * 0.08, 0.03, 0.05, 0.01, K.paint('#e8b070'), 0, 0.15, k * 0.1, g); }
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.035, 8, 24), K.paint('#e0a868')); rim.rotation.x = Math.PI / 2; rim.position.y = 0.12; g.add(rim); return g; }
function wheelset(K, parent, cone, mat) {   // axle along local x; cone wheels are fatter on the inside (flange side)
  const g = new THREE.Group(); parent.add(g); const r1 = 0.42, r0 = cone ? 0.33 : 0.42;
  for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(s > 0 ? r0 : r1, s > 0 ? r1 : r0, 0.22, 24), mat); w.rotation.z = Math.PI / 2; w.position.x = s * GA / 2; g.add(w);
    const fl = new THREE.Mesh(new THREE.CylinderGeometry(r1 + 0.07, r1 + 0.07, 0.04, 24), mat); fl.rotation.z = Math.PI / 2; fl.position.x = s * (GA / 2 - 0.12); g.add(fl); }
  const ax = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, GA, 10), mat); ax.rotation.z = Math.PI / 2; g.add(ax); g.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return g; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { DROVE: wf(0, 'drove'), BARN0: wf(0, 'barn'), SWAPPED: wf(1, 'swapped'), CONE: wf(1, 'cone'), FLAT: wf(1, 'flat'), EASY: wf(1, 'as') - 4, WHY: wf(1, 'why'), PLAN: wf(2, 'plan'), STUCK: wf(2, 'stuck'), HAIRPIN: wf(2, 'hairpin'),
      FENNEL: wf(3, 'fennel'), ONE: wf(3, 'one'), CHERRY: wf(3, 'cherry'), PICKED: wf(3, 'picked'), WEEK: wf(3, 'week'), HIT: wf(4, 'hit'), BEND: wf(4, 'bend'), SCREECH: wf(4, 'screeched'), SPARKS: wf(4, 'sparks'), CLIMBED: wf(4, 'climbed'), CAT: wf(4, 'cat'), CURTAIN: wf(4, 'curtain'),
      IGNORED: wf(5, 'ignored'), ROLLED: wf(5, 'rolled'), MOO: wf(5, 'moo'), THREE: wf(5, 'three'), COWS: wf(5, 'cows'), CHEERED: wf(6, 'cheered'), EASY2: wf(6, 'as') - 4, SAW: wf(6, 'saw'), GOING: wf(6, 'going'),
      WHAT: wf(7, 'what'), FATTER: wf(8, 'fatter'), INSIDE: wf(8, 'inside'), BEND2: wf(8, 'bend'), SLIDES: wf(8, 'slides'), OUTER: wf(9, 'outer'), FAT: wf(9, 'fat'), INNER: wf(9, 'inner'), THIN: wf(9, 'thin'), STEERS: wf(9, 'steers'),
      CUP: wf(10, 'paper'), CIRCLE: wf(10, 'circle'), FLATW: wf(11, 'flat'), STRAIGHT: wf(11, 'straight'), GOT: wf(12, 'got'), PIE: wf(12, 'pie'), FORTY: wf(12, 'forty'), EASY3: wf(12, 'easy') };
    // ================= Moo Meadow + the railway =================
    const G = K.group();
    K.slab(-90, 90, -0.1, 0, -90, 90, K.mat('grime', '#6aa84f', { detail: 1.8, amt: 0.4 }), G, false);
    const ballast = K.mat('rock', '#8a847a', { detail: 0.25, amt: 0.4 }), sleeperM = K.mat('wood', '#6a4a32', { detail: 0.3 }), railM = K.chrome({ rough: 0.3 });
    const Ltot = RB * Math.PI / 2;
    for (let s = -80; s < Ltot + 40; s += 0.7) { const p = trackAt(s), q = trackAt(s + 0.7); const yaw = p.yaw;
      const b = K.rbox(3.0, 0.16, 0.74, 0.04, ballast, (p.x + q.x) / 2, 0.08, (p.z + q.z) / 2, G); b.rotation.y = yaw - Math.PI / 2 + Math.PI / 2; b.rotation.y = yaw;
      const sl = K.rbox(2.3, 0.1, 0.22, 0.02, sleeperM, p.x, 0.19, p.z, G); sl.rotation.y = yaw;
      for (const sd of [-1, 1]) { const ox = Math.cos(yaw) * sd * GA / 2, oz = -Math.sin(yaw) * sd * GA / 2; const r = K.rbox(0.08, 0.12, 0.72, 0.01, railM, (p.x + q.x) / 2 + ox, 0.3, (p.z + q.z) / 2 + oz, G); r.rotation.y = Math.atan2(q.x - p.x, q.z - p.z); } }
    // telegraph poles, bend sign, fences, bushes, trees, hills
    for (let s = -70; s < Ltot + 30; s += 9) { const p = trackAt(s); const ox = Math.cos(p.yaw) * 3.2, oz = -Math.sin(p.yaw) * 3.2; K.cyl(0.1, 0.12, 5, K.mat('wood', '#5a3a24'), p.x - ox, 0, p.z - oz, G, 8); const c = K.rbox(1.0, 0.08, 0.08, 0.01, K.mat('wood', '#5a3a24'), p.x - ox, 4.6, p.z - oz, G); c.rotation.y = p.yaw; }
    const hs = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), S.textMat('HAIRPIN BEND|SLOW!', { bg: '#f2c230', fg: '#1a1a1a', w: 600, h: 300 })); hs.position.set(-3, 2.0, 3.4); G.add(hs); for (const dx of [-1.0, 1.0]) K.cyl(0.06, 0.06, 1.4, K.mat('wood', '#5a3a24'), -3 + dx, 0, 3.38, G, 6);
    for (let x = 2; x < 30; x += 1.2) { K.rbox(0.1, 0.9, 0.1, 0.02, K.mat('wood', '#c8b090'), x, 0.45, 11, G); } K.rbox(28, 0.06, 0.05, 0.01, K.mat('wood', '#c8b090'), 16, 0.7, 11, G); K.rbox(28, 0.06, 0.05, 0.01, K.mat('wood', '#c8b090'), 16, 0.35, 11, G);
    for (let k = 0; k < 18; k++) { const x = -8 + hash(k) * 12, z = 2.6 + hash(k + 5) * 2.5; K.sphere(0.6 + hash(k + 2) * 0.4, K.mat('grime', ['#3f8a3a', '#4f9a3a', '#2f7a3a'][k % 3], { detail: 0.4 }), x, 0.4, z, G, 1, 0.8, 1); }
    for (let k = 0; k < 24; k++) { const t = S.tree({ h: 4.5 + hash(k) * 3, seed: k }); const a = hash(k + 11) * 6.28; t.position.set(10 + Math.cos(a) * (40 + hash(k + 3) * 14), 0, -5 + Math.sin(a) * (40 + hash(k + 3) * 14)); }
    for (let k = 0; k < 7; k++) K.sphere(22 + hash(k) * 8, K.mat('grime', ['#5f9a44', '#6aa84f', '#4f8a3a'][k % 3], { detail: 4 }), -80 + k * 30, -14, -70 - hash(k + 2) * 10, G, 1, 0.55, 1);
    for (let k = 0; k < 40; k++) K.sphere(0.07, K.paint(['#f4f2ee', '#f2c230', '#e84a8f'][k % 3], { coat: 0 }), 4 + hash(k) * 26, 0.06, 3 + hash(k + 9) * 7, G);
    // rail yard depot
    K.rbox(10, 0.9, 3.0, 0.05, K.mat('rock', '#b8b0a4'), YARD, 0.45, 3.4, G); const dep = S.building({ w: 8, d: 5, floors: 1, color: '#e8d8b0', gable: 'flat', shutters: '#2a6a3a', seed: 5, shop: 'PIE EXPRESS DEPOT', awning: '#c0262a' }, G); dep.position.set(YARD, 0.9, 7.6); dep.rotation.y = Math.PI;
    for (let k = 0; k < 6; k++) { K.rbox(0.8, 0.6, 0.6, 0.03, K.mat('wood', '#b8844a'), YARD - 3.5 + k * 1.3, 1.2, 2.8, G); const l = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.25), S.textMat('PIES', { bg: '#f4efe4', fg: '#b8202a', w: 200, h: 80 })); l.position.set(YARD - 3.5 + k * 1.3, 1.25, 2.49); l.rotation.y = Math.PI; G.add(l); }
    // Lou's barn ("NOT A HIDEOUT") with an open doorway facing -x
    const BG = new THREE.Group(); BG.position.set(BARN, 0, 0); G.add(BG); const red = K.mat('wood', '#b0302a', { detail: 0.5 });
    K.rbox(0.3, 6, 3.2, 0.03, red, 0, 3, -3.6, BG); K.rbox(0.3, 6, 3.2, 0.03, red, 0, 3, 3.6, BG); K.rbox(0.3, 1.6, 4.2, 0.03, red, 0, 5.2, 0, BG);
    K.rbox(12, 6, 0.3, 0.03, red, 6, 3, -5.2, BG); K.rbox(12, 6, 0.3, 0.03, red, 6, 3, 5.2, BG); K.rbox(0.3, 6, 10.4, 0.03, red, 12, 3, 0, BG);
    for (const s of [-1, 1]) { const r = K.rbox(12.6, 0.25, 6.4, 0.06, K.mat('wood', '#5a3a2a'), 6, 7.2, s * 2.6, BG); r.rotation.x = s * 0.55; }
    for (const z of [-3.6, 3.6]) { K.rbox(0.36, 0.2, 3.2, 0.02, K.paint('#f4efe4'), -0.05, 0.2, z, BG); K.rbox(0.36, 0.2, 3.2, 0.02, K.paint('#f4efe4'), -0.05, 4.3, z, BG); const d1 = K.rbox(0.34, 4.3, 0.16, 0.02, K.paint('#f4efe4'), -0.05, 2.25, z, BG); d1.rotation.x = 0.62 * (z > 0 ? 1 : -1); }
    const ns = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.9), S.textMat('NOT A HIDEOUT', { bg: '#f4efe4', fg: '#b0302a', w: 900, h: 220 })); ns.position.set(-0.2, 5.3, 0); ns.rotation.y = -Math.PI / 2; BG.add(ns);
    K.rbox(1.2, 1.2, 0.1, 0.02, K.mat('wood', '#7a4a2a'), -0.2, 6.2, 0, BG).rotation.y = Math.PI / 2;
    for (let k = 0; k < 5; k++) K.rbox(1.1, 0.9, 1.15, 0.12, K.mat('fabric', '#e8c860', { detail: 0.25 }), 3 + (k % 3) * 1.2, 0.45 + Math.floor(k / 3) * 0.9, -4.2, BG);
    // the plan board (outside, by the barn)
    const pb = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.2), S.textMat('THE PLAN|1. FLAT WHEELS|2. STUCK AT BEND|3. PIES!', { bg: '#1f3a2a', fg: '#f4f2ee', w: 700, h: 480 })); pb.position.set(BOARD[0], 1.9, BOARD[1]); pb.rotation.y = -Math.PI / 2 + 0.35; G.add(pb);
    const pbf = K.rbox(0.1, 2.4, 3.4, 0.03, K.mat('wood', '#7a4a2a'), BOARD[0] + 0.08, 1.9, BOARD[1] - 0.03, G); pbf.rotation.y = 0.35; for (const dz of [-1.3, 1.3]) { const l = K.rbox(0.08, 1.0, 0.08, 0.01, K.mat('wood', '#7a4a2a'), BOARD[0] + 0.1 + Math.sin(0.35) * dz, 0.4, BOARD[1] + Math.cos(0.35) * dz, G); }
    const pic = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), S.textMat('THIS|ONE ♥', { bg: '#f4efe4', fg: '#b8202a', w: 300, h: 300 })); pic.position.set(BOARD[0] - 0.08, 2.4, BOARD[1] + 1.05); pic.rotation.y = -Math.PI / 2 + 0.35; G.add(pic);
    S.bake(G);
    // ================= the Pie Express =================
    LOCO = new THREE.Group(); sc.add(LOCO); { const R = K.paint('#c0262a', { rough: 0.22 }), BK = K.paint('#1a1a1e', { rough: 0.4 }), GO = K.gold();
      K.rbox(2.2, 0.5, 7.5, 0.08, BK, 0, 0.75, 0, LOCO); const boil = K.cyl(0.95, 0.95, 4.6, R, 0, 1.95 - 2.3, 1.0, LOCO, 28); boil.rotation.x = Math.PI / 2; boil.position.set(0, 1.95, 1.0);
      for (const z of [-1.0, 0.4, 1.8, 3.2]) { const b = K.cyl(0.98, 0.98, 0.12, GO, 0, 1.95 - 0.06, z, LOCO, 28); b.rotation.x = Math.PI / 2; b.position.set(0, 1.95, z); }
      const front = K.cyl(0.98, 0.98, 0.15, BK, 0, 1.95, 3.35, LOCO, 28); front.rotation.x = Math.PI / 2; front.position.set(0, 1.95, 3.35);
      K.cyl(0.3, 0.42, 1.2, BK, 0, 2.7, 2.6, LOCO, 18); K.cyl(0.48, 0.48, 0.14, GO, 0, 3.85, 2.6, LOCO, 18); K.sphere(0.4, GO, 0, 2.95, 0.9, LOCO, 1, 0.8, 1); K.sphere(0.2, GO, 0, 3.05, -0.4, LOCO);
      K.rbox(2.3, 2.4, 2.2, 0.1, R, 0, 2.3, -2.4, LOCO); K.rbox(2.5, 0.16, 2.5, 0.05, BK, 0, 3.6, -2.4, LOCO); for (const s of [-1, 1]) K.rbox(0.05, 0.8, 0.9, 0.02, K.glass({ color: '#bfe4ff', opacity: 0.5 }), s * 1.16, 2.7, -2.3, LOCO);
      const hl = new THREE.Mesh(new THREE.SphereGeometry(0.22, 14, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff2c0').multiplyScalar(2), toneMapped: false })); hl.position.set(0, 2.6, 3.5); LOCO.add(hl); K.rbox(0.5, 0.5, 0.3, 0.05, BK, 0, 2.6, 3.35, LOCO);
      const cc = K.rbox(2.0, 0.6, 0.6, 0.05, GO, 0, 0.55, 3.9, LOCO); cc.rotation.x = 0.5;
      const nm = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.4), S.textMat('PIE EXPRESS', { bg: '#c0262a', fg: '#f2c230', w: 600, h: 150, border: false })); for (const s of [-1, 1]) { const n = nm.clone(); n.position.set(s * 1.17, 2.2, -2.4); n.rotation.y = s * Math.PI / 2; LOCO.add(n); }
      LOCO.userData.ws = []; for (const z of [-2.4, -0.6, 1.2, 2.8]) { const w = wheelset(K, LOCO, true, K.paint('#2a2a30', { metal: 0.5, rough: 0.35 })); w.position.set(0, 0.42 + 0.3, z); LOCO.userData.ws.push(w); }
      LOCO.traverse((o) => { if (o.isMesh) o.castShadow = true; }); }
    PIECAR = new THREE.Group(); sc.add(PIECAR); { const C = K.paint('#f2e6cc', { rough: 0.3 }), R = K.paint('#c0262a', { rough: 0.25 }), BK = K.paint('#1a1a1e', { rough: 0.4 });
      K.rbox(2.2, 0.4, 6.0, 0.06, BK, 0, 0.9, 0, PIECAR); K.rbox(2.3, 1.1, 6.1, 0.08, C, 0, 1.6, 0, PIECAR); K.rbox(2.36, 0.14, 6.16, 0.04, R, 0, 2.18, 0, PIECAR); K.rbox(2.36, 0.12, 6.16, 0.04, K.gold(), 0, 1.1, 0, PIECAR);
      const sg = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 0.6), S.textMat('50 CHERRY PIES', { bg: '#c0262a', fg: '#ffffff', w: 900, h: 120, border: false })); for (const s of [-1, 1]) { const n = sg.clone(); n.position.set(s * 1.17, 1.6, 0); n.rotation.y = s * Math.PI / 2; PIECAR.add(n); }
      for (let k = 0; k < 18; k++) { const p = pie(K, PIECAR, 1.15); p.position.set(-0.65 + (k % 3) * 0.65, 2.3 + (k % 2) * 0.08, -2.4 + Math.floor(k / 3) * 0.95); p.rotation.z = (hash(k) - 0.5) * 0.3; PIES.push(p); }
      WS.cone = []; WS.flat = [];
      for (const z of [-2.0, 2.0]) { const a = wheelset(K, PIECAR, true, K.paint('#2a2a30', { metal: 0.5, rough: 0.35 })); a.position.set(0, 0.72, z); WS.cone.push(a); const b = wheelset(K, PIECAR, false, K.paint('#5a6a7a', { metal: 0.6, rough: 0.3 })); b.position.set(0, 0.72, z); WS.flat.push(b); }
      PIECAR.traverse((o) => { if (o.isMesh) o.castShadow = true; }); }
    LOOSEW = wheelset(K, sc, true, K.paint('#2a2a30', { metal: 0.5, rough: 0.35 }));
    // barn-crash planks + Lou's pies + Fennel's pie
    for (let k = 0; k < 10; k++) { const p = K.rbox(0.25, 1.6, 0.08, 0.02, K.mat('wood', '#b0302a'), 0, 0, 0, sc); PLANKS.push(p); }
    for (let k = 0; k < 7; k++) LOUPIES.push(pie(K, sc, 0.8)); FOXPIE = pie(K, sc, 0.7);
    // ================= explainer: x-ray wheelset on a curved track, a paper cup, a flat wheelset =================
    const EG = K.group(); EG.userData.ex = true;
    K.cyl(7.5, 7.5, 0.1, K.paint('#1f2a44', { rough: 0.4 }), EX[0], 0, EX[1], EG, 64);
    for (const r of [5 - GA * 0.8, 5 + GA * 0.8]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.05, 8, 96), K.chrome()); t.rotation.x = Math.PI / 2; t.position.set(EX[0], 0.3, EX[1]); EG.add(t); }
    for (let k = 0; k < 40; k++) { const a = k / 40 * Math.PI * 2; const sl = K.rbox(3.4, 0.08, 0.2, 0.02, sleeperM, EX[0] + 5 * Math.cos(a), 0.14, EX[1] + 5 * Math.sin(a), EG); sl.rotation.y = -a; }
    CONEW = wheelset(K, sc, true, K.holo('#36e2ff')); CONEW.scale.setScalar(1.6);
    FLATW = wheelset(K, sc, false, K.holo('#ff7a4a')); FLATW.scale.setScalar(1.6);
    for (const [c, k] of [['#ff8a2a', 0], ['#7af8a0', 1]]) { const t = new THREE.Mesh(new THREE.TorusGeometry(k ? 0.36 : 0.44, 0.03, 8, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(2), toneMapped: false })); t.userData.ndSkip = true; t.rotation.y = Math.PI / 2; CONEW.add(t); RINGS.push(t); }
    CUP = new THREE.Group(); sc.add(CUP); { const cm = K.set.textMat('~ ~ ~ ~ ~ ~', { bg: '#f4f2ee', fg: '#2a62c8', w: 512, h: 128, border: false }); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.38, 1.1, 28, 1, true), cm); c.material.side = THREE.DoubleSide; c.rotation.z = Math.PI / 2; c.castShadow = true; CUP.add(c); const bt = new THREE.Mesh(new THREE.CircleGeometry(0.38, 24), K.paint('#f4f2ee')); bt.rotation.y = -Math.PI / 2; bt.position.x = -0.55; CUP.add(bt); }
    for (let j = 0; j < 2; j++) ARCS.push(K.trace(Array.from({ length: 25 }, (_, k) => { const a = -0.6 + k / 24 * 1.4; const r = j ? 5 - GA * 0.8 : 5 + GA * 0.8; return [EX[0] + r * Math.cos(a), 0.5, EX[1] + r * Math.sin(a)]; }), { color: j ? '#7af8a0' : '#ff8a2a', r: 0.05 }));
    // ================= characters =================
    LOU = K.stick({ jacket: '#2a2a40', pants: '#3a3a4a', hat: 'cap', hatColor: '#1a1a1a', moustache: '#2a1a14', scarf: '#c0262a', gloves: '#1a1a1a', belt: '#5a3a24', build: 'stout', pockets: true }, { key: 'lou' });
    TESS = K.stick({ jacket: '#2a9a6a', pants: '#2a2a40', hat: 'beanie', hatColor: '#f2c230', hairStyle: 'ponytail', hair: '#c8502a', vest: '#5a3a24', glasses: true }, { key: 'tess' });
    FOX = K.animal('fox', { color: '#e8782a', seed: 4, scale: 1.3 });
    for (let k = 0; k < 3; k++) COW.push(K.animal('cow', { seed: 10 + k, scale: 0.95 }));
    K.addClouds(10, 700, 150);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s);
    const ex = f >= 829 && f < 1252;
    // ---------- train ----------
    const locoS = -16 + (f - 458) * 0.36; const onRun = f >= 458 && f < 829;
    const lp = trackAt(locoS); LOCO.visible = onRun && !ex; LOCO.position.set(lp.x, 0, lp.z); LOCO.rotation.set(0, lp.yaw, 0); LOCO.userData.ws.forEach((w) => { w.rotation.x = f * 0.85; });
    // pie car: on the rails behind the loco until the bend, then straight on, up the rail, across the meadow
    let pc = { x: YARD, y: 0, z: 0, yaw: Math.PI / 2, roll: 0, pitch: 0 }, spin = 0;
    const pcX = (g) => g < 527 ? -9 + (g - 458) * 0.36 * 0 : 0;
    if (f < 98) { pc = { x: lerp(25, 37, sm(0, 80, f)), y: 0.15 * Math.sin(f * 0.6), z: 0, yaw: Math.PI / 2, roll: 0.06 * Math.sin(f * 0.5), pitch: -0.05 }; spin = f * 0.4; }
    else if (f < 458) pc = { x: YARD, y: 0, z: 0, yaw: Math.PI / 2, roll: 0, pitch: 0 };
    else if (f < 829) { const s = locoS - 9; if (s < 0 || f < 527) { const p = trackAt(s); pc = { x: p.x, y: 0, z: p.z, yaw: p.yaw, roll: 0, pitch: 0 }; spin = f * 0.85; }
      else { const x = f < 621 ? lerp(0, 12, (f - 527) / 94) : lerp(12, 27, (f - 621) / 206); pc = { x, y: 0.35 * sm(F.CLIMBED - 4, F.CLIMBED + 10, f) * (f < 621 ? 1 : 1 - sm(621, 650, f)) + (f >= 621 ? 0 : 0), z: -0.3 * sm(527, 600, f), yaw: Math.PI / 2 + 0.06 * Math.sin(f * 0.2), roll: f < 621 ? -0.22 * sm(F.CLIMBED - 4, F.CLIMBED + 10, f) : -0.05 * Math.sin(f * 0.3), pitch: 0 }; spin = f * (f < 621 ? 0.8 : 0.3); } }
    else if (f >= 1252) pc = { x: BARN + 4, y: 0, z: 0, yaw: Math.PI / 2, roll: 0.08, pitch: 0.05 };
    void pcX;
    PIECAR.visible = !ex; PIECAR.position.set(pc.x, pc.y, pc.z); PIECAR.rotation.set(0, 0, 0); PIECAR.rotateY(pc.yaw); PIECAR.rotateZ(pc.roll); PIECAR.rotateX(pc.pitch);
    const flatOn = f < 98 || (f >= F.FLAT - 2 && !(f >= 98 && f < F.FLAT - 2)); WS.cone.forEach((w) => { w.visible = !flatOn; w.rotation.x = spin; }); WS.flat.forEach((w) => { w.visible = flatOn; w.rotation.x = spin; });
    LOOSEW.visible = f >= 98 && f < 248; LOOSEW.position.set(YARD + 0.6, 0.42, -2.3); LOOSEW.rotation.set(0, 0.4, Math.PI / 2 * 0);
    PIES.forEach((p, k) => { p.visible = !(f >= 1252 && k > 14); });
    // ---------- barn crash debris ----------
    const crashF = 40; PLANKS.forEach((p, k) => { const t = (f - crashF - (k % 3)) / 30; p.visible = f < 98 && t > 0; if (!p.visible) return; p.position.set(BARN + 0.2 + t * (2 + hash(k) * 3), Math.max(0.1, 1 + 5 * t - 9.8 * t * t * 0.5 + hash(k + 1) * 3), (hash(k + 2) - 0.5) * 4 + (hash(k + 3) - 0.5) * 6 * t); p.rotation.set(t * 7 + k, k, t * 5); });
    // ---------- Lou (and his pies at the end) ----------
    let lou = { x: BARN - 3, z: 4.5, yaw: -1.2 };
    if (f >= 98 && f < 248) lou = { x: YARD + 1.6, z: -1.9, yaw: -2.6 };
    if (f >= 248 && f < 458) lou = { x: BOARD[0] - 1.6, z: BOARD[1] + 0.6, yaw: 1.4 };
    if (f >= 458 && f < 829) lou = { x: -6, z: 4.0, yaw: f >= F.SAW ? 1.6 : 2.6 };
    if (f >= 1252) lou = { x: BARN + 0.6, z: 1.8, yaw: -1.5 };
    const lk = [[0, 'shock', { expr: 'shock' }], [60, 'panic', { expr: 'scared' }], [98, 'hammer', { expr: 'grin', R: [0.3, 0.3, 'hammer'] }], [F.EASY - 6, 'cheer', { expr: 'proud', talk: true }], [F.WHY, 'hips', { expr: 'smug' }],
      [248, 'point', { expr: 'smug' }], [F.STUCK, 'pointL', { expr: 'grin' }], [348, 'idle', { expr: 'smug' }], [458, 'sneak', { expr: 'grin' }], [F.SCREECH, 'shock', { expr: 'excited' }],
      [621, 'idle', { expr: 'confused' }], [F.CHEERED - 4, 'cheer', { expr: 'laugh', talk: true }], [F.SAW, 'shock', { expr: 'shock' }], [F.GOING, 'panic', { expr: 'scared', sweat: true }],
      [1252, 'idle', { expr: 'dazed' }], [F.FORTY, 'shrug', { expr: 'dazed' }], [F.EASY3 - 4, 'idle', { expr: 'dazed', talk: true }]];
    LOU.set(T.act(f, lk, { seed: 3, blink: blink(3) }), { ...lou, visible: !ex });
    const pied = f >= 1252; LOUPIES.forEach((p) => p.scale.setScalar(1.0)); LOUPIES.forEach((p, k) => { p.visible = pied; if (pied) { const a = k * 0.9; p.position.set(lou.x + Math.cos(a) * 0.35 - 0.15, 0.5 + k * 0.28, lou.z + Math.sin(a) * 0.35); p.rotation.set(0, k, Math.PI / 2 + 0.3 * Math.sin(k)); } });
    if (pied) { LOUPIES[6].position.set(lou.x - 0.25, 1.95, lou.z); LOUPIES[6].rotation.set(0, 0, Math.PI / 2); }
    // Tess
    let tp = { x: YARD - 0.6, z: -2.0, yaw: -2.9 };
    if (f < 98) tp = { x: BARN - 4.5, z: -4.0, yaw: -2.0 };
    if (f >= 248 && f < 458) tp = { x: BOARD[0] - 2.4, z: BOARD[1] - 0.8, yaw: 1.2 };
    if (f >= 458 && f < 829) tp = { x: -7.2, z: 4.6, yaw: 2.6 };
    if (f >= 1252) tp = { x: BARN - 1.5, z: -3.0, yaw: 1.4 };
    const tk = [[0, 'scared', { expr: 'scared' }], [98, 'carry', { expr: 'nervous', item: 'box' }], [248, 'think', { expr: 'confused' }], [458, 'sneak', { expr: 'excited' }], [F.SCREECH, 'ears', { expr: 'shock' }], [F.SAW, 'facepalm', { expr: 'pained' }], [1252, 'laugh', { expr: 'laugh' }]];
    TESS.set(T.act(f, tk, { seed: 6, blink: blink(6) }), { ...tp, visible: !ex });
    // Fennel the fox
    let fx = { x: BARN - 2.5, z: -2.0, yaw: -1.4, mode: 'stand', expr: 'shock' };
    if (f >= 98 && f < 248) fx = { x: YARD + 2.8, z: -2.6, yaw: -2.0, mode: 'sit', expr: 'neutral' };
    if (f >= 248 && f < 458) fx = { x: BOARD[0] - 0.9, z: BOARD[1] + 1.5, yaw: 1.2, mode: f >= F.PICKED ? 'beg' : 'sit', expr: f >= F.CHERRY ? 'happy' : 'neutral' };
    if (f >= 458 && f < 829) fx = { x: -5.2, z: 3.4, yaw: 2.8, mode: f >= F.SAW ? 'jump' : 'sit', expr: f >= F.SAW ? 'happy' : 'shock' };
    if (f >= 1252) fx = { x: BARN - 1.6, z: 1.2, yaw: 2.4, mode: f >= F.PIE ? 'eat' : 'wag', expr: 'happy' };
    if (ex) fx = { visible: false };
    FOX.set(f, fx); FOXPIE.visible = f >= F.GOT && !ex; if (FOXPIE.visible) FOXPIE.position.set(fx.x + Math.sin(fx.yaw) * 0.55, 0.06, fx.z + Math.cos(fx.yaw) * 0.55);
    // cows
    COW.forEach((c, k) => { const look = f >= 621 && f < 829 ? Math.atan2(pc.x - COWS[k][0], pc.z - COWS[k][1]) : -0.6 + k * 0.5; c.set(f, { x: COWS[k][0], z: COWS[k][1], yaw: look, mode: f >= F.THREE - 20 ? 'stand' : 'eat', expr: f >= F.THREE ? 'shock' : 'neutral', visible: !ex }); });
    // ---------- explainer ----------
    const EXv = ex; CONEW.visible = EXv && f < F.FLATW - 4; FLATW.visible = EXv && f >= F.FLATW - 4; CUP.visible = EXv && f >= F.CUP - 6 && f < F.FLATW - 4;
    const ang = (f - 840) * 0.022, slide = f >= F.SLIDES - 4 ? 0.22 * sm(F.SLIDES - 4, F.SLIDES + 8, f) : 0;
    CONEW.position.set(EX[0] + (5 + slide) * Math.cos(ang), 0.42 * 1.6 + 0.3, EX[1] + (5 + slide) * Math.sin(ang)); CONEW.rotation.set(0, -ang, 0); CONEW.children.forEach((c) => {}); CONEW.rotateX(-(f - 840) * 0.3);
    RINGS.forEach((r, k) => { r.visible = EXv && f >= F.OUTER - 4; r.position.set((k ? -1 : 1) * (GA / 2) * 1.0 + (k ? 0.06 : -0.06), 0, 0); });
    ARCS.forEach((a, k) => a.show(EXv && f >= (k ? F.INNER : F.OUTER) - 4 && f < F.CUP - 6 ? sm((k ? F.INNER : F.OUTER) - 4, (k ? F.THIN : F.FAT) + 8, f) : 0));
    const ca = (f - F.CUP) * 0.05; CUP.position.set(EX[0] + 2.2 * Math.cos(ca), 0.47, EX[1] + 2.2 * Math.sin(ca)); CUP.rotation.set(0, -ca + Math.PI / 2, 0); CUP.rotateX((f - F.CUP) * 0.28);
    const fs = Math.max(0, f - F.FLATW + 4) * 0.12; FLATW.position.set(EX[0] + 5 + fs * 0.0, 0.42 * 1.6 + 0.3 + (fs > 2 ? -(fs - 2) * 0.1 : 0), EX[1] + fs); FLATW.rotation.set(0, 0, 0); FLATW.rotateX(fs * 2.3);
    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const body = (x, z, y = 0, h = 2.2) => [[x, y, z], [x, y + h, z]];
    const PCP = [[pc.x - 3.2, 0, pc.z - 1.5], [pc.x + 3.2, 2.6, pc.z + 1.5]];
    if (sh(0, 48)) {                          // 1. hook: the pie car bursts into Lou's barn, planks + pies flying, Lou and Fennel by the door (wide)
      cam = K.fit([[BARN - 6, 0, -5], [BARN, 7, 5], ...body(lou.x, lou.z), [pc.x - 3, 0, 0]], { yaw: 230, pitch: 8, fov: 44, margin: 0.85, maxDist: 14 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(48, 98)) {                  // 2. through his own barn (low wide, the meadow behind)
      cam = K.fit([[BARN - 4, 0, -5], [BARN + 2, 6, 5], ...body(lou.x, lou.z), [fx.x, 0, fx.z]], { yaw: 150, pitch: 4, fov: 44, margin: 0.85, maxDist: 13 }); cam.fov *= K.punch(f, F.BARN0, 0.12, 6); const s = K.shake(f, 50, 0.08, 14); cam.pos[1] += s[1];
    } else if (sh(98, 160)) {                 // 3. the day before, at the depot: swapping the cone wheels for flat ones (wide)
      cam = K.fit([[YARD - 3.2, 0, -1.5], [YARD + 3.2, 2.6, 1.5], ...body(lou.x, lou.z), [YARD + 0.6, 0.4, -2.3], ...body(tp.x, tp.z)], { yaw: -65, pitch: 12, fov: 42, margin: 0.9, maxDist: 11 }); cam.fov *= K.punch(f, F.CONE, 0.08, 6);
    } else if (sh(160, 200)) {                // 4. "Easy as pie!" (Lou reaction close)
      cam = { pos: [lou.x + 1.0, 2.0, lou.z + 2.6], look: [lou.x, 1.7, lou.z], fov: 40 * K.push(u, 0.06) }; dof = { focus: 2.8, cinf: 12 };
    } else if (sh(200, 248)) {                // 5. so why are train wheels cones? (insert-wide on the wheels + the removed cone wheel)
      cam = K.fit([[YARD - 1.5, 0, 0], [YARD + 2.0, 1.4, -2.6], [YARD - 2.6, 0.6, 0]], { yaw: -50, pitch: 14, fov: 40, margin: 0.95, maxDist: 8 }); cam.fov *= K.punch(f, F.WHY, 0.06, 6);
    } else if (sh(248, 300)) {                // 6. the plan board by the barn (wide)
      cam = K.fit([[BOARD[0], 0.8, BOARD[1] - 1.6], [BOARD[0], 3.0, BOARD[1] + 1.6], ...body(lou.x, lou.z), ...body(tp.x, tp.z), [fx.x, 0, fx.z]], { yaw: 185, pitch: 8, fov: 42, margin: 0.9, maxDist: 11 }); cam.fov *= K.punch(f, F.PLAN, 0.06, 6);
    } else if (sh(300, 348)) {                // 7. stuck at Hairpin Bend (wide of the bend + sign)
      cam = K.fit([[-4, 0, 3.4], [3, 0, -3], [RB * 0.7, 0, -RB * 0.3], [-3, 2.6, 3.4]], { yaw: 120, pitch: 22, fov: 44, margin: 0.85, maxDist: 16 }); cam.fov *= K.punch(f, F.HAIRPIN, 0.08, 6);
    } else if (sh(348, 398)) {                // 8. Fennel the fox (reaction close)
      cam = { pos: [fx.x + 2.0 * Math.sin(1.2) - 0.6, 0.95, fx.z + 2.0 * Math.cos(1.2) + 0.6], look: [fx.x, 0.6, fx.z], fov: 40 * K.push(u, 0.06) }; dof = { focus: 2.5, cinf: 12 };
    } else if (sh(398, 458)) {                // 9. he picked it out a week ago: "THIS ONE ♥" on the board (wide)
      cam = K.fit([[BOARD[0], 1.4, BOARD[1] + 0.4], [BOARD[0], 3.0, BOARD[1] + 1.6], [fx.x, 0, fx.z], [fx.x, 1.0, fx.z]], { yaw: 200, pitch: 6, fov: 40, margin: 1.0, maxDist: 8 }); cam.fov *= K.punch(f, F.WEEK, 0.08, 6);
    } else if (sh(458, 520)) {                // 10. the Pie Express hits the bend (tracking wide)
      const tc = K.track(f, (g) => { const p = trackAt(-16 + (g - 458) * 0.36 - 4); return [p.x, 0, p.z]; }, { off: [8, 4.5, -8], lag: 6, lookY: 1.4 }); cam = { ...tc, fov: 48 };
    } else if (sh(520, 562)) {                // 11. the pie car screeches and throws sparks (low wide)
      cam = K.fit([...PCP, [3, 0, -2]], { yaw: 120, pitch: 4, fov: 42, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.SPARKS, 0.1, 6);
    } else if (sh(562, 621)) {                // 12. climbs the rail like a cat up a curtain (wide, the loco curving away)
      cam = K.fit([...PCP, [pc.x + 3, 0, pc.z - 3]], { yaw: -40, pitch: 12, fov: 42, margin: 0.9, maxDist: 12 }); cam.fov *= K.punch(f, F.CURTAIN, 0.1, 6);
    } else if (sh(621, 690)) {                // 13. ignores the bend and rolls straight across Moo Meadow (tracking wide)
      const tc = K.track(f, (g) => [g < 621 ? 12 : lerp(12, 27, (g - 621) / 206), 0, -0.3], { off: [-4, 3.2, 10], lag: 6, lookY: 1.2 }); cam = { ...tc, fov: 50 };
    } else if (sh(690, 752)) {                // 14. past three confused cows (wide)
      cam = K.fit([...PCP, ...COWS.map((c) => [c[0], 1.6, c[1]])], { yaw: 70, pitch: 14, fov: 44, margin: 0.85, maxDist: 16 }); cam.fov *= K.punch(f, F.COWS, 0.1, 6);
    } else if (sh(752, 790)) {                // 15. Lou cheers by the bend (wide on the gang)
      cam = K.fit([...body(lou.x, lou.z), ...body(tp.x, tp.z), [fx.x, 0, fx.z], [-3, 2.6, 3.4]], { yaw: 60, pitch: 6, fov: 40, margin: 0.95, maxDist: 9 }); cam.fov *= K.punch(f, F.CHEERED, 0.08, 6);
    } else if (sh(790, 829)) {                // 16. then he saw where it was going: the barn (over the gang's shoulders, wide)
      cam = K.fit([...body(lou.x, lou.z), [pc.x, 0, pc.z], [BARN, 6, 0]], { yaw: 160, pitch: 8, fov: 46, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.GOING, 0.12, 6);
    } else if (sh(829, 877)) {                // 17. x-ray: what do cone wheels do? (wide on the round test track)
      cam = K.fit([[EX[0] - 6, 0, EX[1] - 6], [EX[0] + 6, 1.5, EX[1] + 6]], { yaw: 90, pitch: 30, fov: 42, margin: 0.85, maxDist: 16 });
    } else if (sh(877, 935)) {                // 18. each wheel is fatter on the inside (insert-wide on the wheelset)
      const c = CONEW.position; cam = K.fit([[c.x - 1.6, 0, c.z - 1.6], [c.x + 1.6, 1.6, c.z + 1.6]], { yaw: -ang * 180 / Math.PI + 90 + 70, pitch: 10, fov: 40, margin: 0.9, maxDist: 8 }); cam.fov *= K.punch(f, F.INSIDE, 0.08, 6);
    } else if (sh(935, 996)) {                // 19. on a bend, the axle slides out a little (top-down-ish)
      { const c = CONEW.position; cam = K.fit([[c.x - 2, 0, c.z - 2], [c.x + 2, 2, c.z + 2], [EX[0], 0, EX[1]]], { yaw: -ang * 180 / Math.PI + 160, pitch: 40, fov: 42, margin: 0.85, maxDist: 12 }); } cam.fov *= K.punch(f, F.SLIDES, 0.08, 6);
    } else if (sh(996, 1060)) {               // 20. outer wheel on its fat part, inner on its thin part (glowing contact arcs)
      const c = CONEW.position; cam = K.fit([[c.x - 2.2, 0, c.z - 2.2], [c.x + 2.2, 1.8, c.z + 2.2]], { yaw: -ang * 180 / Math.PI + 180, pitch: 18, fov: 42, margin: 0.85, maxDist: 9 }); cam.fov *= K.punch(f, F.FAT, 0.08, 6);
    } else if (sh(1060, 1139)) {              // 21. so the axle steers itself (wide circle)
      cam = K.fit([[EX[0] - 6, 0, EX[1] - 6], [EX[0] + 6, 1.5, EX[1] + 6]], { yaw: 120, pitch: 22, fov: 44, margin: 0.85, maxDist: 16 }); cam.fov *= K.punch(f, F.STEERS, 0.1, 6);
    } else if (sh(1139, 1197)) {              // 22. a paper cup rolls in a circle (wide)
      cam = K.fit([[EX[0] - 3, 0, EX[1] - 3], [EX[0] + 3, 1.2, EX[1] + 3]], { yaw: 70, pitch: 28, fov: 40, margin: 0.9, maxDist: 10 }); cam.fov *= K.punch(f, F.CIRCLE, 0.1, 6);
    } else if (sh(1197, 1252)) {              // 23. flat wheels only know straight: off the track (wide)
      cam = K.fit([[EX[0] + 3, 0, EX[1] - 2], [EX[0] + 7, 1.5, EX[1] + 8]], { yaw: 0, pitch: 14, fov: 42, margin: 0.9, maxDist: 12 }); cam.fov *= K.punch(f, F.STRAIGHT, 0.12, 6);
    } else if (sh(1252, 1300)) {              // 24. Fennel got his pie (wide at the barn door)
      cam = K.fit([...body(lou.x, lou.z), [fx.x, 0, fx.z], [BARN, 6, 0], ...body(tp.x, tp.z)], { yaw: 200, pitch: 8, fov: 44, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.PIE, 0.08, 6);
    } else {                                  // 25. Lou got the other forty-nine. Easy as pie. (wide pull-back = the hook's barn)
      cam = K.fit([[BARN - 6, 0, -5], [BARN, 7, 5], ...body(lou.x, lou.z), [fx.x, 0, fx.z]], { yaw: lerp(225, 235, u), pitch: 8, fov: 44, margin: 0.85, maxDist: 14 }); cam.fov *= K.punch(f, F.FORTY, 0.1, 6);
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    if (onRun) K.steam(f, (g) => { const p = trackAt(-16 + (g - 458) * 0.36 + 2.6); return [p.x, 4.0, p.z]; }, { rate: 10, size: 1.0, rise: 2.4, drift: [-0.5, 0.2], dark: 0.25 });
    if (f >= F.SCREECH - 4 && f < 621) K.sparks(f, F.SCREECH - 4, 621, () => [pc.x - 1.0, 0.4, pc.z + 0.8], { dir: [-1, 0.6, 0.4], spread: 0.6, rate: 30, speed: 6, life: 16, color: '#ffb040', seed: 9 });
    if (f >= 40 && f < 98) { K.puff(f, 42, BARN, 0, 16, 1.2, '#c8a878'); K.sparks(f, 40, 98, [BARN + 0.5, 2, 0], { dir: [1, 0.8, 0], spread: 1.4, rate: 26, speed: 6, life: 24, color: '#e8b070', seed: 4 }); }
    if (f >= 621 && f < 829 && f % 8 === 0) K.puff(f, f, pc.x - 1, pc.z, 5, 0.6);
    K.mist(f, 821, 16); K.mist(f, 1244, 16);
    K.badge(f, F.DROVE, 'PIE CAR: WRONG WAY', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 96 });
    K.badge(f, F.FLAT, 'CONES → FLAT', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 196 });
    K.badge(f, F.WHY, 'WHY CONES?', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 246 });
    K.badge(f, F.CHERRY, '1 CHERRY PIE', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 456 });
    K.badge(f, F.THREE, '3 CONFUSED COWS', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 750 });
    K.badge(f, F.FATTER, 'FAT INSIDE, THIN OUTSIDE', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 990 });
    K.badge(f, F.STEERS, 'SELF-STEERING', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1136 });
    K.badge(f, F.STRAIGHT, 'FLAT = ONLY STRAIGHT', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 1250 });
    K.badge(f, F.FORTY, '49 PIES', { sx: 0.5, sy: 0.2 }, { style: 'stamp', size: 1.1, f1: 1382 });
    const L = K.light('golden', { az: 210, el: 34, shadowExt: 26, exposure: 1.2 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
