// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Soda Cans Have a Dent Underneath" — invented story, engine: The Upgrade (SCRIPTS.md §000).
// Fizzwell Soda boss Wanda ("Flat is fancy!") makes flat-bottomed cans; by lunch every bottom puffs into a round belly and the
// cans waddle off the shelf like penguins. Pogo the factory dog gets six hundred rounds of fetch. Upgrade: metal twice as thick —
// each can weighs like a brick, the delivery truck sits down like a tired camel. A hot day: two hundred bellies pop, soda rains
// from the ceiling. Explainer: fizz pushes out on every part; a flat bottom bends; a dome pushes back like an arch, so thin metal
// holds. The dent comes back; Pogo keeps one belly can as his ball; "Flat is fancy," Wanda says now — about her (top) hat.
import { TOTAL, LINES, wf } from './canbelly_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const CH = 0.68, CR = 0.19;                  // can size (cartoon big)
const SHX = 4.2, SHZ = -4.6;                 // shelf rack
const CVZ = -1.2, CVY = 1.0;                 // conveyor line (along x)
const EX = -2.5, EZ = 6.5;                      // explainer spot
let THREE, F = {}, WANDA, POGO, SHELF = [], BELT = [], FLOOR = [], POPS = [], VAN, CRATES = [], GIANT, GBOT, ARROWS = [], ARCH, HOLO, FAN, LEVER, NEAT = [], BALL, THERMO, HEAT;

function can(K, parent, s = 1, label = true) {
  const g = new THREE.Group(); parent.add(g); const k = new THREE.Group(); g.add(k); k.scale.setScalar(s);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(CR, CR, CH * 0.86, 28, 1, true), K.chrome({ rough: 0.18 })); body.position.y = CH * 0.5; k.add(body);
  const lab = new THREE.Mesh(new THREE.CylinderGeometry(CR * 1.006, CR * 1.006, CH * 0.6, 28, 1, true), K.set.textMat('FIZZWELL  FIZZWELL', { bg: '#d8342a', fg: '#ffffff', w: 1024, h: 220, border: false })); lab.position.y = CH * 0.5; k.add(lab);
  if (!label) lab.visible = false;
  const top = new THREE.Mesh(new THREE.CylinderGeometry(CR * 0.86, CR, CH * 0.07, 28), K.chrome({ rough: 0.2 })); top.position.y = CH * 0.965; k.add(top);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(CR * 0.86, 0.008, 8, 28), K.chrome({ rough: 0.1 })); rim.rotation.x = Math.PI / 2; rim.position.y = CH; k.add(rim);
  const tab = new THREE.Mesh(new THREE.BoxGeometry(CR * 0.6, 0.006, CR * 0.3), K.gold()); tab.position.set(0, CH + 0.006, CR * 0.2); k.add(tab);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(CR, CR * 0.86, CH * 0.07, 28, 1, true), K.chrome({ rough: 0.2 })); neck.position.y = CH * 0.035 + CH * 0.0; k.add(neck); neck.position.y = CH * 0.035;
  const bot = new THREE.Mesh(new THREE.SphereGeometry(CR * 0.86, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), K.chrome({ rough: 0.2 })); bot.position.y = 0.0; k.add(bot);
  k.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.material.side = THREE.DoubleSide; } });
  g.userData = { k, bot, s };
  return g; }
