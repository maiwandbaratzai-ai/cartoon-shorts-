// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The swamp rabbit attack" — Plains, Georgia, April 1979: a rabbit swims at the President's fishing boat; he splashes
// it away with a paddle; nobody believes him until the photo turns up; the papers go wild.
import { TOTAL, LINES, wf } from './rabbit_timing.js';
import * as PR from '../props.js';
import * as X from './kit3d.js';
import { blinkAt } from '../motion.js';
const { M, clamp, ramp, lerp, q } = X;

export { TOTAL };
const L = LINES, cut = (i) => Math.max(0, L[i][0] - 4), W = wf;
let K, BUN, PRES, AIDE1, AIDE2, PHOTO, NEWSB, crR, boat, paddle, rod, camB, paperN, photoBoard;

const BUN_O = { jacket: '#8a7462', pants: '#6a5848', boots: '#4a3a30', skin: '#d8c4b0', build: 'kid' };
const PRES_O = { jacket: '#c8a860', pants: '#4a5a6a', boots: '#3a2a20', hat: 'cap', cap: '#3a6a3a', skin: '#f2cfae' };
const PRES2_O = { ...PRES_O, jacket: '#3a4a6a', hat: 'hair', hair: '#c8c0b0' };
const AIDE1_O = { jacket: '#5a3a3a', pants: '#2a2a30', boots: '#1e1a18', hat: 'hair', hair: '#3a2a20', skin: '#f5d0b4' };
const AIDE2_O = { jacket: '#4a6a8a', pants: '#2a2a34', boots: '#1e1a18', hat: 'hair', hair: '#e0c080', skin: '#f2c8a8' };
const PHOTO_O = { jacket: '#7a7a4a', pants: '#3a3a30', boots: '#2a2018', hat: 'cap', cap: '#2a2a2a', skin: '#e8b890' };
const NEWS_O = { jacket: '#c84a3a', pants: '#3a3a44', boots: '#2a2018', hat: 'cap', cap: '#4a4a5a', skin: '#f5d0b4', build: 'kid' };
let PRES2;

const POND = { az: 210, el: 30, sky: '#d8e8f0', ground: '#5a6a3a', hemi: 0.95, sun: '#fff0d0', sunI: 2.8, fog: '#d8e4dc', fogNear: 40, fogFar: 300,
  skyTop: '#4a86d0', skyHor: '#e8f0e0', sat: 1.14, vig: 0.24, shadowExt: 14, exposure: 1.1, ink: 0.55 };
const ROOM = { ...POND, az: 120, el: 40, hemi: 0.6, sunI: 1.6, exposure: 1.15, bloom: 0.5, vig: 0.32, cardTint: '#fff4e4', fog: '#3a3028', fogNear: 20, fogFar: 60 };
const STREET = { ...POND, az: 150, el: 22, sun: '#ffe0b0', skyTop: '#5a7ac0', skyHor: '#f0d8c0', fog: '#e8d8c8' };

