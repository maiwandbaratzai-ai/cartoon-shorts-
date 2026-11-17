// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Wojtek the soldier bear" (64 s, TikTok): Iran 1942 cub → camp mascot (beer, trucks, showers, the spy) →
// enlisted as a private → carries shell crates at Monte Cassino → badge → retires to a Scottish zoo.
import { TOTAL, LINES, wf } from './wojtek_timing.js';
import * as PR from '../props.js';
import * as X from './kit3d.js';
import { blinkAt } from '../motion.js';
const { M, clamp, ramp, lerp, q } = X;

export { TOTAL };
const L = LINES, cut = (i) => Math.max(0, L[i][0] - 4), W = wf;
let K, BEAR, CUB, SOL1, SOL2, BOY, SPY, OFFI, OLD1, OLD2, crB, crC, bottle, milk, choc, truck, crates = [], water, badgeP, flag, emblemT, smoke = [], treat, ship;

const FUR = '#7a5236';
const BEAR_O = { jacket: FUR, pants: '#6a4630', boots: '#3a2618', skin: '#c89a70', build: 'stout', hat: 'cap', cap: '#6a6a3a' };
const CUB_O = { jacket: FUR, pants: '#6a4630', boots: '#3a2618', skin: '#c89a70', build: 'kid' };
const SOL1_O = { jacket: '#7a7a4a', pants: '#5a5a38', boots: '#2a2018', hat: 'cap', cap: '#5a5a32', moustache: '#4a2e1e', skin: '#f2cfae' };
const SOL2_O = { jacket: '#8a845a', pants: '#5a5a38', boots: '#2a2018', hat: 'cap', cap: '#6a6a3a', skin: '#e8b890' };
const BOY_O = { jacket: '#d8c8a0', pants: '#8a6a4a', boots: '#5a3a22', hat: 'cap', cap: '#c8483a', skin: '#d8a880', build: 'kid' };
const SPY_O = { jacket: '#2e2e38', pants: '#22222a', boots: '#18161a', hat: 'hair', hair: '#1e1a18', moustache: '#1e1a18', skin: '#e8c4a4' };
const OFFI_O = { jacket: '#1e2a4a', pants: '#1e2a4a', boots: '#18161a', hat: 'cap', cap: '#f2f0ea', moustache: '#8a8a8a', skin: '#f5d6bc', build: 'stout' };
const OLD1_O = { jacket: '#5a6a4a', pants: '#3a3a30', boots: '#2a2018', hat: 'hair', hair: '#d8d8d8', moustache: '#e8e8e8', skin: '#f2cfae' };
const OLD2_O = { jacket: '#6a5a4a', pants: '#3a3a3a', boots: '#2a2018', hat: 'cap', cap: '#4a4a3a', skin: '#e8c0a0' };

const DESERT = { az: 220, el: 32, sky: '#f0e4d0', ground: '#b89868', hemi: 0.95, sun: '#fff0d0', sunI: 3.0, fog: '#f0dcc0', fogNear: 40, fogFar: 320,
  skyTop: '#4a86d0', skyHor: '#f4e0c0', sat: 1.12, vig: 0.24, shadowExt: 14, exposure: 1.06, ink: 0.55 };
const NIGHT = { ...DESERT, az: 60, el: 40, sky: '#4a5a8a', ground: '#2a2a3a', hemi: 0.55, sun: '#a8c0ff', sunI: 0.8, fog: '#1a2238', fogNear: 20, fogFar: 120,
  skyTop: '#0a1028', skyHor: '#2a3a68', exposure: 1.2, bloom: 0.6, vig: 0.36, cardTint: '#e8ecff' };
const CASSINO = { ...DESERT, az: 200, el: 22, sky: '#c8c4b8', ground: '#7a7060', hemi: 0.85, sun: '#ffe0b0', sunI: 2.4, fog: '#b8b0a4', fogNear: 25, fogFar: 200,
  skyTop: '#6a7a98', skyHor: '#d8c8b0', sat: 1.04, exposure: 1.1 };
const SCOT = { ...DESERT, az: 150, el: 30, sky: '#d8e0e8', ground: '#5a7a4a', sun: '#fff4e4', sunI: 2.2, fog: '#d0dae0', fogNear: 30, fogFar: 220, skyTop: '#6a8ab8', skyHor: '#e4eaee', sat: 1.08 };
const PORT = { ...DESERT, az: 160, el: 28, skyTop: '#3a7ad0', skyHor: '#e0ecf4', fog: '#d8e6ee' };

function emblem() { return PR.canvasTex(256, 256, (g) => { g.fillStyle = '#e8d8a8'; g.beginPath(); g.arc(128, 128, 120, 0, 7); g.fill(); g.lineWidth = 10; g.strokeStyle = '#3a2a1a'; g.stroke();
  g.fillStyle = '#5a3a22'; g.beginPath(); g.ellipse(128, 160, 44, 56, 0, 0, 7); g.fill(); g.beginPath(); g.arc(128, 90, 30, 0, 7); g.fill(); g.beginPath(); g.arc(106, 66, 11, 0, 7); g.arc(150, 66, 11, 0, 7); g.fill();
  g.save(); g.translate(150, 120); g.rotate(-0.7); g.fillStyle = '#a8a8a0'; g.fillRect(-12, -46, 24, 80); g.fillStyle = '#c89a3a'; g.beginPath(); g.ellipse(0, -46, 12, 20, 0, Math.PI, 0); g.fill(); g.restore(); }); }

