// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The spaghetti trees" — BBC Panorama, 1 April 1957: a Swiss family in Ticino harvests spaghetti from trees;
// viewers phone in asking how to grow their own.
import { TOTAL, LINES, wf } from './spaghetti_timing.js';
import * as PR from '../props.js';
import * as X from './kit3d.js';
import { blinkAt } from '../motion.js';
const { M, clamp, ramp, lerp, q } = X;

export { TOTAL };
const L = LINES, cut = (i) => Math.max(0, L[i][0] - 4), W = wf;
let K, DAD, MUM, GIRL, REP, VIEW, OPER, strand, basket, mic, bug, tin, calPage, phones = [], racks = [];

const DAD_O = { jacket: '#5a7a3a', pants: '#4a3a2a', boots: '#3a2a1e', hat: 'cap', cap: '#8a6a3a', moustache: '#4a2e1e', skin: '#f2c8a0' };
const MUM_O = { jacket: '#c84a4a', pants: '#3a3a5a', boots: '#3a2a1e', hat: 'hair', hair: '#4a2e1e', skin: '#f5d0b0' };
const GIRL_O = { jacket: '#e8a830', pants: '#3a5a8a', boots: '#8a2a2a', hat: 'hair', hair: '#6a3e22', skin: '#f5d6bc', build: 'kid' };
const REP_O = { jacket: '#3a3a48', pants: '#2a2a32', boots: '#1e1a18', hat: 'hair', hair: '#2a2420', moustache: '#2a2420', skin: '#f2d2b8', build: 'stout' };
const VIEW_O = { jacket: '#7a5a8a', pants: '#4a4a4a', boots: '#3a2a1e', hat: 'hair', hair: '#a8a098', skin: '#f2cfae' };
const OPER_O = { jacket: '#3a6a9a', pants: '#2a2a3a', boots: '#2a1a1a', hat: 'hair', hair: '#d8b070', skin: '#f5d6bc' };

const SUN = { az: 200, el: 34, sky: '#d8e8f4', ground: '#6a8a3a', hemi: 0.95, sun: '#fff2d8', sunI: 3.0, fog: '#d8e6ee', fogNear: 40, fogFar: 380,
  skyTop: '#3a7ad0', skyHor: '#e0eef8', sat: 1.16, vig: 0.22, shadowExt: 14, exposure: 1.08, ink: 0.55 };
const ROOM = { ...SUN, az: 120, el: 40, hemi: 0.55, sunI: 1.4, exposure: 1.15, bloom: 0.5, vig: 0.34, cardTint: '#fff0e0', fog: '#2a2018', fogNear: 18, fogFar: 50 };

