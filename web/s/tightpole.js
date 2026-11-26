// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Tightrope Walkers Carry Long Poles" — invented story, engine: The Complaint Desk (SCRIPTS.md §000).
// Ringmaster Barty ("The customer is always right!") answers complaints at his circus desk: the pole knocked off a hat -> he saws
// Lola's balance pole in half; it blocks someone's popcorn -> he hands her a toothpick. Lola wobbles like a noodle and spins round
// the wire like a rotisserie chicken (safety net below); complaint three: a fan got seasick. Peanut the elephant practises on a
// garden hose. Explainer: a long pole is hard to turn (Barty on an office chair holding a ladder), so Lola tips slowly with time to
// fix it; a toothpick tips you like a dropped pencil. The pole comes back, Lola strolls across eating popcorn, Peanut gets a pole
// (still on the hose), Barty's new sign: "The customer is always right. Except about poles."
import { TOTAL, LINES, wf } from './tightpole_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const WY = 7.0, WX = 7.0;                 // high wire height, half length (along x at z = 0)
const DESK = [7.0, 6.5];                  // complaint desk (Barty behind it at z-0.8 facing +z)
const PW = [-7.5, 8.0], PWY = 1.3;        // practice wire (explainer), along x
const HOSE = 4.2;                         // garden hose on the ring floor at z = HOSE
let THREE, F = {}, BARTY, LOLA, HAT, POP, SICK, PEANUT, POLE, PICK, PNUT_POLE, SAW1, SAW2, CHAIR, LADDER, SIGN, SIGN2, HOLO = [], ARC1, ARC2, POPC, HATM, PCART;

