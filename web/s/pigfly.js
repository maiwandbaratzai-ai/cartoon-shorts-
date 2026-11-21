// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why did John Moore-Brabazon tie a pig to his plane's wing?" (story, inspired by 4 Nov 1909, Isle of Sheppey, England:
// the aviator flew a piglet in a wicker basket tied to a wing strut, with a sign "I am the first pig to fly", to answer
// the old saying "pigs might fly".)
// Set: a grassy airfield by the sea with sheds, a windsock, a roped-off crowd, sheep, and a box-kite biplane.
import { TOTAL, LINES, wf } from './pigfly_timing.js';
import * as PR from '../props.js';
import * as D from './d19.js';
import * as X from './kit3d.js';
const { clamp, lerp, sm } = D;
export { TOTAL };
const L = LINES, W = wf;
let K, PLANE, PROP, PIG, PIG2, SOCK, SHEEP = [], HAT;
let JOHN, MECH, GENT, LADY, F1, F2, F3;
const JOHN_O = { jacket: '#7a4a2a', pants: '#4a3a2a', boots: '#2a1a12', hat: 'pilot', hatColor: '#5a3a24', glasses: '#2a2a2a', scarf: '#ffffff', gloves: '#3a2a1a', moustache: '#3a2418' };
const MECH_O = { jacket: '#3a5a7a', pants: '#3a5a7a', hat: 'cap', cap: '#c0392b', apron: '#5a4a3a', gloves: '#c8a060', pockets: true };
const GENT_O = { jacket: '#5a5a64', pants: '#2a2a30', boots: '#111', hat: 'tophat', hatColor: '#1a1a1a', glasses: true, bowtie: '#c0392b', vest: '#e8d8b0', moustache: '#8a8a8a' };
const LADY_O = { jacket: '#c86a9a', dress: '#c86a9a', hairStyle: 'bun', hair: '#5a3a24', scarf: '#f2f2f2', collar: '#ffffff', gloves: '#ffffff' };
const F1_O = { jacket: '#4a7a3a', pants: '#3a2a1e', hat: 'cowboy', hatColor: '#c8a060', scarf: '#e05a3a', vest: '#8a5a34' };
const F2_O = { jacket: '#e8b830', pants: '#2c3e5a', hairStyle: 'curly', hair: '#2a1a12', tie: '#1f2a4a', pockets: true, glasses: '#333' };
const F3_O = { jacket: '#2a6a7a', dress: '#2a6a7a', hairStyle: 'long', hair: '#e8c060', apron: '#f4efe4', scarf: '#c0392b' };
const DAY = { az: 70, el: 34, sky: '#d8e8f4', ground: '#6a9a4a', hemi: 1.0, sun: '#fff0d8', sunI: 3.2, skyTop: '#3f7ad0', skyHor: '#e8eef2', fog: '#dde8ee', fogNear: 70, fogFar: 320,
  sat: 1.15, vig: 0.24, shadowExt: 16, exposure: 1.12, ink: 0.55, bloom: 0.6 };
