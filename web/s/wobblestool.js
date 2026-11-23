// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why Milking Stools Have Three Legs" — invented story, engine: The Upgrade (SCRIPTS.md §000). 64 s TikTok.
// Tobias "upgrades" Grandma Ilse's three-legged stool (Gerald) to a deluxe four-legged one (cupholder, heated seat), then six
// legs, then the ten-legged Centipede Deluxe that walks across the barn; cardboard, then Grandma's best cheese under the legs;
// the cheese truck honks at 5:58 -> tripod on a rocky beach / a fourth leg always hangs in the air -> Gerald wins -> coat rack.
import { TOTAL, LINES, wf } from './wobblestool_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
let COATW;
let THREE, TOBIAS, ILSE, DRIVER, DAISY, COW2, COW3, CAT, GERALD, DELUXE, SIX, CENT, BUCKET, PUDDLE, CUP, CARD = [], CHEESE, TRUCK, CLOCKH, CLOCKM, CAFE, CAFECUP, TRIPOD, TRI_TR, GAP_TR, HOLO, COAT, EXTRA_HAT;
let F = {};
const CAF = 100, BEACH = 200;                     // cheap-cafe cutaway, rocky-beach cutaway
const floorY = (x, z) => 0.035 * Math.sin(x * 7.3 + 1) * Math.cos(z * 6.1) + 0.02 * Math.sin(x * 13 + z * 9);
const SPOT = [0.15, 0.55];                         // the milking spot (stool position)

function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; }
function plate(K, text, w, h, bg, fg) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), K.set.textMat(text, { bg, fg, w: 512, h: Math.round(512 * h / w), border: false })); return m; }

