// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Dagen H" — Sweden switches to right-hand traffic, 3 Sep 1967, Stockholm. Timed via dagenh_timing.js.
import { TOTAL, LINES, wf } from './dagenh_timing.js';
import * as PR from '../props.js';
import { INK } from '../toon.js';
import { camFromKeys, M, clamp, ramp, lerp, idle, blinkAt, q } from '../motion.js';

const L = LINES, A = (i) => L[i][0], cut = (i) => Math.max(0, A(i) - 4);
const W = wf;
const F_5 = W(0, '5'), F_SW = W(0, 'switched'), F_1967 = W(1, '1967'), F_STOP = W(1, 'stopped'), F_CREPT = W(1, 'crept'), F_WAIT = W(1, 'waited'),
  F_LEFT = W(2, 'left'), F_BUILT = W(2, 'built'), F_RIGHT = W(2, 'right'), F_1955 = W(3, '1955'), F_83 = W(3, '83'), F_AGAINST = W(3, 'against'),
  F_GOV = W(4, 'government'), F_ANY = W(4, 'anyway'), F_WORSE = W(5, 'worse'), F_360 = W(5, '360000'), F_FLIP = W(5, 'flip'), F_DAY = W(5, 'day'),
  F_BUS = W(6, 'buses'), F_DOORS = W(6, 'doors'), F_POP = W(6, 'pop'), F_KEEP = W(6, 'keep'), F_EXP = W(7, 'expected'), F_INST = W(7, 'instead'), F_DOWN = W(7, 'down'),
  F_SCARED = W(8, 'scared'), F_CAREFUL = W(8, 'careful');
const F_LOOP = TOTAL - 16;
const SHOTS = [['hook', 0], ['stop', cut(1)], ['creep', F_CREPT - 4], ['built', cut(2)], ['vote', cut(3)], ['anyway', cut(4)], ['signs', cut(5)], ['bus', cut(6)], ['song', F_POP - 4],
  ['crash', cut(7)], ['news', F_INST - 4], ['driver', cut(8)], ['loop', F_LOOP]]
  .map(([id, a], i, arr) => ({ id, a, b: i + 1 < arr.length ? arr[i + 1][1] - 1 : TOTAL - 1 }));
const shotAt = (f) => SHOTS.find((s) => f >= s.a && f <= s.b) || SHOTS[SHOTS.length - 1];

const DAWN = { az: 75, el: 12, sky: '#f0d8e0', ground: '#6a6a7a', hemi: 1.05, sun: '#ffc890', sunI: 2.4, fog: '#e8c8c8', fogNear: 40, fogFar: 420,
  skyTop: '#5a78c8', skyHor: '#f8c8a8', sat: 1.14, vig: 0.26, shadowExt: 26, exposure: 1.1 };
