// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "The cat in a hat who saved a railway" (story, inspired by Tama, the cat station master of Kishi Station, Wakayama, 2007–2015).
// One little countryside station (platform + track along x), later rebuilt with a cat face; a tiny office at x≈60.
import { TOTAL, LINES, wf } from './tama_timing.js';
import * as PR from '../props.js';
import * as X from './kit3d.js';
import { blinkAt } from '../motion.js';
const { M, clamp, lerp, q } = X;

export { TOTAL };
const L = LINES, cut = (i) => Math.max(0, L[i][0] - 4), W = wf;
let K, TAMA, CAP, CAPM, BOWL, CRICKET, TRAIN, TRAINC, EARS, WHISK, OLDSIGN, NEWSIGN, CLOSED, BOSS, SHOP, WK1, WK2, TOUR = [], DESKSET;

const BOSS_O = { jacket: '#22305a', pants: '#22305a', boots: '#111', tie: '#c0392b', glasses: true, hairStyle: 'short', hair: '#9a9aa2', moustache: '#9a9aa2', badge: true, skin: '#f2d2b0' };
const SHOP_O = { jacket: '#4a9a6a', dress: '#4a9a6a', pants: '#3a5a4a', boots: '#5a3a2a', hairStyle: 'bun', hair: '#2a1a12', apron: '#f6efe2', scarf: '#f2c84a', skin: '#f2d6b8' };
const WK1_O = { jacket: '#3a6ea5', pants: '#2a3a5a', boots: '#1e1a18', hat: 'cap', cap: '#22305a', tie: '#22305a', belt: '#111', pockets: true, skin: '#e8c4a0' };
const WK2_O = { jacket: '#5a8ac0', pants: '#2a3a5a', boots: '#1e1a18', hat: 'cap', cap: '#22305a', glasses: '#333', scarf: '#e84a5f', badge: true, skin: '#d8a880' };
const TOUR_O = [
  { jacket: '#e84a5f', pants: '#3a3a44', hat: 'cowboy', hatColor: '#c8a060', scarf: '#ffffff', belt: '#5a3a1a', glasses: true },              // tourist with a camera
  { jacket: '#f2c84a', dress: '#f2c84a', hairStyle: 'ponytail', hair: '#5a3a24', scarf: '#3a8ad8', build: 'kid' },                              // kid
  { jacket: '#b8a0d8', dress: '#b8a0d8', hairStyle: 'bun', hair: '#e8e8e8', glasses: '#333', scarf: '#c0392b', apron: '#f6efe2' },             // grandma
  { jacket: '#3aa08a', pants: '#2a2a34', hat: 'beanie', hatColor: '#e86a2a', vest: '#2a4a6a', pockets: true },                                  // backpacker
  { jacket: '#f2f2ea', pants: '#4a6a9a', hairStyle: 'curly', hair: '#2a1a12', bowtie: '#e84a8a', belt: '#222' },                               // fan
  { jacket: '#8a3a3a', pants: '#2a3a4a', hat: 'cap', cap: '#f2c84a', glasses: true, scarf: '#4ac06a', build: 'kid' },                           // kid 2
];
const DAY = { az: 200, el: 34, sky: '#d8ecf8', ground: '#8a9a5a', hemi: 1.0, sun: '#fff1d8', sunI: 3.2, skyTop: '#3f86d8', skyHor: '#d8eef8', fog: '#e2eef4', fogNear: 50, fogFar: 380,
  sat: 1.14, vig: 0.24, shadowExt: 16, exposure: 1.1, ink: 0.55, bloom: 0.7 };
const GLOOM = { ...DAY, sun: '#e8e8f0', sunI: 2.2, skyTop: '#7a8aa0', skyHor: '#c8d0d8', sat: 0.85, fog: '#c8ccd4' };
const OFFICE = { az: 120, el: 50, sky: '#7a6a5a', ground: '#3a2a1e', hemi: 0.7, sun: '#ffe0b0', sunI: 1.0, fog: '#3a2e24', fogNear: 10, fogFar: 30, skyTop: '#3a2e24', skyHor: '#3a2e24',
  sat: 1.1, vig: 0.3, shadowExt: 8, exposure: 1.3, bloom: 0.65, ink: 0.55, cardTint: '#fff0e0' };

const OX = 60; // office origin
const TZ = -3.2; // track centre line (trains run along x)
function trainTex(cat) { return PR.canvasTex(1024, 256, (g, w, h) => {
  g.fillStyle = cat ? '#f6efe2' : '#f2f2ea'; g.fillRect(0, 0, w, h); g.fillStyle = cat ? '#e8742a' : '#c0392b'; g.fillRect(0, h * 0.7, w, h * 0.3); g.fillRect(0, h * 0.05, w, 14);
  for (let i = 0; i < 6; i++) { const x = 40 + i * 162; g.fillStyle = '#2a3a4a'; g.fillRect(x, 50, 120, 90); g.fillStyle = '#6aa8d8'; g.fillRect(x + 6, 56, 108, 50); }
  if (cat) for (let i = 0; i < 7; i++) { const x = 30 + i * 150, y = 205; g.fillStyle = '#2a2a2a'; g.beginPath(); g.arc(x + 40, y, 26, 0, 7); g.fill(); g.beginPath(); g.moveTo(x + 18, y - 14); g.lineTo(x + 24, y - 40); g.lineTo(x + 36, y - 22); g.fill(); g.beginPath(); g.moveTo(x + 62, y - 14); g.lineTo(x + 56, y - 40); g.lineTo(x + 44, y - 22); g.fill();
    g.fillStyle = '#f6efe2'; g.beginPath(); g.arc(x + 31, y - 4, 6, 0, 7); g.arc(x + 49, y - 4, 6, 0, 7); g.fill(); } }); }
