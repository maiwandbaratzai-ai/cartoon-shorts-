// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why did a bicycle cop chase Walter Arnold for five miles?" (story, inspired by Paddock Wood, Kent, 28 Jan 1896:
// Arnold was fined for doing 8 mph in a 2 mph zone after a constable chased him on a bicycle; the red-flag man rule
// was scrapped later that year and cars celebrated with the London-to-Brighton run.)
// Sets: a Kent country lane with oast houses, hedges, fields and a farm gate; a wood-panelled courtroom; the Brighton run.
import { TOTAL, LINES, wf } from './speeding_timing.js';
import * as PR from '../props.js';
import * as D from './d19.js';
import * as X from './kit3d.js';
const { clamp, lerp, sm } = D;
export { TOTAL };
const L = LINES, W = wf;
let PL = [];
let K, CAR, SLOW, RACE = [], BIKE, FLAG, COIN, GOOSE, HORSE, SHEEP = [], GATE, MUD;
let ARN, COP, FLAGM, SLOWD, FARM1, FARM2, JUDGE, CLERK, RD = [], FANS = [];
const ARN_O = { jacket: '#7a5a3a', pants: '#4a3a2a', boots: '#2a1a12', hat: 'cap', cap: '#5a4a3a', scarf: '#c0392b', moustache: '#3a2418', glasses: '#2a2a2a', gloves: '#d8c8a8', pockets: true };
const COP_O = { jacket: '#1a2440', pants: '#1a2440', boots: '#111', hat: 'police', hatColor: '#1a2440', badge: true, belt: '#2a2a2a', moustache: '#2a1a12', gloves: '#ffffff' };
const FLAG_O = { jacket: '#5a7a3a', pants: '#5a4a34', boots: '#3a2418', hat: 'beanie', hatColor: '#c0392b', vest: '#c8a060', scarf: '#f2c230' };
const SLOWD_O = { jacket: '#3a4a6a', pants: '#2a2a30', boots: '#1e1a18', hat: 'tophat', hatColor: '#2a2a2a', bowtie: '#c0392b', vest: '#e8dcc4', moustache: '#d8d8d8' };
const F1_O = { jacket: '#c8a060', pants: '#3a5a8a', boots: '#4a3020', hat: 'cowboy', hatColor: '#d8b860', vest: '#6a8a3a', pockets: true, scarf: '#e05a3a' };
const F2_O = { jacket: '#b84a6a', dress: '#b84a6a', hairStyle: 'bun', hair: '#8a4a24', apron: '#f4efe4', scarf: '#5aa0d0' };
const JUDGE_O = { jacket: '#1a1a1a', pants: '#1a1a1a', boots: '#111', hairStyle: 'curly', hair: '#f4f4f0', bowtie: '#ffffff', glasses: true, collar: '#ffffff' };
const CLERK_O = { jacket: '#5a3a5a', pants: '#2a2a30', hairStyle: 'short', hair: '#c8a040', tie: '#2a6a4a', glasses: '#333', collar: '#ffffff', vest: '#8a7a6a' };
const RD_O = [
  { jacket: '#2a6a7a', pants: '#2a2a30', hat: 'pilot', hatColor: '#6a4a2a', scarf: '#f2f2f2', glasses: '#333', gloves: '#2a1a12' },
  { jacket: '#8a2a2a', pants: '#3a3a40', hat: 'tophat', hatColor: '#4a3a2a', bowtie: '#f2c230', moustache: '#5a3a24', vest: '#e8d8b0' },
  { jacket: '#e0d0a8', pants: '#5a4a3a', hairStyle: 'ponytail', hair: '#2a1a12', scarf: '#8a3aa0', glasses: true, gloves: '#ffffff' }];
const FAN_O = [
  { jacket: '#3a6ea5', pants: '#2c3e5a', hat: 'cap', cap: '#e08a2a', scarf: '#f2c230', belt: '#3a2418' },
  { jacket: '#7a4a8a', dress: '#7a4a8a', hairStyle: 'long', hair: '#e8c060', collar: '#f4efe4', apron: '#f4efe4' },
  { jacket: '#c0632a', pants: '#2c3e5a', hairStyle: 'curly', hair: '#2a1a12', tie: '#1f2a4a', pockets: true },
  { jacket: '#2a6a3a', pants: '#3a2a1e', hat: 'beanie', hatColor: '#3a6ea5', vest: '#8a5a34', glasses: '#333' }];
const DAY = { az: 55, el: 36, sky: '#d8e8f4', ground: '#6a9a4a', hemi: 1.0, sun: '#fff0d8', sunI: 3.2, skyTop: '#4a86d8', skyHor: '#e8eef2', fog: '#dde8ee', fogNear: 50, fogFar: 260,
  sat: 1.15, vig: 0.24, shadowExt: 14, exposure: 1.12, ink: 0.55, bloom: 0.6 };
const COURT = { az: 80, el: 60, sky: '#5a4a3a', ground: '#4a3a2a', hemi: 1.5, sun: '#ffd8a8', sunI: 0.0, skyTop: '#1a120c', skyHor: '#1a120c', fog: '#1a120c', fogNear: 14, fogFar: 50,
  sat: 1.12, vig: 0.28, shadowExt: 14, exposure: 1.95, bloom: 0.55, ink: 0.55, cardTint: '#fff0e0' };
const CT = 400, RX = -300, GX = 96 + 0.105 * (wf(8, 'stops') - 626) + 2.6;   // court origin, race-road origin, the farm gate

