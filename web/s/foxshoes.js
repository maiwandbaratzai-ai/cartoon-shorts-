// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The village that lost 117 shoes" (story, inspired by the shoe-stealing foxes of Föhren 2009 and Berlin 2020).
// Sets: a little village street (morning + night) at x≈0, and the woods with the fox's shoe mountain at x≈100.
import { TOTAL, LINES, wf } from './foxshoes_timing.js';
import * as PR from '../props.js';
import * as X from './kit3d.js';
import { blinkAt } from '../motion.js';
const { M, clamp, lerp, q } = X;

export { TOTAL };
const L = LINES, cut = (i) => Math.max(0, L[i][0] - 4), W = wf;
let K, FOX, SLIP, MSLIP, LONE, TORCH, BEAM, LADY, BAKER, MAIL, OTTO;

const LADY_O = { jacket: '#3a7ab8', dress: '#3a7ab8', pants: '#2a4a6a', boots: '#5a3a2a', hairStyle: 'bun', hair: '#b8b8b8', apron: '#f6efe2', glasses: true, skin: '#f6dcc4' };
const BAKER_O = { jacket: '#f6f2ea', pants: '#3a3a44', boots: '#2a2018', hat: 'chef', apron: '#f2e2c0', bowtie: '#c0392b', moustache: '#5a3a24', build: 'stout', collar: false, skin: '#f2c8a0' };
const MAIL_O = { jacket: '#2a5aa8', pants: '#2a3a5a', boots: '#1e1a18', hat: 'cap', cap: '#2a5aa8', badge: true, belt: '#5a3a1a', scarf: '#e8c84a', pockets: true, skin: '#c88a5a' };
const OTTO_O = { jacket: '#8a4ab0', pants: '#8a4ab0', boots: '#d84a5a', hat: 'beanie', hatColor: '#d83a3a', glasses: true, scarf: '#f2d24a', collar: '#f6f2ea', hairStyle: 'short', hair: '#6a6a6a', skin: '#f2d2b0' };

const DAY = { az: 210, el: 30, sky: '#ffe8c8', ground: '#8a7a6a', hemi: 1.0, sun: '#fff0d0', sunI: 3.1, skyTop: '#4a86d8', skyHor: '#ffe2c0', fog: '#f2e6d8', fogNear: 40, fogFar: 260,
  sat: 1.12, vig: 0.24, shadowExt: 16, exposure: 1.1, ink: 0.55 };
const NIGHT = { az: 160, el: 40, sky: '#4a5a8a', ground: '#2a2a3a', hemi: 0.55, sun: '#a8bcff', sunI: 1.1, skyTop: '#0c1636', skyHor: '#2e3e70', fog: '#1a2240', fogNear: 18, fogFar: 90,
  sat: 1.1, vig: 0.32, shadowExt: 14, exposure: 1.32, bloom: 0.8, ink: 0.55, cardTint: '#e8ecff' };
const DAWN = { az: 230, el: 16, sky: '#ffd0b0', ground: '#6a5a4a', hemi: 0.95, sun: '#ffc890', sunI: 3.0, skyTop: '#5a6ab8', skyHor: '#ffb890', fog: '#e8c0a8', fogNear: 20, fogFar: 160,
  sat: 1.14, vig: 0.26, shadowExt: 14, exposure: 1.12, bloom: 0.7, ink: 0.55 };

const WX = 100, PILE = [WX, -6]; // woods origin and the shoe mountain
const SHOE_COLS = ['#c0392b', '#2a6ab8', '#e8b84a', '#3a8a4a', '#f2f2ea', '#8a4ab0', '#1e1e24', '#e86a2a', '#5a3a24', '#e84a8a', '#4ac0c8', '#a8a8b0'];
function shoe(col, parent, s = 1) {
  const { THREE } = K; const g = K.group(parent); g.scale.setScalar(s);
  K.slab(-0.055, 0.055, 0, 0.025, -0.13, 0.14, K.mat('grime', '#2a2420', { plain: true }), g);
  const up = K.add(new THREE.SphereGeometry(0.1, 14, 10), K.mat('fabric', col, { amt: 0.2 }), 0.008, 0.06, 0.02, g); up.scale.set(0.58, 0.5, 1.35); up.rotation.y = 0.12; // left-shoe curve
  K.add(new THREE.SphereGeometry(0.035, 10, 8), K.mat('fabric', '#f6f2ea', { plain: true }), 0, 0.105, 0.0, g).scale.set(1, 0.4, 1.6); // laces
  return g;
}

