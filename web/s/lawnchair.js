// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Lawnchair Larry" — San Pedro / Long Beach, California, 2 Jul 1982. Timed to stories/lawnchair/voice.wav via lawnchair_timing.js.
import { TOTAL, LINES, wf } from './lawnchair_timing.js';
import * as PR from '../props.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const F_42 = wf(1, 'forty'), F_30 = wf(2, 'thirty'), F_SNAP = wf(3, 'snapped'), F_15K = wf(4, 'fifteen'), F_JET = wf(4, 'flight'),
  F_PIL = wf(5, 'pilots'), F_SHOT = wf(6, 'shot'), F_LAND = wf(7, 'landed'), F_BLACK = wf(7, 'blacking'), F_FINE = wf(8, 'fifteen'), F_SIT = wf(9, 'sit');
const SHOTS = [['hook', 0], ['tie', cut(1)], ['plan', cut(2)], ['snap', cut(3)], ['rocket', cut(4)], ['pilots', cut(5)], ['pellet', cut(6)], ['wires', cut(7)], ['fine', cut(8)], ['end', cut(9)]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const DAY = { az: 125, el: 50, sky: '#d8e6f8', ground: '#9aa070', hemi: 1.15, sun: '#fff3e0', sunI: 2.5, fog: '#cfe2f4', fogNear: 140, fogFar: 1100,
  skyTop: '#3a7fdc', skyHor: '#d4e7f8', sat: 1.12, vig: 0.2, shadowExt: 24 };
const HIGHL = { ...DAY, fog: '#bcd6f0', fogNear: 250, fogFar: 2300, skyTop: '#2a62c8', skyHor: '#c6def6', hemi: 1.25, shadowExt: 16 };
const HIGH = 420, WIREZ = 26.5, WIREY = 9.6, COCK = [0, 900, 900];
let K, chair, balloons = [], strings = [], rope, ropeMat, jet, jet2, winMat, puffs = [], car;
const rnd = (() => { let s = 5; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();

const airliner = (K) => {
  const { THREE } = K, g = K.group(), white = K.col('#f3f2ec'), blue = K.col('#2f5fae'), red = K.col('#c8402e'), grey = K.col('#9aa2ae'), dark = K.col('#26324a');
  const fus = K.add(new THREE.CylinderGeometry(2, 2, 30, 24), white, 0, 0, 0, g); fus.rotation.z = Math.PI / 2;
  K.sphere(2, white, 15, 0, 0, g, 2.2, 1, 1);
  const tail = K.add(new THREE.CylinderGeometry(2, 0.5, 8, 24), white, -19, 0.6, 0, g); tail.rotation.z = Math.PI / 2;
  K.slab(-15, 14, 0.2, 0.75, -2.02, 2.02, blue, g);
  for (let i = 0; i < 18; i++) for (const s of [-1, 1]) K.slab(-12 + i * 1.4, -11.6 + i * 1.4, 0.9, 1.3, s * 2.0 - 0.04, s * 2.0 + 0.04, dark, g);
  K.slab(16.6, 17.8, 0.5, 1.1, -1.3, 1.3, dark, g);
  for (const s of [-1, 1]) { const w = K.slab(-3, 3, -0.2, 0.2, 0, 15 * s, white, g); w.position.set(-1, -1, s * 8.5); w.rotation.y = s * 0.35;
    const en = K.add(new THREE.CylinderGeometry(0.9, 0.8, 3.4, 16), grey, 1.2, -2.2, s * 6, g); en.rotation.z = Math.PI / 2;
    const st = K.slab(-1.5, 1.5, -0.12, 0.12, 0, 5.5 * s, white, g); st.position.set(-20, 1, s * 2.8); st.rotation.y = s * 0.4; }
  K.slab(-23, -18.5, 1.5, 8, -0.2, 0.2, red, g).rotation.z = -0.35;
  return g;
};

function build(k) {
  K = k; const { THREE } = K;
  K.addClouds(14, 900, 160);
  // far ground: painted suburb grid seen from the sky
  const city = PR.canvasTex(512, 512, (g) => {
    g.fillStyle = '#9db86a'; g.fillRect(0, 0, 512, 512);
    const cols = ['#c2683e', '#d9d2c2', '#a9adb4', '#b8543a', '#e6dcc4', '#8e8a84'];
    for (let bx = 0; bx < 4; bx++) for (let by = 0; by < 4; by++) for (let i = 0; i < 6; i++) for (let j = 0; j < 2; j++) {
      const x = bx * 128 + 12 + i * 18, y = by * 128 + 14 + j * 56; g.fillStyle = cols[(bx * 7 + by * 3 + i * 5 + j) % 6]; g.fillRect(x, y, 14, 30);
      if ((i + j + bx) % 5 === 0) { g.fillStyle = '#5fc0e0'; g.fillRect(x + 2, y + 34, 9, 8); }
    }
    g.fillStyle = '#7c7f86'; for (let i = 0; i < 4; i++) { g.fillRect(i * 128, 0, 10, 512); g.fillRect(0, i * 128 + 120, 512, 8); }
  }, [40, 40]);
  const far = K.add(new THREE.PlaneGeometry(8000, 8000).rotateX(-Math.PI / 2), K.toon({ map: city }), 0, -0.05, 0, K.scene, { cast: false }); far.frustumCulled = false;
  // near suburb: lawn, streets, houses with windows (shared material so the blackout can switch them off)
  K.slab(-110, 110, -0.04, 0.0, -110, 110, K.toon({ map: PR.speckTex('#8fb85a', ['#7fa84c', '#9cc466', '#86ad52'], 7, 2600, 50) }), K.scene, false);
  const asphalt = K.col('#6d7078'), walk = K.col('#cfcac0');
  K.slab(-110, 110, 0, 0.05, WIREZ + 1.5, WIREZ + 9.5, asphalt, K.scene, false);
  K.slab(-110, 110, 0, 0.12, WIREZ - 0.8, WIREZ + 1.5, walk, K.scene, false); K.slab(-110, 110, 0, 0.12, WIREZ + 9.5, WIREZ + 11.5, walk, K.scene, false);
  for (let x = -108; x < 110; x += 6) K.slab(x, x + 3, 0.05, 0.07, WIREZ + 5.4, WIREZ + 5.6, K.col('#f2e9b8'), K.scene, false);
  winMat = K.toon({ color: '#3a4a5c', emissive: '#000000' });
  const walls = ['#efe2c6', '#f4efe4', '#e8c9a8', '#d8e4ea', '#f0d8c0', '#e9e1d0'], roofs = ['#b8543a', '#8e7a6a', '#c2683e', '#7a6a62'];
  const house = (x, z, i) => {
    const g = K.group(); g.position.set(x, 0, z);
    K.slab(-5, 5, 0, 3.6, -4, 4, K.col(walls[i % 6]), g);
    const r = K.add(new THREE.ConeGeometry(7.2, 2.6, 4), K.col(roofs[i % 4]), 0, 4.9, 0, g); r.rotation.y = Math.PI / 4; r.scale.set(1, 1, 0.8);
    for (const s of [-1, 1]) for (const wx of [-3, 0.2, 3]) K.slab(wx - 0.8, wx + 0.8, 1.2, 2.6, s * 4 - 0.06, s * 4 + 0.06, winMat, g);
    K.slab(1.1, 2.1, 0, 2.3, 4, 4.08, K.col('#7a5234'), g);
  };
  let hi = 0;
  for (let x = -96; x <= 96; x += 16) { if (Math.abs(x) > 4) house(x, -14, hi++); house(x + 4, WIREZ + 17, hi++); house(x + 8, -48, hi++); house(x, WIREZ + 44, hi++); }
  house(0, -16, 99);
  // Larry's backyard: fence, a palm, his car with the tether rope
  const fence = K.col('#d9c7a2');
  for (let x = -9; x <= 9; x += 0.5) K.slab(x - 0.2, x + 0.2, 0, 1.8, 13.8, 13.95, fence, K.scene);
  for (const x of [-9.2, 9.2]) K.slab(x - 0.08, x + 0.08, 0, 1.8, -10, 14, fence, K.scene);
  const palm = (x, z, h) => { const t = K.cyl(0.25, 0.4, h, K.col('#9a7a5a'), x, 0, z); for (let i = 0; i < 7; i++) { const l = K.slab(0, 3.2, -0.08, 0.08, -0.5, 0.5, K.col('#4f8a3a'), K.scene); l.position.set(x, h, z); l.rotation.set(0, i * 0.9, -0.5); } };
  palm(-6.5, 9, 8); palm(-40, WIREZ + 12, 11); palm(30, WIREZ + 12, 10); palm(60, -30, 12);
  car = PR.sedan(K, '#d9a441'); car.root.position.set(6.5, 0, 6); car.root.rotation.y = -Math.PI / 2;
  // power poles + wires along the street
  const wood = K.col('#7a5a3e'), wire = K.col('#2a2a30');
  for (let x = -88; x <= 88; x += 22) { K.cyl(0.18, 0.24, 10.5, wood, x, 0, WIREZ); K.slab(x - 0.12, x + 0.12, WIREY - 0.15, WIREY + 0.05, WIREZ - 1.4, WIREZ + 1.4, wood, K.scene);
    K.add(new THREE.CylinderGeometry(0.25, 0.25, 0.8, 10), K.col('#8a8f96'), x + 0.4, 8.4, WIREZ); }
  for (const dz of [-1.2, 0, 1.2]) { const w = K.add(new THREE.CylinderGeometry(0.035, 0.035, 200, 6), wire, 0, WIREY + 0.12, WIREZ + dz); w.rotation.z = Math.PI / 2; w.castShadow = false; }
  // the lawn chair (faces +z; the group turns to face the camera every frame) + 42 weather balloons
  chair = K.group(); const alu = K.col('#d7dbe2'), webA = K.col('#3f8a5a'), webB = K.col('#f2efe4');
  const tube = (a, b) => K.beam(K.V(...a), K.V(...b), 0.06, alu, chair);
  for (const s of [-1, 1]) { tube([s * 0.33, 0.5, 0.35], [s * 0.33, 0.5, -0.25]); tube([s * 0.33, 0.5, -0.25], [s * 0.33, 1.35, -0.5]); tube([s * 0.33, 0.78, 0.3], [s * 0.33, 0.78, -0.3]);
    tube([s * 0.33, 0.0, 0.35], [s * 0.33, 0.78, 0.3]); tube([s * 0.33, 0.0, -0.3], [s * 0.33, 0.5, -0.25]); tube([s * 0.33, 0.5, 0.35], [s * 0.33, 0.25, 0.55]); }
  for (let i = 0; i < 5; i++) { const z = 0.3 - i * 0.13; K.slab(-0.33, 0.33, 0.47, 0.52, z - 0.05, z + 0.05, i % 2 ? webB : webA, chair); }
  for (let i = 0; i < 6; i++) { const t = (i + 0.5) / 6, y = 0.5 + 0.85 * t, z = -0.25 - 0.25 * t; const w = K.slab(-0.33, 0.33, -0.05, 0.05, -0.02, 0.02, i % 2 ? webB : webA, chair); w.position.set(0, y, z); w.rotation.x = -0.29; }
  // water-jug ballast hanging off the sides
  for (const s of [-1, 1]) for (const dz of [-0.1, 0.15]) { K.add(new THREE.BoxGeometry(0.22, 0.32, 0.22), K.col('#e9f2f8'), s * 0.48, 0.3, dz, chair); }
  const strMat = K.col('#f7f7f2'); for (const s of [-1, 1]) K.beam(K.V(s * 0.33, 0.78, 0.1), K.V(0, 4.02, -0.2), 0.025, strMat, chair).castShadow = false;
  chair.scale.setScalar(1.4);
  const bcol = ['#efe3c4', '#f5ecd6', '#e8d6b0', '#f2e8d2', '#e2cfa6'];
  const order = [];
  for (let i = 0; i < 42; i++) {
    const a = i * 2.39996, rr = 3.4 * Math.sqrt((i + 0.5) / 42), h = 6.2 + 4.2 * ((i * 0.618) % 1) + (rr < 1.5 ? 1.4 : 0);
    const p = [Math.cos(a) * rr, h, Math.sin(a) * rr * 0.8 - 0.3], r = 0.95 + 0.25 * ((i * 0.37) % 1);
    const m = K.sphere(r, K.col(bcol[i % 5]), p[0], p[1], p[2], chair, 1, 1.12, 1); m.userData = { p, r }; m.castShadow = false; m.receiveShadow = false;
    const st = K.beam(K.V(0, 4.0, -0.2), K.V(p[0], p[1] - r * 1.05, p[2]), 0.014, strMat, chair); st.castShadow = false;
    balloons.push(m); strings.push(st); order.push([Math.hypot(p[0], p[2] + 0.3) + h * 0.2, i]);
  }
  chair.userData.popOrder = order.sort((a, b) => b[0] - a[0]).map((x) => x[1]);
  // tether rope (unit cylinder re-oriented every frame)
  ropeMat = K.col('#e6d8b0'); rope = K.add(new THREE.CylinderGeometry(0.035, 0.035, 1, 6), ropeMat, 0, 0, 0); rope.castShadow = false;
  // jets + cloud puffs in the sky column
  jet = airliner(K); jet2 = airliner(K);
  const cw = K.col('#ffffff');
  for (let i = 0; i < 26; i++) { const g = K.group(); const x = (rnd() - 0.5) * 120, z = -30 - rnd() * 90, y = 70 + i * 14 + rnd() * 10; g.position.set(x, y, z);
    for (let j = 0; j < 5; j++) K.sphere(3 + rnd() * 3, cw, (j - 2) * 3.5, (rnd() - 0.3) * 2, (rnd() - 0.5) * 3, g, 1.3, 0.8, 1); puffs.push(g); }
  // cockpit set (far away; faces -z)
  const ck = K.group(); ck.position.set(...COCK); const pan = K.col('#c9ccd2'), panD = K.col('#7f8590');
  K.slab(-2.2, 2.2, -0.1, 0, -2.5, 2, panD, ck, false); K.slab(-2.2, 2.2, 2.6, 2.7, -2.5, 2, pan, ck, false);
  const dials = PR.canvasTex(256, 96, (g) => { g.fillStyle = '#3a3f48'; g.fillRect(0, 0, 256, 96); for (let i = 0; i < 8; i++) { g.fillStyle = '#e9edf2'; g.beginPath(); g.arc(18 + i * 31, 34, 12, 0, 7); g.fill(); g.strokeStyle = '#c8402e'; g.lineWidth = 3; g.beginPath(); g.moveTo(18 + i * 31, 34); g.lineTo(18 + i * 31 + 9 * Math.cos(i), 34 - 9 * Math.sin(i)); g.stroke(); }
    for (let i = 0; i < 12; i++) { g.fillStyle = ['#7ad06a', '#f2c230', '#e9edf2'][i % 3]; g.fillRect(10 + i * 20, 66, 12, 10); } });
  K.add(new THREE.BoxGeometry(4.4, 1.2, 0.8), K.toon({ map: dials }), 0, 0.6, -1.9, ck, { cast: false });
  // left wall with a big side window (x = -2.2), windshield frame at the front
  K.slab(-2.3, -2.2, 0, 1.1, -2.5, 2, pan, ck, false); K.slab(-2.3, -2.2, 2.2, 2.7, -2.5, 2, pan, ck, false);
  K.slab(-2.3, -2.2, 1.1, 2.2, 0.8, 2, pan, ck, false); K.slab(-2.3, -2.2, 1.1, 2.2, -2.5, -2.2, pan, ck, false); K.slab(-2.3, -2.2, 1.1, 2.2, -0.75, -0.6, pan, ck, false);
  K.slab(2.2, 2.3, 0, 2.7, -2.5, 2, pan, ck, false);
  K.slab(-2.2, 2.2, 1.2, 1.35, -2.4, -2.3, pan, ck, false); K.slab(-0.08, 0.08, 1.2, 2.6, -2.4, -2.3, pan, ck, false);
  for (const x of [-1.1, 1.1]) K.slab(x - 0.45, x + 0.45, 0, 0.45, -0.2, 0.5, K.col('#5a5f6e'), ck, false);
}

// ---------------- chair state ----------------
const riseY = (f) => { if (f < F_SNAP) return 9; const u = clamp((f - F_SNAP) / (E(4) - F_SNAP)); return 9 + (HIGH - 9) * (1 - (1 - u) ** 2.2); };
function chairState(f) {
  const S = shotAt(f), id = S.id, bob = 0.25 * Math.sin(f * 0.07);
  let pos = [0, HIGH + bob, 0], roll = 0.04 * Math.sin(f * 0.05), shown = 42, popped = 0, rope = null;
  if (id === 'tie') { pos = [0, 0, 0]; roll = 0; shown = Math.round(lerp(6, 42, M.smooth(ramp(f, A(1), E(1) - 10)))); }
  if (id === 'plan') { pos = [0, 9 + bob, 0]; rope = [6.5 - 2.7, 0.6, 6]; }
  if (id === 'snap') { pos = [0, riseY(f) + (f < F_SNAP ? bob : 0), 0]; if (f < F_SNAP) rope = [6.5 - 2.7, 0.6, 6]; }
  if (id === 'rocket') pos = [0, riseY(f), 0];
  if (id === 'pilots') pos = [COCK[0] - 12, COCK[1] + 0.6 + bob, COCK[2] - 3];
  if (id === 'pellet') { pos = [0, HIGH - 12 * ramp(f, F_SHOT, E(6) + 6) + bob, 0]; popped = [F_SHOT, F_SHOT + 8, F_SHOT + 15, F_SHOT + 23, F_SHOT + 31, F_SHOT + 40].filter((x) => f >= x).length; }
  if (id === 'wires' || id === 'fine') { popped = 7; const u = M.easeIn(ramp(f, A(7) - 4, F_LAND)); pos = [0, lerp(30, WIREY - 1.25, u) + (f > F_LAND ? 0.15 * Math.sin((f - F_LAND) * 0.5) * Math.exp(-(f - F_LAND) / 20) : 0), WIREZ + 0.2];
    roll = f > F_LAND ? 0.22 : 0.05; }
  if (id === 'end') { pos = [0, 0, 0]; roll = 0; }
  return { pos, roll, shown, popped, rope };
}
const POPS = (f) => [F_SHOT, F_SHOT + 8, F_SHOT + 15, F_SHOT + 23, F_SHOT + 31, F_SHOT + 40];

// ---------------- cameras ----------------
const C = (p, d) => [p[0] + d[0], p[1] + d[1], p[2] + d[2]];
const CAMS = {
  hook: [{ f: 0, pos: [4, HIGH + 2.5, 8], look: [0, HIGH + 4.2, 0], fov: 50 }, { f: wf(0, 'nearly'), pos: [2.6, HIGH + 2.2, 5], look: [0, HIGH + 2.2, 0], fov: 44 },
    { f: cut(1), pos: [5, HIGH + 1.0, 9], look: [0, HIGH + 4, 0], fov: 46 }],
  tie: [{ f: cut(1), pos: [3.4, 1.7, 6.2], look: [0.6, 1.4, 0], fov: 40 }, { f: F_42, pos: [5, 2.0, 10.5], look: [0.4, 3.6, 0], fov: 44 },
    { f: cut(2), pos: [6, 2.0, 15], look: [0, 5.6, 0], fov: 46 }],
  plan: [{ f: cut(2), pos: [9, 2.2, 16], look: [1.5, 8.0, 1], fov: 46 }, { f: cut(3), pos: [5, 5.5, 9.5], look: [0, 10.2, 0], fov: 40 }],
  snap: [{ f: cut(3), pos: [4.5, 1.6, 9], look: [1.5, 7.5, 1], fov: 50 }, { f: cut(4), pos: [4, 1.4, 8], look: [0, 30, 0], fov: 54 }],
  pilots: [{ f: cut(5), pos: [1.2, 1.7, 1.9], look: [-1.0, 1.15, 0.0], fov: 46 }, { f: F_PIL + 18, pos: [0.9, 1.65, 1.5], look: [-1.6, 1.3, -0.4], fov: 44 },
    { f: cut(6), pos: [0.2, 1.75, 0.9], look: [-12, 2.2, -3], fov: 34 }],
  pellet: [{ f: cut(6), pos: [2.0, 1.6, 3.6], look: [0, 1.5, 0], fov: 40 }, { f: F_SHOT + 6, pos: [2.8, 0.2, 5.8], look: [0, 3.6, 0], fov: 50 },
    { f: cut(7), pos: [3.4, 0.0, 7.4], look: [0, 4.2, 0], fov: 50 }],
  wires: [{ f: cut(7), pos: [4, 4.5, WIREZ + 11], look: [0, 12, WIREZ], fov: 48 }, { f: F_LAND + 6, pos: [2.6, 6.2, WIREZ + 7.5], look: [0, 9.4, WIREZ], fov: 46 },
    { f: cut(8), pos: [-2.4, 6.4, WIREZ + 8.5], look: [0, 9.0, WIREZ], fov: 44 }],
  fine: [{ f: cut(8), pos: [0.3, 1.7, WIREZ + 10.8], look: [0.05, 1.9, WIREZ + 4.5], fov: 42 }, { f: cut(9), pos: [0.2, 1.6, WIREZ + 9.6], look: [0.05, 2.1, WIREZ + 4.5], fov: 40 }],
  end: [{ f: cut(9), pos: [0.7, 1.4, 2.6], look: [0, 1.35, 0], fov: 40 }, { f: F_SIT - 6, pos: [1.6, 1.3, 4.4], look: [0, 1.9, 0], fov: 44 },
    { f: TOTAL - 1, pos: [6, 1.5, 12], look: [0, 6.2, 0], fov: 48 }],
};
const KICKS = [{ f: F_SNAP, a: 0.05 }, { f: F_LAND, a: 0.07 }, { f: F_BLACK, a: 0.03 }];
const camAt = (f) => {
  const S = shotAt(f);
  let c;
  if (S.id === 'rocket') { // ride along with the chair, slightly below and to the side; the jet tears past on "flight"
    const y = riseY(f), u = ramp(f, cut(4), cut(5));
    c = { pos: [lerp(2.6, 5, u), y + lerp(1.0, 2.0, u), lerp(4.6, 9, u)], look: [0, y + lerp(1.6, 3.2, u), 0], fov: 46, roll: 0 };
    c = { ...c, ...camFromKeys([{ f: 0, pos: c.pos, look: c.look, fov: c.fov }], f, { creep: 0, kicks: [{ f: F_JET + 8, a: 0.05 }] }) };
  } else c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS });
  if (S.id === 'pilots') { c.pos = C(COCK, c.pos); c.look = C(COCK, c.look); c.shadowAt = COCK; }
  if (S.id === 'pellet') { const p = chairState(f).pos; c.pos = C(p, c.pos); c.look = C(p, c.look); }
  const ch = chairState(f);
  if (!c.shadowAt) c.shadowAt = S.id === 'fine' ? [0, 0, WIREZ + 5] : [ch.pos[0], Math.max(0, ch.pos[1] - 2), ch.pos[2]];
  return c;
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => {
  const S = shotAt(f), ch = chairState(f);
  if (S.id === 'pilots' && f < cut(6) - 20) return { focus: dist(Cm.pos, C(COCK, [-1.1, 1.4, 0.1])), cinf: 9 };
  if (S.id === 'fine') return { focus: dist(Cm.pos, [0, 1.6, WIREZ + 4.5]), cinf: 10 };
  if (S.id === 'end' && f < F_SIT) return { focus: dist(Cm.pos, [0, 1.2, 0.2]), cinf: 9 };
  if (S.id === 'tie' && f < F_42) return { focus: dist(Cm.pos, [1.1, 1.4, 0.6]), cinf: 8 };
  return { focus: 10, cinf: 0 };
};

// ---------------- world pose ----------------
function poseWorld(f, cam) {
  const S = shotAt(f), ch = chairState(f);
  chair.position.set(...ch.pos); chair.rotation.set(0, Math.atan2(cam.pos[0] - ch.pos[0], cam.pos[2] - ch.pos[2]), 0); chair.rotation.z = ch.roll;
  chair.visible = !['fine'].includes(S.id) || true;
  const order = chair.userData.popOrder;
  balloons.forEach((b, i) => { const rank = order.indexOf(i); const vis = i < ch.shown && rank >= ch.popped; b.visible = strings[i].visible = vis;
    if (S.id === 'tie') { const k = M.back(ramp(f, A(1) + (i - 6) * 2.2, A(1) + (i - 6) * 2.2 + 8)); const s = i < 6 ? 1 : Math.max(0.01, k); b.scale.set(s, s * 1.12, s); } else b.scale.set(1, 1.12, 1); });
  if (ch.rope) { const a = new K.THREE.Vector3(...ch.pos).add(new K.THREE.Vector3(0, 0.1, 0)), b = new K.THREE.Vector3(...ch.rope); rope.visible = true;
    rope.position.copy(a).add(b).multiplyScalar(0.5); rope.scale.set(1, a.distanceTo(b), 1); rope.quaternion.setFromUnitVectors(new K.THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize()); }
  else rope.visible = false;
  // jets: crossing behind in the hook, tearing past on "flight path", parked for the cockpit shot
  jet.visible = false; jet2.visible = false;
  if (S.id === 'hook') { jet.visible = true; jet.position.set(-70 + f * 1.4, HIGH + 4, -40); jet.rotation.set(0, 0, 0.03); }
  if (S.id === 'rocket' && f > F_JET - 30) { jet.visible = true; const y = riseY(f); jet.position.set(-130 + (f - F_JET + 30) * 4.5, y + 6, -32); jet.rotation.set(0.1, 0, 0); }
  if (S.id === 'pellet') { jet.visible = true; jet.position.set(200 - (f - cut(6)) * 2.5, HIGH + 18, -160); jet.rotation.set(0, Math.PI, 0); }
  if (S.id === 'pilots') { jet2.visible = true; jet2.position.set(COCK[0] + 60, COCK[1] - 6, COCK[2] - 120); }
  puffs.forEach((p) => { p.visible = ['rocket', 'hook', 'pellet'].includes(S.id); });
  // blackout: windows lit warm until "blacking"
  const lit = S.id === 'wires' && f < F_BLACK; winMat.emissive.set(lit ? '#e8b850' : '#000000'); winMat.color.set(lit ? '#f6d27a' : '#3a4a5c');
}

// ---------------- characters ----------------
const LARRY = { jacket: '#e2742d', pants: '#3b4f7a', boots: '#4a3426', hat: 'hair', hair: '#5a3b2a', moustache: '#5a3b2a', skin: '#f5c9a0' };
const PILOT = { jacket: '#28324a', pants: '#28324a', boots: '#1e1a1a', hat: 'cap', cap: '#28324a', buttons: '#e8c45a' };
const PILOT2 = { ...PILOT, skin: '#c99067', moustache: '#2a201a' };
const FAA = { jacket: '#6a707e', pants: '#4a4f5c', boots: '#2a2420', hat: 'hair', hair: '#d9d4c8', build: 'stout', buttons: '#d9d4c8' };
const LIGHT2D = -2.1;
const fo = (f, seed, o) => ({ mode: 'stand', light: LIGHT2D, seed, blink: blinkAt(f, seed), ...o });
const card = (T, key, o, opts, pos, extra = {}) => ({ key: key + JSON.stringify(opts) + (extra.gun ? 'g' : ''), draw: (p) => { T.bodyFront(p, o, opts); if (extra.gun) gun(p); }, x: pos[0], y: pos[1], z: pos[2], ...extra });
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1] - 1.07 * s, z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
const gun = (p) => { p.g.save(); p.g.translate(330, 700); p.g.rotate(-0.95); p.poly([[-70, -14], [40, -16], [60, -6], [60, 12], [-60, 22], [-90, 30]], '#7a5234', 8); p.poly([[40, -12], [300, -10], [300, 2], [40, 6]], '#3a3e44', 7); p.g.restore(); };
// Larry seated in the chair (card sits on the seat, slightly toward the camera)
const larryChair = (f, T, ch, cam, opts, extra = {}) => {
  const yaw = Math.atan2(cam.pos[0] - ch.pos[0], cam.pos[2] - ch.pos[2]);
  return card(T, 'larry', LARRY, fo(f, 4, { mode: 'sit', ...opts }), [ch.pos[0] + Math.sin(yaw) * 0.26, ch.pos[1] + 0.59, ch.pos[2] + Math.cos(yaw) * 0.26], { blob: false, s: 0.87, roll: ch.roll, ...extra });
};
// a point in front of the camera: d metres ahead, ux/uy as fractions of the half-height
const inFront = (c, d, ux, uy) => {
  const V = K.THREE.Vector3, p = new V(...c.pos), dir = new V(...c.look).sub(p).normalize(), right = new V().crossVectors(dir, new V(0, 1, 0)).normalize(), up = new V().crossVectors(right, dir);
  const h = d * Math.tan(c.fov * Math.PI / 360); return p.addScaledVector(dir, d).addScaledVector(right, ux * h).addScaledVector(up, uy * h).toArray();
};
const wordCard = (f, f0, txt, c, col = '#f6c83a', dur = 1e9, size = 170) => { if (f < f0 - 1 || f > f0 + dur) return null; const t = q(Math.min(1, (f - f0 + 1) / 12));
  return FX('w' + txt + t, (p) => PR.word(p, txt, t, col, size), inFront(c, 7, 0, 0.42), 1.25, { order: 9 }); };

function actorsAt(f, T, cam) {
  const S = shotAt(f), out = [], ch = chairState(f), id = idle(f, 4);
  switch (S.id) {
    case 'hook': out.push(larryChair(f, T, ch, cam, { expr: f < wf(0, 'nearly') ? 'grin' : 'nervous', look: -0.3, wave: f < wf(0, 'nearly') ? q(Math.sin(f * 0.4), 1) : undefined, headTilt: q(id.headTilt, 1) })); break;
    case 'tie': out.push(card(T, 'larry', LARRY, fo(f, 4, { expr: f < F_42 ? 'whistle' : 'grin', look: -0.5, facing: -1, wave: f > F_42 ? q(Math.sin(f * 0.35), 1) : undefined, tilt: q(id.tilt, 1) }), [1.1, 0, 0.7])); break;
    case 'plan': out.push(larryChair(f, T, ch, cam, { expr: 'smile', look: 0.2, headTilt: q(id.headTilt, 1) })); break;
    case 'snap': out.push(larryChair(f, T, ch, cam, { expr: f < F_SNAP - 2 ? 'smile' : 'shock', look: 0 })); break;
    case 'rocket': out.push(larryChair(f, T, ch, cam, { expr: f < F_JET ? 'shock' : 'pained', look: f < F_JET ? 0 : -0.6 })); break;
    case 'pilots': {
      const o = { look: -0.7, facing: -1, expr: f < F_PIL - 2 ? 'neutral' : 'shock' };
      out.push(card(T, 'cap', PILOT, fo(f, 7, { mode: 'sit', ...o, wave: f > F_PIL + 4 ? q(Math.sin(f * 0.5), 1) : undefined }), C(COCK, [-1.1, 0.42, 0.2]), { blob: false, s: 0.95 }));
      out.push(card(T, 'fo', PILOT2, fo(f, 9, { mode: 'sit', ...o, look: -0.5 }), C(COCK, [1.15, 0.42, 0.25]), { blob: false, s: 0.95 }));
      if (cam.pos[0] > -0.2 + COCK[0] || true) out.push(larryChair(f, T, ch, cam, { expr: 'nervous', wave: q(Math.sin(f * 0.4), 1) }));
      break;
    }
    case 'pellet': out.push(larryChair(f, T, ch, cam, { expr: f < F_SHOT ? 'stern' : 'grin', look: 0.3 }, { gun: true })); break;
    case 'wires': out.push(larryChair(f, T, ch, cam, { expr: f < F_LAND ? 'nervous' : f < F_BLACK ? 'shock' : 'dazed', look: 0 })); break;
    case 'fine': {
      out.push(card(T, 'larry', LARRY, fo(f, 4, { expr: f < F_FINE ? 'nervous' : 'pained', look: 0.5, facing: 1, tilt: q(id.tilt, 1) }), [-0.9, 0.05, WIREZ + 4.6]));
      out.push(card(T, 'faa', FAA, fo(f, 6, { expr: 'stern', look: -0.6, facing: -1, wave: f > F_FINE - 4 && f < F_FINE + 20 ? 0.6 : undefined }), [1.0, 0.05, WIREZ + 4.3]));
      out.push(larryChair(f, T, ch, cam, { expr: 'dazed' }, { s: 0 }));
      break;
    }
    case 'end': out.push(larryChair(f, T, ch, cam, { expr: f < F_SIT ? 'smile' : 'grin', look: 0.2, headTilt: q(id.headTilt, 1), wave: f > F_SIT ? q(Math.sin(f * 0.4), 1) : undefined })); break;
  }
  return out.filter((a) => (a.s ?? 1) > 0);
}
function fxAt(f, T, cam) {
  const S = shotAt(f), out = [], ch = chairState(f);
  const push = (x) => x && out.push(x);
  if (S.id === 'hook') push(wordCard(f, wf(0, 'three'), '3 MILES UP', cam, '#f6c83a', 1e9, 120));
  if (S.id === 'tie') push(wordCard(f, F_42, '42', cam));
  if (S.id === 'plan') push(wordCard(f, F_30, '30 FT', cam));
  if (S.id === 'rocket') push(wordCard(f, F_15K, '15,000 FT', cam, '#f6c83a', 1e9, 130));
  if (S.id === 'fine') push(wordCard(f, F_FINE, '$1,500', cam, '#7ad06a'));
  if (S.id === 'snap' && f >= F_SNAP) { const t = q(Math.min(1, (f - F_SNAP) / 14)); if (t < 1) out.push(FX('snapb' + t, (p) => { p.g.translate(50, 250); T.fxBurst(p, t, '#fff3b0'); }, [2.2, 4.6, 3.2], 1.6)); push(wordCard(f, F_SNAP, 'SNAP!', cam, '#ffffff', 22, 190)); }
  if (S.id === 'pellet') { // balloon pops: burst at the popped balloon's world position
    const order = chair.userData.popOrder;
    POPS(f).forEach((f0, k) => { const t = (f - f0) / 10; if (t < 0 || t >= 1) return; const b = balloons[order[k]]; const w = new K.THREE.Vector3(); b.getWorldPosition(w);
      out.push(FX('pop' + k + q(t), (p) => { p.g.translate(50, 250); T.fxBurst(p, q(t), '#ffffff', 10, 30, 200); }, w.toArray(), 1.4)); });
    push(wordCard(f, F_SHOT, 'POP!', cam, '#ffffff', 26, 190));
  }
  if (S.id === 'wires' && f >= F_LAND) { // sparks on the wires
    for (let i = 0; i < 3; i++) { const t = ((f - F_LAND) / 9 + i * 0.33) % 1, on = f < F_BLACK + 30; if (!on) break;
      out.push(FX('sp' + i + q(t, 1), (p) => { p.g.translate(50, 250); T.fxBurst(p, q(t, 1), '#bfe8ff', 8, 20, 170); }, [(i - 1) * 1.4, WIREY + 0.1, WIREZ + (i - 1) * 1.2], 1.3)); }
    push(wordCard(f, F_LAND, 'ZZZAP!', cam, '#bfe8ff', 30, 180));
  }
  if (S.id === 'fine' && f > F_FINE - 4) { const k = q(Math.min(1, (f - F_FINE + 4) / 8));
    out.push(FX('tk' + k, (p) => { p.g.save(); p.g.translate(300, 520); p.g.rotate(-0.15); p.g.scale(k, k); p.poly([[-90, -120], [90, -120], [90, 120], [-90, 120]], '#ffffff', 10);
      for (let i = 0; i < 6; i++) p.stroke([[-60, -70 + i * 30], [60 - (i % 2) * 30, -70 + i * 30]], 7, '#9aa2ae'); p.g.restore(); }, [0.25, 1.75, WIREZ + 4.9], 0.42)); }
  return out;
}

export default {
  TOTAL, build,
  frame(f, k) {
    const S = shotAt(f), cam = camAt(f);
    poseWorld(f, cam);
    const light = ['hook', 'rocket', 'pellet', 'pilots'].includes(S.id) ? { ...HIGHL } : { ...DAY };
    if (S.id === 'pilots') { light.fogNear = 600; light.fogFar = 3000; }
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T, cam), fx: fxAt(f, k.T, cam) };
  },
};
