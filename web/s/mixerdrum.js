// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "He Delivered 9 Tons of Concrete in One Piece" — invented story, engine: The Bet (SCRIPTS.md §000).
// Moose ("Spinning is for washing machines!") bets dispatcher Dolores a week of donuts he can get to Elm Street without turning
// his cement truck's drum. Bruno the bulldog, who jogs on the drum every morning, slides off. Eleven ducklings hold the truck at the
// Main Street crossing for two hours; inside, the concrete goes soup, oatmeal, peanut butter, bowling ball; Moose hits the switch and
// the whole truck spins instead of the drum. Explainer: concrete doesn't dry — water and cement grab hands and grow into rock, even
// underwater; spinning keeps it stirred like a smoothie. Elm Street gets a nine-ton gumball; the builders call a crane; Bruno gets a
// nine-ton jogging ball.
import { TOTAL, LINES, wf } from './mixerdrum_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const DEPOT = -38, CROSS = -6, STOPX = -15, SITE = 30, LANE = -1.6, BR = 1.1;   // truck x at depot / zebra / stop line / Elm St site
const EX = [160, 0, 0];
const CRANE = [7, -5.0];
let THREE, F = {}, TRUCK, DRUMG, DRUM, HALVES = [], HOLO, CONC, BALL, CRN = {}, MOOSE, DOL, BLD = [], DOG, MOM, DUCKS = [], EXTRAS, LEVER;
let WAT = [], CEM = [], LINKS = [], ROCK, TANK, TBLOCK, FISH, SMOO, SWIRL, HDRUM, HBALLS = [], BOX;

function stripeTex(a, b) { const c = document.createElement('canvas'); c.width = 512; c.height = 512; const g = c.getContext('2d');
  g.fillStyle = a; g.fillRect(0, 0, 512, 512); g.fillStyle = b; for (let k = -4; k < 8; k++) { g.beginPath(); g.moveTo(k * 128, 0); g.lineTo(k * 128 + 64, 0); g.lineTo(k * 128 + 64 + 256, 512); g.lineTo(k * 128 + 256, 512); g.fill(); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 1); return t; }
