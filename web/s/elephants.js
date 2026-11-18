// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "21 elephants test the Brooklyn Bridge" (story, inspired by the May 1884 elephant parade over the new bridge).
// Sunset bridge deck with stone towers + humming cables, a riverbank crowd, Jumbo's stomp.
import { TOTAL, LINES, wf } from './elephants_timing.js';
import * as PR from '../props.js';
import * as X from './kit3d.js';
import { blinkAt } from '../motion.js';
const { M, clamp, lerp, q } = X;

export { TOTAL };
const L = LINES, cut = (i) => Math.max(0, L[i][0] - 4), W = wf;
let K, wob, SHOW, COP, LADY, GENT, BOY, CROWD = [], ELE = [], SUSP = [], poster;

const SHOW_O = { jacket: '#b8322a', pants: '#1e1e26', boots: '#141018', hat: 'tophat', hatColor: '#1a1a22', moustache: '#3a2418', vest: '#e8b84a', bowtie: '#1a1a22', gloves: '#f6f2ea', collar: '#f6f2ea', skin: '#f2cfae' };
const COP_O = { jacket: '#22305a', pants: '#22305a', boots: '#111', hat: 'police', badge: true, tie: '#111', belt: '#3a2a1a', moustache: '#6a4a2a', skin: '#e8c4a0' };
const LADY_O = { jacket: '#8a5aa8', dress: '#8a5aa8', pants: '#6a4a88', boots: '#3a2430', hairStyle: 'bun', hair: '#8a4a2a', scarf: '#f2c84a', glasses: true, skin: '#f6d8c0' };
const GENT_O = { jacket: '#4a6a3a', pants: '#5a4a36', boots: '#2a1e14', hat: 'cowboy', hatColor: '#7a5a3a', vest: '#c8a060', scarf: '#c0392b', belt: '#3a2414', skin: '#d8a880' };
const BOY_O = { jacket: '#d8843a', pants: '#3a4a6a', boots: '#2a2018', hat: 'cap', cap: '#3a6ea5', build: 'kid', scarf: '#e84a5f', pockets: true, skin: '#f2d2b0' };
const CROWD_O = [
  { jacket: '#3a6ea5', pants: '#2c2c34', hat: 'beanie', hatColor: '#c0392b', scarf: '#f2f2e8', belt: '#222' },
  { jacket: '#e8a0b0', dress: '#e8a0b0', hairStyle: 'long', hair: '#3a2418', scarf: '#ffffff', glasses: '#333' },
  { jacket: '#6a4a8a', pants: '#2a2a30', hat: 'tophat', hatColor: '#3a3a3a', bowtie: '#e8b84a', moustache: '#222' },
  { jacket: '#c8a040', pants: '#4a3a2a', hairStyle: 'curly', hair: '#2a1a12', vest: '#6a3a2a', tie: '#2a4a8a' },
  { jacket: '#5aa08a', dress: '#5aa08a', hairStyle: 'ponytail', hair: '#d8b060', apron: '#f6f2ea', scarf: '#d84a4a' },
  { jacket: '#8a3a3a', pants: '#2a3a4a', hat: 'cap', cap: '#2a2a2a', glasses: true, belt: '#111', pockets: true },
];

const SUNSET = { az: 200, el: 22, sky: '#ffd8b0', ground: '#7a6a5a', hemi: 1.0, sun: '#ffd49a', sunI: 3.2, fog: '#f2c8a0', fogNear: 60, fogFar: 420,
  skyTop: '#3a5aa8', skyHor: '#ffc08a', sat: 1.12, vig: 0.26, shadowExt: 18, exposure: 1.12, ink: 0.55, bloom: 0.7 };

// herd: Jumbo leads (walking +z, toward Brooklyn), 4 more behind, the showman 4.2 m out front.
// walk segments: f 0..cut(1) (marching in), cut(3)..STOP (halfway), GO.. (passed); standing in between.
const STOP = W(6, 'stopped') - 2, GO = L[8][0] + 6, V0 = 0.9;
const SEG = [[0, Math.max(0, LINES[1][0] - 4)], [Math.max(0, LINES[3][0] - 4), STOP], [GO, TOTAL + 60]];
const JS = -24, J0 = JS - V0 * (SEG[0][1] - SEG[0][0] + SEG[1][1] - SEG[1][0]) / 30;
const segStart = (i) => J0 + V0 * SEG.slice(0, i).reduce((a, [x, y]) => a + y - x, 0) / 30;
// position along the deck via K.walkPath (one call per walking segment; holds between)
const walkZ = (f, x, off) => { let z = segStart(0) + off, moving = false;
  SEG.forEach(([a, b], i) => { if (f >= a) { const z0 = segStart(i) + off, z1 = segStart(i + 1 < SEG.length ? i + 1 : i) + off + (i === 2 ? 40 : 0);
    const Wp = K.walkPath(Math.min(f, b), a, [[x, z0], [x, z1 + (i === 2 ? 0 : 0.0001)]], V0); z = Wp.z; moving = f < b && Wp.moving; } });
  return { z, moving }; };