function train(cat) {
  const { THREE } = K; const g = K.group(); const tx = trainTex(cat);
  const body = K.add(new THREE.BoxGeometry(11, 2.7, 2.6), [K.toon({ map: tx, plain: true }), K.toon({ map: tx, plain: true }), K.mat('metal', cat ? '#e8742a' : '#c0392b'), K.mat('metal', '#3a3a40'), K.toon({ map: tx, plain: true }), K.toon({ map: tx, plain: true })], 0, 1.65, 0, g);
  for (const sx of [-1, 1]) { const fr = K.add(new THREE.SphereGeometry(1.3, 20, 12, 0, Math.PI), K.mat('metal', cat ? '#f6efe2' : '#f2f2ea'), sx * 5.5, 1.65, 0, g); fr.scale.set(0.35, 1.05, 1.0); fr.rotation.y = sx > 0 ? Math.PI / 2 : -Math.PI / 2;
    K.add(new THREE.PlaneGeometry(1.6, 0.8), K.toon({ color: '#2a3a4a', plain: true }), sx * 5.92, 2.2, 0, g).rotation.y = sx * Math.PI / 2;
    for (const z of [-0.8, 0.8]) K.add(new THREE.SphereGeometry(0.14, 12, 8), K.toon({ color: '#fff8d0', plain: true, emissive: '#fff4c0' }), sx * 5.8, 1.0, z, g);
    if (cat) for (const z of [-0.7, 0.7]) { const e = K.add(new THREE.ConeGeometry(0.35, 0.6, 3), K.mat('fabric', '#2a2a2a', { plain: true }), sx * 5.3, 3.2, z, g); } }
  for (const x of [-4, -2.6, 2.6, 4]) for (const z of [-1.1, 1.1]) { const w = K.add(new THREE.CylinderGeometry(0.4, 0.4, 0.15, 14), K.mat('metal', '#2a2a2a'), x, 0.4, z, g); w.rotation.x = Math.PI / 2; }
  // passengers in the windows (little heads) for the "packed" line
  const heads = K.group(g); for (let i = 0; i < 12; i++) for (const sz of [-1, 1]) { const hd = K.add(new THREE.SphereGeometry(0.17, 12, 10), K.mat('grime', ['#f2d2b0', '#d8a880', '#a8704a', '#f6dcc4'][i % 4], { plain: true }), -4.55 + Math.floor(i / 2) * 1.74 + (i % 2) * 0.55, 2.12, sz * 1.24, heads); }
  g.userData.heads = heads; heads.visible = false; g.position.set(0, -0.9, TZ); return g;
}

