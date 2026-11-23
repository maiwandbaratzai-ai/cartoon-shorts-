// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Coins Have Ridges" — invented story, engine: The Heist (SCRIPTS.md §000).
// The Whisker brothers give the king's gold coins a "haircut" every night, hide the dust in a PICKLES jar; coins shrink,
// the king's face loses crown/ears/nose, his bigger-coin fix fails (bigger files, star plates) -> Mina's edge lines
// make every shave a bald spot -> the baker blows the whistle -> the brothers now shear the royal sheep.
import { TOTAL, LINES, wf } from './coinshave_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
let HOLOC;
let THREE, WALLY, WES, KING, MINA, BAKER, GUARD1, GUARD2, CUST, CAT, SHEEP = [], HERO, VISE_COIN, JAR, BIGCOIN, STARS = [], PRESS, REEDCOIN, CAKE, BIGFILE, EXTRAS = [], CMATS = [];
let F = {};
const MK = 100, MT = 200, MO = 300;              // market, mint, moat (x offsets); workshop at 0

function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
// the king's face on the coin: stage 0 full, 1 no crown, 2 no ears, 3 no nose
const coinFace = (stage) => (g, w, h) => {
  const gr = g.createRadialGradient(w * 0.4, h * 0.35, 10, w / 2, h / 2, w / 2); gr.addColorStop(0, '#fff0a0'); gr.addColorStop(0.6, '#e8b830'); gr.addColorStop(1, '#a8781a');
  g.fillStyle = gr; g.fillRect(0, 0, w, h); g.strokeStyle = '#8a5a10'; g.lineWidth = 10; g.beginPath(); g.arc(w / 2, h / 2, w * 0.44, 0, 7); g.stroke();
  g.lineWidth = 4; for (let i = 0; i < 60; i++) { const a = i / 60 * 6.283; g.beginPath(); g.arc(w / 2 + Math.cos(a) * w * 0.41, h / 2 + Math.sin(a) * h * 0.41, 4, 0, 7); g.stroke(); }
  g.save(); g.translate(w / 2, h / 2 + 10); g.fillStyle = '#d8a020'; g.strokeStyle = '#7a4a08'; g.lineWidth = 9;
  g.beginPath(); g.ellipse(0, 0, 105, 125, 0, 0, 7); g.fill(); g.stroke();                                                        // head
  g.beginPath(); g.ellipse(-20, 95, 95, 55, 0.2, 0, Math.PI); g.fill(); g.stroke();                                               // beard
  if (stage < 3) { g.beginPath(); g.moveTo(98, -20); g.lineTo(150, 25); g.lineTo(100, 35); g.fill(); g.stroke(); }                // nose
  if (stage < 2) { g.beginPath(); g.ellipse(-40, 10, 26, 40, 0, 0, 7); g.fill(); g.stroke(); }                                    // ear
  g.fillStyle = '#7a4a08'; g.beginPath(); g.ellipse(50, -25, 14, 9, 0, 0, 7); g.fill();                                           // eye
  g.lineWidth = 8; g.beginPath(); g.moveTo(30, 60); g.quadraticCurveTo(70, 70, 100, 55); g.stroke();                              // moustache
  if (stage < 1) { g.fillStyle = '#f2c230'; g.beginPath(); g.moveTo(-90, -105); g.lineTo(-90, -190); g.lineTo(-50, -140); g.lineTo(-5, -200); g.lineTo(40, -140); g.lineTo(80, -190); g.lineTo(85, -105); g.closePath(); g.fill(); g.lineWidth = 9; g.strokeStyle = '#7a4a08'; g.stroke();
    g.fillStyle = '#c0392b'; for (const x of [-50, 0, 45]) { g.beginPath(); g.arc(x, -125, 12, 0, 7); g.fill(); } }
  g.restore(); g.fillStyle = '#7a4a08'; g.font = '900 44px Arial Black, Arial'; g.textAlign = 'center'; g.fillText('BARNABY REX', w / 2, h * 0.9); };

