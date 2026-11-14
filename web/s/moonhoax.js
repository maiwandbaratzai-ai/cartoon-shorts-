// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The Great Moon Hoax" — The Sun, New York, August 1835. Timed via moonhoax_timing.js.
import { TOTAL, LINES, wf } from './moonhoax_timing.js';
import * as PR from '../props.js';
import { INK } from '../toon.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const F_1835 = wf(0, '1835'), F_NY = wf(0, 'new'), F_PAPER = wf(0, 'newspaper'), F_BAT = wf(0, 'bat'), F_MOON = wf(0, 'moon'), F_SUN = wf(1, 'sun'), F_ASTRO = wf(1, 'astronomer'), F_GIANT = wf(1, 'giant'),
  F_TELE = wf(1, 'telescope'), F_BLUE = wf(2, 'blue'), F_UNI = wf(2, 'unicorns'), F_BEAV = wf(2, 'beavers'), F_TWO = wf(2, 'two'), F_STARS = wf(3, 'stars'), F_WING = wf(3, 'winged'), F_FACES = wf(3, 'faces'),
  F_ORANG = wf(3, 'orangutans'), F_BOUGHT = wf(4, 'bought'), F_SALES = wf(4, 'sales'), F_EXPL = wf(4, 'exploded'), F_HERS = wf(5, 'herschel'), F_IDEA = wf(5, 'idea'), F_END = wf(6, 'end'), F_STORY = wf(6, 'story'),
  F_LENS = wf(7, 'lens'), F_FOCUS = wf(7, 'focused'), F_SUNL = wf(7, 'sunlight'), F_BURN = wf(7, 'burned'), F_OBS = wf(7, 'observatory'), F_NEVER = wf(8, 'never'), F_BACK = wf(8, 'back'), F_BAT2 = wf(8, 'bat');
