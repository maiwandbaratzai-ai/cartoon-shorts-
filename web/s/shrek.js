// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The sheep who hid from haircuts" (true: Shrek the Merino, Tarras, New Zealand, found in 2004 after ~6 years in caves,
// 27 kg fleece, shorn on live national TV in about 20 minutes, enough wool for ~20 suits).
// Sets: a sunny Central-Otago-style hillside with a cave (x≈0) and a shearing shed with a TV camera (x≈200).
import { TOTAL, LINES, wf } from './shrek_timing.js';
import * as PR from '../props.js';
import * as X from './kit3d.js';
import { blinkAt } from '../motion.js';
const { M, clamp, lerp, q } = X;

export { TOTAL };
const L = LINES, cut = (i) => Math.max(0, L[i][0] - 4), W = wf;
let K, SHREK, DOG, FLEECE, PILE, CLIP, FARMER, SHEARER, CAMOP, FAN1, FAN2, LIVE, rock;

const FARMER_O = { jacket: '#b8443a', pants: '#3a4a5a', boots: '#4a3020', hat: 'cowboy', hatColor: '#7a5a3a', vest: '#5a6a3a', scarf: '#e8c84a', belt: '#3a2414', skin: '#e8b890' };
const SHEARER_O = { jacket: '#2a2a30', pants: '#3a4a6a', boots: '#2a1e14', hat: 'beanie', hatColor: '#e8b84a', belt: '#8a5a30', pockets: true, moustache: '#5a3a24', gloves: '#c8a070', skin: '#d8a070', build: 'stout' };
const CAMOP_O = { jacket: '#e8e0d0', pants: '#2a3040', boots: '#1e1a18', hat: 'cap', cap: '#3a6ea5', glasses: true, badge: true, pockets: true, skin: '#f2d2b0' };
const FAN1_O = { jacket: '#4a9a6a', dress: '#4a9a6a', pants: '#3a5a4a', boots: '#3a2430', hairStyle: 'bun', hair: '#d8b060', glasses: '#333', scarf: '#d84a6a', skin: '#f6dcc4' };
const FAN2_O = { jacket: '#c8783a', pants: '#2a2a34', boots: '#2a2018', hairStyle: 'curly', hair: '#2a1a12', vest: '#5a3a6a', tie: '#e8c84a', skin: '#a8704a' };

const DAY = { az: 150, el: 34, sky: '#cfe4f4', ground: '#b8a070', hemi: 1.0, sun: '#fff1d8', sunI: 3.2, skyTop: '#3f7ad0', skyHor: '#d6eaf8', fog: '#dceaf4', fogNear: 60, fogFar: 520,
  sat: 1.12, vig: 0.24, shadowExt: 16, exposure: 1.1, ink: 0.55 };
const SHED = { az: 120, el: 50, sky: '#7a6a5a', ground: '#3a2a1e', hemi: 0.75, sun: '#ffe0b0', sunI: 1.2, fog: '#2a1e16', fogNear: 14, fogFar: 40,
  skyTop: '#2a1e16', skyHor: '#2a1e16', sat: 1.08, vig: 0.3, shadowExt: 14, exposure: 1.25, bloom: 0.6, ink: 0.55, cardTint: '#fff0e0' };

