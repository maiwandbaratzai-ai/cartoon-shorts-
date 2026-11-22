// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Every Manhole Cover Is Round" — invented fable (SCRIPTS.md §00): Greta's round iron lids vs Bruno's cheap square lids.
// Bellport's Main Street: 300 holes -> square lids -> three weeks of lids falling in -> cones everywhere -> diagonal vs circle x-ray.
import { TOTAL, LINES, wf } from './roundlid_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
let THREE, GRETA, BRUNO, WORKER, DOG, EXTRAS = [], HOLES = [], LID0, LIDR, LIDR2, CONES = [], TRUCK, CARS = [], TABLE, CARRIER, PIZZA, HOLOS, HOLOC, TSIDE, TDIAG, TCIRC, TDIAM, CART;
let F = {};
const HZ = 1.6;                         // the lane of holes nearest the camera side (z = +1.6) and far lane (z = -1.6)
const MAIN = 0;                         // index of the hero hole at x = 0, z = +1.6
const RL = 0.5;                         // round lid radius

function roundLid(K, parent) {
  const g = new THREE.Group(); parent.add(g);
  const iron = K.paint('#2e3036', { rough: 0.35, metal: 0.6, coat: 0.6 }), gold = K.gold(), dark = K.paint('#1a1b20', { rough: 0.5 });
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(RL, RL, 0.08, 64), iron); disc.castShadow = disc.receiveShadow = true; g.add(disc);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(RL - 0.01, 0.025, 10, 64), gold); rim.rotation.x = Math.PI / 2; rim.position.y = 0.04; g.add(rim);
  for (const r of [0.38, 0.27]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.014, 8, 56), gold); t.rotation.x = Math.PI / 2; t.position.y = 0.045; g.add(t); }
  for (let k = 0; k < 16; k++) { const a = k / 16 * Math.PI * 2, rb = K.rbox(0.11, 0.02, 0.025, 0.008, iron, Math.cos(a) * 0.44, 0.048, Math.sin(a) * 0.44, g); rb.rotation.y = -a; }
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2, rb = K.rbox(0.09, 0.018, 0.02, 0.006, gold, Math.cos(a) * 0.32, 0.05, Math.sin(a) * 0.32, g); rb.rotation.y = -a; }
  const lab = new THREE.Mesh(new THREE.CircleGeometry(0.22, 40), K.set.textMat('BELLPORT', { bg: '#2e3036', fg: '#f2c230', w: 256, h: 256, border: false })); lab.rotation.x = -Math.PI / 2; lab.position.y = 0.046; g.add(lab);
  for (const a of [0.6, 3.74]) { const ph = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.01, 12), dark); ph.position.set(Math.cos(a) * 0.15, 0.05, Math.sin(a) * 0.15); g.add(ph); }
  return g;
}
function squareLid(K, parent, mats) {
  const g = new THREE.Group(); parent.add(g);
  K.rbox(0.9, 0.06, 0.9, 0.015, mats.sq, 0, 0, 0, g);
  for (let k = -2; k <= 2; k++) { K.rbox(0.82, 0.015, 0.025, 0.005, mats.sq2, 0, 0.035, k * 0.16, g); K.rbox(0.025, 0.015, 0.82, 0.005, mats.sq2, k * 0.16, 0.035, 0, g); }
  const lb = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.14), mats.lab); lb.rotation.x = -Math.PI / 2; lb.position.y = 0.045; g.add(lb);
  return g;
}

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { ROLL: wf(0, 'rolled'), COIN: wf(0, 'coin'), DOG: wf(0, 'dog'), HOLES: wf(1, 'holes'), LID: wf(1, 'lid'), LAUGH: wf(2, 'laughed'), PIZZA: wf(2, 'pizza'), CHEAP: wf(3, 'cheaper'), BOUGHT: wf(3, 'bought'),
      WEEKS: wf(4, 'weeks'), LIFT: wf(4, 'lifted'), CLUNK: wf(4, 'clunk'), FELL: wf(4, 'fell'), TWELVE: wf(5, 'twelve'), SHRUG: wf(5, 'shrugged'), FISH: wf(5, 'fish'), TRUCKS: wf(6, 'trucks'),
      FLIP: wf(6, 'flipped'), FORTY: wf(6, 'forty'), HOLES2: wf(7, 'holes'), CONES: wf(7, 'cones'), TABLE: wf(8, 'table'), TILT: wf(8, 'tilt'), SLIPS: wf(8, 'slips'), DIAG: wf(9, 'diagonal'),
      SIDE: wf(9, 'side'), DROPS: wf(9, 'drops'), CIRCLE: wf(10, 'circle'), WIDTH: wf(10, 'width'), NEVER: wf(10, 'never'), BEG: wf(11, 'begged'), BUY: wf(11, 'buy'), ROLLED: wf(12, 'rolled'), PIZZA2: wf(12, 'pizza') };
    // ---------- Main Street (town.js style, dense) ----------
    S.street({ len: 110, width: 7, sidewalk: 4.5, crossings: [-14, 16] });
    const grass = K.slab(-90, 90, -0.2, 0, -70, 70, K.mat('grime', '#6aa84f', { amt: 0.6 }), sc, false); grass.position.y -= 0.01;
    let x = -50, i = 0;
    const shops = ['BAKERY', null, 'CAFE', 'HARDWARE', null, 'BOOKS', 'BARBER', null, 'FLOWERS', 'PIZZA', null, 'IRON WORKS'];
    while (x < 50) { const w = 5 + (i * 7 % 4); const b = S.building({ w, d: 9, floors: 3 + (i % 2), seed: i + 1, shop: shops[i % shops.length], shutters: i % 3 === 0 ? '#2a5a3a' : null, flowers: i % 2 === 0, kind: i % 5 === 3 ? 'plaster' : 'brick', gable: ['step', 'bell', 'pitched'][i % 3] });
      b.position.set(x + w / 2, 0.15, -8); x += w + 0.05; i++; }
    x = -50; i = 20;
    while (x < 50) { const w = 5 + (i * 5 % 4); const b = S.building({ w, d: 9, floors: 3 + (i % 3 === 0 ? 1 : 0), seed: i + 1, shop: i % 4 === 0 ? 'CAFE' : i === 23 ? 'TOWN HALL' : i % 5 === 2 ? 'SHOES' : null, shutters: i % 4 === 1 ? '#7a2a2a' : null, flowers: true, gable: ['pitched', 'step'][i % 2] });
      b.position.set(x + w / 2, 0.15, 8); b.rotation.y = Math.PI; x += w + 0.05; i++; }
    for (let k = -44; k <= 44; k += 8) for (const s of [-1, 1]) { if (Math.abs(k) < 3) continue; const t = S.tree({ h: 4.2, seed: k + s * 7 }); t.position.set(k + (s > 0 ? 4 : 0), 0.15, s * 5.8); }
    for (let k = -36; k <= 36; k += 12) { const l = S.streetLamp(); l.position.set(k + 2, 0.15, -4.1); const l2 = S.streetLamp(); l2.position.set(k - 4, 0.15, 4.1); l2.rotation.y = Math.PI; }
    const tl = S.trafficLight(); tl.g.position.set(-16.5, 0.15, 4.0); tl.g.rotation.y = Math.PI / 2; tl.set('green');
    for (const [k2, sx, sz] of [['yield', -12, 4.3], ['warn', 9, -4.3], ['parking', 20, 4.3], ['bike', -22, -4.3], ['noentry', 26, -4.3]]) { const s2 = S.sign(k2); s2.position.set(sx, 0.15, sz); s2.rotation.y = sz > 0 ? Math.PI : 0; }
    for (const [bx, bz, r] of [[-8, -6, 0], [12, 6, Math.PI], [-26, 6, Math.PI]]) { const b = S.bench(); b.position.set(bx, 0.15, bz); b.rotation.y = r; }
    for (const [px, pz] of [[-5, -6.4], [7, 6.4], [19, -6.4], [-19, 6.4]]) { const p = S.planter(K.scene, px); p.position.set(px, 0.15, pz); }
    for (const [bx, bz] of [[-11, -4.5], [15, 4.5], [3.5, 4.5]]) { const b = S.bin(); b.position.set(bx, 0.15, bz); }
    for (let k = -9; k <= 9; k += 1.8) for (const s of [-1, 1]) if (Math.abs(k) > 3) { const b = S.bollard(); b.position.set(k + 30, 0.15, s * 3.85); }
    const brd = S.board('NEW LIDS FOR MAIN ST|SQUARE $5   ROUND $9', 2.8, 1.5, { frame: '#1f5fc8' }); brd.position.set(-10.5, 0.15, 5.4); brd.rotation.y = Math.PI + 0.25;
    for (const [cx, cz, kind, seed] of [[-30, -2.6, 'hatch', 2], [-25.5, -2.6, 'van', 3], [22, 2.6, 'taxi', 4], [30, 2.6, 'hatch', 5], [-38, 2.6, 'hatch', 6]]) { const c = S.car({ kind, seed }); c.g.position.set(cx, 0, cz); if (cz > 0) c.g.rotation.y = Math.PI; }
    CARS = [S.car({ seed: 9, color: '#2a9ab8' }), S.car({ seed: 10, kind: 'taxi', color: '#f2c230' }), S.car({ seed: 11, color: '#e8e8ec' })];
    TRUCK = S.car({ kind: 'van', color: '#e8402e', plate: 'BELL-1' });
    const tlb = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.5), S.textMat('FAST DELIVERY', { bg: '#e8402e', fg: '#ffffff', border: false, w: 512, h: 128 })); tlb.position.set(-0.3, 1.45, 0.86); TRUCK.g.add(tlb);
    // ---------- holes + lids (two lanes, every 3 m) ----------
    const mats = { sq: K.paint('#8a8c90', { rough: 0.5, metal: 0.3 }), sq2: K.paint('#6a6c70', { rough: 0.5, metal: 0.3 }), lab: S.textMat('BRUNO', { bg: '#8a8c90', fg: '#2a2a2a', border: false, w: 256, h: 96 }) };
    const holeM = new THREE.MeshBasicMaterial({ color: '#08080a' }), lipM = K.paint('#4a4c50', { rough: 0.5 });
    const coneM = K.paint('#f26a1a', { rough: 0.35 }), stripeM = K.paint('#ffffff', { rough: 0.35 });
    let n = 0;
    for (let k = -8; k <= 8; k++) for (const z of [HZ, -HZ]) { const hx = k * 3 + (z < 0 ? 1.5 : 0);
      const hole = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.84), holeM); hole.rotation.x = -Math.PI / 2; hole.position.set(hx, 0.022, z); sc.add(hole);
      for (const [dx, dz, w, d] of [[0, 0.46, 0.96, 0.08], [0, -0.46, 0.96, 0.08], [0.46, 0, 0.08, 0.96], [-0.46, 0, 0.08, 0.96]]) K.rbox(w, 0.03, d, 0.01, lipM, hx + dx, 0.02, z + dz);
      const lid = squareLid(K, sc, mats); lid.position.set(hx, 0.05, z);
      const cone = new THREE.Group(); cone.position.set(hx + 0.62, 0.02, z + 0.5); sc.add(cone); K.rbox(0.4, 0.04, 0.4, 0.02, coneM, 0, 0.02, 0, cone);
      const cc = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.6, 18), coneM); cc.position.y = 0.33; cc.castShadow = true; cone.add(cc);
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.11, 0.1, 18), stripeM); st.position.y = 0.3; cone.add(st);
      // when does this lid get laid, and when does it fall in?
      const isMain = k === 0 && z > 0, r = hash(n * 3.7 + 1);
      const lay = 0;   // lay time filled in frame() from F.BOUGHT
      const wk = isMain ? 1 : r < 0.36 ? 2 : r < 0.92 ? 3 : 9;
      HOLES.push({ x: hx, z, lid, cone, wk, r, isMain, n }); n++; }
    // ---------- hero props: Greta's round lids, her hand cart, the shop ----------
    LID0 = roundLid(K, sc);                // the lid she rolls (frame 0) and rolls to Bruno at the end
    LIDR = roundLid(K, sc);                // the lid she tilts over a hole (it can't fall in)
    CART = new THREE.Group(); sc.add(CART); CART.position.set(-7.0, 0.15, 4.9); CART.rotation.y = 0.3;
    const cw = K.mat('wood', '#9a6a3a'), cm = K.paint('#2a5a3a', { rough: 0.35 });
    K.rbox(1.4, 0.1, 0.9, 0.03, cw, 0, 0.55, 0, CART); for (const s of [-1, 1]) { const wh = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.05, 8, 24), K.paint('#2a2a2a')); wh.position.set(0, 0.3, s * 0.5); CART.add(wh); }
    K.rbox(0.05, 0.05, 1.2, 0.02, cm, -0.9, 0.85, 0, CART);
    for (let k = 0; k < 4; k++) { const l = roundLid(K, CART); l.position.set(0.05, 0.64 + k * 0.085, 0); l.scale.setScalar(0.85); l.rotation.y = k; }
    // ---------- the cutaway: a narrow door and a table (x = 90) ----------
    const CG = K.group(); const wallM = K.mat('plaster', '#e8d8b8');
    K.slab(84, 96, 0, 0.05, -6, 6, K.mat('wood', '#a87a4a', { detail: 0.6 }), CG, false);
    K.slab(84, 89.4, 0, 3.2, -0.15, 0.15, wallM, CG); K.slab(90.4, 96, 0, 3.2, -0.15, 0.15, wallM, CG); K.slab(89.4, 90.4, 2.2, 3.2, -0.15, 0.15, wallM, CG);
    for (const dx of [89.35, 90.45]) K.rbox(0.12, 2.25, 0.36, 0.03, K.paint('#7a4a2a'), dx, 1.12, 0, CG);
    const pic = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.7), S.textMat('HOME|SWEET HOME', { bg: '#f4ead2', fg: '#2a5a3a', w: 384, h: 256 })); pic.position.set(87.2, 1.9, 0.17); CG.add(pic);
    K.rbox(0.8, 1.6, 0.4, 0.04, K.mat('wood', '#7a4a2a'), 93.5, 0.8, 0.4, CG); const lampT = K.cyl(0.03, 0.03, 1.5, K.chrome(), 85.5, 0, 1.0, CG, 8);
    S.bake(CG);
    TABLE = new THREE.Group(); sc.add(TABLE); const tw = K.mat('wood', '#b07a48', { detail: 0.5 });
    K.rbox(1.6, 0.08, 0.9, 0.03, tw, 0, 0.72, 0, TABLE); for (const [a, b] of [[-0.7, -0.38], [0.7, -0.38], [-0.7, 0.38], [0.7, 0.38]]) K.rbox(0.07, 0.7, 0.07, 0.02, tw, a, 0.35, b, TABLE);
    // ---------- x-ray explainers ----------
    HOLOS = K.holoBox(0.84, 0.6, 0.84, 0, 0, 0, sc, '#36e2ff'); HOLOS.visible = false;
    TSIDE = K.trace([[-0.42, 0.1, 0.5], [0.42, 0.1, 0.5]], { color: '#ff5a4a', r: 0.02 }); TDIAG = K.trace([[-0.42, 0.1, -0.42], [0.42, 0.1, 0.42]], { color: '#36e2ff', r: 0.02 });
    const circ = []; for (let k = 0; k <= 64; k++) { const a = k / 64 * Math.PI * 2; circ.push([Math.cos(a) * 0.52, 0.1, Math.sin(a) * 0.52]); } TCIRC = K.trace(circ, { color: '#7aff9a', r: 0.02 });
    TDIAM = new THREE.Group(); sc.add(TDIAM); const dm = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.04, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff3b0').multiplyScalar(2.2) })); dm.rotation.z = Math.PI / 2; dm.userData.ndSkip = true; TDIAM.add(dm);
    // ---------- characters ----------
    GRETA = K.stick({ jacket: '#c8573a', pants: '#3a2a20', boots: '#2a1a12', hairStyle: 'bun', hair: '#8a3a2a', apron: '#5a3a24', gloves: '#3a2a20', scarf: '#2a8a5a', glasses: true, belt: '#2a1a12' }, { key: 'greta' });
    BRUNO = K.stick({ jacket: '#7a4a9a', pants: '#2a2a30', boots: '#1a1a1a', hat: 'cap', cap: '#2a62c8', moustache: '#2a1a12', vest: '#e8c46a', bowtie: '#c0392b', belt: '#1a1a1a', build: 'stout' }, { key: 'bruno' });
    WORKER = K.stick({ jacket: '#f2a020', pants: '#2c3e5a', boots: '#3a2a1a', hat: 'hardhat', hatColor: '#f2c230', vest: '#d8f030', gloves: '#3a2a20', belt: '#1a1a1a' }, { key: 'worker' });
    CARRIER = K.stick({ jacket: '#2a9ab8', pants: '#3a2a20', hairStyle: 'curly', hair: '#3a2a1e', scarf: '#f2c230', glasses: true, belt: '#1a1a1a' }, { key: 'carrier' });
    DOG = K.animal('dog', { color: '#d8a060', belly: '#f6ead8', seed: 3 });
    PIZZA = new THREE.Group(); sc.add(PIZZA); K.rbox(0.36, 0.06, 0.36, 0.01, K.paint('#f2e2c0', { rough: 0.7 }), 0, 0.03, 0, PIZZA);
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.12), S.textMat('PIZZA', { bg: '#f2e2c0', fg: '#c0392b', border: false, w: 256, h: 96 })); pl.rotation.x = -Math.PI / 2; pl.position.y = 0.065; PIZZA.add(pl);
    EXTRAS = S.extras(9, { x0: -20, len: 40, z: -5.4, spread: 1.4, seed: 5 }).concat(S.extras(7, { x0: -20, len: 40, z: 5.4, spread: 1.2, seed: 41 }));
    K.addClouds(10, 700, 160);
  },
  frame(f, K) {
    const T = K.T, L = LINES;
    const cut = f >= 813 && f < 915;
    // ---------- lids: laid on BOUGHT (pop in down the street), then fall in by week ----------
    const fallStart = (h) => { if (h.isMain) return F.CLUNK - 10; if (h.wk === 2) return F.TWELVE - 14 + Math.floor(h.r * 10); if (h.wk === 3) return F.FLIP - 6 + Math.floor((h.r - 0.36) * 40); return 1e9; };
    for (const h of HOLES) { const lay = F.BOUGHT - 30 + (h.x + 26) * 0.9, fs = fallStart(h), lid = h.lid;
      const u1 = sm(fs, fs + 7, f), u2 = clamp((f - fs - 7) / 9, 0, 1);
      lid.visible = f >= lay && u2 < 1;
      const pop = f < lay + 6 ? 1 + 0.4 * Math.sin(Math.PI * clamp((f - lay) / 6, 0, 1)) : 1; lid.scale.setScalar(pop);
      lid.position.set(h.x, 0.05 + 0.32 * u1 - 1.4 * u2 * u2, h.z); lid.rotation.set(Math.PI / 2 * u1 * 0.92, Math.PI / 4 * u1, 0);
      h.cone.visible = f >= F.HOLES2 - 20 + h.r * 20 && f > fs + 16 && !cut; }
    // ---------- Greta's lids ----------
    const rollX = (g) => lerp(-7.5, 2.0, clamp(g / 104, 0, 1));
    if (f < 110) { const rx = rollX(f); LID0.position.set(rx, RL + 0.02, 0.3); LID0.rotation.set(Math.PI / 2, 0, -rx / RL); LID0.visible = true; }
    else if (f >= F.ROLLED - 6) { const u = clamp((f - F.ROLLED + 6) / 70, 0, 1), rx = lerp(-6.0, -1.2, 1 - (1 - u) * (1 - u)); LID0.position.set(rx, RL + 0.02, 2.4); LID0.rotation.set(Math.PI / 2, 0, -rx / RL); LID0.visible = true; }
    else LID0.visible = false;
    // the tilt test (line 10): Greta tilts her round lid over the hole: it can't go in
    const tilt = f >= 1100 && f < 1165; LIDR.visible = tilt || (f >= 1041 && f < 1100);
    { const hx = 6.0, hz = HZ; if (f < 1100) { LIDR.position.set(hx, 0.07, hz); LIDR.rotation.set(0, f * 0.01, 0); }
      else { const a = 1.2 * Math.abs(Math.sin((f - 1100) * 0.09)); LIDR.position.set(hx - 0.35 * Math.sin(a) * 0, 0.07 + 0.42 * Math.sin(a), hz); LIDR.rotation.set(a, 0.0, 0); } }
    // ---------- traffic: cars before the chaos, the delivery truck bumps lids in week three ----------
    const t = f / 30;
    CARS.forEach((c, k) => { const dir = k % 2 ? -1 : 1, z = dir > 0 ? -1.6 : 1.6, xx = dir > 0 ? -40 + ((t * 7 + k * 25) % 80) : 40 - ((t * 6 + k * 30) % 80);
      const stuck = f > F.HOLES2 - 20 && f < 1170; c.g.visible = !cut; c.g.position.set(stuck ? (k - 1) * 9 + 14 : xx, 0, z); c.g.rotation.y = dir > 0 ? 0 : Math.PI; for (const w of c.wheels) w.rotation.z = -(stuck ? 0 : xx) / 0.36 * dir; });
    const tx = f < F.TRUCKS - 30 ? -60 : lerp(-26, 30, clamp((f - F.TRUCKS + 30) / 110, 0, 1)); TRUCK.g.position.set(tx, Math.abs(Math.sin(f * 0.9)) * 0.04 * (f > F.TRUCKS && f < 760 ? 1 : 0), -HZ); for (const w of TRUCK.wheels) w.rotation.z = -tx / 0.36; TRUCK.g.visible = !cut;
    // ---------- characters ----------
    K.set.extrasFrame(f, EXTRAS, T); EXTRAS.forEach((e, k) => { e.r.root.visible = !cut && !(k >= 9 && ((f >= 229 && f < 282) || f >= 1222)); });
    if (f < 110) { const gx = rollX(f) - 0.75;
      GRETA.set(T.act(f, [[0, 'push', { expr: 'deadpan' }]], { seed: 2, blink: blinkAt(f, 2), phase: (f / 30 * 1.1) % 1 }), { x: gx, z: 0.7, yaw: Math.PI / 2 });
    } else {
      const gk = [[0, 'hips', { expr: 'deadpan' }], [F.LAUGH, 'idle', { expr: 'deadpan', look: 0.5 }], [F.PIZZA + 12, 'cross', { expr: 'deadpan' }], [F.CHEAP, 'shrug', { expr: 'deadpan' }],
        [F.CIRCLE - 30, 'grab', { expr: 'deadpan' }], [F.WIDTH, 'point', { expr: 'smug' }], [F.NEVER, 'hips', { expr: 'smug' }], [F.BEG - 4, 'cross', { expr: 'deadpan' }], [F.ROLLED - 8, 'push', { expr: 'deadpan' }], [F.PIZZA2, 'hips', { expr: 'smile' }]];
      let gx = -5.4, gz = 4.9, gy = 0.15, yaw = 0.5;
      if (f >= 1041 && f < 1165) { gx = 7.0; gz = 2.6; gy = 0; yaw = -2.36; }
      if (f >= F.ROLLED - 10) { gx = lerp(-6.8, -2.6, sm(F.ROLLED - 6, F.ROLLED + 60, f)); gz = 2.85; gy = 0; yaw = Math.PI / 2; }
      GRETA.set(T.act(f, gk, { seed: 2, blink: blinkAt(f, 2) }), { x: gx, y: gy, z: gz, yaw, visible: !cut });
    }
    { const bk = [[0, 'hips', { expr: 'smug' }], [F.LAUGH - 3, 'point', { expr: 'laugh', talk: true }], [F.PIZZA + 10, 'clap', { expr: 'laugh' }], [F.CHEAP, 'show', { expr: 'gloat', R: [0.42, -0.6, 'money'] }],
        [F.BOUGHT + 10, 'cheer', { expr: 'grin' }], [F.TWELVE, 'idle', { expr: 'smug' }], [F.SHRUG - 3, 'shrug', { expr: 'smug', talk: true }], [F.TRUCKS, 'idle', { expr: 'nervous' }],
        [F.FORTY, 'shock', { expr: 'scared', sweat: true }], [F.HOLES2, 'panic', { expr: 'scared', sweat: true }], [F.CONES, 'facepalm', { expr: 'sad', sweat: true }],
        [F.BEG - 3, 'beg', { expr: 'beg', talk: true, sweat: true }], [F.ROLLED + 20, 'shock', { expr: 'confused' }], [F.PIZZA2, 'facepalm', { expr: 'deadpan' }]];
      let bx = -2.4, bz = 4.6, yaw = -0.4;
      if (f >= 548 && f < 813) { bx = 1.4; bz = 3.4; yaw = -0.5; }
      if (f >= 1160) { bx = -0.3; bz = 1.0; yaw = -Math.PI / 2 - 0.5; }
      BRUNO.set(T.act(f, bk, { seed: 6, blink: blinkAt(f, 6) }), { x: bx, z: bz, yaw, visible: !cut, y: f >= 548 && f < 813 ? 0 : f >= 1160 ? 0 : 0.15 }); }
    // the worker lifts the main lid (week one)
    { const wk = [[0, 'idle', { expr: 'neutral' }], [F.LIFT - 8, 'crouch', { expr: 'neutral', R: [0.2, 0.6, 'open'] }], [F.LIFT + 4, 'reach', { expr: 'confused' }], [F.CLUNK, 'shock', { expr: 'shock' }], [F.FELL + 6, 'facepalm', { expr: 'sad' }]];
      WORKER.set(T.act(f, wk, { seed: 12, blink: blinkAt(f, 12) }), { x: 0.0, z: HZ + 0.85, yaw: Math.PI, visible: f >= 429 && f < 548 }); }
    // the table through the narrow door (cutaway, x = 90): carried toward the door, tilted on its diagonal, through
    { const u = clamp((f - 813) / 100, 0, 1), px = 90.0, pz = lerp(4.0, -1.4, u), tiltA = sm(F.TILT - 6, F.TILT + 10, f);
      CARRIER.set(T.act(f, [[0, 'carry', { expr: 'nervous', item: 'none' }], [F.TILT, 'carry', { expr: 'smile', item: 'none' }]], { seed: 14, blink: blinkAt(f, 14), phase: (f / 30 * 1.0) % 1 }), { x: px, z: pz + 0.75, yaw: Math.PI, visible: cut });
      TABLE.visible = cut; TABLE.position.set(px, 0.55 + 0.25 * tiltA, pz); TABLE.rotation.set(0, 0, -1.15 * tiltA); TABLE.position.y = 0.4 + 0.45 * tiltA; }
    // the dog: rides the rolling lid (frame 0), sits with Greta, rides again with a pizza box at the end
    { let dp;
      if (f < 110) { const rx = rollX(f); DOG.set(f, { x: rx, y: RL * 2 + 0.03, z: 0.3, yaw: -Math.PI / 2, mode: 'walk', speed: 1.4, expr: 'happy' }); }
      else if (f >= F.ROLLED - 6) { const p = LID0.position; DOG.set(f, { x: p.x, y: RL * 2 + 0.03, z: 2.4, yaw: -Math.PI / 2, mode: f < F.ROLLED + 64 ? 'walk' : 'sit', speed: 1.4, expr: 'happy' }); }
      else if (tilt) DOG.set(f, { x: 6.9, y: 0, z: 2.6, yaw: -0.8, mode: 'sit', expr: 'happy', look: 0.3 });
      else DOG.set(f, { x: -6.3, y: 0.15, z: 5.4, yaw: 0.6, mode: f > F.PIZZA && f < F.PIZZA + 40 ? 'wag' : 'sit', expr: f > F.LAUGH && f < F.PIZZA + 30 ? 'angry' : 'neutral', visible: !cut });
      PIZZA.visible = f >= F.ROLLED - 6; const dpos = DOG.root.position; PIZZA.position.set(dpos.x - 0.05, dpos.y + 0.52, dpos.z); PIZZA.rotation.y = 0.2; }
    // x-ray explainers
    const xs = f >= 915 && f < 1041, xc = f >= 1041 && f < 1100;
    const H0 = HOLES.find((h) => h.x === 9 && h.z > 0) || HOLES[0];
    HOLOS.visible = xs; HOLOS.position.set(H0.x, -0.25, H0.z);
    TSIDE.mesh.position.set(H0.x, 0, H0.z); TDIAG.mesh.position.set(H0.x, 0, H0.z); TSIDE.show(xs ? sm(F.SIDE - 8, F.SIDE + 4, f) : 0); TDIAG.show(xs ? sm(F.DIAG - 6, F.DIAG + 8, f) : 0);
    TCIRC.mesh.position.set(6.0, 0.06, HZ); TCIRC.show(xc ? sm(F.CIRCLE - 6, F.CIRCLE + 10, f) : 0);
    TDIAM.visible = xc && f > F.CIRCLE + 4; TDIAM.position.set(6.0, 0.2, HZ); TDIAM.rotation.y = (f - F.CIRCLE) * 0.08;
    // the tilted square lid demo on H0 (line 9): turns on its diagonal and drops through
    if (xs) { const u1 = sm(F.DROPS - 28, F.DROPS - 6, f), u2 = clamp((f - F.DROPS + 4) / 10, 0, 1); H0.lid.visible = u2 < 1; H0.lid.scale.setScalar(1);
      H0.lid.position.set(H0.x, 0.05 + 0.45 * u1 - 1.4 * u2 * u2, H0.z); H0.lid.rotation.set(Math.PI / 2 * u1 * 0.95, Math.PI / 4 * u1, 0); H0.cone.visible = false; }

    // ---------- shots ----------
    let cam, dof, u; const sh = (a0, b0) => (u = clamp((f - a0) / (b0 - a0), 0, 1), f >= a0 && f < b0);
    const head = (rig) => { rig.root.updateMatrixWorld(true); const v = new THREE.Vector3(); rig.head.getWorldPosition(v); return [v.x, v.y, v.z]; };
    const orbit = (tg, yaw, pitch, dist, fov) => { const a0 = yaw * Math.PI / 180, p = pitch * Math.PI / 180; return { pos: [tg[0] + Math.sin(a0) * Math.cos(p) * dist, tg[1] + Math.sin(p) * dist, tg[2] + Math.cos(a0) * Math.cos(p) * dist], look: tg, fov }; };
    const shakeIt = (c, f0, amp, dur) => { const [sx, sy] = K.shake(f, f0, amp, dur); c.pos[0] += sx; c.pos[1] += sy; return c; };
    if (sh(0, 52)) {             // 1. Greta rolls a giant iron coin down Main Street, the dog walking on top (low front tracking)
      const tc = K.track(f, (g) => [rollX(g), 0, 0.3], { off: [3.2, 1.0, 2.6], lag: 2, lead: 0.2, lookY: 1.0 }); cam = { ...tc, fov: 44 }; dof = { focus: 4.2, cinf: 9 };
    } else if (sh(52, 107)) {    // 2. side telephoto: the dog trotting on the rolling lid
      const tc = K.track(f, (g) => [rollX(g), 0, 0.3], { off: [-0.5, 1.5, 3.4], lag: 3, lead: 0.15, lookY: 1.25 }); cam = { ...tc, fov: 42 }; dof = { focus: 3.2, cinf: 10 };
    } else if (sh(107, 165)) {   // 3. crane over Main Street: 300 open holes
      cam = { pos: [lerp(-14, -11, u), lerp(9.5, 8, u), 2.8], look: [4, 0, 0], fov: 46 }; dof = { focus: 14, cinf: 2 };
    } else if (sh(165, 229)) {   // 4. macro: looking down into one dark hole
      cam = { pos: [lerp(0.9, 0.6, u), 1.2, HZ + 1.3], look: [0, 0, HZ], fov: 40 * K.push(u, 0.1) }; dof = { focus: 1.6, cinf: 16 };
    } else if (sh(229, 282)) {   // 5. Bruno laughs at the round lids (pizza shop?)
      cam = orbit(head(BRUNO), lerp(-25, -15, u), 4, 2.3, 40 * K.punch(f, F.PIZZA, 0.14, 7)); dof = { focus: 2.3, cinf: 14 };
    } else if (sh(282, 330)) {   // 6. reaction: Greta deadpan by her cart, the dog growling
      cam = orbit(head(GRETA), lerp(10, 20, u), 0, 2.6, 40 * K.push(u, 0.08)); dof = { focus: 2.6, cinf: 13 };
    } else if (sh(330, 380)) {   // 7. the price board: square $5, round $9
      cam = { pos: [lerp(-8.0, -8.6, u), 2.1, lerp(0.6, 1.0, u)], look: [-10.5, 1.9, 5.4], fov: 46 }; dof = { focus: 4, cinf: 10 };
    } else if (sh(380, 431)) {   // 8. down the street: square lids pop in, all three hundred
      cam = { pos: [lerp(-22, -19, u), 1.6, 0.2], look: [10, 0, 0.2], fov: 38 }; dof = { focus: 10, cinf: 4 };
    } else if (sh(431, 480)) {   // 9. week one: the worker crouches at the hero lid (wide)
      cam = { pos: [lerp(3.6, 3.2, u), 1.9, 6.0], look: [0, 0.6, HZ], fov: 42 }; dof = { focus: 5, cinf: 8 };
    } else if (sh(480, 520)) {   // 10. close: he lifts it... it tilts
      cam = { pos: [lerp(-1.6, -1.4, u), 0.8, HZ + 2.0], look: [0, 0.4, HZ], fov: 40 }; dof = { focus: 2.5, cinf: 12 };
    } else if (sh(520, 548)) {   // 11. macro: CLUNK, it drops into its own hole (shake)
      cam = shakeIt({ pos: [0.7, 0.45, HZ + 0.9], look: [0, 0.05, HZ], fov: 40 * K.punch(f, F.CLUNK, 0.15, 6) }, F.CLUNK, 0.03, 12); dof = { focus: 1.1, cinf: 18 };
    } else if (sh(548, 597)) {   // 12. week two: top-down on the street, twelve lids gone
      cam = { pos: [lerp(2, 4, u), 13, 3.5], look: [3, 0, 0], fov: 44 }; dof = { focus: 13, cinf: 2 };
    } else if (sh(597, 647)) {   // 13. Bruno shrugs: just fish them out!
      cam = orbit(head(BRUNO), lerp(30, 20, u), 4, 2.2, 40); dof = { focus: 2.2, cinf: 14 };
    } else if (sh(647, 690)) {   // 14. week three: the truck rumbles over the lids (tracking low)
      const tc = K.track(f, () => [TRUCK.g.position.x, 0, -HZ], { off: [2.5, 0.7, 4.6], lag: 3, lead: 0.15, lookY: 0.6 }); cam = shakeIt({ ...tc, fov: 44 }, F.FLIP, 0.03, 12); dof = { focus: 5, cinf: 8 };
    } else if (sh(690, 728)) {   // 15. lids flip and drop all down the street (punch)
      cam = { pos: [lerp(16, 14, u), 2.4, 4.4], look: [0, 0, 0], fov: 42 * K.punch(f, F.FORTY, 0.15, 7) }; dof = { focus: 14, cinf: 4 };
    } else if (sh(728, 770)) {   // 16. Main Street: holes, cones, stuck cars (high wide)
      cam = { pos: [lerp(-10, -8, u), 6.5, 3.0], look: [6, 0, 0], fov: 46 }; dof = { focus: 16, cinf: 2 };
    } else if (sh(770, 813)) {   // 17. Bruno sweating among the cones
      cam = orbit(head(BRUNO), lerp(-35, -25, u), -4, 2.1, 40 * K.push(u, 0.1)); dof = { focus: 2.1, cinf: 15 };
    } else if (sh(813, 862)) {   // 18. cutaway: a table too wide for a narrow door
      cam = { pos: [lerp(93.5, 93, u), 2.2, lerp(5.6, 5.0, u)], look: [90, 1.0, 1.2], fov: 44 }; dof = { focus: 5, cinf: 8 };
    } else if (sh(862, 915)) {   // 19. tilt it on its diagonal: it slips through (low, from the far side)
      cam = { pos: [lerp(91.6, 91.2, u), 0.9, -3.4], look: [90, 1.1, 0.5], fov: 44 }; dof = { focus: 4, cinf: 9 };
    } else if (sh(915, 975)) {   // 20. x-ray: side vs diagonal of the square hole
      cam = { pos: [H0.x + lerp(0.6, 0.3, u), 2.2, H0.z + 1.9], look: [H0.x, -0.1, H0.z], fov: 42 }; dof = { focus: 2.8, cinf: 12 };
    } else if (sh(975, 1041)) {  // 21. the lid turns on its diagonal and drops straight through
      cam = shakeIt({ pos: [H0.x + 1.8, 0.8, H0.z + 1.6], look: [H0.x, 0.2, H0.z], fov: 40 * K.punch(f, F.DROPS, 0.12, 6) }, F.DROPS + 6, 0.025, 12); dof = { focus: 2.4, cinf: 12 };
    } else if (sh(1041, 1100)) { // 22. x-ray: a circle is the same width every way (the glowing diameter spins)
      cam = { pos: [lerp(4.6, 4.8, u), 2.4, HZ + 1.7], look: [6.0, 0, HZ], fov: 42 }; dof = { focus: 2.9, cinf: 12 };
    } else if (sh(1100, 1160)) { // 23. Greta tilts her lid over the hole: it can never fall in
      cam = { pos: [lerp(8.2, 8.0, u), 1.3, HZ + 2.9], look: [6.2, 0.6, HZ + 0.4], fov: 42 * K.push(u, 0.1) }; dof = { focus: 3.4, cinf: 10 };
    } else if (sh(1160, 1222)) { // 24. Bruno begs
      cam = orbit(head(BRUNO), lerp(-110, -100, u), 2, 2.1, 40 * K.push(u, 0.1)); dof = { focus: 2.1, cinf: 14 };
    } else if (sh(1222, 1290)) { // 25. she rolls him one: the dog rides it with a pizza box (tracking)
      const tc = K.track(f, () => { const p = LID0.position; return [p.x, 0, p.z]; }, { off: [1.8, 0.9, 2.8], lag: 3, lead: 0.15, lookY: 1.0 }); cam = { ...tc, fov: 46 }; dof = { focus: 3.3, cinf: 9 };
    } else {                     // 26. close: the dog and the pizza box on the lid, Bruno behind (hold)
      const d = DOG.root.position; cam = orbit([d.x - 0.15, d.y + 0.3, d.z], lerp(-38, -28, u), 6, 2.4, 40 * K.push(u, 0.12)); dof = { focus: 1.8, cinf: 15 };
    }
    // ---------- particles + graphics ----------
    K.leaves(f, cam.look, { area: 12, count: 18, fall: 0.4, colors: ['#4f9a3a', '#6ab84a', '#f2c12e'] });
    for (const h of HOLES) { const fs = fallStart(h); if (fs < 1e8) K.puff(f, fs + 14, h.x, h.z, 6, 0.4, '#b8b0a0'); }
    if (cut) K.puff(f, F.SLIPS + 6, 90, -0.6, 6, 0.4, '#d8c8a8');
    K.badge(f, F.COIN, 'ROUND IRON LID', [rollX(Math.min(f, 104)), 1.9, 2.9], { icon: 'check', f1: 104 });
    K.badge(f, F.HOLES, '300 HOLES', { sx: 0.5, sy: 0.32 }, { icon: 'warn', f1: 227, size: 1.25 });
    K.badge(f, F.PIZZA, 'PIZZA SHOP?', { sx: 0.5, sy: 0.3 }, { style: 'stamp', f1: 328, size: 1.4 });
    K.hud(f, F.WEEKS, { stages: 3, labels: ['WEEK 1', 'WEEK 2', 'WEEK 3'], u: clamp((f - F.WEEKS) / (F.HOLES2 - F.WEEKS), 0, 1), f1: 811 });
    K.badge(f, F.FORTY, '40 LIDS GONE', { sx: 0.5, sy: 0.4 }, { icon: 'down', f1: 726, size: 1.2 });
    if (xs) { K.badge(f, F.SIDE - 2, 'SIDE 84 cm', [H0.x, 0.5, H0.z + 0.6], { icon: 'x', f1: 1039, ring: '#ff5a4a' }); K.badge(f, F.DIAG + 4, 'DIAGONAL 119 cm', [H0.x, 0.95, H0.z], { icon: 'up', f1: 1039 }); }
    if (xc || tilt) K.badge(f, F.WIDTH, 'SAME WIDTH', [6.0, 1.0, HZ], { icon: 'check', f1: 1158, ring: '#7aff9a' });
    const light = cut ? K.light('interior', { az: 70, el: 45, exposure: 1.35 }) : K.light('golden', { az: 75, el: 34, shadowExt: 26 });
    return { light, cam, dof, actors: [], fx: [] };
  },
};
