// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Every Tire Is Black" — invented story, engine: The Complaint Desk (SCRIPTS.md §000).
// Doris runs the Tire Hut on hot Route 9. Every complaint gets "Say no more!": she bakes pink and mint tires (cupcakes),
// they go soft like gum at 104 degrees, Mrs. Ortiz paints a pink stripe across town, tiny wheel umbrellas, mint tires pop,
// Mr. Plum drives on bare rims -> x-ray: carbon specks = gummy bear in armor, black = built-in sunscreen -> back to black;
// last complaint: Biscuit the dog sleeps in Mr. Plum's spare tire. Doris said no more.
import { TOTAL, LINES, wf } from './pinktires_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

// tight "see everything" framing: like K.fit but measures the points in the camera's own axes (depth spread no longer pushes the camera away)
const fitT = (K, pts, o = {}) => { const W = 1080, H = 1920, fov = o.fov ?? 42, m = o.margin ?? 1.2, rx = (d) => d * Math.PI / 180;
  const vf = Math.tan(rx(fov) / 2), hf = vf * W / H, a = rx(o.yaw ?? 90), pt = rx(o.pitch ?? 8);
  const mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9]; for (const p of pts) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], p[k]); mx[k] = Math.max(mx[k], p[k]); }
  const c = [(mn[0] + mx[0]) / 2, (mn[1] + mx[1]) / 2 + (o.lift || 0), (mn[2] + mx[2]) / 2];
  const fw = [-Math.cos(a) * Math.cos(pt), -Math.sin(pt), -Math.sin(a) * Math.cos(pt)];             // camera forward
  const rt = [-fw[2], 0, fw[0]]; const rl = Math.hypot(rt[0], rt[2]); rt[0] /= rl; rt[2] /= rl;
  const up = [rt[1] * fw[2] - rt[2] * fw[1], rt[2] * fw[0] - rt[0] * fw[2], rt[0] * fw[1] - rt[1] * fw[0]];
  let d = 2; for (const p of pts) { const v = [p[0] - c[0], p[1] - c[1], p[2] - c[2]]; const x = v[0] * rt[0] + v[2] * rt[2], y = v[0] * up[0] + v[1] * up[1] + v[2] * up[2], z = v[0] * fw[0] + v[1] * fw[1] + v[2] * fw[2];
    d = Math.max(d, Math.abs(x) * m / hf - z, Math.abs(y) * m / vf - z); }
  d = Math.min(d, o.maxDist ?? 30);
  return { pos: [c[0] - fw[0] * d, c[1] - fw[1] * d, c[2] - fw[2] * d], look: c, fov }; };
const CX = 200;                              // cutaway stage (x-ray tire, gummy bear, sun)
let THREE, F = {}, DORIS, PLUM, ORTIZ, DOG, PCAR, OCAR, PARKED, CAKES = [], MINTS = [], BLACKS, STRIPE, UMBS = [], SPARE, OVEN_DOOR, OVEN_TIRES = [], NOTE, BIGT, SPECKS, HOLO, BEAR, SUNB, BOTTLE, PINKT, BLACKT, RAYS = [], BOARD2, BOARD0, THERMO, EXTRAS = [];

