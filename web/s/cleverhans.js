// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "How did a horse named Hans solve math?" (true story: Clever Hans, Berlin, 1904–1907; the Hans Commission, then
// Oskar Pfungst's blinder tests showed Hans read the questioners' faces). An enclosed Berlin courtyard with a chalkboard.
import { TOTAL, LINES, wf } from './cleverhans_timing.js';
import * as PR from '../props.js';
import * as D from './d19.js';
const { clamp, lerp, sm } = D;
export { TOTAL };
const L = LINES, W = wf;
let K, HANS, BL = [], OWN, PF, GEN, VET, TRN, SKEP, CR1, CR2, BOARD, BTX = [], PAPER;
const OWN_O = { jacket: '#6a6a72', pants: '#3a3a40', boots: '#1e1a18', hat: 'cowboy', hatColor: '#3a3a3a', moustache: '#f0f0ea', hair: '#f0f0ea', glasses: '#333', scarf: '#8a2a2a', pockets: true };
const PF_O = { jacket: '#c8b890', pants: '#4a4a52', boots: '#2a1a12', hairStyle: 'short', hair: '#5a3a24', glasses: true, tie: '#2a5a8a', vest: '#8a7a5a' };
const GEN_O = { jacket: '#3a4a3a', pants: '#2a2a2a', boots: '#111', hat: 'helmet', hatColor: '#2a2a2a', badge: true, belt: '#c8a040', moustache: '#4a3a2a', gloves: '#f4efe4' };
const VET_O = { jacket: '#f4efe4', pants: '#3a3a44', boots: '#1e1a18', hairStyle: 'curly', hair: '#c87a3a', bowtie: '#2a8a5a', apron: '#ffffff', glasses: '#333' };
const TRN_O = { jacket: '#c0392b', pants: '#f4efe4', boots: '#111', hat: 'tophat', hatColor: '#c0392b', vest: '#e8c040', bowtie: '#1a1a1a', moustache: '#2a1a12' };
const SKEP_O = { jacket: '#2a2a34', pants: '#2a2a34', boots: '#111', hat: 'tophat', glasses: true, tie: '#8a2a8a', vest: '#5a5a6a', belt: '#111' };
const CR1_O = { jacket: '#3a7aa8', dress: '#3a7aa8', hairStyle: 'bun', hair: '#2a1a12', scarf: '#f2c230', collar: '#f4efe4' };
const CR2_O = { jacket: '#7a5a2a', pants: '#3a3a40', boots: '#2a1a12', hat: 'cap', cap: '#4a6a3a', scarf: '#e86a2a', pockets: true };
const EXT = { az: 80, el: 50, sky: '#d8ecf8', ground: '#9a8a7a', hemi: 1.1, sun: '#fff0d8', sunI: 3.1, skyTop: '#3f80d0', skyHor: '#e6ecf0', fog: '#e4e8ec', fogNear: 40, fogFar: 260,
  sat: 1.14, vig: 0.24, shadowExt: 16, exposure: 1.12, ink: 0.55, bloom: 0.6 };
const HP = [0, 0, -2]; // Hans