function build(k) {
  K = k; X.init(K); const { THREE } = K; const r = X.rnd(57);
  const grass = K.mat('dirt', '#7aa04a', { detail: 1.3, amt: 0.4 }), bark = K.mat('wood', '#6a4a32', { detail: 0.6 }), leaf = K.mat('grime', '#5a9a3a', { amt: 0.6, bump: 0.02 }),
    wood = K.mat('wood', '#9a6a3a'), dark = K.mat('wood', '#5a3e28'), pasta = K.toon({ color: '#f2d878', plain: true, roughness: 0.55 }), rock = K.mat('rock', '#a8a098', { detail: 3 });
  K.slab(-150, 150, -0.1, 0, -150, 150, grass, K.scene, false);
  // mountains + lake far away
  for (let i = 0; i < 7; i++) { const m = K.add(new THREE.ConeGeometry(40 + r() * 30, 60 + r() * 40, 10), rock, -180 + i * 60, 0, -170 - r() * 40); m.rotation.y = r();
    K.add(new THREE.ConeGeometry(14, 16, 10), K.toon({ color: '#f4f6fa', plain: true }), m.position.x, 50 + r() * 10, m.position.z + 6); }
  const lake = K.add(new THREE.PlaneGeometry(260, 40), K.toon({ color: '#5a9ac8', plain: true, roughness: 0.2 }), 0, 0.02, -110, K.scene, { cast: false }); lake.rotation.x = -Math.PI / 2;
  for (let i = 0; i < 5; i++) { const h = K.add(new THREE.BoxGeometry(4, 3, 4), K.mat('plaster', ['#f2e2c8', '#e8c8a0', '#f2d8b8'][i % 3]), -30 + i * 9, 1.5, -60 - (i % 2) * 6); K.add(new THREE.ConeGeometry(3.4, 1.8, 4).rotateY(Math.PI / 4), K.mat('rock', '#a8483a'), h.position.x, 3.9, h.position.z); }
  K.add(new THREE.BoxGeometry(2.2, 9, 2.2), K.mat('plaster', '#efe6d4'), 18, 4.5, -64); K.add(new THREE.ConeGeometry(1.8, 3, 4).rotateY(Math.PI / 4), K.mat('rock', '#8a3a2a'), 18, 10.5, -64);
  // orchard: rows of trees with hanging spaghetti (merged strands)
  const strandG = new THREE.CylinderGeometry(0.008, 0.008, 1, 4, 1).translate(0, -0.5, 0);
  const TREES = []; for (let row = 0; row < 4; row++) for (let col = 0; col < 5; col++) TREES.push([-8 + col * 4 + (row % 2) * 1.5, -4 - row * 4.5]);
  TREES.push([1.4, 1.2]);
  for (const [x, z] of TREES) { const g = K.group(); g.position.set(x, 0, z); const s = 1 + r() * 0.15;
    K.cyl(0.13 * s, 0.2 * s, 1.7 * s, bark, 0, 0, 0, g); for (let j = 0; j < 3; j++) { const br = K.cyl(0.05, 0.08, 1.0, bark, 0, 1.4 * s, 0, g); br.rotation.set(0.7 * Math.cos(j * 2.1), 0, 0.7 * Math.sin(j * 2.1)); }
    for (let j = 0; j < 5; j++) { const c = K.add(new THREE.DodecahedronGeometry(0.75 * s, 1), leaf, (r() - 0.5) * 1.6, 2.35 * s + r() * 0.5, (r() - 0.5) * 1.6, g); c.scale.y = 0.75; }
    const mats = []; for (let i = 0; i < 70; i++) { const a = r() * 6.28, d = 0.3 + r() * 1.05, len = 0.45 + r() * 0.6; const m = new THREE.Matrix4().compose(new THREE.Vector3(Math.cos(a) * d, 2.0 * s + r() * 0.2, Math.sin(a) * d), new THREE.Quaternion().setFromEuler(new THREE.Euler((r() - 0.5) * 0.12, 0, (r() - 0.5) * 0.12)), new THREE.Vector3(1, len, 1)); mats.push(m); }
    const sm = new THREE.Mesh(PR.mergeCopies(strandG, mats), pasta); sm.castShadow = true; g.add(sm); }
  // ladder, baskets, drying racks with spaghetti
  const lad = K.group(); lad.position.set(0.2, 0, 1.0); lad.rotation.set(-0.18, 0.4, 0); for (const sx of [-0.25, 0.25]) K.slab(sx - 0.03, sx + 0.03, 0, 2.6, -0.03, 0.03, wood, lad); for (let y = 0.3; y < 2.6; y += 0.4) K.slab(-0.25, 0.25, y - 0.02, y + 0.02, -0.03, 0.03, wood, lad);
  const bask = (x, z, s = 1, parent = K.scene) => { const b = K.group(parent); b.position.set(x, 0, z); K.add(new THREE.CylinderGeometry(0.3 * s, 0.22 * s, 0.32 * s, 18, 1, true), K.mat('wood', '#b8884a', { detail: 0.15 }), 0, 0.16 * s, 0, b).material.side = THREE.DoubleSide;
    K.add(new THREE.SphereGeometry(0.27 * s, 14, 8, 0, Math.PI * 2, 0, 1.3), pasta, 0, 0.18 * s, 0, b).scale.y = 0.5; return b; };
  bask(-0.6, 1.8); bask(2.6, -0.2, 1.1); bask(-2.2, -1.5); basket = bask(0, 0, 0.8); basket.visible = false;
  for (let i = 0; i < 3; i++) { const g = K.group(); g.position.set(-4.5 + i * 1.6, 0, 4.5); racks.push(g);
    for (const sx of [-0.7, 0.7]) K.slab(sx - 0.04, sx + 0.04, 0, 1.3, -0.04, 0.04, dark, g); K.slab(-0.75, 0.75, 1.25, 1.31, -0.03, 0.03, dark, g);
    const mats = []; for (let j = 0; j < 40; j++) mats.push(new THREE.Matrix4().compose(new THREE.Vector3(-0.65 + j * 0.033, 1.25, (j % 2) * 0.02), new THREE.Quaternion(), new THREE.Vector3(1, 0.75 + (j % 3) * 0.05, 1)));
    const sm = new THREE.Mesh(PR.mergeCopies(strandG, mats), pasta); sm.castShadow = true; g.add(sm); }
  K.slab(-6, -2, 0.7, 0.76, 6.2, 7.0, wood); for (const [a, b] of [[-5.9, 6.3], [-2.1, 6.3], [-5.9, 6.9], [-2.1, 6.9]]) K.slab(a - 0.04, a + 0.04, 0, 0.7, b - 0.04, b + 0.04, dark);
  bask(-4.6, 6.6, 0.7).position.y = 0.76; K.cyl(0.12, 0.12, 0.3, K.mat('metal', '#5a8a3a'), -3.2, 0.76, 6.5);
  X.fence(-10, 10, 8.5, 1.0, wood);
  for (let i = 0; i < 60; i++) { const fl = K.add(new THREE.SphereGeometry(0.05, 6, 4), K.toon({ color: ['#f2e84a', '#f2f2f2', '#e86a8a'][i % 3], plain: true }), (r() - 0.5) * 24, 0.05, (r() - 0.5) * 20 - 3); }
  // the strand being yanked + the weevil
  strand = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1, 6, 1).translate(0, 0.5, 0), pasta); strand.castShadow = true; K.scene.add(strand);
  bug = K.group(); K.add(new THREE.SphereGeometry(0.035, 12, 8), K.mat('metal', '#2a4a2a', { roughness: 0.3 }), 0, 0, 0, bug).scale.set(1, 0.8, 1.5); K.add(new THREE.SphereGeometry(0.02, 8, 6), K.toon({ color: '#1a1a1a', plain: true }), 0, 0.005, 0.05, bug);
  for (let i = 0; i < 3; i++) for (const s of [-1, 1]) { const l = K.cyl(0.003, 0.003, 0.05, K.toon({ color: '#1a1a1a', plain: true }), s * 0.035, -0.02, -0.02 + i * 0.02, bug); l.rotation.z = s * 1.0; }
  mic = K.group(); K.cyl(0.015, 0.02, 0.18, K.mat('metal', '#2a2a2e'), 0, -0.1, 0, mic); K.add(new THREE.SphereGeometry(0.04, 12, 8), K.mat('metal', '#8a8a90'), 0, 0.09, 0, mic);
  // ---- living room at x=60 (1957)
  const lr = K.group(); lr.position.set(60, 0, 0);
  K.slab(-4, 4, 0, 0.08, -3.5, 5, K.mat('wood', '#7a4a2a', { detail: 0.6 }), lr); K.slab(-4, 4, 0, 3.2, -3.7, -3.5, K.toon({ map: PR.canvasTex(256, 256, (g) => { g.fillStyle = '#d8c89a'; g.fillRect(0, 0, 256, 256); g.fillStyle = '#c8b07a'; for (let x = 0; x < 256; x += 32) g.fillRect(x, 0, 12, 256); }), kind: 'plaster', amt: 0.15 }), lr);
  K.slab(-4.2, -4, 0, 3.2, -3.5, 5, K.mat('plaster', '#d8c89a'), lr);
  const tv = K.group(lr); tv.position.set(0.2, 0, -2.6); K.slab(-0.55, 0.55, 0, 0.6, -0.35, 0.35, K.mat('wood', '#4a2a16'), tv); K.slab(-0.5, 0.5, 0.6, 1.4, -0.4, 0.4, K.mat('wood', '#6a3a1e'), tv);
  const tvPic = PR.canvasTex(320, 256, (g, w, h) => { g.fillStyle = '#bcc4b8'; g.fillRect(0, 0, w, h); g.fillStyle = '#8a9a7a'; g.fillRect(0, 150, w, 106); for (let i = 0; i < 3; i++) { const x = 50 + i * 110; g.fillStyle = '#4a4a40'; g.fillRect(x - 6, 110, 12, 60); g.fillStyle = '#6a7a5a'; g.beginPath(); g.arc(x, 90, 42, 0, 7); g.fill(); g.strokeStyle = '#efe8c8'; g.lineWidth = 2; for (let j = 0; j < 9; j++) { g.beginPath(); g.moveTo(x - 32 + j * 8, 100); g.lineTo(x - 32 + j * 8, 140 + (j % 3) * 8); g.stroke(); } }
    g.fillStyle = 'rgba(255,255,255,0.08)'; for (let y = 0; y < h; y += 4) g.fillRect(0, y, w, 1); });
  K.add(new THREE.PlaneGeometry(0.72, 0.56), K.toon({ map: tvPic, plain: true, emissive: '#c8d0c8', emissiveIntensity: 0.6 }), 0, 1.0, 0.41, tv, { cast: false });
  const sofa = K.group(lr); sofa.position.set(0.2, 0, 1.6); K.slab(-1.2, 1.2, 0, 0.45, -0.45, 0.45, K.mat('fabric', '#8a3a3a'), sofa); K.slab(-1.2, 1.2, 0.45, 1.0, 0.3, 0.5, K.mat('fabric', '#8a3a3a'), sofa); for (const s of [-1, 1]) K.slab(s * 1.2 - 0.15, s * 1.2 + 0.15, 0, 0.7, -0.45, 0.5, K.mat('fabric', '#7a3030'), sofa);
  K.slab(-3.2, -2.2, 0, 0.7, -3.4, -2.8, K.mat('wood', '#5a3a22'), lr); const ph = K.group(lr); ph.position.set(-2.7, 0.7, -3.1); K.slab(-0.12, 0.12, 0, 0.1, -0.1, 0.1, K.mat('metal', '#1a1a1a'), ph); K.slab(-0.14, 0.14, 0.12, 0.17, -0.03, 0.03, K.mat('metal', '#1a1a1a'), ph);
  K.cyl(0.2, 0.25, 0.4, K.mat('metal', '#8a6a3a'), 2.8, 0, -3.0, lr); K.add(new THREE.SphereGeometry(0.45, 12, 8), leaf, 2.8, 0.85, -3.0, lr);
  K.cyl(0.03, 0.03, 1.5, K.mat('metal', '#c8a040'), -3.3, 0, 1.0, lr); K.add(new THREE.CylinderGeometry(0.15, 0.3, 0.35, 16, 1, true), K.toon({ color: '#f2e0b0', plain: true }), -3.3, 1.6, 1.0, lr);
  K.lamp(56.7, 1.55, 1.0, { color: '#ffc080', intensity: 1.8, distance: 6, glowS: 0.4 }); K.lamp(60.2, 1.1, -2.0, { color: '#c8e0ff', intensity: 0.8, distance: 3, glow: false });
  for (let i = 0; i < 3; i++) X.sign(0.5, 0.4, X.txtTex(128, 100, '#4a3a2a', '#e8d8b0', ['❀'], '60px serif'), -1.5 + i * 1.3, 2.2, -3.48, 0, lr);
  // calendar
  calPage = K.group(lr); calPage.position.set(2.0, 1.9, -3.46); X.sign(0.6, 0.75, X.txtTex(256, 320, '#f6efe0', '#c83a2a', ['APRIL', '1'], 'bold 76px Georgia'), 0, 0, 0.0, 0, calPage);
  const marchPg = K.group(calPage); X.sign(0.6, 0.75, X.txtTex(256, 320, '#f6efe0', '#2a2a2a', ['MARCH', '31'], 'bold 72px Georgia'), 0, -0.375, 0.01, 0, marchPg); marchPg.position.y = 0.375; calPage.userData.page = marchPg;
  tin = K.group(lr); tin.position.set(-0.6, 0.0, -1.2); K.cyl(0.12, 0.12, 0.22, K.toon({ map: X.txtTex(256, 128, '#c83a2a', '#f2e8c8', ['TOMATO'], 'bold 52px Arial'), plain: true }), 0, 0, 0, tin);
  K.cyl(0.11, 0.11, 0.01, K.toon({ color: '#b83a1a', plain: true }), 0, 0.215, 0, tin); for (let i = 0; i < 6; i++) { const sp = K.cyl(0.006, 0.006, 0.4, pasta, (i - 2.5) * 0.012, 0.2, 0, tin); sp.rotation.z = (i - 2.5) * 0.04; }
  const pot = K.group(lr); pot.position.set(-0.6, 0, -1.2); K.cyl(0.25, 0.18, 0.08, K.mat('dirt', '#5a3a22'), 0, 0, 0, pot);
  // ---- switchboard office at x=-60
  const of = K.group(); of.position.set(-60, 0, 0);
  K.slab(-5, 5, 0, 0.08, -4, 5, K.mat('wood', '#6a5a4a'), of); K.slab(-5, 5, 0, 3.4, -4.2, -4, K.mat('plaster', '#c8d0c0'), of); K.slab(-5.2, -5, 0, 3.4, -4, 5, K.mat('plaster', '#c8d0c0'), of);
  X.sign(3.0, 0.5, X.txtTex(768, 128, '#2a2a2a', '#f2e8c8', ['VIEWER ENQUIRIES'], 'bold 72px Georgia'), 0, 2.7, -3.98, 0, of);
  K.slab(-3, 3, 0, 0.78, -1.2, -0.4, K.mat('wood', '#5a3a22'), of); K.slab(-3.05, 3.05, 0.78, 0.84, -1.25, -0.35, K.mat('wood', '#4a2a16'), of);
  K.slab(-3, 3, 0.84, 2.2, -1.4, -1.25, K.mat('wood', '#3a2a1a'), of); for (let i = 0; i < 60; i++) K.add(new THREE.CircleGeometry(0.03, 8), K.toon({ color: i % 7 === 0 ? '#ffd040' : '#1a1a1a', plain: true, emissive: i % 7 === 0 ? '#ffb000' : '#000000' }), -2.7 + (i % 15) * 0.38, 1.1 + Math.floor(i / 15) * 0.28, -1.24, of);
  for (let i = 0; i < 7; i++) { const g = K.group(of); g.position.set(-2.4 + i * 0.8, 0.84, -0.7); K.slab(-0.11, 0.11, 0, 0.09, -0.09, 0.09, K.mat('metal', '#1a1a1a'), g); const hs = K.slab(-0.13, 0.13, 0.11, 0.16, -0.03, 0.03, K.mat('metal', '#1a1a1a'), g); phones.push(hs); }
  K.lamp(-60, 2.9, 0.5, { color: '#fff0d0', intensity: 2.0, distance: 8, glowS: 0.4 });
  K.addClouds(9, 700, 160);
  DAD = K.stick(DAD_O, { key: 'dad' }); MUM = K.stick(MUM_O, { key: 'mum' }); GIRL = K.stick(GIRL_O, { key: 'girl' }); REP = K.stick(REP_O, { key: 'rep' }); VIEW = K.stick(VIEW_O, { key: 'view' }); OPER = K.stick(OPER_O, { key: 'oper' });
}