function tire(K, color, r = 0.36, tube = 0.13, parent = K.scene, rough = 0.55) {
  const g = new THREE.Group(); parent.add(g); const m = K.paint(color, { rough, coat: 0.4 });
  const t = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 14, 36), m); g.add(t);
  for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; const b = K.rbox(0.07, 0.05, tube * 1.5, 0.015, m, Math.cos(a) * (r + tube * 0.9), Math.sin(a) * (r + tube * 0.9), 0, g); b.rotation.z = a; }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.55, r * 0.55, 0.12, 24), K.chrome()); hub.rotation.x = Math.PI / 2; g.add(hub);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return g;
}
function cactus(K, x, z, h, parent) { const m = K.mat('grime', '#4a8a3a', { amt: 0.4 }); K.cyl(0.22, 0.25, h, m, x, 0, z, parent, 12); K.sphere(0.22, m, x, h, z, parent);
  for (const s of [-1, 1]) { const y = h * (0.45 + 0.1 * s); K.cyl(0.13, 0.13, 0.5, m, x + s * 0.42, y, z, parent, 10); K.sphere(0.13, m, x + s * 0.42, y + 0.5, z, parent); const a = K.cyl(0.11, 0.11, 0.4, m, x + s * 0.22, y, z, parent, 10); a.rotation.z = s * Math.PI / 2; } }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { PANCAKE: wf(0, 'pancakes'), BOX: wf(1, 'complaint'), BORING: wf(1, 'boring'), WHY: wf(1, 'why'), SAY: wf(2, 'say'), BAKED: wf(2, 'baked'), PINK: wf(2, 'pink'), CUPCAKES: wf(3, 'cupcakes'), BISCUIT: wf(3, 'biscuit'), BED: wf(3, 'bed'),
      HOT: wf(4, '104'), SOFT: wf(4, 'soft'), GUM: wf(4, 'gum'), DROVE: wf(5, 'drove'), STRIPE: wf(5, 'stripe'), TOWN: wf(5, 'town'), MELT: wf(6, 'melting'), SAY2: wf(6, 'say'), UMB: wf(6, 'umbrella'),
      POPPED: wf(7, 'popped'), RIMS: wf(7, 'rims'), SPARKS: wf(7, 'sparks'), WHAT: wf(8, 'what'), SOOT: wf(9, 'soot'), CARBON: wf(9, 'carbon'), TOUGH: wf(9, 'tougher'), GUMMY: wf(9, 'gummy'), ARMOR: wf(9, 'armor'),
      BLOCKS: wf(10, 'blocks'), COOKS: wf(10, 'cooks'), SUNSCREEN: wf(10, 'sunscreen'), BACK: wf(11, 'back'), LAST: wf(11, 'last'), SLEEP: wf(12, 'sleeping'), SPARE: wf(12, 'spare'), NOMORE: wf(12, 'said') };
    // ================= desert, Route 9, the Tire Hut =================
    const G = K.group();
    const ground = new THREE.PlaneGeometry(400, 200, 100, 50); ground.rotateX(-Math.PI / 2); const GP = ground.attributes.position;
    for (let i = 0; i < GP.count; i++) { const x = GP.getX(i), z = GP.getZ(i); GP.setY(i, -0.02 + (z < -25 ? Math.min(5, (-25 - z) * 0.12) * (0.5 + 0.5 * Math.sin(x * 0.05)) : 0)); }
    ground.computeVertexNormals(); K.add(ground, K.mat('dirt', '#d8a868', { detail: 1.2, amt: 0.5 }), 0, 0, 0, G);
    K.slab(-120, 160, 0, 0.03, -3.2, 3.2, K.mat('grime', '#4a4a50', { amt: 0.3 }), G, false);                         // Route 9
    for (let x = -118; x < 160; x += 4) K.slab(x, x + 2, 0.03, 0.035, -0.08, 0.08, K.paint('#f2c230', { rough: 0.6 }), G, false);
    for (const z of [-3.0, 3.0]) K.slab(-120, 160, 0.03, 0.035, z - 0.06, z + 0.06, K.paint('#f4f2ee', { rough: 0.6 }), G, false);
    K.slab(-9, 9, 0.0, 0.05, -10, -3.2, K.mat('rock', '#c8b898', { detail: 0.7 }), G, false);                             // forecourt
    const hut = S.building({ w: 11, d: 6, floors: 1, seed: 4, color: '#f2d8a8', kind: 'plaster', gable: 'flat', shop: "DORIS' TIRE HUT", awning: ['#e8302a', '#f4efe4'], shutters: '#2a8a9a', flowers: true }); hut.position.set(0, 0.05, -13.2);
    // complaint desk, complaint box, oven, thermometer sign, Route 9 sign, cacti, mesas, a little town down the road
    K.rbox(2.6, 1.0, 0.8, 0.06, K.paint('#2a8a9a', { rough: 0.35 }), -1.0, 0.55, -6.6, G); K.rbox(2.8, 0.08, 1.0, 0.03, K.gold(), -1.0, 1.08, -6.6, G);
    const dsk = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.45), S.textMat('COMPLAINT DESK', { bg: '#f4efe4', fg: '#c0392b', w: 768, h: 160 })); dsk.position.set(-1.0, 0.62, -6.19); G.add(dsk);
    K.cyl(0.05, 0.05, 1.1, K.paint('#3a3a40'), -3.6, 0.05, -5.2, G, 8); K.rbox(0.6, 0.5, 0.45, 0.05, K.paint('#c0392b', { rough: 0.3 }), -3.6, 1.4, -5.2, G); K.rbox(0.36, 0.03, 0.08, 0.01, K.paint('#1a1a1a'), -3.6, 1.66, -5.2, G);
    const cb = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.18), S.textMat('COMPLAINTS', { bg: '#f4efe4', fg: '#1a1a1a', w: 512, h: 128, border: false })); cb.position.set(-3.6, 1.42, -4.97); G.add(cb);
    K.rbox(1.8, 1.9, 1.3, 0.12, K.chrome({ color: '#c8ccd2' }), 3.6, 1.0, -7.4, G); K.rbox(1.0, 0.7, 0.05, 0.05, K.paint('#1a1a1a', { rough: 0.2 }), 3.6, 1.15, -6.73, G);
    const ol = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.3), S.textMat('TIRE OVEN', { bg: '#e8302a', fg: '#ffffff', w: 512, h: 112, border: false })); ol.position.set(3.6, 1.78, -6.73); G.add(ol);
    K.steam; for (const x of [3.1, 4.1]) K.cyl(0.08, 0.08, 0.6, K.paint('#3a3a40'), x, 1.95, -7.6, G, 10);
    THERMO = new THREE.Group(); THERMO.position.set(8.8, 0.05, -5.0); sc.add(THERMO); K.cyl(0.07, 0.07, 3.0, K.paint('#3a3a40'), 0, 0, 0, THERMO, 8);
    K.rbox(1.2, 1.0, 0.12, 0.08, K.paint('#f4efe4', { rough: 0.4 }), 0, 3.3, 0, THERMO);
    const tm1 = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.85), S.textMat('104°F', { bg: '#f4efe4', fg: '#e8302a', w: 512, h: 400, border: false })); tm1.position.set(0, 3.3, 0.065); THERMO.add(tm1);
    const r9 = S.sign('arrow'); r9.position.set(-8, 0, -3.8);
    const rb = S.board('ROUTE 9|DUSTVILLE 2 MI', 2.2, 1.1, { frame: '#2a6a3a', bg: '#2a6a3a', fg: '#ffffff' }); rb.position.set(-10.5, 0, -4.6);
    for (let k = 0; k < 16; k++) cactus(K, -40 + k * 6 + hash(k) * 3, -8 - hash(k + 3) * 14 + (Math.abs(-40 + k * 6) < 8 ? -6 : 0), 1.6 + hash(k + 5) * 1.6, G);
    for (let k = 0; k < 10; k++) cactus(K, -40 + k * 9 + hash(k + 20) * 3, 16 + hash(k + 23) * 10, 1.4 + hash(k + 25) * 1.4, G);
    for (let k = 0; k < 7; k++) { const m = K.mat('rock', ['#c86a3a', '#b85a32', '#d07a48'][k % 3], { detail: 2 }); const w = 14 + hash(k) * 16; K.slab(-80 + k * 28, -80 + k * 28 + w, 0, 7 + hash(k + 1) * 7, -60 - hash(k + 2) * 20, -48 - hash(k + 2) * 20, m, G); }
    for (let k = 0; k < 40; k++) { const r = new THREE.Mesh(new THREE.DodecahedronGeometry(0.15 + hash(k) * 0.25, 0), K.mat('rock', '#a8885a')); r.position.set(-30 + hash(k + 1) * 60, 0.05, (hash(k + 2) > 0.5 ? 1 : -1) * (4 + hash(k + 3) * 8)); r.castShadow = true; G.add(r); }
    for (let k = 0; k < 6; k++) { const b = S.building({ w: 5 + (k % 2) * 2, d: 5, floors: 1 + (k % 2), seed: 60 + k, color: ['#f2d0b0', '#e8c8d8', '#d8e8c8'][k % 3], kind: 'plaster', gable: 'flat', shop: ['DINER', 'MOTEL', null, 'GAS', null, 'POST'][k], awning: k % 2 ? null : ['#2a8a9a', '#f4efe4'] }); b.position.set(38 + k * 9, 0, -9); }
    // black tire stacks (before + after) along the hut
    BLACKS = K.group(); for (let s = 0; s < 4; s++) for (let k = 0; k < 4; k++) { const t = tire(K, '#222226', 0.36, 0.13, BLACKS); t.rotation.x = Math.PI / 2; t.position.set(-7 + s * 1.15, 0.2 + k * 0.27, -8.4 + (s % 2) * 0.3); }
    // pink + mint tires on golden cake stands ("cupcakes") on a long table
    K.rbox(5.2, 0.9, 1.0, 0.05, K.mat('wood', '#a8703a'), 4.2, 0.5, -3.8, G);
    for (let k = 0; k < 6; k++) { const x = 2.1 + k * 0.85; K.cyl(0.18, 0.08, 0.2, K.gold(), x, 0.95, -3.8, G, 16); const p = new THREE.Group(); p.position.set(x, 1.15, -3.8); sc.add(p);
      const t = tire(K, k % 2 ? '#7ae0c0' : '#f28ab8', 0.25, 0.1, p, 0.4); t.rotation.x = Math.PI / 2; t.position.y = 0.12; K.sphere(0.06, K.paint('#d8202a', { rough: 0.2 }), 0, 0.26, 0, p); (k % 2 ? MINTS : CAKES).push(p); }
    const nb = S.board('NEW!|PINK & MINT', 1.6, 0.8, { frame: '#e8302a' }); nb.position.set(7.6, 0, -4.4); nb.scale.setScalar(0.8);
    for (let k = 0; k < 3; k++) { const t = tire(K, '#f28ab8', 0.36, 0.13); t.position.set(3.2 + k * 0.4, 0.3, -6.5); OVEN_TIRES.push(t); }
    OVEN_DOOR = K.rbox(1.0, 0.7, 0.06, 0.05, K.paint('#3a3a40', { rough: 0.2 }), 3.6, 1.15, -6.7, sc);
    BOARD2 = S.board('COMPLAINTS|THIS WEEK: 2', 1.8, 0.9, { frame: '#c0392b' }); BOARD2.position.set(-5.6, 0, -6.3); BOARD2.rotation.y = 0.3;
    BOARD0 = S.board('COMPLAINTS|THIS WEEK: 0', 1.8, 0.9, { frame: '#2a8a3a' }); BOARD0.position.set(-5.6, 0, -6.3); BOARD0.rotation.y = 0.3;
    S.bake(G);
    // ================= cars: Mr. Plum (pancakes -> rims -> black), Mrs. Ortiz (pink + umbrellas), a parked pickup =================
    PCAR = S.car({ kind: 'hatch', color: '#7a3a9a', plate: 'PLUM' }); OCAR = S.car({ kind: 'hatch', color: '#2ab8b0', plate: 'ORTIZ' }); PARKED = S.car({ kind: 'van', color: '#f2c230', plate: 'DUST-1' }); PARKED.g.position.set(-12, 0, -6.5); PARKED.g.rotation.y = 0.2;
    const tm = (c) => K.paint(c, { rough: 0.5, coat: 0.3 });
    PCAR.tw = tm('#f4f2ee'); PCAR.tb = tm('#202024'); OCAR.tp = tm('#f28ab8'); for (const w of OCAR.wheels) w.children[0].material = OCAR.tp;
    for (const w of OCAR.wheels) { const u = new THREE.Group(); sc.add(u); K.cyl(0.012, 0.012, 0.5, K.chrome(), 0, 0, 0, u, 6); const c = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.16, 16), K.paint(['#e8302a', '#f2c230', '#2a8ae8', '#f28ab8'][UMBS.length], { rough: 0.3 })); c.position.y = 0.55; u.add(c); u.userData.w = w; UMBS.push(u); }
    STRIPE = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.35), K.paint('#f28ab8', { rough: 0.5 })); STRIPE.rotation.x = -Math.PI / 2; STRIPE.position.y = 0.045; sc.add(STRIPE);
    SPARE = tire(K, '#202024', 0.42, 0.16); SPARE.rotation.x = Math.PI / 2;
    NOTE = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.35), S.textMat('BLACK IS|BORING!', { bg: '#fdf6e4', fg: '#1a1a1a', w: 512, h: 360 })); sc.add(NOTE);
    // ================= cutaway: x-ray tire with carbon specks, armored gummy bear, the sun, sunscreen =================
    const CG = K.group(); K.slab(CX - 30, CX + 30, -0.05, 0, -25, 25, K.mat('dirt', '#d8a868', { detail: 1.2 }), CG, false);
    for (let k = 0; k < 8; k++) cactus(K, CX - 14 + k * 4 + hash(k + 40), -6 - hash(k + 41) * 6, 1.5 + hash(k + 42), CG);
    for (let k = 0; k < 4; k++) { const m = K.mat('rock', '#c86a3a', { detail: 2 }); K.slab(CX - 40 + k * 22, CX - 26 + k * 22, 0, 6 + k, -40, -30, m, CG); } S.bake(CG);
    BIGT = new THREE.Group(); BIGT.position.set(CX, 2.1, 0); sc.add(BIGT);
    const bt = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.55, 20, 48), K.holo('#36e2ff', { strength: 0.6 })); bt.userData.ndSkip = true; BIGT.add(bt);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.56, 8, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color('#36e2ff').multiplyScalar(1.6), wireframe: true, transparent: true, opacity: 0.25 })); rim.userData.ndSkip = true; BIGT.add(rim);
    SPECKS = new THREE.Group(); BIGT.add(SPECKS); const sg = new THREE.SphereGeometry(0.05, 8, 6), smt = new THREE.MeshBasicMaterial({ color: '#0a0a0c' });
    for (let k = 0; k < 260; k++) { const a = hash(k) * Math.PI * 2, b = hash(k + 500) * Math.PI * 2, rr = hash(k + 900) * 0.45; const s = new THREE.Mesh(sg, smt); s.position.set(Math.cos(a) * (1.4 + rr * Math.cos(b)), Math.sin(a) * (1.4 + rr * Math.cos(b)), rr * Math.sin(b)); SPECKS.add(s); }
    for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; const lnk = K.trace([[Math.cos(a) * 1.0, Math.sin(a) * 1.0, 0.6], [Math.cos(a + 0.5) * 1.9, Math.sin(a + 0.5) * 1.9, 0.6]], { color: '#fff3b0', r: 0.025, parent: BIGT }); RAYS.push(lnk); }
    BEAR = new THREE.Group(); BEAR.position.set(CX + 1.9, 0, 3.0); sc.add(BEAR); const gm = new THREE.MeshPhysicalMaterial({ color: '#e83a3a', roughness: 0.15, transmission: 0.3, clearcoat: 1, thickness: 0.5 });
    K.sphere(0.5, gm, 0, 0.6, 0, BEAR, 1, 1.1, 0.85); K.sphere(0.36, gm, 0, 1.35, 0, BEAR); for (const s of [-1, 1]) { K.sphere(0.13, gm, s * 0.25, 1.65, 0, BEAR); K.sphere(0.16, gm, s * 0.45, 0.75, 0.1, BEAR); K.sphere(0.18, gm, s * 0.25, 0.15, 0.1, BEAR); }
    const ar = K.chrome(); K.sphere(0.38, ar, 0, 1.45, 0, BEAR, 1, 0.75, 1); K.rbox(0.7, 0.55, 0.3, 0.12, ar, 0, 0.7, 0.3, BEAR); K.rbox(0.08, 0.5, 0.06, 0.02, K.gold(), 0, 0.7, 0.46, BEAR);
    for (const s of [-1, 1]) K.sphere(0.05, K.paint('#1a1a1a'), s * 0.12, 1.33, 0.32, BEAR); const sh = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.06, 24), K.gold()); sh.rotation.z = Math.PI / 2; sh.position.set(-0.62, 0.75, 0.2); BEAR.add(sh);
    BEAR.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    SUNB = new THREE.Mesh(new THREE.SphereGeometry(1.0, 24, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd84a').multiplyScalar(2.2) })); SUNB.position.set(CX - 3.5, 6.5, -4); SUNB.userData.ndSkip = true; sc.add(SUNB);
    PINKT = tire(K, '#f28ab8', 0.6, 0.24); PINKT.position.set(CX - 1.6, 0.85, 1.0); BLACKT = tire(K, '#222226', 0.6, 0.24); BLACKT.position.set(CX + 1.6, 0.85, 1.0);
    BOTTLE = new THREE.Group(); BOTTLE.position.set(CX + 0.1, 0, 2.2); sc.add(BOTTLE); K.rbox(0.7, 1.3, 0.4, 0.15, K.paint('#f2a830', { rough: 0.25 }), 0, 0.65, 0, BOTTLE); K.cyl(0.12, 0.15, 0.25, K.paint('#f4f2ee'), 0, 1.3, 0, BOTTLE, 16);
    const bl = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.7), S.textMat('TIRE|SPF 100', { bg: '#fff4d8', fg: '#e8302a', w: 360, h: 420 })); bl.position.set(0, 0.65, 0.205); BOTTLE.add(bl);
    // ================= characters =================
    DORIS = K.stick({ jacket: '#2a8a9a', pants: '#2a4a6a', hat: 'cap', hatColor: '#e8302a', hairStyle: 'ponytail', hair: '#e8a040', gloves: '#f2c230', belt: '#3a2418', pockets: true, vest: '#f4efe4' }, { key: 'doris' });
    PLUM = K.stick({ jacket: '#7a3a9a', pants: '#3a2a4a', hat: 'tophat', hatColor: '#3a2a4a', moustache: '#d8d4cc', bowtie: '#f2c230', glasses: true, build: 'stout' }, { key: 'plum' });
    ORTIZ = K.stick({ dress: '#2ab8b0', jacket: '#2ab8b0', pants: '#2a3a4a', hairStyle: 'bun', hair: '#3a2418', glasses: '#e8302a', scarf: '#f28ab8', collar: '#ffffff' }, { key: 'ortiz' });
    DOG = K.animal('dog', { color: '#d8a060', seed: 3 });
    EXTRAS = S.extras(4, { x0: 36, len: 30, z: -5.5, spread: 1.2, seed: 21 });
    K.addClouds(6, 700, 160);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s);
    const cut = f >= 905 && f < 1155;
    // ---------- Mr. Plum's car ----------
    let pc = { x: 0, z: -1.6, yaw: 0, y: 0, vis: !cut, mode: 'black', spin: 0 };
    if (f < 116) { const x = lerp(-5.5, -1.5, sm(0, 70, f)); pc = { ...pc, x, mode: 'pancake', spin: 0 }; }
    else if (f < 212) pc = { ...pc, x: -1.5, mode: 'pancake' };
    else if (f >= 762 && f < 865) { const x = lerp(-16, 6, clamp((f - 762) / 103, 0, 1)); pc = { ...pc, x, mode: 'rims', spin: x }; }
    else if (f >= 1159) pc = { ...pc, x: -1.2, z: -1.6, mode: 'black' };
    else pc.vis = false;
    PCAR.g.visible = pc.vis; PCAR.g.position.set(pc.x, pc.mode === 'pancake' ? -0.17 : pc.mode === 'rims' ? -0.16 + 0.02 * Math.sin(f * 1.7) : 0, pc.z); PCAR.g.rotation.y = pc.yaw;
    for (const w of PCAR.wheels) { const t = w.children[0]; t.visible = pc.mode !== 'rims'; t.material = pc.mode === 'pancake' ? PCAR.tw : PCAR.tb; t.scale.set(pc.mode === 'pancake' ? 1.15 : 1, pc.mode === 'pancake' ? 0.45 : 1, 1); t.position.y = pc.mode === 'pancake' ? -0.03 : 0; w.rotation.z = pc.mode === 'pancake' ? 0 : -pc.spin / 0.36; }
    SPARE.visible = !cut && f >= 1159; SPARE.position.set(-4.4, 0.17, -2.4);
    // ---------- Mrs. Ortiz's car: pink tires, drives off leaving a stripe, comes back with umbrellas ----------
    let oc = null;
    if (f >= 518 && f < 613) { const x = lerp(-2, 34, sm(522, 612, f)); oc = { x, z: -1.4, yaw: 0, spin: x }; STRIPE.visible = true; STRIPE.scale.x = Math.max(0.01, x - 2 + 2); STRIPE.position.set((-2 - 1.5 + x - 1.5) / 2, 0.045, -1.4); }
    else { STRIPE.visible = f >= 613 && f < 905; STRIPE.scale.x = 36; STRIPE.position.set(14.5, 0.045, -1.4); }
    if (f >= 389 && f < 518) oc = { x: -2, z: -1.4, yaw: 0, spin: 0 };
    if (f >= 613 && f < 788) oc = { x: 1.0, z: -1.6, yaw: 0, spin: 0 };
    OCAR.g.visible = !!oc && !cut; if (oc) { OCAR.g.position.set(oc.x, 0, oc.z); OCAR.g.rotation.y = oc.yaw; for (const w of OCAR.wheels) { w.rotation.z = -oc.spin / 0.36; w.children[0].scale.set(1, f >= F.SOFT && f < 613 ? 1 - 0.15 * sm(F.SOFT, F.GUM, f) : 1, 1); } }
    UMBS.forEach((u, k) => { const on = oc && f >= F.UMB - 14 && f < 788; u.visible = !!on; if (on) { const w = u.userData.w; w.updateMatrixWorld(true); const p = new THREE.Vector3(); w.getWorldPosition(p); u.position.set(p.x, p.y + 0.25 + 0.3 * (1 - sm(F.UMB - 14 + k * 3, F.UMB - 6 + k * 3, f)), p.z + (p.z > oc.z ? 0.25 : -0.25)); u.scale.setScalar(sm(F.UMB - 14 + k * 3, F.UMB - 6 + k * 3, f) + 0.001); u.rotation.z = 0.15 * Math.sin(f * 0.2 + k); } });
    PARKED.g.visible = !cut;
    // ---------- shop props ----------
    const gum = sm(F.SOFT - 2, F.GUM + 8, f);
    CAKES.forEach((p, k) => { p.visible = f >= F.BAKED && f < 762 + 300; p.scale.set(1 + 0.35 * gum * (f < 613 ? 1 : 0.6), 1 - 0.55 * gum * (f < 613 ? 1 : 0.6), 1 + 0.35 * gum); });
    MINTS.forEach((p, k) => { const pf = F.POPPED + k * 6; p.visible = f >= F.BAKED && f < pf + 2; p.scale.setScalar(1 + 0.4 * sm(pf - 6, pf + 2, f)); });
    BLACKS.visible = !cut && (f < F.SAY || f >= 1155); BOARD2.visible = f < 1155; BOARD0.visible = f >= 1155;
    OVEN_TIRES.forEach((t, k) => { t.visible = f >= F.BAKED - 4 && f < 303; t.position.set(3.0 + k * 0.6, 0.38, -6.4 + 1.8 * sm(F.BAKED + k * 5, F.BAKED + 20 + k * 5, f)); t.rotation.z = -sm(F.BAKED + k * 5, F.BAKED + 20 + k * 5, f) * 6; });
    OVEN_DOOR.rotation.x = -1.4 * sm(F.BAKED - 8, F.BAKED, f) * (f < 303 ? 1 : 0); OVEN_DOOR.position.y = 1.15 - 0.3 * sm(F.BAKED - 8, F.BAKED, f) * (f < 303 ? 1 : 0); OVEN_DOOR.position.z = -6.7 + 0.3 * sm(F.BAKED - 8, F.BAKED, f) * (f < 303 ? 1 : 0);
    NOTE.visible = f >= 116 && f < 212; NOTE.position.set(-3.6, lerp(1.6, 2.15, sm(F.BOX, F.BOX + 10, f)), -4.9); NOTE.rotation.z = 0.08 * Math.sin(f * 0.3);
    // ---------- characters ----------
    let dp = { x: -1.0, z: -5.6, yaw: 0 };
    if (f >= 212 && f < 303) dp = { x: 2.2, z: -5.4, yaw: 0.6 };
    if (f >= 303 && f < 518) dp = { x: 1.6, z: -2.9, yaw: 0.5 };
    if (f >= 762 && f < 865) dp = { x: 1.6, z: -2.9, yaw: 0.3 };
    if (f >= 865 && f < 905) dp = { x: 0.2, z: -3.0, yaw: 0.2 };
    if (f >= 1155 && f < 1229) { const W = K.walkPath(f, 1160, [[-6.5, -5.6], [-3.0, -3.6]], 1.1); dp = { x: W.x, z: W.z, yaw: W.yaw }; }
    if (f >= 1229) dp = { x: -1.6, z: -4.4, yaw: -0.5 };
    const dk = [[0, 'shock', { expr: 'shock' }], [F.PANCAKE, 'facepalm', { expr: 'pained' }], [116, 'read', { expr: 'confused', item: 'paper' }], [F.WHY - 4, 'shrug', { expr: 'confused' }],
      [F.SAY - 4, 'cheer', { expr: 'excited', talk: true }], [F.BAKED, 'point', { expr: 'grin' }], [303, 'show', { expr: 'proud' }], [F.HOT - 4, 'ears', { expr: 'nervous', sweat: true }], [F.SOFT, 'shock', { expr: 'shock' }],
      [613, 'idle', { expr: 'nervous' }], [F.SAY2 - 4, 'cheer', { expr: 'excited', talk: true }], [F.UMB, 'point', { expr: 'proud' }], [762, 'panic', { expr: 'scared' }], [F.RIMS, 'facepalm', { expr: 'pained' }],
      [865, 'think', { expr: 'confused' }], [1155, 'walk', { expr: 'smile' }], [1200, 'hips', { expr: 'proud' }], [F.LAST - 2, 'shock', { expr: 'confused' }], [1229, 'cross', { expr: 'deadpan' }], [F.NOMORE, 'shrug', { expr: 'deadpan' }]];
    DORIS.set(T.act(f, dk, { seed: 2, blink: blink(2), phase: (f / 20) % 1 }), { ...dp, visible: !cut && !(f >= 518 && f < 613) });
    let pp = { visible: false };
    if (f < 212 && f >= 60) pp = { x: 0.9, z: -0.2, yaw: -0.5 };
    if (f >= 762 && f < 865) pp = { x: pc.x + 0.3, y: 0.35, z: -1.25, yaw: Math.PI / 2, seat: 0.45 };
    if (f >= 1229) pp = { x: -4.0, z: -3.6, yaw: 0.9 };
    const pk = [[0, 'angry', { expr: 'angry' }], [F.PANCAKE, 'pointDown', { expr: 'angry' }], [116, 'cross', { expr: 'stern' }], [762, 'sit', { expr: 'scared', sweat: true, shake: 1 }], [1229, 'pointDown', { expr: 'confused', talk: true }], [F.NOMORE, 'shrug', { expr: 'sad' }]];
    PLUM.set(T.act(f, pk, { seed: 5, blink: blink(5) }), pp);
    let op = { visible: false };
    if (f >= 389 && f < 518) op = { x: 6.4, z: -2.7, yaw: -0.5 };
    if (f >= 613 && f < 762) op = { x: -2.4, z: -3.6, yaw: Math.PI - 0.6 };
    const ok = [[389, 'show', { expr: 'grin' }], [F.SOFT, 'shock', { expr: 'shock' }], [613, 'angry', { expr: 'yell', talk: true }], [F.SAY2, 'cross', { expr: 'stern' }], [F.UMB + 6, 'facepalm', { expr: 'pained' }]];
    ORTIZ.set(T.act(f, ok, { seed: 7, blink: blink(7) }), op);
    // Biscuit: wants a tire bed
    let dg = { visible: false };
    if (f < 303) dg = { x: 0.4, z: -5.6, yaw: 0.3, mode: f < 60 ? 'jump' : 'sit', expr: 'shock' };
    else if (f < 389) dg = { x: lerp(1.8, 3.8, sm(F.BISCUIT, F.BED, f)), y: sm(F.BISCUIT, F.BED, f) * 0.95, z: lerp(-2.8, -3.5, sm(F.BISCUIT, F.BED, f)), yaw: -0.4, mode: f > F.BED ? 'beg' : 'walk', expr: 'happy' };
    else if (f < 518) dg = { x: 3.0, z: -2.6, yaw: -0.2, mode: f > F.SOFT ? 'sit' : 'wag', expr: f > F.GUM ? 'sad' : 'happy' };
    else if (f >= 613 && f < 762) dg = { x: 0.6, z: -4.6, yaw: 0.4, mode: 'sit', expr: 'neutral' };
    else if (f >= 762 && f < 905) dg = { x: 2.6, z: -2.6, yaw: 0, mode: f < 865 ? 'jump' : 'sit', expr: f < 865 ? 'shock' : 'neutral' };
    else if (f >= 1155) dg = { x: f < 1229 ? -5.2 : -4.4, z: f < 1229 ? -4.6 : -2.4, y: f < 1229 ? 0 : 0.12, yaw: 0.5, mode: f < 1229 ? 'wag' : 'sleep', expr: f < 1229 ? 'happy' : 'sleepy' };
    DOG.set(f, dg);
    K.set.extrasFrame(f, EXTRAS, T); for (const e of EXTRAS) e.r.root.visible = !cut;
    // cutaway objects
    BIGT.rotation.y = 0.5 + 0.2 * Math.sin(f * 0.02); BIGT.rotation.z = f * 0.01; SPECKS.visible = f >= F.CARBON - 6;
    SPECKS.scale.setScalar(1); RAYS.forEach((r, k) => r.show(f >= F.TOUGH - 4 && f < 1046 ? sm(F.TOUGH - 4 + k * 3, F.TOUGH + 10 + k * 3, f) : 0));
    BEAR.visible = f >= F.GUMMY - 6 && f < 1046; BEAR.scale.setScalar(2.0 * sm(F.GUMMY - 6, F.GUMMY + 4, f) + 0.001); BEAR.position.y = Math.abs(Math.sin(f * 0.25)) * 0.15 * (f > F.ARMOR ? 1 : 0);
    BIGT.visible = f < 1046; PINKT.visible = BLACKT.visible = SUNB.visible = f >= 1046; BOTTLE.visible = f >= F.SUNSCREEN - 6; BOTTLE.scale.setScalar(sm(F.SUNSCREEN - 6, F.SUNSCREEN + 4, f) + 0.001);
    const cook = sm(F.COOKS - 6, F.COOKS + 20, f); PINKT.scale.set(1 + 0.3 * cook, 1 - 0.45 * cook, 1 + 0.2 * cook); PINKT.position.y = 0.85 - 0.3 * cook; PINKT.rotation.y = 0.5; BLACKT.rotation.y = -0.5;

    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const L = K.light('day', { az: 70, el: 40, shadowExt: 26 }), LG = K.light('golden', { az: 75, el: 26 });
    const body = (x, z, y = 0) => [[x, y, z], [x, y + 2.0, z]];
    let light = L;
    if (sh(0, 60)) {                         // 1. Mr. Plum's car scrapes in on pancake tires, sparks; Doris + Biscuit at the hut
      cam = fitT(K, [[pc.x - 2, 0, -1.6], [pc.x + 2, 1.6, -1.6], [-1, 0, -5.6], [-1, 2, -5.6], [0.4, 0, -5.6]], { yaw: 80, pitch: 10, fov: 44, margin: 1.05 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(60, 116)) {                // 2. "pancakes": Mr. Plum points at the flat tire (wide, low)
      cam = fitT(K, [[-3.4, 0, -1.6], [0.4, 1.4, -1.6], ...body(0.9, -0.2), [-1, 2, -5.6]], { yaw: 110, pitch: 8, fov: 42 }); cam.fov *= K.punch(f, F.PANCAKE, 0.12, 6);
    } else if (sh(116, 150)) {               // 3. insert: the complaint box spits out "BLACK IS BORING!"
      cam = { pos: [-2.9, 1.9, -3.0], look: [-3.6, 1.75, -5.0], fov: 40 * K.push(u, 0.1) }; dof = { focus: 2.1, cinf: 16 };
    } else if (sh(150, 212)) {               // 4. Doris reads it, shrugs; black tire stacks; Mr. Plum crossed arms (wide)
      cam = fitT(K, [...body(-1, -5.6), ...body(0.9, -0.2), [-5.5, 0.4, -8.2], [-3.6, 1.6, -5.2]], { yaw: lerp(80, 88, u), pitch: 10, fov: 42 });
    } else if (sh(212, 260)) {               // 5. "Say no more!" -> the tire oven
      cam = fitT(K, [...body(2.2, -5.4), [3.6, 2.0, -7.4], [3.6, 0, -6.7], [0.4, 0, -5.6]], { yaw: lerp(60, 70, u), pitch: 8, fov: 42 });
    } else if (sh(260, 303)) {               // 6. pink + mint tires roll out of the oven (low)
      cam = fitT(K, [[2.8, 0, -6.6], [4.6, 1.0, -4.4], ...body(2.2, -5.4)], { yaw: 120, pitch: 5, fov: 42 }); cam.fov *= K.push(u, 0.08);
    } else if (sh(303, 338)) {               // 7. they look like cupcakes (display table, golden stands)
      cam = fitT(K, [[2.0, 0.9, -3.8], [6.4, 1.5, -3.8], ...body(1.6, -2.9)], { yaw: 95, pitch: 14, fov: 40 }); cam.fov *= K.push(u, 0.1);
    } else if (sh(338, 389)) {               // 8. Biscuit climbs up to sleep in one (wide)
      cam = fitT(K, [[1.8, 0, -2.8], [4.4, 1.6, -3.8], ...body(1.6, -2.9)], { yaw: 60, pitch: 10, fov: 42 });
    } else if (sh(389, 440)) {               // 9. Route 9 hits 104 degrees (the sign, heat, everyone sweating)
      cam = fitT(K, [[8.8, 0, -5], [8.8, 3.9, -5], ...body(6.4, -2.7), ...body(1.6, -2.9)], { yaw: 68, pitch: 6, fov: 44 }); cam.fov *= K.punch(f, F.HOT, 0.12, 6);
    } else if (sh(440, 518)) {               // 10. the pink tires go soft like gum (table, Doris + Ortiz shocked)
      cam = fitT(K, [[2.0, 0.9, -3.8], [6.4, 1.5, -3.8], ...body(1.6, -2.9), ...body(6.4, -2.7), [3.0, 0, -2.6]], { yaw: lerp(100, 92, u), pitch: 12, fov: 42 }); cam.fov *= K.punch(f, F.GUM, 0.1, 6);
    } else if (sh(518, 565)) {               // 11. Mrs. Ortiz drives home, a pink stripe behind her (tracking, wide)
      const tc = K.track(f, (g) => [lerp(-2, 34, sm(522, 612, g)), 0, -1.4], { off: [-3.5, 3.4, 11.5], lag: 5, lookY: 0.8 }); cam = { ...tc, fov: 46 };
    } else if (sh(565, 613)) {               // 12. high: a pink stripe across the whole town
      cam = { pos: [lerp(4, 8, u), 13, 14], look: [22, 0, -3], fov: 48 }; dof = { focus: 22, cinf: 2 };
    } else if (sh(613, 660)) {               // 13. complaint two: "My tires are melting!" at the desk
      cam = fitT(K, [...body(-1, -5.6), ...body(-2.4, -3.6), [0.6, 0, -4.6], [-1, 0.5, -0.8], [3, 1.5, -1.6]], { yaw: 95, pitch: 12, fov: 40 }); cam.fov *= K.push(u, 0.08);
    } else if (sh(660, 705)) {               // 14. "Say no more!" (Doris reaction close)
      cam = { pos: [-0.3, 1.75, -3.5], look: [-1.0, 1.55, -5.6], fov: 38 * K.push(u, 0.08) }; dof = { focus: 2.1, cinf: 12 };
    } else if (sh(705, 788)) {               // 15. a tiny umbrella on every wheel (wide on the car)
      cam = fitT(K, [[-1, 0, -1.6], [3, 1.6, -1.6], ...body(-2.4, -3.6), ...body(-1, -5.6)], { yaw: lerp(70, 80, u), pitch: 10, fov: 42 }); cam.fov *= K.punch(f, F.UMB, 0.1, 6);
    } else if (sh(788, 830)) {               // 16. the mint tires pop (table, Doris panics, dog jumps)
      cam = fitT(K, [[2.0, 0.9, -3.8], [6.4, 1.5, -3.8], ...body(1.6, -2.9), [2.6, 0, -2.6]], { yaw: 75, pitch: 10, fov: 42 }); cam.fov *= K.punch(f, F.POPPED, 0.1, 6);
    } else if (sh(830, 865)) {               // 17. Mr. Plum drives on bare rims, throwing sparks (tracking, wide)
      const tc = K.track(f, (g) => [lerp(-16, 6, clamp((g - 762) / 103, 0, 1)), 0, -1.6], { off: [2.0, 2.8, 11.5], lag: 4, lookY: 0.8 }); cam = { ...tc, fov: 46 };
    } else if (sh(865, 905)) {               // 18. so what's in a boring black tire? Doris thinks (medium)
      cam = fitT(K, [...body(0.2, -3.0), [-7, 0, -8.4], [-4.5, 1.4, -8.4]], { yaw: 70, pitch: 8, fov: 40 }); cam.fov *= K.push(u, 0.1);
    } else if (sh(905, 975)) {               // 19. x-ray tire: carbon specks (soot) all through the rubber
      cam = { pos: [CX + lerp(-1.5, 1.5, u), 2.6, 7.5], look: [CX + 0.4, 1.9, 0], fov: 44 }; dof = { focus: 7.5, cinf: 4 };
    } else if (sh(975, 1046)) {              // 20. like a gummy bear in armor (both in shot)
      cam = fitT(K, [[CX - 2, 0.2, 0], [CX + 2, 3.6, 0], [CX + 1.9, 0, 3.0], [CX + 1.9, 3.4, 3.0]], { yaw: 75, pitch: 8, fov: 42 }); cam.fov *= K.punch(f, F.ARMOR, 0.1, 6);
    } else if (sh(1046, 1100)) {             // 21. the sun cooks the pink tire, the black one shrugs it off
      cam = fitT(K, [[CX - 2.3, 0, 1], [CX + 2.3, 1.6, 1], [CX - 3.5, 6.5, -4]], { yaw: 88, pitch: 4, fov: 44 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(1100, 1155)) {             // 22. built-in sunscreen (the bottle pops up)
      cam = fitT(K, [[CX - 0.6, 0, 2.2], [CX + 2.3, 1.6, 1], [CX + 0.6, 1.5, 2.2]], { yaw: 80, pitch: 10, fov: 40 }); cam.fov *= K.punch(f, F.SUNSCREEN, 0.1, 6);
    } else if (sh(1155, 1229)) {             // 23. back to black: complaints this week 0, Doris walks out happy, Biscuit wags
      cam = fitT(K, [[-6.5, 0.4, -8.4], ...body(-6.5, -5.6), ...body(-3, -3.6), [-5.6, 2.1, -6.3], [-1.2, 0, -1.6]], { yaw: lerp(70, 78, u), pitch: 10, fov: 44 }); light = LG;
    } else if (sh(1229, 1295)) {             // 24. "Your dog is sleeping in my spare tire." (wide: Plum, the spare, Biscuit, Doris)
      cam = fitT(K, [...body(-4.0, -3.6), [-4.9, 0, -2.4], [-3.9, 0.6, -2.4], [-3.2, 1.4, -1.6]], { yaw: 72, pitch: 12, fov: 42 }); light = LG;
    } else { u = clamp((f - 1295) / 70, 0, 1);                                 // 25. Doris said no more (deadpan), pull back to the whole Tire Hut (loops to frame 0)
      cam = fitT(K, [...body(-1.6, -4.4), [-4.9, 0, -2.4], ...body(-4.0, -3.6), [lerp(-2.5, 0, u), lerp(1.5, 3.5, u), lerp(-3, -10, u)]], { yaw: lerp(95, 78, u), pitch: lerp(10, 14, u), fov: 44 }); light = LG;
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    if (f < 120) K.sparks(f, 0, 120, (g) => [lerp(-5.5, -1.5, sm(0, 70, g)) - 1.25, 0.05, -0.8], { dir: [-1, 0.6, 0.3], spread: 0.5, rate: f < 75 ? 8 : 1, speed: 3, life: 10, seed: 3 });
    if (f >= 762 && f < 865) for (const dx of [1.25, -1.25]) K.sparks(f, 762, 865, (g) => [lerp(-16, 6, clamp((g - 762) / 103, 0, 1)) + dx, 0.05, -0.8], { dir: [-1, 0.7, 0.3], spread: 0.5, rate: 10, speed: 4, life: 10, seed: 5 + dx });
    if (f >= 212 && f < 303) K.steam(f, [3.1, 2.6, -7.6], { rate: 6, size: 0.6, rise: 1.6 });
    if (f >= 389 && f < 518) K.steam(f, [4.2, 1.4, -3.8], { rate: 4, size: 0.4, rise: 1.0, alpha: 0.35 });
    for (let k = 0; k < 3; k++) K.puff(f, F.POPPED + k * 6, 2.95 + k * 1.7, -3.8, 8, 0.4, '#9af0d0');
    K.puff(f, 70, -1.5, -1.6, 8, 0.4); K.puff(f, F.SPARE, -4.4, -2.4, 5, 0.3);
    if (f >= 1046 && f < 1155) K.steam(f, [CX - 1.6, 1.3, 1.0], { rate: 5, size: 0.5, rise: 1.2, alpha: 0.5 });
    K.mist(f, 897, 16); K.mist(f, 1147, 16);
    K.badge(f, F.PANCAKE, 'PANCAKE TIRES', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 114 });
    K.badge(f, F.WHY, 'WHY BLACK?', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 210 });
    K.badge(f, F.HOT, '104°F', [8.8, 4.3, -5], { icon: 'up', f1: 516 });
    K.badge(f, F.CARBON, 'CARBON SPECKS', { sx: 0.5, sy: 0.18 }, { icon: 'check', f1: 1044 });
    K.badge(f, F.TOUGH, 'MANY TIMES TOUGHER', { sx: 0.5, sy: 0.25 }, { icon: 'up', f1: 1044 });
    K.badge(f, F.SUNSCREEN, 'BUILT-IN SUNSCREEN', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1153 });
    K.badge(f, F.BACK, 'COMPLAINTS: 0', { sx: 0.5, sy: 0.2 }, { style: 'stamp', size: 1.2, f1: 1227 });
    return { light: { ...light, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
