// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Sailboats Have Keels" (TikTok, 64 s) — invented story, engine: The Rivals (SCRIPTS.md §000; all-new lines).
// Commodore Fitz ("Less boat, more speed!") saws the keel off his boat Showboat and hangs it on his boathouse wall like a moose
// head; he mocks Nana June's boat ("wearing a shark costume!"); her pig Truffle only came for a suntan. Leg one (wind behind): Fitz
// shoots ahead like toast from a toaster. Leg two (side wind): June sails straight as if on rails; Fitz slides sideways like a
// hockey puck through the floating fish market. Leg three: a gust flips him like a pancake and the wind pushes him back to the start —
// which was also the finish (the hook). Explainer (x-ray): the keel is a big flat fin; the water shoves back on it so the boat slides
// forward instead of sideways; its heavy bottom pulls the boat upright like a roly-poly toy. June wins by a mile, Truffle gets his tan
// (sunglasses and all), and Fitz's new motto: "More boat. Less swimming."
import { TOTAL, LINES, wf } from './keelboat_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const keyPose = (keys, f) => { let i = 0; while (i + 1 < keys.length && f >= keys[i + 1][0]) i++; return keys[i][1]; };
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const QZ = 10, QY = 1.0;                   // quay edge (land is z > QZ), quay height
const TRF = [-14, 15], TRJ = [-6, 15];     // trailers on the quay (Fitz, June)
const BUOY_A = [26, 0], BUOY_B = [26, -18], MKT = [34, -9];   // course + floating fish market
let THREE, F = {}, BF, BJ, FITZ, JUNE, TRUF, TRUFT, WATER, WBASE, WALLKEEL, KEELF, SAWBLADE, FISH = [], WINDT = [], ARR = {}, TOY, TROPHY, SIGNM, CROWD = [], GLASSES = [];

