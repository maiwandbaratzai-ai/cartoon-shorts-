// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The syrup heist nobody noticed" (story, inspired by the 2011–12 maple syrup heist from Quebec's strategic reserve).
// One warehouse full of syrup barrels: day (inspector), night (thieves with a hose), the loading dock with a truck.
import { TOTAL, LINES, wf } from './syrup_timing.js';
import * as PR from '../props.js';
import * as X from './kit3d.js';
import { blinkAt } from '../motion.js';
const { M, clamp, lerp, q } = X;

export { TOTAL };
const L = LINES, cut = (i) => Math.max(0, L[i][0] - 4), W = wf;
let K, INSP, GUARD, T1, T2, DOG, FLY, OPEN1, OPEN2, WATER1, WATER2, HOSE, BUCKET, TRUCK, LADDER;

const INSP_O = { jacket: '#f2a03a', pants: '#2a3a5a', boots: '#3a2a1a', hat: 'hardhat', hatColor: '#f6d23a', vest: '#e8f24a', glasses: true, belt: '#2a2a2a', pockets: true, skin: '#f2d2b0' };
const GUARD_O = { jacket: '#3a4a6a', pants: '#2a2a3a', boots: '#111', hat: 'police', badge: true, tie: '#8a2a2a', moustache: '#e8e0d0', belt: '#111', build: 'stout', skin: '#e8b890' };
const T1_O = { jacket: '#2a2a30', pants: '#2a2a30', boots: '#111', hat: 'beanie', hatColor: '#c0392b', scarf: '#f2f2ea', gloves: '#e8c84a', glasses: '#111', skin: '#d8a880' };
const T2_O = { jacket: '#5a4a7a', pants: '#2a2a34', boots: '#2a1e14', hat: 'cap', cap: '#2a2a2a', vest: '#3a3a3a', pockets: true, moustache: '#3a2418', belt: '#8a5a2a', skin: '#c88a5a' };

const DAY = { az: 140, el: 55, sky: '#8a7a6a', ground: '#4a3a2a', hemi: 0.75, sun: '#ffe8c0', sunI: 1.4, fog: '#3a2e24', fogNear: 16, fogFar: 46,
  skyTop: '#3a2e24', skyHor: '#3a2e24', sat: 1.1, vig: 0.28, shadowExt: 16, exposure: 1.3, bloom: 0.65, ink: 0.55, cardTint: '#fff2e2' };
const NIGHT = { ...DAY, hemi: 0.65, sun: '#9ab0ff', sunI: 0.9, fog: '#141a30', skyTop: '#141a30', skyHor: '#141a30', exposure: 1.35, cardTint: '#e4e8ff', sat: 1.05 };

// barrel rows: two stacks along the aisle (x ±1.4..±2.6), z -2..-20, 4 levels
const BR = 0.3, BH = 0.88, LV = 1.0;
function barrel(parent, x, y, z, label = true) {
  const g = K.group(parent); g.position.set(x, y, z);
  K.cyl(BR, BR, BH, K.mat('metal', '#d8c8a0', { amt: 0.25 }), 0, 0, 0, g);
  for (const yy of [0.18, 0.7]) K.cyl(BR + 0.012, BR + 0.012, 0.035, K.mat('metal', '#8a6a3a'), 0, yy, 0, g);
  if (label) { const t = K.add(new K.THREE.CylinderGeometry(BR + 0.004, BR + 0.004, 0.3, 20, 1, true, -0.7, 1.4), K.toon({ map: LBL, plain: true }), 0, 0.42, 0, g); }
  return g;
}
let LBL;

