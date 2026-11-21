// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// "Why did a dog named Bobbie walk 2,500 miles through winter?" (story, inspired by Bobbie the Wonder Dog: lost in
// Indiana in 1923, he turned up at his family's home in Silverton, Oregon, in February 1924; people along the way wrote
// in; he got medals, keys to cities, his own little house at the Portland Home Show and played himself in a film.)
// Sets: a snowy mountain pass + icy river, the family porch at dusk, a giant route map, an Iowa farm, a Wyoming cafe
// wagon, a log cabin in a blizzard, the Home Show hall.
import { TOTAL, LINES, wf } from './bobbie_timing.js';
import * as PR from '../props.js';
import * as D from './d19.js';
import * as X from './kit3d.js';
const { clamp, lerp, sm } = D;
export { TOTAL };
const L = LINES, W = wf;
let K, BOB, MINI, SNOW = [], LETTERS = [], BOWL, SAUS, MEDAL, KEY, DOOR, FLOES = [], SACK;
let MOM, DAD, GIRL, NEI1, NEI2, MAIL, FARM, COOK, CAB, MAYOR, FAN = [], DIR;
const MOM_O = { jacket: '#6a9ac8', dress: '#6a9ac8', hairStyle: 'bun', hair: '#7a4a24', apron: '#f4efe4', scarf: '#c0392b' };
const DAD_O = { jacket: '#8a5a3a', pants: '#3a3a40', hat: 'cap', cap: '#4a4a52', vest: '#c8a060', moustache: '#3a2418', pockets: true };
const GIRL_O = { jacket: '#e84a8a', dress: '#e84a8a', hairStyle: 'ponytail', hair: '#e8c060', build: 'kid', scarf: '#ffffff', collar: '#ffffff' };
const NEI1_O = { jacket: '#5a7a4a', pants: '#2a2a30', hat: 'cowboy', hatColor: '#6a4a2a', scarf: '#f2c230', belt: '#2a1a12', glasses: true };
const NEI2_O = { jacket: '#c87a3a', dress: '#c87a3a', hairStyle: 'curly', hair: '#2a1a12', apron: '#e8dcc4', glasses: '#333' };
const MAIL_O = { jacket: '#3a5a8a', pants: '#3a5a8a', hat: 'police', hatColor: '#3a5a8a', badge: true, belt: '#5a3a24', tie: '#2a2a2a' };
const FARM_O = { jacket: '#e8d8a0', pants: '#3a5a8a', hat: 'cowboy', hatColor: '#e0c070', vest: '#5a8a3a', scarf: '#c0392b', pockets: true };
const COOK_O = { jacket: '#f2efe8', pants: '#2a2a30', hat: 'chef', bowtie: '#c0392b', apron: '#ffffff', moustache: '#2a1a12', collar: false };
const CAB_O = { jacket: '#8a3a3a', pants: '#3a2a1e', hat: 'beanie', hatColor: '#f2f2f2', scarf: '#3a6ea5', gloves: '#3a3a3a', moustache: '#c8a060' };
const MAYOR_O = { jacket: '#1f2a4a', pants: '#1f2a4a', hat: 'tophat', hatColor: '#111', build: 'stout', bowtie: '#f2c230', vest: '#c0392b', moustache: '#d8d8d8' };
const FAN_O = [{ jacket: '#3a6ea5', pants: '#2c3e5a', hat: 'cap', cap: '#e08a2a', scarf: '#f2c230' }, { jacket: '#7a4a8a', dress: '#7a4a8a', hairStyle: 'long', hair: '#e8c060', collar: '#f4efe4' },
  { jacket: '#2a6a3a', pants: '#3a2a1e', hairStyle: 'spiky', hair: '#2a1a12', tie: '#c0392b', pockets: true }, { jacket: '#d8a830', pants: '#4a3a2a', hat: 'beanie', hatColor: '#c0392b', vest: '#8a5a34' }];
const DIR_O = { jacket: '#2a2a2a', pants: '#c8b890', hat: 'pilot', hatColor: '#5a3a24', scarf: '#f2f2f2', glasses: '#222', gloves: '#c8a060' };
const SNOWL = { az: 50, el: 30, sky: '#e8f0f8', ground: '#dfe8f0', hemi: 1.1, sun: '#fff4e8', sunI: 2.8, skyTop: '#6a90c8', skyHor: '#e8eef4', fog: '#e4ecf4', fogNear: 25, fogFar: 180,
  sat: 1.1, vig: 0.26, shadowExt: 14, exposure: 1.05, ink: 0.55, bloom: 0.55 };
const DUSK = { az: 60, el: 16, sky: '#f8c8b0', ground: '#d8d0d8', hemi: 1.0, sun: '#ffc890', sunI: 2.8, skyTop: '#4a5ab0', skyHor: '#ffb890', fog: '#f0c8b8', fogNear: 40, fogFar: 200,
  sat: 1.18, vig: 0.3, shadowExt: 14, exposure: 1.1, ink: 0.55, bloom: 0.8 };
const DAY = { az: 55, el: 38, sky: '#d8e8f4', ground: '#8a9a5a', hemi: 1.0, sun: '#fff0d8', sunI: 3.2, skyTop: '#4a86d8', skyHor: '#e8eef2', fog: '#dde8ee', fogNear: 50, fogFar: 260,
  sat: 1.15, vig: 0.24, shadowExt: 14, exposure: 1.12, ink: 0.55, bloom: 0.6 };
const HALL = { ...DAY, az: 70, el: 62, hemi: 1.2, fog: '#f4e8d8', fogNear: 30, fogFar: 120, exposure: 1.15 };
const PX = 200, MX = 400, FX = -200, DZ = 60, CZ = -70, HX = 600;
const DOG = (o) => ({ expr: 'neutral', look: 0, ...o });

