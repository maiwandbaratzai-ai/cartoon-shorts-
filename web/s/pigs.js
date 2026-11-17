// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The Tamworth Two" — Malmesbury, England, January 1998: two ginger pigs escape the butcher, swim the river,
// hide in back gardens, get chased by the world's press, and retire to a farm.
import { TOTAL, LINES, wf } from './pigs_timing.js';
import * as PR from '../props.js';
import * as X from './kit3d.js';
import { blinkAt } from '../motion.js';
const { M, clamp, ramp, lerp, q } = X;

export { TOTAL };
const L = LINES, cut = (i) => Math.max(0, L[i][0] - 4), W = wf;
let K, BUTCH, SUND, BUTCHER, REP1, REP2, VET, crB, crS, gun, dart, money, puddleSplash;

const PIG = { jacket: '#d8844a', pants: '#b86a38', boots: '#4a2e22', skin: '#f2b890', build: 'stout' };
const BUTCH_O = { ...PIG, hat: 'cap', cap: '#6a4428' };
const SUND_O = { ...PIG, jacket: '#e0925a', skin: '#f4c09a' };
const BUTCHER_O = { jacket: '#c8d4dc', pants: '#2a2a34', boots: '#1e1a18', hat: 'hair', hair: '#3a2a20', moustache: '#3a2a20', skin: '#f2c8a8', build: 'stout' };
const REP1_O = { jacket: '#b8925a', pants: '#3a3a44', boots: '#2a2018', hat: 'hair', hair: '#6a4a30', skin: '#f5d0b4' };
const REP2_O = { jacket: '#4a6a9a', pants: '#2a2a30', boots: '#1e1a18', hat: 'cap', cap: '#c83a3a', skin: '#e8b890' };
const VET_O = { jacket: '#3a6a4a', pants: '#3a3a2e', boots: '#2a2018', hat: 'cap', cap: '#2a4a3a', skin: '#f2d2b0' };

const WINTER = { az: 140, el: 26, sky: '#d8e0e8', ground: '#7a7a6a', hemi: 1.0, sun: '#fff4e4', sunI: 2.4, fog: '#d8dee4', fogNear: 30, fogFar: 240,
  skyTop: '#6a8ab8', skyHor: '#e4e8ec', sat: 1.08, vig: 0.26, shadowExt: 16, exposure: 1.12, ink: 0.55 };
const FARM = { ...WINTER, az: 130, el: 34, sun: '#fff0d0', sunI: 3.0, skyTop: '#3a7ad0', skyHor: '#d8ecf8', fog: '#d8e8f0', sat: 1.16, exposure: 1.08 };

