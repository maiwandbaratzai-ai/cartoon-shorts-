// "The Great Molasses Flood" — Boston's North End, 15 Jan 1919. Timed to stories/molasses/voice.wav via molasses_timing.js.
import { TOTAL, LINES, wf } from './molasses_timing.js';
import * as PR from '../props.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], cut = (i) => Math.max(0, A(i) - 4);
const F_PAINT = wf(4, 'painted'), F_POP = wf(5, 'popped'), F_SPLIT = wf(6, 'split'), F_FIRE = wf(7, 'knocked'), F_BENT = wf(7, 'bent');
const SHOTS = [['hook', 0], ['north', cut(1)], ['tank', cut(2)], ['rum', cut(3)], ['paint', cut(4)], ['rivets', cut(5)], ['split', cut(6)], ['fire', cut(7)], ['el', F_BENT - 14],
  ['toll', cut(8)], ['glue', cut(9)], ['sailors', cut(10)], ['harbor', cut(11)], ['sweet', cut(12)]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const WINTER = { az: 200, el: 30, sky: '#dfe6f0', ground: '#9a9488', hemi: 1.15, sun: '#fff4e6', sunI: 2.2, fog: '#d8dfe8', fogNear: 90, fogFar: 700,
  skyTop: '#7f9fc8', skyHor: '#e4e9ef', sat: 1.02, vig: 0.24, shadowExt: 40 };
const GREY = { ...WINTER, sunI: 1.2, hemi: 1.3, sat: 0.72, skyTop: '#8d97a6', skyHor: '#c9ced6', fog: '#b9c0ca', gain: '#e6ecf4', vig: 0.34 };
const SUMMER = { ...WINTER, az: 150, el: 52, sunI: 2.7, sky: '#dbe8f8', skyTop: '#3d7fd6', skyHor: '#d5e6f6', fog: '#d5e6f6', sat: 1.15, gain: '#fff6ea', vig: 0.2 };
const TX = 0, TZ = -10, TR = 11, TH = 15;            // the tank (scaled down a little so it fits the street)
const ELZ = 6, ELY = 6.2, QUAY = -26;
let K, panels = [], tankTex, tankDraw, roof, flood, floodU, harbor, firehouse, elSag = [], train, rivets = [], crack;
const rnd = (() => { let s = 21; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();

// ---------- flood: polar heightfield around the tank ----------
const RINGS = []; { let r = 0; while (r < 140) { RINGS.push(r); r += r < 40 ? 0.8 : 2.5; } }
const SEG = 120;
const frontR = (s) => TR + 10.5 * Math.pow(Math.max(0, s), 0.85);
const floodH = (r, s) => {
  if (s <= 0) return -1;
  const R = frontR(s), H = 6.6 * Math.exp(-s / 3.2) + 0.9;
  if (r > R + 1.6) return -0.6;
  const body = H * (0.3 + 0.7 * Math.pow(clamp((r - (R - 14)) / 13), 1.6));
  const front = r > R ? H * (1 - (r - R) / 1.6) ** 0.5 : body;
  return Math.max(0.05, Math.min(body, front));
};
const SETTLED = (r) => (r < 95 ? 0.55 + 0.1 * Math.sin(r * 0.4) : -0.6);

function build(k) {
  K = k; const { THREE } = K;
  K.addClouds(8, 700, 120);
  // street + sidewalks + snow
  const cob = K.texM(K.P.stone(4, 30, 8, 52, 48, 32), 30, 30);
  K.slab(-200, 200, -0.05, 0, QUAY, 200, cob, K.scene, false);
  K.slab(-200, 200, 0, 0.18, 10, 13, K.col('#b8b2a8'), K.scene, false);
  const snow = K.col('#f4f6fa');
  for (let i = 0; i < 70; i++) { const x = -90 + rnd() * 180, z = (rnd() < 0.5 ? 10.5 + rnd() * 2.5 : -2 - rnd() * 4); if (Math.hypot(x - TX, z - TZ) < TR + 2) continue; K.sphere(1, snow, x, 0.05, z, K.scene, 1 + rnd() * 2.5, 0.12, 0.6 + rnd()); }
  // harbor
  K.slab(-200, 200, -3, 0, QUAY - 1.2, QUAY, K.col('#7a7468'), K.scene, false);
  harbor = PR.ocean(K, { y: -1.4, shoreZ: QUAY - 1, deep: '#2c5a72', shal: '#4f8296', foam: '#dfe8ee' });
  // brick rows on the north side of Commercial Street + a few south of it
  const bricks = ['#a8483a', '#9a3f34', '#b85a44', '#8e4a3e', '#a9604a'];
  for (let x = -110; x < 110; x += 0) {
    const w = 9 + rnd() * 7, h = 9 + rnd() * 8, d = 14, c = bricks[(rnd() * 5) | 0];
    const m = K.add(new THREE.BoxGeometry(w, h, d), K.toon({ map: PR.facadeTex(c, Math.round(w / 3), Math.round(h / 3.2), (rnd() * 99) | 0) }), x + w / 2, h / 2, 13 + d / 2);
    m.material.map.repeat.set(1, 1); K.slab(x + 0.2, x + w - 0.2, h, h + 0.6, 12.6, 13.4, K.col('#6a4a3a'), K.scene); x += w + 0.4;
  }
  for (const [x, w, h] of [[-70, 14, 8], [-54, 12, 10], [44, 13, 9], [62, 14, 11]]) K.add(new THREE.BoxGeometry(w, h, 10), K.toon({ map: PR.facadeTex(bricks[(rnd() * 5) | 0], 4, 3, (rnd() * 99) | 0) }), x, h / 2, -16);
  // firehouse (Engine 31): red brick, big door, sign
  firehouse = K.group(); firehouse.position.set(26, 0, -14);
  K.add(new THREE.BoxGeometry(11, 9, 9), K.toon({ map: PR.facadeTex('#b03a2e', 3, 2, 31) }), 0, 4.5, 0, firehouse);
  K.slab(-2.6, 2.6, 0, 4.6, 4.5, 4.62, K.col('#5a2a22'), firehouse);
  const sign = PR.canvasTex(512, 96, (g, w, h) => { g.fillStyle = '#f2e6c8'; g.fillRect(0, 0, w, h); g.fillStyle = '#5a1e18'; g.font = 'bold 64px Poppins, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('ENGINE 31', w / 2, h / 2 + 4); });
  K.add(new THREE.BoxGeometry(6, 1.1, 0.15), K.toon({ map: sign }), 0, 5.6, 4.6, firehouse);
  // elevated railway along the street: columns, girders (each span can sag), rails, a train
  const steel = K.col('#5c6168'), dark = K.col('#3a3e44');
  for (let x = -120; x <= 120; x += 10) for (const z of [ELZ - 1.6, ELZ + 1.6]) { const c = K.slab(x - 0.25, x + 0.25, 0, ELY, z - 0.25, z + 0.25, steel, K.scene); c.userData.x = x; if (Math.abs(x - 10) < 15) elSag.push({ m: c, kind: 'col', x, z }); }
  for (let x = -120; x < 120; x += 10) { const g = K.group(); g.position.set(x + 5, ELY, ELZ); K.slab(-5, 5, 0, 1.0, -1.9, 1.9, steel, g); K.slab(-5, 5, 1.0, 1.15, -1.3, 1.3, dark, g); if (Math.abs(x + 5 - 10) < 15) elSag.push({ m: g, kind: 'span', x: x + 5 }); }
  train = K.group(); train.position.set(0, ELY + 1.15, ELZ);
  for (let i = 0; i < 3; i++) { const car = K.group(train); car.position.x = i * 12.5; K.slab(-6, 6, 0.4, 3.4, -1.3, 1.3, K.toon({ map: PR.facadeTex('#4f7a4a', 6, 1, 70 + i, '#d9d2b0') }), car); K.slab(-6.2, 6.2, 3.4, 3.7, -1.4, 1.4, K.col('#3a4a3a'), car); }
  // the tank: 10 riveted panels that can burst outward + a conical roof
  const tc = document.createElement('canvas'); tc.width = 1024; tc.height = 512; const tg = tc.getContext('2d');
  tankTex = new THREE.CanvasTexture(tc); tankTex.colorSpace = THREE.SRGBColorSpace; tankTex.wrapS = THREE.RepeatWrapping;
  tankDraw = (paint) => { // paint 0..1 wipes the leaky grey tank to brown, top down
    tg.fillStyle = '#8f9aa6'; tg.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 26; i++) { const x = (i * 211) % 1024, y0 = 80 + ((i * 97) % 300), len = 60 + (i * 53) % 180; const gr = tg.createLinearGradient(0, y0, 0, y0 + len); gr.addColorStop(0, 'rgba(70,32,14,.95)'); gr.addColorStop(1, 'rgba(70,32,14,0)'); tg.fillStyle = gr; tg.fillRect(x, y0, 10 + (i % 3) * 5, len); }
    tg.fillStyle = '#6b3a1c'; tg.fillRect(0, 0, 1024, 512 * paint);
    for (let y = 40; y < 512; y += 64) { tg.fillStyle = 'rgba(0,0,0,.25)'; tg.fillRect(0, y, 1024, 3); for (let x = 6; x < 1024; x += 16) { tg.fillStyle = 'rgba(30,20,14,.7)'; tg.beginPath(); tg.arc(x, y + 8, 2.6, 0, 7); tg.fill(); } }
    for (let x = 0; x < 1024; x += 102.4) { tg.fillStyle = 'rgba(0,0,0,.25)'; tg.fillRect(x, 0, 3, 512); }
    tankTex.needsUpdate = true; tankTex.userData = paint;
  };
  tankDraw(0);
  const tankMat = K.toon({ map: tankTex });
  for (let i = 0; i < 10; i++) {
    const a0 = i / 10 * Math.PI * 2, da = Math.PI * 2 / 10, am = a0 + da / 2;
    const geo = new THREE.CylinderGeometry(TR, TR, TH, 8, 1, true, a0, da); geo.translate(0, TH / 2, 0);
    const uv = geo.attributes.uv; for (let j = 0; j < uv.count; j++) uv.setX(j, (uv.getX(j) + i) / 10 * 3);
    const piv = K.group(); const ex = Math.sin(am), ez = Math.cos(am); piv.position.set(TX + ex * TR, 0, TZ + ez * TR);
    const mesh = K.add(geo, tankMat, -ex * TR, 0, -ez * TR, piv); mesh.material.side = THREE.DoubleSide;
    piv.userData = { ex, ez, i }; panels.push(piv);
  }
  roof = K.add(new THREE.ConeGeometry(TR + 0.3, 2.2, 40), K.col('#5f3a22'), TX, TH + 1.1, TZ);
  // rivets that fly off (small dark spheres) + the crack
  for (let i = 0; i < 18; i++) { const m = K.sphere(0.16, K.col('#2a1d16'), 0, -10, 0); m.userData = { y: 2 + (i % 6) * 2.2, a: -1.4 + (i / 18) * 0.6, v: [rnd() * 6 - 3, 4 + rnd() * 5, 6 + rnd() * 6] }; rivets.push(m); }
  crack = K.slab(-0.2, 0.2, 0, 1, -0.2, 0.2, K.col('#2a140a'), K.scene); crack.position.set(TX + Math.sin(-1.1) * (TR + 0.05), 0, TZ + Math.cos(-1.1) * (TR + 0.05)); crack.rotation.y = -1.1;
  // the navy training ship out in the harbor
  { const sh = K.group(); sh.position.set(30, -2.6, -105); sh.rotation.y = 0.3; K.slab(-14, 14, -1, 2.6, -3, 3, K.col('#2a2a30'), sh); K.slab(-14, 14, 2.2, 2.6, -3.05, 3.05, K.col('#e9e6da'), sh);
    for (const x of [-8, 0, 8]) { K.cyl(0.22, 0.3, 20, K.col('#7a5a3a'), x, 2.6, 0, sh); for (const y of [9, 15]) K.slab(x - 0.15, x + 0.15, 2.6 + y, 2.6 + y + 0.25, -4, 4, K.col('#7a5a3a'), sh); } }
  // rum barrels
  for (let i = 0; i < 9; i++) { const b = K.add(new THREE.CylinderGeometry(0.45, 0.45, 1.2, 14), K.col('#8a5a34'), -19 + (i % 3) * 1.0, 0.6, -4.5 - ((i / 3) | 0) * 1.0); b.rotation.z = i > 5 ? Math.PI / 2 : 0; }
  // flood surface
  const pos = [], idx = [];
  RINGS.forEach((r) => { for (let s = 0; s < SEG; s++) { const a = s / SEG * Math.PI * 2; pos.push(TX + Math.sin(a) * r, 0, TZ + Math.cos(a) * r); } });
  for (let i = 0; i < RINGS.length - 1; i++) for (let s = 0; s < SEG; s++) { const a = i * SEG + s, b = i * SEG + (s + 1) % SEG, c = a + SEG, d = b + SEG; idx.push(a, c, b, b, c, d); }
  const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); fg.setIndex(idx); fg.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(pos.length), 3)); fg.computeVertexNormals();
  flood = K.add(fg, K.toon({ color: '#ffffff', vertexColors: true, side: THREE.DoubleSide }), 0, 0, 0, K.scene, { cast: false }); flood.frustumCulled = false;
  K.sphere(1, K.col('#5a2c12'), TX, 0.01, TZ, K.scene, 0.01, 0.01, 0.01);
}
let floodKey = '';
function poseFlood(mode, s) {
  const key = mode + q(s, 2); if (key === floodKey) return; floodKey = key;
  const P = flood.geometry.attributes.position;
  RINGS.forEach((r, i) => { const h = mode === 'settled' ? SETTLED(r) : floodH(r, s); for (let k = 0; k < SEG; k++) { const z = P.getZ(i * SEG + k); P.setY(i * SEG + k, z < QUAY + 0.5 ? -2.5 : h + (h > 0.1 ? 0.12 * Math.sin(k * 0.7 + r * 0.5 + s * 3) : 0)); } });
  const C = flood.geometry.attributes.color, dk = new K.THREE.Color('#5a2c12'), lt = new K.THREE.Color('#a8622c'), tmp = new K.THREE.Color(), R = frontR(s);
  RINGS.forEach((r, i) => { const k2 = mode === 'settled' ? 0.12 * (0.5 + 0.5 * Math.sin(r * 0.9)) : r > R ? 0.12 : r > R - 1.6 ? 1 : 0.4 * Math.max(0, Math.sin(r * 1.1 - s * 9)) ** 4; tmp.copy(dk).lerp(lt, k2);
    for (let k = 0; k < SEG; k++) C.setXYZ(i * SEG + k, tmp.r, tmp.g, tmp.b); });
  C.needsUpdate = true; P.needsUpdate = true; flood.geometry.computeVertexNormals(); flood.visible = mode !== 'none';
}

const HOOK_S = (f) => 0.8 + f / 30 * 0.32;   // flash-forward: the wave in mid-run during the hook
function poseWorld(f) {
  const S = shotAt(f), id = S.id, t = f / 30;
  harbor.U.t.value = t;
  // tank paint
  const paint = id === 'paint' ? M.smooth(ramp(f, F_PAINT - 4, F_PAINT + 40)) : ['hook', 'north', 'tank', 'rum'].includes(id) ? 0 : 1;
  const pq = q(paint, 1); if (tankTex.userData !== pq) tankDraw(pq);
  // burst
  const sb = id === 'hook' ? 2 : (f - F_SPLIT) / 30, open = sb > 0 && !['north', 'tank', 'rum', 'paint', 'rivets'].includes(id) ? 1 : 0;
  panels.forEach((p) => { const k = open * M.easeOut(clamp(sb / 1.4)) * (1.42 + 0.06 * Math.sin(p.userData.i * 2.1)); p.setRotationFromAxisAngle(K.V(p.userData.ez, 0, -p.userData.ex), k); p.position.y = 0; p.visible = !['toll', 'glue', 'sailors', 'harbor', 'sweet'].includes(id); });
  roof.position.y = TH + 1.1 - open * 16 * M.easeIn(clamp(sb / 1.2)); roof.rotation.z = open * 0.5 * clamp(sb); roof.visible = roof.position.y > 0.5 && !['toll', 'glue', 'sailors', 'harbor', 'sweet'].includes(id);
  // rivets + crack
  const sp = (f - F_POP) / 30;
  rivets.forEach((m, i) => { const u = m.userData, s = sp - (i % 6) * 0.08; if (id !== 'rivets' || s < 0) { m.visible = false; return; } m.visible = true;
    const a = u.a, bx = TX + Math.sin(a) * TR, bz = TZ + Math.cos(a) * TR; m.position.set(bx + Math.sin(a) * u.v[2] * s + u.v[0] * s * 0.3, u.y + u.v[1] * s - 4.9 * s * s, bz + Math.cos(a) * u.v[2] * s); });
  crack.visible = id === 'rivets' && sp > 0; crack.scale.y = 0.01 + TH * 0.9 * M.easeOut(clamp(sp / 1.6)); crack.position.y = 0.3;
  // flood
  if (id === 'hook') poseFlood('wave', HOOK_S(f));
  else if (id === 'split' || id === 'fire' || id === 'el') poseFlood('wave', Math.max(0.001, sb - 0.15));
  else if (['toll', 'glue', 'sailors', 'harbor'].includes(id)) poseFlood('settled', 0);
  else poseFlood('none', 0);
  // firehouse knocked off its foundation; El girders bend
  const fk = id === 'fire' || id === 'el' || ['toll', 'glue', 'sailors', 'harbor'].includes(id) ? M.easeOut(ramp(f, F_FIRE, F_FIRE + 24)) * (id === 'fire' ? 1 : 1) : 0;
  firehouse.position.set(26 + 3.5 * fk, -0.6 * fk, -14 - 6 * fk); firehouse.rotation.set(0, 0.25 * fk, -0.12 * fk);
  const bk = ['el', 'toll', 'glue', 'sailors', 'harbor'].includes(id) ? M.easeOut(ramp(f, F_BENT, F_BENT + 20)) : 0;
  elSag.forEach((e) => { const w = Math.max(0, 1 - Math.abs(e.x - 10) / 15);
    if (e.kind === 'col') e.m.rotation.set(-0.35 * w * bk * (e.z < ELZ ? 1 : 0.6), 0, 0.08 * w * bk);
    else { e.m.position.y = ELY - 2.6 * w * bk; e.m.rotation.z = (e.x < 10 ? 1 : -1) * 0.18 * w * bk; } });
  // the train runs on the El (lunchtime, and in the hook)
  train.visible = id === 'north' || id === 'tank' || id === 'rum'; train.position.x = -70 + 9 * (f - cut(1)) / 30;
  // harbor turns brown after the flood
  const brown = ['harbor', 'sweet'].includes(id) ? (id === 'harbor' ? M.smooth(ramp(f, A(11), A(11) + 30)) : 0) : ['toll', 'glue', 'sailors'].includes(id) ? 0.4 : 0;
  harbor.U.deep.value.set('#2c5a72').lerp(new K.THREE.Color('#4a2a14'), brown); harbor.U.shal.value.set('#4f8296').lerp(new K.THREE.Color('#7a4a22'), brown);
}

// ---------------- cameras ----------------
const CAMS = {
  hook: [{ f: 0, pos: [-46, 1.8, 0.5], look: [-14, 4.2, -5], fov: 46 }, { f: cut(1), pos: [-48, 2.0, 0.5], look: [-16, 4.6, -5], fov: 46 }],
  north: [{ f: cut(1), pos: [-40, 2.2, 3], look: [-10, 3.2, 8], fov: 42 }, { f: cut(2), pos: [-37, 2.3, 3], look: [-8, 3.4, 8], fov: 42 }],
  tank: [{ f: cut(2), pos: [-34, 2.5, -1], look: [TX, 7, TZ], fov: 46 }, { f: cut(3), pos: [-42, 15, -4], look: [TX, 8, TZ], fov: 46 }],
  rum: [{ f: cut(3), pos: [-23.5, 2.3, 2.5], look: [-18, 1.3, -3.2], fov: 40 }, { f: cut(4), pos: [-22.8, 2.2, 1.8], look: [-18, 1.3, -3.2], fov: 38 }],
  paint: [{ f: cut(4), pos: [-30, 3.5, 0.5], look: [TX, 7, TZ], fov: 44 }, { f: cut(5), pos: [-28, 4, 0], look: [TX, 7.5, TZ], fov: 44 }],
  rivets: [{ f: cut(5), pos: [-30, 2.5, 1], look: [-9, 7, -5], fov: 48 }, { f: F_POP, pos: [-29.5, 2.5, 0.8], look: [-9, 7, -5], fov: 44 },
    { f: cut(6), pos: [-31, 2.7, 1.4], look: [-9, 6.5, -5], fov: 50 }],
  split: [{ f: cut(6), pos: [-55, 22, -4], look: [TX, 2, TZ + 2], fov: 46 }, { f: cut(7), pos: [-60, 20, 0], look: [TX - 6, 1, TZ + 6], fov: 48 }],
  fire: [{ f: cut(7), pos: [12, 5, 14], look: [26, 4, -14], fov: 44 }, { f: F_BENT - 14, pos: [11, 4.6, 12], look: [27, 4, -16], fov: 42 }],
  el: [{ f: F_BENT - 14, pos: [-8, 2.4, 11.5], look: [12, 6, 6], fov: 46 }, { f: cut(8), pos: [-6, 2.3, 11.2], look: [12, 5, 6], fov: 44 }],
  toll: [{ f: cut(8), pos: [-55, 30, -6], look: [0, 0, -2], fov: 44 }, { f: cut(9), pos: [-50, 27, -5], look: [0, 0, -2], fov: 42 }],
  glue: [{ f: cut(9), pos: [-15, 2.0, 11.2], look: [-15, 0.9, 4], fov: 40 }, { f: cut(10), pos: [-15, 1.9, 10.4], look: [-15, 0.9, 4], fov: 38 }],
  sailors: [{ f: cut(10), pos: [-27.5, 2.0, 11.2], look: [-27.6, 0.9, 4.2], fov: 40 }, { f: cut(11), pos: [-27.5, 1.9, 10.4], look: [-27.6, 0.9, 4.2], fov: 38 }],
  harbor: [{ f: cut(11), pos: [-16, 6, -28.5], look: [4, -1.4, -70], fov: 46 }, { f: cut(12), pos: [-14, 5.5, -30], look: [6, -1.4, -70], fov: 44 }],
  sweet: [{ f: cut(12), pos: [-14, 2.0, 4.5], look: [-13, 1.7, 11.5], fov: 40 }, { f: TOTAL - 1, pos: [-13.8, 1.9, 6], look: [-13, 1.7, 11.5], fov: 38 }],
};
const KICKS = [{ f: F_POP, a: 0.03 }, { f: F_POP + 5, a: 0.03 }, { f: F_POP + 10, a: 0.03 }, { f: F_SPLIT, a: 0.07 }, { f: F_FIRE, a: 0.05 }, { f: F_BENT, a: 0.05 }];
const camAt = (f) => {
  const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS });
  if (S.id === 'hook') { const sh = 0.03 * Math.sin(f * 1.7); c.look = [c.look[0], c.look[1] + sh, c.look[2]]; }
  c.shadowAt = { hook: [-30, 0, 4], north: [-20, 0, 6], rum: [-18, 0, -3], glue: [-15, 0, 4], sailors: [-28, 0, 4], sweet: [-13, 0, 10], fire: [22, 0, -8], el: [6, 0, 8], rivets: [-15, 0, -2] }[S.id];
  return c;
};
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => {
  const S = shotAt(f);
  const fc = { rum: [-18, 1.3, -3], glue: [-15, 1.2, 4.4], sailors: [-27.6, 1.2, 4.4], sweet: [-13, 1.6, 10.5] }[S.id];
  return fc ? { focus: dist(Cm.pos, fc), cinf: 9 } : { focus: 10, cinf: 0 };
};

