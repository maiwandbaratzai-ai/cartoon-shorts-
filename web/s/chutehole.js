// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why a Hole Stops a Parachute From Swinging" — invented story, engine: The Upgrade (SCRIPTS.md §000).
// Sky-baker Felix ("A hole is a leak!") patches the hole in the top of his cake parachute with a pizza box. Pudding the pig, promised
// the top tier, licks her lips. The four-tier wedding cake swings left, right, then upside down; a parachute twice as big swings twice
// as far, pops the bouncy castle and takes the groom's hat; Pudding chases the hat, the groom chases Pudding. Explainer: air trapped
// under a closed chute spills out one side, shoving it the other way, then the other side — tick, tock; a hole in the top lets the air
// out the middle so it falls straight. The cake lands on Pudding, top tier first. Best day of her life.
import { TOTAL, LINES, wf } from './chutehole_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const ZS = -3.6, HANG = [-60, 0, 2], EX = [90, 0, 0], PIG0 = [-3.9, -1.7], CAS = [4.9, ZS];
let THREE, F = {}, RIG = [], CAKE, TOPTIER, PIGTOP, PATCH = [], PLANE, PROP, FELIX, BRIDE, GROOM, HAT, PIG, CASTLE, GUESTS = [], HC, HCAKE, ARROWS = [], AIR = [], HOLE2, HANGC;

function canopy(K, parent, r, withHole = true) { const g = new THREE.Group(); parent.add(g);
  const c = document.createElement('canvas'); c.width = 512; c.height = 64; const x = c.getContext('2d'); const cols = ['#e8302a', '#f4f2ee', '#f2c230', '#f4f2ee'];
  for (let i = 0; i < 16; i++) { x.fillStyle = cols[i % 4]; x.fillRect(i * 32, 0, 32, 64); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const m = K.paint('#ffffff', { rough: 0.45, coat: 0.4 }); m.map = t; m.side = THREE.DoubleSide;
  const d = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 18, 0, Math.PI * 2, withHole ? 0.16 : 0, Math.PI / 2.3 - (withHole ? 0.16 : 0)), m); d.scale.y = 0.62; d.castShadow = true; g.add(d);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(r * Math.sin(Math.PI / 2.3), 0.05 * r / 3, 6, 48), K.paint('#c8202a')); rim.rotation.x = Math.PI / 2; rim.position.y = r * Math.cos(Math.PI / 2.3) * 0.62; g.add(rim);
  const p = K.rbox(r * 0.42, 0.08, r * 0.42, 0.02, K.paint('#c89a5a', { rough: 0.7, coat: 0.1 }), 0, r * 0.62 + 0.02, 0, g); const pl = new THREE.Mesh(new THREE.PlaneGeometry(r * 0.36, r * 0.14), K.set.textMat('PIZZA', { bg: '#c89a5a', fg: '#c8202a', w: 300, h: 110, border: false })); pl.rotation.x = -Math.PI / 2; pl.position.set(0, r * 0.62 + 0.07, 0); g.add(pl);
  p.userData.label = pl; g.userData.patch = [p, pl]; return g; }
function cake(K, parent) { const g = new THREE.Group(); parent.add(g); const W = K.paint('#fbf6ee', { rough: 0.35 }), P = K.paint('#f07aa8', { rough: 0.3 }), GO = K.gold();
  K.rbox(2.2, 0.12, 2.2, 0.04, GO, 0, 0.06, 0, g); let y = 0.12; const tiers = [];
  [0.9, 0.7, 0.5, 0.32].forEach((r, i) => { const tg = new THREE.Group(); tg.position.y = y; g.add(tg); K.cyl(r, r, 0.42, W, 0, 0, 0, tg, 32);
    const rb = new THREE.Mesh(new THREE.TorusGeometry(r + 0.01, 0.04, 8, 32), P); rb.rotation.x = Math.PI / 2; rb.position.y = 0.05; tg.add(rb);
    for (let k = 0; k < 10; k++) { const a = k / 10 * 6.28; K.sphere(0.05, P, Math.cos(a) * r, 0.42, Math.sin(a) * r, tg); }
    if (i < 3) for (let k = 0; k < 5; k++) { const a = k / 5 * 6.28 + i; K.sphere(0.07, K.paint('#d0202a', { rough: 0.15 }), Math.cos(a) * (r - 0.15), 0.47, Math.sin(a) * (r - 0.15), tg); }
    y += 0.42; tiers.push(tg); });
  const top = tiers[3]; for (const s of [-1, 1]) { const h = K.sphere(0.09, K.paint('#d0202a'), s * 0.06, 0.62, 0, top); h.scale.set(1, 1.1, 0.6); } K.cyl(0.015, 0.015, 0.25, GO, 0, 0.42, 0, top, 6);
  g.userData.tiers = tiers; g.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return g; }