function build(k) {
  K = k; X.init(K); const { THREE } = K; const r = X.rnd(98);
  const grass = K.mat('dirt', '#7f9460', { detail: 1.2, amt: 0.4 }), conc = K.mat('rock', '#a4a49c', { detail: 0.8 }), brick = K.mat('brick', '#9a4a3a', { detail: 0.8 }),
    wood = K.mat('wood', '#8a6038', { detail: 1.0 }), dark = K.mat('wood', '#5a3e28'), hedgeM = K.mat('grime', '#3e6a34', { amt: 0.8, bump: 0.03, detail: 0.5 }),
    mud = K.mat('dirt', '#5a3e28', { detail: 0.6 }), metal = K.mat('metal', '#6a6e74'), roof = K.mat('rock', '#4a4a52', { detail: 0.5 });
  // ground with a river gap (z -16..-11)
  K.slab(-80, 80, -0.1, 0, -11, 40, grass, K.scene, false); K.slab(-80, 80, -0.1, 0, -120, -16, grass, K.scene, false);
  K.slab(-80, 80, -1.4, -1.2, -16, -11, mud, K.scene, false);
  for (const z of [-16, -11]) K.slab(-80, 80, -1.2, 0, z - 0.3, z + 0.3, K.mat('dirt', '#6a5a3e'), K.scene, false);
  const water = K.add(new THREE.PlaneGeometry(160, 5.4, 1, 1), K.toon({ color: '#5a8aa8', plain: true, roughness: 0.15, metalness: 0.1 }), 0, -0.2, -13.5, K.scene, { cast: false }); water.rotation.x = -Math.PI / 2;
  for (let i = 0; i < 120; i++) { const x = (r() - 0.5) * 60, z = r() < 0.5 ? -16.4 - r() * 0.6 : -10.6 + r() * 0.6; const rd = K.add(new THREE.ConeGeometry(0.04, 0.9 + r() * 0.6, 4), K.mat('grime', '#8a8a4a'), x, 0.4, z); rd.rotation.z = (r() - 0.5) * 0.4; }
  // ---- butcher's yard (z -4..12)
  K.slab(-14, 14, 0, 0.04, -4, 14, conc, K.scene, false);
  K.slab(-10, 6, 0, 4.2, 7, 13, brick); K.slab(-10.4, 6.4, 4.2, 4.6, 6.6, 13.4, roof);
  X.sign(7, 0.9, X.txtTex(1024, 128, '#2a3a2a', '#f2e8c8', ['HOPKINS & SONS · BUTCHERS'], 'bold 66px Georgia, serif'), -2, 3.6, 6.98);
  K.slab(-4, -1.5, 0, 2.6, 6.95, 7.0, K.mat('metal', '#8a2a22')); // roller door
  const truck = PR.oldTruck(K, '#4a5a7a'); truck.root.position.set(4.5, 0, 2.5); truck.root.rotation.y = 0.4;
  K.slab(1.2, 2.2, 0, 0.9, 0.6, 2.4, wood).rotation.z = 0.35; // ramp
  for (let i = 0; i < 5; i++) { const b = K.cyl(0.3, 0.3, 0.9, K.mat('metal', ['#3a5a8a', '#8a3a2a', '#4a7a4a'][i % 3]), -8 + i * 0.75, 0, 5.5); }
  // fence at z=-4 with a gap at x 0..0.9
  for (let x = -14; x < 14; x += 0.32) { if (x > -0.1 && x < 0.95) continue; K.slab(x - 0.13, x + 0.13, 0, 1.5 + 0.08 * Math.sin(x * 3), -4.04, -3.96, x % 2 > 1 ? wood : dark); }
  for (const y of [0.4, 1.2]) K.slab(-14, 14, y - 0.05, y + 0.05, -3.94, -3.88, dark);
  const broken = K.slab(0.1, 0.36, 0, 1.4, -4.1, -4.0, dark); broken.rotation.z = 0.9; broken.position.set(1.2, 0.2, -4.3);
  // ---- back gardens (z -20..-48)
  const hedge = (x0, x1, z0, z1, h = 1.6) => { const m = K.slab(x0, x1, 0, h, z0, z1, hedgeM); return m; };
  hedge(-30, -1.2, -25, -24); hedge(1.2, 30, -25, -24); hedge(-30, -2, -33, -32); hedge(2, 30, -33, -32); for (const [a, b] of [[-40, -37.2], [-35.2, -30], [-27, -25]]) { hedge(-6.5, -5.5, a, b); hedge(5.5, 6.5, a, b); }
  for (let i = 0; i < 60; i++) { const x = (r() - 0.5) * 60, z = r() < 0.5 ? -24.5 : -32.5; if (Math.abs(x) < 2.2) continue; K.add(new THREE.DodecahedronGeometry(0.35 + r() * 0.3, 1), hedgeM, x, 1.5 + r() * 0.2, z + (r() - 0.5) * 0.6); }
  // terrace houses
  for (let i = 0; i < 8; i++) { const x = -28 + i * 7; K.slab(x, x + 7, 0, 7, -52, -46, K.toon({ map: PR.facadeTex(['#b8a080', '#c8b090', '#a89070'][i % 3], 2, 2, i + 3, '#f2ead8'), kind: 'plaster', amt: 0.2 }));
    const rf = K.add(new THREE.CylinderGeometry(0.01, 4.2, 2.4, 4, 1).rotateY(Math.PI / 4), roof, x + 3.5, 8.2, -49); rf.scale.set(1.18, 1, 0.75); K.cyl(0.25, 0.25, 1.2, brick, x + 1, 8.5, -49); }
  // sheds, washing line, gnome, bins, table
  const shed = (x, z, ry, c) => { const g = K.group(); g.position.set(x, 0, z); g.rotation.y = ry; K.slab(-1.2, 1.2, 0, 2.1, -1, 1, K.mat('wood', c), g); const rf = K.slab(-1.4, 1.4, 2.1, 2.2, -1.2, 1.2, roof, g); rf.rotation.x = 0.1; K.slab(-0.4, 0.4, 0, 1.8, 1.0, 1.04, dark, g); return g; };
  shed(-9, -29, 0.0, '#6a8a5a'); shed(10, -37, -0.3, '#8a6a4a'); shed(-12, -42, 0.2, '#5a6a8a');
  const wanted = PR.canvasTex(384, 512, (g, w, h) => { g.fillStyle = '#efe2c0'; g.fillRect(0, 0, w, h); g.fillStyle = '#3a2412'; g.font = 'bold 84px Georgia, serif'; g.textAlign = 'center'; g.fillText('WANTED', w / 2, 92);
    for (const [cx, c] of [[110, '#e0925a'], [274, '#d8844a']]) { g.fillStyle = c; g.beginPath(); g.arc(cx, 260, 78, 0, 7); g.fill(); g.fillStyle = '#f2a080'; g.beginPath(); g.ellipse(cx, 290, 34, 24, 0, 0, 7); g.fill(); g.fillStyle = '#5a2a2a'; for (const d of [-12, 12]) { g.beginPath(); g.arc(cx + d, 290, 7, 0, 7); g.fill(); g.beginPath(); g.arc(cx + d * 2, 230, 8, 0, 7); g.fill(); } }
    g.font = 'bold 46px Georgia, serif'; g.fillText('2 PIGS', w / 2, 420); g.font = '30px Georgia, serif'; g.fillText('ON THE RUN', w / 2, 466); });
  X.sign(0.9, 1.2, wanted, -9, 1.3, -27.95, 0);
  for (const [x0, x1, z] of [[-4.5, 4.5, -28.5], [-20, -12, -36]]) { K.cyl(0.04, 0.04, 2.0, metal, x0, 0, z); K.cyl(0.04, 0.04, 2.0, metal, x1, 0, z); K.slab(x0, x1, 1.94, 1.96, z - 0.01, z + 0.01, K.mat('grime', '#e8e8e0', { plain: true }));
    for (let i = 0; i < 6; i++) { const x = x0 + 0.8 + i * (x1 - x0 - 1.6) / 5; K.slab(x - 0.3, x + 0.3, 1.25 + (i % 2) * 0.2, 1.95, z - 0.01, z + 0.01, K.mat('fabric', ['#d84a4a', '#4a7ad8', '#f2d24a', '#f2f2f2', '#8ad84a', '#d88ad8'][i], { plain: true })); } }
  const gn = K.group(); gn.position.set(2.6, 0, -27); K.cyl(0.12, 0.16, 0.35, K.mat('fabric', '#3a6ad8', { plain: true }), 0, 0, 0, gn); K.add(new THREE.SphereGeometry(0.11, 12, 8), K.mat('grime', '#f2c8a8', { plain: true }), 0, 0.45, 0, gn); K.add(new THREE.ConeGeometry(0.12, 0.3, 12), K.mat('fabric', '#d83a3a', { plain: true }), 0, 0.65, 0, gn);
  for (let i = 0; i < 3; i++) K.slab(7.5 + i * 0.7, 8.1 + i * 0.7, 0, 1.0, -30.5, -29.9, K.mat('grime', ['#2a5a2a', '#3a3a3a', '#2a3a6a'][i]));
  const tab = K.group(); tab.position.set(-3.6, 0, -30.5); K.slab(-0.6, 0.6, 0.75, 0.8, -0.45, 0.45, wood, tab); for (const [a, b] of [[-0.5, -0.35], [0.5, -0.35], [-0.5, 0.35], [0.5, 0.35]]) K.slab(a - 0.03, a + 0.03, 0, 0.75, b - 0.03, b + 0.03, dark, tab);
  const paper = PR.canvasTex(512, 640, (g, w, h) => { g.fillStyle = '#f2eee2'; g.fillRect(0, 0, w, h); g.fillStyle = '#1a1a1a'; g.font = 'bold 54px Georgia, serif'; g.textAlign = 'center'; g.fillText('THE DAILY TROTTER', w / 2, 70); g.fillRect(20, 92, w - 40, 6);
    g.font = 'bold 76px Georgia, serif'; g.fillText('BUTCH &', w / 2, 190); g.fillText('SUNDANCE', w / 2, 270); g.font = 'bold 48px Georgia, serif'; g.fillText('STILL ON THE RUN!', w / 2, 340);
    g.fillStyle = '#d8844a'; g.fillRect(60, 380, 180, 200); g.fillStyle = '#e0925a'; g.fillRect(272, 380, 180, 200); g.fillStyle = '#888'; for (let i = 0; i < 5; i++) g.fillRect(40, 600 + i * 8, w - 80, 3); });
  const pp = K.add(new THREE.PlaneGeometry(0.75, 0.94), K.toon({ map: paper, plain: true, roughness: 0.9 }), 0, 0.82, 0, tab, { cast: false }); pp.rotation.set(-Math.PI / 2, 0, 0.15);
  K.cyl(0.05, 0.05, 0.12, K.mat('grime', '#f2f2f2', { plain: true }), 0.4, 0.8, -0.25, tab);
  // town sign
  K.cyl(0.06, 0.06, 2.2, metal, 3.4, 0, -20.5); K.cyl(0.06, 0.06, 2.2, metal, 5.6, 0, -20.5);
  X.sign(2.4, 0.8, X.txtTex(768, 256, '#f2f2ee', '#1a1a1a', ['MALMESBURY', 'WILTSHIRE'], 'bold 90px Arial, sans-serif'), 4.5, 1.9, -20.45);
  // trees around
  const bark = K.mat('wood', '#5a4a3a'), leaf = K.mat('grime', '#5a7a3a', { amt: 0.6 });
  for (let i = 0; i < 30; i++) { const x = (r() - 0.5) * 120, z = -60 - r() * 40; X.tree(x, z, 2 + r() * 1.5, bark, leaf, K.scene, r); }
  for (let i = 0; i < 14; i++) { const x = (r() < 0.5 ? -1 : 1) * (16 + r() * 30), z = 14 + r() * 20; X.tree(x, z, 2 + r(), bark, leaf, K.scene, r); }
  K.lamp(-1.5, 3, 6.6, { color: '#ffd090', intensity: 1.2, distance: 6, glowS: 0.4 });
  // ---- farm at x=100
  const farm = K.group(); farm.position.set(100, 0, 0);
  K.slab(-40, 40, 0.0, 0.02, -40, 40, K.mat('dirt', '#6aa04a', { detail: 1.4, amt: 0.4 }), farm, false);
  const pud = K.add(new THREE.CylinderGeometry(2.6, 2.6, 0.06, 40), K.toon({ color: '#5a3a22', kind: 'dirt', roughness: 0.25 }), 0, 0.02, -2, farm); pud.scale.z = 0.7;
  K.slab(-6, 2, 0, 4.5, -14, -9, K.mat('wood', '#a83a2a'), farm);
  const barnRoof = K.add(new THREE.CylinderGeometry(0.01, 4.8, 2.4, 4, 1).rotateY(Math.PI / 4), roof, -2, 5.6, -11.5, farm); barnRoof.scale.set(1.15, 1, 0.75);
  X.sign(5, 0.8, X.txtTex(768, 128, '#f2e8c8', '#6a2a1a', ['SANCTUARY FARM'], 'bold 72px Georgia, serif'), -2, 3.4, -8.95, 0, farm);
  for (let i = 0; i < 5; i++) { const h = K.add(new THREE.CylinderGeometry(0.55, 0.55, 1.1, 18).rotateZ(Math.PI / 2), K.mat('fabric', '#d8b860', { amt: 0.5 }), 4 + (i % 3) * 1.2, 0.55, -6 - Math.floor(i / 3) * 1.2, farm); }
  X.fence(-12, 12, 5, 1.1, wood, farm);
  for (let i = 0; i < 16; i++) X.tree((r() - 0.5) * 70, -18 - r() * 20, 2.5 + r(), bark, K.mat('grime', '#4a8a3a', { amt: 0.6 }), farm, r);
  K.addClouds(9, 700, 160);
  // props that move
  gun = K.group(); K.add(new THREE.CylinderGeometry(0.025, 0.025, 0.9, 10).rotateX(Math.PI / 2), K.mat('metal', '#2a2a30'), 0, 0, 0.2, gun); K.slab(-0.04, 0.04, -0.12, 0.04, -0.4, -0.1, K.mat('wood', '#6a4428'), gun);
  dart = K.group(); K.add(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 8).rotateX(Math.PI / 2), K.mat('metal', '#c8c8d0'), 0, 0, 0, dart); K.add(new THREE.ConeGeometry(0.035, 0.07, 8).rotateX(-Math.PI / 2), K.mat('fabric', '#e83a3a', { plain: true }), 0, 0, -0.1, dart);
  money = K.group(); K.add(new THREE.SphereGeometry(0.16, 16, 12), K.mat('fabric', '#c9a35a'), 0, 0, 0, money); K.add(new THREE.CylinderGeometry(0.05, 0.07, 0.07, 12), K.mat('fabric', '#a8823a'), 0, 0.15, 0, money);
  // characters
  BUTCH = K.stick(BUTCH_O, { key: 'butch' }); crB = X.critter(BUTCH, 'pig', '#d8844a', '#f0a088');
  SUND = K.stick(SUND_O, { key: 'sund' }); crS = X.critter(SUND, 'pig', '#e0925a', '#f4a890');
  BUTCHER = K.stick(BUTCHER_O, { key: 'butcher' }); REP1 = K.stick(REP1_O, { key: 'rep1' }); REP2 = K.stick(REP2_O, { key: 'rep2' }); VET = K.stick(VET_O, { key: 'vet' });
}

