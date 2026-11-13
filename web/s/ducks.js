// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The Friendly Floatees" — 28,800 bath toys lost in the North Pacific, 10 Jan 1992. 64 s TikTok cut. Timed via ducks_timing.js.
import { TOTAL, LINES, wf } from './ducks_timing.js';
import * as PR from '../props.js';
import { INK } from '../toon.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const F_1992 = wf(0, '1992'), F_288 = wf(0, '28'), F_PAC = wf(0, 'pacific'), F_STORM = wf(1, 'storm'), F_OVER = wf(2, 'overboard'), F_DUCKS = wf(2, 'ducks'), F_FROGS = wf(2, 'frogs'),
  F_BEAV = wf(2, 'beavers'), F_TURT = wf(2, 'turtles'), F_DISS = wf(3, 'dissolved'), F_POP = wf(3, 'popped'), F_ARMY = wf(4, 'army'), F_CAPT = wf(4, 'captain'), F_MAP = wf(4, 'map'),
  F_ALASKA = wf(5, 'alaska'), F_2000 = wf(5, '2'), F_CURTIS = wf(6, 'curtis'), F_CURR = wf(6, 'currents'), F_REPORT = wf(7, 'report'), F_HUND = wf(8, 'hundreds'), F_STRANGE = wf(9, 'strangest'),
  F_ARCTIC = wf(10, 'arctic'), F_ICE = wf(11, 'ice'), F_YEARS = wf(11, 'years'), F_WHITE = wf(12, 'white'), F_GREEN = wf(12, 'green'), F_2003 = wf(13, '2003'), F_REWARD = wf(13, 'reward'),
  F_COLL = wf(14, 'collectors'), F_HUND2 = wf(14, 'hundreds'), F_HOW = wf(15, 'how'), F_ARC2 = wf(15, 'arctic');