function build(k) {
  K = k; X.init(K); const { THREE } = K; const r = X.rnd(2007);
  const grass = K.mat('dirt', '#7aa04a', { detail: 1.4, amt: 0.4 }), plat = K.mat('rock', '#c8bca8', { detail: 0.7, amt: 0.25 }), wood = K.mat('wood', '#9a6a44'), dark = K.mat('wood', '#5a3a24'), roofM = K.mat('rock', '#3a4a6a', { detail: 0.5 });
  // ground, ballast + rails (below platform level), platform at y 0 (z -1.4 .. 3)
  K.slab(-120, 120, -1.0, -0.9, -120, 120, grass, K.scene, false);
  K.slab(-120, 120, -0.9, -0.75, TZ - 1.6, TZ + 1.6, K.mat('rock', '#8a8278', { detail: 0.3 }), K.scene, false);
  for (let x = -120; x < 120; x += 0.7) K.slab(x - 0.12, x + 0.12, -0.75, -0.68, TZ - 1.2, TZ + 1.2, dark, K.scene, false);
  for (const dz of [-0.72, 0.72]) K.slab(-120, 120, -0.68, -0.6, TZ + dz - 0.05, TZ + dz + 0.05, K.mat('metal', '#8a8a92'), K.scene, false);
  K.slab(-14, 14, -0.9, 0, -1.4, 3.2, plat, K.scene, false); K.slab(-14, 14, -0.02, 0.0, -1.45, -1.15, K.mat('grime', '#f2d23a', { plain: true }), K.scene, false);
  // station building (z 3.2 .. 8), ticket booth window at x -1.6, a gate at x 3.0
  const st = K.group(); K.slab(-5, 5, 0, 3.4, 3.2, 8, K.mat('wood', '#e8dcc0', { detail: 0.8 }), st);
  const rf = K.add(new THREE.CylinderGeometry(0.01, 6.6, 2.2, 4, 1).rotateY(Math.PI / 4), roofM, 0, 4.5, 5.6, st); rf.scale.set(1.12, 1, 0.62);
  K.slab(-2.4, -0.8, 1.0, 2.1, 3.15, 3.2, K.toon({ color: '#2a3a4a', plain: true }), st); K.slab(-2.5, -0.7, 0.95, 1.0, 2.9, 3.2, wood, st); // booth window + counter
  K.slab(0.4, 1.8, 0, 2.4, 3.15, 3.2, K.mat('wood', '#6a4428'), st); // door
  for (const x of [2.6, 3.4]) K.slab(x - 0.12, x + 0.12, 0, 1.0, 1.6, 2.2, K.mat('metal', '#5a7a9a'), st); // ticket gate posts
  K.slab(2.6, 3.4, 0.9, 1.0, 1.85, 1.95, K.mat('metal', '#d8b83a'), st);
  OLDSIGN = X.sign(3.6, 0.7, X.txtTex(1024, 192, '#f6f2e8', '#22305a', ['HILLTOP STATION'], 'bold 100px Georgia, serif'), 0, 3.0, 3.16, Math.PI);
  NEWSIGN = X.sign(3.6, 0.7, X.txtTex(1024, 192, '#e8742a', '#ffffff', ['TAMA STATION'], 'bold 110px Georgia, serif'), 0, 3.0, 3.16, Math.PI); NEWSIGN.visible = false;
  CLOSED = X.sign(1.6, 0.9, X.txtTex(512, 288, '#f2f2ea', '#c0392b', ['LINE', 'CLOSING'], 'bold 100px Arial, sans-serif'), -3.6, 1.5, 3.14, Math.PI); CLOSED.visible = false;
  for (const x of [-6, 6]) { const b = K.slab(x - 0.8, x + 0.8, 0.42, 0.5, 2.2, 2.6, wood); K.slab(x - 0.75, x - 0.65, 0, 0.42, 2.3, 2.5, dark); K.slab(x + 0.65, x + 0.75, 0, 0.42, 2.3, 2.5, dark); K.solid(b); }
  for (const x of [-9, 9]) { K.cyl(0.06, 0.06, 3.0, K.mat('metal', '#3a3a40'), x, 0, 0.8); K.add(new THREE.SphereGeometry(0.2, 12, 10), K.toon({ color: '#fff0c0', plain: true }), x, 3.1, 0.8); }
  for (let i = 0; i < 8; i++) { const x = -12 + i * 3.4; K.add(new THREE.SphereGeometry(0.35, 10, 8), K.mat('fabric', ['#e84a8a', '#f2c84a', '#e8742a', '#ffffff'][i % 4], { plain: true }), x, 0.3, 2.9); }
  // the cat-face makeover (shown after "rebuilt"): ears on the roof, round eye-windows with whiskers, a nose
  EARS = K.group(); for (const sx of [-1, 1]) { const e = K.add(new THREE.ConeGeometry(1.3, 2.2, 4), K.mat('rock', '#2a2a30', { detail: 0.5 }), sx * 2.8, 6.2, 5.2, EARS); e.rotation.z = -sx * 0.25;
    const ie = K.add(new THREE.ConeGeometry(0.7, 1.4, 4), K.mat('fabric', '#f0a0a0', { plain: true }), sx * 2.75, 6.0, 4.6, EARS); ie.rotation.z = -sx * 0.25; } EARS.visible = false;
  WHISK = K.group(); for (const sx of [-1, 1]) { const ring = K.add(new THREE.TorusGeometry(0.55, 0.08, 10, 28), K.mat('metal', '#2a2a30'), sx * 2.2 - 0.0, 2.3, 3.1, WHISK);
    for (const a of [-0.25, 0, 0.25]) { const w = K.slab(-0.9, 0, -0.02, 0.02, -0.02, 0.02, K.mat('metal', '#2a2a30'), WHISK); w.position.set(sx * 3.4, 1.6, 3.1); w.rotation.set(0, sx > 0 ? Math.PI : 0, a); } }
  K.add(new THREE.SphereGeometry(0.22, 12, 10), K.mat('fabric', '#e87a8a', { plain: true }), 0, 1.75, 3.15, WHISK); WHISK.visible = false;
  // countryside: fields, hills, trees, little houses
  for (let i = 0; i < 9; i++) { const x = -160 + i * 40, h = 30 + r() * 30; K.add(new THREE.SphereGeometry(h, 16, 10), K.mat('grime', '#5a8a4a', { amt: 0.5, detail: 6 }), x, -h * 0.55, 90 + r() * 30); }
  for (let i = 0; i < 9; i++) { const x = -160 + i * 40, h = 30 + r() * 30; K.add(new THREE.SphereGeometry(h, 16, 10), K.mat('grime', '#5a8a4a', { amt: 0.5, detail: 6 }), x, -h * 0.55, -90 - r() * 30); }
  const bark = K.mat('wood', '#5a4232'), leaf = K.mat('grime', '#4a8a3a', { amt: 0.6 }), pink = K.mat('grime', '#f2a0c0', { amt: 0.4 });
  for (let i = 0; i < 40; i++) { const x = (r() - 0.5) * 120, z = (r() < 0.5 ? 1 : -1) * (12 + r() * 40); X.tree(x, z, 2 + r() * 1.5, bark, i % 4 === 0 ? pink : leaf, K.scene, r).position.y = -0.9; }
  for (let i = 0; i < 6; i++) { const x = -40 + i * 16 + (r() - 0.5) * 6, z = 22 + r() * 12; K.slab(x - 2.5, x + 2.5, -0.9, 2.6, z - 2, z + 2, K.mat('plaster', ['#f2ead8', '#e8dcc0', '#f6efe2'][i % 3]));
    const rr = K.add(new THREE.CylinderGeometry(0.01, 3.4, 1.6, 4, 1).rotateY(Math.PI / 4), K.mat('rock', ['#3a4a6a', '#7a3a2a', '#3a5a3a'][i % 3]), x, 3.4, z); rr.scale.set(1, 1, 0.7); }
  K.addClouds(10, 700, 160);
  // the office at x = OX: plaster walls, window, a tiny desk with a tiny lamp + nameplate
  K.slab(OX - 4, OX + 4, -0.1, 0, -4, 4, K.mat('wood', '#a87a4e', { detail: 0.5 }), K.scene, false);
  K.slab(OX - 4, OX + 4, 0, 3.4, 3.6, 4, K.mat('plaster', '#f2e2c8')); K.slab(OX - 4, OX - 3.6, 0, 3.4, -4, 4, K.mat('plaster', '#f2e2c8'));
  K.slab(OX + 0.6, OX + 2.2, 1.2, 2.4, 3.55, 3.6, K.toon({ color: '#cfe8f8', plain: true, emissive: '#bfe0f8' }));
  X.sign(1.2, 0.8, X.txtTex(384, 256, '#e8742a', '#ffffff', ['TAMA', '★'], 'bold 90px Georgia, serif'), OX - 1.2, 2.2, 3.55, Math.PI);
  DESKSET = K.group(); DESKSET.position.set(OX, 0, 1.6);
  K.slab(-0.35, 0.35, 0.36, 0.4, -0.2, 0.2, K.mat('wood', '#8a5a34'), DESKSET); for (const [a, b] of [[-0.3, -0.15], [0.3, -0.15], [-0.3, 0.15], [0.3, 0.15]]) K.slab(a - 0.02, a + 0.02, 0, 0.36, b - 0.02, b + 0.02, dark, DESKSET);
  K.cyl(0.01, 0.01, 0.18, K.mat('metal', '#2a2a2a'), -0.22, 0.4, 0.05, DESKSET); K.add(new THREE.ConeGeometry(0.06, 0.07, 12, 1, true), K.mat('metal', '#3a6a3a'), -0.22, 0.6, 0.05, DESKSET);
  X.sign(0.3, 0.08, X.txtTex(512, 128, '#22305a', '#f2c84a', ['STATION MASTER'], 'bold 56px Georgia, serif'), 0.1, 0.45, -0.21, Math.PI, DESKSET);
  K.slab(-0.12, 0.0, 0.4, 0.41, -0.05, 0.1, K.mat('grime', '#f6f2ea', { plain: true }), DESKSET);
  // props: food bowl, the cricket
  BOWL = K.group(); K.cyl(0.18, 0.12, 0.1, K.mat('metal', '#3a6ea5'), 0, 0, 0, BOWL); for (let i = 0; i < 12; i++) K.add(new THREE.SphereGeometry(0.035, 6, 5), K.mat('grime', '#a8642a', { plain: true }), (r() - 0.5) * 0.2, 0.1, (r() - 0.5) * 0.2, BOWL);
  BOWL.position.set(-3.0, 0, 1.8);
  CRICKET = K.group(); const cg = K.mat('fabric', '#5aa83a', { plain: true }); K.add(new THREE.CapsuleGeometry(0.05, 0.14, 6, 10), cg, 0, 0, 0, CRICKET).rotation.x = Math.PI / 2;
  K.add(new THREE.SphereGeometry(0.045, 10, 8), cg, 0, 0.02, 0.11, CRICKET); for (const sx of [-1, 1]) { const lg = K.slab(-0.008, 0.008, -0.07, 0.06, -0.008, 0.008, cg, CRICKET); lg.position.set(sx * 0.05, 0.02, -0.05); lg.rotation.z = sx * 0.6;
    const an = K.add(new THREE.CylinderGeometry(0.004, 0.004, 0.16, 4), cg, sx * 0.02, 0.1, 0.16, CRICKET); an.rotation.x = 0.8; an.rotation.z = sx * 0.3;
    for (const e of [0]) K.add(new THREE.SphereGeometry(0.014, 8, 6), K.toon({ color: '#111', plain: true }), sx * 0.025, 0.045, 0.14, CRICKET); }
  const tk = K.slab(-0.03, 0.03, 0, 0.002, -0.05, 0.05, K.toon({ color: '#f6efe2', plain: true }), CRICKET); tk.position.set(0, 0.07, 0.2); tk.rotation.x = -0.6;
  CRICKET.position.set(-1.6, 1.02, 3.0); CRICKET.rotation.y = Math.PI; CRICKET.scale.setScalar(1.4);
  // lamps
  K.lamp(-1.6, 2.4, 2.6, { color: '#ffd8a0', intensity: 2.0, distance: 7, glowS: 0.4 });
  K.lamp(OX - 0.2, 1.4, 0.6, { color: '#ffd8a0', intensity: 2.8, distance: 6, glowS: 0.3 });
  K.lamp(OX + 2, 2.8, -1, { color: '#ffe0b0', intensity: 2.0, distance: 8, glowS: 0.0 });
  // trains
  TRAIN = train(false); TRAINC = train(true);
  // cast: Tama (calico cat) with a little station-master cap
  TAMA = K.animal('cat', { seed: 7, scale: 1.35, color: '#f6efe2', stripes: '#e08a3a' });
  CAP = K.group(TAMA.head); CAPM = [K.mat('fabric', '#22305a'), K.mat('metal', '#f2c84a')];
  const crown = K.add(new THREE.CylinderGeometry(0.1, 0.11, 0.08, 18), CAPM[0], 0, 0, 0, CAP); const brim = K.add(new THREE.CylinderGeometry(0.06, 0.06, 0.012, 18), CAPM[0], 0, -0.035, 0.08, CAP); brim.scale.set(1.3, 1, 1.1);
  K.add(new THREE.SphereGeometry(0.02, 8, 6), K.mat('metal', '#f2c84a'), 0, 0.0, 0.105, CAP); CAP.position.set(0, 0.13, 0.0); CAP.rotation.x = -0.15; CAP.userData.parts = [crown, brim];
  BOSS = K.stick(BOSS_O, { key: 'boss' }); SHOP = K.stick(SHOP_O, { key: 'shop' }); WK1 = K.stick(WK1_O, { key: 'wk1' }); WK2 = K.stick(WK2_O, { key: 'wk2' });
  TOUR = TOUR_O.map((o, i) => K.stick({ boots: '#2a2018', skin: ['#f2d2b0', '#d8a880', '#f6dcc4', '#a8704a', '#e8c4a0', '#c88a5a'][i], ...o }, { key: 'tour' + i }));
}