function build(k) {
  K = k; X.init(K); const { THREE } = K; const r = X.rnd(1942);
  const sand = K.mat('dirt', '#c8a878', { detail: 1.5, amt: 0.35 }), canvas = K.mat('fabric', '#a8a070', { amt: 0.3 }), wood = K.mat('wood', '#8a6038'), dark = K.mat('wood', '#5a3e28'),
    olive = K.mat('metal', '#5a6040', { roughness: 0.6 }), rock = K.mat('rock', '#8a8070', { detail: 1.5, bump: 0.05 }), grass = K.mat('dirt', '#5a8a3a', { detail: 1.2, amt: 0.4 });
  emblemT = emblem();
  // ---- camp (x 0)
  K.slab(-40, 40, -0.1, 0, -40, 40, sand, K.scene, false);
  const tent = (x, z, ry, s = 1) => { const g = K.group(); g.position.set(x, 0, z); g.rotation.y = ry; const t = K.add(new THREE.CylinderGeometry(0.01, 2.2 * s, 2.4 * s, 4, 1).rotateY(Math.PI / 4), canvas, 0, 1.2 * s, 0, g); t.scale.set(1.3, 1, 1); K.slab(-0.5 * s, 0.5 * s, 0, 1.4 * s, 1.5 * s, 1.52 * s, K.mat('fabric', '#2a2418', { plain: true }), g); return g; };
  tent(-4, -4, 0.2); tent(3.5, -5, -0.3); tent(-8, 2, 0.8); tent(7, 3, -0.6, 1.1); tent(0, -11, 0);
  const tr = PR.oldTruck(K, '#5a6040'); truck = tr.root; truck.position.set(-2, 0, 4.2); truck.rotation.y = 0.0;
  X.sign(0.7, 0.7, emblemT, 0.7, 1.5, 0.93, 0, truck); // door emblem
  for (let i = 0; i < 6; i++) { const c = PR.crate(K, ['RATIONS', 'FRUIT', 'AMMO', 'TEA', 'FRUIT', 'MAIL'][i], ['#7a6a3a', '#8a5a2a', '#5a5a3a'][i % 3], K.scene, [0.7, 0.5, 0.5]); c.position.set(4 + (i % 3) * 0.75, (i > 2 ? 0.5 : 0), -1.2); }
  for (let i = 0; i < 14; i++) K.add(new THREE.SphereGeometry(0.06, 10, 8), K.toon({ color: ['#e8a030', '#d84a2a', '#8ab040'][i % 3], plain: true }), 4.0 + (i % 5) * 0.28, 1.06, -1.0 + Math.floor(i / 5) * 0.12);
  for (let i = 0; i < 8; i++) K.cyl(0.25, 0.28, 0.85, olive, -6 + (i % 4) * 0.6, 0, -1 + Math.floor(i / 4) * 0.6);
  K.cyl(0.05, 0.05, 6, wood, 2, 0, 2); flag = K.add(new THREE.PlaneGeometry(1.4, 0.9, 8, 1), K.toon({ map: emblemT, plain: true }), 2.72, 5.4, 2, K.scene, { cast: false }); flag.material.side = THREE.DoubleSide;
  // fire pit + lamp
  for (let i = 0; i < 8; i++) K.add(new THREE.DodecahedronGeometry(0.15, 0), rock, 1 + Math.cos(i) * 0.5, 0.05, 6 + Math.sin(i) * 0.5);
  K.lamp(1, 0.5, 6, { color: '#ff9a40', intensity: 2.0, distance: 7, glowS: 0.6, flicker: 0.2 });
  // bath house with shower at (-12, 0, -6)
  const bh = K.group(); bh.position.set(-12, 0, -6); K.slab(-2, 2, 0, 0.1, -2, 2, K.mat('rock', '#a8a8a0', { detail: 0.4 }), bh);
  K.slab(-2, 2, 0, 2.8, -2.1, -2, K.mat('wood', '#9a7a52'), bh); K.slab(-2.1, -2, 0, 2.8, -2, 2, K.mat('wood', '#9a7a52'), bh); K.slab(-2.2, 2.2, 2.8, 2.95, -2.2, 2.2, K.mat('metal', '#7a7a76'), bh);
  K.cyl(0.03, 0.03, 2.3, K.mat('metal', '#8a8a8a'), 0, 0, -1.8, bh); K.slab(-0.03, 0.03, 2.3, 2.34, -1.8, -0.9, K.mat('metal', '#8a8a8a'), bh); K.cyl(0.14, 0.08, 0.1, K.mat('metal', '#9a9a9a'), 0, 2.2, -0.9, bh);
  K.cyl(0.05, 0.05, 0.08, K.mat('metal', '#c83a2a'), 0.15, 1.6, -1.95, bh);
  for (let i = 0; i < 3; i++) K.cyl(0.32, 0.32, 0.9, wood, 1.3, 0, -1.5 + i * 0.7, bh);
  K.slab(-1.8, -1.2, 0.8, 1.6, -1.98, -1.9, K.mat('fabric', '#e8e4d8', { plain: true }), bh);
  water = K.group(bh); water.position.set(0, 2.15, -0.9); for (let i = 0; i < 14; i++) { const w = K.add(new THREE.CylinderGeometry(0.006, 0.006, 2.1, 4), K.toon({ color: '#bfe4ff', plain: true, emissive: '#5a8ab0' }), Math.cos(i) * 0.08 * (i % 3), -1.05, Math.sin(i) * 0.08 * (i % 3), water, { cast: false }); }
  K.lamp(-12, 2.4, -6.5, { color: '#ffc070', intensity: 1.6, distance: 6, glowS: 0.35 });
  // props: bottle, milk bottle, chocolate, treat
  bottle = K.group(); K.cyl(0.035, 0.04, 0.2, K.toon({ color: '#5a3a12', plain: true, roughness: 0.25 }), 0, -0.12, 0, bottle); K.cyl(0.013, 0.02, 0.08, K.toon({ color: '#5a3a12', plain: true }), 0, 0.08, 0, bottle);
  milk = K.group(); K.cyl(0.04, 0.045, 0.22, K.toon({ color: '#e8f0f0', plain: true, roughness: 0.2, transparent: true, opacity: 0.85 }), 0, -0.12, 0, milk); K.cyl(0.035, 0.04, 0.12, K.toon({ color: '#ffffff', plain: true }), 0, -0.12, 0, milk); K.cyl(0.014, 0.02, 0.07, K.toon({ color: '#e8f0f0', plain: true }), 0, 0.1, 0, milk);
  choc = K.group(); K.slab(-0.06, 0.06, -0.01, 0.01, -0.11, 0.11, K.toon({ color: '#6a3a1a', plain: true }), choc); K.slab(-0.062, 0.062, -0.012, 0.012, -0.05, 0.11, K.toon({ color: '#c83a2a', plain: true }), choc);
  treat = K.add(new THREE.SphereGeometry(0.07, 12, 8), K.toon({ color: '#d84a2a', plain: true }), 0, -50, 0);
  // ---- port at x=80
  const pt = K.group(); pt.position.set(80, 0, 0);
  K.slab(-20, 20, -0.1, 0.4, -6, 20, K.mat('rock', '#9a9a94', { detail: 0.8 }), pt, false);
  const sea = K.add(new THREE.PlaneGeometry(300, 200), K.toon({ color: '#3a7aa8', plain: true, roughness: 0.15 }), 0, -0.3, -100, pt, { cast: false }); sea.rotation.x = -Math.PI / 2;
  ship = K.group(pt); ship.position.set(0, 0, -11); K.slab(-14, 14, -2, 4, -4, 4, K.mat('metal', '#3a3e48', { roughness: 0.5 }), ship); K.slab(-14, 14, 3.6, 4.0, -4, 4, K.mat('metal', '#a83a2a'), ship);
  K.slab(-4, 4, 4, 8, -3, 3, K.mat('plaster', '#e8e8e0'), ship); K.cyl(0.9, 1.0, 4, K.mat('metal', '#c8a040'), 0, 8, 0, ship);
  for (let i = 0; i < 10; i++) K.cyl(0.25, 0.25, 0.04, K.toon({ color: '#1a1a1a', plain: true }), -12 + i * 2.6, 2.4, 4.01, ship).rotation.x = Math.PI / 2;
  const plank = K.slab(-0.5, 0.5, 0, 0.08, 0, 6, wood, pt); plank.position.set(0, 1.9, -4.6); plank.rotation.x = 0.55;
  X.sign(1.6, 1.0, X.txtTex(512, 320, '#f2ece0', '#b82a2a', ['NO PETS', 'ALLOWED'], 'bold 96px Arial'), 1.6, 1.6, -1.0, 0, pt);
  K.cyl(0.05, 0.05, 1.2, dark, 1.0, 0.4, -1.05, pt); K.cyl(0.05, 0.05, 1.2, dark, 2.2, 0.4, -1.05, pt);
  for (let i = 0; i < 4; i++) { const c = PR.crate(K, 'CARGO', '#6a5a3a', pt, [0.9, 0.7, 0.7]); c.position.set(-3 + i * 0.95, 0.4, 0.5); }
  K.cyl(0.25, 0.3, 0.6, K.mat('metal', '#2a2a2e'), 4, 0.4, -1.5, pt);
  const desk = K.group(pt); desk.position.set(-1.6, 0.4, 2.0); K.slab(-0.7, 0.7, 0.72, 0.78, -0.4, 0.4, wood, desk); for (const [a, b] of [[-0.6, -0.3], [0.6, -0.3], [-0.6, 0.3], [0.6, 0.3]]) K.slab(a - 0.03, a + 0.03, 0, 0.72, b - 0.03, b + 0.03, dark, desk);
  const form = K.add(new THREE.PlaneGeometry(0.34, 0.44), K.toon({ map: X.txtTex(256, 330, '#f6f0e0', '#2a2a2a', ['ENLISTED', 'PTE. WOJTEK', 'No. 1'], 'bold 34px Georgia'), plain: true }), 0.1, 0.785, 0.05, desk, { cast: false }); form.rotation.x = -Math.PI / 2;
  // ---- Monte Cassino at x=-80
  const mc = K.group(); mc.position.set(-80, 0, 0);
  K.slab(-60, 60, -0.1, 0, -60, 40, K.mat('dirt', '#8a7a62', { detail: 1.2 }), mc, false);
  for (let i = 0; i < 40; i++) K.add(new THREE.DodecahedronGeometry(0.3 + r() * 1.2, 1), rock, (r() - 0.5) * 50, 0, -6 - r() * 30, mc).scale.set(1, 0.6, 1);
  const hill = K.add(new THREE.SphereGeometry(30, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), K.mat('rock', '#8a8070', { detail: 6, bump: 0.2 }), 0, -12, -70, mc); hill.scale.y = 1.1;
  const abbey = K.group(mc); abbey.position.set(0, 20, -66); K.slab(-10, 10, 0, 4, -4, 4, K.mat('plaster', '#d8d0c0'), abbey); K.slab(-3, 3, 4, 8, -2, 2, K.mat('plaster', '#c8c0b0'), abbey);
  const gun = K.group(mc); gun.position.set(3.0, 0, -3.5); gun.rotation.y = -0.6; K.slab(-0.9, 0.9, 0.2, 0.6, -0.9, 0.9, olive, gun); const barrel = K.cyl(0.12, 0.16, 3.2, olive, 0, 0.6, 0, gun); barrel.rotation.x = -1.2; barrel.position.set(0, 0.9, -0.6);
  for (const s of [-1, 1]) K.add(new THREE.CylinderGeometry(0.55, 0.55, 0.15, 18).rotateZ(Math.PI / 2), K.mat('metal', '#2a2a2a'), s * 1.0, 0.55, 0.2, gun);
  for (let i = 0; i < 12; i++) { const c = PR.crate(K, 'SHELLS', '#6a5a32', mc, [0.6, 0.38, 0.45]); c.position.set(-2.4 + (i % 4) * 0.62, Math.floor(i / 4) * 0.38, -2.4); crates.push(c); }
  for (let i = 0; i < 6; i++) { const sb = K.cyl(0.35, 0.35, 0.3, K.mat('fabric', '#a89870'), -4 + i * 0.7, 0, 1.2, mc); }
  for (let i = 0; i < 10; i++) { const s = K.add(new THREE.SphereGeometry(2 + r() * 2, 12, 8), K.toon({ color: '#c8c0b4', plain: true, transparent: true, opacity: 0.55 }), -30 + r() * 60, 3 + r() * 8, -30 - r() * 20, mc, { cast: false }); smoke.push(s); }
  // ---- Scottish zoo at x=160
  const zo = K.group(); zo.position.set(160, 0, 0);
  K.slab(-50, 50, -0.1, 0, -50, 50, grass, zo, false);
  for (let i = 0; i < 6; i++) K.add(new THREE.DodecahedronGeometry(0.8 + r() * 0.8, 1), K.mat('rock', '#9a9a90', { detail: 1.2 }), -3 + i * 1.3, 0.2, -4 - (i % 2), zo).scale.set(1, 0.6, 1);
  const pool = K.add(new THREE.CircleGeometry(1.6, 32), K.toon({ color: '#4a7a9a', plain: true, roughness: 0.15 }), 2.6, 0.03, -2.2, zo, { cast: false }); pool.rotation.x = -Math.PI / 2;
  for (let x = -6; x <= 6; x += 0.25) K.cyl(0.025, 0.025, 1.3, K.mat('metal', '#2a2a2e'), x, 0, 2.0, zo);
  K.slab(-6, 6, 1.25, 1.32, 1.97, 2.03, K.mat('metal', '#2a2a2e'), zo);
  X.sign(2.4, 0.7, X.txtTex(768, 220, '#2a4a2a', '#f2e8c8', ['WOJTEK', 'THE SOLDIER BEAR'], 'bold 70px Georgia'), -3.4, 1.9, 2.1, 0, zo); K.cyl(0.05, 0.05, 1.6, dark, -4.4, 0, 2.1, zo); K.cyl(0.05, 0.05, 1.6, dark, -2.4, 0, 2.1, zo);
  const bark = K.mat('wood', '#5a4a3a'), leaf = K.mat('grime', '#3a6a3a', { amt: 0.6 });
  for (let i = 0; i < 18; i++) X.tree((r() - 0.5) * 50, -10 - r() * 25, 2 + r() * 1.5, bark, leaf, zo, r);
  for (let i = 0; i < 5; i++) { const b = K.slab(-10 + i * 4.5, -6 + i * 4.5, 0, 6 + i % 2, -40, -36, K.mat('rock', '#8a8a86', { detail: 0.8 }), zo); }
  K.addClouds(10, 700, 160);
  // badge patch (insert)
  badgeP = K.group(); badgeP.position.set(0, 1.4, 20); K.slab(-0.6, 0.6, -0.7, 0.7, -0.05, 0, K.mat('fabric', '#6a6a3a', { amt: 0.3 }), badgeP); K.add(new THREE.CircleGeometry(0.42, 40), K.toon({ map: emblemT, plain: true }), 0, 0, 0.01, badgeP, { cast: false });
  // characters
  BEAR = K.stick(BEAR_O, { key: 'bear' }); crB = X.critter(BEAR, 'bear', FUR, '#d8b088'); BEAR.root.userData.base = 1.25;
  CUB = K.stick(CUB_O, { key: 'cub' }); crC = X.critter(CUB, 'bear', FUR, '#d8b088'); CUB.root.userData.base = 0.45;
  SOL1 = K.stick(SOL1_O, { key: 's1' }); { const pt = K.add(new THREE.CircleGeometry(0.075, 24), K.toon({ map: emblemT, plain: true }), 0.09, 0.36, 0.175, SOL1.body, { cast: false }); pt.rotation.y = 0.45; } SOL2 = K.stick(SOL2_O, { key: 's2' }); BOY = K.stick(BOY_O, { key: 'boy' }); SPY = K.stick(SPY_O, { key: 'spy' });
  OFFI = K.stick(OFFI_O, { key: 'off' }); OLD1 = K.stick(OLD1_O, { key: 'o1' }); OLD2 = K.stick(OLD2_O, { key: 'o2' });
}