const SHOTS = [['hook', 0], ['paper', F_NY - 4], ['moon', F_BAT - 6], ['scope', cut(1)], ['eyepiece', F_ASTRO - 4], ['unicorn', cut(2)], ['beaver', F_BEAV - 4], ['bats', cut(3)], ['batface', F_FACES - 4],
  ['nyc', cut(4)], ['herschel', cut(5)], ['ending', cut(6)], ['lens', cut(7)], ['burn', F_BURN - 6], ['never', cut(8)], ['end', F_BAT2 + 6]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const MOONL = { az: 150, el: 35, sky: '#b8b8e8', ground: '#5a5a7a', hemi: 1.2, sun: '#fff8e8', sunI: 2.6, fog: '#1a1a3a', fogNear: 200, fogFar: 1500,
  skyTop: '#05051a', skyHor: '#1c1c48', sat: 1.12, vig: 0.3, shadowExt: 30 };
const NYC = { az: 130, el: 45, sky: '#e2ecf8', ground: '#9a8a7a', hemi: 1.15, sun: '#fff0d8', sunI: 2.4, fog: '#dce6f0', fogNear: 80, fogFar: 500, skyTop: '#3a86d8', skyHor: '#e4eef6', sat: 1.12, vig: 0.22, shadowExt: 25 };
const CAPE = { ...NYC, az: 60, el: 40, sky: '#f0e8d0', ground: '#a89a6a', sun: '#fff4d0', fog: '#e8e0c8', skyTop: '#2a7ad8', skyHor: '#f0e8d8', sat: 1.15 };
const NIGHT = { ...MOONL, az: 200, el: 40, sky: '#6a7ab8', ground: '#3a3a5a', sun: '#c8d0ff', sunI: 1.4, fog: '#1a2448', fogFar: 600, skyTop: '#0a1030', skyHor: '#2a3a6a', vig: 0.34 };
const NY = [500, 0, 0], OB = [-500, 0, 0];
let K, scope, lensGlow, beam, earth, moonDisc;
const rnd = (() => { let s = 1835; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
const CR = Array.from({ length: 40 }, (_, i) => [(rnd() - 0.5) * 300, (rnd() - 0.9) * 300, 3 + rnd() * 14]);
const mground = (x, z) => { if (Math.abs(x) > 250) return 0; let h = 1.5 * Math.sin(x * 0.05) * Math.cos(z * 0.04); for (const [cx, cz, r] of CR) { const d = Math.hypot(x - cx, z - cz) / r; if (d < 1.3) h += d < 1 ? -0.35 * r * (1 - d * d) : 0.25 * r * Math.sin((d - 1) / 0.3 * Math.PI) * 0.4; }
  const dl = Math.hypot(x - 8, z + 40); if (dl < 22) h = Math.min(h, -0.5); return h; };

function build(k) {
  K = k; const { THREE } = K;
  // ---------- moon set (origin) ----------
  PR.terrain(K, 520, 220, mground, K.toon({ map: PR.speckTex('#a8a4c0', ['#9894b0', '#b8b4d0', '#8a86a4'], 13, 2600, 60) }));
  K.add(new THREE.CircleGeometry(22, 32).rotateX(-Math.PI / 2), K.col('#4a8ac0'), 8, -0.3, -40, K.scene, { cast: false });
  const M4 = THREE.Matrix4, tr = [], cr = [];
  for (let i = 0; i < 40; i++) { const a = rnd() * 6.28, r = 23 + rnd() * 16, x = 8 + Math.cos(a) * r, z = -40 + Math.sin(a) * r; const s = 0.8 + rnd() * 0.6, m = new M4().makeTranslation(x, mground(x, z), z).multiply(new M4().makeScale(s, s, s));
    tr.push(m.clone().multiply(new M4().makeTranslation(0, 1.5, 0))); cr.push(m.clone().multiply(new M4().makeTranslation(0, 3.6, 0))); }
  K.add(PR.mergeCopies(new THREE.CylinderGeometry(0.2, 0.3, 3, 6), tr), K.col('#7a5a6a'), 0, 0, 0).frustumCulled = false;
  K.add(PR.mergeCopies(new THREE.IcosahedronGeometry(1.8, 1), cr), K.col('#5aa86a'), 0, 0, 0).frustumCulled = false;
  // a little gold temple on a ridge (from the hoax)
  const tmp = K.group(); tmp.position.set(-30, mground(-30, -70), -70); const gold = K.col('#e8c45a');
  K.slab(-5, 5, 0, 0.8, -4, 4, K.col('#c8b8d8'), tmp); for (let i = 0; i < 6; i++) K.cyl(0.35, 0.35, 5, gold, -4 + i * 1.6, 0.8, 3, tmp); K.add(new THREE.ConeGeometry(5.8, 3, 4), gold, 0, 7.3, 0, tmp).rotation.y = Math.PI / 4;
  // stars + earth
  const sp = new Float32Array(1500 * 3); for (let i = 0; i < 1500; i++) { const a = rnd() * 6.28, b = Math.acos(rnd() * 0.95), r = 1600; sp.set([Math.cos(a) * Math.sin(b) * r, Math.cos(b) * r, Math.sin(a) * Math.sin(b) * r], i * 3); }
  const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: '#ffffff', size: 3, sizeAttenuation: false, fog: false })); stars.userData.ndSkip = true; K.scene.add(stars); stars.frustumCulled = false; K.stars = stars;
  const etex = PR.canvasTex(512, 256, (c) => { c.fillStyle = '#2a6ac8'; c.fillRect(0, 0, 512, 256); c.fillStyle = '#4aa858'; for (let i = 0; i < 9; i++) { c.beginPath(); c.ellipse(40 + i * 57, 70 + (i % 3) * 50, 40, 26 + (i % 2) * 20, i, 0, 7); c.fill(); } c.fillStyle = 'rgba(255,255,255,.8)'; for (let i = 0; i < 12; i++) c.fillRect((i * 97) % 512, (i * 53) % 256, 70, 8); });
  earth = K.add(new THREE.SphereGeometry(70, 32, 20), new THREE.MeshBasicMaterial({ map: etex, fog: false }), -260, 300, -900); earth.userData.ndSkip = true; earth.castShadow = false;
  // ---------- New York street (x = 500) ----------
  const ny = K.group(); ny.position.set(...NY);
  const cob = PR.canvasTex(256, 256, (c) => { c.fillStyle = '#9a8a78'; c.fillRect(0, 0, 256, 256); for (let y = 0; y < 256; y += 16) for (let x = (y / 16 % 2) * 10; x < 256; x += 20) { c.fillStyle = ['#8a7a6a', '#a8988a', '#948472'][(x + y) % 3]; c.fillRect(x, y, 18, 14); } }, [30, 30]);
  K.slab(-60, 60, -0.1, 0, -80, 60, K.toon({ map: cob }), ny, false);
  for (let i = 0; i < 9; i++) { const z = 30 - i * 12, h = 12 + (i % 3) * 3; for (const s of [-1, 1]) { const b = K.slab(s * 7, s * 7 + s * 10, 0, h, z - 6, z + 6, K.toon({ map: PR.facadeTex(['#a8483a', '#8a4a3a', '#b8604a', '#9a5a4a'][(i + (s > 0)) % 4], 3, 4, i * 2 + (s > 0)) }), ny);
    K.slab(s * 7 - s * 0.2, s * 7 + s * 10.2, h, h + 0.6, z - 6.1, z + 6.1, K.col('#e8dcc4'), ny); } }
  for (let i = 0; i < 6; i++) { const z = 24 - i * 14; for (const s of [-1, 1]) { K.cyl(0.08, 0.1, 3.6, K.col('#2a2a30'), s * 5.6, 0, z, ny); K.slab(s * 5.6 - 0.25, s * 5.6 + 0.25, 3.6, 4.2, z - 0.25, z + 0.25, K.toon({ color: '#ffe8a0', emissive: '#806020' }), ny); } }
  // ---------- Cape observatory (x = -500) ----------
  const ob = K.group(); ob.position.set(...OB);
  K.slab(-120, 120, -0.1, 0, -120, 120, K.toon({ map: PR.speckTex('#b8aa72', ['#a89a62', '#c8ba82', '#9a9a5a'], 4, 2400, 40) }), ob, false);
  for (let i = 0; i < 6; i++) K.sphere(60, K.col(i % 2 ? '#8a9a6a' : '#7a8a68'), -300 + i * 120, -25, -260, ob, 1.6, 0.8, 1);
  K.add(new THREE.BoxGeometry(60, 30, 20), K.col('#7a8aa0'), 0, 10, -200, ob); // table mountain hint
  const bld = K.group(ob); bld.position.set(-7, 0, -4);
  K.slab(-4, 4, 0, 4, -3, 3, K.col('#f2ece0'), bld); const rf = K.add(new THREE.CylinderGeometry(0.1, 5, 2.2, 4, 1), K.col('#8a5a4a'), 0, 5.1, 0, bld); rf.rotation.y = Math.PI / 4; rf.scale.set(1.15, 1, 0.85);
  K.slab(-0.7, 0.7, 0, 2.3, 3, 3.06, K.col('#5a3a24'), bld); for (const x of [-2.6, 2.6]) K.slab(x - 0.6, x + 0.6, 1.6, 2.8, 3, 3.06, K.col('#9fd0e8'), bld);
  scope = K.group(ob); scope.position.set(3, 0, -2);
  const brass = K.col('#c8a050'), wood = K.col('#7a5434');
  K.slab(-1.2, 1.2, 0, 3.2, -1.2, 1.2, wood, scope); K.beam(K.V(-1, 0, 1), K.V(0, 4, 0), 0.25, wood, scope); K.beam(K.V(1, 0, 1), K.V(0, 4, 0), 0.25, wood, scope);
  const tube = K.group(scope); tube.position.set(0, 4, 0); tube.rotation.x = -0.75;
  K.add(new THREE.CylinderGeometry(1.25, 0.8, 16, 24), K.col('#3a4a6a'), 0, 5, 0, tube); for (const y of [-2.5, 3, 12.8]) K.add(new THREE.CylinderGeometry(1.35, 1.35, 0.4, 24), brass, 0, y, 0, tube);
  K.add(new THREE.CylinderGeometry(0.25, 0.3, 1.2, 12), brass, 0, -3.4, 0, tube);
  const lens = K.add(new THREE.CylinderGeometry(1.15, 1.15, 0.12, 24), K.toon({ color: '#c8ecff', emissive: '#4a7a9a' }), 0, 13.05, 0, tube);
  lensGlow = K.add(new THREE.SphereGeometry(1.8, 16, 12), new THREE.MeshBasicMaterial({ color: '#fff6c0', transparent: true, opacity: 0.0 }), 0, 13.2, 0, tube); lensGlow.userData.ndSkip = true; lensGlow.castShadow = false;
  beam = K.add(new THREE.CylinderGeometry(0.15, 1.1, 1, 12, 1, true), new THREE.MeshBasicMaterial({ color: '#fff2a0', transparent: true, opacity: 0.0, side: THREE.DoubleSide }), 0, 0, 0, ob); beam.userData.ndSkip = true; beam.castShadow = false;
}