const F = { malm: W(0, 'malmesbury'), became: W(0, 'became'), wanted: W(0, 'wanted'), squeezed: W(1, 'squeezed'), swam: W(1, 'swam'), freezing: W(1, 'freezing'),
  vanished: W(2, 'vanished'), back: W(2, 'back'), reporters: W(3, 'reporters'), chased: W(3, 'chased'), hedges: W(3, 'hedges'), papers: W(4, 'papers'),
  butch: W(4, 'butch'), sundance: W(4, 'sundance'), weirder: W(5, 'weirder'), shot: W(5, 'shot'), sund2: W(5, 'sundance'), dart: W(5, 'dart'), barely: W(6, 'barely'),
  week: W(7, 'week'), caught: W(7, 'caught'), back2: W(7, 'back'), butcher2: W(7, 'butcher'), no: W(8, 'no'), newspaper: W(8, 'newspaper'), bought: W(8, 'bought'),
  retired: W(8, 'retired'), farm: W(8, 'farm'), britain: W(9, 'britain'), never: W(9, 'never'), bacon: W(9, 'bacon') };

// acting
const butchKeys = [[0, 'run', { expr: 'laugh' }], [F.malm - 2, 'run', { expr: 'grin' }], [F.wanted - 4, 'hips', { expr: 'grin', look: 0.4 }], [cut(1), 'sneak'], [F.swam - 4, 'push', { expr: 'shock' }],
  [cut(2), 'sneak'], [F.back - 4, 'crouch', { expr: 'nervous' }], [cut(3), 'crouch', { expr: 'nervous', look: 0.5 }], [F.chased - 4, 'run'], [cut(4), 'run'],
  [F.butch - 4, 'hips', { expr: 'grin' }], [F.sundance, 'pointL', { expr: 'grin' }], [cut(5), 'idle', { expr: 'nervous' }], [F.sund2 - 2, 'shock'], [F.dart, 'panic'],
  [cut(7), 'angry'], [F.back2 - 4, 'scared'], [F.no - 2, 'shock'], [F.bought - 4, 'celebrate'], [F.retired - 4, 'run', { expr: 'laugh' }], [F.farm, 'jump'],
  [cut(9), 'sit', { expr: 'smile' }], [F.never - 4, 'cheer', { mode: 'sit' }], [F.bacon + 4, 'clap', { mode: 'sit' }], [TOTAL - 26, 'run', { expr: 'laugh' }]];
