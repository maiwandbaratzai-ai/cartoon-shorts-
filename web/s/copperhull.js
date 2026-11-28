// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "He Robbed a Treasure Ship With a Bucket of Worms" — invented story, engine: The Heist (SCRIPTS.md §000).
// Captain Rook ("Easy peasy, worm squeezy!") rows under the Golden Gull at midnight (ten thousand coins, forty sleepy guards). His
// crew pries off its 2,000 copper plates with spoons; Rook dumps a bucket of shipworms on the bare wood. A week later the ship sags
// and sinks like a cookie in milk, the coins pour onto Rook's rowboat, which the worms ate too: it crumbles like a cracker.
// Explainer: shipworms drill into wood tunnel by tunnel until the hull is a sponge; copper is poison to them, so old ships wrapped
// their bottoms in it. The gold sinks; a crab is now very rich. Rook paddles home in a copper bathtub; Sardine the cat keeps one coin.
import { TOTAL, LINES, wf } from './copperhull_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const BED = -5.2, BOAT = [-1.5, 0, 3.6], CRAB = [3.5, -5.6, 6], TUB = [-6, 0, 7.5], EX = [200, 0, 0];
let THREE, F = {}, SHIP, SLC = [], HOLES = [], COINS = [], RB, RBP = [], BUCKET, WORMS = [], ROOK, GIL, BO, GUARDS = [], CAT, CRABG, TUBG, LANT, HX = {}, PLATES = [], WATER, SCOIN;

function copperTex() { const c = document.createElement('canvas'); c.width = 256; c.height = 256; const g = c.getContext('2d'); g.fillStyle = '#c8783a'; g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 32) for (let x = (y / 32 % 2) * 24; x < 256 + 48; x += 48) { g.fillStyle = `hsl(${24 + (x * 7 + y) % 10}, 60%, ${46 + ((x + y * 3) % 12)}%)`; g.fillRect(x + 1, y + 1, 46, 30); g.fillStyle = '#7a4420'; for (const [a, b] of [[4, 4], [42, 4], [4, 26], [42, 26]]) { g.beginPath(); g.arc(x + a, y + b, 1.6, 0, 7); g.fill(); } }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, 1); return t; }

