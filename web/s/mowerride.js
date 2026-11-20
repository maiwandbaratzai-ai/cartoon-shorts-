// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why did 73-year-old Alvin Straight ride a lawnmower 240 miles?" (story, inspired by Alvin Straight's 1994 ride on a
// riding mower from Laurens, Iowa to his brother in Wisconsin; details told for fun). TikTok, 64+ s.
// Set: one long Iowa highway through cornfields: Alvin's house, a farm, the rain stretch, a roadside camp, a hill,
// and Henry's farmhouse in Wisconsin.
import { TOTAL, LINES, wf } from './mowerride_timing.js';
import * as PR from '../props.js';
import * as D from './d19.js';
import * as X from './kit3d.js';
const { clamp, lerp, sm } = D;
export { TOTAL };
const L = LINES, W = wf;
let K, MOW, MBODY, MW = [], TRAIL, SMOKE = [], RAIN = [], TRUCKS = [], TOW, COWS = [], LANT, WALLET, BUS;
let AL, HEN, NB1, NB2, SEL, FAR, MOM, DAD;
const AL_O = { jacket: '#5a7aa0', pants: '#4a3a2a', boots: '#3a2a1a', hat: 'cowboy', hatColor: '#d8c088', glasses: '#333', moustache: '#f0ece4', vest: '#7a5a3a', belt: '#2a1a12' };
const HEN_O = { jacket: '#8a6a5a', pants: '#3a3a44', boots: '#1e1a18', hat: 'cap', cap: '#b8322f', glasses: true, moustache: '#d8d8d8', vest: '#c8b898', pockets: true };
const NB1_O = { jacket: '#d86a8a', dress: '#d86a8a', hairStyle: 'curly', hair: '#e8e0d0', apron: '#ffffff', glasses: '#333' };
const NB2_O = { jacket: '#3a6a3a', pants: '#2a3a5a', boots: '#2a1a12', hat: 'beanie', hatColor: '#e8a020', moustache: '#5a3a1a', scarf: '#c0392b', belt: '#111' };
const SEL_O = { jacket: '#e8e0d0', pants: '#2a2a30', boots: '#111', hat: 'cowboy', hatColor: '#2a2a2a', tie: '#2a5a8a', vest: '#8a2a2a', moustache: '#3a2a1a' };
const FAR_O = { jacket: '#3a5a9a', pants: '#3a5a9a', boots: '#3a2a1a', hat: 'cap', cap: '#2a6a3a', gloves: '#c8a878', pockets: true, scarf: '#e8c040' };
const MOM_O = { jacket: '#e8c040', dress: '#e8c040', hairStyle: 'bun', hair: '#8a4a2a', apron: '#ffffff', collar: '#ffffff' };
const DAD_O = { jacket: '#c8662a', pants: '#3a3a40', boots: '#2a1a12', hairStyle: 'spiky', hair: '#2a1a12', glasses: true, belt: '#2a1a12', bowtie: '#2a2a6a' };
const DAY = { az: 35, el: 40, sky: '#d8ecf8', ground: '#a89a60', hemi: 1.05, sun: '#fff0d0', sunI: 3.2, skyTop: '#3f80d0', skyHor: '#eef2ea', fog: '#e4ece8', fogNear: 60, fogFar: 320,
  sat: 1.18, vig: 0.22, shadowExt: 16, exposure: 1.12, ink: 0.55, bloom: 0.6 };
const RAINL = { ...DAY, sky: '#8a96a4', skyTop: '#5a6a7a', skyHor: '#a8b0b8', fog: '#9aa4ae', fogNear: 20, fogFar: 120, sunI: 1.2, hemi: 1.0, exposure: 1.2, sat: 0.95 };
const HOT = { ...DAY, sun: '#fff0b0', sunI: 3.8, skyHor: '#fff4d0', fog: '#f4ecd0', exposure: 1.18, sat: 1.25 };
const DUSK = { ...DAY, az: 30, el: 12, sun: '#ffb070', sunI: 2.6, skyTop: '#4a5aa8', skyHor: '#ffb070', fog: '#e8a880', fogNear: 30, fogFar: 200, hemi: 0.8, exposure: 1.2, cardTint: '#ffe8d8' };
const RZ = 1.6;    // Alvin's lane (shoulder side)
const HOUSE = 0, CAMP = 300, HILL = 400, FARMX = 600;