function boat(K, col, name, keelDecal) {
  const g = new THREE.Group(); K.scene.add(g); const roll = new THREE.Group(); g.add(roll);
  const H = K.paint(col, { rough: 0.22 }), W = K.paint('#f4f2ee', { rough: 0.3 }), DK = K.mat('wood', '#c8945a', { detail: 0.3 });
  const hs = new THREE.Shape(); hs.moveTo(0, 2.8); hs.quadraticCurveTo(0.95, 1.4, 0.9, -2.2); hs.lineTo(-0.9, -2.2); hs.quadraticCurveTo(-0.95, 1.4, 0, 2.8);
  const hg = new THREE.ExtrudeGeometry(hs, { depth: 0.9, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 3 }); hg.rotateX(Math.PI / 2); hg.translate(0, 0.55, 0);
  const hull = new THREE.Mesh(hg, H); hull.castShadow = true; roll.add(hull);
  const dg = new THREE.ShapeGeometry(hs); dg.rotateX(-Math.PI / 2); const deck = new THREE.Mesh(dg, DK); deck.position.y = 0.6; deck.scale.set(0.93, 1, 0.95); roll.add(deck);
  const stripe = new THREE.Mesh(new THREE.ExtrudeGeometry(hs, { depth: 0.08, bevelEnabled: false }), K.gold()); stripe.geometry.rotateX(Math.PI / 2); stripe.position.y = 0.42; stripe.scale.set(1.012, 1, 1.006); roll.add(stripe);
  const nm = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.3), K.set.textMat(name, { bg: col, fg: '#ffffff', w: 600, h: 110, border: false })); for (const s of [-1, 1]) { const n = nm.clone(); n.position.set(s * 0.97, 0.25, -0.6); n.rotation.y = s * Math.PI / 2; roll.add(n); }
  K.rbox(1.0, 0.35, 1.3, 0.1, W, 0, 0.8, -1.1, roll);                                           // cockpit coaming
  const mast = K.cyl(0.06, 0.08, 6.4, K.chrome(), 0, 0.6, 0.6, roll, 12); const boom = K.cyl(0.05, 0.05, 2.8, K.chrome(), 0, 1.5 - 1.4, -0.75, roll, 10); boom.rotation.x = Math.PI / 2; boom.position.set(0, 1.5, -0.75);
  const sail = new THREE.Group(); sail.position.set(0, 1.55, 0.6); roll.add(sail); const ss = new THREE.Shape(); ss.moveTo(0, 0); ss.lineTo(0, 5.2); ss.quadraticCurveTo(-0.9, 2.2, -2.7, 0); ss.lineTo(0, 0);
  const sm_ = new THREE.Mesh(new THREE.ShapeGeometry(ss), K.paint('#fbf8f0', { rough: 0.6, coat: 0 })); sm_.material.side = THREE.DoubleSide; sm_.rotation.y = -Math.PI / 2; sm_.castShadow = true; sail.add(sm_);
  const sn = new THREE.Mesh(new THREE.CircleGeometry(0.42, 24), K.set.textMat(name === 'SHOWBOAT' ? '1' : '7', { bg: col, fg: '#ffffff', w: 128, h: 128, border: false })); sn.position.set(0.02, 2.0, -1.0); sn.rotation.y = Math.PI / 2; sail.add(sn); const sn2 = sn.clone(); sn2.position.x = -0.02; sn2.rotation.y = -Math.PI / 2; sail.add(sn2);
  const keel = new THREE.Group(); roll.add(keel); K.rbox(0.12, 1.5, 1.1, 0.05, K.paint('#2a2a30', { rough: 0.3 }), 0, -0.85, -0.2, keel); K.sphere(0.24, K.paint('#3a3a40', { metal: 0.5, rough: 0.3 }), 0, -1.6, -0.2, keel, 0.8, 0.8, 2.2);
  if (keelDecal) { for (const s of [-1, 1]) { const e = K.sphere(0.16, K.paint('#ffffff'), s * 0.07, -0.5, 0.2, keel, 0.4, 1, 1); K.sphere(0.08, K.paint('#111'), s * 0.1, -0.5, 0.24, keel, 0.4, 1, 1); } for (let k = 0; k < 4; k++) { const t = K.rbox(0.13, 0.08, 0.06, 0.01, K.paint('#ffffff'), 0, -0.72, 0.28 - k * 0.08, keel); t.rotation.x = 0.6; } }
  K.rbox(0.08, 0.5, 0.5, 0.02, K.paint('#2a2a30'), 0, 0.0, -2.1, roll);                          // rudder
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return { g, roll, keel, sail }; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { CROSSED: wf(0, 'crossed'), FINISH: wf(0, 'finish'), BACKW: wf(0, 'backwards'), UPSIDE: wf(0, 'upside'), SAWED: wf(1, 'sawed'), KEEL1: wf(1, 'keel'), LESS: wf(1, 'boat') - 8, WHY: wf(1, 'why'),
      HUNG: wf(2, 'hung'), WALL: wf(2, 'wall'), MOOSE: wf(2, 'moose'), POINTED: wf(3, 'pointed'), NANA: wf(3, 'nana'), WEARING: wf(3, 'wearing'), SHARK: wf(3, 'shark'),
      ANSWER: wf(4, 'answer'), PIG: wf(4, 'pig'), BUSY: wf(4, 'busy'), SUNTAN: wf(4, 'suntan'), LEG1: wf(5, 'leg'), BEHIND: wf(5, 'behind'), SHOT: wf(5, 'shot'), TOAST: wf(5, 'toast'), TOASTER: wf(5, 'toaster'),
      LESS2: wf(6, 'boat') - 8, WAVING: wf(6, 'waving'), HAT: wf(6, 'hat'), LEG2: wf(7, 'leg'), SIDE: wf(7, 'side'), STRAIGHT: wf(7, 'straight'), RAILS: wf(7, 'rails'),
      SLID: wf(8, 'slid'), SIDEWAYS: wf(8, 'sideways'), PUCK: wf(8, 'puck'), THROUGH: wf(8, 'through'), MARKET: wf(8, 'market'), LEG3: wf(9, 'leg'), GUST: wf(9, 'gust'), FLIPPED: wf(9, 'flipped'), PANCAKE: wf(9, 'pancake'),
      PUSHED: wf(10, 'pushed'), START: wf(10, 'start'), FINISH2: wf(10, 'finish'), WHAT: wf(11, 'what'), KEEL2: wf(12, 'keel'), FIN: wf(12, 'fin'), SHOVES: wf(13, 'shoves'), SIDEW2: wf(13, 'sideways'), WATERW: wf(13, 'water'), BACK: wf(13, 'back'), FORWARD: wf(13, 'forward'),
      HEAVY: wf(14, 'heavy'), UPRIGHT: wf(14, 'upright'), TOYW: wf(14, 'toy'), KNOCKED: wf(14, 'knocked'), WON: wf(15, 'won'), MILE: wf(15, 'mile'), TAN: wf(15, 'tan'), SUNG: wf(15, 'sunglasses'), MOTTO: wf(16, 'motto'), LESS3: wf(16, 'less') };
    // ================= Gull Bay: water, quay, harbor houses, fish market, course =================
    const WGeo = new THREE.PlaneGeometry(110, 90, 150, 120); WGeo.rotateX(-Math.PI / 2); WBASE = Float32Array.from(WGeo.attributes.position.array);
    WATER = new THREE.Mesh(WGeo, K.paint('#1a7aa8', { rough: 0.25, coat: 0.4, coatRough: 0.2, env: 0.4, metal: 0.0 })); WATER.material.transparent = true; WATER.material.opacity = 0.82; WATER.receiveShadow = true; WATER.renderOrder = 2; sc.add(WATER);
    K.slab(-300, 300, -6, -5.9, -300, 300, K.mat('dirt', '#c8b080', { detail: 2 }), sc, false);
    const G = K.group(); const stone = K.mat('rock', '#a89a8a', { detail: 0.8 }), plank = K.mat('wood', '#9a7048', { detail: 0.5 });
    K.slab(-60, 12, -6, QY, QZ, 60, stone, G);
    for (let x = -58; x < 12; x += 1.6) K.rbox(1.5, 0.08, 0.35, 0.02, plank, x, QY + 0.04, QZ + 0.3, G);
    for (let x = -56; x < 12; x += 5) { K.cyl(0.18, 0.22, 0.45, K.paint('#2a2a30'), x, QY, QZ + 0.7, G, 16); K.cyl(0.26, 0.26, 0.08, K.paint('#2a2a30'), x, QY + 0.45, QZ + 0.7, G, 16); }
    for (const x of [-30, -20, -10, 0]) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.12, 10, 20), K.paint('#e8402a')); t.position.set(x + 1.2, 0.4, QZ - 0.05); G.add(t); }
    const houses = [['BOATHOUSE', '#c8d8e8', -16, 7, '#2a62c8'], ['FISH & CHIPS', '#f2d8a0', -4, 6, '#c0392b'], ['SAIL SHOP', '#e8c8c8', 6, 6, '#2a9a6a'], [null, '#d8e8c8', -26, 6, null], [null, '#e8d8b8', -36, 7, null]];
    for (const [shop, c, x, w, aw] of houses) { const b = S.building({ w, d: 6, floors: 2, color: c, gable: 'flat', shutters: '#2a5a7a', flowers: true, seed: Math.floor(x + 50), shop: shop || undefined, awning: aw || undefined }, G); b.position.set(x, QY, 24); }
    // Fitz's boathouse wall (for the keel trophy) faces the water
    K.rbox(8, 5, 0.3, 0.05, K.mat('wood', '#8a5a3a', { detail: 0.5 }), -30, QY + 2.5, 20.2, G); for (let k = 0; k < 9; k++) K.rbox(0.08, 5, 0.32, 0.01, K.mat('wood', '#6a4028'), -33.8 + k * 0.95, QY + 2.5, 20.2, G);
    const pl = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.4), S.textMat('MY KEEL · 2026', { bg: '#f2c230', fg: '#1a1a1a', w: 500, h: 120 })); pl.position.set(-30, QY + 1.6, 20.0); pl.rotation.y = Math.PI; G.add(pl);
    const shield = K.rbox(1.6, 2.4, 0.12, 0.2, K.mat('wood', '#5a3a24'), -30, QY + 3.4, 19.98, G);
    // flags, lamp posts, crates, barrels, nets on the quay
    for (const x of [-48, -32, -22, 2, 10]) { const lp = S.streetLamp(); lp.position.set(x, QY, QZ + 1.6); }
    for (let k = 0; k < 6; k++) { K.rbox(0.8, 0.6, 0.6, 0.03, K.mat('wood', '#b8844a'), -42 + k * 1.1, QY + 0.3, 13, G); }
    for (let k = 0; k < 4; k++) K.cyl(0.35, 0.35, 0.9, K.mat('wood', '#8a5a3a'), -46 + k * 0.8, QY, 14, G, 14);
    // start/finish gate
    for (const z of [-4, 4]) { K.sphere(0.6, K.paint('#f2701e', { rough: 0.3 }), 0, 0.15, z, G); K.cyl(0.05, 0.05, 3.4, K.chrome(), 0, 0.3, z, G, 8); const fl = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.6), S.textMat('▪▫▪', { bg: '#1a1a1a', fg: '#ffffff', w: 128, h: 90, border: false })); fl.position.set(0.45, 3.3, z); fl.material.side = THREE.DoubleSide; G.add(fl); }
    const ban = new THREE.Mesh(new THREE.PlaneGeometry(8, 0.8), S.textMat('START · FINISH', { bg: '#1f2a44', fg: '#f2c230', w: 1000, h: 100 })); ban.position.set(0, 3.0, 0); ban.rotation.y = Math.PI / 2; G.add(ban); const ban2 = ban.clone(); ban2.rotation.y = -Math.PI / 2; ban2.position.x -= 0.02; G.add(ban2);
    // leg buoys
    for (const [x, z, t] of [[BUOY_A[0], BUOY_A[1], 'LEG 2'], [BUOY_B[0], BUOY_B[1], 'LEG 3'], [12, 0, 'LEG 1']]) { K.cyl(0.5, 0.7, 1.2, K.paint('#f2c230', { rough: 0.3 }), x, -0.3, z, G, 16); const s = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.5), S.textMat(t, { bg: '#f2c230', fg: '#1a1a1a', w: 300, h: 120, border: false })); s.position.set(x, 1.4, z); s.rotation.y = Math.PI / 2; s.material.side = THREE.DoubleSide; G.add(s); K.cyl(0.04, 0.04, 1.2, K.chrome(), x, 0.8, z, G, 6); }
    // floating fish market (pontoon with stalls)
    K.rbox(7, 0.5, 8, 0.05, plank, MKT[0] + 2, 0.15, MKT[1], G); for (let k = 0; k < 3; k++) { const x = MKT[0] + 0.5 + k * 1.8; K.rbox(1.5, 0.9, 1.0, 0.04, K.mat('wood', '#b8844a'), x, 0.85, MKT[1] - 2.5, G);
      for (let j = 0; j < 5; j++) K.rbox(1.4 / 5, 0.04, 1.3, 0.01, K.paint(j % 2 ? '#ffffff' : '#2a62c8'), x - 0.56 + j * 0.28, 2.3, MKT[1] - 2.6, G); for (const s of [-0.7, 0.7]) K.cyl(0.04, 0.04, 1.9, K.chrome(), x + s, 0.4, MKT[1] - 2.0, G, 6); }
    const fsg = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.7), S.textMat('FRESH FISH', { bg: '#2a62c8', fg: '#ffffff', w: 800, h: 160 })); fsg.position.set(MKT[0] + 2, 2.7, MKT[1] - 1.9); G.add(fsg);
    for (let k = 0; k < 6; k++) K.rbox(0.7, 0.4, 0.5, 0.03, K.mat('wood', '#c8a070'), MKT[0] + 0.3 + k * 1.0, 0.6, MKT[1] + 1.8, G);
    // islands + hills far away
    for (let k = 0; k < 4; k++) K.sphere(14 + hash(k) * 6, K.mat('grime', ['#5f9a44', '#4f8a3a'][k % 2], { detail: 3 }), 30 + k * 30, -8, -70 - hash(k + 1) * 15, G, 1, 0.5, 1);
    for (let k = 0; k < 8; k++) { const t = S.tree({ h: 4 + hash(k) * 2, seed: k }); t.position.set(-50 + k * 8, QY, 30 + hash(k) * 4); }
    S.bake(G);
    // ================= boats, trailers, keel trophy =================
    BF = boat(K, '#d8a020', 'SHOWBOAT', false); BJ = boat(K, '#2a9a8a', 'OLD BISCUIT', true);
    for (const T of [TRF, TRJ]) { const tg = K.group(); K.rbox(1.6, 0.15, 5, 0.03, K.paint('#5a6a7a', { metal: 0.6 }), T[0], QY + 0.6, T[1], tg); for (const dz of [-1.6, 1.6]) for (const dx of [-0.6, 0.6]) K.rbox(0.12, 1.9, 0.12, 0.02, K.paint('#5a6a7a', { metal: 0.6 }), T[0] + dx, QY + 1.6, T[1] + dz, tg); for (const dx of [-0.85, 0.85]) { const w = K.cyl(0.35, 0.35, 0.2, K.paint('#1a1a1e'), T[0] + dx, QY + 0.35 - 0.1, T[1], tg, 16); w.rotation.z = Math.PI / 2; w.position.set(T[0] + dx, QY + 0.35, T[1]); } }
    KEELF = new THREE.Group(); sc.add(KEELF); K.rbox(0.12, 1.5, 1.1, 0.05, K.paint('#2a2a30', { rough: 0.3 }), 0, 0, 0, KEELF); K.sphere(0.24, K.paint('#3a3a40', { metal: 0.5, rough: 0.3 }), 0, -0.75, 0, KEELF, 0.8, 0.8, 2.2);
    SAWBLADE = new THREE.Group(); sc.add(SAWBLADE); K.rbox(0.7, 0.18, 0.02, 0.01, K.chrome(), 0, 0, 0, SAWBLADE); K.rbox(0.18, 0.2, 0.06, 0.03, K.paint('#c0392b'), 0.42, 0, 0, SAWBLADE);
    // flying fish
    for (let k = 0; k < 14; k++) { const fg = new THREE.Group(); sc.add(fg); K.sphere(0.16, K.paint(k % 3 ? '#a8b8c8' : '#e88a4a', { metal: 0.4, rough: 0.3 }), 0, 0, 0, fg, 1, 0.6, 2.2); const t = K.rbox(0.02, 0.18, 0.16, 0.01, K.paint('#8a9aa8'), 0, 0, -0.38, fg); FISH.push(fg); }
    // wind lines + explainer arrows
    for (let j = 0; j < 4; j++) WINDT.push(K.trace(Array.from({ length: 16 }, (_, i) => [BUOY_A[0] - 14 + i * 1.0, 2 + j * 0.9, BUOY_A[1] - 6 - j * 2.2 + 0.4 * Math.sin(i * 0.8 + j)]), { color: '#e8f4ff', r: 0.05 }));
    const arrow = (col, len) => { const g = new THREE.Group(); const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(2), toneMapped: false }); const s = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, len, 10), m); s.position.y = len / 2; g.add(s); const h = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.5, 12), m); h.position.y = len + 0.2; g.add(h); g.traverse((o) => { o.userData.ndSkip = true; }); sc.add(g); return g; };
    ARR.wind = arrow('#ff8a2a', 2.2); ARR.water = arrow('#36e2ff', 1.6); ARR.fwd = arrow('#7af8a0', 2.4); ARR.wt = arrow('#ffd23a', 1.4);
    TOY = new THREE.Group(); sc.add(TOY); { K.sphere(0.5, K.paint('#d8342a', { rough: 0.3 }), 0, 0.5, 0, TOY); K.sphere(0.32, K.paint('#f4efe4'), 0, 1.15, 0, TOY); for (const s of [-1, 1]) K.sphere(0.05, K.paint('#111'), s * 0.11, 1.2, 0.29, TOY); K.sphere(0.2, K.paint('#d8342a'), 0, 1.45, 0, TOY, 1, 0.5, 1); const hb = K.holoBox(0.5, 0.25, 0.5, 0, 0.18, 0, TOY, '#ffd23a'); }
    TROPHY = new THREE.Group(); sc.add(TROPHY); { K.cyl(0.25, 0.1, 0.5, K.gold(), 0, 0.3, 0, TROPHY, 20); K.cyl(0.12, 0.2, 0.3, K.gold(), 0, 0, 0, TROPHY, 16); for (const s of [-1, 1]) { const h = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 8, 16), K.gold()); h.position.set(s * 0.28, 0.6, 0); TROPHY.add(h); } }
    SIGNM = S.protestSign('MORE BOAT.|LESS SWIMMING.');
    // ================= characters =================
    FITZ = K.stick({ jacket: '#1f2a4a', pants: '#f4f2ee', hat: 'pilot', hatColor: '#f4f2ee', moustache: '#5a3a24', bowtie: '#f2c230', badge: true, belt: '#f2c230', vest: '#f2701e', glasses: '#2a2a2a' }, { key: 'fitz' });
    JUNE = K.stick({ jacket: '#f08ab8', pants: '#2a62c8', hairStyle: 'bun', hair: '#e8e4dc', glasses: true, scarf: '#2a9a8a', vest: '#f2701e', dress: '#f08ab8', boots: '#f2c230' }, { key: 'june' });
    TRUF = K.animal('pig', { seed: 3, scale: 1.0 }); TRUFT = K.animal('pig', { seed: 3, scale: 1.0, color: '#c8845a' });
    for (const P of [TRUF, TRUFT]) { const gl = new THREE.Group(); P.head.add(gl); gl.position.set(0, 0.07, 0.24); gl.scale.setScalar(1.3); for (const s of [-1, 1]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 16), K.paint('#111', { rough: 0.15 })); l.rotation.x = Math.PI / 2; l.position.set(s * 0.08, 0, 0.02); gl.add(l); } K.rbox(0.06, 0.015, 0.01, 0, K.paint('#111'), 0, 0.01, 0.02, gl); GLASSES.push(gl); }
    for (let k = 0; k < 5; k++) CROWD.push(K.stick([{ jacket: '#c0392b', pants: '#2a2a40', hat: 'cap', hatColor: '#2a62c8', scarf: '#f2c230' }, { jacket: '#2a9a6a', pants: '#3a3a40', hairStyle: 'curly', hair: '#2a1a14', glasses: true, dress: '#2a9a6a' },
      { jacket: '#f2c230', pants: '#2a62c8', hat: 'beanie', hatColor: '#c0392b', moustache: '#5a3a24' }, { jacket: '#9a5ad8', pants: '#2a2a40', hairStyle: 'ponytail', hair: '#c8502a', scarf: '#f4efe4' }, { jacket: '#f4f2ee', pants: '#1f2a44', hat: 'chef', apron: '#ffffff', bowtie: '#c0392b' }][k], { key: 'cr' + k }));
    K.addClouds(10, 700, 160);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s);
    const ex = f >= 1268 && f < 1680;
    const race = (f < 124) || (f >= 593 && f < 1268) || (f >= 1680);
    // ---------- Fitz's boat ----------
    let fb = { x: TRF[0], y: QY + 2.25, z: TRF[1], yaw: Math.PI / 2, roll: 0 }, fkeel = true;
    const fitzLeg1 = (g) => lerp(2, 22, sm(597, 721, g));
    if (f < 124) { fb = { x: lerp(5, -2.5, f / 124), y: -0.35, z: 0.6, yaw: -Math.PI / 2 - 0.25, roll: Math.PI }; fkeel = false; }
    else if (f < 593) { fkeel = f < F.KEEL1 + 2; }
    else if (f < 803) { fb = { x: fitzLeg1(f), y: 0, z: -1.2, yaw: Math.PI / 2, roll: -0.12 }; fkeel = false; if (f >= 721) fb.x = 22 + (f - 721) * 0.04; }
    else if (f < 1065) { const u = sm(950, 1050, f); fb = { x: lerp(25, MKT[0] + 1.0, u), y: 0, z: lerp(-3, MKT[1] + 0.6, u * 0.8), yaw: Math.PI - 0.3 + 0.4 * Math.sin(f * 0.12), roll: -0.25 - 0.1 * Math.sin(f * 0.2) }; fkeel = false; if (f < 950) fb = { x: 25, y: 0, z: lerp(-1.2, -3, sm(803, 950, f)), yaw: Math.PI - 0.2, roll: -0.3 }; }
    else if (f < 1150) { const u = sm(F.FLIPPED - 4, F.FLIPPED + 12, f); fb = { x: 28, y: -0.35 * u, z: -12, yaw: Math.PI, roll: -0.3 - (Math.PI - 0.3) * u }; fkeel = false; }
    else if (f < 1268) { const u = clamp((f - 1150) / 118, 0, 1); fb = { x: lerp(20, 2, u), y: -0.35, z: lerp(-8, 0.6, u), yaw: -Math.PI / 2 - 0.25, roll: Math.PI }; fkeel = false; if (f >= 1210) fb.x = lerp(4, -1, (f - 1210) / 58); }
    else if (f >= 1680) { fb = { x: -1.5, y: -0.35, z: 2.6, yaw: -Math.PI / 2 + 0.3, roll: Math.PI }; fkeel = false; }
    BF.g.visible = !ex; BF.g.position.set(fb.x, fb.y + (race ? 0.06 * Math.sin(f * 0.15) : 0), fb.z); BF.g.rotation.set(0, fb.yaw, 0); BF.roll.rotation.z = fb.roll; BF.keel.visible = fkeel; BF.g.updateMatrixWorld(true);
    BF.sail.rotation.y = race ? 0.5 * Math.sin(0.3) + (f >= 803 ? -0.9 : 0.7) : 0;
    // ---------- June's boat ----------
    let jb = { x: TRJ[0], y: QY + 2.25, z: TRJ[1], yaw: Math.PI / 2, roll: 0 };
    if (f < 124) jb = { x: -4, y: 0, z: -2.5, yaw: -Math.PI / 2 + 0.2, roll: 0 };
    else if (f >= 593 && f < 803) jb = { x: lerp(2, 12, sm(597, 803, f)), y: 0, z: 1.4, yaw: Math.PI / 2, roll: -0.08 };
    else if (f >= 803 && f < 1268) { const u = clamp((f - 803) / 465, 0, 1); jb = u < 0.55 ? { x: lerp(24, 24.5, u), y: 0, z: lerp(1.0, -17, u / 0.55), yaw: Math.PI, roll: -0.12 + 0.03 * Math.sin(f * 0.1) } : { x: lerp(24, 6, (u - 0.55) / 0.45), y: 0, z: lerp(-17, -6, (u - 0.55) / 0.45), yaw: -Math.PI / 2 - 0.5, roll: -0.15 }; }
    else if (ex) { const t = f; let r = 0; if (f >= F.HEAVY - 10) r = 0.45 * Math.exp(-(f - (F.HEAVY - 10)) / 30) * Math.cos((f - (F.HEAVY - 10)) * 0.16); if (f >= F.SHOVES && f < F.HEAVY - 10) r = -0.18;
      jb = { x: 0 + (f >= F.FORWARD - 4 ? (f - F.FORWARD) * 0.03 : 0) * 0, y: 0, z: -24, yaw: Math.PI / 2, roll: r }; void t; }
    else if (f >= 1680) jb = { x: -9, y: 0, z: 4.5, yaw: -Math.PI / 2 + 0.15, roll: 0 };
    BJ.g.position.set(jb.x, jb.y + (race || ex ? 0.06 * Math.sin(f * 0.15 + 1) : 0), jb.z); BJ.g.rotation.set(0, jb.yaw, 0); BJ.roll.rotation.z = jb.roll; BJ.g.updateMatrixWorld(true);
    BJ.sail.rotation.y = race || ex ? (f >= 803 && f < 1268 ? -0.8 : 0.6) : 0;
    // ---------- keel trophy on the boathouse wall / falling off the saw ----------
    KEELF.visible = f >= F.KEEL1 + 2 && f < 593; if (KEELF.visible) { if (f < 268) { const u = sm(F.KEEL1 + 2, F.KEEL1 + 14, f); KEELF.position.set(TRF[0], lerp(QY + 1.4, QY + 0.5, u), TRF[1] - 0.2); KEELF.rotation.set(0, Math.PI / 2, u * 1.2); } else { KEELF.position.set(-30, QY + 3.2, 19.8); KEELF.rotation.set(Math.PI, Math.PI / 2, 0.15); } }
    SAWBLADE.visible = f >= 124 && f < F.KEEL1 + 6; if (SAWBLADE.visible) SAWBLADE.position.set(TRF[0] + 0.3 * Math.sin(f * 1.2), QY + 1.35, TRF[1] - 0.2 + 0.7);
    // ---------- characters on boats / quay ----------
    const onBoat = (B, lp) => B.roll.localToWorld(new THREE.Vector3(...lp));
    let fp, fitzVis = !ex;
    if (f < 124) { BF.roll.updateMatrixWorld(true); const p = onBoat(BF, [0, -0.62, -0.4]); fp = { x: p.x, y: p.y, z: p.z, yaw: fb.yaw + Math.PI }; }
    else if (f < 593) fp = f >= 268 && f < 336 ? { x: -28.6, y: QY, z: 18.2, yaw: 0.6 } : { x: TRF[0] + 0.9, y: QY, z: TRF[1] + 1.1, yaw: f >= 336 && f < 465 ? 1.5 : -2.4 };
    else if (f < 1065 || (f >= 1065 && f < F.FLIPPED - 4)) { BF.roll.updateMatrixWorld(true); const p = onBoat(BF, [0, 0.62, -1.2]); fp = { x: p.x, y: p.y, z: p.z, yaw: fb.yaw }; }
    else if (f < 1268) { const p = [fb.x - 0.2, -0.0, fb.z + 0.2]; fp = f < 1150 ? { x: fb.x + 1.2, y: -0.9, z: fb.z + 0.6, yaw: fb.yaw } : { x: p[0], y: 0.0, z: p[2], yaw: fb.yaw + Math.PI }; }
    else fp = { x: -13, y: QY, z: 11.0, yaw: Math.PI + 0.4 };
    const fk = [[0, 'sit', { expr: 'dazed', sweat: true }], [60, 'wave', { expr: 'pained' }], [124, 'hammer', { expr: 'grin', R: [0.3, 0.3, null] }], [F.LESS - 6, 'cheer', { expr: 'proud', talk: true }], [F.WHY, 'hips', { expr: 'smug' }],
      [268, 'show', { expr: 'proud' }], [F.MOOSE, 'hips', { expr: 'smug' }], [336, 'point', { expr: 'gloat', talk: true }], [F.SHARK, 'laugh', { expr: 'laugh' }], [465, 'hips', { expr: 'smug' }],
      [593, 'sit', { expr: 'excited' }], [F.SHOT, 'cheer', { expr: 'excited' }], [F.LESS2 - 6, 'wave', { expr: 'gloat', talk: true }], [803, 'sit', { expr: 'confused' }], [F.SLID, 'panic', { expr: 'scared', sweat: true }], [F.MARKET, 'shock', { expr: 'dazed' }],
      [1065, 'panic', { expr: 'scared' }], [1150, 'sit', { expr: 'dazed', sweat: true }], [F.START, 'facepalm', { expr: 'pained' }], [1680, 'idle', { expr: 'sad' }], [1790, 'show', { expr: 'sad', R: [0.3, 0.2, null] }], [F.LESS3, 'show', { expr: 'nervous', R: [0.3, 0.2, null] }]];
    const FA = T.act(f, fk, { seed: 7, blink: blink(7), phase: (f / 20) % 1 }); if ((f >= 593 && f < F.FLIPPED - 4) || f < 124 || (f >= 1150 && f < 1268)) { if (!['cheer', 'wave', 'panic', 'shock', 'facepalm'].includes(keyPose(fk, f))) FA.opts.mode = 'sit'; }
    FITZ.set(FA, { ...fp, visible: fitzVis });
    if (f < 124 || (f >= 593 && f < 1268)) FITZ.root.rotation.set(0, fp.yaw, 0);
    SIGNM.visible = f >= 1790; if (SIGNM.visible) { SIGNM.position.set(fp.x + 0.5, QY + 0.9, fp.z + 0.3); SIGNM.rotation.set(0, Math.PI, 0); }
    // June
    let jp; if (f < 593 || f >= 1680 && false) jp = { x: TRJ[0] - 0.9, y: QY, z: TRJ[1] + 1.4, yaw: f >= 465 && f < 520 ? 0.3 : -2.6 }; else { const p = onBoat(BJ, [0, 0.62, -1.3]); jp = { x: p.x, y: p.y, z: p.z, yaw: jb.yaw }; }
    const jk = [[0, 'cheer', { expr: 'smile' }], [124, 'idle', { expr: 'neutral' }], [336, 'idle', { expr: 'deadpan' }], [F.ANSWER - 4, 'cross', { expr: 'deadpan' }], [593, 'sit', { expr: 'smile' }], [F.STRAIGHT, 'sit', { expr: 'deadpan' }], [1680, 'cheer', { expr: 'laugh' }], [F.MILE, 'show', { expr: 'proud', R: [0.3, 0.3, null] }]];
    const JA = T.act(f, jk, { seed: 9, blink: blink(9) }); if (f >= 593 && !(f >= 1680 && f >= F.WON - 4)) { if (keyPose(jk, f) !== 'cheer') JA.opts.mode = 'sit'; }
    JUNE.set(JA, { ...jp, visible: !ex });
    TROPHY.visible = f >= F.MILE - 4; if (TROPHY.visible) { const p = onBoat(BJ, [0.5, 0.65, -0.3]); TROPHY.position.copy(p); }
    // Truffle (sunbathing on June's deck; tanned at the end)
    let tp; if (f < 593) tp = { x: TRJ[0], y: QY + 2.25 + 0.6, z: TRJ[1] + 1.0, yaw: Math.PI / 2 }; else { const p = onBoat(BJ, [0, 0.62, 1.4]); tp = { x: p.x, y: p.y, z: p.z, yaw: jb.yaw + Math.PI * 0.5 }; }
    const tanned = f >= F.TAN - 2; const tmode = f >= F.BUSY - 6 ? 'sleep' : 'stand';
    const pst0 = { ...tp, mode: (f >= 593 && f < 1268 && (f >= F.LEG2 - 4)) ? 'sleep' : tmode, expr: f >= F.SUNG ? 'happy' : 'sleepy' };
    const pst = { ...pst0 }; if (f < 124) pst.mode = 'sleep'; if (f >= F.TAN - 2) { pst.mode = 'stand'; pst.expr = 'happy'; }
    TRUF.set(f, { ...pst, visible: !ex && !tanned }); TRUFT.set(f, { ...pst, visible: !ex && tanned });
    // crowd on the quay (laughing at the hook / cheering at the end)
    CROWD.forEach((c, k) => { if (f >= 124 && f < 593) { c.set(T.act(f, [[0, 'idle']], {}), { visible: false }); return; } const ck = f < 124 || f >= 1680 ? [[0, k % 2 ? 'laugh' : 'pointL', { expr: 'laugh' }], [k * 4 + 30, 'clap', { expr: 'laugh' }]] : [[0, 'idle', { expr: 'smile' }], [k * 5 + 20, 'wave', { expr: 'excited' }]];
      c.set(T.act(f, ck, { seed: 40 + k, blink: blink(40 + k) }), { x: -10 + k * 1.6 + (k > 2 ? 4 : 0), y: QY, z: QZ + 1.4 + (k % 2) * 0.8, yaw: Math.PI + (k - 2) * 0.1, visible: !ex }); });
    // ---------- fish flying out of the market ----------
    FISH.forEach((fi, k) => { const t0 = F.THROUGH - 4 + (k % 5) * 2, t = (f - t0) / 30; fi.visible = t > 0 && t < 1.4 && !ex; if (!fi.visible) return; fi.position.set(MKT[0] + 1 + (hash(k) - 0.5) * 3 + t * (hash(k + 1) - 0.3) * 5, 0.8 + 7 * t - 9.8 * t * t * 0.5 * 1.4, MKT[1] + (hash(k + 2) - 0.5) * 3 + t * 2); fi.rotation.set(t * 8 + k, k, t * 5); });
    // ---------- explainer graphics ----------
    const xr = ex; WATER.material.opacity = xr ? 0.4 : 0.82;
    const bwp = (lp) => BJ.roll.localToWorld(new THREE.Vector3(...lp));
    const showA = (a, on, pos, dir, s = 1) => { a.visible = on; if (!on) return; a.position.copy(pos); a.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...dir).normalize()); a.scale.setScalar(s * (1 + 0.06 * Math.sin(f * 0.4))); };
    BJ.roll.updateMatrixWorld(true);
    showA(ARR.wind, xr && f >= F.SHOVES - 4 && f < F.HEAVY - 10, bwp([0, 3.2, 0]).add(new THREE.Vector3(0, 0, 3.2)), [0, 0, -1]);
    showA(ARR.water, xr && f >= F.BACK - 4 && f < F.HEAVY - 10, bwp([0, -1.0, -0.2]).add(new THREE.Vector3(0, 0, -2.0)), [0, 0, 1]);
    showA(ARR.fwd, xr && f >= F.FORWARD - 4 && f < F.HEAVY - 10, bwp([0, 1.2, 2.8]), [1, 0, 0]);
    showA(ARR.wt, xr && f >= F.HEAVY - 4, bwp([0, -1.6, -0.2]), [0, -1, 0]);
    BJ.keel.children.forEach((m) => { if (m.isMesh && m.material && m.material.emissive) m.material.emissive.setRGB(xr && f >= F.KEEL2 - 4 ? 0.1 : 0, xr && f >= F.KEEL2 - 4 ? 0.6 + 0.3 * Math.sin(f * 0.3) : 0, xr && f >= F.KEEL2 - 4 ? 0.8 : 0); });
    TOY.visible = xr && f >= F.TOYW - 8; TOY.position.set(jb.x + 4.5, 0.4 + 0.0, jb.z + 2.5); TOY.rotation.set(0, 0, 0.6 * Math.exp(-Math.max(0, f - F.KNOCKED) / 22) * Math.cos(Math.max(0, f - F.KNOCKED) * 0.25) * (f >= F.KNOCKED - 2 ? 1 : 0));
    WINDT.forEach((w, j) => w.show(f >= F.SIDE - 6 && f < 945 ? sm(F.SIDE - 6 + j * 3, F.SIDE + 14 + j * 3, f) : 0));
    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const body = (x, z, y = 0, h = 2.1) => [[x, y, z], [x, y + h, z]];
    const BFP = (m = 3) => [[fb.x - m, fb.y - 0.4, fb.z - m], [fb.x + m, fb.y + (fb.roll > 1 ? 1.5 : 6.5), fb.z + m]];
    const BJP = (m = 3) => [[jb.x - m, jb.y - 0.4, jb.z - m], [jb.x + m, jb.y + 6.5, jb.z + m]];
    if (sh(0, 60)) {                          // 1. hook: Fitz crosses the finish backwards on his upside-down boat; gate, crowd, June's boat (wide)
      cam = K.fit([[fb.x - 2.5, -0.3, fb.z - 1.5], [fb.x + 2.5, 0.3, fb.z + 1.5], ...body(fp.x, fp.z, fp.y), [0, 3.4, 0]], { yaw: 160, pitch: 8, fov: 42, margin: 0.85, maxDist: 10 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(60, 124)) {                 // 2. sitting on his upside-down boat (wide low from the water, crowd behind on the quay)
      cam = K.fit([...BFP(2.2), [-10, QY + 2, QZ + 1.4], [-2, QY + 2, QZ + 1.4]], { yaw: -80, pitch: 4, fov: 44, margin: 0.85, maxDist: 14 }); cam.fov *= K.punch(f, F.UPSIDE, 0.1, 6);
    } else if (sh(124, 182)) {                // 3. that morning: Fitz saws off the keel (wide, trailer on the quay)
      cam = K.fit([[TRF[0] - 1.5, QY, TRF[1] - 3], [TRF[0] + 1.5, QY + 8.5, TRF[1] + 3], ...body(fp.x, fp.z, QY)], { yaw: -70, pitch: 6, fov: 42, margin: 0.88, maxDist: 13 }); cam.fov *= K.punch(f, F.KEEL1, 0.12, 6);
    } else if (sh(182, 224)) {                // 4. "Less boat, more speed!" (Fitz reaction close)
      cam = { pos: [fp.x + 0.4, QY + 1.9, fp.z - 2.7], look: [fp.x, QY + 1.6, fp.z], fov: 40 * K.push(u, 0.06) }; dof = { focus: 2.8, cinf: 12 };
    } else if (sh(224, 268)) {                // 5. so why do sailboats have keels? Both boats on trailers (wide)
      cam = K.fit([[TRF[0] - 1.5, QY, TRF[1] - 3], [TRJ[0] + 1.5, QY + 8.5, TRJ[1] + 3]], { yaw: -90, pitch: 8, fov: 44, margin: 0.85, maxDist: 15 }); cam.fov *= K.punch(f, F.WHY, 0.06, 6);
    } else if (sh(268, 338)) {                // 6. the keel on his wall like a moose head (wide)
      cam = K.fit([[-32, QY, 20], [-28, QY + 5, 20], ...body(fp.x, fp.z, QY)], { yaw: -80, pitch: 6, fov: 42, margin: 0.9, maxDist: 10 }); cam.fov *= K.punch(f, F.MOOSE, 0.1, 6);
    } else if (sh(338, 400)) {                // 7. he points at Nana June's boat (wide, both)
      cam = K.fit([...body(fp.x, fp.z, QY), ...body(TRJ[0] - 0.9, TRJ[1] + 1.4, QY), [TRJ[0], QY + 8.5, TRJ[1]]], { yaw: -60, pitch: 8, fov: 42, margin: 0.9, maxDist: 13 }); cam.fov *= K.punch(f, F.POINTED, 0.06, 6);
    } else if (sh(400, 465)) {                // 8. "wearing a shark costume!" — June's keel with a shark face (insert-wide)
      cam = K.fit([[TRJ[0] - 1, QY + 1.0, TRJ[1]], [TRJ[0] + 1, QY + 2.6, TRJ[1]], ...body(TRJ[0] - 0.9, TRJ[1] + 1.4, QY)], { yaw: 75, pitch: 2, fov: 42, margin: 0.95, maxDist: 5 }); cam.fov *= K.punch(f, F.SHARK, 0.12, 6);
    } else if (sh(465, 520)) {                // 9. June doesn't answer (June deadpan, wide-ish)
      cam = { pos: [TRJ[0] - 0.9 - 0.9, QY + 1.8, TRJ[1] + 1.4 + 2.6], look: [TRJ[0] - 0.9, QY + 1.5, TRJ[1] + 1.4], fov: 40 * K.push(u, 0.06) }; dof = { focus: 2.7, cinf: 12 }; cam.fov *= K.punch(f, F.ANSWER, 0.06, 6);
    } else if (sh(520, 593)) {                // 10. Truffle came for one thing: a suntan (reaction close on the deck)
      cam = { pos: [tp.x + 0.8, tp.y + 2.0, tp.z + 3.4], look: [tp.x, tp.y + 0.3, tp.z], fov: 40 * K.push(u, 0.07) }; dof = { focus: 2.6, cinf: 12 };
    } else if (sh(593, 650)) {                // 11. leg one: wind from behind (tracking wide, both boats)
      cam = K.fit([...BFP(2.5), ...BJP(2.5)], { yaw: -150, pitch: 12, fov: 46, margin: 0.85, maxDist: 16 });
    } else if (sh(650, 722)) {                // 12. Fitz shoots ahead like toast out of a toaster (wide side)
      cam = K.fit([...BFP(2.5), ...BJP(1)], { yaw: -90, pitch: 8, fov: 46, margin: 0.85, maxDist: 18 }); cam.fov *= K.punch(f, F.TOAST, 0.1, 6);
    } else if (sh(722, 798)) {                // 13. "Less boat, more speed!" waving his hat (whole boat, front quarter)
      cam = K.fit([...BFP(2.2)], { yaw: -30, pitch: 6, fov: 42, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.HAT, 0.08, 6);
    } else if (sh(798, 870)) {                // 14. leg two: the wind blows from the side (high wide, wind lines)
      cam = K.fit([...BJP(2), ...BFP(2), [BUOY_A[0] - 12, 2, BUOY_A[1] - 6]], { yaw: 70, pitch: 30, fov: 46, margin: 0.85, maxDist: 18 }); cam.fov *= K.punch(f, F.SIDE, 0.06, 6);
    } else if (sh(870, 945)) {                // 15. June sails straight, like on rails (tracking)
      const tc = K.track(f, (g) => { const u2 = clamp((g - 803) / 465, 0, 1); return [lerp(24, 24.5, u2), 0, lerp(1.0, -17, u2 / 0.55)]; }, { off: [-9, 3.5, 4], lag: 6, lookY: 2.4 }); cam = { ...tc, fov: 46 }; cam.fov *= K.punch(f, F.RAILS, 0.08, 6);
    } else if (sh(945, 1003)) {               // 16. Fitz slides sideways like a hockey puck (wide)
      cam = K.fit([...BFP(2.5), [MKT[0] + 2, 2.7, MKT[1] - 2]], { yaw: -40, pitch: 14, fov: 46, margin: 0.85, maxDist: 16 }); cam.fov *= K.punch(f, F.PUCK, 0.1, 6);
    } else if (sh(1003, 1062)) {              // 17. right through the fish market (wide, fish flying)
      cam = K.fit([[MKT[0] - 2, 0, MKT[1] - 4], [MKT[0] + 5, 4.5, MKT[1] + 4], ...BFP(1.5)], { yaw: -20, pitch: 10, fov: 46, margin: 0.85, maxDist: 15 }); cam.fov *= K.punch(f, F.MARKET, 0.12, 6); const s = K.shake(f, F.THROUGH, 0.07, 12); cam.pos[1] += s[1];
    } else if (sh(1062, 1112)) {              // 18. leg three: a gust hits him (wide)
      cam = K.fit([...BFP(3), [fb.x, 6.5, fb.z]], { yaw: 20, pitch: 8, fov: 44, margin: 0.85, maxDist: 13 }); cam.fov *= K.punch(f, F.GUST, 0.06, 6);
    } else if (sh(1112, 1150)) {              // 19. flipped like a pancake (low wide, impact)
      cam = K.fit([...BFP(3)], { yaw: 70, pitch: 2, fov: 44, margin: 0.9, maxDist: 12 }); cam.fov *= K.punch(f, F.PANCAKE, 0.14, 6); const s = K.shake(f, F.FLIPPED + 8, 0.08, 12); cam.pos[1] += s[1];
    } else if (sh(1150, 1210)) {              // 20. the wind pushes him all the way back (tracking, stern first)
      cam = K.fit([[fb.x - 2.5, -0.3, fb.z - 1.5], [fb.x + 2.5, 2.4, fb.z + 1.5]], { yaw: -60, pitch: 10, fov: 44, margin: 0.9, maxDist: 10 });
    } else if (sh(1210, 1268)) {              // 21. ...to the start, which was also the finish (wide gate, crowd)
      cam = K.fit([...BFP(2), [0, 3.4, -4], [0, 3.4, 4], [-8, QY + 2, QZ + 1.4]], { yaw: 100, pitch: 10, fov: 46, margin: 0.85, maxDist: 14 }); cam.fov *= K.punch(f, F.FINISH2, 0.1, 6);
    } else if (sh(1268, 1320)) {              // 22. x-ray: what was June's shark costume doing? (underwater, wide)
      cam = K.fit([...BJP(2), [jb.x, -2.0, jb.z]], { yaw: 90, pitch: -4, fov: 44, margin: 0.85, maxDist: 12 });
    } else if (sh(1320, 1386)) {              // 23. a keel is a big flat fin under the boat (low, at the waterline)
      cam = K.fit([[jb.x - 2.8, -2.0, jb.z], [jb.x + 2.8, 2.0, jb.z]], { yaw: 75, pitch: -8, fov: 40, margin: 0.85, maxDist: 9 }); cam.fov *= K.punch(f, F.FIN, 0.1, 6);
    } else if (sh(1386, 1460)) {              // 24. wind shoves sideways, water shoves back (from the bow, end-on)
      cam = K.fit([[jb.x, -2.2, jb.z - 3.5], [jb.x, 6.5, jb.z + 3.5]], { yaw: 10, pitch: 6, fov: 44, margin: 0.85, maxDist: 13 }); cam.fov *= K.punch(f, F.BACK, 0.08, 6);
    } else if (sh(1460, 1548)) {              // 25. so the boat slides forward instead (3/4 wide)
      cam = K.fit([...BJP(3), [jb.x + 4, 1, jb.z], [jb.x, -2, jb.z]], { yaw: 50, pitch: 12, fov: 44, margin: 0.85, maxDist: 14 }); cam.fov *= K.punch(f, F.FORWARD, 0.1, 6);
    } else if (sh(1548, 1612)) {              // 26. the heavy bottom pulls it upright (end-on, the boat rocks back)
      cam = K.fit([[jb.x, -2.2, jb.z - 3], [jb.x, 6.5, jb.z + 3]], { yaw: -10, pitch: 4, fov: 44, margin: 0.85, maxDist: 13 }); cam.fov *= K.punch(f, F.UPRIGHT, 0.08, 6);
    } else if (sh(1612, 1680)) {              // 27. like a toy that won't stay knocked down (wide on the toy + boat)
      cam = K.fit([[jb.x + 4.5 - 1.2, 0, jb.z + 2.5 - 1.2], [jb.x + 4.5 + 1.2, 2.0, jb.z + 2.5 + 1.2], [jb.x, 3, jb.z]], { yaw: 80, pitch: 8, fov: 42, margin: 0.9, maxDist: 10 }); cam.fov *= K.punch(f, F.KNOCKED, 0.12, 6);
    } else if (sh(1680, 1736)) {              // 28. June won by a mile (wide: June with the trophy, the gate, Fitz upside down)
      cam = K.fit([...BJP(2), ...BFP(1.5), [0, 3.4, -4]], { yaw: 60, pitch: 8, fov: 44, margin: 0.85, maxDist: 14 }); cam.fov *= K.punch(f, F.MILE, 0.08, 6);
    } else if (sh(1736, 1790)) {              // 29. Truffle's tan, sunglasses and all (reaction close)
      { const d = [Math.sin(tp.yaw), Math.cos(tp.yaw)]; cam = { pos: [tp.x + d[0] * 2.8 + d[1] * 0.8, tp.y + 1.2, tp.z + d[1] * 2.8 - d[0] * 0.8], look: [tp.x, tp.y + 0.4, tp.z], fov: 40 * K.push(u, 0.06) }; dof = { focus: 3.0, cinf: 12 }; }
    } else {                                  // 30. Fitz's new motto on the quay; the whole harbor behind (wide pull-back)
      cam = K.fit([...body(fp.x, fp.z, QY), [jb.x - 1, 0, jb.z], [jb.x + 1, 4, jb.z], [fp.x + 0.5, QY + 2.6, fp.z]], { yaw: lerp(-70, -78, u), pitch: 8, fov: 44, margin: 0.85, maxDist: 12 }); cam.fov *= K.punch(f, F.LESS3, 0.1, 6);
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- water (CPU waves on a grid that follows the camera) ----------
    const t = f / 30, cx = Math.round(cam.look[0] / 0.73) * 0.73, cz = Math.round((cam.look[2] - 8) / 0.75) * 0.75;
    WATER.position.set(cx, 0, cz); const pos = WATER.geometry.attributes.position.array;
    for (let k = 0; k < pos.length; k += 3) { const x = WBASE[k] + cx, z = WBASE[k + 2] + cz; pos[k + 1] = 0.08 * Math.sin(0.45 * x + 1.3 * t) + 0.06 * Math.sin(0.31 * z - 0.18 * x + 0.9 * t) + 0.03 * Math.sin(1.1 * x + 0.7 * z + 2.1 * t) - (z > QZ - 0.2 ? 3 : 0); }
    WATER.geometry.attributes.position.needsUpdate = true; WATER.geometry.computeVertexNormals();
    // ---------- effects + graphics ----------
    if (f >= 124 && f < F.KEEL1 + 6) K.sparks(f, 124, F.KEEL1 + 6, [TRF[0], QY + 1.4, TRF[1] + 0.5], { dir: [0, 0.5, 1], spread: 1, rate: 18, speed: 3, life: 14, color: '#ffd23a', seed: 2 });
    if (f >= F.KEEL1 + 10 && f < F.KEEL1 + 34) K.puff(f, F.KEEL1 + 12, TRF[0], TRF[1] - 0.2, 10, 0.6);
    if (race && f >= 593 && f < 1268) { K.sparks(f, 593, 1268, () => [fb.x - Math.sin(fb.yaw) * 2.2, 0.1, fb.z - Math.cos(fb.yaw) * 2.2], { dir: [-Math.sin(fb.yaw), 0.6, -Math.cos(fb.yaw)], spread: 0.6, rate: 10, speed: 2, life: 18, color: '#e8f4ff', seed: 5 }); }
    if (f >= F.FLIPPED && f < F.FLIPPED + 30) K.sparks(f, F.FLIPPED, F.FLIPPED + 30, [fb.x, 0.2, fb.z], { dir: [0, 1, 0], spread: 1.6, rate: 30, speed: 5, life: 24, color: '#e8f4ff', seed: 8 });
    if (f >= F.THROUGH - 4 && f < F.THROUGH + 30) K.sparks(f, F.THROUGH - 4, F.THROUGH + 30, [MKT[0] + 1, 0.5, MKT[1] + 0.5], { dir: [0, 1, 0.3], spread: 1.4, rate: 26, speed: 5, life: 22, color: '#e8f4ff', seed: 9 });
    K.mist(f, 585, 16); K.mist(f, 1260, 16); K.mist(f, 1672, 16);
    if (f >= 593 && f < 1268) K.hud(f, 593, { stages: 3, labels: ['LEG 1', 'LEG 2', 'LEG 3'], u: f < 803 ? 0.05 + 0.28 * (f - 593) / 210 : f < 1065 ? 0.34 + 0.32 * (f - 803) / 262 : 0.67 + 0.32 * (f - 1065) / 203, rival: f < 803 ? 0.12 + 0.2 * (f - 593) / 210 : f < 1065 ? 0.34 + 0.2 * (f - 803) / 262 : 0.55, f1: 1264 });
    const BY = f >= 593 && f < 1268 ? 0.25 : 0.2;
    K.badge(f, F.BACKW, 'WRONG WAY ROUND', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 120 });
    K.badge(f, F.KEEL1, 'KEEL: SAWED OFF', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 214 });
    K.badge(f, F.WHY, 'WHY A KEEL?', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 266 });
    K.badge(f, F.SHOT, 'LEG 1: FITZ AHEAD', { sx: 0.5, sy: BY }, { icon: 'down', f1: 798 });
    K.badge(f, F.SIDEWAYS, 'LEG 2: SIDEWAYS', { sx: 0.5, sy: BY }, { icon: 'x', f1: 1060 });
    K.badge(f, F.FLIPPED, 'LEG 3: FLIPPED', { sx: 0.5, sy: BY }, { icon: 'x', f1: 1262 });
    K.badge(f, F.FIN, 'KEEL = BIG FIN', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1384 });
    K.badge(f, F.FORWARD, 'SIDEWAYS → FORWARD', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1546 });
    K.badge(f, F.UPRIGHT, 'HEAVY BOTTOM = UPRIGHT', { sx: 0.5, sy: 0.2 }, { icon: 'weight', f1: 1676 });
    K.badge(f, F.MOTTO + 6, 'MORE BOAT. LESS SWIMMING.', { sx: 0.5, sy: 0.2 }, { style: 'stamp', size: 1.0 });
    K.badge(f, F.MILE, 'JUNE WINS', { sx: 0.5, sy: 0.2 }, { style: 'stamp', size: 1.1, f1: 1786 });
    const L = K.light('golden', { az: 230, el: 36, shadowExt: 26, exposure: 1.18 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