// ---------------- 2D drawings ----------------
const manBat = (p, flap = 0) => {
  const up = Math.sin(flap * Math.PI * 2), cx = 300, cy = 520, mem = '#6a3a3a', fur = '#b8743a';
  const wing = (s) => { const pts = [[cx + s * 50, cy - 90], [cx + s * 150, cy - 170 - 90 * up], [cx + s * 270, cy - 150 - 140 * up], [cx + s * 250, cy - 60 - 90 * up], [cx + s * 200, cy - 20 - 50 * up], [cx + s * 150, cy + 10 - 30 * up], [cx + s * 60, cy + 40]];
    p.poly(pts, mem, 9); for (let k = 1; k < 4; k++) p.stroke([[cx + s * 55, cy - 80], pts[k + 1]], 5, '#4a2a2a'); };
  wing(-1); wing(1);
  for (const s of [-1, 1]) p.line([[cx + s * 30, cy + 120], [cx + s * 40, cy + 230], [cx + s * 50 + s * 10, cy + 300 + 20 * up]], fur, 22);
  p.ell(cx, cy + 30, 78, 120, fur, 11); for (let i = 0; i < 6; i++) p.stroke([[cx - 40 + i * 16, cy - 10 + (i % 2) * 20], [cx - 46 + i * 16, cy + 40 + (i % 2) * 20]], 5, '#8a5428');
  p.ell(cx, cy - 140, 70, 64, fur, 11); p.ell(cx, cy - 122, 50, 42, '#e8c8a0', 8); p.ell(cx, cy - 104, 28, 18, '#d8a888', 6);
  p.ell(cx - 22, cy - 150, 14, 16, '#ffffff', 5); p.ell(cx + 22, cy - 150, 14, 16, '#ffffff', 5); p.dot(cx - 20, cy - 147, 6); p.dot(cx + 24, cy - 147, 6);
  p.dot(cx - 8, cy - 108, 4); p.dot(cx + 8, cy - 108, 4); p.stroke([[cx - 18, cy - 90], [cx, cy - 84], [cx + 18, cy - 90]], 5, INK);
};
const unicorn = (p, phase = 0) => {
  const T = Math.PI * 2, bob = 10 * Math.abs(Math.sin(phase * T)), body = '#5a8ae0', dk = '#3a6ac0';
  for (const [x, s, c] of [[200, 1, dk], [380, -1, dk], [225, -1, body], [405, 1, body]]) { const a = s * 0.5 * Math.sin(phase * T); p.line([[x, 640 - bob], [x + 60 * Math.sin(a), 960]], c, 24); p.ell(x + 60 * Math.sin(a), 962, 20, 12, '#3a3040', 5); }
  p.ell(300, 600 - bob, 170, 90, body, 12);
  p.poly([[130, 560 - bob], [80, 640 - bob], [70, 700 - bob], [110, 620 - bob]], '#f4f0ff', 8);
  p.line([[430, 560 - bob], [480, 440 - bob]], body, 70); p.ell(510, 410 - bob, 70, 48, body, 12);
  p.poly([[500, 360 - bob], [540, 220 - bob], [530, 370 - bob]], '#f6d040', 7); p.poly([[470, 365 - bob], [455, 320 - bob], [490, 362 - bob]], dk, 6);
  p.ell(520, 400 - bob, 13, 15, '#ffffff', 5); p.dot(524, 402 - bob, 6); p.dot(565, 425 - bob, 4);
  for (let i = 0; i < 5; i++) p.stroke([[440 - i * 8, 380 + i * 30 - bob], [410 - i * 8, 410 + i * 30 - bob]], 12, '#f4f0ff');
};
const beaver = (p, phase = 0) => {
  const T = Math.PI * 2, bob = 8 * Math.abs(Math.sin(phase * T)), fur = '#8a5a34';
  p.poly([[230, 760 - bob], [120, 900], [180, 940], [270, 800 - bob]], '#4a3a3a', 9);
  for (const s of [-1, 1]) { const a = s * 0.4 * Math.sin(phase * T); p.line([[300 + s * 40, 780 - bob], [300 + s * 40 + 70 * Math.sin(a), 950]], fur, 30); p.ell(300 + s * 40 + 70 * Math.sin(a) + 14, 958, 32, 12, '#3a2a20', 5); }
  p.ell(300, 640 - bob, 110, 170, fur, 12); p.ell(300, 680 - bob, 70, 120, '#c89a6a', 0);
  p.ell(300, 430 - bob, 85, 75, fur, 12); p.ell(300, 470 - bob, 50, 34, '#c89a6a', 8); p.poly([[285, 490 - bob], [315, 490 - bob], [313, 520 - bob], [287, 520 - bob]], '#f8f4e8', 5);
  p.ell(268, 410 - bob, 13, 15, '#ffffff', 5); p.ell(332, 410 - bob, 13, 15, '#ffffff', 5); p.dot(270, 412 - bob, 6); p.dot(334, 412 - bob, 6); p.ell(300, 450 - bob, 14, 10, '#3a2a20', 0);
  for (const s of [-1, 1]) { p.ell(300 + s * 70, 370 - bob, 18, 16, fur, 7); p.line([[300 + s * 90, 600 - bob], [300 + s * 140, 520 - bob - 30 * Math.sin(phase * T + s)]], fur, 24); }
  p.line([[440, 440 - bob - 30 * Math.sin(phase * T + 1)], [450, 640]], '#b8822a', 14);
};
const paper = (p, t = 1) => { p.g.save(); p.g.translate(300, 500); p.g.rotate(-0.06); p.g.translate(-300, -500);
  p.poly([[60, 150], [540, 150], [540, 860], [60, 860]], '#f4eedc', 12); p.g.fillStyle = INK; p.g.textAlign = 'center';
  p.g.font = 'bold 74px DejaVu Serif, serif'; p.g.fillText('THE SUN', 300, 250); p.stroke([[90, 280], [510, 280]], 6); p.g.font = 'bold 38px DejaVu Serif, serif';
  p.g.fillText('GREAT', 300, 340); p.g.fillText('ASTRONOMICAL', 300, 385); p.g.fillText('DISCOVERIES', 300, 430); p.stroke([[90, 460], [510, 460]], 4);
  p.g.save(); p.g.translate(300, 620); p.g.scale(0.42, 0.42); p.g.translate(-300, -520); manBat(p, 0.2); p.g.restore();
  for (let i = 0; i < 6; i++) { p.stroke([[100, 760 + i * 14], [500 - (i % 2) * 60, 760 + i * 14]], 4, '#9a9488'); } p.g.restore(); };
