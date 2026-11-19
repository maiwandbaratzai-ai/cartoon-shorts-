// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why the first pilots were a sheep, a duck and a rooster" (true story: Montgolfier balloon, Versailles, 19 Sep 1783).
// Palace courtyard with launch stage + fire pit, a huge crowd, the balloon (group BAL: basket at origin), forest clearing at x≈160.
import { TOTAL, LINES, wf } from './sheepflight_timing.js';
import * as PR from '../props.js';
import * as D from './d19.js';
const { clamp, lerp, sm } = D;
export { TOTAL };
const L = LINES, W = wf;
let K, BAL, BALLOON, FLAP, SHEEP, DUCK, HEN, E1, E2, SCI, KING, CW = [], HORSES = [], RIDERS = [], FLAMES = [], SMOKE = [], CANOPY;
const E1_O = { jacket: '#3a5a8a', pants: '#2a2a34', boots: '#1e1a18', hairStyle: 'ponytail', hair: '#e8e6dc', bowtie: '#c0392b', vest: '#e8c860', pockets: true };
const E2_O = { jacket: '#7a3a2a', pants: '#3a2a20', boots: '#1e1a18', hairStyle: 'curly', hair: '#d8d6cc', scarf: '#2a6a5a', glasses: true, belt: '#2a1a12' };
const SCI_O = { jacket: '#2a2a30', pants: '#2a2a30', boots: '#111', hat: 'tophat', glasses: '#222', tie: '#6a2a8a', vest: '#6a6a7a', moustache: '#5a4a3a' };
const KING_O = { jacket: '#2a3a9a', pants: '#e8e0d0', boots: '#111', hat: 'crown', hairStyle: 'curly', hair: '#e8e6dc', vest: '#e8c040', collar: '#ffffff', scarf: '#f4efe4', belt: '#c8a040' };
const CW_O = [
  { jacket: '#c0392b', dress: '#c0392b', pants: '#3a2a2a', hairStyle: 'bun', hair: '#5a3a24', scarf: '#f4efe4', collar: '#f4efe4' },
  { jacket: '#5a8a3a', pants: '#4a3a2a', boots: '#3a2418', hat: 'cap', cap: '#3a3a6a', apron: '#e8dcc0', moustache: '#3a2a1a' },
  { jacket: '#e8b830', dress: '#e8b830', hairStyle: 'ponytail', hair: '#2a1a12', build: 'kid', scarf: '#3a7ad8' },
];
const RIDER_O = [
  { jacket: '#1f3a6a', pants: '#e8e0d0', boots: '#111', hat: 'helmet', hatColor: '#c8a040', gloves: '#f4efe4', belt: '#e8e0d0', scarf: '#c0392b' },
  { jacket: '#8a1a2a', pants: '#e8e0d0', boots: '#111', hat: 'helmet', hatColor: '#9a9aa2', gloves: '#2a2a2a', belt: '#2a2a2a', moustache: '#2a1a12' },
];
const EXT = { az: 70, el: 46, sky: '#d8ecf8', ground: '#b8a888', hemi: 1.05, sun: '#fff2dc', sunI: 3.2, skyTop: '#3f84d8', skyHor: '#dceefa', fog: '#e0ecf4', fogNear: 60, fogFar: 520,
  sat: 1.14, vig: 0.22, shadowExt: 22, exposure: 1.1, ink: 0.55, bloom: 0.65 };
const LAND = [160, 0, -20];