const F = { promoted: W(0, 'promoted'), beer: W(1, 'beer'), bottle: W(1, 'bottle'), rode: W(1, 'rode'), trucks: W(1, 'trucks'), iran: W(2, 'iran'), swapped: W(2, 'swapped'), choc: W(2, 'chocolate'), cub: W(2, 'cub'),
  fed: W(3, 'fed'), milk: W(3, 'milk'), vodka: W(3, 'vodka'), curled: W(4, 'curled'), dog: W(4, 'dog'), grew: W(5, 'grew'), taller: W(5, 'taller'), raided: W(6, 'raided'), fruit: W(6, 'fruit'), wrestled: W(6, 'wrestled'),
  showers: W(7, 'showers'), turn: W(7, 'turn'), found: W(8, 'found'), spy: W(8, 'spy'), bath: W(8, 'bath'), roared: W(9, 'roared'), screamed: W(9, 'screamed'), grabbed: W(9, 'grabbed'),
  ship: W(10, 'ship'), no: W(10, 'no'), enlisted: W(11, 'enlisted'), private: W(11, 'private'), rank: W(11, 'rank'), number: W(11, 'number'), craziest: W(12, 'craziest'),
  monte: W(13, 'monte'), watched: W(13, 'watched'), carry: W(13, 'carry'), crates: W(13, 'crates'), grab14: W(14, 'grabbed'), another1: W(14, 'another'), never: W(15, 'never'), dropped: W(15, 'dropped'),
  badge: W(16, 'badge'), bear16: W(16, 'bear'), trucks17: W(17, 'trucks'), flags: W(17, 'flags'), jackets: W(17, 'jackets'), retired: W(18, 'retired'), zoo: W(18, 'zoo'), old: W(19, 'old'),
  chatted: W(19, 'chatted'), tossed: W(19, 'tossed'), treats: W(19, 'treats'), corporal: W(20, 'corporal'), follow: W(21, 'follow') };
