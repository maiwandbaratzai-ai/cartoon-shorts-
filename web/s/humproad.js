// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Roads Are Higher in the Middle" — invented story, engine: The Rivals, told from the loser's side (SCRIPTS.md §000).
// Mayor Doug ("Smooth as a pancake!") opens a perfectly flat Flatbury Road (golden scissors, 400 people clap) and mocks Hilda of
// Humpton's humped road ("Her road has a spine!"); she buys a bike. A week of rain: puddles, ankle-deep, the bus needs a captain,
// pizza by canoe, the fire truck gets a paddle; Admiral Puddles the duck gets his dream lake, with traffic. Doug's sofa-sized
// sponge swells like a whale and floats away with him. Hilda bikes to work, dry socks. Explainer: rain rolls off the high middle
// into the gutters; a flat road has no downhill, water sits and soaks in -> 200 potholes (one with a fish). Doug rebuilds with a
// hump; Admiral Puddles loses his lake, so he moves into Doug's bathtub.
import { TOTAL, LINES, wf } from './humproad_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const RW = 3.6;                                // half road width
const EX = 70, EZ = 0;                         // explainer spot
const BX = -70, BZ = 30;                       // Doug's bathroom
let THREE, F = {}, DOUG, HILDA, DUCK, CAPHAT, CROWD = [], WATER, PUDDLES = [], HOLES = [], FLATROAD, NEWHUMP, BUS, CARS = [], FTRUCK, CANOE, PIZZA, BUSDRV, FIREMAN, SPONGE, RIBBON = [], BIKE, SCISSORS,
  XS1, XS2, DROPS1 = [], DROPS2 = [], POOL, CRACKS = [], GUT = [], FISH, TUB, TUBW, BUBS = [];