const SHOTS = [['hook', 0], ['storm', cut(1)], ['over', cut(2)], ['toys', F_DUCKS - 6], ['boxes', cut(3)], ['army', cut(4)], ['alaska', cut(5)], ['curtis', cut(6)], ['report', cut(7)], ['hundreds', cut(8)],
  ['rehook', cut(9)], ['arctic', cut(10)], ['frozen', cut(11)], ['bleach', cut(12)], ['reward', cut(13)], ['collect', cut(14)], ['alone', cut(15)], ['loop', F_ARC2 + 8]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const STORM = { az: 200, el: 30, sky: '#9aa8b8', ground: '#3a4450', hemi: 1.4, sun: '#c8d4e4', sunI: 1.3, fog: '#5a6878', fogNear: 60, fogFar: 520, skyTop: '#2a3444', skyHor: '#6a7888', sat: 0.95, vig: 0.32, shadowExt: 40 };
const DAWN = { az: 10, el: 10, sky: '#ffd8b8', ground: '#5a6a80', hemi: 1.2, sun: '#ffd0a0', sunI: 2.4, fog: '#f0c8b0', fogNear: 100, fogFar: 900, skyTop: '#4a5ab8', skyHor: '#ffc89a', sat: 1.15, vig: 0.26, shadowExt: 30 };
const DAY = { az: 140, el: 40, sky: '#d8e8f8', ground: '#7a8a6a', hemi: 1.15, sun: '#fff2dc', sunI: 2.5, fog: '#d4e4f0', fogNear: 150, fogFar: 1100, skyTop: '#3d82d4', skyHor: '#dfeaf4', sat: 1.1, vig: 0.2, shadowExt: 24 };
const POLAR = { az: 160, el: 18, sky: '#e8f0ff', ground: '#9ab0c8', hemi: 1.35, sun: '#fff4e8', sunI: 2.0, fog: '#dce8f4', fogNear: 80, fogFar: 700, skyTop: '#6a90d0', skyHor: '#e8f0f8', sat: 1.0, vig: 0.22, shadowExt: 24 };
const ROOM = { az: 120, el: 60, sky: '#f4e6d0', ground: '#6a5a4a', hemi: 1.2, sun: '#fff0d8', sunI: 2.0, fog: '#4a4038', fogNear: 60, fogFar: 220, skyTop: '#4a4038', skyHor: '#4a4038', sat: 1.05, vig: 0.28, shadowExt: 14 };
const SHIP = [0, 0, -70], AK = [1200, 0, 0], ARC = [-1200, 0, 0], NE = [0, 0, -1300], OFF = [0, 0, 1500];
let K, sea, ship, boxes = [], cont = [], flot, alaskaDucks, arcDucks, iceBlock, frozenDuck, beachBox = [], popDucks = [], mapDots = [];
const C3 = (p, d) => [p[0] + d[0], p[1] + d[1], p[2] + d[2]];
const hh = (zz) => -1.5 + (zz + 8) * 0.12 + Math.max(0, zz + 8 - 30) * 0.25;
const rnd = (() => { let s = 19; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();

const duckGeo = (THREE) => { const parts = [];
  const add = (g, x, y, z, sx = 1, sy = 1, sz = 1) => { g.scale(sx, sy, sz); g.translate(x, y, z); parts.push(g.index ? g.toNonIndexed() : g); };
  add(new THREE.SphereGeometry(0.32, 12, 8), 0, 0.18, 0, 1.25, 0.8, 1); add(new THREE.SphereGeometry(0.2, 12, 8), 0.24, 0.48, 0); add(new THREE.SphereGeometry(0.1, 8, 6), 0.42, 0.44, 0, 1.4, 0.5, 1);
  add(new THREE.SphereGeometry(0.12, 8, 6), -0.36, 0.3, 0, 1, 1.2, 0.8);
  let n = 0; parts.forEach((p) => (n += p.attributes.position.count)); const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3); let o = 0;
  parts.forEach((p) => { pos.set(p.attributes.position.array, o * 3); nor.set(p.attributes.normal.array, o * 3); o += p.attributes.position.count; });
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); return g; };
const flotilla = (THREE, n, r, parent, seed = 1, cols = ['#f6c830', '#f6c830', '#f6c830', '#d8402e', '#4fae4a', '#3a7ad0']) => {
  const g = K.group(parent), geo = duckGeo(THREE); let s = seed; const R = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const byCol = cols.map(() => []); for (let i = 0; i < n; i++) { const a = R() * 6.283, d = r * Math.sqrt(R()); const m = new THREE.Matrix4().makeTranslation(Math.cos(a) * d, -0.05, Math.sin(a) * d).multiply(new THREE.Matrix4().makeRotationY(R() * 6.28)); byCol[(R() * cols.length) | 0].push(m); }
  cols.forEach((c, i) => { if (byCol[i].length) K.add(PR.mergeCopies(geo, byCol[i]), K.col(c), 0, 0, 0, g).frustumCulled = false; });
  return g; };
const duck1 = (parent, col = '#f6c830', s = 1) => { const m = K.add(duckGeo(K.THREE), K.col(col), 0, 0, 0, parent); m.scale.setScalar(s); m.frustumCulled = false; return m; };
const beach = (at, sand = '#d8c49a') => {
  const { THREE } = K, g = K.group(); g.position.set(...at);
  const geo = new THREE.PlaneGeometry(400, 160, 80, 40); geo.rotateX(-Math.PI / 2); const P = geo.attributes.position;
  for (let i = 0; i < P.count; i++) { const z = P.getZ(i) + 80, x = P.getX(i); P.setY(i, -1.5 + z * 0.12 + (z > 30 ? (z - 30) * 0.25 : 0) + 0.3 * Math.sin(x * 0.2)); }
  geo.computeVertexNormals(); K.add(geo, K.toon({ map: PR.speckTex(sand, ['#c8b48a', '#e2d0a8', '#b8a07a'], 4, 2000, 50) }), 0, 0, 72, g, { cast: false }).frustumCulled = false; return g; };

function build(k) {
  K = k; const { THREE } = K;
  K.addClouds(14, 900, 160);
  sea = PR.ocean(K, { y: 0, shoreZ: 400, size: 6000, deep: '#2a5a7a', shal: '#3a7a98', foam: '#eef6f8' });
  // --- cargo ship with container stacks; 12 loose containers at the stern can fall
  ship = K.group(); ship.position.set(...SHIP);
  const hullG = new THREE.BoxGeometry(80, 9, 14, 30, 3, 4), HP = hullG.attributes.position;
  for (let i = 0; i < HP.count; i++) { const x = HP.getX(i), y = HP.getY(i), ax = Math.max(0, (x - 25) / 15); HP.setZ(i, HP.getZ(i) * (1 - 0.8 * ax * ax * clamp((4.5 - y) / 9 + 0.3))); HP.setY(i, y + (x > 30 ? (x - 30) * 0.08 : 0)); }
  hullG.computeVertexNormals();
  const hullT = PR.canvasTex(512, 128, (c) => { c.fillStyle = '#2a4a6a'; c.fillRect(0, 0, 512, 128); c.fillStyle = '#b8302a'; c.fillRect(0, 96, 512, 32); c.fillStyle = '#e8e8e8'; c.font = 'bold 34px Poppins, sans-serif'; c.fillText('PACIFIC  TRADER', 150, 60); });
  K.add(hullG, K.toon({ map: hullT }), 0, 1.0, 0, ship);
  K.slab(-38, 30, 5.5, 5.8, -6.5, 6.5, K.col('#8a4a3a'), ship);
  K.slab(-38, -28, 5.8, 16, -6, 6, K.col('#f2f0e8'), ship); K.slab(-37.9, -28.1, 13.5, 14.6, -6.05, 6.05, K.col('#3a4a5c'), ship); K.cyl(1.2, 1.4, 5, K.col('#c8402e'), -34, 16, 0, ship);
  const ccol = ['#c8402e', '#2f6aa8', '#e8a030', '#3f8a5a', '#8a3a6a', '#d8d0c0', '#4a5a6a'];
  const ctex = ccol.map((c) => K.toon({ map: PR.canvasTex(128, 64, (g) => { g.fillStyle = c; g.fillRect(0, 0, 128, 64); g.fillStyle = 'rgba(0,0,0,.2)'; for (let x = 0; x < 128; x += 8) g.fillRect(x, 0, 3, 64); }) }));
  for (let ix = 0; ix < 9; ix++) for (let iz = 0; iz < 4; iz++) for (let iy = 0; iy < 3; iy++) { if (ix > 5 && iy === 2) continue; K.add(new THREE.BoxGeometry(6.0, 2.6, 2.9), ctex[(ix * 3 + iz * 5 + iy) % 7], -24 + ix * 6.4, 7.1 + iy * 2.6, -4.5 + iz * 3.0, ship); }
  for (let i = 0; i < 12; i++) { const c = K.add(new THREE.BoxGeometry(6.0, 2.6, 2.9), ctex[(i * 3) % 7], 0, 0, 0, ship); c.userData.home = [14.4 + (i % 3) * 6.4, 12.3 + Math.floor(i / 6) * 2.6, -4.5 + (Math.floor(i / 3) % 2) * 3 + (i >= 6 ? 6 : 0)]; cont.push(c); }
  // --- flotillas
  flot = flotilla(THREE, 420, 30, K.scene, 3);
  // floating cardboard boxes + toys that pop out
  for (let i = 0; i < 5; i++) { const b = K.add(new THREE.BoxGeometry(1.0, 0.7, 0.8), K.col('#c8a070'), -3 + i * 1.5, 0.1, -1 + (i % 2) * 1.2); beachBox.push(b);
    popDucks.push(duck1(K.scene, ['#f6c830', '#4fae4a', '#d8402e', '#3a7ad0', '#f6c830'][i], 1.3)); }
  // --- Alaska: beach, rocks, spruce, snowy peaks
  const ak = beach(AK, '#b8a888');
  const M4 = THREE.Matrix4, sp = [];
  for (let i = 0; i < 160; i++) { const x = (rnd() - 0.5) * 300, z = 30 + rnd() * 60; const s = 1 + rnd() * 0.8; sp.push(new M4().makeTranslation(x, hh(z), z).multiply(new M4().makeScale(s, s * 1.4, s))); }
  const spr = []; for (const m of sp) for (let t = 0; t < 3; t++) spr.push(m.clone().multiply(new M4().makeTranslation(0, t * 1.4, 0)).multiply(new M4().makeScale(1 - t * 0.28, 1, 1 - t * 0.28)));
  K.add(PR.mergeCopies(new THREE.ConeGeometry(1.6, 3, 8), spr), K.col('#2f5a3e'), 0, 0, 0, ak).frustumCulled = false;
  for (let i = 0; i < 5; i++) { K.add(new THREE.ConeGeometry(80, 110, 7), K.col('#6a7a90'), -200 + i * 100, 40, 260 + (i % 2) * 40, ak, { cast: false }); K.add(new THREE.ConeGeometry(30, 40, 7), K.col('#f2f6fa'), -200 + i * 100, 75.5, 260 + (i % 2) * 40, ak, { cast: false }); }
  for (let i = 0; i < 14; i++) { const z = 16 + rnd() * 10; K.sphere(0.8 + rnd() * 1.4, K.col('#6a6a70'), (rnd() - 0.5) * 60, hh(z), z, ak, 1.3, 0.7, 1); }
  alaskaDucks = flotilla(THREE, 30, 4.5, ak, 7); alaskaDucks.position.set(0, 0.08, 1.5);
  // --- Arctic: ice floes, a frozen duck
  const arc = K.group(); arc.position.set(...ARC); const iceM = K.col('#f4f8fc'), iceS = K.col('#bcd8ec');
  for (let i = 0; i < 70; i++) { const x = (rnd() - 0.5) * 260, z = -rnd() * 220 + 20; if (Math.hypot(x, z) < 6) continue; const w = 3 + rnd() * 12, d = 3 + rnd() * 10;
    const fl = K.add(new THREE.CylinderGeometry(w * 0.5, w * 0.55, 1.2, 7), iceM, x, 0.1, z, arc); fl.scale.z = d / w; fl.rotation.y = rnd() * 3; }
  for (let i = 0; i < 4; i++) K.add(new THREE.ConeGeometry(14 + i * 4, 20 + i * 6, 5), iceS, -120 + i * 80, 8, -260, arc, { cast: false });
  arcDucks = flotilla(THREE, 60, 14, arc, 11); arcDucks.position.set(0, 0, -6);
  K.add(new THREE.CylinderGeometry(4, 4.3, 1.2, 9), iceM, 0, 0.1, 6, arc);
  iceBlock = K.add(new THREE.BoxGeometry(1.4, 1.2, 1.4), new THREE.MeshToonMaterial({ gradientMap: K.grad, color: '#cfe8f8', transparent: true, opacity: 0.55 }), 0, 1.25, 6, arc);
  frozenDuck = duck1(arc, '#f6c830', 1.4); frozenDuck.position.set(0, 0.85, 6);
  // --- New England: beach + lighthouse + reward poster
  const ne = beach(NE, '#e2d4b0');
  const lh = K.group(ne); lh.position.set(14, hh(34), 34); for (let i = 0; i < 5; i++) K.cyl(2.2 - i * 0.2, 2.4 - i * 0.2, 3, K.col(i % 2 ? '#c8302a' : '#f4f2ec'), 0, i * 3, 0, lh); K.cyl(1.4, 1.4, 2, K.toon({ color: '#ffe8a0', emissive: '#806020' }), 0, 15, 0, lh); K.add(new THREE.ConeGeometry(1.8, 1.6, 10), K.col('#2a2a30'), 0, 17.8, 0, lh);
  const post = K.group(ne); post.position.set(0, hh(12), 12);
  for (const x of [-0.9, 0.9]) K.cyl(0.07, 0.09, 2.6, K.col('#6a4a30'), x, 0, 0, post);
  const rew = PR.canvasTex(320, 400, (c) => { c.fillStyle = '#f2e6c8'; c.fillRect(0, 0, 320, 400); c.strokeStyle = '#3a2a20'; c.lineWidth = 8; c.strokeRect(6, 6, 308, 388); c.fillStyle = '#b8302a'; c.font = 'bold 60px Poppins, sans-serif'; c.textAlign = 'center'; c.fillText('REWARD', 160, 80);
    c.fillStyle = '#f6c830'; c.beginPath(); c.ellipse(150, 210, 70, 50, 0, 0, 7); c.fill(); c.beginPath(); c.arc(205, 160, 38, 0, 7); c.fill(); c.fillStyle = '#e8803a'; c.beginPath(); c.ellipse(248, 166, 22, 10, 0, 0, 7); c.fill(); c.fillStyle = '#2a2a30'; c.beginPath(); c.arc(212, 150, 6, 0, 7); c.fill();
    c.fillStyle = '#3a2a20'; c.font = 'bold 54px Poppins, sans-serif'; c.fillText('$100', 160, 330); c.font = '26px Poppins, sans-serif'; c.fillText('IF FOUND', 160, 370); });
  K.add(new THREE.BoxGeometry(1.6, 2.0, 0.06), new THREE.MeshBasicMaterial({ map: rew }), 0, 1.9, 0.1, post);
  // --- office / collector room on land beyond the sea
  const rm = K.group(); rm.position.set(...OFF);
  K.slab(-12, 12, -0.2, 0, -8, 12, K.col('#8a6a50'), rm, false); K.slab(-12, 12, 0, 8, -3.2, -3, K.col('#e8dcc4'), rm, false); K.slab(-12, -11.8, 0, 8, -3, 12, K.col('#d8ccb4'), rm, false); K.slab(11.8, 12, 0, 8, -3, 12, K.col('#d8ccb4'), rm, false);
  const mapT = PR.canvasTex(640, 400, (c) => { c.fillStyle = '#7ab0d8'; c.fillRect(0, 0, 640, 400); c.fillStyle = '#d8c89a'; c.beginPath(); c.moveTo(0, 0); c.lineTo(250, 0); c.lineTo(230, 60); c.lineTo(150, 90); c.lineTo(60, 140); c.lineTo(0, 220); c.fill();
    c.beginPath(); c.moveTo(640, 0); c.lineTo(330, 0); c.lineTo(380, 50); c.lineTo(470, 70); c.lineTo(540, 130); c.lineTo(600, 260); c.lineTo(640, 400); c.fill();
    c.strokeStyle = '#2a4a8a'; c.lineWidth = 6; c.setLineDash([16, 12]); c.beginPath(); c.ellipse(320, 210, 220, 110, 0, 0, 7); c.stroke(); c.setLineDash([]);
    c.fillStyle = '#2a4a8a'; for (const [x, y, a] of [[100, 210, 1.57], [540, 210, -1.57], [320, 100, 0], [320, 320, 3.14]]) { c.save(); c.translate(x, y); c.rotate(a); c.beginPath(); c.moveTo(-14, -10); c.lineTo(14, 0); c.lineTo(-14, 10); c.fill(); c.restore(); }
    c.fillStyle = '#c8302a'; c.beginPath(); c.arc(120, 260, 10, 0, 7); c.fill(); c.font = 'bold 26px Poppins, sans-serif'; c.fillStyle = '#3a2a20'; c.fillText('ALASKA', 360, 40); c.fillText('JAPAN', 30, 180); });
  K.add(new THREE.BoxGeometry(6.4, 4.0, 0.08), new THREE.MeshBasicMaterial({ map: mapT }), 0, 3.6, -2.95, rm, { cast: false });
  for (let i = 0; i < 22; i++) { const t = i / 21, x = 1.0 + 1.6 * t + 0.15 * Math.sin(i * 2), y = 5.05 - 0.55 * t * t; const d = K.sphere(0.07, K.toon({ color: '#f6c830', emissive: '#806010' }), x, y, -2.88, rm); d.visible = false; mapDots.push(d); }
  K.slab(-3, 3, 0, 1.0, -1.2, 0.2, K.col('#6a4a30'), rm);
  // collector's display shelf (right side of the room)
  K.slab(5, 10, 0, 1.1, -2.9, -1.6, K.col('#4a3a40'), rm); K.slab(5, 10, 1.1, 1.2, -2.95, -1.5, K.col('#c8a040'), rm);
}

// ---------------- world state ----------------
const DRIFT = (f) => [0.25 * Math.sin(f * 0.07), 0.04 * Math.sin(f * 0.11), 0.03 * Math.sin(f * 0.09 + 1)];
function poseWorld(f) {
  const id = shotAt(f).id, t = f / 30; sea.U.t.value = t;
  const storm = ['hook', 'storm', 'over', 'toys', 'boxes', 'loop', 'rehook'].includes(id);
  sea.U.deep.value.set(storm ? '#24485e' : ['arctic', 'frozen', 'bleach'].includes(id) ? '#2a4a68' : '#2a6a8a'); sea.U.shal.value.set(storm ? '#3a6a80' : '#4a9ab0');
  ship.visible = ['hook', 'storm', 'over', 'loop'].includes(id);
  ship.rotation.set(0.12 * Math.sin(t * 0.9) * (storm ? 1 : 0), 0, 0.03 * Math.sin(t * 0.6)); ship.position.y = 0.8 * Math.sin(t * 0.7);
  cont.forEach((c, i) => { const h = c.userData.home; let p = [...h], r = [0, 0, 0];
    const t0 = id === 'over' ? F_OVER - 14 + i * 2 : id === 'hook' || id === 'loop' ? -30 + i * 6 : 1e9; const fall = id === 'hook' || id === 'loop' ? ((f - t0) % 70 + 70) % 70 : f - t0;
    if (fall > 0 && fall < 60) { const s = fall / 30; p = [h[0] + s * 2, h[1] - 14 * s * s, h[2] + 10 * s]; r = [s * 1.2, 0, s * 0.8]; if (p[1] < -1) p[1] = -1 - (s - 1) * 2; }
    c.position.set(...p); c.rotation.set(...r); c.visible = p[1] > -5; });
  flot.visible = ['hook', 'army', 'loop', 'alone', 'rehook', 'toys', 'boxes'].includes(id);
  const d = DRIFT(f); flot.position.set(id === 'army' ? (f - cut(4)) * 0.03 : 0, d[1], 0); flot.rotation.set(d[2], 0, d[1]);
  const ds = (fd) => clamp(1 - (f - fd) / 14); beachBox.forEach((b, i) => { b.visible = id === 'boxes'; const s = id === 'boxes' ? Math.max(0.01, ds(F_DISS + i * 2)) : 1; b.scale.setScalar(s); b.rotation.y = i + f * 0.01; b.position.y = 0.1 + 0.1 * Math.sin(f * 0.1 + i); });
  popDucks.forEach((m, i) => { m.visible = id === 'boxes'; const u = M.back(ramp(f, F_POP - 6 + i * 2, F_POP + 8 + i * 2)); m.position.set(-3 + i * 1.5, lerp(-0.8, 0.0, u) + 0.06 * Math.sin(f * 0.12 + i), -1 + (i % 2) * 1.2); m.rotation.y = 0.6 + i; });
  alaskaDucks.rotation.y = 0;
  const yrs = id === 'frozen' ? clamp((f - F_YEARS) / 40) : 0; iceBlock.visible = frozenDuck.visible = ['frozen', 'arctic'].includes(id); iceBlock.scale.y = id === 'arctic' ? 0.01 : lerp(0.3, 1, ramp(f, F_ICE - 10, F_ICE + 6)) * (id === 'bleach' ? 0 : 1) + 0.001;
  frozenDuck.material.color.set(id === 'bleach' ? '#f4f2ea' : lerp(0, 1, yrs) > 0.5 ? '#f2e6a8' : '#f6c830');
  mapDots.forEach((m, i) => { m.visible = id === 'hundreds' && f > F_HUND - 8 + i * 2; });
}

// ---------------- 2D toys ----------------
const toy = (p, kind, faded = false) => {
  const C = { duck: faded ? '#f4f2ea' : '#f6c830', frog: '#4fae4a', beaver: '#d8402e', turtle: '#3a7ad0' }[kind];
  if (kind === 'duck') { p.ell(290, 640, 210, 130, C, 14); p.poly([[90, 600], [40, 520], [130, 560]], C, 12); p.ell(400, 430, 120, 115, C, 14); p.ell(530, 455, 70, 34, '#e8803a', 10); p.ell(420, 400, 22, 26, '#ffffff', 6); p.dot(426, 404, 11); p.stroke([[220, 610], [330, 660]], 10, INK); }
  if (kind === 'frog') { p.ell(300, 650, 200, 140, C, 14); for (const s of [-1, 1]) { p.ell(300 + s * 100, 480, 60, 60, C, 12); p.ell(300 + s * 100, 480, 26, 28, '#ffffff', 6); p.dot(300 + s * 100, 484, 12); } p.stroke([[220, 660], [300, 700], [380, 660]], 12, INK); for (const s of [-1, 1]) p.ell(300 + s * 180, 760, 70, 30, C, 10); }
  if (kind === 'beaver') { p.ell(170, 760, 110, 50, '#8a3a2a', 12); p.ell(320, 620, 170, 150, C, 14); p.ell(330, 480, 110, 100, C, 14); for (const s of [-1, 1]) { p.ell(330 + s * 85, 400, 30, 30, C, 10); p.ell(330 + s * 38, 460, 18, 22, '#ffffff', 5); p.dot(330 + s * 38, 464, 9); }
    p.ell(330, 530, 30, 22, '#3a2a20', 6); p.poly([[312, 552], [348, 552], [348, 590], [312, 590]], '#ffffff', 6); }
  if (kind === 'turtle') { p.ell(300, 640, 220, 150, C, 14); p.ell(300, 620, 150, 100, '#2a5aa0', 8); for (const [x, y] of [[230, 600], [300, 580], [370, 600], [300, 660]]) p.ell(x, y, 34, 26, '#5a9ae0', 5); p.ell(520, 600, 70, 60, '#7ab0e8', 12); p.dot(540, 585, 10);
    for (const s of [-1, 1]) p.ell(300 + s * 150, 760, 50, 30, '#7ab0e8', 10); }
};
const CURTIS = { jacket: '#6a8a5a', pants: '#4a4f62', boots: '#3a2a20', hat: 'hair', hair: '#d8d4cc', moustache: '#d8d4cc', skin: '#f5c9a0', build: 'stout' };
const COMBERS = [{ jacket: '#d8402e', pants: '#3b4f7a', boots: '#2a2420', hat: 'cap', cap: '#2a3a6a', skin: '#f5c9a0' }, { jacket: '#e8a030', pants: '#4a4f62', boots: '#2a2420', hat: 'hair', hair: '#5a3b2a', dress: '#3f8a5a' },
  { jacket: '#2f6aa8', pants: '#6a5a4a', boots: '#2a2420', hat: 'hair', hair: '#1e1714', skin: '#c99067', build: 'kid' }];
const COLLECTOR = { jacket: '#7b5ac9', pants: '#3b3f52', boots: '#2a2420', hat: 'hair', hair: '#8a4a2a', moustache: '#8a4a2a' };
const LIGHT2D = -2.1;
const fo = (f, seed, o) => ({ mode: 'stand', light: LIGHT2D, seed, blink: blinkAt(f, seed), ...o });
const card = (T, key, o, opts, pos, extra = {}) => ({ key: key + JSON.stringify(opts), draw: (p) => T.bodyFront(p, o, opts), x: pos[0], y: pos[1], z: pos[2], ...extra });
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1] - 1.07 * s, z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
const inFront = (c, d, ux, uy) => {
  const V = K.THREE.Vector3, p = new V(...c.pos), dir = new V(...c.look).sub(p).normalize(), right = new V().crossVectors(dir, new V(0, 1, 0)).normalize(), up = new V().crossVectors(right, dir);
  const h = d * Math.tan(c.fov * Math.PI / 360); return p.addScaledVector(dir, d).addScaledVector(right, ux * h).addScaledVector(up, uy * h).toArray();
};
const wordCard = (f, f0, txt, c, col = '#f6c83a', dur = 1e9, size = 170, uy = 0.42) => { if (f < f0 - 1 || f > f0 + dur) return null; const t = q(Math.min(1, (f - f0 + 1) / 12));
  const r = Math.min(1, 400 / (0.7 * size * txt.length)), fs = size * r, s = Math.min(2.5, 1.25 / r);
  return FX('w' + txt + t, (p) => PR.word(p, txt, t, col, fs), inFront(c, 7, 0, uy), s, { order: 9 }); };

