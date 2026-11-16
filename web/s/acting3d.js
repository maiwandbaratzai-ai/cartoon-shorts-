// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// 3D acting demo: real 3D stick characters (K.stick) act out the narration on the word (T.act + wf).
import LD from './lookdev.js';
import { TOTAL, LINES, wf } from './acting_timing.js';
let JOE3, BOSS3;
import { blinkAt, lerp, clamp } from '../motion.js';

export { TOTAL };
const OWNER = { jacket: '#f2ece0', pants: '#2a2a30', boots: '#1e1a18', hat: 'tophat', moustache: '#2a1a12', skin: '#f6e6d6' };
const JOE = { jacket: '#3e7a6a', pants: '#4a3a2a', boots: '#2a2018', hat: 'cap', cap: '#c89a3a', skin: '#f2d2b0' };
const CAVE = { az: 100, el: 60, sky: '#7a6a5a', ground: '#3a2a1e', hemi: 0.3, sun: '#ffd8a8', sunI: 0.0, fog: '#1a120c', fogNear: 8, fogFar: 34,
  skyTop: '#1a120c', skyHor: '#1a120c', sat: 1.04, vig: 0.32, shadowExt: 20, exposure: 1.25, bloom: 0.45, cardTint: '#fff0e0' };

// one acting character -> actor object for the frame
const SHOWN = new Set();
const actor = (T, f, o, name, seed, keys, pos, extra = {}) => {
  const A = T.act(f, keys, { seed, blink: blinkAt(f, seed) });
  const rig = name === 'joe' ? JOE3 : BOSS3; SHOWN.add(rig);
  rig.set(A, { x: pos[0], y: pos[1], z: pos[2], yaw: extra.yaw ?? 0 });
  return null;
};

export default {
  TOTAL, look: 'rich',
  build(K) { LD.build(K); JOE3 = K.stick(JOE, { key: 'joe' }); BOSS3 = K.stick(OWNER, { key: 'boss' }); },
  frame(f, K) {
    const T = K.T, L = LINES, out = []; SHOWN.clear();
    const GOLD = wf(1, 'gold'), HIT = wf(1, 'hit'), SPR = wf(2, 'sprinted'), CNT = wf(3, 'counted'), GRIN = wf(3, 'grinning'), KEPT = wf(4, 'kept');
    // Joe's whole performance, keyed to the spoken words
    const joeKeys = [[0, 'dig'], [HIT - 4, 'shock'], [GOLD, 'celebrate'], [SPR - 6, 'run'],
      [L[3][0] - 4, 'hips', { expr: 'smile' }], [GRIN, 'clap'], [KEPT, 'shock'], [KEPT + 14, 'facepalm'], [KEPT + 40, 'angry']];
    const bossKeys = [[0, 'cross'], [CNT, 'hold', { R: [0.3, 0.38, 'moneybag'] }], [GRIN, 'show', { R: [0.42, -0.6, 'moneybag'], expr: 'laugh' }],
      [KEPT, 'hips', { expr: 'grin' }], [KEPT + 30, 'wave', { expr: 'grin' }]];
    let cam, dof = { focus: 3, cinf: 12 };
    if (f < GOLD + 2 || (f >= GOLD + 20 && f < SPR - 6)) { // Joe digging, then the strike
      const u = clamp(f / 130, 0, 1);
      cam = { pos: [lerp(-0.3, 0.1, u), 1.25, lerp(1.9, 1.5, u)], look: [0.75, 1.05, -1.4], fov: 38 };
      out.push(actor(T, f, JOE, 'joe', 9, joeKeys, [0.8, 0, -1.4]));
      dof = { focus: 3.2, cinf: 14 };
    } else if (f < GOLD + 20) { // insert: the gold
      cam = { pos: [-0.66, 1.4, 4.28], look: [-1.15, 0.86, 3.4], fov: 36 }; dof = { focus: 1.15, cinf: 18 };
    } else if (f < L[3][0] - 4) { // he sprints down the tunnel toward the camera
      const u = clamp((f - SPR + 6) / (L[3][0] - SPR + 2), 0, 1);
      cam = { pos: [0.4, 1.0, lerp(2.6, 3.2, u)], look: [0.7, 1.3, -5], fov: 40, roll: f - SPR < 4 ? (4 - (f - SPR)) * 3 : 0 };
      out.push(actor(T, f, JOE, 'joe', 9, joeKeys, [0.75, 0, lerp(-6.5, 0.3, u)]));
      dof = { focus: lerp(9, 2.9, u), cinf: 8 };
    } else { // the boss at his table, Joe beside him
      const u = clamp((f - L[3][0]) / 160, 0, 1), sh = f < KEPT ? 0 : f < KEPT + 14 ? 1 : f < KEPT + 40 ? 2 : 0;
      cam = sh === 1 ? { pos: [-0.8, 1.55, 5.6], look: [-0.95, 1.45, 3.05], fov: 32 }          // boss close-up: "kept all of it"
        : sh === 2 ? { pos: [0.45, 1.5, 5.8], look: [0.35, 1.45, 3.3], fov: 32 }                // Joe's reaction close-up
        : { pos: [lerp(0.5, 0.3, u), 1.5, lerp(8.4, 8.0, u)], look: [-0.3, 1.15, 3.1], fov: 36 };
      out.push(actor(T, f, OWNER, 'boss', 3, bossKeys, [-0.95, 0, 3.05], { s: 0.95 }));
      out.push(actor(T, f, JOE, 'joe', 9, joeKeys, [0.35, 0, 3.3]));
      dof = { focus: 3.6, cinf: 13 };
    }
    for (const r of [JOE3, BOSS3]) if (!SHOWN.has(r)) r.root.visible = false;
    return { light: { ...CAVE, ink: 0.55 }, cam, dof, actors: out.filter(Boolean), fx: [] };
  },
};