const flames = (p, t, seed = 1) => { for (let i = 0; i < 7; i++) { const x = 140 + i * 55, h = 220 + 160 * Math.abs(Math.sin(t * 9 + i * 1.7 + seed)), w = 60;
  p.poly([[x - w / 2, 960], [x - w / 3, 960 - h * 0.5], [x + Math.sin(t * 7 + i) * 20, 960 - h], [x + w / 3, 960 - h * 0.5], [x + w / 2, 960]], i % 2 ? '#f08a2a' : '#f6c83a', 8); }
  for (let i = 0; i < 4; i++) p.poly([[200 + i * 70, 960], [215 + i * 70, 860 - 40 * Math.sin(t * 8 + i)], [230 + i * 70, 960]], '#fff3b0', 5); };

// ---------------- characters ----------------
const HERS = { jacket: '#2a2a3a', pants: '#3a3a48', boots: INK, hat: 'tophat', skin: '#f5c9a0', buttons: '#e8c45a', build: 'stout' };
const NEWSBOY = { jacket: '#b5653f', pants: '#3b5b9a', boots: '#3a2a20', hat: 'cap', cap: '#4a5a3a', build: 'kid', skin: '#ffe2c2' };
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
const bat = (f, i, pos, s = 2, flip = false) => { const fl = q(((f * 0.05 + i * 0.29) % 1), 1); return FX('mb' + fl, (p) => manBat(p, fl), pos, s, { flip, order: 4 }); };
const batFlock = (f, n = 6, base = [0, 10, 0], spd = 0.12) => Array.from({ length: n }, (_, i) => { const a = i * 2.1, t = f * spd * (0.8 + 0.1 * (i % 3));
  return bat(f, i, [base[0] + Math.sin(a) * 14 + Math.sin(t * 0.2 + a) * 4, base[1] + (i % 3) * 3 + Math.sin(t * 0.5 + i) * 1.2, base[2] + 6 - (i * 7) % 26], 2.8 + (i % 2) * 0.8, i % 2); });