function build(k) {
  K = k; X.init(K); const { THREE } = K; const r = X.rnd(117);
  // ---- village street (z from -40 to 20), cobbles, houses both sides
  const cob = K.mat('rock', '#a09484', { detail: 0.35, amt: 0.35 }), walk = K.mat('rock', '#b8ac98', { detail: 0.6 }), wood = K.mat('wood', '#7a5434'), roof = K.mat('rock', '#a8483a', { detail: 0.4 });
  K.slab(-30, 30, -0.2, 0, -60, 40, cob, K.scene, false);
  for (const sx of [-1, 1]) K.slab(sx > 0 ? 3.4 : -5.5, sx > 0 ? 5.5 : -3.4, 0, 0.12, -60, 40, walk, K.scene, false);
  const COLS = ['#f2e2b8', '#e8c8a8', '#d8e2c8', '#f2d0c0', '#e0d8f0', '#f6e6c8'];
  const SL = (a, b, ...rest) => K.slab(Math.min(a, b), Math.max(a, b), ...rest);
  const house = (x, z, side, i, label) => { const g = K.group(); g.position.set(x, 0, z);
    const w = 7, d = 6, h = 5.2, fx = side > 0 ? -d / 2 : d / 2;
    K.slab(-d / 2, d / 2, 0, h, -w / 2, w / 2, K.toon({ map: PR.facadeTex(COLS[i % 6], 3, 2, i + 7, '#5a3a24'), kind: 'plaster', amt: 0.2 }), g);
    const rf = K.add(new THREE.CylinderGeometry(0.01, 5.2, 2.6, 4, 1).rotateY(Math.PI / 4), roof, 0, h + 1.3, 0, g); rf.scale.set(0.82, 1, 1.0);
    SL(fx - 0.06 * side, fx + 0.02 * side, 0, 2.1, -0.6, 0.6, K.mat('wood', ['#5a7a3a', '#8a3a2a', '#2a5a8a', '#6a4a8a'][i % 4]), g); // door
    SL(fx - (side > 0 ? 0.9 : -0.9), fx, 0.12, 0.2, -0.8, 0.8, walk, g); // doorstep
    for (const dz of [-2.2, 2.2]) { SL(fx - 0.05 * side, fx + 0.03 * side, 2.6, 2.7, dz - 0.6, dz + 0.6, wood, g);
      const fl = SL(fx - 0.3 * side, fx, 2.7, 2.9, dz - 0.55, dz + 0.55, K.mat('wood', '#8a5a34'), g);
      for (let j = 0; j < 4; j++) K.add(new THREE.SphereGeometry(0.11, 8, 6), K.mat('fabric', ['#e84a5a', '#f2c84a', '#e86ab8', '#ffffff'][j], { plain: true }), fx - 0.15 * side, 3.0, dz - 0.4 + j * 0.27, g); }
    if (label) X.sign(2.2, 0.6, X.txtTex(768, 192, '#3a2a1a', '#f6e8c8', [label], 'bold 100px Georgia, serif'), fx - 0.04 * side, 3.6, 0, side > 0 ? -Math.PI / 2 : Math.PI / 2, g);
    return g; };
  // left side (doors face +x), right side (doors face -x)
  [[-9, 0, 'OTTO'], [-9, -8, 'BAKERY'], [-9, -16, null], [-9, -24, null], [-9, 8, null], [-9, -32, null], [-9, -40, null], [-9, -48, null]].forEach(([x, z, lb], i) => house(x, z, -1, i, lb === 'OTTO' ? null : lb));
  [[9, 0, null], [9, -8, null], [9, -16, 'POST'], [9, -24, null], [9, 8, null], [9, -32, null], [9, -40, null], [9, -48, null]].forEach(([x, z, lb], i) => house(x, z, 1, i + 2, lb));
  K.slab(-3, 3, 0, 9, -62, -56, K.mat('rock', '#c8bca8', { detail: 0.8 })); { const sp = K.add(new THREE.ConeGeometry(2.4, 6, 4).rotateY(Math.PI / 4), roof, 0, 12, -59); }
  X.sign(1.6, 1.6, X.txtTex(256, 256, '#f6f2e8', '#2a2a30', ['XII'], 'bold 80px Georgia, serif'), 0, 7.2, -55.96);
  // Otto's porch (x -6 .. -4.2) with a chair and a mat
  K.slab(-6.0, -4.0, 0, 0.25, -1.6, 1.6, K.mat('wood', '#9a7048', { detail: 0.4 }), K.scene);
  K.cyl(0.06, 0.06, 2.6, wood, -4.1, 0.25, -1.5);
  K.slab(-4.2, -3.9, 2.8, 2.95, -1.7, 1.7, wood);
  const chair = K.group(); chair.position.set(-5.4, 0.25, 0.6); K.slab(-0.25, 0.25, 0.42, 0.48, -0.25, 0.25, K.mat('wood', '#b8844a'), chair); K.slab(-0.27, -0.2, 0.42, 1.0, -0.25, 0.25, K.mat('wood', '#b8844a'), chair);
  for (const [a, b] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) K.slab(a - 0.025, a + 0.025, 0, 0.42, b - 0.025, b + 0.025, K.mat('wood', '#6a4428'), chair);
  K.slab(-5.0, -4.3, 0.25, 0.27, -0.4, 0.3, K.mat('fabric', '#a83a3a', { detail: 0.1 }));
  // street lamps + bunting
  for (const [x, z] of [[-3.8, -4], [3.8, -12], [-3.8, -20], [3.8, 6]]) { K.cyl(0.06, 0.08, 3.4, K.mat('metal', '#2a2a30'), x, 0, z); K.add(new THREE.SphereGeometry(0.2, 12, 10), K.toon({ color: '#fff0c0', plain: true }), x, 3.5, z); }
  if (0) for (let i = 0; i < 26; i++) { const z = -30 + i * 1.6; const fl = K.add(new THREE.ConeGeometry(0.18, 0.35, 3), K.mat('fabric', ['#e84a5a', '#f2c84a', '#3a8ad8', '#4ac06a'][i % 4], { plain: true }), 0, 4.6 - 0.25 * Math.sin(i / 25 * Math.PI * 6), z); fl.rotation.x = Math.PI; }
  // the lone shoe on a doorstep (morning) + Otto's slippers
  LONE = shoe('#c0392b', K.scene, 1.3); LONE.position.set(5.55, 0.2, -8.3); LONE.rotation.y = -1.2;
  const slip = (parent) => { const g = K.group(parent); K.slab(-0.06, 0.06, 0, 0.03, -0.13, 0.13, K.mat('fabric', '#2a1e3a', { plain: true }), g);
    const u = K.add(new THREE.SphereGeometry(0.1, 14, 10), K.mat('fabric', '#e84a8a', { amt: 0.3, bump: 0.004 }), 0, 0.04, 0.03, g); u.scale.set(0.62, 0.42, 1.2);
    K.add(new THREE.SphereGeometry(0.05, 10, 8), K.mat('fabric', '#ffffff', { amt: 0.4 }), 0, 0.09, 0.08, g); return g; };
  SLIP = slip(K.scene); SLIP.position.set(-4.6, 0.25, 0.1); SLIP.rotation.y = 1.4; SLIP.scale.setScalar(1.3);
  // ---- the woods at x = WX: dirt clearing, trees, mushrooms, the shoe mountain
  K.slab(WX - 40, WX + 40, -0.1, 0.01, -40, 40, K.mat('dirt', '#6a5a3a', { detail: 1.0, amt: 0.4 }), K.scene, false);
  const bark = K.mat('wood', '#5a4232'), leafs = [K.mat('grime', '#3e7a3a', { amt: 0.6 }), K.mat('grime', '#5a8a3a', { amt: 0.6 }), K.mat('grime', '#2e6a4a', { amt: 0.6 })];
  for (let i = 0; i < 60; i++) { const a = r() * 6.28, d = 5 + r() * 26; const x = WX + Math.cos(a) * d, z = -6 + Math.sin(a) * d; if (x > WX - 2.5 && x < WX + 2.5 && z > -4) continue; const t = X.tree(x, z, 1.8 + r() * 1.6, bark, leafs[i % 3], K.scene, r); }
  for (let i = 0; i < 30; i++) { const x = WX + (r() - 0.5) * 14, z = -6 + (r() - 0.5) * 14; if (Math.hypot(x - WX, z + 6) < 2.4) continue; K.cyl(0.03, 0.04, 0.12, K.mat('grime', '#f2ead6', { plain: true }), x, 0, z);
    K.add(new THREE.SphereGeometry(0.08, 10, 6, 0, 6.3, 0, 1.6), K.mat('grime', i % 2 ? '#d83a2a' : '#c8843a', { plain: true }), x, 0.12, z); }
  for (let i = 0; i < 40; i++) { const x = WX + (r() - 0.5) * 20, z = -6 + (r() - 0.5) * 20; if (Math.hypot(x - WX, z + 6) < 2.6) continue; K.add(new THREE.DodecahedronGeometry(0.3 + r() * 0.3, 0), K.mat('grime', '#4a7a3a', { amt: 0.5 }), x, 0.15, z); }
  const mound = K.group(); mound.position.set(PILE[0], 0, PILE[1]);
  for (let i = 0; i < 130; i++) { const u = Math.pow(r(), 0.7), a = r() * 6.28, rad = 1.7 * u; const y = Math.max(0, 1.05 * (1 - u) + (r() - 0.5) * 0.12);
    const s = shoe(SHOE_COLS[i % SHOE_COLS.length], mound, 1.5); s.position.set(Math.cos(a) * rad, y, Math.sin(a) * rad); s.rotation.set((r() - 0.5) * 0.6, 0.9 + (r() - 0.5) * 0.5, (r() - 0.5) * 0.5); }
  K.solid(mound, 0.1);
  K.shaft([WX + 4, 9, -12], [WX + 0.5, 0, -6], 1.2, 2.4, '#ffe0b0', 0.1);
  K.dust([WX, 1.5, -6], [6, 2, 6], 90);
  K.addClouds(8, 700, 160);
  // lamps: porch, street, woods
  K.lamp(-4.4, 2.6, 0.9, { color: '#ffc870', intensity: 3.0, distance: 9, glowS: 0.5 });
  K.lamp(3.8, 3.5, -12, { color: '#ffc870', intensity: 2.0, distance: 10, glowS: 0.6 });
  K.lamp(WX + 1.6, 2.4, -3.6, { color: '#ffd8a0', intensity: 2.4, distance: 9, glowS: 0.0 });
  // flashlight prop with a beam
  TORCH = K.group(); K.cyl(0.03, 0.035, 0.22, K.mat('metal', '#3a3a44'), 0, -0.11, 0, TORCH).rotation.x = 0;
  K.add(new THREE.CylinderGeometry(0.045, 0.035, 0.05, 14), K.toon({ color: '#fff8d0', plain: true, emissive: '#fff4c0' }), 0, 0.12, 0, TORCH);
  BEAM = new THREE.Mesh(new THREE.ConeGeometry(0.6, 3.0, 20, 1, true), new THREE.MeshBasicMaterial({ color: '#fff2c0', transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }));
  BEAM.position.y = 1.62; BEAM.rotation.x = Math.PI; TORCH.add(BEAM);
  // cast
  FOX = K.animal('fox', { seed: 4, scale: 1.25 });
  MSLIP = slip(FOX.head); MSLIP.position.set(0.0, -0.08, 0.2); MSLIP.rotation.set(0, Math.PI / 2, 0); MSLIP.scale.setScalar(1.1); MSLIP.visible = false;
  LADY = K.stick(LADY_O, { key: 'lady' }); BAKER = K.stick(BAKER_O, { key: 'baker' }); MAIL = K.stick(MAIL_O, { key: 'mail' }); OTTO = K.stick(OTTO_O, { key: 'otto' });
}

