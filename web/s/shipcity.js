// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why are there ships buried under San Francisco's skyscrapers?" (story, inspired by the Gold Rush ships of Yerba Buena
// Cove: crews abandoned hundreds of ships in 1849-51; some became a hotel (Niantic), stores and a jail (Euphemia); the 1851
// fire burned the waterfront; the cove was filled in on top of them; builders still find them, and a Muni tunnel cuts
// through the hull of the Rome.)
// Sets: a downtown dig site, a map of buried ships, the 1849 harbor + gold hills + beached ship buildings, the landfill
// time-lapse, a subway tunnel through a hull.
import { TOTAL, LINES, wf } from './shipcity_timing.js';
import * as PR from '../props.js';
import * as D from './d19.js';
import * as X from './kit3d.js';
const { clamp, lerp, sm } = D;
export { TOTAL };
const L = LINES, W = wf;
let PL = [];
let K, BUCKET, ARMG, HERO, SAILS = [], FLAMES = [], MOUND, RISE = [], TRAIN, NUGGET, PAN, CAPHAT, GULLS = [], HORSE, WAGON, DIRTLOAD, SHIPS = [], BEACHED = [];
let WK1, WK2, MINER, SAILOR, COOK, CAPT, MERCH, LADY, SHER, DRIVER, PED, RUN = [];
const WK1_O = { jacket: '#ff8a1a', pants: '#3a4a6a', hat: 'hardhat', hatColor: '#f2c230', vest: '#f2e23a', gloves: '#c8a060', boots: '#4a3020' };
const WK2_O = { jacket: '#3a6ea5', pants: '#2a2a30', hat: 'hardhat', hatColor: '#ffffff', vest: '#ff6a1a', glasses: '#333', gloves: '#e8e0d0' };
const MINER_O = { jacket: '#c84a2a', pants: '#3a5a8a', hat: 'cowboy', hatColor: '#6a4a2a', vest: '#5a3a24', moustache: '#3a2418', scarf: '#f2c230', belt: '#2a1a12' };
const SAILOR_O = { jacket: '#f4f4f4', pants: '#1f2a4a', hat: 'beanie', hatColor: '#1f2a4a', scarf: '#c0392b', collar: '#1f2a4a', belt: '#5a3a24' };
const COOK_O = { jacket: '#f2efe8', pants: '#3a3a40', hat: 'chef', apron: '#ffffff', bowtie: '#3a6ea5', moustache: '#8a5a24', collar: false };
const CAPT_O = { jacket: '#1a2440', pants: '#1a2440', hat: 'police', hatColor: '#1a2440', badge: true, moustache: '#d8d8d8', belt: '#c8a040', gloves: '#ffffff' };
const MERCH_O = { jacket: '#7a5a3a', pants: '#2a2a30', hat: 'tophat', hatColor: '#3a2a1a', vest: '#c8a050', bowtie: '#2a6a3a', glasses: true, build: 'stout' };
const LADY_O = { jacket: '#8a4aa0', dress: '#8a4aa0', hairStyle: 'bun', hair: '#c8602a', scarf: '#f2f2f2', gloves: '#ffffff', collar: '#ffffff' };
const SHER_O = { jacket: '#c8a878', pants: '#5a4a3a', hat: 'cowboy', hatColor: '#2a2a2a', badge: true, vest: '#3a2a1a', moustache: '#2a1a12', belt: '#2a1a12' };
const DRIVER_O = { jacket: '#5a7a4a', pants: '#4a3a2a', hat: 'cap', cap: '#8a6a3a', scarf: '#3a6ea5', gloves: '#3a2a1a', pockets: true };
const PED_O = { jacket: '#e84a5f', pants: '#2c3e5a', hairStyle: 'ponytail', hair: '#2a1a12', scarf: '#f2c230', glasses: true, pockets: true };
const DAY = { az: 60, el: 38, sky: '#d8e8f4', ground: '#8a9a6a', hemi: 1.0, sun: '#fff0d8', sunI: 3.2, skyTop: '#3f7ad0', skyHor: '#e8eef2', fog: '#dde8ee', fogNear: 80, fogFar: 380,
  sat: 1.15, vig: 0.24, shadowExt: 18, exposure: 1.12, ink: 0.55, bloom: 0.6 };
const PIT = { ...DAY, el: 68, hemi: 1.35, exposure: 1.25 };
const DUSK = { az: 70, el: 10, sky: '#f8a880', ground: '#6a5a4a', hemi: 0.9, sun: '#ff9a60', sunI: 2.6, skyTop: '#3a3a8a', skyHor: '#ff9a70', fog: '#c88a7a', fogNear: 60, fogFar: 300,
  sat: 1.2, vig: 0.32, shadowExt: 20, exposure: 1.1, ink: 0.55, bloom: 0.9 };
const TUN = { az: 80, el: 60, sky: '#5a5a60', ground: '#4a4a4a', hemi: 1.8, sun: '#ffffff', sunI: 0.0, skyTop: '#1a1a1e', skyHor: '#1a1a1e', fog: '#1a1a1e', fogNear: 20, fogFar: 70,
  sat: 1.1, vig: 0.3, shadowExt: 14, exposure: 1.9, bloom: 0.7, ink: 0.55 };
const HX = 300, MPX = 900, TX = -300;