const AN2 = 1346; // second "another"
const bearKeys = [[0, 'carry', { expr: 'grin' }], [F.promoted - 4, 'salute', { expr: 'grin' }],
  [cut(1), 'drink', { R: [-0.3, -0.48, 'open', true], expr: 'laugh' }], [F.rode - 4, 'wave', { mode: 'sit', expr: 'laugh' }],
  [cut(5), 'idle', { expr: 'smile' }], [F.taller - 4, 'hips', { expr: 'grin' }], [cut(6), 'sneak'], [F.fruit - 2, 'eat', { expr: 'grin' }], [F.wrestled - 4, 'grab', { expr: 'laugh' }], [F.wrestled + 20, 'cheer'],
  [cut(7), 'reach', { R: [0.25, -0.95, 'fist'], expr: 'grin' }], [F.turn, 'celebrate'], [F.turn + 20, 'clap', { expr: 'laugh' }],
  [cut(8), 'sneak', { expr: 'neutral' }], [F.spy - 2, 'shock'], [cut(9), 'angry', { L: [0.5, -0.6, 'open'], R: [0.5, -0.6, 'open'], expr: 'shock' }], [F.grabbed - 2, 'hips', { expr: 'grin' }],
  [cut(10), 'idle', { expr: 'nervous' }], [F.no - 2, 'shrug'], [cut(11), 'salute', { expr: 'stern' }], [F.rank, 'hips', { expr: 'grin' }],
  [cut(12), 'idle', { expr: 'stern' }], [cut(13), 'think'], [F.carry, 'pointL', { expr: 'neutral' }], [cut(14), 'reach'], [F.grab14 - 4, 'carry', { expr: 'grin' }],
  [cut(15), 'carry', { expr: 'stern', mode: 'march' }], [F.dropped, 'carry', { expr: 'grin', mode: 'march' }],
  [cut(16), 'salute', { expr: 'grin' }], [cut(18), 'sit', { expr: 'smile' }], [F.chatted - 4, 'wave', { mode: 'sit', expr: 'smile' }], [F.tossed + 6, 'reach', { expr: 'laugh', hop: 0.2 }], [F.treats + 6, 'eat', { expr: 'grin' }],
  [cut(20), 'salute', { expr: 'stern' }], [F.corporal, 'salute', { expr: 'grin' }], [cut(21), 'wave', { expr: 'laugh' }], [F.follow + 20, 'pointUp', { expr: 'grin' }]];
const cubKeys = [[0, 'idle', { expr: 'nervous' }], [F.choc - 4, 'shock'], [F.cub - 2, 'cheer'], [cut(3), 'drink', { R: [-0.3, -0.48, 'open', true], expr: 'smile' }], [F.vodka, 'laugh' in {} ? 'clap' : 'clap'],
  [cut(4), 'crouch', { expr: 'neutral', blink: 1 }]];
const sol1Keys = [[0, 'cheer', { expr: 'laugh' }], [F.promoted - 2, 'salute', { expr: 'grin' }], [cut(1), 'clap', { expr: 'laugh' }], [cut(2), 'walk'], [F.swapped - 4, 'show', { R: [0.6, -0.1, 'open'], expr: 'grin' }],
  [F.cub, 'clap'], [cut(3), 'hold', { R: [0.3, 0.1, 'open'], expr: 'smile' }], [cut(4), 'fall', { expr: 'neutral' }], [cut(5), 'idle'], [F.taller - 3, 'shock'], [F.taller + 12, 'scared'],
  [cut(6), 'idle'], [F.wrestled - 4, 'grab', { expr: 'stern' }], [F.wrestled + 14, 'fall'], [cut(9), 'run', { expr: 'shock' }], [F.grabbed - 4, 'grab', { expr: 'stern' }],
  [cut(11), 'salute'], [cut(13), 'carry', { expr: 'stern', mode: 'march' }], [cut(14), 'shock'], [F.another1, 'clap', { expr: 'laugh' }], [cut(16), 'salute']];
const sol2Keys = [[0, 'cheer'], [cut(2), 'walk'], [F.swapped, 'pointL', { expr: 'grin' }], [cut(4), 'fall', { expr: 'neutral' }], [cut(9), 'run', { expr: 'shock' }], [F.grabbed - 2, 'grab', { expr: 'stern' }],
  [cut(13), 'carry', { expr: 'stern', mode: 'march' }], [cut(14), 'shock'], [AN2, 'cheer']];