const F = { cat: W(0, 'cat'), hat: W(0, 'hat'), uniform: W(1, 'uniform'), cap: W(1, 'cap'), salary: W(1, 'salary'), food: W(1, 'food'), empty: W(2, 'empty'), crickets: W(2, 'crickets'),
  tickets: W(2, 'tickets'), broke: W(3, 'broke'), sent: W(3, 'sent'), home: W(3, 'home'), shut: W(4, 'shut'), down: W(4, 'down'), shopkeeper: W(5, 'shopkeeper'), tama: W(5, 'tama'), moved: W(5, 'moved'),
  booth: W(5, 'booth'), boss: W(6, 'boss'), official: W(6, 'official'), master: W(6, 'master'), greeted: W(7, 'greeted'), still: W(7, 'still'), kids: W(8, 'kids'), grandmas: W(8, 'grandmas'),
  bowed: W(8, 'bowed'), yawned: W(8, 'yawned'), weird: W(9, 'weird'), tourists: W(10, 'tourists'), ten: W(10, 'ten'), hundred: W(10, 'hundred'), busloads: W(10, 'busloads'), packed: W(11, 'packed'),
  see: W(11, 'see'), millions: W(12, 'millions'), promoted: W(13, 'promoted'), super: W(13, 'super'), gold: W(13, 'gold'), office: W(14, 'office'), tiny: W(14, 'tiny'), famous: W(15, 'famous'),
  rebuilt: W(16, 'rebuilt'), face: W(16, 'face'), ears: W(17, 'ears'), whiskers: W(17, 'whiskers'), painted: W(18, 'painted'), seat: W(18, 'seat'), fans: W(19, 'fans'), hours: W(19, 'hours'),
  blinked: W(20, 'blinked'), saved: W(21, 'saved'), follow: W(22, 'follow') };
const GOLD = F.gold - 2, CATFACE = F.rebuilt + 10;