const sundKeys = [[0, 'run', { expr: 'shock' }], [F.wanted - 4, 'wave', { expr: 'grin' }], [cut(1), 'crouch', { expr: 'stern' }], [F.swam - 4, 'push', { expr: 'nervous' }],
  [cut(2), 'sneak'], [F.back - 2, 'crouch', { expr: 'nervous' }], [F.chased - 2, 'run'], [cut(4), 'run', { expr: 'laugh' }], [F.sundance - 3, 'wave', { expr: 'laugh' }],
  [cut(5), 'eat', { expr: 'grin' }], [F.sund2 - 2, 'jump', { expr: 'shock' }], [F.dart + 6, 'run', { expr: 'shock' }], [cut(6) + 4, 'run', { expr: 'nervous' }], [F.barely + 12, 'run', { expr: 'laugh' }],
  [cut(7), 'scared'], [F.back2 - 2, 'panic'], [F.no - 2, 'shock'], [F.bought - 2, 'cheer'], [F.retired - 4, 'run', { expr: 'laugh' }], [F.farm + 2, 'jump'],
  [cut(9), 'sit', { expr: 'grin' }], [F.never - 2, 'cheer', { mode: 'sit' }], [F.bacon + 6, 'laugh' ? 'clap' : 'clap', { mode: 'sit' }], [TOTAL - 24, 'run', { expr: 'laugh' }]];