const boyKeys = [[0, 'idle'], [cut(2), 'hold', { R: [0.3, 0.3, 'open'], expr: 'neutral' }], [F.swapped, 'reach', { expr: 'grin' }], [F.choc + 6, 'eat', { expr: 'laugh' }]];
const spyKeys = [[0, 'scared'], [F.spy - 2, 'scared', { expr: 'shock' }], [cut(9), 'panic'], [F.screamed - 2, 'run', { expr: 'shock' }], [F.grabbed, 'panic']];
const offiKeys = [[0, 'stop', { expr: 'stern' }], [F.no - 3, 'stop', { expr: 'stern' }], [F.no + 10, 'cross'], [cut(11), 'write'], [F.private - 4, 'hammer', { expr: 'grin' }], [F.rank, 'salute', { expr: 'grin' }]];
const oldKeys = [[0, 'idle'], [F.old - 4, 'wave', { expr: 'smile' }], [F.chatted, 'point', { expr: 'laugh' }], [F.tossed - 6, 'throwBack', { expr: 'grin' }], [F.tossed, 'throw', { expr: 'grin' }], [F.treats + 6, 'clap', { expr: 'laugh' }]];

// shots
const C = (pos, look, fov, f) => ({ pos, look, fov, ...(f !== undefined ? { f } : {}) });
const S = X.shotList([
  { id: 'hook', f: 0, keys: [C([-77.4, 1.6, 3.4], [-79.6, 1.4, -0.4], 42), C([-77.6, 1.55, 2.9], [-79.6, 1.4, -0.4], 39)] },
  { id: 'promo', f: F.promoted - 6, whip: false, keys: [C([-79.0, 2.0, 2.0], [-79.6, 1.95, -0.4], 36), C([-79.05, 2.0, 1.8], [-79.6, 1.95, -0.4], 33)] },
  { id: 'beer', f: cut(1), keys: [C([1.8, 2.0, 7.6], [0.6, 1.8, 5.2], 38), C([1.7, 1.95, 7.3], [0.6, 1.8, 5.2], 35)] },
  { id: 'truck', f: F.rode - 6, keys: [C([0.5, 2.4, 11.5], [-4.2, 1.4, 4.2], 42), C([-0.5, 2.4, 11.0], [-6.8, 1.4, 4.2], 42)] },
  { id: 'iran', f: cut(2), keys: [C([-5, 1.8, 15], [-6.5, 1.2, 9], 44), C([-5.3, 1.7, 14], [-6.5, 1.2, 9], 42)] },
  { id: 'swap', f: F.swapped - 4, whip: false, keys: [C([-5.2, 1.3, 11.4], [-6.6, 1.0, 9.0], 38), C([-5.3, 1.25, 11.1], [-6.6, 1.0, 9.0], 35)] },
  { id: 'cubCU', f: F.cub - 4, whip: false, keys: [C([-6.3, 0.95, 11.8], [-6.8, 0.6, 9.6], 36), C([-6.35, 0.92, 11.6], [-6.8, 0.6, 9.6], 33)] },
  { id: 'milk', f: cut(3), keys: [C([2.6, 1.0, 8.6], [1.4, 0.75, 6.6], 38), C([2.5, 0.95, 8.3], [1.4, 0.75, 6.6], 34)] },
  { id: 'night', f: cut(4), keys: [C([3.2, 1.6, 9.2], [1.2, 0.3, 6.6], 42), C([2.9, 1.4, 8.6], [1.2, 0.3, 6.6], 38)] },
  { id: 'grow', f: cut(5), keys: [C([-0.2, 0.6, 9.6], [0.4, 1.4, 6.6], 46), C([0.2, 0.55, 10.0], [0.4, 1.8, 6.6], 48)] },
  { id: 'fruit', f: cut(6), keys: [C([5.6, 1.5, 1.8], [4.6, 1.1, -0.6], 40), C([5.4, 1.45, 1.5], [4.6, 1.1, -0.6], 37)] },
  { id: 'wrestle', f: F.wrestled - 6, keys: [C([2.6, 1.3, 4.4], [1.0, 1.0, 1.0], 44), C([2.3, 1.2, 4.0], [1.0, 1.0, 1.0], 42)] },
  { id: 'shower', f: cut(7), keys: [C([-11.2, 1.6, -3.0], [-12, 1.5, -6.9], 42), C([-11.4, 1.6, -3.4], [-12, 1.5, -6.9], 40)] },
  { id: 'tap', f: F.turn - 6, whip: false, keys: [C([-11.6, 2.2, -5.6], [-12, 2.15, -6.9], 40), C([-11.7, 2.2, -5.8], [-12, 2.15, -6.9], 36)] },
  { id: 'spy', f: cut(8), keys: [C([-10.4, 1.5, -2.8], [-12.4, 0.9, -7.0], 40), C([-10.5, 1.45, -3.1], [-12.4, 0.9, -7.0], 37)] },
  { id: 'roar', f: cut(9), keys: [C([-11.0, 1.9, -3.6], [-11.4, 1.7, -6.0], 36), C([-11.05, 1.9, -3.8], [-11.4, 1.7, -6.0], 33)] },
  { id: 'grabspy', f: F.screamed - 4, whip: false, keys: [C([-8.0, 2.3, 1.4], [-10.8, 1.0, -4.6], 46), C([-8.2, 2.2, 1.0], [-10.8, 1.0, -4.6], 44)] },
  { id: 'ship', f: cut(10), keys: [C([82.2, 2.4, 6.0], [80.4, 3.0, -6], 46), C([81.8, 2.2, 5.4], [80.8, 2.0, -1.0], 42)] },
  { id: 'nopets', f: F.no - 4, whip: false, keys: [C([81.2, 1.7, 1.6], [81.4, 1.5, -1.0], 40), C([81.2, 1.7, 1.4], [81.4, 1.5, -1.0], 36)] },
  { id: 'enlist', f: cut(11), keys: [C([78.2, 2.2, 5.6], [79.0, 1.4, 2.0], 44), C([78.4, 2.1, 5.2], [79.0, 1.4, 2.0], 42)] },
  { id: 'form', f: F.private - 4, whip: false, keys: [C([78.5, 1.85, 2.5], [78.5, 1.18, 2.0], 40), C([78.5, 1.8, 2.42], [78.5, 1.18, 2.0], 36)] },
  { id: 'salute', f: F.rank - 2, whip: false, keys: [C([79.2, 2.2, 5.2], [80.2, 1.9, 1.5], 38), C([79.3, 2.15, 4.9], [80.2, 1.9, 1.5], 35)] },
  { id: 'rehook', f: cut(12), keys: [C([-76, 3.5, 12], [-80, 4, -30], 46), C([-78, 2.6, 6], [-80, 2.4, -20], 44)] },
  { id: 'watch', f: cut(13), keys: [C([-77.2, 1.6, 2.4], [-79.0, 1.3, -1.4], 44), C([-77.4, 1.55, 2.0], [-79.0, 1.3, -1.4], 42)] },
  { id: 'bearCU', f: F.carry - 4, whip: false, keys: [C([-80.5, 1.85, 1.7], [-80.0, 1.65, -0.6], 36), C([-80.55, 1.85, 1.55], [-80.0, 1.65, -0.6], 33)] },
  { id: 'grab', f: cut(14), keys: [C([-78.0, 1.8, 2.6], [-80.6, 1.4, -2.0], 42), C([-78.2, 1.75, 2.2], [-80.6, 1.4, -2.0], 40)] },
  { id: 'another', f: F.another1 - 4, whip: false, keys: [C([-82.8, 1.5, 1.4], [-80.0, 1.4, -0.6], 44), C([-82.6, 1.5, 1.2], [-79.8, 1.4, -0.6], 42)] },
  { id: 'another2', f: AN2 - 4, whip: false, keys: [C([-79.0, 1.9, 2.4], [-80.0, 1.45, -0.6], 42), C([-79.1, 1.85, 2.15], [-80.0, 1.45, -0.6], 40)] },
  { id: 'slowmo', f: cut(15), keys: [C([-77.0, 0.6, 1.8], [-79.0, 1.6, -0.5], 40), C([-77.4, 0.6, 1.4], [-80.0, 1.6, -0.5], 38)] },
  { id: 'badge', f: cut(16), keys: [C([0, 1.4, 21.8], [0, 1.4, 20], 40), C([0, 1.4, 21.5], [0, 1.4, 20], 36)] },
  { id: 'truckE', f: cut(17), keys: [C([0.4, 1.8, 9.0], [-1.3, 1.4, 5.0], 42), C([0.3, 1.75, 8.6], [-1.3, 1.4, 5.0], 40)] },
  { id: 'flag', f: F.flags - 3, whip: false, keys: [C([3.4, 4.6, 5.6], [2.7, 5.3, 2], 40), C([3.3, 4.6, 5.3], [2.7, 5.3, 2], 37)] },
  { id: 'jacket', f: F.jackets - 3, whip: false, keys: [C([1.2, 1.7, 4.6], [0.4, 1.4, 2.4], 34), C([1.1, 1.7, 4.4], [0.4, 1.4, 2.4], 31)] },
  { id: 'zoo', f: cut(18), keys: [C([161.5, 1.9, 7.5], [160.5, 1.0, -1.5], 44), C([161.2, 1.7, 6.0], [160.4, 1.0, -1.5], 42)] },
  { id: 'old', f: cut(19), keys: [C([158.0, 1.6, 5.2], [159.8, 1.4, 1.6], 42), C([158.3, 1.55, 4.8], [159.8, 1.4, 1.6], 40)] },
  { id: 'catch', f: F.tossed - 6, whip: false, keys: [C([159.2, 1.5, 1.4], [160.4, 1.4, -1.2], 40), C([159.3, 1.5, 1.2], [160.4, 1.4, -1.2], 37)] },
  { id: 'corp', f: cut(20), keys: [C([160.4, 2.2, 1.8], [160.4, 2.0, -0.8], 40), C([160.4, 2.2, 1.6], [160.4, 2.0, -0.8], 37)] },
  { id: 'follow', f: cut(21), keys: [C([160.3, 2.1, 2.4], [160.4, 1.8, -0.8], 42), C([-77.5, 1.6, 3.2], [-79.6, 1.4, -0.4], 42, TOTAL - 1)] },
], TOTAL);
// the follow shot ends with a cut back to the hook look: split it
S[S.length - 1].keys = [C([160.3, 2.1, 2.4], [160.4, 1.8, -0.8], 42), C([160.4, 2.0, 2.0], [160.4, 1.8, -0.8], 39)];
const KICKS = [{ f: F.promoted, a: 0.02 }, { f: F.roared, a: 0.04 }, { f: F.no, a: 0.03 }, { f: F.private, a: 0.03 }, { f: F.grab14, a: 0.02 }];
const SHOWN = new Set();
const put = (rig, keys, seed, pos) => { const A = K.T.act(pos.f, keys, { seed, blink: blinkAt(pos.f, seed) }); rig.set(A, pos); SHOWN.add(rig); return A; };