const F = { village: W(0, 'village'), n117: W(0, '117'), summer: W(0, 'summer'), morning: W(1, 'morning'), doorstep: W(1, 'doorstep'), missing: W(1, 'missing'), never: W(1, 'never'),
  baker: W(2, 'baker'), blamed: W(2, 'blamed'), mailman: W(2, 'mailman'), mail2: W(2, 'and') + 4, until: W(3, 'until'), night: W(3, 'night'), flash: W(3, 'flashlight'),
  am: W(4, '3'), something: W(4, 'something'), tiptoed: W(4, 'tiptoed'), porch: W(4, 'porch'), grabbed: W(5, 'grabbed'), slipper: W(5, 'slipper'), ran: W(5, 'ran'),
  chased: W(6, 'chased'), woods: W(6, 'woods'), what: W(6, 'what'), find: W(6, 'find'), fox: W(7, 'fox'), asleep: W(7, 'asleep'), mountain: W(7, 'mountain'),
  every: W(8, 'every'), left: W(8, 'left'), thats: W(9, 'that'), lost: W(9, 'lost'), n117b: W(9, '117') };

const ladyKeys = [[0, 'stroll', { expr: 'smile' }], [F.doorstep - 4, 'lookAround', { expr: 'confused' }], [F.missing - 3, 'shock', { expr: 'shock' }], [F.never, 'hold', { R: [0.32, 0.3, 'fist'], expr: 'angry' }], [F.never + 14, 'facepalm', { expr: 'sad' }]];
const bakerKeys = [[0, 'hips', { expr: 'stern' }], [F.blamed - 4, 'point', { expr: 'angry', talk: true }], [F.mail2, 'shock', { expr: 'shock' }], [F.mail2 + 10, 'cross', { expr: 'angry' }], [W(2, 'baker', 1) ?? 0, 'angry']];
const mailKeys = [[0, 'cross', { expr: 'stern' }], [F.blamed - 2, 'shock', { expr: 'shock' }], [F.mail2 - 2, 'point', { expr: 'yell', talk: true }], [F.mail2 + 18, 'hips', { expr: 'angry' }]];
const ottoKeys = [[0, 'sit', { expr: 'stern' }], [F.night - 4, 'sit', { expr: 'sleepy' }], [F.flash - 4, 'hold', { mode: 'sit', expr: 'stern' }], [cut(4), 'hold', { mode: 'sit', expr: 'sleepy' }],
  [F.something, 'hold', { mode: 'sit', expr: 'sleepy' }], [F.porch + 4, 'hold', { mode: 'sit', expr: 'confused' }], [F.grabbed - 2, 'shock', { expr: 'shock' }], [F.ran - 2, 'run', { expr: 'angry' }],
  [cut(6), 'run', { expr: 'angry' }], [F.what - 4, 'hold', { expr: 'confused' }], [F.find - 2, 'lookAround', { expr: 'confused' }], [cut(7), 'shock', { expr: 'shock' }], [F.mountain, 'scared', { expr: 'shock' }],
  [cut(8), 'think', { expr: 'confused' }], [F.left - 2, 'facepalm', { expr: 'confused' }], [cut(9), 'shrug', { expr: 'smile' }]];