const butcherKeys = [[0, 'idle'], [cut(1), 'reach', { expr: 'shock' }], [F.squeezed + 10, 'panic'], [cut(7), 'grab', { expr: 'grin' }], [F.back2 - 4, 'clap', { expr: 'grin' }],
  [F.no - 2, 'shock'], [F.bought, 'show', { R: [0.42, -0.6, 'moneybag'], expr: 'laugh' }], [F.retired, 'cheer']];
const rep1Keys = [[0, 'run', { expr: 'shock' }], [cut(3), 'lookAround'], [F.reporters, 'phone', { R: [-0.25, -0.55, 'phone', true], expr: 'grin' }], [F.chased - 4, 'run', { expr: 'shock' }],
  [cut(7), 'grab', { expr: 'stern' }], [F.no - 4, 'stop', { expr: 'stern' }], [F.newspaper - 2, 'hold', { R: [0.6, 0.0, 'moneybag'], expr: 'grin' }], [F.retired, 'wave']];
const rep2Keys = [[0, 'run', { expr: 'laugh' }], [cut(3), 'phone', { R: [-0.3, -0.5, 'phone', true], expr: 'neutral' }], [F.worldwide ?? F.reporters + 12, 'pointL', { expr: 'shock' }], [F.chased - 2, 'run', { expr: 'laugh' }],
  [cut(7), 'grab'], [F.back2, 'pointL', { expr: 'grin' }]];
const vetKeys = [[0, 'idle'], [cut(5), 'sneak'], [F.weirder - 2, 'grab', { L: [-0.1, 0.0, 'fist', true], R: [-0.05, -0.15, 'fist', true], expr: 'stern' }], [F.dart + 4, 'shock'], [cut(6) + 6, 'facepalm']];

