// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why did a copy of the Cardiff Giant beat the original fake?" (true story: Cardiff, New York, 1869. Farmhands digging
// a well on Stub Newell's farm found a 10-foot stone man; George Hull had it carved and buried as a hoax. P. T. Barnum was
// refused, built his own plaster copy, showed it in New York and outdrew the original.)
// Sets: an autumn farm (day + a night flashback) with the well pit and a show tent, and Barnum's lamp-lit exhibition hall.
import { TOTAL, LINES, wf } from './cardiffgiant_timing.js';
import * as PR from '../props.js';
import * as D from './d19.js';
import * as X from './kit3d.js';
const { clamp, lerp, sm } = D;
export { TOTAL };
const L = LINES, W = wf;
let K, G1, G2, SHOV = [], TRIPOD, ROPES = [], DIRT, COINS, WAGONS = [], WHORSES = [], HAMMER2, LANT;
let FH1, FH2, FARM, V1, V2, V3, SCI, BAR, HULL;
const FH1_O = { jacket: '#3a6ea5', pants: '#5a4a3a', boots: '#3a2a1a', hat: 'cap', cap: '#8a3a2a', scarf: '#f2c230', gloves: '#c8a878', pockets: true };
const FH2_O = { jacket: '#c87a3a', pants: '#3a4a5a', boots: '#2a1a12', hat: 'cowboy', hatColor: '#d8c088', vest: '#5a6a3a', belt: '#2a1a12', moustache: '#6a3a1a' };
const FARM_O = { jacket: '#7a3a5a', pants: '#3a3a40', boots: '#1e1a18', hat: 'beanie', hatColor: '#2a6a4a', moustache: '#e8e0d0', hair: '#e8e0d0', apron: '#d8c8a8', glasses: '#333' };
const V1_O = { jacket: '#2a7a8a', dress: '#2a7a8a', hairStyle: 'bun', hair: '#6a3a1a', scarf: '#e84a5f', collar: '#ffffff' };
const V2_O = { jacket: '#5a4a6a', pants: '#2a2a30', boots: '#111', hat: 'tophat', hatColor: '#6a4a2a', tie: '#c0392b', pockets: true, moustache: '#2a1a12' };
const V3_O = { jacket: '#e8c040', dress: '#e8c040', hairStyle: 'curly', hair: '#2a1a12', apron: '#ffffff', glasses: true };
const SCI_O = { jacket: '#f2efe8', pants: '#3a3a44', boots: '#1e1a18', hairStyle: 'spiky', hair: '#9a9a9a', glasses: '#333', bowtie: '#2a5a8a', vest: '#8a7a5a' };
const BAR_O = { jacket: '#5a2a7a', pants: '#2a2a30', boots: '#111', hat: 'tophat', hatColor: '#c0392b', moustache: '#3a2a1a', bowtie: '#f2c230', vest: '#f2c230', gloves: '#ffffff' };
const HULL_O = { jacket: '#2a3a2a', pants: '#4a3a2a', boots: '#2a1a12', hat: 'police', hatColor: '#3a3a3a', scarf: '#8a2a8a', glasses: true, belt: '#111', moustache: '#4a2a1a' };
const DAY = { az: 50, el: 36, sky: '#d8e8f4', ground: '#8a7a50', hemi: 1.0, sun: '#ffe8c8', sunI: 3.2, skyTop: '#4f8ad8', skyHor: '#f0e6d8', fog: '#e8e0d4', fogNear: 50, fogFar: 280,
  sat: 1.18, vig: 0.24, shadowExt: 16, exposure: 1.12, ink: 0.55, bloom: 0.6 };
const NIGHT = { az: 50, el: 40, sky: '#1a2440', ground: '#1a1a20', hemi: 0.55, sun: '#9ab0ff', sunI: 1.0, skyTop: '#0a1028', skyHor: '#2a3460', fog: '#141a30', fogNear: 20, fogFar: 120,
  sat: 1.1, vig: 0.32, shadowExt: 14, exposure: 1.5, ink: 0.55, bloom: 0.75, cardTint: '#e0e8ff' };
const HALL = { az: 80, el: 60, sky: '#2a1a12', ground: '#2a1a12', hemi: 0.6, sun: '#ffd8a8', sunI: 0.0, skyTop: '#1a120c', skyHor: '#1a120c', fog: '#1a120c', fogNear: 14, fogFar: 50,
  sat: 1.1, vig: 0.3, shadowExt: 14, exposure: 1.5, bloom: 0.55, ink: 0.55, cardTint: '#fff0e0' };
const MX = 200;                       // museum hall origin
const TENT = [14, 0, 1];              // show tent centre (open toward +z)

function giant(col, key) {
  const r = K.stick({ jacket: col, pants: col, boots: col, skin: col, collar: false }, { key, rim: 0.3 });
  r.root.userData.base = 2.0; return r;
}
// lay a giant on its side, curled, its middle at (x, y, z)
function lay(r, f, x, y, z, yaw = 0, expr = 'sleepy') {
  r.set(K.T.act(f, [[0, 'crouch', { expr }]], { seed: 1 }), { x, y, z, yaw });
  r.root.rotation.set(0, yaw, Math.PI / 2); r.root.position.set(x + 1.5 * Math.cos(yaw), y, z - 1.5 * Math.sin(yaw));
}

