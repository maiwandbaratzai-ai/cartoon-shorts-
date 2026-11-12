// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Chocolate snow" — Olten, Switzerland, August 2020. Timed to stories/cocoa/voice.wav via cocoa_timing.js.
import { TOTAL, LINES, wf } from './cocoa_timing.js';
import * as PR from '../props.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const F_2020 = wf(0, '2020'), F_FLAKES = wf(1, 'flakes'), F_CARS = wf(1, 'cars'), F_FACT = wf(2, 'factory'), F_FAN = wf(3, 'fan'), F_BROKE = wf(3, 'broken'), F_WIND = wf(4, 'wind'),
  F_DUST = wf(4, 'dust'), F_SPR = wf(5, 'sprinkled'), F_MUG = wf(6, 'mug'), F_HARM = wf(7, 'harmless'), F_PAY = wf(8, 'pay'), F_CLEAN = wf(8, 'cleaning');
const SHOTS = [['hook', 0], ['car', cut(1)], ['factory', cut(2)], ['fan', cut(3)], ['wind', cut(4)], ['aerial', cut(5)], ['street', cut(6)], ['mug', F_MUG - 8], ['harmless', cut(7)], ['wash', cut(8)]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const SUMMER = { az: 140, el: 44, sky: '#dce8f6', ground: '#8a9a70', hemi: 1.15, sun: '#fff2dc', sunI: 2.4, fog: '#d8e4ee', fogNear: 160, fogFar: 1100,
  skyTop: '#4a88d8', skyHor: '#dde8f2', sat: 1.12, vig: 0.22, shadowExt: 26 };
const DUSTY = { ...SUMMER, sunI: 2.0, sky: '#e6d6c4', skyTop: '#8a7a6a', skyHor: '#d8c4ac', fog: '#c8a888', fogNear: 60, fogFar: 520, sat: 1.05, gain: '#fff4e8', vig: 0.28 };
const FZ = -46;
let K, flakes, flakeU, cars = [], carMats = [], walkMat, fanBlades, mug, roofMats = [];
const rnd = (() => { let s = 17; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();

function build(k) {
  K = k; const { THREE } = K;
  K.addClouds(10, 800, 140);
  // ground, street, sidewalks
  K.slab(-400, 400, -0.05, 0, -400, 400, K.toon({ map: PR.speckTex('#7fa850', ['#6f9844', '#8cb85a'], 3, 2600, 80) }), K.scene, false);
  K.slab(-200, 200, 0, 0.04, -4, 4, K.col('#6d7078'), K.scene, false);
  walkMat = K.col('#cfcac0'); K.slab(-200, 200, 0, 0.14, -6.5, -4, walkMat, K.scene, false); K.slab(-200, 200, 0, 0.14, 4, 6.5, walkMat, K.scene, false);
  for (let x = -198; x < 200; x += 6) K.slab(x, x + 3, 0.04, 0.06, -0.12, 0.12, K.col('#f4f0e0'), K.scene, false);
  // Swiss houses: white/pastel walls, steep dark roofs, shutters
  const walls = ['#f4efe4', '#efe0c4', '#e8d0c0', '#f2e6d0', '#dfe6e0'];
  const house = (x, z, i, face) => { const g = K.group(); g.position.set(x, 0, z); const w = 9, h = 8 + (i % 3) * 2.4;
    K.add(new THREE.BoxGeometry(w, h, 9), K.toon({ map: PR.facadeTex(walls[i % 5], 3, Math.round(h / 3), i, '#7a3a2a') }), 0, h / 2, 0, g);
    const rm = K.col(i % 2 ? '#5a4a44' : '#7a4a3a'); roofMats.push(rm);
    const r = K.add(new THREE.CylinderGeometry(0.01, 6.9, 4.2, 4, 1), rm, 0, h + 2.1, 0, g); r.rotation.y = Math.PI / 4; r.scale.set(1, 1, 0.8); };
  let i = 0; for (let x = -110; x <= 110; x += 11) { house(x, -12, i++); house(x + 4, 12, i++); house(x + 2, 30, i++); }
  // the chocolate factory behind the north row: long building, roof vent fan, chimney, sign
  const fac = K.group(); fac.position.set(0, 0, FZ);
  K.add(new THREE.BoxGeometry(60, 16, 26), K.toon({ map: PR.facadeTex('#efe6d6', 12, 4, 77, '#6b3a1c') }), 0, 8, 0, fac);
  const rf = K.col('#8a8f96'); roofMats.push(rf); K.slab(-30.5, 30.5, 16, 16.6, -13.5, 13.5, rf, fac);
  K.cyl(1.4, 1.8, 18, K.col('#a8483a'), 22, 16, 4, fac);
  const sign = PR.canvasTex(1024, 512, (c) => { c.fillStyle = '#6b3a1c'; c.fillRect(0, 0, 1024, 512); c.fillStyle = '#f6e6c8'; c.font = 'bold 170px Poppins, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('CHOCOLATE', 512, 160); c.fillText('FACTORY', 512, 370); });
  K.add(new THREE.PlaneGeometry(13, 6.5), new THREE.MeshBasicMaterial({ map: sign }), 0, 12.6, 13.1, fac, { cast: false });
  // roof vent fan (housing + blades that spin, then stop)
  const fan = K.group(fac); fan.position.set(-8, 16.6, 6);
  K.cyl(2.2, 2.2, 1.6, K.col('#c9ced6'), 0, 0, 0, fan); K.cyl(1.9, 1.9, 0.1, K.col('#3a3e44'), 0, 1.55, 0, fan);
  fanBlades = K.group(fan); fanBlades.position.y = 1.7;
  for (let b = 0; b < 4; b++) { const bl = K.slab(0, 1.75, -0.04, 0.04, -0.35, 0.35, K.col('#e9edf2'), fanBlades); bl.rotation.y = b * Math.PI / 2; bl.rotation.x = 0.35; }
  K.cyl(0.3, 0.3, 0.3, K.col('#5a5f6e'), 0, 1.6, 0, fan);
  // hills behind
  for (let j = 0; j < 7; j++) K.sphere(70, K.col(j % 2 ? '#6f9a4a' : '#5f8a44'), -300 + j * 100, -25, -220 - (j % 3) * 40, K.scene, 1.6, 0.8, 1);
  // cars along the street (they get dusted brown)
  const cc = ['#c8402e', '#f2f0ea', '#3f6fb2', '#2f8a5a', '#e2b030'];
  [[-9, -2.8, 0], [3.5, -2.8, 0], [-8.5, 2.8, Math.PI], [12, 2.8, Math.PI], [-16, 2.8, Math.PI]].forEach(([x, z, r], j) => { const c = PR.sedan(K, cc[j]); c.root.position.set(x, 0, z); c.root.rotation.y = r; cars.push(c);
    const mats = new Set(); c.root.traverse((o) => { if (o.isMesh && o.material.color && o.material.color.getHexString() === K.col(cc[j]).color.getHexString()) mats.add(o.material); });
    mats.forEach((m) => carMats.push({ m, c0: m.color.clone() })); });
  // the giant mug gag
  mug = K.group(); mug.position.set(-1, 0, 0); mug.rotation.y = Math.PI / 2;
  K.add(new THREE.CylinderGeometry(6, 5.4, 12, 40), K.col('#f2f0ea'), 0, 6, 0, mug); K.add(new THREE.CylinderGeometry(5.7, 5.7, 0.4, 40), K.col('#6b3a1c'), 0, 11.6, 0, mug);
  const hd = K.add(new THREE.TorusGeometry(3.2, 0.8, 12, 30), K.col('#f2f0ea'), 6.2, 6.5, 0, mug); hd.rotation.y = 0;
  for (let j = 0; j < 4; j++) K.sphere(1.2, K.col('#fff8ee'), -2 + j * 1.4, 12.2, (j % 2) - 0.5, mug, 1, 0.6, 1);
  // cocoa flakes: falling point sprites around the street
  const N = 2600, pos = new Float32Array(N * 3), sz = new Float32Array(N), sh = new Float32Array(N);
  for (let j = 0; j < N; j++) { pos[j * 3] = -40 + rnd() * 80; pos[j * 3 + 1] = rnd() * 30; pos[j * 3 + 2] = -10 + rnd() * 24; sz[j] = 0.08 + rnd() * 0.12; sh[j] = rnd(); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('sz', new THREE.BufferAttribute(sz, 1)); g.setAttribute('sh', new THREE.BufferAttribute(sh, 1));
  flakeU = { t: { value: 0 }, amt: { value: 1 }, origin: { value: new THREE.Vector3() } };
  flakes = new THREE.Points(g, new THREE.ShaderMaterial({ uniforms: flakeU, transparent: true, depthWrite: false,
    vertexShader: `uniform float t, amt; uniform vec3 origin; attribute float sz, sh; varying float vS; void main(){ vec3 p = position; p.y = mod(p.y - t*(1.6 + sh*1.2), 30.); p.x += sin(t*.8 + sh*20.)*0.6 + t*0.8; p.x = mod(p.x + 40., 80.) - 40.; p += origin;
      vS = sh; vec4 mv = modelViewMatrix*vec4(p,1.); gl_Position = projectionMatrix*mv; gl_PointSize = step(sh, amt) * sz * 4200. / -mv.z; }`,
    fragmentShader: `varying float vS; void main(){ vec2 d = gl_PointCoord - .5; if (dot(d,d) > .25) discard; vec3 c = mix(vec3(.36,.2,.1), vec3(.55,.34,.2), vS); gl_FragColor = vec4(c, .95); }` }));
  flakes.userData.ndSkip = true; flakes.frustumCulled = false; K.scene.add(flakes);
}

// ---------------- dust state ----------------
const brownAt = (f) => { const S = shotAt(f).id; if (['hook', 'car', 'street', 'mug'].includes(S)) return 1; if (S === 'aerial') return ramp(f, A(5), E(5)); if (S === 'harmless') return 1; if (S === 'wash') return 1; return 0; };
const snowAt = (f) => { const S = shotAt(f).id; if (['hook', 'car', 'street', 'mug', 'harmless'].includes(S)) return 0.8; if (S === 'wash') return f > F_CLEAN ? 0.15 : 0.6; if (S === 'aerial') return 1; return 0; };

// ---------------- cameras ----------------
const C = (p, d) => [p[0] + d[0], p[1] + d[1], p[2] + d[2]];
const CAMS = {
  hook: [{ f: 0, pos: [1.6, 1.8, 6.6], look: [-0.1, 1.6, 0.9], fov: 46 }, { f: F_2020 + 6, pos: [1.2, 1.6, 5.4], look: [-0.2, 1.5, 0.9], fov: 44 }, { f: cut(1), pos: [3.5, 2.4, 9], look: [-1, 2.6, 0], fov: 48 }],
  car: [{ f: cut(1), pos: [9.5, 2.4, 5.5], look: [4.8, 1.0, -2.4], fov: 44 }, { f: F_FLAKES, pos: [8.6, 2.0, 4.2], look: [5.0, 1.1, -2.2], fov: 42 }, { f: cut(2), pos: [8.2, 1.9, 3.6], look: [5.2, 1.2, -2.0], fov: 40 }],
  factory: [{ f: cut(2), pos: [22, 24, 14], look: [0, 8, FZ + 4], fov: 48 }, { f: F_FACT, pos: [12, 16, -8], look: [0, 12, FZ + 13], fov: 46 }, { f: cut(3), pos: [6, 20, -18], look: [-6, 16, FZ], fov: 46 }],
  fan: [{ f: cut(3), pos: [-3.5, 21, FZ + 13], look: [-8, 18, FZ + 6], fov: 42 }, { f: F_BROKE - 4, pos: [-5, 20.4, FZ + 11.5], look: [-8, 18.6, FZ + 6], fov: 38 }, { f: cut(4), pos: [-4.4, 20.6, FZ + 12.5], look: [-8, 18.6, FZ + 6], fov: 40 }],
  wind: [{ f: cut(4), pos: [26, 18, FZ + 30], look: [-6, 20, FZ + 6], fov: 48 }, { f: F_DUST, pos: [22, 15, FZ + 26], look: [-4, 18, FZ + 4], fov: 48 }],
  aerial: [{ f: cut(5), pos: [40, 34, 40], look: [0, 4, -6], fov: 48 }, { f: cut(6), pos: [26, 24, 34], look: [0, 2, -2], fov: 46 }],
  street: [{ f: cut(6), pos: [1.5, 1.8, 10.5], look: [-4.0, 1.4, 4.6], fov: 46 }, { f: F_MUG - 8, pos: [2.0, 2.4, 11.5], look: [-5, 2.0, 0], fov: 48 }],
  mug: [{ f: F_MUG - 8, pos: [42, 13, 8], look: [-1, 6, 0], fov: 48 }, { f: cut(7), pos: [38, 12, 7], look: [-1, 6.5, 0], fov: 46 }],
  harmless: [{ f: cut(7), pos: [0.4, 1.75, 9.5], look: [0, 1.85, 5.3], fov: 40 }, { f: cut(8), pos: [0.3, 1.7, 8.5], look: [0, 1.95, 5.3], fov: 38 }],
  wash: [{ f: cut(8), pos: [8.5, 1.9, 2.8], look: [3.5, 1.2, -2.6], fov: 44 }, { f: F_CLEAN, pos: [9, 2.2, 4.5], look: [3.5, 1.6, -2.6], fov: 46 }, { f: TOTAL - 1, pos: [9.5, 2.4, 5.5], look: [4.0, 1.4, -2.4], fov: 46 }],
};
const KICKS = [{ f: F_BROKE, a: 0.05 }, { f: F_MUG, a: 0.06 }];
const camAt = (f) => {
  const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS });
  c.shadowAt = ['factory', 'fan', 'wind'].includes(S.id) ? [-4, 10, FZ + 8] : S.id === 'aerial' ? [0, 0, -4] : [c.look[0], 0, c.look[2]];
  return c;
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => {
  const S = shotAt(f);
  if (S.id === 'hook' && f < cut(1) - 20) return { focus: dist(Cm.pos, [-1.0, 1.9, 1.4]), cinf: 9 };
  if (S.id === 'harmless') return { focus: dist(Cm.pos, [0, 1.8, 5.3]), cinf: 10 };
  if (S.id === 'car') return { focus: dist(Cm.pos, [3.5, 1.2, -1.6]), cinf: 8 };
  return { focus: 10, cinf: 0 };
};

// ---------------- world pose ----------------
function poseWorld(f, cam) {
  const S = shotAt(f), b = brownAt(f), choc = new K.THREE.Color('#7a4a2a');
  const clean = S.id === 'wash' ? M.smooth(ramp(f, F_CLEAN - 4, F_CLEAN + 26)) : 0;
  carMats.forEach(({ m, c0 }, j) => { const k = b * 0.82 * (j < 2 && clean ? 1 - clean : 1); m.color.copy(c0).lerp(choc, k); });
  walkMat.color.set('#cfcac0').lerp(new K.THREE.Color('#9a6a44'), b * 0.75);
  roofMats.forEach((m, j) => { if (!m.userData.c0) m.userData.c0 = m.color.clone(); m.color.copy(m.userData.c0).lerp(choc, b * 0.5); });
  const spin = S.id === 'fan' ? (f < F_BROKE ? f * 0.6 : F_BROKE * 0.6 + 0.4 * (1 - Math.exp(-(f - F_BROKE) / 8))) : f * 0.6;
  fanBlades.rotation.y = spin; fanBlades.rotation.z = S.id === 'fan' && f > F_BROKE ? 0.25 : ['wind', 'aerial'].includes(S.id) ? 0.25 : 0;
  mug.visible = S.id === 'mug'; const mk = S.id === 'mug' ? M.back(ramp(f, F_MUG - 2, F_MUG + 10)) : 0; mug.scale.setScalar(Math.max(0.01, mk));
  flakeU.t.value = f / 30; flakeU.amt.value = snowAt(f); flakes.visible = snowAt(f) > 0;
  flakeU.origin.value.set(Math.round(cam.pos[0] / 80) * 80 * 0, 0, 0);
}

// ---------------- characters ----------------
const RES_A = { jacket: '#e86a8a', pants: '#3b4f7a', boots: '#f2f0ea', hat: 'hair', hair: '#d9a441', dress: '#5ab0c8', skin: '#f5c9a0' };
const RES_B = { jacket: '#3f8a5a', pants: '#4a4f5c', boots: '#3a2a20', hat: 'hair', hair: '#2b211c', moustache: '#2b211c', skin: '#c99067' };
const KID = { jacket: '#f2c230', pants: '#3b4f7a', boots: '#c8402e', hat: 'cap', cap: '#c8402e', build: 'kid' };
const SPOKE = { jacket: '#2b2e36', pants: '#2b2e36', boots: '#1e1a1a', hat: 'hair', hair: '#8a8a8a', sash: '#c8a040', build: 'stout' };
const LIGHT2D = -2.1;
const fo = (f, seed, o) => ({ mode: 'stand', light: LIGHT2D, seed, blink: blinkAt(f, seed), ...o });
const card = (T, key, o, opts, pos, extra = {}) => ({ key: key + JSON.stringify(opts) + (extra.dust ? q(extra.dust, 1) : '') + (extra.sponge ? 's' : ''), draw: (p) => { T.bodyFront(p, o, opts); if (extra.dust) dusting(p, extra.dust); if (extra.sponge) sponge(p); }, x: pos[0], y: pos[1], z: pos[2], ...extra });
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1] - 1.07 * s, z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
const dusting = (p, k) => { let s = 3; const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); p.g.save(); p.g.globalAlpha = k;
  for (let i = 0; i < 40; i++) { p.g.fillStyle = i % 2 ? '#6b3a1c' : '#8a5a34'; p.g.beginPath(); p.g.arc(200 + r() * 200, 120 + r() * 140, 4 + r() * 5, 0, 7); p.g.fill(); } p.g.restore(); };
const sponge = (p) => { p.poly([[350, 560], [450, 540], [460, 610], [360, 630]], '#f2c230', 8); for (let i = 0; i < 5; i++) p.ell(370 + i * 18, 575 + (i % 2) * 20, 6, 5, '#d9a020', 0); };
const inFront = (c, d, ux, uy) => {
  const V = K.THREE.Vector3, p = new V(...c.pos), dir = new V(...c.look).sub(p).normalize(), right = new V().crossVectors(dir, new V(0, 1, 0)).normalize(), up = new V().crossVectors(right, dir);
  const h = d * Math.tan(c.fov * Math.PI / 360); return p.addScaledVector(dir, d).addScaledVector(right, ux * h).addScaledVector(up, uy * h).toArray();
};
const wordCard = (f, f0, txt, c, col = '#f6c83a', dur = 1e9, size = 170, uy = 0.42) => { if (f < f0 - 1 || f > f0 + dur) return null; const t = q(Math.min(1, (f - f0 + 1) / 12));
  const r = Math.min(1, 400 / (0.7 * size * txt.length)), fs = size * r, s = Math.min(2.5, 1.25 / r);
  return FX('w' + txt + t, (p) => PR.word(p, txt, t, col, fs), inFront(c, 7, 0, uy), s, { order: 9 }); };
const brownPuff = (p, t, seed) => { p.g.save(); p.g.globalAlpha = Math.max(0, 1 - t) * 0.9;
  for (let i = 0; i < 7; i++) { const a = i * 0.9 + seed, d = 60 + 160 * t; p.ell(300 + Math.cos(a) * d, 500 + Math.sin(a) * d * 0.5, (70 + 30 * (i % 2)) * (0.7 + t), (55 + 20 * (i % 3)) * (0.7 + t), i % 2 ? '#7a4a2a' : '#94603a', 0); }
  p.g.restore(); };

function actorsAt(f, T) {
  const S = shotAt(f), out = [], id = idle(f, 3);
  switch (S.id) {
    case 'hook':
      out.push(card(T, 'ra', RES_A, fo(f, 3, { expr: 'lick', look: 0.3, headTilt: q(id.headTilt, 1) }), [-1.0, 0.14, 1.4], { dust: 0.8 }));
      out.push(card(T, 'kid', KID, fo(f, 5, { expr: 'laugh', look: -0.4, wave: q(Math.sin(f * 0.4), 1) }), [0.8, 0.14, 0.4], { dust: 0.7 })); break;
    case 'car': out.push(card(T, 'rb', RES_B, fo(f, 4, { expr: f < F_FLAKES ? 'neutral' : 'shock', look: -0.6, facing: -1, wave: f > F_CARS ? q(Math.sin(f * 0.5), 1) : undefined }), [6.2, 0.04, -1.0], { dust: 0.5 })); break;
    case 'street': out.push(card(T, 'ra', RES_A, fo(f, 3, { expr: 'smile', look: -0.5, facing: -1 }), [-3.0, 0.14, 4.8], { dust: 1 }));
      out.push(card(T, 'rb', RES_B, fo(f, 4, { expr: 'dazed', look: 0.4 }), [-5.2, 0.14, 5.2], { dust: 1 })); break;
    case 'mug': out.push(card(T, 'kid', KID, fo(f, 5, { expr: f > F_MUG + 4 ? 'lick' : 'shock', look: -0.4 }), [14, 0.14, 4.8], { dust: 0.7 })); break;
    case 'harmless': out.push(card(T, 'sp', SPOKE, fo(f, 6, { expr: f < F_HARM ? 'smile' : 'grin', look: 0.1, wave: f > F_HARM - 2 && f < F_HARM + 24 ? q(Math.sin(f * 0.4), 1) : undefined }), [0, 0.14, 5.3])); break;
    case 'wash':
      out.push(card(T, 'rb', RES_B, fo(f, 4, { expr: f < F_PAY ? 'pained' : 'grin', look: -0.5, facing: -1 }), [5.6, 0.04, -1.0], { sponge: true }));
      out.push(card(T, 'sp', SPOKE, fo(f, 6, { expr: 'smile', look: 0.5, facing: 1, wave: f > F_PAY ? q(Math.sin(f * 0.3), 1) : undefined }), [7.2, 0.04, -0.4])); break;
  }
  return out;
}
function fxAt(f, T, cam) {
  const S = shotAt(f), out = [], push = (x) => x && out.push(x);
  if (S.id === 'hook') push(wordCard(f, F_2020, '2020', cam));
  if (S.id === 'fan' && f >= F_BROKE - 2) { const t = q(Math.min(1, (f - F_BROKE + 2) / 14)); if (t < 1) out.push(FX('fb' + t, (p) => { p.g.translate(50, 250); T.fxBurst(p, t, '#fff3b0'); }, [-8, 19.4, FZ + 6], 2.2));
    push(wordCard(f, F_BROKE, 'CLUNK!', cam, '#ffffff', 26, 190));
    for (let i = 0; i < 3; i++) { const t2 = q(((f - F_BROKE) / 40 + i * 0.33) % 1, 1); out.push(FX('fs' + i + t2, (p) => brownPuff(p, t2, i), [-8 + t2 * 3, 19.5 + t2 * 4, FZ + 6], 3)); } }
  if (S.id === 'wind' || S.id === 'aerial') { // the cocoa plume blowing over town
    const n = S.id === 'wind' ? 7 : 9, f0 = S.id === 'wind' ? F_WIND - 6 : A(5) - 40;
    for (let i = 0; i < n; i++) { const t = ((f - f0) / 55 + i / n) % 1; if (f < f0) continue; const tq = q(t, 2);
      const x = S.id === 'wind' ? -8 + t * 40 : -14 + t * 44, y = S.id === 'wind' ? 19 + t * 6 : 18 - t * 8, z = S.id === 'wind' ? FZ + 6 + t * 26 : -30 + t * 34 + (i % 3) * 3;
      out.push(FX('pl' + i + tq, (p) => brownPuff(p, Math.min(0.85, tq), i), [x, y, z], 6 + t * 10)); }
    if (S.id === 'wind') for (let i = 0; i < 4; i++) { const t = q(((f - F_WIND) / 16 + i * 0.25) % 1, 1); if (f < F_WIND - 2) break; out.push(FX('wl' + i + t, (p) => { p.g.globalAlpha = Math.sin(t * Math.PI); p.stroke([[40 + t * 300, 400 + i * 60], [240 + t * 300, 380 + i * 60], [380 + t * 300, 410 + i * 60]], 14, '#ffffff'); }, [6, 18 + i * 2.2, FZ + 18], 7)); }
    if (S.id === 'wind') push(wordCard(f, F_WIND, 'WHOOSH!', cam, '#ffffff', 30, 180));
  }
  if (S.id === 'mug') push(wordCard(f, F_MUG, 'HOT CHOCOLATE', cam, '#f6c83a'));
  if (S.id === 'harmless') push(wordCard(f, F_HARM, 'HARMLESS', cam, '#7ad06a'));
  if (S.id === 'wash') { push(wordCard(f, F_CLEAN, 'FREE CAR WASH', cam, '#6aa8f2'));
    if (f > F_CLEAN) for (let i = 0; i < 3; i++) { const t = q(((f - F_CLEAN) / 14 + i * 0.33) % 1, 1); out.push(FX('bub' + i + t, (p) => { p.g.translate(150, 500); T.fxSplash(p, t); }, [3.0 + i * 1.2, 1.0, -2.0], 1.6)); } }
  return out;
}

export default {
  TOTAL, build,
  frame(f, k) {
    const S = shotAt(f), cam = camAt(f);
    poseWorld(f, cam);
    const light = ['aerial'].includes(S.id) ? { ...DUSTY } : { ...SUMMER };
    if (['hook', 'car', 'street', 'harmless'].includes(S.id)) { light.sky = '#e6dccc'; light.skyHor = '#e2d2bc'; light.fog = '#d6c4ae'; light.fogNear = 80; light.fogFar = 700; }
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
  },
};