function pine(x, z, s, snowy = true) { const { THREE } = K; const g = K.group(); g.position.set(x, 0, z); g.scale.setScalar(s);
  K.cyl(0.15, 0.2, 1.0, K.mat('wood', '#5a3a24'), 0, 0, 0, g);
  for (let i = 0; i < 3; i++) { K.add(new THREE.ConeGeometry(1.4 - i * 0.35, 1.6, 9), K.mat('grime', '#2f5a3a', { amt: 0.4 }), 0, 1.6 + i * 0.9, 0, g); if (snowy) K.add(new THREE.ConeGeometry(0.9 - i * 0.25, 0.7, 9), K.mat('plaster', '#f8fbff', { detail: 0.4 }), 0, 2.15 + i * 0.9, 0, g); }
  return g; }
function house(x, z, wall, roof, lit) { const { THREE } = K; const g = K.group(); g.position.set(x, 0, z);
  K.slab(-4, 4, 0, 4.2, -3, 3, K.mat('wood', wall, { detail: 0.7 }), g); const rf = K.add(new THREE.ConeGeometry(5.9, 2.8, 4), K.mat('wood', roof), 0, 5.6, 0, g); rf.rotation.y = Math.PI / 4; rf.scale.z = 0.75;
  for (const sx of [-2.4, 2.4]) { K.slab(sx - 0.7, sx + 0.7, 1.4, 2.8, 2.99, 3.03, K.toon({ color: lit ? '#ffd890' : '#a8c8e0', plain: true, emissive: lit ? '#d89a40' : '#203040' })); K.slab(sx - 0.8, sx + 0.8, 1.3, 1.4, 3.0, 3.15, K.mat('wood', '#f2ece0')); }
  return g; }