const F = { bbc: W(0, 'bbc'), picking: W(0, 'picking'), trees: W(0, 'trees'), noodles: W(1, 'noodles'), dangled: W(1, 'dangled'), families: W(1, 'families'), yanked: W(1, 'yanked'),
  laid: W(2, 'laid'), sun: W(2, 'sun'), dry: W(2, 'dry'), reporter: W(3, 'reporter'), mild: W(3, 'mild'), bumper: W(3, 'bumper'), dreaded: W(4, 'dreaded'), weevil: W(4, 'weevil'), gone: W(4, 'gone'),
  eight: W(5, 'eight'), watched: W(5, 'watched'), hundreds: W(5, 'hundreds'), believed: W(5, 'believed'), phones: W(6, 'phones'), exploded: W(6, 'exploded'), how: W(6, 'how'), tree: W(6, 'tree'),
  answer: W(7, 'answer'), put: W(8, 'put'), sprig: W(8, 'sprig'), tomato: W(8, 'tomato'), hope: W(8, 'hope'), date: W(9, 'date'), april: W(9, 'april'), first: W(9, 'first') };
const YANK_A = { L: [0.2, -0.85, 'fist'], R: [0.3, -0.9, 'fist'], expr: 'stern', tilt: -4 }, YANK_B = { L: [0.3, -0.2, 'fist'], R: [0.35, -0.25, 'fist'], expr: 'grin', tilt: 6, hop: 0.12 };
const girlKeys = [[0, 'grab', YANK_A], [10, 'grab', YANK_B], [24, 'grab', YANK_A], [34, 'grab', YANK_B], [F.picking, 'cheer'], [F.trees + 2, 'carry', { item: 'box' }],
  [cut(1), 'reach', { expr: 'grin' }], [F.families - 2, 'grab', YANK_A], [F.yanked - 2, 'grab', YANK_B], [F.yanked + 12, 'celebrate'],
  [cut(2), 'carry', { expr: 'smile' }], [F.weevil - 4, 'pointDown', { expr: 'shock' }], [F.gone - 2, 'cheer'], [cut(9) + 30, 'laugh' in {} ? 'clap' : 'clap'], [F.first, 'celebrate']];
