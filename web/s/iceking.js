// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why did Frederic Tudor ship a frozen lake to the tropics?" (story, inspired by Frederic Tudor's first ice voyage
// from Boston to Martinique, 1806, and his later ice trade to Cuba, Brazil and India). Tropical island + dock + bar
// (island ground x>0, dock x -12..0), the ship (group SHIP), a snowy Boston street at x≈-200.
import { TOTAL, LINES, wf } from './iceking_timing.js';
import * as PR from '../props.js';
import * as D from './d19.js';
const { clamp, lerp, sm } = D;
export { TOTAL };
const L = LINES, W = wf;
let K, SHIP, SHIPICE = [], DOCKICE = [], PUDDLES = [], SAW, SAWPILE, GLASSES = [], CONES = [], SIGN, NEWS, TUD, SAIL, LOC = [], BAR, BOS = [], DOG, CROWN;
const TUD_O = { jacket: '#2a4a3a', pants: '#2a2a30', boots: '#111', hat: 'tophat', hatColor: '#1a1a1a', vest: '#c8a050', bowtie: '#c0392b', moustache: '#6a3a1a', collar: '#ffffff' };
const SAIL_O = { jacket: '#f4efe4', pants: '#2a4a8a', boots: '#2a1a12', hat: 'cap', cap: '#2a4a8a', scarf: '#c0392b', belt: '#3a2418', gloves: '#8a6a4a' };
const LOC_O = [
  { jacket: '#e86a2a', pants: '#f4efe4', boots: '#5a3a2a', hat: 'cowboy', hatColor: '#e8c870', scarf: '#2a8a6a', belt: '#5a3a24' },
  { jacket: '#2a9a8a', dress: '#2a9a8a', hairStyle: 'curly', hair: '#1a1a1a', scarf: '#f2c230', apron: '#f4efe4' },
  { jacket: '#f2c230', pants: '#3a5a8a', boots: '#3a2418', hairStyle: 'short', hair: '#1a1a1a', vest: '#c0392b', glasses: '#333', pockets: true },
];
const BAR_O = { jacket: '#ffffff', pants: '#2a2a30', boots: '#111', hairStyle: 'spiky', hair: '#2a1a12', bowtie: '#1a1a1a', apron: '#e8dcc0', vest: '#8a2a3a', moustache: '#2a1a12' };
const BOS_O = [
  { jacket: '#5a2a2a', pants: '#2a2a30', boots: '#111', hat: 'tophat', hatColor: '#3a2a2a', scarf: '#e8dcc0', glasses: true, belt: '#111' },
  { jacket: '#3a3a6a', pants: '#3a3a40', boots: '#111', hat: 'beanie', hatColor: '#c0392b', scarf: '#f2c230', gloves: '#2a2a2a', moustache: '#8a8a8a' },
];
const SUN = { az: 70, el: 44, sky: '#d0ecff', ground: '#e8d8a8', hemi: 1.05, sun: '#fff0d0', sunI: 3.3, skyTop: '#2a8ae0', skyHor: '#c8f0ff', fog: '#d8f0fa', fogNear: 60, fogFar: 520,
  sat: 1.18, vig: 0.22, shadowExt: 16, exposure: 1.1, ink: 0.55, bloom: 0.65 };
const SNOW = { ...SUN, sky: '#dce6f0', ground: '#ffffff', sun: '#f0f4ff', sunI: 2.6, skyTop: '#7a9ac8', skyHor: '#e8eef6', fog: '#e8eef4', sat: 0.95, fogNear: 30, fogFar: 200 };
const BX = -200; // Boston

