// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why did a gray horse beat Peter Cooper's steam train?" (true story: the Tom Thumb vs. the stagecoach horse,
// Baltimore & Ohio Railroad, 28 Aug 1830; a blower belt slipped and the horse won, but the B&O went steam anyway).
// Set: summer Maryland countryside, two parallel tracks, a little vertical-boiler engine racing a horse-drawn rail car.
import { TOTAL, LINES, wf } from './tomthumb_timing.js';
import * as PR from '../props.js';
import * as D from './d19.js';
import * as X from './kit3d.js';
const { clamp, lerp, sm } = D;
export { TOTAL };
const L = LINES, W = wf;
let K, ENG, HCAR, HORSE, BELT, FIRE, FIREDOOR, SMOKE = [], WHEELS = [], NEWENG = [], XF = 0, LAMP;
let COOP, BOSS, DRV, P1, P2, P3, SP1, SP2;
const COOP_O = { jacket: '#6a4a32', pants: '#3a3a40', boots: '#1e1a18', hairStyle: 'short', hair: '#4a3020', glasses: true, moustache: '#4a3020', apron: '#d8c8a8', gloves: '#8a6a4a', scarf: '#2a6a8a' };
const BOSS_O = { jacket: '#7a1f2a', pants: '#2a2a30', boots: '#111', hat: 'tophat', hatColor: '#2a1a1a', moustache: '#2a1a12', bowtie: '#f2c230', vest: '#e8d8b0', pockets: true };
const DRV_O = { jacket: '#3a5a8a', pants: '#5a4a3a', boots: '#2a1a12', hat: 'cap', cap: '#c89a3a', scarf: '#c0392b', vest: '#6a5a3a', gloves: '#f2ead8' };
const P1_O = { jacket: '#2a2a34', pants: '#2a2a34', boots: '#111', hat: 'tophat', hatColor: '#4a4a52', glasses: '#333', tie: '#8a2a2a', vest: '#8a8a92' };
const P2_O = { jacket: '#7a4a8a', dress: '#7a4a8a', hairStyle: 'bun', hair: '#6a3a1a', scarf: '#f2e6c0', collar: '#ffffff' };
const P3_O = { jacket: '#4a6a3a', pants: '#3a3a30', boots: '#2a1a12', hat: 'cowboy', hatColor: '#5a4030', bowtie: '#2a4a8a', moustache: '#c8c0b0', belt: '#3a2a1a' };
const SP1_O = { jacket: '#c8a040', pants: '#4a5a7a', boots: '#3a2a1a', hat: 'cowboy', hatColor: '#c8a878', vest: '#8a3a2a', scarf: '#2a8a5a', pockets: true };
const SP2_O = { jacket: '#e86a5a', dress: '#e86a5a', hairStyle: 'ponytail', hair: '#2a1a12', apron: '#f4efe4', collar: '#ffffff' };
const EXT = { az: 55, el: 42, sky: '#d8ecf8', ground: '#7a9a50', hemi: 1.05, sun: '#fff0d8', sunI: 3.2, skyTop: '#3f80d0', skyHor: '#e6f0f4', fog: '#dce8ee', fogNear: 60, fogFar: 330,
  sat: 1.16, vig: 0.22, shadowExt: 16, exposure: 1.12, ink: 0.55, bloom: 0.6 };
const TZ = 0, HZ = 2.6;           // train track, horse track (both run along +x)

// ---------- race positions (precomputed) ----------
let XT = [], XH = [], START, ROAR, PASS, SNAP, TROT, WIN;
function race() {
  START = W(4, 'bolts') - 6; ROAR = W(5, 'roars'); PASS = W(5, 'passes') + 4; SNAP = W(7, 'snaps'); TROT = W(9, 'trots') + 6; WIN = W(9, 'wins') + 4;
  const N = TOTAL + 200; let xh = 0, vh = 0;
  const gap = (g) => g < START ? 0 : g < ROAR ? lerp(0, -12, sm(START, ROAR, g)) : g < PASS ? lerp(-12, 0, (g - ROAR) / (PASS - ROAR))
    : g < SNAP ? lerp(0, 13, sm(PASS, SNAP + 10, g)) : g < TROT ? lerp(lerp(0, 13, sm(PASS, SNAP + 10, SNAP)), 0, sm(SNAP, TROT, g)) : 0;
  let xt = 0, vt = 0;
  for (let g = 0; g < N; g++) {
    const tv = g < START ? 0 : g < WIN ? 5.2 : g < WIN + 40 ? lerp(5.2, 1.3, (g - WIN) / 40) : g < WIN + 90 ? lerp(1.3, 0, (g - WIN - 40) / 50) : 0;
    vh += (tv - vh) * 0.12; xh += vh / 30; XH.push(xh);
    if (g < TROT) { xt = xh + gap(g); vt = g > 0 ? (xt - XT[g - 1]) * 30 : 0; }
    else { vt = Math.max(0.3, vt * 0.97); xt += vt / 30; }
    XT.push(xt);
  }
  XF = XH[WIN] + 1.4;
}
const xt = (g) => XT[clamp(Math.round(g), 0, XT.length - 1)];
const xh = (g) => XH[clamp(Math.round(g), 0, XH.length - 1)];