function coin(K, r, th, parent, o = {}) {           // lies flat (axis y); faces with the king; optional edge lines (reeding)
  const g = new THREE.Group(); parent.add(g); const gold = K.gold();
  let body;
  if (o.star) { const sh = new THREE.Shape(); for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2 + Math.PI / 2, rr = k % 2 ? r * 0.55 : r; (k ? sh.lineTo : sh.moveTo).call(sh, Math.cos(a) * rr, Math.sin(a) * rr); } sh.closePath();
    const geo = new THREE.ExtrudeGeometry(sh, { depth: th, bevelEnabled: true, bevelThickness: th * 0.15, bevelSize: r * 0.03, bevelSegments: 2 }); geo.rotateX(-Math.PI / 2); geo.translate(0, -th / 2, 0); body = new THREE.Mesh(geo, gold); }
  else body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, th, 72), gold);
  body.castShadow = true; g.add(body);
  const faces = [];
  for (const s of [1, -1]) { const m = new THREE.Mesh(new THREE.CircleGeometry(o.star ? r * 0.55 : r * 0.97, 64), CMATS[0]); m.rotation.x = -s * Math.PI / 2; m.position.y = s * (th / 2 + (o.star ? th * 0.16 : 0.0015)); g.add(m); faces.push(m); }
  const reeds = [];
  if (o.reed) { const N = o.n || 90, rm = K.paint('#c8901a', { rough: 0.25, metal: 0.9 }); for (let k = 0; k < N; k++) { const a = k / N * Math.PI * 2; const b = new THREE.Mesh(new THREE.BoxGeometry(r * 0.022, th * 0.86, r * 0.035), rm);
      b.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); b.rotation.y = -a; g.add(b); reeds.push({ b, a }); } }
  g.faces = faces; g.reeds = reeds; return g; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { HAIRCUT: wf(0, 'haircut'), SHAVE: wf(1, 'shave'), CAUGHT: wf(1, 'caught'), FORTY: wf(1, 'forty'), MOAT: wf(1, 'moat'), DUST: wf(2, 'dust'), JAR: wf(2, 'jar'), PICK: wf(2, 'pickles'),
      SPRING: wf(3, 'spring'), SHRUNK: wf(3, 'shrunk'), LOAF: wf(3, 'loaf'), TWO: wf(3, 'two'), BUTTON: wf(3, 'button'), CROWN: wf(4, 'crown'), EARS: wf(4, 'ears'), NOSE: wf(4, 'nose'),
      FIX: wf(5, 'fix'), BIG: wf(5, 'big'), BOUGHT: wf(5, 'bought'), FILES: wf(5, 'files'), PLATES: wf(6, 'plates'), STARS: wf(6, 'stars'), CATCH: wf(7, 'catch'), SEE: wf(7, 'see'),
      MINA: wf(8, 'mina'), PRESSED: wf(8, 'pressed'), LINES: wf(8, 'lines'), EDGE: wf(8, 'edge'), SHAVE2: wf(9, 'shave'), VANISH: wf(9, 'vanish'), BALD: wf(9, 'bald'), CAKE: wf(10, 'cake'), SLICE: wf(10, 'slice'), NOTICES: wf(10, 'notices'),
      FELT: wf(11, 'felt'), WHISTLE: wf(11, 'whistle'), HAIRCUTS: wf(12, 'haircuts'), SHEEP: wf(12, 'sheep') };
    CMATS = [0, 1, 2, 3].map((st) => (() => { const t = canvasTex(512, 512, coinFace(st)); return new THREE.MeshStandardMaterial({ map: t, emissiveMap: t, emissive: '#ffffff', emissiveIntensity: 0.22, roughness: 0.28, metalness: 0.7, envMapIntensity: 1.4 }); })());
    const gold = K.gold(), chrome = K.chrome(), iron = K.paint('#3a3c44', { rough: 0.4, metal: 0.5 }), wood = K.mat('wood', '#8a5a34', { detail: 0.5 }), dwood = K.mat('wood', '#5a3a24', { detail: 0.5 });
    const glow = (c, k = 2) => new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(k) });
    // ================= the workshop (attic, night) =================
    const WG = K.group();
    K.slab(-4, 4, -0.1, 0, -3, 3.5, K.mat('wood', '#7a5234', { detail: 0.4 }), WG, false);
    K.slab(-4, 0.5, 0, 3.2, -3.15, -3, K.mat('wood', '#6a4a30', { detail: 0.6 }), WG); K.slab(2.0, 4, 0, 3.2, -3.15, -3, K.mat('wood', '#6a4a30', { detail: 0.6 }), WG);
    K.slab(0.5, 2.0, 0, 1.2, -3.15, -3, K.mat('wood', '#6a4a30', { detail: 0.6 }), WG); K.slab(0.5, 2.0, 2.3, 3.2, -3.15, -3, K.mat('wood', '#6a4a30', { detail: 0.6 }), WG);
    for (const [x0, x1, y0, y1] of [[0.45, 2.05, 1.15, 1.22], [0.45, 2.05, 2.28, 2.35], [0.45, 0.52, 1.15, 2.35], [1.98, 2.05, 1.15, 2.35], [1.22, 1.28, 1.15, 2.35]]) K.slab(x0, x1, y0, y1, -3.05, -2.95, dwood, WG);
    K.slab(-4.15, -4, 0, 3.2, -3, 3.5, K.mat('wood', '#6a4a30', { detail: 0.6 }), WG);
    for (let k = 0; k < 5; k++) K.slab(-4, 4, 3.0 + 0.0, 3.2, -3 + k * 1.5, -2.8 + k * 1.5, dwood, WG);                                       // ceiling beams
    // outside the window: night street, a lit house opposite
    K.slab(-6, 8, -0.1, 0, -9, -3.2, K.mat('rock', '#4a4a52', { detail: 0.5 }), WG, false);
    const hs = S.building({ w: 7, d: 4, floors: 3, seed: 5, gable: 'step', kind: 'brick', color: '#8a4a3a' }); hs.position.set(1.3, -3.4, -8.5);
    // workbench with vise, coins, candles, tools, the PICKLES jar
    K.rbox(2.6, 0.1, 1.0, 0.03, wood, 0, 0.92, -1.6, WG); for (const x of [-1.2, 1.2]) for (const z of [-2.0, -1.2]) K.cyl(0.05, 0.05, 0.9, dwood, x, 0, z, WG, 8);
    K.rbox(0.25, 0.14, 0.18, 0.03, iron, 0.0, 1.04, -1.45, WG); K.rbox(0.06, 0.18, 0.2, 0.02, iron, -0.07, 1.16, -1.45, WG); K.rbox(0.06, 0.18, 0.2, 0.02, iron, 0.07, 1.16, -1.45, WG);
    const hdl = K.cyl(0.012, 0.012, 0.36, chrome, 0.17, 1.0, -1.45, WG, 8); hdl.rotation.z = Math.PI / 2;
    for (let k = 0; k < 7; k++) { const st = new THREE.Group(); st.position.set(-0.95 + (k % 4) * 0.13, 0.97, -1.85 + Math.floor(k / 4) * 0.16); WG.add(st); const n = 3 + (k * 3) % 6; for (let j = 0; j < n; j++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.012, 24), gold); c.position.set((hash(k * 9 + j) - 0.5) * 0.01, j * 0.013, 0); st.add(c); } }
    const sack = K.add(new THREE.SphereGeometry(0.35, 16, 12), K.mat('fabric', '#b8925a'), -3.2, 0.3, 2.2, WG); sack.scale.set(1, 0.85, 1); const sack2 = K.add(new THREE.SphereGeometry(0.3, 16, 12), K.mat('fabric', '#a8825a'), -3.0, 0.26, 1.4, WG);
    const lbl = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.2), S.textMat('NOT GOLD', { bg: '#e8d8b0', fg: '#3a2418', w: 256, h: 128 })); lbl.position.set(-2.95, 0.38, 2.5); lbl.rotation.y = 0.6; WG.add(lbl);
    K.cyl(0.35, 0.3, 0.95, K.mat('wood', '#7a4a2a'), -3.3, 0, -2.4, WG, 16); for (const y of [0.15, 0.8]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.02, 6, 24), iron); ring.rotation.x = Math.PI / 2; ring.position.set(-3.3, y, -2.4); WG.add(ring); }
    K.rbox(1.8, 0.05, 0.3, 0.02, wood, -3.85, 1.7, 0.5, WG).rotation.y = Math.PI / 2; for (let k = 0; k < 5; k++) { const j = K.cyl(0.07, 0.07, 0.22, K.glass({ color: ['#a8d878', '#f2c230', '#c0392b'][k % 3], opacity: 0.6 }), -3.85, 1.73, -0.2 + k * 0.32, WG, 14); }
    for (let k = 0; k < 4; k++) { const t = K.rbox(0.04, 0.5, 0.04, 0.01, iron, -3.95, 2.1, -1.5 + k * 0.3, WG); }
    const rug = K.slab(-1.8, 1.8, 0, 0.015, -0.6, 1.6, K.mat('fabric', '#8a2a2a', { detail: 0.3 }), WG, false);
    const wpos = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.5), S.textMat('WANTED|COIN BARBERS', { bg: '#f0e0b8', fg: '#3a2418', w: 256, h: 160 })); wpos.position.set(-1.6, 1.9, -2.98); WG.add(wpos);
    for (const [x, z] of [[-0.9, -1.55], [0.85, -1.9], [-3.3, -2.4]]) { const y = x === -3.3 ? 0.95 : 0.97; K.cyl(0.04, 0.045, 0.18, K.paint('#f4ecd8', { rough: 0.6 }), x, y, z, WG, 12); const fl = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), glow('#ffb84a', 2.5)); fl.scale.y = 1.7; fl.position.set(x, y + 0.24, z); fl.userData.ndSkip = true; WG.add(fl); }
    S.bake(WG);
    K.lamp(-0.9, 1.25, -1.4, { color: '#ffb060', intensity: 3.4, distance: 7 }); K.lamp(0.9, 1.25, -1.7, { color: '#ffb060', intensity: 2.6, distance: 6 });
    JAR = new THREE.Group(); JAR.position.set(0.75, 0.97, -1.45); sc.add(JAR);
    const jg = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.36, 28, 1, true), K.glass({ color: '#e8f8e0', opacity: 0.15 })); jg.position.y = 0.18; JAR.add(jg);
    JAR.fill = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1, 28), K.paint('#f2c230', { rough: 0.6, metal: 0.6 })); JAR.add(JAR.fill);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.05, 28), K.paint('#c0392b', { rough: 0.4 })); lid.position.set(0.25, 0.025, 0.1); JAR.add(lid);
    const jl = new THREE.Mesh(new THREE.CylinderGeometry(0.133, 0.133, 0.14, 28, 1, true, -0.9, 1.8), new THREE.MeshStandardMaterial({ map: canvasTex(512, 160, (g, w, h) => { g.fillStyle = '#f4ecd0'; g.fillRect(0, 0, w, h); g.fillStyle = '#2a7a3a'; g.font = '900 96px Arial Black, Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('PICKLES', w / 2, h / 2 + 4); }), roughness: 0.7 }));
    jl.position.y = 0.18; JAR.add(jl);
    VISE_COIN = coin(K, 0.09, 0.016, sc); VISE_COIN.position.set(0, 1.37, -1.45); VISE_COIN.rotation.x = Math.PI / 2;
    CAT = K.animal('cat', { color: '#e08a3a', seed: 3 });
    // ================= the market (day) =================
    const MG = K.group();
    K.slab(MK - 40, MK + 40, -0.1, 0, -14, 14, K.mat('rock', '#a89a88', { detail: 0.45 }), MG, false);
    K.slab(MK - 40, MK + 40, 0, 0.02, -2.2, 2.2, K.mat('rock', '#8a7e70', { detail: 0.3 }), MG, false);
    let x = MK - 32, i = 0; while (x < MK + 32) { const w = 4.5 + (i * 7 % 3); const b = S.building({ w, d: 7, floors: 2 + (i % 2), seed: i + 11, gable: ['step', 'bell', 'pitched'][i % 3], kind: i % 3 === 1 ? 'plaster' : 'brick', shop: [null, 'CHEESE', null, 'CANDLES', null, 'HATS', null, 'BOOTS'][i % 8], shutters: i % 2 ? '#2a5a3a' : '#7a2a2a', flowers: i % 2 === 0 }); b.position.set(x + w / 2, 0, -8); x += w + 0.05; i++; }
    x = MK - 32; i = 30; while (x < MK + 32) { const w = 4.5 + (i * 5 % 3); const b = S.building({ w, d: 7, floors: 2 + (i % 2), seed: i + 11, gable: ['bell', 'step', 'pitched'][i % 3], kind: 'brick', shop: [null, 'TAILOR', null, 'BOOKS'][i % 4], flowers: true }); b.position.set(x + w / 2, 0, 8); b.rotation.y = Math.PI; x += w + 0.05; i++; }
    // the bakery stall (counter, awning, loaves, sign), the cake, the king's podium with banners + decree board
    const BS = new THREE.Group(); BS.position.set(MK, 0, -4.4); MG.add(BS);
    K.rbox(3.2, 1.0, 0.9, 0.05, wood, 0, 0.5, 0, BS); K.rbox(3.3, 0.06, 1.0, 0.02, K.mat('wood', '#c8a070'), 0, 1.02, 0, BS);
    for (const x2 of [-1.55, 1.55]) K.cyl(0.05, 0.05, 2.6, dwood, x2, 0, 0.4, BS, 8);
    for (let k = 0; k < 8; k++) K.slab(-1.7 + k * 0.425, -1.275 + k * 0.425, 2.55, 2.62, -0.5, 0.9, K.mat('fabric', k % 2 ? '#f4efe4' : '#c0392b'), BS);
    const bsign = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.4), S.textMat('BAKERY', { bg: '#3a2418', fg: '#f2c230', w: 512, h: 128, border: false })); bsign.position.set(0, 2.3, 0.92); BS.add(bsign);
    const bread = K.mat('grime', '#c8843a', { amt: 0.3 }); for (let k = 0; k < 9; k++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10), bread); l.scale.set(1.6, 0.8, 0.9); l.position.set(-1.3 + (k % 5) * 0.32, 1.12 + Math.floor(k / 5) * 0.1, -0.2 + Math.floor(k / 5) * 0.2); BS.add(l); }
    const pr = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.3), S.textMat('LOAF: 2 COINS', { bg: '#f4ecd0', fg: '#c0392b', w: 256, h: 128 })); pr.position.set(-0.9, 0.85, 0.46); BS.add(pr);
    // birthday cake on the right end of the counter (one slice missing)
    CAKE = new THREE.Group(); CAKE.position.set(1.05, 1.05, 0.05); BS.add(CAKE); const cm = K.paint('#f8e8f0', { rough: 0.5 }), sp = K.paint('#f4c8d8', { rough: 0.6 }), ins = K.paint('#e8c890', { rough: 0.7 });
    for (const [r, y, h] of [[0.32, 0, 0.2], [0.22, 0.2, 0.16]]) { const t = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 40, 1, false, 0.6, Math.PI * 2 - 0.9), cm); t.position.y = y + h / 2; CAKE.add(t);
      for (const a of [0.6, 0.6 + Math.PI * 2 - 0.9]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(r, h), ins); p.position.set(Math.sin(a) * r / 2, y + h / 2, Math.cos(a) * r / 2); p.rotation.y = a - Math.PI / 2; p.material.side = THREE.DoubleSide; CAKE.add(p); } }
    for (let k = 0; k < 5; k++) { const a = 1.2 + k * 1.0; K.cyl(0.012, 0.012, 0.1, K.paint(['#2a9ab8', '#f2c230', '#c0392b'][k % 3]), Math.sin(a) * 0.14, 0.36, Math.cos(a) * 0.14, CAKE, 6); const fl = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 6), glow('#ffb84a', 2.4)); fl.position.set(Math.sin(a) * 0.14, 0.48, Math.cos(a) * 0.14); fl.userData.ndSkip = true; CAKE.add(fl); }
    const PD = new THREE.Group(); PD.position.set(MK + 6.5, 0, -4.6); MG.add(PD);
    for (let k = 0; k < 3; k++) K.rbox(2.6 - k * 0.4, 0.25, 1.8 - k * 0.3, 0.04, K.mat('rock', '#c8bca8', { detail: 0.4 }), 0, 0.125 + k * 0.25, -k * 0.1, PD);
    K.rbox(0.8, 0.02, 1.6, 0.01, K.mat('fabric', '#a8202a'), 0, 0.76, 0.0, PD);
    for (const x2 of [-1.6, 1.6]) { K.cyl(0.05, 0.05, 3.4, gold, x2, 0, -0.6, PD, 10); const bn = K.slab(x2 - 0.35, x2 + 0.35, 1.6, 3.2, -0.62, -0.58, K.mat('fabric', '#a8202a'), PD); const cr = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), S.textMat('B', { bg: '#a8202a', fg: '#f2c230', w: 128, h: 128, border: false })); cr.position.set(x2, 2.5, -0.57); PD.add(cr); }
    const dec = S.board('BY ORDER OF THE KING|ALL COINS: TWICE AS BIG!', 2.6, 1.3, { frame: '#a8202a' }); dec.position.set(MK + 3.6, 0, -4.0); dec.rotation.y = 0.15;
    for (let k = 0; k < 4; k++) { const st = new THREE.Group(); st.position.set(MK - 8 + k * 4.5 - (k > 1 ? -9 : 0), 0, k % 2 ? 4.6 : -4.8); if (k % 2) st.rotation.y = Math.PI; MG.add(st);
      K.rbox(2.2, 0.9, 0.8, 0.04, wood, 0, 0.45, 0, st); for (let j = 0; j < 6; j++) K.slab(-1.1 + j * 0.37, -0.73 + j * 0.37, 2.2, 2.26, -0.4, 0.7, K.mat('fabric', j % 2 ? '#f4efe4' : ['#2a7a4a', '#2a62c8', '#e0a020', '#7a4a9a'][k]), st);
      for (const x2 of [-1.05, 1.05]) K.cyl(0.04, 0.04, 2.25, dwood, x2, 0, 0.35, st, 8);
      for (let j = 0; j < 6; j++) { const fr = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), K.paint(['#e8402a', '#f2a020', '#7ac03a', '#f2d030'][(j + k) % 4], { rough: 0.5 })); fr.position.set(-0.8 + j * 0.3, 0.98, (j % 2) * 0.15); st.add(fr); } }
    for (const [lx, lz] of [[MK - 12, -3.0], [MK + 12, 3.0], [MK - 3, 3.0]]) { const l = S.streetLamp(); l.position.set(lx, 0, lz); }
    for (const [bx, bz] of [[MK - 5, 3.2], [MK + 9, -3.4]]) { const b = S.bench(); b.position.set(bx, 0, bz); b.rotation.y = bz > 0 ? Math.PI : 0; }
    for (let k = 0; k < 6; k++) { const t = S.planter(); t.position.set(MK - 15 + k * 6, 0, k % 2 ? 3.6 : -3.4); }
    S.bake(MG);
    BIGCOIN = coin(K, 0.5, 0.07, sc); STARS = [0, 1, 2, 3, 4].map(() => coin(K, 0.32, 0.05, sc, { star: true }));
    BIGFILE = new THREE.Group(); sc.add(BIGFILE); K.rbox(0.18, 2.4, 0.06, 0.02, K.paint('#8a8c94', { rough: 0.35, metal: 0.6 }), 0, 1.2, 0, BIGFILE); for (let k = 0; k < 22; k++) K.rbox(0.19, 0.015, 0.065, 0.005, K.paint('#5a5c64'), 0, 0.3 + k * 0.09, 0, BIGFILE); K.rbox(0.24, 0.5, 0.14, 0.05, wood, 0, -0.2, 0, BIGFILE);
    EXTRAS = S.extras(8, { x0: MK - 14, len: 26, z: 1.2, spread: 2.6, seed: 91, stillShare: 0.3 });
    // ================= the royal mint (interior) =================
    const TG = K.group();
    K.slab(MT - 5, MT + 5, -0.1, 0, -4, 4, K.mat('rock', '#8a7e70', { detail: 0.6 }), TG, false);
    K.slab(MT - 5, MT + 5, 0, 4, -4.2, -4, K.mat('brick', '#9a5a40', { detail: 1.4 }), TG); K.slab(MT - 5.2, MT - 5, 0, 4, -4, 4, K.mat('brick', '#9a5a40', { detail: 1.4 }), TG); K.slab(MT + 5, MT + 5.2, 0, 4, -4, 4, K.mat('brick', '#9a5a40', { detail: 1.4 }), TG);
    for (let k = 0; k < 4; k++) K.slab(MT - 5, MT + 5, 3.6, 3.85, -4 + k * 2.4, -3.75 + k * 2.4, dwood, TG);
    const ms = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.6), S.textMat('ROYAL MINT', { bg: '#a8202a', fg: '#f2c230', w: 1024, h: 256, border: false })); ms.position.set(MT, 3.1, -3.95); TG.add(ms);
    const rule = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.8), S.textMat('RULE 1:|NO HAIRCUTS', { bg: '#f0e0b8', fg: '#3a2418', w: 384, h: 256 })); rule.position.set(MT + 2.6, 1.9, -3.95); TG.add(rule);
    for (let k = 0; k < 3; k++) { const tr = new THREE.Group(); tr.position.set(MT - 2.8 + k * 0.9, 0.95, -1.6); TG.add(tr); }
    K.rbox(3.4, 0.1, 1.0, 0.03, wood, MT - 2.4, 0.92, -1.8, TG); for (const x2 of [-3.9, -0.9]) for (const z of [-2.2, -1.4]) K.cyl(0.05, 0.05, 0.9, dwood, MT + x2 + 0.0, 0, z, TG, 8);
    for (let k = 0; k < 3; k++) { K.rbox(0.8, 0.06, 0.6, 0.02, K.paint('#5a3a24'), MT - 3.4 + k * 1.0, 1.0, -1.8, TG); for (let j = 0; j < 12; j++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.012, 20), gold); c.position.set(MT - 3.7 + k * 1.0 + (j % 4) * 0.12, 1.04, -2.0 + Math.floor(j / 4) * 0.13); TG.add(c); } }
    for (let k = 0; k < 4; k++) { const s2 = K.add(new THREE.SphereGeometry(0.32, 14, 10), K.mat('fabric', '#b8925a'), MT + 3.6 + (k % 2) * 0.5, 0.28, 1.2 + k * 0.6, TG); s2.scale.y = 0.85; }
    K.cyl(0.35, 0.3, 0.95, K.mat('wood', '#7a4a2a'), MT + 4.2, 0, -3.2, TG, 16);
    S.bake(TG);
    K.lamp(MT - 1.5, 2.6, -1.0, { color: '#ffc070', intensity: 3.2, distance: 9 }); K.lamp(MT + 2.0, 2.6, 0.5, { color: '#ffc070', intensity: 2.6, distance: 8 });
    // the screw press (hero machine): iron frame, chrome screw, a cross bar with gold balls, ram that comes down; a ridged collar
    PRESS = new THREE.Group(); PRESS.position.set(MT + 0.6, 0, -2.2); sc.add(PRESS); const pr2 = K.paint('#2a4a6a', { rough: 0.3 });
    K.rbox(1.4, 0.9, 1.0, 0.08, pr2, 0, 0.45, 0, PRESS); for (const x2 of [-0.55, 0.55]) K.rbox(0.18, 1.7, 0.3, 0.05, pr2, x2, 1.75, 0, PRESS); K.rbox(1.5, 0.3, 0.45, 0.08, pr2, 0, 2.7, 0, PRESS);
    for (const x2 of [-0.55, 0.55]) for (const y of [1.0, 2.5]) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 8, 20), gold); r.rotation.x = Math.PI / 2; r.position.set(x2, y, 0); PRESS.add(r); }
    K.rbox(0.5, 0.12, 0.5, 0.03, chrome, 0, 0.96, 0, PRESS); const col = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.03, 10, 40), gold); col.rotation.x = Math.PI / 2; col.position.set(0, 1.04, 0); PRESS.add(col);
    for (let k = 0; k < 24; k++) { const a = k / 24 * Math.PI * 2; const b = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.03, 0.02), chrome); b.position.set(Math.cos(a) * 0.08, 1.04, Math.sin(a) * 0.08); b.rotation.y = -a; PRESS.add(b); }
    PRESS.ram = new THREE.Group(); PRESS.add(PRESS.ram); const scr = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.4, 20), chrome); scr.position.y = 0.7; PRESS.ram.add(scr);
    for (let k = 0; k < 9; k++) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.015, 6, 20), chrome); t.rotation.x = Math.PI / 2; t.position.y = 0.3 + k * 0.12; PRESS.ram.add(t); }
    const bar = K.rbox(2.4, 0.07, 0.07, 0.03, chrome, 0, 1.35, 0, PRESS.ram); for (const x2 of [-1.25, 1.25]) { const bl = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 14), gold); bl.position.set(x2, 1.35, 0); PRESS.ram.add(bl); }
    K.rbox(0.3, 0.12, 0.3, 0.03, chrome, 0, 0.06, 0, PRESS.ram);
    REEDCOIN = coin(K, 0.45, 0.07, sc, { reed: true, n: 96 });
    { const m = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff3a2a').multiplyScalar(2.2), toneMapped: false }); const arc = new THREE.Mesh(new THREE.TorusGeometry(0.47, 0.022, 8, 40, 1.1), m); arc.rotation.x = Math.PI / 2; arc.rotation.z = 4.4 - 0.55; arc.userData.ndSkip = true; REEDCOIN.add(arc); REEDCOIN.arc = arc; }
    HOLOC = K.holoBox(1.0, 0.12, 1.0, 0, 0, 0, REEDCOIN, '#36e2ff');
    // ================= the moat (sheep, castle wall) =================
    const OG = K.group();
    K.slab(MO - 40, MO + 40, -0.1, 0, -3, 30, K.mat('grime', '#6aa84f', { amt: 0.6 }), OG, false);
    K.slab(MO - 40, MO + 40, -0.6, -0.2, -8, -3, K.paint('#2a7ab0', { rough: 0.08 }), OG, false); K.slab(MO - 40, MO + 40, -1, 0, -3.2, -3, K.mat('rock', '#9a9080'), OG, false);
    const stone = K.mat('rock', '#b8ac98', { detail: 0.8 }); K.slab(MO - 40, MO + 40, -1, 7, -12, -8, stone, OG);
    for (let k = -40; k < 40; k += 1.6) K.rbox(0.9, 0.8, 1.2, 0.05, stone, MO + k, 7.4, -8.6, OG);
    for (const tx2 of [-9, 7]) { K.cyl(2.4, 2.6, 11, stone, MO + tx2, -1, -10, OG, 24); for (let k = 0; k < 10; k++) { const a = k / 10 * Math.PI * 2; K.rbox(0.7, 0.8, 0.7, 0.05, stone, MO + tx2 + Math.cos(a) * 2.3, 10.4, -10 + Math.sin(a) * 2.3, OG); }
      const roof = new THREE.Mesh(new THREE.ConeGeometry(2.8, 3, 24), K.paint('#3a5aa8', { rough: 0.4 })); roof.position.set(MO + tx2, 12.3, -10); OG.add(roof); K.cyl(0.04, 0.04, 2, gold, MO + tx2, 13.6, -10, OG, 6); K.slab(MO + tx2, MO + tx2 + 1.0, 14.9, 15.5, -10.02, -9.98, K.mat('fabric', '#a8202a'), OG); }
    for (let k = 0; k < 14; k++) { const w = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 1.0), K.paint('#2a2c34', { rough: 0.4 })); w.position.set(MO - 14 + k * 2.2, 4.2 + (k % 2) * 1.4, -7.98); OG.add(w); K.slab(MO - 14.4 + k * 2.2, MO - 13.6 + k * 2.2, 3.6 + (k % 2) * 1.4, 3.7 + (k % 2) * 1.4, -7.98, -7.9, stone, OG); }
    for (let k = 0; k < 6; k++) { const bn = K.slab(MO - 12 + k * 4.6, MO - 11 + k * 4.6, 1.2, 6.6, -7.97, -7.93, K.mat('fabric', k % 2 ? '#a8202a' : '#2a4a8a'), OG); const cr = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), S.textMat('B', { bg: k % 2 ? '#a8202a' : '#2a4a8a', fg: '#f2c230', w: 128, h: 128, border: false })); cr.position.set(MO - 11.5 + k * 4.6, 5.4, -7.92); OG.add(cr); }
    for (let k = 0; k < 40; k++) { const iv = new THREE.Mesh(new THREE.SphereGeometry(0.35 + hash(k) * 0.3, 8, 6), K.mat('grime', '#3a7a3a', { amt: 0.5 })); iv.scale.z = 0.3; iv.position.set(MO - 16 + hash(k + 1) * 32, hash(k + 2) * 2.5, -7.95); OG.add(iv); }
    for (let k = -14; k <= 14; k += 1.5) { K.cyl(0.05, 0.05, 1.0, dwood, MO + k, 0, 3.5, OG, 6); } K.slab(MO - 14, MO + 14, 0.7, 0.78, 3.47, 3.53, dwood, OG); K.slab(MO - 14, MO + 14, 0.35, 0.43, 3.47, 3.53, dwood, OG);
    const rsign = S.board('ROYAL SHEEP|FREE HAIRCUTS', 2.2, 1.1, { frame: '#a8202a' }); rsign.position.set(MO + 3.4, 0, -1.8); rsign.rotation.y = -0.3;
    for (let k = 0; k < 8; k++) { const t = S.tree({ h: 4 + hash(k) * 2, seed: k + 50 }); t.position.set(MO - 20 + k * 5.5, 0, 9 + hash(k + 3) * 6); }
    for (let k = 0; k < 30; k++) { const fl = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), K.paint(['#f4f2ee', '#f2c230', '#e86a9a'][k % 3])); fl.position.set(MO - 8 + hash(k) * 16, 0.05, -2 + hash(k + 5) * 5); OG.add(fl); }
    S.bake(OG);
    for (let k = 0; k < 4; k++) SHEEP.push(K.animal('sheep', { seed: 20 + k, scale: k === 0 ? 1.05 : 0.95 }));
    // ================= characters =================
    WALLY = K.stick({ jacket: '#3a5a3a', pants: '#2a2a30', hat: 'beanie', hatColor: '#2a2a30', moustache: '#3a2418', scarf: '#c0392b', gloves: '#1a1a1a', belt: '#3a2418', pockets: true }, { key: 'wally' });
    WES = K.stick({ jacket: '#4a3a5a', pants: '#3a2a1e', hat: 'cap', cap: '#2a2a30', hairStyle: 'spiky', hair: '#3a2418', glasses: true, vest: '#8a5a34', gloves: '#1a1a1a', build: 'stout' }, { key: 'wes' });
    KING = K.stick({ jacket: '#a8202a', pants: '#f4efe4', hat: 'crown', moustache: '#f4f2ee', hairStyle: 'curly', hair: '#f4f2ee', collar: '#f4f2ee', belt: '#f2c230', vest: '#f2c230', build: 'stout', scarf: '#f4f2ee' }, { key: 'king' });
    MINA = K.stick({ jacket: '#2a6a9a', pants: '#3a3a48', hairStyle: 'bun', hair: '#1a1a1a', glasses: true, apron: '#8a5a34', gloves: '#3a2418', collar: '#f4efe4', belt: '#3a2418' }, { key: 'mina' });
    BAKER = K.stick({ jacket: '#f4f2ee', pants: '#3a3a48', hat: 'chef', moustache: '#c0632a', apron: '#f4f2ee', bowtie: '#c0392b', build: 'stout', belt: '#3a2418' }, { key: 'baker' });
    GUARD1 = K.stick({ jacket: '#2a3a6a', pants: '#2a2a30', hat: 'helmet', badge: true, belt: '#3a2418', boots: '#1a1a1a', scarf: '#f2c230' }, { key: 'g1' });
    GUARD2 = K.stick({ jacket: '#2a3a6a', pants: '#2a2a30', hat: 'helmet', badge: true, belt: '#3a2418', boots: '#1a1a1a', moustache: '#5a3a24' }, { key: 'g2' });
    CUST = K.stick({ jacket: '#d8a830', pants: '#3a2a1e', hairStyle: 'ponytail', hair: '#8a5a34', scarf: '#2a7a4a', collar: '#ffffff', belt: '#3a2418' }, { key: 'cust' });
    K.addClouds(10, 700, 140);
  },
  frame(f, K) {
    const T = K.T, L = LINES, blink = (s) => blinkAt(f, s);
    const loc = f < 293 ? 'shop' : f < 850 ? 'market' : f < 964 ? 'mint' : f < 1053 ? 'holo' : f < 1229 ? 'market' : 'moat';
    // ---------- coins: face stage + size over the story ----------
    const stage = f < F.CROWN ? 0 : f < F.EARS ? 1 : f < F.NOSE ? 2 : 3;
    const setFace = (c, st) => { for (const m of c.faces) m.material = CMATS[st]; };
    setFace(VISE_COIN, 0); setFace(BIGCOIN, stage); for (const s of STARS) setFace(s, 3); setFace(REEDCOIN, 0);
    // the hero coin on the market counter / macro (x = MK + 2.5 on a velvet cushion)
    const cs = f < F.SHRUNK ? 1 : f < F.BIG ? lerp(1, 0.6, sm(F.SHRUNK, F.SHRUNK + 10, f)) : lerp(0.6, 1.6, sm(F.BIG, F.BIG + 12, f));
    BIGCOIN.visible = (f >= 293 && f < 690); BIGCOIN.scale.setScalar(cs * 0.35);
    if (f < 551) { BIGCOIN.position.set(MK - 0.4, 1.12 + 0.04, -4.15); BIGCOIN.rotation.set(-1.25, 0, 0); }
    else { const h = [MK + 6.5 + 0.45, 2.75, -4.0]; BIGCOIN.position.set(...h); BIGCOIN.rotation.set(-1.45, 0, 0.1 * Math.sin(f * 0.1)); BIGCOIN.scale.setScalar(1.6 * 0.6); }
    STARS.forEach((s, k) => { s.visible = f >= 690 && f < 850; });
    if (f >= 690) { STARS[0].position.set(MK + 0.3, 1.06, -4.1); STARS[0].rotation.set(0, f * 0.02, 0); for (let k = 1; k < 5; k++) STARS[k].position.set(MK - 40, -5, 0); }
    VISE_COIN.visible = loc === 'shop';
    // file "haircut": the shaved bit shows as sparks of gold dust
    JAR.fill.scale.y = 0.02 + 0.26 * sm(0, F.PICK + 10, f); JAR.fill.position.y = JAR.fill.scale.y / 2 + 0.005;
    // the press: the cross bar turns and the ram drops on "pressed"
    const pd = sm(F.PRESSED - 10, F.PRESSED, f) - sm(F.LINES, F.LINES + 12, f); PRESS.ram.position.y = 1.15 - 0.28 * pd; PRESS.ram.rotation.y = pd * 1.4;
    // the reeded hero coin: under the press (mint), then on the x-ray stage; the shave removes an arc of lines
    REEDCOIN.visible = f >= 905 && f < 1053; const bald = sm(F.SHAVE2, F.VANISH + 6, f);
    if (f < 964) { REEDCOIN.position.set(MT - 2.4, 1.3, 0.2); REEDCOIN.rotation.set(1.2, 0, f * 0.01); }
    else { REEDCOIN.position.set(MT - 2.4, 1.3, 0.2); REEDCOIN.rotation.set(1.35, 0, -0.5 + (f - 964) * 0.004); }
    REEDCOIN.arc.visible = f >= F.BALD - 6 && f < 1053; REEDCOIN.arc.scale.setScalar(1 + 0.03 * Math.sin(f * 0.5)); HOLOC.visible = f >= 964 && f < 1053;
    for (const r of REEDCOIN.reeds) { const inArc = Math.abs(((r.a - 4.4 + Math.PI) % (2 * Math.PI)) - Math.PI) < 0.55; r.b.visible = !(inArc && bald > ((Math.abs(r.a - 4.4) / 0.55))); r.b.material = r.b.material; }
    // ---------- characters ----------
    // brothers: filing at the bench (shop), carrying the giant file (market), shearing sheep (moat)
    const filing = (s) => [[0, 'hold', { expr: 'evil', R: [0.42, -0.28, 'file'] }], [1, 'hold', { expr: 'evil', R: [0.22 + 0.2 * (Math.floor(f / 5) % 2), -0.3, 'file'] }]];
    let wp = { visible: false }, sp = { visible: false };
    if (loc === 'shop') { wp = { x: -0.45, z: -0.85, yaw: 0.45 }; sp = { x: 0.6, z: -0.7, yaw: -0.5 }; }
    if (f >= 615 && f < 690) { const W1 = K.walkPath(f, 615, [[MK - 8, 1.6], [MK + 2, 1.6]], 1.6); wp = { x: W1.x, z: W1.z - 0.5, yaw: W1.yaw }; sp = { x: W1.x - 1.9, z: W1.z - 0.5, yaw: W1.yaw }; }
    if (loc === 'moat') { wp = { x: MO - 1.0, z: 0.4, yaw: 0.35 }; sp = { x: MO + 1.8, z: 0.2, yaw: -0.5 }; }
    const fil = Math.floor(f / 5) % 2;
    const wk = [[0, 'hold', { expr: 'evil', R: [0.3 + 0.18 * fil, -0.25, 'file'] }], [F.CAUGHT - 4, 'scared', { expr: 'scared', sweat: true }], [F.MOAT + 6, 'sneak', { expr: 'nervous', sweat: true }],
      [F.JAR - 8, 'show', { expr: 'gloat', look: 0.5 }], [615, 'reach', { expr: 'smug' }], [F.FILES, 'reach', { expr: 'gloat' }],
      [1229, 'hold', { expr: 'deadpan', R: [0.35 + 0.12 * fil, -0.2, 'file'] }], [F.SHEEP - 4, 'hold', { expr: 'deadpan', look: 0.7, R: [0.35 + 0.12 * fil, -0.2, 'file'] }]];
    const sk = [[0, 'hold', { expr: 'gloat', R: [0.3 + 0.18 * (1 - fil), -0.25, 'file'] }], [F.HAIRCUT, 'hold', { expr: 'evil', R: [0.3 + 0.18 * (1 - fil), -0.25, 'file'] }], [F.CAUGHT - 2, 'scared', { expr: 'scared', sweat: true }],
      [F.MOAT + 8, 'facepalm', { expr: 'nervous', sweat: true }], [F.DUST - 4, 'point', { expr: 'grin' }], [615, 'reach', { expr: 'grin' }], [1229, 'hold', { expr: 'sad', R: [0.3 + 0.15 * (1 - fil), -0.25, 'file'] }], [F.SHEEP, 'shrug', { expr: 'deadpan' }]];
    WALLY.set(T.act(f, wk, { seed: 1, blink: blink(1) }), wp); WES.set(T.act(f, sk, { seed: 2, blink: blink(2) }), sp);
    BIGFILE.visible = f >= 615 && f < 690; if (BIGFILE.visible) { BIGFILE.position.set(wp.x - 0.95, 1.05, wp.z + 0.2); BIGFILE.rotation.set(0, 0, Math.PI / 2 + 0.05 * Math.sin(f * 0.4)); }
    // cat on the sack (shop)
    CAT.set(f, { x: -3.15, y: 0.55, z: 2.2, yaw: 0.6, mode: f < F.CAUGHT - 4 ? 'sleep' : 'sit', expr: f < F.CAUGHT - 4 ? 'sleepy' : 'shock', visible: loc === 'shop' });
    // guard passing outside the window with a torch (line 1)
    { const gx = lerp(-1.5, 4.0, sm(F.CAUGHT - 14, F.MOAT + 24, f)); GUARD1.set(T.act(f, [[0, 'walk', { expr: 'stern', R: [0.3, -0.6, 'torch'], phase: (f / 18) % 1 }]], { seed: 4, blink: blink(4) }), { x: gx, z: -4.8, yaw: Math.PI / 2, visible: loc === 'shop' }); }
    // baker + customer at the stall; king on the podium
    let bp = { visible: false }, cp = { visible: false }, kp = { visible: false };
    if (loc === 'market') { bp = { x: MK - 0.3, z: -5.25, yaw: 0.1 }; cp = { x: MK - 0.6, z: -3.1, yaw: Math.PI - 0.3 }; kp = { x: MK + 6.5, y: 0.75, z: -4.7, yaw: 0.05 }; }
    if (f >= 1155) { bp = { x: MK + 0.2, z: -5.25, yaw: 0.25 }; }
    const bk = [[0, 'idle', { expr: 'smile' }], [F.LOAF - 4, 'show', { expr: 'smile', R: [0.35, -0.45, 'food'] }], [F.BUTTON - 2, 'shock', { expr: 'confused' }], [F.BUTTON + 14, 'cross', { expr: 'stern' }],
      [690, 'hold', { expr: 'confused', R: [0.4, -0.4, 'coin'] }], [1053, 'idle', { expr: 'smile' }], [F.NOTICES - 4, 'point', { expr: 'shock' }],
      [1155, 'hold', { expr: 'confused', R: [0.3, -0.5, 'coin'] }], [F.FELT + 4, 'hold', { expr: 'stern', R: [0.25, -0.55, 'coin'] }], [F.WHISTLE - 3, 'pointUp', { expr: 'whistle', talk: false }]];
    BAKER.set(T.act(f, bk, { seed: 7, blink: blink(7) }), bp);
    const ck = [[0, 'idle', { expr: 'smile' }], [F.TWO - 6, 'show', { expr: 'nervous', R: [0.35, -0.4, 'coin'] }], [F.BUTTON + 2, 'shrug', { expr: 'nervous', sweat: true }],
      [690, 'carry', { expr: 'shock' }], [1053, 'idle', { expr: 'smile' }], [F.SLICE - 2, 'shock', { expr: 'shock' }], [F.NOTICES, 'pointL', { expr: 'shock' }], [1155, 'cross', { expr: 'stern' }]];
    CUST.set(T.act(f, ck, { seed: 9, blink: blink(9) }), cp);
    const kk = [[0, 'idle', { expr: 'proud' }], [F.FIX - 4, 'show', { expr: 'proud', R: [0.4, -0.75, 'open'] }], [F.BIG, 'cheer', { expr: 'gloat' }], [690, 'shock', { expr: 'shock' }], [777, 'think', { expr: 'confused' }], [F.SEE - 4, 'shrug', { expr: 'confused', sweat: true }],
      [1053, 'idle', { expr: 'smile' }]];
    KING.set(T.act(f, kk, { seed: 5, blink: blink(5) }), f >= 551 && f < 850 ? kp : { visible: false });
    // guards: shrug behind the king (re-hook), run in at the whistle
    let g2p = { visible: false }, g1p = null;
    if (f >= 777 && f < 850) { g2p = { x: MK + 8.0, z: -3.9, yaw: -0.5 }; g1p = { x: MK + 5.1, z: -3.7, yaw: 0.5 }; }
    if (f >= 1195 && f < 1229) { const W2 = K.walkPath(f, 1195, [[MK + 7, 1.0], [MK + 1.6, -2.6]], 3.2); g2p = { x: W2.x, z: W2.z, yaw: W2.yaw }; g1p = { x: W2.x + 1.1, z: W2.z + 0.6, yaw: W2.yaw }; }
    const gk = [[777, 'shrug', { expr: 'confused' }], [1195, 'run', { expr: 'stern' }]];
    GUARD2.set(T.act(f, gk, { seed: 12, blink: blink(12), phase: (f / 9) % 1 }), g2p);
    if (g1p) GUARD1.set(T.act(f, [[777, 'shrug', { expr: 'deadpan' }], [1195, 'run', { expr: 'angry' }]], { seed: 13, blink: blink(13), phase: (f / 9 + 0.5) % 1 }), g1p);
    // Mina at the press
    MINA.set(T.act(f, [[850, 'idle', { expr: 'deadpan' }], [F.MINA, 'reach', { expr: 'smile', R: [0.6, -0.5, 'fist'], L: [0.6, -0.5, 'fist'] }], [F.PRESSED - 6, 'push', { expr: 'grin' }], [F.LINES + 6, 'show', { expr: 'proud', R: [0.35, -0.5, 'coin'] }]], { seed: 14, blink: blink(14) }),
      loc === 'mint' ? { x: MT + 1.9, z: -1.7, yaw: -0.6 } : { visible: false });
    // extras walk the market; sheep graze at the moat (one gets a haircut)
    K.set.extrasFrame(f, EXTRAS, T); for (const e of EXTRAS) e.r.root.visible = loc === 'market';
    SHEEP.forEach((s, k) => s.set(f, { x: MO + [0.3, -2.8, 2.9, -0.4][k], z: [0.55, 1.6, 1.2, 2.4][k], yaw: [-1.6, 0.6, -0.9, 0.4][k], mode: k === 0 ? 'stand' : 'eat', expr: k === 0 ? (f > F.SHEEP ? 'happy' : 'neutral') : 'happy', visible: loc === 'moat' }));

    // ---------- shots ----------
    let cam, dof, u, light; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const hd = (p, y = 1.6) => [p.x, (p.y || 0) + y, p.z];
    const night = K.light('night', { az: 200, el: 30, hemi: 0.8, exposure: 1.55, cardTint: '#fff0e0' }), day = K.light('morning', { az: 130, el: 30, shadowExt: 20 }), mint = K.light('interior', { az: 120, el: 50 }), gold_ = K.light('golden', { az: 150, el: 22 });
    if (sh(0, 50)) {             // 1. macro: Wally files the coin's edge in the vise, gold dust sparks
      cam = { pos: [lerp(0.2, 0.12, u), 1.5, -0.95], look: [-0.02, 1.35, -1.45], fov: 42 * K.push(u, 0.12) }; dof = { focus: 0.5, cinf: 12 }; light = night;
    } else if (sh(50, 101)) {    // 2. both brothers at the bench, "barbers" (front, slow push)
      cam = { pos: [lerp(0.6, 0.3, u), 1.75, 2.3], look: [0.05, 1.3, -1.0], fov: 46 * K.push(u, 0.08) }; dof = { focus: 3.0, cinf: 8 }; light = night;
    } else if (sh(101, 150)) {   // 3. macro: one tiny shave off the edge
      cam = { pos: [0.28, 1.36, -1.15], look: [0, 1.3, -1.45], fov: 34 * K.push(u, 0.15) }; dof = { focus: 0.42, cinf: 18 }; light = night;
    } else if (sh(150, 220)) {   // 4. a guard's torch passes the window; the brothers freeze (from the window side)
      cam = { pos: [lerp(0.4, 0.2, u), 1.6, 1.9], look: [0.4, 1.5, -2.4], fov: 54 }; dof = { focus: 2.2, cinf: 8 }; light = night;
    } else if (sh(220, 296)) {   // 5. insert: gold dust fills the PICKLES jar (push)
      cam = { pos: [0.92, 1.55, lerp(-0.85, -1.0, u)], look: [0.75, 1.15, -1.45], fov: 40 }; dof = { focus: 0.6, cinf: 16 }; light = night;
    } else if (sh(296, 350)) {   // 6. spring morning: the market street, wide (track along)
      cam = { pos: [MK + lerp(-9, -6, u), 3.2, 5.5], look: [MK + 1, 1.3, -3.5], fov: 46 }; dof = { focus: 10, cinf: 3 }; light = day;
    } else if (sh(350, 423)) {   // 7. the baker gets two tiny coins and a button (over the counter)
      cam = { pos: [MK + 1.3, 1.85, -2.2], look: [MK - 0.5, 1.25, -4.2], fov: 44 * K.punch(f, F.BUTTON, 0.15, 6) }; dof = { focus: 2.4, cinf: 10 }; light = day;
    } else if (sh(423, 485)) {   // 8. macro: the king's face on the coin loses his crown...
      const p = BIGCOIN.position; cam = { pos: [p.x + 0.05, p.y + 0.25, p.z + 0.55], look: [p.x, p.y, p.z], fov: 34 * K.push(u, 0.12) }; dof = { focus: 0.6, cinf: 16 }; light = day;
    } else if (sh(485, 551)) {   // 9. ...his ears, his nose (orbit, punch on "nose")
      const p = BIGCOIN.position; cam = { pos: [p.x + lerp(-0.25, 0.1, u), p.y + 0.3, p.z + 0.5], look: [p.x, p.y, p.z], fov: 32 * K.punch(f, F.NOSE, 0.2, 6) }; dof = { focus: 0.55, cinf: 16 }; light = day;
    } else if (sh(551, 615)) {   // 10. King Barnaby on his podium holds up a twice-as-big coin; the decree board
      cam = { pos: [MK + 5.0, 1.6, 0.8], look: [MK + 6.6, 2.4, -4.6], fov: 44 * K.push(u, 0.1) }; dof = { focus: 5.5, cinf: 6 }; light = day;
    } else if (sh(615, 690)) {   // 11. the brothers carry a giant file through the market (tracking)
      const tc = K.track(f, (g) => { const W1 = K.walkPath(g, 615, [[MK - 8, 1.6], [MK + 2, 1.6]], 1.6); return [W1.x - 0.9, 0, W1.z - 0.5]; }, { off: [2.0, 1.4, 4.2], lag: 4, lead: 0.2, lookY: 1.3 }); cam = { ...tc, fov: 48 }; dof = { focus: 4.6, cinf: 6 }; light = day;
    } else if (sh(690, 735)) {   // 12. dinner-plate coins shaved into stars: the baker holds one (push, low)
      cam = { pos: [MK + 0.9, 1.3, -2.6], look: [MK + 0.0, 1.35, -4.6], fov: 44 * K.push(u, 0.1) }; dof = { focus: 2.0, cinf: 10 }; light = day;
    } else if (sh(735, 777)) {   // 13. macro: the star coin spins on the counter
      cam = { pos: [MK + 0.75, 1.45, -3.35], look: [MK + 0.3, 1.08, -4.1], fov: 36 }; dof = { focus: 0.9, cinf: 16 }; light = day;
    } else if (sh(777, 850)) {   // 14. re-hook: the king scratches his head; guards shrug
      cam = { pos: [MK + 6.6 + lerp(-0.4, 0.4, u), 2.4, -1.9], look: [MK + 6.5, 2.2, -4.7], fov: 44 }; dof = { focus: 2.9, cinf: 10 }; light = day;
    } else if (sh(850, 905)) {   // 15. the royal mint: Mina pulls the press bar, the ram comes down
      cam = { pos: [MT + 2.9, 2.0, 1.6], look: [MT + 1.1, 1.3, -2.0], fov: 46 * K.punch(f, F.PRESSED, 0.12, 6) }; dof = { focus: 4, cinf: 7 }; light = mint;
    } else if (sh(905, 964)) {   // 16. macro: tiny lines all around the coin's edge (slow orbit)
      const p = REEDCOIN.position; cam = { pos: [p.x + lerp(-0.6, 0.5, u), p.y + 0.35, p.z + 1.3], look: [p.x, p.y, p.z], fov: 36 }; dof = { focus: 1.4, cinf: 14 }; light = mint;
    } else if (sh(964, 1010)) {  // 17. x-ray: a file swipes, the lines vanish (bald spot)
      const p = REEDCOIN.position; cam = { pos: [p.x + 0.2, p.y - 0.55, p.z + 1.2], look: [p.x, p.y - 0.25, p.z], fov: 38 }; dof = { focus: 1.3, cinf: 12 }; light = mint;
    } else if (sh(1010, 1053)) { // 18. macro on the bald spot (punch)
      const p = REEDCOIN.position; cam = { pos: [p.x + 0.1, p.y + 0.2, p.z + 1.7], look: [p.x, p.y, p.z], fov: 40 * K.punch(f, F.BALD, 0.18, 6) }; dof = { focus: 1.7, cinf: 12 }; light = mint;
    } else if (sh(1053, 1105)) { // 19. cutaway: a birthday cake with one slice gone (insert, push)
      cam = { pos: [MK + 1.45, 1.85, -3.25], look: [MK + 1.05, 1.2, -4.35], fov: 40 * K.push(u, 0.12) }; dof = { focus: 1.3, cinf: 14 }; light = day;
    } else if (sh(1105, 1155)) { // 20. reaction: the customer gasps and points at the cake
      const h = hd(cp); cam = { pos: [h[0] + 1.4, h[1] + 0.1, h[2] - 0.7], look: [h[0], h[1] - 0.1, h[2]], fov: 40 }; dof = { focus: 2.2, cinf: 14 }; light = day;
    } else if (sh(1155, 1195)) { // 21. the baker feels a coin's edge (close)
      const h = hd(bp); cam = { pos: [h[0] + 0.6, h[1] - 0.1, h[2] + 1.7], look: [h[0] + 0.1, h[1] - 0.3, h[2]], fov: 38 * K.push(u, 0.1) }; dof = { focus: 1.8, cinf: 14 }; light = day;
    } else if (sh(1195, 1229)) { // 22. whistle! the guards run in (tracking)
      cam = { pos: [MK + 4.5, 1.7, 2.8], look: [MK + 1.5, 1.3, -3.2], fov: 48 }; dof = { focus: 5, cinf: 6 }; light = day;
    } else if (sh(1229, 1290)) { // 23. the moat: the brothers give the royal sheep haircuts (wide, push)
      cam = { pos: [MO + lerp(3.4, 2.6, u), 1.6, 4.6], look: [MO + 0.0, 2.6, -2.5], fov: 54 }; dof = { focus: 6.5, cinf: 5 }; light = gold_;
    } else {                     // 24. Wally, deadpan, with a fluffy sheep (close)
      const h = hd(wp); cam = { pos: [h[0] + 1.6, h[1] - 0.1, h[2] + 2.0], look: [h[0] + 0.5, h[1] - 0.45, h[2]], fov: 40 * K.push(u, 0.12) }; dof = { focus: 2.4, cinf: 12 }; light = gold_;
    }
    // ---------- effects + graphics ----------
    if (loc === 'shop') K.sparks(f, 0, 150, [0.0, 1.22, -1.38], { dir: [0.2, -0.6, 0.4], spread: 0.5, rate: 6, speed: 1.2, life: 14, color: '#ffd24a', seed: 3 });
    if (f >= 220 && f < 296) K.sparks(f, 220, 296, [0.75, 1.5, -1.45], { dir: [0, -1, 0], spread: 0.15, rate: 5, speed: 0.8, life: 12, color: '#ffd24a', seed: 5 });
    if (f >= 964 && f < 1053) { K.sparks(f, F.SHAVE2 - 2, F.VANISH + 4, [MT - 2.4, 0.86, 0.35], { dir: [1, 0.2, 0.3], spread: 0.4, rate: 9, speed: 1.6, life: 12, color: '#ffd24a', seed: 8 }); }
    if (loc === 'moat') for (let k = 0; k < 3; k++) K.puff(f, 1240 + k * 22, MO + 0.3 + k * 0.2, 0.55, 6, 0.3, '#f8f4ec');
    K.mist(f, 286, 16); K.mist(f, 842, 16); K.mist(f, 1046, 14); K.mist(f, 1221, 16);
    if (f >= 101 && f < 150) K.badge(f, F.SHAVE, '1 TINY SHAVE', [0.02, 1.42, -1.45], { icon: 'down', f1: 148 });
    K.badge(f, F.FORTY, '40 YEARS: MOAT DUTY', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 220 });
    K.badge(f, F.TWO, '2 COINS + 1 BUTTON', { sx: 0.5, sy: 0.22 }, { icon: 'coin', f1: 423 });
    K.badge(f, F.BIG, 'COINS x2', { sx: 0.5, sy: 0.2 }, { style: 'stamp', f1: 615, size: 1.3 });
    if (f >= 905 && f < 964) K.badge(f, F.LINES, 'TINY LINES', [MT - 2.4, 1.85, 0.2], { icon: 'check', f1: 962 });
    if (f >= 964 && f < 1053) K.badge(f, F.BALD, 'BALD SPOT!', { sx: 0.5, sy: 0.24 }, { icon: 'x', f1: 1051, style: 'stamp' });
    K.badge(f, F.WHISTLE, 'CAUGHT!', { sx: 0.5, sy: 0.22 }, { style: 'stamp', f1: 1229, size: 1.4 });
    return { light: { ...light, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