// a sailing ship: hull along +x (bow at +x), deck at y = 2.4; returns { root, masts }
function ship(o = {}) {
  const { THREE } = K; const g = K.group(o.parent); const s = new THREE.Shape(); s.moveTo(-5, -1.5); s.lineTo(3, -1.6); s.quadraticCurveTo(5.2, -1.0, 6.2, 0); s.quadraticCurveTo(5.2, 1.0, 3, 1.6); s.lineTo(-5, 1.5); s.lineTo(-5, -1.5);
  const hg = new THREE.ExtrudeGeometry(s, { depth: 2.4, bevelEnabled: false }); hg.rotateX(-Math.PI / 2);
  const hull = K.add(hg, K.mat('wood', o.hull || '#5a3a24', { detail: 0.5 }), 0, 0, 0, g); hull.scale.set(1, 1, 1);
  K.add(new THREE.ExtrudeGeometry(s, { depth: 0.25, bevelEnabled: false }).rotateX(-Math.PI / 2), K.mat('wood', o.stripe || '#c8a040'), 0, 1.9, 0, g).scale.set(1.01, 1, 1.03);
  K.slab(-5, 3, 2.4, 2.5, -1.45, 1.45, K.mat('wood', '#a8804a', { detail: 0.3 }), g);
  const masts = [];
  if (o.masts !== 0) for (const [x, h] of [[-2.6, 11], [1.2, 13], [4.2, 9]].slice(0, o.masts || 3)) { const m = K.cyl(0.12, 0.16, h, K.mat('wood', '#6a4a2a'), x, 2.4, 0, g); masts.push(m);
    for (const y of [h * 0.55, h * 0.85]) { const yd = K.cyl(0.06, 0.06, 3.6 - y / h, K.mat('wood', '#6a4a2a'), x, 2.4 + y, 0, g); yd.rotation.x = Math.PI / 2; yd.position.z = -(3.6 - y / h) / 2; yd.position.y = 2.4 + y;
      if (o.sails !== false) { const sl = K.cyl(0.18, 0.18, 3.2 - y / h, K.mat('fabric', '#efe6d0'), x + 0.05, 2.25 + y, -(3.2 - y / h) / 2, g); sl.rotation.x = Math.PI / 2; sl.position.z = -(3.2 - y / h) / 2; } } }
  if (o.bowsprit !== false) K.beam(new THREE.Vector3(5.8, 2.2, 0), new THREE.Vector3(8.5, 3.4, 0), 0.07, K.mat('wood', '#6a4a2a'), g);
  for (let i = 0; i < 6; i++) K.cyl(0.12, 0.12, 0.05, K.toon({ color: '#2a2a2a', plain: true }), -3.5 + i * 1.3, 1.5, 1.52, g).rotation.x = Math.PI / 2;   // portholes
  return { root: g, masts };
}
function tower(x, z, w, h, d, c, seed, parent) { const { THREE } = K; return K.add(new THREE.BoxGeometry(w, h, d), K.toon({ map: PR.facadeTex(c, Math.round(w / 2.5), Math.round(h / 3.5), seed, '#e8eef4'), kind: 'plaster', amt: 0.08 }), x, h / 2, z, parent); }
function build(k) {
  K = k; D.init(K); X.init(K); const { THREE } = K; const r = X.rnd(23);
  // ---- downtown dig site ----
  const asph = K.mat('grime', '#6a6a70', { amt: 0.3, detail: 2 }), walk = K.mat('plaster', '#c8c4bc', { detail: 0.7 });
  K.slab(-200, 200, -0.3, 0, -200, -8, asph, K.scene, false); K.slab(-200, 200, -0.3, 0, 2, 200, asph, K.scene, false); K.slab(-200, -7, -0.3, 0, -8, 2, asph, K.scene, false); K.slab(7, 200, -0.3, 0, -8, 2, asph, K.scene, false);
  K.slab(-60, 60, 0, 0.1, 5, 9, walk, K.scene, false);
  const dirt = K.mat('dirt', '#8a6a44', { detail: 0.7, bump: 0.04 });
  K.slab(-7, 7, -5.2, -5, -8, 2, dirt, K.scene, false); K.slab(-7.2, -7, -5, 0, -8, 2, dirt); K.slab(7, 7.2, -5, 0, -8, 2, dirt); K.slab(-7, 7, -5, 0, -8.2, -8, dirt); K.slab(-7, 7, -5, 0, 2, 2.2, dirt);
  for (let i = 0; i < 4; i++) K.slab(-7 + i * 3.5, -5 + i * 3.5, -5.0, -4.6, -8, -5, K.mat('dirt', '#7a5a3a'));
  const s1 = ship({ masts: 0, bowsprit: false, hull: '#4a3020', stripe: '#6a5a3a' }); s1.root.position.set(-2.8, -6.9, -4.8); s1.root.rotation.set(0.0, 0.0, 0.4);
  const s2 = ship({ masts: 0, bowsprit: false, hull: '#5a3a24', stripe: '#7a6a4a' }); s2.root.position.set(4.6, -6.9, -6.8); s2.root.rotation.set(0, 2.5, 0.35);
  // bottles + boots inside the first hull
  for (let i = 0; i < 6; i++) { K.cyl(0.07, 0.08, 0.32, K.toon({ color: i % 2 ? '#2a6a3a' : '#5a3a2a', plain: true, roughness: 0.1 }), 3.0 + i * 0.2, -5.0, -2.0 + (i % 2) * 0.25); }
  for (let i = 0; i < 2; i++) { const bt = K.group(); bt.position.set(3.3 + i * 0.5, -5.0, -1.55); K.slab(-0.08, 0.08, 0, 0.35, -0.08, 0.08, K.mat('fabric', '#4a2a1a'), bt); K.slab(-0.08, 0.2, 0, 0.1, -0.08, 0.08, K.mat('fabric', '#4a2a1a'), bt); }
  // excavator in the pit
  const ex = K.group(); ex.position.set(-4.4, -5, 0.2); ex.rotation.y = -0.5; K.slab(-1.3, 1.3, 0, 0.6, -1, 1, K.mat('metal', '#2a2a2a'), ex); K.slab(-1.1, 1.1, 0.6, 2.2, -0.9, 0.9, K.mat('metal', '#f2b81a', { detail: 0.6 }), ex);
  K.slab(0.2, 1.1, 1.4, 2.1, 0.88, 0.92, K.toon({ color: '#bfe0f0', plain: true }), ex);
  ARMG = K.group(ex); ARMG.position.set(1.0, 1.8, 0); K.slab(0, 3.2, -0.15, 0.15, -0.15, 0.15, K.mat('metal', '#f2b81a'), ARMG); BUCKET = K.group(ARMG); BUCKET.position.set(3.2, 0, 0); K.slab(-0.2, 0.2, -1.8, 0, -0.15, 0.15, K.mat('metal', '#f2b81a'), BUCKET);
  K.slab(-0.5, 0.4, -2.3, -1.7, -0.5, 0.5, K.mat('metal', '#5a5a5a'), BUCKET);
  // fence, sign, towers, crane
  for (let x = -7; x <= 7; x += 1) K.slab(x - 0.03, x + 0.03, 0, 1.6, 2.6, 2.66, K.mat('metal', '#bbbbbb')); K.slab(-7, 7, 1.5, 1.56, 2.6, 2.66, K.mat('metal', '#bbbbbb'));
  D.sign(2.6, 0.9, D.txtTex(512, 180, '#f2c230', '#1a1a1a', ['DIG SITE', 'KEEP OUT'], 'bold 70px Arial Black, Arial'), 3.5, 1.9, 2.7, 0, K.scene, 'plaster');
  for (const [x, z, w, h, d, c] of [[-16, -16, 10, 60, 10, '#9ab0c8'], [0, -22, 12, 80, 10, '#c8d0d8'], [16, -16, 10, 52, 10, '#a8b8c0'], [-22, 2, 8, 40, 8, '#d8c8b0'], [20, 1, 8, 46, 8, '#b8c8d8'], [-14, 18, 10, 35, 8, '#c8b8a8'], [14, 18, 10, 42, 8, '#b0c0d0']]) tower(x, z, w, h, d, c, x + z);
  const cr = K.group(); cr.position.set(10, 0, -4); K.slab(-0.4, 0.4, 0, 36, -0.4, 0.4, K.mat('metal', '#f2b81a'), cr); K.slab(-6, 18, 36, 36.8, -0.4, 0.4, K.mat('metal', '#f2b81a'), cr); K.slab(-6, -4, 34.5, 36, -1, 1, K.mat('metal', '#5a5a5a'), cr);
  // the ship outline set into the sidewalk (ending)
  const outl = PR.canvasTex(512, 256, (g, w, h) => { g.fillStyle = '#c8c4bc'; g.fillRect(0, 0, w, h); g.strokeStyle = '#b8862a'; g.lineWidth = 10; g.beginPath(); g.moveTo(40, 60); g.lineTo(360, 50); g.quadraticCurveTo(470, 80, 490, 128); g.quadraticCurveTo(470, 176, 360, 206); g.lineTo(40, 196); g.closePath(); g.stroke(); g.fillStyle = '#8a6a2a'; g.font = 'bold 30px Georgia'; g.fillText('SHIP BURIED HERE 1851', 70, 140); });
  const ol = K.add(new THREE.PlaneGeometry(6, 3), K.toon({ map: outl, plain: true }), 0, 0.105, 7); ol.rotation.x = -Math.PI / 2; ol.receiveShadow = true;
  // ---- the map of buried ships ----
  const mt = PR.canvasTex(1200, 1600, (g, w, h) => { g.fillStyle = '#8ab8d8'; g.fillRect(0, 0, w, h); g.fillStyle = '#e8e0cc'; g.beginPath(); g.moveTo(0, 0); g.lineTo(820, 0); g.lineTo(700, 500); g.lineTo(760, 900); g.lineTo(640, 1300); g.lineTo(700, 1600); g.lineTo(0, 1600); g.fill();
    g.strokeStyle = '#c8bca4'; g.lineWidth = 8; for (let x = 40; x < 760; x += 90) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1600); g.stroke(); } for (let y = 40; y < 1600; y += 90) { g.beginPath(); g.moveTo(0, y); g.lineTo(780, y); g.stroke(); }
    g.setLineDash([12, 10]); g.strokeStyle = '#2a5a8a'; g.lineWidth = 6; g.beginPath(); g.moveTo(560, 0); g.bezierCurveTo(300, 500, 420, 1000, 520, 1600); g.stroke(); g.setLineDash([]);
    g.fillStyle = '#c0201a'; for (let i = 0; i < 46; i++) { const x = 360 + ((i * 97) % 380), y = 120 + ((i * 263) % 1380); g.save(); g.translate(x, y); g.rotate(((i * 37) % 10) / 10); g.beginPath(); g.moveTo(-26, -9); g.lineTo(16, -9); g.lineTo(30, 0); g.lineTo(16, 9); g.lineTo(-26, 9); g.fill(); g.restore(); }
    g.fillStyle = '#1a1a1a'; g.font = 'bold 52px Arial Black, Arial'; g.fillText('OLD SHORELINE', 120, 1500); g.font = 'bold 44px Georgia'; g.fillText('DOWNTOWN', 60, 120); });
  const mp = K.add(new THREE.PlaneGeometry(12, 16), K.toon({ map: mt, plain: true }), MPX, 0.05, 0); mp.rotation.x = -Math.PI / 2;
  K.slab(MPX - 8, MPX + 8, 0, 0.04, -10, 10, K.mat('wood', '#6a4a30'), K.scene, false);
  // ---- 1849 harbor ----
  K.slab(HX - 250, HX + 250, -0.7, -0.5, -300, 0, K.mat('grime', '#3a7ab8', { amt: 0.3, roughness: 0.12 }), K.scene, false);
  K.slab(HX - 250, HX + 250, -0.6, 0.05, 0, 160, K.mat('dirt', '#b89868', { detail: 1.2 }), K.scene, false);
  K.slab(HX - 250, HX + 250, -0.6, 0.0, -3, 0, K.mat('dirt', '#7a5a3a', { roughness: 0.3 }), K.scene, false);
  for (let i = 0; i < 12; i++) { const h = K.sphere(30 + r() * 25, K.mat('grime', ['#8a9a4a', '#a8a05a', '#7a8a3a'][i % 3], { amt: 0.4, detail: 3 }), HX - 220 + i * 40, -14, 110 + r() * 40); h.scale.y = 0.6; }
  for (let i = 0; i < 4; i++) { const h = K.sphere(40, K.mat('grime', '#7a8a5a', { amt: 0.4 }), HX - 200 + i * 130, -20, -260); h.scale.y = 0.5; }
  // wharf
  K.slab(HX - 2, HX + 2, 0.3, 0.45, -22, 1, K.mat('wood', '#9a7a52', { detail: 0.4 })); for (let z = -21; z < 0; z += 3) for (const x of [-1.8, 1.8]) K.cyl(0.15, 0.15, 1.2, K.mat('wood', '#5a3a24'), HX + x, -0.8, z);
  for (let i = 0; i < 8; i++) { const b = K.cyl(0.35, 0.3, 0.8, K.mat('wood', '#8a5a34', { detail: 0.3 }), HX - 1.4 + (i % 2) * 0.7, 0.45, -2 - i * 1.6); }
  // the hero ship at the wharf (bow toward -z)
  HERO = ship({ hull: '#3a2a1e' }); HERO.root.position.set(HX + 4.2, -0.6, -12); HERO.root.rotation.y = Math.PI / 2;
  K.beam(new THREE.Vector3(HX + 2.7, 1.8, -10), new THREE.Vector3(HX + 1.5, 0.48, -10), 0.25, K.mat('wood', '#a8804a'));
  D.sign(2.4, 0.5, D.txtTex(512, 110, '#3a2a1e', '#f2c230', ['ELIZA MAY'], 'bold 70px Georgia'), HX + 5.75, 0.9, -14, Math.PI / 2, K.scene, 'wood');
  // the anchored fleet ("a forest of masts")
  for (let i = 0; i < 34; i++) { const s = ship({ hull: ['#3a2a1e', '#5a3a24', '#2a3a4a', '#6a2a1a'][i % 4], sails: i % 3 !== 0, masts: 2 + (i % 2) }); s.root.position.set(HX - 70 + (i % 9) * 17 + r() * 5, -0.6, -34 - Math.floor(i / 9) * 22 - r() * 6); s.root.rotation.y = r() * 6.28; SHIPS.push(s); }
  // town: tents + shacks
  for (let i = 0; i < 22; i++) { if (i % 11 > 7) continue; const x = HX - 40 + (i % 11) * 7 + r() * 2, z = 14 + Math.floor(i / 11) * 9 + r() * 3;
    if (i % 2) { const t = K.add(new THREE.ConeGeometry(1.6, 2.4, 4), K.mat('fabric', ['#e8dcc0', '#d8c8a0'][i % 2], { detail: 0.3 }), x, 1.2, z); t.rotation.y = Math.PI / 4; }
    else { K.slab(x - 2, x + 2, 0, 3, z - 1.6, z + 1.6, K.mat('wood', ['#8a6a4a', '#a8885a', '#6a4a30'][i % 3], { detail: 0.6 })); K.slab(x - 2.2, x + 2.2, 3, 3.3, z - 1.8, z + 1.8, K.mat('wood', '#4a3020')); } }
  D.sign(3, 0.7, D.txtTex(640, 150, '#f2ece0', '#3a2a1a', ['SAN FRANCISCO'], 'bold 80px Georgia'), HX - 6, 2.4, 9.0, 0, K.scene, 'wood'); for (const sx of [-1.3, 1.3]) K.cyl(0.07, 0.07, 2.8, K.mat('wood', '#5a3a24'), HX - 6 + sx, 0, 9.0);
  // beached ships turned into buildings (hotel, store, jail)
  const BX = HX + 34;
  [['NIANTIC HOTEL', '#c8402a'], ['GENERAL STORE', '#2a6a4a'], ['TOWN JAIL', '#3a3a4a']].forEach(([name, col], i) => {
    const s = ship({ hull: '#4a3020', masts: i === 1 ? 1 : 0, sails: false, bowsprit: false }); s.root.position.set(BX + i * 16, -0.3, 6); s.root.rotation.y = 0.12 * (i - 1);
    K.slab(-4, 2, 2.5, 5.6, -1.3, 1.3, K.mat('wood', col, { detail: 0.6 }), s.root); const rf = K.slab(-4.2, 2.2, 5.6, 5.9, -1.5, 1.5, K.mat('wood', '#3a2a1e'), s.root);
    for (let w = 0; w < 4; w++) K.slab(-3.4 + w * 1.4, -2.8 + w * 1.4, 3.4, 4.6, 1.3, 1.34, i === 2 ? K.toon({ color: '#2a2a2a', plain: true }) : K.toon({ color: '#ffe0a0', plain: true, emissive: '#806030' }), s.root);
    if (i === 2) for (let b = 0; b < 16; b++) K.cyl(0.03, 0.03, 1.2, K.mat('metal', '#8a8a8a'), -3.5 + b * 0.36, 3.4, 1.37, s.root);
    D.sign(4.2, 0.8, D.txtTex(640, 120, '#f2ece0', '#3a1a1a', [name], 'bold 70px Georgia'), -1, 6.4, 1.35, 0, s.root, 'wood');
    K.beam(new THREE.Vector3(BX + i * 16 - 1, 2.1, 7.4), new THREE.Vector3(BX + i * 16 - 1, 0.05, 9.6), 0.3, K.mat('wood', '#a8804a'));
    BEACHED.push(s);
    for (let fl = 0; fl < 5; fl++) { const fm = K.add(new THREE.ConeGeometry(0.9, 3.2, 8), K.toon({ color: fl % 2 ? '#ffb020' : '#ff6a1a', plain: true, emissive: fl % 2 ? '#ff9a00' : '#ff4a00' }), BX + i * 16 - 4 + fl * 1.5, 6.9, 6 + (fl % 2 ? 0.6 : -0.6)); fm.castShadow = false; fm.visible = false; FLAMES.push(fm); }
  });
  // the landfill mound + the buildings that rise on it
  MOUND = K.slab(-30, 30, 0, 1, -4, 4, K.mat('dirt', '#9a7a4a', { detail: 0.9, bump: 0.05 })); MOUND.position.set(BX + 16, 0, 6); MOUND.scale.y = 0.01;
  for (let i = 0; i < 7; i++) { const t = tower(0, 0, 7, 14 + (i % 3) * 8, 6, ['#d8c8b0', '#c8b8a8', '#b8a898', '#e0d8c8'][i % 4], 70 + i); t.position.set(BX - 8 + i * 8.5, 0, 6 + (i % 2) * 2); t.userData.h = t.geometry.parameters.height; RISE.push(t); t.visible = false; }
  D.sign(3, 0.7, D.txtTex(512, 120, '#2a3a5a', '#f2e2b0', ['BANK'], 'bold 80px Georgia'), 0, 4, 3.05, 0, RISE[2], 'wood');
  WAGON = K.group(); WAGON.position.set(BX + 2, 0, 14); K.slab(-1.6, 1.6, 0.7, 1.4, -0.9, 0.9, K.mat('wood', '#8a5a34'), WAGON); for (const x of [-1.1, 1.1]) for (const z of [-1.0, 1.0]) K.add(new THREE.TorusGeometry(0.55, 0.07, 6, 18), K.mat('wood', '#4a2a1a'), x, 0.55, z, WAGON);
  DIRTLOAD = K.sphere(0.9, K.mat('dirt', '#8a6a44'), 0, 1.4, 0, WAGON); DIRTLOAD.scale.y = 0.5;
  HORSE = K.animal('horse', { seed: 6, color: '#6a4a2a' });
  // gold creek in the hills
  K.slab(HX - 60, HX - 40, 0.05, 0.1, 44, 47, K.mat('grime', '#4a8ac8', { amt: 0.3, roughness: 0.1 }), K.scene, false);
  for (let i = 0; i < 12; i++) K.sphere(0.4 + r() * 0.4, K.mat('rock', '#8a8a80'), HX - 60 + i * 2, 0.1, 43.2 + (i % 2) * 4.6);
  PAN = K.cyl(0.35, 0.25, 0.08, K.mat('metal', '#5a5a5a'), 0, -10, 0); NUGGET = K.sphere(0.09, K.toon({ color: '#ffd040', plain: true, roughness: 0.15, metalness: 0.6, emissive: '#a06000' }), 0, -10, 0);
  for (let i = 0; i < 6; i++) X.tree(HX - 70 + i * 8 + r() * 3, 54 + r() * 6, 1.5 + r(), K.mat('wood', '#5a3a24'), K.mat('grime', ['#4a7a3a', '#5a8a40'][i % 2], { amt: 0.5, bump: 0.05 }), K.scene, r);
  CAPHAT = K.group(); K.cyl(0.18, 0.2, 0.14, K.toon({ color: '#1a2440', plain: true }), 0, 0, 0, CAPHAT); K.cyl(0.24, 0.24, 0.02, K.toon({ color: '#1a1a1a', plain: true }), 0, 0, 0.05, CAPHAT); CAPHAT.visible = false;
  for (let i = 0; i < 4; i++) GULLS.push(K.animal('pigeon', { seed: 50 + i, color: '#f4f4f4', scale: 1.4 }));
  // ---- subway tunnel through a hull ----
  const tun = new THREE.CylinderGeometry(3, 3, 120, 24, 1, true); tun.rotateZ(Math.PI / 2); const tm = K.add(tun, K.toon({ color: '#8a8a88', kind: 'rock', side: THREE.BackSide, amt: 0.2 }), TX, 2.6, 0); tm.receiveShadow = true;
  K.slab(TX - 60, TX + 60, -0.4, 0.0, -2.6, 2.6, K.mat('rock', '#5a5a5a'), K.scene, false); for (const z of [-0.7, 0.7]) K.slab(TX - 60, TX + 60, 0, 0.12, z - 0.05, z + 0.05, K.mat('metal', '#a8a8a8'));
  for (let i = 0; i < 9; i++) { const rib = K.add(new THREE.TorusGeometry(2.85, 0.2, 6, 24, Math.PI * 1.5), K.mat('wood', '#5a3a24', { detail: 0.3 }), TX - 6 + i * 1.5, 2.4, 0); rib.rotation.y = Math.PI / 2; rib.rotation.x = Math.PI * 0.75; }
  K.slab(TX - 7, TX + 7, 5.0, 5.4, -1.5, 1.5, K.mat('wood', '#4a3020'));
  D.sign(3, 0.6, D.txtTex(512, 100, '#2a2a2a', '#f2c230', ['HULL OF THE ROME'], 'bold 54px Arial Black, Arial'), TX, 4.3, -2.7, 0, K.scene, 'plaster').rotation.y = 0;
  for (let i = 0; i < 6; i++) K.add(new THREE.BoxGeometry(0.3, 0.15, 0.3), K.toon({ color: '#fff2c0', plain: true, emissive: '#ffe6a0' }), TX - 50 + i * 20, 5.3, 0);
  K.lamp(TX, 4.2, 0, { color: '#fff0d0', intensity: 4, distance: 16, glowS: 0.2 });
  TRAIN = K.group(); for (let c = 0; c < 3; c++) { const car = K.group(TRAIN); car.position.x = -c * 9.4; K.slab(-4.5, 4.5, 0.3, 3.2, -1.25, 1.25, K.mat('metal', '#c8c8c8', { detail: 0.6 }), car); K.slab(-4.5, 4.5, 1.2, 1.5, -1.27, 1.27, K.toon({ color: '#c0392b', plain: true }), car);
    for (let w = 0; w < 6; w++) K.slab(-4 + w * 1.4, -3.1 + w * 1.4, 1.7, 2.6, 1.26, 1.29, K.toon({ color: '#fff2c0', plain: true, emissive: '#d8b860' }), car); }
  K.sphere(0.2, K.toon({ color: '#ffffff', plain: true, emissive: '#ffffff' }), 4.55, 1.3, 0.8, TRAIN); K.sphere(0.2, K.toon({ color: '#ffffff', plain: true, emissive: '#ffffff' }), 4.55, 1.3, -0.8, TRAIN);
  // cast
  WK1 = K.stick(WK1_O, { key: 'wk1' }); WK2 = K.stick(WK2_O, { key: 'wk2' }); MINER = K.stick(MINER_O, { key: 'miner' }); SAILOR = K.stick(SAILOR_O, { key: 'sailor' }); COOK = K.stick(COOK_O, { key: 'cook' });
  CAPT = K.stick(CAPT_O, { key: 'capt' }); MERCH = K.stick(MERCH_O, { key: 'merch' }); LADY = K.stick(LADY_O, { key: 'lady' }); SHER = K.stick(SHER_O, { key: 'sher' }); DRIVER = K.stick(DRIVER_O, { key: 'driver' }); PED = K.stick(PED_O, { key: 'ped' });
  for (let i = 0; i < 3; i++) RUN.push(K.stick([{ jacket: '#3a6ea5', pants: '#2a2a30', hat: 'cap', cap: '#c0392b', scarf: '#f2c230' }, { jacket: '#c8a060', pants: '#3a3a40', hairStyle: 'curly', hair: '#2a1a12', vest: '#3a5a3a', belt: '#2a1a12' }, { jacket: '#7a3a5a', pants: '#2a2a30', hat: 'beanie', hatColor: '#2a6a3a', moustache: '#5a3a24', pockets: true }][i], { key: 'run' + i }));
  K.addClouds(14, 700, 170);
  K.scene.traverse((o) => { if (o.isPointLight) PL.push(o); });
}
const hide = (...rs) => rs.forEach((x) => { x.root.visible = false; });
function frame(f) {
  const fx = []; [WK1, WK2, MINER, SAILOR, COOK, CAPT, MERCH, LADY, SHER, DRIVER, PED, ...RUN].forEach((x) => { x.root.visible = false; });
  const MAP0 = W(2, 'dozens') - 4, GOLD0 = L[3][0] - 4, SAIL0 = L[4][0] - 4, DOCK = W(4, 'docked'), RAN = W(4, 'ran') - 4, CREW0 = L[5][0] - 4, EMPTY0 = L[6][0] - 4, LAUGH0 = L[7][0] - 4, CROWD0 = L[8][0] - 4,
    HOTEL0 = L[9][0] - 4, FIRE0 = L[10][0] - 4, WHY0 = L[11][0] - 4, FILL0 = L[12][0] - 4, RISE0 = L[13][0] - 4, DIG2 = L[14][0] - 4, TUN0 = L[15][0] - 4, END0 = L[16][0] - 4;
  // ---- the dig site (lines 0-2, 14, 16) ----
  const dig = f < MAP0 || (f >= DIG2 && f < TUN0) || f >= END0;
  const scoop = (f0) => sm(f0, f0 + 14, f) - sm(f0 + 16, f0 + 30, f);
  const sc = f < L[1][0] ? scoop(10) : f < MAP0 ? scoop(W(1, 'hit') - 14) : scoop(W(14, 'hits') - 14);
  ARMG.rotation.z = -0.35 - 0.45 * sc + 0.05 * Math.sin(f * 0.1); BUCKET.rotation.z = 0.3 + 0.9 * sc;
  if (dig) {
    D.act(K, WK1, f, [[0, 'dig', { expr: 'stern' }], [W(0, 'buried') - 3, 'shock', { expr: 'shock' }], [L[1][0], 'dig', { expr: 'stern' }], [W(1, 'hit') - 2, 'shock', { expr: 'shock' }], [W(1, 'ship') + 6, 'pointDown', { expr: 'excited' }],
      [L[2][0], 'point', { expr: 'shock' }], [W(2, 'another') + 10, 'panic', { expr: 'scared' }], [DIG2, 'crouch', { expr: 'confused' }], [W(14, 'bottles') - 4, 'show', { expr: 'excited', R: [0.45, -0.55, 'cup'] }], [END0, 'lookAround', { expr: 'confused' }]], 2, { x: 1.5, y: -5, z: -0.8, yaw: 0.9 });
    D.act(K, WK2, f, [[0, 'phone', { expr: 'neutral' }], [W(0, 'buried'), 'shock', { expr: 'shock' }], [L[1][0] + 10, 'think', { expr: 'nervous' }], [W(1, 'ship'), 'ears', { expr: 'shock' }], [W(2, 'another'), 'pointL', { expr: 'shock', sweat: true }],
      [W(2, 'buried'), 'facepalm', { expr: 'nervous' }], [DIG2, 'pointDown', { expr: 'excited' }], [W(14, 'boots'), 'laugh', { expr: 'laugh' }]], 3, { x: 4.6, y: -5, z: -2.6, yaw: -1.9 });
    if (f >= END0) { D.act(K, PED, f, [[0, 'stroll', { expr: 'neutral' }], [W(16, 'look') - 6, 'pointDown', { expr: 'shock' }]], 4, { x: f < W(16, 'look') - 6 ? -6 + 0.05 * (f - END0) : -6 + 0.05 * (W(16, 'look') - 6 - END0), z: 6.0, yaw: f < W(16, 'look') - 6 ? Math.PI / 2 : 0.8 }); }
  }
  // ---- 1849: gold, the dock, the crews running ----
  if (f >= GOLD0 && f < SAIL0) { D.act(K, MINER, f, [[0, 'crouch', { expr: 'neutral' }], [W(3, 'gold') - 4, 'show', { expr: 'excited', R: [0.45, -0.55, 'fist'] }], [W(3, 'hills'), 'celebrate', { expr: 'laugh' }]], 5, { x: HX - 50, z: 42.6, yaw: 0.1 });
    PAN.visible = f < W(3, 'gold') - 4; PAN.position.set(HX - 50, 0.35, 43.4); NUGGET.visible = true; if (f < W(3, 'gold') - 4) NUGGET.position.set(HX - 50 + 0.05, 0.42, 43.4); else X.holdAt(MINER, NUGGET, 1, [0, 0, 0], [0, 0.08, 0]); }
  else { PAN.visible = false; NUGGET.visible = false; }
  // ships sail into the bay (anchored fleet drifts in during line 4)
  const sailIn = 1 - sm(SAIL0, DOCK, f); SHIPS.forEach((s, i) => { s.root.position.x += 0; s.root.position.y = -0.6 + 0.05 * Math.sin(f * 0.05 + i); s.root.rotation.z = 0.02 * Math.sin(f * 0.04 + i); });
  HERO.root.position.z = -12 - 30 * sailIn; HERO.root.position.y = -0.6 + 0.05 * Math.sin(f * 0.06);
  const runP = (q, i) => { const t = clamp((q - RAN - i * 8) / 70, 0, 1); return [HX + 2.7 - 1.2 * Math.min(1, t * 3) - 0.5 * i, t < 0.33 ? 1.8 - 1.4 * (t / 0.33) : 0.45, -10 + 18 * Math.max(0, t - 0.33) / 0.67 + i * 0.4]; };
  if (f >= RAN && f < EMPTY0) {
    [SAILOR, COOK, CAPT, ...RUN].forEach((p, i) => { if (i > 2 && f >= CREW0) return; const P = runP(f, i); const t = clamp((f - RAN - i * 8) / 70, 0, 1);
      D.act(K, p, f, [[0, 'run', { expr: i === 2 ? 'shock' : 'excited', R: i === 1 ? [0.4, -0.7, 'cup'] : undefined }]], 6 + i, { x: P[0], y: P[1], z: P[2], yaw: t < 0.33 ? -Math.PI / 2 : 0 });
      if (f % 8 === 0 && t > 0.35) K.puff(f, f, P[0], P[2], 2, 0.2, '#c8a878'); });
    if (f >= W(5, 'captains') - 2) { const t = clamp((f - W(5, 'captains') + 2) / 24, 0, 1); const P = runP(f, 2); CAPHAT.visible = true; CAPHAT.position.set(P[0], P[1] + 2.1 + 1.2 * t - 1.6 * t * t, P[2] - 1.2 * t); CAPHAT.rotation.set(f * 0.3, 0, f * 0.2); } else CAPHAT.visible = false;
  } else CAPHAT.visible = false;
  // gulls on the empty ships
  GULLS.forEach((g, i) => { const on = f >= EMPTY0 && f < CROWD0; g.root.visible = on; if (!on) return; g.set(f, { x: HX + 3.6 + i * 0.5, y: 2.3, z: -14 + i * 1.2, yaw: i, mode: i % 2 ? 'eat' : 'stand', expr: 'neutral', flap: (f + i * 20) % 60 < 10 }); g.root.position.y = 2.3; });
  // the merchant laughs (line 7), then is scared of the fire (line 10)
  if (f >= LAUGH0 && f < CROWD0) D.act(K, MERCH, f, [[0, 'laugh', { expr: 'laugh' }], [W(7, 'busiest'), 'pointL', { expr: 'laugh' }], [W(7, 'leave') - 4, 'clap', { expr: 'laugh' }]], 9, { x: HX - 0.4, y: 0.45, z: -4.0, yaw: Math.PI - 0.3 });
  // crowded town + moving into ships (lines 8-9)
  if (f >= CROWD0 && f < FIRE0) {
    D.act(K, LADY, f, [[0, 'carry', { expr: 'nervous', item: 'box' }], [HOTEL0, 'wave', { expr: 'grin' }]], 10, f < HOTEL0 ? { x: HX + 33 + 0.0, y: Math.min(2.1, 0.05 + 0.03 * Math.max(0, f - CROWD0 - 20)), z: 9.6 - Math.min(2.2, 0.03 * Math.max(0, f - CROWD0 - 20)), yaw: Math.PI } : { x: HX + 33, y: 2.5, z: 6.5, yaw: 0 });
    D.act(K, MERCH, f, [[0, 'push', { expr: 'angry' }], [W(8, 'move'), 'carry', { expr: 'grin', item: 'box' }], [HOTEL0, 'hold', { expr: 'grin', R: [0.3, 0.4, 'moneybag'] }]], 9, f < HOTEL0 ? { x: HX + 31.6, z: 10.8, yaw: Math.PI - 0.2 } : { x: HX + 49, y: 2.5, z: 6.5, yaw: 0.2 });
    RUN.forEach((p, i) => D.act(K, p, f, [[0, i % 2 ? 'carry' : 'push', { expr: i ? 'nervous' : 'angry', item: 'box' }], [CROWD0 + 30 + i * 6, 'walk', { expr: 'neutral' }]], 30 + i, { x: HX + 29 + i * 1.3, z: 11.6 + (i % 2) * 0.8, yaw: Math.PI + 0.3 * (i - 1) }));
    if (f >= W(9, 'jail') - 6) D.act(K, SHER, f, [[0, 'hips', { expr: 'stern' }], [W(9, 'jail') + 8, 'point', { expr: 'stern' }]], 11, { x: HX + 66, y: 2.5, z: 6.8, yaw: 0.2 });
  }
  // fire (line 10-11)
  const burn = f >= FIRE0 && f < FILL0; FLAMES.forEach((m, i) => { m.visible = burn && f < WHY0 + 6; if (!m.visible) return; const k = 1 + 0.25 * Math.sin(f * 0.7 + i * 1.7); m.scale.set(k, 1 + 0.4 * Math.sin(f * 0.5 + i), k); });
  if (burn) for (let i = 0; i < 3; i++) K.puff(f, f - (f % 10) - i * 3, HX + 34 + i * 16 - 1, 6, 6, 0.9, f < WHY0 ? '#4a4a4a' : '#6a6a6a');
  if (f >= FIRE0 && f < WHY0) D.act(K, MERCH, f, [[0, 'shock', { expr: 'shock' }], [W(10, 'burn'), 'panic', { expr: 'scared' }], [W(10, 'waterline'), 'ears', { expr: 'scared' }]], 9, { x: HX + 40, z: 14, yaw: Math.PI });
  BEACHED.forEach((s) => { s.root.visible = f < RISE0 + 20 || dig === false && f < RISE0; });
  // landfill (line 12) + buildings rise (line 13)
  MOUND.scale.y = 0.01 + 8.0 * sm(FILL0 + 10, W(12, 'top') + 6, f); MOUND.visible = f >= FILL0 && f < DIG2;
  if (f >= FILL0 && f < RISE0) { const t = clamp((f - FILL0) / 60, 0, 1); WAGON.position.set(HX + 30 + 6 * t, 0, 14); DIRTLOAD.visible = f < W(12, 'dumped') + 6; WAGON.rotation.z = f >= W(12, 'dumped') - 4 && f < W(12, 'dumped') + 20 ? 0.35 : 0;
    HORSE.set(f, { x: WAGON.position.x + 3.2, z: 14, yaw: Math.PI / 2, mode: t < 1 ? 'walk' : 'stand', expr: 'neutral' });
    D.act(K, DRIVER, f, [[0, 'push', { expr: 'stern' }], [W(12, 'dumped') - 4, 'throw', { expr: 'grin' }], [W(12, 'top'), 'cheer', { expr: 'laugh' }]], 12, { x: WAGON.position.x - 0.4, y: 0.0, z: 15.6, yaw: Math.PI / 2 });
    if (f % 4 === 0) K.puff(f, f, HX + 50 + ((f * 7) % 30) - 15, 6 + ((f * 3) % 6) - 3, 5, 0.7, '#a88a5a'); }
  else { WAGON.position.y = -50; HORSE.root.visible = false; }
  RISE.forEach((t, i) => { const u = sm(RISE0 + i * 6, RISE0 + i * 6 + 40, f); t.visible = f >= RISE0 && f < DIG2 && u > 0.01; t.scale.y = Math.max(0.01, u); t.position.y = t.userData.h * u / 2 + 7; });
  // subway train through the hull (line 15)
  TRAIN.position.set(TX - 40 + 0.55 * (f - TUN0), 0, 0); TRAIN.visible = f >= TUN0 && f < END0;
  // ---------- shots ----------
  const S = [
    [0, (u) => ({ pos: [lerp(6.2, 5.6, u), -1.8, 1.7], look: [1.0, -4.0, -2.0], fov: 50, cinf: 6, light: PIT })],
    [W(0, 'skyscrapers') - 4, (u) => ({ pos: [0.5, -4.4, 1.0], look: [0.0, lerp(-1, 14, u), -12], fov: 50, cinf: 4, light: PIT, noPush: true })],
    [L[1][0] - 4, (u) => ({ pos: [3.5, -3.5, 1.4], look: [1.4, -3.9, -0.9], fov: 38, cinf: 12, light: PIT }), { whip: true }],
    [W(1, 'hit') - 4, (u) => { const [a, b] = K.shake(f, W(1, 'hit'), 0.06, 12); return { pos: [4.8 + a, -3.8 + b, -0.6], look: [1.5, -4.0, -4.3], fov: 40 * K.punch(f, W(1, 'bow'), 0.15, 6), cinf: 12, light: PIT, noPush: true }; }],
    [L[2][0] - 4, (u) => ({ pos: [1.2, -3.4, -2.4], look: [4.4, -4.2, -6.4], fov: 42, cinf: 10, light: PIT }), { whip: true }],
    [MAP0, (u) => ({ pos: [MPX + 1.5, lerp(13, 10, u), 6], look: [MPX + 0.8, 0, 0], fov: 50, cinf: 3, noPush: true }), { whip: true }],
    [GOLD0, (u) => ({ pos: [HX - 48.4, 1.4, 46.2], look: [HX - 50, 0.9, 42.8], fov: 42, cinf: 10 }), { whip: true }],
    [W(3, 'gold') - 4, (u) => ({ pos: [HX - 49.4, 1.55, 44.0], look: [HX - 49.75, 1.45, 43.0], fov: 38 * K.punch(f, W(3, 'gold'), 0.2, 6), cinf: 18, noPush: true })],
    [SAIL0, (u) => ({ pos: [HX + 18 - 4 * u, 6, 14], look: [HX, 3, -30], fov: 50, cinf: 4 }), { whip: true }],
    [DOCK - 4, (u) => ({ pos: [HX - 4.5, 2.4, 4.5], look: [HX + 3, 2.8, -12], fov: 44, cinf: 6 })],
    [RAN, (u) => { const P = runP(f, 0); return { pos: [P[0] - 3.8, 1.6, P[2] + 4.5], look: [P[0], 1.1, P[2] - 1], fov: 44, cinf: 8 }; }],
    [CREW0, (u) => { const P = runP(f, 0); return { pos: [P[0] - 1.4, 1.55, P[2] + 3.4], look: [P[0], 1.4, P[2]], fov: 38, cinf: 14 }; }, { whip: true }],
    [W(5, 'cooks') - 4, (u) => { const P = runP(f, 1); return { pos: [P[0] - 1.3, 1.55, P[2] + 3.2], look: [P[0], 1.4, P[2]], fov: 38, cinf: 14 }; }, { whip: true }],
    [W(5, 'captains') - 4, (u) => { const P = runP(f, 2); return { pos: [P[0] - 1.6, 1.8, P[2] + 3.6], look: [P[0], 1.8, P[2]], fov: 40 * K.punch(f, W(5, 'captains'), 0.12, 6), cinf: 12, noPush: true }; }, { whip: true }],
    [EMPTY0, (u) => ({ pos: [HX - 6, lerp(3, 12, u), 6], look: [HX + 4, lerp(4, 9, u), -50], fov: 50, cinf: 3 }), { whip: true }],
    [W(6, 'nobody') - 4, (u) => ({ pos: [HX + 7.4, 3.4, -10.8], look: [HX + 4.2, 2.6, -13.2], fov: 42, cinf: 10 })],
    [LAUGH0, (u) => ({ pos: [HX - 1.6, 2.1, -6.4], look: [HX - 0.4, 2.0, -4.0], fov: 38, cinf: 14 }), { whip: true }],
    [W(7, 'leave') - 4, (u) => ({ pos: [HX + 1.0, 3.0, -16], look: [HX + 3.0, 1.0, -22], fov: 44, cinf: 8 })],
    [CROWD0, (u) => ({ pos: [HX + 26, 2.4, 19], look: [HX + 31, 1.4, 10], fov: 44, cinf: 8 }), { whip: true }],
    [W(8, 'move') - 4, (u) => ({ pos: [HX + 36.4, 2.0, 13.4], look: [HX + 33, 1.8, 8.5], fov: 40, cinf: 10 })],
    [HOTEL0, (u) => ({ pos: [HX + 31 + 2 * u, 4.0, 17], look: [HX + 33, 4.4, 6], fov: 44, cinf: 6 }), { whip: true }],
    [W(9, 'store') - 4, (u) => ({ pos: [HX + 49 + 1.5 * u, 3.8, 16], look: [HX + 49.5, 4.0, 6], fov: 44, cinf: 6 }), { whip: true }],
    [W(9, 'jail') - 4, (u) => ({ pos: [HX + 66.5, 4.0, 11.5], look: [HX + 66, 3.9, 6.8], fov: 40 * K.punch(f, W(9, 'jail'), 0.15, 6), cinf: 12, noPush: true }), { whip: true }],
    [FIRE0, (u) => ({ pos: [HX + 50 - 3 * u, 5, 30], look: [HX + 50, 4, 6], fov: 48, cinf: 4, light: DUSK }), { whip: true }],
    [W(10, 'burn') - 4, (u) => { const [a, b] = K.shake(f, W(10, 'burn'), 0.04, 14); return { pos: [HX + 36 + a, 3.0 + b, 15], look: [HX + 34, 4.0, 6], fov: 42, cinf: 8, light: DUSK }; }],
    [W(10, 'waterline') - 6, (u) => ({ pos: [HX + 40.3, 1.95, 16.6], look: [HX + 40, 1.8, 14], fov: 38, cinf: 14, light: DUSK })],
    [WHY0, (u) => ({ pos: [HX + 50, 3, 22 - 5 * u], look: [HX + 50, 2.5, 6], fov: 44 * K.push(u, 0.14), cinf: 6, light: DUSK, noPush: true }), { whip: true }],
    [FILL0, (u) => ({ pos: [HX + 27, 2.2, 21], look: [HX + 34, 1.4, 14], fov: 44, cinf: 8 }), { whip: true }],
    [W(12, 'bay') - 4, (u) => ({ pos: [HX + 46 + 8 * u, 9, 34], look: [HX + 50, 2, 6], fov: 48, cinf: 4 })],
    [W(12, 'top') - 4, (u) => ({ pos: [HX + 52, 11, 22], look: [HX + 50, 6, 6], fov: 44 * K.punch(f, W(12, 'ships'), 0.12, 6), cinf: 6, noPush: true })],
    [RISE0, (u) => ({ pos: [HX + 50, 3, 50], look: [HX + 50, lerp(8, 18, u), 6], fov: 52, cinf: 3 }), { whip: true }],
    [W(13, 'forgets') - 4, (u) => ({ pos: [-4 + 2 * u, 1.7, 10.5], look: [-2, 1.4, 6], fov: 44, cinf: 8 }), { whip: true }],
    [DIG2, (u) => { const [a, b] = K.shake(f, W(14, 'hits'), 0.06, 12); return { pos: [6.0 + a, -1.8 + b, 1.6], look: [1.0, -4.1, -2.2], fov: 50, cinf: 8, light: PIT }; }, { whip: true }],
    [W(14, 'bottles') - 4, (u) => ({ pos: [4.3, -4.2, -0.5], look: [3.5, -4.85, -1.9], fov: 40 * K.push(u, 0.14), cinf: 18, light: PIT, noPush: true })],
    [TUN0, (u) => ({ pos: [TX + 5, 1.8, 1.9], look: [TX - 3, 1.8, 0], fov: 48, cinf: 6, light: TUN }), { whip: true }],
    [W(15, 'hull') - 4, (u) => ({ pos: [TX + 3, 2.7, -1.9], look: [TX - 2, 3.6, 0.5], fov: 50 * K.punch(f, W(15, 'hull'), 0.12, 6), cinf: 6, light: TUN, noPush: true })],
    [END0, (u) => ({ pos: [-4.6, 2.6, 12.5], look: [-1, lerp(16, 0.3, sm(0, 0.6, u)), lerp(-10, 7, sm(0, 0.6, u))], fov: 50, cinf: 5, noPush: true }), { whip: true }],
    [W(16, 'look') - 4, (u) => ({ pos: [lerp(1.0, 2.6, u), 2.6, 11.5], look: [-0.5, 0.3, 7], fov: 46, cinf: 6 })],
  ];
  const R = D.runShots(S, f, TOTAL), cam = R.cam;
  PL.forEach((l) => { l.visible = R.light === TUN; });
  if (R.id === 5) D.card(fx, f, W(2, 'dozens'), 'DOZENS', cam, '#f6c83a', 170, 50, 0.62);
  if (R.id === 6) D.card(fx, f, W(3, '1849'), '1849', cam, '#ffffff', 170, 40, 0.62);
  if (R.id === 14) D.card(fx, f, W(6, 'hundreds'), '500+ SHIPS', cam, '#ffffff', 150, 50, 0.62);
  return { light: R.light || DAY, cam, dof: R.dof, actors: [], fx };
}
export default { TOTAL, look: 'rich', build, frame };