const T0 = LINES[10][0] - 4;   // takeoff
const LAND = 98;
// flight: g = frames since takeoff -> { p:[x,y,z], th (heading), roll }
function flight(g) {
  if (g <= 0) return { p: [10, 0, 0], th: 0, roll: 0 };
  if (g < 30) { const t = g / 30; return { p: [10 + 18 * t, Math.max(0, (t - 0.45) / 0.55) * 4, 0], th: 0, roll: 0, pitch: t > 0.45 ? 0.12 : 0 }; }
  if (g < 80) { const ph = (g - 30) / 50 * Math.PI * 2; return { p: [28 + 12 * Math.sin(ph), 4 + 2.5 * Math.sin(ph / 2), -12 + 12 * Math.cos(ph)], th: -ph, roll: 0.35 * Math.sin(Math.min(1, ph) * 1.57) * Math.min(1, (2 * Math.PI - ph) * 1.5), pitch: 0 }; }
  const t = clamp((g - 80) / 18, 0, 1); const p = [28 + 14 * t, 4 * (1 - t) * (1 - t), 0];
  if (g > LAND) { const r = Math.min(1, (g - LAND) / 20); p[0] = 42 + 4 * (1 - (1 - r) * (1 - r)); }
  return { p, th: 0, roll: 0, pitch: t < 1 ? -0.05 : 0 };
}
function biplane() {
  const { THREE } = K; const g = K.group(); const cloth = K.mat('fabric', '#f2ead8', { detail: 0.4 }), wood = K.mat('wood', '#8a5a34'), dark = K.mat('metal', '#2a2a2a');
  for (const y of [1.6, 3.2]) K.slab(-0.9, 0.9, y, y + 0.08, -5, 5, cloth, g);
  for (const z of [-2.5, 0.0, 2.5]) for (const x of [-0.8, 0.8]) K.slab(x - 0.03, x + 0.03, 1.66, 3.2, z - 0.03, z + 0.03, wood, g);
  K.slab(0.6, 3.2, 1.75, 2.45, -0.4, 0.4, K.mat('wood', '#a8783a', { detail: 0.5 }), g);              // nacelle
  K.slab(1.1, 1.8, 2.45, 2.5, -0.35, 0.35, K.mat('fabric', '#5a2a1a'), g);
  for (const z of [-0.6, 0.6]) { K.beam(new THREE.Vector3(-0.8, 2.0, z), new THREE.Vector3(-6.2, 2.0, z * 1.6), 0.035, wood, g); K.beam(new THREE.Vector3(-0.8, 3.0, z), new THREE.Vector3(-6.2, 2.6, z * 1.6), 0.03, wood, g); }
  for (const y of [1.9, 2.9]) K.slab(-7.4, -5.6, y, y + 0.06, -1.1, 1.1, cloth, g); for (const z of [-1.1, 1.1]) K.slab(-7.4, -5.6, 1.9, 2.96, z - 0.02, z + 0.02, cloth, g);
  K.slab(-7.6, -7.3, 2.0, 2.9, -0.03, 0.03, K.mat('fabric', '#c0392b'), g);                             // rudder
  K.slab(2.9, 3.6, 2.0, 2.06, -1.0, 1.0, cloth, g);                                                       // front elevator
  for (const z of [-0.8, 0.8]) { const w = K.add(new THREE.TorusGeometry(0.32, 0.07, 6, 18), dark, 1.6, 0.32, z, g); K.beam(new THREE.Vector3(1.6, 0.32, z), new THREE.Vector3(1.3, 1.7, z * 0.5), 0.03, dark, g); }
  K.add(new THREE.TorusGeometry(0.2, 0.05, 6, 14), dark, -6.4, 0.22, 0, g); K.beam(new THREE.Vector3(-6.4, 0.22, 0), new THREE.Vector3(-6.2, 1.9, 0), 0.03, dark, g);
  K.slab(-1.2, -0.6, 2.0, 2.6, -0.3, 0.3, dark, g);                                                       // engine
  PROP = K.group(g); PROP.position.set(-1.35, 2.3, 0); K.slab(-0.04, 0.04, -1.1, 1.1, -0.09, 0.09, K.mat('wood', '#6a3a1a'), PROP);
  // wicker basket on the right wing + its sign
  const bk = K.group(g); bk.position.set(0.1, 1.68, 3.6); K.cyl(0.36, 0.3, 0.42, K.mat('wood', '#c8a060', { detail: 0.08, amt: 0.4 }), 0, 0, 0, bk, 16);
  K.add(new THREE.TorusGeometry(0.36, 0.03, 6, 20), K.mat('wood', '#a8803a'), 0, 0.42, 0, bk).rotation.x = Math.PI / 2;
  for (const s of [-1, 1]) K.beam(new THREE.Vector3(s * 0.3, 0.4, 0), new THREE.Vector3(s * 0.7, 1.5, -0.03), 0.012, K.mat('fabric', '#d8c8a0'), bk);   // ropes to the strut
  const sg = D.sign(0.9, 0.42, D.txtTex(400, 190, '#f4f0e0', '#1a1a1a', ['I AM THE FIRST', 'PIG TO FLY'], 'bold 50px Georgia'), 0, 0.2, 0.39, 0, bk, 'plaster'); sg.rotation.x = -0.15;
  return g;
}
function build(k) {
  K = k; D.init(K); X.init(K); const { THREE } = K; const r = X.rnd(17);
  K.slab(-300, 300, -0.3, 0, -80, 300, K.mat('grime', '#6aa84a', { amt: 0.55, detail: 2 }), K.scene, false);
  K.slab(-300, 300, -0.6, -0.4, -500, -80, K.mat('grime', '#3a7ab8', { amt: 0.3, roughness: 0.12 }), K.scene, false);    // the sea
  K.slab(-300, 300, -0.4, 0.0, -84, -80, K.mat('dirt', '#c8b890', { detail: 0.8 }), K.scene, false);
  K.slab(-5, 70, 0, 0.025, -2.2, 2.2, K.mat('dirt', '#9aa860', { detail: 0.8, amt: 0.5 }), K.scene, false);                // mown strip
  K.slab(3, 6, 0.0, 0.035, 4.0, 6.0, K.mat('dirt', '#5a3a22', { roughness: 0.15 }), K.scene, false);                       // mud puddle
  // sheds
  for (const [x, z, c] of [[-14, -14, '#8a3a2a'], [-3, -16, '#3a5a7a'], [8, -17, '#7a6a4a']]) { const h = K.group(); h.position.set(x, 0, z);
    K.slab(-4.5, 4.5, 0, 5, -3, 3, K.mat('wood', c, { detail: 1.2 }), h); const rf = K.add(new THREE.CylinderGeometry(3.2, 3.2, 9.2, 16, 1, false, 0, Math.PI), K.mat('metal', '#8a8a8a', { detail: 0.6 }), 0, 5, 0, h); rf.rotation.z = Math.PI / 2; rf.scale.set(1, 1, 0.95);
    K.slab(-3, 3, 0, 4.2, 3.0, 3.06, K.mat('wood', '#2a2a2a'), h); }
  D.sign(6, 0.9, D.txtTex(800, 120, '#f2ece0', '#8a2a1a', ['SHEPPEY AERO SHEDS'], 'bold 74px Georgia'), -3, 5.6, -12.9, 0, K.scene, 'wood');
  // windsock
  K.cyl(0.06, 0.08, 6, K.mat('metal', '#d8d8d8'), 16, 0, -6); SOCK = K.group(); SOCK.position.set(16, 5.8, -6);
  for (let i = 0; i < 5; i++) { const c = K.add(new THREE.CylinderGeometry(0.32 - i * 0.04, 0.28 - i * 0.04, 0.5, 14, 1, true), K.toon({ color: i % 2 ? '#ffffff' : '#ff6a1a', plain: true, side: THREE.DoubleSide }), -0.5 * i - 0.25, 0, 0, SOCK); c.rotation.z = Math.PI / 2; }
  // crowd rope + posts, bunting, a flag
  for (let x = -6; x <= 26; x += 2) K.cyl(0.05, 0.05, 1.0, K.mat('wood', '#5a3a24'), x, 0, 7.0); K.slab(-6, 26, 0.85, 0.9, 6.98, 7.02, K.mat('fabric', '#c0392b'));
  for (let i = 0; i < 4; i++) X.tree(-20 + i * 14 + r() * 4, 22 + r() * 8, 1.5 + r(), K.mat('wood', '#5a3a24'), K.mat('grime', ['#4a8a3a', '#5a9a40'][i % 2], { amt: 0.5, bump: 0.05 }), K.scene, r);
  for (let i = 0; i < 10; i++) X.tree(-60 + i * 13 + r() * 5, -28 - r() * 12, 1.3 + r() * 0.8, K.mat('wood', '#5a3a24'), K.mat('grime', ['#4a8a3a', '#5a9a40', '#3a7a30'][i % 3], { amt: 0.5, bump: 0.05 }), K.scene, r);
  for (let i = 0; i < 6; i++) { const s = K.animal('sheep', { seed: 40 + i }); s.root.position.set(50 + (i % 3) * 3, 0, -18 - Math.floor(i / 3) * 3); SHEEP.push(s); }
  // a bench + tool chest by the plane
  K.slab(-3.2, -2.2, 0, 0.7, 2.6, 3.4, K.mat('metal', '#c0392b')); K.slab(-3.25, -2.15, 0.7, 0.78, 2.55, 3.45, K.mat('metal', '#8a2a1a'));
  for (let i = 0; i < 3; i++) PR.crate(K, ['PETROL', 'SPARES', 'OIL'][i], '#8a5a34', K.scene).position.set(-5.5 + i * 0.95, 0, -2.8);
  PLANE = biplane();
  PIG = K.animal('pig', { seed: 3, scale: 0.42, parent: PLANE }); PIG2 = K.animal('pig', { seed: 3, scale: 0.42 });
  HAT = K.group(); K.cyl(0.13, 0.13, 0.26, K.toon({ color: '#1a1a1a', plain: true }), 0, 0, 0, HAT); K.cyl(0.2, 0.2, 0.02, K.toon({ color: '#1a1a1a', plain: true }), 0, 0, 0, HAT); HAT.visible = false;
  JOHN = K.stick(JOHN_O, { key: 'john' }); PLANE.add(JOHN.root);
  MECH = K.stick(MECH_O, { key: 'mech' }); GENT = K.stick(GENT_O, { key: 'gent' }); LADY = K.stick(LADY_O, { key: 'lady' });
  F1 = K.stick(F1_O, { key: 'f1' }); F2 = K.stick(F2_O, { key: 'f2' }); F3 = K.stick(F3_O, { key: 'f3' });
  K.addClouds(14, 700, 170);
}
function frame(f) {
  const fx = [];
  const COUGH = W(3, 'coughs'), WIND = W(6, 'wind'), WOB = L[7][0] - 4, LANDF = T0 + LAND, OUT0 = L[11][0] - 4, END0 = L[12][0] - 4;
  // ---- the plane: flash-forward in the air (frame 0 / ending), on the ground, then the real flight ----
  const ff = f < L[1][0] - 4 || f >= END0;
  let st;
  if (ff) st = flight(f < END0 ? 40 + f * 0.35 : 40 + (f - TOTAL) * 0.35 + 30);
  else if (f < T0) { const taxi = f >= WOB ? sm(WOB, T0, f) * 0 + (f - WOB) * 0.0 : 0; st = { p: [10, 0, 0], th: 0, roll: f >= WOB ? 0.06 * Math.sin(f * 0.45) : f >= WIND ? 0.02 * Math.sin(f * 0.6) : 0, pitch: 0 }; }
  else st = flight(f - T0);
  PLANE.position.set(...st.p); PLANE.rotation.set(0, 0, 0); PLANE.rotation.order = 'YXZ'; PLANE.rotation.set(st.roll, st.th, st.pitch || 0);
  const engineOn = f >= COUGH; PROP.rotation.x = engineOn ? f * 1.3 : 0.4;
  // pilot in the nacelle (local coordinates)
  D.act(K, JOHN, f, [[0, 'grab', { expr: 'grin', R: [0.4, 0.2, 'fist'], L: [0.4, 0.25, 'fist'] }], [L[1][0] - 4, 'wave', { expr: 'proud' }], [L[3][0] - 4, 'grab', { expr: 'nervous', sweat: true, R: [0.4, 0.2, 'fist'], L: [0.4, 0.25, 'fist'] }],
    [W(4, 'laughs'), 'hips', { expr: 'stern' }], [L[6][0] - 4, 'grab', { expr: 'scared', R: [0.4, 0.2, 'fist'], L: [0.4, 0.25, 'fist'] }], [L[8][0] - 4, 'grab', { expr: 'nervous', sweat: true, R: [0.4, 0.2, 'fist'], L: [0.4, 0.25, 'fist'] }],
    [T0, 'grab', { expr: 'excited', R: [0.4, 0.2, 'fist'], L: [0.4, 0.25, 'fist'] }], [W(10, 'lands'), 'cheer', { expr: 'laugh' }], [OUT0 + 30, 'wave', { expr: 'laugh' }], [END0, 'grab', { expr: 'grin', R: [0.4, 0.2, 'fist'], L: [0.4, 0.25, 'fist'] }]], 2,
    { x: 1.45, y: 1.75, z: 0, yaw: Math.PI / 2, seat: 0.38 });
  // the piglet in its basket (local), then out on the grass
  const out = f >= OUT0 && f < END0;
  if (!out) { PIG.root.visible = true; PIG.set(f, { x: 0.1, z: 3.6, yaw: Math.PI / 2 + 0.3 * Math.sin(f / 30), mode: f >= W(6, 'squealing') - 4 && f < T0 ? 'jump' : 'stand', expr: f >= L[3][0] - 4 && f < T0 ? (f >= WIND ? 'shock' : 'neutral') : 'happy', look: 0.3 * Math.sin(f / 18) });
    PIG.root.position.y = 1.98 + (f >= W(6, 'squealing') - 4 && f < T0 ? 0.04 * Math.abs(Math.sin(f * 0.6)) : 0); PIG2.root.visible = false; }
  else { PIG.root.visible = false; const t = clamp((f - OUT0) / 40, 0, 1); PIG2.set(f, { x: 46 + 0.1 + 2.2 * t, z: 3.6 + 2.2 * t, yaw: 0.8, mode: t < 1 ? 'run' : 'wag', expr: 'happy' }); PIG2.root.position.y = Math.max(0, 1.72 * (1 - t * 3)); if (f % 6 === 0 && t < 1) K.puff(f, f, PIG2.root.position.x, PIG2.root.position.z, 2, 0.15); }
  // dust: takeoff roll, landing
  if (f >= T0 && f < T0 + 18 && f % 3 === 0) K.puff(f, f, PLANE.position.x - 1, 0, 4, 0.35, '#c8c098');
  if (f >= LANDF - 2 && f < LANDF + 20) K.puff(f, LANDF - 2, 41.5, 0, 12, 0.5, '#c8c098');
  if (f >= COUGH - 2 && f < COUGH + 24) for (let k = 0; k < 3; k++) K.puff(f, COUGH - 2 + k * 6, 9.0, 0.0, 5, 0.4, '#3a3a3a');
  // ---- the mechanic swings the prop (lines 3) ----
  if (f >= L[2][0] && f < L[5][0]) D.act(K, MECH, f, [[0, 'push', { expr: 'stern' }], [COUGH - 6, 'throwBack', { expr: 'stern' }], [COUGH - 2, 'throw', { expr: 'shock' }], [COUGH + 10, 'shock', { expr: 'scared' }], [L[4][0], 'shrug', { expr: 'pained' }]], 3, { x: 7.6, z: 1.2, yaw: Math.PI / 2 });
  else D.act(K, MECH, f, [[0, 'cross', { expr: 'nervous' }], [OUT0, 'cheer', { expr: 'laugh' }]], 3, { x: -1.5, z: 5.6, yaw: Math.PI + 0.3 });
  // ---- the crowd behind the rope ----
  const crowdK = (i) => [[0, 'point', { expr: 'grin' }], [W(4, 'laughs') - 3 + i, 'laugh', { expr: 'laugh' }], [W(4, 'barely') + i, 'clap', { expr: 'laugh' }], [WIND, 'shock', { expr: 'shock' }],
    [W(7, 'crowd') - 4 + i, i % 2 ? 'ears' : 'facepalm', { expr: 'scared' }], [T0 + 8, 'pointUp', { expr: 'shock' }], [W(10, 'circles') + i * 2, 'shock', { expr: 'excited' }], [OUT0 + i * 2, 'cheer', { expr: 'laugh' }], [W(11, 'cheers') + i, 'celebrate', { expr: 'laugh' }]];
  [[LADY, 4, 16.5], [F1, 5, 18.0], [F2, 6, 19.4], [F3, 7, 13.3]].forEach(([p, s, x], i) => D.act(K, p, f, crowdK(i), s, { x, z: 7.8 + (i % 2) * 0.3, yaw: Math.PI + (x - 17) * 0.03 }));
  // the gent who bets his top hat
  const gk = [[0, 'cross', { expr: 'stern' }], [W(4, 'laughs') - 3, 'laugh', { expr: 'laugh' }], [L[5][0] - 4, 'pointUp', { expr: 'grin', talk: false }], [W(5, 'hat') - 2, 'show', { expr: 'grin', R: [0.45, -0.6, 'fist'] }], [W(5, 'ground') + 2, 'hips', { expr: 'laugh' }],
    [WIND, 'cross', { expr: 'grin' }], [L[8][0] - 4, 'laugh', { expr: 'laugh' }], [L[9][0] - 4, 'pointUp', { expr: 'laugh', talk: true }], [W(9, 'never') - 4, 'hips', { expr: 'laugh', talk: true }],
    [T0 + 8, 'shock', { expr: 'shock' }], [W(10, 'lands'), 'panic', { expr: 'shock' }], [W(11, 'joke') - 4, 'facepalm', { expr: 'pained', sweat: true }], [END0, 'cross', { expr: 'pained' }]];
  D.act(K, GENT, f, gk, 8, { x: 15.0, z: 7.9, yaw: Math.PI - 0.1 });
  HAT.visible = false;
  // windsock + sheep
  const wind = f >= WIND && f < T0 ? 1 : 0.35; SOCK.rotation.set(0.15 * Math.sin(f * 0.5) * wind, 0.3 + 0.4 * Math.sin(f * 0.07), -0.9 * (1 - wind) + 0.1 * Math.sin(f * 0.8) * wind);
  SHEEP.forEach((s, i) => s.set(f, { x: 50 + (i % 3) * 3, z: -18 - Math.floor(i / 3) * 3, yaw: i, mode: i % 2 ? 'eat' : 'stand', expr: f >= T0 + 30 && f < T0 + 80 ? 'shock' : 'neutral', look: 0.3 * Math.sin(f / 25 + i) }));
  // ---------- shots ----------
  PLANE.updateMatrixWorld(true);
  const pw = (x, y, z) => PLANE.localToWorld(new K.THREE.Vector3(x, y, z)).toArray();
  const fP = (q) => { const s = q < END0 ? flight(40 + q * 0.35) : flight(40 + (q - TOTAL) * 0.35 + 30); return s.p; };
  const tP = (q) => flight(q - T0).p;
  const S = [
    [0, (u) => ({ pos: pw(-1.4, 3.0, 6.6), look: pw(0.3, 1.9, 3.6), fov: 46, cinf: 8 })],
    [W(0, 'plane') - 4, (u) => ({ pos: pw(4.5, 4.5, 12), look: pw(0, 2.2, 0.5), fov: 46, cinf: 5 })],
    [L[1][0] - 4, (u) => ({ pos: [11.2 - 0.4 * u, 2.6, 6.4], look: [10.1, 2.0, 3.6], fov: 40, cinf: 12 }), { whip: true }],
    [W(1, 'sign') - 4, (u) => ({ pos: [10.15, 2.0, 5.0], look: [10.1, 1.88, 3.95], fov: 40 * K.push(u, 0.12), cinf: 18, noPush: true })],
    [L[2][0] - 4, (u) => ({ pos: [11.2, 2.3, 4.6], look: [10.1, 2.05, 3.6], fov: 36 * K.punch(f, W(2, 'fly'), 0.15, 6), cinf: 16, noPush: true })],
    [L[3][0] - 4, (u) => { const [a, b] = K.shake(f, COUGH, 0.05, 12); return { pos: [7.0 + a, 1.5 + b, 3.4], look: [8.0, 1.5, 0.6], fov: 42, cinf: 10 }; }, { whip: true }],
    [W(3, 'mud') - 6, (u) => ({ pos: [4.5, 1.2, 8.2], look: [4.5, 0.2, 5.0], fov: 40, cinf: 12 })],
    [L[4][0] - 4, (u) => ({ pos: [lerp(15.5, 17.5, u), 1.7, 4.4], look: [17.0, 1.5, 7.9], fov: 42, cinf: 10 }), { whip: true }],
    [W(4, 'barely') - 4, (u) => ({ pos: [13.6, 3.3, 1.7], look: [11.45, 3.0, 0], fov: 38, cinf: 14 })],
    [L[5][0] - 4, (u) => ({ pos: [14.6, 1.8, 5.2], look: [15.0, 1.75, 7.9], fov: 36, cinf: 14 }), { whip: true }],
    [L[6][0] - 4, (u) => ({ pos: [13.2, 4.6, -3.0], look: [15.6, 5.6, -6], fov: 44, cinf: 10 }), { whip: true }],
    [W(6, 'piglet') - 4, (u) => ({ pos: [10.9, 2.15, 5.0], look: [10.1, 1.95, 3.6], fov: 38, cinf: 16 })],
    [WOB, (u) => ({ pos: [17, 0.7, 5.5], look: [10.5, 2.0, 0.5], fov: 44, cinf: 6 }), { whip: true }],
    [W(7, 'crowd') - 4, (u) => ({ pos: [17.2, 1.7, 5.2], look: [17.6, 1.55, 7.9], fov: 40, cinf: 12 })],
    [L[8][0] - 4, (u) => ({ pos: pw(3.0, 3.3, 0.7), look: pw(1.45, 3.1, 0), fov: 38 * K.punch(f, W(8, 'risk'), 0.12, 6), cinf: 14, noPush: true }), { whip: true }],
    [W(8, 'saying') - 4, (u) => ({ pos: [15.2, 1.85, 5.6], look: [15.0, 1.75, 7.9], fov: 38, cinf: 14 })],
    [L[9][0] - 4, (u) => ({ pos: [14.0, 1.4, 4.6], look: [15.0, 2.2, 7.9], fov: 44, cinf: 10 }), { whip: true }],
    [W(9, 'never') - 4, (u) => ({ pos: [10.6, 2.0, 4.9], look: [10.1, 1.95, 3.6], fov: 40, cinf: 16 })],
    [T0, (u) => { const t = K.track(f, tP, { off: [-4.5, 1.6, 8.5], lag: 3, lookY: 1.8 }); return { pos: t.pos, look: t.look, fov: 46, cinf: 6 }; }, { whip: true }],
    [W(10, 'circles') - 4, (u) => ({ pos: [24, 1.3, 10.0], look: flight(f - T0).p.map((v, i) => i === 1 ? v + 2 : v), fov: 50, cinf: 4 }), { whip: true }],
    [W(10, 'lands') - 4, (u) => { const [a, b] = K.shake(f, LANDF, 0.06, 12); const q = flight(f - T0).p; return { pos: [33 + a, 0.8 + b, 8.0], look: [q[0], q[1] + 2, q[2]], fov: 46, cinf: 6 }; }, { whip: true }],
    [OUT0, (u) => ({ pos: [48.8, 1.1, 8.0], look: [47.2, 0.5, 5.0], fov: 42, cinf: 10 }), { whip: true }],
    [W(11, 'joke') - 4, (u) => ({ pos: [15.3, 1.85, 5.7], look: [15.0, 1.75, 7.9], fov: 36 * K.punch(f, W(11, 'dies'), 0.15, 6), cinf: 14, noPush: true })],
    [END0, (u) => ({ pos: pw(-1.6, 3.2, 7.0), look: pw(0.3, 1.9, 3.6), fov: 46, cinf: 8 }), { whip: true }],
  ];
  const R = D.runShots(S, f, TOTAL), cam = R.cam;
  if (R.id === 9) D.card(fx, f, W(5, 'hat'), 'HAT BET!', cam, '#ffffff', 150, 45, 0.62);
  if (R.id === 16) D.card(fx, f, W(9, 'pigs'), 'PIGS FLY?!', cam, '#f6c83a', 150, 60, 0.62);
  if (R.id === 8) D.card(fx, f, W(4, 'six'), '6 YEARS OLD', cam, '#ffffff', 150, 40, 0.62);
  return { light: DAY, cam, dof: R.dof, actors: [], fx };
}
export default { TOTAL, look: 'rich', build, frame };