const SX = 200; // shed origin x
function build(k) {
  K = k; X.init(K); const { THREE } = K; const r = X.rnd(2004);
  // ---- hillside: tussock, boulders, rock face with a cave, distant snowy peaks
  const tus = K.mat('dirt', '#b8a464', { detail: 1.6, amt: 0.45 }), rockM = K.mat('rock', '#9a8a78', { detail: 1.0, amt: 0.35 }), dark = K.toon({ color: '#1a1410', plain: true });
  K.slab(-120, 120, -0.2, 0, -120, 120, tus, K.scene, false);
  const face = new THREE.Shape(); face.moveTo(-14, 0); face.lineTo(14, 0); face.lineTo(12, 7); face.lineTo(4, 9.5); face.lineTo(-6, 8.6); face.lineTo(-14, 6); face.lineTo(-14, 0);
  const hole = new THREE.Path(); hole.moveTo(-1.6, 0); hole.lineTo(1.6, 0); hole.quadraticCurveTo(1.9, 2.6, 0, 3.0); hole.quadraticCurveTo(-1.9, 2.6, -1.6, 0); face.holes.push(hole);
  const rf = K.add(new THREE.ExtrudeGeometry(face, { depth: 6, bevelEnabled: false }), rockM, 0, 0, -16); rf.name = 'rock face';
  K.slab(-1.7, 1.7, 0, 3.2, -16.4, -15.8, dark, K.scene, false); // cave darkness
  for (let i = 0; i < 26; i++) { const x = (r() - 0.5) * 40, z = -2 - r() * 30; if (Math.abs(x) < 3 && z > -9) continue; const b = K.add(new THREE.DodecahedronGeometry(0.4 + r() * 1.4, 1), rockM, x, 0.2, z); b.scale.y = 0.7; }
  rock = K.add(new THREE.DodecahedronGeometry(0.75, 1), rockM, 2.2, 0.45, -1.2); rock.scale.y = 0.75; rock.name = 'boulder'; K.solid(rock, 0.15);
  for (let i = 0; i < 260; i++) { const x = (r() - 0.5) * 60, z = 8 - r() * 50; if (Math.abs(x) < 2 && z > -4 && z < 6) continue;
    const c = K.add(new THREE.ConeGeometry(0.18 + r() * 0.12, 0.5 + r() * 0.4, 6), K.mat('grime', r() < 0.5 ? '#c8b45a' : '#a8a050', { amt: 0.5 }), x, 0.2, z); c.rotation.z = (r() - 0.5) * 0.4; }
  for (let i = 0; i < 9; i++) { const x = -160 + i * 40 + (r() - 0.5) * 20, h = 50 + r() * 40, z = -170 - r() * 40;
    K.add(new THREE.ConeGeometry(h * 0.8, h, 7), K.mat('rock', '#7a7a88', { detail: 6 }), x, h / 2, z); K.add(new THREE.ConeGeometry(h * 0.3, h * 0.36, 7), K.toon({ color: '#f6f8fc', plain: true }), x, h * 0.84, z); }
  for (let i = 0; i < 8; i++) { const x = -150 + i * 42 + (r() - 0.5) * 20, h = 45 + r() * 35, z = 150 + r() * 40;
    K.add(new THREE.ConeGeometry(h * 0.8, h, 7), K.mat('rock', '#7a7a88', { detail: 6 }), x, h / 2, z); K.add(new THREE.ConeGeometry(h * 0.3, h * 0.36, 7), K.toon({ color: '#f6f8fc', plain: true }), x, h * 0.84, z); }
  const bark = K.mat('wood', '#5a4a3a'), leaf = K.mat('grime', '#4a7a3a', { amt: 0.6 });
  for (let i = 0; i < 14; i++) X.tree((r() < 0.5 ? -1 : 1) * (5 + r() * 25), 14 + r() * 25, 2 + r() * 1.5, bark, leaf, K.scene, r);
  X.fence(-20, 20, 11, 1.1, K.mat('wood', '#8a6a48'));
  const ute = PR.oldTruck(K, '#c8402a'); ute.root.position.set(-4.5, 0, 9.0); ute.root.rotation.y = 0.5;
  K.cyl(0.05, 0.05, 1.6, K.mat('wood', '#5a3a24'), 3.5, 0, 9.6); K.cyl(0.05, 0.05, 1.6, K.mat('wood', '#5a3a24'), 5.1, 0, 9.6);
  X.sign(1.8, 0.6, X.txtTex(768, 256, '#f2e8c8', '#3a2a1a', ['HIGH COUNTRY', 'STATION'], 'bold 84px Georgia, serif'), 4.3, 1.3, 9.62, Math.PI);
  K.addClouds(10, 700, 160);
  // ---- shearing shed at x = SX: wooden floor/walls, windows with light shafts, wool bales, TV camera + LIVE light
  const plank = K.mat('wood', '#a87a4e', { detail: 0.5 }), wall = K.mat('wood', '#7a5434', { detail: 0.8 }), iron = K.mat('metal', '#8a9098');
  K.slab(SX - 9, SX + 9, -0.1, 0, -8, 9, plank, K.scene, false);
  K.slab(SX - 9, SX + 9, 0, 5, -8.4, -8, wall); K.slab(SX - 9.4, SX - 9, 0, 5, -8, 9, wall); K.slab(SX + 9, SX + 9.4, 0, 5, -8, 9, wall);
  K.slab(SX - 9.4, SX + 9.4, 5, 5.2, -8.4, 9, iron, K.scene, false);
  K.slab(SX - 2.5, SX + 2.5, 0, 0.35, -2.2, 1.8, K.mat('wood', '#c89a62', { detail: 0.4 })); // shearing board
  for (const x of [-5.5, 5.5]) { K.slab(SX + x - 1, SX + x + 1, 2.2, 3.6, -8.05, -7.95, K.toon({ color: '#fff4d8', plain: true, emissive: '#fff0c0' })); K.shaft([SX + x, 3.0, -7.9], [SX + x * 0.7, 0, -3], 0.8, 1.6, '#fff0c8', 0.12); }
  const bale = (x, z, ry) => { const b = K.slab(-0.7, 0.7, 0, 1.1, -0.5, 0.5, K.mat('fabric', '#e8dcc0', { detail: 0.3 })); b.position.set(x, 0, z); b.rotation.y = ry; K.solid(b); return b; };
  bale(SX - 7, -6.5, 0.1); bale(SX - 5.5, -6.8, -0.1); bale(SX - 6.3, -6.6, 0.0).position.y = 1.1; bale(SX + 6.8, -6.2, 0.2);
  X.sign(1.0, 0.5, X.txtTex(512, 256, '#e8dcc0', '#6a2a1a', ['WOOL'], 'bold 120px Georgia, serif'), SX - 7, 0.6, -5.98, 0.1, K.scene, 'fabric');
  X.sign(4.2, 0.8, X.txtTex(1024, 192, '#2a4a7a', '#f6f2e8', ['SHEARING DAY!'], 'bold 110px Georgia, serif'), SX, 4.2, -7.95);
  for (let i = 0; i < 4; i++) { const x = SX - 6 + i * 4; K.slab(x - 0.06, x + 0.06, 0, 5, -7.95, -7.85, K.mat('wood', '#5a3a24')); }
  const bench = (x, z) => { const g = K.group(); g.position.set(x, 0, z); K.slab(-1.2, 1.2, 0.42, 0.5, -0.25, 0.25, K.mat('wood', '#8a5a34'), g); for (const a of [-1, 1]) K.slab(a * 1.05 - 0.05, a * 1.05 + 0.05, 0, 0.42, -0.2, 0.2, K.mat('wood', '#5a3a24'), g); return g; };
  bench(SX + 4.2, 3.4); bench(SX - 4.4, 3.6);
  // TV camera on a tripod with a red LIVE light
  const cam = K.group(); cam.position.set(SX - 2.6, 0, 4.4); cam.rotation.y = Math.PI - 0.5;
  for (let i = 0; i < 3; i++) { const l = K.cyl(0.02, 0.02, 1.5, iron, 0, 0, 0, cam); l.rotation.set(0.25 * Math.cos(i * 2.1), 0, 0.25 * Math.sin(i * 2.1)); }
  K.slab(-0.18, 0.18, 1.4, 1.75, -0.35, 0.35, K.mat('metal', '#2a2a30'), cam); K.add(new THREE.CylinderGeometry(0.1, 0.12, 0.25, 16).rotateX(Math.PI / 2), K.mat('metal', '#1a1a1e'), 0, 1.57, 0.45, cam);
  LIVE = K.add(new THREE.SphereGeometry(0.05, 10, 8), K.toon({ color: '#ff2a2a', plain: true, emissive: '#ff2020' }), 0, 1.82, 0.25, cam); K.solid(cam);
  X.sign(1.2, 0.45, X.txtTex(512, 192, '#c81e1e', '#ffffff', ['● LIVE'], 'bold 120px Arial, sans-serif'), SX + 5.5, 3.4, -7.94);
  K.lamp(SX - 1.5, 3.4, 1.5, { color: '#ffd8a0', intensity: 3.2, distance: 10, glowS: 0.5 });
  K.lamp(SX + 2.5, 3.4, -2.5, { color: '#ffd8a0', intensity: 2.6, distance: 10, glowS: 0.5 });
  K.lamp(SX - 4, 3.4, 4.5, { color: '#ffe0b0', intensity: 2.2, distance: 9, glowS: 0.5 });
  K.dust([SX, 2, -3], [10, 3, 8], 160);
  // the wool pile (grows) + the clippers prop
  PILE = K.group(); PILE.position.set(SX + 1.4, 0.35, -0.6);
  const wool = K.mat('fabric', '#f2ead6', { amt: 0.3, bump: 0.006, detail: 0.12 });
  for (let i = 0; i < 34; i++) { const a = r() * 6.28, d = r() * 0.8; const s = K.add(new THREE.SphereGeometry(0.28 + r() * 0.22, 14, 10), wool, Math.cos(a) * d, 0.15 + r() * 0.5 * (1 - d), Math.sin(a) * d * 0.8, PILE); s.scale.y = 0.75; }
  CLIP = K.group(); K.slab(-0.06, 0.06, -0.05, 0.05, -0.16, 0.14, K.mat('metal', '#e8742a'), CLIP); K.slab(-0.07, 0.07, -0.025, 0.025, 0.14, 0.22, K.mat('metal', '#e8e8f0'), CLIP); K.cyl(0.006, 0.006, 0.5, K.mat('metal', '#222'), 0, 0, -0.12, CLIP).rotation.x = -1.2;
  // ---- cast: Shrek (sheep + a giant fleece), a yellow Labrador, people
  SHREK = K.animal('sheep', { seed: 3, color: '#f2ead6' });
  FLEECE = K.group(SHREK.body);
  for (let i = 0; i < 46; i++) { const u = r() * 2 - 1, a = r() * 6.28, rr = Math.sqrt(1 - u * u); const p = [rr * Math.cos(a) * 0.46, u * 0.36 + 0.06, rr * Math.sin(a) * 0.5 - 0.12];
    if (p[2] > 0.12 && Math.abs(p[0]) < 0.3 && p[1] > -0.15) continue; // keep the face free
    const s = K.add(new THREE.SphereGeometry(0.2 + r() * 0.12, 14, 10), wool, p[0], p[1], p[2], FLEECE); s.scale.setScalar(0.85 + r() * 0.25); }
  DOG = K.animal('dog', { seed: 5, color: '#e2b46a' });
  FARMER = K.stick(FARMER_O, { key: 'farmer' }); SHEARER = K.stick(SHEARER_O, { key: 'shearer' }); CAMOP = K.stick(CAMOP_O, { key: 'camop' });
  FAN1 = K.stick(FAN1_O, { key: 'fan1' }); FAN2 = K.stick(FAN2_O, { key: 'fan2' });
}

