// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why 500 men lifted a hotel with the guests inside" (story, inspired by the raising of Chicago, 1855–1860s;
// the Tremont House was jacked up with guests inside). Muddy street, six-storey brick hotel on jackscrews,
// a guest calmly pouring tea upstairs (interior set at x≈40), a sinking wagon, a "NO BOTTOM HERE" sign, a sewer trench (x≈-70).
import { TOTAL, LINES, wf } from './hotellift_timing.js';
import * as PR from '../props.js';
import * as D from './d19.js';
const { clamp, lerp, sm } = D;
export { TOTAL };
const L = LINES, W = wf;
let K, HOT, JACKS = [], CRIBS = [], CRACK = [], GUEST, BOSS, WK = [], CR = [], HORSE, WAGON, POT, STREAM, TEA, FRAME, PIGEONS = [];
const JX = []; for (let x = -7.2; x <= 7.25; x += 0.8) JX.push(x);
const WIDX = [2, 5, 8, 11, 14, 17];               // jacks that have a worker
const BOSS_O = { jacket: '#5a3a2a', pants: '#2a2a30', boots: '#1e1a18', hat: 'cowboy', hatColor: '#3a2a1e', moustache: '#2a1a12', vest: '#c8a050', tie: '#8a1a1a', belt: '#1a1a1a' };
const GUEST_O = { jacket: '#2a3a5a', pants: '#2a2a34', boots: '#111', hat: 'tophat', moustache: '#d8d0c0', bowtie: '#c0392b', vest: '#e8dcc0', glasses: true, skin: '#f6e0c8' };
const WK_O = [
  { jacket: '#3a6ea5', pants: '#3a2a1e', boots: '#2a1a12', hat: 'cap', cap: '#8a5a34', scarf: '#c0392b', gloves: '#c8a070', belt: '#3a2418' },
  { jacket: '#c8642a', pants: '#2c3e5a', boots: '#2a1a12', hat: 'beanie', hatColor: '#2a5a3a', vest: '#5a4030', gloves: '#5a4030', pockets: true },
  { jacket: '#e8d8b0', pants: '#4a3a2a', boots: '#3a2418', hairStyle: 'curly', hair: '#2a1a12', apron: '#8a6a4a', scarf: '#2a5aa0', moustache: '#2a1a12' },
  { jacket: '#5a7a3a', pants: '#2a2a30', boots: '#1e1a18', hat: 'cap', cap: '#c0392b', belt: '#1a1a1a', gloves: '#e0c090', collar: '#f4efe4' },
  { jacket: '#8a3a5a', pants: '#3a3a40', boots: '#2a1a12', hairStyle: 'spiky', hair: '#c87a3a', vest: '#2a2a30', scarf: '#f2c230' },
  { jacket: '#2a6a7a', pants: '#4a3a2a', boots: '#2a1a12', hat: 'hardhat', hatColor: '#e8b030', belt: '#5a3a24', pockets: true, gloves: '#8a6a4a' },
];
const CR_O = [
  { jacket: '#b83a3a', dress: '#b83a3a', pants: '#3a2a2a', hairStyle: 'bun', hair: '#5a3a24', scarf: '#f4efe4', collar: '#f4efe4', glasses: '#333' },
  { jacket: '#3a4a8a', pants: '#2a2a34', boots: '#111', hat: 'tophat', hatColor: '#4a3a2a', tie: '#e8b030', vest: '#8a7a5a', moustache: '#5a3a24' },
  { jacket: '#e0b040', pants: '#4a3a2a', hairStyle: 'ponytail', hair: '#2a1a12', dress: '#e0b040', apron: '#ffffff', scarf: '#8a3a8a' },
  { jacket: '#4a8a6a', pants: '#3a3a40', boots: '#3a2418', hat: 'cap', cap: '#3a4a6a', bowtie: '#c0392b', pockets: true, belt: '#2a1a12' },
];
const EXT = { az: 65, el: 52, sky: '#d8e8f4', ground: '#6a4a2e', hemi: 1.0, sun: '#fff0d8', sunI: 3.2, skyTop: '#3f80d0', skyHor: '#e6dccc', fog: '#e2e2dc', fogNear: 40, fogFar: 260,
  sat: 1.12, vig: 0.24, shadowExt: 18, exposure: 1.12, ink: 0.55, bloom: 0.6 };
const INT = { az: 65, el: 40, sky: '#8a7a6a', ground: '#4a3020', hemi: 0.75, sun: '#ffe8c8', sunI: 0.6, skyTop: '#3a2e24', skyHor: '#3a2e24', fog: '#3a2e24', fogNear: 9, fogFar: 30,
  sat: 1.1, vig: 0.3, shadowExt: 6, exposure: 1.3, ink: 0.55, bloom: 0.7, cardTint: '#fff0e0' };