function actorsAt(f, T) {
  const S = shotAt(f), out = [];
  switch (S.id) {
    case 'alaska': out.push(card(T, 'bc', COMBERS[0], fo(f, 5, { expr: f > F_ALASKA ? 'shock' : 'neutral', look: -0.4 }), C3(AK, [1.0, hh(11), 11]))); break;
    case 'curtis': out.push(card(T, 'cu', CURTIS, fo(f, 7, { expr: f > F_CURR - 10 ? 'grin' : 'neutral', look: -0.3, tilt: q(idle(f, 2).tilt, 1) }), C3(OFF, [-0.9, 0, 0.6]))); break;
    case 'report': COMBERS.forEach((o, i) => out.push(card(T, 'cb' + i, o, fo(f, 10 + i, { expr: ['grin', 'laugh', 'smile'][i], look: 0.2 * (i - 1), wave: f > F_REPORT && i !== 1 ? q(Math.sin(f * 0.4 + i), 1) : undefined }), C3(AK, [-1.0 + i * 1.0, hh(12 + (i % 2) * 0.6), 12 + (i % 2) * 0.6])))); break;
    case 'hundreds': out.push(card(T, 'cu2', CURTIS, fo(f, 7, { expr: f > F_HUND ? 'shock' : 'neutral', look: 0.5 }), C3(OFF, [-2.6, 0, 0.6]))); break;
    case 'reward': out.push(card(T, 'nb', COMBERS[2], fo(f, 12, { expr: f > F_REWARD ? 'shock' : 'neutral', look: 0.3 }), C3(NE, [1.6, hh(14), 14]))); break;
    case 'collect': out.push(card(T, 'co', COLLECTOR, fo(f, 14, { expr: f > F_HUND2 ? 'grin' : 'smile', look: 0.4 }), C3(OFF, [6.7, 0, 0.6]))); break;
  }
  return out;
}