function build(k) {
  K = k; X.init(K); const { THREE } = K; const r = X.rnd(1884);
  const plank = K.mat('wood', '#9a7450', { detail: 0.5, amt: 0.35 }), stone = K.mat('rock', '#cdb894', { detail: 1.2, amt: 0.3 }), dark = K.mat('wood', '#5a3e28'),
    iron = K.mat('metal', '#3a3a40'), rail = K.mat('metal', '#5a4a3a'), grass = K.mat('dirt', '#7a9a52', { detail: 1.4, amt: 0.4 }), cob = K.mat('rock', '#9a8e80', { detail: 0.5 });
  // deck (y 0) from z -260 to +70, x -5..5, rails and lamp posts
  K.slab(-5.2, 5.2, -0.5, 0, -260, 70, plank, K.scene, false);
  K.slab(-5.6, 5.6, -1.6, -0.5, -260, 70, iron, K.scene, false);
  for (const sx of [-1, 1]) {
    K.slab(sx * 5.0 - 0.06, sx * 5.0 + 0.06, 0, 1.1, -260, 70, rail, K.scene); K.slab(sx * 5.0 - 0.1, sx * 5.0 + 0.1, 1.05, 1.15, -260, 70, dark, K.scene);
    for (let z = -258; z < 70; z += 1.6) K.slab(sx * 5.0 - 0.05, sx * 5.0 + 0.05, 0, 1.1, z - 0.04, z + 0.04, rail);
    for (let z = -240; z < 70; z += 14) { K.cyl(0.06, 0.08, 3.2, iron, sx * 4.7, 0, z); const g = K.add(new THREE.SphereGeometry(0.2, 12, 10), K.toon({ color: '#fff2c0', plain: true, emissive: '#ffd890' }), sx * 4.7, 3.3, z); g.material.emissive && g.material.emissive.set('#ffcc70'); }
  }
  // tower (two pointed arches) at z -30, and a second far tower at z -220
  const towerShape = () => { const s = new THREE.Shape(); s.moveTo(-8, -14); s.lineTo(8, -14); s.lineTo(8, 27); s.lineTo(-8, 27); s.lineTo(-8, -14);
    for (const cx of [-2.9, 2.9]) { const h = new THREE.Path(); h.moveTo(cx - 2.3, 0); h.lineTo(cx + 2.3, 0); h.lineTo(cx + 2.3, 11); h.quadraticCurveTo(cx + 2.2, 14.5, cx, 16); h.quadraticCurveTo(cx - 2.2, 14.5, cx - 2.3, 11); h.lineTo(cx - 2.3, 0); s.holes.push(h); }
    return new THREE.ExtrudeGeometry(s, { depth: 5, bevelEnabled: false, curveSegments: 10 }); };
  for (const tz of [-30, -220]) { const t = K.add(towerShape(), stone, 0, 0, tz - 2.5); t.name = 'tower';
    K.slab(-8.6, 8.6, 25.5, 27.6, tz - 3, tz + 3, K.mat('rock', '#b8a07c', { detail: 0.8 })); // cornice
    for (const cx of [-2.9, 2.9]) K.slab(cx - 2.6, cx + 2.6, 17.5, 18.3, tz + 2.5, tz + 2.8, K.mat('rock', '#b09878')); }
  // the central pier between the arches is solid (walk around it)
  const pier = K.slab(-0.6, 0.6, 0, 3, -33, -27, K.mat('rock', '#cdb894', { plain: true })); pier.visible = false; pier.name = 'tower pier'; K.solid(pier, 0.2);
  // main cables (catenaries) + suspenders
  const cab = K.mat('metal', '#4a4a52', { plain: true });
  for (const sx of [-1, 1]) for (const [z0, z1, y0, y1] of [[-30, 70, 26, 1.4], [-30, -125, 26, 6], [-220, -125, 26, 6]]) {
    const pts = []; for (let i = 0; i <= 30; i++) { const t = i / 30, z = lerp(z0, z1, t); pts.push(new THREE.Vector3(sx * 5.1, lerp(y0, y1, t) - (z1 > z0 ? 10 : 14) * Math.sin(Math.PI * t) * (z1 > 60 ? 0.3 : 0.6), z)); }
    const curve = new THREE.CatmullRomCurve3(pts); K.add(new THREE.TubeGeometry(curve, 40, 0.18, 8), cab, 0, 0, 0);
    for (let i = 1; i < 30; i++) { const p = curve.getPoint(i / 30); if (p.y < 1.4) continue; const s = K.cyl(0.025, 0.025, p.y - 1.05, iron, p.x, 1.05, p.z); SUSP.push({ m: s, x: p.x, i }); }
    // diagonal stays from the tower top
    for (let j = 1; j <= 5; j++) { const zt = z0 + (z1 > z0 ? 1 : -1) * j * 6; const a = new THREE.Vector3(sx * 5.1, 24, z0), b = new THREE.Vector3(sx * 5.1, 1.1, zt);
      K.add(new THREE.TubeGeometry(new THREE.LineCurve3(a, b), 1, 0.03, 5), iron, 0, 0, 0); }
  }
  // river far below + banks + city skylines
  PR.ocean(K, { y: -14, deep: '#2a5a7a', shal: '#4a8aa0', shoreZ: -2000, size: 1200 });
  const bank = (x0, x1) => { K.slab(x0, x1, -14.5, -11.5, -120, 120, grass, K.scene, false); };
  bank(26, 160); bank(-160, -26);
  K.slab(26, 31, -11.5, -11.3, -60, 60, cob, K.scene, false); // promenade
  for (let z = -58; z < 60; z += 2.2) K.cyl(0.05, 0.05, 1.0, iron, 26.3, -11.3, z);
  K.slab(26.25, 26.35, -10.45, -10.35, -60, 60, iron, K.scene, false);
  for (const [x, z] of [[29.5, 10], [29.5, -16]]) { K.cyl(0.07, 0.09, 3.6, iron, x, -11.3, z); K.add(new THREE.SphereGeometry(0.22, 12, 10), K.toon({ color: '#fff2c0', plain: true }), x, -7.5, z); }
  for (let i = 0; i < 26; i++) { const x = 34 + r() * 60, z = (r() - 0.5) * 200; X.tree(x, z, 2 + r(), K.mat('wood', '#5a4a3a'), K.mat('grime', '#5a8a3a', { amt: 0.6 }), K.scene, r); }
  const city = (zc, n, seed) => { for (let i = 0; i < n; i++) { const x = -120 + i * (240 / n) + (r() - 0.5) * 6, h = 10 + r() * 34, w = 6 + r() * 6;
    K.slab(x, x + w, -12, h, zc - 6, zc + 6, K.toon({ map: PR.facadeTex(['#b8a080', '#a8583a', '#c8b090', '#8a6a5a'][i % 4], 3, 6, seed + i, '#f2ead8'), kind: 'plaster', amt: 0.15 }));
    if (i % 5 === 2) K.cyl(0.6, 1.2, 8, K.mat('metal', '#5a6a5a'), x + w / 2, h, zc); } };
  city(-300, 22, 3); city(140, 22, 40);
  // the showman's poster for the "free ads" beat (on the entrance kiosk at z 48)
  const posterTex = PR.canvasTex(512, 720, (g, w, h) => { g.fillStyle = '#f2e2b8'; g.fillRect(0, 0, w, h); g.strokeStyle = '#b8322a'; g.lineWidth = 18; g.strokeRect(14, 14, w - 28, h - 28);
    g.fillStyle = '#b8322a'; g.font = 'bold 66px Georgia, serif'; g.textAlign = 'center'; g.fillText('THE GREAT', w / 2, 110); g.fillText('SHOW', w / 2, 180);
    g.fillStyle = '#2a2a3a'; g.font = 'bold 42px Georgia, serif'; g.fillText('PRESENTS', w / 2, 236);
    g.fillStyle = '#8a8a96'; g.beginPath(); g.ellipse(w / 2, 400, 150, 110, 0, 0, 7); g.fill(); g.beginPath(); g.arc(w / 2 + 130, 340, 70, 0, 7); g.fill();
    g.fillRect(w / 2 - 110, 470, 40, 70); g.fillRect(w / 2 + 60, 470, 40, 70); g.strokeStyle = '#8a8a96'; g.lineWidth = 26; g.beginPath(); g.moveTo(w / 2 + 190, 360); g.quadraticCurveTo(w / 2 + 240, 470, w / 2 + 200, 520); g.stroke();
    g.fillStyle = '#ffffff'; g.beginPath(); g.arc(w / 2 + 150, 325, 16, 0, 7); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.arc(w / 2 + 153, 327, 8, 0, 7); g.fill();
    g.fillStyle = '#b8322a'; g.font = 'bold 52px Georgia, serif'; g.fillText('ELEPHANT', w / 2, 610); g.fillText('APPROVED!', w / 2, 668); });
  const kiosk = K.group(); kiosk.position.set(-3.2, 0, 48); K.cyl(0.55, 0.55, 3.0, K.mat('wood', '#3a5a3a'), 0, 0, 0, kiosk); K.add(new THREE.ConeGeometry(0.85, 0.8, 16), K.mat('metal', '#2a4a2a'), 0, 3.4, 0, kiosk);
  K.solid(kiosk);
  poster = X.sign(1.0, 1.4, posterTex, -3.2, 1.55, 48.56, 0, K.scene, 'plaster');
  // rope + barrels at the entrance where the cop and the lady stand
  for (const x of [-4.6, 4.6]) { const b = K.cyl(0.35, 0.35, 0.95, K.mat('wood', '#8a5a34'), x, 0, 44); K.solid(b); }
  wob = K.slab(-0.6, 0.6, 0, 0.07, -0.25, 0.25, K.mat('wood', '#b08050', { detail: 0.3 })); wob.position.set(2.25, 0.08, -30.0); wob.visible = false;
  K.addClouds(9, 700, 160);
  K.lamp(4.4, 3.2, -4, { color: '#ffcc80', intensity: 2.2, distance: 12, glowS: 0.6 });
  K.lamp(-4.4, 3.2, 38, { color: '#ffcc80', intensity: 2.2, distance: 12, glowS: 0.6 });
  K.lamp(29.5, -7.6, 10, { color: '#ffcc80', intensity: 2.0, distance: 12, glowS: 0.6 });
  // cast
  ELE = [K.animal('elephant', { seed: 1, scale: 1.9, color: '#8e8e98' })];
  for (let i = 0; i < 4; i++) ELE.push(K.animal('elephant', { seed: 2 + i, scale: 1.45 + 0.08 * (i % 2), color: ['#9a96a0', '#8a8890', '#a09ca4', '#928e98'][i] }));
  SHOW = K.stick(SHOW_O, { key: 'show' }); COP = K.stick(COP_O, { key: 'cop' }); LADY = K.stick(LADY_O, { key: 'lady' }); GENT = K.stick(GENT_O, { key: 'gent' }); BOY = K.stick(BOY_O, { key: 'boy' });
  CROWD = CROWD_O.map((o, i) => K.stick({ boots: '#2a2018', skin: ['#f2d2b0', '#d8a880', '#a8704a', '#f6dcc4', '#c88a5a', '#e8c4a0'][i], ...o }, { key: 'crowd' + i }));
}