function wheel(r, col, spokes = 10) {
  const { THREE } = K; const g = K.group(); const m = K.mat('wood', col, { detail: 0.3 }); const iron = K.mat('metal', '#2a2a2a');
  K.add(new THREE.TorusGeometry(r, 0.035, 8, 28), iron, 0, 0, 0, g); K.add(new THREE.TorusGeometry(r - 0.04, 0.02, 6, 28), m, 0, 0, 0, g);
  for (let i = 0; i < spokes; i++) { const s = K.slab(-0.012, 0.012, 0, r - 0.04, -0.012, 0.012, m, g); s.rotation.z = (i / spokes) * Math.PI * 2; }
  K.cyl(0.06, 0.06, 0.08, iron, 0, -0.04, 0, g).rotation.x = Math.PI / 2; return g;
}
// 1896 horseless carriage: wooden body, bench, big rear wheels, tiller, brass lamps; drives along +x
function carriage(col, trim = '#f2c230') {
  const { THREE } = K; const g = K.group(); const body = K.mat('wood', col, { detail: 0.4 }), dark = K.mat('wood', '#3a2418'), brass = K.toon({ color: '#e8b840', plain: true, roughness: 0.25, metalness: 0.6, emissive: '#3a2600' });
  K.slab(-1.0, 0.9, 0.5, 0.62, -0.55, 0.55, dark, g);                               // chassis
  K.slab(-1.0, 0.1, 0.62, 1.0, -0.55, 0.55, body, g);                               // rear box (engine)
  K.slab(0.1, 0.9, 0.62, 0.78, -0.55, 0.55, body, g);                               // footwell
  K.slab(0.75, 0.9, 0.62, 1.05, -0.55, 0.55, body, g);                              // dash
  K.slab(-0.95, 0.15, 0.62, 0.66, -0.58, 0.58, K.toon({ color: trim, plain: true }), g);
  K.slab(-0.35, 0.15, 1.0, 1.12, -0.5, 0.5, K.mat('fabric', '#7a1a1a', { detail: 0.2 }), g);   // seat cushion
  K.slab(-0.42, -0.32, 1.0, 1.55, -0.5, 0.5, K.mat('fabric', '#7a1a1a', { detail: 0.2 }), g);  // seat back
  K.beam(new THREE.Vector3(0.55, 0.78, 0), new THREE.Vector3(0.4, 1.35, 0), 0.025, K.mat('metal', '#2a2a2a'), g);   // tiller
  K.cyl(0.04, 0.04, 0.3, brass, 0.4, 1.33, -0.15, g).rotation.x = Math.PI / 2;
  for (const z of [-0.5, 0.5]) { K.cyl(0.07, 0.06, 0.16, brass, 0.95, 0.95, z, g).rotation.z = Math.PI / 2; K.sphere(0.05, K.toon({ color: '#fff2c0', plain: true, emissive: '#ffd880' }), 1.03, 0.95, z, g); }
  K.cyl(0.06, 0.06, 0.4, K.mat('metal', '#2a2a2a'), -1.05, 0.7, 0.3, g).rotation.z = Math.PI / 2;   // exhaust
  const wh = []; for (const [x, r] of [[-0.6, 0.55], [0.7, 0.36]]) for (const z of [-0.68, 0.68]) { const w = wheel(r, '#c8902a'); w.position.set(x, r, z); g.add(w); wh.push([w, r]); }
  return { root: g, wh, roll(d) { for (const [w, r] of wh) w.rotation.z = -d / r; } };
}
function bicycle() {
  const { THREE } = K; const g = K.group(); const fr = K.mat('metal', '#1a1a1a', { roughness: 0.4 }); const wh = [];
  for (const x of [-0.52, 0.52]) { const w = K.group(g); w.position.set(x, 0.36, 0); K.add(new THREE.TorusGeometry(0.34, 0.025, 8, 28), K.mat('metal', '#222'), 0, 0, 0, w);
    for (let i = 0; i < 12; i++) { const s = K.slab(-0.004, 0.004, 0, 0.32, -0.004, 0.004, K.mat('metal', '#bbb'), w); s.rotation.z = (i / 12) * Math.PI * 2; } wh.push(w); }
  const v = (x, y) => new THREE.Vector3(x, y, 0);
  for (const [a, b] of [[v(-0.52, 0.36), v(-0.05, 0.36)], [v(-0.05, 0.36), v(-0.2, 0.86)], [v(-0.05, 0.36), v(0.42, 0.84)], [v(-0.2, 0.82), v(0.42, 0.82)], [v(-0.52, 0.36), v(-0.2, 0.82)], [v(0.52, 0.36), v(0.42, 0.95)]]) K.beam(a, b, 0.02, fr, g);
  K.slab(-0.32, -0.08, 0.86, 0.92, -0.07, 0.07, K.mat('fabric', '#3a2418'), g);                    // saddle
  K.beam(new THREE.Vector3(0.42, 0.98, -0.25), new THREE.Vector3(0.42, 0.98, 0.25), 0.018, fr, g);   // handlebar
  K.sphere(0.05, K.toon({ color: '#c0c0c0', plain: true, metalness: 0.6, roughness: 0.2 }), 0.48, 1.0, 0.18, g);  // bell
  return { root: g, roll(d) { for (const w of wh) w.rotation.z = -d / 0.34; } };
}
function oast(x, z, s) {
  const { THREE } = K; const g = K.group(); g.position.set(x, 0, z); g.scale.setScalar(s);
  K.cyl(1.5, 1.5, 4, K.mat('brick', '#b8583a', { detail: 1.2 }), 0, 0, 0, g, 20); K.add(new THREE.ConeGeometry(1.7, 3.4, 20), K.mat('plaster', '#f2ece0'), 0, 5.7, 0, g);
  K.add(new THREE.BoxGeometry(0.6, 0.8, 0.8), K.mat('wood', '#f2ece0'), 0, 7.6, 0, g);
  K.add(new THREE.BoxGeometry(4.2, 3, 3.2), K.mat('brick', '#c8b898', { detail: 1.2 }), 2.6, 1.5, 0, g); K.add(new THREE.BoxGeometry(4.4, 0.3, 3.6), K.mat('wood', '#6a3a24'), 2.6, 3.1, 0, g).rotation.z = 0.05;
  return g;
}
function build(k) {
  K = k; D.init(K); X.init(K); const { THREE } = K; const r = X.rnd(7);
  // ---- Kent lane ----
  K.slab(-500, 600, -0.3, 0, -300, 300, K.mat('grime', '#6aa04a', { amt: 0.55, detail: 2 }), K.scene, false);           // fields
  K.slab(-60, 180, 0, 0.03, -2.2, 2.2, K.mat('dirt', '#b89868', { detail: 0.9, bump: 0.02 }), K.scene, false);          // the lane
  for (const z of [-0.8, 0.8]) K.slab(-60, 180, 0.03, 0.035, z - 0.18, z + 0.18, K.mat('dirt', '#9a7a52', { detail: 0.5 }), K.scene, false);  // wheel ruts
  const hedge = K.mat('grime', '#3f7a34', { amt: 0.6, detail: 0.5, bump: 0.04 });
  for (let x = -60; x < 180; x += 9) { if (x > 31 && x < 66) continue; K.slab(x, x + 8.2, 0, 1.3, -4.0, -3.2, hedge); K.slab(x, x + 8.2, 0, 1.2, 7.4, 8.1, hedge); }
  for (let i = 0; i < 34; i++) { const x = -50 + i * 7 + r() * 3, z = (i % 2 ? -1 : 1) * (6 + r() * 14); X.tree(x, z, 1.2 + r() * 0.8, K.mat('wood', '#5a3a24'), K.mat('grime', ['#4a8a3a', '#5a9a40', '#3a7a30'][i % 3], { amt: 0.5, bump: 0.05 }), K.scene, r); }
  for (const [x, z, s] of [[-14, -14, 1], [18, -20, 1.2], [60, -16, 1], [96, -22, 1.1], [140, -15, 1], [30, 16, 1]]) oast(x, z, s);
  for (let i = 0; i < 14; i++) { const h = K.sphere(30 + r() * 20, K.mat('grime', ['#7ab05a', '#6aa04a', '#8ab868'][i % 3], { amt: 0.4 }), -100 + i * 50, -14, -120 - r() * 60); h.scale.y = 0.45; }
  // speed-limit sign + mile post
  const sp = K.group(); sp.position.set(2.5, 0, -2.7); K.cyl(0.05, 0.05, 2.2, K.mat('wood', '#5a3a24'), 0, 0, 0, sp);
  D.sign(1.2, 0.9, D.txtTex(320, 240, '#f4f0e0', '#1a1a1a', ['SPEED LIMIT', '2 M.P.H.'], 'bold 52px Georgia, serif'), 0, 2.0, 0.06, 0, sp, 'plaster');
  const mp = D.sign(0.5, 0.7, D.txtTex(128, 180, '#e8e0d0', '#2a2a2a', ['KENT', '5 mi'], 'bold 40px Georgia'), 24, 0.45, -2.5, 0.2, K.scene, 'rock');
  // field fence on the far side (farmers lean on it) + gate across the lane
  X.fence(32, 66, -3.0, 1.1, K.mat('wood', '#8a6a4a'));
  GATE = K.group(); GATE.position.set(GX, 0, 0); for (let i = 0; i < 5; i++) K.slab(-0.06, 0.06, 0.2 + i * 0.25, 0.3 + i * 0.25, -2.2, 2.2, K.mat('wood', '#c8b898'), GATE);
  K.beam(new THREE.Vector3(0, 0.2, -2.1), new THREE.Vector3(0, 1.3, 2.1), 0.05, K.mat('wood', '#c8b898'), GATE);
  for (const z of [-2.3, 2.3]) K.cyl(0.12, 0.12, 1.6, K.mat('wood', '#6a4a30'), GX, 0, z);
  D.sign(1.0, 0.45, D.txtTex(256, 110, '#2a4a2a', '#f4f0e0', ['FARM GATE'], 'bold 44px Georgia'), GX - 0.1, 1.55, -2.3, -Math.PI / 2, K.scene, 'wood');
  MUD = K.slab(104, 110, 0.03, 0.045, -2.1, 1.6, K.mat('dirt', '#5a3a22', { roughness: 0.15, amt: 0.3 }), K.scene, false);
  // vehicles + rider
  CAR = carriage('#2a4a7a'); SLOW = carriage('#6a2a3a', '#e8dcc4'); BIKE = bicycle();
  FLAG = K.group(); K.cyl(0.015, 0.015, 1.2, K.mat('wood', '#5a3a24'), 0, 0, 0, FLAG); const fl = K.add(new THREE.PlaneGeometry(0.6, 0.4, 6, 2), K.toon({ color: '#d0201a', plain: true, side: THREE.DoubleSide }), 0.3, 1.0, 0, FLAG); fl.name = 'cloth';
  COIN = K.cyl(0.05, 0.05, 0.012, K.toon({ color: '#d8d8e0', plain: true, roughness: 0.2, metalness: 0.7, emissive: '#2a2a30' }), 0, -10, 0); COIN.rotation.x = Math.PI / 2;
  GOOSE = K.animal('duck', { seed: 3, scale: 2.0, color: '#f4f2ea' });
  HORSE = K.animal('horse', { seed: 5, color: '#a86a3a' });
  for (let i = 0; i < 4; i++) SHEEP.push(K.animal('sheep', { seed: 20 + i }));
  // ---- courtroom ----
  K.slab(CT - 9, CT + 9, -0.2, 0.02, -9, 9, K.mat('wood', '#7a4a2a', { detail: 0.45 }), K.scene, false);
  const panel = K.mat('wood', '#8a5a34', { detail: 0.8 }), wall = K.mat('plaster', '#d8c8a8');
  K.slab(CT - 9, CT + 9, 0, 6, -6.2, -6, wall); K.slab(CT - 9, CT + 9, 0, 1.6, -6.0, -5.9, panel); K.slab(CT - 9.2, CT - 9, 0, 6, -6, 9, wall); K.slab(CT + 9, CT + 9.2, 0, 6, -6, 9, wall); K.slab(CT - 9, CT + 9, 6, 6.2, -6, 9, K.mat('wood', '#5a3420')); K.slab(CT - 9, CT + 9, 0, 6, 9, 9.2, wall);
  K.slab(CT - 2.5, CT + 2.5, 0, 1.5, -4.6, -3.4, panel); K.slab(CT - 2.6, CT + 2.6, 1.5, 1.6, -4.7, -3.3, K.mat('wood', '#5a3420'));   // judge's bench
  K.slab(CT - 2.5, CT + 2.5, 0, 0.9, -5.9, -4.6, panel);
  D.sign(2.4, 1.2, D.txtTex(480, 240, '#3a2a5a', '#f2c230', ['TUNBRIDGE WELLS', 'COURT'], 'bold 46px Georgia'), CT, 4.2, -5.88, 0, K.scene, 'fabric');
  const dock = K.group(); dock.position.set(CT + 3.2, 0, 0.4); for (const [a, b, c, d] of [[-0.8, 0.8, -0.7, -0.6], [-0.8, 0.8, 0.6, 0.7], [-0.8, -0.7, -0.7, 0.7]]) K.slab(a, b, 0, 1.05, c, d, panel, dock);
  for (const [x, z] of [[-3.5, 1.8], [0, 2.4], [-3.5, 3.6], [0, 4.2]]) K.slab(CT + x - 1.4, CT + x + 1.4, 0.4, 0.5, z - 0.25, z + 0.25, K.mat('wood', '#6a3a20'));
  K.add(new THREE.BoxGeometry(0.06, 0.2, 0.2), K.mat('wood', '#3a2418'), CT + 0.8, 1.66, -3.9); K.cyl(0.12, 0.12, 0.08, K.mat('wood', '#3a2418'), CT + 0.8, 1.6, -3.7);   // gavel
  { const sh = D.sign(0.5, 0.36, D.txtTex(400, 290, '#f4f0e0', '#1a1a1a', ['CHARGE:', 'DRIVING A', 'LOCOMOTIVE', 'WITHOUT', 'A HORSE'], 'bold 44px Georgia'), CT - 0.4, 1.615, -3.8, 0, K.scene, 'plaster'); sh.rotation.x = -Math.PI / 2; }
  for (const x of [-6, 6]) { K.slab(CT + x - 1, CT + x + 1, 2, 4.5, -5.99, -5.95, K.toon({ color: '#cfe6f4', plain: true, emissive: '#6a8aa0' })); K.shaft([CT + x, 4, -5.9], [CT + x * 0.6, 0, -1], 0.5, 1.6, '#fff0c8', 0.1); }
  K.lamp(CT + 1.5, 5.3, -1.0, { color: '#ffe0a8', intensity: 5, distance: 12, glowS: 0.15 }); K.lamp(CT + 3, 2.6, 1.8, { color: '#ffe0b8', intensity: 4.5, distance: 8 }); K.lamp(CT - 3.5, 2.8, 2.6, { color: '#ffe0b8', intensity: 3.0, distance: 8 });
  K.dust([CT, 2, -1], [6, 3, 5], 90);
  // ---- Brighton run (a wider road with bunting, a banner and crowds) ----
  K.slab(RX - 80, RX + 80, 0, 0.03, -3.2, 3.2, K.mat('dirt', '#c8a878', { detail: 0.9 }), K.scene, false);
  for (const z of [-4.2, 4.2]) for (let x = RX - 70; x < RX + 70; x += 1.6) K.slab(x - 0.04, x + 0.04, 0, 1.0, z - 0.04, z + 0.04, K.mat('wood', '#e8e0d0'));
  for (const x of [RX - 4, RX + 30]) { for (const dx of [-3.7, 3.7]) K.cyl(0.1, 0.1, 3.8, K.mat('wood', '#6a4a30'), x + dx, 0, -4.8);
    } for (const x of [RX - 4, RX + 30]) D.sign(7.2, 1.1, D.txtTex(1024, 160, '#c8202a', '#ffffff', ['LONDON  TO  BRIGHTON'], 'bold 104px Arial Black, Arial'), x, 3.2, -4.75, 0, K.scene, 'fabric');
  for (let i = 0; i < 40; i++) { const b = K.add(new THREE.ConeGeometry(0.18, 0.35, 3), K.toon({ color: ['#c8202a', '#ffffff', '#2a4aa0', '#f2c230'][i % 4], plain: true }), RX - 30 + i * 1.6, 3.6 - 0.25 * Math.sin((i % 10) / 10 * Math.PI), -4.6); b.rotation.z = Math.PI; }
  for (let i = 0; i < 3; i++) RACE.push(carriage(['#c8202a', '#2a7a4a', '#e8b840'][i]));
  for (let i = 0; i < 6; i++) { const h = K.add(new THREE.BoxGeometry(6, 5, 5), K.toon({ map: PR.facadeTex(['#c8b890', '#e0d0b0', '#b85a3a'][i % 3], 3, 3, 40 + i, '#f4efe4'), kind: 'brick', amt: 0.1 }), RX - 35 + i * 14, 2.5, -14); }
  // cast
  ARN = K.stick(ARN_O, { key: 'arn' }); COP = K.stick(COP_O, { key: 'cop' }); FLAGM = K.stick(FLAG_O, { key: 'flagm' }); SLOWD = K.stick(SLOWD_O, { key: 'slowd' });
  FARM1 = K.stick(F1_O, { key: 'f1' }); FARM2 = K.stick(F2_O, { key: 'f2' }); JUDGE = K.stick(JUDGE_O, { key: 'judge' }); CLERK = K.stick(CLERK_O, { key: 'clerk' });
  RD_O.forEach((o, i) => RD.push(K.stick(o, { key: 'rd' + i }))); FAN_O.forEach((o, i) => FANS.push(K.stick(o, { key: 'fan' + i })));
  K.addClouds(12, 700, 170);
  K.scene.traverse((o) => { if (o.isPointLight) PL.push(o); });
}