const rainFX = (f, c, out, alpha = 0.6) => { const k = f % 4; out.push(FX('rain' + k, (p) => { const g = p.g; g.save(); g.globalAlpha = alpha; g.strokeStyle = '#d0dcea'; g.lineWidth = 3;
  let s = 5 + k * 101; const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let i = 0; i < 120; i++) { const x = r() * 700 - 50, y = r() * 1000; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 22, y + 70 + r() * 30); g.stroke(); } g.restore(); }, inFront(c, 3, 0, 0), 1.3, { order: 8 })); };

function fxAt(f, T, cam) {
  const S = shotAt(f), out = [], push = (x) => x && out.push(x);
  if (['hook', 'storm', 'over', 'loop'].includes(S.id)) rainFX(f, cam, out);
  const splash = (pos, t0, s = 4) => { const t = q(clamp((f - t0) / 22), 2); if (f < t0 || t >= 1) return; out.push(FX('sp' + pos.join() + t, (p) => { p.g.translate(150, 500); T.fxSplash(p, t); }, pos, s)); };
  if (S.id === 'hook') { push(wordCard(f, F_1992, '1992', cam, '#f6c83a', F_288 - F_1992 - 4, 170, 0.5)); push(wordCard(f, F_288, '28,800 TOYS', cam, '#f6c830', 1e9, 170, 0.5)); }
  if (S.id === 'over') { for (let i = 0; i < 12; i++) splash([SHIP[0] + 16 + (i % 3) * 6.4 + 4, 0.4, SHIP[2] + 10 + (i % 2) * 3], F_OVER + 6 + i * 2, 7); push(wordCard(f, F_OVER, '12 CONTAINERS', cam, '#ffffff', 1e9, 160, 0.5)); }
  if (S.id === 'toys') { [['duck', F_DUCKS, -0.2, 0.32], ['frog', F_FROGS, 0.2, 0.32], ['beaver', F_BEAV, -0.2, -0.12], ['turtle', F_TURT, 0.2, -0.12]].forEach(([k, f0, ux, uy]) => { if (f < f0 - 2) return; const t = q(M.back(clamp((f - f0 + 2) / 10)), 2);
    out.push(FX('ty' + k + t, (p) => { p.g.translate(300, 600); p.g.scale(t, t); p.g.translate(-300, -600); toy(p, k); }, inFront(cam, 4, ux, uy), 0.5, { order: 7 })); }); }
  if (S.id === 'boxes') push(wordCard(f, F_POP, 'POP!', cam, '#ffffff', 1e9, 200, 0.5));
  if (S.id === 'army') { push(wordCard(f, F_CAPT, 'NO CAPTAIN', cam, '#ffffff', F_MAP - F_CAPT - 4, 170, 0.5)); push(wordCard(f, F_MAP, 'NO MAP', cam, '#ffffff', 1e9, 170, 0.5)); }
  if (S.id === 'alaska') { push(wordCard(f, A(5), '10 MONTHS LATER', cam, '#f6c83a', F_2000 - A(5) - 4, 150, 0.5)); push(wordCard(f, F_2000, '2,000 MILES', cam, '#ffffff', 1e9, 170, 0.5)); }
  if (S.id === 'curtis') push(wordCard(f, F_CURR, 'OCEAN CURRENTS', cam, '#f6c83a', 1e9, 150, 0.6));
  if (S.id === 'report') { push(wordCard(f, F_REPORT, 'REPORT IT!', cam, '#f6c83a', 1e9, 170, 0.55)); COMBERS.forEach((o, i) => { if (i === 1) return; out.push(FX('hd' + i, (p) => toy(p, 'duck'), C3(AK, [-1.0 + i * 1.0 + 0.4, hh(12) + 2.1, 11.9 + (i % 2) * 0.6]), 0.3, { order: 6 })); }); }
  if (S.id === 'hundreds') push(wordCard(f, F_HUND, 'HUNDREDS', cam, '#f6c830', 1e9, 170, 0.6));
  if (S.id === 'rehook') { out.push(FX('lone', (p) => toy(p, 'duck'), [0, 0.6 + 0.1 * Math.sin(f * 0.15), 4], 0.6, { order: 4 })); push(wordCard(f, F_STRANGE, '?!', cam, '#ffffff', 1e9, 240, 0.5)); }
  if (S.id === 'arctic') push(wordCard(f, F_ARCTIC, 'ARCTIC', cam, '#cfe8f8', 1e9, 190, 0.5));
  if (S.id === 'frozen') push(wordCard(f, F_YEARS, 'YEARS', cam, '#cfe8f8', 1e9, 200, 0.55));
  if (S.id === 'bleach') { const fd = (k, f0, x, faded) => { if (f < f0 - 4) return; out.push(FX('bl' + k, (p) => toy(p, k, faded), C3(ARC, [x, 1.6, 6]), 0.7, { order: 4 })); };
    fd('duck', A(12) - 4, -0.7, true); fd('frog', F_GREEN - 8, 0.8, false); push(wordCard(f, F_WHITE, 'WHITE', cam, '#ffffff', F_GREEN - F_WHITE - 4, 190, 0.6)); push(wordCard(f, F_GREEN, 'GREEN', cam, '#4fae4a', 1e9, 190, 0.6)); }
  if (S.id === 'reward') { push(wordCard(f, F_2003, '2003', cam, '#f6c83a', F_REWARD - F_2003 - 4, 170, 0.6)); }
  if (S.id === 'collect') { out.push(FX('cd', (p) => toy(p, 'duck', true), C3(OFF, [7.9, 1.75, -2.2]), 0.45, { order: 4 }));
    out.push(FX('tag' + (f > F_HUND2), (p) => { p.poly([[200, 400], [460, 400], [460, 560], [200, 560]], '#f2e6c8', 8); p.g.font = 'bold 90px Poppins, sans-serif'; p.g.fillStyle = '#3a2a20'; p.g.textAlign = 'center'; p.g.fillText(f > F_HUND2 ? '$$$' : 'RARE', 330, 515); }, C3(OFF, [8.5, 1.55, -1.7]), 0.35, { order: 4 }));
    push(wordCard(f, F_HUND2, 'HUNDREDS $', cam, '#7ad06a', 1e9, 170, 0.6)); }
  if (S.id === 'alone') { out.push(FX('lone2', (p) => toy(p, 'duck', true), [ARC[0] + 2, 0.55 + 0.08 * Math.sin(f * 0.15), 12], 0.5, { order: 4 })); push(wordCard(f, F_HOW, '?', cam, '#ffffff', 1e9, 240, 0.5)); }
  return out;
}