function crownGeo(len, w, h, nx = 40, nz = 24) { const g = new THREE.PlaneGeometry(len, w, nx, nz); g.rotateX(-Math.PI / 2); const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const z = p.getZ(i); p.setY(i, h * (1 - (z / (w / 2)) ** 2)); } g.computeVertexNormals(); return g; }
function bus(K, parent) { const g = new THREE.Group(); parent.add(g); const S = K.set;
  K.rbox(5.4, 2.1, 2.3, 0.3, K.paint('#f2c230', { rough: 0.3 }), 0, 1.4, 0, g); K.rbox(5.45, 0.18, 2.35, 0.06, K.paint('#1a1a1a'), 0, 0.5, 0, g);
  for (let k = 0; k < 5; k++) for (const sz of [-1, 1]) K.rbox(0.8, 0.7, 0.04, 0.05, K.glass({ color: '#bfe4ff', opacity: 0.6 }), -1.9 + k * 0.95, 1.9, sz * 1.16, g);
  K.rbox(0.05, 0.9, 1.9, 0.05, K.glass({ color: '#bfe4ff', opacity: 0.6 }), 2.71, 1.85, 0, g);
  for (const x of [-1.8, 1.7]) for (const sz of [-1, 1]) { const w = K.cyl(0.45, 0.45, 0.3, K.paint('#1a1a1a', { rough: 0.6 }), x, 0.45, sz * 1.1, g, 20); w.rotation.x = Math.PI / 2; w.position.set(x, 0.45, sz * 1.1); }
  const l = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.4), S.textMat('FLATBURY BUS', { bg: '#1a1a1a', fg: '#f2c230', w: 700, h: 110, border: false })); l.position.set(-0.4, 1.15, 1.17); g.add(l);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return g; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { LAKE: wf(0, 'lake'), DUCK: wf(0, 'duck'), PAN: wf(1, 'smooth'), WHY: wf(1, 'why'), MIDDLE: wf(1, 'middle'), CUT: wf(2, 'cut'), RIBBON: wf(2, 'ribbon'), SCIS: wf(2, 'scissors'), FOUR: wf(2, 'four'), CLAP: wf(2, 'clapped'),
      HILDA: wf(3, 'hilda'), HUMPTON: wf(3, 'humpton'), HUMP: wf(3, 'hump'), LAUGH: wf(4, 'laughed'), SPINE: wf(4, 'has') + 8, ARGUE: wf(5, 'argue'), BIKE: wf(5, 'bike'), RAIN: wf(6, 'rained'), WEEK: wf(6, 'week'),
      D1: wf(7, 'day'), PUDDLES: wf(7, 'puddles'), D3: 592, ANKLE: wf(7, 'ankle'), D5: 624, BUSW: wf(7, 'bus'), CAPT: wf(7, 'captain'), PIZZA: wf(8, 'pizza'), CANOE: wf(8, 'canoe'), FIRE: wf(8, 'fire'), PADDLE: wf(8, 'paddle'),
      ADM: wf(9, 'admiral'), WANTED: wf(9, 'wanted'), LAKE2: wf(9, 'lake'), TRAFFIC: wf(9, 'traffic'), SPONGE: wf(10, 'sponge'), SOFA: wf(10, 'sofa'), PAN2: wf(10, 'as') - 12, DRANK: wf(11, 'drank'), SWELL: wf(11, 'swelled'),
      WHALE: wf(11, 'whale'), FLOATED: wf(11, 'floated'), HUMPTON2: wf(12, 'humpton'), RODE: wf(12, 'rode'), DRY: wf(12, 'dry'), WHAT: wf(13, 'what'), RAIN2: wf(14, 'rain'), ROLLS: wf(14, 'rolls'), GUTTERS: wf(14, 'gutters'),
      FLAT: wf(15, 'flat'), NODOWN: wf(15, 'downhill'), SITS: wf(15, 'sits'), SOAKS: wf(15, 'soaks'), DRAINED: wf(16, 'drained'), SWISS: wf(16, 'swiss'), TWO: wf(16, 'two'), POTHOLES: wf(16, 'potholes'), FISH: wf(16, 'fish'),
      REBUILT: wf(17, 'rebuilt'), HUMP2: wf(17, 'hump'), LOST: wf(17, 'lost'), MOVED: wf(18, 'moved'), BATH: wf(18, 'bathtub') };
    F.D3 = F.ANKLE - 18; F.D5 = F.BUSW - 13;
    // ================= Flatbury + Humpton =================
    const G = K.group();
    K.slab(-120, 120, -0.3, 0, -80, 80, K.mat('grime', '#6aa84f', { amt: 0.55, detail: 1.2 }), G, false);
    FLATROAD = K.slab(-40, 0, 0, 0.02, -RW, RW, K.mat('grime', '#4a4a52', { detail: 0.6, amt: 0.2 }), sc, false);
    for (let x = -39; x < 0; x += 3) K.slab(x, x + 1.6, 0.02, 0.026, -0.08, 0.08, K.paint('#f4f2ee', { coat: 0 }), G, false);
    const hump = new THREE.Mesh(crownGeo(40, RW * 2, 0.32), K.mat('grime', '#4a4a52', { detail: 0.6, amt: 0.2 })); hump.position.set(20, 0, 0); hump.receiveShadow = true; G.add(hump);
    for (let x = 1; x < 40; x += 3) { const d = K.slab(x, x + 1.6, 0.325, 0.33, -0.08, 0.08, K.paint('#f2c230', { coat: 0 }), G, false); }
    for (const s of [-1, 1]) { K.slab(-40, 40, 0, 0.25, s * RW, s * (RW + 0.25), K.mat('rock', '#c8c4bc', { detail: 0.4 }), G); K.slab(-40, 40, 0, 0.24, s * (RW + 0.25), s * 6.2, K.mat('brick', '#b8a890', { detail: 0.5 }), G);
      K.slab(0, 40, 0.0, 0.03, s * (RW - 0.35), s * RW, K.paint('#2a2a30', { coat: 0 }), G, false); }                  // Humpton gutters
    for (const s of [-1, 1]) for (let x = 2; x < 40; x += 6) K.rbox(0.5, 0.04, 0.3, 0.01, K.paint('#3a3a40', { metal: 0.6 }), x, 0.03, s * (RW - 0.18), G);   // drain grates
    // buildings only on the far side (so cameras on the near side never sit inside one)
    let x = -40, i = 0; while (x < 40) { const w = 5 + (i * 7 % 3); const hum = x > 0; const shop = hum ? ['BIKES', null, 'BAKERY', null, 'HUMPTON HALL', null][i % 6] : ['FLATBURY HALL', null, 'PIZZA', null, 'SPONGES R US', 'BOOKS'][i % 6];
      const b = S.building({ w, d: 9, floors: 2 + (i % 3), seed: i + 31, shop, shutters: i % 3 === 0 ? (hum ? '#2a62c8' : '#7a2a2a') : null, flowers: i % 2 === 0, kind: i % 4 === 3 ? 'plaster' : 'brick', gable: ['pitched', 'step', 'bell', 'flat'][i % 4] });
      b.position.set(x + w / 2, 0.24, -6.4 - 4.5); x += w + 0.05; i++; }
    for (let k = -36; k <= 36; k += 9) { const l = S.streetLamp(); l.position.set(k, 0.24, -5.6); }
    for (let k = -38; k <= 38; k += 7) { const t = S.tree({ h: 4.2, seed: k }); t.position.set(k + 2.5, 0.24, -5.3); }
    for (const [bx, r] of [[-20, 0], [14, 0]]) { const b = S.bench(); b.position.set(bx, 0.24, 5.5); b.rotation.y = Math.PI; }
    for (let k = -38; k <= 38; k += 2.5) K.rbox(0.1, 0.9, 0.1, 0.02, K.mat('wood', '#f4efe4'), k, 0.45, 6.9, G); K.rbox(78, 0.08, 0.06, 0.02, K.mat('wood', '#f4efe4'), 0, 0.75, 6.9, G);
    const s1 = S.board('WELCOME TO|HUMPTON', 1.8, 1.0, { frame: '#2a62c8' }); s1.position.set(0.8, 0.24, 4.6); s1.rotation.y = -0.3;
    const s2 = S.board('FLATBURY|SMOOTH AS A PANCAKE', 1.9, 1.0, { frame: '#c0392b' }); s2.position.set(-1.2, 0.24, 4.6); s2.rotation.y = 0.3;
    const mb = K.rbox(0.5, 1.1, 0.45, 0.06, K.paint('#c0392b'), -16, 0.79, 4.6, G);
    S.bake(G);
    // ================= water, puddles, potholes, rebuilt hump =================
    WATER = new THREE.Mesh(new THREE.PlaneGeometry(40, 14, 1, 1), K.paint('#3a8ac0', { rough: 0.06 })); WATER.material.transparent = true; WATER.material.opacity = 0.82; WATER.rotation.x = -Math.PI / 2; WATER.position.set(-20, 0, 0); sc.add(WATER);
    for (let k = 0; k < 14; k++) { const p = K.cyl(0.6 + hash(k) * 0.9, 0.6 + hash(k) * 0.9, 0.01, K.paint('#4a8ab8', { rough: 0.05 }), -38 + hash(k + 1) * 36, 0.025, (hash(k + 2) - 0.5) * 5.4, sc, 24); p.scale.z = 0.6; PUDDLES.push(p); }
    for (let k = 0; k < 70; k++) { const h = K.cyl(0.25 + hash(k + 9) * 0.35, 0.2 + hash(k + 9) * 0.3, 0.012, K.paint('#1e1e22', { rough: 0.9, coat: 0 }), -38 + hash(k + 10) * 37, 0.02, (hash(k + 11) - 0.5) * 6.4, sc, 14); h.scale.z = 0.7 + hash(k) * 0.4; HOLES.push(h); }
    NEWHUMP = new THREE.Mesh(crownGeo(40, RW * 2, 0.32), K.mat('grime', '#3a3a42', { detail: 0.6, amt: 0.2 })); NEWHUMP.position.set(-20, 0.01, 0); NEWHUMP.receiveShadow = true; sc.add(NEWHUMP);
    FISH = new THREE.Group(); sc.add(FISH); K.sphere(0.18, K.paint('#f08a2a', { rough: 0.3 }), 0, 0, 0, FISH, 1.6, 0.8, 0.6); const tl = K.cyl(0, 0.14, 0.18, K.paint('#f08a2a'), -0.32, -0.09, 0, FISH, 4); tl.rotation.z = Math.PI / 2; tl.position.set(-0.36, 0, 0); K.sphere(0.03, K.paint('#1a1a1a'), 0.18, 0.05, 0.08, FISH);
    // ================= floating traffic =================
    BUS = bus(K, sc);
    for (const [cxx, kind, seed] of [[-6, 'hatch', 2], [-26, 'taxi', 4], [-31, 'hatch', 6]]) { const c = S.car({ kind, seed }); c.g.userData.x0 = cxx; CARS.push(c); }
    FTRUCK = new THREE.Group(); sc.add(FTRUCK); K.rbox(4.6, 1.6, 2.1, 0.2, K.paint('#d0302a', { rough: 0.3 }), 0, 1.2, 0, FTRUCK); K.rbox(1.4, 1.0, 2.0, 0.15, K.glass({ color: '#bfe4ff', opacity: 0.6 }), 1.6, 2.2, 0, FTRUCK);
    for (let k = 0; k < 6; k++) K.rbox(0.06, 0.06, 0.6, 0.01, K.chrome(), -1.8 + k * 0.5, 2.3, 0, FTRUCK); K.rbox(3.0, 0.08, 0.08, 0.02, K.chrome(), -0.6, 2.3, 0.3, FTRUCK); K.rbox(3.0, 0.08, 0.08, 0.02, K.chrome(), -0.6, 2.3, -0.3, FTRUCK);
    const pad = new THREE.Group(); pad.position.set(0.4, 2.0, 1.4); FTRUCK.add(pad); K.cyl(0.05, 0.05, 2.6, K.mat('wood', '#c8945a'), 0, -1.3, 0, pad, 8); K.rbox(0.4, 0.8, 0.06, 0.1, K.mat('wood', '#c8945a'), 0, -1.6, 0, pad); pad.rotation.x = 0.6; FTRUCK.userData.pad = pad;
    const ftl = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.35), S.textMat('FIRE DEPT', { bg: '#d0302a', fg: '#f2c230', w: 512, h: 90, border: false })); ftl.position.set(-0.6, 1.2, 1.06); FTRUCK.add(ftl);
    CANOE = new THREE.Group(); sc.add(CANOE); const cg = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), K.paint('#c8702a', { rough: 0.4 })); cg.scale.set(1.6, 0.35, 0.42); cg.material.side = THREE.DoubleSide; CANOE.add(cg);
    PIZZA = K.rbox(0.45, 0.06, 0.45, 0.01, K.paint('#f4efe4'), 0.5, 0.1, 0, CANOE); const pl = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.12), S.textMat('PIZZA', { bg: '#c0392b', fg: '#ffffff', w: 256, h: 80 })); pl.rotation.x = -Math.PI / 2; pl.position.set(0.5, 0.14, 0); CANOE.add(pl);
    // the sponge (sofa-sized, then a whale)
    SPONGE = new THREE.Group(); sc.add(SPONGE); K.rbox(2.4, 0.9, 1.3, 0.25, K.mat('grime', '#f2d040', { detail: 0.15, amt: 0.4, bump: 0.01 }), 0, 0.45, 0, SPONGE);
    for (let k = 0; k < 26; k++) { const h = K.sphere(0.06 + hash(k + 60) * 0.05, K.paint('#b8901a', { rough: 0.9, coat: 0 }), (hash(k + 61) - 0.5) * 2.2, 0.1 + hash(k + 62) * 0.7, 0.66, SPONGE, 1, 1, 0.3); }
    K.rbox(2.42, 0.18, 1.32, 0.08, K.paint('#2a9a4a', { rough: 0.5 }), 0, 0.92, 0, SPONGE);
    const stg = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.3), S.textMat('XXL', { bg: '#f4efe4', fg: '#1a1a1a', w: 256, h: 90 })); stg.position.set(0.7, 0.5, 0.67); SPONGE.add(stg);
    // ribbon + posts + giant scissors
    for (const z of [-RW - 0.3, RW + 0.3]) RIBBON.push(K.rbox(0.12, 1.3, 0.12, 0.03, K.gold(), -12, 0.65, z, sc));
    for (const sz of [-1, 1]) { const r = K.rbox(0.04, 0.3, RW + 0.3, 0.02, K.paint('#d0302a', { rough: 0.4 }), -12, 1.15, sz * (RW + 0.3) / 2, sc); RIBBON.push(r); }
    SCISSORS = new THREE.Group(); sc.add(SCISSORS); for (const s of [-1, 1]) { const b = K.rbox(0.08, 0.04, 0.8, 0.02, K.gold(), 0, 0, 0.4, SCISSORS); b.rotation.y = s * 0.25; const r = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 8, 16), K.gold()); r.position.set(s * 0.12, 0, -0.1); r.rotation.x = Math.PI / 2; SCISSORS.add(r); }
    BIKE = S.bike({ color: '#2a62c8' });
    // ================= explainer: two road cross-sections =================
    const mk = (z, crowned) => { const g = new THREE.Group(); g.position.set(EX, 0, z); sc.add(g);
      K.rbox(9, 1.0, 1.6, 0.04, K.mat('dirt', '#8a6a4a', { detail: 0.3 }), 0, 0.5, 0, g); K.rbox(8, 0.35, 1.6, 0.04, K.mat('rock', '#a8a098', { detail: 0.2 }), 0, 1.15, 0, g);
      const top = new THREE.Mesh(crowned ? crownGeo(1.6, 8, 0.45, 4, 32) : new THREE.PlaneGeometry(1.6, 8).rotateX(-Math.PI / 2), K.mat('grime', '#3a3a42', { detail: 0.3 })); top.rotation.y = Math.PI / 2; top.position.y = 1.33; g.add(top);
      if (crowned) { const sh = new THREE.Shape(); sh.moveTo(-4, 0); for (let k = 0; k <= 32; k++) { const xx = -4 + k / 4; sh.lineTo(xx, 0.45 * (1 - (xx / 4) ** 2)); } sh.lineTo(-4, 0); const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 1.6, bevelEnabled: false }), K.mat('grime', '#3a3a42', { detail: 0.3 })); m.position.set(0, 1.32, -0.8); g.add(m); }
      for (const s of [-1, 1]) { K.rbox(0.5, 0.4, 1.6, 0.04, K.mat('rock', '#c8c4bc'), s * 4.25, 1.4, 0, g); K.rbox(0.4, 0.3, 1.62, 0.04, K.paint('#1a1a22', { coat: 0 }), s * 3.75, 1.2, 0, g); }
      const lab = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.45), S.textMat(crowned ? 'HUMPTON ROAD' : 'FLATBURY ROAD', { bg: crowned ? '#2a62c8' : '#c0392b', fg: '#ffffff', w: 600, h: 112, border: false })); lab.position.set(0, 0.55, 0.81); g.add(lab);
      return g; };
    XS1 = mk(EZ, true); XS2 = mk(EZ - 6, false);
    const blue = new THREE.MeshBasicMaterial({ color: new THREE.Color('#3ab0ff').multiplyScalar(1.6), toneMapped: false });
    for (let k = 0; k < 16; k++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), blue); d.userData = { x: (hash(k + 80) - 0.5) * 6, z: (hash(k + 81) - 0.5) * 1.2, ph: hash(k + 82) }; d.userData.ndSkip = true; sc.add(d); DROPS1.push(d); }
    for (let k = 0; k < 16; k++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), blue); d.userData = { x: (hash(k + 90) - 0.5) * 6, z: (hash(k + 91) - 0.5) * 1.2, ph: hash(k + 92) }; d.userData.ndSkip = true; sc.add(d); DROPS2.push(d); }
    POOL = K.rbox(7.6, 0.3, 1.6, 0.04, K.paint('#3a9ae0', { rough: 0.05 }), EX, 1.5, EZ - 6, sc); POOL.material.transparent = true; POOL.material.opacity = 0.75;
    for (let k = 0; k < 4; k++) { const x0 = EX - 2.6 + k * 1.7; CRACKS.push(K.trace([[x0, 1.34, EZ - 5.2], [x0 + 0.15, 1.15, EZ - 5.2], [x0 - 0.1, 0.95, EZ - 5.2], [x0 + 0.1, 0.7, EZ - 5.2]], { color: '#ff5a3a', r: 0.035 })); }
    for (const s of [-1, 1]) GUT.push(K.trace([[EX + s * 0.2, 1.85, EZ + 0.9], [EX + s * 2.0, 1.65, EZ + 0.9], [EX + s * 3.5, 1.4, EZ + 0.9], [EX + s * 3.75, 1.05, EZ + 0.9]], { color: '#7af8a0', r: 0.05 }));
    // ================= Doug's bathroom =================
    const BG = K.group(); BG.position.set(BX, 0, BZ);
    K.slab(-3, 3, 0, 0.05, -2.5, 3, K.mat('plaster', '#e8f0f4', { detail: 0.3 }), BG); for (let xx = -3; xx < 3; xx += 0.5) for (let zz = -2.5; zz < 3; zz += 0.5) if ((Math.round(xx * 2) + Math.round(zz * 2)) % 2) K.slab(xx, xx + 0.5, 0.05, 0.055, zz, zz + 0.5, K.paint('#7ac0d8', { coat: 0 }), BG, false);
    K.slab(-3, 3, 0, 3.2, -2.7, -2.5, K.mat('plaster', '#f4efe4'), BG); K.slab(-3.2, -3, 0, 3.2, -2.7, 3, K.mat('plaster', '#f4efe4'), BG);
    for (let yy = 0.3; yy < 1.5; yy += 0.3) K.slab(-3, 3, yy, yy + 0.01, -2.49, -2.48, K.paint('#a8c8d8', { coat: 0 }), BG);
    K.rbox(0.9, 1.2, 0.05, 0.04, K.chrome(), 1.6, 2.0, -2.46, BG); K.rbox(0.6, 0.8, 0.5, 0.06, K.paint('#f4f4f4'), 2.2, 0.4, -2.2, BG);
    for (let k = 0; k < 3; k++) K.rbox(0.25, 0.9, 0.05, 0.04, K.paint(['#e86a9a', '#f2c230', '#2a9a6a'][k], { coat: 0 }), -2.6 + k * 0.35, 1.6, -2.42, BG);
    TUB = new THREE.Group(); TUB.position.set(BX - 0.6, 0, BZ - 1.2); sc.add(TUB); K.rbox(2.4, 0.75, 1.1, 0.3, K.paint('#fbfbf8', { rough: 0.2 }), 0, 0.55, 0, TUB); for (const sx of [-1, 1]) for (const sz of [-1, 1]) K.sphere(0.08, K.gold(), sx * 1.0, 0.12, sz * 0.4, TUB);
    TUBW = K.rbox(2.1, 0.05, 0.85, 0.2, K.paint('#8acbe8', { rough: 0.05 }), 0, 0.85, 0, TUB); K.cyl(0.04, 0.04, 0.4, K.chrome(), 1.05, 0.9, 0, TUB, 8);
    for (let k = 0; k < 9; k++) BUBS.push(K.sphere(0.12 + hash(k + 40) * 0.08, K.glass({ color: '#ffffff', opacity: 0.6 }), -0.8 + hash(k + 41) * 1.6, 0.92, (hash(k + 42) - 0.5) * 0.6, TUB));
    const bs = S.board("DOUG'S|BATH", 1.2, 0.7, { frame: '#2a62c8' }); bs.position.set(BX - 2.4, 0, BZ + 0.6); bs.rotation.y = 0.5;
    K.lamp(BX, 2.6, BZ, { color: '#fff0d8', intensity: 5, distance: 8 });
    // ================= characters =================
    DOUG = K.stick({ jacket: '#2a2a40', pants: '#2a2a40', hat: 'hardhat', hatColor: '#f2c230', moustache: '#5a3a24', tie: '#c0392b', collar: '#f4efe4', badge: true, belt: '#3a2418', build: 'stout' }, { key: 'doug' });
    HILDA = K.stick({ jacket: '#2a9a6a', pants: '#2a3a5a', hat: 'helmet', hatColor: '#2a62c8', hairStyle: 'ponytail', hair: '#c8502a', scarf: '#f2c230', vest: '#f4efe4', glasses: true, boots: '#3a2418' }, { key: 'hilda' });
    BUSDRV = K.stick({ jacket: '#f4f2ee', pants: '#1f2a44', hat: 'pilot', hatColor: '#1f2a44', moustache: '#d8d4cc', bowtie: '#1f2a44' }, { key: 'busdrv' });
    PIZZA.userData.guy = K.stick({ jacket: '#c0392b', pants: '#2a2a30', hat: 'cap', hatColor: '#c0392b', hairStyle: 'curly', hair: '#2a1a14', scarf: '#f4efe4' }, { key: 'pizzaguy' });
    FIREMAN = K.stick({ jacket: '#f2c230', pants: '#3a3a40', hat: 'hardhat', hatColor: '#d0302a', moustache: '#3a2418', belt: '#1a1a1a', gloves: '#1a1a1a' }, { key: 'fireman' });
    DUCK = K.animal('duck', { seed: 9, scale: 2.4 });
    CAPHAT = new THREE.Group(); sc.add(CAPHAT); K.cyl(0.1, 0.11, 0.08, K.paint('#1f2a44', { rough: 0.4 }), 0, 0, 0, CAPHAT, 18); K.cyl(0.13, 0.13, 0.015, K.paint('#1a1a1a'), 0, 0.0, 0.04, CAPHAT, 18); K.cyl(0.112, 0.112, 0.02, K.gold(), 0, 0.03, 0, CAPHAT, 18);
    CROWD = S.extras(10, { x0: -16, len: 8, z: 5, spread: 1, seed: 90 });
    K.addClouds(10, 700, 160);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s), t = f / 30;
    const ex = f >= 1301 && f < 1546, bath = f >= 1811, raining = (f >= 532 && f < 1301) || f < 98, flash = f < 98;   // the hook is a flash-forward
    // ---------- water level on Flatbury Road ----------
    let lvl = 0; if (flash) lvl = 0.75; else if (f >= F.D3 - 4 && f < F.D5 - 4) lvl = 0.16 * sm(F.D3 - 4, F.D3 + 10, f); else if (f >= F.D5 - 4 && f < 1301) lvl = 0.16 + 0.59 * sm(F.D5 - 4, F.D5 + 16, f) - 0.3 * sm(F.DRANK - 4, F.SWELL + 10, f);
    WATER.visible = lvl > 0.01 && !ex && !bath; WATER.position.y = lvl + 0.02 * Math.sin(t * 2);
    PUDDLES.forEach((p) => { p.visible = f >= F.PUDDLES - 6 && f < F.D3 + 10 && !ex; });
    const holes = f >= 1546 && f < F.REBUILT - 2; HOLES.forEach((h) => { h.visible = holes; });
    NEWHUMP.visible = f >= F.REBUILT - 2 && !ex && !bath; FLATROAD.visible = !NEWHUMP.visible;
    FISH.visible = holes && f >= 1600; const hz = HOLES[7].position; FISH.position.set(hz.x, 0.1 + 0.12 * Math.abs(Math.sin(f * 0.35)), hz.z); FISH.rotation.set(0, 0.4, 0.4 * Math.sin(f * 0.35));
    // ---------- floating traffic ----------
    const fl = (x0, z0, k) => [x0 + (lvl > 0.5 ? 0.8 * Math.sin(t * 0.3 + k) : 0), Math.max(0, lvl - 0.45) + 0.05 * Math.sin(t * 1.6 + k), z0];
    const showTraffic = !ex && !bath && (f < 98 || f >= 532 && f < 1546);
    { const p = fl(-18, 0.3, 1); BUS.position.set(...p); BUS.rotation.set(0.04 * Math.sin(t + 1), 0.2 * (lvl > 0.5 ? 1 : 0), 0.05 * Math.sin(t * 1.3)); BUS.visible = !ex && !bath && f < 1546; }
    CARS.forEach((c, k) => { const p = fl(c.g.userData.x0, k === 1 ? -1.6 : 1.8, k + 3); c.g.position.set(...p); c.g.rotation.set(0.05 * Math.sin(t * 1.2 + k), (lvl > 0.5 ? 0.6 * k : 0) + (k === 1 ? Math.PI : 0), 0.05 * Math.sin(t + k)); c.g.visible = !ex && !bath && f < 1546; });
    { const p = fl(-30, -1.2, 7); FTRUCK.position.set(p[0], p[1], p[2]); FTRUCK.rotation.set(0.03 * Math.sin(t), 0.3, 0.05 * Math.sin(t * 1.4)); FTRUCK.visible = showTraffic && f >= 692; FTRUCK.userData.pad.rotation.x = 0.6 + 0.5 * Math.sin(t * 3); }
    const canX = (g) => lerp(-26, -4, clamp((g - 692) / 140, 0, 1)); CANOE.visible = !ex && !bath && f >= 692 && f < 1301; CANOE.position.set(canX(f), lvl + 0.05, 2.3); CANOE.rotation.set(0, 0, 0.04 * Math.sin(t * 2));
    // ---------- ribbon + scissors ----------
    const cut = f >= F.CLAP - 6; RIBBON.forEach((r, k) => { r.visible = f >= 98 && f < 532; if (k >= 2) { r.rotation.x = cut ? (k === 2 ? 1 : -1) * 1.2 * sm(F.CLAP - 6, F.CLAP + 6, f) : 0; } });
    // ---------- sponge ----------
    let sp = [-9, 0.25, 4.6], ss = 1; SPONGE.visible = !ex && !bath && f >= 921 && f < 1301;
    if (f >= 975) { const into = sm(975, 1010, f); sp = [-9, lerp(0.25, lvl - 0.35, into), lerp(4.6, 1.5, into)]; }
    if (f >= F.DRANK - 4) { ss = 1 + 1.3 * sm(F.DRANK - 4, F.WHALE + 4, f); sp[1] = lvl - 0.3; }
    if (f >= F.FLOATED - 4) { sp[0] = -9 - (f - F.FLOATED + 4) * 0.07; sp[2] = 1.5 - (f - F.FLOATED + 4) * 0.015; }
    SPONGE.position.set(sp[0], sp[1] + 0.06 * Math.sin(t * 1.5), sp[2]); SPONGE.scale.set(ss, ss * (f >= F.DRANK ? 1.1 : 1), ss); SPONGE.rotation.set(0, 0.2, 0.04 * Math.sin(t * 1.2));
    // ---------- explainer ----------
    XS1.visible = XS2.visible = ex; POOL.visible = ex && f >= F.FLAT - 6;
    DROPS1.forEach((d, k) => { const u = d.userData; d.visible = ex && f < 1440; const ph = ((f - 1301) / 45 + u.ph) % 1; const s = Math.sign(u.x) || 1;
      if (ph < 0.35) d.position.set(EX + u.x * 0.4, 4.5 - ph / 0.35 * 2.7, EZ + u.z); else { const r = (ph - 0.35) / 0.65, xx = u.x * 0.4 + s * r * (4 - Math.abs(u.x * 0.4)); d.position.set(EX + xx, xx * s < 3.7 ? 1.33 + 0.45 * (1 - (xx / 4) ** 2) + 0.08 : 1.3 - (r - 0.9) * 3, EZ + u.z); } });
    DROPS2.forEach((d, k) => { const u = d.userData; d.visible = ex && f >= 1434; const ph = ((f - 1434) / 40 + u.ph) % 1; d.position.set(EX + u.x, ph < 0.5 ? 4.5 - ph / 0.5 * 2.8 : 1.62 - (f >= F.SOAKS - 4 ? (ph - 0.5) * 1.6 : 0), EZ - 6 + u.z); });
    POOL.position.y = 1.36 + 0.14 * sm(F.FLAT - 6, F.SITS, f); POOL.scale.y = 0.3 + 0.7 * sm(F.FLAT - 6, F.SITS, f);
    CRACKS.forEach((c, k) => c.show(ex && f >= F.SOAKS - 6 ? sm(F.SOAKS - 6 + k * 3, F.SOAKS + 14 + k * 3, f) : 0));
    GUT.forEach((g) => g.show(ex && f < 1440 ? sm(F.ROLLS - 6, F.GUTTERS + 6, f) : 0));
    // ---------- tub ----------
    BUBS.forEach((b, k) => { b.position.y = 0.92 + 0.03 * Math.sin(t * 2 + k); });
    // ---------- characters ----------
    // Doug
    let dp = { x: -10, z: 4.4, yaw: 0.2 }, dk;
    dk = [[0, 'shrug', { expr: 'dazed' }], [98, 'show', { expr: 'proud', R: [0.35, 0.3, null] }], [F.PAN - 4, 'pointUp', { expr: 'proud', talk: true }], [F.WHY, 'hips', { expr: 'smug' }], [214, 'reach', { expr: 'excited' }], [F.RIBBON, 'grab', { expr: 'grin' }], [F.CLAP, 'cheer', { expr: 'laugh' }],
      [422, 'point', { expr: 'laugh', talk: true }], [F.SPINE, 'cheer', { expr: 'laugh', talk: true }], [473, 'hips', { expr: 'smug' }], [532, 'shock', { expr: 'confused' }], [F.D3, 'scared', { expr: 'nervous', sweat: true }], [F.D5, 'panic', { expr: 'scared' }],
      [921, 'carry', { expr: 'grin', item: 'box' }], [975, 'push', { expr: 'proud' }], [F.PAN2, 'pointUp', { expr: 'proud', talk: true }], [F.DRANK, 'shock', { expr: 'shock' }], [F.FLOATED, 'panic', { expr: 'scared' }], [1271, 'sit', { expr: 'dazed', sweat: true }],
      [1546, 'facepalm', { expr: 'pained' }], [F.FISH, 'shock', { expr: 'shock' }], [1703, 'show', { expr: 'proud' }], [F.LOST, 'shrug', { expr: 'sad' }], [1811, 'facepalm', { expr: 'pained' }], [F.BATH + 6, 'shrug', { expr: 'deadpan' }]];
    if (flash) dp = { x: -10, z: 4.6, yaw: 0.3 };
    if (f >= 98 && f < 320) dp = { x: -12.6, z: 1.0, yaw: 0.4 };
    if (f >= 320 && f < 532) dp = { x: -3.2, z: 2.0, yaw: 1.2 };
    if (f >= 532 && f < 921) dp = { x: -10.5, z: 4.6, yaw: 0.2 };
    if (f >= 921 && f < 1034) dp = { x: -9 + (f >= 975 ? 0 : 0), z: f < 975 ? 5.4 : 5.4, yaw: Math.PI };
    let dy = 0, seat = undefined; if (f >= F.DRANK + 10 && f < 1271) { dp = { x: sp[0] + 0.2, z: sp[2], yaw: 0.3 }; dy = sp[1] + 1.0 * ss * 1.1 - 0.05; seat = 0.0; }
    if (f >= 1271 && f < 1301) dp = { x: sp[0] + 0.2, z: sp[2], yaw: 0.3 }, dy = sp[1] + 1.0 * ss * 1.1 - 0.05;
    if (f >= 1546 && f < 1811) dp = { x: -15.5, z: 4.4, yaw: -0.4 };
    if (bath) dp = { x: BX + 0.9, z: BZ + 0.2, yaw: -0.5 };
    if (ex) dp = { visible: false };
    const DA = T.act(f, dk, { seed: 2, blink: blink(2) }); if (f >= F.DRANK + 10 && f < 1301) DA.opts.mode = 'sit';
    DOUG.set(DA, { ...dp, y: dy, seat: 0.0 });
    SCISSORS.visible = f >= F.CUT - 4 && f < 320; SCISSORS.position.set(-12.2, 1.2, 0.6); SCISSORS.rotation.set(0, -0.6 + (cut ? 0.4 : 0), 0);
    // Hilda
    let hp = { x: 8, z: 2.2, yaw: -0.4 }, hk = [[0, 'show', { expr: 'smile' }], [F.HUMP, 'point', { expr: 'proud' }], [422, 'cross', { expr: 'deadpan' }], [473, 'shrug', { expr: 'smile' }], [F.BIKE - 4, 'show', { expr: 'grin' }]];
    let hb = false; if (f >= 473 && f < 532) hp = { x: 4.6, z: 4.6, yaw: -0.3 };
    if (f >= 1162 && f < 1271) { const xx = lerp(4, 22, clamp((f - 1162) / 109, 0, 1)); hp = { x: xx, z: 1.4, yaw: Math.PI / 2 }; hb = true; hk = [[0, 'idle', { expr: 'smile', R: [0.25, 0.35, null], L: [0.25, 0.35, null] }], [F.DRY, 'idle', { expr: 'laugh', R: [0.25, 0.35, null], L: [0.25, 0.35, null] }]]; }
    if (f < 320 || (f >= 532 && f < 1162) || f >= 1271) hp = { visible: false };
    const HA = T.act(f, hk, { seed: 4, blink: blink(4) }); if (hb) { HA.opts.mode = 'sit'; } HILDA.set(HA, { ...hp, y: hb ? 0.32 : 0, seat: hb ? 0.75 : 0.45 });
    BIKE.g.visible = (f >= F.BIKE - 4 && f < 532) || hb; if (hb) { BIKE.g.position.set(hp.x, 0.32, hp.z); BIKE.g.rotation.y = 0; for (const w of BIKE.wheels) w.rotation.z = -hp.x / 0.34; } else BIKE.g.position.set(5.6, 0.24, 4.4);
    // the bus driver (captain), pizza guy, fireman
    BUSDRV.set(T.act(f, [[0, 'salute', { expr: 'deadpan' }]], { seed: 11, blink: blink(11) }), BUS.visible && lvl > 0.5 ? { x: BUS.position.x + 2.0, z: BUS.position.z + 0.5, y: BUS.position.y + 0.6, yaw: 1.3 } : { visible: false });
    { const A = T.act(f, [[0, 'idle', { expr: 'grin', R: [0.4, 0.1, null], L: [0.3, 0.2, null] }]], { seed: 12, blink: blink(12) }); A.opts.mode = 'sit';
      PIZZA.userData.guy.set(A, CANOE.visible ? { x: CANOE.position.x - 0.5, z: CANOE.position.z, y: CANOE.position.y - 0.25, yaw: Math.PI / 2, seat: 0.05 } : { visible: false }); }
    FIREMAN.set(T.act(f, [[0, 'push', { expr: 'stern' }]], { seed: 13, blink: blink(13) }), FTRUCK.visible ? { x: FTRUCK.position.x + 0.4, z: FTRUCK.position.z + 0.6, y: FTRUCK.position.y + 2.0, yaw: Math.PI / 2 } : { visible: false });
    // the crowd at the ribbon
    CROWD.forEach((c, k) => { const on = f >= 214 && f < 320; const A = T.act(f, [[0, 'idle', { expr: 'smile' }], [F.CLAP - 4, 'clap', { expr: 'laugh' }]], { seed: 50 + k, blink: blink(50 + k) }); c.r.set(A, on ? { x: -16 + (k % 5) * 1.0 + (k > 4 ? 0.5 : 0), z: 4.6 + (k > 4 ? 0.9 : 0), yaw: Math.PI - 0.3 + (k % 3) * 0.15 } : { visible: false }); });
    // Admiral Puddles (a duck in a captain's hat)
    let up = { visible: false };
    if (flash || (f >= 645 && f < 1301)) { const a = t * 0.35; up = { x: -11 + 1.8 * Math.cos(a), y: lvl - 0.08, z: 1.5 + 1.2 * Math.sin(a), yaw: a + Math.PI, mode: 'walk', expr: 'happy', flap: f >= F.TRAFFIC && f < F.TRAFFIC + 30 ? 1 : 0 }; }
    if (f >= 1546 && f < 1811) up = { x: -13, z: 2.0, yaw: -0.3, mode: 'stand', expr: f >= F.LOST ? 'sad' : 'shock' };
    if (bath) up = { x: BX - 0.6 + 0.4 * Math.sin(t * 0.6), y: 0.62, z: BZ - 1.2, yaw: 1.4, mode: 'walk', expr: 'happy' };
    DUCK.set(f, up); CAPHAT.visible = up.visible !== false; if (CAPHAT.visible) { const s = 2.4, yw = up.yaw; CAPHAT.position.set(up.x + Math.sin(yw) * 0.16 * s, (up.y || 0) + 0.31 * s, up.z + Math.cos(yw) * 0.16 * s); CAPHAT.rotation.set(0, yw, 0); }
    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const body = (x, z, y = 0, h = 2.2) => [[x, y, z], [x, y + h, z]];
    const D0 = [dp.x ?? 0, dp.z ?? 0];
    if (sh(0, 48)) {                          // 1. hook: Flatbury Road is a lake; Admiral Puddles moves in; Doug on the sidewalk (wide)
      cam = K.fit([...body(-10, 4.6), [-15.5, 0, 0], [up.x, 1.2, up.z], [-15.5, 3.0, 0]], { yaw: 72, pitch: 12, fov: 42, margin: 0.8 }); cam.fov *= K.push(u, 0.05);
    } else if (sh(48, 98)) {                  // 2. Admiral Puddles (reaction)
      cam = { pos: [up.x + 0.8, 2.2, up.z + 3.4], look: [up.x, 0.9, up.z], fov: 40 }; dof = { focus: 3.6, cinf: 10 };
    } else if (sh(98, 155)) {                 // 3. sunny opening day: "Smooth as a pancake!" (wide)
      cam = K.fit([...body(-12.6, 1.0), [-18, 0, -3], [-6, 0, 3], [-12, 1.3, -3.9]], { yaw: 82, pitch: 10, fov: 42, margin: 0.9 }); cam.fov *= K.punch(f, F.PAN, 0.1, 6);
    } else if (sh(155, 214)) {                // 4. the flat road — why are real roads higher in the middle? (low along the road)
      cam = { pos: [lerp(-1, -3, u), 1.3, -0.6], look: [-16, 0.6, -0.4], fov: 44 }; dof = { focus: 9, cinf: 4 };
    } else if (sh(214, 265)) {                // 5. golden scissors; 400 people (wide)
      cam = K.fit([...body(-12.6, 1.0), [-16, 0, 4.6], [-11, 0, 5.5], [-12, 1.3, -3.9]], { yaw: 70, pitch: 14, fov: 42, margin: 0.9 });
    } else if (sh(265, 320)) {                // 6. snip! they clap (wide, other side)
      cam = K.fit([...body(-12.6, 1.0), [-16, 0, 4.6], [-12, 1.3, 3.9]], { yaw: 120, pitch: 8, fov: 42, margin: 0.95 }); cam.fov *= K.punch(f, F.CLAP, 0.1, 6);
    } else if (sh(320, 370)) {                // 7. Hilda of Humpton and her humped road (wide)
      cam = K.fit([...body(8, 2.2), [3, 0, -3.6], [16, 0, 3.6]], { yaw: 75, pitch: 10, fov: 42, margin: 0.9 });
    } else if (sh(370, 422)) {                // 8. the hump, seen down the road (low)
      cam = { pos: [26, 0.5, 0.0], look: [8, 0.6, 0.5], fov: 40 }; dof = { focus: 16, cinf: 3 }; cam.fov *= K.punch(f, F.HUMP, 0.08, 6);
    } else if (sh(422, 473)) {                // 9. Doug laughs: "Her road has a spine!" (wide, both)
      cam = K.fit([...body(-3.2, 2.0), ...body(8, 2.2), [0.8, 1.2, 4.6]], { yaw: 90, pitch: 8, fov: 42, margin: 0.9 }); cam.fov *= K.punch(f, F.SPINE, 0.1, 6);
    } else if (sh(473, 532)) {                // 10. Hilda doesn't argue; she buys a bike (wide)
      cam = K.fit([...body(4.6, 4.6), [5.6, 0, 4.4], [6, 3, -6.4]], { yaw: 70, pitch: 8, fov: 42, margin: 1.0 });
    } else if (sh(532, 568)) {                // 11. then it rained for a week (high wide)
      cam = { pos: [lerp(-6, -4, u), 6.5, 13], look: [-12, 1.5, -2], fov: 46 }; dof = { focus: 16, cinf: 3 };
    } else if (sh(568, 610)) {                // 12. day one: puddles (wide)
      cam = K.fit([...body(-10.5, 4.6), [-20, 0, -2], [-6, 0, 2]], { yaw: 80, pitch: 12, fov: 42, margin: 0.95 });
    } else if (sh(610, 645)) {                // 13. day three: ankle-deep (low)
      cam = K.fit([...body(-10.5, 4.6), [-16, 0, 0], [-6, 0, 2]], { yaw: 110, pitch: 4, fov: 42, margin: 0.95 }); cam.fov *= K.punch(f, F.ANKLE, 0.08, 6);
    } else if (sh(645, 692)) {                // 14. day five: the bus needs a captain (wide)
      cam = K.fit([[-21, 0, 0], [-15, 3.0, 1.2], ...body(-10.5, 4.6)], { yaw: 75, pitch: 10, fov: 42, margin: 0.9 }); cam.fov *= K.punch(f, F.CAPT, 0.1, 6);
    } else if (sh(692, 740)) {                // 15. pizza by canoe (tracking)
      const tc = K.track(f, (g) => [canX(g), 0.5, 2.3], { off: [0.8, 2.4, 4.4], lag: 5, lookY: 0.6 }); cam = { ...tc, fov: 46 };
    } else if (sh(740, 791)) {                // 16. the fire truck got a paddle (wide)
      cam = K.fit([[-33, 0, -1.2], [-27, 3.2, -1.2], [-30, 2.8, 0.4]], { yaw: 70, pitch: 10, fov: 42, margin: 1.0 }); cam.fov *= K.punch(f, F.PADDLE, 0.1, 6);
    } else if (sh(791, 850)) {                // 17. Admiral Puddles always wanted a lake (wide)
      cam = K.fit([[up.x - 2, 0, up.z], [up.x + 2, 1.2, up.z], [-18, 2.5, 0.3]], { yaw: 85, pitch: 14, fov: 42, margin: 1.0 });
    } else if (sh(850, 885)) {                // 18. the admiral, proud (reaction)
      cam = { pos: [up.x - 0.6, 2.0, up.z + 3.3], look: [up.x, 0.9, up.z], fov: 40 }; dof = { focus: 3.5, cinf: 10 };
    } else if (sh(885, 921)) {                // 19. now he had one, with traffic (high wide)
      cam = { pos: [-12, 8.5, 9], look: [-16, 0.5, -0.5], fov: 46 }; dof = { focus: 12, cinf: 3 }; cam.fov *= K.punch(f, F.TRAFFIC, 0.08, 6);
    } else if (sh(921, 975)) {                // 20. a sponge the size of a sofa (wide)
      cam = K.fit([...body(-9, 5.4), [-10.2, 0, 4.6], [-7.8, 1.2, 4.6], [-12, 0, 1]], { yaw: 80, pitch: 10, fov: 42, margin: 0.95 });
    } else if (sh(975, 1034)) {               // 21. "Smooth as a pancake!" into the lake (low)
      cam = K.fit([...body(-9, 5.4), [sp[0] - 1.3, 0, sp[2]], [sp[0] + 1.3, 1, sp[2]]], { yaw: 120, pitch: 4, fov: 42, margin: 0.95 }); cam.fov *= K.punch(f, F.PAN2, 0.1, 6);
    } else if (sh(1034, 1100)) {              // 22. it drinks half the road, swells like a whale (wide)
      cam = K.fit([[sp[0] - 3, 0, sp[2]], [sp[0] + 3, 2.6, sp[2]], ...body(-9, 5.4)], { yaw: 75, pitch: 10, fov: 44, margin: 0.95 }); cam.fov *= K.punch(f, F.WHALE, 0.12, 6); const s = K.shake(f, F.WHALE, 0.05, 12); cam.pos[1] += s[1];
    } else if (sh(1100, 1162)) {              // 23. floats away with Doug on it (tracking wide)
      cam = K.fit([[sp[0] - 3, 0, sp[2]], [sp[0] + 3, sp[1] + 3.8, sp[2]]], { yaw: lerp(80, 95, u), pitch: 8, fov: 44, margin: 1.0 });
    } else if (sh(1162, 1215)) {              // 24. Humpton: Hilda bikes to work, the hump sheds the rain (tracking)
      const tc = K.track(f, (g) => [lerp(4, 22, clamp((g - 1162) / 109, 0, 1)), 0.3, 1.4], { off: [-2.0, 2.4, 7.5], lag: 5, lookY: 0.8 }); cam = { ...tc, fov: 46 };
    } else if (sh(1215, 1271)) {              // 25. dry socks (wide, low)
      cam = K.fit([...body(hp.x ?? 14, 1.4, 0.3), [(hp.x ?? 14) - 3, 0, -3.6], [(hp.x ?? 14) + 2, 0, 3.6]], { yaw: 60, pitch: 6, fov: 42, margin: 0.95 }); cam.fov *= K.punch(f, F.DRY, 0.1, 6);
    } else if (sh(1271, 1301)) {              // 26. Doug, adrift on his sponge (reaction)
      cam = { pos: [sp[0] + 2.5, sp[1] + 4.2, sp[2] + 5.0], look: [sp[0] + 0.2, sp[1] + 2.6, sp[2]], fov: 40 }; dof = { focus: 5.6, cinf: 10 };
    } else if (sh(1301, 1370)) {              // 27. explainer: rain hits the high middle (cross-section)
      cam = K.fit([[EX - 4.6, 0.6, EZ + 0.8], [EX + 4.6, 3.6, EZ + 0.8]], { yaw: 90, pitch: 6, fov: 42, margin: 0.72 });
    } else if (sh(1370, 1440)) {              // 28. ...rolls downhill into the gutters (3/4)
      cam = K.fit([[EX - 4.6, 0.5, EZ + 0.8], [EX + 4.6, 3.0, EZ - 0.8]], { yaw: 65, pitch: 16, fov: 42, margin: 0.85 }); cam.fov *= K.punch(f, F.GUTTERS, 0.1, 6);
    } else if (sh(1440, 1490)) {              // 29. a flat road has no downhill (cross-section)
      cam = K.fit([[EX - 4.6, 0.6, EZ - 5.2], [EX + 4.6, 3.6, EZ - 5.2]], { yaw: 90, pitch: 6, fov: 42, margin: 0.72 });
    } else if (sh(1490, 1546)) {              // 30. the water sits there and soaks in (3/4, cracks)
      cam = K.fit([[EX - 4.6, 0.3, EZ - 5.2], [EX + 4.6, 2.2, EZ - 6.8]], { yaw: 110, pitch: 14, fov: 42, margin: 0.85 }); cam.fov *= K.punch(f, F.SOAKS, 0.1, 6);
    } else if (sh(1546, 1610)) {              // 31. drained: Swiss cheese, 200 potholes (high wide)
      cam = { pos: [lerp(-8, -6, u), 9, 9], look: [-18, 0, -1], fov: 46 }; dof = { focus: 15, cinf: 3 };
    } else if (sh(1610, 1662)) {              // 32. Doug steps among the potholes (wide)
      cam = { pos: [lerp(-11, -12, u), 3.0, 10.5], look: [-16, 0.6, 1.5], fov: 44 }; dof = { focus: 10, cinf: 4 };
    } else if (sh(1662, 1709)) {              // 33. one had a fish in it (insert)
      const hz = HOLES[7].position; cam = { pos: [hz.x + 0.8, 0.9, hz.z + 1.3], look: [hz.x, 0.1, hz.z], fov: 40 }; dof = { focus: 1.5, cinf: 18 };
    } else if (sh(1709, 1764)) {              // 34. Doug rebuilds with a hump (wide, sunny)
      cam = K.fit([...body(-15.5, 4.4), [-22, 0, -3.6], [-10, 0, 3.6]], { yaw: lerp(66, 76, u), pitch: 8, fov: 42, margin: 0.9 }); cam.fov *= K.push(u, 0.08);
    } else if (sh(1764, 1811)) {              // 35. Admiral Puddles lost his lake (wide, low)
      cam = K.fit([[-13, 0, 2], [-13, 1.2, 2], ...body(-15.5, 4.4)], { yaw: lerp(104, 96, u), pitch: 4, fov: 42, margin: 1.0 }); cam.fov *= K.push(u, 0.08);
    } else {                                  // 36. so he moved into Doug's bathtub (wide)
      cam = K.fit([[BX - 1.9, 0, BZ - 1.2], [BX + 0.7, 0, BZ - 1.2], ...body(BX + 0.9, BZ + 0.2)], { yaw: lerp(80, 90, u), pitch: 14, fov: 42, margin: 0.95 }); cam.fov *= K.punch(f, F.BATH, 0.1, 6);
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    if (raining && !ex && !bath) K.rain(f, cam.look, { area: 14, count: 600, alpha: 0.4 });
    if (ex && f < 1546) K.rain(f, [EX, 2, EZ - 3], { area: 10, count: 200, alpha: 0.3 });
    if (f >= F.CLAP - 6 && f < F.CLAP + 40) K.sparks(f, F.CLAP - 6, F.CLAP + 10, [-12, 2.2, 0], { dir: [0, 1, 0], spread: 1.5, rate: 14, speed: 4, life: 30, color: '#f2c230', seed: 3 });
    if (f >= F.WHALE - 6 && f < 1301) K.sparks(f, F.WHALE - 6, 1290, () => [sp[0], sp[1] + 2.4 * ss * 0.6, sp[2]], { dir: [0, 1, 0], spread: 0.3, rate: 6, speed: 4, life: 14, color: '#bfe4ff', seed: 5 });
    if (f >= 1162 && f < 1271) for (const s of [-1, 1]) K.steam(f, [10 + (f % 30) * 0.2, 0.1, s * (RW - 0.2)], { rate: 4, size: 0.2, rise: 0.1, life: 14, color: '#bfe4ff' });
    if (f >= F.REBUILT && f < F.REBUILT + 24) K.puff(f, F.REBUILT, -18, 0, 14, 1.0);
    K.mist(f, 90, 16); K.mist(f, 526, 14); K.mist(f, 1294, 16); K.mist(f, 1540, 14); K.mist(f, 1805, 14);
    if (f >= 532 && f < 1301) K.hud(f, 568, { stages: 3, u: clamp((f - 568) / (F.D5 + 20 - 568), 0, 1), labels: ['DAY 1', 'DAY 3', 'DAY 5'], f1: 1300 });
    K.badge(f, F.WHY, 'WHY HIGHER IN THE MIDDLE?', { sx: 0.5, sy: 0.24 }, { icon: 'warn', f1: 212 });
    K.badge(f, F.FOUR, '400 PEOPLE CLAP', { sx: 0.5, sy: 0.24 }, { icon: 'check', f1: 318 });
    K.badge(f, F.HUMP, 'HUMP IN THE MIDDLE', { sx: 0.5, sy: 0.24 }, { icon: 'up', f1: 420 });
    K.badge(f, F.PUDDLES, 'DAY 1: PUDDLES', { sx: 0.5, sy: 0.24 }, { icon: 'drop', f1: F.D3 - 2 });
    K.badge(f, F.D3, 'DAY 3: ANKLE-DEEP', { sx: 0.5, sy: 0.24 }, { icon: 'drop', f1: F.D5 - 2 });
    K.badge(f, F.D5, 'DAY 5: LAKE', { sx: 0.5, sy: 0.24 }, { icon: 'drop', f1: 690 });
    K.badge(f, F.SOFA, 'SPONGE: SOFA-SIZED', { sx: 0.5, sy: 0.24 }, { icon: 'x', f1: 1160 });
    K.badge(f, F.DRY, 'DRY SOCKS', { sx: 0.5, sy: 0.24 }, { icon: 'check', f1: 1269 });
    K.badge(f, F.ROLLS, 'RAIN ROLLS TO THE GUTTERS', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1438 });
    K.badge(f, F.NODOWN, 'NO DOWNHILL = WATER STAYS', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 1544 });
    K.badge(f, F.TWO, '200 POTHOLES', { sx: 0.5, sy: 0.24 }, { icon: 'x', f1: 1707 });
    K.badge(f, F.HUMP2, 'HUMP ADDED', { sx: 0.5, sy: 0.24 }, { style: 'stamp', size: 1.15, f1: 1809 });
    const L = bath ? K.light('interior', { az: 80, el: 50, exposure: 1.3 }) : (raining || (ex && f < 1546)) ? K.light('overcast', { az: 75, el: 40, shadowExt: 26, exposure: 1.35 }) : K.light('golden', { az: 75, el: 34, shadowExt: 26, exposure: 1.3 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
