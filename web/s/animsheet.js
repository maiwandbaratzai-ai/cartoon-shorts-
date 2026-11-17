// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// Animal check sheet: frame n shows animal n in a 3/4 view (frames 0-13 stand, 14-27 walk, 28-41 sit/run).
export const TOTAL = 42;
const TYPES = ['dog', 'cat', 'pig', 'cow', 'horse', 'sheep', 'bear', 'fox', 'rabbit', 'monkey', 'elephant', 'chicken', 'duck', 'pigeon'];
let A = [];
export default { TOTAL, look: 'rich',
  build(K) { K.slab(-20, 20, -0.1, 0, -20, 20, K.mat('grime', '#7ab05a'), K.scene, false); A = TYPES.map((t, i) => K.animal(t, { seed: i })); },
  frame(f, K) {
    const i = f % 14, m = f < 14 ? 'stand' : f < 28 ? 'walk' : (i % 2 ? 'sit' : 'run');
    A.forEach((a, j) => a.set(f * 7, { x: 0, z: 0, yaw: 1.15, mode: m, expr: 'happy', visible: j === i }));
    const big = { cow: 1.5, horse: 1.8, elephant: 2.6, bear: 1.5 }[TYPES[i]] || 1;
    return { light: { az: 30, el: 45, sky: '#cfe4f4', ground: '#7ab05a', hemi: 1.0, sun: '#fff1d8', sunI: 3, skyTop: '#3f7ad0', skyHor: '#d6eaf8', fog: '#dceaf4', fogNear: 40, fogFar: 300, shadowExt: 6, ink: 0.55 },
      cam: { pos: [1.2 * big, 0.7 * big, 2.4 * big], look: [0, 0.35 * big, 0], fov: 40 }, dof: { focus: 2.7 * big, cinf: 0 }, actors: [], fx: [] };
  } };