const F = { e21: W(0, '21'), bridge: W(0, 'bridge'), jumbo: W(1, 'jumbo'), six: W(1, 'six'), feared: W(1, 'feared'), collapse: W(1, 'collapse'), why: W(2, 'why'), never: W(2, 'never'),
  wobbly: W(2, 'wobbly'), lined: W(3, 'lined'), trunk: W(3, 'trunk'), showman: W(3, 'showman'), halfway: W(4, 'halfway'), cables: W(4, 'cables'), hum: W(4, 'hum'),
  thousands: W(5, 'thousands'), froze: W(5, 'froze'), hold: W(5, 'hold'), stopped: W(6, 'stopped'), looked: W(6, 'looked'), lifted: W(6, 'lifted'), foot: W(6, 'foot'),
  stomped: W(7, 'stomped'), nothing: W(7, 'nothing'), passed: W(8, 'passed'), free: W(8, 'free'), ads: W(8, 'ads'), elephants: W(9, 'elephants') };

// acting tracks
const showKeys = [[0, 'cheer', { expr: 'laugh', talk: true }], [F.bridge - 6, 'walk', { expr: 'proud' }], [cut(1), 'show', { expr: 'grin' }], [F.six - 3, 'pointL', { expr: 'excited' }],
  [cut(2), 'shrug', { expr: 'confused' }], [F.never - 4, 'idea', { expr: 'grin' }], [F.wobbly - 3, 'stop', { expr: 'stern' }], [cut(3), 'walk', { expr: 'proud' }], [F.showman - 3, 'walk', { expr: 'grin' }],
  [F.cables - 3, 'walk', { expr: 'scared' }], [STOP - 3, 'stop', { expr: 'nervous', talk: true }], [F.lifted - 2, 'scared', { expr: 'scared' }], [F.stomped + 3, 'crouch', { expr: 'scared' }],
  [F.nothing + 2, 'shock', { expr: 'relief' }], [cut(8), 'celebrate', { expr: 'laugh' }], [F.free - 3, 'show', { R: [0.42, -0.6, 'paper'], expr: 'grin' }], [F.ads + 4, 'cheer', { expr: 'laugh', talk: true }], [cut(9), 'cheer', { expr: 'laugh' }]];