function drumProfile() { return [[0.45, -2.5], [0.95, -2.2], [1.22, -1.2], [1.25, 0.0], [1.15, 1.2], [0.85, 2.1], [0.5, 2.5]].map(([r, y]) => new THREE.Vector2(r, y)); }
function cone(K, parent, x, z) { const g = new THREE.Group(); parent.add(g); g.position.set(x, 0, z);
  K.rbox(0.42, 0.05, 0.42, 0.02, K.paint('#1a1a1e'), 0, 0.025, 0, g); const c = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.62, 16), K.paint('#ff6a1a', { rough: 0.4 })); c.position.y = 0.36; g.add(c);
  const b = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.125, 0.1, 16), K.paint('#f4f4f0')); b.position.y = 0.38; g.add(b); return g; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { DELIV: wf(0, 'delivered'), NINE: wf(0, 'nine'), ELM: wf(0, 'elm'), PIECE: wf(0, 'piece'), BET: wf(1, 'bet'), DOL: wf(1, 'dolores'), DONUTS: wf(1, 'donuts'), DRUM1: wf(1, 'drum'),
      SPIN: wf(2, 'spinning'), WASH: wf(2, 'washing'), FLIP: wf(2, 'flipped'), OFF: wf(2, 'off'), BRUNO: wf(3, 'bruno'), JOGS: wf(3, 'jogs'), SLID: wf(3, 'slid'),
      ELEVEN: wf(4, 'eleven'), CROSSED: wf(4, 'crossed'), SLOWLY: wf(4, 'slowly'), HOURS: wf(4, 'hours'), SOUP: wf(5, 'soup'), OAT: wf(5, 'oatmeal'), PEANUT: wf(5, 'peanut'), BOWL: wf(5, 'bowling'),
      HIT: wf(6, 'hit'), STAYED: wf(6, 'stayed'), SPUN: wf(6, 'spun'), WHAT: wf(7, 'what'), STONE: wf(7, 'stone'), DRY: wf(8, 'dry'), GRAB: wf(8, 'grab'), GROW: wf(8, 'grow'), UNDER: wf(8, 'underwater'),
      STIRRED: wf(9, 'stirred'), SMOOTHIE: wf(9, 'smoothie'), LOCK: wf(9, 'lock'), STOP: wf(10, 'stop'), TWO: wf(10, 'two'), GUMBALL: wf(10, 'gumball'),
      WHISP: wf(11, 'whispered'), BUILDERS: wf(11, 'builders'), CRANE: wf(11, 'crane'), GOT: wf(12, 'got'), DONUTS2: wf(12, 'donuts'), BRUNO2: wf(12, 'bruno'), JOG: wf(12, 'jogging') };
    // ================= the town: Main Street -> Elm Street =================
    S.street({ len: 110, width: 7, sidewalk: 4.5, crossings: [CROSS] });
    K.slab(-90, 120, -0.2, -0.01, -60, 60, K.mat('grime', '#6aa84f', { amt: 0.6 }), sc, false);
    let x = -55, i = 0;
    while (x < 50) { const w = 5 + (i * 7 % 4); const shop = x > DEPOT - 6 && x < DEPOT + 2 ? null : [null, 'BAKERY', null, 'DONUTS', null, 'HARDWARE', null, 'CAFE'][i % 8];
      if (!(x > DEPOT - 7 && x < DEPOT + 3)) { const b = S.building({ w, d: 9, floors: 2 + (i % 3), seed: i + 1, shop, shutters: i % 3 === 0 ? '#2a5a3a' : null, flowers: i % 2 === 0, kind: i % 5 === 3 ? 'plaster' : 'brick' }); b.position.set(x + w / 2, 0.15, -8); }
      x += w + 0.05; i++; }
    x = -55; i = 20;
    while (x < 50) { const w = 5 + (i * 5 % 4); const b = S.building({ w, d: 9, floors: 2 + (i % 3 === 0 ? 1 : 0), seed: i + 1, shop: i % 4 === 0 ? ['FLOWERS', 'BOOKS', 'TOYS'][(i / 4 | 0) % 3] : null, shutters: i % 4 === 1 ? '#7a2a2a' : null, flowers: true }); b.position.set(x + w / 2, 0, 26); b.rotation.y = Math.PI; x += w + 0.05; i++; }
    // park on the +z side (keeps the camera side open): hedges, benches, trees further back
    const PG = K.group(); for (let k = -54; k < 50; k += 3.2) K.rbox(2.8, 0.7, 0.8, 0.25, K.mat('grime', '#3f8a3a', { detail: 0.4 }), k, 0.35, 8.6, PG);
    for (let k = -50; k < 50; k += 2.6) K.sphere(0.07, K.paint(['#f4f2ee', '#f2c230', '#e84a8f'][Math.abs(k * 10 | 0) % 3], { coat: 0 }), k + 1, 0.74, 8.3, PG); S.bake(PG);
    for (let k = -50; k <= 48; k += 9) { const t = S.tree({ h: 5.5, seed: k + 31 }); t.position.set(k, 0, 19 + (k % 2) * 2); }
    const dep = S.building({ w: 10, d: 9, floors: 1, color: '#e8d8b0', gable: 'flat', seed: 77, shop: 'MOOSE MIX CONCRETE', awning: '#ff6a1a', kind: 'plaster' }); dep.position.set(DEPOT - 2, 0.15, -8);
    for (let k = -50; k <= 48; k += 8) for (const s of [-1]) { if (Math.abs(k - CROSS) < 3) continue; const t = S.tree({ h: 4.2, seed: k + s * 7 }); t.position.set(k + (s > 0 ? 4 : 0), 0.15, s * 5.6); }
    for (let k = -46; k <= 46; k += 12) { const l = S.streetLamp(); l.position.set(k, 0.15, -4.1); }
    for (const [kk, sx, sz] of [['yield', CROSS - 5.5, -4.2], ['warn', CROSS + 3.5, -4.2], ['parking', DEPOT + 6, -4.2], ['arrow', 14, 4.2]]) { const s = S.sign(kk); s.position.set(sx, 0.15, sz); s.rotation.y = sz > 0 ? Math.PI : 0; }
    for (const [bx, bz, r] of [[-24, -5.8, 0], [-14, 5.8, Math.PI]]) { const b = S.bench(); b.position.set(bx, 0.15, bz); b.rotation.y = r; }
    for (const [px, pz] of [[CROSS - 5, -6.2], [CROSS + 9, -6.2], [-28, -6.2]]) { const p = S.planter(sc, px); p.position.set(px, 0.15, pz); }
    for (const [bx, bz] of [[-20, -4.4], [12, -4.4]]) { const b = S.bin(); b.position.set(bx, 0.15, bz); }
    const ds = S.board('DUCK|CROSSING', 1.4, 0.9); ds.position.set(CROSS - 3.2, 0.15, -4.8);
    for (const [cx, cz, kind, seed] of [[-27, -2.7, 'hatch', 2], [-22, -2.7, 'van', 3], [-1, -2.7, 'taxi', 4], [40, 2.7, 'hatch', 5]]) { const c = S.car({ kind, seed }); c.g.position.set(cx, 0, cz); if (cz > 0) c.g.rotation.y = Math.PI; }
    // depot yard: sand piles, sacks, a donut box on a crate
    const YG = K.group();
    for (let k = 0; k < 3; k++) K.sphere(1.4 - k * 0.2, K.mat('dirt', ['#d8c08a', '#a8a49c', '#c8b07a'][k], { detail: 0.3 }), DEPOT - 7 + k * 2.6, 0, -5.4, YG, 1, 0.55, 0.8);
    for (let k = 0; k < 6; k++) K.rbox(0.7, 0.3, 0.45, 0.1, K.mat('fabric', '#e8dcc0', { detail: 0.2 }), DEPOT + 3 + (k % 3) * 0.75, 0.3 + Math.floor(k / 3) * 0.3, -5.6, YG);
    const sk = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.35), S.textMat('CEMENT', { bg: '#e8dcc0', fg: '#3a3a3a', w: 400, h: 100 })); sk.position.set(DEPOT + 3.75, 0.62, -5.37); YG.add(sk);
    S.bake(YG);
    // Elm Street site: barriers, cones, forms, signs
    const SG = K.group();
    for (let k = 0; k < 9; k++) cone(K, SG, 6 + k * 3, 3.0 + (k % 2) * 0.4);
    for (let k = 0; k < 5; k++) { const bx = 8 + k * 6; K.rbox(2.0, 0.22, 0.12, 0.03, K.paint(k % 2 ? '#f4f4f0' : '#ff6a1a'), bx, 0.95, 4.0, SG); K.rbox(2.0, 0.22, 0.12, 0.03, K.paint(k % 2 ? '#ff6a1a' : '#f4f4f0'), bx, 0.6, 4.0, SG); for (const d of [-0.9, 0.9]) K.rbox(0.08, 1.1, 0.5, 0.02, K.paint('#2a2a30'), bx + d, 0.55, 4.0, SG); }
    for (let k = 0; k < 7; k++) K.rbox(4.2, 0.2, 0.08, 0.02, K.mat('wood', '#c8a070'), 9 + k * 4.4, 0.25, 5.0, SG);
    K.slab(8, 40, 0.15, 0.17, 5.05, 7.4, K.mat('dirt', '#9a7a5a', { detail: 0.5 }), SG, false);
    S.bake(SG);
    const eb = S.board('ELM ST.|NEW SIDEWALK', 2.6, 1.5); eb.position.set(23, 0.15, -5.0);
    const wc = S.protestSign('WET|CEMENT', { bg: '#f2c230', fg: '#1a1a1a' }); wc.position.set(18, 0.15, -4.4); wc.rotation.y = 0.3;
    // ================= the hero prop: Moose Mix cement truck =================
    TRUCK = new THREE.Group(); sc.add(TRUCK); { const OR = K.paint('#ff6a1a', { rough: 0.25 }), WH = K.paint('#f4f2ee', { rough: 0.3 }), BK = K.paint('#1c1c22', { rough: 0.45 }), CH = K.chrome(), GL = K.glass({ color: '#bfe4ff', opacity: 0.35 });
      K.rbox(8.2, 0.45, 1.9, 0.06, BK, 0, 0.95, 0, TRUCK);                                   // chassis
      K.rbox(1.9, 1.1, 2.3, 0.2, OR, 3.25, 1.75, 0, TRUCK);                                  // cab lower (dash height)
      K.rbox(0.14, 1.45, 2.26, 0.05, OR, 2.38, 2.95, 0, TRUCK);                               // cab back wall
      for (const s of [-1, 1]) { K.rbox(0.14, 1.4, 0.14, 0.04, OR, 3.88, 2.98, s * 1.08, TRUCK); K.rbox(0.12, 1.4, 0.12, 0.04, OR, 2.45, 2.98, s * 1.08, TRUCK); }  // pillars, open side windows
      K.rbox(1.7, 0.14, 2.32, 0.05, OR, 3.15, 3.64, 0, TRUCK);                                // roof
      K.rbox(0.5, 0.12, 0.7, 0.03, K.paint('#2a2a30'), 3.6, 2.35, 0.3, TRUCK); K.sphere(0.07, K.paint('#d02a2a'), 3.55, 2.45, 0.55, TRUCK);   // dash + red drum button
      K.rbox(0.5, 0.5, 0.7, 0.08, K.mat('fabric', '#5a3a24'), 2.75, 2.1, 0.45, TRUCK);       // seat
      K.rbox(0.08, 0.85, 1.9, 0.05, GL, 3.92, 3.1, 0, TRUCK);                                // windscreen
      K.rbox(0.25, 0.7, 2.0, 0.05, CH, 4.25, 1.55, 0, TRUCK);                                // grille
      for (let k = 0; k < 6; k++) K.rbox(0.05, 0.6, 1.8, 0.01, BK, 4.38, 1.55, -0.75 + k * 0.3, TRUCK).scale.z = 0.08;
      K.rbox(0.3, 0.3, 2.4, 0.08, CH, 4.4, 1.0, 0, TRUCK);                                   // bumper
      for (const s of [-0.8, 0.8]) { const hl = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff2c0').multiplyScalar(2), toneMapped: false })); hl.position.set(4.33, 2.1, s); TRUCK.add(hl); }
      for (const s of [-1, 1]) { K.cyl(0.07, 0.07, 1.4, CH, 2.3, 1.2, s * 1.0, TRUCK, 10); K.rbox(0.12, 0.5, 0.06, 0.02, CH, 4.0, 3.2, s * 1.3, TRUCK); }   // exhaust stacks, mirrors
      K.rbox(1.72, 0.05, 2.34, 0.02, WH, 3.15, 3.73, 0, TRUCK); K.rbox(0.6, 0.18, 1.4, 0.05, K.paint('#f2c230'), 3.2, 3.84, 0, TRUCK);   // roof + beacon
      const nm = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.5), S.textMat('MOOSE|MIX', { bg: '#ff6a1a', fg: '#ffffff', w: 400, h: 140, border: false })); for (const s of [-1, 1]) { const n = nm.clone(); n.position.set(3.25, 1.75, s * 1.16); n.rotation.y = s > 0 ? 0 : Math.PI; TRUCK.add(n); }
      // drum on a frame, tilted, rear up; spiral stripes; a chute at the back
      for (const xx of [-3.2, 1.4]) { K.rbox(0.3, 1.4, 1.7, 0.05, BK, xx, 1.75, 0, TRUCK); }
      DRUMG = new THREE.Group(); DRUMG.position.set(-0.9, 2.45, 0); DRUMG.rotation.z = Math.PI / 2 - 0.16; TRUCK.add(DRUMG);
      DRUM = new THREE.Group(); DRUMG.add(DRUM);
      const dm = K.paint('#ffffff', { rough: 0.3 }); dm.map = stripeTex('#ff6a1a', '#f4f2ee');
      for (let h = 0; h < 2; h++) { const hg = new THREE.Group(); DRUM.add(hg); const m = new THREE.Mesh(new THREE.LatheGeometry(drumProfile(), 40, h * Math.PI, Math.PI), dm); m.castShadow = true; m.receiveShadow = true; m.material.side = THREE.DoubleSide; hg.add(m);
        for (const yy of [-1.2, 0, 1.2]) { const rr = yy === 0 ? 1.27 : yy < 0 ? 1.24 : 1.17; const t = new THREE.Mesh(new THREE.TorusGeometry(rr, 0.05, 8, 40, Math.PI), CH); t.rotation.x = Math.PI / 2; t.rotation.z = h * Math.PI; t.position.y = yy; hg.add(t); }
        HALVES.push(hg); }
      const cap = K.cyl(0.47, 0.47, 0.1, CH, 0, -2.55, 0, DRUMG, 24);
      HOLO = new THREE.Mesh(new THREE.LatheGeometry(drumProfile(), 40), K.holo('#36e2ff')); DRUMG.add(HOLO);
      CONC = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), K.paint('#9a968c', { rough: 0.8, coat: 0.3 })); DRUMG.add(CONC);
      const ch = K.rbox(0.5, 1.4, 0.18, 0.04, CH, -3.9, 2.2, 0, TRUCK); ch.rotation.z = -0.7; K.rbox(0.6, 0.1, 0.5, 0.02, CH, -4.1, 1.7, 0, TRUCK).rotation.z = -0.4;
      K.rbox(0.6, 0.4, 0.5, 0.04, K.paint('#2a6aa8'), 1.6, 1.4, 1.1, TRUCK);                  // water tank
      LEVER = new THREE.Group(); LEVER.position.set(1.15, 1.35, 1.18); TRUCK.add(LEVER); K.rbox(0.45, 0.45, 0.12, 0.04, K.paint('#2a2a30'), 0, 0, 0, LEVER);
      const lb = new THREE.Group(); lb.position.set(0, 0, 0.1); LEVER.add(lb); LEVER.userData.arm = lb; K.cyl(0.03, 0.03, 0.45, CH, 0, 0, 0, lb, 8); K.sphere(0.07, K.paint('#d02a2a'), 0, 0.45, 0, lb);
      const lp = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.18), S.textMat('DRUM ON|OFF', { bg: '#f2c230', fg: '#1a1a1a', w: 200, h: 90 })); lp.position.set(0, 0.36, 0.07); LEVER.add(lp);
      TRUCK.userData.wheels = []; for (const wx of [-3.0, -1.7, 3.2]) for (const s of [-1, 1]) { const w = new THREE.Group(); w.position.set(wx, 0.55, s * 1.0); TRUCK.add(w);
        const t = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.4, 24), K.paint('#1a1a1a', { rough: 0.7, coat: 0.2 })); t.rotation.x = Math.PI / 2; w.add(t); const hb = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.42, 16), CH); hb.rotation.x = Math.PI / 2; w.add(hb);
        for (let k = 0; k < 5; k++) { const n = K.sphere(0.035, K.gold(), Math.cos(k * 1.256) * 0.18, Math.sin(k * 1.256) * 0.18, s * 0.22, w); }
        TRUCK.userData.wheels.push(w); }
      for (const wx of [-2.35, 3.2]) for (const s of [-1, 1]) K.rbox(1.3, 0.12, 0.5, 0.04, BK, wx, 1.22, s * 1.05, TRUCK);  // mudguards
      TRUCK.traverse((o) => { if (o.isMesh && !o.material.transparent) o.castShadow = true; }); HOLO.castShadow = false; }
    // the nine-ton gumball
    BALL = new THREE.Group(); sc.add(BALL); { const m = new THREE.Mesh(new THREE.SphereGeometry(BR, 40, 28), K.mat('rock', '#a8a49a', { detail: 0.25, amt: 0.35, bump: 0.02 })); m.castShadow = true; BALL.add(m);
      for (let k = 0; k < 7; k++) { const p = K.sphere(0.12 + hash(k) * 0.06, K.mat('rock', '#8a8478'), 0, 0, 0, BALL); const a = hash(k + 3) * 6.28, b = (hash(k + 7) - 0.5) * 3; p.position.set(Math.cos(a) * Math.cos(b) * BR * 0.97, Math.sin(b) * BR * 0.97, Math.sin(a) * Math.cos(b) * BR * 0.97); }
      const st = K.rbox(0.9, 0.12, 0.5, 0.04, K.paint('#ff6a1a'), 0, BR * 0.6, BR * 0.82, BALL); st.rotation.x = -0.6; }
    // the crane
    CRN.g = new THREE.Group(); sc.add(CRN.g); CRN.g.position.set(CRANE[0], 0, CRANE[1]); { const Y = K.paint('#f2c230', { rough: 0.3 }), BK = K.paint('#1c1c22');
      K.rbox(5, 1.0, 2.2, 0.1, Y, 0, 1.0, 0, CRN.g); K.rbox(1.4, 1.3, 2.0, 0.15, Y, 2.2, 2.0, 0, CRN.g); K.rbox(0.06, 0.8, 1.6, 0.03, K.glass(), 2.92, 2.1, 0, CRN.g);
      for (const wx of [-1.6, 0, 1.6]) for (const s of [-1, 1]) { const t = K.cyl(0.45, 0.45, 0.35, BK, wx, 0.45, s * 1.05, CRN.g, 20); t.rotation.x = Math.PI / 2; t.position.y = 0.45; }
      K.cyl(0.7, 0.8, 0.5, BK, -0.6, 1.5, 0, CRN.g, 20);
      CRN.boom = new THREE.Group(); CRN.boom.position.set(-0.6, 2.2, 0); CRN.g.add(CRN.boom);
      const L = 10.5; for (const s of [-1, 1]) { const r = K.rbox(L, 0.12, 0.12, 0.03, Y, L / 2, 0, s * 0.3, CRN.boom); } for (let k = 0; k < 14; k++) { const b = K.rbox(0.08, 0.08, 0.6, 0.02, Y, 0.4 + k * 0.72, 0, 0, CRN.boom); const d = K.rbox(0.06, 0.06, 0.85, 0.02, Y, 0.75 + k * 0.72, 0, 0, CRN.boom); d.rotation.y = 0.8; }
      CRN.L = L; CRN.cable = K.cyl(0.025, 0.025, 1, BK, 0, 0, 0, sc, 6); CRN.hook = K.rbox(0.3, 0.5, 0.15, 0.05, K.chrome(), 0, 0, 0, sc);
      const cs = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.5), S.textMat('BIG LIFT CO.', { bg: '#1c1c22', fg: '#f2c230', w: 600, h: 120, border: false })); cs.position.set(0, 1.0, 1.12); CRN.g.add(cs); }
    // ================= explainer stage =================
    const EG = K.group(); K.cyl(9, 9, 0.1, K.paint('#1f2a44', { rough: 0.4 }), EX[0], 0, EX[2], EG, 64);
    for (const r of [4, 8.6]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.04, 8, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color('#36e2ff').multiplyScalar(1.6), toneMapped: false })); t.rotation.x = Math.PI / 2; t.position.set(EX[0], 0.12, EX[2]); t.userData.ndSkip = true; EG.add(t); }
    const wm = new THREE.MeshBasicMaterial({ color: new THREE.Color('#4ab8ff').multiplyScalar(1.6), toneMapped: false }), cm = K.paint('#8a8a90', { rough: 0.6 });
    for (let k = 0; k < 9; k++) { const c = K.sphere(0.32, cm, 0, 0, 0, sc); CEM.push(c); const w = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), wm); w.userData.ndSkip = true; sc.add(w); WAT.push(w); }
    for (let k = 0; k < 12; k++) { const a = k % 3, b = Math.floor(k / 3); const pts = k < 6 ? [[-1.4 + (k % 3) * 1.4, 1.2 + Math.floor(k / 3) * 1.4], [-1.4 + (k % 3) * 1.4, 1.2 + (Math.floor(k / 3) + 1) * 1.4]] : [[-1.4 + Math.floor((k - 6) / 3) * 1.4, 1.2 + ((k - 6) % 3) * 1.4], [-1.4 + (Math.floor((k - 6) / 3) + 1) * 1.4, 1.2 + ((k - 6) % 3) * 1.4]];
      void a; void b; LINKS.push(K.trace(pts.map(([px, py]) => [EX[0] + px, py, EX[2] - 1]), { color: '#7af8a0', r: 0.05 })); }
    ROCK = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 1), K.mat('rock', '#a8a49a', { detail: 0.2 })); ROCK.castShadow = true; sc.add(ROCK);
    TANK = new THREE.Group(); sc.add(TANK); TANK.position.set(EX[0] + 3.5, 0, EX[2] + 2.5); { K.rbox(3, 2.2, 2, 0.06, K.glass({ opacity: 0.25 }), 0, 1.2, 0, TANK); const wt = new THREE.Mesh(new THREE.BoxGeometry(2.9, 1.8, 1.9), new THREE.MeshPhysicalMaterial({ color: '#3a9ae8', transparent: true, opacity: 0.4, roughness: 0.1 })); wt.position.y = 1.0; TANK.add(wt);
      K.rbox(3.1, 0.15, 2.1, 0.04, K.paint('#1c1c22'), 0, 0.08, 0, TANK); TBLOCK = K.rbox(1.0, 0.7, 0.7, 0.08, K.mat('rock', '#a8a49a', { detail: 0.2 }), 0, 0.5, 0, TANK);
      FISH = new THREE.Group(); TANK.add(FISH); const fb = K.sphere(0.18, K.paint('#ff8a2a'), 0, 0, 0, FISH, 1.4, 0.8, 0.5); const ft = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.22, 4), K.paint('#ff8a2a')); ft.rotation.z = Math.PI / 2; ft.position.x = -0.3; FISH.add(ft); K.sphere(0.035, K.paint('#1a1a1a'), 0.17, 0.05, 0.07, FISH); void fb;
      const tl = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.45), S.textMat('UNDERWATER', { bg: '#1c1c22', fg: '#4ab8ff', w: 500, h: 110, border: false })); tl.position.set(0, 2.6, 0); TANK.add(tl); }
    HDRUM = new THREE.Group(); HDRUM.position.set(EX[0] - 1.5, 2.2, EX[2] - 0.5); HDRUM.rotation.z = Math.PI / 2 - 0.16; sc.add(HDRUM); { const m = new THREE.Mesh(new THREE.LatheGeometry(drumProfile(), 40), K.holo('#36e2ff')); HDRUM.add(m); HDRUM.scale.setScalar(1.15);
      for (let k = 0; k < 14; k++) { const b = k % 2 ? new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 10), wm) : K.sphere(0.22, cm, 0, 0, 0, HDRUM); if (k % 2) { b.userData.ndSkip = true; HDRUM.add(b); } HBALLS.push(b); } }
    SMOO = new THREE.Group(); sc.add(SMOO); SMOO.position.set(EX[0] + 3.2, 0, EX[2] + 1.8); { const cup = K.cyl(0.95, 0.75, 2.8, K.glass({ opacity: 0.3 }), 0, 0.1, 0, SMOO, 32); void cup;
      const ins = K.cyl(0.88, 0.7, 2.3, K.paint('#f07aa8', { rough: 0.5 }), 0, 0.15, 0, SMOO, 32); void ins; SWIRL = new THREE.Group(); SWIRL.position.y = 2.46; SMOO.add(SWIRL);
      for (let k = 0; k < 3; k++) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.6 - k * 0.18, 0.06, 8, 24, Math.PI * 1.4), K.paint('#ffd0e0')); t.rotation.x = Math.PI / 2; t.rotation.z = k * 2; SWIRL.add(t); }
      const straw = K.cyl(0.07, 0.07, 3.2, K.paint('#3ab86a'), 0.4, 0.4, 0, SMOO, 10); straw.rotation.z = -0.18; K.sphere(0.16, K.paint('#e8202a'), -0.25, 2.75, 0.3, SMOO); }
    // ================= characters =================
    MOOSE = K.stick({ jacket: '#3a4a6a', pants: '#2a2a40', hat: 'cap', hatColor: '#ff6a1a', moustache: '#4a2a14', vest: '#f2e030', gloves: '#c8a070', belt: '#5a3a24', build: 'stout', pockets: true }, { key: 'moose' });
    DOL = K.stick({ jacket: '#7a4ab0', pants: '#2a2a40', hairStyle: 'bun', hair: '#c8502a', glasses: '#d02a6a', scarf: '#f2c230', collar: '#f4efe4', badge: true }, { key: 'dol' });
    const bo = [{ hat: 'hardhat', hatColor: '#f2c230', jacket: '#2a6aa8', vest: '#ff7a1a', pants: '#3a3a4a', belt: '#3a2418', boots: '#5a3a24' },
      { hat: 'hardhat', hatColor: '#f4f4f0', jacket: '#b02a2a', vest: '#c8f030', pants: '#2a2a40', moustache: '#2a1a14', gloves: '#f2c230', boots: '#3a2418' },
      { hat: 'hardhat', hatColor: '#3ab86a', jacket: '#2a8a7a', vest: '#ff7a1a', pants: '#4a3a2a', hairStyle: 'ponytail', hair: '#1a1210', scarf: '#f4f4f0', build: 'kid' }];
    bo.forEach((o, k) => BLD.push(K.stick(k === 2 ? { ...o, build: undefined } : o, { key: 'b' + k })));
    DOG = K.animal('dog', { color: '#d8b48a', seed: 3, scale: 1.15 });
    MOM = K.animal('duck', { seed: 5, scale: 1.15 }); for (let k = 0; k < 11; k++) DUCKS.push(K.animal('duck', { seed: 20 + k, scale: 0.6, color: '#f2d030' }));
    EXTRAS = S.extras(7, { x0: -50, len: 40, z: -5.4, spread: 1.4, seed: 3 }).concat(S.extras(4, { x0: -30, len: 20, z: -4.6, spread: 0.6, seed: 40 }));
    BOX = new THREE.Group(); sc.add(BOX); { K.rbox(0.6, 0.2, 0.6, 0.03, K.paint('#f4d0e0'), 0, 0.1, 0, BOX); const bl = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.15), S.textMat('DONUTS', { bg: '#f4d0e0', fg: '#d02a6a', w: 300, h: 80, border: false })); bl.position.set(0, 0.11, 0.305); BOX.add(bl);
      for (let k = 0; k < 4; k++) { const d = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.04, 8, 16), K.paint(['#f08ab8', '#8a5a34', '#f2c230', '#f08ab8'][k])); d.rotation.x = Math.PI / 2; d.position.set(-0.14 + (k % 2) * 0.28, 0.24, -0.14 + Math.floor(k / 2) * 0.28); BOX.add(d); } }
    K.addClouds(10, 700, 150);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s), S = K.set;
    const ex = f >= 784 && f < 1018;
    // ---------- truck ----------
    let tx = SITE, tyaw = 0, drumSpin = 0, open = 0;
    const depot = f >= 108 && f < 330, drive = f >= 330 && f < 411, cross = f >= 411 && f < 784;
    if (depot) { tx = DEPOT; drumSpin = (f < F.OFF + 4 ? f : F.OFF + 4 + 10 * sm(F.OFF + 4, F.OFF + 30, f)) * 0.12; }
    else if (drive) { tx = lerp(DEPOT, STOPX, sm(330, 408, f)); drumSpin = (F.OFF + 14) * 0.12; }
    else if (cross) { tx = STOPX; drumSpin = (F.OFF + 14) * 0.12; tyaw = Math.PI * 4 * sm(F.SPUN - 6, F.SPUN + 44, f); }
    else drumSpin = (F.OFF + 14) * 0.12;
    if (f < 108) open = 1; else if (f >= 1018) open = sm(F.STOP - 2, F.STOP + 10, f);
    TRUCK.visible = !ex; TRUCK.position.set(tx, 0, LANE); TRUCK.rotation.set(0, tyaw, 0);
    TRUCK.userData.wheels.forEach((w) => { w.rotation.z = -(tx - DEPOT) / 0.55 - (cross ? tyaw * 3 : 0); });
    DRUM.rotation.y = drumSpin; HALVES[0].rotation.x = -0.9 * open; HALVES[1].rotation.x = 0.9 * open; HALVES[0].position.z = -0.5 * open; HALVES[1].position.z = 0.5 * open;
    const xray = f >= 520 && f < 633; HALVES.forEach((h) => { h.visible = !xray; }); HOLO.visible = xray;
    const stage = f < F.OAT - 2 ? 0 : f < F.PEANUT - 2 ? 1 : f < F.BOWL - 2 ? 2 : 3;
    CONC.visible = xray; { const wob = [0.18, 0.1, 0.05, 0][stage] * Math.sin(f * 0.5); CONC.scale.set(stage < 3 ? 1.05 + wob : 1.0, stage < 3 ? 1.6 - stage * 0.15 : 1.0, stage < 3 ? 1.05 - wob : 1.0); CONC.position.set(stage < 3 ? -0.35 : 0, stage < 3 ? 0.2 : 0, 0);
      CONC.material.color.set(['#b8b4a8', '#a8a294', '#9a8e7a', '#8a8a86'][stage]); CONC.material.roughness = [0.15, 0.4, 0.6, 0.85][stage]; }
    LEVER.userData.arm.rotation.z = f >= F.FLIP - 2 || f < 108 || f >= 330 ? -0.9 : 0.9;
    // ---------- the gumball ----------
    let bx = 22, by = BR, bz = LANE + 0.3, brot = 0;
    if (f < 108) { bx = 22 - f * 0.08; brot = (22 - bx) / BR; }
    else if (f >= 1018 && f < F.STOP + 10) { BALL.visible = false; }
    else if (f >= F.STOP + 10 && f < 1148) { const u = (f - F.STOP - 10); bx = Math.max(13, 26.2 - u * 0.12); by = u < 8 ? 3.0 - (3.0 - BR) * (u / 8) ** 2 : BR + 0.25 * Math.max(0, Math.sin((u - 8) * 0.35)) * Math.exp(-(u - 8) * 0.05); brot = (26.2 - bx) / BR; }
    else if (f >= 1148 && f < 1206) { bx = 13; brot = (26.2 - 13) / BR; by = BR + 4.2 * sm(F.CRANE - 4, F.CRANE + 30, f); }
    else if (f >= 1206) { bx = 13; by = BR; brot = (26.2 - 13) / BR + (f - 1206) * 0.06; }
    BALL.visible = !ex && (f < 108 || f >= F.STOP + 10); BALL.position.set(bx, by, bz); BALL.rotation.set(0, 0, brot);
    // crane boom aims at the ball spot
    { const tip = [13, 8.8, bz], piv = [CRANE[0] - 0.6, 2.2, CRANE[1]]; const dx = tip[0] - piv[0], dy = tip[1] - piv[1], dz = tip[2] - piv[2]; const hd = Math.hypot(dx, dz);
      CRN.boom.rotation.set(0, Math.atan2(-dz, dx), 0); CRN.boom.rotateZ(Math.atan2(dy, hd)); const L = Math.hypot(hd, dy); CRN.boom.scale.set(L / CRN.L, 1, 1);
      const hookY = f >= 1148 && f < 1206 ? by + BR + 0.4 : 7.0; CRN.cable.position.set(tip[0], (tip[1] + hookY) / 2, tip[2]); CRN.cable.scale.set(1, tip[1] - hookY, 1); CRN.hook.position.set(tip[0], hookY, tip[2]);
      CRN.g.visible = CRN.cable.visible = CRN.hook.visible = !ex && (f < 108 || f >= 1096); }
    // ---------- Moose ----------
    let mp = { x: 26.5, z: 1.4, yaw: -1.4 }, mseat = false;
    if (f >= 108 && f < 215) mp = { x: DEPOT - 0.8, z: 1.1, yaw: -1.9 };
    else if (f >= 215 && f < 330) mp = { x: DEPOT + 1.85, z: LANE + 1.6, yaw: f < F.FLIP + 6 ? -1.9 : 0.4 };
    else if (f >= 330 && f < 736) { mseat = true; const c = Math.cos(tyaw), s = Math.sin(tyaw); const lx = 3.0, lz = 0.45; mp = { x: TRUCK.position.x + lx * c + lz * s, z: TRUCK.position.z - lx * s + lz * c, yaw: tyaw + (f >= 633 && f < 700 ? 0.5 : 1.5708), y: 1.7 }; }
    else if (f >= 736 && f < 784) mp = { x: STOPX - 1.0, z: LANE + 1.7, yaw: 2.9 };
    else if (f >= 1206) mp = { x: 17.5, z: 1.8, yaw: -1.3 };
    const mk = [[0, 'panic', { expr: 'scared', sweat: true }], [60, 'facepalm', { expr: 'pained' }], [108, 'point', { expr: 'smug' }], [F.BET - 4, 'hips', { expr: 'grin' }], [F.DONUTS - 4, 'shake', { expr: 'grin' }], [F.DRUM1, 'pointUp', { expr: 'proud' }],
      [215, 'idle', { expr: 'smug' }], [F.SPIN - 6, 'reach', { expr: 'proud', talk: true }], [F.FLIP - 2, 'grab', { expr: 'grin', talk: true }], [F.OFF + 4, 'cheer', { expr: 'laugh' }], [330, 'sit', { expr: 'whistle' }],
      [F.SLOWLY, 'sit', { expr: 'deadpan' }], [F.HOURS, 'sit', { expr: 'sleepy' }], [524, 'sit', { expr: 'nervous' }], [F.HIT - 4, 'sit', { expr: 'angry', R: [0.5, -0.3, 'open'] }], [F.STAYED, 'sit', { expr: 'shock' }], [F.SPUN, 'sit', { expr: 'dazed' }],
      [736, 'hammer', { expr: 'confused' }], [1018, 'shock', { expr: 'shock' }], [F.GUMBALL, 'panic', { expr: 'scared', sweat: true }], [1096, 'idle', { expr: 'sad' }], [F.WHISP - 4, 'shrug', { expr: 'nervous', talk: true }], [F.CRANE, 'facepalm', { expr: 'pained' }],
      [1206, 'idle', { expr: 'sad' }], [F.DONUTS2, 'shrug', { expr: 'pained' }], [F.JOG, 'facepalm', { expr: 'dazed' }]];
    if (f >= 1018 && f < 1206) mp = { x: 27.5, z: 1.6, yaw: -1.2 };
    const mA = T.act(f, mk.map((k) => k[1] === 'shake' ? [k[0], 'reach', k[2]] : k), { seed: 3, blink: blink(3) });
    MOOSE.set(mA, { ...mp, seat: mseat ? 0.45 : undefined, visible: !ex });
    // ---------- Dolores ----------
    let dp = { x: DEPOT - 2.2, z: 1.1, yaw: 1.7 }; const dvis = !ex && ((f >= 108 && f < 330) || f >= 1206);
    if (f >= 1206) dp = { x: 15.5, z: 2.6, yaw: -0.6 };
    const dk = [[108, 'hips', { expr: 'smug' }], [F.DOL - 2, 'point', { expr: 'grin' }], [F.DONUTS - 4, 'reach', { expr: 'smile', R: [0.4, 0.2, 'donut'] }], [215, 'cross', { expr: 'deadpan' }], [F.OFF + 4, 'facepalm', { expr: 'deadpan' }], [F.SLID, 'shock', { expr: 'shock' }],
      [1206, 'eat', { expr: 'smile', R: [0.25, 0.1, 'donut'] }], [F.DONUTS2 + 6, 'cheer', { expr: 'laugh' }], [F.JOG, 'eat', { expr: 'grin', R: [0.25, 0.1, 'donut'] }]];
    DOL.set(T.act(f, dk, { seed: 6, blink: blink(6) }), { ...dp, visible: dvis });
    BOX.visible = dvis; BOX.position.set(f >= 1206 ? 14.6 : DEPOT - 3.0, 0, f >= 1206 ? 2.0 : 1.6);
    // ---------- builders ----------
    BLD.forEach((b, k) => { let p, act;
      if (f < 108) { p = { x: bx - 4.2 - k * 1.6, z: 0.4 + k * 1.1 - 1.2, yaw: -Math.PI / 2 }; act = [[0, 'run', { expr: 'scared' }]]; }
      else if (f >= F.STOP + 10 && f < 1148) { const u = f - F.STOP - 10; p = { x: 19 - u * 0.1 - k * 1.5, z: 0.6 + k * 1.0 - 1.0, yaw: u < 6 ? Math.PI / 2 : -Math.PI / 2 }; act = [[0, u < 8 ? 'shock' : 'run', { expr: 'scared' }]]; }
      else if (f >= 1018 && f < 1206) { p = { x: 10 + k * 1.3, z: 3.0 + (k % 2) * 0.6, yaw: f < 1148 ? 1.6 : 0.6 }; act = [[0, f < 1148 ? 'stop' : k === 1 ? 'phone' : 'pointUp', { expr: f < 1148 ? 'shock' : 'excited', R: k === 1 && f >= 1148 ? [0.3, 0.3, 'phone'] : undefined }]]; }
      else if (f >= 1206) { p = { x: 9.5 + k * 1.2, z: 3.4 + (k % 2) * 0.7, yaw: 1.2 }; act = [[0, k === 0 ? 'clap' : k === 1 ? 'celebrate' : 'cheer', { expr: 'laugh' }]]; }
      b.set(T.act(f, act || [[0, 'idle']], { seed: 10 + k, blink: blink(10 + k) }), { ...(p || { x: 0, z: 0 }), visible: !!p && !ex }); });
    // ---------- Bruno the bulldog ----------
    let dg = { visible: false };
    if (f < 108) dg = { x: bx, y: 2 * BR - 0.02, z: bz, yaw: Math.PI / 2, mode: 'run', expr: 'happy', speed: 1.3 };
    else if (f >= 108 && f < 330) { const topY = 2.45 + 1.22; if (f < F.SLID - 2) dg = { x: DEPOT - 0.9, y: topY, z: LANE, yaw: f < F.OFF + 4 ? 0 : 0.3, mode: f < F.OFF + 10 ? 'run' : 'stand', expr: f < F.OFF + 4 ? 'happy' : 'shock', speed: 1.2 };
      else { const u = sm(F.SLID - 2, F.SLID + 14, f); dg = { x: DEPOT - 0.9, y: topY * (1 - u * u), z: LANE + 1.6 * u, yaw: 0.2, mode: u < 1 ? 'jump' : 'sit', expr: u < 1 ? 'shock' : 'angry' }; } }
    else if (f >= 330 && f < 411) dg = { x: DEPOT - 0.9, z: LANE + 1.6, yaw: 1.4 + 0.3 * Math.sin(f * 0.1), mode: 'sit', expr: 'sad', nod: 0.2 };
    else if (f >= 1206) dg = { x: 13, y: 2 * BR - 0.02, z: bz, yaw: Math.PI / 2, mode: 'run', expr: 'happy', speed: 1.1 };
    else if (f >= 1018 && f < 1206) dg = { x: 22 + Math.max(0, 1.5 - (f - 1018) * 0.03), z: 2.6, yaw: -1.8, mode: f >= F.GUMBALL ? 'wag' : 'sit', expr: f >= F.GUMBALL ? 'happy' : 'neutral' };
    DOG.set(f, dg);
    // ---------- ducks ----------
    const dOn = f >= 411 && f < 784; const mz = 3.4 - (f - 411) * 0.016;
    MOM.set(f, { x: CROSS, z: mz, y: Math.abs(mz) > 3.55 ? 0.15 : 0, yaw: Math.PI, mode: 'walk', speed: 0.5, expr: f >= F.SPUN && f < 760 ? 'shock' : 'neutral', visible: dOn });
    DUCKS.forEach((d, k) => d.set(f, { x: CROSS + 0.12 * Math.sin(k * 2.1), z: mz + 0.7 + k * 0.5, y: Math.abs(mz + 0.7 + k * 0.5) > 3.55 ? 0.15 : 0, yaw: Math.PI + 0.1 * Math.sin(f * 0.05 + k), mode: f >= F.SPUN && f < F.SPUN + 30 && k % 3 === 0 ? 'jump' : 'walk', speed: 0.6, expr: f >= F.SPUN ? 'shock' : 'happy', visible: dOn }));
    S.extrasFrame(f, EXTRAS, T);
    // ---------- explainer ----------
    const gA = sm(F.GRAB - 6, F.GRAB + 16, f);
    CEM.forEach((c, k) => { const gx = -1.4 + (k % 3) * 1.4, gy = 1.2 + Math.floor(k / 3) * 1.4; const sx = gx * 2.2 + (hash(k) - 0.5) * 2, sy = 1.2 + hash(k + 5) * 3.2;
      c.visible = ex && f < 930; c.position.set(EX[0] + lerp(sx, gx, gA), lerp(sy, gy, gA) + 0.08 * Math.sin(f * 0.2 + k), EX[2] - 1);
      WAT[k].visible = c.visible; WAT[k].position.set(EX[0] + lerp(sx + 1.6 * (hash(k + 9) - 0.5) * 3, gx + 0.45, gA), lerp(sy + 1, gy + 0.3, gA), EX[2] - 1 + lerp(1.2, 0.3, gA)); });
    LINKS.forEach((l, k) => l.show(ex && f < 930 ? sm(F.GRAB + 4 + k * 2, F.GRAB + 16 + k * 2, f) : 0));
    ROCK.visible = ex && f >= F.GROW - 4 && f < 930; { const s = 2.2 * sm(F.GROW - 4, F.GROW + 16, f); ROCK.scale.setScalar(Math.max(0.01, s)); ROCK.position.set(EX[0], 2.6, EX[2] - 1.6); ROCK.rotation.set(f * 0.01, f * 0.02, 0); }
    TANK.visible = ex && f >= F.UNDER - 10 && f < 930; TBLOCK.material.color.set(f > F.UNDER + 10 ? '#a8a49a' : '#c8c4b8'); FISH.position.set(1.0 * Math.cos(f * 0.06), 1.5, 0.5 * Math.sin(f * 0.06)); FISH.rotation.y = -f * 0.06 - Math.PI / 2;
    HDRUM.visible = ex && f >= 930; HDRUM.rotation.x = 0; HDRUM.children[0].rotation.y = f * 0.15;
    HBALLS.forEach((b, k) => { const a = f * 0.15 + k * 0.9, rr = 0.4 + (k % 4) * 0.18; b.position.set(Math.cos(a) * rr, -1.8 + (k / 14) * 3.6, Math.sin(a) * rr); });
    SMOO.visible = ex && f >= F.SMOOTHIE - 8; SWIRL.rotation.y = f * 0.2;
    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const body = (x, z, y = 0, h = 2.3) => [[x, y, z], [x, y + h, z]];
    const TB = (ax = 0) => [[TRUCK.position.x - 4.3 + ax, 0, LANE - 1.2], [TRUCK.position.x + 4.4 + ax, 3.9, LANE + 1.2]];
    if (sh(0, 52)) {                          // 1. hook: a stone ball rolls down Elm Street, Bruno jogging on top, builders fleeing (wide, front)
      cam = K.fit([[bx - BR, 0, bz - BR], [bx + BR, 2 * BR + 0.8, bz + BR], ...BLD.map((b) => [b.root.position.x, 2.2, b.root.position.z])], { yaw: 168, pitch: 13, fov: 42, margin: 0.72, maxDist: 12 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(52, 108)) {                 // 2. in one piece: Moose by his cracked-open drum, the ball rolling away (side wide)
      cam = K.fit([[bx, 0, bz], [bx, 2.5, bz], ...body(mp.x, mp.z), [SITE - 4.3, 3.8, LANE]], { yaw: 62, pitch: 8, fov: 42, margin: 0.8, maxDist: 12 }); cam.fov *= K.punch(f, F.PIECE, 0.12, 6);
    } else if (sh(108, 160)) {                // 3. that morning at Moose Mix: the bet (wide: truck, drum spinning, Bruno jogging on top)
      cam = K.fit([...TB(), ...body(mp.x, mp.z), ...body(dp.x, dp.z), [DEPOT - 4, 3.0, -7.5]], { yaw: 70, pitch: 10, fov: 44, margin: 0.85, maxDist: 15 }); cam.fov *= K.punch(f, F.BET, 0.06, 6);
    } else if (sh(160, 215)) {                // 4. a week of donuts (full shot: handshake + the donut box)
      cam = K.fit([...body(mp.x, mp.z), ...body(dp.x, dp.z), [DEPOT - 3, 0.2, 1.6], [DEPOT - 0.9, 3.8, LANE]], { yaw: 105, pitch: 6, fov: 40, margin: 0.95, maxDist: 10 }); cam.fov *= K.punch(f, F.DONUTS, 0.08, 6);
    } else if (sh(215, 258)) {                // 5. "Spinning is for washing machines!" (Moose reaction at the drum lever)
      cam = { pos: [mp.x - 2.6, 1.9, mp.z + 1.4], look: [mp.x - 0.2, 1.55, mp.z - 0.2], fov: 42 * K.push(u, 0.06) }; dof = { focus: 2.9, cinf: 12 };
    } else if (sh(258, 305)) {                // 6. flipped it off: the drum stops (wide)
      cam = K.fit([...TB(), ...body(mp.x, mp.z), [DEPOT - 0.9, 4.4, LANE]], { yaw: 125, pitch: 14, fov: 42, margin: 0.9, maxDist: 13 }); cam.fov *= K.punch(f, F.OFF, 0.1, 6);
    } else if (sh(305, 358)) {                // 7. Bruno, who jogs on that drum, slides right off (wide on the drum)
      cam = K.fit([[DEPOT - 3.2, 0, LANE], [DEPOT + 1.5, 4.4, LANE], [DEPOT - 0.9, 0, LANE + 2]], { yaw: 80, pitch: 6, fov: 42, margin: 0.8, maxDist: 10 }); cam.fov *= K.punch(f, F.SLID, 0.12, 6);
    } else if (sh(358, 411)) {                // 8. Bruno, grumpy, watches the truck drive off (dog-level, truck leaving behind)
      cam = { pos: [DEPOT + 1.4, 0.8, LANE + 4.6], look: [DEPOT - 0.9, 0.6, LANE + 1.6], fov: 44 * K.push(u, 0.06) }; dof = { focus: 3.6, cinf: 8 };
    } else if (sh(411, 466)) {                // 9. eleven ducklings cross Main Street (high wide: truck at the stop line, the zebra, the shops)
      cam = K.fit([[STOPX + 4.4, 0, LANE], [STOPX - 4, 3.9, LANE], [CROSS, 0, mz], [CROSS, 0.6, mz + 5.2], [CROSS + 3, 2.5, 4.6]], { yaw: 125, pitch: 24, fov: 44, margin: 0.85, maxDist: 14 }); cam.fov *= K.punch(f, F.ELEVEN, 0.08, 6);
    } else if (sh(466, 520)) {                // 10. slowly, for two hours (low wide along the zebra, truck waiting behind the ducks)
      cam = { pos: [CROSS + 2.8, 0.5, mz + 3.4 + u * 0.3], look: [CROSS - 1.8, 0.7, mz + 1.4], fov: 48 }; dof = { focus: 3.6, cinf: 6 };
    } else if (sh(520, 578)) {                // 11. x-ray: inside the drum, soup -> oatmeal (side wide on the truck)
      cam = K.fit(TB(), { yaw: 90, pitch: 10, fov: 42, margin: 0.85, maxDist: 12 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(578, 633)) {                // 12. peanut butter, bowling ball (drum insert-wide)
      cam = K.fit([[STOPX - 3.6, 1.0, LANE - 1.3], [STOPX + 1.8, 3.9, LANE + 1.3]], { yaw: 60, pitch: 18, fov: 40, margin: 0.9, maxDist: 8 }); cam.fov *= K.punch(f, F.BOWL, 0.12, 6);
    } else if (sh(633, 682)) {                // 13. Moose hits the switch (cab reaction, through the open side window)
      cam = { pos: [STOPX + 3.4, 3.1, LANE + 3.6], look: [STOPX + 3.0, 2.85, LANE + 0.45], fov: 44 * K.push(u, 0.06) }; dof = { focus: 3.3, cinf: 12 };
    } else if (sh(682, 736)) {                // 14. the whole truck spins instead (high wide, ducks frozen)
      cam = K.fit([[STOPX - 5.5, 0, LANE - 5.5], [STOPX + 4.5, 3.9, LANE + 5.5], [CROSS, 0, mz]], { yaw: 105, pitch: 40, fov: 44, margin: 0.85, maxDist: 16 }); const s = K.shake(f, F.SPUN, 0.08, 20); cam.pos[0] += s[0]; cam.pos[1] += s[1]; cam.fov *= K.punch(f, F.SPUN, 0.12, 6);
    } else if (sh(736, 784)) {                // 15. what turned it to stone? Moose knocks on the drum (wide)
      cam = K.fit([...TB(), ...body(mp.x, mp.z), [CROSS, 0, mz]], { yaw: 72, pitch: 8, fov: 42, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.STONE, 0.1, 6);
    } else if (sh(784, 850)) {                // 16. explainer: water and cement grab hands (wide lattice)
      cam = K.fit([[EX[0] - 3.2, 0, EX[2] - 1], [EX[0] + 3.2, 5, EX[2] - 1], [EX[0], 0, EX[2] + 1]], { yaw: 90 + 14 * u, pitch: 8, fov: 42, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.GRAB, 0.08, 6);
    } else if (sh(850, 930)) {                // 17. ... and grow into rock, even underwater (rock + tank)
      cam = K.fit([[EX[0] - 1.5, 0, EX[2] - 2], [EX[0] + 5, 4.8, EX[2] + 3.5]], { yaw: 70 - 12 * u, pitch: 12, fov: 42, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.UNDER, 0.1, 6);
    } else if (sh(930, 975)) {                // 18. spinning keeps it stirred (x-ray drum, balls tumbling)
      cam = K.fit([[EX[0] - 4.5, 0.6, EX[2] - 1.8], [EX[0] + 1.5, 3.8, EX[2] + 0.8]], { yaw: 95, pitch: 10, fov: 40, margin: 0.9, maxDist: 10 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(975, 1018)) {               // 19. like a smoothie (drum + giant smoothie)
      cam = K.fit([[EX[0] - 4.2, 0.4, EX[2] - 1.5], [EX[0] + 4.2, 3.4, EX[2] + 2.8]], { yaw: 120, pitch: 12, fov: 42, margin: 0.85, maxDist: 11 }); cam.fov *= K.punch(f, F.LOCK, 0.08, 6);
    } else if (sh(1018, 1058)) {              // 20. stop for two hours: the drum splits, a nine-ton gumball drops out (wide)
      cam = K.fit([[SITE - 4.5, 0, LANE - 1.2], [SITE + 4.4, 3.9, LANE + 1.2], ...body(27.5, 1.6), [21, 0, 1]], { yaw: 125, pitch: 10, fov: 44, margin: 0.85, maxDist: 15 }); cam.fov *= K.punch(f, F.GUMBALL, 0.14, 6); const s = K.shake(f, F.STOP + 18, 0.1, 14); cam.pos[1] += s[1];
    } else if (sh(1058, 1096)) {              // 21. the gumball rolls at the builders (tracking wide)
      const tc = K.track(f, (g) => [Math.max(13, 26.2 - (g - F.STOP - 10) * 0.12), 0, bz], { off: [-7, 3.4, 9], lag: 5, lookY: 1.2 }); cam = { ...tc, fov: 50 };
    } else if (sh(1096, 1148)) {              // 22. "Spinning is for washing machines," Moose whispered (reaction, ball behind him)
      cam = { pos: [mp.x - 2.2, 1.8, mp.z + 2.4], look: [mp.x, 1.55, mp.z], fov: 42 * K.push(u, 0.06) }; dof = { focus: 3.2, cinf: 11 };
    } else if (sh(1148, 1206)) {              // 23. the builders called a crane (wide: crane, cable, ball rising)
      cam = K.fit([[CRANE[0] - 3, 0, CRANE[1]], [13, 8.8, bz], [13, by - BR, bz], ...BLD.map((b) => [b.root.position.x, 2.2, b.root.position.z])], { yaw: 100, pitch: 6, fov: 46, margin: 0.78, maxDist: 13 }); cam.fov *= K.punch(f, F.CRANE, 0.1, 6);
    } else if (sh(1206, 1262)) {              // 24. Dolores got her donuts (full shot: Dolores, Moose, the box)
      cam = K.fit([...body(dp.x, dp.z), ...body(mp.x, mp.z), [14.6, 0, 2], [13, 2 * BR, bz]], { yaw: 70, pitch: 8, fov: 42, margin: 0.9, maxDist: 11 }); cam.fov *= K.punch(f, F.DONUTS2, 0.08, 6);
    } else {                                  // 25. Bruno got a nine-ton jogging ball (wide pull-back, echoes the hook)
      cam = K.fit([[13 - BR, 0, bz - BR], [13 + BR, 2 * BR + 0.8, bz + BR], ...body(dp.x, dp.z), ...body(mp.x, mp.z), ...BLD.map((b) => [b.root.position.x, 2.2, b.root.position.z])], { yaw: lerp(150, 165, u), pitch: 9, fov: 44, margin: 0.85, maxDist: 15 }); cam.fov *= K.punch(f, F.JOG, 0.1, 6);
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    if (f < 108 || (f >= F.STOP + 10 && f < 1148)) { if (f % 6 === 0) K.puff(f, f, bx + 0.6, bz, 4, 0.7, '#c8c0b0'); }
    if (f >= F.STOP + 16 && f < F.STOP + 40) K.puff(f, F.STOP + 18, 25.5, bz, 14, 1.2, '#c8c0b0');
    if (cross && f >= F.SPUN - 6 && f < F.SPUN + 44) { K.sparks(f, F.SPUN - 6, F.SPUN + 44, [STOPX, 0.3, LANE], { dir: [0, 0.4, 0], spread: 1.6, rate: 24, speed: 4, life: 14, color: '#d8c8a8', seed: 5 }); if (f % 4 === 0) K.puff(f, f, STOPX + 2 * Math.cos(f), LANE + 2 * Math.sin(f), 4, 0.9, '#c8c0b0'); }
    if (f >= 330 && f < 784 && !ex) K.steam(f, () => [TRUCK.position.x + 2.3 * Math.cos(tyaw), 2.7, TRUCK.position.z + 1.0], { rate: 4, size: 0.4, rise: 1.2, drift: [-0.4, 0.1], dark: 0.5 });
    if (ex && f >= F.UNDER - 10 && f < 930) K.steam(f, [TANK.position.x, 0.5, TANK.position.z], { rate: 6, size: 0.12, rise: 1.4, drift: [0, 0], dark: 0 });
    K.leaves(f, cam.look, { area: 12, count: 10, fall: 0.4, colors: ['#4f9a3a', '#6ab84a', '#f2c12e'] });
    K.mist(f, 100, 16); K.mist(f, 776, 16); K.mist(f, 1010, 16);
    K.badge(f, F.PIECE, 'IN ONE PIECE', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 104 });
    K.badge(f, F.DONUTS, 'BET: 7 DAYS OF DONUTS', { sx: 0.5, sy: 0.2 }, { icon: 'coin', f1: 212 });
    K.badge(f, F.OFF, 'DRUM: OFF', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 302 });
    K.badge(f, F.ELEVEN, '11 DUCKLINGS', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: F.HOURS - 4 });
    K.badge(f, F.HOURS, '2 HOURS', { sx: 0.5, sy: 0.2 }, { icon: 'clock', f1: 516 });
    if (f >= 520 && f < 633) K.hud(f, 524, { stages: 4, labels: ['SOUP', 'OATMEAL', 'PB', 'BALL'], u: [0.08, 0.36, 0.64, 0.95][stage], f1: 631 });
    for (const [w, t, nx] of [['SOUP', F.SOUP, F.OAT], ['OATMEAL', F.OAT, F.PEANUT], ['PEANUT BUTTER', F.PEANUT, F.BOWL], ['BOWLING BALL', F.BOWL, 631]]) K.badge(f, t, w, { sx: 0.5, sy: 0.3 }, { icon: w === 'BOWLING BALL' ? 'weight' : 'drop', f1: nx - 2 });
    K.badge(f, F.STAYED, 'DRUM: STUCK', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: F.SPUN - 2 });
    K.badge(f, F.DRY, "DOESN'T DRY", { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: F.GRAB - 2 });
    K.badge(f, F.GROW, 'WATER + CEMENT = ROCK', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 926 });
    K.badge(f, F.STIRRED, 'STIRRED = STAYS SOFT', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1014 });
    K.badge(f, F.GUMBALL, '9-TON GUMBALL', { sx: 0.5, sy: 0.2 }, { style: 'stamp', size: 1.1, f1: 1094 });
    K.badge(f, F.DONUTS2, 'DOLORES WINS', { sx: 0.5, sy: 0.2 }, { icon: 'coin', f1: 1348 });
    const L = K.light('golden', { az: 120, el: 34, shadowExt: 26, exposure: 1.25 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