function build(k) {
  K = k; D.init(K); const { THREE } = K;
  const sea = K.add(new THREE.PlaneGeometry(2000, 2000), K.toon({ color: '#1f8ac0', plain: true, roughness: 0.12, metalness: 0.15 }), 0, 0, 0); sea.rotation.x = -Math.PI / 2;
  const shal = K.add(new THREE.CircleGeometry(30, 40), K.toon({ color: '#3ac8d8', plain: true, roughness: 0.15 }), 25, 0.01, 0); shal.rotation.x = -Math.PI / 2;
  K.add(new THREE.CylinderGeometry(22, 26, 1.0, 40), K.mat('dirt', '#ecd8a0', { detail: 0.8, amt: 0.3 }), 26, 0.0, 0);
  K.add(new THREE.CylinderGeometry(14, 20, 6, 30), K.mat('grime', '#5aa84a', { amt: 0.5 }), 40, 0.5, -6).scale.set(1, 1, 0.8);
  // dock
  K.slab(-12, 5, 0.5, 0.7, -2, 2, K.mat('wood', '#a87444', { detail: 0.6 }), K.scene, false);
  for (let x = -12; x <= 4; x += 2) for (const z of [-1.9, 1.9]) K.cyl(0.14, 0.14, 1.4, K.mat('wood', '#6a4428'), x, -0.7, z);
  for (const [x, z] of [[3, -1.3], [4, 1.3]]) K.cyl(0.35, 0.35, 0.9, K.mat('wood', '#8a5a34'), x, 0.7, z);
  // palms (merged)
  const tr = [], lf = [], r = (() => { let s = 5; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
  for (let i = 0; i < 16; i++) { const x = 8 + r() * 32, z = -16 + r() * 30; if (z > -4 && z < 9 && x < 16) continue; const h = 5 + r() * 3, lean = (r() - 0.5) * 0.4;
    for (let s2 = 0; s2 < 6; s2++) tr.push(new THREE.Matrix4().compose(new THREE.Vector3(x + lean * s2 * h / 6, 0.5 + s2 * h / 6, z), new THREE.Quaternion(), new THREE.Vector3(1 - s2 * 0.06, 1, 1 - s2 * 0.06)));
    for (let j = 0; j < 7; j++) { const a = j / 7 * Math.PI * 2; lf.push(new THREE.Matrix4().compose(new THREE.Vector3(x + lean * h + Math.cos(a) * 1.3, 0.5 + h - 0.3, z + Math.sin(a) * 1.3), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -a, 0.45)), new THREE.Vector3(1, 1, 1))); } }
  K.add(PR.mergeCopies(new THREE.CylinderGeometry(0.22, 0.26, 0.9, 8), tr), K.toon({ color: '#8a6a44', plain: true, roughness: 0.9 }), 0, 0, 0);
  K.add(PR.mergeCopies(new THREE.BoxGeometry(2.8, 0.06, 0.7), lf), K.toon({ color: '#3a9a3a', plain: true, roughness: 0.8 }), 0, 0, 0);
  // huts
  for (const [x, z, c] of [[14, -8, '#e8c070'], [19, 7, '#f4b0a0'], [24, -3, '#a8d8e8']]) { K.slab(x - 2, x + 2, 0.5, 3.2, z - 2, z + 2, K.mat('wood', c, { detail: 0.6 })); K.add(new THREE.ConeGeometry(3.2, 2.2, 4), K.mat('fabric', '#c8a060', { detail: 0.1 }), x, 4.3, z).rotation.y = Math.PI / 4; K.slab(x - 0.5, x + 0.5, 0.5, 2.3, z + 2.0, z + 2.05, K.mat('wood', '#5a3a20')); }
  // bar on the beach
  BAR = K.group(); BAR.position.set(9, 0.5, 4);
  K.slab(-2, 2, 0, 1.1, -0.4, 0.4, K.mat('wood', '#a86a3a', { detail: 0.5 }), BAR); K.slab(-2.1, 2.1, 1.1, 1.18, -0.5, 0.5, K.mat('wood', '#6a3a24'), BAR);
  for (const x of [-1.9, 1.9]) K.cyl(0.08, 0.08, 2.8, K.mat('wood', '#6a4428'), x, 0, -0.9, BAR);
  K.add(new THREE.ConeGeometry(3, 1.2, 4), K.mat('fabric', '#d8b070', { detail: 0.1 }), 0, 3.3, -0.2, BAR).rotation.y = Math.PI / 4;
  for (let i = 0; i < 4; i++) { const g = K.group(BAR); g.position.set(-1.3 + i * 0.8, 1.18, 0.15); K.cyl(0.07, 0.06, 0.2, K.toon({ color: '#d8f0f8', plain: true, roughness: 0.05, transparent: true, opacity: 0.55 }), 0, 0, 0, g);
    K.cyl(0.06, 0.055, 0.14, K.toon({ color: '#f2d84a', plain: true }), 0, 0.01, 0, g); for (let j = 0; j < 2; j++) K.slab(-0.03, 0.03, 0.1 + j * 0.05, 0.16 + j * 0.05, -0.03, 0.03, K.toon({ color: '#e8f8ff', plain: true, roughness: 0.05, emissive: '#204050' }), g); GLASSES.push(g); }
  for (let i = 0; i < 3; i++) { const g = K.group(BAR); g.position.set(-0.9 + i * 0.9, 1.18, -0.2); K.add(new THREE.ConeGeometry(0.06, 0.18, 10).rotateX(Math.PI), K.toon({ color: '#d8a060', plain: true }), 0, 0.09, 0, g); K.sphere(0.07, K.toon({ color: ['#f4b0c0', '#f4efe4', '#8a5a3a'][i], plain: true }), 0, 0.2, 0, g); g.visible = false; CONES.push(g); }
  SIGN = D.sign(2.6, 0.7, D.txtTex(640, 160, '#2a8ac0', '#ffffff', ['ICE COLD DRINKS'], 'bold 84px Georgia, serif'), 0, 2.5, -0.85, 0, BAR); SIGN.visible = false;
  for (const x of [-1.2, 0, 1.2]) K.cyl(0.2, 0.2, 0.7, K.mat('wood', '#8a5a34'), x, 0, 1.0, BAR);
  // ice on the dock (melts) + puddles + sawdust
  const iceM = K.toon({ color: '#c8ecff', plain: true, roughness: 0.05, metalness: 0.1, emissive: '#2a5a7a', transparent: true, opacity: 0.85 });
  for (let i = 0; i < 6; i++) { const b = K.slab(-0.4, 0.4, 0, 0.7, -0.4, 0.4, iceM); b.position.set(-4.4 + (i % 3) * 0.95, 0.7, -0.6 + Math.floor(i / 3) * 0.95); DOCKICE.push(b);
    const p = K.add(new THREE.CircleGeometry(0.6, 24), K.toon({ color: '#8ad0f0', plain: true, roughness: 0.05 }), b.position.x, 0.71, b.position.z); p.rotation.x = -Math.PI / 2; PUDDLES.push(p); }
  SAW = K.group(); for (let i = 0; i < 6; i++) { const s = K.slab(-0.43, 0.43, 0, 0.74, -0.43, 0.43, K.mat('fabric', '#d8b070', { detail: 0.04, amt: 0.5 }), SAW); s.position.set(-4.4 + (i % 3) * 0.95, 0.7, -0.6 + Math.floor(i / 3) * 0.95); }
  SAWPILE = K.add(new THREE.ConeGeometry(0.9, 0.8, 16), K.mat('fabric', '#d8b070', { detail: 0.04, amt: 0.5 }), -1.2, 1.1, -1.0);
  // the ship (group, moves)
  SHIP = K.group();
  K.add(new THREE.BoxGeometry(12, 2.2, 3.6), K.mat('wood', '#7a4a2a', { detail: 0.8 }), 0, 0.6, 0, SHIP);
  K.add(new THREE.ConeGeometry(1.8, 3.2, 4).rotateZ(-Math.PI / 2).rotateX(Math.PI / 4), K.mat('wood', '#7a4a2a'), 7.5, 0.7, 0, SHIP);
  K.slab(-6, 6, 1.7, 1.85, -1.85, 1.85, K.mat('wood', '#c8a070'), SHIP); K.slab(-6.1, 6.1, 1.85, 2.3, -1.85, -1.7, K.mat('wood', '#e8e0d0'), SHIP); K.slab(-6.1, 6.1, 1.85, 2.3, 1.7, 1.85, K.mat('wood', '#e8e0d0'), SHIP);
  for (const mx of [-2.8, 2.2]) { K.cyl(0.12, 0.15, 11, K.mat('wood', '#6a4428'), mx, 1.8, 0, SHIP); const s = K.add(new THREE.PlaneGeometry(4.4, 4.6), K.toon({ color: '#f8f4ea', kind: 'fabric', side: THREE.DoubleSide }), mx + 0.1, 7.6, 0, SHIP); s.rotation.y = 0.35; }
  K.add(new THREE.PlaneGeometry(1.4, 0.8), K.toon({ color: '#2a5aa8', plain: true, side: THREE.DoubleSide }), -2.8, 12.4, 0.72, SHIP).rotation.y = Math.PI / 2;
  for (let i = 0; i < 10; i++) { const b = K.slab(-0.38, 0.38, 0, 0.6, -0.38, 0.38, iceM, SHIP); b.position.set(-4.6 + (i % 5) * 0.85 + (i % 5 > 1 ? 1.4 : 0), 1.85, -0.5 + Math.floor(i / 5) * 0.95); SHIPICE.push(b); }
  D.sign(1.8, 0.45, D.txtTex(512, 128, '#1a2a4a', '#f2e6c0', ['ICE FROM BOSTON'], 'bold 60px Georgia, serif'), -0.5, 1.2, 1.82, 0, SHIP);
  // Boston street (snow) + newspaper
  K.slab(BX - 40, BX + 40, 0.0, 0.5, -30, 30, K.mat('plaster', '#f4f6fa', { amt: 0.1 }), K.scene, false);
  for (let i = 0; i < 6; i++) { const h = 9 + (i * 3) % 5; K.add(new THREE.BoxGeometry(7.6, h, 6), K.toon({ map: PR.facadeTex(['#a8483a', '#8a5a3a', '#b86a4a'][i % 3], 3, 3, 90 + i, '#f4efe4'), kind: 'brick', amt: 0.1 }), BX - 20 + i * 8, h / 2 + 0.5, -10);
    K.slab(BX - 23.8 + i * 8, BX - 16.2 + i * 8, h + 0.5, h + 0.9, -13, -7, K.mat('plaster', '#ffffff')); }
  K.cyl(0.07, 0.09, 3.4, K.mat('metal', '#2a2a2a'), BX + 3, 0.5, -4); K.add(new THREE.BoxGeometry(0.35, 0.45, 0.35), K.toon({ color: '#fff2c0', plain: true, emissive: '#ffe6a0' }), BX + 3, 4.1, -4);
  NEWS = K.add(new THREE.PlaneGeometry(0.9, 1.2), K.toon({ map: PR.canvasTex(384, 512, (g, w, h) => { g.fillStyle = '#f2ead8'; g.fillRect(0, 0, w, h); g.fillStyle = '#1a1a1a'; g.textAlign = 'center'; g.font = 'bold 38px Georgia, serif'; g.fillText('BOSTON BUGLE', w / 2, 52); g.fillRect(16, 64, w - 32, 4);
    g.font = 'bold 60px Georgia, serif'; g.fillText('A SLIPPERY', w / 2, 150); g.fillText('IDEA!', w / 2, 220); g.fillStyle = '#8a9aaa'; g.fillRect(40, 250, w - 80, 150); g.fillStyle = '#c8ecff'; g.fillRect(150, 300, 80, 60); g.fillStyle = '#5a4030'; for (let i = 0; i < 7; i++) g.fillRect(40, 420 + i * 12, w - 80, 4); }), plain: true, side: THREE.DoubleSide }), BX + 1.0, 1.9, -1.0);
  // cast
  TUD = K.stick(TUD_O, { key: 'tud' }); SAIL = K.stick(SAIL_O, { key: 'sail' }); LOC = LOC_O.map((o, i) => K.stick(o, { key: 'loc' + i }));
  const BART = K.stick(BAR_O, { key: 'bart' }); LOC.push(BART); BOS = BOS_O.map((o, i) => K.stick(o, { key: 'bos' + i }));
  CROWN = K.group(); K.add(new THREE.CylinderGeometry(0.2, 0.17, 0.16, 8, 1, true), K.toon({ color: '#bfe8ff', plain: true, roughness: 0.05, emissive: '#3a7aa0', side: THREE.DoubleSide }), 0, 0, 0, CROWN);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; K.add(new THREE.ConeGeometry(0.04, 0.14, 6), K.toon({ color: '#e8f8ff', plain: true, emissive: '#3a7aa0' }), Math.cos(a) * 0.19, 0.13, Math.sin(a) * 0.19, CROWN); }
  DOG = K.animal('dog', { seed: 11, color: '#e8c890' });
  K.addClouds(14, 700, 150);
}