const copKeys = [[0, 'cheer', { expr: 'excited' }], [cut(1), 'cross', { expr: 'stern' }], [F.feared - 4, 'scared', { expr: 'scared' }], [F.collapse, 'panic', { expr: 'shock' }],
  [cut(5), 'shock', { expr: 'scared' }], [F.hold - 4, 'facepalm', { expr: 'nervous' }], [cut(8), 'clap', { expr: 'relief' }], [F.ads, 'cheer', { expr: 'laugh' }]];
const ladyKeys = [[0, 'wave', { expr: 'excited' }], [cut(1), 'idle', { expr: 'nervous' }], [F.feared - 2, 'shock', { expr: 'scared' }], [F.collapse + 2, 'scared', { expr: 'scared' }],
  [cut(5), 'scared', { expr: 'shock' }], [F.froze, 'stop', { expr: 'scared' }], [F.hold - 2, 'think', { expr: 'nervous' }], [cut(8), 'celebrate', { expr: 'laugh' }]];
const gentKeys = [[0, 'cheer'], [cut(5), 'pointUp', { expr: 'shock' }], [F.froze, 'shock', { expr: 'scared' }], [F.hold, 'reach', { expr: 'nervous' }], [cut(8), 'cheer', { expr: 'laugh' }]];
const boyKeys = [[0, 'jump', { expr: 'excited' }], [cut(5), 'pointUp', { expr: 'excited' }], [F.froze - 2, 'scared', { expr: 'shock' }], [F.hold + 4, 'crouch', { expr: 'nervous' }], [cut(8), 'jump', { expr: 'laugh' }]];
const crowdKeys = (i) => [[0, 'cheer'], [cut(5), i % 2 ? 'pointUp' : 'shock', { expr: 'shock' }], [F.froze + i, 'scared', { expr: 'scared' }], [F.hold + i * 2, i % 2 ? 'facepalm' : 'idle', { expr: 'nervous' }], [cut(8) + i, 'cheer', { expr: 'laugh' }]];