function mower() {
  const { THREE } = K; const g = K.group();
  const red = K.toon({ color: '#c0392b', plain: true, roughness: 0.35 }), blk = K.toon({ color: '#1a1a1a', plain: true }), gry = K.mat('metal', '#7a7a80');
  const body = K.group(g);
  K.slab(-0.45, 0.45, 0.35, 0.75, -0.2, 0.75, red, body); K.slab(-0.42, 0.42, 0.5, 0.8, 0.55, 1.1, red, body);                          // body + hood
  K.slab(-0.6, 0.6, 0.18, 0.28, -0.1, 0.9, gry, body);                                                                                   // cutting deck
  K.slab(-0.28, 0.28, 0.75, 0.82, -0.35, 0.05, blk, body); K.slab(-0.28, 0.28, 0.82, 1.2, -0.42, -0.34, blk, body);                     // seat
  K.beam(new THREE.Vector3(0, 0.75, 0.45), new THREE.Vector3(0, 1.1, 0.3), 0.025, blk, body); const sw = K.add(new THREE.TorusGeometry(0.15, 0.02, 8, 20), blk, 0, 1.12, 0.3, body); sw.rotation.x = Math.PI / 2 - 0.4;
  for (const s of [-1, 1]) K.sphere(0.06, K.toon({ color: '#fff8d0', plain: true, emissive: '#fff0a0' }), s * 0.25, 0.68, 1.11, body);
  const wh = []; for (const [z, r] of [[-0.25, 0.3], [0.85, 0.2]]) for (const s of [-1, 1]) { const w = K.group(g); w.position.set(s * 0.5, r, z); const m = K.cyl(r, r, 0.16, blk, 0, -0.08, 0, w); m.rotation.z = Math.PI / 2; m.position.set(0, 0, 0); K.cyl(r * 0.5, r * 0.5, 0.17, K.toon({ color: '#e8c040', plain: true }), 0, -0.085, 0, w).rotation.z = Math.PI / 2; wh.push([w, r]); }
  // homemade trailer (bed inside), hitched behind
  const tr = K.group(g); tr.position.z = -1.9;
  K.slab(-0.6, 0.6, 0.35, 1.3, -0.75, 0.75, K.mat('wood', '#9a6a3a', { detail: 0.4 }), tr); K.add(new THREE.CylinderGeometry(0.62, 0.62, 1.5, 16, 1, false, -Math.PI / 2, Math.PI), K.mat('fabric', '#e8e0c8'), 0, 1.3, 0, tr).rotation.x = Math.PI / 2;
  K.slab(-0.3, 0.3, 0.5, 1.25, -0.77, -0.75, K.mat('wood', '#5a3a24'), tr); K.beam(new THREE.Vector3(0, 0.35, 0.75), new THREE.Vector3(0, 0.35, 1.5), 0.03, gry, tr);
  for (const s of [-1, 1]) { const w = K.group(tr); w.position.set(s * 0.68, 0.25, 0); const m = K.cyl(0.25, 0.25, 0.1, blk, 0, -0.05, 0, w); m.rotation.z = Math.PI / 2; m.position.set(0, 0, 0); wh.push([w, 0.25]); }
  K.cyl(0.18, 0.18, 0.4, K.mat('metal', '#c0392b'), 0.42, 1.3, -0.6, tr); // gas can
  return { g, body, wh, red, tr };
}
function build(k) {
  K = k; D.init(K); X.init(K); const { THREE } = K;
  K.slab(-100, 800, -0.3, 0, -200, 200, K.mat('grime', '#8aa850', { amt: 0.5, detail: 2 }), K.scene, false);
  K.slab(-100, 800, 0, 0.04, -3.2, 3.2, K.mat('grime', '#4a4a50', { amt: 0.25, detail: 1.2 }), K.scene, false);
  for (let x = -100; x < 800; x += 6) K.slab(x, x + 3, 0.04, 0.045, -0.08, 0.08, K.toon({ color: '#f2c230', plain: true }), K.scene, false);
  for (const z of [-3.0, 3.0]) K.slab(-100, 800, 0.04, 0.045, z - 0.06, z + 0.06, K.toon({ color: '#f4f4f0', plain: true }), K.scene, false);
  K.slab(-100, 800, 0, 0.03, 3.2, 4.6, K.mat('dirt', '#b8a070', { detail: 0.6 }), K.scene, false);
  // cornfields (rows), skipping the building plots
  const corn = K.mat('fabric', '#7aa03a', { detail: 0.15, amt: 0.5 }), tassel = K.toon({ color: '#e8c860', plain: true });
  const plots = [HOUSE, 25, FARMX, CAMP, HILL];
  for (let x = -90; x < 790; x += 30) { if (plots.some((p) => Math.abs(x + 12 - p) < 26)) continue; for (const side of [-1, 1]) for (let j = 0; j < 7; j++) { const z0 = side * (7 + j * 1.5); K.slab(x, x + 24, 0, 2.1, z0 - 0.4, z0 + 0.4, corn, K.scene, false); K.slab(x, x + 24, 2.1, 2.25, z0 - 0.2, z0 + 0.2, tassel, K.scene, false); } }
  // telephone poles + wires
  for (let x = -90; x < 790; x += 22) { K.cyl(0.1, 0.12, 6.5, K.mat('wood', '#5a3a24'), x, 0, -4.8); K.slab(x - 0.05, x + 0.05, 6.0, 6.1, -5.6, -4.0, K.mat('wood', '#5a3a24')); }
  for (const z of [-5.4, -4.2]) K.slab(-90, 790, 5.95, 5.97, z - 0.01, z + 0.01, K.toon({ color: '#2a2a2a', plain: true }), K.scene, false);
  // distant barns, silos, a windmill, hills
  const hill = K.mat('grime', '#7a9a48', { amt: 0.4, detail: 4 });
  for (let i = 0; i < 16; i++) { const x = -80 + i * 55; K.sphere(40, hill, x, -30, -140, K.scene, 1.8, 1, 1); if (i % 2) { K.slab(x - 5, x + 5, 0, 7, -60, -52, K.mat('wood', '#a8322a', { detail: 1.6 })); K.cyl(2.2, 2.2, 12, K.mat('metal', '#c8c8cc'), x + 8, 0, -56); K.sphere(2.2, K.mat('metal', '#a8a8b0'), x + 8, 12, -56); } }
  // Alvin's house (Laurens) + neighbour's porch
  const house = (x, z, col, roof) => { K.add(new THREE.BoxGeometry(8, 4, 6), K.toon({ map: PR.facadeTex(col, 3, 2, x, '#ffffff'), kind: 'plaster', amt: 0.1 }), x, 2, z); K.add(new THREE.ConeGeometry(6, 2.6, 4), K.mat('metal', roof), x, 5.3, z).rotation.y = Math.PI / 4;
    K.slab(x - 4, x + 4, 0, 0.5, z - 5, z - 3, K.mat('wood', '#c8b08a')); for (const dx of [-3.8, 3.8]) K.cyl(0.08, 0.08, 2.8, K.mat('wood', '#f4efe4'), x + dx, 0.5, z - 4.9); K.slab(x - 4.2, x + 4.2, 3.3, 3.45, z - 5.2, z - 2.8, K.mat('metal', roof)); };
  house(HOUSE - 2, 11, '#e8e4d8', '#4a5a6a'); house(25, 11, '#c8d8e8', '#6a3a3a'); house(FARMX + 2, 14, '#f4ecd8', '#3a4a3a');
  K.slab(HOUSE - 1.6, HOUSE + 1.6, 0, 0.035, 3.2, 8, K.mat('dirt', '#c8b890'), K.scene, false);
  K.slab(FARMX - 1.6, FARMX + 1.6, 0, 0.035, 3.2, 9.2, K.mat('dirt', '#c8b890'), K.scene, false);
  for (const x of [HOUSE + 3, FARMX + 3]) { K.cyl(0.05, 0.05, 1.1, K.mat('wood', '#5a3a24'), x, 0, 3.8); K.slab(x - 0.15, x + 0.15, 1.1, 1.35, 3.6, 4.0, K.mat('metal', '#3a5a9a')); }
  BUS = K.group(); BUS.position.set(HOUSE + 9, 0, 4.0); K.cyl(0.04, 0.04, 2.2, K.mat('metal', '#5a5a5a'), 0, 0, 0, BUS); D.sign(0.7, 0.5, D.txtTex(256, 180, '#2a5ab0', '#ffffff', ['BUS', 'STOP'], 'bold 64px Arial Black, Arial'), 0, 2.1, 0.05, 0, BUS);
  D.sign(2.6, 1.0, D.txtTex(512, 200, '#2a5a2a', '#ffffff', ['WELCOME TO', 'WISCONSIN'], 'bold 64px Arial Black, Arial'), FARMX - 30, 1.8, 4.6, 0, K.scene);
  K.cyl(0.06, 0.06, 1.4, K.mat('wood', '#5a3a24'), FARMX - 31.1, 0, 4.6); K.cyl(0.06, 0.06, 1.4, K.mat('wood', '#5a3a24'), FARMX - 28.9, 0, 4.6);
  D.sign(1.6, 0.5, D.txtTex(512, 160, '#f2ead8', '#2a1a12', ['STRAIGHT'], 'bold 80px Georgia, serif'), FARMX + 3, 1.6, 4.0, 0, K.scene);
  // pasture with cows by the road at x ~ 30
  X.fence(14, 46, -4.4, 1.0, K.mat('wood', '#c8b08a'));
  for (let i = 0; i < 3; i++) COWS.push(K.animal('cow', { seed: 30 + i, color: ['#f4f0ea', '#2a2220', '#8a5a3a'][i], scale: 1.0 }));
  // the hill (a ramp in the road at HILL) + a big hill behind
  const ramp = K.group(); ramp.position.set(HILL, 0, 0); ramp.rotation.z = 0.09; K.slab(-14, 14, -0.6, 0.06, -3.2, 3.2, K.mat('grime', '#4a4a50', { amt: 0.25, detail: 1.2 }), ramp, false);
  K.sphere(26, hill, HILL + 10, -16, -30, K.scene, 1.6, 1, 1);
  // roadside camp spot: a lantern on a crate
  K.slab(CAMP - 0.4, CAMP + 0.1, 0, 0.5, 6.2, 6.7, K.mat('wood', '#9a6a3a')); K.cyl(0.25, 0.28, 0.45, K.mat('wood', '#7a5434'), CAMP - 1.0, 0, 7.4);
  for (const [x, z] of [[FARMX + 4.0, 9.85], [FARMX + 2.2, 9.65], [FARMX + 1.0, 9.65]]) { K.slab(x - 0.28, x + 0.28, 0.9, 0.98, z - 0.28, z + 0.28, K.mat('wood', '#8a5a34')); K.slab(x - 0.28, x + 0.28, 0.98, 1.6, z + 0.22, z + 0.3, K.mat('wood', '#8a5a34')); for (const dx of [-0.24, 0.24]) K.slab(x + dx - 0.03, x + dx + 0.03, 0.5, 0.9, z - 0.03, z + 0.03, K.mat('wood', '#6a4428')); }
  LANT = K.lamp(CAMP - 0.15, -40, 6.45, { color: '#ffb060', intensity: 2.6, distance: 8, flicker: 0.15 });
  // trucks + tow truck
  for (let i = 0; i < 2; i++) { const t = PR.oldTruck(K, ['#2a4a8a', '#8a2a2a'][i]); t.root.scale.setScalar(1.6); TRUCKS.push(t); }
  TOW = PR.oldTruck(K, '#e8a020');
  // mower, smoke, rain, wallet
  MOW = mower(); MBODY = MOW.body;
  const stex = PR.canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  for (let i = 0; i < 24; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: stex, transparent: true, depthWrite: false, color: '#4a4a4a' })); sp.userData.ndSkip = true; K.scene.add(sp); SMOKE.push(sp); }
  const rm = K.toon({ color: '#cfe0f0', plain: true, emissive: '#5a7a9a' });
  for (let i = 0; i < 160; i++) { const r = K.slab(-0.006, 0.006, 0, 0.35, -0.006, 0.006, rm, K.scene, false); r.castShadow = false; RAIN.push(r); }
  WALLET = K.group(); K.slab(-0.12, 0.12, 0, 0.18, -0.02, 0.02, K.mat('fabric', '#5a3a24'), WALLET); K.slab(-0.1, 0.1, 0.02, 0.17, 0.02, 0.025, K.toon({ color: '#3a2a1a', plain: true }), WALLET);
  AL = K.stick(AL_O, { key: 'al' }); HEN = K.stick(HEN_O, { key: 'hen' }); NB1 = K.stick(NB1_O, { key: 'nb1' }); NB2 = K.stick(NB2_O, { key: 'nb2' }); SEL = K.stick(SEL_O, { key: 'sel' });
  FAR = K.stick(FAR_O, { key: 'far' }); MOM = K.stick(MOM_O, { key: 'mom' }); DAD = K.stick(DAD_O, { key: 'dad' });
  K.addClouds(12, 700, 160);
}

