// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Crackers Have Little Holes" — invented story, engine: Remove It and See (SCRIPTS.md §000).
// Baker Otto ("Holes are lazy!") bans the holes: day one the crackers come out like buns, day two like beach balls (one rolls
// out and chases the mailman). Nibbles the mouse is furious: his cracker house used the holes as windows. Otto stacks bricks on
// the oven door; at noon it blows and fires 400 crackers over Crumbleton like popcorn. Explainer: wet dough -> steam wants out;
// the holes are tiny chimneys, so the cracker bakes flat and crisp. Otto puts the holes back ("so I gave them a job"); Nibbles
// gets his windows back; the mailman still runs past the bakery.
import { TOTAL, LINES, wf } from './puffcrack_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const IZ = 40;                       // the bakery interior sits at z = 40; the street is at the origin
const OX = -3.2, OZ = IZ - 4.4;      // oven centre
const TX = 1.0, TZ = IZ - 1.0, TY = 0.95;   // work table (top height TY)
const HX = 3.9, HZ = IZ - 1.6, HY = 1.0;    // Nibbles' cracker house on the side counter
const EXX = 5.4, EXZ = IZ - 3.3, EXY = 1.45; // explainer cracker
let THREE, F = {}, OTTO, MAIL, MOUSE, DOOR, OVENG, OGLOW, TRAY = [], BALL, ROLLER, BRICKS = [], POP = [], RAIN = [], HOUSE, WALL_OLD, WALL_PUFF, WINS = [],
  GIANT, GIANTD, DROPS = [], BUBS = [], GHOLES = [], CHIM = [], HOLO, DOUGH, DHOLES = [], POSTER1, POSTER2, FLATS = [], EXTRAS, DOCKDROP;

function crackerMat(K) { return K.mat('grime', '#e2a653', { detail: 0.12, amt: 0.35, bump: 0.004 }); }
function flatCracker(K, parent, s = 0.3, holes = true) {          // a classic square cracker with its dock holes
  const g = new THREE.Group(); parent.add(g); K.rbox(s, s * 0.11, s, s * 0.04, crackerMat(K), 0, 0, 0, g);
  if (holes) for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) K.cyl(s * 0.035, s * 0.035, s * 0.02, K.paint('#7a4a1c', { rough: 0.9, coat: 0 }), i * s * 0.28, s * 0.05, j * s * 0.28, g, 8);
  return g; }