function build(k) {
  K = k; X.init(K); const { THREE } = K; const r = X.rnd(1979);
  const grass = K.mat('dirt', '#6a7a3a', { detail: 1.2, amt: 0.4 }), mud = K.mat('dirt', '#6a5a3a'), bark = K.mat('wood', '#6a5a48'), moss = K.mat('fabric', '#8a9a7a', { amt: 0.5 }),
    wood = K.mat('wood', '#8a6038'), dark = K.mat('wood', '#5a3e28'), alu = K.mat('metal', '#a8b0b8', { roughness: 0.4 });
  // pond: water disc + bank ring
  const water = K.add(new THREE.CircleGeometry(26, 64), K.toon({ color: '#4a6a5a', plain: true, roughness: 0.12, metalness: 0.1 }), 0, 0, 0, K.scene, { cast: false }); water.rotation.x = -Math.PI / 2;
  const bank = K.add(new THREE.RingGeometry(25, 46, 64, 2), grass, 0, 0.12, 0, K.scene, { cast: false }); bank.rotation.x = -Math.PI / 2;
  K.slab(-300, 300, -0.4, -0.3, -300, 300, grass, K.scene, false);
  const edge = K.add(new THREE.TorusGeometry(25.5, 0.5, 8, 64), mud, 0, 0, 0); edge.rotation.x = Math.PI / 2;
  for (let i = 0; i < 40; i++) { const a = r() * 6.28, d = 8 + r() * 16; const lp = K.add(new THREE.CircleGeometry(0.35 + r() * 0.3, 16, 0.3, 5.9), K.toon({ color: '#5a8a3a', plain: true }), Math.cos(a) * d, 0.02, Math.sin(a) * d, K.scene, { cast: false }); lp.rotation.x = -Math.PI / 2; }
  for (let i = 0; i < 14; i++) { const a = r() * 6.28, d = 6 + r() * 14; K.add(new THREE.SphereGeometry(0.08, 8, 6), K.toon({ color: ['#f2e8f0', '#f2a0c8'][i % 2], plain: true }), Math.cos(a) * d, 0.06, Math.sin(a) * d); }
  for (let i = 0; i < 160; i++) { const a = r() * 6.28, d = 24 + r() * 3; const c = K.add(new THREE.CylinderGeometry(0.02, 0.025, 1.4 + r(), 5), K.mat('grime', '#6a7a3a'), Math.cos(a) * d, 0.7, Math.sin(a) * d); c.rotation.z = (r() - 0.5) * 0.3;
    if (i % 3 === 0) K.add(new THREE.CapsuleGeometry(0.045, 0.2, 4, 8), K.mat('fabric', '#5a3a22'), Math.cos(a) * d, 1.5, Math.sin(a) * d); }
  // cypress trees with moss
  for (let i = 0; i < 26; i++) { const a = r() * 6.28, d = 27 + r() * 16; const x = Math.cos(a) * d, z = Math.sin(a) * d, s = 1.5 + r();
    K.cyl(0.25 * s, 0.7 * s, 6 * s, bark, x, 0, z); for (let j = 0; j < 3; j++) { const c = K.add(new THREE.SphereGeometry(2.0 * s, 12, 8), K.mat('grime', '#4a6a3a', { amt: 0.6 }), x + (r() - 0.5) * 2 * s, (5.5 + j * 1.4) * s, z + (r() - 0.5) * 2 * s); c.scale.y = 0.45; }
    for (let j = 0; j < 5; j++) { const m = K.add(new THREE.ConeGeometry(0.25 * s, 1.6 * s, 6), moss, x + (r() - 0.5) * 3 * s, 4.6 * s, z + (r() - 0.5) * 3 * s); m.rotation.x = Math.PI; } }
  const lg = K.add(new THREE.CylinderGeometry(0.22, 0.25, 2.2, 14).rotateZ(Math.PI / 2), K.mat('wood', '#6a5040'), 3.4, 0.02, -3.0); lg.rotation.y = 0.4;
  // dock
  K.slab(-1, 1, 0.3, 0.4, 22, 30, wood); for (let z = 22; z < 30; z += 2) for (const x of [-0.9, 0.9]) K.cyl(0.08, 0.08, 1.3, dark, x, -0.8, z);
  // boat (jon boat), faces +x; floor at y=0.0
  boat = K.group(); K.slab(-1.7, 1.7, -0.2, 0.0, -0.65, 0.65, alu, boat); for (const z of [-0.65, 0.65]) K.slab(-1.7, 1.7, -0.2, 0.42, z - 0.03, z + 0.03, alu, boat);
  K.slab(-1.73, -1.67, -0.2, 0.42, -0.65, 0.65, alu, boat); const bow = K.slab(1.6, 1.9, -0.15, 0.42, -0.65, 0.65, alu, boat); bow.rotation.z = 0.5;
  K.slab(-0.6, -0.1, 0.35, 0.42, -0.62, 0.62, wood, boat); // bench
  K.slab(-1.6, -1.3, 0.0, 0.25, -0.3, 0.1, K.mat('metal', '#3a5a8a'), boat); // tackle box
  K.cyl(0.12, 0.12, 0.28, K.mat('metal', '#c83a2a'), 0.9, 0, 0.3, boat); // bait can
  paddle = K.group(); K.cyl(0.02, 0.02, 1.1, wood, 0, -0.55, 0, paddle); K.slab(-0.09, 0.09, -0.85, -0.5, -0.015, 0.015, wood, paddle);
  rod = K.group(); K.cyl(0.012, 0.007, 1.8, K.mat('metal', '#3a3a3a'), 0, -0.2, 0, rod); K.cyl(0.03, 0.03, 0.06, K.mat('metal', '#8a8a8a'), 0, 0.05, 0.04, rod);
  camB = K.group(); K.slab(-0.09, 0.09, -0.06, 0.06, -0.05, 0.05, K.mat('metal', '#2a2a2e'), camB); K.cyl(0.04, 0.04, 0.08, K.mat('metal', '#5a5a60'), 0, -0.04, 0.09, camB).rotation.x = Math.PI / 2;
  // ---- White House room at x=60
  const rm = K.group(); rm.position.set(60, 0, 0);
  K.slab(-5, 5, 0, 0.1, -4, 6, K.mat('fabric', '#2a3a6a', { amt: 0.2 }), rm); K.slab(-5, 5, 0, 3.6, -4.2, -4, K.mat('plaster', '#efe4cc'), rm);
  K.slab(-5.2, -5, 0, 3.6, -4, 6, K.mat('plaster', '#efe4cc'), rm); K.slab(5, 5.2, 0, 3.6, -4, 6, K.mat('plaster', '#efe4cc'), rm);
  K.slab(-5, 5, 0, 1.0, -4.0, -3.92, K.mat('wood', '#e8dcc4'), rm);
  for (const x of [-2.6, 2.6]) { K.slab(x - 0.8, x + 0.8, 1.0, 3.2, -3.98, -3.95, K.mat('grime', '#bcd8f0', { plain: true }), rm); for (const s of [-1, 1]) K.slab(x + s * 0.95 - 0.25, x + s * 0.95 + 0.25, 0.1, 3.5, -3.9, -3.75, K.mat('fabric', '#c8a040', { amt: 0.3 }), rm); }
  const desk = K.group(rm); desk.position.set(0, 0, -2.2); K.slab(-1.2, 1.2, 0, 0.8, -0.5, 0.5, K.mat('wood', '#6a3a1e'), desk); K.slab(-1.25, 1.25, 0.8, 0.86, -0.55, 0.55, K.mat('wood', '#5a2e16'), desk);
  K.slab(-0.9, -0.6, 0.86, 1.0, -0.2, 0.0, K.mat('metal', '#2a2a2a'), desk); K.cyl(0.12, 0.15, 0.5, K.mat('metal', '#c8a040'), 0.8, 0.86, -0.2, desk); K.add(new THREE.ConeGeometry(0.25, 0.25, 16, 1, true), K.toon({ color: '#f2e4c0', plain: true }), 0.8, 1.45, -0.2, desk);
  for (const x of [-4.3, 4.3]) { K.cyl(0.25, 0.2, 0.5, K.mat('metal', '#8a6a3a'), x, 0, -3.3, rm); K.add(new THREE.SphereGeometry(0.55, 12, 8), K.mat('grime', '#4a7a3a', { amt: 0.6 }), x, 1.0, -3.3, rm); }
  for (const x of [-4.95]) for (const z of [-1, 2]) X.sign(0.9, 1.1, X.txtTex(256, 320, '#5a3a1e', '#e8d8b0', ['~'], 'bold 120px Georgia'), x, 2.0, z, Math.PI / 2, rm);
  K.cyl(0.03, 0.03, 2.4, K.mat('metal', '#c8a040'), 4.4, 0, -1.2, rm); K.slab(4.43, 4.45, 1.5, 2.3, -1.2, -0.1, K.mat('fabric', '#2a4a8a', { plain: true }), rm);
  const photo = PR.canvasTex(512, 384, (g, w, h) => { g.fillStyle = '#f2ead8'; g.fillRect(0, 0, w, h); g.fillStyle = '#7a9a8a'; g.fillRect(16, 16, w - 32, h - 32); g.fillStyle = '#4a6a5a'; g.fillRect(16, 200, w - 32, h - 216);
    g.fillStyle = '#b8bcc0'; g.fillRect(40, 190, 230, 40); g.fillStyle = '#c8a860'; g.beginPath(); g.ellipse(150, 160, 34, 46, 0, 0, 7); g.fill(); g.fillStyle = '#f2cfae'; g.beginPath(); g.arc(150, 98, 26, 0, 7); g.fill();
    g.strokeStyle = '#8a6038'; g.lineWidth = 8; g.beginPath(); g.moveTo(170, 130); g.lineTo(280, 230); g.stroke(); g.fillStyle = '#8a7462'; g.beginPath(); g.arc(380, 222, 22, 0, 7); g.fill(); g.fillRect(366, 170, 9, 40); g.fillRect(386, 170, 9, 40);
    g.strokeStyle = '#f2f8ff'; g.lineWidth = 5; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(290 + i * 8, 236); g.lineTo(270 + i * 14, 190 - i * 4); g.stroke(); } });
  photoBoard = K.group(rm); photoBoard.position.set(-1.6, 0, -0.6); for (const s of [-1, 1]) { const lg = K.slab(-0.03, 0.03, 0, 1.8, -0.03, 0.03, dark, photoBoard); lg.position.x = s * 0.5; lg.rotation.z = s * 0.1; }
  K.add(new THREE.PlaneGeometry(1.3, 0.98), K.toon({ map: photo, plain: true, roughness: 0.6 }), 0, 1.45, 0.05, photoBoard, { cast: false });
  K.lamp(60.8, 1.5, -2.4, { color: '#ffd090', intensity: 1.5, distance: 6, glowS: 0.35 }); K.lamp(60, 3.2, 1.5, { color: '#ffe8c8', intensity: 1.6, distance: 9, glow: false });
  K.dust([60, 1.6, -1], [8, 3, 6], 120);
  // ---- street newsstand at x=-60
  const st = K.group(); st.position.set(-60, 0, 0);
  K.slab(-30, 30, 0, 0.05, -30, 30, K.mat('rock', '#a8a49c', { detail: 0.7 }), st, false);
  for (let i = 0; i < 6; i++) K.slab(-15 + i * 5, -10 + i * 5, 0, 8 + (i % 3) * 2, -12, -7, K.toon({ map: PR.facadeTex(['#a8483a', '#c89070', '#8a6a5a'][i % 3], 2, 3, i + 9), kind: 'brick', amt: 0.2 }), st);
  const ns = K.group(st); ns.position.set(0, 0, -3); K.slab(-1.4, 1.4, 0, 2.3, -0.8, 0.8, K.mat('wood', '#2a5a3a'), ns); K.slab(-1.6, 1.6, 2.3, 2.5, -1.0, 1.0, K.mat('wood', '#c83a2a'), ns);
  X.sign(2.6, 0.45, X.txtTex(768, 128, '#f2e8c8', '#2a2a2a', ['NEWS · PAPERS · 15¢'], 'bold 66px Arial'), 0, 2.05, 0.82, 0, ns);
  for (let i = 0; i < 8; i++) { const pp = K.slab(-1.2 + (i % 4) * 0.62, -0.7 + (i % 4) * 0.62, 0.9 + Math.floor(i / 4) * 0.55, 1.35 + Math.floor(i / 4) * 0.55, 0.8, 0.82, K.mat('grime', '#ece8dc', { plain: true }), ns); }
  K.cyl(0.06, 0.06, 3.4, K.mat('metal', '#2a2a2e'), 3, 0, -1, st); K.add(new THREE.SphereGeometry(0.22, 12, 8), K.toon({ color: '#fff0c8', plain: true, emissive: '#fff0c8' }), 3, 3.5, -1, st);
  const car = PR.sedan(K, '#c8a03a', st).root; car.position.set(-4, 0, 3); car.rotation.y = 0.3;
  K.addClouds(8, 700, 160);
  const paper = PR.canvasTex(512, 680, (g, w, h) => { g.fillStyle = '#f2eee2'; g.fillRect(0, 0, w, h); g.fillStyle = '#1a1a1a'; g.font = 'bold 50px Georgia, serif'; g.textAlign = 'center'; g.fillText('THE MORNING POST', w / 2, 66); g.fillRect(20, 86, w - 40, 5);
    g.font = 'bold 92px Georgia, serif'; g.fillText('BUNNY', w / 2, 190); g.fillText('GOES BUGS', w / 2, 280); g.font = 'bold 40px Georgia, serif'; g.fillText('RABBIT ATTACKS PRESIDENT', w / 2, 340);
    g.fillStyle = '#8a7462'; g.beginPath(); g.arc(w / 2, 480, 70, 0, 7); g.fill(); g.fillRect(w / 2 - 50, 340, 26, 100); g.fillRect(w / 2 + 24, 340, 26, 100); g.fillStyle = '#fbf6ea'; g.fillRect(w / 2 - 14, 510, 12, 22); g.fillRect(w / 2 + 2, 510, 12, 22);
    g.fillStyle = '#1a1a1a'; g.beginPath(); g.arc(w / 2 - 25, 465, 8, 0, 7); g.arc(w / 2 + 25, 465, 8, 0, 7); g.fill(); g.fillStyle = '#888'; for (let i = 0; i < 6; i++) g.fillRect(40, 580 + i * 14, w - 80, 4); });
  paperN = K.add(new THREE.PlaneGeometry(0.62, 0.82), K.toon({ map: paper, plain: true, roughness: 0.9 }), -60, 1.4, 1.2, K.scene, { cast: false });
  // characters
  BUN = K.stick(BUN_O, { key: 'bun' }); crR = X.critter(BUN, 'rabbit', '#8a7462', '#e8b0b8');
  PRES = K.stick(PRES_O, { key: 'pres' }); PRES2 = K.stick(PRES2_O, { key: 'pres2' });
  AIDE1 = K.stick(AIDE1_O, { key: 'a1' }); AIDE2 = K.stick(AIDE2_O, { key: 'a2' }); PHOTO = K.stick(PHOTO_O, { key: 'ph' }); NEWSB = K.stick(NEWS_O, { key: 'nb' });
}