// shape: 'dome' (dent), 'flat', or a belly amount 0..1
function shapeCan(c, belly) { const b = c.userData.bot, k = c.userData.k; if (belly === 'dome') { b.scale.set(1, -0.35, 1); k.position.y = 0; }
  else { const a = Math.max(0.02, belly); b.scale.set(1, a * 0.9, 1); k.position.y = a * 0.9 * CR * 0.86 * c.userData.s * 0; } }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { CANS: wf(0, 'cans'), WADDLE: wf(0, 'waddled'), PENG: wf(0, 'penguins'), FLAT: wf(1, 'flat'), FANCY: wf(1, 'fancy'), FIZZ: wf(1, 'fizzwell'), WHY: wf(1, 'why'), DENT: wf(1, 'dent'),
      LUNCH: wf(2, 'lunch'), PUFFED: wf(2, 'puffed'), BELLY: wf(2, 'belly'), POGO: wf(3, 'pogo'), THRILL: wf(3, 'thrilled'), ROLL: wf(3, 'rolling'), FETCH: wf(3, 'fetch'), SIX: wf(3, 'six'),
      MADE: wf(4, 'made'), TWICE: wf(4, 'twice'), FANCY2: wf(4, 'fancy'), BRICK: wf(5, 'brick'), TRUCK: wf(5, 'truck'), SAT: wf(5, 'sat'), CAMEL: wf(5, 'camel'), HOT: wf(6, 'hot'), TWO: wf(6, 'two'),
      POPPED: wf(6, 'popped'), RAINED: wf(6, 'rained'), CEIL: wf(6, 'ceiling'), WHY2: wf(7, 'why'), PUSHES: wf(8, 'pushes'), EVERY: wf(8, 'every'), FLAT2: wf(8, 'flat'), BENDS: wf(8, 'bends'),
      DOME: wf(9, 'dome'), ARCH: wf(9, 'arch'), THIN: wf(9, 'thin'), HOLD: wf(9, 'hold'), BACK: wf(10, 'back'), POGO2: wf(10, 'pogo'), BALL: wf(10, 'ball'), SAYS: wf(11, 'says'), HAT: wf(11, 'hat') };
    // ================= Fizzwell Soda factory =================
    const G = K.group();
    K.slab(-11, 11, -0.1, 0, -8, 12, K.mat('plaster', '#c8c4bc', { detail: 0.8, amt: 0.25 }), G, false);
    for (let x = -10; x <= 10; x += 2) K.slab(x - 0.02, x + 0.02, 0, 0.004, -8, 12, K.paint('#a8a49c', { coat: 0 }), G, false);
    K.slab(-11, 11, 0, 0.006, 1.6, 1.8, K.paint('#f2c230', { coat: 0 }), G, false); K.slab(-11, 11, 0, 0.006, 6.0, 6.2, K.paint('#f2c230', { coat: 0 }), G, false);
    K.slab(-11, 11, 0, 7, -8, -7.6, K.mat('brick', '#b8664a', { detail: 0.6 }), G);
    K.slab(-11.4, -11, 0, 7, -8, 12, K.mat('brick', '#b05e44', { detail: 0.6 }), G); K.slab(11, 11.4, 0, 7, -8, 1, K.mat('brick', '#b05e44', { detail: 0.6 }), G); K.slab(11, 11.4, 5, 7, 1, 7, K.mat('brick', '#b05e44'), G); K.slab(11, 11.4, 0, 7, 7, 12, K.mat('brick', '#b05e44'), G);
    for (let x = -9; x <= 9; x += 3) { K.slab(x - 1.1, x + 1.1, 3.8, 6.0, -7.62, -7.58, K.glass({ color: '#cfe8ff', opacity: 0.5 }), G); K.slab(x - 1.2, x + 1.2, 3.7, 3.8, -7.6, -7.5, K.paint('#2a5a7a'), G); K.slab(x - 0.03, x + 0.03, 3.8, 6.0, -7.58, -7.52, K.paint('#2a5a7a'), G); }
    for (let x = -10; x <= 10; x += 4) { K.slab(x - 0.12, x + 0.12, 6.6, 6.9, -8, 12, K.paint('#3a4a5a', { metal: 0.6, rough: 0.4 }), G); }
    for (let z = -6; z <= 10; z += 4) K.slab(-11, 11, 6.75, 6.85, z - 0.08, z + 0.08, K.paint('#3a4a5a', { metal: 0.6 }), G);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.1), S.textMat('FIZZWELL SODA', { bg: '#d8342a', fg: '#ffffff', w: 1024, h: 190, border: false })); sign.position.set(0, 2.9, -7.55); G.add(sign); K.rbox(6.3, 1.35, 0.06, 0.04, K.gold(), 0, 2.9, -7.6, G);
    const safe = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.1), S.textMat('DAYS WITHOUT|A SPILL: 0', { bg: '#f4efe4', fg: '#1a1a1a', w: 512, h: 300 })); safe.position.set(-8.6, 2.2, -7.55); G.add(safe);
    const pst = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.8), S.textMat('FLAT|IS|FANCY', { bg: '#2a62c8', fg: '#f2c230', w: 400, h: 520 })); pst.position.set(8.2, 2.3, -7.55); G.add(pst);
    for (let k = 0; k < 4; k++) { const p = K.cyl(0.12, 0.12, 22, K.paint(['#c0392b', '#2a9a6a', '#f2c230', '#2a62c8'][k], { rough: 0.3 }), 0, 0, 0, G, 12); p.rotation.z = Math.PI / 2; p.position.set(0, 4.3 + k * 0.32, -7.35); }
    // the bottling machine (hero set piece): glossy tanks, gauges, pipes
    const M = new THREE.Group(); M.position.set(-5.2, 0, -4.2); G.add(M);
    K.rbox(3.2, 2.6, 2.0, 0.2, K.paint('#d8342a', { rough: 0.3 }), 0, 1.4, 0, M); K.rbox(3.3, 0.12, 2.1, 0.04, K.gold(), 0, 2.72, 0, M); K.rbox(3.3, 0.3, 2.1, 0.06, K.paint('#2a2a30'), 0, 0.15, 0, M);
    for (const dx of [-0.9, 0.0, 0.9]) { K.cyl(0.42, 0.42, 1.9, K.chrome(), dx, 2.75, 0, M, 24); K.sphere(0.42, K.chrome(), dx, 4.65, 0, M, 1, 0.5, 1); K.cyl(0.44, 0.44, 0.08, K.gold(), dx, 3.6, 0, M, 24); }
    for (let k = 0; k < 3; k++) { K.cyl(0.18, 0.18, 0.05, K.paint('#f4efe4'), -0.8 + k * 0.8, 1.9, 1.01, M, 20).rotation.x = Math.PI / 2; K.rbox(0.02, 0.14, 0.01, 0.005, K.paint('#c0392b'), -0.8 + k * 0.8, 1.92, 1.04, M).rotation.z = -0.6 + k * 0.5; }
    const mp = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.35), S.textMat('CAN-O-MATIC 3000', { bg: '#f2c230', fg: '#7a1f1f', w: 700, h: 130, border: false })); mp.position.set(0, 1.25, 1.01); M.add(mp);
    LEVER = new THREE.Group(); LEVER.position.set(1.7, 1.3, 0.6); M.add(LEVER); K.cyl(0.03, 0.03, 0.7, K.chrome(), 0, 0, 0, LEVER, 8); K.sphere(0.08, K.paint('#c0392b'), 0, 0.72, 0, LEVER);
    // conveyor
    K.rbox(10, 0.14, 0.9, 0.04, K.paint('#2a2a30', { rough: 0.6 }), 0.8, CVY - 0.07, CVZ, G); for (const dz of [-0.48, 0.48]) K.rbox(10, 0.12, 0.06, 0.02, K.paint('#f2c230'), 0.8, CVY + 0.02, CVZ + dz, G);
    for (let x = -4; x <= 5.6; x += 1.6) for (const dz of [-0.4, 0.4]) K.rbox(0.1, CVY - 0.1, 0.1, 0.02, K.paint('#5a6a7a', { metal: 0.6 }), x, (CVY - 0.1) / 2, CVZ + dz, G);
    for (let x = -4.1; x <= 5.7; x += 0.3) { const r = K.cyl(0.05, 0.05, 0.86, K.chrome(), x, CVY - 0.14, CVZ, G, 10); r.rotation.x = Math.PI / 2; r.position.set(x, CVY - 0.14, CVZ); }
    // shelf rack
    for (let l = 0; l < 3; l++) K.rbox(3.6, 0.06, 0.8, 0.02, K.paint('#5a6a7a', { metal: 0.6, rough: 0.4 }), SHX, 0.5 + l * 0.9, SHZ, G);
    for (const dx of [-1.8, 1.8]) for (const dz of [-0.38, 0.38]) K.rbox(0.06, 2.4, 0.06, 0.01, K.paint('#f2c230'), SHX + dx, 1.2, SHZ + dz, G);
    // pallets, crates, a fan, barrels, hand truck
    for (let k = 0; k < 3; k++) { K.rbox(1.2, 0.14, 1.0, 0.02, K.mat('wood', '#c8a070'), -8.6 + k * 1.4, 0.07, 3.0, G); K.rbox(1.1, 0.7, 0.9, 0.03, K.mat('wood', '#b8844a'), -8.6 + k * 1.4, 0.5, 3.0, G); const l = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.3), S.textMat('FIZZWELL', { bg: '#f4efe4', fg: '#d8342a', w: 256, h: 96 })); l.position.set(-8.6 + k * 1.4, 0.55, 3.46); G.add(l); }
    for (let k = 0; k < 3; k++) { K.cyl(0.32, 0.32, 0.9, K.paint('#2a62c8', { rough: 0.3 }), -9.8, 0, -1 + k * 0.7, G, 18); K.cyl(0.33, 0.33, 0.05, K.chrome(), -9.8, 0.7, -1 + k * 0.7, G, 18); }
    S.bake(G);
    K.lamp(-5, 4, -2, { color: '#fff0d0', intensity: 5, distance: 10 }); K.lamp(4, 4, -2, { color: '#fff0d0', intensity: 5, distance: 10 });
    FAN = new THREE.Group(); FAN.position.set(8.8, 2.6, -6.8); sc.add(FAN); for (let k = 0; k < 3; k++) { const b = K.rbox(0.18, 0.7, 0.03, 0.03, K.paint('#d8d8d8'), 0, 0.35, 0, FAN); b.geometry.translate(0, 0, 0); b.rotation.z = k * 2.09; b.position.set(Math.sin(k * 2.09) * -0.35, Math.cos(k * 2.09) * 0.35, 0); }
    // ================= cans =================
    for (let l = 0; l < 3; l++) for (let k = 0; k < 7; k++) { const c = can(K, sc, 0.82); c.userData.home = [SHX - 1.5 + k * 0.5, 0.53 + l * 0.9, SHZ + 0.1]; c.userData.l = l; c.userData.i = k; SHELF.push(c); }
    for (let k = 0; k < 10; k++) { const c = can(K, sc); BELT.push(c); }
    for (let k = 0; k < 6; k++) { const c = can(K, sc); FLOOR.push(c); }
    for (let k = 0; k < 22; k++) { const c = can(K, sc); c.userData.p = [(hash(k + 400) - 0.5) * 7 + 1, hash(k + 401) * 3 - 1]; POPS.push(c); }
    for (let k = 0; k < 7; k++) { const c = can(K, sc); NEAT.push(c); }
    BALL = can(K, sc);
    // the delivery van + crates of brick-heavy cans
    VAN = S.car({ kind: 'van', color: '#d8342a', seed: 3, plate: 'FIZZ-1' }); VAN.g.position.set(7.0, 0, 3.6); VAN.g.rotation.y = Math.PI / 2;
    const vl = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.5), S.textMat('FIZZWELL', { bg: '#ffffff', fg: '#d8342a', w: 700, h: 160, border: false })); vl.rotation.y = Math.PI / 2; vl.position.set(1.05, 1.3, 0); VAN.g.add(vl); vl.rotation.y = 0; vl.position.set(0, 1.3, 1.0);
    for (let k = 0; k < 6; k++) { const c = K.rbox(0.8, 0.55, 0.6, 0.03, K.mat('wood', '#b8844a'), 0, 0, 0, sc); c.userData.home = [5.0 - (k % 3) * 0.9, 0.28 + Math.floor(k / 3) * 0.56, 1.4]; CRATES.push(c); }
    // ================= explainer: giant x-ray can, pressure arrows, arch =================
    GIANT = can(K, sc, 3.3, false); GIANT.position.set(EX, 0.9, EZ);
    GIANT.userData.k.children.forEach((o, i) => { if (o.isMesh && o !== GIANT.userData.bot && i < 2) { o.material = K.glass({ color: '#cfe8ff', opacity: 0.22 }); o.castShadow = false; } });
    HOLO = K.holoBox(2.0, 3.0, 2.0, EX, 2.0, EZ, sc, '#36e2ff');
    const STAND = new THREE.Group(); sc.add(STAND); GIANT.userData.stand = STAND; for (let k = 0; k < 3; k++) { const a = k * 2.09 + 0.5; K.cyl(0.04, 0.05, 0.9, K.chrome(), EX + Math.cos(a) * 0.5, 0, EZ + Math.sin(a) * 0.5, STAND, 10); } K.cyl(0.9, 0.9, 0.04, K.paint('#2a3a5a', { rough: 0.4 }), EX, 0, EZ, STAND, 32);
    const amat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff7a2a').multiplyScalar(2.0), toneMapped: false });
    for (let k = 0; k < 14; k++) { const g = new THREE.Group(); const s = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.4, 8), amat); s.position.y = 0.2; g.add(s); const h = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.18, 10), amat); h.position.y = 0.46; g.add(h);
      g.traverse((o) => { o.userData.ndSkip = true; }); sc.add(g); let pos, dir; if (k < 8) { const a = k / 8 * Math.PI * 2; pos = [EX + Math.cos(a) * 0.3, 0.9 + 1.2 + (k % 2) * 0.5, EZ + Math.sin(a) * 0.3]; dir = [Math.cos(a), 0, Math.sin(a)]; } else if (k < 11) { pos = [EX + (k - 9) * 0.25, 0.9 + 0.5, EZ]; dir = [0, -1, 0]; } else { pos = [EX + (k - 12) * 0.25, 0.9 + 1.9, EZ]; dir = [0, 1, 0]; }
      g.position.set(...pos); g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...dir)); g.userData.base = pos; g.userData.dir = dir; ARROWS.push(g); }
    ARCH = K.trace(Array.from({ length: 17 }, (_, k) => { const a = Math.PI * (k / 16); return [EX - 0.55 * Math.cos(a), 0.9 + 0.02 + 0.3 * Math.sin(a), EZ + 0.66]; }), { color: '#7af8a0', r: 0.04 });
    // thermometer for the hot day
    THERMO = new THREE.Group(); THERMO.position.set(-2.2, 1.8, -7.5); sc.add(THERMO); K.rbox(0.4, 1.4, 0.05, 0.05, K.paint('#f4efe4'), 0, 0, 0, THERMO); HEAT = K.rbox(0.1, 1.0, 0.06, 0.03, K.paint('#d8342a'), 0, -0.1, 0.03, THERMO); K.sphere(0.12, K.paint('#d8342a'), 0, -0.6, 0.04, THERMO);
    // ================= characters =================
    WANDA = K.stick({ jacket: '#2a62c8', pants: '#1f2a44', hat: 'tophat', hatColor: '#1a1a1a', hairStyle: 'long', hair: '#c8502a', glasses: '#c0392b', bowtie: '#d8342a', vest: '#f2c230', collar: '#f4efe4', badge: true }, { key: 'wanda' });
    POGO = K.animal('dog', { color: '#f4f2ee', belly: '#ffffff', seed: 5, scale: 1.25 });
    K.addClouds(6, 700, 160);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s), t = f / 30;
    const ex = f >= 896 && f < 1126;
    const domed = f >= 1126;
    // ---------- shelf cans: bellies waddle off the shelf like penguins (hook), then neat domed rows (end) ----------
    SHELF.forEach((c, k) => { const u = c.userData, h = u.home; c.visible = !ex; c.position.set(...h); c.rotation.set(0, 0, 0);
      if (domed) { shapeCan(c, 'dome'); return; }
      const belly = f < 275 ? 0.7 : f < 365 ? sm(F.PUFFED - 6, F.BELLY + 4, f) * 0.7 : 0.7; shapeCan(c, f >= 116 && f < 275 ? 0.02 : belly);
      if (f < 116) { const go = u.l === 1 && u.i >= 2; const rock = 0.3 * Math.sin(f * 0.45 + k);
        c.rotation.set(0, 0, rock); c.position.y = h[1] + CR * 0.6 * 0.7;
        if (go) { const d = Math.max(0, (f - 10 - (u.i - 2) * 10) / 30); c.position.z = h[2] + d * 0.6; if (c.position.z > SHZ + 0.45) { const fall = (c.position.z - SHZ - 0.45) / 0.6; c.position.y = Math.max(0.08, h[1] - fall * fall * 4); c.rotation.x = Math.min(1.4, fall * 2); } } }
      else if (f < 275) { c.position.y = h[1]; }
      else c.position.y = h[1] + CR * 0.6 * belly; });
    // conveyor cans: flat (Wanda's), puffing into bellies, rocking; brick-thick; domed at the end
    BELT.forEach((c, k) => { const x = -3.8 + ((k * 1.0 + (f - 116) * 0.03) % 10); c.visible = !ex && f >= 116 && f < 611; c.position.set(x, CVY, CVZ);
      const belly = f < 275 ? 0.02 : sm(F.PUFFED - 6 + k, F.BELLY + 4 + k, f) * 0.7; shapeCan(c, belly); c.position.y = CVY + CR * 0.6 * belly; c.rotation.set(0, 0, belly > 0.3 ? 0.25 * Math.sin(f * 0.5 + k) : 0); });
    // floor cans rolling for Pogo
    const rollX = (k, g) => lerp(2.5 - k * 0.8, -6 + k * 0.6, clamp((g - 400 - k * 8) / 70, 0, 1));
    FLOOR.forEach((c, k) => { c.visible = !ex && f >= 365 && f < 519; shapeCan(c, 0.7); c.position.set(rollX(k, f), CR, 1.0 + k * 0.35); c.rotation.set(Math.PI / 2, 0, 0); c.rotateZ(0); c.rotation.y = (rollX(k, f) / CR); c.rotation.set(rollX(k, f) / CR, Math.PI / 2, Math.PI / 2); });
    // pops on the hot day
    POPS.forEach((c, k) => { const u = c.userData; c.visible = !ex && f >= 753 && f < 896; shapeCan(c, 0.7); const p0 = F.POPPED - 6 + (k % 7) * 2; const up = f >= p0 ? (f - p0) / 30 : 0;
      c.position.set(SHX - 2 + u.p[0] * 0.6, 0.08 + 0.53 + Math.max(0, 6 * up - 4.9 * up * up * 1.2), SHZ + 1.2 + u.p[1] * 0.6); if (up > 0 && c.position.y < 0.1) c.position.y = 0.1; c.rotation.set(up * 7 + k, k, up * 5); if (up === 0) { c.rotation.set(0, 0, 0.15 * Math.sin(f * (f >= F.HOT ? 1.2 : 0.2) + k)); c.position.set(SHX - 1.5 + (k % 7) * 0.5, 0.53 + Math.floor(k / 7) * 0.9 + CR * 0.42, SHZ + 0.1); } });
    if (f >= 753 && f < 896) SHELF.forEach((c) => { c.visible = false; });
    // neat domed cans at the end + Pogo's belly ball
    NEAT.forEach((c, k) => { c.visible = domed; shapeCan(c, 'dome'); c.position.set(-3.6 + k * 0.6, CVY, CVZ); c.rotation.set(0, 0, 0); });
    // crates + van: brick-heavy cans, the van sits down like a tired camel
    CRATES.forEach((c, k) => { const h = c.userData.home, on = f >= 611 && f < 753; c.visible = on; const load = sm(670 + k * 4, 690 + k * 4, f); c.position.set(lerp(h[0], 6.2 + (k % 3) * 0.1, load), lerp(h[1], 0.9 + Math.floor(k / 3) * 0.5, load), lerp(h[2], 3.6 + (k % 3 - 1) * 0.5, load)); c.visible = on && load < 0.98; });
    const sag = sm(F.SAT - 4, F.SAT + 10, f) * (f < 753 ? 1 : 1); VAN.g.position.y = -0.22 * sag; VAN.g.rotation.z = 0; VAN.g.rotation.x = -0.12 * sag; VAN.g.visible = !ex && f >= 600 && f < 753;
    // the machine lever (twice as thick), the fan, the thermometer
    LEVER.rotation.z = f >= F.MADE - 4 && f < 611 ? -0.9 * sm(F.MADE - 4, F.MADE + 6, f) : 0; FAN.rotation.z = -f * (f >= 753 && f < 896 ? 0.05 : 0.3);
    HEAT.scale.y = f >= 753 && f < 896 ? 0.3 + 0.9 * sm(F.HOT - 4, F.HOT + 14, f) : 0.3; HEAT.position.y = -0.6 + 0.5 * HEAT.scale.y;
    // ---------- explainer ----------
    GIANT.visible = GIANT.userData.stand.visible = ex; HOLO.visible = false; const bulge = ex && f < F.DOME - 6 ? sm(F.FLAT2 - 4, F.BENDS + 6, f) : 0;
    shapeCan(GIANT, ex && f >= F.DOME - 6 ? 'dome' : Math.max(0.02, bulge * 0.7)); GIANT.position.y = 0.9 + (GIANT.userData.bot.scale.y > 0 ? GIANT.userData.bot.scale.y * CR * 0.86 * 3.3 : 0);
    ARROWS.forEach((a, k) => { const on = ex && (k < 8 ? f >= F.PUSHES - 6 : k < 11 ? (f >= F.FLAT2 - 4 && f < F.DOME - 6) || f >= F.DOME : f >= F.EVERY - 4); a.visible = on; const pul = 0.15 * Math.sin(f * 0.4 + k); const b = a.userData.base, d = a.userData.dir;
      a.position.set(b[0] + d[0] * pul, b[1] + d[1] * pul + (k >= 8 && k < 11 && f >= F.DOME ? 0.35 : 0) - (k >= 8 && k < 11 && f < F.DOME - 6 ? bulge * 0.4 : 0), b[2] + d[2] * pul);
      if (k >= 8 && k < 11 && f >= F.DOME) a.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0)); else if (k >= 8 && k < 11) a.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0)); });
    ARCH.show(ex && f >= F.DOME - 2 ? sm(F.ARCH - 6, F.ARCH + 10, f) : 0);
    // ---------- characters ----------
    let wp = { x: 1.0, z: 0.6, yaw: -0.3 };
    const wk = [[0, 'shock', { expr: 'shock' }], [60, 'panic', { expr: 'scared' }], [116, 'show', { expr: 'proud', R: [0.35, 0.25, 'cup'] }], [F.FLAT - 4, 'pointUp', { expr: 'smug', talk: true }], [F.WHY, 'hips', { expr: 'proud' }],
      [275, 'hips', { expr: 'proud' }], [F.PUFFED, 'shock', { expr: 'confused' }], [F.BELLY, 'facepalm', { expr: 'pained' }], [365, 'cross', { expr: 'stern' }], [F.SIX, 'facepalm', { expr: 'pained' }],
      [519, 'reach', { expr: 'stern' }], [F.TWICE, 'pointUp', { expr: 'excited' }], [F.FANCY2 - 4, 'cheer', { expr: 'proud', talk: true }], [611, 'carry', { expr: 'pained', sweat: true, item: 'box' }], [F.SAT, 'shock', { expr: 'shock' }],
      [753, 'idle', { expr: 'nervous', sweat: true }], [F.POPPED, 'panic', { expr: 'scared' }], [F.RAINED, 'shock', { expr: 'dazed' }], [874, 'shrug', { expr: 'dazed' }], [1126, 'show', { expr: 'smile' }], [F.POGO2, 'clap', { expr: 'laugh' }],
      [1235, 'hips', { expr: 'smug', talk: true }], [F.HAT - 4, 'pointUp', { expr: 'proud', R: [0.05, -0.85, null] }]];
    if (f < 116) wp = { x: 6.7, z: -2.4, yaw: -2.3 };
    if (f >= 116 && f < 275) wp = { x: 0.4, z: 0.3, yaw: 0.1 };
    if (f >= 275 && f < 519) wp = { x: -1.0, z: 0.1, yaw: 0.2 };
    if (f >= 519 && f < 611) wp = { x: -3.3, z: -2.6, yaw: 0.5 };
    if (f >= 611 && f < 753) { const W = K.walkPath(f, 618, [[3.0, 0.6], [5.6, 2.2]], 0.9); wp = { x: W.x, z: W.z, yaw: W.moving ? W.yaw : 1.2 }; }
    if (f >= 753 && f < 896) wp = { x: SHX - 0.5, z: SHZ + 2.8, yaw: f >= 845 ? 0.25 : Math.PI + 0.3 };
    if (domed) wp = { x: -1.0, z: 0.5, yaw: 0.25 };
    if (ex) wp = { visible: false };
    const WA = T.act(f, wk, { seed: 7, blink: blink(7), phase: (f / 20) % 1 }); if (f >= 618 && f < 690) WA.opts.mode = 'walk';
    WANDA.set(WA, wp);
    // Pogo: wants fetch
    let pp = { x: SHX + 1.4, z: SHZ + 2.0, yaw: -2.6, mode: 'wag', expr: 'happy' };
    if (f >= 116 && f < 365) pp = { x: 1.8, z: 0.9, yaw: -0.5, mode: f >= F.BELLY ? 'beg' : 'sit', expr: f >= F.BELLY ? 'happy' : 'neutral' };
    if (f >= 365 && f < 420) pp = { x: 2.2, z: 1.4, yaw: -0.4, mode: f % 16 < 8 ? 'wag' : 'jump', expr: 'happy' };
    if (f >= 420 && f < 519) { const tx = rollX(0, f) - 0.6; pp = { x: f < 470 ? tx : lerp(tx, 1.5, sm(470, 500, f)), z: 1.0, yaw: f < 470 ? -Math.PI / 2 : Math.PI / 2, mode: 'run', expr: 'happy' }; if (f >= 500) pp = { x: 1.5, z: 1.0, yaw: -0.3, mode: 'beg', expr: 'happy' }; }
    if (f >= 519 && f < 611) pp = { x: -1.8, z: -0.4, yaw: 0.6, mode: 'sleep', expr: 'sleepy' };
    if (f >= 611 && f < 753) pp = { x: 4.6, z: 3.2, yaw: 1.0, mode: f >= F.SAT ? 'sit' : 'stand', expr: f >= F.SAT ? 'shock' : 'neutral' };
    if (f >= 753 && f < 896) pp = { x: SHX + 1.0, z: SHZ + 2.6, yaw: Math.PI, mode: f >= F.POPPED ? 'jump' : 'stand', expr: f >= F.POPPED ? 'happy' : 'shock' };
    if (domed) pp = { x: 1.2, z: 1.1, yaw: -0.4, mode: f >= F.POGO2 ? 'wag' : 'sit', expr: 'happy' };
    if (ex) pp = { visible: false };
    POGO.set(f, pp);
    // the can in Pogo's mouth (fetch) / his belly ball at the end
    const mouth = (p, d = 0.62) => [p.x + Math.sin(p.yaw) * d, 0.5, p.z + Math.cos(p.yaw) * d];
    BALL.visible = !ex && ((f >= 470 && f < 519) || domed && f >= F.POGO2 - 6); shapeCan(BALL, 0.7);
    if (BALL.visible) { const m = mouth(pp); BALL.position.set(m[0], f >= 470 && f < 519 ? m[1] - 0.15 : CR, m[2]); BALL.rotation.set(0, pp.yaw, Math.PI / 2); if (domed) { BALL.position.set(pp.x + 0.7, CR, pp.z + 0.3); BALL.rotation.set((f - 1170) * 0.1, 0.3, Math.PI / 2); } }
    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const body = (x, z, y = 0, h = 2.2) => [[x, y, z], [x, y + h, z]];
    const WP = [wp.x ?? 0, wp.z ?? 0];
    if (sh(0, 55)) {                          // 1. the hook: belly cans waddle off the shelf like penguins; Wanda + Pogo (wide)
      cam = K.fit([[SHX - 1.9, 0, SHZ], [SHX + 1.9, 2.4, SHZ], ...body(6.7, -2.4), [SHX + 1.4, 0, SHZ + 2.0]], { yaw: 80, pitch: 16, fov: 40, margin: 0.95 }); cam.fov *= K.push(u, 0.05);
    } else if (sh(55, 116)) {                 // 2. low on the shelf edge: the penguins step off (insert-wide)
      cam = K.fit([[SHX - 1.6, 0, SHZ], [SHX + 1.8, 1.8, SHZ + 0.8], [SHX + 1.4, 0, SHZ + 2.0]], { yaw: 60, pitch: 4, fov: 40, margin: 0.85 }); cam.fov *= K.punch(f, F.PENG, 0.1, 6);
    } else if (sh(116, 190)) {                // 3. "Flat is fancy!" Wanda shows her flat can (wide by the conveyor)
      cam = K.fit([...body(0.4, 0.3), [-2.0, CVY, CVZ], [2.4, CVY, CVZ], [1.8, 0, 0.9]], { yaw: 88, pitch: 8, fov: 40, margin: 0.9, lift: 0.3 }); cam.fov *= K.punch(f, F.FANCY, 0.1, 6);
    } else if (sh(190, 270)) {                // 4. Fizzwell Soda — why the dent underneath? (wide, the whole floor)
      cam = K.fit([[-6.8, 0, -4], [5.5, 0, -4], [0, 3.6, -7.5], ...body(0.4, 0.3)], { yaw: 96, pitch: 10, fov: 44, margin: 0.85 });
    } else if (sh(270, 320)) {                // 5. by lunch every flat bottom puffs into a round belly (conveyor)
      cam = K.fit([[-1.5, CVY, CVZ], [1.5, CVY + 0.5, CVZ], ...body(-1.0, 0.1)], { yaw: 70, pitch: 12, fov: 40, margin: 0.95 }); cam.fov *= K.punch(f, F.BELLY, 0.1, 6);
    } else if (sh(320, 365)) {                // 6. the cans rock like toys; Wanda confused (low)
      cam = K.fit([[-2.5, CVY, CVZ], [2.5, CVY + 0.5, CVZ], ...body(-1.0, 0.1), [1.8, 0, 0.9]], { yaw: 110, pitch: 4, fov: 40, margin: 0.9 });
    } else if (sh(365, 420)) {                // 7. Pogo was thrilled (reaction)
      cam = { pos: [3.8, 1.5, 4.4], look: [2.2, 0.6, 1.4], fov: 40 * K.push(u, 0.08) }; dof = { focus: 2.3, cinf: 12 };
    } else if (sh(420, 470)) {                // 8. rolling cans = fetch (tracking wide)
      const tc = K.track(f, (g) => [rollX(0, g), 0, 1.4], { off: [0.4, 2.2, 6.0], lag: 5, lookY: 0.6 }); cam = { ...tc, fov: 46 };
    } else if (sh(470, 519)) {                // 9. six hundred rounds of fetch (wide)
      cam = K.fit([...body(-1.0, 0.1), [1.5, 0, 1.0], [-4, 0, 1.0], [2.6, 1.4, 1.2]], { yaw: 80, pitch: 12, fov: 42, margin: 0.9 });
    } else if (sh(519, 565)) {                // 10. twice as thick: the lever on the Can-O-Matic (wide)
      cam = K.fit([[-6.8, 0, -4.2], [-3.6, 4.6, -3.2], ...body(-3.3, -2.6)], { yaw: 70, pitch: 6, fov: 40, margin: 0.9 }); cam.fov *= K.punch(f, F.TWICE, 0.1, 6);
    } else if (sh(565, 611)) {                // 11. "Flat is fancy!" (low wide)
      cam = K.fit([...body(-3.3, -2.6), [-6.6, 0, -4.2], [-1.8, 0, -0.4]], { yaw: 110, pitch: 4, fov: 40, margin: 0.9 }); cam.fov *= K.punch(f, F.FANCY2, 0.1, 6);
    } else if (sh(611, 665)) {                // 12. each can weighs as much as a brick (Wanda staggers, wide)
      cam = K.fit([...body(WP[0], WP[1]), [3.0, 0, 1.4], [5.4, 0, 1.4], [5.8, 2.0, 3.6]], { yaw: 75, pitch: 8, fov: 42, margin: 0.9 }); cam.fov *= K.punch(f, F.BRICK, 0.08, 6);
    } else if (sh(665, 705)) {                // 13. crates into the van (wide, side)
      cam = K.fit([[4.6, 0, 1.4], [9.2, 2.4, 3.6], ...body(WP[0], WP[1])], { yaw: 100, pitch: 10, fov: 42, margin: 0.9 });
    } else if (sh(705, 753)) {                // 14. the truck sits down like a tired camel (low wide)
      cam = K.fit([[4.8, 0, 3.6], [9.2, 2.2, 3.6], [4.6, 0, 3.2]], { yaw: 125, pitch: 4, fov: 42, margin: 0.9 }); cam.fov *= K.punch(f, F.SAT, 0.12, 6); const s = K.shake(f, F.SAT, 0.06, 12); cam.pos[1] += s[1];
    } else if (sh(753, 805)) {                // 15. a hot day: the thermometer, cans trembling (wide)
      cam = K.fit([[SHX - 2, 0, SHZ], [SHX + 2, 2.5, SHZ], [-2.2, 2.6, -7.4], ...body(SHX - 0.5, SHZ + 2.8)], { yaw: 85, pitch: 6, fov: 42, margin: 0.88 });
    } else if (sh(805, 845)) {                // 16. two hundred bellies pop at once (wide, impact)
      cam = K.fit([[SHX - 2.5, 0, SHZ], [SHX + 2.5, 4.5, SHZ + 2.5], ...body(SHX - 0.5, SHZ + 2.8)], { yaw: 70, pitch: 10, fov: 44, margin: 0.85 }); cam.fov *= K.punch(f, F.POPPED, 0.14, 6); const s = K.shake(f, F.POPPED, 0.1, 14); cam.pos[0] += s[0]; cam.pos[1] += s[1];
    } else if (sh(845, 874)) {                // 17. soda rains from the ceiling (low, looking up)
      cam = { pos: [SHX - 3.0, 0.8, SHZ + 6.0], look: [SHX - 0.6, 3.0, SHZ + 1.5], fov: 50 }; dof = { focus: 5, cinf: 4 };
    } else if (sh(874, 896)) {                // 18. Wanda, soaked (reaction)
      cam = { pos: [SHX - 0.9, 2.0, SHZ + 5.4], look: [SHX - 0.5, 1.5, SHZ + 2.8], fov: 40 * K.push(u, 0.08) }; dof = { focus: 1.8, cinf: 12 };
    } else if (sh(896, 955)) {                // 19. explainer: fizz pushes out on every part (x-ray can)
      cam = K.fit([[EX - 1.0, 0.9, EZ - 1.0], [EX + 1.0, 3.5, EZ + 1.0]], { yaw: 90, pitch: 10, fov: 40, margin: 0.85 });
    } else if (sh(955, 1015)) {               // 20. a flat bottom bends (low)
      cam = K.fit([[EX - 1.0, 0.8, EZ - 0.8], [EX + 1.0, 2.2, EZ + 0.8]], { yaw: 70, pitch: -2, fov: 40, margin: 0.85 }); cam.fov *= K.punch(f, F.BENDS, 0.1, 6);
    } else if (sh(1015, 1070)) {              // 21. a dome pushes back like an arch
      cam = K.fit([[EX - 0.9, 0.8, EZ - 0.8], [EX + 0.9, 2.0, EZ + 0.8]], { yaw: 100, pitch: 0, fov: 40, margin: 0.8 }); cam.fov *= K.punch(f, F.ARCH, 0.08, 6);
    } else if (sh(1070, 1126)) {              // 22. thin metal can hold the fizz (high)
      cam = K.fit([[EX - 1.0, 0.9, EZ - 1.0], [EX + 1.0, 3.5, EZ + 1.0]], { yaw: 60, pitch: 26, fov: 40, margin: 0.85 }); cam.fov *= K.push(u, 0.08);
    } else if (sh(1126, 1180)) {              // 23. the dent comes back: neat rows (wide)
      cam = K.fit([[-3.8, CVY, CVZ], [0.2, CVY + 0.5, CVZ], ...body(-1.0, 0.5), [1.2, 0, 1.1]], { yaw: 85, pitch: 10, fov: 40, margin: 0.9 });
    } else if (sh(1180, 1235)) {              // 24. Pogo keeps one belly can as his ball (wide, low)
      cam = K.fit([[1.2, 0, 1.1], [2.2, 0, 1.4], ...body(-1.0, 0.5)], { yaw: 70, pitch: 6, fov: 40, margin: 1.0 }); cam.fov *= K.punch(f, F.BALL, 0.08, 6);
    } else {                                  // 25. "Flat is fancy" — about her hat (wide, pull back)
      cam = K.fit([...body(-1.0, 0.5), [1.6, 0, 1.4], [-3.8, CVY, CVZ], [0.2, 2.9, -7.5]], { yaw: lerp(95, 85, u), pitch: 8, fov: 42, margin: 0.85 }); cam.fov *= K.punch(f, F.HAT, 0.1, 6);
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    if (f >= F.POPPED - 6 && f < 874) { K.sparks(f, F.POPPED - 6, 860, [SHX - 1.5, 1.4, SHZ + 0.4], { dir: [0, 1, 0.4], spread: 1.2, rate: 18, speed: 7, life: 22, color: '#f08a2a', seed: 9 }); K.steam(f, [SHX, 1.6, SHZ + 0.8], { rate: 10, size: 0.9, rise: 2.5 }); }
    if (f >= F.RAINED - 4 && f < 896) K.sparks(f, F.RAINED - 4, 896, (g) => [SHX - 2 + hash(g) * 5, 6.4, SHZ + 1 + hash(g + 3) * 4], { dir: [0, -1, 0], spread: 0.1, rate: 22, speed: 7, life: 26, color: '#f0a040', seed: 4 });
    if (f >= F.SAT && f < F.SAT + 24) K.puff(f, F.SAT, 7.0, 3.6, 12, 0.9);
    if (f >= 116 && f < 611 && !ex) K.steam(f, [-5.2, 5.1, -4.2], { rate: 3, size: 0.5, rise: 1.5 });
    if (f >= 420 && f < 470) K.puff(f, 430, rollX(0, 430) - 0.6, 1.0, 6, 0.4);
    K.mist(f, 888, 16); K.mist(f, 1118, 16);
    K.badge(f, F.WADDLE, 'FLAT BOTTOMS', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 114 });
    K.badge(f, F.WHY, 'WHY THE DENT?', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 268 });
    K.badge(f, F.LUNCH, 'UPGRADE 1: BELLIES', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 363 });
    K.badge(f, F.SIX, '600 ROUNDS OF FETCH', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: 517 });
    K.badge(f, F.TWICE, 'UPGRADE 2: 2X METAL', { sx: 0.5, sy: 0.2 }, { icon: 'weight', f1: 751 });
    K.badge(f, F.TWO, '200 POPS', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 872 });
    K.badge(f, F.FLAT2, 'FLAT = BENDS', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 1013 });
    K.badge(f, F.DOME, 'DOME = ARCH', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1124 });
    K.badge(f, F.BACK, 'DENT IS BACK', { sx: 0.5, sy: 0.2 }, { style: 'stamp', size: 1.15, f1: 1232 });
    const L = K.light('interior', { az: 80, el: 52, shadowExt: 18, fog: '#e8e0d4', fogNear: 30, fogFar: 140, exposure: 1.3 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
