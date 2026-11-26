// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Chimneys Are So Tall" — invented story, engine: Fish Out of Water (SCRIPTS.md §000).
// Zib the alien ("Short and sweet!") builds his first Earth cottage in Puddleford with a teacup-tall chimney. The first fire's smoke
// ignores it and fills the kitchen; Duchess, who dreams of being the whitest cat in Puddleford, walks out black. Zib opens the six
// windows: smoke pours out like a steam train in a hat and Mrs. Fig next door tries to buy a ticket. He makes the chimney even shorter;
// the wind rolls over the roof and stuffs the smoke back down and out of the mail slot. Explainer (x-ray): hot smoke rises; a tall
// chimney is a tall tube of hot air that pulls like a straw; its top pokes above the roof wind. Zib builds it tall, Duchess licks
// herself white for a week, and his flying saucer now parks on top.
import { TOTAL, LINES, wf } from './shortchimney_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const CHX = 1.7, CHZ = 0.0, CHY = 4.95;     // chimney base on the roof
const DOOR = [0, 2.6];                        // front door (house front faces +z at z = 2.5)
const FIG = [-10.5, 4.4];                     // Mrs. Fig at her gate
const SAU = [7.5, -3.5];                      // saucer parking spot in the back garden
let HOUSEG, HOUSEH, THREE, F = {}, ZIB, FIGW, CATW, CATB, CHIM, CHTOP, SHUT = [], SAUCER, CUP, HOLO, HOTT, WIND = [], WINS = [], ROSE, ANT = [];