const F = { six: W(0, 'six'), dodging: W(0, 'dodging'), farmers: W(1, 'farmers'), found: W(1, 'found'), giant: W(1, 'giant'), cloud: W(1, 'cloud'), legs: W(1, 'legs'),
  wool: W(2, 'wool'), k27: W(2, '27'), labrador: W(2, 'labrador'), see: W(3, 'see'), walking: W(3, 'walking'), anyone: W(4, 'anyone'), big: W(4, 'big'),
  sheared: W(5, 'sheared'), live: W(5, 'live'), tv: W(5, 'tv'), country: W(5, 'country'), champion: W(6, 'champion'), switched: W(6, 'switched'), clippers: W(6, 'clippers'),
  twenty: W(7, 'twenty'), skinny: W(7, 'skinny'), stepped: W(7, 'stepped'), pile: W(8, 'pile'), bigger: W(8, 'bigger'), suits: W(8, 'suits'), wonder: W(9, 'wonder'), hid: W(9, 'hid'), six2: W(9, 'six') };

// fleece size: full until the shearing, gone by "skinny"
const fleeceS = (f) => f < F.clippers + 6 ? 1 : f < L[7][0] ? lerp(1, 0.55, (f - F.clippers - 6) / (L[7][0] - F.clippers - 6)) : f < F.skinny ? lerp(0.55, 0, (f - L[7][0]) / (F.skinny - L[7][0])) : 0;
const pileS = (f) => f < F.clippers + 6 ? 0.001 : clamp((f - F.clippers - 6) / (F.skinny - F.clippers - 6));

