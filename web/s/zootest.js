// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// Test scene: 3D animals, detailed outfits, walking around obstacles (K.walkPath + K.solid), punch-in zoom.
import { blinkAt, lerp, clamp } from '../motion.js';
export const TOTAL = 300;
const TYPES = ['dog', 'cat', 'pig', 'cow', 'horse', 'sheep', 'bear', 'fox', 'rabbit', 'monkey', 'elephant', 'chicken', 'duck', 'pigeon'];
let A = [], FARMER, CHEF, COP, KID;
const FARM = { jacket: '#3a6ea5', pants: '#2c3e5a', boots: '#5a3a24', hat: 'cowboy', collar: '#f4efe4', belt: '#5a3a24', pockets: true, vest: '#8a5a34', scarf: '#c0392b' };
const CHEFO = { jacket: '#f2efe8', pants: '#2a2a30', boots: '#1e1a18', hat: 'chef', bowtie: '#c0392b', apron: '#ffffff', collar: false };
const COPO = { jacket: '#1f2a4a', pants: '#1f2a4a', boots: '#111', hat: 'police', tie: '#111', badge: true, belt: '#111', glasses: true };
const KIDO = { jacket: '#e84a5f', pants: '#3a6ea5', boots: '#f2f2f2', hairStyle: 'ponytail', hair: '#5a3a24', dress: '#e84a5f', build: 'kid' };
export default {
  TOTAL, look: 'rich',
  build(K) {
    K.slab(-40, 40, -0.1, 0, -40, 40, K.mat('dirt', '#b89060', { detail: 1.4 }), K.scene, false);
    const grass = K.mat('grime', '#6aa84f', { amt: 0.6 });
    K.slab(-40, 40, -0.09, 0.005, -40, -6, grass, K.scene, false);
    const barn = K.slab(-6, 6, 0, 4, -8, -6, K.mat('wood', '#a8322a', { detail: 1.6 })); barn.name = 'barn';
    for (let x = -9; x <= 9; x += 1.5) K.slab(x - 0.06, x + 0.06, 0, 1.1, 4.94, 5.06, K.mat('wood', '#e8dcc4'));
    K.slab(-9, 9, 0.7, 0.82, 4.96, 5.04, K.mat('wood', '#e8dcc4')); K.slab(-9, 9, 0.3, 0.42, 4.96, 5.04, K.mat('wood', '#e8dcc4'));
    const crate = K.mat('wood', '#c69a5c', { detail: 0.8 });
    for (const [x, z, n] of [[9.2, 2.2, 'crate A'], [6.5, 3.4, 'crate B'], [11.0, 3.6, 'hay bale']]) { const c = K.slab(x - 0.45, x + 0.45, 0, 0.8, z - 0.45, z + 0.45, n === 'hay bale' ? K.mat('fabric', '#e8c860', { detail: 0.3 }) : crate); c.name = n; K.solid(c); }
    A = TYPES.map((t, i) => K.animal(t, { seed: i }));
    FARMER = K.stick(FARM, { key: 'farmer' }); CHEF = K.stick(CHEFO, { key: 'chef' }); COP = K.stick(COPO, { key: 'cop' }); KID = K.stick(KIDO, { key: 'kid' });
    K.addClouds(10, 600, 150);
  },
  frame(f, K) {
    const T = K.T;
    // animals lined up in two rows
    A.forEach((a, i) => { const row = i < 7 ? 0 : 1, col = i % 7; const big = ['cow', 'horse', 'elephant', 'bear'].includes(a.type);
      a.set(f, { x: (col - 3) * 1.55 + (row ? 0.7 : 0), z: row ? -3.2 : -1.2, yaw: 0, mode: f < 150 ? (i % 3 === 0 ? 'walk' : i % 3 === 1 ? 'stand' : 'wag') : (i % 2 ? 'sit' : 'run'), look: 0.4 * Math.sin(f / 20 + i), expr: f > 220 ? 'shock' : 'happy', speed: 0.8, scale: big ? 0.8 : 1 }); });
    // the farmer walks a path around the crates (no walking through objects)
    const W = K.walkPath(f, 60, [[5.0, 4.4], [5.4, 2.3], [8.0, 2.3], [8.0, 1.0], [10.5, 0.8], [11.2, 2.0]], 1.3, { endYaw: 0 });
    const keys = [[0, 'idle'], [20, 'walk'], [W.done ? f - 1 : 9999, 'wave', { talk: true, expr: 'grin' }]];
    FARMER.set(T.act(f, W.moving ? [[0, 'walk', { expr: 'smile' }]] : W.done ? [[0, 'wave', { talk: true, expr: 'grin' }], [222, 'shock', { expr: 'scared' }]] : [[0, 'idle']], { seed: 1, blink: blinkAt(f, 1) }), { x: W.x, z: W.z, yaw: W.done ? 0 : W.yaw });
    CHEF.set(T.act(f, [[0, 'hips', { expr: 'proud' }], [120, 'show', { R: [0.42, -0.6, 'food'], expr: 'excited' }], [220, 'panic', { expr: 'scared' }]], { seed: 2, blink: blinkAt(f, 2) }), { x: 6.2, z: 1.0 });
    COP.set(T.act(f, [[0, 'cross', { expr: 'stern' }], [100, 'stop', { expr: 'yell', talk: true }], [220, 'facepalm', { expr: 'sad' }]], { seed: 3, blink: blinkAt(f, 3) }), { x: 7.2, z: 0.2 });
    KID.set(T.act(f, [[0, 'wave', { expr: 'excited' }], [90, 'celebrate'], [220, 'shock', { expr: 'scared' }]], { seed: 4, blink: blinkAt(f, 4) }), { x: 9.8, z: -0.4 });
    if (f > 60) K.puff(f, 60 + Math.floor((f - 60) / 12) * 12, 5.2, 3.0, 6);
    // shots: wide on animals -> people -> punch-in on the shock beat
    let cam;
    if (f < 100) cam = { pos: [lerp(-5.5, 4.5, f / 100), 1.4, 2.6], look: [lerp(-4.5, 5, f / 100), 0.5, -2.2], fov: 46 };
    else if (f < 200) cam = { pos: [lerp(7.4, 8.4, (f - 100) / 100), 2.6, 7.4], look: [lerp(7.4, 8.6, (f - 100) / 100), 0.6, 1.4], fov: 52 };
    else cam = { pos: [7.6, 1.5, 4.2], look: [7.4, 1.25, 0.4], fov: 40 * K.punch(f, 222, 0.32, 6) };
    return { light: { az: 35, el: 42, sky: '#cfe4f4', ground: '#b89060', hemi: 1.0, sun: '#fff1d8', sunI: 3.2, skyTop: '#3f7ad0', skyHor: '#d6eaf8', fog: '#dceaf4', fogNear: 40, fogFar: 300, shadowExt: 14, ink: 0.55 },
      cam, dof: { focus: Math.hypot(cam.pos[0] - cam.look[0], cam.pos[2] - cam.look[2]), cinf: 6 }, actors: [], fx: [] };
  },
};