function build(k) {
  K = k; D.init(K); const { THREE } = K;
  K.slab(-30, 30, -0.3, 0, -30, 30, K.mat('rock', '#a8a090', { detail: 0.35, amt: 0.4, bump: 0.01 }), K.scene, false);
  K.slab(-3, 3, 0, 0.02, -5, 1, K.mat('dirt', '#c8a878', { detail: 0.6 }), K.scene, false);    // sandy patch where Hans stands
  const cols = ['#e8d8b8', '#d8b890', '#c8a888', '#e0c8a0'];
  const fac = (c, n, s) => K.toon({ map: PR.facadeTex(c, n, 5, s, '#f4efe4'), kind: 'plaster', amt: 0.08 });
  K.add(new THREE.BoxGeometry(26, 16, 2), fac(cols[0], 7, 3), 0, 8, -13);
  K.add(new THREE.BoxGeometry(2, 16, 26), fac(cols[1], 7, 4), -13, 8, 0); K.add(new THREE.BoxGeometry(2, 16, 26), fac(cols[2], 7, 5), 13, 8, 0);
  K.add(new THREE.BoxGeometry(26, 16, 2), fac(cols[3], 7, 6), 0, 8, 13);
  K.slab(-3.5, 3.5, 0, 4.5, 11.9, 12.1, K.mat('wood', '#5a3420'));   // gate (behind the camera side)
  K.slab(-14, 14, 16, 17, -14, 14, K.mat('metal', '#6a5a5a'), K.scene, false);
  // window heads leaning out (merged) + flower boxes
  const M4 = (x, y, z) => new THREE.Matrix4().makeTranslation(x, y, z), hd = [], bd = [];
  for (const [x, y] of [[-8, 6.2], [-3, 9.4], [4, 6.2], [8, 12.6], [-6, 12.6], [1, 9.4]]) { hd.push(M4(x, y + 0.6, -11.7)); bd.push(M4(x, y, -11.8)); }
  K.add(PR.mergeCopies(new THREE.SphereGeometry(0.32, 16, 12), hd), K.toon({ color: '#ffe2c2', plain: true }), 0, 0, 0);
  K.add(PR.mergeCopies(new THREE.CapsuleGeometry(0.3, 0.3, 4, 10), bd), K.toon({ color: '#5a6aa8', plain: true }), 0, 0, 0);
  for (const x of [-9, -2, 5, 10]) { K.slab(x - 0.8, x + 0.8, 4.3, 4.6, -11.95, -11.5, K.mat('wood', '#6a4428')); for (let i = 0; i < 5; i++) K.sphere(0.12, K.toon({ color: ['#e84a5f', '#f2c230', '#ffffff'][i % 3], plain: true }), x - 0.6 + i * 0.3, 4.75, -11.7); }
  // props: chalkboard, water trough, hay, barrels, cart, rope line for the crowd, gas lamp, bench
  BOARD = K.group(); BOARD.position.set(-2.6, 0, -1.6); BOARD.rotation.y = 0.35;
  for (const s of [-1, 1]) K.beam(new THREE.Vector3(s * 0.7, 0, 0.3), new THREE.Vector3(s * 0.6, 2.4, 0), 0.06, K.mat('wood', '#7a5434'), BOARD);
  const btx = (lines, size = 120) => D.txtTex(640, 480, '#2a3a32', '#f4f4ea', lines, `bold ${size}px "Comic Sans MS", Georgia, serif`);
  BTX = [btx(['2 + 3 = ?']), btx(['1/2 + 1/4 = ?'], 96), btx(['12 + 9 = ?']), btx(['3 + 4 = ?'])];
  BOARD.userData.face = D.sign(1.5, 1.1, BTX[0], 0, 1.6, 0.1, 0, BOARD, 'plaster');
  K.slab(-0.8, 0.8, 1.0, 1.04, 0.05, 0.2, K.mat('wood', '#7a5434'), BOARD);
  K.slab(3.2, 5.2, 0, 0.6, -4.5, -3.9, K.mat('wood', '#7a5434')); K.slab(3.3, 5.1, 0.55, 0.58, -4.4, -4.0, K.toon({ color: '#5a9ac8', plain: true, roughness: 0.15 }));
  for (const [x, z] of [[-5.5, -6], [-6.4, -5.2]]) K.slab(x - 0.6, x + 0.6, 0, 0.7, z - 0.4, z + 0.4, K.mat('fabric', '#e8c860', { detail: 0.08 }));
  for (const [x, z] of [[7, -8], [7.8, -7.2], [-8, 2]]) K.cyl(0.38, 0.38, 0.95, K.mat('wood', '#8a5a34'), x, 0, z);
  for (let x = -6; x <= 6; x += 1.5) K.cyl(0.05, 0.05, 1.0, K.mat('metal', '#3a3a3a'), x, 0, 3.6);
  K.slab(-6, 6, 0.85, 0.9, 3.58, 3.62, K.toon({ color: '#c0392b', plain: true }));
  K.cyl(0.07, 0.09, 3.5, K.mat('metal', '#2a3a2a'), 6.5, 0, 1.0); K.add(new THREE.BoxGeometry(0.4, 0.5, 0.4), K.toon({ color: '#fff2c0', plain: true, emissive: '#ffe6a0' }), 6.5, 3.75, 1.0);
  K.slab(-9, -6.5, 0.4, 0.5, 5, 5.6, K.mat('wood', '#8a5a34')); for (const x of [-8.8, -6.7]) K.slab(x - 0.06, x + 0.06, 0, 0.4, 5.1, 5.5, K.mat('wood', '#6a4428'));
  // newspaper (insert prop)
  PAPER = K.group(); PAPER.position.set(9, 1.5, 6); PAPER.rotation.y = -0.6;
  K.add(new THREE.PlaneGeometry(0.9, 1.2), K.toon({ map: PR.canvasTex(384, 512, (g, w, h) => { g.fillStyle = '#f2ead8'; g.fillRect(0, 0, w, h); g.fillStyle = '#1a1a1a'; g.font = 'bold 40px Georgia, serif'; g.textAlign = 'center'; g.fillText('THE DAILY BUGLE'.replace('BUGLE', 'POST'), w / 2, 52); g.fillRect(16, 64, w - 32, 4);
    g.font = 'bold 54px Georgia, serif'; g.fillText('SMARTEST', w / 2, 140); g.fillText('HORSE', w / 2, 200); g.fillText('ALIVE!', w / 2, 260); g.fillStyle = '#8a7a6a'; g.fillRect(40, 290, w - 80, 120); g.fillStyle = '#5a4030';
    g.beginPath(); g.ellipse(w / 2, 360, 70, 34, 0, 0, 7); g.fill(); g.fillRect(w / 2 + 40, 300, 22, 50); for (let i = 0; i < 6; i++) g.fillRect(40, 430 + i * 12, w - 80, 4); }), plain: true, side: THREE.DoubleSide }), 0, 0, 0, PAPER);
  // Hans + blinders
  HANS = K.animal('horse', { seed: 6, color: '#6a4228', scale: 1.4 });
  for (const s of [-1, 1]) { const b = K.slab(-0.02, 0.02, -0.1, 0.1, -0.12, 0.12, K.toon({ color: '#1a1a1a', plain: true }), HANS.head); b.position.set(s * 0.17, 0.06, 0.0); b.visible = false; BL.push(b); }
  OWN = K.stick(OWN_O, { key: 'own' }); PF = K.stick(PF_O, { key: 'pf' }); GEN = K.stick(GEN_O, { key: 'gen' }); VET = K.stick(VET_O, { key: 'vet' }); TRN = K.stick(TRN_O, { key: 'trn' });
  SKEP = K.stick(SKEP_O, { key: 'skep' }); CR1 = K.stick(CR1_O, { key: 'cr1' }); CR2 = K.stick(CR2_O, { key: 'cr2' });
  K.addClouds(10, 700, 160);
}

