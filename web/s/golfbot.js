// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Golf Balls Have Dimples" — invented story, engine: Fish Out of Water (SCRIPTS.md §000).
// Robot groundskeeper B-12 sands every golf ball smooth before the Club Championship (prize: a golden toaster).
// Margaret "The Hurricane" Pratt's drive dies in the pond, a duck keeps it; the robot polishes harder; 92 balls, the duck
// sits on them like eggs -> wind tunnel: the smooth ball drags a whirlpool like a parachute, dimples shrink it -> toaster dimples.
import { TOTAL, LINES, wf } from './golfbot_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
let THREE, BOT, MARG, GOLF2, GOLF3, CARTGUY, DUCK, DUCK2, BALLS = [], PONDBALLS = [], HERO, HEROD, TOASTER, TOAST, CART, CHUTE, WAKE = [], FLOW_S = [], FLOW_D = [], TUNNEL, EXTRAS = [], BOTFACE = {};
let F = {};
const TUN = [200, 30, 0];                       // wind-tunnel x-ray stage in the sky
const POND = [21, 0, 1.5];

function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
const face = (kind) => (g, w, h) => { g.fillStyle = '#0a1420'; g.fillRect(0, 0, w, h); g.strokeStyle = '#5af0ff'; g.fillStyle = '#5af0ff'; g.lineWidth = 16; g.lineCap = 'round';
  if (kind === 'happy') { for (const x of [0.32, 0.68]) { g.beginPath(); g.arc(w * x, h * 0.5, 34, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); } g.beginPath(); g.arc(w / 2, h * 0.62, 50, 0.2, Math.PI - 0.2); g.stroke(); }
  else if (kind === 'think') { for (const x of [0.32, 0.68]) { g.beginPath(); g.arc(w * x, h * 0.45, 22, 0, 7); g.fill(); } g.font = '900 90px Arial Black, Arial'; g.textAlign = 'center'; g.fillText('?', w * 0.82, h * 0.35); g.beginPath(); g.moveTo(w * 0.38, h * 0.75); g.lineTo(w * 0.62, h * 0.72); g.stroke(); }
  else if (kind === 'shock') { for (const x of [0.32, 0.68]) { g.beginPath(); g.arc(w * x, h * 0.45, 30, 0, 7); g.stroke(); } g.beginPath(); g.ellipse(w / 2, h * 0.75, 22, 28, 0, 0, 7); g.stroke(); }
  else { for (const x of [0.32, 0.68]) { g.beginPath(); g.roundRect(w * x - 26, h * 0.36, 52, 70, 20); g.fill(); } g.beginPath(); g.arc(w / 2, h * 0.6, 36, 0.3, Math.PI - 0.3); g.stroke(); } };

function golfBall(K, r, dimpled, parent) { const g = new THREE.Group(); parent.add(g);
  const b = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 32), dimpled ? K.paint('#f6f6f2', { rough: 0.35 }) : K.paint('#ffffff', { rough: 0.03, coat: 1, env: 2.2 })); b.castShadow = true; g.add(b);
  if (dimpled) { const dm = K.paint('#d8d8d4', { rough: 0.5 }), N = 160, ga = Math.PI * (3 - Math.sqrt(5)); const geo = new THREE.CircleGeometry(r * 0.12, 14);
    for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - y * y), th = ga * i; const n = new THREE.Vector3(Math.cos(th) * rad, y, Math.sin(th) * rad);
      const d = new THREE.Mesh(geo, dm); d.position.copy(n.clone().multiplyScalar(r * 1.002)); d.lookAt(n.clone().multiplyScalar(r * 2)); g.add(d); } }
  return g; }

