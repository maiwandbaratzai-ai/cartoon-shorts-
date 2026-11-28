// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The Mayor's Thick Dam Burst Before the Thin One" — invented story, engine: The Rivals (SCRIPTS.md §000; tonight's only Rivals).
// Mayor Brick ("Straight is strong!") builds a thick, dead-straight dam; Nell builds hers thin and bent like a banana, and Brick
// laughs so hard his hat falls in the lake. Bramble the beaver (exactly one dam built) moves in with Nell, pillow and all. Nine days
// of rain: Brick's dam bulges like a belly after dinner, forty logs bend, it pops at midnight and the lake goes downtown (a cow
// surfs by on a sofa; Brick's car floats past Brick, honking). Nell's arch doesn't creak. Explainer: a curve passes the push
// sideways into the rock walls (an arch lying on its side, wedging tighter the harder it's pushed); a straight wall has nothing to
// lean on and bends in the middle. Main Street becomes a pool; Brick rebuilds bent; Bramble gets a "Dam Engineer" hard hat.
import { TOTAL, LINES, wf } from './archdam_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const MZ = 48, BX = -14, NX = 14, DH = 6, HALF = 5.5, AR = 8, AC = 7, EX = [300, 0, 0];
const arcPt = (cx, a, r = AR) => [cx + r * Math.sin(a), cx === undefined ? 0 : AC - r * Math.cos(a)];
let BAKX = -10, THREE, F = {}, BSEG = [], NSEG = [], RSEG = [], LAKEB, LAKEN, FLOOD, GUSH, LOGS = [], BRICK, NELL, BEAV, HAT, HARD, COW, SOFA, CAR, DUCKS = [], EXTRAS = [], GNOMES = [], HX = {}, PILLOW, TUBES = [];