const JA = -31.2; // where the herd stands during lines 2-3 (inside the tower arch); the showman is 4.2 m ahead
const S = X.shotList([
  { id: 'hook', f: 0, keys: [{ pos: [-0.4, 0.6, JS + 8.4], look: [1.6, 2.2, JS - 2], fov: 50 }, { pos: [-0.5, 0.65, JS + 9.0], look: [1.6, 2.3, JS - 2], fov: 46 }] },
  { id: 'tower', f: F.bridge - 6, whip: false, keys: [{ pos: [-3.4, 0.6, -17], look: [2.6, 9, -32], fov: 54 }, { pos: [-3.2, 0.6, -18.2], look: [2.6, 10, -32], fov: 52 }] },
  { id: 'jumbo', f: cut(1), keys: [{ pos: [4.2, 2.6, JA + 7.4], look: [1.8, 2.5, JA + 1.6], fov: 40 }, { pos: [4.0, 2.55, JA + 6.8], look: [1.8, 2.45, JA + 1.6], fov: 36 }] },
  { id: 'fear', f: W(1, 'everyone') - 5, keys: [{ pos: [-3.0, 1.6, 40.6], look: [-3.15, 1.35, 45.1], fov: 38 }, { pos: [-3.0, 1.55, 41.0], look: [-3.15, 1.35, 45.1], fov: 35 }] },
  { id: 'why', f: cut(2), keys: [{ pos: [3.4, 1.6, JA + 8.6], look: [1.9, 1.45, JA + 4.2], fov: 38 }, { pos: [3.2, 1.55, JA + 8.1], look: [1.9, 1.45, JA + 4.2], fov: 34 }] },
  { id: 'wobble', f: F.never - 4, whip: false, keys: [{ pos: [4.1, 0.55, JA + 3.6], look: [2.1, 0.5, JA + 0.9], fov: 40 }, { pos: [4.0, 0.6, JA + 3.4], look: [2.1, 0.55, JA + 0.9], fov: 36 }] },
  { id: 'line', f: cut(3), keys: [{ pos: [3.8, 6.0, -13.0], look: [1.8, 1.0, -30], fov: 46 }, { pos: [3.7, 5.8, -13.6], look: [1.8, 1.0, -30], fov: 44 }] },
  { id: 'front', f: F.showman - 5, whip: false, keys: [{ pos: [2.3, 1.55, -19.4], look: [1.9, 1.4, -24.6], fov: 36 }, { pos: [2.2, 1.5, -19.8], look: [1.9, 1.4, -24.4], fov: 33 }] },
  { id: 'hum', f: cut(4), keys: [{ pos: [3.6, 0.9, -21.0], look: [5.0, 7.0, -12], fov: 52 }, { pos: [3.6, 0.9, -21.4], look: [5.0, 7.5, -12], fov: 48 }] },
  { id: 'scared', f: F.cables + 2, whip: false, keys: [{ pos: [2.4, 1.6, -17.4], look: [1.9, 1.45, -22.6], fov: 36 }, { pos: [2.4, 1.6, -17.6], look: [1.9, 1.45, -22.2], fov: 33 }] },
  { id: 'banks', f: cut(5), keys: [{ pos: [26.4, -9.7, 6.0], look: [30.2, -10.1, 1.0], fov: 42 }, { pos: [26.6, -9.75, 5.6], look: [30.2, -10.1, 1.0], fov: 38 }] },
  { id: 'bankwide', f: F.hold - 8, whip: false, keys: [{ pos: [33.5, -10.4, 10.0], look: [6.0, 1.5, -20], fov: 48 }, { pos: [33.3, -10.3, 9.0], look: [5.0, 2.0, -20], fov: 44 }] },
  { id: 'stop', f: cut(6), keys: [{ pos: [4.2, 3.0, JS + 7.8], look: [1.8, 2.5, JS + 1.6], fov: 40 }, { pos: [4.1, 2.8, JS + 7.2], look: [1.8, 2.3, JS + 1.6], fov: 35 }] },
  { id: 'foot', f: F.lifted - 4, whip: false, keys: [{ pos: [5.0, 0.45, JS + 6.6], look: [2.2, 1.2, JS + 1.6], fov: 44 }, { pos: [4.9, 0.45, JS + 6.3], look: [2.2, 1.3, JS + 1.6], fov: 41 }] },
  { id: 'stomp', f: cut(7), whip: false, keys: [{ pos: [4.6, 0.7, JS + 9.0], look: [1.7, 2.0, JS + 0.4], fov: 50 }, { pos: [4.5, 0.7, JS + 8.7], look: [1.7, 2.0, JS + 0.4], fov: 48 }] },
  { id: 'still', f: F.nothing - 4, whip: false, keys: [{ pos: [-4.2, 4.5, JS + 13], look: [1.2, 1.2, JS - 2], fov: 48 }, { pos: [-4.0, 4.4, JS + 12.4], look: [1.2, 1.2, JS - 2], fov: 46 }] },
  { id: 'pass', f: cut(8), keys: [{ pos: [2.7, 1.6, JS + 9.0], look: [1.9, 1.45, JS + 4.2], fov: 40 }, { pos: [2.6, 1.55, JS + 8.6], look: [1.9, 1.45, JS + 4.2], fov: 36 }] },
  { id: 'poster', f: F.free - 12, keys: [{ pos: [-3.05, 1.6, 51.4], look: [-3.2, 1.55, 48.5], fov: 40 }, { pos: [-3.1, 1.58, 51.0], look: [-3.2, 1.55, 48.5], fov: 38 }] },
  { id: 'end', f: cut(9), keys: [{ pos: [-0.4, 0.7, JS + 8.8], look: [1.6, 2.3, JS - 2], fov: 46 }, { pos: [-0.6, 0.6, JS + 9.6], look: [1.6, 2.2, JS - 2], fov: 50 }] },
], TOTAL);
const KICKS = [{ f: F.stomped, a: 0.05 }, { f: F.hum, a: 0.02 }, { f: F.e21, a: 0.015 }];
const SHOWN = new Set();
const put = (rig, keys, seed, pos) => { const A = K.T.act(pos.f, keys, { seed, blink: blinkAt(pos.f, seed) }); rig.set(A, pos); SHOWN.add(rig); return A; };