function makeEngine(col, trim, s = 1) {
  const { THREE } = K; const g = K.group(); g.scale.setScalar(s);
  const iron = K.mat('metal', '#2a2a2e'), brass = K.toon({ color: '#d8a840', plain: true, roughness: 0.3 }), wood = K.mat('wood', '#8a5a34');
  K.slab(-2.1, 0.25, 0.55, 0.72, -0.78, 0.78, wood, g);
  K.slab(0.1, 0.35, 0.3, 0.6, -0.8, 0.8, K.mat('metal', '#b8322f'), g);          // buffer beam
  const wh = [];
  for (const wx of [-0.15, -1.6]) for (const wz of [-0.62, 0.62]) {
    const w = K.group(g); w.position.set(wx, 0.42, wz);
    const m = K.cyl(0.42, 0.42, 0.1, K.mat('metal', '#3a3a40'), 0, -0.05, 0, w); m.rotation.x = Math.PI / 2; m.position.set(0, 0, 0);
    for (let k = 0; k < 3; k++) { const sp = K.slab(-0.4, 0.4, -0.025, 0.025, -0.06, 0.06, K.toon({ color: trim, plain: true }), w); sp.rotation.z = k * Math.PI / 3; }
    K.sphere(0.08, brass, 0, 0, wz > 0 ? 0.06 : -0.06, w); wh.push(w);
  }
  K.cyl(0.46, 0.46, 1.6, K.mat('metal', col, { amt: 0.25 }), -0.75, 0.72, 0, g);    // upright boiler
  for (const y of [0.95, 1.6, 2.2]) K.cyl(0.48, 0.48, 0.07, brass, -0.75, y, 0, g);
  K.sphere(0.46, K.mat('metal', col), -0.75, 2.32, 0, g, 1, 0.45, 1);
  K.cyl(0.12, 0.13, 1.3, iron, -0.75, 2.4, 0, g); K.cyl(0.26, 0.13, 0.35, iron, -0.75, 3.6, 0, g);
  K.sphere(0.12, brass, -0.75, 2.62, 0.3, g);                                         // steam dome / whistle
  const door = K.slab(-0.42, -0.3, 0.8, 1.1, -0.2, 0.2, K.toon({ color: '#ff8a30', plain: true, emissive: '#ff6a10' }), g);
  K.cyl(0.3, 0.28, 0.75, K.mat('wood', '#7a4a2a'), -1.75, 0.72, -0.02, g);                // water barrel
  for (const y of [0.82, 1.35]) K.cyl(0.315, 0.315, 0.04, iron, -1.75, y, -0.02, g);
  const fan = K.slab(-1.95, -1.4, 0.72, 1.25, 0.3, 0.75, K.mat('metal', '#5a5a62'), g);   // the blower box
  K.cyl(0.18, 0.18, 0.06, brass, -1.65, 1.0, 0.8, g).rotation.x = Math.PI / 2;
  for (const [x0, x1] of [[-2.05, -1.95], [0.1, 0.2]]) for (const z of [-0.75, 0.75]) K.slab(x0, x1, 0.72, 1.6, z - 0.04, z + 0.04, iron, g);
  K.slab(-2.05, -1.95, 1.55, 1.62, -0.78, 0.78, iron, g);
  return { g, wheels: wh, door, fan };
}
function car(seatCol, s = 1) {
  const g = K.group(); const wood = K.mat('wood', '#b0703a', { detail: 0.4 });
  K.slab(-1.5, 1.5, 0.6, 0.78, -0.8, 0.8, K.mat('wood', '#6a4428'), g);
  for (const z of [-0.8, 0.8]) K.slab(-1.5, 1.5, 0.78, 1.2, z - 0.05, z + 0.05, wood, g);
  for (const x of [-1.5, 1.5]) K.slab(x - 0.05, x + 0.05, 0.78, 1.2, -0.8, 0.8, wood, g);
  for (const x of [-0.9, 0.5]) K.slab(x - 0.3, x + 0.3, 0.78, 1.2, -0.7, 0.7, K.mat('fabric', seatCol), g);
  for (const [x, z] of [[-1.45, -0.75], [1.45, -0.75], [-1.45, 0.75], [1.45, 0.75]]) K.slab(x - 0.04, x + 0.04, 1.2, 2.3, z - 0.04, z + 0.04, wood, g);
  K.slab(-1.6, 1.6, 2.3, 2.4, -0.9, 0.9, K.mat('fabric', '#e8dcc0'), g);
  const wh = [];
  for (const wx of [-1.0, 1.0]) for (const wz of [-0.62, 0.62]) { const w = K.group(g); w.position.set(wx, 0.36, wz); const m = K.cyl(0.36, 0.36, 0.08, K.mat('metal', '#3a3a40'), 0, -0.04, 0, w); m.rotation.x = Math.PI / 2; m.position.set(0, 0, 0); K.slab(-0.34, 0.34, -0.03, 0.03, -0.05, 0.05, K.toon({ color: '#c8a040', plain: true }), w); wh.push(w); }
  return { g, wheels: wh };
}
let TCAR;
function track(z, x0, x1, parent) {
  const { THREE } = K, mats = [];
  for (let x = x0; x < x1; x += 0.75) mats.push(new THREE.Matrix4().makeTranslation(x, 0.06, z));
  K.add(PR.mergeCopies(new THREE.BoxGeometry(0.22, 0.12, 1.9), mats), K.mat('wood', '#6a4a30', { detail: 0.3 }), 0, 0, 0, parent);
  for (const s of [-0.62, 0.62]) K.slab(x0, x1, 0.12, 0.2, z + s - 0.04, z + s + 0.04, K.mat('metal', '#6a6a72'), parent);
  K.slab(x0, x1, -0.05, 0.03, z - 1.3, z + 1.3, K.mat('dirt', '#a88a64', { detail: 0.5 }), parent, false);
}

