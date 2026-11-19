// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why a sailor ate a breakfast worth a house" (story, inspired by the tulip-mania legend of the sailor who ate a
// Semper Augustus bulb thinking it was an onion, Holland, 1637). Harbor quay along x (water at z<-2), a pier at x≈20,
// canal houses behind (z≈16); tulip market + windmill at x≈-60.
import { TOTAL, LINES, wf } from './tulipsnack_timing.js';
import * as PR from '../props.js';
import * as D from './d19.js';
const { clamp, lerp, sm } = D;
export { TOTAL };
const L = LINES, W = wf;
let K, SAIL, MER, BAK, FISH, DOG, TR, FARM, LAF1, LAF2, BULB, PLATE, FISHES = [], BOARD, BOARDTX = [], SCALE, MILL, BOX;
const SAIL_O = { jacket: '#1f3a6a', pants: '#e8e0d0', boots: '#2a1a12', hat: 'beanie', hatColor: '#c0392b', scarf: '#f4efe4', moustache: '#2a1a12', belt: '#3a2418', pockets: true };
const MER_O = { jacket: '#5a2a6a', pants: '#2a2a30', boots: '#111', hat: 'tophat', glasses: true, vest: '#e8c040', bowtie: '#f4efe4', collar: '#ffffff' };
const BAK_O = { jacket: '#f2efe8', pants: '#3a3a44', boots: '#1e1a18', hat: 'chef', apron: '#ffffff', bowtie: '#c0392b', moustache: '#8a5a2a', build: 'stout' };
const FISH_O = { jacket: '#3a7a5a', dress: '#3a7a5a', pants: '#2a3a30', hairStyle: 'bun', hair: '#c87a3a', apron: '#e8dcc0', scarf: '#e8b830' };
const TR_O = { jacket: '#8a2a2a', pants: '#2a2a30', boots: '#111', hat: 'cap', cap: '#2a2a30', tie: '#e8c040', glasses: '#333', pockets: true };
const FARM_O = { jacket: '#6a8a3a', pants: '#4a3a2a', boots: '#3a2418', hat: 'cowboy', hatColor: '#c8a060', vest: '#8a5a34', scarf: '#c0392b', belt: '#3a2418' };
const LAF1_O = { jacket: '#2a5a8a', pants: '#3a3a44', boots: '#111', hat: 'cap', cap: '#f4efe4', scarf: '#2a2a6a', belt: '#1a1a1a', gloves: '#8a6a4a' };
const LAF2_O = { jacket: '#c86a2a', pants: '#2a3a5a', boots: '#2a1a12', hairStyle: 'spiky', hair: '#e8c070', vest: '#4a3a2a', moustache: '#e8c070' };
const EXT = { az: 75, el: 42, sky: '#d8ecf8', ground: '#9a8a7a', hemi: 1.05, sun: '#fff0d8', sunI: 3.2, skyTop: '#3a7ed0', skyHor: '#e4ecf2', fog: '#e2e8ee', fogNear: 50, fogFar: 380,
  sat: 1.14, vig: 0.24, shadowExt: 18, exposure: 1.1, ink: 0.55, bloom: 0.6 };
const TBL = [-6, 0, 1.8]; // breakfast table
const MX = -60;           // market origin