function actorsAt(f, T) {
  const S = shotAt(f), out = [], N = (x, y, z) => [NY[0] + x, NY[1] + y, NY[2] + z], O = (x, y, z) => [OB[0] + x, OB[1] + y, OB[2] + z];
  switch (S.id) {
    case 'eyepiece': out.push(card(T, 'h1', HERS, fo(f, 7, { expr: f > F_GIANT ? 'shock' : 'squint', look: -0.5, tilt: -6 }), O(2.2, 0, 1.2))); break;
    case 'nyc': case 'never': { const nb = card(T, 'nb', NEWSBOY, fo(f, 3, { expr: S.id === 'never' ? 'grin' : 'laugh', wave: q(Math.sin(f * 0.4), 1) }), N(0.8, 0, 6));
      out.push(nb); if (S.id === 'nyc') for (let i = 0; i < 6; i++) { const x = -3 + (i % 3) * 2.2 + (i > 2 ? 1 : 0), z = 4.6 - (i > 2 ? 2.4 : 0); out.push(card(T, 'c' + i, T.townsfolk(i), fo(f, 20 + i, { expr: f > F_SALES && i % 2 ? 'grin' : 'shock', look: q(0.5 * Math.sin(i), 1), tilt: q(idle(f, i).tilt, 1) }), N(x, 0, z))); } break; }
    case 'herschel': out.push(card(T, 'h2', HERS, fo(f, 7, { expr: f > F_IDEA - 4 ? 'dazed' : 'whistle', look: 0.2, tilt: q(idle(f, 7).tilt, 1), headTilt: f > F_IDEA ? q(8 * Math.sin((f - F_IDEA) * 0.25), 0) : 0 }), O(4.5, 0, 6))); break;
  }
  return out;
}