// ---------------- characters ----------------
const T1919 = (v) => {
  const coats = ['#3f4f6f', '#6a3b3a', '#4a5a3a', '#5a4a3a', '#2f4f5a', '#5a3a5a'], skins = ['#ffe2c2', '#f5c9a0', '#ecd0b6', '#c99067'];
  const o = { jacket: coats[v % 6], pants: '#3b3f52', boots: '#2a2420', skin: skins[v % 4] };
  return v % 3 === 1 ? { ...o, hat: 'bonnet', dress: ['#6a4a6a', '#3f5f7a', '#7a5a3a'][v % 3] } : v % 3 === 2 ? { ...o, hat: 'cap', cap: '#4a4a52', moustache: v % 2 ? '#4a3020' : undefined } : { ...o, hat: 'tophat' };
};
const WORKER = { jacket: '#5a4a3a', pants: '#3e434c', boots: '#2a2420', hat: 'cap', cap: '#3e434c', moustache: '#3a2a20' };
const PAINTER = { jacket: '#e9e6da', pants: '#e9e6da', boots: '#2a2420', hat: 'cap', cap: '#e9e6da' };
const SAILOR = { jacket: '#1f2f5a', pants: '#1f2f5a', boots: '#111111', hat: 'cap', cap: '#f4f4f4', buttons: '#e8c45a' };
const LIGHT2D = -2.1;
const fo = (f, seed, o) => ({ mode: 'stand', light: LIGHT2D, seed, blink: blinkAt(f, seed), ...o });
const card = (T, key, o, opts, pos, extra = {}) => ({ key: key + JSON.stringify(opts), draw: (p) => (opts.side ? T.bodySide(p, o, opts) : T.bodyFront(p, o, opts)), x: pos[0], y: pos[1], z: pos[2], ...extra });
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1], z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });

