// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The Sheep Accused of Setting Haystacks on Fire" — invented story, engine: The Overconfident Expert (SCRIPTS.md §000).
// Edna's haystacks keep catching fire and Pickles the sheep is always right there, chewing. Famous Inspector Pomfrey ("Case closed!")
// sniffs the sheep, locks him in the chicken coop (the hens were not consulted), ignores farmhand Pip ("the hay was wet when we stacked
// it") and baits the culprit with a fresh wet pile: Tuesday it steams like a kettle, Wednesday it toasts his sandwich, Thursday it bursts
// into flames with Pickles still locked up. Explainer: wet hay is a buffet for billions of bacteria; they eat, make heat, and the tight
// stack traps it like a blanket until it lights itself. Pomfrey arrests the bacteria; Pickles eats the evidence. Case closed.
import { TOTAL, LINES, wf } from './hayfire_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const H1 = [-5, -2], C1 = [-14, -3.5], C2 = [-10, -5.5], STK = [2, -1], COOP = [10, -4.5], CHAIR = [4.6, 1.0], EX = [70, 0, 0];
let THREE, F = {}, FIRES = [], H1G, H1C, BALES = [], THERMO, TH2, SAND, EDNA, POM, PIP, SHEEP, HENS = [], HBOX, BUGS = [], GLOW, QUILT, JAR, BAITSIGN;

function makeFire(K, parent, s = 1, n = 9) { const g = new THREE.Group(); parent.add(g); g.userData.fl = [];
  for (let k = 0; k < n; k++) { const c = k % 3 === 0 ? '#ffe070' : k % 3 === 1 ? '#ff9a2a' : '#ff5a1a'; const m = new THREE.Mesh(new THREE.ConeGeometry(0.35 * s, 1.4 * s, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(2.2), transparent: true, opacity: 0.85, toneMapped: false, depthWrite: false }));
    m.userData.ndSkip = true; const a = hash(k) * 6.28, r = hash(k + 3) * 0.9 * s; m.position.set(Math.cos(a) * r, 0.7 * s, Math.sin(a) * r); g.add(m); g.userData.fl.push(m); } return g; }