const F = { pres: W(0, 'president'), states: W(0, 'states'), swam: W(1, 'swam'), hissing: W(1, 'hissing'), teeth: W(1, 'teeth'), jimmy: W(2, 'jimmy'), fishing: W(2, 'fishing'), georgia: W(2, 'georgia'),
  grabbed: W(3, 'grabbed'), paddle: W(3, 'paddle'), splashed: W(3, 'splashed'), crazy: W(3, 'crazy'), spun: W(4, 'spun'), paddled: W(4, 'paddled'), hissing2: W(4, 'hissing'),
  nobody: W(5, 'nobody'), killer: W(5, 'killer'), come: W(5, 'come'), found: W(6, 'found'), photographer: W(6, 'photographer'), snapped: W(6, 'snapped'), fight: W(6, 'fight'),
  leaked: W(7, 'leaked'), reporter: W(7, 'reporter'), newspapers: W(7, 'newspapers'), wild: W(7, 'wild'), headline: W(8, 'headline'), bunny: W(8, 'bunny'), rabbitA: W(8, 'rabbit'),
  rabbit9: W(9, 'rabbit'), never: W(9, 'never'), caught: W(9, 'caught') };
const BITE = { L: [0.3, -0.5, 'open'], R: [0.35, -0.55, 'open'], expr: 'angry' in {} ? 'stern' : 'stern', tilt: 5 };
const bunKeys = [[0, 'push', { expr: 'stern', tilt: 6 }], [24, 'grab', { expr: 'stern' }], [cut(1), 'push', { expr: 'stern' }], [F.hissing - 3, 'panic', { expr: 'stern' }], [F.teeth - 3, 'grab', { expr: 'grin' }],
  [cut(2), 'push', { expr: 'stern' }], [F.splashed + 4, 'shock'], [F.crazy, 'panic', { expr: 'nervous' }], [F.spun - 2, 'shock'], [F.paddled - 3, 'push', { expr: 'nervous' }], [F.hissing2 - 2, 'angry', { expr: 'stern' }],
  [cut(9), 'hips', { expr: 'grin' }], [F.never - 3, 'pointUp', { expr: 'grin' }], [F.caught, 'cross', { expr: 'grin' }], [TOTAL - 22, 'push', { expr: 'stern' }]];
