// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Doorknobs Are Far From the Hinges" — invented story, engine: Fish Out of Water (SCRIPTS.md §000).
// Chester the beaver ("Trust the teeth!") builds Pinecone Hollow library's door with the knob by the hinge. Mrs. Plum pushes ten
// minutes: one inch. Big Lars pushes till his hat pops off: two inches. A second knob next to the first. Forty people stuck
// outside, reading through the window. Gertrude the elephant pushes: the door opens, so does the wall. Explainer: a door spins
// around its hinges, the far edge is a long lever — one finger at the edge, an elephant next to the hinge. Knobs moved to the
// edge, Mrs. Plum opens it with her pinky; Gertrude still works there holding the door.
import { TOTAL, LINES, wf } from './knobdoor_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const HXW = -0.65;                       // hinge line of the library door (world x), door front at z = 0
const DX = 22, DZ = 4;                   // the demo door for the explainer (on the green)
let THREE, F = {}, CHESTER, PLUM, LARS, GERT, CROWD = [], WALLG, DOOR, KNOB1, KNOB2, KNOB3, LHAT, DEMO, DDOOR, ARC, LEVER, FARR, BIGARR, PIV, WBENCH, PLANK, CH2;

function pine(K, parent, x, z, h, seed) { const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g); K.cyl(0.12, 0.18, h * 0.3, K.mat('wood', '#5a3a24'), 0, 0, 0, g, 8);
  for (let k = 0; k < 4; k++) K.cyl(0.0, h * (0.32 - k * 0.05), h * 0.34, K.mat('grime', ['#2f6a3a', '#357a40', '#2a5e34'][(k + seed) % 3], { amt: 0.4, detail: 0.6 }), 0, h * (0.22 + k * 0.17), 0, g, 9); return g; }
function arrow(K, color) { const g = new THREE.Group(); K.scene.add(g); const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(2.0), toneMapped: false });
  const s = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1, 10), m); s.position.y = 0.5; g.add(s); const h = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.3, 14), m); h.position.y = 1.1; g.add(h);
  g.traverse((o) => { o.userData.ndSkip = true; }); g.userData = { s, h }; return g; }