function frame(f) {
  const T = K.T, fx = [];
  const LAND = L[4][0] - 4, LOSE = W(7, 'loses'), SAWT = W(12, 'sawdust'), FREE = W(13, 'free'), SIP = L[14][0], KING = W(17, 'ice') , PUD = W(7, 'puddles');
  // ship: sailing at sea (hook, voyages, India, loop) or moored at the dock
  const atSea = f < LAND || (f >= L[8][0] - 4 && f < L[9][0] - 4) || (f >= L[15][0] - 4 && f < L[16][0] - 4) || f >= L[18][0] - 4;
  if (atSea) { SHIP.position.set(-60 + (f % 400) * 0.03, 0.05 * Math.sin(f / 12), -30); SHIP.rotation.set(0.03 * Math.sin(f / 17), 0, 0.025 * Math.sin(f / 23)); }
  else { SHIP.position.set(-8, 0, -4.4); SHIP.rotation.set(0.01 * Math.sin(f / 30), 0, 0); }
  // ice on board shrinks a little in the heat; on the dock it melts away (first trip), stays wrapped later
  const sh = 1 - 0.25 * sm(L[1][0], L[2][0] + 40, f);
  SHIPICE.forEach((b) => { b.scale.y = f < L[8][0] ? sh : f < L[12][0] ? 0.8 : 1; b.visible = !(f >= LAND && f < L[8][0] - 4); });
  const melt = f < L[12][0] - 4 ? sm(LAND, PUD + 10, f) : 0;
  DOCKICE.forEach((b, i) => { b.visible = f >= LAND - 4 && melt < 0.98; b.scale.set(1 - 0.3 * melt, Math.max(0.02, 1 - melt * (0.9 + 0.05 * i)), 1 - 0.3 * melt); });
  PUDDLES.forEach((p, i) => { const s = f >= L[12][0] - 4 ? 0 : 0.2 + 1.3 * melt; p.visible = s > 0.05 && f >= LAND; p.scale.setScalar(s); });
  SAW.visible = f >= SAWT - 6 && f < L[15][0]; SAW.scale.y = sm(SAWT - 6, SAWT + 10, f) + 0.001; SAWPILE.visible = f >= L[12][0] - 4 && f < L[15][0];
  if (SAW.visible) DOCKICE.forEach((b) => { b.visible = false; });
  SIGN.visible = f >= FREE - 2; CONES.forEach((c) => { c.visible = f >= L[16][0] - 4; });
  GLASSES.forEach((g, i) => { g.visible = f >= FREE - 8; g.position.y = 1.18 + (f >= SIP && f < SIP + 20 && i === 1 ? 0.0 : 0); });
  // Tudor
  const tk = [[0, 'pointUp', { expr: 'excited' }], [L[1][0] - 4, 'hips', { expr: 'proud' }], [L[2][0] - 4, 'hold', { expr: 'nervous', sweat: true, R: [0.3, 0.3, 'moneybag'] }],
    [LAND, 'pointDown', { expr: 'shock' }], [W(4, 'dripping') + 4, 'panic', { expr: 'scared', sweat: true }], [L[5][0], 'show', { expr: 'smile', talk: true }],
    [L[6][0] + 20, 'think', { expr: 'nervous', sweat: true }], [LOSE - 3, 'shock', { expr: 'shock' }], [LOSE + 12, 'facepalm', { expr: 'sad' }], [PUD - 2, 'fall', { expr: 'dazed' }],
    [L[9][0] - 4, 'hold', { expr: 'sad', R: [0.3, 0.3, 'moneybag'] }], [W(9, 'louder') - 3, 'ears', { expr: 'pained' }], [L[10][0] - 4, 'shrug', { expr: 'sad', L: [0.4, 0.2, 'food'] }],
    [L[11][0] - 4, 'think', { expr: 'confused' }], [W(11, 'want') - 2, 'idea', { expr: 'excited' }], [L[12][0] - 4, 'dig', { expr: 'stern' }], [W(12, 'blanket') - 4, 'hips', { expr: 'proud' }],
    [L[13][0] - 4, 'show', { R: [0.42, -0.6, 'cup'], expr: 'grin', talk: true }], [SIP, 'clap', { expr: 'laugh' }], [L[15][0] - 4, 'pointUp', { expr: 'excited' }], [L[16][0] - 4, 'cheer', { expr: 'excited' }],
    [L[17][0] - 4, 'celebrate', { expr: 'proud' }], [L[18][0], 'wave', { expr: 'grin' }]];
  const tPos = f < LAND ? { x: -2.0, y: 1.85, z: 0.3, yaw: 0.0 } : f < L[12][0] - 4 ? { x: -2.2, y: 0.7, z: 0.6, yaw: -0.6 } : f < L[13][0] - 4 ? { x: -4.4, y: 0.7, z: 0.9, yaw: Math.PI } : { x: 7.0, y: 0.5, z: 5.3, yaw: -0.5 };
  if (atSea && f >= L[8][0] - 4) Object.assign(tPos, { x: -2.0, y: 1.85, z: 0.3, yaw: 0 });
  const TA = D.act(K, TUD, f, tk, 1, atSea ? { ...tPos, x: tPos.x + SHIP.position.x, y: tPos.y + SHIP.position.y, z: tPos.z + SHIP.position.z } : tPos);
  // ice crown for the Ice King
  CROWN.visible = f >= KING - 4 && f < L[18][0] - 4; if (CROWN.visible) { TUD.head.updateMatrixWorld(true); const p = new K.THREE.Vector3(0, 0.66, 0); TUD.head.localToWorld(p); CROWN.position.copy(p); CROWN.rotation.y = TPosYaw(tPos); }
  // sailor
  D.act(K, SAIL, f, [[0, 'pointUp', { expr: 'excited' }], [L[1][0], 'carry', { item: 'box', expr: 'pained', sweat: true }], [LAND, 'carry', { item: 'box', expr: 'nervous', sweat: true }], [W(4, 'dripping'), 'shock', { expr: 'shock' }],
    [L[7][0], 'facepalm', { expr: 'sad' }], [L[8][0] - 4, 'salute', { expr: 'smile' }], [L[12][0] - 4, 'dig', { expr: 'pained' }], [L[13][0], 'cheer', { expr: 'excited' }]], 2,
    atSea ? { x: SHIP.position.x + 1.4, y: SHIP.position.y + 1.85, z: SHIP.position.z - 0.6, yaw: 0.6 } : f < L[12][0] - 4 ? { x: -0.8, y: 0.7, z: -0.9, yaw: -1.6 } : { x: -2.8, y: 0.7, z: -1.6, yaw: -2.2 });
  // locals: poke, sniff, lick; later sip, cheer
  const lp = [[-3.2, 1.55, 2.6], [-4.4, -1.6, 0], [-5.6, 1.4, 2.47]];
  LOC.forEach((r, i) => {
    if (i === 3) { D.act(K, r, f, [[0, 'idle', { expr: 'smile' }], [FREE - 6, 'show', { R: [0.42, -0.6, 'cup'], expr: 'grin', talk: true }], [SIP + 10, 'clap', { expr: 'laugh' }], [L[16][0], 'show', { R: [0.42, -0.6, 'food'], expr: 'excited' }], [L[17][0], 'cheer', { expr: 'laugh' }]], 30, { x: 9, y: 0.5, z: 3.2, yaw: 0 }); return; }
    const early = f < L[12][0] - 4;
    const k2 = [[0, 'cross', { expr: 'neutral' }], [L[5][0] - 4, 'shrug', { expr: 'confused' }], [W(6, 'poke') - 3 + i * 4, i === 0 ? 'pointDown' : i === 1 ? 'crouch' : 'think', { expr: 'confused' }],
      [W(6, 'sniff') - 3, i === 1 ? 'crouch' : 'shrug', { expr: i === 1 ? 'confused' : 'smile' }], [W(6, 'licks') - 3, i === 2 ? 'crouch' : 'cross', { expr: i === 2 ? 'lick' : 'shock' }], [W(6, 'licks') + 14, i === 2 ? 'shock' : 'clap', { expr: i === 2 ? 'shock' : 'laugh' }],
      [W(6, 'melt') - 3, 'shrug', { expr: 'sad' }], [L[7][0], 'pointL', { expr: 'laugh' }], [L[9][0] - 4, 'clap', { expr: 'laugh' }]];
    const late = [[0, 'idle', { expr: 'smile' }], [SIP - 4, 'drink', { item: 'cup', expr: 'relief' }], [SIP + 30 + i * 5, 'celebrate', { expr: 'excited' }], [L[16][0] - 4, 'eat', { item: 'food', expr: 'smile' }], [L[17][0] - 4 + i * 3, 'cheer', { expr: 'laugh' }]];
    D.act(K, r, f, early ? k2 : late, 20 + i, early ? { x: lp[i][0], y: 0.7, z: lp[i][1], yaw: f >= L[7][0] ? Math.atan2(-2.2 - lp[i][0], 0.6 - lp[i][1]) : lp[i][2] } : { x: 7.8 + i * 1.2, y: 0.5, z: 5.4 + (i % 2) * 0.5, yaw: Math.PI + 0.3 - i * 0.2 });
  });
  // Bostonians laugh (Boston set)
  BOS.forEach((r, i) => D.act(K, r, f, [[0, 'read', { item: 'paper', expr: 'smile' }], [W(3, 'laughed') - 3 + i * 2, i ? 'facepalm' : 'pointL', { expr: 'laugh' }], [W(3, 'slippery') - 3, i ? 'clap' : 'show', { expr: 'laugh', R: i ? undefined : [0.42, -0.6, 'paper'] }]], 40 + i, { x: BX + i * 1.3, y: 0.5, z: 0.6 - i * 0.3, yaw: i ? -0.4 : 0.4 }));
  DOG.set(f, { x: 2.0 + 0.6 * Math.sin(f / 40), y: 0.7, z: 1.2, yaw: -1.5, mode: f > L[5][0] && f < L[8][0] ? 'wag' : f > L[13][0] ? 'sit' : 'stand', expr: 'happy', look: 0.3 * Math.sin(f / 15) });
  if (f >= LAND - 4 && f < LAND + 20) K.puff(f, LAND - 2, -3.4, 0, 6, 0.4, '#e8f4ff');
  if (f >= PUD - 4 && f < PUD + 20) K.puff(f, PUD - 2, -2.2, 0.6, 7, 0.5, '#c8e8ff');
  // ---------- shots ----------
  const sp = SHIP.position, Sp = (dx, dy, dz) => [sp.x + dx, sp.y + dy, sp.z + dz];
  const S = [
    [0, (u) => ({ pos: Sp(lerp(-0.6, 0.2, u), 2.9, 3.6), look: Sp(-2.4, 2.2, -0.2), fov: 46, cinf: 10 })],
    [W(0, 'lake') - 4, (u) => ({ pos: Sp(-9, 3.2, 14), look: Sp(0, 3.0, 0), fov: 50, cinf: 3 })],
    [L[1][0] - 4, (u) => ({ pos: Sp(lerp(6.5, 5.5, u), 3.8, 6), look: Sp(-1.5, 2.4, 0), fov: 52, cinf: 5 }), { whip: true }],
    [W(1, 'packed') - 4, (u) => ({ pos: Sp(-2.6, 2.9, 1.6), look: Sp(-3.6, 2.0, -0.2), fov: 40, cinf: 14 })],
    [L[2][0] - 4, (u) => ({ pos: Sp(-1.4, 3.1, 1.9), look: Sp(-2.0, 3.0, 0.3), fov: 38 * K.punch(f, W(2, 'loses'), 0.15, 6), cinf: 14, noPush: true })],
    [L[3][0] - 4, (u) => ({ pos: [BX + 0.6, 2.2, 4.4], look: [BX + 0.6, 1.8, 0.4], fov: 42, cinf: 8, light: SNOW }), { whip: true }],
    [W(3, 'newspapers') - 4, (u) => ({ pos: [BX + 1.2, 1.95, 0.2], look: [BX + 1.0, 1.9, -1.0], fov: 40, cinf: 18, light: SNOW })],
    [L[4][0] - 4, (u) => ({ pos: [lerp(1.5, 0.8, u), 2.4, 4.5], look: [-3.5, 1.2, -0.4], fov: 46, cinf: 6 }), { whip: true }],
    [W(4, 'dripping') - 4, (u) => ({ pos: [-3.4, 1.5, 1.5], look: [-3.5, 0.9, 0.0], fov: 38, cinf: 16 })],
    [L[5][0] - 4, (u) => ({ pos: [-0.6, 2.0, 3.2], look: [-4.4, 1.5, 0.6], fov: 46, cinf: 6 })],
    [L[6][0] - 4, (u) => ({ pos: [-2.0, 1.6, 3.6], look: [-3.2, 1.3, 1.55], fov: 38, cinf: 12 }), { whip: true }],
    [W(6, 'sniff') - 4, (u) => ({ pos: [-3.9, 2.0, 0.9], look: [-4.4, 1.2, -1.6], fov: 38, cinf: 12 })],
    [W(6, 'licks') - 4, (u) => ({ pos: [-3.3, 1.75, -1.2], look: [-5.6, 1.3, 1.4], fov: 36 * K.punch(f, W(6, 'licks'), 0.15, 6), cinf: 14, noPush: true })],
    [L[7][0] - 4, (u) => ({ pos: [-3.2, 1.65, 2.4], look: [-2.2, 1.55, 0.6], fov: 38 * K.punch(f, LOSE, 0.2, 6), cinf: 12, noPush: true }), { whip: true }],
    [PUD - 6, (u) => ({ pos: [-2.4, 3.2, 2.4], look: [-2.8, 0.7, 0.0], fov: 44, cinf: 6 })],
    [L[8][0] - 4, (u) => ({ pos: Sp(-12, 2.6, 11), look: Sp(0, 3.0, 0), fov: 48, cinf: 3 }), { whip: true }],
    [W(8, 'again') + 6, (u) => ({ pos: Sp(-0.4, 3.0, 1.8), look: Sp(-2.0, 2.9, 0.3), fov: 38, cinf: 14 })],
    [L[9][0] - 4, (u) => ({ pos: [-4.8, 1.8, 3.2], look: [-3.2, 1.5, 1.2], fov: 40, cinf: 10 }), { whip: true }],
    [L[10][0] - 4, (u) => ({ pos: [-3.0, 1.75, 2.2], look: [-2.2, 1.6, 0.6], fov: 36, cinf: 14 })],
    [L[11][0] - 4, (u) => ({ pos: [lerp(-3.4, -3.0, u), 1.8, 2.3], look: [-2.2, 1.65, 0.6], fov: 34 * K.punch(f, W(11, 'want'), 0.15, 6), cinf: 14, noPush: true })],
    [L[12][0] - 4, (u) => ({ pos: [-3.0, 2.2, 3.6], look: [-4.2, 1.1, 0.2], fov: 44, cinf: 8 }), { whip: true }],
    [SAWT - 6, (u) => ({ pos: [-2.9, 1.9, 2.0], look: [-4.2, 0.9, 0.0], fov: 38, cinf: 16 })],
    [L[13][0] - 4, (u) => ({ pos: [lerp(10.5, 9.5, u), 2.0, 9.0], look: [8.6, 1.5, 4.4], fov: 44, cinf: 6 }), { whip: true }],
    [FREE - 2, (u) => ({ pos: [8.9, 1.95, 4.9], look: [8.6, 1.72, 4.15], fov: 36, cinf: 18 })],
    [L[14][0] - 4, (u) => ({ pos: [8.0, 1.95, 3.1], look: [9.0, 1.5, 5.6], fov: 38, cinf: 12 })],
    [W(14, 'nobody') - 4, (u) => ({ pos: [10.0, 1.9, 3.4], look: [10.2, 1.5, 5.4], fov: 36, cinf: 14 })],
    [L[15][0] - 4, (u) => ({ pos: Sp(lerp(-13, -10, u), 3.4, 13), look: Sp(0, 3.0, 0), fov: 50, cinf: 3 }), { whip: true }],
    [W(15, 'india') - 4, (u) => ({ pos: Sp(4, 3.2, 3.2), look: Sp(1.0, 2.6, 0.0), fov: 44, cinf: 8 })],
    [L[16][0] - 4, (u) => ({ pos: [8.4, 2.25, 5.0], look: [8.6, 1.75, 3.8], fov: 38, cinf: 16 }), { whip: true }],
    [W(16, 'clinking') - 4, (u) => ({ pos: [lerp(6, 11, u), 1.9, 9.2], look: [lerp(7, 10, u), 1.5, 5.4], fov: 44, cinf: 6 })],
    [L[17][0] - 4, (u) => ({ pos: [5.8, 2.1, 7.6], look: [7.0, 2.05, 5.3], fov: 38 * K.punch(f, KING, 0.2, 6), cinf: 12, noPush: true }), { whip: true }],
    [L[18][0] - 4, (u) => ({ pos: Sp(-7, 3.0, 11), look: Sp(0, 3.0, 0), fov: 50, cinf: 3 }), { whip: true }],
    [L[19][0] - 4, (u) => ({ pos: Sp(lerp(-0.8, -0.6, u), 2.9, 3.6), look: Sp(-2.4, 2.3, -0.2), fov: 46, cinf: 10 })],
  ];
  const R = D.runShots(S, f, TOTAL), cam = R.cam;
  if (R.id === 3) D.card(fx, f, W(1, '130'), '130 TONS', cam, '#bfe8ff', 200, 45, 0.45);
  if (R.id === 26) { D.card(fx, f, W(15, 'cuba') , 'CUBA', cam, '#ffffff', 190, 20, 0.5); D.card(fx, f, W(15, 'brazil'), 'BRAZIL', cam, '#f6c83a', 190, 20, 0.5); }
  if (R.id === 27) D.card(fx, f, W(15, 'india'), 'INDIA!', cam, '#ff9a3a', 200, 40, 0.5);
  if (R.id === 23 && f >= FREE) D.card(fx, f, FREE, 'FREE ICE', cam, '#bfe8ff', 190, 40, 0.5);
  return { light: R.light || SUN, cam, dof: R.dof, actors: [], fx };
}
const TPosYaw = (p) => p.yaw || 0;
export default { TOTAL, look: 'rich', build, frame };