const farmerKeys = [[0, 'walk', { expr: 'smile' }], [F.found - 4, 'shock', { expr: 'shock' }], [F.giant - 2, 'scared', { expr: 'shock' }], [F.legs + 2, 'pointL', { expr: 'confused' }],
  [cut(2), 'hips', { expr: 'grin' }], [F.labrador - 4, 'pointL', { expr: 'laugh' }], [cut(3), 'facepalm', { expr: 'nervous' }], [F.walking, 'shock', { expr: 'scared' }],
  [cut(4), 'think', { expr: 'confused' }], [F.big - 6, 'shrug', { expr: 'confused', talk: true }]];
const shearerKeys = [[0, 'cheer', { expr: 'proud' }], [cut(5), 'hips', { expr: 'proud' }], [F.tv - 4, 'wave', { expr: 'grin' }], [cut(6), 'show', { R: [0.42, -0.6, 'fist'], expr: 'excited' }],
  [F.switched - 3, 'grab', { expr: 'stern' }], [F.clippers + 4, 'dig', { expr: 'stern' }], [L[7][0] - 6, 'dig', { expr: 'grin' }], [F.skinny - 4, 'shock', { expr: 'shock' }],
  [F.stepped, 'clap', { expr: 'laugh' }], [cut(8), 'pointL', { expr: 'laugh' }], [F.suits - 4, 'cheer', { expr: 'laugh', talk: true }]];