const dadKeys = [[0, 'reach', { expr: 'grin' }], [F.picking - 2, 'grab', YANK_B], [cut(1), 'grab', YANK_A], [F.dangled, 'pointUp', { expr: 'grin' }], [F.families - 2, 'grab', YANK_A], [F.yanked - 3, 'grab', YANK_B],
  [cut(2), 'carry', { expr: 'neutral' }], [F.laid - 2, 'hold', { R: [0.5, -0.1, 'open'], L: [0.5, -0.1, 'open'], expr: 'smile' }], [F.sun, 'pointUp'], [F.dry + 4, 'hips', { expr: 'grin' }],
  [cut(3), 'cheer'], [cut(9) + 30, 'clap', { expr: 'laugh' }], [F.first, 'celebrate']];
const mumKeys = [[0, 'grab', YANK_A], [12, 'grab', YANK_B], [cut(1), 'grab', YANK_B], [F.families - 4, 'grab', YANK_A], [F.yanked - 1, 'grab', YANK_B], [cut(2), 'hold', { R: [0.3, 0.3, 'open'], expr: 'smile' }],
  [F.laid, 'reach'], [cut(9) + 30, 'clap', { expr: 'laugh' }]];
const repKeys = [[0, 'idle'], [cut(3), 'hold', { R: [-0.2, -0.45, 'fist', true], expr: 'neutral' }], [F.mild, 'pointL', { expr: 'grin' }], [F.bumper - 2, 'cheer', { expr: 'laugh' }], [cut(4), 'hold', { R: [-0.2, -0.45, 'fist', true], expr: 'stern' }], [F.weevil, 'shock'], [F.gone, 'hips', { expr: 'grin' }]];
const viewKeys = [[0, 'sit', { expr: 'neutral' }], [F.eight, 'sit', { expr: 'neutral', look: 0.2 }], [F.hundreds - 2, 'idea', { mode: 'sit', expr: 'grin' }], [F.believed, 'clap', { mode: 'sit', expr: 'laugh' }],
  [cut(6), 'phone', { expr: 'grin' }], [F.how - 2, 'phone', { expr: 'shock' }], [cut(8) + 20, 'dig', { expr: 'grin', mode: 'crouch' }], [F.hope - 3, 'facepalm' in {} ? 'cross' : 'think', { expr: 'nervous' }], [cut(9), 'idle'], [F.april, 'shock'], [F.first + 4, 'facepalm']];