const presKeys = [[0, 'shock'], [F.pres - 3, 'panic'], [cut(1), 'shock'], [F.teeth, 'scared', { mode: 'sit' }], [cut(2), 'hold', { mode: 'sit', expr: 'smile' }], [F.fishing - 2, 'throwBack', { mode: 'sit', expr: 'smile' }],
  [F.fishing + 6, 'throw', { mode: 'sit', expr: 'grin' }], [F.georgia, 'hold', { mode: 'sit', expr: 'whistle' }], [cut(3), 'grab', { expr: 'shock' }], [F.splashed - 4, 'dig', { expr: 'stern' }],
  [F.spun - 2, 'cheer'], [F.paddled + 6, 'hips', { expr: 'grin' }], [TOTAL - 22, 'shock']];
const pres2Keys = [[0, 'idle'], [cut(5), 'shrug', { expr: 'pained' }], [F.killer, 'angry'], [F.come, 'facepalm'], [cut(6), 'cross', { expr: 'stern' }], [F.snapped, 'pointL', { expr: 'grin' }], [F.fight + 6, 'hips', { expr: 'laugh' }]];
const aide1Keys = [[0, 'idle'], [cut(5), 'clap', { expr: 'laugh' }], [F.killer - 2, 'laugh' in {} ? 'clap' : 'clap', { expr: 'laugh' }], [F.come, 'pointL', { expr: 'laugh' }], [F.snapped + 4, 'shock'], [F.fight, 'facepalm']];
const aide2Keys = [[0, 'idle'], [cut(5), 'shrug', { expr: 'laugh' }], [F.killer, 'clap'], [F.snapped + 6, 'shock'], [F.fight + 4, 'panic']];
const photoKeys = [[0, 'idle'], [F.found - 4, 'walk'], [F.photographer, 'show', { R: [0.42, -0.6, 'open'], expr: 'grin' }], [F.snapped, 'pointL', { expr: 'grin' }]];
const newsKeys = [[0, 'phone', { expr: 'grin' }], [F.newspapers - 4, 'show', { R: [0.5, -0.55, 'paper'], expr: 'laugh' }], [F.wild - 2, 'cheer'], [cut(8), 'read']];