const bossKeys = [[0, 'cheer', { expr: 'laugh' }], [cut(3), 'hips', { expr: 'sad' }], [F.sent - 3, 'wave', { expr: 'sad' }], [cut(4), 'hold', { R: [0.3, -0.1, 'sign'], expr: 'sad' }], [F.down, 'facepalm', { expr: 'sad' }],
  [cut(6), 'show', { expr: 'grin' }], [F.official - 2, 'pointDown', { expr: 'proud', talk: true }], [F.master - 2, 'salute', { expr: 'proud' }], [cut(10), 'shock', { expr: 'shock' }],
  [cut(12), 'cheer', { expr: 'laugh' }], [cut(13), 'salute', { expr: 'proud' }], [F.gold, 'clap', { expr: 'laugh' }], [cut(16), 'hammer', { expr: 'grin' }], [cut(19), 'cheer', { expr: 'laugh' }]];
const shopKeys = [[0, 'cheer', { expr: 'laugh' }], [cut(5), 'hold', { R: [0.3, 0.2, 'fist'], expr: 'smile' }], [F.moved - 2, 'pointL', { expr: 'grin' }], [cut(6), 'clap', { expr: 'excited' }],
  [cut(12), 'show', { R: [0.42, -0.6, 'moneybag'], expr: 'laugh' }], [F.millions + 6, 'celebrate', { expr: 'laugh' }], [cut(19), 'wave', { expr: 'excited' }]];
const wkKeys = (d) => [[0, 'idle', { expr: 'sad' }], [cut(3) + d, 'carry', { item: 'box', expr: 'sad' }], [cut(16), 'hammer', { expr: 'grin' }], [F.face, 'cheer', { expr: 'laugh' }]];
const tourKeys = (i) => [[0, i % 2 ? 'phone' : 'cheer', { R: i % 2 ? [-0.25, -0.55, 'phone', true] : undefined, expr: 'excited' }],
  [cut(8), i === 1 || i === 5 ? 'wave' : i === 2 ? 'salute' : 'clap', { expr: i === 2 ? 'smile' : 'excited' }],
  [cut(10), 'phone', { R: [-0.25, -0.55, 'phone', true], expr: 'excited' }], [F.hundred + i * 3, i % 2 ? 'cheer' : 'wave', { expr: 'laugh' }], [cut(11), 'phone', { R: [-0.25, -0.55, 'phone', true], expr: 'grin' }],
  [cut(17), 'pointUp', { expr: 'excited' }], [cut(19), i % 2 ? 'phone' : 'idle', { R: i % 2 ? [-0.25, -0.55, 'phone', true] : undefined, expr: 'excited' }], [F.hours, 'lookAround', { expr: 'smile' }],
  [cut(21), 'phone', { R: [-0.25, -0.55, 'phone', true], expr: 'excited' }]];