const S = X.shotList([
  { id: 'hook', f: 0, keys: [{ pos: [WX + 1.7, 1.3, -1.6], look: [WX, 1.05, -6], fov: 40 }, { pos: [WX + 1.5, 1.25, -2.0], look: [WX, 1.05, -6], fov: 36 }] },
  { id: 'street', f: F.summer - 6, keys: [{ pos: [0.8, 2.2, 10], look: [0, 1.6, -14], fov: 50 }, { pos: [0.6, 2.0, 8.5], look: [0, 1.6, -14], fov: 46 }] },
  { id: 'door', f: cut(1), keys: [{ pos: [5.5, 1.5, -4.4], look: [4.2, 1.2, -8.4], fov: 42 }, { pos: [5.5, 1.45, -4.8], look: [4.2, 1.2, -8.4], fov: 38 }] },
  { id: 'lone', f: F.missing - 6, whip: false, keys: [{ pos: [4.1, 0.6, -7.6], look: [5.5, 0.25, -8.3], fov: 40 }, { pos: [4.2, 0.55, -7.75], look: [5.5, 0.25, -8.3], fov: 36 }] },
  { id: 'never', f: F.never - 2, whip: false, keys: [{ pos: [2.4, 1.55, -10.4], look: [4.3, 1.35, -8.4], fov: 38 }, { pos: [2.5, 1.55, -10.2], look: [4.3, 1.35, -8.4], fov: 35 }] },
  { id: 'blame', f: cut(2), keys: [{ pos: [-2.8, 1.6, -13.4], look: [-0.2, 1.3, -18], fov: 46 }, { pos: [-2.6, 1.55, -13.8], look: [-0.2, 1.3, -18], fov: 42 }] },
  { id: 'blame2', f: F.mail2 - 4, whip: false, keys: [{ pos: [2.8, 1.6, -13.6], look: [0.2, 1.3, -18], fov: 44 }, { pos: [2.6, 1.55, -13.9], look: [0.2, 1.3, -18], fov: 40 }] },
  { id: 'otto', f: cut(3), keys: [{ pos: [-2.0, 1.4, 3.2], look: [-5.3, 0.9, 0.5], fov: 40 }, { pos: [-2.2, 1.35, 2.8], look: [-5.3, 0.9, 0.5], fov: 36 }] },
  { id: 'clock', f: cut(4), keys: [{ pos: [-2.4, 1.5, 1.8], look: [-5.2, 1.1, 0.6], fov: 36 }, { pos: [-2.6, 1.45, 1.6], look: [-5.2, 1.1, 0.6], fov: 33 }] },
  { id: 'tiptoe', f: F.tiptoed - 4, whip: false, keys: [{ pos: [-3.0, 0.45, 2.6], look: [-4.4, 0.35, 0.2], fov: 40 }, { pos: [-3.1, 0.45, 2.3], look: [-4.5, 0.35, 0.2], fov: 37 }] },
  { id: 'grab', f: cut(5), keys: [{ pos: [-2.4, 1.0, 2.6], look: [-4.8, 0.7, 0.2], fov: 44 }, { pos: [-2.5, 1.0, 2.4], look: [-4.6, 0.7, 0.2], fov: 42 }] },
  { id: 'chase', f: cut(6), keys: [{ pos: [WX + 2.6, 1.3, 12], look: [WX, 0.8, 4], fov: 44 }, { pos: [WX + 2.2, 1.2, 6.5], look: [WX, 0.8, -1], fov: 44 }] },
  { id: 'what', f: F.what - 4, whip: false, keys: [{ pos: [WX + 0.6, 1.65, -3.8], look: [WX + 0.3, 1.5, 0.8], fov: 36 }, { pos: [WX + 0.55, 1.62, -3.4], look: [WX + 0.3, 1.5, 0.8], fov: 33 }] },
  { id: 'reveal', f: cut(7), keys: [{ pos: [WX - 0.6, 1.9, 2.6], look: [WX, 0.9, -6], fov: 46 }, { pos: [WX - 0.5, 1.7, 1.4], look: [WX, 0.9, -6], fov: 42 }] },
  { id: 'foxcu', f: F.asleep - 4, whip: false, keys: [{ pos: [WX + 0.9, 1.55, -3.9], look: [WX, 1.2, -5.9], fov: 36 }, { pos: [WX + 0.85, 1.5, -4.1], look: [WX, 1.2, -5.9], fov: 33 }] },
  { id: 'lefts', f: cut(8), keys: [{ pos: [WX - 1.6, 0.7, -4.0], look: [WX - 1.0, 0.4, -5.3], fov: 40 }, { pos: [WX - 1.55, 0.68, -4.15], look: [WX - 1.0, 0.4, -5.3], fov: 37 }] },
  { id: 'otto2', f: F.left - 4, whip: false, keys: [{ pos: [WX - 0.3, 1.6, -2.0], look: [WX + 0.3, 1.4, 0.6], fov: 38 }, { pos: [WX - 0.25, 1.6, -1.8], look: [WX + 0.3, 1.4, 0.6], fov: 35 }] },
  { id: 'end', f: cut(9), keys: [{ pos: [WX + 1.4, 1.2, -2.4], look: [WX, 1.05, -6], fov: 36 }, { pos: [WX + 1.7, 1.3, -1.6], look: [WX, 1.05, -6], fov: 40 }] },
], TOTAL);
const KICKS = [{ f: F.missing, a: 0.02 }, { f: F.grabbed, a: 0.03 }, { f: F.fox, a: 0.03 }, { f: F.left, a: 0.02 }];
const SHOWN = new Set();
const put = (rig, keys, seed, pos) => { const A = K.T.act(pos.f, keys, { seed, blink: blinkAt(pos.f, seed) }); rig.set(A, pos); SHOWN.add(rig); return A; };