const hide = (...rs) => rs.forEach((x) => { x.root.visible = false; });
// chase: car + bike positions as a function of "chase time" (frames)
const CH0 = 626, STOP = W(8, 'stops');
const carX = (g) => g < STOP ? 96 + 0.105 * (g - CH0) : 96 + 0.105 * (STOP - CH0) + 0.6 * sm(STOP, STOP + 14, g);
const bikeX = (g) => g < STOP ? carX(g) - 6.5 + 0.5 * Math.sin(g / 20) : Math.min(carX(STOP) - 6.5 + 0.12 * (g - STOP), carX(STOP) - 1.6);
function frame(f) {
  const fx = [];
  const COURT0 = L[9][0] - 4, HORSE0 = L[10][0] - 4, RACE0 = L[11][0] - 4, END0 = L[12][0] - 4;
  const JUMP = W(5, 'jumps'), RULE0 = L[3][0] - 4, NOFLAG = L[5][0] - 4, CHASE = L[6][0] - 4, FLASH = L[1][0] - 4;
  // which "chase time" the lane is at: frame 0 is a flash-forward into the chase; the end loops back to it
  let g = null;
  if (f < FLASH) g = 700 + f * 0.9; else if (f >= CHASE && f < COURT0) g = f; else if (f >= W(12, 'bicycle') - 6) g = 700 + (f - TOTAL);
  // ---------- Arnold's car ----------
  let cx, cz = -0.75, carOn = true;
  if (g !== null) cx = carX(g);
  else if (f < RULE0) cx = -14 + 0.11 * (f - FLASH);                       // the intro drive past the sign
  else if (f < NOFLAG) carOn = false;
  else if (f < CHASE) cx = 3 + 0.11 * (f - NOFLAG);                         // he drives off, the constable jumps on his bike
  else if (f >= END0) cx = carX(STOP) + 0.0;                                // paying the fine at the gate
  else carOn = false;
  CAR.root.visible = carOn && f < COURT0 || (f >= END0);
  if (CAR.root.visible) { CAR.root.position.set(cx, 0, cz); CAR.root.rotation.y = 0; CAR.roll(cx); CAR.root.position.y = 0.015 * Math.sin(f * 1.7);
    if (g === null || g < STOP) for (let k = 0; k < 2; k++) K.puff(f, f - (f % 4) - k * 4, cx - 1.3 - k * 0.5, cz + 0.3, 3, 0.35 + k * 0.1, '#8a8a8a'); }
  const driving = CAR.root.visible && !(g !== null && g >= STOP + 10) && f < END0;
  if (CAR.root.visible) D.act(K, ARN, f, [[0, 'grab', { expr: 'grin', R: [0.5, 0.25, 'fist'], L: [0.45, 0.3, 'fist'] }], [W(2, 'caught') - 4, 'grab', { expr: 'laugh', R: [0.5, 0.25, 'fist'], L: [0.45, 0.3, 'fist'] }],
      [NOFLAG, 'shrug', { expr: 'grin' }], [W(5, 'man') + 4, 'wave', { expr: 'laugh' }], [CHASE, 'grab', { expr: 'nervous', R: [0.5, 0.25, 'fist'], L: [0.45, 0.3, 'fist'] }],
      [W(7, 'mud') - 3, 'shock', { expr: 'scared' }], [W(7, 'goose'), 'grab', { expr: 'nervous', R: [0.5, 0.25, 'fist'], L: [0.45, 0.3, 'fist'] }], [STOP, 'shock', { expr: 'shock' }], [STOP + 18, 'facepalm', { expr: 'nervous', sweat: true }],
      [END0, 'hold', { expr: 'nervous', sweat: true, R: [0.55, 0.1, 'fist'] }], [W(12, 'shilling'), 'shrug', { expr: 'pained' }], [W(12, 'bicycle') - 6, 'grab', { expr: 'grin', R: [0.5, 0.25, 'fist'], L: [0.45, 0.3, 'fist'] }]], 2,
    { x: cx - 0.15, y: 0.62 + CAR.root.position.y, z: cz, yaw: Math.PI / 2, seat: 0.42 });
  else hide(ARN);
  // ---------- constable + bicycle ----------
  let bx = null, bz = 0.75, cop = null;
  if (g !== null) bx = bikeX(g);
  else if (f >= JUMP - 2 && f < CHASE) bx = 1.6 + 0.08 * Math.max(0, f - JUMP) * Math.min(1, (f - JUMP) / 20);
  else if (f >= END0) bx = carX(STOP) - 1.6;
  const riding = bx !== null && (g !== null || f >= JUMP - 2);
  BIKE.root.visible = riding || (f >= FLASH && f < CHASE && f >= L[2][0] - 4);
  if (BIKE.root.visible) { const x = riding ? bx : 1.4; BIKE.root.position.set(x, 0, bz); BIKE.roll(x); BIKE.root.rotation.set(0, 0, 0); }
  const pedal = riding && (g !== null ? g <= STOP + 40 : f < END0);
  if (riding) {
    const ph = BIKE.root.position.x * 1.2;
    cop = D.act(K, COP, f, [[0, pedal ? 'run' : 'idle', { expr: 'angry', sweat: true, L: [0.62, 0.05, 'bar', true], R: [0.62, 0.05, 'bar', true] }],
      [W(7, 'mud'), 'run', { expr: 'pained', sweat: true, L: [0.62, 0.05, 'bar', true], R: [0.62, 0.05, 'bar', true] }], [W(7, 'goose') - 2, 'run', { expr: 'scared', L: [0.62, 0.05, 'bar', true], R: [0.62, 0.05, 'bar', true] }],
      [W(8, 'bicycle') - 4, 'cheer', { expr: 'laugh' }], [END0, 'hold', { expr: 'stern', R: [0.6, 0.05, 'open'] }], [W(12, 'shilling') + 2, 'show', { expr: 'grin', R: [0.4, -0.6, 'fist'] }], [W(12, 'bicycle') - 6, 'run', { expr: 'angry', sweat: true, L: [0.62, 0.05, 'bar', true], R: [0.62, 0.05, 'bar', true] }]], 3,
      { x: bx - 0.2, y: 0.36, z: bz, yaw: Math.PI / 2 });
    if (pedal) { COP.root.userData.ph = ph; }
  } else if (f >= L[2][0] - 4 && f < JUMP - 2) {
    D.act(K, COP, f, [[0, 'cross', { expr: 'stern' }], [W(2, 'caught') - 4, 'write', { expr: 'stern' }], [RULE0, 'hips', { expr: 'stern' }], [NOFLAG, 'point', { expr: 'angry' }], [W(5, 'constable') - 4, 'throwBack', { expr: 'angry' }], [JUMP - 8, 'jump', { expr: 'angry' }]], 3,
      { x: 0.6, z: 2.2, yaw: f < NOFLAG ? 0.3 : 1.2 });
    if (f >= JUMP - 8) COP.root.position.y += 0.6 * Math.sin(Math.PI * clamp((f - JUMP + 8) / 8, 0, 1));
  } else hide(COP);
  if (pedal) for (let k = 0; k < 2; k++) K.puff(f, f - (f % 6) - k * 6, bx - 0.4, bz, 2, 0.2, '#c8b898');
  // ---------- the slow car + flag man (the 1896 rules) ----------
  const rules = f >= RULE0 && f < NOFLAG;
  SLOW.root.visible = rules; hide(FLAGM, SLOWD);
  const sx = -30 + 0.03 * (f - RULE0);
  if (rules) { SLOW.root.position.set(sx, 0, -0.8); SLOW.roll(sx); FLAGM.root.visible = true;
    D.act(K, SLOWD, f, [[0, 'grab', { expr: 'sleepy', R: [0.5, 0.25, 'fist'], L: [0.45, 0.3, 'fist'] }], [W(3, 'two') - 6, 'think', { expr: 'sleepy' }], [L[4][0], 'grab', { expr: 'neutral', R: [0.5, 0.25, 'fist'], L: [0.45, 0.3, 'fist'] }]], 4, { x: sx - 0.15, y: 0.62, z: -0.8, yaw: Math.PI / 2, seat: 0.42 });
    const fmx = sx + 5.0;
    D.act(K, FLAGM, f, [[0, 'stroll', { expr: 'neutral', R: [0.3, -0.5, 'flag'] }], [W(4, 'waving') - 6, 'stroll', { expr: 'grin', R: [0.35, -0.85, 'flag'] }]], 5, { x: fmx, z: -0.6, yaw: Math.PI / 2 });
    FLAGM.root.visible = true; X.holdAt(FLAGM, FLAG, 1, [0, 0, 0.25 * Math.sin(f * 0.35)], [0, -0.15, 0]);
    FLAG.children.find((c) => c.name === 'cloth').rotation.y = 0.4 * Math.sin(f * 0.5);
  } else if (f >= RACE0 && f < END0) {   // "England scraps the flag man": he throws the flag away
    FLAGM.root.visible = true; D.act(K, FLAGM, f, [[0, 'throwBack', { expr: 'grin' }], [RACE0 + 10, 'throw', { expr: 'laugh' }], [RACE0 + 26, 'cheer', { expr: 'laugh' }]], 5, { x: RX + 4, z: 4.9, yaw: Math.PI });
    const t = clamp((f - RACE0 - 10) / 30, 0, 1); FLAG.position.set(RX + 4 - 4 * t, 1.6 + 3.5 * t - 4.5 * t * t, 4.6 - 2 * t); FLAG.rotation.set(0, 0, -6 * t); FLAG.visible = f >= RACE0 + 10;
  } else FLAG.visible = false;
  // ---------- farmers (laugh at the chase) / goose / horse / sheep ----------
  if (f >= CHASE && f < L[7][0] - 4) {
    D.act(K, FARM1, f, [[0, 'pointL', { expr: 'grin' }], [W(6, 'laugh') - 3, 'laugh', { expr: 'laugh' }], [W(6, 'chases'), 'clap', { expr: 'laugh' }]], 6, { x: 49, z: -3.55, yaw: 0.2 });
    D.act(K, FARM2, f, [[0, 'shock', { expr: 'shock' }], [W(6, 'laugh'), 'laugh', { expr: 'laugh' }], [W(6, 'bicycle'), 'point', { expr: 'laugh' }]], 7, { x: 50.6, z: -3.65, yaw: -0.2 });
  } else hide(FARM1, FARM2);
  // goose chases the bike (line 7), else waddles by the gate
  if (g !== null && bx !== null && f < COURT0) { const gx = Math.max(bx - 2.4, 0); const chasing = f >= W(7, 'furious') - 12 && f < COURT0;
    GOOSE.set(f, chasing ? { x: bx - 0.9 - 0.3 * Math.sin(f / 7), z: 1.3, yaw: Math.PI / 2, mode: 'run', expr: 'angry', flap: true } : { x: GX - 2, z: 2.6, yaw: -1.2, mode: 'walk', expr: 'angry', speed: 0.3 }); }
  else GOOSE.root.visible = false;
  SHEEP.forEach((s, i) => s.set(f, { x: GX + 3 + i * 1.6, z: -6 - (i % 2) * 1.5, yaw: -1.4 + i, mode: i % 2 ? 'eat' : 'stand', expr: 'neutral', look: 0.3 * Math.sin(f / 30 + i) }));
  const horseOn = f >= HORSE0 && f < RACE0;
  if (horseOn) HORSE.set(f, { x: 58, z: -6, yaw: f < W(10, 'terrify') - 2 ? 0.3 : -1.3, mode: f < W(10, 'terrify') - 2 ? 'eat' : 'jump', expr: f < W(10, 'terrify') - 2 ? 'neutral' : 'shock' });
  else HORSE.set(f, { x: 58, z: -6, yaw: 0.3, mode: 'eat', expr: 'neutral' });
  if (horseOn) { CAR.root.visible = true; const hx = 54 + 0.12 * (f - HORSE0); CAR.root.position.set(hx, 0, -0.75); CAR.roll(hx); K.puff(f, f - (f % 4), hx - 1.3, -0.4, 3, 0.35, '#8a8a8a');
    D.act(K, ARN, f, [[0, 'wave', { expr: 'grin' }]], 2, { x: hx - 0.15, y: 0.62, z: -0.75, yaw: Math.PI / 2, seat: 0.42 }); }
  // ---------- court ----------
  if (f >= COURT0 && f < HORSE0) {
    D.act(K, JUDGE, f, [[0, 'read', { expr: 'stern', item: 'paper' }], [W(9, 'locomotive') - 4, 'read', { expr: 'confused', item: 'paper' }], [W(9, 'horse') - 2, 'shrug', { expr: 'confused' }]], 8, { x: CT, y: 0.9, z: -4.3, yaw: 0, seat: 0.5 });
    D.act(K, ARN, f, [[0, 'cross', { expr: 'nervous', sweat: true }], [W(9, 'driving'), 'shock', { expr: 'shock' }], [W(9, 'horse'), 'facepalm', { expr: 'pained' }]], 2, { x: CT + 3.2, z: 0.4, yaw: -0.6 });
    D.act(K, COP, f, [[0, 'salute', { expr: 'proud' }], [W(9, 'reads'), 'hips', { expr: 'grin' }], [W(9, 'horse'), 'point', { expr: 'laugh' }]], 3, { x: CT - 2.6, z: 0.6, yaw: 0.6 });
    D.act(K, CLERK, f, [[0, 'write', { expr: 'neutral' }], [W(9, 'locomotive'), 'laugh', { expr: 'laugh' }]], 9, { x: CT - 1.6, z: -2.2, yaw: 0.3 });
  } else hide(JUDGE, CLERK);
  // ---------- the Brighton run ----------
  const race = f >= RACE0 && f < END0;
  RACE.forEach((c, i) => { c.root.visible = race; if (!race) return; const x = RX - 16 + 0.16 * (f - RACE0) + i * 3.5 - (i === 1 ? 1.5 : 0) + 0.5 * Math.sin(f / 15 + i); c.root.position.set(x, 0.015 * Math.sin(f * 1.6 + i), (i - 1) * 1.6); c.roll(x);
    K.puff(f, f - (f % 4), x - 1.3, (i - 1) * 1.6 + 0.3, 3, 0.35, '#9a9a9a');
    D.act(K, RD[i], f, [[0, 'cheer', { expr: 'laugh' }], [RACE0 + 20 + i * 6, 'wave', { expr: 'excited' }], [RACE0 + 50, 'grab', { expr: 'grin', R: [0.5, 0.25, 'fist'], L: [0.45, 0.3, 'fist'] }]], 11 + i, { x: x - 0.15, y: 0.62 + c.root.position.y, z: (i - 1) * 1.6, yaw: Math.PI / 2, seat: 0.42 }); });
  if (!race) hide(...RD);
  FANS.forEach((p, i) => { if (!race) { p.root.visible = false; return; } D.act(K, p, f, [[0, i % 2 ? 'cheer' : 'wave', { expr: 'excited' }], [RACE0 + 30 + i * 4, i % 2 ? 'clap' : 'celebrate', { expr: 'laugh' }]], 20 + i, { x: RX - 14 + i * 2.6 + (i > 1 ? 14 : 0), z: 4.9 + (i % 2) * 0.4, yaw: Math.PI }); });
  // the shilling
  if (f >= W(12, 'One') - 8 && f < W(12, 'bicycle') - 6) { const t = clamp((f - W(12, 'One') + 8) / 14, 0, 1); const a = new K.THREE.Vector3(cx - 0.0, 1.55, cz + 0.4), b = new K.THREE.Vector3(bx + 0.3, 1.75, bz - 0.2);
    COIN.position.copy(a.lerp(b, t)); COIN.position.y += Math.sin(Math.PI * t) * 0.6; COIN.rotation.set(Math.PI / 2 + f * 0.6, 0, 0); COIN.visible = true; } else COIN.visible = false;
  // mud splash on "mud"
  if (f >= W(7, 'mud') - 2 && f < W(7, 'mud') + 20) for (let k = 0; k < 3; k++) K.puff(f, W(7, 'mud') - 2 + k * 3, carX(W(7, 'mud')) - 0.6 + k * 0.4, 0.2 * k - 0.6, 8, 0.45, '#5a3a22');
  if (f >= STOP && f < STOP + 20) K.puff(f, STOP, carX(STOP) + 0.6, -0.6, 10, 0.4, '#c8b898');
  // ---------- shots ----------
  const carP = (q) => [q < STOP ? carX(q) : carX(STOP), 0, -0.75], bikeP = (q) => [bikeX(q), 0, 0.75];
  const introP = (q) => [-14 + 0.11 * (q - FLASH), 0, -0.75];
  const tr = (at, off, o = {}) => K.track(f, at, { off, lag: 3, ...o });
  const S = [
    // L0: flash-forward: the bike cop chasing the smoking car
    [0, (u) => { const g2 = 700 + f * 0.9, c = carX(g2), b = bikeX(g2); return { pos: [b - 2.6, 1.5, 1.5 - 0.2 * u], look: [b + 2.6, 1.15, 0.1], fov: 44, cinf: 6 }; }],
    [W(0, 'Walter') - 4, (u) => { const b = bikeX(700 + f * 0.9); return { pos: [b + 2.2, 1.65, 2.3], look: [b - 0.1, 1.55, 0.75], fov: 38, cinf: 14 }; }],
    // L1: the car smoking through Kent (track), then the wheel insert
    [FLASH, (u) => { const t = tr(introP, [3.5, 1.4, 5.0], { lookY: 1.0 }); return { pos: t.pos, look: t.look, fov: 44, cinf: 6 }; }, { whip: true }],
    [W(1, 'eight') - 4, (u) => { const c = -14 + 0.11 * (f - FLASH); return { pos: [c - 0.1, 0.55, 1.0], look: [c - 0.65, 0.5, -0.1], fov: 40, cinf: 18 }; }],
    // L2: the sign, then the constable taking notes as the car roars past
    [L[2][0] - 4, (u) => ({ pos: [2.5 + 0.3 * u, 1.9, 0.6], look: [2.5, 2.0, -2.7], fov: 38, cinf: 16 }), { whip: true }],
    [W(2, 'caught') - 4, (u) => ({ pos: [lerp(2.2, 2.6, u), 1.6, 4.7], look: [0.6, 1.4, 2.2], fov: 38, cinf: 12 })],
    // L3: 1896: a car crawling so slowly a man with a wheelbarrow-speed flag walks ahead
    [RULE0, (u) => ({ pos: [sx + 9.5 - 0.6 * u, 1.4, 1.9], look: [sx + 2.5, 1.2, -0.6], fov: 44, cinf: 6 }), { whip: true }],
    [W(3, 'two') - 4, (u) => ({ pos: [sx + 1.4, 1.75, 1.6], look: [sx - 0.1, 1.55, -0.8], fov: 38 * K.punch(f, W(3, 'two'), 0.15, 6), cinf: 14, noPush: true })],
    // L4: the flag man close + tracking
    [L[4][0] - 4, (u) => { const x = sx + 5; return { pos: [x + 3.2, 1.3, 2.6], look: [x, 1.4, -0.6], fov: 40, cinf: 12 }; }],
    [W(4, 'waving') - 6, (u) => { const x = sx + 5; return { pos: [x + 1.6, 1.1, 1.2], look: [x + 0.1, 2.1, -0.6], fov: 42, cinf: 16 }; }],
    // L5: Arnold has no flag man (grins, waves), the constable jumps on his bike
    [NOFLAG, (u) => { const c = 3 + 0.11 * (f - NOFLAG); return { pos: [c + 2.4, 1.85, 1.2], look: [c - 0.1, 1.6, -0.75], fov: 38, cinf: 14 }; }, { whip: true }],
    [W(5, 'constable') - 4, (u) => ({ pos: [lerp(4.0, 4.6, u), 1.4, 4.6], look: [1.6, 1.3, 1.1], fov: 42 * K.punch(f, JUMP, 0.12, 6), cinf: 10, noPush: true })],
    // L6: farmers laugh as the chase passes
    [CHASE, (u) => ({ pos: [49.8 + 1.2 * u, 1.5, 2.4], look: [49.8, 1.35, -3.6], fov: 42, cinf: 10 }), { whip: true }],
    // L7: mud splash (low), the furious goose
    [L[7][0] - 4, (u) => { const c = carX(f); return { pos: [c + 3.0, 0.55, 3.2], look: [c - 0.4, 0.7, -0.4], fov: 46, cinf: 8 }; }, { whip: true }],
    [W(7, 'furious') - 6, (u) => { const t = tr(bikeP, [1.8, 0.8, 3.2], { lookY: 0.8 }); return { pos: t.pos, look: [t.look[0] - 1.2, t.look[1], t.look[2]], fov: 44, cinf: 10 }; }],
    // L8: the car stops at the gate, the bike catches up
    [L[8][0] - 4, (u) => ({ pos: [GX + 2.6, 1.4, 4.4], look: [GX - 2.5, 1.0, -0.2], fov: 44, cinf: 8 }), { whip: true }],
    [W(8, 'bicycle') - 4, (u) => ({ pos: [carX(STOP) + 3.2, 1.8, 6.6], look: [carX(STOP) - 0.8, 1.4, 0.0], fov: 38 * K.punch(f, W(8, 'wins'), 0.15, 6), cinf: 14, noPush: true })],
    // L9: court: wide, the charge sheet insert, the clerk laughing
    [COURT0, (u) => ({ pos: [CT + lerp(3.8, 3.3, u), 2.2, 6.0], look: [CT + 1.6, 1.4, -2.0], fov: 46, cinf: 6, light: COURT }), { whip: true }],
    [W(9, 'reads') - 4, (u) => ({ pos: [CT - 0.4, 2.2, -3.1], look: [CT - 0.4, 1.6, -3.8], fov: 46 * K.push(u, 0.12), cinf: 18, light: COURT, noPush: true })],
    [W(9, 'horse') - 8, (u) => ({ pos: [CT + 1.6, 1.65, 2.8], look: [CT + 3.2, 1.5, 0.4], fov: 38, cinf: 14, light: COURT })],
    // L10: why? horses: a horse in a field panics as a car passes
    [HORSE0, (u) => ({ pos: [lerp(53, 55, u), 1.7, 4.2], look: [57, 1.1, -4], fov: 46, cinf: 6 }), { whip: true }],
    [W(10, 'terrify') - 4, (u) => ({ pos: [61.5, 1.5, -1.6], look: [58, 1.2, -6], fov: 40 * K.punch(f, W(10, 'terrify'), 0.18, 6), cinf: 14, noPush: true })],
    // L11: the Brighton run
    [RACE0, (u) => ({ pos: [RX - 6 + 3 * u, 2.2, 8.5], look: [RX - 5, 1.6, -2], fov: 48, cinf: 5 }), { whip: true }],
    [W(11, 'race') - 4, (u) => { const x = RX - 16 + 0.16 * (f - RACE0) + 3.5; return { pos: [x + 3.6, 0.6, 3.4], look: [x - 0.5, 1.0, 0], fov: 46, cinf: 8 }; }],
    // L12: the shilling, the cop's grin, then back into the chase (loops into frame 0)
    [END0, (u) => ({ pos: [carX(STOP) - 1.1, 1.9, 5.4], look: [carX(STOP) - 1.1, 1.4, 0], fov: 42, cinf: 12 }), { whip: true }],
    [W(12, 'One') + 2, (u) => ({ pos: [carX(STOP) - 0.3, 1.95, 2.7], look: [carX(STOP) - 1.6, 1.85, 0.6], fov: 38, cinf: 14 })],
    [W(12, 'bicycle') - 6, (u) => { const g2 = 700 + (f - TOTAL), c = carX(g2), b = bikeX(g2); return { pos: [b - 2.7, 1.5, 1.6], look: [b + 2.6, 1.15, 0.1], fov: 45, cinf: 6 }; }, { whip: true }],
  ];
  const R = D.runShots(S, f, TOTAL), cam = R.cam;
  PL.forEach((l) => { l.visible = R.light === COURT; });
  if (R.id === 0 || R.id === 26) { const [a, b] = K.shake(f, f - (f % 12), 0.015, 12); cam.pos[0] += a; cam.pos[1] += b; }
  if (R.id === 13) { const [a, b] = K.shake(f, W(7, 'mud'), 0.06, 12); cam.pos[0] += a; cam.pos[1] += b; }
  if (R.id === 15) { const [a, b] = K.shake(f, STOP, 0.05, 10); cam.pos[0] += a; cam.pos[1] += b; }
  if (R.id === 3) D.card(fx, f, W(1, 'eight'), '8 MPH', cam, '#ffffff', 170, 40, 0.5);
  if (R.id === 7) D.card(fx, f, W(3, 'two'), '2 MPH', cam, '#f6c83a', 170, 40, 0.75);
  if (R.id === 25) D.card(fx, f, W(12, 'One'), '1 SHILLING', cam, '#ffffff', 150, 40, 0.55);
  return { light: R.light || DAY, cam, dof: R.dof, actors: [], fx };
}
export default { TOTAL, look: 'rich', build, frame };