function actorsAt(f, T) {
  const S = shotAt(f), out = [];
  const stroll = (n, x0, z0, spread, dir = 1) => { for (let i = 0; i < n; i++) { const sp = 0.9 + (i % 3) * 0.2, x = x0 + ((i * 3.7 + dir * sp * (f - S.a) / 30) % spread), z = z0 + (i % 3) * 0.9;
    out.push(card(T, 'p' + i, T1919(i), fo(f, 40 + i, { expr: ['smile', 'neutral', 'whistle', 'grin'][i % 4], mode: 'stroll', phase: q(((f * 0.05 * sp + i * 0.3) % 1), 1) }), [x, 0.18, z], { flip: dir < 0 })); } };
  switch (S.id) {
    case 'hook': for (let i = 0; i < 6; i++) { const x = -26 - (i % 3) * 1.6 - 3.0 * (f / 30), z = -1.5 + (i % 3) * 1.2 + (i > 2 ? 1.5 : 0);
      out.push(card(T, 'run' + i, T1919(i), fo(f, 40 + i, { expr: 'shock', mode: 'march', phase: q(((f * 0.12 + i * 0.3) % 1), 1) }), [x + (i % 2) * 0.8, 0, z])); } break;
    case 'north': stroll(7, -26, 10.6, 22, 1); for (let i = 0; i < 4; i++) out.push(card(T, 'q' + i, T1919(i + 7), fo(f, 50 + i, { expr: 'smile', mode: 'stroll', phase: q(((f * 0.05 + i * 0.4) % 1), 1) }), [-6 - ((i * 4 + (f - S.a) / 30) % 18), 0, 4 + i * 0.7], { flip: true })); break;
    case 'tank': stroll(4, -28, 4, 12, 1); break;
    case 'rum': out.push(card(T, 'wk', WORKER, fo(f, 4, { expr: 'grin', look: -0.4 }), [-16.6, 0, -3.0])); out.push(card(T, 'wk2', { ...WORKER, skin: '#c99067', moustache: undefined }, fo(f, 5, { expr: 'stern', look: 0.4 }), [-19.6, 0, -2.8])); break;
    case 'paint': out.push(card(T, 'pt', PAINTER, fo(f, 6, { expr: f > F_PAINT ? 'whistle' : 'nervous', look: 0.5, wave: f > F_PAINT - 4 ? q(Math.sin(f * 0.6), 1) : undefined }), [TX - 12.5, 0, TZ + 6])); break;
    case 'rivets': for (let i = 0; i < 3; i++) out.push(card(T, 'rv' + i, T1919(i + 2), fo(f, 60 + i, { expr: f > F_POP + 3 ? 'shock' : 'neutral', look: -0.4 + i * 0.3 }), [-17.5 + i * 1.2, 0, -0.8 + (i % 2) * 0.6])); break;
    case 'glue': for (let i = 0; i < 3; i++) { const x = -16.6 + i * 1.5 + 0.12 * Math.sin(f * 0.04 + i), z = 4 + (i % 2) * 0.8;
      out.push(card(T, 'gl' + i, i === 1 ? SAILOR : T1919(i + 3), fo(f, 70 + i, { expr: ['pained', 'stern', 'pained'][i], mode: 'march', phase: q(((f * 0.012 + i * 0.3) % 1), 1), tilt: q(4 * Math.sin(f * 0.05 + i), 0) }), [x, -0.25, z], { blob: false })); } break;
    case 'sailors': for (let i = 0; i < 4; i++) { const x = -29.5 + i * 1.3, z = 4 + (i % 2) * 0.6, sailor = i % 2 === 0;
      out.push(card(T, 'sl' + i, sailor ? { ...SAILOR, skin: ['#ffe2c2', '#c99067'][i / 2 | 0] } : T1919(i + 8), fo(f, 80 + i, { expr: sailor ? 'stern' : 'relief', look: sailor ? 0.4 : -0.4, wave: sailor && f > A(10) + 30 ? q(Math.sin(f * 0.2), 1) : undefined }), [x, -0.2, z], { blob: false })); } break;
    case 'sweet': out.push(card(T, 'sw', { jacket: '#c25a7a', pants: '#3b3f52', boots: '#4a3426', hat: 'hair', hair: '#3b2a20', skin: '#f5c9a0' }, fo(f, 9, { expr: f > A(12) + 40 ? 'smile' : 'lick', look: 0.3 }), [-13, 0.18, 10.8]));
      out.push(card(T, 'sw2', { jacket: '#3f8a5a', pants: '#4a4f62', boots: '#2a2420', hat: 'cap', cap: '#c8402e', skin: '#c99067' }, fo(f, 10, { expr: 'grin', look: -0.3 }), [-11.8, 0.18, 11.3])); break;
  }
  return out;
}
function fxAt(f, T) {
  const S = shotAt(f), out = [];
  if (S.id === 'tank' && f >= wf(2, 'two') - 2) { const t = q(Math.min(1, (f - wf(2, 'two') + 2) / 40)); out.push(FX('gal' + t, (p) => PR.word(p, '2,300,000', t, '#f6c83a', 96), [TX - 6, 22, TZ + 8], 9)); out.push(FX('gal2' + t, (p) => PR.word(p, 'GALLONS', t, '#ffffff', 110), [TX - 6, 17.5, TZ + 8], 9)); }
  if (S.id === 'rivets') for (let i = 0; i < 6; i++) { const t = (f - F_POP - i * 3) / 14; if (t >= 0 && t < 1) { const tq = q(t); const a = -1.4 + (i / 6) * 0.6;
    out.push(FX('rp' + i + tq, (p) => { p.g.translate(50, 250); T.fxBurst(p, tq, '#fff3b0', 8, 20, 140); }, [TX + Math.sin(a) * (TR + 0.4), 2 + i * 2.2 - 1.1, TZ + Math.cos(a) * (TR + 0.4)], 2.2)); } }
  if (S.id === 'hook') for (let i = 0; i < 5; i++) { const t = q(((f * 0.03 + i * 0.2) % 1), 1), a = -2.2 + i * 0.25, R = frontR(HOOK_S(f)) + 1;
    out.push(FX('glop' + i + t, (p) => PR.splat(p, t, '#7a3c16'), [TX + Math.sin(a) * R, 1.5, TZ + Math.cos(a) * R], 7)); }
  if (S.id === 'split' && f >= F_SPLIT) { const t = q(Math.min(1, (f - F_SPLIT) / 30)); if (t < 1) out.push(FX('spb' + t, (p) => { p.g.translate(50, 250); T.fxBurst(p, t, '#fff3b0', 12, 60, 260); }, [TX, 0, TZ + TR + 2], 16)); }
  if (S.id === 'fire' && f >= F_FIRE) { const t = q(Math.min(1, (f - F_FIRE) / 18)); if (t < 1) out.push(FX('fb' + t, (p) => { p.g.translate(50, 250); T.fxBurst(p, t); }, [22, 1, -8], 8)); }
  if (S.id === 'el' && f >= F_BENT) { const t = q(Math.min(1, (f - F_BENT) / 18)); if (t < 1) out.push(FX('eb' + t, (p) => { p.g.translate(50, 250); T.fxBurst(p, t); }, [10, 3, ELZ + 2], 6)); }
  if (S.id === 'glue') for (let i = 0; i < 3; i++) { const t = q(((f * 0.02 + i * 0.33) % 1), 1); out.push(FX('fr' + i + t, (p) => { p.g.translate(150, 600); T.fxPuff(p, t); }, [-16.4 + i * 1.5, 1.4, 4.4], 0.9, { alpha: 0.7 })); }
  if (S.id === 'sweet') { const t = q(((f - S.a) / 45) % 1); out.push(FX('sweet' + t, (p) => PR.stink(p, t, '#f29ab8'), [-12.2, 1.4, 10.2], 1.3)); }
  return out;
}

export default {
  TOTAL, build,
  frame(f, k) {
    poseWorld(f);
    const S = shotAt(f), cam = camAt(f);
    const light = { ...(S.id === 'sweet' ? SUMMER : ['toll', 'glue', 'sailors'].includes(S.id) ? GREY : WINTER) };
    if (['rum', 'glue', 'sailors', 'sweet', 'paint', 'north'].includes(S.id)) light.shadowExt = 18;
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T) };
  },
};
