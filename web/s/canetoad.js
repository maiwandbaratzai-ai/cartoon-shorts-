// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Cane Toads" — Gordonvale, Queensland, 1935. Timed via canetoad_timing.js.
import { TOTAL, LINES, wf } from './canetoad_timing.js';
import * as PR from '../props.js';
import { INK } from '../toon.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const F_1935 = wf(0, '1935'), F_102 = wf(0, '102'), F_BEET0 = wf(0, 'beetles'), F_62 = wf(1, '62'), F_HOP = wf(1, 'hopping'), F_PLAN = wf(2, 'plan'), F_CB = wf(2, 'cane'),
  F_WRECK = wf(2, 'wrecking'), F_HIGH = wf(3, 'high'), F_STALK = wf(3, 'stalks'), F_CLIMB = wf(4, 'climb'), F_EVERY = wf(5, 'everything'), F_WORSE = wf(6, 'worse'),
  F_POIS = wf(6, 'poisonous'), F_SNAKE = wf(6, 'snakes'), F_DIED = wf(6, 'died'), F_200 = wf(7, '200'), F_ONE = wf(7, 'one'), F_2023 = wf(7, '2023'), F_27 = wf(7, '27'),
  F_ZILLA = wf(8, 'toadzilla'), F_BEET = wf(9, 'beetles'), F_STILL = wf(9, 'still');