function build(k) {
  K = k; D.init(K); X.init(K); const { THREE } = K; const r = X.rnd(13);
  K.slab(-900, 900, -0.3, 0, -400, 400, K.mat('grime', '#6aa04a', { amt: 0.5, detail: 2 }), K.scene, false);
  // ---- snowy mountain pass + icy river (around the origin and the cabin) ----
  const snow = K.mat('plaster', '#f4f8fc', { detail: 1.2, amt: 0.12, bump: 0.03 });
  K.slab(-80, 28, 0, 0.04, -120, 60, snow, K.scene, false); K.slab(34, 80, 0, 0.04, -120, 60, snow, K.scene, false);
  K.slab(28, 34, -0.2, 0.02, -60, 60, K.mat('grime', '#3a7ab8', { amt: 0.3, roughness: 0.1 }), K.scene, false);    // the river (runs along z at x 28-34)
  for (let i = 0; i < 14; i++) { const f = K.slab(-0.6 - r() * 0.6, 0.6 + r() * 0.6, 0.02, 0.1, -0.5 - r() * 0.4, 0.5 + r() * 0.4, K.mat('plaster', '#e8f4fc', { detail: 0.3 })); f.position.set(29 + r() * 4, 0, -20 + i * 3); f.castShadow = false; FLOES.push(f); }
  for (let i = 0; i < 70; i++) { const x = -70 + r() * 140, z = -110 + r() * 160; if (Math.abs(x - 31) < 5 || Math.abs(x) < 6 || Math.abs(z - CZ) < 8) continue; pine(x, z, 1.4 + r() * 1.2); }
  for (let i = 0; i < 9; i++) { const m = K.add(new THREE.ConeGeometry(30 + r() * 20, 40 + r() * 25, 7), K.mat('rock', '#7a8a9a', { detail: 3 }), -120 + i * 35, 15, -170 - r() * 40); const c = K.add(new THREE.ConeGeometry(12, 14, 7), snow, m.position.x, m.position.y + 18 + (m.geometry.parameters.height - 40) / 2, m.position.z); c.scale.setScalar(1 + (m.geometry.parameters.height - 40) / 60); }
  for (let i = 0; i < 6; i++) { const h = K.sphere(6 + r() * 4, snow, -30 + i * 12, -3, -30 - r() * 10); h.scale.y = 0.5; }
  const sn = K.toon({ color: '#ffffff', plain: true, emissive: '#d8d8d8' }); for (let i = 0; i < 220; i++) { const s = K.sphere(0.035, sn, 0, -10, 0); s.castShadow = false; SNOW.push(s); }
  // log cabin in a blizzard
  const cab = K.group(); cab.position.set(0, 0, CZ); for (let y = 0; y < 3.2; y += 0.4) { K.cyl(0.2, 0.2, 7, K.mat('wood', '#7a4a2a'), -3.5, y + 0.2, 2.6, cab).rotation.z = Math.PI / 2; K.cyl(0.2, 0.2, 7, K.mat('wood', '#7a4a2a'), -3.5, y + 0.2, -2.6, cab).rotation.z = Math.PI / 2; }
  K.slab(-3.4, 3.4, 0, 3.2, -2.5, 2.5, K.mat('wood', '#6a3a20'), cab); const cr = K.add(new THREE.ConeGeometry(5.2, 2.4, 4), snow, 0, 4.3, 0, cab); cr.rotation.y = Math.PI / 4; cr.scale.z = 0.75;
  K.slab(-0.6, 0.6, 0, 2.2, 2.6, 2.7, K.toon({ color: '#ffd890', plain: true, emissive: '#e0a040' }), cab); for (const sx of [-2.2, 2.2]) K.slab(sx - 0.5, sx + 0.5, 1.2, 2.1, 2.6, 2.7, K.toon({ color: '#ffd890', plain: true, emissive: '#c08030' }), cab);
  K.cyl(0.3, 0.3, 1.6, K.mat('brick', '#8a5a4a'), 2.2, 3.6, -1, cab);
  // ---- the family porch at dusk ----
  K.slab(PX - 40, PX + 40, 0, 0.05, -30, 30, K.mat('plaster', '#eef2f8', { detail: 1.2, amt: 0.12 }), K.scene, false);
  const hs = house(PX, -7, '#c8b898', '#5a3a3a', true);
  K.slab(PX - 4, PX + 4, 0, 0.5, -4, -1.6, K.mat('wood', '#8a6a4a', { detail: 0.4 })); for (const sx of [-3.8, 3.8]) K.cyl(0.08, 0.08, 3.0, K.mat('wood', '#f2ece0'), PX + sx, 0.5, -1.75);
  K.slab(PX - 4.1, PX + 4.1, 3.4, 3.6, -4.1, -1.5, K.mat('wood', '#5a3a3a')); for (let i = 0; i < 3; i++) K.slab(PX - 0.9, PX + 0.9, 0, 0.17 * (i + 1), -1.6 + i * 0.0 + (2 - i) * 0.3 - 0.3, -1.6 + (3 - i) * 0.3 - 0.3, K.mat('wood', '#8a6a4a'));
  DOOR = K.group(); DOOR.position.set(PX - 0.6, 0.5, -3.95); K.slab(0, 1.2, 0, 2.3, -0.04, 0.04, K.mat('wood', '#3a5a3a', { detail: 0.4 }), DOOR); K.sphere(0.05, K.toon({ color: '#e8b840', plain: true, metalness: 0.6 }), 1.05, 1.1, 0.06, DOOR);
  K.slab(PX - 0.6, PX + 0.6, 0.5, 2.8, -4.02, -3.99, K.toon({ color: '#ffd890', plain: true, emissive: '#e0a040' }));
  D.sign(1.4, 0.35, D.txtTex(360, 90, '#f2ece0', '#2a2a2a', ['BRAZIER'], 'bold 56px Georgia'), PX, 3.0, -3.97, 0, K.scene, 'wood');
  for (const [x, z, c, rc] of [[PX - 14, -9, '#a8c8a8', '#4a3a5a'], [PX + 14, -9, '#e0c8a0', '#3a4a6a']]) house(x, z, c, rc, true);
  X.fence(PX - 20, PX + 20, 4.5, 1.1, K.mat('wood', '#f2ece0'));
  for (let i = 0; i < 6; i++) pine(PX - 24 + i * 9.5 + r() * 2, -16 - r() * 6, 1.6 + r() * 0.6);
  const mb = K.group(); mb.position.set(PX + 3, 0, 4.0); K.cyl(0.05, 0.05, 1.1, K.mat('wood', '#5a3a24'), 0, 0, 0, mb); K.slab(-0.25, 0.25, 1.1, 1.45, -0.18, 0.18, K.mat('metal', '#3a5a8a'), mb);
  D.sign(2.2, 0.6, D.txtTex(512, 140, '#2a4a6a', '#f4f0e0', ['SILVERTON, ORE.'], 'bold 60px Georgia'), PX - 9, 1.8, 4.3, 0, K.scene, 'wood'); K.cyl(0.06, 0.06, 1.6, K.mat('wood', '#5a3a24'), PX - 9, 0, 4.25);
  SACK = K.group(); SACK.position.set(PX + 1.5, 0.05, 2.0); const sk = K.sphere(0.5, K.mat('fabric', '#c8a878', { detail: 0.2 }), 0, 0.45, 0, SACK); sk.scale.set(1, 1.1, 0.9); D.sign(0.6, 0.25, D.txtTex(256, 100, '#c8a878', '#3a2a1a', ['U.S. MAIL'], 'bold 44px Arial'), 0, 0.45, 0.46, 0, SACK, 'fabric');
  const lw = PR.canvasTex(256, 180, (g, w, h) => { g.fillStyle = '#f8f4e8'; g.fillRect(0, 0, w, h); g.fillStyle = '#c0392b'; g.fillRect(w - 50, 10, 38, 44); g.fillStyle = '#2a2a6a'; g.font = 'italic bold 30px Georgia'; g.fillText('I fed your', 20, 90); g.fillText('dog! - Iowa', 20, 135); });
  for (let i = 0; i < 26; i++) { const m = K.add(new THREE.PlaneGeometry(0.34, 0.24), K.toon({ map: lw, plain: true, side: THREE.DoubleSide }), 0, -10, 0); m.castShadow = false; LETTERS.push(m); }
  // ---- giant route map on the floor ----
  const mapTex = PR.canvasTex(1600, 1000, (g, w, h) => {
    g.fillStyle = '#9ac8e8'; g.fillRect(0, 0, w, h); g.fillStyle = '#efe2b8'; g.beginPath(); g.moveTo(120, 160); g.lineTo(1420, 130); g.lineTo(1500, 400); g.lineTo(1380, 700); g.lineTo(1250, 880); g.lineTo(900, 760); g.lineTo(600, 860); g.lineTo(260, 720); g.lineTo(110, 480); g.closePath(); g.fill();
    g.strokeStyle = '#b8a070'; g.lineWidth = 6; g.stroke(); g.fillStyle = '#b8a888'; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(420 + i * 40, 250 + i * 60); g.lineTo(470 + i * 40, 230 + i * 60); g.lineTo(520 + i * 40, 280 + i * 60); g.fill(); }
    const pts = [[1250, 330], [1060, 360], [860, 390], [700, 420], [520, 380], [330, 300], [200, 250]]; g.setLineDash([22, 16]); g.strokeStyle = '#c0201a'; g.lineWidth = 12; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.setLineDash([]);
    const nm = ['INDIANA', 'IOWA', 'NEBRASKA', 'WYOMING', 'IDAHO', '', 'OREGON']; g.font = 'bold 44px Arial Black, Arial'; g.textAlign = 'center';
    pts.forEach(([x, y], i) => { g.fillStyle = '#2a2a2a'; g.beginPath(); g.arc(x, y, 16, 0, 7); g.fill(); if (nm[i]) { g.fillStyle = '#2a2a2a'; g.fillText(nm[i], x, y + (i % 2 ? -36 : 66)); } });
    g.fillStyle = '#c0201a'; g.font = 'bold 64px Arial Black, Arial'; g.fillText('2,500 MILES', 760, 620); });
  const mp = K.add(new THREE.PlaneGeometry(16, 10), K.toon({ map: mapTex, plain: true, kind: 'fabric', amt: 0.05 }), MX, 0.06, 0); mp.rotation.x = -Math.PI / 2; mp.receiveShadow = true;
  for (let i = 0; i < 4; i++) { const p = K.add(new THREE.ConeGeometry(0.08, 0.3, 8), K.toon({ color: '#c0201a', plain: true }), 0, 0, 0); p.rotation.x = Math.PI; p.visible = false; }
  K.slab(MX - 9, MX + 9, 0, 0.05, -6, 6, K.mat('wood', '#8a5a34', { detail: 0.6 }), K.scene, false);
  // ---- Iowa farm ----
  K.slab(FX - 40, FX + 40, 0, 0.04, -40, 30, K.mat('dirt', '#8a6a3a', { detail: 0.8 }), K.scene, false);
  for (let row = 0; row < 14; row++) for (let i = 0; i < 26; i++) { const x = FX - 20 + i * 1.0 + (row % 2) * 0.5, z = -8 - row * 1.1; const c = K.cyl(0.04, 0.06, 1.8 + ((i * 7 + row * 3) % 5) * 0.12, K.mat('grime', i % 3 ? '#5a9a3a' : '#7aa83a'), x, 0, z); K.add(new THREE.ConeGeometry(0.3, 0.7, 5), K.mat('grime', '#6aa840'), x, 1.6, z).castShadow = false; }
  const barn = K.group(); barn.position.set(FX + 10, 0, -14); K.slab(-4, 4, 0, 5, -4, 4, K.mat('wood', '#a8322a', { detail: 1.4 }), barn); const br = K.add(new THREE.ConeGeometry(5.8, 2.6, 4), K.mat('metal', '#5a5a5a'), 0, 6.3, 0, barn); br.rotation.y = Math.PI / 4;
  K.slab(-1.2, 1.2, 0, 3, 4.0, 4.05, K.mat('wood', '#f2ece0'), barn); D.sign(2.4, 0.6, D.txtTex(512, 120, '#f2ece0', '#a8322a', ['IOWA FARM'], 'bold 70px Georgia'), 0, 4.2, 4.06, 0, barn, 'wood');
  X.fence(FX - 6, FX + 6, 3, 1.1, K.mat('wood', '#c8a878')); for (const [x, z] of [[FX - 4, -2], [FX + 3, -3]]) K.slab(x - 0.5, x + 0.5, 0, 0.8, z - 0.4, z + 0.4, K.mat('fabric', '#e8c860', { detail: 0.3 }));
  BOWL = K.group(); K.cyl(0.18, 0.13, 0.1, K.mat('metal', '#c0392b'), 0, 0, 0, BOWL); K.cyl(0.15, 0.15, 0.02, K.mat('dirt', '#8a5a34'), 0, 0.08, 0, BOWL);
  // ---- Wyoming cafe wagon ----
  K.slab(FX - 20, FX + 20, 0, 0.045, DZ - 15, DZ + 15, K.mat('dirt', '#c8a070', { detail: 0.9 }), K.scene, false);
  const wg = K.group(); wg.position.set(FX, 0, DZ - 3); K.slab(-3, 3, 0.6, 3.2, -1.6, 1.6, K.mat('wood', '#2a6a7a', { detail: 0.7 }), wg); K.slab(-3.2, 3.2, 3.2, 3.4, -1.8, 1.8, K.mat('wood', '#f2ece0'), wg);
  K.slab(-2, 2, 1.5, 2.8, 1.6, 1.62, K.toon({ color: '#ffd890', plain: true, emissive: '#c08030' }), wg); K.slab(-2.2, 2.2, 1.4, 1.5, 1.6, 2.1, K.mat('wood', '#8a5a34'), wg);
  for (const [x, z] of [[-2.2, 1.7], [2.2, 1.7], [-2.2, -1.7], [2.2, -1.7]]) { const w = K.add(new THREE.TorusGeometry(0.55, 0.07, 6, 20), K.mat('wood', '#5a3a24'), x, 0.55, z, wg); }
  D.sign(4, 0.7, D.txtTex(640, 110, '#c0392b', '#ffffff', ['WYOMING CAFE'], 'bold 76px Arial Black, Arial'), 0, 3.9, 1.62, 0, wg, 'wood');
  K.cyl(0.12, 0.12, 1.4, K.mat('metal', '#3a3a3a'), -2.2, 3.4, -0.8, wg);
  for (let i = 0; i < 5; i++) { const c = K.add(new THREE.ConeGeometry(0.4, 1.8, 6), K.mat('grime', '#5a8a3a'), FX - 8 + i * 4, 0.9, DZ - 9 - (i % 2) * 2); }
  SAUS = K.cyl(0.04, 0.04, 0.3, K.toon({ color: '#a84a2a', plain: true }), 0, -10, 0); SAUS.rotation.z = Math.PI / 2;
  // ---- Home Show hall (open roof, sunlit) ----
  K.slab(HX - 14, HX + 14, 0, 0.05, -10, 14, K.mat('wood', '#c8945a', { detail: 0.5 }), K.scene, false);
  const hw = K.mat('plaster', '#f2e2c8', { detail: 1.5 }); K.slab(HX - 14, HX + 14, 0, 7, -10.2, -10, hw); K.slab(HX - 14.2, HX - 14, 0, 7, -10, 14, hw); K.slab(HX + 14, HX + 14.2, 0, 7, -10, 14, hw);
  D.sign(9, 1.3, D.txtTex(1024, 150, '#2a4a8a', '#ffffff', ['PORTLAND HOME SHOW'], 'bold 96px Arial Black, Arial'), HX, 5.6, -9.95, 0, K.scene, 'fabric');
  for (let i = 0; i < 22; i++) { const b = K.add(new THREE.ConeGeometry(0.22, 0.4, 3), K.toon({ color: ['#c8202a', '#ffffff', '#2a4aa0', '#f2c230'][i % 4], plain: true }), HX - 11 + i, 4.6, -9.8); b.rotation.z = Math.PI; }
  const dh = K.group(); dh.position.set(HX, 0, -5); K.slab(-1.3, 1.3, 0.05, 1.7, -1, 1, K.mat('wood', '#f2ece0', { detail: 0.4 }), dh); const dr = K.add(new THREE.ConeGeometry(1.95, 1.1, 4), K.mat('wood', '#c0392b'), 0, 2.2, 0, dh); dr.rotation.y = Math.PI / 4; dr.scale.z = 0.75;
  K.slab(-0.45, 0.45, 0.05, 1.1, 0.98, 1.02, K.toon({ color: '#3a2a1a', plain: true }), dh); for (const sx of [-0.9, 0.9]) K.slab(sx - 0.25, sx + 0.25, 0.8, 1.25, 0.99, 1.03, K.toon({ color: '#ffd890', plain: true, emissive: '#806030' }), dh);
  D.sign(1.4, 0.4, D.txtTex(320, 90, '#f2c230', '#2a1a12', ['BOBBIE'], 'bold 64px Arial Black, Arial'), 0, 1.45, 1.04, 0, dh, 'wood');
  for (let i = 0; i < 6; i++) { K.cyl(0.04, 0.05, 1.0, K.mat('metal', '#c8a040'), HX + 2.2 + i * 1.4, 0.05, -1.2); } K.slab(HX + 2.2, HX + 9.2, 0.85, 0.92, -1.23, -1.17, K.mat('fabric', '#a8202a'));
  const cam = K.group(); cam.position.set(HX - 5.5, 0.05, 1.0); for (const [x, z] of [[-0.25, -0.25], [0.25, -0.25], [0, 0.3]]) K.beam(new THREE.Vector3(x, 0, z), new THREE.Vector3(0, 1.4, 0), 0.025, K.mat('wood', '#5a3420'), cam);
  K.slab(-0.3, 0.3, 1.4, 1.8, -0.2, 0.2, K.mat('metal', '#2a2a2a'), cam); for (const x of [-0.15, 0.18]) K.cyl(0.17, 0.17, 0.06, K.mat('metal', '#3a3a3a'), x, 2.0, 0, cam).rotation.x = Math.PI / 2;
  K.cyl(0.08, 0.09, 0.2, K.mat('metal', '#1a1a1a'), 0.38, 1.6, 0, cam).rotation.z = Math.PI / 2; cam.rotation.y = 0.3;
  MEDAL = K.cyl(0.07, 0.07, 0.015, K.toon({ color: '#f2c230', plain: true, roughness: 0.2, emissive: '#5a3a00' }), 0, -10, 0); MEDAL.rotation.x = Math.PI / 2;
  KEY = K.group(); const gold = K.toon({ color: '#f2c230', plain: true, roughness: 0.2, metalness: 0.5, emissive: '#5a3a00' }); K.add(new THREE.TorusGeometry(0.16, 0.05, 8, 20), gold, 0, 0.55, 0, KEY); K.cyl(0.035, 0.035, 0.5, gold, 0, 0, 0, KEY); K.slab(0.0, 0.14, 0.02, 0.1, -0.03, 0.03, gold, KEY);
  // dogs + people
  BOB = K.animal('dog', { seed: 4, color: '#a8602a', belly: '#f8f2e6', scale: 1.05 });
  MINI = K.animal('dog', { seed: 4, color: '#a8602a', belly: '#f8f2e6', scale: 0.55 });
  MOM = K.stick(MOM_O, { key: 'mom' }); DAD = K.stick(DAD_O, { key: 'dad' }); GIRL = K.stick(GIRL_O, { key: 'girl' }); NEI1 = K.stick(NEI1_O, { key: 'nei1' }); NEI2 = K.stick(NEI2_O, { key: 'nei2' });
  MAIL = K.stick(MAIL_O, { key: 'mail' }); FARM = K.stick(FARM_O, { key: 'farm' }); COOK = K.stick(COOK_O, { key: 'cook' }); CAB = K.stick(CAB_O, { key: 'cab' }); MAYOR = K.stick(MAYOR_O, { key: 'mayor' });
  FAN_O.forEach((o, i) => FAN.push(K.stick(o, { key: 'fan' + i }))); DIR = K.stick(DIR_O, { key: 'dir' });
  K.addClouds(12, 700, 170);
}
const hide = (...rs) => rs.forEach((x) => { x.root.visible = false; });
const ALL = () => [MOM, DAD, GIRL, NEI1, NEI2, MAIL, FARM, COOK, CAB, MAYOR, DIR, ...FAN];
function frame(f) {
  const fx = []; ALL().forEach((x) => { x.root.visible = false; });
  const P1 = L[1][0] - 4, MAP0 = L[2][0] - 4, MTN0 = L[3][0] - 4, NEI0 = L[4][0] - 4, LET0 = L[5][0] - 4, FARM0 = L[6][0] - 4, COOK0 = W(6, 'cook') - 4, BLIZ0 = W(6, 'family') - 4,
    RIV0 = L[7][0] - 4, HOW0 = L[8][0] - 4, RET0 = W(8, 'retraced') - 4, HALL0 = L[9][0] - 4, FANS0 = L[10][0] - 4, MOV0 = L[11][0] - 4, END0 = L[12][0] - 4;
  let dog = null, light = SNOWL, snowOn = false;
  MINI.root.visible = false; BOWL.visible = false; SAUS.visible = false; MEDAL.visible = false; KEY.visible = false; SACK.visible = false; LETTERS.forEach((m) => { m.visible = false; });
  DOOR.rotation.y = 0;
  // ---------- where is Bobbie, what is everyone doing ----------
  if (f < P1) {                                   // L0 trudging through deep snow on the pass (toward camera)
    const z = -14 + 0.045 * f; dog = DOG({ x: 0.3 * Math.sin(f / 25), z, yaw: 0, mode: 'walk', speed: 0.6, expr: 'sad' }); snowOn = true;
  } else if ((f >= P1 && f < MAP0) || f >= END0) { // L1 + L12: scratching at the door at dusk
    light = DUSK; const open = f < END0 ? sm(W(1, 'door') + 6, W(1, 'door') + 16, f) : 0;
    DOOR.rotation.y = -1.6 * open;
    dog = DOG({ x: PX - 0.0, y: 0.5, z: -3.35, yaw: Math.PI, mode: open > 0.5 ? 'wag' : (f % 20 < 10 ? 'beg' : 'stand'), expr: open > 0.5 ? 'happy' : 'sad' });
    if (f < END0 && f >= W(1, 'door') + 6) { D.act(K, MOM, f, [[0, 'shock', { expr: 'shock' }], [W(1, 'door') + 22, 'ears', { expr: 'shock' }], [W(1, 'Oregon') + 4, 'reach', { expr: 'excited' }]], 2, { x: PX - 0.1, y: 0.5, z: -3.75, yaw: 0 }); }
  } else if (f >= MAP0 && f < MTN0) {             // L2 the map, a tiny Bobbie at the Indiana end
    light = HALL; MINI.root.visible = true; MINI.set(f, { x: MX + 4.5, y: 0.06, z: -1.7, yaw: -Math.PI / 2, mode: 'sit', expr: 'sad', look: 0.4 * Math.sin(f / 12) });
  } else if (f >= MTN0 && f < NEI0) {             // L3 rivers + the Rockies (on the ridge)
    const riv = f < W(3, 'deserts'); snowOn = !riv;
    dog = riv ? DOG({ x: 34.5 - 0.03 * (f - MTN0), y: 0, z: 6, yaw: -Math.PI / 2, mode: 'walk', expr: 'neutral', speed: 0.7 }) : DOG({ x: -6 + 0.05 * (f - W(3, 'deserts')), z: -30, yaw: Math.PI / 2, mode: 'walk', expr: 'neutral', speed: 0.7 });
  } else if (f >= NEI0 && f < LET0) {             // L4 neighbours laugh at the fence, Dad defends him
    light = DUSK; dog = DOG({ x: PX + 0.8, y: 0.05, z: 2.6, yaw: 0.4, mode: 'sit', expr: 'happy' });
    D.act(K, NEI1, f, [[0, 'pointL', { expr: 'grin' }], [W(4, 'laugh') - 3, 'laugh', { expr: 'laugh' }], [W(4, 'Indiana') - 6, 'shrug', { expr: 'laugh' }]], 3, { x: PX + 3.6, z: 5.3, yaw: Math.PI + 0.4 });
    D.act(K, NEI2, f, [[0, 'laugh', { expr: 'laugh' }], [W(4, 'dog'), 'facepalm', { expr: 'laugh' }]], 4, { x: PX + 4.6, z: 5.4, yaw: Math.PI - 0.2 });
    D.act(K, DAD, f, [[0, 'hips', { expr: 'nervous', sweat: true }], [W(4, 'finds') - 4, 'cross', { expr: 'stern', sweat: true }]], 5, { x: PX + 1.9, z: 2.8, yaw: 0.2 });
  } else if (f >= LET0 && f < FARM0) {            // L5 the mailman and the letters
    light = DUSK; SACK.visible = true; dog = DOG({ x: PX + 0.2, y: 0.05, z: 2.4, yaw: 0.6, mode: 'jump', expr: 'happy' });
    D.act(K, MAIL, f, [[0, 'carry', { expr: 'pained', item: 'box' }], [W(5, 'arriving') - 4, 'throw', { expr: 'grin' }], [W(5, 'fed') - 2, 'show', { expr: 'grin', R: [0.45, -0.6, 'letter'] }]], 6, { x: PX + 2.4, z: 2.6, yaw: -0.9 });
    D.act(K, DAD, f, [[0, 'shock', { expr: 'shock' }], [W(5, 'fed'), 'read', { expr: 'excited', item: 'paper' }]], 5, { x: PX + 0.6, z: 3.6, yaw: 2.6 });
    D.act(K, GIRL, f, [[0, 'cheer', { expr: 'excited' }], [W(5, 'way') - 4, 'clap', { expr: 'laugh' }]], 7, { x: PX - 0.8, z: 2.8, yaw: 1.2 });
    LETTERS.forEach((m, i) => { const t = (f - W(5, 'arriving') + 4 - i * 1.5) / 40; if (t < 0) return; const tt = Math.min(t, 1); m.visible = true;
      m.position.set(PX + 1.5 + Math.sin(i * 2.3) * 1.6 * tt, 0.9 + 3.2 * tt - 4.0 * tt * tt + (tt >= 1 ? 0 : 0), 2.0 + Math.cos(i * 1.7) * 1.3 * tt); if (m.position.y < 0.08) { m.position.y = 0.08; m.rotation.set(-Math.PI / 2, 0, i); } else m.rotation.set(f * 0.2 + i, i, f * 0.13); });
  } else if (f >= FARM0 && f < COOK0) {           // L6a Iowa: the farmer's bowl
    light = DAY; dog = DOG({ x: FX + 0.1, z: 0.8, yaw: Math.PI / 2 + 0.3, mode: 'eat', expr: 'happy' }); BOWL.visible = true; BOWL.position.set(FX + 0.55, 0.05, 0.95);
    D.act(K, FARM, f, [[0, 'crouch', { expr: 'smile' }], [FARM0 + 22, 'clap', { expr: 'laugh' }]], 8, { x: FX + 1.6, z: 0.7, yaw: -Math.PI / 2 });
  } else if (f >= COOK0 && f < BLIZ0) {           // L6b Wyoming: the cook's sausage
    light = DAY; dog = DOG({ x: FX + 0.2, z: DZ + 0.7, yaw: Math.PI, mode: 'beg', expr: 'happy' });
    const C = D.act(K, COOK, f, [[0, 'show', { expr: 'grin', R: [0.45, -0.2, 'fist'] }], [COOK0 + 16, 'reach', { expr: 'laugh', R: [0.6, 0.2, 'fist'] }]], 9, { x: FX + 0.2, z: DZ - 0.8, yaw: 0 });
    X.holdAt(COOK, SAUS, 1, [0, 0, Math.PI / 2]);
  } else if (f >= BLIZ0 && f < RIV0) {            // L6c the blizzard cabin
    snowOn = true; dog = DOG({ x: 0.3 + 0.02 * Math.max(0, f - BLIZ0 - 10), z: CZ + 3.6 - 0.025 * Math.max(0, f - BLIZ0 - 10), yaw: Math.PI, mode: 'walk', expr: 'sad', speed: 0.7 });
    D.act(K, CAB, f, [[0, 'wave', { expr: 'nervous' }], [BLIZ0 + 18, 'reach', { expr: 'smile' }]], 10, { x: -0.6, z: CZ + 2.95, yaw: 0.3 });
  } else if (f >= RIV0 && f < HOW0) {             // L7 swimming the icy river, then climbing the snowy slope
    const swim = f < W(7, 'climbed') - 4; snowOn = !swim;
    dog = swim ? DOG({ x: 34 - 0.045 * (f - RIV0), y: -0.32, z: 0, yaw: -Math.PI / 2, mode: 'run', expr: 'scared', speed: 0.5 }) : DOG({ x: 0, y: 0.0, z: -40 + 0.06 * (f - W(7, 'climbed') + 4), yaw: Math.PI, mode: 'walk', expr: 'sad', speed: 0.8 });
    if (!swim) BOB.root.rotation.x = -0.25;
  } else if (f >= HOW0 && f < RET0) {             // L8a how? sniffing in the snow
    dog = DOG({ x: 2, z: -6, yaw: 0.4, mode: 'eat', expr: 'neutral' }); snowOn = true;
  } else if (f >= RET0 && f < HALL0) {            // L8b tiny Bobbie walks the red route across the map
    light = HALL; MINI.root.visible = true; const pts = [[1250, 330], [1060, 360], [860, 390], [700, 420], [520, 380], [330, 300], [200, 250]].map(([x, y]) => [MX - 8 + x / 100, -5 + y / 100]);
    const t = clamp((f - RET0) / (HALL0 - RET0 - 4), 0, 1) * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(t)), u = t - i;
    const x = lerp(pts[i][0], pts[i + 1][0], u), z = lerp(pts[i][1], pts[i + 1][1], u); const yaw = Math.atan2(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    MINI.set(f, { x, y: 0.06, z, yaw, mode: 'walk', expr: 'happy', speed: 1.2 }); globalThis.__MINI = [x, z];
  } else if (f >= HALL0 && f < FANS0) {           // L9 medals, keys, his own little house
    light = HALL; dog = DOG({ x: HX + 0.0, z: -3.3, yaw: 0, mode: f < W(9, 'house') - 4 ? 'sit' : 'wag', expr: 'happy' });
    D.act(K, MAYOR, f, [[0, 'show', { expr: 'proud', R: [0.4, -0.5, 'fist'] }], [W(9, 'keys') - 4, 'reach', { expr: 'grin', R: [0.6, 0.1, 'fist'] }], [W(9, 'house'), 'clap', { expr: 'laugh' }]], 11, { x: HX + 1.4, z: -2.6, yaw: -1.2 });
    if (f >= W(9, 'keys') - 4 && f < W(9, 'house') - 4) X.holdAt(MAYOR, KEY, 1, [0, 0, 0.3]);
    MEDAL.visible = f >= W(9, 'medals') - 2;
  } else if (f >= FANS0 && f < MOV0) {            // L10 40,000 people line up
    light = HALL; dog = DOG({ x: HX + 1.5, z: -2.1, yaw: Math.PI / 2, mode: 'wag', expr: 'happy' }); MEDAL.visible = true;
    FAN.forEach((p, i) => D.act(K, p, f, [[0, i % 2 ? 'wave' : 'clap', { expr: 'excited' }], [FANS0 + 14 + i * 5, i === 0 ? 'reach' : 'cheer', { expr: 'laugh' }]], 20 + i, { x: HX + 2.8 + i * 1.3, z: -1.9 + 0.1 * (i % 2), yaw: -Math.PI / 2 }));
  } else if (f >= MOV0 && f < END0) {             // L11 the movie
    light = HALL; dog = DOG({ x: HX - 4.0, z: 2.0, yaw: -1.4, mode: f % 30 < 15 ? 'beg' : 'jump', expr: 'happy' }); MEDAL.visible = true;
    D.act(K, DIR, f, [[0, 'type', { expr: 'excited' }], [MOV0 + 20, 'pointL', { expr: 'grin', talk: true }]], 12, { x: HX - 5.9, z: 0.3, yaw: 0.9 });
  }
  if (dog) { BOB.root.rotation.x = 0; BOB.set(f, dog); if (dog.y !== undefined) BOB.root.position.y = dog.y; if (dog.mode === 'run' && dog.y < 0) BOB.root.rotation.x = 0;
    if (f >= RIV0 && f < HOW0 && f >= W(7, 'climbed') - 4) BOB.root.rotation.x = -0.25;
    if (MEDAL.visible) { BOB.head.updateMatrixWorld(true); const p = BOB.head.localToWorld(new K.THREE.Vector3(0, -0.16, 0.14)); MEDAL.position.copy(p); MEDAL.rotation.set(Math.PI / 2, 0, 0); MEDAL.rotation.y = 0; } }
  else BOB.root.visible = false;
  if (dog && dog.mode === 'walk' && snowOn && f % 9 === 0) K.puff(f, f, dog.x, dog.z, 3, 0.2, '#f4f8fc');
  if (f >= RIV0 && f < W(7, 'climbed') - 4 && f % 5 === 0) K.puff(f, f, BOB.root.position.x, 0.2, 4, 0.3, '#e8f4fc');
  // snow fall around the camera (set after the camera is known)
  // ---------- shots ----------
  const dogP = (q) => [0.3 * Math.sin(q / 25), 0, -14 + 0.045 * q];
  const S = [
    [0, (u) => { const z = -14 + 0.045 * f; return { pos: [0.9, 0.7, z + 3.2], look: [0.1, 0.55, z], fov: 42, cinf: 10 }; }],
    [W(0, 'miles') - 4, (u) => { const z = -14 + 0.045 * f; return { pos: [1.9, 0.55, z + 1.6], look: [0, 0.35, z + 0.2], fov: 40, cinf: 16 }; }],
    [P1, (u) => ({ pos: [PX + lerp(1.8, 1.2, u), 1.1, 0.2], look: [PX - 0.1, 1.1, -3.6], fov: 40, cinf: 12, light: DUSK }), { whip: true }],
    [W(1, 'door') + 4, (u) => ({ pos: [PX + 1.4, 1.75, -1.2], look: [PX - 0.1, 1.7, -4.4], fov: 38 * K.punch(f, W(1, 'door') + 12, 0.15, 6), cinf: 14, light: DUSK, noPush: true })],
    [MAP0, (u) => ({ pos: [MX + lerp(5, -3, u), 6.5, 5.5], look: [MX + lerp(4, -4, u), 0, -0.5], fov: 50, cinf: 4, light: HALL, noPush: true }), { whip: true }],
    [MTN0, (u) => ({ pos: [lerp(38, 37, u), 1.5, 9.5], look: [32, 0.6, 5.5], fov: 44, cinf: 8 }), { whip: true }],
    [W(3, 'deserts'), (u) => { const x = -6 + 0.05 * (f - W(3, 'deserts')); return { pos: [x + 6, 2.2, -21], look: [x, 1.2, -30], fov: 46, cinf: 5 }; }, { whip: true }],
    [NEI0, (u) => ({ pos: [PX + 4.1, 1.55, 1.4], look: [PX + 4.1, 1.45, 5.3], fov: 42, cinf: 12, light: DUSK }), { whip: true }],
    [W(4, 'finds') - 4, (u) => ({ pos: [PX + 2.5, 1.55, 4.7], look: [PX + 1.6, 1.0, 2.6], fov: 40, cinf: 12, light: DUSK })],
    [LET0, (u) => ({ pos: [PX + 1.2, 1.7, 7.8], look: [PX + 1.5, 1.0, 2.6], fov: 44, cinf: 8, light: DUSK }), { whip: true }],
    [W(5, 'fed') - 4, (u) => ({ pos: [PX + 0.4, 1.7, 4.8], look: [PX + 2.2, 1.65, 2.6], fov: 36, cinf: 16, light: DUSK })],
    [FARM0, (u) => ({ pos: [FX - 1.0, 1.7, 4.6], look: [FX + 0.8, 1.0, 0.6], fov: 42, cinf: 10, light: DAY }), { whip: true }],
    [COOK0, (u) => ({ pos: [FX + 2.2, 1.5, DZ + 3.8], look: [FX + 0.1, 1.15, DZ - 0.3], fov: 42, cinf: 10, light: DAY }), { whip: true }],
    [BLIZ0, (u) => ({ pos: [2.8, 1.5, CZ + 8.5], look: [0, 1.3, CZ + 2.6], fov: 44, cinf: 8 }), { whip: true }],
    [RIV0, (u) => { const x = 34 - 0.045 * (f - RIV0); return { pos: [x - 0.5, 0.9, 3.4], look: [x - 0.2, 0.0, 0], fov: 42, cinf: 10 }; }, { whip: true }],
    [W(7, 'climbed') - 4, (u) => { const z = -40 + 0.06 * (f - W(7, 'climbed') + 4); return { pos: [2.0, 0.5, z + 4.5], look: [0, 1.4, z - 1], fov: 46, cinf: 8 }; }],
    [HOW0, (u) => ({ pos: [3.7, 0.7, -3.5], look: [2.3, 0.3, -5.4], fov: 40 * K.punch(f, W(8, 'way'), 0.15, 6), cinf: 16, noPush: true }), { whip: true }],
    [RET0, (u) => { const m = globalThis.__MINI || [MX, 0]; return { pos: [m[0] + 1.2, 1.5, m[1] + 2.2], look: [m[0] - 0.4, 0.15, m[1]], fov: 46, cinf: 8, light: HALL }; }, { whip: true }],
    [HALL0, (u) => ({ pos: [HX + 1.8, 1.4, 1.8], look: [HX + 0.8, 0.9, -3.0], fov: 42, cinf: 10, light: HALL }), { whip: true }],
    [W(9, 'house') - 4, (u) => ({ pos: [HX - 2.0, 1.6, 2.6], look: [HX + 0.5, 1.2, -4.0], fov: 44, cinf: 6, light: HALL })],
    [FANS0, (u) => ({ pos: [HX + 1.0 + 1.2 * u, 1.5, 1.8], look: [HX + 2.6, 1.1, -2.0], fov: 44, cinf: 8, light: HALL }), { whip: true }],
    [MOV0, (u) => ({ pos: [HX - 3.0, 1.5, 5.2], look: [HX - 4.4, 1.0, 1.2], fov: 48, cinf: 8, light: HALL }), { whip: true }],
    [END0, (u) => ({ pos: [PX + 1.0, 0.9, -0.6], look: [PX - 0.1, 0.9, -3.6], fov: 42, cinf: 12, light: DUSK }), { whip: true }],
  ];
  const R = D.runShots(S, f, TOTAL), cam = R.cam;
  if (R.id === 1) D.card(fx, f, W(0, 'miles') - 6, '2,500 MILES', cam, '#ffffff', 150, 50, 0.62);
  if (R.id === 4) D.card(fx, f, W(2, 'Indiana'), 'INDIANA', cam, '#f6c83a', 150, 40, 0.62);
  if (R.id === 20) D.card(fx, f, W(10, 'thousand'), '40,000', cam, '#f6c83a', 170, 40, 0.62);
  if (R.id === 6 || R.id === 15) { const [a, b] = K.shake(f, f - (f % 15), 0.012, 15); cam.pos[0] += a; cam.pos[1] += b; }
  // snow around the camera when outdoors in the mountains
  SNOW.forEach((s, i) => { if (!snowOn) { s.visible = false; return; } s.visible = true; const c = cam.look; const x = ((i * 7.31) % 12) - 6, z = ((i * 3.17) % 12) - 6, y = 6 - ((f * 0.05 + i * 0.29) % 6.5);
    s.position.set(c[0] + x + 0.4 * Math.sin(f / 15 + i) + 0.02 * f % 1, y, c[2] + z); });
  FLOES.forEach((fl, i) => { fl.position.z = -20 + ((i * 3 + f * 0.04) % 40); });
  return { light: R.light || light, cam, dof: R.dof, actors: [], fx };
}
export default { TOTAL, look: 'rich', build, frame };
