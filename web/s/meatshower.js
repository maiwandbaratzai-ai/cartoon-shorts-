// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The Kentucky Meat Shower" — Bath County, Kentucky, 3 Mar 1876. Timed via meatshower_timing.js.
import { TOTAL, LINES, wf } from './meatshower_timing.js';
import * as PR from '../props.js';
import { INK } from '../toon.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const F_1876 = wf(0, '1876'), F_MEAT = wf(0, 'meat'), F_FARM = wf(0, 'farm'), F_SOAP = wf(1, 'soap'), F_CLEAR = wf(1, 'clear'), F_RED = wf(2, 'red'), F_SLAP = wf(2, 'slapping'),
  F_FOUR = wf(3, 'four'), F_FOOT = wf(3, 'football'), F_TASTE = wf(4, 'tasted'), F_MUT = wf(4, 'mutton'), F_VEN = wf(4, 'venison'), F_WORSE = wf(5, 'worse'), F_SCI = wf(5, 'scientists'),
  F_TEST = wf(5, 'tested'), F_LUNG = wf(6, 'lung'), F_VULT = wf(6, 'vultures'), F_SCARED = wf(7, 'scared'), F_VOM = wf(7, 'vomit'), F_LIGHT = wf(7, 'lighter'),
  F_TASTED = wf(8, 'tasted'), F_VV = wf(8, 'vulture'), F_VOM2 = wf(8, 'vomit');