function build(k) {
  K = k; D.init(K); X.init(K); const { THREE } = K;
  // ---- farm ground with the well pit (x -1.9..1.9, z -1.2..1.2, 1.6 deep) ----
  const dirt = K.mat('dirt', '#8a6a44', { detail: 0.7 }), grass = K.mat('grime', '#8aa04a', { amt: 0.55, detail: 2 });
  K.slab(-120, -1.9, -0.3, 0, -120, 120, grass, K.scene, false); K.slab(1.9, 160, -0.3, 0, -120, 120, grass, K.scene, false);
  K.slab(-1.9, 1.9, -0.3, 0, -120, -1.2, grass, K.scene, false); K.slab(-1.9, 1.9, -0.3, 0, 1.2, 120, grass, K.scene, false);
  K.slab(-1.9, 1.9, -1.1, -1.0, -1.2, 1.2, dirt, K.scene, false);
  for (const [a, b, c, d] of [[-1.95, -1.9, -1.2, 1.2], [1.9, 1.95, -1.2, 1.2]]) K.slab(a, b, -1.0, 0, c, d, dirt, K.scene, false);
  for (const z of [-1.25, 1.2]) K.slab(-1.95, 1.95, -1.0, 0, z, z + 0.05, dirt, K.scene, false);
  for (const [a, b, c, d] of [[-3.2, -1.9, -2.6, 2.6], [1.9, 3.2, -2.6, 2.6], [-1.9, 1.9, -2.6, -1.2], [-1.9, 1.9, 1.2, 2.6]]) K.slab(a, b, -0.02, 0.03, c, d, dirt, K.scene, false);
  for (const [x, z, s] of [[-2.6, 1.6, 0.6], [2.4, -1.8, 0.7], [2.7, 1.5, 0.5]]) K.sphere(s, dirt, x, 0, z, K.scene, 1.4, 0.6, 1.1);   // dirt piles
  DIRT = K.slab(-1.85, 1.85, -1.0, -0.3, -1.15, 1.15, K.mat('dirt', '#7a5a3a'), K.scene, false);                                       // fill that gets dug out
  // tripod hoist (flash-forward)
  TRIPOD = K.group(); const tw = K.mat('wood', '#7a5434');
  for (const [x, z] of [[-2.4, -1.6], [2.4, -1.6], [0, 2.2]]) K.beam(new THREE.Vector3(x, 0, z), new THREE.Vector3(0, 4.4, 0), 0.08, tw, TRIPOD);
  K.cyl(0.14, 0.14, 0.2, K.mat('metal', '#5a5a5a'), 0, 4.2, 0, TRIPOD);
  for (let i = 0; i < 2; i++) { const r = K.slab(-0.02, 0.02, 0, 1, -0.02, 0.02, K.toon({ color: '#c8a868', plain: true }), K.scene); ROPES.push(r); }
  // farmhouse, barn, haystacks, autumn trees, fences, pumpkins, a sign
  K.add(new THREE.BoxGeometry(8, 5, 6), K.toon({ map: PR.facadeTex('#e8e0d0', 3, 2, 3, '#7a3a2a'), kind: 'plaster', amt: 0.1 }), -13, 2.5, -14);
  K.add(new THREE.ConeGeometry(6.2, 3, 4), K.mat('metal', '#5a3a3a'), -13, 6.5, -14).rotation.y = Math.PI / 4;
  K.slab(6, 14, 0, 6, -20, -13, K.mat('wood', '#a8322a', { detail: 1.6 })); K.slab(5.6, 14.4, 6, 6.4, -20.4, -12.6, K.mat('metal', '#4a4a4a')); K.slab(8.5, 11.5, 0, 4, -12.95, -12.9, K.mat('wood', '#e8dcc4'));
  for (const [x, z] of [[-6, -8], [-7.5, -6.5], [4, -9]]) K.cyl(1.1, 1.3, 1.6, K.mat('fabric', '#e0c060', { detail: 0.15 }), x, 0, z);
  const r = X.rnd(11), bark = K.mat('wood', '#5a3a24'), leafs = ['#e07a2a', '#c8462a', '#e8b030', '#8aa040'].map((c) => K.mat('grime', c, { amt: 0.5 }));
  for (let i = 0; i < 40; i++) { const a = r() * Math.PI * 2, d = 18 + r() * 40; X.tree(Math.cos(a) * d, Math.sin(a) * d - 6, 1.5 + r() * 1.2, bark, leafs[i % 4], K.scene, r); }
  const fw = K.mat('wood', '#b89a70'); X.fence(-30, 30, 9.5, 1.0, fw); X.fence(-30, -6, -5.5, 1.0, fw);
  for (const [x, z] of [[-4, 7.5], [-3.2, 8], [5, 8.2], [21, 7.6]]) K.sphere(0.32, K.mat('grime', '#e8781a'), x, 0.25, z, K.scene, 1, 0.8, 1);
  K.slab(-60, 80, -0.01, 0.02, 10.5, 14, K.mat('dirt', '#a88a64', { detail: 0.8 }), K.scene, false);                                   // the road
  // show tent (striped canvas), platform, sign, rope line, ticket box
  const stripe = PR.canvasTex(512, 256, (g, w, h) => { for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#f4efe4' : '#c0392b'; g.fillRect(i * w / 16, 0, w / 16 + 1, h); } });
  const canvas = K.toon({ map: stripe, kind: 'fabric', amt: 0.1, side: THREE.DoubleSide });
  const tw2 = K.add(new THREE.CylinderGeometry(4.2, 4.2, 3, 32, 1, true, Math.PI * 0.25, Math.PI * 1.5), canvas, TENT[0], 1.5, TENT[2]);
  K.add(new THREE.ConeGeometry(4.6, 2.6, 32), canvas, TENT[0], 4.3, TENT[2]);
  K.cyl(0.1, 0.1, 6.2, K.mat('wood', '#6a4428'), TENT[0], 0, TENT[2] - 2);
  K.slab(TENT[0] - 2.4, TENT[0] + 2.4, 0, 0.4, TENT[2] - 2.4, TENT[2] + 0.2, K.mat('wood', '#8a5a34'));
  const tsign = K.group(); tsign.position.set(TENT[0] + 4.6, 0, TENT[2] + 4.4); K.cyl(0.06, 0.06, 2.2, K.mat('wood', '#6a4428'), -0.8, 0, 0, tsign); K.cyl(0.06, 0.06, 2.2, K.mat('wood', '#6a4428'), 0.8, 0, 0, tsign);
  D.sign(2.0, 1.1, D.txtTex(512, 280, '#f2e6c0', '#7a1a1a', ['SEE THE GIANT', '50 CENTS'], 'bold 70px Georgia, serif'), 0, 1.75, 0.08, -0.3, tsign); tsign.rotation.y = -0.3;
  K.solid(tsign);
  COINS = K.group(); COINS.position.set(TENT[0] + 2.8, 0, TENT[2] + 4.0);
  K.slab(-0.45, 0.45, 0, 0.9, -0.3, 0.3, K.mat('wood', '#6a4428'), COINS); K.solid(COINS);
  for (let i = 0; i < 26; i++) K.cyl(0.05, 0.05, 0.015, K.toon({ color: '#d8b850', plain: true, roughness: 0.3 }), -0.3 + (i % 6) * 0.11, 0.9 + Math.floor(i / 6) * 0.016, -0.15 + (i % 3) * 0.1, COINS);
  for (let x = TENT[0] - 1; x <= TENT[0] + 2; x += 1.4) K.cyl(0.05, 0.05, 1.0, K.mat('metal', '#3a3a3a'), x, 0, TENT[2] + 6.5);
  K.slab(TENT[0] - 1, TENT[0] + 1.8, 0.85, 0.9, TENT[2] + 6.48, TENT[2] + 6.52, K.toon({ color: '#c0392b', plain: true }));
  // wagons jammed on the road
  for (let i = 0; i < 6; i++) { const wg = K.group(); wg.position.set(-30 + i * 9, 0, 12.2); const c = ['#3a6ea5', '#8a3a2a', '#5a7a3a'][i % 3];
    K.slab(-1.6, 1.6, 0.7, 1.4, -0.8, 0.8, K.mat('wood', c), wg); K.add(new THREE.CylinderGeometry(0.95, 0.95, 3.0, 16, 1, false, 0, Math.PI), K.mat('fabric', '#efe6d0'), 0, 1.4, 0, wg).rotation.z = Math.PI / 2;
    for (const x of [-1.1, 1.1]) for (const z of [-0.85, 0.85]) { const w = K.cyl(0.5, 0.5, 0.07, K.mat('wood', '#5a3a24'), x, 0.5, z, wg); w.rotation.x = Math.PI / 2; w.position.y = 0.5; }
    WAGONS.push(wg); WHORSES.push(K.animal('horse', { seed: 20 + i, color: ['#6a4228', '#3a2a20', '#c8a878'][i % 3], scale: 1.1 })); }
  // ---- Barnum's exhibition hall at x = MX ----
  const plaster = K.mat('plaster', '#d8c8a8'), red = K.mat('fabric', '#8a1a2a', { detail: 0.2 });
  K.slab(MX - 10, MX + 10, -0.2, 0, -10, 10, K.mat('wood', '#7a4a2a', { detail: 0.5 }), K.scene, false);
  K.slab(MX - 10, MX + 10, 0, 7, -8.2, -8, plaster); K.slab(MX - 10.2, MX - 10, 0, 7, -8, 10, plaster); K.slab(MX + 10, MX + 10.2, 0, 7, -8, 10, plaster); K.slab(MX - 10, MX + 10, 7, 7.2, -8, 10, K.mat('wood', '#5a3420'));
  K.slab(MX - 10, MX + 10, 0, 7, 10, 10.2, plaster);
  for (const x of [-8, -4, 4, 8]) K.slab(MX + x - 0.9, MX + x + 0.9, 1.5, 6.8, -7.95, -7.8, red);
  D.sign(7, 1.3, D.txtTex(1024, 190, '#8a1a2a', '#f6d860', ['THE ONE TRUE GIANT!'], 'bold 110px Georgia, serif'), MX, 5.4, -7.75, 0, K.scene, 'fabric');
  K.slab(MX - 3, MX + 3, 0, 0.7, -5.4, -2.2, K.mat('wood', '#5a3420')); K.slab(MX - 3.1, MX + 3.1, 0.7, 0.78, -5.5, -2.1, red);
  for (let x = -4; x <= 4; x += 2) K.cyl(0.06, 0.08, 1.0, K.toon({ color: '#d8a840', plain: true, roughness: 0.3 }), MX + x, 0, -0.9);
  K.slab(MX - 4, MX + 4, 0.8, 0.88, -0.93, -0.87, red);
  for (const [x, z] of [[-8, 4], [8, 4], [-8.5, -6.5], [8.5, -6.5]]) { K.cyl(0.4, 0.5, 1.4, K.mat('rock', '#c8c0b0'), MX + x, 0, z); K.sphere(0.35, K.toon({ color: '#3a7a3a', plain: true }), MX + x, 1.7, z); }
  const tb = K.group(); tb.position.set(MX + 6.5, 0, 6); K.slab(-1, 1, 0, 1.2, -0.6, 0.6, K.mat('wood', '#6a4428'), tb); D.sign(1.8, 0.5, D.txtTex(512, 140, '#f2e6c0', '#7a1a1a', ['TICKETS'], 'bold 90px Georgia, serif'), 0, 1.6, 0.62, 0, tb); K.solid(tb);
  for (let i = 0; i < 40; i++) K.cyl(0.05, 0.05, 0.015, K.toon({ color: '#d8b850', plain: true, roughness: 0.3 }), MX + 6.5 - 0.6 + (i % 8) * 0.16, 1.2 + Math.floor(i / 8) * 0.02, 6 + ((i * 7) % 5) * 0.1 - 0.2);
  K.lamp(MX - 3, 4.2, -2.5, { color: '#ffd8a0', intensity: 4.2, distance: 13 }); K.lamp(MX + 3, 4.2, -2.5, { color: '#ffd8a0', intensity: 4.2, distance: 13 });
  K.lamp(MX + 5, 3.5, 5, { color: '#ffcf90', intensity: 2.6, distance: 10 });
  K.shaft([MX, 6.9, -3.5], [MX, 0.8, -3.6], 0.4, 2.2, '#ffe0b0', 0.12); K.dust([MX, 3, -2], [8, 4, 6], 120);
  LANT = K.lamp(0, -50, 0, { color: '#ffb060', intensity: 3.0, distance: 9, flicker: 0.15 });
  // giants
  G1 = giant('#b4ad9e', 'g1'); G2 = giant('#ecebe2', 'g2');
  // shovels + hammer props
  const shovel = () => { const g = K.group(); K.cyl(0.025, 0.025, 1.3, K.mat('wood', '#8a6a44'), 0, -0.9, 0, g); K.slab(-0.13, 0.13, -1.25, -0.9, -0.02, 0.02, K.mat('metal', '#8a8a92'), g); return g; };
  SHOV = [shovel(), shovel(), shovel()];
  FH1 = K.stick(FH1_O, { key: 'fh1' }); FH2 = K.stick(FH2_O, { key: 'fh2' }); FARM = K.stick(FARM_O, { key: 'farm' }); V1 = K.stick(V1_O, { key: 'v1' }); V2 = K.stick(V2_O, { key: 'v2' }); V3 = K.stick(V3_O, { key: 'v3' });
  SCI = K.stick(SCI_O, { key: 'sci' }); BAR = K.stick(BAR_O, { key: 'bar' }); HULL = K.stick(HULL_O, { key: 'hull' });
  K.addClouds(10, 700, 160);
}

const hide = (...rs) => rs.forEach((r) => { r.root.visible = false; });
function frame(f) {
  const fx = [];
  const FF1 = L[1][0] - 4, NGT0 = L[11][0] - 4, NGT1 = L[12][0] - 4, HALL0 = W(8, 'plaster') - 4;
  const FOOT = W(1, 'foot'), TEN = W(2, 'ten');
  const inHall = (f >= HALL0 && f < NGT0) || (f >= W(12, 'Barnum') - 4 && f < L[13][0] - 4);
  const night = f >= NGT0 && f < NGT1;
  // ---------- the original giant ----------
  let gy = -0.45; const hoist = f < FF1;
  if (hoist) gy = lerp(0.7, 1.5, sm(0, FF1, f));
  const inTent = f >= L[4][0] - 4 && !night;
  if (inTent) lay(G1, f, TENT[0] - 0.1, 0.95, TENT[2] - 1.1, 0);
  else lay(G1, f, 0, gy, 0, 0);
  DIRT.visible = false;   // dirt dug out of the pit
  if (night) { DIRT.visible = f >= W(11, 'buried') - 6; DIRT.position.y = lerp(-0.6, 0.3, sm(W(11, 'buried') - 6, NGT1, f)); }
  TRIPOD.visible = hoist;
  ROPES.forEach((rp, i) => { rp.visible = hoist; const top = new K.THREE.Vector3(0, 4.2, 0), bot = new K.THREE.Vector3(i ? 0.6 : -1.2, gy + 0.45, 0); rp.position.copy(top); rp.scale.y = top.distanceTo(bot); rp.lookAt(bot); rp.rotateX(-Math.PI / 2); });
  // Barnum's copy (in his hall, from "plaster" on)
  G2.root.visible = false; if (f >= W(8, 'plaster') - 10) lay(G2, f, MX - 0.1, 1.33, -3.8, 0, f > W(10, 'Barnum') ? 'smile' : 'sleepy');
  // ---------- farm people ----------
  SHOV.forEach((s) => { s.visible = false; });
  const digB = (f0, n, up) => { const k = []; for (let t = f0, j = 0; t < f0 + n; t += 12, j++) k.push([t, j % 2 ? 'crouch' : 'dig', { expr: up }]); return k; };
  if (!inHall) {
    // farmhands: dig in the pit, then haul on the hoist, later in the crowd
    const fhK = (s) => [...(hoist ? [[0, 'grab', { expr: 'nervous', sweat: true }], [30 + s, 'push', { expr: 'pained', sweat: true }]] : []), ...digB(FF1, FOOT - FF1, 'smile'),
      [FOOT - 3 + s, 'shock', { expr: 'shock' }], [W(2, 'leg') - 2, 'scared', { expr: 'scared', sweat: true }], [TEN - 3 + s, 'panic', { expr: 'scared', sweat: true }], [W(2, 'curled') + s, 'pointDown', { expr: 'shock' }],
      [L[3][0], 'cheer', { expr: 'excited' }], [L[4][0], 'idle', { expr: 'smile' }]];
    if (f < L[4][0] - 4 || night === false && f < L[4][0] + 60) {
      D.act(K, FH1, f, fhK(0), 3, { x: -0.9, z: hoist ? -2.3 : -1.65, yaw: hoist ? 0 : 0.2 });
      D.act(K, FH2, f, fhK(5), 4, { x: 1.0, z: hoist ? 2.2 : 1.65, yaw: hoist ? Math.PI : Math.PI - 0.2 });
      if (!hoist && f < L[3][0]) { X.holdAt(FH1, SHOV[0], 1, [0.3, 0, 0.2]); X.holdAt(FH2, SHOV[1], 1, [0.3, 0, -0.2]); }
      if (f < L[3][0]) { const ph = (f % 12) / 12; if (ph < 0.1) K.puff(f, f - 1, 0.3, 0, 5, 0.3, '#8a6a44'); }
    } else hide(FH1, FH2);
    // farmer: hoist boss, then tent showman
    const fp = f < L[4][0] - 4 ? (hoist ? [-3.0, 0, 2.2, 2.3] : [3.0, 0, 2.0, -2.2]) : [TENT[0] + 2.4, 0, TENT[2] + 3.2, -0.6];
    D.act(K, FARM, f, [[0, 'pointUp', { expr: 'nervous', sweat: true, talk: true }], [W(0, 'Cardiff'), 'cheer', { expr: 'excited' }], [FF1, 'hips', { expr: 'neutral' }], [FOOT, 'shock', { expr: 'shock' }], [TEN - 2, 'celebrate', { expr: 'excited' }],
      [L[3][0], 'pointDown', { expr: 'grin' }], [L[4][0] - 4, 'hammer', { expr: 'grin', R: [0.3, 0.3, 'hammer'] }], [W(4, 'fifty') - 4, 'show', { R: [0.42, -0.6, 'moneybag'], expr: 'laugh' }], [L[5][0], 'cheer', { expr: 'laugh' }],
      [L[6][0], 'cross', { expr: 'stern' }], [W(7, 'Barnum') + 10, 'think', { expr: 'confused' }], [W(7, 'fifty') - 2, 'shock', { expr: 'shock' }], [L[8][0] - 4, 'cross', { expr: 'angry' }], [W(8, 'no') , 'stop', { expr: 'angry', talk: true }],
      [L[10][0], 'shrug', { expr: 'nervous', sweat: true }], [W(10, 'original') - 2, 'facepalm', { expr: 'sad', sweat: true }], [L[13][0], 'think', { expr: 'confused' }]], 5, night ? { x: 0, z: -40, visible: false } : { x: fp[0], z: fp[2], y: fp[1], yaw: fp[3] });
    // visitors: walk the queue to the tent, then react inside
    const Q = [[-8, 12.5], [4, 12.2], [TENT[0] + 1, 9.0], [TENT[0] + 0.6, 4.6]];
    [[V1, 21, 0], [V2, 22, 30], [V3, 23, 60]].forEach(([rig, sd, dl], i) => {
      if (night || f < L[3][0] - 10) { hide(rig); return; }
      const wp = K.walkPath(f, L[3][0] - 10 + dl * 0.4, Q.map(([x, z]) => [x - i * 1.6, z + (i % 2) * 0.3]), 2.2, { endYaw: Math.PI });
      const inside = f >= L[6][0] - 6;
      const pos = inside ? { x: TENT[0] - 1.6 + i * 1.5, z: TENT[2] + 1.6 + (i % 2) * 0.4, yaw: Math.PI + (i - 1) * 0.3 } : { x: wp.x, z: wp.z, yaw: wp.yaw };
      const keys = !inside && wp.moving ? [[0, 'walk', { expr: i === 1 ? 'grin' : 'excited' }]] :
        [[0, 'pointL', { expr: 'shock' }], [L[5][0] + i * 4, 'cheer', { expr: 'excited' }], [L[6][0], 'ears', { expr: 'angry' }], [W(6, 'Nobody') + i * 3, 'ears', { expr: 'stern' }], [W(6, 'Nobody') + 18, 'clap', { expr: 'laugh' }],
          [L[7][0], 'shock', { expr: 'shock' }], [L[8][0], 'cross', { expr: 'stern' }], [L[13][0], 'think', { expr: 'confused' }]];
      D.act(K, rig, f, keys, sd, pos);
    });
    // scientist (inside the tent from line 6)
    if (f >= L[6][0] - 6 && !night) D.act(K, SCI, f, [[0, 'pointDown', { expr: 'stern', talk: true }], [W(6, 'carved') - 2, 'read', { item: 'book', expr: 'stern' }], [W(6, 'Nobody') - 2, 'shock', { expr: 'confused' }], [W(6, 'Nobody') + 15, 'facepalm', { expr: 'sad' }]], 31,
      { x: TENT[0] + 1.9, z: TENT[2] - 0.6, yaw: -1.6 }); else hide(SCI);
  } else hide(FH1, FH2, FARM, V1, V2, V3, SCI);
  // Barnum: arrives at the farm (line 7-8), then in his hall
  const barWalk = K.walkPath(f, L[7][0] - 6, [[TENT[0] + 9, 12.0], [TENT[0] + 5.5, 8.4], [TENT[0] + 4.0, TENT[2] + 5.6]], 1.8, { endYaw: -2.2 });
  if (f >= L[7][0] - 6 && f < HALL0) D.act(K, BAR, f, barWalk.moving ? [[0, 'walk', { expr: 'grin' }]] : [[0, 'wave', { expr: 'grin', talk: true }], [W(7, 'fifty') - 4, 'show', { R: [0.42, -0.6, 'moneybag'], expr: 'excited' }], [W(7, 'giant'), 'pointL', { expr: 'grin', talk: true }],
    [W(8, 'no') - 2, 'shock', { expr: 'shock' }], [W(8, 'Barnum') - 4, 'angry', { expr: 'angry' }], [W(8, 'builds') - 2, 'idea', { expr: 'excited' }]], 41, { x: barWalk.x, z: barWalk.z, yaw: barWalk.yaw });
  else if (inHall) D.act(K, BAR, f, [[0, 'hammer', { R: [0.3, 0.3, 'hammer'], expr: 'grin' }], [L[9][0] - 4, 'show', { expr: 'proud' }], [W(9, 'swears') - 3, 'pointUp', { expr: 'proud', talk: true }], [L[10][0], 'hips', { expr: 'grin' }],
    [W(10, 'Barnum') - 2, 'celebrate', { expr: 'laugh' }], [W(12, 'Barnum') - 4, 'show', { R: [0.42, -0.6, 'moneybag'], expr: 'laugh' }], [W(12, 'richer') - 2, 'celebrate', { expr: 'laugh' }]], 42,
    f < L[9][0] - 4 ? { x: MX + 1.6, z: -2.2, yaw: -0.6 } : f >= L[12][0] ? { x: MX + 6.5, z: 7.2, yaw: 0.35 } : { x: MX + 3.6, z: -1.6, yaw: -0.4 });
  else hide(BAR);
  if (inHall && f < L[9][0] - 4) { const t = (f - HALL0) % 10; if (t === 0) K.puff(f, f, MX + 0.4, -3.0, 6, 0.4, '#ffffff'); else K.puff(f, f - t, MX + 0.4, -3.0, 6, 0.4, '#ffffff'); }
  // hall crowd: re-use the visitors as Barnum's paying crowd
  if (inHall && f >= L[9][0] - 4) [[V1, 21], [V2, 22], [V3, 23]].forEach(([rig, sd], i) => D.act(K, rig, f, [[0, 'pointL', { expr: 'excited' }], [L[10][0] + i * 3, 'cheer', { expr: 'excited' }], [W(10, 'copy'), 'clap', { expr: 'laugh' }], [L[12][0], 'show', { R: [0.42, -0.6, 'money'], expr: 'grin' }]], sd,
    { x: MX - 2.2 + i * 2.0, z: 0.4 + (i % 2) * 0.8, yaw: Math.PI + (1 - i) * 0.25 }));
  // George Hull: night flashback (carving + burying), then rich at the tent
  if (night) {
    const bury = f >= W(11, 'buried') - 6;
    D.act(K, HULL, f, bury ? [[0, 'dig', { expr: 'grin' }], [W(11, 'buried') + 12, 'crouch', { expr: 'grin' }], [W(11, 'buried') + 24, 'dig', { expr: 'laugh' }]] : [[0, 'hammer', { R: [0.3, 0.3, 'hammer'], expr: 'grin' }], [W(11, 'George') - 3, 'sneak', { expr: 'grin' }], [W(11, 'carved') - 2, 'hammer', { R: [0.3, 0.3, 'hammer'], expr: 'laugh' }]], 51,
      bury ? { x: 2.3, z: 1.0, yaw: -1.9 } : { x: 1.4, z: 1.6, yaw: -2.42 });
    if (bury) { X.holdAt(HULL, SHOV[2], 1, [0.3, 0, 0.2]); const t = (f - W(11, 'buried')) % 12; K.puff(f, f - t, 1.4, 0.6, 5, 0.3, '#5a4a3a'); }
    LANT.light.position.set(2.0, 1.3, 2.6); LANT.glow.position.set(2.0, 1.3, 2.6); LANT.base = 3.0;
    if (!bury) lay(G1, f, 0.2, 0.55, 0.3, 0); else lay(G1, f, 0, -0.45, 0, 0);
  } else if (f >= NGT1 && f < W(12, 'Barnum') - 4) D.act(K, HULL, f, [[0, 'show', { R: [0.42, -0.6, 'moneybag'], expr: 'laugh' }], [W(12, 'rich') - 2, 'celebrate', { expr: 'laugh' }]], 52, { x: TENT[0] + 3.6, z: TENT[2] + 5.2, yaw: -0.3 });
  else { hide(HULL); }
  if (!night) { const tp = inTent ? [TENT[0] + 0.5, 3.0, TENT[2] + 0.8] : [0, -50, 0]; LANT.base = inTent ? 2.6 : 0; LANT.light.position.set(...tp); LANT.glow.position.set(tp[0], -50, tp[2]); }
  // wagons + horses on the jammed road (line 5)
  WAGONS.forEach((wg, i) => { const x = -30 + i * 9 + (f >= L[5][0] - 4 ? Math.min(2.5, (f - L[5][0]) / 60) : 0); wg.position.x = x;
    WHORSES[i].set(f, { x: x + 3.3, z: 12.2, yaw: Math.PI / 2, mode: f % 90 < 45 + i * 5 ? 'stand' : 'eat', look: 0.3 * Math.sin(f / 30 + i), expr: 'neutral' }); });
  // ---------- shots ----------
  const P = [0, 0.5, 0], gHead = [-1.6, 0.9, 0];
  const S = [
    [0, (u) => ({ pos: [lerp(3.6, 3.0, u), 0.7, 5.4], look: [-0.4, lerp(0.8, 1.3, u), 0], fov: 52, cinf: 6 })],
    [W(0, 'Cardiff') - 4, (u) => ({ pos: [0.8, 2.0, 3.6], look: [-1.0, lerp(0.8, 1.2, u), 0], fov: 42, cinf: 10 })],
    [FF1, (u) => ({ pos: [lerp(5, 4, u), lerp(5.5, 4.6, u), 8], look: [0, -0.2, 0], fov: 46, cinf: 5 }), { whip: true }],
    [W(1, 'shovels') - 4, (u) => ({ pos: [2.0, 1.2, 2.0], look: [1.4, -0.5, 0], fov: 42 * K.punch(f, FOOT, 0.15, 6), cinf: 14, noPush: true })],
    [L[2][0] - 4, (u) => ({ pos: [0.1, 1.8, 0.7], look: [-0.9, 1.5, -1.65], fov: 40, cinf: 12 }), { whip: true }],
    [TEN - 4, (u) => ({ pos: [0.2, lerp(5.6, 4.8, u), 2.6], look: [0, -0.5, 0], fov: 52 * K.punch(f, TEN, 0.15, 6), cinf: 8, noPush: true })],
    [W(2, 'curled') - 4, (u) => ({ pos: [-0.3, 1.3, 2.3], look: [-0.9, -0.5, 0.2], fov: 44, cinf: 12 })],
    [L[3][0] - 4, (u) => { const t = K.track(f, (g) => { const w = K.walkPath(g, L[3][0] - 10, [[-8, 12.5], [4, 12.2], [TENT[0] + 1, 9.0], [TENT[0] + 0.6, 4.6]], 2.2); return [w.x, 0, w.z]; }, { off: [2.4, 1.6, 4.2], lag: 4 }); return { pos: t.pos, look: t.look, fov: 44, cinf: 8 }; }, { whip: true }],
    [W(3, 'line') - 4, (u) => ({ pos: [TENT[0] + 7.5, 0.7, TENT[2] + 10], look: [TENT[0] + 2, 1.5, TENT[2] + 4], fov: 46, cinf: 6 })],
    [L[4][0] - 4, (u) => ({ pos: [TENT[0] + 4.6, 1.8, TENT[2] + 5.6], look: [TENT[0] + 2.4, 1.3, TENT[2] + 3.2], fov: 40, cinf: 12 }), { whip: true }],
    [W(4, 'fifty') - 4, (u) => ({ pos: [TENT[0] + 3.4, 1.55, TENT[2] + 5.2], look: [TENT[0] + 2.8, 1.0, TENT[2] + 4.0], fov: 40, cinf: 18 })],
    [L[5][0] - 4, (u) => ({ pos: [lerp(-4, -7, u), 5, 2], look: [lerp(-16, -20, u), 0.5, 12.2], fov: 48, cinf: 4 }), { whip: true }],
    [W(5, 'wagons') - 4, (u) => ({ pos: [lerp(-6.2, -6.8, u), 1.5, 16.8], look: [-9.5, 1.3, 12.2], fov: 44, cinf: 8 })],
    [L[6][0] - 4, (u) => ({ pos: [TENT[0] + 0.4, 2.1, TENT[2] + 3.6], look: [TENT[0] + 1.6, 1.4, TENT[2] - 0.6], fov: 42, cinf: 10 }), { whip: true }],
    [W(6, 'Nobody') - 4, (u) => ({ pos: [TENT[0] - 0.2, 1.7, TENT[2] - 0.6], look: [TENT[0] - 0.6, 1.5, TENT[2] + 1.8], fov: 40, cinf: 12 })],
    [L[7][0] - 4, (u) => { const t = K.track(f, (g) => { const w = K.walkPath(g, L[7][0] - 6, [[TENT[0] + 9, 12.0], [TENT[0] + 5.5, 8.4], [TENT[0] + 4.0, TENT[2] + 5.6]], 1.8); return [w.x, 0, w.z]; }, { off: [-2.4, 1.6, 3.6], lag: 4 }); return { pos: t.pos, look: t.look, fov: 42, cinf: 8 }; }, { whip: true }],
    [W(7, 'fifty') - 4, (u) => ({ pos: [TENT[0] + 4.9, 1.75, TENT[2] + 8.3], look: [TENT[0] + 4.0, 1.5, TENT[2] + 5.6], fov: 40 * K.punch(f, W(7, 'fifty'), 0.15, 6), cinf: 14, noPush: true })],
    [L[8][0] - 4, (u) => ({ pos: [TENT[0] + 3.9, 1.8, TENT[2] + 6.3], look: [TENT[0] + 2.4, 1.5, TENT[2] + 3.2], fov: 38, cinf: 14 }), { whip: true }],
    [HALL0, (u) => ({ pos: [MX + 3.4, 1.9, 1.0], look: [MX + 0.6, 1.0, -3.4], fov: 42, cinf: 10, light: HALL }), { whip: true }],
    [L[9][0] - 4, (u) => ({ pos: [MX + lerp(-1.5, 1.5, u), 3.0, 8.5], look: [MX, 1.6, -4], fov: 50, cinf: 4, light: HALL })],
    [W(9, 'swears') - 4, (u) => ({ pos: [MX + 4.8, 1.85, 1.2], look: [MX + 3.6, 1.65, -1.6], fov: 38, cinf: 14, light: HALL })],
    [L[10][0] - 4, (u) => ({ pos: [MX + 0.3, 1.6, -1.4], look: [MX - 0.2, 1.4, 1.2], fov: 42, cinf: 10, light: HALL }), { whip: true }],
    [W(10, 'original') - 4, (u) => ({ pos: [TENT[0] + 4.4, 1.75, TENT[2] + 5.2], look: [TENT[0] + 2.4, 1.6, TENT[2] + 3.2], fov: 36, cinf: 14 }), { whip: true }],
    [NGT0, (u) => ({ pos: [lerp(3.6, 3.0, u), 1.6, 3.8], look: [0.2, 0.6, 0.3], fov: 44, cinf: 8, light: NIGHT }), { whip: true }],
    [W(11, 'George') - 4, (u) => ({ pos: [-0.6, 1.6, 3.8], look: [1.4, 1.3, 1.6], fov: 44, cinf: 12, light: NIGHT })],
    [W(11, 'buried') - 4, (u) => ({ pos: [lerp(4.6, 4.2, u), 2.2, 3.6], look: [1.4, 0.6, 0.6], fov: 44, cinf: 8, light: NIGHT })],
    [NGT1, (u) => ({ pos: [TENT[0] + 4.6, 1.8, TENT[2] + 8.0], look: [TENT[0] + 3.6, 1.6, TENT[2] + 5.2], fov: 38, cinf: 14 }), { whip: true }],
    [W(12, 'Barnum') - 4, (u) => ({ pos: [MX + 7.4, 1.85, 9.6], look: [MX + 6.5, 1.6, 7.2], fov: 38, cinf: 14, light: HALL }), { whip: true }],
    [L[13][0] - 4, (u) => ({ pos: [TENT[0] + 1.2, 2.8, TENT[2] + 2.6], look: [TENT[0] + 0.2, 0.9, TENT[2] - 1.1], fov: 42 * K.push(u, 0.16), cinf: 14, noPush: true }), { whip: true }],
  ];
  const R = D.runShots(S, f, TOTAL), cam = R.cam;

  if (R.id === 16) D.card(fx, f, W(7, 'fifty'), '$50,000', cam, '#f6c83a', 190, 40, 0.5);
  return { light: R.light || (night ? NIGHT : DAY), cam, dof: R.dof, actors: [], fx };
}
export default { TOTAL, look: 'rich', build, frame };