const SHOTS = [['hook', 0], ['babies', cut(1)], ['plan', cut(2)], ['high', cut(3)], ['climb', cut(4)], ['ate', cut(5)], ['poison', cut(6)], ['sea', cut(7)], ['zilla', F_ONE - 4],
  ['name', cut(8)], ['end', cut(9)]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const DAY = { az: 120, el: 50, sky: '#e4f0fa', ground: '#7a8a4a', hemi: 1.15, sun: '#fff4dc', sunI: 2.5, fog: '#d4e8f0', fogNear: 120, fogFar: 900,
  skyTop: '#2a80d8', skyHor: '#e0f0f4', sat: 1.16, vig: 0.2, shadowExt: 24 };
const GOLD = { ...DAY, az: 20, el: 14, sun: '#ffcf90', sunI: 2.4, sky: '#ffe0c0', hemi: 1.15, skyTop: '#5a70c8', skyHor: '#f8c8a0', fog: '#f0c8a8', sat: 1.18, vig: 0.28 };
let K, toadU, toadPts;
const rnd = (() => { let s = 1935; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
const gnd = (x, z) => { const r = Math.hypot(x, z); return r < 60 ? 0 : (r - 60) * 0.03 * (1 + Math.sin(x * 0.02)) ; };
const inTrack = (x, z) => Math.abs(x) < 3.2 && z < 14;

// ---------------- 2D drawings ----------------
const TOADC = '#9a7a4a', TOADB = '#c8a870', WART = '#7a5a34';
/** chunky cane toad, front view. hop 0..1 squash, tongue 0..1, dazed */
const toad = (p, hop = 0, tongue = 0, mood = 'smug') => {
  const sq = 1 - 0.12 * hop, st = 1 + 0.15 * hop, cx = 300, by = 975 - hop * 120;
  // back legs
  for (const s of [-1, 1]) p.ell(cx + s * 170, by - 60, 90, 60 * sq, TOADC, 10);
  p.ell(cx, by - 200 * st, 230, 190 * sq * st, TOADC, 12);
  p.ell(cx, by - 130, 150, 90 * sq, TOADB, 0);
  for (let i = 0; i < 14; i++) { const a = i * 2.39, r = 60 + (i * 37) % 140; p.ell(cx + Math.cos(a) * r, by - 250 * st + Math.sin(a) * r * 0.5, 14, 11, WART, 0); }
  // front legs
  for (const s of [-1, 1]) { p.stroke([[cx + s * 110, by - 120], [cx + s * 130, by - 10]], 26, INK); p.stroke([[cx + s * 110, by - 120], [cx + s * 130, by - 10]], 16, TOADC);
    p.ell(cx + s * 140, by - 6, 34, 12, TOADC, 7); }
  // eyes on top
  for (const s of [-1, 1]) { p.ell(cx + s * 95, by - 360 * st, 58, 54, TOADC, 10); p.ell(cx + s * 95, by - 368 * st, 40, 38, mood === 'dazed' ? '#ffffff' : '#e8c040', 7);
    if (mood === 'dazed') { p.stroke([[cx + s * 95 - 18, by - 386 * st], [cx + s * 95 + 18, by - 350 * st]], 7, INK); p.stroke([[cx + s * 95 + 18, by - 386 * st], [cx + s * 95 - 18, by - 350 * st]], 7, INK); }
    else { p.ell(cx + s * 95, by - 366 * st, 30, 10, INK, 0); if (mood === 'smug') p.ell(cx + s * 95, by - 384 * st, 44, 16, TOADC, 0); } }
  // poison glands (cane toad's signature) + mouth
  for (const s of [-1, 1]) p.ell(cx + s * 165, by - 300 * st, 40, 24, '#b89a5a', 6);
  p.stroke([[cx - 150, by - 250 * st], [cx, by - 228 * st], [cx + 150, by - 250 * st]], 9, INK);
  if (tongue > 0) { const L = 380 * tongue; p.stroke([[cx, by - 236 * st], [cx + L * 0.3, by - 236 * st - L * 0.8]], 30, INK); p.stroke([[cx, by - 236 * st], [cx + L * 0.3, by - 236 * st - L * 0.8]], 20, '#e86a7a'); }
};
const beetle = (p, munch = 0, smug = false) => {
  const cx = 300, cy = 520;
  for (let i = 0; i < 3; i++) for (const s of [-1, 1]) p.stroke([[cx + s * 60, cy - 40 + i * 50], [cx + s * 140, cy - 70 + i * 60], [cx + s * 170, cy - 20 + i * 70]], 10, INK);
  p.ell(cx, cy, 110, 150, '#8a8a7a', 12); p.stroke([[cx, cy - 120], [cx, cy + 145]], 6, INK); p.ell(cx - 40, cy - 40, 20, 40, '#b0b0a0', 0);
  p.ell(cx, cy - 170, 70, 52, '#5a5a4a', 10);
  for (const s of [-1, 1]) { p.stroke([[cx + s * 30, cy - 210], [cx + s * 80, cy - 280], [cx + s * 120, cy - 270]], 8, INK); p.ell(cx + s * 26, cy - 178, 14, smug ? 6 : 14, '#ffffff', 4); p.dot(cx + s * 26, cy - 176, 5); }
  p.ell(cx, cy - 140 + munch * 6, 22, 8 + 10 * munch, '#3a2a2a', 0);
};
const snake = (p, dead = 0) => {
  const g = p.g; g.save(); if (dead) { g.translate(0, 880 * (1 + dead)); g.scale(1, 1 - 2 * dead); g.translate(0, -880); }
  const pts = []; for (let i = 0; i <= 30; i++) { const t = i / 30; pts.push([80 + t * 420, 900 - 60 * Math.sin(t * 9 + (dead ? 0 : 1)) * (1 - t * 0.3)]); }
  p.stroke(pts, 64, INK); p.stroke(pts, 50, '#5a9a4a'); p.stroke(pts.map(([x, y]) => [x, y + 10]), 14, '#a8d070');
  p.ell(520, 880, 56, 40, '#5a9a4a', 10);
  if (dead) { for (const dx of [-12, 18]) { p.stroke([[520 + dx - 9, 860], [520 + dx + 9, 878]], 6, INK); p.stroke([[520 + dx + 9, 860], [520 + dx - 9, 878]], 6, INK); } }
  else { p.ell(530, 866, 12, 12, '#ffffff', 4); p.dot(533, 866, 5); p.stroke([[574, 890], [606, 884], [618, 872]], 5, '#d03a3a'); }
  g.restore();
};

function build(k) {
  K = k; const { THREE } = K, M4 = THREE.Matrix4;
  K.addClouds(8, 800, 200);
  PR.terrain(K, 700, 140, gnd, K.toon({ map: PR.speckTex('#8a6a48', ['#7a5a3a', '#9a7a58', '#6a5a3a'], 12, 2400, 90) }));
  // dirt track
  K.slab(-3.2, 3.2, 0, 0.02, -120, 14, K.toon({ map: PR.speckTex('#c89a6a', ['#b88a5a', '#d8aa7a', '#a87a50'], 8, 1500, 6) }), K.scene, false);
  // sugarcane: merged stalks + leaf tufts
  const st = [], lf = [];
  for (let i = 0; i < 2600; i++) { const x = (rnd() - 0.5) * 120, z = -110 + rnd() * 128; if (Math.abs(x) < 3.6 && z < 16) continue; if (Math.hypot(x, z - 8) < 5) continue;
    const h = 3.2 + rnd() * 1.2, lean = (rnd() - 0.5) * 0.12;
    st.push(new M4().makeTranslation(x, 0, z).multiply(new M4().makeRotationZ(lean)).multiply(new M4().makeScale(1, h / 4, 1)).multiply(new M4().makeTranslation(0, 2, 0)));
    for (let j = 0; j < 2; j++) lf.push(new M4().makeTranslation(x + lean * -h, h - 0.2 - j * 0.6, z).multiply(new M4().makeRotationY(rnd() * 6)).multiply(new M4().makeRotationZ(0.7 + rnd() * 0.3)).multiply(new M4().makeScale(1, 1, 1))); }
  K.add(PR.mergeCopies(new THREE.CylinderGeometry(0.06, 0.08, 4, 6), st), K.col('#9ab04a'), 0, 0, 0).frustumCulled = false;
  K.add(PR.mergeCopies(new THREE.ConeGeometry(0.08, 1.8, 4), lf), K.col('#5aa03a'), 0, 0, 0).frustumCulled = false;
  // hero stalk (for the climb shot) with segment rings
  const hero = K.group(); hero.position.set(3.9, 0, 4);
  K.cyl(0.09, 0.1, 4.2, K.col('#b0b858'), 0, 0, 0, hero); for (let i = 1; i < 8; i++) K.cyl(0.11, 0.11, 0.05, K.col('#7a8a3a'), 0, i * 0.5, 0, hero);
  for (let j = 0; j < 5; j++) { const l = K.add(new THREE.ConeGeometry(0.1, 2, 4), K.col('#6ab040'), 0, 3.6 + j * 0.15, 0, hero); l.rotation.set(0, j * 1.3, 0.9); l.position.x = Math.cos(j * 1.3) * 0.5; l.position.z = -Math.sin(j * 1.3) * 0.5; }
  // far hills + sugar mill chimney
  for (let i = 0; i < 8; i++) K.sphere(110, K.col(i % 2 ? '#4a8a5a' : '#5a9a64'), -450 + i * 130, -60, -450 - (i % 3) * 40, K.scene, 1.4, 0.9, 1);
  K.cyl(1.6, 2.2, 26, K.col('#b85a3a'), -26, 0, -95); K.slab(-36, -16, 0, 9, -105, -88, K.col('#d8d0c0')); K.slab(-36, -16, 9, 10, -105, -88, K.col('#7a6a6a'));
  // timber farmhouse at the track end
  const fh = K.group(); fh.position.set(0, 0, -48);
  K.slab(-5, 5, 1.2, 5, -4, 4, K.col('#e8e0c8'), fh); for (const [x, z] of [[-4.6, -3.6], [4.6, -3.6], [-4.6, 3.6], [4.6, 3.6]]) K.slab(x - 0.15, x + 0.15, 0, 1.2, z - 0.15, z + 0.15, K.col('#7a5a3a'), fh);
  const rf = K.add(new THREE.CylinderGeometry(0.1, 6.2, 2.6, 4, 1), K.col('#b0b8c0'), 0, 6.3, 0, fh); rf.rotation.y = Math.PI / 4; rf.scale.set(1.2, 1, 0.95);
  K.slab(-5.5, 5.5, 3.0, 3.15, 4, 6, K.col('#b0b8c0'), fh);
  // toads: point sprites with a 2-frame (sit / hop) atlas, scattered on the ground
  const atlas = document.createElement('canvas'); atlas.width = 512; atlas.height = 256; const ag = atlas.getContext('2d');
  for (let i = 0; i < 2; i++) { ag.setTransform(256 / 600 * 1.0, 0, 0, 256 / 600 * 0.6, i * 256, -330 * 256 / 600 * 0.6 + 70); toad(new K.T.Pen(ag), i * 0.8, 0, 'neutral'); }
  const N = 5000, pos = new Float32Array(N * 3), sh = new Float32Array(N);
  for (let j = 0; j < N; j++) { let x, z; do { x = (rnd() - 0.5) * 70; z = -70 + rnd() * 84; } while (rnd() > (Math.abs(x) < 3.4 ? 1 : 0.35)); pos.set([x, 0, z], j * 3); sh[j] = rnd(); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('sh', new THREE.BufferAttribute(sh, 1));
  toadU = { t: { value: 0 }, amt: { value: 1 }, map: { value: K.P.tex(atlas) }, sz: { value: 0.45 } };
  toadPts = new THREE.Points(g, new THREE.ShaderMaterial({ uniforms: toadU, transparent: true,
    vertexShader: `uniform float t, amt, sz; attribute float sh; varying float vF;
      void main(){ float ph = fract(t*0.6 + sh*7.); float hop = ph < .3 ? sin(ph/.3*3.1416) : 0.; vec3 p = position; p.y += hop*0.35 + sz*0.45; p.z += floor(t*0.6 + sh*7.)*0.25 + smoothstep(0.,.3,ph)*0.25 - 4.;
        vF = hop > .2 ? 1. : 0.; vec4 mv = modelViewMatrix*vec4(p,1.); gl_Position = projectionMatrix*mv; gl_PointSize = step(sh, amt) * min(160., sz * 1920. / -mv.z * 1.2); }`,
    fragmentShader: `uniform sampler2D map; varying float vF; void main(){ vec2 uv = vec2((gl_PointCoord.x + vF)/2., 1. - gl_PointCoord.y); vec4 c = texture2D(map, uv); if (c.a < .5) discard; gl_FragColor = vec4(c.rgb, 1.); }` }));
  toadPts.frustumCulled = false; toadPts.userData.ndSkip = true; K.scene.add(toadPts);
}

// ---------------- characters ----------------
const FARMER = { jacket: '#e8e0c8', pants: '#5a6a8a', boots: '#4a3426', hat: 'cap', cap: '#c8a860', skin: '#f0c49a', moustache: '#8a5a30' };
const RANGER = { jacket: '#8a8a5a', pants: '#6a6a48', boots: '#4a3426', hat: 'cap', cap: '#6a6a40', skin: '#f5c9a0', hair: '#6a4a30' };
const LIGHT2D = -2.1;
const fo = (f, seed, o) => ({ mode: 'stand', light: LIGHT2D, seed, blink: blinkAt(f, seed), ...o });
const card = (T, key, o, opts, pos, extra = {}) => ({ key: key + JSON.stringify(opts), draw: (p) => T.bodyFront(p, o, opts), x: pos[0], y: pos[1], z: pos[2], ...extra });
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1] - 1.07 * s, z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
const inFront = (c, d, ux, uy) => {
  const V = K.THREE.Vector3, p = new V(...c.pos), dir = new V(...c.look).sub(p).normalize(), right = new V().crossVectors(dir, new V(0, 1, 0)).normalize(), up = new V().crossVectors(right, dir);
  const h = d * Math.tan(c.fov * Math.PI / 360); return p.addScaledVector(dir, d).addScaledVector(right, ux * h).addScaledVector(up, uy * h).toArray();
};
const wordCard = (f, f0, txt, c, col = '#f6c83a', dur = 1e9, size = 170, uy = 0.42, d = 4) => { if (f < f0 - 1 || f > f0 + dur) return null; const t = q(Math.min(1, (f - f0 + 1) / 12));
  const r = Math.min(1, 400 / (0.7 * size * txt.length)), fs = size * r, s = Math.min(2.5, 1.25 / r);
  return FX('w' + txt + t + fs, (p) => PR.word(p, txt, t, col, fs), inFront(c, d, 0, uy), s * d / 7, { order: 9 }); };
const toadCard = (f, key, pos, s, o = {}) => { const hop = q(o.hop ?? 0, 2), tg = q(o.tongue ?? 0, 2), md = o.mood || 'smug';
  return { key: 'td' + key + hop + tg + md, draw: (p) => toad(p, hop, tg, md), x: pos[0], y: pos[1], z: pos[2], s, blob: true, shadow: true, order: 3, ...o.extra }; };
const beetleCard = (f, pos, s, smug = false) => { const m = q(Math.abs(Math.sin(f * 0.5)), 1); return FX('bt' + m + smug, (p) => beetle(p, m, smug), pos, s, { order: 4 }); };

function actorsAt(f, T) {
  const S = shotAt(f), out = [];
  switch (S.id) {
    case 'hook': case 'end': out.push(toadCard(f, 'h', [0.6, 0, 2.2], 0.75, { hop: 0 })); break;
    case 'plan': out.push(card(T, 'fm', FARMER, fo(f, 5, { expr: f > F_WRECK ? 'stern' : 'grin', look: 0.3, tilt: q(idle(f, 5).tilt, 1), headTilt: q(idle(f, 5).headTilt, 1) }), [-0.3, 0, 3])); break;
    case 'climb': { const ph = ((f - A(4)) % 22) / 22, hop = ph < 0.5 ? Math.sin(ph / 0.5 * Math.PI) : 0;
      out.push(toadCard(f, 'c', [3.25, hop * 0.5, 5.0], 0.5, { hop, mood: f > F_CLIMB ? 'neutral' : 'smug', extra: { ground: 0 } })); break; }
    case 'ate': { const tg = Math.max(0, Math.sin((f - A(5)) * 0.35)); out.push(toadCard(f, 'a', [0.2, 0, 3], 0.6, { tongue: tg > 0.3 ? tg : 0 })); break; }
    case 'poison': { const dead = f > F_DIED - 4 ? Math.min(1, (f - F_DIED + 4) / 8) : 0;
      out.push(toadCard(f, 'p', [-0.15, 0, 3], 0.5, { mood: 'smug' }));
      out.push(FX('sn' + q(dead, 1), (p) => snake(p, dead), [0.55, 1.07 * 0.7 - (dead ? 0.2 : 0), 3.3], 0.7, { order: 3 })); break; }
    case 'zilla': case 'name': out.push(card(T, 'rg', RANGER, fo(f, 8, { expr: S.id === 'name' ? 'laugh' : f > F_27 ? 'shock' : 'grin', look: 0.4, tilt: q(idle(f, 8).tilt, 1), headTilt: q(idle(f, 8).headTilt, 1) }), [-0.6, 0, 3]));
      out.push(toadCard(f, 'z', [0.5, 0, 3.3], 0.8, { mood: S.id === 'name' ? 'smug' : 'neutral', hop: S.id === 'name' ? q(Math.max(0, Math.sin((f - A(8)) * 0.4)) * 0.5, 1) : 0 })); break;
  }
  return out;
}

function fxAt(f, T, cam) {
  const S = shotAt(f), out = [], push = (x) => x && out.push(x);
  if (S.id === 'hook') { push(wordCard(f, F_1935, '1935', cam, '#f6c83a', F_102 - F_1935 - 3)); push(wordCard(f, F_102, '102 TOADS', cam, '#ffffff', F_BEET0 - F_102 - 2)); push(wordCard(f, F_BEET0, 'TO EAT BEETLES', cam, '#f6c83a')); }
  if (S.id === 'babies') push(wordCard(f, F_62, '62,000', cam, '#f6c83a', 1e9, 190, 0.45));
  if (S.id === 'plan') { if (f > F_CB - 6) out.push(beetleCard(f, inFront(cam, 1.4, 0.35, -0.1), 0.16)); push(wordCard(f, F_CB, 'CANE BEETLES', cam, '#ffffff', 1e9, 170, 0.5)); }
  if (S.id === 'high') { out.push(beetleCard(f, [3.9, 3.55, 4.3], 0.22, true)); push(wordCard(f, F_HIGH, 'WAY UP HERE', cam, '#f6c83a', 1e9, 170, 0.5, 2)); }
  if (S.id === 'climb') { out.push(beetleCard(f, [3.9, 3.55, 4.3], 0.22, true)); push(wordCard(f, F_CLIMB, "CAN'T CLIMB", cam, '#ff7a5a', 1e9, 180, 0.5, 2)); }
  if (S.id === 'ate') { const items = ['#e8c040', '#d04a3a', '#4a8ad0', '#8a4ad0'];
    for (let i = 0; i < 4; i++) { const t = ((f - A(5)) / 18 + i / 4) % 1; out.push(FX('it' + i + q(t, 2), (p) => { p.ell(300, 500, 70, 50, items[i], 10); p.ell(270, 480, 20, 14, '#ffffff', 0); }, [0.2 + (1 - t) * (i % 2 ? 1.2 : -1.2), 1.2 + (1 - t) * 0.6, 3.2], 0.25 * (1 - t * 0.6))); }
    push(wordCard(f, F_EVERY, 'EVERYTHING ELSE', cam, '#f6c83a', 1e9, 160, 0.5)); }
  if (S.id === 'poison') { push(wordCard(f, F_POIS, 'POISONOUS!', cam, '#9ad04a', F_DIED - F_POIS - 4, 180, 0.5)); if (f > F_DIED) { const t = q(((f - F_DIED) / 20) % 1, 2); out.push(FX('st' + t, (p) => T.fxStars(p, t), [1.6, 0.9, 3.3], 0.5, { order: 6 })); } }
  if (S.id === 'sea') push(wordCard(f, F_200, '200 MILLION', cam, '#f6c83a', 1e9, 190, 0.45, 7));
  if (S.id === 'zilla') { push(wordCard(f, F_2023, '2023', cam, '#ffffff', F_27 - F_2023 - 2, 170, 0.5)); push(wordCard(f, F_27, '2.7 KG', cam, '#f6c83a', 1e9, 200, 0.5)); }
  if (S.id === 'name') { push(wordCard(f, F_ZILLA, 'TOADZILLA', cam, '#9ad04a', 1e9, 200, 0.5)); }
  if (S.id === 'end') { const t = ramp(f, cut(9), F_STILL + 12); if (f < F_STILL + 12) out.push(beetleCard(f, inFront(cam, 1.5, 0.0, 0.05), 0.17, true));
    push(wordCard(f, F_STILL, 'STILL THERE', cam, '#f6c83a', 1e9, 180, 0.42, f < F_STILL + 12 ? 1.2 : 4)); }
  return out;
}

// ---------------- cameras ----------------
const CAMS = {
  hook: [{ f: 0, pos: [0.6, 0.55, 6.4], look: [0.2, 1.1, -6], fov: 52 }, { f: F_102, pos: [0.5, 0.6, 5.8], look: [0.2, 1.0, -6], fov: 50 }, { f: cut(1), pos: [0.5, 0.65, 5.4], look: [0.2, 1.0, -6], fov: 48 }],
  babies: [{ f: cut(1), pos: [0, 4, 12], look: [0, 0, -4], fov: 50 }, { f: F_HOP, pos: [0, 2.6, 8], look: [0, 0.2, -2], fov: 48 }, { f: cut(2), pos: [0.3, 2.0, 7], look: [0, 0.3, -2], fov: 46 }],
  plan: [{ f: cut(2), pos: [-0.3, 1.6, 7.0], look: [-0.3, 1.4, 2.8], fov: 42 }, { f: F_CB, pos: [-0.1, 1.6, 6.2], look: [-0.1, 1.45, 2.8], fov: 40 }, { f: cut(3), pos: [-0.05, 1.6, 6.0], look: [-0.05, 1.45, 2.8], fov: 39 }],
  high: [{ f: cut(3), pos: [3.6, 0.6, 7.2], look: [3.9, 1.2, 4.2], fov: 46 }, { f: F_HIGH + 4, pos: [3.6, 1.6, 6.6], look: [3.9, 3.4, 4.2], fov: 46, ease: 'easeOut' }, { f: cut(4), pos: [3.6, 2.0, 6.4], look: [3.9, 3.5, 4.2], fov: 44 }],
  climb: [{ f: cut(4), pos: [3.5, 0.9, 7.8], look: [3.75, 1.5, 4.2], fov: 54 }, { f: cut(5), pos: [3.5, 0.9, 7.4], look: [3.75, 1.6, 4.2], fov: 52 }],
  ate: [{ f: cut(5), pos: [0.2, 0.9, 6.0], look: [0.2, 0.9, 3], fov: 44 }, { f: F_EVERY, pos: [0.2, 0.8, 5.4], look: [0.2, 0.9, 3], fov: 40 }, { f: cut(6), pos: [0.2, 0.8, 5.2], look: [0.2, 0.9, 3], fov: 38 }],
  poison: [{ f: cut(6), pos: [0.3, 1.0, 6.6], look: [0.3, 0.8, 3], fov: 44 }, { f: F_SNAKE, pos: [0.25, 0.9, 6.0], look: [0.25, 0.7, 3], fov: 42 }, { f: cut(7), pos: [0.25, 0.9, 5.8], look: [0.25, 0.7, 3], fov: 41 }],
  sea: [{ f: cut(7), pos: [0, 6, 14], look: [0, 0, -6], fov: 50 }, { f: F_ONE - 4, pos: [0, 18, 26], look: [0, 0, -12], fov: 50 }],
  zilla: [{ f: F_ONE - 4, pos: [-0.05, 1.5, 9.2], look: [-0.05, 1.2, 3], fov: 42 }, { f: F_27, pos: [0.4, 1.0, 6.4], look: [0.45, 0.8, 3.2], fov: 40 }, { f: cut(8), pos: [0.45, 1.0, 6.2], look: [0.45, 0.8, 3.2], fov: 39 }],
  name: [{ f: cut(8), pos: [-0.05, 1.4, 8.6], look: [-0.05, 1.2, 3], fov: 42 }, { f: cut(9), pos: [-0.05, 1.4, 8.0], look: [-0.05, 1.2, 3], fov: 40 }],
  end: [{ f: cut(9), pos: [3.6, 2.4, 6.4], look: [3.9, 3.5, 4.2], fov: 44 }, { f: F_STILL + 12, pos: [3.6, 2.4, 6.2], look: [3.9, 3.5, 4.2], fov: 42 }, { f: F_STILL + 13, pos: [0.6, 0.6, 6.6], look: [0.2, 1.1, -6], fov: 54 }, { f: TOTAL - 1, pos: [0.6, 0.55, 6.4], look: [0.2, 1.1, -6], fov: 52 }],
};
const KICKS = [{ f: F_102, a: 0.03 }, { f: F_CLIMB, a: 0.03 }, { f: F_POIS, a: 0.03 }, { f: F_27, a: 0.04 }, { f: F_ZILLA, a: 0.05 }, { f: F_STILL, a: 0.03 }];
const camAt = (f) => { const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS }); c.shadowAt = [c.look[0], 0, Math.min(c.look[2], 4)]; return c; };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => { const id = shotAt(f).id;
  if (['plan', 'zilla', 'name', 'ate', 'poison'].includes(id)) return { focus: dist(Cm.pos, [0, 1, 3]), cinf: 10 };
  if (id === 'hook') return { focus: dist(Cm.pos, [0.6, 0.8, 2.2]), cinf: 6 };
  return { focus: 10, cinf: 0 }; };

export default {
  TOTAL, build,
  frame(f, k) {
    const S = shotAt(f), cam = camAt(f), id = S.id;
    toadU.t.value = f / 30;
    toadU.amt.value = { hook: 1, end: f > F_STILL + 12 ? 1 : 0.05, babies: 0.15 + 0.35 * ramp(f, F_62 - 4, F_HOP + 10), sea: 1, plan: 0.1, high: 0.05, climb: 0.05, ate: 0.2, poison: 0.2, zilla: 0.3, name: 0.3 }[id] ?? 0.2;
    toadU.sz.value = id === 'sea' ? 0.7 : 0.45;
    const light = ['zilla', 'name', 'sea'].includes(id) ? { ...GOLD } : { ...DAY };
    if (id === 'sea' || id === 'babies') light.shadowExt = 40;
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
  },
};