function build(k) {
  K = k; X.init(K); const { THREE } = K; const r = X.rnd(18);
  LBL = PR.canvasTex(512, 160, (g, w, h) => { g.fillStyle = '#b8322a'; g.fillRect(0, 0, w, h); g.fillStyle = '#f6efe0'; g.font = 'bold 74px Georgia, serif'; g.textAlign = 'center'; g.fillText('MAPLE', w / 2, 100);
    g.beginPath(); g.moveTo(60, 80); g.lineTo(80, 40); g.lineTo(100, 80); g.fill(); g.beginPath(); g.moveTo(412, 80); g.lineTo(432, 40); g.lineTo(452, 80); g.fill(); });
  const floor = K.mat('rock', '#b8a488', { detail: 0.9, amt: 0.3 }), brick = K.mat('brick', '#9a5a42', { detail: 0.9 }), wood = K.mat('wood', '#8a6038'), pal = K.mat('wood', '#c8a06a', { detail: 0.3 });
  K.slab(-8, 8, -0.1, 0, -26, 6, floor, K.scene, false);
  K.slab(-8.4, -8, 0, 7, -26, 6, brick); K.slab(8, 8.4, 0, 7, -26, 6, brick); K.slab(-8.4, 8.4, 0, 7, 6, 6.4, brick);
  // back wall with the loading-dock door (x -2.5..2.5) open to the night/day yard
  K.slab(-8.4, -2.5, 0, 7, -26.4, -26, brick); K.slab(2.5, 8.4, 0, 7, -26.4, -26, brick); K.slab(-2.5, 2.5, 4, 7, -26.4, -26, brick);
  K.slab(-8.4, 8.4, 7, 7.2, -26.4, 6.4, K.mat('metal', '#5a5a62'), K.scene, false);
  for (let z = -24; z < 6; z += 3) K.slab(-8, 8, 6.4, 6.7, z - 0.15, z + 0.15, wood);
  for (let x = -6; x <= 6; x += 4) K.slab(x - 0.12, x + 0.12, 0, 7, 5.9, 6.0, wood);
  // outside yard + a gravel road
  K.slab(-30, 30, -0.1, 0, -80, -26.4, K.mat('dirt', '#7a6a52', { detail: 1.2 }), K.scene, false);
  for (let i = 0; i < 10; i++) X.tree(-20 + i * 4.5 + (r() - 0.5) * 2, -48 - r() * 10, 2.5 + r(), K.mat('wood', '#5a4232'), K.mat('grime', i % 2 ? '#c8642a' : '#d8a03a', { amt: 0.6 }), K.scene, r); // autumn maples
  // stacks
  const rows = [];
  for (const sx of [-1, 1]) for (let lv = 0; lv < 4; lv++) {
    K.slab(sx > 0 ? 1.0 : -3.0, sx > 0 ? 3.0 : -1.0, lv * LV, lv * LV + 0.1, -21, -1.4, pal, K.scene);
    for (const cx of [1.35, 2.05, 2.7]) for (let z = -1.75; z > -20.8; z -= 0.68) { if (lv === 3 && sx > 0 && cx === 1.35 && Math.abs(z + 6.5) < 0.4) continue; rows.push(barrel(K.scene, sx * cx, lv * LV + 0.1, z, cx === 1.35)); }
  }
  for (const sx of [-1, 1]) { const st = K.slab(sx > 0 ? 1.0 : -3.0, sx > 0 ? 3.0 : -1.0, 0, 4, -21, -1.4, K.mat('grime', '#000', { plain: true })); st.visible = false; st.name = 'stack'; K.solid(st, 0.15); }
  // ladder on the right stack at z -6.5
  LADDER = K.group(); LADDER.position.set(0.85, 0, -6.5); for (const dz of [-0.25, 0.25]) K.slab(-0.03, 0.03, 0, 4.2, dz - 0.03, dz + 0.03, K.mat('metal', '#d8b83a'), LADDER);
  for (let y = 0.3; y < 4.1; y += 0.35) K.slab(-0.02, 0.02, y, y + 0.04, -0.25, 0.25, K.mat('metal', '#d8b83a'), LADDER); LADDER.rotation.z = -0.05;
  // signs, lamps, guard post
  X.sign(4.4, 1.0, X.txtTex(1024, 232, '#1e3a6a', '#f6efe0', ['EMERGENCY SYRUP', 'RESERVE'], 'bold 84px Georgia, serif'), 0, 5.4, -26.0 + 0.05);
  X.sign(1.6, 0.5, X.txtTex(512, 160, '#f2d23a', '#2a2a2a', ['NO PANCAKES'], 'bold 66px Arial, sans-serif'), -7.95, 2.2, -8, Math.PI / 2);
  const desk = K.group(); desk.position.set(-4.6, 0, 2.6); K.slab(-0.7, 0.7, 0.72, 0.78, -0.4, 0.4, wood, desk); for (const [a, b] of [[-0.6, -0.3], [0.6, -0.3], [-0.6, 0.3], [0.6, 0.3]]) K.slab(a - 0.04, a + 0.04, 0, 0.72, b - 0.04, b + 0.04, K.mat('wood', '#5a3a24'), desk);
  K.cyl(0.05, 0.05, 0.1, K.mat('grime', '#f2f2ea', { plain: true }), -4.3, 0.78, 2.5); K.add(new THREE.SphereGeometry(0.08, 10, 8), K.mat('metal', '#3a3a40'), -4.9, 0.85, 2.4);
  const chair = K.group(); chair.position.set(-4.6, 0, 3.5); K.slab(-0.3, 0.3, 0.42, 0.48, -0.25, 0.25, K.mat('wood', '#6a4428'), chair); K.slab(-0.3, 0.3, 0.42, 1.1, -0.28, -0.22, K.mat('wood', '#6a4428'), chair);
  K.solid(desk);
  for (const [x, z] of [[0, -4], [0, -13], [-4.6, 2.2]]) { K.cyl(0.01, 0.01, 1.2, K.mat('metal', '#222'), x, 5.6, z); K.add(new THREE.ConeGeometry(0.35, 0.3, 16, 1, true), K.mat('metal', '#3a5a3a'), x, 5.55, z); }
  K.lamp(0, 5.2, -4, { color: '#ffd8a0', intensity: 3.4, distance: 12, glowS: 0.6 });
  K.lamp(0, 5.2, -13, { color: '#ffd8a0', intensity: 3.0, distance: 12, glowS: 0.6 });
  K.lamp(-4.6, 2.4, 2.2, { color: '#ffd090', intensity: 2.6, distance: 7, glowS: 0.4 });
  K.shaft([0, 4, -26], [0, 0, -18], 2.0, 3.2, '#fff0d0', 0.08);
  K.dust([0, 2.5, -8], [6, 4, 14], 160);
  // props that move
  FLY = barrel(K.scene, 1.35, 3.1, -6.5);
  const open = (x, z) => { const g = barrel(K.scene, x, 0, z); const w = K.add(new THREE.CircleGeometry(BR - 0.02, 24), K.toon({ color: '#6ab8e8', plain: true, roughness: 0.05, emissive: '#2a6a9a' }), 0, BH + 0.006, 0, g); w.rotation.x = -Math.PI / 2; return [g, w]; };
  [OPEN1, WATER1] = open(-0.3, -3.2); [OPEN2, WATER2] = open(0.45, -3.6);
  const lid = K.cyl(BR, BR, 0.03, K.mat('metal', '#c8b890'), 0.2, 0.0, -2.6); lid.rotation.z = 0.2;
  BUCKET = K.group(); K.cyl(0.25, 0.2, 0.4, K.mat('metal', '#8a9aa8'), 0, 0, 0, BUCKET); const amb = K.add(new THREE.CircleGeometry(0.23, 20), K.toon({ color: '#c8742a', plain: true, roughness: 0.1 }), 0, 0.36, 0, BUCKET); amb.rotation.x = -Math.PI / 2;
  BUCKET.position.set(0.0, 0, -11);
  HOSE = K.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-1.35, 1.0, -11), new THREE.Vector3(-1.1, 1.3, -11), new THREE.Vector3(-0.5, 0.9, -11), new THREE.Vector3(0.0, 0.4, -11)]), 20, 0.03, 8), K.mat('fabric', '#3a8a4a', { plain: true }), 0, 0, 0);
  TRUCK = PR.oldTruck(K, '#2a6ab8'); TRUCK.root.rotation.y = Math.PI / 2;
  for (let i = 0; i < 4; i++) barrel(TRUCK.root, -0.6 - (i % 2) * 0.7 - 0.6, 0.95, (Math.floor(i / 2) - 0.5) * 0.7);
  // cast
  INSP = K.stick(INSP_O, { key: 'insp' }); GUARD = K.stick(GUARD_O, { key: 'guard' }); T1 = K.stick(T1_O, { key: 't1' }); T2 = K.stick(T2_O, { key: 't2' });
  DOG = K.animal('dog', { seed: 2, color: '#8a5a34', scale: 1.1 });
}