const operKeys = [[0, 'idle'], [cut(6), 'phone', { expr: 'nervous' }], [F.exploded, 'panic'], [F.how, 'phone', { R: [-0.3, -0.52, 'phone', true], L: [0.6, -0.2, 'open'], expr: 'shock' }],
  [cut(7), 'think'], [F.answer, 'idea'], [cut(8), 'phone', { R: [-0.3, -0.52, 'phone', true], expr: 'grin' }], [F.hope, 'cross' in {} ? 'shrug' : 'shrug', { expr: 'grin' }]];

const S = X.shotList([
  { id: 'hook', f: 0, keys: [{ pos: [0.9, 1.25, 4.9], look: [0.9, 1.45, 1.6], fov: 40 }, { pos: [0.9, 1.2, 4.6], look: [0.9, 1.45, 1.6], fov: 37 }] },
  { id: 'orchard', f: F.trees - 4, whip: false, keys: [{ pos: [6, 2.6, 8], look: [0, 1.4, -4], fov: 46 }, { pos: [5.4, 2.4, 7.2], look: [0, 1.4, -4], fov: 44 }] },
  { id: 'dangle', f: cut(1), keys: [{ pos: [1.0, 0.9, 2.2], look: [1.5, 2.4, 1.2], fov: 44 }, { pos: [1.1, 0.95, 2.0], look: [1.35, 2.35, 1.2], fov: 40 }] },
  { id: 'yank', f: F.families - 4, whip: false, keys: [{ pos: [3.4, 1.4, 4.2], look: [1.3, 1.3, 1.2], fov: 42 }, { pos: [3.1, 1.35, 3.8], look: [1.3, 1.3, 1.2], fov: 38 }] },
  { id: 'dry', f: cut(2), keys: [{ pos: [-1.6, 1.4, 8.0], look: [-3.0, 1.1, 4.5], fov: 42 }, { pos: [-1.9, 1.35, 7.6], look: [-3.0, 1.1, 4.5], fov: 40 }] },
  { id: 'sunup', f: F.sun - 4, whip: false, keys: [{ pos: [-3.4, 0.85, 6.4], look: [-3.2, 1.25, 4.5], fov: 40 }, { pos: [-3.4, 0.85, 6.2], look: [-3.2, 1.3, 4.5], fov: 38 }] },
  { id: 'rep', f: cut(3), keys: [{ pos: [-0.4, 1.7, 7.2], look: [0.6, 1.5, 4.0], fov: 38 }, { pos: [-0.3, 1.7, 6.8], look: [0.6, 1.5, 4.0], fov: 35 }] },
  { id: 'crop', f: F.bumper - 4, whip: false, keys: [{ pos: [3.5, 1.0, 0.8], look: [2.6, 0.3, -0.2], fov: 40 }, { pos: [3.4, 0.95, 0.65], look: [2.6, 0.3, -0.2], fov: 36 }] },
  { id: 'weevil', f: cut(4), keys: [{ pos: [2.45, 2.0, 2.4], look: [2.1, 1.85, 1.65], fov: 36 }, { pos: [2.4, 2.0, 2.3], look: [2.1, 1.85, 1.65], fov: 33 }] },
  { id: 'gone', f: F.gone - 4, whip: false, keys: [{ pos: [0.2, 1.3, 4.6], look: [0.8, 1.1, 2.2], fov: 40 }, { pos: [0.3, 1.25, 4.3], look: [0.8, 1.1, 2.2], fov: 37 }] },
  { id: 'tv', f: cut(5), keys: [{ pos: [61.3, 1.9, 3.6], look: [60.1, 1.0, 0.6], fov: 44 }, { pos: [61.2, 1.85, 3.3], look: [60.1, 1.0, 0.6], fov: 42 }] },
  { id: 'believe', f: F.hundreds - 4, whip: false, keys: [{ pos: [60.6, 1.3, -1.0], look: [60.2, 0.95, 1.6], fov: 38 }, { pos: [60.55, 1.25, -0.8], look: [60.2, 0.95, 1.6], fov: 34 }] },
  { id: 'call', f: cut(6), keys: [{ pos: [57.6, 1.5, -0.6], look: [57.6, 1.25, -3.0], fov: 38 }, { pos: [57.7, 1.45, -0.9], look: [57.6, 1.25, -3.0], fov: 35 }] },
  { id: 'switch', f: F.exploded + 4, keys: [{ pos: [-60, 1.7, 3.4], look: [-60, 1.2, -0.6], fov: 44 }, { pos: [-60, 1.6, 2.8], look: [-60, 1.2, -0.6], fov: 40 }] },
  { id: 'answer', f: cut(7), whip: false, keys: [{ pos: [-59.6, 1.5, 1.4], look: [-60, 1.4, -0.1], fov: 36 }, { pos: [-59.6, 1.5, 1.25], look: [-60, 1.4, -0.1], fov: 32 }] },
  { id: 'tin', f: cut(8), keys: [{ pos: [59.4, 0.75, -0.5], look: [59.4, 0.2, -1.2], fov: 40 }, { pos: [59.4, 0.7, -0.6], look: [59.4, 0.2, -1.2], fov: 36 }] },
  { id: 'hope', f: F.hope - 4, whip: false, keys: [{ pos: [58.6, 1.4, 1.4], look: [59.8, 0.8, -1.0], fov: 42 }, { pos: [58.7, 1.35, 1.2], look: [59.8, 0.8, -1.0], fov: 40 }] },
  { id: 'cal', f: cut(9), keys: [{ pos: [62.0, 1.8, -1.5], look: [62.0, 1.9, -3.46], fov: 40 }, { pos: [62.0, 1.8, -1.65], look: [62.0, 1.9, -3.46], fov: 37 }] },
  { id: 'end', f: F.april + 14, keys: [{ pos: [3.1, 1.3, 4.4], look: [1.0, 1.3, 1.0], fov: 42 }, { pos: [2.4, 1.15, 3.4], look: [1.3, 1.45, 1.0], fov: 40 }] },
], TOTAL);
const KICKS = [{ f: F.yanked, a: 0.02 }, { f: F.exploded, a: 0.03 }, { f: F.april, a: 0.03 }];
const SHOWN = new Set();
const put = (rig, keys, seed, pos) => { const A = K.T.act(pos.f, keys, { seed, blink: blinkAt(pos.f, seed) }); rig.set(A, pos); SHOWN.add(rig); return A; };
const V3 = (a) => new K.THREE.Vector3(...a);