function frame(f) {
  const T = K.T, fx = [];
  const TAPS = W(1, 'taps'), STOPS = W(11, 'stops'), BLIND = W(8, 'blinders'), GONE = W(6, 'gone');
  // tap windows: [start, count, rate]
  const WIN = [[0, 6, 8], [TAPS, 5, 9], [W(5, 'right') - 4, 3, 7], [L[6][0], 9, 8], [L[9][0] - 4, 9, 7], [L[11][0], Math.floor((STOPS - L[11][0]) / 9), 9], [L[13][0] - 4, 12, 8]];
  let lift = 0, count = 0;
  for (const [t0, n, r] of WIN) if (f >= t0) { const k = Math.floor((f - t0) / r); if (k < n) { lift = Math.max(0, Math.sin(Math.PI * ((f - t0) % r) / r)); count = k + 1; } else if (t0 === TAPS && f < L[2][0]) count = n; }
  const tapping = lift > 0;
  const blind = f >= BLIND - 4 && f < L[10][0] - 4;
  BL.forEach((b) => { b.visible = blind; });
  HANS.set(f, { x: HP[0], z: HP[2], yaw: 0.0, mode: 'stand', lift: lift * 0.9, expr: f >= L[9][0] && f < L[10][0] ? 'shock' : f >= L[12][0] ? 'happy' : 'neutral', look: blind ? 0 : 0.3 * Math.sin(f / 20), nod: tapping ? -0.08 : 0 });
  if (lift > 0 && lift < 0.2 && ((f % 8) < 2)) K.puff(f, f - 1, HP[0] + 0.18, HP[2] + 0.6, 3, 0.18, '#c8a878');
  // board text
  BOARD.userData.face.material.map = f < L[4][0] ? BTX[0] : f < L[8][0] ? BTX[1] : f < L[11][0] ? BTX[2] : BTX[3];
  // owner: proud teacher; leaves at "gone"; tense then relaxed at the answer
  const ownGone = f >= GONE - 10 && f < L[11][0] - 4;
  const ow = K.walkPath(f, GONE - 10, [[1.7, -0.8], [2.2, 2.6], [4.5, 9]], 1.6);
  const ownKeys = [[0, 'pointDown', { expr: 'stern' }], [L[1][0] - 4, 'show', { R: [0.42, -0.6, 'paper'], expr: 'smile' }], [W(1, 'perfect') - 4, 'clap', { expr: 'grin' }],
    [L[2][0] - 4, 'hips', { expr: 'proud', talk: true }], [W(2, 'swears') - 2, 'pointUp', { expr: 'proud', talk: true }], [L[3][0] + 30, 'angry', { expr: 'angry' }], [L[4][0], 'cross', { expr: 'stern' }],
    [L[11][0] - 4, 'cross', { expr: 'nervous', sweat: true }], [W(11, 'relax') - 3, 'idle', { expr: 'relief' }], [STOPS, 'cheer', { expr: 'excited' }], [L[12][0] + 10, 'hips', { expr: 'proud' }]];
  if (ownGone) { if (ow.moving) D.act(K, OWN, f, [[0, 'walk', { expr: 'smile' }]], 2, { x: ow.x, z: ow.z, yaw: ow.yaw }); else OWN.root.visible = false; }
  else D.act(K, OWN, f, ownKeys, 2, { x: 1.7, z: -0.8, yaw: -2.0 });
  // skeptic, experts, crowd
  D.act(K, SKEP, f, [[0, 'cross', { expr: 'stern' }], [W(3, 'scientists') - 4, 'cross', { expr: 'stern' }], [W(3, 'cheap') - 3, 'pointL', { expr: 'angry', talk: true }], [W(3, 'trick') + 6, 'facepalm', { expr: 'stern' }],
    [L[5][0], 'shock', { expr: 'shock' }], [L[7][0], 'read', { item: 'paper', expr: 'confused' }], [L[9][0], 'think', { expr: 'confused' }], [L[12][0], 'clap', { expr: 'laugh' }]], 9, { x: -3.6, z: 4.3, yaw: Math.PI - 0.3 });
  const ex = [[GEN, 'general', 0.9, 11], [VET, 'vet', 0, 12], [TRN, 'circus', -0.9, 13]];
  ex.forEach(([r, w, dx, sd], i) => D.act(K, r, f, [[0, 'idle', { expr: 'neutral' }], [W(4, 'thirteen') - 4, 'cross', { expr: 'stern' }], [W(4, w) - 3, i === 0 ? 'salute' : i === 1 ? 'read' : 'wave', { expr: i === 2 ? 'grin' : 'stern', item: i === 1 ? 'book' : undefined }],
    [L[5][0] - 2, 'point', { expr: 'stern', talk: i === 1 }], [W(5, 'right') - 2 + i * 2, 'shock', { expr: 'shock' }], [L[6][0] + 4 + i * 3, 'facepalm', { expr: 'dazed' }], [L[7][0], 'clap', { expr: 'excited' }],
    [L[9][0] - 2 + i * 3, 'shock', { expr: 'nervous', sweat: true }], [L[10][0] + i * 4, 'think', { expr: 'confused' }], [W(11, 'relax') + i * 2, 'idle', { expr: 'relief' }], [L[12][0] + i * 3, 'shock', { expr: 'shock' }], [L[13][0], 'clap', { expr: 'laugh' }]],
    sd, { x: dx, z: 2.2, yaw: Math.PI }));
  D.act(K, CR1, f, [[0, 'clap', { expr: 'excited' }], [L[3][0] - 4, 'cheer', { expr: 'excited' }], [L[5][0], 'clap', { expr: 'laugh' }], [L[9][0], 'ears', { expr: 'confused' }], [W(11, 'relax'), 'idle', { expr: 'relief' }], [L[12][0], 'shock', { expr: 'shock' }]], 21, { x: 2.6, z: 4.4, yaw: Math.PI + 0.2 });
  D.act(K, CR2, f, [[0, 'pointUp', { expr: 'grin' }], [L[3][0] - 2, 'wave', { expr: 'excited' }], [L[7][0] - 4, 'show', { R: [0.42, -0.6, 'paper'], expr: 'excited', talk: true }], [L[9][0], 'think', { expr: 'confused' }], [L[12][0], 'clap', { expr: 'laugh' }]], 22, { x: 4.0, z: 4.6, yaw: Math.PI - 0.2 });
  // young scientist with blinders
  const pw = K.walkPath(f, L[8][0] - 10, [[-6, 9], [-4.5, 1.4], [-1.0, -0.6]], 1.6, { endYaw: Math.PI * 0.75 });
  if (f >= L[8][0] - 10) D.act(K, PF, f, pw.moving ? [[0, 'walk', { expr: 'smile', R: [0.4, -0.3, 'box'] }]] : [[0, 'reach', { expr: 'smile' }], [L[9][0], 'write', { expr: 'confused' }], [L[10][0] - 4, 'idea', { expr: 'excited' }], [W(10, 'faces') - 4, 'pointUp', { expr: 'excited', talk: true }],
    [L[11][0], 'read', { item: 'book', expr: 'smile' }], [L[12][0] - 4, 'show', { R: [0.42, -0.6, 'book'], expr: 'proud' }]], 30, { x: pw.x, z: pw.z, yaw: pw.yaw });
  else PF.root.visible = false;
  // ---------- shots ----------
  const hoof = [HP[0] + 0.18, 0.25, HP[2] + 0.6], head = [HP[0], 1.5, HP[2] + 1.35];
  const S = [
    [0, (u) => ({ pos: [hoof[0] + 1.1, 0.35, hoof[2] + 1.4], look: [hoof[0], 0.45, hoof[2]], fov: 42, cinf: 14 })],
    [W(0, 'math') - 4, (u) => ({ pos: [head[0] + 1.6, 1.85, head[2] + 2.2], look: [head[0] + 0.5, 1.5, head[2] - 0.4], fov: 42, cinf: 10 })],
    [L[1][0] - 4, (u) => ({ pos: [-2.0, 1.65, 0.0], look: [-2.6, 1.6, -1.5], fov: 38, cinf: 14 }), { whip: true }],
    [TAPS - 4, (u) => ({ pos: [hoof[0] - 1.2, 0.5, hoof[2] + 1.3], look: [hoof[0], 0.4, hoof[2]], fov: 40, cinf: 14 })],
    [L[2][0] - 4, (u) => ({ pos: [lerp(0.4, 0.6, u), 1.75, 1.2], look: [1.7, 1.6, -0.8], fov: 38, cinf: 12 }), { whip: true }],
    [L[3][0] - 4, (u) => ({ pos: [lerp(-1, 1, u), lerp(5, 3.5, u), 10], look: [0, 3, -6], fov: 54, cinf: 4 })],
    [W(3, 'scientists') - 4, (u) => ({ pos: [-3.1, 1.75, 2.4], look: [-3.6, 1.6, 4.3], fov: 38 * K.punch(f, W(3, 'cheap'), 0.15, 6), cinf: 14, noPush: true })],
    [L[4][0] - 4, (u) => ({ pos: [lerp(-2.5, 2.5, u), 1.6, -0.2], look: [lerp(-1.6, 1.6, u), 1.4, 2.2], fov: 44, cinf: 8 }), { whip: true }],
    [W(4, 'general') - 4, (u) => ({ pos: [0.7, 1.7, 0.5], look: [0.9, 1.6, 2.2], fov: 38, cinf: 14 })],
    [W(4, 'circus') - 6, (u) => ({ pos: [-0.6, 1.7, 0.5], look: [-0.9, 1.6, 2.2], fov: 38, cinf: 14 })],
    [L[5][0] - 4, (u) => ({ pos: [-2.1, 1.65, 0.1], look: [-2.6, 1.6, -1.5], fov: 34, cinf: 16 }), { whip: true }],
    [W(5, 'hans') - 4, (u) => ({ pos: [0.2, 1.6, 0.4], look: [0, 1.4, 2.2], fov: 46 * K.punch(f, W(5, 'right'), 0.15, 6), cinf: 8, noPush: true })],
    [L[6][0] - 4, (u) => { const t = K.track(f, (g) => { const p = K.walkPath(g, GONE - 10, [[1.7, -0.8], [2.2, 2.6], [4.5, 9]], 1.6); return [p.x, 0, p.z]; }, { off: [-2.6, 1.4, 3.2], lag: 6 }); return { pos: t.pos, look: t.look, fov: 44, cinf: 8 }; }, { whip: true }],
    [W(6, 'keeps') - 4, (u) => ({ pos: [hoof[0] + 1.5, 0.7, hoof[2] + 0.9], look: [hoof[0], 0.5, hoof[2] - 0.2], fov: 42, cinf: 12 })],
    [L[7][0] - 4, (u) => ({ pos: [9 - 1.0, 1.55, 6 + 1.2], look: [9, 1.5, 6], fov: 40, cinf: 18 }), { whip: true }],
    [W(7, 'so') - 4, (u) => ({ pos: [head[0] - 0.9, 1.9, head[2] + 1.6], look: [head[0], 1.7, head[2]], fov: 40, cinf: 14 })],
    [L[8][0] - 4, (u) => { const t = K.track(f, (g) => { const p = K.walkPath(g, L[8][0] - 10, [[-6, 9], [-4.5, 1.4], [-1.0, -0.6]], 1.6); return [p.x, 0, p.z]; }, { off: [2.6, 1.3, 3.0], lag: 6 }); return { pos: t.pos, look: t.look, fov: 44, cinf: 8 }; }, { whip: true }],
    [BLIND - 6, (u) => ({ pos: [head[0] + 1.3, 1.95, head[2] + 1.2], look: [head[0] - 0.3, 1.7, head[2] - 0.2], fov: 38, cinf: 14 })],
    [L[9][0] - 4, (u) => ({ pos: [hoof[0] + 0.8, 0.3, hoof[2] + 1.6], look: [hoof[0], 0.4, hoof[2]], fov: 40 * K.push(u, 0.15), cinf: 14, noPush: true })],
    [W(9, 'never') - 4, (u) => ({ pos: [0.9, 1.8, 0.0], look: [0.9, 1.7, 2.2], fov: 38, cinf: 14 })],
    [L[10][0] - 4, (u) => ({ pos: [-0.2, 1.75, 0.7], look: [-0.9, 1.6, -0.4], fov: 38, cinf: 14 }), { whip: true }],
    [W(10, 'watches') - 4, (u) => ({ pos: [head[0] + 0.5, 2.0, head[2] + 0.9], look: [head[0], 1.85, head[2] + 0.1], fov: 34, cinf: 16 })],
    [L[11][0] - 4, (u) => ({ pos: [head[0] - 0.2, 1.95, head[2] - 0.3], look: [1.7, 1.6, -0.8], fov: 34, cinf: 12 }), { whip: true }],
    [W(11, 'relax') - 4, (u) => ({ pos: [0.7, 1.75, -1.5], look: [1.7, 1.65, -0.8], fov: 40, cinf: 14 })],
    [STOPS - 10, (u) => ({ pos: [hoof[0] + 0.9, 0.4, hoof[2] + 1.3], look: [hoof[0], 0.35, hoof[2]], fov: 38 * K.punch(f, STOPS, 0.2, 6), cinf: 14, noPush: true })],
    [L[12][0] - 4, (u) => ({ pos: [lerp(-1.5, 1.5, u), 1.6, 0.6], look: [lerp(-1.2, 1.2, u), 1.6, 2.6], fov: 42, cinf: 10 }), { whip: true }],
    [L[12][0] + 36, (u) => ({ pos: [head[0] + 1.0, 1.8, head[2] + 1.6], look: [head[0], 1.6, head[2]], fov: 38, cinf: 14 })],
    [L[13][0] - 4, (u) => ({ pos: [hoof[0] - 1.0, 0.4, hoof[2] + 1.5], look: [hoof[0], 0.45, hoof[2]], fov: 42, cinf: 14 }), { whip: true }],
  ];
  const R = D.runShots(S, f, TOTAL), cam = R.cam;
  if ((R.id === 3 || R.id === 18) && count > 0) D.card(fx, f, f - 2, String(R.id === 18 ? count + 9 : count), cam, R.id === 18 ? '#ff5a3a' : '#f6c83a', 230, 4, 0.45);
  if (R.id === 7) D.card(fx, f, W(4, 'thirteen'), '13 EXPERTS', cam, '#ffffff', 170, 40, 0.5);
  return { light: EXT, cam, dof: R.dof, actors: [], fx };
}
export default { TOTAL, look: 'rich', build, frame };