const F = { stole: W(0, 'stole'), m18: W(0, '18'), nobody: W(0, 'nobody'), barrels: W(1, 'barrels'), thousands: W(1, 'thousands'), ceiling: W(1, 'ceiling'), emergency: W(2, 'emergency'),
  guarded: W(2, 'guarded'), night: W(2, 'night'), inspector: W(3, 'inspector'), climbed: W(3, 'climbed'), count: W(3, 'count'), bumped: W(4, 'bumped'), flew: W(4, 'flew'), balloon: W(4, 'balloon'),
  light: W(5, 'light'), pried: W(5, 'pried'), water: W(6, 'water'), another: W(6, 'another'), water2: W(6, 'again') - 6, where: W(7, 'where'), go: W(7, 'go'), thieves: W(8, 'thieves'), siphoned: W(8, 'siphoned'),
  refilling: W(8, 'refilling'), sold: W(9, 'sold'), truck: W(9, 'truck'), noses: W(9, 'noses'), how: W(10, 'how'), noticing: W(10, 'noticing') };
const CLIMB0 = F.climbed - 2, CLIMB1 = L[4][0] - 6;   // up the ladder
const inspKeys = [[0, 'shock', { expr: 'shock' }], [cut(3), 'walk', { R: [0.3, 0.3, 'paper'], expr: 'neutral' }], [CLIMB0, 'reach', { expr: 'stern' }], [CLIMB0 + 12, 'grab', { expr: 'stern' }], [CLIMB0 + 24, 'reach'], [CLIMB0 + 36, 'grab'],
  [CLIMB1, 'read', { item: 'paper', expr: 'neutral' }], [F.bumped - 3, 'push', { expr: 'neutral' }], [F.flew - 2, 'shock', { expr: 'shock' }], [F.balloon, 'pointUp', { expr: 'shock' }],
  [cut(5), 'hold', { R: [0.25, -0.75, 'fist'], expr: 'confused' }], [F.pried - 3, 'dig', { expr: 'stern' }], [F.water - 2, 'shock', { expr: 'shock' }], [F.another - 2, 'dig', { expr: 'nervous' }],
  [F.water2, 'facepalm', { expr: 'sad' }], [cut(7), 'think', { expr: 'confused' }], [F.go - 2, 'shrug', { expr: 'confused', talk: true }]];