export default {
  TOTAL, build, look: 'rich',
  frame(f, k) {
    const { c: cam, s } = X.camAt(S, f, KICKS), id = s.id; SHOWN.clear();
    strand.visible = basket.visible = mic.visible = bug.visible = false;
    const fx = [], push = (x) => x && fx.push(x), u = (a, b) => clamp((f - a) / (b - a));
    const orch = ['hook', 'orchard', 'dangle', 'yank', 'dry', 'sunup', 'rep', 'crop', 'weevil', 'gone', 'end'].includes(id);
    if (orch) {
      // the family under the front tree (1.4, 1.2)
      const inDry = id === 'dry' || id === 'sunup';
      put(GIRL, girlKeys, 5, inDry ? { f, x: -3.0, z: 5.2, yaw: 0.3 } : { f, x: 0.55, z: 2.0, yaw: 0.4 });
      put(DAD, dadKeys, 3, inDry ? { f, x: -4.0, z: 5.0, yaw: 0.1 } : { f, x: 2.35, z: 1.95, yaw: -0.4 });
      put(MUM, mumKeys, 4, inDry ? { f, x: -2.0, z: 5.1, yaw: -0.2 } : { f, x: 2.0, z: 0.6, yaw: -0.3 });
      if (['rep', 'crop', 'weevil'].includes(id)) { put(REP, repKeys, 7, { f, x: 0.6, z: 4.0, yaw: -0.2 }); if (f < F.mild || (f > cut(4) && f < F.weevil)) X.holdAt(REP, mic, 1, [0.2, 0, 0]); }
      // yanked strand from the branch to the girl's hand
      if ((id === 'hook' || id === 'yank') && GIRL.root.visible) {
        const h = X.hands(GIRL)[1].getWorldPosition(new K.THREE.Vector3()), top = V3([1.2, 2.05, 1.35]); const d = top.clone().sub(h);
        strand.position.copy(h); strand.quaternion.setFromUnitVectors(new K.THREE.Vector3(0, 1, 0), d.clone().normalize()); strand.scale.set(1, d.length(), 1); strand.visible = true; }
      if (id === 'weevil' || id === 'gone') { const t = u(cut(4), F.gone); bug.visible = f < F.gone + 2; bug.position.set(2.1, lerp(1.7, 2.0, t), 1.65); bug.rotation.set(-1.4, 0, 0);
        if (f >= F.gone - 2 && f < F.gone + 14) push(X.FX('pf' + q(u(F.gone - 2, F.gone + 14), 1), (p) => K.T.fxPuff(p, u(F.gone - 2, F.gone + 14)), [2.1, 1.65, 1.67], 0.3, { order: 6 })); }
    }
    if (['tv', 'believe', 'call', 'tin', 'hope', 'cal'].includes(id)) {
      const callMode = id === 'call'; put(VIEW, viewKeys, 8, id === 'tv' || id === 'believe' ? { f, x: 60.2, y: 0, z: 1.65, yaw: Math.PI, seat: 0.45 } : callMode ? { f, x: 57.4, z: -2.5, yaw: 0.4 } : { f, x: 60.1, z: -0.9, yaw: -1.6 });
      tin.visible = f >= cut(8); tin.position.y = 0.04;
    }
    if (id === 'switch' || id === 'answer') put(OPER, operKeys, 9, { f, x: -60, z: 0.1, yaw: id === 'answer' ? 0.2 : 0 });
    phones.forEach((p, i) => { p.position.y = id === 'switch' && (f + i * 3) % 8 < 4 ? 0.04 : 0; p.rotation.z = id === 'switch' ? 0.2 * Math.sin(f * 1.3 + i) : 0; });
    if (id === 'switch' && f % 6 < 3) for (let i = 0; i < 3; i++) push(X.FX('ring' + i, (p) => K.T.fxRing(p, 0.6), [-62.4 + i * 1.6, 1.15, -0.7], 0.3, { order: 6 }));
    // calendar flip: march page flips up on "April"
    calPage.userData.page.rotation.x = -Math.PI * M.back(u(F.april - 4, F.april + 6)) * 0.95; calPage.userData.page.visible = f < F.april + 6;
    for (const r of [DAD, MUM, GIRL, REP, VIEW, OPER]) if (!SHOWN.has(r)) r.root.visible = false;
    // cards
    if (id === 'orchard') push(X.wordCard(f, F.trees, 'SPAGHETTI TREES', cam, '#f6c83a', 1e9, 160, 0.62, 2));
    if (id === 'dry') push(X.wordCard(f, F.laid, 'SUN-DRIED', cam, '#f6c83a', 1e9, 190, 0.62, 1.8));
    if (id === 'crop') push(X.wordCard(f, F.bumper, 'BUMPER CROP', cam, '#9ad04a', 1e9, 180, 0.62, 1.2));
    if (id === 'weevil') push(X.wordCard(f, F.weevil, 'SPAGHETTI WEEVIL', cam, '#ff7a3a', 1e9, 150, 0.6, 0.6));
    if (id === 'gone') push(X.wordCard(f, F.gone, 'GONE!', cam, '#ffffff', 1e9, 210, 0.62, 1.8));
    if (id === 'tv') push(X.wordCard(f, F.eight, '8 MILLION', cam, '#f6c83a', 1e9, 150, 0.62, 1.8));
    if (id === 'switch') push(X.wordCard(f, F.how, 'HOW DO I GROW ONE?', cam, '#ffffff', 1e9, 140, 0.62, 1.8));
    if (id === 'tin') push(X.wordCard(f, F.tomato, 'TOMATO SAUCE', cam, '#ff5a3a', 1e9, 170, 0.6, 0.8));
    if (id === 'hope') push(X.wordCard(f, F.hope, '...AND HOPE', cam, '#f6c83a', 1e9, 190, 0.62, 1.8));
    if (id === 'end') push(X.wordCard(f, F.april + 14, 'APRIL FOOLS!', cam, '#ff5a3a', 1e9, 190, 0.62, 2));
    const cl = { hook: [[1.3, 1.3, 1.5], 12], dangle: [[1.4, 2.2, 1.2], 10], yank: [[1.4, 1.3, 1.3], 11], dry: [[-3, 1.1, 5], 10], sunup: [[-3.2, 1.5, 4.5], 12], rep: [[0.6, 1.5, 4], 13], crop: [[2.6, 0.3, -0.2], 16],
      weevil: [[2.1, 1.85, 1.65], 18], gone: [[0.9, 1.1, 1.8], 12], tv: [[60.3, 1.0, 0.3], 8], believe: [[60.2, 1.0, 1.6], 13], call: [[57.5, 1.2, -2.6], 13], switch: [[-60, 1.2, 0], 9], answer: [[-60, 1.45, 0.1], 14],
      tin: [[59.4, 0.2, -1.2], 18], hope: [[59.6, 0.8, -1.0], 10], cal: [[62, 1.9, -3.46], 16], end: [[1.3, 1.3, 1.4], 10] };
    const dof = cl[id] ? X.focusOn(cam, cl[id][0], cl[id][1]) : { focus: 10, cinf: 4 };
    return { light: orch ? SUN : ROOM, cam, dof, actors: [], fx };
  },
};