function setArrow(a, from, dir, len) { a.position.set(...from); a.userData.s.scale.y = len; a.userData.s.position.y = len / 2; a.userData.h.position.y = len + 0.12;
  a.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...dir).normalize()); }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { KNOB: wf(0, 'doorknob'), HINGE: wf(0, 'hinge'), NOBODY: wf(0, 'nobody'), TRUST: wf(1, 'the') - 6, WHY: wf(1, 'why'), PUSHED: wf(2, 'pushed'), TEN: wf(2, 'ten'), ONE: wf(2, 'one'), INCH: wf(2, 'inch'),
      LARS: wf(3, 'big'), STRONG: wf(3, 'strongest'), PUSH3: wf(3, 'pushed'), HAT: wf(3, 'hat'), POP: wf(3, 'popped'), TWO: wf(3, 'two'), ADDED: wf(4, 'added'), SECOND: wf(4, 'second'), TRUST2: wf(4, 'the') - 6,
      FRIDAY: wf(5, 'by'), FORTY: wf(5, 'forty'), READ: wf(5, 'reading'), WINDOW: wf(5, 'window'), HIRED: wf(6, 'hired'), GERT: wf(6, 'gertrude'), SHE: wf(6, 'she'), OPENED: wf(6, 'opened'), WALL: wf(6, 'wall'),
      WHY2: wf(7, 'why'), SPINS: wf(8, 'spins'), HINGES: wf(8, 'hinges'), FAR: wf(8, 'far'), LEVER: wf(8, 'lever'), FAR2: wf(9, 'far'), FINGER: wf(9, 'finger'), NEXT: wf(9, 'next'), ELE: wf(9, 'elephant'),
      MOVED: wf(10, 'moved'), EDGE: wf(10, 'edge'), PLUM: wf(10, 'plum'), OPEN2: wf(10, 'opened'), PINKY: wf(10, 'pinky'), STILL: wf(11, 'still'), HOLDS: wf(11, 'holds') };
    // ================= Pinecone Hollow =================
    const G = K.group();
    K.slab(-120, 120, -0.3, 0, -120, 80, K.mat('grime', '#6aa84f', { amt: 0.55, detail: 1.2 }), G, false);
    K.slab(-1.6, 1.6, 0, 0.012, 0.4, 14, K.mat('dirt', '#b8946a', { detail: 0.5 }), G, false);                  // dirt path to the door
    for (let k = 0; k < 18; k++) K.sphere(0.12 + hash(k) * 0.1, K.mat('rock', '#a8a49c'), (k % 2 ? 1.7 : -1.7) + (hash(k + 1) - 0.5) * 0.2, 0.02, 0.8 + k * 0.7, G, 1, 0.5, 1);
    // the library: hollow box (so the fallen wall shows the shelves), pitched roof, windows, sign, steps
    const wood = K.mat('wood', '#b8844a', { detail: 0.5 }), dark = K.mat('wood', '#6a4226'), stone = K.mat('rock', '#a8a098', { detail: 0.5 });
    K.slab(-5.2, -1.5, 0, 6, -0.25, 0, wood, G); K.slab(1.5, 5.2, 0, 6, -0.25, 0, wood, G); K.slab(-1.5, 1.5, 3.4, 6, -0.25, 0, wood, G);
    K.slab(-5.2, -4.95, 0, 6, -9, 0, wood, G); K.slab(4.95, 5.2, 0, 6, -9, 0, wood, G); K.slab(-5.2, 5.2, 0, 6, -9, -8.75, wood, G); K.slab(-5, 5, 0, 0.05, -9, 0, K.mat('wood', '#8a5a34'), G);
    for (const sx of [-1, 1]) { const r = K.rbox(6.3, 0.25, 10.2, 0.05, K.mat('rock', '#7a3a2a', { detail: 0.4 }), sx * 2.6, 7.4, -4.4, G); r.rotation.z = -sx * 0.62; }
    const gab = new THREE.Shape(); gab.moveTo(-5.2, 0); gab.lineTo(5.2, 0); gab.lineTo(0, 3.6); gab.lineTo(-5.2, 0); const gm = new THREE.Mesh(new THREE.ExtrudeGeometry(gab, { depth: 0.25, bevelEnabled: false }), wood); gm.position.set(0, 6, -0.25); G.add(gm);
    for (let y = 0.3; y < 6; y += 0.45) K.slab(-5.25, 5.25, y, y + 0.03, -0.02, 0.02, dark, G);                                 // plank lines
    K.slab(-5.4, 5.4, 0, 0.35, -0.3, 0.2, stone, G);                                                                             // stone plinth
    for (let k = 0; k < 3; k++) K.rbox(3.2 - k * 0.3, 0.14, 0.5 - k * 0.12, 0.03, stone, 0, 0.07 + k * 0.14, 0.55 - k * 0.12, G);  // steps
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 0.8), S.textMat('PINECONE HOLLOW LIBRARY', { bg: '#2a5a3a', fg: '#f2e2c0', w: 1024, h: 180, border: false })); sign.position.set(0, 4.6, 0.1); G.add(sign);
    K.rbox(4.8, 1.0, 0.08, 0.04, K.gold(), 0, 4.6, 0.0, G);
    for (const wx of [-3.3, 3.3]) { K.slab(wx - 0.85, wx + 0.85, 1.0, 2.8, -0.24, -0.2, K.glass({ color: '#cfe8ff', opacity: 0.25 }), G); K.rbox(1.9, 0.12, 0.2, 0.03, K.paint('#f2e2c0'), wx, 0.95, 0.05, G); K.rbox(1.9, 0.12, 0.14, 0.03, K.paint('#f2e2c0'), wx, 2.86, 0.03, G);
      for (const dx of [-0.9, 0, 0.9]) K.rbox(0.08, 1.9, 0.12, 0.02, K.paint('#f2e2c0'), wx + dx, 1.9, 0.02, G); K.rbox(1.8, 0.07, 0.1, 0.02, K.paint('#f2e2c0'), wx, 1.9, 0.02, G);
      const fb = K.rbox(1.8, 0.25, 0.3, 0.04, K.paint('#7a3a2a'), wx, 0.8, 0.2, G); for (let k = 0; k < 6; k++) K.sphere(0.09, K.paint(['#e86a9a', '#f2c230', '#f4f2ee'][k % 3], { coat: 0 }), wx - 0.7 + k * 0.28, 1.0, 0.2, G); }
    // shelves inside (seen through the windows and the hole)
    for (const sx of [-1, 1]) for (const z of [-2.0, -5.0]) for (let r = 0; r < 4; r++) { K.rbox(2.6, 0.06, 0.5, 0.01, dark, sx * 2.6, 0.5 + r * 0.7, z, G);
      for (let b = 0; b < 12; b++) K.rbox(0.16, 0.45 + 0.12 * hash(b + r * 13), 0.32, 0.01, K.paint(['#c0392b', '#2a62c8', '#f2c230', '#2a9a6a', '#8a4ac8'][(b + r + (z > -3 ? 0 : 2)) % 5], { rough: 0.5 }), sx * 2.6 - 1.15 + b * 0.2, 0.53 + r * 0.7 + 0.23, z, G); }
    const rug = K.slab(-1.4, 1.4, 0.05, 0.07, -6, -0.6, K.paint('#a82a2a', { coat: 0, rough: 0.9 }), G, false);
    K.lamp(0, 3.8, -4, { color: '#ffd08a', intensity: 6, distance: 9 });
    for (const lx of [-2.0, 2.0]) { K.cyl(0.04, 0.04, 0.4, K.paint('#2a2a2a'), lx, 2.6, 0.12, G, 6); K.sphere(0.16, K.glass({ color: '#ffe0a0', opacity: 0.8 }), lx, 3.1, 0.15, G); }
    // Chester's workshop: stump bench, sign, logs, sawhorse, chips
    WBENCH = new THREE.Group(); WBENCH.position.set(4.6, 0, 3.6); G.add(WBENCH);
    K.cyl(0.6, 0.7, 0.8, K.mat('wood', '#8a5a34'), 0, 0, 0, WBENCH, 18); K.cyl(0.6, 0.6, 0.03, K.mat('wood', '#e0b07a'), 0, 0.8, 0, WBENCH, 18);
    for (let k = 0; k < 3; k++) { const l = K.cyl(0.22, 0.22, 2.0, K.mat('wood', '#7a5234'), 1.2, 0.22 + k * 0.4 - (k > 1 ? 0.2 : 0), 0.4 - k * 0.1, WBENCH, 14); l.rotation.x = Math.PI / 2; l.position.set(1.4 + (k === 2 ? 0.2 : 0), 0.22 + (k === 2 ? 0.38 : 0), -0.6 + (k === 1 ? 0.46 : 0)); }
    const cs = S.board("CHESTER'S DOORS|TRUST THE TEETH", 1.7, 1.0, { frame: '#7a3a2a' }); cs.position.set(5.8, 0, 2.6); cs.rotation.y = -0.4;
    for (let k = 0; k < 40; k++) K.rbox(0.08, 0.02, 0.05, 0.01, K.mat('wood', '#e8c090'), 4.6 + (hash(k + 5) - 0.5) * 2.2, 0.01, 3.6 + (hash(k + 6) - 0.5) * 2.2, G).rotation.y = hash(k) * 3;
    const saw = K.rbox(0.5, 0.18, 0.02, 0.02, K.chrome(), 4.4, 0.84, 3.5, G); saw.rotation.x = -Math.PI / 2;
    // forest + cabins + mushrooms + a lamp post + noticeboard
    for (let k = 0; k < 26; k++) { const a = hash(k + 200) * 6.28; const x = (hash(k + 201) - 0.5) * 60, z = -12 - hash(k + 202) * 30; pine(K, G, x, z, 6 + hash(k + 203) * 5, k); }
    for (const [x, z, h] of [[-9, 2, 7], [9.5, -2, 8], [-12, -5, 9], [13, 4, 7], [-8, 9, 6], [10, 11, 7]]) pine(K, G, x, z, h, x);
    for (const [x, sd] of [[-14, 3], [15, 7]]) { const b = S.building({ w: 6, d: 6, floors: 1, seed: sd, color: '#a8744a', kind: 'plaster', gable: 'pitched', flowers: true, shutters: '#2a5a3a' }); b.position.set(x, 0, -3); b.rotation.y = x < 0 ? 0.3 : -0.3; }
    for (let k = 0; k < 9; k++) { const x = (hash(k + 300) - 0.5) * 14, z = 1.5 + hash(k + 301) * 6; if (Math.abs(x) < 2) continue; K.cyl(0.04, 0.05, 0.18, K.paint('#f4efe4'), x, 0, z, G, 8); K.sphere(0.13, K.paint('#d8302a'), x, 0.2, z, G, 1, 0.55, 1); for (let j = 0; j < 4; j++) K.sphere(0.025, K.paint('#ffffff'), x + Math.cos(j * 1.6) * 0.08, 0.26, z + Math.sin(j * 1.6) * 0.08, G); }
    const nb = S.board('BOOK CLUB|TUESDAY', 1.3, 0.9, { frame: '#2a5a3a' }); nb.position.set(-4.4, 0, 2.4); nb.rotation.y = 0.4;
    const lp = S.streetLamp(); lp.position.set(-2.6, 0, 1.6);
    S.bake(G);
    // ================= the wall section + the door (hinged on the left) =================
    WALLG = new THREE.Group(); WALLG.position.set(0, 0, 0); sc.add(WALLG);
    K.slab(-1.5, -0.65, 0, 3.4, -0.25, 0, wood, WALLG); K.slab(0.65, 1.5, 0, 3.4, -0.25, 0, wood, WALLG); K.slab(-0.65, 0.65, 2.4, 3.4, -0.25, 0, wood, WALLG);
    for (let y = 0.3; y < 3.4; y += 0.45) { K.slab(-1.52, -0.65, y, y + 0.03, -0.02, 0.02, dark, WALLG); K.slab(0.65, 1.52, y, y + 0.03, -0.02, 0.02, dark, WALLG); }
    K.rbox(1.5, 0.14, 0.22, 0.03, K.paint('#2a5a3a'), 0, 2.47, 0.06, WALLG); for (const sx of [-0.72, 0.72]) K.rbox(0.12, 2.45, 0.2, 0.03, K.paint('#2a5a3a'), sx, 1.22, 0.05, WALLG);
    DOOR = new THREE.Group(); DOOR.position.set(HXW, 0.02, -0.08); WALLG.add(DOOR);
    K.rbox(1.28, 2.36, 0.1, 0.03, K.paint('#c0392b', { rough: 0.35 }), 0.64, 1.18, 0, DOOR);
    for (const [y, h] of [[0.65, 0.8], [1.7, 0.8]]) K.rbox(0.95, h, 0.04, 0.02, K.paint('#a82a26', { rough: 0.3 }), 0.64, y, 0.06, DOOR);
    for (const y of [0.4, 2.0]) { K.rbox(0.18, 0.12, 0.04, 0.01, K.gold(), 0.07, y, 0.06, DOOR); K.cyl(0.03, 0.03, 0.16, K.gold(), 0.0, y - 0.08, 0.06, DOOR, 10); }
    const knob = (x) => { const g = new THREE.Group(); g.position.set(x, 1.05, 0.06); DOOR.add(g); K.cyl(0.07, 0.07, 0.02, K.gold(), 0, 0, 0, g, 18).rotation.x = Math.PI / 2; const b = K.sphere(0.075, K.gold(), 0, 0, 0.1, g); K.cyl(0.025, 0.025, 0.1, K.gold(), 0, 0, 0.05, g, 8).rotation.x = Math.PI / 2; return g; };
    KNOB1 = knob(0.14); KNOB2 = knob(0.32); KNOB3 = knob(1.12);
    const dn = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.18), S.textMat('PUSH', { bg: '#f2e2c0', fg: '#7a1f1f', w: 256, h: 92 })); dn.position.set(0.64, 1.55, 0.09); DOOR.add(dn);
    WALLG.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    // Lars' beanie (pops off his head)
    LHAT = new THREE.Group(); sc.add(LHAT); K.sphere(0.27, K.mat('fabric', '#2a62c8', { detail: 0.1 }), 0, 0, 0, LHAT, 1, 0.75, 1); K.sphere(0.09, K.paint('#f4f2ee', { coat: 0 }), 0, 0.22, 0, LHAT); K.cyl(0.275, 0.275, 0.08, K.mat('fabric', '#f4f2ee'), 0, -0.05, 0, LHAT, 20); LHAT.scale.setScalar(0.82);
    // a new knob Chester carries in his teeth + a plank he gnaws
    PLANK = K.rbox(0.9, 0.06, 0.25, 0.02, K.mat('wood', '#d8a870'), 0, 0, 0, sc);
    // ================= explainer: a demo door on the green, with glowing hinge, arc, lever + arrows =================
    DEMO = new THREE.Group(); DEMO.position.set(DX, 0, DZ); sc.add(DEMO);
    K.rbox(0.15, 2.6, 0.2, 0.03, K.mat('wood', '#6a4226'), -0.08, 1.3, 0, DEMO); K.rbox(0.15, 2.6, 0.2, 0.03, K.mat('wood', '#6a4226'), 1.5, 1.3, 0, DEMO); K.rbox(1.73, 0.15, 0.2, 0.03, K.mat('wood', '#6a4226'), 0.71, 2.6, 0, DEMO);
    K.cyl(1.6, 1.6, 0.02, K.mat('dirt', '#c8a878'), 0, 0, 0, DEMO, 40);
    DDOOR = new THREE.Group(); DDOOR.position.set(0, 0.02, 0); DEMO.add(DDOOR); K.rbox(1.4, 2.4, 0.08, 0.03, K.paint('#2a62c8', { rough: 0.35 }), 0.7, 1.2, 0, DDOOR); K.sphere(0.07, K.gold(), 1.25, 1.05, 0.1, DDOOR);
    const db = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.2), S.textMat('DEMO', { bg: '#f2c230', fg: '#1a1a1a', w: 256, h: 90 })); db.position.set(0.7, 1.7, 0.05); DDOOR.add(db);
    PIV = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.6, 14), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd040').multiplyScalar(2.2), toneMapped: false })); PIV.position.set(DX, 1.3, DZ); PIV.userData.ndSkip = true; sc.add(PIV);
    ARC = K.trace(Array.from({ length: 25 }, (_, k) => { const a = k / 24 * 1.4; return [DX + 1.4 * Math.cos(a), 0.06, DZ - 1.4 * Math.sin(a)]; }), { color: '#7af8a0', r: 0.03 });
    LEVER = K.trace([[DX, 1.05, DZ + 0.12], [DX + 0.7, 1.05, DZ + 0.12], [DX + 1.35, 1.05, DZ + 0.12]], { color: '#ffd040', r: 0.04 });
    FARR = arrow(K, '#7af8a0'); BIGARR = arrow(K, '#ff5a3a');
    // ================= characters =================
    CHESTER = K.animal('beaver', { scale: 1.7, seed: 3 });
    PLUM = K.stick({ jacket: '#8a4ac8', dress: '#6a3a9a', pants: '#3a2a4a', hairStyle: 'bun', hair: '#d8d4cc', glasses: true, scarf: '#f2c230', collar: '#f4efe4' }, { key: 'plum' });
    LARS = K.stick({ jacket: '#c0392b', pants: '#2a3a5a', build: 'stout', moustache: '#e8a040', hairStyle: 'short', hair: '#e8a040', belt: '#3a2418', vest: '#2a2a30', gloves: '#3a2418', boots: '#3a2418' }, { key: 'lars', head: 1.1 });
    GERT = K.animal('elephant', { scale: 1.25, seed: 2 });
    CROWD = S.extras(9, { x0: -6, len: 12, z: 4, spread: 1, seed: 60 });
    K.addClouds(8, 700, 160);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s), t = f / 30;
    const ex = f >= 853 && f < 1110;
    const fixed = f >= 1110;                                                   // the wall rebuilt, knob at the edge
    // ---------- door + wall ----------
    let da = 0;
    if (f >= F.PUSHED && f < 327) da = 0.025 * sm(F.ONE - 10, F.INCH, f);
    if (f >= 327 && f < 476) da = 0.025 + 0.03 * sm(F.POP - 6, F.TWO, f);
    if (f >= 476 && f < 698) da = 0.055;
    if (f >= 698 && f < 853) da = 0.055 + 1.35 * sm(F.SHE + 4, F.OPENED + 6, f);
    if (fixed) da = f < F.PINKY - 6 ? 0 : 1.3 * sm(F.PINKY - 6, F.PINKY + 10, f);
    DOOR.rotation.y = da;
    const wa = f >= F.WALL - 4 && f < 1110 ? -1.45 * Math.min(1, Math.pow(Math.max(0, f - F.WALL + 4) / 14, 2)) : 0; WALLG.rotation.x = wa;
    if (f >= F.WALL + 10 && f < 1110) WALLG.rotation.x = -1.45 + 0.05 * Math.exp(-(f - F.WALL - 10) / 4) * Math.sin(f);
    KNOB1.visible = !fixed; KNOB2.visible = !fixed && f >= F.SECOND - 4; KNOB3.visible = fixed;
    // ---------- explainer pieces ----------
    let dd = 0; if (ex) { if (f < 915) dd = 0.7 * sm(870, 905, f) * (1 - sm(905, 915, f)) ; else if (f < 976) dd = 0; else if (f < 1040) dd = 1.2 * sm(F.FINGER - 4, F.FINGER + 12, f); else dd = 0.04 * sm(F.NEXT, F.NEXT + 10, f) + 0.6 * sm(F.ELE - 2, F.ELE + 12, f); }
    DDOOR.rotation.y = dd; DEMO.visible = PIV.visible = ex;
    ARC.show(ex && f < 976 ? sm(F.SPINS - 4, F.HINGES + 8, f) : 0); LEVER.show(ex && f >= 915 && f < 976 ? sm(F.FAR - 4, F.LEVER + 8, f) : 0);
    FARR.visible = ex && f >= 976 && f < 1040; if (FARR.visible) { const a = dd; setArrow(FARR, [DX + 1.3 * Math.cos(a) + 0.5 * Math.sin(a) * 0, 1.05, DZ - 1.3 * Math.sin(a) + 0.7], [-Math.sin(a) * 0, 0, -1], 0.45); FARR.position.set(DX + 1.3 * Math.cos(a) + 0.65 * Math.sin(a), 1.05, DZ - 1.3 * Math.sin(a) + 0.65 * Math.cos(a)); FARR.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-Math.sin(a), 0, -Math.cos(a))); }
    BIGARR.visible = ex && f >= 1040; if (BIGARR.visible) { setArrow(BIGARR, [DX + 0.18, 1.05, DZ + 1.8], [0, 0, -1], 1.4); BIGARR.scale.setScalar(1.6); }
    // ---------- Lars' hat ----------
    const larsP = (g) => { const W = K.walkPath(g, 327, [[3.5, 4.5], [1.2, 1.8], [0.0, 0.55]], 2.4); return W; };
    const LW = larsP(f); let lp = { x: LW.x, z: LW.z, yaw: LW.moving ? LW.yaw : Math.PI }; if (f < 327 || f >= 476 && f < 594) lp = { visible: false }; if (f >= 594 && f < 698) lp = { x: 2.2, z: 3.4, yaw: Math.PI - 0.3 };
    if (ex) lp = { visible: false }; if (fixed) lp = { x: 2.0, z: 3.2, yaw: Math.PI - 0.5 }; if (f >= 698 && f < 853) lp = { x: 2.4, z: 4.2, yaw: Math.PI - 0.4 };
    const hatOff = f >= F.POP - 2 ? Math.min(1, (f - F.POP + 2) / 26) : 0;
    LHAT.visible = !ex && (lp.visible !== false || hatOff > 0);
    if (hatOff > 0) { const u = hatOff, bx = 0.0, bz = 0.55; LHAT.position.set(bx + 0.9 * u, 1.8 + 2.2 * u - 2.1 * u * u, bz + 1.75 * u); if (u >= 1) LHAT.position.set(0.9, 0.12, 2.3); LHAT.rotation.set(u * 5, 0, u * 3); if (u >= 1) LHAT.rotation.set(0.2, 0, 0); }
    else { LHAT.position.set(lp.x ?? 0, 1.8 + (f >= F.PUSH3 && f < F.POP ? 0.03 * Math.sin(f * 2) : 0), lp.z ?? 0); LHAT.rotation.set(0, 0, 0); }
    // ---------- characters ----------
    // Chester the beaver
    let cp = { x: 1.0, z: 0.9, yaw: -0.6, mode: 'beg', expr: 'happy' };
    if (f < 103) cp = { x: -1.6, z: 0.9, yaw: 0.6, mode: f < 50 ? 'beg' : 'stand', expr: 'happy', lift: f >= 50 ? 0.5 + 0.5 * Math.sin(f * 0.6) : 0 };
    if (f >= 103 && f < 212) cp = { x: 4.6, z: 3.65, y: 0.8, yaw: -0.4, mode: f < 150 ? 'eat' : 'beg', expr: f < 150 ? 'happy' : 'happy' };
    if (f >= 212 && f < 476) cp = { x: 1.5, z: 1.3, yaw: -0.7, mode: f >= F.INCH && f < 327 ? 'beg' : 'sit', expr: f >= F.TWO ? 'shock' : 'neutral' };
    if (f >= 476 && f < 594) cp = f < 530 ? { x: -0.35, z: 0.35, yaw: Math.PI, mode: 'eat', expr: 'happy', nod: 0.3 * Math.sin(f * 1.2) } : { x: -1.5, z: 0.9, yaw: 0.7, mode: 'beg', expr: 'happy' };
    if (f >= 594 && f < 698) cp = { x: 1.2, z: 1.8, yaw: -0.2, mode: 'beg', expr: 'neutral' };
    if (f >= 698 && f < 811) cp = { x: 2.2, z: 1.6, yaw: -0.9, mode: f >= F.WALL ? 'jump' : 'beg', expr: f >= F.OPENED ? 'shock' : 'happy' };
    if (f >= 811 && f < 853) cp = { x: 2.2, z: 1.6, yaw: 0.7, mode: 'sit', expr: 'shock' };
    if (fixed) cp = { x: f < 1175 ? 0.55 : 1.4, z: f < 1175 ? 0.35 : 1.2, yaw: f < 1175 ? Math.PI : -0.4, mode: f < 1175 ? 'eat' : 'beg', expr: 'happy', nod: f < 1175 ? 0.3 * Math.sin(f * 1.2) : 0 };
    if (ex) cp = { visible: false };
    CHESTER.set(f, cp);
    PLANK.visible = f >= 103 && f < 212; PLANK.position.set(4.6, 0.86, 3.65 + 0.2); PLANK.rotation.y = 0.3; PLANK.scale.x = f < 150 ? 1 - 0.3 * ((f - 103) / 47) : 0.7;
    // Mrs. Plum
    let pp = { x: -0.5, z: 0.45, yaw: Math.PI }, pk = [[0, 'push', { expr: 'pained', sweat: true }], [F.NOBODY, 'push', { expr: 'angry', sweat: true }]];
    if (f >= 103 && f < 212) pp = { x: -2.2, z: 2.6, yaw: 2.6 }, pk = [[0, 'cross', { expr: 'stern', item: 'book' }]];
    if (f >= 212 && f < 327) { pp = { x: -0.5, z: 0.45, yaw: Math.PI }; pk = [[0, 'push', { expr: 'pained', sweat: true }], [F.ONE, 'push', { expr: 'angry', sweat: true }], [F.INCH + 4, 'facepalm', { expr: 'pained' }]]; }
    if (f >= 327 && f < 594) { pp = { x: -2.6, z: 2.4, yaw: 2.4 }; pk = [[0, 'cross', { expr: 'stern' }], [F.POP, 'shock', { expr: 'shock' }], [476, 'cross', { expr: 'deadpan' }]]; }
    if (f >= 594 && f < 853) { pp = { x: -3.3, z: 0.5, yaw: Math.PI }; pk = [[0, 'read', { expr: 'deadpan', item: 'book' }], [F.OPENED, 'shock', { expr: 'shock' }]]; }
    if (fixed) { pp = { x: 0.85, z: 0.5, yaw: Math.PI + 0.2 }; pk = [[0, 'idle', { expr: 'deadpan', item: 'book' }], [F.PINKY - 8, 'point', { expr: 'smug' }], [F.PINKY + 14, 'cheer', { expr: 'laugh' }]]; if (f >= 1246) pp = { x: -1.2, z: 1.8, yaw: 0.4 }; }
    if (ex) pp = { visible: false };
    PLUM.set(T.act(f, pk, { seed: 6, blink: blink(6) }), pp);
    // Big Lars
    const lk = [[0, 'walk', { expr: 'proud' }], [F.STRONG, 'cheer', { expr: 'proud' }], [F.PUSH3 - 4, 'push', { expr: 'pained', sweat: true }], [F.POP, 'push', { expr: 'shock', sweat: true }], [F.TWO, 'shock', { expr: 'pained', sweat: true }],
      [594, 'read', { expr: 'sad', item: 'book' }], [698, 'cheer', { expr: 'excited' }], [F.WALL, 'shock', { expr: 'shock' }], [1110, 'clap', { expr: 'grin' }], [F.PINKY + 6, 'shock', { expr: 'shock' }], [1246, 'cheer', { expr: 'laugh' }]];
    const LA = T.act(f, lk, { seed: 9, blink: blink(9), phase: (f / 18) % 1 }); if (LW.moving && f < 476) LA.opts.mode = 'walk';
    LARS.set(LA, lp);
    // the crowd (forty people stuck outside; reading through the window)
    CROWD.forEach((c, k) => { let p = { visible: false }, kk = [[0, 'idle', { expr: 'sad' }]];
      if (f >= 594 && f < 853) { const win = k < 4; p = win ? { x: (k < 2 ? -3.6 : 2.9) + (k % 2) * 0.7, z: 0.55, yaw: Math.PI } : { x: -2.2 + (k - 4) * 1.0, z: 2.6 + (k % 2) * 0.8, yaw: Math.PI + (k % 3 - 1) * 0.3 };
        kk = win ? [[0, 'read', { expr: 'smile', item: 'book' }], [F.OPENED, 'shock', { expr: 'shock' }]] : [[0, k % 2 ? 'cross' : 'shrug', { expr: 'sad' }], [F.OPENED, 'cheer', { expr: 'excited' }], [F.WALL, 'shock', { expr: 'shock' }]]; }
      if (f >= 1246) { const W = K.walkPath(f, 1250 + k * 6, [[-2.4 + k * 0.6, 4.2], [0, 1.2], [0, -2.5]], 1.4); p = { x: W.x, z: W.z, yaw: W.yaw, visible: W.z > -2.4 }; kk = [[0, 'walk', { expr: 'smile', item: 'book' }]]; }
      if (ex) p = { visible: false };
      const A = T.act(f, kk, { seed: 70 + k, blink: blink(70 + k), phase: (f / 18 + k * 0.3) % 1 }); if (f >= 1246) A.opts.mode = 'walk'; c.r.set(A, p); });
    // Gertrude the elephant
    let gp = { visible: false };
    if (f >= 698 && f < 853) { const W = K.walkPath(f, 700, [[7, 7], [2.5, 3.0], [0.3, 1.55]], 1.8); gp = { x: W.x, z: W.z, yaw: W.moving ? W.yaw : Math.PI, mode: W.moving ? 'walk' : 'stand', expr: f >= F.WALL ? 'shock' : 'happy' }; }
    if (ex && f >= 1040) gp = { x: DX + 0.35, z: DZ + 1.6, yaw: Math.PI, mode: 'walk', expr: 'neutral' };
    if (f >= 1246) gp = { x: 1.15, z: -0.4, yaw: -Math.PI / 2 - 0.3, mode: 'stand', expr: 'happy' };
    GERT.set(f, gp);
    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const body = (x, z, y = 0, h = 2.1) => [[x, y, z], [x, y + h, z]];
    if (sh(0, 50)) {                          // 1. Mrs. Plum pushes the door with the knob by the hinge; Chester proud (wide)
      cam = K.fit([...body(-0.5, 0.45), [-1.6, 0, 0.9], [0.7, 2.5, 0], [-1.6, 0, 0]], { yaw: 62, pitch: 8, fov: 40, margin: 0.85, lift: 0.2 }); cam.fov *= K.push(u, 0.05);
    } else if (sh(50, 103)) {                 // 2. Chester taps his knob by the hinge (reaction, proud)
      cam = { pos: [-0.5, 1.3, 2.9], look: [-1.4, 0.7, 0.8], fov: 42 * K.push(u, 0.08) }; dof = { focus: 2.3, cinf: 10 };
    } else if (sh(103, 150)) {                // 3. "Trust the teeth!" Chester gnaws a plank at his stump bench (wide)
      cam = K.fit([[4.6, 0, 3.6], [4.6, 1.8, 3.6], [5.8, 1.6, 2.6], [3.6, 0, 4.4]], { yaw: 75, pitch: 10, fov: 40, margin: 1.0 }); cam.fov *= K.punch(f, F.TRUST, 0.1, 6);
    } else if (sh(150, 212)) {                // 4. why are doorknobs far from the hinges? (wide on the library)
      cam = K.fit([[-2.5, 0, 0.5], [2.5, 0, 0.5], [0, 5.0, 0], ...body(-2.2, 2.6)], { yaw: 95, pitch: 6, fov: 42, margin: 0.9 });
    } else if (sh(212, 270)) {                // 5. Mrs. Plum pushes for ten minutes (wide, low)
      cam = K.fit([...body(-0.5, 0.45), [0.7, 2.5, 0], [1.5, 0, 1.3]], { yaw: 110, pitch: 4, fov: 40, margin: 0.9 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(270, 327)) {                // 6. it moved one inch (high angle, see the gap)
      cam = K.fit([...body(-0.5, 0.45), [0.7, 0, -0.6], [0.7, 2.4, 0.2]], { yaw: 60, pitch: 30, fov: 40, margin: 0.95 }); cam.fov *= K.punch(f, F.INCH, 0.1, 6);
    } else if (sh(327, 390)) {                // 7. Big Lars marches in (tracking wide)
      const W = larsP(f); cam = K.fit([...body(W.x, W.z), [0, 0, 0.3], [0, 2.6, 0]], { yaw: 70, pitch: 8, fov: 42, margin: 0.95 });
    } else if (sh(390, 440)) {                // 8. he pushes until his hat pops off (wide, low)
      cam = K.fit([...body(0, 0.55), [0, 3.0, 0.55], [-1.2, 0, 0], [1.6, 0, 2.2]], { yaw: 105, pitch: 5, fov: 40, margin: 0.95 }); cam.fov *= K.punch(f, F.POP, 0.12, 6);
    } else if (sh(440, 476)) {                // 9. two inches: Lars sweating (reaction)
      cam = { pos: [1.9, 1.8, 1.2], look: [0.0, 1.55, 0.5], fov: 42 * K.push(u, 0.08) }; dof = { focus: 2.3, cinf: 12 };
    } else if (sh(476, 530)) {                // 10. Chester gnaws a second knob into place (wide)
      cam = K.fit([[-0.4, 0, 0.35], [-0.4, 1.2, 0.35], [-1.5, 2.6, 0], [0.8, 0, 0.6]], { yaw: 70, pitch: 12, fov: 40, margin: 1.05 });
    } else if (sh(530, 594)) {                // 11. two knobs, both by the hinge — "Trust the teeth!" (medium wide)
      cam = K.fit([[-0.4, 0, 0.35], [-0.65, 1.8, 0], [0.7, 0, 0.2]], { yaw: 100, pitch: 10, fov: 40, margin: 1.1 }); cam.fov *= K.punch(f, F.TRUST2, 0.1, 6);
    } else if (sh(594, 645)) {                // 12. by Friday: forty people stuck outside (high wide)
      cam = { pos: [lerp(1.5, 0.5, u), 6.5, 11], look: [0, 1.2, 0.5], fov: 46 }; dof = { focus: 12, cinf: 3 };
    } else if (sh(645, 698)) {                // 13. reading through the window (wide, side)
      cam = K.fit([...body(-3.6, 0.55), ...body(-2.9, 0.55), [-4.2, 2.8, 0], [-2.0, 0, 1.2]], { yaw: 55, pitch: 6, fov: 40, margin: 1.0 }); cam.fov *= K.punch(f, F.WINDOW, 0.08, 6);
    } else if (sh(698, 750)) {                // 14. Chester hires Gertrude the elephant (tracking wide)
      cam = K.fit([[GERT.root ? 0 : 0, 0, 0], [7, 0, 7], [0, 3, 0], [2.5, 0, 3]], { yaw: 75, pitch: 10, fov: 44, margin: 0.9 });
    } else if (sh(750, 782)) {                // 15. she pushes: the door opens (wide)
      cam = K.fit([[-1.5, 0, 0], [1.5, 3.0, 0], [0.3, 0, 2.6], [2.2, 0, 1.6]], { yaw: 110, pitch: 8, fov: 42, margin: 0.95 }); cam.fov *= K.punch(f, F.OPENED, 0.1, 6);
    } else if (sh(782, 811)) {                // 16. so did the wall (wide, impact)
      cam = K.fit([[-3, 0, -3.4], [3, 3.4, 0.5], [2.2, 0, 1.6], [0.3, 0, 2.6]], { yaw: 80, pitch: 14, fov: 44, margin: 0.95 }); cam.fov *= K.punch(f, F.WALL + 8, 0.14, 6); const s = K.shake(f, F.WALL + 8, 0.14, 14); cam.pos[0] += s[0]; cam.pos[1] += s[1];
    } else if (sh(811, 853)) {                // 17. Chester stunned: so why is the far edge so easy? (reaction)
      cam = { pos: [3.7, 1.4, 3.6], look: [2.2, 0.6, 1.6], fov: 42 * K.push(u, 0.08) }; dof = { focus: 1.8, cinf: 12 };
    } else if (sh(853, 915)) {                // 18. explainer: a door spins around its hinges (high)
      cam = K.fit([[DX - 0.3, 0, DZ - 1.6], [DX + 1.6, 2.6, DZ + 0.3]], { yaw: 70, pitch: 40, fov: 40, margin: 1.0 });
    } else if (sh(915, 976)) {                // 19. the far edge is a long lever
      cam = K.fit([[DX - 0.3, 0, DZ - 0.3], [DX + 1.6, 2.6, DZ + 0.3]], { yaw: 95, pitch: 12, fov: 40, margin: 1.0 }); cam.fov *= K.punch(f, F.LEVER, 0.1, 6);
    } else if (sh(976, 1040)) {               // 20. push far from the hinge: one finger
      cam = K.fit([[DX - 0.3, 0, DZ - 1.5], [DX + 1.6, 2.6, DZ + 1.0]], { yaw: 60, pitch: 22, fov: 40, margin: 1.0 }); cam.fov *= K.punch(f, F.FINGER, 0.08, 6);
    } else if (sh(1040, 1110)) {              // 21. next to the hinge: you need an elephant
      cam = K.fit([[DX - 0.3, 0, DZ - 0.5], [DX + 1.6, 2.6, DZ + 3.2]], { yaw: 40, pitch: 14, fov: 42, margin: 0.95 }); cam.fov *= K.punch(f, F.ELE, 0.1, 6);
    } else if (sh(1110, 1175)) {              // 22. Chester moves every knob to the edge (wide, rebuilt)
      cam = K.fit([[-1.5, 0, 0], [1.5, 3.4, 0], [0.55, 0, 0.6], ...body(0.85, 0.5)], { yaw: 72, pitch: 8, fov: 40, margin: 0.9 });
    } else if (sh(1175, 1246)) {              // 23. Mrs. Plum opens it with her pinky (wide, low)
      cam = K.fit([...body(0.85, 0.5), [-0.65, 0, -1.3], [0.7, 2.5, 0], [2.0, 0, 3.2]], { yaw: 108, pitch: 6, fov: 42, margin: 0.9 }); cam.fov *= K.punch(f, F.PINKY, 0.1, 6);
    } else {                                  // 24. Gertrude holds the door; the crowd streams in (wide pull back)
      cam = K.fit([[-2.5, 0, 4.2], [1.5, 0, -0.6], [0, 4.8, 0], [2.0, 0, 3.2]], { yaw: lerp(80, 92, u), pitch: lerp(8, 12, u), fov: 44, margin: 0.9 });
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    if (f >= F.WALL && f < F.WALL + 30) for (let k = 0; k < 3; k++) K.puff(f, F.WALL + 8 + k * 2, -1 + k, -2.4, 14, 1.1, '#e8d8b8');
    if (f >= 476 && f < 530) K.sparks(f, 476, 530, [-0.5, 1.05, 0.2], { dir: [0, 0.6, 1], spread: 0.8, rate: 4, speed: 1.5, life: 10, color: '#e8c090', seed: 4 });
    if (f >= 103 && f < 150) K.sparks(f, 103, 150, [4.6, 0.9, 3.85], { dir: [0, 1, 0.5], spread: 0.9, rate: 5, speed: 1.6, life: 12, color: '#e8c090', seed: 7 });
    K.leaves(f, [cam.look[0], 2, cam.look[2]], { area: 9, count: 10, fall: 0.35, colors: ['#e0802a', '#f2c12e', '#c0502a'] });
    K.mist(f, 845, 16); K.mist(f, 1102, 16);
    K.badge(f, F.KNOB, 'KNOB BY THE HINGE', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 101 });
    K.badge(f, F.WHY, 'WHY FAR FROM THE HINGE?', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 210 });
    K.badge(f, F.TEN, '10 MIN = 1 INCH', { sx: 0.5, sy: 0.2 }, { icon: 'clock', f1: 325 });
    K.badge(f, F.TWO, 'STRONGEST MAN = 2 INCHES', { sx: 0.5, sy: 0.2 }, { icon: 'weight', f1: 474 });
    K.badge(f, F.FORTY, '40 PEOPLE STUCK', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 696 });
    K.badge(f, F.LEVER, 'EDGE = LONG LEVER', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 974 });
    K.badge(f, F.FINGER, '1 FINGER', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1038 });
    K.badge(f, F.ELE, '1 ELEPHANT', { sx: 0.5, sy: 0.2 }, { icon: 'weight', f1: 1108 });
    K.badge(f, F.PINKY, 'PINKY POWER', { sx: 0.5, sy: 0.2 }, { style: 'stamp', size: 1.15, f1: 1244 });
    const L = K.light('golden', { az: 72, el: 34, shadowExt: 22, exposure: 1.3 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