const SHOTS = [['hook', 0], ['farm', cut(1)], ['flakes', cut(2)], ['inch', cut(3)], ['field', F_FOOT - 6], ['taste', cut(4)], ['lab', cut(5)], ['lung', cut(6)], ['sky', F_VULT - 8],
  ['vomit', cut(7)], ['men', cut(8)], ['end', F_VOM2 + 10]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const DAY = { az: 130, el: 48, sky: '#dcecfa', ground: '#8a9a5a', hemi: 1.15, sun: '#fff4e0', sunI: 2.5, fog: '#d8e8f4', fogNear: 120, fogFar: 900,
  skyTop: '#2f7fd8', skyHor: '#e2eef8', sat: 1.14, vig: 0.2, shadowExt: 22 };
const LAB = { ...DAY, az: 200, el: 30, sun: '#ffe0b0', sunI: 2.2, sky: '#ffe8d0', ground: '#7a5a40', hemi: 1.3, skyTop: '#c89a6a', skyHor: '#f0d8b8', fog: '#d8b890', fogNear: 30, fogFar: 200, sat: 1.1, vig: 0.3 };
const LABP = [200, 0, 0];
let K, meatU, meatPts, splats, splatN = 0, splatVerts = 0;
const rnd = (() => { let s = 1876; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
const gnd = (x, z) => { if (x > 160) return -4; const r = Math.hypot(x, z); return r < 14 ? 0 : (r - 14) * 0.02 * (1 + Math.sin(x * 0.05) * Math.cos(z * 0.04)) + 1.2 * Math.sin(x * 0.03) * Math.sin(z * 0.035) * clamp((r - 14) / 20); };

function build(k) {
  K = k; const { THREE } = K, M4 = THREE.Matrix4;
  K.addClouds(6, 800, 220);
  PR.terrain(K, 700, 200, gnd, K.toon({ map: PR.speckTex('#8fae58', ['#82a04c', '#9cba64', '#7a9846', '#a8b870'], 21, 2600, 70) }));
  // dirt yard around the kettle
  K.add(new THREE.CircleGeometry(5, 32).rotateX(-Math.PI / 2), K.toon({ map: PR.speckTex('#b89a70', ['#a88a60', '#c8aa80'], 4, 1200, 4) }), 0, 0.02, 0, K.scene, { cast: false });
  // far hills
  for (let i = 0; i < 8; i++) K.sphere(90, K.col(i % 2 ? '#6f9a5a' : '#7aa664'), -420 + i * 120, -40, -420 - (i % 3) * 50, K.scene, 1.6, 0.7, 1);
  // round trees (merged)
  const crowns = [], trunks = [];
  for (let i = 0; i < 150; i++) { const a = rnd() * Math.PI * 2, d = 24 + rnd() * 140, x = Math.cos(a) * d, z = Math.sin(a) * d - 20; if (Math.hypot(x, z) < 26 || (x > -14 && x < 40 && z > -6 && z < 70) || x > 150) continue; const s = 0.9 + rnd() * 0.9;
    const m = new M4().makeTranslation(x, gnd(x, z), z).multiply(new M4().makeScale(s, s, s)); trunks.push(m.clone().multiply(new M4().makeTranslation(0, 2, 0)));
    crowns.push(m.clone().multiply(new M4().makeTranslation(0, 5.2, 0)).multiply(new M4().makeScale(1, 0.9, 1))); }
  K.add(PR.mergeCopies(new THREE.CylinderGeometry(0.3, 0.45, 4, 7), trunks), K.col('#7a5a3e'), 0, 0, 0).frustumCulled = false;
  K.add(PR.mergeCopies(new THREE.IcosahedronGeometry(2.6, 1), crowns), K.col('#5a8a3a'), 0, 0, 0).frustumCulled = false;
  // white clapboard farmhouse
  const house = K.group(); house.position.set(-10, 0, -9); house.rotation.y = 0.35;
  const clap = PR.canvasTex(256, 256, (c) => { c.fillStyle = '#f2ece0'; c.fillRect(0, 0, 256, 256); for (let y = 0; y < 256; y += 16) { c.fillStyle = 'rgba(80,60,40,.18)'; c.fillRect(0, y, 256, 3); } }, [3, 2]);
  K.slab(-5, 5, 0, 5, -3.5, 3.5, K.toon({ map: clap }), house);
  const roof = K.add(new THREE.CylinderGeometry(0.1, 5.4, 2.8, 4, 1), K.col('#5a4a50'), 0, 6.4, 0, house); roof.rotation.y = Math.PI / 4; roof.scale.set(1.35, 1, 0.95);
  K.slab(-0.7, 0.7, 0, 2.4, 3.5, 3.58, K.col('#7a3a2a'), house);
  for (const x of [-3, 3]) { K.slab(x - 0.8, x + 0.8, 1.6, 3.0, 3.5, 3.56, K.col('#9fd0e8'), house); K.slab(x - 0.95, x + 0.95, 1.5, 3.1, 3.48, 3.52, K.col('#3a5a3a'), house); }
  K.slab(-5.2, 5.2, 2.9, 3.1, 3.5, 5.6, K.col('#8a7a6a'), house); for (const x of [-5, -1.5, 1.5, 5]) K.slab(x - 0.1, x + 0.1, 0, 2.9, 5.4, 5.6, K.col('#f2ece0'), house);
  K.cyl(0.4, 0.45, 2.4, K.col('#9a5a4a'), 3, 6, -1, house);
  // red barn
  const barn = K.group(); barn.position.set(13, 0, -16); barn.rotation.y = -0.5;
  const boards = PR.canvasTex(256, 256, (c) => { c.fillStyle = '#b8402e'; c.fillRect(0, 0, 256, 256); for (let x = 0; x < 256; x += 20) { c.fillStyle = 'rgba(0,0,0,.2)'; c.fillRect(x, 0, 3, 256); } }, [3, 2]);
  K.slab(-6, 6, 0, 6, -5, 5, K.toon({ map: boards }), barn); const br = K.add(new THREE.CylinderGeometry(0.1, 7.6, 3.6, 4, 1), K.col('#4a4048'), 0, 7.8, 0, barn); br.rotation.y = Math.PI / 4; br.scale.set(1.15, 1, 0.95);
  K.slab(-2, 2, 0, 4.2, 5, 5.08, K.col('#f2ece0'), barn); K.slab(-1.8, 1.8, 0.2, 4.0, 5.06, 5.12, K.col('#8a2e22'), barn);
  // split-rail fence along the pasture
  const rail = K.col('#9a7a58');
  for (let i = 0; i < 26; i++) { const x = -26 + i * 2.6, z = 9 + (i % 2) * 0.5; K.slab(x - 0.08, x + 0.08, 0, 1.2, z - 0.08, z + 0.08, rail); for (const y of [0.45, 0.95]) K.beam(K.V(x, y, z), K.V(x + 2.6, y + 0.02, 9 + ((i + 1) % 2) * 0.5), 0.1, rail); }
  // soap kettle on a tripod over a fire
  const iron = K.col('#2e2c30');
  const pot = K.add(new THREE.SphereGeometry(0.6, 24, 14, 0, Math.PI * 2, Math.PI * 0.42, Math.PI * 0.58), iron, 0, 0.95, 0); pot.material.side = THREE.DoubleSide;
  K.add(new THREE.CircleGeometry(0.56, 24).rotateX(-Math.PI / 2), K.col('#e8dcb0'), 0, 1.07, 0);
  for (let i = 0; i < 3; i++) { const a = i * 2.094 + 0.4; K.beam(K.V(Math.cos(a) * 1.0, 0, Math.sin(a) * 1.0), K.V(0, 2.3, 0), 0.07, K.col('#6a4a30')); }
  K.beam(K.V(0, 2.3, 0), K.V(0, 1.4, 0), 0.02, iron);
  K.add(new THREE.ConeGeometry(0.42, 0.7, 7), K.toon({ color: '#f08a2a', emissive: '#a04010' }), 0, 0.35, 0).castShadow = false;
  K.add(new THREE.ConeGeometry(0.22, 0.45, 6), K.toon({ color: '#ffd84a', emissive: '#a08010' }), 0.05, 0.25, 0.1).castShadow = false;
  for (let i = 0; i < 6; i++) { const a = i * 1.05; const lg = K.add(new THREE.CylinderGeometry(0.07, 0.07, 0.8, 6), K.col('#5a3a24'), Math.cos(a) * 0.35, 0.08, Math.sin(a) * 0.35); lg.rotation.set(Math.PI / 2, 0, a); }
  // ground splats of meat (revealed progressively with the draw range)
  const mats = [];
  for (let i = 0; i < 1100; i++) { const a = rnd() * Math.PI * 2, d = Math.pow(rnd(), 0.7) * 40, x = Math.cos(a) * d * 1.3, z = Math.sin(a) * d * 0.8; if (Math.hypot(x, z) < 0.9) continue; const s = 0.07 + rnd() * 0.08;
    mats.push(new M4().makeTranslation(x, gnd(x, z) + 0.03 + rnd() * 0.01, z).multiply(new M4().makeRotationY(rnd() * 6)).multiply(new M4().makeScale(s * (1 + rnd() * 0.6), 1, s))); }
  const sg = new THREE.CircleGeometry(1, 7).rotateX(-Math.PI / 2); splatVerts = sg.toNonIndexed().attributes.position.count; splatN = mats.length;
  splats = K.add(PR.mergeCopies(sg, mats), K.col('#c23a4e'), 0, 0, 0, K.scene, { cast: false }); splats.frustumCulled = false;
  // falling meat: point sprites
  const N = 1800, pos = new Float32Array(N * 3), sz = new Float32Array(N), sh = new Float32Array(N);
  for (let j = 0; j < N; j++) { pos[j * 3] = -30 + rnd() * 60; pos[j * 3 + 1] = rnd() * 36; pos[j * 3 + 2] = -22 + rnd() * 40; sz[j] = 0.12 + rnd() * 0.12; sh[j] = rnd(); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('sz', new THREE.BufferAttribute(sz, 1)); g.setAttribute('sh', new THREE.BufferAttribute(sh, 1));
  meatU = { t: { value: 0 }, amt: { value: 1 }, origin: { value: new THREE.Vector3() } };
  meatPts = new THREE.Points(g, new THREE.ShaderMaterial({ uniforms: meatU, transparent: true, depthWrite: false,
    vertexShader: `uniform float t, amt; uniform vec3 origin; attribute float sz, sh; varying float vS; void main(){ vec3 p = position; p.y = mod(p.y - t*(5.0 + sh*2.5), 36.); p.x += sin(t*1.3 + sh*20.)*0.3; p += origin;
      vS = sh; vec4 mv = modelViewMatrix*vec4(p,1.); gl_Position = projectionMatrix*mv; gl_PointSize = step(sh, amt) * min(34., sz * 4200. / -mv.z); }`,
    fragmentShader: `varying float vS; void main(){ vec2 d = gl_PointCoord - .5; d.x *= 1.0 + vS*.6; float r = dot(d,d); if (r > .25) discard;
      vec3 c = mix(vec3(.55,.06,.10), vec3(.75,.18,.22), vS); c = mix(c, vec3(.08,.02,.03), smoothstep(.14,.22,r)); gl_FragColor = vec4(c, 1.); }` }));
  meatPts.userData.ndSkip = true; meatPts.frustumCulled = false; K.scene.add(meatPts);
  // the lab (far off-set): floor, walls, window, table, microscope, jars
  const lab = K.group(); lab.position.set(...LABP);
  K.slab(-6, 6, -0.1, 0, -6, 6, K.toon({ map: PR.canvasTex(256, 256, (c) => { c.fillStyle = '#9a6a44'; c.fillRect(0, 0, 256, 256); for (let x = 0; x < 256; x += 32) { c.fillStyle = 'rgba(0,0,0,.2)'; c.fillRect(x, 0, 3, 256); } }, [4, 4]) }), lab);
  const wall = K.col('#e8d8b8'); K.slab(-6, 6, 0, 5, -3.2, -3, wall, lab); K.slab(-6, -5.8, 0, 5, -3, 6, wall, lab);
  K.slab(-1.2, 1.2, 1.6, 3.6, -3.02, -2.96, K.toon({ color: '#bfe4f4', emissive: '#5a7a8a' }), lab); K.slab(-1.3, 1.3, 2.55, 2.65, -2.98, -2.9, K.col('#6a4a30'), lab);
  // shelves with jars
  K.slab(-5.8, -5.4, 2.0, 2.08, -2.5, 2.5, K.col('#7a5434'), lab);
  for (let i = 0; i < 6; i++) K.cyl(0.13, 0.13, 0.36, K.toon({ color: ['#c8e0d0', '#e8d0a0', '#d0c8e8'][i % 3], transparent: true, opacity: 0.85 }), -5.6, 2.08, -2 + i * 0.8, lab);
  K.slab(-1.5, 1.5, 0.9, 1.0, -1.2, 0.2, K.col('#8a5a34'), lab); for (const x of [-1.4, 1.4]) for (const z of [-1.1, 0.1]) K.slab(x - 0.06, x + 0.06, 0, 0.9, z - 0.06, z + 0.06, K.col('#6a4a30'), lab);
  const brass = K.col('#d9a845');
  K.slab(-0.25, 0.25, 1.0, 1.06, -0.75, -0.25, brass, lab); K.slab(-0.05, 0.05, 1.06, 1.55, -0.7, -0.6, brass, lab);
  const tube = K.add(new THREE.CylinderGeometry(0.06, 0.08, 0.55, 16), brass, 0, 1.45, -0.48, lab); tube.rotation.x = 0.35;
  K.slab(-0.18, 0.18, 1.2, 1.23, -0.62, -0.32, K.col('#e8e8f0'), lab);
  K.add(new THREE.CylinderGeometry(0.12, 0.12, 0.03, 16), K.toon({ color: '#c23a4e' }), 0.6, 1.0, -0.4, lab); // dish with meat
  K.sphere(0.07, K.col('#c23a4e'), 0.6, 1.04, -0.4, lab, 1, 0.4, 1);
}

// ---------------- 2D drawings ----------------
const vulture = (p, flap = 0, mode = 'fly', puke = 0) => {
  const up = Math.sin(flap * Math.PI * 2), cx = 300, cy = 500, dk = '#3a2e2e', mid = '#4f4040';
  const wing = (s, col) => { p.poly([[cx + s * 20, cy - 10], [cx + s * 110, cy - 50 - 60 * up], [cx + s * 220, cy - 30 - 100 * up], [cx + s * 270, cy - 10 - 120 * up], [cx + s * 230, cy + 10 - 80 * up], [cx + s * 150, cy + 20 - 40 * up], [cx + s * 40, cy + 22]], col, 9);
    for (let k = 0; k < 4; k++) p.stroke([[cx + s * (150 + k * 28), cy - 20 - (60 + k * 15) * up], [cx + s * (170 + k * 28), cy + 10 - (50 + k * 12) * up]], 6, '#5f5050'); };
  wing(-1, dk);
  p.ell(cx, cy + 6, 95, 48, mid, 10); p.poly([[cx - 80, cy], [cx - 150, cy - 10], [cx - 140, cy + 30], [cx - 80, cy + 30]], dk, 8);
  const hx = cx + 118, hy = cy - 20 + (puke ? 14 : 0);
  p.line([[cx + 70, cy - 6], [hx - 10, hy]], '#d06a6a', 26); p.ell(cx + 72, cy - 6, 36, 26, '#e8dcd0', 8);
  p.ell(hx, hy, 34, 28, '#d8545a', 9); p.dot(hx + 6, hy - 8, 6); p.ell(hx + 4, hy - 9, 10, 10, '#ffffff', 4); p.dot(hx + 6, hy - 8, 5);
  if (puke) { p.poly([[hx + 24, hy - 10], [hx + 60, hy + 4], [hx + 24, hy + 6]], '#f2e8c8', 6); p.poly([[hx + 24, hy + 8], [hx + 52, hy + 22], [hx + 24, hy + 18]], '#f2e8c8', 6);
    for (let i = 0; i < 7; i++) { const t = (puke * 3 + i / 7) % 1; p.ell(hx + 50 + 40 * t + 10 * Math.sin(i), hy + 40 + 420 * t, 26 - 8 * t, 18 - 6 * t, i % 2 ? '#c23a4e' : '#e86a78', 6); } }
  else p.poly([[hx + 24, hy - 8], [hx + 60, hy + 6], [hx + 24, hy + 12]], '#f2e8c8', 6);
  wing(1, mid);
};
const flake = (p, seed = 1) => { const r = (k) => 0.8 + 0.25 * Math.sin(seed * 3.1 + k * 2.3); const pts = []; for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; pts.push([300 + Math.cos(a) * 200 * r(i), 520 + Math.sin(a) * 150 * r(i)]); }
  p.poly(pts, '#c83a50', 14); p.ell(260, 480, 90, 50, '#e8707e', 0); p.stroke([[200, 560], [300, 520], [380, 580]], 8, '#9a2a3a'); p.ell(330, 470, 30, 18, '#f4c0c0', 0); };
const tissue = (p) => { p.ell(300, 500, 290, 290, '#f4d0d4', 16); p.g.save(); p.g.beginPath(); p.g.arc(300, 500, 285, 0, 7); p.g.clip();
  for (let i = 0; i < 40; i++) { const x = 300 + 260 * Math.sin(i * 2.4), y = 500 + 260 * Math.cos(i * 1.7); p.ell(x, y, 34 + (i % 4) * 8, 28 + (i % 3) * 6, i % 3 ? '#e88a96' : '#d86a7a', 5); p.dot(x + 6, y - 4, 6, '#8a2a4a'); }
  p.g.restore(); p.stroke(Array.from({ length: 65 }, (_, i) => [300 + 290 * Math.cos(i / 64 * 6.283), 500 + 290 * Math.sin(i / 64 * 6.283)]), 30, INK); };

// ---------------- characters ----------------
const CROUCH = { jacket: '#7b5ac9', pants: '#3b3f52', boots: '#4a3426', hat: 'bonnet', dress: '#5a8fc2', skin: '#f5c9a0' };
const MAN1 = { jacket: '#8a5a34', pants: '#4a4f62', boots: '#3a2a20', hat: 'hair', hair: '#6a4a30', moustache: '#6a4a30', skin: '#ffe2c2' };
const MAN2 = { jacket: '#4f7a3a', pants: '#5a4a3a', boots: '#3a2a20', hat: 'tophat', moustache: '#d9d0c0', build: 'stout', skin: '#ecd0b6' };
const SCI = { jacket: '#2a2a3a', pants: '#3a3a4a', boots: INK, hat: 'hair', hair: '#e0d8c8', moustache: '#e0d8c8', buttons: '#e8c45a', skin: '#f5c9a0' };
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
  const d = ['lab', 'lung'].includes(shotAt(f).id) ? 0.85 : 7;
  return FX('w' + txt + t, (p) => PR.word(p, txt, t, col, fs), inFront(c, d, 0, uy), s * d / 7, { order: 9 }); };
const vultCard = (f, i, pos, s = 1.4, flip = false, puke = 0) => { const fl = q(((f * 0.045 + i * 0.37) % 1), 1); const pk = puke ? q((f * 0.03) % 1, 1) : 0;
  return FX('v' + fl + pk, (p) => vulture(p, fl, 'fly', pk ? pk + 0.001 : 0), pos, s, { flip, order: 4 }); };
const circling = (f, n = 6, r = 9, h = 26, c = [0, 0, -25]) => Array.from({ length: n }, (_, i) => { const a = f * 0.012 + i * 6.283 / n; return [c[0] + Math.cos(a) * r * (1 + 0.2 * (i % 2)), c[1] + h + (i % 3) * 2, c[2] + Math.sin(a) * r, Math.cos(a) > 0]; });

function actorsAt(f, T) {
  const S = shotAt(f), out = [], cP = [1.15, 0, 0.75];
  switch (S.id) {
    case 'hook': case 'end': out.push(card(T, 'cr', CROUCH, fo(f, 3, { mode: 'fall', expr: 'shock', look: 0.2, tilt: q(idle(f, 3).tilt, 1) }), cP)); break;
    case 'farm': out.push(card(T, 'cr', CROUCH, fo(f, 3, { expr: f < F_CLEAR ? 'whistle' : 'smile', look: f < F_CLEAR ? -0.4 : 0.3, tilt: q(idle(f, 3).tilt, 1), headTilt: q(idle(f, 3).headTilt, 1) }), cP)); break;
    case 'flakes': out.push(card(T, 'cr', CROUCH, fo(f, 3, { mode: f > F_SLAP ? 'fall' : 'stand', expr: f > F_RED + 4 ? 'shock' : 'neutral', look: f > F_SLAP ? 0.5 : -0.3 }), cP)); break;
    case 'field': out.push(card(T, 'cr', CROUCH, fo(f, 3, { expr: 'dazed' }), cP)); break;
    case 'taste': case 'men': {
      const m = S.id === 'men', e1 = m ? (f > F_VV ? 'shock' : 'pained') : f < F_MUT ? 'nervous' : 'lick', e2 = m ? (f > F_VV + 6 ? 'shock' : 'pained') : f < F_VEN ? 'neutral' : 'lick';
      out.push(card(T, 'm1', MAN1, fo(f, 11, { expr: e1, look: 0.3, tilt: q(idle(f, 11).tilt, 1), headTilt: m && f > F_VV ? q(6 * Math.sin(f * 0.9), 0) : 0 }), [3.45, 0, 4.2]));
      out.push(card(T, 'm2', MAN2, fo(f, 12, { expr: e2, look: -0.3, tilt: q(idle(f, 12).tilt, 1) }), [4.75, 0, 4.0])); break; }
    case 'lab': out.push(card(T, 'sci', SCI, fo(f, 21, { expr: f > F_TEST ? 'stern' : 'neutral', look: -0.3, tilt: q(-4 + idle(f, 21).tilt, 1) }), [LABP[0] + 0.6, 0, LABP[2] + 0.5])); break;
  }
  return out;
}

function fxAt(f, T, cam) {
  const S = shotAt(f), out = [], push = (x) => x && out.push(x);
  const birds = (n, r, h, s) => circling(f, n, r, h).forEach(([x, y, z, fl], i) => out.push(vultCard(f, i, [x, y, z], s, fl)));
  if (S.id === 'hook') { push(wordCard(f, F_1876, '1876', cam, '#f6c83a', F_MEAT - F_1876 - 4)); push(wordCard(f, F_MEAT, 'RAW MEAT?!', cam, '#ff7a8a')); birds(5, 8, 13, 3); }
  if (S.id === 'end') { birds(5, 8, 13, 3); }
  if (S.id === 'farm') push(wordCard(f, F_CLEAR, 'CLEAR SKY', cam, '#ffffff', 1e9, 170, 0.3));
  if (S.id === 'flakes') { push(wordCard(f, F_SLAP, 'SPLAT!', cam, '#ff7a8a', 1e9, 190, 0.45));
    for (let i = 0; i < 4; i++) { const f0 = F_RED + i * 9; if (f >= f0 && f < f0 + 12) { const t = q((f - f0) / 12); out.push(FX('sp' + i + t, (p) => { p.g.translate(0, 300); T.fxSplash(p, t); }, [1.8 - i * 0.9, 0.3, 2.6 - (i % 2)], 0.35)); } } }
  if (S.id === 'inch') { const t = q(M.back(ramp(f, cut(3), cut(3) + 10))); out.push(FX('fl' + t, (p) => { p.g.translate(300, 520); p.g.scale(t, t); p.g.translate(-300, -520); flake(p, 2); }, inFront(cam, 1.6, 0, -0.1), 0.5, { order: 6 }));
    push(wordCard(f, F_FOUR, '4 INCHES', cam, '#f6c83a', 1e9, 170, 0.5)); }
  if (S.id === 'field') push(wordCard(f, F_FOOT, 'A WHOLE FIELD', cam, '#ffffff', 1e9, 160, 0.45));
  if (S.id === 'taste') { const hold = (x, y, z, k) => out.push(FX('h' + k, (p) => flake(p, k), [x, y, z], 0.18, { order: 6 }));
    hold(3.45 + 0.12, 1.36, 4.45, 3); if (f > F_MUT) hold(4.75 - 0.1, 1.33, 4.25, 4);
    push(wordCard(f, F_MUT, 'MUTTON?', cam, '#ffffff', F_VEN - F_MUT - 2, 180, 0.5)); push(wordCard(f, F_VEN, 'VENISON?', cam, '#f6c83a', 1e9, 180, 0.5)); }
  if (S.id === 'lab') { push(wordCard(f, F_WORSE, 'IT GOT WORSE', cam, '#ff7a8a', F_TEST - F_WORSE - 2, 160, 0.5)); push(wordCard(f, F_TEST, 'TESTED...', cam, '#ffffff', 1e9, 170, 0.5)); }
  if (S.id === 'lung') { const t = q(M.back(ramp(f, cut(6), cut(6) + 10))); out.push(FX('ti' + t, (p) => { p.g.translate(300, 500); p.g.scale(t, t); p.g.rotate(f * 0.004); p.g.translate(-300, -500); tissue(p); }, inFront(cam, 0.9, 0, -0.08), 0.375, { order: 6 }));
    push(wordCard(f, F_LUNG, 'LUNG TISSUE', cam, '#ff7a8a', 1e9, 170, 0.6)); }
  if (S.id === 'sky') { birds(6, 9, 13, 3.2); push(wordCard(f, F_VULT, 'VULTURES', cam, '#f6c83a', 1e9, 180, 0.5)); }
  if (S.id === 'vomit') { const up = M.easeIn(ramp(f, F_LIGHT - 6, E(7) + 6)) * 9; out.push(vultCard(f * 1.6, 0, [0, 30 + up, 0], 2.6, false, f > F_VOM - 3 ? 1 : 0));
    out.push(vultCard(f, 2, [-7, 33, -10], 2.2, true)); out.push(vultCard(f, 4, [8, 31, -14], 2.2, false));
    push(wordCard(f, F_SCARED, 'SCARED!', cam, '#ffffff', F_VOM - F_SCARED - 2, 170, 0.5)); push(wordCard(f, F_VOM, 'BLEHHH!', cam, '#9ad04a', F_LIGHT - F_VOM - 2, 180, 0.5)); push(wordCard(f, F_LIGHT, 'LIGHTER!', cam, '#f6c83a', 1e9, 180, 0.5)); }
  if (S.id === 'men') { push(wordCard(f, F_TASTED, 'THE MEAT?', cam, '#ffffff', F_VV - F_TASTED - 2, 170, 0.5)); push(wordCard(f, F_VV, 'VULTURE VOMIT', cam, '#9ad04a', 1e9, 170, 0.5)); }
  return out;
}

// ---------------- world state ----------------
const fallAt = (f) => { const id = shotAt(f).id; return { hook: 1, end: 1, flakes: ramp(f, F_RED - 6, F_SLAP + 10), inch: 0.4, field: 0.7, sky: 0.25, vomit: 0.5 }[id] ?? 0; };
const groundAt = (f) => { const id = shotAt(f).id; return { hook: 1, end: 1, flakes: ramp(f, F_RED, E(2)) * 0.6, inch: 0.8, field: 1, taste: 1, sky: 1, men: 1 }[id] ?? 0; };

// ---------------- cameras ----------------
const CAMS = {
  hook: [{ f: 0, pos: [2.6, 0.9, 6.8], look: [0.6, 2.9, 0], fov: 50 }, { f: F_MEAT, pos: [2.3, 1.0, 5.6], look: [0.7, 2.7, 0], fov: 48 }, { f: cut(1), pos: [2.1, 1.1, 5.0], look: [0.8, 2.4, 0.3], fov: 46 }],
  farm: [{ f: cut(1), pos: [-2, 3.2, 13], look: [-1.5, 1.8, -2], fov: 46 }, { f: F_SOAP, pos: [0.8, 1.9, 6.4], look: [0.6, 1.4, 0.3], fov: 42 }, { f: F_CLEAR - 6, pos: [1.0, 1.7, 6.0], look: [0.6, 1.6, 0.3], fov: 42 }, { f: cut(2), pos: [1.2, 1.4, 5.6], look: [0.4, 12, -6], fov: 50 }],
  flakes: [{ f: cut(2), pos: [3.6, 0.6, 5.6], look: [0.8, 0.9, 0.8], fov: 46 }, { f: F_SLAP, pos: [3.0, 0.9, 5.0], look: [0.9, 1.3, 0.8], fov: 46 }, { f: F_FOUR - 8, pos: [2.6, 1.3, 5.2], look: [1.0, 1.6, 0.8], fov: 46 }],
  inch: [{ f: cut(3), pos: [2.5, 1.2, 3.2], look: [1.6, 0.0, 1.6], fov: 44 }, { f: F_FOOT - 6, pos: [2.3, 1.0, 3.0], look: [1.6, 0.0, 1.6], fov: 40 }],
  field: [{ f: F_FOOT - 6, pos: [6, 9, 18], look: [0, 0, 0], fov: 48 }, { f: cut(4), pos: [14, 30, 40], look: [0, 0, -2], fov: 48 }],
  taste: [{ f: cut(4), pos: [4.1, 1.7, 9.4], look: [4.1, 1.5, 4.1], fov: 42 }, { f: F_MUT, pos: [3.6, 1.65, 7.3], look: [3.5, 1.6, 4.2], fov: 38 }, { f: F_VEN - 4, pos: [4.7, 1.65, 7.4], look: [4.75, 1.6, 4.0], fov: 38 }, { f: cut(5), pos: [4.7, 1.7, 7.0], look: [4.75, 1.6, 4.0], fov: 36 }],
  lab: [{ f: cut(5), pos: [LABP[0] + 3.5, 2.2, 5.5], look: [LABP[0] + 0.2, 1.4, -0.5], fov: 46 }, { f: F_TEST - 6, pos: [LABP[0] + 1.8, 1.7, 3.6], look: [LABP[0] + 0.3, 1.5, 0], fov: 40 }],
  lung: [{ f: cut(6), pos: [LABP[0] + 0.2, 1.9, 1.6], look: [LABP[0], 1.3, -0.4], fov: 44 }, { f: F_VULT - 8, pos: [LABP[0] + 0.1, 1.7, 1.2], look: [LABP[0], 1.25, -0.4], fov: 40 }],
  sky: [{ f: F_VULT - 8, pos: [3, 1.6, 9], look: [0.5, 4, 0], fov: 48 }, { f: cut(7), pos: [2.2, 1.8, 10], look: [0, 13, -25], fov: 50 }],
  vomit: [{ f: cut(7), pos: [-3, 32, 9], look: [0, 31, 0], fov: 46 }, { f: F_VOM, pos: [-2.4, 31.4, 7.6], look: [0, 30.8, 0], fov: 44 }, { f: F_LIGHT, pos: [-2.4, 31.4, 7.6], look: [0, 33, 0], fov: 48 }, { f: cut(8), pos: [-2.6, 33, 8], look: [0, 38, 0], fov: 50 }],
  men: [{ f: cut(8), pos: [4.1, 1.75, 9.0], look: [4.1, 1.55, 4.1], fov: 42 }, { f: F_VV, pos: [4.1, 1.7, 8.6], look: [4.1, 1.6, 4.1], fov: 44 }, { f: F_VOM2 + 10, pos: [4.1, 1.7, 8.2], look: [4.1, 1.62, 4.1], fov: 43 }],
  end: [{ f: F_VOM2 + 10, pos: [2.0, 1.15, 4.8], look: [0.8, 2.3, 0.3], fov: 46 }, { f: TOTAL - 1, pos: [2.6, 0.9, 6.8], look: [0.6, 2.9, 0], fov: 50 }],
};
const KICKS = [{ f: F_MEAT, a: 0.03 }, { f: F_SLAP, a: 0.03 }, { f: F_WORSE, a: 0.03 }, { f: F_VOM, a: 0.04 }, { f: F_VV, a: 0.04 }];
const camAt = (f) => {
  const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS });
  c.shadowAt = ['lab', 'lung'].includes(S.id) ? LABP : S.id === 'vomit' ? [0, 0, 0] : [c.look[0], 0, c.look[2]];
  if (S.id === 'sky') c.shadowAt = [0, 0, 0];
  return c;
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => {
  const S = shotAt(f);
  if (S.id === 'taste' || S.id === 'men') return { focus: dist(Cm.pos, [4.1, 1.6, 4.1]), cinf: 10 };
  if (S.id === 'inch') return { focus: 3, cinf: 9 };
  if (S.id === 'lab') return { focus: dist(Cm.pos, [LABP[0] + 0.5, 1.5, 0.5]), cinf: 8 };
  return { focus: 10, cinf: 0 };
};

export default {
  TOTAL, build,
  frame(f, k) {
    const S = shotAt(f), cam = camAt(f);
    meatU.t.value = f / 30; meatU.amt.value = fallAt(f);
    const lab = ['lab', 'lung'].includes(S.id);
    meatPts.visible = !lab; meatU.origin.value.set(S.id === 'vomit' ? 0 : 0, 0, 0);
    splats.geometry.setDrawRange(0, Math.round(groundAt(f) * splatN) * splatVerts);
    const light = lab ? { ...LAB } : { ...DAY };
    if (S.id === 'field') light.shadowExt = 50;
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
  },
};