const S = X.shotList([
  { id: 'hook', f: 0, keys: [{ pos: [0.5, 0.95, -25.6], look: [0, 1.0, -32], fov: 42 }, { pos: [0.45, 0.95, -25.3], look: [0, 1.05, -31], fov: 40 }] },
  { id: 'sign', f: F.malm - 4, keys: [{ pos: [4.6, 1.1, -16.8], look: [4.3, 1.35, -21], fov: 44 }, { pos: [4.5, 1.1, -17.2], look: [4.4, 1.35, -21], fov: 42 }] },
  { id: 'wanted', f: F.wanted - 6, whip: false, keys: [{ pos: [-8.6, 1.5, -26.0], look: [-9, 1.25, -28], fov: 38 }, { pos: [-8.7, 1.45, -26.4], look: [-9, 1.25, -28], fov: 36 }] },
  { id: 'fence', f: cut(1), keys: [{ pos: [1.6, 0.9, -8.6], look: [0.4, 0.75, -3.6], fov: 40 }, { pos: [1.4, 0.85, -8.0], look: [0.4, 0.75, -4.2], fov: 38 }] },
  { id: 'river', f: F.swam - 4, keys: [{ pos: [0.9, 0.3, -17.6], look: [0.3, -0.15, -13], fov: 40 }, { pos: [0.8, 0.3, -17.4], look: [0.3, -0.15, -14.5], fov: 38 }] },
  { id: 'sneak', f: cut(2), keys: [{ pos: [0.6, 1.3, -29.6], look: [-3.0, 1.0, -25.8], fov: 42 }, { pos: [0.7, 1.3, -29.5], look: [-1.8, 1.0, -25.8], fov: 40 }] },
  { id: 'hide', f: F.back - 4, whip: false, keys: [{ pos: [4.9, 1.7, -29.2], look: [3.6, 1.4, -32.6], fov: 36 }, { pos: [4.8, 1.65, -29.5], look: [3.6, 1.4, -32.6], fov: 33 }] },
  { id: 'press', f: cut(3), keys: [{ pos: [0.3, 1.7, -21.0], look: [0.6, 1.6, -26.6], fov: 38 }, { pos: [0.4, 1.65, -21.6], look: [0.6, 1.6, -26.6], fov: 36 }] },
  { id: 'chase', f: F.chased - 4, whip: false, keys: [{ pos: [9.0, 1.5, -28.5], look: [3.0, 1.0, -28.5], fov: 44 }, { pos: [9.0, 1.4, -28.5], look: [-3.0, 1.0, -28.5], fov: 44 }] },
  { id: 'paper', f: cut(4), keys: [{ pos: [-3.5, 2.25, -29.7], look: [-3.6, 0.8, -30.5], fov: 40 }, { pos: [-3.55, 2.05, -29.85], look: [-3.6, 0.8, -30.5], fov: 38 }] },
  { id: 'names', f: F.butch - 6, keys: [{ pos: [1.2, 1.35, -26.2], look: [0.5, 1.05, -29.0], fov: 40 }, { f: F.sundance - 4, pos: [0.4, 1.35, -26.4], look: [0.5, 1.05, -29.0], fov: 38 }, { pos: [0.0, 1.3, -26.2], look: [-0.2, 1.05, -29.0], fov: 34 }] },
  { id: 'vet', f: cut(5), keys: [{ pos: [-1.4, 1.75, -34.0], look: [2.6, 1.1, -37.0], fov: 40 }, { pos: [-1.2, 1.7, -34.2], look: [2.6, 1.1, -37.0], fov: 36 }] },
  { id: 'dart', f: F.shot - 4, whip: false, keys: [{ pos: [5.8, 1.25, -34.6], look: [3.0, 1.0, -37.6], fov: 40 }, { pos: [5.6, 1.2, -34.9], look: [3.0, 1.0, -37.6], fov: 36 }] },
  { id: 'runon', f: cut(6), keys: [{ pos: [1.5, 1.3, -33.8], look: [-5, 1.0, -36.2], fov: 40 }, { pos: [1.4, 1.3, -33.9], look: [-8, 1.0, -36.2], fov: 36 }] },
  { id: 'caught', f: cut(7), keys: [{ pos: [0.8, 1.6, 0.4], look: [0.4, 1.0, 4.6], fov: 42 }, { pos: [0.7, 1.55, 1.0], look: [0.4, 1.0, 4.6], fov: 40 }] },
  { id: 'scared', f: F.back2 - 4, whip: false, keys: [{ pos: [0.4, 1.35, 1.0], look: [0.4, 1.0, 4.8], fov: 44 }, { pos: [0.4, 1.3, 1.3], look: [0.4, 1.0, 4.8], fov: 41 }] },
  { id: 'bought', f: cut(8), whip: false, keys: [{ pos: [2.8, 1.6, 0.6], look: [-0.2, 1.15, 3.6], fov: 44 }, { pos: [2.6, 1.55, 0.9], look: [-0.2, 1.15, 3.6], fov: 42 }] },
  { id: 'farm', f: F.retired - 4, keys: [{ pos: [101.5, 1.6, 6.5], look: [100, 0.9, -1.5], fov: 44 }, { pos: [101.2, 1.4, 5.0], look: [100, 0.7, -2], fov: 42 }] },
  { id: 'end', f: cut(9), whip: false, keys: [{ pos: [100.3, 1.0, 2.0], look: [100, 0.6, -2], fov: 38 }, { f: TOTAL - 28, pos: [100.2, 0.95, 1.6], look: [100, 0.6, -2], fov: 34 }, { pos: [100.4, 0.8, 2.6], look: [100, 0.9, -4], fov: 42 }] },
], TOTAL);
const KICKS = [{ f: F.squeezed + 8, a: 0.02 }, { f: F.sund2, a: 0.03 }, { f: F.no, a: 0.03 }, { f: F.bacon, a: 0.02 }];
const SHOWN = new Set();
const put = (rig, keys, seed, pos) => { const A = K.T.act(pos.f, keys, { seed, blink: blinkAt(pos.f, seed) }); rig.set(A, pos); SHOWN.add(rig); return A; };