const guardKeys = [[0, 'sit', { expr: 'sleepy' }], [F.night, 'sit', { expr: 'sleepy', look: 0.3 }]];
const t1Keys = [[0, 'sneak', { expr: 'grin' }], [F.siphoned - 4, 'hold', { R: [0.35, 0.0, 'fist'], expr: 'grin' }], [F.refilling - 2, 'pointL', { expr: 'laugh' }], [cut(9), 'wave', { expr: 'laugh' }], [F.noses, 'cheer', { expr: 'laugh' }]];
const t2Keys = [[0, 'sneak', { expr: 'nervous' }], [F.siphoned, 'carry', { item: 'box', expr: 'grin' }], [F.refilling, 'hold', { R: [0.4, -0.3, 'cup'], expr: 'grin' }], [cut(9), 'wave', { expr: 'grin' }], [F.noses + 4, 'laugh' ? 'cheer' : 'cheer', { expr: 'laugh' }]];

const S = X.shotList([
  { id: 'hook', f: 0, keys: [{ pos: [-0.8, 3.4, -1.0], look: [1.4, 5.0, -6.2], fov: 48 }, { pos: [-0.7, 3.5, -1.3], look: [1.4, 5.1, -6.2], fov: 45 }] },
  { id: 'guard', f: F.nobody - 6, keys: [{ pos: [-3.0, 1.2, 5.2], look: [-4.6, 0.9, 3.3], fov: 40 }, { pos: [-3.1, 1.15, 5.0], look: [-4.6, 0.9, 3.3], fov: 36 }] },
  { id: 'aisle', f: cut(1), keys: [{ pos: [0, 0.6, 3.5], look: [0, 1.6, -20], fov: 50 }, { pos: [0, 2.6, 2.5], look: [0, 2.2, -20], fov: 50 }] },
  { id: 'label', f: F.thousands - 4, whip: false, keys: [{ pos: [0.2, 1.75, -9.0], look: [-1.35, 1.55, -10.4], fov: 40 }, { pos: [0.25, 1.9, -9.1], look: [-1.35, 2.5, -10.4], fov: 40 }] },
  { id: 'sign', f: cut(2), keys: [{ pos: [0, 4.4, -18], look: [0, 5.3, -26], fov: 42 }, { pos: [0, 4.4, -18.8], look: [0, 5.3, -26], fov: 40 }] },
  { id: 'sleep', f: F.guarded - 4, keys: [{ pos: [-3.4, 1.3, 5.4], look: [-4.7, 0.8, 3.4], fov: 38 }, { pos: [-3.5, 1.25, 5.2], look: [-4.7, 0.8, 3.4], fov: 34 }] },
  { id: 'climb', f: cut(3), keys: [{ pos: [-0.8, 1.2, -3.2], look: [0.8, 1.4, -6.5], fov: 44 }, { pos: [-0.8, 1.6, -3.4], look: [0.8, 2.6, -6.5], fov: 44 }] },
  { id: 'top', f: CLIMB1 - 4, whip: false, keys: [{ pos: [0.1, 5.0, -2.8], look: [1.6, 4.95, -5.6], fov: 40 }, { pos: [0.1, 5.0, -3.0], look: [1.6, 4.95, -5.6], fov: 38 }] },
  { id: 'fly', f: F.flew - 4, whip: false, keys: [{ pos: [-0.8, 3.4, -3.4], look: [1.4, 5.0, -6.6], fov: 48 }, { pos: [-0.8, 3.4, -3.6], look: [1.4, 5.6, -6.6], fov: 48 }] },
  { id: 'light', f: cut(5), keys: [{ pos: [1.3, 1.7, 0.6], look: [0.6, 1.6, -2.2], fov: 44 }, { pos: [1.25, 1.65, 0.4], look: [0.6, 1.6, -2.2], fov: 40 }] },
  { id: 'open', f: F.pried - 4, whip: false, keys: [{ pos: [-0.9, 1.7, -1.4], look: [0.0, 0.9, -3.2], fov: 44 }, { pos: [-0.85, 1.65, -1.55], look: [0.0, 0.9, -3.2], fov: 40 }] },
  { id: 'water', f: L[6][0] - 6, whip: false, keys: [{ pos: [-0.75, 1.55, -2.3], look: [-0.3, 0.85, -3.2], fov: 42 }, { pos: [-0.72, 1.5, -2.35], look: [-0.3, 0.85, -3.2], fov: 38 }] },
  { id: 'again', f: F.another - 4, whip: false, keys: [{ pos: [2.0 - 2.6, 1.5, -1.0], look: [0.5, 1.0, -3.3], fov: 42 }, { pos: [-0.55, 1.45, -1.2], look: [0.5, 1.0, -3.3], fov: 38 }] },
  { id: 'where', f: cut(7), keys: [{ pos: [0.8, 1.65, 0.6], look: [0.75, 1.45, -2.7], fov: 36 }, { pos: [0.8, 1.6, 0.4], look: [0.75, 1.45, -2.7], fov: 33 }] },
  { id: 'heist', f: cut(8), keys: [{ pos: [1.0, 1.5, -7.4], look: [-0.1, 1.0, -11], fov: 44 }, { pos: [0.9, 1.45, -7.8], look: [-0.1, 1.0, -11], fov: 40 }] },
  { id: 'refill', f: F.refilling - 4, whip: false, keys: [{ pos: [0.9, 1.2, -8.4], look: [0.0, 0.8, -11], fov: 44 }, { pos: [0.85, 1.2, -8.6], look: [0.0, 0.8, -11], fov: 40 }] },
  { id: 'truck', f: cut(9), keys: [{ pos: [0.4, 1.6, -18.5], look: [0, 1.4, -30], fov: 46 }, { pos: [0.4, 1.6, -19.5], look: [0, 1.4, -32], fov: 44 }] },
  { id: 'end', f: cut(10), keys: [{ pos: [-3.2, 1.25, 5.3], look: [-4.6, 0.85, 3.3], fov: 40 }, { pos: [-3.0, 1.3, 5.6], look: [-4.6, 0.85, 3.3], fov: 44 }] },
], TOTAL);
const KICKS = [{ f: F.flew, a: 0.03 }, { f: F.water, a: 0.03 }, { f: F.m18, a: 0.015 }];
const SHOWN = new Set();
const put = (rig, keys, seed, pos) => { const A = K.T.act(pos.f, keys, { seed, blink: blinkAt(pos.f, seed) }); rig.set(A, pos); SHOWN.add(rig); return A; };