export default {
  TOTAL, build, look: 'rich',
  frame(f, k) {
    const { c: cam, s } = X.camAt(S, f, KICKS), id = s.id; SHOWN.clear();
    if (id === 'reveal') cam.fov *= K.punch(f, F.fox, 0.25, 6);
    if (id === 'grab') cam.fov *= K.punch(f, F.grabbed, 0.2, 5);
    const fx = [], push = (x) => x && fx.push(x);
    const woods = s.keys[0].pos[0] > 50, night = ['otto', 'clock', 'tiptoe', 'grab'].includes(id);
    TORCH.visible = false; MSLIP.visible = false; SLIP.visible = night && f < F.grabbed; LONE.visible = !woods; FOX.root.visible = false;
    const foxSleep = (look = 0) => { FOX.set(f, { x: WX + 0.1, y: 1.0, z: -5.95, yaw: 0.6, mode: 'sleep', expr: 'sleepy', look }); FOX.root.visible = true; };
    switch (id) {
      case 'hook': case 'end': foxSleep(0.2 * Math.sin(f / 30));
        if (id === 'end' && f > F.n117b) FOX.set(f, { x: WX + 0.1, y: 1.0, z: -5.95, yaw: 0.6, mode: 'sleep', expr: 'happy' });
        push(X.wordCard(f, id === 'hook' ? F.n117 - 2 : F.n117b - 2, '117 SHOES', cam, '#f6c83a', 1e9, 190, 0.62, 1.6));
        if (f % 50 < 30) push(X.FX('z' + (f % 50), (p) => K.T.fxZ(p, (f % 50) / 30), [WX + 0.3, 1.5, -5.8], 0.4, { order: 6 })); break;
      case 'street': push(X.wordCard(f, F.n117 - 2, '117 SHOES', cam, '#f6c83a', 1e9, 190, 0.62, 1.6)); break;
      case 'door': case 'lone': case 'never': {
        const Wl = K.walkPath(f, cut(1), [[4.0, -11.6], [4.3, -8.4]], 1.1, { endYaw: 1.0 });
        put(LADY, Wl.moving ? [[0, 'walk', { expr: 'smile' }]] : ladyKeys, 3, { f, x: Wl.x, y: 0.12, z: Wl.z, yaw: Wl.moving ? Wl.yaw : id === 'never' ? -2.2 : 1.0 });
        if (id === 'lone') push(X.wordCard(f, F.missing, 'ONE SHOE GONE', cam, '#ffffff', 1e9, 160, 0.62, 1.4));
        if (id === 'never') push(X.wordCard(f, F.never, 'NEVER THE PAIR', cam, '#f6c83a', 1e9, 160, 0.62, 1.6)); break; }
      case 'blame': case 'blame2':
        put(BAKER, bakerKeys, 4, { f, x: -0.8, z: -18, yaw: Math.PI / 2 }); put(MAIL, mailKeys, 5, { f, x: 0.8, z: -18.1, yaw: -Math.PI / 2 });
        push(X.wordCard(f, id === 'blame' ? F.baker : F.mail2 + 4, id === 'blame' ? 'HE DID IT!' : 'NO, HE DID!', cam, '#ff7a3a', 1e9, 170, 0.62, 1.6)); break;
      case 'otto': case 'clock': case 'tiptoe': case 'grab': {
        const run = f >= F.ran - 2;
        const Wo = K.walkPath(f, F.ran - 2, [[-5.1, 0.6], [-3.2, 1.4], [-1.0, 4.0]], 3.0);
        put(OTTO, ottoKeys, 6, { f, x: run ? Wo.x : -5.35, y: run && Wo.x > -4 ? 0 : 0.25, z: run ? Wo.z : 0.6, yaw: run ? Wo.yaw : Math.PI / 2 - 0.2, seat: 0.47 });
        if (!run) { TORCH.visible = true; X.holdAt(OTTO, TORCH, 1, [Math.PI / 2 + 0.3 + (f > F.night && f < F.porch + 4 ? 0.5 : 0), 0, 0]); }
        // the fox: tiptoes in, grabs the slipper, runs off
        if (f >= F.something - 6) { const Wf = K.walkPath(f, F.something - 6, [[-2.6, 2.2], [-3.4, 1.2], [-4.35, 0.25]], 1.0, { endYaw: -Math.PI / 2 });
          const Wr = K.walkPath(f, F.ran - 4, [[-4.35, 0.25], [-3.0, 2.0], [-0.5, 5.0]], 4.2);
          const gone = f >= F.ran - 4; FOX.set(f, { x: gone ? Wr.x : Wf.x, y: 0.0 + (Math.abs((gone ? Wr.x : Wf.x) + 5) < 1.6 && Math.abs((gone ? Wr.z : Wf.z)) < 1.6 ? 0.25 : 0), z: gone ? Wr.z : Wf.z, yaw: gone ? Wr.yaw : Wf.yaw,
            mode: gone ? 'run' : Wf.moving ? 'walk' : 'stand', speed: gone ? 1.4 : 0.5, expr: f >= F.grabbed ? 'happy' : 'neutral', nod: !gone && !Wf.moving && f < F.grabbed + 4 ? 0.7 : 0 }); FOX.root.visible = true;
          MSLIP.visible = f >= F.grabbed + 2; }
        if (id === 'clock') push(X.wordCard(f, F.am - 2, '3:00 A.M.', cam, '#9fd4ff', 1e9, 190, 0.62, 1.6));
        if (id === 'grab') push(X.wordCard(f, F.grabbed + 2, 'HEY!', cam, '#ff5a3a', 1e9, 220, 0.62, 1.6));
        break; }
      case 'chase': case 'what': case 'reveal': case 'foxcu': case 'lefts': case 'otto2': {
        const Wc = K.walkPath(f, cut(6), [[WX + 0.6, 10], [WX + 0.3, 3.0], [WX + 0.3, 0.6]], 3.2, { endYaw: Math.PI });
        put(OTTO, ottoKeys, 6, { f, x: Wc.x, z: Wc.z, yaw: Wc.moving ? Wc.yaw : id === 'otto2' ? Math.PI + 0.25 : Math.PI });
        if (id === 'chase' && Wc.moving) { cam.look = [Wc.x - 0.3, 1.0, Wc.z - 2.0]; cam.pos = [Wc.x + 1.6, 1.35, Wc.z + 3.0]; }
        TORCH.visible = !Wc.moving || id === 'what'; if (TORCH.visible) X.holdAt(OTTO, TORCH, 1, [Math.PI / 2 + 0.2, 0, 0]);
        if (id === 'chase') { const Wf = K.walkPath(f, cut(6), [[WX - 0.2, 7.5], [WX, -1], [WX + 0.1, -4.0]], 4.0);
          FOX.set(f, { x: Wf.x, z: Wf.z, yaw: Wf.yaw, mode: 'run', speed: 1.4, expr: 'happy' }); FOX.root.visible = Wf.moving; MSLIP.visible = true; }
        else foxSleep(0);
        if (id === 'what') push(X.wordCard(f, F.find - 2, '?!', cam, '#ffffff', 1e9, 240, 0.62, 1.6));
        if (id === 'reveal') push(X.wordCard(f, F.mountain, 'A SHOE MOUNTAIN', cam, '#f6c83a', 1e9, 160, 0.62, 1.6));
        if (id === 'foxcu' && f % 50 < 30) push(X.FX('z2' + (f % 50), (p) => K.T.fxZ(p, (f % 50) / 30), [WX + 0.3, 1.5, -5.8], 0.4, { order: 6 }));
        if (id === 'lefts') push(X.wordCard(f, F.left, 'ALL LEFT SHOES', cam, '#f6c83a', 1e9, 160, 0.62, 1.4));
        break; }
    }
    for (const r of [LADY, BAKER, MAIL, OTTO]) if (!SHOWN.has(r)) r.root.visible = false;
    const cl = { hook: [[WX, 1.0, -6], 12], end: [[WX, 1.0, -6], 12], street: [[0, 1.5, -6], 5], door: [[4.3, 1.2, -8.4], 12], lone: [[5.5, 0.25, -8.3], 18], never: [[4.3, 1.35, -8.4], 14],
      blame: [[-0.8, 1.3, -18], 12], blame2: [[0.8, 1.3, -18], 12], otto: [[-5.3, 0.9, 0.6], 12], clock: [[-5.3, 1.1, 0.6], 14], tiptoe: [[-4.2, 0.4, 0.6], 16], grab: [[-4.6, 0.7, 0.4], 10],
      chase: [[WX, 0.8, 2], 6], what: [[WX + 0.3, 1.5, 0.6], 14], reveal: [[WX, 0.9, -6], 8], foxcu: [[WX, 1.2, -5.9], 14], lefts: [[WX - 1.0, 0.4, -5.3], 18], otto2: [[WX + 0.3, 1.4, 0.6], 14] };
    const dof = cl[id] ? X.focusOn(cam, cl[id][0], cl[id][1]) : { focus: 10, cinf: 4 };
    return { light: woods ? DAWN : night ? NIGHT : DAY, cam, dof, actors: [], fx };
  },
};