const IX = 40; // interior origin

function build(k) {
  K = k; D.init(K); const { THREE } = K;
  const mud = K.mat('dirt', '#6a4a30', { detail: 1.6, amt: 0.5, bump: 0.02 });
  K.slab(-46, 46, -0.3, 0, -30, 40, mud, K.scene, false);
  for (const [x, z, r] of [[-3, 2.5, 1.6], [6, 6, 2.2], [-15, 4, 2.6], [12, 1.5, 1.4], [-9, 8, 1.8]]) { const p = K.add(new THREE.CircleGeometry(r, 28), K.toon({ color: '#5a4a3a', plain: true, roughness: 0.15, metalness: 0.1 }), x, 0.012, z); p.rotation.x = -Math.PI / 2; p.scale.y = 0.6; }
  // wheel ruts
  for (const z of [3.2, 4.6]) K.slab(-46, 46, 0.0, 0.02, z - 0.12, z + 0.12, K.mat('dirt', '#4a3420', { detail: 0.6 }), K.scene, false);
  // the hotel (group lifts)
  HOT = K.group();
  const fac = K.toon({ map: PR.facadeTex('#b8764e', 6, 6, 11, '#efe4d0'), kind: 'brick', amt: 0.12 });
  const side = K.mat('brick', '#a86a48', { detail: 1.4 });
  K.add(new THREE.BoxGeometry(16, 18, 10), [side, side, K.mat('metal', '#4a3a3a'), side, fac, side], 0, 9, -11, HOT);
  K.slab(-8.4, 8.4, 18, 18.6, -16.4, -5.6, K.mat('plaster', '#e8dcc4'), HOT);          // cornice
  K.slab(-8.1, 8.1, 0, 0.5, -16, -5.9, K.mat('rock', '#9a8a78'), HOT);                 // stone base course
  K.slab(-1.6, 1.6, 0.5, 3.2, -6.05, -5.9, K.mat('wood', '#5a3420'), HOT);              // door
  D.sign(7, 1.1, D.txtTex(1024, 160, '#1f3a2a', '#f2d27a', ['TREMONT HOUSE'], 'bold 110px Georgia, serif'), 0, 3.9, -5.88, 0, HOT);
  for (const x of [-6, 6]) { K.cyl(0.05, 0.05, 1.2, K.mat('metal', '#2a2a2a'), x, 18.6, -6.2, HOT); K.add(new THREE.PlaneGeometry(1.0, 0.6), K.toon({ color: '#c0392b', plain: true, side: THREE.DoubleSide }), x + 0.52, 19.5, -6.2, HOT); }
  // crack (segments appear one by one)
  let cx = 2.2, cy = 1.0;
  for (let i = 0; i < 14; i++) { const nx = cx + (i % 2 ? 0.35 : -0.3), ny = cy + 0.65; const seg = K.beam(new THREE.Vector3(cx, cy, -5.93), new THREE.Vector3(nx, ny, -5.93), 0.07, K.toon({ color: '#1a1210', plain: true }), HOT); seg.visible = false; CRACK.push(seg); cx = nx; cy = ny; }
  // jacks + timber cribs along the front edge
  for (const x of JX) {
    const g = K.group(); g.position.set(x, 0, -6.3);
    const crib = K.group(g); for (let j = 0; j < 8; j++) K.slab(-0.35, 0.35, j * 0.24, j * 0.24 + 0.22, -0.3 + (j % 2) * 0.1, 0.3 - (j % 2) * 0.1, K.mat('wood', '#8a6038', { detail: 0.5 }), crib);
    const base = K.slab(-0.22, 0.22, 0, 0.2, -0.22, 0.22, K.mat('wood', '#6a4428'), g);
    const screw = K.cyl(0.07, 0.07, 1, K.mat('metal', '#4a4a52', { roughness: 0.35 }), 0, 0, 0, g); screw.geometry.translate(0, 0.5, 0); screw.position.y = 0;
    const handle = K.group(g); K.slab(-0.45, 0.45, -0.025, 0.025, -0.025, 0.025, K.mat('metal', '#2a2a30'), handle);
    JACKS.push({ g, crib, base, screw, handle, x });
  }
  // street dressing: gas lamps, hitching posts, barrels, across-street buildings
  for (const [x, z] of [[2.4, 0.6], [-10.5, 0.4], [10.5, 0.8], [-22, 1.0]]) { K.cyl(0.06, 0.09, 3.4, K.mat('metal', '#2a3a2a'), x, 0, z); K.add(new THREE.BoxGeometry(0.35, 0.45, 0.35), K.toon({ color: '#fff2c0', plain: true, emissive: '#ffe6a0' }), x, 3.6, z); }
  for (const [x, z] of [[-11.5, -4.2], [-12.3, -3.6], [9.5, -4.5]]) { const b = K.cyl(0.35, 0.35, 0.9, K.mat('wood', '#8a5a34'), x, 0, z); b.name = 'barrel'; K.solid(b); }
  const cols = ['#c98a6a', '#d8c8a8', '#a86a5a', '#e0d0b0', '#b8a07a', '#9a6a5a'];
  for (let i = 0; i < 9; i++) { const x = -36 + i * 9, h = 8 + (i * 5) % 7; K.add(new THREE.BoxGeometry(8.4, h, 8), K.toon({ map: PR.facadeTex(cols[i % 6], 3, Math.round(h / 3), 30 + i, '#efe4d0'), kind: 'brick', amt: 0.1 }), x, h / 2, 21); }
  for (let i = 0; i < 4; i++) { for (const s of [-1, 1]) { const x = s * (14 + i * 9), h = 10 + i * 2; K.add(new THREE.BoxGeometry(8.4, h, 9), K.toon({ map: PR.facadeTex(cols[(i + 2) % 6], 3, Math.round(h / 3), 50 + i + s, '#efe4d0'), kind: 'brick', amt: 0.1 }), x, h / 2, -11); } }
  K.slab(-46, 46, 0, 0.18, 15.5, 17, K.mat('wood', '#9a7048', { detail: 0.8 }), K.scene, false); // far boardwalk
  const ruler = K.slab(-0.06, 0.06, 0, 1.4, -0.03, 0.03, K.toon({ map: PR.canvasTex(64, 512, (g, w, h) => { g.fillStyle = '#f2c230'; g.fillRect(0, 0, w, h); g.fillStyle = '#1a1a1a'; for (let y = 0; y < h; y += 16) g.fillRect(0, y, y % 64 ? 24 : 48, 3); }), plain: true })); ruler.position.set(-2.0, 0.7, -5.95);
  // "NO BOTTOM HERE" sign
  K.cyl(0.07, 0.08, 1.9, K.mat('wood', '#6a4428'), -13, -0.2, 2.9); D.sign(1.7, 0.75, D.txtTex(512, 224, '#e8dcc0', '#3a1a10', ['NO BOTTOM', 'HERE!'], 'bold 84px Georgia, serif'), -13, 1.45, 3.06, 0);
  // wagon (sinks) + horse
  WAGON = K.group(); WAGON.position.set(-20, 0, 6);
  K.slab(-1.4, 1.4, 0.55, 1.15, -0.75, 0.75, K.mat('wood', '#a87444', { detail: 0.6 }), WAGON);
  for (const [x, z] of [[-0.9, 0.8], [0.9, 0.8], [-0.9, -0.8], [0.9, -0.8]]) { const w = K.add(new THREE.TorusGeometry(0.42, 0.06, 8, 24), K.mat('wood', '#5a3a20'), x, 0.45, z, WAGON); }
  for (let i = 0; i < 4; i++) K.cyl(0.25, 0.25, 0.5, K.mat('wood', '#8a5a34'), -0.8 + i * 0.5, 1.15, 0, WAGON);
  HORSE = K.animal('horse', { seed: 4, color: '#8a5a34', scale: 1.0 });
  // sewer trench set (x≈-70)
  const SX = -70;
  K.slab(SX - 14, SX - 2, -3.2, 0.05, -10, 20, mud, K.scene, false); K.slab(SX + 2, SX + 14, -3.2, 0.05, -10, 20, mud, K.scene, false);
  K.slab(SX - 2, SX + 2, -3.4, -3.2, -10, 20, K.mat('dirt', '#4a3420'), K.scene, false);
  for (const s of [-1, 1]) for (let z = -8; z < 20; z += 2.2) K.slab(SX + s * 2 - 0.08, SX + s * 2 + 0.08, -3.2, 0.3, z, z + 0.2, K.mat('wood', '#7a5434'));
  const pipe = K.add(new THREE.CylinderGeometry(1.15, 1.15, 26, 40, 1, true).rotateX(Math.PI / 2), K.mat('brick', '#b05a3a', { detail: 0.8 }), SX, -2.0, 6); pipe.material.side = THREE.DoubleSide;
  for (let i = 0; i < 5; i++) { const h = 9 + i * 2; K.add(new THREE.BoxGeometry(8, h, 8), K.toon({ map: PR.facadeTex(cols[i], 3, 3, 70 + i, '#efe4d0'), kind: 'brick' }), SX + (i % 2 ? 9 : -9), h / 2, 22 - i * 10); }
  for (let i = 0; i < 6; i++) K.slab(SX + 2.4, SX + 2.9, 0.05, 0.3, 2 + i * 0.4, 2.3 + i * 0.4, K.mat('brick', '#b05a3a'));   // brick pile
  // interior (tea room)
  const wallp = K.toon({ map: PR.canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#7a3a3a'; g.fillRect(0, 0, w, h); g.fillStyle = '#e8c070'; for (let y = 0; y < h; y += 32) for (let x = (y / 32 % 2) * 16; x < w; x += 32) { g.beginPath(); g.arc(x, y, 4, 0, 7); g.fill(); } }, [4, 2]), kind: 'plaster', amt: 0.1 });
  K.slab(IX - 4, IX + 4, -0.1, 0, -4, 4, K.mat('wood', '#8a5a34', { detail: 0.6 }), K.scene, false);
  K.slab(IX - 4, IX + 4, 0, 3.6, -4.2, -4, wallp); K.slab(IX - 4.2, IX - 4, 0, 3.6, -4, 4, wallp); K.slab(IX + 4, IX + 4.2, 0, 3.6, -4, 4, wallp);
  K.slab(IX - 4, IX + 4, 3.6, 3.8, -4.2, 4, K.mat('plaster', '#e8dcc4'));
  K.add(new THREE.PlaneGeometry(1.6, 1.8), K.toon({ color: '#cfe6f8', plain: true, emissive: '#bcd8f0' }), IX - 1.2, 1.9, -3.98);
  for (const x of [-2.0, -0.4]) K.slab(IX + x - 0.08, IX + x + 0.08, 0.9, 2.9, -3.99, -3.9, K.mat('wood', '#e8dcc4'));
  K.slab(IX - 2.1, IX - 0.3, 0.9, 1.0, -3.99, -3.85, K.mat('wood', '#e8dcc4'));
  K.cyl(0.6, 0.6, 0.06, K.toon({ color: '#f4efe4', kind: 'fabric' }), IX, 0.72, 0.1); K.cyl(0.07, 0.12, 0.72, K.mat('wood', '#5a3420'), IX, 0, 0.1);
  K.slab(IX + 0.45, IX + 0.95, 0, 0.45, -0.1, 0.4, K.mat('wood', '#6a3a24'));     // chair seat
  K.slab(IX + 0.88, IX + 0.95, 0.45, 1.2, -0.1, 0.4, K.mat('wood', '#6a3a24'));
  POT = K.group(); POT.position.set(IX + 0.05, 1.0, 0.0);
  K.sphere(0.13, K.toon({ color: '#f4f4f0', plain: true, roughness: 0.2 }), 0, 0, 0, POT, 1, 0.85, 1);
  K.add(new THREE.CylinderGeometry(0.02, 0.035, 0.18, 12), K.toon({ color: '#f4f4f0', plain: true }), -0.15, 0.03, 0, POT).rotation.z = 1.0;
  K.add(new THREE.TorusGeometry(0.06, 0.015, 8, 16), K.toon({ color: '#3a6ea5', plain: true }), 0.14, 0.02, 0, POT);
  K.sphere(0.03, K.toon({ color: '#3a6ea5', plain: true }), 0, 0.12, 0, POT);
  K.cyl(0.05, 0.04, 0.07, K.toon({ color: '#ffffff', plain: true }), IX - 0.18, 0.75, 0.05); K.cyl(0.08, 0.08, 0.01, K.toon({ color: '#ffffff', plain: true }), IX - 0.18, 0.75, 0.05);
  TEA = K.cyl(0.046, 0.046, 0.005, K.toon({ color: '#a8642a', plain: true }), IX - 0.18, 0.8, 0.05);
  STREAM = K.cyl(0.008, 0.008, 1, K.toon({ color: '#b8743a', plain: true, emissive: '#3a1a08' }), IX - 0.18, 0.8, 0.05);
  for (const [x, z, c] of [[0.3, -0.2, '#e8b030'], [-0.35, 0.3, '#f4efe4']]) K.sphere(0.05, K.toon({ color: c, plain: true }), IX + x, 0.78, z); // biscuits, sugar
  FRAME = K.group(); FRAME.position.set(IX + 1.2, 2.6, -3.95); K.slab(-0.45, 0.45, -0.6, 0, 0, 0.04, K.mat('wood', '#c8a050'), FRAME); K.add(new THREE.PlaneGeometry(0.72, 0.45), K.toon({ color: '#4a7a9a', plain: true }), 0, -0.3, 0.05, FRAME);
  K.slab(IX + 2.4, IX + 3.6, 0, 1.6, -3.9, -3.3, K.mat('wood', '#6a3a24')); for (let i = 0; i < 4; i++) K.slab(IX + 2.5 + i * 0.27, IX + 2.7 + i * 0.27, 1.6, 1.9, -3.8, -3.5, K.toon({ color: ['#c0392b', '#2a5a8a', '#e8b030', '#3a7a3a'][i], kind: 'fabric' }));
  K.lamp(IX + 1.6, 1.9, 1.2, { intensity: 3.2, distance: 8, color: '#ffc880', glowS: 0.5 }); K.lamp(IX - 2.6, 2.6, -2.5, { intensity: 2.2, distance: 7, color: '#ffd8a0', glowS: 0.4 });
  K.dust([IX, 1.6, 0], [5, 2.5, 5], 90);
  // cast
  GUEST = K.stick(GUEST_O, { key: 'guest' }); BOSS = K.stick(BOSS_O, { key: 'boss' });
  WK = WK_O.map((o, i) => K.stick(o, { key: 'wk' + i })); CR = CR_O.map((o, i) => K.stick(o, { key: 'cr' + i }));
  PIGEONS = [0, 1, 2].map((i) => K.animal('pigeon', { seed: 20 + i }));
  K.addClouds(12, 700, 170);
}

function frame(f, Kk) {
  const T = K.T, fx = [];
  const HAIR1 = W(4, 'hair'), GROAN = W(5, 'groan'), CRK = W(5, 'crack'), WHIS = W(3, 'whistle'), LAST = W(11, 'whistle'), TALL = W(12, 'taller');
  const hairs = (f >= HAIR1 ? 1 : 0) + (f >= W(4, 'then') + 6 ? 1 : 0) + (f >= 516 ? 1 : 0);
  const DAYS = L[12][0] - 6;
  const lift = f < DAYS ? 0.62 + 0.012 * hairs + 0.004 * clamp((f - WHIS) / 60, 0, 1) - (f >= CRK && f < CRK + 8 ? 0.01 : 0) : 2.45;
  HOT.position.y = lift;
  CRACK.forEach((c, i) => { c.visible = f >= CRK - 2 + i * 1.2; });
  const turning = (f > WHIS && f < L[6][0]) || (f < WHIS) || f > L[13][0];
  JACKS.forEach((J, i) => { const ch = Math.max(0, lift - 0.62 - 0.05); J.crib.scale.y = Math.max(0.001, ch / 1.9); J.crib.visible = ch > 0.05;
    const top = f >= DAYS ? Math.min(lift, ch) : 0; J.base.position.y = top; const sl = Math.max(0.05, lift - top - 0.2); J.screw.position.y = top + 0.2; J.screw.scale.y = sl;
    J.handle.position.y = top + 0.2 + sl * 0.45; J.handle.rotation.y = turning ? f * 0.12 + i : i; });
  // ---------- acting ----------
  const wkPos = (i) => [JX[WIDX[i]] - 0.6, -5.35];
  const panic = [GROAN - 3, 'scared', { expr: 'scared' }];
  WK.forEach((r, i) => {
    let keys = D.pump(0, GROAN - 3, 11 + (i % 3), ['push', { expr: i % 2 ? 'stern' : 'pained' }], ['crouch', { expr: 'pained' }]);
    keys.push(panic, [GROAN + 20 + i, 'crouch', { expr: 'nervous' }]);
    keys = keys.concat(D.pump(L[6][0] + 10, DAYS, 12, ['push', { expr: 'pained', sweat: true }], ['crouch', { expr: 'nervous' }]));
    keys.push([DAYS, 'cheer', { expr: 'excited' }], [W(13, 'guests') - 6, 'celebrate', { expr: 'laugh' }]);
    keys = keys.concat(D.pump(L[13][0] + 30, TOTAL, 11, ['push', { expr: 'pained' }], ['crouch', { expr: 'stern' }]));
    if (i === 4) keys = keys.filter((k) => k[0] < L[10][0] - 4 || k[0] > L[11][0] - 4).concat([[L[10][0] - 4, 'hammer', { expr: 'stern' }]]).sort((a, b) => a[0] - b[0]);
    const [x, z] = wkPos(i);
    if (i === 4 && f >= L[10][0] - 4 && f < L[11][0] - 4) { D.act(K, r, f, [[0, 'hammer', { expr: 'stern' }], [W(10, 'sewers') - 4, 'show', { expr: 'proud' }]], 30 + i, { x: -70 + 0.4, z: 4.0, yaw: -Math.PI / 2 }); return; }
    D.act(K, r, f, keys, 30 + i, { x, z, yaw: Math.PI / 2 });
  });
  const bossKeys = [[0, 'pointUp', { expr: 'stern' }], [L[1][0], 'cross', { expr: 'stern', sweat: true }], [L[2][0] + 10, 'angry', { expr: 'angry' }],
    [WHIS - 8, 'hold', { expr: 'whistle', R: [0.12, -0.55] }], [WHIS + 18, 'pointUp', { expr: 'yell', talk: true }], [W(4, 'hotel') - 2, 'hips', { expr: 'proud' }],
    [GROAN - 3, 'shock', { expr: 'scared' }], [CRK + 6, 'panic', { expr: 'nervous', sweat: true }], [L[7][0] - 4, 'think', { expr: 'confused' }],
    [L[8][0] - 4, 'point', { expr: 'stern' }], [L[9][0] - 4, 'shrug', { expr: 'sad' }], [L[10][0] - 4, 'idea', { expr: 'excited' }],
    [LAST - 8, 'hold', { expr: 'whistle', R: [0.12, -0.55], sweat: true }], [DAYS, 'celebrate', { expr: 'laugh' }], [L[13][0] + 30, 'hips', { expr: 'grin' }]];
  D.act(K, BOSS, f, bossKeys, 3, { x: -9.4, z: -3.0, yaw: 0.85 });
  // guest: pours tea, sips, oblivious
  const gKeys = [[0, 'reach', { expr: 'smile', look: -0.3 }], [W(1, 'tea') + 30, 'reach', { expr: 'whistle' }], [L[6][0] + 40, 'reach', { expr: 'smile' }],
    [L[12][0] + 30, 'drink', { expr: 'smile', item: 'cup' }], [L[13][0] + 6, 'drink', { expr: 'relief' }], [W(13, 'nobody'), 'hold', { R: [0.3, 0.3, 'cup'], expr: 'grin', look: 0.4 }]];
  D.act(K, GUEST, f, gKeys, 7, { x: IX + 0.7, z: 0.15, yaw: -Math.PI / 2, seat: 0.45 });
  const pour = f < L[12][0] + 26; POT.rotation.z = pour ? 0.55 - 0.05 * Math.sin(f / 9) : 0; POT.scale.setScalar(0.65); POT.position.set(IX + (pour ? -0.02 : 0.25), pour ? 0.95 : 0.84, pour ? 0.02 : -0.25);
  STREAM.visible = pour; STREAM.scale.y = 0.12; STREAM.position.set(IX - 0.165, 0.87, 0.04);
  TEA.position.y = 0.76 + 0.045 * clamp(f / 1100, 0, 1);
  FRAME.rotation.z = f >= GROAN && f < L[8][0] ? 0.08 * Math.sin((f - GROAN) / 4) * Math.exp(-(f - GROAN) / 60) : 0;
  // crowd: laugh, then sprint away; one reads the sign later
  CR.forEach((r, i) => {
    const home = [[2.2 + i * 1.1, 3.6 + (i % 2) * 0.6]][0];
    const run = K.walkPath(f, W(6, 'sprint') - 4 + i * 2, [home, [home[0] + 3, home[1] + 3.5], [home[0] + 28, home[1] + 4]], 3.0);
    let keys = [[0, 'cross', { expr: 'confused' }], [W(2, 'laughed') - 4, i % 2 ? 'clap' : 'point', { expr: 'laugh', talk: i === 0 }], [W(2, 'screws') - 3, i % 2 ? 'facepalm' : 'pointL', { expr: 'laugh' }],
      [WHIS, 'lookAround', { expr: 'confused' }], [W(4, 'rises') , 'shock', { expr: 'shock' }], [GROAN - 3, 'panic', { expr: 'scared' }]];
    if (run.moving) keys = [[0, 'run', { expr: 'scared' }]];
    if (f >= L[7][0] - 4) {
      if (i === 2) { D.act(K, r, f, [[0, 'think', { expr: 'confused' }], [W(9, 'no') - 3, 'shock', { expr: 'shock' }], [W(9, 'here') + 8, 'facepalm', { expr: 'dazed' }]], 40 + i, { x: -14.4, z: 3.8, yaw: f < W(9, 'no') - 3 ? 2.3 : 0.5 }); return; }
      if (f >= DAYS) { D.act(K, r, f, [[0, 'cheer', { expr: 'excited' }], [DAYS + 20 + i * 3, 'clap', { expr: 'laugh' }]], 40 + i, { x: -3 + i * 1.6, z: 1.4 + (i % 2) * 0.8, yaw: Math.PI }); return; }
      r.root.visible = false; return;
    }
    D.act(K, r, f, keys, 40 + i, { x: run.x, z: run.z, yaw: run.moving || run.done ? run.yaw : Math.PI + 0.15 * (i - 1.5) });
    if (run.moving) K.puff(f, Math.floor(f / 8) * 8, run.x, run.z, 4, 0.25, '#8a6a4a');
  });
  // wagon sinks, horse struggles
  const sink = sm(L[8][0] - 30, W(8, 'vanished') + 20, f); WAGON.position.y = -0.15 - 0.75 * sink; WAGON.rotation.z = 0.08 * sink;
  HORSE.set(f, { x: -17.3, y: -0.3, z: 6, yaw: Math.PI / 2, mode: f > L[8][0] - 20 && f < L[10][0] ? 'walk' : 'stand', speed: 1.4, expr: sink > 0.3 ? 'shock' : 'neutral', look: 0.3 * Math.sin(f / 13) });
  if (f > L[8][0]) K.puff(f, Math.floor(f / 10) * 10, -17 + (Math.floor(f / 10) % 2) * 0.4, 6.2, 5, 0.35, '#5a3a20');
  // pigeons on the cornice flap off at the crack, return later
  PIGEONS.forEach((p, i) => { const fly = f >= CRK && f < CRK + 70; const t = (f - CRK) / 30;
    p.set(f, { x: -2 + i * 1.3 + (fly ? t * 3 : 0), y: lift + 18.6 + (fly ? t * 2.5 : 0), z: -6.3 + (fly ? t * 3 : 0), yaw: fly ? 0.8 : 0.2 * i, mode: fly ? 'run' : 'stand', flap: fly, look: 0.4 * Math.sin(f / 9 + i) }); });
  // dust under the jacks when the hotel creaks / lands
  if (f >= GROAN) for (let i = 0; i < 4; i++) K.puff(f, GROAN + i * 6, JX[i * 5] , -6.0, 5, 0.4, '#a08060');
  if (f >= DAYS) for (let i = 0; i < 4; i++) K.puff(f, DAYS + i * 4, JX[i * 5 + 1], -5.8, 6, 0.45, '#b09070');
  // ---------- shots ----------
  const wp = (i) => wkPos(i), sh = (f0, amp = 0.05, d = 12) => K.shake(f, f0, amp, d);
  const S = [
    [0, (u) => { const [x, z] = wp(2); return { pos: [x + 2.3, 0.75, z + 2.3], look: [x + 0.15, 0.7, z - 0.3], fov: 44, cinf: 12 }; }],
    [56, (u) => ({ pos: [5, lerp(1.6, 3.6, u), 10], look: [0, lerp(3.5, 7, u), -6], fov: 52, cinf: 5 })],
    [L[1][0] - 4, (u) => ({ pos: [IX - 0.6, 1.3, 1.05], look: [IX - 0.06, 0.9, 0.03], fov: 36, cinf: 18, light: INT }), { whip: true }],
    [W(1, 'if') - 4, (u) => { const [s1, s2] = sh(W(1, 'slips'), 0.03, 10); return { pos: [3.05 + s1, 0.42 + s2, -5.0], look: [2.4, lift - 0.1, -6.3], fov: 38, cinf: 16 }; }, { whip: true }],
    [W(1, 'six') - 3, (u) => ({ pos: [0.5, 0.35, -0.5], look: [0, lerp(8, 13, u), -6], fov: 56 * K.punch(f, W(1, 'fall'), 0.15, 6) , cinf: 3, noPush: true })],
    [L[2][0] - 4, (u) => ({ pos: [lerp(3.0, 3.8, u), 1.55, -1.6], look: [3.6, 1.35, 4.0], fov: 40, focus: 5.6, cinf: 12 }), { whip: true }],
    [W(2, 'lift') - 3, (u) => ({ pos: [2.5, 1.55, 1.6], look: [2.2, 1.45, 3.6], fov: 36, cinf: 14 })],
    [L[3][0] - 4, (u) => ({ pos: [-7.7, 1.5, -1.6], look: [-9.4, 1.5, -3.0], fov: 36 * K.punch(f, WHIS, 0.22, 6), cinf: 14, noPush: true }), { whip: true }],
    [W(3, 'every') - 4, (u) => ({ pos: [lerp(-6.5, 3, u), 1.0, -2.7], look: [lerp(-7.2, 2.2, u), 0.65, -5.6], fov: 44, cinf: 8 })],
    [L[4][0] - 4, (u) => ({ pos: [-1.2, lift + 0.35, -4.3], look: [-2.3, lift - 0.1, -6.2], fov: 34, cinf: 16 })],
    [W(4, 'then') - 4, (u) => { const [x, z] = wp(4); return { pos: [x + 1.6, 0.95, z + 1.3], look: [x + 0.1, 0.8, z], fov: 36, cinf: 14 }; }],
    [L[5][0] - 4, (u) => { const [s1, s2] = sh(GROAN, 0.06, 14), [s3, s4] = sh(CRK, 0.08, 14); return { pos: [4.2 + s1 + s3, 2.2 + s2 + s4, 0.8], look: [2.4, lerp(2.5, 7.5, sm(CRK - 4, CRK + 25, f)), -6], fov: 44 * K.punch(f, CRK, 0.25, 6), cinf: 6, noPush: true }; }],
    [L[6][0] - 4, (u, g) => { const at = (h) => { const r = K.walkPath(h, W(6, 'sprint') - 2, [[3.3, 4.2], [6.3, 7.7], [31.3, 8.2]], 3.0); return [r.x, 0, r.z]; }; const t = K.track(f, at, { off: [5.5, 1.3, 2.2], lag: 6, lookY: 1.0 }); return { pos: t.pos, look: t.look, fov: 44, cinf: 8 }; }, { whip: true }],
    [W(6, 'man') - 4, (u) => ({ pos: [IX - 1.5, 1.45, 2.3], look: [IX + 0.55, 1.05, 0.1], fov: 40, cinf: 12, light: INT }), { whip: true }],
    [L[7][0] - 4, (u) => ({ pos: [lerp(-6.4, -6.9, u), 0.9, -1.0], look: [-9.4, 1.6, -3.0], fov: 38, cinf: 10 }), { whip: true }],
    [L[8][0] - 4, (u) => ({ pos: [lerp(-6, -9, u), lerp(10, 7, u), 13], look: [-15, 0, 3], fov: 50, cinf: 4 })],
    [W(8, 'mud') - 4, (u) => ({ pos: [lerp(-14.4, -15.0, u), 1.4, 10.4], look: [-17.8, 0.7, 5.9], fov: 40, cinf: 10 })],
    [L[9][0] - 4, (u) => ({ pos: [-11.3, 1.55, 6.9], look: [-13.4, 1.35, 3.4], fov: 40, cinf: 10 })],
    [W(9, 'big') - 3, (u) => ({ pos: [-12.9, 1.45, 6.2], look: [-13, 1.45, 3.06], fov: 42 * K.punch(f, W(9, 'no'), 0.15, 6), cinf: 16, noPush: true })],
    [L[10][0] - 4, (u) => ({ pos: [-70 + lerp(5, 3.5, u), lerp(4.5, 3.0, u), -4], look: [-70, -1.6, 5], fov: 48, cinf: 5 }), { whip: true }],
    [W(10, 'build') - 4, (u) => ({ pos: [-70 + 2.2, 1.0, 5.6], look: [-70 + 0.4, 0.9, 4.0], fov: 38, cinf: 14 })],
    [L[11][0] - 4, (u) => ({ pos: [-7.8, 1.65, -1.1], look: [-9.4, 1.7, -3.0], fov: 36 * K.punch(f, LAST, 0.2, 6), cinf: 16, noPush: true }), { whip: true }],
    [L[12][0] - 4, (u) => { const [s1, s2] = sh(DAYS + 2, 0.08, 14); return { pos: [-3 + s1, 1.2 + s2, 9], look: [0, 7.5, -6], fov: 54, cinf: 4 }; }],
    [W(12, 'tea') - 4, (u) => ({ pos: [IX - 0.42, 1.0, 0.55], look: [IX - 0.17, 0.79, 0.05], fov: 32, cinf: 20, light: INT }), { whip: true }],
    [L[13][0] - 4, (u) => ({ pos: [IX - 0.9, 1.3, 1.25], look: [IX + 0.7, 1.15, 0.15], fov: 38, cinf: 12, light: INT })],
    [W(13, 'bothered') - 4, (u) => { const [x, z] = wp(1); return { pos: [x + 1.6, 0.5, z + 1.7], look: [x + 0.35, 0.75, z - 0.6], fov: 42, cinf: 14 }; }, { whip: true }],
  ];
  const R = D.runShots(S, f, TOTAL), cam = R.cam;
  if (R.id === 1) D.card(fx, f, 70, '500 MEN', cam, '#f6c83a', 190, 40, 0.3);
  if (R.id === 9) D.card(fx, f, HAIR1, '+1 HAIR', cam, '#ffffff', 180, 60, 0.45);
  if (R.id === 22) D.card(fx, f, W(12, 'six'), '+6 FEET', cam, '#f6c83a', 200, 50, 0.3);
  const indoor = R.light === INT;
  return { light: indoor ? INT : EXT, cam, dof: R.dof, actors: [], fx };
}
export default { TOTAL, look: 'rich', build, frame };