// shot list: [id, start frame, camera keys, whip?]
const C = (pos, look, fov) => ({ pos, look, fov });
const S = X.shotList([
  { id: 'hook', f: 0, keys: [C([3.0, 2.2, -2.6], [3.0, 1.5, 2.6], 58), C([3.0, 2.1, -2.2], [3.0, 1.4, 2.6], 54)] },
  { id: 'capcu', f: F.uniform - 4, keys: [C([3.4, 0.85, 0.3], [3.0, 0.66, 2.05], 38), C([3.36, 0.83, 0.45], [3.0, 0.66, 2.05], 35)] },
  { id: 'bowl', f: F.salary - 4, whip: false, keys: [C([-2.6, 0.7, 0.9], [-3.0, 0.1, 1.8], 40), C([-2.65, 0.65, 1.0], [-3.0, 0.1, 1.8], 36)] },
  { id: 'empty', f: cut(2), keys: [C([-9, 2.6, -6.5], [0, 0.6, 2], 46), C([-8, 2.2, -6.0], [0, 0.6, 2], 44)] },
  { id: 'cricket', f: F.crickets - 4, whip: false, keys: [C([-1.45, 1.15, 2.2], [-1.6, 1.07, 3.05], 38), C([-1.47, 1.13, 2.3], [-1.6, 1.07, 3.05], 34)] },
  { id: 'workers', f: cut(3), keys: [C([-4.0, 1.6, -0.6], [0.0, 1.2, 2.0], 44), C([-3.6, 1.55, -0.6], [0.6, 1.2, 2.0], 42)] },
  { id: 'closing', f: cut(4), keys: [C([-2.6, 1.6, -0.2], [-3.4, 1.4, 2.6], 38), C([-2.7, 1.55, 0.0], [-3.4, 1.4, 2.6], 35)] },
  { id: 'stray', f: cut(5), keys: [C([-0.4, 1.0, -0.6], [-1.8, 0.7, 2.2], 42), C([-0.6, 1.0, -0.4], [-1.8, 0.8, 2.6], 40)] },
  { id: 'booth', f: F.moved - 4, whip: false, keys: [C([-1.3, 1.6, 0.6], [-1.6, 1.35, 3.0], 38), C([-1.32, 1.58, 0.75], [-1.6, 1.35, 3.0], 35)] },
  { id: 'official', f: cut(6), keys: [C([2.2, 1.35, -0.9], [3.4, 1.05, 1.8], 42), C([2.3, 1.32, -0.7], [3.4, 1.05, 1.8], 38)] },
  { id: 'capon', f: F.master - 6, whip: false, keys: [C([3.4, 0.85, 0.3], [3.0, 0.66, 2.05], 38), C([3.36, 0.83, 0.45], [3.0, 0.66, 2.05], 35)] },
  { id: 'arrive', f: cut(7), keys: [C([7.5, 0.6, -0.6], [0, 1.2, -2.6], 46), C([7.2, 0.6, -0.4], [0, 1.2, -2.6], 44)] },
  { id: 'still', f: F.still - 6, whip: false, keys: [C([3.4, 0.85, 0.3], [3.0, 0.66, 2.05], 38), C([3.36, 0.83, 0.45], [3.0, 0.66, 2.05], 35)] },
  { id: 'kids', f: cut(8), keys: [C([4.8, 1.1, -0.8], [2.0, 1.0, 1.0], 46), C([4.7, 1.1, -0.6], [2.0, 1.0, 1.0], 43)] },
  { id: 'yawn', f: F.yawned - 5, whip: false, keys: [C([3.4, 0.85, 0.3], [3.0, 0.66, 2.05], 38), C([3.36, 0.83, 0.45], [3.0, 0.66, 2.05], 35)] },
  { id: 'weird', f: cut(9), keys: [C([6.0, 1.8, -1.2], [2.0, 1.0, 1.6], 46), C([5.6, 1.7, -0.8], [2.0, 1.0, 1.6], 44)] },
  { id: 'crowd', f: cut(10), keys: [C([6.4, 1.6, 2.8], [2.0, 0.9, 0.8], 50), C([6.6, 1.9, 2.9], [2.0, 0.9, 0.8], 50)] },
  { id: 'busload', f: F.busloads - 4, whip: false, keys: [C([8.0, 4.5, -2.0], [0, 0.6, 1.4], 52), C([8.5, 5.0, -2.4], [0, 0.6, 1.4], 52)] },
  { id: 'packed', f: cut(11), keys: [C([-6.0, 1.6, 2.0], [-1.5, 1.6, -3.0], 48), C([-5.6, 1.6, 2.0], [-1.0, 1.6, -3.0], 46)] },
  { id: 'money', f: cut(12), keys: [C([-1.0, 1.6, -0.6], [-0.4, 1.3, 2.4], 40), C([-1.0, 1.55, -0.4], [-0.4, 1.3, 2.4], 36)] },
  { id: 'promote', f: cut(13), keys: [C([2.2, 1.3, -0.8], [3.4, 1.0, 1.8], 42), C([2.3, 1.28, -0.6], [3.4, 1.0, 1.8], 38)] },
  { id: 'goldhat', f: GOLD - 4, whip: false, keys: [C([3.4, 0.85, 0.3], [3.0, 0.66, 2.05], 38), C([3.36, 0.83, 0.45], [3.0, 0.66, 2.05], 35)] },
  { id: 'office', f: cut(14), keys: [C([OX + 0.9, 0.8, -0.6], [OX, 0.55, 1.7], 40), C([OX + 0.7, 0.75, -0.4], [OX, 0.55, 1.7], 36)] },
  { id: 'famous', f: cut(15), keys: [C([3.4, 0.85, 0.3], [3.0, 0.66, 2.05], 38), C([3.36, 0.83, 0.45], [3.0, 0.66, 2.05], 35)] },
  { id: 'rebuild', f: cut(16), keys: [C([0, 2.6, -6.0], [0, 3.0, 4.0], 52), C([0, 2.4, -5.0], [0, 3.2, 4.0], 52)] },
  { id: 'ears', f: F.ears - 4, keys: [C([1.0, 2.0, -1.0], [2.4, 5.4, 4.6], 44), C([1.1, 2.0, -0.8], [2.4, 5.6, 4.6], 42)] },
  { id: 'whisk', f: F.whiskers - 4, whip: false, keys: [C([2.6, 1.9, 0.0], [2.6, 1.9, 3.1], 42), C([2.6, 1.9, 0.2], [2.6, 1.9, 3.1], 40)] },
  { id: 'cattrain', f: cut(18), keys: [C([9.0, 1.2, 1.0], [0, 1.4, -3.2], 46), C([8.6, 1.2, 1.0], [0, 1.4, -3.2], 44)] },
  { id: 'queue', f: cut(19), keys: [C([-6.0, 1.6, -0.8], [0.0, 1.1, 1.0], 44), C([-5.6, 1.55, -0.6], [0.0, 1.1, 1.0], 42)] },
  { id: 'blink', f: cut(20), keys: [C([3.4, 0.85, 0.3], [3.0, 0.66, 2.05], 38), C([3.36, 0.83, 0.45], [3.0, 0.66, 2.05], 35)] },
  { id: 'end', f: cut(21), keys: [C([3.0, 2.1, -2.2], [3.0, 1.4, 2.6], 54), C([3.0, 2.2, -2.6], [3.0, 1.5, 2.6], 58)] },
], TOTAL);
const KICKS = [{ f: F.master, a: 0.02 }, { f: F.busloads, a: 0.03 }, { f: F.gold, a: 0.02 }, { f: F.face, a: 0.03 }];
const SHOWN = new Set();
const put = (rig, keys, seed, pos) => { const A = K.T.act(pos.f, keys, { seed, blink: blinkAt(pos.f, seed) }); rig.set(A, pos); SHOWN.add(rig); return A; };
const crowdN = (f) => f < cut(10) ? 3 : f < F.hundred ? 3 : f < F.busloads ? 4 : 6;

