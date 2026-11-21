// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why was Lady Liberty's arm standing alone in a New York park?" (story, inspired by the real arm and torch shown at the
// 1876 Philadelphia Centennial and in Madison Square Park, New York, 1876-1882, to raise money; the head was shown in
// Paris in 1878; a newspaper campaign in 1885 paid for the pedestal; the statue was unveiled in 1886.)
// Sets: a New York park with the giant copper arm, a Paris workshop with the giant head, the harbor island.
import { TOTAL, LINES, wf } from './libertyarm_timing.js';
import * as PR from '../props.js';
import * as D from './d19.js';
import * as X from './kit3d.js';
const { clamp, lerp, sm } = D;
export { TOTAL };
const L = LINES, W = wf;
let PL = [];
let K, PIG = [], SNOW = [], COINS, JAR, FW = [], PAPER, BODYQ;
let SHOW, T1, T2, MOCK, KID1, KID2, NEWS, RICH, WK1, WK2;
const SHOW_O = { jacket: '#a8322a', pants: '#2a2a30', boots: '#1e1a18', hat: 'tophat', hatColor: '#2a2a2a', moustache: '#2a1a12', bowtie: '#f2c230', vest: '#f2e2c0' };
const T1_O = { jacket: '#5a8ac8', dress: '#5a8ac8', hairStyle: 'bun', hair: '#5a3a24', collar: '#ffffff', scarf: '#e8a040', gloves: '#ffffff' };
const T2_O = { jacket: '#4a7a3a', pants: '#3a2a1e', hat: 'cap', cap: '#c8a040', scarf: '#c0392b', pockets: true, belt: '#3a2418' };
const MOCK_O = { jacket: '#6a6a74', pants: '#2a2a30', boots: '#111', hat: 'tophat', hatColor: '#4a4a52', glasses: true, tie: '#7a1a2a', moustache: '#8a8a8a' };
const KID1_O = { jacket: '#e84a5f', pants: '#3a6ea5', hairStyle: 'ponytail', hair: '#5a3a24', dress: '#e84a5f', build: 'kid', scarf: '#f2c230' };
const KID2_O = { jacket: '#f2a830', pants: '#2c3e5a', hat: 'beanie', hatColor: '#3a6ea5', build: 'kid', pockets: true, collar: '#ffffff' };
const NEWS_O = { jacket: '#8a6a4a', pants: '#4a4a52', hat: 'cap', cap: '#3a3a3a', vest: '#c8b080', scarf: '#2a6a8a', pockets: true };
const RICH_O = { jacket: '#1f2a4a', pants: '#1f2a4a', hat: 'tophat', hatColor: '#111', build: 'stout', bowtie: '#c0392b', vest: '#c8a050', moustache: '#d8d8d8', glasses: '#c8a020' };
const WK1_O = { jacket: '#3a5a8a', pants: '#5a4a3a', hat: 'beanie', hatColor: '#2a2a2a', apron: '#8a6a4a', moustache: '#2a1a12', gloves: '#c8b090' };
const WK2_O = { jacket: '#f2ece0', pants: '#3a3a40', hairStyle: 'curly', hair: '#c8602a', apron: '#6a4a30', scarf: '#c0392b', belt: '#2a1a12' };
const DAY = { az: 60, el: 40, sky: '#d8e8f4', ground: '#6a9a4a', hemi: 1.0, sun: '#fff0d8', sunI: 3.2, skyTop: '#4a86d8', skyHor: '#e8eef2', fog: '#dde8ee', fogNear: 60, fogFar: 260,
  sat: 1.15, vig: 0.24, shadowExt: 18, exposure: 1.12, ink: 0.55, bloom: 0.6 };
const IN = { az: 80, el: 60, sky: '#5a4a3a', ground: '#4a3a2a', hemi: 1.3, sun: '#ffd8a8', sunI: 0.0, skyTop: '#1a120c', skyHor: '#1a120c', fog: '#1a120c', fogNear: 16, fogFar: 60,
  sat: 1.12, vig: 0.28, shadowExt: 14, exposure: 1.8, bloom: 0.55, ink: 0.55, cardTint: '#fff0e0' };
const GOLD = { az: 70, el: 14, sky: '#f8c8a0', ground: '#6a7a5a', hemi: 0.95, sun: '#ffc890', sunI: 3.0, skyTop: '#5a6ac8', skyHor: '#ffb890', fog: '#f8c8a8', fogNear: 60, fogFar: 320,
  sat: 1.2, vig: 0.3, shadowExt: 30, exposure: 1.1, ink: 0.5, bloom: 0.8 };
const AX = 0, AZ = -6, PX = 300, IX = -300;   // arm, Paris workshop, harbor island
const COPPER = () => K.mat('metal', '#c8784a', { roughness: 0.35, detail: 0.8, amt: 0.25 });