// herd state for frame f (hook/end shots = flash-forward to the stomp moment)
function herd(f, id) {
  const flash = id === 'hook' || id === 'end';
  const J = walkZ(f, 1.8, 0), jz = flash ? JS : J.z, moving = !flash && J.moving;
  const lift = flash ? clamp(1.4 - Math.abs(((f % 44) - 22) / 12)) : id === 'wobble' ? 0.55 + 0.25 * Math.sin(f * 0.25)
    : f >= F.lifted - 2 && f < F.stomped ? M.smooth(clamp((f - F.lifted + 2) / 10)) : f >= F.stomped && f < F.stomped + 3 ? 1 - (f - F.stomped) / 3 : 0;
  const exprJ = flash ? 'happy' : id === 'wobble' ? 'angry' : f >= F.stomped && f < F.nothing + 20 ? 'happy' : f >= F.cables && f < F.stomped ? 'shock' : f >= cut(8) || f < cut(2) ? 'happy' : 'neutral';
  ELE.forEach((e, i) => { const z = jz - (i === 0 ? 0 : 4.4 + (i - 1) * 3.6), ex = i === 0 ? 1.8 : 1.8 + (i % 2 ? 0.7 : -0.5);
    e.set(f + i * 7, { x: ex, z, yaw: 0, mode: moving ? 'walk' : 'stand', speed: 0.55, expr: i === 0 ? exprJ : (f >= F.cables && f < F.nothing ? 'shock' : 'happy'),
      look: i === 0 && f >= F.looked - 2 && f < F.stomped ? 0 : 0.2 * Math.sin((f + i * 30) / 40), nod: i === 0 && (f >= F.looked - 2 && f < F.stomped + 8 || id === 'wobble') ? 0.5 : 0, lift: i === 0 ? lift : 0 }); });
  return { jz, moving };
}