export default {
  TOTAL, build, look: 'rich',
  frame(f, k) {
    const { c: cam, s } = X.camAt(S, f, KICKS), id = s.id; SHOWN.clear();
    if (id === 'fly') cam.fov *= K.punch(f, F.flew, 0.25, 6);
    if (id === 'water') cam.fov *= K.punch(f, F.water, 0.22, 5);
    const fx = [], push = (x) => x && fx.push(x);
    const night = ['heist', 'refill', 'truck'].includes(id);
    HOSE.visible = BUCKET.visible = night && id !== 'truck'; TRUCK.root.visible = id === 'truck';
    // the flying barrel: sits on top until "flew", then floats up and tumbles like a balloon
    const ft = clamp((f - F.flew + 2) / 40);
    FLY.visible = !night; FLY.position.set(1.35 + (id === 'hook' ? 0.0 : 0) + ft * 0.6, 3.1 + (id === 'hook' ? 2.0 + 0.15 * Math.sin(f / 8) : M.smooth(ft) * 2.4), -6.5 - ft * 0.4);
    FLY.rotation.set(id === 'hook' ? 0.6 : ft * 2.2, 0, id === 'hook' ? 0.4 : ft * 1.4);
    WATER1.visible = f >= F.pried + 8; WATER2.visible = f >= F.another + 6;
    // the guard + his dog: asleep at the desk (hook, guard, sleep, end); all other day shots too (background)
    put(GUARD, guardKeys, 2, { f, x: -4.6, y: 0.0, z: 3.5, yaw: 0, seat: 0.46 });
    DOG.set(f, { x: -3.6, z: 3.2, yaw: -2.2, mode: 'sleep', expr: 'sleepy' }); DOG.root.visible = !night;
    if (['hook', 'guard', 'sleep', 'end'].includes(id) && f % 54 < 34) push(X.FX('z' + (f % 54), (p) => K.T.fxZ(p, (f % 54) / 34), [-4.5, 1.3, 3.2], 0.4, { order: 6 }));
    if (!night) {
      // inspector: walks in, climbs (y up the ladder), stands on top, then on the floor by the opened barrels
      let ix = 0.4, iy = 0, iz = -2.0, yaw = Math.PI;
      if (id === 'hook' || id === 'top' || id === 'fly') { ix = 1.6; iy = 4.1; iz = -5.6; yaw = id === 'top' ? -0.7 : Math.PI + 0.25; }
      else if (id === 'climb') { const Wi = K.walkPath(f, cut(3), [[0.0, -3.4], [0.5, -6.5]], 1.3); ix = Wi.x; iz = Wi.z; yaw = Wi.moving ? Wi.yaw : -Math.PI / 2;
        if (f >= CLIMB0) { ix = 0.62; iz = -6.5; iy = clamp((f - CLIMB0) / (CLIMB1 - CLIMB0)) * 3.0; yaw = -Math.PI / 2; } }
      else if (['light'].includes(id)) { ix = 0.5; iz = -2.2; yaw = 0.3; }
      else if (['open', 'water', 'again', 'where'].includes(id)) { ix = 0.75; iz = -2.7; yaw = id === 'where' ? 0.1 : -1.2; }
      if (['hook', 'climb', 'top', 'fly', 'light', 'open', 'water', 'again', 'where'].includes(id)) put(INSP, inspKeys, 5, { f, x: ix, y: iy, z: iz, yaw });
      if (id === 'light') { FLY.visible = true; FLY.position.set(0.55, 1.95 + 0.08 * Math.sin(f / 5), -2.05); FLY.rotation.set(0, 0, 0.1 * Math.sin(f / 7)); }
    } else {
      put(T1, t1Keys, 7, { f, x: id === 'truck' ? -1.2 : -0.45, z: id === 'truck' ? -25 : -10.3, yaw: id === 'truck' ? 0 : 0.5 });
      put(T2, t2Keys, 8, { f, x: id === 'truck' ? 1.2 : 0.6, z: id === 'truck' ? -25.2 : -11.0, yaw: id === 'truck' ? 0 : -0.4 });
      if (id === 'truck') { const t = clamp((f - F.truck) / 60); TRUCK.root.position.set(-0.4, 0, -31 - M.smooth(t) * 14); }
    }
    switch (id) {
      case 'hook': push(X.wordCard(f, F.m18 - 2, '$18 MILLION', cam, '#9ad04a', 1e9, 180, 0.5, 1.6)); break;
      case 'guard': push(X.wordCard(f, F.nobody, 'NOBODY NOTICED', cam, '#ffffff', 1e9, 160, 0.62, 1.6)); break;
      case 'aisle': case 'label': push(X.wordCard(f, F.thousands, 'THOUSANDS', cam, '#f6c83a', 1e9, 190, 0.62, 1.6)); break;
      case 'sleep': push(X.wordCard(f, F.guarded, '"GUARDED"', cam, '#f6c83a', 1e9, 190, 0.62, 1.6)); break;
      case 'fly': push(X.wordCard(f, F.balloon, 'BOING?!', cam, '#ff7a3a', 1e9, 200, 0.62, 1.6)); break;
      case 'light': push(X.wordCard(f, F.light - 2, 'TOO LIGHT', cam, '#ffffff', 1e9, 190, 0.62, 1.6)); break;
      case 'water': if (f >= F.water) push(X.FX('sp' + q(clamp((f - F.water) / 16), 1), (p) => K.T.fxSplash(p, clamp((f - F.water) / 16)), [-0.3, 0.55, -3.2], 0.5, { order: 6 }));
        push(X.wordCard(f, F.water, 'WATER!', cam, '#6ab8e8', 1e9, 220, 0.62, 1.4)); break;
      case 'again': if (f >= F.another + 6) push(X.FX('sp2' + q(clamp((f - F.another - 6) / 16), 1), (p) => K.T.fxSplash(p, clamp((f - F.another - 6) / 16)), [0.45, 0.55, -3.6], 0.5, { order: 6 }));
        push(X.wordCard(f, F.water2, 'WATER AGAIN', cam, '#6ab8e8', 1e9, 170, 0.62, 1.6)); break;
      case 'where': push(X.wordCard(f, F.go, '?', cam, '#ffffff', 1e9, 260, 0.62, 1.6)); break;
      case 'heist': push(X.wordCard(f, F.siphoned + 4, 'SIPHON...', cam, '#c8742a', 1e9, 190, 0.62, 1.6)); break;
      case 'refill': push(X.wordCard(f, F.refilling + 4, '...+ WATER', cam, '#6ab8e8', 1e9, 190, 0.62, 1.6)); break;
      case 'truck': push(X.wordCard(f, F.truck, 'TRUCK BY TRUCK', cam, '#f6c83a', 1e9, 160, 0.62, 1.6)); break;
      case 'end': push(X.wordCard(f, F.noticing - 4, 'NOBODY NOTICED', cam, '#ffffff', 1e9, 160, 0.62, 1.6)); break;
    }
    for (const r of [INSP, GUARD, T1, T2]) if (!SHOWN.has(r)) r.root.visible = false;
    const cl = { hook: [[1.5, 4.2, -6], 8], guard: [[-4.6, 0.9, 3.4], 13], aisle: [[0, 1.5, -10], 4], label: [[-1.35, 1.6, -10.4], 16], sign: [[0, 5.3, -26], 10], sleep: [[-4.6, 0.8, 3.4], 14],
      climb: [[0.6, 1.6, -6.5], 10], top: [[1.5, 4.4, -6], 13], fly: [[1.5, 5, -6.5], 8], light: [[0.5, 1.4, -2.2], 14], open: [[0.0, 0.9, -3.2], 12], water: [[-0.3, 0.86, -3.2], 16],
      again: [[0.3, 1.0, -3.2], 13], where: [[0.75, 1.45, -2.7], 14], heist: [[0, 1, -10.8], 12], refill: [[0, 0.6, -11], 12], truck: [[0, 1.2, -26], 6], end: [[-4.6, 0.85, 3.4], 14] };
    const dof = cl[id] ? X.focusOn(cam, cl[id][0], cl[id][1]) : { focus: 10, cinf: 4 };
    return { light: night ? NIGHT : DAY, cam, dof, actors: [], fx };
  },
};