const S = X.shotList([
  { id: 'hook', f: 0, keys: [{ pos: [-2.7, 1.45, 0.75], look: [1.8, 0.45, 0.25], fov: 38 }, { pos: [-2.5, 1.4, 0.7], look: [1.6, 0.45, 0.25], fov: 35 }] },
  { id: 'presCU', f: F.pres - 6, whip: false, keys: [{ pos: [-0.3, 1.15, 2.3], look: [-0.95, 0.95, 0], fov: 36 }, { pos: [-0.35, 1.1, 2.0], look: [-0.95, 0.95, 0], fov: 33 }] },
  { id: 'swim', f: cut(1), keys: [{ pos: [0.9, 0.45, 2.0], look: [3.0, 0.35, 0.3], fov: 36 }, { pos: [0.7, 0.42, 1.8], look: [2.3, 0.35, 0.3], fov: 32 }] },
  { id: 'teeth', f: F.teeth - 4, whip: false, keys: [{ pos: [0.3, 0.45, 1.6], look: [1.8, 0.3, 0.3], fov: 32 }, { pos: [0.35, 0.45, 1.55], look: [1.8, 0.3, 0.3], fov: 29 }] },
  { id: 'wide', f: cut(2), keys: [{ pos: [-9, 3.5, 12], look: [0, 0.5, 0], fov: 44 }, { pos: [-7, 2.8, 9], look: [0, 0.5, 0], fov: 42 }] },
  { id: 'fish', f: F.fishing - 4, whip: false, keys: [{ pos: [0.6, 1.2, 2.6], look: [-0.4, 0.9, 0], fov: 38 }, { pos: [0.4, 1.15, 2.3], look: [-0.4, 0.9, 0], fov: 36 }] },
  { id: 'grab', f: cut(3), keys: [{ pos: [-2.0, 1.3, 2.6], look: [-0.95, 0.85, 0], fov: 40 }, { pos: [-1.9, 1.25, 2.3], look: [-0.95, 0.85, 0], fov: 38 }] },
  { id: 'splash', f: F.splashed - 4, whip: false, keys: [{ pos: [-2.7, 2.1, 1.1], look: [0.5, 0.5, 0.1], fov: 42 }, { pos: [-2.5, 2.05, 1.05], look: [0.5, 0.5, 0.1], fov: 40 }] },
  { id: 'spin', f: cut(4), keys: [{ pos: [3.6, 0.9, 3.2], look: [1.8, 0.3, 0.2], fov: 40 }, { f: F.paddled, pos: [3.5, 0.9, 3.0], look: [1.8, 0.3, 0.2], fov: 40 }, { pos: [3.2, 1.0, 3.0], look: [3.6, 0.3, -1.6], fov: 40 }] },
  { id: 'room', f: cut(5), keys: [{ pos: [60.2, 1.6, 4.8], look: [60, 1.3, 0], fov: 42 }, { pos: [60.1, 1.55, 4.3], look: [60, 1.3, 0], fov: 40 }] },
  { id: 'killer', f: F.killer - 4, whip: false, keys: [{ pos: [61.6, 1.6, 2.4], look: [60.6, 1.5, 0.4], fov: 34 }, { pos: [61.5, 1.6, 2.2], look: [60.6, 1.5, 0.4], fov: 31 }] },
  { id: 'photo', f: cut(6), keys: [{ pos: [59.8, 1.6, 3.6], look: [59.0, 1.3, -0.4], fov: 42 }, { f: F.snapped - 2, pos: [59.6, 1.6, 3.2], look: [59.0, 1.3, -0.4], fov: 40 }, { pos: [58.9, 1.5, 1.0], look: [58.4, 1.45, -0.55], fov: 36 }] },
  { id: 'react', f: F.fight - 2, whip: false, keys: [{ pos: [60.9, 1.65, 2.6], look: [60.6, 1.5, 0.2], fov: 36 }, { pos: [60.85, 1.6, 2.4], look: [60.6, 1.5, 0.2], fov: 33 }] },
  { id: 'street', f: cut(7), keys: [{ pos: [-58.6, 1.3, 3.0], look: [-59.6, 1.2, -0.5], fov: 44 }, { pos: [-58.8, 1.3, 2.6], look: [-59.6, 1.2, -0.5], fov: 42 }] },
  { id: 'paper', f: cut(8), whip: false, keys: [{ pos: [-60, 1.42, 2.9], look: [-60, 1.4, 1.2], fov: 44 }, { pos: [-60, 1.42, 2.75], look: [-60, 1.4, 1.2], fov: 41 }] },
  { id: 'end', f: cut(9), keys: [{ pos: [4.9, 1.1, -1.0], look: [3.4, 0.95, -3.0], fov: 38 }, { f: TOTAL - 24, pos: [4.7, 1.1, -1.3], look: [3.4, 0.95, -3.0], fov: 34 }, { pos: [4.4, 0.9, -1.0], look: [3.2, 0.45, -3.0], fov: 38 }] },
], TOTAL);
const KICKS = [{ f: F.teeth, a: 0.03 }, { f: F.splashed, a: 0.03 }, { f: F.killer, a: 0.02 }, { f: F.bunny, a: 0.02 }];
const SHOWN = new Set();
const put = (rig, keys, seed, pos) => { const A = K.T.act(pos.f, keys, { seed, blink: blinkAt(pos.f, seed) }); rig.set(A, pos); SHOWN.add(rig); return A; };