function house(x, z, w, h, col, seed, ry = Math.PI) {
  const { THREE } = K; const g = K.group(); g.position.set(x, 0, z); g.rotation.y = ry;
  K.add(new THREE.BoxGeometry(w, h, 6), K.toon({ map: PR.facadeTex(col, 2, Math.round(h / 3), seed, '#f4efe4'), kind: 'brick', amt: 0.1 }), 0, h / 2, 0, g);
  for (let i = 0; i < 3; i++) K.slab(-w / 2 + (i + 1) * w / 7, w / 2 - (i + 1) * w / 7, h + i * 1.1, h + (i + 1) * 1.1, -2.9, 2.9, K.mat('brick', col), g);
  K.slab(-0.4, 0.4, h + 3.3, h + 3.8, -2.9, 2.9, K.mat('plaster', '#f4efe4'), g);
  return g;
}
function build(k) {
  K = k; D.init(K); const { THREE } = K;
  const cob = K.mat('rock', '#a89a88', { detail: 0.35, amt: 0.4, bump: 0.01 });
  K.slab(-90, 60, -0.4, 0, -2, 40, cob, K.scene, false);
  const water = K.add(new THREE.PlaneGeometry(400, 200), K.toon({ color: '#3a7aa8', plain: true, roughness: 0.15, metalness: 0.2 }), 0, -0.6, -102); water.rotation.x = -Math.PI / 2;
  K.slab(-90, 60, -0.9, 0, -2.3, -2, K.mat('rock', '#8a7a6a'), K.scene, false);
  // pier
  K.slab(18.5, 21.5, -0.15, 0.05, -18, -2, K.mat('wood', '#9a7048', { detail: 0.6 }), K.scene, false);
  for (let z = -18; z <= -3; z += 2.5) for (const x of [18.6, 21.4]) K.cyl(0.15, 0.15, 1.6, K.mat('wood', '#6a4428'), x, -0.9, z);
  for (const x of [18.6, 21.4]) K.slab(x - 0.05, x + 0.05, 0.85, 0.95, -18, -3, K.mat('wood', '#6a4428'));
  // ships
  for (const [x, z, c] of [[-14, -9, '#8a4a2a'], [6, -11, '#2a4a6a'], [32, -10, '#6a3a2a']]) {
    const g = K.group(); g.position.set(x, -0.6, z);
    K.slab(-6, 6, 0, 2.2, -1.8, 1.8, K.mat('wood', c, { detail: 0.8 }), g); K.slab(-6.4, 6.4, 2.2, 2.45, -1.9, 1.9, K.mat('wood', '#e8c040'), g);
    K.add(new THREE.ConeGeometry(1.8, 3, 4).rotateZ(-Math.PI / 2).rotateX(Math.PI / 4), K.mat('wood', c), 7.4, 1.4, 0, g);
    for (const mx of [-2.5, 2]) { K.cyl(0.12, 0.15, 11, K.mat('wood', '#6a4428'), mx, 2.2, 0, g); const s = K.add(new THREE.PlaneGeometry(4, 4.5, 6, 6), K.toon({ color: '#f4efe4', kind: 'fabric', side: THREE.DoubleSide }), mx, 8, 0.2, g); s.rotation.y = 0.15; }
    K.add(new THREE.PlaneGeometry(1.2, 0.8), K.toon({ color: '#d84a2a', plain: true, side: THREE.DoubleSide }), -2.5 + 0.62, 12.6, 0, g);
  }
  // houses behind the quay (and across for reverse shots)
  const cols = ['#a8483a', '#8a5a3a', '#6a3a2a', '#b86a4a', '#7a4a3a', '#c88a5a'];
  for (let i = 0; i < 12; i++) house(-40 + i * 7, 15, 6.6, 9 + (i * 3) % 5, cols[i % 6], 80 + i);
  // quay props: table, barrels, crates, nets, fish carts
  K.slab(TBL[0] - 0.6, TBL[0] + 0.6, 0.72, 0.78, TBL[2] - 0.45, TBL[2] + 0.45, K.mat('wood', '#a87444')); K.cyl(0.08, 0.1, 0.72, K.mat('wood', '#6a4428'), TBL[0], 0, TBL[2]);
  K.slab(TBL[0] - 0.35, TBL[0] + 0.35, 0, 0.45, TBL[2] + 0.6, TBL[2] + 1.0, K.mat('wood', '#6a4428'));  // stool
  PLATE = K.group(); PLATE.position.set(TBL[0] + 0.1, 0.79, TBL[2] + 0.1);
  K.cyl(0.2, 0.18, 0.03, K.toon({ color: '#e8eef4', plain: true }), 0, 0, 0, PLATE);
  const fishM = K.toon({ color: '#c8d0d8', plain: true, roughness: 0.3, metalness: 0.3 });
  const f1 = K.sphere(0.06, fishM, -0.06, 0.06, 0, PLATE, 2.2, 0.6, 0.8); K.add(new THREE.ConeGeometry(0.05, 0.08, 4).rotateZ(Math.PI / 2), fishM, -0.22, 0.06, 0, PLATE);
  BULB = K.group(); BULB.position.set(0.08, 0.08, 0.04); PLATE.add(BULB);
  K.sphere(0.07, K.toon({ color: '#8a4a5a', kind: 'fabric', amt: 0.2 }), 0, 0, 0, BULB, 1, 0.9, 1); K.add(new THREE.ConeGeometry(0.03, 0.08, 10), K.toon({ color: '#a86a5a', plain: true }), 0, 0.08, 0, BULB);
  K.sphere(0.04, K.toon({ color: '#f4efe4', plain: true }), 0.05, 0.02, 0.04, BULB);  // bitten white flesh
  for (const [x, z] of [[-9, 4.5], [-8.2, 5.0], [2, 6.5], [15, 5], [15.8, 5.6], [23, 3.5]]) { const b = K.cyl(0.38, 0.38, 0.95, K.mat('wood', '#8a5a34'), x, 0, z); b.name = 'barrel'; K.solid(b); }
  for (const [x, z] of [[-3, 6], [9, 7], [26, 6]]) { const c = K.slab(x - 0.5, x + 0.5, 0, 0.9, z - 0.5, z + 0.5, K.mat('wood', '#c69a5c', { detail: 0.7 })); c.name = 'crate'; K.solid(c); }
  for (const cx of [4, 12]) { const cart = K.group(); cart.position.set(cx, 0, 4.2);
    K.slab(-1.2, 1.2, 0.6, 1.0, -0.7, 0.7, K.mat('wood', '#a87444'), cart); for (const s of [-1, 1]) K.add(new THREE.TorusGeometry(0.35, 0.06, 8, 20), K.mat('wood', '#5a3a20'), 0, 0.35, s * 0.75, cart);
    for (let i = 0; i < 9; i++) K.sphere(0.07, K.toon({ color: i % 3 ? '#d8dce4' : '#e8a050', plain: true, roughness: 0.3, metalness: 0.2 }), -0.9 + (i % 5) * 0.4, 1.06, -0.3 + Math.floor(i / 5) * 0.4, cart, 2.4, 0.6, 0.8);
    D.sign(1.6, 0.4, D.txtTex(512, 128, '#e8dcc0', '#2a3a6a', ['FRESH FISH'], 'bold 70px Georgia, serif'), 0, 1.45, 0.72, 0, cart);
    cart.updateMatrixWorld(true); const bb = K.slab(cx - 1.2, cx + 1.2, 0, 1.0, 3.5, 4.9, K.toon({ color: '#000', plain: true })); bb.visible = false; bb.name = 'fish cart'; K.solid(bb); }
  for (let i = 0; i < 5; i++) { const f = K.sphere(0.08, fishM, 0, 0, 0, K.scene, 2.4, 0.6, 0.8); f.visible = false; FISHES.push(f); }
  K.slab(-12, -11, 0, 0.12, 3, 5, K.mat('fabric', '#6a5a4a', { detail: 0.1 })); // net
  for (let x = -30; x < 30; x += 6) K.cyl(0.18, 0.2, 0.7, K.mat('metal', '#3a3a3a'), x, 0, -1.6);   // bollards
  // market (x≈-60): stalls of tulips, price board, balance scale, windmill
  for (let i = 0; i < 3; i++) { const sx = MX - 5 + i * 5; K.slab(sx - 1.8, sx + 1.8, 0.8, 0.9, -1, 0.2, K.mat('wood', '#a87444'));
    K.add(new THREE.PlaneGeometry(4, 1.2), K.toon({ color: ['#c0392b', '#e8b830', '#8a3a8a'][i], kind: 'fabric', side: THREE.DoubleSide }), sx, 2.6, -0.4).rotation.x = -1.1;
    for (const px of [-1.2, 1.2]) K.cyl(0.05, 0.05, 2.7, K.mat('wood', '#6a4428'), sx + px, 0, -0.6);
    for (let j = 0; j < 7; j++) { const x = sx - 1.5 + j * 0.5, c = ['#e84a5f', '#f2c230', '#f4efe4', '#a83aa8', '#ff7a2a'][(i + j) % 5];
      K.cyl(0.11, 0.08, 0.18, K.mat('rock', '#b86a4a'), x, 0.9, -0.4); K.cyl(0.01, 0.01, 0.35, K.toon({ color: '#3a8a3a', plain: true }), x, 1.08, -0.4);
      K.add(new THREE.CylinderGeometry(0.07, 0.035, 0.12, 6, 1, true), K.toon({ color: c, plain: true, side: THREE.DoubleSide }), x, 1.48, -0.4); } }
  BOARD = K.group(); BOARD.position.set(MX + 7.5, 0, -0.5);
  K.cyl(0.07, 0.07, 3.6, K.mat('wood', '#6a4428'), -1.0, 0, 0, BOARD); K.cyl(0.07, 0.07, 3.6, K.mat('wood', '#6a4428'), 1.0, 0, 0, BOARD);
  BOARDTX = [D.txtTex(512, 384, '#1f3a2a', '#f2e6c0', ['1 BULB =', '1 HOUSE'], 'bold 86px Georgia, serif'), D.txtTex(512, 384, '#1f3a2a', '#f2e6c0', ['1 BULB =', '1 ONION'], 'bold 86px Georgia, serif')];
  BOARD.userData.face = D.sign(2.3, 1.7, BOARDTX[0], 0, 2.6, 0.09, 0, BOARD);
  SCALE = K.group(); SCALE.position.set(MX + 4.0, 0.9, -0.4);
  K.cyl(0.05, 0.08, 1.2, K.mat('metal', '#c8a040'), 0, 0, 0, SCALE); const beam = K.group(SCALE); beam.position.y = 1.2; SCALE.userData.beam = beam;
  K.slab(-0.7, 0.7, -0.02, 0.02, -0.02, 0.02, K.mat('metal', '#c8a040'), beam);
  for (const s of [-1, 1]) { const pan = K.group(beam); pan.position.x = s * 0.65; K.cyl(0.22, 0.18, 0.03, K.mat('metal', '#c8a040'), 0, -0.35, 0, pan); K.cyl(0.004, 0.004, 0.35, K.mat('metal', '#8a7a5a'), 0, -0.35, 0, pan); pan.userData.side = s; SCALE.userData['p' + s] = pan; }
  const hb = SCALE.userData.p1; K.slab(-0.12, 0.12, -0.32, -0.12, -0.1, 0.1, K.mat('brick', '#a8483a'), hb); K.add(new THREE.ConeGeometry(0.15, 0.12, 4), K.mat('wood', '#5a3a2a'), 0, -0.06, 0, hb).rotation.y = Math.PI / 4;
  const pb = SCALE.userData['p-1']; K.sphere(0.07, K.toon({ color: '#8a4a5a', kind: 'fabric' }), 0, -0.26, 0, pb); K.add(new THREE.ConeGeometry(0.03, 0.08, 10), K.toon({ color: '#a86a5a', plain: true }), 0, -0.18, 0, pb);
  K.slab(MX + 3.3, MX + 4.7, 0, 0.9, -0.8, 0, K.mat('wood', '#8a5a34'));
  MILL = K.group(); MILL.position.set(MX - 6, 0, 22);
  K.add(new THREE.CylinderGeometry(1.6, 2.6, 9, 8), K.mat('wood', '#7a5a3a'), 0, 4.5, 0, MILL); K.add(new THREE.ConeGeometry(1.9, 2.4, 8), K.mat('wood', '#4a3a2a'), 0, 10.2, 0, MILL);
  const hub = K.group(MILL); hub.position.set(0, 8.4, -2.0); MILL.userData.hub = hub;
  for (let i = 0; i < 4; i++) { const bl = K.slab(-0.35, 0.35, 0, 6, -0.05, 0.05, K.toon({ color: '#f4efe4', kind: 'fabric' }), hub); bl.geometry.translate(0, 0, 0); bl.rotation.z = i * Math.PI / 2; }
  K.slab(MX - 30, MX + 30, -0.38, 0.02, 18, 60, K.mat('grime', '#6aa84f', { amt: 0.5 }), K.scene, false);
  for (let r = 0; r < 6; r++) K.slab(MX - 20, MX + 10, 0.02, 0.18, 26 + r * 2.2, 27 + r * 2.2, K.toon({ color: ['#e84a5f', '#f2c230', '#a83aa8', '#ff7a2a', '#f4efe4', '#e84a5f'][r], plain: true }));
  BOX = K.group(); K.slab(-0.18, 0.18, 0, 0.2, -0.14, 0.14, K.mat('wood', '#c8a060'), BOX); K.sphere(0.06, K.toon({ color: '#8a4a5a', plain: true }), 0, 0.24, 0, BOX);
  // cast
  SAIL = K.stick(SAIL_O, { key: 'sail' }); MER = K.stick(MER_O, { key: 'mer' }); BAK = K.stick(BAK_O, { key: 'bak' }); FISH = K.stick(FISH_O, { key: 'fish' });
  TR = K.stick(TR_O, { key: 'tr' }); FARM = K.stick(FARM_O, { key: 'farm' }); LAF1 = K.stick(LAF1_O, { key: 'l1' }); LAF2 = K.stick(LAF2_O, { key: 'l2' });
  DOG = K.animal('dog', { seed: 3, color: '#c88a4a' });
  K.addClouds(14, 700, 160);
}