export default {
  TOTAL, build, look: 'rich',
  frame(f, k) {
    const { c: cam, s } = X.camAt(S, f, KICKS), id = s.id; SHOWN.clear();
    bottle.visible = milk.visible = choc.visible = false; treat.visible = false; water.visible = false;
    const fx = [], push = (x) => x && fx.push(x), u = (a, b) => clamp((f - a) / (b - a));
    let light = DESERT, lampK = 0.4;
    flag.rotation.y = 0.15 * Math.sin(f * 0.15); flag.position.x = 2.72;
    crates.forEach((c, i) => { c.visible = true; });
    BEAR.root.userData.base = 1.25;
    switch (id) {
      case 'hook': case 'promo': light = CASSINO;
        put(BEAR, bearKeys, 9, { f, x: -79.6, z: -0.4, yaw: 0.35 }); put(SOL1, sol1Keys, 3, { f, x: -78.3, z: -1.2, yaw: -0.4 }); put(SOL2, sol2Keys, 4, { f, x: -80.9, z: -1.4, yaw: 0.5 });
        if (id === 'promo') push(X.wordCard(f, F.promoted, 'PROMOTED!', cam, '#f6c83a', 1e9, 200, 0.62, 1.6));
        break;
      case 'beer': put(BEAR, bearKeys, 9, { f, x: 0.6, z: 5.2, yaw: 0.4 }); X.holdAt(BEAR, bottle, 1, [0.6, 0, 0]); put(SOL1, sol1Keys, 3, { f, x: 1.9, z: 4.6, yaw: -0.6 });
        push(X.wordCard(f, F.beer, 'BEER!', cam, '#f6c83a', 1e9, 210, 0.62, 1.6)); break;
      case 'truck': { const t = u(F.rode - 6, cut(2)); truck.position.x = lerp(-2, -7, M.smooth(t));
        put(BEAR, bearKeys, 9, { f, x: truck.position.x - 1.4, y: 0.95, z: 4.2, yaw: 0.6, seat: 0.4 }); put(SOL1, sol1Keys, 3, { f, x: 1.0, z: 6.0, yaw: -0.8 }); break; }
      case 'iran': case 'swap': case 'cubCU': { const t = u(cut(2), F.swapped - 4);
        put(SOL1, sol1Keys, 3, { f, x: lerp(-3.5, -5.6, t), z: 9.4, yaw: -Math.PI / 2 + 0.3 }); put(SOL2, sol2Keys, 4, { f, x: lerp(-2.6, -4.8, t), z: 8.6, yaw: -Math.PI / 2 + 0.4 });
        put(BOY, boyKeys, 6, { f, x: -7.3, z: 9.0, yaw: 1.1 }); put(CUB, cubKeys, 8, { f, x: -6.8, z: 9.6, yaw: 0.6 });
        if (f >= F.swapped - 4 && f < F.choc + 6) X.holdAt(SOL1, choc, 1, [0, 0, 0]); else if (f >= F.choc + 6) X.holdAt(BOY, choc, 1, [0.4, 0, 0]);
        if (id === 'iran') push(X.wordCard(f, F.iran, 'IRAN, 1942', cam, '#f6c83a', 1e9, 190, 0.62, 2));
        if (id === 'swap') push(X.wordCard(f, F.choc, 'CHOCOLATE', cam, '#c88a4a', 1e9, 180, 0.62, 1.6));
        break; }
      case 'milk': put(SOL1, sol1Keys, 3, { f, x: 1.0, z: 6.4, yaw: 0.9 }); put(CUB, cubKeys, 8, { f, x: 1.6, z: 6.7, yaw: -0.6 }); X.holdAt(CUB, milk, 1, [0.9, 0, 0]);
        push(X.wordCard(f, F.vodka, 'VODKA BOTTLE?!', cam, '#ff7a3a', 1e9, 160, 0.62, 1.6)); break;
      case 'night': light = NIGHT; lampK = 1.4;
        put(SOL1, sol1Keys, 3, { f, x: 0.4, y: 0.05, z: 6.8, yaw: 1.2 }); put(SOL2, sol2Keys, 4, { f, x: 2.0, y: 0.05, z: 6.3, yaw: -1.6 }); put(CUB, cubKeys, 8, { f, x: 1.2, z: 6.6, yaw: 0.3 });
        for (let i = 0; i < 3; i++) { const t = ((f / 40) + i / 3) % 1; push(X.FX('z' + i + q(t, 1), (p) => K.T.fxZ(p, t), [1.3 + t * 0.4, 0.7 + t * 0.8, 6.6], 0.3, { order: 6, alpha: 1 - t })); }
        push(X.wordCard(f, F.dog, 'GIANT FURRY DOG', cam, '#ffffff', 1e9, 160, 0.62, 1.8)); break;
      case 'grow': { const g = M.back(u(F.grew - 4, F.taller + 6)); BEAR.root.userData.base = lerp(0.6, 1.3, g);
        put(BEAR, bearKeys, 9, { f, x: 0.6, z: 6.6, yaw: 0.2 }); put(SOL1, sol1Keys, 3, { f, x: -0.4, z: 6.9, yaw: 0.7 });
        push(X.wordCard(f, F.taller, 'TALLER THAN THE MEN', cam, '#f6c83a', 1e9, 140, 0.66, 1.8)); break; }
      case 'fruit': put(BEAR, bearKeys, 9, { f, x: 4.7, z: -0.4, yaw: 0.3 }); push(X.wordCard(f, F.fruit, 'FRUIT RAID!', cam, '#ff7a3a', 1e9, 190, 0.62, 1.6)); break;
      case 'wrestle': { const sh = Math.sin(f * 0.5) * 0.15;
        put(BEAR, bearKeys, 9, { f, x: 0.6 + sh, z: 1.0, yaw: Math.PI / 2 - 0.3 }); put(SOL1, sol1Keys, 3, { f, x: 1.5 + sh, z: 1.1, yaw: -Math.PI / 2 + 0.3 });
        push(X.wordCard(f, F.wrestled, 'WRESTLING!', cam, '#ffffff', 1e9, 190, 0.62, 1.6));
        if (f > F.wrestled + 14 && f < F.wrestled + 30) push(X.FX('st' + q(u(F.wrestled + 14, F.wrestled + 30), 1), (p) => K.T.fxStars(p, u(F.wrestled + 14, F.wrestled + 30)), [1.6, 0.6, 1.2], 0.4, { order: 6 })); break; }
      case 'shower': case 'tap': lampK = 1.0;
        put(BEAR, bearKeys, 9, { f, x: -12, z: -6.85, yaw: 0.1 }); water.visible = f >= F.turn - 1;
        if (id === 'tap') push(X.wordCard(f, F.turn, 'HOT SHOWER!', cam, '#9fd4ff', 1e9, 180, 0.62, 1.3)); break;
      case 'spy': case 'roar': case 'grabspy': light = NIGHT; lampK = 1.6;
        put(BEAR, bearKeys, 9, { f, x: id === 'spy' ? lerp(-9.6, -11.0, u(cut(8), F.spy)) : -11.4, z: -6.0, yaw: id === 'roar' ? 0.2 : -1.2 });
        put(SPY, spyKeys, 7, { f, x: id === 'grabspy' ? lerp(-11.6, -10.2, u(F.screamed - 4, F.grabbed)) : -12.6, z: id === 'grabspy' ? lerp(-7.2, -4.4, u(F.screamed - 4, F.grabbed)) : -7.2, yaw: id === 'grabspy' ? 0.4 : 0.9 });
        if (id === 'grabspy') { put(SOL1, sol1Keys, 3, { f, x: lerp(-8.4, -9.6, u(F.screamed, F.grabbed)), z: -3.8, yaw: -2.2 }); put(SOL2, sol2Keys, 4, { f, x: lerp(-8.0, -10.4, u(F.screamed, F.grabbed)), z: -3.2, yaw: -2.6 }); }
        if (id === 'spy') push(X.wordCard(f, F.spy, 'A SPY!', cam, '#ff5a3a', 1e9, 210, 0.62, 1.6));
        if (id === 'roar') { push(X.wordCard(f, F.roared, 'ROAAAR!', cam, '#ff7a3a', 1e9, 210, 0.66, 1.4)); if (f > F.roared) push(X.FX('rr' + q((f % 10) / 10, 1), (p) => K.T.fxBurst(p, (f % 10) / 10, '#fff3b0'), [-11.4, 2.4, -5.8], 0.6, { order: 4, alpha: 0.6 })); }
        break;
      case 'ship': case 'nopets': light = PORT;
        put(OFFI, offiKeys, 5, { f, x: 80.4, y: 0.4, z: -0.4, yaw: 0.3 }); put(BEAR, bearKeys, 9, { f, x: 81.8, y: 0.4, z: 1.6, yaw: -2.6 }); put(SOL1, sol1Keys, 3, { f, x: 82.8, y: 0.4, z: 2.2, yaw: -2.4 });
        if (id === 'nopets') push(X.wordCard(f, F.no, 'NO PETS!', cam, '#ff5a3a', 1e9, 200, 0.66, 1.4)); break;
      case 'enlist': case 'form': case 'salute': light = PORT;
        put(OFFI, offiKeys, 5, { f, x: 78.4, y: 0.4, z: 1.4, yaw: 0.2 }); put(BEAR, bearKeys, 9, { f, x: 80.2, y: 0.4, z: 1.6, yaw: -0.5 }); put(SOL1, sol1Keys, 3, { f, x: 81.2, y: 0.4, z: 1.0, yaw: -0.6 });
        if (id === 'form') push(X.wordCard(f, F.private, 'PRIVATE WOJTEK', cam, '#f6c83a', 1e9, 160, 0.6, 0.9));
        if (id === 'salute') push(X.wordCard(f, F.number, 'RANK + NUMBER', cam, '#ffffff', 1e9, 160, 0.62, 1.6)); break;
      case 'rehook': light = CASSINO; put(BEAR, bearKeys, 9, { f, x: -80, z: -1.5, yaw: 0 });
        for (let i = 0; i < 3; i++) { const t = ((f + i * 13) % 26) / 26; push(X.FX('kb' + i + q(t, 1), (p) => PR.kaboom(p, t, i), [-90 + i * 10, 2 + i, -40 - i * 5], 6, { order: 4 })); }
        push(X.wordCard(f, F.craziest, 'NOT THE CRAZIEST PART', cam, '#ff7a3a', 1e9, 130, 0.62, 2)); break;
      case 'watch': case 'bearCU': case 'grab': case 'another': case 'another2': case 'slowmo': { light = CASSINO;
        const carried = f >= F.grab14 ? Math.min(12, 1 + (f >= F.another1 ? 1 : 0) + (f >= AN2 ? 1 : 0)) : 0; crates.forEach((c, i) => { c.visible = i < 12 - carried; });
        const walkT = id === 'slowmo' ? u(cut(15), cut(16)) : id === 'another' ? u(F.another1 - 4, AN2 - 4) : 0;
        put(BEAR, bearKeys, 9, { f, x: id === 'slowmo' ? lerp(-81, -78.6, walkT) : id === 'another' ? lerp(-80.8, -79.6, walkT) : -80.0, z: id === 'slowmo' ? lerp(-1.2, 0.2, walkT) : -0.6, yaw: id === 'slowmo' ? 0.9 : id === 'another' ? 0.6 : 0.2 });
        if (['watch', 'grab', 'another2'].includes(id)) { const wt = u(cut(13), cut(14));
          put(SOL1, sol1Keys, 3, { f, x: id === 'watch' ? lerp(-81.5, -78.4, wt) : -78.6, z: id === 'watch' ? lerp(-2.0, -1.0, wt) : -1.2, yaw: id === 'watch' ? 1.4 : -0.6 });
          put(SOL2, sol2Keys, 4, { f, x: id === 'watch' ? lerp(-82.4, -79.4, wt) : -81.6, z: id === 'watch' ? -2.6 : -1.0, yaw: id === 'watch' ? 1.4 : 0.6 }); }
        if (id === 'watch') push(X.wordCard(f, F.monte, 'MONTE CASSINO, 1944', cam, '#f6c83a', F.crates - F.monte - 2, 140, 0.62, 1.8));
        if (id === 'watch') push(X.wordCard(f, F.crates, 'CRATES OF SHELLS', cam, '#ffffff', 1e9, 150, 0.62, 1.8));
        if (id === 'grab') push(X.wordCard(f, F.grab14 + 4, '1', cam, '#f6c83a', 1e9, 240, 0.62, 1.8));
        if (id === 'another') push(X.wordCard(f, F.another1, '2', cam, '#f6c83a', 1e9, 240, 0.62, 1.8));
        if (id === 'another2') push(X.wordCard(f, AN2, '3!', cam, '#f6c83a', 1e9, 240, 0.62, 1.8));
        if (id === 'slowmo') push(X.wordCard(f, F.dropped, '0 DROPPED', cam, '#9ad04a', 1e9, 200, 0.62, 1.8));
        for (let i = 0; i < 2; i++) { const t = ((f + i * 17) % 34) / 34; push(X.FX('kc' + i + q(t, 1), (p) => PR.kaboom(p, t, i + 3), [-95 + i * 25, 3, -45], 7, { order: 4 })); }
        break; }
      case 'badge': push(X.wordCard(f, F.badge, 'NEW BADGE', cam, '#f6c83a', 1e9, 190, 0.66, 1.2)); break;
      case 'truckE': truck.position.x = -2; push(X.wordCard(f, F.trucks17, 'TRUCKS', cam, '#ffffff', 1e9, 200, 0.62, 1.0)); break;
      case 'flag': push(X.wordCard(f, F.flags, 'FLAGS', cam, '#ffffff', 1e9, 200, 0.62, 1.6)); break;
      case 'jacket': put(SOL1, sol1Keys, 3, { f, x: 0.4, z: 2.4, yaw: 0.3 }); push(X.wordCard(f, F.jackets, 'JACKETS', cam, '#ffffff', 1e9, 200, 0.62, 1.4)); break;
      case 'zoo': case 'old': case 'catch': case 'corp': case 'follow': light = SCOT;
        put(BEAR, bearKeys, 9, { f, x: 160.4, z: -0.8, yaw: id === 'old' || id === 'catch' ? -0.4 : 0, seat: 0.45 });
        if (['old', 'catch'].includes(id)) { put(OLD1, oldKeys, 11, { f, x: 159.2, z: 2.8, yaw: Math.PI - 0.4 }); put(OLD2, oldKeys, 12, { f: f + 6, x: 158.4, z: 3.1, yaw: Math.PI - 0.2 });
          if (f >= F.tossed && f < F.treats + 8) { const t = u(F.tossed, F.treats + 6); treat.visible = true; treat.position.set(lerp(159.4, 160.4, t), 1.4 + 1.2 * Math.sin(Math.PI * t), lerp(2.6, -0.5, t)); } }
        if (id === 'zoo') push(X.wordCard(f, F.zoo, 'SCOTLAND', cam, '#f6c83a', 1e9, 200, 0.62, 2));
        if (id === 'old') push(X.wordCard(f, F.chatted + 4, 'CZEŚĆ, WOJTEK!', cam, '#ffffff', 1e9, 150, 0.62, 1.8));
        if (id === 'corp') push(X.wordCard(f, F.corporal, 'CORPORAL WOJTEK', cam, '#f6c83a', 1e9, 160, 0.62, 1.6));
        if (id === 'follow') push(X.wordCard(f, F.follow, 'FOLLOW!', cam, '#9ad04a', 1e9, 220, 0.62, 1.6));
        break;
    }
    for (const r of [BEAR, CUB, SOL1, SOL2, BOY, SPY, OFFI, OLD1, OLD2]) if (!SHOWN.has(r)) r.root.visible = false;
    if (!['truck', 'truckE'].includes(id)) truck.position.x = -2;
    smoke.forEach((sm, i) => { sm.position.x = -30 + ((i * 7 + f * 0.02) % 60); });
    const foc = { hook: [[-79.6, 1.6, -0.4], 10], promo: [[-79.6, 1.95, -0.4], 14], beer: [[0.6, 1.8, 5.2], 13], iran: [[-6.5, 1.0, 9], 7], swap: [[-6.5, 1.0, 9], 11], cubCU: [[-6.8, 0.55, 9.6], 15],
      milk: [[1.4, 0.75, 6.6], 13], night: [[1.2, 0.4, 6.6], 10], fruit: [[4.7, 1.1, -0.4], 12], wrestle: [[1.0, 1.0, 1.0], 9], shower: [[-12, 1.4, -6.85], 10], tap: [[-12, 2.15, -6.85], 15],
      spy: [[-12.4, 0.9, -7], 10], roar: [[-11.4, 1.7, -6], 14], nopets: [[81.4, 1.5, -1.0], 14], form: [[78.5, 1.18, 2.0], 18], salute: [[80.2, 1.9, 1.6], 12], bearCU: [[-80, 1.65, -0.6], 15],
      another: [[-80.2, 1.6, -0.6], 10], slowmo: [[-79.6, 1.6, -0.4], 10], badge: [[0, 1.4, 20], 18], truckE: [[-1.3, 1.5, 5.1], 10], flag: [[2.7, 5.3, 2], 12], jacket: [[0.4, 1.4, 2.4], 14],
      old: [[159.0, 1.4, 2.9], 11], catch: [[160.4, 1.4, -0.8], 13], corp: [[160.4, 2.0, -0.8], 13], follow: [[160.4, 1.8, -0.8], 12] };
    const dof = foc[id] ? X.focusOn(cam, foc[id][0], foc[id][1]) : { focus: 10, cinf: 4 };
    return { light, cam, dof, actors: [], fx, lampK };
  },
};
