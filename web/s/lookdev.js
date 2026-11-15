// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// Look-development scene: shows the "rich" look (textured materials, lantern light, AO, bloom,
// light shafts, dust, close framing, prop inserts). Copy patterns from here into new stories.
// Shots: 0-89 character close-up by a lantern | 90-179 down the tunnel | 180-269 prop insert | 270-359 outside at the mine mouth.
import * as PR from '../props.js';
import { M, clamp, ramp, lerp, blinkAt, q } from '../motion.js';

export const TOTAL = 360;
let K;
const rnd = (() => { let s = 77; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); })();

// ---------- reusable rich props (candidates for props.js) ----------
function rockTunnel(len, rad, mat, z0 = 0) {
  const { THREE } = K;
  const g = new THREE.CylinderGeometry(rad, rad, len, 64, 80, true); g.rotateX(Math.PI / 2);
  const p = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i); const a = Math.atan2(v.y, v.x), z = v.z;
    const n = 1 + 0.09 * Math.sin(a * 5 + z * 0.9) + 0.06 * Math.sin(a * 11 - z * 1.7) + 0.05 * Math.sin(a * 23 + z * 3.1) + 0.04 * Math.sin(z * 5.3 + a * 3);
    v.x *= n; v.y = v.y * n * 0.85; if (v.y < -rad * 0.55) v.y = -rad * 0.55; p.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  const m = K.add(g, mat, 0, rad * 0.55, z0 - len / 2); m.material.side = THREE.BackSide; return m;
}
function timberFrame(z, w, h, wood) {
  for (const s of [-1, 1]) { const post = K.slab(-0.13, 0.13, 0, h, -0.13, 0.13, wood); post.position.set(s * w / 2, h / 2, z); post.rotation.z = s * 0.05; }
  K.slab(-w / 2 - 0.35, w / 2 + 0.35, h - 0.05, h + 0.25, z - 0.16, z + 0.16, wood);
}
function rails(z0, z1, metal, wood) {
  for (const x of [-0.42, 0.42]) K.slab(x - 0.04, x + 0.04, 0.12, 0.2, z1, z0, metal);
  for (let z = z0; z > z1; z -= 0.7) { const m = K.slab(-0.7, 0.7, 0, 0.12, z - 0.12, z + 0.12, wood); m.rotation.y = (rnd() - 0.5) * 0.06; }
}
function barrel(x, z, wood, metal, s = 1) {
  const { THREE } = K;
  const g = new THREE.CylinderGeometry(0.38 * s, 0.38 * s, 1.0 * s, 28, 8); const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const y = p.getY(i) / s, k = 1 + 0.13 * Math.cos(y * Math.PI); p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k); }
  g.computeVertexNormals(); K.add(g, wood, x, 0.5 * s, z);
  for (const y of [0.18, 0.82]) K.add(new THREE.TorusGeometry(0.405 * s * (1 + 0.13 * Math.cos((y - 0.5) * Math.PI)), 0.022 * s, 6, 32).rotateX(Math.PI / 2), metal, x, y * s, z);
}
function lantern(x, y, z, metal, glass) {
  const { THREE } = K, g = K.group(); g.position.set(x, y, z);
  K.cyl(0.11, 0.13, 0.04, metal, 0, -0.2, 0, g); K.cyl(0.13, 0.11, 0.04, metal, 0, 0.12, 0, g);
  K.add(new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16), glass, 0, -0.03, 0, g, { cast: false });
  K.add(new THREE.TorusGeometry(0.08, 0.012, 6, 16), metal, 0, 0.24, 0, g);
  return K.lamp(x, y - 0.02, z, { color: '#ffaa55', intensity: 3.2, distance: 9, glowS: 0.6, flicker: 0.1 });
}
function cart(x, z, metal, wood) {
  const g = K.group(); g.position.set(x, 0.2, z);
  K.slab(-0.6, 0.6, 0.15, 0.75, -0.9, 0.9, metal, g); K.slab(-0.52, 0.52, 0.55, 0.7, -0.82, 0.82, K.mat('rock', '#c9a24a', { detail: 0.6 }), g);
  for (const sx of [-0.45, 0.45]) for (const sz of [-0.55, 0.55]) K.add(new K.THREE.CylinderGeometry(0.17, 0.17, 0.08, 18).rotateZ(Math.PI / 2), metal, sx, 0.05, sz, g);
  return g;
}