function build(k) {
  K = k; D.init(K); X.init(K); const { THREE } = K; race();
  K.slab(-120, 1100, -0.3, 0, -200, 200, K.mat('grime', '#7aae4c', { amt: 0.5, detail: 2 }), K.scene, false);
  track(TZ, -30, XF + 120); track(HZ, -30, XF + 120);
  track(-7, XF - 40, XF + 60);                                                       // siding for the new engines
  // hills, trees, fences, fields
  const hill = K.mat('grime', '#6a9a44', { amt: 0.4, detail: 4 });
  for (let i = 0; i < 18; i++) { const x = -60 + i * 70, s = 30 + (i * 37) % 25; K.sphere(s, hill, x, -s * 0.6, -110 - (i % 3) * 30, K.scene, 1.6, 1, 1); K.sphere(s * 0.8, hill, x + 30, -s * 0.5, 120 + (i % 2) * 30, K.scene, 1.6, 1, 1); }
  const r = X.rnd(7), bark = K.mat('wood', '#5a3a24'), leafs = ['#3f7a34', '#4a8a3a', '#5a9a40'].map((c) => K.mat('grime', c, { amt: 0.5 }));
  for (let x = -40; x < XF + 120; x += 9 + r() * 10) { X.tree(x, -9 - r() * 25, 1.6 + r(), bark, leafs[Math.floor(r() * 3)], K.scene, r); if (r() > 0.4) X.tree(x + 4, 12 + r() * 30, 1.5 + r(), bark, leafs[Math.floor(r() * 3)], K.scene, r); }
  const fw = K.mat('wood', '#c8b08a');
  for (let x = -30; x < XF + 100; x += 60) { X.fence(x, x + 40, -4.2, 1.0, fw); X.fence(x + 10, x + 50, 6.8, 1.0, fw); }
  const corn = K.mat('fabric', '#d8c050', { detail: 0.2 });
  for (let x = 30; x < XF + 80; x += 90) for (let j = 0; j < 6; j++) K.slab(x, x + 40, 0, 1.4, 9 + j * 1.6, 9.6 + j * 1.6, corn);
  // start: Ellicott's Mills platform, shed, mill, sign, barrels, a hay cart for scale
  K.slab(-12, 4, 0, 0.5, -3.6, -1.5, K.mat('wood', '#9a6a40', { detail: 0.6 }));
  K.add(new THREE.BoxGeometry(6, 4, 4), K.toon({ map: PR.facadeTex('#a8483a', 3, 2, 4, '#e8dcc4'), kind: 'brick', amt: 0.1 }), -7, 2.5, -6);
  K.slab(-10.5, -3.5, 4.5, 4.7, -8.3, -3.7, K.mat('metal', '#5a3a3a'));
  D.sign(4, 0.8, D.txtTex(640, 128, '#2a3a5a', '#f6e6b0', ["ELLICOTT'S MILLS"], 'bold 70px Georgia, serif'), -7, 3.6, -3.95, 0, K.scene);
  for (const [x, z] of [[-3, -2.2], [-2.2, -2.6], [-11, -2.4]]) K.cyl(0.35, 0.35, 0.9, K.mat('wood', '#8a5a34'), x, 0.5, z);
  const hay = K.group(); hay.position.set(0.8, 0, -6.6);
  K.slab(-1.6, 1.6, 0.6, 0.75, -0.8, 0.8, K.mat('wood', '#9a6a3a'), hay); K.slab(-1.4, 1.4, 0.75, 1.6, -0.7, 0.7, K.mat('fabric', '#e8c860', { detail: 0.1 }), hay);
  for (const x of [-1, 1]) for (const z of [-0.85, 0.85]) { const w = K.cyl(0.45, 0.45, 0.08, K.mat('wood', '#6a4428'), x, 0.45, z, hay); w.rotation.x = Math.PI / 2; w.position.y = 0.45; }
  K.solid(hay);
  const ms = K.group(); ms.position.set(6.5, 0, 5.2); K.cyl(0.06, 0.06, 1.6, K.mat('wood', '#6a4428'), 0, 0, 0, ms);
  D.sign(1.4, 0.7, D.txtTex(512, 256, '#f2ead8', '#2a1a12', ['BALTIMORE', '13 MI'], 'bold 84px Georgia, serif'), 0, 1.7, 0.05, 0, ms, 'wood');
  // stagecoach parked at the start
  const sc = K.group(); sc.position.set(-6, 0, 6.0);
  K.slab(-1.4, 1.4, 0.7, 2.2, -0.75, 0.75, K.mat('wood', '#2a4a6a'), sc); K.slab(-1.5, 1.5, 2.2, 2.35, -0.85, 0.85, K.mat('wood', '#c8a040'), sc);
  for (const x of [-1.0, 1.0]) for (const z of [-0.8, 0.8]) { const w = K.cyl(0.55, 0.55, 0.08, K.mat('wood', '#7a2a2a'), x, 0.55, z, sc); w.rotation.x = Math.PI / 2; w.position.y = 0.55; }
  D.sign(1.6, 0.4, D.txtTex(512, 128, '#2a4a6a', '#f2c230', ['STAGE LINE'], 'bold 72px Georgia, serif'), 0, 1.6, 0.77, 0, sc);
  K.solid(sc);
  // finish: banner, poles, flags, a little crowd stand
  for (const z of [-2.2, 4.6]) K.cyl(0.08, 0.08, 4.4, K.mat('wood', '#6a4428'), XF, 0, z);
  D.sign(6.8, 1.0, D.txtTex(1024, 150, '#c0392b', '#ffffff', ['BALTIMORE  FINISH'], 'bold 96px Georgia, serif'), XF, 3.9, 1.2, Math.PI / 2, K.scene, 'fabric');
  for (let i = 0; i < 8; i++) { const fl = K.slab(-0.2, 0.2, -0.25, 0, -0.01, 0.01, K.toon({ color: ['#f2c230', '#2a6ab0', '#ffffff', '#c0392b'][i % 4], plain: true, side: THREE.DoubleSide }), K.scene); fl.position.set(XF, 3.3, -2.0 + i * 0.85); fl.rotation.y = Math.PI / 2; }
  K.slab(XF + 3, XF + 9, 0, 0.6, 6.0, 8.0, K.mat('wood', '#9a6a40'));
  K.add(new THREE.BoxGeometry(5, 3.4, 4), K.toon({ map: PR.facadeTex('#c8b890', 3, 2, 8, '#ffffff'), kind: 'plaster', amt: 0.1 }), XF - 18, 1.7, -13);
  // barn the horse walks home to
  K.slab(XF + 14, XF + 22, 0, 5, 22, 28, K.mat('wood', '#a8322a', { detail: 1.6 })); K.slab(XF + 13.6, XF + 22.4, 5, 5.4, 21.6, 28.4, K.mat('metal', '#4a4a4a'));
  K.slab(XF + 16.5, XF + 19.5, 0, 3.4, 21.9, 22, K.mat('wood', '#e8dcc4'));
  // engines
  const E = makeEngine('#2f5a3a', '#c0392b'); ENG = E.g; WHEELS = E.wheels; FIREDOOR = E.door;
  TCAR = car('#c0392b'); HCAR = car('#2a6ab0');
  const shaftM = K.mat('wood', '#6a4428');
  for (const z of [-0.45, 0.45]) K.beam(new THREE.Vector3(1.5, 0.95, z), new THREE.Vector3(3.6, 1.25, z * 0.7), 0.05, shaftM, HCAR.g);
  BELT = K.group(ENG); K.slab(-0.02, 0.02, -0.03, 0.03, -0.02, 0.02, K.toon({ color: '#1a1a1a', plain: true }), BELT);
  const bm = K.toon({ color: '#3a2a1a', plain: true });
  K.beam(new THREE.Vector3(-1.65, 1.15, 0.84), new THREE.Vector3(-1.6, 0.55, 0.84), 0.025, bm, BELT); K.beam(new THREE.Vector3(-1.75, 1.0, 0.84), new THREE.Vector3(-1.7, 0.4, 0.84), 0.025, bm, BELT);
  for (const [c, t] of [['#7a3a2a', '#f2c230'], ['#2a3a6a', '#e8e8e8'], ['#3a3a3a', '#c0392b']]) NEWENG.push(makeEngine(c, t, 1.25));
  NEWENG.forEach((e, i) => { e.g.position.set(XF - 8 + i * 9, 0, -7); });
  LAMP = K.lamp(0, 1, 0, { color: '#ff9a40', intensity: 2.2, distance: 5, flicker: 0.2, glowS: 0.6 });
  // smoke pool
  const stex = PR.canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 4, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.6, 'rgba(255,255,255,0.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  for (let i = 0; i < 44; i++) { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: stex, transparent: true, depthWrite: false })); sp.userData.ndSkip = true; K.scene.add(sp); SMOKE.push(sp); }
  HORSE = K.animal('horse', { seed: 3, color: '#a8a8b0', scale: 1.3 });
  COOP = K.stick(COOP_O, { key: 'coop' }); BOSS = K.stick(BOSS_O, { key: 'boss' }); DRV = K.stick(DRV_O, { key: 'drv' });
  P1 = K.stick(P1_O, { key: 'p1' }); P2 = K.stick(P2_O, { key: 'p2' }); P3 = K.stick(P3_O, { key: 'p3' }); SP1 = K.stick(SP1_O, { key: 'sp1' }); SP2 = K.stick(SP2_O, { key: 'sp2' });
  K.addClouds(12, 700, 160);
}