function build(k) {
  K = k; D.init(K); const { THREE } = K;
  K.slab(-400, 400, -0.2, 0, -400, 400, K.mat('grime', '#6aa84f', { amt: 0.55, detail: 2 }), K.scene, false);
  K.slab(-45, 45, -0.19, 0.01, -36, 34, K.mat('dirt', '#d8c8a4', { detail: 0.8, amt: 0.35 }), K.scene, false);
  // palace
  const fac = (cols, rows, seed) => K.toon({ map: PR.facadeTex('#efe2c4', cols, rows, seed, '#c8a050'), kind: 'plaster', amt: 0.08 });
  const roof = K.mat('metal', '#4a5a6a', { roughness: 0.6 });
  K.add(new THREE.BoxGeometry(120, 14, 12), [fac(4, 3, 2), fac(4, 3, 3), roof, roof, fac(18, 3, 5), fac(18, 3, 6)], 0, 7, -44);
  K.add(new THREE.BoxGeometry(30, 18, 8), [fac(4, 4, 7), fac(4, 4, 8), roof, roof, fac(6, 4, 9), fac(6, 4, 9)], 0, 9, -36);
  K.slab(-60, 60, 14, 17, -49, -39, roof); K.slab(-15, 15, 18, 21, -39.5, -32.5, roof);
  for (let x = -54; x <= 54; x += 6) K.sphere(0.5, K.toon({ color: '#e8c040', plain: true, metalness: 0.6, roughness: 0.3 }), x, 14.6, -38);
  for (const s of [-1, 1]) K.add(new THREE.BoxGeometry(12, 13, 40), [fac(8, 3, 11), fac(8, 3, 12), roof, roof, fac(3, 3, 13), fac(3, 3, 14)], s * 54, 6.5, -18);
  // launch stage, masts, fire pit
  K.add(new THREE.CylinderGeometry(4, 4.2, 1, 8), K.mat('wood', '#a87444', { detail: 0.7 }), 0, 0.5, 0);
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; K.add(new THREE.BoxGeometry(0.5, 0.3, 3.2), K.toon({ color: i % 2 ? '#2a4a9a' : '#e8c040', kind: 'fabric' }), Math.cos(a) * 4.1, 0.55, Math.sin(a) * 4.1).rotation.y = -a + Math.PI / 2; }
  for (const s of [-1, 1]) { K.cyl(0.18, 0.22, 16, K.mat('wood', '#7a5434'), s * 6, 0, 0); K.add(new THREE.ConeGeometry(0.3, 0.8, 12), K.toon({ color: '#e8c040', plain: true }), s * 6, 16.4, 0); }
  K.beam(new THREE.Vector3(-6, 15.6, 0), new THREE.Vector3(6, 15.6, 0), 0.05, K.mat('fabric', '#c8b088'));
  const pit = K.group(); pit.position.set(0, 1.0, 2.6);
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; K.sphere(0.18, K.mat('rock', '#8a8278'), Math.cos(a) * 0.65, 0.08, Math.sin(a) * 0.65, pit); }
  for (let i = 0; i < 7; i++) { const c = K.add(new THREE.ConeGeometry(0.22, 0.35, 8), K.mat('fabric', '#e8c860'), (i % 3 - 1) * 0.25, 0.15, (Math.floor(i / 3) - 1) * 0.25, pit); c.rotation.z = (i - 3) * 0.3; }
  for (const [x, z, r] of [[0.15, 0.1, 0.4], [-0.25, -0.1, -0.6]]) { const sh = K.slab(-0.12, 0.12, 0, 0.12, -0.05, 0.05, K.mat('fabric', '#3a2a1e'), pit); sh.position.set(x, 0.3, z); sh.rotation.y = r; } // old shoes
  K.sphere(0.2, K.mat('fabric', '#f4f0e8', { detail: 0.05 }), -0.1, 0.32, 0.25, pit, 1.2, 0.7, 1);   // wool
  for (let i = 0; i < 6; i++) { const fl = K.add(new THREE.ConeGeometry(0.14 + (i % 2) * 0.06, 0.6, 10), K.toon({ color: i % 2 ? '#ffb030' : '#ff6a20', plain: true, emissive: i % 2 ? '#ffa020' : '#ff5010' }), (i % 3 - 1) * 0.2, 0.55, (i < 3 ? -0.1 : 0.15), pit, { cast: false }); FLAMES.push(fl); }
  for (let i = 0; i < 12; i++) { const s = K.add(new THREE.SphereGeometry(0.4, 14, 10), new THREE.MeshLambertMaterial({ color: '#8a8580', transparent: true, opacity: 0.45, depthWrite: false }), 0, 0, 0, K.scene, { cast: false }); s.userData.ndSkip = true; SMOKE.push(s); }
  K.lamp(0, 1.8, 2.6, { color: '#ff9a40', intensity: 4, distance: 6, glowS: 1.2 });
  // king's dais with canopy
  K.slab(-12, -8, 0, 1.2, -8, -4, K.mat('wood', '#8a3a2a'));
  K.slab(-12.2, -7.8, 1.2, 1.25, -8.2, -3.8, K.toon({ color: '#b02a2a', kind: 'fabric' }));
  for (const [x, z] of [[-11.8, -7.8], [-8.2, -7.8], [-11.8, -4.2], [-8.2, -4.2]]) K.cyl(0.07, 0.07, 3.4, K.toon({ color: '#e8c040', plain: true, metalness: 0.5 }), x, 1.2, z);
  CANOPY = K.slab(-12.3, -7.7, 4.6, 4.8, -8.3, -3.7, K.toon({ color: '#2a3a9a', kind: 'fabric' }));
  K.slab(-10.6, -9.4, 1.25, 2.6, -7.6, -7.2, K.toon({ color: '#e8c040', plain: true, metalness: 0.4 }));
  // rope barrier + crowd of bean figures + flags
  for (let a = -2.4; a <= -0.7; a += 0.12) { const x = Math.cos(a) * 11, z = -Math.sin(a) * 11; K.cyl(0.05, 0.05, 1.0, K.mat('wood', '#6a4428'), x, 0, z); }
  const rp = []; for (let a = -2.4; a <= -0.69; a += 0.06) rp.push(new THREE.Vector3(Math.cos(a) * 11, 0.9 - 0.08 * Math.abs(Math.sin(a * 25)), -Math.sin(a) * 11));
  K.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rp), 120, 0.025, 6), K.toon({ color: '#c0392b', plain: true }), 0, 0, 0);
  const cols = ['#c0392b', '#3a6ea5', '#e8b830', '#5a8a3a', '#8a3a8a', '#e86a2a', '#2a7a7a', '#f4efe4', '#7a4a2a'];
  const r = (() => { let s = 7; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
  const capG = new THREE.CapsuleGeometry(0.28, 0.7, 4, 10), headG = new THREE.SphereGeometry(0.25, 14, 10);
  const M4 = (x, y, z) => new THREE.Matrix4().makeTranslation(x, y, z), bodies = cols.map(() => []), heads = [], hats = [];
  for (let i = 0; i < 150; i++) { const a = -2.5 + r() * 1.95, d = 12.5 + r() * 14, x = Math.cos(a) * d, z = -Math.sin(a) * d; if (Math.abs(x - 3) < 3 && z < 6 && z > 1) continue;
    bodies[i % 9].push(M4(x, 0.65, z)); heads.push(M4(x, 1.55, z)); if (i % 4 === 0) hats.push(M4(x, 1.85, z)); }
  bodies.forEach((m, i) => K.add(PR.mergeCopies(capG, m), K.toon({ color: cols[i], plain: true, roughness: 0.8 }), 0, 0, 0));
  K.add(PR.mergeCopies(headG, heads), K.toon({ color: '#ffe2c2', plain: true }), 0, 0, 0); K.add(PR.mergeCopies(new THREE.CylinderGeometry(0.22, 0.26, 0.3, 12), hats), K.toon({ color: '#2a2a30', plain: true }), 0, 0, 0);
  for (const x of [-30, -18, 18, 30]) { K.cyl(0.06, 0.06, 6, K.mat('metal', '#3a3a3a'), x, 0, -30); K.add(new THREE.PlaneGeometry(1.6, 1.0), K.toon({ color: x < 0 ? '#2a3a9a' : '#e8c040', plain: true, side: THREE.DoubleSide }), x + 0.82, 5.4, -30); }
  // forest + clearing
  const trunk = K.mat('wood', '#6a4428'), leaf = [K.mat('grime', '#3a7a3a', { amt: 0.5 }), K.mat('grime', '#4a8a3a', { amt: 0.5 }), K.mat('grime', '#2f6a3a', { amt: 0.5 })];
  const TR = [], LF = [[], [], []];
  for (let i = 0; i < 130; i++) { const x = 120 + r() * 90, z = -70 + r() * 90; if (Math.hypot(x - LAND[0], z - LAND[2]) < 9 || (z > -24 && z < -12 && x < 160)) continue; const h = 6 + r() * 6;
    TR.push(new THREE.Matrix4().compose(new THREE.Vector3(x, h * 0.2, z), new THREE.Quaternion(), new THREE.Vector3(1, h * 0.4, 1))); LF[i % 3].push(new THREE.Matrix4().compose(new THREE.Vector3(x, h * 0.7, z), new THREE.Quaternion(), new THREE.Vector3(1 + r() * 0.4, h * 0.75, 1 + r() * 0.4))); }
  K.add(PR.mergeCopies(new THREE.CylinderGeometry(0.3, 0.4, 1, 8), TR), K.toon({ color: '#6a4428', plain: true }), 0, 0, 0);
  LF.forEach((m, i) => K.add(PR.mergeCopies(new THREE.ConeGeometry(2.4, 1, 10), m), K.toon({ color: ['#3a7a3a', '#4a8a3a', '#2f6a3a'][i], plain: true, roughness: 0.9 }), 0, 0, 0));
  for (let i = 0; i < 40; i++) { const a = r() * 6.28, d = r() * 6; K.add(new THREE.ConeGeometry(0.08, 0.35, 5), leaf[i % 3], LAND[0] + Math.cos(a) * d, 0.15, LAND[2] + Math.sin(a) * d); }
  for (let i = 0; i < 14; i++) { const a = r() * 6.28; K.sphere(0.07, K.toon({ color: ['#f2e04a', '#ffffff', '#e86a9a'][i % 3], plain: true }), LAND[0] + Math.cos(a) * (2 + r() * 4), 0.12, LAND[2] + Math.sin(a) * (2 + r() * 4)); }
  // balloon group: basket at origin
  BAL = K.group();
  const tex = PR.canvasTex(1024, 512, (g, w, h) => { g.fillStyle = '#2a4aa8'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#e8c040'; for (const y of [0.18, 0.5, 0.78]) g.fillRect(0, h * y, w, 16);
    for (let i = 0; i < 16; i++) { g.fillRect(i * 64, 0, 4, h); const x = i * 64 + 32, y = h * 0.34; g.beginPath(); for (let k2 = 0; k2 < 10; k2++) { const a = k2 / 10 * Math.PI * 2, rr = k2 % 2 ? 7 : 16; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.fill();
      g.beginPath(); g.arc(x, h * 0.64, 10, 0, 7); g.fill(); }
    g.fillStyle = '#c0392b'; g.fillRect(0, h * 0.9, w, h * 0.1); });
  const prof = []; for (let i = 0; i <= 24; i++) { const t = i / 24; const y = t * 9; const rr = t < 0.62 ? 0.9 + 3.3 * Math.sin(t / 0.62 * Math.PI / 2) : 4.2 * Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.62) / 0.38, 2))); prof.push(new THREE.Vector2(Math.max(0.01, rr), y)); }
  BALLOON = K.add(new THREE.LatheGeometry(prof, 40), K.toon({ map: tex, kind: 'fabric', amt: 0.12, side: THREE.DoubleSide }), 0, 2.4, 0, BAL);
  K.add(new THREE.TorusGeometry(0.92, 0.07, 8, 32).rotateX(Math.PI / 2), K.mat('wood', '#8a6038'), 0, 2.4, 0, BAL);
  const bk = K.add(new THREE.CylinderGeometry(0.95, 0.85, 0.5, 24, 1, true), K.mat('wood', '#c8a060', { detail: 0.12 }), 0, 0.25, 0, BAL); bk.material.side = THREE.DoubleSide;
  K.add(new THREE.CircleGeometry(0.85, 24).rotateX(-Math.PI / 2), K.mat('wood', '#a88050'), 0, 0.03, 0, BAL);
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; K.beam(new THREE.Vector3(Math.cos(a) * 0.9, 0.5, Math.sin(a) * 0.9), new THREE.Vector3(Math.cos(a) * 0.9, 2.4, Math.sin(a) * 0.9), 0.025, K.mat('fabric', '#d8c098'), BAL); }
  FLAP = K.add(new THREE.PlaneGeometry(1.4, 1.8), K.toon({ color: '#2a4aa8', kind: 'fabric', side: THREE.DoubleSide }), 0, 7.0, 4.15, BAL); FLAP.visible = false;
  K.add(new THREE.PlaneGeometry(1.2, 1.6), K.toon({ color: '#0a0a14', plain: true, side: THREE.DoubleSide }), 0, 7.0, 4.12, BAL).userData.hole = true;
  BAL.children.filter((c) => c.userData.hole).forEach((c) => { c.visible = false; FLAP.userData.hole = c; });
  // animals + people
  SHEEP = K.animal('sheep', { seed: 2, scale: 0.85 }); DUCK = K.animal('duck', { seed: 3, scale: 1.2 }); HEN = K.animal('chicken', { seed: 5, scale: 1.2, color: '#d8642a' });
  E1 = K.stick(E1_O, { key: 'e1' }); E2 = K.stick(E2_O, { key: 'e2' }); SCI = K.stick(SCI_O, { key: 'sci' }); KING = K.stick(KING_O, { key: 'king' });
  CW = CW_O.map((o, i) => K.stick(o, { key: 'cw' + i })); RIDERS = RIDER_O.map((o, i) => K.stick(o, { key: 'rd' + i }));
  HORSES = [0, 1].map((i) => K.animal('horse', { seed: 8 + i, color: i ? '#3a2a1e' : '#f2ece0' }));
  K.addClouds(16, 700, 140);
}

