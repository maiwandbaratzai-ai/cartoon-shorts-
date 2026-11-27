// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The Gang Whose Getaway Boat Sank in a River" — invented story, engine: The Heist (SCRIPTS.md §000). TikTok, 64 s.
// The Barnacle gang's boat crosses an ocean with two tons of stolen gold under frozen fish; Captain Gill ("Every inch is money!") loads it to
// the brim at sea. Sir Whiskers, the ship's cat, wants only dry paws. They sneak up the Mudd River to a pickle-factory hideout, and the
// moment the boat leaves the salty sea it starts sinking, slowly, like it changed its mind: the deck, the fish, the captain's hat. Gill
// throws the fish overboard; they thaw and swim home. The police wait on the bank with lemonade. Explainer: salt makes sea water heavier,
// heavier water pushes up harder; river water is lighter so the same boat sinks deeper; big ships wear a load line (a sea mark and a
// higher river mark). Gill: "Every inch is money," from a very small cell. Sir Whiskers rides home dry on a policeman's hat.
import { TOTAL, LINES, wf } from './riversink_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const MOUTH = 40, RW = 9, COP = [104, -RW - 2.2], FACT = [150, RW + 7], EX = [0, 0, 160];
let COPP = null, THREE, F = {}, BOAT, CRATES = [], GOLD = [], FISH = [], GILL, MO, RAY, CAT, COPS = [], CHAIRS, CUPS = [], HATF, CELL, TANKS = [], TBOATS = [], ARR = [], SALT, HOLOHULL, MARKS, BUB = [];