// chase paths (quay along +x, then onto the pier)
const RUN0 = () => W(2, 'runs') - 6;
const sailPath = [[TBL[0] + 0.6, TBL[2] + 0.9], [-4, 2.4], [7.5, 2.4], [17, 1.6], [20, -1], [20, -16.5]];
const chasePath = (dx) => [[TBL[0] - 1.8 + dx, TBL[2] + 0.4], [-4, 1.6 + dx * 0.2], [7.5, 1.6 + dx * 0.2], [17, 0.9], [20 + dx * 0.3, -1.5], [20 + dx * 0.3, -12.5 + dx * 0.6]];
function frame(f) {
  const T = K.T, fx = [];
  const SCR = W(1, 'screaming'), SW = W(6, 'swallows'), CRASH = W(12, 'crashed'), CORNER = L[6][0];
  const sp = K.walkPath(f, RUN0(), sailPath, 3.6, { endYaw: 0 });
  const runPose = sp.moving ? [[0, 'run', { expr: 'nervous', sweat: true, R: [0.4, -0.5, 'food'] }]] : null;
  // sailor
  if (f < RUN0()) D.act(K, SAIL, f, [[0, 'eat', { expr: 'smile', item: 'food' }], [W(1, 'merchant') - 2, 'eat', { expr: 'confused' }], [SCR, 'shock', { expr: 'shock' }], [W(2, 'grabs') - 4, 'grab', { expr: 'nervous', sweat: true }]], 1,
    { x: TBL[0] + 0.25, z: TBL[2] + 0.85, yaw: Math.PI, seat: 0.45 });
  else if (f >= L[11][0] - 4 && f < L[12][0] - 4 || f >= L[13][0] - 4) D.act(K, SAIL, f, [[0, 'hips', { expr: 'grin' }], [L[11][0] + 30, 'show', { expr: 'proud', R: [0.4, 0.1] }], [L[13][0] - 4, 'hips', { expr: 'laugh' }], [W(13, 'worth') - 4, 'shrug', { expr: 'grin' }]], 1, { x: 20, z: -16.5, yaw: 0 });
  else if (f >= CORNER - 2) D.act(K, SAIL, f, [[0, 'scared', { expr: 'scared', sweat: true }], [SW - 4, 'eat', { expr: 'nervous', item: 'food' }], [SW + 10, 'drink', { expr: 'relief' }], [L[7][0], 'hips', { expr: 'smile' }]], 1, { x: 20, z: -16.5, yaw: 0 });
  else D.act(K, SAIL, f, runPose || [[0, 'scared', { expr: 'scared' }]], 1, { x: sp.x, z: sp.z, yaw: sp.yaw });
  if (sp.moving) K.puff(f, Math.floor(f / 7) * 7, sp.x, sp.z, 4, 0.25, '#b8a890');
  // bulb on the plate shrinks as he eats; gone once he runs (he carries it)
  BULB.visible = f < RUN0(); BULB.scale.setScalar(f < W(1, 'bites') ? 1 : 0.8);
  // merchant + mob
  const mp = K.walkPath(f, RUN0() + 18, chasePath(0), 3.3, { endYaw: Math.PI });
  if (f < L[7][0] + 30 || (f >= L[11][0] - 4 && f < L[12][0] - 4) || f >= L[13][0] - 4) {
    const mk = mp.moving ? [[0, 'run', { expr: 'angry' }]] : f < RUN0() + 18 ? [[0, 'idle', { expr: 'smile' }], [W(1, 'merchant') - 4, 'shock', { expr: 'shock' }], [SCR - 2, 'panic', { expr: 'yell', talk: true }], [W(2, 'runs'), 'pointUp', { expr: 'angry' }]]
      : [[0, 'angry', { expr: 'yell' }], [SW - 2, 'shock', { expr: 'shock', sweat: true }], [L[7][0], 'facepalm', { expr: 'sad' }], [L[11][0], 'fall', { expr: 'dazed' }], [L[13][0] - 4, 'facepalm', { expr: 'dazed' }]];
    D.act(K, MER, f, mk, 2, mp.moving || f >= RUN0() + 18 ? { x: mp.x, z: mp.z, yaw: mp.moving ? mp.yaw : Math.PI } : { x: TBL[0] - 1.8, z: TBL[2] + 0.4, yaw: 0.9 });
    if (mp.moving) K.puff(f, Math.floor(f / 7) * 7 + 3, mp.x, mp.z, 4, 0.25, '#b8a890');
  } else MER.root.visible = false;
  // mob: baker, fishwife, dog
  [[BAK, 1.3, 3], [FISH, -1.3, 4]].forEach(([r, dx, sd], i) => { const p = K.walkPath(f, L[5][0] + 10 + i * 8, chasePath(dx), 3.0, { endYaw: Math.PI });
    if (f < L[5][0] + 10 || (f >= L[7][0] + 30 && f < L[11][0] - 4) || (f >= L[12][0] - 4 && f < L[13][0] - 4)) { r.root.visible = false; return; }
    D.act(K, r, f, p.moving ? [[0, 'run', { expr: i ? 'yell' : 'angry', R: i ? [0.4, -0.5, 'food'] : undefined }]] : [[0, 'angry', { expr: 'angry' }], [SW, 'shock', { expr: 'shock' }], [L[11][0], i ? 'ears' : 'facepalm', { expr: 'scared' }], [L[13][0], 'shrug', { expr: 'confused' }]], sd, { x: p.x, z: p.z, yaw: p.moving ? p.yaw : Math.PI });
    if (p.moving) K.puff(f, Math.floor(f / 7) * 7 + i, p.x, p.z, 4, 0.25, '#b8a890'); });
  const dp = K.walkPath(f, W(5, 'dog') - 10, chasePath(-0.5).map(([x, z]) => [x, z + 0.3]), 4.6, { endYaw: Math.PI });
  DOG.set(f, { visible: f >= W(5, 'dog') - 10 && f < L[7][0] + 30 || f >= L[13][0] - 4, x: dp.x, z: dp.z, yaw: dp.moving ? dp.yaw : Math.PI, mode: dp.moving ? 'run' : f > SW ? 'sit' : 'wag', expr: dp.moving ? 'angry' : 'happy', look: 0.3 * Math.sin(f / 9) });
  // laughing sailors on the quay edge by the ship
  D.act(K, LAF1, f, [[0, 'hips', { expr: 'smile' }], [L[4][0] - 4, 'laugh' in {} ? 'clap' : 'clap', { expr: 'laugh' }], [W(4, 'who') - 4, 'point', { expr: 'laugh', talk: true }], [L[5][0], 'cross', { expr: 'smile' }]], 6, { x: 9.2, z: -0.6, yaw: 0.4 });
  D.act(K, LAF2, f, [[0, 'cross', { expr: 'grin' }], [L[4][0] - 2, 'facepalm', { expr: 'laugh' }], [W(4, 'half') - 4, 'pointL', { expr: 'laugh' }], [L[5][0] + 6, 'shrug', { expr: 'grin' }]], 7, { x: 10.4, z: -0.4, yaw: -0.5 });
  // fish fly off the cart as the sailor passes cart 1
  const FT = W(3, 'fish') - 2; FISHES.forEach((m, i) => { const t = (f - FT) / 30; m.visible = t > 0 && t < 1.4; if (!m.visible) return; m.position.set(4 - 0.8 + i * 0.4 + t * 0.6, 1.1 + 3.0 * t - 4.9 * t * t * 1.0 + 0.0, 4.0 - t * 1.2 * (i % 2 ? 1 : -1)); m.rotation.set(t * 8 + i, t * 5, 0); if (m.position.y < 0.05) m.position.y = 0.05; });
  // market people
  const traders = [[0, 'show', { expr: 'excited', R: [0.42, -0.6, 'money'] }], [W(8, 'crazy') - 4, 'cheer', { expr: 'laugh' }], [L[9][0] - 4, 'pointUp', { expr: 'proud', talk: true }], [L[10][0] - 4, 'show', { R: [0.42, -0.6, 'paper'], expr: 'grin' }],
    [L[10][0] + 50, 'hold', { R: [0.3, 0.3, 'moneybag'], expr: 'excited' }], [CRASH - 4, 'shock', { expr: 'shock' }], [CRASH + 10, 'panic', { expr: 'scared', sweat: true }]];
  D.act(K, TR, f, traders, 8, { x: MX + 6.3, z: 0.6, yaw: 0.3 });
  D.act(K, FARM, f, [[0, 'show', { R: [0.42, -0.6, 'moneybag'], expr: 'excited' }], [W(8, 'crazy'), 'celebrate', { expr: 'excited' }], [L[10][0] - 4, 'reach', { expr: 'smile' }],
    [W(10, 'flowers') - 4, 'carry', { item: 'box', expr: 'confused' }], [W(10, 'seen') - 2, 'shrug', { expr: 'confused' }], [CRASH - 4, 'facepalm', { expr: 'sad' }], [CRASH + 12, 'scared', { expr: 'scared' }]], 9, { x: MX + 4.6, z: 1.6, yaw: Math.PI * 0.8 });
  // scale tips to the bulb, board flips on the crash
  SCALE.userData.beam.rotation.z = f > W(9, 'bulb') ? 0.28 * sm(W(9, 'bulb'), W(9, 'bulb') + 14, f) : -0.1; [-1, 1].forEach((s) => { SCALE.userData['p' + s].rotation.z = -SCALE.userData.beam.rotation.z; });
  BOARD.userData.face.material.map = f >= CRASH ? BOARDTX[1] : BOARDTX[0]; BOARD.rotation.z = f >= CRASH ? 0.18 * sm(CRASH, CRASH + 8, f) : 0;
  MILL.userData.hub.rotation.z = f * 0.03;
  BOX.position.set(MX + 4.9, 1.05 + (f > W(10, 'flowers') - 4 ? 0 : -3), 2.05);
  // ---------- shots ----------
  const sx = sp.x, sz = sp.z;
  const S = [
    [0, (u) => ({ pos: [TBL[0] + 0.7, 1.5, TBL[2] - 1.3], look: [TBL[0] + 0.25, 1.2, TBL[2] + 0.85], fov: 40, cinf: 12 })],
    [W(0, 'breakfast') - 4, (u) => ({ pos: [TBL[0] + 0.5, 1.1, TBL[2] + 0.75], look: [TBL[0] + 0.15, 0.82, TBL[2] + 0.1], fov: 34, cinf: 18 })],
    [L[1][0] - 4, (u) => ({ pos: [TBL[0] - 0.9, 1.35, TBL[2] - 1.0], look: [TBL[0] + 0.25, 1.2, TBL[2] + 0.85], fov: 40, cinf: 10 })],
    [W(1, 'merchant') - 3, (u) => ({ pos: [TBL[0] - 0.5, 1.6, TBL[2] + 2.3], look: [TBL[0] - 1.8, 1.55, TBL[2] + 0.4], fov: 36 * K.punch(f, SCR, 0.22, 6), cinf: 14, noPush: true })],
    [L[2][0] - 4, (u) => { const t = K.track(f, (g) => { const p = K.walkPath(g, RUN0(), sailPath, 3.6); return [p.x, 0, p.z]; }, { off: [3.5, 1.5, 4.0], lag: 6, lookY: 1.0 }); return { pos: t.pos, look: t.look, fov: 44, cinf: 8 }; }, { whip: true }],
    [L[3][0] - 4, (u) => { const t = K.track(f, (g) => { const p = K.walkPath(g, RUN0(), sailPath, 3.6); return [p.x, 0, p.z]; }, { off: [-5, 2.6, 6.5], lag: 8, lookY: 0.8 }); return { pos: t.pos, look: t.look, fov: 46, cinf: 6 }; }],
    [W(3, 'fish') - 6, (u) => ({ pos: [lerp(6.5, 7.2, u), 0.6, 1.6], look: [3.6, 1.2, 3.4], fov: 46, cinf: 8 })],
    [L[4][0] - 4, (u) => ({ pos: [9.8, 1.6, 2.6], look: [9.8, 1.5, -0.5], fov: 40, cinf: 10 }), { whip: true }],
    [W(4, 'who') - 4, (u) => ({ pos: [10.9, 1.6, 1.6], look: [10.3, 1.55, -0.4], fov: 36, cinf: 14 })],
    [L[5][0] - 4, (u) => ({ pos: [lerp(17, 16, u), 1.6, 6.5], look: [mp.x, 1.3, mp.z], fov: 46, cinf: 6 }), { whip: true }],
    [W(5, 'baker') - 4, (u) => { const t = K.track(f, (g) => { const p = K.walkPath(g, L[5][0] + 10, chasePath(1.3), 3.0); return [p.x, 0, p.z]; }, { off: [3.6, 1.4, 3.2], lag: 5 }); return { pos: t.pos, look: t.look, fov: 42, cinf: 10 }; }],
    [W(5, 'dog') - 4, (u) => { const t = K.track(f, (g) => { const p = K.walkPath(g, W(5, 'dog') - 10, chasePath(-0.5).map(([x, z]) => [x, z + 0.3]), 4.6); return [p.x, 0, p.z]; }, { off: [2.4, 0.6, 2.2], lag: 4, lookY: 0.4 }); return { pos: t.pos, look: t.look, fov: 44, cinf: 10 }; }],
    [L[6][0] - 4, (u) => ({ pos: [24.5, 3.2, -21], look: [20, 1.0, -12], fov: 48, cinf: 5 }), { whip: true }],
    [W(6, 'swallows') - 4, (u) => ({ pos: [20.6, 1.6, -14.6], look: [20, 1.6, -16.5], fov: 36 * K.punch(f, SW, 0.22, 6), cinf: 14, noPush: true })],
    [L[7][0] - 4, (u) => ({ pos: [19.0, 1.7, -14.9], look: [20, 1.6, -12.5], fov: 38, cinf: 12 })],
    [L[8][0] - 4, (u) => ({ pos: [MX + lerp(-6, -4, u), 1.6, 2.4], look: [MX - 4, 1.2, -0.4], fov: 40, cinf: 12 }), { whip: true }],
    [W(8, 'holland') - 4, (u) => ({ pos: [MX + 3, lerp(3.5, 2.6, u), 8.5], look: [MX + 5, 1.4, 0.6], fov: 48, cinf: 5 })],
    [L[9][0] - 4, (u) => ({ pos: [MX + 4.0, 2.1, 3.4], look: [MX + 4.0, 1.8, -0.4], fov: 34, cinf: 14 }), { whip: true }],
    [W(9, 'horse') - 4, (u) => ({ pos: [MX + 6.6, 2.0, 5.0], look: [MX + 7.3, 2.1, -0.4], fov: 42, cinf: 10 })],
    [L[10][0] - 4, (u) => ({ pos: [MX + 2.0, 1.7, 4.6], look: [MX + 5.4, 1.4, 1.1], fov: 42, cinf: 8 }), { whip: true }],
    [W(10, 'flowers') - 4, (u) => ({ pos: [MX + 5.0, 1.6, 3.6], look: [MX + 4.7, 1.35, 1.7], fov: 38, cinf: 14 })],
    [L[11][0] - 4, (u) => ({ pos: [lerp(22.4, 21.8, u), 1.5, -14.0], look: [20, 1.3, -16.5], fov: 40, cinf: 12 }), { whip: true }],
    [W(11, 'priciest') - 4, (u) => ({ pos: [18.0, 1.7, -10.8], look: [20, 0.5, -12.5], fov: 40, cinf: 12 })],
    [L[12][0] - 4, (u) => { const [s1, s2] = K.shake(f, CRASH, 0.08, 14); return { pos: [MX + 7.5 + s1, 2.6 + s2, 4.6], look: [MX + 7.5, 2.5, -0.4], fov: 40 * K.punch(f, CRASH, 0.2, 6), cinf: 12, noPush: true }; }, { whip: true }],
    [CRASH + 18, (u) => ({ pos: [MX + 5.5, 1.7, 4.4], look: [MX + 5.2, 1.5, 1.2], fov: 40, cinf: 10 })],
    [L[13][0] - 4, (u) => ({ pos: [21.2, 1.6, -14.0], look: [20, 1.4, -16.5], fov: 40, cinf: 10 }), { whip: true }],
    [W(13, 'worth') - 4, (u) => ({ pos: [TBL[0] + 0.9, 1.45, TBL[2] - 1.2], look: [TBL[0] + 0.25, 1.2, TBL[2] + 0.85], fov: 42, cinf: 12 }), { whip: true }],
  ];
  // last shot: back at the breakfast table (loop) - the sailor sits down again with a new "onion"
  const R = D.runShots(S, f, TOTAL), cam = R.cam;
  if (R.id === 26) { D.act(K, SAIL, f, [[0, 'eat', { expr: 'smile', item: 'food' }]], 1, { x: TBL[0] + 0.25, z: TBL[2] + 0.85, yaw: Math.PI, seat: 0.45 }); BULB.visible = true; MER.root.visible = false; BAK.root.visible = false; FISH.root.visible = false; DOG.set(f, { visible: false }); }
  if (R.id === 17) D.card(fx, f, W(9, 'house'), '1 BULB = 1 HOUSE', cam, '#f6c83a', 150, 50, 0.55);
  if (R.id === 23) D.card(fx, f, CRASH, 'CRASH!', cam, '#ff5a3a', 210, 40, 0.5);
  return { light: EXT, cam, dof: R.dof, actors: [], fx };
}
export default { TOTAL, look: 'rich', build, frame };
