// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Wrong Way Corrigan" — Brooklyn to Dublin, 17–18 July 1938 (64 s TikTok). Timed via corrigan_timing.js.
import { TOTAL, LINES, wf } from './corrigan_timing.js';
import * as PR from '../props.js';
import { INK } from '../toon.js';
import { camFromKeys, M, clamp, ramp, lerp, lerp3, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const W = (li, w) => wf(li, w);
const F_1938 = W(0, '1938'), F_CAL0 = W(0, 'california'), F_IRE = W(0, 'ireland'), F_ATL = W(1, 'atlantic'), F_LIND = W(2, 'lindbergh'), F_SPIRIT = W(2, 'spirit'), F_OFF = W(3, 'officials'), F_UNSAFE = W(3, 'unsafe'),
  F_300 = W(4, 'three'), F_PLAN = W(5, 'flight'), F_CAL1 = W(5, 'california'), F_DAWN = W(6, 'dawn'), F_TOOK = W(6, 'took'), F_EAST = W(6, 'east'), F_RADIO = W(7, 'radio'), F_CHOC = W(7, 'chocolate'), F_FIG = W(7, 'fig'),
  F_WORSE = W(8, 'worse'), F_GAS = W(8, 'gasoline'), F_PUNCH = W(9, 'punched'), F_SCREW = W(9, 'screwdriver'), F_28 = W(10, 'twenty'), F_CLOUDS = W(10, 'clouds'), F_OCEAN = W(10, 'ocean'), F_DOWN = W(11, 'down'), F_26 = W(11, 'twenty'),
  F_LANDED = W(12, 'landed'), F_DUB = W(12, 'dublin'), F_WHERE = W(12, 'where'), F_INT = W(12, 'intended'), F_EXCUSE = W(13, 'excuse'), F_FOG = W(13, 'fog'), F_WRONG = W(13, 'wrong'), F_COMP = W(13, 'compass'),
  F_NOBODY = W(14, 'nobody'), F_AMER = W(14, 'america'), F_LOVED = W(14, 'loved'), F_TICK = W(15, 'ticker'), F_BIGGER = W(15, 'bigger'), F_LIND2 = W(15, 'lindbergh'), F_PUN = W(16, 'punishment'), F_14 = W(16, 'fourteen'),
  F_EXACT = W(16, 'exactly'), F_BOAT = W(16, 'boat'), F_SWORE = W(17, 'swore'), F_CAL2 = W(17, 'california');
const SHOTS = [['hook', 0], ['land0', F_IRE - 5], ['dream', cut(1)], ['spirit', cut(2)], ['officials', cut(3)], ['cheap', cut(4)], ['plan', cut(5)], ['takeoff', cut(6)], ['turn', F_EAST - 14],
  ['radio', cut(7)], ['food', F_CHOC - 5], ['leak', cut(8)], ['hole', cut(9)], ['clouds', cut(10)], ['below', cut(11)], ['dublin', cut(12)], ['quote', F_WHERE - 5], ['compass', cut(13)],
  ['nobody', cut(14)], ['loved', F_AMER - 5], ['parade', cut(15)], ['ship', cut(16)], ['swore', cut(17)], ['end', E(17) + 6]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const DAY = { az: 130, el: 45, sky: '#e2ecf8', ground: '#7a8a5a', hemi: 1.15, sun: '#fff2dc', sunI: 2.4, fog: '#d8e6f2', fogNear: 200, fogFar: 1600, skyTop: '#3a86d8', skyHor: '#e0ecf6', sat: 1.12, vig: 0.22, shadowExt: 30 };
const DAWN = { ...DAY, az: 80, el: 10, sun: '#ffc8a0', sky: '#ffd8c0', skyTop: '#5a6ac0', skyHor: '#ffc8a8', fog: '#f0c8b8', vig: 0.28 };
const NIGHT = { ...DAY, az: 200, el: 40, sky: '#5a6aa8', ground: '#2a3048', hemi: 1.0, sun: '#b8c4ff', sunI: 1.3, fog: '#1a2448', skyTop: '#060c26', skyHor: '#22305a', sat: 0.95, vig: 0.36 };
const IRL = { ...DAY, az: 150, el: 35, sky: '#e4ecf0', ground: '#6a9a4a', skyTop: '#5a8ac8', skyHor: '#e8eef2', fog: '#e0e8ec', sat: 1.15 };
const AF = [0, 0, 0], SEA = [4000, 0, 0], DUB = [-3000, 0, 0], NYC = [0, 0, 3000];
let K, plane, prop, spirit, sea, conf, confU, liner;
const rnd = (() => { let s = 1938; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();

const makePlane = (color = '#c8ccd2', label = 'SUNSHINE', withWindow = true) => {
  const { THREE } = K, root = K.group(), c = K.col(color), dk = K.col('#3a3a44'), trim = K.col('#2a5a9a');
  const lt = PR.canvasTex(512, 128, (g) => { g.fillStyle = color; g.fillRect(0, 0, 512, 128); g.fillStyle = '#2a5a9a'; g.fillRect(0, 96, 512, 10); g.fillStyle = '#1a2a4a'; g.font = 'bold 54px Poppins, sans-serif'; g.textAlign = 'center'; g.fillText(label, 256, 70); });
  // tapered tail boom
  const boom = K.add(new THREE.CylinderGeometry(0.75, 0.25, 5, 12), K.toon({ map: lt }), -2.6, 1.5, 0, root); boom.rotation.z = Math.PI / 2;
  // cabin with an open window on the +z side
  K.slab(0, 2.6, 0.6, 1.3, -0.8, 0.8, c, root); K.slab(0, 2.6, 2.0, 2.4, -0.8, 0.8, c, root); K.slab(0, 2.6, 1.3, 2.0, -0.8, -0.7, c, root);
  K.slab(0, 0.35, 1.3, 2.0, 0.7, 0.8, c, root); K.slab(2.2, 2.6, 1.3, 2.0, 0.7, 0.8, c, root); K.slab(0.05, 2.55, 0.62, 2.38, -0.7, -0.6, K.col('#3a3a48'), root).castShadow = false; K.slab(0.05, 2.55, 0.6, 0.66, -0.7, 0.7, K.col('#3a3a48'), root);
  if (!withWindow) K.slab(0.35, 2.2, 1.3, 2.0, 0.72, 0.78, K.col('#9fd0e8'), root);
  K.slab(2.6, 3.6, 0.8, 2.1, -0.75, 0.75, c, root); K.add(new THREE.CylinderGeometry(0.62, 0.62, 0.5, 16), dk, 3.75, 1.45, 0, root).rotation.z = Math.PI / 2;
  K.slab(3.0, 3.3, 1.2, 1.8, -0.78, 0.78, K.col('#9a9aa4'), root);
  // high wing + struts
  K.slab(-0.4, 1.8, 2.4, 2.6, -6.2, 6.2, c, root); K.slab(-0.42, 1.82, 2.45, 2.55, -6.25, -5.9, trim, root); K.slab(-0.42, 1.82, 2.45, 2.55, 5.9, 6.25, trim, root);
  for (const s of [-1, 1]) { K.beam(K.V(1.2, 0.7, s * 0.8), K.V(1.0, 2.4, s * 3.6), 0.08, dk, root); K.beam(K.V(0.2, 0.7, s * 0.8), K.V(0.4, 2.4, s * 3.6), 0.08, dk, root); }
  // tail
  K.slab(-5.4, -4.6, 1.5, 3.2, -0.06, 0.06, trim, root); K.slab(-5.5, -4.4, 1.45, 1.6, -2.0, 2.0, c, root);
  // gear
  for (const s of [-1, 1]) { K.beam(K.V(1.4, 0.6, s * 0.6), K.V(1.4, 0.35, s * 1.3), 0.08, dk, root); const w = K.add(new THREE.CylinderGeometry(0.38, 0.38, 0.2, 16), dk, 1.4, 0.38, s * 1.4, root); w.rotation.x = Math.PI / 2; }
  K.add(new THREE.SphereGeometry(0.12, 8, 6), dk, -5.0, 0.3, 0, root);
  // propeller disc + blades
  const pr = K.group(root); pr.position.set(4.05, 1.45, 0);
  K.add(new THREE.CylinderGeometry(1.25, 1.25, 0.02, 24), new THREE.MeshBasicMaterial({ color: '#dfe6ee', transparent: true, opacity: 0.35 }), 0, 0, 0, pr).rotation.z = Math.PI / 2;
  pr.children[0].userData.ndSkip = true; pr.children[0].castShadow = false;
  const bl = K.group(pr); K.slab(-0.05, 0.05, -1.2, 1.2, -0.08, 0.08, dk, bl);
  return { root, prop: bl };
};

function build(k) {
  K = k; const { THREE } = K, M4 = THREE.Matrix4;
  K.addClouds(14, 1100, 260);
  // ---- airfield (Floyd Bennett Field) ----
  const af = K.group(); af.position.set(...AF);
  K.slab(-500, 500, -0.1, 0, -500, 500, K.toon({ map: PR.speckTex('#8aa85a', ['#7a9a4a', '#9ab86a', '#88a050'], 6, 2400, 80) }), af, false);
  K.slab(-300, 300, 0, 0.05, -12, 12, K.toon({ map: PR.speckTex('#8a8a88', ['#7a7a78', '#9a9a98'], 7, 1200, 20) }), af, false);
  for (let x = -280; x < 300; x += 20) K.slab(x, x + 9, 0.05, 0.07, -0.3, 0.3, K.col('#f2f0e8'), af, false);
  for (let i = 0; i < 3; i++) { const hg = K.group(af); hg.position.set(-30 + i * 26, 0, -40); const hr = K.add(new THREE.CylinderGeometry(9, 9, 22, 24, 1, false, -Math.PI / 2, Math.PI), K.col(i % 2 ? '#b8bcc4' : '#a8acb4'), 0, 0, 0, hg); hr.rotation.x = Math.PI / 2; hr.position.y = 0;
    K.slab(-9, 9, 0, 1, -11, 11, K.col('#9a9aa0'), hg); K.slab(-6, 6, 0, 7, 10.9, 11.0, K.col('#5a5a64'), hg); }
  K.cyl(0.08, 0.1, 7, K.col('#e8e0d0'), 30, 0, -16, af); K.add(new THREE.ConeGeometry(0.5, 2.4, 10, 1, true), K.toon({ color: '#f08a2a', side: THREE.DoubleSide }), 31.2, 6.6, -16, af).rotation.z = Math.PI / 2;
  for (let i = 0; i < 10; i++) K.sphere(40, K.col('#7a9a8a'), -500 + i * 110, -14, -300, af, 1.6, 0.6, 1);
  // Corrigan's plane + the Spirit (silver)
  const P = makePlane('#c8ccd2', 'SUNSHINE'); plane = P.root; prop = P.prop;
  const S2 = makePlane('#d8dce2', 'SPIRIT OF ST. LOUIS', false); spirit = S2.root; spirit.position.set(-4, 0, -20); spirit.rotation.y = 0.4;
  // ---- the sea set: ocean, a cloud deck, the liner ----
  sea = PR.ocean(K, { y: 0, shoreZ: 1500, deep: '#1f5f8a', shal: '#2f7aa0', foam: '#eef6f8' }); sea.mesh.position.x = SEA[0];
  const cm = [];
  for (let i = 0; i < 260; i++) { const x = SEA[0] - 700 + rnd() * 1400, z = -700 + rnd() * 1400, s = 14 + rnd() * 18; cm.push(new M4().makeTranslation(x, 140 + rnd() * 10, z).multiply(new M4().makeScale(s * 1.6, s * 0.5, s))); }
  const deck = K.add(PR.mergeCopies(new THREE.IcosahedronGeometry(1, 2), cm), K.toon({ color: '#f4f6fa' }), 0, 0, 0); deck.frustumCulled = false; deck.castShadow = false; K.deck = deck;
  liner = K.group(); liner.position.set(SEA[0] + 300, 0, 200);
  K.slab(-40, 40, -2, 8, -6, 6, K.col('#2a2a30'), liner); K.slab(-40, 40, -2, 1, -6.1, 6.1, K.col('#b83a2a'), liner); K.slab(-30, 28, 8, 16, -5, 5, K.col('#f2f0e8'), liner);
  for (const x of [-12, 6]) { K.cyl(2.2, 2.4, 9, K.col('#c83a2a'), x, 16, 0, liner); K.cyl(2.25, 2.25, 2.5, K.col('#2a2a30'), x, 22.5, 0, liner); }
  // ---- Dublin (Baldonnel) ----
  const db = K.group(); db.position.set(...DUB);
  K.slab(-400, 400, -0.1, 0, -400, 400, K.toon({ map: PR.speckTex('#6aaa4a', ['#5a9a3e', '#7aba5a', '#62a246'], 9, 2400, 80) }), db, false);
  for (let i = 0; i < 12; i++) K.sphere(50, K.col(i % 2 ? '#5a8a4a' : '#6a9a54'), -400 + i * 75, -20, -260 - (i % 3) * 40, db, 1.5, 0.7, 1);
  const hg = K.group(db); hg.position.set(-20, 0, -30); K.slab(-10, 10, 0, 8, -8, 8, K.col('#8a8a80'), hg); K.slab(-10.4, 10.4, 8, 8.6, -8.4, 8.4, K.col('#5a5a60'), hg); K.slab(-7, 7, 0, 6.5, 7.95, 8.05, K.col('#4a4a50'), hg);
  K.cyl(0.08, 0.1, 9, K.col('#e8e0d0'), 6, 0, -18, db);
  K.add(new THREE.PlaneGeometry(3, 1.5), new THREE.MeshBasicMaterial({ map: PR.canvasTex(96, 48, (g) => { g.fillStyle = '#2a9a4a'; g.fillRect(0, 0, 32, 48); g.fillStyle = '#ffffff'; g.fillRect(32, 0, 32, 48); g.fillStyle = '#f08a2a'; g.fillRect(64, 0, 32, 48); }), side: THREE.DoubleSide }), 7.5, 8.2, -18, db);
  // ---- New York parade street ----
  const ny = K.group(); ny.position.set(...NYC);
  K.slab(-60, 60, -0.1, 0, -200, 60, K.toon({ map: PR.speckTex('#6a6a70', ['#5a5a60', '#7a7a80'], 3, 1600, 40) }), ny, false);
  for (const s of [-1, 1]) K.slab(s * 7, s * 10, 0, 0.25, -200, 60, K.col('#b8b4aa'), ny, false);
  for (let i = 0; i < 12; i++) { const z = 40 - i * 18, h = 30 + (i * 13) % 35; for (const s of [-1, 1]) K.slab(s * 10, s * 24, 0, h + (s > 0 ? 8 : 0), z - 8.5, z + 8.5, K.toon({ map: PR.facadeTex(['#b8a890', '#a87a5a', '#c8b8a0', '#9a8a7a'][(i + (s > 0)) % 4], 4, 8, i * 3 + (s > 0), '#e8e0d0') }), ny); }
  const car = PR.sedan(K, '#2a2a30', ny); car.root.position.set(0, 0, -6); car.root.rotation.y = -Math.PI / 2; car.cabin.visible = false; K.car = car;
  // confetti (point sprites) over the street
  const N = 2400, pos = new Float32Array(N * 3), sh = new Float32Array(N);
  for (let j = 0; j < N; j++) { pos.set([-14 + rnd() * 28, rnd() * 40, -60 + rnd() * 80], j * 3); sh[j] = rnd(); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('sh', new THREE.BufferAttribute(sh, 1));
  confU = { t: { value: 0 } };
  conf = new THREE.Points(g, new THREE.ShaderMaterial({ uniforms: confU, transparent: true, depthWrite: false,
    vertexShader: `uniform float t; attribute float sh; varying float vS; void main(){ vec3 p = position; p.y = mod(p.y - t*(1.5 + sh*1.5), 40.); p.x += sin(t*1.5 + sh*30.)*0.8; vS = sh; vec4 mv = modelViewMatrix*vec4(p,1.); gl_Position = projectionMatrix*mv; gl_PointSize = min(24., 0.14 * 4200. / -mv.z); }`,
    fragmentShader: `varying float vS; void main(){ vec2 d = abs(gl_PointCoord - .5); if (d.x > .5 || d.y > .22 + .2*fract(vS*7.)) discard; vec3 c = vS < .25 ? vec3(1.,.95,.85) : vS < .5 ? vec3(.95,.8,.3) : vS < .75 ? vec3(.5,.75,1.) : vec3(1.,.55,.6); gl_FragColor = vec4(c,1.); }` }));
  conf.position.set(...NYC); conf.userData.ndSkip = true; conf.frustumCulled = false; K.scene.add(conf);
}

// ---------------- 2D drawings ----------------
const compass = (p, ang) => { p.ell(300, 500, 250, 250, '#e8dcc0', 16); p.ell(300, 500, 210, 210, '#f8f2e4', 6);
  p.g.font = 'bold 70px Poppins, sans-serif'; p.g.textAlign = 'center'; p.g.textBaseline = 'middle'; p.g.fillStyle = INK; [['N', 0], ['E', 90], ['S', 180], ['W', 270]].forEach(([t, a]) => { const r = a * Math.PI / 180; p.g.fillText(t, 300 + Math.sin(r) * 160, 500 - Math.cos(r) * 160); });
  p.g.save(); p.g.translate(300, 500); p.g.rotate(ang); p.poly([[0, -150], [26, 0], [-26, 0]], '#d83a3a', 7); p.poly([[0, 150], [26, 0], [-26, 0]], '#ffffff', 7); p.g.restore(); p.ell(300, 500, 16, 16, '#c8a050', 5); };
const chocBar = (p) => { p.g.save(); p.g.translate(300, 500); p.g.rotate(-0.2); p.poly([[-180, -80], [180, -80], [180, 80], [-180, 80]], '#6a3a1e', 12); p.poly([[-180, -80], [40, -80], [40, 80], [-180, 80]], '#c83a3a', 10);
  p.g.fillStyle = '#fff'; p.g.font = 'bold 48px Poppins, sans-serif'; p.g.textAlign = 'center'; p.g.fillText('CHOC', -70, 16); for (let i = 0; i < 3; i++) p.stroke([[60 + i * 40, -78], [60 + i * 40, 78]], 6, '#4a2410'); p.g.restore(); };
const figBox = (p) => { p.g.save(); p.g.translate(300, 500); p.g.rotate(0.15); p.poly([[-170, -120], [170, -120], [170, 120], [-170, 120]], '#f2d890', 12);
  p.g.fillStyle = '#7a3a5a'; p.g.font = 'bold 56px Poppins, sans-serif'; p.g.textAlign = 'center'; p.g.fillText('FIG', 0, -20); p.g.fillText('BARS', 0, 50); p.g.restore(); };
const screwdriver = (p, t) => { p.g.save(); p.g.translate(300, 500); p.g.rotate(-0.7 + 0.3 * Math.sin(t * 12)); p.poly([[-40, -260], [40, -260], [50, -40], [-50, -40]], '#e8b830', 12); p.stroke([[0, -40], [0, 220]], 30, INK); p.stroke([[0, -40], [0, 220]], 18, '#c8ccd4'); p.poly([[-16, 220], [16, 220], [0, 270]], '#c8ccd4', 6); p.g.restore(); };
const drops = (p, t) => { for (let i = 0; i < 6; i++) { const k = (t + i / 6) % 1; p.g.save(); p.g.globalAlpha = 1 - k * 0.6; p.ell(180 + (i % 3) * 120, 200 + k * 700, 26, 38, '#d8c050', 7); p.g.restore(); } };

// ---------------- characters ----------------
const DOUG = { jacket: '#5a4a3a', pants: '#3a3a48', boots: '#2a2020', hat: 'hair', hair: '#3a2a20', skin: '#f5c9a0' };
const OFF = { jacket: '#2a3a5a', pants: '#2a3a5a', boots: INK, hat: 'cap', cap: '#1a2a4a', moustache: '#d9d0c0', build: 'stout', skin: '#f5c9a0', buttons: '#e8c45a' };
const IRISH = { jacket: '#3a5a3a', pants: '#2a3a2a', boots: INK, hat: 'cap', cap: '#2a4a2a', moustache: '#8a5a3a', build: 'stout', skin: '#ffe2c2', buttons: '#e8c45a' };
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
  const d = ['radio', 'food', 'leak', 'hole', 'swore', 'dream', 'officials', 'cheap', 'plan', 'spirit'].includes(shotAt(f).id) ? 2.6 : (shotAt(f).id === 'below' && f < F_DOWN ? 2.6 : 7);
  return FX('w' + txt + t, (p) => PR.word(p, txt, t, col, fs), inFront(c, d, 0, uy), s * d / 7, { order: 9 }); };

// ---------------- plane path per shot ----------------
const V3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const planeAt = (f) => { const S = shotAt(f), id = S.id, t = (f - S.a) / 30;
  const fly = (base, dir = 0, spd = 40) => ({ pos: [base[0] + Math.cos(dir) * spd * t, base[1] + 0.4 * Math.sin(t * 1.3), base[2] - Math.sin(dir) * spd * t], ry: dir, rz: 0.03 * Math.sin(t * 1.1), rx: 0.04 * Math.sin(t * 0.9), on: true });
  if (['hook', 'end', 'radio', 'food', 'leak', 'hole', 'clouds', 'swore'].includes(id)) return fly(V3(SEA, [0, 180, 0]), 0, id === 'hook' || id === 'end' || id === 'clouds' ? 40 : 0);
  if (id === 'below') { const k = M.smooth(ramp(f, S.a, F_DOWN + 6)); const p = fly(V3(SEA, [0, lerp(180, 70, k), 0]), 0, 0); p.rz = -0.25 * Math.sin(k * Math.PI); return p; }
  if (id === 'land0' || id === 'dublin' || id === 'quote' || id === 'nobody') { const k = id === 'land0' ? M.easeOut(ramp(f, S.a, S.b + 10)) : id === 'dublin' ? M.easeOut(ramp(f, S.a, F_DUB)) : 1;
    return { pos: V3(DUB, [lerp(-60, 0, k), lerp(14, 0, k), 0]), ry: 0, rz: lerp(-0.12, 0, k) * 0 + (k < 1 ? 0.1 * (1 - k) : 0), rx: 0, on: true }; }
  if (['dream', 'officials', 'cheap', 'plan', 'spirit'].includes(id)) return { pos: V3(AF, [0, 0, 6]), ry: 0.5, rz: 0.12, rx: 0, on: true };
  if (id === 'takeoff') { const k = ramp(f, F_TOOK, S.b + 6); return { pos: V3(AF, [-60 + 120 * M.easeIn(k), 18 * M.easeIn(ramp(k, 0.45, 1)), 0]), ry: 0, rz: 0, rx: 0, on: true }; }
  if (id === 'turn') { const k = M.smooth(ramp(f, S.a, F_EAST + 10)); return { pos: V3(AF, [60 + 20 * Math.sin(Math.PI * k), 22 + 4 * k, 20 * Math.cos(Math.PI * k) - 20]), ry: Math.PI * k, rx: 0.5 * Math.sin(k * Math.PI), rz: 0, on: true }; }
  return { on: false };
};
function poseWorld(f) {
  const P = planeAt(f); plane.visible = P.on;
  if (P.on) { plane.position.set(...P.pos); plane.rotation.set(P.rx || 0, P.ry || 0, P.rz || 0); prop.rotation.x = f * 1.3; }
  const id = shotAt(f).id; sea.U.t.value = f / 30; confU.t.value = f / 30; conf.visible = id === 'parade' || id === 'loved';
  liner.position.x = SEA[0] + 300 + (f - shotAt(f).a) * 0.25;
  return P;
}
const cabinPt = (P) => { const m = plane.matrixWorld; plane.updateMatrixWorld(); return new K.THREE.Vector3(1.25, 0.43, 0.1).applyMatrix4(plane.matrixWorld).toArray(); };

function actorsAt(f, T, P) {
  const S = shotAt(f), out = [], id = S.id, A3 = (o) => V3(AF, o), D3 = (o) => V3(DUB, o), N3 = (o) => V3(NYC, o);
  const inCab = (expr, extra = {}) => { const c = cabinPt(P); out.push(card(T, 'dc', DOUG, fo(f, 3, { expr, look: 0.6, ...extra }), c, { s: 0.75, blob: false, shadow: false })); };
  switch (id) {
    case 'dream': out.push(card(T, 'd1', DOUG, fo(f, 3, { expr: f > F_ATL ? 'smile' : 'whistle', look: -0.4, headTilt: 6 }), A3([3.2, 0, 9]))); break;
    case 'spirit': out.push(card(T, 'd2', DOUG, fo(f, 3, { expr: 'grin', wave: q(Math.sin(f * 0.3), 1) }), A3([-0.5, 0, -15.5]))); break;
    case 'officials': out.push(card(T, 'of', OFF, fo(f, 9, { expr: f > F_UNSAFE ? 'stubborn' : 'stern', look: -0.3, tilt: q(idle(f, 9).tilt, 1) }), A3([1.5, 0, 11.5]))); out.push(card(T, 'd3', DOUG, fo(f, 3, { expr: f > F_UNSAFE ? 'pained' : 'neutral', look: 0.4 }), A3([-0.2, 0, 11]))); break;
    case 'cheap': out.push(card(T, 'd4', DOUG, fo(f, 3, { expr: 'nervous', look: -0.3 }), A3([3.4, 0, 9.2]))); break;
    case 'plan': out.push(card(T, 'd5', DOUG, fo(f, 3, { expr: f > F_CAL1 ? 'grin' : 'whistle', look: 0.2 }), A3([3.2, 0, 9.4]))); break;
    case 'radio': inCab('neutral'); break; case 'food': inCab('lick'); break; case 'leak': inCab(f > F_GAS ? 'shock' : 'nervous'); break; case 'hole': inCab('stern', { tilt: q(5 * Math.sin(f * 0.8), 0) }); break;
    case 'below': inCab(f > F_DOWN ? 'shock' : 'dazed'); break; case 'swore': inCab(f > F_SWORE ? 'grin' : 'grin'); break;
    case 'quote': out.push(card(T, 'd6', DOUG, fo(f, 3, { expr: f > F_INT ? 'grin' : 'whistle', look: 0.4, wave: f > F_INT ? q(Math.sin(f * 0.3), 1) : undefined }), D3([2.8, 0, 3.2])));
      out.push(card(T, 'ir', IRISH, fo(f, 15, { expr: f > F_INT ? 'shock' : 'neutral', look: -0.4 }), D3([4.6, 0, 3.0]))); break;
    case 'nobody': out.push(card(T, 'ir2', IRISH, fo(f, 15, { expr: 'squint', look: -0.2, tilt: q(idle(f, 15).tilt, 1) }), D3([4.6, 0, 3.0]))); out.push(card(T, 'd7', DOUG, fo(f, 3, { expr: 'smile', look: 0.4 }), D3([2.8, 0, 3.2]))); break;
    case 'loved': case 'parade': { out.push(card(T, 'dp', DOUG, fo(f, 3, { expr: 'laugh', wave: q(Math.sin(f * 0.35), 1) }), N3([0, 0.9, -6]), { blob: false }));
      for (let i = 0; i < 8; i++) { const s = i % 2 ? 1 : -1, z = -14 + Math.floor(i / 2) * 5; out.push(card(T, 'cw' + i, T.townsfolk(i), fo(f, 30 + i, { expr: 'laugh', wave: q(Math.sin(f * 0.3 + i), 1), tilt: q(idle(f, i).tilt, 1) }), N3([s * 8.2, 0.25, z]))); } break; }
  }
  return out;
}

function fxAt(f, T, cam, P) {
  const S = shotAt(f), out = [], push = (x) => x && out.push(x), id = S.id;
  const pop = (key, draw, uy, s = 0.6, f0 = S.a, ux = 0) => { const t = q(M.back(ramp(f, f0, f0 + 10)), 2); if (f < f0) return; out.push(FX(key + t, (p) => { p.g.translate(300, 500); p.g.scale(t, t); p.g.translate(-300, -500); draw(p); }, inFront(cam, 2.4, ux, uy), s, { order: 7 })); };
  if (id === 'hook') { push(wordCard(f, F_1938, '1938', cam, '#f6c83a', F_CAL0 - F_1938 - 4, 220, 0.5)); push(wordCard(f, F_CAL0, 'CALIFORNIA', cam, '#ffffff', 1e9, 180, 0.5)); }
  if (id === 'land0') push(wordCard(f, F_IRE, 'IRELAND?!', cam, '#7ad06a', 1e9, 200, 0.5));
  if (id === 'dream') push(wordCard(f, F_ATL, 'THE ATLANTIC', cam, '#ffffff', 1e9, 170, 0.5));
  if (id === 'spirit') push(wordCard(f, F_LIND, "LINDBERGH'S PLANE", cam, '#f6c83a', 1e9, 150, 0.5));
  if (id === 'officials') push(wordCard(f, F_UNSAFE, 'DENIED', cam, '#ff5a4a', 1e9, 210, 0.5));
  if (id === 'cheap') push(wordCard(f, F_300, '$300', cam, '#7ad06a', 1e9, 220, 0.5));
  if (id === 'plan') push(wordCard(f, F_CAL1, 'TO CALIFORNIA', cam, '#ffffff', 1e9, 170, 0.5));
  if (id === 'takeoff') push(wordCard(f, F_DAWN, 'DAWN', cam, '#ffc890', 1e9, 190, 0.5));
  if (id === 'turn') push(wordCard(f, F_EAST, 'EAST?!', cam, '#ff5a4a', 1e9, 210, 0.5));
  if (id === 'radio') push(wordCard(f, F_RADIO, 'NO RADIO', cam, '#ffffff', 1e9, 190, 0.5));
  if (id === 'food') { pop('cb', chocBar, 0.05, 0.55, F_CHOC - 2, -0.35); pop('fb', figBox, 0.0, 0.55, F_FIG - 2, 0.35); push(wordCard(f, F_CHOC, 'DINNER', cam, '#f6c83a', 1e9, 190, 0.55)); }
  if (id === 'leak') { const t = q((f * 0.04) % 1, 2); if (f > F_GAS) out.push(FX('dr' + t, (p) => drops(p, t), inFront(cam, 2.6, 0, 0.1), 0.9, { order: 7 })); push(wordCard(f, F_WORSE, 'IT GOT WORSE', cam, '#ff5a4a', F_GAS - F_WORSE - 2, 170, 0.5)); push(wordCard(f, F_GAS, 'GAS LEAK!', cam, '#f6c83a', 1e9, 190, 0.5)); }
  if (id === 'hole') { const t = q((f * 0.05) % 1, 2); if (f >= F_SCREW - 4) out.push(FX('sd' + t, (p) => screwdriver(p, t), inFront(cam, 2.4, 0.2, -0.05), 0.65, { order: 7 })); push(wordCard(f, F_PUNCH, 'PUNCH!', cam, '#ffffff', 1e9, 200, 0.5)); }
  if (id === 'clouds') { const hrs = Math.min(28, Math.max(1, Math.round(ramp(f, F_28 - 2, E(10)) * 28))); push(wordCard(f, F_28 - 2, hrs + ' HOURS', cam, '#ffffff', 1e9, 190, 0.5)); }
  if (id === 'below') push(wordCard(f, F_26, '26 HOURS?!', cam, '#f6c83a', 1e9, 190, 0.5));
  if (id === 'dublin') push(wordCard(f, F_DUB, 'DUBLIN', cam, '#7ad06a', 1e9, 210, 0.5));
  if (id === 'quote') push(wordCard(f, F_WHERE, 'WHERE AM I?', cam, '#ffffff', F_INT - F_WHERE - 2, 190, 0.55)), push(wordCard(f, F_INT, '...CALIFORNIA?', cam, '#f6c83a', 1e9, 170, 0.55));
  if (id === 'compass') { const ang = f < F_WRONG ? 0.4 * Math.sin(f * 0.3) : Math.PI * M.back(ramp(f, F_WRONG, F_WRONG + 14)); out.push(FX('cp' + q(ang, 2), (p) => compass(p, ang), inFront(cam, 2.4, 0, -0.08), 1.0, { order: 7 }));
    push(wordCard(f, F_FOG, 'FOG', cam, '#ffffff', F_WRONG - F_FOG - 2, 200, 0.62)); push(wordCard(f, F_WRONG, 'WRONG END!', cam, '#ff5a4a', 1e9, 190, 0.62)); }
  if (id === 'nobody') push(wordCard(f, F_NOBODY, 'SURE, PAL.', cam, '#ffffff', 1e9, 180, 0.55));
  if (id === 'loved') push(wordCard(f, F_LOVED, 'AMERICA LOVED IT', cam, '#f6c83a', 1e9, 160, 0.5));
  if (id === 'parade') push(wordCard(f, F_BIGGER, '> LINDBERGH', cam, '#ffffff', 1e9, 190, 0.5));
  if (id === 'ship') { push(wordCard(f, F_14, '14 DAYS', cam, '#ff5a4a', F_BOAT - F_14 - 4, 200, 0.5)); push(wordCard(f, F_BOAT, '= BOAT RIDE', cam, '#f6c83a', 1e9, 190, 0.5)); }
  if (id === 'swore') push(wordCard(f, F_CAL2, 'CALIFORNIA', cam, '#ffffff', 1e9, 180, 0.55));
  return out;
}

// ---------------- cameras ----------------
const relCam = (P, keys, f) => { const c = camFromKeys(keys, f, { creep: 0.001, kicks: KICKS }); const o = P.pos; c.pos = V3(o, c.pos); c.look = V3(o, c.look); c.shadowAt = o; return c; };
const KICKS = [{ f: F_IRE, a: 0.03 }, { f: F_UNSAFE, a: 0.04 }, { f: F_EAST, a: 0.04 }, { f: F_GAS, a: 0.03 }, { f: F_PUNCH, a: 0.05 }, { f: F_DOWN, a: 0.03 }, { f: F_WRONG, a: 0.04 }, { f: F_14, a: 0.03 }];
const A_ = (o) => V3(AF, o), D_ = (o) => V3(DUB, o), N_ = (o) => V3(NYC, o), S_ = (o) => V3(SEA, o);
const CAMS = {
  hook: [{ f: 0, pos: [10, 2, 9], look: [-2, 1.2, 0], fov: 48 }, { f: F_IRE - 5, pos: [8, 1.6, 12], look: [-2, 1.4, 0], fov: 46 }],
  land0: [{ f: F_IRE - 5, pos: D_([18, 2.4, 22]), look: D_([-20, 4, 0]), fov: 48 }, { f: cut(1), pos: D_([14, 2.2, 18]), look: D_([-4, 1.8, 0]), fov: 46 }],
  dream: [{ f: cut(1), pos: A_([4.5, 1.8, 16]), look: A_([1.5, 1.8, 6]), fov: 46 }, { f: F_ATL, pos: A_([3.8, 1.7, 13.5]), look: A_([2.6, 1.7, 8]), fov: 42 }],
  spirit: [{ f: cut(2), pos: A_([3.5, 2.2, -8]), look: A_([-3.5, 1.9, -20]), fov: 50 }, { f: F_SPIRIT, pos: A_([2.5, 2.0, -10]), look: A_([-3.0, 1.9, -20]), fov: 48 }],
  officials: [{ f: cut(3), pos: A_([0.7, 1.75, 17]), look: A_([0.7, 1.6, 11]), fov: 42 }, { f: F_UNSAFE - 4, pos: A_([1.2, 1.75, 15]), look: A_([1.3, 1.65, 11]), fov: 38 }],
  cheap: [{ f: cut(4), pos: A_([8, 1.5, 14]), look: A_([1, 1.6, 6]), fov: 46 }, { f: cut(5), pos: A_([7, 1.4, 12.5]), look: A_([1.5, 1.6, 6]), fov: 44 }],
  plan: [{ f: cut(5), pos: A_([3.6, 1.8, 15]), look: A_([3.2, 1.6, 9.4]), fov: 42 }, { f: F_CAL1 - 4, pos: A_([3.4, 1.75, 13]), look: A_([3.2, 1.65, 9.4]), fov: 38 }],
  takeoff: [{ f: cut(6), pos: A_([-50, 2.0, 13]), look: A_([-60, 1.5, 0]), fov: 46 }, { f: F_TOOK + 4, pos: A_([-49, 2.1, 12.5]), look: A_([-59, 1.6, 0]), fov: 46 }, { f: F_TOOK + 24, pos: A_([-30, 3, 18]), look: A_([-36, 1.8, 0]), fov: 48 }, { f: F_EAST - 14, pos: A_([20, 5, 34]), look: A_([58, 16, 0]), fov: 48 }],
  turn: [{ f: F_EAST - 14, pos: A_([40, 14, 34]), look: A_([66, 22, -4]), fov: 48 }, { f: cut(7), pos: A_([40, 16, 24]), look: A_([62, 25, -36]), fov: 48 }],
  radio: [{ f: cut(7), pos: [3.6, 1.9, 7.5], look: [1.3, 1.6, 0], fov: 42 }, { f: F_CHOC - 5, pos: [3.0, 1.8, 6.4], look: [1.3, 1.6, 0], fov: 40 }],
  food: [{ f: F_CHOC - 5, pos: [2.2, 1.8, 6.2], look: [1.3, 1.6, 0], fov: 42 }, { f: cut(8), pos: [2.0, 1.75, 5.6], look: [1.3, 1.6, 0], fov: 40 }],
  leak: [{ f: cut(8), pos: [-0.5, 2.3, 7.5], look: [1.3, 1.5, 0], fov: 44 }, { f: cut(9), pos: [0.6, 2.0, 6.2], look: [1.3, 1.55, 0], fov: 40 }],
  hole: [{ f: cut(9), pos: [3.6, 1.5, 6.6], look: [1.3, 1.5, 0], fov: 42 }, { f: cut(10), pos: [3.0, 1.6, 5.8], look: [1.3, 1.55, 0], fov: 40 }],
  clouds: [{ f: cut(10), pos: [-20, 8, 30], look: [4, 0, 0], fov: 50 }, { f: F_CLOUDS, pos: [-10, 30, 50], look: [10, -10, 0], fov: 52 }, { f: cut(11), pos: [10, 6, 34], look: [0, 0, 0], fov: 50 }],
  below: [{ f: cut(11), pos: [3.2, 1.8, 7], look: [1.3, 1.5, 0], fov: 44 }, { f: F_DOWN, pos: [12, -6, 22], look: [0, 0, 0], fov: 50 }, { f: cut(12), pos: [14, -8, 26], look: [0, -2, 0], fov: 52 }],
  dublin: [{ f: cut(12), pos: D_([20, 2.4, 26]), look: D_([-10, 3, 0]), fov: 48 }, { f: F_DUB, pos: D_([14, 2.0, 18]), look: D_([2, 1.8, 0]), fov: 46 }],
  quote: [{ f: F_WHERE - 5, pos: D_([3.7, 1.75, 9.5]), look: D_([3.7, 1.55, 3]), fov: 44 }, { f: F_INT, pos: D_([3.5, 1.7, 8.0]), look: D_([3.3, 1.6, 3]), fov: 40 }, { f: cut(13), pos: D_([3.3, 1.7, 7.4]), look: D_([3.0, 1.6, 3]), fov: 38 }],
  compass: [{ f: cut(13), pos: D_([1.4, 2.2, 6]), look: D_([1.4, 1.8, 0]), fov: 44 }, { f: cut(14), pos: D_([1.4, 2.0, 5]), look: D_([1.4, 1.8, 0]), fov: 42 }],
  nobody: [{ f: cut(14), pos: D_([4.6, 1.75, 8]), look: D_([4.6, 1.6, 3]), fov: 40 }, { f: F_AMER - 5, pos: D_([4.6, 1.75, 7]), look: D_([4.6, 1.65, 3]), fov: 36 }],
  loved: [{ f: F_AMER - 5, pos: N_([0, 3, 14]), look: N_([0, 4, -20]), fov: 50 }, { f: cut(15), pos: N_([0, 3, 10]), look: N_([0, 3, -20]), fov: 48 }],
  parade: [{ f: cut(15), pos: N_([3, 2.6, 6]), look: N_([0, 2.4, -6]), fov: 46 }, { f: F_BIGGER, pos: N_([0, 22, 20]), look: N_([0, 0, -20]), fov: 52 }, { f: cut(16), pos: N_([0, 26, 22]), look: N_([0, 0, -24]), fov: 52 }],
  ship: [{ f: cut(16), pos: S_([380, 16, 330]), look: S_([310, 8, 200]), fov: 48 }, { f: F_EXACT, pos: S_([400, 18, 320]), look: S_([330, 8, 200]), fov: 48 }, { f: cut(17), pos: S_([410, 20, 310]), look: S_([340, 8, 200]), fov: 46 }],
  swore: [{ f: cut(17), pos: [3.2, 1.8, 6.8], look: [1.3, 1.6, 0], fov: 42 }, { f: E(17) + 6, pos: [2.6, 1.75, 5.8], look: [1.3, 1.6, 0], fov: 38 }],
  end: [{ f: E(17) + 6, pos: [12, 2.4, 6], look: [-2, 1.2, 0], fov: 50 }, { f: TOTAL - 1, pos: [10, 2, 9], look: [-2, 1.2, 0], fov: 48 }],
};
const PLANE_REL = ['hook', 'end', 'radio', 'food', 'leak', 'hole', 'clouds', 'below', 'swore'];
const camAt = (f, P) => { const S = shotAt(f);
  if (PLANE_REL.includes(S.id)) { const base = { pos: [P.pos[0], S.id === 'below' ? 180 : P.pos[1], P.pos[2]] }; const c = relCam(S.id === 'below' && f > F_DOWN - 1 ? P : P, CAMS[S.id], f); return c; }
  const c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS }); c.shadowAt = [c.look[0], 0, c.look[2]];
  if (S.id === 'takeoff' || S.id === 'turn') c.shadowAt = P.pos; if (S.id === 'ship') c.shadowAt = S_([300, 0, 200]); if (S.id === 'parade' || S.id === 'loved') c.shadowAt = N_([0, 0, -8]);
  return c; };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => { const S = shotAt(f);
  if (['officials', 'plan', 'quote', 'nobody'].includes(S.id)) return { focus: dist(Cm.pos, Cm.look), cinf: 9 };
  return { focus: 10, cinf: 0 }; };

export default {
  TOTAL, build,
  frame(f, k) {
    const P = poseWorld(f), S = shotAt(f), id = S.id, cam = camAt(f, P);
    let light = { ...DAY };
    if (['dream', 'spirit', 'officials', 'cheap', 'plan'].includes(id)) light = { ...DAY, az: 160, el: 30 };
    if (id === 'takeoff' || id === 'turn') light = { ...DAWN };
    if (['dublin', 'quote', 'nobody', 'land0', 'compass'].includes(id)) light = { ...IRL };
    if (id === 'clouds') { const c = Math.floor(ramp(f, F_28 - 2, E(10)) * 4) % 2; light = c ? { ...NIGHT } : { ...DAY }; }
    if (id === 'leak' || id === 'hole') light = { ...NIGHT, hemi: 1.2 };
    K.deck.visible = !(['ship'].includes(id));
    light.shadowExt = ['takeoff', 'turn', 'ship', 'clouds', 'below', 'parade', 'loved'].includes(id) ? 80 : 30;
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T, P), fx: fxAt(f, k.T, cam, P) };
  },
};