// the giant copper arm with torch, balcony and ladder
function arm(x, z, parent) {
  const { THREE } = K; const g = K.group(parent); g.position.set(x, 0, z); const cu = COPPER();
  K.slab(-2, 2, 0, 3, -2, 2, K.mat('rock', '#c8bca8', { detail: 1 }), g);
  K.cyl(1.15, 0.95, 9, cu, 0, 3, 0, g, 24);
  const fist = K.sphere(1.15, cu, 0, 12.6, 0, g); fist.scale.set(1, 0.9, 1.05);
  for (let i = 0; i < 4; i++) K.sphere(0.34, cu, -0.75 + i * 0.5, 12.9, 0.95, g);            // knuckles
  K.cyl(0.35, 0.3, 1.6, cu, 0, 13, 0, g);
  K.add(new THREE.CylinderGeometry(1.5, 0.55, 1.2, 24), cu, 0, 15.0, 0, g);                 // torch cup
  K.add(new THREE.TorusGeometry(2.1, 0.06, 8, 40), K.mat('metal', '#8a5a3a'), 0, 15.2, 0, g).rotation.x = Math.PI / 2;
  K.add(new THREE.TorusGeometry(2.1, 0.05, 8, 40), K.mat('metal', '#8a5a3a'), 0, 15.9, 0, g).rotation.x = Math.PI / 2;
  K.add(new THREE.CylinderGeometry(2.1, 2.1, 0.12, 40), K.mat('metal', '#a86a3a'), 0, 15.2, 0, g);
  for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; K.cyl(0.03, 0.03, 0.75, K.mat('metal', '#8a5a3a'), Math.cos(a) * 2.1, 15.2, Math.sin(a) * 2.1, g); }
  const fl = K.add(new THREE.ConeGeometry(0.75, 1.9, 16), K.toon({ color: '#ffd040', plain: true, emissive: '#f0a020' }), 0, 16.6, 0, g); fl.scale.z = 0.7;
  // ladder up the front
  for (const s of [-0.35, 0.35]) K.slab(s - 0.04, s + 0.04, 3, 15.2, 1.18, 1.26, K.mat('wood', '#6a4a30'), g);
  for (let y = 3.3; y < 15; y += 0.35) K.slab(-0.35, 0.35, y, y + 0.05, 1.2, 1.26, K.mat('wood', '#6a4a30'), g);
  D.sign(2.6, 0.7, D.txtTex(512, 140, '#2a3a2a', '#f2e2b0', ['THE ARM OF LIBERTY'], 'bold 54px Georgia'), 0, 1.9, 2.02, 0, g, 'wood');
  return g;
}
function head(parent, x, y, z, s) {
  const { THREE } = K; const g = K.group(parent); g.position.set(x, y, z); g.scale.setScalar(s); const cu = COPPER();
  const h = K.sphere(1, cu, 0, 0, 0, g); h.scale.set(0.85, 1.05, 0.9);
  K.add(new THREE.ConeGeometry(0.18, 0.5, 12), cu, 0, -0.05, 0.9, g).rotation.x = Math.PI / 2;        // nose
  for (const sx of [-0.32, 0.32]) { K.sphere(0.13, K.mat('metal', '#8a4a2a'), sx, 0.22, 0.76, g); }   // eyes
  K.slab(-0.25, 0.25, -0.5, -0.42, 0.7, 0.8, K.mat('metal', '#8a4a2a'), g);                           // lips
  K.add(new THREE.TorusGeometry(0.88, 0.12, 8, 30), cu, 0, 0.62, 0, g).rotation.x = Math.PI / 2;        // crown band
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.42; const r = K.add(new THREE.ConeGeometry(0.12, 1.1, 8), cu, Math.cos(a + Math.PI / 2) * 0.0 + Math.sin((i - 3) * 0.42) * 0.85, 1.05, Math.cos((i - 3) * 0.42) * 0.55, g); r.rotation.set(0.5 * Math.cos((i - 3) * 0.42), 0, -0.6 * Math.sin((i - 3) * 0.42)); }
  for (const sx of [-1, 1]) { const hr = K.sphere(0.5, cu, sx * 0.6, 0.35, -0.3, g); hr.scale.set(0.6, 1, 1); }
  return g;
}
function build(k) {
  K = k; D.init(K); X.init(K); const { THREE } = K; const r = X.rnd(11);
  // ---- the park ----
  K.slab(-160, 160, -0.3, 0, -160, 160, K.mat('grime', '#6aa04a', { amt: 0.55, detail: 2 }), K.scene, false);
  const path = K.mat('plaster', '#d8ccb4', { detail: 0.7 });
  K.slab(-2.2, 2.2, 0, 0.03, -3, 30, path, K.scene, false); K.slab(-40, 40, 0, 0.03, 3.6, 6.4, path, K.scene, false);
  arm(AX, AZ);
  for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, rr = 14 + r() * 10; X.tree(Math.cos(a) * rr, AZ + Math.sin(a) * rr * 0.8, 1.4 + r() * 0.8, K.mat('wood', '#5a3a24'), K.mat('grime', ['#4a8a3a', '#5a9a40', '#3a7a30'][i % 3], { amt: 0.5, bump: 0.05 }), K.scene, r); }
  for (let i = 0; i < 9; i++) { const x = -48 + i * 12, h = 10 + (i % 3) * 3; K.add(new THREE.BoxGeometry(11, h, 8), K.toon({ map: PR.facadeTex(['#a8583a', '#c8b890', '#8a4a3a'][i % 3], 4, 4, 5 + i, '#f4efe4'), kind: 'brick', amt: 0.1 }), x, h / 2, -42); }
  for (const x of [-30, 30]) for (let i = 0; i < 4; i++) K.add(new THREE.BoxGeometry(8, 11, 10), K.toon({ map: PR.facadeTex(['#b85a3a', '#d8c8a8'][i % 2], 3, 4, 20 + i, '#f4efe4'), kind: 'brick', amt: 0.1 }), x, 5.5, -30 + i * 12);
  for (const [x, z] of [[-3.4, 9], [3.4, 4], [-3.4, 14], [3.4, 14], [8, 6.4]]) { K.cyl(0.07, 0.09, 3.4, K.mat('metal', '#2a2a2a'), x, 0, z); K.add(new THREE.BoxGeometry(0.4, 0.5, 0.4), K.toon({ color: '#fff2c0', plain: true, emissive: '#ffe6a0' }), x, 3.6, z); }
  const bench = (x, z, ry) => { const b = K.group(); b.position.set(x, 0, z); b.rotation.y = ry; K.slab(-1, 1, 0.45, 0.52, -0.3, 0.3, K.mat('wood', '#8a5a34'), b); K.slab(-1, 1, 0.52, 1.0, -0.32, -0.26, K.mat('wood', '#8a5a34'), b); for (const sx of [-0.9, 0.9]) K.slab(sx - 0.05, sx + 0.05, 0, 0.45, -0.3, 0.3, K.mat('metal', '#2a2a2a'), b); return b; };
  bench(-4.2, 2.6, 0.5);
  // ticket booth
  const tb = K.group(); tb.position.set(3.6, 0, -1.6); K.slab(-0.8, 0.8, 0, 2.3, -0.6, 0.6, K.mat('wood', '#c84a3a', { detail: 0.6 }), tb); K.slab(-0.95, 0.95, 2.3, 2.5, -0.75, 0.75, K.mat('wood', '#f2e2c0'), tb);
  K.slab(-0.6, 0.6, 1.0, 1.06, 0.6, 0.9, K.mat('wood', '#6a4a30'), tb);
  D.sign(1.6, 0.8, D.txtTex(400, 200, '#f4f0e0', '#c0201a', ['CLIMB THE', 'TORCH! 50¢'], 'bold 64px Georgia'), 0, 1.7, 0.61, 0, tb, 'plaster'); tb.rotation.y = -0.4; K.solid(tb);
  // the advert banner (line 7)
  const ad = K.group(); ad.position.set(-3.9, 0, -3.0); ad.rotation.y = 0.35; for (const sx of [-1.6, 1.6]) K.cyl(0.07, 0.07, 3.6, K.mat('wood', '#5a3a24'), sx, 0, 0, ad);
  D.sign(3.3, 1.5, D.txtTex(640, 290, '#c0201a', '#ffffff', ['SEE THE ARM!', 'HELP BUILD', 'THE STATUE!'], 'bold 70px Arial Black, Arial'), 0, 2.7, 0.05, 0, ad, 'fabric');
  // picnic blanket + basket
  K.slab(-6.2, -4.4, 0.02, 0.04, -1.2, 0.4, K.mat('fabric', '#d84a4a', { detail: 0.25 })); K.slab(-5.0, -4.6, 0.04, 0.4, -0.9, -0.6, K.mat('wood', '#c8a060', { detail: 0.2 }));
  // newsstand + penny jar
  const ns = K.group(); ns.position.set(6.5, 0, 3.2); ns.rotation.y = -0.7; K.slab(-1, 1, 0, 1.0, -0.5, 0.5, K.mat('wood', '#3a5a3a'), ns); K.slab(-1.1, 1.1, 2.2, 2.35, -0.7, 0.7, K.mat('fabric', '#c0392b'), ns);
  for (const sx of [-0.95, 0.95]) K.cyl(0.04, 0.04, 2.2, K.mat('metal', '#2a2a2a'), sx, 0, 0.45, ns);
  for (let i = 0; i < 6; i++) K.slab(-0.9 + i * 0.3, -0.65 + i * 0.3, 1.0, 1.04, -0.4, 0.2, K.toon({ color: '#ece4d0', plain: true }), ns);
  K.solid(ns);
  JAR = K.group(); JAR.position.set(5.0, 0, 5.0); K.slab(-0.5, 0.5, 0, 0.8, -0.4, 0.4, K.mat('wood', '#8a5a34'), JAR);
  K.cyl(0.32, 0.32, 0.8, K.toon({ color: '#cfe8f0', plain: true, transparent: true, opacity: 0.22, roughness: 0.05 }), 0, 0.8, 0, JAR, 20);
  COINS = K.cyl(0.29, 0.29, 0.78, K.toon({ color: '#e8984a', plain: true, roughness: 0.3, metalness: 0.3, emissive: '#6a3a10' }), 0, 0.81, 0, JAR, 20);
  D.sign(0.8, 0.3, D.txtTex(256, 96, '#f4f0e0', '#1a1a1a', ['FOR LIBERTY'], 'bold 38px Georgia'), 0, 0.5, 0.41, 0, JAR, 'plaster');
  PAPER = D.txtTex(400, 300, '#ece4d0', '#1a1a1a', ['THE WORLD', 'GIVE A DOLLAR', 'FOR LIBERTY!'], 'bold 50px Georgia');
  // pigeons + snow
  for (let i = 0; i < 3; i++) PIG.push(K.animal('pigeon', { seed: 30 + i, scale: 1.3 }));
  const sn = K.toon({ color: '#ffffff', plain: true, emissive: '#cccccc' }); for (let i = 0; i < 160; i++) { const s = K.sphere(0.05, sn, 0, -10, 0); s.castShadow = false; SNOW.push(s); }
  // ---- Paris workshop ----
  K.slab(PX - 12, PX + 12, -0.2, 0.02, -12, 12, K.mat('wood', '#7a5a3a', { detail: 0.5 }), K.scene, false);
  const bw = K.mat('brick', '#a86a4a', { detail: 1.2 });
  K.slab(PX - 12, PX + 12, 0, 9, -8.2, -8, bw); K.slab(PX - 12.2, PX - 12, 0, 9, -8, 12, bw); K.slab(PX + 12, PX + 12.2, 0, 9, -8, 12, bw); K.slab(PX - 12, PX + 12, 9, 9.2, -8, 12, K.mat('wood', '#5a3420')); K.slab(PX - 12, PX + 12, 0, 9, 12, 12.2, bw);
  for (const x of [-7, 0, 7]) { K.slab(PX + x - 1.6, PX + x + 1.6, 3, 7.5, -7.99, -7.95, K.toon({ color: '#cfe6f4', plain: true, emissive: '#7a9ab0' })); K.shaft([PX + x, 6.5, -7.9], [PX + x * 0.7, 0, -2], 0.8, 2.2, '#fff0c8', 0.1); }
  D.sign(3, 0.8, D.txtTex(512, 140, '#1a2a5a', '#f2e2b0', ['ATELIER  PARIS'], 'bold 66px Georgia'), PX, 8.2, -7.9, 0, K.scene, 'wood');
  head(K.scene, PX - 1.5, 2.6, -2.5, 2.4);
  K.slab(PX - 3.6, PX + 0.6, 0, 0.3, -4.6, -0.4, K.mat('wood', '#8a6a4a'));
  for (const [x, z] of [[-4, -4.8], [1, -4.8], [-4, -0.2], [1, -0.2]]) K.cyl(0.06, 0.06, 6.5, K.mat('wood', '#c8a878'), PX + x, 0, z);
  for (const y of [2.2, 4.4]) { K.slab(PX - 4.1, PX + 1.1, y, y + 0.08, -4.9, -4.7, K.mat('wood', '#c8a878')); K.slab(PX - 4.1, PX + 1.1, y, y + 0.08, -0.3, -0.1, K.mat('wood', '#c8a878')); }
  // "the body": a bare iron skeleton with a question mark
  BODYQ = K.group(); BODYQ.position.set(PX + 5.5, 0, -3.5); const ir = K.mat('metal', '#4a4a52');
  for (const [a, b] of [[[-1, 0, -1], [-0.4, 7, -0.4]], [[1, 0, -1], [0.4, 7, -0.4]], [[-1, 0, 1], [-0.4, 7, 0.4]], [[1, 0, 1], [0.4, 7, 0.4]]]) K.beam(new THREE.Vector3(...a), new THREE.Vector3(...b), 0.06, ir, BODYQ);
  for (let y = 1; y < 7; y += 1.2) K.slab(-1 + y * 0.085, 1 - y * 0.085, y, y + 0.08, -1 + y * 0.085, 1 - y * 0.085, ir, BODYQ);
  D.sign(1.6, 1.1, D.txtTex(320, 220, '#f4f0e0', '#c0201a', ['BODY:', '???'], 'bold 80px Arial Black, Arial'), 0, 1.8, 1.05, 0, BODYQ, 'plaster');
  K.lamp(PX - 1, 6, 1, { color: '#ffe0a8', intensity: 4.4, distance: 14, glowS: 0.2 }); K.lamp(PX + 5, 4, 0, { color: '#ffe0b8', intensity: 3.6, distance: 9, glowS: 0.2 });
  for (let i = 0; i < 6; i++) PR.crate(K, ['COPPER', 'RIVETS', 'PARIS', 'COPPER', 'NEW YORK', 'TOOLS'][i], '#8a5a34', K.scene).position.set(PX - 9 + (i % 3) * 1.1, 0.3 + Math.floor(i / 3) * 0.6, 4 + (i % 2) * 0.2);
  K.dust([PX, 3, -2], [8, 4, 6], 100);
  // ---- harbor island ----
  K.slab(IX - 400, IX + 400, -0.6, -0.4, -400, 400, K.mat('grime', '#3a7ab8', { amt: 0.3, roughness: 0.15 }), K.scene, false);
  K.slab(IX - 14, IX + 14, -0.6, 0.1, -14, 14, K.mat('rock', '#a89a88', { detail: 1.5 }), K.scene, false);
  K.slab(IX - 12, IX + 12, 0.1, 0.15, -12, 12, K.mat('grime', '#6a9a4a', { amt: 0.5 }), K.scene, false);
  const stone = K.mat('brick', '#d8ccb4', { detail: 1.4 });
  const ped = K.group(); ped.position.set(IX, 0, -4); ped.name = 'pedestal';
  K.slab(-4.5, 4.5, 0, 3.5, -4.5, 4.5, stone, ped);                       // unfinished base
  const PEDTOP = K.group(ped); K.slab(-3.4, 3.4, 3.5, 11, -3.4, 3.4, stone, PEDTOP); K.slab(-3.8, 3.8, 11, 11.6, -3.8, 3.8, stone, PEDTOP);
  ped.userData.top = PEDTOP;
  const SC = K.group(ped); for (const sx of [-4.8, 4.8]) for (const sz of [-4.8, 4.8]) K.cyl(0.06, 0.06, 6, K.mat('wood', '#c8a878'), sx, 0, sz, SC); for (const y of [2, 4]) for (const sz of [-4.8, 4.8]) K.slab(-4.9, 4.9, y, y + 0.08, sz - 0.1, sz + 0.1, K.mat('wood', '#c8a878'), SC);
  ped.userData.sc = SC;
  const fs = D.sign(2.6, 1.3, D.txtTex(400, 200, '#f4f0e0', '#c0201a', ['PEDESTAL', 'FUND: $0'], 'bold 66px Arial Black, Arial'), IX + 1.5, 1.4, 1.2, -0.2, K.scene, 'plaster'); ped.userData.fs = fs;
  for (const sx of [0.2, 2.8]) K.cyl(0.05, 0.05, 1.4, K.mat('wood', '#5a3a24'), IX + sx, 0.1, 1.15);
  // the finished statue (shown at the end)
  const ST = K.group(); ST.position.set(IX, 11.6, -4); const cu = COPPER();
  K.add(new THREE.CylinderGeometry(1.5, 2.8, 9, 24), cu, 0, 4.5, 0, ST);
  for (let i = 0; i < 8; i++) { const fo = K.add(new THREE.CylinderGeometry(0.12, 0.3, 8.6, 6), cu, Math.cos(i * 0.8) * 2.0, 4.3, Math.sin(i * 0.8) * 2.0 + 0.3, ST); fo.rotation.z = 0.1 * Math.cos(i); }
  head(ST, 0, 10.2, 0.1, 1.2);
  const ua = K.beam(new THREE.Vector3(1.2, 8.2, 0), new THREE.Vector3(2.0, 13.6, 0.3), 0.42, cu, ST); K.sphere(0.5, cu, 2.05, 13.7, 0.3, ST);
  K.add(new THREE.CylinderGeometry(0.75, 0.3, 0.7, 16), cu, 2.1, 14.6, 0.3, ST); K.add(new THREE.ConeGeometry(0.4, 1.0, 12), K.toon({ color: '#ffd040', plain: true, emissive: '#f0a020' }), 2.1, 15.4, 0.3, ST);
  K.slab(-2.2, -0.9, 6, 8.2, 0.9, 1.3, cu, ST);   // tablet
  ped.userData.st = ST;
  globalThis.__PED = ped;
  for (let i = 0; i < 5; i++) { const g = K.group(); for (let j = 0; j < 16; j++) { const s = K.sphere(0.18, K.toon({ color: ['#ff5a5a', '#ffe060', '#7ad0ff', '#ff8af0', '#a0ff80'][i], plain: true, emissive: ['#ff3a3a', '#ffd040', '#4ab0ff', '#ff5ad0', '#60ff40'][i] }), 0, 0, 0, g); s.castShadow = false; s.userData.d = [Math.cos(j * 0.39) * Math.cos(j * 1.7), Math.sin(j * 0.39 * 2) * 0.8 + 0.2, Math.sin(j * 1.7)]; } FW.push(g); g.visible = false; }
  for (let i = 0; i < 3; i++) { const b = K.group(); b.position.set(IX + 22 + i * 9, -0.4, 10 - i * 7); K.slab(-2.5, 2.5, 0, 0.9, -1, 1, K.mat('wood', ['#c0392b', '#2a4a7a', '#f2ece0'][i]), b); K.cyl(0.08, 0.08, 4.5, K.mat('wood', '#5a3a24'), 0, 0.9, 0, b); K.add(new THREE.PlaneGeometry(1.8, 2.2), K.toon({ color: '#f4f0e0', plain: true, side: THREE.DoubleSide }), 0.95, 3.4, 0, b); }
  // cast
  SHOW = K.stick(SHOW_O, { key: 'show' }); T1 = K.stick(T1_O, { key: 't1' }); T2 = K.stick(T2_O, { key: 't2' }); MOCK = K.stick(MOCK_O, { key: 'mock' });
  KID1 = K.stick(KID1_O, { key: 'kid1' }); KID2 = K.stick(KID2_O, { key: 'kid2' }); NEWS = K.stick(NEWS_O, { key: 'news' }); RICH = K.stick(RICH_O, { key: 'rich' });
  WK1 = K.stick(WK1_O, { key: 'wk1' }); WK2 = K.stick(WK2_O, { key: 'wk2' });
  K.addClouds(12, 700, 170);
  K.scene.traverse((o) => { if (o.isPointLight) PL.push(o); });
}
const hide = (...rs) => rs.forEach((x) => { x.root.visible = false; });
function frame(f) {
  const fx = []; const PED = globalThis.__PED;
  const PARIS0 = L[3][0] - 4, MOCK0 = L[4][0] - 4, SIX0 = L[5][0] - 4, PIC0 = L[6][0] - 4, AD0 = L[7][0] - 4, ISL0 = L[9][0] - 4, NO0 = L[10][0] - 4, KIDS0 = L[11][0] - 4, END0 = L[12][0] - 4;
  const ADV = W(7, 'advertisement'), BEG = W(10, 'begged');
  const inPark = f < PARIS0 || (f >= MOCK0 && f < ISL0) || (f >= NO0 && f < END0);
  // ---- climbers on the ladder / balcony ----
  if (f < PARIS0 || f >= SIX0 && f < AD0) {
    const up = f < L[1][0] ? 0.4 : clamp((f - L[1][0]) / 80, 0, 1);
    D.act(K, T2, f, [[0, 'reach', { expr: 'excited', R: [0.35, -0.8, 'open'], L: [0.3, -0.5, 'open'] }], [W(1, 'torch') - 4, 'reach', { expr: 'grin', R: [0.3, -0.85, 'open'], L: [0.35, -0.5, 'open'] }], [L[2][0], 'wave', { expr: 'grin' }]], 4,
      f < L[2][0] - 4 ? { x: AX, y: lerp(4.5, 11, up) + 0.05 * Math.sin(f * 0.5), z: AZ + 1.45, yaw: Math.PI } : { x: AX + 1.4, y: 15.25, z: AZ + 1.3, yaw: 0.6 });
    D.act(K, T1, f, [[0, 'wave', { expr: 'laugh' }], [W(1, 'torch'), 'pointUp', { expr: 'excited' }], [L[2][0], 'cheer', { expr: 'laugh' }]], 5, { x: AX - 1.2, y: 15.25, z: AZ + 1.45, yaw: -0.4 });
  } else hide(T1, T2);
  // ---- the showman (most at stake: sweats) ----
  if (f < PARIS0 || (f >= AD0 && f < ISL0)) D.act(K, SHOW, f, [[0, 'show', { expr: 'grin', R: [0.45, -0.55, 'money'] }], [W(0, 'park') - 4, 'hold', { expr: 'grin', R: [0.3, 0.4, 'moneybag'] }],
      [L[2][0] - 2, 'hold', { expr: 'nervous', R: [0.25, 0.42, 'money'] }], [W(2, 'nobody') - 2, 'think', { expr: 'nervous', sweat: true }], [W(2, 'ocean') - 3, 'shrug', { expr: 'scared' }],
      [AD0, 'shrug', { expr: 'nervous', sweat: true }], [ADV - 4, 'pointL', { expr: 'grin', sweat: true }], [ADV + 16, 'cheer', { expr: 'laugh' }], [L[8][0] - 2, 'show', { expr: 'grin', R: [0.45, -0.6, 'money'] }], [W(8, 'piece'), 'hold', { expr: 'proud', R: [0.3, 0.4, 'moneybag'] }]], 3,
    f < PARIS0 ? { x: 3.5, z: -0.5, yaw: 0.2 } : { x: -1.8, z: -1.4, yaw: 0.3 });
  else hide(SHOW);
  // ---- Paris workers ----
  if (f >= PARIS0 && f < MOCK0) {
    D.act(K, WK1, f, [[0, 'hammer', { expr: 'stern' }], [W(3, 'body') - 4, 'shrug', { expr: 'confused' }]], 6, { x: PX + 0.2, y: 2.28, z: -1.0, yaw: -1.2 });
    D.act(K, WK2, f, [[0, 'pointUp', { expr: 'proud' }], [W(3, 'body') - 2, 'facepalm', { expr: 'pained' }]], 7, { x: PX + 3.6, z: -0.6, yaw: 0.6 });
  } else hide(WK1, WK2);
  // ---- the mocker on the bench ----
  if (f >= MOCK0 && f < SIX0) D.act(K, MOCK, f, [[0, 'read', { expr: 'neutral', item: 'paper' }], [W(4, 'laughed') - 4, 'laugh', { expr: 'laugh' }], [W(4, 'joked'), 'show', { expr: 'laugh', R: [0.45, -0.6, 'paper'] }], [W(4, 'beats'), 'pointUp', { expr: 'laugh' }]], 8,
    { x: -4.2, z: 2.6, yaw: 0.5, seat: 0.5 });
  else hide(MOCK);
  if (f >= NO0 && f < W(10, 'until') - 2) D.act(K, RICH, f, [[0, 'cross', { expr: 'stern' }], [W(10, 'nobody') + 6, 'stop', { expr: 'angry' }]], 9, { x: 1.4, z: 6.0, yaw: 0.1 });
  if (!(f >= NO0 && f < W(10, 'until') - 2)) hide(RICH);
  // ---- kids: picnic, then pennies ----
  if (f >= PIC0 && f < AD0) {
    D.act(K, KID1, f, [[0, 'eat', { expr: 'grin' }], [W(6, 'pigeons') - 4, 'pointUp', { expr: 'excited' }]], 10, { x: -5.6, z: -0.6, yaw: 0.5, seat: 0.05 });
    D.act(K, KID2, f, [[0, 'laugh', { expr: 'laugh' }], [W(6, 'pigeons'), 'wave', { expr: 'laugh' }]], 11, { x: -4.8, z: 0.1, yaw: -0.3 });
  } else if (f >= KIDS0 && f < END0) {
    D.act(K, KID1, f, [[0, 'reach', { expr: 'excited', R: [0.5, -0.3, 'money'] }], [W(11, 'pennies'), 'cheer', { expr: 'laugh' }], [W(11, 'hundred'), 'celebrate', { expr: 'laugh' }]], 10, { x: 4.4, z: 5.8, yaw: 2.4 });
    D.act(K, KID2, f, [[0, 'hold', { expr: 'grin', R: [0.3, 0.4, 'money'] }], [W(11, 'pennies') + 6, 'reach', { expr: 'excited', R: [0.5, -0.3, 'money'] }], [W(11, 'chipped'), 'clap', { expr: 'laugh' }]], 11, { x: 5.7, z: 5.9, yaw: -2.4 });
  } else hide(KID1, KID2);
  // ---- newsboy ----
  if (f >= W(10, 'until') - 4 && f < END0) D.act(K, NEWS, f, [[0, 'show', { expr: 'yell', talk: true, R: [0.45, -0.7, 'paper'] }], [BEG + 10, 'wave', { expr: 'excited', talk: true }], [KIDS0, 'cheer', { expr: 'laugh' }]], 12, { x: 6.2, z: 4.4, yaw: -0.4 });
  else hide(NEWS);
  // ---- pigeons ----
  PIG.forEach((p, i) => { const onT = f >= PIC0; p.set(f, { x: AX - 0.9 + i * 0.9, y: onT ? 15.95 : 15.25, z: AZ + 1.9 - Math.abs(i - 1) * 0.3, yaw: 0.2 * i, mode: f >= W(6, 'pigeons') && f < W(6, 'pigeons') + 20 ? 'jump' : i === 1 ? 'eat' : 'stand', expr: 'happy', flap: f >= W(6, 'pigeons') && f < W(6, 'pigeons') + 24 }); if (onT) p.root.position.y = 15.95; });
  // ---- snow during the six years ----
  const snowOn = f >= SIX0 && f < PIC0; SNOW.forEach((s, i) => { if (!snowOn) { s.visible = false; return; } s.visible = true; const x = ((i * 7.31) % 16) - 8, z = AZ + 8 - ((i * 3.17) % 14), y = 14 - ((f * 0.06 + i * 0.37) % 14); s.position.set(AX + x + 0.3 * Math.sin(f / 20 + i), y, z); });
  // ---- penny jar fills ----
  const fill = sm(KIDS0, END0, f); COINS.scale.y = 0.05 + 0.95 * fill; COINS.position.y = 0.81 + 0.0; COINS.visible = f >= KIDS0;
  if (f >= KIDS0 && f < END0 && f % 5 === 0) K.puff(f, f, 5.0, 5.0, 3, 0.15, '#e8b860');
  // ---- island: unfinished, then the statue arrives ----
  const done = f >= END0; PED.userData.top.visible = done; PED.userData.st.visible = done; PED.userData.sc.visible = !done; PED.userData.fs.visible = !done;
  if (f >= ISL0 && f < NO0) { D.act(K, WK1, f, [[0, 'sit', { expr: 'sleepy' }], [W(9, 'pay') - 4, 'shrug', { expr: 'pained' }]], 6, { x: IX - 1.2, y: 0.15, z: 1.6, yaw: 0.3, seat: 0.0 }); D.act(K, WK2, f, [[0, 'cross', { expr: 'stern' }], [W(9, 'pedestal'), 'pointL', { expr: 'angry' }]], 7, { x: IX + 3.4, y: 0.15, z: 1.8, yaw: -0.5 }); }
  FW.forEach((g, i) => { const t0 = END0 + 8 + i * 16, t = (f - t0) / 26; if (!done || t < 0 || t > 1) { g.visible = false; return; } g.visible = true; g.position.set(IX - 9 + i * 4.5, 18 + (i % 2) * 5, -12);
    g.children.forEach((s) => { const d = s.userData.d; s.position.set(d[0] * 4 * Math.sqrt(t), d[1] * 4 * Math.sqrt(t) - 2 * t * t, d[2] * 2 * Math.sqrt(t)); s.scale.setScalar(1 - t * 0.8); }); });
  // ---------- shots ----------
  const S = [
    // L0 the arm alone, people climbing it (low angle push-up), then the showman selling tickets
    [0, (u) => ({ pos: [AX + 3.2, 1.3, AZ + 9.5 - 1.2 * u], look: [AX, lerp(7.5, 9.5, u), AZ], fov: 50, cinf: 5 })],
    [W(0, 'park') - 4, (u) => ({ pos: [lerp(5.4, 5.0, u), 1.6, 1.9], look: [3.5, 1.4, -0.5], fov: 38, cinf: 12 })],
    // L1 climbing the ladder (tracking up), the balcony at the torch
    [L[1][0] - 4, (u) => { const y = lerp(4.5, 11, clamp((f - L[1][0]) / 80, 0, 1)); return { pos: [AX + 2.2, y + 0.6, AZ + 4.2], look: [AX, y + 1.1, AZ + 1.4], fov: 42, cinf: 10 }; }, { whip: true }],
    [W(1, 'torch') - 4, (u) => ({ pos: [AX + 3.6, 17.2, AZ + 6.0], look: [AX, 15.8, AZ], fov: 44 * K.push(u, 0.1), cinf: 8, noPush: true })],
    // L2 the showman sweating over a few coins
    [L[2][0] - 4, (u) => ({ pos: [4.4, 1.75, 1.2], look: [3.5, 1.6, -0.5], fov: 34, cinf: 14 }), { whip: true }],
    [W(2, 'ocean') - 6, (u) => ({ pos: [AX - 2 + 2 * u, 3.5, 22], look: [AX, 8, AZ], fov: 46, cinf: 4 })],
    // L3 Paris: the giant head, then the bare body skeleton
    [PARIS0, (u) => ({ pos: [PX + lerp(2.4, 1.6, u), 2.8, 5.5], look: [PX - 1.2, 2.6, -2.5], fov: 44, cinf: 8, light: IN }), { whip: true }],
    [W(3, 'body') - 4, (u) => ({ pos: [PX + 4.2, 2.4, 4.4], look: [PX + 5.2, 2.6, -3.5], fov: 44 * K.punch(f, W(3, 'exist'), 0.12, 6), cinf: 10, light: IN, noPush: true })],
    // L4 the mocker laughing, then the newspaper joke
    [MOCK0, (u) => ({ pos: [-2.6, 1.5, 4.8], look: [-4.2, 1.3, 2.6], fov: 38, cinf: 14 }), { whip: true }],
    [W(4, 'joked') - 4, (u) => ({ pos: [-3.3, 1.5, 4.4], look: [-4.1, 1.45, 2.7], fov: 38, cinf: 16 })],
    // L5 six years: snow over the lonely arm
    [SIX0, (u) => ({ pos: [AX - 6 + 3 * u, 2.2, AZ + 16], look: [AX, 7, AZ], fov: 46, cinf: 5 }), { whip: true }],
    [W(5, 'alone') - 6, (u) => ({ pos: [AX - 1.6, 1.2, AZ + 4.2], look: [AX + 0.4, 3.6, AZ], fov: 44 * K.push(u, 0.12), cinf: 8, noPush: true })],
    // L6 picnic, pigeons in the torch
    [PIC0, (u) => ({ pos: [-3.6, 1.1, 2.6], look: [-5.2, 0.8, -0.4], fov: 40, cinf: 12 }), { whip: true }],
    [W(6, 'pigeons') - 4, (u) => ({ pos: [AX + 1.2, 16.6, AZ + 4.2], look: [AX, 16.1, AZ + 1.6], fov: 40, cinf: 14 })],
    // L7 why? [beat] the advert banner (punch-in)
    [AD0, (u) => ({ pos: [-0.6, 1.7, 1.4], look: [-1.8, 1.6, -1.4], fov: 36, cinf: 14 }), { whip: true }],
    [ADV - 4, (u) => ({ pos: [-2.4, 2.4, 3.2], look: [-3.9, 2.4, -3.0], fov: 42 * K.punch(f, ADV, 0.2, 6), cinf: 10, noPush: true })],
    // L8 every ticket = another piece
    [L[8][0] - 4, (u) => ({ pos: [lerp(-0.3, 0.3, u), 1.5, 1.2], look: [-1.8, 1.4, -1.4], fov: 38, cinf: 14 })],
    // L9 the island: the unfinished pedestal
    [ISL0, (u) => ({ pos: [IX + 1.6 - 0.8 * u, 2.6, 13], look: [IX + 1.0, 2.3, -1], fov: 46, cinf: 5, light: GOLD }), { whip: true }],
    [W(9, 'pedestal') - 8, (u) => ({ pos: [IX + 1.5, 1.6, 4.4], look: [IX + 1.4, 1.4, 1.2], fov: 40, cinf: 14, light: GOLD })],
    // L10 nobody wanted to (rich man), the newsboy begs
    [NO0, (u) => ({ pos: [1.6, 1.85, 8.8], look: [1.4, 1.6, 6.0], fov: 36, cinf: 14 }), { whip: true }],
    [W(10, 'until') - 4, (u) => ({ pos: [5.6, 1.7, 7.2], look: [6.2, 1.6, 4.4], fov: 38, cinf: 12 })],
    [BEG - 2, (u) => ({ pos: [6.3, 2.15, 5.3], look: [6.3, 2.05, 4.4], fov: 40 * K.push(u, 0.12), cinf: 18, noPush: true })],
    // L11 kids + pennies, the jar fills
    [KIDS0, (u) => ({ pos: [5.0, 1.3, 8.0], look: [5.0, 1.0, 5.2], fov: 40, cinf: 12 }), { whip: true }],
    [W(11, 'hundred') - 4, (u) => ({ pos: [5.0, 1.7, 7.6], look: [5.0, 1.2, 5.0], fov: 40 * K.punch(f, W(11, 'hundred'), 0.15, 6), cinf: 16, noPush: true })],
    // L12 payoff: the whole statue on the island, fireworks; then the torch (loops into the lonely arm)
    [END0, (u) => ({ pos: [IX + 16 - 4 * u, 5, 26], look: [IX, 14, -4], fov: 50, cinf: 4, light: GOLD }), { whip: true }],
    [W(12, 'rest') - 4, (u) => ({ pos: [IX + 7, 25, 6], look: [IX + 1.5, 24, -3.7], fov: 42 * K.push(u, 0.15), cinf: 8, light: GOLD, noPush: true })],
  ];
  const R = D.runShots(S, f, TOTAL), cam = R.cam;
  PL.forEach((l) => { l.visible = R.light === IN; });
  if (R.id === 21) { const t = K.T; const fxp = X.inFront(cam, 1.2, 0, 0); } // newspaper insert uses the prop below
  if (R.id === 0) D.card(fx, f, W(0, 'arm'), 'JUST AN ARM', cam, '#ffffff', 150, 50, 0.62);
  if (R.id === 10) D.card(fx, f, W(5, 'six'), '6 YEARS', cam, '#ffffff', 170, 50, 0.6);
  if (R.id === 23) D.card(fx, f, W(11, 'hundred'), '100,000+', cam, '#f6c83a', 170, 45, 0.6);
  if (R.id === 9) D.card(fx, f, W(4, 'piece'), 'BETTER THAN NOTHING?', cam, '#ffffff', 120, 50, 0.6);
  // the newspaper the newsboy waves (insert)
  if (R.id === 21 || R.id === 20) { if (!globalThis.__NP) { const m = K.add(new K.THREE.PlaneGeometry(0.8, 0.6), K.toon({ map: PAPER, plain: true, side: K.THREE.DoubleSide }), 0, 0, 0); m.castShadow = false; globalThis.__NP = m; }
    globalThis.__NP.visible = true; globalThis.__NP.position.set(6.3, 2.05, 4.55); globalThis.__NP.rotation.set(0, 0.05 * Math.sin(f / 5), 0.06 * Math.sin(f / 4)); }
  else if (globalThis.__NP) globalThis.__NP.visible = false;
  return { light: R.light || DAY, cam, dof: R.dof, actors: [], fx };
}
export default { TOTAL, look: 'rich', build, frame };