// basket position over time
function balAt(f) {
  const UP = W(5, 'shoots'), DR = L[6][0];
  if (f < L[1][0] - 4) return [18 + f * 0.02, 46, -6];                                    // hook: high in the sky
  if (f < UP - 2) return [0, 1.0 + 3.2 * sm(L[1][0], L[1][0] + 90, f) + 0.12 * Math.sin(f / 14), 0];
  if (f < L[10][0] - 4) { const t = (f - UP + 2) / 30; return [Math.max(0, t - 1) * 9 + 0.2 * t, 4.2 + 50 * sm(UP - 2, UP + 70, f) + 2 * Math.sin(t), -Math.max(0, t - 1) * 1.2]; }
  return [...LAND];
}
function frame(f) {
  const T = K.T, fx = [];
  const UP = W(5, 'shoots'), RIP = W(5, 'rips'), SAT = W(11, 'sat'), GR = W(11, 'grumpy');
  const humans = f >= L[12][0] - 4 && f < W(12, 'but') - 4;
  const b = humans ? [10 + (f - L[12][0]) * 0.03, 30, -12] : balAt(f);
  BAL.position.set(...b); BAL.rotation.y = 0.15 * Math.sin(f / 50); BAL.rotation.z = f > UP ? 0.05 * Math.sin(f / 23) : 0;
  const landed = f >= L[10][0] - 4 && !humans;
  BALLOON.scale.set(landed ? 1.1 : 1, landed ? 0.05 : 1, landed ? 1.1 : 1); BALLOON.position.set(0, landed ? 0.05 : 2.4, landed ? -5.2 : 0); BALLOON.rotation.z = landed ? 0.2 : 0;
  const ripped = f >= RIP && !landed && !humans; FLAP.visible = ripped; FLAP.userData.hole.visible = ripped;
  FLAP.rotation.y = ripped ? 0.6 + 0.4 * Math.sin(f * 0.9) : 0; FLAP.position.x = ripped ? 0.5 : 0;
  // fire + smoke (from the fill until the launch)
  const fire = f >= L[4][0] - 30 && f < UP + 10;
  FLAMES.forEach((m, i) => { m.visible = fire; m.scale.set(1, 0.8 + 0.4 * Math.abs(Math.sin(f * 0.5 + i * 1.7)), 1); });
  SMOKE.forEach((s, i) => { const t = ((f + i * 9) % 108) / 108; s.visible = fire; s.position.set(0.3 * Math.sin(i * 2.1 + t * 3), 1.6 + t * (b[1] + 2.0 - 1.6), 2.6 * (1 - t)); s.scale.setScalar(0.6 + t * 2.2); s.material.opacity = 0.5 * (1 - t * 0.7); });
  // animals in the basket (or the clearing)
  const ip = (dx, dz) => [b[0] + dx, b[1] + 0.04, b[2] + dz];
  if (!humans) {
    const scared = f >= L[1][0] + 30 && f < L[2][0] || (f >= UP - 2 && f < L[7][0]);
    if (!landed) {
      const s = ip(-0.25, 0.05); SHEEP.set(f, { x: s[0], y: s[1], z: s[2], yaw: 0.4 + 0.3 * Math.sin(f / 31), mode: 'stand', expr: scared ? 'shock' : 'happy', look: 0.4 * Math.sin(f / 17) });
      const d = ip(0.35, -0.25); DUCK.set(f, { x: d[0], y: d[1], z: d[2], yaw: -0.5, mode: f >= L[8][0] && f < L[9][0] ? 'jump' : 'stand', flap: scared || (f >= W(8, 'duck') && f < W(8, 'rooster')), expr: scared ? 'shock' : 'happy', look: 0.5 * Math.sin(f / 13) });
      const h = ip(0.35, 0.35); HEN.set(f, { x: h[0], y: h[1], z: h[2], yaw: 0.9, mode: f >= W(8, 'rooster') && f < L[9][0] ? 'jump' : 'stand', flap: scared, expr: scared ? 'shock' : 'neutral', look: 0.5 * Math.sin(f / 11 + 1) });
    } else {
      SHEEP.set(f, { x: LAND[0] - 1.6, y: 0, z: LAND[2] + 1.2, yaw: 0.6, mode: f >= SAT - 6 && f < L[12][0] - 4 ? 'sit' : 'eat', expr: f >= L[12][0] ? 'happy' : 'sleepy', look: 0 });
      DUCK.set(f, { x: LAND[0] + 1.3, y: 0, z: LAND[2] + 1.6, yaw: -0.4, mode: f >= W(11, 'duck') && f < W(11, 'fine') + 20 ? 'wag' : 'walk', speed: 0.6, expr: 'happy', flap: f >= W(11, 'fine') && f < W(11, 'fine') + 14 });
      HEN.set(f, { x: LAND[0] - 1.0, y: 0, z: LAND[2] + 1.9, yaw: 0.2, mode: f >= GR - 4 && f < L[12][0] ? 'jump' : 'stand', expr: f >= GR - 4 ? 'angry' : 'dazed', flap: f >= SAT && f < SAT + 20, look: -0.4 });
    }
  } else { SHEEP.set(f, { visible: false }); DUCK.set(f, { visible: false }); HEN.set(f, { visible: false }); }
  // inventors: tether, fill, watch, explain; fly at the end
  const e1k = [[0, 'pointUp', { expr: 'excited' }], [L[1][0] - 4, 'grab', { expr: 'nervous', sweat: true }], [L[3][0] - 4, 'shrug', { expr: 'confused' }], [L[4][0] - 4, 'push', { expr: 'pained' }],
    [W(4, 'shoes') - 4, 'facepalm', { expr: 'pained' }], [UP - 4, 'shock', { expr: 'shock' }], [RIP - 2, 'panic', { expr: 'scared' }], [L[6][0], 'pointUp', { expr: 'nervous', sweat: true }],
    [L[7][0] - 4, 'think', { expr: 'confused' }], [L[8][0], 'idea', { expr: 'excited' }], [L[9][0] - 4, 'show', { R: [0.42, -0.6, 'paper'], expr: 'proud', talk: true }], [L[10][0] - 4, 'cheer', { expr: 'excited' }]];
  const e2k = [[0, 'clap', { expr: 'grin' }], [L[1][0] - 4, 'grab', { expr: 'nervous' }], [L[3][0] + 10, 'cross', { expr: 'stern' }], [L[4][0] - 4, 'carry', { item: 'box', expr: 'smile' }],
    [W(4, 'shoes') - 2, 'throw', { expr: 'laugh' }], [UP - 4, 'jump', { expr: 'excited' }], [RIP - 2, 'scared', { expr: 'scared' }], [L[6][0] + 10, 'lookAround', { expr: 'nervous' }],
    [L[7][0] - 4, 'shrug', { expr: 'confused' }], [L[9][0] - 4, 'clap', { expr: 'smile' }], [L[10][0] - 4, 'pointUp', { expr: 'excited' }]];
  if (humans) { D.act(K, E1, f, [[0, 'wave', { expr: 'excited' }]], 1, { x: b[0] - 0.35, y: b[1] + 0.05, z: b[2] + 0.1, yaw: 0.3 }); D.act(K, E2, f, [[0, 'cheer', { expr: 'laugh' }]], 2, { x: b[0] + 0.4, y: b[1] + 0.05, z: b[2] - 0.1, yaw: 0.5 }); }
  else { D.act(K, E1, f, e1k, 1, { x: 2.0, y: 1.0, z: 1.6, yaw: 0.5 }); D.act(K, E2, f, e2k, 2, { x: -1.8, y: 1.0, z: 2.2, yaw: -0.3 }); }
  D.act(K, SCI, f, [[0, 'cross', { expr: 'stern' }], [L[3][0] - 4, 'pointUp', { expr: 'yell', talk: true }], [W(3, 'poison') - 3, 'stop', { expr: 'scared', sweat: true }], [L[4][0] + 10, 'read', { item: 'book', expr: 'nervous' }],
    [UP - 2, 'shock', { expr: 'shock' }], [L[7][0], 'hips', { expr: 'stern' }]], 5, { x: 6.5, z: 4.5, yaw: 0.5 });
  D.act(K, KING, f, [[0, 'hips', { expr: 'smile' }], [W(2, 'king') - 4, 'wave', { expr: 'smile' }], [UP - 2, 'shock', { expr: 'shock' }], [L[6][0] + 6, 'clap', { expr: 'excited' }]], 6, { x: -10, y: 1.25, z: -6.2, yaw: 0.25 });
  CW.forEach((r2, i) => D.act(K, r2, f, [[0, 'pointUp', { expr: 'excited' }], [L[2][0] - 4 + i * 3, i === 2 ? 'wave' : 'clap', { expr: 'smile' }], [W(3, 'poison') + i * 2, 'shock', { expr: 'scared' }],
    [W(4, 'shoes') + i, 'facepalm', { expr: 'dazed' }], [UP - 2 + i, 'panic', { expr: 'scared', sweat: i === 0 }], [RIP + 6 + i, 'ears', { expr: 'scared' }], [L[6][0] + 12 + i * 3, 'pointUp', { expr: 'shock' }], [L[7][0] + i * 4, 'cheer', { expr: 'excited' }]],
    20 + i, { x: 2.0 + i * 0.95, z: 11.8 + (i % 2) * 0.5, yaw: Math.PI + 0.1 * i }));
  // riders gallop to the clearing
  const ride = (i, g) => { const p = K.walkPath(g, L[10][0] - 4 + i * 4, [[118 - i * 2.5, -17 - i * 1.6], [LAND[0] - 7 - i * 1.5, -17.5 - i * 1.6]], 9.5); return p; };
  HORSES.forEach((h, i) => { const p = ride(i, f); const on = f >= L[10][0] - 4 && f < L[11][0] + 30;
    h.set(f, { visible: on, x: p.x, z: p.z, yaw: Math.PI / 2, mode: p.moving ? 'run' : 'stand', speed: 1.2, expr: 'happy', look: p.moving ? 0 : 0.3 * Math.sin(f / 15) });
    if (on) D.act(K, RIDERS[i], f, p.moving ? [[0, 'sit', { expr: 'excited', R: [0.5, -0.2] }]] : [[0, 'sit', { expr: 'shock' }], [p.done ? f - 8 : 0, 'sit', { expr: 'laugh', L: [0.6, -0.4] }]], 40 + i, { x: p.x - 0.1, y: 1.05 + (p.moving ? 0.06 * Math.abs(Math.sin(f * 0.55)) : 0), z: p.z, yaw: Math.PI / 2, seat: 0.0 });
    else RIDERS[i].root.visible = false;
    if (p.moving) K.puff(f, Math.floor(f / 5) * 5, p.x - 0.8, p.z, 4, 0.4, '#9a8a6a'); });
  // ---------- shots ----------
  const B = (dx, dy, dz) => [b[0] + dx, b[1] + dy, b[2] + dz];
  const S = [
    [0, (u) => ({ pos: B(1.7, 1.25, 1.7), look: B(0.0, 0.45, 0), fov: 44, cinf: 10 })],
    [W(0, 'duck') - 4, (u) => ({ pos: B(lerp(10, 12, u), -3, 15), look: B(0, 3.5, 0), fov: 50, cinf: 3 })],
    [L[1][0] - 4, (u) => ({ pos: [7, 1.5, 13], look: [0, lerp(4, 6.5, u), 0], fov: 56, cinf: 4 }), { whip: true }],
    [W(1, 'nobody') - 4, (u) => ({ pos: B(0.6, 1.3, 1.5), look: B(-0.25, 0.5, 0.05), fov: 38, cinf: 14 })],
    [L[2][0] - 4, (u) => ({ pos: [lerp(4, 2, u), 5.0, 22], look: [0, 3.0, 0], fov: 50, cinf: 5 }), { whip: true }],
    [W(2, 'including') - 4, (u) => ({ pos: [-8.6, 2.6, -3.6], look: [-10, 2.3, -6.2], fov: 38, cinf: 12 })],
    [L[3][0] - 4, (u) => ({ pos: [7.7, 1.6, 6.6], look: [6.5, 1.55, 4.5], fov: 38 * K.punch(f, W(3, 'poison'), 0.2, 6), cinf: 14, noPush: true }), { whip: true }],
    [L[4][0] - 4, (u) => ({ pos: [1.2, 1.75, 4.4], look: [0, 1.25, 2.6], fov: 40, cinf: 14 }), { whip: true }],
    [W(4, 'wool') - 4, (u) => ({ pos: [0.5, 2.0, 9.5], look: [0, lerp(3, 7, u), 0], fov: 58, cinf: 4 })],
    [L[5][0] - 4, (u) => ({ pos: [4, 1.2, 10], look: [b[0], b[1] + 4, b[2]], fov: 56 * K.punch(f, W(5, 'fast'), 0.18, 6), cinf: 3, noPush: true })],
    [W(5, 'crowd') - 3, (u) => ({ pos: [2.3, 1.45, 9.6], look: [2.05, 1.4, 11.8], fov: 36, cinf: 14 })],
    [W(5, 'gust') - 4, (u) => { const [s1, s2] = K.shake(f, RIP, 0.12, 14); return { pos: B(4 + s1, 6.5 + s2, 9), look: B(0, 6.5, 3), fov: 44 * K.punch(f, RIP, 0.2, 6), cinf: 3, noPush: true }; }, { whip: true }],
    [L[6][0] - 4, (u) => { const t = K.track(f, (g) => balAt(g), { off: [-14, 6, 22], lag: 8, lookY: 3 }); return { pos: t.pos, look: t.look, fov: 50, cinf: 3 }; }],
    [W(6, 'vanishes') - 6, (u) => ({ pos: [-1.0, 2.6, 4.2], look: [b[0], b[1], b[2]], fov: 40, focus: 30, cinf: 4 })],
    [L[7][0] - 4, (u) => ({ pos: [lerp(-0.5, -0.8, u), 2.6, 4.7], look: [-1.8, 2.45, 2.2], fov: 40, cinf: 12 }), { whip: true }],
    [L[8][0] - 4, (u) => ({ pos: B(-0.9, 1.2, 1.3), look: B(-0.25, 0.5, 0.05), fov: 36, cinf: 14 }), { whip: true }],
    [W(8, 'duck') - 4, (u) => ({ pos: B(1.1, 1.15, -1.3), look: B(0.35, 0.5, -0.25), fov: 36, cinf: 14 })],
    [W(8, 'rooster') - 4, (u) => ({ pos: B(1.3, 1.15, 1.3), look: B(0.35, 0.5, 0.35), fov: 36 * K.punch(f, W(8, 'between'), 0.15, 6), cinf: 14, noPush: true })],
    [L[9][0] - 4, (u) => ({ pos: [lerp(3.6, 3.3, u), 2.6, 3.8], look: [2.0, 2.45, 1.6], fov: 40, cinf: 10 }), { whip: true }],
    [L[10][0] - 4, (u, g) => { const t = K.track(f, (h) => { const p = ride(0, h); return [p.x, 0, p.z]; }, { off: [4, 1.8, 6.5], lag: 5, lookY: 1.2 }); return { pos: t.pos, look: t.look, fov: 46, cinf: 8 }; }, { whip: true }],
    [W(10, 'find') - 4, (u) => ({ pos: [LAND[0] - 8.5, 2.4, LAND[2] + 1], look: [LAND[0] - 0.5, 0.6, LAND[2] + 1], fov: 44, cinf: 6 })],
    [L[11][0] - 4, (u) => ({ pos: [LAND[0] - 2.5, 0.75, LAND[2] + 3.1], look: [LAND[0] - 1.55, 0.45, LAND[2] + 1.2], fov: 36, cinf: 16 })],
    [W(11, 'duck') - 4, (u) => ({ pos: [LAND[0] + 2.3, 0.55, LAND[2] + 3.4], look: [LAND[0] + 1.3, 0.35, LAND[2] + 1.6], fov: 36, cinf: 16 })],
    [W(11, 'rooster') - 4, (u) => ({ pos: [LAND[0] - 0.5, 0.6, LAND[2] + 3.6], look: [LAND[0] - 1.1, 0.42, LAND[2] + 1.7], fov: 38 * K.punch(f, SAT, 0.2, 6), cinf: 16, noPush: true })],
    [L[12][0] - 4, (u) => { const t = K.track(f, () => [10 + (f - L[12][0]) * 0.03, 30, -12], { off: [3, 0.8, 6], lag: 2, lookY: 1.4 }); return { pos: t.pos, look: t.look, fov: 44, cinf: 6 }; }, { whip: true }],
    [W(12, 'but') - 4, (u) => ({ pos: [LAND[0] - 1.7, 0.6, LAND[2] + 2.5], look: [LAND[0] - 1.6, 0.5, LAND[2] + 1.2], fov: 38, cinf: 16 }), { whip: true }],
  ];
  const R = D.runShots(S, f, TOTAL), cam = R.cam;
  if (R.id === 4) D.card(fx, f, W(2, '130'), '130,000', cam, '#f6c83a', 200, 40, 0.35);
  if (R.id === 6) D.card(fx, f, W(3, 'poison'), 'POISON?', cam, '#9ad04a', 190, 40, 0.5);
  if (R.id === 12) D.card(fx, f, W(6, 'two'), '2 MILES', cam, '#ffffff', 200, 40, 0.4);
  return { light: EXT, cam, dof: R.dof, actors: [], fx };
}
export default { TOTAL, look: 'rich', build, frame };
