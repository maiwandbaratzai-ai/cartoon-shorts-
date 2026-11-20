// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "How did a little dog named Pickles save the World Cup?" (true story: London, March 1966. The stolen World Cup trophy
// was found wrapped in newspaper under a hedge by a collie called Pickles on a walk; his owner was questioned by police;
// Pickles got a medal, a film role and a year of dog food, and was at England's victory party in July.)
// Sets: a 1960s South London street with hedges (spring day), a police office, a banquet hall with a stage.
import { TOTAL, LINES, wf } from './pickles_timing.js';
import * as PR from '../props.js';
import * as D from './d19.js';
import * as X from './kit3d.js';
const { clamp, lerp, sm } = D;
export { TOTAL };
const L = LINES, W = wf;
let K, PICK, LEASH = [], BUNDLE, CUP, MEDAL, FLASH, CAMBOX, CANS, CONF = [];
let DAVE, NEI, DET, BOB, PHO, PL1, PL2, PL3;
const DAVE_O = { jacket: '#5a6a8a', pants: '#3a3a40', boots: '#2a1a12', hat: 'cap', cap: '#7a6a5a', scarf: '#c0392b', pockets: true, collar: '#ffffff' };
const NEI_O = { jacket: '#c86a9a', dress: '#c86a9a', hairStyle: 'curly', hair: '#e8d8a0', apron: '#f4efe4', scarf: '#5aa0d0' };
const DET_O = { jacket: '#c8b890', pants: '#4a4a52', boots: '#1e1a18', hat: 'cowboy', hatColor: '#4a4a52', tie: '#7a1a2a', moustache: '#3a2a1a', belt: '#2a1a12' };
const BOB_O = { jacket: '#1a2440', pants: '#1a2440', boots: '#111', hat: 'police', hatColor: '#1a2440', badge: true, belt: '#111', gloves: '#ffffff' };
const PHO_O = { jacket: '#7a5a3a', pants: '#3a3a30', boots: '#2a1a12', hat: 'beanie', hatColor: '#2a6a4a', vest: '#c8a060', glasses: '#333', pockets: true };
const PL = (hair, h) => ({ jacket: '#c8202a', pants: '#f4f4f4', boots: '#111', collar: '#ffffff', hairStyle: hair, hair: h, belt: '#f4f4f4', scarf: '#ffffff' });
const DAY = { az: 40, el: 38, sky: '#d8e8f4', ground: '#9a9a90', hemi: 1.05, sun: '#fff0d8', sunI: 3.1, skyTop: '#4f88d8', skyHor: '#e8eef2', fog: '#dde6ee', fogNear: 40, fogFar: 200,
  sat: 1.15, vig: 0.24, shadowExt: 14, exposure: 1.12, ink: 0.55, bloom: 0.6 };
const IN = { az: 80, el: 60, sky: '#2a1a12', ground: '#2a1a12', hemi: 0.95, sun: '#ffd8a8', sunI: 0.0, skyTop: '#1a120c', skyHor: '#1a120c', fog: '#1a120c', fogNear: 14, fogFar: 50,
  sat: 1.12, vig: 0.3, shadowExt: 14, exposure: 1.6, bloom: 0.6, ink: 0.55, cardTint: '#fff0e0' };
const PL_ = 0;
const BX = 0, BZ = 5.35, SW = 4.0;   // the bundle under the hedge; sidewalk line
const PO = 200, BQ = 240;
const PARTYL = { ...IN, exposure: 1.95, hemi: 1.25 };            // police office, banquet hall origins