const camKeys = [[0, 'hold', { expr: 'neutral' }], [cut(5), 'hold', { R: [0.3, 0.1, 'fist', true], expr: 'excited' }], [F.country, 'pointL', { expr: 'excited' }], [cut(7), 'shock', { expr: 'shock' }], [F.stepped + 6, 'laugh' ? 'clap' : 'clap', { expr: 'laugh' }]];
const fanKeys = (d) => [[0, 'cheer', { expr: 'excited' }], [cut(5) + d, 'wave', { expr: 'excited', talk: true }], [F.country + d, 'cheer', { expr: 'laugh' }], [cut(6) + d, 'clap', { expr: 'excited' }],
  [F.skinny - 2 + d, 'shock', { expr: 'shock' }], [F.stepped + 4 + d, 'facepalm', { expr: 'laugh' }], [cut(8) + d, 'celebrate', { expr: 'laugh' }], [F.suits + d, 'cheer', { expr: 'laugh' }]];

const S = X.shotList([
  { id: 'hook', f: 0, keys: [{ pos: [1.6, 0.8, -3.6], look: [0, 0.9, -9.8], fov: 42 }, { pos: [1.4, 0.75, -4.2], look: [0, 0.9, -9.8], fov: 38 }] },
  { id: 'peek', f: F.dodging - 6, whip: false, keys: [{ pos: [0.9, 1.0, -6.4], look: [0, 0.9, -10.4], fov: 36 }, { pos: [0.85, 0.98, -6.7], look: [0, 0.9, -10.4], fov: 33 }] },
  { id: 'find', f: cut(1), keys: [{ pos: [3.6, 1.6, 6.0], look: [0.6, 1.0, -1.0], fov: 42 }, { pos: [3.2, 1.55, 5.2], look: [0.4, 1.0, -2.0], fov: 40 }] },
  { id: 'react', f: F.found - 4, whip: false, keys: [{ pos: [-0.4, 1.6, -2.8], look: [0.6, 1.45, 1.4], fov: 36 }, { pos: [-0.3, 1.6, -2.4], look: [0.6, 1.45, 1.4], fov: 33 }] },
  { id: 'cloud', f: F.giant - 4, whip: false, keys: [{ pos: [-2.8, 0.6, 3.6], look: [-0.4, 1.0, -3.0], fov: 46 }, { pos: [-2.6, 0.6, 3.2], look: [-0.4, 1.0, -3.0], fov: 42 }] },
  { id: 'kilos', f: cut(2), keys: [{ pos: [-1.4, 1.1, 2.0], look: [-0.4, 0.8, -2.6], fov: 42 }, { pos: [-1.3, 1.05, 1.7], look: [-0.4, 0.8, -2.6], fov: 38 }] },
  { id: 'lab', f: F.labrador - 6, whip: false, keys: [{ pos: [-2.6, 0.8, 2.0], look: [-1.0, 0.6, -1.6], fov: 42 }, { pos: [-2.5, 0.8, 1.8], look: [-1.0, 0.6, -1.6], fov: 39 }] },
  { id: 'blind', f: cut(3), keys: [{ pos: [-1.8, 1.1, 2.8], look: [0.9, 0.6, -1.7], fov: 42 }, { pos: [-1.6, 1.05, 2.5], look: [1.0, 0.6, -1.7], fov: 40 }] },
  { id: 'think', f: cut(4), keys: [{ pos: [0.2, 1.65, 5.2], look: [0.8, 1.45, 1.6], fov: 36 }, { pos: [0.25, 1.6, 4.9], look: [0.8, 1.45, 1.6], fov: 33 }] },
  { id: 'live', f: cut(5), keys: [{ pos: [SX - 0.5, 2.6, 7.8], look: [SX, 0.9, -0.8], fov: 46 }, { pos: [SX - 0.3, 2.4, 7.0], look: [SX, 0.9, -0.8], fov: 44 }] },
  { id: 'tvcam', f: F.tv - 6, whip: false, keys: [{ pos: [SX - 1.3, 1.7, 2.4], look: [SX - 2.5, 1.55, 4.6], fov: 38 }, { pos: [SX - 1.35, 1.68, 2.6], look: [SX - 2.5, 1.55, 4.6], fov: 35 }] },
  { id: 'fans', f: F.country - 6, whip: false, keys: [{ pos: [SX + 2.8, 1.4, 0.4], look: [SX + 4.2, 1.0, 3.4], fov: 38 }, { pos: [SX + 2.9, 1.4, 0.7], look: [SX + 4.2, 1.0, 3.4], fov: 35 }] },
  { id: 'shearer', f: cut(6), keys: [{ pos: [SX - 0.7, 1.75, 3.0], look: [SX - 1.25, 1.5, -0.2], fov: 36 }, { pos: [SX - 0.75, 1.7, 2.7], look: [SX - 1.25, 1.5, -0.2], fov: 33 }] },
  { id: 'clip', f: F.switched - 4, whip: false, keys: [{ pos: [SX - 1.6, 1.3, 1.6], look: [SX - 0.9, 1.1, 0.0], fov: 38 }, { pos: [SX - 1.55, 1.28, 1.45], look: [SX - 0.9, 1.1, 0.0], fov: 34 }] },
  { id: 'shear', f: cut(7), keys: [{ pos: [SX + 0.4, 1.4, 4.4], look: [SX, 0.8, -0.6], fov: 42 }, { pos: [SX + 0.3, 1.3, 3.6], look: [SX, 0.8, -0.6], fov: 38 }] },
  { id: 'skinny', f: F.skinny - 4, whip: false, keys: [{ pos: [SX + 1.0, 0.95, 3.4], look: [SX + 0.1, 0.7, 0.0], fov: 40 }, { pos: [SX + 0.95, 0.92, 3.1], look: [SX + 0.1, 0.7, 0.0], fov: 36 }] },
  { id: 'pile', f: cut(8), keys: [{ pos: [SX + 2.6, 0.9, 3.0], look: [SX + 0.9, 0.7, -0.4], fov: 42 }, { pos: [SX + 2.4, 0.85, 2.6], look: [SX + 0.9, 0.7, -0.4], fov: 38 }] },
  { id: 'cheer', f: F.suits - 6, whip: false, keys: [{ pos: [SX - 0.2, 1.6, 5.4], look: [SX + 0.4, 1.2, 0], fov: 44 }, { pos: [SX - 0.2, 1.55, 5.0], look: [SX + 0.4, 1.2, 0], fov: 41 }] },
  { id: 'end', f: cut(9), keys: [{ pos: [1.4, 0.75, -4.4], look: [0, 0.8, -9.8], fov: 40 }, { pos: [1.6, 0.8, -3.6], look: [0, 0.9, -9.8], fov: 42 }] },
], TOTAL);
const KICKS = [{ f: F.found, a: 0.03 }, { f: F.walking + 6, a: 0.04 }, { f: F.clippers, a: 0.02 }, { f: F.skinny, a: 0.03 }];
const SHOWN = new Set();
const put = (rig, keys, seed, pos) => { const A = K.T.act(pos.f, keys, { seed, blink: blinkAt(pos.f, seed) }); rig.set(A, pos); SHOWN.add(rig); return A; };