export default {
  TOTAL, build, look: 'rich',
  frame(f, k) {
    const { c: cam, s } = X.camAt(S, f, KICKS), id = s.id; SHOWN.clear();
    gun.visible = dart.visible = money.visible = false;
    const fx = [], push = (x) => x && fx.push(x);
    const u = (a, b) => clamp((f - a) / (b - a));
    switch (id) {
      case 'hook': { const t = u(0, F.malm - 4);
        put(SUND, sundKeys, 3, { f, x: -0.55, z: lerp(-30.6, -28.2, t), yaw: 0.1 }); put(BUTCH, butchKeys, 5, { f, x: 0.6, z: lerp(-31.4, -28.8, t), yaw: -0.1 });
        put(REP1, rep1Keys, 7, { f, x: -0.7, z: lerp(-36.5, -33.5, t), yaw: 0 }); put(REP2, rep2Keys, 8, { f, x: 0.9, z: lerp(-37.5, -34.5, t), yaw: 0 });
        if (f % 14 < 3) push(X.FX('flash' + (f % 14), (p) => K.T.fxBurst(p, 0.6, '#ffffff'), [-0.6, 1.4, lerp(-36.1, -33.1, t)], 0.4, { order: 6 }));
        break; }
      case 'sign': { const t = u(F.malm - 4, F.wanted - 6);
        put(SUND, sundKeys, 3, { f, x: lerp(2.6, 6.6, t), z: -21.3, yaw: Math.PI / 2 }); put(BUTCH, butchKeys, 5, { f, x: lerp(1.6, 5.6, t), z: -22.0, yaw: Math.PI / 2 }); break; }
      case 'wanted': put(BUTCH, butchKeys, 5, { f, x: -7.6, z: -28.3, yaw: -0.5 }); push(X.wordCard(f, F.wanted, 'MOST WANTED', cam, '#ff5a3a', 1e9, 170, 0.62, 1.2)); break;
      case 'fence': { const t = u(F.squeezed - 4, F.swam - 6);
        put(BUTCH, butchKeys, 5, { f, x: 0.45, z: lerp(-2.8, -6.0, M.smooth(t)), yaw: Math.PI });
        put(SUND, sundKeys, 3, { f, x: 0.45, z: lerp(-1.4, -3.6, M.smooth(u(F.squeezed + 4, F.swam - 4))), yaw: Math.PI });
        put(BUTCHER, butcherKeys, 2, { f, x: -0.8, z: lerp(3.5, 0.0, t), yaw: Math.PI });
        const sq = f > F.squeezed && f < F.squeezed + 14; if (sq) { BUTCH.root.scale.x *= 0.7; }
        break; }
      case 'river': { const t = u(F.swam - 4, cut(2));
        put(BUTCH, butchKeys, 5, { f, x: 0.9, y: -1.15 + 0.04 * Math.sin(f * 0.4), z: lerp(-11.8, -15.0, t), yaw: Math.PI });
        put(SUND, sundKeys, 3, { f, x: -0.2, y: -1.15 + 0.04 * Math.sin(f * 0.4 + 2), z: lerp(-11.0, -14.2, t), yaw: Math.PI });
        push(X.wordCard(f, F.freezing, 'FREEZING!', cam, '#9fd4ff', 1e9, 190, 0.6, 1.8));
        for (let i = 0; i < 2; i++) push(X.FX('spl' + i + q((f % 16) / 16, 1), (p) => K.T.fxSplash(p, (f % 16) / 16), [i ? -0.2 : 0.9, -0.55, lerp(-11.8, -15.0, t) + (i ? 0.8 : 0) - 0.3], 0.35, { order: 6 }));
        break; }
      case 'sneak': { const t = u(cut(2), F.back - 4);
        put(BUTCH, butchKeys, 5, { f, x: lerp(-5, -1.2, t), z: -25.8, yaw: Math.PI / 2 }); put(SUND, sundKeys, 3, { f, x: lerp(-6.2, -2.4, t), z: -26.1, yaw: Math.PI / 2 }); break; }
      case 'hide': put(BUTCH, butchKeys, 5, { f, x: 3.0, y: 0.5, z: -33.4, yaw: 0.3 }); put(SUND, sundKeys, 3, { f, x: 4.1, y: 0.45 + 0.08 * Math.sin(f * 0.3), z: -33.5, yaw: 0.0 }); push(X.wordCard(f, F.back, 'VANISHED', cam, '#ffffff', 1e9, 190, 0.62, 1.6)); break;
      case 'press': put(REP1, rep1Keys, 7, { f, x: 0.05, z: -26.4, yaw: 0.2 }); put(REP2, rep2Keys, 8, { f, x: 1.3, z: -27.0, yaw: -0.3 });
        if (f > F.reporters && f % 10 < 3) push(X.FX('fl' + (f % 10), (p) => K.T.fxBurst(p, 0.6, '#ffffff'), [-0.2, 1.2, -26.1], 0.35, { order: 6 }));
        push(X.wordCard(f, F.reporters + 6, 'WORLDWIDE', cam, '#f6c83a', 1e9, 180, 0.62, 1.8)); break;
      case 'chase': { const t = u(F.chased - 4, cut(4));
        put(BUTCH, butchKeys, 5, { f, x: lerp(6, -6, t), z: -28.8, yaw: -Math.PI / 2 }); put(SUND, sundKeys, 3, { f, x: lerp(7.2, -5, t), z: -28.2, yaw: -Math.PI / 2 });
        put(REP1, rep1Keys, 7, { f, x: lerp(11, -1, t), z: -28.6, yaw: -Math.PI / 2 }); put(REP2, rep2Keys, 8, { f, x: lerp(12.4, 0.2, t), z: -28.0, yaw: -Math.PI / 2 });
        if (f % 12 < 3) push(X.FX('fc' + (f % 12), (p) => K.T.fxBurst(p, 0.6, '#ffffff'), [lerp(11, -1, t), 1.3, -28.4], 0.4, { order: 6 }));
        break; }
      case 'paper': break;
      case 'names': put(BUTCH, butchKeys, 5, { f, x: 0.9, z: -29.0, yaw: -0.2 }); put(SUND, sundKeys, 3, { f, x: -0.3, z: -29.2, yaw: 0.25 });
        push(X.wordCard(f, F.butch, 'BUTCH', cam, '#f6c83a', F.sundance - F.butch - 2, 200, 0.62, 1.8)); push(X.wordCard(f, F.sundance, 'SUNDANCE', cam, '#f6c83a', 1e9, 200, 0.62, 1.8)); break;
      case 'vet': case 'dart': {
        put(VET, vetKeys, 9, { f, x: id === 'vet' ? lerp(-0.2, 0.4, u(cut(5), F.shot)) : 0.4, z: -35.4, yaw: 2.2 });
        gun.visible = true; gun.position.set(0.4 + Math.sin(2.2) * 0.32, 1.12, -35.4 + Math.cos(2.2) * 0.32); gun.rotation.set(0, 2.2, 0);
        put(SUND, sundKeys, 3, { f, x: 3.4, z: -37.4, yaw: id === 'dart' && f > F.sund2 ? -1.2 : 0.6 });
        if (f >= F.shot && f < F.sund2) { const t = u(F.shot, F.sund2); dart.visible = true; dart.position.set(lerp(0.9, 3.25, t), 1.1 - 0.15 * t, lerp(-35.75, -37.5, t)); dart.rotation.y = 2.2; }
        if (f >= F.sund2) { dart.visible = true; dart.position.set(3.2, 0.95, -37.55); dart.rotation.y = 2.2; }
        push(X.wordCard(f, F.weirder, 'IT GETS WEIRDER', cam, '#ff7a3a', F.shot - F.weirder - 2, 160, 0.62, 1.8));
        if (id === 'dart') push(X.wordCard(f, F.dart, 'TRANQ DART!', cam, '#ff5a3a', 1e9, 180, 0.62, 1.8));
        break; }
      case 'runon': { const t = u(cut(6), cut(7));
        put(SUND, sundKeys, 3, { f, x: lerp(-2.5, -11, t), z: -36.2, yaw: -Math.PI / 2 }); dart.visible = true; dart.position.set(lerp(-2.5, -11, t) + 0.3, 0.95 + SUND.root.position.y * 0.5, -36.2); dart.rotation.y = -Math.PI / 2 + Math.PI;
        put(VET, vetKeys, 9, { f, x: lerp(-0.5, -6, t), z: -35.4, yaw: -Math.PI / 2 });
        push(X.wordCard(f, F.barely + 6, 'STILL RUNNING', cam, '#9ad04a', 1e9, 170, 0.62, 1.8)); break; }
      case 'caught': case 'scared': case 'bought':
        put(BUTCH, butchKeys, 5, { f, x: 0.9, z: 4.7, yaw: id === 'scared' ? -0.4 : Math.PI + 0.2 }); put(SUND, sundKeys, 3, { f, x: -0.1, z: 4.9, yaw: id === 'scared' ? 0.2 : Math.PI - 0.2 });
        put(REP1, rep1Keys, 7, { f, x: id === 'bought' ? 0.3 : 2.2, z: id === 'bought' ? 2.6 : 3.8, yaw: id === 'bought' ? -2.6 : -1.4 });
        put(BUTCHER, butcherKeys, 2, { f, x: -1.0, z: 3.2, yaw: id === 'bought' ? 2.6 : 0.9 });
        if (id === 'caught') { put(REP2, rep2Keys, 8, { f, x: -1.6, z: 4.4, yaw: 1.2 }); push(X.wordCard(f, F.week - 2, '1 WEEK LATER', cam, '#ffffff', 1e9, 170, 0.62, 1.8)); }
        if (id === 'scared') push(X.wordCard(f, F.butcher2, 'BACK TO THE BUTCHER?', cam, '#ff5a3a', 1e9, 140, 0.62, 1.6));
        if (id === 'bought') { push(X.wordCard(f, F.no, 'NO!', cam, '#ffffff', F.newspaper - F.no + 4, 220, 0.62, 1.8)); push(X.wordCard(f, F.bought, 'SOLD!', cam, '#9ad04a', 1e9, 220, 0.62, 1.8)); }
        break;
      case 'farm': { const t = u(F.retired - 4, F.farm);
        put(BUTCH, butchKeys, 5, { f, x: 100.6, z: lerp(4.5, -1.6, M.smooth(t)), yaw: Math.PI }); put(SUND, sundKeys, 3, { f, x: 99.4, z: lerp(5.5, -2.0, M.smooth(t)), yaw: Math.PI });
        if (f > F.farm) push(X.FX('mud' + q((f - F.farm) / 20, 1), (p) => K.T.fxSplash(p, clamp((f - F.farm) / 20)), [100, 0.1, -1.6], 0.8, { order: 6, tint: '#8a5a3a' }));
        push(X.wordCard(f, F.farm, 'RETIRED!', cam, '#9ad04a', 1e9, 190, 0.62, 2)); break; }
      case 'end': { const run = u(TOTAL - 26, TOTAL);
        put(BUTCH, butchKeys, 5, { f, x: 100.55, y: run > 0 ? 0 : -0.12, z: lerp(-2.0, 0.6, run), yaw: run > 0 ? 0 : -0.25, seat: 0.05 });
        put(SUND, sundKeys, 3, { f, x: 99.45, y: run > 0 ? 0 : -0.12, z: lerp(-2.3, 0.3, run), yaw: run > 0 ? 0 : 0.25, seat: 0.05 });
        push(X.wordCard(f, F.bacon, 'NEVER BACON', cam, '#f6c83a', 1e9, 180, 0.62, 1.8)); break; }
    }
    for (const r of [BUTCH, SUND, BUTCHER, REP1, REP2, VET]) if (!SHOWN.has(r)) r.root.visible = false;
    X.wagTail(crB, f, 0.5); X.wagTail(crS, f + 7, 0.5);
    const cl = { hook: [[0, 1, -30], 8], wanted: [[-9, 1.25, -28], 16], fence: [[0.4, 0.8, -5], 9], river: [[0.4, -0.1, -14], 9], hide: [[0.6, 1.2, -33], 12], press: [[0.5, 1.5, -26.8], 12],
      paper: [[-3.6, 0.8, -30.5], 16], names: [[0.3, 1.1, -29], 13], vet: [[0.4, 1.3, -35.4], 12], dart: [[3.3, 1.0, -37.4], 12], caught: [[0.4, 1.0, 4.6], 10], scared: [[0.3, 1.0, 4.6], 14], bought: [[-0.2, 1.4, 3.6], 10], end: [[100, 0.6, -2], 12], sign: [[4.4, 1.5, -21], 8] };
    const dof = cl[id] ? X.focusOn(cam, cl[id][0], cl[id][1]) : { focus: 10, cinf: 4 };
    return { light: ['farm', 'end'].includes(id) ? FARM : WINTER, cam, dof, actors: [], fx };
  },
};