function stripeTex(n, a, b) { const c = document.createElement('canvas'); c.width = 1024; c.height = 16; const g = c.getContext('2d'); for (let k = 0; k < n; k++) { g.fillStyle = k % 2 ? a : b; g.fillRect(k * 1024 / n, 0, 1024 / n + 1, 16); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
function balancePole(K, len) { const g = new THREE.Group(); const p = K.cyl(0.055, 0.055, len, K.mat('wood', '#c89a5a', { detail: 0.3 }), 0, -len / 2, 0, g, 10); p.rotation.z = Math.PI / 2;
  for (const s of [-1, 1]) { K.sphere(0.09, K.gold(), s * len / 2, 0, 0, g); const r = K.cyl(0.05, 0.05, 0.12, K.paint('#d0302a'), s * (len / 2 - 0.25), -0.06, 0, g, 10); r.rotation.z = Math.PI / 2; }
  const m = K.cyl(0.045, 0.045, 0.5, K.paint('#1f2a44'), 0, -0.25, 0, g, 10); m.rotation.z = Math.PI / 2; g.traverse((o) => { if (o.isMesh) o.castShadow = true; }); return g; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { CROSSED: wf(0, 'crossed'), PICK0: wf(0, 'toothpick'), WOBB: wf(0, 'wobbling'), NOODLE: wf(0, 'noodle'), BARTY: wf(1, 'barty'), SHRUNK: wf(1, 'shrunk'), CUST: wf(1, 'customer'), WHY: wf(1, 'why'), LONG: wf(1, 'long'),
      C1: wf(2, 'complaint'), KNOCK: wf(2, 'knocked'), SAWED: wf(2, 'sawed'), HALF: wf(2, 'half'), PEANUT: wf(3, 'peanut'), GASP: wf(3, 'gasped'), HOSE: wf(3, 'hose'),
      C2: wf(4, 'complaint'), BLOCKS: wf(4, 'blocks'), POPCORN: wf(4, 'popcorn'), HANDED: wf(4, 'handed'), PICK: wf(4, 'toothpick'), CUST2: wf(4, 'customer'),
      SWAYED: wf(5, 'swayed'), LEFT: wf(5, 'left'), RIGHT: wf(5, 'right'), SPUN: wf(5, 'spun'), ROTI: wf(5, 'rotisserie'), C3: wf(6, 'complaint'), SEASICK: wf(6, 'seasick'),
      WHAT: wf(7, 'what'), TURN: wf(8, 'turn'), SPIN: wf(8, 'spinning'), CHAIRW: wf(8, 'office'), LADDERW: wf(8, 'ladder'), TIPS: wf(9, 'tips'), SLOWLY: wf(9, 'slowly'), FIX: wf(9, 'fix'),
      PICK2: wf(10, 'toothpick'), OVER: wf(10, 'over'), DROPPED: wf(10, 'dropped'), PENCIL: wf(10, 'pencil'), BROUGHT: wf(11, 'brought'), BACK: wf(11, 'back'), STROLL: wf(11, 'strolled'), POP2: wf(11, 'popcorn'),
      PNUT2: wf(12, 'peanut'), POLE3: wf(12, 'pole'), HOSE2: wf(12, 'hose'), SIGNW: wf(13, 'sign'), EXCEPT: wf(13, 'except'), POLES: wf(13, 'poles') };
    // ================= Barty's Big Top =================
    const G = K.group();
    K.slab(-20, 20, -0.1, 0, -20, 20, K.mat('dirt', '#c8a070', { detail: 0.9, amt: 0.3 }), G, false);              // sawdust floor
    K.slab(-30, 30, -0.1, 0, -30, 30, K.mat('dirt', '#b89060', { detail: 0.9, amt: 0.3 }), G, false); const ringF = new THREE.Mesh(new THREE.CircleGeometry(6.6, 64), K.mat('dirt', '#d8b080', { detail: 0.5 })); ringF.rotation.x = -Math.PI / 2; ringF.position.y = 0.012; ringF.receiveShadow = true; G.add(ringF);
    const curb = new THREE.Mesh(new THREE.TorusGeometry(6.7, 0.22, 10, 80), K.paint('#c0262a', { rough: 0.3 })); curb.rotation.x = Math.PI / 2; curb.position.y = 0.2; curb.castShadow = true; G.add(curb);
    const curb2 = new THREE.Mesh(new THREE.TorusGeometry(6.7, 0.06, 8, 80), K.gold()); curb2.rotation.x = Math.PI / 2; curb2.position.y = 0.42; G.add(curb2);
    for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2; K.sphere(0.09, K.gold(), 6.7 * Math.cos(a), 0.44, 6.7 * Math.sin(a), G); }
    // tent wall + roof with red/white stripes
    const wallM = new THREE.MeshStandardMaterial({ map: stripeTex(48, '#c0262a', '#f4efe4'), roughness: 0.85, side: THREE.DoubleSide });
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(25, 25, 6.5, 64, 1, true), wallM); wall.position.y = 3.25; wall.receiveShadow = true; G.add(wall);
    const roofM = new THREE.MeshStandardMaterial({ map: stripeTex(32, '#c0262a', '#f4efe4'), roughness: 0.85, side: THREE.DoubleSide });
    const roof = new THREE.Mesh(new THREE.ConeGeometry(25, 11, 64, 1, true), roofM); roof.position.y = 6.5 + 5.5; G.add(roof);
    for (const x of [-2.5, 2.5]) { K.cyl(0.22, 0.26, 16, K.paint('#2a62c8', { rough: 0.3 }), x, 8, -2.0, G, 16); for (let k = 0; k < 6; k++) K.cyl(0.29, 0.29, 0.12, K.gold(), x, 1.5 + k * 2.4, -2.0, G, 16); }
    // bunting strings
    for (let s = 0; s < 6; s++) { const a = s / 6 * Math.PI * 2 + 0.3; for (let k = 0; k < 14; k++) { const t = k / 14; const x = 24.5 * Math.cos(a) * (1 - t), z = 24.5 * Math.sin(a) * (1 - t), y = 6.3 + t * 9 - 1.2 * Math.sin(Math.PI * t);
      const fl = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.45, 3), K.paint(['#f2c230', '#2a62c8', '#2a9a6a', '#c0262a'][k % 4], { coat: 0 })); fl.rotation.x = Math.PI; fl.position.set(x, y - 0.25, z); G.add(fl); } }
    // bleachers: the back half of the tent, rows of fans
    const fanC = ['#d0302a', '#2a62c8', '#f2c230', '#2a9a6a', '#f2701e', '#9a5ad8', '#f4f2ee', '#e84a8f'], skin = ['#f1c9a5', '#d9a77e', '#a8754f', '#7a4e32', '#f6d8bf'];
    for (let r = 0; r < 7; r++) { const rad = 9.2 + r * 0.9, h = 0.45 * (r + 1);
      for (let k = 0; k < 44; k++) { const a = Math.PI * (1.08 + k / 44 * 0.84), a1 = Math.PI * (1.08 + (k + 1) / 44 * 0.84);
        const st = K.rbox(rad * (a1 - a) + 0.02, h, 0.9, 0.02, K.mat('wood', r % 2 ? '#8a5a34' : '#9a6a40', { detail: 0.5 }), rad * Math.cos((a + a1) / 2), h / 2, rad * Math.sin((a + a1) / 2), G); st.rotation.y = -(a + a1) / 2 + Math.PI / 2;
        if (hash(r * 41 + k) < 0.2) continue; const x = rad * Math.cos((a + a1) / 2), z = rad * Math.sin((a + a1) / 2);
        K.cyl(0.2, 0.24, 0.5, K.paint(fanC[Math.floor(hash(r * 7 + k * 3) * 8)], { coat: 0, rough: 0.6 }), x, h + 0.25, z, G, 10); K.sphere(0.17, K.paint(skin[Math.floor(hash(r + k * 11) * 5)], { coat: 0 }), x, h + 0.66, z, G);
        if (hash(r * 3 + k * 5) > 0.82) { K.cyl(0.13, 0.1, 0.22, K.paint('#f4efe4'), x + 0.25, h + 0.62, z + 0.1, G, 10); K.sphere(0.12, K.paint('#f8e8a0', { coat: 0 }), x + 0.25, h + 0.76, z + 0.1, G); } } }
    // the high wire: platforms, ladders, wire, safety net
    for (const s of [-1, 1]) { const x = s * (WX + 0.7); for (const dz of [-0.5, 0.5]) for (const dx of [-0.5, 0.5]) K.cyl(0.06, 0.06, WY, K.chrome(), x + dx, WY / 2, dz, G, 8);
      K.rbox(1.4, 0.15, 1.4, 0.04, K.paint('#2a62c8', { rough: 0.3 }), x, WY - 0.08, 0, G); K.rbox(1.45, 0.05, 1.45, 0.02, K.gold(), x, WY - 0.16, 0, G);
      for (let k = 0; k < 4; k++) K.cyl(0.03, 0.03, 0.9, K.gold(), x + (k < 2 ? -0.68 : 0.68), WY + 0.45, k % 2 ? -0.68 : 0.68, G, 6);
      for (let k = 0; k < 16; k++) K.rbox(0.5, 0.04, 0.04, 0, K.chrome(), x - s * 0.9, 0.4 + k * 0.42, 0.75, G); for (const dx of [-0.25, 0.25]) K.cyl(0.025, 0.025, WY, K.chrome(), x - s * 0.9 + dx, WY / 2, 0.75, G, 6); }
    const wire = K.cyl(0.02, 0.02, WX * 2 + 1.4, K.chrome({ rough: 0.15 }), 0, WY - (WX + 0.7), 0, G, 8); wire.rotation.z = Math.PI / 2;
    for (const s of [-1, 1]) { const g = K.cyl(0.015, 0.015, 3.0, K.chrome(), s * (WX + 1.9), WY - 1.2 - 1.5, 0, G, 6); g.rotation.z = s * 0.9; }
    const netM = K.paint('#f4efe4', { coat: 0, rough: 0.7 }); for (let k = 0; k <= 30; k++) { const b = K.rbox(WX * 2, 0.03, 0.03, 0, netM, 0, 1.5 - 0.15 * Math.sin(Math.PI * k / 30), -1.5 + k * 0.1, G); }
    for (let k = 0; k <= 28; k++) K.rbox(0.03, 0.03, 3.0, 0, netM, -WX + k * 0.5, 1.45, 0, G);
    for (const s of [-1, 1]) for (const dz of [-1.5, 1.5]) K.cyl(0.05, 0.05, 1.5, K.chrome(), s * WX, 0.75, dz, G, 8);
    // Peanut's garden hose on the ring floor
    const hosePts = []; for (let k = 0; k <= 40; k++) hosePts.push(new THREE.Vector3(-4.5 + k * 0.225, 0.06, HOSE + 0.12 * Math.sin(k * 0.6)));
    const hose = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hosePts), 80, 0.06, 8), K.paint('#2a9a3a', { rough: 0.4 })); hose.castShadow = true; G.add(hose);
    const reel = K.cyl(0.35, 0.35, 0.3, K.paint('#f2c230'), -5.2, 0.35 - 0.15, HOSE, G, 20); reel.rotation.x = Math.PI / 2;
    const ps = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.7), S.textMat("PEANUT'S|PRACTICE", { bg: '#f4efe4', fg: '#2a62c8', w: 400, h: 220 })); ps.position.set(5.2, 0.9, HOSE); ps.rotation.y = -0.4; G.add(ps); K.cyl(0.04, 0.04, 0.9, K.mat('wood', '#7a5a3a'), 5.2, 0.45, HOSE - 0.05, G, 8);
    // the complaint desk
    const DG = new THREE.Group(); DG.position.set(DESK[0], 0, DESK[1]); G.add(DG);
    K.rbox(2.6, 1.05, 0.9, 0.06, K.mat('wood', '#8a4a2a', { detail: 0.4 }), 0, 0.53, 0, DG); K.rbox(2.8, 0.08, 1.1, 0.03, K.paint('#1f2a44'), 0, 1.1, 0, DG);
    const dl = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.5), S.textMat('COMPLAINTS', { bg: '#f2c230', fg: '#c0262a', w: 700, h: 150, border: false })); dl.position.set(0, 0.7, 0.46); DG.add(dl);
    K.sphere(0.1, K.gold(), 0.9, 1.2, 0.2, DG, 1, 0.6, 1); K.cyl(0.02, 0.02, 0.06, K.gold(), 0.9, 1.26, 0.2, DG, 6);
    for (let k = 0; k < 4; k++) K.rbox(0.25, 0.02 + k * 0.03, 0.32, 0.01, K.paint('#f4efe4'), -0.8, 1.15 + k * 0.03, 0.1, DG);
    for (const dx of [-1.2, 1.2]) K.cyl(0.04, 0.04, 1.6, K.gold(), dx, 1.9, -0.35, DG, 8);
    SIGN = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.85), S.textMat('THE CUSTOMER|IS ALWAYS RIGHT!', { bg: '#c0262a', fg: '#ffffff', w: 800, h: 280 })); SIGN.position.set(DESK[0], 2.45, DESK[1] - 0.3);
    SIGN2 = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.85), S.textMat('THE CUSTOMER IS ALWAYS RIGHT.|EXCEPT ABOUT POLES.', { bg: '#2a62c8', fg: '#ffffff', w: 900, h: 300 })); SIGN2.position.set(DESK[0], 2.45, DESK[1] - 0.29);
    // rope queue posts, popcorn cart, posters, entrance
    for (let k = 0; k < 4; k++) { K.cyl(0.05, 0.05, 1.0, K.gold(), DESK[0] - 1.5 + k * 1.0, 0.5, DESK[1] + 2.3, G, 8); K.sphere(0.08, K.gold(), DESK[0] - 1.5 + k * 1.0, 1.02, DESK[1] + 2.3, G); }
    for (let k = 0; k < 3; k++) { const r = K.cyl(0.025, 0.025, 1.0, K.paint('#c0262a'), DESK[0] - 1.0 + k * 1.0, 0.85 - 0.5, DESK[1] + 2.3, G, 6); r.rotation.z = Math.PI / 2; }
    PCART = new THREE.Group(); PCART.position.set(DESK[0] + 3.2, 0, DESK[1] - 1.2); G.add(PCART); K.rbox(1.0, 0.9, 0.7, 0.05, K.paint('#c0262a'), 0, 0.75, 0, PCART); K.rbox(0.95, 0.7, 0.65, 0.04, K.glass({ color: '#fff8e0', opacity: 0.35 }), 0, 1.55, 0, PCART);
    for (let k = 0; k < 18; k++) K.sphere(0.07, K.paint('#f8e8a0', { coat: 0 }), (hash(k) - 0.5) * 0.7, 1.3 + hash(k + 4) * 0.3, (hash(k + 9) - 0.5) * 0.4, PCART);
    for (const dx of [-0.4, 0.4]) { const w = K.cyl(0.2, 0.2, 0.06, K.paint('#1a1a1a'), dx, 0.2 - 0.03, 0.37, PCART, 16); w.rotation.x = Math.PI / 2; } const pt = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.3), S.textMat('POPCORN', { bg: '#f2c230', fg: '#c0262a', w: 300, h: 100, border: false })); pt.position.set(0, 2.05, 0.33); PCART.add(pt);
    for (const [t, x, z, ry] of [['LOLA|THE GREAT', -13, 4, 1.6], ["BARTY'S|BIG TOP", 12, 1.5, -1.6], ['NO POLES|NO PROBLEMS?', 11, 11, -2.2]]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.8), S.textMat(t, { bg: '#1f2a44', fg: '#f2c230', w: 400, h: 520 })); p.position.set(x, 2.6, z); p.rotation.y = ry; G.add(p); }
    // explainer corner: the practice wire on a blue mat
    K.rbox(7, 0.25, 2.6, 0.08, K.paint('#2a62c8', { rough: 0.6 }), PW[0], 0.13, PW[1], G);
    for (const s of [-1, 1]) { K.cyl(0.06, 0.08, PWY + 0.4, K.chrome(), PW[0] + s * 3.0, (PWY + 0.4) / 2, PW[1], G, 8); K.rbox(0.5, 0.06, 0.5, 0.02, K.paint('#c0262a'), PW[0] + s * 3.0, PWY + 0.1, PW[1], G); }
    const pw = K.cyl(0.018, 0.018, 6, K.chrome(), PW[0], PWY - 3, PW[1], G, 8); pw.rotation.z = Math.PI / 2;
    const ss = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.5), S.textMat('PRACTICE WIRE', { bg: '#f4efe4', fg: '#1f2a44', w: 500, h: 150 })); ss.position.set(PW[0] + 3.2, 0.7, PW[1] + 1.35); G.add(ss);
    S.bake(G); sc.add(SIGN); sc.add(SIGN2);
    K.lamp(0, 11, 4, { color: '#fff0d0', intensity: 6, distance: 22 }); K.lamp(DESK[0], 4, DESK[1] + 2, { color: '#ffe0b0', intensity: 4, distance: 10 }); K.lamp(PW[0], 4, PW[1] + 2, { color: '#ffe0b0', intensity: 4, distance: 10 });
    K.shaft([0, 13, 3], [0, WY + 0.3, 0], 0.3, 1.6, '#fff2c0', 0.12); K.shaft([0, 13, 3], [0, 0.1, HOSE], 0.3, 2.2, '#fff2c0', 0.08);
    K.dust([0, 5, 2], [14, 8, 10], 160);
    // ================= props that move =================
    POLE = balancePole(K, 5.0); sc.add(POLE); PICK = new THREE.Group(); sc.add(PICK); K.cyl(0.012, 0.012, 0.16, K.mat('wood', '#e8c890'), 0, -0.08, 0, PICK, 6); PICK.rotation.z = Math.PI / 2;
    PNUT_POLE = balancePole(K, 3.0); sc.add(PNUT_POLE);
    SAW1 = balancePole(K, 2.5); SAW2 = balancePole(K, 2.5); sc.add(SAW1); sc.add(SAW2);
    for (const dx of [-0.9, 0.9]) { const h = new THREE.Group(); h.position.set(DESK[0] - 2.8 + dx, 0, DESK[1] + 0.8); sc.add(h); K.rbox(0.1, 0.9, 0.7, 0.02, K.mat('wood', '#a8784a'), 0, 0.45, 0, h); K.rbox(0.3, 0.08, 0.9, 0.02, K.mat('wood', '#a8784a'), 0, 0.9, 0, h); }
    CHAIR = new THREE.Group(); CHAIR.position.set(PW[0] + 0.5, 0, PW[1] - 3.2); sc.add(CHAIR); { const cm = K.paint('#1a1a1e', { rough: 0.4 }); for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; const l = K.rbox(0.6, 0.05, 0.07, 0.02, cm, Math.cos(a) * 0.3, 0.08, Math.sin(a) * 0.3, CHAIR); l.rotation.y = -a; K.sphere(0.05, cm, Math.cos(a) * 0.58, 0.05, Math.sin(a) * 0.58, CHAIR); }
      K.cyl(0.04, 0.04, 0.4, K.chrome(), 0, 0.3, 0, CHAIR, 10); const seat = new THREE.Group(); seat.position.y = 0.5; CHAIR.add(seat); CHAIR.userData.seat = seat; K.rbox(0.6, 0.1, 0.6, 0.05, K.paint('#2a62c8'), 0, 0, 0, seat); K.rbox(0.6, 0.7, 0.1, 0.05, K.paint('#2a62c8'), 0, 0.4, -0.3, seat); }
    LADDER = new THREE.Group(); CHAIR.userData.seat.add(LADDER); LADDER.position.set(0, 0.9, 0.35); { const lm = K.paint('#d8d8d8', { metal: 0.6, rough: 0.3 }); for (const s of [-0.22, 0.22]) K.rbox(4.2, 0.06, 0.06, 0.01, lm, 0, 0, s, LADDER); for (let k = 0; k < 12; k++) K.rbox(0.04, 0.04, 0.44, 0.01, lm, -1.9 + k * 0.35, 0, 0, LADDER); }
    POPC = new THREE.Group(); sc.add(POPC); K.cyl(0.13, 0.1, 0.25, K.set.textMat('POP', { bg: '#c0262a', fg: '#ffffff', w: 128, h: 128, border: false }), 0, 0, 0, POPC, 12); for (let k = 0; k < 8; k++) K.sphere(0.055, K.paint('#f8e8a0', { coat: 0 }), (hash(k) - 0.5) * 0.15, 0.14 + hash(k + 2) * 0.05, (hash(k + 5) - 0.5) * 0.15, POPC);
    HATM = new THREE.Group(); sc.add(HATM); K.cyl(0.16, 0.18, 0.2, K.paint('#2a9a6a'), 0, 0.1, 0, HATM, 16); K.cyl(0.28, 0.28, 0.02, K.paint('#2a9a6a'), 0, 0.0, 0, HATM, 20); HATM.rotation.z = 0.5;
    // explainer graphics: glowing weights at the pole ends + tip arcs
    const hm = new THREE.MeshBasicMaterial({ color: new THREE.Color('#36e2ff').multiplyScalar(2.0), toneMapped: false, transparent: true, opacity: 0.85 });
    for (let k = 0; k < 2; k++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), hm); s.userData.ndSkip = true; sc.add(s); HOLO.push(s); }
    ARC1 = K.trace(Array.from({ length: 13 }, (_, k) => { const a = -0.5 + k / 12 * 0.5; return [PW[0], PWY + 1.9 * Math.cos(a), PW[1] + 1.9 * Math.sin(a)]; }), { color: '#7af8a0', r: 0.04 });
    ARC2 = K.trace(Array.from({ length: 13 }, (_, k) => { const a = k / 12 * 1.3; return [PW[0] + 1.2, PWY + 1.9 * Math.cos(a), PW[1] + 1.9 * Math.sin(a)]; }), { color: '#ff5a4a', r: 0.04 });
    // ================= characters =================
    BARTY = K.stick({ jacket: '#c0262a', pants: '#f4efe4', boots: '#1a1a1a', hat: 'tophat', hatColor: '#1a1a1a', moustache: '#3a2418', bowtie: '#f2c230', vest: '#f2c230', collar: '#f4efe4', gloves: '#f4efe4', build: 'stout' }, { key: 'barty' });
    LOLA = K.stick({ jacket: '#2a9adf', pants: '#2a9adf', boots: '#f4efe4', hairStyle: 'bun', hair: '#2a1a14', dress: '#f08ab8', scarf: '#f2c230', belt: '#f2c230' }, { key: 'lola' });
    HAT = K.stick({ jacket: '#5a3a24', pants: '#2a2a40', hairStyle: 'spiky', hair: '#c8502a', glasses: true, tie: '#2a9a6a', collar: '#f4efe4' }, { key: 'hatguy' });
    POP = K.stick({ jacket: '#9a5ad8', pants: '#2a2a40', hairStyle: 'curly', hair: '#f2c230', dress: '#9a5ad8', scarf: '#f4efe4', glasses: '#c0392b' }, { key: 'poplady' });
    SICK = K.stick({ jacket: '#f2701e', pants: '#3a3a40', hat: 'beanie', hatColor: '#2a62c8', moustache: '#2a1a14', scarf: '#2a62c8', vest: '#8a5a34' }, { key: 'sickguy' });
    PEANUT = K.animal('elephant', { color: '#9aa4b4', seed: 2, scale: 0.85 });
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s);
    const ex = f >= 824 && f < 1130;
    // ---------- Lola ----------
    let L = { x: 0, y: WY, z: 0, yaw: Math.PI / 2 }, tilt = 0, prop = 'pick', walk = false;
    const wob = (amp, sp) => amp * Math.sin(f * sp) + amp * 0.4 * Math.sin(f * sp * 2.3 + 1);
    if (f < 98) { L.x = -1 + f * 0.01; tilt = wob(0.45, 0.22); }
    else if (f < 215) { L = { x: DESK[0] - 1.6, y: 0, z: DESK[1] + 1.4, yaw: -0.6 }; prop = 'none'; }
    else if (f < 280) { L.x = -4 + (f - 215) * 0.03; tilt = wob(0.05, 0.1); prop = 'long'; walk = true; }
    else if (f < 392) { L = { x: DESK[0] - 3.6, y: 0, z: DESK[1] + 1.8, yaw: 0.9 }; prop = 'none'; }
    else if (f < 495) { L.x = -2 + (f - 392) * 0.015; tilt = wob(0.2, 0.17); prop = 'half'; }
    else if (f < 655) { L = { x: DESK[0] - 1.2, y: 0, z: DESK[1] + 1.3, yaw: -0.5 }; prop = f >= F.PICK - 2 ? 'pick' : 'half'; }
    else if (f < 824) { L.x = 0.5; prop = 'pick'; tilt = f < F.SPUN ? wob(0.6, 0.16) * sm(655, 690, f) : -Math.PI * 2 * sm(F.SPUN, F.ROTI + 20, f) + (f >= 762 ? wob(0.4, 0.2) : 0); }
    else if (ex) { L = { x: PW[0] - 0.6, y: PWY, z: PW[1], yaw: Math.PI / 2 }; prop = f >= F.PICK2 - 6 ? 'pick' : 'long';
      if (f < 983) tilt = 0; else if (f < F.PICK2 - 6) tilt = 0.45 * sm(F.TIPS, F.SLOWLY + 10, f) * (1 - sm(F.FIX - 4, F.FIX + 12, f)); else tilt = 1.45 * sm(F.OVER - 4, F.OVER + 6, f); }
    else if (f < 1186) { L = { x: -WX - 0.6, y: WY, z: 0, yaw: Math.PI / 2 }; prop = f >= F.BACK ? 'long' : 'none'; }
    else { L.x = -WX + (f - 1186) * 0.022; tilt = wob(0.04, 0.08); prop = 'long'; walk = true; }
    const lk = [[0, 'panic', { expr: 'scared', sweat: true }], [98, 'idle', { expr: 'nervous' }], [F.SHRUNK, 'shrug', { expr: 'sad' }], [215, 'idle', { expr: 'smile', R: [0.45, 0.1, null, true], L: [0.45, 0.1, null, true] }],
      [280, 'idle', { expr: 'confused' }], [F.HALF, 'shock', { expr: 'shock' }], [392, 'idle', { expr: 'nervous', sweat: true, R: [0.45, 0.1, null, true], L: [0.45, 0.1, null, true] }], [495, 'idle', { expr: 'neutral' }],
      [F.PICK, 'show', { expr: 'confused' }], [F.CUST2, 'facepalm', { expr: 'pained' }], [655, 'panic', { expr: 'scared', sweat: true }], [F.SPUN, 'shock', { expr: 'dazed' }], [824, 'idle', { expr: 'neutral', R: [0.45, 0.1, null, true], L: [0.45, 0.1, null, true] }],
      [983, 'idle', { expr: 'nervous', R: [0.45, 0.1, null, true], L: [0.45, 0.1, null, true] }], [F.FIX, 'idle', { expr: 'relief', R: [0.45, 0.1, null, true], L: [0.45, 0.1, null, true] }], [F.PICK2 - 6, 'panic', { expr: 'scared' }],
      [1130, 'cheer', { expr: 'excited' }], [1186, 'idle', { expr: 'smile', L: [0.45, 0.1, null, true], R: [0.3, 0.1, 'food', true] }], [F.POP2, 'eat', { expr: 'laugh' }]];
    const LA = T.act(f, lk, { seed: 4, blink: blink(4), phase: (f / 26) % 1 }); if (walk) LA.opts.mode = 'stroll';
    if (f >= 866 && f < 983) L = { ...L, visible: false };
    LOLA.set(LA, L); LOLA.root.rotation.set(tilt, L.yaw, 0, 'XYZ'); LOLA.root.updateMatrixWorld(true);
    // her pole / toothpick follow her hands (local to Lola)
    const handAt = (P, yaw, t, fz, hy) => new THREE.Vector3(P.x + Math.sin(yaw) * fz, (P.y || 0) + hy * Math.cos(t) - 0 * fz, P.z + Math.cos(yaw) * fz + hy * Math.sin(t) * 0).add(new THREE.Vector3(0, 0, 0));
    const handW = (dx, dy, dz) => { const v = new THREE.Vector3(0, dy, dz).applyEuler(new THREE.Euler(tilt, L.yaw, 0, 'XYZ')); return v.add(new THREE.Vector3(L.x, L.y || 0, L.z)); }; void handAt;
    POLE.visible = prop === 'long' || prop === 'half'; PICK.visible = prop === 'pick';
    if (POLE.visible) { const p = handW(0, 1.18, 0.38); POLE.position.copy(p); POLE.rotation.set(tilt, L.yaw, 0, 'XYZ'); POLE.scale.set(prop === 'half' ? 0.5 : 1, 1, 1); }
    if (PICK.visible) { const p = handW(0, 1.18, 0.42); PICK.position.copy(p); PICK.rotation.set(tilt, L.yaw, Math.PI / 2, 'XYZ'); }
    // the halves on the sawhorses (complaint one), the pole coming back (end)
    const sawing = f >= 283 && f < 392; SAW1.visible = SAW2.visible = sawing;
    if (sawing) { const sp = sm(F.HALF - 4, F.HALF + 8, f); SAW1.position.set(DESK[0] - 2.8 - 1.25 - sp * 0.3, 0.98 - sp * 0.1, DESK[1] + 0.8); SAW2.position.set(DESK[0] - 2.8 + 1.25 + sp * 0.3, 0.98 - sp * 0.1, DESK[1] + 0.8); SAW1.rotation.set(0, 0, sp * 0.12); SAW2.rotation.set(0, 0, -sp * 0.12); }
    // ---------- Barty ----------
    let B = { x: DESK[0], z: DESK[1] - 0.8, yaw: 0 };
    if (f >= 283 && f < 392 && f >= F.SAWED - 10) B = { x: DESK[0] - 2.8, z: DESK[1] + 0.1, yaw: 0 };
    if (f >= 1130 && f < 1186) { const W = K.walkPath(f, 1133, [[DESK[0] - 2, DESK[1] + 1], [-WX + 1.5, 2.0], [-WX - 0.6, 1.6]], 3.0); B = { x: W.x, z: W.z, yaw: W.moving ? W.yaw : -2.4 }; }
    if (ex && f < 983) B = { x: CHAIR.position.x, z: CHAIR.position.z, yaw: 0 };
    const bk = [[0, 'shock', { expr: 'shock' }], [98, 'hips', { expr: 'proud' }], [F.CUST - 6, 'pointUp', { expr: 'proud', talk: true }], [F.WHY, 'hips', { expr: 'smug' }], [280, 'write', { expr: 'stern' }], [F.SAWED - 6, 'hammer', { expr: 'grin', R: [0.3, 0.3, 'hammer'] }],
      [392, 'idle', { expr: 'neutral' }], [495, 'write', { expr: 'stern' }], [F.HANDED - 4, 'reach', { expr: 'proud' }], [F.CUST2 - 6, 'cheer', { expr: 'proud', talk: true }], [762, 'shock', { expr: 'shock' }], [F.SEASICK + 6, 'facepalm', { expr: 'pained' }],
      [824, 'sit', { expr: 'nervous' }], [F.SPIN, 'sit', { expr: 'pained', R: [0.45, 0.0, null, true], L: [0.45, 0.0, null, true] }], [940, 'sit', { expr: 'pained', R: [0.45, 0.0, null, true], L: [0.45, 0.0, null, true] }],
      [1130, 'carry', { expr: 'stern' }], [1186, 'cheer', { expr: 'laugh' }], [1245, 'clap', { expr: 'smile' }], [1318, 'pointUp', { expr: 'proud', talk: true }], [F.EXCEPT, 'shrug', { expr: 'smug', talk: true }]];
    const BA = T.act(f, bk, { seed: 9, blink: blink(9), phase: (f / 16) % 1 }); if (f >= 1133 && f < 1180) BA.opts.mode = 'run'; if (ex && f < 983) BA.opts.mode = 'sit';
    const chairSpin = ex && f < 983 ? (f < 960 ? 0.02 * Math.sin((f - 865) * 0.1) + 0.003 * (f - 865) : 0.3 + (f - 960) * 0.35) : 0;
    CHAIR.visible = ex; CHAIR.userData.seat.rotation.y = chairSpin; LADDER.visible = ex && f < 960 && f >= F.CHAIRW - 30;
    if (ex && f < 983) { B.yaw = chairSpin; BARTY.set(BA, { ...B, y: 0.48 }); } else BARTY.set(BA, { ...B, visible: !ex });
    if (f >= 1130 && f < 1186 && f < F.BACK + 4) { POLE.visible = true; POLE.position.set(B.x + Math.sin(B.yaw) * 0.4, 1.1, B.z + Math.cos(B.yaw) * 0.4); POLE.rotation.set(0, B.yaw, 0); POLE.scale.set(1, 1, 1); }
    // ---------- complainers ----------
    const inQ = (f >= 280 && f < 392) || (f >= 495 && f < 655) || (f >= 762 && f < 824);
    const hk = [[0, 'cheer', { expr: 'excited' }], [283, 'pointL', { expr: 'angry', talk: true, R: [0.3, 0.3, null] }], [F.HALF, 'cross', { expr: 'smug' }], [495, 'idle', { expr: 'smile' }], [1186, 'clap', { expr: 'laugh' }]];
    HAT.set(T.act(f, hk, { seed: 12, blink: blink(12) }), f >= 280 && f < 392 ? { x: DESK[0] - 0.3, z: DESK[1] + 1.4, yaw: Math.PI } : f >= 1130 ? { x: 2.5, z: 9.0, yaw: Math.PI } : { visible: false });
    HATM.visible = f >= 280 && f < 392; if (HATM.visible) { HATM.position.set(DESK[0] - 0.3 - 0.45, 1.25, DESK[1] + 1.4 - 0.3); }
    const pk = [[0, 'idle', { expr: 'neutral' }], [498, 'point', { expr: 'angry', talk: true, R: [0.3, 0.3, 'food'] }], [F.PICK, 'cross', { expr: 'smug' }], [1186, 'eat', { expr: 'laugh' }]];
    POP.set(T.act(f, pk, { seed: 14, blink: blink(14) }), f >= 495 && f < 655 ? { x: DESK[0] + 0.5, z: DESK[1] + 1.5, yaw: Math.PI + 0.3 } : f >= 1130 ? { x: 4.0, z: 9.4, yaw: Math.PI + 0.4 } : { visible: false });
    const sk = [[0, 'idle', { expr: 'neutral' }], [766, 'scared', { expr: 'pained', sweat: true }], [F.SEASICK, 'facepalm', { expr: 'dazed', sweat: true }], [1186, 'cheer', { expr: 'smile' }]];
    SICK.set(T.act(f, sk, { seed: 16, blink: blink(16), phase: (f / 30) % 1 }), f >= 762 && f < 824 ? { x: DESK[0] - 0.2, z: DESK[1] + 1.5, yaw: Math.PI } : f >= 1130 ? { x: 1.0, z: 9.6, yaw: Math.PI - 0.2 } : { visible: false });
    if (f >= 762 && f < 824) SICK.root.rotation.z = 0.12 * Math.sin(f * 0.15);
    POPC.visible = (f >= 495 && f < 655) || f >= 1186; if (POPC.visible) { const wp = f < 655 ? { x: DESK[0] + 0.5, y: 0, z: DESK[1] + 1.5, yaw: Math.PI + 0.3 } : { x: L.x, y: L.y, z: L.z, yaw: L.yaw }; POPC.position.set(wp.x + Math.sin(wp.yaw) * 0.38 + Math.cos(wp.yaw) * 0.3, wp.y + 1.15, wp.z + Math.cos(wp.yaw) * 0.38 - Math.sin(wp.yaw) * 0.3); }
    // ---------- Peanut (practising on the hose) ----------
    let pn = { x: 3.2, z: HOSE + 1.4, yaw: -0.6, mode: 'stand', expr: 'shock' };
    if (f >= 98 && f < 392) pn = { x: 3.6, z: HOSE + 1.2, yaw: -0.5, mode: 'stand', expr: 'neutral' };
    if (f >= 392 && f < 495) { const x = -3.5 + (f - 430) * 0.03; pn = f < 430 ? { x: 2.5, z: HOSE + 1.0, yaw: -0.4, mode: 'stand', expr: 'shock' } : { x, z: HOSE, yaw: Math.PI / 2, mode: 'walk', expr: 'happy', speed: 0.6 }; }
    if (f >= 495 && f < 824) pn = { x: 2.0, z: HOSE + 1.3, yaw: -0.3, mode: f >= F.SPUN ? 'jump' : 'stand', expr: f >= F.SPUN ? 'shock' : 'neutral' };
    if (f >= 1130 && f < 1245) pn = { x: 1.0, z: HOSE + 1.2, yaw: -0.4, mode: 'wag', expr: 'happy' };
    if (f >= 1245) { const x = -3.8 + (f - 1245) * 0.025; pn = { x, z: HOSE, yaw: Math.PI / 2, mode: 'walk', expr: 'happy', speed: 0.6 }; }
    if (ex) pn = { visible: false };
    PEANUT.set(f, pn); if (f >= 1245 && !ex) PEANUT.root.rotation.z = 0.08 * Math.sin(f * 0.12);
    PNUT_POLE.visible = f >= F.POLE3 - 4 && !ex; if (PNUT_POLE.visible) { PNUT_POLE.position.set(PEANUT.root.position.x + 0.9, 1.45, HOSE); PNUT_POLE.rotation.set(0, Math.PI / 2, 0.08 * Math.sin(f * 0.12)); }
    // ---------- desk sign + explainer graphics ----------
    SIGN.visible = f < F.SIGNW - 2; SIGN2.visible = !SIGN.visible;
    const showHolo = ex && f >= 983 && f < F.PICK2 - 6 && prop === 'long'; HOLO.forEach((h, k) => { h.visible = showHolo; if (showHolo) POLE.updateMatrixWorld(true); h.position.copy(POLE.localToWorld(new THREE.Vector3((k ? 1 : -1) * 2.5, 0, 0))); h.scale.setScalar(1 + 0.15 * Math.sin(f * 0.3)); });
    ARC1.show(ex && f >= F.TIPS - 6 && f < F.PICK2 - 6 ? sm(F.TIPS - 6, F.FIX, f) : 0); ARC2.show(ex && f >= F.OVER - 6 ? sm(F.OVER - 6, F.OVER + 8, f) : 0);
    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const body = (x, z, y = 0, h = 2.2) => [[x, y, z], [x, y + h, z]];
    const LP = body(LOLA.root.position.x, LOLA.root.position.z, LOLA.root.position.y), PP = body(PEANUT.root.position.x, PEANUT.root.position.z, 0, 2.4);
    const DK = [[DESK[0] - 1.6, 0, DESK[1] - 1.0], [DESK[0] + 1.6, 3.0, DESK[1] + 1.8]];
    if (sh(0, 50)) {                          // 1. hook: Lola on the high wire with a toothpick, wobbling like a noodle (wide, net + crowd)
      cam = K.fit([...LP, [LP[0][0] - 2.0, WY, 0], [LP[0][0] + 2.0, WY, 0], [LP[0][0], 3.2, 0]], { yaw: 80, pitch: 4, fov: 42, margin: 0.8, maxDist: 9 }); cam.fov *= K.punch(f, F.WOBB, 0.08, 6);
    } else if (sh(50, 98)) {                  // 2. Peanut watching from the hose, Lola above (low wide)
      cam = K.fit([...LP, ...PP, [-3, 0, HOSE]], { yaw: 105, pitch: -4, fov: 44, margin: 0.85, maxDist: 14 }); cam.fov *= K.punch(f, F.NOODLE, 0.1, 6);
    } else if (sh(98, 160)) {                 // 3. ringmaster Barty at the complaint desk (wide)
      cam = K.fit([...DK, ...body(L.x, L.z), ...body(DESK[0], DESK[1] - 0.8)], { yaw: 70, pitch: 10, fov: 40, margin: 0.95, maxDist: 9 }); cam.fov *= K.punch(f, F.SHRUNK, 0.08, 6);
    } else if (sh(160, 212)) {                // 4. "The customer is always right!" (Barty reaction close)
      cam = { pos: [DESK[0] + 0.9, 2.1, DESK[1] + 1.9], look: [DESK[0], 1.7, DESK[1] - 0.8], fov: 40 * K.push(u, 0.06) }; dof = { focus: 2.9, cinf: 12 };
    } else if (sh(212, 280)) {                // 5. why a long pole? Lola walks the wire calmly (wide from below, whole rig)
      cam = K.fit([...LP, [-WX, WY, 0], [WX * 0.3, WY, 0], [0, 1.4, 0]], { yaw: 80, pitch: 4, fov: 44, margin: 0.9, maxDist: 15 });
    } else if (sh(280, 336)) {                // 6. complaint one: "Her pole knocked off my hat" (wide desk)
      cam = K.fit([...DK, ...body(DESK[0] - 0.3, DESK[1] + 1.4), ...body(L.x, L.z)], { yaw: 40, pitch: 8, fov: 40, margin: 0.95, maxDist: 9 });
    } else if (sh(336, 392)) {                // 7. Barty saws it in half (wide)
      cam = K.fit([[DESK[0] - 4.4, 0, DESK[1] + 0.8], [DESK[0] - 1.2, 2.2, DESK[1] + 0.8], ...body(B.x, B.z), ...body(L.x, L.z)], { yaw: 80, pitch: 12, fov: 40, margin: 0.95, maxDist: 9 }); cam.fov *= K.punch(f, F.HALF, 0.12, 6);
    } else if (sh(392, 432)) {                // 8. Peanut gasps (reaction)
      cam = { pos: [PEANUT.root.position.x + 0.8, 1.6, PEANUT.root.position.z + 3.0], look: [PEANUT.root.position.x, 1.3, PEANUT.root.position.z], fov: 42 * K.push(u, 0.06) }; dof = { focus: 3.1, cinf: 12 };
    } else if (sh(432, 495)) {                // 9. Peanut walks the garden hose; Lola wobbles above with half a pole (wide)
      cam = K.fit([...PP, [-4.5, 0, HOSE], [4.5, 0, HOSE], ...LP], { yaw: 95, pitch: 6, fov: 44, margin: 0.88, maxDist: 15 }); cam.fov *= K.punch(f, F.HOSE, 0.08, 6);
    } else if (sh(495, 562)) {                // 10. complaint two: "Now it blocks my popcorn" (wide desk)
      cam = K.fit([...DK, ...body(DESK[0] + 0.5, DESK[1] + 1.5), ...body(L.x, L.z)], { yaw: 120, pitch: 8, fov: 40, margin: 0.95, maxDist: 9 }); cam.fov *= K.punch(f, F.POPCORN, 0.08, 6);
    } else if (sh(562, 612)) {                // 11. Barty hands her a toothpick (insert-wide on the two of them)
      cam = K.fit([...body(L.x, L.z), [DESK[0] - 0.4, 1.0, DESK[1] - 0.6], [DESK[0], 2.3, DESK[1] - 0.8]], { yaw: 125, pitch: 6, fov: 40, margin: 0.8, maxDist: 9 }); cam.fov *= K.punch(f, F.PICK, 0.12, 6);
    } else if (sh(612, 655)) {                // 12. "The customer is always right!" (wide, sign behind)
      cam = K.fit([...DK, ...body(L.x, L.z), [DESK[0], 2.9, DESK[1] - 0.3]], { yaw: 90, pitch: 4, fov: 40, margin: 0.9, maxDist: 9 }); cam.fov *= K.punch(f, F.CUST2, 0.08, 6);
    } else if (sh(655, 705)) {                // 13. Lola sways left, right (wide on the wire)
      cam = K.fit([...LP, [-2.5, WY, 0], [3.5, WY, 0], [0, 1.4, 1.5]], { yaw: 70, pitch: 2, fov: 42, margin: 0.85, maxDist: 14 });
    } else if (sh(705, 764)) {                // 14. then spins round the wire like a rotisserie chicken (low wide, crowd behind)
      cam = K.fit([[0.5, WY - 2.4, 0], [0.5, WY + 2.4, 0], [-2.5, WY, 0], [3.5, WY, 0]], { yaw: 100, pitch: -6, fov: 44, margin: 0.85, maxDist: 10 }); cam.fov *= K.punch(f, F.ROTI, 0.12, 6); const s = K.shake(f, F.SPUN, 0.05, 10); cam.pos[1] += s[1];
    } else if (sh(764, 824)) {                // 15. complaint three: seasick (wide desk; Lola spinning far behind)
      cam = K.fit([...DK, ...body(DESK[0] - 0.2, DESK[1] + 1.5)], { yaw: 50, pitch: 10, fov: 40, margin: 0.95, maxDist: 9 }); cam.fov *= K.punch(f, F.SEASICK, 0.1, 6);
    } else if (sh(824, 866)) {                // 16. what was the pole doing? The practice wire (wide)
      cam = K.fit([...body(L.x, L.z, PWY), [PW[0] - 3, 0, PW[1]], [PW[0] + 3, 0, PW[1]], [PW[0] - 0.6, PWY, PW[1] - 2.5], [PW[0] - 0.6, PWY, PW[1] + 2.5]], { yaw: 80, pitch: 10, fov: 42, margin: 0.9, maxDist: 9 });
    } else if (sh(866, 935)) {                // 17. Barty on an office chair holding a ladder: hard to turn (wide)
      cam = K.fit([[CHAIR.position.x - 2.2, 0, CHAIR.position.z - 2.2], [CHAIR.position.x + 2.2, 2.6, CHAIR.position.z + 2.2]], { yaw: 60, pitch: 18, fov: 40, margin: 0.85, maxDist: 9 }); cam.fov *= K.punch(f, F.LADDERW, 0.1, 6);
    } else if (sh(935, 983)) {                // 18. drop the ladder: he spins like a top (wide, other side)
      cam = K.fit([[CHAIR.position.x - 1.2, 0, CHAIR.position.z - 1.2], [CHAIR.position.x + 1.2, 2.4, CHAIR.position.z + 1.2]], { yaw: 110, pitch: 10, fov: 40, margin: 0.95, maxDist: 10 });
    } else if (sh(983, 1030)) {               // 19. with a long pole she tips slowly (wide, glowing weights + arc)
      cam = K.fit([[PW[0] - 3.2, 0, PW[1] - 1], [PW[0] + 3.2, PWY + 2.3, PW[1] + 1.5]], { yaw: 0, pitch: 8, fov: 40, margin: 0.85, maxDist: 9 }); cam.fov *= K.punch(f, F.SLOWLY, 0.08, 6);
    } else if (sh(1030, 1062)) {              // 20. ...with time to fix it (other angle)
      cam = K.fit([[PW[0] - 2.8, 0, PW[1] - 1], [PW[0] + 2.8, PWY + 2.3, PW[1] + 1.5]], { yaw: 40, pitch: 14, fov: 40, margin: 0.85, maxDist: 9 }); cam.fov *= K.punch(f, F.FIX, 0.08, 6);
    } else if (sh(1062, 1130)) {              // 21. a toothpick tips you over like a dropped pencil (onto the mat)
      cam = K.fit([[PW[0] - 2.5, 0, PW[1] - 1], [PW[0] + 2.5, PWY + 2.3, PW[1] + 2]], { yaw: -20, pitch: 6, fov: 40, margin: 0.85, maxDist: 9 }); cam.fov *= K.punch(f, F.OVER + 4, 0.14, 6); const s = K.shake(f, F.OVER + 6, 0.06, 10); cam.pos[1] += s[1];
    } else if (sh(1130, 1186)) {              // 22. Barty brings the long pole back (tracking wide)
      const tc = K.track(f, (g) => { const W = K.walkPath(g, 1133, [[DESK[0] - 2, DESK[1] + 1], [-WX + 1.5, 2.0], [-WX - 0.6, 1.6]], 3.0); return [W.x, 0, W.z]; }, { off: [1.5, 3.2, 8.5], lag: 6, lookY: 1.5 }); cam = { ...tc, fov: 48 };
    } else if (sh(1186, 1245)) {              // 23. Lola strolls across eating popcorn (wide)
      cam = K.fit([...LP, [-WX, WY, 0], [WX * 0.2, WY, 0], [0, 1.4, 0]], { yaw: 70, pitch: 6, fov: 44, margin: 0.85, maxDist: 14 }); cam.fov *= K.punch(f, F.POP2, 0.08, 6);
    } else if (sh(1245, 1318)) {              // 24. Peanut gets a pole too, still on the garden hose (wide)
      cam = K.fit([...PP, [-4.5, 0, HOSE], [3, 0, HOSE], [-3, 3, HOSE]], { yaw: 80, pitch: 10, fov: 42, margin: 0.85, maxDist: 9 }); cam.fov *= K.punch(f, F.HOSE2, 0.1, 6);
    } else if (sh(1318, 1360)) {              // 25. Barty's new sign (insert)
      cam = { pos: [DESK[0] + 0.3, 2.4, DESK[1] + 2.6], look: [DESK[0], 2.35, DESK[1] - 0.3], fov: 40 * K.push(u, 0.05) }; dof = { focus: 2.9, cinf: 16 };
    } else {                                  // 26. pull back: the whole big top, Lola on the wire with her pole (echoes the hook)
      cam = K.fit([...LP, ...PP, [-WX, WY, 0], [WX, 0, 0], ...DK], { yaw: lerp(70, 80, u), pitch: 10, fov: 46, margin: 0.85, maxDist: 16 }); cam.fov *= K.punch(f, F.POLES, 0.08, 6);
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    if (f >= F.SAWED - 2 && f < F.HALF + 10) { K.sparks(f, F.SAWED - 2, F.HALF + 10, [DESK[0] - 2.8, 1.0, DESK[1] + 0.8], { dir: [0, 0.4, 1], spread: 1.0, rate: 18, speed: 3, life: 14, color: '#e8c890', seed: 3 }); }
    if (f >= F.HALF && f < F.HALF + 24) K.puff(f, F.HALF, DESK[0] - 2.8, DESK[1] + 0.8, 8, 0.5, '#e8c890');
    if (f >= F.OVER + 4 && f < F.OVER + 28) K.puff(f, F.OVER + 6, PW[0] - 0.6, PW[1] + 1.2, 10, 0.7, '#c8d0e8');
    if (f >= 1245) K.puff(f, 1245 + Math.floor((f - 1245) / 14) * 14, PEANUT.root.position.x, HOSE, 4, 0.4);
    K.mist(f, 816, 16); K.mist(f, 1122, 16);
    K.badge(f, F.PICK0, 'POLE: 1 TOOTHPICK', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 96 });
    K.badge(f, F.WHY, 'WHY A LONG POLE?', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 278 });
    K.badge(f, F.HALF, 'POLE: 5 M → 2.5 M', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 490 });
    K.badge(f, F.PICK, 'POLE: 2.5 M → 3 CM', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 760 });
    K.badge(f, F.SEASICK, 'COMPLAINT #3', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 822 });
    K.badge(f, F.TURN, 'LONG POLE = HARD TO TURN', { sx: 0.5, sy: 0.2 }, { icon: 'weight', f1: 980 });
    K.badge(f, F.SLOWLY, 'SLOW TIP', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1060 });
    K.badge(f, F.DROPPED, 'FAST TIP', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 1128 });
    K.badge(f, F.BACK, '5 M POLE IS BACK', { sx: 0.5, sy: 0.2 }, { style: 'stamp', size: 1.1, f1: 1240 });
    const Lt = K.light('interior', { az: 70, el: 60, shadowExt: 22, exposure: 1.3, fog: '#3a2a24', fogNear: 30, fogFar: 90 });
    return { light: { ...Lt, ink: 0.5, cardTint: '#fff0e0' }, cam, dof, actors: [], fx: [] };
  },
};