function fireFrame(g, f, on, s = 1) { g.visible = on > 0.01; if (!g.visible) return; g.userData.fl.forEach((m, k) => { const fl = 0.75 + 0.35 * Math.sin(f * 0.9 + k * 2.1) + 0.2 * hash(f * 7 + k); m.scale.set(on * (0.8 + 0.3 * hash(k + 9)), on * fl * (0.8 + 0.6 * hash(k + 5)), on * (0.8 + 0.3 * hash(k + 9))); m.position.y = 0.7 * s * on * fl; }); }
function dome(K, parent, x, z, r, col, kind = 'fabric') { const m = K.sphere(r, K.mat(kind, col, { detail: 0.25, amt: 0.4 }), x, 0, z, parent, 1, 0.85, 1); return m; }
function thermo(K, parent) { const g = new THREE.Group(); parent.add(g); const GO = K.gold();
  K.rbox(0.7, 3.0, 0.08, 0.06, K.paint('#f4f2ee'), 0, 1.6, -0.12, g); K.rbox(0.82, 3.12, 0.06, 0.06, GO, 0, 1.6, -0.17, g);
  for (let k = 0; k < 9; k++) K.rbox(0.18, 0.03, 0.02, 0.005, K.paint('#1a1a1a'), -0.22, 0.6 + k * 0.28, -0.07, g);
  const lab = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.24), K.set.textMat('HOT!', { bg: '#f4f2ee', fg: '#d02a2a', w: 200, h: 80, border: false })); lab.position.set(0.05, 2.95, -0.07); g.add(lab);
  K.cyl(0.1, 0.1, 2.6, K.glass({ opacity: 0.4 }), 0.12, 0.35, 0, g, 16); K.sphere(0.2, K.paint('#d02a2a'), 0.12, 0.3, 0, g); K.sphere(0.13, GO, 0.12, 3.0, 0, g);
  const liq = K.cyl(0.065, 0.065, 1, K.paint('#e8202a', { rough: 0.2 }), 0.12, 0, 0, g, 12); liq.geometry.translate(0, 0, 0); g.userData.liq = liq;
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.8, 10), K.chrome()); tip.rotation.x = Math.PI; tip.position.set(0.12, -0.3, 0); g.add(tip); return g; }
function thermoSet(g, v) { const L = 0.1 + 2.4 * v; g.userData.liq.scale.y = L; g.userData.liq.position.y = 0.35 + L / 2; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { CATCH: wf(0, 'catching'), FIRE: wf(0, 'fire'), SUSPECT: wf(0, 'suspect'), SHEEP0: wf(0, 'sheep'), THREE: wf(1, 'three'), WEEKS: wf(1, 'weeks'), PICKLES: wf(1, 'pickles'), CHEW: wf(1, 'chewing'),
      FAMOUS: wf(2, 'famous'), SNIFF: wf(2, 'sniffed'), ANN: wf(2, 'announced'), CASE: wf(2, 'case'), LOCKED: wf(3, 'locked'), COOP: wf(3, 'coop'), HENS: wf(3, 'hens'), CONS: wf(3, 'consulted'),
      PIP: wf(4, 'pip'), RAISED: wf(4, 'raised'), WET: wf(4, 'wet'), STACKED: wf(4, 'stacked'), CANT: wf(5, 'burn'), STACK2: wf(5, 'stacked'), BAIT: wf(5, 'bait'),
      TUE: wf(6, 'tuesday'), KETTLE: wf(6, 'kettle'), WED: wf(6, 'wednesday'), TOAST: wf(6, 'toasting'), SAND: wf(6, 'sandwich'), THU: wf(7, 'thursday'), BURST: wf(7, 'burst'), FLAMES: wf(7, 'flames'), STILL: wf(7, 'still'),
      WHO: wf(8, 'who'), NOBODY: wf(9, 'nobody'), BUFFET: wf(9, 'buffet'), BILLIONS: wf(9, 'billions'), BACT: wf(9, 'bacteria'), EAT: wf(10, 'eat'), HEAT: wf(10, 'heat'), TRAPS: wf(10, 'traps'), BLANKET: wf(10, 'blanket'),
      COOKS: wf(11, 'cooks'), HOTTER: wf(11, 'hotter'), LIGHTS: wf(11, 'lights'), ARREST: wf(12, 'arrested'), BACT2: wf(12, 'bacteria'), ATE: wf(12, 'ate'), EVID: wf(12, 'evidence'), CLOSED: wf(12, 'closed') };
    // ================= Edna's farm =================
    const G = K.group();
    K.slab(-90, 110, -0.1, 0, -90, 90, K.mat('grime', '#7ab04f', { detail: 1.8, amt: 0.4 }), G, false);
    K.slab(-30, 30, -0.09, 0.01, -8.5, 3.5, K.mat('dirt', '#b8945a', { detail: 0.6, amt: 0.35 }), G, false);   // farmyard
    for (let k = 0; k < 160; k++) { const x = -28 + hash(k) * 56, z = -8 + hash(k + 50) * 11; K.rbox(0.3 + hash(k + 2) * 0.3, 0.02, 0.04, 0.005, K.mat('fabric', '#e8c860'), x, 0.02, z, G).rotation.y = hash(k + 7) * 3; }  // straw on the ground
    // barn
    const BG = new THREE.Group(); BG.position.set(-4, 0, -16); G.add(BG); const red = K.mat('wood', '#b0302a', { detail: 0.5 }), wt = K.paint('#f4efe4');
    K.rbox(12, 6, 8, 0.05, red, 0, 3, 0, BG); for (const s of [-1, 1]) { const r = K.rbox(12.6, 0.25, 5.2, 0.06, K.mat('wood', '#5a3a2a'), 0, 7.3, s * 2.2, BG); r.rotation.x = s * 0.62; }
    K.rbox(3.6, 4.2, 0.2, 0.03, K.mat('wood', '#8a2a22'), 0, 2.1, 4.05, BG); for (const s of [-1, 1]) { const d = K.rbox(0.2, 4.6, 0.12, 0.02, wt, s * 0.9, 2.1, 4.18, BG); d.rotation.z = s * 0.7; } K.rbox(3.8, 0.2, 0.14, 0.02, wt, 0, 4.25, 4.18, BG); K.rbox(3.8, 0.2, 0.14, 0.02, wt, 0, 0.1, 4.18, BG);
    const bs = new THREE.Mesh(new THREE.PlaneGeometry(4, 0.9), S.textMat("EDNA'S FARM", { bg: '#f4efe4', fg: '#b0302a', w: 900, h: 200 })); bs.position.set(0, 5.4, 4.12); BG.add(bs);
    K.rbox(1.4, 1.4, 0.1, 0.02, K.mat('wood', '#7a4a2a'), 0, 6.5, 2.4, BG);
    const fh = S.building({ w: 8, d: 7, floors: 2, color: '#f2e2c0', gable: 'pitched', shutters: '#2a6a3a', flowers: true, seed: 12, kind: 'plaster' }); fh.position.set(13, 0, -13);
    // fences, trees, hills, fresh haystacks in the field, a tractor, sunflowers
    for (let x = -26; x < 26; x += 2.2) { if (Math.abs(x - 0) < 2) continue; K.rbox(0.14, 1.1, 0.14, 0.02, K.mat('wood', '#c8a878'), x, 0.55, -9, G); K.rbox(2.2, 0.1, 0.06, 0.01, K.mat('wood', '#c8a878'), x + 1.1, 0.85, -9, G); K.rbox(2.2, 0.1, 0.06, 0.01, K.mat('wood', '#c8a878'), x + 1.1, 0.45, -9, G); }
    for (let k = 0; k < 6; k++) dome(K, G, -22 + k * 9, -24 - hash(k) * 6, 1.6 + hash(k + 1) * 0.5, '#e8c860');
    for (let k = 0; k < 20; k++) { const t = S.tree({ h: 5 + hash(k) * 3, seed: k }); const a = hash(k + 11) * 3.14 + 3.3; t.position.set(Math.cos(a) * (34 + hash(k + 3) * 14), 0, Math.sin(a) * (30 + hash(k + 3) * 10) - 6); }
    for (let k = 0; k < 7; k++) K.sphere(24 + hash(k) * 8, K.mat('grime', ['#6aa84f', '#7ab04f', '#5f9a44'][k % 3], { detail: 4 }), -80 + k * 30, -16, -75 - hash(k + 2) * 10, G, 1, 0.55, 1);
    for (let k = 0; k < 14; k++) { const x = -26 + k * 0.9, z = -10.5 - (k % 2) * 0.5; K.cyl(0.03, 0.03, 1.5, K.paint('#3a7a2a'), x, 0, z, G, 6); K.sphere(0.22, K.paint('#f2c230', { rough: 0.5 }), x, 1.55, z + 0.1, G, 1, 1, 0.4); K.sphere(0.09, K.paint('#5a3a1a'), x, 1.55, z + 0.18, G); }
    { const T = new THREE.Group(); T.position.set(-17, 0, 0.5); T.rotation.y = 0.5; G.add(T); const gr = K.paint('#2a8a3a', { rough: 0.3 }); K.rbox(2.6, 1.0, 1.4, 0.15, gr, 0, 1.1, 0, T); K.rbox(1.2, 1.2, 1.3, 0.12, gr, -0.6, 2.2, 0, T); K.rbox(1.0, 0.9, 1.25, 0.08, K.glass(), -0.6, 2.25, 0, T);
      for (const [wx, r] of [[-0.8, 0.9], [1.0, 0.5]]) for (const s of [-1, 1]) { const w = K.cyl(r, r, 0.4, K.paint('#1a1a1a', { coat: 0.2 }), wx, 0, s * 0.85, T, 22); w.rotation.x = Math.PI / 2; w.position.y = r; const h = K.cyl(r * 0.5, r * 0.5, 0.42, K.paint('#f2c230'), wx, 0, s * 0.85, T, 16); h.rotation.x = Math.PI / 2; h.position.y = r; } }
    const ws = S.board('NO SMOKING|IN THE YARD', 1.6, 0.9); ws.position.set(-8, 0, 2.6); ws.rotation.y = 0.3;
    for (const [x, z] of [[-1.5, -6], [6.5, -7.2], [-7.5, -7.5]]) { const b = new THREE.Group(); b.position.set(x, 0, z); G.add(b); K.cyl(0.35, 0.3, 0.8, K.mat('wood', '#8a5a34'), 0, 0, 0, b, 14); for (const y of [0.15, 0.65]) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.025, 6, 20), K.paint('#3a3a40')); t.rotation.x = Math.PI / 2; t.position.y = y; b.add(t); } }
    K.rbox(1.8, 0.7, 0.8, 0.06, K.mat('wood', '#7a5a3a'), -9, 0.35, -7.2, G);   // water trough
    // the chicken coop
    const CG = new THREE.Group(); CG.position.set(COOP[0], 0, COOP[1]); G.add(CG); const cw = K.mat('wood', '#d8a868', { detail: 0.3 });
    K.rbox(3.6, 0.3, 2.6, 0.03, cw, 0, 0.15, 0, CG); K.rbox(3.6, 2.2, 0.15, 0.03, cw, 0, 1.4, -1.25, CG); for (const s of [-1, 1]) K.rbox(0.15, 2.2, 2.6, 0.03, cw, s * 1.75, 1.4, 0, CG);
    for (const s of [-1, 1]) { const r = K.rbox(4.0, 0.12, 1.7, 0.03, K.mat('wood', '#7a3a2a'), 0, 2.85, s * 0.68, CG); r.rotation.x = s * 0.5; }
    for (let k = 0; k < 15; k++) K.cyl(0.02, 0.02, 2.2, K.chrome({ rough: 0.4 }), -1.6 + k * 0.23, 0.3, 1.25, CG, 6);
    K.rbox(3.5, 0.08, 0.08, 0.01, cw, 0, 2.48, 1.25, CG); K.rbox(3.5, 0.08, 0.08, 0.01, cw, 0, 0.32, 1.25, CG);
    const cs = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.45), S.textMat('COOP', { bg: '#f4efe4', fg: '#b0302a', w: 400, h: 130 })); cs.position.set(0, 2.75, 1.32); CG.add(cs);
    for (let k = 0; k < 3; k++) { K.rbox(0.6, 0.5, 0.5, 0.03, cw, -1.1 + k * 0.6, 1.5, -0.95, CG); K.sphere(0.2, K.mat('fabric', '#e8c860'), -1.1 + k * 0.6, 1.35, -0.85, CG, 1, 0.4, 1); }
    const lock = K.rbox(0.18, 0.22, 0.08, 0.03, K.gold(), 1.3, 1.2, 1.32, CG); void lock;
    // the charred earlier fires
    for (const [x, z] of [C1, C2]) { dome(K, G, x, z, 1.4, '#2a2622', 'rock'); for (let k = 0; k < 6; k++) K.sphere(0.06, new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff6a1a').multiplyScalar(1.6), toneMapped: false }), x + (hash(k + x) - 0.5) * 1.8, 0.3 + hash(k) * 0.6, z + 1.05 + hash(k + 2) * 0.2, G); }
    S.bake(G);
    for (const [x, z] of [C1, C2]) { const s = S.protestSign('FIRE|#' + (x === C1[0] ? 1 : 2), { bg: '#f2c230', fg: '#1a1a1a' }); s.position.set(x + 1.6, 0, z + 0.9); s.rotation.y = -0.3; }
    // hook haystack (fresh, then burning, then charred = fire #3)
    H1G = dome(K, sc, H1[0], H1[1], 1.5, '#e8c860'); H1C = dome(K, sc, H1[0], H1[1], 1.4, '#2a2622', 'rock');
    FIRES.push(makeFire(K, sc, 1.9, 14)); FIRES[0].position.set(H1[0], 0.5, H1[1]);
    // ================= the hero prop: the wet bait stack + the giant brass thermometer =================
    const hay = K.mat('fabric', '#d8b850', { detail: 0.18, amt: 0.45 }), twine = K.paint('#8a3a1a', { rough: 0.6 });
    let n = 0; for (let row = 0; row < 4; row++) for (let i = 0; i < 4 - row; i++) for (let d = 0; d < 2; d++) { const b = new THREE.Group(); sc.add(b);
      K.rbox(1.2, 0.58, 0.72, 0.08, hay, 0, 0, 0, b); for (const tx of [-0.3, 0.3]) K.rbox(0.04, 0.6, 0.74, 0.01, twine, tx, 0, 0, b);
      for (let k = 0; k < 6; k++) K.rbox(0.25, 0.02, 0.03, 0.005, hay, (hash(n * 9 + k) - 0.5) * 1.1, 0.3, (hash(n * 5 + k) - 0.5) * 0.6, b).rotation.y = hash(k + n) * 3;
      b.userData.home = [STK[0] + (i - (3 - row) / 2) * 1.24, 0.3 + row * 0.6, STK[1] + (d - 0.5) * 0.76]; b.userData.n = n++; BALES.push(b); }
    BALES.forEach((b) => b.traverse((o) => { if (o.isMesh) o.castShadow = true; }));
    BAITSIGN = S.protestSign('BAIT|(WET)', { bg: '#f4efe4', fg: '#1f4aa8' }); BAITSIGN.position.set(STK[0] - 2.9, 0, STK[1] + 1.1); BAITSIGN.rotation.y = 0.4;
    THERMO = thermo(K, sc); THERMO.position.set(STK[0] + 0.2, 2.1, STK[1] + 0.1); THERMO.rotation.set(0, 0, -0.12);
    FIRES.push(makeFire(K, sc, 2.0, 14)); FIRES[1].position.set(STK[0], 0.4, STK[1]);
    // deck chair, side table, sandwich
    { const C = new THREE.Group(); C.position.set(CHAIR[0], 0, CHAIR[1]); C.rotation.y = -0.6; sc.add(C); const st = K.paint('#f4f2ee'), fb = S.textMat('', { bg: '#2a8ab8', w: 64, h: 64, border: false });
      void fb; for (const s of [-1, 1]) { K.rbox(0.05, 0.05, 1.3, 0.01, K.mat('wood', '#c8a070'), s * 0.3, 0.3, 0, C).rotation.x = 0.2; }
      const seat = K.rbox(0.6, 0.04, 0.9, 0.02, K.paint('#2a8ab8'), 0, 0.42, 0.05, C); seat.rotation.x = 0.15; const back = K.rbox(0.6, 0.9, 0.04, 0.02, K.paint('#f4f2ee'), 0, 0.85, -0.42, C); back.rotation.x = -0.35; void st; }
    { const Tb = new THREE.Group(); Tb.position.set(CHAIR[0] - 1.2, 0, CHAIR[1] - 0.6); sc.add(Tb); K.cyl(0.3, 0.3, 0.05, K.paint('#f4f2ee'), 0, 0.7, 0, Tb, 20); K.cyl(0.03, 0.03, 0.7, K.chrome(), 0, 0, 0, Tb, 8);
      SAND = new THREE.Group(); SAND.position.set(0, 0.76, 0); Tb.add(SAND); const br = K.paint('#f2d8a0', { rough: 0.6, coat: 0.1 }); K.rbox(0.34, 0.06, 0.3, 0.03, br, 0, 0, 0, SAND); K.rbox(0.36, 0.03, 0.32, 0.01, K.paint('#5ab84a'), 0, 0.04, 0, SAND); K.rbox(0.34, 0.03, 0.3, 0.01, K.paint('#e86a6a'), 0, 0.07, 0, SAND); K.rbox(0.34, 0.06, 0.3, 0.03, br, 0, 0.12, 0, SAND); SAND.userData.br = br; }
    // ================= explainer: x-ray bale, bacteria buffet, heat, blanket, thermometer =================
    const EG = K.group(); K.cyl(9, 9, 0.1, K.paint('#1f2a44', { rough: 0.4 }), EX[0], 0, EX[2], EG, 64);
    for (const r of [4.5, 8.6]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.04, 8, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color('#7af8a0').multiplyScalar(1.6), toneMapped: false })); t.rotation.x = Math.PI / 2; t.position.set(EX[0], 0.12, EX[2]); t.userData.ndSkip = true; EG.add(t); }
    HBOX = K.holoBox(4.4, 2.4, 2.4, EX[0], 1.4, EX[2], sc, '#f2c230');
    for (let k = 0; k < 40; k++) { const s = (k % 5 === 0 ? 1.6 : 1); const b = new THREE.Group(); sc.add(b); const bm = new THREE.Mesh(new THREE.CapsuleGeometry(0.09 * s, 0.14 * s, 4, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(['#7af8a0', '#b8f05a', '#5ae8c8'][k % 3]).multiplyScalar(1.4), toneMapped: false })); bm.rotation.z = Math.PI / 2; bm.userData.ndSkip = true; b.add(bm);
      for (const e of [-1, 1]) { const ey = new THREE.Mesh(new THREE.SphereGeometry(0.028 * s, 8, 6), new THREE.MeshBasicMaterial({ color: '#111111' })); ey.position.set(0.1 * s, 0.05 * s, e * 0.04 * s); ey.userData.ndSkip = true; b.add(ey); } BUGS.push(b); }
    GLOW = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff5a1a').multiplyScalar(1.6), transparent: true, opacity: 0, toneMapped: false, depthWrite: false })); GLOW.userData.ndSkip = true; GLOW.position.set(EX[0], 1.4, EX[2]); sc.add(GLOW);
    QUILT = new THREE.Group(); sc.add(QUILT); { const tx = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'); const cols = ['#e84a6a', '#f2c230', '#4ab8e8', '#7ad87a', '#f4f2ee', '#b86ae8']; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { g.fillStyle = cols[(i * 3 + j * 5) % 6]; g.fillRect(i * 32, j * 32, 32, 32); g.strokeStyle = '#ffffff'; g.setLineDash([4, 3]); g.strokeRect(i * 32 + 2, j * 32 + 2, 28, 28); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
      const qm = new THREE.MeshStandardMaterial({ map: tx, roughness: 0.8, side: THREE.DoubleSide }); K.rbox(4.8, 0.08, 2.8, 0.04, qm, 0, 0, 0, QUILT); for (const s of [-1, 1]) { K.rbox(4.8, 1.6, 0.08, 0.04, qm, 0, -0.8, s * 1.4, QUILT); K.rbox(0.08, 1.6, 2.8, 0.04, qm, s * 2.4, -0.8, 0, QUILT); } }
    TH2 = thermo(K, sc); TH2.position.set(EX[0] + 3.4, 0.2, EX[2] + 1.6);
    FIRES.push(makeFire(K, sc, 1.1, 10)); FIRES[2].position.set(EX[0], 2.6, EX[2]);
    // ================= characters =================
    EDNA = K.stick({ jacket: '#c84a3a', pants: '#3a4a7a', hat: 'cowboy', hatColor: '#c8a060', hairStyle: 'bun', hair: '#d8d4cc', glasses: true, apron: '#f4efe4', scarf: '#f2c230', boots: '#5a3a24' }, { key: 'edna' });
    POM = K.stick({ jacket: '#8a6a44', pants: '#5a4a34', hat: 'tophat', hatColor: '#5a3a24', moustache: '#d8d4cc', bowtie: '#b02a2a', vest: '#c8a878', glasses: true, collar: '#f4efe4', build: 'stout' }, { key: 'pom' });
    PIP = K.stick({ jacket: '#f4efe4', pants: '#2a5aa8', hat: 'cap', hatColor: '#2a8a3a', hairStyle: 'ponytail', hair: '#e8a040', vest: '#2a5aa8', gloves: '#c8a070', boots: '#3a2418' }, { key: 'pip' });
    SHEEP = K.animal('sheep', { seed: 4, scale: 1.25 });
    for (let k = 0; k < 3; k++) HENS.push(K.animal('chicken', { seed: 30 + k, scale: 1.0, color: ['#f4f2ee', '#c8844a', '#8a5a34'][k] }));
    JAR = new THREE.Group(); sc.add(JAR); { K.cyl(0.2, 0.2, 0.42, K.glass({ opacity: 0.4 }), 0, 0, 0, JAR, 18); K.cyl(0.21, 0.21, 0.08, K.gold(), 0, 0.42, 0, JAR, 18);
      for (let k = 0; k < 6; k++) { const m = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color('#7af8a0').multiplyScalar(1.6), toneMapped: false })); m.position.set((hash(k) - 0.5) * 0.25, 0.1 + hash(k + 3) * 0.25, (hash(k + 6) - 0.5) * 0.25); m.userData.ndSkip = true; JAR.add(m); }
      const jl = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.14), S.textMat('GUILTY', { bg: '#f4efe4', fg: '#d02a2a', w: 200, h: 80, border: false })); jl.position.set(0, 0.2, 0.205); JAR.add(jl); }
    K.addClouds(10, 700, 150);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s);
    const ex = f >= 900 && f < 1185;
    // ---------- hook fire / charred pile #3 ----------
    const h1burn = f < 112; H1G.visible = false; H1C.visible = !ex; fireFrame(FIRES[0], f, h1burn ? 1 : 0, 1.9);
    // ---------- bait stack ----------
    const nB = BALES.length; BALES.forEach((b, k) => { const t0 = 548 + k * 4.5, u = sm(t0, t0 + 6, f); const h = b.userData.home; b.visible = !ex && f >= 112 && f >= t0;
      b.position.set(h[0], h[1] + (1 - u) * 3, h[2]); b.rotation.set(0, (1 - u) * 0.6, 0);
      const ch = f >= F.FLAMES + 40 ? 1 : f >= F.BURST ? sm(F.BURST, F.FLAMES + 40, f) : 0; b.children[0].material.color.set(new THREE.Color('#d8b850').lerp(new THREE.Color('#3a2a1a'), ch)); }); void nB;
    // shared material: the colour lerp above writes one material; fine for all bales
    const stackOn = !ex && f >= 548; THERMO.visible = stackOn && f >= 600 && f < 1185 || (f >= 1185);
    const temp = f < 653 ? 0.1 : f < F.WED ? lerp(0.1, 0.45, sm(653, F.WED, f)) : f < F.THU ? lerp(0.45, 0.75, sm(F.WED, F.THU, f)) : lerp(0.75, 1.0, sm(F.THU, F.BURST, f)); thermoSet(THERMO, temp);
    BAITSIGN.visible = stackOn;
    const fireOn = f >= F.BURST - 4 && f < 892 ? sm(F.BURST - 4, F.BURST + 8, f) : f >= 1185 ? 0 : 0; fireFrame(FIRES[1], f, fireOn * 1.0, 2.0);
    SAND.userData.br.color.set(f >= F.TOAST ? new THREE.Color('#f2d8a0').lerp(new THREE.Color('#8a5a24'), sm(F.TOAST, F.SAND + 20, f)) : new THREE.Color('#f2d8a0'));
    // ---------- characters ----------
    let ep = { x: H1[0] + 3.4, z: H1[1] + 2.6, yaw: -2.2 }, pp = null, ip = null, sp = { x: H1[0] + 1.6, z: H1[1] + 1.2, yaw: 0.6, mode: 'eat', expr: 'neutral' };
    // Edna
    if (f >= 112 && f < 229) ep = { x: C2[0] + 2.4, z: C2[1] + 3.6, yaw: -1.5 };
    if (f >= 229 && f < 437) ep = { x: H1[0] + 2.8, z: H1[1] + 3.4, yaw: -2.5 };
    if (f >= 437 && f < 653) ep = { x: STK[0] - 2.6, z: STK[1] + 3.0, yaw: 0.9 };
    if (f >= 653 && f < 892) ep = { x: STK[0] - 3.2, z: STK[1] + 3.6, yaw: 0.6 };
    if (f >= 1185) ep = f < 1240 ? { x: COOP[0] - 2.8, z: COOP[1] + 4.2, yaw: 2.4 } : { x: H1[0] + 0.6, z: H1[1] + 3.4, yaw: 0.4 };
    const ek = [[0, 'run', { expr: 'scared', R: [0.3, 0.3, 'cup'] }], [60, 'panic', { expr: 'shock' }], [112, 'facepalm', { expr: 'pained' }], [F.PICKLES, 'pointL', { expr: 'angry' }], [F.CHEW, 'cross', { expr: 'stern' }],
      [229, 'hips', { expr: 'neutral' }], [F.ANN, 'shock', { expr: 'shock' }], [339, 'facepalm', { expr: 'pained' }], [437, 'think', { expr: 'confused' }], [F.CANT, 'shrug', { expr: 'deadpan' }],
      [653, 'cross', { expr: 'deadpan' }], [F.BURST, 'panic', { expr: 'scared', sweat: true }], [1185, 'laugh', { expr: 'laugh' }], [F.CLOSED, 'clap', { expr: 'laugh' }]];
    if (f < 112) ep = { x: lerp(H1[0] + 6, H1[0] + 3.0, sm(0, 60, f)), z: lerp(H1[1] + 4, H1[1] + 2.6, sm(0, 60, f)), yaw: -2.2 };
    EDNA.set(T.act(f, ek.map((k) => k[1] === 'laugh' ? [k[0], 'celebrate', k[2]] : k), { seed: 2, blink: blink(2) }), { ...ep, visible: !ex });
    // Pomfrey
    if (f >= 229 && f < 339) { const u = sm(229, 290, f); pp = { x: lerp(H1[0] + 7, H1[0] + 2.4, u), z: lerp(H1[1] + 5, H1[1] + 1.6, u), yaw: u < 1 ? -2.3 : -1.9 }; }
    if (f >= 339 && f < 437) pp = { x: COOP[0] + 1.6, z: COOP[1] + 2.4, yaw: Math.PI - 0.3 };
    if (f >= 437 && f < 541) pp = { x: STK[0] - 0.6, z: STK[1] + 2.2, yaw: 0.2 };
    if (f >= 541 && f < 653) pp = { x: STK[0] + 1.8 - (f < 600 ? 0.6 * Math.sin((f - 541) * 0.15) : 0), z: STK[1] + 1.6, yaw: -0.9 };
    if (f >= 653 && f < F.BURST) pp = { x: CHAIR[0], z: CHAIR[1], yaw: -0.6, seat: 0.45 };
    if (f >= F.BURST && f < 900) { const u = sm(F.BURST, F.BURST + 40, f); pp = { x: lerp(CHAIR[0], CHAIR[0] + 5, u), z: lerp(CHAIR[1], CHAIR[1] + 3, u), yaw: u < 1 ? 1.03 : 0.3 }; }
    if (ex) pp = null;
    if (f >= 1185) pp = f < 1240 ? { x: COOP[0] - 1.2, z: COOP[1] + 3.2, yaw: 0.2 } : { x: H1[0] + 3.4, z: H1[1] + 2.2, yaw: -0.6 };
    const pk = [[229, 'walk', { expr: 'proud' }], [292, 'crouch', { expr: 'confused' }], [F.SNIFF + 30, 'idle', { expr: 'smug' }], [F.ANN - 4, 'pointUp', { expr: 'proud', talk: true }], [F.CASE, 'point', { expr: 'smug', talk: true }],
      [339, 'grab', { expr: 'smug', R: [0.4, 0.2, 'coin'] }], [F.HENS, 'hips', { expr: 'proud' }], [437, 'cross', { expr: 'smug' }], [F.WET, 'laugh', { expr: 'laugh' }], [541, 'carry', { expr: 'proud', item: 'box', talk: true }], [F.BAIT, 'point', { expr: 'smug' }],
      [653, 'sit', { expr: 'smug' }], [F.KETTLE, 'sit', { expr: 'confused' }], [F.WED, 'sit', { expr: 'nervous', sweat: true }], [F.SAND, 'sit', { expr: 'shock' }], [F.BURST, 'run', { expr: 'scared', sweat: true }], [F.BURST + 41, 'shock', { expr: 'shock' }],
      [1185, 'show', { expr: 'proud', R: [0.4, 0.1, 'open'] }], [F.CLOSED - 4, 'salute', { expr: 'proud', talk: true }]];
    POM.set(T.act(f, pk.map((k) => k[1] === 'laugh' ? [k[0], 'cheer', k[2]] : k), { seed: 5, blink: blink(5) }), { ...(pp || { x: 0, z: 0 }), visible: !!pp });
    JAR.visible = f >= 1185; if (JAR.visible) JAR.position.set(pp.x + 0.42, 1.25, pp.z + 0.3);
    // Pip
    if (f >= 437 && f < 892) ip = { x: STK[0] + 1.4, z: STK[1] + 3.4, yaw: f < 541 ? -0.8 : -0.5 };
    if (f >= 1185) ip = f < 1240 ? { x: COOP[0] + 2.4, z: COOP[1] + 3.6, yaw: -2.6 } : { x: H1[0] + 4.6, z: H1[1] + 0.8, yaw: -1.2 };
    const ik = [[437, 'idle', { expr: 'nervous' }], [F.RAISED - 4, 'pointUp', { expr: 'smile' }], [F.WET - 4, 'pointUp', { expr: 'talk', talk: true }], [541, 'facepalm', { expr: 'pained' }], [653, 'think', { expr: 'deadpan' }], [F.BURST, 'scared', { expr: 'shock' }], [1185, 'clap', { expr: 'grin' }]];
    PIP.set(T.act(f, ik, { seed: 7, blink: blink(7) }), { ...(ip || { x: 0, z: 0 }), visible: !!ip });
    // Pickles + hens
    if (f >= 112 && f < 229) { const k = f < F.WEEKS ? 0 : f < F.PICKLES ? 1 : 2; const P = [C1, C2, H1][k]; sp = { x: P[0] + 1.5, z: P[1] + 1.4, yaw: 0.4, mode: 'eat', expr: 'neutral' }; }
    if (f >= 229 && f < 339) sp = { x: H1[0] + 1.6, z: H1[1] + 1.2, yaw: 0.9, mode: f >= F.SNIFF && f < F.SNIFF + 30 ? 'stand' : 'eat', expr: f >= F.CASE ? 'shock' : 'neutral' };
    if (f >= 339) sp = { x: COOP[0] + 0.2, z: COOP[1] + 0.2, yaw: 0.2, mode: f >= F.BURST ? 'jump' : 'stand', expr: f >= F.HENS ? 'sad' : 'shock' };
    if (f >= 1185) sp = { x: H1[0] + 0.9, z: H1[1] + 1.4, yaw: -0.5, mode: 'eat', expr: 'happy' };
    if (ex) sp = { visible: false };
    if (f < 112) sp = { x: H1[0] + 1.5, z: H1[1] + 1.6, yaw: 0.5, mode: 'eat', expr: f > 50 ? 'neutral' : 'neutral', nod: 0.1 };
    SHEEP.set(f, sp);
    HENS.forEach((h, k) => h.set(f, { x: COOP[0] - 1.2 + k * 0.9, z: COOP[1] - 0.5 + (k % 2) * 0.4, yaw: 0.6 - k * 0.5, mode: f >= F.HENS && f < F.HENS + 40 ? 'jump' : k === 1 ? 'eat' : 'stand', expr: f >= F.HENS ? 'angry' : 'shock', flap: f >= F.HENS && f < F.HENS + 30, visible: !ex }));
    // ---------- explainer ----------
    const nb = Math.round(lerp(6, 40, sm(F.BILLIONS - 10, F.BACT + 10, f)));
    BUGS.forEach((b, k) => { b.visible = ex && k < nb; const a = f * 0.03 + k * 2.4, r = 0.5 + (k % 7) * 0.22; b.position.set(EX[0] + Math.cos(a) * r * 2.4 * 0.75, 1.4 + Math.sin(f * 0.05 + k) * 0.8, EX[2] + Math.sin(a) * r * 0.9); b.rotation.y = -a; b.scale.setScalar(1 + 0.15 * Math.sin(f * 0.6 + k)); });
    HBOX.visible = ex; GLOW.visible = ex && f >= F.HEAT - 6; GLOW.material.opacity = 0.18 + 0.4 * sm(F.HEAT - 6, F.LIGHTS, f); GLOW.scale.setScalar(0.6 + 0.9 * sm(F.HEAT - 6, F.LIGHTS, f));
    QUILT.visible = ex && f >= F.BLANKET - 14; QUILT.position.set(EX[0], 2.66 + 3 * (1 - sm(F.BLANKET - 14, F.BLANKET + 4, f)), EX[2]);
    TH2.visible = ex && f >= 1009; thermoSet(TH2, lerp(0.15, 1.0, sm(1015, F.LIGHTS, f)));
    fireFrame(FIRES[2], f, ex && f >= F.LIGHTS - 4 ? sm(F.LIGHTS - 4, F.LIGHTS + 8, f) : 0, 1.1);
    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const body = (p, h = 2.3) => p ? [[p.x, 0, p.z], [p.x, h, p.z]] : [];
    const STKB = [[STK[0] - 2.6, 0, STK[1] - 0.8], [STK[0] + 2.6, 2.6, STK[1] + 0.8]];
    if (sh(0, 56)) {                          // 1. hook: a haystack in flames, Pickles chewing right beside it, Edna running in with a bucket (wide)
      cam = K.fit([[H1[0] - 1.6, 0, H1[1] - 1.6], [H1[0] + 1.6, 3.8, H1[1] + 1.6], [sp.x, 1, sp.z], ...body(ep)], { yaw: 70, pitch: 6, fov: 42, margin: 0.7, maxDist: 9 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(56, 112)) {                 // 2. the main suspect was a sheep (Pickles reaction close, flames behind)
      cam = { pos: [sp.x + 0.6, 1.1, sp.z + 2.6], look: [sp.x - 0.2, 0.9, sp.z], fov: 44 * K.push(u, 0.06) }; dof = { focus: 2.7, cinf: 10 }; cam.fov *= K.punch(f, F.SHEEP0, 0.1, 6);
    } else if (sh(112, 170)) {                // 3. three fires in three weeks (wide: three charred piles, numbered)
      cam = K.fit([[C1[0] - 1.5, 0, C1[1]], [H1[0] + 1.5, 2.4, H1[1]], [C2[0], 0, C2[1] - 1.5], [sp.x, 0, sp.z]], { yaw: 75, pitch: 16, fov: 44, margin: 0.85, maxDist: 15 }); cam.fov *= K.punch(f, F.WEEKS, 0.08, 6);
    } else if (sh(170, 229)) {                // 4. every time, Pickles right there, chewing (full shot: Edna glaring, Pickles chewing)
      cam = K.fit([[sp.x, 0, sp.z], [sp.x, 1.2, sp.z], [H1[0], 2.0, H1[1]], ...body(ep)], { yaw: 60, pitch: 8, fov: 40, margin: 0.95, maxDist: 9 }); cam.fov *= K.punch(f, F.CHEW, 0.08, 6);
    } else if (sh(229, 285)) {                // 5. the famous Inspector Pomfrey arrives (tracking wide)
      cam = K.fit([...body(pp), [sp.x, 1, sp.z], [H1[0], 2.0, H1[1]], ...body(ep)], { yaw: 105, pitch: 8, fov: 42, margin: 1.05, maxDist: 12 });
    } else if (sh(285, 339)) {                // 6. sniffs the sheep: "Case closed!" (full shot)
      cam = K.fit([...body(pp), [sp.x, 0, sp.z], [sp.x, 1.2, sp.z]], { yaw: 100, pitch: 6, fov: 40, margin: 1.0, maxDist: 8 }); cam.fov *= K.punch(f, F.CASE, 0.12, 6);
    } else if (sh(339, 385)) {                // 7. locked in the chicken coop (wide on the coop)
      cam = K.fit([[COOP[0] - 2, 0, COOP[1] - 1.3], [COOP[0] + 2, 3.2, COOP[1] + 1.3], ...body(pp)], { yaw: 70, pitch: 8, fov: 42, margin: 0.85, maxDist: 11 }); cam.fov *= K.punch(f, F.LOCKED, 0.08, 6);
    } else if (sh(385, 437)) {                // 8. the hens were not consulted (through the wire, hens + sheep reaction)
      cam = { pos: [COOP[0] + 0.9, 1.1, COOP[1] + 3.4], look: [COOP[0] - 0.2, 0.7, COOP[1] - 0.2], fov: 46 * K.push(u, 0.06) }; dof = { focus: 3.6, cinf: 10 }; cam.fov *= K.punch(f, F.CONS, 0.1, 6);
    } else if (sh(437, 490)) {                // 9. Pip the farmhand raises her hand (wide: Pip, Pomfrey, Edna)
      cam = K.fit([...body(pp), ...body(ip), ...body(ep)], { yaw: 100, pitch: 8, fov: 42, margin: 1.08, maxDist: 10 }); cam.fov *= K.punch(f, F.RAISED, 0.08, 6);
    } else if (sh(490, 541)) {                // 10. "The hay was wet when we stacked it." (Pip reaction)
      cam = { pos: [ip.x - 1.2, 1.8, ip.z + 2.4], look: [ip.x, 1.6, ip.z], fov: 42 * K.push(u, 0.06) }; dof = { focus: 2.7, cinf: 12 };
    } else if (sh(541, 600)) {                // 11. "Wet hay can't burn!" he stacks a fresh wet pile (wide, bales dropping in)
      cam = K.fit([...STKB, ...body(pp), ...body(ip)], { yaw: 80, pitch: 12, fov: 44, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.CANT, 0.08, 6);
    } else if (sh(600, 653)) {                // 12. ... as bait (wide: the BAIT sign, thermometer going in)
      cam = K.fit([...STKB, [STK[0] - 2.9, 1.6, STK[1] + 1.1], ...body(pp)], { yaw: 120, pitch: 8, fov: 42, margin: 0.85, maxDist: 11 }); cam.fov *= K.punch(f, F.BAIT, 0.1, 6);
    } else if (sh(653, 705)) {                // 13. Tuesday: steaming like a kettle (wide: stack, thermometer, Pomfrey in his deck chair)
      cam = K.fit([...STKB, [STK[0], 5.0, STK[1]], [CHAIR[0], 0, CHAIR[1]], [CHAIR[0], 1.6, CHAIR[1]]], { yaw: 60, pitch: 8, fov: 44, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.KETTLE, 0.08, 6);
    } else if (sh(705, 766)) {                // 14. Wednesday: toasting his sandwich (full shot: Pomfrey + table + hot stack)
      cam = K.fit([[CHAIR[0] - 1.2, 0.8, CHAIR[1] - 0.6], [CHAIR[0], 0, CHAIR[1]], [CHAIR[0], 1.7, CHAIR[1]], [STK[0] + 2.4, 2.0, STK[1]]], { yaw: 75, pitch: 10, fov: 40, margin: 0.95, maxDist: 7 }); cam.fov *= K.punch(f, F.TOAST, 0.1, 6);
    } else if (sh(766, 815)) {                // 15. Thursday: it bursts into flames (wide, Pomfrey running)
      cam = K.fit([...STKB, [STK[0], 5.5, STK[1]], ...body(pp)], { yaw: 70, pitch: 8, fov: 44, margin: 0.85, maxDist: 13 }); cam.fov *= K.punch(f, F.BURST, 0.14, 6); const s = K.shake(f, F.BURST, 0.1, 18); cam.pos[0] += s[0]; cam.pos[1] += s[1];
    } else if (sh(815, 872)) {                // 16. ... with Pickles still locked in the coop (from beside the coop, the fire across the yard)
      cam = K.fit([[COOP[0] - 1.8, 0, COOP[1] - 1], [COOP[0] + 1.8, 3, COOP[1] + 1.3], [STK[0], 4, STK[1]], [STK[0] - 1, 0, STK[1]]], { yaw: 40, pitch: 6, fov: 46, margin: 0.85, maxDist: 13 }); cam.fov *= K.punch(f, F.STILL, 0.08, 6);
    } else if (sh(872, 900)) {                // 17. So who lit it? (Pomfrey reaction)
      cam = { pos: [pp.x - 0.6, 1.8, pp.z + 2.6], look: [pp.x, 1.6, pp.z], fov: 42 }; dof = { focus: 2.7, cinf: 12 };
    } else if (sh(900, 952)) {                // 18. x-ray bale: a buffet for bacteria (wide)
      cam = K.fit([[EX[0] - 2.4, 0, EX[2] - 1.3], [EX[0] + 2.4, 2.7, EX[2] + 1.3]], { yaw: 90 + 12 * u, pitch: 12, fov: 42, margin: 0.85, maxDist: 11 }); cam.fov *= K.punch(f, F.BUFFET, 0.08, 6);
    } else if (sh(952, 1005)) {               // 19. billions of tiny bacteria (closer, swarming)
      cam = K.fit([[EX[0] - 1.6, 0.6, EX[2] - 1], [EX[0] + 1.6, 2.4, EX[2] + 1]], { yaw: 60, pitch: 8, fov: 40, margin: 0.9, maxDist: 7 }); cam.fov *= K.punch(f, F.BILLIONS, 0.1, 6);
    } else if (sh(1005, 1055)) {              // 20. they eat, they make heat (glow inside)
      cam = K.fit([[EX[0] - 2.4, 0, EX[2] - 1.3], [EX[0] + 2.4, 2.7, EX[2] + 1.3], [EX[0] + 3.4, 3.4, EX[2] + 1.6]], { yaw: 120, pitch: 10, fov: 42, margin: 0.85, maxDist: 11 }); cam.fov *= K.punch(f, F.HEAT, 0.1, 6);
    } else if (sh(1055, 1107)) {              // 21. the tight stack traps it like a blanket (quilt drops on)
      cam = K.fit([[EX[0] - 2.6, 0, EX[2] - 1.5], [EX[0] + 2.6, 5.5, EX[2] + 1.5]], { yaw: 75, pitch: 14, fov: 42, margin: 0.85, maxDist: 11 }); cam.fov *= K.punch(f, F.BLANKET, 0.12, 6);
    } else if (sh(1107, 1185)) {              // 22. hotter and hotter, until it lights itself (thermometer, flame sprouts)
      cam = K.fit([[EX[0] - 2.6, 0, EX[2] - 1.5], [EX[0] + 3.6, 3.6, EX[2] + 1.8], [EX[0], 4.2, EX[2]]], { yaw: 100 - 10 * u, pitch: 10, fov: 42, margin: 0.85, maxDist: 11 }); cam.fov *= K.punch(f, F.LIGHTS, 0.14, 6);
    } else if (sh(1185, 1240)) {              // 23. Pomfrey arrested the bacteria (full shot: Pomfrey with the GUILTY jar, Pip, Edna)
      cam = K.fit([...body(pp), ...body(ip), ...body(ep), [COOP[0], 3, COOP[1] - 1]], { yaw: 95, pitch: 8, fov: 42, margin: 0.9, maxDist: 11 }); cam.fov *= K.punch(f, F.ARREST, 0.08, 6);
    } else {                                  // 24. Pickles ate the evidence. Case closed. (wide: the sheep eating the charred pile, everyone)
      cam = K.fit([[H1[0] - 1.6, 0, H1[1] - 1.6], [H1[0] + 1.6, 2.2, H1[1] + 1.6], [sp.x, 1, sp.z], ...body(pp), ...body(ep), ...body(ip)], { yaw: lerp(78, 68, u), pitch: 8, fov: 42, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.CLOSED, 0.1, 6);
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    if (h1burn) { K.steam(f, [H1[0], 2.6, H1[1]], { rate: 14, size: 1.4, rise: 3.0, drift: [0.4, 0.1], dark: 0.65 }); K.sparks(f, 0, 112, [H1[0], 1.6, H1[1]], { dir: [0, 1, 0], spread: 0.9, rate: 20, speed: 3, life: 20, color: '#ffb040', seed: 3 }); }
    else if (!ex && f < 1185) K.steam(f, [H1[0], 1.2, H1[1]], { rate: 3, size: 0.6, rise: 1.6, drift: [0.3, 0], dark: 0.4 });
    if (!ex && f < 339) for (const P of [C1, C2]) K.steam(f, [P[0], 1.1, P[1]], { rate: 2, size: 0.5, rise: 1.4, drift: [0.3, 0], dark: 0.4 });
    if (!ex && f >= 653 && f < F.BURST) K.steam(f, [STK[0], 2.6, STK[1]], { rate: f >= F.WED ? 12 : 7, size: 0.9, rise: 2.2, drift: [0.2, 0.05], dark: 0 });
    if (!ex && f >= F.TOAST && f < F.BURST) K.steam(f, [CHAIR[0] - 1.2, 0.95, CHAIR[1] - 0.6], { rate: 4, size: 0.25, rise: 1.0, drift: [0, 0], dark: 0.1 });
    if (!ex && f >= F.BURST - 4 && f < 892) { K.steam(f, [STK[0], 3.4, STK[1]], { rate: 16, size: 1.8, rise: 3.2, drift: [0.4, 0.1], dark: 0.7 }); K.sparks(f, F.BURST - 4, 892, [STK[0], 2, STK[1]], { dir: [0, 1, 0], spread: 1.2, rate: 26, speed: 4, life: 22, color: '#ffb040', seed: 8 }); }
    if (ex && f >= F.LIGHTS - 4) K.sparks(f, F.LIGHTS - 4, 1185, [EX[0], 3, EX[2]], { dir: [0, 1, 0], spread: 0.8, rate: 14, speed: 2.5, life: 18, color: '#ffb040', seed: 2 });
    K.leaves(f, cam.look, { area: 12, count: 8, fall: 0.3, colors: ['#e8c860', '#d8b850', '#c8a040'] });
    K.mist(f, 108, 14); K.mist(f, 892, 16); K.mist(f, 1177, 16);
    K.badge(f, F.SUSPECT, 'SUSPECT: SHEEP', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 108 });
    for (const [t, w, nx] of [[F.THREE, 'FIRE #1', F.WEEKS], [F.WEEKS, 'FIRE #2', F.PICKLES], [F.PICKLES, 'FIRE #3', 226]]) K.badge(f, t, w, { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: nx - 2 });
    K.badge(f, F.CASE, 'CASE CLOSED?', { sx: 0.5, sy: 0.2 }, { style: 'stamp', size: 0.9, f1: 336 });
    K.badge(f, F.WET, 'WET HAY', { sx: 0.5, sy: 0.2 }, { icon: 'drop', f1: 538 });
    if (f >= 653 && f < 872) K.hud(f, 655, { stages: 3, labels: ['TUE', 'WED', 'THU'], u: f < F.WED ? 0.12 : f < F.THU ? 0.5 : 0.92, f1: 870 });
    for (const [t, w, nx] of [[F.TUE, 'TUESDAY: STEAM', F.WED], [F.WED, 'WEDNESDAY: TOAST', F.THU], [F.THU, 'THURSDAY: FIRE!', 868]]) K.badge(f, t, w, { sx: 0.5, sy: 0.3 }, { icon: w.startsWith('THU') ? 'warn' : 'up', f1: nx - 2 });
    K.badge(f, F.BILLIONS, 'BILLIONS OF BACTERIA', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 1002 });
    K.badge(f, F.HEAT, 'EATING = HEAT', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: F.BLANKET - 2 });
    K.badge(f, F.BLANKET, 'TRAPPED INSIDE', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 1104 });
    K.badge(f, F.LIGHTS, 'LIGHTS ITSELF', { sx: 0.5, sy: 0.2 }, { icon: 'bolt', f1: 1183 });
    K.badge(f, F.CLOSED, 'CASE CLOSED', { sx: 0.5, sy: 0.2 }, { style: 'stamp', size: 1.1, f1: 1348 });
    const L = K.light('golden', { az: 115, el: 32, shadowExt: 24, exposure: 1.25 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
