// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Warm Hockey Pucks Bounce Like Super Balls" — invented story, engine: The Complaint Desk (SCRIPTS.md §000).
// Outdoor-rink manager Bernie ("Nice and toasty!") answers every complaint by warming things up. Pucks "too cold to touch" get
// baked in the pizza oven: at the championship final the puck boings off the ice, off the ref's helmet, over the scoreboard and
// into the nachos. Waffles the bear goalie is "too chilly to nap", so every patio heater goes to max: pinball, 41 bounces, one
// goal, wrong net. Explainer: a puck is rubber; warm rubber is springy like a bouncy ball; frozen rubber goes stiff and slides
// flat. Real rinks keep pucks in a freezer. Bernie freezes the pucks; Waffles moves into the freezer. Nice and toasty.
import { TOTAL, LINES, wf } from './warmpuck_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const RX = 14, RZ = 6.5, IY = 0.1;                       // rink half-size, ice top
const GL = [-12.2, 0], GR = [12.2, 0];                    // goals (Waffles guards the left one)
const SHACK = [-9, -9.8], NACHO = [-9.4, 1.18, -9.2], OVEN = [-13.2, -9.4], FRZ = [-5.2, -8.9], BOARD = [2, -13.5], EX = [160, 0, 0];
let THREE, F = {}, PUCK, TRAY, TRAYP = [], HEAT = [], FRZL, FRZP = [], BER, PIA, REF, PL = [], FANS = [], BEAR, LAMPR, SCR, HX = {}, OVENFIRE;

