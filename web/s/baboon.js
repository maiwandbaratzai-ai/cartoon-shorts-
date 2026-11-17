// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Jack the signalman baboon" — Uitenhage, South Africa, 1880s. Signal cabin, levers, steam train, rail trolley.
import { TOTAL, LINES, wf } from './baboon_timing.js';
import * as PR from '../props.js';
import * as X from './kit3d.js';
import { blinkAt } from '../motion.js';
const { M, clamp, ramp, lerp, q } = X;

export { TOTAL };
const L = LINES, cut = (i) => Math.max(0, L[i][0] - 4);
const W = (i, w) => wf(i, w);
let K, JACK, JACKC, JAMES, LADY, INSP, crJ, crJC, levers = [], sema = [], train, puffs = [], trolley, coins, beer, cabinLamp;

// ---------- characters ----------
const FUR = '#7a5a3a';
const JACK_O = { jacket: FUR, pants: '#6a4a2e', boots: '#4a3020', skin: '#c9a27e', build: 'kid' };
const JACKC_O = { ...JACK_O, hat: 'cap', cap: '#2a3a6a' };
const JAMES_O = { jacket: '#2a4a7a', pants: '#a0703a', boots: '#7a5030', hat: 'cap', cap: '#2a3a5a', moustache: '#5a3a22', skin: '#f2d2b0' };
const LADY_O = { jacket: '#c85a7a', pants: '#4a2a3a', boots: '#2a1a1a', hat: 'hair', hair: '#5a3a22', skin: '#f5d6bc' };
const INSP_O = { jacket: '#3a3a44', pants: '#2a2a30', boots: '#1e1a18', hat: 'tophat', moustache: '#d8d0c8', skin: '#f6dcc4', build: 'stout' };

// ---------- light ----------
const DAY = { az: 20, el: 34, sky: '#cfe0f0', ground: '#a06a44', hemi: 0.95, sun: '#fff0d0', sunI: 3.0, fog: '#e8dcc8', fogNear: 50, fogFar: 420,
  skyTop: '#3a78c8', skyHor: '#f0e0c4', sat: 1.12, vig: 0.24, shadowExt: 16, exposure: 1.08, ink: 0.55 };
const IN = { ...DAY, hemi: 0.55, sunI: 2.6, exposure: 1.15, bloom: 0.5, vig: 0.32, cardTint: '#fff4e4', fogNear: 30 };