function puffCracker(K, parent) {                                   // a hole-less cracker puffed up like a pillow / ball
  const g = new THREE.Group(); parent.add(g); const m = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), crackerMat(K)); g.add(m); m.castShadow = true;
  for (let k = 0; k < 7; k++) { const a = hash(k + 3) * 6.28, r = 0.2 + 0.5 * hash(k + 9); const s = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.06), K.paint('#fbf6ea', { rough: 0.5, coat: 0 })); s.position.set(Math.cos(a) * r, Math.sqrt(Math.max(0, 1 - r * r)) * 0.99, Math.sin(a) * r); g.add(s); }
  const seam = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.04, 6, 32), K.mat('grime', '#c88a3a')); seam.rotation.x = Math.PI / 2; g.add(seam);
  return g; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { PILLOW: wf(0, 'pillows'), MOUSE: wf(0, 'mouse'), MOVED: wf(0, 'moved'), BANNED: wf(1, 'banned'), HOLES: wf(1, 'holes'), LAZY: wf(1, 'lazy'), WHY: wf(1, 'why'),
      DAY1: wf(2, 'day'), CAME: wf(2, 'came'), ROUND: wf(2, 'round'), BUNS: wf(2, 'buns'), FLUFFY: wf(2, 'fluffy'), DAY2: wf(3, 'day'), SWELL: wf(3, 'swelled'), BEACH: wf(3, 'beach'),
      ROLLED: wf(3, 'rolled'), CHASED: wf(3, 'chased'), MAILMAN: wf(3, 'mailman'), NIB: wf(4, 'nibbles'), FURIOUS: wf(4, 'furious'), HOUSE: wf(4, 'house'), WINDOWS: wf(4, 'windows'),
      STACKED: wf(5, 'stacked'), BRICKS: wf(5, 'bricks'), DOOR5: wf(5, 'door'), LAZY2: wf(5, 'lazy'), NOON: wf(6, 'noon'), BLEW: wf(6, 'blew'), SHOT: wf(6, 'shot'), FOUR: wf(6, 'four'),
      CRUMB: wf(6, 'crumbleton'), POPCORN: wf(6, 'popcorn'), WHAT: wf(7, 'what'), DOUGH: wf(8, 'dough'), WET: wf(8, 'wet'), WATER: wf(8, 'water'), STEAM: wf(8, 'steam'), OUT: wf(8, 'out'),
      CHIM: wf(9, 'chimneys'), ESC: wf(9, 'escapes'), FLAT: wf(9, 'flat'), CRISP: wf(9, 'crisp'), BACK: wf(10, 'back'), LAZY3: wf(10, 'lazy'), JOB: wf(10, 'job'), GOT: wf(11, 'got'),
      WIN2: wf(11, 'windows'), RUNS: wf(11, 'runs'), BAKERY: wf(11, 'bakery') };
    // ================= the bakery (interior, no ceiling so the sun pours in) =================
    const G = K.group();
    for (let x = -9; x < 9; x += 1) for (let z = IZ - 6; z < IZ + 14; z += 1) K.rbox(0.98, 0.04, 0.98, 0.01, K.mat('plaster', (Math.floor(x) + Math.floor(z)) % 2 ? '#e8dcc4' : '#9a5a3a', { detail: 0.5, amt: 0.15 }), x + 0.5, -0.02, z + 0.5, G);
    K.slab(-9, 9, 0, 4.6, IZ - 6, IZ - 5.5, K.mat('brick', '#c4785a', { detail: 0.5 }), G);                                    // back wall
    K.slab(-9, 9, 0, 1.3, IZ - 5.5, IZ - 5.45, K.mat('plaster', '#f4f0e6', { detail: 0.3 }), G);                               // white tiles
    for (let x = -8.8; x < 9; x += 0.3) K.slab(x, x + 0.012, 0, 1.3, IZ - 5.45, IZ - 5.43, K.paint('#c8c0b0', { coat: 0 }), G);
    K.slab(-9.4, -8.9, 0, 4.6, IZ - 6, IZ + 6, K.mat('brick', '#b86e50', { detail: 0.5 }), G);                                  // left wall
    K.slab(8.9, 9.4, 0, 4.6, IZ - 6, IZ + 6, K.mat('brick', '#b86e50', { detail: 0.5 }), G);                                    // right wall
    // shelves of jars + cracker boxes on the back wall
    for (const y of [2.1, 2.9]) { K.rbox(5.4, 0.08, 0.45, 0.02, K.mat('wood', '#8a5a34'), 3.6, y, IZ - 5.25, G);
      for (let k = 0; k < 7; k++) { const x = 1.3 + k * 0.75; if ((k + (y > 2.5 ? 1 : 0)) % 2) { K.cyl(0.17, 0.17, 0.5, K.glass({ color: '#e8f4ff', opacity: 0.4 }), x, y + 0.04, IZ - 5.2, G, 16); K.cyl(0.18, 0.18, 0.06, K.paint('#c0392b'), x, y + 0.54, IZ - 5.2, G, 16); for (let j = 0; j < 4; j++) K.rbox(0.2, 0.02, 0.2, 0.01, crackerMat(K), x, y + 0.08 + j * 0.1, IZ - 5.2, G); }
        else { const b = K.rbox(0.42, 0.5, 0.3, 0.02, K.paint(['#2a62c8', '#f2c230', '#2a9a6a'][k % 3], { rough: 0.4 }), x, y + 0.29, IZ - 5.2, G); const l = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.2), S.textMat('CRACKERS', { bg: '#f4efe4', fg: '#c0392b', w: 256, h: 128 })); l.position.set(x, y + 0.32, IZ - 5.04); G.add(l); } } }
    const menu = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.2), S.textMat('TODAY: CRACKERS|ALSO: CRACKERS', { bg: '#2a2a2a', fg: '#f4efe4', w: 640, h: 420 })); menu.position.set(-7.0, 2.6, IZ - 5.43); G.add(menu);
    K.rbox(1.95, 1.35, 0.06, 0.02, K.mat('wood', '#6a4226'), -7.0, 2.6, IZ - 5.47, G);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.7), S.textMat('CRUMBLETON CRACKERS', { bg: '#7a1f1f', fg: '#f2c230', w: 1024, h: 170, border: false })); sign.position.set(0.6, 4.0, IZ - 5.44); G.add(sign);
    K.rbox(4.4, 0.85, 0.06, 0.03, K.gold(), 0.6, 4.0, IZ - 5.48, G);
    K.cyl(0.38, 0.38, 0.06, K.paint('#f4efe4'), -5.4, 3.3, IZ - 5.45, G, 32).rotation.x = Math.PI / 2;                             // wall clock
    // flour sacks, barrels, cooling racks, rolling pins
    for (let k = 0; k < 4; k++) { const s = K.sphere(0.42, K.mat('fabric', '#efe6d2', { detail: 0.2 }), -7.6 + (k % 2) * 0.8, 0.42 + Math.floor(k / 2) * 0.62, IZ - 4.6 + (k % 2) * 0.3, G, 1, 1.2, 0.9); }
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.25), S.textMat('FLOUR', { bg: '#efe6d2', fg: '#2a62c8', w: 256, h: 128, border: false })); fl.position.set(-7.6, 0.5, IZ - 4.15); G.add(fl);
    for (let k = 0; k < 2; k++) { K.cyl(0.4, 0.4, 1.0, K.mat('wood', '#9a6a3a'), -7.4 + k * 0.9, 0, IZ + 1.5, G, 18); K.cyl(0.42, 0.42, 0.06, K.paint('#3a3a40', { metal: 0.8 }), -7.4 + k * 0.9, 0.8, IZ + 1.5, G, 18); }
    for (let k = 0; k < 4; k++) { K.rbox(1.2, 0.03, 0.6, 0.01, K.chrome(), 7.6, 0.4 + k * 0.45, IZ + 0.5, G); for (let j = 0; j < 3; j++) flatCracker(K, G, 0.28).position.set(7.25 + j * 0.35, 0.44 + k * 0.45, IZ + 0.5); }
    for (const y of [0, 1.8]) K.rbox(0.04, 0.04, 0.04, 0.01, K.chrome(), 7.0, y, IZ + 0.2, G);
    K.rbox(0.04, 1.8, 0.04, 0.01, K.chrome(), 7.0, 0.9, IZ + 0.2, G); K.rbox(0.04, 1.8, 0.04, 0.01, K.chrome(), 8.2, 0.9, IZ + 0.2, G);
    // work table
    K.rbox(3.4, 0.12, 1.3, 0.04, K.mat('wood', '#c8945a', { detail: 0.4 }), TX, TY - 0.06, TZ, G);
    for (const [dx, dz] of [[-1.55, -0.5], [1.55, -0.5], [-1.55, 0.5], [1.55, 0.5]]) K.rbox(0.1, TY - 0.12, 0.1, 0.02, K.mat('wood', '#7a5234'), TX + dx, (TY - 0.12) / 2, TZ + dz, G);
    K.rbox(3.2, 0.06, 1.1, 0.02, K.mat('wood', '#a8743e'), TX, 0.3, TZ, G);
    for (let k = 0; k < 3; k++) K.cyl(0.05, 0.05, 0.5, K.mat('wood', '#e8c090'), TX - 1.2 + k * 0.2, 0.36, TZ + 0.2, G, 10).rotation.z = Math.PI / 2;
    K.solid(K.rbox(3.4, 0.9, 1.3, 0.02, new THREE.MeshBasicMaterial({ visible: false }), TX, 0.45, TZ, sc));
    // side counter + Nibbles' house base
    K.rbox(2.0, 0.08, 1.0, 0.03, K.mat('wood', '#b8844a'), HX, HY - 0.04, HZ, G); K.rbox(1.9, HY - 0.08, 0.9, 0.03, K.paint('#2a6a5a', { rough: 0.5 }), HX, (HY - 0.08) / 2, HZ, G);
    for (let k = 0; k < 3; k++) K.rbox(0.5, 0.05, 0.02, 0.01, K.gold(), HX - 0.6 + k * 0.6, 0.6, HZ + 0.46, G);
    // explainer counter (marble)
    K.rbox(2.6, 0.12, 1.3, 0.04, K.mat('rock', '#ece8e2', { detail: 0.4 }), EXX, 1.0, EXZ, G); K.rbox(2.4, 0.94, 1.1, 0.03, K.paint('#2a3a5a', { rough: 0.5 }), EXX, 0.47, EXZ, G);
    K.cyl(0.06, 0.08, 0.35, K.chrome(), EXX, 1.06, EXZ, G, 12);
    // pendant lamps + a window shaft
    for (const x of [-1.5, 3.5]) { K.cyl(0.01, 0.01, 1.2, K.paint('#222'), x, 3.4, IZ - 1.5, G, 6); K.cyl(0.08, 0.35, 0.28, K.paint('#1f5a4a', { rough: 0.3 }), x, 3.15, IZ - 1.5, G, 20); }
    S.bake(G);
    K.lamp(-1.5, 3.0, IZ - 1.5, { color: '#ffd08a', intensity: 6, distance: 9 }); K.lamp(3.5, 3.0, IZ - 1.5, { color: '#ffd08a', intensity: 6, distance: 9 });
    // ================= the hero prop: Otto's oven =================
    OVENG = new THREE.Group(); OVENG.position.set(OX, 0, OZ); sc.add(OVENG);
    const red = K.paint('#b8262a', { rough: 0.3 }), cream = K.paint('#f4ead2', { rough: 0.35 }), gold = K.gold(), chrome = K.chrome();
    K.rbox(3.0, 0.35, 1.9, 0.08, K.paint('#2a2a30', { rough: 0.4 }), 0, 0.18, 0, OVENG);                         // plinth
    K.rbox(2.9, 2.3, 1.8, 0.18, red, 0, 1.5, 0, OVENG);                                                          // body
    K.rbox(2.96, 0.1, 1.86, 0.04, gold, 0, 0.42, 0, OVENG); K.rbox(2.96, 0.1, 1.86, 0.04, gold, 0, 2.6, 0, OVENG);
    K.rbox(2.6, 0.5, 0.06, 0.04, cream, 0, 2.25, 0.92, OVENG);                                                    // control strip
    for (let k = 0; k < 3; k++) { K.cyl(0.11, 0.11, 0.08, chrome, -0.7 + k * 0.45, 2.25, 0.95, OVENG, 20).rotation.x = Math.PI / 2; K.rbox(0.03, 0.12, 0.03, 0.01, K.paint('#1a1a1a'), -0.7 + k * 0.45, 2.3, 1.0, OVENG); }
    K.cyl(0.18, 0.18, 0.05, cream, 0.75, 2.25, 0.95, OVENG, 28).rotation.x = Math.PI / 2;                                  // thermometer
    const needle = K.rbox(0.02, 0.14, 0.01, 0.005, K.paint('#c0392b'), 0.75, 2.27, 0.99, OVENG); needle.rotation.z = -0.9; OVENG.userData.needle = needle;
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.26), S.textMat("OTTO'S OVEN No.1", { bg: '#f2c230', fg: '#7a1f1f', w: 640, h: 120, border: false })); plate.position.set(0, 2.75, 0.91); OVENG.add(plate);
    K.cyl(0.24, 0.24, 2.6, chrome, 0.8, 2.6, -0.3, OVENG, 20); K.cyl(0.3, 0.3, 0.12, gold, 0.8, 2.75, -0.3, OVENG, 20); K.cyl(0.3, 0.3, 0.12, gold, 0.8, 4.3, -0.3, OVENG, 20);
    for (const sx of [-1, 1]) K.cyl(0.08, 0.1, 0.35, K.paint('#1a1a1a'), sx * 1.25, 0, 0.7, OVENG, 10);
    OGLOW = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.0), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff8a2a').multiplyScalar(1.6), toneMapped: false })); OGLOW.position.set(0, 1.25, 0.88); OGLOW.userData.ndSkip = true; OVENG.add(OGLOW);
    DOOR = new THREE.Group(); DOOR.position.set(0, 0.55, 0.92); OVENG.add(DOOR);
    K.rbox(2.2, 1.45, 0.1, 0.06, red, 0, 0.73, 0.02, DOOR); K.rbox(2.26, 0.06, 0.14, 0.02, gold, 0, 1.43, 0.03, DOOR); K.rbox(2.26, 0.06, 0.14, 0.02, gold, 0, 0.04, 0.03, DOOR);
    const win = K.cyl(0.42, 0.42, 0.04, K.glass({ color: '#ffc080', opacity: 0.55 }), 0, 0.78, 0.07, DOOR, 32); win.rotation.x = Math.PI / 2;
    const wr = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.05, 10, 36), gold); wr.position.set(0, 0.78, 0.1); DOOR.add(wr);
    const wg = new THREE.Mesh(new THREE.CircleGeometry(0.41, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffa040').multiplyScalar(1.5), toneMapped: false })); wg.position.set(0, 0.78, 0.06); wg.userData.ndSkip = true; DOOR.add(wg);
    const hd = K.cyl(0.05, 0.05, 1.5, chrome, 0, 1.25, 0.24, DOOR, 14); hd.rotation.z = Math.PI / 2; hd.position.set(0, 1.25, 0.24);
    for (const sx of [-0.6, 0.6]) K.rbox(0.06, 0.06, 0.18, 0.02, chrome, sx, 1.25, 0.15, DOOR);
    OVENG.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    K.solid(K.rbox(3.0, 2.6, 1.9, 0.02, new THREE.MeshBasicMaterial({ visible: false }), OX, 1.3, OZ, sc));
    K.lamp(OX, 1.4, OZ + 1.6, { color: '#ff9a40', intensity: 3, distance: 5 });
    // ================= crackers =================
    for (let k = 0; k < 6; k++) { const c = puffCracker(K, sc); c.userData = { x: TX - 1.1 + (k % 3) * 1.1, z: TZ - 0.3 + Math.floor(k / 3) * 0.6 }; TRAY.push(c); }
    K.rbox(3.2, 0.03, 1.1, 0.02, K.chrome(), TX, TY + 0.015, TZ, sc);
    BALL = puffCracker(K, sc);
    for (let k = 0; k < 40; k++) { const c = puffCracker(K, sc); c.userData = { a: hash(k + 1) * 1.4 - 0.7, v: 6 + hash(k + 5) * 5, up: 3 + hash(k + 8) * 5, d: hash(k + 2) * 6, s: 0.14 + hash(k + 4) * 0.12 }; POP.push(c); }
    for (let k = 0; k < 70; k++) { const c = puffCracker(K, sc); c.userData = { x: -16 + hash(k + 11) * 32, z: -9 + hash(k + 13) * 15, t0: hash(k + 17) * 50, s: 0.35 + hash(k + 19) * 0.3 }; RAIN.push(c); }
    // docking roller (the hole-maker Otto bins, then uses again)
    ROLLER = new THREE.Group(); sc.add(ROLLER);
    const rc = K.cyl(0.11, 0.11, 0.5, K.mat('wood', '#e0b07a'), 0, -0.25, 0, ROLLER, 18); rc.rotation.z = Math.PI / 2; rc.position.set(0, 0, 0);
    for (let k = 0; k < 6; k++) for (let j = 0; j < 8; j++) { const sp = K.cyl(0.012, 0.02, 0.05, chrome, 0, 0, 0, ROLLER, 6); const a = j / 8 * Math.PI * 2; sp.position.set(-0.2 + k * 0.08, Math.cos(a) * 0.12, Math.sin(a) * 0.12); sp.rotation.x = a; }
    const rh = K.cyl(0.025, 0.025, 0.5, chrome, 0, 0, 0, ROLLER, 8); rh.position.set(0, 0.25, 0); K.cyl(0.04, 0.04, 0.18, K.paint('#c0392b'), 0, 0.5, 0, ROLLER, 12);
    const bin = K.cyl(0.32, 0.26, 0.75, K.paint('#3a6a4a', { rough: 0.4 }), -5.6, 0, IZ - 1.0, sc, 22); K.cyl(0.34, 0.34, 0.05, K.chrome(), -5.6, 0.73, IZ - 1.0, sc, 22);
    const bl = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.16), S.textMat('BIN', { bg: '#f4efe4', fg: '#3a6a4a', w: 256, h: 100 })); bl.position.set(-5.6, 0.45, IZ - 0.72); sc.add(bl);
    // bricks against the oven door
    for (let k = 0; k < 14; k++) { const b = K.rbox(0.42, 0.2, 0.22, 0.02, K.mat('brick', '#b04a32', { detail: 0.4 }), 0, 0, 0, sc); b.userData = { x: OX - 0.75 + (k % 4) * 0.46 + (Math.floor(k / 4) % 2) * 0.2, y: 0.1 + Math.floor(k / 4) * 0.21, z: OZ + 1.12 }; BRICKS.push(b); }
    for (let k = 0; k < 6; k++) K.rbox(0.42, 0.2, 0.22, 0.02, K.mat('brick', '#a84a32', { detail: 0.4 }), -6.6 + (k % 3) * 0.46, 0.1 + Math.floor(k / 3) * 0.21, IZ - 2.6, sc);
    // posters: Otto's "NO HOLES!" (later "HOLES AT WORK")
    POSTER1 = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.6), S.textMat('NO|HOLES!', { bg: '#f2c230', fg: '#c0392b', w: 400, h: 500 })); POSTER1.position.set(-0.6, 2.4, IZ - 5.42); sc.add(POSTER1);
    POSTER2 = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.6), S.textMat('HOLES|AT|WORK', { bg: '#7af8a0', fg: '#1a4a2a', w: 400, h: 500 })); POSTER2.position.set(-0.6, 2.4, IZ - 5.41); sc.add(POSTER2);
    // Nibbles' cracker house: walls of docked crackers whose holes glow like windows
    HOUSE = new THREE.Group(); HOUSE.position.set(HX, HY, HZ); sc.add(HOUSE);
    const wallC = (w, h, holes) => { const g = new THREE.Group(); K.rbox(w, h, 0.04, 0.012, crackerMat(K), 0, h / 2, 0, g); if (holes) for (let i = -1; i <= 1; i++) for (let j = 0; j < 2; j++) { const d = new THREE.Mesh(new THREE.CircleGeometry(0.035, 14), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd070').multiplyScalar(1.8), toneMapped: false })); d.position.set(i * w * 0.28, h * (0.35 + j * 0.3), 0.022); d.userData.ndSkip = true; g.add(d); WINS.push(d); } return g; };
    const back = wallC(0.6, 0.45, false); back.position.z = -0.25; HOUSE.add(back);
    for (const sx of [-1, 1]) { const s = wallC(0.5, 0.45, false); s.rotation.y = Math.PI / 2; s.position.x = sx * 0.3; HOUSE.add(s); }
    WALL_OLD = wallC(0.6, 0.45, true); WALL_OLD.position.z = 0.25; HOUSE.add(WALL_OLD);
    WALL_PUFF = puffCracker(K, HOUSE); WALL_PUFF.scale.set(0.32, 0.26, 0.08); WALL_PUFF.position.set(0, 0.24, 0.27);
    for (const sx of [-1, 1]) { const r = K.rbox(0.7, 0.04, 0.42, 0.012, crackerMat(K), sx * 0.17, 0.56, 0, HOUSE); r.rotation.z = -sx * 0.6; }
    const door = K.rbox(0.12, 0.2, 0.02, 0.01, K.mat('wood', '#7a4a2a'), 0.22, 0.1, 0.275, HOUSE);
    const hl = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.1), S.textMat('NIBBLES', { bg: '#f4efe4', fg: '#7a1f1f', w: 256, h: 76 })); hl.position.set(0, 0.62, 0.32); HOUSE.add(hl); HOUSE.userData.label = hl;
    HOUSE.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    // explainer: giant cracker cut open (x-ray), water drops -> steam bubbles; then the docked cracker with chimneys
    GIANT = puffCracker(K, sc); GIANT.position.set(EXX, EXY, EXZ); GIANT.children[0].material = K.holo('#ffb040', { strength: 0.8 });
    GIANTD = new THREE.Group(); GIANTD.position.set(EXX, EXY, EXZ); sc.add(GIANTD); K.rbox(2.0, 0.16, 1.0, 0.05, crackerMat(K), 0, 0, 0, GIANTD);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) { const h = K.cyl(0.06, 0.06, 0.17, K.paint('#4a2a10', { rough: 0.9, coat: 0 }), -0.66 + i * 0.44, -0.085, -0.22 + j * 0.44, GIANTD, 14); GHOLES.push([-0.66 + i * 0.44, -0.22 + j * 0.44]); }
    HOLO = K.holoBox(2.4, 1.2, 1.3, EXX, EXY + 0.2, EXZ, sc, '#36e2ff');
    const blue = new THREE.MeshBasicMaterial({ color: new THREE.Color('#3ab0ff').multiplyScalar(1.8), toneMapped: false }), white = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffffff').multiplyScalar(1.4), toneMapped: false, transparent: true, opacity: 0.85 });
    for (let k = 0; k < 14; k++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), blue); d.userData = { x: -0.8 + hash(k + 30) * 1.6, z: -0.35 + hash(k + 31) * 0.7 }; d.userData.ndSkip = true; sc.add(d); DROPS.push(d);
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), white); b.userData = d.userData; b.userData.ndSkip = true; sc.add(b); BUBS.push(b); }
    for (const [hx, hz] of GHOLES) CHIM.push(K.trace([[EXX + hx, EXY, EXZ + hz], [EXX + hx, EXY + 0.5, EXZ + hz], [EXX + hx + 0.05, EXY + 1.0, EXZ + hz]], { color: '#ffffff', r: 0.018 }));
    // the dough sheet Otto docks at the end + the flat crackers on the table
    DOUGH = K.rbox(2.6, 0.04, 0.9, 0.02, K.mat('plaster', '#f0d8a8', { detail: 0.2 }), TX, TY + 0.05, TZ, sc);
    for (let i = 0; i < 12; i++) for (let j = 0; j < 4; j++) { const h = K.cyl(0.018, 0.018, 0.01, K.paint('#8a5a2a', { coat: 0 }), TX - 1.15 + i * 0.21, TY + 0.07, TZ - 0.33 + j * 0.22, sc, 8); DHOLES.push(h); }
    for (let k = 0; k < 12; k++) { const c = flatCracker(K, sc, 0.3); c.position.set(TX - 1.3 + (k % 6) * 0.52, TY + 0.06, TZ - 0.25 + Math.floor(k / 6) * 0.5); FLATS.push(c); }
    DOCKDROP = flatCracker(K, sc, 0.3);
    // ================= Crumbleton high street (exterior, at the origin) =================
    S.street({ len: 90, width: 7, sidewalk: 4.5, crossings: [14] });
    const grass = K.slab(-80, 80, -0.2, 0, -60, 60, K.mat('grime', '#6aa84f', { amt: 0.6 }), sc, false); grass.position.y -= 0.01;
    const bk = S.building({ w: 7, d: 9, floors: 2, seed: 3, color: '#f2e2c0', kind: 'plaster', gable: 'bell', shop: 'CRUMBLETON CRACKERS', signBg: '#7a1f1f', signFg: '#f2c230', awning: ['#c0392b', '#f4efe4'], shutters: '#7a1f1f', flowers: true }); bk.position.set(0, 0.15, -8);
    let x = -30, i = 0; while (x < 30) { const w = 5 + (i * 7 % 3); if (Math.abs(x + w / 2) < 4.6) { x += 8; continue; } const b = S.building({ w, d: 9, floors: 2 + (i % 3), seed: i + 11, shop: [null, 'POST OFFICE', 'BOOKS', null, 'CHEESE', 'HATS'][i % 6], shutters: i % 3 === 0 ? '#2a5a3a' : null, flowers: i % 2 === 0, kind: i % 4 === 3 ? 'plaster' : 'brick', gable: ['pitched', 'step', 'flat'][i % 3] }); b.position.set(x + w / 2, 0.15, -8.2); x += w + 0.05; i++; }
    x = -30; i = 30; while (x < 30) { const w = 5 + (i * 5 % 3); const b = S.building({ w, d: 9, floors: 2 + (i % 2), seed: i + 1, shop: i % 3 === 0 ? 'CAFE' : null, flowers: true, gable: ['step', 'pitched'][i % 2] }); b.position.set(x + w / 2, 0.15, 8); b.rotation.y = Math.PI; x += w + 0.05; i++; }
    for (let k = -24; k <= 24; k += 8) for (const s of [-1, 1]) { if (Math.abs(k) < 4) continue; const t = S.tree({ h: 4.0, seed: k + s * 7 }); t.position.set(k + (s > 0 ? 4 : 0), 0.15, s * 5.6); }
    for (let k = -18; k <= 18; k += 12) { const l = S.streetLamp(); l.position.set(k, 0.15, -4.1); }
    for (const [bx, bz, r] of [[-6, -5.8, 0], [9, 5.8, Math.PI]]) { const b = S.bench(); b.position.set(bx, 0.15, bz); b.rotation.y = r; }
    for (const [px, pz] of [[-4, -6.2], [4, -6.2], [12, 6.2]]) { const p = S.planter(sc, px); p.position.set(px, 0.15, pz); }
    const mb = K.rbox(0.5, 1.1, 0.45, 0.06, K.paint('#2a4a9a', { rough: 0.3 }), 5.5, 0.7, -4.6, sc); K.rbox(0.52, 0.12, 0.47, 0.04, K.gold(), 5.5, 1.28, -4.6, sc);
    const ml = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.14), S.textMat('MAIL', { bg: '#2a4a9a', fg: '#f2c230', w: 256, h: 90, border: false })); ml.position.set(5.5, 0.95, -4.37); sc.add(ml);
    for (const [cx, cz, kind, seed] of [[-14, -2.7, 'hatch', 2], [16, 2.7, 'van', 3], [-8, 2.7, 'taxi', 4]]) { const c = S.car({ kind, seed }); c.g.position.set(cx, 0, cz); if (cz > 0) c.g.rotation.y = Math.PI; }
    const ab = S.board('FRESH CRACKERS|NOW EXTRA PUFFY', 1.6, 1.0, { frame: '#7a1f1f' }); ab.position.set(-2.4, 0.15, -4.6); ab.rotation.y = 0.3;
    EXTRAS = S.extras(7, { x0: -16, len: 32, z: -5.2, spread: 1.0, seed: 5 }).concat(S.extras(5, { x0: -14, len: 28, z: 5.3, spread: 1.0, seed: 44 }));
    K.addClouds(8, 700, 160);
    // ================= characters =================
    OTTO = K.stick({ jacket: '#f4f2ee', pants: '#3a3a48', hat: 'chef', moustache: '#3a2418', bowtie: '#c0392b', apron: '#f6efe0', belt: '#7a1f1f', build: 'stout', collar: '#c0392b' }, { key: 'otto' });
    MAIL = K.stick({ jacket: '#2a4a8a', pants: '#2a4a8a', hat: 'cap', hatColor: '#2a4a8a', badge: true, tie: '#f2c230', glasses: true, hairStyle: 'short', hair: '#8a5a34', pockets: true }, { key: 'mail' });
    MOUSE = K.animal('mouse', { scale: 1.7, seed: 2 });
  },
  frame(f, K) {
    const T = K.T, S = K.set, blink = (s) => blinkAt(f, s);
    const ext = (f >= 410 && f < 470) || (f >= 735 && f < 795) || f >= 1262;     // shots on the high street
    // ---------- the oven: door, rumble, glow ----------
    let doorA = 0; if (f >= F.DAY1 - 4 && f < 300) doorA = sm(F.DAY1 - 4, F.DAY1 + 8, f) * 1.4 * (1 - sm(285, 298, f));
    if (f >= 640 && f < F.BLEW) doorA = 0.05 * Math.sin(f * 1.7) * sm(640, 660, f);
    if (f >= F.BLEW) doorA = f < 800 ? Math.min(1.75, (f - F.BLEW) * 0.45) + 0.12 * Math.sin((f - F.BLEW) * 0.6) * Math.exp(-(f - F.BLEW) / 10) : 1.55;
    if (f >= 800) doorA = 0;
    DOOR.rotation.x = doorA;
    const rum = f >= 640 && f < F.BLEW ? sm(640, F.BLEW, f) : 0; OVENG.position.set(OX + 0.03 * rum * Math.sin(f * 2.1), 0.02 * rum * Math.abs(Math.sin(f * 1.3)), OZ); OVENG.scale.set(1 + 0.025 * rum * Math.sin(f * 0.9), 1 + 0.03 * rum * Math.abs(Math.sin(f * 0.9)), 1);
    OVENG.userData.needle.rotation.z = -0.9 + 1.8 * sm(600, F.BLEW, f) * (f < 800 ? 1 : 0) + 0.1 * rum * Math.sin(f * 3);
    OGLOW.material.color.set('#ff8a2a').multiplyScalar(1.4 + 0.8 * rum + 0.2 * Math.sin(f * 0.3));
    // ---------- crackers on the table: pillows (L0-1), buns (day one), beach balls (day two) ----------
    let st = 'pillow'; if (f >= 232 && f < 358) st = 'bun'; if (f >= 358 && f < 470) st = 'ball'; if (f >= 470) st = 'none';
    TRAY.forEach((c, k) => { const u = c.userData; c.visible = st !== 'none' && !ext; let r = 0.26, h = 0.42;
      if (st === 'bun') { r = 0.22 + 0.04 * sm(F.ROUND - 6, F.ROUND + 6, f); h = 0.65; }
      if (st === 'ball') { const g = sm(F.SWELL - 4, F.BEACH + 6, f); r = lerp(0.26, 0.5, g); h = lerp(0.65, 0.92, g); }
      if (st === 'bun' && f < F.CAME) c.visible = false;
      c.scale.set(r, r * h, r); c.position.set(u.x + (st === 'ball' ? (k % 3 - 1) * 0.05 * sm(F.SWELL, F.BEACH, f) : 0), TY + 0.03 + r * h, u.z); c.rotation.y = k;
      if (st === 'ball' && k === 2 && f >= F.ROLLED - 6) { const d = Math.max(0, f - F.ROLLED + 6) / 30; c.position.x += d * 3.0; if (c.position.x > TX + 1.9) c.position.y = Math.max(r * h, TY + 0.03 + r * h - (c.position.x - TX - 1.9) * 2.5); c.rotation.z = -d * 6; } });
    // the beach-ball cracker chasing the mailman on the high street
    const mailX = (g) => lerp(-6, 14, clamp((g - 405) / 75, 0, 1)), mailX2 = (g) => lerp(-4.5, 5.5, clamp((g - 1262) / 88, 0, 1));
    BALL.visible = (f >= 410 && f < 470) || (f >= 735 && f < 795) || f >= 1262;
    let ballX = 0; if (f < 470) { ballX = mailX(f) - lerp(4.5, 2.0, clamp((f - 405) / 60, 0, 1)); } else if (f < 795) ballX = 7 + (f - 735) * 0.08; else ballX = mailX2(f) - 2.4;
    BALL.scale.set(0.55, 0.5, 0.55); BALL.position.set(ballX, 0.5 + 0.08 * Math.abs(Math.sin(f * 0.35)), -3.3); BALL.rotation.set(0, 0, -ballX / 0.55);
    // ---------- the docking roller: binned at "banned", back in Otto's hand at the end ----------
    ROLLER.visible = !ext;
    if (f < F.BANNED - 2) { ROLLER.position.set(-0.5, 1.15, IZ - 0.1); ROLLER.rotation.set(0, 0, 0); }
    else if (f < 1068) { const u = clamp((f - F.BANNED + 2) / 18, 0, 1); ROLLER.position.set(lerp(-0.5, -5.6, u), lerp(1.15, 0.8, u) + Math.sin(u * Math.PI) * 1.4, lerp(IZ - 0.1, IZ - 1.0, u)); ROLLER.rotation.set(u * 8, 0, u * 3); if (u >= 1) { ROLLER.position.set(-5.55, 0.95, IZ - 1.0); ROLLER.rotation.set(0.3, 0, 0.5); } }
    else { const u = clamp((f - 1080) / 50, 0, 1); ROLLER.position.set(TX - 1.3 + u * 2.6, TY + 0.2, TZ); ROLLER.rotation.set(u * 22, 0, 0); if (f < 1080) { ROLLER.position.set(TX - 1.3, TY + 0.2, TZ); ROLLER.rotation.set(0, 0, 0); } if (f >= 1132) ROLLER.visible = false; }
    // dough + holes appear behind the roller; then the table of flat crackers
    DOUGH.visible = f >= 1068 && f < 1132 && !ext; const rx = TX - 1.3 + clamp((f - 1080) / 50, 0, 1) * 2.6;
    DHOLES.forEach((h) => { h.visible = DOUGH.visible && h.position.x < rx - 0.12; });
    FLATS.forEach((c) => { c.visible = f >= 1132 && f < 1262; });
    DOCKDROP.visible = false;
    // ---------- bricks: carried + stacked against the door, then blown away ----------
    BRICKS.forEach((b, k) => { const u0 = b.userData, appear = 600 + k * 4.5; b.visible = f >= appear && f < 800 && !ext;
      if (f < F.BLEW) b.position.set(u0.x, u0.y + Math.max(0, 1 - (f - appear) / 4) * 0.4, u0.z);
      else { const t = (f - F.BLEW) / 30, a = hash(k + 40) * 2 - 1; b.position.set(u0.x + a * 2.5 * t, Math.max(0.1, u0.y + 4 * t - 6 * t * t), u0.z + (2.5 + hash(k) * 3) * t); b.rotation.set(t * 9 * a, t * 5, t * 7); } });
    // popcorn burst out of the door (interior) + rain over Crumbleton (exterior)
    POP.forEach((c, k) => { const u = c.userData, t = (f - F.BLEW - u.d * 0.6) / 30; c.visible = f >= F.BLEW && f < 800 && t > 0 && !ext;
      if (c.visible) { c.position.set(OX + Math.sin(u.a) * u.v * t, 1.3 + u.up * t - 4.9 * t * t, OZ + 1.2 + Math.cos(u.a) * u.v * t); if (c.position.y < u.s) c.position.y = u.s; c.scale.set(u.s, u.s * 0.8, u.s); c.rotation.set(t * 5, t * 3, k); } });
    RAIN.forEach((c, k) => { const u = c.userData, t = (f - 735 - u.t0) / 30; c.visible = f >= 735 && f < 800 && ext && t > -0.6;
      if (c.visible) { const y = 14 - 4.9 * (t + 0.6) * (t + 0.6) * 1.4; c.position.set(u.x, Math.max(u.s * 0.8, y), u.z); c.scale.set(u.s, u.s * 0.8, u.s); c.rotation.set(t * 4, k, t * 2); } });
    // ---------- posters, house, explainer ----------
    POSTER1.visible = f < 1132; POSTER2.visible = f >= 1132;
    WALL_OLD.visible = !(f >= 473 && f < 1196) || f >= 530 && f < 560; WALL_PUFF.visible = !WALL_OLD.visible;
    WINS.forEach((w) => { w.material.color.set('#ffd070').multiplyScalar(f >= 1196 ? 1.8 + 0.5 * Math.sin(f * 0.2) : 1.5); });
    const ex = f >= 834 && f < 1070;
    HOLO.visible = ex; GIANT.visible = ex && f < 945; GIANTD.visible = ex && f >= 945;
    const pf = sm(F.STEAM - 4, F.OUT + 8, f); GIANT.scale.set(1.0, 0.09 + 0.45 * pf, 0.5); GIANT.position.y = EXY + 0.45 * pf * 0.5;
    DROPS.forEach((d, k) => { const u = d.userData; d.visible = ex && f < 945 && f < F.STEAM + 2; d.position.set(EXX + u.x, EXY + 0.02 + 0.02 * Math.sin(f * 0.2 + k), EXZ + u.z * 0.8); d.scale.setScalar(f >= F.WATER - 4 ? 1 + 0.3 * Math.sin(f * 0.4 + k) : 1); });
    BUBS.forEach((b, k) => { const u = b.userData, g = sm(F.STEAM - 6 + (k % 4) * 2, F.OUT + 6, f); b.visible = ex && f < 945 && f >= F.STEAM - 6; b.position.set(EXX + u.x, EXY + 0.05 + 0.3 * g * (0.5 + hash(k)), EXZ + u.z * 0.8); b.scale.setScalar(0.4 + 1.4 * g); });
    CHIM.forEach((c, k) => c.show(ex && f >= 945 ? sm(F.ESC - 10 + k, F.ESC + 12 + k, f) : 0));
    // ---------- characters ----------
    S.extrasFrame(f, EXTRAS, T);
    // Otto
    let op = { x: -0.9, z: IZ - 0.5, yaw: 0.35 };
    if (f >= 232 && f < 300) op = { x: -1.6, z: OZ + 2.0, yaw: -0.6 };
    if (f >= 300 && f < 358) op = { x: -0.9, z: IZ - 0.4, yaw: 0.2 };
    if (f >= 590 && f < 800) { const W = K.walkPath(f, 596, [[-0.9, IZ - 0.5], [-4.6, IZ - 2.1], [-2.2, OZ + 1.9]], 2.2, { key: 'otto-bricks' }); op = { x: W.x, z: W.z, yaw: W.moving ? W.yaw : 0.5 }; }
    if (f >= 680 && f < 800) op = { x: -1.0, z: OZ + 2.6, yaw: 0.2 };
    if (f >= 1068 && f < 1132) op = { x: lerp(TX - 1.3, TX + 1.3, clamp((f - 1080) / 50, 0, 1)), z: TZ - 0.95, yaw: 0 };
    if (f >= 1132) op = { x: -0.7, z: IZ - 0.3, yaw: 0.35 };
    if (ext || ex) op = { visible: false };
    const ok = [[0, 'hips', { expr: 'proud' }], [60, 'show', { expr: 'grin' }], [F.BANNED - 6, 'throwBack', { expr: 'stern' }], [F.BANNED + 2, 'throw', { expr: 'stern' }], [F.HOLES + 4, 'point', { expr: 'angry', talk: true }],
      [F.LAZY - 4, 'pointUp', { expr: 'yell', talk: true }], [F.WHY, 'hips', { expr: 'smug' }], [232, 'reach', { expr: 'excited' }], [F.BUNS - 4, 'show', { expr: 'proud' }], [300, 'carry', { expr: 'grin', item: 'box' }],
      [F.FLUFFY - 4, 'cheer', { expr: 'excited', talk: true }], [358, 'hips', { expr: 'proud' }], [F.SWELL, 'shock', { expr: 'shock' }], [F.BEACH, 'scared', { expr: 'scared' }], [F.ROLLED, 'panic', { expr: 'scared' }],
      [473, 'shrug', { expr: 'confused' }], [590, 'carry', { expr: 'stern', item: 'box' }], [680, 'cross', { expr: 'smug' }], [F.LAZY2 - 6, 'pointUp', { expr: 'yell', talk: true }], [F.NOON, 'shock', { expr: 'scared' }],
      [F.BLEW, 'fall', { expr: 'dazed' }], [1068, 'push', { expr: 'grin' }], [1132, 'show', { expr: 'proud' }], [F.LAZY3 - 4, 'pointUp', { expr: 'smug', talk: true }], [F.JOB - 6, 'celebrate', { expr: 'laugh', talk: true }], [1196, 'clap', { expr: 'laugh' }]];
    const OA = T.act(f, ok, { seed: 4, blink: blink(4), phase: (f / 16) % 1 });
    if (f >= 596 && f < 680 && Math.hypot(op.x + 2.2, op.z - OZ - 1.9) > 0.05) OA.opts.mode = 'walk';
    if (f >= 1080 && f < 1130) OA.opts.mode = 'walk';
    OTTO.set(OA, op);
    // the mailman
    let mp = { visible: false }, mk = [[0, 'run', { expr: 'scared', item: 'letter' }]];
    if (f >= 405 && f < 470) mp = { x: mailX(f), z: -3.3, yaw: Math.PI / 2 };
    if (f >= 735 && f < 795) { mp = { x: 4 + (f - 735) * 0.1, z: -3.4, yaw: Math.PI / 2 }; }
    if (f >= 1262) { mp = { x: mailX2(f), z: -3.3, yaw: Math.PI / 2 }; mk = [[0, 'run', { expr: 'scared', item: 'letter' }], [1300, 'run', { expr: 'shock', item: 'letter' }]]; }
    MAIL.set(T.act(f, mk, { seed: 8, blink: blink(8), phase: (f / 9) % 1 }), mp);
    // Nibbles
    let np = { x: TX, z: TZ - 0.3, y: TY + 0.24, yaw: 0.6, mode: 'sleep', expr: 'sleepy' };
    if (f >= F.MOVED - 4 && f < 111) np = { x: TX, z: TZ - 0.3, y: TY + 0.24, yaw: 0.5, mode: 'sit', expr: 'happy' };
    if (f >= 30 && f < 60) np = { x: TX, z: TZ - 0.3, y: TY + 0.24, yaw: 0.6, mode: 'beg', expr: 'happy' };
    if (f >= 108 && f < 232) np = { x: TX + 1.1, z: TZ + 0.35, y: TY, yaw: -0.6, mode: 'sit', expr: f >= F.LAZY ? 'angry' : 'neutral' };
    if (f >= 232 && f < 358) np = { x: TX + 1.4, z: TZ + 0.4, y: TY, yaw: -0.8, mode: f >= F.FLUFFY ? 'beg' : 'stand', expr: f >= F.FLUFFY ? 'shock' : 'neutral' };
    if (f >= 358 && f < 470) np = { x: TX + 1.55, z: TZ + 0.45, y: TY, yaw: -0.5, mode: f >= F.BEACH ? 'jump' : 'stand', expr: 'shock' };
    if (f >= 470 && f < 592) np = { x: HX + (f < 530 ? -0.05 : 0.42), z: HZ + 0.42, y: HY, yaw: f < 530 ? 0.1 : -0.3, mode: 'stand', expr: 'angry', lift: f < 530 ? 0.5 + 0.5 * Math.sin(f * 0.8) : 0 };
    if (f >= 592 && f < 800) np = { x: HX - 0.1, z: HZ + 0.45, y: HY, yaw: -0.7, mode: f >= F.BLEW ? 'jump' : 'sit', expr: f >= F.NOON ? 'shock' : 'sad' };
    if (f >= 795 && f < 834) np = { x: -1.0, z: OZ + 2.6 + 0.1, y: 1.6, yaw: 0.2, mode: 'sit', expr: 'shock' };
    if (f >= 1068 && f < 1196) np = { x: TX + 1.55, z: TZ + 0.4, y: TY, yaw: -0.4, mode: f >= F.JOB ? 'beg' : 'stand', expr: 'happy' };
    if (f >= 1196) np = { x: HX + 0.25, z: HZ + 0.4, y: HY, yaw: 0.1, mode: 'beg', expr: 'happy', lift: 0.5 + 0.5 * Math.sin(f * 0.5) };
    if (ext || ex) np = { visible: false };
    MOUSE.set(f, np);
    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const body = (x, z, y = 0, h = 2.1) => [[x, y, z], [x, y + h, z]];
    const OT = [op.x ?? 0, op.z ?? 0];
    if (sh(0, 56)) {                          // 1. crackers puffed like pillows; Nibbles moved into one; Otto proud (wide)
      cam = K.fit([...body(-0.9, IZ - 0.5), [TX - 1.4, TY, TZ - 0.4], [TX + 1.4, TY + 0.6, TZ + 0.4]], { yaw: 78, pitch: 10, fov: 40, margin: 0.82, lift: 0.7 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(56, 108)) {                 // 2. Nibbles snuggles in his pillow (reaction)
      cam = { pos: [TX + 0.5, TY + 0.9, TZ + 1.6], look: [TX, TY + 0.3, TZ - 0.3], fov: 40 * K.push(u, 0.08) }; dof = { focus: 2.0, cinf: 12 };
    } else if (sh(108, 168)) {                // 3. Otto bins the hole roller; NO HOLES! poster (wide)
      cam = K.fit([...body(-0.9, IZ - 0.5), [-5.6, 0, IZ - 1.0], [-0.6, 3.2, IZ - 5.4], [TX + 1.4, TY, TZ]], { yaw: 72, pitch: 8, fov: 40, margin: 0.95, lift: 0.4 }); cam.fov *= K.punch(f, F.BANNED + 14, 0.08, 6);
    } else if (sh(168, 232)) {                // 4. "Holes are lazy!" — why do crackers have holes? (low wide)
      cam = K.fit([...body(-0.9, IZ - 0.5), [-0.6, 3.2, IZ - 5.4], [TX + 1.6, TY, TZ + 0.4]], { yaw: 105, pitch: 5, fov: 40, margin: 0.95, lift: 0.4 }); cam.fov *= K.punch(f, F.LAZY, 0.1, 6);
    } else if (sh(232, 300)) {                // 5. day one: the oven opens (hero prop, wide)
      cam = K.fit([[OX - 1.5, 0, OZ + 1], [OX + 1.5, 2.9, OZ + 1], ...body(-1.6, OZ + 2.0)], { yaw: lerp(70, 80, u), pitch: 8, fov: 40, margin: 1.1 });
    } else if (sh(300, 358)) {                // 6. round as hamburger buns — "fluffy" (wide)
      cam = K.fit([...body(-0.9, IZ - 0.4), [TX - 1.4, TY, TZ], [TX + 1.6, TY + 0.6, TZ + 0.4]], { yaw: 95, pitch: 8, fov: 40, margin: 0.95, lift: 0.4 }); cam.fov *= K.punch(f, F.FLUFFY, 0.08, 6);
    } else if (sh(358, 410)) {                // 7. day two: beach balls (wide, low)
      cam = K.fit([...body(-0.9, IZ - 0.5), [TX - 1.6, TY, TZ], [TX + 1.8, TY + 1.0, TZ + 0.5]], { yaw: 70, pitch: 4, fov: 40, margin: 0.95, lift: 0.4 }); cam.fov *= K.punch(f, F.BEACH, 0.12, 6);
    } else if (sh(410, 470)) {                // 8. one rolls out and chases the mailman (street, tracking wide)
      cam = K.fit([[mailX(f) + 1.2, 0, -3.3], [mailX(f), 2.2, -3.3], [ballX - 0.8, 0, -3.3]], { yaw: 82, pitch: 8, fov: 42, margin: 1.0, maxDist: 8.5 });
    } else if (sh(470, 528)) {                // 9. Nibbles furious (reaction)
      cam = { pos: [HX + 0.2, HY + 0.85, HZ + 2.3], look: [HX, HY + 0.3, HZ + 0.25], fov: 40 * K.push(u, 0.08) }; dof = { focus: 2.1, cinf: 12 };
    } else if (sh(528, 592)) {                // 10. his cracker house used the holes as windows (medium wide)
      cam = K.fit([[HX - 0.8, HY - 1.0, HZ], [HX + 0.8, HY + 0.8, HZ + 0.5], [TX + 1.4, TY, TZ]], { yaw: lerp(80, 100, u), pitch: 10, fov: 40, margin: 0.95, lift: 0.4 });
    } else if (sh(592, 640)) {                // 11. Otto stacks bricks on the oven door (wide)
      cam = K.fit([[OX - 1.5, 0, OZ + 1], [OX + 1.5, 2.9, OZ + 1], ...body(OT[0], OT[1]), [-6.6, 0, IZ - 2.6]], { yaw: 82, pitch: 8, fov: 40, margin: 0.95, lift: 0.4 });
    } else if (sh(640, 690)) {                // 12. the oven rumbles; "Holes are lazy!" (low wide)
      cam = K.fit([[OX - 1.5, 0, OZ + 1], [OX + 1.5, 3.0, OZ + 1], ...body(-1.0, OZ + 2.6)], { yaw: 108, pitch: 3, fov: 40, margin: 1.08 }); cam.fov *= K.push(u, 0.08); const s = K.shake(f, 660, 0.03, 30); cam.pos[0] += s[0]; cam.pos[1] += s[1];
    } else if (sh(690, 735)) {                // 13. the door blows: bricks + crackers fly (wide)
      cam = K.fit([[OX - 3, 0, OZ + 1], [OX + 3, 3.4, OZ + 4.5]], { yaw: 75, pitch: 10, fov: 42, margin: 1.0 }); cam.fov *= K.punch(f, F.BLEW, 0.14, 6); const s = K.shake(f, F.BLEW, 0.12, 14); cam.pos[0] += s[0]; cam.pos[1] += s[1];
    } else if (sh(735, 795)) {                // 14. four hundred crackers over Crumbleton like popcorn (street, high wide)
      cam = { pos: [lerp(-3, -1, u), lerp(8, 7, u), 4.6], look: [2, 2.0, -6], fov: 50 }; dof = { focus: 16, cinf: 3 }; cam.fov *= K.punch(f, F.POPCORN, 0.08, 6);
    } else if (sh(795, 834)) {                // 15. Otto flat on the floor, Nibbles on his chest: so what are the holes for? (reaction)
      cam = { pos: [-2.4, 2.3, OZ + 5.3], look: [-1.0, 0.5, OZ + 2.6], fov: 42 * K.push(u, 0.08) }; dof = { focus: 2.4, cinf: 12 };
    } else if (sh(834, 890)) {                // 16. x-ray: wet dough, water drops (explainer wide)
      cam = K.fit([[EXX - 1.3, 0.9, EXZ - 0.6], [EXX + 1.3, 2.4, EXZ + 0.6]], { yaw: 85, pitch: 12, fov: 40, margin: 1.15 });
    } else if (sh(890, 945)) {                // 17. water -> steam bubbles: the cracker puffs (steam wants out)
      cam = K.fit([[EXX - 1.3, 0.9, EXZ - 0.6], [EXX + 1.3, 2.4, EXZ + 0.6]], { yaw: 118, pitch: 24, fov: 40, margin: 1.1 }); cam.fov *= K.punch(f, F.OUT, 0.1, 6);
    } else if (sh(945, 1005)) {               // 18. the holes are tiny chimneys (steam jets)
      cam = K.fit([[EXX - 1.2, 1.0, EXZ - 0.5], [EXX + 1.2, 2.7, EXZ + 0.5]], { yaw: 100, pitch: 14, fov: 40, margin: 1.1 }); cam.fov *= K.push(u, 0.08);
    } else if (sh(1005, 1070)) {              // 19. flat and crisp (high angle)
      cam = K.fit([[EXX - 1.2, 1.0, EXZ - 0.5], [EXX + 1.2, 2.2, EXZ + 0.5]], { yaw: 75, pitch: 38, fov: 40, margin: 1.15 }); cam.fov *= K.punch(f, F.CRISP, 0.08, 6);
    } else if (sh(1070, 1132)) {              // 20. Otto puts the holes back: the roller (tracking wide)
      cam = K.fit([...body(op.x ?? 0, TZ - 0.95), [TX - 1.6, TY, TZ + 0.5], [TX + 1.6, TY, TZ + 0.5]], { yaw: lerp(80, 95, u), pitch: 12, fov: 40, margin: 0.95, lift: 0.4 });
    } else if (sh(1132, 1196)) {              // 21. "So I gave them a job" — HOLES AT WORK (wide)
      cam = K.fit([...body(-0.7, IZ - 0.3), [-0.6, 3.2, IZ - 5.4], [TX + 1.7, TY, TZ + 0.3]], { yaw: 78, pitch: 8, fov: 40, margin: 0.95, lift: 0.4 }); cam.fov *= K.punch(f, F.JOB, 0.1, 6);
    } else if (sh(1196, 1262)) {              // 22. Nibbles got his windows back (medium wide)
      cam = { pos: [lerp(HX - 0.6, HX - 0.2, u), HY + 1.0, HZ + 2.8], look: [HX, HY + 0.3, HZ], fov: 40 }; dof = { focus: 2.9, cinf: 8 };
    } else {                                  // 23. the mailman still runs past the bakery (street wide)
      cam = { pos: [lerp(-0.6, 0.6, u), 2.6, 4.6], look: [0, 2.3, -6], fov: 52 }; dof = { focus: 8, cinf: 3 };
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    if (!ext) K.steam(f, [OX + 0.8, 4.4, OZ - 0.3], { rate: 3, size: 0.6, dark: 0.15, rise: 2 });
    if (f >= 640 && f < F.BLEW && !ext) for (const dx of [-1.0, 1.0]) K.steam(f, [OX + dx, 1.4, OZ + 1.05], { rate: 6, size: 0.4, rise: 1.6, drift: [0, 0.5] });
    if (f >= F.BLEW && f < 735) { K.puff(f, F.BLEW, OX, OZ + 1.6, 12, 1.0, '#fff4e0'); K.steam(f, [OX, 1.3, OZ + 1.4], { rate: 14, size: 1.0, rise: 2.5, drift: [0, 2] }); }
    if (f >= 735 && f < 795) for (let k = 0; k < 4; k++) K.puff(f, 750 + k * 9, -6 + k * 5, -3 + (k % 2) * 4, 8, 0.6, '#f2dca8');
    if (ex && f >= 945) GHOLES.forEach(([hx, hz], k) => K.steam(f, [EXX + hx, EXY + 0.12, EXZ + hz], { rate: 7, size: 0.22, rise: 1.4, life: 30, seed: k + 5, drift: [0, 0] }));
    if (ex && f >= F.STEAM && f < 945) K.steam(f, [EXX + 0.8, EXY + 0.3, EXZ], { rate: 3, size: 0.3, rise: 0.4, life: 20 });
    if (f >= 405 && f < 470) K.puff(f, 430, mailX(430) - 2, -3.3, 6, 0.5);
    K.mist(f, 826, 16); K.mist(f, 1062, 16);
    K.badge(f, F.BANNED, 'NO HOLES!', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 166 });
    K.badge(f, F.WHY, 'WHY THE HOLES?', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 230 });
    K.badge(f, F.DAY1, 'DAY 1: BUNS', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: 356 });
    K.badge(f, F.DAY2, 'DAY 2: BEACH BALLS', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: 468 });
    K.badge(f, F.FOUR, 'NOON: 400 CRACKERS', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 793 });
    K.badge(f, F.WATER, 'WATER → STEAM', { sx: 0.5, sy: 0.2 }, { icon: 'drop', f1: 943 });
    K.badge(f, F.CHIM, 'HOLES = TINY CHIMNEYS', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1060 });
    K.badge(f, F.JOB, 'HOLES: HIRED', { sx: 0.5, sy: 0.2 }, { style: 'stamp', size: 1.15, f1: 1194 });
    const L = ext ? K.light('golden', { az: 75, el: 32, shadowExt: 26 }) : K.light('interior', { az: 80, el: 48, shadowExt: 16, fog: '#f0e0c8', fogNear: 30, fogFar: 120, exposure: 1.3 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
