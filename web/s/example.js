// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// 10-second example of the 2026-11-18 rules: strange action in frame 1 + paradox line, a new moving shot every ~2 s
// (never reused), push-ins, shake on the creak, punch-in on "sagged", dust puffs, blurred foreground layer,
// real 3D elephants + detailed stick outfits, faces matching each line, white key-word captions, loop ending.
import { TOTAL, LINES, wf } from './example_timing.js';
import { blinkAt, lerp, clamp } from '../motion.js';
export { TOTAL };

let E = [], DECK, CROWD = [], BARNUM, ENG;
const DY = 0; // deck top height
const sm = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const OUT = [
  { jacket: '#3a6ea5', pants: '#2c3e5a', hat: 'beanie', hatColor: '#c0392b', scarf: '#f2c230', collar: '#f4efe4' },
  { jacket: '#7a4a8a', pants: '#2a2a30', hairStyle: 'bun', hair: '#5a3a24', dress: '#7a4a8a', collar: '#f4efe4', glasses: true },
  { jacket: '#4a7a3a', pants: '#3a2a1e', hat: 'cap', cap: '#e08a2a', vest: '#8a5a34', belt: '#3a2418' },
  { jacket: '#c0632a', pants: '#2c3e5a', hairStyle: 'curly', hair: '#2a1a12', tie: '#1f2a4a', pockets: true },
  { jacket: '#2a6a7a', pants: '#3a3a40', hat: 'cowboy', scarf: '#c0392b', belt: '#5a3a24' },
  { jacket: '#d8a830', pants: '#4a3a2a', hairStyle: 'ponytail', hair: '#8a4a24', apron: '#f4efe4', collar: false },
];
export default {
  TOTAL, look: 'rich',
  build(K) {
    const { THREE } = K;
    // banks + river far below
    K.slab(-60, -6, -0.2, 0, -60, 30, K.mat('grime', '#6aa84f', { amt: 0.6 }), K.scene, false);
    K.slab(6, 60, -0.2, 0, -60, 30, K.mat('grime', '#6aa84f', { amt: 0.6 }), K.scene, false);
    K.slab(-60, 60, -6.2, -6, -60, 30, K.mat('grime', '#3a7ab8', { amt: 0.4, roughness: 0.2 }), K.scene, false);
    for (const sx of [-1, 1]) K.slab(sx * 6 - 0.5, sx * 6 + 0.5, -6, 0, -30, 30, K.mat('rock', '#9a8a78'), K.scene, false);
    // the deck (moves as one group so it can sag)
    DECK = K.group();
    K.slab(-7, 7, -0.25, 0, -1.4, 1.4, K.mat('wood', '#9a6a3a', { detail: 1.2 }), DECK);
    for (const z of [-1.35, 1.35]) { K.slab(-7, 7, 0.75, 0.85, z - 0.05, z + 0.05, K.mat('wood', '#6a4428'), DECK); for (let x = -7; x <= 7; x += 1) K.slab(x - 0.04, x + 0.04, 0, 0.85, z - 0.04, z + 0.04, K.mat('wood', '#6a4428'), DECK); }
    // stone towers + cables
    const stone = K.mat('brick', '#b8a890', { detail: 1.6 });
    for (const x of [-5.2, 5.2]) for (const z of [-1.7, 1.7]) K.slab(x - 0.35, x + 0.35, -6, 7, z - 0.35, z + 0.35, stone);
    for (const x of [-5.2, 5.2]) K.slab(x - 0.35, x + 0.35, 6, 6.6, -2.05, 2.05, stone);
    const steel = K.mat('metal', '#3a3a42', { roughness: 0.5 });
    for (const z of [-1.55, 1.55]) {
      const pts = []; for (let i = 0; i <= 40; i++) { const x = -5.2 + 10.4 * i / 40; pts.push(new THREE.Vector3(x, 6.8 - 6.0 * (1 - Math.pow((x / 5.2), 2)) * 0.95, z)); }
      K.add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.05, 8), steel, 0, 0, 0);
      for (let x = -4.5; x <= 4.5; x += 0.75) { const y = 6.8 - 6.0 * (1 - Math.pow(x / 5.2, 2)) * 0.95; K.cyl(0.015, 0.015, y - 0.85, steel, x, 0.85, z, DECK); }
    }
    // city skyline + flags + clouds behind
    for (let i = 0; i < 26; i++) { const x = -60 + i * 4.8, h = 6 + ((i * 37) % 11), z = -45 - (i % 3) * 6; K.slab(x - 1.8, x + 1.8, 0, h, z - 1.8, z + 1.8, K.mat(i % 2 ? 'brick' : 'plaster', ['#c98a6a', '#d8c8a8', '#a86a5a', '#e0d0b0'][i % 4])); }
    for (const x of [-5.2, 5.2]) { K.cyl(0.03, 0.03, 1.4, steel, x, 6.6, 0); K.add(new THREE.PlaneGeometry(0.8, 0.5), K.toon({ color: '#c0392b', plain: true, side: THREE.DoubleSide }), x + 0.42, 7.7, 0); }
    K.addClouds(12, 700, 170);
    E = [0, 1, 2].map((i) => K.animal('elephant', { seed: i, scale: 0.9 }));
    CROWD = OUT.map((o, i) => K.stick(o, { key: 'c' + i }));
    BARNUM = K.stick({ jacket: '#a8322a', pants: '#2a2a30', hat: 'tophat', moustache: '#2a1a12', bowtie: '#f2c230', vest: '#f2e2c0', belt: '#1a1a1a' }, { key: 'barnum' });
  },
  frame(f, K) {
    const T = K.T;
    const CRE = wf(2, 'creaked'), SAG = wf(2, 'sagged'), HELD = wf(3, 'held'), COL = wf(1, 'collapse');
    // deck sag on "sagged", springs back on "held"
    const sag = -0.32 * sm(SAG - 6, SAG + 8, f) * (1 - sm(HELD, HELD + 14, f)) + (f > HELD ? -0.05 * Math.sin((f - HELD) * 0.5) * Math.exp(-(f - HELD) / 15) : 0);
    DECK.position.y = sag;
    // elephants walk across the deck in a line (stay on the deck: z = 0)
    const ex = E.map((e, i) => -4.6 - i * 2.7 + (f / 30) * 0.75);   // the lead elephant is already on the planks in frame 1
    E.forEach((e, i) => e.set(f, { x: ex[i], y: ex[i] > -6.5 && ex[i] < 6.5 ? sag : 0, z: 0, yaw: Math.PI / 2, mode: 'walk', speed: 0.8, expr: f > SAG && f < HELD ? 'shock' : 'happy', look: 0.2 * Math.sin(f / 25 + i) }));
    // heavy footsteps raise dust (every ~0.35 s, alternating feet)
    for (let i = 0; i < 3; i++) { const st = Math.floor(f / 11) * 11; K.puff(f, st, ex[i] + 0.4, (Math.floor(f / 11) % 2 ? 0.3 : -0.3), 5, 0.3, '#cdb898'); }
    // crowd on the near bank: worried -> scream -> cover eyes -> cheer
    CROWD.forEach((c, i) => {
      const keys = [[0, 'pointUp', { expr: 'confused' }], [COL - 4 - i, 'panic', { expr: 'scared', talk: i === 1 }], [SAG - 3, 'ears', { expr: 'scared' }], [HELD + i, 'cheer', { expr: 'excited' }]];
      c.set(T.act(f, keys, { seed: 10 + i, blink: blinkAt(f, 10 + i) }), { x: -9.2 + (i % 3) * 0.9, z: 2.6 + Math.floor(i / 3) * 0.9, yaw: 0.9 });
    });
    BARNUM.set(T.act(f, [[0, 'point', { expr: 'grin' }], [COL, 'hips', { expr: 'grin', sweat: true }], [SAG, 'shock', { expr: 'nervous' }], [HELD - 2, 'show', { expr: 'proud', talk: true }]], { seed: 3, blink: blinkAt(f, 3) }), { x: -7.6, z: -1.6, yaw: 1.2 });
    // ---- shots: a new, moving shot every ~2 s, none reused ----
    const L = LINES; let cam, dof, u;
    const sh = (a, b) => (u = clamp((f - a) / (b - a), 0, 1), f >= a && f < b);
    const lead = ex[0];
    if (sh(0, 45)) {            // 1. strange action: an elephant's foot on a brand-new bridge (push-in)
      cam = { pos: [lead + 1.4, 0.45 + sag, 1.7], look: [lead + 0.35, 0.35 + sag, 0.1], fov: 38 * K.push(u, 0.12) }; dof = { focus: 1.8, cinf: 16 };
    } else if (sh(45, L[1][0] - 4)) { // 2. wide: the whole line of elephants, pan with them
      const tc = K.track(f, (g) => [-4.6 + (g / 30) * 0.75, 0, 0], { off: [3.8, 2.8, 11], lag: 8, lookY: 1.0 }); // camera follows the herd
      cam = { pos: tc.pos, look: tc.look, fov: 44 }; dof = { focus: 11, cinf: 4 };
    } else if (sh(L[1][0] - 4, L[2][0] - 2)) { // 3. crowd screaming, over a blurred rope in the foreground
      cam = { pos: [-6.6, 1.45, 4.6], look: [-8.6, 1.35, 3.0], fov: 40 * K.push(u, 0.1) }; dof = { focus: 2.6, cinf: 12 };
    } else if (sh(L[2][0] - 2, SAG - 4)) { // 4. cable close-up, creak + shake
      const [sx, sy] = K.shake(f, CRE, 0.05, 14);
      cam = { pos: [lerp(-1.2, -0.9, u) + sx, 2.4 + sy, 3.6], look: [-2.2, 1.9, 1.5], fov: 38 }; dof = { focus: 2.4, cinf: 12 };
    } else if (sh(SAG - 4, L[3][0] - 2)) { // 5. from below: the deck sags (punch-in on "sagged")
      cam = { pos: [lerp(-1.5, -0.8, u), -3.6, 6.5], look: [0, -0.2, 0], fov: 42 * K.punch(f, SAG, 0.28, 6) }; dof = { focus: 7, cinf: 5 };
    } else if (sh(L[3][0] - 2, HELD + 30)) { // 6. Barnum, proud: "it held"
      cam = { pos: [lerp(-5.8, -6.0, u), 1.55, -0.2], look: [-7.6, 1.3, -1.6], fov: 34 * K.push(u, 0.1) }; dof = { focus: 2.3, cinf: 14 };
    } else {                    // 7. back to an elephant's foot on the bridge -> loops into shot 1
      const [sx] = K.shake(f, HELD + 31, 0.02, 6);
      cam = { pos: [lead + 1.5 + sx, 0.5 + sag, 1.8], look: [lead + 0.35, 0.4 + sag, 0.1], fov: 40 * K.push(u, 0.12) }; dof = { focus: 1.9, cinf: 16 };
    }
    return { light: { az: 145, el: 34, sky: '#cfe4f4', ground: '#6aa84f', hemi: 1.0, sun: '#fff1d8', sunI: 3.3, skyTop: '#3f7ad0', skyHor: '#e8d8c8',
      fog: '#dce6ee', fogNear: 30, fogFar: 260, shadowExt: 16, ink: 0.55 }, cam, dof, actors: [], fx: [] };
  },
};