export default {
  TOTAL, build, look: 'rich',
  frame(f, k) {
    const { c: cam, s } = X.camAt(S, f, KICKS), id = s.id; SHOWN.clear();
    paddle.visible = rod.visible = camB.visible = false;
    const fx = [], push = (x) => x && fx.push(x), u = (a, b) => clamp((f - a) / (b - a));
    const pond = ['hook', 'presCU', 'swim', 'teeth', 'wide', 'fish', 'grab', 'splash', 'spin', 'end'].includes(id);
    // boat rocks
    boat.position.set(-0.6, 0.02 * Math.sin(f * 0.15), 0); boat.rotation.set(0.03 * Math.sin(f * 0.11), 0, 0.03 * Math.sin(f * 0.13) + (id === 'splash' ? 0.04 * Math.sin(f * 0.8) : 0));
    // rabbit path: swims from +x toward the boat, then away
    let bx = 2.2, bz = 0.3, byaw = -Math.PI / 2;
    if (id === 'hook') bx = lerp(2.6, 1.9, u(0, 90)); if (id === 'swim') bx = lerp(3.6, 2.0, u(cut(1), F.teeth));
    if (id === 'teeth') bx = 1.8; if (id === 'grab' || id === 'splash') bx = 1.6;
    if (id === 'spin') { const t = u(F.spun - 2, F.spun + 10); byaw = -Math.PI / 2 + Math.PI * M.back(t); bx = lerp(1.6, 4.5, u(F.paddled - 4, cut(5))); bz = lerp(0.3, -2.4, u(F.paddled - 4, cut(5))); }
    if (id === 'end') { const run = u(TOTAL - 24, TOTAL); bx = 3.4; bz = -3.0; byaw = lerp(-0.3, -Math.PI / 2, run); }
    if (pond && id !== 'wide' && id !== 'fish') put(BUN, bunKeys, 5, { f, x: bx, y: (id === 'end' && f < TOTAL - 24) ? 0.2 : -0.7 + 0.03 * Math.sin(f * 0.4), z: bz, yaw: id === 'end' && f < TOTAL - 24 ? -0.3 : byaw });
    
    if (pond) {
      const presYaw = id === 'fish' || id === 'wide' ? 0.5 : Math.PI / 2 - 0.2;
      put(PRES, presKeys, 3, { f, x: -0.95, y: 0.02 * Math.sin(f * 0.15), z: 0, yaw: presYaw, seat: 0.38 });
      if (['wide', 'fish', 'presCU', 'hook'].includes(id) || f < F.grabbed - 2) { X.holdAt(PRES, rod, 1, [0.9, 0, -0.5]); }
      if (['grab', 'splash', 'spin'].includes(id) && f >= F.grabbed - 2) X.holdAt(PRES, paddle, 1, [0, 0, f > F.splashed - 4 && f < F.spun ? -1.2 - 0.6 * Math.sin(f * 0.9) : -0.4]);
      if (id === 'wide' && f < cut(2) + 10) { }
      if (id === 'splash' || (id === 'grab' && f > F.splashed - 6)) for (let i = 0; i < 3; i++) { const t = ((f + i * 6) % 18) / 18; push(X.FX('sp' + i + q(t, 1), (p) => K.T.fxSplash(p, t), [1.0 + i * 0.3, -0.3, 0.2 - i * 0.2], 0.55, { order: 6 })); }
      if (id === 'swim' || id === 'hook') { const t = (f % 20) / 20; push(X.FX('wk' + q(t, 1), (p) => K.T.fxSplash(p, t), [bx + 0.35, -0.55, bz], 0.3, { order: 6 })); }
    }
    if (['room', 'killer', 'photo', 'react'].includes(id)) {
      put(PRES2, pres2Keys, 3, { f, x: 60.6, z: 0.3, yaw: id === 'photo' ? -0.6 : -0.2 });
      put(AIDE1, aide1Keys, 7, { f, x: 59.3, z: 0.9, yaw: 0.6 }); put(AIDE2, aide2Keys, 8, { f, x: 61.6, z: 1.0, yaw: -0.7 });
      if (id === 'photo' || id === 'react') put(PHOTO, photoKeys, 9, { f, x: lerp(57.6, 58.6, u(cut(6), F.photographer)), z: 0.0, yaw: 0.9 });
      photoBoard.visible = id === 'photo' || id === 'react';
    }
    if (id === 'street') { put(NEWSB, newsKeys, 4, { f, x: -59.2, z: 0.2, yaw: -0.3 }); put(AIDE2, aide2Keys, 8, { f, x: -61.0, z: -0.4, yaw: 0.5 }); }
    paperN.visible = id === 'paper'; if (id === 'paper') { paperN.rotation.z = 0.03 * Math.sin(f * 0.2); }
    for (const r of [BUN, PRES, PRES2, AIDE1, AIDE2, PHOTO, NEWSB]) if (!SHOWN.has(r)) r.root.visible = false;
    for (const e of crR.ears) e.rotation.x = -0.1 + 0.15 * Math.sin(f * 0.3);
    // word cards
    if (id === 'presCU') push(X.wordCard(f, Math.max(F.pres, 50), 'THE PRESIDENT', cam, '#ffffff', 1e9, 170, 0.62, 1.6));
    if (id === 'swim') push(X.wordCard(f, F.hissing, 'HISSSS!', cam, '#ff5a3a', 1e9, 200, 0.62, 1.6));
    if (id === 'wide') push(X.wordCard(f, F.georgia, 'GEORGIA, 1979', cam, '#f6c83a', 1e9, 170, 0.62, 2));
    if (id === 'grab') push(X.wordCard(f, F.paddle, 'PADDLE!', cam, '#f6c83a', 1e9, 200, 0.62, 1.8));
    if (id === 'splash') push(X.wordCard(f, F.crazy, 'SPLASH SPLASH!', cam, '#9fd4ff', 1e9, 170, 0.62, 1.8));
    if (id === 'killer') push(X.wordCard(f, F.killer, 'A KILLER RABBIT?', cam, '#ff5a3a', 1e9, 160, 0.62, 1.6));
    if (id === 'photo') push(X.wordCard(f, F.snapped, 'PHOTO PROOF', cam, '#9ad04a', 1e9, 170, 0.62, 1.6));
    if (id === 'street') push(X.wordCard(f, F.wild, 'WENT WILD', cam, '#f6c83a', 1e9, 190, 0.62, 1.8));
    if (id === 'end') push(X.wordCard(f, F.never, 'NEVER CAUGHT', cam, '#ff5a3a', 1e9, 180, 0.62, 1.8));
    const cl = { hook: [[1.8, 0.4, 0.2], 9], presCU: [[-0.8, 0.9, 0], 13], swim: [[2.0, 0.4, 0.3], 12], teeth: [[1.8, 0.4, 0.3], 16], fish: [[-0.95, 0.9, 0], 12], grab: [[-0.6, 0.8, 0], 10],
      splash: [[0.6, 0.5, 0], 8], spin: [[2.6, 0.4, -0.5], 10], room: [[60.3, 1.3, 0.5], 8], killer: [[60.6, 1.5, 0.3], 13], photo: [[58.6, 1.3, -0.4], 10], react: [[60.6, 1.5, 0.3], 13],
      street: [[-59.5, 1.2, 0], 10], paper: [[-60, 1.4, 1.2], 14], end: [[3.4, 1.0, -3], 12] };
    const dof = cl[id] ? X.focusOn(cam, cl[id][0], cl[id][1]) : { focus: 10, cinf: 4 };
    const light = pond ? POND : id === 'street' || id === 'paper' ? STREET : ROOM;
    return { light, cam, dof, actors: [], fx };
  },
};