const hide = (...rs) => rs.forEach((r) => { r.root.visible = false; });
// mower state over the story: { x, z, yaw, y, tilt, moving, speed }
function mowAt(f) {
  const road = (x0, v, f0) => ({ x: x0 + v * (f - f0) / 30, z: RZ, yaw: Math.PI / 2, moving: true, y: 0 });
  if (f < L[2][0] - 4) return road(20, 2.0, 0);
  if (f < L[4][0] - 4) return { x: HOUSE, z: 6.5, yaw: Math.PI, moving: false, y: 0 };
  if (f < L[5][0] - 4) { const w = K.walkPath(f, W(4, 'putters') - 8, [[HOUSE, 6.5], [HOUSE + 0.4, 3.0], [HOUSE + 3, RZ], [HOUSE + 12, RZ]], 2.0); return { x: w.x, z: w.z, yaw: w.yaw, moving: w.moving, y: 0 }; }
  if (f < L[6][0] - 4) return road(12, 2.2, L[5][0] - 4);
  if (f < L[7][0] - 4) { const x = 55 + 2.0 * Math.min(f - L[6][0] + 4, W(6, 'dies') - L[6][0] + 4) / 30; return { x, z: RZ, yaw: Math.PI / 2, moving: f < W(6, 'dies'), y: 0, smoke: f >= W(6, 'coughs') - 4 }; }
  if (f < L[8][0] - 4) { const x = 60 - 3.0 * (f - L[7][0] + 4) / 30; return { x, z: RZ, yaw: Math.PI / 2, moving: true, y: 0, towed: true }; }
  if (f < L[9][0] - 4) { const w = K.walkPath(f, W(8, 'starts') - 10, [[HOUSE, 6.5], [HOUSE + 0.4, 3.0], [HOUSE + 3, RZ], [HOUSE + 10, RZ]], 2.0); return { x: w.x, z: w.z, yaw: w.yaw, moving: w.moving, y: 0 }; }
  if (f < L[10][0] - 4) return road(200, 2.0, L[9][0] - 4);
  if (f < L[11][0] - 4) return { x: CAMP, z: 5.4, yaw: Math.PI / 2 + 0.3, moving: false, y: 0 };
  if (f < L[13][0] - 4) { const stop = W(11, 'mower'); const x = HILL - 6 + 1.6 * Math.min(f - L[11][0] + 4, stop - L[11][0] + 4) / 30; return { x, z: RZ, yaw: Math.PI / 2, moving: f < stop, y: (x - HILL) * Math.tan(0.09) + 0.0, tilt: 0.09, smoke: f >= stop - 6 && f < L[12][0] + 40 }; }
  if (f < L[17][0] - 4) { const w = K.walkPath(f, L[13][0] - 4, [[FARMX - 14, RZ], [FARMX - 1.5, RZ], [FARMX - 0.2, 4.2], [FARMX, 7.6]], 2.0, { endYaw: 0 }); return { x: w.x, z: w.z, yaw: w.yaw, moving: w.moving, y: 0 }; }
  return road(500, 2.0, L[17][0] - 4);
}
function frame(f) {
  const fx = [];
  const m = mowAt(f);
  MOW.g.position.set(m.x, m.y, m.z); MOW.g.rotation.set(0, m.yaw, 0); if (m.tilt) MOW.g.rotation.z = 0; if (m.tilt) MOW.g.rotation.x = -m.tilt;
  MOW.g.rotation.order = 'YXZ';
  MOW.wh.forEach(([w, r]) => { w.rotation.x = m.moving ? f * 0.25 / r : 0; });
  MBODY.position.y = m.moving ? 0.012 * Math.sin(f * 1.3) : 0;
  MOW.red.color.set(f >= L[8][0] - 4 ? '#e8782a' : '#c0392b');                       // the second old mower is orange
  // smoke when it breaks down
  SMOKE.forEach((sp, i) => { const a = (i * 3 + f) % 72; const on = m.smoke; sp.visible = !!on; if (!on) return; const fw = new K.THREE.Vector3(Math.sin(m.yaw), 0, Math.cos(m.yaw));
    sp.position.set(m.x + fw.x * 0.9 + Math.sin(i) * 0.1 - a * 0.01, m.y + 0.9 + a * 0.035, m.z + fw.z * 0.9 + Math.cos(i * 1.7) * 0.1); sp.scale.setScalar(0.3 + a * 0.02); sp.material.opacity = 0.7 * (1 - a / 72); });
  // Alvin: riding (seated on the mower) most of the time
  const ride = !(f >= L[3][0] - 4 && f < W(4, 'putters') - 8) && !(f >= L[7][0] - 4 && f < W(8, 'starts') - 10) && !(f >= L[10][0] - 4 && f < L[11][0] - 4) && !(f >= L[12][0] - 4 && f < L[13][0] - 4) && !(f >= W(13, 'rolls') + 70 && f < L[17][0] - 4);
  const sweatOn = f >= L[9][0] && f < L[13][0];
  const alKeys = [[0, 'sit', { expr: 'proud' }], [W(0, 'Alvin'), 'sit', { expr: 'grin' }], [L[1][0], 'sit', { expr: 'smile' }], [W(1, 'towing') + 10, 'wave', { expr: 'grin' }], [L[2][0], 'sit', { expr: 'neutral' }],
    [L[3][0] - 4, 'read', { item: 'paper', expr: 'confused' }], [W(3, 'car') - 3, 'shrug', { expr: 'sad' }], [W(3, 'bus') - 4, 'cross', { expr: 'stern' }], [L[4][0] - 4, 'push', { expr: 'stern' }], [W(4, 'putters') - 8, 'sit', { expr: 'proud' }],
    [L[5][0], 'sit', { expr: 'smile' }], [W(5, 'Neighbors'), 'wave', { expr: 'grin' }], [W(5, 'cows') - 2, 'sit', { expr: 'confused' }], [L[6][0], 'sit', { expr: 'smile' }], [W(6, 'coughs') - 3, 'shock', { expr: 'shock', sweat: true }], [W(6, 'dies'), 'facepalm', { expr: 'sad' }],
    [L[7][0] - 4, 'cross', { expr: 'sad' }], [W(7, 'Everyone'), 'angry', { expr: 'stern' }], [L[8][0] - 2, 'show', { R: [0.42, -0.6, 'money'], expr: 'proud' }], [W(8, 'starts') - 10, 'sit', { expr: 'proud' }], [W(8, 'starts') + 6, 'cheer', { expr: 'grin' }],
    [L[9][0] - 4, 'sit', { expr: 'pained', sweat: true }], [W(9, 'sun') - 3, 'sit', { expr: 'nervous', sweat: true }], [W(9, 'money') - 3, 'show', { R: [0.42, -0.6, 'money'], expr: 'sad', sweat: true }], [W(9, 'money') + 14, 'shrug', { expr: 'sad' }],
    [L[10][0] - 4, 'sit', { expr: 'sleepy' }], [W(10, 'waiting') - 4, 'read', { item: 'letter', expr: 'smile' }], [L[11][0] - 4, 'sit', { expr: 'proud' }], [W(11, 'mower') - 3, 'shock', { expr: 'scared', sweat: true }], [W(11, 'mower') + 16, 'facepalm', { expr: 'pained', sweat: true }],
    [L[12][0] - 4, 'idle', { expr: 'nervous' }], [W(12, 'farmer'), 'clap', { expr: 'smile' }], [W(12, 'family') - 2, 'eat', { expr: 'grin', R: [0.3, 0.2, 'food'] }], [L[13][0] - 4, 'sit', { expr: 'proud' }], [W(13, 'rolls') + 70, 'idle', { expr: 'nervous', sweat: true }],
    [L[14][0] + 10, 'idle', { expr: 'nervous', sweat: true }], [W(14, 'sees') + 10, 'wave', { expr: 'smile' }], [L[15][0], 'idle', { expr: 'sad' }], [W(15, 'Ten') - 3, 'hips', { expr: 'proud' }], [L[16][0], 'sit', { expr: 'relief' }], [L[17][0] - 4, 'sit', { expr: 'proud' }], [L[18][0] - 4, 'wave', { expr: 'grin' }]];
  const fw = [Math.sin(m.yaw), Math.cos(m.yaw)];
  let alPos;
  if (ride) alPos = { x: m.x - fw[0] * 0.15, y: m.y + 0.35, z: m.z - fw[1] * 0.15, yaw: m.yaw, seat: 0.45 };
  else if (f < L[4][0]) alPos = { x: HOUSE + 2.4, z: 6.2, yaw: Math.PI };
  else if (f < W(8, 'starts') && f >= L[7][0] - 4) alPos = f < L[8][0] - 4 ? { x: m.x + 2.0, z: RZ + 1.6, yaw: Math.PI / 2 } : { x: HOUSE + 1.3, z: 6.0, yaw: Math.PI * 0.6 };
  else if (f < L[11][0] && f >= L[10][0] - 4) alPos = { x: CAMP - 1.0, z: 7.4, yaw: Math.PI * 0.9, seat: 0.45, y: 0 };
  else if (f >= L[12][0] - 4 && f < L[13][0] - 4) alPos = { x: HILL - 1.8, y: (HILL - 1.8 - HILL) * Math.tan(0.09) + 0.0, z: RZ + 1.5, yaw: Math.PI };
  else if (f >= L[16][0] - 4) alPos = { x: FARMX + 1.0, y: 0.5, z: 9.6, yaw: Math.PI, seat: 0.5 };
  else alPos = { x: FARMX + 1.0, z: 8.4, yaw: 0.2 };
  if (f >= L[10][0] - 4 && f < L[11][0] - 4) alKeys.push([L[10][0] - 4, 'sit', { expr: 'sleepy' }]);
  D.act(K, AL, f, alKeys.filter((k) => k[0] <= f || true).sort((a, b) => a[0] - b[0]).map((k) => (ride && !['sit', 'wave', 'cheer', 'shock', 'facepalm', 'show', 'eat', 'clap', 'read', 'shrug'].includes(k[1]) ? [k[0], 'sit', k[2]] : (!ride && k[1] === 'sit' && !alPos.seat ? [k[0], 'idle', k[2]] : k))), 2, alPos);
  if (f >= W(9, 'money') - 3 && f < W(9, 'money') + 30) X.holdAt(AL, WALLET, 1, [0, 0, 0]); else WALLET.visible = false;
  // trucks blasting past in the other lane (line 0, line 5, line 17)
  TRUCKS.forEach((t, i) => { const runs = [[0, 30], [L[5][0] - 4, 22], [L[17][0] - 4, 520]]; let shown = false;
    for (const [f0, x0] of runs) { const dt = (f - f0 - i * 40) / 30; if (dt >= 0 && dt < 3.2) { t.root.position.set(x0 + 40 - dt * 26 + (f0 === 0 ? 0 : 10), 0, -1.6); t.root.rotation.y = Math.PI; shown = true; if (f % 4 === 0) K.puff(f, f, t.root.position.x + 4, -1.6, 4, 0.5, '#c8c0a8'); } }
    t.root.visible = shown; });
  // tow truck (line 7)
  const towOn = f >= L[7][0] - 4 && f < L[8][0] - 4; TOW.root.visible = towOn; if (towOn) { TOW.root.position.set(m.x - 7.0, 0, RZ); TOW.root.rotation.y = Math.PI; }
  // cows by the fence
  COWS.forEach((c, i) => c.set(f, { x: 26 + i * 4, z: -6.5 - (i % 2), yaw: -0.2 + i * 0.3, mode: (f >= W(5, 'cows') - 4 && f < W(5, 'cows') + 60) ? 'stand' : (f + i * 40) % 160 < 80 ? 'eat' : 'stand', look: (f >= W(5, 'cows') - 4) ? 0.6 : 0.1 * Math.sin(f / 30), expr: f >= W(5, 'cows') - 4 && f < W(5, 'cows') + 60 ? 'shock' : 'neutral' }));
  // neighbours (line 5 on their porch, line 7 at the road)
  if ((f >= L[5][0] - 4 && f < L[6][0] - 4) || (f >= L[7][0] - 4 && f < L[8][0] - 4)) {
    const at7 = f >= L[7][0] - 4;
    D.act(K, NB1, f, [[0, 'cross', { expr: 'confused' }], [W(5, 'Neighbors') - 2, 'facepalm', { expr: 'sad' }], [W(5, 'Neighbors') + 20, 'cross', { expr: 'stern' }], [L[7][0], 'shrug', { expr: 'confused' }], [W(7, 'Everyone'), 'pointL', { expr: 'stern', talk: true }]], 4, at7 ? { x: m.x + 1.0, z: 4.6, yaw: Math.PI } : { x: 24.4, y: 0.5, z: 7.0, yaw: -0.1 });
    D.act(K, NB2, f, [[0, 'hips', { expr: 'stern' }], [W(5, 'Neighbors'), 'shrug', { expr: 'confused' }], [W(5, 'Neighbors') + 14, 'facepalm', { expr: 'dazed' }], [L[7][0], 'cross', { expr: 'stern' }], [W(7, 'done') - 2, 'stop', { expr: 'stern', talk: true }]], 5, at7 ? { x: m.x + 2.4, z: 4.8, yaw: Math.PI + 0.3 } : { x: 25.6, y: 0.5, z: 7.2, yaw: -0.2 });
  } else hide(NB1, NB2);
  // seller (line 8)
  if (f >= L[8][0] - 4 && f < L[9][0] - 4) D.act(K, SEL, f, [[0, 'show', { R: [0.42, -0.6, 'paper'], expr: 'grin', talk: true }], [W(8, 'three') - 2, 'grab', { expr: 'excited' }], [W(8, 'starts') - 8, 'wave', { expr: 'laugh' }]], 6, { x: HOUSE + 2.6, z: 6.4, yaw: -Math.PI * 0.6 }); else hide(SEL);
  // farmer + family (line 12) at the hill
  if (f >= L[11][0] + 30 && f < L[13][0] - 4) {
    const hy = (x) => (x - HILL) * Math.tan(0.09);
    const fwk = K.walkPath(f, L[11][0] + 30, [[HILL + 12, RZ + 2.4], [m.x + 1.3, RZ + 1.2]], 2.0, { endYaw: -Math.PI / 2 });
    D.act(K, FAR, f, fwk.moving ? [[0, 'walk', { expr: 'smile' }]] : [[0, 'hammer', { R: [0.3, 0.3, 'hammer'], expr: 'stern' }], [W(12, 'family') - 4, 'hammer', { R: [0.3, 0.3, 'hammer'], expr: 'grin' }], [L[12][0] + 90, 'cheer', { expr: 'laugh' }]], 7, { x: fwk.x, y: hy(fwk.x), z: fwk.z, yaw: fwk.yaw });
    if (f >= L[12][0] - 4) { D.act(K, MOM, f, [[0, 'show', { R: [0.42, -0.6, 'food'], expr: 'smile' }], [W(12, 'family') + 10, 'wave', { expr: 'grin' }]], 8, { x: HILL - 2.3, y: 0, z: RZ + 2.3, yaw: Math.PI * 0.85 });
      D.act(K, DAD, f, [[0, 'wave', { expr: 'grin' }], [W(12, 'family') + 4, 'show', { R: [0.42, -0.6, 'cup'], expr: 'smile' }]], 9, { x: HILL - 1.2, y: 0, z: RZ + 2.4, yaw: Math.PI * 1.1 }); } else hide(MOM, DAD);
  } else hide(FAR, MOM, DAD);
  // Henry: sick in his chair (line 2), steps out (line 14), sits on the porch with Alvin (line 16)
  if (f >= L[2][0] - 4 && f < L[3][0] - 4) D.act(K, HEN, f, [[0, 'sit', { expr: 'sad' }], [W(2, 'spoken') - 4, 'sit', { expr: 'sad' }]], 10, { x: FARMX + 4.0, y: 0.5, z: 9.8, yaw: Math.PI, seat: 0.5 });
  else if (f >= L[14][0] - 4 && f < L[17][0] - 4) { const hw = K.walkPath(f, L[14][0] - 4, [[FARMX + 2.0, 11.2], [FARMX + 2.0, 9.6]], 1.0, { endYaw: Math.PI * 1.0 });
    D.act(K, HEN, f, f >= L[16][0] - 4 ? [[0, 'sit', { expr: 'relief' }], [L[16][0] + 40, 'sit', { expr: 'smile' }]] : hw.moving ? [[0, 'walk', { expr: 'neutral' }]] : [[0, 'shock', { expr: 'shock' }], [W(14, 'sees') + 14, 'stop', { expr: 'sad' }], [L[15][0], 'idle', { expr: 'sad' }], [W(15, 'Ten'), 'facepalm', { expr: 'sad' }], [L[15][0] + 100, 'reach', { expr: 'relief' }]], 10,
      f >= L[16][0] - 4 ? { x: FARMX + 2.2, y: 0.5, z: 9.6, yaw: Math.PI, seat: 0.5 } : { x: hw.x, y: 0.5, z: hw.z, yaw: hw.moving ? hw.yaw : Math.PI }); }
  else hide(HEN);
  // weather
  const rainOn = f >= L[9][0] - 4 && f < W(9, 'sun') - 3;
  // camp lantern
  const campOn = f >= L[10][0] - 4 && f < L[11][0] - 4; LANT.light.position.y = campOn ? 0.75 : -40; LANT.glow.position.y = campOn ? 0.75 : -40; LANT.base = campOn ? 2.6 : 0;
  // ---------- shots ----------
  const mP = (q) => { const s = mowAt(q); return [s.x, s.y, s.z]; };
  const tr = (off, o = {}) => K.track(f, mP, { off, lag: 3, ...o });
  const S = [
    [0, (u) => { const t = tr([3.2, 0.7, 3.2], { lookY: 0.9 }); return { pos: t.pos, look: [t.look[0], t.look[1], 0.4], fov: 50, cinf: 6 }; }],
    [W(0, 'Alvin') - 4, (u) => { const t = tr([1.6, 1.6, 1.8], { lookY: 1.4 }); return { pos: t.pos, look: t.look, fov: 40, cinf: 12 }; }],
    [L[1][0] - 4, (u) => { const t = tr([-1.2, 0.5, 2.0], { lookY: 0.4 }); return { pos: t.pos, look: [t.look[0] + 0.8, t.look[1], t.look[2]], fov: 42, cinf: 12 }; }, { whip: true }],
    [W(1, 'towing') - 4, (u) => { const t = tr([-5.5, 2.0, 3.6], { lookY: 0.9 }); return { pos: t.pos, look: t.look, fov: 44, cinf: 8 }; }],
    [L[2][0] - 4, (u) => ({ pos: [FARMX + 4.0, 1.4, 7.6], look: [FARMX + 4.0, 1.3, 9.8], fov: 40 * K.push(u, 0.14), cinf: 12, noPush: true }), { whip: true }],
    [W(2, 'spoken') - 4, (u) => ({ pos: [lerp(FARMX - 6, FARMX - 3, u), 4.0, -4], look: [FARMX + 2, 2.2, 12], fov: 48, cinf: 5 })],
    [L[3][0] - 4, (u) => ({ pos: [HOUSE + 2.0, 1.6, 4.4], look: [HOUSE + 2.4, 1.6, 6.2], fov: 38, cinf: 14 }), { whip: true }],
    [W(3, 'bus') - 6, (u) => ({ pos: [HOUSE + 6.5, 1.6, 1.8], look: [HOUSE + 7.6, 1.7, 5.0], fov: 46, cinf: 8 })],
    [L[4][0] - 4, (u) => ({ pos: [HOUSE + 3.8, 1.3, 3.6], look: [HOUSE + 0.6, 0.8, 5.6], fov: 44, cinf: 10 }), { whip: true }],
    [W(4, 'putters') - 6, (u) => ({ pos: [HOUSE + 9, 1.4, -1.5], look: mP(f).map((v, i) => i === 1 ? 0.8 : v), fov: 44, cinf: 8 })],
    [L[5][0] - 4, (u) => { const t = tr([8, 1.6, -1.5], { lookY: 1.2 }); return { pos: t.pos, look: [t.look[0] - 2, t.look[1], 0.2], fov: 48, cinf: 6 }; }, { whip: true }],
    [W(5, 'Neighbors') - 4, (u) => ({ pos: [25.0, 1.8, 3.6], look: [25.0, 1.7, 7.1], fov: 44, cinf: 10 })],
    [W(5, 'cows') - 4, (u) => ({ pos: [30, 1.5, -2.0], look: [30, 0.9, -7.0], fov: 50 * K.punch(f, W(5, 'cows'), 0.12, 6), cinf: 10, noPush: true })],
    [L[6][0] - 4, (u) => { const t = tr([2.2, 1.0, 2.4], { lookY: 0.8 }); return { pos: t.pos, look: t.look, fov: 42, cinf: 10 }; }, { whip: true }],
    [W(6, 'coughs') - 4, (u) => { const p = mP(f); const sh = K.shake(f, W(6, 'dies'), 0.05, 12); return { pos: [p[0] + 1.6 + sh[0], 1.2 + sh[1], p[2] + 1.4], look: [p[0] + 0.6, 0.9, p[2]], fov: 40 * K.punch(f, W(6, 'dies'), 0.14, 6), cinf: 14, noPush: true }; }],
    [L[7][0] - 4, (u) => { const p = mP(f); return { pos: [p[0] - 2, 2.6, p[2] + 7], look: [p[0] - 3.5, 1.0, p[2]], fov: 48, cinf: 5 }; }, { whip: true }],
    [W(7, 'Everyone') - 4, (u) => { const p = mP(f); return { pos: [p[0] + 1.7, 1.7, 0.6], look: [p[0] + 1.7, 1.5, 4.7], fov: 42, cinf: 10 }; }],
    [L[8][0] - 4, (u) => ({ pos: [HOUSE + 2.0, 1.6, 4.0], look: [HOUSE + 2.0, 1.4, 6.2], fov: 44, cinf: 10 }), { whip: true }],
    [W(8, 'starts') - 6, (u) => { const t = tr([3.4, 1.3, -2.2], { lookY: 0.9 }); return { pos: t.pos, look: t.look, fov: 46, cinf: 8 }; }],
    [L[9][0] - 4, (u) => { const t = tr([1.8, 1.7, 2.0], { lookY: 1.5 }); return { pos: t.pos, look: t.look, fov: 40, cinf: 12, light: RAINL }; }, { whip: true }],
    [W(9, 'sun') - 4, (u) => { const t = tr([-2.4, 0.6, 2.6], { lookY: 1.2 }); return { pos: t.pos, look: t.look, fov: 44, cinf: 10, light: HOT }; }],
    [W(9, 'money') - 4, (u) => { const p = mP(f); return { pos: [p[0] + 1.1, 1.75, p[2] + 1.3], look: [p[0], 1.45, p[2]], fov: 38, cinf: 16, light: HOT }; }],
    [L[10][0] - 4, (u) => ({ pos: [CAMP + lerp(5, 4, u), 1.6, 9.5], look: [CAMP - 0.5, 0.9, 5.6], fov: 46, cinf: 6, light: DUSK }), { whip: true }],
    [W(10, 'waiting') - 4, (u) => ({ pos: [CAMP - 0.4, 1.3, 9.6], look: [CAMP - 1.0, 1.0, 7.4], fov: 40, cinf: 14, light: DUSK })],
    [L[11][0] - 4, (u) => { const t = tr([-4.5, 1.2, 3.0], { lookY: 0.8 }); return { pos: t.pos, look: t.look, fov: 46, cinf: 6 }; }, { whip: true }],
    [W(11, 'mower') - 4, (u) => { const p = mP(f); return { pos: [p[0] + 1.6, p[1] + 1.4, p[2] + 1.6], look: [p[0] + 0.3, p[1] + 1.1, p[2]], fov: 40 * K.punch(f, W(11, 'mower'), 0.14, 6), cinf: 14, noPush: true }; }],
    [L[12][0] - 4, (u) => { const p = mP(f); return { pos: [p[0] + 3.6, p[1] + 1.6, p[2] + 3.2], look: [p[0] + 1.0, p[1] + 1.0, p[2] + 0.6], fov: 44, cinf: 8 }; }, { whip: true }],
    [W(12, 'family') - 4, (u) => ({ pos: [HILL - 1.7, 1.5, 7.8], look: [HILL - 1.8, 1.2, 3.6], fov: 46, cinf: 8 })],
    [L[13][0] - 4, (u) => ({ pos: [FARMX - 31.5, 1.5, 9.4], look: [FARMX - 30, 1.6, 4.6], fov: 44, cinf: 8 }), { whip: true }],
    [W(13, 'rolls') - 6, (u) => { const t = tr([-2.6, 2.4, -4.2], { lookY: 0.9 }); return { pos: t.pos, look: t.look, fov: 46, cinf: 6 }; }],
    [L[14][0] - 4, (u) => ({ pos: [FARMX + 1.3, 1.5, 7.3], look: [FARMX + 2.0, 1.7, 10.0], fov: 42, cinf: 10 }), { whip: true }],
    [W(14, 'sees') - 4, (u) => ({ pos: [FARMX + 1.8, 1.9, 7.2], look: [FARMX + 1.8, 1.8, 9.8], fov: 38 * K.punch(f, W(14, 'sees') + 6, 0.12, 6), cinf: 14, noPush: true })],
    [L[15][0] - 4, (u) => ({ pos: [FARMX + 1.9, 1.7, 10.0], look: [FARMX + 1.0, 1.6, 8.4], fov: 38, cinf: 14 }), { whip: true }],
    [W(15, 'Ten') - 4, (u) => ({ pos: [lerp(FARMX + 5.0, FARMX + 4.2, u), 1.4, 5.6], look: [FARMX + 1.4, 1.4, 9.0], fov: 44, cinf: 8 })],
    [L[16][0] - 4, (u) => ({ pos: [FARMX + 1.6, lerp(1.6, 2.4, u), lerp(5.6, 4.6, u)], look: [FARMX + 1.6, 1.4, 9.6], fov: 46, cinf: 8 }), { whip: true }],
    [L[17][0] - 4, (u) => { const t = tr([3.2, 0.7, 3.2], { lookY: 0.9 }); return { pos: t.pos, look: [t.look[0], t.look[1], 0.4], fov: 50, cinf: 6 }; }, { whip: true }],
    [L[18][0] - 4, (u) => { const t = tr([2.0, 1.5, 1.6], { lookY: 1.4 }); return { pos: t.pos, look: t.look, fov: 42, cinf: 12 }; }],
  ];
  const R = D.runShots(S, f, TOTAL), cam = R.cam;
  // rain streaks around the camera
  RAIN.forEach((r, i) => { r.visible = rainOn; if (!rainOn) return; const a = (i * 0.618) % 1, b = (i * 0.381) % 1, t = ((f * 0.09 + i * 0.137) % 1);
    r.position.set(cam.pos[0] + (a - 0.5) * 8, cam.pos[1] + 3 - t * 5, cam.pos[2] + (b - 0.5) * 8 - 2); r.rotation.z = 0.15; });
  if (R.id === 2) D.card(fx, f, L[1][0] + 4, '5 MPH', cam, '#ffffff', 170, 50, 0.45);
  if (R.id === 21) D.card(fx, f, W(9, 'money'), '$0', cam, '#ff5a3a', 200, 40, 0.78);
  return { light: R.light || DAY, cam, dof: R.dof, actors: [], fx };
}
export default { TOTAL, look: 'rich', build, frame };
