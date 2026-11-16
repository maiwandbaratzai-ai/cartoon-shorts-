// Author: Maiwand (github.com/maiwandbaratzai-ai) — cartoon-shorts
// Pose sheet: every acting pose in a grid, for checking shapes (frame = pose page).
import { blinkAt } from '../motion.js';
export const TOTAL = 4;
const MAN = { jacket: '#3e7a6a', pants: '#4a3a2a', boots: '#2a2018', hat: 'cap', cap: '#c89a3a', skin: '#f2d2b0' };
let NAMES = [];
export default {
  TOTAL, look: 'rich',
  build(K) { NAMES = Object.keys(K.T.POSES); K.slab(-30, 30, -0.1, 0, -30, 30, K.mat('plaster', '#d8d2c4'), K.scene, false); },
  frame(f, K) {
    const T = K.T, actors = [], per = 12, page = NAMES.slice(f * per, f * per + per);
    page.forEach((n, i) => {
      const A = T.act(40, [[0, 'idle'], [20, n]]);
      const x = (i % 4 - 1.5) * 1.7, y = 4.6 - Math.floor(i / 4) * 2.3;
      actors.push({ key: n + f, draw: (p) => { T.bodyFront(p, MAN, { ...A.opts, light: -2.1, seed: 5 + i, blink: false }); p.g.save(); p.g.fillStyle = '#c0392b'; p.g.font = 'bold 54px sans-serif'; p.g.textAlign = 'center'; p.g.fillText(n, 300, 60); p.g.restore(); },
        x, y: y + A.dy, z: 0, s: 0.85, sx: A.sx, sy: A.sy, blob: false, shadow: false });
    });
    return { light: { az: 120, el: 50, sky: '#ffffff', ground: '#ddd', hemi: 1.2, sun: '#fff', sunI: 1.5, skyTop: '#eef', skyHor: '#fff', fog: '#fff', fogNear: 100, fogFar: 300, exposure: 1.0, ao: 0, bloom: 0, ink: 0 },
      cam: { pos: [0, 3.3, 12], look: [0, 3.3, 0], fov: 50 }, dof: { focus: 12, cinf: 0 }, actors, fx: [] };
  },
};