// ---------- set ----------
function build(k) {
  K = k; X.init(K); const { THREE } = K; const r = X.rnd(31);
  const dirt = K.mat('dirt', '#b87a50', { detail: 1.4 }), dirt2 = K.mat('dirt', '#a8704a', { detail: 3 }), wood = K.mat('wood', '#8a5c36', { detail: 1.2 }), dark = K.mat('wood', '#5a3a24'),
    iron = K.mat('metal', '#3a3a40'), brick = K.mat('brick', '#a85a40', { detail: 0.9 }), plaster = K.mat('plaster', '#e8d8b8'), roofM = K.mat('metal', '#8a8a86', { detail: 0.6 }),
    floor = K.mat('wood', '#9a6a40', { detail: 0.8 }), stone = K.mat('rock', '#c8b8a0', { detail: 0.8 });
  K.slab(-120, 120, -0.1, 0, -200, 120, dirt, K.scene, false);
  // track along z at x=0
  for (const x of [-0.72, 0.72]) K.slab(x - 0.04, x + 0.04, 0.14, 0.22, -200, 120, iron, K.scene, false);
  for (let z = -200; z < 120; z += 0.8) K.slab(-1.05, 1.05, 0, 0.14, z - 0.13, z + 0.13, dark, K.scene, false);
  K.slab(-1.6, 1.6, -0.05, 0.05, -200, 120, K.mat('rock', '#8a7a6a', { detail: 0.3 }), K.scene, false); // ballast
  // ---- signal cabin x[-8,-3] z[-2.5,2.5], open on the +z side (camera side for interiors)
  K.slab(-8, -3, 0, 0.12, -2.5, 2.5, floor);
  K.slab(-8, -7.8, 0, 3, -2.5, 2.5, plaster); K.slab(-8, -3, 0, 3, -2.7, -2.5, plaster);
  K.slab(-3.2, -3, 0, 0.75, -2.5, 2.5, brick); K.slab(-3.2, -3, 2.35, 3, -2.5, 2.5, plaster);
  for (const z of [-2.4, -0.8, 0.8, 2.4]) K.slab(-3.2, -3, 0.75, 2.35, z - 0.08, z + 0.08, wood);
  K.slab(-3.25, -2.9, 0.72, 0.8, -2.6, 2.6, wood); // sill
  K.slab(-8.2, -2.6, 3, 3.15, -3, 3, roofM); K.slab(-8.2, -2.6, 3.15, 3.25, -3, 3, dark);
  K.slab(-8, -7.85, 0, 1.0, -2.5, 2.5, brick); K.slab(-8, -3, 0, 1.0, -2.6, -2.45, brick);
  // lever frame + 6 levers
  K.slab(-3.75, -3.45, 0.12, 0.35, -2.0, 2.0, iron);
  const hc = ['#c8302a', '#c8302a', '#2a5ab8', '#2a5ab8', '#202020', '#e8b830'];
  for (let i = 0; i < 6; i++) { const z = -1.5 + i * 0.6, g = K.group(); g.position.set(-3.6, 0.3, z);
    K.slab(-0.035, 0.035, 0, 1.15, -0.035, 0.035, K.mat('metal', '#7a7a80'), g); K.slab(-0.06, 0.06, 1.05, 1.25, -0.05, 0.05, K.mat('metal', hc[i], { plain: true }), g);
    levers.push(g); }
  const nums = PR.canvasTex(768, 128, (g, w, h) => { g.fillStyle = '#2a2a2e'; g.fillRect(0, 0, w, h); g.fillStyle = '#f2e8c8'; g.font = 'bold 96px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; for (let i = 0; i < 6; i++) g.fillText(String(i + 1), w * (i + 0.5) / 6, h / 2 + 4); });
  X.sign(3.6, 0.6, nums, -3.22, 0.5, 0, -Math.PI / 2); // board under the window, readable from inside
  // interior props
  K.slab(-7.6, -6.2, 0.8, 0.86, 1.0, 2.2, wood); for (const [a, b] of [[-7.5, 1.1], [-6.3, 1.1], [-7.5, 2.1], [-6.3, 2.1]]) K.slab(a - 0.04, a + 0.04, 0, 0.8, b - 0.04, b + 0.04, dark); // desk
  K.slab(-7.3, -6.9, 0.86, 0.9, 1.3, 1.6, K.mat('fabric', '#7a2a2a', { plain: true })); // ledger
  K.cyl(0.05, 0.04, 0.1, K.mat('grime', '#f2f2f2', { plain: true }), -6.6, 0.86, 1.4);
  const clock = PR.canvasTex(256, 256, (g) => { g.fillStyle = '#f6efe0'; g.beginPath(); g.arc(128, 128, 120, 0, 7); g.fill(); g.lineWidth = 12; g.strokeStyle = '#3a2a1a'; g.stroke(); g.lineWidth = 8; g.beginPath(); g.moveTo(128, 128); g.lineTo(128, 50); g.moveTo(128, 128); g.lineTo(180, 140); g.stroke(); });
  X.sign(0.55, 0.55, clock, -7.78, 2.3, 0, Math.PI / 2, K.scene);
  X.sign(0.8, 0.6, X.txtTex(256, 192, '#efe6d0', '#3a2a1a', ['1885', 'MARCH'], 'bold 60px Georgia, serif'), -7.78, 1.6, -1.2, Math.PI / 2);
  X.sign(1.8, 0.5, X.txtTex(512, 140, '#2a3a5a', '#f2e8c8', ['CAPE GOVT RAILWAYS'], 'bold 52px Georgia, serif'), -5.4, 2.6, -2.48, 0);
  const st = K.group(); st.position.set(-7.3, 0.12, -1.9); K.cyl(0.3, 0.32, 0.7, iron, 0, 0, 0, st); K.cyl(0.06, 0.06, 2.2, iron, 0, 0.7, 0, st); K.cyl(0.14, 0.18, 0.2, K.mat('metal', '#8a6a3a'), 0.05, 0.7, 0, st); // stove + kettle
  for (let i = 0; i < 3; i++) K.add(new THREE.SphereGeometry(0.06, 10, 8), K.toon({ color: '#e8c840', plain: true }), -5.6 + i * 0.09, 2.05, -2.42); // bananas on a shelf
  K.slab(-6.0, -4.9, 1.95, 2.0, -2.5, -2.25, wood);
  beer = K.group(); beer.position.set(-6.85, 0.86, 1.75); K.cyl(0.04, 0.045, 0.22, K.mat('metal', '#5a3a12', { roughness: 0.3, plain: true }), 0, 0, 0, beer); K.cyl(0.015, 0.02, 0.08, K.mat('metal', '#5a3a12', { plain: true }), 0, 0.22, 0, beer);
  coins = K.group(); coins.position.set(-6.6, 0.86, 1.8); for (let i = 0; i < 4; i++) K.cyl(0.03, 0.03, 0.012, K.mat('metal', '#d8b040', { roughness: 0.4 }), (i % 2) * 0.05, i * 0.012, 0, coins);
  K.slab(-4.5, -3.9, 0.12, 0.55, -0.28, 0.28, wood); // Jack's step box
  K.slab(-7.9, -7.82, 1.3, 1.9, 0.3, 0.9, K.mat('wood', '#6a4a2a')); // notice board
  cabinLamp = K.lamp(-5.2, 2.5, 0.2, { color: '#ffb060', intensity: 2.2, distance: 7, glowS: 0.5, flicker: 0.05 });
  K.dust([-5.3, 1.5, 0], [4, 2.4, 4], 160);
  K.shaft([-2.6, 2.6, 0], [-4.6, 0.2, 0.4], 0.5, 1.2, '#ffe8c0', 0.12);
  // ---- platform + station on the far side (x>0)
  K.slab(2.2, 7, 0, 0.9, -14, 14, stone); K.slab(2.2, 2.45, 0.85, 0.95, -14, 14, K.mat('rock', '#e8e0d0', { plain: true }));
  K.slab(7, 12, 0, 3.4, -6, 6, brick); K.slab(6.6, 12.4, 3.4, 3.6, -6.4, 6.4, roofM);
  for (const z of [-5, 0, 5]) K.cyl(0.08, 0.08, 2.6, iron, 3.0, 0.9, z);
  K.slab(2.6, 7.2, 3.4, 3.55, -6.5, 6.5, K.mat('wood', '#8a3a2a'));
  X.sign(3.6, 0.7, X.txtTex(768, 150, '#1e3a2a', '#f2e8c8', ['UITENHAGE']), 6.98, 2.6, 0, -Math.PI / 2);
  const bench = K.group(); bench.position.set(6.4, 0.9, -3); K.slab(-0.25, 0.25, 0.4, 0.46, -0.9, 0.9, wood, bench); K.slab(0.2, 0.26, 0.46, 0.95, -0.9, 0.9, wood, bench);
  for (let i = 0; i < 4; i++) { const c = PR.crate(K, ['MAIL', 'FRAGILE', 'CAPE', 'TEA'][i], ['#9a6a3a', '#8a5a2a', '#6a5a3a', '#7a4a2a'][i], K.scene, [0.6, 0.45, 0.5]); c.position.set(5.6 + (i % 2) * 0.7, 0.9, 6 + Math.floor(i / 2) * 0.6); }
  K.lamp(3.4, 2.9, 3, { color: '#ffc070', intensity: 1.2, distance: 5, glowS: 0.4, flicker: 0.04 });
  // semaphores
  for (const [x, z, s] of [[-1.9, -9, 1], [1.9, 12, -1]]) { const g = K.group(); g.position.set(x, 0, z); K.cyl(0.08, 0.1, 5.4, K.mat('wood', '#e8e0d0'), 0, 0, 0, g);
    const a = K.group(g); a.position.set(0.0, 5.0, 0.12); K.slab(0, 1.3 * s, -0.12, 0.12, -0.03, 0.03, K.mat('wood', '#c8302a', { plain: true }), a); K.slab(0.85 * s, 1.0 * s, -0.12, 0.12, -0.035, 0.035, K.mat('wood', '#f2f2f2', { plain: true }), a);
    sema.push({ a, s }); }
  // landscape: acacias, aloes, rocks, hills
  const bark = K.mat('wood', '#5a3a26'), leaf = K.mat('grime', '#6a8a3a', { amt: 0.7 }), aloe = K.mat('grime', '#5a8a6a', { amt: 0.5 });
  for (let i = 0; i < 40; i++) { const a = r() * 6.28, d = 14 + r() * 70; const x = Math.cos(a) * d, z = Math.sin(a) * d - 20; if (Math.abs(x) < 4) continue;
    const g = K.group(); g.position.set(x, 0, z); const s = 1 + r(); K.cyl(0.1 * s, 0.16 * s, 2.2 * s, bark, 0, 0, 0, g); const c = K.add(new THREE.SphereGeometry(1.6 * s, 14, 8), leaf, 0, 2.6 * s, 0, g); c.scale.set(1.3, 0.35, 1.3); }
  for (let i = 0; i < 26; i++) { const x = (r() < 0.5 ? -1 : 1) * (4 + r() * 20), z = -40 + r() * 70; if (x > 2 && x < 13 && z > -15 && z < 15) continue; if (x > -9 && x < -2 && z > -4 && z < 4) continue;
    for (let j = 0; j < 7; j++) { const lf = K.add(new THREE.ConeGeometry(0.08, 0.7, 6), aloe, x, 0.3, z); lf.rotation.set(Math.cos(j) * 0.6, 0, Math.sin(j) * 0.6); } }
  for (let i = 0; i < 20; i++) K.add(new THREE.DodecahedronGeometry(0.3 + r() * 0.6, 1), K.mat('rock', '#b08a6a'), (r() - 0.5) * 60, 0, -10 - r() * 60).scale.set(1, 0.5, 1);
  for (let i = 0; i < 6; i++) { const h = K.add(new THREE.SphereGeometry(40 + r() * 30, 24, 12), dirt2, -150 + i * 60, -20, -230 - r() * 40); h.scale.y = 0.6; }
  K.addClouds(8, 700, 160);
  // ---- trolley (rides the rails) and steam train
  trolley = K.group(); K.slab(-0.8, 0.8, 0.28, 0.4, -0.7, 0.7, wood, trolley); for (const sx of [-0.72, 0.72]) for (const sz of [-0.5, 0.5]) K.add(new THREE.CylinderGeometry(0.14, 0.14, 0.06, 16).rotateZ(Math.PI / 2), iron, sx, 0.26, sz, trolley);
  K.slab(-0.3, 0.3, 0.4, 0.85, -0.25, 0.25, K.mat('wood', '#a8783a'), trolley); // seat crate
  train = K.group(); const blk = K.mat('metal', '#26262c', { roughness: 0.5 }), grn = K.mat('metal', '#2a5a3a', { roughness: 0.5 }), red = K.mat('metal', '#a8302a'), brass = K.mat('metal', '#d0a040', { roughness: 0.35 });
  K.add(new THREE.CylinderGeometry(0.8, 0.8, 5, 28).rotateX(Math.PI / 2), grn, 0, 1.75, 0, train);
  for (const z of [-1.5, 0, 1.5]) K.add(new THREE.TorusGeometry(0.81, 0.04, 6, 28), brass, 0, 1.75, z, train);
  K.cyl(0.22, 0.3, 1.1, blk, 0, 2.4, -1.8, train); K.cyl(0.36, 0.22, 0.25, blk, 0, 3.5, -1.8, train); K.add(new THREE.SphereGeometry(0.3, 16, 10), brass, 0, 2.55, -0.2, train);
  K.slab(-1.1, 1.1, 0.9, 3.4, 2.4, 4.4, red, train); K.slab(-1.2, 1.2, 3.4, 3.55, 2.3, 4.5, blk, train); K.slab(-1.0, 1.0, 0.6, 0.95, -2.6, 4.4, blk, train);
  const cc = K.add(new THREE.ConeGeometry(0.9, 0.9, 4).rotateX(-Math.PI / 2.4), red, 0, 0.6, -2.9, train); cc.rotation.y = Math.PI / 4;
  for (const z of [-1.6, -0.2, 1.2, 2.8]) for (const x of [-0.78, 0.78]) K.add(new THREE.CylinderGeometry(0.5, 0.5, 0.12, 22).rotateZ(Math.PI / 2), red, x, 0.62, z, train);
  K.add(new THREE.CircleGeometry(0.3, 20), K.toon({ color: '#ffe8a0', plain: true, emissive: '#ffd060' }), 0, 2.0, -2.52, train).rotation.y = Math.PI;
  const tender = K.group(train); tender.position.z = 6.2; K.slab(-1.1, 1.1, 0.6, 2.4, -1.4, 1.6, blk, tender); K.slab(-0.9, 0.9, 2.4, 2.8, -1.2, 1.4, K.mat('rock', '#1a1a1a', { detail: 0.3 }), tender);
  const car = K.group(train); car.position.z = 11.5; K.slab(-1.2, 1.2, 0.7, 3.1, -3.2, 3.2, K.mat('wood', '#7a2a22'), car); K.slab(-1.3, 1.3, 3.1, 3.3, -3.3, 3.3, roofM, car);
  for (let i = 0; i < 4; i++) for (const sx of [-1.21, 1.21]) K.slab(sx - 0.01, sx + 0.01, 1.8, 2.6, -2.5 + i * 1.6, -1.8 + i * 1.6, K.mat('grime', '#f0d890', { plain: true }), car);
  const smoke = K.toon({ color: '#f2f0ec', plain: true, roughness: 1 });
  for (let i = 0; i < 12; i++) { const p = K.add(new THREE.SphereGeometry(0.5, 14, 10), smoke, 0, -50, 0); p.castShadow = false; puffs.push(p); }
  // characters
  JACK = K.stick(JACK_O, { key: 'jack' }); crJ = X.critter(JACK, 'baboon', FUR);
  JACKC = K.stick(JACKC_O, { key: 'jackc' }); crJC = X.critter(JACKC, 'baboon', FUR);
  JAMES = K.stick(JAMES_O, { key: 'james' }); LADY = K.stick(LADY_O, { key: 'lady' }); INSP = K.stick(INSP_O, { key: 'insp' });
}

// ---------- timing ----------
const F = {
  signals: W(0, 'signals'), little: W(1, 'little'), wooden: W(2, 'wooden'), jack2: W(2, 'jack'), pushing: W(2, 'pushing'), copying: W(3, 'copying'),
  whistled: W(4, 'whistled'), yanked: W(4, 'yanked'), lever4: W(4, 'lever'), passenger: W(5, 'passenger'), screamed: W(5, 'screamed'), monkey: W(5, 'monkey'),
  inspector: W(6, 'inspector'), fire: W(6, 'fire'), aced: W(7, 'aced'), instead: W(7, 'instead'), hired: W(8, 'hired'), twenty: W(8, 'twenty'), beer: W(8, 'beer'),
  nine: W(9, 'nine'), mistake: W(9, 'mistake'),
};
const PULL_A = { L: [0.35, 0.5, 'open'], R: [0.05, -0.45, 'fist', true], expr: 'stern', tilt: -3 };
const PULL_B = { L: [0.4, 0.3, 'open'], R: [0.12, 0.25, 'fist', true], expr: 'grin', tilt: 6 };
const pulls = (f0, n, gap = 14, last = PULL_B) => Array.from({ length: n }, (_, i) => [f0 + i * gap, 'grab', i % 2 ? last : PULL_A]);
const jackKeys = [[0, 'grab', PULL_A], ...pulls(12, 5, 13).slice(1), [76, 'pointUp', { expr: 'grin' }],
  [cut(1), 'push', { mode: 'march', expr: 'stern' }], [F.little - 4, 'push', { mode: 'run', expr: 'grin' }], [F.wooden - 2, 'push', { mode: 'march', expr: 'neutral' }],
  [F.jack2 - 4, 'push', { mode: 'run', expr: 'laugh' }], [cut(3), 'think', { look: -0.4 }], [F.copying - 4, 'grab', PULL_A], [F.copying + 10, 'grab', PULL_B], [F.copying + 24, 'grab', PULL_A], [F.copying + 36, 'celebrate'],
  [cut(4), 'lookAround'], [F.whistled - 3, 'ears'], [F.yanked - 6, 'grab', PULL_A], [F.yanked - 1, 'grab', { ...PULL_B, expr: 'laugh' }], [F.lever4 + 10, 'cheer'],
  [cut(5), 'wave', { expr: 'smile' }], [F.screamed - 2, 'shock'], [F.monkey + 6, 'shrug'],
  [cut(6), 'idle', { expr: 'nervous' }], [F.fire - 3, 'scared'], [cut(7) + 6, 'grab', PULL_A], [F.aced, 'grab', PULL_B], [F.instead - 2, 'celebrate'],
  [cut(8), 'cheer'], [F.twenty - 4, 'hold', { R: [0.3, 0.35, 'money'], expr: 'grin' }], [F.beer - 4, 'drink', { expr: 'laugh' }],
  [cut(9), 'salute', { expr: 'stern' }], [F.mistake - 6, 'grab', PULL_A], [F.mistake + 6, 'grab', PULL_B], [F.mistake + 20, 'hips', { expr: 'grin' }]];
const jamesKeys = [[0, 'idle'], [cut(1), 'wave', { mode: 'sit' }], [F.wooden - 4, 'pointDown', { mode: 'sit', expr: 'grin' }], [F.jack2 - 2, 'cheer', { mode: 'sit', hop: 0 }],
  [cut(3), 'grab', PULL_A], [cut(3) + 12, 'grab', PULL_B], [F.copying - 2, 'point', { expr: 'grin' }], [F.copying + 20, 'shock'], [F.copying + 34, 'clap'],
  [cut(7), 'cross', { expr: 'nervous' }], [F.instead - 2, 'clap'], [cut(8), 'cheer'], [F.beer, 'clap'], [cut(9), 'hips', { expr: 'grin' }]];
const ladyKeys = [[0, 'read'], [F.passenger - 2, 'read', { look: -0.3 }], [F.screamed - 4, 'panic'], [F.monkey - 2, 'pointL', { expr: 'shock' }], [F.monkey + 20, 'panic']];
const inspKeys = [[0, 'walk', { expr: 'stern' }], [F.fire - 4, 'pointL', { expr: 'stern' }], [F.fire + 14, 'cross'],
  [cut(7), 'pointUp', { expr: 'stern' }], [F.aced + 2, 'shock'], [F.instead + 4, 'clap'], [cut(8), 'hold', { R: [0.6, 0.0, 'money'], expr: 'grin' }], [F.twenty + 20, 'hips', { expr: 'grin' }], [F.beer, 'cheer']];

// ---------- shots ----------
const IN_JACK = [-4.2, 0.55, 0];
const S = X.shotList([
  { id: 'hook', f: 0, keys: [{ pos: [-1.6, 2.05, 1.0], look: [-4.2, 1.45, -0.05], fov: 40 }, { f: 75, pos: [-1.9, 2.0, 0.7], look: [-4.2, 1.45, 0], fov: 36 }] },
  { id: 'sema', f: 76, whip: false, keys: [{ pos: [-0.5, 3.2, -3.5], look: [-1.9, 5.0, -9], fov: 36 }, { pos: [-0.6, 3.3, -4.2], look: [-1.9, 5.0, -9], fov: 34 }] },
  { id: 'trolW', f: cut(1), keys: [{ pos: [0.7, 0.55, 2], look: [0, 0.9, 12], fov: 44 }, { pos: [0.6, 0.6, 1.5], look: [0, 0.9, 8], fov: 40 }] },
  { id: 'trolC', f: F.little - 4, whip: false, keys: [{ pos: [1.95, 1.15, 6.2], look: [0, 0.85, 3.6], fov: 40 }, { pos: [1.95, 1.1, 4.6], look: [0, 0.85, 2.3], fov: 40 }] },
  { id: 'legs', f: cut(2), whip: false, keys: [{ pos: [1.7, 0.65, 6.8], look: [0, 0.65, 2.8], fov: 30 }, { pos: [1.5, 0.65, 6.3], look: [0, 0.65, 2.7], fov: 28 }] },
  { id: 'trolF', f: F.jack2 - 4, whip: false, keys: [{ pos: [0.3, 1.2, 6.5], look: [0, 0.95, 2], fov: 40 }, { pos: [0.2, 1.1, 5.5], look: [0, 0.95, 1.8], fov: 38 }] },
  { id: 'cabin', f: cut(3), keys: [{ pos: [-5.2, 1.7, 3.4], look: [-4.1, 1.2, -0.6], fov: 44 }, { pos: [-5.0, 1.65, 3.0], look: [-4.1, 1.2, -0.6], fov: 42 }] },
  { id: 'copy', f: F.copying - 4, whip: false, keys: [{ pos: [-1.7, 1.6, 0.4], look: [-4.2, 1.25, -0.2], fov: 36 }, { pos: [-1.9, 1.55, 0.2], look: [-4.2, 1.25, -0.2], fov: 34 }] },
  { id: 'train', f: cut(4), keys: [{ pos: [1.6, 0.6, -14], look: [0, 1.8, 6], fov: 46 }, { pos: [1.7, 0.5, -15], look: [0, 1.8, 2], fov: 44 }] },
  { id: 'yank', f: F.whistled + 10, whip: false, keys: [{ pos: [-2.2, 2.0, 0.15], look: [-4.2, 1.4, 0.0], fov: 36 }, { pos: [-2.4, 1.95, 0.1], look: [-4.2, 1.4, 0.0], fov: 33 }] },
  { id: 'pass', f: F.lever4 + 2, keys: [{ pos: [-5, 1.6, -6], look: [0, 2.2, -12], fov: 50 }, { pos: [-5.2, 1.6, -5.4], look: [0, 2.4, -12], fov: 50 }] },
  { id: 'plat', f: cut(5), keys: [{ pos: [0.4, 1.7, -4.2], look: [3.6, 1.9, -0.6], fov: 40 }, { pos: [0.6, 1.75, -3.6], look: [3.6, 1.9, -0.6], fov: 38 }] },
  { id: 'scream', f: F.screamed - 4, whip: false, keys: [{ pos: [0.9, 1.9, 0.6], look: [3.6, 1.9, -0.8], fov: 34 }, { pos: [1.2, 1.9, 0.3], look: [3.6, 1.9, -0.8], fov: 32 }] },
  { id: 'monkey', f: F.monkey + 8, whip: false, keys: [{ pos: [2.8, 1.8, 2.6], look: [-4.0, 1.3, 0], fov: 30 }, { pos: [2.6, 1.8, 2.3], look: [-4.0, 1.3, 0], fov: 26 }] },
  { id: 'insp', f: cut(6), keys: [{ pos: [4.7, 2.0, 3.8], look: [4.3, 1.8, -3], fov: 40 }, { pos: [4.6, 2.0, 3.2], look: [4.3, 1.8, -2.4], fov: 38 }] },
  { id: 'jackfear', f: F.fire + 8, keys: [{ pos: [-5.0, 1.3, 1.6], look: [-4.2, 1.0, 0], fov: 36 }, { pos: [-4.9, 1.25, 1.4], look: [-4.2, 1.0, 0], fov: 32 }] },
  { id: 'test', f: cut(7), whip: false, keys: [{ pos: [-5.1, 1.75, 5.4], look: [-5.1, 1.15, -0.2], fov: 40 }, { pos: [-5.1, 1.7, 5.0], look: [-5.1, 1.15, -0.2], fov: 38 }] },
  { id: 'wow', f: F.aced + 4, whip: false, keys: [{ pos: [-5.0, 1.75, 2.2], look: [-6.0, 1.45, 0.2], fov: 36 }, { pos: [-5.1, 1.75, 2.0], look: [-6.0, 1.45, 0.2], fov: 33 }] },
  { id: 'hired', f: cut(8), keys: [{ pos: [-5.1, 1.7, 5.4], look: [-5.0, 1.2, 0.0], fov: 40 }, { pos: [-5.0, 1.65, 5.0], look: [-5.0, 1.2, 0.0], fov: 38 }] },
  { id: 'pay', f: F.twenty - 4, whip: false, keys: [{ pos: [-6.1, 1.35, 2.5], look: [-6.75, 0.9, 1.75], fov: 34 }, { pos: [-6.2, 1.3, 2.35], look: [-6.75, 0.9, 1.75], fov: 32 }] },
  { id: 'end', f: cut(9), keys: [{ pos: [-1.9, 2.0, 0.7], look: [-4.2, 1.45, 0], fov: 36 }, { pos: [-1.6, 2.05, 1.0], look: [-4.2, 1.45, -0.05], fov: 40 }] },
], TOTAL);
const KICKS = [{ f: F.yanked, a: 0.03 }, { f: F.screamed, a: 0.03 }, { f: F.fire, a: 0.03 }, { f: F.aced, a: 0.02 }];

const SHOWN = new Set();
const put = (rig, keys, seed, pos, extra = {}) => { const A = K.T.act(pos.f, keys, { seed, blink: blinkAt(pos.f, seed), ...extra }); rig.set(A, pos); SHOWN.add(rig); };

export default {
  TOTAL, build, look: 'rich',
  frame(f, k) {
    const { c: cam, s } = X.camAt(S, f, KICKS), id = s.id; SHOWN.clear();
    const inside = ['hook', 'cabin', 'copy', 'yank', 'jackfear', 'test', 'wow', 'hired', 'pay', 'end'].includes(id);
    const capOn = f >= cut(8);
    const jack = capOn ? JACKC : JACK, cr = capOn ? crJC : crJ;
    // levers: which lever is pulled when
    const leverAng = (i) => { let a = 0.25;
      const pullAt = (f0, f1) => { if (f >= f0 && f < f1) a = lerp(0.25, -0.45, M.back(ramp(f, f0, f0 + 6))); if (f >= f1) a = -0.45; };
      if (i === 1) pullAt(14, 9999); if (i === 2) pullAt(40, 9999); if (i === 4) pullAt(64, 9999);
      if (f >= cut(1) && i !== 3) a = 0.25; if (i === 2 && f > F.copying) a = lerp(0.25, -0.45, M.back(ramp(f, F.copying - 2, F.copying + 4)));
      if (i === 0 && f > cut(3) + 10 && f < F.copying) a = -0.45;
      if (i === 3) a = f >= F.yanked - 1 ? lerp(0.25, -0.5, M.back(ramp(f, F.yanked - 1, F.yanked + 5))) : 0.25;
      if (i === 5 && f >= F.aced - 2 && f < cut(9)) a = -0.45;
      if (f >= cut(9)) a = i % 2 ? lerp(0.25, -0.45, M.back(ramp(f, F.mistake + 4 + i, F.mistake + 10 + i))) : 0.25;
      return a; };
    levers.forEach((g, i) => { g.rotation.z = leverAng(i); });
    const semaDown = f < cut(1) ? M.back(ramp(f, 80, 92)) : (f >= F.lever4 && f < cut(5)) || f >= F.mistake ? M.back(ramp(f, f >= F.mistake ? F.mistake : F.lever4, (f >= F.mistake ? F.mistake : F.lever4) + 10)) : 0;
    sema.forEach(({ a, s: sg }) => { a.rotation.z = -sg * 0.7 * semaDown; });
    // train position along z (moves toward -z)
    let tz = 200;
    if (id === 'sema') tz = lerp(-6, -24, ramp(f, 76, cut(1)));
    if (id === 'train') tz = lerp(-2, -8, ramp(f, cut(4), F.whistled + 10));
    if (id === 'pass') tz = lerp(-6, -40, ramp(f, F.lever4 + 2, cut(5)));
    if (id === 'hook' || id === 'end') tz = 200;
    train.position.set(0, 0, tz); train.visible = tz < 150;
    // steam puffs from the chimney
    puffs.forEach((p, i) => { const age = ((f + i * 5) % 60) / 60; const born = f - age * 60;
      p.position.set((Math.sin(i * 2.1) * 0.3) * age * 3, 3.6 + age * 3.5, tz - 1.8 + age * 6); p.scale.setScalar(0.4 + age * 1.6); p.visible = train.visible && born > -1; });
    // trolley
    const tzT = id === 'trolW' ? lerp(12, 4.5, ramp(f, cut(1), F.little - 4)) : id === 'trolC' ? lerp(4.5, 2.6, ramp(f, F.little - 4, cut(2))) : id === 'legs' ? 2.6 - 0.2 * ramp(f, cut(2), F.jack2) : id === 'trolF' ? lerp(2.4, 0.6, ramp(f, F.jack2 - 4, cut(3))) : 200;
    trolley.position.set(0, 0, tzT); trolley.visible = tzT < 100;
    coins.visible = f >= F.twenty - 4; beer.visible = f < F.beer - 4 || f > cut(9);
    // characters
    if (['trolW', 'trolC', 'legs', 'trolF'].includes(id)) {
      put(JAMES, jamesKeys, 4, { f, x: 0, y: 0.4, z: tzT, seat: 0.45, yaw: 0 });
      put(jack, jackKeys, 9, { f, x: 0, y: 0.1, z: tzT - 0.95, yaw: 0 });
    }
    if (inside) {
      const jx = IN_JACK; put(jack, jackKeys, 9, { f, x: jx[0], y: jx[1], z: jx[2], yaw: id === 'hired' || id === 'pay' ? -0.9 : id === 'jackfear' ? 0.9 : Math.PI / 2 });
      if (['cabin', 'copy', 'test', 'wow', 'hired', 'end', 'yank'].includes(id)) put(JAMES, jamesKeys, 4, { f, x: id === 'cabin' || id === 'copy' ? -4.3 : -6.7, z: id === 'cabin' || id === 'copy' ? -1.25 : -1.1, yaw: id === 'cabin' || id === 'copy' ? Math.PI / 2 : 0.8 });
      if (['test', 'wow', 'hired', 'pay'].includes(id)) put(INSP, inspKeys, 6, { f, x: -6.0, z: 0.2, yaw: id === 'wow' ? 0.5 : 1.0 });
    }
    if (['plat', 'scream', 'monkey'].includes(id)) put(LADY, ladyKeys, 7, { f, x: 3.6, y: 0.9, z: -0.8, yaw: -Math.PI / 2 + (id === 'scream' ? -0.5 : 0) });
    if (id === 'monkey' || id === 'jackfear') put(jack, jackKeys, 9, { f, x: IN_JACK[0], y: IN_JACK[1], z: 0, yaw: id === 'monkey' ? Math.PI / 2 : 0.9 });
    if (id === 'insp') put(INSP, inspKeys, 6, { f, x: 4.3, y: 0.9, z: lerp(-5, -1.8, M.smooth(ramp(f, cut(6), F.fire - 4))), yaw: f < F.fire - 4 ? 0 : -1.2 });
    for (const r of [JACK, JACKC, JAMES, LADY, INSP]) if (!SHOWN.has(r)) r.root.visible = false;
    X.wagTail(cr, f, 0.3);
    // overlays
    const fx = [], push = (x) => x && fx.push(x);
    if (id === 'hook') push(X.wordCard(f, 50, '9 YEARS', cam, '#f6c83a', 1e9, 190, 0.6, 2.2));
    if (id === 'legs') push(X.wordCard(f, F.wooden, 'WOODEN LEGS', cam, '#ffffff', 1e9, 150, 0.62, 1.2));
    if (id === 'train') push(X.wordCard(f, F.whistled, 'TOOT x4', cam, '#f6c83a', 1e9, 200, 0.6, 2.2));
    if (id === 'yank') push(X.wordCard(f, F.lever4 - 2, 'LEVER 4!', cam, '#ffffff', 1e9, 200, 0.62, 2));
    if (id === 'monkey') push(X.wordCard(f, F.monkey + 8, 'A MONKEY?!', cam, '#ff5a3a', 1e9, 200, 0.62, 2.2));
    if (id === 'insp') push(X.wordCard(f, F.fire, 'FIRE HIM!', cam, '#ff5a3a', 1e9, 200, 0.62, 2.2));
    if (id === 'wow') push(X.wordCard(f, F.aced + 4, 'PASSED!', cam, '#9ad04a', 1e9, 200, 0.62, 2));
    if (id === 'pay') push(X.wordCard(f, F.twenty, '20 CENTS A DAY', cam, '#f6c83a', F.beer - F.twenty - 2, 170, 0.6, 0.7));
    if (id === 'pay') push(X.wordCard(f, F.beer, '+ BEER', cam, '#ffffff', 1e9, 210, 0.6, 0.7));
    if (id === 'end') push(X.wordCard(f, F.mistake, '0 MISTAKES', cam, '#9ad04a', 1e9, 190, 0.6, 2.2));
    // dof
    let dof = { focus: 10, cinf: 4 };
    const cl = { hook: [IN_JACK, 13], end: [IN_JACK, 13], copy: [IN_JACK, 13], yank: [[-4.2, 1, 0], 14], jackfear: [[-4.2, 1, 0], 14], wow: [[-6, 1.75, 0.2], 14], hired: [[-5.2, 1.1, 0], 10],
      pay: [[-6.75, 0.9, 1.75], 18], legs: [[0, 0.6, 2.6], 16], trolC: [[0, 0.9, 3.2], 10], trolF: [[0, 1, 1.8], 10], scream: [[3.6, 1.9, -0.8], 13], monkey: [[-4, 1.3, 0], 10], insp: [[4.3, 1.9, -2], 10], sema: [[-1.9, 5, -9], 8], cabin: [[-3.9, 1.2, -0.6], 10], test: [[-4.6, 1.2, 0], 8] };
    if (cl[id]) dof = X.focusOn(cam, cl[id][0], cl[id][1]);
    const light = inside ? IN : DAY;
    return { light, cam, dof, actors: [], fx, lampK: inside ? 1 : 0.6 };
  },
};