function hull(K, parent, s = 1, holo = false) { const g = new THREE.Group(); parent.add(g); g.scale.setScalar(s);
  const HM = holo ? K.holo('#36e2ff') : K.paint('#1f5a4a', { rough: 0.25 }), RED = holo ? K.holo('#ff7a4a') : K.paint('#b8302a', { rough: 0.35 }), WH = holo ? K.holo('#ffffff') : K.paint('#f4f2ee');
  K.rbox(9, 1.3, 3.2, 0.35, HM, 0, 0.35, 0, g); K.rbox(9.02, 0.6, 3.22, 0.3, RED, 0, -0.55, 0, g); const bow = K.rbox(2.2, 1.6, 2.6, 0.5, HM, 4.6, 0.55, 0, g); bow.rotation.z = 0.25;
  K.rbox(9.1, 0.14, 3.3, 0.05, WH, 0, 1.02, 0, g);                               // gunwale
  if (!holo) { const nm = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.5), K.set.textMat('SLIPPERY EEL', { bg: '#1f5a4a', fg: '#f2c230', w: 700, h: 110, border: false })); for (const sd of [-1, 1]) { const n = nm.clone(); n.position.set(1.4, 0.55, sd * 1.62); n.rotation.y = sd > 0 ? 0 : Math.PI; g.add(n); } }
  // load line marks (a ring, a bar, and ticks: S lower, F higher)
  for (const sd of [-1, 1]) { const lg = new THREE.Group(); lg.position.set(-1.6, 0, sd * 1.63); lg.rotation.y = sd > 0 ? 0 : Math.PI; g.add(lg);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.035, 6, 24), WH); ring.position.set(0, -0.1, 0); lg.add(ring); K.rbox(0.8, 0.06, 0.02, 0.01, WH, 0, -0.1, 0, lg); K.rbox(0.05, 0.9, 0.02, 0.01, WH, 0.7, 0.0, 0, lg);
    for (const [y, t] of [[-0.25, 'S'], [0.18, 'F']]) { K.rbox(0.35, 0.05, 0.02, 0.01, WH, 0.9, y, 0, lg); if (!holo) { const l = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), K.set.textMat(t, { bg: '#1f5a4a', fg: '#ffffff', w: 64, h: 64, border: false })); l.position.set(1.2, y, 0.02); lg.add(l); } } g.userData.lines = lg; }
  return g; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { CROSSED: wf(0, 'crossed'), SANK: wf(0, 'sank'), RIVER0: wf(0, 'river'), TWO: wf(1, 'two'), GOLD: wf(1, 'gold'), FROZEN: wf(1, 'frozen'), FISH1: wf(1, 'fish'), LOADED: wf(2, 'loaded'), BRIM: wf(2, 'brim'), EVERY: wf(2, 'every'),
      WHISK: wf(3, 'whiskers'), CAT: wf(3, 'cat'), DRY: wf(3, 'dry'), PAWS: wf(3, 'paws'), LOW: wf(4, 'low'), LICKED: wf(4, 'licked'), STILL: wf(4, 'still'), FLOATED: wf(4, 'floated'),
      PLAN: wf(5, 'plan'), MUDD: wf(5, 'mudd'), HIDEOUT: wf(5, 'hideout'), PICKLE: wf(5, 'pickle'), MOMENT: wf(6, 'moment'), SALTY: wf(6, 'salty'), SINKING: wf(6, 'sinking'), SLOWLY: wf(6, 'slowly'), MIND: wf(6, 'mind'),
      DECK: wf(7, 'deck'), FISH2: wf(7, 'fish'), HAT: wf(7, 'hat'), THREW: wf(8, 'threw'), OVER: wf(8, 'overboard'), EVERY2: wf(8, 'every'), THAWED: wf(8, 'thawed'), SWAM: wf(8, 'swam'),
      KEPT: wf(9, 'kept'), POLICE: wf(9, 'police'), WAITED: wf(9, 'waited'), LEMON: wf(9, 'lemonade'), HOW: wf(10, 'how'), SEA: wf(11, 'sea'), SALT: wf(11, 'salt'), HEAVIER: wf(11, 'heavier'), PUSHES: wf(11, 'pushes'),
      LIGHTER: wf(12, 'lighter'), DEEPER: wf(12, 'deeper'), LOAD: wf(12, 'load'), FINISHES: wf(12, 'finishes'), JOB: wf(12, 'job'), LINE: wf(13, 'line'), SEAM: wf(13, 'sea'), HIGHER: wf(13, 'higher'),
      BANK: wf(14, 'bank'), EVERY3: wf(14, 'every'), CELL: wf(14, 'cell'), RODE: wf(15, 'rode'), DRY2: wf(15, 'dry') };
    // ================= sea, coast, the Mudd River =================
    const G = K.group();
    K.slab(-300, 400, -6, 0, -300, 300, K.paint('#1f6a9a', { rough: 0.12, coat: 1, env: 1.1 }), G, false);
    for (let k = 0; k < 9; k++) { const a = -0.9 + k * 0.22; K.sphere(14 + hash(k + 40) * 10, K.mat('grime', ['#5f9a44', '#6aa84f', '#7a9a5a'][k % 3], { detail: 3 }), -40 - 120 * Math.cos(a), -8, 140 * Math.sin(a) * (k % 2 ? 1 : -1) + (k % 2 ? 40 : -40), G, 1.4, 0.6, 1); }
    const land = K.mat('grime', '#6aa84f', { detail: 1.6, amt: 0.4 }), mud = K.mat('dirt', '#8a6a44', { detail: 0.6 });
    for (const sd of [-1, 1]) { K.slab(MOUTH, 260, -2, 1.0, sd > 0 ? RW : -120, sd > 0 ? 120 : -RW, land, G, false); K.slab(MOUTH, 260, -1, 0.6, sd > 0 ? RW - 1.2 : -RW, sd > 0 ? RW : -RW + 1.2, mud, G, false); }
    K.slab(MOUTH - 0.5, MOUTH + 0.5, -0.3, 0.02, -RW, RW, K.paint('#6ab0c8', { rough: 0.2 }), G, false);           // the colour line where river meets sea
    K.slab(MOUTH, 260, -0.03, 0.005, -RW + 1.2, RW - 1.2, K.paint('#4a8a6a', { rough: 0.1, coat: 1 }), G, false);    // greener river water
    for (let k = 0; k < 60; k++) { const sd = k % 2 ? 1 : -1; const x = MOUTH + 2 + hash(k) * 150; for (let j = 0; j < 5; j++) K.cyl(0.03, 0.03, 0.8 + hash(k + j) * 0.5, K.paint('#4a7a2a'), x + j * 0.15, 0.3, sd * (RW - 0.9 - hash(k + j * 3) * 0.3), G, 4); }
    for (let k = 0; k < 26; k++) { const sd = k % 2 ? 1 : -1; const t = S.tree({ h: 4 + hash(k) * 3, seed: k }); t.position.set(MOUTH + 6 + hash(k + 4) * 140, 1.0, sd * (RW + 4 + hash(k + 2) * 18)); }
    for (let k = 0; k < 7; k++) K.sphere(26 + hash(k) * 8, K.mat('grime', ['#5f9a44', '#6aa84f', '#4f8a3a'][k % 3], { detail: 4 }), MOUTH + 20 + k * 30, -16, (k % 2 ? 1 : -1) * (70 + hash(k) * 20), G, 1, 0.55, 1);
    // river mouth sign, buoys, lighthouse, the pickle factory hideout, a dock
    const ms = S.board('MUDD RIVER|FRESH WATER', 2.6, 1.3); ms.position.set(MOUTH + 3, 1.0, -RW - 1.5); ms.rotation.y = -0.3;
    for (let k = 0; k < 6; k++) { const b = new THREE.Group(); b.position.set(-20 + k * 11, 0, (k % 2 ? 1 : -1) * 7); G.add(b); K.cyl(0.4, 0.5, 1.2, K.paint(k % 2 ? '#e8302a' : '#2aa84a'), 0, -0.4, 0, b, 14); K.cyl(0.08, 0.08, 1.2, K.paint('#1a1a1e'), 0, 0.8, 0, b, 6); }
    { const L = new THREE.Group(); L.position.set(MOUTH - 4, 0, -RW - 10); G.add(L); K.cyl(4, 5, 2, K.mat('rock', '#8a847a'), 0, -1, 0, L, 20); for (let k = 0; k < 4; k++) K.cyl(1.4 - k * 0.12, 1.5 - k * 0.12, 2.6, K.paint(k % 2 ? '#e8302a' : '#f4f2ee'), 0, 1 + k * 2.6, 0, L, 20); K.cyl(1.1, 1.1, 1.2, K.glass({ color: '#fff2c0', opacity: 0.5 }), 0, 11.4, 0, L, 16); K.cyl(0.2, 1.4, 1.0, K.paint('#1a1a1e'), 0, 12.6, 0, L, 16); }
    const fb = S.building({ w: 10, d: 8, floors: 2, color: '#8ab84a', gable: 'flat', shop: 'PICKLE FACTORY', awning: '#2a6a2a', seed: 61, kind: 'brick' }); fb.position.set(FACT[0], 1.0, FACT[1]); fb.rotation.y = Math.PI;
    const ds = S.protestSign('DEFINITELY|PICKLES', { bg: '#f4efe4', fg: '#2a6a2a' }); ds.position.set(FACT[0] - 5.5, 1.0, RW + 1.8); ds.rotation.y = Math.PI + 0.3;
    for (let k = 0; k < 8; k++) K.cyl(0.12, 0.12, 2.4, K.mat('wood', '#5a3a24'), FACT[0] - 4 + k, -1.2, RW - 0.4, G, 8); K.rbox(8.4, 0.2, 2.0, 0.03, K.mat('wood', '#a8784a'), FACT[0] - 0.5, 1.1, RW - 0.6, G);
    // police spot on the south bank: car, folding chairs, a table with lemonade, a tiny cell
    { const car = S.car({ kind: 'hatch', color: '#f4f2ee', seed: 9 }); car.g.position.set(COP[0] - 5, 1.0, COP[1] - 2.6); const st = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.3), S.textMat('POLICE', { bg: '#1f3a8a', fg: '#ffffff', w: 400, h: 90, border: false })); st.position.set(0, 1.0, 0.92); car.g.add(st); K.rbox(0.6, 0.15, 0.3, 0.05, K.paint('#2a62ff'), 0, 1.62, 0, car.g); }
    CHAIRS = new THREE.Group(); sc.add(CHAIRS); for (let k = 0; k < 2; k++) { const c = new THREE.Group(); c.position.set(COP[0] - 1 + k * 2.0, 1.0, COP[1]); c.rotation.y = Math.PI; CHAIRS.add(c); K.rbox(0.55, 0.05, 0.5, 0.02, K.paint('#2a8ab8'), 0, 0.45, 0, c); K.rbox(0.55, 0.5, 0.05, 0.02, K.paint('#2a8ab8'), 0, 0.72, -0.25, c); for (const lx of [-0.24, 0.24]) { const l = K.rbox(0.03, 0.62, 0.03, 0.01, K.chrome(), lx, 0.22, 0, c); l.rotation.x = 0.4; } }
    K.rbox(0.8, 0.05, 0.6, 0.02, K.paint('#f4f2ee'), COP[0], 1.65, COP[1] - 0.2, CHAIRS); for (const s of [-1, 1]) K.cyl(0.02, 0.02, 0.65, K.chrome(), COP[0] + s * 0.3, 1.0, COP[1] - 0.2, CHAIRS, 6); K.cyl(0.12, 0.1, 0.35, K.glass({ color: '#fff2a0', opacity: 0.6 }), COP[0] + 0.15, 1.68, COP[1] - 0.2, CHAIRS, 14);
    const pl = S.board('NO SWIMMING|(GOOD LUCK)', 1.6, 0.9); pl.position.set(COP[0] - 7, 1.0, -RW - 0.8);
    CELL = new THREE.Group(); CELL.position.set(COP[0] + 6.5, 1.0, COP[1] - 0.6); sc.add(CELL); { const MT = K.paint('#3a3a40', { metal: 0.6, rough: 0.3 }); K.rbox(1.3, 0.12, 1.3, 0.03, MT, 0, 0.06, 0, CELL); K.rbox(1.3, 0.12, 1.3, 0.03, MT, 0, 2.2, 0, CELL); for (let k = 0; k < 6; k++) for (const sd of [-1, 1]) { K.cyl(0.03, 0.03, 2.1, MT, -0.6 + k * 0.24, 0.1, sd * 0.62, CELL, 6); K.cyl(0.03, 0.03, 2.1, MT, sd * 0.62, 0.1, -0.6 + k * 0.24, CELL, 6); } const cl = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.3), S.textMat('VERY SMALL CELL', { bg: '#f2c230', fg: '#1a1a1a', w: 500, h: 110, border: false })); cl.position.set(0, 2.45, 0.66); CELL.add(cl); }
    const bank = S.building({ w: 8, d: 6, floors: 2, color: '#e8e0d0', gable: 'pitched', shop: 'BANK', awning: '#1f3a8a', seed: 70, kind: 'plaster' }); bank.position.set(COP[0] + 14, 1.0, COP[1] - 7);
    S.bake(G);
    // ================= the hero prop: the Slippery Eel =================
    BOAT = new THREE.Group(); sc.add(BOAT); { const h = hull(K, BOAT); BOAT.userData.hull = h; const WD = K.mat('wood', '#a8784a', { detail: 0.3 }), WH = K.paint('#f4f2ee'), GO = K.gold();
      K.rbox(8.6, 0.1, 2.9, 0.03, WD, 0, 0.98, 0, BOAT);
      const cab = new THREE.Group(); cab.position.set(-2.6, 1.0, 0); BOAT.add(cab); K.rbox(2.4, 1.8, 2.2, 0.15, WH, 0, 0.9, 0, cab); K.rbox(2.6, 0.15, 2.4, 0.05, K.paint('#b8302a'), 0, 1.86, 0, cab);
      for (const sd of [-1, 1]) for (let k = 0; k < 2; k++) K.rbox(0.6, 0.5, 0.04, 0.05, K.glass(), -0.5 + k * 1.0, 1.2, sd * 1.11, cab); K.rbox(0.04, 0.5, 1.6, 0.05, K.glass(), 1.21, 1.2, 0, cab);
      const lb = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.08, 8, 20), K.paint('#ff6a1a')); lb.position.set(0, 0.9, 1.14); cab.add(lb);
      const mast = K.cyl(0.08, 0.1, 6.5, K.mat('wood', '#7a5a3a'), 0.6, 1.0, 0, BOAT, 10); void mast; K.rbox(1.6, 0.06, 0.06, 0.02, K.mat('wood', '#7a5a3a'), 0.6, 5.6, 0, BOAT);
      K.cyl(0.45, 0.4, 0.5, K.mat('wood', '#7a5a3a'), 0.6, 6.0, 0, BOAT, 14);   // crow's nest
      const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.6), S.textMat('BARNACLE|GANG', { bg: '#1a1a1e', fg: '#f2c230', w: 300, h: 180, border: false })); flag.material.side = THREE.DoubleSide; flag.position.set(0.1, 7.1, 0); BOAT.add(flag); BOAT.userData.flag = flag;
      for (let k = 0; k < 10; k++) { const c = new THREE.Group(); const cx = -0.5 + (k % 5) * 0.95, cz = (Math.floor(k / 5) - 0.5) * 1.15; c.position.set(cx + 0.6, 1.4, cz); BOAT.add(c);
        K.rbox(0.85, 0.8, 1.0, 0.06, K.paint('#4ab8e8', { rough: 0.4 }), 0, 0, 0, c); const lab = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.3), S.textMat('FROZEN|FISH', { bg: '#e8f4ff', fg: '#1f5aa8', w: 220, h: 100, border: false })); lab.position.set(0, 0, 0.51); c.add(lab);
        for (let j = 0; j < 3; j++) K.sphere(0.06, K.paint('#f4fbff'), (hash(k + j) - 0.5) * 0.6, 0.42, (hash(k * 2 + j) - 0.5) * 0.7, c); CRATES.push(c); }
      for (let k = 0; k < 8; k++) GOLD.push(K.rbox(0.42, 0.16, 0.22, 0.04, GO, -0.2 + (k % 4) * 0.5 + 0.6, 1.1, (Math.floor(k / 4) - 0.5) * 0.9, BOAT));
      BOAT.traverse((o) => { if (o.isMesh && !o.material.transparent) o.castShadow = true; }); }
    HATF = new THREE.Group(); sc.add(HATF); K.cyl(0.24, 0.26, 0.2, K.paint('#1f2a4a'), 0, 0, 0, HATF, 18); K.cyl(0.33, 0.33, 0.03, K.paint('#1a1a1a'), 0, 0, 0, HATF, 18); K.rbox(0.2, 0.08, 0.02, 0.01, K.gold(), 0, 0.12, 0.25, HATF);
    for (let k = 0; k < 10; k++) { const fs = new THREE.Group(); sc.add(fs); K.sphere(0.2, K.paint(['#c8d8e8', '#e8a85a', '#a8c8e8'][k % 3]), 0, 0, 0, fs, 1.5, 0.75, 0.45); const t = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.25, 4), K.paint('#c8d8e8')); t.rotation.z = Math.PI / 2; t.position.x = -0.34; fs.add(t); K.sphere(0.035, K.paint('#1a1a1a'), 0.2, 0.06, 0.08, fs); FISH.push(fs); }
    for (let k = 0; k < 14; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.1 + hash(k) * 0.08, 10, 8), K.glass({ color: '#e8f8ff', opacity: 0.5 })); sc.add(b); BUB.push(b); }
    // ================= explainer: salty sea tank vs river tank, the load line =================
    const EG = K.group(); K.cyl(10, 10, 0.1, K.paint('#1f2a44', { rough: 0.4 }), EX[0], 0, EX[2], EG, 64);
    for (const r of [5, 9.6]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.04, 8, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color('#36e2ff').multiplyScalar(1.6), toneMapped: false })); t.rotation.x = Math.PI / 2; t.position.set(EX[0], 0.12, EX[2]); t.userData.ndSkip = true; EG.add(t); }
    for (const [k, x, col, lab] of [[0, -2.4, '#2a86c8', 'SEA (SALTY)'], [1, 2.4, '#4aa88a', 'RIVER']]) { const T = new THREE.Group(); T.position.set(EX[0] + x, 0, EX[2]); sc.add(T); K.rbox(3.6, 2.6, 2.4, 0.08, K.glass({ opacity: 0.22 }), 0, 1.4, 0, T); K.rbox(3.8, 0.2, 2.6, 0.05, K.paint('#1c1c22'), 0, 0.1, 0, T);
      const w = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.9, 2.3), new THREE.MeshPhysicalMaterial({ color: col, transparent: true, opacity: 0.45, roughness: 0.1 })); w.position.y = 1.15; T.add(w);
      const l = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.5), S.textMat(lab, { bg: '#1c1c22', fg: k ? '#7af8a0' : '#4ab8ff', w: 600, h: 110, border: false })); l.position.set(0, 3.1, 0); T.add(l); TANKS.push(T);
      const tb = new THREE.Group(); T.add(tb); const hh = hull(K, tb, 0.28); void hh; for (let j = 0; j < 4; j++) K.rbox(0.18, 0.1, 0.12, 0.02, K.gold(), -0.4 + j * 0.25, 0.32, 0, tb); TBOATS.push(tb);
      for (let j = 0; j < 3; j++) { const a = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.4, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color('#7af8a0').multiplyScalar(1.6), toneMapped: false })); a.userData.ndSkip = true; T.add(a); ARR.push({ a, k, j }); } }
    SALT = new THREE.Group(); sc.add(SALT); { K.cyl(0.45, 0.5, 1.4, K.glass({ opacity: 0.5 }), 0, 0, 0, SALT, 18); K.cyl(0.4, 0.45, 1.1, K.paint('#f8f8f8', { rough: 0.9, coat: 0 }), 0, 0.05, 0, SALT, 18); K.cyl(0.47, 0.47, 0.3, K.chrome(), 0, 1.4, 0, SALT, 18); const sl = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.25), S.textMat('SALT', { bg: '#1f5aa8', fg: '#ffffff', w: 200, h: 80, border: false })); sl.position.set(0, 0.7, 0.51); SALT.add(sl); }
    HOLOHULL = hull(K, sc, 0.9, true); HOLOHULL.position.set(EX[0], 1.4, EX[2] + 3.5);
    MARKS = new THREE.Group(); sc.add(MARKS); for (const [y, c] of [[-0.25, '#4ab8ff'], [0.18, '#7af8a0']]) { const m = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.07, 0.04), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(2), toneMapped: false })); m.position.y = y; m.userData.ndSkip = true; MARKS.add(m); }
    // ================= characters =================
    GILL = K.stick({ jacket: '#1f2a4a', pants: '#3a3a4a', hat: 'cap', hatColor: '#1f2a4a', moustache: '#8a5a2a', scarf: '#e8302a', vest: '#f4f2ee', boots: '#1a1a1a', build: 'stout', belt: '#5a3a24' }, { key: 'gill' });
    MO = K.stick({ jacket: '#e8f0f4', pants: '#2a4a7a', hat: 'beanie', hatColor: '#e8302a', hairStyle: 'short', hair: '#2a1a14', gloves: '#f2c230', scarf: '#2a4a7a', boots: '#3a2418' }, { key: 'mo' });
    RAY = K.stick({ jacket: '#f2c230', pants: '#2a2a30', hairStyle: 'ponytail', hair: '#c8502a', glasses: true, vest: '#2a6a4a', boots: '#1a1a1a', belt: '#1a1a1a' }, { key: 'ray' });
    CAT = K.animal('cat', { seed: 2, color: '#8a8a90', scale: 1.2 });
    for (let k = 0; k < 2; k++) COPS.push(K.stick({ jacket: '#1f3a8a', pants: '#1f2a4a', hat: 'police', hatColor: '#1f3a8a', badge: true, tie: '#1a1a1a', belt: '#1a1a1a', moustache: k ? '#3a2418' : undefined, hairStyle: k ? 'short' : 'bun', hair: '#5a3a24', build: k ? 'stout' : undefined }, { key: 'cop' + k }));
    K.addClouds(12, 700, 150);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s);
    const ex = f >= 1216 && f < 1636;
    // ---------- the boat: where it is and how deep ----------
    let bx = 96, bz = -1.5, sink = 3.6, yaw = Math.PI / 2 * 0, rock = 0;
    if (f < 100) { bx = 94 + f * 0.01; sink = 2.0 + f * 0.012; }
    else if (f < 547) { bx = -30 + (f - 100) * 0.03; sink = f >= F.LOADED ? lerp(0.15, 0.72, sm(F.LOADED, F.BRIM + 10, f)) : 0.15; }
    else if (f < 672) { bx = lerp(24, 36, (f - 547) / 125); sink = 0.72; }
    else if (f < 1216) { bx = lerp(42, 96, sm(672, 1150, f)); sink = 0.72 + (f < 832 ? 0.35 * sm(F.SINKING, 830, f) : f < 908 ? lerp(1.07, 2.6, sm(832, 905, f)) : lerp(2.6, 3.4, sm(908, 1140, f))); }
    else if (f >= 1636) { bx = 98; sink = 3.4; }
    rock = 0.03 * Math.sin(f * 0.07);
    BOAT.visible = !ex; BOAT.position.set(bx, 0.7 - sink, bz); BOAT.rotation.set(rock, yaw, 0.02 * Math.sin(f * 0.05)); BOAT.userData.flag.rotation.y = 0.2 * Math.sin(f * 0.3);
    const thrown = f >= F.THREW - 4; CRATES.forEach((c, k) => { c.visible = !thrown || f < F.THREW - 4 + k * 3; c.position.y = 1.4; }); GOLD.forEach((g, k) => { g.position.y = 1.1 + (f >= 160 && f < 223 ? 1.05 * sm(160 + k, 172 + k, f) : 0); g.rotation.y = f >= 160 && f < 223 ? 0.3 * Math.sin(f * 0.1 + k) : 0; });
    const W = (x, z) => [BOAT.position.x + x, BOAT.position.y + 0, BOAT.position.z + z];   // boat-local helper (no yaw)
    // fish thaw + swim home
    FISH.forEach((fs, k) => { const t0 = F.THAWED + k * 2; fs.visible = !ex && f >= t0 && f < 1216; const u = (f - t0) / 30; fs.position.set(bx - 1 - u * 3 - k * 0.3, 0.05 + 0.15 * Math.sin(f * 0.4 + k), bz + (k % 2 ? 1 : -1) * (1.8 + u * 0.8)); fs.rotation.set(0, Math.PI, 0.2 * Math.sin(f * 0.6 + k)); });
    BUB.forEach((b, k) => { const on = !ex && f >= 672 && f < 1216 || f < 100; b.visible = on; const ph = ((f * 0.04 + hash(k)) % 1); b.position.set(bx - 3 + hash(k + 1) * 7, -0.2 + ph * 0.4, bz + (hash(k + 2) - 0.5) * 3.6); b.scale.setScalar(ph < 0.9 ? 1 : 0.01); });
    // ---------- gang ----------
    const roofY = BOAT.position.y + 1.0 + 1.93, deckY = BOAT.position.y + 1.0;
    let gp = { x: bx - 2.6, y: roofY, z: bz, yaw: 1.2 }, mp = { x: bx + 2.6, y: deckY + 0.8 + 0.0, z: bz + 0.4, yaw: 1.0 }, rp = { x: bx + 3.8, y: deckY, z: bz - 0.7, yaw: 2.0 };
    if (f >= 100 && f < 832) { gp = { x: bx + 3.2, y: deckY, z: bz + 0.3, yaw: f >= 223 && f < 333 ? 0.5 : 0.8 }; mp = { x: bx - 1.0, y: roofY, z: bz - 0.4, yaw: 0.8 }; rp = { x: bx - 4.0, y: deckY, z: bz + 0.6, yaw: 1.4 }; }
    if (f >= 832 && f < 1216) { gp = { x: bx - 2.6, y: roofY, z: bz, yaw: 1.0 }; mp = { x: bx - 3.2, y: roofY, z: bz + 0.6, yaw: 1.2 }; rp = { x: bx - 2.0, y: roofY, z: bz - 0.6, yaw: 0.6 }; }
    if (f < 100) { gp = { x: bx - 2.6, y: roofY, z: bz, yaw: 0.8 }; mp = { x: bx - 3.3, y: roofY, z: bz + 0.6, yaw: 1.2 }; rp = { x: bx - 1.9, y: roofY, z: bz - 0.5, yaw: 0.4 }; }
    if (f >= 1636) { gp = { x: COP[0] + 6.5, y: 1.0, z: COP[1] - 0.6, yaw: 0.3 }; mp = { x: COP[0] + 3.0, y: 1.0, z: COP[1] - 1.6, yaw: 0.6 }; rp = { x: COP[0] + 4.2, y: 1.0, z: COP[1] - 2.0, yaw: 0.2 }; }
    const gk = [[0, 'panic', { expr: 'scared', sweat: true }], [100, 'hips', { expr: 'smug' }], [F.GOLD - 4, 'show', { expr: 'grin', R: [0.4, 0.1, 'coin'] }], [F.FROZEN, 'point', { expr: 'smug' }], [223, 'carry', { expr: 'proud', item: 'box' }], [F.EVERY - 4, 'cheer', { expr: 'grin', talk: true }],
      [439, 'hips', { expr: 'proud' }], [F.STILL, 'shrug', { expr: 'smug' }], [547, 'point', { expr: 'smug', talk: true }], [672, 'idle', { expr: 'confused' }], [F.SINKING, 'shock', { expr: 'shock' }], [F.MIND, 'scared', { expr: 'nervous', sweat: true }],
      [832, 'panic', { expr: 'scared', sweat: true }], [908, 'throwBack', { expr: 'angry' }], [F.OVER - 3, 'throw', { expr: 'angry' }], [F.EVERY2 - 4, 'cheer', { expr: 'angry', talk: true }], [F.SWAM, 'facepalm', { expr: 'pained' }], [1030, 'cross', { expr: 'angry' }], [F.LEMON, 'facepalm', { expr: 'pained' }], [1148, 'shrug', { expr: 'confused' }],
      [1636, 'idle', { expr: 'sad' }], [F.EVERY3 - 4, 'grab', { expr: 'deadpan', talk: true }], [F.CELL, 'shrug', { expr: 'sad' }], [1771, 'idle', { expr: 'sad' }]];
    GILL.set(T.act(f, gk, { seed: 2, blink: blink(2) }), { ...gp, visible: !ex });
    HATF.visible = !ex && f >= F.HAT - 2 && f < 1216; HATF.position.set(gp.x - (f - F.HAT) * 0.02, 0.05 + 0.05 * Math.sin(f * 0.3), gp.z + 0.6); HATF.rotation.set(0.1 * Math.sin(f * 0.2), f * 0.02, 0);
    const crew = [[0, 'scared', { expr: 'scared' }], [100, 'carry', { expr: 'grin', item: 'box' }], [329, 'idle', { expr: 'smile' }], [439, 'lookAround', { expr: 'nervous' }], [672, 'idle', { expr: 'smug' }], [F.SINKING, 'shock', { expr: 'shock' }], [832, 'panic', { expr: 'scared', sweat: true }], [908, 'throw', { expr: 'nervous' }], [1030, 'cross', { expr: 'sad' }], [1636, 'idle', { expr: 'sad' }], [F.BANK, 'shrug', { expr: 'sad' }]];
    MO.set(T.act(f, crew, { seed: 5, blink: blink(5) }), { ...mp, visible: !ex }); RAY.set(T.act(f + 13, crew, { seed: 6, blink: blink(6) }), { ...rp, visible: !ex });
    // ---------- cops ----------
    const copsOn = !ex && (f < 100 || f >= 1030);
    COPS.forEach((c, k) => { let p = { x: COP[0] - 1 + k * 2.0, y: 1.0, z: COP[1], yaw: 0.0 }, sit = true; let ak = [[0, 'drink', { expr: 'smile', R: [0.3, 0.1, 'cup'] }], [40 + k * 20, 'drink', { expr: 'grin', R: [0.3, 0.1, 'cup'] }], [F.WAITED, 'drink', { expr: 'smile', R: [0.3, 0.1, 'cup'] }], [F.LEMON + k * 8, 'cheer', { expr: 'laugh' }], [1100, 'drink', { expr: 'smile', R: [0.3, 0.1, 'cup'] }]];
      if (f >= 1636) { sit = false; if (k === 0) { p = { x: COP[0] + 5.0, y: 1.0, z: COP[1] + 0.4, yaw: -0.6 }; ak = [[0, 'cross', { expr: 'smug' }], [F.CELL, 'point', { expr: 'grin' }]]; } else { const u = sm(1771, 1910, f); p = { x: COP[0] - 1 + u * 9, y: 1.0, z: COP[1] + 1.4, yaw: f >= 1771 ? Math.PI / 2 : -0.4 }; ak = [[0, 'idle', { expr: 'smile' }], [1771, 'walk', { expr: 'grin' }]]; } }
      c.set(T.act(f, ak, { seed: 40 + k, blink: blink(40 + k) }), { ...p, seat: sit ? 0.45 : undefined, visible: copsOn }); if (k === 1) COPP = p; });
    CHAIRS.visible = !ex;
    // ---------- Sir Whiskers ----------
    let cp = { x: bx + 0.6, y: BOAT.position.y + 6.25, z: bz, yaw: 1.0, mode: 'sit', expr: 'neutral' };
    if (f >= 100 && f < 333) cp = { x: bx - 2.6, y: roofY, z: bz + 0.3, yaw: 1.6, mode: f >= F.LOADED ? 'stand' : 'sleep', expr: f >= F.BRIM ? 'shock' : 'sleepy' };
    if (f >= 333 && f < 439) cp = { x: bx + 0.6, y: BOAT.position.y + 6.25, z: bz, yaw: 1.2, mode: f >= F.DRY ? 'beg' : 'sit', expr: 'happy' };
    if (f >= 439 && f < 832) cp = { x: bx + 0.6, y: BOAT.position.y + 6.25, z: bz, yaw: 1.3, mode: 'sit', expr: f >= F.LICKED ? 'angry' : 'neutral' };
    if (f >= 832 && f < 1216) cp = { x: bx + 0.6, y: BOAT.position.y + 6.25, z: bz, yaw: 1.3 + 0.2 * Math.sin(f * 0.05), mode: 'stand', expr: f > F.HAT ? 'shock' : 'angry' };
    if (f >= 1636) { const p = { x: COP[0] - 1 + sm(1771, 1910, f) * 9, z: COP[1] + 1.4 }; cp = { x: p.x - 0.05, y: 1.0 + 1.6, z: p.z + 1.1, yaw: Math.PI / 2, mode: f >= 1771 ? 'sit' : 'sit', expr: 'happy' }; if (f < 1771) cp = { x: COP[0] + 1.0, y: 1.0 + 1.85 + 0.42, z: COP[1], yaw: 0.2, mode: 'sit', expr: 'happy' }; }
    CAT.set(f, { ...cp, visible: !ex });
    // ---------- explainer ----------
    TANKS.forEach((t) => { t.visible = ex && f < 1529; }); SALT.visible = ex && f < 1349; SALT.position.set(EX[0] - 2.4 + 0.2, 4.4 + 0.2 * Math.sin(f * 0.5), EX[2] + 0.6); SALT.rotation.set(0, 0, 2.3);
    const loaded = f >= F.LOAD - 4 ? sm(F.LOAD - 4, F.LOAD + 10, f) : 0;
    const sY = 1.0 + 1.0 - 0.18 - 0.1 * loaded, rY = f < F.LIGHTER - 4 ? sY : 1.0 + 1.0 - 0.18 - lerp(0.12, 0.42 + 0.25 * loaded, sm(F.LIGHTER - 4, F.DEEPER + 10, f)) - (f >= F.FINISHES ? 0.6 * sm(F.FINISHES, F.JOB + 10, f) : 0);
    TBOATS[0].position.set(0, sY, 0); TBOATS[1].position.set(0, rY, 0); TBOATS.forEach((b) => { b.rotation.set(0.03 * Math.sin(f * 0.1), 0, 0); });
    ARR.forEach(({ a, k, j }) => { a.visible = ex && f >= F.PUSHES - 6 && f < 1529; const big = k === 0 ? 1.4 : 0.8; a.scale.setScalar(big); a.position.set(-0.6 + j * 0.6, 0.8 + 0.12 * Math.sin(f * 0.3 + j), 0.6); });
    HOLOHULL.visible = MARKS.visible = ex && f >= 1529; HOLOHULL.position.set(EX[0], 1.4, EX[2] + 3.6); HOLOHULL.rotation.set(0, 0, 0); MARKS.position.set(EX[0] - 1.6 * 0.9 + 0.81, 1.4, EX[2] + 3.6 + 1.63 * 0.9 + 0.03); MARKS.scale.setScalar(1.6);
    MARKS.children[0].scale.x = f >= F.SEAM - 4 ? 1 : 0.01; MARKS.children[1].scale.x = f >= F.HIGHER - 4 ? 1 : 0.01;
    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const body = (p, h = 2.3) => [[p.x, p.y, p.z], [p.x, p.y + h, p.z]];
    const BB = [[bx - 4.8, BOAT.position.y - 0.6, bz - 1.7], [bx + 5.4, BOAT.position.y + 7.4, bz + 1.7]];
    if (sh(0, 50)) {                          // 1. hook: the Slippery Eel sinking in the river, the gang on the roof, police on the bank with lemonade (wide)
      cam = K.fit([[bx - 4.8, -0.5, bz], [bx + 5.4, -0.5, bz], [bx + 0.6, BOAT.position.y + 7.2, bz], ...body(gp)], { yaw: 60, pitch: 8, fov: 46, margin: 0.8, maxDist: 12 }); cam.fov *= K.push(u, 0.05);
    } else if (sh(50, 100)) {                 // 2. ... then sank in a river (low across the water at the gang, cat up the mast)
      cam = K.fit([...body(gp), ...body(mp), [bx + 0.6, BOAT.position.y + 7, bz]], { yaw: 120, pitch: 4, fov: 44, margin: 0.85, maxDist: 11 }); cam.fov *= K.punch(f, F.RIVER0, 0.1, 6);
    } else if (sh(100, 160)) {                // 3. at sea: two tons of stolen gold (wide, open ocean, lighthouse far)
      cam = K.fit([...BB], { yaw: 60, pitch: 14, fov: 44, margin: 0.85, maxDist: 15 }); cam.fov *= K.punch(f, F.GOLD, 0.08, 6);
    } else if (sh(160, 223)) {                // 4. ... hidden under frozen fish (insert-wide on the crates and gold bars)
      cam = K.fit([W(-0.2, -1.2), W(4.8, 1.2), [bx + 2, deckY + 1.6, bz]], { yaw: 75, pitch: 30, fov: 40, margin: 0.9, maxDist: 8 }); cam.fov *= K.punch(f, F.FISH1, 0.08, 6);
    } else if (sh(223, 280)) {                // 5. loaded right to the brim (wide, crates, the hull sitting low)
      cam = K.fit([...BB, ...body(gp)], { yaw: 100, pitch: 6, fov: 44, margin: 0.85, maxDist: 14 }); cam.fov *= K.punch(f, F.BRIM, 0.1, 6);
    } else if (sh(280, 333)) {                // 6. "Every inch is money!" (Gill reaction close)
      cam = { pos: [gp.x + 1.3, gp.y + 1.8, gp.z + 2.6], look: [gp.x, gp.y + 1.55, gp.z], fov: 42 * K.push(u, 0.06) }; dof = { focus: 3.1, cinf: 12 };
    } else if (sh(333, 385)) {                // 7. Sir Whiskers wants only dry paws (crow's nest, sea below)
      cam = { pos: [cp.x + 2.2, cp.y + 0.6, cp.z + 2.4], look: [cp.x, cp.y + 0.3, cp.z], fov: 44 * K.push(u, 0.06) }; dof = { focus: 3.2, cinf: 10 }; cam.fov *= K.punch(f, F.PAWS, 0.1, 6);
    } else if (sh(385, 439)) {                // 8. ... the cat up the mast, the gang below (wide vertical)
      cam = K.fit([...BB], { yaw: 130, pitch: 2, fov: 44, margin: 0.85, maxDist: 14 });
    } else if (sh(439, 490)) {                // 9. so low that waves licked the deck (water-level wide)
      cam = { pos: [bx + 6.5, 0.35, bz + 6.0], look: [bx, 1.0, bz], fov: 50 }; dof = { focus: 8.5, cinf: 5 }; cam.fov *= K.punch(f, F.LICKED, 0.08, 6);
    } else if (sh(490, 547)) {                // 10. still, it floated (top-down-ish wide)
      cam = K.fit([...BB], { yaw: 80, pitch: 48, fov: 44, margin: 0.85, maxDist: 15 }); cam.fov *= K.punch(f, F.FLOATED, 0.08, 6);
    } else if (sh(547, 610)) {                // 11. the plan: up the Mudd River (wide on the river mouth sign + lighthouse)
      cam = K.fit([...BB, [MOUTH + 3, 3, -RW - 1.5], [MOUTH - 4, 13, -RW - 10]], { yaw: 160, pitch: 8, fov: 46, margin: 0.85, maxDist: 18 }); cam.fov *= K.punch(f, F.MUDD, 0.08, 6);
    } else if (sh(610, 672)) {                // 12. ... their hideout, an old pickle factory (wide upriver)
      cam = K.fit([[FACT[0] - 8, 0, RW - 2], [FACT[0] + 6, 10, FACT[1] + 3], [FACT[0] - 5.5, 2.5, RW + 1.8]], { yaw: -70, pitch: 10, fov: 44, margin: 0.85, maxDist: 22 }); cam.fov *= K.punch(f, F.PICKLE, 0.12, 6);
    } else if (sh(672, 740)) {                // 13. the moment it left the salty sea (tracking wide, colour line on the water)
      const tc = K.track(f, (g) => [lerp(42, 96, sm(672, 1150, g)), 0.6, bz], { off: [-6, 3.6, 10], lag: 6, lookY: 1.6 }); cam = { ...tc, fov: 50 };
    } else if (sh(740, 790)) {                // 14. started sinking (side wide on the hull, load line going under)
      cam = K.fit([...BB], { yaw: 95, pitch: 4, fov: 44, margin: 0.85, maxDist: 14 }); cam.fov *= K.punch(f, F.SLOWLY, 0.08, 6);
    } else if (sh(790, 832)) {                // 15. ... like it had changed its mind (gang reaction, full)
      cam = K.fit([...body(gp), ...body(mp), ...body(rp)], { yaw: 70, pitch: 6, fov: 42, margin: 0.95, maxDist: 9 }); cam.fov *= K.punch(f, F.MIND, 0.1, 6);
    } else if (sh(832, 870)) {                // 16. first the deck went under (low wide)
      cam = K.fit([...BB], { yaw: 60, pitch: 6, fov: 46, margin: 0.85, maxDist: 14 }); cam.fov *= K.punch(f, F.DECK, 0.1, 6);
    } else if (sh(870, 908)) {                // 17. then the fish, then the captain's hat (closer wide on the roof)
      cam = K.fit([...body(gp), [gp.x - 2, 0, gp.z + 1], [bx + 0.6, BOAT.position.y + 6.6, bz]], { yaw: 110, pitch: 6, fov: 44, margin: 0.9, maxDist: 10 }); cam.fov *= K.punch(f, F.HAT, 0.12, 6);
    } else if (sh(908, 970)) {                // 18. Gill throws the fish overboard (wide, crates flying)
      cam = K.fit([...BB, [bx - 4, 0, bz + 4]], { yaw: 80, pitch: 10, fov: 46, margin: 0.85, maxDist: 14 }); cam.fov *= K.punch(f, F.OVER, 0.08, 6);
    } else if (sh(970, 1030)) {               // 19. the fish thawed and swam home (low over the water, fish swimming past)
      cam = { pos: [bx - 9, 1.0, bz + 4.5], look: [bx - 3, 0.4, bz], fov: 48 }; dof = { focus: 7, cinf: 6 }; cam.fov *= K.punch(f, F.SWAM, 0.1, 6);
    } else if (sh(1030, 1090)) {              // 20. it kept sinking; the police waited on the bank (wide: bank + boat)
      cam = K.fit([[COP[0] - 2, 1, COP[1]], [COP[0] + 2, 3.2, COP[1]], [bx, 0, bz], [bx + 0.6, BOAT.position.y + 7, bz]], { yaw: 115, pitch: 10, fov: 46, margin: 0.85, maxDist: 15 }); cam.fov *= K.punch(f, F.POLICE, 0.08, 6);
    } else if (sh(1090, 1148)) {              // 21. ... with lemonade (cops full shot, sipping)
      cam = K.fit([[COP[0] - 1.6, 1, COP[1]], [COP[0] + 1.6, 3.2, COP[1]]], { yaw: 120, pitch: 6, fov: 40, margin: 1.0, maxDist: 7 }); cam.fov *= K.punch(f, F.LEMON, 0.1, 6);
    } else if (sh(1148, 1216)) {              // 22. So how can a boat float at sea and sink in a river? (Gill on the roof, waist-deep)
      cam = { pos: [gp.x + 2.4, gp.y + 1.7, gp.z + 2.0], look: [gp.x, gp.y + 1.4, gp.z], fov: 44 * K.push(u, 0.06) }; dof = { focus: 3.3, cinf: 12 };
    } else if (sh(1216, 1290)) {              // 23. explainer: sea water is full of salt (wide on the two tanks)
      cam = K.fit([[EX[0] - 4.4, 0, EX[2] - 1.2], [EX[0] + 4.4, 3.4, EX[2] + 1.2]], { yaw: 90, pitch: 8, fov: 44, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.SALT, 0.08, 6);
    } else if (sh(1290, 1349)) {              // 24. heavier water pushes up harder (closer on the sea tank, big arrows)
      cam = K.fit([[EX[0] - 4.3, 0.4, EX[2] - 1.2], [EX[0] - 0.5, 3.0, EX[2] + 1.2]], { yaw: 70, pitch: 6, fov: 42, margin: 0.9, maxDist: 8 }); cam.fov *= K.punch(f, F.PUSHES, 0.1, 6);
    } else if (sh(1349, 1420)) {              // 25. river water is lighter: the same boat sinks deeper (both tanks)
      cam = K.fit([[EX[0] - 4.4, 0, EX[2] - 1.2], [EX[0] + 4.4, 3.4, EX[2] + 1.2]], { yaw: 105, pitch: 4, fov: 44, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.DEEPER, 0.1, 6);
    } else if (sh(1420, 1529)) {              // 26. load it to the brim at sea, and the river finishes the job (river tank close-wide)
      cam = K.fit([[EX[0] + 0.5, 0.3, EX[2] - 1.2], [EX[0] + 4.3, 3.0, EX[2] + 1.2]], { yaw: 80 + 15 * u, pitch: 6, fov: 42, margin: 0.9, maxDist: 8 }); cam.fov *= K.punch(f, F.JOB, 0.12, 6);
    } else if (sh(1529, 1636)) {              // 27. ships wear a load line: a sea mark and a higher river mark (holo hull side)
      cam = K.fit([[EX[0] - 2.6, 0.6, EX[2] + 5.1], [EX[0] + 1.2, 2.4, EX[2] + 5.1]], { yaw: 90 - 10 * u, pitch: 4, fov: 40, margin: 1.0, maxDist: 6 }); cam.fov *= K.punch(f, F.HIGHER, 0.1, 6);
    } else if (sh(1636, 1700)) {              // 28. the gold went back to the bank (wide on the bank: BANK, police car, the gang)
      cam = K.fit([...body(mp), ...body(rp), [COP[0] + 14, 6, COP[1] - 7], ...body(gp)], { yaw: 70, pitch: 8, fov: 46, margin: 0.85, maxDist: 16 }); cam.fov *= K.punch(f, F.BANK, 0.08, 6);
    } else if (sh(1700, 1771)) {              // 29. "Every inch is money," from a very small cell (full shot on the cell)
      cam = K.fit([[COP[0] + 5.7, 1, COP[1] - 1.4], [COP[0] + 7.3, 3.6, COP[1] + 0.2], ...body(COPS[0].root.position ? { x: COP[0] + 5.0, y: 1, z: COP[1] + 0.4 } : gp)], { yaw: 80, pitch: 6, fov: 40, margin: 1.0, maxDist: 7 }); cam.fov *= K.punch(f, F.CELL, 0.12, 6);
    } else {                                  // 30. Sir Whiskers rides home, dry, on a policeman's hat (tracking wide along the riverbank, the sunk boat behind)
      const p = COPP || { x: COP[0], z: COP[1] }; cam = K.fit([[p.x - 0.8, 1, p.z - 0.6], [p.x + 0.8, 4.0, p.z + 0.6], [p.x - 3, 0.2, -RW + 0.5]], { yaw: lerp(60, 80, u), pitch: 8, fov: 44, margin: 0.95, maxDist: 8 }); cam.fov *= K.punch(f, F.DRY2, 0.1, 6);
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    if (!ex && f >= 908 && f < 970) K.sparks(f, 908, 970, [bx - 1, 0.1, bz + 2], { dir: [0, 1, 0.3], spread: 0.8, rate: 18, speed: 3.5, life: 16, color: '#d8f0ff', seed: 6 });
    if (!ex && (f < 100 || (f >= 832 && f < 1216))) K.steam(f, [bx, 0.1, bz], { rate: 5, size: 0.5, rise: 0.4, drift: [0, 0], dark: 0 });
    if (ex && f >= F.SALT - 6 && f < 1349) K.sparks(f, F.SALT - 6, 1349, [EX[0] - 2.4 + 0.2, 3.0, EX[2]], { dir: [0, -1, 0], spread: 0.2, rate: 30, speed: 2, life: 18, color: '#ffffff', seed: 3 });
    K.leaves(f, cam.look, { area: 12, count: 6, fall: 0.3, colors: ['#ffffff', '#e8f4ff'] });
    K.mist(f, 1208, 16); K.mist(f, 1628, 16);
    K.badge(f, F.SANK, 'SANK IN A RIVER', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 98 });
    K.badge(f, F.TWO, '2 TONS OF GOLD', { sx: 0.5, sy: 0.2 }, { icon: 'coin', f1: F.FROZEN - 2 });
    K.badge(f, F.FROZEN, 'UNDER FROZEN FISH', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 221 });
    K.badge(f, F.BRIM, 'LOADED TO THE BRIM', { sx: 0.5, sy: 0.2 }, { icon: 'weight', f1: 330 });
    K.badge(f, F.DRY, 'WANTS: DRY PAWS', { sx: 0.5, sy: 0.2 }, { icon: 'drop', f1: 436 });
    K.badge(f, F.MUDD, 'MUDD RIVER', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: F.PICKLE - 2 });
    K.badge(f, F.PICKLE, 'HIDEOUT: PICKLE FACTORY', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 668 });
    K.badge(f, F.SINKING, 'SINKING...', { sx: 0.5, sy: 0.2 }, { icon: 'down', f1: 828 });
    if (f >= 832 && f < 908) K.hud(f, 834, { stages: 3, labels: ['DECK', 'FISH', 'HAT'], u: f < F.FISH2 ? 0.15 : f < F.HAT ? 0.5 : 0.95, f1: 906 });
    for (const [t, w, nx] of [[F.DECK, 'DECK: UNDER', F.FISH2], [F.FISH2, 'FISH: UNDER', F.HAT], [F.HAT, 'HAT: UNDER', 906]]) K.badge(f, t, w, { sx: 0.5, sy: 0.3 }, { icon: 'down', f1: nx - 2 });
    K.badge(f, F.SWAM, 'FISH: GONE HOME', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 1027 });
    K.badge(f, F.LEMON, 'POLICE: WAITING', { sx: 0.5, sy: 0.2 }, { icon: 'clock', f1: 1145 });
    K.badge(f, F.SALT, 'SALT = HEAVIER WATER', { sx: 0.5, sy: 0.2 }, { icon: 'weight', f1: F.PUSHES - 2 });
    K.badge(f, F.PUSHES, 'PUSHES UP HARDER', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: 1346 });
    K.badge(f, F.DEEPER, 'RIVER: SINKS DEEPER', { sx: 0.5, sy: 0.2 }, { icon: 'down', f1: F.LOAD - 2 });
    K.badge(f, F.JOB, 'BRIM + RIVER = SUNK', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 1526 });
    K.badge(f, F.LINE, 'LOAD LINE', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1633 });
    K.badge(f, F.SEAM, 'SEA MARK', [EX[0] + 0.2, 1.0, EX[2] + 5.1], { icon: 'drop', f1: 1633 }); K.badge(f, F.HIGHER, 'RIVER MARK', [EX[0] - 0.6, 2.2, EX[2] + 5.1], { icon: 'up', f1: 1633 });
    K.badge(f, F.CELL, 'VERY SMALL CELL', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 1768 });
    K.badge(f, F.DRY2, 'PAWS: DRY', { sx: 0.5, sy: 0.2 }, { style: 'stamp', size: 1.1, f1: 1918 });
    const L = K.light('golden', { az: 120, el: 32, shadowExt: 26, exposure: 1.12, fogFar: 420 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