// ---------------- cameras ----------------
const CAMS = {
  hook: [{ f: 0, pos: [3, 1.1, 14], look: [-2, 4, -70], fov: 46 }, { f: F_288, pos: [2.2, 1.0, 11], look: [-2, 5, -70], fov: 44 }, { f: F_PAC - 6, pos: [1.8, 1.2, 9], look: [-1, 6, -70], fov: 44 },
    { f: cut(1), pos: [6, 34, 40], look: [0, 0, -30], fov: 46 }],
  storm: [{ f: cut(1), pos: [46, 6, -20], look: [5, 9, -70], fov: 46 }, { f: F_STORM + 30, pos: [40, 4, -24], look: [5, 10, -70], fov: 44 }, { f: cut(2), pos: [36, 5, -30], look: [14, 12, -70], fov: 44 }],
  over: [{ f: cut(2), pos: [40, 10, -36], look: [18, 9, -66], fov: 46 }, { f: F_OVER + 20, pos: [36, 8, -36], look: [20, 5, -62], fov: 46 }],
  toys: [{ f: F_DUCKS - 6, pos: [0, 2.0, 12], look: [0, 1.6, 0], fov: 46 }, { f: cut(3), pos: [0, 2.0, 10.5], look: [0, 1.6, 0], fov: 44 }],
  boxes: [{ f: cut(3), pos: [0.2, 2.2, 8.5], look: [0, 0.2, 0], fov: 46 }, { f: F_POP, pos: [0.1, 1.6, 7.0], look: [0, 0.3, 0], fov: 44 }],
  army: [{ f: cut(4), pos: [-4, 1.2, 40], look: [2, 1.0, 0], fov: 46 }, { f: F_CAPT - 6, pos: [8, 6, 46], look: [4, 0, 0], fov: 44 }, { f: cut(5), pos: [10, 12, 52], look: [6, 0, 0], fov: 44 }],
  alaska: [{ f: cut(5), pos: [0, 2.2, -4], look: [0, 0.6, 6], fov: 46 }, { f: F_2000 - 4, pos: [0.6, 2.4, 2.0], look: [0.8, 1.6, 11], fov: 44 }],
  curtis: [{ f: cut(6), pos: [-1, 1.8, 7.5], look: [-1, 2.4, -2], fov: 46 }, { f: F_CURR - 10, pos: [-0.4, 2.4, 6.0], look: [0, 3.2, -2.9], fov: 44 }],
  report: [{ f: cut(7), pos: [0, 2.6, 4.5], look: [0, 2.4, 13], fov: 46 }, { f: F_REPORT, pos: [0, 2.5, 6.0], look: [0, 2.4, 13], fov: 44 }],
  hundreds: [{ f: cut(8), pos: [0.6, 3.6, 5.0], look: [1.5, 4.0, -2.9], fov: 44 }, { f: cut(9), pos: [1.4, 4.4, 2.6], look: [1.9, 4.6, -2.9], fov: 40 }],
  rehook: [{ f: cut(9), pos: [0, 1.0, 8], look: [0, 0.8, 0], fov: 44 }, { f: F_STRANGE, pos: [0, 2.0, 8], look: [0, 6, -60], fov: 48 }],
  arctic: [{ f: cut(10), pos: [6, 3, 24], look: [0, 0.6, -6], fov: 46 }, { f: F_ARCTIC - 4, pos: [3, 2, 18], look: [0, 0.6, -6], fov: 44 }],
  frozen: [{ f: cut(11), pos: [2.4, 1.6, 10], look: [0, 1.2, 6], fov: 44 }, { f: F_YEARS, pos: [-1.6, 1.8, 9.6], look: [0, 1.2, 6], fov: 42 }, { f: cut(12), pos: [-2.4, 2.0, 9.0], look: [0, 1.2, 6], fov: 42 }],
  bleach: [{ f: cut(12), pos: [0, 2.0, 11.5], look: [0, 1.8, 6], fov: 44 }, { f: F_GREEN, pos: [0, 1.9, 10.2], look: [0, 1.8, 6], fov: 42 }],
  reward: [{ f: cut(13), pos: [2, 2.5, 4], look: [12, 9, 34], fov: 46 }, { f: F_REWARD - 6, pos: [0.4, 2.6, 7.0], look: [0.4, 2.8, 12], fov: 44 }, { f: cut(14), pos: [0.4, 2.6, 8.0], look: [0.4, 2.8, 12], fov: 42 }],
  collect: [{ f: cut(14), pos: [7.0, 2.0, 5.5], look: [7.3, 1.6, -1.5], fov: 46 }, { f: F_HUND2, pos: [7.4, 1.9, 3.4], look: [7.6, 1.6, -2], fov: 44 }],
  alone: [{ f: cut(15), pos: [ARC[0] + 2.4, 1.0, 16], look: [ARC[0] + 2, 0.8, 12], fov: 44 }, { f: F_ARC2 + 8, pos: [ARC[0] + 3, 3.0, 20], look: [ARC[0] + 2, 0.8, 12], fov: 46 }],
  loop: [{ f: F_ARC2 + 8, pos: [3.3, 1.15, 15], look: [-2, 4, -70], fov: 47 }, { f: TOTAL - 1, pos: [3, 1.1, 14], look: [-2, 4, -70], fov: 46 }],
};
const OFFSET = { alaska: AK, report: AK, curtis: OFF, hundreds: OFF, collect: OFF, arctic: ARC, frozen: ARC, bleach: ARC, reward: NE };
const KICKS = [{ f: F_OVER, a: 0.04 }, { f: F_POP, a: 0.03 }, { f: F_STRANGE, a: 0.03 }];
const camAt = (f) => {
  const S = shotAt(f); const c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS }), o = OFFSET[S.id];
  if (o) { c.pos = C3(o, c.pos); c.look = C3(o, c.look); }
  if (S.id === 'storm' && ((f - F_STORM) % 40 < 3) && f >= F_STORM) c.flash = 0.5;
  c.shadowAt = o ? C3(o, [0, 0, 8]) : ['storm', 'over'].includes(S.id) ? SHIP : [0, 0, 0];
  return c;
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => {
  const S = shotAt(f);
  if (S.id === 'curtis') return { focus: dist(Cm.pos, C3(OFF, [-0.9, 1.8, 0.6])), cinf: 6 };
  if (S.id === 'collect') return { focus: dist(Cm.pos, C3(OFF, [7.5, 1.8, -2])), cinf: 9 };
  if (S.id === 'frozen') return { focus: dist(Cm.pos, C3(ARC, [0, 1.2, 6])), cinf: 9 };
  if (S.id === 'boxes') return { focus: dist(Cm.pos, [0, 0.2, 0]), cinf: 8 };
  return { focus: 10, cinf: 0 };
};

export default {
  TOTAL, build,
  frame(f, k) {
    poseWorld(f);
    const S = shotAt(f), cam = camAt(f);
    const id = S.id;
    let light = ['hook', 'storm', 'over', 'loop', 'toys', 'boxes', 'rehook'].includes(id) ? { ...STORM } : ['army', 'alone'].includes(id) ? { ...DAWN } : ['arctic', 'frozen', 'bleach'].includes(id) ? { ...POLAR } : ['curtis', 'hundreds', 'collect'].includes(id) ? { ...ROOM } : { ...DAY };
    if (id === 'alone') light = { ...POLAR, az: 10, el: 8, sun: '#ffc890', skyHor: '#ffd0b0', skyTop: '#5a70c0', fog: '#f0d0c0' };
    if (id === 'frozen' && f > F_YEARS) { const n = 0.5 + 0.5 * Math.cos((f - F_YEARS) * 0.25); light.sunI = lerp(0.4, 2.0, n); light.skyTop = n > 0.5 ? '#6a90d0' : '#1a2448'; light.hemi = lerp(0.9, 1.35, n); }
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
  },
};