// smoke strength + colour by race time
const puffAmt = (g) => g < START ? 0.45 : g < ROAR ? 0.7 + 0.3 * Math.sin(g * 0.5) : g < SNAP ? 1.25 : lerp(1.25, 0.18, sm(SNAP, SNAP + 50, g));
const puffCol = (g) => (g >= START && g < ROAR + 6) ? '#5a5a5e' : g > SNAP + 20 ? '#9a9a9e' : '#f4f4f4';

function frame(f) {
  const T = K.T, fx = [];
  // flash-forward / flashback: the whole world is shown at race time g
  const FF0 = L[1][0] - 4, FB0 = L[11][0] - 4, FB1 = L[12][0] - 4, LP = L[13][0] - 4;
  const g = f < FF0 ? TROT - 26 + f * 0.75 : (f >= FB0 && f < FB1) ? PASS - 34 + (f - FB0) * 0.8 : f >= LP ? TROT - 26 + (f - LP) * 0.6 : f;
  const gi = Math.round(g);
  const ex = xt(g), hx = xh(g), cx = ex - 3.55, hcx = hx - 3.9;
  ENG.position.set(ex, 0, TZ); TCAR.g.position.set(cx, 0, TZ); HCAR.g.position.set(hcx, 0, HZ);
  WHEELS.forEach((w) => { w.rotation.z = -ex / 0.42; }); TCAR.wheels.forEach((w) => { w.rotation.z = -ex / 0.36; }); HCAR.wheels.forEach((w) => { w.rotation.z = -hx / 0.36; });
  // belt flies off at the snap
  const bt = (g - SNAP) / 30;
  if (bt < 0) { BELT.position.set(0, 0, 0); BELT.rotation.set(0, 0, 0); } else { const t = Math.min(bt, 1); BELT.position.set(-1.5 * t - 2 * t, 1.6 * t - 2.6 * t * t + (t >= 1 ? -0.5 : 0), 0.6 * t); BELT.rotation.set(t * 5, 0, t * 7); }
  const fire = g < SNAP ? 1 : lerp(1, 0.12, sm(SNAP, SNAP + 40, g));
  FIREDOOR.material.emissiveIntensity = fire * 1.2; LAMP.base = 2.4 * fire; LAMP.light.position.set(ex - 0.2, 1.0, TZ + 0.5); LAMP.glow.position.set(ex - 0.35, 0.95, TZ);
  // smoke
  SMOKE.forEach((sp, i) => { const a = i * 2 + (gi % 2), ts = g - a, amt = puffAmt(ts); const p = xt(ts);
    sp.visible = a < 80 && amt > 0.05; sp.position.set(p - 0.75 - a * 0.05 - (ts >= START ? (ex - p) * 0.0 : 0), 3.9 + a * 0.045 * (0.6 + amt * 0.4), TZ + Math.sin(ts * 0.7) * 0.1 + a * 0.012);
    sp.scale.setScalar((0.35 + a * 0.028) * (0.5 + amt * 0.6)); sp.material.opacity = Math.max(0, 0.75 * (1 - a / 80) * Math.min(1, amt)); sp.material.color.set(puffCol(ts)); });
  // engines on the siding (bought "within a year"): only after the finish
  NEWENG.forEach((e) => { e.g.visible = f >= FB1; e.wheels.forEach((w, j) => { w.rotation.z = -f * 0.02; }); });
  // horse
  const racing = g >= START && g < WIN + 40, vH = (xh(g + 1) - xh(g - 1)) * 15;
  const home = f >= FB1 && f < LP;
  if (home) {
    const hw = K.walkPath(f, W(12, 'horses') - 30, [[XF + 3, HZ], [XF + 6, 8.5], [XF + 13, 18], [XF + 18, 21]], 1.6);
    HORSE.set(f, { x: hw.x, z: hw.z, yaw: hw.yaw, mode: hw.moving ? 'walk' : 'stand', expr: 'sad', look: 0.2 * Math.sin(f / 25) });
    HCAR.g.position.set(XF - 6, 0, HZ);
  } else HORSE.set(gi, { x: hx, z: HZ, yaw: Math.PI / 2, mode: !racing ? (g < START && g > W(2, 'horse') - 10 ? 'wag' : 'stand') : vH > 3 ? 'run' : vH > 0.3 ? 'walk' : 'stand', speed: vH > 3 ? 1.1 : 1,
    expr: g < START ? (g > L[2][0] ? 'angry' : 'neutral') : g < ROAR ? 'happy' : g < PASS + 30 ? 'shock' : g < W(6, 'poor') + 30 ? 'sad' : g < SNAP + 20 ? 'angry' : 'happy', look: g < START ? 0.3 * Math.sin(g / 20) : 0, nod: racing ? 0.05 * Math.sin(g * 0.6) : 0 });
  if (racing && vH > 3) for (let k = 0; k < 2; k++) { const f0 = gi - (gi % 8) - k * 8; K.puff(gi, f0, xh(f0) - 0.3, HZ + 0.2, 5, 0.32, '#c8b08a'); }
  if (g >= ROAR && g < SNAP + 30) { const f0 = gi - (gi % 6); K.puff(gi, f0, xt(f0) - 1.7, TZ + 0.9, 4, 0.3, '#d8d0c0'); }
  // ---------- acting (keys on race time g so flash-forwards match) ----------
  const PANIC = W(8, 'scrambles');
  D.act(K, COOP, gi, [[0, 'pointUp', { expr: 'proud' }], [W(1, 'size') - 4, 'hips', { expr: 'proud' }], [W(1, 'railroad') - 4, 'think', { expr: 'nervous', sweat: true }], [W(2, 'laugh') - 2, 'cross', { expr: 'stern' }],
    [W(2, 'dare') - 2, 'pointL', { expr: 'angry', talk: true }], [L[3][0], 'hips', { expr: 'stern' }], [START, 'push', { expr: 'nervous', sweat: true }], [W(4, 'coughing') - 3, 'dig', { expr: 'pained', sweat: true }],
    [ROAR - 3, 'celebrate', { expr: 'excited' }], [PASS, 'cheer', { expr: 'laugh' }], [L[6][0] + 20, 'wave', { expr: 'grin' }], [SNAP - 3, 'shock', { expr: 'shock' }], [W(7, 'fire') - 2, 'panic', { expr: 'scared' }],
    [PANIC - 3, 'crouch', { expr: 'scared', sweat: true }], [PANIC + 18, 'grab', { expr: 'nervous', sweat: true }], [W(8, 'crawl') - 4, 'push', { expr: 'pained', sweat: true }], [TROT - 6, 'shock', { expr: 'shock', sweat: true }], [WIN, 'facepalm', { expr: 'sad' }],
    [L[10][0], 'shrug', { expr: 'confused' }], [L[12][0], 'cheer', { expr: 'excited' }]], 4, { x: ex - 1.3, y: 0.72, z: TZ - 0.58, yaw: g >= PANIC - 3 && g < W(8, 'crawl') ? -0.4 : Math.PI / 2 + (g < START ? -0.9 : 0) });
  const PS = [[P1, 11, -0.75, -0.35], [P2, 12, -0.75, 0.35], [P3, 13, 0.6, 0]];
  PS.forEach(([rig, sd, dx, dz], i) => D.act(K, rig, gi, [[0, 'idle', { expr: 'neutral' }], [W(1, 'railroad') - 4, 'cross', { expr: 'nervous', sweat: true }], [W(2, 'laugh') + i * 3, 'angry', { expr: 'angry' }], [START, 'idle', { expr: 'nervous', sweat: i === 0 }],
    [W(4, 'coughing') - 2, 'facepalm', { expr: 'sad' }], [ROAR + i * 3, 'shock', { expr: 'shock' }], [PASS - 6, 'cheer', { expr: 'excited' }], [L[6][0] - 2 + i * 3, 'wave', { expr: 'laugh' }], [W(6, 'hats') + i * 2, 'cheer', { expr: 'laugh' }],
    [SNAP + i * 2, 'shock', { expr: 'scared' }], [PANIC + i * 4, 'panic', { expr: 'nervous', sweat: true }], [TROT, 'facepalm', { expr: 'sad' }], [L[10][0] + i * 4, 'think', { expr: 'confused' }], [W(11, 'machine') + i * 3, 'idea', { expr: 'excited' }], [L[12][0], 'cheer', { expr: 'grin' }]],
    sd, { x: cx + dx, y: 0.78, z: TZ + dz, yaw: Math.PI / 2 + (i === 2 ? Math.PI : 0) + (g >= L[10][0] ? (i === 2 ? 0.6 : -0.6) : 0), seat: 0.42 }));
  D.act(K, DRV, gi, [[0, 'hips', { expr: 'grin' }], [W(2, 'laugh') - 2, 'laugh', { expr: 'laugh' }], [START - 4, 'grab', { expr: 'grin' }], [W(4, 'bolts'), 'cheer', { expr: 'excited' }], [PASS - 4, 'shock', { expr: 'shock' }],
    [W(6, 'poor'), 'angry', { expr: 'angry' }], [SNAP + 4, 'pointL', { expr: 'grin' }], [TROT, 'grab', { expr: 'grin' }], [WIN, 'celebrate', { expr: 'laugh' }], [L[10][0], 'cheer', { expr: 'laugh' }]],
    5, home ? { x: XF - 6 + 1.0, y: 0.78, z: HZ, yaw: Math.PI / 2, seat: 0.42 } : { x: hcx + 1.0, y: 0.78, z: HZ, yaw: Math.PI / 2, seat: 0.42 });
  // stagecoach boss: laughs at the start, cheers at the finish
  const atFinish = g >= L[8][0];
  D.act(K, BOSS, gi, [[0, 'cross', { expr: 'stern' }], [L[2][0] - 4, 'point', { expr: 'laugh' }], [W(2, 'laugh'), 'laugh', { expr: 'laugh' }], [W(2, 'horse') - 4, 'show', { expr: 'proud' }], [W(2, 'dare') - 3, 'pointL', { expr: 'grin', talk: true }],
    [L[3][0] + 10, 'hips', { expr: 'grin' }], [START, 'wave', { expr: 'excited' }], [L[8][0], 'hips', { expr: 'grin' }], [TROT, 'cheer', { expr: 'excited' }], [WIN, 'celebrate', { expr: 'laugh' }], [L[10][0], 'laugh', { expr: 'laugh' }], [W(11, 'machine'), 'shock', { expr: 'shock' }]],
    6, atFinish ? { x: XF + 4.5, y: 0.6, z: 6.6, yaw: Math.PI * 0.85 } : { x: -2.4, z: 5.4, yaw: Math.PI * 0.8 });
  D.act(K, SP1, gi, [[0, 'cross', { expr: 'smile' }], [W(2, 'laugh'), 'laugh', { expr: 'laugh' }], [START, 'cheer', { expr: 'excited' }], [L[8][0], 'idle', { expr: 'neutral' }], [TROT, 'pointL', { expr: 'shock' }], [WIN, 'clap', { expr: 'laugh' }], [W(11, 'machine') + 3, 'shock', { expr: 'shock' }]],
    7, atFinish ? { x: XF + 6.2, y: 0.6, z: 6.9, yaw: Math.PI * 0.9 } : { x: -0.5, z: -2.6, yaw: 0.3, y: 0.5 });
  D.act(K, SP2, gi, [[0, 'clap', { expr: 'smile' }], [W(2, 'laugh') + 4, 'laugh', { expr: 'laugh' }], [START, 'wave', { expr: 'excited' }], [L[8][0], 'clap', { expr: 'excited' }], [TROT, 'ears', { expr: 'shock' }], [WIN, 'cheer', { expr: 'excited' }], [W(11, 'machine') + 6, 'shock', { expr: 'shock' }]],
    8, atFinish ? { x: XF + 7.6, y: 0.6, z: 6.7, yaw: Math.PI * 1.05 } : { x: 1.3, z: -2.7, yaw: -0.2, y: 0.5 });
  // ---------- shots ----------
  const eng = (h) => (q) => [xt(mapG(q)), h, TZ], hor = (q) => [xh(mapG(q)), 0, HZ];
  const tr = (at, off, o = {}) => { const t = K.track(f, at, { off, lag: 2, ...o }); return t; };
  const coopP = [ex - 1.3, 2.2, TZ - 0.58];
  const S = [
    [0, (u) => { const t = tr(hor, [1.5, 0.5, 5.2], { lookY: 1.4 }); return { pos: t.pos, look: [t.look[0] - 1.5, t.look[1], 1.2], fov: 46, cinf: 8 }; }],
    [W(0, 'Peter') - 4, (u) => ({ pos: [coopP[0] + 2.1, 2.4, -2.7], look: [coopP[0], 2.0, coopP[2]], fov: 38, cinf: 14 })],
    [FF0, (u) => ({ pos: [lerp(5.5, 4.2, u), lerp(4.2, 3.2, u), -11], look: [-2, 1.4, 0.5], fov: 48, cinf: 5 }), { whip: true }],
    [W(1, 'size') - 4, (u) => ({ pos: [lerp(5.4, 4.6, u), 1.7, -11.5], look: [-0.6, 1.3, -4.0], fov: 42, cinf: 8 })],
    [W(1, 'railroad') - 4, (u) => ({ pos: [cx + 0.4, 2.3, -4.2], look: [cx - 0.2, 1.6, 0], fov: 42, cinf: 12 })],
    [L[2][0] - 4, (u) => ({ pos: [-2.0, 1.75, 2.4], look: [-2.4, 1.6, 5.4], fov: 36, cinf: 14 }), { whip: true }],
    [W(2, 'bring') - 4, (u) => ({ pos: [hx + 3.8, 2.0, HZ + 3.0], look: [hx + 0.4, 1.6, HZ], fov: 40, cinf: 12 })],
    [W(2, 'dare') - 4, (u) => ({ pos: [ex + 1.4, 2.2, -3.0], look: [coopP[0], 1.95, coopP[2]], fov: 38 * K.punch(f, W(2, 'dare'), 0.14, 6), cinf: 12, noPush: true })],
    [L[3][0] - 4, (u) => ({ pos: [lerp(-15, -13, u), lerp(5.5, 6.5, u), 1.3], look: [12, 0.5, 1.3], fov: 50, cinf: 4 }), { whip: true }],
    [W(3, 'thirteen') - 4, (u) => ({ pos: [6.5 - 1.2, 1.6, 5.2 + 3.4], look: [6.5, 1.6, 5.2], fov: 44, cinf: 12 })],
    [L[4][0] - 4, (u) => { const t = tr(hor, [3.6, 0.9, 4.0], { lookY: 1.3 }); return { pos: t.pos, look: [hx + 0.3, 1.4, HZ], fov: 44, cinf: 8 }; }, { whip: true }],
    [W(4, 'coughing') - 4, (u) => { const t = tr(eng(0), [-2.4, 2.9, -3.6], { lookY: 2.0 }); return { pos: t.pos, look: t.look, fov: 44, cinf: 10 }; }],
    [L[5][0] - 4, (u) => { const t = tr(eng(0), [3.4, 0.5, -2.6], { lookY: 1.6 }); return { pos: t.pos, look: [t.look[0] - 1, t.look[1], 0], fov: 46 * K.punch(f, ROAR, 0.18, 6), cinf: 8, noPush: true }; }, { whip: true }],
    [W(5, 'passes') - 8, (u) => { const t = tr((q) => [(xt(mapG(q)) + xh(mapG(q))) / 2, 0, 1.3], [0, 3.0, -9.5], { lookY: 1.0 }); return { pos: t.pos, look: t.look, fov: 46, cinf: 5 }; }],
    [L[6][0] - 4, (u) => { const t = tr((q) => [xt(mapG(q)) - 3.55, 0, TZ], [2.6, 2.0, -3.8], { lookY: 1.4 }); return { pos: t.pos, look: t.look, fov: 40, cinf: 12 }; }, { whip: true }],
    [W(6, 'poor') - 4, (u) => { const t = tr(hor, [3.8, 2.2, 2.6], { lookY: 1.9 }); return { pos: t.pos, look: [hx + 1.2, 2.0, HZ], fov: 38, cinf: 14 }; }],
    [L[7][0] - 4, (u) => { const sh = K.shake(f, SNAP, 0.05, 12); return { pos: [ex - 1.2 + sh[0], 1.4 + sh[1], TZ + 3.3], look: [ex - 1.65, 0.95, TZ + 0.8], fov: 44 * K.punch(f, SNAP, 0.2, 6), cinf: 18, noPush: true }; }, { whip: true }],
    [W(7, 'fire') - 4, (u) => ({ pos: [ex + 1.5, 1.25, TZ - 1.1], look: [ex - 0.4, 0.95, TZ], fov: 40, cinf: 18 })],
    [L[8][0] - 4, (u) => { const t = tr(eng(0), [-1.2, 1.9, -3.4], { lookY: 1.7 }); return { pos: t.pos, look: [coopP[0], 1.7, coopP[2]], fov: 42, cinf: 12 }; }],
    [W(8, 'wheezes') - 4, (u) => ({ pos: [ex + lerp(-3, 2, u), 2.8, -12], look: [ex, 1.8, 0], fov: 46, cinf: 5 })],
    [L[9][0] - 4, (u) => ({ pos: [Math.max(ex, hx) + 5.5, 0.8, -1.3], look: [(ex + hx) / 2, 1.4, 1.3], fov: 46, cinf: 6 }), { whip: true }],
    [W(9, 'wins') - 6, (u) => ({ pos: [XF + 6, 2.2, -4.5], look: [XF, 1.5, 1.8], fov: 50 * K.punch(f, WIN, 0.15, 6), cinf: 5, noPush: true })],
    [L[10][0] - 4, (u) => ({ pos: [cx + 2.6, 2.1, -2.2], look: [cx, 1.75, 0], fov: 38, cinf: 12 }), { whip: true }],
    [FB0, (u) => { const t = tr((q) => [(xt(mapG(q)) + xh(mapG(q))) / 2, 0, 1.3], [-1.5, 0.7, -7.5], { lookY: 1.5 }); return { pos: t.pos, look: t.look, fov: 46, cinf: 5 }; }, { whip: true }],
    [W(11, 'machine') - 4, (u) => { const t = tr((q) => [xh(mapG(q)) - 3.9 + 1.0, 0, HZ], [2.2, 1.9, 2.8], { lookY: 1.9 }); return { pos: t.pos, look: t.look, fov: 36, cinf: 14 }; }],
    [FB1, (u) => ({ pos: [XF + lerp(12, 8, u), lerp(6.5, 4.5, u), -18], look: [XF + 2, 1.5, -6], fov: 48, cinf: 4 }), { whip: true }],
    [W(12, 'horses') - 4, (u) => { const t = tr((q) => { const h = K.walkPath(q, W(12, 'horses') - 30, [[XF + 3, HZ], [XF + 6, 8.5], [XF + 13, 18], [XF + 18, 21]], 1.6); return [h.x, 0, h.z]; }, [-2.5, 1.6, -3.2], { lookY: 1.4 }); return { pos: t.pos, look: t.look, fov: 44, cinf: 8 }; }],
    [LP, (u) => { const t = tr(hor, [3.6, 2.1, -1.4], { lookY: 2.0 }); return { pos: t.pos, look: [hx + 1.1, 1.9, HZ], fov: 40, cinf: 12 }; }, { whip: true }],
  ];
  // map a frame to race time for the camera trackers (same mapping as above)
  function mapG(q) { return q < FF0 ? TROT - 26 + q * 0.75 : (q >= FB0 && q < FB1) ? PASS - 34 + (q - FB0) * 0.8 : q >= LP ? TROT - 26 + (q - LP) * 0.6 : q; }
  const R = D.runShots(S, f, TOTAL), cam = R.cam;
  
  // hide riders not in the current part of the story
  return { light: EXT, cam, dof: R.dof, actors: [], fx };
}
export default { TOTAL, look: 'rich', build, frame };