function rig(K, r, R) { const g = new THREE.Group(); K.scene.add(g); const can = canopy(K, g, r); const rim = r * Math.sin(Math.PI / 2.3), ry = r * Math.cos(Math.PI / 2.3) * 0.62;
  const LM = K.paint('#f4f2ee', { rough: 0.5 }); for (let k = 0; k < 8; k++) { const a = k / 8 * 6.28; const A = new THREE.Vector3(Math.cos(a) * rim, ry, Math.sin(a) * rim), B = new THREE.Vector3(Math.cos(a) * 0.9, -R + 2.0, Math.sin(a) * 0.9);
    const L = A.distanceTo(B); const m = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, L, 5), LM); m.position.copy(A).add(B).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()); g.add(m); }
  g.userData = { can, R, r }; return g; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { SWUNG: wf(0, 'swung'), WRECK: wf(0, 'wrecking'), FOUR: wf(1, 'four'), NINE: wf(1, 'nine'), BRIDE: wf(1, 'bride'), BELOW: wf(1, 'below'), HOLE: wf(2, 'hole'), TOP: wf(2, 'top'),
      LEAK: wf(3, 'leak'), PATCHED: wf(3, 'patched'), PIZZA: wf(3, 'pizza'), PUDDING: wf(4, 'pudding'), TIER: wf(4, 'tier'), LICKED: wf(4, 'licked'),
      OPENED: wf(5, 'opened'), LEFT: wf(5, 'left'), RIGHT: wf(5, 'right'), UPSIDE: wf(5, 'upside'), TRIED: wf(6, 'tried'), BIG: wf(6, 'big'), LEAK2: wf(6, 'leak'),
      FAR: wf(7, 'far'), POPPED: wf(7, 'popped'), CASTLE: wf(7, 'castle'), HAT: wf(7, 'hat'), CHASED: wf(8, 'chased'), GROOM2: wf(8, 'groom'), WHY: wf(9, 'why'),
      TRAPPED: wf(10, 'trapped'), ESCAPE: wf(10, 'escape'), SPILLS: wf(10, 'spills'), SIDE: wf(10, 'side'), SHOVES: wf(11, 'shoves'), OTHER: wf(11, 'other'), SPILLS2: wf(11, 'spills'), TICK: wf(11, 'tick'), TOCK: wf(11, 'tock'),
      HOLE2: wf(12, 'hole'), MIDDLE: wf(12, 'middle'), STRAIGHT: wf(12, 'straight'), LANDED: wf(13, 'landed'), PUDDING2: wf(13, 'pudding'), FIRST: wf(13, 'first'), BEST: wf(13, 'best'), LIFE: wf(13, 'life') };
    // ================= the hilltop wedding =================
    const G = K.group();
    K.slab(-120, 140, -0.1, 0, -90, 90, K.mat('grime', '#6ab04f', { detail: 1.8, amt: 0.4 }), G, false);
    K.slab(-1.0, 1.0, -0.09, 0.012, ZS + 1, 8, K.paint('#f4f2ee', { rough: 0.7, coat: 0 }), G, false);   // aisle runner
    // arch with flowers
    const AG = new THREE.Group(); AG.position.set(0, 0, ZS - 1.6); G.add(AG); const wh = K.paint('#f4f2ee');
    for (const s of [-1, 1]) K.cyl(0.1, 0.1, 3.2, wh, s * 1.8, 0, 0, AG, 10); const arc = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.1, 8, 32, Math.PI), wh); arc.position.y = 3.2; AG.add(arc);
    for (let k = 0; k < 40; k++) { const a = k / 39 * Math.PI; const r = 1.8 + (hash(k) - 0.5) * 0.25; K.sphere(0.16 + hash(k + 2) * 0.08, K.paint(['#f07aa8', '#f4f2ee', '#f2c230', '#e8302a'][k % 4], { coat: 0.2 }), Math.cos(a) * r, 3.2 + Math.sin(a) * r, (hash(k + 5) - 0.5) * 0.3, AG); }
    for (let k = 0; k < 20; k++) K.sphere(0.2, K.mat('grime', '#3f8a3a'), (hash(k) - 0.5) * 4, 0.2 + hash(k + 1) * 0.3, (hash(k + 3) - 0.5) * 0.8, AG);
    // chairs (white, gold bows), two blocks either side of the aisle
    const CM = K.paint('#f4f2ee', { rough: 0.3 }), BOW = K.gold();
    for (let row = 0; row < 4; row++) for (let c = 0; c < 6; c++) { const x = (c < 3 ? -1 : 1) * (1.6 + (c % 3) * 0.9), z = ZS + 2.6 + row * 1.3; const ch = new THREE.Group(); ch.position.set(x, 0, z); ch.rotation.y = Math.PI; G.add(ch);
      K.rbox(0.5, 0.06, 0.5, 0.02, CM, 0, 0.46, 0, ch); K.rbox(0.5, 0.55, 0.05, 0.02, CM, 0, 0.74, 0.23, ch); for (const lx of [-0.21, 0.21]) for (const lz of [-0.21, 0.21]) K.cyl(0.02, 0.02, 0.45, CM, lx, 0, lz, ch, 6); K.sphere(0.06, BOW, 0, 0.95, 0.27, ch); }
    // string-light posts, flower pots, a gift table, balloons, hedges, trees, hills
    for (const s of [-1, 1]) for (let k = 0; k < 3; k++) { const x = s * 5.6, z = ZS + k * 3.5; K.cyl(0.07, 0.07, 3.6, K.mat('wood', '#7a5a3a'), x, 0, z, G, 8); for (let j = 0; j < 7; j++) K.sphere(0.07, new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff2b0').multiplyScalar(1.8), toneMapped: false }), x, 3.4 - Math.sin(j / 6 * Math.PI) * 0.4, z + j * 0.5, G); }
    for (const [x, z] of [[-2.6, ZS - 0.6], [2.6, ZS - 0.6], [-6.5, 6], [6.5, 6]]) { K.cyl(0.35, 0.25, 0.6, K.paint('#c8784a'), x, 0, z, G, 14); K.sphere(0.45, K.mat('grime', '#3f8a3a'), x, 0.95, z, G); for (let k = 0; k < 5; k++) K.sphere(0.1, K.paint(['#f07aa8', '#f2c230'][k % 2]), x + Math.cos(k) * 0.35, 1.1 + hash(k) * 0.2, z + Math.sin(k) * 0.35, G); }
    { const T = new THREE.Group(); T.position.set(-6, 0, ZS + 0.5); G.add(T); K.rbox(2.2, 0.08, 1.0, 0.03, CM, 0, 0.8, 0, T); K.rbox(2.3, 0.75, 1.05, 0.02, K.paint('#f4d0e0'), 0, 0.42, 0, T);
      for (let k = 0; k < 4; k++) { K.rbox(0.4, 0.35, 0.4, 0.04, K.paint(['#4ab8e8', '#f2c230', '#b86ae8', '#e8302a'][k]), -0.75 + k * 0.5, 1.02, 0, T); K.rbox(0.42, 0.06, 0.08, 0.01, K.gold(), -0.75 + k * 0.5, 1.02, 0, T); }
      const gs = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.35), S.textMat('GIFTS', { bg: '#f4d0e0', fg: '#c8202a', w: 400, h: 100, border: false })); gs.position.set(0, 0.5, 0.53); T.add(gs); }
    const ws = S.board('BEA + TOM|JUST MARRIED', 2.0, 1.0); ws.position.set(-3.2, 0, ZS + 9.4); ws.rotation.y = Math.PI + 0.2;
    for (let k = 0; k < 16; k++) { const a = hash(k) * 6.28; const t = S.tree({ h: 5 + hash(k + 1) * 3, seed: k }); t.position.set(Math.cos(a) * (24 + hash(k + 3) * 14), 0, Math.sin(a) * (22 + hash(k + 3) * 12) - 8); }
    for (let k = 0; k < 7; k++) K.sphere(26 + hash(k) * 8, K.mat('grime', ['#5f9a44', '#6aa84f', '#4f8a3a'][k % 3], { detail: 4 }), -90 + k * 32, -18, -80 - hash(k + 2) * 10, G, 1, 0.55, 1);
    for (let k = 0; k < 60; k++) K.sphere(0.06, K.paint(['#f4f2ee', '#f2c230', '#e84a8f'][k % 3], { coat: 0 }), -12 + hash(k) * 24, 0.05, -10 + hash(k + 9) * 22, G);
    S.bake(G);
    for (let k = 0; k < 5; k++) { const b = new THREE.Group(); b.position.set(-1.9 + (k % 2) * 3.8, 0, ZS - 1.4); sc.add(b); K.sphere(0.32, K.paint(['#f07aa8', '#f2c230', '#4ab8e8', '#f4f2ee', '#e8302a'][k], { rough: 0.15 }), (hash(k) - 0.5) * 0.4, 3.6 + k * 0.25, 0, b, 1, 1.15, 1); }
    // bouncy castle (pops)
    CASTLE = new THREE.Group(); CASTLE.position.set(CAS[0], 0, CAS[1] - 0.6); sc.add(CASTLE); { const B1 = K.paint('#4ab8e8', { rough: 0.3 }), R1 = K.paint('#e8302a', { rough: 0.3 }), Y1 = K.paint('#f2c230', { rough: 0.3 });
      K.rbox(3.2, 0.6, 3.2, 0.25, B1, 0, 0.3, 0, CASTLE); for (const s of [-1, 1]) for (const t of [-1, 1]) { K.cyl(0.38, 0.38, 3.4, s * t > 0 ? R1 : Y1, s * 1.4, 0.5, t * 1.4, CASTLE, 16); K.sphere(0.45, s * t > 0 ? Y1 : R1, s * 1.4, 4.1, t * 1.4, CASTLE); }
      K.rbox(2.6, 1.8, 0.4, 0.2, Y1, 0, 1.5, -1.4, CASTLE); for (const s of [-1, 1]) K.rbox(0.4, 1.8, 2.6, 0.2, R1, s * 1.4, 1.5, 0, CASTLE); const cs = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.5), S.textMat('BOUNCE!', { bg: '#f2c230', fg: '#e8302a', w: 500, h: 120, border: false })); cs.position.set(0, 2.2, -1.18); CASTLE.add(cs); }
    // the hangar (that morning)
    const HG = K.group(); const hb = S.building({ w: 12, d: 9, floors: 1, color: '#d8e0e8', gable: 'flat', shop: 'FELIX SKY CAKES', awning: '#e8302a', kind: 'plaster', seed: 31 }); hb.position.set(HANG[0], 0, HANG[2] - 8);
    K.slab(HANG[0] - 30, HANG[0] + 30, -0.09, 0.01, HANG[2] - 3, HANG[2] + 3, K.mat('grime', '#8a8a86', { detail: 1 }), HG, false);
    for (let k = 0; k < 8; k++) K.rbox(1.6, 0.02, 0.2, 0.01, K.paint('#f4f2ee'), HANG[0] - 26 + k * 7, 0.03, HANG[2], HG);
    for (let k = 0; k < 4; k++) { K.rbox(0.9, 0.9, 0.9, 0.05, K.mat('wood', '#b8844a'), HANG[0] + 4 + (k % 2), 0.45 + Math.floor(k / 2) * 0.9, HANG[2] - 3.6, HG); const l = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.3), S.textMat('CAKE', { bg: '#f4efe4', fg: '#c8202a', w: 200, h: 80 })); l.position.set(HANG[0] + 4 + (k % 2), 0.45 + Math.floor(k / 2) * 0.9, HANG[2] - 3.14); HG.add(l); }
    for (const s of [-1, 1]) K.cyl(0.08, 0.08, 5.2, K.chrome(), HANG[0] - 1 + s * 3.2, 0, HANG[2] - 1.5, HG, 10); K.rbox(6.6, 0.12, 0.12, 0.02, K.chrome(), HANG[0] - 1, 5.2, HANG[2] - 1.5, HG);
    const wsk = new THREE.Group(); wsk.position.set(HANG[0] + 9, 0, HANG[2] - 3); HG.add(wsk); K.cyl(0.05, 0.05, 4, K.chrome(), 0, 0, 0, wsk, 8); const sock = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.4, 12, 1, true), K.paint('#ff7a1a')); sock.rotation.z = Math.PI / 2; sock.position.set(0.7, 3.8, 0); wsk.add(sock);
    S.bake(HG);
    HANGC = canopy(K, sc, 2.4); HANGC.position.set(HANG[0] - 1, 2.6, HANG[2] - 1.5);
    // ================= the hero prop: parachute rigs + the four-tier cake =================
    RIG.push(rig(K, 3.0, 4.5), rig(K, 5.4, 6.0)); CAKE = cake(K, sc); TOPTIER = CAKE.userData.tiers[3]; PIGTOP = TOPTIER.clone(); sc.add(PIGTOP);
    // the plane
    PLANE = new THREE.Group(); sc.add(PLANE); { const Yp = K.paint('#f2c230', { rough: 0.22 }), Rp = K.paint('#e8302a', { rough: 0.25 }), BK = K.paint('#1c1c22');
      const fu = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.3, 5.2, 20), Yp); fu.rotation.x = Math.PI / 2; PLANE.add(fu); K.sphere(0.56, Rp, 0, 0, 2.6, PLANE, 1, 1, 0.6);
      for (const y of [0.55, -0.35]) K.rbox(7.4, 0.1, 1.2, 0.05, Rp, 0, y, 0.8, PLANE); for (const s of [-1, 1]) K.cyl(0.04, 0.04, 0.9, K.chrome(), s * 2.4, -0.35, 0.8, PLANE, 6);
      K.rbox(2.4, 0.08, 0.7, 0.04, Rp, 0, 0.1, -2.4, PLANE); K.rbox(0.08, 1.0, 0.8, 0.04, Rp, 0, 0.6, -2.4, PLANE);
      PROP = new THREE.Group(); PROP.position.set(0, 0, 2.95); PLANE.add(PROP); K.rbox(2.0, 0.16, 0.06, 0.03, K.mat('wood', '#7a4a2a'), 0, 0, 0, PROP); K.sphere(0.16, K.chrome(), 0, 0, 0, PROP);
      for (const s of [-1, 1]) { K.cyl(0.03, 0.03, 0.8, BK, s * 0.6, -1.3, 1.2, PLANE, 6); const w = K.cyl(0.25, 0.25, 0.12, BK, s * 0.6, -1.3, 1.2, PLANE, 14); w.rotation.z = Math.PI / 2; w.position.set(s * 0.6, -1.3, 1.2); }
      const pn = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.45), S.textMat('SKY CAKES', { bg: '#f2c230', fg: '#e8302a', w: 600, h: 100, border: false })); for (const s of [-1, 1]) { const n = pn.clone(); n.position.set(s * 0.5, 0, -0.6); n.rotation.y = s * Math.PI / 2; PLANE.add(n); }
      K.rbox(0.9, 0.1, 0.9, 0.04, BK, 0, 0.45, 0.2, PLANE); PLANE.traverse((o) => { if (o.isMesh) o.castShadow = true; }); }
    // ================= explainer: x-ray chute, trapped air, spill arrows, tick-tock, the hole =================
    const EG = K.group(); K.cyl(9, 9, 0.1, K.paint('#1f2a44', { rough: 0.4 }), EX[0], 0, EX[2], EG, 64);
    for (const r of [4.5, 8.6]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.04, 8, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color('#36e2ff').multiplyScalar(1.6), toneMapped: false })); t.rotation.x = Math.PI / 2; t.position.set(EX[0], 0.12, EX[2]); t.userData.ndSkip = true; EG.add(t); }
    HC = new THREE.Group(); HC.position.set(EX[0], 5.2, EX[2]); sc.add(HC); { const d = new THREE.Mesh(new THREE.SphereGeometry(2.4, 40, 14, 0, Math.PI * 2, 0, Math.PI / 2.3), K.holo('#36e2ff')); d.scale.y = 0.62; HC.add(d); HC.userData.d = d;
      HOLE2 = new THREE.Mesh(new THREE.SphereGeometry(2.4, 40, 14, 0, Math.PI * 2, 0.22, Math.PI / 2.3 - 0.22), K.holo('#7af8a0')); HOLE2.scale.y = 0.62; HC.add(HOLE2);
      for (let k = 0; k < 8; k++) { const a = k / 8 * 6.28; const A = new THREE.Vector3(Math.cos(a) * 2.4 * 0.976, 0.13, Math.sin(a) * 2.4 * 0.976), B = new THREE.Vector3(0, -3.2, 0); const m = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, A.distanceTo(B), 5), K.holo('#36e2ff')); m.position.copy(A).add(B).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()); HC.add(m); }
      HCAKE = K.holoBox(1.2, 1.1, 1.2, 0, -3.75, 0, HC, '#f07aa8');
      for (let k = 0; k < 18; k++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color('#9ad8ff').multiplyScalar(1.5), toneMapped: false })); m.userData.ndSkip = true; HC.add(m); AIR.push(m); } }
    const arrowPts = (s) => Array.from({ length: 16 }, (_, k) => { const t = k / 15; return [EX[0] + s * (0.6 + t * 3.4), 4.6 + Math.sin(t * Math.PI) * 0.8 - t * 0.6, EX[2]]; });
    ARROWS.push(K.trace(arrowPts(1), { color: '#9ad8ff', r: 0.08 }), K.trace(arrowPts(-1), { color: '#9ad8ff', r: 0.08 }), K.trace(Array.from({ length: 12 }, (_, k) => [EX[0], 4.8 + k * 0.32, EX[2]]), { color: '#7af8a0', r: 0.1 }));
    // ================= characters =================
    FELIX = K.stick({ jacket: '#8a5a34', pants: '#2a2a40', hat: 'pilot', hatColor: '#5a3a24', scarf: '#f4f2ee', glasses: true, apron: '#f4f2ee', gloves: '#5a3a24', moustache: '#c8702a' }, { key: 'felix' });
    BRIDE = K.stick({ jacket: '#fbf6ee', pants: '#fbf6ee', dress: '#fbf6ee', hairStyle: 'bun', hair: '#5a3a24', scarf: '#f07aa8', collar: '#f4f2ee', glasses: false }, { key: 'bride' });
    GROOM = K.stick({ jacket: '#2a3a5a', pants: '#2a3a5a', bowtie: '#e8302a', vest: '#f4f2ee', hairStyle: 'short', hair: '#2a1a14', collar: '#f4f2ee', belt: '#1a1a1a' }, { key: 'groom' });
    HAT = new THREE.Group(); sc.add(HAT); K.cyl(0.3, 0.3, 0.03, K.paint('#1a1a1e'), 0, 0, 0, HAT, 24); K.cyl(0.19, 0.2, 0.42, K.paint('#1a1a1e'), 0, 0.02, 0, HAT, 24); K.cyl(0.205, 0.205, 0.08, K.paint('#e8302a'), 0, 0.05, 0, HAT, 24);
    const go = [{ jacket: '#7a4ab0', hairStyle: 'curly', hair: '#d8d4cc', glasses: true, dress: '#7a4ab0', scarf: '#f2c230' }, { jacket: '#2a8a7a', hat: 'cap', hatColor: '#f2c230', moustache: '#4a2a14', tie: '#e8302a' }, { jacket: '#e8a040', hairStyle: 'ponytail', hair: '#c8502a', dress: '#e8a040', collar: '#f4f2ee' }, { jacket: '#3a4a6a', hat: 'cowboy', hatColor: '#c8a060', bowtie: '#f2c230', build: 'stout' }];
    go.forEach((o, k) => GUESTS.push(K.stick({ pants: '#2a2a40', ...o }, { key: 'g' + k })));
    PIG = K.animal('pig', { seed: 7, scale: 1.25 });
    K.addClouds(14, 700, 120);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s);
    const ex = f >= 876 && f < 1196, hang = f >= 210 && f < 388;
    // ---------- the rig + cake ----------
    let ri = 0, C = [0, 13, ZS], th = 0, open = 1, rigOn = !ex && !hang, flip = 0;
    if (f < 107) { C = [0, 12.5 - f * 0.01, ZS]; th = 0.95 * Math.sin(f * 0.11 + 0.6); }
    else if (f < 210) { C = [0, 11.4 - (f - 107) * 0.01, ZS]; th = 0.95 * Math.sin(f * 0.11 + 0.6); }
    else if (f >= 388 && f < 471) { rigOn = false; }
    else if (f >= 471 && f < 570) { C = [0, 24 - (f - 471) * 0.02, ZS]; open = sm(F.OPENED - 2, F.OPENED + 8, f); const L = F.LEFT, R = F.RIGHT, U = F.UPSIDE; th = f < L - 6 ? 0 : f < R - 6 ? -0.9 * sm(L - 6, L + 4, f) : f < U - 6 ? lerp(-0.9, 0.9, sm(R - 6, R + 4, f)) : lerp(0.9, Math.PI, sm(U - 6, U + 6, f)); }
    else if (f >= 570 && f < 670) { ri = 1; C = [0, 22 - (f - 570) * 0.02, ZS]; open = sm(F.TRIED + 6, F.TRIED + 18, f); th = 0.5 * Math.sin((f - 570) * 0.08); }
    else if (f >= 670 && f < 876) { ri = 1; C = [0, 8.2, ZS]; const ph = Math.PI / 2 - (F.POPPED - 670) * 0.085; th = 0.98 * Math.sin((f - 670) * 0.085 + ph); }
    else if (f >= 1196) { ri = 0; const u = sm(1196, F.LANDED + 4, f); C = [PIG0[0], lerp(13, 4.5 + 0.9, u), PIG0[1]]; th = 0; }
    RIG.forEach((g, k) => { g.visible = rigOn && k === ri && !(f >= F.LANDED + 24); });
    const g = RIG[ri]; g.position.set(...C); g.rotation.set(0, 0, th); g.userData.can.scale.setScalar(Math.max(0.05, open)); g.userData.can.userData.patch.forEach((p) => { p.visible = true; });
    const R = g.userData.R; CAKE.visible = rigOn || hang === false && f >= 388 && f < 471 ? rigOn : false;
    let cp = [C[0] + Math.sin(th) * (R - 2.0) * 1, C[1] - Math.cos(th) * (R - 2.0) - 2.0 * Math.cos(th), C[2]];
    cp = [C[0] + Math.sin(th) * R, C[1] - Math.cos(th) * R, C[2]];
    CAKE.position.set(...cp); CAKE.rotation.set(0, f * 0.004, th);
    const landed = f >= F.LANDED + 4; if (f >= 1196) { CAKE.visible = !landed; }
    TOPTIER.visible = !landed;
    // ---------- castle pops ----------
    const pop = sm(F.POPPED, F.POPPED + 12, f); CASTLE.scale.set(1 + 0.15 * pop, Math.max(0.12, 1 - 0.88 * pop), 1 + 0.15 * pop); CASTLE.visible = !ex && !hang;
    // ---------- plane ----------
    const pa = f * 0.012; PLANE.position.set(Math.cos(pa) * 20, 25 + Math.sin(f * 0.03) * 0.6, ZS + Math.sin(pa) * 20); PLANE.rotation.set(0, -pa, 0.35); PROP.rotation.z = f * 1.3;
    PLANE.visible = !ex && !hang;
    HANGC.visible = hang; HANGC.userData.patch.forEach((p) => { p.visible = f >= F.PATCHED; });
    // ---------- Felix ----------
    let fp, fseat = false;
    if (hang) fp = { x: HANG[0] - 1 + (f >= F.PATCHED - 10 ? 1.6 : 0.6), z: HANG[2] + 0.4, yaw: f < F.LEAK - 4 ? -2.6 : 0.3 };
    else if (!ex) { fseat = true; const c = Math.cos(-pa), s = Math.sin(-pa); fp = { x: PLANE.position.x + 0.2 * s, y: PLANE.position.y + 0.35, z: PLANE.position.z + 0.2 * c, yaw: -pa }; }
    const fk = [[0, 'sit', { expr: 'scared', sweat: true }], [107, 'sit', { expr: 'nervous' }], [210, 'pointUp', { expr: 'shock' }], [F.TOP, 'reach', { expr: 'confused' }], [F.LEAK - 6, 'point', { expr: 'angry', talk: true }], [F.PATCHED - 4, 'hammer', { expr: 'proud' }], [F.PIZZA, 'cheer', { expr: 'grin' }],
      [471, 'sit', { expr: 'proud' }], [F.UPSIDE, 'sit', { expr: 'shock' }], [570, 'sit', { expr: 'smug' }], [F.LEAK2 - 4, 'sit', { expr: 'proud', talk: true }], [670, 'sit', { expr: 'scared', sweat: true }], [F.WHY - 10, 'sit', { expr: 'confused' }], [1196, 'sit', { expr: 'grin' }], [F.BEST, 'sit', { expr: 'laugh' }]];
    FELIX.set(T.act(f, fk, { seed: 4, blink: blink(4) }), { ...(fp || { x: 0, z: 0 }), seat: fseat ? 0.0 : undefined, visible: !!fp });
    // ---------- bride, groom, guests ----------
    const wed = !ex && !hang;
    const bk = [[0, 'scared', { expr: 'scared' }], [60, 'panic', { expr: 'shock' }], [107, 'pointUp', { expr: 'shock' }], [F.BRIDE, 'scared', { expr: 'nervous', sweat: true }], [471, 'pointUp', { expr: 'shock' }], [F.UPSIDE, 'facepalm', { expr: 'pained' }],
      [670, 'scared', { expr: 'scared' }], [F.POPPED, 'shock', { expr: 'shock' }], [F.HAT, 'panic', { expr: 'scared' }], [781, 'facepalm', { expr: 'pained' }], [1196, 'pointUp', { expr: 'nervous' }], [F.LANDED, 'clap', { expr: 'laugh' }]];
    BRIDE.set(T.act(f, bk, { seed: 6, blink: blink(6) }), { x: -0.8, z: ZS, yaw: 0.2, visible: wed });
    let gp = { x: 0.8, z: ZS, yaw: -0.2 }; if (f >= 781 && f < 876) { const u = (f - 781) / 64; gp = { x: lerp(0.8, -9, sm(0, 1, u)) + 1.6, z: ZS + 1.0 * sm(0, 0.3, u), yaw: -Math.PI / 2 }; } if (f >= 1196) gp = { x: -0.2, z: ZS + 1.2, yaw: -0.5 };
    const gk = [[0, 'scared', { expr: 'scared' }], [107, 'shock', { expr: 'shock' }], [471, 'pointUp', { expr: 'confused' }], [670, 'scared', { expr: 'nervous', sweat: true }], [F.HAT - 4, 'shock', { expr: 'shock' }], [781, 'run', { expr: 'angry' }], [1196, 'idle', { expr: 'sad' }], [F.LANDED, 'celebrate', { expr: 'laugh' }]];
    GROOM.set(T.act(f, gk, { seed: 8, blink: blink(8) }), { ...gp, visible: wed });
    // the hat: on the groom, then off with the cake, then on the lawn chased by Pudding
    if (f < F.HAT) HAT.position.set(gp.x, 2.0, gp.z); else if (f < 781) HAT.position.set(cp[0], cp[1] + 0.2, cp[2] + 0.95); else if (f < 876) { const u = (f - 781) / 64; HAT.position.set(lerp(-3.0, -10.5, sm(0, 1, u)) + 1.6, 0.25 + Math.abs(Math.sin(f * 0.4)) * 0.3, ZS + 1.0); } else HAT.position.set(-5.4, 0.3, ZS + 1.4);
    HAT.rotation.set(f >= F.HAT && f < 876 ? f * 0.3 : 0, 0, f >= 781 && f < 876 ? Math.PI / 2 : 0); HAT.visible = wed;
    GUESTS.forEach((gu, k) => { const x = (k < 2 ? -1 : 1) * (1.6 + (k % 2) * 0.9), z = ZS + 2.6 + (k % 2) * 1.3; const ac = [[0, 'sit', { expr: 'shock' }], [F.UPSIDE, 'sit', { expr: 'scared' }], [F.POPPED, 'sit', { expr: 'shock', R: [0.4, -0.6, 'open'] }], [781, 'sit', { expr: 'laugh' }], [1196, 'sit', { expr: 'nervous' }], [F.LANDED, 'sit', { expr: 'laugh', R: [0.4, -0.6, 'open'] }]];
      gu.set(T.act(f, ac, { seed: 20 + k, blink: blink(20 + k) }), { x, z, yaw: 0.0 + (k - 1.5) * 0.15, seat: 0.45, visible: wed }); });
    // ---------- Pudding the pig ----------
    let pg = { x: PIG0[0], z: PIG0[1], yaw: 0.5, mode: 'stand', expr: 'shock' };
    if (f >= 388 && f < 471) pg = { x: PIG0[0], z: PIG0[1], yaw: 0.4, mode: f >= F.LICKED ? 'beg' : 'sit', expr: 'happy' };
    if (f >= 781 && f < 876) { const u = (f - 781) / 64; pg = { x: lerp(-2.0, -9.5, sm(0, 1, u)) + 1.6, z: ZS + 1.0, yaw: -Math.PI / 2, mode: 'run', expr: 'happy' }; }
    if (f >= 1196) pg = { x: PIG0[0], z: PIG0[1], yaw: 0.4, mode: landed ? 'eat' : 'beg', expr: 'happy' };
    PIG.set(f, { ...pg, visible: wed });
    PIGTOP.visible = landed && wed; PIGTOP.position.set(PIG0[0] + 0.62 * Math.sin(0.4), 0.98, PIG0[1] + 0.62 * Math.cos(0.4)); PIGTOP.rotation.set(0.2, 0, 0.12);
    // ---------- explainer ----------
    const tA = sm(F.SPILLS - 4, F.SIDE + 6, f), tB = sm(F.SPILLS2 - 4, F.SPILLS2 + 10, f);
    let hth = 0; if (f < F.SHOVES) hth = -0.35 * tA; else if (f < F.HOLE2 - 6) hth = 0.38 * Math.sin((f - F.SHOVES) * 0.11 - Math.PI / 2 + 0.2) * (f < F.SPILLS2 ? 1 : 1);
    const holeOn = f >= F.HOLE2 - 6; if (holeOn) hth = 0;
    HC.visible = ex; HC.rotation.set(0, 0, hth); HC.position.y = holeOn ? 5.2 - 1.6 * sm(F.MIDDLE, F.STRAIGHT + 20, f) : 5.2; HC.userData.d.visible = !holeOn; HOLE2.visible = holeOn;
    AIR.forEach((a, k) => { const ang = k / 18 * 6.28 + f * 0.04, r = 0.4 + (k % 3) * 0.55; a.position.set(Math.cos(ang) * r, 0.5 + (k % 4) * 0.12 + (holeOn ? ((f * 0.06 + k * 0.3) % 2.5) : 0), Math.sin(ang) * r); a.visible = ex; });
    ARROWS[0].show(ex && !holeOn ? (f < F.SHOVES ? tA : 0) : 0); ARROWS[1].show(ex && !holeOn && f >= F.SPILLS2 - 4 ? tB : 0); ARROWS[2].show(ex && holeOn ? sm(F.MIDDLE - 6, F.MIDDLE + 10, f) : 0);
    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const body = (x, z, y = 0, h = 2.3) => [[x, y, z], [x, y + h, z]];
    const RIGP = [[C[0] - 3, C[1] + 2, C[2]], [cp[0] - 1, cp[1], cp[2]], [cp[0] + 1, cp[1] + 2, cp[2]]];
    if (sh(0, 54)) {                          // 1. hook: the wedding cake swinging over the wedding like a wrecking ball (wide from the lawn)
      cam = K.fit([...RIGP, [C[0] + 3, C[1] + 2, C[2]], ...body(-0.8, ZS), ...body(0.8, ZS)], { yaw: 90, pitch: 4, fov: 46, margin: 0.8, maxDist: 15 }); cam.fov *= K.punch(f, F.WRECK, 0.1, 6);
    } else if (sh(54, 107)) {                 // 2. ... like a wrecking ball (low wide behind the guests, looking up)
      cam = { pos: [3.5, 1.4, ZS + 9.5], look: [0, 6.5, ZS], fov: 54 * K.push(u, 0.05) }; dof = { focus: 10, cinf: 3 };
    } else if (sh(107, 160)) {                // 3. four tiers, nine hundred dollars (sky-wide on the swinging cake)
      cam = K.fit([...RIGP, [C[0], C[1] + 2, C[2]]], { yaw: 70, pitch: -6, fov: 44, margin: 0.85, maxDist: 14 }); cam.fov *= K.punch(f, F.NINE, 0.08, 6);
    } else if (sh(160, 210)) {                // 4. the bride watching from below (full shot: bride + groom, cake swinging above)
      cam = K.fit([...body(-0.8, ZS), ...body(0.8, ZS), [0, 5.4, ZS - 1.6]], { yaw: 100, pitch: 6, fov: 42, margin: 0.95, maxDist: 9 }); cam.fov *= K.punch(f, F.BELOW, 0.08, 6);
    } else if (sh(210, 262)) {                // 5. that morning: Felix finds a hole in the top of his parachute (wide in front of the hangar)
      cam = K.fit([[HANG[0] - 4, 0, HANG[2] - 1.5], [HANG[0] + 2, 5.4, HANG[2] - 1.5], ...body(fp.x, fp.z)], { yaw: 80, pitch: 6, fov: 44, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.HOLE, 0.08, 6);
    } else if (sh(262, 306)) {                // 6. ... the hole (looking up through the canopy's hole from below)
      cam = { pos: [HANG[0] - 0.4, 1.6, HANG[2] + 1.8], look: [HANG[0] - 1, 4.2, HANG[2] - 1.5], fov: 50 * K.push(u, 0.05) }; dof = { focus: 4.0, cinf: 8 };
    } else if (sh(306, 350)) {                // 7. "A hole is a leak!" (Felix reaction)
      cam = { pos: [fp.x + 0.9, 1.8, fp.z + 2.6], look: [fp.x, 1.6, fp.z], fov: 42 * K.push(u, 0.06) }; dof = { focus: 2.8, cinf: 12 };
    } else if (sh(350, 388)) {                // 8. patched with a pizza box (wide: Felix, the canopy, PIZZA on top)
      cam = K.fit([[HANG[0] - 3.5, 2.5, HANG[2] - 1.5], [HANG[0] + 1.5, 5.4, HANG[2] - 1.5], ...body(fp.x, fp.z)], { yaw: 70, pitch: 22, fov: 42, margin: 0.85, maxDist: 10 }); cam.fov *= K.punch(f, F.PIZZA, 0.12, 6);
    } else if (sh(388, 471)) {                // 9. Pudding the pig, promised the top tier, licks her lips (full shot, low)
      cam = K.fit([[pg.x - 1, 0, pg.z - 1], [pg.x + 1, 1.4, pg.z + 1], [-6, 1, ZS + 0.5]], { yaw: 150 - 10 * u, pitch: 6, fov: 40, margin: 0.95, maxDist: 7 }); cam.fov *= K.punch(f, F.LICKED, 0.1, 6);
    } else if (sh(471, 520)) {                // 10. the chute opens (sky wide: plane, canopy blooming)
      cam = K.fit([...RIGP, [C[0] + 3, C[1] + 2, C[2]]], { yaw: 100, pitch: -4, fov: 46, margin: 0.8, maxDist: 14 }); cam.fov *= K.punch(f, F.OPENED, 0.1, 6);
    } else if (sh(520, 570)) {                // 11. left, right, upside down (sky wide, ground far below)
      cam = K.fit([[C[0] - 5, C[1] - 5, C[2]], [C[0] + 5, C[1] + 5, C[2]]], { yaw: 90, pitch: 10, fov: 46, margin: 0.85, maxDist: 15 }); cam.fov *= K.punch(f, F.UPSIDE, 0.12, 6);
    } else if (sh(570, 620)) {                // 12. Felix in his plane: "A hole is a leak!" (cockpit reaction, sky behind)
      const P = PLANE.position; cam = { pos: [P.x - Math.sin(pa) * 3.8 + Math.cos(pa) * 1.2, P.y + 2.3, P.z + Math.cos(pa) * 3.8 + Math.sin(pa) * 1.2], look: [P.x, P.y + 1.3, P.z], fov: 46 }; dof = { focus: 4.2, cinf: 10 };
    } else if (sh(620, 670)) {                // 13. a parachute twice as big (sky wide)
      cam = K.fit([[C[0] - 6, C[1] + 3.5, C[2]], [C[0] + 6, C[1] - 8, C[2]]], { yaw: 75, pitch: 0, fov: 46, margin: 0.85, maxDist: 16 }); cam.fov *= K.punch(f, F.BIG, 0.1, 6);
    } else if (sh(670, 730)) {                // 14. it swings twice as far and pops the bouncy castle (wide from the lawn)
      cam = K.fit([[-6, 0, ZS], [CAS[0] + 1.8, 0, ZS], [0, 11.5, ZS], ...body(0.8, ZS)], { yaw: 95, pitch: 6, fov: 48, margin: 0.85, maxDist: 15 }); cam.fov *= K.punch(f, F.POPPED, 0.12, 6); const s = K.shake(f, F.POPPED, 0.08, 14); cam.pos[1] += s[1];
    } else if (sh(730, 781)) {                // 15. ... and took the groom's hat (wide on bride + groom, cake swooping)
      cam = K.fit([...body(-0.8, ZS), ...body(0.8, ZS), [cp[0], cp[1] + 2, cp[2]], [0, 3.5, ZS]], { yaw: 120, pitch: 6, fov: 44, margin: 0.9, maxDist: 11 }); cam.fov *= K.punch(f, F.HAT, 0.12, 6);
    } else if (sh(781, 846)) {                // 16. Pudding chases the hat, the groom chases Pudding (tracking wide)
      const tc = K.track(f, (g) => { const uu = (g - 781) / 64; return [lerp(-2.0, -9.5, sm(0, 1, uu)) + 1.6, 0, ZS + 1.0]; }, { off: [1.5, 3.4, 6.5], lag: 5, lookY: 0.8 }); cam = { ...tc, fov: 50 };
    } else if (sh(846, 876)) {                // 17. Why did it swing? (Felix in the cockpit, scratching his head)
      const P = PLANE.position; cam = { pos: [P.x - Math.sin(pa) * 3.6 - Math.cos(pa) * 1.4, P.y + 2.2, P.z + Math.cos(pa) * 3.6 - Math.sin(pa) * 1.4], look: [P.x, P.y + 1.3, P.z], fov: 46 }; dof = { focus: 4.0, cinf: 10 };
    } else if (sh(876, 940)) {                // 18. x-ray: air trapped under a closed chute (wide)
      cam = K.fit([[EX[0] - 3, 0.8, EX[2]], [EX[0] + 3, 7, EX[2]]], { yaw: 90, pitch: 4, fov: 44, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.TRAPPED, 0.08, 6);
    } else if (sh(940, 1003)) {               // 19. ... spills out one side (closer, arrow drawing out)
      cam = K.fit([[EX[0] - 0.5, 3.2, EX[2]], [EX[0] + 4.2, 6.2, EX[2]]], { yaw: 70, pitch: 6, fov: 42, margin: 0.9, maxDist: 9 }); cam.fov *= K.punch(f, F.SIDE, 0.1, 6);
    } else if (sh(1003, 1052)) {              // 20. that shoves it the other way (wide, tilting)
      cam = K.fit([[EX[0] - 4, 0.8, EX[2]], [EX[0] + 4, 7, EX[2]]], { yaw: 110, pitch: 4, fov: 44, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.SHOVES, 0.1, 6);
    } else if (sh(1052, 1104)) {              // 21. tick, tock (front, pendulum swinging)
      cam = K.fit([[EX[0] - 4, 0.8, EX[2]], [EX[0] + 4, 7, EX[2]]], { yaw: 90 - 6 * u, pitch: 2, fov: 44, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.TICK, 0.06, 6) * K.punch(f, F.TOCK, 0.06, 6);
    } else if (sh(1104, 1196)) {              // 22. a hole in the top lets the air out the middle: it falls straight (wide)
      cam = K.fit([[EX[0] - 3, 0.5, EX[2]], [EX[0] + 3, 8.5, EX[2]]], { yaw: 70 + 20 * u, pitch: 6, fov: 44, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.STRAIGHT, 0.1, 6);
    } else if (sh(1196, 1262)) {              // 23. the cake lands on Pudding, top tier first (wide from the lawn)
      cam = K.fit([[pg.x - 1.5, 0, pg.z], [pg.x + 1.5, 0, pg.z], [C[0], Math.min(C[1] + 1, 9), C[2]], ...body(-0.8, ZS), ...body(gp.x, gp.z)], { yaw: 172, pitch: 6, fov: 46, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.FIRST, 0.12, 6); const s = K.shake(f, F.LANDED + 4, 0.06, 12); cam.pos[1] += s[1];
    } else {                                  // 24. best day of her life (full shot: Pudding wearing the top tier, the wedding behind)
      cam = K.fit([[pg.x - 1, 0, pg.z - 1], [pg.x + 1, 1.6, pg.z + 1], ...body(-0.8, ZS), ...body(gp.x, gp.z)], { yaw: lerp(178, 168, u), pitch: 6, fov: 42, margin: 0.9, maxDist: 9 }); cam.fov *= K.punch(f, F.LIFE, 0.1, 6);
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    if (f >= F.POPPED && f < F.POPPED + 30) { K.puff(f, F.POPPED, CAS[0], CAS[1], 16, 1.4, '#e8e8f0'); K.sparks(f, F.POPPED, F.POPPED + 20, [CAS[0], 2.0, CAS[1]], { dir: [0, 1, 0], spread: 1.4, rate: 30, speed: 5, life: 16, color: '#f2c230', seed: 4 }); }
    if (landed && f < F.LANDED + 30) { K.puff(f, F.LANDED + 4, PIG0[0], PIG0[1], 14, 1.0, '#fbf6ee'); K.sparks(f, F.LANDED + 4, F.LANDED + 24, [PIG0[0], 1.0, PIG0[1]], { dir: [0, 1, 0], spread: 1.4, rate: 30, speed: 4, life: 16, color: '#f07aa8', seed: 7 }); }
    if (f >= 781 && f < 846 && f % 5 === 0) K.puff(f, f, pg.x, pg.z, 4, 0.5);
    K.leaves(f, cam.look, { area: 14, count: 10, fall: 0.5, colors: ['#f07aa8', '#f4f2ee', '#f2c230'] });
    K.mist(f, 202, 16); K.mist(f, 380, 16); K.mist(f, 868, 16); K.mist(f, 1188, 16);
    K.badge(f, F.SWUNG, 'WEDDING CAKE: SWINGING', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 104 });
    K.badge(f, F.FOUR, '4 TIERS', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: F.NINE - 2 });
    K.badge(f, F.NINE, '$900', { sx: 0.5, sy: 0.2 }, { icon: 'coin', f1: 206 });
    K.badge(f, F.HOLE, 'HOLE IN THE TOP', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 300 });
    K.badge(f, F.PIZZA, 'PATCHED: PIZZA BOX', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 386 });
    K.badge(f, F.TIER, 'PROMISED: TOP TIER', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 466 });
    for (const [t, w, nx] of [[F.LEFT, 'LEFT', F.RIGHT], [F.RIGHT, 'RIGHT', F.UPSIDE], [F.UPSIDE, 'UPSIDE DOWN', 568]]) K.badge(f, t, w, { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: nx - 2 });
    K.badge(f, F.BIG, 'CHUTE x2', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: 668 });
    K.badge(f, F.FAR, 'SWING x2', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: F.POPPED - 2 });
    K.badge(f, F.POPPED, 'CASTLE: POPPED', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: F.HAT - 2 });
    K.badge(f, F.HAT, "GROOM'S HAT: GONE", { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 778 });
    K.badge(f, F.SPILLS, 'AIR SPILLS OUT ONE SIDE', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 1000 });
    for (const [t, w] of [[F.TICK, 'TICK'], [F.TOCK, 'TOCK']]) K.badge(f, t, w, { sx: t === F.TICK ? 0.3 : 0.7, sy: 0.28 }, { icon: 'clock', f1: 1102 });
    K.badge(f, F.MIDDLE, 'HOLE = STRAIGHT DOWN', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1193 });
    K.badge(f, F.BEST, 'BEST DAY EVER', { sx: 0.5, sy: 0.2 }, { style: 'stamp', size: 1.1, f1: 1348 });
    const L = K.light('golden', { az: 105, el: 36, shadowExt: 28, exposure: 1.25 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