function cottage(K, S) {
  const g = new THREE.Group(); K.scene.add(g);
  const wallM = K.mat('plaster', '#f2e6cc', { detail: 0.6 }), beamM = K.mat('wood', '#5a3a24', { detail: 0.4 }), tileM = K.mat('brick', '#a8432e', { detail: 0.35, amt: 0.3 });
  K.rbox(6, 3, 5, 0.04, wallM, 0, 1.5, 0, g);
  for (const x of [-3, -1.0, 1.0, 3]) K.rbox(0.18, 3.0, 0.1, 0.02, beamM, x * 0.99, 1.5, 2.53, g);
  K.rbox(6.1, 0.18, 0.12, 0.02, beamM, 0, 2.95, 2.53, g); K.rbox(6.1, 0.18, 0.12, 0.02, beamM, 0, 0.1, 2.53, g);
  for (const s of [-1, 1]) { const b = K.rbox(0.14, 2.2, 0.1, 0.02, beamM, s * 2.0, 1.5, 2.54, g); b.rotation.z = s * 0.6; }
  // gable roof (ridge along x)
  for (const s of [-1, 1]) { const r = K.rbox(6.8, 0.22, 3.4, 0.05, tileM, 0, 4.05, s * 1.25, g); r.rotation.x = s * 0.75; }
  for (let k = 0; k < 9; k++) for (const s of [-1, 1]) { const t = K.rbox(6.82, 0.05, 0.08, 0.01, K.paint('#7a2a1e', { coat: 0 }), 0, 3.0 + k * 0.2 + 0.18, s * (2.7 - k * 0.27), g); t.rotation.x = s * 0.75; }
  const ridge = K.rbox(6.9, 0.18, 0.3, 0.06, K.paint('#6a2418'), 0, 5.12, 0, g);
  for (const sx of [-1, 1]) { const tri = new THREE.Shape(); tri.moveTo(-2.5, 0); tri.lineTo(2.5, 0); tri.lineTo(0, 2.05); tri.lineTo(-2.5, 0); const m = new THREE.Mesh(new THREE.ExtrudeGeometry(tri, { depth: 0.1, bevelEnabled: false }), wallM); m.rotation.y = Math.PI / 2; m.position.set(sx * 3.0 - 0.05, 3.0, 0); m.castShadow = true; g.add(m); }
  // round-top door with a gold mail slot + knocker + step
  K.rbox(1.1, 1.9, 0.12, 0.04, K.paint('#2a62c8', { rough: 0.3 }), DOOR[0], 0.95, 2.5, g); const top = K.cyl(0.55, 0.55, 0.12, K.paint('#2a62c8', { rough: 0.3 }), DOOR[0], 1.9 - 0.06, 2.5, g, 24); top.rotation.x = Math.PI / 2; top.position.set(DOOR[0], 1.9, 2.5);
  K.rbox(0.5, 0.07, 0.04, 0.01, K.gold(), DOOR[0], 1.05, 2.58, g); K.sphere(0.07, K.gold(), DOOR[0] + 0.38, 1.0, 2.6, g); K.rbox(1.6, 0.18, 0.8, 0.04, K.mat('rock', '#a8a49c'), DOOR[0], 0.09, 2.9, g);
  const nm = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.32), S.textMat('ZIB · NO. 7', { bg: '#f4efe4', fg: '#2a62c8', w: 500, h: 110 })); nm.position.set(DOOR[0], 2.65, 2.56); g.add(nm);
  // six windows (two front, two per side) with shutters that swing open, flower boxes
  const wins = [[-1.9, 1.6, 2.53, 0], [1.9, 1.6, 2.53, 0], [3.03, 1.6, 1.1, Math.PI / 2], [3.03, 1.6, -1.1, Math.PI / 2], [-3.03, 1.6, 1.1, -Math.PI / 2], [-3.03, 1.6, -1.1, -Math.PI / 2]];
  for (const [x, y, z, ry] of wins) { const w = new THREE.Group(); w.position.set(x, y, z); w.rotation.y = ry; g.add(w);
    K.rbox(1.0, 1.0, 0.06, 0.02, K.glass({ color: '#5a6a7a', opacity: 0.85 }), 0, 0, 0, w); K.rbox(1.12, 0.08, 0.1, 0.02, K.paint('#f4efe4'), 0, 0.54, 0.02, w); K.rbox(1.12, 0.08, 0.1, 0.02, K.paint('#f4efe4'), 0, -0.54, 0.02, w); K.rbox(0.06, 1.0, 0.08, 0.01, K.paint('#f4efe4'), 0, 0, 0.03, w); K.rbox(1.0, 0.06, 0.08, 0.01, K.paint('#f4efe4'), 0, 0, 0.03, w);
    K.rbox(1.1, 0.2, 0.25, 0.03, K.mat('wood', '#7a4a2a'), 0, -0.68, 0.12, w); for (let k = 0; k < 5; k++) K.sphere(0.08, K.paint(['#e0482a', '#f2c12e', '#f08aa8', '#ffffff', '#9a5ad8'][k], { coat: 0 }), -0.4 + k * 0.2, -0.55, 0.15, w);
    for (const s of [-1, 1]) { const h = new THREE.Group(); h.position.set(s * 0.52, 0, 0.06); w.add(h); K.rbox(0.5, 1.0, 0.05, 0.02, K.paint('#2a9a6a', { rough: 0.4 }), s * 0.25 * -1, 0, 0, h); for (let k = 0; k < 5; k++) K.rbox(0.42, 0.025, 0.02, 0, K.paint('#1f6a4a'), -s * 0.25, -0.38 + k * 0.19, 0.035, h); h.userData.s = s; SHUT.push(h); }
    WINS.push(w); }
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; o.material = o.material.clone(); } });
  return g; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { CAT: wf(0, 'cat'), WALKED: wf(0, 'walked'), BLACK: wf(0, 'black'), ZIB: wf(1, 'zib'), ALIEN: wf(1, 'alien'), CHIMNEY: wf(1, 'chimney'), TEACUP: wf(1, 'teacup'), SWEET: wf(1, 'and') + 6, WHY: wf(1, 'why'), TALL1: wf(1, 'tall'),
      LIT: wf(2, 'lit'), FIRE: wf(2, 'fire'), SMOKE: wf(2, 'smoke'), IGNORED: wf(2, 'ignored'), FILLED: wf(2, 'filled'), DUCH: wf(3, 'duchess'), DREAM: wf(3, 'dream'), WHITEST: wf(3, 'whitest'), GONE: wf(3, 'gone'), FOUR: wf(3, 'four'),
      OPENED: wf(4, 'opened'), POURED: wf(4, 'poured'), SIX: wf(4, 'six'), TRAIN: wf(4, 'train'), HAT: wf(4, 'hat'), FIG: wf(5, 'fig'), WAVED: wf(5, 'waved'), BUY: wf(5, 'buy'), TICKET: wf(5, 'ticket'),
      MADE: wf(6, 'made'), SHORTER: wf(6, 'shorter'), SWEET2: wf(6, 'and') + 6, WIND: wf(7, 'wind'), ROLLED: wf(7, 'rolled'), STUFFED: wf(7, 'stuffed'), BACK: wf(7, 'back'), MAIL: wf(7, 'mail'), SLOT: wf(7, 'slot'),
      WHAT: wf(8, 'what'), HOT: wf(9, 'hot'), LIGHT: wf(9, 'light'), RISE: wf(9, 'rise'), TALLC: wf(10, 'tall'), TUBE: wf(10, 'tube'), PULLS: wf(10, 'pulls'), STRAW: wf(10, 'straw'),
      TOP: wf(11, 'top'), ABOVE: wf(11, 'above'), WINDX: wf(11, 'wind'), PUSH: wf(11, 'push'), BUILT: wf(12, 'built'), TALL2: wf(12, 'tall'), LICK: wf(12, 'licking'), WHITE2: wf(12, 'white'), SAUCER: wf(13, 'saucer'), PARKS: wf(13, 'parks'), TOPX: wf(13, 'top') };
    // ================= Puddleford lane =================
    const G = K.group();
    K.slab(-40, 40, -0.1, 0, -40, 40, K.mat('grime', '#6aa84f', { detail: 1.6, amt: 0.4 }), G, false);
    K.slab(-40, 40, -0.08, 0.02, 5.2, 8.6, K.mat('rock', '#9a948a', { detail: 0.35, amt: 0.35, bump: 0.02 }), G, false);           // cobbled lane
    K.slab(-40, 40, 0, 0.06, 5.0, 5.2, K.mat('rock', '#c8c4bc'), G); K.slab(-40, 40, 0, 0.06, 8.6, 8.8, K.mat('rock', '#c8c4bc'), G);
    K.slab(-0.6, 0.6, -0.08, 0.03, 2.9, 5.0, K.mat('rock', '#b8b0a4', { detail: 0.3 }), G, false);                               // garden path
    for (let x = -4.5; x <= 4.5; x += 0.5) { if (Math.abs(x) < 0.8) continue; K.rbox(0.1, 0.8, 0.05, 0.02, K.paint('#f4efe4', { rough: 0.5 }), x, 0.4, 4.7, G); }   // picket fence
    for (const z of [4.7]) K.rbox(9.2, 0.07, 0.04, 0.01, K.paint('#f4efe4'), 0, 0.55, z - 0.04, G);
    for (let k = 0; k < 14; k++) K.sphere(0.12 + hash(k) * 0.06, K.paint(['#e0482a', '#f2c12e', '#f08aa8', '#ffffff', '#9a5ad8'][k % 5], { coat: 0 }), -4 + k * 0.6 + (k > 6 ? 0.8 : 0), 0.15, 4.2, G);
    // post box, lamp post, bench, gnome, well, trees, hills
    K.rbox(0.45, 1.1, 0.4, 0.15, K.paint('#d0302a', { rough: 0.3 }), 4.6, 0.55, 5.6, G); K.rbox(0.5, 0.1, 0.45, 0.04, K.paint('#1a1a1a'), 4.6, 1.12, 5.6, G); const pb = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.14), S.textMat('POST', { bg: '#1a1a1a', fg: '#f2c230', w: 200, h: 80, border: false })); pb.position.set(4.6, 0.85, 5.81); G.add(pb);
    const lp = S.streetLamp(); lp.position.set(-4.8, 0, 5.4); const bn = S.bench(); bn.position.set(2.8, 0, 8.9); bn.rotation.y = Math.PI;
    K.cyl(0.15, 0.2, 0.4, K.paint('#2a62c8'), 3.6, 0, 3.6, G, 12); K.sphere(0.13, K.paint('#f1c9a5'), 3.6, 0.5, 3.6, G); const gh = K.cyl(0.0, 0.15, 0.35, K.paint('#d0302a'), 3.6, 0.58, 3.6, G, 12); K.sphere(0.1, K.paint('#f4efe4'), 3.6, 0.42, 3.72, G);
    K.cyl(0.9, 0.9, 0.8, K.mat('rock', '#a8a49c', { detail: 0.3 }), -4.4, 0, -2.5, G, 20); for (const s of [-1, 1]) K.rbox(0.12, 1.6, 0.12, 0.02, K.mat('wood', '#6a4a2a'), -4.4 + s * 0.8, 1.6, -2.5, G);
    for (let k = 0; k < 14; k++) { const t = S.tree({ h: 4.5 + hash(k) * 3, seed: k }); t.position.set(-24 + k * 3.6 + hash(k + 3) * 2, 0, -9 - hash(k + 7) * 6); }
    for (let k = 0; k < 6; k++) { const t = S.tree({ h: 4 + hash(k + 20) * 2, seed: k + 30 }); t.position.set(-30 + k * 12, 0, 13 + hash(k) * 4); }
    for (let k = 0; k < 5; k++) { const h = K.sphere(18 + hash(k) * 8, K.mat('grime', ['#5f9a44', '#6aa84f', '#4f8a3a'][k % 3], { detail: 4 }), -50 + k * 25, -12, -45 - hash(k + 2) * 10, G, 1, 0.6, 1); }
    // Mrs. Fig's cottage next door + a third house across the lane
    const fh = S.building({ w: 6, d: 5, floors: 2, color: '#e8c8a0', gable: 'flat', shutters: '#c0392b', flowers: true, seed: 4 }, G); fh.position.set(-10.5, 0, 0.5);
    const oh = S.building({ w: 7, d: 5, floors: 2, color: '#c8d8e8', gable: 'flat', shutters: '#2a62c8', flowers: true, seed: 9, shop: 'TEA ROOM', awning: '#2a9a6a' }, G); oh.position.set(-4, 0, 19); oh.rotation.y = Math.PI;
    const fs = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.4), S.textMat('MRS. FIG', { bg: '#f4efe4', fg: '#c0392b', w: 400, h: 110 })); fs.position.set(-10.5, 1.0, 4.75); G.add(fs); K.cyl(0.04, 0.04, 1.0, K.mat('wood', '#6a4a2a'), -10.5, 0, 4.7, G, 6);
    const ws = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.6), S.textMat('WELCOME TO PUDDLEFORD', { bg: '#2a6a3a', fg: '#ffffff', w: 800, h: 180 })); ws.position.set(9, 1.6, 5.0); ws.rotation.y = -0.4; G.add(ws); for (const s of [-1, 1]) K.cyl(0.05, 0.05, 1.6, K.mat('wood', '#6a4a2a'), 9 + s * 1.0, 0, 5.0 + s * 0.4, G, 6);
    S.bake(G);
    // ================= the cottage (hero prop) + chimney =================
    HOUSEG = cottage(K, S); HOUSEH = HOUSEG.clone(true); sc.add(HOUSEH); { const hm = K.holo('#36e2ff'); HOUSEH.traverse((o) => { if (o.isMesh) { o.material = hm; o.castShadow = false; } }); }
    CHIM = new THREE.Group(); CHIM.position.set(CHX, CHY, CHZ); sc.add(CHIM); const bm = K.mat('brick', '#b0583e', { detail: 0.25 });
    const stack = K.rbox(0.8, 1, 0.8, 0.03, bm, 0, 0.5, 0, CHIM); CHIM.userData.stack = stack;
    CHTOP = new THREE.Group(); CHIM.add(CHTOP); K.rbox(0.95, 0.14, 0.95, 0.03, K.mat('rock', '#c8c4bc'), 0, 0.07, 0, CHTOP); K.cyl(0.16, 0.2, 0.3, K.paint('#c8783a', { rough: 0.5 }), 0, 0.14, 0, CHTOP, 16); K.cyl(0.2, 0.2, 0.05, K.paint('#a8582a'), 0, 0.42, 0, CHTOP, 16);
    CUP = new THREE.Group(); sc.add(CUP); CUP.scale.setScalar(1.6); { const cm = K.paint('#f4efe4', { rough: 0.2 }); K.cyl(0.32, 0.22, 0.42, cm, 0, 0, 0, CUP, 24); const h = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.04, 8, 16), cm); h.position.set(0.36, 0.22, 0); CUP.add(h); K.cyl(0.42, 0.42, 0.03, cm, 0, -0.02, 0, CUP, 24); K.cyl(0.33, 0.33, 0.02, K.paint('#2a62c8'), 0, 0.33, 0, CUP, 24); }
    CUP.position.set(CHX + 1.05, CHY - 0.05, CHZ + 0.2);
    // rosette for Duchess (whitest cat)
    ROSE = new THREE.Group(); sc.add(ROSE); { for (let k = 0; k < 2; k++) { const r = K.rbox(0.1, 0.35, 0.02, 0.01, K.paint('#2a62c8'), -0.06 + k * 0.12, -0.2, 0, ROSE); r.rotation.z = -0.3 + k * 0.6; } K.cyl(0.18, 0.18, 0.03, K.paint('#2a62c8'), 0, -0.015, 0, ROSE, 20).rotation.x = Math.PI / 2; const tx = new THREE.Mesh(new THREE.CircleGeometry(0.13, 20), S.textMat('1ST', { bg: '#f2c230', fg: '#1a1a1a', w: 128, h: 128, border: false })); tx.position.z = 0.03; ROSE.add(tx); }
    // flying saucer (glossy chrome, glass dome, lights, legs)
    SAUCER = new THREE.Group(); sc.add(SAUCER); { const d = K.sphere(1.7, K.chrome({ rough: 0.15 }), 0, 0, 0, SAUCER, 1, 0.28, 1); K.sphere(0.85, K.glass({ color: '#9ae0ff', opacity: 0.45 }), 0, 0.35, 0, SAUCER, 1, 0.75, 1); const rim = new THREE.Mesh(new THREE.TorusGeometry(1.68, 0.07, 8, 40), K.gold()); rim.rotation.x = Math.PI / 2; SAUCER.add(rim);
      for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; const l = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(k % 2 ? '#7af8a0' : '#ffd23a').multiplyScalar(2), toneMapped: false })); l.position.set(Math.cos(a) * 1.5, -0.05, Math.sin(a) * 1.5); SAUCER.add(l); }
      for (let k = 0; k < 3; k++) { const a = k / 3 * Math.PI * 2; const leg = K.cyl(0.04, 0.04, 0.8, K.chrome(), Math.cos(a) * 1.0, -0.95, Math.sin(a) * 1.0, SAUCER, 8); leg.rotation.z = Math.cos(a) * 0.3; leg.rotation.x = -Math.sin(a) * 0.3; SAUCER.userData.legs = (SAUCER.userData.legs || []).concat(leg); }
      const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.2), S.textMat('GLORP-1', { bg: '#f2c230', fg: '#1a1a1a', w: 256, h: 70, border: false })); plate.position.set(0, -0.1, 1.72); SAUCER.add(plate); }
    SAUCER.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    // explainer: x-ray house, hot-air column, wind lines
    HOLO = K.holoBox(6.2, 5.3, 5.2, 0, 2.65, 0, sc, '#36e2ff');
    HOTT = K.trace(Array.from({ length: 14 }, (_, k) => [CHX + 0.3 * Math.sin(k * 0.8) * (k < 5 ? 1 : 0.2), 0.7 + k * 0.6, CHZ + (k < 5 ? 0.4 : 0)]), { color: '#ff8a2a', r: 0.07 });
    for (let j = 0; j < 3; j++) { const pts = []; for (let i = 0; i <= 26; i++) { const z = 9 - i * 0.7, y0 = 1.5 + j * 1.1; const hump = Math.max(0, 5.3 - Math.abs(z) * 0.75 + 0.2 - (y0 - 1.5) * 0.0); pts.push([CHX - 0.4 + j * 0.05, Math.max(y0, hump + 0.3 + j * 0.45), z]); } WIND.push(K.trace(pts, { color: '#9ad8ff', r: 0.045 })); }
    // fire glow inside
    K.lamp(-0.8, 1.0, 0.5, { color: '#ff9a40', intensity: 2.5, distance: 5, flicker: 0.3 });
    // ================= characters =================
    ZIB = K.stick({ skin: '#8ad86a', jacket: '#7a4ad8', pants: '#2a2a40', boots: '#f2c230', scarf: '#f2c230', belt: '#f2c230', pockets: true, glasses: '#2a2a2a' }, { key: 'zib' });
    for (const s of [-1, 1]) { const a = new THREE.Group(); ZIB.head.add(a); a.position.set(s * 0.1, 0.22, 0); a.rotation.z = -s * 0.35; K.cyl(0.015, 0.015, 0.3, K.paint('#5aa83a'), 0, 0, 0, a, 6); K.sphere(0.06, new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffd23a').multiplyScalar(1.6), toneMapped: false }), 0, 0.32, 0, a); ANT.push(a); }
    FIGW = K.stick({ jacket: '#c0392b', pants: '#5a3a5a', hairStyle: 'bun', hair: '#d8d4cc', dress: '#9a5ad8', apron: '#f4efe4', glasses: true, scarf: '#f2c230' }, { key: 'fig' });
    CATW = K.animal('cat', { color: '#fbfaf6', seed: 6, scale: 1.25 }); CATB = K.animal('cat', { color: '#2a2a2e', seed: 6, scale: 1.25 });
    K.addClouds(10, 600, 150);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s);
    const ex = f >= 895 && f < 1198;
    // ---------- chimney height ----------
    let H = 0.35; if (f >= F.MADE - 4 && f < 1000) H = lerp(0.35, 0.1, sm(F.SHORTER - 6, F.SHORTER + 6, f)); if (f >= 1000) H = lerp(0.1, 3.9, sm(F.TALLC - 4, F.TUBE + 6, f));
    CHIM.userData.stack.scale.y = H; CHIM.userData.stack.position.y = H / 2; CHTOP.position.y = H;
    const topW = [CHX, CHY + H + 0.45, CHZ];
    CUP.visible = f >= 98 && f < 253;
    // ---------- shutters ----------
    const op = f >= F.OPENED - 4 && f < 895 ? sm(F.OPENED - 4, F.OPENED + 8, f) : 0; SHUT.forEach((h, k) => { h.rotation.y = -h.userData.s * op * 1.9 * (0.9 + 0.1 * Math.sin(k)); });
    // ---------- Duchess ----------
    const black = (f < 98) || (f >= F.GONE && f < F.WHITE2);
    let cp = { x: DOOR[0] + 0.6, z: DOOR[1] + 0.8, yaw: 0, mode: 'sit', expr: 'neutral' };
    if (f < 98) { const W = K.walkPath(f, 0, [[DOOR[0], DOOR[1] + 0.2], [DOOR[0] + 0.1, 4.0]], 0.6); cp = { x: W.x, z: W.z, yaw: 0, mode: W.moving ? 'walk' : 'stand', expr: f > 40 ? 'angry' : 'shock' }; }
    if (f >= 98 && f < 363) cp = { x: DOOR[0] + 0.7, z: DOOR[1] + 0.7, yaw: 0.2, mode: 'sit', expr: f >= F.SMOKE ? 'shock' : 'happy' };
    if (f >= 363 && f < 495) cp = { x: DOOR[0] + 0.7, z: DOOR[1] + 0.7, yaw: 0.3, mode: f < F.GONE ? 'sit' : 'stand', expr: f < F.GONE ? 'happy' : 'angry' };
    if (f >= 495 && f < 895) cp = { x: 2.2, z: 3.9, yaw: -0.4, mode: 'sit', expr: f >= F.SLOT ? 'shock' : 'angry' };
    if (f >= 1198) cp = { x: 1.6, z: 3.8, yaw: -0.3, mode: f >= F.LICK - 4 && f < F.WHITE2 + 6 ? 'eat' : 'sit', expr: f >= F.WHITE2 ? 'happy' : 'sleepy' };
    if (ex) cp = { visible: false };
    CATW.set(f, { ...cp, visible: cp.visible !== false && !black }); CATB.set(f, { ...cp, visible: cp.visible !== false && black });
    ROSE.visible = !ex && f >= 363 && f < 495; if (ROSE.visible) ROSE.position.set(cp.x + 0.0, 0.62, cp.z + 0.4);
    // ---------- Zib ----------
    let zp = { x: DOOR[0] - 0.6, z: DOOR[1] + 0.5, yaw: 0.1 };
    if (f >= 98 && f < 253) zp = { x: 2.4, z: 4.0, yaw: -0.5 };
    if (f >= 253 && f < 495) zp = { x: DOOR[0] - 0.5, z: DOOR[1] + 0.4, yaw: 0.2 };
    if (f >= 495 && f < 712) zp = { x: DOOR[0] - 1.0, z: 3.6, yaw: 0.4 };
    if (f >= 712 && f < 795) zp = { x: CHX - 0.9, y: 4.1, z: CHZ + 1.1, yaw: 0.6 };
    if (f >= 795 && f < 895) zp = { x: DOOR[0] - 1.2, z: 3.7, yaw: 0.3 };
    if (f >= 1198) zp = { x: -1.2, z: 4.0, yaw: 0.2 };
    const zk = [[0, 'panic', { expr: 'dazed', sweat: true }], [98, 'show', { expr: 'proud' }], [F.TEACUP - 4, 'pointUp', { expr: 'grin' }], [F.SWEET - 8, 'cheer', { expr: 'proud', talk: true }], [F.WHY, 'hips', { expr: 'smug' }],
      [253, 'idle', { expr: 'excited' }], [F.SMOKE, 'shock', { expr: 'shock' }], [F.FILLED, 'panic', { expr: 'scared', sweat: true }], [363, 'idle', { expr: 'nervous' }], [F.GONE, 'facepalm', { expr: 'pained' }],
      [495, 'push', { expr: 'stern' }], [F.POURED, 'shock', { expr: 'confused' }], [627, 'shrug', { expr: 'confused' }], [F.TICKET, 'scared', { expr: 'nervous', sweat: true }],
      [712, 'hammer', { expr: 'grin', R: [0.3, 0.3, 'hammer'] }], [F.SWEET2 - 8, 'cheer', { expr: 'proud', talk: true }], [795, 'idle', { expr: 'proud' }], [F.STUFFED, 'shock', { expr: 'shock' }], [F.SLOT, 'panic', { expr: 'scared' }],
      [1198, 'show', { expr: 'proud' }], [F.LICK, 'idle', { expr: 'smile' }], [1289, 'pointUp', { expr: 'excited' }], [F.PARKS, 'cheer', { expr: 'laugh' }]];
    const ZA = T.act(f, zk, { seed: 5, blink: blink(5), phase: (f / 20) % 1 });
    ZIB.set(ZA, { ...zp, visible: !ex }); ANT.forEach((a, k) => { a.rotation.x = 0.25 * Math.sin(f * 0.25 + k * 2); });
    // ---------- Mrs. Fig ----------
    let fp = { x: FIG[0] + 1.2, z: FIG[1], yaw: 0.9 };
    if (f >= 670 && f < 712) fp = { x: DOOR[0] + 1.0, z: DOOR[1] + 1.2, yaw: Math.PI - 0.2 };
    if (f >= 795 && f < 895) fp = { x: DOOR[0] + 0.3, z: 4.1, yaw: Math.PI };
    if (f >= 1198) fp = { x: 2.8, z: 5.6, yaw: -2.6 };
    const fk = [[0, 'shock', { expr: 'shock' }], [98, 'idle', { expr: 'smile' }], [627, 'wave', { expr: 'excited' }], [670, 'show', { expr: 'smile', R: [0.3, 0.3, 'money'] }], [F.TICKET, 'show', { expr: 'grin', R: [0.3, 0.3, 'money'] }],
      [795, 'idle', { expr: 'neutral' }], [F.SLOT, 'shock', { expr: 'shock' }], [F.SLOT + 12, 'facepalm', { expr: 'dazed' }], [1198, 'clap', { expr: 'smile' }], [F.PARKS, 'pointUp', { expr: 'shock' }]];
    FIGW.set(T.act(f, fk, { seed: 8, blink: blink(8) }), { ...fp, visible: !ex && (f < 98 || f >= 495) });
    // ---------- saucer ----------
    let sp = { x: SAU[0], y: 1.25, z: SAU[1], ry: f * 0.01 };
    if (f >= 1289) { const u = sm(1295, F.PARKS + 10, f); sp = { x: lerp(SAU[0] + 4, CHX, u), y: lerp(10, CHY + H + 1.45, u), z: lerp(SAU[1] - 4, CHZ, u), ry: f * 0.05 }; }
    SAUCER.position.set(sp.x, sp.y, sp.z); SAUCER.rotation.y = sp.ry; SAUCER.visible = !ex && !(f >= 1198 && f < 1289);
    // ---------- explainer ----------
    HOLO.visible = ex; HOUSEG.visible = !ex; HOUSEH.visible = ex; HOTT.show(ex && f >= 941 ? sm(F.HOT - 4, f < 1000 ? F.RISE + 6 : F.PULLS + 4, f) * (f < 1000 ? 0.4 : 1) : 0);
    WIND.forEach((w, j) => w.show(ex && f >= F.TOP - 10 ? sm(F.TOP - 10 + j * 4, F.WINDX + 6 + j * 4, f) : (f >= F.WIND - 4 && f < 850 ? sm(F.WIND - 4 + j * 3, F.ROLLED + 10 + j * 3, f) : 0)));
    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const body = (x, z, y = 0, h = 2.1) => [[x, y, z], [x, y + h, z]];
    const HOUSE = [[-3, 0, -2.5], [3, 0, 2.5], [0, 5.4, 0]];
    if (sh(0, 48)) {                          // 1. hook: the black cat walks out of the smoking cottage, Zib coughing in the doorway (wide)
      cam = K.fit([[-3, 0, 2.5], [3, 3.2, 2.5], ...body(DOOR[0] - 0.6, DOOR[1] + 0.5), [cp.x, 0, cp.z]], { yaw: 75, pitch: 6, fov: 42, margin: 0.9, maxDist: 12 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(48, 98)) {                  // 2. low on Duchess walking out, completely black (low wide)
      cam = K.fit([[cp.x - 1.2, 0, cp.z], [cp.x + 1.2, 1.2, cp.z], ...body(DOOR[0] - 0.6, DOOR[1] + 0.5)], { yaw: 100, pitch: 2, fov: 40, margin: 0.9, maxDist: 9 }); cam.fov *= K.punch(f, F.BLACK, 0.12, 6);
    } else if (sh(98, 150)) {                 // 3. Zib, an alien (wide: Zib, the saucer, the cottage)
      cam = K.fit([...body(2.4, 4.0), [SAU[0] + 1.7, 0, SAU[1]], [-3, 0, 2.5], [0, 5.4, 0]], { yaw: 70, pitch: 8, fov: 42, margin: 0.9, maxDist: 14 }); cam.fov *= K.punch(f, F.ALIEN, 0.08, 6);
    } else if (sh(150, 200)) {                // 4. the chimney: teacup-tall, next to a teacup (roof insert-wide)
      cam = K.fit([[CHX - 1.4, CHY - 0.4, CHZ], [CHX + 1.6, CHY + 1.0, CHZ + 0.6], [CHX + 1.05, CHY + 0.6, CHZ + 0.2]], { yaw: 80, pitch: 22, fov: 40, margin: 1.0, maxDist: 6 }); cam.fov *= K.punch(f, F.TEACUP, 0.1, 6);
    } else if (sh(200, 253)) {                // 5. "Short and sweet!" — why so tall? (Zib reaction close)
      cam = { pos: [2.4 + 0.8, 1.9, 4.0 + 2.6], look: [2.4, 1.6, 4.0], fov: 40 * K.push(u, 0.06) }; dof = { focus: 2.8, cinf: 12 };
    } else if (sh(253, 305)) {                // 6. the first fire: smoke ignores the tiny chimney (wide)
      cam = K.fit([...HOUSE, ...body(DOOR[0] - 0.5, DOOR[1] + 0.4)], { yaw: 60, pitch: 12, fov: 42, margin: 0.88, maxDist: 14 }); cam.fov *= K.punch(f, F.IGNORED, 0.08, 6);
    } else if (sh(305, 363)) {                // 7. ...and filled the kitchen: smoke billowing out of the door, Zib coughing (wide door)
      cam = K.fit([[-1.6, 0, 2.6], [1.6, 3.0, 2.6], ...body(DOOR[0] - 0.5, DOOR[1] + 0.4), [cp.x, 0, cp.z]], { yaw: 110, pitch: 6, fov: 40, margin: 0.95, maxDist: 9 }); cam.fov *= K.punch(f, F.FILLED, 0.08, 6);
    } else if (sh(363, 420)) {                // 8. Duchess, Puddleford's whitest cat, rosette (reaction close)
      cam = { pos: [cp.x + 0.6, 0.9, cp.z + 2.2], look: [cp.x, 0.55, cp.z], fov: 40 * K.push(u, 0.06) }; dof = { focus: 2.3, cinf: 12 };
    } else if (sh(420, 495)) {                // 9. gone in four seconds: the smoke rolls over her (wide)
      cam = K.fit([[-1.6, 0, 2.6], [1.6, 3.0, 2.6], [cp.x, 0, cp.z + 0.5], ...body(DOOR[0] - 0.5, DOOR[1] + 0.4)], { yaw: 70, pitch: 10, fov: 40, margin: 0.95, maxDist: 9 }); cam.fov *= K.punch(f, F.GONE, 0.14, 6);
    } else if (sh(495, 545)) {                // 10. Zib opens the windows: shutters fly open (wide front)
      cam = K.fit([...HOUSE, ...body(DOOR[0] - 1.0, 3.6)], { yaw: 90, pitch: 6, fov: 42, margin: 0.85, maxDist: 13 }); cam.fov *= K.punch(f, F.OPENED, 0.08, 6);
    } else if (sh(545, 625)) {                // 11. smoke out of all six, like a steam train in a hat (high 3/4 wide)
      cam = K.fit([...HOUSE, [4, 0, 2], [-4, 0, -2]], { yaw: 45, pitch: 26, fov: 44, margin: 0.85, maxDist: 15 }); cam.fov *= K.punch(f, F.TRAIN, 0.08, 6);
    } else if (sh(625, 670)) {                // 12. Mrs. Fig next door waves at it (wide, both houses)
      cam = K.fit([...body(fp.x, fp.z), [-3, 0, 2.5], [-1, 5.4, 0], [FIG[0] - 1, 0, 3]], { yaw: 70, pitch: 8, fov: 46, margin: 0.85, maxDist: 11 }); cam.fov *= K.punch(f, F.WAVED, 0.08, 6);
    } else if (sh(670, 712)) {                // 13. ...and tries to buy a ticket (wide on the door)
      cam = K.fit([...body(fp.x, fp.z), ...body(DOOR[0] - 1.0, 3.6), [-1.6, 3.0, 2.6]], { yaw: 60, pitch: 6, fov: 40, margin: 0.95, maxDist: 9 }); cam.fov *= K.punch(f, F.TICKET, 0.12, 6);
    } else if (sh(712, 755)) {                // 14. Zib makes the chimney even shorter (roof wide)
      cam = K.fit([[CHX - 2.2, CHY - 1.0, CHZ], [CHX + 1.2, CHY + 0.6, CHZ + 1.2], ...body(zp.x, zp.z, 4.1)], { yaw: 60, pitch: 12, fov: 40, margin: 0.95, maxDist: 9 }); cam.fov *= K.punch(f, F.SHORTER, 0.12, 6);
    } else if (sh(755, 797)) {                // 15. "Short and sweet!" (Zib on the roof, low looking up, sky)
      cam = K.fit([[CHX - 1.2, CHY - 0.6, CHZ], ...body(zp.x, zp.z, 4.1)], { yaw: 100, pitch: 18, fov: 40, margin: 1.2, maxDist: 8 }); cam.fov *= K.punch(f, F.SWEET2, 0.08, 6);
    } else if (sh(797, 850)) {                // 16. the wind rolls over the roof and stuffs the smoke back down (side wide)
      cam = K.fit([...HOUSE, [0, 6.5, 0], [0, 0, 6]], { yaw: 5, pitch: 8, fov: 44, margin: 0.85, maxDist: 15 }); cam.fov *= K.punch(f, F.STUFFED, 0.08, 6);
    } else if (sh(850, 895)) {                // 17. out of the mail slot (wide door, Mrs. Fig + Duchess)
      cam = K.fit([[-1.3, 0, 2.6], [1.3, 2.4, 2.6], ...body(fp.x, fp.z), [cp.x, 0, cp.z], ...body(DOOR[0] - 1.2, 3.7)], { yaw: 75, pitch: 4, fov: 40, margin: 0.95, maxDist: 9 }); cam.fov *= K.punch(f, F.SLOT, 0.14, 6); const s = K.shake(f, F.SLOT, 0.04, 8); cam.pos[1] += s[1];
    } else if (sh(895, 940)) {                // 18. x-ray: so what's a tall chimney for?
      cam = K.fit([...HOUSE, [CHX, CHY + 1, CHZ]], { yaw: 20, pitch: 10, fov: 42, margin: 0.85, maxDist: 14 });
    } else if (sh(940, 1000)) {               // 19. hot smoke is light, it wants to rise (glowing hot air)
      cam = K.fit([[-1.5, 0, -1.5], [CHX + 0.5, CHY + 1.5, 1.5]], { yaw: 70, pitch: 6, fov: 40, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.RISE, 0.08, 6);
    } else if (sh(1000, 1050)) {              // 20. a tall chimney: the stack grows (wide, looking up)
      cam = K.fit([...HOUSE, [CHX, CHY + 4.6, CHZ]], { yaw: 40, pitch: 4, fov: 44, margin: 0.85, maxDist: 15 }); cam.fov *= K.punch(f, F.TUBE, 0.08, 6);
    } else if (sh(1050, 1104)) {              // 21. ...pulls like a straw (other side, the glowing column)
      cam = K.fit([[CHX - 1, 0.5, CHZ - 1], [CHX + 1, CHY + 4.6, CHZ + 1], [-3, 0, 0]], { yaw: 120, pitch: 10, fov: 42, margin: 0.85, maxDist: 14 }); cam.fov *= K.punch(f, F.STRAW, 0.1, 6);
    } else if (sh(1104, 1150)) {              // 22. its top pokes above the roof (side, wind lines)
      cam = K.fit([...HOUSE, [CHX, CHY + 4.6, CHZ], [0, 3, 8]], { yaw: 0, pitch: 6, fov: 44, margin: 0.85, maxDist: 15 }); cam.fov *= K.punch(f, F.ABOVE, 0.08, 6);
    } else if (sh(1150, 1198)) {              // 23. where wind can't push the smoke back in (high)
      cam = K.fit([...HOUSE, [CHX, CHY + 4.8, CHZ], [0, 3, 8]], { yaw: -30, pitch: 22, fov: 44, margin: 0.85, maxDist: 15 }); cam.fov *= K.punch(f, F.PUSH, 0.08, 6);
    } else if (sh(1198, 1243)) {              // 24. Zib built it tall (wide front, clean smoke)
      cam = K.fit([...HOUSE, [CHX, CHY + 5, CHZ], ...body(zp.x, zp.z)], { yaw: 75, pitch: 6, fov: 44, margin: 0.85, maxDist: 15 }); cam.fov *= K.punch(f, F.TALL2, 0.08, 6);
    } else if (sh(1243, 1289)) {              // 25. Duchess licks herself white for a week (wide-ish on the cat + Zib)
      cam = K.fit([[cp.x - 1, 0, cp.z], [cp.x + 1, 1.2, cp.z], ...body(zp.x, zp.z), ...body(fp.x, fp.z)], { yaw: 85, pitch: 8, fov: 40, margin: 0.95, maxDist: 9 }); cam.fov *= K.punch(f, F.WHITE2, 0.12, 6);
    } else {                                  // 26. the flying saucer parks on top (wide pull-back = the hook's cottage front)
      cam = K.fit([...HOUSE, [CHX, CHY + 5.6, CHZ], ...body(zp.x, zp.z), ...body(fp.x, fp.z)], { yaw: lerp(70, 80, u), pitch: 8, fov: 46, margin: 0.85, maxDist: 16 }); cam.fov *= K.punch(f, F.PARKS, 0.1, 6);
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- smoke + effects ----------
    const smokey = (f < 98) || (f >= F.FIRE && f < 895);
    if (smokey) {
      const kitchen = f < 98 || f >= F.SMOKE;
      K.steam(f, topW, { rate: 4, size: 0.6, rise: f >= F.STUFFED && f < 895 ? -0.6 : 0.4, drift: [0.3, 0.2], dark: 0.55 });
      if (kitchen && !(f >= F.OPENED && f < 895 && f >= F.STUFFED)) K.steam(f, [DOOR[0], 1.4, 2.9], { rate: 14, size: 1.5, rise: 1.0, drift: [0.0, 0.8], dark: 0.8, alpha: 1 });
      if (f >= F.POURED - 6 && f < 895) WINS_EMIT(K, f);
      if (f >= F.SLOT - 4 && f < 895) K.steam(f, [DOOR[0], 1.05, 2.8], { rate: 16, size: 1.0, rise: 0.3, drift: [0.0, 1.6], dark: 0.8, alpha: 1 });
    }
    if (f >= 1198) K.steam(f, topW, { rate: 3, size: 0.6, rise: 1.6, drift: [0.4, 0.2], dark: 0.15 });
    if (ex && f >= F.HOT - 4) K.sparks(f, F.HOT - 4, 1198, [-0.8, 0.6, 0.4], { dir: [0.2, 1, -0.1], spread: 0.4, rate: 6, speed: 1.4, life: 40, color: '#ff9a40', seed: 7 });
    if (f >= F.WIND - 4 && f < 895) K.leaves(f, cam.look, { rate: 20, wind: 3 });
    if (f >= F.GONE - 2 && f < F.GONE + 24) K.puff(f, F.GONE, cp.x, cp.z, 10, 0.6, '#3a3a3a');
    if (f >= F.SHORTER - 4 && f < F.SHORTER + 20) K.puff(f, F.SHORTER - 2, CHX, CHZ, 8, 0.5, '#b0583e');
    K.mist(f, 887, 16); K.mist(f, 1190, 16);
    K.badge(f, F.BLACK, 'WHITE CAT → BLACK', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 96 });
    K.badge(f, F.TEACUP, 'CHIMNEY: TEACUP-TALL', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: 196 });
    K.badge(f, F.WHY, 'WHY SO TALL?', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 250 });
    K.badge(f, F.SIX, '6 WINDOWS OF SMOKE', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 622 });
    K.badge(f, F.SHORTER, 'CHIMNEY: EVEN SHORTER', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: 793 });
    K.badge(f, F.LIGHT, 'HOT SMOKE RISES', { sx: 0.5, sy: 0.2 }, { icon: 'down', f1: 996 });
    K.badge(f, F.PULLS, 'TALL = STRONG PULL', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1100 });
    K.badge(f, F.ABOVE, 'ABOVE THE WIND', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1196 });
    K.badge(f, F.PARKS, 'SAUCER PARKING', { sx: 0.5, sy: 0.2 }, { style: 'stamp', size: 1.1, f1: 1380 });
    const L = K.light('golden', { az: 60, el: 32, shadowExt: 20, exposure: 1.2 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
function WINS_EMIT(K, f) { for (const w of WINS) { w.updateMatrixWorld(true); const p = w.localToWorld(new THREE.Vector3(0, 0, 0.5)); K.steam(f, [p.x, p.y, p.z], { rate: 9, size: 1.2, rise: 0.9, drift: [0.3, 0.5], dark: 0.75, alpha: 1 }); } }