function puckMesh(K, parent, s = 1) { const g = new THREE.Group(); parent.add(g);
  const b = new THREE.Mesh(new THREE.CylinderGeometry(0.22 * s, 0.22 * s, 0.1 * s, 28), K.paint('#18181c', { rough: 0.35, coat: 0.6 })); g.add(b);
  const r = new THREE.Mesh(new THREE.TorusGeometry(0.222 * s, 0.012 * s, 6, 28), K.gold()); r.rotation.x = Math.PI / 2; g.add(r);
  const t = new THREE.Mesh(new THREE.CircleGeometry(0.12 * s, 20), K.paint('#f2c230', { rough: 0.4 })); t.rotation.x = -Math.PI / 2; t.position.y = 0.051 * s; g.add(t);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return g; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { BOUNCED: wf(0, 'bounced'), SCORE: wf(0, 'scoreboard'), TWICE: wf(0, 'twice'), CHAMP: wf(1, 'championship'), FINAL: wf(1, 'final'), LANDED: wf(1, 'landed'), NACHOS: wf(1, 'nachos'),
      COMPLAINT: wf(2, 'complaint'), COLD: wf(2, 'cold'), NICE: wf(3, 'nice'), BAKED: wf(3, 'baked'), OVEN: wf(3, 'oven'), FACE: wf(4, 'face'), HIT: wf(4, 'hit'), BOING: wf(4, 'boing'), REF: wf(4, 'ref'), HELMET: wf(4, 'helmet'),
      WAFFLES: wf(5, 'waffles'), BEAR: wf(5, 'bear'), COMPL2: wf(5, 'complained'), CHILLY: wf(5, 'chilly'), NAP: wf(5, 'nap'), NICE2: wf(6, 'nice'), CRANKED: wf(6, 'cranked'), HEATER: wf(6, 'heater'), MAX: wf(6, 'max'),
      SLAP: wf(7, 'slapshot'), PINBALL: wf(7, 'pinball'), FORTY: wf(7, 'forty'), GOAL: wf(7, 'goal'), WRONG: wf(7, 'wrong'), NET: wf(7, 'net'), COLDP: wf(8, 'cold'), WARM: wf(8, 'warm'), FLIES: wf(8, 'flies'),
      RUBBER: wf(9, 'rubber'), SPRINGY: wf(9, 'springy'), BOUNCY: wf(9, 'bouncy'), FREEZE: wf(10, 'freeze'), STIFF: wf(10, 'stiff'), SLIDES: wf(10, 'slides'), FLAT: wf(10, 'flat'),
      RINKS: wf(11, 'rinks'), FREEZER: wf(11, 'freezer'), GAME: wf(11, 'game'), FROZE: wf(12, 'froze'), WAFF2: wf(12, 'waffles'), MOVED: wf(12, 'moved'), FREEZER2: wf(12, 'freezer'), NICE3: wf(12, 'nice') };
    // ================= snowy village + the outdoor rink =================
    K.slab(-120, 120, -0.2, -0.01, -80, 80, K.mat('grime', '#eef3f8', { amt: 0.25, detail: 1.2 }), sc, false);
    const G = K.group();
    const ice = K.paint('#dfeefc', { rough: 0.06, coat: 1 }); K.slab(-RX, RX, 0, IY, -RZ, RZ, ice, G, false);
    const line = (x0, x1, z0, z1, c) => K.slab(x0, x1, IY, IY + 0.004, z0, z1, K.paint(c, { rough: 0.2 }), G, false);
    line(-0.15, 0.15, -RZ, RZ, '#d02a2a'); line(-4.6, -4.3, -RZ, RZ, '#2a5ad0'); line(4.3, 4.6, -RZ, RZ, '#2a5ad0'); line(-12.25, -12.15, -RZ, RZ, '#d02a2a'); line(12.15, 12.25, -RZ, RZ, '#d02a2a');
    for (const [cx, cz, r, c] of [[0, 0, 2.2, '#2a5ad0'], [-8, -3, 1.6, '#d02a2a'], [-8, 3, 1.6, '#d02a2a'], [8, -3, 1.6, '#d02a2a'], [8, 3, 1.6, '#d02a2a']]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.05, 6, 48), K.paint(c)); t.rotation.x = Math.PI / 2; t.scale.z = 0.05; t.position.set(cx, IY + 0.003, cz); G.add(t); }
    for (const gx of [-12.2, 12.2]) { const cr = new THREE.Mesh(new THREE.CircleGeometry(1.2, 32, -Math.PI / 2, Math.PI), K.paint('#7ab0ff', { rough: 0.2 })); cr.rotation.x = -Math.PI / 2; if (gx > 0) cr.rotation.z = Math.PI; cr.position.set(gx, IY + 0.005, 0); G.add(cr); }
    // boards with ad panels, yellow kick plate, top rail; glass on the ends and the far side
    const ads = ["BERNIE'S RINK", 'HOT COCOA', 'NACHOS', 'FROSTBITE FC', 'PIZZA OVEN', 'SKATE RENTAL'];
    const WH = K.paint('#f4f6f8', { rough: 0.3 }), YL = K.paint('#f2c230'), RL = K.paint('#2a5ad0', { rough: 0.3 });
    const boardRun = (x0, z0, x1, z1, n, seed) => { const L = Math.hypot(x1 - x0, z1 - z0), a = Math.atan2(z1 - z0, x1 - x0);
      for (let k = 0; k < n; k++) { const t = (k + 0.5) / n, cx = lerp(x0, x1, t), cz = lerp(z0, z1, t), w = L / n;
        const p = K.rbox(w - 0.04, 1.05, 0.14, 0.03, WH, cx, 0.6, cz, G); p.rotation.y = -a; const k2 = K.rbox(w - 0.02, 0.22, 0.16, 0.02, YL, cx, 0.2, cz, G); k2.rotation.y = -a; const tr = K.rbox(w, 0.08, 0.22, 0.03, RL, cx, 1.14, cz, G); tr.rotation.y = -a;
        for (const s of [-1, 1]) { const ad = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.8, 0.5), S.textMat(ads[(k + seed) % ads.length], { bg: ['#d02a2a', '#2a5ad0', '#f2c230', '#2a8a5a'][(k + seed) % 4], fg: '#ffffff', w: 512, h: 128, border: false }));
          ad.position.set(cx - Math.sin(a) * 0.08 * s, 0.68, cz + Math.cos(a) * 0.08 * s); ad.rotation.y = -a + (s > 0 ? 0 : Math.PI); G.add(ad); } } };
    boardRun(-RX, RZ, RX, RZ, 8, 0); boardRun(RX, -RZ, -RX, -RZ, 8, 3); boardRun(-RX, -RZ, -RX, RZ, 4, 1); boardRun(RX, RZ, RX, -RZ, 4, 4);
    const glass = K.glass({ color: '#e8f4ff', opacity: 0.18 });
    for (const sx of [-1, 1]) { K.rbox(0.04, 1.6, 2 * RZ, 0.02, glass, sx * RX, 1.95, 0, G); for (let k = -3; k <= 3; k++) K.rbox(0.07, 1.6, 0.07, 0.02, K.chrome(), sx * RX, 1.95, k * RZ / 3, G); }
    // goals
    for (const [gx, dir] of [[GL[0], -1], [GR[0], 1]]) { const R = K.paint('#d02a2a', { rough: 0.3 }), nm = K.glass({ color: '#ffffff', opacity: 0.35 });
      for (const s of [-1, 1]) K.cyl(0.05, 0.05, 1.2, R, gx, IY, s * 0.9, G, 10); const cb = K.cyl(0.05, 0.05, 1.8, R, gx, 1.3, -0.9, G, 10); cb.rotation.x = Math.PI / 2; cb.position.set(gx, 1.3, 0);
      K.rbox(0.9, 1.15, 1.8, 0.1, nm, gx + dir * 0.45, IY + 0.6, 0, G); }
    // far side: standing fans area, bleachers, scoreboard, snack shack, pizza oven, freezer, heaters
    for (let k = 0; k < 4; k++) K.rbox(14, 0.35, 0.9, 0.05, K.mat('wood', '#a87a4a'), 4, 0.25 + k * 0.4, -9.4 - k * 0.9, G);
    for (const sx of [-2.9, 10.9]) for (let k = 0; k < 4; k++) K.rbox(0.12, 0.45 + k * 0.4, 0.12, 0.02, K.chrome(), sx, (0.45 + k * 0.4) / 2, -9.4 - k * 0.9, G);
    K.cyl(0.12, 0.14, 7.2, K.paint('#3a4048', { rough: 0.4 }), BOARD[0] - 2.2, 0, BOARD[1], G, 12); K.cyl(0.12, 0.14, 7.2, K.paint('#3a4048', { rough: 0.4 }), BOARD[0] + 2.2, 0, BOARD[1], G, 12);
    K.rbox(5.6, 2.6, 0.5, 0.12, K.paint('#1c1c22', { rough: 0.35 }), BOARD[0], 7.4, BOARD[1], G); K.rbox(5.8, 0.18, 0.55, 0.05, K.gold(), BOARD[0], 8.75, BOARD[1], G);
    for (let k = 0; k < 14; k++) K.sphere(0.06, new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffe8a0').multiplyScalar(2), toneMapped: false }), BOARD[0] - 2.6 + k * 0.4, 8.6, BOARD[1] + 0.27, G);
    SCR = new THREE.Mesh(new THREE.PlaneGeometry(5.1, 2.2), S.textMat('HOME 2 : 2 AWAY|FINAL  0:42', { bg: '#0a0a12', fg: '#ffb030', w: 768, h: 330, border: false })); SCR.position.set(BOARD[0], 7.35, BOARD[1] + 0.26); sc.add(SCR);
    const shack = S.building({ w: 5.2, d: 3.2, floors: 1, color: '#c8502a', gable: 'pitched', seed: 41, shop: 'NACHOS & PIZZA', awning: '#f2c230', kind: 'wood' }); shack.position.set(SHACK[0], 0, SHACK[1]);
    K.rbox(4.4, 0.12, 0.7, 0.04, K.mat('wood', '#8a5a34'), SHACK[0], 1.05, SHACK[1] + 0.55, G); K.rbox(4.3, 1.0, 0.1, 0.03, K.mat('wood', '#a8703a'), SHACK[0], 0.5, SHACK[1] + 0.85, G);
    K.rbox(0.9, 0.08, 0.5, 0.03, K.paint('#2a2a30'), NACHO[0], 1.13, NACHO[2], G); for (let k = 0; k < 18; k++) { const c = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.12, 3), K.paint('#f2b830', { rough: 0.5 })); c.position.set(NACHO[0] - 0.35 + hash(k) * 0.7, 1.22 + hash(k + 3) * 0.05, NACHO[2] - 0.18 + hash(k + 7) * 0.36); c.rotation.set(hash(k + 1) * 3, hash(k + 2) * 3, 0); G.add(c); }
    K.sphere(0.2, K.paint('#f6c020', { rough: 0.2, coat: 1 }), NACHO[0] + 0.1, 1.2, NACHO[2], G, 1.4, 0.35, 1);
    for (let k = 0; k < 4; k++) { const cup = K.cyl(0.08, 0.06, 0.18, K.paint(['#f4f4f0', '#d02a2a'][k % 2]), SHACK[0] + 1.0 + k * 0.25, 1.11, SHACK[1] + 0.5, G, 12); void cup; }
    const cs = S.board('HOT COCOA $2|NACHOS $3', 1.4, 0.9); cs.position.set(SHACK[0] + 3.2, 0, SHACK[1] + 0.8);
    // brick pizza oven with a chimney and a fire mouth
    { const br = K.mat('brick', '#b8583a', { detail: 1.4 }); K.rbox(2.4, 1.0, 2.2, 0.08, K.mat('rock', '#8a8478'), OVEN[0], 0.5, OVEN[1], G);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(1.1, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), br); dome.position.set(OVEN[0], 1.0, OVEN[1]); dome.castShadow = true; G.add(dome);
      K.cyl(0.18, 0.2, 1.4, br, OVEN[0] - 0.3, 1.8, OVEN[1] - 0.4, G, 12); const m = new THREE.Mesh(new THREE.CircleGeometry(0.45, 24, 0, Math.PI), K.paint('#1a0a06', { rough: 1 })); m.position.set(OVEN[0], 1.02, OVEN[1] + 1.09); G.add(m);
      const lb = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.3), S.textMat('PIZZA OVEN', { bg: '#2a1a14', fg: '#f2c230', w: 400, h: 90, border: false })); lb.position.set(OVEN[0], 0.6, OVEN[1] + 1.11); G.add(lb); }
    OVENFIRE = new THREE.Mesh(new THREE.CircleGeometry(0.36, 20, 0, Math.PI), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff8a2a').multiplyScalar(2.2), toneMapped: false })); OVENFIRE.position.set(OVEN[0], 1.03, OVEN[1] + 1.1); OVENFIRE.userData.ndSkip = true; sc.add(OVENFIRE);
    K.lamp(OVEN[0], 1.3, OVEN[1] + 1.6, { color: '#ff9a4a', intensity: 2.5, distance: 6, flicker: 0.2 });
    // chest freezer
    { const FW = K.paint('#f4f8fc', { rough: 0.25 }), FB = K.paint('#2a6ad0', { rough: 0.3 }); K.rbox(1.8, 0.9, 0.9, 0.08, FW, FRZ[0], 0.45, FRZ[1], G); K.rbox(1.82, 0.08, 0.92, 0.03, FB, FRZ[0], 0.86, FRZ[1], G);
      K.rbox(1.6, 0.05, 0.7, 0.02, K.paint('#1a3a6a', { rough: 0.8 }), FRZ[0], 0.885, FRZ[1], G);
      const lb = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.3), S.textMat('PUCKS  -10°', { bg: '#2a6ad0', fg: '#ffffff', w: 400, h: 100, border: false })); lb.position.set(FRZ[0], 0.55, FRZ[1] + 0.46); G.add(lb);
      const k2 = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.2), S.textMat('KEEP FROZEN', { bg: '#f4f8fc', fg: '#2a6ad0', w: 400, h: 80, border: false })); k2.position.set(FRZ[0], 0.25, FRZ[1] + 0.46); G.add(k2); }
    FRZL = new THREE.Group(); FRZL.position.set(FRZ[0], 0.9, FRZ[1] - 0.45); sc.add(FRZL); K.rbox(1.82, 0.1, 0.92, 0.04, K.paint('#2a6ad0', { rough: 0.3 }), 0, 0.05, 0.46, FRZL); K.rbox(0.5, 0.06, 0.08, 0.02, K.chrome(), 0, 0.06, 0.94, FRZL);
    for (let k = 0; k < 10; k++) { const p = puckMesh(K, sc, 1); FRZP.push(p); }
    // patio heaters (glow cranks up)
    for (const [hx, hz] of [[-11, -7.6], [-1, -7.6], [7, -7.6], [13, -7.6], [-15.4, 3], [15.4, -3]]) { const g = new THREE.Group(); g.position.set(hx, 0, hz); sc.add(g); const CR = K.chrome();
      K.cyl(0.35, 0.4, 0.12, K.paint('#3a3a40'), 0, 0, 0, g, 20); K.cyl(0.05, 0.05, 2.3, CR, 0, 0.1, 0, g, 10); const top = new THREE.Mesh(new THREE.ConeGeometry(0.75, 0.3, 24, 1, true), CR); top.position.y = 2.6; g.add(top);
      const gw = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.5, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff6a1a'), toneMapped: false })); gw.position.y = 2.25; gw.userData.ndSkip = true; g.add(gw); HEAT.push({ g, gw }); }
    // goal lamp (lights red on the goal)
    LAMPR = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 10), new THREE.MeshBasicMaterial({ color: '#601010', toneMapped: false })); LAMPR.position.set(GL[0] - 2.0, 2.9, 0); LAMPR.userData.ndSkip = true; sc.add(LAMPR); K.cyl(0.04, 0.04, 2.8, K.chrome(), GL[0] - 2.0, 0, 0, G, 8);
    S.bake(G);
    // village behind
    let x = -60, i = 0; while (x < 60) { const w = 6 + (i * 5 % 3); const b = S.building({ w, d: 8, floors: 2 + (i % 2), seed: i + 70, gable: i % 3 ? 'pitched' : 'step', color: ['#e8d8b0', '#c86a4a', '#7ab0c8', '#f2e2c0'][i % 4], shutters: i % 2 ? '#2a5a3a' : null, flowers: false, shop: i % 4 === 1 ? ['SKATES', 'COCOA', 'BAKERY'][(i / 4 | 0) % 3] : null }); b.position.set(x + w / 2, 0, -20); x += w + 0.4; i++; }
    for (const [tx, tz, h] of [[-20, -14, 6], [-24, -6, 5], [21, -14, 6], [24, -4, 5], [-26, 6, 5.5], [26, 7, 6], [-18, 14, 5], [18, 15, 5], [0, -16.5, 5], [12, -16, 5.5]]) { const t = S.tree({ h, seed: tx + tz, colors: ['#2f6a3a', '#3f7a4a', '#2a5a34', '#e8f0f4'] }); t.position.set(tx, 0, tz); }
    for (const [lx, lz] of [[-17, 8], [17, 8], [-17, -8], [17, -8]]) { const l = S.streetLamp(); l.position.set(lx, 0, lz); }
    // the hero puck + a tray of pucks for the oven
    PUCK = puckMesh(K, sc, 1.7);
    TRAY = new THREE.Group(); sc.add(TRAY); K.rbox(1.0, 0.04, 0.6, 0.02, K.chrome(), 0, 0, 0, TRAY); K.rbox(0.08, 0.04, 0.9, 0.02, K.mat('wood', '#a8703a'), 0, 0, 0.7, TRAY);
    for (let k = 0; k < 6; k++) { const p = puckMesh(K, TRAY, 0.9); p.position.set(-0.3 + (k % 3) * 0.3, 0.07, -0.13 + Math.floor(k / 3) * 0.26); TRAYP.push(p); }
    // ================= explainer stage: x-ray puck with springs, bouncy ball, frozen puck =================
    const EG = K.group(); K.cyl(9, 9, 0.1, K.paint('#1f2a44', { rough: 0.4 }), EX[0], 0, EX[2], EG, 64);
    for (const r of [4, 8.6]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.04, 8, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color('#36e2ff').multiplyScalar(1.6), toneMapped: false })); t.rotation.x = Math.PI / 2; t.position.set(EX[0], 0.12, EX[2]); t.userData.ndSkip = true; EG.add(t); }
    HX.g = new THREE.Group(); HX.g.position.set(EX[0] - 1.2, 0, EX[2]); sc.add(HX.g); HX.k = 1.5;
    HX.shell = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 1.0, 40), K.holo('#36e2ff')); HX.g.add(HX.shell);
    HX.nodes = []; HX.springs = []; HX.bars = [];
    const helix = (() => { const pts = []; for (let k = 0; k <= 80; k++) { const a = k / 80 * Math.PI * 2 * 5; pts.push(new THREE.Vector3(Math.cos(a) * 0.14, k / 80, Math.sin(a) * 0.14)); } return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.035, 6, false); })();
    const sMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#7af8a0').multiplyScalar(2), toneMapped: false }), bMat = new THREE.MeshBasicMaterial({ color: new THREE.Color('#bfe8ff').multiplyScalar(1.8), toneMapped: false });
    for (let c = 0; c < 4; c++) for (let r = 0; r < 2; r++) { const n = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffb050').multiplyScalar(1.8), toneMapped: false })); n.userData.ndSkip = true; HX.g.add(n); HX.nodes.push({ n, c, r }); }
    for (let c = 0; c < 4; c++) { const s = new THREE.Mesh(helix, sMat); s.userData.ndSkip = true; HX.g.add(s); HX.springs.push(s); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1, 8), bMat); b.userData.ndSkip = true; HX.g.add(b); HX.bars.push(b); }
    HX.ball = new THREE.Mesh(new THREE.SphereGeometry(0.55, 28, 18), K.paint('#e8202a', { rough: 0.15, coat: 1 })); HX.ball.castShadow = true; sc.add(HX.ball);
    { const st = new THREE.Mesh(new THREE.TorusGeometry(0.555, 0.06, 8, 32), K.paint('#f2c230')); HX.ball.add(st); }
    HX.cold = puckMesh(K, sc, 3.2);
    HX.frost = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.75, 1.05, 40), K.glass({ color: '#e8f8ff', opacity: 0.5 })); HX.g.add(HX.frost);
    // ================= characters =================
    BER = K.stick({ jacket: '#2a7a4a', pants: '#3a2a1e', hat: 'beanie', hatColor: '#d02a2a', scarf: '#f2c230', moustache: '#6a4a2a', glasses: true, vest: '#c8a070', gloves: '#d02a2a', build: 'stout' }, { key: 'ber' });
    PIA = K.stick({ jacket: '#2a5ad0', pants: '#1a2a5a', hat: 'helmet', hatColor: '#2a5ad0', gloves: '#f2c230', hairStyle: 'ponytail', hair: '#c8502a', collar: '#ffffff', boots: '#1a1a1a' }, { key: 'pia' });
    REF = K.stick({ jacket: '#f4f4f0', pants: '#1a1a1a', hat: 'helmet', hatColor: '#1a1a1a', collar: '#1a1a1a', tie: '#1a1a1a', boots: '#1a1a1a', moustache: '#3a2a1e' }, { key: 'ref' });
    const po = [{ jacket: '#2a5ad0', pants: '#1a2a5a', hat: 'helmet', hatColor: '#f4f4f0', gloves: '#2a5ad0', collar: '#ffffff', boots: '#1a1a1a' },
      { jacket: '#d02a2a', pants: '#5a1a1a', hat: 'helmet', hatColor: '#d02a2a', gloves: '#f4f4f0', collar: '#f2c230', boots: '#1a1a1a', moustache: '#2a1a14' },
      { jacket: '#d02a2a', pants: '#5a1a1a', hat: 'helmet', hatColor: '#f2c230', gloves: '#1a1a1a', collar: '#f2c230', boots: '#1a1a1a', hairStyle: 'bun', hair: '#1a1210' }];
    po.forEach((o, k) => PL.push(K.stick(o, { key: 'pl' + k })));
    const fo = ['#7a4a9a', '#c0632a', '#2a6a9a', '#d8a830', '#a83a3a', '#3a7a4a', '#4a4a5a', '#c84a8a'];
    for (let k = 0; k < 8; k++) FANS.push(K.stick({ jacket: fo[k], pants: ['#2c3e5a', '#3a2a1e', '#2a2a30'][k % 3], hat: ['beanie', 'cap', null, 'beanie'][k % 4], hatColor: ['#d02a2a', '#2a5ad0', '#f2c230'][k % 3], scarf: ['#f08a24', '#2a5ad0', '#f4f4f0', '#d02a2a'][k % 4], hairStyle: ['short', 'bun', 'curly', 'ponytail'][k % 4], hair: ['#3a2a1e', '#c8502a', '#1a1a1a'][k % 3] }, { key: 'fan' + k }));
    BEAR = K.animal('bear', { seed: 3, scale: 1.0, color: '#7a4a2a' });
    K.addClouds(8, 700, 150);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s), sc = K.scene;
    const ex = f >= 895 && f < 1104, morning = f >= 192 && f < 396;
    // ---------- the puck ----------
    const arc = (a, b, h, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u) + 4 * h * u * (1 - u), lerp(a[2], b[2], u)];
    let pp = [0, IY + 0.06, 0], pv = true, prot = f * 0.4;
    const P0 = [-5, IY + 0.06, 1.5], P1 = [-1, IY + 0.06, -4.5], P2 = NACHO.map((v, k) => k === 1 ? v + 0.12 : v);
    if (f < 66) pp = arc(P0, P1, 10.5, 0.22 + 0.78 * f / 66);
    else if (f < F.NACHOS) pp = arc(P1, P2, 11.5, (f - 66) / (F.NACHOS - 66));
    else if (f < 192) { pp = P2; prot = 0; }
    else if (morning) pv = false;
    else if (f < F.HIT) { const u = sm(F.FACE + 4, F.HIT, f); pp = [0, lerp(1.8, IY + 0.06, u * u), 0.2]; prot = 0; }
    else if (f < F.BOING) pp = [0, IY + 0.06 + 0.5 * Math.abs(Math.sin((f - F.HIT) * 0.25)), 0.2];
    else if (f < F.HELMET) pp = arc([0, IY + 0.06, 0.2], [0.7, 2.1, 1.2], 3.5, (f - F.BOING) / (F.HELMET - F.BOING));
    else if (f < 505) pp = arc([0.7, 2.1, 1.2], [5.5, IY + 0.06, 4.5], 2.2, (f - F.HELMET) / (505 - F.HELMET));
    else if (f < F.SLAP) pp = [5.5 + 0.3 * Math.sin(f * 0.3), IY + 0.06 + 0.4 * Math.abs(Math.sin(f * 0.22)), 4.5];
    else if (f < F.WRONG + 4) { const pts = [[-6, 0, 0.5], [-2, 0, -6.1], [3, 0, 2], [8, 0, -6.1], [13.8, 0, -2], [9, 0, 6.2], [2, 0, -1], [-4, 0, 6.2], [-9, 0, -4], [-13.0, 0, 0.1]];
      const u = clamp((f - F.SLAP) / (F.WRONG + 4 - F.SLAP), 0, 1) * (pts.length - 1), k = Math.min(pts.length - 2, Math.floor(u)), v = u - k;
      pp = arc([pts[k][0], IY + 0.06, pts[k][2]], [pts[k + 1][0], IY + 0.06, pts[k + 1][2]], 1.0 + (k % 3) * 0.6, v); }
    else if (f < 895) pp = [-13.0, IY + 0.06, 0.1];
    else if (ex) pv = false;
    else if (f < 1200) pv = false;
    else { const u = sm(1206, 1262, f); pp = [lerp(-1, 11.9, u), IY + 0.06, lerp(1.5, 0.1, u)]; prot = u * 8; }
    PUCK.visible = pv; PUCK.position.set(...pp); PUCK.rotation.set(f < 192 || (f > F.BOING && f < F.WRONG + 4) ? 0.6 * Math.sin(f * 0.5) : 0, prot, 0);
    // tray into the oven, oven fire
    TRAY.visible = morning && f >= 291; { const u = sm(F.BAKED - 6, F.OVEN + 4, f); TRAY.position.set(OVEN[0] + 0.0, 1.06, OVEN[1] + lerp(2.6, 0.9, u)); }
    TRAYP.forEach((p) => p.children[0].material.emissive && 0);
    OVENFIRE.scale.setScalar(1 + 0.08 * Math.sin(f * 0.7));
    // heaters
    const heat = f < F.CRANKED ? 0.35 : 0.35 + 0.65 * sm(F.CRANKED, F.MAX + 6, f);
    HEAT.forEach((h, k) => { h.gw.material.color.set('#ff6a1a').multiplyScalar(0.6 + 2.2 * heat * (0.9 + 0.1 * Math.sin(f * 0.5 + k))); h.g.visible = !ex; });
    // freezer lid + pucks going in
    const lid = f >= 1108 && f < 1200 ? sm(1110, 1124, f) : f >= 1200 ? 1 : 0; FRZL.rotation.x = -1.6 * lid; FRZL.visible = !ex;
    FRZP.forEach((p, k) => { p.visible = !ex && f >= 1108; const u = sm(F.FREEZER - 20 + k * 3, F.FREEZER + k * 3, f); p.position.set(FRZ[0] - 0.6 + (k % 5) * 0.3, lerp(1.6, 0.6 + Math.floor(k / 5) * 0.1, u), FRZ[1] + lerp(1.2, -0.1, u) + Math.floor(k / 5) * 0.15); });
    LAMPR.material.color.set(f >= F.WRONG && f < 895 && Math.floor(f / 6) % 2 === 0 ? new THREE.Color('#ff2020').multiplyScalar(2.5) : new THREE.Color('#601010'));
    // ---------- characters ----------
    const show = (c, on) => { c.root.visible = on; };
    // Bernie
    let bp = { x: -6.5, z: -8.2, yaw: 0.2 };
    if (morning && f < 291) bp = { x: SHACK[0] - 0.6, z: SHACK[1] + 0.2, yaw: 0 };
    else if (morning) bp = { x: OVEN[0] + 1.5, z: OVEN[1] + 1.9, yaw: -Math.PI / 2 - 0.5 };
    else if (f >= 605 && f < 701) bp = { x: -1.6, z: -7.1, yaw: 0.5 };
    else if (f >= 701 && f < 895) bp = { x: -7, z: -7.6, yaw: 0.2 };
    else if (f >= 1104 && f < 1200) bp = { x: FRZ[0] - 1.4, z: FRZ[1] + 1.0, yaw: Math.PI * 0.72 };
    else if (f >= 1200) bp = { x: FRZ[0] + 1.6, z: FRZ[1] + 1.0, yaw: -0.4 };
    const bk = [[0, 'shock', { expr: 'shock' }], [F.TWICE, 'facepalm', { expr: 'pained' }], [F.NACHOS - 6, 'panic', { expr: 'scared', sweat: true }],
      [192, 'idle', { expr: 'smile' }], [F.COLD, 'think', { expr: 'confused' }], [F.NICE - 6, 'cheer', { expr: 'grin', talk: true }], [F.BAKED - 6, 'push', { expr: 'proud' }], [F.OVEN + 6, 'hips', { expr: 'smug' }],
      [396, 'cheer', { expr: 'excited' }], [F.HELMET, 'shock', { expr: 'shock' }], [605, 'point', { expr: 'grin', talk: true }], [F.CRANKED - 4, 'reach', { expr: 'proud', R: [0.6, -0.2, 'open'] }], [F.MAX, 'celebrate', { expr: 'laugh' }],
      [701, 'shock', { expr: 'shock' }], [F.FORTY, 'panic', { expr: 'scared', sweat: true }], [F.WRONG, 'facepalm', { expr: 'pained' }], [817, 'shrug', { expr: 'confused' }], [F.WARM, 'think', { expr: 'confused' }],
      [1104, 'carry', { expr: 'neutral', item: 'box' }], [F.FREEZER - 6, 'reach', { expr: 'proud' }], [1200, 'hips', { expr: 'proud' }], [F.MOVED, 'shock', { expr: 'shock' }], [F.NICE3 - 4, 'shrug', { expr: 'smile', talk: true }]];
    BER.set(T.act(f, bk, { seed: 3, blink: blink(3) }), bp); show(BER, !ex);
    // Pia (captain)
    let pp2 = { x: -3.5, z: 2.2, yaw: Math.PI * 0.85 };
    if (morning) pp2 = { x: SHACK[0] + 1.3, z: SHACK[1] + 1.9, yaw: f < 245 ? 2.5 : 0.5 };
    else if (f >= 396 && f < 505) pp2 = { x: -1.1, z: 0.2, yaw: Math.PI / 2 };
    else if (f >= 701 && f < 895) pp2 = { x: lerp(-5.2, -7.5, sm(F.SLAP, F.WRONG, f)), z: 0.8, yaw: -Math.PI / 2 + 0.3 };
    else if (f >= 1200) { const u = sm(1200, 1250, f); pp2 = { x: lerp(-3, 1, u), z: 1.6, yaw: Math.PI / 2 }; }
    const pk = [[0, 'pointUp', { expr: 'shock' }], [F.NACHOS, 'facepalm', { expr: 'pained' }], [192, 'show', { expr: 'angry', R: [0.3, 0.1, 'coin'] }], [F.COLD, 'scared', { expr: 'angry', sweat: true }], [291, 'cross', { expr: 'stern' }],
      [396, 'crouch', { expr: 'stern' }], [F.BOING, 'shock', { expr: 'shock' }], [505, 'idle', { expr: 'confused' }], [701, 'throwBack', { expr: 'stern' }], [F.SLAP + 4, 'throw', { expr: 'grin' }], [F.PINBALL, 'panic', { expr: 'scared' }], [F.WRONG, 'facepalm', { expr: 'pained' }],
      [1200, 'throwBack', { expr: 'stern' }], [1208, 'throw', { expr: 'grin' }], [1262, 'celebrate', { expr: 'laugh' }]];
    PIA.set(T.act(f, pk, { seed: 6, blink: blink(6) }), pp2); show(PIA, !ex);
    // referee
    const rp = f >= 396 && f < 505 ? { x: 0.35, z: 1.4, yaw: Math.PI } : { x: 3, z: 3.2, yaw: -2.6 };
    const rk = [[0, 'pointUp', { expr: 'shock' }], [396, 'reach', { expr: 'stern', R: [0.3, -0.6, 'open'] }], [F.HIT, 'idle', { expr: 'neutral' }], [F.BOING, 'shock', { expr: 'shock' }], [F.HELMET, 'fall', { expr: 'dazed' }], [F.HELMET + 30, 'idle', { expr: 'dazed' }],
      [701, 'shock', { expr: 'shock' }], [F.WRONG, 'point', { expr: 'stern' }], [1200, 'idle', { expr: 'neutral' }], [1262, 'point', { expr: 'smile' }]];
    REF.set(T.act(f, rk, { seed: 9, blink: blink(9) }), rp); show(REF, !ex && !morning);
    // other players
    const plp = [[[3.5, -1.5, -2.2], [1.1, 0.2, -Math.PI / 2], [6.5, 2.5, -2]], [[2.5, 2.4, -2.4], [1.4, -0.6, -Math.PI / 2], [8, -2.8, -2.6]], [[6.5, -0.8, -1.7], [3, 1.6, -1.9], [10.5, 0.2, -1.4]]];
    PL.forEach((p, k) => { const ph = f >= 396 && f < 505 ? 1 : f >= 701 && f < 895 ? 2 : 0; const q = plp[k][ph];
      const ak = [[0, k === 1 ? 'pointUp' : 'shock', { expr: 'shock' }], [F.NACHOS, 'cheer', { expr: 'laugh' }], [396, 'crouch', { expr: 'stern' }], [F.BOING, 'shock', { expr: 'shock' }], [F.HELMET, 'laugh', { expr: 'laugh' }],
        [701, 'idle', { expr: 'neutral' }], [F.PINBALL + k * 8, ['jump', 'crouch', 'panic'][k], { expr: 'scared' }], [F.WRONG, k > 0 ? 'celebrate' : 'facepalm', { expr: k > 0 ? 'laugh' : 'pained' }], [1200, 'idle', { expr: 'neutral' }], [1262, k > 0 ? 'shrug' : 'cheer', { expr: k > 0 ? 'sad' : 'laugh' }]];
      p.set(T.act(f, ak.map((a) => a[1] === 'laugh' ? [a[0], 'clap', a[2]] : a), { seed: 12 + k, blink: blink(12 + k) }), { x: q[0], z: q[1], yaw: q[2] }); show(p, !ex && !morning); });
    // fans behind the far boards
    FANS.forEach((fa, k) => { const x = -3 + k * 1.75 + (k % 2) * 0.3, z = -7.4 - (k % 2) * 0.5;
      const ak = [[0, k % 3 === 0 ? 'pointUp' : 'shock', { expr: 'shock' }], [F.NACHOS, k % 2 ? 'cheer' : 'laugh', { expr: 'laugh' }], [396, 'clap', { expr: 'smile' }], [F.HELMET, 'shock', { expr: 'shock' }], [605, 'idle', { expr: 'neutral' }],
        [F.MAX, 'celebrate', { expr: 'excited' }], [F.PINBALL + k * 3, k % 2 ? 'panic' : 'pointUp', { expr: 'scared' }], [F.WRONG, k % 3 ? 'facepalm' : 'cheer', { expr: k % 3 ? 'pained' : 'laugh' }], [1200, 'clap', { expr: 'smile' }], [1262, 'cheer', { expr: 'laugh' }]];
      fa.set(T.act(f, ak.map((a) => a[1] === 'laugh' ? [a[0], 'clap', a[2]] : a), { seed: 20 + k, blink: blink(20 + k) }), { x, z, yaw: 0.1 * Math.sin(k) }); show(fa, !ex && !morning); });
    // Waffles the bear goalie
    let bear = { x: GL[0] + 0.5, z: 0.0, yaw: Math.PI / 2, mode: 'stand', expr: 'neutral' };
    if (f < 192) bear = { ...bear, mode: f < 40 ? 'sit' : 'stand', expr: 'shock' };
    else if (morning) bear = { visible: false };
    else if (f >= 505 && f < 605) bear = { x: GL[0] + 0.5 + 0.03 * Math.sin(f * 2.2), z: 0, yaw: Math.PI / 2, mode: f < F.CHILLY ? 'sit' : f < F.NAP + 4 ? 'sleep' : 'sit', expr: f < F.CHILLY ? 'sad' : f < F.NAP + 4 ? 'sleepy' : 'angry' };
    else if (f >= 701 && f < 895) bear = { x: GL[0] + 0.5, z: 0, yaw: Math.PI / 2, mode: 'sleep', expr: f >= F.WRONG ? 'shock' : 'sleepy' };
    else if (ex) bear = { visible: false };
    else if (f >= 1104 && f < F.MOVED) bear = { x: FRZ[0] + 2.2, z: FRZ[1] + 1.2, yaw: -1.2, mode: 'walk', expr: 'happy', speed: 0.8 };
    else if (f >= F.MOVED) { const u = sm(F.MOVED, F.FREEZER2 + 4, f); bear = { x: lerp(FRZ[0] + 1.6, FRZ[0], u), y: 0.6 * Math.sin(Math.PI * u) + 0.78 * u, z: FRZ[1] + lerp(0.9, 0, u), yaw: -1.4, mode: u < 1 ? 'jump' : 'sleep', expr: u < 1 ? 'happy' : 'sleepy' }; }
    BEAR.set(f, bear);
    // ---------- explainer ----------
    HX.g.visible = ex; HX.ball.visible = ex && f < 1001; HX.cold.visible = ex && f >= F.SLIDES - 10;
    const frz = sm(F.FREEZE, F.STIFF + 6, f), bounce = ex ? (1 - frz) : 0;
    const by = f < 1001 ? Math.abs(Math.sin((f - 895) * 0.13)) : 0;
    HX.g.position.y = 0.8 + 2.4 * by * bounce + 0.06; HX.g.scale.set(1.5 * (1 + 0.12 * (1 - by) * bounce), 1.5 * (1 - 0.18 * (1 - by) * bounce), 1.5 * (1 + 0.12 * (1 - by) * bounce));
    HX.ball.position.set(EX[0] + 3.0, 0.6 + 4.0 * Math.abs(Math.sin((f - 895) * 0.11 + 0.8)), EX[2] + 0.6);
    const sq = 0.55 + 0.35 * by * bounce + 0.1 * Math.sin(f * 0.6) * bounce;
    HX.nodes.forEach(({ n, c, r }) => n.position.set(-1.05 + c * 0.7, r === 0 ? -0.35 : -0.35 + sq, 0));
    HX.springs.forEach((s, c) => { s.position.set(-1.05 + c * 0.7, -0.35, 0); s.scale.set(1, sq, 1); s.visible = frz < 0.5; });
    HX.bars.forEach((b, c) => { b.position.set(-1.05 + c * 0.7, -0.35 + sq / 2, 0); b.scale.set(1, sq, 1); b.visible = frz >= 0.5; });
    HX.frost.visible = ex && frz > 0.02; HX.frost.material.opacity = 0.5 * frz;
    HX.g.visible = ex && f < F.SLIDES - 6;
    { const u = sm(F.SLIDES - 6, F.FLAT + 14, f); HX.cold.position.set(EX[0] - 6 + 12 * u, 0.22, EX[2] + 1.0); HX.cold.rotation.set(0, u * 3, 0); }
    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const body = (x, z, y = 0, h = 2.3) => [[x, y, z], [x, y + h, z]];
    if (sh(0, 40)) {                          // 1. hook: the puck flies higher than the scoreboard (wide from the ice, players + bear look up)
      cam = K.fit([[pp[0], pp[1], pp[2]], [BOARD[0], 8.8, BOARD[1]], ...body(-3.5, 2.2), [GL[0] + 0.5, 0, 0], [3.5, 0, -1.5]], { yaw: 100, pitch: 4, fov: 46, margin: 0.68, maxDist: 15 }); cam.fov *= K.push(u, 0.05);
    } else if (sh(40, 92)) {                  // 2. higher than the scoreboard, twice (tilted-up wide with the fans)
      cam = K.fit([[pp[0], pp[1], pp[2]], [BOARD[0], 8.8, BOARD[1]], [-3, 0, -7.4], [10, 0, -7.4]], { yaw: 78, pitch: -2, fov: 46, margin: 0.85, maxDist: 15 }); cam.fov *= K.punch(f, F.TWICE, 0.08, 6);
    } else if (sh(92, 140)) {                 // 3. the championship final (high wide: rink, scoreboard, puck arc)
      cam = K.fit([[-RX, 0, -RZ], [RX, 0, RZ], [BOARD[0], 8.8, BOARD[1]], [pp[0], pp[1], pp[2]]], { yaw: 108, pitch: 22, fov: 46, margin: 0.75, maxDist: 20 }); cam.fov *= K.punch(f, F.FINAL, 0.06, 6);
    } else if (sh(140, 192)) {                // 4. it lands in the nachos (full shot at the snack shack)
      cam = { pos: [NACHO[0] + 1.8, 3.6, NACHO[2] + 7.6], look: [NACHO[0] - 0.2, 1.9, NACHO[2]], fov: 50 * K.punch(f, F.NACHOS, 0.12, 6) }; const s = K.shake(f, F.NACHOS, 0.05, 12); cam.pos[1] += s[1];
    } else if (sh(192, 245)) {                // 5. that morning: one complaint (full shot at the shack window)
      cam = { pos: [SHACK[0] + 3.0, 3.6, -1.6], look: [SHACK[0] + 0.4, 1.4, SHACK[1] + 1.0], fov: 48 * K.push(u, 0.05) };
    } else if (sh(245, 291)) {                // 6. "too cold to touch!" (Pia reaction)
      cam = { pos: [pp2.x + 1.4, 2.2, pp2.z + 2.4], look: [pp2.x, 1.4, pp2.z], fov: 42 * K.push(u, 0.05) }; dof = { focus: 2.7, cinf: 11 };
    } else if (sh(291, 345)) {                // 7. "Nice and toasty!" Bernie at the pizza oven (full shot)
      cam = { pos: [OVEN[0] + 3.4, 3.4, OVEN[1] + 6.2], look: [OVEN[0] + 0.7, 1.3, OVEN[1] + 1.2], fov: 48 * K.punch(f, F.NICE, 0.06, 6) };
    } else if (sh(345, 396)) {                // 8. every puck into the oven (insert-wide, fire glow)
      cam = { pos: [OVEN[0] - 1.6, 2.0, OVEN[1] + 3.9], look: [OVEN[0], 1.1, OVEN[1] + 1.1], fov: 40 * K.push(u, 0.08) }; dof = { focus: 3.6, cinf: 10 };
    } else if (sh(396, 440)) {                // 9. first face-off (high wide on center ice)
      cam = K.fit([...body(-1.1, 0.2), ...body(1.1, 0.2), ...body(0.35, 1.4), [3.5, 0, -1.5], [-3, 0, -6.5], [6, 2, -7.4]], { yaw: 75, pitch: 20, fov: 42, margin: 0.85, maxDist: 12 }); cam.fov *= K.push(u, 0.05);
    } else if (sh(440, 470)) {                // 10. boing! (low wide on the ice)
      cam = K.fit([...body(-1.1, 0.2), ...body(1.1, 0.2), ...body(0.35, 1.4), [pp[0], pp[1] + 1, pp[2]]], { yaw: 112, pitch: 2, fov: 44, margin: 0.85, maxDist: 9 }); cam.fov *= K.punch(f, F.BOING, 0.1, 6);
    } else if (sh(470, 505)) {                // 11. off the ref's helmet (full shot: ref, puck)
      cam = K.fit([...body(rp.x, rp.z), [pp[0], pp[1], pp[2]], [rp.x + 1.6, 0, rp.z + 0.5]], { yaw: 60, pitch: 8, fov: 40, margin: 1.0, maxDist: 7 }); cam.fov *= K.punch(f, F.HELMET, 0.12, 6); const s = K.shake(f, F.HELMET, 0.05, 10); cam.pos[0] += s[0];
    } else if (sh(505, 555)) {                // 12. Waffles the bear goalie (full shot in the goal)
      cam = K.fit([[GL[0] - 1.0, 0, -1.1], [GL[0] + 1.6, 1.8, 1.1]], { yaw: 40, pitch: 10, fov: 40, margin: 0.9, maxDist: 7 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(555, 605)) {                // 13. too chilly to nap (closer, bear shivers, snow)
      cam = { pos: [GL[0] + 3.4, 1.4, 1.6], look: [GL[0] + 0.6, 0.6, 0], fov: 40 * K.push(u, 0.05) }; dof = { focus: 3.2, cinf: 10 };
    } else if (sh(605, 650)) {                // 14. "Nice and toasty!" Bernie cranks the heater (full shot)
      cam = { pos: [bp.x + 1.8, 3.3, bp.z + 5.6], look: [bp.x - 0.3, 1.6, bp.z], fov: 48 * K.punch(f, F.NICE2, 0.06, 6) };
    } else if (sh(650, 701)) {                // 15. every heater to max (wide: row of glowing heaters, fans)
      cam = K.fit([[-11, 0, -7.6], [13, 2.9, -7.6], [-15.4, 2.9, 3], ...body(bp.x, bp.z)], { yaw: 100, pitch: 12, fov: 46, margin: 0.75, maxDist: 16 }); cam.fov *= K.punch(f, F.MAX, 0.08, 6);
    } else if (sh(701, 760)) {                // 16. pinball (high wide of the whole rink)
      cam = K.fit([[-RX, 0, -RZ], [RX, 1.2, RZ]], { yaw: 95 + 10 * u, pitch: 40, fov: 46, margin: 0.75, maxDist: 20 }); cam.fov *= K.punch(f, F.PINBALL, 0.06, 6);
    } else if (sh(760, 817)) {                // 17. one goal, wrong net (wide on Waffles' goal, red lamp)
      cam = K.fit([[GL[0] - 2.2, 0, -1.5], [GL[0] + 5.5, 3.0, 1.5], ...body(pp2.x, pp2.z)], { yaw: 58, pitch: 10, fov: 42, margin: 0.85, maxDist: 11 }); cam.fov *= K.punch(f, F.WRONG, 0.12, 6);
    } else if (sh(817, 860)) {                // 18. why would a cold puck stay down? (Bernie, puzzled, by the boards)
      cam = { pos: [bp.x + 1.2, 3.0, bp.z + 4.6], look: [bp.x, 1.4, bp.z], fov: 44 * K.push(u, 0.06) };
    } else if (sh(860, 901)) {                // 19. ... while a warm one flies (wide pull-back over the rink)
      cam = K.fit([[-RX, 0, -RZ], [RX, 1.2, RZ], [BOARD[0], 8.8, BOARD[1]]], { yaw: 120 - 8 * u, pitch: 16, fov: 46, margin: 0.75, maxDist: 20 }); cam.fov *= K.punch(f, F.FLIES, 0.06, 6);
    } else if (sh(901, 950)) {                // 20. explainer: a puck is rubber (x-ray puck + bouncy ball)
      cam = K.fit([[EX[0] - 3.2, 0, EX[2] - 1.8], [EX[0] + 4, 5.2, EX[2] + 1.8]], { yaw: 90 + 10 * u, pitch: 10, fov: 42, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.RUBBER, 0.06, 6);
    } else if (sh(950, 1001)) {               // 21. springy, like a bouncy ball (closer on the springs)
      cam = K.fit([[EX[0] - 3.2, 0, EX[2] - 1.8], [EX[0] + 0.8, 3.6, EX[2] + 1.8]], { yaw: 70 - 8 * u, pitch: 14, fov: 40, margin: 0.85, maxDist: 9 }); cam.fov *= K.punch(f, F.BOUNCY, 0.08, 6);
    } else if (sh(1001, 1055)) {              // 22. freeze it: frost, the springs go stiff (wide)
      cam = K.fit([[EX[0] - 3.2, 0, EX[2] - 1.8], [EX[0] + 0.8, 2.6, EX[2] + 1.8]], { yaw: 110 - 10 * u, pitch: 20, fov: 40, margin: 0.85, maxDist: 9 }); cam.fov *= K.punch(f, F.STIFF, 0.1, 6);
    } else if (sh(1055, 1108)) {              // 23. it slides flat instead of jumping (tracking low)
      const tc = K.track(f, (g) => [EX[0] - 6 + 12 * sm(F.SLIDES - 6, F.FLAT + 14, g), 0.2, EX[2] + 1.0], { off: [-1.5, 1.6, 6.5], lag: 4, lookY: 0.5 }); cam = { ...tc, fov: 46 };
    } else if (sh(1108, 1160)) {              // 24. real rinks keep their pucks in a freezer (full shot)
      cam = { pos: [FRZ[0] + 1.6, 3.6, FRZ[1] + 5.8], look: [FRZ[0] - 0.4, 1.0, FRZ[1] + 0.5], fov: 46 * K.push(u, 0.05) };
    } else if (sh(1160, 1200)) {              // 25. insert-wide: the freezer, cold mist, pucks inside
      cam = { pos: [FRZ[0] + 0.8, 2.5, FRZ[1] + 2.5], look: [FRZ[0], 0.7, FRZ[1]], fov: 42 * K.push(u, 0.06) }; dof = { focus: 3.1, cinf: 10 };
    } else if (sh(1200, 1262)) {              // 26. the frozen puck slides flat: goal, right net (low tracking wide)
      cam = K.fit([[pp[0], 0, pp[2]], ...body(pp2.x, pp2.z), [GR[0], 1.2, GR[1]], [GR[0] - 2, 0, 1.5]], { yaw: 105, pitch: 8, fov: 44, margin: 0.85, maxDist: 15 }); cam.fov *= K.push(u, 0.05);
    } else {                                  // 27. Waffles asleep in the freezer, nice and toasty (wide, scoreboard behind)
      cam = { pos: [FRZ[0] + lerp(2.6, 3.4, u), 3.8, FRZ[1] + 6.8], look: [FRZ[0] - 0.4, 1.0, FRZ[1]], fov: 46 * K.punch(f, F.NICE3, 0.08, 6) };
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    for (const ft of [66, F.NACHOS, F.HIT, F.BOING]) if (f >= ft && f < ft + 10) K.puff(f, ft, ft === F.NACHOS ? NACHO[0] : pp[0], ft === F.NACHOS ? NACHO[2] : pp[2], 6, 0.35, '#ffffff');
    if (f >= F.SLAP && f < F.WRONG + 4 && f % 6 === 0) K.puff(f, f, pp[0], pp[2], 4, 0.3, '#ffffff');
    if (f >= F.NACHOS && f < F.NACHOS + 12) K.sparks(f, F.NACHOS, F.NACHOS + 10, [NACHO[0], NACHO[1] + 0.1, NACHO[2]], { dir: [0, 1, 0.4], spread: 1.4, rate: 30, speed: 3, life: 12, color: '#f2b830', seed: 4 });
    if (f >= F.HELMET && f < F.HELMET + 12) K.sparks(f, F.HELMET, F.HELMET + 8, [rp.x, 2.2, rp.z], { dir: [0, 1, 0], spread: 2, rate: 30, speed: 2.5, life: 10, color: '#fff2a0', seed: 6 });
    if (f < 192 || (f >= F.BOING && f < 505) || (f >= F.SLAP && f < F.WRONG + 4)) K.sparks(f, 0, 2000, () => [pp[0], pp[1], pp[2]], { dir: [0, 0, 0], spread: 0.3, rate: 30, speed: 0.3, life: 8, color: '#bfe8ff', seed: 9 });
    if (!ex) K.steam(f, [OVEN[0] - 0.3, 3.2, OVEN[1] - 0.4], { rate: 3, size: 0.4, rise: 1.0, drift: [0.2, 0], dark: 0.55 });
    if (!ex && f >= F.CRANKED) for (const [hx, hz] of [[-11, -7.6], [-1, -7.6], [7, -7.6], [13, -7.6]]) K.steam(f, [hx, 2.7, hz], { rate: 2, size: 0.3, rise: 1.4, drift: [0, 0], dark: 0 });
    if (morning && f >= F.OVEN) K.steam(f, [OVEN[0], 1.5, OVEN[1] + 1.2], { rate: 4, size: 0.25, rise: 1.0, drift: [0, 0.2], dark: 0.2 });
    if (!ex && f >= 1108) K.steam(f, [FRZ[0], 1.0, FRZ[1]], { rate: 5, size: 0.3, rise: 0.4, drift: [0, 0.3], dark: 0 });
    if (ex && f >= F.FREEZE) K.steam(f, [EX[0] - 1.2, 1.2, EX[2]], { rate: 4, size: 0.3, rise: 0.6, drift: [0, 0], dark: 0 });
    K.leaves(f, cam.look, { area: 14, count: 40, fall: 0.35, colors: ['#ffffff', '#f4f8ff', '#e8f0ff'] });
    K.mist(f, 186, 14); K.mist(f, 390, 14); K.mist(f, 889, 16); K.mist(f, 1098, 16);
    K.badge(f, F.SCORE, 'HIGHER THAN THE SCOREBOARD', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: 90 });
    K.badge(f, F.FINAL, 'CHAMPIONSHIP FINAL', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: F.NACHOS - 4 });
    K.badge(f, F.NACHOS, 'IN THE NACHOS', { sx: 0.5, sy: 0.2 }, { style: 'stamp', f1: 188 });
    K.badge(f, F.COMPLAINT, 'COMPLAINT #1: TOO COLD', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 288 });
    K.badge(f, F.BAKED, 'PUCKS: BAKED', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 392 });
    K.badge(f, F.BOING, 'BOING!', { sx: 0.5, sy: 0.2 }, { style: 'stamp', f1: F.HELMET - 2 });
    K.badge(f, F.COMPL2, 'COMPLAINT #2: TOO CHILLY', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 600 });
    K.badge(f, F.MAX, 'HEATERS: MAX', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: 698 });
    if (f >= F.SLAP && f < 812) K.badge(f, F.SLAP, 'BOUNCES: ' + Math.min(41, Math.round(41 * sm(F.SLAP, F.FORTY + 6, f))), { sx: 0.5, sy: 0.14 }, { icon: 'warn', f1: 812 });
    K.badge(f, F.WRONG, 'GOAL... WRONG NET', { sx: 0.5, sy: 0.24 }, { icon: 'x', f1: 812 });
    K.badge(f, F.SPRINGY, 'WARM RUBBER = SPRINGY', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: 996 });
    K.badge(f, F.STIFF, 'FROZEN = STIFF', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: F.SLIDES - 2 });
    K.badge(f, F.FLAT, 'SLIDES FLAT', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1100 });
    K.badge(f, F.FREEZER, 'PUCKS: FROZEN', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1198 });
    K.badge(f, F.NICE3, 'NICE AND TOASTY', { sx: 0.5, sy: 0.2 }, { style: 'stamp', f1: 1350 });
    const L = ex ? K.light('night', { az: 120, el: 40, exposure: 1.3 }) : K.light('golden', { az: 120, el: 30, shadowExt: 28, exposure: 1.2 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