export default {
  TOTAL, build, look: 'rich',
  frame(f, k) {
    const { c: cam, s } = X.camAt(S, f, KICKS), id = s.id; SHOWN.clear();
    if (id === 'busload') cam.fov *= K.punch(f, F.busloads, 0.18, 6);
    if (id === 'rebuild') cam.fov *= K.punch(f, F.face, 0.2, 6);
    const fx = [], push = (x) => x && fx.push(x);
    const flash = id === 'hook' || id === 'end';
    const catFace = flash || f >= CATFACE, gold = flash || f >= GOLD, gloom = f >= cut(2) && f < cut(5) && !flash;
    EARS.visible = WHISK.visible = NEWSIGN.visible = catFace; OLDSIGN.visible = !catFace; CLOSED.visible = f >= F.shut - 4 && f < cut(6) && !flash;
    CAP.visible = flash || f >= F.master - 2 || (f >= F.uniform - 4 && f < F.salary); CAP.userData.parts.forEach((m) => { m.material = gold ? CAPM[1] : CAPM[0]; });
    CRICKET.visible = id === 'cricket' || id === 'empty'; BOWL.visible = !flash;
    // trains: normal train arrives on "greeted" and the packed train; cat train later
    TRAIN.visible = false; TRAINC.visible = false; TRAIN.userData.heads.visible = false;
    const arrive = (tr, f0, f1) => { tr.visible = true; const t = clamp((f - f0) / Math.max(1, f1 - f0)); tr.position.x = lerp(-30, 0, 1 - Math.pow(1 - t, 3)); };
    if (id === 'arrive' || id === 'still') arrive(TRAIN, cut(7), F.still - 4);
    if (id === 'packed') { arrive(TRAIN, cut(11) - 30, cut(11) + 30); TRAIN.userData.heads.visible = true; }
    if (id === 'cattrain' || id === 'queue') { TRAINC.visible = true; TRAINC.position.x = id === 'cattrain' ? lerp(-30, 0, 1 - Math.pow(1 - clamp((f - cut(18)) / 60), 3)) : 0; }
    // Tama
    const office = id === 'office';
    if (office) TAMA.set(f, { x: OX, y: 0.42, z: 2.05, yaw: Math.PI, mode: 'sit', expr: f > F.tiny ? 'happy' : 'neutral', look: 0.2 * Math.sin(f / 20) });
    else if (f >= cut(5) && f < F.boss - 4 && !flash) { // stray: walks in from the shop, hops into the booth window
      const Wt = K.walkPath(f, cut(5), [[-4.0, 0.6], [-2.6, 1.6], [-1.6, 2.4]], 1.5, { endYaw: Math.PI });
      TAMA.set(f, { x: Wt.x, y: Wt.done ? 1.0 : 0, z: Wt.done ? 3.0 : Wt.z, yaw: Wt.done ? Math.PI : Wt.yaw, mode: Wt.moving ? 'walk' : 'sit', expr: 'happy', look: Wt.done ? 0.3 * Math.sin(f / 14) : 0 });
    } else if (f < cut(2) || flash || f >= F.boss - 4) {
      const yawn = f >= F.yawned - 2 && f < F.yawned + 22, blink = id === 'blink' && f >= F.blinked - 2 && f < F.blinked + 8;
      TAMA.set(f, { x: 3.0, y: 0, z: 2.05, yaw: Math.PI, mode: id === 'famous' && f > F.famous ? 'stand' : 'sit', expr: yawn || blink ? 'sleepy' : id === 'famous' ? 'shock' : f >= F.rebuilt && f < F.ears ? 'shock' : 'happy',
        look: id === 'famous' ? 0.5 * Math.sin(f / 6) : id === 'kids' ? 0.3 : 0.15 * Math.sin(f / 25), nod: yawn ? -0.35 : 0 });
    } else TAMA.root.visible = false;
    if (id === 'empty' || id === 'workers' || id === 'closing' || id === 'cricket') TAMA.root.visible = false;
    // people
    const bossAt = { workers: [0.2, 1.2, Math.PI + 0.4], closing: [-3.3, 2.2, Math.PI], official: [3.9, 1.6, -1.1], capon: [3.9, 1.6, -1.1], money: [-1.8, 1.6, Math.PI - 0.4], promote: [3.9, 1.6, -1.1],
      goldhat: [3.9, 1.6, -1.1], hook: [1.6, 1.4, -0.3], end: [1.6, 1.4, -0.3], rebuild: [-1.6, 1.0, Math.PI], crowd: [1.4, 2.0, -0.6], kids: [0.6, 1.9, -0.6] }[id];
    if (bossAt) put(BOSS, bossKeys, 2, { f, x: bossAt[0], z: bossAt[1], yaw: bossAt[2] });
    const shopAt = { stray: [-4.6, 0.4, 0.6], booth: [-2.8, 1.4, 0.4], official: [0.6, 1.3, 0.3], money: [-0.2, 1.9, Math.PI + 0.3], hook: [4.6, 1.2, -0.5], end: [4.6, 1.2, -0.5], queue: [-1.2, 2.4, -0.4] }[id];
    if (shopAt) put(SHOP, shopKeys, 3, { f, x: shopAt[0], z: shopAt[1], yaw: shopAt[2] });
    if (id === 'workers') { // two staff carry boxes off down the platform
      for (const [rig, d, z, sd] of [[WK1, 0, 0.4, 4], [WK2, 8, 1.4, 5]]) { const Ww = K.walkPath(f, cut(3) + d, [[0.4, z], [-9, z]], 1.2); put(rig, Ww.moving ? [[0, 'carry', { item: 'box', expr: 'sad' }]] : wkKeys(d), sd, { f, x: Ww.x, z: Ww.z, yaw: Ww.moving ? Ww.yaw : -Math.PI / 2 }); } }
    if (id === 'rebuild' || id === 'ears') { put(WK1, wkKeys(0), 4, { f, x: 1.6, z: 2.3, yaw: Math.PI }); put(WK2, wkKeys(4), 5, { f, x: -3.2, z: 2.4, yaw: Math.PI });
      if (f >= F.rebuilt && f < CATFACE + 14) push(X.FX('pf' + q(clamp((f - F.rebuilt) / 30), 1), (p) => K.T.fxPuff(p, clamp((f - F.rebuilt) / 30)), [0, 3.0, 3.0], 2.6, { order: 6 })); }
    // tourists: how many depends on the moment; positions in an arc facing Tama
    const tourShots = { hook: 6, end: 6, kids: 3, crowd: crowdN(f), busload: 6, weird: 2, packed: 0, rebuild: 4, ears: 4, queue: 6, still: 0, promote: 3, goldhat: 0, cattrain: 4 };
    const nT = tourShots[id] ?? 0;
    const SLOTS = [[1.4, 1.2], [1.8, 0.2], [4.5, 0.8], [0.5, 0.8], [5.4, 1.6], [0.9, -0.4]];
    for (let i = 0; i < nT; i++) { let [x, z] = SLOTS[i]; let yaw = Math.atan2(3.0 - x, 2.05 - z);
      if (id === 'hook' || id === 'end') { [x, z] = [[2.15, 1.0], [3.85, 1.0], [1.6, 0.3], [4.4, 0.3], [1.1, 1.3], [4.9, 1.3]][i]; yaw = Math.atan2(3.0 - x, 2.05 - z); }
      if (id === 'queue') { x = -2.0 - i * 0.9; z = 0.9; yaw = Math.PI / 2; }
      if (id === 'cattrain') { x = -4.5 + i * 1.6; z = 0.2; yaw = Math.PI; }
      if (id === 'weird') { x = 9 - i * 1.2 - (f - cut(9)) / 30 * 1.4; z = 0.4 + i * 0.6; yaw = -Math.PI / 2; }
      const A = put(TOUR[i], tourKeys(i), 10 + i, { f, x, z, yaw });
      if (i === 2 && id === 'kids' && f >= F.bowed - 4 && f < F.yawned) TOUR[i].root.rotation.x = 0.35 * Math.sin(Math.PI * clamp((f - F.bowed + 4) / 24)); // grandma bows
      if ((id === 'hook' || id === 'crowd' || id === 'busload' || id === 'end') && i % 2 && (f + i * 7) % 26 < 3) push(X.FX('fl' + i + (f % 26), (p) => K.T.fxBurst(p, 0.6, '#ffffff'), [x, 1.2, z], 0.35, { order: 6 })); }
    // word cards
    const card = (f0, t, c = '#f6c83a', size = 180) => push(X.wordCard(f, f0, t, cam, c, 1e9, size, 0.62, 1.6));
    switch (id) {
      case 'hook': card(F.cat - 2, '1 CAT. 1 HAT.'); break;
      case 'capcu': card(F.cap - 2, 'STATION MASTER CAP', '#ffffff', 140); break;
      case 'bowl': card(F.salary, 'SALARY: CAT FOOD', '#f6c83a', 150); break;
      case 'empty': card(F.empty, '0 PASSENGERS', '#ffffff', 170); break;
      case 'cricket': card(F.tickets - 4, '1 TICKET, PLEASE', '#9ad04a', 150); break;
      case 'workers': card(F.broke, 'BROKE', '#ff5a3a', 200); break;
      case 'closing': card(F.shut, 'LINE CLOSING', '#ff5a3a', 170); break;
      case 'booth': card(F.booth, 'NEW HIRE?', '#ffffff', 190); break;
      case 'capon': card(F.master, 'STATION MASTER', '#f6c83a', 160); break;
      case 'still': card(F.still - 2, 'PERFECTLY STILL', '#ffffff', 160); break;
      case 'yawn': card(F.yawned, 'YAWN', '#ffffff', 220); break;
      case 'weird': card(F.weird - 4, 'THEN THINGS GOT WEIRD', '#ff7a3a', 130); break;
      case 'crowd': card(F.ten, f < F.hundred ? '10' : '100', '#f6c83a', 240); break;
      case 'busload': card(F.busloads, 'BUSLOADS!', '#ff7a3a', 200); break;
      case 'packed': card(F.packed + 2, 'PACKED', '#f6c83a', 210); break;
      case 'money': card(F.millions, 'MILLIONS', '#9ad04a', 200); if (f > F.millions) push(X.FX('cn' + (f % 20), (p) => K.T.fxBurst(p, ((f - F.millions) % 20) / 20, '#f6c83a'), [-0.4, 1.5, 1.8], 0.8, { order: 6 })); break;
      case 'goldhat': card(F.gold, 'GOLD HAT', '#f6c83a', 200); break;
      case 'office': card(F.tiny, 'TINY DESK', '#f6c83a', 190); break;
      case 'famous': card(F.famous - 2, 'MORE FAMOUS?', '#ffffff', 170); break;
      case 'rebuild': card(F.face, 'CAT STATION', '#e8742a', 190); break;
      case 'ears': card(F.ears, 'EARS', '#f6c83a', 210); break;
      case 'whisk': card(F.whiskers, 'WHISKERS', '#f6c83a', 200); break;
      case 'cattrain': card(F.seat - 4, 'THE CAT TRAIN', '#e8742a', 170); break;
      case 'queue': card(F.hours, 'HOURS', '#ffffff', 210); break;
      case 'blink': card(F.blinked + 2, '*BLINK*', '#ffffff', 200); break;
      case 'end': if (f >= F.follow - 4) card(F.follow - 2, 'A NEW STORY EVERY DAY', '#f6c83a', 130); else card(F.saved, 'SAVED A RAILWAY', '#f6c83a', 150); break;
    }
    for (const r of [BOSS, SHOP, WK1, WK2, ...TOUR]) { if (!SHOWN.has(r)) r.root.visible = false; else if (!(id === 'kids' && r === TOUR[2])) r.root.rotation.x = 0; }
    const cl = { hook: [[3, 1, 2], 8], capcu: [[3, 1.0, 2.0], 16], bowl: [[-3, 0.1, 1.8], 18], empty: [[0, 1, 2], 5], cricket: [[-1.6, 1.07, 3.0], 20], workers: [[0, 1.2, 1.0], 10], closing: [[-3.4, 1.4, 2.4], 13],
      stray: [[-2.4, 0.6, 1.8], 10], booth: [[-1.6, 1.2, 2.9], 16], official: [[2.4, 1.2, 1.8], 12], capon: [[3, 0.95, 2], 16], arrive: [[0, 1.2, -3], 6], still: [[3, 0.8, 2], 14], kids: [[2.2, 0.9, 1.2], 10],
      yawn: [[3, 0.95, 2], 16], weird: [[3, 1, 2], 8], crowd: [[2.6, 0.9, 1.4], 8], busload: [[2.6, 0.6, 1.4], 6], packed: [[-1, 1.4, -2.4], 10], money: [[-0.4, 1.3, 2], 12], promote: [[2.6, 1.1, 1.8], 12],
      goldhat: [[3, 1, 2], 16], office: [[OX, 0.55, 1.8], 14], famous: [[3, 0.95, 2], 16], rebuild: [[0, 3, 4], 5], ears: [[2.4, 5.4, 4.6], 8], whisk: [[2.6, 1.9, 3.1], 13], cattrain: [[0, 1.4, -3], 6],
      queue: [[-3, 1.1, 1], 10], blink: [[3, 0.9, 2], 18], end: [[3, 1, 2], 8] };
    const dof = cl[id] ? X.focusOn(cam, cl[id][0], cl[id][1]) : { focus: 10, cinf: 4 };
    return { light: office ? OFFICE : gloom ? GLOOM : DAY, cam, dof, actors: [], fx };
  },
};
