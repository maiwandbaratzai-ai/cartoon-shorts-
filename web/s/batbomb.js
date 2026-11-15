// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The Bat Bomb" — Carlsbad Army Airfield, New Mexico, 15 May 1943. Timed via batbomb_timing.js.
import { TOTAL, LINES, wf } from './batbomb_timing.js';
import * as PR from '../props.js';
import { INK } from '../toon.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], E = (i) => L[i][1], cut = (i) => Math.max(0, A(i) - 4);
const F_1943 = wf(0, '1943'), F_FIRE = wf(0, 'firebombs'), F_BATS = wf(0, 'bats'), F_THOU = wf(1, 'thousand'), F_NAP = wf(1, 'napalm'), F_CHEST = wf(1, 'chest'),
  F_DENT = wf(2, 'dentist'), F_JAPAN = wf(2, 'japan'), F_ATT = wf(2, 'attics'), F_ROOS = wf(3, 'roosevelt'), F_YES = wf(3, 'yes'),
  F_MAY = wf(4, 'may'), F_TEST = wf(4, 'tested'), F_NM = wf(4, 'new'), F_WORSE = wf(5, 'worse'), F_ESC = wf(5, 'escaped'),
  F_TANK = wf(6, 'fuel'), F_HUNG = wf(6, 'hung'), F_NAPP = wf(6, 'nap'), F_TIMER = wf(7, 'timers'), F_OUT = wf(7, 'out'),
  F_WHOOSH = wf(8, 'whoosh'), F_BURN = wf(8, 'burned'), F_RANGE = wf(8, 'range'), F_FIRST = wf(9, 'first'), F_AMER = wf(9, 'america');