function makeArch(K, S, cx, mat, n = 12, parent) { const segs = []; const a0 = Math.asin(HALF / AR);
  for (let k = 0; k < n; k++) { const a = lerp(-a0, a0, (k + 0.5) / n), w = 2 * AR * Math.sin(a0 / n) + 0.06; const s = K.rbox(w, DH, 0.7, 0.08, mat, 0, DH / 2, 0, parent || K.scene); const [x, z] = arcPt(cx, a); s.position.set(x, DH / 2, z); s.rotation.y = -a; segs.push(s); }
  return segs; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { THICK: wf(0, 'thick'), BURST: wf(0, 'burst'), FIRST: wf(0, 'first'), PUDDLE: wf(1, 'puddleford'), BAKERY: wf(1, 'bakery'), SCHOOL: wf(1, 'school'), GNOMES: wf(1, 'gnomes'),
      BUILT: wf(2, 'built'), STRAIGHT: wf(2, 'straight'), SAID: wf(2, 'said'), NELL: wf(3, 'nell'), THIN: wf(3, 'thin'), BANANA: wf(3, 'banana'), LAUGHED: wf(4, 'laughed'), HAT: wf(4, 'hat'), LAKE: wf(4, 'lake'),
      BRAMBLE: wf(5, 'bramble'), EXACTLY: wf(5, 'exactly'), MOVED: wf(5, 'moved'), PILLOW: wf(5, 'pillow'), RAINED: wf(6, 'rained'), NINE: wf(6, 'nine'), BRIM: wf(6, 'brim'), DUCKS: wf(7, 'ducks'), INDOORS: wf(7, 'indoors'),
      BULGED: wf(8, 'bulged'), BELLY: wf(8, 'belly'), YELLED: wf(9, 'yelled'), PROPPING: wf(9, 'propping'), FORTY: wf(9, 'forty'), BENT: wf(9, 'bent'), MIDNIGHT: wf(10, 'midnight'), POPPED: wf(10, 'popped'), DOWNTOWN: wf(10, 'downtown'), COW: wf(10, 'cow'), SOFA: wf(10, 'sofa'),
      CAR: wf(11, 'car'), FLOATED: wf(11, 'floated'), HONKED: wf(11, 'honked'), CREAK: wf(12, 'creak'), WHY: wf(12, 'why'), CURVE: wf(13, 'curve'), SIDEWAYS: wf(13, 'sideways'), ROCK: wf(13, 'rock'),
      ARCH: wf(14, 'arch'), SIDE: wf(14, 'side'), HARDER: wf(14, 'harder'), TIGHTER: wf(14, 'tighter'), WALL: wf(15, 'wall'), NOTHING: wf(15, 'nothing'), BENDS: wf(15, 'bends'), BREAKS: wf(15, 'breaks'),
      MORNING: wf(16, 'morning'), POOL: wf(16, 'pool'), MAIN: wf(16, 'main'), REBUILT: wf(17, 'rebuilt'), BANANA2: wf(17, 'banana'), STRONG: wf(17, 'strong'), HARDHAT: wf(18, 'hard'), ENGINEER: wf(18, 'engineer') };
    // ================= the valley: two canyons, a ridge, Puddleford below =================
    const G = K.group(); const RK = (c) => K.mat('rock', c, { detail: 1.2, bump: 0.1 });
    K.slab(-140, 140, -0.3, 0.0, -90, 90, K.mat('grime', '#7aa84a', { detail: 2.0, amt: 0.5 }), G, false);
    K.slab(BX - HALF, BX + HALF, 0.0, 0.02, -45, 0, K.mat('dirt', '#8a7a5a'), G, false); K.slab(NX - HALF, NX + HALF, 0.0, 0.02, -45, 0, K.mat('dirt', '#8a7a5a'), G, false);
    for (let z = -46; z < 4; z += 5) { const h = 8.5 + hash(z) * 2; K.rbox(6, h, 5.4, 1.0, RK('#9a8670'), BX - HALF - 3, h / 2 - 0.5, z, G); K.rbox(6, h, 5.4, 1.0, RK('#a08a72'), NX + HALF + 3, h / 2 - 0.5, z, G);
      const hr = 7.2 + hash(z + 3) * 1.5; K.rbox(2 * (NX - HALF) - 0.2, hr, 5.4, 1.2, RK('#9a8670'), 0, hr / 2 - 0.5, z, G); }
    for (let k = 0; k < 6; k++) { const m = new THREE.Mesh(new THREE.ConeGeometry(18 + hash(k) * 10, 26 + hash(k + 1) * 16, 6), RK('#8a7a6a')); m.position.set(-60 + k * 24, 10, -60 - hash(k + 2) * 20); G.add(m); }
    for (let k = 0; k < 30; k++) { const x = (hash(k) - 0.5) * 60, z = -50 + hash(k + 1) * 12; const t = new THREE.Mesh(new THREE.ConeGeometry(1.2, 4 + hash(k + 2) * 2, 7), K.paint('#2f6a3a', { rough: 0.7 })); t.position.set(x, 9 + hash(k + 3) * 2, z); G.add(t); }
    // dam crest details: rails, lamps, name plates (static)
    const CONC = K.mat('plaster', '#c8c4bc', { detail: 1.0 }), NCON = K.mat('plaster', '#d8d0c0', { detail: 0.8 });
    // Puddleford: Main Street, bakery, school, houses, gnomes, sign, rock mound
    K.slab(-36, 36, 0.0, 0.03, MZ - 2.5, MZ + 2.5, K.mat('grime', '#5a5860', { detail: 1.0 }), G, false);
    for (const lz of [MZ - 2.4, MZ + 2.4]) K.slab(-36, 36, 0.03, 0.05, lz - 0.08, lz + 0.08, K.paint('#f4f4f0'), G, false);
    const gn = (x, z) => { K.cyl(0.12, 0.16, 0.35, K.paint('#2a6ad0'), x, 0, z, G, 10); K.sphere(0.1, K.paint('#f4d0b0'), x, 0.45, z, G); K.sphere(0.07, K.paint('#f4f4f0'), x, 0.38, z + 0.06, G); const h = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 10), K.paint('#d02a2a')); h.position.set(x, 0.66, z); G.add(h); GNOMES.push([x, z]); };
    for (let k = 0; k < 60; k++) gn(-32 + hash(k) * 64, (k % 2 ? MZ - 2.9 : MZ + 2.9) + (hash(k + 4) - 0.5) * 0.3);
    K.cyl(0.08, 0.08, 2.5, K.paint('#5a4a3a'), -30, 0, 34, G, 8); const ts = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.2), S.textMat('PUDDLEFORD|POP. 400 GNOMES', { bg: '#2a7a4a', fg: '#ffffff', w: 600, h: 200, border: false })); ts.position.set(-30, 2.6, 34.1); G.add(ts);
    const mound = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), K.mat('rock', '#9a8670', { detail: 0.6 })); mound.scale.set(3.2, 2.2, 3.2); mound.position.set(-4, 0, 30); G.add(mound);
    S.bake(G);
    let x = -36, i = 0; while (x < 36) { const w = 5 + (i * 7 % 3); const shop = [null, 'BAKERY', null, 'SCHOOL', null, 'TOWN HALL', null, 'GNOME SHOP'][i % 8];
      const b = S.building({ w, d: 8, floors: shop === 'SCHOOL' || shop === 'TOWN HALL' ? 3 : 2, seed: i + 7, shop, color: ['#f2e2c0', '#e8a07a', '#a8c8e8', '#f2c26a'][i % 4], flowers: true, shutters: i % 2 ? '#2a5a3a' : null, gable: i % 3 ? 'pitched' : 'step' }); b.position.set(x + w / 2, 0, MZ - 3.2); if (shop === 'BAKERY') BAKX = x + w / 2; x += w + 0.1; i++; }
    x = -36; i = 20; while (x < 36) { const w = 5 + (i * 5 % 3); const b = S.building({ w, d: 8, floors: 2, seed: i + 3, color: ['#e8d8b0', '#c86a4a', '#f2e2c0'][i % 3], flowers: true, gable: 'pitched', shop: i % 4 === 0 ? 'CAFE' : null }); b.position.set(x + w / 2, 0, MZ + 3.2); b.rotation.y = Math.PI; x += w + 0.1; i++; }
    for (const [tx, tz] of [[-28, 16], [-24, 30], [26, 18], [30, 30], [8, 34], [-12, 38]]) { const t = S.tree({ h: 5, seed: tx * 3 + tz }); t.position.set(tx, 0, tz); }
    // ================= the hero props: the two dams =================
    for (let k = 0; k < 10; k++) { const s = K.rbox(1.06, DH, 3.0, 0.06, CONC, BX - 4.5 + k, DH / 2, 0, sc); BSEG.push(s); }
    { const nm = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.0), S.textMat('BRICK DAM|STRAIGHT IS STRONG', { bg: '#c8c4bc', fg: '#8a2a2a', w: 600, h: 140, border: false })); nm.position.set(BX, 4.3, 1.52); sc.add(nm); BSEG.push(nm); }
    const rail = (pts, par) => { for (let k = 0; k < pts.length; k++) K.cyl(0.04, 0.04, 0.9, K.paint('#f2c230'), pts[k][0], DH, pts[k][1], par || sc, 6); };
    NSEG.push(...makeArch(K, S, NX, NCON)); rail(Array.from({ length: 9 }, (_, k) => arcPt(NX, lerp(-0.7, 0.7, k / 8), AR + 0.3)));
    { const nm = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 0.8), S.textMat("NELL'S DAM", { bg: '#d8d0c0', fg: '#2a5a8a', w: 500, h: 130, border: false })); const [nx, nz] = arcPt(NX, 0); nm.position.set(nx, 4.4, nz + 0.37); sc.add(nm); }
    RSEG.push(...makeArch(K, S, BX, NCON));
    for (const c of [BX, NX]) for (const s of [-1, 1]) { K.lamp(c + s * 4.8, DH + 1.6, 1.2, { color: '#ffd08a', intensity: 2, distance: 8, glowS: 0.7 }); K.cyl(0.05, 0.05, 1.6, K.paint('#2a2a30'), c + s * 4.8, DH, 1.2, sc, 8); }
    const wmat = () => new THREE.MeshPhysicalMaterial({ color: '#2a7aa8', roughness: 0.05, transparent: true, opacity: 0.85, clearcoat: 1 });
    LAKEB = new THREE.Mesh(new THREE.BoxGeometry(2 * HALF, 1, 44), wmat()); sc.add(LAKEB); LAKEN = new THREE.Mesh(new THREE.BoxGeometry(2 * HALF + 2, 1, 44), wmat()); sc.add(LAKEN);
    FLOOD = new THREE.Mesh(new THREE.BoxGeometry(80, 1, 56), wmat()); sc.add(FLOOD);
    GUSH = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1, 1), new THREE.MeshPhysicalMaterial({ color: '#9ad8ff', roughness: 0.05, transparent: true, opacity: 0.55, clearcoat: 1 })); sc.add(GUSH);
    for (let k = 0; k < 8; k++) { const l = K.cyl(0.14, 0.16, 1, K.mat('wood', '#8a5a34'), 0, 0, 0, sc, 8); LOGS.push(l); }
    // props: tophat, hard hat, pillow, sofa, car, tubes
    HAT = new THREE.Group(); sc.add(HAT); K.cyl(0.17, 0.17, 0.38, K.paint('#1a1a1e', { rough: 0.4 }), 0, 0, 0, HAT, 20); K.cyl(0.29, 0.29, 0.03, K.paint('#1a1a1e', { rough: 0.4 }), 0, 0, 0, HAT, 24); K.cyl(0.175, 0.175, 0.07, K.paint('#d02a2a'), 0, 0.04, 0, HAT, 20);
    HARD = new THREE.Group(); sc.add(HARD); { const h = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), K.paint('#f2c230', { rough: 0.25 })); HARD.add(h); K.cyl(0.24, 0.24, 0.025, K.paint('#f2c230'), 0, 0, 0.03, HARD, 20);
      const lb = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.1), S.textMat('DAM ENGINEER', { bg: '#f2c230', fg: '#1a1a1a', w: 300, h: 90, border: false })); lb.position.set(0, 0.1, 0.17); lb.rotation.x = -0.4; HARD.add(lb); }
    PILLOW = K.rbox(0.55, 0.16, 0.38, 0.08, K.paint('#f4f4f0', { rough: 0.9 }), 0, 0, 0, sc);
    SOFA = new THREE.Group(); sc.add(SOFA); { const R = K.mat('fabric', '#c84a4a'); K.rbox(2.2, 0.5, 1.0, 0.12, R, 0, 0.25, 0, SOFA); K.rbox(2.2, 0.8, 0.25, 0.1, R, 0, 0.75, -0.4, SOFA); for (const s of [-1, 1]) K.rbox(0.25, 0.65, 1.0, 0.1, R, s * 1.0, 0.5, 0, SOFA); }
    CAR = S.car({ kind: 'hatch', color: '#6a3a9a', seed: 12 }); { const pl = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.18), S.textMat('MAYOR 1', { bg: '#f4f4f0', fg: '#1a1a1a', w: 200, h: 60, border: false })); pl.position.set(-2.0, 0.55, 0); pl.rotation.y = -Math.PI / 2; CAR.g.add(pl); }
    for (let k = 0; k < 5; k++) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.17, 10, 20), K.paint(['#e8202a', '#f2c230', '#4ab8ff', '#3ab86a', '#e84a8f'][k], { rough: 0.3 })); t.rotation.x = Math.PI / 2; sc.add(t); TUBES.push(t); }
    // ================= explainer stage (top views): arch passing the push sideways, arch bridge turning, straight wall bending =================
    const EG = K.group(); K.cyl(10, 10, 0.1, K.paint('#1f2a44', { rough: 0.4 }), EX[0], 0, EX[2], EG, 64);
    for (const r of [4.5, 9.6]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.04, 8, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color('#36e2ff').multiplyScalar(1.6), toneMapped: false })); t.rotation.x = Math.PI / 2; t.position.set(EX[0], 0.12, EX[2]); t.userData.ndSkip = true; EG.add(t); }
    HX.g = new THREE.Group(); HX.g.position.set(EX[0], 0, EX[2] - 1); sc.add(HX.g); const HO = K.holo('#36e2ff');
    HX.arch = makeArch(K, S, 0, HO, 12, HX.g); HX.arch.forEach((s) => { s.scale.y = 0.35; s.position.y = 1.05; });
    HX.rocks = []; for (const s of [-1, 1]) { const r = K.rbox(3, 2.4, 6, 0.3, K.holo('#ffb050'), s * (HALF + 1.5), 1.2, 1, HX.g); HX.rocks.push(r); }
    HX.push = []; for (let k = 0; k < 5; k++) { const xx = -4 + k * 2; HX.push.push(K.trace([[EX[0] + xx, 1.4, EX[2] - 9], [EX[0] + xx, 1.4, EX[2] - 1 - AR + AR * (1 - Math.cos(Math.asin(Math.min(0.95, Math.abs(xx) / AR)))) - 0.6]], { color: '#7af8ff', r: 0.08 })); }
    HX.side = []; for (const s of [-1, 1]) HX.side.push(K.trace(Array.from({ length: 14 }, (_, k) => { const a = s * lerp(0, Math.asin(HALF / AR), k / 13); const [px, pz] = arcPt(0, a); return [EX[0] + px, 2.4, EX[2] - 1 + pz]; }).concat([[EX[0] + s * (HALF + 1.8), 2.4, EX[2] + 1.4]]), { color: '#ff9a3a', r: 0.1 }));
    HX.bridge = new THREE.Group(); HX.bridge.position.set(EX[0], 0, EX[2] + 2); sc.add(HX.bridge); { const a0 = Math.PI; for (let k = 0; k < 9; k++) { const a = a0 * (k + 0.5) / 9; const v = K.rbox(0.9, 0.7, 1.2, 0.08, K.mat('rock', '#c8b8a0', { detail: 0.4 }), -Math.cos(a) * 3, Math.sin(a) * 3, 0, HX.bridge); v.rotation.z = a - Math.PI / 2; }
      for (const s of [-1, 1]) K.rbox(1.4, 1.2, 1.6, 0.1, K.mat('rock', '#8a7a6a'), s * 3.4, -0.4, 0, HX.bridge); }
    HX.wall = []; for (let k = 0; k < 10; k++) { const s = K.rbox(1.0, 0.9, 0.9, 0.05, K.holo('#36e2ff'), EX[0] - 4.5 + k, 1.0, EX[2] + 0.5, sc); HX.wall.push(s); }
    HX.wpush = []; for (let k = 0; k < 5; k++) HX.wpush.push(K.trace([[EX[0] - 4 + k * 2, 1.0, EX[2] - 7], [EX[0] - 4 + k * 2, 1.0, EX[2] - 0.2]], { color: '#7af8ff', r: 0.08 }));
    HX.wrocks = []; for (const s of [-1, 1]) HX.wrocks.push(K.rbox(2.4, 1.6, 2.4, 0.2, K.holo('#ffb050'), EX[0] + s * 6.2, 0.8, EX[2] + 0.5, sc));
    // ================= characters =================
    BRICK = K.stick({ jacket: '#6a3a9a', pants: '#2a2a40', moustache: '#c8c8c8', collar: '#f4efe4', tie: '#f2c230', vest: '#e8d8b0', badge: true, build: 'stout', boots: '#1a1a1a' }, { key: 'brick' });
    NELL = K.stick({ jacket: '#2a7aa8', pants: '#3a3a4a', hat: 'hardhat', hatColor: '#f4f4f0', hairStyle: 'ponytail', hair: '#c8502a', glasses: '#1a1a1a', vest: '#ff7a1a', belt: '#3a2418', boots: '#5a3a24' }, { key: 'nell' });
    BEAV = K.animal('beaver', { seed: 2, scale: 1.4 });
    COW = K.animal('cow', { seed: 5, scale: 0.9 });
    for (let k = 0; k < 3; k++) DUCKS.push(K.animal('duck', { seed: 30 + k, scale: 1.2 }));
    const eo = [{ jacket: '#c0632a', pants: '#2c3e5a', hat: 'cap', hatColor: '#2a62c8', scarf: '#f2c230' }, { jacket: '#3a7a4a', pants: '#3a2a1e', hairStyle: 'bun', hair: '#8a5a34', glasses: true }, { jacket: '#d8a830', pants: '#2a2a30', hat: 'beanie', hatColor: '#c0392b', hairStyle: 'curly' }, { jacket: '#a83a3a', pants: '#2c3e5a', hairStyle: 'spiky', hair: '#1a1a1a', scarf: '#2a7a4a' }];
    eo.forEach((o, k) => EXTRAS.push(K.stick({ ...o, collar: '#ffffff' }, { key: 'ex' + k })));
    K.addClouds(8, 700, 150);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s), sc = K.scene;
    const ex = f >= 1236 && f < 1600, night = f < 96 || (f >= 966 && f < 1236), rainy = (f >= 607 && f < 1236), flash = f < 96;
    // ---------- water levels, bulge, burst ----------
    const g = flash ? f + 14 : f - F.POPPED + 2;               // burst clock (the hook is a flash-forward)
    const bursting = (flash || f >= F.POPPED - 2) && f < 1600, bu = bursting ? clamp(g / 60, 0, 1) : 0, gone = f >= 1600;
    const level = f < 607 ? 3.0 : f < 1600 ? lerp(3.0, 5.7, sm(612, F.BRIM + 4, f)) : 5.2;
    const bulge = flash ? 1 : sm(F.BULGED - 6, F.BELLY + 10, f) * 0.9 + sm(F.PROPPING, F.BENT + 6, f) * 0.25;
    BSEG.forEach((s, k) => { if (k === 10) { s.visible = !ex && !gone; s.position.z = 1.52 + bulge * 0.9; return; }
      const mid = Math.sin(Math.PI * (k + 0.5) / 10), pop = k >= 3 && k <= 6 && bursting; s.visible = !ex && !(gone && pop);
      if (pop) { const d = bu * (1 + (k % 2) * 0.4); s.position.set(BX - 4.5 + k + (k - 4.5) * d * 1.5, DH / 2 + d * 3 * Math.sin(Math.PI * Math.min(1, bu * 1.4)) - d * 3.2, d * 16 + bulge * mid); s.rotation.set(d * 2.2 * (k % 2 ? 1 : -1), d, d * 1.5); }
      else { s.position.set(BX - 4.5 + k, DH / 2, (bulge * 1.2 + (f >= F.PROPPING && !bursting ? 0.1 * Math.sin(f * 0.8) : 0)) * mid); s.rotation.set(0, 0, 0); } });
    NSEG.forEach((s) => { s.visible = !ex; }); RSEG.forEach((s, k) => { s.visible = !ex && f >= 1714 && k / 12 < sm(1714, 1800, f) * 1.0 + 0.001; });
    const lb = bursting ? lerp(level, 0.6, sm(0, 70, g)) : gone ? 0.0 : level;
    LAKEB.visible = !ex && lb > 0.05; LAKEB.scale.y = Math.max(0.01, lb); LAKEB.position.set(BX, lb / 2, -23);
    LAKEN.visible = !ex; LAKEN.scale.y = level; LAKEN.position.set(NX, level / 2, -21 - 1.5);
    const fl = bursting ? 1.5 * sm(10, 70, g) : f >= 1600 && f < 1714 ? 1.2 : 0; FLOOD.visible = !ex && fl > 0.02; FLOOD.scale.y = Math.max(0.01, fl); FLOOD.position.set(-4, fl / 2, 36);
    GUSH.visible = !ex && bursting && g > 2 && g < 120; { const h = DH * (1 - sm(40, 110, g)); GUSH.scale.set(1, Math.max(0.1, h), lerp(2, 16, sm(0, 30, g))); GUSH.position.set(BX, h / 2, 1.5 + GUSH.scale.z / 2); }
    LOGS.forEach((l, k) => { const on = !ex && f >= F.PROPPING - 4 && !(f >= 1600); const bent = sm(F.BENT - 4, F.BENT + 10, f); const pop = bursting ? bu : 0; l.visible = on;
      const xx = BX - 4 + k * 1.15; l.scale.set(1, 4.4, 1); l.position.set(xx + pop * (k - 3.5) * 2, 0, 2.6 + pop * 10); l.rotation.set(-0.75 - bent * 0.25 + pop * 1.4, 0, bent * 0.3 * (k % 2 ? 1 : -1)); });
    // ---------- characters ----------
    let bp = { x: BX, y: DH, z: 0, yaw: 0.2 };
    if (flash) bp = { x: -4, y: 2.1, z: 30, yaw: -2.6 };
    else if (f >= 96 && f < 240) bp = { x: -2, z: MZ - 0.6, yaw: 1.2 };
    else if (f >= 393 && f < 458) bp = { x: BX + 2.0, y: DH, z: 0.2, yaw: Math.PI - 0.5 };
    else if (f >= 762 && f < 972) bp = { x: BX + 5.5, z: 5.2, yaw: Math.PI + 0.5 };
    else if (f >= 972 && f < 1236) bp = { x: -4, y: 2.1, z: 30, yaw: -2.4 };
    else if (f >= 1600) bp = { x: BX + 2.5, z: 3.6, yaw: 0.5 };
    const bk = [[0, 'panic', { expr: 'scared', sweat: true }], [96, 'wave', { expr: 'proud' }], [F.SCHOOL, 'point', { expr: 'grin' }], [240, 'hammer', { expr: 'proud' }], [F.STRAIGHT - 6, 'point', { expr: 'smug', talk: true }], [F.SAID, 'hips', { expr: 'proud' }],
      [325, 'cross', { expr: 'smug' }], [F.BANANA, 'point', { expr: 'gloat' }], [F.LAUGHED - 4, 'laugh', { expr: 'laugh' }], [F.HAT, 'shock', { expr: 'shock' }], [458, 'cross', { expr: 'smug' }],
      [607, 'idle', { expr: 'neutral' }], [762, 'shock', { expr: 'nervous', sweat: true }], [F.YELLED - 6, 'push', { expr: 'yell', talk: true }], [F.BENT, 'shock', { expr: 'scared', sweat: true }], [972, 'panic', { expr: 'scared', sweat: true }],
      [F.CAR, 'reach', { expr: 'shock' }], [F.HONKED, 'facepalm', { expr: 'pained' }], [1162, 'idle', { expr: 'sad' }], [1600, 'hammer', { expr: 'sad' }], [F.STRONG - 8, 'shrug', { expr: 'pained', talk: true }], [1825, 'clap', { expr: 'smile' }]];
    BRICK.set(T.act(f, bk.map((q) => q[1] === 'laugh' ? [q[0], 'celebrate', q[2]] : q), { seed: 3, blink: blink(3) }), { ...bp, visible: !ex && !(f >= 458 && f < 607) && !(f >= 1162 && f < 1236) });
    // Brick's tophat: on his head until it flies into the lake
    { const hf = sm(F.HAT - 2, F.LAKE + 6, f); const onHead = f < F.HAT - 2;
      if (onHead && !ex) { BRICK.head.add(HAT); HAT.position.set(0, 0.24, 0); HAT.rotation.set(-0.1, 0, 0.08); HAT.scale.setScalar(1.25); HAT.visible = true; }
      else { sc.add(HAT); HAT.scale.setScalar(1.6); const a = [BX + 2.0, DH + 2.6, 0.2], b = [BX + 0.5, level + 0.1, -6]; HAT.position.set(lerp(a[0], b[0], hf), lerp(a[1], b[1], hf) + 3 * Math.sin(Math.PI * hf), lerp(a[2], b[2], hf)); HAT.rotation.set(hf * 6, hf * 3, 0); HAT.visible = !ex && f < 1236 && !(f >= 607 && f < 1236 && hf >= 1 && f > 700); } }
    const [ncx, ncz] = arcPt(NX, 0);
    let np = { x: ncx - 1.5, y: DH, z: ncz + 0.15, yaw: 0.2 };
    if (f >= 96 && f < 240) np = { x: 2.5, z: MZ + 0.4, yaw: -1.4 };
    const nk = [[0, 'cross', { expr: 'smug' }], [96, 'wave', { expr: 'smile' }], [325, 'hammer', { expr: 'proud' }], [F.BANANA, 'hips', { expr: 'grin' }], [F.LAUGHED, 'cross', { expr: 'deadpan' }], [458, 'wave', { expr: 'smile' }],
      [607, 'idle', { expr: 'neutral' }], [972, 'sit', { expr: 'sleepy' }], [F.CREAK, 'sit', { expr: 'sleepy' }], [1600, 'cheer', { expr: 'laugh' }], [1825, 'clap', { expr: 'laugh' }]];
    NELL.set(T.act(f, nk, { seed: 6, blink: f >= 972 && f < 1236 ? 1 : blink(6) }), { ...np, seat: 0.0, visible: !ex && !(f >= 762 && f < 972) });
    // Bramble the beaver
    let bv = { x: ncx + 0.8, y: DH, z: ncz + 0.1, yaw: 0.3, mode: 'sit', expr: f < 40 ? 'shock' : 'happy' };
    if (f >= 96 && f < 240) bv = { x: 4, z: MZ - 0.4, yaw: -1.2, mode: 'sit', expr: 'neutral' };
    else if (f >= 240 && f < 458) bv = { x: NX - 3, y: 0, z: 4, yaw: 0, mode: 'stand', expr: f >= F.LAUGHED ? 'angry' : 'neutral' };
    else if (f >= 458 && f < 607) { const u = sm(462, F.MOVED + 6, f); const a = arcPt(NX, -0.6); bv = { x: lerp(a[0], ncx + 0.8, u), y: DH, z: lerp(a[1], ncz + 0.1, u), yaw: Math.PI / 2 - 0.2, mode: u < 1 ? 'walk' : f >= F.PILLOW ? 'sleep' : 'sit', expr: f >= F.PILLOW ? 'sleepy' : 'happy' }; }
    else if (f >= 972 && f < 1236) bv = { x: ncx + 0.8, y: DH, z: ncz + 0.1, yaw: 0.3, mode: 'sleep', expr: 'sleepy' };
    BEAV.set(f, { ...bv, visible: !ex && !(f >= 762 && f < 972) });
    PILLOW.visible = !ex && f >= F.PILLOW - 6 && f < 1600 && !(f >= 762 && f < 972); PILLOW.position.set(ncx + 0.8, DH + 0.1, ncz - 0.25); PILLOW.rotation.set(0, 0.3, 0);
    if (f >= 1825) { BEAV.head.add(HARD); HARD.position.set(0, 0.13, 0.0); HARD.visible = true; HARD.scale.setScalar(1.0); } else { HARD.visible = false; }
    // cow surfing on a sofa, Brick's car, ducks, townsfolk, tubes
    const surf = bursting && !flash ? sm(F.COW - 10, F.SOFA + 50, f) : flash ? 0.5 : 0;
    SOFA.visible = COW.root.visible = !ex && (flash || (f >= F.COW - 10 && f < 1162)); SOFA.position.set(lerp(-26, 14, surf), fl - 0.1, MZ + 0.6 * Math.sin(f * 0.1)); SOFA.rotation.set(0.05 * Math.sin(f * 0.2), 0.3 * Math.sin(f * 0.05) - Math.PI / 2, 0.06 * Math.sin(f * 0.15));
    COW.set(f, { x: SOFA.position.x, y: fl + 0.15, z: SOFA.position.z, yaw: Math.PI / 2 + 0.3 * Math.sin(f * 0.07), mode: 'stand', expr: 'happy', visible: SOFA.visible });
    const carU = sm(F.CAR - 20, F.HONKED + 20, f); CAR.g.visible = !ex && f >= 1080 && f < 1162; CAR.g.position.set(lerp(-14, 6, carU), fl - 0.35, 33.5); CAR.g.rotation.set(0.05 * Math.sin(f * 0.15), 0.4 * Math.sin(f * 0.04), 0.06 * Math.sin(f * 0.2));
    DUCKS.forEach((d, k) => { const u = sm(F.DUCKS - 6 + k * 8, F.INDOORS + 6 + k * 8, f); d.set(f, { x: lerp(BAKX + 3 + k * 0.8, BAKX, u), z: lerp(MZ + 0.5 + k * 0.4, MZ - 3.0, u), yaw: -2.2, mode: u > 0 && u < 1 ? 'walk' : 'stand', expr: 'neutral', visible: !ex && f >= 697 && f < 762 && u < 0.98 }); });
    EXTRAS.forEach((e, k) => { let p, act;
      if (f >= 96 && f < 240) { p = { x: -8 + k * 3.6, z: MZ + (k % 2) - 0.5, yaw: 1.4 + 0.2 * k }; act = [[0, ['wave', 'clap', 'idle', 'phone'][k], { expr: 'smile' }]]; }
      else if (bursting && !flash) { p = { x: -10 + k * 2.4, z: 30 + (k % 2) * 1.5, y: 0, yaw: -2.6 }; act = [[0, 'panic', { expr: 'scared', sweat: true }]]; }
      else if (f >= 1600 && f < 1714) { p = { x: -16 + k * 6.5, y: 1.2 - 0.9, z: MZ - 0.8 + (k % 2) * 1.5, yaw: 1.4 }; act = [[0, k % 2 ? 'celebrate' : 'cheer', { expr: 'laugh' }]]; }
      e.set(T.act(f, act || [[0, 'idle']], { seed: 30 + k, blink: blink(30 + k) }), { ...(p || { x: 0, z: 0 }), visible: !!p && !ex }); });
    TUBES.forEach((t, k) => { t.visible = !ex && f >= 1600 && f < 1714 && k < 4; t.position.set(-16 + k * 6.5, 1.2, MZ - 0.8 + (k % 2) * 1.5); });
    // ---------- explainer ----------
    HX.g.visible = ex && f < 1493; HX.arch.forEach((s, k) => { s.material = s.material; }); HX.rocks.forEach((r) => { r.scale.setScalar(1 + 0.06 * sm(F.ROCK - 4, F.ROCK + 10, f) * Math.sin(f * 0.6)); });
    HX.push.forEach((t, k) => t.show(ex && f < 1360 ? sm(F.CURVE - 6 + k * 2, F.CURVE + 10 + k * 2, f) : 0)); HX.side.forEach((t) => t.show(ex && f < 1360 ? sm(F.SIDEWAYS - 4, F.ROCK + 10, f) : 0));
    HX.bridge.visible = ex && f >= 1360 && f < 1493; HX.bridge.rotation.set(-Math.PI / 2 * sm(F.SIDE - 10, F.SIDE + 14, f), 0, 0); HX.bridge.position.y = lerp(0.5, 1.0, sm(F.SIDE - 10, F.SIDE + 14, f));
    HX.bridge.children.forEach((v, k) => { if (k < 9) v.scale.setScalar(1 + 0.05 * sm(F.TIGHTER - 4, F.TIGHTER + 10, f)); });
    const wb = sm(F.BENDS - 4, F.BENDS + 16, f), wbr = sm(F.BREAKS - 2, F.BREAKS + 14, f);
    HX.wall.forEach((s, k) => { s.visible = ex && f >= 1493; const mid = Math.sin(Math.PI * (k + 0.5) / 10); const br = k >= 4 && k <= 5 ? wbr : 0; s.position.set(EX[0] - 4.5 + k + (k - 4.5) * br * 0.6, 1.0 + br * 1.2 * Math.sin(Math.PI * br), EX[2] + 0.5 + wb * 1.4 * mid + br * 5); s.rotation.set(br * 2, 0, br); });
    HX.wpush.forEach((t, k) => t.show(ex && f >= 1493 ? sm(F.WALL - 4 + k * 2, F.NOTHING + k * 2, f) : 0)); HX.wrocks.forEach((r) => { r.visible = ex && f >= 1493; });
    // ---------- shots ----------
    let cam, dof, u; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const body = (x, z, y = 0, h = 2.3) => [[x, y, z], [x, y + h, z]];
    const BD = [[BX - 6, 0, -2], [BX + 6, DH + 1, 3]], ND = [[NX - 6, 0, -1.5], [NX + 6, DH + 1, 3]];
    if (sh(0, 50)) {                          // 1. hook (flash-forward): Brick's thick dam bursts at midnight, water gushing (wide downstream)
      cam = K.fit([...BD, [BX, 0, 10], ...body(-4, 30, 2.1)], { yaw: 75, pitch: 12, fov: 46, margin: 0.72, maxDist: 24 }); cam.fov *= K.push(u, 0.05); const s = K.shake(f, 0, 0.08, 40); cam.pos[1] += s[1];
    } else if (sh(50, 96)) {                  // 2. ... it burst first: pull across to Nell's thin dam, still standing (wide over the valley)
      cam = K.fit([...BD, ...ND], { yaw: 90, pitch: 14, fov: 46, margin: 0.75, maxDist: 34 }); cam.fov *= K.punch(f, F.FIRST, 0.06, 6);
    } else if (sh(96, 165)) {                 // 3. Puddleford: a bakery, a school (street wide)
      cam = { pos: [14, 2.6, MZ + 0.6], look: [-4, 2.4, MZ - 1.2], fov: 50 * K.push(u, 0.06) }; cam.fov *= K.punch(f, F.SCHOOL, 0.06, 6);
    } else if (sh(165, 240)) {                // 4. ... and four hundred garden gnomes, dams looming above the town (high wide)
      cam = K.fit([[-30, 0, MZ + 3], [30, 0, MZ - 3], [BX, DH, 0], [NX, DH, 0]], { yaw: 95, pitch: 28, fov: 50, margin: 0.75, maxDist: 40 }); cam.fov *= K.punch(f, F.GNOMES, 0.06, 6);
    } else if (sh(240, 288)) {                // 5. Brick built his dead straight (wide on the straight dam, glowing ruler line)
      cam = K.fit([...BD, ...body(bp.x, bp.z, DH)], { yaw: 60, pitch: 14, fov: 44, margin: 0.8, maxDist: 18 }); cam.fov *= K.punch(f, F.STRAIGHT, 0.06, 6);
    } else if (sh(288, 325)) {                // 6. "Straight is strong!" (Brick reaction on the crest)
      cam = { pos: [bp.x + 1.8, DH + 1.8, bp.z + 3.0], look: [bp.x, DH + 1.4, bp.z], fov: 42 * K.push(u, 0.05) }; dof = { focus: 3.5, cinf: 10 };
    } else if (sh(325, 393)) {                // 7. Nell built hers thin, bent like a banana (high wide on the arch)
      cam = K.fit([...ND, ...body(np.x, np.z, DH)], { yaw: 110 - 12 * u, pitch: 30, fov: 44, margin: 0.8, maxDist: 18 }); cam.fov *= K.punch(f, F.BANANA, 0.08, 6);
    } else if (sh(393, 458)) {                // 8. Brick laughed so hard his hat fell in the lake (full shot, lake behind)
      cam = { pos: [BX - 2.5, DH + 3.0, -7.0], look: [bp.x, DH + 1.0, bp.z - 1], fov: 50 }; cam.fov *= K.punch(f, F.HAT, 0.1, 6);
    } else if (sh(458, 530)) {                // 9. Bramble the beaver moves in with Nell (wide along the arch crest)
      cam = K.fit([...ND.map((p) => [p[0], p[1] + 2, p[2]]), [BEAV.root.position.x, DH, BEAV.root.position.z]], { yaw: 75, pitch: 16, fov: 44, margin: 0.75, maxDist: 16 }); cam.fov *= K.punch(f, F.EXACTLY, 0.06, 6);
    } else if (sh(530, 607)) {                // 10. he brought his own pillow (Bramble close)
      cam = { pos: [ncx + 2.4, DH + 1.4, ncz + 3.0], look: [ncx + 0.6, DH + 0.4, ncz], fov: 40 * K.push(u, 0.06) }; dof = { focus: 3.6, cinf: 10 };
    } else if (sh(607, 652)) {                // 11. nine days of rain (wide: both dams, lakes rising)
      cam = K.fit([...BD, ...ND], { yaw: 80, pitch: 22, fov: 46, margin: 0.75, maxDist: 34 }); cam.fov *= K.punch(f, F.NINE, 0.06, 6);
    } else if (sh(652, 697)) {                // 12. both lakes to the brim (low on Nell's lake edge)
      cam = { pos: [NX + 2.5, DH + 2.6, 1.0], look: [NX - 1, DH - 0.4, -8], fov: 50 * K.push(u, 0.06) };
    } else if (sh(697, 762)) {                // 13. so hard the ducks went indoors (street, ducks marching into the bakery)
      cam = { pos: [BAKX + 6, 2.2, MZ + 1.4], look: [BAKX, 1.4, MZ - 2.6], fov: 48 * K.punch(f, F.INDOORS, 0.08, 6) }; cam.fov *= K.punch(f, F.INDOORS, 0.08, 6);
    } else if (sh(762, 808)) {                // 14. Brick's straight dam bulged in the middle (wide downstream)
      cam = K.fit([...BD, ...body(bp.x, bp.z)], { yaw: 75, pitch: 6, fov: 46, margin: 0.8, maxDist: 18 }); cam.fov *= K.punch(f, F.BULGED, 0.08, 6);
    } else if (sh(808, 852)) {                // 15. like a belly after dinner (low angle up the bulge)
      cam = { pos: [BX + 2.5, 0.6, 9], look: [BX, 3.2, 0.8], fov: 50 * K.punch(f, F.BELLY, 0.1, 6) };
    } else if (sh(852, 910)) {                // 16. "Straight is strong!" Brick props it with forty logs (full shot)
      cam = K.fit([...body(bp.x, bp.z), [BX - 4, 0, 1], [BX + 4.5, 4.5, 3]], { yaw: 80, pitch: 10, fov: 44, margin: 0.9, maxDist: 13 }); cam.fov *= K.punch(f, F.FORTY, 0.06, 6);
    } else if (sh(910, 972)) {                // 17. the logs bent too (side wide)
      cam = K.fit([...BD, [BX, 0, 5]], { yaw: 25, pitch: 10, fov: 44, margin: 0.8, maxDist: 16 }); cam.fov *= K.punch(f, F.BENT, 0.1, 6); const s = K.shake(f, F.BENT, 0.04, 12); cam.pos[1] += s[1];
    } else if (sh(972, 1036)) {               // 18. midnight: the middle popped (wide, night, lightning)
      cam = K.fit([...BD, [BX, 0, 12]], { yaw: 100, pitch: 12, fov: 46, margin: 0.75, maxDist: 22 }); cam.fov *= K.punch(f, F.POPPED, 0.12, 6); const s = K.shake(f, F.POPPED, 0.1, 30); cam.pos[0] += s[0]; cam.pos[1] += s[1];
    } else if (sh(1036, 1099)) {              // 19. the lake went downtown: a cow surfs by on a sofa (tracking)
      cam = { pos: [SOFA.position.x + 8, 3.2, MZ + 1.6], look: [SOFA.position.x, 1.6, MZ], fov: 46 * K.punch(f, F.SOFA, 0.08, 6) };
    } else if (sh(1099, 1162)) {              // 20. Brick's car floated past Brick. It honked. (full shot: Brick on the rock, car floating by)
      cam = { pos: [bp.x + 7.5, 4.2, 39], look: [bp.x + 2, 2.0, 31.5], fov: 48 * K.punch(f, F.HONKED, 0.1, 6) };
    } else if (sh(1162, 1236)) {              // 21. Nell's dam didn't even creak. Why? (wide on the arch at night, sleepers on top)
      cam = K.fit([...ND], { yaw: 70 + 15 * u, pitch: 16, fov: 46, margin: 0.8, maxDist: 18 }); cam.fov *= K.punch(f, F.WHY, 0.08, 6);
    } else if (sh(1236, 1300)) {              // 22. explainer: a curve passes the push sideways (top view)
      cam = { pos: [EX[0] + 1, 17, EX[2] + 9], look: [EX[0], 0.5, EX[2] - 1], fov: 46 * K.push(u, 0.05) };
    } else if (sh(1300, 1360)) {              // 23. ... into the rock walls (angled)
      cam = { pos: [EX[0] + 9, 7, EX[2] + 9], look: [EX[0], 1.2, EX[2] - 1], fov: 46 * K.punch(f, F.ROCK, 0.08, 6) };
    } else if (sh(1360, 1420)) {              // 24. an arch, lying on its side (the stone bridge tips over)
      cam = K.fit([[EX[0] - 4, 0, EX[2]], [EX[0] + 4, 4, EX[2] + 4]], { yaw: 90, pitch: 14, fov: 44, margin: 0.85, maxDist: 14 }); cam.fov *= K.punch(f, F.SIDE, 0.06, 6);
    } else if (sh(1420, 1493)) {              // 25. the harder it's pushed, the tighter it wedges (top view of the bridge-dam)
      cam = { pos: [EX[0] + 2, 12, EX[2] + 8], look: [EX[0], 0.8, EX[2] + 1.5], fov: 44 * K.punch(f, F.TIGHTER, 0.08, 6) };
    } else if (sh(1493, 1546)) {              // 26. a straight wall has nothing to lean on (top-angled)
      cam = { pos: [EX[0] + 2, 11, EX[2] + 10], look: [EX[0], 0.8, EX[2] - 1], fov: 46 * K.push(u, 0.05) };
    } else if (sh(1546, 1600)) {              // 27. it bends in the middle and breaks (low angle)
      cam = { pos: [EX[0] + 6, 3, EX[2] + 9], look: [EX[0], 1, EX[2] + 1], fov: 46 * K.punch(f, F.BREAKS, 0.1, 6) }; const s = K.shake(f, F.BREAKS, 0.06, 14); cam.pos[1] += s[1];
    } else if (sh(1600, 1660)) {              // 28. by morning Puddleford had a swimming pool (street wide, tubes)
      cam = { pos: [10, 4.0, MZ + 0.8], look: [-10, 1.2, MZ - 0.4], fov: 50 * K.push(u, 0.05) }; cam.fov *= K.punch(f, F.POOL, 0.06, 6);
    } else if (sh(1660, 1714)) {              // 29. it was Main Street (high wide: town flooded, dams above)
      cam = K.fit([[-30, 0, MZ + 3], [30, 0, MZ - 3], [BX, DH, 0], [NX, DH, 0]], { yaw: 80, pitch: 32, fov: 50, margin: 0.75, maxDist: 40 }); cam.fov *= K.punch(f, F.MAIN, 0.06, 6);
    } else if (sh(1714, 1770)) {              // 30. Brick rebuilt his dam, bent like a banana (wide on the new arch going up)
      cam = K.fit([...BD, ...body(bp.x, bp.z)], { yaw: 80, pitch: 18, fov: 44, margin: 0.8, maxDist: 18 }); cam.fov *= K.punch(f, F.BANANA2, 0.06, 6);
    } else if (sh(1770, 1825)) {              // 31. "Straight is... strong-ish." (Brick close, hatless)
      cam = { pos: [bp.x + 1.4, 1.8, bp.z + 2.8], look: [bp.x, 1.4, bp.z], fov: 42 * K.push(u, 0.05) }; dof = { focus: 3.1, cinf: 10 };
    } else {                                  // 32. Bramble's "Dam Engineer" hard hat (close, then pull back to both dams)
      const v = sm(1855, 1920, f); cam = { pos: [lerp(ncx + 3.6, 2, v), lerp(DH + 1.8, 24, v), lerp(ncz + 4.6, 36, v)], look: [lerp(ncx + 0.6, 0, v), lerp(DH + 0.5, 2, v), lerp(ncz, 0, v)], fov: lerp(36, 56, v) };
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    if (night && !ex && f > 20 && f % 97 < 3) cam.flash = 0.35;
    // ---------- effects + graphics ----------
    if (bursting && g < 140 && !ex) { K.sparks(f, 0, 3000, [BX, DH * 0.5, 2.0], { dir: [0, 0.9, 1.4], spread: 3.0, rate: 90, speed: 8, life: 22, color: '#f4fbff', seed: 5 }); if (f % 2 === 0) K.puff(f, f, BX + (hash(f) - 0.5) * 4, 4 + hash(f + 1) * 6, 6, 1.4, '#e8f4ff'); if (!flash) K.steam(f, [BX, 1.0, 5], { rate: 6, size: 0.7, rise: 1.2, drift: [0, 0.6], dark: 0 }); }
    if (f >= F.BENT - 4 && f < 972 && !ex) K.sparks(f, F.BENT - 4, 972, [BX, 3, 1.6], { dir: [0, -0.4, 1], spread: 1.4, rate: 6, speed: 1.5, life: 12, color: '#c8c4bc', seed: 3 });
    if (rainy && !ex) K.rain(f, cam.look, { area: 18, count: 220 });
    if (!rainy && !ex) K.leaves(f, cam.look, { area: 14, count: 8, fall: 0.5, colors: ['#4f9a3a', '#6ab84a', '#f2c12e'] });
    K.mist(f, 92, 12); K.mist(f, 1230, 14); K.mist(f, 1594, 14);
    K.badge(f, F.THICK, '2x THICKER', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: F.BURST - 2 });
    K.badge(f, F.BURST, 'BURST FIRST', { sx: 0.5, sy: 0.2 }, { style: 'stamp', f1: 94 });
    K.badge(f, F.GNOMES, '400 GNOMES', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 236 });
    K.badge(f, F.STRAIGHT, 'STRAIGHT + THICK', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 322 });
    K.badge(f, F.THIN, 'THIN + BENT', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 390 });
    K.badge(f, F.EXACTLY, 'DAMS BUILT: 1', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 600 });
    if (f >= F.NINE && f < 760) K.badge(f, F.NINE, 'DAY ' + Math.min(9, 1 + Math.floor(9 * sm(F.NINE, F.BRIM, f))) + ' OF RAIN', { sx: 0.5, sy: 0.14 }, { icon: 'drop', f1: 758 });
    K.badge(f, F.BRIM, 'LAKES: FULL', { sx: 0.5, sy: 0.24 }, { icon: 'warn', f1: 694 });
    K.badge(f, F.BULGED, 'BULGE', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 850 });
    K.badge(f, F.FORTY, '40 LOGS', { sx: 0.5, sy: 0.2 }, { icon: 'weight', f1: F.BENT - 2 });
    K.badge(f, F.BENT, 'LOGS: BENT', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 968 });
    K.badge(f, F.POPPED, 'POP!', { sx: 0.5, sy: 0.2 }, { style: 'stamp', f1: 1034 });
    K.badge(f, F.CREAK, 'NOT A CREAK', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1232 });
    K.badge(f, F.SIDEWAYS, 'PUSH GOES SIDEWAYS', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1356 });
    K.badge(f, F.TIGHTER, 'PUSHED HARDER = WEDGED TIGHTER', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: 1490 });
    K.badge(f, F.NOTHING, 'NOTHING TO LEAN ON', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: F.BREAKS - 2 });
    K.badge(f, F.POOL, 'NEW POOL: MAIN ST.', { sx: 0.5, sy: 0.2 }, { icon: 'drop', f1: 1710 });
    K.badge(f, F.ENGINEER, 'DAM ENGINEER', { sx: 0.5, sy: 0.2 }, { style: 'stamp', f1: 1919 });
    let L;
    if (ex) L = K.light('night', { az: 120, el: 40, exposure: 1.3 });
    else if (night) L = K.light('night', { az: 100, el: 40, hemi: 1.1, sunI: 1.6, exposure: 1.75 });
    else if (rainy) L = K.light('overcast', { az: 110, el: 40, exposure: 1.3 });
    else L = K.light(f >= 1600 ? 'morning' : 'golden', { az: 110, el: 32, shadowExt: 36, exposure: 1.2 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