export default {
  TOTAL, build, look: 'rich',
  frame(f, k) {
    const { c: cam, s } = X.camAt(S, f, KICKS), id = s.id; SHOWN.clear();
    if (['hum', 'stomp'].includes(id)) cam.fov *= K.punch(f, id === 'hum' ? F.hum - 2 : F.stomped, 0.28, 6);
    const fx = [], push = (x) => x && fx.push(x);
    const onBridge = !['fear', 'banks', 'bankwide', 'poster'].includes(id);
    for (const e of ELE) e.root.visible = onBridge || id === 'bankwide';
    const H = herd(f, id), flash = id === 'hook' || id === 'end';
    if (onBridge) { const Sw = walkZ(Math.min(f, STOP), 1.9, 4.2);
      put(SHOW, showKeys, 3, { f, x: flash ? 0.2 : 1.9, z: flash ? JS + 3.4 : Sw.z, yaw: f >= STOP && f < cut(8) && !flash ? Math.PI * 0.9 : Math.PI * 0.04 }); }
    // humming cables
    const humA = f >= F.cables - 4 && f < F.nothing ? 0.06 * (1 - clamp((f - F.stomped) / 20)) : 0;
    for (const sp of SUSP) sp.m.position.x = sp.x + humA * Math.sin(f * 2.3 + sp.i * 0.7);
    wob.visible = id === 'wobble'; wob.rotation.z = 0.18 * Math.sin(f * 0.45);
    switch (id) {
      case 'hook': push(X.wordCard(f, 2, '21 ELEPHANTS', cam, '#f6c83a', 1e9, 170, 0.6, 1.6));
        if (f % 40 > 18 && f % 40 < 30) push(X.FX('d' + (f % 40), (p) => K.T.fxDust(p, ((f % 40) - 18) / 12), [2.2, 0.0, JS + 1.0], 0.6, { order: 6 })); break;
      case 'tower': break;
      case 'jumbo': push(X.wordCard(f, F.six, '6 TONS', cam, '#f6c83a', 1e9, 200, 0.62, 1.6)); break;
      case 'fear': put(COP, copKeys, 5, { f, x: -2.75, z: 44.9, yaw: Math.PI - 0.35 }); put(LADY, ladyKeys, 6, { f, x: -3.55, z: 45.3, yaw: Math.PI + 0.3 });
        push(X.wordCard(f, F.collapse, 'COLLAPSE?!', cam, '#ff5a3a', 1e9, 190, 0.62, 1.6)); break;
      case 'why': push(X.wordCard(f, F.why, 'WHY ELEPHANTS?', cam, '#ffffff', F.never - F.why - 6, 160, 0.62, 1.6)); break;
      case 'wobble': push(X.wordCard(f, F.wobbly, 'WOBBLY = NOPE', cam, '#ff7a3a', 1e9, 160, 0.62, 1.6)); break;
      case 'line': break;
      case 'front': break;
      case 'hum': for (let i = 0; i < 3; i++) if (f > F.cables) push(X.FX('n' + i + (f % 18), (p) => K.T.fxNote(p, ((f + i * 6) % 18) / 18), [4.9 - i * 0.2, 4 + i * 2.2 + ((f + i * 6) % 18) * 0.04, -27 - i], 0.6, { order: 6 }));
        push(X.wordCard(f, F.hum, 'HMMMMM...', cam, '#9fd4ff', 1e9, 190, 0.62, 1.6)); break;
      case 'scared': break;
      case 'banks': case 'bankwide': {
        const ppl = [[GENT, gentKeys, 7, 30.2, 2.0], [BOY, boyKeys, 8, 29.0, 0.8], [LADY, ladyKeys, 6, 31.3, 3.3]];
        for (const [rig, ks, sd, x, z] of ppl) put(rig, ks, sd, { f, x, y: -11.3, z, yaw: -Math.PI / 2 + 0.55 });
        CROWD.forEach((c, i) => put(c, crowdKeys(i), 20 + i, { f, x: 29.7 + (i % 3) * 1.0, y: -11.3, z: -0.6 - Math.floor(i / 3) * 1.2 + (i % 3) * 0.5, yaw: -Math.PI / 2 + 0.5 }));
        push(X.wordCard(f, F.hold - 2, 'WOULD IT HOLD?', cam, '#ffffff', 1e9, 160, 0.62, 1.6)); break; }
      case 'stop': push(X.wordCard(f, F.stopped, 'STOP.', cam, '#ffffff', 1e9, 210, 0.62, 1.6)); break;
      case 'foot': break;
      case 'stomp': if (f >= F.stomped) { const t = clamp((f - F.stomped) / 16); push(X.FX('st' + q(t, 1), (p) => K.T.fxDust(p, t), [2.3, -0.2, JS + 1.2], 1.3, { order: 6 })); }
        push(X.wordCard(f, F.stomped + 1, 'STOMP!', cam, '#f6c83a', 1e9, 220, 0.62, 1.6)); break;
      case 'still': push(X.wordCard(f, F.nothing + 6, 'NOT A WOBBLE', cam, '#9ad04a', 1e9, 170, 0.62, 1.6)); break;
      case 'pass': push(X.wordCard(f, F.passed, 'PASSED!', cam, '#9ad04a', 1e9, 210, 0.62, 1.6)); break;
      case 'poster': push(X.wordCard(f, F.free + 2, 'FREE ADS', cam, '#f6c83a', 1e9, 190, 0.66, 1.4)); break;
      case 'end': push(X.wordCard(f, F.elephants, 'ELEPHANTS.', cam, '#f6c83a', 1e9, 190, 0.6, 1.6)); break;
    }
    for (const r of [SHOW, COP, LADY, GENT, BOY, ...CROWD]) if (!SHOWN.has(r)) r.root.visible = false;
    const cl = { hook: [[1.8, 1.8, JS + 2], 6], tower: [[2, 4, -30], 5], jumbo: [[1.8, 2.5, JA + 0.6], 14], fear: [[-3, 1.4, 45], 13], why: [[1.9, 1.45, JA + 4.2], 13], wobble: [[2.1, 0.5, JA + 0.9], 16],
      line: [[1.8, 1, -30], 6], front: [[1.9, 1.4, -24.5], 14], hum: [[4.9, 5, -28], 6], scared: [[1.9, 1.4, -22.4], 14], banks: [[29.8, -10, 1.5], 12], bankwide: [[29, -10, 1], 6],
      stop: [[1.8, 2.5, JS + 0.6], 13], foot: [[2.1, 0.8, JS + 0.9], 16], stomp: [[1.9, 1.5, JS], 8], still: [[1.4, 1.2, JS], 6], pass: [[1.9, 1.4, JS + 4.2], 13], poster: [[-3.2, 1.55, 48.5], 18], end: [[1.8, 1.8, JS + 2], 6] };
    const dof = cl[id] ? X.focusOn(cam, cl[id][0], cl[id][1]) : { focus: 10, cinf: 4 };
    return { light: SUNSET, cam, dof, actors: [], fx };
  },
};