function trophy() {
  const { THREE } = K; const g = K.group(); const gold = K.toon({ color: '#f2c230', plain: true, roughness: 0.2, metalness: 0.6, emissive: '#5a3a00' });
  K.cyl(0.11, 0.13, 0.1, K.toon({ color: '#2a4aa0', plain: true, roughness: 0.3 }), 0, 0, 0, g, 8);
  K.cyl(0.04, 0.07, 0.12, gold, 0, 0.1, 0, g); K.sphere(0.06, gold, 0, 0.27, 0, g, 1, 1.4, 0.8);
  for (const s of [-1, 1]) { const w = K.sphere(0.05, gold, s * 0.06, 0.33, -0.01, g, 0.5, 1.6, 0.4); w.rotation.z = -s * 0.5; }
  K.cyl(0.09, 0.04, 0.1, gold, 0, 0.36, 0, g); return g;
}
function build(k) {
  K = k; D.init(K); X.init(K); const { THREE } = K;
  // ---- street ----
  K.slab(-80, 80, -0.3, 0, -80, 80, K.mat('grime', '#5a5a5e', { amt: 0.3, detail: 2 }), K.scene, false);              // asphalt
  K.slab(-60, 60, 0, 0.12, 2.6, 5.4, K.mat('plaster', '#c8c4b8', { detail: 0.6 }), K.scene, false);                    // pavement
  K.slab(-60, 60, 0, 0.14, 2.5, 2.7, K.mat('rock', '#a8a49a'), K.scene, false);
  for (let x = -60; x < 60; x += 0.9) K.slab(x - 0.01, x + 0.01, 0.12, 0.125, 2.7, 5.4, K.toon({ color: '#9a968c', plain: true }), K.scene, false);
  K.slab(-60, 60, 0, 0.05, 5.4, 14, K.mat('grime', '#6aa04a', { amt: 0.5 }), K.scene, false);                           // front gardens
  const hedge = K.mat('grime', '#3a7a34', { amt: 0.6, detail: 0.5, bump: 0.03 });
  for (let x = -40; x < 40; x += 8) { const h = K.slab(x + 0.6, x + 7.4, 0, 1.3, 5.5, 6.3, hedge); h.name = 'hedge'; K.solid(h); }
  for (let x = -40; x < 40; x += 8) { K.add(new THREE.BoxGeometry(7.4, 7, 6), K.toon({ map: PR.facadeTex(['#b85a3a', '#c8b890', '#a8483a', '#e0d8c8'][(x / 8 + 5) % 4], 3, 3, 3 + x, '#f4efe4'), kind: 'brick', amt: 0.1 }), x + 4, 3.5, 17);
    K.add(new THREE.ConeGeometry(5.4, 2.4, 4), K.mat('metal', '#5a4a4a'), x + 4, 8.2, 17).rotation.y = Math.PI / 4; K.slab(x + 3.4, x + 4.6, 0, 2.2, 13.95, 14.0, K.mat('wood', ['#2a4a8a', '#c0392b', '#2a6a3a'][(x / 8 + 5) % 3])); }
  for (let x = -40; x < 40; x += 20) { const h = K.add(new THREE.BoxGeometry(14, 8, 6), K.toon({ map: PR.facadeTex('#c8b890', 4, 3, 9 + x, '#ffffff'), kind: 'brick', amt: 0.1 }), x, 4, -12); }
  for (const x of [-16, -4, 8, 20]) { K.cyl(0.07, 0.09, 4.2, K.mat('metal', '#2a2a2a'), x, 0.1, 3.0); K.add(new THREE.BoxGeometry(0.35, 0.3, 0.6), K.toon({ color: '#fff2c0', plain: true, emissive: '#ffe6a0' }), x, 4.3, 2.75); }
  for (let i = 0; i < 4; i++) { const car = PR.sedan(K, ['#8a2a2a', '#2a5a8a', '#e8e0c8', '#3a6a3a'][i]); car.root.position.set(-22 + i * 13, 0, 1.4); car.root.scale.setScalar(0.8); }
  // phone box + news board + poster
  const pb = K.group(); pb.position.set(-6, 0.12, 4.9); K.slab(-0.5, 0.5, 0, 2.5, -0.5, 0.5, K.mat('metal', '#c0201a'), pb); K.slab(-0.42, 0.42, 0.5, 2.1, 0.5, 0.52, K.toon({ color: '#cfe8f0', plain: true }), pb);
  D.sign(0.8, 0.2, D.txtTex(256, 64, '#c0201a', '#ffffff', ['TELEPHONE'], 'bold 40px Arial'), 0, 2.3, 0.53, 0, pb); K.solid(pb);
  const nb = K.group(); nb.position.set(5, 0.12, 4.8); nb.rotation.y = Math.PI; K.slab(-0.45, 0.45, 0, 1.3, -0.1, 0.1, K.mat('wood', '#3a2a1a'), nb);
  D.sign(0.8, 1.05, D.txtTex(320, 420, '#f4f0e0', '#1a1a1a', ['CUP', 'STOLEN!', 'POLICE', 'BAFFLED'], 'bold 66px Arial Black, Arial'), 0, 0.75, 0.11, 0, nb, 'plaster'); K.solid(nb);
  D.sign(1.6, 2.2, PR.canvasTex(320, 440, (g, w, h) => { g.fillStyle = '#f2e6c0'; g.fillRect(0, 0, w, h); g.fillStyle = '#c0201a'; g.fillRect(0, 0, w, 120); g.fillStyle = '#ffffff'; g.font = 'bold 54px Arial Black, Arial'; g.textAlign = 'center'; g.fillText('FOOTBALL', w / 2, 60); g.fillText('JULY 1966', w / 2, 110);
    g.fillStyle = '#1a3a8a'; g.beginPath(); g.arc(w / 2, 260, 90, 0, 7); g.fill(); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(w / 2, 260, 60, 0, 7); g.fill(); g.fillStyle = '#1a1a1a'; g.font = 'bold 44px Arial'; g.fillText('ENGLAND', w / 2, 400); }), 11.0, 1.8, 13.9, Math.PI, K.scene, 'plaster');
  // police station on the corner
  K.add(new THREE.BoxGeometry(8, 7, 6), K.toon({ map: PR.facadeTex('#8a3a2a', 3, 3, 21, '#e8dcc4'), kind: 'brick', amt: 0.1 }), 20, 3.5, 9);
  D.sign(2.6, 0.6, D.txtTex(512, 120, '#1a2a6a', '#ffffff', ['POLICE'], 'bold 90px Arial Black, Arial'), 20, 3.0, 5.95, 0, K.scene); K.add(new THREE.BoxGeometry(0.4, 0.5, 0.4), K.toon({ color: '#5a8aff', plain: true, emissive: '#2a4aff' }), 20, 4.2, 5.8);
  // the bundle (newspaper tied with string) + the trophy
  BUNDLE = K.group(); BUNDLE.position.set(BX, 0.12, BZ);
  const np = PR.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#ece4d0'; g.fillRect(0, 0, w, h); g.fillStyle = '#3a3a3a'; for (let i = 0; i < 18; i++) g.fillRect(12 + (i % 2) * 120, 12 + Math.floor(i / 2) * 26, 100, 8); g.font = 'bold 36px Georgia'; g.fillText('NEWS', 80, 240); });
  K.add(new THREE.BoxGeometry(0.34, 0.42, 0.3), K.toon({ map: np, kind: 'fabric', amt: 0.2 }), 0, 0.21, 0, BUNDLE);
  for (const r of [0, Math.PI / 2]) { const t = K.add(new THREE.TorusGeometry(0.2, 0.008, 6, 24), K.toon({ color: '#c8a868', plain: true }), 0, 0.21, 0, BUNDLE); t.rotation.y = r; }
  CUP = trophy(); CUP.scale.setScalar(1.4);
  // ---- police office ----
  K.slab(PO - 8, PO + 8, -0.2, 0, -8, 8, K.mat('wood', '#6a4a30', { detail: 0.5 }), K.scene, false);
  const pw = K.mat('plaster', '#a8b8a0');
  K.slab(PO - 8, PO + 8, 0, 4.5, -6.2, -6, pw); K.slab(PO - 8.2, PO - 8, 0, 4.5, -6, 8, pw); K.slab(PO + 8, PO + 8.2, 0, 4.5, -6, 8, pw); K.slab(PO - 8, PO + 8, 4.5, 4.7, -6, 8, K.mat('plaster', '#d8d0c0')); K.slab(PO - 8, PO + 8, 0, 4.5, 8, 8.2, pw);
  const desk = K.group(); desk.position.set(PO, 0, -1.5); K.slab(-1.2, 1.2, 0.75, 0.82, -0.6, 0.6, K.mat('wood', '#5a3420'), desk); for (const [x, z] of [[-1.1, -0.5], [1.1, -0.5], [-1.1, 0.5], [1.1, 0.5]]) K.slab(x - 0.04, x + 0.04, 0, 0.75, z - 0.04, z + 0.04, K.mat('wood', '#4a2a18'), desk);
  K.solid(desk); K.add(new THREE.BoxGeometry(0.3, 0.05, 0.4), K.toon({ map: np, plain: true }), PO + 0.6, 0.85, -1.6);
  K.cyl(0.02, 0.02, 1.4, K.mat('metal', '#333'), PO, 2.95, -1.5); K.add(new THREE.ConeGeometry(0.35, 0.3, 16, 1, true), K.toon({ color: '#2a5a3a', plain: true, side: THREE.DoubleSide }), PO, 2.85, -1.5);
  K.lamp(PO, 2.6, -1.5, { color: '#ffe0a8', intensity: 4.0, distance: 9 }); K.shaft([PO, 2.75, -1.5], [PO, 0.8, -1.5], 0.3, 1.2, '#ffe0b0', 0.12);
  for (let i = 0; i < 3; i++) K.slab(PO - 7.5 + i * 0.9, PO - 6.7 + i * 0.9, 0, 1.5, -5.9, -5.3, K.mat('metal', '#6a7a6a'));
  D.sign(1.6, 1.0, D.txtTex(320, 200, '#f4f0e0', '#1a1a1a', ['WANTED:', 'THE CUP'], 'bold 52px Arial Black, Arial'), PO + 3.5, 2.2, -5.95, 0, K.scene, 'plaster');
  K.cyl(0.3, 0.3, 0.05, K.toon({ color: '#ffffff', plain: true }), PO - 3, 3.0, -5.95).rotation.x = Math.PI / 2;
  K.dust([PO, 1.8, -1.5], [3, 2, 3], 80);
  // ---- banquet hall + stage ----
  K.slab(BQ - 10, BQ + 10, -0.2, 0, -10, 10, K.mat('wood', '#8a5a34', { detail: 0.5 }), K.scene, false);
  const bw = K.mat('plaster', '#e8d8b8');
  K.slab(BQ - 10, BQ + 10, 0, 6, -8.2, -8, bw); K.slab(BQ - 10.2, BQ - 10, 0, 6, -8, 10, bw); K.slab(BQ + 10, BQ + 10.2, 0, 6, -8, 10, bw); K.slab(BQ - 10, BQ + 10, 6, 6.2, -8, 10, K.mat('wood', '#5a3420')); K.slab(BQ - 10, BQ + 10, 0, 6, 10, 10.2, bw);
  K.slab(BQ - 5, BQ + 5, 0, 0.8, -7.9, -4.5, K.mat('wood', '#6a3a20')); K.slab(BQ - 5, BQ + 5, 0.8, 5.5, -7.95, -7.85, K.mat('fabric', '#2a3a8a'));
  for (let i = 0; i < 14; i++) { const fl = K.add(new THREE.ConeGeometry(0.25, 0.5, 3), K.toon({ color: ['#c8202a', '#ffffff', '#2a4aa0'][i % 3], plain: true }), BQ - 6.5 + i, 5.2, -7.7); fl.rotation.z = Math.PI; }
  D.sign(6, 1.0, D.txtTex(1024, 170, '#c8202a', '#ffffff', ['CHAMPIONS 1966'], 'bold 120px Arial Black, Arial'), BQ, 4.3, -7.8, 0, K.scene, 'fabric');
  K.slab(BQ - 6, BQ + 6, 0.75, 0.82, -1.0, 1.0, K.mat('fabric', '#ffffff', { detail: 0.3 })); for (const x of [-5.5, 5.5]) for (const z of [-0.9, 0.9]) K.slab(BQ + x - 0.05, BQ + x + 0.05, 0, 0.75, z - 0.05, z + 0.05, K.mat('wood', '#4a2a18'));
  for (let i = 0; i < 10; i++) { const x = BQ - 5 + i * 1.1; for (const z of [-0.55, 0.55]) { K.cyl(0.2, 0.17, 0.03, K.toon({ color: '#f8f8f8', plain: true, roughness: 0.2 }), x, 0.82, z); K.cyl(0.04, 0.04, 0.16, K.toon({ color: '#d8f0ff', plain: true, roughness: 0.1 }), x + 0.3, 0.82, z * 0.6); } }
  for (const x of [-3, 0, 3]) { K.cyl(0.04, 0.05, 0.3, K.toon({ color: '#f4efe4', plain: true }), BQ + x, 0.82, 0); K.sphere(0.04, K.toon({ color: '#ffd080', plain: true, emissive: '#ffb040' }), BQ + x, 1.16, 0); }
  K.lamp(BQ + 1.5, 3.0, 1.2, { color: '#ffd8a0', intensity: 4.0, distance: 11 }); K.lamp(BQ + 2.75, 2.2, -0.8, { color: '#ffe0b8', intensity: 3.4, distance: 7 }); K.lamp(BQ + 1, 4.4, -5.5, { color: '#ffe0b0', intensity: 3.6, distance: 10 });
  const chair = K.group(); chair.position.set(BQ + 2.75, 0, 1.25); K.slab(-0.25, 0.25, 0.45, 0.52, -0.25, 0.25, K.mat('wood', '#5a3420'), chair); K.slab(-0.25, 0.25, 0.52, 1.1, 0.2, 0.25, K.mat('wood', '#5a3420'), chair);
  for (let i = 0; i < 40; i++) { const c = K.slab(-0.04, 0.04, -0.005, 0.005, -0.03, 0.03, K.toon({ color: ['#c8202a', '#ffffff', '#2a4aa0', '#f2c230'][i % 4], plain: true }), K.scene); CONF.push(c); }
  // fame props on the street: crate to pose on, camera, movie camera, dog-food cans, medal
  const crate = K.slab(7.2, 7.9, 0.12, 0.62, 3.6, 4.3, K.mat('wood', '#b8884a')); crate.name = 'crate'; K.solid(crate);
  CAMBOX = K.group(); CAMBOX.position.set(10.4, 0.12, 3.4); for (const [x, z] of [[-0.2, -0.2], [0.2, -0.2], [0, 0.25]]) K.beam(new THREE.Vector3(x, 0, z), new THREE.Vector3(0, 1.4, 0), 0.02, K.mat('wood', '#5a3420'), CAMBOX);
  K.slab(-0.25, 0.25, 1.4, 1.75, -0.18, 0.18, K.mat('metal', '#2a2a2a'), CAMBOX); for (const x of [-0.12, 0.14]) K.cyl(0.14, 0.14, 0.05, K.mat('metal', '#3a3a3a'), x, 1.92, 0, CAMBOX).rotation.x = Math.PI / 2;
  K.cyl(0.07, 0.08, 0.15, K.mat('metal', '#1a1a1a'), -0.32, 1.58, 0, CAMBOX).rotation.z = Math.PI / 2; CAMBOX.rotation.y = -1.1;
  CANS = K.group(); CANS.position.set(6.2, 0.12, 4.6); const lab = PR.canvasTex(256, 128, (g, w, h) => { g.fillStyle = '#e8a020'; g.fillRect(0, 0, w, h); g.fillStyle = '#c0201a'; g.font = 'bold 60px Arial Black, Arial'; g.textAlign = 'center'; g.fillText('WOOF!', w / 2, 84); }, [3, 1]);
  const lm = K.toon({ map: lab, plain: true }); let n = 0; for (let r = 0; r < 4; r++) for (let i = 0; i < 4 - r; i++) { K.cyl(0.11, 0.11, 0.2, lm, (i - (3 - r) / 2) * 0.24, r * 0.2, 0, CANS); n++; }
  FLASH = K.sphere(0.12, K.toon({ color: '#ffffff', plain: true, emissive: '#ffffff' }), 0, -10, 0);
  // Pickles + leash
  PICK = K.animal('dog', { seed: 7, color: '#1e1a1a', belly: '#f4efe4', scale: 1.0 });
  MEDAL = K.cyl(0.05, 0.05, 0.012, K.toon({ color: '#f2c230', plain: true, roughness: 0.2, emissive: '#5a3a00' }), 0, -0.14, 0.12, PICK.head); MEDAL.rotation.x = Math.PI / 2; MEDAL.visible = false;
  const lm2 = K.toon({ color: '#8a2a1a', plain: true });
  for (let i = 0; i < 8; i++) { const s = K.slab(-0.012, 0.012, 0, 1, -0.012, 0.012, lm2, K.scene); s.castShadow = false; LEASH.push(s); }
  DAVE = K.stick(DAVE_O, { key: 'dave' }); NEI = K.stick(NEI_O, { key: 'nei' }); DET = K.stick(DET_O, { key: 'det' }); BOB = K.stick(BOB_O, { key: 'bob' }); PHO = K.stick(PHO_O, { key: 'pho' });
  PL1 = K.stick(PL('short', '#3a2a1a'), { key: 'pl1' }); PL2 = K.stick(PL('spiky', '#e8c060'), { key: 'pl2' }); PL3 = K.stick({ ...PL('curly', '#1a1a1a'), moustache: '#1a1a1a' }, { key: 'pl3' });
  K.addClouds(10, 700, 160);
}