export default {
  TOTAL, look: 'rich',
  build(K) {
    THREE = K.THREE; const S = K.set, sc = K.scene;
    F = { ROBBED: wf(0, 'robbed'), BUCKET: wf(0, 'bucket'), WORMS: wf(0, 'worms'), GULL: wf(1, 'gull'), COINS: wf(1, 'coins'), FORTY: wf(1, 'forty'), GUARDS: wf(1, 'guards'), WHISP: wf(2, 'rook'), ROWING: wf(2, 'rowing'), COPPER: wf(2, 'copper'),
      PRIED: wf(3, 'pried'), PLATES: wf(3, 'plates'), TWO: wf(3, 'two'), SPOONS: wf(3, 'spoons'), DUMPED: wf(4, 'dumped'), WORMS2: wf(4, 'worms'), BARE: wf(4, 'bare'), SARDINE: wf(4, 'sardine'), ONE: wf(4, 'one'),
      WEEK: wf(5, 'week'), SAGGED: wf(5, 'sagged'), SANK: wf(5, 'sank'), COOKIE: wf(5, 'cookie'), POURED: wf(6, 'poured'), BOTTOM: wf(6, 'bottom'), ROWBOAT: wf(6, 'rowboat'), SAID: wf(7, 'said'), CRUMBLED: wf(7, 'crumbled'), CRACKER: wf(7, 'cracker'),
      UNDERWEAR: wf(8, 'underwear'), SHIPWORMS: wf(9, 'shipworms'), DRILL: wf(9, 'drill'), TUNNEL: wf(9, 'tunnel'), SPONGE: wf(9, 'sponge'), POISON: wf(10, 'poison'), WRAPPED: wf(10, 'wrapped'),
      SANK2: wf(11, 'sank'), CRAB: wf(11, 'crab'), RICH: wf(11, 'rich'), PADDLED: wf(12, 'paddled'), BATHTUB: wf(12, 'bathtub'), SARD2: wf(12, 'sardine'), COIN2: wf(12, 'coin') };
    // ================= Port Pickle harbor: water, seabed, dock, warehouses, palms =================
    WATER = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshPhysicalMaterial({ color: '#1a5a7a', roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.9, clearcoat: 1 }));
    WATER.rotation.x = -Math.PI / 2; WATER.position.y = 0; WATER.userData.ndSkip = true; sc.add(WATER);
    const G = K.group();
    K.slab(-120, 120, -8, -7, -80, 80, K.mat('dirt', '#d8c08a', { detail: 0.8 }), G, false);
    const bar = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 20), K.mat('dirt', '#d8c08a', { detail: 0.6 })); bar.scale.set(14, 1.9, 8); bar.position.set(0, -7, 1); G.add(bar);
    for (let k = 0; k < 40; k++) { const x = -20 + hash(k) * 40, z = -8 + hash(k + 3) * 22; const h = 0.8 + hash(k + 5) * 1.6; const w = new THREE.Mesh(new THREE.ConeGeometry(0.12, h, 5), K.paint(['#3a9a5a', '#2a7a4a', '#6ab84a'][k % 3])); w.position.set(x, -6.4 + h / 2 + (Math.abs(x) < 10 && Math.abs(z - 1) < 6 ? 1.4 : 0), z); G.add(w); }
    for (let k = 0; k < 18; k++) K.sphere(0.4 + hash(k + 9) * 0.8, K.mat('rock', '#7a8a8a', { detail: 0.4 }), -22 + hash(k + 2) * 44, -6.8, -6 + hash(k + 4) * 20, G, 1, 0.6, 1);
    // dock + pier + warehouses + lamps + crates
    K.slab(-40, 40, -0.4, 0.6, -16, -11, K.mat('wood', '#8a6a4a', { detail: 0.6 }), G, true); for (let x = -40; x <= 40; x += 3) K.cyl(0.25, 0.25, 8, K.mat('wood', '#6a4a2a'), x, -7.4, -11.2, G, 10);
    K.slab(-17, -13, -0.3, 0.5, -11, 6, K.mat('wood', '#8a6a4a', { detail: 0.6 }), G, true); for (let z = -10; z <= 6; z += 3) for (const x of [-16.8, -13.2]) K.cyl(0.2, 0.2, 7.8, K.mat('wood', '#6a4a2a'), x, -7.2, z, G, 10);
    for (let k = 0; k < 8; k++) K.rbox(1.0, 1.0, 1.0, 0.06, K.mat('wood', ['#b88a5a', '#9a6a3a'][k % 2]), -10 + k * 3.1 + hash(k) * 1.2, 1.1 + (k % 3 === 0 ? 1 : 0), -13.5 - hash(k + 1), G);
    for (let k = 0; k < 6; k++) K.cyl(0.45, 0.45, 1.1, K.mat('wood', '#8a5a34'), 6 + k * 1.1, 0.6, -14.6, G, 14);
    const cs = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.5), S.textMat('RUM? NO. JUICE', { bg: '#c8a070', fg: '#3a2010', w: 400, h: 120, border: false })); cs.position.set(-6.9, 1.6, -12.98); G.add(cs);
    S.bake(G);
    let x = -46, i = 0; while (x < 46) { const w = 6 + (i * 7 % 3); const b = S.building({ w, d: 8, floors: 2 + (i % 2), seed: i + 90, color: ['#f2c26a', '#7ac0c8', '#f28a6a', '#e8e0c8', '#a8d8a0'][i % 5], gable: i % 2 ? 'flat' : 'pitched', shop: ['HARBOR MASTER', null, 'FISH', null, 'PORT PICKLE BANK', null, 'SAILS'][i % 7], shutters: '#2a6a8a', flowers: true }); b.position.set(x + w / 2, 0.6, -17); x += w + 0.2; i++; }
    const palm = (px, pz, py = 0.6) => { const g = new THREE.Group(); g.position.set(px, py, pz); sc.add(g); for (let k = 0; k < 7; k++) { const s = K.cyl(0.26 - k * 0.02, 0.28 - k * 0.02, 0.9, K.mat('wood', '#8a6a44'), Math.sin(k * 0.3) * 0.4, k * 0.85, 0, g, 10); void s; }
      for (let k = 0; k < 7; k++) { const l = new THREE.Mesh(new THREE.ConeGeometry(0.5, 3.2, 4), K.paint('#3a9a3a', { rough: 0.6 })); l.position.set(0.4 + Math.cos(k * 0.9) * 1.3, 6.2, Math.sin(k * 0.9) * 1.3); l.rotation.set(Math.sin(k * 0.9) * 1.2, 0, -Math.cos(k * 0.9) * 1.2); g.add(l); } };
    for (const [px, pz] of [[-30, -13], [-20, -13.5], [14, -13.2], [26, -13.5], [36, -12.8]]) palm(px, pz);
    for (const [lx, lz] of [[-8, -11.6], [8, -11.6]]) { K.cyl(0.07, 0.07, 3, K.paint('#2a2a30'), lx, 0.6, lz, sc, 8); K.lamp(lx, 3.7, lz, { color: '#ffb060', intensity: 6, distance: 16 }); }
    // ================= the hero prop: the Golden Gull (bow = +x) =================
    SHIP = new THREE.Group(); sc.add(SHIP); { const WD = K.mat('wood', '#7a4a2a', { detail: 0.8 }), WL = K.mat('wood', '#a8703a', { detail: 0.6 }), GD = K.gold(), CT = copperTex();
      K.rbox(14, 3.2, 4.6, 0.8, WD, 0, 1.0, 0, SHIP);                                                     // upper hull
      for (const y of [0.2, 1.6, 2.6]) for (const s of [-1, 1]) K.rbox(13.6, 0.12, 0.08, 0.03, GD, 0, y, s * 2.31, SHIP);   // gold wales
      for (const s of [-1, 1]) for (let k = 0; k < 7; k++) { const w = new THREE.Mesh(new THREE.CircleGeometry(0.26, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffc870').multiplyScalar(1.6), toneMapped: false })); w.position.set(-5 + k * 1.6, 1.15, s * 2.32); w.rotation.y = s > 0 ? 0 : Math.PI; w.userData.ndSkip = true; SHIP.add(w); const fr = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.05, 6, 16), GD); fr.position.copy(w.position); fr.rotation.y = w.rotation.y; SHIP.add(fr); }
      const bow = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 16), WD); bow.scale.set(2.4, 1.7, 2.25); bow.position.set(6.6, 0.9, 0); SHIP.add(bow);
      const bs = K.cyl(0.12, 0.08, 5, WL, 9.2, 1.6, 0, SHIP, 8); bs.rotation.z = -1.2; bs.position.set(9.0, 2.3, 0);
      K.rbox(3.6, 2.6, 4.6, 0.3, WD, -5.6, 3.6, 0, SHIP); K.rbox(3.8, 0.15, 4.8, 0.05, GD, -5.6, 4.95, 0, SHIP);    // stern castle
      for (let k = 0; k < 4; k++) { const w = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.7), new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffc870').multiplyScalar(1.8), toneMapped: false })); w.position.set(-7.42, 3.6, -1.5 + k); w.rotation.y = -Math.PI / 2; w.userData.ndSkip = true; SHIP.add(w); }
      const nm = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 0.6), S.textMat('GOLDEN GULL', { bg: '#3a2010', fg: '#f2c230', w: 600, h: 120, border: false })); nm.position.set(-7.43, 2.2, 0); nm.rotation.y = -Math.PI / 2; SHIP.add(nm);
      const nm2 = nm.clone(); nm2.position.set(3.5, 2.05, 2.33); nm2.rotation.y = 0; SHIP.add(nm2);
      K.rbox(13.5, 0.1, 4.2, 0.03, WL, 0, 2.62, 0, SHIP);                                                   // deck
      for (const s of [-1, 1]) for (let k = 0; k < 14; k++) K.cyl(0.04, 0.04, 0.7, WL, -6.5 + k * 1.0, 2.65, s * 2.15, SHIP, 6);
      for (const s of [-1, 1]) K.rbox(13, 0.08, 0.1, 0.02, WL, 0, 3.35, s * 2.15, SHIP);
      for (const [mx, mh] of [[2.6, 13], [-1.8, 11]]) { K.cyl(0.18, 0.22, mh, WL, mx, 2.6, 0, SHIP, 12); for (const [yy, ww] of [[mh * 0.55, 5.2], [mh * 0.85, 3.8]]) { const yd = K.cyl(0.08, 0.08, ww, WL, mx, 2.6 + yy, 0, SHIP, 8); yd.rotation.x = Math.PI / 2; yd.position.set(mx, 2.6 + yy, 0);
          const sl = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, ww * 0.9, 16, 1, true, -0.35, 0.7), K.mat('fabric', '#f4ecd8', { detail: 0.3 })); sl.rotation.set(Math.PI / 2, 0, Math.PI / 2); sl.scale.set(1, 1, 0.55); sl.position.set(mx - 3.75, 2.6 + yy - 1.4, 0); sl.material.side = THREE.DoubleSide; SHIP.add(sl); }
        const fl = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.7), K.paint('#f2c230')); fl.position.set(mx - 0.6, 2.6 + mh + 0.3, 0); fl.material.side = THREE.DoubleSide; SHIP.add(fl); }
      for (let k = 0; k < 3; k++) K.cyl(0.3, 0.3, 0.5, K.mat('wood', '#8a5a34'), -1.4 + k * 1.6, 2.67, -0.6 + (k % 2) * 1.4, SHIP, 12);
      // treasure chest on deck
      K.rbox(1.4, 0.8, 0.9, 0.08, K.mat('wood', '#6a3a1a'), 0.2, 3.05, 0.6, SHIP); K.rbox(1.45, 0.1, 0.95, 0.03, GD, 0.2, 3.45, 0.6, SHIP);
      for (let k = 0; k < 14; k++) K.cyl(0.11, 0.11, 0.03, GD, -0.3 + hash(k) * 1.0, 3.5 + hash(k + 1) * 0.15, 0.3 + hash(k + 2) * 0.6, SHIP, 14).rotation.set(hash(k) * 0.6, 0, hash(k + 3) * 0.6);
      // lower hull: 10 slices, wood core + copper skin (peeled one by one)
      for (let k = 0; k < 10; k++) { const sx = -6.1 + k * 1.3; const wd = K.rbox(1.3, 2.2, 3.9, 0.5, K.mat('wood', '#6a4a2a', { detail: 0.5 }), sx, -1.5, 0, SHIP); const cp = K.rbox(1.32, 2.25, 4.0, 0.52, K.paint('#ffffff', { rough: 0.25, metal: 0.8 }), sx, -1.5, 0, SHIP); cp.material.map = CT; cp.material.color.set('#ffffff'); SLC.push({ wd, cp, sx });
        for (let h = 0; h < 6; h++) { const ho = new THREE.Mesh(new THREE.CircleGeometry(0.08 + hash(k * 6 + h) * 0.07, 10), K.paint('#1a0e08', { rough: 1 })); ho.position.set(sx - 0.5 + hash(k * 6 + h + 1) * 1.0, -2.2 + hash(k * 6 + h + 2) * 2.2, 1.96); SHIP.add(ho); HOLES.push(ho); } }
      const bowl = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 14), K.paint('#c8783a', { rough: 0.25, metal: 0.8 })); bowl.material.map = CT; bowl.scale.set(1.9, 1.3, 1.9); bowl.position.set(6.4, -1.2, 0); SHIP.add(bowl); SHIP.userData.bowl = bowl;
      SHIP.traverse((o) => { if (o.isMesh && !o.material.transparent && o.geometry.type !== 'CircleGeometry') o.castShadow = true; }); }
    for (let k = 0; k < 14; k++) { const p = K.rbox(0.5, 0.35, 0.03, 0.02, K.paint('#c8783a', { rough: 0.25, metal: 0.8 }), 0, 0, 0, sc); PLATES.push(p); }
    for (let k = 0; k < 40; k++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 16), K.gold()); c.castShadow = true; sc.add(c); COINS.push(c); }
    // Rook's rowboat (crumbles into planks) + lantern + bucket of worms
    RB = new THREE.Group(); sc.add(RB); { const WD = K.mat('wood', '#a8703a', { detail: 0.4 });
      for (let k = 0; k < 4; k++) { const pg = new THREE.Group(); RB.add(pg); RBP.push(pg); }
      K.rbox(3.2, 0.12, 1.2, 0.05, WD, 0, 0.1, 0, RBP[0]); for (const s of [-1, 1]) { K.rbox(3.2, 0.5, 0.08, 0.04, WD, 0, 0.35, s * 0.62, RBP[s > 0 ? 1 : 2]); }
      K.rbox(0.1, 0.5, 1.2, 0.04, WD, 1.55, 0.35, 0, RBP[3]); K.rbox(0.1, 0.5, 1.2, 0.04, WD, -1.55, 0.35, 0, RBP[3]); K.rbox(0.3, 0.08, 1.2, 0.02, WD, 0.3, 0.45, 0, RBP[0]);
      for (const s of [-1, 1]) { const o = K.cyl(0.03, 0.03, 2.4, WD, 0, 0, 0, RBP[s > 0 ? 1 : 2], 6); o.rotation.x = Math.PI / 2 - s * 0.5; o.position.set(0.2, 0.5, s * 1.1); }
      K.cyl(0.03, 0.03, 1.4, K.paint('#2a2a30'), 1.3, 0.1, 0, RBP[3], 6); }
    LANT = K.lamp(0, 0, 0, { color: '#ffb050', intensity: 5, distance: 10, flicker: 0.15, glowS: 1.2 });
    BUCKET = new THREE.Group(); sc.add(BUCKET); K.cyl(0.24, 0.2, 0.42, K.paint('#8a8a90', { rough: 0.3, metal: 0.6 }), 0, 0, 0, BUCKET, 16); const lb = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.14), S.textMat('WORMS', { bg: '#f2c230', fg: '#3a2010', w: 200, h: 80, border: false })); lb.position.set(0, 0.2, 0.235); BUCKET.add(lb);
    const wm = K.paint('#f08aa0', { rough: 0.35, coat: 0.6 });
    for (let k = 0; k < 12; k++) { const w = new THREE.Group(); sc.add(w); for (let s = 0; s < 5; s++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.06 - s * 0.006, 10, 8), s === 0 ? K.paint('#5a2a2a') : wm); b.position.x = -s * 0.07; w.add(b); } WORMS.push(w); }
    // the rich crab
    CRABG = new THREE.Group(); sc.add(CRABG); CRABG.position.set(...CRAB); { const R = K.paint('#e8402a', { rough: 0.3 }); K.sphere(0.6, R, 0, 0.45, 0, CRABG, 1.3, 0.55, 1);
      for (const s of [-1, 1]) { for (let k = 0; k < 3; k++) { const l = K.cyl(0.05, 0.05, 0.7, R, s * 0.5, 0.2, -0.3 + k * 0.3, CRABG, 6); l.rotation.z = s * 1.0; l.position.set(s * 0.75, 0.25, -0.35 + k * 0.35); }
        const cl = K.sphere(0.25, R, s * 0.55, 0.55, 0.7, CRABG, 1, 0.7, 1.3); void cl; K.cyl(0.03, 0.03, 0.35, R, s * 0.2, 0.65, 0.35, CRABG, 6); K.sphere(0.09, K.paint('#ffffff'), s * 0.2, 1.02, 0.35, CRABG); K.sphere(0.045, K.paint('#1a1a1a'), s * 0.2, 1.03, 0.43, CRABG); }
      K.cyl(0.18, 0.2, 0.32, K.paint('#1a1a1e'), 0, 0.7, -0.05, CRABG, 16); K.cyl(0.3, 0.3, 0.03, K.paint('#1a1a1e'), 0, 0.7, -0.05, CRABG, 16);
      const mono = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.015, 6, 16), K.gold()); mono.position.set(0.2, 1.03, 0.45); CRABG.add(mono);
      for (let k = 0; k < 24; k++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 14), K.gold()); c.position.set(-1.6 + hash(k) * 3.2, 0.02 + hash(k + 1) * 0.3, -1.2 + hash(k + 2) * 2.0); c.rotation.set(hash(k + 3) * 0.8, 0, hash(k + 4) * 0.8); CRABG.add(c); } }
    // copper bathtub
    TUBG = new THREE.Group(); sc.add(TUBG); { const CP = K.paint('#d0844a', { rough: 0.18, metal: 0.85 }); const tub = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), CP); tub.scale.set(1.3, 0.7, 0.75); tub.position.y = 0.6; tub.material.side = THREE.DoubleSide; TUBG.add(tub);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(1, 0.06, 8, 40), K.gold()); rim.rotation.x = Math.PI / 2; rim.scale.set(1.3, 0.75, 1); rim.position.y = 0.6; TUBG.add(rim);
      for (const [fx, fz] of [[-0.8, -0.4], [0.8, -0.4], [-0.8, 0.4], [0.8, 0.4]]) K.sphere(0.1, K.gold(), fx, 0.02, fz, TUBG);
      K.cyl(0.04, 0.04, 0.5, K.chrome(), 1.1, 0.6, 0, TUBG, 8); TUBG.castShadow = true; }
    SCOIN = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.03, 16), K.gold()); sc.add(SCOIN);
    // ================= explainer stage: x-ray plank, worm tunnels, sponge, copper sheet =================
    const EG = K.group(); K.cyl(9, 9, 0.1, K.paint('#1f2a44', { rough: 0.4 }), EX[0], 0, EX[2], EG, 64);
    for (const r of [4, 8.6]) { const t = new THREE.Mesh(new THREE.TorusGeometry(r, 0.04, 8, 96), new THREE.MeshBasicMaterial({ color: new THREE.Color('#36e2ff').multiplyScalar(1.6), toneMapped: false })); t.rotation.x = Math.PI / 2; t.position.set(EX[0], 0.12, EX[2]); t.userData.ndSkip = true; EG.add(t); }
    HX.plank = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.2, 1.8), K.holo('#36e2ff')); HX.plank.position.set(EX[0], 1.6, EX[2]); sc.add(HX.plank);
    HX.sponge = K.rbox(3.6, 1.2, 1.8, 0.1, K.paint('#f2d040', { rough: 0.9 }), EX[0], 1.6, EX[2], sc); for (let k = 0; k < 40; k++) { const h = new THREE.Mesh(new THREE.CircleGeometry(0.06 + hash(k) * 0.1, 10), K.paint('#8a6a10', { rough: 1 })); h.position.set(-1.7 + hash(k + 1) * 3.4, -0.5 + hash(k + 2) * 1.0, 0.91); HX.sponge.add(h); }
    HX.tun = []; for (let k = 0; k < 5; k++) { const pts = []; for (let s = 0; s <= 12; s++) pts.push([EX[0] - 1.7 + s * 0.28, 1.6 + 0.4 * Math.sin(s * 0.9 + k * 1.3) * (k % 2 ? 1 : -1), EX[2] - 0.6 + k * 0.3]); HX.tun.push({ t: K.trace(pts, { color: '#ffb070', r: 0.06 }), pts }); }
    HX.cu = K.rbox(4.0, 0.14, 2.1, 0.05, K.paint('#d0844a', { rough: 0.2, metal: 0.85 }), EX[0], 0, EX[2], sc); HX.cu.material.map = copperTex();
    // ================= characters =================
    ROOK = K.stick({ jacket: '#6a1a2a', pants: '#2a2a40', hat: 'cowboy', hatColor: '#1a1a1e', moustache: '#1a1a1a', scarf: '#d02a2a', vest: '#f2c230', belt: '#3a2418', boots: '#3a2418', build: 'stout' }, { key: 'rook' });
    GIL = K.stick({ jacket: '#2a6a8a', pants: '#3a3a4a', hat: 'beanie', hatColor: '#d02a2a', scarf: '#f4f4f0', glasses: '#2a2a2a', boots: '#1a1a1a', belt: '#3a2418' }, { key: 'gil' });
    BO = K.stick({ jacket: '#3a8a4a', pants: '#2a2a40', hairStyle: 'bun', hair: '#c8502a', scarf: '#f2c230', pockets: true, boots: '#1a1a1a', collar: '#f4f4f0' }, { key: 'bo' });
    for (let k = 0; k < 3; k++) GUARDS.push(K.stick({ jacket: '#2a3a8a', pants: '#f4f4f0', hat: 'police', hatColor: '#1a2a5a', tie: '#d02a2a', badge: true, moustache: k === 1 ? '#5a3a24' : undefined, boots: '#1a1a1a' }, { key: 'gd' + k }));
    CAT = K.animal('cat', { seed: 4, scale: 1.1, color: '#e89a3a' });
    K.addClouds(8, 700, 150);
  },
  frame(f, K) {
    const T = K.T, blink = (s) => blinkAt(f, s), sc = K.scene;
    const night = f < 560, ex = f >= 922 && f < 1150, sea = f >= 1150 && f < 1237, end = f >= 1237;
    // ---------- the ship: peel, holes, sag, sink ----------
    const peel = sm(F.PRIED - 6, F.SPOONS + 6, f);
    SLC.forEach((s, k) => { s.cp.visible = f < 330 || k / 10 >= peel; });
    const holesOn = sm(F.WORMS2, 680, f); HOLES.forEach((h, k) => { h.visible = hash(k + 11) < holesOn; });
    SHIP.userData.bowl.visible = f < 360;
    const sink = sm(F.SAGGED - 6, 860, f), sinkY = -5.5 * sink, sag = 0.08 * sm(F.SAGGED - 6, F.SAGGED + 20, f);
    SHIP.visible = !ex && !end; SHIP.position.set(0, sinkY, 0); SHIP.rotation.set(sag * 1.4, 0, -sag + 0.04 * Math.sin(f * 0.05) * (1 - sink));
    // falling copper plates while prying
    PLATES.forEach((p, k) => { const t0 = F.PRIED + k * 7; const u = (f - t0) / 50; p.visible = f >= t0 && u < 1 && !ex; if (!p.visible) return; p.position.set(-6 + (k * 0.97) % 12, -2.7 - u * 2.4, 1.5 - (k % 3) * 1.4); p.rotation.set(u * 6 + k, u * 3, u * 2); });
    // coins: pour out of the hull onto the rowboat, then sink to the crab
    COINS.forEach((c, k) => { const t0 = F.POURED - 4 + k * 1.6; const u = clamp((f - t0) / 26, 0, 1); c.visible = !ex && !end && f >= t0 && f < 922;
      if (!c.visible) return; const a = [-1.5 + hash(k) * 2.5, 1.0 + sinkY * 0.3, 2.35], b = [BOAT[0] - 1 + hash(k + 1) * 2, 0.4 + hash(k + 2) * 0.4, BOAT[2] - 0.4 + hash(k + 3) * 0.8];
      let p = [lerp(a[0], b[0], u), lerp(a[1], b[1], u) + 1.2 * Math.sin(Math.PI * u), lerp(a[2], b[2], u)];
      if (f > F.CRUMBLED) { const v = clamp((f - F.CRUMBLED) / 60, 0, 1); p = [p[0], lerp(b[1], -6.8, v), p[2]]; }
      c.position.set(...p); c.rotation.set(f * 0.3 + k, k, f * 0.2); });
    // ---------- the rowboat ----------
    let bx = BOAT[0], bz = BOAT[2], byaw = 0;
    if (f < 204) { bx = -3 + 0.004 * f; } else if (f < 327) { bx = lerp(-6, 1.5, sm(204, 321, f)); } else if (f < 560) bx = 1.5;
    const crum = sm(F.CRUMBLED - 2, F.CRACKER + 14, f);
    RB.visible = !ex && !sea && !end; RB.position.set(bx, 0.05 * Math.sin(f * 0.1) - 0.15, bz); RB.rotation.set(0.03 * Math.sin(f * 0.08), byaw, 0.04 * Math.sin(f * 0.11));
    RBP.forEach((p, k) => { const d = [[0, -1, 0], [0.4, -0.6, 1], [-0.3, -0.7, -1], [1, -0.8, 0.3]][k]; p.position.set(d[0] * crum * 1.2, d[1] * crum * 0.8, d[2] * crum * 1.2); p.rotation.set(d[2] * crum * 0.6, k * crum * 0.4, d[0] * crum * 0.8); });
    LANT.light.position.set(bx + 1.3, 1.6, bz); LANT.glow.position.copy(LANT.light.position); LANT.light.intensity = night && !ex ? 5 : 0; LANT.glow.visible = night;
    // bucket + worms
    const dumpU = sm(F.DUMPED - 4, F.BARE + 6, f);
    BUCKET.visible = night; BUCKET.scale.setScalar(1.4); if (f < 204) BUCKET.position.set(bx + 0.3, 1.45 + 0.05 * Math.sin(f * 0.2), bz + 0.45); else BUCKET.position.set(bx - 0.4 + (f >= 438 ? 0.6 : 0), 0.5 + (f >= 438 ? 0.6 * dumpU : 0), bz - (f >= 438 ? 0.3 : 0)); BUCKET.rotation.set(-1.8 * dumpU, 0, 0);
    WORMS.forEach((w, k) => { const s = f * 0.25 + k; w.visible = night && !ex && f < 560;
      if (f < 438) { const bp = BUCKET.position; w.position.set(bp.x + Math.cos(s) * 0.17, bp.y + 0.38 + 0.08 * Math.sin(s * 2), bp.z + Math.sin(s) * 0.17); w.scale.setScalar(1.4); w.rotation.set(0, s, Math.sin(s * 3) * 0.6); }
      else { const u = clamp((f - F.DUMPED - k * 2) / 30, 0, 1); const tgt = [-5 + k * 0.9, -1.0 - (k % 3) * 0.5, 1.98]; w.position.set(lerp(bx + 0.2, tgt[0], u), lerp(1.2, tgt[1], u) + 0.8 * Math.sin(Math.PI * u), lerp(bz - 0.3, tgt[2], u)); w.rotation.set(0, Math.PI / 2 + Math.sin(s * 2) * 0.3, Math.sin(s * 3) * 0.4); } });
    // ---------- characters ----------
    const rk = [[0, 'show', { expr: 'evil', R: [0.4, 0.0, 'open'] }], [F.WORMS, 'hips', { expr: 'gloat' }], [86, 'point', { expr: 'smug' }], [204, 'sneak', { expr: 'grin', talk: true }], [F.ROWING, 'sit', { expr: 'smug' }],
      [327, 'point', { expr: 'stern' }], [F.SPOONS, 'clap', { expr: 'grin' }], [438, 'reach', { expr: 'evil' }], [F.DUMPED, 'throw', { expr: 'gloat' }], [F.SARDINE, 'hips', { expr: 'smug' }],
      [684, 'cheer', { expr: 'excited' }], [F.ROWBOAT, 'celebrate', { expr: 'laugh' }], [F.SAID - 4, 'hips', { expr: 'smug', talk: true }], [F.CRUMBLED, 'shock', { expr: 'shock' }], [F.CRACKER + 6, 'panic', { expr: 'scared', sweat: true }],
      [866, 'shrug', { expr: 'dazed' }], [1237, 'sit', { expr: 'pained', R: [0.7, -0.2, 'open'] }], [F.BATHTUB, 'sit', { expr: 'sad', R: [0.7, -0.4, 'open'] }], [F.COIN2, 'facepalm', { expr: 'pained' }]];
    const rA = T.act(f, rk, { seed: 3, blink: blink(3) });
    let rp = { x: bx - 0.2, y: -0.15, z: bz, yaw: Math.PI / 2 + 0.6, seat: 0.45 };
    if (f >= 204 && f < 327 && rA.opts) rp = { ...rp, yaw: Math.PI / 2 };
    if (f >= 565 && f < 922) { rp = { x: bx - 0.2, y: crum > 0 ? lerp(-0.15, -1.2, crum) : -0.15, z: bz, yaw: 0.6 }; }
    if (end) { const u = sm(1237, 1368, f); rp = { x: TUB[0] + 5 - 6 * u, y: 0.05, z: TUB[2], yaw: -Math.PI / 2 + 0.6, seat: 0.45 }; }
    ROOK.set(rA, { ...rp, visible: !ex && !sea });
    // crew: underwater prying plates with "spoons", then on the boat
    [GIL, BO].forEach((c, k) => { const ck = [[0, 'sneak', { expr: 'grin' }], [204, 'idle', { expr: 'nervous' }], [327, 'hammer', { expr: 'stern', R: [0.3, -0.5, 'hammer'] }], [F.SPOONS, 'shrug', { expr: 'dazed' }], [438, 'cheer', { expr: 'grin' }], [565, 'pointUp', { expr: 'excited' }], [F.ROWBOAT, 'celebrate', { expr: 'laugh' }], [F.CRUMBLED, 'panic', { expr: 'scared' }]];
      const under = f >= 327 && f < 438; const pos = under ? { x: -3 + k * 4 + 0.6 * Math.sin(f * 0.05 + k), y: BED + 0.25, z: 1.0 + k * 0.6, yaw: Math.PI + 0.3 } : { x: bx + 0.9 - k * 1.8, y: -0.15 - (crum > 0 ? crum * 1.0 : 0), z: bz + (k ? -0.15 : 0.2), yaw: Math.PI / 2 + (k ? 0.4 : -0.4), seat: 0.45 };
      const A = T.act(f, ck, { seed: 10 + k, blink: blink(10 + k) }); if (!under && A.opts && f < 565) A.opts.mode = A.opts.mode;
      c.set(under ? A : T.act(f, ck.map((q) => [q[0], f >= 565 ? q[1] : 'sit', q[2]]), { seed: 10 + k, blink: blink(10 + k) }), { ...pos, visible: !ex && !sea && !end }); });
    GUARDS.forEach((g, k) => { const gk = [[0, 'sit', { expr: 'sleepy' }], [565, 'sit', { expr: 'sleepy' }], [F.SAGGED, 'shock', { expr: 'shock' }], [F.SANK, 'panic', { expr: 'scared', sweat: true }], [F.COOKIE, 'cheer', { expr: 'shock' }]];
      const sp = SHIP.localToWorld(new THREE.Vector3(-1.4 + k * 1.6, 2.7, -0.6 + (k % 2) * 1.4)); g.set(T.act(f, gk, { seed: 20 + k, blink: f < 565 ? 1 : blink(20 + k) }), { x: sp.x, y: sp.y, z: sp.z, yaw: 0.4 * k - 0.2, seat: 0.5, visible: !ex && !end && f < 700 }); });
    // Sardine the cat
    let cat = { x: bx + 1.25, y: 0.25, z: bz + 0.1, yaw: Math.PI / 2 + 0.8, mode: 'sit', expr: f < 40 ? 'shock' : f < F.SARDINE ? 'neutral' : 'happy' };
    if (f >= 565 && f < 922) cat = { x: bx + 1.25, y: crum > 0 ? 0.25 + 2.2 * Math.sin(Math.PI * crum) : 0.25, z: bz, yaw: 0.8, mode: crum > 0 && crum < 1 ? 'jump' : 'sit', expr: f >= F.POURED ? 'happy' : 'shock' };
    if (f >= F.CRACKER + 14 && f < 922) cat = { x: -3.0, y: 2.7 - 5.5 * sink + 1.0, z: 2.0, yaw: 0.6, mode: 'sit', expr: 'happy' };
    if (end) cat = { x: rp.x + 1.0, y: 0.55, z: TUB[2] + 0.1, yaw: 0.4, mode: 'sit', expr: 'happy' };
    CAT.set(f, { ...cat, visible: !ex && !sea });
    SCOIN.visible = (f >= F.CRACKER + 14 && f < 922) || end; { const cp = CAT.root.position; SCOIN.position.set(cp.x + 0.28 * Math.sin(cat.yaw || 0), cp.y + 0.42, cp.z + 0.28 * Math.cos(cat.yaw || 0)); SCOIN.rotation.set(Math.PI / 2, 0, 0); }
    TUBG.visible = end; TUBG.position.set(rp.x + 0.2, -0.25 + 0.04 * Math.sin(f * 0.1), TUB[2]); TUBG.rotation.set(0, 0.6, 0.03 * Math.sin(f * 0.07));
    CRABG.visible = sea || (f >= 860 && f < 922); CRABG.rotation.y = 0.3 * Math.sin(f * 0.05);
    WATER.visible = !ex;
    // ---------- explainer ----------
    HX.plank.visible = ex && f < F.SPONGE - 4; HX.sponge.visible = ex && f >= F.SPONGE - 4;
    HX.tun.forEach((t, k) => t.t.show(ex && f < 1058 ? sm(F.DRILL + k * 6, F.SPONGE - 4 + k * 3, f) : 0));
    WORMS.forEach((w, k) => { if (!ex) return; w.visible = k < 5 || (f >= 1058 && k < 9); w.scale.setScalar(2.2);
      if (f < 1058) { const t = HX.tun[k % 5], u = sm(F.DRILL + k * 6, F.SPONGE - 4 + k * 3, f), i = Math.min(11, Math.floor(u * 12)), v = u * 12 - i; const a = t.pts[i], b = t.pts[i + 1];
        w.position.set(lerp(a[0], b[0], v), lerp(a[1], b[1], v), lerp(a[2], b[2], v) + 0.95); w.rotation.set(0, Math.PI, Math.atan2(b[1] - a[1], b[0] - a[0]) * -1); }
      else { const u = clamp((f - F.POISON + 6 - k * 2) / 26, 0, 1); w.position.set(EX[0] - 1.6 + k * 0.4, 0.45 + 2.2 * Math.sin(Math.PI * u), EX[2] + 1.4 + u * 1.6); w.rotation.set(u * 6, k, u * 4); } });
    HX.cu.visible = ex && f >= 1058; HX.cu.position.set(EX[0], lerp(5, 0.15, sm(1060, F.POISON, f)), EX[2]); HX.sponge.position.y = f >= 1058 ? lerp(1.6, 0.9, sm(1060, F.POISON, f)) : 1.6;
    // ---------- shots ----------
    let cam, dof, u, under = false; const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const body = (x, z, y = 0, h = 2.3) => [[x, y, z], [x, y + h, z]];
    const SB = () => [SHIP.localToWorld(new THREE.Vector3(9, -2.6, -2.4)).toArray(), SHIP.localToWorld(new THREE.Vector3(-7.5, 15, 2.4)).toArray()];
    if (sh(0, 42)) {                          // 1. hook: Rook in the rowboat under the hull, holding up a glowing bucket of worms (water level)
      cam = { pos: [bx + 3.0, 1.4, bz + 5.4], look: [bx - 0.3, 1.6, bz - 0.6], fov: 50 * K.push(u, 0.06) }; dof = { focus: 5.6, cinf: 5 };
    } else if (sh(42, 86)) {                  // 2. ... with a bucket of worms (wide: rowboat, the huge ship, moon)
      cam = K.fit([...SB(), [bx, 0, bz + 1]], { yaw: 70, pitch: 6, fov: 46, margin: 0.75, maxDist: 20 }); cam.fov *= K.punch(f, F.WORMS, 0.06, 6);
    } else if (sh(86, 140)) {                 // 3. inside the Golden Gull: ten thousand coins (deck: the chest)
      const c = SHIP.localToWorld(new THREE.Vector3(0.2, 3.4, 0.6)); cam = { pos: [c.x + 2.2, c.y + 1.6, c.z + 3.4], look: [c.x, c.y, c.z], fov: 42 * K.punch(f, F.COINS, 0.08, 6) }; dof = { focus: 4.2, cinf: 9 };
    } else if (sh(140, 204)) {                // 4. forty sleepy guards (deck wide)
      const c = SHIP.localToWorld(new THREE.Vector3(0, 3.4, 0)); cam = { pos: [c.x + 1.0, c.y + 3.4, c.z + 7.0], look: [c.x, c.y, c.z], fov: 50 * K.push(u, 0.05) };
    } else if (sh(204, 262)) {                // 5. "Easy peasy, worm squeezy!" (Rook close, whispering)
      cam = { pos: [bx + 1.6, 1.4, bz + 3.0], look: [bx - 0.2, 1.1, bz], fov: 42 * K.push(u, 0.05) }; dof = { focus: 3.4, cinf: 10 };
    } else if (sh(262, 327)) {                // 6. rowing under its shiny copper belly (underwater looking up: hull + boat silhouette)
      under = true; cam = { pos: [bx + 4, -4.2, bz + 5], look: [bx - 1, -1.6, 0.5], fov: 54 * K.push(u, 0.05) };
    } else if (sh(327, 380)) {                // 7. his crew pries off the plates (underwater wide)
      under = true; cam = K.fit([[-6.5, BED, 0], [6.5, -0.4, 2], [-3, BED, 1], [1, BED + 2.3, 1.6]], { yaw: 90, pitch: 4, fov: 50, margin: 0.8, maxDist: 12 }); cam.pos[1] = Math.min(cam.pos[1], -0.8);
    } else if (sh(380, 438)) {                // 8. two thousand of them. With spoons. (underwater closer, different angle)
      under = true; cam = { pos: [3.5, -3.4, 6.5], look: [-1, -2.6, 1], fov: 46 * K.punch(f, F.SPOONS, 0.1, 6) };
    } else if (sh(438, 500)) {                // 9. Rook dumps the worms on the bare wood (water level wide)
      cam = { pos: [bx + 3.8, 1.5, bz + 6.2], look: [bx - 2.0, 0.2, bz - 1.2], fov: 50 * K.punch(f, F.BARE, 0.06, 6) };
    } else if (sh(500, 560)) {                // 10. Sardine only wanted one coin (cat reaction)
      cam = { pos: [bx + 4.0, 1.5, bz + 1.8], look: [bx + 1.25, 0.6, bz + 0.1], fov: 40 * K.push(u, 0.06) }; dof = { focus: 3.0, cinf: 10 };
    } else if (sh(560, 620)) {                // 11. a week later: the Golden Gull sags (day wide)
      cam = K.fit([...SB(), [bx, 0, bz + 1]], { yaw: 75, pitch: 8, fov: 46, margin: 0.75, maxDist: 22 }); cam.fov *= K.punch(f, F.SAGGED, 0.06, 6);
    } else if (sh(620, 684)) {                // 12. ... sank slowly, like a cookie in milk (low side wide)
      cam = K.fit([...SB(), [bx, 0, bz + 1]], { yaw: 110, pitch: 3, fov: 46, margin: 0.75, maxDist: 22 }); cam.fov *= K.punch(f, F.COOKIE, 0.08, 6);
    } else if (sh(684, 759)) {                // 13. coins pour out onto Rook's rowboat (full shot)
      cam = K.fit([[bx - 2, 0, bz - 2], [bx + 2, 3.2, bz + 1], [-1.5, 3, 2.3]], { yaw: 85, pitch: 10, fov: 44, margin: 0.85, maxDist: 10 }); cam.fov *= K.punch(f, F.ROWBOAT, 0.08, 6);
    } else if (sh(759, 815)) {                // 14. "Easy peasy," said Rook (reaction)
      cam = { pos: [bx + 1.0, 1.5, bz + 3.2], look: [bx - 0.2, 1.0, bz], fov: 42 * K.push(u, 0.05) }; dof = { focus: 3.4, cinf: 10 };
    } else if (sh(815, 866)) {                // 15. his wormy rowboat crumbles like a cracker (wide)
      cam = K.fit([[bx - 3, -1, bz - 2], [bx + 3, 2.6, bz + 2]], { yaw: 70, pitch: 14, fov: 44, margin: 0.85, maxDist: 10 }); cam.fov *= K.punch(f, F.CRACKER, 0.1, 6); const s = K.shake(f, F.CRUMBLED, 0.05, 12); cam.pos[1] += s[1];
    } else if (sh(866, 922)) {                // 16. why would a wooden ship wear copper underwear? (wide: masts poking out, Rook bobbing)
      cam = K.fit([...SB(), [bx, -1, bz]], { yaw: 120, pitch: 12, fov: 46, margin: 0.75, maxDist: 22 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(922, 990)) {                // 17. explainer: shipworms drill tunnels (x-ray plank)
      cam = K.fit([[EX[0] - 2, 0.6, EX[2] - 1], [EX[0] + 2, 2.8, EX[2] + 1]], { yaw: 70 + 10 * u, pitch: 12, fov: 42, margin: 0.9, maxDist: 10 }); cam.fov *= K.punch(f, F.DRILL, 0.06, 6);
    } else if (sh(990, 1058)) {               // 18. until the hull is a sponge (closer, then sponge)
      cam = K.fit([[EX[0] - 2, 0.6, EX[2] - 1], [EX[0] + 2, 2.8, EX[2] + 1]], { yaw: 65, pitch: 18, fov: 40, margin: 0.85, maxDist: 9 }); cam.fov *= K.punch(f, F.SPONGE, 0.1, 6);
    } else if (sh(1058, 1104)) {              // 19. copper is poison (the sheet drops, worms bounce off)
      cam = K.fit([[EX[0] - 2.2, 0, EX[2] - 1], [EX[0] + 2.2, 3.2, EX[2] + 3]], { yaw: 100, pitch: 14, fov: 42, margin: 0.85, maxDist: 11 }); cam.fov *= K.punch(f, F.POISON, 0.08, 6);
    } else if (sh(1104, 1150)) {              // 20. so old ships wrapped their bottoms in it (low angle on the copper)
      cam = K.fit([[EX[0] - 2.2, 0, EX[2] - 1], [EX[0] + 2.2, 2.2, EX[2] + 1]], { yaw: 125, pitch: 6, fov: 42, margin: 0.85, maxDist: 10 }); cam.fov *= K.push(u, 0.06);
    } else if (sh(1150, 1196)) {              // 21. the gold sank (underwater wide, the sunken ship, coins on the sand)
      under = true; cam = { pos: [CRAB[0] + 4, -3.0, CRAB[2] + 6], look: [CRAB[0] - 1.5, -5.0, CRAB[2] - 2.5], fov: 50 * K.push(u, 0.05) };
    } else if (sh(1196, 1237)) {              // 22. a crab down there is now very rich (crab close)
      under = true; cam = { pos: [CRAB[0] + 1.0, CRAB[1] + 1.2, CRAB[2] + 3.0], look: [CRAB[0], CRAB[1] + 0.5, CRAB[2]], fov: 42 * K.punch(f, F.RICH, 0.08, 6) }; dof = { focus: 3.2, cinf: 10 };
    } else if (sh(1237, 1296)) {              // 23. Rook paddles home in a copper bathtub (wide toward the dock)
      cam = K.fit([[rp.x - 1.5, 0, TUB[2] - 1], [rp.x + 1.5, 2.2, TUB[2] + 1], [rp.x - 4, 1, -12]], { yaw: 80, pitch: 14, fov: 44, margin: 1.0, maxDist: 14 }); cam.fov *= K.punch(f, F.BATHTUB, 0.06, 6);
    } else {                                  // 24. Sardine kept one coin (closer full shot, then pull back)
      cam = K.fit([[rp.x - 1.5, 0, TUB[2] - 1], [rp.x + 1.8, 2.2, TUB[2] + 1]], { yaw: lerp(60, 75, u), pitch: 10, fov: 42, margin: lerp(0.95, 1.4, u), maxDist: 10 }); cam.fov *= K.punch(f, F.COIN2, 0.06, 6);
    }
    dof = dof || { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[1] - cam.look[1], cam.pos[2] - cam.look[2]), cinf: 4 };
    // ---------- effects + graphics ----------
    if (under) { WATER.material.side = THREE.BackSide; } else WATER.material.side = THREE.FrontSide;
    if (f >= F.PRIED && f < 438) K.sparks(f, F.PRIED, 438, () => [-3 + 4 * ((f >> 4) % 2) + 0.6 * Math.sin(f * 0.05), -2.6, 2.0], { dir: [0, -1, 0.3], spread: 1, rate: 14, speed: 1.5, life: 12, color: '#ffc080', seed: 2 });
    if (under || sea) K.steam(f, [bx, -5, 2], { rate: 4, size: 0.15, rise: 1.6, drift: [0, 0], dark: 0 });
    if (f >= F.SAGGED && f < 922 && !ex) { K.steam(f, [0, 0.05, 2.6], { rate: 6, size: 0.5, rise: 0.4, drift: [0, 0.3], dark: 0 }); if (f % 5 === 0) K.puff(f, f, -4 + hash(f) * 8, 2.6, 4, 0.8, '#ffffff'); }
    if (f >= F.CRUMBLED && f < F.CRUMBLED + 14) K.puff(f, F.CRUMBLED, bx, bz, 10, 1.0, '#ffffff');
    if (sea) K.sparks(f, 1150, 1237, [CRAB[0], CRAB[1] + 0.4, CRAB[2]], { dir: [0, 1, 0], spread: 2, rate: 6, speed: 0.6, life: 30, color: '#fff2a0', seed: 8 });
    K.mist(f, 556, 16); K.mist(f, 916, 14); K.mist(f, 1144, 14); K.mist(f, 1231, 14);
    K.badge(f, F.WORMS, 'TOOL: BUCKET OF WORMS', { sx: 0.5, sy: 0.2 }, { icon: 'warn', f1: 84 });
    K.badge(f, F.COINS, '10,000 COINS', { sx: 0.5, sy: 0.2 }, { icon: 'coin', f1: F.FORTY - 2 });
    K.badge(f, F.FORTY, '40 SLEEPY GUARDS', { sx: 0.5, sy: 0.2 }, { icon: 'clock', f1: 200 });
    K.badge(f, F.COPPER, 'COPPER BELLY', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 320 });
    if (f >= F.PRIED && f < 436) K.badge(f, F.PRIED, 'PLATES OFF: ' + Math.round(2000 * peel).toLocaleString('en-US'), { sx: 0.5, sy: 0.14 }, { icon: 'warn', f1: 436 });
    K.badge(f, F.SPOONS, 'WITH SPOONS', { sx: 0.5, sy: 0.24 }, { style: 'stamp', f1: 436 });
    K.badge(f, F.BARE, 'BARE WOOD + WORMS', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 556 });
    K.badge(f, F.WEEK, 'A WEEK LATER', { sx: 0.5, sy: 0.2 }, { icon: 'clock', f1: F.COOKIE - 2 });
    K.badge(f, F.COOKIE, 'LIKE A COOKIE IN MILK', { sx: 0.5, sy: 0.2 }, { icon: 'down', f1: 680 });
    K.badge(f, F.CRACKER, 'ROWBOAT: EATEN TOO', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 862 });
    K.badge(f, F.SPONGE, 'HULL = SPONGE', { sx: 0.5, sy: 0.2 }, { icon: 'x', f1: 1054 });
    K.badge(f, F.POISON, 'COPPER = WORM POISON', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1148 });
    K.badge(f, F.RICH, 'RICHEST CRAB IN TOWN', { sx: 0.5, sy: 0.2 }, { style: 'stamp', f1: 1235 });
    K.badge(f, F.BATHTUB, 'WORM-PROOF', { sx: 0.5, sy: 0.2 }, { icon: 'check', f1: 1366 });
    let L;
    if (ex) L = K.light('night', { az: 120, el: 40, exposure: 1.3 });
    else if (under || sea) L = K.light('day', { az: 120, el: 60, fog: '#1f6a8a', fogNear: 1, fogFar: 24, skyTop: '#1f5a7a', skyHor: '#2f8aa8', hemi: 1.3, exposure: 1.3, sun: '#a8e8ff' });
    else if (night) L = K.light('night', { az: 110, el: 35, hemi: 0.9, sunI: 1.4, exposure: 1.6 });
    else L = K.light('golden', { az: 115, el: 32, shadowExt: 30, exposure: 1.2 });
    return { light: { ...L, ink: 0.5 }, cam, dof, actors: [], fx: [] };
  },
};