function build(k) {
  K = k; const { THREE } = K;
  const rock = K.mat('rock', '#b07a4c', { detail: 2.4, bump: 0.05 }), dirt = K.mat('dirt', '#7a5636'), wood = K.mat('wood', '#8a5c36', { detail: 1.6 }),
    oldWood = K.mat('wood', '#6e4a2e'), metal = K.mat('metal', '#5a5a60'), iron = K.mat('metal', '#2e2a28', { roughness: 0.6 }),
    glass = new THREE.MeshBasicMaterial({ color: '#ffd9a0' });
  // tunnel along -z from z=6 to z=-34
  rockTunnel(42, 2.6, rock, 6);
  K.slab(-3, 3, -0.1, 0, -36, 6, dirt, K.scene, false);
  for (let z = 4; z > -34; z -= 3.2) timberFrame(z, 3.0, 2.6, z % 2 ? wood : oldWood);
  rails(5, -34, iron, oldWood);
  lantern(-1.25, 2.1, -0.4, iron, glass); lantern(1.25, 2.1, -7.6, iron, glass); lantern(-1.25, 2.1, -16, iron, glass);
  // props near the camera
  const cr = PR.crate(K, 'TNT', '#9a3a2a', K.scene, [0.8, 0.5, 0.55]); cr.position.set(1.25, 0, 0.6); cr.rotation.y = 0.25;
  const cr2 = K.add(new THREE.BoxGeometry(0.9, 0.7, 0.7).translate(0, 0.35, 0), wood, 1.3, 0, 1.6); cr2.rotation.y = -0.1;
  barrel(-1.45, 1.4, oldWood, iron); barrel(-1.75, 0.5, wood, iron, 0.85);
  cart(0, -4.5, iron, wood);
  // pick + shovel leaning on the wall, table with gold pan
  const pick = K.group(); pick.position.set(1.55, 0, -1.6); pick.rotation.z = 0.35; K.slab(-0.03, 0.03, 0, 1.1, -0.03, 0.03, wood, pick);
  K.add(new THREE.TorusGeometry(0.32, 0.035, 6, 20, Math.PI).rotateZ(0), iron, 0, 1.1, 0, pick);
  const tab = K.group(); tab.position.set(-1.2, 0, 3.4);
  K.slab(-0.55, 0.55, 0.78, 0.84, -0.4, 0.4, wood, tab); for (const sx of [-0.48, 0.48]) for (const sz of [-0.33, 0.33]) K.slab(sx - 0.035, sx + 0.035, 0, 0.78, sz - 0.035, sz + 0.035, oldWood, tab);
  K.add(new THREE.CylinderGeometry(0.24, 0.17, 0.06, 32), iron, 0.05, 0.87, 0, tab);
  const nug = K.mat('metal', '#f2c040', { roughness: 0.55, emissive: '#4a2e00', bump: 0.002 });
  for (let i = 0; i < 9; i++) { const n = K.add(new THREE.DodecahedronGeometry(0.018 + rnd() * 0.02, 1), nug, 0.05 + (rnd() - 0.5) * 0.18, 0.905, (rnd() - 0.5) * 0.18, tab); n.rotation.set(rnd() * 3, rnd() * 3, 0); }
  lantern(-1.55, 1.0, 3.55, iron, glass);
  // light from a ceiling crack + dust
  K.shaft([0.5, 3.6, -9.5], [0.2, 0, -9.0], 0.15, 0.9, '#ffe0b0', 0.22);
  K.lamp(0.3, 0.6, -9.2, { color: '#ffe8c8', intensity: 4, distance: 6, glow: false, flicker: 0 });
  K.dust([0, 1.6, -2], [4, 3, 12], 260);
  // outside: mine mouth for shot 4
  const out = K.group(); out.position.set(60, 0, 0);
  K.slab(-60, 60, -0.1, 0, -60, 60, K.mat('dirt', '#b08a5a', { detail: 1.6 }), out, false);
  const hill = new THREE.SphereGeometry(18, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2); const hp = hill.attributes.position;
  for (let i = 0; i < hp.count; i++) { const x = hp.getX(i), y = hp.getY(i), z = hp.getZ(i), n = 1 + 0.08 * Math.sin(x * 0.4) * Math.cos(z * 0.5) + 0.05 * Math.sin(y * 1.3 + x); hp.setXYZ(i, x * n, y * n * 0.9, z * n); }
  hill.computeVertexNormals(); K.add(hill, K.mat('rock', '#c08a58', { detail: 4, bump: 0.08 }), 0, -2, -16, out);
  K.slab(-1.8, 1.8, 0, 2.9, 1.3, 1.6, K.mat('grime', '#120c08', { plain: true }), out); // dark opening
  for (const sx of [-1.7, 1.7]) K.slab(sx - 0.15, sx + 0.15, 0, 3, 1.5, 1.8, wood, out);
  K.slab(-2.4, 2.4, 2.9, 3.3, 1.45, 1.85, wood, out);
  const sign = PR.canvasTex(512, 128, (g, w, h) => { g.fillStyle = '#6a4428'; g.fillRect(0, 0, w, h); g.fillStyle = '#f2e2c0'; g.font = 'bold 66px Georgia, serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('LUCKY STRIKE MINE', w / 2, h / 2 + 4); });
  K.add(new THREE.PlaneGeometry(4.2, 1.05), K.toon({ map: sign, kind: 'wood', amt: 0.4 }), 0, 3.85, 1.88, out);
  for (const x of [-0.42, 0.42]) K.slab(x - 0.04, x + 0.04, 0.12, 0.2, 1.6, 14, iron, out);
  for (let z = 2; z < 14; z += 0.7) K.slab(-0.7, 0.7, 0, 0.12, z - 0.12, z + 0.12, oldWood, out);
  for (let i = 0; i < 30; i++) { const a = rnd() * 6.28, d = 12 + rnd() * 30; K.add(new THREE.DodecahedronGeometry(0.3 + rnd() * 1.2, 1), K.mat('rock', '#a87a50'), Math.cos(a) * d, 0, Math.sin(a) * d + 10, out).scale.set(1, 0.6, 1); }
  const pine = K.mat('grime', '#3a6a4a', { amt: 0.8 }), bark = K.mat('wood', '#5a3a26');
  for (let i = 0; i < 40; i++) { const x = (rnd() - 0.5) * 100, z = -20 - rnd() * 40; const s = 1 + rnd() * 1.5; K.cyl(0.25 * s, 0.35 * s, 3 * s, bark, x, 0, z, out); for (let j = 0; j < 3; j++) K.add(new THREE.ConeGeometry((2.4 - j * 0.6) * s, 3 * s, 10), pine, x, (3 + j * 1.8) * s, z, out); }
  K.addClouds(8, 700, 160);
}

// ---------- characters ----------
const OWNER = { jacket: '#f2ece0', pants: '#2a2a30', boots: '#1e1a18', hat: 'tophat', moustache: '#2a1a12', skin: '#f6e6d6' };
const MINER = { jacket: '#3e7a6a', pants: '#4a3a2a', boots: '#2a2018', hat: 'cap', cap: '#c89a3a', skin: '#f2d2b0' };
const fo = (f, seed, o) => ({ mode: 'stand', light: -2.1, seed, blink: blinkAt(f, seed), ...o });
const card = (T, key, o, opts, pos, extra = {}) => ({ key: key + JSON.stringify(opts), draw: (p) => T.bodyFront(p, o, opts), x: pos[0], y: pos[1], z: pos[2], ...extra });

const shot = (f) => (f < 90 ? 0 : f < 180 ? 1 : f < 270 ? 2 : 3);
const CAVE = { az: 100, el: 60, sky: '#7a6a5a', ground: '#3a2a1e', hemi: 0.22, sun: '#ffd8a8', sunI: 0.0, fog: '#1a120c', fogNear: 8, fogFar: 34,
  skyTop: '#1a120c', skyHor: '#1a120c', sat: 1.0, vig: 0.34, shadowExt: 20, exposure: 1.15, bloom: 0.5, cardTint: '#fff0e0' };
const DAY = { az: 40, el: 38, sky: '#bcd8f0', ground: '#8a6a48', hemi: 0.9, sun: '#fff0d8', sunI: 3.0, fog: '#d8e4ec', fogNear: 60, fogFar: 500,
  skyTop: '#3f7ad0', skyHor: '#cfe4f4', sat: 1.12, vig: 0.24, shadowExt: 30, exposure: 1.1 };

export default {
  TOTAL, build, look: 'rich',
  frame(f, k) {
    const s = shot(f), T = k.T, u = (f % 90) / 89;
    let cam, actors = [], dof = { focus: 3, cinf: 10 }, light = CAVE;
    if (s === 0) { // close-up: owner by the lantern table
      cam = { pos: [lerp(0.15, 0.0, u), 1.45, lerp(6.9, 6.4, u)], look: [-0.2, 1.25, 2.6], fov: 34 };
      actors.push(card(T, 'own', OWNER, fo(f, 3, { expr: f > 40 ? 'grin' : 'neutral', look: -0.3 }), [-0.35, 0, 3.1], { s: 0.95 }));
      dof = { focus: 3.6, cinf: 14 };
    } else if (s === 1) { // low angle down the tunnel, miner walks in
      cam = { pos: [0.2, 0.55, lerp(1.6, 0.6, u)], look: [0, 1.4, -10], fov: 40 };
      actors.push(card(T, 'min', MINER, fo(f, 9, { expr: 'shock', look: 0.2 }), [0.9, 0, -2.2], { s: 1 }));
      dof = { focus: 3.0, cinf: 9 };
    } else if (s === 2) { // insert: gold pan with nuggets
      cam = { pos: [lerp(-0.62, -0.7, u), lerp(1.42, 1.36, u), lerp(4.35, 4.2, u)], look: [-1.15, 0.86, 3.4], fov: 36 };
      dof = { focus: 1.15, cinf: 16, near: 0.6 }; light = { ...CAVE, bloom: 0.25 };
    } else { // outside, mine mouth with the sign
      light = DAY;
      cam = { pos: [60 + lerp(-1.0, 1.0, u), 1.7, 14.5], look: [60, 2.5, 1.5], fov: 44 };
      actors.push(card(T, 'own2', OWNER, fo(f, 3, { expr: 'grin' }), [61.2, 0, 7.0]), card(T, 'min2', MINER, fo(f, 9, { expr: 'neutral' }), [59.2, 0, 7.4]));
      dof = { focus: 5.6, cinf: 6 };
    }
    return { light, cam, dof, actors, fx: [] };
  },
};