function fxAt(f, T, cam) {
  const S = shotAt(f), out = [], push = (x) => x && out.push(x), O = (x, y, z) => [OB[0] + x, OB[1] + y, OB[2] + z], N = (x, y, z) => [NY[0] + x, NY[1] + y, NY[2] + z];
  if (S.id === 'hook' || S.id === 'end' || S.id === 'moon') out.push(...batFlock(f, 6, [0, 8, 0]));
  if (S.id === 'hook') push(wordCard(f, F_1835, '1835', cam, '#f6c83a', 1e9, 220, 0.5));
  if (S.id === 'paper') { const t = q(M.back(ramp(f, F_NY - 4, F_NY + 8)), 2); out.push(FX('pp' + t, (p) => { p.g.translate(300, 500); p.g.scale(t, t); p.g.rotate((1 - t) * 2); p.g.translate(-300, -500); paper(p); }, inFront(cam, 2.4, 0, 0), 1.0, { order: 7 })); }
  if (S.id === 'moon') push(wordCard(f, F_BAT, 'BAT-PEOPLE?!', cam, '#ffffff', 1e9, 170, 0.5));
  if (S.id === 'scope') push(wordCard(f, F_SUN, 'THE SUN SAID...', cam, '#f6c83a', F_TELE - F_SUN - 2, 160, 0.55));
  if (S.id === 'eyepiece') push(wordCard(f, F_TELE, 'GIANT TELESCOPE', cam, '#ffffff', 1e9, 160, 0.55));
  if (S.id === 'unicorn') { for (let i = 0; i < 3; i++) { const ph = q((f * 0.05 + i * 0.3) % 1, 1), x = -40 + (f - S.a) * 0.06 + i * 4.5, z = -18 - i * 3; out.push(FX('u' + ph, (p) => unicorn(p, ph), [x, mground(x, z) + 1.07 * 1.6, z], 1.6, { blob: true, ground: mground(x, z), order: 3 })); }
    push(wordCard(f, F_BLUE, 'BLUE UNICORNS', cam, '#6aa8ff', 1e9, 170, 0.5)); }
  if (S.id === 'beaver') { for (let i = 0; i < 2; i++) { const ph = q((f * 0.06 + i * 0.5) % 1, 1), x = -21 + i * 2.2 + (f - S.a) * 0.02, z = -8 - i * 1.5; out.push(FX('b' + ph, (p) => beaver(p, ph), [x, mground(x, z) + 1.07 * 1.0, z], 1.0, { blob: true, ground: mground(x, z), order: 3 })); }
    push(wordCard(f, F_TWO, 'ON 2 LEGS', cam, '#f6c83a', 1e9, 180, 0.55)); }
  if (S.id === 'bats') { out.push(...batFlock(f, 5, [0, 9, -6], 0.2)); push(wordCard(f, F_WING, 'WINGED MEN', cam, '#ffffff', 1e9, 170, 0.55)); }
  if (S.id === 'batface') { out.push(bat(f, 0, inFront(cam, 4, 0, -0.15), 2.0)); push(wordCard(f, F_ORANG, 'ORANGUTAN FACES', cam, '#f6a83a', 1e9, 160, 0.6)); }
  if (S.id === 'nyc') { for (let i = 0; i < 5; i++) { const t = ((f - S.a) * 0.02 + i * 0.2) % 1; out.push(FX('fp' + i + q(t, 1), (p) => { p.g.translate(300, 500); p.g.scale(0.5, 0.5); p.g.rotate(t * 6 + i); p.g.translate(-300, -500); paper(p); }, N(-3 + i * 1.6, 4 - t * 3, 4 + (i % 2)), 0.7, { order: 6 })); }
    push(wordCard(f, F_BOUGHT, 'SOLD!', cam, '#ffffff', F_SALES - F_BOUGHT - 2, 200, 0.55)); push(wordCard(f, F_SALES, 'SALES EXPLODE', cam, '#f6c83a', 1e9, 170, 0.55)); }
  if (S.id === 'herschel') { push(wordCard(f, F_HERS, 'SIR JOHN HERSCHEL', cam, '#ffffff', F_IDEA - F_HERS - 4, 150, 0.55)); push(wordCard(f, F_IDEA, '???', cam, '#f6c83a', 1e9, 220, 0.55)); }
  if (S.id === 'ending') { const t = q(M.back(ramp(f, cut(6), cut(6) + 10)), 2); out.push(FX('pe' + t, (p) => { p.g.translate(300, 500); p.g.scale(t, t); p.g.translate(-300, -500); paper(p); }, inFront(cam, 2.6, 0, -0.05), 1.0, { order: 7 })); push(wordCard(f, F_STORY, 'THE END?', cam, '#ffffff', 1e9, 190, 0.6)); }
  if (S.id === 'lens') push(wordCard(f, F_FOCUS, 'FOCUSED...', cam, '#fff3b0', 1e9, 180, 0.55));
  if (S.id === 'burn') { for (let i = 0; i < 4; i++) { const t = q((f * 0.03) % 1, 2); out.push(FX('fl' + i + t, (p) => flames(p, t + i * 0.25, i), O(-10.5 + i * 2.2, 5.6 + (i % 2) * 0.5, -0.6), 2.0, { order: 4 })); }
    for (let i = 0; i < 3; i++) { const t = ((f - S.a) * 0.02 + i * 0.33) % 1; out.push(FX('sm' + i + q(t, 1), (p) => { p.g.translate(150, 300); p.g.scale(1.6, 1.6); T.fxPuff(p, t * 0.8); }, O(-8 + i, 6 + t * 10, -4), 3 + t * 3, { order: 3 })); }
    push(wordCard(f, F_BURN, 'BURNED DOWN!', cam, '#ff6a3a', 1e9, 180, 0.55)); }
  if (S.id === 'never') { out.push(FX('pn', (p) => paper(p), N(1.6, 1.2, 6.3), 0.45, { order: 7 })); push(wordCard(f, F_NEVER, 'NEVER RETRACTED', cam, '#ffffff', 1e9, 160, 0.55)); }
  return out;
}