export default {
  TOTAL, build, look: 'rich',
  frame(f, k) {
    const { c: cam, s } = X.camAt(S, f, KICKS), id = s.id; SHOWN.clear();
    if (id === 'cloud') cam.fov *= K.punch(f, F.giant, 0.25, 6);
    if (id === 'skinny') cam.fov *= K.punch(f, F.skinny, 0.22, 6);
    const fx = [], push = (x) => x && fx.push(x);
    const inShed = s.keys[0].pos[0] > 100;
    CLIP.visible = false; PILE.visible = inShed; DOG.root.visible = false;
    const fs = fleeceS(f); FLEECE.scale.setScalar(Math.max(0.001, fs)); FLEECE.visible = fs > 0.01;
    LIVE.visible = Math.floor(f / 12) % 2 === 0;
    PILE.scale.setScalar(Math.max(0.001, pileS(f)));
    const sheepBig = 1.3; // the whole sheep is a bit bigger than life so it reads
    switch (id) {
      case 'hook': case 'peek': { // the giant cloud waddles out of the cave
        const t = clamp(f / (F.dodging + 20));
        SHREK.set(f, { x: 0, z: id === 'peek' ? -10.6 : lerp(-11.2, -8.8, M.smooth(t)), yaw: 0, mode: id === 'peek' ? 'stand' : 'walk', speed: 0.7, expr: id === 'peek' ? 'shock' : 'happy', look: 0.3 * Math.sin(f / 9) });
        SHREK.root.scale.setScalar(sheepBig);
        push(X.wordCard(f, F.six - 2, '6 YEARS', cam, '#f6c83a', 1e9, 200, 0.62, 1.6)); if (id === 'peek') push(X.wordCard(f, F.dodging, 'NO HAIRCUTS', cam, '#ffffff', 1e9, 160, 0.5, 1.6)); break; }
      case 'find': case 'react': case 'cloud': case 'kilos': case 'lab': case 'blind': case 'think': {
        // farmer + Labrador walk up the hill (walkPath), then the cloud walks out
        const Wf = K.walkPath(f, cut(1), [[2.4, 6.0], [1.2, 3.0], [0.8, 1.6]], 1.2, { endYaw: Math.PI });
        put(FARMER, Wf.moving ? [[0, 'walk', { expr: 'smile' }]] : farmerKeys, 2, { f, x: Wf.x, z: Wf.z, yaw: Wf.moving ? Wf.yaw : id === 'think' ? 0.3 : Math.PI });
        const Wd = K.walkPath(f, cut(1) + 6, [[3.2, 6.4], [1.8, 2.6], [-0.6, 0.8], [-1.6, -0.6]], 1.4, { endYaw: 0 });
        DOG.set(f, { x: Wd.x, z: Wd.z, yaw: Wd.moving ? Wd.yaw : Math.PI + 0.3, mode: Wd.moving ? 'run' : f > F.found && f < F.legs ? 'jump' : f > F.labrador - 4 && f < cut(3) ? 'wag' : 'sit',
          expr: f > F.found && f < F.legs ? 'shock' : 'happy', look: Wd.moving ? 0 : -0.3, wag: true }); DOG.root.visible = true;
        // the sheep: out of the cave, then bumbles blind into the boulder
        const Wb = K.walkPath(f, cut(3), [[-0.4, -2.6], [1.0, -1.6]], 0.8);
        const bonk = f > F.walking + 4 && f < F.walking + 20;
        SHREK.set(f, { x: f < cut(3) ? -0.4 : Wb.x, z: f < F.giant ? lerp(-9.0, -2.6, clamp((f - cut(1)) / (F.giant - cut(1)))) : f < cut(3) ? -2.6 : Wb.z, yaw: f < cut(3) ? 0.3 : Wb.moving ? Wb.yaw : 1.0,
          mode: f < F.giant || (f >= cut(3) && Wb.moving) ? 'walk' : bonk ? 'jump' : 'stand', speed: 0.7, expr: bonk ? 'shock' : f > cut(3) ? 'sad' : 'happy', look: f >= cut(3) ? 0.5 * Math.sin(f / 7) : 0.2 * Math.sin(f / 30) });
        SHREK.root.scale.setScalar(sheepBig);
        if (bonk) push(X.FX('stars' + (f % 12), (p) => K.T.fxStars(p, (f % 12) / 12), [1.0, 0.6, -1.6], 0.5, { order: 6 }));
        if (id === 'cloud') push(X.wordCard(f, F.cloud, 'A CLOUD WITH LEGS', cam, '#ffffff', 1e9, 150, 0.62, 1.6));
        if (id === 'kilos') push(X.wordCard(f, F.k27, '27 KG OF WOOL', cam, '#f6c83a', 1e9, 160, 0.62, 1.6));
        if (id === 'lab') push(X.wordCard(f, F.labrador, '= 1 LABRADOR', cam, '#f6c83a', 1e9, 170, 0.62, 1.6));
        if (id === 'blind') push(X.wordCard(f, F.walking + 4, 'BONK!', cam, '#ff7a3a', 1e9, 220, 0.62, 1.6));
        if (id === 'think') push(X.wordCard(f, F.shear ?? W(4, 'shear'), 'SHEAR THAT?!', cam, '#ffffff', 1e9, 170, 0.62, 1.6));
        break; }
      case 'end': { // shorn Shrek scurries back into his cave
        const t = clamp((f - cut(9)) / (TOTAL - cut(9)));
        SHREK.set(f, { x: 0, z: lerp(-7.0, -11.5, t), yaw: Math.PI, mode: 'run', speed: 1.2, expr: 'angry' }); SHREK.root.scale.setScalar(sheepBig * 0.92);
        push(X.wordCard(f, F.hid, 'SEE YOU IN 6 YEARS', cam, '#f6c83a', 1e9, 140, 0.62, 1.6)); break; }
      default: { // the shed
        SHREK.set(f, { x: SX, y: 0.35, z: -0.4, yaw: id === 'skinny' || id === 'pile' ? 0.4 : 0.2, mode: f >= F.stepped ? 'walk' : 'stand', speed: 0.6,
          expr: f < F.clippers ? 'shock' : f < F.skinny ? 'sleepy' : f < cut(8) ? 'shock' : 'angry', look: f >= cut(8) ? 0.5 : 0.2 * Math.sin(f / 20) });
        if (f >= F.stepped) SHREK.root.position.z = -0.4 + Math.min(0.9, (f - F.stepped) / 30 * 0.5);
        SHREK.root.scale.setScalar(sheepBig * (f >= F.skinny ? 0.92 : 1));
        const shKeys = shearerKeys; put(SHEARER, shKeys, 4, { f, x: SX - 1.35, y: 0.35, z: -0.2, yaw: f >= cut(6) && f < F.skinny ? 0.95 : 0.35 });
        if (f >= cut(6)) { CLIP.visible = true; X.holdAt(SHEARER, CLIP, 1, [0, 0.9 + 0.2 * Math.sin(f * 0.8), 0]); if (f > F.switched) CLIP.position.x += 0.004 * Math.sin(f * 7); }
        if (id === 'clip' && CLIP.visible) { const c = CLIP.position; cam.look = [c.x, c.y, c.z]; cam.pos = [c.x + 0.35, c.y + 0.12, c.z + 0.85]; }
        put(CAMOP, camKeys, 6, { f, x: SX - 2.2, z: 4.9, yaw: Math.PI - 0.5 });
        put(FAN1, fanKeys(0), 7, { f, x: SX + 3.7, z: 3.5, yaw: Math.PI + 0.6 }); put(FAN2, fanKeys(3), 8, { f, x: SX + 4.8, z: 3.3, yaw: Math.PI + 0.7 });
        if (f > F.clippers && f < F.skinny) for (let i = 0; i < 3; i++) { const u = ((f + i * 5) % 15) / 15; push(X.FX('wl' + i + q(u, 1), (p) => K.T.fxPuff(p, u), [SX + 0.2 + i * 0.3, 0.6 + u * 0.8, -0.2], 0.5, { order: 6, tint: '#f6f0e0' })); }
        if (id === 'live') push(X.wordCard(f, F.live, 'LIVE ON TV', cam, '#ff5a3a', 1e9, 190, 0.62, 1.6));
        if (id === 'clip') push(X.wordCard(f, F.clippers, 'BZZZZZ', cam, '#f6c83a', 1e9, 200, 0.62, 1.4));
        if (id === 'shear') push(X.wordCard(f, F.twenty - 2, '20 MINUTES LATER', cam, '#ffffff', 1e9, 150, 0.62, 1.6));
        if (id === 'pile') push(X.wordCard(f, F.bigger, 'BIGGER THAN HIM', cam, '#f6c83a', 1e9, 160, 0.62, 1.6));
        if (id === 'cheer') push(X.wordCard(f, F.suits, '20 SUITS', cam, '#9ad04a', 1e9, 200, 0.62, 1.6));
      }
    }
    for (const r of [FARMER, SHEARER, CAMOP, FAN1, FAN2]) if (!SHOWN.has(r)) r.root.visible = false;
    const cl = { hook: [[0, 0.9, -9.5], 10], peek: [[0, 0.8, -10.6], 16], find: [[0.8, 1, 0], 8], react: [[0.6, 1.45, 1.4], 13], cloud: [[-0.4, 0.9, -3], 8], kilos: [[-0.3, 0.7, -2.6], 12],
      lab: [[-1.0, 0.6, -1.4], 13], blind: [[0.8, 0.6, -1.7], 10], think: [[0.8, 1.5, 1.6], 14], live: [[SX, 1, -0.6], 6], tvcam: [[SX - 2.6, 1.6, 4.4], 16], fans: [[SX + 4.2, 1.1, 3.4], 13],
      shearer: [[SX - 1.3, 1.5, -0.2], 13], clip: [[SX - 0.9, 1.1, 0], 18], shear: [[SX, 0.8, -0.5], 8], skinny: [[SX + 0.1, 0.65, -0.2], 16], pile: [[SX + 1.2, 0.7, -0.4], 12], cheer: [[SX, 1.2, 0], 8], end: [[0, 0.8, -9], 10] };
    const dof = cl[id] ? X.focusOn(cam, cl[id][0], cl[id][1]) : { focus: 10, cinf: 4 };
    return { light: inShed ? SHED : DAY, cam, dof, actors: [], fx };
  },
};