const MORN = { ...DAWN, az: 95, el: 26, sun: '#fff0d8', sunI: 2.6, sky: '#e0ecf8', skyTop: '#3a80d8', skyHor: '#e8eef4', fog: '#dce6ee', sat: 1.12, vig: 0.22 };
let K, cars = [], signs = [], bus, busDoor;
const rnd = (() => { let s = 1967; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();
const txtTex = (w, h, bg, fg, lines, font = 'bold 64px Georgia, serif') => PR.canvasTex(w, h, (g) => { g.fillStyle = bg; g.fillRect(0, 0, w, h); g.fillStyle = fg; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
  lines.forEach((t, i) => g.fillText(t, w / 2, h * (i + 1) / (lines.length + 1))); });
const plane = (w, h, map, x, y, z, ry = 0, parent = K.scene) => { const m = K.add(new K.THREE.PlaneGeometry(w, h), K.toon({ map, kind: 'wood', amt: 0.15, plain: true }), x, y, z, parent, { cast: false }); m.rotation.y = ry; return m; };
const hTex = () => PR.canvasTex(256, 256, (g) => { g.fillStyle = '#f2c81a'; g.fillRect(0, 0, 256, 256); g.strokeStyle = '#1a1a1a'; g.lineWidth = 10; g.strokeRect(8, 8, 240, 240);
  g.fillStyle = '#1a1a1a'; g.fillRect(60, 50, 34, 156); g.fillRect(162, 50, 34, 156); g.fillRect(60, 110, 136, 32); g.beginPath(); g.moveTo(196, 126); g.lineTo(150, 80); g.lineTo(150, 172); g.fill(); });

// car lanes: left lane x=-2 (old), right lane x=+2 (new); cars face -z
const CARS = [[-2, -6], [-2, -16], [-2, -27], [-2, -40], [-2, 6], [2.2, -11], [2.2, -22], [2.2, -34]].map(([x, z], i) => ({ x, z, dir: x < 0 ? 1 : -1, i }));
const carX = (c, f) => { const t = M.smooth(ramp(f, F_CREPT - 6 + c.i * 2, F_CREPT + 24 + c.i * 2)); return c.dir > 0 ? lerp(-2, 2, t) : lerp(2.2, -2.2, t); };

function build(k) {
  K = k; const { THREE } = K;
  K.addClouds(10, 700, 160);
  const asphalt = K.mat('grime', '#4a4a50', { detail: 1.5, amt: 0.25, grime: 0.3 }), curb = K.mat('rock', '#a8a8a8', { detail: 0.8 }), pave = K.mat('rock', '#b8b0a8', { detail: 0.6 });
  K.slab(-5, 5, -0.05, 0, -260, 40, asphalt, K.scene, false);
  K.slab(-0.12, 0.12, 0, 0.012, -260, 40, K.mat('grime', '#f2e8c8', { plain: true }), K.scene, false);
  for (let z = -255; z < 40; z += 6) for (const x of [-2.1, 2.1]) { } // (no dashed lines: changed overnight)
  for (const s of [-1, 1]) { K.slab(s * 5, s * 9, 0, 0.18, -260, 40, pave, K.scene, false); K.slab(s * 5 - 0.12, s * 5 + 0.12, 0, 0.2, -260, 40, curb, K.scene, false); }
  // facades both sides
  const cols = ['#c86a4a', '#e8c88a', '#a8b8c8', '#d8a080', '#c8c0a8', '#e0b0a0'];
  for (const s of [-1, 1]) for (let i = 0; i < 18; i++) { const h = 12 + (i * 7 % 5) * 2, w = 12, z = 30 - i * w;
    const tex = PR.facadeTex(cols[(i + (s > 0 ? 2 : 0)) % 6], 3, Math.round(h / 3.4), i * 7 + (s > 0 ? 3 : 0), '#f2ead8');
    const b = K.slab(s * 9, s * 17, 0, h, z - w, z, K.toon({ map: tex, kind: 'plaster', amt: 0.2 })); K.slab(s * 9 - s * 0.3, s * 17, h, h + 0.6, z - w, z, K.mat('metal', '#5a6a7a'));
    if (i % 3 === 0) K.slab(s * 9 - s * 0.6, s * 9, 0.2, 3.0, z - w + 1, z - 1, K.mat('wood', ['#2a5a8a', '#8a2a2a', '#2a6a4a'][i % 3])); }
  // shop signs
  plane(4, 0.9, txtTex(512, 110, '#1e3a6a', '#f2e8c8', ['KONDITORI']), -8.98, 3.6, -4, Math.PI / 2);
  plane(4, 0.9, txtTex(512, 110, '#7a1e1e', '#f2e8c8', ['TOBAK · TIDNINGAR'], 'bold 52px Georgia, serif'), 8.98, 3.6, -14, -Math.PI / 2);
  // street lamps + trees
  for (let z = 20; z > -200; z -= 14) for (const s of [-1, 1]) { K.cyl(0.07, 0.09, 5.2, K.mat('metal', '#3a4048'), s * 5.6, 0, z); K.slab(s * 5.6 - s * 1.2, s * 5.6, 5.1, 5.25, z - 0.1, z + 0.1, K.mat('metal', '#3a4048'));
    K.add(new THREE.SphereGeometry(0.2, 10, 8), new THREE.MeshBasicMaterial({ color: '#fff0c8' }), s * 4.5, 5.0, z, K.scene, { cast: false }); }
  // the big Dagen H signs at the roadside (yellow H with arrow)
  const ht = hTex();
  for (const [x, z] of [[-6.2, -2], [6.2, -18], [-6.2, -36]]) { K.cyl(0.06, 0.06, 2.4, K.mat('metal', '#8a8a90'), x, 0, z); K.add(new THREE.PlaneGeometry(1.2, 1.2), K.toon({ map: ht, plain: true }), x, 2.9, z + 0.05, K.scene, { cast: false }); }
  // road signs that get flipped (arrow keep-left → keep-right)
  const arrow = (right) => PR.canvasTex(256, 256, (g) => { g.fillStyle = '#1e5ab8'; g.beginPath(); g.arc(128, 128, 120, 0, 7); g.fill(); g.strokeStyle = '#fff'; g.lineWidth = 12; g.beginPath(); g.arc(128, 128, 112, 0, 7); g.stroke();
    g.fillStyle = '#fff'; g.save(); g.translate(128, 128); g.rotate(right ? -Math.PI / 4 : Math.PI / 4 + Math.PI); g.fillRect(-14, -10, 28, 80); g.beginPath(); g.moveTo(-44, -10); g.lineTo(44, -10); g.lineTo(0, -64); g.fill(); g.restore(); });
  const aL = arrow(false), aR = arrow(true);
  for (const [x, z] of [[-0.4, -60], [-6.4, -64], [6.4, -70]]) { K.cyl(0.06, 0.06, 2.4, K.mat('metal', '#8a8a90'), x, 0, z); const g = K.group(); g.position.set(x, 2.9, z);
    K.add(new THREE.CircleGeometry(0.55, 32), K.toon({ map: aL, plain: true }), 0, 0, 0.03, g, { cast: false }); const b = K.add(new THREE.CircleGeometry(0.55, 32), K.toon({ map: aR, plain: true }), 0, 0, -0.03, g, { cast: false }); b.rotation.y = Math.PI; signs.push(g); }
  // cars
  const cc = ['#d03a2a', '#2a6ad0', '#f0c030', '#2aa060', '#e8e4dc', '#8a3ad0', '#e88a2a', '#5aa0c8'];
  CARS.forEach((c, i) => { const s = PR.sedan(K, cc[i]); s.root.rotation.y = c.dir > 0 ? Math.PI / 2 : -Math.PI / 2; s.root.position.set(c.x, 0, c.z); s.root.scale.setScalar(0.8); cars.push(s.root); });
  // bus with doors on both sides (at a stop on the right)
  bus = K.group(); bus.position.set(2.4, 0, -84); const bm = K.mat('metal', '#d84a2a', { roughness: 0.5 });
  K.slab(-1.3, 1.3, 0.4, 3.2, -6, 6, bm, bus); K.slab(-1.32, 1.32, 1.7, 2.6, -5.5, 5.5, K.col('#9fd0e8'), bus); K.slab(-1.32, 1.32, 3.2, 3.4, -6, 6, K.mat('metal', '#f2ece0'), bus);
  busDoor = K.slab(1.31, 1.36, 0.45, 2.9, -4.6, -3.4, K.mat('metal', '#f2ece0'), bus); K.slab(-1.36, -1.31, 0.45, 2.9, -4.6, -3.4, K.mat('metal', '#f2ece0'), bus);
  for (const z of [-4, 4]) for (const s of [-1, 1]) K.add(new THREE.CylinderGeometry(0.5, 0.5, 0.3, 18).rotateZ(Math.PI / 2), K.col('#2b2e36'), s * 1.25, 0.5, z, bus);
  plane(2.0, 0.5, txtTex(256, 64, '#1a1a1a', '#ffd040', ['47 CENTRUM'], 'bold 40px sans-serif'), 0, 3.0, -6.02, Math.PI, bus);
  K.slab(5.6, 7.5, 0.18, 2.6, -88, -86, K.mat('metal', '#3a5a7a')); plane(1.2, 0.5, txtTex(256, 100, '#f2c81a', '#1a1a1a', ['BUSS'], 'bold 64px sans-serif'), 6.5, 2.9, -85.95);
  // a voting booth corner / ballot table on the sidewalk (vote shot) near z=-110 left
  K.slab(-8.6, -6.4, 0.18, 1.0, -112, -110.8, K.mat('wood', '#7a5234')); K.slab(-7.9, -7.1, 1.0, 1.7, -111.8, -111.0, K.mat('wood', '#3a2a1e'));
  K.slab(-7.6, -7.4, 1.69, 1.71, -111.5, -111.3, K.col('#1a1a1a'));
  plane(2.6, 0.7, txtTex(512, 120, '#1e3a6a', '#f2e8c8', ['FOLKOMRÖSTNING 1955'], 'bold 46px Georgia, serif'), -7.5, 2.4, -112.2);
  // podium for the government man (z=-130 right)
  K.slab(6.0, 8.0, 0.18, 1.0, -132, -130.5, K.mat('wood', '#5a3a24')); plane(2.4, 0.6, txtTex(512, 120, '#1e3a6a', '#f2d890', ['REGERINGEN'], 'bold 60px Georgia, serif'), 7.0, 0.6, -130.45);
}

// ---------------- 2D ----------------
const diagram = (p, t) => { p.poly([[40, 160], [560, 160], [560, 860], [40, 860]], '#3a3a40', 10); p.stroke([[300, 180], [300, 840]], 10, '#f2e8c8');
  p.g.fillStyle = '#f2e8c8'; p.g.font = 'bold 42px Poppins, sans-serif'; p.g.textAlign = 'center'; p.g.fillText('VÄNSTER', 170, 230);
  // car top-down in the left lane, steering wheel on its left
  const cx = 170, cy = 560; p.poly([[cx - 70, cy - 150], [cx + 70, cy - 150], [cx + 70, cy + 150], [cx - 70, cy + 150]], '#d03a2a', 8); p.poly([[cx - 55, cy - 90], [cx + 55, cy - 90], [cx + 55, cy - 20], [cx - 55, cy - 20]], '#9fd0e8', 5);
  p.ell(cx - 30, cy + 10, 26, 26, 'rgba(0,0,0,0)', 8); p.stroke([[cx - 56, cy + 10], [cx - 4, cy + 10]], 6, INK);
  if (t > 0) { p.g.globalAlpha = t; p.stroke([[cx - 30, cy + 60], [cx - 30, cy + 300]], 10, '#ffd040'); p.g.fillStyle = '#ffd040'; p.g.font = 'bold 38px Poppins, sans-serif'; p.g.fillText('WHEEL ON', 340, 650); p.g.fillText('THE LEFT?!', 340, 700); p.g.globalAlpha = 1; } };
const pie = (p, t) => { p.ell(300, 500, 230, 230, '#e8e4dc', 14); const a = t * 0.83 * Math.PI * 2; p.g.fillStyle = '#d03a2a'; p.g.beginPath(); p.g.moveTo(300, 500); p.g.arc(300, 500, 222, -Math.PI / 2, -Math.PI / 2 + a); p.g.fill();
  p.g.fillStyle = '#fff'; p.g.font = 'bold 110px Poppins, sans-serif'; p.g.textAlign = 'center'; p.g.lineWidth = 16; p.g.strokeStyle = INK; p.g.strokeText('NEJ', 300, 540); p.g.fillText('NEJ', 300, 540); };
const stampCard = (p, t) => { p.poly([[60, 240], [540, 240], [540, 800], [60, 800]], '#f6f0e0', 10); p.g.fillStyle = INK; p.g.font = 'bold 44px Georgia, serif'; p.g.textAlign = 'center'; p.g.fillText('HÖGERTRAFIK', 300, 330);
  for (let i = 0; i < 6; i++) p.g.fillRect(110, 400 + i * 40, 380 - (i % 2) * 60, 10);
  if (t > 0) { const s = 1 + 1.4 * (1 - t); p.g.save(); p.g.translate(300, 600); p.g.scale(s, s); p.g.rotate(-0.15); p.g.globalAlpha = Math.min(1, t * 1.5); p.g.strokeStyle = '#1a8a3a'; p.g.lineWidth = 14; p.g.strokeRect(-170, -70, 340, 140);
    p.g.fillStyle = '#1a8a3a'; p.g.font = 'bold 110px Georgia, serif'; p.g.fillText('JA', 0, 38); p.g.restore(); } };
const record = (p, t) => { p.ell(300, 500, 240, 240, '#1a1a1e', 10); for (let r = 90; r < 230; r += 22) p.ell(300, 500, r, r, 'rgba(0,0,0,0)', 2);
  p.g.save(); p.g.translate(300, 500); p.g.rotate(t * 6); p.ell(0, 0, 80, 80, '#f2c81a', 0); p.g.fillStyle = INK; p.g.font = 'bold 22px Poppins'; p.g.textAlign = 'center'; p.g.fillText('HÅLL DIG', 0, -10); p.g.fillText('TILL HÖGER', 0, 18); p.g.restore(); p.ell(300, 500, 10, 10, '#e8e4dc', 0); };
const paper = (p) => { p.poly([[50, 200], [550, 200], [550, 840], [50, 840]], '#f4f0e6', 10); p.g.fillStyle = INK; p.g.textAlign = 'center'; p.g.font = 'bold 40px Georgia, serif'; p.g.fillText('DAGENS NYHETER', 300, 270);
  p.g.fillRect(80, 290, 440, 6); p.g.font = 'bold 84px Georgia, serif'; p.g.fillStyle = '#1a6a3a'; p.g.fillText('FEWER', 300, 400); p.g.fillText('CRASHES!', 300, 490); p.g.fillStyle = '#8a8a8a'; for (let i = 0; i < 7; i++) p.g.fillRect(90, 560 + i * 34, 420 - (i % 3) * 50, 12); };
const wheel = (p) => { p.ell(300, 620, 270, 270, 'rgba(0,0,0,0)', 0); p.g.strokeStyle = INK; p.g.lineWidth = 56; p.g.beginPath(); p.g.arc(300, 620, 240, 0, 7); p.g.stroke(); p.g.strokeStyle = '#3a3a42'; p.g.lineWidth = 36; p.g.beginPath(); p.g.arc(300, 620, 240, 0, 7); p.g.stroke();
  p.stroke([[60, 620], [540, 620]], 30, INK); p.stroke([[300, 620], [300, 860]], 30, INK); p.ell(300, 620, 60, 60, '#5a5a62', 10); for (const x of [70, 530]) p.ell(x, 600, 40, 50, '#f5c9a0', 8); };
const sweat = (p, t) => { for (let i = 0; i < 3; i++) { const u = (t + i / 3) % 1; p.ell(380 + i * 30, 300 + u * 120, 14, 20, '#9fd4ff', 5); } };

// ---------------- characters ----------------
const COP = { jacket: '#2a3a5a', pants: '#2a3a5a', boots: INK, hat: 'cap', cap: '#f2f0ea', buttons: '#e8c45a', skin: '#f5d0b4' };
const DRV = { jacket: '#c8a050', pants: '#3b3f52', boots: '#3a2a20', hat: 'hair', hair: '#e8d090', skin: '#f5d0b4' };
const GOVM = { jacket: '#2a2a34', pants: '#2a2a34', boots: INK, hat: 'hair', hair: '#8a8a8a', skin: '#f6dcc4', build: 'stout' };
const WORK = { jacket: '#e8862a', pants: '#3a4a6a', boots: '#3a2a20', hat: 'cap', cap: '#f2c81a', skin: '#f5c9a0' };
const VOTER = (v) => ({ jacket: ['#5a6a8a', '#8a5a4a', '#4a7a5a', '#7a5a8a'][v % 4], pants: '#3b3f52', boots: '#3a2a20', hat: v % 2 ? 'hair' : 'cap', hair: ['#e8d090', '#6a4a30'][v % 2], cap: '#3a3a42', dress: v % 2 ? ['#c86a5a', '#5a8ac8'][v % 2] : undefined, skin: '#f5d0b4' });
const LIGHT2D = -2.1;
const fo = (f, seed, o) => ({ mode: 'stand', light: LIGHT2D, seed, blink: blinkAt(f, seed), tilt: q(idle(f, seed).tilt, 1), headTilt: q(idle(f, seed).headTilt, 1), ...o });
const card = (T, key, o, opts, pos, extra = {}) => ({ key: key + JSON.stringify(opts), draw: (p) => T.bodyFront(p, o, opts), x: pos[0], y: pos[1], z: pos[2], ...extra });
const FX = (key, draw, pos, s, extra = {}) => ({ key, draw, x: pos[0], y: pos[1] - 1.07 * s, z: pos[2], s, blob: false, shadow: false, order: 5, ...extra });
const inFront = (c, d, ux, uy) => {
  const V = K.THREE.Vector3, p = new V(...c.pos), dir = new V(...c.look).sub(p).normalize(), right = new V().crossVectors(dir, new V(0, 1, 0)).normalize(), up = new V().crossVectors(right, dir);
  const h = d * Math.tan(c.fov * Math.PI / 360); return p.addScaledVector(dir, d).addScaledVector(right, ux * h).addScaledVector(up, uy * h).toArray();
};
const wordCard = (f, f0, txt, c, col = '#f6c83a', dur = 1e9, size = 170, uy = 0.42, d = 1.4) => { if (f < f0 - 1 || f > f0 + dur) return null; const t = q(Math.min(1, (f - f0 + 1) / 12));
  const r = Math.min(1, 400 / (0.7 * size * txt.length)), fs = size * r, s = Math.min(2.5, 1.25 / r);
  return FX('w' + txt + t + fs, (p) => PR.word(p, txt, t, col, fs), inFront(c, d, 0, uy), s * d / 7, { order: 9 }); };

function actorsAt(f, T) {
  const S = shotAt(f), id = S.id, out = [];
  const crowd = (z0, n = 5, e = 'shock') => { for (let i = 0; i < n; i++) out.push(card(T, 'cw' + i, VOTER(i), fo(f, 40 + i, { expr: e, look: 0.4 }), [-6.0 - (i % 2) * 0.9, 0.18, z0 - i * 1.1], { s: 0.95 })); };
  switch (id) {
    case 'hook': case 'loop': out.push(card(T, 'cop', COP, fo(f, 3, { expr: 'stern', look: -0.3, wave: Math.sin(f * 0.3) }), [-0.2, 0, 1.5])); crowd(-1.5, 4); break;
    case 'stop': case 'creep': out.push(card(T, 'cop', COP, fo(f, 3, { expr: id === 'creep' ? 'nervous' : 'stern', look: 0.4, wave: id === 'stop' ? 0 : Math.sin(f * 0.3) }), [-0.2, 0, 1.5])); crowd(-1.5, 4, id === 'creep' ? 'nervous' : 'shock'); break;
    case 'vote': for (let i = 0; i < 4; i++) out.push(card(T, 'v' + i, VOTER(i), fo(f, 50 + i, { expr: f > F_83 ? (i % 2 ? 'stern' : 'pained') : 'neutral', look: 0.3 - i * 0.2 }), [-7.4 + i * 0.85, 0.18, -108.8 + (i % 2) * 0.4])); break;
    case 'anyway': out.push(card(T, 'gv', GOVM, fo(f, 13, { expr: f > F_ANY - 4 ? 'grin' : 'stern', look: -0.2, prop: ['x', f > F_ANY - 2 && f < F_ANY + 8 ? 0.0 : 0.5] }), [7.0, 0.18, -131.4])); break;
    case 'signs': for (let i = 0; i < 2; i++) out.push(card(T, 'wk' + i, { ...WORK, jacket: ['#e8862a', '#d8662a'][i] }, fo(f, 60 + i, { expr: f > F_FLIP ? 'grin' : 'nervous', look: 0.3, prop: ['x', 0.2] }), [[0.6, -5.4][i], 0, [-59.2, -63.2][i]])); break;
    case 'bus': case 'song': for (let i = 0; i < 3; i++) out.push(card(T, 'bp' + i, VOTER(i + 1), fo(f, 70 + i, { expr: id === 'song' ? 'laugh' : 'smile', look: -0.4, mode: id === 'song' ? 'march' : 'stand', phase: q((f / 20 + i * 0.3) % 1, 2) }), [5.6 + i * 0.7, 0.18, -82.2 - i * 0.6])); break;
    case 'crash': crowd(-1.5, 5, f > F_EXP + 6 ? 'nervous' : 'shock'); out.push(card(T, 'cop', COP, fo(f, 3, { expr: 'nervous', look: 0.2 }), [-0.2, 0, 1.5])); break;
    case 'driver': out.push(card(T, 'dr', DRV, fo(f, 9, { expr: f > F_CAREFUL ? 'nervous' : 'shock', look: 0.0, mode: 'sit' }), [0, 0.3, 0.6])); break;
  }
  return out;
}

function fxAt(f, T, cam) {
  const S = shotAt(f), id = S.id, out = [], push = (x) => x && out.push(x);
  if (id === 'hook') { push(wordCard(f, F_5, '5:00 AM', cam, '#f6c83a', F_SW - F_5 - 3, 200, 0.6, 2.4)); push(wordCard(f, F_SW, 'SWITCH SIDES!', cam, '#ffffff', 1e9, 180, 0.6, 2.4)); }
  if (id === 'stop') { push(wordCard(f, F_1967, 'SWEDEN, 1967', cam, '#f6c83a', F_STOP - F_1967 - 3, 180, 0.62, 2.4)); push(wordCard(f, F_STOP, 'STOP!', cam, '#ff5a3a', 1e9, 220, 0.62, 2.4)); }
  if (id === 'creep') push(wordCard(f, F_WAIT, 'WAIT...', cam, '#ffffff', 1e9, 200, 0.62, 2.4));
  if (id === 'built') { const t = q(ramp(f, F_BUILT - 4, F_BUILT + 8), 2); out.push(FX('dg' + t, (p) => diagram(p, t), inFront(cam, 1.3, 0, -0.06), 0.34, { order: 7 })); }
  if (id === 'vote') { const t = q(M.smooth(ramp(f, F_83 - 2, F_83 + 14)), 2); out.push(FX('pi' + t, (p) => pie(p, t), inFront(cam, 1.5, 0.3, 0.25), 0.22, { order: 7 })); push(wordCard(f, F_1955, '1955', cam, '#ffffff', F_83 - F_1955 - 3, 200, 0.62, 1.5));
    push(wordCard(f, F_83, '83% SAID NO', cam, '#ff5a3a', 1e9, 180, 0.66, 1.5)); }
  if (id === 'anyway') { const t = f > F_ANY ? q(Math.min(1, (f - F_ANY) / 6), 2) : 0; out.push(FX('sc' + t, (p) => stampCard(p, t), inFront(cam, 1.3, -0.25, -0.05), 0.24, { order: 7 })); push(wordCard(f, F_ANY, 'DID IT ANYWAY', cam, '#f6c83a', 1e9, 170, 0.65, 1.5)); }
  if (id === 'signs') { push(wordCard(f, F_WORSE, 'IT GETS WORSE', cam, '#ff7a3a', F_360 - F_WORSE - 3, 170, 0.6, 2)); push(wordCard(f, F_360, '360,000 SIGNS', cam, '#f6c83a', F_DAY - F_360 - 2, 180, 0.6, 2)); push(wordCard(f, F_DAY, 'IN ~1 DAY', cam, '#ffffff', 1e9, 200, 0.6, 2)); }
  if (id === 'bus') push(wordCard(f, F_DOORS, 'NEW DOORS', cam, '#f6c83a', 1e9, 190, 0.6, 2));
  if (id === 'song') { out.push(FX('rc' + q((f % 60) / 60, 2), (p) => record(p, f / 30), inFront(cam, 1.5, 0.35, 0.18), 0.2, { order: 7 }));
    for (let i = 0; i < 3; i++) { const t = ((f / 24) + i / 3) % 1; out.push(FX('nt' + i + q(t, 2), (p) => T.fxNote(p, i % 2 ? 'eighth' : 'quarter', '#1f2a44'), [6.3 + i * 0.5 + t * 0.3, 2.0 + t * 1.2, -82.4], 0.35, { order: 6, alpha: 1 - t })); }
    push(wordCard(f, F_KEEP, 'KEEP RIGHT, SVENSSON!', cam, '#f6c83a', 1e9, 150, 0.62, 2)); }
  if (id === 'crash') push(wordCard(f, F_EXP, 'CHAOS?', cam, '#ff5a3a', 1e9, 210, 0.62, 2.4));
  if (id === 'news') { out.push(FX('np', paper, inFront(cam, 1.3, 0, -0.04), 0.34, { order: 7, roll: -0.04 })); push(wordCard(f, F_DOWN, 'CRASHES DOWN', cam, '#9ad04a', 1e9, 180, 0.66, 1.3)); }
  if (id === 'driver') { out.push(FX('wh', wheel, inFront(cam, 1.0, 0, -0.42), 0.24, { order: 8, roll: 0.05 * Math.sin(f * 0.5) })); if (f > F_SCARED) out.push(FX('sw' + q((f % 20) / 20, 2), (p) => sweat(p, (f % 20) / 20), [0.0, 1.0, 0.75], 0.5, { order: 6 }));
    push(wordCard(f, F_SCARED, 'SCARED =', cam, '#ffffff', F_CAREFUL - F_SCARED - 2, 190, 0.65, 1.6)); push(wordCard(f, F_CAREFUL, 'CAREFUL!', cam, '#9ad04a', 1e9, 210, 0.65, 1.6)); }
  return out;
}

// ---------------- cameras ----------------
const CAMS = {
  hook: [{ f: 0, pos: [1.6, 4.2, 9.5], look: [0, 0.8, -12], fov: 50 }, { f: F_SW, pos: [1.2, 3.0, 7.0], look: [0, 1.0, -10], fov: 48, ease: 'easeOut' }, { f: cut(1), pos: [1.1, 2.8, 6.6], look: [0, 1.0, -10], fov: 47 }],
  stop: [{ f: cut(1), pos: [-3.6, 0.6, 2.0], look: [-2, 0.8, -8], fov: 46 }, { f: F_STOP, pos: [-3.4, 0.7, 1.0], look: [-2, 0.8, -8], fov: 44 }, { f: F_CREPT - 4, pos: [-3.3, 0.7, 0.6], look: [-2, 0.8, -8], fov: 44 }],
  creep: [{ f: F_CREPT - 4, pos: [0, 14, 6], look: [0, 0, -14], fov: 50 }, { f: cut(2), pos: [0, 12, 3], look: [0, 0, -14], fov: 48 }],
  built: [{ f: cut(2), pos: [-2.0, 1.4, -30], look: [-2.0, 1.0, -40], fov: 46 }, { f: cut(3), pos: [-2.0, 1.3, -31.5], look: [-2.0, 1.0, -40], fov: 44 }],
  vote: [{ f: cut(3), pos: [-6.6, 1.6, -103.5], look: [-6.4, 1.3, -109], fov: 46 }, { f: F_83, pos: [-6.6, 1.5, -104.5], look: [-6.4, 1.3, -109], fov: 42, ease: 'easeOut' }],
  anyway: [{ f: cut(4), pos: [5.6, 1.6, -127.2], look: [6.8, 1.4, -131.4], fov: 44 }, { f: cut(5), pos: [5.8, 1.6, -127.8], look: [6.8, 1.4, -131.4], fov: 42 }],
  signs: [{ f: cut(5), pos: [2.4, 1.6, -53], look: [-1.5, 2.0, -62], fov: 48 }, { f: F_FLIP, pos: [0.9, 2.3, -56.4], look: [-0.4, 2.6, -60], fov: 44 }, { f: cut(6), pos: [0.8, 2.3, -56.8], look: [-0.4, 2.6, -60], fov: 43 }],
  bus: [{ f: cut(6), pos: [-2.0, 1.8, -72], look: [3.5, 1.6, -84], fov: 48 }, { f: F_POP - 4, pos: [-1.0, 1.8, -74], look: [3.8, 1.6, -84], fov: 46 }],
  song: [{ f: F_POP - 4, pos: [4.2, 1.7, -78.2], look: [6.2, 1.5, -82.6], fov: 44 }, { f: cut(7), pos: [4.4, 1.7, -78.6], look: [6.2, 1.5, -82.6], fov: 42 }],
  crash: [{ f: cut(7), pos: [-3.8, 1.6, 3.6], look: [-6.2, 1.4, -2.5], fov: 46 }, { f: F_INST - 4, pos: [-4.2, 1.6, 2.8], look: [-6.4, 1.4, -2.5], fov: 44 }],
  news: [{ f: F_INST - 4, pos: [3.0, 1.6, -8], look: [7.0, 1.6, -14], fov: 44 }, { f: cut(8), pos: [3.2, 1.6, -8.4], look: [7.0, 1.6, -14], fov: 42 }],
  driver: [{ f: cut(8), pos: [0, 1.25, 2.6], look: [0, 1.05, 0.6], fov: 44 }, { f: F_LOOP, pos: [0, 1.2, 2.2], look: [0, 1.05, 0.6], fov: 42 }],
  loop: [{ f: F_LOOP, pos: [1.5, 3.9, 9.0], look: [0, 0.8, -12], fov: 50 }, { f: TOTAL - 1, pos: [1.6, 4.2, 9.5], look: [0, 0.8, -12], fov: 50 }],
};
const KICKS = [{ f: F_SW, a: 0.03 }, { f: F_STOP, a: 0.04 }, { f: F_83, a: 0.03 }, { f: F_ANY, a: 0.04 }, { f: F_360, a: 0.03 }, { f: F_INST, a: 0.03 }, { f: F_CAREFUL, a: 0.03 }];
const camAt = (f) => { const S = shotAt(f), c = camFromKeys(CAMS[S.id], f, { creep: 0.0012, kicks: KICKS }); c.shadowAt = [c.look[0], 0, c.look[2]]; return c; };
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const dofAt = (f, Cm) => { const id = shotAt(f).id;
  if (id === 'vote') return { focus: dist(Cm.pos, [-6.4, 1.3, -108.8]), cinf: 9 };
  if (id === 'anyway') return { focus: dist(Cm.pos, [7, 1.3, -131.4]), cinf: 10 };
  if (id === 'song') return { focus: dist(Cm.pos, [6.2, 1.3, -82.6]), cinf: 9 };
  if (id === 'driver') return { focus: dist(Cm.pos, [0, 1.1, 0.6]), cinf: 12 };
  if (id === 'built' || id === 'news') return { focus: 1.3, cinf: 16 };
  return { focus: 10, cinf: 0 }; };

export default {
  TOTAL, build, look: 'rich',
  frame(f, k) {
    const S = shotAt(f), cam = camAt(f), id = S.id;
    // cars: frame 0 shows the switch mid-way (payoff), later shots follow the story
    CARS.forEach((c, j) => { const m = cars[j]; let x;
      if (id === 'hook' || id === 'loop') x = c.dir > 0 ? lerp(-2, 2, 0.45 + 0.1 * Math.sin(f * 0.05 + j)) : lerp(2.2, -2.2, 0.45);
      else if (id === 'stop') x = c.dir > 0 ? -2 : 2.2; else if (id === 'creep') x = carX(c, f); else x = c.dir > 0 ? 2 : -2.2;
      m.position.x = x; m.rotation.y = (c.dir > 0 ? Math.PI / 2 : -Math.PI / 2) + (id === 'creep' || id === 'hook' || id === 'loop' ? -0.55 * c.dir * Math.sin(Math.PI * clamp(id === 'creep' ? ramp(f, F_CREPT - 6 + j * 2, F_CREPT + 24 + j * 2) : 0.5)) : 0);
      const roll = id === 'stop' ? 0 : (id === 'built' ? 0 : 0); m.position.z = c.z - (id === 'stop' && j !== 4 ? Math.max(0, F_STOP - f) * 0.15 : 0); m.visible = !(id === 'stop' && j === 4); });
    signs.forEach((g, i) => { g.rotation.y = id === 'signs' ? Math.PI * M.back(ramp(f, F_FLIP - 6 + i * 4, F_FLIP + 8 + i * 4)) : 0; });
    bus.visible = ['bus', 'song'].includes(id); busDoor.position.z = id === 'bus' ? -1.5 * M.smooth(ramp(f, F_DOORS - 4, F_DOORS + 8)) : 0;
    const light = ['hook', 'stop', 'creep', 'loop', 'crash'].includes(id) ? { ...DAWN } : { ...MORN };
    if (id === 'creep') light.shadowExt = 30;
    return { light, cam, dof: dofAt(f, cam), actors: actorsAt(f, k.T), fx: fxAt(f, k.T, cam) };
  },
};