// ---------------- cameras ----------------
const O3 = (x, y, z) => [OB[0] + x, OB[1] + y, OB[2] + z], N3 = (x, y, z) => [NY[0] + x, NY[1] + y, NY[2] + z];
const CAMS = {
  hook: [{ f: 0, pos: [0, 5, 20], look: [0, 9, -10], fov: 50 }, { f: F_NY - 4, pos: [0, 5.5, 17], look: [0, 9.5, -10], fov: 48 }],
  paper: [{ f: F_NY - 4, pos: N3(0, 2, 16), look: N3(0, 2.2, 0), fov: 46 }, { f: F_BAT - 6, pos: N3(0, 2, 14.5), look: N3(0, 2.2, 0), fov: 44 }],
  moon: [{ f: F_BAT - 6, pos: [-6, 3, 20], look: [2, 10, -10], fov: 52 }, { f: cut(1), pos: [-4, 2.4, 14], look: [-6, 8, -60], fov: 52 }],
  scope: [{ f: cut(1), pos: O3(16, 3, 14), look: O3(1, 6, -4), fov: 48 }, { f: F_ASTRO - 4, pos: O3(12, 2.6, 11), look: O3(2, 7, -4), fov: 46 }],
  eyepiece: [{ f: F_ASTRO - 4, pos: O3(4.4, 2.0, 7.2), look: O3(2.6, 1.8, 0), fov: 46 }, { f: F_TELE - 4, pos: O3(4.2, 1.9, 6.0), look: O3(2.4, 1.9, 0.5), fov: 42 }, { f: cut(2), pos: O3(9, 2, 12), look: O3(2, 8, -6), fov: 50 }],
  unicorn: [{ f: cut(2), pos: [-32, 2.2, -8], look: [-34, 1.8, -21], fov: 46 }, { f: F_BEAV - 4, pos: [-30, 2.0, -10], look: [-31, 1.8, -21], fov: 42 }],
  beaver: [{ f: F_BEAV - 4, pos: [-19, 1.5, 1.5], look: [-19.5, 1.3, -9], fov: 44 }, { f: cut(3), pos: [-18.8, 1.4, 0], look: [-19.2, 1.3, -9], fov: 40 }],
  bats: [{ f: cut(3), pos: [2, 2, 18], look: [0, 11, -10], fov: 52 }, { f: F_FACES - 4, pos: [1, 4, 12], look: [0, 11, -10], fov: 50 }],
  batface: [{ f: F_FACES - 4, pos: [0, 12, 10], look: [0, 12, 0], fov: 46 }, { f: cut(4), pos: [0, 12.4, 9], look: [0, 12.2, 0], fov: 42 }],
  nyc: [{ f: cut(4), pos: N3(0, 2.2, 16), look: N3(0, 1.8, 2), fov: 48 }, { f: F_SALES - 4, pos: N3(-2, 3.5, 13), look: N3(0, 1.8, 2), fov: 50 }, { f: cut(5), pos: N3(-2.5, 3.8, 12.5), look: N3(0, 1.8, 2), fov: 50 }],
  herschel: [{ f: cut(5), pos: O3(4.5, 1.9, 13), look: O3(4.5, 1.6, 6), fov: 42 }, { f: F_IDEA - 4, pos: O3(4.5, 1.8, 10), look: O3(4.5, 1.7, 6), fov: 40 }],
  ending: [{ f: cut(6), pos: O3(14, 2.5, 18), look: O3(0, 4, -4), fov: 48 }, { f: cut(7), pos: O3(12, 2.4, 16), look: O3(0, 4, -4), fov: 46 }],
  lens: [{ f: cut(7), pos: O3(8, 14, 10), look: O3(3, 12, -6), fov: 48 }, { f: F_SUNL, pos: O3(10, 10, 14), look: O3(-3, 6, -5), fov: 50 }, { f: F_BURN - 6, pos: O3(12, 8, 16), look: O3(-5, 4, -4), fov: 50 }],
  burn: [{ f: F_BURN - 6, pos: O3(6, 3, 16), look: O3(-6, 4, -4), fov: 50 }, { f: cut(8), pos: O3(4, 3.2, 14), look: O3(-7, 4.5, -4), fov: 48 }],
  never: [{ f: cut(8), pos: N3(1.2, 1.5, 10), look: N3(1.0, 1.4, 6), fov: 42 }, { f: F_BAT2 + 6, pos: N3(1.2, 1.5, 9), look: N3(1.0, 1.4, 6), fov: 40 }],
  end: [{ f: F_BAT2 + 6, pos: [0, 3.6, 25], look: [0, 8.6, -10], fov: 54 }, { f: TOTAL - 1, pos: [0, 5, 20], look: [0, 9, -10], fov: 50 }],
};
const KICKS = [{ f: F_BAT, a: 0.03 }, { f: F_TELE, a: 0.03 }, { f: F_ORANG, a: 0.03 }, { f: F_EXPL, a: 0.04 }, { f: F_BURN, a: 0.05 }];
const MOONSHOTS = ['hook', 'moon', 'unicorn', 'beaver', 'bats', 'batface', 'end'], NYSHOTS = ['paper', 'nyc', 'never'];
const camAt = (f) => { const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS }); c.shadowAt = MOONSHOTS.includes(S.id) ? [c.look[0], 0, Math.max(-30, c.look[2])] : NYSHOTS.includes(S.id) ? N3(0, 0, 4) : O3(0, 0, 0); return c; };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => { const S = shotAt(f);
  if (S.id === 'herschel') return { focus: dist(Cm.pos, O3(4.5, 1.6, 6)), cinf: 10 };
  if (S.id === 'never') return { focus: dist(Cm.pos, N3(1, 1.4, 6)), cinf: 10 };
  return { focus: 10, cinf: 0 }; };