function dimpleBox(K, w, h, d, mat, parent, x, y, z, dimples) { const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); K.rbox(w, h, d, Math.min(w, h, d) * 0.15, mat, 0, 0, 0, g);
  const dm = K.paint('#b8901a', { rough: 0.3, metal: 0.8 }), geo = new THREE.CircleGeometry(Math.min(w, h) * 0.05, 12); const ds = [];
  for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) for (const s of [1, -1]) { const m = new THREE.Mesh(geo, dm); m.position.set((i - 2.5) / 6 * w * 0.85, (j - 1.5) / 4 * h * 0.8, s * (d / 2 + 0.002)); if (s < 0) m.rotation.y = Math.PI; g.add(m); ds.push(m); }
  g.dimples = ds; return g; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { SANDED: wf(0, 'sanded'), SMOOTH: wf(0, 'smooth'), NOON: wf(1, 'noon'), CHAMP: wf(1, 'championship'), PRIZE: wf(1, 'prize'), TOASTER: wf(1, 'toaster'), DIMPLES: wf(2, 'dimples'), DENTS: wf(2, 'dents'), BUFFED: wf(2, 'buffed'), CLOUDS: wf(2, 'clouds'),
      MARG: wf(3, 'margaret'), HURR: wf(3, 'hurricane'), TEED: wf(3, 'teed'), DRIVE: wf(3, 'drive'), HALF: wf(4, 'half'), PLOP: wf(4, 'plopped'), POND: wf(4, 'pond'), DUCK: wf(4, 'duck'), KEPT: wf(4, 'kept'),
      NEXT: wf(5, 'next'), SAME: wf(5, 'same'), THIRD: wf(5, 'third'), CART: wf(5, 'snack'), FIX: wf(6, 'fix'), SHINIER: wf(6, 'shinier'), CLEARED: wf(6, 'cleared'), SHOE: wf(6, 'shoe'),
      THREEO: wf(7, 'three'), NINETY: wf(7, 'ninety'), EGGS: wf(7, 'eggs'), WHY: wf(8, 'why'), QUIT: wf(8, 'quit'), DRAGS: wf(9, 'drags'), WHIRL: wf(9, 'whirlpool'), CHUTE: wf(9, 'parachute'),
      HUG: wf(10, 'hug'), SHRINKS: wf(10, 'shrinks'), TWICE: wf(10, 'twice'), LEARNED: wf(11, 'learned'), EVERY: wf(11, 'everything'), INCL: wf(12, 'including'), TOAST: wf(12, 'toast'), FLIES: wf(12, 'flies') };
    const white = K.paint('#f4f2ee', { rough: 0.3 }), gold = K.gold(), chrome = K.chrome(), dark = K.paint('#2a2c34', { rough: 0.4 }), wood = K.mat('wood', '#8a5a34', { detail: 0.5 });
    // ================= the course =================
    const CG = K.group();
    const grass = new THREE.PlaneGeometry(220, 160, 110, 80); grass.rotateX(-Math.PI / 2); const GP = grass.attributes.position;
    for (let i = 0; i < GP.count; i++) { const x = GP.getX(i), z = GP.getZ(i); const dp = Math.hypot((x - POND[0]) / 7, (z - POND[2]) / 4.2); GP.setY(i, (dp < 1 ? -0.5 * (1 - dp * dp) : 0) + (Math.abs(z) > 14 ? 0.6 * Math.sin(x * 0.12) * Math.min(1, (Math.abs(z) - 14) / 10) : 0)); }
    grass.computeVertexNormals(); K.add(grass, K.mat('grime', '#5aa83a', { amt: 0.5 }), 0, 0, 0, CG);
    for (let k = 0; k < 14; k++) K.slab(-30 + k * 8, -26 + k * 8, 0.005, 0.012, -4, 4, K.mat('grime', '#6ab848', { amt: 0.3 }), CG, false);          // mowing stripes
    const water = new THREE.Mesh(new THREE.CircleGeometry(1, 48), K.paint('#2a8ac0', { rough: 0.05, coat: 1 })); water.rotation.x = -Math.PI / 2; water.scale.set(7, 4.2, 1); water.position.set(POND[0], -0.12, POND[2]); CG.add(water);
    for (let k = 0; k < 26; k++) { const a = k / 26 * Math.PI * 2; const r = K.add(new THREE.SphereGeometry(0.25 + hash(k) * 0.2, 8, 6), K.mat('rock', '#9a9488'), POND[0] + Math.cos(a) * 7.1, -0.05, POND[2] + Math.sin(a) * 4.3, CG); r.scale.y = 0.5; }
    for (let k = 0; k < 18; k++) { const a = hash(k) * 6.28; const x = POND[0] + Math.cos(a) * 6.4, z = POND[2] + Math.sin(a) * 3.8; for (let j = 0; j < 4; j++) K.cyl(0.015, 0.02, 0.7 + hash(k + j) * 0.4, K.paint('#4a7a2a'), x + j * 0.05, -0.1, z, CG, 5); }
    // tee box, sand bunkers, the green with a flag, trees, ropes, signs
    K.slab(-1.5, 2.5, 0, 0.06, -1.5, 1.5, K.mat('grime', '#78c858', { amt: 0.2 }), CG, false); for (const z of [-1.2, 1.2]) { const tm = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), K.paint('#c0392b')); tm.position.set(1.8, 0.1, z); CG.add(tm); }
    for (const [bx, bz, s] of [[11, -5, 1.6], [34, 5, 2.2], [-6, 7, 1.3]]) { const b = new THREE.Mesh(new THREE.CircleGeometry(1, 32), K.mat('dirt', '#e8d49a', { detail: 0.4 })); b.rotation.x = -Math.PI / 2; b.scale.set(s * 1.6, s, 1); b.position.set(bx, 0.015, bz); CG.add(b); }
    const green = new THREE.Mesh(new THREE.CircleGeometry(5, 40), K.mat('grime', '#7ad05a', { amt: 0.15 })); green.rotation.x = -Math.PI / 2; green.position.set(44, 0.012, 0); CG.add(green);
    K.cyl(0.03, 0.03, 2.4, white, 44, 0, 0, CG, 6); K.slab(44, 44.8, 1.9, 2.4, -0.01, 0.01, K.mat('fabric', '#c0392b'), CG);
    for (let k = 0; k < 34; k++) { const t = S.tree({ h: 5 + hash(k) * 4, seed: k + 3, colors: ['#3a8a3a', '#4f9a3a', '#2f7a34'] }); const side = k % 2 ? 1 : -1; t.position.set(-24 + k * 2.6 + hash(k) * 2, 0, side * (12 + hash(k + 1) * 9)); }
    for (let x = -10; x < 16; x += 2) { K.cyl(0.03, 0.03, 0.9, white, x, 0, -4.6, CG, 6); } K.slab(-10, 14, 0.82, 0.86, -4.62, -4.58, K.mat('fabric', '#c0392b'), CG);
    const sb = S.board('CLUB CHAMPIONSHIP|TODAY 12:00', 3.0, 1.4, { frame: '#2a6a3a' }); sb.position.set(-3.5, 0, -6.0); sb.rotation.y = 0.25;
    const ps = S.board('HOLE 1|PAR 4  ·  POND!', 1.6, 1.0, { frame: '#5a3a24' }); ps.position.set(3.4, 0, -2.6); ps.rotation.y = -0.3;
    // clubhouse + trophy table, benches, flags
    const ch = S.building({ w: 14, d: 8, floors: 2, seed: 9, color: '#f0e6d2', kind: 'plaster', gable: 'pitched', shop: 'MOSSY PINES GOLF CLUB', awning: ['#2a6a3a', '#ffffff'], shutters: '#2a5a3a', flowers: true }); ch.position.set(-12, 0, -13);
    const ch2 = S.building({ w: 7, d: 6, floors: 1, seed: 19, color: '#e8dcc8', kind: 'plaster', gable: 'pitched', shop: 'PRO SHOP', awning: ['#c0392b', '#ffffff'] }); ch2.position.set(0, 0, -15);
    for (const fx of [-20, -4.5]) { K.cyl(0.04, 0.04, 6, white, fx, 0, -9, CG, 8); K.slab(fx, fx + 1.4, 5.0, 5.9, -9.01, -8.99, K.mat('fabric', '#2a6a3a'), CG); }
    for (const [bx, bz] of [[-8, -7.5], [4, -6.2]]) { const b = S.bench(); b.position.set(bx, 0, bz); }
    const TT = new THREE.Group(); TT.position.set(-7, 0, -5.2); CG.add(TT); K.rbox(1.6, 0.06, 0.8, 0.02, wood, 0, 0.95, 0, TT); for (const x of [-0.7, 0.7]) for (const z of [-0.32, 0.32]) K.cyl(0.04, 0.04, 0.95, K.mat('wood', '#5a3a24'), x, 0, z, TT, 8);
    K.rbox(1.62, 0.5, 0.02, 0.01, K.mat('fabric', '#2a6a3a'), 0, 0.72, 0.41, TT); K.rbox(0.6, 0.3, 0.5, 0.05, K.mat('wood', '#3a2418'), 0, 1.13, 0, TT);
    const tl = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.14), S.textMat('1ST PRIZE', { bg: '#1a1a1a', fg: '#f2c230', w: 256, h: 64, border: false })); tl.position.set(0, 1.13, 0.26); TT.add(tl);
    // the sanding bench (B-12's station): a bucket of balls, a conveyor, a sign
    const SB = new THREE.Group(); SB.position.set(-4, 0, 4); CG.add(SB); K.rbox(2.2, 0.9, 1.0, 0.05, K.paint('#5a6a7a', { rough: 0.35 }), 0, 0.45, 0, SB); K.rbox(2.3, 0.06, 1.05, 0.02, chrome, 0, 0.92, 0, SB);
    K.cyl(0.32, 0.26, 0.5, K.paint('#f2c230'), -0.7, 0.95, 0.1, SB, 20); for (let k = 0; k < 14; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), white); b.position.set(-0.7 + (hash(k) - 0.5) * 0.4, 1.47 + hash(k + 2) * 0.06, 0.1 + (hash(k + 4) - 0.5) * 0.4); SB.add(b); }
    for (let k = 0; k < 8; k++) K.cyl(0.04, 0.04, 0.9, dark, 0.1 + k * 0.12, 0.95, -0.1, SB, 10).rotation.x = Math.PI / 2;
    const bs = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.36), S.textMat('BALL REPAIR', { bg: '#2a6a3a', fg: '#ffffff', w: 512, h: 160, border: false })); bs.position.set(0, 0.55, 0.51); SB.add(bs);
    S.bake(CG);
    // ================= props =================
    for (let k = 0; k < 6; k++) BALLS.push(golfBall(K, 0.022 * 1.0, false, sc));
    for (let k = 0; k < 92; k++) { const b = golfBall(K, 0.06, false, sc); const a = hash(k) * 6.28, r = Math.sqrt(hash(k + 1)) * 1.6; b.position.set(POND[0] - 3.2 + Math.cos(a) * r * 1.4, -0.08 + hash(k + 3) * 0.04, POND[2] + 0.6 + Math.sin(a) * r * 0.9); PONDBALLS.push(b); }
    HERO = golfBall(K, 0.5, false, sc); HEROD = golfBall(K, 0.5, true, sc);
    // the golden toaster (+ dimpled version) and a slice of toast
    TOASTER = new THREE.Group(); TOASTER.position.set(-7, 1.28, -5.2); sc.add(TOASTER);
    const tb = dimpleBox(K, 0.5, 0.32, 0.3, gold, TOASTER, 0, 0.16, 0); TOASTER.dimples = tb.dimples;
    for (const x of [-0.1, 0.1]) K.rbox(0.07, 0.02, 0.22, 0.01, dark, x, 0.33, 0, TOASTER); K.rbox(0.04, 0.08, 0.04, 0.01, K.paint('#1a1a1a'), 0.27, 0.22, 0, TOASTER);
    for (const x of [-0.18, 0.18]) for (const z of [-0.1, 0.1]) { const ft = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), gold); ft.position.set(x, 0.0, z); TOASTER.add(ft); }
    TOAST = new THREE.Group(); sc.add(TOAST); K.rbox(0.05, 0.16, 0.14, 0.03, K.paint('#d8a058', { rough: 0.7 }), 0, 0, 0, TOAST); K.rbox(0.052, 0.12, 0.1, 0.02, K.paint('#f2d8a0', { rough: 0.8 }), 0, 0, 0, TOAST);
    // snack cart (golf cart with a striped umbrella and a SNACKS sign)
    CART = new THREE.Group(); CART.position.set(9, 0, 5.5); CART.rotation.y = -0.4; sc.add(CART);
    K.rbox(2.0, 0.5, 1.1, 0.12, K.paint('#f4f2ee', { rough: 0.25 }), 0, 0.55, 0, CART); K.rbox(0.8, 0.6, 1.0, 0.1, K.paint('#f2c230', { rough: 0.3 }), -0.5, 1.0, 0, CART);
    for (const x of [-0.7, 0.7]) for (const z of [-0.55, 0.55]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.14, 18), dark); w.rotation.x = Math.PI / 2; w.position.set(x, 0.22, z); CART.add(w); }
    K.cyl(0.03, 0.03, 1.6, chrome, 0.5, 0.8, 0, CART, 8); const um = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.5, 12), new THREE.MeshStandardMaterial({ map: canvasTex(256, 64, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#ffffff' : '#c0392b'; g.fillRect(i * w / 8, 0, w / 8, h); } }), roughness: 0.7 })); um.position.set(0.5, 2.6, 0); CART.add(um);
    CART.dim = new THREE.Group(); CART.add(CART.dim); { const dg = new THREE.CircleGeometry(0.05, 12), dm2 = K.paint('#c8c4bc', { rough: 0.4 }); for (let i = 0; i < 12; i++) for (let j = 0; j < 3; j++) for (const s2 of [1, -1]) { const m = new THREE.Mesh(dg, dm2); m.position.set(-0.9 + i * 0.16, 0.4 + j * 0.13, s2 * 0.556); if (s2 < 0) m.rotation.y = Math.PI; CART.dim.add(m); } }
    const ss = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.3), S.textMat('SNACKS', { bg: '#c0392b', fg: '#ffffff', w: 256, h: 96, border: false })); ss.position.set(0.3, 0.6, 0.56); CART.add(ss);
    for (let k = 0; k < 6; k++) { const can = K.cyl(0.04, 0.04, 0.12, K.paint(['#c0392b', '#2a62c8', '#3ab04a'][k % 3], { rough: 0.3 }), 0.1 + (k % 3) * 0.12, 0.8, -0.2 + Math.floor(k / 3) * 0.15, CART, 12); CART.cans = (CART.cans || []).concat(can); }
    // ================= B-12, the robot =================
    BOT = new THREE.Group(); sc.add(BOT); const teal = K.paint('#2a9a9a', { rough: 0.25 }), ora = K.paint('#f08a24', { rough: 0.3 });
    for (const z of [-0.32, 0.32]) { K.rbox(0.8, 0.28, 0.2, 0.1, dark, 0, 0.14, z, BOT); for (let k = 0; k < 4; k++) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.22, 14), chrome); w.rotation.x = Math.PI / 2; w.position.set(-0.3 + k * 0.2, 0.12, z); BOT.add(w); } }
    K.rbox(0.66, 0.7, 0.5, 0.12, teal, 0, 0.7, 0, BOT); K.rbox(0.68, 0.08, 0.52, 0.03, gold, 0, 0.42, 0, BOT); K.rbox(0.3, 0.2, 0.02, 0.04, ora, 0, 0.78, 0.26, BOT);
    const bdg = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.1), S.textMat('B-12', { bg: '#1a1a1a', fg: '#f2c230', w: 128, h: 48, border: false })); bdg.position.set(0, 0.98, 0.252); BOT.add(bdg);
    K.cyl(0.06, 0.08, 0.14, chrome, 0, 1.05, 0, BOT, 14);
    BOT.head = new THREE.Group(); BOT.head.position.set(0, 1.42, 0); BOT.add(BOT.head); K.rbox(0.62, 0.46, 0.44, 0.12, teal, 0, 0, 0, BOT.head);
    for (const k of ['happy', 'think', 'shock', 'neutral']) BOTFACE[k] = new THREE.MeshBasicMaterial({ map: canvasTex(256, 192, face(k)), toneMapped: false });
    BOT.screen = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.34), BOTFACE.happy); BOT.screen.position.set(0, 0, 0.225); BOT.screen.userData.ndSkip = false; BOT.head.add(BOT.screen);
    for (const x of [-0.33, 0.33]) { const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 18), ora); ear.rotation.z = Math.PI / 2; ear.position.x = x; BOT.head.add(ear); }
    K.cyl(0.012, 0.012, 0.3, chrome, 0, 0.22, 0, BOT.head, 6); const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff4a3a').multiplyScalar(2) })); bulb.position.y = 0.54; BOT.head.add(bulb);
    BOT.arms = []; for (const s of [-1, 1]) { const a = new THREE.Group(); a.position.set(s * 0.38, 0.9, 0); BOT.add(a); const up = K.cyl(0.04, 0.04, 0.5, chrome, 0, -0.5, 0, a, 10); const pad = new THREE.Group(); pad.position.set(0, -0.52, 0.0); a.add(pad);
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.05, 20), s > 0 ? K.paint('#f4f2ee', { rough: 0.9 }) : ora); disc.position.y = -0.03; pad.add(disc); a.pad = pad; BOT.arms.push(a); }
    BOT.traverse((m) => { if (m.isMesh) m.castShadow = true; });
    // ================= wind tunnel (x-ray) stage =================
    TUNNEL = new THREE.Group(); TUNNEL.position.set(...TUN); sc.add(TUNNEL);
    const tg = K.holoBox(9, 4, 4, 0, 0, 0, TUNNEL, '#36e2ff');
    const bgb = new THREE.Mesh(new THREE.BoxGeometry(40, 24, 24), new THREE.MeshBasicMaterial({ color: '#0c1a34', side: THREE.BackSide })); bgb.userData.ndSkip = true; TUNNEL.add(bgb);
    for (let k = 0; k < 9; k++) { const gl = new THREE.Mesh(new THREE.PlaneGeometry(40, 0.03), new THREE.MeshBasicMaterial({ color: '#1f4a7a' })); gl.position.set(0, -6 + k * 1.5, -6); TUNNEL.add(gl); }
    const flow = (dimpled, k) => { const y0 = (k - 2.5) * 0.28; const pts = []; for (let i = 0; i <= 40; i++) { const x = -4 + i * 0.2; let y = y0;
        const sep = dimpled ? 1.2 : 0.05;                                     // where the flow lets go of the ball (behind its middle)
        if (x > -1.2 && x < sep) { const r = 0.62; const d = Math.max(0, r * r - x * x); y = y0 + Math.sign(y0 || 0.01) * Math.max(0, Math.sqrt(d) - Math.abs(y0) * 0.4) * (Math.abs(y0) < 0.8 ? 1 : 0.3); }
        if (x >= sep) { const t = x - sep; const amp = dimpled ? 0.06 : 0.35 + t * 0.12; y = (y0 + Math.sign(y0 || 0.01) * (dimpled ? 0.15 * Math.exp(-t) : 0.5)) + amp * Math.sin(t * 5 + k) * Math.min(1, t * 2); }
        pts.push([x, y, 0.5 * Math.sin(k)]); } return K.trace(pts, { parent: TUNNEL, color: dimpled ? '#7af8a0' : '#ff9a5a', r: 0.02 }); };
    for (let k = 0; k < 6; k++) { FLOW_S.push(flow(false, k)); FLOW_D.push(flow(true, k)); }
    for (let k = 0; k < 7; k++) { const m = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.04, 8, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff7a3a').multiplyScalar(1.6), transparent: true, opacity: 0.7, toneMapped: false })); m.rotation.y = Math.PI / 2; m.userData.ndSkip = true; TUNNEL.add(m); WAKE.push(m); }
    CHUTE = new THREE.Group(); TUNNEL.add(CHUTE); const cm = new THREE.MeshStandardMaterial({ map: canvasTex(256, 64, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#ffffff' : '#e8402a'; g.fillRect(i * w / 8, 0, w / 8, h); } }), side: THREE.DoubleSide, roughness: 0.8 });
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(1.1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2.4), cm); canopy.rotation.z = -Math.PI / 2; canopy.position.x = 2.6; CHUTE.add(canopy);
    for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2; K.beam ? 0 : 0; const ln = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 2.1, 4), K.paint('#f4f2ee')); const p1 = new THREE.Vector3(0.45, 0, 0), p2 = new THREE.Vector3(2.55, Math.cos(a) * 0.95, Math.sin(a) * 0.95);
      ln.position.copy(p1.clone().add(p2).multiplyScalar(0.5)); ln.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize()); ln.scale.y = p2.distanceTo(p1) / 2.1; CHUTE.add(ln); }
    // ================= characters + animals =================
    MARG = K.stick({ jacket: '#e84a6a', pants: '#f4efe4', hat: 'cap', cap: '#f4f2ee', hairStyle: 'ponytail', hair: '#c8c0b8', glasses: true, vest: '#2a6a3a', gloves: '#f4f2ee', belt: '#3a2418', scarf: '#f2c230' }, { key: 'marg' });
    GOLF2 = K.stick({ jacket: '#f2c230', pants: '#2a3a6a', hat: 'cap', cap: '#2a3a6a', moustache: '#5a3a24', vest: '#c0392b', belt: '#1a1a1a', build: 'stout' }, { key: 'g2' });
    GOLF3 = K.stick({ jacket: '#7a4a9a', pants: '#e8dcc0', hat: 'tophat', hatColor: '#2a2a30', moustache: '#c8c0b8', bowtie: '#f2c230', glasses: true, belt: '#1a1a1a' }, { key: 'g3' });
    CARTGUY = K.stick({ jacket: '#c0392b', pants: '#2a2a30', hat: 'chef', apron: '#f4f2ee', bowtie: '#1a1a1a', hairStyle: 'curly', hair: '#3a2418' }, { key: 'cart' });
    DUCK = K.animal('duck', { seed: 4, scale: 1.4 }); DUCK2 = K.animal('duck', { seed: 9, scale: 1.1 });
    EXTRAS = S.extras(7, { x0: -9, len: 20, z: -6.4, spread: 1.0, seed: 33, stillShare: 0.85 });
    K.addClouds(12, 700, 140);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s);
    const inTunnel = f >= 931 && f < 1100;
    // ---------- robot ----------
    let bot = { x: -4, z: 4.75, yaw: 0, v: true };
    if (f >= 644 && f < 705) bot = { x: -4, z: 4.75, yaw: 0.2, v: true };
    else if (f >= 1167 && f < 1259) bot = { x: 8.0 - 1.4, z: 5.0, yaw: 1.2, v: true };
    else if (f >= 1259) bot = { x: -7, z: -3.8, yaw: Math.PI - 0.2, v: true };
    else if (f >= 145 && f < 244) bot.v = false;
    BOT.position.set(bot.x, 0, bot.z); BOT.rotation.y = bot.yaw; BOT.visible = bot.v && !inTunnel;
    const fk = f < F.DIMPLES - 4 ? 'happy' : f < F.BUFFED ? 'think' : f < 644 ? 'happy' : f < 705 ? 'happy' : f < 1167 ? 'shock' : f < F.LEARNED ? 'think' : 'happy';
    BOT.screen.material = BOTFACE[fk]; BOT.head.rotation.z = fk === 'think' ? 0.15 : 0.04 * Math.sin(f * 0.1);
    const buff = (f < 145) || (f >= 300 && f < 372) || (f >= 644 && f < 705) || (f >= 1167 && f < 1259);
    BOT.arms.forEach((a, k) => { a.rotation.x = buff ? -1.1 + 0.25 * Math.sin(f * 0.9 + k * 3) : -0.15; a.rotation.z = (k ? -1 : 1) * 0.15; a.pad.rotation.y = f * 0.8; });
    // ---------- the hero balls (macros) ----------
    HERO.visible = f < 145 || (f >= 300 && f < 372) || (f >= 644 && f < 705) || (inTunnel && f < 1034);
    if (f < 372) HERO.position.set(-4 + 0.0, 1.0 + 0.5 * 0.0, 4.75 + 0.75); HERO.scale.setScalar(0.12);
    if (f >= 644 && f < 705) HERO.position.set(-4, 1.0, 5.5);
    if (inTunnel) { HERO.position.set(TUN[0], TUN[1], TUN[2]); HERO.scale.setScalar(1.2); HERO.rotation.z = f * 0.15; } else HERO.rotation.y = f * 0.05;
    HEROD.visible = (inTunnel && f >= 1034) || (f >= 1167 && f < 1215 && false); HEROD.position.set(TUN[0], TUN[1], TUN[2]); HEROD.scale.setScalar(1.2); HEROD.rotation.z = f * 0.15;
    const smoothT = f < 1034, ws = smoothT ? 1 : lerp(1, 0.35, sm(F.HUG, F.SHRINKS + 6, f));
    WAKE.forEach((m, k) => { m.visible = inTunnel; const t = ((f * 0.04 + k / 7) % 1); m.position.set(0.7 + t * 3.2 * ws, 0.3 * Math.sin(t * 9 + k) * ws, 0); m.scale.setScalar((0.8 + t * 1.8) * ws); m.material.opacity = 0.7 * (1 - t); m.rotation.x = f * 0.1 + k; });
    FLOW_S.forEach((tr) => tr.show(inTunnel && smoothT ? sm(931, 960, f) : 0)); FLOW_D.forEach((tr) => tr.show(inTunnel && !smoothT ? sm(1036, 1060, f) : 0));
    const ch = sm(F.CHUTE - 4, F.CHUTE + 6, f); CHUTE.visible = inTunnel && smoothT && ch > 0.01; CHUTE.scale.set(ch, ch, ch);
    // ---------- shot balls: Margaret's drive (flies half as far -> pond), golfer 2 (same), golfer 3 (snack cart), the shoe ball, final dimpled drive ----------
    const fly = (f0, p0, p1, h, dur) => { const t = clamp((f - f0) / dur, 0, 1); return [lerp(p0[0], p1[0], t), lerp(p0[1], p1[1], t) + h * 4 * t * (1 - t), lerp(p0[2], p1[2], t), t]; };
    const B = BALLS; for (const b of B) { b.visible = false; b.scale.setScalar(1); }
    const IMP1 = F.TEED + 22;
    if (f >= 372 && f < 561) { const p = f < IMP1 ? [0.45, 0.05, 0.15, 0] : fly(IMP1, [0.45, 0.05, 0.15], [POND[0] - 2, -0.1, POND[2]], 7, 62); B[0].visible = p[1] > -0.12; B[0].position.set(p[0], p[1], p[2]); }
    if (f >= 561 && f < 600) { const p = fly(570, [0.45, 0.05, 0.15], [POND[0] - 3, -0.1, POND[2] + 1], 6, 26); B[1].visible = p[1] > -0.12; B[1].position.set(p[0], p[1], p[2]); }
    if (f >= 600 && f < 644) { const p = fly(606, [0.45, 0.05, 0.15], [8.6, 1.0, 5.3], 2.5, 20); B[2].visible = true; B[2].position.set(p[0], p[1], p[2]); if (p[3] >= 1) { const t = (f - 626) / 30; B[2].position.set(8.6 - t * 2, Math.max(0.03, 1.0 + 3 * t - 9 * t * t), 5.3 + t * 2); } }
    if (f >= 705 && f < 771) { const p = fly(F.CLEARED - 8, [0.45, 0.05, 0.15], [1.4, 0.03, 0.15], 0.12, 14); B[3].visible = true; B[3].position.set(p[0], p[1], p[2]); }
    if (f >= 1100 && f < 1167) { const p = fly(1112, [0.45, 0.05, 0.15], [60, 0.05, -1], 14, 55); B[4].visible = true; B[4].position.set(p[0], p[1], p[2]); }
    PONDBALLS.forEach((b, k) => { b.visible = (f >= 771 && f < 878) && k < Math.min(92, Math.floor((f - 771) * 2.2) + 6); });
    // toaster: plain -> dimpled (line 12); toast pops and flies
    TOASTER.dimples.forEach((d) => { d.visible = f >= 1259; }); TOASTER.visible = !inTunnel;
    const tt = (f - (F.TOAST - 6)) / 30; TOAST.visible = f >= 1259 && tt > 0; if (TOAST.visible) TOAST.position.set(-7 + tt * 9, 1.62 + tt * 6 - tt * tt * 2.2, -5.2 - tt * 1.2), TOAST.rotation.set(tt * 3, 0, tt * 5);
    if (f >= 1259 && tt <= 0) { TOAST.visible = true; TOAST.position.set(-7.1, 1.55, -5.2); TOAST.rotation.set(0, 0, 0); }
    CART.dim.visible = f >= F.EVERY - 4;
    // snack cart wobble when hit
    { const hit = 626; const t = (f - hit) / 30; CART.rotation.z = t > 0 && t < 1 ? 0.06 * Math.sin(t * 25) * (1 - t) : 0; if (CART.cans) CART.cans.forEach((c, k) => { c.position.y = 0.8 + (t > 0 && t < 1.2 ? Math.max(0, (1.5 + k * 0.2) * t - 5 * t * t) : 0); }); }
    // ---------- characters ----------
    const swing = (f0, base) => { const t = f - f0; const back = t < -6 ? 0 : t < 0 ? (t + 6) / 6 : 1, thru = sm(0, 6, t);
      const R = [lerp(lerp(0.15, -0.55, back), 0.6, thru), lerp(lerp(0.2, -0.7, back), -0.75, thru), 'club'], L = [lerp(lerp(0.15, -0.45, back), 0.5, thru), lerp(lerp(0.2, -0.6, back), -0.65, thru), 'fist'];
      return ['hold', { ...base, R, L }]; };
    let mp = { visible: false };
    if (f >= 372 && f < 561) mp = { x: 0, z: -0.45, yaw: 0.0 };
    else if (f >= 878 && f < 931) mp = { x: -0.5, z: -1.6, yaw: 0.6 };
    else if (f >= 1100 && f < 1167) mp = { x: 0, z: -0.45, yaw: 0.0 };
    else if (f >= 1215 && f < 1259) mp = { x: 6.4, z: 7.3, yaw: 2.6 };
    else if (f >= 1259) mp = { x: -5.3, z: -3.2, yaw: -1.9 };
    let mk;
    if (f < 561) mk = f < IMP1 - 8 ? ['hold', { expr: 'smug', R: [0.15, 0.2, 'club'], L: [0.15, 0.2, 'fist'] }] : f < IMP1 + 30 ? swing(IMP1, { expr: 'stern' }) : f < F.KEPT ? ['hold', { expr: 'shock', R: [0.6, -0.75, 'club'], L: [0.5, -0.65, 'fist'], look: 0.6 }] : ['facepalm', { expr: 'pained' }];
    else if (f < 931) mk = f < F.QUIT ? ['think', { expr: 'confused' }] : ['shrug', { expr: 'confused', sweat: true }];
    else if (f < 1167) mk = f < 1108 ? ['hold', { expr: 'stern', R: [0.15, 0.2, 'club'], L: [0.15, 0.2, 'fist'] }] : f < 1140 ? swing(1112, { expr: 'grin' }) : ['celebrate', { expr: 'laugh' }];
    else mk = f < 1259 ? ['shock', { expr: 'shock' }] : f < F.TOAST ? ['hips', { expr: 'deadpan' }] : ['pointUp', { expr: 'shock' }];
    MARG.set(T.act(f, [[0, mk[0], mk[1]]], { seed: 3, blink: blink(3) }), mp);
    const g2 = f >= 561 && f < 600, g3 = f >= 600 && f < 644, g4 = f >= 705 && f < 771;
    GOLF2.set(T.act(f, [[0, ...(f < 570 - 6 ? ['hold', { expr: 'proud', R: [0.15, 0.2, 'club'], L: [0.15, 0.2, 'fist'] }] : f < 590 ? swing(570, { expr: 'stern' }) : ['facepalm', { expr: 'pained' }])]], { seed: 5, blink: blink(5) }),
      g2 ? { x: 0, z: -0.45, yaw: 0 } : g4 ? { x: 0, z: -0.45, yaw: 0 } : { visible: false });
    if (g4) GOLF2.set(T.act(f, [[0, ...(f < F.CLEARED - 8 ? ['hold', { expr: 'stern', R: [0.15, 0.2, 'club'], L: [0.15, 0.2, 'fist'] }] : f < F.CLEARED + 10 ? swing(F.CLEARED - 8, { expr: 'stern' }) : ['shock', { expr: 'shock', look: 0.8 }])]], { seed: 5, blink: blink(5) }), { x: 0, z: -0.45, yaw: 0 });
    GOLF3.set(T.act(f, [[0, ...(f < 606 - 6 ? ['hold', { expr: 'smug', R: [0.15, 0.2, 'club'], L: [0.15, 0.2, 'fist'] }] : f < 624 ? swing(606, { expr: 'stern' }) : ['scared', { expr: 'nervous', sweat: true }])]], { seed: 8, blink: blink(8) }), g3 ? { x: 0, z: -0.45, yaw: 0 } : { visible: false });
    CARTGUY.set(T.act(f, [[0, 'idle', { expr: 'smile' }], [626, 'shock', { expr: 'shock' }], [640, 'angry', { expr: 'angry' }], [1167, 'idle', { expr: 'smile' }], [F.EVERY, 'shock', { expr: 'shock' }]], { seed: 9, blink: blink(9) }), { x: 10.3, z: 4.4, yaw: -0.9, visible: (f >= 600 && f < 644) || (f >= 1167 && f < 1259) });
    // ducks: one keeps Margaret's ball, then sits on 92 balls like eggs
    const pondShot = (f >= 510 && f < 561) || (f >= 771 && f < 878) || (f >= 466 && f < 510);
    DUCK.set(f, { x: f < 771 ? POND[0] - 2 + 0.3 * Math.sin(f * 0.03) : POND[0] - 3.2, y: f < 771 ? -0.1 : 0.12, z: f < 771 ? POND[2] + 0.3 : POND[2] + 0.6, yaw: f < 771 ? -1.2 : 0.4, mode: f < 771 ? (f > F.KEPT ? 'stand' : 'walk') : 'sit', expr: f < 771 ? (f > F.DUCK ? 'happy' : 'neutral') : 'happy', visible: pondShot });
    DUCK2.set(f, { x: POND[0] + 2.5 + Math.sin(f * 0.02), y: -0.1, z: POND[2] - 1.0, yaw: 1.4, mode: 'walk', expr: 'neutral', visible: pondShot });
    K.set.extrasFrame(f, EXTRAS, T); for (const e of EXTRAS) e.r.root.visible = !inTunnel;

    // ---------- shots ----------
    let cam, dof, u, light; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const day = K.light('day', { az: 140, el: 34, shadowExt: 24 }), late = K.light('golden', { az: 120, el: 20 });
    const mh = (p, y = 1.55) => [p.x, y, p.z];
    if (sh(0, 48)) {             // 1. macro: B-12's spinning pad sands a golf ball smooth (dust)
      cam = { pos: [-3.5, 1.25, 6.25], look: [-4, 1.0, 5.5], fov: 38 * K.push(u, 0.12) }; dof = { focus: 0.9, cinf: 14 }; light = day;
    } else if (sh(48, 95)) {     // 2. B-12 at its BALL REPAIR bench (front quarter, push)
      cam = { pos: [lerp(-1.6, -2.0, u), 1.6, 8.0], look: [-4, 1.1, 4.6], fov: 44 }; dof = { focus: 4.2, cinf: 8 }; light = day;
    } else if (sh(95, 145)) {    // 3. insert: a perfectly smooth ball, mirror-shiny (orbit)
      cam = { pos: [-4 + lerp(-0.4, 0.3, u), 1.12, 5.5 + 0.42], look: [-4, 1.0, 5.5], fov: 36 }; dof = { focus: 0.45, cinf: 18 }; light = day;
    } else if (sh(145, 195)) {   // 4. the clubhouse: CLUB CHAMPIONSHIP board, the crowd
      cam = { pos: [lerp(2, 0.5, u), 2.2, 4.0], look: [-6, 1.8, -9], fov: 46 }; dof = { focus: 10, cinf: 4 }; light = day;
    } else if (sh(195, 244)) {   // 5. the golden toaster on its trophy table (low, push)
      cam = { pos: [-6.4, 1.45, -4.1], look: [-7, 1.33, -5.2], fov: 36 * K.push(u, 0.14) }; dof = { focus: 1.2, cinf: 16 }; light = day;
    } else if (sh(244, 300)) {   // 6. B-12's screen: "?" — dimples are dents (close)
      cam = { pos: [-3.2, 1.55, 6.2], look: [-4, 1.35, 4.75], fov: 38 * K.punch(f, F.DENTS, 0.15, 6) }; dof = { focus: 1.7, cinf: 14 }; light = day;
    } else if (sh(300, 372)) {   // 7. macro: buffing until the ball reflects the clouds
      cam = { pos: [-4 + lerp(0.35, -0.2, u), 1.25, 5.5 + 0.38], look: [-4, 1.03, 5.5], fov: 34 }; dof = { focus: 0.45, cinf: 18 }; light = day;
    } else if (sh(372, 420)) {   // 8. Margaret "The Hurricane" Pratt at the tee (low hero angle)
      cam = { pos: [1.3, 0.5, 2.0], look: [0.0, 1.35, -0.45], fov: 44 * K.push(u, 0.1) }; dof = { focus: 2.4, cinf: 10 }; light = day;
    } else if (sh(420, 466)) {   // 9. the swing (front, punch on impact)
      cam = { pos: [0.3, 1.1, 3.0], look: [0.2, 0.9, -0.3], fov: 46 * K.punch(f, IMP1, 0.15, 6) }; dof = { focus: 3.0, cinf: 8 }; light = day;
    } else if (sh(466, 510)) {   // 10. the ball flies... half as far (tracking from behind)
      const tc = K.track(f, (g) => B[0].visible || g < IMP1 ? [B[0].position.x, B[0].position.y, B[0].position.z] : [POND[0] - 2, 0, POND[2]], { off: [-5, 2.5, 3.5], lag: 5, lead: 0.1, lookY: 0.2 }); cam = { ...tc, fov: 50 }; dof = { focus: 7, cinf: 3 }; light = day;
    } else if (sh(510, 561)) {   // 11. the pond: plop! a duck keeps the ball
      cam = { pos: [POND[0] - 4.5, 1.1, POND[2] + 3.2], look: [POND[0] - 2, 0.1, POND[2] + 0.2], fov: 40 * K.push(u, 0.1) }; dof = { focus: 3.6, cinf: 10 }; light = day;
    } else if (sh(561, 600)) {   // 12. next golfer: same (side, quick)
      cam = { pos: [2.4, 1.3, 2.6], look: [0, 1.1, -0.45], fov: 44 }; dof = { focus: 3.4, cinf: 9 }; light = day;
    } else if (sh(600, 644)) {   // 13. the third golfer hits the snack cart (cans fly)
      cam = { pos: [5.0, 1.6, 9.5], look: [8.0, 1.1, 5.0], fov: 46 }; dof = { focus: 5, cinf: 6 }; light = day;
    } else if (sh(644, 705)) {   // 14. B-12's fix: polish them shinier (close on the robot, shake)
      const [sx, sy] = K.shake(f, 650, 0.02, 50); cam = { pos: [-2.6 + sx, 1.5 + sy, 7.0], look: [-4, 1.25, 4.9], fov: 42 * K.push(u, 0.1) }; dof = { focus: 2.6, cinf: 12 }; light = day;
    } else if (sh(705, 771)) {   // 15. macro low: the ball barely clears the golfer's shoe
      cam = { pos: [1.0, 0.18, 1.3], look: [0.5, 0.1, -0.2], fov: 44 * K.punch(f, F.SHOE, 0.15, 6) }; dof = { focus: 1.4, cinf: 12 }; light = day;
    } else if (sh(771, 825)) {   // 16. three o'clock: the pond full of balls (high, slow pan)
      cam = { pos: [POND[0] - 6.5, 3.2, POND[2] + 4.5], look: [POND[0] - 2.6, 0, POND[2] + 0.3], fov: 44 }; dof = { focus: 6, cinf: 4 }; light = late;
    } else if (sh(825, 878)) {   // 17. the duck sits on them like eggs (close, low)
      cam = { pos: [POND[0] - 3.2 + lerp(1.6, 1.2, u), 0.9, POND[2] + 3.2], look: [POND[0] - 3.2, 0.3, POND[2] + 0.6], fov: 40 * K.push(u, 0.12) }; dof = { focus: 2.9, cinf: 12 }; light = late;
    } else if (sh(878, 931)) {   // 18. reaction: Margaret, confused (re-hook)
      const h = mh(mp); cam = { pos: [h[0] + 1.0, h[1] + 0.05, h[2] + 1.9], look: [h[0], h[1] - 0.1, h[2]], fov: 38 * K.push(u, 0.1) }; dof = { focus: 2.1, cinf: 14 }; light = late;
    } else if (sh(931, 985)) {   // 19. wind tunnel x-ray: the smooth ball drags a big messy whirlpool
      cam = { pos: [TUN[0] + lerp(0.6, 1.2, u), TUN[1] + 0.6, 6.8], look: [TUN[0] + 0.8, TUN[1], 0], fov: 46 }; dof = { focus: 6.8, cinf: 4 }; light = day;
    } else if (sh(985, 1034)) {  // 20. ...like a parachute (it pops open behind the ball)
      cam = { pos: [TUN[0] + 4.6, TUN[1] + 1.2, 4.2], look: [TUN[0] + 1.2, TUN[1], 0], fov: 46 * K.punch(f, F.CHUTE, 0.15, 6) }; dof = { focus: 5, cinf: 5 }; light = day;
    } else if (sh(1034, 1100)) { // 21. the dimpled ball: the air hugs it, the whirlpool shrinks
      cam = { pos: [TUN[0] + lerp(-1.0, 0.2, u), TUN[1] + 0.9, 5.6], look: [TUN[0] + 0.6, TUN[1], 0], fov: 44 }; dof = { focus: 5.6, cinf: 5 }; light = day;
    } else if (sh(1100, 1167)) { // 22. Margaret drives a dimpled ball: twice as far (wide, from behind the tee)
      cam = { pos: [-4.5, 2.2, 1.5], look: [lerp(2, 30, sm(1112, 1160, f)), lerp(1.2, 5, sm(1112, 1150, f)), -0.3], fov: 48 }; dof = { focus: 8, cinf: 3 }; light = day;
    } else if (sh(1167, 1215)) { // 23. B-12 adds dimples to everything: the snack cart
      cam = { pos: [6.5, 1.5, 8.6], look: [7.5, 1.1, 5.2], fov: 44 * K.push(u, 0.1) }; dof = { focus: 3.6, cinf: 9 }; light = late;
    } else if (sh(1215, 1259)) { // 24. reaction: Margaret by the cart, shocked
      const h = mh(mp); cam = { pos: [h[0] - 1.3, h[1], h[2] - 1.5], look: [h[0], h[1] - 0.1, h[2]], fov: 38 }; dof = { focus: 2.0, cinf: 14 }; light = late;
    } else if (sh(1259, 1320)) { // 25. the golden toaster, dimpled (insert, push)
      cam = { pos: [-5.9, 1.8, -3.5], look: [-7, 1.35, -5.2], fov: 40 * K.push(u, 0.1) }; dof = { focus: 2.1, cinf: 12 }; light = late;
    } else {                     // 26. toast flies twice as far; Margaret and B-12 look up
      cam = { pos: [-3.8, 1.2, -1.2], look: [lerp(-6, -1, sm(1330, 1390, f)), lerp(1.8, 4.5, sm(1330, 1390, f)), -5.6], fov: 50 }; dof = { focus: 4, cinf: 5 }; light = late;
    }
    // ---------- effects + graphics ----------
    if (buff && !inTunnel) K.steam(f, [-4, 1.0, 5.5], { rate: 4, size: 0.18, rise: 0.4, drift: [0.3, 0.2], seed: 2 });
    if (f >= 300 && f < 372 || (f >= 644 && f < 705)) K.sparks(f, 300, 705, [-4, 1.05, 5.5], { dir: [0, 1, 0.3], spread: 1, rate: 3, speed: 0.8, life: 10, color: '#ffffff', seed: 3 });
    K.puff(f, IMP1 + 62, POND[0] - 2, POND[2], 8, 0.5, '#d8f0ff'); K.puff(f, 596, POND[0] - 3, POND[2] + 1, 8, 0.5, '#d8f0ff'); K.puff(f, 626, 8.6, 5.3, 6, 0.4);
    K.mist(f, 923, 16); K.mist(f, 1092, 16);
    K.badge(f, F.SMOOTH, '0 DIMPLES', [-4, 1.35, 5.5], { icon: 'x', f1: 145 });
    K.badge(f, F.PRIZE, '1ST PRIZE', [-7, 1.85, -5.2], { icon: 'check', f1: 244 });
    K.badge(f, F.DENTS, 'DENTS?', { sx: 0.5, sy: 0.22 }, { f1: 300 });
    K.badge(f, F.HALF, 'HALF AS FAR', { sx: 0.5, sy: 0.2 }, { icon: 'down', f1: 561 });
    K.badge(f, F.NINETY, '92 BALLS', { sx: 0.5, sy: 0.14 }, { style: 'stamp', f1: 878, size: 1.3 });
    if (inTunnel) K.badge(f, F.CHUTE, 'DRAG', [TUN[0] + 2.6, TUN[1] + 1.4, 0], { icon: 'x', f1: 1032 });
    K.badge(f, F.TWICE, '2x FARTHER', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: 1167, style: 'stamp', size: 1.25 });
    return { light: { ...light, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