function stool(K, o) {                             // o: legs, seat 'round'|'square'|'bench', color, len
  const g = new THREE.Group(); K.scene.add(g); const seat = o.mat, legM = o.legMat; const H = o.h || 0.42; g.legs = [];
  if (o.seat === 'round') { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.05, 28), seat); s.position.y = H; g.add(s); }
  else if (o.seat === 'bench') { K.rbox(o.len, 0.06, 0.34, 0.03, seat, 0, H, 0, g); }
  else { K.rbox(0.42, 0.06, 0.42, 0.05, seat, 0, H, 0, g); }
  const pts = []; if (o.seat === 'bench') { const n = o.legs / 2; for (let i = 0; i < n; i++) for (const z of [-0.13, 0.13]) pts.push([-o.len / 2 + 0.1 + i * (o.len - 0.2) / (n - 1), z]); }
  else for (let i = 0; i < o.legs; i++) { const a = i / o.legs * Math.PI * 2 + (o.legs === 4 ? Math.PI / 4 : 0); pts.push([Math.cos(a) * 0.17, Math.sin(a) * 0.17]); }
  for (const [x, z] of pts) { const sp = o.seat === 'round' ? 1.35 : 1.0; const l = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.018, H, 10), legM); const bx = x * sp, bz = z * sp;
    l.position.set((x + bx) / 2, H / 2, (z + bz) / 2); l.rotation.set(-(bz - z) / H, 0, (bx - x) / H); g.add(l); const ft = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 6), o.footMat || legM); ft.position.set(bx, 0.01, bz); g.add(ft); g.legs.push({ x: bx, z: bz, foot: ft }); }
  g.traverse((m) => { if (m.isMesh) m.castShadow = true; }); return g; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { UPG: wf(0, 'upgraded'), FOUR: wf(0, 'four'), CUPH: wf(0, 'cupholder'), HEATED: wf(0, 'heated'), SIX: wf(1, 'six'), TRUCK: wf(1, 'truck'), LEFT: wf(1, 'left'), THREE: wf(2, 'three'), CRACK: wf(2, 'crack'), GERALD: wf(2, 'gerald'),
      SAT: wf(3, 'sat'), ROCKED: wf(3, 'rocked'), CL1: wf(3, 'clack'), DAISY: wf(4, 'daisy'), SEASICK: wf(4, 'seasick'), KNOCKED: wf(4, 'knocked'), TAIL: wf(4, 'tail'),
      SIXL: wf(5, 'six'), TWICE: wf(5, 'twice'), TABLE: wf(5, 'table'), CAFE: wf(5, 'cafe'), TEN: wf(6, 'ten'), CENT: wf(6, 'centipede'), WOBBLED: wf(6, 'wobbled'), WALKED: wf(6, 'walked'),
      FIX: wf(7, 'fix'), CARD: wf(7, 'cardboard'), TWO: wf(7, 'two'), RAN: wf(7, 'ran'), CHEESE: wf(7, 'cheese'), AT: wf(8, 'at'), HONKED: wf(8, 'honked'), ONE: wf(8, 'one'), INTO: wf(8, 'into'),
      WHY: wf(9, 'why'), NEVER: wf(9, 'never'), THREEF: wf(10, 'three'), TOUCH: wf(10, 'touch'), TRIPOD: wf(10, 'tripod'), BEACH: wf(10, 'beach'), BUMPY: wf(11, 'bumpy'), FOURTH: wf(11, 'fourth'), AIR: wf(11, 'air'), SIT: wf(11, 'sit'), CL2: wf(11, 'clack'),
      GSAT: wf(12, 'grandma'), WOBBLE: wf(12, 'wobble'), FULL: wf(12, 'full'), STILL: wf(13, 'still'), RACK: wf(13, 'coat'), WOBBLES: wf(13, 'wobbles') };
    const wood = K.mat('wood', '#8a5a34', { detail: 0.5 }), dwood = K.mat('wood', '#5a3a24', { detail: 0.6 }), gold = K.gold(), chrome = K.chrome(), dark = K.paint('#2a2c34', { rough: 0.4 });
    // ================= the barn =================
    const BG = K.group();
    const fl = new THREE.PlaneGeometry(14, 12, 140, 120); fl.rotateX(-Math.PI / 2); const FP = fl.attributes.position; for (let i = 0; i < FP.count; i++) FP.setY(i, floorY(FP.getX(i), FP.getZ(i))); fl.computeVertexNormals();
    K.add(fl, K.mat('rock', '#9a8a74', { detail: 0.35 }), 0, 0, 0, BG, { cast: false });
    for (let k = 0; k < 160; k++) { const h = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.01, 0.01), K.paint('#e8c870', { rough: 0.9 })); h.position.set((hash(k) - 0.5) * 12, 0.04, (hash(k + 1) - 0.5) * 10); h.rotation.y = hash(k + 2) * 3; BG.add(h); }
    const plank = K.mat('wood', '#9a4a32', { detail: 0.7 });
    K.slab(-7, -2.2, 0, 4.5, -5.2, -5.0, plank, BG); K.slab(2.2, 7, 0, 4.5, -5.2, -5.0, plank, BG); K.slab(-2.2, 2.2, 3.4, 4.5, -5.2, -5.0, plank, BG);
    K.slab(-7.2, -7, 0, 4.5, -5, 6, plank, BG); K.slab(7, 7.2, 0, 4.5, -5, 6, plank, BG);
    for (let k = 0; k < 6; k++) K.slab(-7, 7, 4.2, 4.45, -5 + k * 2.1, -4.75 + k * 2.1, dwood, BG);
    for (const x of [-4.5, 4.5]) for (const z of [-3, 1, 4]) K.slab(x - 0.12, x + 0.12, 0, 4.2, z - 0.12, z + 0.12, dwood, BG);
    for (let k = 0; k < 4; k++) { K.slab(-7, -4.6, 0.5 + k * 0.0, 1.2, -4.8 + k * 2.4, -4.7 + k * 2.4, dwood, BG); }                              // stall rails
    for (let k = 0; k < 6; k++) { const b = K.rbox(1.0, 0.5, 0.6, 0.06, K.mat('fabric', '#e8c870', { detail: 0.2 }), 5.6 - (k % 2) * 0.2, 0.25 + Math.floor(k / 2) * 0.5, -3.8 + (k % 2) * 0.7, BG); for (const dx of [-0.25, 0.25]) K.rbox(0.02, 0.52, 0.62, 0.005, K.paint('#8a5a34'), 5.6 - (k % 2) * 0.2 + dx, 0.25 + Math.floor(k / 2) * 0.5, -3.8 + (k % 2) * 0.7, BG); }
    for (let k = 0; k < 4; k++) { const can = new THREE.Group(); can.position.set(-6.3 + k * 0.45, 0, 2.6); BG.add(can); K.cyl(0.17, 0.19, 0.6, chrome, 0, 0, 0, can, 18); K.cyl(0.1, 0.17, 0.12, chrome, 0, 0.6, 0, can, 18); K.cyl(0.11, 0.11, 0.06, chrome, 0, 0.72, 0, can, 18); }
    for (let k = 0; k < 5; k++) { const t = K.rbox(0.04, 0.6, 0.04, 0.01, dwood, -6.95, 1.6, -2 + k * 0.4, BG); } const pf = K.rbox(0.04, 0.5, 0.4, 0.02, chrome, -6.93, 2.2, -0.6, BG);
    const ds = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.6), S.textMat("ILSE'S DAIRY  ·  SINCE 1961", { bg: '#f4ead2', fg: '#9a2a22', w: 1024, h: 240 })); ds.position.set(0, 3.8, -5.25); ds.rotation.y = Math.PI; BG.add(ds);
    const ds2 = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.6), S.textMat("ILSE'S DAIRY", { bg: '#f4ead2', fg: '#9a2a22', w: 1024, h: 240 })); ds2.position.set(0, 3.8, -4.98); BG.add(ds2);
    const rule = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.7), S.textMat('MILK BY|6:00!', { bg: '#f0e0b8', fg: '#3a2418', w: 384, h: 256 })); rule.position.set(-6.98, 1.9, 1.2); rule.rotation.y = Math.PI / 2; BG.add(rule);
    const nm = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.3), S.textMat('DAISY', { bg: '#3a2418', fg: '#f2c230', w: 256, h: 112, border: false })); nm.position.set(-1.2, 1.7, -2.1); BG.add(nm);
    K.cyl(0.03, 0.03, 0.6, dark, -1.2, 1.5, -2.15, BG, 6);
    // outside the big door: yard, fence, hills, trees
    K.slab(-30, 30, -0.05, 0, -40, -5.2, K.mat('grime', '#6aa84f', { amt: 0.6 }), BG, false);
    for (let x = -20; x < 20; x += 1.8) K.cyl(0.05, 0.05, 1.0, wood, x, 0, -14, BG, 6); K.slab(-20, 20, 0.75, 0.82, -14.03, -13.97, wood, BG);
    S.bake(BG);
    for (let k = 0; k < 10; k++) { const t = S.tree({ h: 4 + hash(k) * 3, seed: k + 5 }); t.position.set(-18 + k * 4, 0, -18 - hash(k + 1) * 6); }
    K.lamp(-1.5, 2.8, 1.2, { color: '#ffc070', intensity: 3.0, distance: 9 }); K.lamp(3.0, 2.8, -2.0, { color: '#ffc070', intensity: 2.4, distance: 8 });
    K.shaft([0, 4.2, -5], [0.4, 0, -1.8], 0.8, 1.8, '#ffe0a8', 0.12);
    // the barn clock (on the post) and the cheese truck in the yard
    const ck = new THREE.Group(); ck.position.set(4.38, 2.6, 1.0); ck.rotation.y = -Math.PI / 2; sc.add(ck);
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.38, 32), new THREE.MeshStandardMaterial({ map: canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#f4f2ee'; g.fillRect(0, 0, w, h); g.fillStyle = '#1a1a1a'; for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; g.fillRect(w / 2 + Math.sin(a) * 100 - 5, h / 2 - Math.cos(a) * 100 - 12, 10, 24); } }), roughness: 0.4 })); ck.add(face);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.04, 10, 32), gold); ck.add(rim);
    CLOCKH = new THREE.Group(); CLOCKM = new THREE.Group(); for (const [gq, l, z] of [[CLOCKH, 0.2, 0.02], [CLOCKM, 0.3, 0.035]]) { gq.position.z = z; ck.add(gq); const h = new THREE.Mesh(new THREE.BoxGeometry(0.035, l, 0.01), dark); h.position.y = l / 2; gq.add(h); }
    TRUCK = new THREE.Group(); TRUCK.position.set(1.0, 0, -11); TRUCK.rotation.y = Math.PI / 2 - 0.3; sc.add(TRUCK);
    { const y = K.paint('#f2c230', { rough: 0.25 }), w = K.paint('#f4f2ee', { rough: 0.25 }); K.rbox(4.0, 1.8, 2.0, 0.15, y, -0.6, 1.5, 0, TRUCK); K.rbox(1.5, 1.4, 2.0, 0.2, w, 2.1, 1.25, 0, TRUCK);
      K.rbox(0.05, 0.6, 1.6, 0.05, K.paint('#2c3e52', { rough: 0.06, coat: 1 }), 2.86, 1.6, 0, TRUCK);
      for (const s of [-1, 1]) { const lb = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.9), S.textMat('CHEESE TRUCK|LEAVES 6:00 SHARP', { bg: '#f2c230', fg: '#9a2a22', w: 768, h: 216, border: false })); lb.position.set(-0.6, 1.6, s * 1.01); if (s < 0) lb.rotation.y = Math.PI; TRUCK.add(lb); }
      for (let k = 0; k < 8; k++) { const h = new THREE.Mesh(new THREE.CircleGeometry(0.08 + hash(k) * 0.08, 14), K.paint('#d8a820')); h.position.set(-2.2 + k * 0.45, 0.85 + (k % 3) * 0.25, 1.012); TRUCK.add(h); }
      for (const x of [-1.8, 0.4, 2.1]) for (const s of [-1, 1]) { const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.3, 20), dark); wh.rotation.x = Math.PI / 2; wh.position.set(x, 0.42, s * 0.95); TRUCK.add(wh); const hb = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.32, 14), chrome); hb.rotation.x = Math.PI / 2; hb.position.copy(wh.position); TRUCK.add(hb); }
      K.rbox(0.2, 0.3, 2.1, 0.06, chrome, 2.9, 0.6, 0, TRUCK); for (const s of [-0.7, 0.7]) { const hl = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color('#fff2c0').multiplyScalar(2) })); hl.position.set(2.88, 0.95, s); TRUCK.add(hl); } }
    // ================= the stools =================
    GERALD = stool(K, { legs: 3, seat: 'round', mat: K.mat('wood', '#a8703a', { detail: 0.25 }), legMat: K.mat('wood', '#7a4a2a', { detail: 0.3 }) });
    { const cr = K.rbox(0.25, 0.008, 0.012, 0.003, K.paint('#2a1a10'), 0.02, 0.447, 0.02, GERALD); cr.rotation.y = 0.5; const p = plate(K, 'GERALD', 0.22, 0.07, '#f4ead2', '#3a2418'); p.position.set(0, 0.405, 0.192); GERALD.add(p); }
    const red = K.paint('#d8202a', { rough: 0.18, coat: 1 });
    DELUXE = stool(K, { legs: 4, seat: 'square', mat: red, legMat: chrome, footMat: K.paint('#1a1a1a') });
    { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 8, 20), chrome); ring.rotation.x = Math.PI / 2; ring.position.set(0.27, 0.43, 0); DELUXE.add(ring); K.rbox(0.08, 0.02, 0.04, 0.01, chrome, 0.23, 0.43, 0, DELUXE);
      const coil = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.012, 8, 30), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff6a2a').multiplyScalar(2), toneMapped: false })); coil.rotation.x = Math.PI / 2; coil.position.y = 0.455; coil.userData.ndSkip = true; DELUXE.add(coil); DELUXE.coil = coil;
      const p = plate(K, 'DELUXE', 0.3, 0.06, '#1a1a1a', '#f2c230'); p.position.set(0, 0.42, 0.212); DELUXE.add(p); for (const z of [-0.2, 0.2]) K.rbox(0.42, 0.015, 0.012, 0.005, gold, 0, 0.45, z, DELUXE); }
    CUP = new THREE.Group(); DELUXE.add(CUP); CUP.position.set(0.27, 0.43, 0); { K.cyl(0.05, 0.04, 0.12, K.paint('#f4f2ee', { rough: 0.3 }), 0, 0, 0, CUP, 16); const mk = new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), K.paint('#ffffff', { rough: 0.5 })); mk.rotation.x = -Math.PI / 2; mk.position.y = 0.11; CUP.add(mk); }
    SIX = stool(K, { legs: 6, seat: 'square', mat: K.paint('#2a62c8', { rough: 0.18, coat: 1 }), legMat: chrome }); { const p = plate(K, 'DELUXE 6', 0.32, 0.06, '#1a1a1a', '#f2c230'); p.position.set(0, 0.42, 0.212); SIX.add(p); }
    CENT = stool(K, { legs: 10, seat: 'bench', len: 1.8, mat: K.paint('#2a9a4a', { rough: 0.18, coat: 1 }), legMat: chrome, footMat: K.paint('#1a1a1a') });
    { const p = plate(K, 'CENTIPEDE DELUXE', 0.9, 0.08, '#1a1a1a', '#f2c230'); p.position.set(0, 0.405, 0.172); CENT.add(p);
      for (const z of [-0.08, 0.08]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 10), K.paint('#ffffff', { rough: 0.3 })); e.position.set(0.93, 0.5, z); CENT.add(e); const pu = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), K.paint('#111111')); pu.position.set(0.98, 0.5, z); CENT.add(pu); CENT.pupils = (CENT.pupils || []).concat(pu); }
      for (const z of [-0.1, 0.1]) { const an = K.cyl(0.006, 0.006, 0.25, dark, 0.88, 0.46, z, CENT, 5); an.rotation.z = -0.5; }
      COAT = new THREE.Group(); CENT.add(COAT); const cm = K.mat('fabric', '#8a3a2a'); const ct = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.26, 0.9, 14, 1, true), cm); ct.material.side = THREE.DoubleSide; ct.position.set(0.55, 0.1, 0.28); COAT.add(ct);
      const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.1, 18), K.mat('fabric', '#2a2a30')); hat.position.set(-0.35, -0.08, 0.3); hat.rotation.x = Math.PI / 2; COAT.add(hat); const br = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 18), K.mat('fabric', '#2a2a30')); br.position.set(-0.35, -0.08, 0.25); br.rotation.x = Math.PI / 2; COAT.add(br);
      const scarf = K.rbox(0.08, 0.7, 0.03, 0.02, K.mat('fabric', '#f2c230'), 0.05, 0.0, 0.25, COAT); }
    COATW = new THREE.Group(); sc.add(COATW); { const cm = K.mat('fabric', '#8a3a2a'); const ct = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.3, 0.95, 16, 1, true), cm); ct.material.side = THREE.DoubleSide; ct.position.set(-3.02, 1.2, 2.45); ct.castShadow = true; COATW.add(ct);
      for (const dx of [-0.08, 0.08]) K.rbox(0.03, 0.5, 0.02, 0.01, K.paint('#f2c230'), -3.02 + dx, 1.35, 2.6, COATW);
      const hat = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.16, 18), K.mat('fabric', '#2a2a30')); hat.position.set(-3.08, 1.95, 2.3); COATW.add(hat); const br = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.02, 18), K.mat('fabric', '#2a2a30')); br.position.set(-3.08, 1.87, 2.3); COATW.add(br);
      K.rbox(0.09, 0.75, 0.03, 0.02, K.mat('fabric', '#f2c230'), -3.08, 1.3, 2.18, COATW); const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.14), S.textMat('COAT RACK', { bg: '#1a1a1a', fg: '#f2c230', w: 256, h: 90, border: false })); tag.position.set(-3.2, 0.5, 2.62); COATW.add(tag); }
    // bucket + milk + puddle, cardboard, cheese
    BUCKET = new THREE.Group(); sc.add(BUCKET); { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.13, 0.3, 24, 1, true), chrome); b.material.side = THREE.DoubleSide; b.position.y = 0.15; BUCKET.add(b); const bt = new THREE.Mesh(new THREE.CircleGeometry(0.13, 24), chrome); bt.rotation.x = -Math.PI / 2; bt.position.y = 0.005; BUCKET.add(bt);
      BUCKET.milk = new THREE.Mesh(new THREE.CircleGeometry(0.16, 24), K.paint('#fbfaf4', { rough: 0.35 })); BUCKET.milk.rotation.x = -Math.PI / 2; BUCKET.add(BUCKET.milk); const hd = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.008, 6, 24, Math.PI), chrome); hd.position.y = 0.3; BUCKET.add(hd); }
    PUDDLE = new THREE.Mesh(new THREE.CircleGeometry(1, 32), K.paint('#fbfaf4', { rough: 0.2 })); PUDDLE.rotation.x = -Math.PI / 2; sc.add(PUDDLE);
    for (let k = 0; k < 3; k++) { const c = K.rbox(0.12, 0.025, 0.1, 0.005, K.mat('fabric', '#b8925a', { detail: 0.2 }), 0, 0, 0, sc); CARD.push(c); }
    CHEESE = new THREE.Group(); sc.add(CHEESE); { const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(0.16, 0); sh.lineTo(0, 0.1); sh.closePath(); const geo = new THREE.ExtrudeGeometry(sh, { depth: 0.1, bevelEnabled: false }); const m = new THREE.Mesh(geo, K.paint('#f2c230', { rough: 0.5 })); m.rotation.x = -Math.PI / 2; m.position.set(-0.08, 0, 0.05); CHEESE.add(m);
      for (let k = 0; k < 4; k++) { const h = new THREE.Mesh(new THREE.CircleGeometry(0.012, 10), K.paint('#c89a20')); h.position.set(-0.05 + k * 0.03, 0.03, 0.051); CHEESE.add(h); } }
    // ================= cutaway: a cheap cafe table (x = CAF) =================
    CAFE = new THREE.Group(); CAFE.position.set(CAF, 0, 0); sc.add(CAFE); { const CG = new THREE.Group(); CAFE.add(CG); K.slab(-4, 4, -0.05, 0, -4, 4, K.mat('rock', '#c8b8a0', { detail: 0.3 }), CG, false);
      K.slab(-4, 4, 0, 3, -2.2, -2.0, K.mat('brick', '#b8604a', { detail: 1.2 }), CG); const cs = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.5), S.textMat('CHEAP CAFE', { bg: '#2a6a3a', fg: '#ffffff', w: 768, h: 192, border: false })); cs.position.set(0, 2.3, -1.98); CG.add(cs);
      const mn = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.6), S.textMat('COFFEE 1$|SOUP ???', { bg: '#1a1a1a', fg: '#f4f2ee', w: 256, h: 192 })); mn.position.set(1.5, 1.5, -1.98); CG.add(mn); S.bake(CG); }
    CAFE.table = new THREE.Group(); CAFE.add(CAFE.table); K.cyl(0.4, 0.4, 0.04, K.paint('#f4f2ee', { rough: 0.3 }), 0, 0.72, 0, CAFE.table, 24); for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2 + 0.78; K.cyl(0.02, 0.02, 0.72, chrome, Math.cos(a) * 0.3, 0, Math.sin(a) * 0.3, CAFE.table, 8); }
    CAFECUP = new THREE.Group(); CAFE.table.add(CAFECUP); CAFECUP.position.set(0.1, 0.76, 0.05); K.cyl(0.045, 0.035, 0.09, K.paint('#f4f2ee', { rough: 0.3 }), 0, 0, 0, CAFECUP, 16); const cf = new THREE.Mesh(new THREE.CircleGeometry(0.04, 16), K.paint('#5a3a22', { rough: 0.2 })); cf.rotation.x = -Math.PI / 2; cf.position.y = 0.085; CAFECUP.add(cf);
    // ================= cutaway: a camera tripod on a rocky beach (x = BEACH) =================
    { const BB = K.group(); K.slab(BEACH - 30, BEACH + 30, -0.1, 0, -6, 20, K.mat('dirt', '#e8d49a', { detail: 0.5 }), BB, false); K.slab(BEACH - 60, BEACH + 60, -0.2, -0.08, -60, -6, K.paint('#2a8ac0', { rough: 0.06, coat: 1 }), BB, false);
      for (let k = 0; k < 40; k++) { const r = new THREE.Mesh(new THREE.DodecahedronGeometry(0.2 + hash(k) * 0.5, 0), K.mat('rock', '#8a8278')); r.position.set(BEACH - 6 + hash(k + 1) * 12, 0.05, -4 + hash(k + 2) * 8); r.scale.y = 0.6; r.rotation.set(hash(k) * 3, hash(k + 3) * 3, 0); BB.add(r); } S.bake(BB); }
    TRIPOD = new THREE.Group(); TRIPOD.position.set(BEACH, 0, 0); sc.add(TRIPOD); { const feet = [[0.55, 0.0, 0.32], [-0.35, 0.25, 0.45], [-0.15, 0.12, -0.55]]; const top = new THREE.Vector3(0, 1.3, 0);
      for (const [x, y, z] of feet) { const p = new THREE.Vector3(x, y, z); const l = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1, 8), dark); l.position.copy(top.clone().add(p).multiplyScalar(0.5)); l.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), top.clone().sub(p).normalize()); l.scale.y = top.distanceTo(p); TRIPOD.add(l);
        const rk = new THREE.Mesh(new THREE.DodecahedronGeometry(0.22, 0), K.mat('rock', '#7a7268')); rk.position.set(x, y - 0.18, z); rk.scale.y = 0.8 + y; TRIPOD.add(rk); }
      K.rbox(0.36, 0.24, 0.18, 0.04, K.paint('#1a1a1a', { rough: 0.3 }), 0, 1.45, 0, TRIPOD); const ln = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.18, 18), K.paint('#2a2a30', { rough: 0.2 })); ln.rotation.x = Math.PI / 2; ln.position.set(0, 1.45, 0.17); TRIPOD.add(ln);
      const lg = new THREE.Mesh(new THREE.CircleGeometry(0.06, 18), K.paint('#3a6aa8', { rough: 0.05, coat: 1 })); lg.position.set(0, 1.45, 0.262); TRIPOD.add(lg);
      TRI_TR = K.trace([[0.55, 0.03, 0.32], [-0.35, 0.28, 0.45], [-0.15, 0.15, -0.55], [0.55, 0.03, 0.32]], { parent: TRIPOD, color: '#7af8a0', r: 0.02 }); }
    // x-ray traces in the barn: the three feet of Gerald (triangle), the gap under the deluxe's fourth leg
    HOLO = K.holoBox(0.7, 0.55, 0.7, 0, 0.25, 0, sc, '#36e2ff');
    GAP_TR = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff3a2a').multiplyScalar(2), toneMapped: false })); GAP_TR.userData.ndSkip = true; sc.add(GAP_TR);
    // ================= characters + animals =================
    TOBIAS = K.stick({ jacket: '#f2c230', pants: '#2a4a7a', hat: 'cap', cap: '#c0392b', hairStyle: 'spiky', hair: '#c0632a', glasses: true, vest: '#2a4a7a', boots: '#3a2418', belt: '#3a2418', pockets: true }, { key: 'tobias' });
    ILSE = K.stick({ jacket: '#7a4a9a', pants: '#3a2a4a', hairStyle: 'bun', hair: '#e8e4dc', glasses: true, apron: '#f4efe4', scarf: '#c0392b', dress: '#5a3a8a', boots: '#3a2418' }, { key: 'ilse' });
    DRIVER = K.stick({ jacket: '#9a2a22', pants: '#2a2a30', hat: 'cap', cap: '#f2c230', moustache: '#3a2418', badge: true, gloves: '#1a1a1a' }, { key: 'driver' });
    DAISY = K.animal('cow', { seed: 2 }); COW2 = K.animal('cow', { seed: 7, color: '#8a5a34' }); COW3 = K.animal('cow', { seed: 11 }); CAT = K.animal('cat', { seed: 4, color: '#5a5a62' });
    K.addClouds(8, 700, 140);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s);
    const loc = (f >= 157 && f < 205) || (f >= 1076 && f < 1130) ? 'yard' : (f >= 630 && f < 690) ? 'cafe' : (f >= 1370 && f < 1450) ? 'beach' : 'barn';
    // ---------- which stool is in use + rocking ----------
    const use = f < F.SIXL - 6 ? 'deluxe' : f < F.TEN - 6 ? 'six' : f < 1234 ? 'cent' : f < 1450 ? 'gerald' : f < 1610 ? 'deluxe' : f < 1731 ? 'gerald' : 'rack';
    const rockAmp = (k) => { const t = f * 0.55; const sq = Math.tanh(4 * Math.sin(t)); return k * sq; };
    const place = (st, x, z, yaw, rz, rx, y = 0) => { st.position.set(x, y + floorY(x, z) + 0.01, z); st.rotation.set(rx || 0, yaw || 0, rz || 0); };
    for (const st of [GERALD, DELUXE, SIX, CENT]) st.visible = loc === 'barn';
    // deluxe: next to Tobias early (0-354 presented), rocking while he sits (354-573), back for the x-ray (1450-1610)
    const sit1 = f >= F.SAT - 2;
    let rk = 0; if (use === 'deluxe' && f >= F.ROCKED - 4 && f < F.SIXL) rk = rockAmp(0.07); if (f >= 1520 && f < 1610) rk = (f >= F.SIT ? rockAmp(0.06) : 0);
    if (f >= 1076 && f < 1450) place(DELUXE, SPOT[0] + 1.3, SPOT[1] + 1.0, 0.3, 0, 0); else if (f < 1450) place(DELUXE, f < F.SAT - 20 ? SPOT[0] + 0.9 : SPOT[0], SPOT[1], 0.3, rk, rk * 0.5); else place(DELUXE, 0.1, 2.0, 0.2, rk, 0, 0.0);
    DELUXE.visible = loc === 'barn' && (f < F.SIXL - 6 || (f >= 1130 && f < 1234) || (f >= 1450 && f < 1610)); DELUXE.coil.material.color.setScalar(1.6 + 0.4 * Math.sin(f * 0.3));
    CUP.visible = f < 1450; CUP.scale.setScalar(1);
    place(SIX, SPOT[0], SPOT[1], 0.3, use === 'six' ? rockAmp(0.13) : 0, use === 'six' ? rockAmp(0.06) : 0); SIX.visible = loc === 'barn' && use === 'six';
    // centipede: wobbles, then walks across the barn by itself (Tobias on it), then cardboard + cheese (still wobbles), then coat rack
    let cx = SPOT[0], cz = SPOT[1] + 0.1, cyaw = 0.0, crz = 0, crx = 0, cy = 0;
    if (use === 'cent') { crz = rockAmp(0.05); crx = rockAmp(0.04) * Math.sin(f * 0.21);
      if (f >= F.WALKED - 10 && f < 905) { const W = sm(F.WALKED - 10, 900, f); cx = lerp(SPOT[0], SPOT[0] + 3.2, W); cz = SPOT[1] + 0.1 + 0.5 * W; } else if (f >= 905) { cx = SPOT[0]; } }
    if (use === 'rack') { cx = -3.2; cz = 2.4; cyaw = 0; crz = Math.PI / 2 + 0.04 * Math.tanh(4 * Math.sin(f * 0.5)); cy = 0.95; }
    place(CENT, cx, cz, cyaw, crz, crx, cy); CENT.visible = loc === 'barn' && (use === 'cent' || use === 'rack'); COAT.visible = false; COATW.visible = use === 'rack' && loc === 'barn'; COATW.rotation.z = 0; COATW.position.x = 0.04 * Math.tanh(4 * Math.sin(f * 0.5));
    if (CENT.pupils) CENT.pupils.forEach((p, k) => { p.position.y = 0.5 + 0.02 * Math.sin(f * 0.6 + k); });
    CENT.legs.forEach((l, k) => { l.foot.position.y = 0.01 + (use === 'cent' && f >= F.WALKED - 10 && f < 905 ? 0.04 * Math.max(0, Math.sin(f * 0.9 + k * 1.3)) : 0); });
    // Gerald: by Grandma (early), the x-ray (1302-1370), Grandma milks on it (1610-1731), behind at the end
    if (f < 1610 && !(f >= 1302 && f < 1370)) place(GERALD, -1.4, 1.6, 0.8, 0, 0); else if (f >= 1302 && f < 1370) place(GERALD, 0.1, 2.0, 0.4, 0, 0); else if (f < 1731) place(GERALD, SPOT[0] - 0.5, SPOT[1], 0.3, 0, 0); else place(GERALD, -1.8, 1.4, 0.6, 0, 0);
    // x-ray box + glow lines
    HOLO.visible = (f >= 1302 && f < 1370) || (f >= 1450 && f < 1610); HOLO.position.set(0.1, 0.25 + floorY(0.1, 2.0), 2.0);
    { const L = DELUXE.legs[0]; GAP_TR.visible = f >= F.FOURTH - 4 && f < 1610 && loc === 'barn'; const wp = new THREE.Vector3(L.x, 0, L.z); DELUXE.updateMatrixWorld(true); wp.applyMatrix4(DELUXE.matrixWorld); const gy = floorY(wp.x, wp.z) - 0.05; GAP_TR.position.set(wp.x, (wp.y + gy) / 2, wp.z); GAP_TR.scale.set(1, Math.max(0.02, wp.y - gy + 0.05), 1); }
    // bucket (knocked over by Daisy's tail), puddle, cup, cardboard, cheese
    const knock = sm(F.KNOCKED - 2, F.TAIL + 4, f) * (f < 1610 ? 1 : 0);
    BUCKET.position.set(SPOT[0] - 0.05 + knock * 0.15, floorY(SPOT[0], SPOT[1] - 0.6) + knock * 0.12, SPOT[1] - 0.55); BUCKET.rotation.set(0, 0, -knock * 1.45); BUCKET.visible = loc === 'barn' && f < 1302 || (f >= 1610 && f < 1731);
    const full = f >= 1610 ? lerp(0.05, 0.27, sm(1640, F.FULL + 10, f)) : 0.1; BUCKET.milk.position.y = full; BUCKET.milk.visible = knock < 0.5;
    PUDDLE.visible = knock > 0.3 && f < 1302 && loc === 'barn'; PUDDLE.position.set(SPOT[0] + 0.45, floorY(SPOT[0] + 0.45, SPOT[1] - 0.55) + 0.015, SPOT[1] - 0.55); PUDDLE.scale.setScalar(0.05 + 0.5 * sm(F.TAIL, F.TAIL + 30, f));
    CUP.children[1].visible = f >= 1076;
    const legW = (st, i) => { const L = st.legs[i]; const v = new THREE.Vector3(L.x, 0, L.z); st.updateMatrixWorld(true); v.applyMatrix4(st.matrixWorld); return v; };
    CARD.forEach((c, k) => { const on = f >= (k === 0 ? F.CARD - 4 : k === 1 ? F.TWO - 4 : 99999) && use === 'cent' && f < 1234; c.visible = on && loc === 'barn'; if (on) { const v = legW(CENT, k * 3 + 1); c.position.set(v.x, floorY(v.x, v.z) + 0.015, v.z); } });
    { const on = f >= F.CHEESE - 4 && use === 'cent' && f < 1234; CHEESE.visible = on && loc === 'barn'; if (on) { const v = legW(CENT, 6); CHEESE.position.set(v.x, floorY(v.x, v.z), v.z + 0.02); } }
    // clock: 5:00 -> 5:58
    { const tm = f < 1076 ? 5 + 10 / 60 + f / 1076 * 0.6 : 5 + 58 / 60; CLOCKH.rotation.z = -(tm % 12) / 12 * Math.PI * 2; CLOCKM.rotation.z = -(tm % 1) * Math.PI * 2; }
    TRUCK.position.x = 1.0 + (f > 1200 ? -(f - 1200) * 0.0 : 0);
    // cafe table rocks, coffee slides
    { const r = Math.tanh(4 * Math.sin(f * 0.6)) * 0.06; CAFE.table.rotation.z = r; CAFECUP.position.x = 0.1 + 0.08 * Math.sin(f * 0.3); }
    // ---------- characters ----------
    const sitY = (st) => st.position.y + 0.02;
    let tp = { visible: false }, tk = [];
    if (loc === 'barn') {
      if (f < F.SAT - 2) tp = { x: SPOT[0] + 1.6, z: SPOT[1] + 0.5, yaw: -0.5 };
      else if (use === 'deluxe' || use === 'six') { const st = use === 'six' ? SIX : DELUXE; tp = { x: SPOT[0], y: sitY(st) - 0.0, z: SPOT[1], yaw: Math.PI - 0.55, seat: 0.45 }; }
      else if (use === 'cent' && f < 905) { tp = { x: CENT.position.x - 0.3, y: sitY(CENT), z: CENT.position.z, yaw: 0.5, seat: 0.45 }; }
      else if (use === 'cent') tp = { x: SPOT[0] + 0.7, z: SPOT[1] + 0.75, yaw: -0.9 };
      else if (f >= 1234 && f < 1302) tp = { x: SPOT[0] + 0.9, z: SPOT[1] + 0.9, yaw: 0.2 };
      else if (f >= 1450 && f < 1610) tp = { x: 0.1, y: sitY(DELUXE), z: 2.0, yaw: 0.2, seat: 0.45 };
      else if (f >= 1610 && f < 1731) tp = { x: SPOT[0] + 1.3, z: SPOT[1] + 0.8, yaw: -0.6 };
      else if (f >= 1731) tp = { x: -1.5, z: 3.0, yaw: 0.2 };
    }
    const rockArms = (e) => ({ expr: e, sweat: true, L: [0.5, -0.1, 'open'], R: [0.5, -0.1, 'open'] });
    tk = [[0, 'pointL', { expr: 'proud' }], [F.CUPH, 'pointL', { expr: 'grin' }], [F.HEATED, 'celebrate', { expr: 'excited' }], [F.SAT - 4, 'sit', { expr: 'proud' }], [F.ROCKED, 'sit', rockArms('nervous')],
      [F.SIXL - 6, 'sit', { expr: 'proud' }], [F.TWICE, 'sit', rockArms('scared')], [F.TEN - 6, 'sit', { expr: 'excited' }], [F.WOBBLED, 'sit', rockArms('scared')], [F.WALKED, 'sit', rockArms('shock')],
      [905, 'crouch', { expr: 'stern', R: [0.4, 0.3, 'open'] }], [F.RAN - 4, 'crouch', { expr: 'nervous', sweat: true, R: [0.4, 0.3, 'open'] }], [F.CHEESE, 'crouch', { expr: 'grin', R: [0.4, 0.35, 'open'] }],
      [1076, 'hold', { expr: 'nervous', sweat: true, R: [0.35, -0.5, 'cup'] }], [F.INTO, 'hold', { expr: 'pained', sweat: true, R: [0.35, -0.5, 'cup'] }],
      [1234, 'think', { expr: 'confused' }], [F.NEVER, 'shrug', { expr: 'confused' }], [1450, 'sit', { expr: 'nervous' }], [F.SIT, 'sit', rockArms('shock')], [1610, 'cross', { expr: 'sad' }], [F.WOBBLE, 'facepalm', { expr: 'pained' }],
      [1731, 'hips', { expr: 'deadpan' }], [F.WOBBLES - 4, 'shrug', { expr: 'deadpan' }]];
    TOBIAS.set(T.act(f, tk, { seed: 3, blink: blink(3) }), tp);
    let ip = { visible: false };
    if (loc === 'barn') { if (f < 1302) ip = { x: -1.6, z: 2.3, yaw: 0.5 }; else if (f >= 1610 && f < 1731) ip = { x: SPOT[0] - 0.5, y: sitY(GERALD), z: SPOT[1], yaw: 2.0, seat: 0.45 }; else if (f >= 1731) ip = { x: -1.2, z: 1.8, yaw: 0.4 }; }
    const ik = [[0, 'cross', { expr: 'deadpan' }], [F.HEATED, 'cross', { expr: 'deadpan', look: 0.5 }], [254, 'pointL', { expr: 'smile' }], [F.GERALD, 'hold', { expr: 'proud', R: [0.4, 0.25, 'open'] }],
      [F.ROCKED, 'cross', { expr: 'deadpan' }], [F.CAFE, 'facepalm', { expr: 'deadpan' }], [F.WALKED, 'shock', { expr: 'shock' }], [F.CHEESE, 'shock', { expr: 'shock' }], [F.CHEESE + 12, 'angry', { expr: 'angry' }],
      [1610, 'sit', { expr: 'smug', L: [0.3, 0.25, 'fist', true], R: [0.3, 0.25, 'fist', true] }], [F.FULL, 'sit', { expr: 'grin' }], [1731, 'cross', { expr: 'smug' }]];
    ILSE.set(T.act(f, ik, { seed: 6, blink: blink(6) }), ip);
    DRIVER.set(T.act(f, [[0, 'hips', { expr: 'stern' }], [F.TRUCK - 2, 'pointL', { expr: 'stern' }], [1076, 'angry', { expr: 'angry' }], [F.HONKED - 2, 'point', { expr: 'yell' }]], { seed: 9, blink: blink(9) }), loc === 'yard' ? { x: 3.6, z: -9.2, yaw: 0.6 } : { visible: false });
    // cows: Daisy at the milking spot (seasick, tail knocks the bucket), two more in the stalls, the cat on the hay
    const dz = SPOT[1] - 1.05;
    DAISY.set(f, { x: SPOT[0] + 0.1, z: dz, yaw: Math.PI / 2, mode: 'stand', expr: f >= F.SEASICK - 4 && f < 905 ? 'sad' : (f >= 1610 ? 'happy' : 'neutral'), visible: loc === 'barn' && f < 1731 && !(f >= 1302 && f < 1610), nod: f >= F.SEASICK && f < 700 ? 0.3 * Math.sin(f * 0.2) : 0 });
    COW2.set(f, { x: -5.6, z: -3.6, yaw: Math.PI / 2, mode: 'eat', expr: 'happy', visible: loc === 'barn' });
    COW3.set(f, { x: -5.6, z: -1.2, yaw: Math.PI / 2, mode: f >= F.WALKED && f < 905 ? 'stand' : 'eat', expr: f >= F.WALKED && f < 905 ? 'shock' : 'happy', visible: loc === 'barn' });
    CAT.set(f, { x: 5.5, y: 1.52, z: -3.6, yaw: -0.8, mode: f >= F.WALKED && f < 905 ? 'sit' : 'sleep', expr: f >= F.WALKED && f < 905 ? 'shock' : 'sleepy', visible: loc === 'barn' });

    // ---------- shots ----------
    let cam, dof, u, light; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const barn = K.light('interior', { az: 150, el: 40, fog: '#3a2a1a', fogNear: 14, fogFar: 50, hemi: 1.2, exposure: 1.45 }), yard = K.light('morning', { az: 100, el: 14, shadowExt: 20 }), cafe = K.light('interior', { az: 120, el: 45 }), beach = K.light('golden', { az: 160, el: 22 });
    const hd = (p, y = 1.6) => [p.x, (p.y || 0) + (p.seat ? y - 0.45 : y), p.z];
    const S0 = [SPOT[0], 0.45, SPOT[1]];
    if (sh(0, 50)) {             // 1. Tobias presents the deluxe stool, proud (close)
      const h = hd(tp); cam = { pos: [h[0] + 0.9, h[1] - 0.1, h[2] + 2.2], look: [h[0] - 0.4, h[1] - 0.45, h[2] - 0.3], fov: 44 * K.push(u, 0.1) }; dof = { focus: 2.3, cinf: 11 }; light = barn;
    } else if (sh(50, 100)) {    // 2. insert: four legs, cupholder, heated seat (slow orbit)
      const p = DELUXE.position; cam = { pos: [p.x + lerp(0.75, 0.45, u), 1.1, p.z + 0.75], look: [p.x + 0.05, 0.4, p.z], fov: 40 }; dof = { focus: 1.1, cinf: 15 }; light = barn;
    } else if (sh(100, 157)) {   // 3. Grandma Ilse, deadpan, arms crossed (Gerald by her feet)
      const h = hd(ip); cam = { pos: [h[0] + 1.3, h[1] - 0.15, h[2] + 1.6], look: [h[0], h[1] - 0.35, h[2]], fov: 42 * K.push(u, 0.1) }; dof = { focus: 2.1, cinf: 12 }; light = barn;
    } else if (sh(157, 205)) {   // 4. the yard: the cheese truck, LEAVES 6:00 SHARP; the driver points at it
      cam = { pos: [lerp(7.0, 6.2, u), 1.6, -7.2], look: [1.2, 1.4, -10.8], fov: 46 }; dof = { focus: 7, cinf: 5 }; light = yard;
    } else if (sh(205, 251)) {   // 5. the barn clock ticks toward six (push)
      cam = { pos: [3.0, 2.55, 1.15], look: [4.38, 2.6, 1.0], fov: 38 * K.push(u, 0.14) }; dof = { focus: 1.4, cinf: 14 }; light = barn;
    } else if (sh(251, 305)) {   // 6. insert: Gerald — three legs, a crack, a name plate
      const p = GERALD.position; cam = { pos: [p.x + 0.35, 0.75, p.z + lerp(0.95, 0.75, u)], look: [p.x, 0.32, p.z], fov: 40 }; dof = { focus: 0.9, cinf: 16 }; light = barn;
    } else if (sh(305, 354)) {   // 7. Grandma pats Gerald, proud
      const h = hd(ip); cam = { pos: [h[0] + 1.6, h[1] - 0.35, h[2] + 1.2], look: [h[0] + 0.1, h[1] - 0.6, h[2] - 0.3], fov: 46 }; dof = { focus: 2.0, cinf: 11 }; light = barn;
    } else if (sh(354, 400)) {   // 8. Tobias sits on the deluxe: it rocks (front quarter)
      cam = { pos: [S0[0] + 1.6, 1.15, S0[2] + 1.6], look: [S0[0], 0.75, S0[2]], fov: 44 }; dof = { focus: 2.2, cinf: 10 }; light = barn;
    } else if (sh(400, 452)) {   // 9. macro: the legs clack on the bumpy floor (shake + punch)
      const [sx, sy] = K.shake(f, F.CL1, 0.02, 40); cam = { pos: [S0[0] + 0.6 + sx, 0.2 + sy, S0[2] + 0.55], look: [S0[0], 0.08, S0[2]], fov: 42 * K.punch(f, F.CL1, 0.12, 6) }; dof = { focus: 0.8, cinf: 15 }; light = barn;
    } else if (sh(452, 510)) {   // 10. Daisy the cow gets seasick (close on her face)
      cam = { pos: [S0[0] + 2.7, 1.45, S0[2] + 0.5], look: [S0[0] + 0.8, 0.95, S0[2] - 1.05], fov: 42 * K.push(u, 0.1) }; dof = { focus: 1.4, cinf: 13 }; light = barn;
    } else if (sh(510, 570)) {   // 11. her tail knocks the bucket over, the milk spills (low)
      cam = { pos: [S0[0] + 1.3, 0.45, S0[2] + 0.7], look: [S0[0] - 0.1, 0.2, S0[2] - 0.55], fov: 44 }; dof = { focus: 1.6, cinf: 12 }; light = barn;
    } else if (sh(570, 630)) {   // 12. the six-legged upgrade (wide-ish, from the other side)
      cam = { pos: [S0[0] + 2.3, 1.15, S0[2] - 0.2], look: [S0[0], 0.8, S0[2]], fov: 44 * K.push(u, 0.08) }; dof = { focus: 2.7, cinf: 10 }; light = barn;
    } else if (sh(630, 690)) {   // 13. cutaway: a table at a cheap cafe, the coffee slides
      cam = { pos: [CAF + 0.9, 1.25, 1.4], look: [CAF, 0.78, 0], fov: 40 * K.push(u, 0.1) }; dof = { focus: 1.7, cinf: 13 }; light = cafe;
    } else if (sh(690, 739)) {   // 14. Tobias, sweating, rocking on six legs (close)
      const h = hd(tp); cam = { pos: [h[0] + 1.0, h[1] + 0.05, h[2] + 1.5], look: [h[0], h[1] - 0.2, h[2]], fov: 40 }; dof = { focus: 1.8, cinf: 14 }; light = barn;
    } else if (sh(739, 800)) {   // 15. the Centipede Deluxe: ten legs and googly eyes (low, push)
      const p = CENT.position; cam = { pos: [p.x + 2.0, 0.75, p.z + 0.7], look: [p.x + 0.5, 0.5, p.z], fov: 46 * K.push(u, 0.12) }; dof = { focus: 1.9, cinf: 12 }; light = barn;
    } else if (sh(800, 860)) {   // 16. it walks across the barn by itself (tracking)
      const tc = K.track(f, (g) => { const W = sm(F.WALKED - 10, 900, g); return [lerp(SPOT[0], SPOT[0] + 3.2, W), 0.4, SPOT[1] + 0.1 + 0.5 * W]; }, { off: [0.6, 0.8, 2.6], lag: 4, lead: 0.2, lookY: 0.3 }); cam = { ...tc, fov: 46 }; dof = { focus: 2.7, cinf: 9 }; light = barn;
    } else if (sh(860, 905)) {   // 17. reaction: Grandma, the cows and the cat stare
      const h = hd(ip); cam = { pos: [h[0] + 1.5, h[1], h[2] + 1.3], look: [h[0] - 0.1, h[1] - 0.15, h[2]], fov: 40 * K.punch(f, 862, 0.1, 6) }; dof = { focus: 2.0, cinf: 13 }; light = barn;
    } else if (sh(905, 965)) {   // 18. macro: folded cardboard under one leg
      const v = legW(CENT, 1); cam = { pos: [v.x + 0.45, 0.22, v.z + 0.5], look: [v.x, 0.05, v.z], fov: 40 * K.push(u, 0.12) }; dof = { focus: 0.7, cinf: 16 }; light = barn;
    } else if (sh(965, 1020)) {  // 19. then two (wider, still wobbling)
      const p = CENT.position; cam = { pos: [p.x + 0.3, 0.6, p.z + 1.5], look: [p.x, 0.2, p.z], fov: 44 }; dof = { focus: 1.5, cinf: 12 }; light = barn;
    } else if (sh(1020, 1076)) { // 20. Grandma's best cheese under a leg (macro, punch) — Grandma behind
      const v = legW(CENT, 6); cam = { pos: [v.x + 0.5, 0.28, v.z + 0.45], look: [v.x, 0.07, v.z], fov: 40 * K.punch(f, F.CHEESE, 0.15, 6) }; dof = { focus: 0.7, cinf: 16 }; light = barn;
    } else if (sh(1076, 1130)) { // 21. 5:58: the cheese truck honks (yard, low)
      cam = { pos: [4.8, 0.9, -6.0], look: [2.4, 1.5, -10.4], fov: 44 * K.punch(f, F.HONKED, 0.12, 6) }; dof = { focus: 5, cinf: 6 }; light = yard;
    } else if (sh(1130, 1180)) { // 22. Tobias holds up exactly one cup (close)
      const h = hd(tp); cam = { pos: [h[0] + 0.9, h[1] - 0.05, h[2] + 1.5], look: [h[0] + 0.1, h[1] - 0.3, h[2]], fov: 40 }; dof = { focus: 1.8, cinf: 14 }; light = barn;
    } else if (sh(1180, 1234)) { // 23. insert: the one cup, in the cupholder
      const p = DELUXE.position; cam = { pos: [p.x + 0.65, 0.68, p.z + 0.45], look: [p.x + 0.27, 0.48, p.z], fov: 36 * K.punch(f, F.INTO, 0.15, 6) }; dof = { focus: 0.6, cinf: 16 }; light = barn;
    } else if (sh(1234, 1302)) { // 24. re-hook: Tobias, confused
      const h = hd(tp); cam = { pos: [h[0] + lerp(0.6, 1.0, u), h[1], h[2] + 1.7], look: [h[0], h[1] - 0.1, h[2]], fov: 38 }; dof = { focus: 1.9, cinf: 14 }; light = barn;
    } else if (sh(1302, 1370)) { // 25. x-ray: Gerald's three feet always touch (a glowing triangle on the bumps)
      cam = { pos: [0.1 + lerp(-0.7, 0.7, u), 0.75, 2.0 + 1.1], look: [0.1, 0.2, 2.0], fov: 42 }; dof = { focus: 1.2, cinf: 13 }; light = barn;
    } else if (sh(1370, 1450)) { // 26. cutaway: a camera tripod on a rocky beach (orbit)
      const a = lerp(-0.6, 0.4, u); cam = { pos: [BEACH + Math.sin(a) * 2.6, 1.4, Math.cos(a) * 2.6], look: [BEACH, 0.7, 0], fov: 44 }; dof = { focus: 2.6, cinf: 9 }; light = beach;
    } else if (sh(1450, 1520)) { // 27. x-ray: on a bumpy floor the fourth leg hangs in the air (red gap)
      const p = DELUXE.position; cam = { pos: [p.x + 0.8, 0.4, p.z + 0.9], look: [p.x + 0.1, 0.12, p.z + 0.1], fov: 40 * K.push(u, 0.12) }; dof = { focus: 1.1, cinf: 14 }; light = barn;
    } else if (sh(1520, 1610)) { // 28. sit down -> rock onto it: clack (Tobias, shake)
      const [sx, sy] = K.shake(f, F.CL2, 0.03, 20); const p = DELUXE.position; cam = { pos: [p.x + 1.4 + sx, 1.1 + sy, p.z + 1.6], look: [p.x, 0.7, p.z], fov: 44 * K.punch(f, F.CL2, 0.12, 6) }; dof = { focus: 2.1, cinf: 11 }; light = barn;
    } else if (sh(1610, 1670)) { // 29. Grandma sits on Gerald: not one wobble (front quarter)
      const h = hd(ip); cam = { pos: [h[0] + 1.5, h[1] + 0.1, h[2] + 1.3], look: [h[0], h[1] - 0.35, h[2] - 0.1], fov: 44 * K.push(u, 0.1) }; dof = { focus: 2.1, cinf: 12 }; light = barn;
    } else if (sh(1670, 1731)) { // 30. insert: the bucket fills to the top
      cam = { pos: [S0[0] + 0.55, 0.75, S0[2] + 0.1], look: [S0[0] - 0.05, 0.2, S0[2] - 0.55], fov: 38 * K.push(u, 0.1) }; dof = { focus: 0.9, cinf: 15 }; light = barn;
    } else if (sh(1731, 1820)) { // 31. the Centipede Deluxe as a coat rack (it wobbles)
      cam = { pos: [-3.2 + lerp(1.4, 1.0, u), 1.35, 2.4 + 2.6], look: [-3.0, 1.0, 2.4], fov: 46 }; dof = { focus: 1.9, cinf: 11 }; light = barn;
    } else {                     // 32. Tobias deadpan beside it; Grandma and Gerald behind (push)
      const h = hd(tp); cam = { pos: [h[0] + 0.9, h[1] + 0.05, h[2] + 1.9], look: [h[0] - 0.25, h[1] - 0.2, h[2] - 0.2], fov: 44 * K.push(clamp((f - 1820) / 100, 0, 1), 0.12) }; dof = { focus: 2.0, cinf: 12 }; light = barn;
    }
    // ---------- graphics + effects ----------
    TRI_TR.show(loc === 'beach' ? sm(F.TRIPOD - 4, F.BEACH + 6, f) : 0);
    if (f >= 1302 && f < 1370) K.badge(f, F.THREEF, '3 FEET = ALWAYS DOWN', [0.1, 0.75, 2.0], { icon: 'check', f1: 1368 });
    if (f >= 1450 && f < 1610) K.badge(f, F.AIR, 'AIR GAP', [DELUXE.position.x - 0.1, 0.4, DELUXE.position.z + 0.2], { icon: 'warn', f1: 1608 });
    K.badge(f, F.FOUR, '4 LEGS', { sx: 0.3, sy: 0.18 }, { f1: 157 }); K.badge(f, F.CUPH, 'CUPHOLDER', { sx: 0.62, sy: 0.24 }, { icon: 'check', f1: 157 }); K.badge(f, F.HEATED, 'HEATED SEAT', { sx: 0.4, sy: 0.3 }, { icon: 'bolt', f1: 157 });
    K.badge(f, F.SIX, '6:00 SHARP', { sx: 0.5, sy: 0.2 }, { icon: 'clock', f1: 251 });
    K.badge(f, F.CL1, 'CLACK!', { sx: 0.5, sy: 0.22 }, { style: 'stamp', f1: 452, size: 1.3 });
    K.badge(f, F.TEN, '10 LEGS', { sx: 0.5, sy: 0.2 }, { icon: 'up', f1: 800 });
    K.badge(f, F.AT, '5:58', { sx: 0.5, sy: 0.2 }, { icon: 'clock', f1: 1180, style: 'stamp', size: 1.4 });
    K.badge(f, F.FULL, 'FULL IN 4 MIN', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1731 });
    if (loc === 'barn') K.dust ? 0 : 0;
    if (loc === 'yard' && f >= F.HONKED - 2) K.steam(f, [3.4, 0.5, -10.0], { rate: 4, size: 0.4, rise: 0.4, drift: [0.5, 0.1], dark: 0.4, seed: 3 });
    if (f >= 1290 && f < 1310) K.mist(f, 1292, 16); K.mist(f, 1362, 16); K.mist(f, 1442, 16); K.mist(f, 149, 14); K.mist(f, 197, 14); K.mist(f, 622, 14); K.mist(f, 682, 14); K.mist(f, 1068, 14); K.mist(f, 1122, 14);
    return { light: { ...light, ink: 0.5, cardTint: loc === 'barn' || loc === 'cafe' ? '#fff0e0' : undefined }, cam, dof, actors: [], fx: [] };
  },
};