const SHOTS = [['hook', 0], ['bat', cut(1)], ['dentist', cut(2)], ['stamp', cut(3)], ['field', cut(4)], ['cage', F_TEST - 4], ['escape', cut(5)], ['roost', cut(6)],
  ['tick', cut(7)], ['whoosh', cut(8)], ['range', F_BURN - 4], ['end', cut(9)]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const DAY = { az: 150, el: 40, sky: '#e4eefa', ground: '#c8a070', hemi: 1.1, sun: '#fff0d8', sunI: 2.6, fog: '#f0dcc0', fogNear: 150, fogFar: 1100,
  skyTop: '#2a78d0', skyHor: '#f4e2c8', sat: 1.15, vig: 0.2, shadowExt: 30 };
const FIRE = { ...DAY, az: 200, el: 22, sun: '#ffc890', sunI: 2.4, sky: '#ffd8b0', hemi: 1.2, skyTop: '#c8603a', skyHor: '#f8c890', fog: '#e8a878', fogNear: 80, fogFar: 700, sat: 1.2, vig: 0.28 };
const OFFICE = { ...DAY, az: 210, el: 30, sun: '#ffe2b8', sky: '#ffe8d0', ground: '#6a4a30', hemi: 1.3, skyTop: '#9a7a5a', skyHor: '#e8d0b0', fog: '#c8a880', fogNear: 30, fogFar: 200, vig: 0.3 };
const OFF = [300, 0, 0];
const TANK = [0, 0, 0], TANKY = 7.5;
let K, bat = {}, burnMats = [];
const rnd = (() => { let s = 1943; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
const gnd = (x, z) => { const r = Math.hypot(x, z); return r < 40 ? 0 : (r - 40) * 0.01 + 0.8 * Math.sin(x * 0.02) * Math.sin(z * 0.025) * clamp((r - 40) / 30); };

// ---------------- 2D drawings ----------------
const BATC = '#5a4038', WINGC = '#7a5a50';
/** bat facing camera; flap 0..1, hang = upside down asleep, bomb = napalm capsule on chest, tick = timer glow */
const batDraw = (p, flap = 0, hang = false, bomb = true, tick = 0) => {
  const g = p.g; g.save();
  if (hang) { g.translate(300, 500); g.rotate(Math.PI); g.translate(-300, -500); }
  const up = hang ? -0.6 : Math.sin(flap * Math.PI * 2), cx = 300, cy = 500;
  const wing = (s) => {
    const pts = hang ? [[cx + s * 40, cy - 60], [cx + s * 95, cy - 20], [cx + s * 85, cy + 80], [cx + s * 40, cy + 70]]
      : [[cx + s * 40, cy - 30], [cx + s * 150, cy - 110 - 90 * up], [cx + s * 270, cy - 60 - 140 * up], [cx + s * 240, cy + 10 - 80 * up], [cx + s * 190, cy - 10 - 60 * up], [cx + s * 150, cy + 40 - 40 * up], [cx + s * 100, cy + 10 - 20 * up], [cx + s * 50, cy + 60]];
    p.poly(pts, WINGC, 10);
    if (!hang) for (const k of [1, 3, 5]) p.stroke([[cx + s * 45, cy - 25], pts[k]], 5, '#4a3430');
  };
  wing(-1); wing(1);
  p.ell(cx, cy + 20, 62, 85, BATC, 11);
  // ears + head
  p.poly([[cx - 50, cy - 70], [cx - 62, cy - 150], [cx - 18, cy - 92]], BATC, 9); p.poly([[cx + 50, cy - 70], [cx + 62, cy - 150], [cx + 18, cy - 92]], BATC, 9);
  p.ell(cx, cy - 60, 54, 46, '#6a4c42', 10);
  if (hang) { p.stroke([[cx - 30, cy - 66], [cx - 12, cy - 62]], 6, INK); p.stroke([[cx + 12, cy - 62], [cx + 30, cy - 66]], 6, INK); }
  else { p.ell(cx - 20, cy - 66, 13, 15, '#ffffff', 5); p.ell(cx + 20, cy - 66, 13, 15, '#ffffff', 5); p.dot(cx - 18, cy - 64, 6); p.dot(cx + 22, cy - 64, 6); }
  p.ell(cx, cy - 44, 12, 8, '#3a2622', 0); p.poly([[cx - 10, cy - 34], [cx - 5, cy - 24], [cx, cy - 34]], '#ffffff', 3);
  if (bomb) { p.ell(cx, cy + 30, 34, 52, '#e07a2a', 8); p.stroke([[cx - 32, cy + 10], [cx + 32, cy + 10]], 6, '#7a3a14'); p.ell(cx, cy - 18, 12, 10, tick ? '#ff3a2a' : '#c8c8d0', 5);
    if (tick) p.g.globalAlpha = 1; }
  g.restore();
};
/** layered cartoon flame, t loops 0..1 */
const flame = (p, t, seed = 1) => {
  const layer = (w, h, col, ph) => { const pts = []; for (let i = 0; i <= 16; i++) { const a = i / 16 * Math.PI; const wob = 1 + 0.18 * Math.sin(i * 1.7 + t * 6.283 * 2 + seed + ph);
      const tip = Math.pow(Math.sin(a), 0.6); pts.push([300 + Math.cos(a) * w * wob, 960 - tip * h * (1 + 0.12 * Math.sin(t * 6.283 + seed * 2 + ph)) - (1 - Math.abs(Math.cos(a))) * 0]); }
    for (let i = 0; i <= 8; i++) { const a = Math.PI + i / 8 * Math.PI; pts.push([300 + Math.cos(a) * w, 960 - Math.sin(a) * w * 0.25]); }
    p.poly(pts, col, ph ? 0 : 12); };
  layer(230, 720, '#e2452a', 0); layer(170, 540, '#f6912e', 1); layer(100, 330, '#ffe27a', 2);
};
const smokePuff = (p, t, seed) => { p.g.save(); p.g.globalAlpha = 0.85 * (1 - t); for (let i = 0; i < 6; i++) { const a = i * 1.1 + seed; p.ell(300 + Math.cos(a) * 110 * (0.6 + t), 520 + Math.sin(a) * 90 * (0.6 + t), 120 + 60 * t, 100 + 50 * t, i % 2 ? '#6a5a5a' : '#7e6e6a', 8); } p.g.restore(); };
const paper = (p, stamp) => {
  p.g.save(); p.g.translate(300, 500); p.g.rotate(-0.05); p.g.translate(-300, -500);
  p.poly([[60, 120], [540, 120], [540, 900], [60, 900]], '#f6f0dc', 12);
  p.g.fillStyle = INK; p.g.font = 'bold 54px Poppins, sans-serif'; p.g.textAlign = 'center'; p.g.fillText('PROPOSAL', 300, 210);
  p.g.font = '34px Poppins, sans-serif'; p.g.fillText('BAT BOMBS', 300, 270);
  for (let i = 0; i < 9; i++) p.stroke([[110, 340 + i * 50], [490 - (i % 3) * 50, 340 + i * 50]], 6, '#9a9488');
  p.g.save(); p.g.translate(300, 380); p.g.scale(0.55, 0.55); p.g.translate(-300, -500); batDraw(p, 0.25, false, true); p.g.restore();
  if (stamp > 0) { const s = 1 + 1.5 * (1 - M.easeOut(stamp)); p.g.save(); p.g.translate(300, 720); p.g.rotate(-0.22); p.g.scale(s, s); p.g.globalAlpha = Math.min(1, stamp * 3);
    p.g.strokeStyle = '#d0302a'; p.g.lineWidth = 16; p.g.strokeRect(-210, -70, 420, 140); p.g.fillStyle = '#d0302a'; p.g.font = 'bold 92px Poppins, sans-serif'; p.g.textAlign = 'center'; p.g.textBaseline = 'middle'; p.g.fillText('APPROVED', 0, 6); p.g.restore(); }
  p.g.restore();
};

function build(k) {
  K = k; const { THREE } = K, M4 = THREE.Matrix4;
  K.addClouds(5, 900, 260);
  PR.terrain(K, 900, 160, gnd, K.toon({ map: PR.speckTex('#dcb98a', ['#cfa978', '#e6c89a', '#c49a6a', '#b8a070'], 43, 2600, 80) }));
  // runway + taxiway
  K.slab(-120, 120, 0, 0.03, 24, 40, K.toon({ map: PR.canvasTex(512, 64, (c, w, h) => { c.fillStyle = '#7a7470'; c.fillRect(0, 0, w, h); c.fillStyle = '#f2ecd8'; for (let x = 0; x < w; x += 64) c.fillRect(x, 29, 34, 6); }, [8, 1]) }), K.scene, false);
  // mesas
  const mesa = K.col('#c87a4a'), mesa2 = K.col('#b0663e');
  for (let i = 0; i < 9; i++) { const x = -520 + i * 130, z = -380 - (i % 3) * 70, w = 60 + (i % 4) * 30; const m = K.add(new THREE.CylinderGeometry(w, w * 1.3, 50 + (i % 3) * 25, 7), i % 2 ? mesa : mesa2, x, 20, z); m.castShadow = false; }
  // scrub bushes (merged)
  const bush = []; for (let i = 0; i < 220; i++) { const a = rnd() * 6.283, d = 18 + rnd() * 150, x = Math.cos(a) * d, z = Math.sin(a) * d; if (z > 20 && z < 44) continue; const s = 0.4 + rnd() * 0.6; bush.push(new M4().makeTranslation(x, gnd(x, z) + 0.2 * s, z).multiply(new M4().makeScale(s, s * 0.7, s))); }
  K.add(PR.mergeCopies(new THREE.IcosahedronGeometry(0.9, 0), bush), K.col('#8a9a5a'), 0, 0, 0).frustumCulled = false;
  // elevated fuel tank on stilts
  const steel = K.col('#b8bcc4'), leg = K.col('#8a8e96');
  const tankM = K.toon({ color: '#c8ccd2' }); burnMats.push([tankM, '#c8ccd2']);
  for (const [x, z] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) { K.beam(K.V(x, 0, z), K.V(x * 0.8, 5.6, z * 0.8), 0.28, leg); }
  K.beam(K.V(-2, 2.5, -2), K.V(2, 2.5, 2), 0.12, leg); K.beam(K.V(2, 2.5, -2), K.V(-2, 2.5, 2), 0.12, leg);
  K.slab(-2.2, 2.2, 5.4, 5.7, -2.2, 2.2, K.col('#6a6e76'));
  const tk = K.cyl(2.6, 2.6, 4.4, tankM, 0, 5.7, 0); K.add(new THREE.ConeGeometry(2.8, 1.2, 32), steel, 0, 10.7, 0);
  K.add(new THREE.PlaneGeometry(3.2, 1.0), K.toon({ map: PR.canvasTex(256, 80, (c, w, h) => { c.fillStyle = '#c8ccd2'; c.fillRect(0, 0, w, h); c.fillStyle = '#b02a22'; c.font = 'bold 50px Poppins, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('FUEL', w / 2, h / 2); }) }), 0, 8.4, 2.62);
  // wooden hangar (burns) + barracks + tower
  const woodM = K.toon({ map: PR.canvasTex(256, 256, (c) => { c.fillStyle = '#c8a070'; c.fillRect(0, 0, 256, 256); for (let x = 0; x < 256; x += 22) { c.fillStyle = 'rgba(60,30,10,.22)'; c.fillRect(x, 0, 3, 256); } }, [4, 2]) });
  burnMats.push([woodM, '#ffffff']);
  const hg = K.group(); hg.position.set(-16, 0, -12); hg.rotation.y = 0.3;
  K.slab(-8, 8, 0, 6, -6, 6, woodM, hg); const hr = K.add(new THREE.CylinderGeometry(6.3, 6.3, 16.4, 24, 1, false, -Math.PI / 2, Math.PI), K.col('#8a8e86'), 0, 6, 0, hg); hr.rotation.z = Math.PI / 2; hr.scale.set(1, 1, 0.5);
  K.slab(-5, 5, 0, 5, 6, 6.08, K.col('#5a4a3a'), hg);
  const bk = K.group(); bk.position.set(15, 0, -8); bk.rotation.y = -0.4;
  K.slab(-6, 6, 0, 3.2, -3, 3, woodM, bk); const br = K.add(new THREE.CylinderGeometry(0.1, 4.6, 1.8, 4, 1), K.col('#6a5a50'), 0, 4.1, 0, bk); br.rotation.y = Math.PI / 4; br.scale.set(1.9, 1, 0.95);
  for (let i = 0; i < 4; i++) K.slab(-4.5 + i * 3, -3.5 + i * 3, 1.2, 2.3, 3, 3.06, K.col('#9fd0e8'), bk);
  const tw = K.group(); tw.position.set(28, 0, -26);
  for (const [x, z] of [[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]]) K.beam(K.V(x, 0, z), K.V(x * 0.7, 9, z * 0.7), 0.25, K.col('#9a7a58'), tw);
  K.slab(-1.8, 1.8, 9, 11.5, -1.8, 1.8, woodM, tw); K.slab(-1.9, 1.9, 10, 11.2, -1.9, 1.9, K.col('#9fd0e8'), tw); K.slab(-2.2, 2.2, 11.5, 11.8, -2.2, 2.2, K.col('#6a5a50'), tw);
  // parked bomber (simple twin-engine)
  const pl = K.group(); pl.position.set(-14, 0, 30); pl.rotation.y = 0.5; const olive = K.col('#6a7a4a');
  const fus = K.add(new THREE.CylinderGeometry(0.9, 0.6, 15, 16), olive, 0, 2.2, 0, pl); fus.rotation.z = Math.PI / 2;
  K.add(new THREE.SphereGeometry(0.9, 16, 12), K.col('#9fd0e8'), 7.4, 2.3, 0, pl);
  K.slab(-1.5, 1.5, 2.3, 2.6, -10, 10, olive, pl); K.slab(-7.6, -6.4, 2.4, 2.6, -3.5, 3.5, olive, pl); K.slab(-7.6, -6.6, 2.4, 5, -0.1, 0.1, olive, pl);
  for (const z of [-4, 4]) { const n = K.add(new THREE.CylinderGeometry(0.6, 0.6, 2.4, 14), K.col('#5a6a3a'), 0.8, 2.2, z, pl); n.rotation.z = Math.PI / 2; K.slab(-0.2, 0.2, 0, 2, z - 0.1, z + 0.1, K.col('#3a3a3a'), pl); }
  K.slab(5.8, 6.0, 0, 2, -0.1, 0.1, K.col('#3a3a3a'), pl);
  // test pen: bat crates + table near the tank
  for (let i = 0; i < 3; i++) { const c = PR.crate(K, 'BATS', '#7a5a3a', K.scene, [1.0, 0.7, 0.7]); c.position.set(5 + i * 1.15, 0, 6 + (i % 2) * 0.3); c.rotation.y = 0.2; }
  const cage = K.group(); cage.position.set(3.6, 0, 7.2);
  K.slab(-0.7, 0.7, 0.8, 0.86, -0.5, 0.5, K.col('#8a6a48'), cage); for (const x of [-0.65, 0.65]) for (const z of [-0.45, 0.45]) K.slab(x - 0.04, x + 0.04, 0, 0.8, z - 0.04, z + 0.04, K.col('#6a4a30'), cage);
  for (let i = 0; i < 8; i++) K.slab(-0.65 + i * 0.185, -0.63 + i * 0.185, 0.86, 1.7, 0.43, 0.47, K.col('#3a3a40'), cage);
  K.slab(-0.7, 0.7, 1.7, 1.76, -0.5, 0.5, K.col('#8a6a48'), cage);
  bat.door = K.slab(-0.7, 0.7, 0.86, 1.7, -0.47, -0.43, K.col('#4a4a50'), cage);
  // swarm of bats (point sprites with a 4-frame flap atlas)
  const atlas = document.createElement('canvas'); atlas.width = 1024; atlas.height = 256; const ag = atlas.getContext('2d'); const Pen = K.T.Pen;
  for (let i = 0; i < 4; i++) { ag.setTransform(256 / 600, 0, 0, 256 / 600, i * 256, -40); batDraw(new Pen(ag), i / 4, false, true); }
  const atex = K.P.tex(atlas);
  const N = 900, pos = new Float32Array(N * 3), sh = new Float32Array(N);
  for (let j = 0; j < N; j++) { pos[j * 3] = rnd() * 6.283; pos[j * 3 + 1] = rnd(); pos[j * 3 + 2] = rnd(); sh[j] = rnd(); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('sh', new THREE.BufferAttribute(sh, 1));
  bat.U = { t: { value: 0 }, amt: { value: 1 }, c: { value: new THREE.Vector3() }, r: { value: 6 }, h: { value: 4 }, map: { value: atex }, sz: { value: 1 } };
  bat.pts = new THREE.Points(g, new THREE.ShaderMaterial({ uniforms: bat.U, transparent: true, depthWrite: false,
    vertexShader: `uniform float t, amt, r, h, sz; uniform vec3 c; attribute float sh; varying float vF;
      void main(){ float a = position.x + t*(0.8 + sh*0.9)*(sh > .5 ? 1. : -1.); float rr = r*(0.35 + position.z*0.75);
        vec3 p = c + vec3(cos(a)*rr, (position.y-.5)*h*2. + sin(t*2.+sh*30.)*0.6, sin(a)*rr*0.8);
        vF = floor(mod(t*9. + sh*4., 4.)); vec4 mv = modelViewMatrix*vec4(p,1.); gl_Position = projectionMatrix*mv;
        gl_PointSize = step(sh, amt) * min(90., sz * 1.1 * 1920. / -mv.z * 0.55); }`,
    fragmentShader: `uniform sampler2D map; varying float vF; void main(){ vec2 uv = vec2((gl_PointCoord.x + vF)/4., 1. - gl_PointCoord.y); vec4 c = texture2D(map, uv); if (c.a < .5) discard; gl_FragColor = vec4(c.rgb, 1.); }` }));
  bat.pts.userData.ndSkip = true; bat.pts.frustumCulled = false; K.scene.add(bat.pts);
  // the office (off-set): desk, lamp, wall, window
  const of = K.group(); of.position.set(...OFF);
  K.slab(-6, 6, -0.1, 0, -6, 6, K.toon({ map: PR.canvasTex(256, 256, (c) => { c.fillStyle = '#8a5a3a'; c.fillRect(0, 0, 256, 256); for (let x = 0; x < 256; x += 32) { c.fillStyle = 'rgba(0,0,0,.2)'; c.fillRect(x, 0, 3, 256); } }, [4, 4]) }), of);
  K.slab(-6, 6, 0, 5, -3.2, -3, K.col('#d8c8a8'), of); K.slab(-1.4, 1.4, 1.6, 3.6, -3.02, -2.96, K.toon({ color: '#bfe4f4', emissive: '#5a7a8a' }), of);
  K.slab(-1.6, 1.6, 0.9, 1.0, -1.2, 0.4, K.col('#6a3a24'), of); K.slab(-1.5, 1.5, 0, 0.9, -1.1, 0.3, K.col('#5a3020'), of);
  K.cyl(0.05, 0.05, 0.5, K.col('#2a2a2a'), -1.1, 1.0, -0.8, of); K.add(new THREE.ConeGeometry(0.25, 0.25, 16, 1, true), K.toon({ color: '#3a6a3a' }), -1.1, 1.55, -0.8, of);
  K.slab(0.6, 1.2, 1.0, 1.08, -0.7, -0.4, K.col('#d0302a'), of); // stamp pad
  // flag pole outside the office window (generic, no emblem)
}

// ---------------- characters ----------------
const OFFR = { jacket: '#6a7a4a', pants: '#5a6440', boots: '#3a2a20', hat: 'cap', cap: '#5a6a3c', belt: '#4a3a2a', buttons: '#e8c45a', skin: '#f5c9a0' };
const OFFR2 = { jacket: '#7a8456', pants: '#5a6440', boots: '#3a2a20', hat: 'cap', cap: '#6a744a', moustache: '#6a4a30', build: 'stout', skin: '#e8c0a0' };
const DENT = { jacket: '#f2f2ee', pants: '#4a4f62', boots: '#2a2a2a', hat: 'hair', hair: '#8a7a6a', moustache: '#8a7a6a', buttons: '#c8c8d0', skin: '#ffe0c0' };
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
  const d = ['roost', 'tick'].includes(shotAt(f).id) ? 1.6 : 7; return FX('w' + txt + t + fs, (p) => PR.word(p, txt, t, col, fs), inFront(c, d, 0, uy), s * d / 7, { order: 9 }); };
const flameCard = (f, i, pos, s) => { const t = q(((f * 0.06 + i * 0.37) % 1), 1); return FX('fl' + t + (i % 3), (p) => flame(p, t, i % 3), [pos[0], pos[1] + 1.07 * s * 0.1, pos[2]], s, { order: 4 }); };
const batCard = (f, i, pos, s, o = {}) => { const fl = o.hang ? 0 : q(((f * 0.3 + i * 0.27) % 1), 1); return FX('b' + fl + (o.hang ? 'h' : '') + (o.tick || 0), (p) => batDraw(p, fl, o.hang, true, o.tick), pos, s, { order: 6, ...o.extra }); };
const fireSet = (f, out, k = 1) => {
  const spots = [[0, 4.5, 2.2, 3.2], [-1.8, 5, 1.2, 2.6], [1.9, 4.8, 1.0, 2.8], [0.5, 9.5, 1.4, 2.6], [-12, 0, -7, 4.6], [-19, 0, -6, 4.2], [-15, 4, -10, 3.6], [11, 0, -4, 3], [17, 0, -6, 3.2]];
  spots.slice(0, Math.round(spots.length * k)).forEach(([x, y, z, s], i) => out.push(flameCard(f, i, [x, y, z], s * (0.9 + 0.1 * Math.sin(f * 0.2 + i)))));
  for (let i = 0; i < 5; i++) { const t = q(((f / 60 + i / 5) % 1), 2); out.push(FX('sm' + t + i, (p) => smokePuff(p, t, i), [Math.sin(i * 2) * 2 - (i % 2) * 14, 9 + t * 14, -2 - (i % 2) * 8], 4 + t * 5, { order: 3 })); }
};

function actorsAt(f, T) {
  const S = shotAt(f), out = [];
  const officers = (e1, e2, look = 0.3, z0 = 9.4) => { out.push(card(T, 'o1', OFFR, fo(f, 4, { expr: e1, look, tilt: q(idle(f, 4).tilt, 1), headTilt: q(idle(f, 4).headTilt, 1) }), [2.4, 0, z0]));
    out.push(card(T, 'o2', OFFR2, fo(f, 7, { expr: e2, look: -look, tilt: q(idle(f, 7).tilt, 1) }), [5.4, 0, z0 + 0.3])); };
  switch (S.id) {
    case 'hook': case 'end': officers(f > F_AMER - 2 && S.id === 'end' ? 'shock' : 'shock', 'shock', -0.4, 9.4); break;
    case 'dentist': out.push(card(T, 'd', DENT, fo(f, 9, { expr: f > F_JAPAN ? 'grin' : 'smile', look: 0.2, tilt: q(idle(f, 9).tilt, 1), headTilt: q(idle(f, 9).headTilt, 1), wave: f > F_ATT ? 1 : undefined }), [OFF[0] + 0.2, 0, OFF[2] + 0.9])); break;
    case 'field': officers('neutral', 'smile', 0.3); break;
    case 'cage': officers(f > F_NM ? 'grin' : 'neutral', 'smile', -0.3); break;
    case 'escape': officers(f > F_ESC ? 'shock' : 'nervous', f > F_ESC + 4 ? 'shock' : 'neutral', -0.5); break;
    case 'range': officers('shock', 'shock', -0.4, 10.4); break;
  }
  return out;
}

function fxAt(f, T, cam) {
  const S = shotAt(f), out = [], push = (x) => x && out.push(x);
  if (S.id === 'hook' || S.id === 'whoosh' || S.id === 'range' || S.id === 'end') fireSet(f, out, S.id === 'whoosh' ? ramp(f, F_WHOOSH, F_BURN + 10) * 0.8 + 0.2 : 1);
  if (S.id === 'hook') { push(wordCard(f, F_1943, '1943', cam, '#f6c83a', F_FIRE - F_1943 - 3)); push(wordCard(f, F_FIRE, 'FIREBOMBS', cam, '#ff8a4a', F_BATS - F_FIRE - 2)); push(wordCard(f, F_BATS, 'ON BATS?!', cam, '#ffffff')); }
  if (S.id === 'bat') { const s = q(M.back(ramp(f, cut(1), cut(1) + 10)), 2); out.push(batCard(f, 0, inFront(cam, 2.2, 0, -0.15), 0.62 * s));
    push(wordCard(f, F_THOU, '1,000 BATS', cam, '#f6c83a', F_NAP - F_THOU - 2, 170, 0.55)); push(wordCard(f, F_NAP, 'NAPALM', cam, '#ff8a4a', 1e9, 180, 0.55)); }
  if (S.id === 'dentist') { if (f > F_DENT) out.push(batCard(f, 1, [OFF[0] + 0.85, 1.25, OFF[2] + 1.2], 0.22));
    push(wordCard(f, F_DENT, 'A DENTIST', cam, '#ffffff', F_ATT - F_DENT - 2, 170, 0.5)); push(wordCard(f, F_ATT, 'ATTICS!', cam, '#f6c83a', 1e9, 180, 0.5)); }
  if (S.id === 'stamp') { const st = f >= F_YES - 3 ? clamp((f - F_YES + 3) / 8) : 0; out.push(FX('pp' + q(st, 2), (p) => paper(p, st), inFront(cam, 2.0, 0, -0.1), 0.62, { order: 6 }));
    push(wordCard(f, F_ROOS, 'THE PRESIDENT', cam, '#ffffff', F_YES - F_ROOS - 4, 160, 0.62)); }
  if (S.id === 'field') { push(wordCard(f, F_MAY, 'MAY 1943', cam, '#f6c83a', F_NM - F_MAY - 18, 170, 0.5)); }
  if (S.id === 'cage') { push(wordCard(f, F_NM, 'NEW MEXICO', cam, '#ffffff', 1e9, 170, 0.5)); for (let i = 0; i < 3; i++) out.push(batCard(f, 10 + i, [3.2 + i * 0.4, 1.25 + (i % 2) * 0.2, 7.2], 0.16)); }
  if (S.id === 'escape') { push(wordCard(f, F_WORSE, 'UH-OH', cam, '#ff8a4a', F_ESC - F_WORSE - 2, 180, 0.5)); push(wordCard(f, F_ESC, 'ESCAPED!', cam, '#f6c83a', 1e9, 180, 0.5)); }
  if (S.id === 'roost') { for (let i = 0; i < 7; i++) { const a = i * 0.9; out.push(batCard(f, 20 + i, [Math.cos(a) * 1.3, 4.75, Math.sin(a) * 1.3], 1.0, { hang: true }));
      if (f > F_NAPP - 4 && i < 3) { const t = q(((f - F_NAPP) / 40 + i / 3) % 1, 2); out.push(FX('z' + t + i, (p) => T.fxZ(p, t), [Math.cos(a) * 1.3 - 0.4, 3.6, Math.sin(a) * 1.3 + 0.6], 0.7, { order: 7 })); } }
    push(wordCard(f, F_TANK, 'FUEL TANK', cam, '#ffffff', F_NAPP - F_TANK - 3, 170, 0.62)); push(wordCard(f, F_NAPP, 'NAP TIME', cam, '#f6c83a', 1e9, 170, 0.62)); }
  if (S.id === 'tick') { const on = Math.floor(f / 6) % 2; out.push(batCard(f, 30, inFront(cam, 2.0, 0, 0.05), 0.6, { hang: true, tick: on }));
    push(wordCard(f, A(7), 'TICK...', cam, '#ffffff', F_OUT - A(7) - 2, 180, -0.55)); push(wordCard(f, F_OUT, 'TICK!', cam, '#ff5a3a', 1e9, 200, -0.55)); }
  if (S.id === 'whoosh') { push(wordCard(f, F_WHOOSH, 'WHOOSH!', cam, '#ff8a4a', 1e9, 210, 0.45)); const t = q(ramp(f, F_WHOOSH, F_WHOOSH + 24), 2); if (t < 1) out.push(FX('kb' + t, (p) => PR.kaboom(p, t, 3), [0, 4.2, 0.5], 7, { order: 6 })); }
  if (S.id === 'range') push(wordCard(f, F_RANGE, 'OWN TEST RANGE', cam, '#f6c83a', 1e9, 160, 0.5));
  if (S.id === 'end') { push(wordCard(f, F_FIRST, 'FIRST TARGET?', cam, '#ffffff', F_AMER - F_FIRST - 2, 160, 0.42)); push(wordCard(f, F_AMER, 'AMERICA', cam, '#ff5a3a', 1e9, 200, 0.42)); }
  return out;
}

// ---------------- cameras ----------------
const CAMS = {
  hook: [{ f: 0, pos: [3.5, 1.6, 17], look: [0.4, 5.4, 0], fov: 52 }, { f: F_BATS, pos: [3.0, 1.7, 15], look: [0.3, 5.6, 0], fov: 50 }, { f: cut(1), pos: [2.8, 1.8, 14.2], look: [0.3, 5.8, 0], fov: 49 }],
  bat: [{ f: cut(1), pos: [4.4, 1.6, 12], look: [4.4, 1.6, 0], fov: 44 }, { f: F_NAP, pos: [4.4, 1.6, 11.6], look: [4.4, 1.55, 0], fov: 38 }, { f: cut(2), pos: [4.4, 1.6, 11.4], look: [4.4, 1.5, 0], fov: 36 }],
  dentist: [{ f: cut(2), pos: [OFF[0] + 0.6, 1.7, 5.6], look: [OFF[0] + 0.3, 1.45, 0.9], fov: 40 }, { f: F_JAPAN, pos: [OFF[0] + 0.5, 1.65, 4.6], look: [OFF[0] + 0.4, 1.5, 0.9], fov: 38 }, { f: cut(3), pos: [OFF[0] + 0.5, 1.6, 4.3], look: [OFF[0] + 0.45, 1.5, 0.9], fov: 36 }],
  stamp: [{ f: cut(3), pos: [OFF[0] - 0.3, 2.6, 3.0], look: [OFF[0] + 0.2, 1.0, -0.4], fov: 44 }, { f: F_YES, pos: [OFF[0] - 0.2, 2.5, 2.8], look: [OFF[0] + 0.2, 1.0, -0.4], fov: 41 }, { f: cut(4), pos: [OFF[0] - 0.2, 2.5, 2.7], look: [OFF[0] + 0.2, 1.0, -0.4], fov: 40 }],
  field: [{ f: cut(4), pos: [22, 14, 40], look: [0, 3, 0], fov: 50 }, { f: F_TEST - 4, pos: [16, 9, 30], look: [1, 3, 2], fov: 48 }],
  cage: [{ f: F_TEST - 4, pos: [4.0, 2.0, 14.5], look: [4.0, 1.4, 7], fov: 42 }, { f: cut(5), pos: [3.8, 1.8, 12.5], look: [3.6, 1.4, 7], fov: 40 }],
  escape: [{ f: cut(5), pos: [5.5, 1.3, 15], look: [3.2, 3.0, 5], fov: 50 }, { f: F_ESC, pos: [5.2, 1.4, 14.5], look: [2.6, 4.0, 3], fov: 52 }, { f: cut(6), pos: [5.0, 1.6, 14], look: [0.5, 5.6, 0], fov: 52 }],
  roost: [{ f: cut(6), pos: [-3.4, 1.4, 6.6], look: [0, 4.6, 0], fov: 50 }, { f: F_HUNG, pos: [-2.6, 1.6, 5.2], look: [0, 4.6, 0], fov: 46 }, { f: cut(7), pos: [-2.2, 1.7, 4.6], look: [0, 4.6, 0], fov: 44 }],
  tick: [{ f: cut(7), pos: [1.2, 3.0, 4.6], look: [0.4, 4.2, 0], fov: 40 }, { f: cut(8), pos: [1.1, 3.1, 4.2], look: [0.4, 4.2, 0], fov: 34 }],
  whoosh: [{ f: cut(8), pos: [6, 2.4, 20], look: [0, 6, 0], fov: 52 }, { f: F_BURN - 4, pos: [5, 2.6, 19], look: [0, 6.5, 0], fov: 52 }],
  range: [{ f: F_BURN - 4, pos: [26, 18, 46], look: [-2, 3, -4], fov: 52 }, { f: cut(9), pos: [22, 14, 40], look: [-2, 3, -4], fov: 50 }],
  end: [{ f: cut(9), pos: [3.8, 1.8, 15.6], look: [3.6, 2.4, 9], fov: 46 }, { f: F_AMER, pos: [3.6, 1.6, 17.5], look: [0.6, 5.2, 0], fov: 52 }, { f: TOTAL - 1, pos: [3.5, 1.6, 17], look: [0.4, 5.4, 0], fov: 52 }],
};
const KICKS = [{ f: F_FIRE, a: 0.03 }, { f: F_YES, a: 0.03 }, { f: F_ESC, a: 0.03 }, { f: F_WHOOSH, a: 0.05 }, { f: F_AMER, a: 0.04 }];
const camAt = (f) => { const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS });
  c.shadowAt = ['dentist', 'stamp'].includes(S.id) ? OFF : ['field', 'range'].includes(S.id) ? [0, 0, 0] : [c.look[0], 0, c.look[2]]; return c; };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => { const id = shotAt(f).id;
  if (id === 'bat') return { focus: 2.2, cinf: 12 }; if (id === 'tick') return { focus: 2.0, cinf: 12 }; if (id === 'stamp') return { focus: 2.0, cinf: 8 };
  if (id === 'dentist') return { focus: dist(Cm.pos, [OFF[0] + 0.2, 1.6, 0.9]), cinf: 10 }; if (id === 'cage') return { focus: dist(Cm.pos, [3.8, 1.4, 8]), cinf: 8 };
  return { focus: 10, cinf: 0 }; };

export default {
  TOTAL, build,
  frame(f, k) {
    const S = shotAt(f), cam = camAt(f), id = S.id;
    const burning = ['hook', 'whoosh', 'range', 'end'].includes(id);
    // swarm
    const U = bat.U; U.t.value = f / 30; bat.pts.visible = true; U.sz.value = 1;
    if (id === 'hook' || id === 'end') { U.c.value.set(0, 7, 0); U.r.value = 9; U.h.value = 4; U.amt.value = 0.8; }
    else if (id === 'escape') { const u = M.smooth(ramp(f, F_ESC - 10, cut(6))); U.c.value.set(lerp(3.6, 0, u), lerp(2.2, 5, u), lerp(7.2, 0, u)); U.r.value = lerp(1.5, 4, u); U.h.value = lerp(0.6, 1.4, u); U.amt.value = ramp(f, F_ESC - 8, F_ESC + 8) * 0.25; }
    else if (id === 'whoosh' || id === 'range') { U.c.value.set(-4, 8, -3); U.r.value = 14; U.h.value = 5; U.amt.value = 0.9; }
    else if (id === 'field') { U.amt.value = 0; }
    else bat.pts.visible = false;
    bat.door.position.y = id === 'escape' && f > F_ESC - 10 ? 1.28 + 0.9 : 1.28;
    for (const [m, c0] of burnMats) m.color.set(burning ? (id === 'whoosh' ? new K.THREE.Color(c0).lerp(new K.THREE.Color('#5a4038'), ramp(f, F_WHOOSH, F_RANGE) * 0.7) : new K.THREE.Color(c0).lerp(new K.THREE.Color('#5a4038'), 0.7)) : c0);
    const light = ['dentist', 'stamp'].includes(id) ? { ...OFFICE } : burning ? { ...FIRE } : { ...DAY };
    if (id === 'field' || id === 'range') light.shadowExt = 60;
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
  },
};