const hide = (...rs) => rs.forEach((r) => { r.root.visible = false; });
function frame(f) {
  const fx = [];
  const SNIFF = W(1, 'sniffing'), RIP = W(3, 'rips'), GOLD = W(3, 'gold'), PO0 = W(6, 'police') - 4, FAME = L[9][0] - 4, PARTY = L[11][0] - 4;
  const atPolice = f >= PO0 && f < FAME, atParty = f >= PARTY;
  // ---------- Pickles + Dave on the street ----------
  const dogPath = [[-7, SW], [BX - 1.2, SW], [BX - 0.2, BZ - 0.7]], runPath = [[BX + 0.5, SW + 0.2], [10, SW - 0.3], [18.5, SW - 0.2], [19.2, 5.6]];
  const dw = K.walkPath(f, 0, dogPath, 1.15, { endYaw: 0 });
  const RUN0 = L[6][0] - 6, rw = K.walkPath(f, RUN0, runPath, 3.4), drw = K.walkPath(f, RUN0 - 6, runPath.map(([x, z]) => [x, z + 0.7]), 3.4);
  const fameDog = { x: 7.55, z: 3.95, yaw: Math.PI - 0.3 };
  let dog = { x: dw.x, z: dw.z, yaw: dw.yaw, mode: dw.moving ? 'walk' : 'eat', speed: 1.6 };
  if (f >= RUN0 && f < PO0) dog = { x: rw.x, z: rw.z, yaw: rw.yaw, mode: rw.moving ? 'run' : 'stand' };
  else if (f >= RIP - 6 && f < RUN0) dog = { x: BX - 0.5, z: BZ - 1.1, yaw: 0.6, mode: f > GOLD + 30 ? 'wag' : 'sit' };
  if (atPolice) dog = { x: PO - 0.6, z: -0.4, yaw: 0.5, mode: f >= L[8][0] - 4 ? 'sit' : 'stand' };
  if (f >= FAME && !atParty) dog = { ...fameDog, mode: f >= W(10, 'food') - 4 ? 'wag' : 'sit' };
  if (atParty) dog = f >= L[12][0] - 4 ? { x: BQ + 2.75, z: 1.15, yaw: Math.PI, mode: 'stand', nod: f >= L[13][0] - 4 ? 0 : 0.35 + 0.18 * Math.sin(f * 0.6) } : { x: BQ - 2.2, z: -4.2, yaw: 0, mode: 'jump' };
  PICK.set(f, { ...dog, expr: f >= GOLD && f < GOLD + 40 ? 'shock' : atPolice ? 'sad' : 'happy', look: dog.mode === 'sit' ? 0.3 * Math.sin(f / 20) : 0, wag: true });
  if (atParty && f >= L[12][0] - 4) PICK.root.position.y = 0.52 - 0.08;           // up on the chair, head over the plate
  if (atParty && f < L[12][0] - 4) PICK.root.position.y = 0.8 + 0.25 * Math.abs(Math.sin(f * 0.25));
  if (f >= FAME && !atParty) PICK.root.position.y = 0.62;
  MEDAL.visible = f >= W(10, 'medal') - 4;
  if (dog.mode === 'walk' && f % 10 === 0) K.puff(f, f, dog.x, dog.z, 3, 0.2, '#c8c4b8');
  if (dog.mode === 'run' && f % 6 === 0) K.puff(f, f, dog.x, dog.z, 4, 0.25, '#c8c4b8');
  // Dave: dragged behind on the leash, then the find, the run, the questioning, the fame
  const davePos = f < SNIFF + 8 ? { x: dw.moving ? dw.x - 1.7 : BX - 1.6, z: SW - 0.1, yaw: Math.PI / 2 - (dw.moving ? 0 : 0.5) }
    : f < RUN0 ? { x: BX + 0.15, z: BZ - 1.4, yaw: f < RIP + 4 ? 0.15 : Math.PI - 0.3 } : f < PO0 ? { x: drw.x, z: drw.z, yaw: drw.yaw } : atPolice ? { x: PO - 0.4, z: 0.2, yaw: Math.PI, seat: 0.45 } : !atParty ? { x: 8.6, z: 3.5, yaw: -0.3 } : { x: BQ - 3.0, z: -5.6, yaw: 0, y: 0.8 };
  const daveKeys = [[0, 'grab', { expr: 'shock', tilt: -12 }], [W(0, 'Pickles') + 8, 'stroll', { expr: 'confused' }], [W(1, 'drags') - 3, 'grab', { expr: 'pained', tilt: -14 }], [SNIFF - 6, 'think', { expr: 'confused' }],
    [W(2, 'newspaper') - 6, 'crouch', { expr: 'confused' }], [RIP - 4, 'grab', { expr: 'excited' }], [GOLD - 3, 'show', { expr: 'shock' }], [L[4][0] - 2, 'show', { expr: 'shock', sweat: true }], [W(4, 'stolen'), 'shock', { expr: 'scared', sweat: true }],
    [L[5][0], 'show', { expr: 'nervous', sweat: true }], [RUN0, 'run', { expr: 'excited' }], [PO0, 'sit', { expr: 'proud' }], [W(6, 'proud'), 'sit', { expr: 'grin' }], [L[7][0] + 6, 'sit', { expr: 'nervous', sweat: true }],
    [W(7, 'question') + 10, 'sit', { expr: 'scared', sweat: true }], [L[8][0] + 6, 'sit', { expr: 'pained', sweat: true }], [FAME, 'clap', { expr: 'laugh' }], [W(10, 'medal'), 'pointDown', { expr: 'proud' }], [W(10, 'food'), 'cheer', { expr: 'laugh' }],
    [PARTY, 'cheer', { expr: 'excited' }], [L[12][0], 'laugh', { expr: 'laugh' }]];
  const DA = D.act(K, DAVE, f, daveKeys.map((k) => (f >= RUN0 && f < PO0 && rw.moving && k[0] === RUN0) ? k : k), 2, davePos);
  // the cup: in the bundle until "rips", then in Dave's hands, on the desk, on the stage
  BUNDLE.visible = f < RIP + 6 && !atPolice && f < FAME;
  if (f >= RIP + 6 && f < RIP + 14) BUNDLE.scale.setScalar(1 - (f - RIP - 6) / 8);
  CUP.visible = f >= RIP + 4;
  if (f >= RIP + 4 && f < PO0) { X.holdAt(DAVE, CUP, 1, [0, 0, 0], [0, -0.05, 0]); }
  else if (atPolice) { CUP.position.set(PO - 0.3, 0.82, -1.3); CUP.rotation.set(0, 0, 0); }
  else if (f >= FAME && !atParty) { CUP.position.set(7.0, 0.62, 4.0); CUP.rotation.set(0, 0, 0); CUP.visible = f < L[11][0] - 4; }
  if (atParty) { CUP.visible = true; if (f < L[12][0] - 4) { const pl = X.hands(PL2)[1]; PL2.root.updateMatrixWorld(true); } CUP.position.set(BQ, 0.82 + 1.9 + 0.1 * Math.sin(f * 0.3), -5.6); if (f >= L[12][0] - 4) CUP.position.set(BQ + 0.3, 0.82, 0); }
  if (f >= GOLD - 2 && f < GOLD + 20) { const p = CUP.position; FLASH.position.set(p.x, p.y + 0.35, p.z); FLASH.scale.setScalar(0.12 + 0.2 * Math.sin(Math.PI * (f - GOLD + 2) / 22)); } else FLASH.position.y = -10;
  // leash (only on the walk)
  const showLeash = f < SNIFF + 8;
  if (showLeash) { DAVE.root.updateMatrixWorld(true); const hp = X.hands(DAVE)[1].getWorldPosition(new K.THREE.Vector3()); PICK.head.updateMatrixWorld(true); const np = PICK.head.getWorldPosition(new K.THREE.Vector3()); np.y -= 0.1;
    const taut = dw.moving ? 0.05 : 0.3; const pts = []; for (let i = 0; i <= LEASH.length; i++) { const t = i / LEASH.length; const p = hp.clone().lerp(np, t); p.y -= Math.sin(Math.PI * t) * taut; pts.push(p); }
    LEASH.forEach((s, i) => { s.visible = true; const a = pts[i], b = pts[i + 1]; s.position.copy(a); s.scale.y = a.distanceTo(b); s.lookAt(b); s.rotateX(Math.PI / 2); }); } else LEASH.forEach((s) => { s.visible = false; });
  // neighbour: gasps at the gold, reads the board
  if (f >= L[3][0] - 10 && f < PO0) D.act(K, NEI, f, [[0, 'idle', { expr: 'smile' }], [GOLD, 'shock', { expr: 'shock' }], [W(4, 'stolen') - 2, 'ears', { expr: 'shock' }], [L[5][0], 'pointL', { expr: 'nervous', talk: true }], [RUN0, 'wave', { expr: 'excited' }]], 4, { x: BX + 2.4, z: SW - 0.4, yaw: -1.9 });
  else if (f >= FAME && !atParty) D.act(K, NEI, f, [[0, 'clap', { expr: 'excited' }], [W(10, 'movie'), 'cheer', { expr: 'laugh' }]], 4, { x: 5.6, z: 3.4, yaw: 0.5 }); else hide(NEI);
  // detective + bobby
  if (atPolice) {
    D.act(K, DET, f, [[0, 'cross', { expr: 'stern' }], [L[7][0] - 2, 'cross', { expr: 'angry' }], [W(7, 'question') - 3, 'pointL', { expr: 'angry', talk: true }], [L[8][0] - 3, 'hips', { expr: 'stern', talk: true }], [W(8, 'dog') - 3, 'pointDown', { expr: 'confused', talk: true }]], 5, { x: PO + 0.2, z: -2.4, yaw: 0 });
    D.act(K, BOB, f, [[0, 'salute', { expr: 'neutral' }], [L[7][0], 'cross', { expr: 'stern' }], [W(7, 'hours'), 'write', { expr: 'sleepy' }], [L[8][0], 'shrug', { expr: 'confused' }]], 6, { x: PO + 1.8, z: -0.4, yaw: -1.3 });
  } else hide(DET, BOB);
  // photographer: flashes, then the movie camera
  if (f >= FAME && !atParty) { D.act(K, PHO, f, [[0, 'phone', { expr: 'excited' }], [W(10, 'movie') - 4, 'type', { expr: 'grin' }], [W(10, 'food'), 'clap', { expr: 'laugh' }]], 7, f < W(10, 'movie') - 4 ? { x: 9.2, z: 3.2, yaw: -1.4 } : { x: 10.8, z: 3.0, yaw: -1.2 });
    const fl = (f - FAME) % 14; if (fl < 2 && f < W(10, 'movie') - 4) { FLASH.position.set(9.0, 1.7, 3.3); FLASH.scale.setScalar(2.2); } }
  else hide(PHO);
  CAMBOX.visible = !atParty; CANS.visible = f >= W(10, 'food') - 8 && !atParty;
  // players at the party
  if (atParty) {
    const onStage = f < L[12][0] - 4;
    [[PL1, 11, -1.3], [PL2, 12, 0], [PL3, 13, 1.3]].forEach(([r, sd, dx], i) => D.act(K, r, f, onStage ? [[0, 'cheer', { expr: 'excited' }], [W(11, 'wins') - 3 + i * 2, 'celebrate', { expr: 'laugh' }], [W(11, 'wins') + 30, 'cheer', { expr: 'laugh' }]]
      : [[0, 'laugh', { expr: 'laugh' }], [W(12, 'lick') - 2 + i * 3, 'pointL', { expr: 'laugh' }], [W(12, 'Pickles') - 2, 'shock', { expr: 'shock' }], [W(12, 'Pickles') + 14, 'laugh', { expr: 'laugh' }], [L[13][0], 'clap', { expr: 'laugh' }]], sd,
      onStage ? { x: BQ + dx, y: 0.8, z: -5.8, yaw: 0 } : { x: BQ + 0.6 + dx * 1.3, z: -1.25, yaw: 0, seat: 0.48 }));
    CONF.forEach((c, i) => { const t = ((f - PARTY) * 0.02 + i * 0.137) % 1; c.position.set(BQ - 4 + (i * 2.17) % 8, 5.5 - t * 5.2, -6 + (i * 1.31) % 4); c.rotation.set(f * 0.1 + i, i, f * 0.13); c.visible = onStage; });
  } else { hide(PL1, PL2, PL3); CONF.forEach((c) => { c.visible = false; }); }
  // ---------- shots ----------
  const dP = (q) => { const w = K.walkPath(q, 0, dogPath, 1.15); return [w.x, 0, w.z]; }, rP = (q) => { const w = K.walkPath(q, RUN0, runPath, 3.4); return [w.x, 0, w.z]; };
  const tr = (at, off, o = {}) => K.track(f, at, { off, lag: 3, ...o });
  const cupP = [CUP.position.x, CUP.position.y + 0.25, CUP.position.z];
  const S = [
    [0, (u) => { const t = tr(dP, [2.2, 0.7, -2.6], { lookY: 0.6 }); return { pos: t.pos, look: [t.look[0] - 0.8, t.look[1], t.look[2]], fov: 46, cinf: 8 }; }],
    [W(0, 'Pickles') - 6, (u) => { const t = tr(dP, [1.7, 0.6, -1.9], { lookY: 0.4 }); return { pos: t.pos, look: t.look, fov: 40, cinf: 14 }; }],
    [L[1][0] - 4, (u) => { const t = tr(dP, [-1.0, 2.6, -6.5], { lookY: 0.8 }); return { pos: t.pos, look: t.look, fov: 44, cinf: 5 }; }, { whip: true }],
    [W(1, 'drags') - 4, (u) => { const t = tr(dP, [2.2, 0.35, -0.9], { lookY: 0.6 }); return { pos: t.pos, look: [t.look[0] - 1.0, t.look[1] + 0.2, t.look[2]], fov: 46, cinf: 8 }; }],
    [SNIFF - 6, (u) => ({ pos: [BX - 1.5, 0.6, BZ - 0.5], look: [BX - 0.2, 0.4, BZ - 0.45], fov: 40, cinf: 14 })],
    [L[2][0] - 4, (u) => ({ pos: [BX + 0.8, 0.6, BZ - 1.2], look: [BX, 0.3, BZ], fov: 40 * K.push(u, 0.15), cinf: 18, noPush: true }), { whip: true }],
    [W(2, 'newspaper') - 4, (u) => ({ pos: [BX + 1.6, 1.1, BZ - 2.8], look: [BX + 0.15, 0.8, BZ - 1.4], fov: 40, cinf: 12 })],
    [L[3][0] - 4, (u) => ({ pos: [BX - 1.4, 1.3, BZ - 3.4], look: [BX + 0.15, 0.9, BZ - 1.4], fov: 40, cinf: 12 })],
    [GOLD - 4, (u) => ({ pos: [cupP[0] - 0.7, cupP[1] + 0.2, cupP[2] - 1.5], look: cupP, fov: 40 * K.punch(f, GOLD, 0.2, 6), cinf: 18, noPush: true })],
    [L[4][0] - 4, (u) => ({ pos: [BX + 0.5, 1.6, BZ - 3.2], look: [BX + 0.15, 1.45, BZ - 1.4], fov: 36, cinf: 14 }), { whip: true }],
    [W(4, 'stolen') - 4, (u) => ({ pos: [5.2, 1.0, 3.2], look: [5, 0.95, 4.8], fov: 40 * K.push(u, 0.12), cinf: 18, noPush: true })],
    [L[5][0] - 4, (u) => ({ pos: [10.6, 1.7, 10.2], look: [11.0, 1.8, 13.9], fov: 46, cinf: 10 }), { whip: true }],
    [W(5, 'four') + 20, (u) => ({ pos: [BX + 1.6, 1.5, BZ - 3.8], look: [BX + 0.6, 1.2, BZ - 1.4], fov: 42, cinf: 10 })],
    [RUN0, (u) => { const t = tr(rP, [-3.0, 1.2, -3.2], { lookY: 0.9 }); return { pos: t.pos, look: t.look, fov: 46, cinf: 8 }; }, { whip: true }],
    [PO0, (u) => ({ pos: [PO - 2.0, 1.6, 2.8], look: [PO - 0.3, 1.1, -0.6], fov: 44, cinf: 8, light: IN }), { whip: true }],
    [L[7][0] - 4, (u) => ({ pos: [PO - 0.5, 1.7, 0.2], look: [PO + 0.2, 1.6, -2.4], fov: 38, cinf: 14, light: IN })],
    [W(7, 'question') - 4, (u) => ({ pos: [PO + 0.6, 1.45, -0.9], look: [PO - 0.4, 1.2, 0.2], fov: 38 * K.punch(f, W(7, 'question'), 0.12, 6), cinf: 14, light: IN, noPush: true })],
    [L[8][0] - 4, (u) => ({ pos: [PO + 0.7, 0.6, 1.0], look: [PO - 0.6, 0.35, -0.4], fov: 42, cinf: 14, light: IN }), { whip: true }],
    [FAME, (u) => ({ pos: [lerp(6.0, 6.6, u), 1.5, 0.8], look: [7.6, 0.9, 4.0], fov: 44, cinf: 8 }), { whip: true }],
    [W(9, 'Pickles') - 4, (u) => ({ pos: [6.8, 1.4, 2.2], look: [7.55, 1.15, 3.95], fov: 40, cinf: 14 })],
    [W(10, 'medal') - 4, (u) => ({ pos: [8.1, 1.3, 3.0], look: [7.55, 1.1, 3.95], fov: 38, cinf: 16 })],
    [W(10, 'movie') - 4, (u) => ({ pos: [11.6, 1.9, 1.8], look: [9.0, 1.2, 4.0], fov: 44, cinf: 8 })],
    [W(10, 'food') - 6, (u) => ({ pos: [6.9, 0.8, 2.8], look: [6.6, 0.45, 4.4], fov: 42, cinf: 14 })],
    [PARTY, (u) => ({ pos: [BQ + lerp(-1.0, 1.0, u), 1.9, 0.0], look: [BQ, 2.1, -5.8], fov: 44 * K.punch(f, W(11, 'wins'), 0.14, 6), cinf: 8, light: PARTYL, noPush: true }), { whip: true }],
    [L[12][0] - 4, (u) => ({ pos: [BQ + lerp(-3, -1, u), 1.8, 3.6], look: [BQ + 1.0, 0.9, 0], fov: 46, cinf: 6, light: PARTYL }), { whip: true }],
    [W(12, 'lick') - 4, (u) => ({ pos: [BQ + 3.4, 1.3, -0.5], look: [BQ + 2.75, 1.05, 1.15], fov: 44, cinf: 12, light: PARTYL })],
    [W(12, 'Pickles') - 4, (u) => ({ pos: [BQ + 0.8, 1.6, 0.3], look: [BQ + 0.6, 1.5, -1.25], fov: 38, cinf: 14, light: PARTYL })],
    [L[13][0] - 4, (u) => ({ pos: [BQ + 2.3, 1.25, -0.7], look: [BQ + 2.75, 1.05, 1.15], fov: 42 * K.push(u, 0.14), cinf: 14, light: PARTYL, noPush: true }), { whip: true }],
  ];
  const R = D.runShots(S, f, TOTAL), cam = R.cam;
  if (R.id === 11) D.card(fx, f, W(5, 'four'), '4 MONTHS', cam, '#ffffff', 170, 40, 0.5);
  return { light: R.light || DAY, cam, dof: R.dof, actors: [], fx };
}
export default { TOTAL, look: 'rich', build, frame };