export default {
  TOTAL, build,
  frame(f, k) {
    const S = shotAt(f), cam = camAt(f), id = S.id;
    let light = MOONSHOTS.includes(id) ? { ...MOONL } : NYSHOTS.includes(id) ? { ...NYC } : ['scope', 'eyepiece'].includes(id) ? { ...NIGHT } : { ...CAPE };
    K.stars.visible = MOONSHOTS.includes(id) || ['scope', 'eyepiece'].includes(id); earth.visible = MOONSHOTS.includes(id);
    const burnK = id === 'lens' ? ramp(f, F_FOCUS - 4, F_SUNL + 6) : id === 'burn' ? 1 : 0;
    lensGlow.material.opacity = 0.8 * burnK * (0.85 + 0.15 * Math.sin(f * 0.7));
    beam.material.opacity = 0.55 * burnK; beam.visible = burnK > 0.01;
    if (beam.visible) { const a = new K.THREE.Vector3(3, 4, -2).add(new K.THREE.Vector3(0, 13, 0).applyEuler(new K.THREE.Euler(-0.75, 0, 0))), b = new K.THREE.Vector3(-7, 5.5, -4), d = b.clone().sub(a);
      beam.position.copy(a).add(b).multiplyScalar(0.5); beam.scale.set(1, d.length(), 1); beam.quaternion.setFromUnitVectors(new K.THREE.Vector3(0, -1, 0), d.normalize()); }
    if (id === 'burn' || (id === 'lens' && f > F_BURN - 10)) { light.sky = '#ffd8b0'; light.fog = '#e8c0a0'; }
    if (MOONSHOTS.includes(id)) light.shadowExt = 60;
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
  },
};
